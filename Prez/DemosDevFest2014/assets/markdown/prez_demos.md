

<!-- .slide: class="first-slide" -->

# **DevFest Nantes**

### 2014.12.18 SQLI @ **Nantes**

![title](assets/images/html5-device-access-logo.png)

##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

###  Jean-François GARREAU

![avatar center w-300 wp-200](assets/images/avata_jf_web2day.jpg)


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

<!--
//  _______ _    _ ______ ____  _____  _____ ______ 
// |__   __| |  | |  ____/ __ \|  __ \|_   _|  ____|
//    | |  | |__| | |__ | |  | | |__) | | | | |__   
//    | |  |  __  |  __|| |  | |  _  /  | | |  __|  
//    | |  | |  | | |___| |__| | | \ \ _| |_| |____ 
//    |_|  |_|  |_|______\____/|_|  \_\_____|______|
//                                                 
-->     

##==##

<!-- .slide: data-background="#EFEFEF" data-state="hidefooter" class="transition" -->

<div id="devfestnantes">            
    <img src="assets/images/logo_devfest_games.png" id="logo-technos"> 
    <div class="title">DevFest Nantes<br><br>2014<br><br><span id="press" class="green">&lt;press start&gt;</span></div>
    <div id="fakemouse"></div>
    <img src="assets/images/tour_bretagne.png" id="tour-bretagne"> 
</div>

##==##


## DevFest Nantes

* +500 Particpants ! 

* 29 Conférences

* 35 Speakers

* 5h / nuits pendant 3 semaines

* 1 200 cafés servis

* 5 organisateurs

* 4 Démos du tonnere ;)
 * Myo EV3
 * Question pour un DevFest
 * LeapDevFest
 * Countdown
 * Skiff Simulator



##==##


<!-- .slide: data-background="assets/images/myo-history-of-prototypes.jpg" data-state="hidefooter" class="transition" -->

##==##

##  Myo & Mindstrom EV3

### Technos 

![h-300 float-left](assets/images/nodejs.png) 

![h-300 float-left](assets/images/C++-logo.jpg)

Notes:
Mindstorm c'est la troisième génération 

##==##

## Myo & Mindstorm EV3

<video src="assets/videos/video_deplacement.mp4"></video>

##==##

## Myo & Mindstorm EV3

<video src="assets/videos/video_tir.mp4"></video>

##==##

##  Myo & Mindstrom EV3

### Fonctionnement

![h-800 center](assets/images/schema_myo_ev3.png) 


##==##

## Myo & Mindstorm EV3

### Un peu de code


```c++
class DataCollector : public myo::DeviceListener {
...
  void onOrientationData(myo::Myo* myo, uint64_t timestamp, const myo::Quaternion<float>& quat)
  {
    ...
    roll = atan2(2.0f * (quat.w() * quat.x() + quat.y() * quat.z()),
      1.0f - 2.0f * (quat.x() * quat.x() + quat.y() * quat.y()));
    pitch = asin(2.0f * (quat.w() * quat.y() - quat.z() * quat.x()));
    yaw = atan2(2.0f * (quat.w() * quat.z() + quat.x() * quat.y()),
      1.0f - 2.0f * (quat.y() * quat.y() + quat.z() * quat.z()));
    // Convert the floating point angles in radians to a scale from 0 to 20.
    roll_w = static_cast<int>((roll + (float)M_PI) / (M_PI * 2.0f) * 18);
    pitch_w = static_cast<int>((pitch + (float)M_PI / 2.0f) / M_PI * 18);
    yaw_w = static_cast<int>((yaw + (float)M_PI) / (M_PI * 2.0f) * 18);
  }

```


##==##

## Myo & Mindstorm EV3

### Un peu de code


```c++
  void onPose(myo::Myo* myo, uint64_t timestamp, myo::Pose pose){
    currentPose = pose;
    if (pose == myo::Pose::fist) {
      myo->vibrate(myo::Myo::vibrationMedium);
    }
  }
  void onGyroscopeData(myo::Myo* myo, uint64_t timestamp, const myo::Vector3<float>& gyro){
    gyro_x = gyro.x();
    gyro_y = gyro.y();
    gyro_z = gyro.z();
  }
  void onAccelerometerData(myo::Myo* myo, uint64_t timestamp, const myo::Vector3<float>& accel){
    acc_x = accel.x();
    acc_y = accel.y();
    acc_z = accel.z();
  }
```


##==##

## Myo & Mindstorm EV3

### Un peu de code


```c++
  std::string toJson(){

    std::string result("{");
    result += "\"roll\":" + std::to_string(roll);
    result += ",\"pitch\":" + std::to_string(pitch);
    result += ",\"yaw\":" + std::to_string(yaw);
    result += ",\"pose\":\"" + currentPose.toString() + "\"";
    result += ",\"acc\":[" + std::to_string(acc_x) + "," + std::to_string(acc_y) + "," + std::to_string(acc_z) + "]";
    result += ",\"gyro\":[" + std::to_string(gyro_x) + "," + std::to_string(gyro_y) + "," + std::to_string(gyro_z) + "]";
    result += "}";
    return result;

  }
```

[fork me](https://github.com/binomed/MyoEV3/blob/master/MyoCpp/MyoWebSocket/MyoWebSocket.cpp)


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
