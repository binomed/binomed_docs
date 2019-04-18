<!-- .slide: class="transition text-white cadre" data-type-show="full" -->

<h1>
    Let's do magic with Houdini CSS
</h1>


##==##

<!-- .slide: class="transition text-white cadre" data-type-show="prez" -->

<h1>
    Let's do magic with Houdini CSS
</h1>

jefBinomed @DevoxxFR #HoudiniCSS



##==##

<!-- .slide: class="cadre" -->

## Once upon a time


<img src="./assets/images/browsers_old.png" class="center"></img>

Notes:
Des programmes qui nous permettent d'accéder au web


##==##

<!-- .slide: class="cadre" -->

# WebManifesto

<blockquote>
<cite>
Browser vendors should provide new low-level capabilities that expose the possibilities of the underlying platform as closely as possible. ...
</cite>
</blockquote>

https://github.com/extensibleweb/manifesto


##==##

<!-- .slide: class="cadre" -->

## How it works?


<img src="./assets/images/Midget-Cars-3.jpeg" class="center"></img>

Notes:
Des programmes qui nous permettent d'accéder au web

##==##

<!-- .slide: class="cadre" data-state="browser-engine" -->

<svg id="svg-browser" class="h-250 color-white">
    <use xlink:href="#browser-paint" />
</svg>

<svg id="svg-html"class="h-150 color-white no-stroke">
    <use xlink:href="#html-paint" />
</svg>

<svg id="svg-cloud"class="h-150 color-white">
    <use xlink:href="#cloud" />
</svg>

<div id="svg-objects">
    <svg class="h-150 color-white">
        <use xlink:href="#objects" />
    </svg><br>JS DOM
</div>

<div id="svg-css-objects">
    <svg class="h-150 color-white">
        <use xlink:href="#css-objects" />
    </svg><br>CSS OM
</div>

<h2 id="title-download">Download</h2>
<h2 id="title-parsing">Parsing & Render tree</h2>
<h2 id="title-layout">Layout</h2>
<h2 id="title-paint">Paint & Composite</h2>

<svg id="svg-process"class="color-white" width="150px" height="150px" viewBox="0 0 150 150">
    <use xlink:href="#process" transform="scale(1.5)" />
</svg>

<svg id="svg-browser-layout"class="color-white">
    <use xlink:href="#browser-layout" />
</svg>

<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>
<div class="fragment" data-fragment-index="5" hidden></div>

##==##


<!-- .slide: class="cadre" data-state="animate-houdini-workflow" -->
# Why Houdini?


<div class="center-element">
    <img id="houdini_workflow-1" src="./assets/images/browser_workflow_black.svg" class="w-1000"></img>
    <img id="houdini_workflow-2" src="./assets/images/browser_workflow_black_with_houdini_light.svg" class="w-1000" style="display:none"></img>
</div>

<div class="fragment" data-fragment-index="1" hidden></div>

##==##

<!-- .slide: class="transition text-white transparent cadre"-->

<h1>
    <svg class="fh-250 color-white">
        <use xlink:href="#magic" />
    </svg><br>Houdini CSS
</h1>


##==##
<!-- .slide: class="cadre"-->

# Houdini Group

<div class="flex-hori">
    <img src="./assets/images/chrome_logo_old_2.png" width="200px">
    <img src="./assets/images/firefox_logo_old_2.png" width="200px">
    <img src="./assets/images/edge_logo_old_2.png" width="200px">
    <img src="./assets/images/safari_logo_old_2.png" width="200px">
    <img src="./assets/images/opera_logo_old_2.png" width="200px">
</div>
<div class="flex-hori">
    <img src="./assets/images/hp_logo_old_2.png" width="200px">
    <img src="./assets/images/lg_logo_old_2.png" width="200px">
    <img src="./assets/images/adobe_logo_old_2.png" width="200px">
    <img src="./assets/images/intel_logo_old_2.png" width="200px">
</div>

Notes:
Regroupement des acteurs visant à améliorer le web

##==##


<!-- .slide: class="cadre" -->
# New Apis


<div class="center-element">
    <img src="./assets/images/browser_workflow_black_with_houdini.svg" class="w-900"></img>
</div>



##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#css-objects" />
    </svg><br>Typed OM
</h1>



##==##

<!-- .slide: class="transition text-white transparent cadre with-code big-code"  -->

<h1>Problem</h1>
```javascript
$('#div').style.height
 = getRandomInt() + 'px';
```

Notes:
Eviter le parsing inutile

##==##

<!-- .slide: class="transition text-white transparent cadre with-code big-code" data-state="stop-code-typedom-new" -->

<h2>Introduce</h2>
```javascript
('#div').attributeStyleMap
// &&
CSS.px(getRandomInt());
```

Notes:
Eviter le parsing inutile



##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## New Possibilities

```javascript
// Units
CSS.em(3);

// Positions
new CSSPositionValue(CSS.px(5), CSS.px(10));

// Transform
new CSSRotate(CSS.deg(45));

// Math
new CSSMathSum(CSS.px(10), CSS.percent(50));

```

Notes:
Ajout de la propriété CSS à l'objet windows

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="code-typedom-new stop-code-typedom-api" -->

## New Possibilities

```javascript
// Units
CSS.em(3);

// Positions
new CSSPositionValue(CSS.px(5), CSS.px(10));

// Transform
new CSSRotate(CSS.deg(45));

// Math
new CSSMathSum(CSS.px(10), CSS.percent(50));
```



<mask-highlighter id="highlight-typedom-new"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>


Notes:
Ajout de la propriété CSS à l'objet windows


##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## New Api

```javascript
myElement.attributeStyleMap.set("opacity", CSS.number(3));
myElement.attributeStyleMap.set("left", CSS.px(15));

console.log(myElement.attributeStyleMap.get("opacity").value); // 3
console.log(myElement.attributeStyleMap.get("left").value); // 15
console.log(myElement.attributeStyleMap.get("left").unit); // px

console.log(myElement.attributeStyleMap.has("left")); // true

console.log(myElement.attributeStyleMap.delete("left")); // remove
console.log(myElement.attributeStyleMap.clear()); // remove
```

Notes:
Marche aussi pour ComputeStyle !!!

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="stop-code-typedom-new code-typedom-api" -->

## New Api

```javascript
myElement.attributeStyleMap.set("opacity", CSS.number(3));
myElement.attributeStyleMap.set("left", CSS.px(15));

console.log(myElement.attributeStyleMap.get("opacity").value); // 3
console.log(myElement.attributeStyleMap.get("left").value); // 15
console.log(myElement.attributeStyleMap.get("left").unit); // px

console.log(myElement.attributeStyleMap.has("left")); // true

console.log(myElement.attributeStyleMap.delete("left")); // remove
console.log(myElement.attributeStyleMap.clear()); // remove
```



<mask-highlighter id="highlight-typedom-api"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>


Notes:
Marche aussi pour ComputeStyle !!!


##==##

<!-- .slide: class="with-code no-highlight cadre big-code" data-type-show="prez" data-state="stop-code-typedom-api" -->

## Numeric Values

```javascript
const { value /*42*/
      , unit  /*px*/ } =
        CSS.px(42);
```

Notes:
Marche aussi pour ComputeStyle !!!

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Numeric Values

```javascript
const {value, unit} = CSS.number('10'); // value === 10, unit === 'number'

const {value, unit} = CSS.px(42); // value === 42, unit === 'px'

const {value, unit} = CSS.vw('100'); // value === 100, unit === 'vw'

const {value, unit} = CSS.percent('10'); // value === 10, unit === 'percent'

const {value, unit} = CSS.deg(45); // value === 45, unit === 'deg'

const {value, unit} = CSS.ms(300); // value === 300, unit === 'ms'
```

Notes:
Marche aussi pour ComputeStyle !!!

##==##

<!-- .slide: class="with-code no-highlight cadre big-code" data-type-show="prez" -->

## Maths - calc : calc(100vw - 10px)

```javascript
new CSSMathSum(
    CSS.vw(100),
    CSS.px(-10));
```

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Maths - calc

```javascript
new CSSMathSum(CSS.vw(100), CSS.px(-10)).toString(); // "calc(100vw - 10px)"

new CSSMathNegate(CSS.px(42)).toString() // "calc(-42px)"

new CSSMathInvert(CSS.s(10)).toString() // "calc(1 / 10s)"

new CSSMathProduct(CSS.deg(90), CSS.number(Math.PI/180)).toString();
// "calc(90deg * 0.0174533)"
```

##==##

<!-- .slide: class="with-code no-highlight cadre big-code" data-state="stop-code-typedom-conversion" data-type-show="prez" -->

## Maths - operations

```javascript
CSS.deg(45).mul(2)
// {value:90, unit:"deg"}
```

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Maths - operations

```javascript
CSS.deg(45).mul(2) // {value: 90, unit: "deg"}
CSS.percent(50).max(CSS.vw(50)).toString() // "max(50%, 50vw)"

// Can Pass CSSUnitValue:
CSS.px(1).add(CSS.px(2)) // {value: 3, unit: "px"}

// multiple values:
CSS.s(1).sub(CSS.ms(200), CSS.ms(300)).toString() // "calc(1s-200ms-300ms)"
// or pass a `CSSMathSum`:
const sum = new CSSMathSum(CSS.percent(100), CSS.px(20)));
CSS.vw(100).add(sum).toString() // "calc(100vw + (100% + 20px))"
```


##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Maths - conversion

```javascript
// Convert px to other absolute/physical lengths.
el.attributeStyleMap.set('width', '500px');
const width = el.attributeStyleMap.get('width');
width.to('mm'); // CSSUnitValue {value: 132.29166666666669, unit: "mm"}
width.to('cm'); // CSSUnitValue {value: 13.229166666666668, unit: "cm"}
width.to('in'); // CSSUnitValue {value: 5.208333333333333, unit: "in"}

CSS.deg(200).to('rad').value // 3.49066...
CSS.s(2).to('ms').value // 2000
```

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="prez" data-state="stop-code-typedom-operations code-typedom-conversion stop-code-typedom-transform"  -->

## Maths - conversion

```javascript
// Convert px to other absolute/physical lengths.
el.attributeStyleMap.set('width', '500px');
const width = el.attributeStyleMap.get('width');
width.to('mm'); // CSSUnitValue {value: 132.29166666666669, unit: "mm"}
width.to('cm'); // CSSUnitValue {value: 13.229166666666668, unit: "cm"}
width.to('in'); // CSSUnitValue {value: 5.208333333333333, unit: "in"}

CSS.deg(200).to('rad').value // 3.49066...
CSS.s(2).to('ms').value // 2000
```



<mask-highlighter id="highlight-typedom-conversion"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>



##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Transform

```javascript
// transform: rotateZ(45deg) scale(0.5) translate3d(10px,10px,10px);

const transform =  new CSSTransformValue([
  new CSSRotate(CSS.deg(45)),
  new CSSScale(CSS.number(0.5), CSS.number(0.5)),
  new CSSTranslate(CSS.px(10), CSS.px(10), CSS.px(10))
]);
```

Notes:
En plus : PARSING / ERROR
CHROME 66


##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="stop-code-typedom-conversion code-typedom-transform"-->

## Transform

```javascript
// transform: rotateZ(45deg) scale(0.5) translate3d(10px,10px,10px);

const transform =  new CSSTransformValue([
  new CSSRotate(CSS.deg(45)),
  new CSSScale(CSS.number(0.5), CSS.number(0.5)),
  new CSSTranslate(CSS.px(10), CSS.px(10), CSS.px(10))
]);
```



<mask-highlighter id="highlight-typedom-transform"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>
<div class="fragment" data-fragment-index="5" hidden></div>



Notes:
En plus : PARSING / ERROR
CHROME 66


##==##

<!-- .slide: class="with-code no-highlight cadre" data-state="stop-code-typedom-transform"-->

## Demo

```javascript
const square = document.querySelector('#square');
const transform = new CSSRotate(0,0,1, CSS.deg(0))

square.addEventListener('mouseenter', ()=>{
    transform.anglue.value =
        (transform.anglue.value +5) % 360
    square.attributeStyleMap.
        set('transform', transform);
});
```

<div id="squareDemo"></div>

Notes:
En plus : PARSING / ERROR
CHROME 66

##==##


<!-- .slide: class="transition text-white transparent cadre" data-type-show="prez" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#factory" />
    </svg><br>In the real world
</h1>

##==##

<!-- .slide: class="transition text-white transparent cadre" data-state="stop-code-css-properties" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#css" />
    </svg><br>Custom Properties
</h1>


##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## CSS Custom Properties

```css
html { // Declaration
    --a-name: #333;
}

div { // Usage
    color: var(--a-name);
}

h1 { // Default value
    color: var(--a-name, red);
}
```

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="code-css-properties" -->

## CSS Custom Properties

```css
html { // Declaration
    --a-name: #333;
}

div { // Usage
    color: var(--a-name);
}

h1 { // Default value
    color: var(--a-name, red);
}
```



<mask-highlighter id="highlight-css-properties"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>



##==##

<!-- .slide: class="cadre" data-state="stop-code-css-properties" -->

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

<!-- .slide: class="with-code no-highlight cadre" -->

## Javascript Manipulation


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
elt.style.getProperty('--a-super-var'); // -> '#333'
```

##==##

<!-- .slide: class="cadre transition" -->

<h1> Houdini CSS : <br> Properties & Values API</h1>


##==##

<!-- .slide: class="with-code no-highlight cadre" -->

## Problem: No Types


```css
.thing {
  --my-color: green;
  --my-color: url("not-a-color");
  color: var(--my-color);
}
```

##==##

<!-- .slide: class="with-code no-highlight cadre" -->

## Problem: No Animations


```css
.animate {
    --my-length: 10px;
    width: var(--my-length);
    transition: width 1s ease;
}
```

##==##

<!-- .slide: class="with-code no-highlight cadre" -->

## Define Properties!


```javascript
CSS.registerProperty({
    name: "--my-color",
    syntax: "<color>",
    inherits: false,
    initialValue: "black"
});
```

##==##

<!-- .slide: class="with-code no-highlight cadre" data-state="stop-code-propertiesvalues-type" data-type-show="prez" -->

## Lots of types


```html
<length>                        <number>                    <custom-ident>

<percentage>                    <length-percentage>

<color>                         <image>

<url>                           <integer>

<angle>                         <time>

<resolution>                    <transform-list>
```

Notes:
Creuser custom-ident

##==##

<!-- .slide: class="with-code no-highlight cadre" data-state="stop-code-propertiesvalues-type" -->

## Lots of types


```html
<length> : "10px"               <number> : "2"              <custom-ident>

<percentage> : "10%"            <length-percentage> : "10px"

<color> : "red"                 <image> : url("img.png")

<url> : url("http")             <integer> : "3"

<angle> : "15deg"               <time> : "100ms"

<resolution> : "200dpi"         <transform-list> : "scaleX"
```

Notes:
Creuser custom-ident

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Defines Values types


```javascript
"<length>"
accepts length values

"<length> | <percentage>"
accepts lengths, percentages, percentage calc expressions, and length calc expressions, but not calc expressions containing a combination of length and percentage values.

"<length-percentage>"
accepts all values that "<length> | <percentage>" would accept, as well as calc expressions containing a combination of both length and percentage values.

"big | bigger | BIGGER"
accepts the ident "big", or the ident "bigger", or the ident "BIGGER".

"<length>+"
accepts a list of length values.
```

##==##

<!-- .slide: class="with-code cadre" data-type=show="prez" data-state="code-propertiesvalues-type" -->

## Defines Values types


```javascript
"<length>" // 10px

"<length> | <percentage>" // 10px || 50%

"<length-percentage>" // calc(10px - 50%)

"big | bigger | BIGGER" // "big"

"<length>+" // 10px, 20px, 30px
```



<mask-highlighter id="highlight-propertiesvalues-type"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>
<div class="fragment" data-fragment-index="5" hidden></div>




##==##

<!-- .slide: class="with-code no-highlight cadre" data-state="stop-code-propertiesvalues-type"-->

## Demo


```css
.animate{
    --transform:10px;
    transform: translateY(
            var(--transform));
    transition-property: --transform;
    transition-duration: 1s;
}
.animate.move{
    --transform: -100px;
}
```

<div id="parent-demo-properties-values"class="flex-hori">
    <div class="flex">
        <div id="square-no-properties"></div>
        <div id="btn-square-no-properties" class="button3d">No Properties</div>
    </div>
    <div class="flex">
        <div id="square-properties"></div>
        <div id="btn-square-properties" class="button3d">Properties</div>
    </div>

</div>

Notes:
Creuser custom-ident


##==##


<!-- .slide: class="transition text-white transparent cadre" data-type-show="prez" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#factory" />
    </svg><br>In the real world
</h1>

##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#worklet" />
    </svg><br>Worklet
</h1>

##==##

<!-- .slide: class="text-white transparent cadre" -->

# Kinda Web workers target for performance!


<img src="./assets/images/perf.jpg" class="center"></img>

Notes:
Paint Worklet
Layout Worklet
Audio Worklet
Animation Worklet



##==##

<!-- .slide: class="with-code no-highlight cadre" -->

## Worklet (the theory)


```javascript
window.myWorklet.addModule('scriptWorklet.js');

registerMyWorklet('name', class{
    process(arg){
        return;
    }
});
```

Notes:
Générique !! Process change en fonction du worklet !


##==##

<!-- .slide: class="cadre no-filter worklet-steps" data-copyrights="true" data-type-show="prez" data-state="worklet-steps"-->

<!--<img src="./assets/images/WorkletDiagram_black.svg" class="w-850"></img>-->
<svg class="w-850">
    <use xlink:href="#worklet-diagram" />
</svg>

<div class="copyrights diagram">credits to Sam Richard</div>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>
<div class="fragment" data-fragment-index="5" hidden></div>
<div class="fragment" data-fragment-index="6" hidden></div>


Notes:
Worklet Threads Instanciés de façon indep du main
le addModule fait 1 ou plusieurs imports de worklets ! En fonction du nombre de worklet threads
Ils peuvent être killé s'ils sont trop long
ils n'ont pas accès à self ou this

Sont vraiment indep du Main Thread !!!


##==##

<!-- .slide: class="cadre no-filter" data-copyrights="true" data-type-show="full"-->

<img src="./assets/images/WorkletDiagram_black.svg" class="w-850"></img>

<div class="copyrights diagram">credits to Sam Richard</div>

Notes:
Worklet Threads Instanciés de façon indep du main
le addModule fait 1 ou plusieurs imports de worklets ! En fonction du nombre de worklet threads
Ils peuvent être killé s'ils sont trop long
ils n'ont pas accès à self ou this

Sont vraiment indep du Main Thread !!!



##==##

<!-- .slide: class="transition text-white transparent cadre" data-state="stop-code-paint-api" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#paint" />
    </svg><br>Paint Api
</h1>



##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Declaration

```javascript
//index.js
CSS.paintWorklet.addModule('painter.js');

// painter.js
class MyPainter {
  static get inputProperties() { return ['--color'];}
  static get inputArguments() { return ['<length>', '<color>']; }
  paint(ctx, geometry, properties, args) {
    // ...
  }
}
registerPaint('myPainter', MyPainter);
```

Notes:
Canvas Api mais light !

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="code-paint-api" -->

## Declaration

```javascript
//index.js
CSS.paintWorklet.addModule('painter.js');

// painter.js
class MyPainter {
  static get inputProperties() { return ['--color'];}
  static get inputArguments() { return ['<length>', '<color>']; }
  paint(ctx, geometry, properties, args) {
    // ...
  }
}
registerPaint('myPainter', MyPainter);
```

<mask-highlighter id="highlight-paint-api"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>
<div class="fragment" data-fragment-index="5" hidden></div>


Notes:
Canvas Api mais light !

##==##


<!-- .slide: class="with-code no-highlight cadre" data-state="stop-code-paint-api" -->

## Usage

```css
textarea {
    --color: red;
    background-image: paint(myPainter,'10px', green);
}
```


##==##

<!-- .slide: class="cadre parent-demo-paint"-->

<div id="demo-paint-api" >
    <div id="codemirror-paint-api-css"></div>
    <div id="codemirror-paint-api"></div>
    <div id="render-element-paint-api"></div>
</div>


Notes:
Modifier Couleur ou Taille !

##==##

<!-- .slide: class="cadre parent-demo-paint-js-in-css"-->

<div id="demo-paint-api-js-in-css" >
    <div id="codemirror-paint-api-js-in-css"></div>
    <div id="render-element-paint-api-js-in-css"></div>
</div>


Notes:
Modifier Couleur ou Taille !


##==##


<!-- .slide: class="transition text-white transparent cadre" data-type-show="prez" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#factory" />
    </svg><br>In the real world
</h1>

##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#animation" />
    </svg><br>Animation Worklet
</h1>

##==##

<!-- .slide: class="cadre" data-state="stop-code-animator-declaration" -->

## How it works?

<img src="./assets/images/worklet_animation_black.svg" class="center h-500"></img>



##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full"-->

## Animator

```javascript
registerAnimator('animator-name', class {
  constructor() {
  }

  animate(currentTime, effect) {
    // console.log(`animate: ${currentTime}`, effect);
    effect.localTime = currentTime;
  }
});
```

Notes:

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="code-animator-declaration stop-code-animator-timeline"-->

## Animator

```javascript
registerAnimator('animator-name', class {
  constructor() {
  }

  animate(currentTime, effect) {
    // console.log(`animate: ${currentTime}`, effect);
    effect.localTime = currentTime;
  }
});
```


<mask-highlighter id="highlight-animator-declaration"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>

Notes:

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Animation - register and time management

```javascript
// Register the worklet
animationWorklet.addModule('my-animator.js');

// Define the TimeLineManager
const scrollTimeline = new ScrollTimeline({
      document.querySelector('#elementThatScroll'),
      orientation: 'block',
      timeRange: 1000,
    });

```

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="stop-code-animator-declaration code-animator-timeline stop-code-animator-effects"-->

## Animation - register and time management

```javascript
// Register the worklet
animationWorklet.addModule('my-animator.js');

// Define the TimeLineManager
const scrollTimeline = new ScrollTimeline({
      document.querySelector('#elementThatScroll'),
      orientation: 'block',
      timeRange: 1000,
    });

```

<mask-highlighter id="highlight-animator-timeline"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>


##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Animation - effects

```javascript
const avatarEffect = new KeyframeEffect(
    document.querySelector('#elementToAnim'),
[{  transform: `translateY(0px) scale(1)`,
    easing: 'ease-in-out',
    offset:
},{ transform: `translateY(${avatarTranslate}px) scale(${avatarScale})`,
    offset: 1
}], {
    duration: maxTime
    easing: 'linear'
});
```

Notes:
Pour l'instant que KeyFrameEvent !! Draft Unofficial !

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="stop- code-animator-effects stop-code-animator-invoke" -->

## Animation - effects

```javascript
const avatarEffect = new KeyframeEffect(
    document.querySelector('#elementToAnim'),
[{  transform: `translateY(0px) scale(1)`,
    easing: 'ease-in-out',
    offset:
},{ transform: `translateY(${avatarTranslate}px) scale(${avatarScale})`,
    offset: 1
}], {
    duration: maxTime
    easing: 'linear'
});
```


<mask-highlighter id="highlight-animator-effects"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>


Notes:
Pour l'instant que KeyFrameEvent !! Draft Unofficial !

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full"-->

## Animation - Invoke

```javascript
    new WorkletAnimation('animator-name',// animator name
      [avatarEffect], //effects
      scrollTimeline, //timeline
      {} //options
    ).play();

```

Notes:

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="stop-code-animator-effects code-animator-invoke"-->

## Animation - Invoke

```javascript
    new WorkletAnimation('animator-name',// animator name
      [avatarEffect], //effects
      scrollTimeline, //timeline
      {} //options
    ).play();

```



<mask-highlighter id="highlight-animator-invoke"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>


Notes:

##==##

<!-- .slide: class="cadre" data-state="animationDemoState stop-code-animator-invoke" data-copyrights="true" -->

## Demo

<div id="demoAnimationWorklet">
    <div class="bar">
    </div>
    <header class="profile">
    <img src="./assets/images/jef_avatar.jpg" class="avatar">
    <h1 class="name">Jean-François Garreau</h1>
    <h2 class="handle">@jefBinomed</h2>
    <div class="description">
        GDG Nantes Leader <a href="#">@GDGNantes</a> / <a href="#">@NantesWit</a> / <a href="#">#devoxx4kids</a> / <a href="#">#GDE Web</a> / developer and proud to be dev <a href="#">@Sfeir</a> / curious geek
    </div>
    <div class="homepage">
        <a href="#">jef.binomed.fr</a>
    </div>
    </header>
    <div class="tweets">
    <div class="tweet">
        <img src="./assets/images/jef_avatar.jpg" class="avatar">
        <div class="meta">
        <span class="name">Jean-François Garreau</span>
        <span class="handle">@jefBinomed</span>
        <span class="date">March 5</span>
        </div>
        Today I give a talk about #HoudininCSS !!
        <div class="media">
        <img src="./assets/images/houdini_old.jpg" width="300px">
        <p class="title">“A simple dev, GDE Web Technology...” – jef.binomed.fr</p>
        <p class="domain">jef.binomed.fr</p>
        </div>
    </div>
    </div>
</div>

<div class="copyrights diagram">credits to Das Surma</div>

Notes:


##==##


<!-- .slide: class="transition text-white transparent cadre" data-type-show="prez" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#factory" />
    </svg><br>In the real world
</h1>

##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#layout" />
    </svg><br>Layout Api
</h1>

##==##

<!-- .slide: class=" cadre" -->

## Layout Worklet

<blockquote>
<cite>
The layout stage of CSS is responsible for generating and positioning fragments from the box tree.
</cite>
</blockquote>


##==##

<!-- .slide: class="cadre" data-state="stop-code-layout-api" -->

## How it works?

<img src="./assets/images/layout_diagram_black.svg" class="center h-500"></img>

Notes:
border / margin / scrolls / padding => layoutEdges

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Layout - Worklet Api

```javascript
registerLayout('my-layout', class {
    static get inputProperties() {return ['--foo'] }
    static get childrenInputProperties() {return ['--bar'] }
    static get childDisplay() {return 'normal'}
    *intrinsicSizes(children, edges, styleMap) {// Min Max of children
        return {maxContentSize, minContentSize};
    }
    *layout(children, edges, constraints, styleMap) {// Where there is magic
        return {autoBlockSize,childFragments};
    }
});
```

Notes:
Child Display : normal vs block

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="code-layout-api"-->

## Layout - Worklet Api

```javascript
registerLayout('my-layout', class {
    static get inputProperties() {return ['--foo'] }
    static get childrenInputProperties() {return ['--bar'] }
    static get childDisplay() {return 'normal'}
    *intrinsicSizes(children, edges, styleMap) {// Min Max of children
        return {maxContentSize, minContentSize};
    }
    *layout(children, edges, constraints, styleMap) {// Where there is magic
        return {autoBlockSize,childFragments};
    }
});
```


<mask-highlighter id="highlight-layout-api"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>


Notes:
constraints => available space



##==##

<!-- .slide: class="cadre with-code" data-state="stop-code-layout-api stop-code-layout-intrinsic" -->

## Use
```javascript
// Index.js
layoutWorklet.addModule('layout.js');
```
```css
/*Main.css*/
body{
    display: layout('my-layout');
}
```

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Layout - calculate intrinsic size

```javascript
*intrinsicSizes(children, edges, styleMap) {// Min Max size of each children
    const childrenSizes = yield children.map((child) => {
        return child.intrinsicSizes();
    });
    const maxContentSize = childrenSizes.reduce((sum, childSizes) => {
        return sum + childSizes.maxContentSize;
    }, 0) + edges.all.inline;
    const minContentSize = childrenSizes.reduce((max, childSizes) => {
        return sum + childSizes.minContentSize;
    }, 0) + edges.all.inline;
    return {maxContentSize, minContentSize}; }
```

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="code-layout-intrinsic stop-code-layout-position"-->

## Layout - calculate intrinsic size

```javascript
*intrinsicSizes(children, edges, styleMap) {// Min Max size of each children
    const childrenSizes = yield children.map((child) => {
        return child.intrinsicSizes();
    });
    const maxContentSize = childrenSizes.reduce((sum, childSizes) => {
        return sum + childSizes.maxContentSize;
    }, 0) + edges.all.inline;
    const minContentSize = childrenSizes.reduce((max, childSizes) => {
        return sum + childSizes.minContentSize;
    }, 0) + edges.all.inline;
    return {maxContentSize, minContentSize}; }
```


<mask-highlighter id="highlight-layout-intrinsic"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full"-->

## Layout - position fragments

```javascript
*layout(children, edges, constraints, styleMap) {
    const childFragments = yield children.map((child) => {
        return child.layoutNextFragment({usableInlineSize,usableBlockSize});
    });
    let blockOffset = edges.all.blockStart;
    for (let fragment of childFragments) {
        fragment.blockOffset = blockOffset;
        fragment.inlineOffset = availableSize;
        blockOffset += fragment.blockSize;
    }
return {autoBlockSize: blockOffset + edges.all.blockEnd, childFragments}; }
```

Notes:

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="stop-code-layout-intrinsic code-layout-position"-->

## Layout - position fragments

```javascript
*layout(children, edges, constraints, styleMap) {
    const childFragments = yield children.map((child) => {
        return child.layoutNextFragment({usableInlineSize,usableBlockSize});
    });
    let blockOffset = edges.all.blockStart;
    for (let fragment of childFragments) {
        fragment.blockOffset = blockOffset;
        fragment.inlineOffset = availableSize;
        blockOffset += fragment.blockSize;
    }
return {autoBlockSize: blockOffset + edges.all.blockEnd, childFragments}; }
```


<mask-highlighter id="highlight-layout-position"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>
<div class="fragment" data-fragment-index="5" hidden></div>

Notes:


##==##

<!-- .slide: class="cadre" data-state="layoutDemoState stop-code-layout-position" data-copyrights="true" -->

## Demo - Masonry Layout

<div id="demoLayoutWorklet">
    <div>1 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>2 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>3 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>4 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>5 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>6 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>7 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>8 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
<div>9 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>
</div>
<div id="demoColParentBtn" class="flex">
    <span>Nb Colums : <span><span id="demoMasonryCols">3</span>
    <button id="demoMasonryBtnMinus">-</button>
    <button id="demoMasonryBtnPlus">+</button>
</div>

<div class="copyrights diagram">credits to Das Surma</div>

Notes:


##==##


<!-- .slide: class="transition text-white transparent cadre" data-type-show="prez" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#factory" />
    </svg><br>In the real world
</h1>

##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#missing" />
    </svg><br>What's missing?
</h1>

##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#box-tree" />
    </svg><br>Box Tree
</h1>

Notes:
Représentation ++ des éléments avec les positionnements de chaques fragments


##==##

<!-- .slide: class="with-code no-highlight cadre" -->

## Box Tree

```html
<style>
    p::first-letter {color: green}
</style>
<p> Hello <i>Houdini World</i></p>
```

<img src="./assets/images/box_tree_sample.png" class="center"></img>

Notes:

##==##

<!-- .slide: class="transition text-white transparent cadre" data-state="stop-code-parser-api" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#parser" />
    </svg><br>Parser Api
</h1>

Notes:
Converti en TypeOM

##==##

<!-- .slide: class="with-code no-highlight cadre" data-type-show="full" -->

## Parser Api

```javascript
 var background = window.cssParse.rule("background: green");
console.log(background.styleMap.get("background").value) // "green"

var styles = window.cssParse.ruleSet(`.foo {
    background: green;
    margin: 5px;
}` );
console.log(styles.length) // 2
console.log(styles[0].styleMap.get("margin").value) // 5
console.log(styles[0].styleMap.get("margin").type) // "px"
```

##==##

<!-- .slide: class="with-code cadre" data-type-show="prez" data-state="code-parser-api" -->

## Parser Api

```javascript
 var background = window.cssParse.rule("background: green");
console.log(background.styleMap.get("background").value) // "green"

var styles = window.cssParse.ruleSet(`.foo {
    background: green;
    margin: 5px;
}`);
console.log(styles.length) // 2
console.log(styles[0].styleMap.get("margin-top").value) // 5
console.log(styles[0].styleMap.get("margin-top").type) // "px"
```



<mask-highlighter id="highlight-parser-api"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
<div class="fragment" data-fragment-index="3" hidden></div>
<div class="fragment" data-fragment-index="4" hidden></div>


##==##

<!-- .slide: class="transition text-white transparent cadre" data-state="stop-code-parser-api" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#font-metrics" />
    </svg><br>Font Metrics
</h1>

Notes:
Donnes les infos manquantes sur les tailles pour calculer les tailles !


##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#can-i-use" />
    </svg><br>Can I use Houdini?
</h1>

Notes:

##==##

<!-- .slide: class="cadre" -->

<div id="ishoudiniready">
    <div class="browser specs">
        <div></div>
        <div>Layout Api</div>
        <div>Paint Api</div>
        <div>Parser Api</div>
        <div>Properties & Values</div>
        <div>Animation Worklet</div>
        <div>Typed OM</div>
        <div>Font Metrics API</div>
    </div>
    <div class="browser safari"> <!-- Safari -->
        <img src="./assets/images/safari_logo_old_2.png">
        <div class="no-signal">no signal</div><!-- Layout -->
        <div class="dev">In development</div><!-- Paint -->
        <div class="no-signal">no signal</div><!-- Parser -->
        <div class="partial">partially (TP 67)</div><!-- Properties -->
        <div class="no-signal">no signal</div><!-- Animation -->
        <div class="dev">In development</div><!-- TypedOM -->
        <div class="no-signal">no signal</div><!-- Font Metrics -->
    </div>
    <div class="browser chrome"> <!-- Chrome -->
        <img src="./assets/images/chrome_logo_old_2.png">
        <div class="partial">partially<br>(Canary)</div><!-- Layout -->
        <div class="available">yes<br>(Chrome 65)</div><!-- Paint -->
        <div class="no-signal">no signal</div><!-- Parser -->
        <div class="partial">partially<br>(Canary)</div><!-- Properties -->
        <div class="partial">partially<br>(Canary)</div><!-- Animation -->
        <div class="available">yes<br>(Chrome 66)</div><!-- TypedOM -->
        <div class="no-signal">no signal</div><!-- Font Metrics -->
    </div>
    <div class="browser edge"> <!-- Edge -->
        <img src="./assets/images/edge_logo_old_2.png">
        <div class="no-signal">no signal</div><!-- Layout -->
        <div class="no-signal">no signal</div><!-- Paint -->
        <div class="no-signal">no signal</div><!-- Parser -->
        <div class="no-signal">no signal</div><!-- Properties -->
        <div class="no-signal">no signal</div><!-- Animation -->
        <div class="no-signal">no signal</div><!-- TypedOM -->
        <div class="no-signal">no signal</div><!-- Font Metrics -->
    </div>
    <div class="browser firefox"> <!-- Firefox -->
        <img src="./assets/images/firefox_logo_old_2.png">
        <div class="intent">intent</div><!-- Layout -->
        <div class="intent">intent</div><!-- Paint -->
        <div class="no-signal">no signal</div><!-- Parser -->
        <div class="dev">development</div><!-- Properties -->
        <div class="no-signal">no signal</div><!-- Animation -->
        <div class="intent">intent</div><!-- TypedOM -->
        <div class="no-signal">no signal</div><!-- Font Metrics -->
    </div>
    <div class="browser opera"> <!-- Opera -->
        <img src="./assets/images/opera_logo_old_2.png">
        <div class="no-signal">no signal</div><!-- Layout -->
        <div class="available">yes<br>(Opera 52)</div><!-- Paint -->
        <div class="no-signal">no signal</div><!-- Parser -->
        <div class="no-signal">no signal</div><!-- Properties -->
        <div class="no-signal">no signal</div><!-- Animation -->
        <div class="available">yes<br>(Opera 53)</div><!-- TypedOM -->
        <div class="no-signal">no signal</div><!-- Font Metrics -->
    </div>
    <div class="browser w3c"> <!-- W3C -->
        <img src="./assets/images/w3c_old_2.png">
        <div class="dev">First public working draft</div><!-- Layout -->
        <div class="available">Candidate Recommendation</div><!-- Paint -->
        <div class="no-signal">no signal</div><!-- Parser -->
        <div class="partial">Working Draft</div><!-- Properties -->
        <div class="dev">First public working draft</div><!-- Animation -->
        <div class="partial">Working Draft</div><!-- TypedOM -->
        <div class="no-signal">no signal</div><!-- Font Metrics -->
    </div>
</div>

https://ishoudinireadyyet.com/


##==##

<!-- .slide: class="cadre" -->

# Links

* IsHoudiniReadyYet (+ links to specs): https://ishoudinireadyyet.com/
* Sam Richard Presentation: http://snugug.github.io/magic-tricks-with-houdini/
* Samples: https://googlechromelabs.github.io/houdini-samples/
* Das Surma (dev evangelist on chrome): https://twitter.com/dassurma
* Houdini Task Force: https://github.com/w3c/css-houdini-drafts/wiki

##==##

<!-- .slide: class="transition text-white transparent cadre" -->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#finish" />
    </svg><br>In conclusion
</h1>

Notes:


##==##

<!-- .slide: class="who-am-i cadre" -->

## Questions?

### Jean-François Garreau


<!-- .element: class="descjf" -->
GDE Web Technologies & Mozilla Tech Speaker

![avatar w-300 wp-200 onZTop](assets/images/jf.png)


![company_logo onZTop](assets/images/logo-SFEIR-monochrome-noir.png)
![gdg_logo onZTop](assets/images/GDG-Logo-carre_old.png)
![gde_logo onZTop](assets/images/gde_old.png)
![mts_logo onZTop](assets/images/mts_old.png)

<!-- .element: class="twitter" -->
[@jefBinomed](https://twitter.com/jefBinomed)

<div class="credits">
    <h4 >Credits : <a href="https://thenounproject.com/" target="_blank">The noun project</a></h4>
    <p>Alexander Zharikov / Ben Iconator / Christopher T. Howlett / icon 54 / Atif Arshad / Bernar  Novalyi / Kris Prepiakova / Jonathan Collie / ahmad / Ana Rosa Botello Hernandez / Petai Jantrapoon / ProSymbols / Ceative Mania /Fabiano Coelho / Vectors Market / Magicon / Arthur Shlain / Kirby Wu / Ralf Schmitzer / Gan Khoon Lay / Hopkins / Creative Stall</p>
</div>


<div style="display:none">
    <!--css-->
    <svg id="css" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 639.791 722.79375" enable-background="new 0 0 639.791 578.235" xml:space="preserve"><g><path  d="M73.647,107.372c146.098,0,291.501,0,437.302,0c-4.601,23.353-9.092,46.146-13.646,69.259   c-146.09,0-291.685,0-437.566,0c-7.079,35.891-14.086,71.42-21.224,107.606c146.125,0,291.535,0,437.316,0   c-8.041,40.251-15.933,79.916-24.01,119.543c-0.3,1.47-2.174,3.246-3.691,3.752c-56.531,18.85-113.099,37.586-169.701,56.222   c-1.868,0.615-4.352,0.615-6.177-0.077c-48.869-18.547-97.681-37.242-146.539-55.819c-2.575-0.979-3.225-2.167-2.641-4.799   c1.55-6.987,2.855-14.029,4.231-21.054c1.838-9.384,3.652-18.772,5.468-28.116c-0.902-0.24-1.221-0.398-1.539-0.398   c-34.163-0.03-68.327-0.007-102.49-0.132c-3.336-0.012-3.622,1.804-4.107,4.279c-4.162,21.238-8.443,42.453-12.652,63.683   C7.976,441.536,4.013,461.76,0,482.139c1.46,0.655,2.63,1.249,3.848,1.715c81.773,31.304,163.543,62.615,245.364,93.794   c2.088,0.796,4.943,0.756,7.09,0.046c94.503-31.262,188.961-62.662,283.463-93.929c2.948-0.975,4.32-2.372,4.904-5.326   c9.295-47.034,18.653-94.055,28.019-141.075c20.554-103.187,41.123-206.371,61.677-309.557c1.834-9.208,3.598-18.43,5.426-27.806   C457.856,0,276.597,0,95.125,0C87.994,35.648,80.915,71.04,73.647,107.372z"/><path d="M73.647,107.372C80.915,71.04,87.994,35.648,95.125,0c181.472,0,362.73,0,544.665,0   c-1.828,9.376-3.591,18.598-5.426,27.806c-20.553,103.187-41.123,206.371-61.677,309.557   c-9.366,47.02-18.724,94.041-28.019,141.075c-0.584,2.954-1.956,4.351-4.904,5.326c-94.502,31.267-188.96,62.667-283.463,93.929   c-2.147,0.71-5.002,0.75-7.09-0.046c-81.821-31.179-163.591-62.49-245.364-93.794c-1.218-0.466-2.387-1.06-3.848-1.715   c4.013-20.379,7.976-40.603,11.983-60.818c4.208-21.229,8.49-42.444,12.652-63.683c0.485-2.475,0.771-4.291,4.107-4.279   c34.163,0.125,68.327,0.102,102.49,0.132c0.318,0,0.637,0.159,1.539,0.398c-1.816,9.344-3.629,18.732-5.468,28.116   c-1.376,7.025-2.681,14.067-4.231,21.054c-0.584,2.632,0.066,3.82,2.641,4.799c48.857,18.578,97.67,37.273,146.539,55.819   c1.825,0.693,4.309,0.692,6.177,0.077c56.602-18.636,113.171-37.372,169.701-56.222c1.517-0.506,3.391-2.281,3.691-3.752   c8.076-39.627,15.968-79.292,24.01-119.543c-145.781,0-291.191,0-437.316,0c7.137-36.186,14.145-71.715,21.224-107.606   c145.881,0,291.476,0,437.566,0c4.554-23.113,9.045-45.906,13.646-69.259C365.148,107.372,219.745,107.372,73.647,107.372z"/></g></svg>
    <!--magic-->
    <svg id="magic" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 125" version="1.1" x="0px" y="0px"><g stroke="none" stroke-width="1"  fill-rule="evenodd"><path d="M39.9318417,35.594191 C39.9946443,34.9364883 40.5847134,34.4533908 41.2451767,34.4533908 C42.2272449,34.4533908 43.0236656,33.6576602 43.0236656,32.675592 L43.0236656,32.621071 C43.0236656,31.8812417 43.6585938,31.2897923 44.412916,31.3615668 C45.0706187,31.4243695 45.5537162,32.0144386 45.5537162,32.6749019 L45.5537162,32.675592 C45.5537162,33.6576602 46.3494468,34.4533908 47.331515,34.4533908 C47.9926684,34.4533908 48.5820474,34.9364883 48.6448501,35.594191 C48.7173147,36.3485133 48.1258653,36.9834414 47.386036,36.9834414 L47.331515,36.9834414 C46.3494468,36.9834414 45.5537162,37.7798621 45.5537162,38.7619303 L45.5537162,38.8157612 C45.5537162,39.5555905 44.9187881,40.1470399 44.1644659,40.0745752 C43.5067631,40.0117726 43.0236656,39.4223936 43.0236656,38.7619303 C43.0236656,37.7798621 42.2272449,36.9834414 41.2451767,36.9834414 L41.1906557,36.9834414 C40.4515165,36.9834414 39.8600672,36.3485133 39.9318417,35.594191 L39.9318417,35.594191 Z M47.4978386,6.71393255 C47.5226836,6.44753879 47.7614718,6.25222937 48.0285557,6.25222937 C48.4253858,6.25222937 48.7476808,5.93062447 48.7476808,5.53379438 L48.7476808,5.51170992 C48.7476808,5.21218948 49.0044126,4.97340128 49.3094542,5.00238713 C49.5751578,5.02792229 49.7704672,5.26602034 49.7704672,5.53310424 L49.7704672,5.53379438 C49.7704672,5.93062447 50.0927623,6.25222937 50.4895924,6.25222937 C50.7566763,6.25222937 50.9954645,6.44753879 51.0203095,6.71393255 C51.0499855,7.01897411 50.8105071,7.27501578 50.5116768,7.27501578 L50.4895924,7.27501578 C50.0927623,7.27501578 49.7704672,7.59731083 49.7704672,7.99414092 L49.7704672,8.01622537 C49.7704672,8.31574582 49.5137354,8.55453401 49.2086939,8.52554816 C48.9429902,8.50001301 48.7476808,8.26122482 48.7476808,7.99414092 C48.7476808,7.59731083 48.4253858,7.27501578 48.0285557,7.27501578 L48.0064712,7.27501578 C47.7076409,7.27501578 47.4681626,7.01897411 47.4978386,6.71393255 L47.4978386,6.71393255 Z M57.088014,38.6128602 C57.112859,38.3471566 57.3516472,38.1518472 57.6187311,38.1518472 C58.0155612,38.1518472 58.3378563,37.8295521 58.3378563,37.4327221 L58.3378563,37.4106376 C58.3378563,37.1118073 58.5945881,36.872329 58.8996296,36.9013148 C59.1653333,36.92685 59.3606427,37.1656382 59.3606427,37.4327221 L59.3606427,37.4327221 C59.3606427,37.8295521 59.6829377,38.1518472 60.0797678,38.1518472 C60.3468517,38.1518472 60.5856399,38.3471566 60.6104849,38.6128602 C60.6401609,38.9179018 60.4006826,39.1746336 60.1018523,39.1746336 L60.0797678,39.1746336 C59.6829377,39.1746336 59.3606427,39.4962385 59.3606427,39.8937587 L59.3606427,39.9151531 C59.3606427,40.2146735 59.1039109,40.4534617 58.7988693,40.4244758 C58.5331657,40.3989407 58.3378563,40.1608426 58.3378563,39.8937587 C58.3378563,39.4962385 58.0155612,39.1746336 57.6187311,39.1746336 L57.5966467,39.1746336 C57.2978164,39.1746336 57.0590282,38.9179018 57.088014,38.6128602 L57.088014,38.6128602 Z M30.7605808,42.1408522 C30.7861159,41.8751486 31.0249041,41.6791491 31.291988,41.6791491 C31.6888181,41.6791491 32.0111131,41.3575441 32.0111131,40.9607141 L32.0111131,40.9386296 C32.0111131,40.6391092 32.2678449,40.400321 32.5728865,40.4293068 C32.8385901,40.454842 33.0338995,40.69294 33.0338995,40.9600239 L33.0338995,40.9607141 C33.0338995,41.3575441 33.3555045,41.6791491 33.7530247,41.6791491 C34.0201086,41.6791491 34.2582066,41.8751486 34.2837418,42.1408522 C34.3127276,42.4458938 34.0739394,42.7019355 33.7751091,42.7019355 L33.7530247,42.7019355 C33.3555045,42.7019355 33.0338995,43.0242305 33.0338995,43.4217507 L33.0338995,43.4431451 C33.0338995,43.7426655 32.7771677,43.9814537 32.4721262,43.9524678 C32.2064225,43.9269327 32.0111131,43.6888346 32.0111131,43.4217507 C32.0111131,43.0242305 31.6888181,42.7019355 31.291988,42.7019355 L31.2699035,42.7019355 C30.9710732,42.7019355 30.7315949,42.4458938 30.7605808,42.1408522 L30.7605808,42.1408522 Z M64.921785,26.2628178 C65.2620237,25.9225791 65.2620237,25.3711579 64.921785,25.0302291 L64.3896876,24.4988218 C64.1550403,24.2641745 64.1550403,23.8832176 64.3896876,23.6492604 C64.624335,23.414613 65.0052919,23.414613 65.2392491,23.6492604 L65.7713465,24.1806676 C66.1115851,24.5209063 66.6630064,24.5209063 67.0039352,24.1806676 L67.5353425,23.6492604 C67.7699898,23.414613 68.1509467,23.414613 68.3849039,23.6492604 C68.6195513,23.8832176 68.6195513,24.2641745 68.3849039,24.4988218 L67.8534967,25.0302291 C67.513258,25.3711579 67.513258,25.9225791 67.8534967,26.2628178 L68.3849039,26.7949152 C68.6195513,27.0288724 68.6195513,27.4098293 68.3849039,27.6444766 C68.1509467,27.879124 67.7699898,27.879124 67.5353425,27.6444766 L67.0039352,27.1123793 C66.6630064,26.7721406 66.1115851,26.7721406 65.7713465,27.1123793 L65.2392491,27.6444766 C65.0052919,27.879124 64.624335,27.879124 64.3896876,27.6444766 C64.1550403,27.4098293 64.1550403,27.0288724 64.3896876,26.7949152 L64.921785,26.2628178 Z M34.9676698,21.7713914 C35.0028669,21.5546876 35.206458,21.4056176 35.4252322,21.4056176 L36.1070898,21.4056176 C36.3741737,21.4056176 36.5908774,21.1889138 36.5908774,20.9218299 L36.5908774,20.2165076 C36.5908774,19.9494237 36.8289754,19.7375509 37.1050312,19.78241 C37.3210448,19.8176071 37.470805,20.020508 37.470805,20.2399723 L37.470805,20.9218299 C37.470805,21.1889138 37.6875087,21.4056176 37.9545926,21.4056176 L38.6364502,21.4056176 C38.8552244,21.4056176 39.0588155,21.5546876 39.0940126,21.7713914 C39.1388716,22.0474471 38.9269989,22.2855451 38.659915,22.2855451 L37.9545926,22.2855451 C37.6875087,22.2855451 37.470805,22.5022489 37.470805,22.7693328 L37.470805,23.4746551 C37.470805,23.741739 37.2327069,23.9529216 36.9566512,23.9080626 C36.7406376,23.8735556 36.5908774,23.6699645 36.5908774,23.4505002 L36.5908774,22.7693328 C36.5908774,22.5022489 36.3741737,22.2855451 36.1070898,22.2855451 L35.4017674,22.2855451 C35.1346835,22.2855451 34.9228108,22.0474471 34.9676698,21.7713914 L34.9676698,21.7713914 Z M51.3046469,21.6319832 L51.3329426,21.6036875 C51.7249417,21.2116884 52.3743627,21.234463 52.7353056,21.6720113 C53.0506992,22.0536583 52.9941078,22.6223331 52.6448973,22.9722337 C52.1238422,23.4925987 52.1238422,24.3359489 52.6448973,24.856314 C52.9941078,25.2062146 53.0506992,25.7748893 52.7353056,26.1565364 C52.3743627,26.5940847 51.7249417,26.6175494 51.3329426,26.2248601 L51.3046469,26.1965644 C50.7842818,25.6761994 49.9409316,25.6761994 49.4205666,26.1965644 L49.3915808,26.2248601 C48.9995817,26.6175494 48.3501606,26.5940847 47.9885276,26.1565364 C47.6738241,25.7748893 47.7304155,25.2062146 48.0803161,24.856314 C48.599991,24.3359489 48.599991,23.4925987 48.0803161,22.9722337 L48.0513303,22.9432479 C47.6600213,22.5519389 47.6821058,21.9018277 48.1203442,21.5408849 C48.5019912,21.2254912 49.070666,21.2827728 49.4198765,21.6319832 L49.4205666,21.6319832 C49.9409316,22.1523483 50.7842818,22.1523483 51.3046469,21.6319832 L51.3046469,21.6319832 Z M35.1250216,51.5039719 C35.1250216,50.9325365 35.5887952,50.4687629 36.1602305,50.4687629 C36.7130321,50.4687629 37.1643831,50.9014803 37.1940591,51.4466903 C37.3100025,51.6447603 37.6681848,51.8773372 38.243761,52.1175057 C39.8717995,51.1416487 44.3259585,50.4404672 49.5792987,50.4404672 C55.0962721,50.4404672 59.7319376,51.2134232 61.1384415,52.2658856 C61.9417636,51.9746468 62.4359033,51.6847883 62.5753114,51.4466903 C62.6049874,50.9014803 63.0563385,50.4687629 63.6091401,50.4687629 C64.1805754,50.4687629 64.644349,50.9325365 64.644349,51.5039719 C64.644349,55.721413 50.4875219,55.7697227 49.8850304,55.7697227 C49.2825388,55.7697227 35.1250216,55.721413 35.1250216,51.5039719 L35.1250216,51.5039719 Z M33.5225182,89.3774353 L35.9076395,66.4047691 C37.4059319,66.7077402 39.0236184,66.9603312 40.7434454,67.1549505 C43.5461011,67.4737948 46.5192211,67.6352874 49.5799888,67.6352874 C54.5137945,67.6352874 59.3061217,67.1970489 63.2509578,66.4013184 L65.6367693,89.3774353 C65.5242766,90.6058832 59.8658246,92.9295822 49.5799888,92.9295822 C39.2934628,92.9295822 33.6350109,90.6058832 33.5225182,89.3774353 L33.5225182,89.3774353 Z M28.0704178,52.9850107 C28.0704178,50.5246642 36.2533993,47.0932917 49.5799888,47.0932917 C62.9058882,47.0932917 71.0888696,50.5246642 71.0888696,52.9850107 C71.0888696,55.4446671 62.9058882,58.8760396 49.5799888,58.8760396 C36.2533993,58.8760396 28.0704178,55.4446671 28.0704178,52.9850107 L28.0704178,52.9850107 Z M67.7092576,89.3401678 L64.584997,59.2052361 C69.6278448,57.8656757 73.1592875,55.7717932 73.1592875,52.9850107 C73.1592875,47.8137971 61.0100756,45.0228739 49.5799888,45.0228739 C38.1485218,45.0228739 26,47.8137971 26,52.9850107 C26,55.7717932 29.5307526,57.8656757 34.5736003,59.2052361 L31.455551,89.2338863 L31.4500299,89.3401678 C31.4500299,93.2291026 40.8476565,95 49.5799888,95 C58.311631,95 67.7092576,93.2291026 67.7092576,89.3401678 L67.7092576,89.3401678 Z"/></g></svg>
   <!-- browser-paint -->
   <svg id="browser-paint" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><path d="M95.058,33.681c-0.239-0.301-0.493-0.621-0.898-1.132c0.486-1.135,0.58-2.208,0.166-3.307   c-0.115-0.306-0.17-0.676-0.121-0.995c0.267-1.723-0.284-3.335-0.623-4.975c-0.902-4.366-5.518-6.377-8.993-5.549   c-0.988,0.235-2.013,0.517-3.009,0.475c-2.813-0.119-5.609,0.047-8.415,0.157c-2.893,0.114-5.794,0.03-8.692,0.022   c-0.509-0.001-1.018-0.054-1.528-0.083c-2.795-0.161-5.61-0.599-8.379-0.4c-2.535,0.182-5.07-0.203-7.596,0.241   c-1.066,0.187-2.189,0.129-3.292-0.198c-0.716-0.212-1.521-0.149-2.287-0.162c-4.425-0.073-8.855-0.033-13.274-0.223   c-4.36-0.188-8.649,0.522-12.975,0.735c-1.042,0.051-1.994,0.458-2.826,1.073c-2.638,1.951-4.417,4.446-4.846,7.784   c-0.14,1.09-0.191,2.227-0.557,3.244c-0.464,1.285-0.109,2.459,0.076,3.682c-0.625,0.742-0.896,1.607-0.898,2.567   c-0.002,0.935,0.024,1.872-0.019,2.805c-0.12,2.628-0.295,5.254-0.395,7.883c-0.048,1.259,0.184,2.545,0.008,3.778   c-0.278,1.954-0.265,3.899-0.281,5.857c-0.015,1.852-0.222,3.703-0.219,5.554c0.003,1.747-0.146,3.496-0.125,5.225   c0.051,4.136,0.045,8.272,0.027,12.583c0.592,0.226,1.2,0.491,1.829,0.69c0.56,0.176,1.222,0.149,1.697,0.443   c0.791,0.489,1.642,0.467,2.47,0.497c1.612,0.06,3.246-0.159,4.84,0.017c1.673,0.184,3.351,0.14,5.006,0.154   c3.641,0.03,7.286,0.378,10.931,0.053c0.583-0.052,1.182,0.086,1.773,0.13c0.846,0.063,1.693,0.18,2.539,0.172   c6.128-0.056,12.255-0.126,18.383-0.22c1.018-0.016,2.06-0.054,3.045-0.281c2.774-0.64,5.588-0.529,8.364-0.333   c1.608,0.114,3.221,0.259,4.83,0.273c2.465,0.021,4.93-0.087,7.396-0.138c3.833-0.079,7.666-0.218,11.498-0.206   c1.533,0.005,2.825-0.494,4.076-1.24c0.351-0.209,0.707-0.501,0.575-1.111c-0.629-0.211-1.301-0.436-1.883-0.631   c-0.028-1.614-0.1-3.06-0.064-4.504c0.037-1.497,0.179-2.991,0.272-4.486c0.032-0.51,0.102-1.022,0.079-1.529   c-0.146-3.142-0.455-6.283-0.432-9.423c0.021-2.94,0.279-5.88,0.383-8.825c0.13-3.646,0.759-7.264,0.522-10.941   c-0.111-1.732,0.389-3.377,1.658-4.691C94.98,34.084,94.989,33.883,95.058,33.681z M91.075,39.002   c-0.343,1.838-0.427,3.685-0.414,5.551c0.008,1.183-0.175,2.366-0.266,3.55c-0.079,1.018-0.186,2.036-0.217,3.056   c-0.08,2.705-0.061,5.415-0.211,8.116c-0.075,1.354-0.103,2.685,0.006,4.039c0.1,1.251,0.047,2.527-0.068,3.78   c-0.183,2.002,0.245,4.077-0.665,5.998c0.449,1.246,0.027,2.51,0.068,3.765c0.016,0.5-0.096,1.005-0.151,1.52   c-1.793,0.542-3.563,0.688-5.345,0.656c-3.312-0.059-6.616,0.173-9.925,0.202c-1.62,0.014-3.265,0.22-4.855,0.01   c-1.873-0.247-3.735-0.197-5.601-0.248c-1.953-0.053-3.884,0.082-5.837,0.36c-2.434,0.347-4.927,0.338-7.396,0.373   c-3.918,0.056-7.838,0.025-11.757,0.024c-1.265,0-2.53-0.017-3.795-0.035c-1.94-0.027-3.882-0.02-5.82-0.103   c-1.863-0.08-3.727-0.06-5.586-0.119c-4.476-0.142-8.946-0.458-13.418-0.712c-0.251-0.014-0.498-0.103-0.691-0.145   c-1.267-0.739-1.495-1.828-1.242-3.108c0.114-0.575,0.382-1.186,0.281-1.724c-0.255-1.361-0.378-2.616,0.289-3.949   c0.292-0.584,0.051-1.472-0.052-2.207c-0.187-1.321,0.078-2.632-0.199-3.987c-0.435-2.128-0.342-4.343-0.176-6.519   c0.284-3.727,0.299-7.453,0.188-11.185c-0.03-1.017,0.077-2.042,0.17-3.059c0.092-1.002,0.353-1.961,0.116-3.018   c-0.149-0.666-0.095-1.535,0.704-2.275c1.155-0.188,2.456-0.487,3.84-0.269c3.035,0.478,6.102,0.375,9.16,0.386   c1.599,0.006,3.195-0.072,4.783,0.227c0.494,0.093,1.029,0.07,1.531-0.003c4.728-0.684,9.497-0.418,14.245-0.607   c1.674-0.067,3.355,0.059,5.031,0.01c1.613-0.046,3.239-0.1,4.83-0.341c1.691-0.256,3.352-0.59,5.049-0.119   c1.574-0.533,3.278,0.019,4.801-0.416c2.676-0.763,5.422,0.32,8.063-0.536c0.369-0.12,0.847-0.014,1.248,0.091   c2.527,0.662,5.066,0.163,7.603,0.132c3.834-0.047,7.669-0.023,11.503-0.022c0.065,0,0.13,0.101,0.445,0.362   C91.258,37.333,91.229,38.179,91.075,39.002z M90.053,33.363c-1.277,0.073-2.555,0.149-3.833,0.179   c-2.892,0.067-5.79,0.023-8.677,0.18c-2.635,0.142-5.265,0.048-7.896,0.086c-3.489,0.051-7.011-0.127-10.457,0.292   c-3.146,0.383-6.272,0.335-9.409,0.459c-0.93,0.037-1.854,0.219-2.783,0.309c-0.409,0.039-0.825,0.026-1.236,0.012   c-0.253-0.009-0.521-0.138-0.755-0.088c-1.849,0.392-3.684,0.284-5.559,0.124c-1.737-0.148-3.507,0.129-5.264,0.182   c-3.165,0.095-6.324,0.166-9.498,0.042c-3.47-0.135-6.929-0.646-10.419-0.376c-0.924,0.071-1.87-0.084-2.801-0.183   c-0.693-0.074-1.324-0.329-1.949-1.124c-0.111-4.043,0.503-8.043,3.585-11.333c1.486-0.837,3.045-1.275,4.821-1.365   c2.264-0.114,4.562-0.273,6.776-0.923c0.396-0.116,0.868-0.143,1.266-0.049c2.353,0.557,4.744,0.221,7.109,0.365   c4.573,0.279,9.159-0.132,13.715,0.273c4.412,0.392,8.817,0.185,13.225,0.239c0.505,0.006,1.009,0.122,1.515,0.166   c3.217,0.28,6.432,0.618,9.668,0.511c1.088-0.036,2.17-0.215,3.258-0.262c2.536-0.11,5.073-0.164,7.609-0.275   c0.931-0.041,1.875-0.1,2.784-0.288c1.929-0.398,1.951-0.433,4.257,0.295c1.743,1.619,2.375,3.535,2.639,5.606   c0.051,0.403-0.064,0.827-0.094,1.242c-0.102,1.441-0.374,2.895,0.358,4.051C91.679,32.904,90.989,33.31,90.053,33.363z"/><path d="M15.274,27.495c-0.092,2.926,1.077,5.028,3.14,5.684c2.385,0.758,4.613-0.117,6.259-3.049   c0.556-2.889,0.556-2.889-0.623-5.2C20.721,22.341,17,23.096,15.274,27.495z M20.523,30.951c-1.578,0.085-2.057-1.005-2.597-2.188   c0.373-1.25,0.74-2.633,2.414-2.732c1.238-0.073,1.988,0.738,2.385,2.106C22.029,29.025,21.273,29.992,20.523,30.951z"/><path d="M44.565,23.747c-0.079-0.031-0.161-0.052-0.421-0.134c-1.277,0.373-2.668,0.165-3.635,1.208   c-0.903,0.975-1.393,2.112-1.374,3.467c0.011,0.807,0.243,1.544,0.774,2.108c0.959,1.018,2.121,1.69,3.881,1.625   c0.842-0.335,1.968-0.72,3.035-1.229c0.83-0.396,1.203-1.148,1.19-2.092C47.978,25.872,47.236,24.795,44.565,23.747z M42.942,29.43   c-0.386-0.294-0.773-0.589-1.19-0.908c0.306-1.057,0.572-2.009,1.779-2.329c0.51,0.161,1.062,0.335,1.699,0.536   c0.159,0.425,0.329,0.878,0.497,1.327C44.923,28.89,43.942,29.098,42.942,29.43z"/><path d="M33.888,24.316c-2.056-0.048-3.132,0.233-4.405,1.45c-1.323,1.265-2.116,3.231-0.959,5.017   c0.499,0.771,0.898,1.63,1.715,2.121c2.521,0.426,4.45-0.737,6.358-2.189c0.208-0.587,0.431-1.215,0.615-1.733   C36.184,25.468,36.03,25.804,33.888,24.316z M34.497,29.428c-0.92,0.39-1.912,0.809-3.051,1.291   c-0.348-0.556-0.683-1.093-0.998-1.596c0.493-1.541,1.279-2.485,3.152-2.274C34.042,27.685,35.074,28.206,34.497,29.428z"/></g></svg>
   <!--  cloud -->
   <svg id="cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 30" style="enable-background:new 0 0 24 24;" xml:space="preserve"><g><path d="M10.732,5.016c2.771,0.075,5.331,1.489,6.85,3.781c0.101,0.152,0.276,0.236,0.458,0.222   c1.926-0.157,3.738,0.559,5.078,1.914c0.096,0.097,0.225,0.148,0.355,0.148c0.004,0,0.007,0,0.011,0   c0.28,0.013,0.509-0.221,0.509-0.5c0-0.064-0.012-0.126-0.034-0.183c-0.227-2.102-2.06-3.729-4.24-3.732   C18.758,4.458,16.519,3,14.026,3c-1.288,0-2.521,0.382-3.564,1.104c-0.178,0.123-0.257,0.347-0.195,0.554S10.517,5.01,10.732,5.016   z"/><path d="M18.5,10c-0.412,0-0.834,0.056-1.278,0.169C15.96,7.623,13.369,6,10.5,6c-3.658,0-6.776,2.655-7.387,6.229   C1.264,12.826,0,14.536,0,16.5C0,18.981,2.019,21,4.5,21h14c3.032,0,5.5-2.467,5.5-5.5S21.532,10,18.5,10z"/></g></svg>
   <!-- css-objects -->
   <svg id="css-objects" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M15.614,84.176l0.163,0.083c0.041,0.02,0.113,0.06,0.184,0.101c0.294,0.126,0.633,0.202,0.983,0.216l0.157-0.002  l6.836,0.004c0.778,0,1.511-0.302,2.061-0.849c0.548-0.547,0.85-1.275,0.849-2.049c0-1.6-1.31-2.899-2.92-2.899h-3.953l0.001-17.43  c0.015-0.279,0.001-0.526-0.041-0.731c-0.147-0.905-0.623-1.634-1.321-2.078l-0.341-0.273l-6.337-6.338l7.045-7.051  c0.355-0.316,0.616-0.68,0.776-1.079c0.076-0.181,0.106-0.324,0.141-0.466l0.038-0.134c0.036-0.216,0.054-0.53,0.042-0.796  l0.002-17.671h3.952c1.637,0,2.918-1.232,2.918-2.806c0-0.769-0.298-1.487-0.841-2.022c-0.548-0.54-1.283-0.837-2.069-0.837  l-6.873,0.042c-0.364,0-0.724,0.071-1.077,0.21c-0.097,0.059-0.164,0.098-0.232,0.134l-0.155,0.079  c-0.062,0.03-0.125,0.058-0.181,0.094c-0.112,0.076-0.224,0.182-0.336,0.287l-0.145,0.124c-0.085,0.092-0.181,0.211-0.272,0.343  l-0.073,0.104c-0.068,0.116-0.127,0.238-0.185,0.361l-0.061,0.12c-0.034,0.093-0.053,0.192-0.078,0.288  c-0.022,0.092-0.053,0.188-0.085,0.284c-0.022,0.095-0.052,0.201-0.084,0.307c-0.011,0.03-0.006-0.006-0.002-0.045  c-0.021,0.207-0.067,0.385-0.112,0.524l0.084,19.137l-8.226,8.274c-0.554,0.555-0.849,1.308-0.833,2.124l0.001,0.05l-0.001,0.051  c-0.025,0.811,0.28,1.575,0.858,2.152l8.202,8.275l-0.085,18.979c0.047,0.144,0.092,0.321,0.112,0.527  c0.005,0.061,0.017,0.122,0.029,0.183c0.039,0.094,0.072,0.186,0.098,0.277c0.035,0.13,0.064,0.243,0.1,0.346  c0.032,0.059,0.061,0.116,0.087,0.175c0.047,0.104,0.102,0.214,0.165,0.321l0.103,0.152c0.085,0.12,0.169,0.225,0.252,0.313  c0.051,0.041,0.099,0.082,0.146,0.125c0.108,0.102,0.214,0.204,0.337,0.286C15.483,84.114,15.549,84.144,15.614,84.176z"></path><path d="M94.986,51.784c0.025-0.909-0.279-1.674-0.857-2.252l-8.199-8.273l0.085-18.979c-0.048-0.144-0.093-0.324-0.112-0.533  c-0.005-0.055-0.017-0.116-0.029-0.177c-0.042-0.102-0.076-0.201-0.104-0.301c-0.029-0.112-0.059-0.221-0.095-0.325  c-0.034-0.062-0.065-0.125-0.093-0.188c-0.053-0.115-0.109-0.225-0.167-0.323l-0.09-0.13c-0.078-0.111-0.166-0.222-0.257-0.318  c-0.051-0.041-0.099-0.082-0.145-0.125c-0.109-0.102-0.219-0.207-0.346-0.291c-0.07-0.046-0.142-0.077-0.211-0.111l-0.123-0.062  c-0.064-0.033-0.145-0.078-0.224-0.124c-0.271-0.115-0.608-0.189-0.959-0.203l-0.159,0.002l-6.836-0.004  c-0.778,0-1.511,0.302-2.061,0.85c-0.549,0.546-0.851,1.273-0.85,2.047c0,1.599,1.31,2.899,2.921,2.899h3.951l-0.001,17.433  c-0.015,0.276-0.001,0.522,0.041,0.728c0.146,0.905,0.624,1.634,1.32,2.078l0.342,0.273l6.338,6.337l-7.045,7.052  c-0.355,0.317-0.616,0.68-0.775,1.078c-0.075,0.178-0.105,0.319-0.14,0.462l-0.04,0.142c-0.036,0.216-0.054,0.533-0.042,0.789  l-0.003,17.676h-3.951c-1.637,0-2.919,1.232-2.919,2.806c-0.001,0.769,0.298,1.486,0.842,2.022c0.546,0.539,1.28,0.836,2.065,0.837  l6.875-0.042c0.364,0,0.725-0.07,1.074-0.209l0.398-0.218c0.062-0.031,0.127-0.06,0.186-0.097c0.096-0.067,0.214-0.176,0.333-0.285  l0.135-0.117c0.087-0.094,0.184-0.213,0.273-0.343l0.074-0.105c0.067-0.116,0.126-0.238,0.184-0.361l0.06-0.117  c0.036-0.099,0.056-0.203,0.082-0.306c0.021-0.084,0.05-0.176,0.083-0.269c0.023-0.101,0.053-0.203,0.084-0.307  c0.012-0.027,0.005,0.013,0.001,0.059c0.021-0.216,0.068-0.398,0.115-0.54L85.93,62.186l8.226-8.274  C94.709,53.357,95.003,52.603,94.986,51.784z"></path><path d="M66.554,7.476c-0.353-0.285-0.886-0.627-1.405-0.627l-0.226-0.009L45.272,5c-0.046,0.007-0.101,0.018-0.156,0.026  c-0.048,0.008-0.096,0.015-0.144,0.022c-0.144,0.053-0.279,0.093-0.413,0.12c-0.12,0.023-0.233,0.049-0.339,0.083  c-0.054,0.021-0.114,0.055-0.175,0.085l-0.355,0.166c-0.123,0.066-0.248,0.166-0.373,0.264l-0.14,0.103  C43.105,5.935,43,6.045,42.879,6.187l-0.072,0.083c-0.082,0.113-0.16,0.245-0.222,0.353l-0.072,0.121  c-0.055,0.124-0.088,0.229-0.124,0.331c-0.02,0.058-0.045,0.121-0.072,0.185c-0.002,0.023-0.007,0.059-0.013,0.094l-0.028,0.178  c-0.014,0.083-0.033,0.174-0.053,0.265l-6.729,73.171c-0.126,0.853,0.097,1.672,0.63,2.304l8.846,10.516  c0.035,0.055,0.066,0.112,0.106,0.164C45.638,94.621,46.451,95,47.316,95c0,0,0,0,0,0c0.692,0,1.339-0.235,1.87-0.683l10.687-8.99  c0.11-0.093,0.229-0.218,0.364-0.382l0.066-0.081c0.369-0.5,0.559-1.035,0.59-1.61l5.165-56.225l0.048-0.172  c0.058-0.208,0.089-0.368,0.101-0.505c0.011-0.131,0.008-0.28-0.01-0.478l-0.016-0.179l1.445-15.707  C67.71,9.032,67.309,8.089,66.554,7.476z M55.346,79.945l-13.793-1.194l4.708-51.219l13.79,1.197L55.346,79.945z M60.581,22.924  L46.79,21.73L47.762,11.2l13.788,1.197L60.581,22.924z"></path></svg>
   <!-- html-paint -->
   <svg id="html-paint" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 24 30" enable-background="new 0 0 24 24" xml:space="preserve"><g><path d="M3.167,23.9h17.667c0.221,0,0.4-0.179,0.4-0.4v-23c0-0.221-0.18-0.4-0.4-0.4H10.386c-0.052,0-0.104,0.011-0.153,0.031   c-0.043,0.018-0.08,0.045-0.113,0.075c-0.005,0.005-0.012,0.006-0.017,0.011l-7.22,7.22C2.877,7.444,2.875,7.452,2.868,7.459   C2.84,7.492,2.814,7.526,2.797,7.567C2.777,7.616,2.766,7.668,2.766,7.72V23.5C2.766,23.721,2.946,23.9,3.167,23.9z M20.433,23.1   H3.567V7.901C5.631,6.01,8.852,7.548,8.885,7.563C9.037,7.637,9.217,7.61,9.339,7.492C9.46,7.375,9.496,7.195,9.427,7.041   C9.412,7.007,7.956,3.643,10.565,0.9h9.868V23.1z M8.449,3.003C8.056,4.41,8.228,5.716,8.427,6.525   C7.662,6.274,6.454,6.009,5.221,6.231L8.449,3.003z"/><polygon points="6.757,13.258 6.047,13.258 6.047,11.626 4.889,11.626 4.889,16.072 6.047,16.072 6.047,14.242 6.757,14.242    6.757,16.072 7.915,16.072 7.915,11.626 6.757,11.626  "/><polygon points="8.332,12.61 9.204,12.61 9.204,16.072 10.362,16.072 10.362,12.61 11.234,12.61 11.234,11.626 8.332,11.626  "/><polygon points="12.691,16.072 12.691,12.759 12.703,12.759 13.32,16.072 14.154,16.072 14.771,12.759 14.783,12.759    14.783,16.072 15.867,16.072 15.867,11.626 14.211,11.626 13.744,14.261 13.732,14.261 13.264,11.626 11.607,11.626 11.607,16.072     "/><polygon points="19.111,15.126 17.685,15.126 17.685,11.626 16.526,11.626 16.526,11.626 16.526,16.072 19.111,16.072  "/></g></svg>
   <!-- internet -->
   <svg id="internet" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" x="0px" y="0px"><title>data, server, database, globe, cloud</title><path d="M70.38,18.67l-.54,0-1.35.07-.64-.71a23.86,23.86,0,0,0-40.4,8L27,27.36H25.54l-.25,0h0A15.32,15.32,0,0,0,24.56,58a27,27,0,0,1,50.67-.57,19.67,19.67,0,0,0-4.85-38.72ZM48,24.67A14.68,14.68,0,0,0,33.33,39.33h-4A18.69,18.69,0,0,1,48,20.67ZM78.67,49A14.69,14.69,0,0,0,64,34.33v-4A18.7,18.7,0,0,1,82.67,49Z"/><path d="M60.8,55A59,59,0,0,1,62,65H72.91a22.88,22.88,0,0,0-3.3-10Z"/><path d="M50,44c-1.78,0-3.94,2.51-5.56,7H55.56C53.94,46.51,51.78,44,50,44Z"/><path d="M30.39,79H39.2A59,59,0,0,1,38,69H27.09A22.88,22.88,0,0,0,30.39,79Z"/><path d="M42,65H58a52,52,0,0,0-1.23-10H43.27A52,52,0,0,0,42,65Z"/><path d="M57.28,88.81A23,23,0,0,0,66.5,83H59.77A28.05,28.05,0,0,1,57.28,88.81Z"/><path d="M59.77,51H66.5a23,23,0,0,0-9.22-5.81A28.05,28.05,0,0,1,59.77,51Z"/><path d="M72.91,69H62A59,59,0,0,1,60.8,79h8.81A22.88,22.88,0,0,0,72.91,69Z"/><path d="M27.09,65H38A59,59,0,0,1,39.2,55H30.39A22.88,22.88,0,0,0,27.09,65Z"/><path d="M40.23,83H33.5a23,23,0,0,0,9.22,5.81A28.05,28.05,0,0,1,40.23,83Z"/><path d="M40.23,51a28.05,28.05,0,0,1,2.49-5.81A23,23,0,0,0,33.5,51Z"/><path d="M50,90c1.78,0,3.94-2.51,5.56-7H44.44C46.06,87.49,48.22,90,50,90Z"/><path d="M43.27,79H56.73A52,52,0,0,0,58,69H42A52,52,0,0,0,43.27,79Z"/></svg>
   <!-- objects -->
   <svg id="objects" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="none" x="0px" y="0px" viewBox="0 0 100 125"><defs><g id="a"><path stroke="none" d=" M 36.6 10.05 L 34.85 10 Q 23.8 10 23.8 23.05 L 23.8 39.6 Q 23.8 44.95 20.1 45.7 L 19 46.25 19 53.5 19.45 53.6 Q 19.65 53.65 19.75 53.7 20 53.75 20.1 53.8 22.15 54.3 23 55.7 23.8 57.15 23.8 60.3 L 23.8 75.8 Q 23.8 83.15 26.55 86.6 29.35 90 35.3 89.95 L 38 89.95 38 82.9 35.9 82.9 Q 33.05 82.9 32.2 81.95 31.4 81 31.4 77.45 L 31.35 60.05 Q 31.35 56.45 30.55 54.4 29.8 52.4 27.6 50.15 L 29.35 48.35 30.5 46.2 31.2 43.55 31.35 24.45 Q 31.35 19.8 32.1 18.65 32.85 17.4 35.8 17.4 L 38 17.4 38 10.45 Q 37.55 10.05 36.6 10.05 M 81 53.8 L 81 46.55 80.6 46.45 Q 80.4 46.4 80.3 46.35 80.05 46.3 79.95 46.25 77.8 45.75 77 44.35 76.2 42.95 76.2 39.75 L 76.2 24.2 Q 76.2 16.85 73.45 13.45 70.7 10 64.75 10.1 L 62 10.1 62 17.1 64.15 17.1 Q 67 17.1 67.8 18.15 68.6 19.05 68.6 22.55 L 68.7 40 Q 68.7 43.35 69.45 45.65 70.3 47.65 72.45 49.95 70.3 51.75 69.5 53.9 68.7 55.9 68.7 59.8 L 68.7 75.6 Q 68.7 80.25 67.9 81.4 67.1 82.6 64.2 82.6 L 62 82.6 62 89.6 Q 62.5 89.95 63.35 89.95 L 65.1 90 Q 76.2 90 76.2 76.95 L 76.2 60.45 Q 76.2 55.1 79.95 54.4 L 81 53.8 Z"/></g></defs><g transform="matrix( 1, 0, 0, 1, 0,0) "><use xlink:href="#a"/></g></svg>
   <!-- process -->
   <svg id="process" xmlns="http://www.w3.org/2000/svg" data-name="Your Icon" viewBox="0 0 150 150" x="0px" y="0px" width="150px" height="150px" ><title>Gears</title><path d="M68.9,41.29a1.33,1.33,0,0,0-1.41-1l-5.32.48A16,16,0,0,0,59.32,38l.4-5.32a1.32,1.32,0,0,0-1-1.39L52,29.41a1.33,1.33,0,0,0-1.55.7l-2.38,4.83a15.26,15.26,0,0,0-3.91,1l-4.46-3a1.35,1.35,0,0,0-1.7.16L33.1,38.06a1.33,1.33,0,0,0-.16,1.69l3,4.47a15,15,0,0,0-1,4l-4.74,2.33a1.34,1.34,0,0,0-.71,1.55l1.8,6.6a1.35,1.35,0,0,0,1.39,1l5.25-.39a12.16,12.16,0,0,0,1.31,1.61,15,15,0,0,0,1.53,1.34l-.35,5.17a1.33,1.33,0,0,0,1,1.38L48,70.61a1.49,1.49,0,0,0,.36,0,1.35,1.35,0,0,0,1.19-.72L52,65.22a14.8,14.8,0,0,0,3.94-1l4.46,3A1.33,1.33,0,0,0,62.07,67L67,62.11a1.34,1.34,0,0,0,.17-1.7l-3-4.46a14.9,14.9,0,0,0,1-3.94l4.9-2.46A1.33,1.33,0,0,0,70.78,48ZM43.41,50a6.74,6.74,0,1,1,6.74,6.74A6.74,6.74,0,0,1,43.41,50Z"/><path d="M29.63,70.41A28.87,28.87,0,0,1,23,39.8l.36,1.57a2,2,0,0,0,1.95,1.55,2,2,0,0,0,.45-.05,2,2,0,0,0,1.5-2.4l-1.57-6.85a2,2,0,0,0-2.4-1.5l-6.85,1.57a2,2,0,0,0,.89,3.9L19.88,37A32.86,32.86,0,0,0,66.62,78.38l-2-3.45A28.87,28.87,0,0,1,29.63,70.41Z"/><path d="M82.63,62.4l-2.37.54A32.88,32.88,0,0,0,33.2,21.77l2.05,3.43A28.87,28.87,0,0,1,77,60.33l-.39-1.72a2,2,0,0,0-3.9.89l1.57,6.85a2,2,0,0,0,1.95,1.55,2,2,0,0,0,.45-.05l6.85-1.57a2,2,0,1,0-.89-3.9Z"/></svg>
   <!-- engine -->
   <svg id="engine" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M49.997,62.372c0.001,0,0.002,0,0.002,0c3.307,0,6.413-1.287,8.749-3.624c2.337-2.336,3.623-5.442,3.623-8.748  s-1.286-6.412-3.623-8.748c-2.336-2.337-5.442-3.624-8.748-3.624h-0.001c-3.305,0-6.411,1.287-8.747,3.624  c-2.337,2.336-3.624,5.442-3.625,8.748s1.286,6.413,3.623,8.75C43.586,61.086,46.691,62.372,49.997,62.372z M44.08,44.08  c1.581-1.581,3.684-2.452,5.919-2.452c2.237,0,4.34,0.871,5.921,2.452s2.451,3.683,2.451,5.92s-0.87,4.339-2.451,5.92  s-3.684,2.452-5.921,2.452c-0.001,0-0.001,0-0.002,0c-2.237,0-4.339-0.87-5.919-2.45c-1.581-1.581-2.452-3.684-2.451-5.921  S42.499,45.661,44.08,44.08z"/><path d="M61.376,35.796c-0.781,0.781-0.781,2.047,0,2.828c6.272,6.272,6.272,16.479,0,22.751  c-6.274,6.273-16.481,6.274-22.754,0.003c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828  c3.915,3.915,9.059,5.873,14.202,5.873c5.145,0,10.291-1.959,14.208-5.876c7.832-7.832,7.832-20.575,0-28.407  C63.423,35.015,62.157,35.015,61.376,35.796z"/><path d="M83.872,41.713l-7.568-0.002c-0.484-1.543-1.101-3.032-1.842-4.454l5.349-5.349c0.781-0.781,0.781-2.047,0-2.828  l-8.891-8.891c-0.781-0.781-2.047-0.781-2.828,0l-5.349,5.349c-1.423-0.742-2.914-1.358-4.456-1.842l-0.001-7.568  c0-0.53-0.211-1.039-0.586-1.414s-0.884-0.586-1.414-0.586L43.711,14.13c-1.104,0-2,0.896-2,2v7.566  c-1.541,0.483-3.031,1.099-4.454,1.841l-5.349-5.348c-0.781-0.781-2.047-0.781-2.828,0l-8.891,8.891  c-0.781,0.781-0.781,2.047,0,2.828l5.348,5.349c-0.744,1.426-1.36,2.916-1.843,4.454l-7.566,0.002c-1.104,0-2,0.896-2,2v12.574  c0,1.104,0.896,2,2,2l7.568,0.002c0.483,1.541,1.099,3.031,1.84,4.455l-5.347,5.348c-0.781,0.781-0.781,2.047,0,2.828l8.891,8.891  c0.781,0.781,2.047,0.781,2.828,0l5.348-5.347c1.427,0.743,2.917,1.359,4.457,1.842v7.566c0,1.104,0.896,2,2,2h12.573  c1.104,0,2-0.896,2-1.999l0.003-7.567c1.536-0.481,3.026-1.098,4.454-1.844l5.349,5.349c0.781,0.781,2.047,0.781,2.828,0  l8.891-8.891c0.781-0.781,0.781-2.047,0-2.828l-5.349-5.349c0.741-1.422,1.357-2.911,1.842-4.454l7.568-0.002c1.104,0,2-0.896,2-2  V43.713C85.872,42.608,84.977,41.713,83.872,41.713z M81.872,54.287l-7.08,0.002c-0.916,0-1.715,0.622-1.938,1.51  c-0.562,2.221-1.434,4.328-2.591,6.262c-0.471,0.787-0.347,1.793,0.302,2.441l5.004,5.004l-6.062,6.062l-5.004-5.004  c-0.647-0.647-1.653-0.773-2.44-0.303c-1.949,1.166-4.056,2.037-6.259,2.591c-0.89,0.223-1.514,1.021-1.514,1.938l-0.002,7.081  h-8.574v-7.078c0-0.916-0.622-1.715-1.511-1.939c-2.213-0.559-4.321-1.43-6.268-2.591c-0.788-0.469-1.791-0.345-2.438,0.304  l-5.002,5.001l-6.062-6.062l5.001-5.002c0.647-0.647,0.772-1.652,0.304-2.438c-1.157-1.94-2.028-4.049-2.59-6.267  c-0.224-0.888-1.022-1.51-1.938-1.51l-7.08-0.002v-8.574l7.08-0.002c0.917,0,1.716-0.623,1.939-1.513  c0.556-2.208,1.427-4.314,2.59-6.26c0.47-0.787,0.346-1.792-0.303-2.44l-5.003-5.004l6.062-6.062l5.003,5.003  c0.647,0.647,1.651,0.774,2.44,0.303c1.939-1.159,4.047-2.031,6.263-2.59c0.889-0.225,1.511-1.023,1.511-1.939V18.13l8.575-0.002  l0.001,7.081c0,0.916,0.622,1.715,1.511,1.939c2.219,0.56,4.326,1.431,6.264,2.59c0.787,0.471,1.793,0.347,2.44-0.303l5.004-5.004  l6.062,6.062l-5.004,5.004c-0.648,0.648-0.772,1.654-0.302,2.441c1.157,1.934,2.028,4.041,2.591,6.262  c0.224,0.888,1.022,1.51,1.938,1.51l7.08,0.002V54.287z"/></svg>
   <!-- browser-layout -->
   <svg id="browser-layout" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 96 120.00125" enable-background="new 0 0 96 96.001" xml:space="preserve">
    <g display="none">
        <g display="inline" opacity="0.2">
            <g>
                <path stroke="#EC2227" stroke-width="0.5" stroke-miterlimit="10" d="M24.959,77.043     c0,3.331-2.727,6.058-6.057,6.058h-72.885c-3.33,0-6.057-2.727-6.057-6.058V4.157c0-3.331,2.727-6.057,6.057-6.057h72.885     c3.33,0,6.057,2.726,6.057,6.057V77.043z"/>
                <path stroke="#EC2227" stroke-width="0.5" stroke-miterlimit="10" d="M-44.895,87.101     c-3.074,0-5.59-2.564-5.59-5.703V-0.198c0-3.136,2.516-5.701,5.59-5.701H9.645c3.074,0,5.588,2.565,5.588,5.701v81.596     c0,3.139-2.514,5.703-5.588,5.703H-44.895z"/>
                <path stroke="#EC2227" stroke-width="0.5" stroke-miterlimit="10" d="M-58.367,73.392     c-3.176,0-5.773-2.486-5.773-5.529V13.149c0-3.04,2.598-5.527,5.773-5.527H23.08c3.176,0,5.773,2.487,5.773,5.527v54.713     c0,3.043-2.598,5.529-5.773,5.529H-58.367z"/>
            </g>
            <circle stroke="#EC2227" stroke-width="0.5" stroke-miterlimit="10" cx="-17.634" cy="40.507" r="19.362"/>
            <path stroke="#EC2227" stroke-width="0.5" stroke-miterlimit="10" d="M28.865,40.507c0,25.68-20.82,46.5-46.498,46.5    c-25.682,0-46.5-20.82-46.5-46.5c0-25.683,20.818-46.5,46.5-46.5C8.045-5.993,28.865,14.824,28.865,40.507z"/>
            <line stroke="#EC2227" stroke-width="0.5" stroke-miterlimit="10" x1="-65.625" y1="-7.485" x2="30.357" y2="88.499"/>
            <line stroke="#EC2227" stroke-width="0.5" stroke-miterlimit="10" x1="30.357" y1="-7.485" x2="-65.625" y2="88.499"/>
        </g>
    </g>
    <g>
        <rect x="36.239" y="65.258" width="23.521" height="12.12" style="fill: var(--rect_bottom_color_fill); stroke: initial; stroke: var(--rect_bottom_color_stroke, red);" id="rect_bottom"/>
        <rect x="18.623" y="30.192" width="23.521" height="12.12" style="fill: var(--rect_top_left_color_fill); stroke:  var(--rect_top_left_color_stroke);" id="rect_top_left"/>
        <rect x="53.856" y="30.192" width="23.521" height="12.12" style="fill: var(--rect_top_right_color_fill); stroke:  var(--rect_top_right_color_stroke);" id="rect_top_right"/>
        <rect x="18.623" y="47.726" width="58.755" height="12.119" style="fill: var(--rect_center_color_fill); stroke:  var(--rect_center_color_stroke);" id="rect_center"/>
        <circle cx="23.02" cy="14.148" r="1.442"/>
        <circle cx="14.782" cy="14.148" r="1.442"/>
        <circle cx="31.257" cy="14.148" r="1.442"/>
        <!--<path fill="transparent" d="M83.296,24.274H12.705v59.021h70.591V24.274z M17.123,28.692h26.521v15.12H17.123V28.692z M61.261,78.878H34.739v-15.12   h26.521V78.878z M78.878,61.345H17.123V46.226h61.755V61.345z M78.878,43.813H52.356v-15.12h26.521V43.813z"/>-->
        <path  d="M80.813,6.251H15.183c-4.926,0-8.933,4.007-8.933,8.932v74.568h83.501V15.183C89.751,10.258,85.741,6.251,80.813,6.251z    M31.257,11.206c1.623,0,2.943,1.319,2.943,2.941c0,1.623-1.32,2.943-2.943,2.943c-1.622,0-2.941-1.32-2.941-2.943   C28.315,12.525,29.635,11.206,31.257,11.206z M23.02,11.206c1.622,0,2.942,1.319,2.942,2.941c0,1.623-1.32,2.943-2.942,2.943   s-2.942-1.32-2.942-2.943C20.077,12.525,21.397,11.206,23.02,11.206z M14.782,11.206c1.622,0,2.942,1.319,2.942,2.941   c0,1.623-1.32,2.943-2.942,2.943s-2.942-1.32-2.942-2.943C11.84,12.525,13.16,11.206,14.782,11.206z M84.796,84.796H11.205V22.774   h73.591V84.796z"/>
    </g>
    </svg>
    <!-- paint -->
    <svg id="paint" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 90 112.5" enable-background="new 0 0 90 90" xml:space="preserve"><path d="M52.495,52.365h-9.017c-0.722,0-1.342-0.515-1.475-1.225c-0.662-3.539-6.255-34.833,0.985-43.552  c1.334-1.607,3.016-2.422,4.999-2.422s3.664,0.815,4.998,2.422c7.239,8.718,1.646,40.013,0.984,43.552  C53.837,51.851,53.217,52.365,52.495,52.365z M52.097,43.767c1.589-11.422,2.943-29.008-1.419-34.261  c-0.759-0.913-1.613-1.338-2.69-1.338s-1.933,0.425-2.69,1.338c-4.351,5.239-3.004,22.835-1.42,34.261H52.097z M44.394,46.939  c0.115,0.723,0.229,1.8,0.338,2.426h6.51c0.108-0.622,0.222-1.707,0.337-2.426H44.394z M40.312,76.502  C40.312,76.502,40.312,76.502,40.312,76.502c-0.306,0-0.606-0.011-0.9-0.034c-0.661-0.051-1.21-0.529-1.35-1.177  c-0.141-0.648,0.161-1.312,0.741-1.632c1.958-1.081,1.735-3.574,1.17-7.255c-0.195-1.275-0.38-2.479-0.386-3.595  c-0.012-2.303,0.846-4.441,2.417-6.021c1.472-1.479,3.392-2.294,5.409-2.294c4.605,0,7.707,3.632,7.718,9.037  c0.007,3.048-1.219,5.889-3.542,8.217C48.706,74.636,44.28,76.502,40.312,76.502z M47.412,57.494c-1.212,0-2.377,0.501-3.282,1.41  c-1.004,1.009-1.552,2.391-1.544,3.89c0.005,0.895,0.173,1.992,0.352,3.155c0.341,2.225,0.764,4.981-0.041,7.24  c2.43-0.564,4.867-1.857,6.567-3.561c1.219-1.222,2.671-3.27,2.665-6.092C52.123,59.81,50.314,57.494,47.412,57.494z M50.847,83.881  c0.662-0.272,1.275-0.542,1.862-0.8c2.534-1.113,4.364-1.915,7.549-1.734c0.702,0.041,1.648,0.24,2.65,0.452  c2.721,0.572,5.805,1.223,7.963-0.285c1.085-0.757,1.75-1.937,1.977-3.507c0.304-2.104-0.953-4.372-3.363-6.067  c-3.146-2.212-8.848-3.718-14.565-0.682c-0.732,0.389-1.01,1.297-0.622,2.028c0.389,0.732,1.299,1.008,2.028,0.622  c4.518-2.398,8.983-1.238,11.434,0.484c1.423,1.001,2.255,2.252,2.12,3.186c-0.156,1.079-0.585,1.378-0.726,1.477  c-1.091,0.762-3.606,0.234-5.627-0.191c-1.115-0.235-2.168-0.457-3.095-0.511c-3.906-0.232-6.233,0.797-8.93,1.982  c-0.565,0.248-1.157,0.509-1.795,0.771c-3.762,1.542-6.897,0.573-10.915-0.963c-3.857-1.478-6.791-0.924-9.896-0.339  c-0.803,0.151-1.633,0.309-2.518,0.437c-2.558,0.366-4.657-0.384-5.609-2.012c-0.765-1.309-0.632-2.914,0.349-4.188  c2.107-2.738,7.198-3.314,13.616-1.542c0.798,0.22,1.625-0.247,1.846-1.046c0.221-0.798-0.248-1.624-1.046-1.845  c-11.009-3.046-15.412,0.806-16.794,2.604c-1.714,2.228-1.934,5.185-0.561,7.532c1.59,2.719,4.817,4.019,8.626,3.466  c0.929-0.134,1.803-0.298,2.646-0.457c2.907-0.549,5.204-0.981,8.267,0.192c2.771,1.061,5.396,1.94,8.163,1.94  C47.472,84.885,49.108,84.595,50.847,83.881z"/></svg>
    <!-- Worlet -->
    <svg id="worklet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 64 80" enable-background="new 0 0 64 64" xml:space="preserve"><g><g><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="40" y1="51" x2="38" y2="51"/><path fill="none" stroke-width="2" stroke-miterlimit="10" d="M36,51H15c-1.1,0-2-0.9-2-2V15c0-1.1,0.9-2,2-2h34    c1.1,0,2,0.9,2,2v34c0,1.1-0.9,2-2,2h-7"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="25" y1="17" x2="27" y2="17"/><path fill="none" stroke-width="2" stroke-miterlimit="10" d="M29,17h16c1.1,0,2,0.9,2,2v26c0,1.1-0.9,2-2,2H19    c-1.1,0-2-0.9-2-2V19c0-1.1,0.9-2,2-2h4"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="17" y1="10" x2="17" y2="2"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="27" y1="10" x2="27" y2="2"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="37" y1="10" x2="37" y2="2"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="47" y1="10" x2="47" y2="2"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="17" y1="62" x2="17" y2="54"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="27" y1="62" x2="27" y2="54"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="37" y1="62" x2="37" y2="54"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="47" y1="62" x2="47" y2="54"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="54" y1="17" x2="62" y2="17"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="54" y1="27" x2="62" y2="27"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="54" y1="37" x2="62" y2="37"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="54" y1="47" x2="62" y2="47"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="17" x2="10" y2="17"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="27" x2="10" y2="27"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="37" x2="10" y2="37"/><line fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="47" x2="10" y2="47"/><line fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" x1="17" y1="23" x2="33" y2="23"/><circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="35" cy="31" r="2"/><circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="23" cy="34" r="2"/><polyline fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" points="42,18 42,31     36,31   "/><polyline fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" points="17,28 29,28     29,38 39,38   "/><polyline fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" points="34,47 34,42     23,42 23,36   "/><rect x="39" y="36" fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" width="4" height="4"/><rect x="33" y="21" fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" width="4" height="4"/></g></g></svg>
    <!-- Layout -->
    <svg id="layout" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 640" enable-background="new 0 0 512 512" xml:space="preserve"><g><path d="M144.2,2H12.2C6.5,2,2,6.5,2,12.2v487.7c0,5.6,4.5,10.2,10.2,10.2h132.1c5.6,0,10.2-4.6,10.2-10.2V12.2   C154.4,6.5,149.9,2,144.2,2z"/><path d="M322,205.2H215.4c-5.6,0-10.2,4.5-10.2,10.2v284.5c0,5.6,4.5,10.2,10.2,10.2H322c5.6,0,10.2-4.6,10.2-10.2V215.4   C332.2,209.7,327.7,205.2,322,205.2z"/><path d="M499.8,205.2H393.2c-5.6,0-10.2,4.5-10.2,10.2v284.5c0,5.6,4.5,10.2,10.2,10.2h106.7c5.6,0,10.2-4.6,10.2-10.2V215.4   C510,209.7,505.5,205.2,499.8,205.2z"/><path d="M499.8,2H215.4c-5.6,0-10.2,4.5-10.2,10.2v132.1c0,5.6,4.5,10.2,10.2,10.2h284.5c5.6,0,10.2-4.6,10.2-10.2V12.2   C510,6.5,505.5,2,499.8,2z"/></g></svg>
    <!-- animation -->
    <svg id="animation" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><rect x="80.891" y="27.833" width="2.5" height="2.5"/><path d="M66.621,94.366l-0.258-2.486c1.569-0.162,3.101-0.551,4.549-1.153l0.961,2.309C70.199,93.731,68.432,94.18,66.621,94.366z    M61.21,94.142c-1.784-0.336-3.508-0.931-5.123-1.769l1.15-2.219c1.398,0.725,2.891,1.239,4.436,1.53L61.21,94.142z M76.521,90.247   l-1.584-1.934c1.221-1,2.287-2.166,3.17-3.467l2.068,1.404C79.157,87.751,77.928,89.096,76.521,90.247z M51.689,89.209   c-1.306-1.264-2.42-2.706-3.311-4.287l2.179-1.227c0.771,1.371,1.737,2.621,2.87,3.717L51.689,89.209z M13.583,85.568h-2.5v-5.075   h2.5V85.568z M82.534,81.373l-2.385-0.75c0.469-1.494,0.718-3.053,0.739-4.634l2.5,0.033   C83.364,77.847,83.076,79.646,82.534,81.373z M46.438,79.861c-0.299-1.337-0.451-2.715-0.451-4.098v-1.218h2.5v1.218   c0,1.199,0.131,2.395,0.39,3.553L46.438,79.861z M13.583,75.419h-2.5v-5.075h2.5V75.419z M83.391,70.932h-2.5v-5.075h2.5V70.932z    M48.487,69.472h-2.5v-5.075h2.5V69.472z M13.583,65.27h-2.5v-5.075h2.5V65.27z M83.391,60.782h-2.5v-5.075h2.5V60.782z    M48.487,59.322h-2.5v-5.075h2.5V59.322z M13.583,55.12h-2.5v-5.075h2.5V55.12z M83.391,50.632h-2.5v-5.075h2.5V50.632z    M48.487,49.172h-2.5v-5.075h2.5V49.172z M13.583,44.97h-2.5v-5.075h2.5V44.97z M83.391,40.483h-2.5v-5.075h2.5V40.483z    M48.487,39.023h-2.5v-5.075h2.5V39.023z M13.583,34.821h-2.5v-5.075h2.5V34.821z M48.487,28.874h-2.5v-2.588   c0-0.77-0.055-1.544-0.162-2.302l2.476-0.351c0.124,0.874,0.187,1.766,0.187,2.652V28.874z M13.651,24.788l-2.489-0.228   c0.166-1.813,0.594-3.584,1.273-5.268l2.318,0.936C14.166,21.685,13.795,23.219,13.651,24.788z M44.496,19.485   c-0.66-1.425-1.525-2.747-2.57-3.929l1.873-1.656c1.206,1.364,2.203,2.889,2.965,4.534L44.496,19.485z M17.123,16.177l-1.953-1.561   c1.134-1.419,2.465-2.664,3.957-3.7l1.427,2.053C19.26,13.868,18.106,14.947,17.123,16.177z M38.341,12.524   c-1.338-0.833-2.785-1.465-4.3-1.876l0.655-2.413c1.75,0.476,3.422,1.205,4.967,2.167L38.341,12.524z M24.754,10.879l-0.775-2.377   c1.721-0.562,3.517-0.869,5.339-0.913l0.062,2.499C27.8,10.127,26.244,10.393,24.754,10.879z"/><rect x="11.083" y="90.715" width="2.5" height="2.5"/></g><path d="M82.141,26.75c-5.836,0-10.583-4.748-10.583-10.583S76.305,5.584,82.141,5.584s10.583,4.748,10.583,10.583  S87.977,26.75,82.141,26.75z M82.141,8.084c-4.457,0-8.083,3.626-8.083,8.083s3.626,8.083,8.083,8.083s8.083-3.626,8.083-8.083  S86.598,8.084,82.141,8.084z"/><path d="M82.141,22.417c-3.446,0-6.25-2.804-6.25-6.25s2.804-6.25,6.25-6.25v2.5c-2.067,0-3.75,1.682-3.75,3.75  s1.683,3.75,3.75,3.75V22.417z"/></svg>
    <!-- Missing -->
    <svg id="missing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" x="0px" y="0px"><path d="m35.380859 65.757812v10.609376c0 1.097583-.646591 1.863972-1.447265 1.652343-.666347-.176124-1.5904-1.933035-3.978516-1.791015-2.388115.142019-3.615235 2.394105-3.615234 4.15039 0 1.756284 1.227119 4.006418 3.615234 4.148438 2.388116.14202 3.31217-1.61294 3.978516-1.789063.800677-.211628 1.447265.537174 1.447265 1.634766v10.625h29.240235v-10.669922c0-.19297-.230678-.245883-.34961-.146484-.184992.154607-.266119.221988-.636718.490234-.7412.536488-1.889276 1.078243-3.369141.990234-1.537773-.09144-2.773526-.901157-3.542969-1.917968-.769445-1.016821-1.142578-2.22224-1.142578-3.365235 0-1.143003.373133-2.350375 1.142578-3.367187.769443-1.016812 2.005196-1.826519 3.542969-1.917969 1.479865-.088 2.627941.453744 3.369141.990234.370599.268245.451726.333673.636718.488282.118932.0994.34961.048485.34961-.144532v-10.669922h-10.91211c-1.01844 0-1.713948.598831-1.517578 1.341797.16343.618314 1.791946 1.475417 1.660156 3.691407-.13177 2.21599-2.219969 3.355468-3.849609 3.355468-1.62965 0-3.719782-1.139478-3.851562-3.355468-.13178-2.21599 1.498689-3.073093 1.662109-3.691407.19637-.742966-.516716-1.341796-1.535156-1.341797z"/><path d="m19.621094 26.339844c-1.756283 0-4.006413 1.227116-4.148438 3.615234-.142024 2.388116 1.614894 3.312169 1.791016 3.978516.211627.800677-.539131 1.447265-1.636719 1.447265h-10.6249999v29.240235h10.6699219c.192959 0 .245885-.230677.146484-.34961-.154613-.184994-.22199-.266116-.490234-.636718-.536489-.741198-1.078248-1.889274-.990234-3.369141.09147-1.537773.901161-2.773524 1.917968-3.542969 1.016819-.769446 2.224195-1.140625 3.367188-1.140625 1.143004 0 2.348426.371179 3.365234 1.140625 1.016819.769445 1.826521 2.005196 1.917969 3.542969.088 1.479867-.45374 2.627943-.990234 3.369141-.268244.370602-.333652.451739-.488282.636718-.09943.118948-.048436.34961.144532.34961h10.669922v-10.91211c0-1.01844-.598831-1.713948-1.341797-1.517578-.618314.16343-1.475417 1.7939-3.691407 1.66211-2.21599-.13177-3.355468-2.221923-3.355468-3.851563 0-1.62965 1.139478-3.719782 3.355468-3.851562 2.21599-.13178 3.073093 1.498689 3.691407 1.662109.742966.19637 1.341796-.514763 1.341797-1.533203v-10.898438h-10.609376c-1.097576 0-1.863971-.646592-1.652343-1.447265.176121-.666348 1.933039-1.5904 1.791015-3.978516-.142013-2.388118-2.394108-3.615235-4.15039-3.615234z"/><path d="m19.622395 56.716559c-1.75627 0-4.007665 1.228998-4.149689 3.617114-.142013 2.388118 1.614398 3.311374 1.79052 3.977718.211627.800677-.537593 1.446567-1.635181 1.446567h-10.6252623v29.242042h29.2420113v-10.671042c0-.192969-.230566-.245032-.349503-.145629-.184989.154604-.267384.221343-.637986.489587-.741204.536493-1.888992 1.078276-3.368857.99027-1.537766-.09144-2.772769-.901312-3.542216-1.918127-.769439-1.016814-1.142827-2.223081-1.142827-3.366079 0-1.143002.373388-2.349265 1.142827-3.366081.769447-1.016815 2.00445-1.826679 3.542216-1.918126 1.479865-.088 2.627653.453778 3.368857.990271.370602.268243.452996.334982.637986.489585.118936.0994.349503.04734.349503-.145626v-10.671045h-10.610013c-1.097577 0-1.864849-.645894-1.653216-1.446567.176128-.666349 1.933942-1.5896 1.791906-3.977718-.142013-2.388116-2.394793-3.617114-4.151076-3.617114z"/><path d="m5 5.0025867v29.2420413h10.671042c.192958 0 .245019-.230567.145617-.349506-.1546-.184986-.221338-.267388-.489582-.637988-.536489-.7412-1.078274-1.888988-.99026-3.368855.09146-1.537773.9013-2.772769 1.918126-3.542219 1.016812-.769439 2.223074-1.142832 3.366067-1.142832 1.143004 0 2.349271.373386 3.366079 1.142832 1.016819.769443 1.826679 2.004446 1.918126 3.542219.08801 1.479867-.453771 2.627655-.990272 3.368855-.268245.3706-.334964.453015-.489582.637988-.09943.118952-.04732.349506.145629.349506h10.671034v-10.610018c0-1.097578.645894-1.864848 1.446569-1.653219.666347.176127 1.589598 1.933933 3.977713 1.791913 2.388115-.142021 3.617113-2.394801 3.617113-4.151082 0-1.756283-1.228998-4.007675-3.617113-4.149697-2.388115-.142013-3.311367 1.614401-3.977713 1.790526-.800676.21163-1.446569-.537603-1.446569-1.63519v-10.6252743z" overflow="visible"/><path d="m65.757812 65.754747v10.611023c0 1.09758-.64659 1.863925-1.447265 1.652296-.666348-.176125-1.588447-1.93494-3.976563-1.792917-2.388115.142021-3.617187 2.395942-3.617187 4.152224 0 1.756281 1.229072 4.008249 3.617187 4.150272 2.388116.142014 3.310216-1.614844 3.976563-1.790965.800676-.211631 1.447265.537132 1.447265 1.634719v10.626648h29.242188l-.002-29.2433h-10.669922c-.19297 0-.245886.228712-.146484.347646.154608.184986.221994.268054.490234.638653.53649.741199 1.078212 1.889186.990234 3.369044-.09142 1.537775-.901158 2.771477-1.917968 3.540915-1.01682.769448-2.222235 1.144498-3.365235 1.144498-1.143 0-2.350377-.37505-3.367187-1.144498-1.01681-.769438-1.826519-2.003139-1.917969-3.540915-.088-1.479857.453738-2.627842.990234-3.369044.268244-.370596.335627-.453666.490235-.638653.0994-.118934.0484-.347646-.144531-.347646z" overflow="visible"/><path d="m35.376953 5.0019531v10.6699219c0 .192969.230677.245883.349609.146484.184993-.154608.268073-.221988.638672-.490234.7412-.536489 1.889271-1.078242 3.369141-.990234 1.53777.09144 2.773529.901157 3.542969 1.917968.76945 1.016821 1.140625 2.222239 1.140625 3.365235 0 1.143003-.371175 2.350375-1.140625 3.367187-.76944 1.016812-2.005199 1.826519-3.542969 1.917969-1.47987.088-2.627941-.453744-3.369141-.990234-.370599-.268245-.453679-.333673-.638672-.488282-.118932-.0994-.349609-.048485-.349609.144532v10.669922h10.898438c1.01844 0 1.731526-.598831 1.535156-1.341797-.16342-.618314-1.793889-1.475417-1.662109-3.691407.131779-2.21599 2.221912-3.355468 3.851562-3.355468 1.62964 0 3.717839 1.139478 3.849609 3.355468.13179 2.21599-1.496726 3.073093-1.660156 3.691407-.19637.742966.499138 1.341797 1.517578 1.341797h10.91211v-10.609376c0-1.097584.644632-1.863972 1.445312-1.652343.66634.176124 1.592359 1.933035 3.980469 1.791015 2.38812-.14202 3.615234-2.394105 3.615234-4.15039 0-1.756284-1.227114-4.006418-3.615234-4.148438-2.38811-.14202-3.314129 1.61294-3.980469 1.789063-.80068.211629-1.445312-.537173-1.445312-1.634766v-10.6249999z"/><path d="m65.755859 35.378906v10.896485c0 1.01844.600784 1.731526 1.34375 1.535156.618314-.16342 1.475417-1.793889 3.691407-1.662109 2.21599.131779 3.355468 2.221912 3.355468 3.851562 0 1.62964-1.139478 3.717839-3.355468 3.849609-2.21599.13179-3.073093-1.496726-3.691407-1.660156-.742966-.19637-1.34375.499138-1.34375 1.517578v10.91211h10.609375c1.09758 0 1.865927.646592 1.654297 1.447265-.17612.666347-1.934989 1.5904-1.792969 3.978516.142021 2.388118 2.396064 3.615235 4.152344 3.615234 1.75629 0 4.006408-1.227116 4.148438-3.615234.14202-2.388116-1.614896-3.31217-1.791016-3.978516-.21162-.800677.539129-1.447265 1.636719-1.447265h10.625v-29.240235h-10.671875c-.19296 0-.243931.230678-.144531.34961.15461.184994.221994.266117.490234.636718.53649.741199 1.078267 1.889276.990234 3.369141-.09148 1.537775-.901168 2.773524-1.917968 3.542969-1.01682.769446-2.224198 1.140625-3.367188 1.140625-1.143 0-2.348424-.371179-3.365234-1.140625-1.01682-.769445-1.826519-2.005195-1.917969-3.542969-.088-1.479866.453739-2.627938.990234-3.369141.268245-.370597.333672-.451724.488282-.636718.0994-.118932.046535-.34961-.146485-.34961z"/><path d="m80.376963 43.28344c1.75627 0 4.00767-1.228997 4.14969-3.617114.14202-2.388117-1.614402-3.311372-1.79052-3.977717-.211622-.800676.5376-1.446568 1.63519-1.446568h10.62526v-29.242041h-29.24201v10.671042c0 .192969.23056.245032.3495.145629.18499-.154605.26738-.221343.63798-.489587.74121-.536494 1.889-1.078276 3.36886-.990271 1.53777.09144 2.77277.901313 3.54222 1.918127.76944 1.016815 1.14282 2.223081 1.14282 3.36608 0 1.143002-.37338 2.349265-1.14282 3.366081-.76945 1.016815-2.00445 1.826678-3.54222 1.918126-1.47986.088-2.62765-.453778-3.36886-.990271-.3706-.268243-.452988-.334983-.63798-.489585-.118938-.0994-.3495-.04734-.3495.145626v10.671044h10.61001c1.09758 0 1.864852.645897 1.65322 1.446568-.176128.666351-1.933935 1.589599-1.79191 3.977717.142025 2.388116 2.39479 3.617114 4.15107 3.617114z"/></svg>
    <!-- Parser -->
    <svg id="parser" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve"><path d="M92.5,5h-85C6.1,5,5,6.1,5,7.5v20C5,28.9,6.1,30,7.5,30H40v10H30c-2.2,0-3.3,2.7-1.8,4.3l20,20c1,1,2.6,1,3.5,0l20-20  c1.5-1.5,0.4-4.3-1.8-4.3H60V30h32.5c1.4,0,2.5-1.1,2.5-2.5v-20C95,6.1,93.9,5,92.5,5z M90,25H57.5c-1.4,0-2.5,1.1-2.5,2.5v15  c0,1.4,1.1,2.5,2.5,2.5H64L50,59L36,45h6.5c1.4,0,2.5-1.1,2.5-2.5v-15c0-1.4-1.1-2.5-2.5-2.5H10V10h80V25z"/><path d="M40,95h20c1.4,0,2.5-1.1,2.5-2.5v-20c0-1.4-1.1-2.5-2.5-2.5H40c-1.4,0-2.5,1.1-2.5,2.5v20C37.5,93.9,38.6,95,40,95z   M42.5,75h15v15h-15V75z"/><path d="M7.5,95h20c1.4,0,2.5-1.1,2.5-2.5v-20c0-1.4-1.1-2.5-2.5-2.5h-20C6.1,70,5,71.1,5,72.5v20C5,93.9,6.1,95,7.5,95z M10,75h15  v15H10V75z"/><path d="M92.5,70h-20c-1.4,0-2.5,1.1-2.5,2.5v20c0,1.4,1.1,2.5,2.5,2.5h20c1.4,0,2.5-1.1,2.5-2.5v-20C95,71.1,93.9,70,92.5,70z   M90,90H75V75h15V90z"/></svg>
    <!-- box-tree -->
    <svg id="box-tree" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M90.2,75h-4.6L71.1,60h1.6c2.7,0,4.8-2.2,4.8-4.8V44.8c0-2.7-2.2-4.8-4.8-4.8h-4.6L53.6,25h1.6c2.7,0,4.8-2.2,4.8-4.8V9.8  C60,7.2,57.8,5,55.2,5H44.8C42.2,5,40,7.2,40,9.8v10.4c0,2.7,2.2,4.8,4.8,4.8h1.6L31.9,40h-4.6c-2.7,0-4.8,2.2-4.8,4.8v10.4  c0,2.7,2.2,4.8,4.8,4.8h1.6L14.4,75H9.8C7.2,75,5,77.2,5,79.8v10.4C5,92.8,7.2,95,9.8,95h10.4c2.7,0,4.8-2.2,4.8-4.8V79.8  c0-2.7-2.2-4.8-4.8-4.8h-1.6l13.9-14.3L46.4,75h-1.6c-2.7,0-4.8,2.2-4.8,4.8v10.4c0,2.7,2.2,4.8,4.8,4.8h10.4c2.7,0,4.8-2.2,4.8-4.8  V79.8c0-2.7-2.2-4.8-4.8-4.8h-4.6L36.1,60h1.6c2.7,0,4.8-2.2,4.8-4.8V44.8c0-2.7-2.2-4.8-4.8-4.8h-1.6L50,25.6L63.9,40h-1.6  c-2.7,0-4.8,2.2-4.8,4.8v10.4c0,2.7,2.2,4.8,4.8,4.8h4.6l14.6,15h-1.6c-2.7,0-4.8,2.2-4.8,4.8v10.4c0,2.7,2.2,4.8,4.8,4.8h10.4  c2.7,0,4.8-2.2,4.8-4.8V79.8C95,77.2,92.8,75,90.2,75z M22,79.8v10.4c0,1-0.8,1.8-1.8,1.8H9.8c-1,0-1.8-0.8-1.8-1.8V79.8  c0-1,0.8-1.8,1.8-1.8h10.4C21.2,78,22,78.8,22,79.8z M57,79.8v10.4c0,1-0.8,1.8-1.8,1.8H44.8c-1,0-1.8-0.8-1.8-1.8V79.8  c0-1,0.8-1.8,1.8-1.8h10.4C56.2,78,57,78.8,57,79.8z M39.5,44.8v10.4c0,1-0.8,1.8-1.8,1.8H27.3c-1,0-1.8-0.8-1.8-1.8V44.8  c0-1,0.8-1.8,1.8-1.8h10.4C38.7,43,39.5,43.8,39.5,44.8z M43,20.2V9.8c0-1,0.8-1.8,1.8-1.8h10.4c1,0,1.8,0.8,1.8,1.8v10.4  c0,1-0.8,1.8-1.8,1.8H44.8C43.8,22,43,21.2,43,20.2z M60.5,55.2V44.8c0-1,0.8-1.8,1.8-1.8h10.4c1,0,1.8,0.8,1.8,1.8v10.4  c0,1-0.8,1.8-1.8,1.8H62.3C61.3,57,60.5,56.2,60.5,55.2z M92,90.2c0,1-0.8,1.8-1.8,1.8H79.8c-1,0-1.8-0.8-1.8-1.8V79.8  c0-1,0.8-1.8,1.8-1.8h10.4c1,0,1.8,0.8,1.8,1.8V90.2z"/></svg>
    <!-- font-metrics -->
    <svg id="font-metrics" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 64 80" enable-background="new 0 0 64 64" xml:space="preserve"><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds y="-8160" x="-8165" width="16389" height="16384" bottomLeftOrigin="true"/></sfw></metadata><g><g><path d="M36,12H12c-1.104,0-2,0.896-2,2v4c0,1.104,0.896,2,2,2s2-0.896,2-2v-2h8v32h-2c-1.104,0-2,0.896-2,2s0.896,2,2,2h8    c1.104,0,2-0.896,2-2s-0.896-2-2-2h-2V16h8v2c0,1.104,0.896,2,2,2s2-0.896,2-2v-4C38,12.896,37.104,12,36,12z"/><path d="M50.586,44.586L50,45.172V18.828l0.586,0.586C50.977,19.805,51.488,20,52,20s1.023-0.195,1.414-0.586    c0.781-0.781,0.781-2.047,0-2.828l-4-4c-0.781-0.781-2.047-0.781-2.828,0l-4,4c-0.781,0.781-0.781,2.047,0,2.828    c0.781,0.781,2.047,0.781,2.828,0L46,18.828v26.344l-0.586-0.586c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828l4,4    C46.977,51.805,47.488,52,48,52s1.023-0.195,1.414-0.586l4-4c0.781-0.781,0.781-2.047,0-2.828S51.367,43.805,50.586,44.586z"/></g></g></svg>
    <!-- can i use -->
    <svg id="can-i-use" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 388 286.65625" style="enable-background:new 0 0 388 229.325;" xml:space="preserve"><g><path d="M383.391,205.293v-0.002l-0.009,0.007c-0.462,0.269-6.957,4.021-19.633,4.025c-6.44,0.016-13.257-2.096-20.342-4.357   c-7.085-2.238-14.433-4.627-22.157-4.643c-7.727,0.016-15.076,2.404-22.16,4.643c-7.082,2.262-13.902,4.373-20.342,4.357   c-6.44,0.016-13.257-2.096-20.339-4.357c-7.084-2.238-14.434-4.627-22.16-4.643c-7.727,0.016-15.075,2.404-22.158,4.643   c-7.084,2.262-13.902,4.373-20.342,4.357c-6.44,0.016-13.26-2.096-20.342-4.357c-3.37-1.064-6.802-2.156-10.303-3.018v-3.805   c2.78,0.736,5.609,1.621,8.485,2.538c7.085,2.24,14.434,4.628,22.16,4.644c7.724-0.016,15.073-2.403,22.158-4.644   c7.083-2.26,13.901-4.372,20.342-4.356c6.439-0.016,13.257,2.097,20.34,4.356c7.085,2.24,14.434,4.628,22.16,4.644   c7.724-0.016,15.073-2.403,22.158-4.644c7.082-2.26,13.901-4.372,20.342-4.356c6.439-0.016,13.257,2.097,20.34,4.356   c7.085,2.24,14.434,4.628,22.16,4.644c0.006,0,0.014,0,0.021,0c14.798,0,22.465-4.726,22.837-4.968   c1.398-0.889,1.812-2.743,0.923-4.141c-0.889-1.399-2.741-1.813-4.141-0.925l-0.009,0.006c-0.461,0.269-6.955,4.021-19.631,4.025   c-6.441,0.016-13.26-2.097-20.342-4.358c-7.085-2.238-14.434-4.626-22.158-4.642c-7.726,0.016-15.075,2.403-22.16,4.642   c-7.083,2.262-13.901,4.374-20.34,4.358c-6.441,0.016-13.26-2.097-20.342-4.358c-7.085-2.238-14.434-4.626-22.158-4.642   c-7.726,0.016-15.075,2.403-22.16,4.642c-7.083,2.262-13.901,4.374-20.34,4.358c-6.441,0.016-13.26-2.097-20.342-4.358   c-3.37-1.064-6.802-2.155-10.303-3.017v-6.551V122.97H40v43.928H0v62.427h163.105v-21.182c2.781,0.736,5.61,1.621,8.485,2.54   c7.084,2.238,14.434,4.627,22.16,4.642c7.724-0.015,15.073-2.403,22.158-4.642c7.084-2.263,13.902-4.373,20.342-4.358   c6.44-0.015,13.257,2.096,20.342,4.358c7.084,2.238,14.433,4.627,22.157,4.642c7.727-0.015,15.076-2.403,22.16-4.642   c7.082-2.263,13.902-4.373,20.342-4.358c6.44-0.015,13.257,2.096,20.339,4.358c7.085,2.238,14.434,4.627,22.16,4.642   c0.006,0,0.014,0,0.021,0c14.798,0,22.467-4.727,22.838-4.967c1.399-0.89,1.813-2.744,0.924-4.142   C386.643,204.816,384.79,204.403,383.391,205.293z"/><g><ellipse transform="matrix(0.6318 -0.7751 0.7751 0.6318 34.4356 178.8613)" cx="205.497" cy="53.182" rx="22.496" ry="22.493"/><path d="M160.501,34.823c1.303,0,2.581,0.251,3.794,0.75c5.102,2.093,7.548,7.946,5.457,13.047l-0.049,0.133    c-0.075,0.181-0.163,0.417-0.284,0.734c-0.247,0.668-0.623,1.714-1.082,3.111c-0.699,2.113-1.696,5.344-2.779,9.488    c3.966-0.289,7.511-1.837,9.723-4.875c5.177-7.114,5.22-24.179-6.46-34.341c-16.143-13.882-28.76-18.967-49.02-22.26    C103.705-2.535,98.03,7.073,94.695,15.61c-0.253,0.647-0.487,1.267-0.704,1.867c-0.246,0.584-0.451,1.182-0.604,1.793    c-0.986,3.229-1.103,5.74,0.612,7.943c0.341,0.802,0.767,1.58,1.289,2.32c0.08,0.116,0.731,1.071,1.707,2.835    c3.152,5.669,9.28,19.177,9.259,37.025c-0.008,9.946-1.836,21.293-7.216,33.884c-2.716,6.348,0.228,13.695,6.575,16.411    c1.604,0.686,3.271,1.012,4.913,1.012c4.852,0,9.468-2.843,11.499-7.586h-0.002c6.748-15.752,9.24-30.655,9.233-43.721    c-0.003-13.05-2.441-24.239-5.363-32.991c9.662,3.659,15.803,9.813,21.258,17.209c2.167-7.742,3.918-12.136,4.096-12.574    C152.794,37.258,156.427,34.823,160.501,34.823z"/><path d="M148.045,120.246c0.11,0.005,0.219,0.007,0.328,0.007c4.27,0,7.814-3.375,7.985-7.681    c0.813-20.367,3.759-36.701,6.475-47.868c0.217-0.894,0.432-1.742,0.646-2.569c1.119-4.339,2.164-7.762,2.957-10.16    c0.472-1.429,0.856-2.497,1.111-3.188c0.129-0.345,0.226-0.599,0.288-0.75c0.06-0.157,0.069-0.174,0.066-0.174    c1.678-4.089-0.276-8.762-4.363-10.439c-4.087-1.676-8.761,0.276-10.437,4.365c-0.109,0.27-2.086,5.135-4.462,13.89    c-3.257,11.999-7.267,31.317-8.266,56.256C140.195,116.347,143.63,120.07,148.045,120.246z"/></g></g></svg>
    <!-- Finish -->
    <svg id="finish" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 373.06899 618.2425" version="1.1" x="0px" y="0px"><g transform="translate(-240.79302,-371.6545)"><path style="" d="m 427.28732,371.65452 a 51.491407,51.491407 0 0 0 -51.4587,51.459 51.491407,51.491407 0 0 0 51.4587,51.538 51.491407,51.491407 0 0 0 51.538,-51.538 51.491407,51.491407 0 0 0 -51.538,-51.459 z m -120.7962,0.245 c -2.4945,0.385 -4.9937,1.261 -7.2823,2.669 -9.1133,5.634 -11.9448,17.507 -6.3101,26.62 l 82.9299,134.712 0,66.021 10.762,-1.78 c 27.0085,-4.515 54.3837,-4.515 81.3934,0 l 10.8413,1.78 0,-66.102 82.931,-134.631 c 5.6336,-9.113 2.7606,-20.986 -6.31,-26.62 -9.1559,-5.592 -21.1077,-2.803 -26.6999,6.312 l -70.8762,115.132 -61.0049,0 -70.9567,-115.132 c -4.2248,-6.866 -11.9365,-10.137 -19.4175,-8.981 z m 120.7962,231.316 c -13.2458,0 -26.4538,1.123 -39.5648,3.318 l -146.9295,24.758 0,21.037 146.9295,-24.84 c 26.222,-4.39 52.9869,-4.39 79.2089,0 l 146.9306,24.84 0,-21.037 -146.9306,-24.758 c -13.1099,-2.195 -26.3983,-3.318 -39.6441,-3.318 z m 0,27.429 c -12.878,0 -25.7335,1.102 -38.5133,3.236 l -12.9454,2.184 0,35.439 c 0,0.03 0,0.12 0,0.159 l 0,170.637 c 0,13.173 10.6957,23.949 23.8682,23.949 13.1737,0 23.8683,-10.735 23.8683,-23.949 l 0,-158.581 7.5248,0 0,60.52 c 0,13.173 10.6946,23.867 23.8671,23.867 13.1737,0 23.8683,-10.694 23.8683,-23.867 l 0,-72.576 0,-0.08 0,-35.518 -12.9454,-2.183 c -12.8,-2.134 -25.7146,-3.238 -38.5926,-3.238 z" /></g></svg>
    <!-- factory -->
    <svg id="factory" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 640" enable-background="new 0 0 512 512" xml:space="preserve"><g><path d="M506.7,244.2c-2.1-1.5-4.7-1.9-7.2-1.1l-61,20.5L410.1,9.1c-0.4-4-3.8-7.1-7.9-7.1h-75.6c-4,0-7.4,3-7.9,7.1l-27.9,249.7   l-70.2,21.4L198.7,83.9c-0.4-4-3.8-7.1-7.9-7.1h-57c-4,0-7.4,3-7.9,7.1l-20.4,182.8L7.2,302.8C4.1,304,2,306.9,2,310.3v191.8   c0,4.4,3.6,7.9,7.9,7.9h492.1c4.4,0,7.9-3.6,7.9-7.9V250.6C510,248,508.8,245.6,506.7,244.2z M395.1,17.9l3.8,34.2h-69.1l3.8-34.2   H395.1z M307.4,253.7L328.1,68h72.6l22.4,200.7l-70.2,23.5v-41.6c0-2.5-1.2-4.9-3.2-6.4c-0.9-0.7-1.9-1-3-1.3   c-0.3-0.1-0.5-0.1-0.8-0.1c-0.3,0-0.6-0.1-0.9-0.1c-0.8,0-1.6,0.1-2.3,0.3L307.4,253.7z M183.7,92.7l2.4,21.9h-47.7l2.4-21.9H183.7   z M136.7,130.4h51.2l17.2,154.4l-25.2,7.7v-41.9c0-2.6-1.3-5-3.4-6.5c-0.6-0.4-1.3-0.7-2-1c-0.2-0.1-0.4-0.1-0.6-0.2   c-0.5-0.1-1-0.2-1.6-0.2c-0.1,0-0.2-0.1-0.4-0.1c-0.1,0-0.2,0-0.3,0.1c-0.8,0-1.7,0.1-2.5,0.4l-47.1,17.3L136.7,130.4z    M494.1,494.1H17.9V315.8L164.1,262v41.3c0,2.5,1.2,4.9,3.2,6.4c0.9,0.7,1.9,1,3,1.3c0.3,0.1,0.5,0.1,0.8,0.1   c0.3,0,0.6,0.1,0.9,0.1c0.8,0,1.6-0.1,2.3-0.3L337,261.3v42c0,2.6,1.2,5,3.3,6.4c0.6,0.4,1.3,0.8,2,1c0.2,0.1,0.5,0.1,0.7,0.2   c0.5,0.1,1,0.2,1.5,0.2c0.2,0,0.3,0.1,0.5,0.1c0.1,0,0.2,0,0.3,0c0.7,0,1.5-0.1,2.2-0.4c0,0,0,0,0,0l146.6-49.2V494.1z"/><path d="M146.2,385.7H64.3c-4.4,0-7.9,3.6-7.9,7.9v57.4c0,4.4,3.5,7.9,7.9,7.9h81.8c4.4,0,7.9-3.6,7.9-7.9v-57.4   C154.1,389.2,150.5,385.7,146.2,385.7z M138.2,443.1h-66v-41.6h66V443.1z"/><path d="M296.9,385.7h-81.8c-4.4,0-7.9,3.6-7.9,7.9v57.4c0,4.4,3.6,7.9,7.9,7.9h81.8c4.4,0,7.9-3.6,7.9-7.9v-57.4   C304.8,389.2,301.3,385.7,296.9,385.7z M289,443.1h-66v-41.6h66V443.1z"/><path d="M365.8,385.7c-4.4,0-7.9,3.6-7.9,7.9v57.4c0,4.4,3.6,7.9,7.9,7.9h81.8c4.4,0,7.9-3.6,7.9-7.9v-57.4c0-4.4-3.6-7.9-7.9-7.9   H365.8z M439.7,443.1h-66v-41.6h66V443.1z"/></g></svg>
</div>