<!-- .slide: data-background="./assets/images/super_hero_fotolia.png" data-state="hidefooter" class="transition first-slide" -->

# Game Over

### 2016.04.25 TSG @ **Nantes**



##==##

<!-- .slide: class="who-am-i" data-state="quit-question"-->

<div class="row_container">
    <div class="title_header"></div>
    <h2>Qui suis-je ?</h2>
    <div class="title_footer"></div>
</div> 

### Jean-François GARREAU

<!-- .element: class="descjf" -->
IoT Manager, Senior innovation developer & Community Manager

![avatar w-300 wp-200](./assets/images/jgarreau.png)


![company_logo](./assets/images/sqli_logo.png)
![gdg_logo](./assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](http://twitter.com/jefBinomed)

<!-- .element: class="gplus" -->
[+JeanFrancoisGarreau](http://plus.google.com/+JeanFrancoisGarreau)


##==##

<!-- .slide: data-background="./assets/images/devquest_logo.png" data-state="hidefooter" class="transition"-->

##==##

<!-- .slide: data-background="./assets/images/background_sans_stands.png" data-state="hidefooter" class="transition"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>L'objectif initial</h2>
    <div class="title_footer"></div>
</div> 

<div class="anim_ninja anim"></div>

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Features</h2>
    <div class="title_footer"></div>
</div> 

<br><br>

* Pas d'installations 
* Multijoueurs temps réél <!-- .element: class="fragment" -->
* Géolocalisation des utilisateurs <!-- .element: class="fragment" -->
* Détection automatique de la marche <!-- .element: class="fragment" -->
* Faible consomation de data & cpu <!-- .element: class="fragment" -->

##==##


<div class="url_game">
http://devquest2015.appspot.com
</div>

<div class="parent-demo center">
    <img class="center w-700" src="./assets/images/nexus6.png">

    <iframe id="game-demo" src="https://devquest2015.appspot.com/"></iframe>
</div>

##==##

<!-- .slide: data-background="./assets/images/background_sans_stands.png" data-state="hidefooter" class="transition"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Ce que j'ai vraiment fait</h2>
    <div class="title_footer"></div>
</div> 

<div class="anim_warior anim"></div>


##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Features</h2>
    <div class="title_footer"></div>
</div> 

<br><br>

* Pas d'installations <!-- .element: class="fragment check" -->
* Multijoueurs temps réél <!-- .element: class="fragment check" -->
* Géolocalisation des utilisateurs <!-- .element: class="fragment uncheck" -->
* Détection automatique de la marche <!-- .element: class="fragment uncheck" -->
* Faible consomation de data & cpu <!-- .element: class="fragment check" -->

##==##

<!-- .slide: data-background="./assets/images/background_sans_stands.png" data-state="hidefooter" class="transition"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Explication</h2>
    <div class="title_footer"></div>
</div> 

<div class="anim_mage anim"></div>



##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Stack utilisée</h2>
    <div class="title_footer"></div>
</div> 

<br>

![h-100](./assets/images/HTML5_Logo_512.png)
![h-50](./assets/images/firebase_logo.png)
![h-100](./assets/images/javascript_logo.png)


![h-100](./assets/images/gulp.png)
![h-100](./assets/images/browserify_logo.png)
![h-100](./assets/images/sass.png)

![h-100](./assets/images/appengine.png)
![h-100](./assets/images/gopher.png)

Notes:
Expliquer chacun et chaque roles !

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Stack utilisée : Le Build</h2>
    <div class="title_footer"></div>
</div> 

<br>

![h-100](./assets/images/gulp.png)
![h-100](./assets/images/browserify_logo.png)
![h-100](./assets/images/sass.png)

<br>

* Séparation des environements : Dev vs Prod
* Cas particulier des clés d'API
* Build dans le répertoire dist

Notes:
Expliquer la subtilité dans l'utilisation de Appengine en local nécessitant un proxy

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Stack utilisée : Le Back</h2>
    <div class="title_footer"></div>
</div> 

<br>

![h-100](./assets/images/appengine.png)
![h-100](./assets/images/gopher.png)

<br>

* Hosting gratuit
* Hosting Scallable
* Envie de découvrir un nouveau langage : )

Notes:

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Stack utilisée : Le Front</h2>
    <div class="title_footer"></div>
</div> 

<br>

![h-100](./assets/images/HTML5_Logo_512.png)
![h-50](./assets/images/firebase_logo.png)
![h-100](./assets/images/javascript_logo.png)


<br>

* ES6 Modules
* Json Data base partagée
* Utilisation des promesses

Notes:


##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Un moteur de jeux ...</h2>
    <div class="title_footer"></div>
</div> 

<br>

![h-400](./assets/images/diag_moteur.png)

Notes:
Insister sur le principe de séparation des threads

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Comment ?</h2>
    <div class="title_footer"></div>
</div> 

<br>

* Un canvas
* Gestion du framerate navigateur

<br>
 
```javascript
window.requestAnimationFrame
```

* Composants : 
 * Bus d'événement
 * Contrôleur
 * Moteur de rendu
 * Gestionnaire de ressources


##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Architecture</h2>
    <div class="title_footer"></div>
</div> 

![center h-600](./assets/images/EngineDevQuest.png)

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Gestion du rendu</h2>
    <div class="title_footer"></div>
</div> 


![center h-600](./assets/images/background.png) <!-- .element class="map" -->

<div class="move"></div>

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Gestion du rendu</h2>
    <div class="title_footer"></div>
</div> 

<br>

```javascript
ui.context.drawImage(imgSource //L’image source
, sx //sx clipping de l'image originale
, sy //sy clipping de l'image originale
, sw // swidth clipping de l'image originale
, sh // sheight clipping de l'image originale
, dx // x Coordonnées dans le dessin du canvas
, dy // y Coordonnées dans le dessing du canvas
, dw // width taille du dessin
, dh // height taille du dessin 
);
``` 

![center h-300](./assets/images/drawImage.png)

Notes:
Parler de la gestion du paralax


##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Gestion du rendu : screen</h2>
    <div class="title_footer"></div>
</div> 

<br>

```javascript
function paint_(){
    ...

    if (Model.ui.screen === CONST.screens.HOME){
        paintInstructions_(ScreenHome.homeScreen());                
    }else if (Model.ui.screen === CONST.screens.STORY){
        paintInstructions_(ScreenStory.storyScreen());              
    }...
    
        
    if (paintActive)
        window.requestAnimationFrame(paint_);
}

```

Notes:
Expliquer que chaque "screen" renvoie les instructions et sait comment safficher ! Il donne aussi les infos d'interactions

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Gestion du rendu : sprites</h2>
    <div class="title_footer"></div>
</div> 


![center h-300](./assets/images/ninja_m.png)

<div class="anim_ninja anim"></div>

Notes:
Expliquer le concept et parle des fichiers d'origines qui servent à builder la map !

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Gestion du moteur</h2>
    <div class="title_footer"></div>
</div> 

<br>

```javascript
function run_(){
    try{        
        processDirection_();
        processInteraction_();
        processUsers_();
        if (runActiv){
            window.requestAnimationFrame(run_);
        }
    }catch(err){
        console.error("Error  : %s \n %s",err.message, err.stack);          
    }
}
``` 

##==##

<!-- .slide: class="flex-p"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Gestion des événements</h2>
    <div class="title_footer"></div>
</div> 

<br>

```javascript
function initListeners(){
    ...

    document.addEventListener('keydown', keypress_, false);

    if (Modernizr.touch){       
        document.addEventListener('touchstart', mouseDown_, false);
        document.addEventListener('touchend', mouseUp_, false);
    }
    ...
    
    // Firebase Listeners
    Model.services.fbActivRef
        .on('child_added', fbAddOrChange_);
    Model.services.fbActivRef
        .on('child_removed', fbRemove_);
    Model.services.fbActivRef
        .on('child_changed', fbAddOrChange_);

}

``` 

Notes:
Parler du mécanisme de matching des events => lié 

##==##

<!-- .slide: data-background="./assets/images/background_sans_stands.png" data-state="hidefooter" class="transition"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Fails !</h2>
    <div class="title_footer"></div>
</div> 

<div class="anim_healer anim"></div>


##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Les fails</h2>
    <div class="title_footer"></div>
</div> 

<br>


* Géolocalisation des utilisateurs <!-- .element: class="fragment" -->
* Détection automatique de la marche <!-- .element: class="fragment" -->
* Faible consomation de data & mémoire <!-- .element: class="fragment" -->


##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Géolocalisation</h2>
    <div class="title_footer"></div>
</div> 

<br>


* GPS Pas précis <!-- .element: class="uncheck notrayed" -->
* Pas de ble (en 2015) <!-- .element: class="uncheck notrayed" -->
* Ultrasons <!-- .element: class="check" -->

![](./assets/images/ultrasons.png)

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Géolocalisation : Ultrasons</h2>
    <div class="title_footer"></div>
</div> 

<br>


```javascript
navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

if (navigator.getUserMedia) {
   navigator.getUserMedia (
      {audio: true},
       function(localMediaStream) {
         ...
      },
      function(err) {
         console.log("The following error occured: " + err);
      }
   );
} else {
   console.log("getUserMedia not supported");
}
```

https://bugs.chromium.org/p/webrtc/issues/detail?id=4830

Notes:
Parler du bug

##==##

<!-- .slide: data-background="./assets/images/mario_again.jpg" data-state="hidefooter" class="transition"-->

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Détection du mouvement</h2>
    <div class="title_footer"></div>
</div> 

<br>


* Device Motion API  <!-- .element: class="check" -->
* Device Orientation API <!-- .element: class="check" -->

<br>

```javascript
window.addEventListener('devicemotion', motionCallBack_, false);

window.addEventListener('deviceorientation', orientationCallBack_, false);
```

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Détection du mouvement : Motion</h2>
    <div class="title_footer"></div>
</div> 

<br>

```javascript
function motionCallBack_(event){
    if (_trackAcceleration &&  event.accelerationIncludingGravity){
        var zValue = event.accelerationIncludingGravity.z - CONST.motion.GRAVITY;
        _maxY = Math.max(event.accelerationIncludingGravity.y, _maxY);
        _minY = Math.min(event.accelerationIncludingGravity.y, _minY);
        // Initialisation
        _arrayZ.push(zValue);
        if (_arrayZ.length > 3){
            _arrayZ = _arrayZ.slice(1,4);
            // On est sur un pic
            if (_arrayZ[1] > _arrayZ[0]
                && _arrayZ[1] > _arrayZ[2]
                && _arrayZ[1] > CONST.motion.STEP_ACCELERATION_Z
                && _maxY > CONST.motion.STEP_ACCELERATION_Y ){
                var currentTime = Date.now();
                // On tiens comptes d'un temps de rafraischissement minimal pour éviter les événements parasites
                if (currentTime - _lastPick > CONST.motion.STEP_RATE
                    && Model.gameModel.parameters.motion){
                    _lastPick = currentTime;
                    ...
                    _maxY = 0;
                    _minY = 10;
                }
            }
        }
    }
}

```

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Détection du mouvement : Orientation</h2>
    <div class="title_footer"></div>
</div> 

<br>

```javascript
function orientationCallBack_(event){
    // On ne tien comptes des pas que si le téléphone est à plat => abs(gamma) < 20 && abs(beta) < 20
    // Le alpha représente la bousolle et nous permet de savoir où l'on est dirigé
    _trackAcceleration = Math.abs(event.beta) < CONST.motion.LIMIT_ORIENTATION
        && Math.abs(event.gamma) < CONST.motion.LIMIT_ORIENTATION;
    var orientationAlert = Math.abs(event.beta) >= CONST.motion.LIMIT_ORIENTATION_ALERT
        || Math.abs(event.gamma) >= CONST.motion.LIMIT_ORIENTATION_ALERT; 
    _orientation = event.alpha;
    if (Model.gameModel.parameters.motion && orientationAlert && !Model.gameModel.parameters.wrongOrientation){
        Model.gameModel.parameters.wrongOrientation = true;
    }else if (Model.gameModel.parameters.motion && !orientationAlert && Model.gameModel.parameters.wrongOrientation){
        Model.gameModel.parameters.wrongOrientation = false;
    }
}

```

https://bugs.chromium.org/p/chromium/issues/detail?id=562571

##==##

<!-- .slide: data-background="./assets/images/mario_again.jpg" data-state="hidefooter" class="transition"-->

Notes:
Expliquer la solution de fallback

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Stats</h2>
    <div class="title_footer"></div>
</div> 

<br>

![center w-1000](./assets/images/users_devquest.png)

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Stats</h2>
    <div class="title_footer"></div>
</div> 

<br>

* 134 Utilisateurs <!-- .element: class="uncheck notrayed" -->
* 36 scores <!-- .element: class="uncheck notrayed" -->

Notes:
Expliquer pourquoi

##==##

<!-- .slide: data-background="./assets/images/background_sans_stands.png" data-state="hidefooter" class="transition"-->

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Axes d'amélioration</h2>
    <div class="title_footer"></div>
</div> 

<div class="anim_townfolk anim"></div>

##==##

<div class="row_container important">
    <div class="title_header"></div>
    <h2>Quoi faire ? </h2>
    <div class="title_footer"></div>
</div> 

<br>

* Marketing ! <!-- .element: class="fragment" -->
* Ajout d'une aide dans le jeux <!-- .element: class="fragment" -->
* Logos des stands sur les maisons <!-- .element: class="fragment" -->
* Affichage des points <!-- .element: class="fragment" -->
* Indicateurs visuels sur l'état du jeux <!-- .element: class="fragment" -->
* Utiliser un moteur javascript ? jeux =  425Kb <!-- .element: class="fragment" -->


##==##

<!-- .slide: class="last-slide" -->



# <!-- .element: class="topic-title" --> Game Over

<!-- .element: class="presenter" --> **Jean-François Garreau  **

<!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur SQLI  

<!-- .element: class="email" --> **jef**@gdgnantes.com  

<!-- .element: class="thank-message" --> http://goo.gl/8njYM1  
