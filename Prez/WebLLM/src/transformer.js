import {
    AutoProcessor,
    AutoTokenizer,
    AutoModelForImageTextToText,
    load_image,
    TextStreamer,
    env,
    LogLevel
} from '@huggingface/transformers';

// Configuration pour autoriser le chargement local
env.allowLocalModels = true;
env.allowRemoteModels = true;
env.localModelPath = '/models/';
// Cache les fichiers modèles dans le Cache API du navigateur (persistant entre sessions)
env.useBrowserCache = true;
// Cache le runtime WASM ONNX (permet aussi le mode offline)
env.useWasmCache = true;
// Silence ONNX Runtime logging
env.logLevel = LogLevel.ERROR;

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

/**
 * Modèles disponibles pour Tema.
 * Changer ACTIVE_MODEL pour basculer entre Llama et Gemma.
 * @type {'llama' | 'gemma4'}
 */
export const ACTIVE_MODEL = 'gemma4';

/** @type {Record<string, {id: string, dtype: string, type: 'causal' | 'multimodal'}>} */
const MODEL_CONFIGS = {
    llama: {
        id: 'onnx-community/Llama-3.2-1B-Instruct',
        dtype: 'q4',
        type: 'causal',
    },
    gemma4: {
        id: 'onnx-community/gemma-4-E2B-it-ONNX',
        dtype: 'q4f16',
        type: 'multimodal',
    },
};

export class TemaMultimodalController {
    #processor = null;
    #tokenizer = null;
    #model = null;
    #config = MODEL_CONFIGS[ACTIVE_MODEL];

    constructor() { }

    async loadModel(progressCallbackV, progressCallbackT) {
        if (this.#model) return;

        try {
            const { id, dtype, type } = this.#config;
            console.log(`[Tema] Chargement du modèle : ${id} (${dtype})`);

            this.#tokenizer = await AutoTokenizer.from_pretrained(id, { progress_callback: progressCallbackT });

            // Gemma 4 stocke son chat_template dans un fichier .jinja séparé
            if (type === 'multimodal' && !this.#tokenizer.chat_template) {
                const templateUrl = `${env.localModelPath}${id}/chat_template.jinja`;
                const resp = await fetch(templateUrl);
                if (resp.ok) {
                    this.#tokenizer.chat_template = await resp.text();
                }
            }

            if (type === 'multimodal') {
                this.#processor = await AutoProcessor.from_pretrained(id, { progress_callback: progressCallbackT });
                this.#model = await AutoModelForImageTextToText.from_pretrained(id, {
                    device: 'webgpu',
                    dtype,
                    progress_callback: progressCallbackT,
                });
            } else {
                const { AutoModelForCausalLM } = await import('@huggingface/transformers');
                this.#model = await AutoModelForCausalLM.from_pretrained(id, {
                    device: 'webgpu',
                    dtype,
                    progress_callback: progressCallbackT,
                });
            }

            if (progressCallbackV) {
                progressCallbackV({ status: 'progress', progress: 100, name: 'Model ready' });
            }
        } catch (err) {
            console.error('Erreur lors du chargement de Tema:', err);
            throw err;
        }
    }

    async prompt({ text, image }) {
        const asyncStreamer = new AsyncStreamer();

        const doGenerate = async () => {
            try {
                if (!this.#model) throw new Error('Modèle non chargé.');

                const txtStreamer = new TextStreamer(this.#tokenizer, {
                    skip_prompt: true,
                    skip_special_tokens: true,
                    callback_function: (chunk) => asyncStreamer.callback(chunk)
                });

                if (this.#config.type === 'multimodal') {
                    // --- ROUTE GEMMA 4 (texte ou multimodal) ---
                    const conversation = [
                        { role: 'system', content: temaPromptSystem },
                    ];

                    if (image) {
                        conversation.push({
                            role: 'user',
                            content: [
                                { type: 'image', image },
                                { type: 'text', text },
                            ],
                        });
                    } else {
                        conversation.push({ role: 'user', content: text });
                    }

                    const promptText = this.#tokenizer.apply_chat_template(conversation, {
                        tokenize: false,
                        add_generation_prompt: true,
                    });

                    const tok = this.#tokenizer;
                    let inputs;
                    if (image && this.#processor) {
                        inputs = await this.#processor.process(
                            await load_image(image),
                            { text: promptText },
                        );
                    } else {
                        inputs = tok(promptText, {
                            return_tensors: 'pt',
                            add_special_tokens: false,
                        });
                    }

                    await this.#model.generate({
                        ...inputs,
                        max_new_tokens: 512,
                        do_sample: true,
                        temperature: 1.0,
                        top_p: 0.95,
                        top_k: 64,
                        streamer: txtStreamer,
                    });
                } else {
                    // --- ROUTE TEXTE (Llama 3.2) ---
                    if (image) {
                        console.log("[Tema] Image détectée mais modèle texte uniquement.");
                    }

                    const conversation = [
                        { role: 'system', content: temaPromptSystem },
                        { role: 'user', content: text }
                    ];

                    const promptText = this.#tokenizer.apply_chat_template(conversation, {
                        tokenize: false,
                        add_generation_prompt: true
                    });

                    const inputs = this.#tokenizer(promptText, {
                        return_tensors: 'pt',
                        add_special_tokens: false
                    });

                    await this.#model.generate({
                        ...inputs,
                        max_new_tokens: 512,
                        do_sample: true,
                        temperature: 0.7,
                        top_p: 0.9,
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