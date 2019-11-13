<!-- .slide: class="transition text-white cadre" -->

# JS in CSS, yes we can 🤔

## jefBinomed @ #SfeirLunch


##==##

<!-- .slide:  -->

<div id="demo-var" class="flex-hori">
    <div id="codemirror-css">
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
--myvar2: console.log('🤘');
/* Valid Css 🤘*/
```

 ##==##

 <!-- .slide: class="with-code big-code" data-state="code-myvar stop-code-url" -->
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

<!-- .slide: class="with-code" data-state="stop-code-myvar code-url" -->

## Prolbème

```css
--prefix: 'http://monsite.com/';
--img: 'img.jpg';
background-url: url(var(--prefix)var(--img));
/* url = url(⎵http://monsite.com/⎵img.jpg⎵) => ❌ */
```

<mask-highlighter id="highlight-url"></mask-highlighter>


<div class="fragment" data-fragment-index="1" hidden></div>
<div class="fragment" data-fragment-index="2" hidden></div>
