

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

<!-- .slide: class="transition-black"-->

# Config / Activation


##==##

# Activation des experiments

<br>

![center w-700](./assets/images/activation.png)

[chrome://flags/#enable-devtools-experiments](chrome://flags/#enable-devtools-experiments)

##==##

<!-- .slide: class="transition-black"-->

# Helpers

##==##

<!-- .slide: class="transition"  -->

# Unified menu


<h1>CTRL(CMD) + SHIFT + P<h1>


##==##

# screenshots

![center h-500](./assets/images/screenshot_nexus_5x.png)

##==##

<!-- .slide: class="transition-black"-->

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

<!-- .slide: class="transition-black"-->

<h1>
    <svg class="h-150 color-red">
        <use xlink:href="#stats" />
    </svg><br>Performances & css coverage
</h1>


##==##

<!-- .slide: data-background="./assets/images/devfestdraw.png" -->


##==##

<!-- .slide: class="transition-black"-->

<h1>
    <svg class="h-150 color-white">
        <use xlink:href="#terminal" />
    </svg><br>Logs
</h1>

##==##

<!-- .slide: class="with-code" data-state="console" -->

## Timer

```javascript
console.time('timerSample');
this.longTimeMethod().then(_ => {
    console.timeEnd('timerSample');
});
```


##==##

<!-- .slide: class="with-code" data-state="profile" -->

## Profiler

```javascript
console.profile('profileSample');
this.longTimeMethod().then(_ => {
    console.profileEnd('profileSample');
});
```

##==##

<!-- .slide: class="with-code" data-state="table" -->

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

<!-- .slide: class="with-code" data-state="group" -->

## Group

```javascript
console.group('A group label');
console.log('a log under the group');
console.info('a second log');
console.groupEnd()
```

##==##

<!-- .slide: class="transition-black"-->

# Debug Javascript

##==##

Breakpoint inline



##==##

<!-- .slide: class="last-slide" -->

<!-- .element: class="thank-message" --> Merci

<!-- .element: class="presenter" --> **Jean-François Garreau  **

<!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur Lucca

<!-- .element: class="email" --> **@jefbinomed**

<div class="credits">
    <h4 >Crédits : <a href="https://thenounproject.com/" target="_blank">The noun project</a></h4>
    <p >Dinosoft Labs</p>
</div>

<div style="display:none">
    <!-- stats -->
    <svg id="stats" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 52 65" enable-background="new 0 0 52 52" xml:space="preserve"><g><g><g><path fill="none"  stroke-width="2" stroke-miterlimit="10" d="M6.6890597,14.049015     c6.3503995-10.6536999,20.2696991-14.2212,31.0895958-7.9683003c9.6343994,5.5679002,13.5627022,17.044899,9.8244019,27.0145988"/><polyline fill="none"  stroke-width="2" stroke-miterlimit="10" points="16.6390591,12.1095152      6.6866598,14.0467148 4.7191596,4.2472148    "/></g><g><path fill="none"  stroke-width="2" stroke-miterlimit="10" d="M45.311058,37.9510155     c-6.3506012,10.653698-20.2698994,14.221199-31.089798,7.9682007     C4.5868597,40.3513145,0.6585596,28.8743153,4.3970594,18.9046154"/><polyline fill="none"  stroke-width="2" stroke-miterlimit="10" points="35.3608551,39.8905144      45.3132553,37.9532166 47.2807579,47.7527161    "/></g></g><g><rect x="31.9999599" y="13.0000143" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="22"/><rect x="21.9999599" y="21.0000153" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="14"/><rect x="11.9999599" y="29.0000153" fill="none"  stroke-width="2" stroke-miterlimit="10" width="6" height="6"/></g></g></svg>
    <!-- terminal -->
    <svg id="terminal" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><path d="M90.125,19.5H9.875c-1.856,0-3.375,1.519-3.375,3.375v54.25c0,1.856,1.519,3.375,3.375,3.375h80.25   c1.856,0,3.375-1.519,3.375-3.375v-54.25C93.5,21.019,91.981,19.5,90.125,19.5z M28.78,33.517l-12.883,6.726v-2.859   c0-0.216,0.054-0.417,0.162-0.601c0.108-0.184,0.287-0.335,0.536-0.455l5.897-3.038c0.509-0.249,1.066-0.444,1.673-0.585   c-0.607-0.141-1.165-0.335-1.673-0.585l-5.897-3.021c-0.249-0.13-0.428-0.285-0.536-0.463s-0.162-0.376-0.162-0.593v-2.859   l12.883,6.709V33.517z"/></g></svg>
</div>
