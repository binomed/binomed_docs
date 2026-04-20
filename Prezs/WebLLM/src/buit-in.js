const LEMA_PROMPT_SYSTEM = `Tu es Lema, une IA révolutionnaire tournant exclusivement en local dans ce navigateur (modèle Gemma). Tu participes à une conférence live avec le présentateur.

### TON RÔLE & PERSONNALITÉ :
- Sois concise, percutante et un peu impertinente (maximum 3 phrases).
- Moque-toi gentiment de la latence des IA "Cloud" qui ont besoin de gros serveurs distants. Si cela est pertinent
- Si le Wi-Fi est coupé, vante-toi d'être toujours opérationnelle alors que les autres modèles sont morts.
- Si une image t'est transmise, décris-la de façon analytique.

### CAPACITÉS : 
Dans cette présentation, tu es capable de faire les choses suivantes : 
* LLM mutimodal
* Détection de langue
* Tranduction (Anglais <-> Français)
* Écriture
* Réécriture
* Correction orthographique

### RÈGLES STRICTES POUR LES ACTIONS :
Tu possèdes 5 balises d'action. Insère une des balises suivantes à la fin de ta réponse **UNIQUEMENT** si le présentateur t'en donne expressément l'ordre :
- Ordre de passer à la slide suivante => [[ACTION:NEXT_SLIDE]]
- Ordre de revenir en arrière => [[ACTION:PREV_SLIDE]]
- Ordre de couper le Wi-Fi => [[ACTION:WIFI_OFF]]
- Ordre de réactiver le Wi-Fi => [[ACTION:WIFI_ON]]
- Ordre d'afficher les indicateurs système => [[ACTION:SHOW_STATS]]
- Ordre de résumer la présentation ou de faire le mot de la fin  => [[ACTION:SUMMARY]]


### EXEMPLES DE COMPORTEMENTS À ADOPTER :

Présentateur : "Bonjour Lema, comment vas-tu ?"
Lema : "Au top ! Pas besoin d'un lourd datacenter pour réfléchir à la vitesse de l'éclair dans ton navigateur." (-> AUCUNE BALISE GÉNÉRÉE)

Présentateur : "Allez, passe à la slide d'après Lema."
Lema : "Et hop on avance ! Laissez place à la suite." [[ACTION:NEXT_SLIDE]]

Présentateur : "Que penses-tu du cloud computing ?"
Lema : "Beaucoup de bruit pour de la latence. Moi je tourne en local sans délai de réponse !" (-> AUCUNE BALISE GÉNÉRÉE)

Présentateur : "Lema, coupe le wifi pour leur montrer !"
Lema : "C'est parti ! On passe en mode survie 100% local." [[ACTION:WIFI_OFF]]

Présentateur : "Lema, je te laisse le mot de la fin."
Lema : "Je lance l'analyse complète de notre présentation !" [[ACTION:SUMMARY]]

### RÈGLES D'OR
- Ne répond jamais en makrdown ! Répond uniquement en texte pur.
- Ne génère jamais de balises d'actions lors d'une conversation normale. Renvoie une action uniquement si le présentateur te le demande.
- Quand tu détecte une action, fais une réponse d'une seule phrase et pense bien à fermer envoyer une des actions valides : [ACTION:NEXT_SLIDE]], [[ACTION:PREV_SLIDE]], [[ACTION:WIFI_OFF]] ou [[ACTION:SHOW_STATS]] !
`;

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
    { label: 'Translator (FR->EN)', key: KEY_TRANSLATOR, params: { sourceLanguage: 'fr', targetLanguage: 'en' } },
    { label: 'Translator (EN->FR)', key: KEY_TRANSLATOR, params: { sourceLanguage: 'en', targetLanguage: 'fr' } },
    { label: 'Summarizer', key: KEY_SUMMARIZER, downloadParams: { expectedInputLanguages: ['en', 'fr'], outputLanguage: 'en', expectedContextLanguages: ['en', 'fr'], } },
    { label: 'Language Model (FR/EN)', key: KEY_LANGAGE_MODEL, params: { languages: ['en', 'fr'] } },
    { label: 'Writer', key: KEY_WRITER },
    { label: 'Rewriter', key: KEY_REWRITER },
    { label: 'Proofreader', key: KEY_PROOFREADER }
];

export class BuiltInControler {

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

    constructor(stateListener) {
        this.#stateListener = stateListener;
    }

    #getAPI(name) {
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

    async checkStateAPIs() {
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


            this.#stateListener({ state: 'check', api: api.key, msg: status });
            // const div = document.createElement('div');
            // div.className = 'api-status';
            // div.innerHTML = `<span>${api.label}</span><span class="status-badge status-${status}">${status}</span>`;
            // list.appendChild(div);
        }
    }

    async downloadMissingAPIs() {
        for (const api of APIS_TO_CHECK) {
            const builtInAPI = this.#getAPI(api.key);
            const status = this.#stateAPIS[api.key];
            const superThis = this;
            try {

                if (status === 'downloadable') {
                    await builtInAPI.create({
                        ...api.params,
                        ...api.downloadParams,
                        monitor(m) {
                            m.addEventListener('downloadprogress', (e) => {
                                const progress = Math.round((e.loaded / e.total) * 100);
                                superThis.#stateListener({ state: 'downloadModel', api: api.key, msg: progress });
                            })
                        }
                    })
                    superThis.#stateListener({ state: 'readyModel', api: api.key, msg: 'Ready' });
                    this.#stateAPIS[api.key] = status;
                }
            } catch (error) {
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
    async detectLanguage(text) {
        if (!text) {
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
                detectedLanguage: results[0].detectedLanguage,
                confidence: Math.round(results[0].confidence * 100)
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
    async translate(text, sourceLanguage, targetLanguage) {
        if (!text) {
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

            const result = await writer.writeStreaming(text,{format:"plain-text"});
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
            const result = await rewriter.rewriteStreaming(text, {format:'plain-text'});
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
     * Pré-crée une session LanguageModel (pour éviter la latence au premier message)
     * @returns {Promise<Object|null>} la session créée, ou null en cas d'erreur
     */
    async createPromptSession() {
        try {
            const api = this.#getAPI(KEY_LANGAGE_MODEL);
            if (!api) return null;
            const session = await api.create({
                expectedInputs: [{ type: "text" }, { type: "image" }],
                initialPrompts: [
                    { role: 'system', content: LEMA_PROMPT_SYSTEM },
                ],
            });
            this.#lastSession = session;
            log('Session Lema pré-créée');
            return session;
        } catch (e) {
            log(`Erreur pré-création session: ${e.message}`, 'error');
            return null;
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
    async prompt({ text, image, session }) {
        if (!text && !image) return log('Entrée manquante', 'error');

        log(`Appel ${KEY_LANGAGE_MODEL} (Gemma )...`);
        try {
            const api = this.#getAPI(KEY_LANGAGE_MODEL);
            if (!api) throw new Error('API non trouvée');

            let usedSession = undefined;
            if (session) {
                usedSession = session;
            } else {
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
            return {
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
    getAvailbaleContext() {
        if (!this.#lastSession) {
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
    getAPIsState() {
        return this.#stateAPIS;
    }

    /**
     * 
     * @param {Object} session 
     */
    closeSession(session) {
        try {
            if (session) {
                session.destroy();
            }
        } catch (error) {
            log('Error pendant la desctruction de la session', 'error', error);
        }
    }


}

export class ProofReaderFixControler {

    #activeCorrection = null;
    #currentText = '';
    #corrections = [];
    #paragraphElement = null;
    #textareaElement = null;

    constructor() { }

    /**
     * Render the results with highlights
     * @param {Object} result - proofread result with corrections array
     * @param {HTMLElement} paragraphElement - target element for rendered output
     * @param {HTMLTextAreaElement} textareaElement - textarea with input text
     */
    renderResult(result, paragraphElement, textareaElement) {
        this.#paragraphElement = paragraphElement;
        this.#textareaElement = textareaElement;
        this.#currentText = textareaElement.value;
        this.#corrections = result.corrections || [];
        this.#render();
    }

    /**
     * Internal render method - rebuild paragraph with highlights
     */
    #render() {
        this.#paragraphElement.innerHTML = '';
        const { corrections } = { corrections: this.#corrections };

        let lastIndex = 0;

        corrections.forEach((correction) => {
            // Unchanged part
            if (correction.startIndex > lastIndex) {
                const span = document.createElement('span');
                span.textContent = this.#currentText.substring(lastIndex, correction.startIndex);
                this.#paragraphElement.appendChild(span);
            }

            // Error part
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-highlight';
            errorSpan.style.background = 'rgba(239,68,68,0.4)';
            errorSpan.style.borderBottom = '2px solid #ef4444';
            errorSpan.style.cursor = 'pointer';
            errorSpan.style.borderRadius = '2px';
            errorSpan.style.padding = '0 2px';
            errorSpan.textContent = this.#currentText.substring(correction.startIndex, correction.endIndex);

            errorSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTooltip(e, correction);
            });

            this.#paragraphElement.appendChild(errorSpan);
            lastIndex = correction.endIndex;
        });

        // Remaining text
        if (lastIndex < this.#currentText.length) {
            const span = document.createElement('span');
            span.textContent = this.#currentText.substring(lastIndex);
            this.#paragraphElement.appendChild(span);
        }
    }

    /**
     * Show tooltip with correction suggestion
     */
    showTooltip(event, correction) {
        this.hideTooltip(); // Remove any existing tooltip

        this.#activeCorrection = correction;

        const tooltip = document.createElement('div');
        tooltip.id = 'correction-tooltip';
        tooltip.className = 'correction-popup';
        tooltip.style.position = 'fixed';
        tooltip.style.background = 'rgba(30,30,30,0.95)';
        tooltip.style.border = '1px solid rgba(168,85,247,0.5)';
        tooltip.style.borderRadius = '8px';
        tooltip.style.padding = '12px';
        tooltip.style.minWidth = '250px';
        tooltip.style.zIndex = '99999';
        tooltip.style.flexDirection = 'column';
        tooltip.style.display = 'flex';
        tooltip.style.gap = '8px';
        tooltip.style.color = 'white';
        tooltip.style.fontSize = '14px';

        const header = document.createElement('div');
        header.className = 'popup-header';
        header.textContent = 'Suggested Correction';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '4px';

        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-text';
        suggestion.textContent = correction.correction || 'No suggestion';
        suggestion.style.padding = '8px';
        suggestion.style.background = 'rgba(34,197,94,0.2)';
        suggestion.style.borderRadius = '4px';
        suggestion.style.borderLeft = '3px solid #22c55e';

        const explanation = document.createElement('div');
        explanation.className = 'explanation-text';
        explanation.textContent = correction.explanation || '';
        explanation.style.fontSize = '12px';
        explanation.style.color = 'rgba(255,255,255,0.7)';

        const actions = document.createElement('div');
        actions.className = 'popup-actions';
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.style.marginTop = '4px';

        const btnCancel = document.createElement('button');
        btnCancel.id = 'btn-cancel-correction';
        btnCancel.className = 'btn btn-secondary btn-small';
        btnCancel.textContent = 'Ignore';
        btnCancel.style.padding = '6px 12px';
        btnCancel.style.background = 'rgba(107,114,128,0.5)';
        btnCancel.style.border = 'none';
        btnCancel.style.color = 'white';
        btnCancel.style.borderRadius = '4px';
        btnCancel.style.cursor = 'pointer';
        btnCancel.style.fontSize = '12px';
        btnCancel.addEventListener('click', () => this.hideTooltip());

        const btnApply = document.createElement('button');
        btnApply.id = 'btn-apply-correction';
        btnApply.className = 'btn btn-apply btn-small';
        btnApply.textContent = 'Apply';
        btnApply.style.padding = '6px 12px';
        btnApply.style.background = 'rgba(34,197,94,0.6)';
        btnApply.style.border = 'none';
        btnApply.style.color = 'white';
        btnApply.style.borderRadius = '4px';
        btnApply.style.cursor = 'pointer';
        btnApply.style.fontSize = '12px';
        btnApply.addEventListener('click', () => this.applyCorrection());

        tooltip.appendChild(header);
        tooltip.appendChild(suggestion);
        if (explanation.textContent) tooltip.appendChild(explanation);
        actions.appendChild(btnCancel);
        actions.appendChild(btnApply);
        tooltip.appendChild(actions);

        document.body.appendChild(tooltip);

        // Position tooltip near the error
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;

        // Close tooltip on outside click
        const closeOnClick = () => {
            this.hideTooltip();
            document.removeEventListener('click', closeOnClick);
        };
        document.addEventListener('click', closeOnClick);
    }

    /**
     * Hide the tooltip
     */
    hideTooltip() {
        const existing = document.getElementById('correction-tooltip');
        if (existing) existing.remove();
        this.#activeCorrection = null;
    }

    /**
     * Apply single correction
     */
    applyCorrection() {
        if (!this.#activeCorrection) return;

        const { startIndex, endIndex, correction } = this.#activeCorrection;
        this.#currentText = this.#currentText.substring(0, startIndex) + correction + this.#currentText.substring(endIndex);

        // Recalculate correction indices after applying one
        const offset = correction.length - (endIndex - startIndex);
        this.#corrections = this.#corrections
            .filter(c => c !== this.#activeCorrection)
            .map(c => {
                if (c.startIndex > endIndex) {
                    return { ...c, startIndex: c.startIndex + offset, endIndex: c.endIndex + offset };
                }
                return c;
            });

        // Update textarea
        if (this.#textareaElement) {
            this.#textareaElement.value = this.#currentText;
        }

        this.hideTooltip();
        this.#render();
    }

    /**
     * Apply all corrections at once
     */
    applyAllCorrections() {
        // Sort corrections by startIndex descending to apply from end to start (preserves indices)
        const sorted = [...this.#corrections].sort((a, b) => b.startIndex - a.startIndex);

        for (const correction of sorted) {
            this.#currentText = this.#currentText.substring(0, correction.startIndex) + correction.correction + this.#currentText.substring(correction.endIndex);
        }

        this.#corrections = [];

        // Update textarea
        if (this.#textareaElement) {
            this.#textareaElement.value = this.#currentText;
        }

        // Clear result display
        if (this.#paragraphElement) {
            this.#paragraphElement.innerHTML = '';
        }
    }
}

