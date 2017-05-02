

<!-- .slide: class="transition text-white"  -->

<h1>
    Polymer 2
    <br><img src="./assets/images/polymer.svg" class="h-200">
    <br> What's new ?
</h1>


##==##


<!-- .slide: data-background="./assets/images/Once-upon-a-time.jpg"  -->

##==##

<!-- .slide: data-background="#575757" class="transition"  -->

![center w-400](./assets/images/remote.png)

Notes:
2013 !
Projet fédérateur

##==##

<!-- .slide: data-background="#e53935"   -->

# La stack

<p class="fragment">Angular 1.x</p>
<p class="fragment">Des directives, beaucoups de directives...</p>
<svg class="h-150 color-white fragment">
    <use xlink:href="#sad" />
</svg>

Notes:
Je veux bien séparer mes concepts => Directives !
2013 = Angular


##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

### Jean-François Garreau

<!-- .element: class="descjf" -->
Senior innovation developper & Community Manager

![avatar w-300 wp-200](assets/images/jf.jpg)


![company_logo](assets/images/lucca_logo.png)
![gdg_logo](assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](https://twitter.com/jefBinomed)

<!-- .element: class="gplus" -->
[+JeanFrancoisGarreau](http://plus.google.com/+JeanFrancoisGarreau)



##==##


<!-- .slide: data-background="./assets/images/back_to_the_future.jpg" class="no-filter"  -->


##==##

<!-- .slide: class="transition text-white"  data-background="#1E88E5"-->

# Polymer 1.0

![center w-400](./assets/images/POLYMER_1.0.png)

Notes:



##==##

<!-- .slide: class="transition text-white" data-background="#1E88E5"  -->

# Polymer 1.0

<p class="fragment">Ecriture de composants</p>
<p class="fragment">Polyfills</p>
<p class="fragment">Bibliothèques de composants</p>

##==##

<!-- .slide: data-background="./assets/images/material_design.jpg" class="no-filter"  -->

##==##

<!-- .slide: class="transition text-white" data-background="#1E88E5"  -->

# "Il y a un élément pour ça !"

##==##

<!-- .slide: class="transition text-white" data-background="#1E88E5"  -->

<div class="flex-col">
    <div class="flex-hori spacing">
        <img src="./assets/images/iron_elements.png" >
        <img src="./assets/images/paper_elements.png" class="fragment">
        <img src="./assets/images/google_elements.png" class="fragment">
    </div>
    <div class="flex-hori spacing">
        <img src="./assets/images/platinium_elements.png" class="fragment">
        <img src="./assets/images/gold_elements.png" class="fragment">
    </div>
</div>


##==##

<!-- .slide: data-background="./assets/images/paper_demo.png" class="no-filter"  -->

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="stop-code-test"  -->

## App Drawer

```html
<app-drawer-layout>
  <app-drawer>
    drawer content
  </app-drawer>
  <div>
    main content
  </div>
</app-drawer-layout>
```

<img src="./assets/images/app_drawer.gif" class="absolute_img_code">

##==##

<!-- .slide: class="with-code" data-state="code-test" -->

## Polymer 1 déclaration

```javascript
MyElement = Polymer({
    is: 'my-element',
    // See below for lifecycle callbacks
    created: function() {
    this.textContent = 'My element!';
    }
});
// create an instance with createElement:
var el1 = document.createElement('my-element');
// ... or with the constructor:
var el2 = new MyElement();
```


<code-highlighter
    id="highlight-test"
    line-height="1.5em"></code-highlighter>

<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>

##==##

<!-- .slide: class="with-code"  data-state="stop-code-test"   -->

## Polymer 1 Life cycle

```javascript
MyElement = Polymer({
    is: 'my-element',
    created: function() {}, // Element created
    ready: function() {}, // Element has local DOM initialized
    attached: function() {}, // Element was attached
    detached: function() {}, // Element was detached
    attributeChanged: function(name, type) {}, // Watch attribute changes
});
```



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Polymer 1 Complete

```html
<dom-module id="name-tag">
  <template>
    This is <b>{{owner}}</b>'s name-tag element.
  </template>
  < script>
  Polymer({
    is: "name-tag",
    ready: function() {
      this.owner = "Daniel";
    }
  });
  </ script>
</dom-module>
```

##==##

<!-- .slide: data-background="#1E88E5"   -->

# Mais ça, <br><br> c'était avant !

##==##

<!-- .slide: data-background="#575757" class="transition"  -->

![center w-400](./assets/images/remote.png)

Notes:
Revenons à nos moutons


##==##


<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-150 color-red">
        <use xlink:href="#worker" />
    </svg><br>Vient l'heure de la refonte !
</h1>

Notes:
Qu'est ce que je choisi ? Angular 2 ? React ?
Pourquoi faire ? les web components sont mon choix logique !



##==##


<!-- .slide: data-background="./assets/images/lego_blocks.jpg"  -->

# WebComponents <br><br>Où en est-on ?

<div class="copyrights white">fast company</div>

Notes:


##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-150 color-red">
        <use xlink:href="#webcomponents_logo" />
    </svg><br> Specs 1.0 Figées !
</h1>



Notes:


##==##


<!-- .slide: class="transition text-white"  -->


<div class="flex-col">
    <div class="flex-hori">
        <svg class="h-150 color-white">
            <use xlink:href="#template" />
        </svg>
        <span class="webspecs">Templates</span>
        <svg class="h-150 color-green fragment">
            <use xlink:href="#check" />
        </svg>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-white">
            <use xlink:href="#custom-elements" />
        </svg>
        <span class="webspecs">Custom Elements</span>
        <svg class="h-150 color-green">
            <use xlink:href="#check" />
        </svg>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-white">
            <use xlink:href="#shadow-dom" />
        </svg>
        <span class="webspecs">Shadow Dom</span>
        <svg class="h-150 color-green">
            <use xlink:href="#check" />
        </svg>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-white">
            <use xlink:href="#html-imports" />
        </svg>
        <span class="webspecs">Html Imports</span>
        <svg class="h-150 color-red">
            <use xlink:href="#uncheck" />
        </svg>
    </div>
</div>


Notes:
CONCEPTS !!!!
html imports atte la spec des imports de modules javascripts !

##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-150 color-green">
        <use xlink:href="#webcomponents_logo" />
    </svg><br> Conctrètement ?
</h1>


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Templates

```html
<template id="gdg-template">
    <style>
		:host {
			display: block;
		}
	</style>
	<div>
		<span>Hello GDG</span>
	</div>
</template>
```

Notes:

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Templates - Utilisation

```javascript
var template = document.querySelector('#gdg-template');
var clone = document.importNode(template.content, true);
var host = document.querySelector('#host');
host.appendChild(clone);

<div id="host"></div>
```

Notes:



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Custom Elements

```javascript
class GdGElement extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', awesomeListener );
        this.someProperty = 'Hello';
         // Create a shadow root and add element
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadow.appendChild(document.createElement('DIV');
        // No Inspect Element or attributes !!
    }
}
// Register custom element definition using standard platform API
customElements.define('gdg-element', GdGElement);
```

Notes:
Toujours appeler super !


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Custom Elements - LifeCycle

```javascript
class GdGElement extends HTMLElement {

    connectedCallback() {
        super.connectedCallback();
        // Called when the element is inserted into a document,
        // including into a shadow tree
    }

     disconnectedCallback() {
        // Called when the element is removed from a document
     }
}

```

Notes:
reste aussi : adoptedCallback(oldDocument, newDocument)
Called when the element is adopted into a new document



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Custom Elements - Attributes !

```javascript
class GdGElement extends HTMLElement {

    // Monitor the 'name' attribute for changes.
    static get observedAttributes() {return ['gdg']; }

    // Respond to attribute changes. Add / Removed / Update
    attributeChangedCallback(attr, oldValue, newValue) {
      if (attr == 'gdg') {
        this.textContent = `Hello, ${newValue}`;
      }
    }
}

```

Notes:
On doit préciser !! sinon c'est le navigateur ne propage pas !


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Custom Elements - Binding Attributes !

```javascript
class GdGElement extends HTMLElement {
    static get observedAttributes() {return ['gdg']; }
    attributeChangedCallback(attr, oldValue, newValue) {
        this[attr] = newValue;
    }
    set gdg(val){
        if (this._val === val) return;
        this._val = val;
        this.setAttribute('gdg', val);
    }
    get gdg(){ return this._gdg; }
}
```

Notes:
On doit préciser !! sinon c'est le navigateur ne propage pas !



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Custom Elements - Dispatch !

```javascript
class GdGElement extends HTMLElement {

   constructor(){
       super();
       this.addEventListener('click', onClick);
   }

   onClick(event){
       this.dispatchEvent(new CustomEvent('gdg-star', {
           detail: {gdg: this.gdg}, bubbles: false
       }));
   }
}
```

Notes:
c'est pareil en polymer 2


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Custom Elements - Utilisation

<!-- .element: class="big-code" -->
```html
<gdg-element
    on-gdg-star="callbackStar"
    gdg="Nantes" >
</gdg-element>
```

Notes:


##==##


<!-- .slide: class="transition" data-copyrights="true"  -->

# Attributes <br><br> VS Properties !

Notes:
Attention properties => objets mais marche pas top
attr => seulement des strings values!


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Shadow Dom

```javascript
 // Create shadow DOM
  var shadow = document.querySelector('#hostElement')
    .attachShadow({mode: 'open'});
  // Add some text to shadow DOM
  shadow.innerHTML = '<span>Here is some GDG Shadow text</span>';
  // Add some CSS to make the text red
  shadow.innerHTML += '<style>span { color: red; }</style>';
```

Notes:

##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-150 color-green">
        <use xlink:href="#webcomponents_logo" />
    </svg><br> Exemple
</h1>


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Vanilla Component

```javascript
class VanillaElement extends HTMLElement {

   connectedCallback(){
       const template = document.querySelector('#vanilla-template');
       const content = template.content.cloneNode(true);
       this.appendChild(content);
   }
}
```

Notes:



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Vanilla Component bis

```javascript
class VanillaElement extends HTMLElement {

   connectedCallback(){
       this.innerHTML = `<div>A Vanilla GDG Element
                        <span></span>
                        </div>`;
   }
   set name(value){
       const span = this.querySelector('span');
       span.textContent = value;
   }
}
```

Notes:
Comme on peut l'imaginer, ça veut dire beaucoup de bolerplate !


##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-150 color-red">
        <use xlink:href="#sad" />
    </svg><br> Pas si simple
</h1>


##==##


<div class="flex-col left-align">
    <div class="flex-hori">
        <svg class="h-150 color-white">
            <use xlink:href="#sad" />
        </svg>
        <span class="webspecs">Synchro complexe</span>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-white">
            <use xlink:href="#sad" />
        </svg>
        <span class="webspecs">Passage d'objets complexes</span>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-white">
            <use xlink:href="#sad" />
        </svg>
        <span class="webspecs">Beaucoup de boilerplate...</span>
    </div>
</div>



##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 color-red">
        <use xlink:href="#candy" />
    </svg><br> Polymer 2.0
</h1>

Notes:
C'est du sucre syntaxique sur les webcompenents

##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 color-green">
        <use xlink:href="#browser" />
    </svg><br> #usetheplatform
</h1>



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" -->

## Vanilla Component

```javascript
class GdgElement extends HTMLElement {

}
```

Notes:

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" -->

## Polymer Component

```javascript
class GdgElement extends Polymer.Element {

}
```

Notes:

Classes ES6 !!

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" -->

## Polymer Component - Mixin Powa !

```javascript
class GdgElement extends Polymer.TemplateStamp(HTMLElement) {

}
```

Notes:
Il s'agit en fait de mixins, on peut donc choisir !


##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 color-red">
        <use xlink:href="#cart" />
    </svg><br> Soyez sélectifs <br><br> <span class="fragment">ou pas ;)</span>
</h1>



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" -->

## Polymer Component - Heritage

```javascript
class GdgElement extends MyElement {

}
```

Notes:
De retour


##==##


<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 color-red">
        <use xlink:href="#configuration" />
    </svg><br>Configuration
</h1>


Notes:

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" -->


```javascript
class GdgElement extends Polymer.Element {
    static get is() { return 'gdg-element'; }

    constructor(){}
    connectedCallback(){}
}

customElements.define(GdgElement.is, GdgElement);
```

Notes:
Méthodes statiques car configuration par annoation non prévue



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" -->


```javascript
class GdgElement extends Polymer.Element {
    static get properties() {
        return {gdg: {type: String}};
    }
    static get observers() {
        return ['gdgChanged(gdg)'];
    }
}
```

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Rappelez vous : Binding

```javascript
class GdGElement extends HTMLElement {
    static get is() {return ['gdg-element']; }
    static get observedAttributes() {return ['gdg']; }
    connectedCallback(){ this.innerHTML = '...'}
    attributeChangedCallback(attr, oldValue, newValue) { this[attr] = newValue;}
    set gdg(val){
        if (this._val === val) return;
        this._val = val;
        this.setAttribute('gdg', val);
    }
    get gdg(){ return this._gdg; }
}
```

Notes:
Tout un ensemble de boillerplate pour une simple synchro !

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Devient

```javascript
class GdGElement extends Polymer.Element {
    static get is() {return ['gdg-element']; }
    connectedCallback(){ this.innerHTML = '...'}
    static get properties() {
        return {gdg: {type: String}};
    }
}
```

Notes:
En gros dessous, y a un peu de magie de faite pour poser les getters & setters

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" -->

## Templating

```html
<dom-module id="gdg-element">
    <template>
        <div>
            <span>Hello GDG</span>
        </div>
    </template>
    < script>
        class GdGElement extends Polymer.Element {
            static get is() {return ['gdg-element']; }
        }
    </ script>
</dom-module>
```

Notes:
Il détecte automatiquement le premier template et l'ajoute au shadow dom


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Data Binding

```html
<dom-module id="gdg-element">
    <template>
        <div>
            <span>[[gdg]]</span>
        </div>
    </template>
</dom-module>
```

Notes:
Fonctionne aussi pour les attributs !
Synchronise le dom / Fire les events
Met à jour les observers


##==##


<div class="flex-col left-align">
    <div class="flex-hori">
        <svg class="h-150 color-green">
            <use xlink:href="#happy" />
        </svg>
        <span class="webspecs">Synchro complexe</span>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-green">
            <use xlink:href="#happy" />
        </svg>
        <span class="webspecs">Passage d'objets complexes</span>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-green ">
            <use xlink:href="#happy" />
        </svg>
        <span class="webspecs">Beaucoup moins de boilerplate...</span>
    </div>
</div>

##==##

<!-- .slide: class="transition" -->


<h1>
    <img class="w-800" src="./assets/images/main-desktop-browser-logos.png">
    <br> 2 dernières versions
</h1>


Notes:
Le contrat est : Les 2 dernières versions de chaque majeur !
IE11+ / Safari 7+/ Chrome Android



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Polyfills

```html
<!-- Load import polyfills; -->
< script src="bower_components/webcomponentsjs/webcomponents-hi.js"></ script>
<!-- Load import - customs elements polyfills; -->
< script src="bower_components/webcomponentsjs/webcomponents-hi-ce.js"></ script>

<!-- Load all polyfills; -->
< script src="bower_components/webcomponentsjs/webcomponents-lite.js"></ script>
<!-- Load polyfills; note that "loader" will load these async -->
< script src="bower_components/webcomponentsjs/webcomponents-loader.js"></ script>
```

Notes:
Le premier charge tout
Le second sert à détecter ce qui manque et le charge


##==##

<!-- .slide: class="transition text-white"  -->

# Pourquoi RC ?

Notes:
Tous les componsants Polymer 1.0 n'ont pas encore étés migrés


##==##

<!-- .slide: class="transition text-white"  -->

# Comment migrer ?

![center w-400](./assets/images/POLYMER_1.0.png)

Notes:

##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 color-red no-stroke">
        <use xlink:href="#breaking-changes" />
    </svg><br>Breaking Changes
    <br><br> ou pas !
</h1>


Notes:


##==##

# Changements mineurs

<p>content -> slot</p>
<p>Behaviors -> Mixins</p>
<p>Cycle de vie</p>
<p>Pas de style & template séparés</p>
<p>Lancement d'événements</p>

Notes:
Les mixins restent utilisables !

##==##

<!-- .slide: class="transition" data-background="linear-gradient(135deg, #e57373 0%, #e57373 49%,#673AB7 50%, #673AB7 100%)" -->

# Hybrid Mode


<p class="fragment">Retro compatibilité 1.0</p>
<p class="fragment">Très peu de deprecated featues sur 1.0 ! </p>
<p class="fragment">Fonctionne direct avec les features de 2.0 ! </p>


Notes:
Grace au compatibility Shims !
Anciennes features emulées
Nouvelles idem


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

<h2 class="polymer_1-0">Polymer 1.0</h2>

```javascript
Polymer({
    is: 'gdg-element',
    attached: function(){
        console.log('I log things!');
    }
});
```

Notes:


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

<h2 class="polymer_2-0">Polymer 2.0</h2>

```javascript
class GdgElement extends Polymer.Element {
    static get is() { return 'gdg-element'; }
    connectedCallback() {
        console.log('I log things!');
    }
}
customElements.define(GdgElement.is(), GdgElement);
```

Notes:


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

<h2><span class="polymer_1-0">Hyb</span><span class="polymer_2-0">rid</span></h2>

```javascript
Polymer({
    is: 'gdg-element',
    attached: function(){
        console.log('I log things!');
    }
});
```

Notes:
Il existe un guide de migration complet !


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

<h2 class="polymer_1-0">Polymer 1.0</h2>

```html
<dom-module>
    <template>
        <content></content>
    </template>
</dom-module>
```

Notes:
Pour mettre dans le shadow dom depuis notre élément il fallait utiliser content !


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

<h2 class="polymer_2-0">Polymer 2.0</h2>

```html
<dom-module>
    <template>
        <slot></slot>
    </template>
</dom-module>
```

Notes:
La on est proche de la spé


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

<h2><span class="polymer_1-0">Hyb</span><span class="polymer_2-0">rid</span></h2>

```html
<dom-module>
    <template>
        <slot></slot>
    </template>
</dom-module>
```

Notes:
C'est plus optimiser ! donc à utiliser !

##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 color-green">
        <use xlink:href="#check-list" />
    </svg><br>Linter
</h1>


Notes:
Un linter existe


##==##

<!-- .slide: class="transition" -->


<h1>
    https://goo.gl/kEfzjj
    <br><br> Guide de migration
</h1>

Notes:
L'idée est donc de migrer composant par composant et de permettre de passer par le mode hybrid
Un updater est en prévision


##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350">
        <use xlink:href="#terminal" />
    </svg><br>Polymer Cli
</h1>


Notes:



##==##

<!-- .slide: class="transition text-white"  -->

# Polymer Cli

<p>Création</p>
<p>Lint</p>
<p>Tests</p>
<p>Build</p>

Notes:


##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 text-green">
        <use xlink:href="#code" />
    </svg><br>Let's code
</h1>


Notes:

##==##

<div class="flex-col timer">
    <gdg-timer></gdg-timer>
</div>

Notes:
J'ai mesuré mon temps


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Bower

```json
{
	"name": "Polymer2-Remote",
	"dependencies": {
		"polymer": "Polymer/polymer#2.0.0-rc.2",
		"app-layout": "PolymerElements/app-layout#2.0-preview"
	}
}
```

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Imports - Header

```html
< script
src="./bower_components/webcomponentsjs/webcomponents-lite.js" />

<link rel="import" href="./components/timer/timer.html">
```

##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Timer - Header

```html
<link rel="import" href="../../bower_components/polymer/polymer-element.html">
<link rel="import" href="../../bower_components/app-layout/app-toolbar/app-toolbar.html">
<link rel="import" href="../mixins/dispatcher-mixin.html">
<link rel="import" href="../mixins/timer-mixin.html">
<link rel="import" href="../mixins/mixin-builder.html">
<link rel="import" href="../remote-styles.html">
<dom-module id="gdg-timer">
	<template>
        <style>...</style>
        ...
    </template>
    < script></ script>
</dom-module>
```


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Timer - Template

```html
<template>
<app-toolbar>
    <div main-title id="ellapsedTime">
        <div class="elapsed" ng-show="showTime">
            <div class="timeEllapesd">
                <span  id="hours" class="classHours" hide$="[[!showHours]]">[[hours]] :
                </span>
                <span id="minutes" class="classMinutes">[[minutes]]</span>
                <span id="seconds"> : [[seconds]]</span>
                <span class="totalTime">&nbsp;/&nbsp;[[modelTimer.defaultInterval]]:00
                </span>
</div></div></div></app-toolbar>
</template>
```


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Timer - Script

```javascript
class GdgTimer extends mix(Polymer.Element).with(DispatcherMixin, TimerModelMixin) {
    static get is() { return 'gdg-timer' }
    static get properties() {
        return { toggle: { type: Boolean, observer: '_updateToggle'}};
    }
    constructor() {
        super();
        this.hours = '00';
        ...
    }
}
customElements.define(GdgTimer.is, GdgTimer);
```



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Timer - Script

```javascript
class GdgTimer extends mix(Polymer.Element).with(DispatcherMixin, TimerModelMixin) {
    connectedCallback() {
        super.connectedCallback();
        setInterval(_ => this._manageTimerState.bind(this)), 500);
    }
    _updateToggle(newToggle, oldToggle){
        super.toggleTimer();
    }
    _manageTimerState(diff) { ...}
}
```


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Timer - Utilisation

<!-- .element: class="big-code" -->
```html
<gdg-timer></gdg-timer>
```


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f"  -->

## Timer - Interaction

```javascript
document.querySelector('gdg-timer').toggle = true;
```


##==##

<!-- .slide: data-background="#575757" class="transition"  -->

![center w-400](./assets/images/remote_polymer_2.png)

Notes:
Passé peux de temps !
Code réutilisable et séparé !
Utilisation de patterns ! Uniflow



##==##

<!-- .slide: class="transition" -->

# Des Questions ?

<p>@jefBinomed</p>


<div class="credits">
    <h4 >Crédits : <a href="https://thenounproject.com/" target="_blank">The noun project</a></h4>
    <p >Icon Fair / Ralf Schmitzer / Nathan Thomson / Shmidt Sergey / Por Suppasit / Veronika Krpciarova / Logan / Gregor Cresnar / Gleb Khourunzhiy / Unlimiticon / Souvik Maity / Ananth</p>
</div>


<div style="display:none">
    <svg id="template" viewBox="0 0 47.333 40.667">
        <path d="M38.281 22.9v-4.875l-4.006-.855-.805-2.111 2.213-2.766-3.973-3.901-3.017 2.242-1.81-.705-.704-4.08h-4.978l-.805 4.382-1.76.704-3.67-2.212-3.166 3.066 2.162 3.469-.603 2.011-4.306 1.057v4.273l4.206.805.704 2.312-2.011 3.217 3.268 3.27 3.418-2.062 1.859.555 1.107 4.123h4.424l.955-4.072 1.86-.555 2.915 2.312 3.973-3.973-2.363-2.865.905-2.059 4.008-.707zm-8.643-.094l-3.498 3.498h-4.947l-3.498-3.498v-4.947l3.498-3.498h4.947l3.498 3.498v4.947z"/>
    </svg>
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
    <!-- Check -->
    <svg id="check" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve">
        <path d="M89.246,12.162c-1.534-1.535-4.05-1.535-5.585,0L34.124,61.702c-1.535,1.535-4.05,1.535-5.585,0l-12.201-12.2  c-1.535-1.535-4.05-1.535-5.585,0l-7.483,7.487c-1.535,1.535-1.535,4.05,0,5.585l25.269,25.264c1.535,1.535,4.05,1.535,5.585,0  L96.729,25.23c1.536-1.536,1.536-4.05,0-5.586L89.246,12.162z"/>
    </svg>
    <!-- Uncheck -->
    <svg id="uncheck" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  xml:space="preserve" x="0px" y="0px" viewBox="0 0 100 125">
        <path stroke="none" d=" M 92.15 7.85 Q 88.5666015625 4.272265625 83.5 4.25 78.433203125 4.2720703125 74.85 7.85 L 50 32.7 25.15 7.85 Q 21.5666015625 4.2720703125 16.5 4.25 11.4333984375 4.272265625 7.85 7.85 4.272265625 11.4333984375 4.25 16.5 4.2720703125 21.5666015625 7.85 25.15 L 32.7 50 7.85 74.85 Q 4.2720703125 78.433203125 4.25 83.5 4.272265625 88.5666015625 7.85 92.15 11.4333984375 95.727734375 16.5 95.7 21.5666015625 95.727734375 25.15 92.15 L 50 67.3 74.85 92.15 Q 78.433203125 95.727734375 83.5 95.7 88.5666015625 95.727734375 92.15 92.15 95.727734375 88.5666015625 95.7 83.5 95.727734375 78.433203125 92.15 74.85 L 67.3 50 92.15 25.15 Q 95.727734375 21.5666015625 95.7 16.5 95.727734375 11.4333984375 92.15 7.85 Z"/>
    </svg>
    <!-- sad -->
    <svg id="sad" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><g><path  d="M91.289,50.5c-0.358,23.023-18.727,41.391-41.75,41.75c-23.025,0.358-41.4-19.266-41.75-41.75    c-0.358-23.025,19.266-41.4,41.75-41.75C72.564,8.392,90.939,28.017,91.289,50.5c0.045,2.899,4.545,2.904,4.5,0    c-0.337-21.607-15.05-40.143-36.125-45.136c-21.066-4.99-42.896,6.426-52.079,25.668c-9.117,19.104-3.17,43.151,13.589,55.975    c17.393,13.31,41.312,12.553,58.193-1.172C89.911,77.265,95.58,63.911,95.789,50.5C95.834,47.597,91.334,47.602,91.289,50.5z"/></g></g><g><g><path  d="M58.166,38.25c6.777,0,13.556,0,20.334,0c2.901,0,2.901-4.5,0-4.5c-6.778,0-13.557,0-20.334,0    C55.264,33.75,55.264,38.25,58.166,38.25L58.166,38.25z"/></g></g><line   stroke-width="9" x1="68.333" y1="54.333" x2="68.333" y2="37.333"/><g><g><path  d="M20.833,38.917c6.778,0,13.556,0,20.334,0c2.902,0,2.902-4.5,0-4.5c-6.778,0-13.556,0-20.334,0    C17.931,34.417,17.931,38.917,20.833,38.917L20.833,38.917z"/></g></g><line   stroke-width="9" x1="31" y1="55" x2="31" y2="38"/><g><g><path  d="M40.609,74.285c0.938-1.26,3.178-3.253,4.915-4.361c5.903-3.765,11.133-0.014,14.885,4.816    c1.778,2.29,4.938-0.92,3.182-3.182c-4.341-5.589-10.238-9.353-17.394-6.929c-3.78,1.28-7.116,4.219-9.474,7.384    C34.988,74.344,38.897,76.584,40.609,74.285L40.609,74.285z"/></g></g></svg>
    <!-- happy -->
    <svg id="happy" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 30" style="enable-background:new 0 0 24 24;" xml:space="preserve"><g><g><path d="M12,0C5.383,0,0,5.383,0,12c0,6.617,5.383,12,12,12c6.617,0,12-5.383,12-12C24,5.383,18.617,0,12,0z M12,22    C6.486,22,2,17.514,2,12C2,6.486,6.486,2,12,2c5.514,0,10,4.486,10,10C22,17.514,17.514,22,12,22z"/><path d="M18.142,7.01c-0.543-0.078-1.053,0.301-1.133,0.847C16.937,8.36,16.503,8.739,16,8.739c-0.504,0-0.938-0.379-1.01-0.882    c-0.079-0.546-0.585-0.93-1.133-0.847c-0.547,0.079-0.926,0.586-0.848,1.132c0.214,1.48,1.499,2.597,2.99,2.597    c1.49,0,2.775-1.116,2.989-2.597C19.067,7.596,18.688,7.089,18.142,7.01z"/><path d="M10.989,8.143c0.079-0.546-0.3-1.054-0.847-1.132c-0.541-0.076-1.053,0.3-1.132,0.847C8.936,8.368,8.511,8.739,8,8.739    c-0.503,0-0.937-0.379-1.01-0.882C6.911,7.311,6.404,6.936,5.857,7.01C5.311,7.089,4.932,7.596,5.01,8.143    C5.224,9.623,6.509,10.739,8,10.739S10.775,9.623,10.989,8.143z"/><path d="M14.552,14H9.449c-0.46,0-0.897,0.229-1.17,0.615c-0.285,0.403-0.356,0.923-0.191,1.39C8.761,17.908,10.196,19,12.024,19    c1.861,0,3.283-1.107,3.903-3.039c0.148-0.463,0.066-0.973-0.219-1.364C15.436,14.223,15.003,14,14.552,14z"/></g></g></svg>
    <!-- candy -->
    <svg id="candy" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 64 80" enable-background="new 0 0 64 64" xml:space="preserve"><g><g><path d="M57.456,15.029L48.97,6.544c-0.47-0.47-1.14-0.677-1.792-0.55c-0.652,0.125-1.199,0.566-1.46,1.176l-3.079,7.184    l-2.153-2.153c-1.133-1.134-2.641-1.758-4.243-1.758s-3.11,0.624-4.243,1.758L12.2,32c-2.338,2.34-2.338,6.146,0,8.485    l2.153,2.153l-7.184,3.08c-0.61,0.261-1.05,0.808-1.176,1.46c-0.125,0.651,0.081,1.323,0.55,1.792l8.485,8.485    c0.378,0.379,0.889,0.586,1.414,0.586c0.125,0,0.252-0.012,0.378-0.036c0.651-0.125,1.198-0.566,1.46-1.176l3.079-7.185    l2.153,2.153c1.133,1.133,2.64,1.757,4.243,1.757s3.109-0.624,4.242-1.757L51.798,32c1.134-1.133,1.758-2.64,1.758-4.243    s-0.624-3.11-1.758-4.242l-2.153-2.153l7.186-3.08c0.609-0.262,1.051-0.809,1.176-1.46C58.132,16.17,57.926,15.499,57.456,15.029z     M38.241,36.242c0,1.104-0.896,2-2,2h-8c-3.308,0-6-2.691-6-5.999c0-2.702,1.795-4.993,4.255-5.742    c0.282-0.935,0.792-1.792,1.502-2.501c1.134-1.133,2.641-1.757,4.244-1.757c3.308,0,5.998,2.691,5.998,6V36.242z"/><path d="M32.243,26.242c-0.535,0-1.038,0.208-1.416,0.586c-0.377,0.377-0.585,0.879-0.585,1.414c0,0.531-0.21,1.04-0.585,1.415    c-0.375,0.375-0.884,0.586-1.415,0.586c-1.103,0-2,0.897-2,2.001c0,1.103,0.897,1.999,2,1.999h6v-6    C34.241,27.139,33.345,26.242,32.243,26.242z"/></g></g></svg>
    <!-- browser -->
    <svg id="browser" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 640" enable-background="new 0 0 512 512" xml:space="preserve"><g><path d="M2,2v65.5v16.4v262.2h82.4C88.7,437.2,163.9,510,256,510s167.3-72.8,171.6-163.9H510V83.9V67.5V2H2z M256,493.6   c-21.7,0-44.6-29.5-56.7-78.2c17.7,2.9,36.7,4.5,56.7,4.5s39-1.6,56.7-4.5C300.6,464.1,277.7,493.6,256,493.6z M256,403.5   c-22,0-42.2-1.9-60.3-5.2c-3.3-18.1-5.2-38.3-5.2-60.3s1.9-42.2,5.2-60.3c18.1-3.3,38.3-5.2,60.3-5.2s42.2,1.9,60.3,5.2   c3.3,18.1,5.2,38.3,5.2,60.3s-1.9,42.2-5.2,60.3C298.2,401.5,278,403.5,256,403.5z M178.5,394.6c-48.7-12.1-78.2-34.9-78.2-56.7   c0-21.7,29.5-44.6,78.2-56.7c-2.9,17.7-4.5,36.7-4.5,56.7C174.1,357.9,175.7,376.9,178.5,394.6z M333.5,281.2   c48.7,12.1,78.2,34.9,78.2,56.7c0,21.7-29.5,44.6-78.2,56.7c2.9-17.7,4.5-36.7,4.5-56.7C337.9,318,336.3,298.9,333.5,281.2z    M330.1,263.8c-7.2-32.3-18.9-58.8-33.6-76c53.3,14.4,95.2,56.3,109.6,109.6C388.9,282.7,362.4,271,330.1,263.8z M312.7,260.5   C295,257.6,276,256,256,256s-39,1.6-56.7,4.5c12.1-48.7,34.9-78.2,56.7-78.2S300.6,211.8,312.7,260.5z M181.9,263.8   c-32.3,7.2-58.8,18.9-76,33.6c14.4-53.3,56.3-95.2,109.6-109.6C200.8,205,189.1,231.5,181.9,263.8z M105.9,378.4   c17.2,14.7,43.8,26.4,76,33.6c7.2,32.3,18.9,58.8,33.6,76C162.2,473.7,120.3,431.7,105.9,378.4z M296.5,488.1   c14.7-17.2,26.4-43.8,33.6-76c32.3-7.2,58.8-18.9,76-33.6C391.7,431.7,349.8,473.7,296.5,488.1z M493.6,329.7h-66   c-4.3-91.1-79.5-163.9-171.6-163.9S88.7,238.7,84.4,329.7h-66V83.9h475.2V329.7z M18.4,67.5V18.4h475.2v49.2H18.4z"/><rect x="34.8" y="34.8" width="16.4" height="16.4"/><rect x="67.5" y="34.8" width="16.4" height="16.4"/><rect x="100.3" y="34.8" width="16.4" height="16.4"/><rect x="288.8" y="34.8" width="188.5" height="16.4"/></g></svg>
    <!-- cart -->
    <svg id="cart" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 792.75391 943.1003625" enable-background="new 0 0 2000 2000" xml:space="preserve"><path style="" d="m 724.95572,0.00927786 c -3.071,0.07 -6.178,0.61 -9.231,1.64700004 -161.871,54.7980001 -272.728,201.4960021 -281.209,369.0440021 l -39.426,-39.408 c -12.222,-12.222 -31.975,-12.222 -44.197,0 -12.222,12.221 -12.222,31.977 0,44.198 l 94.803,94.771 c 5.844,5.876 13.845,9.157 22.098,9.157 8.283,0 16.222,-3.281 22.097,-9.157 l 94.74,-94.771 c 12.222,-12.221 12.222,-31.977 0,-44.198 -12.221,-12.222 -31.976,-12.222 -44.197,0 l -43.502,43.523 c 6.821,-142.431 101.057,-267.281 238.826,-313.927002 16.348,-5.533 25.165,-23.318 19.6,-39.634 -4.47,-13.2830001 -17.091,-21.57100014 -30.402,-21.24500014 z M 32.633678,98.115278 c -18.129,-0.343 -31.88199991,12.628002 -32.60099991,29.851002 -0.782,17.254 12.56599991,31.85 29.85099991,32.6 l 97.053002,4.252 23.315,85.129 c 0.172,1.817 0.505,3.633 1.003,5.423 l 67.979,246.44001 11.975,43.718 c 2.389,8.607 8.165,15.381 15.485,19.283 0.738,0.394 1.49,0.76 2.258,1.094 0.749,0.326 1.512,0.622 2.286,0.889 0.02,0.01 0.04,0.02 0.07,0.02 0,0 0,0 0,0 0.742,0.253 1.495,0.475 2.255,0.672 0.06,0.02 0.119,0.04 0.181,0.05 0.604,0.154 1.22,0.269 1.835,0.386 0.23,0.04 0.455,0.106 0.687,0.145 0.743,0.124 1.494,0.212 2.246,0.282 0.09,0.01 0.188,0.03 0.282,0.03 0,0 0,0 0,0 0.854,0.07 1.711,0.109 2.577,0.109 0,0 0.02,0 0.03,0 l 420.06404,0 c 14.097,0 26.413,-9.409 30.133,-22.943 l 80.048,-290.18901 c 2.563,-9.409 0.626,-19.474 -5.249,-27.226 -5.941,-7.783 -15.132,-12.348 -24.914,-12.348 l -163.598,0 c -17.285,0 -31.257,13.972 -31.257,31.257 0,17.285 13.972,31.257 31.257,31.257 l 122.587,0 -62.826,227.67801 -372.40304,0 -62.368,-227.67801 177.08804,0 c 17.285,0 31.257,-13.972 31.257,-31.257 0,-17.285 -13.972,-31.257 -31.257,-31.257 l -194.21204,0 -24.522,-89.518 c -3.595,-13.097 -15.192,-22.349 -28.757,-22.943 L 32.633678,98.101278 Z M 335.98272,582.56629 c -47.38504,0 -85.95804,38.54 -85.95804,85.957 0,47.416 38.573,85.957 85.95804,85.957 47.449,0 85.958,-38.541 85.958,-85.957 0,-47.417 -38.509,-85.957 -85.958,-85.957 z m 260.497,0 c -47.388,0 -85.958,38.54 -85.958,85.957 0,47.416 38.57,85.957 85.958,85.957 47.447,0 85.955,-38.541 85.955,-85.957 0,-47.417 -38.508,-85.957 -85.955,-85.957 z m -260.497,62.516 c 12.94,0 23.444,10.531 23.444,23.441 0,12.909 -10.504,23.443 -23.444,23.443 -12.87704,0 -23.44304,-10.534 -23.44304,-23.443 0,-12.91 10.566,-23.441 23.44304,-23.441 z m 260.497,0 c 12.939,0 23.44,10.531 23.44,23.441 0,12.909 -10.501,23.443 -23.44,23.443 -12.879,0 -23.443,-10.534 -23.443,-23.443 0,-12.91 10.564,-23.441 23.443,-23.441 z" /></svg>
    <!-- configuration -->
    <svg id="configuration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" x="0px" y="0px">
        <path d="M2.24,32.43V28.82A3.27,3.27,0,0,1,4.95,25.6l4.25-.75a22.08,22.08,0,0,1,2.2-5.3L8.91,16a3.27,3.27,0,0,1,.37-4.19l2.55-2.55A3.27,3.27,0,0,1,16,8.91l3.54,2.48a22,22,0,0,1,5.3-2.2l.75-4.25a3.27,3.27,0,0,1,3.22-2.71h3.61a3.27,3.27,0,0,1,3.22,2.71L36.4,9.2a22,22,0,0,1,5.3,2.2l3.54-2.48a3.27,3.27,0,0,1,4.19.37L52,11.83A3.27,3.27,0,0,1,52.34,16l-2.48,3.54a22.08,22.08,0,0,1,1.77,4,10,10,0,0,0-2.05,4.51l-.34,2-1.06.44-1.63-1.14a10,10,0,0,0-5.75-1.82c-.32,0-.63.06-.95.09A9.71,9.71,0,1,0,27.6,39.84a10,10,0,0,0,1.77,6.71l1.14,1.63c-.15.35-.3.7-.44,1.05l-2,.34a10,10,0,0,0-4.51,2.05,22.11,22.11,0,0,1-4-1.77L16,52.34A3.27,3.27,0,0,1,11.83,52L9.28,49.43a3.27,3.27,0,0,1-.37-4.19L11.4,41.7a22,22,0,0,1-2.2-5.3l-4.25-.75A3.27,3.27,0,0,1,2.24,32.43Zm45.43,4.88a27.94,27.94,0,0,1,6.72-2.79l.95-5.4a4.15,4.15,0,0,1,4.09-3.43H64a4.15,4.15,0,0,1,4.09,3.43l.95,5.4a28,28,0,0,1,6.73,2.79l4.49-3.15a4.15,4.15,0,0,1,5.32.46l3.24,3.24a4.15,4.15,0,0,1,.46,5.32l-3.15,4.49a28,28,0,0,1,2.79,6.73l5.4.95a4.15,4.15,0,0,1,3.43,4.09V64a4.15,4.15,0,0,1-3.43,4.09l-5.4.95a28,28,0,0,1-2.79,6.72l3.15,4.49a4.15,4.15,0,0,1-.46,5.32l-3.24,3.24a4.15,4.15,0,0,1-5.32.46l-4.49-3.15a28,28,0,0,1-6.73,2.79l-.95,5.4A4.15,4.15,0,0,1,64,97.76H59.44a4.15,4.15,0,0,1-4.09-3.43l-.95-5.4a28,28,0,0,1-6.72-2.79l-4.49,3.15a4.15,4.15,0,0,1-5.32-.46l-3.24-3.24a4.15,4.15,0,0,1-.46-5.32l3.15-4.49a28,28,0,0,1-2.79-6.72l-5.4-.95A4.15,4.15,0,0,1,25.69,64V59.43a4.15,4.15,0,0,1,3.43-4.09l5.4-.95a28,28,0,0,1,2.79-6.72l-3.15-4.49a4.15,4.15,0,0,1,.46-5.32l3.24-3.24a4.15,4.15,0,0,1,5.32-.46ZM52,64.8l2.11,2.12,2.28,2.29a3.22,3.22,0,0,0,4.56,0l2.29-2.27,8.19-8.15a3.23,3.23,0,0,0,0-4.56h0a3.22,3.22,0,0,0-4.56,0l-8.19,8.15-2.11-2.12a3.23,3.23,0,0,0-4.56,0h0A3.23,3.23,0,0,0,52,64.8Z"/>
    </svg>
    <!-- Worker -->
    <svg id="worker" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M37.215,51.323c1.156,0.746,2.312,1.493,3.469,2.239c1.119-1.94,2.237-3.879,3.356-5.819  c-1.474-0.579-2.947-1.158-4.421-1.737c-0.149-0.059-0.173-0.12-0.234,0.028c-0.117,0.285-0.234,0.57-0.351,0.855  c-0.39,0.951-0.78,1.903-1.171,2.854C37.647,50.27,37.431,50.796,37.215,51.323z"/><path d="M48.217,58.425c1.599,1.032,3.198,2.064,4.796,3.096c-0.677-2.631-1.353-5.262-2.03-7.893  C50.061,55.227,49.139,56.826,48.217,58.425z"/><path d="M93.985,76.234c-0.478-0.829-0.956-1.657-1.434-2.486c-1.268-2.2-2.537-4.399-3.805-6.599  c-1.811-3.141-3.622-6.281-5.433-9.422c-2.106-3.652-4.212-7.304-6.318-10.956c-2.153-3.734-4.306-7.467-6.459-11.201  c-1.952-3.386-3.905-6.771-5.857-10.157c-1.504-2.608-3.008-5.216-4.511-7.823c-0.807-1.4-1.615-2.8-2.422-4.201  c-0.484-0.839-0.996-1.659-1.612-2.411c-1.682-2.05-4.136-3.63-6.884-3.296c-3.354,0.409-5.542,3.206-7.118,5.939  c-0.892,1.547-1.784,3.094-2.677,4.642c-1.563,2.71-3.125,5.419-4.688,8.129c-1.985,3.442-3.97,6.885-5.955,10.327  c-2.16,3.745-4.319,7.491-6.479,11.236c-2.087,3.619-4.173,7.237-6.26,10.856c-1.766,3.062-3.531,6.124-5.297,9.186  c-1.197,2.076-2.394,4.152-3.591,6.227c-0.71,1.231-1.488,2.46-2.038,3.773c-0.947,2.261-1.313,4.927-0.169,7.189  c1.114,2.203,3.397,3.003,5.743,3.467c1.616,0.319,3.268-0.164,4.906-0.164c2.329,0,4.658,0,6.987,0c3.493,0,6.986,0,10.479,0  c4.16,0,8.319,0,12.479,0c4.329,0,8.657,0,12.986,0c4,0,8.001,0,12.001,0c3.175,0,6.349,0,9.524,0c1.852,0,3.703,0,5.555,0  c2.81,0,5.778,0.114,7.957-1.855c1.31-1.184,2.049-2.624,2.144-4.38C95.858,80.058,95.068,78.11,93.985,76.234z M48.619,38.129  c0.182-3.081,3.2-5.308,6.199-4.579c2.986,0.726,4.641,4.087,3.401,6.898c-0.97,2.2-3.447,3.418-5.782,2.85  C50.111,42.733,48.478,40.516,48.619,38.129C48.782,35.363,48.456,40.895,48.619,38.129z M73.178,76.84  c-1.112,0.54-2.415,0.769-3.637,0.846c-3.12,0.197-6.163-0.85-8.711-2.615c0.847-1.222,1.693-2.444,2.54-3.665  c-1.357-0.876-2.715-1.752-4.072-2.629c-0.3-0.194-0.601-0.388-0.901-0.582c-0.067-0.043-0.133-0.086-0.2-0.129  c-0.006-0.004-0.019-0.016-0.027-0.017c-0.235,0.131-0.488,0.229-0.751,0.285c-1.472,0.313-2.822-0.65-3.186-2.065  c-0.057-0.222-0.114-0.445-0.171-0.667c-0.015-0.057-0.023-0.22-0.077-0.255c-0.147-0.095-0.294-0.189-0.44-0.284  c-0.72-0.465-1.44-0.93-2.16-1.394c-1.464-0.945-2.928-1.89-4.392-2.835c-0.04-0.026-0.08-0.052-0.12-0.077  c-0.377,0.654-0.755,1.309-1.132,1.963c-0.03,0.053,0.154,0.246,0.185,0.29c0.201,0.279,0.402,0.557,0.603,0.836  c1.104,1.53,2.208,3.059,3.312,4.589c0.493,0.683,0.849,1.399,0.731,2.277c-0.079,0.586-0.383,1.082-0.655,1.593  c-0.916,1.723-1.831,3.445-2.747,5.168c-0.353,0.665-0.707,1.329-1.06,1.994c-0.446,0.84-1.084,1.504-2.067,1.676  c-1.613,0.281-3.131-0.994-3.146-2.625c-0.007-0.749,0.35-1.35,0.687-1.983c0.905-1.703,1.811-3.407,2.716-5.11  c0.13-0.244,0.259-0.488,0.389-0.732c0.058-0.108,0.078-0.105,0.008-0.201c-0.431-0.597-0.862-1.194-1.292-1.791  c-0.605-0.838-1.21-1.677-1.816-2.515c-0.203-0.281-0.406-0.562-0.609-0.843c-0.047-0.064-0.093-0.129-0.14-0.193  c-0.044-0.061-0.509-0.164-0.511-0.16c-0.475,0.824-0.95,1.648-1.426,2.472c-1.983,3.438-3.965,6.876-5.948,10.314  c-0.301,0.521-0.601,1.042-0.902,1.563c-0.233,0.404-0.449,0.804-0.806,1.121c-1.28,1.132-3.357,0.756-4.155-0.757  c-0.454-0.86-0.383-1.851,0.095-2.681c1.491-2.586,2.982-5.171,4.473-7.757c1.82-3.156,3.641-6.313,5.461-9.469  c0.47-0.816,0.914-1.643,1.385-2.459c0.237-0.411,0.474-0.821,0.71-1.232c0.121-0.21,0.153-0.187-0.045-0.315  c-0.778-0.502-1.557-1.005-2.335-1.507c-0.341-0.22-0.682-0.44-1.023-0.661c-0.062-0.04-0.124-0.08-0.187-0.12  c-0.028-0.018-0.377,0.155-0.43,0.172c-0.258,0.081-0.529,0.123-0.799,0.123c-1.624,0-2.903-1.496-2.654-3.097  c0.081-0.519,0.341-1.025,0.539-1.508c0.349-0.851,0.698-1.702,1.047-2.554c0.675-1.646,1.35-3.292,2.025-4.938  c0.356-0.869,0.947-1.569,1.889-1.824c0.68-0.185,1.321-0.052,1.955,0.197c3.323,1.306,6.646,2.612,9.969,3.918  c1.311,0.515,2.622,1.03,3.932,1.545c0.725,0.285,1.342,0.735,1.677,1.466c0.145,0.316,0.217,0.662,0.303,0.998  c0.898,3.49,1.795,6.981,2.693,10.471c0.441,1.714,0.881,3.427,1.322,5.141c0.109,0.425,0.218,0.849,0.328,1.274  c0.033,0.129,0.068,0.258,0.089,0.39c0.022,0.136-0.044,0.418,0.079,0.497c0.084,0.054,0.167,0.108,0.251,0.162  c1.255,0.81,2.511,1.621,3.766,2.431c0.415,0.268,0.831,0.536,1.246,0.805c0.105,0.068,0.136-0.1,0.193-0.182  c0.241-0.348,0.483-0.697,0.724-1.045c0.471-0.679,0.942-1.359,1.412-2.038c2.446,1.695,4.478,4.027,5.439,6.874  c0.426,1.261,0.693,2.669,0.56,4.007C73.182,76.801,73.18,76.82,73.178,76.84z"/></svg>
    <!-- check list-->
    <svg id="check-list" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 46 67.5" style="enable-background:new 0 0 46 54;" xml:space="preserve"><g><path style="" d="M3,14h8c1.654,0,3-1.346,3-3V3c0-1.654-1.346-3-3-3H3C1.346,0,0,1.346,0,3v8C0,12.654,1.346,14,3,14   z M2,3c0-0.551,0.449-1,1-1h8c0.551,0,1,0.449,1,1v8c0,0.551-0.449,1-1,1H3c-0.551,0-1-0.449-1-1V3z" /><path style="" d="M13,26c-0.552,0-1,0.448-1,1v4c0,0.551-0.449,1-1,1H3c-0.551,0-1-0.449-1-1v-8c0-0.551,0.449-1,1-1   h5.5c0.552,0,1-0.448,1-1s-0.448-1-1-1H3c-1.654,0-3,1.346-3,3v8c0,1.654,1.346,3,3,3h8c1.654,0,3-1.346,3-3v-4   C14,26.448,13.552,26,13,26z" /><path style="" d="M11,40H3c-1.654,0-3,1.346-3,3v8c0,1.654,1.346,3,3,3h8c1.654,0,3-1.346,3-3v-8   C14,41.346,12.654,40,11,40z M12,51c0,0.551-0.449,1-1,1H3c-0.551,0-1-0.449-1-1v-8c0-0.551,0.449-1,1-1h8c0.551,0,1,0.449,1,1V51z   " /><path style="" d="M19.5,3H33c0.553,0,1-0.448,1-1s-0.447-1-1-1H19.5c-0.552,0-1,0.448-1,1S18.948,3,19.5,3z" /><path style="" d="M19.5,8H45c0.553,0,1-0.448,1-1s-0.447-1-1-1H19.5c-0.552,0-1,0.448-1,1S18.948,8,19.5,8z" /><path style="" d="M19.5,13H41c0.553,0,1-0.448,1-1s-0.447-1-1-1H19.5c-0.552,0-1,0.448-1,1S18.948,13,19.5,13z" /><path style="" d="M19.5,23H33c0.553,0,1-0.448,1-1s-0.447-1-1-1H19.5c-0.552,0-1,0.448-1,1S18.948,23,19.5,23z" /><path style="" d="M45,26H19.5c-0.552,0-1,0.448-1,1s0.448,1,1,1H45c0.553,0,1-0.448,1-1S45.553,26,45,26z" /><path style="" d="M19.5,33H41c0.553,0,1-0.448,1-1s-0.447-1-1-1H19.5c-0.552,0-1,0.448-1,1S18.948,33,19.5,33z" /><path style="" d="M19.5,43H33c0.553,0,1-0.448,1-1s-0.447-1-1-1H19.5c-0.552,0-1,0.448-1,1S18.948,43,19.5,43z" /><path style="" d="M45,46H19.5c-0.552,0-1,0.448-1,1s0.448,1,1,1H45c0.553,0,1-0.448,1-1S45.553,46,45,46z" /><path style="" d="M41,51H19.5c-0.552,0-1,0.448-1,1s0.448,1,1,1H41c0.553,0,1-0.448,1-1S41.553,51,41,51z" /><path style="" d="M16.293,17.293L6.5,27.086l-1.793-1.793c-0.391-0.391-1.023-0.391-1.414,0   c-0.391,0.391-0.391,1.023,0,1.414l2.5,2.5C5.988,29.402,6.244,29.5,6.5,29.5c0.256,0,0.512-0.098,0.707-0.293l10.5-10.5   c0.391-0.391,0.391-1.023,0-1.414C17.316,16.902,16.684,16.902,16.293,17.293z" /></g></svg>
    <!-- breaking changes -->
    <svg id="breaking-changes" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 30" style="enable-background:new 0 0 24 24;" xml:space="preserve"><g><g><path d="M17,1.07c-1.604,0-3.132,0.55-4.361,1.533l2.268,3.162c0.142,0.198,0.121,0.469-0.05,0.642l-3.764,3.828l1.867,4.34    c0.062,0.145,0.053,0.31-0.026,0.447l-1.824,3.179l1.769,2.057c0.094,0.109,0.137,0.254,0.116,0.397l-0.272,1.897    c1.507-1.519,7.255-7.332,9.246-9.552C23.299,11.518,24,9.813,24,8.07C24,4.21,20.86,1.07,17,1.07z M10.067,18.01l1.875-3.27    l-1.901-4.418c-0.08-0.187-0.04-0.403,0.103-0.548l3.705-3.768l-2.255-3.144c-0.025-0.034-0.035-0.073-0.05-0.111    C10.286,1.674,8.683,1.072,7,1.072c-3.86,0-7,3.14-7,7c0,1.743,0.703,3.447,2.032,4.93c2.287,2.55,9.541,9.849,9.614,9.922    c0.004,0.002,0.009,0.003,0.013,0.007l0.315-2.193l-1.852-2.152C9.984,18.424,9.961,18.195,10.067,18.01z M7,4.07    c-2.206,0-4,1.794-4,4c0,0.276-0.224,0.5-0.5,0.5S2,8.346,2,8.07c0-2.757,2.243-5,5-5c0.276,0,0.5,0.224,0.5,0.5    S7.276,4.07,7,4.07z"/></g></g></svg>
    <!-- terminal -->
    <svg id="terminal" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><path d="M90.125,19.5H9.875c-1.856,0-3.375,1.519-3.375,3.375v54.25c0,1.856,1.519,3.375,3.375,3.375h80.25   c1.856,0,3.375-1.519,3.375-3.375v-54.25C93.5,21.019,91.981,19.5,90.125,19.5z M28.78,33.517l-12.883,6.726v-2.859   c0-0.216,0.054-0.417,0.162-0.601c0.108-0.184,0.287-0.335,0.536-0.455l5.897-3.038c0.509-0.249,1.066-0.444,1.673-0.585   c-0.607-0.141-1.165-0.335-1.673-0.585l-5.897-3.021c-0.249-0.13-0.428-0.285-0.536-0.463s-0.162-0.376-0.162-0.593v-2.859   l12.883,6.709V33.517z"/></g></svg>
    <!-- code -->
    <svg id="code" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 66 82.5" style="enable-background:new 0 0 66 66;" xml:space="preserve"><g>
        <path d="M10.1,33l12.1-13.9c0.9-1,0.8-2.5-0.2-3.4c-1-0.9-2.5-0.8-3.4,0.2L5.1,31.4c-0.8,0.9-0.8,2.3,0,3.2l13.5,15.5   c0.5,0.5,1.1,0.8,1.8,0.8c0.6,0,1.2-0.2,1.6-0.6c0.5-0.4,0.8-1,0.8-1.7c0-0.6-0.2-1.3-0.6-1.8L10.1,33z"/>
        <path d="M47.4,15.9c-0.4-0.5-1-0.8-1.7-0.8c-0.6,0-1.3,0.2-1.8,0.6c-1,0.9-1.1,2.4-0.2,3.4L55.9,33L43.8,46.9   c-0.4,0.5-0.6,1.1-0.6,1.8c0,0.6,0.3,1.2,0.8,1.7c0.4,0.4,1,0.6,1.6,0.6c0.7,0,1.4-0.3,1.8-0.8l13.5-15.5c0.8-0.9,0.8-2.3,0-3.2   L47.4,15.9z"/>
        <path d="M37.3,11.3c-1.3-0.3-2.6,0.6-2.9,1.9l-7.7,38.6c-0.3,1.3,0.6,2.6,1.9,2.9c0.2,0,0.3,0,0.5,0c1.2,0,2.2-0.8,2.4-2l7.7-38.6   C39.5,12.8,38.7,11.6,37.3,11.3z"/>
    </g></svg>
</div>