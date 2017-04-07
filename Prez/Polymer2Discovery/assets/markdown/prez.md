
<!-- .slide: class="first-slide" data-background="./assets/images/polymer.svg" -->

# **Polymer 2 - What's new ?**


### GDG  @ **Nantes**


##==##


<!-- .slide: data-background="./assets/images/lego_blocks.jpg" data-state="hidefooter" class="transition" data-copyrights="true"  -->

# Où en est-on ?

<div class="copyrights white">fast company</div>

Notes:


##==##


<!-- .slide: class="transition text-white"  -->

# Specs 1.0 Figées !

![center w-400](./assets/images/POLYMER_1.0.png)

Notes:


##==##


<!-- .slide: class="transition text-white"  -->


<div class="flex-col">
    <div class="flex-hori padding">
        <svg class="h-150 color-white">
            <use xlink:href="#template" />
        </svg>
        <span class="webspecs">Templates</span>
        <svg class="h-150 color-green fragment">
            <use xlink:href="#check" />
        </svg>
    </div>
    <div class="flex-hori fragment padding">
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

<!-- .slide: class="transition text-white"  -->

<h1>
    <svg class="h-350 color-red">
        <use xlink:href="#candy" />
    </svg><br> Polymer 2.0
</h1>

Notes:
C'est du sucre syntaxique sur les webcompenents

##==##

What's new ?

##==##


Compatibilité ?

88% des composants déjà migrés

##==##

Comment migrer ?

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
</div>