export const VOICE_TEMA = "Amélie"; // Fr-CA -> Voice for Tema (fallback Web Speech)
export const VOICE_LEMA = "Google français"; // Fr-FR -> Voice for LEMA
export const VOICE_ENGLISH = "Google US English"; // En-US -> Voice for LEMA

const VOICE_PITCH = 1;
const VOICE_RATE = 1.1;

/**
 * Réglages de la voix neuronale Supertonic (Transformers.js) utilisée pour Tema.
 * Voix disponibles : F1..F5, M1..M5.
 */
const NEURAL_VOICE_TEMA = 'F2';
const NEURAL_LANG = 'fr';
const NEURAL_SPEED = 1.05;
const NEURAL_STEPS = 5; // plus = meilleure qualité, plus lent (1-50)

/**
 * Contrat commun des moteurs de synthèse.
 * - `prepare` est appelé dès la mise en file (permet de pré-générer l'audio),
 * - `play` résout quand la lecture est terminée (ou interrompue),
 * - `cancel` interrompt la lecture courante et abandonne les préparations en cours.
 * @typedef {Object} TTSEngine
 * @property {(text: string, voiceConst: string) => any} prepare
 * @property {(handle: any) => Promise<void>} play
 * @property {() => void} cancel
 */

/**
 * Moteur basé sur la Web Speech API du navigateur.
 * @implements {TTSEngine}
 */
class WebSpeechEngine {
    /** @type {SpeechSynthesis} */
    #synth = window.speechSynthesis;
    #lemaVoice = null;
    #englishLemaVoice = null;
    #temaVoice = null;

    loadVoices() {
        const allVoices = this.#synth.getVoices();

        this.#lemaVoice = allVoices.find(v => v.name === VOICE_LEMA);
        if (!this.#lemaVoice) log('Voix pour Lema non disponible', 'error');
        this.#englishLemaVoice = allVoices.find(v => v.name === VOICE_ENGLISH);
        if (!this.#englishLemaVoice) log('Voix pour English Lema non disponible', 'error');
        this.#temaVoice = allVoices.find(v => v.name === VOICE_TEMA);
        if (!this.#temaVoice) log('Voix pour Tema non disponible', 'error');
    }

    /**
     * @param {string} text
     * @param {string} voiceConst
     * @returns {{text: string, voiceConst: string}}
     */
    prepare(text, voiceConst) {
        return { text, voiceConst };
    }

    /**
     * @param {{text: string, voiceConst: string}} handle
     * @returns {Promise<void>}
     */
    play({ text, voiceConst }) {
        return new Promise((resolve) => {
            const utterThis = new SpeechSynthesisUtterance(text);
            utterThis.voice = this.#voiceFor(voiceConst);
            utterThis.pitch = VOICE_PITCH;
            utterThis.rate = VOICE_RATE;
            utterThis.onend = () => resolve();
            utterThis.onerror = (event) => {
                log(`Erreur TTS: ${event.error}`, 'error');
                resolve();
            };
            this.#synth.speak(utterThis);
        });
    }

    cancel() {
        this.#synth.cancel();
    }

    #voiceFor(voiceConst) {
        if (voiceConst === VOICE_TEMA) return this.#temaVoice;
        if (voiceConst === VOICE_ENGLISH) return this.#englishLemaVoice;
        return this.#lemaVoice;
    }
}

/**
 * Moteur neuronal Supertonic 2 exécuté par Transformers.js dans un Web Worker (WASM).
 * L'audio est généré dès `prepare` pour que la phrase suivante soit prête
 * pendant la lecture de la phrase courante.
 * @implements {TTSEngine}
 */
class SupertonicEngine {
    /** @type {Worker|null} */
    #worker = null;
    /** @type {Promise<void>|null} */
    #loadingPromise = null;
    #ready = false;
    #nextId = 0;
    /** @type {Map<number, {resolve: Function, reject: Function}>} */
    #pending = new Map();
    /** @type {AudioContext|null} */
    #audioCtx = null;
    /** @type {AudioBufferSourceNode|null} */
    #currentSource = null;
    /** @type {Function|null} résolution de la lecture courante */
    #currentResolve = null;
    /** Incrémenté à chaque cancel pour invalider les handles préparés avant */
    #generation = 0;

    get ready() {
        return this.#ready;
    }

    /**
     * Charge le modèle dans le worker (idempotent).
     * @returns {Promise<void>}
     */
    load() {
        if (this.#ready) return Promise.resolve();
        if (this.#loadingPromise) return this.#loadingPromise;

        this.#worker = new Worker(new URL('./tts.worker.js', import.meta.url), { type: 'module' });
        this.#worker.addEventListener('message', ({ data }) => this.#onMessage(data));

        this.#loadingPromise = new Promise((resolve, reject) => {
            const handler = ({ data }) => {
                if (data.type === 'LOAD_COMPLETE') {
                    this.#ready = true;
                    this.#worker.removeEventListener('message', handler);
                    resolve();
                } else if (data.type === 'LOAD_ERROR') {
                    this.#loadingPromise = null;
                    this.#worker.removeEventListener('message', handler);
                    this.#worker.terminate();
                    this.#worker = null;
                    reject(new Error(data.error));
                }
            };
            this.#worker.addEventListener('message', handler);
            this.#worker.postMessage({ type: 'LOAD', voice: NEURAL_VOICE_TEMA, lang: NEURAL_LANG });
        });
        return this.#loadingPromise;
    }

    /**
     * Lance la génération audio en tâche de fond.
     * @param {string} text
     * @returns {{generation: number, audio: Promise<{audio: Float32Array, samplingRate: number}>}}
     */
    prepare(text) {
        const id = this.#nextId++;
        const audio = new Promise((resolve, reject) => {
            this.#pending.set(id, { resolve, reject });
        });
        this.#worker.postMessage({
            type: 'SYNTHESIZE',
            id,
            text: cleanTextForSpeech(text),
            voice: NEURAL_VOICE_TEMA,
            lang: NEURAL_LANG,
            speed: NEURAL_SPEED,
            steps: NEURAL_STEPS,
        });
        return { generation: this.#generation, audio };
    }

    /**
     * @param {{generation: number, audio: Promise<{audio: Float32Array, samplingRate: number}>}} handle
     * @returns {Promise<void>}
     */
    async play({ generation, audio }) {
        let result;
        try {
            result = await audio;
        } catch (err) {
            log(`Erreur TTS neuronal: ${err.message}`, 'error');
            return;
        }
        if (!result || generation !== this.#generation) return;

        this.#audioCtx ??= new AudioContext();
        await this.#audioCtx.resume();

        const buffer = this.#audioCtx.createBuffer(1, result.audio.length, result.samplingRate);
        buffer.copyToChannel(result.audio, 0);

        return new Promise((resolve) => {
            const source = this.#audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.#audioCtx.destination);
            source.onended = () => {
                if (this.#currentSource === source) {
                    this.#currentSource = null;
                    this.#currentResolve = null;
                }
                resolve();
            };
            this.#currentSource = source;
            this.#currentResolve = resolve;
            source.start();
        });
    }

    cancel() {
        this.#generation++;
        if (this.#worker) {
            this.#worker.postMessage({ type: 'CANCEL', upTo: this.#nextId - 1 });
        }
        // Les préparations abandonnées se résolvent à vide
        for (const { resolve } of this.#pending.values()) resolve(null);
        this.#pending.clear();

        if (this.#currentSource) {
            const resolve = this.#currentResolve;
            this.#currentSource.onended = null;
            this.#currentSource.stop();
            this.#currentSource = null;
            this.#currentResolve = null;
            resolve?.();
        }
    }

    #onMessage(data) {
        const pending = this.#pending.get(data.id);
        if (!pending) return;
        this.#pending.delete(data.id);
        if (data.type === 'RESULT') {
            pending.resolve({ audio: data.audio, samplingRate: data.samplingRate });
        } else if (data.type === 'ERROR') {
            pending.reject(new Error(data.error));
        }
    }
}

/**
 * Nettoie le texte avant synthèse neuronale (emojis et symboles non prononçables).
 * @param {string} text
 * @returns {string}
 */
function cleanTextForSpeech(text) {
    return text
        .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
        .replace(/[*_#`~<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export class SpeechSynthesisControler{

    /** @type {WebSpeechEngine} */
    #webSpeech = new WebSpeechEngine();
    /** @type {SupertonicEngine} */
    #neural = new SupertonicEngine();

    // Streaming TTS fields
    /** @type {{engine: TTSEngine, handle: any}[]} */
    #streamQueue = [];       // chunks fusionnés (déjà en préparation) en attente de lecture
    #streamStopped = false;  // flag pour ignorer les chunks futurs
    #isSpeaking = false;     // lecture en cours
    #chunkBuffer = '';       // buffer temporaire pour accumuler les chunks
    #streamFinished = false; // flag indiquant que le stream LLM est terminé
    #currentVoice = null;    // voix utilisée au démarrage du stream (pour finishLLMStream)
    #streamId = 0;           // incrémenté à chaque arrêt pour invalider les lectures en vol
    #stateListener = null;

    constructor(stateListener){
        this.#currentVoice = VOICE_LEMA;
        this.#stateListener = stateListener;
    }

    loadVoices(){
        this.#webSpeech.loadVoices();
    }

    /**
     * Charge la voix neuronale de Tema (Supertonic via Transformers.js).
     * Tant qu'elle n'est pas prête, Tema utilise la voix Web Speech en repli.
     * @returns {Promise<void>}
     */
    loadNeuralVoices(){
        return this.#neural.load();
    }

    stop(){
        this.#webSpeech.cancel();
        this.#neural.cancel();
    }

    speak(text, voiceConst){
        // Arrêter tout stream en cours avant de lancer une nouvelle lecture
        this.stopStream();

        if (!text){
            log('Aucun texte à lire', 'error');
            return;
        }

        const engine = this.#engineFor(voiceConst);
        engine.play(engine.prepare(text, voiceConst));
    }

    /**
     * Ajoute un chunk à un stream de synthèse vocale
     * Les chunks sont accumulés et lus par phrases (détection de ponctuation)
     * @param {string} chunk - texte delta du chunk
     * @param {string} voiceConst - VOICE_LEMA ou VOICE_TEMA
     */
    appendToStream(chunk, voiceConst) {
        // Si un stream précédent a été arrêté, réinitialiser
        if (this.#streamStopped) {
            this.#resetStream();
        }

        // Tracker la voix du stream courant
        this.#currentVoice = voiceConst;

        // Ajouter le chunk au buffer temporaire
        this.#chunkBuffer += chunk;

        // Vérifier si le buffer contient une ponctuation de fin de phrase
        const hasPunctuation = /[.!?,;:…]/.test(this.#chunkBuffer);

        // Lancer la lecture si ponctuation détectée
        if (hasPunctuation) {
            this.#pushBufferToQueue(voiceConst);
        }
    }

    /**
     * Signale la fin du stream LLM
     * Force la lecture du buffer restant même s'il a moins de 3 mots
     */
    finishLLMStream() {
        this.#streamFinished = true;

        // Si il y a du contenu en buffer, le pousser immédiatement avec la voix du stream
        if (this.#chunkBuffer.trim()) {
            this.#pushBufferToQueue(this.#currentVoice);
        }
    }

    /**
     * Arrête la lecture du stream courant et ignore les chunks futurs
     */
    stopStream() {
        // Poser le flag AVANT cancel pour éviter qu'une fin de lecture relance la suivante
        this.#streamStopped = true;
        this.#streamId++;
        this.#streamQueue = [];
        this.#chunkBuffer = '';
        this.#isSpeaking = false;
        this.#streamFinished = false;
        this.#currentVoice = VOICE_LEMA;
        this.stop();
    }

    /**
     * Choisit le moteur : voix neuronale pour Tema si elle est chargée, Web Speech sinon.
     * @param {string} voiceConst
     * @returns {TTSEngine}
     * @private
     */
    #engineFor(voiceConst) {
        if (voiceConst === VOICE_TEMA && this.#neural.ready) {
            return this.#neural;
        }
        return this.#webSpeech;
    }

    /**
     * Vide le buffer vers la queue (en lançant la préparation audio) et démarre la lecture si nécessaire
     * @private
     */
    #pushBufferToQueue(voiceConst) {
        if (!this.#chunkBuffer.trim()) {
            return; // Rien à pousser
        }
        this.#stateListener({state:'addToQueue'});

        const engine = this.#engineFor(voiceConst);
        this.#streamQueue.push({
            engine,
            handle: engine.prepare(this.#chunkBuffer, voiceConst),
        });

        // Vider le buffer
        this.#chunkBuffer = '';

        // Démarrer la lecture si rien n'est en cours
        if (!this.#isSpeaking) {
            this.#playNext();
        }
    }

    /**
     * Réinitialise le stream pour en démarrer un nouveau
     * @private
     */
    #resetStream() {
        this.#streamStopped = false;
        this.#streamQueue = [];
        this.#isSpeaking = false;
        this.#chunkBuffer = '';
        this.#streamFinished = false;
        this.#currentVoice = VOICE_LEMA;
    }

    /**
     * Joue les chunks de la file d'attente les uns après les autres
     * @private
     */
    async #playNext() {
        const streamId = this.#streamId;
        this.#isSpeaking = true;

        while (!this.#streamStopped && this.#streamQueue.length > 0) {
            const { engine, handle } = this.#streamQueue.shift();
            await engine.play(handle);
            this.#sendEnMessage();
            // Un stopStream (et éventuellement un nouveau stream) a eu lieu pendant la lecture
            if (streamId !== this.#streamId) return;
        }

        this.#isSpeaking = false;
    }

    #sendEnMessage(){
        this.#stateListener({state:'end'});
    }

}
