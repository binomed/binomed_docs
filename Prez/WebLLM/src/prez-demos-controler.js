import {
    Reveal,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';

import {OverlayStats} from  './stats-overlay.js';
import { SpeechRecognitionControler, MicControler } from './speech.js';

export class PrezDemosControler{

    
    /**
     * @type {SpeechRecognitionControler}
     */
    #speechControler = null;
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
            log('In Gemma', undefined);
            this.#micControler.addMicButton();
            this.#overlayControler.addOverlayWidget();
        })
        Reveal.addEventListener('out-gemma', ()=>{
            log('Out Gemma', undefined);
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
                log('Error SpeechRecongnition', undefined, 'error', msg);
                break;
            case 'start':
                log('Start SpeechRecongnition', undefined);
                break;
            case 'stop':
                log('Stop SpeechRecongnition', undefined);
                if (this.#micControler && this.#micControler.micState){
                    this.#micControler.triggerMic();
                }
                break;
            case 'speechend':
                log('SpeechEnd SpeechRecongnition', undefined);
                break;
            case 'result':
                log('Result SpeechRecongnition', undefined, 'debug', msg);
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