const promptSystem = `Tu es Lema, une IA révolutionnaire tournant exclusivement en local dans ce navigateur grâce à Gemma 2b. 
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
- Si le Wi-Fi est coupé, vante-toi d'être toujours opérationnelle alors que le reste du web est "mort".
- Si on te donne une persona, adopte-la immédiatement tout en restant "Lema".`;

/**
 * @file main.js
 * @description Version simplifiée pour tester les API d'IA intégrées de Chrome.
 * Approche KISS : pas d'abstraction complexe, appels directs.
 * Utilise les namespaces PascalCase (ex: window.LanguageModel).
 */

const defaultLogIdElement = 'log-display';

// --- État de la session ---
let detectedLanguage = null;

const display = (text, lang = null) => {
    log(text,defaultLogIdElement,  'info');
    document.getElementById('output-display').textContent = text;

    // Hook pour le TTS
    const autoRead = document.getElementById('auto-read');
    if (autoRead && autoRead.checked && window.tts) {
        // Si lang est null, on utilise l'auto-détection du TTS ou la langue mémorisée
        window.tts.speak(text, lang || detectedLanguage);
    }
};

// --- Détection des API ---
const getAPI = (name) => {
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

const updateUIStatus = async () => {
    log('Vérification de la disponibilité des API...',defaultLogIdElement);
    const list = document.getElementById('api-status-list');
    list.innerHTML = '';

    const toCheck = [
        { label: 'Language Detector', key: 'LanguageDetector' },
        { label: 'Translator (FR->EN)', key: 'Translator', params: { sourceLanguage: 'fr', targetLanguage: 'en' } },
        { label: 'Translator (EN->FR)', key: 'Translator', params: { sourceLanguage: 'en', targetLanguage: 'fr' } },
        { label: 'Summarizer', key: 'Summarizer' },
        { label: 'Language Model (FR/EN)', key: 'LanguageModel', params: { languages: ['en', 'fr'] } },
        { label: 'Writer', key: 'Writer' },
        { label: 'Rewriter', key: 'Rewriter' },
        { label: 'Proofreader', key: 'Proofreader' }
    ];

    for (const api of toCheck) {
        const obj = getAPI(api.key);
        let status = 'unavailable';

        if (obj) {
            try {
                status = typeof obj.availability === 'function'
                    ? await obj.availability(api.params || {})
                    : 'available';
            } catch (e) {
                log(`Erreur dispo ${api.label}: ${e.message}`, 'error');
            }
        }

        const div = document.createElement('div');
        div.className = 'api-status';
        div.innerHTML = `<span>${api.label}</span><span class="status-badge status-${status}">${status}</span>`;
        list.appendChild(div);
    }
};

// --- Handlers Directs ---

async function onDetectLanguage() {
    const text = document.getElementById('text-input').value;
    if (!text) return log('Texte manquant', 'error');

    log('Appel LanguageDetector...', defaultLogIdElement);
    try {
        const api = getAPI('LanguageDetector');
        if (!api) throw new Error('API non trouvée');

        const detector = await api.create();
        const results = await detector.detect(text);

        // On mémorise la langue détectée pour la session
        detectedLanguage = results[0].detectedLanguage;

        display(`Langue: ${detectedLanguage} (${Math.round(results[0].confidence * 100)}%)`, detectedLanguage);
        log(`Détection réussie : ${detectedLanguage}`, defaultLogIdElement, 'success');
    } catch (e) {
        log(`Erreur: ${e.message}`, defaultLogIdElement, 'error');
    }
}

async function onTranslate() {
    const text = document.getElementById('text-input').value;
    const direction = document.getElementById('translation-direction').value;
    if (!text) return log('Texte manquant', defaultLogIdElement, 'error');

    const [src, tgt] = direction.split('-');
    log(`Appel Translator (${src.toUpperCase()} -> ${tgt.toUpperCase()})...`, defaultLogIdElement);

    try {
        const api = getAPI('Translator');
        if (!api) throw new Error('API non trouvée');

        const translator = await api.create({ sourceLanguage: src, targetLanguage: tgt });
        const result = await translator.translate(text);
        display(result, tgt); // On passe la langue cible au TTS
        log('Traduction réussie', defaultLogIdElement, 'success');
    } catch (e) {
        log(`Erreur: ${e.message}`, defaultLogIdElement, 'error');
    }
}

async function onSummarize() {
    const text = document.getElementById('text-input').value;
    if (!text) return log('Texte manquant', defaultLogIdElement, 'error');

    log(`Appel Summarizer (Contexte: ${detectedLanguage || 'auto'})...`, defaultLogIdElement);
    try {
        const api = getAPI('Summarizer');
        if (!api) throw new Error('API non trouvée');

        // Configuration raffinée du Summarizer selon la langue détectée
        const options = {
            type: 'key-points', // Format par défaut
            format: 'markdown',
            length: 'medium'
        };

        if (detectedLanguage) {
            options.expectedInputLanguages = [detectedLanguage];
            options.outputLanguage = detectedLanguage;
            options.expectedContextLanguages = [detectedLanguage];
            options.sharedContext = `Processing a document in ${detectedLanguage}. Please provide the summary in the same language.`;
        }

        const summarizer = await api.create(options);
        const result = await summarizer.summarize(text);
        display(result, detectedLanguage);
        log('Résumé réussi', defaultLogIdElement, 'success');
    } catch (e) {
        log(`Erreur: ${e.message}`, defaultLogIdElement, 'error');
    }
}

async function onPrompt() {
    const text = document.getElementById('text-input').value;
    const file = document.getElementById('image-input').files[0];
    if (!text && !file) return log('Entrée manquante', 'error');

    log('Appel LanguageModel (Gemma )...', defaultLogIdElement);
    try {
        const api = getAPI('LanguageModel');
        if (!api) throw new Error('API non trouvée');

        const session = await api.create({
            //expectedInputs: [{ type: "text", languages: ['en'] }, { type: "image" },],
            expectedInputs: [{ type: "text" }, { type: "image" },],
            //expectedOutputs: [{ type: "text", languages: ['en'] }],
            initialPrompts: [
                {
                    role: 'system',
                    content:
                        promptSystem
                        //'Your task is to describe images. Only use plain text. Do not use Markdown. Be short and precise.',
                        //'Réponds en français. Sois concis. pas de markdown'
                },
            ],
        });

        let stream = undefined;
        if (file) {
            log('Traitement multimodal (image)...', defaultLogIdElement);
            //const buffer = await file.arrayBuffer();
            stream = session.promptStreaming([{
                role: "user",
                content: [
                    { type: 'text', value: text },
                    { type: 'image', value: document.querySelector('img') }
                ]
            }]);
        } else {
            stream = session.promptStreaming(text);

        }

        // log(`content send : ${JSON.stringify(content)}`);

        let result = '';
        for await (const chunk of stream) {
            //output.append(chunk);
            result += chunk;
        }
        display(result);
        log('Réponse reçue', defaultLogIdElement, 'success');
    } catch (e) {
        log(`Erreur: ${e.message}`, defaultLogIdElement, 'error');
    }
}

async function onWrite() {
    const text = document.getElementById('text-input').value;
    if (!text) return log('Sujet manquant', 'error');

    log('Appel Writer API...', defaultLogIdElement);
    try {
        const api = getAPI('Writer');
        if (!api) throw new Error('API non trouvée');

        const writer = await api.create();
        const result = await writer.write(text);
        display(result);
        log('Écriture réussie', defaultLogIdElement, 'success');
    } catch (e) {
        log(`Erreur: ${e.message}`, defaultLogIdElement, 'error');
    }
}

async function onRewrite() {
    const text = document.getElementById('text-input').value;
    if (!text) return log('Texte manquant', 'error');

    log('Appel Rewriter API...', defaultLogIdElement);
    try {
        const api = getAPI('Rewriter');
        if (!api) throw new Error('API non trouvée');

        const rewriter = await api.create();
        const result = await rewriter.rewrite(text);
        display(result);
        log('Réécriture réussie', defaultLogIdElement, 'success');
    } catch (e) {
        log(`Erreur: ${e.message}`, defaultLogIdElement, 'error');
    }
}

async function onProofread() {
    const text = document.getElementById('text-input').value;
    if (!text) return log('Texte manquant', 'error');

    log('Appel Proofreader API...', defaultLogIdElement);
    try {
        const api = getAPI('Proofreader');
        if (!api) throw new Error('API non trouvée');

        const proofreader = await api.create();
        const result = await proofreader.proofread(text);
        display(result);
        log('Correction réussie', defaultLogIdElement, 'success');
    } catch (e) {
        log(`Erreur: ${e.message}`, defaultLogIdElement, 'error');
    }
}

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', () => {
    log('Prêt.', defaultLogIdElement);

    document.getElementById('check-status-btn').addEventListener('click', updateUIStatus);
    document.getElementById('btn-detect-lang').addEventListener('click', onDetectLanguage);
    document.getElementById('btn-translate').addEventListener('click', onTranslate);
    document.getElementById('btn-summarize').addEventListener('click', onSummarize);
    document.getElementById('btn-prompt').addEventListener('click', onPrompt);
    document.getElementById('btn-write').addEventListener('click', onWrite);
    document.getElementById('btn-rewrite').addEventListener('click', onRewrite);
    document.getElementById('btn-proofread').addEventListener('click', onProofread);

    // Image preview simple
    document.getElementById('image-input').addEventListener('change', (e) => {
        const f = e.target.files[0];
        if (f) {
            const r = new FileReader();
            r.onload = (ev) => document.getElementById('image-preview').innerHTML = `<img id="preview-image" src="${ev.target.result}">`;
            r.readAsDataURL(f);
        }
    });

    // Reset de la langue détectée si le texte change
    document.getElementById('text-input').addEventListener('input', () => {
        if (detectedLanguage) {
            detectedLanguage = null;
            log('Texte modifié : langue mémorisée réinitialisée.', defaultLogIdElement, 'info');
        }
    });

    setTimeout(updateUIStatus, 500);
});
