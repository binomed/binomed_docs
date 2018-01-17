

<!-- .slide: class="first-slide"  data-state="first"-->


# What's new in Devtools
### 2018  @ **SnowCamp**

![logo](assets/images/devtools.jpg)


##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

### Jean-François Garreau

<!-- .element: class="descjf" -->
Frontend developper & Community Manager

![avatar w-300 wp-200](assets/images/jf.jpg)


![company_logo](assets/images/lucca_logo.png)
![gdg_logo](assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](https://twitter.com/jefBinomed)



##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->

# Config / Activation


##==##

# Activation des experiments

<br>

![center w-700](./assets/images/activation.png)

[chrome://flags/#enable-devtools-experiments](chrome://flags/#enable-devtools-experiments)

##==##

<!-- .slide: class="transition-black" data-background="#3d4349"-->

# Helpers

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
    <p >Dinosoft Labs / Lemon Liu / Souvik Maity</p>
</div>

<div style="display:none">
    <!-- stats -->
    <svg id="stats" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 52 65" enable-background="new 0 0 52 52" xml:space="preserve"><g><g><g><path fill="none"  stroke-width="2" stroke-miterlimit="10" d="M6.6890597,14.049015     c6.3503995-10.6536999,20.2696991-14.2212,31.0895958-7.9683003c9.6343994,5.5679002,13.5627022,17.044899,9.8244019,27.0145988"/><polyline fill="none"  stroke-width="2" stroke-miterlimit="10" points="16.6390591,12.1095152      6.6866598,14.0467148 4.7191596,4.2472148    "/></g><g><path fill="none"  stroke-width="2" stroke-miterlimit="10" d="M45.311058,37.9510155     c-6.3506012,10.653698-20.2698994,14.221199-31.089798,7.9682007     C4.5868597,40.3513145,0.6585596,28.8743153,4.3970594,18.9046154"/><polyline fill="none"  stroke-width="2" stroke-miterlimit="10" points="35.3608551,39.8905144      45.3132553,37.9532166 47.2807579,47.7527161    "/></g></g><g><rect x="31.9999599" y="13.0000143" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="22"/><rect x="21.9999599" y="21.0000153" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="14"/><rect x="11.9999599" y="29.0000153" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="6"/></g></g></svg>
    <!-- terminal -->
    <svg id="terminal" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><path d="M90.125,19.5H9.875c-1.856,0-3.375,1.519-3.375,3.375v54.25c0,1.856,1.519,3.375,3.375,3.375h80.25   c1.856,0,3.375-1.519,3.375-3.375v-54.25C93.5,21.019,91.981,19.5,90.125,19.5z M28.78,33.517l-12.883,6.726v-2.859   c0-0.216,0.054-0.417,0.162-0.601c0.108-0.184,0.287-0.335,0.536-0.455l5.897-3.038c0.509-0.249,1.066-0.444,1.673-0.585   c-0.607-0.141-1.165-0.335-1.673-0.585l-5.897-3.021c-0.249-0.13-0.428-0.285-0.536-0.463s-0.162-0.376-0.162-0.593v-2.859   l12.883,6.709V33.517z"/></g></svg>
    <!-- debug -->
    <svg id="debug" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M20.796,34l-6.036-5.987c-1.122-1.124-2.938-1.092-4.062,0.028c-1.123,1.12-1.126,2.956-0.007,4.079l6.879,6.468  C18.108,39.128,18.841,39,19.604,39h5.596c-3.985,5-6.601,11-7.569,17H7.872C6.285,56,5,57.413,5,59c0,1.586,1.285,3,2.872,3h9.335  c0.05,5,1.315,10,3.522,14h-2.083c-0.763,0-1.495,0.436-2.034,0.977l-6.878,6.965c-1.12,1.123-1.118,2.975,0.005,4.095  c0.562,0.559,1.294,0.855,2.028,0.855c0.736,0,1.473-0.278,2.033-0.841L19.839,82h4.638C30.127,89,39,93.544,48,94.055V34H20.796z"/><path d="M92.128,56h-9.961c-1.24-6-4.434-12-8.176-17h6.405c0.763,0,1.495,0.137,2.034-0.404l6.879-6.679  c1.119-1.124,1.116-2.832-0.007-3.952c-1.125-1.121-2.941-1.131-4.062-0.007L79.204,34H52v60.033C61,93.447,69.713,88,75.363,82  h4.798l6.038,6.059c0.561,0.563,1.297,0.847,2.033,0.847c0.734,0,1.467-0.279,2.028-0.837c1.123-1.12,1.125-2.938,0.005-4.061  l-6.878-7.031C82.849,76.436,82.116,76,81.354,76h-2.2c2.234-4,3.517-9,3.567-14h9.407C93.715,62,95,60.586,95,59  C95,57.413,93.715,56,92.128,56z"/><path d="M31.421,30h37.158c0-7-3.473-12.264-8.687-15.555l3.75-3.673c1.122-1.121,1.122-2.902,0-4.024  c-1.122-1.121-2.939-1.102-4.062,0.02l-5.424,5.434c-1.338-0.306-2.726-0.478-4.157-0.478s-2.819,0.179-4.157,0.485l-5.425-5.423  c-1.122-1.121-2.939-1.121-4.062,0s-1.122,2.941,0,4.063l3.75,3.597C34.894,17.737,31.421,23,31.421,30z"/></svg>
</div>
