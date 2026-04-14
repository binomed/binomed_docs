<!-- .slide: class="transition" -->
# WebLLM ? BuiltIn API's 

*Jean-François Garreau | Février 2026*

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

<!-- .slide: data-state="in-gemma welcome-lema show-mic-and-stats" -->

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
* Demander "Que peux tu faire ?"
* Affiche les indicateurs Systèmes.
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
Stockage : au moins 22 Go d'espace libre sur le volume contenant votre profil Chrom

##==##

<!-- .slide: class="transition" data-state="hide-mic-and-stats" -->

# Let's go back to Demo Effects !

##==##

<!-- .slide: data-state="translate-lema show-mic-and-stats" -->


# Let's translate


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-traduction.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-translate"></chat-component>
</div>

##==##

<!-- .slide: data-state="writer-lema" -->


# Let's write


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-create.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-writer"></chat-component>
</div>

##==##

<!-- .slide: data-state="rewrite-lema" -->


# Let's Rewrite


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-thinking.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-rewrite"></chat-component>
</div>

##==##

<!-- .slide: data-state="summarize-lema out-vision" -->


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


##==##

<!-- .slide: data-state="proofread-lema" -->

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

##==##

<!-- .slide: data-state="vision-lema out-vision-tema" -->

# Let's See

<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema-vision.png" alt="lema" style="height: 400px;" />
  <div style="flex-grow: 1; display: flex; flex-direction: row; gap: 16px;">
    <camera-component id="camera-lema"></camera-component>
    <chat-component data-id="lema-vision"></chat-component>
  </div>
</div>

##==##

<!-- .slide: data-state="out-vision" class="transition mask" data-background="./assets/images/lema-to-tema.png" -->

# Let's meet Tema


##==##

<!-- .slide: data-state="tema-vision out-vision" -->

# Let's Chat (with Tema)

<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/tema.png" alt="tema" style="height: 500px;" />
  <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px;">
    <!-- Zone de progression de Tema -->
    <div id="tema-progress-container" class="hidden" style="width: 100%; background: rgba(255,255,255,0.1); border-radius: 4px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
      <!--<div>
        <div style="font-size: 12px; color: white; margin-bottom: 2px;" id="tema-status-v">Vision (Moondream2)...</div>
        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden;">
          <div id="tema-progress-v" style="width: 0%; height: 100%; background: #a855f7; transition: width 0.3s;"></div>
        </div>
      </div>-->
      <div>
        <div style="font-size: 12px; color: white; margin-bottom: 2px;" id="tema-status-t">Texte (Llama-3.2)...</div>
        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden;">
          <div id="tema-progress-t" style="width: 0%; height: 100%; background: #22c55e; transition: width 0.3s;"></div>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: row; gap: 16px; width: 100%;">
      <!-- VISION DÉSACTIVÉE <camera-component id="camera-tema"></camera-component> -->
      <chat-component data-id="tema-vision"></chat-component>
    </div>
  </div>
</div>

##==##

# Tema is for (Transformers + lema)

## Using Transformers.js

![](./assets/images/transformers-compat.png 'center h-600')

credits: transofrmers.js team 
<!-- .element: class="credits" -->

Notes: 

Compatibilité avec les navigateurs

##==##

<!-- .slide: class="transition mask" data-state="out-vision-tema" data-background="./assets/images/lema-tema-conclusion.png"  -->

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
