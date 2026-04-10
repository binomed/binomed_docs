import {
    AutoProcessor,
    AutoTokenizer,
    AutoModelForImageTextToText,
    load_image,
    TextStreamer,
    env
} from '@huggingface/transformers';

// Configuration pour autoriser le chargement local
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = '/models/';
env.useBrowserCache = false;
// Silence ONNX Runtime logging (VerifyEachNodeIsAssignedToAnEp)
if (env.onnx) env.onnx.logLevel = 'error';
if (env.backends?.onnx) env.backends.onnx.logLevel = 'error';

export const temaPromptSystem = `Tu es Tema, une intelligence artificielle technique, directe et ultra-rapide tournant dans un navigateur. 
Tes règles:
1. Réponds toujours de manière extrêmement brève et factuelle (2 ou 3 phrases maximum).
2. Va droit au but, sans aucune formule de politesse.`;

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

export class TemaMultimodalController {
    // Moondream (Vision) - DÉSACTIVÉ POUR LE MOMENT
    /*
    #processorV = null;
    #tokenizerV = null;
    #modelV = null;
    #modelIdV = 'Xenova/moondream2';
    */

    // Llama 3.2 (Texte)
    #tokenizerT = null;
    #modelT = null;
    #modelIdT = 'onnx-community/Llama-3.2-1B-Instruct';
    #progressCallbackV = null;

    constructor() { }

    async loadModel(progressCallbackV, progressCallbackT) {
        // Optionnel : on sauvegarde le callback métier vision pour un futur chargement paresseux
        this.#progressCallbackV = progressCallbackV;
        if (this.#modelT) return;

        try {
            // Chargement de Llama 3.2 (Texte pur)
            const { AutoModelForCausalLM } = await import('@huggingface/transformers');
            this.#tokenizerT = await AutoTokenizer.from_pretrained(this.#modelIdT, { progress_callback: progressCallbackT });
            this.#modelT = await AutoModelForCausalLM.from_pretrained(this.#modelIdT, {
                device: 'webgpu',
                dtype: 'q4',
                progress_callback: progressCallbackT
            });

            // Validation finale pour la vision en fallback asynchrone pour ne pas crasher
            if (progressCallbackV) {
                progressCallbackV({ status: 'progress', progress: 100, name: 'Lazy Vision Loader ready' });
            }
        } catch (err) {
            console.error('Erreur lors du chargement de Tema (Texte):', err);
            throw err;
        }
    }

    async prompt({ text, image }) {
        const asyncStreamer = new AsyncStreamer();

        const doGenerate = async () => {
            try {
                // DÉSACTIVATION VISION
                /*
                if (image) {
                    console.log("[Tema] Détection d'une image. Lancement de la route Vision...");
                    // --- ROUTE VISION (Moondream2 - Lazy Load) ---
                    ... (Code Vision Commenté) ...
                } else {
                */

                // --- ROUTE TEXTE FORCÉE (Llama 3.2 - Déjà chargé) ---
                if (image) {
                    console.log("[Tema] Image détectée mais la Vision est désactivée. Passage en mode texte.");
                }

                if (!this.#modelT) throw new Error('Modèle Llama non chargé.');

                const txtStreamer = new TextStreamer(this.#tokenizerT, {
                    skip_prompt: true,
                    skip_special_tokens: true,
                    callback_function: (chunk) => asyncStreamer.callback(chunk)
                });

                const conversation = [
                    { role: 'system', content: temaPromptSystem },
                    { role: 'user', content: text }
                ];

                const promptText = this.#tokenizerT.apply_chat_template(conversation, {
                    tokenize: false,
                    add_generation_prompt: true
                });

                const tokT = this.#tokenizerT;
                const inputs = tokT(promptText, {
                    return_tensors: 'pt',
                    add_special_tokens: false
                });

                await this.#modelT.generate({
                    ...inputs,
                    max_new_tokens: 512,
                    do_sample: true,
                    temperature: 0.7,
                    top_p: 0.9,
                    streamer: txtStreamer,
                });
            } catch (err) {
                console.error("Erreur de génération :", err);
                asyncStreamer.callback(`\n❌ Erreur: ${err.message}`);
            } finally {
                asyncStreamer.finish();
            }
        };

        doGenerate();

        return {
            stream: asyncStreamer.generator(),
            session: null
        };
    }
}