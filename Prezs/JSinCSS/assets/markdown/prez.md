<!-- .slide: class="transition" -->

# JS in CSS, yes we can 🤔

## jefBinomed 


##==##

<!-- .slide: data-type-show="prez" -->

<div id="demo-var" class="flex-hori">
    <div id="codemirror-css" class="codemirror-code">
    </div>
    <div id="pure-css">
        <h1>JS in CSS with Pure CSS</h1>
        <div id="bg1" class="bg"></div>
        <div id="bg2" class="bg"></div>
    </div>
</div>

Notes:
Mettre Color => Couleur différente + :hover


##==##

# Behind the magic

<video height="80%" src="./assets/videos/magic-reveal.mp4" data-autoplay></video>


##==##

<!-- .slide: class="transition" -->

<h1>Custom Properties <br>& eval()<br> & raf<br> = 🧙‍♀️</h1>


##==##

 ## According to W3C

 ### Custom properties constraints

 ||value|
 |---|---|
 |name|__--*__|
 |value|any css value|

 ##==##

 <!-- .slide: class="with-code big-code" data-state="stop-code-myvar" -->
 ## Css Rocks

<br><br>

```css
--var: 🤘;
--var2: ()=>console.log('🤘');
/* Valid Css 🤘*/
```

##==##

<!-- .slide: class="with-code big-code" data-type-show="full" -->
## var(--myvar)

<br>

```css
--myvar: 🤘;
/* --myvar = '🤘' */
--myvar2: var(--myvar);
/* --myvar2 = '⎵🤘⎵' */
```

##==##

<!-- .slide: class="with-code big-code" data-state="code-myvar stop-code-url" data-type-show="prez" -->
## var(--myvar)

<br>

```css
--myvar: 🤘;
/* --myvar = '🤘' */
--myvar2: var(--myvar);
/* --myvar2 = '⎵🤘⎵' */
```

<mask-highlighter id="highlight-myvar"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>


##==##

<!-- .slide: class="with-code" data-type-show="full" -->

## Problem

```css
--prefix: 'http://monsite.com/';
--img: 'img.jpg';
background-url: url(var(--prefix)var(--img));

/* background-url =
  url(⎵http://monsite.com/⎵img.jpg⎵) ❌ */
```


##==##

<!-- .slide: class="with-code" data-state="stop-code-myvar code-url" data-type-show="prez" -->

## Problem

```css
--prefix: 'http://monsite.com/';
--img: 'img.jpg';
background-url: url(var(--prefix)var(--img));

/* background-url =
  url(⎵http://monsite.com/⎵img.jpg⎵) ❌ */
```

<mask-highlighter id="highlight-url"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>

##==##

<!-- .slide: class="transition no-filter" data-state="stop-code-url" data-background="./assets/images/boy-child-clouds-kid-346796.jpg" -->

# JS to rescue

##==##

## The Idea

<br>

![center](./assets/images/js-in-css-principle.svg)

##==##

<!-- .slide: class="with-code big-code" -->

# Code to produce

```javascript
new HelperJsInCss(
  domElement, // DOM 
  '--url', // CustomProperty
  false, // Raf ?
  ['--imgToUse'] // Args
);
```

[HelperJsInCss Gist](https://gist.github.com/jefBinomed/6d4e79bec71d365e8e0828c55ccbb925)

##==##

<video height="80%" src="./assets/videos/magic.mp4" data-autoplay></video>

##==##

## Random Color

<div id="demo-random-color" class="flex-hori">
    <div id="codemirror-random" class="codemirror-code">
    </div>
    <div id="random-color-css">
        <h1>Yeah Random Color in CSS !!</h1>
    </div>
</div>

##==##

## Custom Properties Dependancy

<div id="demo-dependancy" class="flex-hori">
    <div id="codemirror-dependancy" class="codemirror-code">
    </div>
    <div id="dependancy-css">
        <h1>H1 use a dependancy of <br> an other property</h1>
    </div>
</div>

##==##

## Use variables

<div id="demo-args" class="flex-hori">
    <div id="codemirror-args" class="codemirror-code">
    </div>
    <div id="args-css">
        <h1>Use Arguments</h1>
        <div id="bg1-args" class="bg"></div>
        <div id="bg2-args" class="bg"></div>
    </div>
</div>

##==##

<!-- .slide: class="transition text-white no-filter " data-state="stop-code-houdini" data-background="./assets/images/artem-maltsev-3n7DdlkMfEg-unsplash.jpg" -->

# ‍🧙‍♀️Houdini CSS does magic !

##==##

<!-- .slide: class="with-code" data-state="code-houdini" data-type-show="prez" -->

## Paint Api

```javascript
registerPaint('circle-from-css', class {
 static get inputProperties() {
  return ['--circle'];
 }
 paint(ctx, geom, properties, args) {
  eval(
   properties.get('--circle').toString()
  )(ctx, geom, properties);
 }
});
```

<mask-highlighter id="highlight-houdini"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>

##==##

<!-- .slide: class="with-code" data-type-show="full" -->

## Paint Api

```javascript
registerPaint('circle-from-css', class {
   static get inputProperties() {
      return ['--circle-js-in-css'];
   }
   paint(ctx, geom, properties, args) {
      eval(properties.get('--circle-js-in-css')
        .toString())(ctx, geom, properties);
   }
});
```


##==##

<!-- .slide: class="cadre parent-demo-paint-js-in-css" data-state="stop-code-houdini" -->

<div id="demo-paint-api-js-in-css" >
    <div id="codemirror-paint-api-js-in-css"></div>
    <div id="render-element-paint-api-js-in-css"></div>
</div>


Notes:
Modifier Couleur ou Taille !


##==##

## Where does it work?

|Mecanism|IE|Edge|Firefox|Safari|Chrome|
|---|---|---|---|---|---|
|HelperJsInCss|❌|✅|✅|✅|✅|
|Houdini|❌|❌|❌|❌|✅|

##==##

<!-- .slide: class="transition no-filter" data-background="./assets/images/kelly-sikkema-bj3l739cwc8-unsplash.jpg" -->

# To conclude

##==##


<!-- .slide: class="who-am-i" -->

## Questions?

### Jean-François Garreau


<!-- .element: class="descjf" -->
GDE Web Technologies & Mozilla Tech Speaker

![avatar w-300 wp-200 onZTop](./assets/images/jf.jpg)


![company_logo onZTop](./assets/images/Sfeir-Gris.png)
![gdg_logo onZTop](./assets/images/GDG-Logo-carre.png)
![gde_logo onZTop](./assets/images/gde.png)
![mts_logo onZTop](./assets/images/mts.png)

<!-- .element: class="twitter" -->
[@jefBinomed](https://twitter.com/jefBinomed)



<div class="credits">
    <h4 >Credits : <a href="https://thenounproject.com/" target="_blank">The noun project</a></h4>
    <p>tracking by balyanbinmalkan / Engine by ibrandify</p>
</div>
