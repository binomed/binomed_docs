export const VOICE_TEMA = "Amélie"; // Fr-CA -> Voice for Tema
export const VOICE_LEMA = "Google français"; // Fr-FR -> Voice for LEMA

const VOICE_PITCH = 1;
const VOICE_RATE = 1;
export class SpeechSynthesisControler{

    /**
     * @type {SpeechSynthesis}
     */
    #synth = null;
    /**
     * @type {number}
     */
    #rate = 0;
    /**
     * @type {number}
     */
    #pitchVal = 0;

    #lemaVoice = null;
    #temaVoice = null;

    // Streaming TTS fields
    #streamQueue = [];       // chunks fusionnés en attente de lecture
    #streamStopped = false;  // flag pour ignorer les chunks futurs
    #isSpeaking = false;     // utterance en cours de lecture
    #chunkBuffer = '';       // buffer temporaire pour accumuler les chunks
    #isProcessing = false;   // verrou pour éviter la concurrence sur #playNext
    #streamFinished = false; // flag indiquant que le stream LLM est terminé
    #currentVoice = null;    // voix utilisée au démarrage du stream (pour finishLLMStream)
    #stateListener = null;

    constructor(stateListener){
        this.#synth = window.speechSynthesis;
        this.#currentVoice = VOICE_LEMA;
        this.#stateListener = stateListener;
    }

    loadVoices(){
        const allVoices = this.#synth.getVoices();

        this.#lemaVoice = allVoices.find(v => v.name === VOICE_LEMA);
        if (!this.#lemaVoice) log('Voix pour Lema non disponible', 'error');
        this.#temaVoice = allVoices.find(v => v.name === VOICE_TEMA);
        if (!this.#temaVoice) log('Voix pour Tema non disponible', 'error');
    }


    stop(){
        if (this.#synth){
            this.#synth.cancel();
        }
    }

    speak(text, voiceConst){
        // Arrêter tout stream en cours avant de lancer une nouvelle lecture
        this.stopStream();

        if (!text){
            log('Aucun texte à lire', 'error');
            return;
        }

        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = this.#lemaVoice;
        if (voiceConst === VOICE_TEMA){
            utterThis.voice = this.#temaVoice;
        }

        utterThis.pitch = VOICE_PITCH;
        utterThis.rate = VOICE_RATE

        this.#synth.speak(utterThis);
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
     * Vide le buffer vers la queue et lance la lecture si nécessaire
     * @private
     */
    #pushBufferToQueue(voiceConst) {
        if (!this.#chunkBuffer.trim()) {
            return; // Rien à pousser
        }
        this.#stateListener({state:'addToQueue'});

        // Pousser le contenu du buffer dans la queue
        this.#streamQueue.push({
            text: this.#chunkBuffer,
            voice: voiceConst
        });

        // Vider le buffer
        this.#chunkBuffer = '';

        // Démarrer la lecture si aucune utterance n'est en cours
        if (!this.#isSpeaking && !this.#isProcessing) {
            this.#safePlayNext();
        }
    }

    /**
     * Appelle #playNext en acquérant un verrou pour éviter la concurrence
     * @private
     */
    #safePlayNext() {
        if (this.#isProcessing) {
            return; // Déjà en cours, éviter les appels imbriqués
        }

        this.#isProcessing = true;
        try {
            this.#playNext();
        } finally {
            this.#isProcessing = false;
        }
    }

    /**
     * Arrête la lecture du stream courant et ignore les chunks futurs
     */
    stopStream() {
        // Poser le flag AVANT cancel pour éviter que onend relance une lecture
        this.#streamStopped = true;
        this.#streamQueue = [];
        this.#chunkBuffer = '';
        this.#isSpeaking = false;
        this.#streamFinished = false;
        this.#currentVoice = VOICE_LEMA;
        this.#synth.cancel();
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
     * Joue le prochain chunk dans la file d'attente
     * Enchaîne automatiquement via le callback onend
     * @private
     */
    #playNext() {
        // Si le stream a été arrêté ou la queue est vide, arrêter
        if (this.#streamStopped || this.#streamQueue.length === 0) {
            this.#isSpeaking = false;
            return;
        }

        // Dépiler le prochain chunk
        const { text, voice } = this.#streamQueue.shift();
        this.#isSpeaking = true;

        // Sélectionner la voix
        let selectedVoice = this.#lemaVoice;
        if (voice === VOICE_TEMA) {
            selectedVoice = this.#temaVoice;
        }

        // Créer et configurer l'utterance
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = selectedVoice;
        utterThis.pitch = VOICE_PITCH;
        utterThis.rate = VOICE_RATE;

        // Enchaînement automatique quand l'utterance se termine
        // Utiliser safePlayNext pour éviter les accès concurrents
        utterThis.onend = () => {
            this.#safePlayNext();
            this.#sendEnMessage();
        };

        // Gestion des erreurs : continuer avec le prochain chunk
        utterThis.onerror = (event) => {
            log(`Erreur TTS: ${event.error}`, 'error');
            this.#isSpeaking = false;
            this.#safePlayNext();
        };

        // Lancer la lecture
        this.#synth.speak(utterThis);
    }



    #sendEnMessage(){
        this.#stateListener({state:'end'});
    }

}

