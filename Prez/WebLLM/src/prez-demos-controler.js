import {
    Reveal,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';

import {OverlayStats} from  './stats-overlay.js';
import { SpeechRecognitionControler, MicControler } from './speech.js';
import { SpeechSynthesisControler, VOICE_LEMA, VOICE_TEMA } from './tts.js';

let index = 0;
export class PrezDemosControler{

    
    /**
     * @type {SpeechRecognitionControler}
     */
    #speechControler = null;
    /**
     * @type {SpeechSynthesisControler}
     */
    #ttsControler = null;
    /**
     * @type  {OverlayStats}
     */
    #overlayControler = null;
    /**
     * @type {MicControler}
     */
    #micControler = null; 

    constructor(){
        this.initGraphicalsElements();
        this.initTTSAndSpeech();
        this.initRevealEvents();
    }

    initRevealEvents(){
        Reveal.addEventListener('in-gemma', ()=>{
            log('In Gemma');
            this.#micControler.addMicButton();
            this.#overlayControler.addOverlayWidget();
            this.#ttsControler.loadVoices();
        })
        Reveal.addEventListener('out-gemma', ()=>{
            log('Out Gemma');
            this.#micControler.removeMicButton();
            this.#overlayControler.removeOverlayWidget();
        })
    }

    initGraphicalsElements(){
        this.#overlayControler = new OverlayStats();
        this.#micControler = new MicControler(this.stateMicListener.bind(this));

    }

    initTTSAndSpeech(){
        this.#speechControler = new SpeechRecognitionControler(this.stateSpeechListener.bind(this));
        this.#ttsControler = new SpeechSynthesisControler();
    }

    /**
     * STATES LISTENERS
     */

    /**
     * SpeechRecognition Listeners
     * @param {*} param0 
     */
    stateSpeechListener({state, msg}){
        switch(state){
            case 'error':
                log('Error SpeechRecongnition', 'error', msg);
                break;
            case 'start':
                log('Start SpeechRecongnition');
                break;
            case 'stop':
                log('Stop SpeechRecongnition');
                if (this.#micControler && this.#micControler.micState){
                    this.#micControler.triggerMic();
                }
                break;
            case 'speechend':
                log('SpeechEnd SpeechRecongnition');
                break;
            case 'result':
                index++;
                this.#ttsControler.speak(msg, index%2 === 0 ?VOICE_LEMA : VOICE_TEMA);
                log('Result SpeechRecongnition', 'debug', msg);
                break;
        }
    }

    /**
     * Mic Listener
     * @param {*} param0 
     */
    stateMicListener({state}){
        switch(state){
            case 'start':
                if (this.#speechControler){
                    this.#speechControler.startListening()
                }
                break;
            case 'stop':
                if (this.#speechControler && this.#speechControler.isListening){
                    this.#speechControler.stopListening();
                }
                break;            
        }
    }
}