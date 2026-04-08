<!-- .slide: class="transition" -->
# WebLLM ? BuiltIn API's 

*Jean-François Garreau | Février 2026*

##==##

<!-- .slide: class="speaker-slide" data-state="out-gemma" -->

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

<!-- .slide: data-state="in-gemma welcome-lema" -->

# Let's meet Lema

**Lema for "Local Gemma"**

<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-chat"></chat-component>
</div>



##==##

<!-- .slide: data-state="translate-lema" -->


# Let's translate


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-translate"></chat-component>
</div>

##==##

<!-- .slide: data-state="writer-lema" -->


# Let's write


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-writer"></chat-component>
</div>

##==##

<!-- .slide: data-state="rewrite-lema" -->


# Let's Rewrite


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema.png" alt="lema" style="height: 500px;" />
  <chat-component data-id="lema-rewrite"></chat-component>
</div>

##==##

<!-- .slide: data-state="summarize-lema out-vision" -->


# Let's Summarize


<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema.png" alt="lema" style="height: 500px;" />
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
  <img src="./assets/images/lema.png" alt="lema" style="height: 500px;" />
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

<!-- .slide: data-state="vision-lema" -->

# Let's See

<div style="display: flex; gap: 40px; align-items: center; width: 100%;">
  <img src="./assets/images/lema.png" alt="lema" style="height: 400px;" />
  <div style="flex-grow: 1; display: flex; flex-direction: row; gap: 16px;">
    <camera-component></camera-component>
    <chat-component data-id="lema-vision"></chat-component>
  </div>
</div>

##==##

<!-- .slide: class="transition" data-state="out-gemma out-vision" -->

# CONCLUSION


Notes:



##==##

<!-- .slide: class="speaker-slide" -->

<div class="speaker-slide">

# Merci !!

## Des questions ?

### ![](fa-bluesky "fa fa-brands tc-icons") jefbinomed

### ![](fa-linkedin "fa fa-brands tc-icons") jeanfrancois.garreau

![](./assets/images/jf.jpg 'speaker')


![](https://openfeedback.io/kQpmz21AHD2FVBj4bcup/2026-02-03/VbN2C9Cqcp2J7PCT3GUq 'tc-qrcode badge text-below')Open Feedback

![](https://shorturl.at/yFtjr 'tc-qrcode company text-below')slides : https://shorturl.at/yFtjr


</div>
