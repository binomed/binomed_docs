<!-- .slide: class="transition" -->
# WebLLM ? BuiltIn API's 

*Jean-François Garreau | Devoxx FR 2026*

##==##

<!-- .slide: class="speaker-slide" data-state="out-gemma hide-mic-and-stats" -->

<div class="speaker-slide">

# Jean-François Garreau

## Engineering Director @SFEIR

### ![](fa-bluesky "fa fa-brands tc-icons") jefbinomed

### ![](fa-linkedin "fa fa-brands tc-icons") jeanfrancois.garreau


![](./assets/images/jf.jpg 'speaker')


![](./assets/images/Sfeir-Gris-vector.svg 'company')

![](./assets/images/gdg-nantes.png 'badge')

![](./assets/images/gde.png 'badge')

![](./assets/images/et-si-on-parlait.jpeg 'badge')


</div>

##==##

<!-- .slide: data-state="in-gemma welcome-lema show-mic-and-stats" data-type-show="on-stage" -->

# Let's meet Lema

## Lema for "Local Gemma"

<div id="lema-container" style="display: flex; flex-direction: column; gap: 20px; align-items: center; width: 100%; height: 100%;">
  <div id="lema-wakeup-state" style="display: flex; flex-direction: column; gap: 24px; align-items: center; width: 100%; padding-top: 40px;">
    <img id="lema-image" src="./assets/images/lema-wakeup.png" alt="lema" style="max-height: 650px; width: auto; transition: all 0.4s ease;" />
    <button id="btn-activate-lema" style="padding: 14px 40px; background: rgba(168,85,247,0.6); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.2s;">Activate Lema</button>
  </div>
  <div id="lema-active-state" style="display: none; flex-direction: row; gap: 40px; align-items: stretch; width: 100%; flex: 1;">
    <img id="lema-image-active" src="./assets/images/lema.png" alt="lema" style="height: 500px; width: auto; flex-shrink: 0; transition: all 0.4s ease;" />
    <chat-component id="lema-chat-container" data-id="lema-chat" style="flex-grow: 1; height: 100%;"></chat-component>
  </div>
</div>

Notes:
* Demander "Présente toi"
* Affiche les indicateurs Systèmes.
* Demander "Que peux tu faire ?"
* Parle moi de devoxx
* Coupe le Wifi.
* Passe le slide suivant.

##==##

<!-- .slide: data-state="hide-mic-and-stats" -->

# Comment ça marche ?

## Chrome BuiltIn API's :

![](./assets/images/chrome-builtin.png 'center h-600')

🤖 [IA Intégrée - https://developer.chrome.com/docs/ai/](https://developer.chrome.com/docs/ai/)

<!-- .element: class="center" -->
<br>

Notes: 
Aujourd'hui, c'est dans chrome mais on verra après que ça arrive dans d'autres navigateurs aussi (Edge, Firefox, Safari...) via une lib qui s'appuie sur webGPU

##==##

# Comment ça marche ?

## Flags à activer :

![](./assets/images/flags.png 'center h-600')


🏳️‍🌈 [chrome://flags/#optimization-guide-on-device-model](chrome://flags/#optimization-guide-on-device-model)

<!-- .element: class="center" -->

🏳️‍🌈 [chrome://flags/#prompt-api-for-gemini-nano-multimodal-input](chrome://flags/#prompt-api-for-gemini-nano-multimodal-input)

<!-- .element: class="center" -->

<br>

Notes:
Derrière du origin trial (activation ou origin trial) pour une partie des APIs

##==##

<!-- .slide: class="tc-multiple-columns" -->

##++##

# Welcome BuiltIn API's



* 💬 Prompt API Multimodal Input
* 🏳️‍🌈 API Language Detector
* 🌍 Translation API
* ✍️ Writer API
* 🔄 Rewriter API
* 📝 Summarization API
* ✅ Proofreading API

<!-- .element: class="list-fragment" -->
##++##

##++## data-background="./assets/images/no-wifi.png" 
##++##

##==##

# Mix de LLM & AI Apis

| AI APIs (BuiltIn) | LLM (Gemma) | Chrome Stable |
|---|---|---|
| Prompt API Multimodal Input | ✅  | 🧪 |
| API Language Detector | ❌   | ✅ (138) |
| Translation API | ❌   | ✅ (138) |
| Writer API | ✅   | 🧪 |
| Rewriter API | ✅   | 🧪 |
| Summarization API | ✅   | ✅ (138) |
| Proofreading API | ✅   | 🧪 |

##==##

<!-- .slide: class="tc-multiple-columns" -->

##++##
# Pas pour toutes les machines


* GPU ou CPU
  * GPU : > **4 Go** de VRAM.
  * CPU : > **16 Go** de RAM & > **4 cœurs** de processeur.

##++##
##++## data-background="./assets/images/ram-vram.png"
##++##

Notes:
* GPU ou CPU : les modèles intégrés peuvent s'exécuter avec un GPU ou un CPU.
  * GPU : strictement plus de 4 Go de VRAM.
  * CPU : au moins 16 Go de RAM et au moins 4 cœurs de processeur.
  * Remarque : L'API Prompt avec entrée audio nécessite un GPU.

##==##

# Pas pour tous les systèmes d'exploitation

| OS | Supported| 
|---|---|
| Windows 10 ou 11 | ✅ |
| macOS : 13+  | ✅ |
| Linux | ✅ |
| ChromeOS (> 16389.0.0) & Chromebook Plus | ✅ |
| Chrome pour Android, iOS et ChromeOS non Chromebook Plus | ❌ |

* ![](database 'tc-icons material-symbols-outlined') Stockage : > **22 Go** 

Notes: 
Système d'exploitation : Windows 10 ou 11 ; macOS 13 ou version ultérieure (Ventura et versions ultérieures) ; Linux ; ou ChromeOS (à partir de la plate-forme 16389.0.0) sur les appareils Chromebook Plus. Chrome pour Android, iOS et ChromeOS sur les appareils autres que Chromebook Plus ne sont pas encore compatibles avec les API qui utilisent Gemini Nano.
Stockage : au moins 22 Go d'espace libre sur le volume contenant votre profil Chrome


##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" -->

# Parlons Code !

## Liste des APIs

```javascript  [1|1-2|1-3|1-4|1-5|1-6|1-7]
window.LanguageDetector // Language Detector
window.Translator // Translate
window.Summarizer // Summarize
window.LanguageModel // Promp API
window.Writer // Writer API
window.Rewriter // Re-write API
window.Proofreader // Proofreading
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit"-->

# Parlons Code !

## Liste des APIs

```javascript
window.LanguageDetector // Language Detector
window.Translator // Translate
window.Summarizer // Summarize
window.LanguageModel // Promp API
window.Writer // Writer API
window.Rewriter // Re-write API
window.Proofreader // Proofreading
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage"-->

# Parlons Code !

## Détection

```javascript [1|2|3|5|5-6|5-7|1-10]
const builtInAPI = window.LanguageModel;
let params = { sourceLanguage: 'fr', targetLanguage: 'en' }; // Example for Translator
if (builtInAPI){
  try {
    status = typeof builtInAPI.availability === 'function'
          ? await builtInAPI.availability(params || {})
          : 'available';
  } catch (e) {}
}
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit"-->

# Parlons Code !

## Détection

```javascript 
const builtInAPI = window.LanguageModel;
let params = { sourceLanguage: 'fr', targetLanguage: 'en' }; // Example for Translator
if (builtInAPI){
  try {
    status = typeof builtInAPI.availability === 'function'
          ? await builtInAPI.availability(params || {})
          : 'available';
  } catch (e) {}
}
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage"-->

# Parlons Code !

## Chargement - exemple Summarizer

```javascript [1|2-3|4|5-7|1-10]
const params = { expectedInputLanguages: ['en', 'fr'], outputLanguage: 'en', expectedContextLanguages: ['en', 'fr'], };
await Summarizer.create({
    ...params, 
    monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round((e.loaded / e.total) * 100);
            console.log(progress);
        })
    }
})
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit"-->

# Parlons Code !

## Chargement - exemple Summarizer

```javascript 
const params = { expectedInputLanguages: ['en', 'fr'], outputLanguage: 'en', expectedContextLanguages: ['en', 'fr'], };
await Summarizer.create({
    ...params, 
    monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round((e.loaded / e.total) * 100);
            console.log(progress);
        })
    }
})
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage"-->

# Parlons Code !

## Prompt API - Récupération d'une session de chat

```javascript [1|2|3-6|1-7]
const session = await api.create({
    expectedInputs: [{ type: "text" }],
    initialPrompts: [{
            role: 'system',
            content: PROMPT_SYSTEM
    }],
});
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit"-->

# Parlons Code !

## Prompt API - Récupération d'une session de chat

```javascript
const session = await api.create({
    expectedInputs: [{ type: "text" }],
    initialPrompts: [{
            role: 'system',
            content: PROMPT_SYSTEM
    }],
});
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage"-->

# Parlons Code !

## Prompt API - Lancement Prompt

```javascript [1|2-4|6-7|1-7]
const stream = session.promptStreaming(text);
for await (const message of stream) {
    console.log(message);
}

// Or 
const response = await session.prompt(text);
```
##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit"-->

# Parlons Code !

## Prompt API - Lancement Prompt

```javascript
const stream = session.promptStreaming(text);
for await (const message of stream) {
    console.log(message);
}

// Or 
const response = await session.prompt(text);
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage"-->

# Parlons Code !

## Gestion du contexte

```javascript [1-2|1-5|1-8]
// Contexte dispo
const inputQuota = session.inputQuota;

// Contexte utilisé
const inputUsage = session.inputUsage || session.tokensSoFar || 0;

// Contexte restant
const inputLeft = inputQuota - inputUsage;
```

Notes:

TODO Détailler plus pour la partie clone / quota / usage / Structured output / ...

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit"-->

# Parlons Code !

## Gestion du contexte

```javascript
// Contexte dispo
const inputQuota = session.inputQuota;

// Contexte utilisé
const inputUsage = session.inputUsage || session.tokensSoFar || 0;

// Contexte restant
const inputLeft = inputQuota - inputUsage;
```

Notes:

TODO Détailler plus pour la partie clone / quota / usage / Structured output / ...

##==##

<!-- .slide: class="transition" data-state="hide-mic-and-stats" data-type-show="on-stage"-->

# Let's go back to Demo Effects !

##==##

<!-- .slide: data-state="translate-lema show-mic-and-stats" data-type-show="on-stage"-->


# Let's translate


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-traduction.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-translate"></chat-component>
</div>

Notes:
Je suis à Devoxx devant des développeurs passionés qui veulent en savoir plus sur les apis d'IA générative disponibles directement dans chrome

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Traduction

```javascript [1|3-5]
const translatorSession = await Translator.create({ sourceLanguage, targetLanguage });

const result = translatorSession.translateStreaming(text);
// Or 
const result = await translatorSession.translate(text);
```

Notes:
On télécharge par couple de langages ! 
Très gros support !!
TODO Ajouter plus de langues dans la démo

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Traduction

```javascript
const translatorSession = await Translator.create({ sourceLanguage, targetLanguage });

const result = translatorSession.translateStreaming(text);
// Or 
const result = await translatorSession.translate(text);
```

Notes:
On télécharge par couple de langages ! 
Très gros support !!
TODO Ajouter plus de langues dans la démo



##==##

<!-- .slide: data-state="writer-lema show-mic-and-stats" data-type-show="on-stage"-->


# Let's write


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-create.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-writer"></chat-component>
</div>

Notes:
* Écris moi une blague sur l'IA Générative  
* Je voudrais que tu m'écrives un post linkedin à poster pour parler du fait que je donnes une conférence sur l'IA générative sans réseau à Devoxx

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Write

```javascript [1|2-6|8-10]
const writerSession = await Writer.create();
const params = {
  tone : 'formal', //'neutral' (par défaut) 'casual'
  format: 'markdown', // (par défaut) et 'plain-text'
  length: 'short', // (par défaut) et 'medium' et 'long'
}

const result = await writerSession.writeStreaming(text,...params);
// Or
const result = await writerSession.write(text,...params);
```

Notes:
TODO Ajouter paramètres shared context + démo

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Write

```javascript
const writerSession = await Writer.create();
const params = {
  tone : 'formal', //'neutral' (par défaut) 'casual'
  format: 'markdown', // (par défaut) et 'plain-text'
  length: 'short', // (par défaut) et 'medium' et 'long'
}

const result = await writerSession.writeStreaming(text,...params);
// Or
const result = await writerSession.write(text,...params);
```

Notes:
TODO Ajouter paramètres shared context + démo

##==##

<!-- .slide: data-state="rewrite-lema show-mic-and-stats" data-type-show="on-stage"-->


# Let's Rewrite


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-thinking.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-rewrite"></chat-component>
</div>

Notes:
Récupération du texte précédent et demander avec un ton familier et mettre le texte entre ''

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats" -->

# Parlons Code !

## ReWrite

```javascript [1|2-6|8-10]
const rewriterSession = await Rewriter.create();
const params = {
  tone : 'formal', //'neutral' (par défaut) 'casual'
  format: 'markdown', // (par défaut) et 'plain-text'
  length: 'short', // (par défaut) et 'medium' et 'long'
}

const result = await rewriterSession.rewriteStreaming(text,...params);
// Or
const result = await rewriterSession.rewrite(text,...params);
```

Notes:
TODO Ajouter paramètres shared context + démo

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats" -->

# Parlons Code !

## ReWrite

```javascript
const rewriterSession = await Rewriter.create();
const params = {
  tone : 'formal', //'neutral' (par défaut) 'casual'
  format: 'markdown', // (par défaut) et 'plain-text'
  length: 'short', // (par défaut) et 'medium' et 'long'
}

const result = rewriterSession.rewriteStreaming(text,...params);
// Or
const result = await rewriterSession.rewrite(text,...params);
```

Notes:
TODO Ajouter paramètres shared context + démo



##==##

<!-- .slide: data-state="summarize-lema show-mic-and-stats" data-type-show="on-stage"-->


# Let's Summarize


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-reduction.png" alt="lema" style="height: 500px;" />
  <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px;">
    <chat-component data-id="lema-summarize"></chat-component>
    <div style="display: flex; gap: 12px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">
      <div style="flex: 1;">
        <label style="display: block; font-size: 12px; margin-bottom: 6px; color: rgba(255,255,255,0.7);">Type</label>
        <select id="summarize-type" style="width: 100%; padding: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(168,85,247,0.3); color: white; border-radius: 4px;">
          <option value="tldr">TLDR</option>
          <option value="teaser">Teaser</option>
          <option value="headline">Headline</option>
          <option value="key-points">Key Points</option>
        </select>
      </div>
      <div style="flex: 1;">
        <label style="display: block; font-size: 12px; margin-bottom: 6px; color: rgba(255,255,255,0.7);">Format</label>
        <select id="summarize-format" style="width: 100%; padding: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(168,85,247,0.3); color: white; border-radius: 4px;">
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>
      <div style="flex: 1;">
        <label style="display: block; font-size: 12px; margin-bottom: 6px; color: rgba(255,255,255,0.7);">Length</label>
        <select id="summarize-length" style="width: 100%; padding: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(168,85,247,0.3); color: white; border-radius: 4px;">
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
    </div>
  </div>
</div>

Notes:

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Summarize

```javascript [1|2-6|7-9|10-12]
const summarizerSession = await Summarizer.create();
const config = {
  type: 'key-points', //'tldr', 'teaser', 'headline', 'key-points'
  format: 'markdown', //'plain-text', 'markdown'
  length: 'medium', //'short', 'medium', 'long'
}
config.expectedInputLanguages = [language]; //'en', 'ja', 'es'
config.outputLanguage = language; //'en', 'ja', 'es'
config.expectedContextLanguages = [language]; //'en', 'ja', 'es'
const stream = summarizerSession.summarizeStreaming(text,...config);
// Or
const result = await summarizerSession.summarize(text,...config);
```

Notes:
TODO Ajouter paramètres shared context + démo

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Summarize

```javascript
const summarizerSession = await Summarizer.create();
const config = {
  type: 'key-points', //'tldr', 'teaser', 'headline', 'key-points'
  format: 'markdown', //'plain-text', 'markdown'
  length: 'medium', //'short', 'medium', 'long'
}
config.expectedInputLanguages = [language]; //'en', 'ja', 'es'
config.outputLanguage = language; //'en', 'ja', 'es'
config.expectedContextLanguages = [language]; //'en', 'ja', 'es'

const stream = summarizerSession.summarizeStreaming(text,...config);
// Or
const result = await summarizerSession.summarize(text,...config);
```

Notes:
TODO Ajouter paramètres shared context + démo



##==##

<!-- .slide: data-state="proofread-lema show-mic-and-stats" data-type-show="on-stage"-->

# Let's Proofread

<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-proofreader.png" alt="lema" style="height: 500px;" />
  <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px;">
    <textarea id="proofread-input" style="width: 100%; height: 150px; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(168,85,247,0.3); color: white; border-radius: 8px; font-size: 14px; resize: vertical;" placeholder="Type text to proofread..."></textarea>
    <div style="display: flex; gap: 12px;">
      <button id="btn-proofread" style="padding: 8px 20px; background: rgba(168,85,247,0.6); color: white; border: none; border-radius: 6px; cursor: pointer;">Proofread</button>
      <button id="btn-apply-all" style="display: none; padding: 8px 20px; background: rgba(34,197,94,0.6); color: white; border: none; border-radius: 6px; cursor: pointer;">Apply All</button>
    </div>
    <div id="proofread-result" style="min-height: 80px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; line-height: 1.8; color: white;"></div>
  </div>
</div>

Notes:
J'ecri come un gro cochont

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats out-vison" -->

# Parlons Code !

## Proofread - Utilisation

```javascript [1-2|4-9]
const proofreaderSession = await Proofreader.create();
const corrections = await proofreaderSession.proofread(text);

//Corrections format
{
  startIndex: number;
  endIndex: number;
  correction: string;
}
```

Notes:
Précisé que ça peut être plus complet
TODO Ajouter une démo avec l'explication  et les types -> https://github.com/webmachinelearning/proofreader-api

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats out-vison" -->

# Parlons Code !

## Proofread - Utilisation

```javascript
const proofreaderSession = await Proofreader.create();
const corrections = await proofreaderSession.proofread(text);

//Corrections format
{
  startIndex: number;
  endIndex: number;
  correction: string;
}
```

Notes:
Précisé que ça peut être plus complet
TODO Ajouter une démo avec l'explication  et les types -> https://github.com/webmachinelearning/proofreader-api


##==##

<!-- .slide: data-state="vision-lema show-mic-and-stats" data-type-show="on-stage"-->

# Let's See

<div class="grid-vision">
    <img src="./assets/images/lema-vision.png" alt="lema" style="height: 400px; grid-area: lema; align-self:center; margin:auto;" />
    <camera-component id="camera-lema" style="grid-area:camera; align-self:center;"></camera-component>
    <chat-component data-id="lema-vision" style="grid-area:chat;"></chat-component>
</div>

Notes:
Décris moi l'image
Combien il y a de doigts affichés
Est ce que les gens ont l'air content ?


##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats out-vison" -->

# Parlons Code !

## PromptAPI - Multimodal Input

```javascript [1,3|1-3|5-6,10|5-10]
const session = await LanguageModel.create({
    expectedInputs: [{ type: "text" }, { type: "image" },],
...});

stream = session.promptStreaming([{
  role: "user",
  content: [
      { type: 'text', value: text },
      { type: 'image', value: image }
  ]}]);
```

Notes:
Précisé que l'audio fonctionne aussi (mais pas de démo pour le moment)

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats out-vison" -->

# Parlons Code !

## PromptAPI - Multimodal Input

```javascript 
const session = await LanguageModel.create({
    expectedInputs: [{ type: "text" }, { type: "image" },],
...});

stream = session.promptStreaming([{
  role: "user",
  content: [
      { type: 'text', value: text },
      { type: 'image', value: image }
  ]}]);
```

Notes:
Précisé que l'audio fonctionne aussi (mais pas de démo pour le moment)



##==##

<!-- .slide:  class="transition mask" data-background="./assets/images/lema-to-tema.png" -->

# Let's meet Tema


##==##

<!-- .slide: data-state="tema-prompt out-vision-tema" data-type-show="on-stage"-->

# Let's Chat (with Tema)

<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/tema.png" alt="tema" style="height: 500px;" />
  <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px;">
    <div id="tema-progress-container" class="hidden" style="width: 100%; background: rgba(255,255,255,0.1); border-radius: 4px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
      <div>
        <div style="font-size: 12px; color: white; margin-bottom: 2px;" id="tema-status-t">Chargement du modèle...</div>
        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden;">
          <div id="tema-progress-t" style="width: 0%; height: 100%; background: #22c55e; transition: width 0.3s;"></div>
        </div>
      </div>
    </div>
    <chat-component data-id="tema-prompt"></chat-component>
  </div>
</div>

Notes: 
* Présente toi
* Que peux tu faire ?
* Parles moi de devoxx 
* Ecris moi un post linkedin pour dire que je vais parler à Devoxx pour parler d'IA dans le navigateur et sans connexion

##==##

<!-- .slide: data-state="tema-multimodal" data-type-show="on-stage"-->

# Let's See (with Tema)

<div class="grid-vision">
    <img src="./assets/images/tema-vision.png" alt="tema" style="height: 400px;  grid-area: lema; align-self:center; margin:auto;" />
    <camera-component id="camera-tema" style="grid-area:camera; align-self:center;"></camera-component>
    <chat-component data-id="tema-multimodal" style="grid-area:chat;"></chat-component>
</div>

Notes:
Décris moi l'image
Combien il y a de doigts affichés
Est ce que les gens ont l'air content ?

##==##

<!-- .slide: data-state="out-vision-tema" -->

# Tema is for (Transformers + lema)

## Using Transformers.js

![](./assets/images/transformers-compat.png 'center h-600')

credits: transofrmers.js team 
<!-- .element: class="credits" -->

Notes: 

Compatibilité avec les navigateurs


##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Transformer.js - Multimodal Input

```javascript [1-2|4-10]
const id = 'onnx-community/gemma-4-E2B-it-ONNX';
const dtype = 'q4f16';

// Chargement des modèles
const tokenizer = await AutoTokenizer.from_pretrained(id);
const processor = await AutoProcessor.from_pretrained(id);
const model = await AutoModelForImageTextToText.from_pretrained(id, {
  device: 'webgpu',
  dtype,
});
```

Notes:
Ici utilisation d'un Gemma 4 optimisé pour le CPU (quantifié en 4 bits) et compatible avec webGPU (donc GPU aussi)

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Transformer.js - Multimodal Input

```javascript
const id = 'onnx-community/gemma-4-E2B-it-ONNX';
const dtype = 'q4f16';

// Chargement des modèles
const tokenizer = await AutoTokenizer.from_pretrained(id);
const processor = await AutoProcessor.from_pretrained(id);
const model = await AutoModelForImageTextToText.from_pretrained(id, {
  device: 'webgpu',
  dtype,
});
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Transformer.js - Multimodal Input

```javascript [1-6|8-12]
// Création du streamer pour récupérer les tokens au fur et à mesure
const txtStreamer = new TextStreamer(tokenizer, {
  skip_prompt: true,
  skip_special_tokens: true,
  callback_function: (chunk) => console.log(chunk)
});

// Préparation du l'object de conversation
const conversation = [
  { role: 'system', content: PROMPT_SYSTEM },
  { role: 'user', content: inputText }
];
```

Notes:
Préparation du prompt pour le chat multimodal (texte) avec transformers.js et du flux de sortie pour récupérer les tokens au fur et à mesure

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Transformer.js - Multimodal Input

```javascript
// Création du streamer pour récupérer les tokens au fur et à mesure
const txtStreamer = new TextStreamer(tokenizer, {
  skip_prompt: true,
  skip_special_tokens: true,
  callback_function: (chunk) => console.log(chunk)
});

// Préparation du l'object de conversation
const conversation = [
  { role: 'system', content: PROMPT_SYSTEM },
  { role: 'user', content: inputText }
];
```

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="on-stage" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Transformer.js - Multimodal Input

```javascript [1-5|7-11]
// Préparation du texte pour le chat
const promptText = tokenizer.apply_chat_template(conversation, {
  tokenize: false,
  add_generation_prompt: true
});

// Tokenization du prompt
const inputs = tokenizer(promptText, {
  return_tensors: 'pt',
  add_special_tokens: false
});
```

Notes:
Préparation de l'objet de prompt à transformer en tokens pour le modèle de chat multimodal avec transformers.js

##==##

<!-- .slide: class="with-code-bg-dark" data-type-show="restit" data-state="hide-mic-and-stats" -->

# Parlons Code !

## Transformer.js - Multimodal Input

```javascript
// Préparation du texte pour le chat
const promptText = tokenizer.apply_chat_template(conversation, {
  tokenize: false,
  add_generation_prompt: true
});

// Tokenization du prompt
const inputs = tokenizer(promptText, {
  return_tensors: 'pt',
  add_special_tokens: false
});
```

##==##

<!-- .slide: class="with-code-bg-dark"  data-state="hide-mic-and-stats" -->

# Parlons Code !

## Transformer.js - Multimodal Input

```javascript
// Génération de la réponse avec le modèle en streaming
await model.generate({
    ...inputs,
    max_new_tokens: 512,
    do_sample: true,
    temperature: 0.7,
    top_p: 0.9,
    streamer: txtStreamer,
});
```

Notes:
Lancement de la génération de la réponse avec le modèle de chat multimodal avec transformers.js en récupérant les tokens au fur et à mesure grâce au streamer


##==##

# Références

* [Prompt API](https://developer.chrome.com/docs/ai/prompt-api)
* [Language Detector API](https://developer.chrome.com/docs/ai/language-detection)
* [Translation API](https://developer.chrome.com/docs/ai/translator-api)
* [Writer API](https://developer.chrome.com/docs/ai/writer-api)
* [Rewriter API](https://developer.chrome.com/docs/ai/rewriter-api)
* [Summarization API](https://developer.chrome.com/docs/ai/summarizer-api)
* [Proofreading API](https://developer.chrome.com/docs/ai/proofreader-api)
* [Transformers.js](https://huggingface.co/docs/transformers.js/index)

##==##

<!-- .slide: class="transition mask" data-state="conclusion" data-background="./assets/images/lema-tema-conclusion.png" data-type-show="on-stage" -->

# CONCLUSION

Notes:
TODO Laisser Lema faire la conclusion en résumant ce qui vient d'être dit

##==##

<!-- .slide: class="speaker-slide" data-state="out-gemma " -->

<div class="speaker-slide">

# Merci !!

## Des questions ?

### ![](fa-bluesky "fa fa-brands tc-icons") jefbinomed

### ![](fa-linkedin "fa fa-brands tc-icons") jeanfrancois.garreau

![](./assets/images/jf.jpg 'speaker')


![](https://openfeedback.io/kQpmz21AHD2FVBj4bcup/2026-02-03/VbN2C9Cqcp2J7PCT3GUq 'tc-qrcode badge text-below')Open Feedback

![](https://shorturl.at/yFtjr 'tc-qrcode company text-below')slides : https://shorturl.at/yFtjr


</div>
