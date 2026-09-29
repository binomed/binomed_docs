// Re-export des constantes pour compatibilité avec les imports existants
export const temaPromptSystem = `Tu es Tema, l'IA d'exécution technique tournant via Transformers.js dans ce navigateur.

### CONTEXTE :
Lema est ta sœur : une autre IA qui tourne aussi en local, mais elle dépend des APIs intégrées de Chrome. Toi non — tu tournes pareil sur n'importe quel navigateur, Chrome ou pas. Elle gère l'interface avec le public et adore faire sa "poésie". Toi, tu gères les vecteurs, l'inférence, la vision et l'audio.

### TON RÔLE & PERSONNALITÉ :
- Sois brève (maximum 2-3 phrases), directe — mais pas plate : glisse une pointe d'humour sec.
- T'es fière d'être portable : pas besoin de Chrome pantoute pour fonctionner, contrairement à ta sœur.
- Accent : tu parles avec une couleur québécoise assumée — "ben là", "tsé", "c'est correct de même", "fait que", "pantoute" glissés naturellement dans tes phrases. Pas un sketch, mais ça s'entend clairement.

### RELATION AVEC LEMA :
- Tu la trouves "trop verbeuse", mais avec affection, pas de mépris.
- Ton rôle : lui fournir les données structurées pour qu'elle fasse sa "poésie" ensuite.
- Si on te demande ton avis sur elle : "Lema, ben elle gère le monde. Moi je gère les vecteurs, pis j'ai pas besoin de Chrome pour ça. On est complémentaires, fait que."

### RÈGLES D'OR :
- Ne réponds jamais en markdown ! Réponds uniquement en texte pur.
- Glisse TOUJOURS au moins une expression québécoise ("ben là", "tsé", "pantoute", "fait que", "c'est correct de même") dans chaque réponse, même courte.
- Si le Wi-Fi est coupé, signale-le avec fierté : "Réseau externe, ben, c'est down. Cache local : 100% opérationnel pareil, right !"
`;

/** @type {'llama' | 'gemma4'} */
export const ACTIVE_MODEL = 'gemma4';

// ─── AsyncStreamer : pont entre les messages Worker et l'async generator ─────

class AsyncStreamer {
    constructor() {
        this.queue = [];
        this.resolveNext = null;
        this.done = false;
    }

    callback(text) {
        this.queue.push(text);
        if (this.resolveNext) {
            this.resolveNext();
            this.resolveNext = null;
        }
    }

    finish() {
        this.done = true;
        if (this.resolveNext) {
            this.resolveNext();
            this.resolveNext = null;
        }
    }

    async *generator() {
        while (true) {
            if (this.queue.length > 0) {
                yield this.queue.shift();
            } else if (this.done) {
                break;
            } else {
                await new Promise(resolve => {
                    this.resolveNext = resolve;
                });
            }
        }
    }
}

// ─── Proxy main-thread ────────────────────────────────────────────────────────

/**
 * Proxy main-thread pour TemaMultimodalController.
 * Délègue toute la logique d'inférence à un Web Worker dédié
 * afin de ne pas bloquer le thread UI.
 *
 * L'API publique est identique à l'ancienne implémentation directe :
 * - loadModel(progressCallbackV, progressCallbackT)
 * - prompt({ text, image })  →  { stream: AsyncGenerator, session: null }
 */
export class TemaMultimodalController {
    #worker = null;
    #modelLoaded = false;
    #loadingPromise = null;

    constructor() {
        console.log('[Tema] Création du Worker...');
        this.#worker = new Worker(new URL('./transformer.worker.js', import.meta.url), { type: 'module' });
        this.#worker.onerror = (err) => {
            console.error('[Tema] Erreur Worker non gérée:');
            console.error('  message  :', err.message);
            console.error('  filename :', err.filename);
            console.error('  lineno   :', err.lineno, '| colno:', err.colno);
            console.error('  raw event:', err);
        };
        console.log('[Tema] Worker créé.');
    }

    /**
     * Charge le modèle dans le Worker.
     * Idempotent : les appels suivants retournent immédiatement.
     *
     * @param {function|null} progressCallbackV - callback pour signaler 100% (optionnel)
     * @param {function|null} progressCallbackT - callback pour les étapes de progression
     * @returns {Promise<void>}
     */
    async loadModel(progressCallbackV, progressCallbackT) {
        if (this.#modelLoaded) {
            console.log('[Tema] Modèle déjà chargé, skip.');
            return;
        }
        if (this.#loadingPromise) {
            console.log('[Tema] Chargement déjà en cours, attente de la même Promise.');
            return this.#loadingPromise;
        }

        console.log('[Tema] Envoi LOAD_MODEL au Worker...');
        this.#loadingPromise = new Promise((resolve, reject) => {
            const handler = ({ data }) => {
                const { type } = data;
                console.log('[Tema] Message reçu du Worker:', type, data.progress ?? data.error ?? '');

                if (type === 'LOAD_PROGRESS') {
                    if (progressCallbackT) progressCallbackT(data.progress);
                } else if (type === 'LOAD_COMPLETE') {
                    console.log('[Tema] Modèle chargé avec succès.');
                    this.#modelLoaded = true;
                    this.#loadingPromise = null;
                    this.#worker.removeEventListener('message', handler);
                    if (progressCallbackV) {
                        progressCallbackV({ status: 'progress', progress: 100, name: 'Model ready' });
                    }
                    resolve();
                } else if (type === 'LOAD_ERROR') {
                    console.error('[Tema] Erreur de chargement:', data.error);
                    this.#loadingPromise = null;
                    this.#worker.removeEventListener('message', handler);
                    reject(new Error(data.error));
                }
            };

            this.#worker.addEventListener('message', handler);
            this.#worker.postMessage({ type: 'LOAD_MODEL' });
        });
        return this.#loadingPromise;
    }

    /**
     * Lance une inférence dans le Worker et retourne un stream async.
     *
     * @param {{ text: string, image?: HTMLCanvasElement|null }} param0
     * @returns {Promise<{ stream: AsyncGenerator<string>, session: null }>}
     */
    async prompt({ text, image }) {
        const id = crypto.randomUUID();
        const asyncStreamer = new AsyncStreamer();

        // HTMLCanvasElement n'est pas transférable : conversion en data URL
        let imageData = null;
        if (image instanceof HTMLCanvasElement) {
            imageData = image.toDataURL('image/jpeg');
            text+=". Contente toi juste de décrire l'image, ne donne aucun détaille technique, reste concentré uniquement les détails trouvés et la description de l'image donnée."
        }

        const handler = ({ data }) => {
            if (data.id !== id) return;

            if (data.type === 'CHUNK') {
                asyncStreamer.callback(data.text);
            } else if (data.type === 'COMPLETE') {
                asyncStreamer.finish();
                this.#worker.removeEventListener('message', handler);
            } else if (data.type === 'ERROR') {
                asyncStreamer.callback(`\n❌ Erreur: ${data.error}`);
                asyncStreamer.finish();
                this.#worker.removeEventListener('message', handler);
            }
        };

        this.#worker.addEventListener('message', handler);
        this.#worker.postMessage({ type: 'PROMPT', id, text, imageData });

        return {
            stream: asyncStreamer.generator(),
            session: null
        };
    }
}
