
<!-- .slide: class="transition" -->

# **5.3.1 Jonglez 🤹**

## NaoTalks 2026

##==##

## Un art ancien

### Premières traces ~ -2000 AV JC

![](./assets/images/Illustrerad_Verldshistoria_band_I_Ill_013.jpg 'center h-600')

Source : [Wikipedia - History of jugglinh](https://en.wikipedia.org/wiki/History_of_juggling)
<!-- .element: class="credits" -->

##==##

# Partager nécessitait de rencontrer et échanger
## mais ça reste valable encore maintenant ☺️

![](./assets/images/pexels-pixabay-433452.jpg 'center h-700')

pexels : [pixabay](https://www.pexels.com/fr-fr/photo/personnes-jetant-des-epingles-433452/)
<!-- .element: class="credits" -->

##==##

## Solution universelle venue des mathématiques !


Le Siteswap
<!-- .element: style="font-size: 8rem; font-weight:700; text-align:center;" -->

> Inventé dans les années 80 par plusieurs mathématiciens en parallèle à travers le monde : <br>
> 1981: Paul Klimek -> son Quantic Juggling <br>
> 1985: Mike Day, Colin Wright et Adam Chalcraft -> notation de Cambridge<br>
> 1985: Bruce Tiemann -> Site Swap
<!-- .element: class="fragment" -->

##==##

## C'est ça

<br>

![](./assets/images/StateDiagram3BallMaxThrow5.png 'center h-500')

Notes:

##==##

## Ou ça 
<br>

![](./assets/images/Juggling53145305520extract.png 'center h-500')

##==##

<!-- .slide: class="transition" data-background="white" -->

<br>

![](./assets/images/Jackie-Chan-WTF.jpg 'center h-700')

Notes:

##==##

<!-- .slide: class="transition-black" data-background="black" -->

# Plus sérieusement ! 

Notes:
Méthode mathématique de codage du jonglage basé sur les temps


##==##

# Si on simplifie 

<br><br>

>Le Siteswap est une suite de nombres représentant les temps d'une figure de jongle.
Notes:


##==##


## 1 lancé = 1 temps = 1 chiffre

<br>

![](./assets/images/Siteswap.png 'center h-600')

##==##

<!-- .slide: class="transition-black text-white" data-background="black"  -->

# Exemple : <br> 333

Notes:


##==##

<!-- .slide: class="transition text-white" data-background="#2196F3" -->

# Siteswaps Asynchrones


##==##

# Alternance de temps : gauche / droite

<siteswap-diagram pattern="3"></siteswap-diagram>


##==##

<!-- .slide: class="transition" -->

# 3 3 3

<siteswap-diagram pattern="333"></siteswap-diagram>

##==##

<!-- .slide: class="transition text-white" data-background="#4CAF50" -->

# Les multiplex ! 

Notes:
Lancées issus d'une même main

##==##

<!-- .slide: class="transition text-white" data-background="#4CAF50" -->

# Exemple : <br> [43]

Notes:
Lancées issus d'une même main

##==##

<!-- .slide: class="transition text-white" data-background="#FF9800" -->

# Les Siteswap Synchrones

Notes:
Lancées simultanés


##==##

<!-- .slide: class="transition text-white" data-background="#FF9800" -->

# Exemple : <br> (4,4)

Notes:
Lancées simultanés

##==##

<!-- .slide: class="transition text-white" data-background="#FF9800" -->

# Version croisée : <br> (4,2x)(2x,4)

Notes:
Lancées simultanés

##==##

<!-- .slide: class="transition-black" data-background="black" -->

# Comment valider un siteswap ?

Notes:
Lancées simultanés

##==##

## Vive les maths


<div style="display:flex; align-items:center; justify-content:center; gap:24px; font-size:2.4rem; font-weight:700; margin-top:30px;">
  <span style="display:inline-flex; flex-direction:column; align-items:center; line-height:1.3;">
    <span>t<sub>1</sub> + t<sub>2</sub> + ... + t<sub>n</sub></span>
    <span style="display:block; width:100%; border-top:4px solid currentColor; margin:2px 0;"></span>
    <span>n</span>
  </span>
  <span>=</span>
  <span>nb balles</span>
</div>

>La somme des nombres divisé par la période donne un nombre entier représentant le nombre d'objet avec lequel le siteswap se jongle. De plus un siteswap valide est "répétable"
<!-- .element: class="fragment" -->

Notes:
Le côté répétable représente la notion de cycle d'un siteswap 321 => fini dans la main

##==##

<!-- .slide: class="transition text-white" data-background="#2196F3" style="--tc-transition-line-color: #2196F3" -->

# 3 <br> <span class="fragment"> 3 / 1 = 3</span>

##==##

<!-- .slide: class="transition text-white" data-background="#2196F3" style="--tc-transition-line-color: #2196F3" -->

# 531 <br> <span  class="fragment">5 + 3 + 1 = 9</span> <br> <span  class="fragment">9 / 3 = 3 </span>


##==##

<!-- .slide: class="transition text-white" data-background="#4CAF50" style="--tc-transition-line-color: #4CAF50"-->

# 4[43]1 <br> <span class="fragment">4+4+3+1 = 12</span> <br> <span class="fragment">12 / 3 = 4</span>


##==##

<!-- .slide: class="transition text-white" data-background="#FF9800" style="--tc-transition-line-color: #FF9800"-->

# (4,4) <br> <span class="fragment">8 / 2 = 4</span>

##==##

<!-- .slide: class="transition-white" -->

# Jouons maintenant 

##==##

<!-- .slide: class="transition text-white" data-background="#2196F3" -->

# 531 

##==##
<!-- .slide: class="transition text-white" data-background="#2196F3" data-type-show="on-stage"-->

# 531 

## Valide !

##==##
<!-- .slide: data-type-show="restitition" -->

<br>

<siteswap-scene pattern="531" autoplay></siteswap-scene>

##==##

<!-- .slide: class="transition text-white" data-background="#4CAF50" -->

# 622

##==##

<!-- .slide: class="transition text-white" data-background="#f14343c8" -->

# 622

## Non Valide 

##==##

<!-- .slide: class="transition text-white" data-background="#FF9800" -->

# 6222

##==##

<!-- .slide: class="transition text-white" data-background="#FF9800" data-type-show="on-stage"-->

# 6222

##==##

<!-- .slide: data-type-show="restitition" -->

<br>
<siteswap-scene pattern="6222" autoplay></siteswap-scene>

##==##

<!-- .slide: class="transition text-white" data-background="#2196F3" -->

# 321


##==##

<!-- .slide: class="transition text-white" data-background="#f14343c8" -->

# 321

## Non Valide car non répétable

##==##

<!-- .slide: class="transition text-white" data-background="#4CAF50" -->

# 32[42]01


##==##

<!-- .slide: class="transition text-white" data-background="#f14343c8" -->

# 32[42]01

## Non Valide

##==##

<!-- .slide: class="transition text-white" data-background="#FF9800" -->

# 441 

##==##

<!-- .slide: class="transition text-white" data-background="#FF9800"  data-type-show="on-stage"-->

# 441 


##==##

<!-- .slide: data-type-show="restitition" -->

<br>
<siteswap-scene pattern="441" autoplay></siteswap-scene>


##==##

<!-- .slide: class="transition text-white" data-background="#2196F3" -->

# 441423333531 

##==##

<!-- .slide: class="transition text-white" data-background="#2196F3"  data-type-show="on-stage"-->

# 441423333531 


##==##

<!-- .slide: data-type-show="restitition" -->

<br>
<siteswap-scene pattern="441423333531" autoplay></siteswap-scene>

##==##

<!-- .slide: class="transition top txt-white" data-background="./assets/images/pexels-kaplanart-11634144.jpg" -->

# Showtime !

credits : [Pexels - Beyza Kaplan](https://www.pexels.com/fr-fr/@kaplanart/)
<!-- .element: class="credits" -->

##==##

<!-- .slide: class="speaker-slide" -->

<div class="speaker-slide">

# Merci !! Des questions ?

## Jean-François Garreau

### ![](fa-bluesky "fa fa-brands tc-icons") jefbinomed

### ![](fa-linkedin "fa fa-brands tc-icons") jeanfrancois.garreau

![](./assets/images/jf.jpg 'speaker')


![](https://jef.binomed.fr/binomed_docs/Prezs/RTTSiteswap/index.html#/ 'tc-qrcode company text-below')slides : https://bit.ly/3Vh3fJ5


</div>
