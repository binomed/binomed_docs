<!-- .slide: class="transition text-white cadre" -->

# JS in CSS, yes we can 🤔

## jefBinomed @ #SfeirLunch


##==##

<!-- .slide:  -->

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

<!-- .slide: class="transition text-white cadre" -->

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
--myvar: 🤘; 
--myvar2: () => {console.log('🤘')};
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


Credits

tracking by balyanbinmalkan / Engine by ibrandify from the Noun Project