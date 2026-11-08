/**
 * <siteswap-diagram pattern="531"></siteswap-diagram>
 *
 * Diagramme "échelle" horizontal d'un siteswap asynchrone (cf. le schéma
 * classique de Wikipedia : https://fr.wikipedia.org/wiki/Siteswap).
 *
 * - Deux lignes horizontales (main Gauche en haut, Droite en bas), le temps
 *   s'écoule de gauche à droite, un lancer = un arc entre deux temps.
 * - Chaque balle (cycle du siteswap) a sa propre couleur.
 * - Clic sur le composant : isole et anime la trajectoire d'une balle à la
 *   fois (boucle). Mettre l'attribut "static" désactive ce comportement.
 *
 * Portée volontaire : siteswaps asynchrones simples uniquement
 * (un caractère = un temps, alphabet 0-9puis a-z comme la notation
 * standard). Les notations multiplex ([43]) et synchrones ((4,4)) ne sont
 * pas supportées par ce composant.
 *
 * Attributs :
 *  - pattern  (obligatoire) : ex. "3", "531", "441", "97531"
 *  - ball     (optionnel)   : index de la balle mise en avant au départ
 *  - static   (optionnel)   : désactive l'animation et le clic
 */

import { BALL_PALETTE, decodeSiteswap, simulateBalls } from './siteswap-core.js';

const COL_WIDTH = 110;
const MARGIN_X = 70;
const ROW_GAP = 120;
const BOTTOM_MARGIN = 90;
const MAX_ECHO_COLS = 12;

/** Chaîne réelle (non modulo) des temps parcourus par une balle, bornée à la fenêtre visible. */
function ballPathBeats(ballId, ballByBeat, values, windowSize) {
    const period = values.length;
    let start = null;
    for (let i = 0; i < period; i += 1) {
        if (ballByBeat[i] === ballId && values[i] > 0) {
            start = i;
            break;
        }
    }
    if (start === null) return [];

    const beats = [start];
    let cur = start;
    let guard = 0;
    while (guard < windowSize * 2) {
        guard += 1;
        const value = values[cur % period];
        if (value <= 0) break;
        const next = cur + value;
        if (next >= windowSize) break;
        beats.push(next);
        cur = next;
    }
    return beats;
}

function arcPeak(y1, y2, value, maxValue) {
    return Math.min(y1, y2) - (20 + value * 18) - maxValue * 2;
}

/**
 * Courbe en "plateau" : elle monte/descend rapidement près de ses deux
 * extrémités puis reste à plat au sommet entre les deux. Ça garantit que les
 * lancers qui couvrent plusieurs temps passent largement au-dessus des mains
 * intermédiaires au lieu de les traverser (ce qu'un simple arc parabolique
 * centré sur le milieu du segment ne garantit pas pour un grand écart).
 */
function arcPath(x1, y1, x2, y2, value, maxValue) {
    const peak = arcPeak(y1, y2, value, maxValue);
    const dx = x2 - x1;
    const lift = Math.min(Math.abs(dx) / 2, COL_WIDTH * 0.45);
    const cx1 = x1 + Math.sign(dx) * lift;
    const cx2 = x2 - Math.sign(dx) * lift;
    return `M ${x1} ${y1} C ${cx1} ${peak} ${cx2} ${peak} ${x2} ${y2}`;
}

class SiteswapDiagram extends HTMLElement {
    static get observedAttributes() {
        return ['pattern', 'ball', 'static'];
    }

    constructor() {
        super();
        this._activeBall = 0;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._activeBall = this.hasAttribute('ball') ? Number(this.getAttribute('ball')) : -1;
        this._render();
    }

    attributeChangedCallback(name) {
        if (name === 'ball') {
            this._activeBall = this.hasAttribute('ball') ? Number(this.getAttribute('ball')) : -1;
        }
        if (this.shadowRoot && this.shadowRoot.firstChild) {
            this._render();
        }
    }

    /**
     * Cycle au clic : vue d'ensemble statique (-1) -> balle 0 animée -> balle 1
     * animée -> ... -> retour à la vue d'ensemble. Rien ne s'anime tant qu'on
     * n'a pas cliqué au moins une fois.
     */
    _onClick() {
        if (this.hasAttribute('static')) return;
        if (!this._ballCount) return;
        this._activeBall += 1;
        if (this._activeBall >= this._ballCount) this._activeBall = -1;
        this._render();
    }

    _render() {
        const pattern = this.getAttribute('pattern') || '';
        this.shadowRoot.innerHTML = '';

        let values;
        try {
            values = decodeSiteswap(pattern);
        } catch (err) {
            this.shadowRoot.innerHTML = this._errorTemplate(pattern, err.message);
            return;
        }

        const period = values.length;
        const maxValue = Math.max(0, ...values);
        const { ballByBeat, ballCount } = simulateBalls(values);
        this._ballCount = ballCount;

        const echoCols = Math.min(Math.max(maxValue, 1), MAX_ECHO_COLS);
        const windowSize = period + echoCols;

        const topPad = 40 + maxValue * 18;
        const yG = topPad;
        const yD = topPad + ROW_GAP;
        const width = MARGIN_X * 2 + (windowSize - 1) * COL_WIDTH;
        const height = yD + BOTTOM_MARGIN;

        const x = (col) => MARGIN_X + col * COL_WIDTH;
        const y = (col) => (col % 2 === 0 ? yG : yD);

        const isStatic = this.hasAttribute('static');
        const average = values.reduce((a, b) => a + b, 0) / period;
        const isValid = Number.isInteger(average);
        const noneActive = this._activeBall < 0 || this._activeBall >= ballCount;

        const arcs = [];
        for (let i = 0; i < period; i += 1) {
            const value = values[i];
            if (value <= 0) continue;
            const landing = i + value;
            const ballId = ballByBeat[i];
            const color = ballId === null ? '#9e9e9e' : BALL_PALETTE[ballId % BALL_PALETTE.length];
            const isActive = !isStatic && !noneActive && ballId === this._activeBall;
            const isDimmed = !isStatic && !noneActive && ballId !== this._activeBall;
            arcs.push({
                d: arcPath(x(i), y(i), x(landing), y(landing), value, maxValue),
                color,
                isActive,
                isDimmed,
            });
        }

        const beatIcons = [];
        for (let col = 0; col < windowSize; col += 1) {
            const isEcho = col >= period;
            const ballId = ballByBeat[col % period];
            const color = ballId === null ? 'none' : BALL_PALETTE[ballId % BALL_PALETTE.length];
            const hand = col % 2 === 0 ? 'G' : 'D';
            const label = `T${col + 1}`;
            const isDimmed = !isStatic && !noneActive && ballId !== this._activeBall;
            beatIcons.push({ x: x(col), y: y(col), color, hand, label, isEcho, isDimmed, empty: ballId === null });
        }

        let ballPathD = '';
        let ballDuration = '1.6s';
        if (!isStatic && !noneActive) {
            const beats = ballPathBeats(this._activeBall, ballByBeat, values, windowSize);
            if (beats.length > 1) {
                const points = beats.map((b) => ({ x: x(b), y: y(b), col: b }));
                let d = `M ${points[0].x} ${points[0].y} `;
                for (let i = 0; i < points.length - 1; i += 1) {
                    const a = points[i];
                    const b = points[i + 1];
                    const value = b.col - a.col;
                    const peak = arcPeak(a.y, b.y, value, maxValue);
                    const dx = b.x - a.x;
                    const lift = Math.min(Math.abs(dx) / 2, COL_WIDTH * 0.45);
                    const cx1 = a.x + Math.sign(dx) * lift;
                    const cx2 = b.x - Math.sign(dx) * lift;
                    d += `C ${cx1} ${peak} ${cx2} ${peak} ${b.x} ${b.y} `;
                }
                ballPathD = d;
                ballDuration = `${Math.max(1, beats.length - 1) * 0.9}s`;
            }
        }

        const activeColor = noneActive ? null : BALL_PALETTE[this._activeBall % BALL_PALETTE.length];
        const hint = isStatic
            ? ''
            : noneActive
              ? 'clic : isoler une balle'
              : this._activeBall === ballCount - 1
                ? 'clic : vue d’ensemble'
                : 'clic : balle suivante';

        this.shadowRoot.innerHTML = `
      <style>${this._css(isStatic)}</style>
      <div class="wrap">
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img"
             aria-label="Diagramme du siteswap ${pattern}">
          <line class="baseline" x1="${MARGIN_X - 30}" y1="${yG}" x2="${width - MARGIN_X + 30}" y2="${yG}" />
          <line class="baseline" x1="${MARGIN_X - 30}" y1="${yD}" x2="${width - MARGIN_X + 30}" y2="${yD}" />

          ${arcs
                .map(
                    (arc) => `<path class="arc${arc.isActive ? ' active' : ''}${arc.isDimmed ? ' dimmed' : ''}" d="${arc.d}"
                          style="--arc-color:${arc.color}" />`
                )
                .join('')}

          ${beatIcons
                .map(
                    (b) => `
              <g class="beat${b.isEcho ? ' echo' : ''}${b.isDimmed ? ' dimmed' : ''}">
                <circle cx="${b.x}" cy="${b.y}" r="22"
                        fill="${b.empty ? 'none' : b.color}"
                        class="${b.empty ? 'hand-empty' : 'hand'}" />
                <text x="${b.x}" y="${b.y}" class="hand-label">${b.hand}</text>
                <text x="${b.x}" y="${b.y === yG ? b.y - 40 : b.y + 54}" class="beat-label">${b.label}</text>
              </g>`
                )
                .join('')}

          ${ballPathD
                ? `<circle class="ball-dot" r="9" style="--ball-color:${activeColor}">
                 <animateMotion path="${ballPathD}" dur="${ballDuration}" repeatCount="indefinite" />
               </circle>`
                : ''}
        </svg>
        <div class="caption">
          <span class="pattern">${pattern}</span>
          <span class="meta">${ballCount || '?'} balle${ballCount > 1 ? 's' : ''}${isValid ? '' : ' · ⚠️ moyenne non entière'}</span>
          ${hint ? `<span class="hint">${hint}</span>` : ''}
        </div>
      </div>
    `;

        if (!isStatic) {
            this.shadowRoot.querySelector('.wrap').addEventListener('click', () => this._onClick());
        }
    }

    _errorTemplate(pattern, message) {
        return `
      <style>${this._css(true)}</style>
      <div class="wrap error">
        <p>Siteswap invalide (${this._escape(pattern)}) : ${this._escape(message)}</p>
      </div>
    `;
    }

    _escape(str) {
        return String(str).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    }

    _css(isStatic) {
        return `
      :host { display: block; width: 100%; color: inherit; font-family: inherit; }
      .wrap { width: 100%; cursor: ${isStatic ? 'default' : 'pointer'}; }
      svg { display: block; width: 100%; height: auto; }
      .baseline { stroke: currentColor; opacity: 0.25; stroke-width: 2; }
      .arc { fill: none; stroke: var(--arc-color); stroke-width: 4; opacity: 0.9; transition: opacity 0.2s, stroke-width 0.2s; }
      .arc.dimmed { opacity: 0.12; }
      .arc.active { opacity: 1; stroke-width: 7; }
      .hand { stroke: currentColor; stroke-width: 2; opacity: 0.95; transition: opacity 0.2s; }
      .hand-empty { stroke: currentColor; stroke-width: 2; stroke-dasharray: 3 3; opacity: 0.4; }
      .hand-label { text-anchor: middle; dominant-baseline: central; fill: #fff; font-weight: 700; font-size: 20px; pointer-events: none; }
      .beat.echo .hand-label, .beat.echo .hand, .beat.echo .hand-empty { opacity: 0.35; }
      .beat.dimmed .hand, .beat.dimmed .hand-label { opacity: 0.2; }
      .beat-label { text-anchor: middle; fill: currentColor; opacity: 0.6; font-size: 18px; }
      .ball-dot { fill: var(--ball-color); stroke: #fff; stroke-width: 2; }
      .caption { display: flex; align-items: baseline; gap: 14px; justify-content: center; margin-top: 4px; font-size: 0.8em; opacity: 0.85; }
      .caption .pattern { font-weight: 700; letter-spacing: 1px; }
      .caption .hint { opacity: 0.6; font-style: italic; }
      .error p { color: #e53935; font-weight: 600; text-align: center; }
    `;
    }
}

customElements.define('siteswap-diagram', SiteswapDiagram);
