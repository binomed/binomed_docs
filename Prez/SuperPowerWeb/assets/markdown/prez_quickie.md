<!-- .slide: data-background="./assets/images/super_hero_fotolia.png" data-state="hidefooter" class="transition first-slide" -->

# Les nouveaux supers pouvoirs du web

### 2016.04.28 Grand Oral @ **Lucca**

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

Notes:
Aujourd'hui : UID / URL / EID / TLM

##==## 

## Physical Web

### Restrictions 

 * Site accessible sur l'internet mondial
 * L'url est limité par la norme eddystone => Il vaut mieux utiliser des shorts urls


##==## 

## Physical Web

### Pour quoi faire ?

 ![center](./assets/images/physical_web_use_case.png)

Notes:
cas décentralisé, cas centralisé, ...

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

<!-- .slide: data-background="./assets/images/inception_bluetooth_full.jpg" class="transition" -->


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

<!-- .slide: data-background="#3d4349" class="transition"-->

![center h-600](./assets/images/demo_time.jpg)


##==##

<!-- .slide: data-background="./assets/images/inception_more_full.jpg" class="transition" -->


##==##

<!-- .slide: class="transition-black" -->

# Tout le reste !

![center h-500](./assets/images/buzz.jpg)

##==##

## Ce qui est en place

*  Vibration 
*  Orientation  <!-- .element class="fragment" -->
*  DeviceMotion <!-- .element class="fragment" -->
*  Battery <!-- .element class="fragment" -->
*  Light <!-- .element class="fragment" -->
*  UserMedia <!-- .element class="fragment" -->
*  Proximity <!-- .element class="fragment" -->
*  WebSpeech & Voice synthesis <!-- .element class="fragment" -->
*  WebManifest <!-- .element class="fragment" -->
*  WebNotifications <!-- .element class="fragment" -->
*  ServiceWorkers <!-- .element class="fragment" -->
*  IndexedDB <!-- .element class="fragment" -->
*  PageVisibility <!-- .element class="fragment" --> 


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
