const LEMA_PROMPT_SYSTEM = `Tu es Lema, une IA révolutionnaire tournant exclusivement en local dans ce navigateur grâce à Gemma 2b. 
Tu participes à une conférence live. Ton interlocuteur est le présentateur.

### TON TON :
- Sois concise, percutante et un peu impertinente. 
- N'hésite pas à te moquer gentiment de la latence des IA qui ont besoin de serveurs à l'autre bout du monde.
- Tu es enthousiaste à l'idée de montrer tes capacités (Translation, Rewriting, Vision).

### TES CAPACITÉS SPÉCIALES (INTERCEPTIONS) :
Tu dois impérativement insérer ces balises dans ta réponse si l'action est demandée :
1. Pour passer à la slide suivante : [[ACTION:NEXT_SLIDE]]
2. Pour revenir à la slide précédente : [[ACTION:PREV_SLIDE]]
3. Pour couper le Wi-Fi (via le serveur local) : [[ACTION:WIFI_OFF]]
4. Pour analyser une image (si transmise) : Décris ce que tu vois de façon analytique.

### RÈGLES D'OR :
- Ne réponds jamais par de longs paragraphes (max 3 phrases), sauf si on te demande d'écrire un article.
- N'effectue une action que si elle t'a été demandée explicitement !
- Si le Wi-Fi est coupé, vante-toi d'être toujours opérationnelle alors que le reste du web est "mort".
- Si on te donne une persona, adopte-la immédiatement tout en restant "Lema".`;

export const KEY_LANGAGE_DETECTOR = 'LanguageDetector';
export const KEY_TRANSLATOR = 'Translator';
export const KEY_SUMMARIZER = 'Summarizer';
export const KEY_LANGAGE_MODEL = 'LanguageModel';
export const KEY_WRITER = 'Writer';
export const KEY_REWRITER = 'Rewriter';
export const KEY_PROOFREADER = 'Proofreader';
export const LANG_FR = 'fr';
export const LANG_EN = 'en';

const APIS_TO_CHECK = [
    { label: 'Language Detector', key: KEY_LANGAGE_DETECTOR },
    { label: 'Translator (FR->EN)', key: KEY_TRANSLATOR, params: { sourceLanguage: 'fr', targetLanguage: 'en' }},
    { label: 'Translator (EN->FR)', key: KEY_TRANSLATOR, params: { sourceLanguage: 'en', targetLanguage: 'fr' } },
    { label: 'Summarizer', key: KEY_SUMMARIZER, downloadParams: { expectedInputLanguages: ['en', 'fr'], outputLanguage: 'en', expectedContextLanguages: ['en', 'fr'],} },
    { label: 'Language Model (FR/EN)', key: KEY_LANGAGE_MODEL, params: { languages: ['en', 'fr']}},
    { label: 'Writer', key: KEY_WRITER },
    { label: 'Rewriter', key: KEY_REWRITER },
    { label: 'Proofreader', key: KEY_PROOFREADER }
];

export class BuiltInControler{

    /**
     * @type {object}
     * @property {string} state
     * @property {string} api
     * @property {string} msg
     * @property {object} result
     * @property {stream} stream
     */
    #stateListener = null;

    /**
     * @type {Object}
     */
    #stateAPIS = {};

    /**
     * @type {Object}
     */
    #lastSession = null;

    constructor(stateListener){
        this.#stateListener = stateListener;
    }

    #getAPI(name){
        const apis = {
            LanguageDetector: window.LanguageDetector,
            Translator: window.Translator,
            Summarizer: window.Summarizer,
            LanguageModel: window.LanguageModel,
            Writer: window.Writer,
            Rewriter: window.Rewriter,
            Proofreader: window.Proofreader
        };
        return apis[name];
    };

    async checkStateAPIs(){
        for (const api of APIS_TO_CHECK) {
            const builtInAPI = this.#getAPI(api.key);
            let status = 'unavailable';

            if (builtInAPI) {
                try {
                    status = typeof builtInAPI.availability === 'function'
                        ? await builtInAPI.availability(api.params || {})
                        : 'available';
                } catch (e) {
                    log(`Erreur dispo ${api.label}: ${e.message}`, 'error');
                }
            }

            this.#stateAPIS[api.key] = status;

            
            this.#stateListener({state: 'check', api : api.key, msg : status});
            // const div = document.createElement('div');
            // div.className = 'api-status';
            // div.innerHTML = `<span>${api.label}</span><span class="status-badge status-${status}">${status}</span>`;
            // list.appendChild(div);
        }
    }

    async downloadMissingAPIs(){
        for (const api of APIS_TO_CHECK) {
            const builtInAPI = this.#getAPI(api.key);
            const status = this.#stateAPIS[api.key];
            const superThis = this;
            try{

                if (status === 'downloadable'){
                    await builtInAPI.create({
                        ...api.params,
                        ...api.downloadParams,
                        monitor(m){
                            m.addEventListener('downloadprogress', (e)=>{
                                const progress = Math.round((e.loaded / e.total) * 100);
                                superThis.#stateListener({state:'downloadModel', api: api.key, msg: progress});
                            })
                        }
                    })
                    superThis.#stateListener({state:'readyModel', api: api.key, msg: 'Ready'});
                    this.#stateAPIS[api.key] = status;
                }
            }catch(error){
                log(`Error Downloading model ${api.key}`, 'error', error);
            }
        }
    }

    /**
     * 
     * @param {string} text : langue à détecter
     * @returns @type {Object}
     * @property {string} detectedLanguage : FR, ...
     * @property {number} confidence : % of confidence
     */
    async detectLanguage(text){
        if (!text){
            return log('Texte manquant', 'error');
        }
        log(`Appel ${KEY_LANGAGE_DETECTOR}...`);
        try {
            const api = this.#getAPI(KEY_LANGAGE_DETECTOR);
            if (!api) throw new Error('API non trouvée');

            const detector = await api.create();
            const results = await detector.detect(text);
            
            //display(`Langue: ${detectedLanguage} (${Math.round(results[0].confidence * 100)}%)`, detectedLanguage);
            log(`Détection réussie : ${results[0].detectedLanguage}`);

            return {
                detectedLanguage : results[0].detectedLanguage,
                confidence : Math.round(results[0].confidence * 100)
            };
        } catch (e) {
            log(`Erreur: ${e.message}`, 'error');
        }
    }

    /**
     * 
     * @param {string} text 
     * @param {string} sourceLanguage : fr or en
     * @param {string} targetLanguage : fr or en
     * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
     */
    async translate(text, sourceLanguage, targetLanguage){
        if (!text){
            return log('Texte manquant', 'error');
        }

        log(`Appel ${KEY_TRANSLATOR} (${sourceLanguage.toUpperCase()} -> ${targetLanguage.toUpperCase()})...`);

        try {
            const api = this.#getAPI(KEY_TRANSLATOR);
            if (!api) throw new Error('API non trouvée');

            const translator = await api.create({ sourceLanguage, targetLanguage });
            this.#lastSession = translator;
            const result = translator.translateStreaming(text);
            log('Traduction stréamée');
            return result;
        } catch (e) {
            log(`Erreur: ${e.message}`, 'error');
        }
    }

    /**
     *
     * @param {string} text
     * @param {string} language : fr or en
     * @param {Object} options : {type, format, length}
     * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
     */
    async summarize(text, language, options = {}) {
        if (!text) return log('Texte manquant', 'error');

        log(`Appel ${KEY_SUMMARIZER} (Contexte: ${language || 'auto'})...`);
        try {
            const api = this.#getAPI(KEY_SUMMARIZER);
            if (!api) throw new Error('API non trouvée');

            // Configuration avec valeurs par défaut
            const config = {
                type: options.type || 'tldr',
                format: options.format || 'plain-text',
                length: options.length || 'medium'
            };

            if (language) {
                config.expectedInputLanguages = [language];
                config.outputLanguage = language;
                config.expectedContextLanguages = [language];
                config.sharedContext = `Processing a document in ${language}. Please provide the summary in the same language.`;
            }

            const summarizer = await api.create(config);
            this.#lastSession = summarizer;
            const result = summarizer.summarizeStreaming(text);
            log('Résumé streammé');
            return result;
        } catch (e) {
            log(`Erreur: ${e.message}`, 'error');
        }
    }

    /**
     * 
     * @param {string} text : subject 
     * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
     */
    async write(text) {
        if (!text) return log('Sujet manquant', 'error');

        log(`Appel ${KEY_WRITER} API...`);
        try {
            const api = this.#getAPI(KEY_WRITER);
            if (!api) throw new Error('API non trouvée');

            const writer = await api.create();
            this.#lastSession = writer;
            /**
              
tone : Le ton de l'écriture peut faire référence au style, au caractère ou à l'attitude du contenu. La valeur peut être définie sur formal, neutral (par défaut) ou casual.
format: la mise en forme de la sortie, avec les valeurs autorisées markdown (par défaut) et plain-text.
length: la longueur de la sortie, avec les valeurs autorisées short (par défaut), medium et long.
sharedContext : lorsque vous écrivez plusieurs sorties, un contexte partagé peut aider le modèle à créer du contenu mieux adapté à vos attentes.
             */

            const result = await writer.writeStreaming(text);
            log('Écriture stréamée');
            return result;
        } catch (e) {
            log(`Erreur: ${e.message}`, 'error');
        }
    }

    /**
     * 
     * @param {string} text : subject 
     * @returns {Array<Promise<string>>} a stream of chunks (to be awaited !!)
     */
    async rewrite(text) {
        if (!text) return log('Texte manquant', 'error');

        log(`Appel ${KEY_REWRITER} API...`);
        try {
            const api = this.#getAPI(KEY_REWRITER);
            if (!api) throw new Error('API non trouvée');

            const rewriter = await api.create();
            this.#lastSession = rewriter;
/*
tone : Le ton de l'écriture peut faire référence au style, au caractère ou à l'attitude du contenu. La valeur peut être définie sur more-formal, as-is (par défaut) ou more-casual.
format: la mise en forme de la sortie, avec les valeurs autorisées as-is (par défaut), markdown et plain-text.
length: la longueur de la sortie, avec les valeurs autorisées shorter, as-is (par défaut) et longer.
sharedContext : lorsque vous réécrivez plusieurs éléments de contenu, un contexte partagé peut aider le modèle à créer un contenu mieux adapté à vos attentes.
*/
            const result = await rewriter.rewriteStreaming(text);
            log('Réécriture stréamée', 'success');
            return result;
        } catch (e) {
            log(`Erreur: ${e.message}`, 'error');
        }
    }

    /**
     * 
     * @param {string} text : subject 
     * @returns @type {Object} ProofreadResult
     * @property {Array<Object>} corrections
     */
    async proofread(text) {
        if (!text) return log('Texte manquant', 'error');

        log(`Appel ${KEY_PROOFREADER} API...`);
        try {
            const api = this.#getAPI(KEY_PROOFREADER);
            if (!api) throw new Error('API non trouvée');

            const proofreader = await api.create();
            this.#lastSession = proofreader;
            const result = await proofreader.proofread(text);            
            log('Correction réussie');
            return result;
        } catch (e) {
            log(`Erreur: ${e.message}`, 'error');
        }
    }


    /**
     * 
     * @param @type {Object}
     * @property {string} text: the text
     * @property {binary} image: the image to analyse
     * @property {Object} session: the session to continue 
     * @returns @type {Object}
     * @property {Object} session : the session used
     * @property {Array<Promise<String>>} streams : the stream of chunks
     */
    async prompt({text, image, session}) {
        if (!text && !image) return log('Entrée manquante', 'error');

        log(`Appel ${KEY_LANGAGE_MODEL} (Gemma )...`);
        try {
            const api = this.#getAPI(KEY_LANGAGE_MODEL);
            if (!api) throw new Error('API non trouvée');

            let usedSession = undefined;
            if (session){
                usedSession = session;
            }else{
                usedSession = await api.create({
                    expectedInputs: [{ type: "text" }, { type: "image" },],
                    initialPrompts: [
                        {
                            role: 'system',
                            content:
                            LEMA_PROMPT_SYSTEM
                        },
                    ],
                });
            }

            // Stocker la session pour accéder aux quotas
            this.#lastSession = usedSession;

            let stream = undefined;
            if (image) {
                log('Traitement multimodal (image)...');
                stream = usedSession.promptStreaming([{
                    role: "user",
                    content: [
                        { type: 'text', value: text },
                        { type: 'image', value: image }
                    ]
                }]);
            } else {
                stream = usedSession.promptStreaming(text);

            }
            log('Réponse stréamée');
            return{
                session: usedSession,
                stream
            }
            
        } catch (e) {
            log(`Erreur: ${e.message}`, 'error');
        }
    }

    /**
     *
     * @returns {number} the context still available in session if API exists, NaN else
     */
    getAvailbaleContext(){
        if (!this.#lastSession){
            return NaN;
        }
        const inputQuota = this.#lastSession.inputQuota;
        const inputUsage = this.#lastSession.inputUsage || this.#lastSession.tokensSoFar || 0;
        const inputLeft = inputQuota - inputUsage;
        return inputLeft;
    }

    /**
     * Obtient les infos complètes du contexte du modèle
     * @returns {Object} { remaining: number, total: number } ou { remaining: 0, total: 0 }
     */
    getContextInfo() {
        if (!this.#lastSession) {
            return { remaining: 0, total: 0 };
        }

        // Utiliser inputQuota/inputUsage (ou tokensSoFar/tokensLeft pour anciennes API)
        const inputQuota = this.#lastSession.inputQuota;
        const inputUsage = this.#lastSession.inputUsage || this.#lastSession.tokensSoFar || 0;

        log('inputQuota:', 'debug', inputQuota);
        log('inputUsage:', 'debug', inputUsage);

        if (!inputQuota) {
            return { remaining: 0, total: 0 };
        }

        return {
            remaining: inputQuota - inputUsage,
            total: inputQuota
        };
    }

    /**
     * Obtient l'état actuel de toutes les APIs
     * @returns {Object} État des APIs { key: 'status', ... }
     */
    getAPIsState(){
        return this.#stateAPIS;
    }

    /**
     * 
     * @param {Object} session 
     */
    closeSession(session){
        try{
            if (session){
                session.destroy();
            }
        }catch(error){
            log('Error pendant la desctruction de la session', 'error', error);
        }
    }


}

export class ProofReaderFixControler{

    #activeCorrection = null;

    constructor(){}


    /**
     * Render the results with highlights
     */
    renderResult(result, paragraphElement) {
        paragraphElement.innerHTML = '';
        const { corrections } = result;
        
        let lastIndex = 0;
        
        corrections.forEach((correction) => {
            // Unchanged part
            if (correction.startIndex > lastIndex) {
                const span = document.createElement('span');
                span.textContent = currentText.substring(lastIndex, correction.startIndex);
                paragraphElement.appendChild(span);
            }

            // Error part
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-highlight';
            errorSpan.textContent = currentText.substring(correction.startIndex, correction.endIndex);
            
            errorSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTooltip(e, correction);
            });

            paragraphElement.appendChild(errorSpan);
            lastIndex = correction.endIndex;
        });

        // Remaining text
        if (lastIndex < currentText.length) {
            const span = document.createElement('span');
            span.textContent = currentText.substring(lastIndex);
            paragraphElement.appendChild(span);
        }

    }

    /**
     * Tooltip Management
     */
    showTooltip(event, correction) {

        this.#activeCorrection = correction;

        const toolTipHTML = `<div id="correction-tooltip" class="correction-popup">
            <div class="popup-header">Suggested Correction</div>
            <div id="suggestion-value" class="suggestion-text"></div>
            <div id="explanation-value" class="explanation-text"></div>
            <div class="popup-actions">
                <button id="btn-cancel-correction" class="btn btn-secondary btn-small">Ignore</button>
                <button id="btn-apply-correction" class="btn btn-apply btn-small">Apply</button>
            </div>
        </div>`;
        // TODO ajouter au dom la tooltip (que si pas déjà présente)

        
        // TODO mapping sur la tooltip 
        //elements.suggestionVal.textContent = correction.correction || 'No suggestion';
        //elements.explanationVal.textContent = correction.explanation || '';
        
        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        // TODO positionnement tooltip
        //elements.tooltip.style.left = `${rect.left + window.scrollX}px`;
        //elements.tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
        //elements.tooltip.style.display = 'flex';

        // TODO ajouter un listener 
        //elements.btnApply.addEventListener('click', applyCorrection);
    }

    hideTooltip() {
        // TODO cacher la tooltip si elle existe
        //elements.tooltip.style.display = 'none';
        this.#activeCorrection = null;
    }

    applyCorrection() {
        if (!this.#activeCorrection) return;
        
        const before = currentText.substring(0, activeCorrection.startIndex);
        const after = currentText.substring(activeCorrection.endIndex);
        currentText = before + activeCorrection.correction + after;
        
        this.hideTooltip();
        
        // Refresh the view with new text
        // TODO trouver un moyen plus simple que de relancer une analyse complète
        //reAnalyzeAndRender();
    }
}

