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

    constructor(){
        this.#synth = window.speechSynthesis;
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
        this.stop();
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

}

