<!-- .slide: data-background="/assets/images/super_hero_fotolia.png" data-state="hidefooter" class="transition first-slide" -->

# Les nouveaux supers pouvoirs du web

### 2015.02.05 DevFest @ **Paris**

<div class="copyright white">fotolia</div>

##==##

<!-- .slide: class="who-am-i" data-state="quit-question"-->

## Qui suis-je ?

### Jean-François GARREAU

<!-- .element: class="descjf" -->
IoT Manager, Senior innovation developper & Community Manager

![avatar w-300 wp-200](/assets/images/jf.jpg)


![company_logo](/assets/images/sqli_logo.png)
![gdg_logo](/assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](http://twitter.com/jefBinomed)

<!-- .element: class="gplus" -->
[+JeanFrancoisGarreau](http://plus.google.com/+JeanFrancoisGarreau)

##==##

<!-- .slide: data-background="/assets/images/once-upon-a-time.jpg" data-state="hidefooter" class="transition"-->

##==##

<!-- .slide: data-background="/assets/images/HTML5_yellow_detail.jpg" data-state="hidefooter" class="transition"-->

# Un combat vieux comme le monde

<div class="copyright black">from digital</div>


##==##
<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-700](/assets/images/civil_war.jpg)

##==##

# Un combat inégal au début

<br><br>

![center](/assets/images/native-app-illustration_1x.jpg)


##==##

<!-- .slide: class="flex-p" -->

# Elles se croyaient au dessus de tout ! 


![h-300](/assets/images/irondroid.jpg)
![h-300](/assets/images/ironman-osx_240.jpg)

<div class="copyright black">_IronDroid_, Jamie BiversProduct</div>

##==##


# Mais ça c'était avant


![h-500 center](/assets/images/html5-superheros.png)

##==##

<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-700](/assets/images/inception_webapp.jpg)


##==##


## De quoi parle-t-on ?


* Sensors : 
 * Geolocation
 * Gyroscope / Accelometer / Compass
 * Proximity
 * ...

<br>

* Nouvelles possibilités : 
 * Offline
 * Base de données
 * Raccourcis applicatifs


##==##

<!-- .slide: data-state="quit-question" -->

## Et si on jouait ?

![h400 float-left](/assets/images/Fil_rouge.jpg)

![h400 binomed](/assets/images/qr_code_jeux.png)

![h400 rawgit](/assets/images/qr_code_jeux_rawgit.png)

<br>

<div class="url_jeux binomed grey">http://goo.gl/iQiTvZ</div>
<div class="url_jeux rawgit grey">https://goo.gl/Kp7Cyi</div>


##==##

<!-- .slide: data-background="/assets/images/qui_veut_gagner_argent_en_masse.png" data-state="hidefooter" class="transition qui-veut-gagner" data-state="question-1"-->

<div class="url_jeux binomed">http://goo.gl/iQiTvZ</div>
<div class="url_jeux rawgit">https://goo.gl/Kp7Cyi</div>


<div class="qui-veut-gagner">
    <div class="question two-line"> Grâce à quoi puis-je lancer une application web si je suis à proximité d'une balise bluettooth ? </div>
    <div class="row">
        <div class="resp repA"> IBeacon</div>
        <div class="resp repB"> Physical Web</div>
    </div>
    <div class="row">
        <div class="resp repC"> Ok Google</div>
        <div class="resp repD"> La réponse D</div>
    </div>
</div>

##==##

<!-- .slide: data-background="/assets/images/qui_veut_gagner_argent_en_masse.png" data-state="hidefooter" class="transition qui-veut-gagner" data-state="resp-question-1"-->

<div class="url_jeux binomed">http://goo.gl/iQiTvZ</div>
<div class="url_jeux rawgit">https://goo.gl/Kp7Cyi</div>


<div class="qui-veut-gagner">
    <canvas id="chart_question_1" width="200" height="200" class="chart-resp"></canvas>
   <div class="question two-line"> Grâce à quoi puis-je lancer une application web si je suis à proximité d'une balise bluettooth ? </div>
    <div class="row">
        <div class="resp repA"> IBeacon</div>
        <div class="resp repB good"> Physical Web</div>        
    </div>
    <div class="row">
        <div class="resp repC"> Ok Google</div>
        <div class="resp repD"> La réponse D</div>     
    </div>
</div>

##==##

<!--
//    _____  _               _           ___          __  _      
//   |  __ \| |             (_)         | \ \        / / | |     
//   | |__) | |__  _   _ ___ _  ___ __ _| |\ \  /\  / /__| |__   
//   |  ___/| '_ \| | | / __| |/ __/ _` | | \ \/  \/ / _ \ '_ \  
//   | |    | | | | |_| \__ \ | (_| (_| | |  \  /\  /  __/ |_) | 
//   |_|    |_| |_|\__, |___/_|\___\__,_|_|   \/  \/ \___|_.__/  
//                  __/ |                                        
//              |___/                                        
 -->

<!-- .slide: class="transition-black" data-state="quit-question" -->

# Le Physical Web

![icon](assets/images/physical_web.png)

##==##

<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-700](/assets/images/inception_physical_web.jpg)



##==## 

## Physical Web

### Origines & possibilités

 * Apparu en 2015 : [Projet Physical Web](https://google.github.io/physical-web/)
 * Basé sur Eddystone et plus précisement sur les [Eddystone-URL](https://github.com/google/eddystone/tree/master/eddystone-url)
 * S'utilise avec des devices BLE
 * A besoin d'une application détectant le physical Web (Chrome / Firefox)

##==## 

## Physical Web

### Restrictions 

 * Site accessible sur l'internet mondial
 * L'url est limité par la norme eddystone => Il vaut mieux utiliser des shorts urls
 * Avant BLE 4.1, le device doit changer de mode pour échanger avec le téléphone une fois la détection effecutée
 * Doit être activé dans chrome (chrome://flags)

##==##

<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-600](/assets/images/demo_time.jpg)

##==##


## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop unsupport">-</div>
    <div class="os partial">-</div>
    <div class="android-dev">48+</div>
    <div class="ios">44+</div>
  </div>
  <div class="firefox">
    <div class="desktop unsupport">-</div>
    <div class="os partial">-</div>
    <div class="android unsupport">-</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">-</div>
  </div>
  <div class="ie">
    <div class="old unsupport">-</div>
    <div class="new unsupport">-</div>
  </div>
  <div class="safari">
    <div class="ios unsupport">-</div>
  </div>
</div>

##==##

<!--
//    ____  _            _              _   _     
//   |  _ \| |          | |            | | | |    
//   | |_) | |_   _  ___| |_ ___   ___ | |_| |__  
//   |  _ <| | | | |/ _ \ __/ _ \ / _ \| __| '_ \ 
//   | |_) | | |_| |  __/ || (_) | (_) | |_| | | |
//   |____/|_|\__,_|\___|\__\___/ \___/ \__|_| |_|
//                                                
//                                                  
-->     

<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-600](/assets/images/inception_bluetooth.jpg)

##==##

<!-- .slide: class="transition-black" -->

# Web Bluetooth

![icon](assets/images/bluetooth_logo.png)


##==##

## Web Bluetooth

### Un peu de vocabulaire !

* **GATT** : Generic Attribute Profile 

* **ATT** : Attribute Protocol

* Un device bluetooth expose plusieurs services

* Chaque service expose plusieurs caractérisques

* Chaque caractéristique peut être lue / écrite / passée en mode notification (en fonction de sa configuration)

* Chaque devices / services / caractérisques sont identifés par des uuid

##==##

### Utilisation

* Https Only
* Activation dans chrome via les flags
* Accès à l'objet ```navigator.bluetooth```
* Basé sur les promises


[activation webbluetooth sous lolippo](http://stackoverflow.com/questions/34810194/can-i-try-web-bluetooth-on-chrome-for-android-lollipop)

##==##

## Récupération par nom de service

```javascript
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {...})
.catch(error => { console.log(error); });
```

##==##

## Récupération par nom de device

```javascript
navigator.bluetooth.requestDevice({ filters: [{ name: ['MyDevice'] }] })
.then(device => {...})
.catch(error => { console.log(error); });
```

##==##

## Connexion à un device

```javascript
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  return device.connectGATT();
})
.catch(error => { console.log(error); });
```


##==##

## Lecture d'une caractéristique

```javascript
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  return device.connectGATT();
})
.then(service => {
  // Getting Battery Level Characteristic...
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Reading Battery Level...
  return characteristic.readValue();
})
.then(value => {
  // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
  value = value.buffer ? value : new DataView(value);
  console.log('Battery percentage is ' + value.getUint8(0));
})
.catch(error => { console.log(error); });
```


##==##

## Ecrire dans une caractéristique

```javascript
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.connectGATT())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_control_point'))
.then(characteristic => {
  // Writing 1 is the signal to reset energy expended.
  var resetEnergyExpended = new Uint8Array([1]);
  return characteristic.writeValue(resetEnergyExpended);
})
.then(() => {
  console.log('Energy expended has been reset.');
})
.catch(error => { console.log(error); });
```

##==##

<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-600](/assets/images/demo_time.jpg)

##==##


## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop unsupport">-</div>
    <div class="os">45+</div>
    <div class="chromium">48+</div>
    <div class="android-dev">48+</div>
  </div>
  <div class="firefox">
    <div class="desktop unsupport">-</div>
    <div class="os partial">draft</div>
    <div class="android unsupport">-</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">Consider</div>
  </div>
  <div class="ie">
    <div class="old unsupport">-</div>
    <div class="new unsupport">-</div>
  </div>
  <div class="safari">
    <div class="ios unsupport">-</div>
  </div>
</div>


##==##

<!--
//                                      
//                                      
//    ___  ___ _ __  ___  ___  _ __ ___ 
//   / __|/ _ \ '_ \/ __|/ _ \| '__/ __|
//   \__ \  __/ | | \__ \ (_) | |  \__ \
//   |___/\___|_| |_|___/\___/|_|  |___/
//                                      
//     
-->

<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-600](/assets/images/inception_sensors.jpg)

##==##

<!-- .slide: class="transition-black" data-state="quit-question"-->


# Sensors 

![icon](assets/images/html5-device-access-logo.png)


##==##

<!-- .slide: data-background="/assets/images/qui_veut_gagner_argent_en_masse.png" data-state="hidefooter" class="transition qui-veut-gagner" data-state="question-2"-->

<div class="url_jeux binomed">http://goo.gl/iQiTvZ</div>
<div class="url_jeux rawgit">https://goo.gl/Kp7Cyi</div>


<div class="qui-veut-gagner">
    <div class="question two-line"> Lequel de ces sensors n'est pas accessible depuis le web ?</div>
    <div class="row">
        <div class="resp repA"> Magnetometre</div>
        <div class="resp repB"> Accelerometre</div>
    </div>
    <div class="row">
        <div class="resp repC"> Bluetooth</div>
        <div class="resp repD"> La réponse D</div>
    </div>
</div>

##==##

<!-- .slide: data-background="/assets/images/qui_veut_gagner_argent_en_masse.png" data-state="hidefooter" class="transition qui-veut-gagner" data-state="resp-question-2"-->

<div class="url_jeux binomed">http://goo.gl/iQiTvZ</div>
<div class="url_jeux rawgit">https://goo.gl/Kp7Cyi</div>


<div class="qui-veut-gagner">
    <canvas id="chart_question_2" width="200" height="200" class="chart-resp"></canvas>
    <div class="question two-line"> Lequel de ces sensors n'est pas accessible depuis le web ?</div>
    <div class="row">
        <div class="resp repA good"> Magnetometre</div>
        <div class="resp repB "> Accelerometre</div>        
    </div>
    <div class="row">
        <div class="resp repC"> Bluetooth</div>
        <div class="resp repD"> La réponse D</div>     
    </div>
</div>


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

<!-- .slide: class="transition-black" data-state="quit-question"-->


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

<br>

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
<!-- .slide: data-state="stop-orientation" -->

## Orientation

### Cas Pratique

![center w-600](assets/images/combination-lock-icon.jpg)


##==##
<!-- .slide: data-state="start-orientation" -->

## Orientation

<div class="sensorExample">
  <div class="orientation">
    <div class="safe_lock_funny_win visible-md visible-lg"></div>
    <div class="safe_lock_door">
      <div class="safe_lock_bg"></div>
      <div class="safe_lock"></div>
    </div>
    <div class="resp">
      <div class="value"></div>     
      <div class="chevrons">
        <i class="first fa fa-times-circle"></i> 
        <i class="second fa fa-times-circle"></i> 
        <i class="third fa fa-times-circle"></i> 
      </div>
    </div>
  </div>
</div>



##==##
<!-- .slide: data-state="stop-orientation"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">28+</div>
    <div class="os">28+</div>
    <div class="android-beta">28+</div>
    <div class="ios">28+</div>
  </div>
  <div class="firefox">
    <div class="desktop">28+</div>
    <div class="os">28+</div>
    <div class="android">28+</div>
    <div class="ios">28+</div>
  </div>
  <div class="edge">
    <div class="desktop">28+</div>
  </div>
  <div class="ie">
    <div class="old">7</div>
    <div class="new">9</div>
  </div>
  <div class="safari">
    <div class="ios unsupport">-</div>
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

<!-- .slide: data-state="stop-devicemotion" -->

## Device Orientation

### Cas pratique

![center w-800](assets/images/chargebatterylonger.jpg)



##==##

<!-- .slide: data-state="start-devicemotion" -->

## DeviceMotion


<div class="sensorExample">
  <div class="devicemotion">
    <div class="team">
      <div class="battery-parent">
        <div id="battery-1"></div>
        <div class="team-name">Team Firefox</div>
      </div>
    </div>
    <div class="team">
      <div class="battery-parent">
        <div id="battery-2"></div>
        <div class="team-name">Team Chrome</div>
      </div>
    </div>
    <div class="win firefox"></div>
    <div class="win chrome"></div>
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

<!-- .slide: class="transition-black" data-state="stop-devicemotion"-->

# Proximity

![icon](assets/images/proximity.jpg)

##==##

## Proximity

Firefox uniquement ! 

* Renvoie des valeurs entre 0 et 5 (0 étant proche)



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

<!-- .slide: data-state="start-proximity" -->

## Proximity

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


<!-- .slide: class="transition-black" data-state="stop-proximity" -->

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

<!-- .slide: data-state="stop-light" -->

## Light

### Cas pratique

![center w-400](assets/images/Hanging_Bulb.jpg)



##==##

<!-- .slide: data-state="start-light" -->

## Light


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

<!-- .slide: class="transition-black" data-state="stop-light"-->

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
<!-- .slide: data-state="start-usermedia" -->

## User Media


<div class="sensorExample">
  <div id="usermedia">
    <div class="videoParent">
    <img id="photoStream">
      
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

<!-- .slide: class="transition-black" data-state="stop-usermedia" -->

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

## Vibration


<div class="sensorExample">
  <div id="vibration">
    <input id='inputMorseText' class='form-control' type='text' placeholder='saisissez un texte et tapez sur Entrée....'>
  </div>
</div>

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
<!-- .slide: data-state="stop-webspeech" -->

## Web Speech API

### Cas pratique

![center w-600](assets/images/background.png)


##==##
<!-- .slide: data-state="start-webspeech" -->

## Web Speech API

<div class="sensorExample">
  <div id="webspeech">
    <canvas id='canvasWebSpeech'>
  </div>
</div>



##==##

<!-- .slide: class="last-slide" data-state="stop-webspeech" -->



# <!-- .element: class="topic-title" --> Topic Title 

<!-- .element: class="presenter" --> **Jean-François Garreau  **

<!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur SQLI  

<!-- .element: class="email" --> **jef**@gdgnantes.com  

<!-- .element: class="thank-message" --> Merci  
