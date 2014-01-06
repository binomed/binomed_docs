<div class="first-slide"></div>

# **Cours Mobilité**

## 2013 - I5

### 2014.01.08 Epsi @ **Nantes**


##==##

<div class="title"></div>

# **Cours Android / HTML5 **

## Cours Mobilité

### Cours 05 - HTML5 : Responsive, Composants, Compatibilité, Offline

![title center](/assets/images/html5_logo.jpg)

<footer/>

##==##
<!--
//     _____    ____    __  __   __  __              _____   _____    ______ 
//    / ____|  / __ \  |  \/  | |  \/  |     /\     |_   _| |  __ \  |  ____|
//   | (___   | |  | | | \  / | | \  / |    /  \      | |   | |__) | | |__   
//    \___ \  | |  | | | |\/| | | |\/| |   / /\ \     | |   |  _  /  |  __|  
//    ____) | | |__| | | |  | | | |  | |  / ____ \   _| |_  | | \ \  | |____ 
//   |_____/   \____/  |_|  |_| |_|  |_| /_/    \_\ |_____| |_|  \_\ |______|
//                                                                           
//  
-->


## Sommaire ## 

* MediaQueries

<br>

* Composants Graphiques avec Angular

<br>

* Compatibilités navigateurs

<br>

* Le offline

<br>


<footer/>


<!--
//    __  __ ______ _____ _____          ____  _    _ _____ ______ _____  _____ ______  _____ 
//   |  \/  |  ____|  __ \_   _|   /\   / __ \| |  | |_   _|  ____|  __ \|_   _|  ____|/ ____|
//   | \  / | |__  | |  | || |    /  \ | |  | | |  | | | | | |__  | |__) | | | | |__  | (___  
//   | |\/| |  __| | |  | || |   / /\ \| |  | | |  | | | | |  __| |  _  /  | | |  __|  \___ \ 
//   | |  | | |____| |__| || |_ / ____ \ |__| | |__| |_| |_| |____| | \ \ _| |_| |____ ____) |
//   |_|  |_|______|_____/_____/_/    \_\___\_\\____/|_____|______|_|  \_\_____|______|_____/ 
//                                                                                            
//       
-->
##==##


<div class='transition'></div>

# MediaQueries

![icon](/assets/images/responsive-web-design.png)

##==##

## MediaQueries

### Pour quoi faire ?

Il s'agit de s'en servir pour traiter 2 philosophies d'affichage :  

<br>

* Le Responsive Design

<br><br>

* Le Fluid Design

<aside class="notes">

</aside>

<footer/>


##==##

## Responsive Design

<br><br>

Le responsive a pour objectif la réorganisation graphique de votre écran en fonction de la taille d'écran disponible.

<br>

En effet, en fonction de l'espace disponible sur votre écran, certaines partie de la page seront masquées, déplacées pour s'adapter au mieux à la place.



<aside class="notes">
Parler des menus cachés, etc...
</aside>

<footer/>

##==##

## Responsive Design

<br><br><br>

![w-800 wp-500 center](/assets/images/responsive-design-slide.jpg) 


<aside class="notes">

</aside>

<footer/>

##==##

## Fluid Design

<br><br>

Le Fluid design au contraire s'occupe lui de garder un affichage proportionnel en fonction de la résolution, le fluid design ne cachera pas des éléments graphiques mais les redimensionnera pour qu'ils s'affichent au mieux par rapport à la taille de l'écran et ainsi présenter au mieux les éléments.

<br>

Le Fluid design n'interdit pas par contre de changer le nombre de colonnes à afficher afin de coller au mieux à l'espace présent.

<aside class="notes">
L'idée étant bien la proportionnalité de la chose ! 
</aside>

<footer/>

##==##

## Fluid Design


<br><br>

![w-600 wp-400 center](/assets/images/fluid_design.png)


<aside class="notes">

</aside>

<footer/>


##==##

## Media Queries

### La solution

Quel que soit la solution choisie, les medias queries seront le meilleur outils pour y répondre.

Il s'agit de propriétés css qui permettent de choisir de surcharger certaines parties du css en fonction d'une résolution d'écran.

<br>

![center w-700 wp-400](/assets/images/media_quieries_caniuse.png)

<aside class="notes">
Bonne présence sur les navigateurs !
</aside>

<footer/>

##==##

## Media Queries



```html
<!doctype html>
<head>
<meta charset="utf-8">
<title>Media Queries !</title>
<link rel="stylesheet" media="screen" href="screen.css" type="text/css" />
<link rel="stylesheet" media="print" href="print.css" type="text/css" />
</head>
<body>
...
</body>
```
<br>

On peut donc choisir déjà sa plateforme de destination : 

> screen / handheld / print / aural / braille / embossed  / projection / tty / tv  / all

<aside class="notes">
Handheld = Mobile | tty = terminal | embossed = imprimantes braille | aural synthèse vocal
</aside>

<footer/>

##==##

## Media Queries


Mais ça marche aussi directement dans le css

<br><br>

```css
@media print {
  #menu, #footer, aside {
    display:none;
  }
  body {
    font-size:120%;
    color:black;
  }
}
```

<aside class="notes">

</aside>

<footer/>


##==##

## Media Queries

Globallement, l'idée est de spécifier à travers des opérateurs logiques quels sont les styles à appliquer : 

* **and**
* **only**
* **not**


```html
<link rel="stylesheet" media="screen and (max-width: 640px)" 
href="smallscreen.css" type="text/css" />
```

```css
@media screen and (max-width: 640px) {
  .bloc {
    display:block;
    clear:both;
  }
}
```


<aside class="notes">

</aside>

<footer/>


##==##

## Media Queries

On utilisera ensuite les fonctionnalités suivantes : 

* **color** : support de la couleur (bits/pixel)
* **color-index** : périphérique utilisant une table de couleurs indexées
* **aspect-ratio** : ratio du périphérique de sortie (par exemple 16/9)
* **device-aspect-ratio** : ratio de la zone d'affichage
* **device-height** : dimension en hauteur du périphérique
* **device-width** : dimension en largeur du périphérique
* **grid** : périphérique bitmap ou grille (ex : lcd)
* **height** : dimension en hauteur de la zone d'affichage


<aside class="notes">
On peut souvent préfixer par min- ou max-
</aside>

<footer/>

##==##

## Media Queries

On utilisera ensuite les fonctionnalités suivantes : 

* **monochrome** : périphérique monochrome ou niveaux de gris (bits/pixel)
* **orientation** : orientation du périphérique (portait ou landscape)
* **resolution** : résolution du périphérique (en dpi, dppx, ou dpcm)
* **scan** : type de balayage des téléviseurs (progressive ou interlace)
* **width** : dimension en largeur de la zone d'affichage


<aside class="notes">
On peut souvent préfixer par min- ou max-
</aside>

<footer/>


<!--
//     _____ ____  __  __ _____   ____   _____         _   _ _______ _____ 
//    / ____/ __ \|  \/  |  __ \ / __ \ / ____|  /\   | \ | |__   __/ ____|
//   | |   | |  | | \  / | |__) | |  | | (___   /  \  |  \| |  | | | (___  
//   | |   | |  | | |\/| |  ___/| |  | |\___ \ / /\ \ | . ` |  | |  \___ \ 
//   | |___| |__| | |  | | |    | |__| |____) / ____ \| |\  |  | |  ____) |
//    \_____\____/|_|  |_|_|     \____/|_____/_/    \_\_| \_|  |_| |_____/ 
//                                                                         
//     
-->

##==##


<div class='transition'></div>

# Composants Graphiques

![icon](/assets/images/webcomponents.png)


##==##

## Composants Graphiques

### AngularJS


![h-200 hp-100 center](/assets/images/angularjs.png)

<br>

Angular JS est un framework de développement d'application javascript permettant de structurer son code pour une application web. Ce dernier à l'oposé de Jquery se concentre sur la structuration du code et sur la mise à disposition de composants applicatifs.


<br>



<aside class="notes">

</aside>

<footer/>

##==##

## Composants Graphiques

### AngularJS



Angular JS offre aussi la possibilité de créer ses propres composants graphiques : **les directives**. Ceci permet ainsi de créer des nouveau attributs html ou tout simplement des balises. On pourra ainsi envisager de créer une balise ```<epsi>``` 



<aside class="notes">
On va voir ça en TP
</aside>

<footer/>

##==##

## Composants Graphiques

### PolymerJS


![h-200 hp-100 center](/assets/images/polymer.png)

<br>

Polymer JS est quand à lui un polyfill des prochaines spécifications html5 autour du templating. De la même façon qu'angular on pourra créer un tag ```<epsi>```. Polymer se spécialise quand à lui dans cette partie du HTML5. Angular est un Framework / Polymer un polyfill.


<aside class="notes">

</aside>

<footer/>


<!--
//     _____ ____  __  __ _____     _______ _____ ____ _____ _      _____ _______ ______ 
//    / ____/ __ \|  \/  |  __ \ /\|__   __|_   _|  _ \_   _| |    |_   _|__   __|  ____|
//   | |   | |  | | \  / | |__) /  \  | |    | | | |_) || | | |      | |    | |  | |__   
//   | |   | |  | | |\/| |  ___/ /\ \ | |    | | |  _ < | | | |      | |    | |  |  __|  
//   | |___| |__| | |  | | |  / ____ \| |   _| |_| |_) || |_| |____ _| |_   | |  | |____ 
//    \_____\____/|_|  |_|_| /_/    \_\_|  |_____|____/_____|______|_____|  |_|  |______|
//                                                                                       
//     
-->

##==##


<div class='transition'></div>

# Compatibilité navigateurs 

![icon](/assets/images/Browsers01.png)


##==##

## Compatibilité navigateurs


Lors de l'écriture d'une application HTML5, il est fréquent d'être confronté à des problèmes de compatibiltiés entre navigateurs que ça soit par la non implémentation d'une fonctionnalité ou alors les prefix css de chaque navigateurs. 

<br>

Il existe heuresuement des outils javascript nous permettant de réduire au mieux ces écarts

<aside class="notes">

</aside>

<footer/>


##==##

## Compatibilité navigateurs


### Prefix Free

Il s'agit d'une petite librairie vous permettant d'écrire vos css sans préciser les prefix css !  http://goo.gl/t02Bd, il suffit d'inclure le script js dans sa page et ça marche.

Ainsi, au lieu d'écrire ça : 

```css
#zoom {
  -moz-transform: scale(2);
  -webkit-transform: scale(2);
  -o-transform: scale(2);
  transform: scale(2);
}
```

On écrira : 

```css
#zoom {
  transform: scale(2);
}
```

<aside class="notes">

</aside>

<footer/>

##==##

## Compatibilité navigateurs


### Modernizr

Il s'agit d'une librairie javascript qui vous permettra de détecter la présence ou non de fonctionnalité dans le navigateur. On pourra ainsi tester si le navigateur permet de faire des websockets et si l'on doit du coup mettre en place du long-polling. http://modernizr.com/

Un autre avantage de modernizr est qu'il vous donnera pour une fonctionalité données, l'objet javascript ou css avec le bon préfix ! 

<aside class="notes">

</aside>

<footer/>


<!--
//     ____  ______ ______ _      _____ _   _ ______ 
//    / __ \|  ____|  ____| |    |_   _| \ | |  ____|
//   | |  | | |__  | |__  | |      | | |  \| | |__   
//   | |  | |  __| |  __| | |      | | | . ` |  __|  
//   | |__| | |    | |    | |____ _| |_| |\  | |____ 
//    \____/|_|    |_|    |______|_____|_| \_|______|
//                                                   
//            
-->

##==##


<div class='transition'></div>

# Le Offline

![icon](/assets/images/HTML5_Offline_Storage_512.png)


##==##

## HTML5 & le Offline

HTML5 et le offline ça représente quoi ? 

<br>

* LocalStorage & SessionStorage 

<br>

* IndexedDB

<br>

* AppCache

<aside class="notes">
Parler du local & indexedDB (déjà évoqués précédement)
</aside>

<footer/>

##==##

## OffLine

### AppCache

L'appcache est un mécanisme vous permettant de stocker un ensemble de fichiers de votre site. De cette manière, vous pouvez avoir accès à l'intégralité de votre application même s'il n'y a pas réseau.

Pour spécifier quoi sauvegarder, il faut simplement préciser l'emplacement d'un fichier avec un formalisme précis : 

```html
<!DOCTYPE HTML>
<html manifest="demo.appcache">
...
</html>
``` 

<aside class="notes">

</aside>

<footer/>

##==##

## OffLine

### AppCache


```
CACHE MANIFEST
# 2012-02-21 v1.0.0
/theme.css
/logo.gif
/main.js

NETWORK:
login.asp

FALLBACK:
/html/ /offline.html
``` 

<br>

* CACHE : la liste de fichiers à mettre en cache
* NETWORK : la liste des appels à laisser passer
* FALLBACK : la liste des fichiers à afficher en cas de non présence d'un fichier.

<aside class="notes">
Dire que une fois que c'est sauvegardé, ça passe en priorité par ce qui est sauvegardé
</aside>

<footer/>

##==##

## OffLine

### AppCache


Généralement on laisse passer tous les passer tous les appels http via cette indication

```
NETWORK:
*
``` 
<br>

La mise à jour du fichier se fait via une modification détectée dans le fichier manifest. Il est donc conseillé de mettre en place une version dans le fichier manifest afin de spécifier au navigateur quelle version de l'application il possède.

```
CACHE MANIFEST
# 2012-02-21 v1.0.0
``` 

<aside class="notes">

</aside>

<footer/>


##==##

<div class="last-slide"></div>

<div class="topic-title"></div>

# Cours Mobilité - 05 HTML5

<div class="presenter"></div>

# **Jean-François Garreau**

<div class="gdg-rule"></div>

# GDG Nantes Leader

<div class="work-rule"></div>

# Ingénieur SQLI

<div class="thank-message"></div>

# **Merci**

![avatar](/assets/images/jf.jpg)

<footer/>