import { pipeline, env, LogLevel } from '@huggingface/transformers';

// Même configuration de chargement que le worker de Tema (modèles locaux + cache navigateur)
env.allowLocalModels = true;
env.allowRemoteModels = true;
env.localModelPath = '/models/';
env.useBrowserCache = true;
env.useWasmCache = true;
env.logLevel = LogLevel.ERROR;

const MODEL_ID = 'onnx-community/Supertonic-TTS-2-ONNX';
const REMOTE_VOICES_URL = `https://huggingface.co/${MODEL_ID}/resolve/main/voices/`;

/**
 * Device d'inférence : WASM (CPU) volontairement, pour laisser le GPU à Gemma.
 * Supertonic est assez rapide pour tenir le temps réel sur CPU.
 */
const DEVICE = 'wasm';

/**
 * Worker de synthèse vocale neuronale (Supertonic 2 via Transformers.js).
 *
 * Messages entrants :
 * - `{ type: 'LOAD' }`
 * - `{ type: 'SYNTHESIZE', id, text, voice, lang, speed, steps }`
 * - `{ type: 'CANCEL', upTo }` : ignore toutes les synthèses en attente dont l'id <= upTo
 *
 * Messages sortants :
 * - `LOAD_COMPLETE` | `LOAD_ERROR`
 * - `RESULT { id, audio: Float32Array, samplingRate }` | `ERROR { id, error }`
 */
class SupertonicWorkerController {
    /** @type {Promise<any>|null} */
    #ttsPromise = null;
    /** @type {Map<string, Float32Array>} cache des embeddings de voix */
    #voices = new Map();
    /** @type {Promise<void>} chaîne de synthèses (une seule inférence à la fois) */
    #queue = Promise.resolve();
    /** @type {number} */
    #cancelledUpTo = -1;

    /**
     * Charge le pipeline (idempotent) et fait tourner une inférence à vide
     * (warm-up) pour absorber le coût de compilation ONNX/WASM avant la
     * première vraie phrase à synthétiser.
     * @param {string} [voice] - voix à utiliser pour le warm-up
     * @param {string} [lang] - langue à utiliser pour le warm-up
     * @returns {Promise<any>}
     */
    load(voice, lang) {
        if (!this.#ttsPromise) {
            this.#ttsPromise = pipeline('text-to-speech', MODEL_ID, { device: DEVICE, dtype: 'fp32' })
                .then(async (tts) => {
                    if (voice) {
                        try {
                            const speakerEmbeddings = await this.#getVoice(voice);
                            await tts(`<${lang || 'fr'}>.</${lang || 'fr'}>`, {
                                speaker_embeddings: speakerEmbeddings,
                                num_inference_steps: 1,
                                speed: 1,
                            });
                        } catch {
                            // Warm-up best-effort : une erreur ici ne doit pas bloquer le chargement
                        }
                    }
                    return tts;
                })
                .catch((err) => {
                    this.#ttsPromise = null;
                    throw err;
                });
        }
        return this.#ttsPromise;
    }

    /**
     * Récupère l'embedding d'une voix (local d'abord, Hugging Face en repli).
     * @param {string} voice - identifiant Supertonic (F1..F5, M1..M5)
     * @returns {Promise<Float32Array>}
     */
    async #getVoice(voice) {
        if (this.#voices.has(voice)) return this.#voices.get(voice);

        let response = await fetch(`${env.localModelPath}${MODEL_ID}/voices/${voice}.bin`);
        if (!response.ok) {
            response = await fetch(`${REMOTE_VOICES_URL}${voice}.bin`);
        }
        if (!response.ok) throw new Error(`Voix Supertonic introuvable : ${voice}`);

        const embedding = new Float32Array(await response.arrayBuffer());
        this.#voices.set(voice, embedding);
        return embedding;
    }

    /**
     * Met en file une synthèse et poste le résultat au thread principal.
     * @param {{id: number, text: string, voice: string, lang: string, speed: number, steps: number}} job
     */
    synthesize(job) {
        this.#queue = this.#queue.then(() => this.#runJob(job));
    }

    /**
     * @param {number} upTo - dernier id de job à ignorer
     */
    cancel(upTo) {
        this.#cancelledUpTo = Math.max(this.#cancelledUpTo, upTo);
    }

    async #runJob({ id, text, voice, lang, speed, steps }) {
        if (id <= this.#cancelledUpTo) return;
        try {
            const tts = await this.load(voice, lang);
            const speakerEmbeddings = await this.#getVoice(voice);
            const output = await tts(`<${lang}>${text}</${lang}>`, {
                speaker_embeddings: speakerEmbeddings,
                num_inference_steps: steps,
                speed,
            });
            if (id <= this.#cancelledUpTo) return;
            self.postMessage(
                { type: 'RESULT', id, audio: output.audio, samplingRate: output.sampling_rate },
                [output.audio.buffer]
            );
        } catch (err) {
            self.postMessage({ type: 'ERROR', id, error: err?.message ?? String(err) });
        }
    }
}

const controller = new SupertonicWorkerController();

self.onmessage = async ({ data }) => {
    switch (data.type) {
        case 'LOAD':
            try {
                await controller.load(data.voice, data.lang);
                self.postMessage({ type: 'LOAD_COMPLETE' });
            } catch (err) {
                self.postMessage({ type: 'LOAD_ERROR', error: err?.message ?? String(err) });
            }
            break;
        case 'SYNTHESIZE':
            controller.synthesize(data);
            break;
        case 'CANCEL':
            controller.cancel(data.upTo);
            break;
    }
};
