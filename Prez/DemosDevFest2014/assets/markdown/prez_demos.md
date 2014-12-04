

<!-- .slide: class="first-slide" -->

# **DevFest Nantes**

### 2014.12.18 SQLI @ **Nantes**

![title](assets/images/logo_devfest.png)

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

![h-300 float-left](assets/images/Javascript-logo.png)

Notes:
Mindstorm c'est la troisième génération 

##==##

## Myo & Mindstorm EV3

<video src="assets/videos/video_deplacement.mp4"></video>

##==##

## Myo & Mindstorm EV3

<video src="assets/videos/video_tir.mp4"></video>

##==##

<!-- .slide: data-background="black" data-state="hidefooter" class="transition" -->

![center h-900](assets/images/baton_de_la_mort.jpg)


##==##

##  Myo & Mindstrom EV3

### Fonctionnement

![h-800 center](assets/images/schema_myo_ev3.png) 

##==##

## Myo & Mindstorm EV3

### Un peu de théorie sur Myo

![center h-700](assets/images/myo-overview.png)

##==##

## Myo & Mindstorm EV3

### Un peu de théorie sur Myo

![center h-500](assets/images/Mark-blog-Diagrams-01.jpg)

##==##

## Myo & Mindstorm EV3

### Un peu de théorie sur EV3

![center h-500](assets/images/ev3_sensors.jpg)

Notes:
Ne pas oublier de parler du bluetooth

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

[fork me - MyWebSocket.cpp](https://github.com/binomed/MyoEV3/blob/master/MyoCpp/MyoWebSocket/MyoWebSocket.cpp)

##==##

## Myo & Mindstorm EV3

### Côté EV3

![center h-400](assets/images/ev3_ide.png)

[fork me - EV3](https://github.com/binomed/MyoEV3/tree/master/EV3)

##==##

## Myo & Mindstorm EV3

### Côté Node


package.json
```json 
{
  "author": "jefBinomed",
  "name": "MyoEV3",
  "version": "1.0.0",
  "dependencies": {},
  "devDependencies": {
    "bluetooth-serial-port": "1.1.4",
    "express" : "3.x"
  }
}
```
##==##

## Myo & Mindstorm EV3

### Côté Node


Obligé de composé avec le protocole de MindStorm : 

* [Protocol Bluetooth EV3](http://www.mindstorms.rwth-aachen.de/trac/wiki/EV3)
* Convertir des données textuelles en Hexa
* Utiliser [IEEE754](http://fr.wikipedia.org/wiki/IEEE_754) comme norme pour passer les données numériques ! 

Notes:
En gros mécanisme d'entête et librairies JS pas à jour => faut tout recoder ! 

##==##

## Myo & Mindstorm EV3

### Côté Node


```javascript
btSerial.on('found', function(address, name) {
    if (name === ev3BirckName){
      btSerial.findSerialPortChannel(address, function(channel) {
          btSerial.connect(address, channel, function() {
              ev3SendMessage('connect','ok');             
              ev3SendMessage('myo','stop');
              btSerial.on('data', function(buffer) {
                  console.log("BLE->Datas received : ");                  
              });
          }, function (err) {
              console.log('BLE->cannot connect');
          });
      btSerial.close();
      }, function(){
        console.log('BLE->no Channel found');
      });
    }
});
```

Notes:


##==##

## Myo & Mindstorm EV3

### Côté Node

Ecriture
```javascript
function ev3SendMessage(type,message, number){
  if (btSerial.isOpen()){
    if (debug){
      console.log('BLE-> Try to write : '+type+' | with message : '+message+
      " | : "+hexUtils.toEV3(type,message, number));
    }
    var buffer = new Buffer(hexUtils.toEV3(type, message, number), 'hex');
    btSerial.write(buffer, function(err, bytesWritten) {
      if (err) console.log(err);
      else console.log('BLE->datas write');
    });

  }else{
    console.log('BLE->Cannot send message because blueTooth is off');
  }
}
```

Notes:


##==##

## Myo & Mindstorm EV3

### Côté Node - Serveur

```javascript
var app = express().use(express.static('public'))
  .use(function(req, res){
    if (req.query.json){      
      var dataJson = JSON.parse(req.query.json);
      if(dataJson.pose != 'rest' && dataJson.pose != lastGesture){
        var currentTime = new Date().getTime();
        ...
        // Si le Mindstorm est sous le contrôle du myo
        if (start){
          // Si on sère le point alors on tire un élastique
          if (dataJson.pose === 'fist'){
            ev3SendMessage('myo','fire');
            ...
          }else ...
        }
        // on regarde la séquence (WaveOut->WaveIn->FingerSpread)
        ...              
```

[fork me - Node](https://github.com/binomed/MyoEV3/blob/master/NodeServer)

Notes:



##==##


<!-- .slide: data-background="assets/images/leap_motion.png" data-state="hidefooter" class="transition" -->


##==##

## Leap Motion

### Technos 

![h-300 float-left](assets/images/HTML5_Badge_512.png) 

![h-300 float-left](assets/images/Javascript-logo.png)

![h-300 float-left](assets/images/css3.svg)

Notes:


##==##

<!-- .slide: data-background="assets/images/MinorityReport.jpg" data-state="hidefooter" class="transition" -->

##==##

## Leap Motion

### Fonctionnement

![h-800 center](assets/images/schema_leap.png) 

##==##

## Leap Motion

### Un peu de théorie sur Leap Motion

![center h-500](assets/images/Leap_InteractionBox.png)

##==##

## Leap Motion

### Un peu de code



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


# <!-- .element: class="topic-title" --> Démos DevFest Nantes 2014

# <!-- .element: class="presenter" --> **Jean-François Garreau  **

# <!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur Innovation SQLI  

# <!-- .element: class="email" --> **jfgarreau**@sqli.com | @jefBinomed | http://gplus.to/jefBinomed 

# <!-- .element: class="thank-message" --> Merci  

![avatar](assets/images/avata_jf_web2day.jpg)
