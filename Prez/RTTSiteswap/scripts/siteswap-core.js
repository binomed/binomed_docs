/**
 * Cœur de simulation partagé entre <siteswap-diagram> et <siteswap-scene> :
 * décodage de la notation, et simulation des balles (quelle balle est
 * lancée à quel temps, régime stationnaire). Un seul moteur, deux rendus.
 *
 * Portée volontaire : siteswaps asynchrones simples uniquement (un
 * caractère = un temps, alphabet 0-9 puis a-z). Pas de multiplex ni sync.
 */

export const BALL_PALETTE = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#009688', '#795548'];

/**
 * Couleur d'une balle sous forme de var() CSS : le thème de la présentation
 * peut la redéfinir via --ss-ball-0..6 (les custom properties traversent le
 * Shadow DOM), BALL_PALETTE ne sert que de repli. S'utilise en CSS (style=),
 * pas dans un attribut de présentation SVG (fill=) qui ignore var().
 */
export function ballColor(ballId) {
    if (ballId === null) return 'var(--ss-ball-none, #9e9e9e)';
    const i = ballId % BALL_PALETTE.length;
    return `var(--ss-ball-${i}, ${BALL_PALETTE[i]})`;
}

export function decodeSiteswap(pattern) {
    const chars = Array.from(pattern.trim());
    if (chars.length === 0) {
        throw new Error('motif vide');
    }
    return chars.map((ch) => {
        const value = parseInt(ch, 36);
        if (Number.isNaN(value)) {
            throw new Error(`caractère invalide : "${ch}"`);
        }
        return value;
    });
}

/**
 * Simule le siteswap sur plusieurs fenêtres pour atteindre un régime
 * stationnaire, puis renvoie, pour chaque temps réel de la fenêtre
 * canonique [0, windowLength), l'identifiant de la balle lancée à ce temps
 * (ou null si la main est vide).
 *
 * windowLength vaut `period` par défaut (suffisant pour compter les balles
 * et dessiner une échelle statique). Pour une animation en boucle en temps
 * réel, il faut en revanche utiliser le "super-cycle" (voir
 * `cycleLength()`) : avec une période impaire, la main qui lance un temps
 * donné alterne d'une période à l'autre (la parité réelle du temps change),
 * et seule une fenêtre de 2 périodes capture ce cycle complet main+balle.
 */
export function simulateBalls(values, windowLength = values.length) {
    const period = values.length;
    const warmupWindows = 4;
    const totalBeats = windowLength * (warmupWindows + 1);
    const landingBall = new Map();
    const beatBall = new Array(totalBeats).fill(null);
    let nextBallId = 0;

    for (let t = 0; t < totalBeats; t += 1) {
        const value = values[t % period];
        let ballId = landingBall.get(t);
        if (ballId === undefined) {
            if (value === 0) continue;
            ballId = nextBallId;
            nextBallId += 1;
        }
        beatBall[t] = ballId;
        if (value > 0) {
            landingBall.set(t + value, ballId);
        }
    }

    const steadyStart = windowLength * warmupWindows;
    const idMap = new Map();
    const ballByBeat = [];
    for (let i = 0; i < windowLength; i += 1) {
        const id = beatBall[steadyStart + i];
        if (id === null) {
            ballByBeat.push(null);
        } else {
            if (!idMap.has(id)) idMap.set(id, idMap.size);
            ballByBeat.push(idMap.get(id));
        }
    }
    return { ballByBeat, ballCount: idMap.size };
}

/**
 * Longueur du "super-cycle" main+balle : period, doublé si period est
 * impaire (cf. simulateBalls). Étendue en plus à un multiple suffisant pour
 * dépasser strictement maxValue : sinon un lancer plus haut que ce cycle
 * (ex. "6222" : période 4, lancer de hauteur 6) voit sa progression
 * recalculée modulo un cycle trop court et repart du sol avant d'avoir fini
 * sa trajectoire.
 */
export function cycleLength(period, maxValue = 0) {
    const base = period % 2 === 0 ? period : period * 2;
    let cycle = base;
    while (cycle <= maxValue) cycle += base;
    return cycle;
}

/**
 * Vols actifs au temps continu t (en temps/beats, flottant), sur une
 * fenêtre de `cycleLength` temps réels. Un vol = un lancer en cours
 * d'atterrissage, avec sa progression (0=lancer, 1=réception).
 */
export function activeFlights(t, values, ballByBeat, cycle) {
    const period = values.length;
    const flights = [];
    for (let beat = 0; beat < cycle; beat += 1) {
        const value = values[beat % period];
        if (value <= 0) continue;
        const delta = (((t - beat) % cycle) + cycle) % cycle;
        if (delta < value) {
            flights.push({
                ballId: ballByBeat[beat],
                beat,
                value,
                progress: delta / value,
                launchHand: beat % 2,
                landHand: (beat + value) % 2,
            });
        }
    }
    return flights;
}
