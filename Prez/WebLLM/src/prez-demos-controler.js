import {
    Reveal,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';

import {OverlayStats} from  './stats-overlay.js';
import { SpeechRecognitionControler, MicControler } from './speech.js';
import { SpeechSynthesisControler, VOICE_LEMA, VOICE_TEMA } from './tts.js';
import {BuiltInControler} from './buit-in.js';
import { PromptControler } from './prompt-controler.js';
import { ChatController } from './chat-controller.js';

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

    /**
     * @type {BuiltInControler}
     */
    #builtInControler = null;

    /**
     * @type {PromptControler}
     */
    #promptControler = null;

    /**
     * @type {ChatController}
     */
    #chatController = null;



    constructor(){
        this.initGraphicalsElements();
        this.initTTSAndSpeech();
        this.initRevealEvents();
        this.initAiApis();
    }

    initRevealEvents(){
        Reveal.addEventListener('in-gemma', async ()=>{
            log('In Gemma');
            this.#micControler.addMicButton();
            this.#overlayControler.addOverlayWidget();
            this.#ttsControler.loadVoices();
            this.#chatController = new ChatController();
            await this.#builtInControler.checkStateAPIs();
            await this.#promptControler.downloadMissingAPIsIfNeeded();
            this.#promptControler.showAPIStatus();
            this.#promptControler.updateContextDisplay();

        })
        Reveal.addEventListener('out-gemma', async ()=>{
            log('Out Gemma');
            this.#micControler.removeMicButton();
            this.#overlayControler.removeOverlayWidget();
            this.#promptControler.hideAPIStatus();
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

    async initAiApis(){
        this.#promptControler = new PromptControler(null); // Sera complété après
        const stateListener = this.#promptControler.handleBuiltInStateChange.bind(this.#promptControler);
        this.#builtInControler = new BuiltInControler(stateListener);
        this.#promptControler.setBuiltInControler(this.#builtInControler);
        
    }

    /**
     * STATES LISTENERS
     */

    /**
     * SpeechRecognition Listeners
     * @param {*} param0
     */
    async stateSpeechListener({state, msg}){
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
                this.#chatController.addUserMessage("lema-chat",msg);
                const {stream, session} = await this.#builtInControler.prompt({text:msg});
                const idStream = this.#chatController.startStream("lema-chat");
                for await (const chunk of stream){
                    log(`Chunk : ${chunk}`)
                    this.#chatController.appendToStream("lema-chat",idStream, chunk);
                    // Stream le chunk directement au TTS pour commencer la lecture immédiatement
                    this.#ttsControler.appendToStream(chunk, VOICE_LEMA);
                    // Mettre à jour l'affichage du contexte à chaque chunk reçu
                    this.#promptControler.updateContextDisplay();
                }
                this.#chatController.finishStream("lema-chat", idStream);
                // Signaler la fin du stream au TTS pour forcer la lecture du buffer restant
                this.#ttsControler.finishLLMStream();

                index++;
                //log('Result SpeechRecongnition', 'debug', msg);
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