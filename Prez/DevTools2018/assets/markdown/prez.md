

<!-- .slide: class="first-slide"  data-state="first"-->


# What's new in Devtools
### 2018  @ **SnowCamp**

![logo](assets/images/devtools.jpg)


##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

### Jean-François Garreau

<!-- .element: class="descjf" -->
Front-end developer & Community Manager

![avatar w-300 wp-200](assets/images/jf.jpg)


![company_logo](assets/images/lucca_logo.png)
![gdg_logo](assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](https://twitter.com/jefBinomed)



##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->


<h1>
    <svg class="h-150 color-blue">
        <use xlink:href="#config" />
    </svg><br>Config / Activation
</h1>


##==##

# Activation des experiments

<br>

![center w-700](./assets/images/activation.png)

[chrome://flags/#enable-devtools-experiments](chrome://flags/#enable-devtools-experiments)

##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->


<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#helper" />
    </svg><br>Helpers
</h1>

##==##

<!-- .slide: class="transition"  -->

# Unified menu


<h1>CTRL(CMD) + SHIFT + P<h1>


##==##

# screenshots

![center h-500](./assets/images/screenshot_nexus_5x.png)

##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->

![center h-500](./assets/images/css_awesome.png)

##==##

# Grid Layout CSS

<div class="demo-grid">
    <header>header</header>
    <nav>nav</nav>
    <article>article</article>
    <footer>footer</footer>
    <div class="white-text">Non accessible text</div>
</div>

##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->

<h1>
    <svg class="h-150 color-red">
        <use xlink:href="#stats" />
    </svg><br>Performances & css coverage
</h1>


##==##

<!-- .slide: data-background="./assets/images/devfestdraw.png" -->


##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#terminal" />
    </svg><br>Logs
</h1>

##==##

<!-- .slide: class="with-code" data-state="console" data-background="#3f3f3f" -->

## Timer

```javascript
console.time('timerSample');
this.longTimeMethod().then(_ => {
    console.timeEnd('timerSample');
});
```


##==##

<!-- .slide: class="with-code" data-state="profile" data-background="#3f3f3f" -->

## Profiler

```javascript
console.profile('profileSample');
this.longTimeMethod().then(_ => {
    console.profileEnd('profileSample');
});
```

##==##

<!-- .slide: class="with-code" data-state="table" data-background="#3f3f3f"-->

## Table

```javascript
console.table([{a:1, b:2, c:3}, {a:"foo", b:false, c:undefined}]);
console.table([[1,2,3], [2,3,4]]);

function Person(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
}
console.table({
    mother: new Person("Susan", "Doyle", 32),
    father: new Person("John", "Doyle", 33),
    daughter: new Person("Lily", "Doyle", 5),
    }, ["firstName", "lastName", "age"]);
```

##==##

<!-- .slide: class="with-code" data-state="group" data-background="#3f3f3f"-->

## Group

```javascript
console.group('A group label');
console.log('a log under the group');
console.info('a second log');
console.groupEnd()
```

##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->

<h1>
    <svg class="h-150 color-red">
        <use xlink:href="#debug" />
    </svg><br>Debug Javascript
</h1>



##==##

<!-- .slide: class="with-code" data-state="inline" data-background="#3f3f3f"-->

## Break point inline

```javascript
console.table([
{first: 'John', last: 'Doe', age: 25},
{first: 'Jane', last: 'Doe', age: 25},
{first: 'Jean-François', last: 'Garreau', age: 34},
{first: 'Julien', last: 'Landure', age: 34}])
.filter((person) => person.age > 30)
.map((person) => {
    return{ name: `${person.firstName} ${person.lastName}`}
});
```



##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->



<h1>
    <div id="demo-click" >Click Me !</div>
</h1>


##==##

<!-- .slide: data-state="ghost"-->

<div id="demo-ghost-parent">
    <div class="demo-ghost"></div>
    <div class="demo-shadow"></div>
</div>


##==##

<!-- .slide: class="last-slide" -->

<!-- .element: class="thank-message" --> Merci

<!-- .element: class="presenter" --> **Jean-François Garreau  **

<!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur Lucca

<!-- .element: class="email" --> **@jefbinomed**

<div class="credits">
    <h4 >Crédits : <a href="https://thenounproject.com/" target="_blank">The noun project</a></h4>
    <p >Dinosoft Labs / Lemon Liu / Souvik Maity / Gonzalo Bravo / Miguel C Balandrano</p>
</div>

<div style="display:none">
    <!-- stats -->
    <svg id="stats" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 52 65" enable-background="new 0 0 52 52" xml:space="preserve"><g><g><g><path fill="none"  stroke-width="2" stroke-miterlimit="10" d="M6.6890597,14.049015     c6.3503995-10.6536999,20.2696991-14.2212,31.0895958-7.9683003c9.6343994,5.5679002,13.5627022,17.044899,9.8244019,27.0145988"/><polyline fill="none"  stroke-width="2" stroke-miterlimit="10" points="16.6390591,12.1095152      6.6866598,14.0467148 4.7191596,4.2472148    "/></g><g><path fill="none"  stroke-width="2" stroke-miterlimit="10" d="M45.311058,37.9510155     c-6.3506012,10.653698-20.2698994,14.221199-31.089798,7.9682007     C4.5868597,40.3513145,0.6585596,28.8743153,4.3970594,18.9046154"/><polyline fill="none"  stroke-width="2" stroke-miterlimit="10" points="35.3608551,39.8905144      45.3132553,37.9532166 47.2807579,47.7527161    "/></g></g><g><rect x="31.9999599" y="13.0000143" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="22"/><rect x="21.9999599" y="21.0000153" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="14"/><rect x="11.9999599" y="29.0000153" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="6"/></g></g></svg>
    <!-- terminal -->
    <svg id="terminal" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><path d="M90.125,19.5H9.875c-1.856,0-3.375,1.519-3.375,3.375v54.25c0,1.856,1.519,3.375,3.375,3.375h80.25   c1.856,0,3.375-1.519,3.375-3.375v-54.25C93.5,21.019,91.981,19.5,90.125,19.5z M28.78,33.517l-12.883,6.726v-2.859   c0-0.216,0.054-0.417,0.162-0.601c0.108-0.184,0.287-0.335,0.536-0.455l5.897-3.038c0.509-0.249,1.066-0.444,1.673-0.585   c-0.607-0.141-1.165-0.335-1.673-0.585l-5.897-3.021c-0.249-0.13-0.428-0.285-0.536-0.463s-0.162-0.376-0.162-0.593v-2.859   l12.883,6.709V33.517z"/></g></svg>
    <!-- debug -->
    <svg id="debug" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M20.796,34l-6.036-5.987c-1.122-1.124-2.938-1.092-4.062,0.028c-1.123,1.12-1.126,2.956-0.007,4.079l6.879,6.468  C18.108,39.128,18.841,39,19.604,39h5.596c-3.985,5-6.601,11-7.569,17H7.872C6.285,56,5,57.413,5,59c0,1.586,1.285,3,2.872,3h9.335  c0.05,5,1.315,10,3.522,14h-2.083c-0.763,0-1.495,0.436-2.034,0.977l-6.878,6.965c-1.12,1.123-1.118,2.975,0.005,4.095  c0.562,0.559,1.294,0.855,2.028,0.855c0.736,0,1.473-0.278,2.033-0.841L19.839,82h4.638C30.127,89,39,93.544,48,94.055V34H20.796z"/><path d="M92.128,56h-9.961c-1.24-6-4.434-12-8.176-17h6.405c0.763,0,1.495,0.137,2.034-0.404l6.879-6.679  c1.119-1.124,1.116-2.832-0.007-3.952c-1.125-1.121-2.941-1.131-4.062-0.007L79.204,34H52v60.033C61,93.447,69.713,88,75.363,82  h4.798l6.038,6.059c0.561,0.563,1.297,0.847,2.033,0.847c0.734,0,1.467-0.279,2.028-0.837c1.123-1.12,1.125-2.938,0.005-4.061  l-6.878-7.031C82.849,76.436,82.116,76,81.354,76h-2.2c2.234-4,3.517-9,3.567-14h9.407C93.715,62,95,60.586,95,59  C95,57.413,93.715,56,92.128,56z"/><path d="M31.421,30h37.158c0-7-3.473-12.264-8.687-15.555l3.75-3.673c1.122-1.121,1.122-2.902,0-4.024  c-1.122-1.121-2.939-1.102-4.062,0.02l-5.424,5.434c-1.338-0.306-2.726-0.478-4.157-0.478s-2.819,0.179-4.157,0.485l-5.425-5.423  c-1.122-1.121-2.939-1.121-4.062,0s-1.122,2.941,0,4.063l3.75,3.597C34.894,17.737,31.421,23,31.421,30z"/></svg>
    <!-- Config -->
    <svg id="config" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 100 125"><g transform="translate(0,-952.36218)"><path style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;letter-spacing:normal;word-spacing:normal;text-transform:none;direction:ltr;block-progression:tb;writing-mode:lr-tb;baseline-shift:baseline;text-anchor:start;white-space:normal;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-opacity:1;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate" d="m 50,957.36219 c -24.823202,0 -45,20.1768 -45,45.00001 0,24.8232 20.176798,45 45,45 24.823203,0 45,-20.1768 45,-45 0,-24.82321 -20.176797,-45.00001 -44.999999,-45.00001 z m 0,5 c 22.121003,0 40,17.879 40,40.00001 0,22.121 -17.878997,40 -39.999999,40 -22.121002,0 -40.000001,-17.879 -40.000001,-40 0,-22.12101 17.878999,-40.00001 40.000001,-40.00001 z"/></g><path style="" d="m 50,20 c -2.77,0 -5,2.23 -5,5 l 0,6.355469 A 10,10 0 0 1 50,30 10,10 0 0 1 55,31.349609 L 55,25 c 0,-2.77 -2.23,-5 -5,-5 z m 5,28.644531 A 10,10 0 0 1 50,50 10,10 0 0 1 45,48.650391 L 45,75 c 0,2.77 2.23,5 5,5 2.77,0 5,-2.23 5,-5 l 0,-26.355469 z" fill-opacity="1" stroke="none"/><path style="" d="m 30,20 c -2.77,0 -5,2.23 -5,5 l 0,16.355469 A 10,10 0 0 1 30,40 10,10 0 0 1 35,41.349609 L 35,25 c 0,-2.77 -2.23,-5 -5,-5 z m 5,38.644531 A 10,10 0 0 1 30,60 10,10 0 0 1 25,58.650391 L 25,75 c 0,2.77 2.23,5 5,5 2.77,0 5,-2.23 5,-5 l 0,-16.355469 z"  fill-opacity="1" stroke="none"/><circle style="" cx="50" cy="40" r="5"  fill-opacity="1" stroke="none"/><circle style="" cx="30" cy="50" r="5"  fill-opacity="1" stroke="none"/><path style="" d="m 70,80 c 2.77,0 5,-2.23 5,-5 l 0,-6.355469 A 10,10 0 0 1 70,70 10,10 0 0 1 65,68.650391 L 65,75 c 0,2.77 2.23,5 5,5 z M 65,51.355469 A 10,10 0 0 1 70,50 10,10 0 0 1 75,51.349609 L 75,25 c 0,-2.77 -2.23,-5 -5,-5 -2.77,0 -5,2.23 -5,5 l 0,26.355469 z"  fill-opacity="1" stroke="none"/><circle style="" cx="-70" cy="-60" r="5" transform="scale(-1,-1)"  fill-opacity="1" stroke="none"/></svg>
    <!-- Helper -->
    <svg id="helper" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g display="none"><g display="inline"><circle cx="26" cy="39.992" r="8"/><polygon points="17.996,52 18,72 24,72 28,72 34,72 34,51.993   "/></g><g display="inline"><polyline points="33,61.228 51,35.081 44.999,35.081 29,55.075   "/><polyline points="19,61.228 1,35.081 7.001,35.081 23,55.075   "/></g><g display="inline"><path d="M2.24,65.765c5.682-1.489,6.634,5.902,12.508,5.902s5.874-6,11.748-6c5.873,0,5.873,6,11.745,6    c5.874,0,5.873-6,11.747-6c5.876,0,5.876,6,11.752,6c5.874,0,5.874-6,11.748-6c5.878,0,5.878,6,11.756,6s6.826-7.387,12.514-5.903    c1.682,0.439-4.093,1.954-5.342,3.162c-1.247,1.205,2.924,5.519,1.677,6.724c-1.248,1.207-5.419-3.107-6.667-1.9    c-1.25,1.208,2.92,5.522,1.67,6.73c-1.25,1.208-5.42-3.105-6.67-1.896c-1.251,1.208,2.92,5.522,1.669,6.731    c-1.252,1.21-5.423-3.104-6.675-1.893c-1.253,1.21,2.024,7.04,0.34,7.48C74.496,91.756,73.627,85,70.253,85s-3.374,6-6.748,6    s-3.374-6-6.747-6c-3.375,0-3.375,6-6.749,6c-3.372,0-3.372-6-6.745-6c-3.376,0-3.376,6-6.752,6c-3.378,0-3.378-6-6.756-6    s-4.245,6.756-7.514,5.903c-1.682-0.439,1.594-6.268,0.344-7.475c-1.246-1.206-5.417,3.108-6.663,1.903    c-1.249-1.207,2.921-5.521,1.673-6.728c-1.25-1.208-5.42,3.106-6.67,1.897s2.92-5.522,1.67-6.731s-5.42,3.106-6.671,1.897    c-1.253-1.211,2.924-5.502,1.68-6.722C5.188,66.578,0.555,66.207,2.24,65.765z"/><path  stroke-width="7" stroke-miterlimit="10" d="M2.24,65.765    c5.682-1.489,6.634,5.902,12.508,5.902s5.874-6,11.748-6c5.873,0,5.873,6,11.745,6c5.874,0,5.873-6,11.747-6    c5.876,0,5.876,6,11.752,6c5.874,0,5.874-6,11.748-6c5.878,0,5.878,6,11.756,6s6.826-7.387,12.514-5.903    c1.682,0.439-4.093,1.954-5.342,3.162c-1.247,1.205,2.924,5.519,1.677,6.724c-1.248,1.207-5.419-3.107-6.667-1.9    c-1.25,1.208,2.92,5.522,1.67,6.73c-1.25,1.208-5.42-3.105-6.67-1.896c-1.251,1.208,2.92,5.522,1.669,6.731    c-1.252,1.21-5.423-3.104-6.675-1.893c-1.253,1.21,2.024,7.04,0.34,7.48C74.496,91.756,73.627,85,70.253,85s-3.374,6-6.748,6    s-3.374-6-6.747-6c-3.375,0-3.375,6-6.749,6c-3.372,0-3.372-6-6.745-6c-3.376,0-3.376,6-6.752,6c-3.378,0-3.378-6-6.756-6    s-4.245,6.756-7.514,5.903c-1.682-0.439,1.594-6.268,0.344-7.475c-1.246-1.206-5.417,3.108-6.663,1.903    c-1.249-1.207,2.921-5.521,1.673-6.728c-1.25-1.208-5.42,3.106-6.67,1.897s2.92-5.522,1.67-6.731s-5.42,3.106-6.671,1.897    c-1.253-1.211,2.924-5.502,1.68-6.722C5.188,66.578,0.555,66.207,2.24,65.765z"/></g><g display="inline"><path fill="none"  stroke-width="5" stroke-miterlimit="10" d="M3,61.667c5.874,0,5.874,6,11.748,6    s5.874-6,11.748-6c5.873,0,5.873,6,11.745,6c5.874,0,5.873-6,11.747-6c5.876,0,5.876,6,11.752,6c5.874,0,5.874-6,11.748-6    c5.878,0,5.878,6,11.756,6s5.878-6,11.756-6"/></g><circle display="inline" fill="none"  stroke-width="12" stroke-miterlimit="10" cx="74" cy="38" r="12"/><g display="inline"><circle  stroke-width="5" stroke-miterlimit="10" stroke-dasharray="12.5631,12.5631" cx="74" cy="38" r="12"/></g></g><g><g><circle cx="26" cy="39.992" r="8"/><path d="M89.336,62.917c-1.448,1.478-2.287,2.25-4.092,2.25s-2.644-0.771-4.092-2.25c-1.551-1.583-3.675-3.75-7.664-3.75    c-3.988,0-6.11,2.168-7.66,3.751c-1.447,1.478-2.286,2.249-4.088,2.249c-1.803,0-2.643-0.771-4.09-2.249    c-1.55-1.583-3.673-3.75-7.662-3.75c-3.988,0-6.11,2.168-7.66,3.751c-1.446,1.478-2.285,2.249-4.087,2.249    c-1.801,0-2.64-0.771-4.085-2.249c-0.05-0.051-0.105-0.106-0.156-0.158v-2.986l17-24.694h-6.001L31.465,51.994l-10.926,0.005    L7.001,35.081H1l16.998,24.69v3.972c-0.998,0.934-1.824,1.424-3.25,1.424c-1.802,0-2.641-0.771-4.088-2.249    C9.11,61.335,6.988,59.167,3,59.167v5c1.802,0,2.641,0.771,4.088,2.249c1.55,1.583,3.672,3.751,7.66,3.751s6.11-2.168,7.66-3.751    c1.447-1.478,2.286-2.249,4.088-2.249s2.64,0.771,4.087,2.249c1.549,1.583,3.671,3.751,7.658,3.751c3.988,0,6.11-2.168,7.66-3.751    c1.446-1.478,2.285-2.249,4.087-2.249c1.803,0,2.643,0.771,4.09,2.249c1.55,1.583,3.673,3.75,7.662,3.75    c3.988,0,6.11-2.168,7.66-3.751c1.447-1.478,2.286-2.249,4.088-2.249c1.805,0,2.644,0.771,4.092,2.25    c1.551,1.583,3.675,3.75,7.664,3.75s6.113-2.167,7.664-3.75c1.448-1.478,2.287-2.25,4.092-2.25v-5    C93.011,59.167,90.887,61.334,89.336,62.917z"/></g><path d="M74,20c-9.925,0-18,8.075-18,18s8.075,18,18,18s18-8.075,18-18S83.925,20,74,20z M81.209,25.416l-2.486,4.338   c-2.881-1.651-6.631-1.638-9.494,0.029l-2.516-4.32C71.091,22.912,76.806,22.892,81.209,25.416z M66.765,50.568   c-4.471-2.578-7.255-7.382-7.265-12.539l5-0.01c0.007,3.378,1.832,6.527,4.763,8.217L66.765,50.568z M74,44c-3.309,0-6-2.691-6-6   s2.691-6,6-6s6,2.691,6,6S77.309,44,74,44z M81.262,50.553l-2.508-4.326C81.682,44.53,83.5,41.378,83.5,38l5-0.049V38   C88.5,43.155,85.727,47.965,81.262,50.553z"/></g></svg>
</div>
