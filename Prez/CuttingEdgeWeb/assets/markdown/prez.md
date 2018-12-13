<!-- .slide: data-background="./assets/images/galaxy_2.jpg" class="transition text-white" data-type-show="prez"  -->

<h1>
    The Cutting Edge Web
    <br> is coming
</h1>

<h2>2018 @TouraineTech : <img src="./assets/images/touraine_tech.svg" class="h-100"></img></h2>




##==##

<!-- .slide: data-background="./assets/images/galaxy_2.jpg" class="transition text-white" data-type-show="full"  -->

<h1>
    The Cutting Edge Web
    <br> is coming
</h1>


##==##


## Instant Citation

<br>

<blockquote>
<cite>
  J'ai appris plein de choses mais je vais rien pouvoir utiliser en prod.
</cite>
</blockquote>

<div class="citation-author">Vous à la sortie de cette prez</div>
<img src="./assets/images/NOTSUREIF.png" class="citation-img"></img>

##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

### Jean-François Garreau

<!-- .element: class="descjf" -->
GDE Web Technologies,  Front-end developer & Community Manager

![avatar w-300 wp-200](assets/images/jf_astronaut.png)


![company_logo](assets/images/logo-SFEIR-blanc-orange.svg)
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


Notes:
3 FRAGMENTS !
Préciser Types de valeurs !
Var de Var
Gestion des states

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

Notes:
Mettre Color => Couleur différente + :hover

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

Notes:
3 FRAGMENTS !


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


Notes:
Pb des states, pas assez précis
Pouvant être limitant

##==##

<!-- .slide: data-background="./assets/images/morpheus.jpg" class="transition text-white no-filter"  data-copyrights="true "  -->

## Et donc on choisit quoi ?

<div class="copyrights">matrix</div>


##==##


## Instant Citation

<br>

<blockquote>
<cite>
 Je ne fais jamais de mixins css, mais quand je le fais, c'est avec la nouvelle spec.
</cite>
</blockquote>

<div class="citation-author">The most interesting man in the world</div>
<img src="./assets/images/most_intersting_man.png" class="citation-img"></img>



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

Notes:
2 FRAGMENTS !


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


Notes:
Remplacement partiel du nom ou complet avec des *

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

Notes:
Revenir sur chaque point et sur le forward ! partir des composants

##==##

<!-- .slide: data-background="./assets/images/shut-up-and-take-my-money.jpg" class="transition text-white no-filter"  data-copyrights="true "  -->


<div class="copyrights black">futurama</div>

Notes:
Bon faut s'exiter non plus. c'est pas prod safe

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
 Les Webcomponents c'est comme le monstre du Loch Ness, on en entend beaucoup parler mais on en voit toujours pas en prod.
</cite>
</blockquote>

<div class="citation-author">Monsieur mauvaise foi</div>
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
    </article>
</template>
```

Notes:
Lié à des templates !!!
Notion de repeat pas sèche, ne sait pas si ça doit en faire parti
Binding auto
ngIf implicit
Proposal de standard !

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

Notes:
3 FRAGMENTS !
Objectif de création de contenu custo !


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
const template = fooDoc.querySelector('template');
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
const template = fooDoc.querySelector('template');
```

<mask-highlighter id="highlight-html-module"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>

Notes:
3 FRAGMENTS !
Revenir sur l'export !

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

<!-- .slide: class="transition text-white transparent" data-state="stop-code-html-module" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#magic" />
    </svg><br>Houdini CSS
</h1>


##==##

<!-- .slide: data-state="start-video-magic"-->
## Pourquoi Houdini ?

<div class="center-element">
    <img id="magicVideo" src="./assets/images/magic.gif" class="fh-500">
    <!--<video id="magicVideo" data-autoplay  preload="auto"  class="fh-500">
        <source src="./assets/images/magic.webm">
        <source src="./assets/images/magic.mp4">
    </video>-->
</div>

Notes:
Houdini vous révèles les dessous de la magie des navigateurs !

##==##

<!-- .slide: data-type-show="prez" -->

## Qu'est ce que Houdini CSS ?

<p class="fragment">Worklet</p>
<p class="fragment">CSS Paint API</p>
<p class="fragment">Layout Paint API</p>
<p class="fragment">Parser API</p>
<p class="fragment">Typed OM</p>
<p class="fragment">Properties & Values API</p>

Notes:
Thread de perfs graphiques
Paint genre canvas => dessin de backgrounds ! (cf après)
Layout : Mansori
Parser
Gestion des objets CSS (cf après)
Properties & values => définition de types !

##==##

<!-- .slide: data-type-show="full" -->

## Qu'est ce que Houdini CSS ?

<p class="fragment">Worklet : Threads, Animation</p>
<p class="fragment">CSS Paint API : Custom Rendering, Custom backgrounds</p>
<p class="fragment">Layout Paint API : Custom Layout</p>
<p class="fragment">Parser API : Nouvelle interprétation des éléments</p>
<p class="fragment">Typed OM : Objets javascripts visant à représenter le CSS</p>
<p class="fragment">Properties & Values API : Api de manipulation des properties au sens large (typés)</p>



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

Notes:
3 FRAGMENTS !

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


Notes:
Modifier Couleur ou Taille !

##==##

<!-- .slide: class="transition text-white transparent"  -->

<h1>
    <svg class="fh-250 color-white">
        <use xlink:href="#brace" />
    </svg><br>Typed CSSOM
</h1>


##==##

<!-- .slide: class="transition text-white transparent with-code big-code"  -->

<h1>Le problème</h1>
```javascript
$('#someDiv').style.height
    = getRandomInt() + 'px';
```

Notes:
Eviter le parsing inutile

##==##

<!-- .slide: class="with-code no-highlight" -->

## Manipulation depuis le JS

```javascript
myElement.attributeStyleMap.set("opacity", CSS.number(3));
myElement.attributeStyleMap.set("z-index", CSS.number(15.4));

console.log(myElement.attributeStyleMap.get("opacity").value); // 3
console.log(myElement.attributeStyleMap.get("z-index").value); // 15.4
```

##==##

<!-- .slide: class="with-code no-highlight" -->

## calc(1px - 2 * 3em)

```javascript
CSSMathSum(
    CSS.px(1),
    CSSMathNegate(
        CSSMathProduct(
            2,
            CSS.em(3)
        )
    )
)
```

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

Notes:
Nouvelles APIs fraichement dispos

##==##

<!-- .slide: class="transition text-white transparent"  data-state="stop-code-generic-sensor" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#gyroscope" />
    </svg><br>Generic Sensors
</h1>

##==##

<!-- .slide: class="with-code no-highlight" data-type-show="full" -->

## Interface Generic Sensor

```javascript
interface Sensor : EventTarget {
  readonly attribute boolean activated;
  readonly attribute boolean hasReading;
  readonly attribute DOMHighResTimeStamp? timestamp;
  void start();
  void stop();
  attribute EventHandler onreading;
  attribute EventHandler onactivate;
  attribute EventHandler onerror;
};
```

##==##

<!-- .slide: class="with-code no-highlight"  data-type-show="full" -->

## Exemple Acceléromètre

```javascript
navigator.permissions.query({ name: 'accelerometer' }).then(result => {
    if (result.state === 'denied') {
        return;
    }
    let acl = new Accelerometer({frequency: 30});
    acl.addEventListener('activate', () => console.log('Ready to measure.'));
    acl.addEventListener('error', error => console.log(`Error: ${error.name}`));
    acl.addEventListener('reading', () => {
        let magnitude = Math.hypot(acl.x, acl.y, acl.z);
    });
    acl.start();
});
```


##==##

<!-- .slide: class="with-code no-highlight" data-state="code-generic-sensor stop-code-accelerometer-sensor" data-type-show="prez" -->

## Interface Generic Sensor

```javascript
interface Sensor : EventTarget {
  readonly attribute boolean activated;
  readonly attribute boolean hasReading;
  readonly attribute DOMHighResTimeStamp? timestamp;
  void start();
  void stop();
  attribute EventHandler onreading;
  attribute EventHandler onactivate;
  attribute EventHandler onerror;
};
```



<mask-highlighter id="highlight-generic-sensor"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>

Notes:
4 FRAGMENTS !

##==##

<!-- .slide: class="with-code no-highlight"  data-state="stop-code-generic-sensor code-accelerometer-sensor" data-type-show="prez" -->

## Exemple Acceléromètre

```javascript
navigator.permissions.query({ name: 'accelerometer' }).then(result => {
    if (result.state === 'denied') {
        return;
    }
    let acl = new Accelerometer({frequency: 30});
    acl.addEventListener('activate', () => console.log('Ready to measure.'));
    acl.addEventListener('error', error => console.log(`Error: ${error.name}`));
    acl.addEventListener('reading', () => {
        let magnitude = Math.hypot(acl.x, acl.y, acl.z);
    });
    acl.start();
});
```


<mask-highlighter id="highlight-accelerometer-sensor"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>

Notes:
4 FRAGMENTS !

##==##

<!-- .slide: data-state="stop-code-accelerometer-sensor start-video-sensor" -->

<div class="center-element">
    <img id="sensorVideo" src="./assets/images/generic-sensor-api.gif" class="fh-600">
    <!--<video data-autoplay class="fh-600">
        <source src="./assets/images/generic-sensor-api.webm">
        <source src="./assets/images/generic-sensor-api.mp4">
    </video>-->
</div>

[Sensor Demo](https://sensor-compass.appspot.com/)

##==##

## Ce qui est supporté aujourd'hui

<div class="flex-hori flex-start">

<div>
<h4 class="color-blue"> Motion sensors</h4>
<br>
Accelerometer<br><br>
Gyroscope<br><br>
LinearAccelerationSensor<br><br>
AbsoluteOrientationSensor<br><br>
RelativeOrientationSensor<br><br>
</div>
<div>
<h4 class="color-blue"> Environmental sensors</h4>
<br>
AmbientLightSensor<br><br>
Magnetometer
</div>
</div>

##==##


## Instant Citation

<br>

<blockquote>
<cite>
 J'ai les yeux qui piquent maintenant et pourtant y a pas d'oignons...
</cite>
</blockquote>

<div class="citation-author">Vous encore</div>
<img src="./assets/images/batman-slap-robin.jpg" class="citation-img"></img>


##==##

<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#pip" />
    </svg><br>Picture In Picture
</h1>


##==##


# Demo

<div id="demo-pip">
    <video id="video-pip" height="400px" controls src="./assets/videos/short.mp4"></video>
    <button id="button-pip">Start Picture In Picture</button>
</div>


##==##


<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#bluetooth" />
    </svg><br>Web Bluetooth
</h1>


Notes:
Support Windows en cours !! Samsung Browser tout fraichement dispo

##==##


<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#binary" />
    </svg><br>Web Assembly
</h1>


##==##


<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#usb" />
    </svg><br>Web USB
</h1>


##==##


<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#nfc" />
    </svg><br>Web NFC
</h1>


Notes:
Standby à cause des generic sensors

##==##


<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#share" />
    </svg><br>Web Share
</h1>

Notes:
Comme en natif :)

##==##


<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#payement" />
    </svg><br>Web Payment
</h1>

Notes:
Simplification des process et négociation des infos

##==##


<!-- .slide: class="transition text-white transparent" -->

<h1>
    <svg class="fh-250 color-blue">
        <use xlink:href="#clock" />
    </svg><br>Web Clock
</h1>


<div class="center-element fragment troll fade-up">
    <img src="./assets/images/Trollface-PNG.png" class="h-500"></img>
</div>


##==##

# Pour aller plus loin et jouer un peu

[Part / Theme Polyfill](https://github.com/PolymerLabs/part-theme)

[Template-Instantiation](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md)

[Template Instantiation -polyfill proposal](https://github.com/componentkitchen/template-instantiation)

[HTML Module](https://github.com/w3c/webcomponents/issues/645)

[HTML Module Polyfill](https://github.com/TakayoshiKochi/script-type-module)

[Houdini](https://developers.google.com/web/updates/2016/05/houdini)

[TypedOM Polyfill](https://github.com/css-typed-om/typed-om)

[Generic Sensors Polyfill](https://github.com/kenchris/sensor-polyfills)


Notes:
Beaucoup de polyfills & bcp de proposals !

##==##

<!-- .slide: class="transition" -->

# Merci

<p>@jefBinomed</p>

<p>GDG Nantes Leader & Directeur Ingineering Sfeir Nantes</p>

https://goo.gl/D5EW29

<div class="credits">
    <h4 >Crédits : <a href="https://thenounproject.com/" target="_blank">The noun project</a></h4>
    <p>Alexander Zharikov / Ben Iconator / Icon Fair / Dimitry Sunseifer / Shaurya / Creative Stall / Eucalyp / Tanguy Keryhuel / Arthur Shlain / Viktor Vorobyev / Stephen Copinger / AFY Studio / Berkah Studio / Lara / Adrien Coquet / Maxim David / Gabriella Cinque</p>
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
    <!-- brace -->
    <svg id="brace" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.16 90.5875" x="0px" y="0px"><title>accolade</title><g data-name="Calque 2"><g><path d="M11,1l-.42.31A9.07,9.07,0,0,0,8.48,3.86l-.14.27a10.06,10.06,0,0,0-.86,3.31c-.07.8-.16,1.71-.16,2.73V25.25a9.27,9.27,0,0,1-.55,3.48,7.53,7.53,0,0,1-1.34,2.21l-.11.11a5.79,5.79,0,0,1-1.19,1l-.23.05C0,33.06-.09,35.58,0,36.62c.15,1.32.92,3,3.8,3.52l.33.06a3.33,3.33,0,0,1,1.18.91l.21.22a6.12,6.12,0,0,1,1.2,2.12,10.48,10.48,0,0,1,.58,3.83V62.21c0,1,.08,2,.16,2.81a10.21,10.21,0,0,0,.86,3.24l.14.28a9.05,9.05,0,0,0,2.06,2.52l.42.31A7.53,7.53,0,0,0,15,72.47h4.62v-7H14.81l-.14-.2a3.12,3.12,0,0,1-.22-.87c-.06-.68-.13-1.46-.13-2.17V47.29a16.92,16.92,0,0,0-1.1-6.49,12.31,12.31,0,0,0-2.83-4.51l-.19-.2.23-.25a14.51,14.51,0,0,0,2.76-4.33,16.13,16.13,0,0,0,1.13-6.26V10.18c0-.7.06-1.38.13-2.12a3.09,3.09,0,0,1,.21-.92L14.76,7h4.88V0H15A7.45,7.45,0,0,0,11,1Z"/><path d="M44.25,32.15,44,32.09a5.73,5.73,0,0,1-1.19-1l-.11-.11a7.28,7.28,0,0,1-1.31-2.15,9.28,9.28,0,0,1-.58-3.55V10.18c0-1-.08-1.93-.15-2.71a10.16,10.16,0,0,0-.86-3.33l-.14-.28a9.07,9.07,0,0,0-2.06-2.52L37.2,1a7.45,7.45,0,0,0-4.06-1H28.52V7H33.4l.09.13a3.2,3.2,0,0,1,.22,1c.07.72.13,1.4.13,2.1V25.25A16.16,16.16,0,0,0,35,31.58a14.4,14.4,0,0,0,2.73,4.26l.23.25-.19.2A12.23,12.23,0,0,0,35,40.74a17,17,0,0,0-1.13,6.55V62.21c0,.71-.06,1.46-.13,2.17a3.14,3.14,0,0,1-.22.88l-.14.2H28.52v7h4.62a7.53,7.53,0,0,0,4.06-1.1l.42-.31a9.05,9.05,0,0,0,2.07-2.52l.14-.28A10.25,10.25,0,0,0,40.68,65c.08-.83.16-1.81.16-2.81V47.29a10.49,10.49,0,0,1,.6-3.89,6,6,0,0,1,1.18-2.06l.21-.22A3.44,3.44,0,0,1,44,40.21l.32-.06c2.87-.53,3.65-2.2,3.8-3.52C48.25,35.58,48.11,33.05,44.25,32.15Z"/></g></g></svg>
    <!-- gyroscope -->
    <svg id="gyroscope" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path fill="none" d="M57.805,76.256c1.951-0.58,3.319-2.639,4.076-5.706c-2.489,2.026-5.06,3.778-7.65,5.245  C55.489,76.396,56.699,76.585,57.805,76.256z"/><path fill="none" d="M50,10c-22.056,0-40,17.944-40,40c0,22.056,17.944,40,40,40c22.056,0,40-17.944,40-40  C90,27.944,72.056,10,50,10z M66.438,66.438c-0.462,0.462-0.929,0.913-1.399,1.354c-0.43,6.7-2.49,11.449-6.033,12.503  c-2.411,0.717-5.184-0.376-7.977-2.84c-10.785,5.1-21.463,5.144-27.546-0.939c-9.064-9.063-4.542-28.333,10.079-42.954  c0.458-0.458,0.928-0.887,1.395-1.324c0.425-6.718,2.489-11.478,6.038-12.532c3.658-1.087,8.143,1.982,12.272,7.698  c3.445,4.77,6.642,11.382,8.9,18.979c1.479,4.975,2.388,9.815,2.763,14.215c-0.672,0.758-1.372,1.502-2.101,2.23  c-0.086,0.086-0.177,0.167-0.264,0.253c-0.098-4.693-0.979-10.243-2.694-16.016c-2.235-7.52-5.449-13.951-8.785-18.174  c-0.761-0.963-1.527-1.81-2.291-2.53c-3.085,1.49-6.176,3.448-9.133,5.86c0.282-2.28,0.811-3.972,1.473-5.067  c1.538-1.092,3.098-2.066,4.664-2.948c-1.271-0.614-2.49-0.794-3.604-0.463c-1.953,0.58-3.323,2.64-4.079,5.709  c0.003-0.003,0.007-0.006,0.011-0.009c-0.339,1.368-0.556,2.936-0.647,4.667c-0.002,0.002-0.004,0.004-0.006,0.006  c-0.067,1.273-0.066,2.633,0.003,4.063c0.216,4.413,1.086,9.491,2.65,14.755c2.418,8.135,5.981,15.002,9.605,19.17  c-0.856,0.397-1.712,0.765-2.566,1.085c-3.61-4.808-6.982-11.656-9.335-19.573c-1.434-4.825-2.333-9.523-2.728-13.816  c-0.1-1.089-0.16-2.145-0.196-3.176c-11.994,12.557-15.568,28.678-7.891,36.357c4.817,4.817,12.961,5.199,21.461,1.856  c-0.001-0.001-0.003-0.003-0.004-0.004c0.884-0.348,1.771-0.729,2.659-1.156c3.903-1.878,7.815-4.52,11.456-7.859  c0.557-0.51,1.109-1.031,1.652-1.574c0.291-0.291,0.572-0.586,0.854-0.882c11.988-12.554,15.558-28.669,7.883-36.343  c-4.44-4.439-11.704-5.112-19.47-2.575c-0.846-1.041-1.695-1.97-2.544-2.783c10.09-4.196,19.843-3.885,25.549,1.822  C85.581,32.547,81.06,51.817,66.438,66.438z M57.5,50c0,4.143-3.357,7.5-7.5,7.5c-4.142,0-7.5-3.357-7.5-7.5  c0-4.142,3.358-7.5,7.5-7.5C54.143,42.5,57.5,45.858,57.5,50z"/><path d="M88.721,14.814C89.132,14.923,89.555,15,90,15c2.762,0,5-2.238,5-5s-2.238-5-5-5s-5,2.238-5,5  c0,0.445,0.077,0.868,0.186,1.279l-5.188,5.187C72.037,9.339,61.526,5,50,5C25.147,5,5,25.147,5,50  c0,11.526,4.339,22.037,11.466,29.998l-5.187,5.188C10.868,85.077,10.445,85,10,85c-2.761,0-5,2.238-5,5s2.239,5,5,5s5-2.238,5-5  c0-0.445-0.077-0.868-0.186-1.279l5.187-5.188C27.963,90.661,38.473,95,50,95c24.853,0,45-20.147,45-45  c0-11.527-4.339-22.037-11.467-29.999L88.721,14.814z M50,90c-22.056,0-40-17.944-40-40c0-22.056,17.944-40,40-40  c22.056,0,40,17.944,40,40C90,72.056,72.056,90,50,90z"/><path d="M50.967,21.661c0.849,0.813,1.699,1.742,2.544,2.783c7.766-2.537,15.029-1.864,19.47,2.575  c7.675,7.674,4.105,23.79-7.883,36.343c-0.282,0.296-0.563,0.591-0.854,0.882c-0.543,0.543-1.096,1.064-1.652,1.574  c-3.641,3.34-7.553,5.981-11.456,7.859c-0.888,0.427-1.775,0.809-2.659,1.156c0.001,0.001,0.002,0.003,0.004,0.004  c-8.5,3.343-16.645,2.961-21.461-1.856c-7.677-7.679-4.103-23.8,7.891-36.357c0.036,1.032,0.096,2.087,0.196,3.176  c0.395,4.293,1.293,8.991,2.728,13.816c2.353,7.917,5.725,14.766,9.335,19.573c0.854-0.32,1.709-0.688,2.566-1.085  c-3.624-4.168-7.187-11.035-9.605-19.17c-1.564-5.264-2.434-10.342-2.65-14.755c-0.07-1.431-0.07-2.79-0.003-4.063  c0.002-0.002,0.004-0.004,0.006-0.006c0.091-1.73,0.308-3.298,0.647-4.667c-0.003,0.003-0.007,0.006-0.011,0.009  c0.756-3.069,2.126-5.129,4.079-5.709c1.114-0.331,2.333-0.151,3.604,0.463c-1.566,0.882-3.126,1.856-4.664,2.948  c-0.662,1.095-1.191,2.787-1.473,5.067c2.957-2.413,6.047-4.371,9.133-5.86c0.763,0.72,1.53,1.567,2.291,2.53  c3.336,4.223,6.55,10.654,8.785,18.174c1.716,5.773,2.597,11.323,2.694,16.016c0.087-0.086,0.178-0.167,0.264-0.253  c0.729-0.729,1.429-1.473,2.101-2.23c-0.375-4.4-1.283-9.24-2.763-14.215c-2.259-7.598-5.455-14.209-8.9-18.979  c-4.129-5.716-8.614-8.785-12.272-7.698c-3.549,1.055-5.613,5.814-6.038,12.532c-0.467,0.437-0.937,0.866-1.395,1.324  C18.941,48.184,14.419,67.453,23.483,76.517c6.083,6.083,16.761,6.039,27.546,0.939c2.793,2.464,5.565,3.557,7.977,2.84  c3.543-1.054,5.604-5.803,6.033-12.503c0.471-0.441,0.938-0.893,1.399-1.354C81.06,51.817,85.581,32.547,76.517,23.483  C70.811,17.776,61.058,17.465,50.967,21.661z M57.805,76.256c-1.105,0.329-2.315,0.141-3.574-0.461  c2.591-1.467,5.161-3.219,7.65-5.245C61.124,73.617,59.756,75.676,57.805,76.256z"/><circle cx="50" cy="50" r="7.5"/></svg>
    <!-- Bluetooth -->
    <svg id="bluetooth" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve"><g><g><path d="M50,5C25.1,5,5,25.1,5,50c0,24.9,20.1,45,45,45c24.9,0,45-20.1,45-45C95,25.1,74.9,5,50,5z M65.2,65.1L51.8,78.3    c-0.6,0.6-1.3,0.9-2.1,0.9c-0.4,0-0.8-0.1-1.2-0.2c-1.1-0.5-1.8-1.6-1.8-2.8V65.9c0-1.7,1.3-3,3-3s3,1.3,3,3V69l6.2-6.1l-9.2-9    L38.3,65c-0.6,0.6-1.3,0.9-2.1,0.9c-0.8,0-1.6-0.3-2.1-0.9c-1.2-1.2-1.1-3.1,0-4.2l11.2-11L34.2,38.8c-1.2-1.2-1.2-3.1,0-4.2    c1.2-1.2,3.1-1.2,4.2,0l11.3,11l8.8-8.6l-5.8-5.6v2.4c0,1.7-1.3,3-3,3s-3-1.3-3-3v-9.5c0-1.2,0.7-2.3,1.8-2.8    c1.1-0.5,2.4-0.2,3.3,0.6l13,12.8c0.6,0.6,0.9,1.3,0.9,2.1s-0.3,1.6-0.9,2.1L53.9,49.8l11.3,11.1c0.6,0.6,0.9,1.3,0.9,2.1    S65.8,64.5,65.2,65.1z"/></g></g></svg>
    <!-- binary -->
    <svg id="binary" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 53.345 100" enable-background="new 0 0 53.345 100" xml:space="preserve"><path d="M26.599,0.22c-4.028,0-7.281,4.893-7.281,10.901c0,6.01,3.253,10.863,7.281,10.863
	c4.027,0,7.281-4.853,7.281-10.863C33.879,5.112,30.625,0.22,26.599,0.22z M26.599,17.379c-2.43,0-4.408-2.948-4.408-6.572
	c0-3.625,1.978-6.573,4.408-6.573c2.428,0,4.407,2.948,4.407,6.573C31.005,14.431,29.027,17.379,26.599,17.379z"></path><rect x="23.822" y="26.674"  width="5.551" height="21.764"></rect><rect x="23.822" y="52.899"  width="5.551" height="21.765"></rect><path  d="M26.599,78.015c-4.028,0-7.281,4.892-7.281,10.902c0,6.009,3.253,10.861,7.281,10.861
	c4.027,0,7.281-4.853,7.281-10.861C33.879,82.907,30.625,78.015,26.599,78.015z M26.599,95.174c-2.43,0-4.408-2.947-4.408-6.572
	s1.978-6.572,4.408-6.572c2.428,0,4.407,2.947,4.407,6.572S29.027,95.174,26.599,95.174z"></path><rect x="43.289" y="0.227"  width="5.553" height="21.764"></rect><path  d="M46.065,48.43c4.027,0,7.28-4.853,7.28-10.862c0-6.009-3.253-10.902-7.28-10.902s-7.28,4.893-7.28,10.902
	C38.785,43.577,42.038,48.43,46.065,48.43z M46.065,30.681c2.43,0,4.408,2.948,4.408,6.572s-1.979,6.572-4.408,6.572
	s-4.407-2.948-4.407-6.572S43.635,30.681,46.065,30.681z"></path><rect x="43.289" y="52.67"  width="5.553" height="21.764"></rect><path  d="M46.065,78.009c-4.027,0-7.28,4.891-7.28,10.9c0,6.011,3.253,10.863,7.28,10.863s7.28-4.853,7.28-10.863
	C53.345,82.901,50.092,78.009,46.065,78.009z M46.065,95.168c-2.43,0-4.407-2.948-4.407-6.572c0-3.625,1.978-6.573,4.407-6.573
	s4.408,2.948,4.408,6.573C50.473,92.22,48.495,95.168,46.065,95.168z"></path><rect x="4.505" y="78.236"  width="5.552" height="21.764"></rect><path  d="M7.281,52.453C3.253,52.453,0,57.346,0,63.354c0,6.01,3.253,10.862,7.281,10.862
	c4.027,0,7.281-4.853,7.281-10.862C14.562,57.346,11.308,52.453,7.281,52.453z M7.281,69.612c-2.43,0-4.408-2.947-4.408-6.572
	s1.978-6.572,4.408-6.572c2.429,0,4.408,2.947,4.408,6.572S9.71,69.612,7.281,69.612z"></path><path  d="M7.281,26.004C3.253,26.004,0,30.896,0,36.906c0,6.009,3.253,10.862,7.281,10.862
	c4.027,0,7.281-4.853,7.281-10.862C14.562,30.896,11.308,26.004,7.281,26.004z M7.281,43.164c-2.43,0-4.408-2.948-4.408-6.573
	c0-3.625,1.978-6.572,4.408-6.572c2.429,0,4.408,2.948,4.408,6.572C11.688,40.216,9.71,43.164,7.281,43.164z"></path><path  d="M7.281,0C3.253,0,0,4.892,0,10.901c0,6.01,3.253,10.863,7.281,10.863c4.027,0,7.281-4.853,7.281-10.863
	C14.562,4.892,11.308,0,7.281,0z M7.281,17.159c-2.43,0-4.408-2.948-4.408-6.573c0-3.625,1.978-6.572,4.408-6.572
	c2.429,0,4.408,2.948,4.408,6.572C11.688,14.211,9.71,17.159,7.281,17.159z"></path></svg>
    <!-- USB -->
    <svg id="usb" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 100 125"><g transform="translate(0,-952.36218)"><path style="text-indent:0;text-transform:none;direction:ltr;block-progression:tb;baseline-shift:baseline;enable-background:accumulate;" d="m 50.03125,967.36227 c -2.34689,4.6549 -4.69993,9.3061 -7.03125,13.9688 l 4,0 0,35.01843 -4,-2.1122 0,-18.93753 c 1.19698,-0.9135 2,-2.3155 2,-3.9375 0,-3.0128 -2,-5.0128 -5,-5 -3,-0.013 -5,1.9872 -5,4.9998 0,1.622 0.80302,3.024 2,3.9375 l 0,22.06253 10,4.9872 0,6.044 c -1.19955,0.9135 -2,2.3448 -2,3.9688 0,2.7614 2.23858,5 5,5 2.76142,0 5,-2.2386 5,-5 0,-1.624 -0.80045,-3.0553 -2,-3.9688 l 0,-9.125 c 0,0 10,-5.919 10,-5.9062 l 0,-20.00003 2,0 c 0,-3.3333 0,-6.6667 0,-10 -3.36797,0 -7.03476,0 -10,0 0,3.368 0,7.0348 0,10 l 2,0 0,16.96883 -4,2.125 0,-31.09383 4,0 c -2.3196,-4.6685 -4.64912,-9.3313 -6.96875,-13.9998 z"  fill-opacity="1" stroke="none" marker="none" visibility="visible" display="inline" overflow="visible"/></g></svg>
    <!-- NFC -->
    <svg id="nfc" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 64 80" enable-background="new 0 0 64 64" xml:space="preserve"><g><g><path  d="M39.6,28.4c-0.2-0.2-0.6-0.4-0.9-0.4l-25.1,0c-0.7,0-1.3,0.6-1.3,1.3l0,17.5c0,0.7,0.6,1.3,1.3,1.3h25.1    c0.3,0,0.7-0.1,0.9-0.4c0.2-0.2,0.4-0.6,0.4-0.9l0-17.5C40,29,39.8,28.7,39.6,28.4z M37.5,30.6l0,2.4H14.9l0-2.4L37.5,30.6z     M14.9,45.5l0-10.1h22.6l0,10.1H14.9z"/><path  d="M39.5,24.2c-0.7,0-1.3,0.6-1.3,1.3c0,0.7,0.6,1.3,1.3,1.3c0.4,0,0.7,0.1,0.9,0.4c0.2,0.2,0.4,0.6,0.4,0.9    c0,0.7,0.6,1.3,1.3,1.3s1.3-0.6,1.3-1.3c0-1-0.4-2-1.1-2.7C41.5,24.6,40.5,24.2,39.5,24.2z"/><path  d="M39.5,20.1c-0.7,0-1.3,0.6-1.3,1.3s0.6,1.3,1.3,1.3c1.5,0,2.8,0.6,3.9,1.6c1,1,1.6,2.4,1.6,3.9    c0,0.7,0.6,1.3,1.3,1.3s1.3-0.6,1.3-1.3c0-2.1-0.8-4.1-2.3-5.6C43.6,20.9,41.6,20.1,39.5,20.1z"/><path  d="M48.1,19.5c-2.3-2.3-5.3-3.5-8.6-3.5c-0.7,0-1.3,0.6-1.3,1.3c0,0.7,0.6,1.3,1.3,1.3c2.6,0,5,1,6.8,2.8    c1.8,1.8,2.8,4.2,2.8,6.8c0,0.7,0.6,1.3,1.3,1.3s1.3-0.6,1.3-1.3C51.6,24.8,50.4,21.8,48.1,19.5z"/><polygon  points="22.6,41.4 22.5,41.4 20.4,37.7 19,37.7 19,43.6 20.4,43.6 20.4,39.9 20.4,39.9 22.6,43.6     23.9,43.6 23.9,37.7 22.6,37.7   "/><polygon  points="24.9,43.6 26.2,43.6 26.2,41.3 28.4,41.3 28.4,40.2 26.2,40.2 26.2,38.8 28.8,38.8 28.8,37.7     24.9,37.7   "/><path  d="M31,39.1c0.2-0.2,0.4-0.4,0.7-0.4c0.4,0,0.6,0.1,0.8,0.2c0.2,0.2,0.2,0.4,0.2,0.8H34l0,0    c0-0.7-0.2-1.2-0.6-1.5c-0.4-0.3-1-0.5-1.7-0.5c-0.7,0-1.3,0.2-1.7,0.7c-0.4,0.4-0.6,1-0.6,1.8v1.2c0,0.7,0.2,1.3,0.7,1.8    c0.4,0.4,1,0.7,1.8,0.7c0.7,0,1.3-0.2,1.7-0.5c0.4-0.3,0.6-0.9,0.6-1.5l0,0h-1.3c0,0.4-0.1,0.6-0.2,0.8c-0.1,0.2-0.4,0.2-0.7,0.2    c-0.3,0-0.6-0.1-0.8-0.4c-0.2-0.2-0.3-0.6-0.3-1v-1.2C30.8,39.6,30.8,39.3,31,39.1z"/></g></g></svg>
    <!-- share -->
    <svg id="share" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve"><path d="M76.3,40.7c9.8,0,17.8-8,17.8-17.8S86.1,5,76.3,5c-9.8,0-17.8,8-17.8,17.8c0,3.4,1,6.5,2.6,9.2L34.9,51.1  c-3-3.6-7.5-5.8-12.6-5.8c-9.1,0-16.5,7.4-16.5,16.5s7.4,16.5,16.5,16.5c6,0,11.2-3.2,14.1-8l21.4,8.5c-0.4,1.2-0.6,2.5-0.6,3.8  c0,6.8,5.6,12.4,12.4,12.4C76.5,95,82,89.4,82,82.6c0-6.8-5.6-12.4-12.4-12.4c-4.4,0-8.3,2.4-10.5,5.9l-21.4-8.5  c0.7-1.8,1.1-3.8,1.1-5.8c0-3-0.8-5.8-2.2-8.2l26.2-19.1C66,38.3,70.9,40.7,76.3,40.7z"/></svg>
    <!-- payement -->
    <svg id="payement" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="-949 951 100 125" style="enable-background:new -949 951 100 100;" xml:space="preserve"><switch><foreignObject requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/" x="0" y="0" width="1" height="1"/><g i:extraneous="self"><g><path d="M-852.1,987l-17.7-29.8c-2.1-3.6-6-4.6-9-2.8l-47.2,28.1c-2.6,1.5-3.7,4.6-2.5,7.7c-4.1,2.6-10.8,28.2-10.8,28.2     l-5.8,4.8c-1.3,1.1-1.7,2.9-1,4.5l10.2,19c0.9,1.6,2.8,2.3,4.5,1.6c3.2-1.4,8.5-3.4,13.3-4.1c3.7-0.5,8.3-4.1,9-5.1     c2.4-2.9,26.7-32.8,26.7-32.8c2.4-3,1.8-7.5-1.4-9.7c-2.9-2-6.9-1.3-9.2,1.4l-11.5,14.1c-1.8,2.2-5.1,1.9-6.5-0.5l-6-10.1     l50.5-30.1l10.2,17.1c0.5,0.9,0.2,2.1-0.7,2.7l-19.3,11.5c0,0.1,0,0.1,0,0.2c0,1.5-0.5,3-1.5,4.2l-11.8,14.5l0.3,0.5     c1.2,2.2,4,2.9,6.2,1.7l0.7-0.4c2.2-1.2,3.1-3.8,2.5-6.1c0.5,0.2,1,0.2,1.5,0.2c0.9,0,1.8-0.2,2.6-0.7c2.5-1.4,3.4-4.7,2-7.2l0,0     c0.5,0.2,1,0.2,1.6,0.2c0.9,0,1.8-0.2,2.6-0.7c2.4-1.3,3.3-4.3,2.2-6.7l12.7-7.5C-851.7,993.2-850.7,989.3-852.1,987z      M-921.8,993.4l-2.7-4.5c-0.6-0.9-0.2-2.1,0.7-2.7l47.2-28.1c0.9-0.5,2.1-0.2,2.7,0.7l2.7,4.5L-921.8,993.4z"/><path d="M-873.7,994.1l8.9-5.3c0.9-0.5,1.2-1.7,0.7-2.6l-3-5.1c-0.5-0.9-1.7-1.2-2.6-0.7l-8.9,5.3c-0.9,0.5-1.2,1.7-0.7,2.6     l3,5.1C-875.8,994.3-874.6,994.6-873.7,994.1z"/></g></g></switch></svg>
    <!-- clock -->
    <svg id="clock" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><path d="M95,27.253H83.874V16.126H72.747V5H27.253v11.126H16.126v11.126H5v45.494h11.126v11.127h11.126V95h45.494V83.874h11.127   V72.747H95V27.253z M71.758,82.885H28.242V71.758H17.115V28.242h11.126V17.115h43.516v11.126h11.127v43.516H71.758V82.885z"/><polygon points="50.495,49.505 50.495,27.253 38.379,27.253 38.379,61.621 72.747,61.621 72.747,49.505  "/></g></svg>
    <!-- Picture In Picture -->
    <svg id="pip" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 40 50" enable-background="new 0 0 40 40" xml:space="preserve"><g><path  d="M10.7,30.11H0.756c-0.553,0-1-0.447-1-1V1c0-0.553,0.447-1,1-1h28.111c0.553,0,1,0.447,1,1v10.14   c0,0.553-0.447,1-1,1s-1-0.447-1-1V2H1.756v26.11H10.7c0.553,0,1,0.447,1,1S11.253,30.11,10.7,30.11z"/><path  d="M38.812,40.25H10.7c-0.553,0-1-0.447-1-1V29.11c0-0.553,0.447-1,1-1h17.167V11.14c0-0.553,0.447-1,1-1   h9.944c0.553,0,1,0.447,1,1v28.11C39.812,39.803,39.364,40.25,38.812,40.25z M11.7,38.25h26.111V12.14h-7.944V29.11   c0,0.553-0.447,1-1,1H11.7V38.25z"/></g></svg>
</div>