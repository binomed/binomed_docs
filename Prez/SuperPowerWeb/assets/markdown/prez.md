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

## Écrire dans une caractéristique

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
  <div class="edge">
    <div class="desktop unsupport">draft</div>
  </div>
  <div class="ie">
    <div class="old unsupport">7</div>
    <div class="new unsupport">11</div>
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

![icon](assets/images/device-orientation.jpg)

##==##



## Device Orientation

3 Axes : **Alpha, Gamma, Beta**

Se fait à plat ! 

<br>
<div>

![h-300](assets/images/device-orientation-z.jpg)

![h-300](assets/images/device-orientation-y.jpg)

![h-300](assets/images/device-orientation-x.jpg)

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
  <div class="edge">
    <div class="desktop">10240+</div>
  </div>
  <div class="ie">
    <div class="old unsupport">7</div>
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

![icon](assets/images/device_motion.jpg)

##==##

## Device Motion API

![center w-800](assets/images/device_motion.jpg)

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
  <div class="edge">
    <div class="desktop">10240+</div>
  </div>
  <div class="ie">
    <div class="old unsupport">7</div>
    <div class="new">11</div>
  </div>
  <div class="safari">
    <div class="ios">4.3</div>
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

![icon](assets/images/light_detector.jpg)

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
<!-- .slide: data-state="stop-light"-->

## Compatibilité

<div class="compat">
  <div class="chrome">
    <div class="desktop unsupport">-</div>
    <div class="os unsupport">-</div>
    <div class="chromium">50+</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="firefox">
    <div class="desktop">42+</div>
    <div class="os">42+</div>
    <div class="android">42+</div>
    <div class="ios">42+</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">-</div>
  </div>
  <div class="ie">
    <div class="old unsupport">7</div>
    <div class="new unsupport">11</div>
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

![icon](assets/images/camera_icon.jpg)

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

## User Media

### Cas pratique

![center w-600](assets/images/photographer.jpg)



##==##
<!-- .slide: data-state="start-usermedia" -->

## User Media


<div class="sensorExample">
  <div id="usermedia">
    <div class="videoParent">
    <img id="photoStream" height="600px">
      
    </div>
  </div>
</div>

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
  <div class="edge">
    <div class="desktop">12</div>
  </div>
  <div class="ie">
    <div class="old unsupport">7</div>
    <div class="new unsupport">11</div>
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

![icon](assets/images/proximity.jpg)

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
  <div class="edge">
    <div class="desktop unsupport">-</div>
  </div>
  <div class="ie">
    <div class="old unsupport">7</div>
    <div class="new unsupport">11</div>
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

![icon](assets/images/voice-recognition.js.png)

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
recognition.lang = 'fr-FR';
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

<!-- .slide: data-background="#3d4349" class="transition" data-state="start-webspeech"-->

![center h-600](/assets/images/demo_time.jpg)

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
    <div class="android unsupport">-</div>
    <div class="ios unsupport">-</div>
  </div>
  <div class="edge">
    <div class="desktop unsupport">draft</div>
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

<!-- .slide: data-background="#3d4349" class="transition" data-state="quit-question"-->

![center h-700](/assets/images/inception_more.jpg)



##==##

<!-- .slide: data-background="/assets/images/qui_veut_gagner_argent_en_masse.png" data-state="hidefooter" class="transition qui-veut-gagner" data-state="question-1"-->

<div class="url_jeux binomed">http://goo.gl/iQiTvZ</div>
<div class="url_jeux rawgit">https://goo.gl/Kp7Cyi</div>


<div class="qui-veut-gagner">
    <div class="question two-line"> Laquelle de ces API ne fait pas encore partie d'une roadmap pour le web ? </div>
    <div class="row">
        <div class="resp repA"> WebNFC</div>
        <div class="resp repB"> Sensors Génériques</div>
    </div>
    <div class="row">
        <div class="resp repC"> FingerPrint</div>
        <div class="resp repD"> La réponse D</div>
    </div>
</div>

##==##

<!-- .slide: data-background="/assets/images/qui_veut_gagner_argent_en_masse.png" data-state="hidefooter" class="transition qui-veut-gagner" data-state="resp-question-1"-->

<div class="url_jeux binomed">http://goo.gl/iQiTvZ</div>
<div class="url_jeux rawgit">https://goo.gl/Kp7Cyi</div>


<div class="qui-veut-gagner">
    <canvas id="chart_question_1" width="200" height="200" class="chart-resp"></canvas>
   <div class="question two-line"> Laquelle de ces API ne fait pas encore partie d'une roadmap pour le web ?  </div>
    <div class="row">
        <div class="resp repA"> WebNFC</div>
        <div class="resp repB"> Sensors Génériques</div>        
    </div>
    <div class="row">
        <div class="resp repC good"> FingerPrint</div>
        <div class="resp repD"> La réponse D</div>     
    </div>
</div>


##==##

<!-- .slide: class="transition-black" data-state="quit-question" -->

# Tout le reste !

![center h-500](assets/images/buzz.jpg)


##==##

##USB

##==##

## Sensors Génériques

##==##

## WebNFC


##==##

## Notification

Regarder si ça marche si le navigateur n'est pas au premier plan ?

##==## 

## Cycle de vie

##==##

## Gestion du offline

=> Inception

##==##

## AppManifest

=> Inception


##==## 

## Conclusion

image indiana jones

##==##

<!-- .slide: class="last-slide" data-state="stop-webspeech" -->



# <!-- .element: class="topic-title" --> Topic Title 

<!-- .element: class="presenter" --> **Jean-François Garreau  **

<!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur SQLI  

<!-- .element: class="email" --> **jef**@gdgnantes.com  

<!-- .element: class="thank-message" --> Merci  
