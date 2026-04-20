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

const temaPromptSystem = `Tu es Tema, l'IA d'exécution technique tournant via Transformers.js dans le navigateur.
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

/**
 * Modèles disponibles pour Tema.
 * @type {'llama' | 'gemma4'}
 */
const ACTIVE_MODEL = 'gemma4';

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

class TemaWorkerController {
    #processor = null;
    #tokenizer = null;
    #model = null;
    #config = MODEL_CONFIGS[ACTIVE_MODEL];

    constructor() { }

    async loadModel(progressCallback) {
        if (this.#model) return;

        const { id, dtype, type } = this.#config;
        console.log(`[Tema Worker] Chargement du modèle : ${id} (${dtype})`);

        this.#tokenizer = await AutoTokenizer.from_pretrained(id, { progress_callback: progressCallback });

        // Gemma 4 stocke son chat_template dans un fichier .jinja séparé
        if (type === 'multimodal' && !this.#tokenizer.chat_template) {
            const templateUrl = `${env.localModelPath}${id}/chat_template.jinja`;
            const resp = await fetch(templateUrl);
            if (resp.ok) {
                this.#tokenizer.chat_template = await resp.text();
            }
        }

        if (type === 'multimodal') {
            this.#processor = await AutoProcessor.from_pretrained(id, { progress_callback: progressCallback });
            this.#model = await AutoModelForImageTextToText.from_pretrained(id, {
                device: 'webgpu',
                dtype,
                progress_callback: progressCallback,
            });
        } else {
            const { AutoModelForCausalLM } = await import('@huggingface/transformers');
            this.#model = await AutoModelForCausalLM.from_pretrained(id, {
                device: 'webgpu',
                dtype,
                progress_callback: progressCallback,
            });
        }
    }

    /**
     * @param {string} text
     * @param {string|null} imageDataUrl - data URL de l'image (ou null)
     * @param {function(string):void} onChunk - appelé pour chaque token généré
     */
    async generate(text, imageDataUrl, onChunk) {
        if (!this.#model) throw new Error('Modèle non chargé.');

        const txtStreamer = new TextStreamer(this.#tokenizer, {
            skip_prompt: true,
            skip_special_tokens: true,
            callback_function: (chunk) => onChunk(chunk)
        });

        if (this.#config.type === 'multimodal') {
            const conversation = [
                { role: 'system', content: temaPromptSystem },
            ];

            if (imageDataUrl) {
                conversation.push({
                    role: 'user',
                    content: [
                        { type: 'image', image: imageDataUrl },
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
            const proc = this.#processor;
            let inputs;
            if (imageDataUrl && proc) {
                const loadedImage = await load_image(imageDataUrl);
                inputs = await proc(promptText, [loadedImage]);
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
                temperature: 0.5,
                top_p: 0.9,
                top_k: 50,
                repetition_penalty: 1.2,
                streamer: txtStreamer,
            });
        } else {
            if (imageDataUrl) {
                console.log("[Tema Worker] Image détectée mais modèle texte uniquement.");
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
                temperature: 0.5,
                top_p: 0.85,
                top_k: 50,
                repetition_penalty: 1.2,
                streamer: txtStreamer,
            });
        }
    }
}

// ─── Initialisation du worker ───────────────────────────────────────────────

const controller = new TemaWorkerController();

self.onmessage = async ({ data }) => {
    const { type } = data;

    if (type === 'LOAD_MODEL') {
        try {
            await controller.loadModel((progress) => {
                if (progress.status === 'progress') {
                    self.postMessage({ type: 'LOAD_PROGRESS', progress });
                }
            });
            self.postMessage({ type: 'LOAD_COMPLETE' });
        } catch (err) {
            console.error('[Tema Worker] Erreur chargement:', err);
            self.postMessage({ type: 'LOAD_ERROR', error: err.message });
        }
        return;
    }

    if (type === 'PROMPT') {
        const { id, text, imageData } = data;
        try {
            await controller.generate(text, imageData || null, (chunk) => {
                self.postMessage({ type: 'CHUNK', id, text: chunk });
            });
            self.postMessage({ type: 'COMPLETE', id });
        } catch (err) {
            console.error('[Tema Worker] Erreur génération:', err);
            self.postMessage({ type: 'ERROR', id, error: err.message });
        }
    }
};
