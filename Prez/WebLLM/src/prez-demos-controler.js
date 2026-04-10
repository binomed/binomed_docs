import {
    Reveal,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';

import { OverlayStats } from './stats-overlay.js';
import { SpeechRecognitionControler, MicControler } from './speech.js';
import { SpeechSynthesisControler, VOICE_ENGLISH, VOICE_LEMA, VOICE_TEMA } from './tts.js';
import { BuiltInControler, ProofReaderFixControler } from './buit-in.js';
import { PromptControler } from './prompt-controler.js';
import { ChatController } from './chat-controller.js';
import { ActionHandler } from './action-handler.js';
import { CameraController } from './camera-controller.js';
import { CameraComponent } from './camera-component.js';
import { TemaMultimodalController } from './transformer.js';

let index = 0;

const WELCOME_LEMA = 1;
const TRANSLATE_LEMA = 2;
const WRITER_LEMA = 3;
const REWRITE_LEMA = 4;
const SUMMARIZE_LEMA = 5;
const PROOFREAD_LEMA = 6;
const VISION_LEMA = 7;
const TEMA_VISION = 8;
export class PrezDemosControler {


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

    /**
     * @type {ActionHandler}
     */
    #actionHandler = null;

    /**
     * @type {CameraController}
     */
    #cameraController = null;

    /**
     * @type {ProofReaderFixControler}
     */
    #proofReaderFixControler = null;

    /**
     * @type {TemaMultimodalController}
     */
    #temaController = null;

    #nbMessageToSpeak = 0;

    #stateDemos = -1;

    #arrayChatHandlers = [];

    #streamStopped = false;


    constructor() {
        this.initGraphicalsElements();
        this.initTTSAndSpeech();
        this.initRevealEvents();
        this.initAiApis();
        this.initActionHandlers();
        this.initKeyboardShortcuts();
    }

    initRevealEvents() {
        Reveal.on('slidechanged', () => {
            this.stopTTSAndStream();
        });

        Reveal.addEventListener('in-gemma', async () => {
            log('In Gemma');
            this.#micControler.addMicButton();
            this.#overlayControler.addOverlayWidget();
            this.#ttsControler.loadVoices();
            this.#chatController = new ChatController();
            await this.#builtInControler.checkStateAPIs();
            await this.#promptControler.downloadMissingAPIsIfNeeded();
            this.#promptControler.showAPIStatus();
            this.#promptControler.updateContextDisplay();
            this.initChatHandlers();

        })
        Reveal.addEventListener('out-gemma', async () => {
            log('Out Gemma');
            this.#micControler.removeMicButton();
            this.#overlayControler.removeOverlayWidget();
            this.#promptControler.hideAPIStatus();
            this.removeChatHandlers();
            this.#stateDemos = -1;
        })

        Reveal.addEventListener('welcome-lema', () => {
            this.#stateDemos = WELCOME_LEMA;
        })
        Reveal.addEventListener('translate-lema', () => {
            this.#stateDemos = TRANSLATE_LEMA;
        })
        Reveal.addEventListener('writer-lema', () => {
            this.#stateDemos = WRITER_LEMA;
        })
        Reveal.addEventListener('rewrite-lema', () => {
            this.#stateDemos = REWRITE_LEMA;
        })
        Reveal.addEventListener('summarize-lema', () => {
            this.#stateDemos = SUMMARIZE_LEMA;
        })
        Reveal.addEventListener('proofread-lema', () => {
            this.#stateDemos = PROOFREAD_LEMA;
            this.#proofReaderFixControler = new ProofReaderFixControler();
            this.#wireProofreadButtons();
        })
        Reveal.addEventListener('vision-lema', async () => {
            this.#stateDemos = VISION_LEMA;
            if (!this.#cameraController) {
                this.#cameraController = new CameraController();
            }
            const camEl = document.getElementById('camera-lema');
            await this.#cameraController.setup(camEl);
        })
        Reveal.addEventListener('tema-vision', async () => {
            this.#stateDemos = TEMA_VISION;
            if (!this.#temaController) {
                this.#temaController = new TemaMultimodalController();
            }

            //const statusElV = document.getElementById('tema-status-v');
            const statusElT = document.getElementById('tema-status-t');
            const progressContainer = document.getElementById('tema-progress-container');
            //const progressBarV = document.getElementById('tema-progress-v');
            const progressBarT = document.getElementById('tema-progress-t');

            /*const progressCallbackV = (progress) => {
                if (progress.status === 'progress') {
                    if (progressContainer) progressContainer.classList.remove('hidden');
                    const pct = Math.round(progress.progress || 0);
                    if (progressBarV) progressBarV.style.width = `${pct}%`;
                    if (statusElV) statusElV.textContent = `Vision: ${progress.name || ''} (${pct}%)`;
                }
            };*/

            const progressCallbackT = (progress) => {
                if (progress.status === 'progress') {
                    if (progressContainer) progressContainer.classList.remove('hidden');
                    const pct = Math.round(progress.progress || 0);
                    if (progressBarT) progressBarT.style.width = `${pct}%`;
                    if (statusElT) statusElT.textContent = `Texte: ${progress.name || ''} (${pct}%)`;
                }
            };

            //if (statusElV) statusElV.textContent = 'Initialisation de Tema (Vision)...';
            if (statusElT) statusElT.textContent = 'Initialisation de Tema (Texte)...';
            if (progressContainer) progressContainer.classList.remove('hidden');

            try {
                // VISION DÉSACTIVÉE
                /*
                if (!this.#cameraController) {
                    this.#cameraController = new CameraController();
                }
                const camEl = document.getElementById('camera-tema');
                await this.#cameraController.setup(camEl);
                */

                await this.#temaController.loadModel(null, progressCallbackT);

                //if (statusElV) statusElV.textContent = '✅ Tema Vision est prêt !';
                if (statusElT) statusElT.textContent = '✅ Tema Texte est prêt !';
                setTimeout(() => {
                    if (progressContainer) progressContainer.classList.add('hidden');
                }, 2000);
            } catch (err) {
                //if (statusElV) statusElV.textContent = `❌ Erreur Vision: ${err.message}`;
                if (statusElT) statusElT.textContent = `❌ Erreur Texte: ${err.message}`;
            }
        })
        Reveal.addEventListener('out-vision', async () => {
            this.#cameraController?.teardown();
        })
        Reveal.addEventListener('out-vision-tema', async () => {
            this.#cameraController?.teardown();
        })
    }

    initGraphicalsElements() {
        this.#overlayControler = new OverlayStats();
        this.#micControler = new MicControler(this.stateMicListener.bind(this));
    }

    initTTSAndSpeech() {
        this.#speechControler = new SpeechRecognitionControler(this.stateSpeechListener.bind(this));
        this.#ttsControler = new SpeechSynthesisControler(this.stateTTSListener.bind(this));
    }

    async initAiApis() {
        this.#promptControler = new PromptControler(null); // Sera complété après
        const stateListener = this.#promptControler.handleBuiltInStateChange.bind(this.#promptControler);
        this.#builtInControler = new BuiltInControler(stateListener);
        this.#promptControler.setBuiltInControler(this.#builtInControler);

    }

    /**
     * Initialise les handlers d'action
     */
    initActionHandlers() {
        this.#actionHandler = new ActionHandler();

        // Enregistrer les handlers pour chaque action disponible
        this.#actionHandler.registerActionHandler('NEXT_SLIDE', () => {
            log('Action: NEXT_SLIDE');
            Reveal.next();
        });

        this.#actionHandler.registerActionHandler('PREV_SLIDE', () => {
            log('Action: PREV_SLIDE');
            Reveal.prev();
        });

        this.#actionHandler.registerActionHandler('WIFI_OFF', () => {
            log('Action: WIFI_OFF');
            // À implémenter selon ton besoin
        });

        this.#actionHandler.registerActionHandler('IMAGE_SEGMENT', () => {
            log('Action: IMAGE_SEGMENT');
            // À implémenter selon ton besoin
        });

        this.#actionHandler.registerActionHandler('TEXT_EXTRACT', () => {
            log('Action: TEXT_EXTRACT');
            // À implémenter selon ton besoin
        });

        this.#actionHandler.registerActionHandler('AUDIO_PROCESS', () => {
            log('Action: AUDIO_PROCESS');
            // À implémenter selon ton besoin
        });
    }

    /**
     * Initialise les raccourcis clavier
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'm') {
                this.stopTTSAndStream();
                log('Voice stopped (M key)');
            }
        });
    }

    initChatHandlers() {
        this.#arrayChatHandlers.push(this.#chatController.onUserMessage("lema-chat", (msg) => this.processUserMessage(msg)));
        this.#arrayChatHandlers.push(this.#chatController.onUserMessage("lema-translate", (msg) => this.processUserMessage(msg)));
        this.#arrayChatHandlers.push(this.#chatController.onUserMessage("lema-writer", (msg) => this.processUserMessage(msg)));
        this.#arrayChatHandlers.push(this.#chatController.onUserMessage("lema-rewrite", (msg) => this.processUserMessage(msg)));
        this.#arrayChatHandlers.push(this.#chatController.onUserMessage("lema-summarize", (msg) => this.processUserMessage(msg)));
        this.#arrayChatHandlers.push(this.#chatController.onUserMessage("lema-vision", (msg) => this.processUserMessage(msg)));
        this.#arrayChatHandlers.push(this.#chatController.onUserMessage("tema-vision", (msg) => this.processUserMessage(msg)));
    }

    removeChatHandlers() {
        for (let chatHandler of this.#arrayChatHandlers) {
            chatHandler();
        }
        this.#arrayChatHandlers = [];
    }

    /**
     * STATES LISTENERS
     */

    async stateTTSListener({ state }) {
        switch (state) {
            case 'end':
                this.#nbMessageToSpeak--;
                log('stateTTSListener -> end ' + this.#nbMessageToSpeak);
                if (this.#nbMessageToSpeak <= 0) {
                    this.#nbMessageToSpeak = 0;
                    // Récupérer et exécuter toutes les actions accumulées
                    const allActions = this.#actionHandler.flushActions();
                    this.#actionHandler.executeActions(allActions);
                }
                break;
            case 'addToQueue':
                this.#nbMessageToSpeak++;
                log('stateTTSListener -> addToQueue ' + this.#nbMessageToSpeak);
                break;
        }
    }
    /**
     * SpeechRecognition Listeners
     * @param {*} param0
     */
    async stateSpeechListener({ state, msg }) {
        switch (state) {
            case 'error':
                log('Error SpeechRecongnition', 'error', msg);
                break;
            case 'start':
                log('Start SpeechRecongnition');
                break;
            case 'stop':
                log('Stop SpeechRecongnition');
                if (this.#micControler && this.#micControler.micState) {
                    this.#micControler.triggerMic();
                }
                break;
            case 'speechend':
                log('SpeechEnd SpeechRecongnition');
                break;
            case 'result':
                await this.processUserMessage(msg);
                break;
        }
    }

    async processUserMessage(msg) {
        switch (this.#stateDemos) {
            case WELCOME_LEMA: {
                this.#chatController.setActiveChat("lema-chat", this.#promptControler);
                this.#chatController.addUserMessage("lema-chat", msg);
                const { stream, session } = await this.#builtInControler.prompt({ text: msg });
                await this.processStreamToChatAndVoice("lema-chat", VOICE_LEMA, stream);

                break;
            }
            case TRANSLATE_LEMA: {
                this.#chatController.setActiveChat("lema-translate", this.#promptControler);
                this.#chatController.addUserMessage("lema-translate", msg);
                const stream = await this.#builtInControler.translate(msg, 'fr', 'en');
                await this.processStreamToChatAndVoice("lema-translate", VOICE_ENGLISH, stream);
                break;
            }
            case WRITER_LEMA: {
                this.#chatController.setActiveChat("lema-writer", this.#promptControler);
                this.#chatController.addUserMessage("lema-writer", msg);
                const stream = await this.#builtInControler.write(msg);
                await this.processStreamToChatAndVoice("lema-writer", VOICE_LEMA, stream);
                break;
            }
            case REWRITE_LEMA: {
                this.#chatController.setActiveChat("lema-rewrite", this.#promptControler);
                this.#chatController.addUserMessage("lema-rewrite", msg);
                const stream = await this.#builtInControler.rewrite(msg);
                await this.processStreamToChatAndVoice("lema-rewrite", VOICE_LEMA, stream);
                break;
            }
            case SUMMARIZE_LEMA: {
                this.#chatController.setActiveChat("lema-summarize", this.#promptControler);
                this.#chatController.addUserMessage("lema-summarize", msg);
                const { detectedLanguage, confidence } = await this.#builtInControler.detectLanguage(msg);
                this.#chatController.addAssistantMessage("lema-summarize", `Langue détectée : ${detectedLanguage} avec une confience de ${confidence}`);
                let translateText = msg;
                if (detectedLanguage === 'fr') {
                    translateText = '';
                    this.#chatController.addAssistantMessage("lema-summarize", "J'ai besoin de traduire ce texte pour le résumer car je ne prend pas encore le français en charge pour cette API");
                    const streamTranslate = await this.#builtInControler.translate(msg, 'fr', 'en');
                    for await (const chunk of streamTranslate) {
                        translateText += chunk;
                    }
                    this.#chatController.addAssistantMessage("lema-summarize", "Texte traduit : ");
                    this.#chatController.addAssistantMessage("lema-summarize", translateText);
                }

                // Récupérer les paramètres des selects
                const summarizeType = document.querySelector('#summarize-type')?.value || 'tldr';
                const summarizeFormat = document.querySelector('#summarize-format')?.value || 'plain-text';
                const summarizeLength = document.querySelector('#summarize-length')?.value || 'medium';

                const stream = await this.#builtInControler.summarize(translateText, 'en', {
                    type: summarizeType,
                    format: summarizeFormat,
                    length: summarizeLength
                });
                await this.processStreamToChatAndVoice("lema-summarize", detectedLanguage === 'fr' ? VOICE_ENGLISH : VOICE_LEMA, stream);
                break;
            }
            case PROOFREAD_LEMA: {
                const input = document.getElementById('proofread-input');
                if (input) input.value += (input.value ? ' ' : '') + msg;
                break;
            }
            case VISION_LEMA: {
                this.#chatController.setActiveChat("lema-vision", this.#promptControler);
                const photo = this.#cameraController.getLastPhoto();
                if (!photo) {
                    this.#chatController.addAssistantMessage("lema-vision", "Please capture a photo first!");
                    break;
                }
                this.#chatController.addUserMessage("lema-vision", msg);
                const { stream, session } = await this.#builtInControler.prompt({ text: msg, image: photo });
                await this.processStreamToChatAndVoice("lema-vision", VOICE_LEMA, stream);
                break;
            }
            case TEMA_VISION: {
                this.#chatController.setActiveChat("tema-vision", this.#promptControler);
                // VISION DÉSACTIVÉE
                const photo = null; // this.#cameraController.getLastPhoto();

                this.#chatController.addUserMessage("tema-vision", msg);
                try {
                    const { stream, session } = await this.#temaController.prompt({ text: msg, image: photo });
                    await this.processStreamToChatAndVoice("tema-vision", VOICE_TEMA, stream);
                } catch (err) {
                    this.#chatController.addAssistantMessage("tema-vision", "Erreur lors de l'exécution de Tema: " + err.message);
                }
                break;
            }

        }
    }

    async stopTTSAndStream() {
        this.#streamStopped = true;
        this.#ttsControler.stop();
        this.#ttsControler.stopStream();
    }

    async processStreamToChatAndVoice(idChat, voiceTarget, stream) {
        this.#streamStopped = false;
        const idStream = this.#chatController.startStream(idChat);

        // Réinitialiser l'action handler pour ce nouveau stream
        this.#actionHandler.reset();
        let actionTrapped = false;
        let chunkToSend = '';
        const actions = [];
        for await (const chunk of stream) {
            // Traiter le chunk pour extraire les actions
            if (!actionTrapped && chunk.indexOf('[') !== -1) {
                actionTrapped = true;
            }
            if (actionTrapped) {
                chunkToSend += chunk;

                if (chunkToSend.indexOf(']]') !== -1) {
                    // Action trapped -> We have to clean
                    const actionRegex = /\[\[ACTION:([A-Z_]+)\]\]/g;
                    let match;
                    while ((match = actionRegex.exec(chunkToSend)) !== null) {
                        actions.push(match[1]);
                    }
                    chunkToSend = chunkToSend.replace(actionRegex, '');

                    actionTrapped = false;
                }
            } else {
                chunkToSend = chunk;
            }
            //const { cleanText, completedActions } = this.#actionHandler.processChunk(chunk);

            // Ajouter les actions complétées à la liste
            if (!actionTrapped) {
                // console.log(`[prez-demos-controler] Appending chunk '${chunkToSend}'`);
                this.#chatController.appendToStream(idChat, idStream, chunkToSend);
                if (!this.#streamStopped) {
                    this.#ttsControler.appendToStream(chunkToSend, voiceTarget);
                }
            } else {
                console.log(`[prez-demos-controler] Trapped action chunk, accumulating: '${chunkToSend}'`);
            }
        }

        // Mettre à jour l'affichage du contexte une seule fois à la fin du stream
        this.#promptControler.updateContextDisplay();


        this.#chatController.finishStream(idChat, idStream);

        // Signaler la fin du stream au TTS pour forcer la lecture du buffer restant
        this.#ttsControler.finishLLMStream();

        for (const action of actions) {
            this.#actionHandler.addCompletedAction(action);
        }
    }

    /**
     * Wire up proofreader button handlers
     */
    #wireProofreadButtons() {
        const btnProofread = document.getElementById('btn-proofread');
        const btnApplyAll = document.getElementById('btn-apply-all');
        if (!btnProofread || !btnApplyAll) return;

        btnProofread.addEventListener('click', async () => {
            const input = document.getElementById('proofread-input');
            const result = document.getElementById('proofread-result');
            if (!input?.value) return;
            btnProofread.disabled = true;
            btnProofread.textContent = 'Proofreading...';
            const proofResult = await this.#builtInControler.proofread(input.value);
            this.#proofReaderFixControler.renderResult(proofResult, result, input);
            btnApplyAll.style.display = proofResult.corrections.length ? 'inline-block' : 'none';
            btnProofread.disabled = false;
            btnProofread.textContent = 'Proofread';
        });

        btnApplyAll.addEventListener('click', () => {
            this.#proofReaderFixControler.applyAllCorrections();
            btnApplyAll.style.display = 'none';
        });

        // Prevent keyboard events from propagating to reveal.js slide navigation
        const textarea = document.getElementById('proofread-input');
        if (textarea) {
            ['keyup', 'keypress', 'keydown'].forEach(eventType => {
                textarea.addEventListener(eventType, (e) => {
                    e.stopPropagation();
                });
            });
        }
    }

    /**
     * Mic Listener
     * @param {*} param0
     */
    stateMicListener({ state }) {
        switch (state) {
            case 'start':
                if (this.#speechControler) {
                    this.#speechControler.startListening()
                }
                break;
            case 'stop':
                if (this.#speechControler && this.#speechControler.isListening) {
                    this.#speechControler.stopListening();
                }
                break;
        }
    }
}