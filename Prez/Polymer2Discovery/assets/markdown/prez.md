
<!-- .slide: class="first-slide" data-background="./assets/images/polymer.svg" -->

# **Polymer 2 - What's new ?**


### GDG  @ **Nantes**


##==##

Pourquoi ?

##==##

WebRemoteControl

##==##


<!-- .slide: data-background="./assets/images/lego_blocks.jpg" data-state="hidefooter" class="transition" data-copyrights="true"  -->

# Où en est-on ?

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
html imports atte la spec des imports de modules javascripts !

##==##

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#webcomponents_logo" />
    </svg><br> Conctrètement ?
</h1>


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-template" -->

## Templates

```html
<template>
		:host {
			display: block;
		}
	</style>
	<div>
		<span>Hello GDG</span>
	</div>
</template>
```

<div class="clip_path"></div>

Notes:



##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-element" -->

## Custom Elements

```javascript
class GdGElement extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('clic', awesomeListener );
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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-inspect" -->

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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-attributes" -->

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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-attributes" -->

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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-attributes" -->

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


<!-- .slide: class="transition" data-copyrights="true"  -->

# Attr. VS Propertries !

Notes:
Attention properties => objets mais marche pas top
attr => seulement des strings values!


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-connect-ble" -->

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
    <svg class="h-150 color-white">
        <use xlink:href="#webcomponents_logo" />
    </svg><br> Exemple
</h1>


##==##

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-connect-ble" -->

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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-connect-ble" -->

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
    <svg class="h-150 color-white">
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
    <svg class="h-350 color-white">
        <use xlink:href="#cart" />
    </svg><br> Soyez sélectifs <br> <span class="fragment">ou pas ;)</span>
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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-attributes" -->

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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-attributes" -->

## Deviens

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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-attributes" -->

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
        <svg class="h-150 color-white">
            <use xlink:href="#happy" />
        </svg>
        <span class="webspecs">Synchro complexe</span>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-white">
            <use xlink:href="#happy" />
        </svg>
        <span class="webspecs">Passage d'objets complexes</span>
    </div>
    <div class="flex-hori fragment">
        <svg class="h-150 color-white">
            <use xlink:href="#happy" />
        </svg>
        <span class="webspecs">Beaucoup de boilerplate...</span>
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

<!-- .slide: class="with-code"  data-background="#3f3f3f" data-state="code-custom-attributes" -->

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

## Crédits - The Noun Project


Icon Fair / Ralf Schmitzer / Nathan Thomson / Shmidt Sergey / Por Suppasit / Veronika Krpciarova / Logan / Gregor Cresnar


##==##

<!-- .slide: class="transition-white" -->

# Des Questions ? <br> :)

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
</div>