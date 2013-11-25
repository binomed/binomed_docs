<div class="first-slide"></div>

# **Cours Mobilité**

## 2013 - I5

### 2013.11.26 Epsi @ **Nantes**


##==##

<div class="title"></div>

# **Cours Android / HTML5 **

## Cours Mobilité

### Cours 03 - Sensors

![title](/assets/images/localisation_icone.jpg)

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


## Sommaire ## 

* Les Sensors ?

<br>

* Localisation - Android

<br>

* Sensors - Android

<br>

* Localisation - HTML5

<br>

* Sensors - HTML5

<br>

<footer/>


<!--
//     _____                               
//    / ____|                              
//   | (___   ___ _ __  ___  ___  _ __ ___ 
//    \___ \ / _ \ '_ \/ __|/ _ \| '__/ __|
//    ____) |  __/ | | \__ \ (_) | |  \__ \
//   |_____/ \___|_| |_|___/\___/|_|  |___/
//                                         
//   
-->

##==##


<div class='transition'></div>

# Les Sensors

![icon](/assets/images/HTML5_Device_Access.png)

##==##


## Les Sensors ?

### Qu'est ce que les sensors ?

*Capteurs* en Français, est un mécanisme permettant de transformer un les résultats d'un appareil en données interprétables. C'est à dire que l'on peut analyser les donées sorties d'un détecteur tel que le giroscope, ...

<br>

* Exemples de sensors connus : 

 * GPS
 * Giroscope
 * Caméra
 * ...

<aside class="notes">
Nous allons voir GPS & Giroscope
</aside>

<footer/>


##==##

<!--
//    _      ____   _____                     _   _ _____  _____   ____ _____ _____   
//   | |    / __ \ / ____|              /\   | \ | |  __ \|  __ \ / __ \_   _|  __ \  
//   | |   | |  | | |       ______     /  \  |  \| | |  | | |__) | |  | || | | |  | | 
//   | |   | |  | | |      |______|   / /\ \ | . ` | |  | |  _  /| |  | || | | |  | | 
//   | |___| |__| | |____            / ____ \| |\  | |__| | | \ \| |__| || |_| |__| | 
//   |______\____/ \_____|          /_/    \_\_| \_|_____/|_|  \_\\____/_____|_____/  
//                                                                                    
//                                                                                  
-->

<div class='transition'></div>

# Localisation - Android

![icon](/assets/images/android-logo-white.png)

##==##


## La localisation

### Le GPS

Sur Android, on peut récupérer la localisation du téléphone selon plusieurs précisions : 

<br>

* GPS : précision de ~5m
* GSM : précision de ~50m
* Wifi : précision de ~1km

<br>

Les **google play services** sont fortement recommandés pour utiliser la géolicalisation dans Android.


<aside class="notes">

</aside>
<footer/>

##==##

## La localisation

### Les Google Play Services ?

Ce sont un ensemble de librairies android permettant d'accéder de façon uniforme entre les plateformes à des apis développées par Google. On peut ainsi retrouver dans les Google Play Services : 

* Localisation
* Jeux
* Google + (sign IN)
* Maps
* Publicité
* Wallet

<br>

Cela sous présente sous la forme d'une librairie Android que l'on doit ajouter à son projet.

<br>

Cela est souvent lié aussi à un compte Google et à la Console API


<aside class="notes">
Expliquer rapidement le principe de la console API
</aside>
<footer/>

##==##

## La localisation

### Notre cas

Nous n'allons cependant pas voir l'utilisation des Google Play Services et nous allons nous attarder sur la récupération classique de l'adresse d'une personne et l'affichage de l'adresse correspondante.

<br>

Objects à prendre en comptes : 

* **LocationManager** : Service de base permettant d'accéder aux données GPS du téléphone et revnoyant l'information de position. On peut positionner un listener sur cet objet pour être au courant des changements de place du téléphone


<aside class="notes">
On peut récupérer la dernière position ! 
</aside>
<footer/>

##==##

## La localisation

### Notre cas


<br>

Objects à prendre en comptes : 


* **Geocoder** : Il s'agit d'un objet permettant de transformer des coordonnées GPS en adresse lisible et inversement. Ainsi, vous pouvez à l'aide de cet objet être capable de trouver les coordonnées GPS d'une adresse. **/!\ ** cet objet fait appel à un service Google et donc ne peut pas fonctionner offline contrairement au GPS.

<aside class="notes">
On peut récupérer la dernière position ! 
</aside>
<footer/>

##==##

## La localisation


* La localisation est disponible via un service : LocationManager

```java
LocationManager lm = context.getSystemService(Context.LOCATION_SERVICE);
```

<br>

*  Le geocoder se récupère sur un contexte applicatif : 

```java
Geocoder geocoder = new Geocoder(context, Locale.getDefault());
```

<br>

* Comme pour beaucoup d'autres choses, une autorisation est nécessaire : 

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```


<aside class="notes">
Le coarse est le minimum mais est moins précis
Le fine permet d'aller plus loin et demande aussi le COARSE
</aside>
<footer/>


##==##

## La localisation

### Récupération des informations en temps réel


```java
public class ShowLocationActivity extends Activity implements LocationListener {
  private LocationManager locationManager;
  private LocationProvider provider;
  
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
    // Get the location manager
    locationManager = (LocationManager) 
        getSystemService(Context.LOCATION_SERVICE);
    
    //    
    provider = LocationManager.GPS_PROVIDER;
    Location location = locationManager.getLastKnownLocation(provider);
  }
    
  
} 
```


<aside class="notes">
Suite slide suivant
</aside>
<footer/>

##==##


## La localisation

### Récupération des informations en temps réel


```java
protected void onResume() {
 super.onResume();
 locationManager.requestLocationUpdates(provider, 400, 1, this);
}
protected void onPause() {
 super.onPause();
 locationManager.removeUpdates(this);
}
public void onLocationChanged(Location location) {
 int lat = (int) (location.getLatitude());
 int lng = (int) (location.getLongitude());
}
public void onStatusChanged(String provider, int status, Bundle extras) {
 // TODO Auto-generated method stub
}
public void onProviderEnabled(String provider) {
 // TODO
}
public void onProviderDisabled(String provider) {
 // TODO
}
```


<aside class="notes">
request : 400 : 400ms, 1 : 1 metre minimum de déplacement, this : listener
</aside>
<footer/>

##==##

## La localisation

### Récupération des informations en temps réel


```java
public void onLocationChanged(Location location) {
 int lat = (int) (location.getLatitude());
 int lng = (int) (location.getLongitude());
 Geocoder geocoder = new Geocoder(this, Locale.getDefault());

 List<Adress> adresses = geocoder.getFromLocation(location);
 if (adresses != null && adresses.length > 0){
  for(Adress : adress : adresses){
   Log.i(adress.toString());
  }
 }
}
```


<aside class="notes">

</aside>
<footer/>

##==##


<!--

//     _____                                  _   _ _____  _____   ____ _____ _____  
//    / ____|                           /\   | \ | |  __ \|  __ \ / __ \_   _|  __ \ 
//   | (___   ___ _ __    ______       /  \  |  \| | |  | | |__) | |  | || | | |  | |
//    \___ \ / _ \ '_ \  |______|     / /\ \ | . ` | |  | |  _  /| |  | || | | |  | |
//    ____) |  __/ | | |             / ____ \| |\  | |__| | | \ \| |__| || |_| |__| |
//   |_____/ \___|_| |_|            /_/    \_\_| \_|_____/|_|  \_\\____/_____|_____/ 
//                                                                                   
//   
-->

<div class='transition'></div>

# Sensors - Android

![icon](/assets/images/android-logo-white.png)

##==##


## Sensors 

### Android

Sur Android il en existe une multitude : 

<br>

* Accéléromètre
* Température
* Gravité
* Gyroscope
* Lumière
* Accélération
* Champ Magnétique
* Pression
* Proximité
* Humidité
* Rotation

<footer/>

<aside class="notes">

</aside>

##==##

## Sensors


Globalement, les sensors se récupère à travers un objet nommé **SensorManager**, ce dernier est un service Android qui vous donne accès au sensor souhaité.
<br>

Ce dernier sera par la suite observé par un listener qui recevra en fonction du sensor un tableau de données disponibles dans une unité bien précise. Par exemple : 
 * L'accéléromètre renvoie un tableau de données [x,y,z] en m/s²
 * Le Giroscope renvoie un tableau de rotation autour des axes [x,y,z] en rad/s

Vous pourrez trouver toutes les informations correspondantes aux sensors sur ces pages : 

 * Sensor Motion : http://goo.gl/1iq3dY
 * Sensor Position : http://goo.gl/M4wtvG
 * Sensor Environnement : http://goo.gl/d4o3IL



<footer/>

<aside class="notes">
Globallement chacun a son unité ! mais se récupèrent tous de la même manière
</aside>


##==##


## Sensors

### Android


Récupartion du service de sensors : 

<br>

```java
private SensorManager mSensorManager;
private Sensor mLight;

@Override
public final void onCreate(Bundle savedInstanceState) {
 super.onCreate(savedInstanceState);
 setContentView(R.layout.main);

 mSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
 mLight = mSensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);
}
```



<footer/>

<aside class="notes">
Suite slide suivant
</aside>

##==##

## Sensors

### Android


Récupartion du service de sensors : 

<br>

```java
public class SensorActivity extends Activity implements SensorEventListener {
 public final void onAccuracyChanged(Sensor sensor, int accuracy) {
  // Do something here if sensor accuracy changes.
}
 public final void onSensorChanged(SensorEvent event) {
  // Many sensors return 3 values, one for each axis.
  float lux = event.values[0];
 }
 protected void onResume() {
  super.onResume();
  mSensorManager.registerListener(this, mLight, 
    SensorManager.SENSOR_DELAY_NORMAL);
 }
 protected void onPause() {
  super.onPause();
  mSensorManager.unregisterListener(this);
 }
}
```



<footer/>

<aside class="notes">
Delay normal = 200 000 micro seconds
Delay Game = 20 000 micro / Delay UI = 60 000 micro / 
Delay Fastest = 0 !
Depuis 3.0 on peut spécifier son délai !
</aside>

##==##

<!--
//     _____ ______ _   _            _    _ _______ __  __ _      _____ 
//    / ____|  ____| \ | |          | |  | |__   __|  \/  | |    | ____|
//   | (___ | |__  |  \| |  ______  | |__| |  | |  | \  / | |    | |__  
//    \___ \|  __| | . ` | |______| |  __  |  | |  | |\/| | |    |___ \ 
//    ____) | |____| |\  |          | |  | |  | |  | |  | | |____ ___) |
//   |_____/|______|_| \_|          |_|  |_|  |_|  |_|  |_|______|____/ 
//                                                                      
//      
-->


<div class='transition'></div>

# Sensors - HTML5

![icon](/assets/images/html5_logo.jpg)

##==##

## Sensors

### HTML5

Contrairement à Android où l'on demande la permission au moment de l'installation, avec HTML5, on demande l'autorisation à l'utilisateur au moment où l'on a besoin d'accéder à la fonctionnalité.

Dans html5 les sensors s'accèdent tous en fonction d'une api qui leur est propre et tous les sensors ne sont pas dispo pour tous les navigateurs : 

<footer/>

<aside class="notes">

Dire que c'est toujours Asyncrhrone ! 
</aside>

##==##

## Sensors

### HTML5


<br>

|Navigateur|Location|Vibration|orientation|devicemotion|
|-----|------|-|----------|----------|
|Android|x|-|x|x|
|Chrome|x|-|x|x|
|Chrome Beta|x|x|x|x|
|Firefox|x|x|x|x|
|Safari|x|-|x|x|
|IE Mobile|x|-|x|x|

<footer/>

<aside class="notes">
Expliquer chaque sensor

</aside>

##==##

## Sensors

### HTML5


<br><br>

|Navigateur|light|proximity|usermedia|webSpeech|
|-----|------|-|----------|----------|
|Android|-|-|4+|-|
|Chrome|-|-|x|x|
|Chrome Beta|-|-|x|x|
|Firefox|x|x|x|-|
|Safari|-|-|-|-|
|IE Mobile|-|-|-|-|

<footer/>

<aside class="notes">
Expliquer chaque sensor
En gros vérifier à chaque fois ! 
</aside>

##==##

## Sensors

### Orientation

3 Axes : **Alpha, Gamma, Beta**

Se fait à plat ! 

<br><br><br>

![float-left w-300 wp-200](assets/images/device-orientation-z.jpg)

![float-left w-300  wp-200](assets/images/device-orientation-y.jpg)

![float-left w-300  wp-200](assets/images/device-orientation-x.jpg)

<footer/>

<aside class="notes">

</aside>

##==##

## Sensors

### Orientation


<br><br><br>


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

</aside>

##==##

## Sensors

### DeviceMotion


<br><br><br>


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

<aside class="notes">
Peut tenir compte de la gravité ! 
</aside>

##==##

## Sensors

### Proximity

Firefox uniquement ! 

* Renvoie des valeurs entre 0 et 5 (0 étant proche)

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

<aside class="notes">
existe aussi le user proximity
</aside>

##==##

## Sensors

### Light

Firefox uniquement ! 

* Renvoie des valeurs entre 0 et > 1000 (0 étant sombre)

* Est dépendant du téléphone et de l'implementation

* On a 2 façon de faire =>
 * Gestion par valeur
 * Gestion par états : Dim / Normal / Bright

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

<aside class="notes">
existe aussi le user proximity
</aside>

##==##

## Sensors

### User Media

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

* Ou encore plus sympa pour faire une visio via le webRTC !

<footer/>

<aside class="notes">

</aside>

##==##

## Sensors

### User Media

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


## Sensors

### Vibration

* Vibre selon un temps donné ! 

<br>

* Peut faire vibrer tout un ensmble de temps
 * n = temps à vibrer
 * n+1 = temps entre vibration n et n+2

<br>

```javascript
window.navigator.vibrate(arrayOfVibration);
```


<footer/>

<aside class="notes">

</aside>

##==##


## Sensors

### WebSpeech

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

recognition.start();
recognition.stop();
```

<footer/>

<aside class="notes">
se stope automatiquement toutes les minutes
expliquer les paramètres
</aside>

##==##

## Sensors

### WebSpeech


```javascript
recognition.onresult = function(event){
  for (var i = event.resultIndex; i < event.results.length; i++){    
    if (event.results[i].isFinal){
      console.log('>>>>>Transcript : '+event.results[i][0].transcript);      
    }
  }
};
recognition.onend = function(){
  console.log('End of recognition');
};
recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    console.log('No Speech');
  }
  if (event.error == 'audio-capture') {
    console.log('No microphone')
  }
  if (event.error == 'not-allowed') {
    console.log('Not Allowed');
  }
};     
```

<footer/>

<aside class="notes">
/!\ A l'approximation dans les résultats ! 
</aside>

##==##


<!--

//    _      ____   _____            _    _ _______ __  __ _      _____ 
//   | |    / __ \ / ____|          | |  | |__   __|  \/  | |    | ____|
//   | |   | |  | | |       ______  | |__| |  | |  | \  / | |    | |__  
//   | |   | |  | | |      |______| |  __  |  | |  | |\/| | |    |___ \ 
//   | |___| |__| | |____           | |  | |  | |  | |  | | |____ ___) |
//   |______\____/ \_____|          |_|  |_|  |_|  |_|  |_|______|____/ 
//                                                                      
//   
-->


<div class='transition'></div>

# Localisation - HTML5

![icon](/assets/images/html5_logo.jpg)

##==##

## Localisation

### HTML5

* Comme pour le reste des sensors, la géolocalisation se fait via l'accès à une méthode particulière. Comme les autres sensors, la géolocalisation est asyncrhone.
* Trois méthodes sont présentes : 

 * getCurentPosition : position à un instant T.
 * watchPosition : position en permanence.
 * clearWatch : retire l'observation de la position permanente.



<footer/>

<aside class="notes">
Info sert à connaître l'état, doit être pris en comptes
</aside>

##==##

## Localisation

### HTML5

* On récupère un objet avec les propriétés suivantes : 
 * latitude
 * longitude
 * altitude
 * speed
 * infos


<footer/>

<aside class="notes">
Info sert à connaître l'état, doit être pris en comptes
</aside>

##==##

## Localisation

### HTML5

```javascript
function maPosition(position) {
  var infopos = "Position déterminée :\n";
  infopos += "Latitude : "+position.coords.latitude +"\n";
  infopos += "Longitude: "+position.coords.longitude+"\n";
  infopos += "Altitude : "+position.coords.altitude +"\n";
  document.getElementById("infoposition").innerHTML = infopos;
}
function showError(error){
 switch(error.code) 
  {
  case error.PERMISSION_DENIED:
  case error.POSITION_UNAVAILABLE:
  case error.TIMEOUT:
  case error.UNKNOWN_ERROR:
  }
}
if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(maPosition, showError);
```

<footer/>

<aside class="notes">

</aside>

##==##

## Localisation

### HTML5

On peut passer des options pour compléter la requête

```javascript
navigator.geolocation.getCurrentPosition(maPosition, showError,
  {
   enableHighAccuracy : true,
   timeout : 10000,
   maximumAge : 10000
  }
);
```


* enableHighAccuracy : (true ou false > valeur par défaut) obtient une position plus précise via GPS

* timeout : (type long ou Infinity > valeur par défaut) durée avant renvoi vers la function d'erreur

* maximumAge : (type long ou Infinity, 0 > valeur par défaut) durée de la mise en cache de la position courante, si maximumAge:0 alors la position ne viendra jamais du cache, elle sera toujours renouvelée

<footer/>

<aside class="notes">

</aside>

##==##

## Localisation

### HTML5

Seule cette API vous donne accès à la position GPS mais si vous voulez avoir accès à une donnée type adresse postale, il faudra utiliser une librairie tierce : 

* Google Maps 
* OSM 
* Bing
* Yahoo

<br>
<!--
// http://wiki.openstreetmap.org/wiki/Nominatim#Reverse%5FGeocoding%5F.2F%5FAddress%5Flookup
// http://nominatim.openstreetmap.org/reverse?format=json&lat=52.5487429714954&lon=-1.81602098644987&zoom=18&addressdetails=1
-->


<footer/>

<aside class="notes">

</aside>

##==##




<div class="last-slide"></div>

<div class="topic-title"></div>

# Cours Mobilité - 02 HTML5

<div class="presenter"></div>

# **Jean-François Garreau**

<div class="gdg-rule"></div>

# GDG Nantes Leader

<div class="work-rule"></div>

# Ingénieur SQLI

<div class="thank-message"></div>

# **Merci**

![avatar](/assets/images/jf.jpg)

<footer/>