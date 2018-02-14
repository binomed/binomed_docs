<!-- .slide: data-background="./assets/images/galaxy_2.jpg" class="transition text-white" data-type-show="prez"  -->

<h1>
    The Bleeding Web
    <br> is coming
</h1>


##==##


## Instant Citation

<br>

<blockquote>
<cite>
  J'ai appris pleins de choses mais je vais rien pouvoir utiliser en prod.
</cite>
</blockquote>

<div class="citation-author">vous à la sortie de cette prez</div>
<img src="./assets/images/NOTSUREIF.png" class="citation-img"></img>

##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

### Jean-François Garreau

<!-- .element: class="descjf" -->
Front-end developer & Community Manager

![avatar w-300 wp-200](assets/images/jf_astronaut.png)


![company_logo](assets/images/lucca_logo.png)
![gdg_logo](assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](https://twitter.com/jefBinomed)




##==##

<!-- .slide: class="transition text-white transparent" -->


<h1>
    <svg class="h-150 color-orange">
        <use xlink:href="#css" />
    </svg><br>CSS
</h1>


##==##

<!-- .slide: class="transition text-white with-code big-code transparent" data-state="css-var-type start-code-css-variable"  -->

<h1 class="typings-text" id="title-css-var"></h1>

```
--a-super-var: #000000;
```


##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full" -->

## CSS Custom Properties

```css
// Declaration
html {
    --a-name: #333;
}
// Usage
div {
    color: var(--a-name);
}
// Default value
h1 {
    color: var(--a-name, red);
}
```


##==##

<!-- .slide: class="with-code" data-state="code-css-variable" data-type-show="prez" -->

## CSS Custom Properties

```CSS
// Declaration
html {
    --a-name: #333;
}
// Usage
div {
    color: var(--a-name);
}
// Default value
h1 {
    color: var(--a-name, red);
}
```
<mask-highlighter id="highlight-css-variable"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>

##==##

<!-- data-type-show="prez" data-state="stop-code-css-variable stop-code-css-variable-in-js" -->

<div id="demo-var" class="flex-hori">
    <div id="codemirror-css">
    </div>
    <div id="render-element">
        <h2 class="text-1">Du texte</h2>
        <h2 class="text-2">Du texte encore</h2>
    </div>
</div>



##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full" -->

## Javascript manipulation

<p> style.css</p>
```css
#idElt{
    color: --a-super-var;
}
```
main.js
```javascript
const elt = document.getElementById('idElt');
elt.style.setProperty('--a-super-var', '#333');
elt.style.getProperty('--a-super-var');
```
```


##==##

<!-- .slide: class="with-code" data-state="code-css-variable-in-js" data-type-show="prez" -->

## Javascript manipulation

<p> style.css</p>
```css
#idElt{
    color: --a-super-var;
}
```
main.js
```javascript
const elt = document.getElementById('idElt');
elt.style.setProperty('--a-super-var', '#333');
elt.style.getProperty('--a-super-var');
```

<mask-highlighter id="highlight-css-variable-in-js"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>


##==##

<!-- .slide: data-type-show="prez" data-state="ghost-state stop-code-css-variable stop-code-css-variable-in-js" -->

<div id="demo-var-in-js" >
    <div id="codemirror-css-in-js-css">
    </div>
    <div id="codemirror-css-in-js-js">
    </div>
    <div id="render-element-in-js">
        <div id="demo-ghost-parent">
            <div class="demo-ghost"></div>
            <div class="demo-shadow"></div>
        </div>
    </div>
</div>


##==##

<!-- .slide: class="transition text-white with-code big-code transparent" data-state="stop-code-css-variable-in-js"   -->

# Css Mixins

```
--a-mixin {color: #000000;}
```



##==##

<!-- .slide: class="with-code no-highlight" -->

## @Depecrated :Css Mixins & @Apply


```css
// Declaration
html {
    --a-mixin:{
        color: #333;
    }
}
// Usage
div {
    @apply(--a-mixin);
}
```
[Why I Abandoned @apply](https://www.xanthir.com/b4o00)


##==##


## Instant Citation

<br>

<blockquote>
<cite>
 Je ne fais jamais de mixins css, mais quand je le fais c'est avec la nouvelle spec
</cite>
</blockquote>

<div class="citation-author">The most interesting man in the world</div>
<img src="./assets/images/most_intersting_man.png" class="citation-img"></img>


##==##

<!-- .slide: data-background="./assets/images/morpheus.jpg" class="transition text-white no-filter"  data-copyrights="true "  -->

## Et donc on choisit quoi ?

<div class="copyrights">matrix</div>

##==##

<!-- .slide: class="transition text-white with-code big-code transparent" data-state="stop-code-part" -->

# ::Part & ::Theme

```css
x-tag::part(name) { ... }
```


##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full" -->

## ::Part ::Theme - Declaration

```HTML
<my-component>
  #shadow-root
  <!--Overridable part -->
  <div part="tag-name">
    <span>...</span>
  </div>
  <!-- Non Overridable part -->
  <section>
  ...
  </section>
</my-component>
```

##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full" -->

## ::Part ::Theme - Usage

```CSS
my-component::part(tag-name){
    ...
}
my-component::part(tag-name):hover{
    ...
}
```

Notes:
ne marche pas de façon plus complète par contre
my-component::part(tag-name) span



##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full" -->

## ::Part ::Theme - Forward

```HTML
<root-component>
  #shadow-root
  <my-component part="tag-name => tag-name">
  </my-component>
</root-component>
```



##==##

<!-- .slide: class="with-code" data-type-show="prez" data-state="code-part" -->

## ::Part ::Theme - Declaration

```HTML
<my-component>
  #shadow-root
  <!--Overridable part -->
  <div part="tag-name">
    <span>...</span>
  </div>
  <!-- Non Overridable part -->
  <section>
  ...
  </section>
</my-component>
```


<mask-highlighter id="highlight-part"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>


##==##

<!-- .slide: class="with-code" data-type-show="prez" data-state="stop-code-part"-->

## ::Part ::Theme - Usage

```CSS
my-component::part(tag-name){
    ...
}
my-component::part(tag-name):hover{
    ...
}
```

Notes:
ne marche pas de façon plus complète par contre
my-component::part(tag-name) span



##==##

<!-- .slide: class="with-code" data-type-show="prez" -->

## ::Part ::Theme - Forward

```HTML
<root-component>
  #shadow-root
  <my-component part="tag-name => tag-name">
  </my-component>
</root-component>
```

##==##

<!-- .slide: data-type-show="prez" -->

<div id="demo-part" >
    <div id="codemirror-part-css">
    </div>
    <div id="codemirror-part-html">
    </div>
    <div id="render-element-part">
        <x-host></x-host>
    </div>
</div>



##==##

<!-- .slide: data-background="./assets/images/shut-up-and-take-my-money.jpg" class="transition text-white no-filter"  data-copyrights="true "  -->


<div class="copyrights black">futurama</div>

##==##

<!-- .slide: class="transition text-white transparent" data-type-show="prez"  -->


<h1>
    <svg class="h-250 color-orange">
        <use xlink:href="#webcomponents_logo" />
    </svg><br>WebComponents
</h1>


##==##


## Instant Citation

<br>

<blockquote>
<cite>
 Les Webcomponents c'est comme le monstre du Loch Ness, on en entend beaucoup parlé mais on en voit toujours pas en prod.
</cite>
</blockquote>

<div class="citation-author">Monsieur mauvaise fois</div>
<img src="./assets/images/mr_grincheux.png" class="citation-img"></img>

##==##


<!-- .slide: class="transition text-white transparent" data-type-show="prez"  -->


<h1>
    <svg class="h-250 color-blue">
        <use xlink:href="#template_2" />
    </svg><br>Template Instantiation
</h1>

##==##

<!-- .slide: class="with-code no-highlight" -->

## Template Instantiation

```HTML
<template>
    <article>
        <h1>{{article.title}}</h1>
        <input value="article.comment">
    </article
</template>
```

##==##

<!-- .slide: class="with-code no-highlight" data-state="stop-code-template-instantiation" -->

## Template Instantiation

```Javascript
let content = template.createInstance({article: {title:"HTMLRocks", comment: ""});
shadowRoot.appendChild(content);
// Do some stuff
content.update({article: {title:"HTMLRocks", comment: "a comment"});
```

##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full"-->

## Template Instantiation

```HTML
<template type="my-template-type">
    <section>{{part1}}</section>
</template>
```

```javascript
document.defineTemplateType('my-template-type', {
    processCallback: function (instance, parts, state) {
        for (const part of parts)
            part.value = state[part.expression];
    }
});
```
##==##

<!-- .slide: class="with-code no-highlight" data-type-show="prez" data-state="code-template-instantiation"-->

## Template Instantiation

```HTML
<template type="my-template-type">
    <section>{{part1}}</section>
</template>
```

```javascript
document.defineTemplateType('my-template-type', {
    processCallback: function (instance, parts, state) {
        for (const part of parts)
            part.value = state[part.expression];
    }
});
```
<mask-highlighter id="highlight-template-instantiation"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>


##==##

<!-- .slide: class="transition text-white transparent" data-state="stop-code-template-instantiation stop-code-html-module" -->

<h1>
    <svg class="fh-250 color-yellow">
        <use xlink:href="#import" />
    </svg><br>HTML Module
</h1>

##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full" -->

## HTML Module

```HTML
< script type="module" id="scriptA">
  export let baz = 5;
</ script>
<template export="myTemplate">
  <style>
    :host {display: block}
  </style>
</template>
```

```javascript
import fooDoc from './foo.html';
import {baz as a_baz} from './foo.html#scriptA';
const template = barDoc.querySelector('template');
```


##==##

<!-- .slide: class="with-code" data-type-show="prez" data-state="code-html-module"-->

## HTML Module

```HTML
< script type="module" id="scriptA">
  export let baz = 5;
</ script>
<template export="myTemplate">
    <style>
        :host {display: block}
  </style>
</template>
```

```javascript
import fooDoc from './foo.html';
import {baz as a_baz} from './foo.html#scriptA';
const template = barDoc.querySelector('template');
```

<mask-highlighter id="highlight-html-module"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>


##==##

<!-- .slide: class="transition text-white transparent" data-state="stop-code-html-module" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#magic" />
    </svg><br>Houdini CSS
</h1>


##==##

<!-- .slide: data-type-show="prez" -->

## Qu'est ce que Houdini CSS ?

<p class="fragment">Worklet</p>
<p class="fragment">CSS Paint API</p>
<p class="fragment">Layout Paint API</p>
<p class="fragment">Parser API</p>
<p class="fragment">Typed OM</p>
<p class="fragment">Properties & Values API</p>

##==##

<!-- .slide: data-type-show="full" -->

## Qu'est ce que Houdini CSS ?

<p class="fragment">Worklet : Threads, Animation</p>
<p class="fragment">CSS Paint API : Custom Rendering, Custom backgrounds</p>
<p class="fragment">Layout Paint API : Custom Layout</p>
<p class="fragment">Parser API : Nouvelle interprétation des éléments</p>
<p class="fragment">Typed OM : Objets javascripts visant à représenter le CSS</p>
<p class="fragment">Properties & Values API : Api de manipulation des properties au sens large</p>


##==##


## Instant Citation

<br>

<blockquote>
<cite>
 Un Polyfill CSS ? Facile.
 Euh en fait non !
</cite>
</blockquote>

<div class="citation-author">Un développeur Javascript</div>
<img src="./assets/images/css_awesome.png" class="citation-img"></img>

##==##

## Pourquoi Houdini ?

<div class="center-element">
    <video data-autoplay src="./assets/images/magic.mp4" class="fh-500"></video>
</div>



##==##

<!-- .slide: data-state="animate-houdini-workflow" -->

## Pourquoi Houdini ?

<div class="center-element">
    <img id="houdini_workflow-1" src="./assets/images/browser_workflow.svg" class="w-800"></img>
    <img id="houdini_workflow-2" src="./assets/images/browser_workflow_with_houdini.svg" class="w-800" style="display:none"></img>
</div>

<div class="fragment" data-fragment-index="1" hidden></div>


##==##

<!-- .slide: class="transition text-white transparent" data-state="stop-code-paint-api" -->

<h1>
    <svg class="fh-250 color-yellow">
        <use xlink:href="#paint" />
    </svg><br>CSS Paint Api
</h1>



##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full"-->

```javascript
//index.js
CSS.paintWorklet.addModule('painter.js');

// painter.js
class MyPainter {
  paint(ctx, geometry, properties) {
    // ...
  }
}

registerPaint('myPainter', MyPainter);
```

```css
textarea {
    background-image: paint(myPainter);
}
```


##==##

<!-- .slide: class="with-code" data-type-show="prez" data-state="code-paint-api"-->

```javascript
//index.js
CSS.paintWorklet.addModule('painter.js');

// painter.js
class MyPainter {
  paint(ctx, geometry, properties) {
    // ...
  }
}

registerPaint('myPainter', MyPainter);
```

```css
textarea {
    background-image: paint(myPainter);
}
```


<mask-highlighter id="highlight-paint-api"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>


##==##

<!-- .slide: data-type-show="prez" data-state="stop-code-paint-api" -->

<div id="demo-paint-api" >
    <div id="codemirror-paint-api-css">
    </div>
    <div id="codemirror-paint-api">
    </div>
    <div id="render-element-paint-api">
    </div>
</div>


##==##

<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-orange">
        <use xlink:href="#process" />
    </svg><br>Web Platform
</h1>


##==##


<div class="center-element">
    <img src="./assets/images/web-platform-2016.png" class="fh-600"></img>
</div>


##==##

Generic Sensors

https://developers.google.com/web/updates/2017/09/sensors-for-the-web

Polyfil : https://github.com/kenchris/sensor-polyfills


##==##

Picture In Picture

##==##

WebAssembly

##==##

WebUsb

##==##

WebNfc

##==##

WebShare


##==##

# Pour aller plus loin et jouer un peu

[Part / Theme Polyfill](https://github.com/PolymerLabs/part-theme)

[Template-Instantiation](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md)

[Template Instation -polyfill proposal](https://github.com/componentkitchen/template-instantiation)

[HTML Module](https://github.com/w3c/webcomponents/issues/645)

[HTML Module Polyfill](https://github.com/TakayoshiKochi/script-type-module)


##==##

<!-- .slide: class="transition" -->

# Merci

<p>@jefBinomed</p>

<p>GDG Nantes Leader & Ingénieur Lucca</p>



<div class="credits">
    <h4 >Crédits : <a href="https://thenounproject.com/" target="_blank">The noun project</a></h4>
    <p>Alexander Zharikov / Ben Iconator / Icon Fair / Dimitry Sunseifer / Shaurya / Creative Stall / Eucalyp</p>
</div>


<div style="display:none">
    <!--css-->
    <svg id="css" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 639.791 722.79375" enable-background="new 0 0 639.791 578.235" xml:space="preserve"><g><path  d="M73.647,107.372c146.098,0,291.501,0,437.302,0c-4.601,23.353-9.092,46.146-13.646,69.259   c-146.09,0-291.685,0-437.566,0c-7.079,35.891-14.086,71.42-21.224,107.606c146.125,0,291.535,0,437.316,0   c-8.041,40.251-15.933,79.916-24.01,119.543c-0.3,1.47-2.174,3.246-3.691,3.752c-56.531,18.85-113.099,37.586-169.701,56.222   c-1.868,0.615-4.352,0.615-6.177-0.077c-48.869-18.547-97.681-37.242-146.539-55.819c-2.575-0.979-3.225-2.167-2.641-4.799   c1.55-6.987,2.855-14.029,4.231-21.054c1.838-9.384,3.652-18.772,5.468-28.116c-0.902-0.24-1.221-0.398-1.539-0.398   c-34.163-0.03-68.327-0.007-102.49-0.132c-3.336-0.012-3.622,1.804-4.107,4.279c-4.162,21.238-8.443,42.453-12.652,63.683   C7.976,441.536,4.013,461.76,0,482.139c1.46,0.655,2.63,1.249,3.848,1.715c81.773,31.304,163.543,62.615,245.364,93.794   c2.088,0.796,4.943,0.756,7.09,0.046c94.503-31.262,188.961-62.662,283.463-93.929c2.948-0.975,4.32-2.372,4.904-5.326   c9.295-47.034,18.653-94.055,28.019-141.075c20.554-103.187,41.123-206.371,61.677-309.557c1.834-9.208,3.598-18.43,5.426-27.806   C457.856,0,276.597,0,95.125,0C87.994,35.648,80.915,71.04,73.647,107.372z"/><path d="M73.647,107.372C80.915,71.04,87.994,35.648,95.125,0c181.472,0,362.73,0,544.665,0   c-1.828,9.376-3.591,18.598-5.426,27.806c-20.553,103.187-41.123,206.371-61.677,309.557   c-9.366,47.02-18.724,94.041-28.019,141.075c-0.584,2.954-1.956,4.351-4.904,5.326c-94.502,31.267-188.96,62.667-283.463,93.929   c-2.147,0.71-5.002,0.75-7.09-0.046c-81.821-31.179-163.591-62.49-245.364-93.794c-1.218-0.466-2.387-1.06-3.848-1.715   c4.013-20.379,7.976-40.603,11.983-60.818c4.208-21.229,8.49-42.444,12.652-63.683c0.485-2.475,0.771-4.291,4.107-4.279   c34.163,0.125,68.327,0.102,102.49,0.132c0.318,0,0.637,0.159,1.539,0.398c-1.816,9.344-3.629,18.732-5.468,28.116   c-1.376,7.025-2.681,14.067-4.231,21.054c-0.584,2.632,0.066,3.82,2.641,4.799c48.857,18.578,97.67,37.273,146.539,55.819   c1.825,0.693,4.309,0.692,6.177,0.077c56.602-18.636,113.171-37.372,169.701-56.222c1.517-0.506,3.391-2.281,3.691-3.752   c8.076-39.627,15.968-79.292,24.01-119.543c-145.781,0-291.191,0-437.316,0c7.137-36.186,14.145-71.715,21.224-107.606   c145.881,0,291.476,0,437.566,0c4.554-23.113,9.045-45.906,13.646-69.259C365.148,107.372,219.745,107.372,73.647,107.372z"/></g></svg>
    <!--magic-->
    <svg id="magic" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 125" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M39.9318417,35.594191 C39.9946443,34.9364883 40.5847134,34.4533908 41.2451767,34.4533908 C42.2272449,34.4533908 43.0236656,33.6576602 43.0236656,32.675592 L43.0236656,32.621071 C43.0236656,31.8812417 43.6585938,31.2897923 44.412916,31.3615668 C45.0706187,31.4243695 45.5537162,32.0144386 45.5537162,32.6749019 L45.5537162,32.675592 C45.5537162,33.6576602 46.3494468,34.4533908 47.331515,34.4533908 C47.9926684,34.4533908 48.5820474,34.9364883 48.6448501,35.594191 C48.7173147,36.3485133 48.1258653,36.9834414 47.386036,36.9834414 L47.331515,36.9834414 C46.3494468,36.9834414 45.5537162,37.7798621 45.5537162,38.7619303 L45.5537162,38.8157612 C45.5537162,39.5555905 44.9187881,40.1470399 44.1644659,40.0745752 C43.5067631,40.0117726 43.0236656,39.4223936 43.0236656,38.7619303 C43.0236656,37.7798621 42.2272449,36.9834414 41.2451767,36.9834414 L41.1906557,36.9834414 C40.4515165,36.9834414 39.8600672,36.3485133 39.9318417,35.594191 L39.9318417,35.594191 Z M47.4978386,6.71393255 C47.5226836,6.44753879 47.7614718,6.25222937 48.0285557,6.25222937 C48.4253858,6.25222937 48.7476808,5.93062447 48.7476808,5.53379438 L48.7476808,5.51170992 C48.7476808,5.21218948 49.0044126,4.97340128 49.3094542,5.00238713 C49.5751578,5.02792229 49.7704672,5.26602034 49.7704672,5.53310424 L49.7704672,5.53379438 C49.7704672,5.93062447 50.0927623,6.25222937 50.4895924,6.25222937 C50.7566763,6.25222937 50.9954645,6.44753879 51.0203095,6.71393255 C51.0499855,7.01897411 50.8105071,7.27501578 50.5116768,7.27501578 L50.4895924,7.27501578 C50.0927623,7.27501578 49.7704672,7.59731083 49.7704672,7.99414092 L49.7704672,8.01622537 C49.7704672,8.31574582 49.5137354,8.55453401 49.2086939,8.52554816 C48.9429902,8.50001301 48.7476808,8.26122482 48.7476808,7.99414092 C48.7476808,7.59731083 48.4253858,7.27501578 48.0285557,7.27501578 L48.0064712,7.27501578 C47.7076409,7.27501578 47.4681626,7.01897411 47.4978386,6.71393255 L47.4978386,6.71393255 Z M57.088014,38.6128602 C57.112859,38.3471566 57.3516472,38.1518472 57.6187311,38.1518472 C58.0155612,38.1518472 58.3378563,37.8295521 58.3378563,37.4327221 L58.3378563,37.4106376 C58.3378563,37.1118073 58.5945881,36.872329 58.8996296,36.9013148 C59.1653333,36.92685 59.3606427,37.1656382 59.3606427,37.4327221 L59.3606427,37.4327221 C59.3606427,37.8295521 59.6829377,38.1518472 60.0797678,38.1518472 C60.3468517,38.1518472 60.5856399,38.3471566 60.6104849,38.6128602 C60.6401609,38.9179018 60.4006826,39.1746336 60.1018523,39.1746336 L60.0797678,39.1746336 C59.6829377,39.1746336 59.3606427,39.4962385 59.3606427,39.8937587 L59.3606427,39.9151531 C59.3606427,40.2146735 59.1039109,40.4534617 58.7988693,40.4244758 C58.5331657,40.3989407 58.3378563,40.1608426 58.3378563,39.8937587 C58.3378563,39.4962385 58.0155612,39.1746336 57.6187311,39.1746336 L57.5966467,39.1746336 C57.2978164,39.1746336 57.0590282,38.9179018 57.088014,38.6128602 L57.088014,38.6128602 Z M30.7605808,42.1408522 C30.7861159,41.8751486 31.0249041,41.6791491 31.291988,41.6791491 C31.6888181,41.6791491 32.0111131,41.3575441 32.0111131,40.9607141 L32.0111131,40.9386296 C32.0111131,40.6391092 32.2678449,40.400321 32.5728865,40.4293068 C32.8385901,40.454842 33.0338995,40.69294 33.0338995,40.9600239 L33.0338995,40.9607141 C33.0338995,41.3575441 33.3555045,41.6791491 33.7530247,41.6791491 C34.0201086,41.6791491 34.2582066,41.8751486 34.2837418,42.1408522 C34.3127276,42.4458938 34.0739394,42.7019355 33.7751091,42.7019355 L33.7530247,42.7019355 C33.3555045,42.7019355 33.0338995,43.0242305 33.0338995,43.4217507 L33.0338995,43.4431451 C33.0338995,43.7426655 32.7771677,43.9814537 32.4721262,43.9524678 C32.2064225,43.9269327 32.0111131,43.6888346 32.0111131,43.4217507 C32.0111131,43.0242305 31.6888181,42.7019355 31.291988,42.7019355 L31.2699035,42.7019355 C30.9710732,42.7019355 30.7315949,42.4458938 30.7605808,42.1408522 L30.7605808,42.1408522 Z M64.921785,26.2628178 C65.2620237,25.9225791 65.2620237,25.3711579 64.921785,25.0302291 L64.3896876,24.4988218 C64.1550403,24.2641745 64.1550403,23.8832176 64.3896876,23.6492604 C64.624335,23.414613 65.0052919,23.414613 65.2392491,23.6492604 L65.7713465,24.1806676 C66.1115851,24.5209063 66.6630064,24.5209063 67.0039352,24.1806676 L67.5353425,23.6492604 C67.7699898,23.414613 68.1509467,23.414613 68.3849039,23.6492604 C68.6195513,23.8832176 68.6195513,24.2641745 68.3849039,24.4988218 L67.8534967,25.0302291 C67.513258,25.3711579 67.513258,25.9225791 67.8534967,26.2628178 L68.3849039,26.7949152 C68.6195513,27.0288724 68.6195513,27.4098293 68.3849039,27.6444766 C68.1509467,27.879124 67.7699898,27.879124 67.5353425,27.6444766 L67.0039352,27.1123793 C66.6630064,26.7721406 66.1115851,26.7721406 65.7713465,27.1123793 L65.2392491,27.6444766 C65.0052919,27.879124 64.624335,27.879124 64.3896876,27.6444766 C64.1550403,27.4098293 64.1550403,27.0288724 64.3896876,26.7949152 L64.921785,26.2628178 Z M34.9676698,21.7713914 C35.0028669,21.5546876 35.206458,21.4056176 35.4252322,21.4056176 L36.1070898,21.4056176 C36.3741737,21.4056176 36.5908774,21.1889138 36.5908774,20.9218299 L36.5908774,20.2165076 C36.5908774,19.9494237 36.8289754,19.7375509 37.1050312,19.78241 C37.3210448,19.8176071 37.470805,20.020508 37.470805,20.2399723 L37.470805,20.9218299 C37.470805,21.1889138 37.6875087,21.4056176 37.9545926,21.4056176 L38.6364502,21.4056176 C38.8552244,21.4056176 39.0588155,21.5546876 39.0940126,21.7713914 C39.1388716,22.0474471 38.9269989,22.2855451 38.659915,22.2855451 L37.9545926,22.2855451 C37.6875087,22.2855451 37.470805,22.5022489 37.470805,22.7693328 L37.470805,23.4746551 C37.470805,23.741739 37.2327069,23.9529216 36.9566512,23.9080626 C36.7406376,23.8735556 36.5908774,23.6699645 36.5908774,23.4505002 L36.5908774,22.7693328 C36.5908774,22.5022489 36.3741737,22.2855451 36.1070898,22.2855451 L35.4017674,22.2855451 C35.1346835,22.2855451 34.9228108,22.0474471 34.9676698,21.7713914 L34.9676698,21.7713914 Z M51.3046469,21.6319832 L51.3329426,21.6036875 C51.7249417,21.2116884 52.3743627,21.234463 52.7353056,21.6720113 C53.0506992,22.0536583 52.9941078,22.6223331 52.6448973,22.9722337 C52.1238422,23.4925987 52.1238422,24.3359489 52.6448973,24.856314 C52.9941078,25.2062146 53.0506992,25.7748893 52.7353056,26.1565364 C52.3743627,26.5940847 51.7249417,26.6175494 51.3329426,26.2248601 L51.3046469,26.1965644 C50.7842818,25.6761994 49.9409316,25.6761994 49.4205666,26.1965644 L49.3915808,26.2248601 C48.9995817,26.6175494 48.3501606,26.5940847 47.9885276,26.1565364 C47.6738241,25.7748893 47.7304155,25.2062146 48.0803161,24.856314 C48.599991,24.3359489 48.599991,23.4925987 48.0803161,22.9722337 L48.0513303,22.9432479 C47.6600213,22.5519389 47.6821058,21.9018277 48.1203442,21.5408849 C48.5019912,21.2254912 49.070666,21.2827728 49.4198765,21.6319832 L49.4205666,21.6319832 C49.9409316,22.1523483 50.7842818,22.1523483 51.3046469,21.6319832 L51.3046469,21.6319832 Z M35.1250216,51.5039719 C35.1250216,50.9325365 35.5887952,50.4687629 36.1602305,50.4687629 C36.7130321,50.4687629 37.1643831,50.9014803 37.1940591,51.4466903 C37.3100025,51.6447603 37.6681848,51.8773372 38.243761,52.1175057 C39.8717995,51.1416487 44.3259585,50.4404672 49.5792987,50.4404672 C55.0962721,50.4404672 59.7319376,51.2134232 61.1384415,52.2658856 C61.9417636,51.9746468 62.4359033,51.6847883 62.5753114,51.4466903 C62.6049874,50.9014803 63.0563385,50.4687629 63.6091401,50.4687629 C64.1805754,50.4687629 64.644349,50.9325365 64.644349,51.5039719 C64.644349,55.721413 50.4875219,55.7697227 49.8850304,55.7697227 C49.2825388,55.7697227 35.1250216,55.721413 35.1250216,51.5039719 L35.1250216,51.5039719 Z M33.5225182,89.3774353 L35.9076395,66.4047691 C37.4059319,66.7077402 39.0236184,66.9603312 40.7434454,67.1549505 C43.5461011,67.4737948 46.5192211,67.6352874 49.5799888,67.6352874 C54.5137945,67.6352874 59.3061217,67.1970489 63.2509578,66.4013184 L65.6367693,89.3774353 C65.5242766,90.6058832 59.8658246,92.9295822 49.5799888,92.9295822 C39.2934628,92.9295822 33.6350109,90.6058832 33.5225182,89.3774353 L33.5225182,89.3774353 Z M28.0704178,52.9850107 C28.0704178,50.5246642 36.2533993,47.0932917 49.5799888,47.0932917 C62.9058882,47.0932917 71.0888696,50.5246642 71.0888696,52.9850107 C71.0888696,55.4446671 62.9058882,58.8760396 49.5799888,58.8760396 C36.2533993,58.8760396 28.0704178,55.4446671 28.0704178,52.9850107 L28.0704178,52.9850107 Z M67.7092576,89.3401678 L64.584997,59.2052361 C69.6278448,57.8656757 73.1592875,55.7717932 73.1592875,52.9850107 C73.1592875,47.8137971 61.0100756,45.0228739 49.5799888,45.0228739 C38.1485218,45.0228739 26,47.8137971 26,52.9850107 C26,55.7717932 29.5307526,57.8656757 34.5736003,59.2052361 L31.455551,89.2338863 L31.4500299,89.3401678 C31.4500299,93.2291026 40.8476565,95 49.5799888,95 C58.311631,95 67.7092576,93.2291026 67.7092576,89.3401678 L67.7092576,89.3401678 Z"/></g></svg>
    <!-- html imports -->
    <svg id="html-imports" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.333 40.667">
        <path d="M12.095 15.312h4.678l5.026 5.015-5.026 5.028h-5.166l4.774-5.036zM12.377 8.147v6.054h3.817v-2.302h15.781v16.89h-15.848v-2.059h-3.75v5.789h23.349v-24.372h-23.349"/>
    </svg>
    <!-- cutom elements -->
    <svg id="custom-elements" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.333 40.667">
        <path d="M17.31 28.024l-12.055-5.857v-3.681l12.055-5.856v4.406l-7.78 3.303 7.78 3.305v4.38zM24.122 10.931h3.56l-4.567 18.805h-3.535l4.542-18.805zM30.023 23.644l7.781-3.305-7.781-3.304v-4.405l12.055 5.856v3.681l-12.055 5.856v-4.379z"/>
    </svg>
    <!-- shadow dom -->
    <svg id="shadow-dom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.333 40.667">
        <path d="M36.781 26.465l-7.065-1.819 3.317-5.246h-4.494v-2.569h4.494l-5.137-4.282-.855-5.566-3.374.642-3.372-.642-.857 5.566-5.138 4.282h4.496v2.569h-4.496l3.32 5.246-7.066 1.819-3.319 7.219h32.864z"/>
    </svg>
    <!-- webcomponents -->
    <svg id="webcomponents_logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.333 40.667">
        <path d="M40.331 16.802l.961 3.307-7.361 2.08s0 4.427-3.572 6.186c-3.572 1.761-6.347.269-6.347.269l-.445-1.279 5.3-1.441 1.174-4.535-3.416-3.358-4.906 1.484-.426-1.165s2.293-5.067 9.067-2.187c0 0 2.135 1.333 2.613 2.506l7.358-1.867zM41.292 16.553l1.173-.337.944 3.379-1.229.37zM41.706 16.405l.759-.189.944 3.379-1.229.37-.32-1.13.49-.191zM39.518 17.01l.812-.207.961 3.307-7.361 2.08s-.078 3.864-2.639 5.612c-2.559 1.748-5.441 1.694-7.28.844l-.205-.591s5.007 1.177 7.485-2.585c1.494-2.48 1.467-4.266 1.467-4.266l7.389-1.999-.629-2.195zM21.29 18.349l4.322-1.254 1.012.935-4.908 1.484zM6.058 20.695l.868 3.333 7.386-1.978s2.267 3.802 6.238 3.485c3.972-.317 5.589-3.016 5.589-3.016l-.273-1.33-5.288 1.476-3.328-3.295 1.214-4.635 4.975-1.233-.23-1.22s-4.562-3.181-8.909 2.76c0 0-1.15 2.238-.962 3.492l-7.28 2.161zM5.105 20.972l-1.18.311.917 3.384 1.246-.308zM4.674 21.055l-.749.228.917 3.384 1.246-.308-.301-1.137-.521.085zM6.863 20.457l-.805.238.868 3.333 7.386-1.978s2.047 3.276 5.142 3.468c3.093.192 5.541-1.325 6.685-3l-.123-.613s-3.701 3.572-7.755 1.611c-2.553-1.367-3.442-2.917-3.442-2.917l-7.373 2.062-.583-2.204zM23.21 12.281l-4.353 1.134-.393 1.319 4.976-1.233z"/>
    </svg>
    <!-- browser -->
    <svg id="browser" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 640" enable-background="new 0 0 512 512" xml:space="preserve"><g><path d="M2,2v65.5v16.4v262.2h82.4C88.7,437.2,163.9,510,256,510s167.3-72.8,171.6-163.9H510V83.9V67.5V2H2z M256,493.6   c-21.7,0-44.6-29.5-56.7-78.2c17.7,2.9,36.7,4.5,56.7,4.5s39-1.6,56.7-4.5C300.6,464.1,277.7,493.6,256,493.6z M256,403.5   c-22,0-42.2-1.9-60.3-5.2c-3.3-18.1-5.2-38.3-5.2-60.3s1.9-42.2,5.2-60.3c18.1-3.3,38.3-5.2,60.3-5.2s42.2,1.9,60.3,5.2   c3.3,18.1,5.2,38.3,5.2,60.3s-1.9,42.2-5.2,60.3C298.2,401.5,278,403.5,256,403.5z M178.5,394.6c-48.7-12.1-78.2-34.9-78.2-56.7   c0-21.7,29.5-44.6,78.2-56.7c-2.9,17.7-4.5,36.7-4.5,56.7C174.1,357.9,175.7,376.9,178.5,394.6z M333.5,281.2   c48.7,12.1,78.2,34.9,78.2,56.7c0,21.7-29.5,44.6-78.2,56.7c2.9-17.7,4.5-36.7,4.5-56.7C337.9,318,336.3,298.9,333.5,281.2z    M330.1,263.8c-7.2-32.3-18.9-58.8-33.6-76c53.3,14.4,95.2,56.3,109.6,109.6C388.9,282.7,362.4,271,330.1,263.8z M312.7,260.5   C295,257.6,276,256,256,256s-39,1.6-56.7,4.5c12.1-48.7,34.9-78.2,56.7-78.2S300.6,211.8,312.7,260.5z M181.9,263.8   c-32.3,7.2-58.8,18.9-76,33.6c14.4-53.3,56.3-95.2,109.6-109.6C200.8,205,189.1,231.5,181.9,263.8z M105.9,378.4   c17.2,14.7,43.8,26.4,76,33.6c7.2,32.3,18.9,58.8,33.6,76C162.2,473.7,120.3,431.7,105.9,378.4z M296.5,488.1   c14.7-17.2,26.4-43.8,33.6-76c32.3-7.2,58.8-18.9,76-33.6C391.7,431.7,349.8,473.7,296.5,488.1z M493.6,329.7h-66   c-4.3-91.1-79.5-163.9-171.6-163.9S88.7,238.7,84.4,329.7h-66V83.9h475.2V329.7z M18.4,67.5V18.4h475.2v49.2H18.4z"/><rect x="34.8" y="34.8" width="16.4" height="16.4"/><rect x="67.5" y="34.8" width="16.4" height="16.4"/><rect x="100.3" y="34.8" width="16.4" height="16.4"/><rect x="288.8" y="34.8" width="188.5" height="16.4"/></g></svg>
   <!-- template 2 -->
    <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" id="template_2" xml:space="preserve" enable-background="new 0 0 100 100" viewBox="0 0 100 125" y="0px" x="0px" version="1.1">
    <metadata id="metadata4956"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"  /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id="defs4954" /><g transform="translate(-135.07109,1.1848341)" id="g4800"><g id="g4760"><path id="path4758" d="m 211.229,4.937 c 10.265,0 18.616,8.351 18.616,18.616 v 52.894 c 0,10.265 -8.351,18.616 -18.616,18.616 h -52.894 c -10.265,0 -18.616,-8.351 -18.616,-18.616 V 23.553 c 0,-10.265 8.351,-18.616 18.616,-18.616 h 52.894 m 0,-3 h -52.894 c -11.938,0 -21.616,9.678 -21.616,21.616 v 52.894 c 0,11.938 9.678,21.616 21.616,21.616 h 52.894 c 11.938,0 21.616,-9.678 21.616,-21.616 V 23.553 c 0,-11.938 -9.678,-21.616 -21.616,-21.616 z" /></g><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4762" y2="1.25" x2="233.532" y1="98.75" x1="136.032" stroke-miterlimit="10" /><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4764" y2="98.75" x2="233.532" y1="1.25" x1="136.032" stroke-miterlimit="10" /><g id="g4772"><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4766" y2="67.75" x2="231.923" y1="67.75" x1="137.64101" stroke-miterlimit="10" /><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4768" y2="50" x2="231.923" y1="50" x1="137.64101" stroke-miterlimit="10" /><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4770" y2="32.25" x2="231.923" y1="32.25" x1="137.64101" stroke-miterlimit="10" /></g><g id="g4780"><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4774" y2="2.859" x2="202.532" y1="97.140999" x1="202.532" stroke-miterlimit="10" /><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4776" y2="2.859" x2="184.782" y1="97.140999" x1="184.782" stroke-miterlimit="10" /><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4778" y2="2.859" x2="167.032" y1="97.140999" x1="167.032" stroke-miterlimit="10" /></g><g id="g4786"><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4782" y2="1.937" x2="226.532" y1="98.063004" x1="226.532" stroke-miterlimit="10" /><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4784" y2="1.937" x2="143.032" y1="98.063004" x1="143.032" stroke-miterlimit="10" /></g><g id="g4792"><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4788" y2="8.25" x2="136.71899" y1="8.25" x1="232.845" stroke-miterlimit="10" /><line style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="line4790" y2="91.75" x2="136.71899" y1="91.75" x1="232.845" stroke-miterlimit="10" /></g><circle style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="circle4794" r="41.700001" cy="50" cx="184.782" stroke-miterlimit="10" /><circle style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="circle4796" r="25.162001" cy="50" cx="184.782" stroke-miterlimit="10" /><circle style="fill:none;stroke-width:0.25;stroke-miterlimit:10" id="circle4798" r="17.75" cy="50" cx="184.782" stroke-miterlimit="10" /></g></svg>
    <!-- Import -->
    <svg id="import" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" x="0px" y="0px"><title>67 all</title><path d="M93,74V53a3,3,0,1,0-6,0V74a9,9,0,0,1-9,9H22a9,9,0,0,1-9-9V53a3,3,0,0,0-6,0V74A15,15,0,0,0,22,89H78A15,15,0,0,0,93,74Z"/><path d="M50,7a3,3,0,0,0-3,3V29H37.17l13,13,13-13H53V10A3,3,0,0,0,50,7Z"/><path d="M94.35,40a3,3,0,0,0-3-3H74.65A8.66,8.66,0,0,0,66,45.65V58H56L69,71,82,58H72V45.65A2.65,2.65,0,0,1,74.65,43h16.7A3,3,0,0,0,94.35,40Z"/><path d="M6,40a3,3,0,0,0,3,3H26.7a2.65,2.65,0,0,1,2.65,2.65V58h-10l13,13,13-13h-10V45.65A8.66,8.66,0,0,0,26.7,37H9A3,3,0,0,0,6,40Z"/></svg>
    <!-- Process -->
    <svg id="process" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 65 81.25" enable-background="new 0 0 65 65" xml:space="preserve"><g><path d="M61.7,50.6V16.4c0-2.1-1.7-3.7-3.8-3.7H44.9c-3.2-3.1-7.4-5-12.1-5.1c-4.9-0.1-9.6,1.8-13,5.1H7c-2.1,0-3.8,1.7-3.8,3.7   v34.3h-3.5v3l2.8,3.9h60l2.8-3.9v-3H61.7z M4.8,16.4c0-1.2,1-2.2,2.3-2.2h11.4c-1.4,1.7-2.6,3.7-3.3,5.9l1.4,0.5   c2.2-7,8.9-11.7,16.2-11.5c7.4,0.2,13.8,5.4,15.6,12.5l-4.6,0l5.5,7.2l5.5-7.2l-4.9,0c-0.6-2.8-1.9-5.3-3.7-7.4H58   c1.2,0,2.3,1,2.3,2.2v34.3H4.8V16.4z M51.8,23l-2.5,3.3L46.8,23L51.8,23z M63.7,53.1l-2,2.8H3.3l-2-2.8v-1h62.5V53.1z"/><path d="M23,28.2c0.2,0.8,0.5,1.5,0.9,2.2l-1.3,2l2.9,2.9l2-1.4c0.7,0.4,1.4,0.7,2.2,0.9l0.4,2.3l4.1,0l0.4-2.3   c0.8-0.2,1.5-0.5,2.2-0.9l2,1.3l2.9-2.9l-1.4-2c0.4-0.7,0.7-1.4,0.9-2.2l2.3-0.4l0-4.1l-2.3-0.4c-0.2-0.8-0.5-1.5-0.9-2.2l1.3-2   l-2.9-2.9l-2,1.4c-0.7-0.4-1.4-0.7-2.2-0.9l-0.4-2.3l-4.1,0l-0.4,2.3c-0.8,0.2-1.5,0.5-2.2,0.9l-2-1.3L22.5,19l1.4,2   c-0.4,0.7-0.7,1.4-0.9,2.2l-2.3,0.4l0,4.1L23,28.2z M24.3,24.5l0.1-0.5c0.2-0.9,0.6-1.8,1.1-2.6l0.3-0.4l-1.2-1.7l1.1-1.1l1.8,1.2   l0.4-0.3c0.8-0.5,1.7-0.9,2.6-1.1l0.5-0.1l0.4-2.1l1.6,0l0.4,2.1l0.5,0.1c0.9,0.2,1.8,0.6,2.6,1.1l0.4,0.3l1.7-1.2l1.1,1.1   l-1.2,1.8l0.3,0.4c0.5,0.8,0.9,1.7,1.1,2.6l0.1,0.5l2.1,0.4l0,1.6L40,26.8l-0.1,0.5c-0.2,1-0.6,1.8-1.1,2.6l-0.3,0.4l1.2,1.7   l-1.1,1.1L36.9,32l-0.4,0.3c-0.8,0.5-1.7,0.9-2.6,1.1l-0.5,0.1L33,35.6l-1.6,0L31,33.5l-0.5-0.1c-0.9-0.2-1.8-0.6-2.6-1.1L27.4,32   l-1.7,1.2l-1.1-1.1l1.2-1.8L25.5,30c-0.5-0.8-0.9-1.7-1.1-2.6l-0.1-0.5l-2.1-0.4l0-1.6L24.3,24.5z"/><path d="M32.1,30.8L32.1,30.8c2.9,0,5.2-2.4,5.2-5.2c0-2.8-2.3-5.2-5.2-5.2c-2.9,0-5.2,2.4-5.2,5.2C27,28.5,29.3,30.8,32.1,30.8z    M32.1,22c2,0,3.7,1.6,3.7,3.7c0,2-1.6,3.7-3.7,3.7l0,0.8v-0.8c-2,0-3.7-1.6-3.7-3.7C28.4,23.6,30.1,22,32.1,22z"/><path d="M32.2,42.2c-7.4-0.2-13.8-5.4-15.6-12.5l4.6,0l-5.5-7.2l-5.5,7.2l4.9,0c1.8,7.9,8.9,13.8,17.1,14c0.2,0,0.3,0,0.5,0   c7.8,0,14.8-5.1,17.2-12.5l-1.4-0.5C46.2,37.6,39.6,42.4,32.2,42.2z M15.7,24.9l2.5,3.2l-5,0L15.7,24.9z"/></g></svg>
    <!-- paint -->
    <svg id="paint" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 64 80" style="enable-background:new 0 0 64 64;" xml:space="preserve"><g><path d="M37,10H5v8h32V10z M35,16H7v-4h28V16z"/><path d="M29,38c2.757,0,5-2.243,5-5s-2.243-5-5-5s-5,2.243-5,5S26.243,38,29,38z M29,30c1.654,0,3,1.346,3,3s-1.346,3-3,3   s-3-1.346-3-3S27.346,30,29,30z"/><path d="M34,45c0-2.757-2.243-5-5-5s-5,2.243-5,5s2.243,5,5,5S34,47.757,34,45z M29,48c-1.654,0-3-1.346-3-3s1.346-3,3-3   s3,1.346,3,3S30.654,48,29,48z"/><path d="M37,49c-2.757,0-5,2.243-5,5s2.243,5,5,5s5-2.243,5-5S39.757,49,37,49z M37,57c-1.654,0-3-1.346-3-3s1.346-3,3-3   s3,1.346,3,3S38.654,57,37,57z"/><path d="M55.512,37.422l1.467-15.158C56.992,22.119,57,21.976,57,21.831V19.5c0-1.431-0.684-2.693-1.728-3.518   C56.291,15.201,57,13.927,57,12c0-1.156-0.257-2.192-0.765-3.08C55.416,7.485,55,6.05,55,4.652V1.382l-1.447,0.724   C53.285,2.239,47,5.446,47,11c0,2.394,1.085,4.193,2.499,5.171C48.586,16.995,48,18.175,48,19.5v2.388   c0,0.096,0.003,0.192,0.009,0.289l0.855,13.255c-1.122-0.735-1.908-1.955-2.074-3.354c-0.011-0.099-0.023-0.181-0.037-0.26   c-0.703-3.756-2.83-6.94-5.753-9.056V6c0-2.757-2.243-5-5-5H6C3.243,1,1,3.243,1,6v44c0,2.757,2.243,5,5,5h14.604   c3.009,4.795,8.329,8,14.396,8h14.5C56.944,63,63,56.944,63,49.5C63,44.385,60.035,39.683,55.512,37.422z M49,11   c0-2.869,2.387-5.054,4.001-6.202c0.027,1.702,0.531,3.422,1.498,5.114C54.831,10.494,55,11.196,55,12c0,2.479-1.632,3-3,3   C50.558,15,49,13.471,49,11z M52.093,51.991C52.062,51.992,52.032,52,52,52c-0.021,0-0.041-0.006-0.063-0.006L50.066,23H53v-2h-3   v-1.5c0-1.379,1.121-2.5,2.5-2.5s2.5,1.121,2.5,2.5v2.331c0,0.08-0.004,0.161-0.012,0.24L52.093,51.991z M54.543,47.438   C54.832,47.9,55,48.432,55,49c0,0.785-0.31,1.495-0.805,2.03L54.543,47.438z M49.625,47.221l0.251,3.895   C49.335,50.573,49,49.825,49,49C49,48.338,49.237,47.729,49.625,47.221z M6,3h30c1.654,0,3,1.346,3,3H3C3,4.346,4.346,3,6,3z M6,53   c-1.654,0-3-1.346-3-3v-3h15.051c0.04,0.678,0.114,1.346,0.231,2H15v2h3.753c0.212,0.688,0.479,1.352,0.773,2H6z M18,36H7v-4   h11.231C18.089,32.814,18,33.646,18,34.5V36z M18.724,30H5v8h13v7H3V8h36v13.55c-0.642-0.323-1.31-0.597-2-0.822V20H5v8h14.557   C19.233,28.642,18.951,29.308,18.724,30z M25.188,22c-1.732,1.018-3.232,2.381-4.409,4H7v-4H25.188z M49.5,61H35   c-8.271,0-15-6.729-15-15V34.5C20,27.607,25.607,22,32.5,22c6.015,0,11.183,4.283,12.284,10.172l0.02,0.138   c0.294,2.477,1.95,4.562,4.209,5.423l0.45,6.981C47.944,45.615,47,47.253,47,49c0,2.757,2.243,5,5,5s5-2.243,5-5   c0-1.646-0.843-3.188-2.21-4.116l0.513-5.305C58.77,41.62,61,45.405,61,49.5C61,55.841,55.841,61,49.5,61z"/></g></svg>
</div>