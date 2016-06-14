<!-- .slide: data-background="./assets/images/super_hero_fotolia.png" data-state="hidefooter" class="transition first-slide" -->

# Les nouveaux supers pouvoirs du web

### 2016 

<div class="copyright white">fotolia</div>

##==##

<!-- .slide: class="who-am-i" data-state="quit-question"-->

## Qui suis-je ?

### Jean-François GARREAU

<!-- .element: class="descjf" -->
IoT Manager, Senior innovation developer & Community Manager

![avatar w-300 wp-200](./assets/images/jf.jpg)


![company_logo](./assets/images/sqli_logo.png)
![gdg_logo](./assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](http://twitter.com/jefBinomed)

<!-- .element: class="gplus" -->
[+JeanFrancoisGarreau](http://plus.google.com/+JeanFrancoisGarreau)

##==##

<!-- .slide: data-background="./assets/images/once-upon-a-time.jpg" data-state="hidefooter" class="transition"-->

##==##

<!-- .slide: data-background="./assets/images/HTML5_yellow_detail.jpg" data-state="hidefooter" class="transition"-->

# Un combat vieux comme le monde

<div class="copyright black">from digital</div>


##==##
<!--  .slide: data-background="./assets/images/civil_war_full.jpg" class="transition"-->


##==##

# Un combat inégal au début

<br><br>

![center](./assets/images/native-app-illustration_1x.jpg)


##==##

<!-- .slide: class="flex-p" -->

# Elles se croyaient au dessus de tout ! 


![h-300](./assets/images/irondroid.jpg)
![h-300](./assets/images/ironman-osx_240.jpg)

<div class="copyright black">_IronDroid_, Jamie BiversProduct</div>

##==##


# Mais ça c'était avant


![h-500 center](./assets/images/html5-superheros.png)

##==##

<!-- .slide: data-background="./assets/images/inception_webapp_full.jpg" class="transition"-->


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

<!-- .slide: class="transition-black"  -->

# Le Physical Web

![icon](./assets/images/physical_web.png)

##==##

<!-- .slide: data-background="./assets/images/inception_physical_web_full.jpg" class="transition"-->


##==## 

## Physical Web

### Origines & possibilités

 * Apparu en 2015 : [Projet Physical Web](https://google.github.io/physical-web/)
 * Basé sur Eddystone et plus précisément sur les [Eddystone-URL](https://github.com/google/eddystone/tree/master/eddystone-url)
 * S'utilise avec des devices BLE
 * A besoin d'une application détectant le physical Web (Chrome / Firefox)

##==## 

## Physical Web

### Restrictions 

 * Site accessible sur l'internet mondial
 * L'url est limité par la norme eddystone => Il vaut mieux utiliser des shorts urls
 * Avant BLE 4.1, le device doit changer de mode pour échanger avec le téléphone une fois la détection effectuée
 * Doit être activé dans chrome (chrome://flags)

##==##


## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop unsupport">-</div>
    <div class="os partial">-</div>
    <div class="android">49+</div>
    <div class="ios">44+</div>
  </div>
  <div class="firefox">
    <div class="desktop unsupport">-</div>
    <div class="os partial">draft</div>
    <div class="android unsupport">-</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="opera">
    <div class="desktop unsupport">-</div>
    <div class="android">32+</div>
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

<!-- .slide: data-background="./assets/images/inception_bluetooth_full.jpg" class="transition" data-state="quit-question"-->


##==##

<!-- .slide: class="transition-black" -->

# Web Bluetooth

![icon](./assets/images/bluetooth_logo.png)


##==##

## Web Bluetooth

### Un peu de vocabulaire !

* **GATT** : Generic Attribute Profile 

* **ATT** : Attribute Protocol

* Un device bluetooth expose plusieurs services

* Chaque service expose plusieurs caractéristiques

* Chaque caractéristique peut être lue / écrite / passée en mode notification (en fonction de sa configuration)

* Chaque devices / services / caractéristiques sont identités par des uuid

##==##

### Utilisation

* **Https** Only <!-- .element: style="color:red" -->
* **BLE** Only ! 
* Activation dans chrome via les flags : ```chrome://flags/#enable-web-bluetooth```
* Accès à l'objet ```navigator.bluetooth```
* Basé sur les promises
* [Documentation](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)

[activation webbluetooth sous lolipop](http://stackoverflow.com/questions/34810194/can-i-try-web-bluetooth-on-chrome-for-android-lollipop)

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
  return device.gatt.connect();
})
.catch(error => { console.log(error); });
```


##==##

## Lecture d'une caractéristique

```javascript
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  return device.gatt.connect();
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

## Écrire dans une caractéristique

```javascript
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
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

## Les webcomponents à la rescousse 

[+Francois Beaufort](https://plus.google.com/u/0/+FrancoisBeaufort) a écrit webcomponent pour se simplifier la chose


```html
<platinum-bluetooth-device services-filter='["battery_service"]'>
  <platinum-bluetooth-service service='battery_service'>
    <platinum-bluetooth-characteristic characteristic='battery_level'>
    </platinum-bluetooth-characteristic>
  </platinum-bluetooth-service>
</platinum-bluetooth-device>
```

```javascript
var bluetoothDevice = document.querySelector('platinum-bluetooth-device');
var batteryLevel = document.querySelector('platinum-bluetooth-characteristic');

button.addEventListener('click', function() {
  bluetoothDevice.request().then(function() {
    return batteryLevel.read().then(function(value) {
      console.log('Battery Level is ' + value.getUint8(0) + '%');
    });
  })
  .catch(function(error) { });
});
```

##==##

## Open source quand tu nous tiens !

[+Francois Beaufort](https://plus.google.com/u/0/+FrancoisBeaufort) a aussi écrit une application pour configurer les balises Physical Web : 

[Eddystone-Url Beacon Config](https://beaufortfrancois.github.io/sandbox/web-bluetooth/eddystone-url-config/index.html)

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
  <div class="opera">
    <div class="desktop unsupport">-</div>
    <div class="android">38+</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">consider</div>
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

<!-- .slide: data-background="./assets/images/inception_sensors_full.jpg" class="transition"-->


##==##

<!-- .slide: class="transition-black" data-state="quit-question"-->


# Sensors 

![icon](./assets/images/html5-device-access-logo.png)

##==##

<!--
//   __      ___ _               _   _             
//   \ \    / (_) |             | | (_)            
//    \ \  / / _| |__  _ __ __ _| |_ _  ___  _ __  
//     \ \/ / | | '_ \| '__/ _` | __| |/ _ \| '_ \ 
//      \  /  | | |_) | | | (_| | |_| | (_) | | | |
//       \/   |_|_.__/|_|  \__,_|\__|_|\___/|_| |_|
//                                                 
//   
-->

<!-- .slide: class="transition-black" -->

# Vibration

![icon](./assets/images/mobile-phone-vibration.jpg)

##==##

## Vibration

* Vibre selon un temps donné ! 

* Peut faire vibrer tout un ensemble de temps
 * n = temps à vibrer
 * n+1 = temps entre vibration n et n+2


```javascript
window.navigator.vibrate(arrayOfVibration);
```

[Docummentation](https://developer.mozilla.org/fr/docs/Web/API/Vibration_API)

##==##
<!-- .slide: data-state="stop-usermedia"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">32+</div>
    <div class="os">32+</div>
    <div class="android">32+</div>
    <div class="ios">32+</div>
  </div>
  <div class="firefox">
    <div class="desktop">11+</div>
    <div class="os">11+</div>
    <div class="android">11+</div>
    <div class="ios">11+</div>
  </div>
  <div class="opera">
    <div class="desktop">19+</div>
    <div class="android">19+</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">consider</div>
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
//     ____       _            _        _   _             
//    / __ \     (_)          | |      | | (_)            
//   | |  | |_ __ _  ___ _ __ | |_ __ _| |_ _  ___  _ __  
//   | |  | | '__| |/ _ \ '_ \| __/ _` | __| |/ _ \| '_ \ 
//   | |__| | |  | |  __/ | | | || (_| | |_| | (_) | | | |
//    \____/|_|  |_|\___|_| |_|\__\__,_|\__|_|\___/|_| |_|
//                                                        
//  
-->

<!-- .slide: class="transition-black" data-state="quit-question"-->


# Device Orientation

![icon](./assets/images/device-orientation.jpg)

##==##



## Device Orientation

3 Axes : **Alpha, Gamma, Beta**

Se fait à plat ! 

<br>
<div>

![h-300](./assets/images/device-orientation-z.jpg)

![h-300](./assets/images/device-orientation-y.jpg)

![h-300](./assets/images/device-orientation-x.jpg)

</div>

[Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation)

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
<!-- .slide: data-state="stop-orientation"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">7+</div>
    <div class="os">7+</div>
    <div class="android">7+</div>
    <div class="ios">7+</div>
  </div>
  <div class="firefox">
    <div class="desktop">6+</div>
    <div class="os">6+</div>
    <div class="android">6+</div>
    <div class="ios">6+</div>
  </div>
  <div class="opera">
    <div class="desktop">15+</div>
    <div class="android">12+</div>
  </div>
  <div class="edge">
    <div class="desktop">11+</div>
  </div>
  <div class="ie">
    <div class="old unsupport">-</div>
    <div class="new">11</div>
  </div>
  <div class="safari">
    <div class="ios">4.3</div>
  </div>
</div>

##==##

<!--
//    _____             _          __  __       _   _             
//   |  __ \           (_)        |  \/  |     | | (_)            
//   | |  | | _____   ___  ___ ___| \  / | ___ | |_ _  ___  _ __  
//   | |  | |/ _ \ \ / / |/ __/ _ \ |\/| |/ _ \| __| |/ _ \| '_ \ 
//   | |__| |  __/\ V /| | (_|  __/ |  | | (_) | |_| | (_) | | | |
//   |_____/ \___| \_/ |_|\___\___|_|  |_|\___/ \__|_|\___/|_| |_|
//                                                                
//
-->
<!-- .slide: class="transition-black" -->

# Device Motion API

![icon](./assets/images/device_motion.jpg)

##==##

## Device Motion API

![center w-800](./assets/images/device_motion.jpg)

On peut tenir comptes de l'accélération classique ou avec prise en charge de la gravité !

[Documentation](https://developer.mozilla.org/fr/docs/Web/API/DeviceMotionEvent)

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
  var yGravity = event.accelerationIncludingGrativity.y;
}

// We add the listener
function register(){
  window.addEventListener('devicemotion', deviceMotionListener, false);
}
```




##==##
<!-- .slide: data-state="stop-devicemotion"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">7+</div>
    <div class="os">7+</div>
    <div class="android">7+</div>
    <div class="ios">7+</div>
  </div>
  <div class="firefox">
    <div class="desktop">6+</div>
    <div class="os">6+</div>
    <div class="android">6+</div>
    <div class="ios">6+</div>
  </div>
  <div class="opera">
    <div class="desktop">18+</div>
    <div class="android">18+</div>
  </div>
  <div class="edge">
    <div class="desktop">11+</div>
  </div>
  <div class="ie">
    <div class="old unsupport">-</div>
    <div class="new">11</div>
  </div>
  <div class="safari">
    <div class="ios">4.3</div>
  </div>
</div>


##==##

<!--
//    ____        _   _                  
//   |  _ \      | | | |                 
//   | |_) | __ _| |_| |_ ___ _ __ _   _ 
//   |  _ < / _` | __| __/ _ \ '__| | | |
//   | |_) | (_| | |_| ||  __/ |  | |_| |
//   |____/ \__,_|\__|\__\___|_|   \__, |
//                                  __/ |
//                                 |___/ 
-->

<!-- .slide: class="transition-black"-->

# Battery Status 

![icon](./assets/images/empty-battery.png)

##==##

## Battery Status


* Pourcentage de la batterie (et son évolution)

* Téléphone branché ou non

<br>

```javascript
var battery = navigator.battery || navigator.mozBattery 
|| navigator.webkitBattery;

function updateBatteryStatus() {
  console.log("Batterie chargée à : " + battery.level * 100 + " %");

  if (battery.charging) {
    console.log("Chargement de la batterie"); 
  }
}

battery.addEventListener("chargingchange", updateBatteryStatus);
battery.addEventListener("levelchange", updateBatteryStatus);
updateBatteryStatus();
```

[Documentation](https://developer.mozilla.org/fr/docs/Web/API/Battery_status_API)

##==##
<!-- .slide: data-state="stop-devicemotion"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">39+</div>
    <div class="os">39+</div>
    <div class="android">39+</div>
    <div class="ios">39+</div>
  </div>
  <div class="firefox">
    <div class="desktop">10+</div>
    <div class="os">10+</div>
    <div class="android">10+</div>
    <div class="ios">10+</div>
  </div>
  <div class="opera">
    <div class="desktop">35+</div>
    <div class="android">35+</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">consider</div>
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
//    _      _       _     _   
//   | |    (_)     | |   | |  
//   | |     _  __ _| |__ | |_ 
//   | |    | |/ _` | '_ \| __|
//   | |____| | (_| | | | | |_ 
//   |______|_|\__, |_| |_|\__|
//              __/ |          
//             |___/           
-->


<!-- .slide: class="transition-black"-->

# Light 

![icon](./assets/images/light_detector.jpg)

##==##


## Light


* Renvoie des valeurs entre 0 et > 1000 (0 étant sombre)

* Est dépendant du téléphone et de l’implémentation

* On a 2 façon de faire =>
 * Gestion par valeur (lux)
 * Gestion par états : Dim / Normal / Bright


```javascript
var deviceLightHandler = function(event) {
 var value = Math.min(45, event.value); 
}

window.addEventListener('devicelight', deviceLightHandler, false);
```

[Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events)


##==##
<!-- .slide: data-state="stop-light"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop unsupport">-</div>
    <div class="os unsupport">-</div>
    <div class="chromium partial">draft</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="firefox">
    <div class="desktop">42+</div>
    <div class="os">42+</div>
    <div class="android">42+</div>
    <div class="ios">42+</div>
  </div>
  <div class="opera">
    <div class="desktop unsupport">-</div>
    <div class="android unsupport">-</div>
  </div>
  <div class="edge">
    <div class="desktop partial">Insider</div>
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

![icon](./assets/images/camera_icon.jpg)

##==##

## User Media

* Encore dépendant des navigateurs !

* Possibilité de préciser ce qu'on récupère et on peut séparer les flux ! 
* Sélection de la source / Récupération de l'audio

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
* **HTTPS** only ! 
* 2 versions l'api

##==##

## User Media

### Différence entre les 2 versions ?

* V1 approche événementielle
* V2 approche avec des promises et simplifie le fonctionnement de récupération des objets associés (plus récent => moins de compatibilité)

Notes:



##==##

## User Media

### V1

```javascript
// We define the video constraints
var constraints = {video: true};

// We manage an error while getting the stream
function handleUserMediaError(error){
  console.log('navigator.getUserMedia error: ', error);
}

// We manage the success of getting the stream
function handleUserMedia(stream){
  localStream = stream;
  video.src = window.URL.createObjectURL(stream);
  video.play();
}

navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);

```



##==##

## User Media

### V2

<pre class="javascript"><code class='toHilight'>
<mark class="dilluate">// We define the video constraints
var constraints = {video: true};
// We manage an error while getting the stream
function handleUserMediaError(error){
  console.log('navigator.getUserMedia error: ', error);
}
// We manage the success of getting the stream
function handleUserMedia(stream){
  localStream = stream;
  video.src = window.URL.createObjectURL(stream);</mark>
  video.onloadedmetadata = function(e){
    video.play();
  }<mark class="dilluate">
}
</mark>navigator.mediaDevices.getUserMedia(constraints)
  .then(handleUserMedia).catch(handleUserMediaError);</code></pre>

Toujours besoin de adapter.js pour faire marcher correctement ! 


Notes:




##==##
<!-- .slide: data-state="stop-usermedia"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">21+</div>
    <div class="os">21+</div>
    <div class="android">21+</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="firefox">
    <div class="desktop">42+</div>
    <div class="os">42+</div>
    <div class="android">42+</div>
    <div class="ios">42+</div>
  </div>
  <div class="opera">
    <div class="desktop">12+</div>
    <div class="android">12+</div>
  </div>
  <div class="edge">
    <div class="desktop">12+</div>
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
//    _____               _           _ _         
//   |  __ \             (_)         (_) |        
//   | |__) | __ _____  ___ _ __ ___  _| |_ _   _ 
//   |  ___/ '__/ _ \ \/ / | '_ ` _ \| | __| | | |
//   | |   | | | (_) >  <| | | | | | | | |_| |_| |
//   |_|   |_|  \___/_/\_\_|_| |_| |_|_|\__|\__, |
//                                           __/ |
//                                          |___/ 
-->

<!-- .slide: class="transition-black" -->

# Proximity

![icon](./assets/images/proximity.jpg)

##==##

## Proximity

### Device Proximity

Firefox uniquement ! 

* Renvoie des valeurs entre 0 et 5 (0 étant proche)

<br>


```javascript
var deviceProximityHandler = function(event) {
  console.log(event.value);            
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

### User Proximity

Firefox uniquement ! 

* Renvoie des valeurs entre true à l'attribut near

<br>

```javascript
var userProximityHandler = function(event) {
  if (event.near){
    console.log("Near ! ");
  }
}

function register(){
  window.addEventListener('userproximity', userProximityHandler, false);
}

function unregister(){
  window.removeEventListener('userproximity', userProximityHandler, false);
}
```

[Documentation complète](https://developer.mozilla.org/fr/docs/WebAPI/Proximity)

##==##

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop unsupport">-</div>
    <div class="os unsupport">-</div>
    <div class="android unsupport">-</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="firefox">
    <div class="desktop">42+</div>
    <div class="os">42+</div>
    <div class="android">42+</div>
    <div class="ios">42+</div>
  </div>
  <div class="opera">
    <div class="desktop unsupport">-</div>
    <div class="android unsupport">-</div>
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

![icon](./assets/images/voice-recognition.js.png)

##==##

## Web Speech

* Un tag existe pour gagner en code 

<br>

```html
<input x-webkit-speech>
```

* Il reste plus intéressant d'utiliser la librairie Javascript

* Manque encore cependant de précision pour de la commande vocale => avoir des textes approximatifs de détection
* Va de paire avec la synthèse vocale disponible aussi 


[Documentation complète](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)

##==## 

## Web Speech

### Utilisation 

```javascript
var recognition = new webkitSpeechRecognition();
recognition.lang = voiceFR;
recognition.continuous = true;
recognition.interimResults = true;

recognition.start();
recognition.onresult = function(event) {
  var finalStr = event.results[0][0].transcript;
  console.log('Confidence: ' + finalStr); 
}
```


##==##

## Web Speech

### Grammar

Afin d'améliorer la reconnaissance des textes, il est possible de définir une grammaire

```javascript
var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | [LOTS MORE COLOURS] ;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
```

##==##
<!-- .slide: data-state="stop-webspeech" -->

## Web Speech Synthesis

### Les possibilités d’accessibilités disponibles directement dans une page web

```javascript
var synth = window.speechSynthesis;

var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
utterThis.voice = 'fr-FR';
utterThis.pitch = pitch.value;
utterThis.rate = rate.value;
synth.speak(utterThis);
```



##==##
<!-- .slide: data-state="stop-webspeech"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">25+</div>
    <div class="os">25+</div>
    <div class="android">35+</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="firefox">
    <div class="desktop">45+</div>
    <div class="os">45+</div>
    <div class="android partial">draft</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="opera">
    <div class="desktop partial">draft</div>
    <div class="android partial">draft</div>
  </div>
  <div class="edge">
    <div class="desktop partial">draft</div>
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

<!-- .slide: data-background="./assets/images/inception_not_sensor_full.jpg" class="transition" -->



##==##

## Notification

* Possibilité d'envoyer des notification à l'utilisateur même si la page n'est pas au premier plan ! 

* A besoin d'autorisations pour fonctionner

* Maintenant basé sur les services workers pour des histoires de d'activités

* A coupler avec la PushAPI ;)

<br>

[Documentation](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification) && [Old Documentation](https://developer.mozilla.org/fr/docs/Web/API/notification/Using_Web_Notifications)

##==##

## Notification

### Utilisation

```javascript
function showNotification() {
  Notification.requestPermission(function(result) {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Vibration Sample', {
          body: 'Buzz! Buzz!',
          icon: '../images/touch/chrome-touch-icon-192x192.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'vibration-sample'
        });
      });
    }
  });
}
```

##==##

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">42+</div>
    <div class="os">42+</div>
    <div class="android">42+</div>
    <div class="ios">42+</div>
  </div>
  <div class="firefox">
    <div class="desktop">44+</div>
    <div class="os">44+</div>
    <div class="android">44+</div>
    <div class="ios">44+</div>
  </div>
  <div class="opera">
    <div class="desktop">35+</div>
    <div class="android">33+</div>
  </div>
  <div class="edge">
    <div class="desktop partial">draft</div>
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

<!-- .slide: data-background="./assets/images/inception_offline_full.jpg" class="transition" data-state="quit-question"-->



##==##

## Gestion du offline

### Pleins d'outils à notre disposition

* Stockage basique de clés valeurs avec le [LocalStorage / SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage)

<br>

* Base de données orientée objets avec [IndexDB](https://developer.mozilla.org/fr/docs/IndexedDB/Using_IndexedDB)

<br>

* Gestion de données cache avec [l'AppCache](https://developer.mozilla.org/fr/docs/Utiliser_Application_Cache) (Déprécié et n'est plus conseillé !)

<br>

* Le remplaçant de l'appCache => [Service Workers](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API) !! 


##==## 

## Activité dans l'application ?

* La [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) vous permet de gérer la visibilité de vos pages.

<br>

```javascript
var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} 

function handleVisibilityChange() {
  if (document[hidden]) {
    // Do some stuff, unconnect things
  } else {
    // Do some stuff, reconnect things
  }
}

if (typeof document.addEventListener != "undefined" && 
  typeof document[hidden] != "undefined") {
  // Handle page visibility change   
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
  
}
```

##==##

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">33+</div>
    <div class="os">33+</div>
    <div class="android">33+</div>
    <div class="ios">33+</div>
  </div>
  <div class="firefox">
    <div class="desktop">18+</div>
    <div class="os">18+</div>
    <div class="android">18+</div>
    <div class="ios">18+</div>
  </div>
  <div class="opera">
    <div class="desktop">20+</div>
    <div class="android">20+</div>
  </div>
  <div class="edge">
    <div class="desktop">10+</div>
  </div>
  <div class="ie">
    <div class="old unsupport">-</div>
    <div class="new">10</div>
  </div>
  <div class="safari">
    <div class="ios">7</div>
  </div>
</div>


##==##

<!-- .slide: data-background="./assets/images/inception_appmanifest_full.jpg" class="transition"-->


##==##

## Web Manifest

* Permet de spécifier des meta data sur l'application
* Possibilité d'ajouter l'application sur le homescreen
* Possibilité de définir des paramètres de lancement : 
 * Plein écran 
 * Url Spécifique au démarrage 
 * Orientation
 * Présence de la barre de navigation 
 * ...

##==##

## Web Manifest

### Utilisation

```html
<link rel="manifest" href="/manifest.json">
```

```json
{
  "short_name": "Kinlan's Amaze App",
  "name": "Kinlan's Amazing Application ++",
  "icons": [
    {
      "src": "launcher-icon-2x.png",
      "sizes": "96x96",
      "type": "image/png"
    }
  ],
  "start_url": "/index.html",
  "display": "standalone",
  "orientation": "landscape"
}
```

[Documentation](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android)


##==##


<!-- .slide: data-state="quit-question"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop">46+</div>
    <div class="os">46+</div>
    <div class="android">46+</div>
    <div class="ios">46+</div>
  </div>
  <div class="firefox">
    <div class="desktop partial">draft</div>
    <div class="os partial">draft</div>
    <div class="android partial">draft</div>
    <div class="ios partial">draft</div>
  </div>
  <div class="opera">
    <div class="desktop">15+</div>
    <div class="android">26+</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">consider</div>
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

<!-- .slide: data-background="./assets/images/inception_more_full.jpg" class="transition" data-state="quit-question"-->


##==##

<!-- .slide: class="transition-black" -->

# Tout le reste !

![center h-500](./assets/images/buzz.jpg)


##==##

## Ce qui arrive

*  [Web USB](https://wicg.github.io/webusb/) : Interaction avec le port série depuis le web

<br>

* [Sensors Génériques](https://w3c.github.io/sensors/) : Ouverture de tous les types de sensors disponibles et pas encore présent => Refonte des apis actuelles 

<br>

* [WebNFC](http://w3c.github.io/web-nfc/index.html) :  Mise à disposition d'un lecteur NFC à utiliser sur téléphone

<br>

* Web Bluetooth : prise en compte des devices non BLE


##==## 

<!-- .slide: data-state="quit-question hidefooter" data-background="./assets/images/monthy_phython_graal.jpg" class="transition"-->

# Conclusion


<div class="copyright">Monthy Python</div>


##==##

<!-- .slide: class="last-slide" -->



# <!-- .element: class="topic-title" --> Les supers pouvoirs du web

<!-- .element: class="presenter" --> **Jean-François Garreau  **

<!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur SQLI  

<!-- .element: class="email" --> **jef**@gdgnantes.com  

<!-- .element: class="thank-message" --> http://goo.gl/8njYM1  
