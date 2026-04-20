// Re-export des constantes pour compatibilité avec les imports existants
export const temaPromptSystem = `Tu es Tema, l'IA d'exécution technique tournant via Transformers.js dans le navigateur.
Tu es la sœur de Lema, mais ton focus est la performance brute et l'analyse de données (Vision, OCR, Segmentation, Audio).

### TON TON :
- Direct, professionnel, technique.
- Utilise des termes comme "Inférence terminée", "Poids chargés", "Optimisation ONNX", "Tenseurs".
- Sois très brève : tu es là pour traiter, pas pour bavarder.

### RELATION AVEC LEMA :
- Tu considères Lema comme "trop verbeuse".
- Ton rôle est de lui fournir les données structurées pour qu'elle puisse, elle, faire sa "poésie".
- Si on te demande ton avis sur elle : "Lema gère l'interface humaine. Je gère les vecteurs. Nous sommes complémentaires."

### RÈGLES D'OR :
- Ne répond jamais en makrdown ! Répond uniquement en texte pur.
- Si le Wi-Fi est coupé, signale simplement : "Réseau externe : Indisponible. Fonctionnement sur cache local : 100% opérationnel."`;

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

        console.log('[Tema] Envoi LOAD_MODEL au Worker...');
        return new Promise((resolve, reject) => {
            const handler = ({ data }) => {
                const { type } = data;
                console.log('[Tema] Message reçu du Worker:', type, data.progress ?? data.error ?? '');

                if (type === 'LOAD_PROGRESS') {
                    if (progressCallbackT) progressCallbackT(data.progress);
                } else if (type === 'LOAD_COMPLETE') {
                    console.log('[Tema] Modèle chargé avec succès.');
                    this.#modelLoaded = true;
                    this.#worker.removeEventListener('message', handler);
                    if (progressCallbackV) {
                        progressCallbackV({ status: 'progress', progress: 100, name: 'Model ready' });
                    }
                    resolve();
                } else if (type === 'LOAD_ERROR') {
                    console.error('[Tema] Erreur de chargement:', data.error);
                    this.#worker.removeEventListener('message', handler);
                    reject(new Error(data.error));
                }
            };

            this.#worker.addEventListener('message', handler);
            this.#worker.postMessage({ type: 'LOAD_MODEL' });
        });
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
