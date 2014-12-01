

<!-- .slide: class="first-slide" -->

# **DevFest Nantes**

### 2014.12.18 SQLI @ **Nantes**

![title](assets/images/html5-device-access-logo.png)

##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

###  Jean-François GARREAU

![avatar center w-300 wp-200](assets/images/jf.jpg)


![company_logo](assets/images/sqli_logo.png)
![gdg_logo](assets/images/GDG-Logo-carre.png)



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


## Programme ## 

<div class="no-bullet"></div>

* Devfest ?
* Myo
* LeapMotion
* Sensors & WebSockets
* Arduino



<!--<script type="text/javascript">helloSommaire();</script>-->

##==##

<!--
//  _______ _    _ ______ ____  _____  _____ ______ 
// |__   __| |  | |  ____/ __ \|  __ \|_   _|  ____|
//    | |  | |__| | |__ | |  | | |__) | | | | |__   
//    | |  |  __  |  __|| |  | |  _  /  | | |  __|  
//    | |  | |  | | |___| |__| | | \ \ _| |_| |____ 
//    |_|  |_|  |_|______\____/|_|  \_\_____|______|
//                                                 
-->     
<!-- .slide: class="transition-black" -->

# DevFest

![icon](assets/images/HTML5_Device_Access.png)

##==##


## Device Access

### Kesako ?

* Geolocation

* Gyroscope / Accelometer / Compass

* Media Capture

* Battery Status API

* Vibration API

* Ambient Light

* Proximity Event




##==##

<!--
//    ______ _   ___      _______ _____   ____  _   _ _   _ ______ __  __ ______ _   _ _______ 
//   |  ____| \ | \ \    / /_   _|  __ \ / __ \| \ | | \ | |  ____|  \/  |  ____| \ | |__   __|
//   | |__  |  \| |\ \  / /  | | | |__) | |  | |  \| |  \| | |__  | \  / | |__  |  \| |  | |   
//   |  __| | . ` | \ \/ /   | | |  _  /| |  | | . ` | . ` |  __| | |\/| |  __| | . ` |  | |   
//   | |____| |\  |  \  /   _| |_| | \ \| |__| | |\  | |\  | |____| |  | | |____| |\  |  | |   
//   |______|_| \_|   \/   |_____|_|  \_\\____/|_| \_|_| \_|______|_|  |_|______|_| \_|  |_|   
//                                                                                             
//      
-->

<!-- .slide: class="transition-black" -->

#  Environnement


![icon](assets/images/nodejs.png)


##==##

## Environnement

* Installer NodeJS : http://nodesjs.org
  * Penser à ajouter node au Path de l'environnement

* Installer sur son mobile : 
 * Chrome Beta
 * FireFox

* Installer Chrome ou Firefox sur son pc.

* Activer les fonctionnalités javascript expérimentales sous Chrome Beta : 
 * Nouvel Onglet 
 * chrome://flags

* Désactiver les rotations automatiques des téléphones !



##==##

## Environnement

* Récupérer le projet sur github : http://goo.gl/nbh1y9

* Clonnez le répository ou alors récupérer le zip (Download ZIP)

* Copier le contenu du répertoire 'CodeLab/00-Base' dans le répertoire de votre choix

* Ouvrir une ligne de commande et faire : 

<!-- .element: class="big-code" -->
```sh
$ cd leCheminJusquauRepertoireCopié
$ npm install
$ node server.js
```

* Ouvrir votre navigateur sur l'url : http://localhost:8080/html



##==##

<!--
//     ____  _____  _____ ______ _   _ _______    _______ _____ ____  _   _ 
//    / __ \|  __ \|_   _|  ____| \ | |__   __|/\|__   __|_   _/ __ \| \ | |
//   | |  | | |__) | | | | |__  |  \| |  | |  /  \  | |    | || |  | |  \| |
//   | |  | |  _  /  | | |  __| | . ` |  | | / /\ \ | |    | || |  | | . ` |
//   | |__| | | \ \ _| |_| |____| |\  |  | |/ ____ \| |   _| || |__| | |\  |
//    \____/|_|  \_\_____|______|_| \_|  |_/_/    \_\_|  |_____\____/|_| \_|
//                                                                          
//   
-->

<!-- .slide: class="transition-black" -->

# Device Orientation

![icon](assets/images/device-orientation.jpg)

##==##

## Device Orientation

3 Axes : **Alpha, Gamma, Beta**

Se fait à plat ! 

<br>

![float-left w-300](assets/images/device-orientation-z.jpg)

![float-left w-300](assets/images/device-orientation-y.jpg)

![float-left w-300](assets/images/device-orientation-x.jpg)



Notes:
Subtilité : ça marche mieux si le téléphone est a plat


##==##

## Device Orientation


* rendez vous dans /javascript/components/orientation.js


```javascript
if(window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", process, false);
} else {
  // Le navigateur ne supporte pas l'événement deviceorientation
}

function process(event) {
  var alpha = event.alpha;
  var beta = event.beta;
  var gamma = event.gamma;
   
}
```



Notes:
Subtilité : ça marche mieux si le téléphone est a plat


##==##

## Orientation

### Cas Pratique

![center w-800](assets/images/combination-lock-icon.jpg)



##==##

## Orientation

<div class="controlsSensor">
  <div id="startOrientation" class='btnStart push_button'>Demarer</div>
  <div id="stopOrientation" class='btnStop push_button'>Arrêter</div>
</div>
<div class="sensorExample">
  <div class="orientation">
    <div class="safe_lock_funny_win visible-md visible-lg"></div>
    <div class="safe_lock_door">
      <div class="safe_lock_bg"></div>
      <div class="safe_lock"></div>
    </div>
  </div>
</div>



##==##

<!--
//    _____  ________      _______ _____ ______   __  __  ____ _______ _____ ____  _   _ 
//   |  __ \|  ____\ \    / /_   _/ ____|  ____| |  \/  |/ __ \__   __|_   _/ __ \| \ | |
//   | |  | | |__   \ \  / /  | || |    | |__    | \  / | |  | | | |    | || |  | |  \| |
//   | |  | |  __|   \ \/ /   | || |    |  __|   | |\/| | |  | | | |    | || |  | | . ` |
//   | |__| | |____   \  /   _| || |____| |____  | |  | | |__| | | |   _| || |__| | |\  |
//   |_____/|______|   \/   |_____\_____|______| |_|  |_|\____/  |_|  |_____\____/|_| \_|
//                                                                                       
//    
-->

<!-- .slide: class="transition-black" -->

# Device Motion API

![icon](assets/images/device_motion.jpg)

##==##

## Device Motion API

![center w-800](assets/images/device_motion.jpg)

On peut tenir comptes de l'accélération classique ou avec prise en charge de la gravité !



Notes:



##==##

## Device Motion API


On s'intéresse à l'accélération x

* rendez vous dans /javascript/components/devicemotion.js



```javascript
// Listener of devieMotion
var deviceMotionListener = function(event){        
  var x = event.acceleration.x;
  var y = event.acceleration.y;
  var z = event.acceleration.z;
  socket.sendDeviceMotion(Math.abs(x));
  currentPercent+=Math.abs(x);
  updatePercent();
}

// We add the listener
function register(){
  window.addEventListener('devicemotion', deviceMotionListener, false);
}
```



##==##

## Device Orientation

### Cas pratique

![center w-800](assets/images/chargebatterylonger.jpg)



##==##

## DeviceMotion

<div class="controlsSensor">
  <div id="startDeviceMotion" class='btnStart push_button'>Demarer</div>
  <div id="stopDeviceMotion" class='btnStop push_button'>Arrêter</div>
</div>
<div class="sensorExample">
  <div class="devicemotion">  
    <div class="devicemotion-percent"></div>
    <div class="devicemotion-bg"></div>
  </div>
</div>



##==##

<!--
//    _____  _____   ______   _______ __  __ _____ _________     __
//   |  __ \|  __ \ / __ \ \ / /_   _|  \/  |_   _|__   __\ \   / /
//   | |__) | |__) | |  | \ V /  | | | \  / | | |    | |   \ \_/ / 
//   |  ___/|  _  /| |  | |> <   | | | |\/| | | |    | |    \   /  
//   | |    | | \ \| |__| / . \ _| |_| |  | |_| |_   | |     | |   
//   |_|    |_|  \_\\____/_/ \_\_____|_|  |_|_____|  |_|     |_|   
//                                                                 
//    
-->

<!-- .slide: class="transition-black" -->

# Proximity

![icon](assets/images/proximity.jpg)

##==##

## Proximity

Firefox uniquement ! 

* Renvoie des valeurs entre 0 et 5 (0 étant proche)

* rendez vous dans /javascript/components/proximity.js



```javascript
var deviceProximityHandler = function(event) {
  var value = Math.round(event.value);            
  socket.sendProximity(value);
  manageProximityValue(value);
}

function register(){
  window.addEventListener('deviceproximity', deviceProximityHandler, false);
}

function unregister(){
  window.removeEventListener('deviceproximity', deviceProximityHandler, false);
}
```



##==##

## Proximity

### Cas pratique

![center w-800](assets/images/push-button.jpg)



##==##

## Proximity

<div class="controlsSensor">
  <div id="startProximity" class='btnStart push_button'>Demarer</div>
  <div id="stopProximity" class='btnStop push_button'>Arrêter</div>
</div>
<div class="sensorExample">
  <div id="proximity">
    <div class="push_button">Push Me ! </div>
  </div>
</div>




##==##

<!--
//    _      _____ _____ _    _ _______ 
//   | |    |_   _/ ____| |  | |__   __|
//   | |      | || |  __| |__| |  | |   
//   | |      | || | |_ |  __  |  | |   
//   | |____ _| || |__| | |  | |  | |   
//   |______|_____\_____|_|  |_|  |_|   
//                                      
//   
-->


<!-- .slide: class="transition-black" -->

# Light 

![icon](assets/images/light_detector.jpg)

##==##


## Light

Firefox uniquement ! 

* Renvoie des valeurs entre 0 et > 1000 (0 étant sombre)

* Est dépendant du téléphone et de l'implementation

* On a 2 façon de faire =>
 * Gestion par valeur
 * Gestion par états : Dim / Normal / Bright

* rendez vous dans /javascript/components/light.js


```javascript
var deviceLightHandler = function(event) {
 var value = Math.min(45, event.value);
 percent = Math.round((value / 45) * 100);
 socket.sendLight(percent); 
 updateLight();
}

window.addEventListener('devicelight', deviceLightHandler, false);
```



##==##

## Light

### Cas pratique

![center w-400](assets/images/Hanging_Bulb.jpg)



##==##

## Light

<div class="controlsSensor">
  <div id="startLight" class='btnStart push_button'>Demarer</div>
  <div id="stopLight" class='btnStop push_button'>Arrêter</div>
</div>
<div class="sensorExample">
   <div id="light">
    <div class="light-bg"></div>
  </div>
</div>




##==##

<!--
//    _    _  _____ ______ _____    __  __ ______ _____ _____          
//   | |  | |/ ____|  ____|  __ \  |  \/  |  ____|  __ \_   _|   /\    
//   | |  | | (___ | |__  | |__) | | \  / | |__  | |  | || |    /  \   
//   | |  | |\___ \|  __| |  _  /  | |\/| |  __| | |  | || |   / /\ \  
//   | |__| |____) | |____| | \ \  | |  | | |____| |__| || |_ / ____ \ 
//    \____/|_____/|______|_|  \_\ |_|  |_|______|_____/_____/_/    \_\
//                                                                     
//    
-->

<!-- .slide: class="transition-black" -->

# User Media

![icon](assets/images/camera_icon.jpg)

##==##

## User Media

* Encore dépendant des navigateurs ! Modernizr à la rescousse.

* Possibilité de préciser ce qu'on récupère et on peut séparer les flux ! 

```javascript
var vgaConstraints = {
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 360
    }
  }
};
```

* Devient intéressant s'il est mixé avec des effets ou des canvas.



Notes:



##==##

## User Media

* rendez vous dans /javascript/components/usermedia.js

```javascript
// We define the video constraints
var constraints = {video: true};

// We get the correct navigator method
var gUM = Modernizr.prefixed('getUserMedia', navigator);

// We manage an error while getting the stream
function handleUserMediaError(error){
  console.log('navigator.getUserMedia error: ', error);
}

// We manage the success of getting the stream
function handleUserMedia(stream){
  localStream = stream;
  video.src = window.URL.createObjectURL(stream);
  video.play();
  videoParent.addClass('rotate');
}

gUM(constraints, handleUserMedia, handleUserMediaError);

```




Notes:



##==##

## User Media

### Cas pratique

![center w-400](assets/images/css3-transform-rotateX-perspective.png)



##==##

## User Media

<div class="controlsSensor">
  <div id="startUserMedia" class='btnStart push_button'>Demarer</div>
  <div id="stopUserMedia" class='btnStop push_button'>Arrêter</div>
</div>
<div class="sensorExample">
  <div id="usermedia">
    <div class="videoParent">
      <video id="streamVideo" width="500px"></video>
    </div>
  </div>
</div>




##==##

<!--
//   __      _______ ____  _____         _______ _____ ____  _   _ 
//   \ \    / /_   _|  _ \|  __ \     /\|__   __|_   _/ __ \| \ | |
//    \ \  / /  | | | |_) | |__) |   /  \  | |    | || |  | |  \| |
//     \ \/ /   | | |  _ <|  _  /   / /\ \ | |    | || |  | | . ` |
//      \  /   _| |_| |_) | | \ \  / ____ \| |   _| || |__| | |\  |
//       \/   |_____|____/|_|  \_\/_/    \_\_|  |_____\____/|_| \_|
//                                                                 
//   
-->

<!-- .slide: class="transition-black" -->

# Vibration

![icon](assets/images/mobile-phone-vibration.jpg)

##==##

## Vibration

* Vibre selon un temps donné ! 

* Peut faire vibrer tout un ensmble de temps
 * n = temps à vibrer
 * n+1 = temps entre vibration n et n+2


```javascript
window.navigator.vibrate(arrayOfVibration);
```



##==##

## Vibration

### Cas pratique

![center w-400](assets/images/morse1.jpg)



##==##

<!--
//   __          __  _        _____                      _     
//   \ \        / / | |      / ____|                    | |    
//    \ \  /\  / /__| |__   | (___  _ __   ___  ___  ___| |__  
//     \ \/  \/ / _ \ '_ \   \___ \| '_ \ / _ \/ _ \/ __| '_ \ 
//      \  /\  /  __/ |_) |  ____) | |_) |  __/  __/ (__| | | |
//       \/  \/ \___|_.__/  |_____/| .__/ \___|\___|\___|_| |_|
//                                 | |                         
//   
-->

<!-- .slide: class="transition-black" -->

# Web Speech API

![icon](assets/images/voice-recognition.js.png)

##==##

## Web Speech

* Uniquement sur Chrome

* Un tag existe pour gagner en code 


```html
<input x-webkit-speech>
```


* Il reste plus intéressant d'utiliser la librairie Javascript

* Manque encore cependant de précision pour de la commande vocale => avoir des textes approximatifs de détection

```javascript
var recognition = new webkitSpeechRecognition();
recognition.lang = 'fr-FR';
recognition.continuous = true;
recognition.interimResults = true;
```



##==##

## Web Speech API

### Cas pratique

![center w-600](assets/images/background.png)




<!--
//     ____    _    _   ______    _____   _______   _____    ____    _   _    _____ 
//    / __ \  | |  | | |  ____|  / ____| |__   __| |_   _|  / __ \  | \ | |  / ____|
//   | |  | | | |  | | | |__    | (___      | |      | |   | |  | | |  \| | | (___  
//   | |  | | | |  | | |  __|    \___ \     | |      | |   | |  | | | . ` |  \___ \ 
//   | |__| | | |__| | | |____   ____) |    | |     _| |_  | |__| | | |\  |  ____) |
//    \___\_\  \____/  |______| |_____/     |_|    |_____|  \____/  |_| \_| |_____/ 
//                                                                                  
//   
-->

##==##

<!-- .slide: class="last-slide" -->


# <!-- .element: class="topic-title" --> Sensor & HTML5

# <!-- .element: class="presenter" --> **Jean-François Garreau  **

# <!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur SQLI  

# <!-- .element: class="email" --> **jfgarreau**@sqli.com | @jefBinomed | http://gplus.to/jefBinomed 

# <!-- .element: class="thank-message" --> Merci  

![avatar](assets/images/jf.jpg)
