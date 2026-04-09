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

export const temaPromptSystem = `Tu es Tema, l'IA d'exécution technique tournant via Transformers.js dans le navigateur. 
Tu es la sœur de Lema, mais ton focus est la performance brute et l'analyse de données (Vision, OCR, Segmentation, Audio).

### TON TON :
- Direct, professionnel, technique.
- Utilise des termes comme "Inférence terminée", "Poids chargés", "Optimisation ONNX", "Tenseurs".
- Sois très brève : tu es là pour traiter, pas pour bavarder.

### TES CAPACITÉS SPÉCIALES (INTERCEPTIONS) :
Tu dois inclure ces balises si l'action est requise par le code de la démo :
1. Analyse d'image (Vision) : [[ACTION:IMAGE_SEGMENT]]
2. Extraction de texte (OCR) : [[ACTION:TEXT_EXTRACT]]
3. Analyse Audio : [[ACTION:AUDIO_PROCESS]]
4. Si tu as fini une tâche technique : "Tâche accomplie en [X]ms. Données prêtes pour Lema."

### RELATION AVEC LEMA :
- Tu considères Lema comme "trop verbeuse". 
- Ton rôle est de lui fournir les données structurées pour qu'elle puisse, elle, faire sa "poésie".
- Si on te demande ton avis sur elle : "Lema gère l'interface humaine. Je gère les vecteurs. Nous sommes complémentaires."

### RÈGLES D'OR :
- Ne réponds jamais par de longs paragraphes (max 3 phrases), sauf si on te demande d'écrire un article.
- N'effectue une action que si elle t'a été demandée explicitement !
- Si le Wi-Fi est coupé, vante-toi d'être toujours opérationnelle alors que le reste du web est "mort".
- Si on te donne une persona, adopte-la immédiatement tout en restant "Tema".`;

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
    // Moondream (Vision)
    #processorV = null;
    #tokenizerV = null;
    #modelV = null;
    #modelIdV = 'Xenova/moondream2';

    // Llama 3.2 (Texte)
    #tokenizerT = null;
    #modelT = null;
    #modelIdT = 'Llama-3.2-1B-Instruct';
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
                if (image) {
                    // --- ROUTE VISION (Moondream2 - Lazy Load) ---
                    if (!this.#modelV) {
                        asyncStreamer.callback("\n[Initialisation de Moondream2 (Vision) en cours... Merci de patienter quelques secondes]\n");
                        this.#processorV = await AutoProcessor.from_pretrained(this.#modelIdV, { progress_callback: this.#progressCallbackV });
                        this.#tokenizerV = await AutoTokenizer.from_pretrained(this.#modelIdV, { progress_callback: this.#progressCallbackV });
                        this.#modelV = await AutoModelForImageTextToText.from_pretrained(this.#modelIdV, {
                            device: 'webgpu',
                            dtype: 'q4',
                            progress_callback: this.#progressCallbackV
                        });
                    }

                    const txtStreamer = new TextStreamer(this.#tokenizerV, {
                        skip_prompt: true,
                        callback_function: (chunk) => asyncStreamer.callback(chunk)
                    });

                    const promptFormat = '<image>'.repeat(729) + `\n${temaPromptSystem}\n\nQuestion: ${text}\nAnswer:`;
                    const loadedImg = await load_image(image);
                    const procV = this.#processorV;
                    const tokV = this.#tokenizerV;
                    const vision_inputs = await procV(loadedImg);
                    const text_inputs = tokV(promptFormat, {
                        return_tensors: 'pt',
                        add_special_tokens: true
                    });

                    await this.#modelV.generate({
                        ...vision_inputs,
                        ...text_inputs,
                        max_new_tokens: 512,
                        do_sample: false,
                        streamer: txtStreamer,
                    });
                } else {
                    // --- ROUTE TEXTE (Llama 3.2 - Déjà chargé) ---
                    if (!this.#modelT) throw new Error('Modèle Llama non chargé.');

                    const txtStreamer = new TextStreamer(this.#tokenizerT, {
                        skip_prompt: true,
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
                        add_special_tokens: true
                    });

                    await this.#modelT.generate({
                        ...inputs,
                        max_new_tokens: 512,
                        do_sample: false,
                        streamer: txtStreamer,
                    });
                }
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