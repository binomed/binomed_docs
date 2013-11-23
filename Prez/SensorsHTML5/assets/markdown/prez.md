<div class="first-slide"></div>

# **Workshop HTML5**

## 2013 

### 2013.11.26 Stereolux @ **Nantes**


##==##

<div class="title"></div>

# **Sensors & HTML5**

## WorkShop HTML5 @ Stéréolux 2013

### GDG Nantes & Stéréolux - 2013

![title](/assets/images/html5-device-access-logo.png)

<footer/>


##==##
## Qui suis-je ?

###  Jean-François GARREAU

![avatar center w-300 wp-200](/assets/images/jf.jpg)


![company_logo](/assets/images/sqli_logo.png)
![gdg_logo](/assets/images/GDG-Logo-carre.png)

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


## Programme ## 

<div class="no-bullet"></div>

* Un peu de théorie
* Installation des environnements
* Orientation API
* Device Motion API
* Light API
* Proximity API
* GetUserMedia
* Vibration API
* WebSpeech API

<footer/>

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
<div class='transition'></div>

# Un peu de théorie

![icon](assets/images/HTML5_Device_Access.png)

##==##


## Device Access

### Kesako ?

* Geolocation

 <br>

* Gyroscope / Accelometer / Compass

 <br>

* Media Capture

 <br>

* Battery Status API

 <br>

* Vibration API

 <br>

* Ambient Light

 <br>

* Proximity Event


<footer/>

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

<div class='transition'></div>

#  Environnement


![icon](assets/images/nodejs.png)


##==##

## Environnement

* Installer NodeJS : http://nodesjs.org
  * Penser à ajouter node au Path de l'environnement

<br>

* Installer sur son mobile : 
 * Chrome Beta
 * FireFox

<br>

* Installer Chrome ou Firefox sur son pc.

<br>

* Activer les fonctionnalités javascript expérimentales sous Chrome Beta : 
 * Nouvel Onglet 
 * chrome://flags

<br>

* Désactiver les rotations automatiques des téléphones !

<footer/>

##==##

## Environnement

* Récupérer le projet sur github : http://goo.gl/nbh1y9

<br>

* Clonnez le répository ou alors récupérer le zip (Download ZIP)

* Copier le contenu du répertoire 'CodeLab/00-Base' dans le répertoire de votre choix

<br>

* Ouvrir une ligne de commande et faire : 

```sh
$ cd leCheminJusquauRepertoireCopié

$ npm install

$ node server.js
```

* Ouvrir votre navigateur sur l'url : http://localhost:8080/html

<footer/>

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

<div class='transition'></div>

# Device Orientation

![icon](assets/images/device-orientation.jpg)

##==##

## Device Orientation

3 Axes : **Alpha, Gamma, Beta**

Se fait à plat ! 

<br><br><br>

![float-left w-300](assets/images/device-orientation-z.jpg)

![float-left w-300](assets/images/device-orientation-y.jpg)

![float-left w-300](assets/images/device-orientation-x.jpg)

<footer/>

<aside class="notes">
Subtilité : ça marche mieux si le téléphone est a plat
</aside>

##==##

## Device Orientation


* rendez vous dans /javascript/components/orientation.js
<br><br>

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

<footer/>

<aside class="notes">
Subtilité : ça marche mieux si le téléphone est a plat
</aside>

##==##

## Orientation

### Cas Pratique

![center w-800](assets/images/combination-lock-icon.jpg)

<footer/>

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

<div class='transition'></div>

# Device Motion API

![icon](assets/images/device_motion.jpg)

##==##

## Device Motion API

![center w-800](assets/images/device_motion.jpg)

<br>
On peut tenir comptes de l'accélération classique ou avec prise en charge de la gravité !

<footer/>

<aside class="notes">

</aside>

##==##

## Device Motion API


On s'intéresse à l'accélération x

* rendez vous dans /javascript/components/devicemotion.js

<br><br>


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

<footer/>

##==##

## Device Orientation

### Cas pratique

![center w-800](assets/images/chargebatterylonger.jpg)

<footer/>

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

<div class='transition'></div>

# Proximity

![icon](assets/images/proximity.jpg)

##==##

## Proximity

Firefox uniquement ! 

* Renvoie des valeurs entre 0 et 5 (0 étant proche)

* rendez vous dans /javascript/components/proximity.js

<br><br>


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

<footer/>

##==##

## Proximity

### Cas pratique

![center w-800](assets/images/push-button.jpg)

<footer/>

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


<div class='transition'></div>

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

<br><br>

```javascript
var deviceLightHandler = function(event) {
 var value = Math.min(45, event.value);
 percent = Math.round((value / 45) * 100);
 socket.sendLight(percent); 
 updateLight();
}

window.addEventListener('devicelight', deviceLightHandler, false);
```

<footer/>

##==##

## Light

### Cas pratique

![center w-400](assets/images/Hanging_Bulb.jpg)

<footer/>

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

<div class='transition'></div>

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
<br>

* Devient intéressant s'il est mixé avec des effets ou des canvas.

<footer/>

<aside class="notes">

</aside>

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


<footer/>

<aside class="notes">

</aside>

##==##

## User Media

### Cas pratique

![center w-400](assets/images/css3-transform-rotateX-perspective.png)

<footer/>

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

<div class='transition'></div>

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

<footer/>

##==##

## Vibration

### Cas pratique

![center w-400](assets/images/morse1.jpg)

<footer/>

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

<div class='transition'></div>

# Web Speech API

![icon](assets/images/voice-recognition.js.png)

##==##

## Web Speech

* Uniquement sur Chrome

* Un tag existe pour gagner en code 

```html
<input x-webkit-speech>
```

<br>

* Il reste plus intéressant d'utiliser la librairie Javascript

* Manque encore cependant de précision pour de la commande vocale => avoir des textes approximatifs de détection

```javascript
var recognition = new webkitSpeechRecognition();
recognition.lang = 'fr-FR';
recognition.continuous = true;
recognition.interimResults = true;
```

<footer/>

##==##

## Web Speech API

### Cas pratique

![center w-600](assets/images/background.png)

<footer/>


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

<div class="last-slide"></div>

<div class="topic-title"></div>

# Sensor & HTML5

<div class="presenter"></div>

# **Jean-François Garreau**

<div class="gdg-rule"></div>

# GDG Nantes Leader

<div class="work-rule"></div>

# Ingénieur SQLI  : @binomed / http://gplus.to/jefBinomed 

<div class="thank-message"></div>

# **Merci**

![avatar](/assets/images/jf.jpg)
