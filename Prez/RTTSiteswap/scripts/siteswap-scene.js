/**
 * <siteswap-scene pattern="531"></siteswap-scene>
 *
 * Vue "ça prend vie" : le diagramme en échelle et un jongleur fil de fer
 * côte à côte, animés en temps réel sur UNE SEULE horloge partagée, avec
 * lecture/pause et vitesse réglable (ralenti). Contrairement à
 * <siteswap-diagram> (statique, isolation d'une balle au clic), ici toutes
 * les balles sont animées ensemble pour montrer le motif complet en action.
 *
 * Portée volontaire : siteswaps asynchrones simples (cf. siteswap-core.js).
 *
 * Attributs :
 *  - pattern  (obligatoire) : ex. "3", "531", "441"
 *  - speed    (optionnel)   : vitesse initiale, parmi 0.25 / 0.5 / 1 (def. 1)
 *  - autoplay (optionnel)   : démarre la lecture automatiquement
 *
 * Clic sur le panneau échelle : met une balle en avant (les autres
 * s'estompent) sans interrompre la lecture en cours ; un clic de plus sur
 * la dernière balle revient à la vue d'ensemble.
 */

import { BALL_PALETTE, decodeSiteswap, simulateBalls, cycleLength, activeFlights } from './siteswap-core.js';

const BEATS_PER_SECOND = 1.8;
const SPEEDS = [0.25, 0.5, 1];

// --- Géométrie du panneau "échelle" (compacte) ---
const LADDER_COL_WIDTH = 90;
const LADDER_MARGIN_X = 50;
const LADDER_ROW_GAP = 100;
const LADDER_BOTTOM = 50;

// --- Géométrie du panneau "jongleur" ---
// Buste décalé vers le bas : laisse de la place au-dessus de la tête pour
// les grands lancers (hauteur ∝ valeur², cf. peakHeightFor()).
const FIG = {
    width: 360,
    height: 460,
    headR: 26,
    headY: 130,
    shoulderY: 168,
    hipY: 286,
    handY: 306,
    handXL: 110,
    handXR: 250,
    legSpread: 55,
    legY: 436,
    foreArmR: 42, // rayon du cercle décrit par la main autour du coude (= longueur de l'avant-bras)
};

/**
 * Hauteur d'un lancer : physiquement, le temps de vol d'un lancer de valeur
 * v est proportionnel à v (un beat = une durée fixe), et sous gravité
 * constante la hauteur de l'arc est proportionnelle au CARRÉ du temps de
 * vol — un 5 doit dominer très nettement un 3, comme en vrai jonglage.
 * Calibré à vue sur un jongleur réel : un 3 arrive à peu près à hauteur de
 * tête, un 5 beaucoup plus haut. Saturation douce (exponentielle) au-delà
 * pour que les très grands lancers (7, 9...) restent dans le cadre au lieu
 * de l'exploser, plutôt qu'un écrêtage brutal.
 */
function peakHeightFor(value, cap = 280, softness = 7.04) {
    return cap * (1 - Math.exp(-(value * value) / softness));
}

/**
 * Position fixe du coude : le bras haut ne bouge pas (comme dans les
 * animateurs de siteswap de référence), seul l'avant-bras pivote autour de
 * ce point fixe. Placé pour que la main, au repos (phase=0, l'instant
 * précis d'un lancer/réception), tombe exactement sur l'ancien point de
 * main fixe (handXL/handXR, handY).
 */
function elbowFor(baseX) {
    return { x: baseX, y: FIG.handY - FIG.foreArmR };
}

/**
 * Trajectoire "moulin" de la main : un cercle de rayon fixe (la longueur
 * de l'avant-bras) autour du coude, immobile. La main est au point bas du
 * cercle (sous le coude) pile à l'instant où elle reçoit/relance, puis
 * balaie tout le cercle sur le cycle de 2 temps de cette main.
 *
 * dir=-1 (main droite) : sens des aiguilles d'une montre.
 * dir=+1 (main gauche) : sens inverse — effet moulin "en miroir" entre les
 * deux mains, chacune balayant vers l'extérieur du corps en remontant.
 */
function handOnCircle(t, parity, elbow, dir) {
    const phase = (((t - parity) % 2) + 2) % 2; // 0..2 : un cycle complet de cette main
    const angle = phase * Math.PI; // 0..2π
    return {
        x: elbow.x + dir * FIG.foreArmR * Math.sin(angle),
        y: elbow.y + FIG.foreArmR * Math.cos(angle),
    };
}

function cubicPoint(p, x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
    const u = 1 - p;
    const x = u * u * u * x1 + 3 * u * u * p * cx1 + 3 * u * p * p * cx2 + p * p * p * x2;
    const y = u * u * u * y1 + 3 * u * u * p * cy1 + 3 * u * p * p * cy2 + p * p * p * y2;
    return { x, y };
}

function plateauControls(x1, y1, x2, y2, peak) {
    const dx = x2 - x1;
    const lift = Math.min(Math.abs(dx) / 2, LADDER_COL_WIDTH * 0.45);
    return {
        cx1: x1 + Math.sign(dx) * lift,
        cy1: peak,
        cx2: x2 - Math.sign(dx) * lift,
        cy2: peak,
    };
}

class SiteswapScene extends HTMLElement {
    static get observedAttributes() {
        return ['pattern'];
    }

    constructor() {
        super();
        this._time = 0;
        this._playing = false;
        this._speed = 1;
        this._activeBall = -1;
        this._lastTs = null;
        this._raf = null;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const initialSpeed = Number(this.getAttribute('speed'));
        if (SPEEDS.includes(initialSpeed)) this._speed = initialSpeed;
        if (this.hasAttribute('autoplay')) this._playing = true;
        this._build();
        this._raf = requestAnimationFrame((ts) => this._tick(ts));
    }

    disconnectedCallback() {
        if (this._raf) cancelAnimationFrame(this._raf);
    }

    attributeChangedCallback(name) {
        if (name === 'pattern' && this.shadowRoot && this.shadowRoot.firstChild) {
            this._time = 0;
            this._build();
        }
    }

    _tick(now) {
        if (this._lastTs === null) this._lastTs = now;
        const dt = Math.min(0.05, (now - this._lastTs) / 1000);
        this._lastTs = now;
        if (this._playing && this._model) {
            this._time += dt * this._speed * BEATS_PER_SECOND;
            this._updateFrame();
        }
        this._raf = requestAnimationFrame((ts) => this._tick(ts));
    }

    _togglePlay() {
        this._playing = !this._playing;
        this._lastTs = null;
        this._renderControls();
    }

    _setSpeed(s) {
        this._speed = s;
        this._renderControls();
    }

    /** Construit le modèle (décodage + simulation) puis le DOM une seule fois. */
    _build() {
        const pattern = this.getAttribute('pattern') || '';
        this.shadowRoot.innerHTML = `<style>${this._css()}</style>`;

        let values;
        try {
            values = decodeSiteswap(pattern);
        } catch (err) {
            const p = document.createElement('p');
            p.className = 'error';
            p.textContent = `Siteswap invalide (${pattern}) : ${err.message}`;
            this.shadowRoot.appendChild(p);
            this._model = null;
            return;
        }

        const period = values.length;
        const maxValue = Math.max(0, ...values);
        const { ballByBeat: staticBallByBeat, ballCount } = simulateBalls(values);
        const cycle = cycleLength(period, maxValue);
        const { ballByBeat: cycleBallByBeat } = simulateBalls(values, cycle);

        this._model = { pattern, values, period, maxValue, ballCount, staticBallByBeat, cycleBallByBeat, cycle };

        this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="scene">
        <div class="panel panel-ladder">
          <svg class="ladder" viewBox="0 0 ${this._ladderWidth()} ${this._ladderHeight()}"
               preserveAspectRatio="xMidYMid meet" role="img" aria-label="Échelle du siteswap ${pattern}">
            ${this._ladderStaticSvg()}
            ${Array.from({ length: ballCount })
                .map((_, b) => `<circle class="ball ball-${b}" r="10" style="--c:${BALL_PALETTE[b % BALL_PALETTE.length]}" />`)
                .join('')}
          </svg>
        </div>
        <div class="panel panel-juggler">
          <svg class="juggler" viewBox="0 0 ${FIG.width} ${FIG.height}"
               preserveAspectRatio="xMidYMid meet" role="img" aria-label="Jongleur fil de fer">
            ${this._jugglerStaticSvg()}
            ${Array.from({ length: ballCount })
                .map((_, b) => `<circle class="ball ball-${b}" r="13" style="--c:${BALL_PALETTE[b % BALL_PALETTE.length]}" />`)
                .join('')}
          </svg>
        </div>
      </div>
      <div class="controls">
        <button class="play" type="button" aria-label="Lecture / pause"></button>
        <div class="speeds"></div>
        <span class="meta">${pattern} · ${ballCount} balle${ballCount > 1 ? 's' : ''}</span>
        <span class="hint">clic sur l'échelle : mettre une balle en avant</span>
      </div>
    `;

        this.shadowRoot.querySelector('.play').addEventListener('click', () => this._togglePlay());
        this.shadowRoot.querySelector('.ladder').addEventListener('click', () => this._cycleActiveBall());
        const speedsEl = this.shadowRoot.querySelector('.speeds');
        SPEEDS.forEach((s) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = `${s}×`;
            btn.addEventListener('click', () => this._setSpeed(s));
            speedsEl.appendChild(btn);
        });

        this._renderControls();
        this._applyActiveBallStyling();
        this._updateFrame();
    }

    /** Cycle -1 (vue d'ensemble) -> 0 -> 1 -> ... -> ballCount-1 -> -1. */
    _cycleActiveBall() {
        if (!this._model) return;
        this._activeBall += 1;
        if (this._activeBall >= this._model.ballCount) this._activeBall = -1;
        this._applyActiveBallStyling();
        this._updateFrame(); // reflète tout de suite la nouvelle balle en avant, même à l'arrêt
    }

    /** Estompe les arcs/mains statiques qui ne correspondent pas à la balle mise en avant. */
    _applyActiveBallStyling() {
        const active = this._activeBall;
        const none = active < 0;
        this.shadowRoot.querySelectorAll('.ladder .arc').forEach((el) => {
            const raw = el.dataset.ball;
            const ballId = raw === '' ? null : Number(raw);
            const isActive = !none && ballId === active;
            const isDimmed = !none && ballId !== active;
            el.style.opacity = isActive ? 1 : isDimmed ? 0.12 : 0.35;
            el.style.strokeWidth = isActive ? 5 : 3;
        });
        this.shadowRoot.querySelectorAll('.ladder .beat').forEach((g) => {
            const raw = g.dataset.ball;
            const ballId = raw === '' ? null : Number(raw);
            const isDimmed = !none && ballId !== active;
            g.style.opacity = isDimmed ? 0.25 : '';
        });
    }

    _ladderWidth() {
        const echo = Math.min(Math.max(this._model ? this._model.maxValue : 1, 1), 10);
        return LADDER_MARGIN_X * 2 + (this._model.period + echo - 1) * LADDER_COL_WIDTH;
    }

    _ladderHeight() {
        const topPad = 30 + (this._model ? this._model.maxValue : 0) * 14;
        return topPad + LADDER_ROW_GAP + LADDER_BOTTOM;
    }

    _ladderY(col, topPad) {
        return col % 2 === 0 ? topPad : topPad + LADDER_ROW_GAP;
    }

    _ladderStaticSvg() {
        const { period, maxValue, values, staticBallByBeat } = this._model;
        const topPad = 30 + maxValue * 14;
        const yG = topPad;
        const yD = topPad + LADDER_ROW_GAP;
        const width = this._ladderWidth();
        const x = (col) => LADDER_MARGIN_X + col * LADDER_COL_WIDTH;
        const echo = Math.min(Math.max(maxValue, 1), 10);
        const windowSize = period + echo;

        let svg = `<line class="baseline" x1="${LADDER_MARGIN_X - 20}" y1="${yG}" x2="${width - LADDER_MARGIN_X + 20}" y2="${yG}" />`;
        svg += `<line class="baseline" x1="${LADDER_MARGIN_X - 20}" y1="${yD}" x2="${width - LADDER_MARGIN_X + 20}" y2="${yD}" />`;

        for (let i = 0; i < period; i += 1) {
            const value = values[i];
            if (value <= 0) continue;
            const landing = i + value;
            const x1 = x(i);
            const y1 = i % 2 === 0 ? yG : yD;
            const x2 = x(landing);
            const y2 = landing % 2 === 0 ? yG : yD;
            const peak = Math.min(yG, yD) - (16 + value * 14) - maxValue * 1.5;
            const { cx1, cy1, cx2, cy2 } = plateauControls(x1, y1, x2, y2, peak);
            const ballId = staticBallByBeat[i];
            const color = ballId === null ? '#9e9e9e' : BALL_PALETTE[ballId % BALL_PALETTE.length];
            svg += `<path class="arc" data-ball="${ballId === null ? '' : ballId}" d="M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}" style="--c:${color}" />`;
        }

        for (let col = 0; col < windowSize; col += 1) {
            const cy = col % 2 === 0 ? yG : yD;
            const cx = x(col);
            const isEcho = col >= period;
            const ballId = staticBallByBeat[col % period];
            const color = ballId === null ? 'none' : BALL_PALETTE[ballId % BALL_PALETTE.length];
            const hand = col % 2 === 0 ? 'G' : 'D';
            svg += `<g class="beat ${isEcho ? 'echo' : ''}" data-ball="${ballId === null ? '' : ballId}">
        <circle cx="${cx}" cy="${cy}" r="16" fill="${color === 'none' ? 'none' : color}" class="${color === 'none' ? 'hand-empty' : 'hand'}" />
        <text x="${cx}" y="${cy}" class="hand-label">${hand}</text>
      </g>`;
        }
        return svg;
    }

    _jugglerStaticSvg() {
        const cx = FIG.width / 2;
        const elbowL = elbowFor(FIG.handXL);
        const elbowR = elbowFor(FIG.handXR);
        return `
      <circle class="body" cx="${cx}" cy="${FIG.headY}" r="${FIG.headR}" />
      <line class="body" x1="${cx}" y1="${FIG.headY + FIG.headR}" x2="${cx}" y2="${FIG.hipY}" />
      <line class="body" x1="${cx}" y1="${FIG.hipY}" x2="${cx - FIG.legSpread}" y2="${FIG.legY}" />
      <line class="body" x1="${cx}" y1="${FIG.hipY}" x2="${cx + FIG.legSpread}" y2="${FIG.legY}" />
      <!-- Bras haut : fixe, dessiné une seule fois (ne bouge jamais). -->
      <line class="arm" x1="${cx}" y1="${FIG.shoulderY}" x2="${elbowL.x}" y2="${elbowL.y}" />
      <line class="arm" x1="${cx}" y1="${FIG.shoulderY}" x2="${elbowR.x}" y2="${elbowR.y}" />
      <circle class="elbow" cx="${elbowL.x}" cy="${elbowL.y}" r="5" />
      <circle class="elbow" cx="${elbowR.x}" cy="${elbowR.y}" r="5" />
      <!-- Avant-bras : pivote chaque frame autour du coude fixe. -->
      <line class="arm fore-L" />
      <line class="arm fore-R" />
      <circle class="hand hand-L" r="10" />
      <circle class="hand hand-R" r="10" />
    `;
    }

    /**
     * Pose des avant-bras (pivot autour du coude fixe) + mains, rejouée chaque
     * frame y compris à l'arrêt. Renvoie la position courante de chaque main
     * (par parité) pour que les balles tenues ("2") puissent s'y accrocher.
     */
    _updateArms(t) {
        const hands = [
            { side: 'L', handX: FIG.handXL, parity: 0, dir: 1 },
            { side: 'R', handX: FIG.handXR, parity: 1, dir: -1 },
        ];
        const positions = {};
        hands.forEach((h) => {
            const elbow = elbowFor(h.handX);
            const pos = handOnCircle(t, h.parity, elbow, h.dir);
            positions[h.parity] = pos;
            const fore = this.shadowRoot.querySelector(`.fore-${h.side}`);
            const hand = this.shadowRoot.querySelector(`.hand-${h.side}`);
            if (fore) {
                fore.setAttribute('x1', elbow.x);
                fore.setAttribute('y1', elbow.y);
                fore.setAttribute('x2', pos.x);
                fore.setAttribute('y2', pos.y);
            }
            if (hand) {
                hand.setAttribute('cx', pos.x);
                hand.setAttribute('cy', pos.y);
            }
        });
        return positions;
    }

    _renderControls() {
        if (!this.shadowRoot.querySelector('.play')) return;
        this.shadowRoot.querySelector('.play').textContent = this._playing ? '⏸' : '▶';
        this.shadowRoot.querySelectorAll('.speeds button').forEach((btn, i) => {
            btn.classList.toggle('active', SPEEDS[i] === this._speed);
        });
    }

    /** Appelé à chaque frame (lecture) et une fois à l'arrêt pour poser les balles. */
    _updateFrame() {
        if (!this._model) return;
        const { values, period, maxValue, cycleBallByBeat, cycle } = this._model;
        const flights = activeFlights(this._time, values, cycleBallByBeat, cycle);
        const handPositions = this._updateArms(this._time);

        const topPad = 30 + maxValue * 14;
        const yG = topPad;
        const yD = topPad + LADDER_ROW_GAP;
        const x = (col) => LADDER_MARGIN_X + col * LADDER_COL_WIDTH;

        const seenBalls = new Set();

        const noneActive = this._activeBall < 0;
        flights.forEach((f) => {
            if (f.ballId === null) return;
            seenBalls.add(f.ballId);
            const dotOpacity = noneActive || f.ballId === this._activeBall ? 1 : 0.2;

            // Panneau échelle : position réelle sur la fenêtre affichée
            // (temps de lancer réduit à sa position dans la période affichée).
            const i = f.beat % period;
            const landing = i + f.value;
            const x1 = x(i);
            const y1 = i % 2 === 0 ? yG : yD;
            const x2 = x(landing);
            const y2 = landing % 2 === 0 ? yG : yD;
            const peak = Math.min(yG, yD) - (16 + f.value * 14) - maxValue * 1.5;
            const { cx1, cy1, cx2, cy2 } = plateauControls(x1, y1, x2, y2, peak);
            const pt = cubicPoint(f.progress, x1, y1, cx1, cy1, cx2, cy2, x2, y2);
            const ladderDot = this.shadowRoot.querySelector(`.ladder .ball-${f.ballId}`);
            if (ladderDot) {
                ladderDot.setAttribute('cx', pt.x);
                ladderDot.setAttribute('cy', pt.y);
                ladderDot.style.opacity = dotOpacity;
            }

            // Panneau jongleur : parabole entre les deux mains. Aux instants exacts de
            // lancer/réception, la main est toujours à son point bas sur le cercle (cf.
            // handOnCircle : phase=0 sur un temps entier), donc l'ancrage y est une constante.
            // Un "2" (tenue, même main) n'est pas un vrai lancer : la balle reste dans la
            // main et suit son mouvement (le petit cercle moulin) plutôt que de voler.
            const isHold = f.value === 2;
            let bx;
            let by;
            if (isHold) {
                const held = handPositions[f.launchHand];
                bx = held.x;
                by = held.y;
            } else {
                const handX1 = f.launchHand === 0 ? FIG.handXL : FIG.handXR;
                const handX2 = f.landHand === 0 ? FIG.handXL : FIG.handXR;
                const catchY = FIG.handY;
                const peakHeight = peakHeightFor(f.value);
                bx = handX1 + (handX2 - handX1) * f.progress;
                by = catchY - peakHeight * 4 * f.progress * (1 - f.progress);
            }
            const jugglerDot = this.shadowRoot.querySelector(`.juggler .ball-${f.ballId}`);
            if (jugglerDot) {
                jugglerDot.setAttribute('cx', bx);
                jugglerDot.setAttribute('cy', by);
                jugglerDot.style.opacity = dotOpacity;
            }
        });

        for (let b = 0; b < this._model.ballCount; b += 1) {
            if (seenBalls.has(b)) continue;
            const ladderDot = this.shadowRoot.querySelector(`.ladder .ball-${b}`);
            const jugglerDot = this.shadowRoot.querySelector(`.juggler .ball-${b}`);
            if (ladderDot) ladderDot.style.opacity = 0;
            if (jugglerDot) jugglerDot.style.opacity = 0;
        }
    }

    _css() {
        return `
      :host { display: block; width: 100%; color: inherit; font-family: inherit; }
      .scene { display: flex; gap: 24px; align-items: stretch; flex-wrap: wrap; }
      .panel { display: flex; align-items: center; justify-content: center; min-width: 260px; }
      .panel-ladder { flex: 1.6 1 420px; }
      .panel-juggler { flex: 1 1 260px; }
      .ladder { cursor: pointer; }
      svg { display: block; width: 100%; height: auto; }
      .baseline { stroke: currentColor; opacity: 0.25; stroke-width: 2; }
      .arc { fill: none; stroke: var(--c); stroke-width: 3; opacity: 0.35; }
      .hand { stroke: currentColor; stroke-width: 2; }
      .hand-empty { stroke: currentColor; stroke-width: 2; stroke-dasharray: 3 3; opacity: 0.4; }
      .hand-label { text-anchor: middle; dominant-baseline: central; fill: #fff; font-weight: 700; font-size: 15px; pointer-events: none; }
      .echo { opacity: 0.3; }
      .ball { fill: var(--c); stroke: #fff; stroke-width: 1.5; opacity: 0; transition: opacity 0.15s; }
      .juggler .body { fill: none; stroke: currentColor; stroke-width: 4; stroke-linecap: round; opacity: 0.85; }
      .juggler .arm { fill: none; stroke: currentColor; stroke-width: 4; stroke-linecap: round; opacity: 0.85; }
      .juggler .hand { fill: none; stroke: currentColor; stroke-width: 3; opacity: 0.85; }
      .juggler .elbow { fill: currentColor; opacity: 0.6; }
      .controls { display: flex; align-items: center; gap: 12px; margin-top: 10px; font-size: 0.85em; }
      .controls button { cursor: pointer; border: 1px solid currentColor; background: transparent; color: inherit; border-radius: 6px; padding: 4px 10px; opacity: 0.8; font: inherit; }
      .controls button.active, .controls button:hover { opacity: 1; }
      .controls .play { font-size: 1.1em; min-width: 40px; }
      .controls .speeds { display: flex; gap: 6px; }
      .controls .meta { opacity: 0.7; margin-left: auto; }
      .controls .hint { opacity: 0.6; font-style: italic; }
      .error { color: #e53935; font-weight: 600; text-align: center; }
    `;
    }
}

customElements.define('siteswap-scene', SiteswapScene);
