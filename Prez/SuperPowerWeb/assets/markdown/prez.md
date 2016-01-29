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

## Programme 

<div class="no-bullet"></div>

* Un peu de théorie
* Des démos
* Du fun


##==##


## Et si on jouait ?

![h400 float-left](/assets/images/Fil_rouge.jpg)

![h400](/assets/images/qr_code_jeux.png)

http://goo.gl/iQiTvZ




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

# Un peu de théorie

![icon](assets/images/HTML5_Device_Access.png)

##==##


## Device Access

### Kesako ?

* Geolocation

* Gyroscope / Accelometer / Compass

* Proximity


##==##

<!-- .slide: data-background="/assets/images/gad_qui_veut_gagner.jpg" data-state="hidefooter" class="transition qui-veut-gagner" data-state="question-1"-->
<div class="url_jeux">http://goo.gl/iQiTvZ</div>

<div class="qui-veut-gagner">
    <div class="question"> Lequel de ces sensors n'est pas accessible depuis le web ?</div>
    <div class="row">
        <div class="resp repA"> NFC</div>
        <div class="resp repC"> Magnetometre</div>
    </div>
    <div class="row">
        <div class="resp repB"> Bluetooth</div>
        <div class="resp repD"> Accelerometre</div>
    </div>
</div>

##==##

<!-- .slide: data-background="/assets/images/gad_qui_veut_gagner.jpg" data-state="hidefooter" class="transition qui-veut-gagner" data-state="resp-question-1"-->

<div class="url_jeux">http://goo.gl/iQiTvZ</div>


<div class="qui-veut-gagner">
    <canvas id="chart_question_1" width="200" height="200" class="chart-resp"></canvas>
    <div class="question"> Lequel de ces sensors n'est pas accessible depuis le web ?</div>
    <div class="row">
        <div class="resp repA"> NFC</div>
        <div class="resp repB good"> Magnetometre C</div>        
    </div>
    <div class="row">
        <div class="resp repC"> Bluetooth</div>
        <div class="resp repD"> Accelerometre</div>     
    </div>
</div>

##==##

## Liste de ce que l'on va voir

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
