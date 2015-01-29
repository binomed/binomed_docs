<!-- .slide: class="first-slide" -->

# **WebRTC** - Révolutionnons le partage d'informations

### 2015.01.22 DevFest @ **Paris** <br><br>http://goo.gl/B6Phir


<video id="remoteVideo" autoplay="autoplay" muted="true"></video> 

##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

### Jean-François GARREAU

<!-- .element: class="descjf" -->
IoT Manager, Senior innovation developper & Community Manager

![avatar w-300 wp-200](assets/images/jf.jpg)


![company_logo](assets/images/sqli_logo.png)
![gdg_logo](assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](http://twitter.com/jefBinomed)

<!-- .element: class="gplus" -->
[+JeanFrancoisGarreau](http://plus.google.com/+JeanFrancoisGarreau)

##==##

## Sommaire ## 

<div class="no-bullet"></div>

* Un peu d'histoire
* WebRTC 
* GetUserMedia
* RTCPeerConnection
* RTCDataChannel 
* Sécurisation
* Pour les devs

##==##

<!-- .slide: class="transition-black" -->

# Un peu d'histoire ?

![icon](assets/images/library.png)


##==##


## Le web aujourd'hui ?


### Quel est le point commun entre tous ces devices ?

<br><br>

![float-right w-350](assets/images/chromebook.jpg)

![float-right w-350](assets/images/glass.jpg)

![float-right w-350](assets/images/kindle.png)


##==##

## Le web aujourd'hui ?


![full-width](assets/images/browser-logos-2.jpg)


Notes:
Ils ont tous un browser ! 


##==##

# Revenons donc en arrière

<!-- .slide: data-background="assets/images/back-to-the-future-part-iii-original.jpg" data-state="hidefooter" class="transition" -->


<div class="copyright">wallpaper abyss</div>

##==##

## Souvenez vous

La visio avant c'était ça : 
<br><br>

![center h-600](assets/images/visio_history.jpg)


Notes:

##==##


## Et Surtout ! 

<br><br>

![full-height center](assets/images/flashIcon.png)


Notes:

##==##

<!-- .slide: data-background="assets/images/evolution.png" data-state="hidefooter" class="transition" -->



Notes:
Parler des nouvelles apis de plus en plus nouvelles!
Positionner le webRTC

##==##

## Le web aujourd'hui ?

### Petites questions ?


![center h-600](assets/images/hands_up.jpg)

Notes:
Qui lit des vidéos sur sont téléphone ?
Qui fait de la visio ?
Qui fait du peer2peer



##==##

## En parlant de Peer2Peer ?

### Est-ce normal que le Peer2Peer soit comme ça ?

![center hp-200 h-600](assets/images/no.png)


Notes:


##==##

## En parlant de Peer2Peer ?

### Ne devrait-il pas ressembler à ça ? 

![center hp-200 h-600](assets/images/yes.png)


Notes:


##==##

## Faisons nos courses

### Et si ? 



<div class="fragment">On avait la possibilité de gérer une communication réseau <font class="color-red">propre entre pc.</font>
</div>
<br>

<div class="fragment">On avait la possibilité de <font class="color-red">ne pas se soucier de l'encodage de nos vidéos.</font>
</div>
<br>

<div class="fragment">On n'avait pas à se soucier d'<font class="color-red">installer un plugin !</font> 
</div>
<br>

<div class="fragment">On pouvait faire cela avec notre <font class="color-red">téléphone, notre tablette, ou autre chose ?</font>
</div>
 
Notes:
Fragments ! (4)


##==##

# Et si !

<!-- .slide: data-background="assets/images/web_rtc_chat.jpg" data-state="hidefooter" class="transition" -->


<div class="copyright white">imgur</div>

Notes:
/!\ On passe sur des exemples


##==##

<!-- .slide: data-background="assets/images/Microsoft-HoloLens-Skype-RGB.jpg" data-state="hidefooter" class="transition" -->

<div class="copyright white">microsoft</div>

##==##

<!-- .slide: data-background="assets/images/webrtc_drone.jpg" data-state="hidefooter" class="transition" -->

<div class="copyright white">instructables</div>

##==##

<!-- .slide: data-background="assets/images/cube_slam.png" data-state="hidefooter" class="transition" -->

<div class="copyright white">Google</div>

##==##

<!-- .slide: data-background="assets/images/bemyeyes.jpg" data-state="hidefooter" class="transition" -->

<div class="copyright">Be My Eyes</div>

##==##

## Et si



<br><br><br><br>
<font class="big-center">WebRTC était la solution ?</font>

Notes:


##==##

## WebRTC 

<br><br>

![center](assets/images/web_rtc_what.jpg)


Notes:


##==##

## WebRTC

### RTC pour **Real Time Communication**

<br>

Obtenir l'<font class="color-red">audio et la vidéo</font>
<br><br>

<font class="color-red">Etablir une connexion</font> entre 2 hôtes
<br>
<br>

Communiquer de la <font class="color-red">vidéo et de l'audio</font> 

<br>
Communiquer d'<font class="color-red">autres types de données</font>

Notes:
Créé en 2013
Parler des problèmes derrières la vidéo et l'audio (hardware / encodage / ...)


##==##

## WebRTC

### Concrètement ?

<br>

Grâce à 3 APIS web ! 

getUserMedia

RTCPeerConnection

RTCDataChannel

Notes:
Demander s'ils pensent savoir à quoi chaque api sert ?
On va dans chaque API


##==##

## WebRTC

### Architecture

![center h-600](assets/images/webrtcArchitecture.png)

Notes:

##==##

<!-- .slide: class="transition-black" -->

# GetUserMedia


![icon](assets/images/google-webrtc-logo1.png)


Notes:


##==##

## GetUserMedia


<br>
Représente un ensemble de <font class="color-red">stream</font> de médias synchronisés !

Peut représenter <font class="color-red">plusieurs</font> flux vidéo / audio sous forme de pistes

Se récupère simplement sur **```navigator.getUse rMedia()```**

Peut être conditionné par plusieurs paramètres.

Notes:


##==##



<br><br>

![center h-700](assets/images/meme_show_code.jpg)


##==##

## GetUserMedia

### Un peu de code

```javascript
var constraints = {video: true};

function successCallback(stream) {
  var video = document.querySelector("video");
  video.src = window.URL.createObjectURL(stream);
}
function errorCallback(error) {
  console.log("navigator.getUserMedia error: ", 
  error);
}
navigator.getUserMedia(constraints, 
      successCallback, 
      errorCallback);
```

Notes:
/!\ tenir compte des préfixs ! 


##==##

## GetUserMedia

### Un peu de code

```javascript
var constraints = {
  video: {
    mandatory: {
      minAspectRadio: 1.333
    },
    optional [
    	{maxWidth : 640},
    	{maxHeight : 480},
    ]
  },
  audio : false
};

navigator.webkitGetUserMedia(constraints, 
          gotStream);
```

Notes:
/!\ tenir compte des préfixs ! 


##==##



## GetUserMedia

### Démo ! 

<div class="slideWithGetUserMedia">
	<video class="firstUserMedia" width='600px'></video>
	<br>
	<button class="firstUserMediaBtn">Miroir, mon beau miroir ...</button>

</div>

Notes:


##==##

## GetUserMedia

### Parlons sécurité !

<br><br>

 En https : <font class="color-red">une seule fois</font>


Dans les chromes apps : via le **```audioCapture```** et **```videoCapture```**




On peut changer les paramètres dans chrome



Notes:
Parler du problème potentiel derrière ça
Dans chrome & https : demandé qu'une fois 
Pas dispo dans les extensions chrome


##==##

<br><br>

![full-height center](assets/images/file.png)

Notes:
getUM ne peut être lancé en local (hors serveur)
Sinon erreur GET_PERMISSION_DENIED



##==##

## GetUserMedia

### Parlons des possibilités (contraintes)


<br>

Sa résolution

Sa source 

Récupérer son écran ou son onglet ! 

Notes:
Dispo en chrome stable pour android
https://simpl.info/getusermedia/sources/


##==##

## GetUserMedia

### Choix de résolution ou récupérer l'écran

```javascript
var constraints = {
  video: {
    mandatory: {
      chromeMediaSource: 'screen', // 'tab'
      maxWidth: 640,
      maxHeight: 360
    }
  }
};
```

Plus d'infos : http://hancke.name/webrtc/screenshare/

Notes:


##==##

## GetUserMedia

### Choix récupération d'une fenêtre ! 

```javascript
 chrome.desktopCapture.chooseDesktopMedia(
         ['screen', 'window'], 
    function (streamid) {    
    navigator.webkitGetUserMedia({
          audio:false,
          video: { mandatory: { 
               chromeMediaSource: "desktop",
               chromeMediaSourceId: streamid } }
      }, 
      function(stream){// Sucess CallBack }, 
      function(){// Error CalBack});
});
```

<b><font color='red'>Chrome App ou Chrome Extension ! </font></b>

Notes:


##==##

<!-- .slide: data-state="startUMScreen" -->

## GetUserMedia

### Partage d'écran

<div class="slideWithGetUserMedia">
  <video class="screenUserMedia"  muted autoplay width='600px'></video>
  <br>
  <span><button class="desktopShareBtn">Window</button>&nbsp;&nbsp;<button class="tabShareBtn">Tab</button></span>
 
</div>

@github : https://github.com/samdutton/simpl/blob/master/getusermedia/sources

Notes:

##==##

## GetUserMedia

### Choix de la source

```javascript
MediaStreamTrack.getSources(gotSources);
function gotSources(sourceInfos) {
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    // Object 
    // {
    // id : the id of source to use
    // label : the label of source
    // kind : the type of source ('audio, video')
    //}    
  }
}
```

Notes:
Vérifier que MediaStreamTrack existe !

##==##

## GetUserMedia

### Choix de la source

```javascript
var videoSource = videoSelect.value;
  var constraints = {
    video: {
      optional: [{sourceId: videoSource}]
    }
  };
navigator.getUserMedia(constraints, 
    successCallback, 
    errorCallback);
}
```

Notes:

##==##

<!-- .slide: data-state="startUMSource" -->

## GetUserMedia

### Choix de source  - Démo ! 

<div class="slideWithGetUserMedia">
  <div class='select'>
    <label for='audioSource'>Audio source: </label><select id='audioSource'></select>
  </div>

  <div class='select'>
    <label for='videoSource'>Video source: </label><select id='videoSource'></select>
  </div>

  <video class="thirdUserMedia"  muted autoplay width='600px'></video>
  <!--<video class="firstUserMedia" width='600px'></video>
  <br>
  <button class="firstUserMediaBtn">Miroir, mon beau miroir ...</button>-->

</div>

@github : https://github.com/samdutton/simpl/blob/master/getusermedia/sources

Notes:

##==##

## GetUserMedia

### Konami code ! 

<br>
On peut aussi : 

Enregister du son (http://simpl.info/mediarecorder)

Faire des photos depuis son flux 

Mixer son flux avec un canvas

Mixer son flux avec WebAudio


<div class="fragment">
	<blockquote>	
	Vers l'infini et l'au-delà ! 
	</blockquote>
	<img src="assets/images/buzz-leclair-inside.jpg" class="center w-300 ">
</div>


Notes:
rec son = fait sur window.url.createObjectUrl()
photo = feinte à base canvas et de draw et save image
WebAudio = post traitement du son ! (compatible RTC Peer Connection)


##==##

## GetUserMedia

### Démo ! 

<div class="slideWithAsciiCam">
	<video id="asciiCam" autoplay style='display:none'></video>
	<div id="asciiContainer">
		<!-- The ascii art comes in the pre tag below -->
		<pre id="asciiText"></pre>
	</div>
	<br>
	<button class="asciiCamBtn">Ascii Me ...</button>

</div>

<div class="copyright black">code from : @github.com/escobar5/asciicam</div>

Notes:


##==##

<!-- .slide: class="transition-black" -->

# RTCPeerConnection


![icon](assets/images/share.png)


Notes:


##==##


## GetUserMedia + RTCPeerConnection = 

![float-left w-500](assets/images/caller.jpg)

![float-left w-500](assets/images/callee.jpg)

Notes:


##==##

## RTCPeerConnection

### Sert à : 

<br><br>
 
Résoudre les problèmes de communication multimédia (<font class="color-red">codec, résolutions, ...</font>)

<br>
<font class="color-red">Identifier les adresses</font> des hôtes

<br>
Echanger les données 


Notes:


##==##

# Accrochez-vous !

<!-- .slide: data-background="assets/images/hang-on-pictures.jpg" data-state="hidefooter" class="transition" -->

<div class="copyright">langmaidpractice.com</div>

Notes:

##==##

<!-- .slide: data-background="assets/images/tableau_blanc_signaling.jpg" data-state="hidefooter" class="transition" -->

##==##

## RTCPeerConnection

### Principe de l'offre et de la demande

2 choses à retenir : 
<br>

Il y a d'une part, une notion <font class="color-red">d'offre et de demande</font> pour communiquer mais aussi une notion de <font class="color-red">chemin à emprunter !</font> 

<br>

Il s'agit du **Signaling** ! 

Quel <font class="color-red">type de média</font> et format je supporte ? 

<br>
Que puis-je envoyer ?

<br>
Quel est mon <font class="color-red">type d'infrastructure</font> réseau ? 


Notes:
Chemin = ICE = passer les proxys


##==##

## RTCPeerConnection

### Gestion de l'offre


1. Alice appelle la méthode **<font class="color-red">createOffer()</font>**
1. Dans le callback, Alice appelle **<font class="color-red">setLocalDesctiption()</font>**
1. Alice <font class="color-red">sérialise l'offre</font> et l'envoie à Eve
1. Eve appelle la méthode **<font class="color-red">setRemoteDescription()</font>** avec l'offre
1. Eve appelle la méthode **<font class="color-red">createAnswer()</font>**
1. Eve appelle la méthode **<font class="color-red">setLocalDescription()</font>** avec la réponse envoyée à Alice
1. Alice reçoit la réponse et appelle **<font class="color-red">setRemoteDescription()</font>**


Notes:
Chemin = ICE = passer les proxys
la description contient de infos du genre qualité de vidéo, résolution, ...


##==##

<br><br><br><br>
<font class="big-center">Et c'est pas fini ! </font>

##==##

## RTCPeerConnection

### Gestion du Chemin **Ice Candidate**

ICE pour **Interactive Connectivity Establishement**

<br><br>

1. Alice & Eve ont leur <font class="color-red">RTCPeerConnection</font>
1. En cas de succès de chaque côté les *<font class="color-red">IceCanditates</font>* sont envoyées
1. Alice <font class="color-red">sérialise</font> ses *IceCandidates* et les envoie à Eve
1. Eve reçoit les *IceCandidates* d'Alice et appelle **<font class="color-red">addIceCandidate()</font>**
1. Eve <font class="color-red">sérialise</font> ses *IceCandidates* et les envoie à Alice
1. Alice reçoit les *IceCandidates* d'Eve et appelle **<font class="color-red">addIceCandidate()</font> **
1. Les 2 savent comment communiquer.


Notes:
ICE = Framework de connexion de peers ! 
Au mieu connecté direct en UDP
Après connecté en TCP / via des serveurs de relais
Le ice est fait en parallèle dès qu'une peerconnection se lance


##==##

# Déjà vu ?

<!-- .slide: data-background="assets/images/Telephone-operators.jpg" data-state="hidefooter" class="transition" -->


<div class="copyright white">bnb paribas fortis</div>

Notes:
Ok mais comment fait-on ça ?



##==##

## RTCPeerConnection

### Comment fait-on le **signaling** ?


Du LongPolling / Comet

XHR + SSE

**<font class="color-red">WebSockets</font>**
  
<font class="color-grey">Solution la plus naturelle</font>


Notes:
WebSocket est le plus naturels car bidirectionnel / Si WebRTC toléré, WebSocket est toloré aussi / Utilisation du TLS pour les proxy
Demander si les gens connaissent ?


##==##

## RTCPeerConnection

### <a href="http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment" title="Wikipedia ICE article">ICE</a>  : Framework de connexion


<br><br>

1. Au mieux, on est connecté directement en UDP
1. Après on est connecté en TCP / HTTP 
1. En dernier via des serveurs de relais

![center h-400](assets/images/icestats.png)

Notes:
ICE = Interactive Connectivity Establishement
Il cherche le meilleur chemin pour chaque appel.
le plus souvent on est sur des stun et au pire on passe sur des turn
Actuellement 1 appel sur 7 est sur STUN



##==##

## RTCPeerConnection

### STUN / TURN

STUN = **Simple Traversal of UDP through NATs**

TURN = **Traversal Using Relays around NAT**

![center h-500](assets/images/STUNandTURN.png)


Notes:
STUN : protocole client-serveur permettant à un client UDP situé derrière un routeur NAT de découvrir son adresse IP publique ainsi que le type du routeur NAT
TURN: Serveur de relais à travers les NAT
STUN sert à trouver les ip / TURN relais les données ! 
Des serveurs publiques existents


##==##

![center h-700](assets/images/meme_head_burning.jpg)


##==##

# C'est bientôt la fin

<!-- .slide: data-background="assets/images/Rollercoaster.jpg" data-state="hidefooter" class="transition" -->

<div class="copyright white">rerb-leblog</div>

Notes:
Ok mais comment fait-on ça ?


##==##

<!-- .slide: class="transition-black" -->

# RTCDataChannel

![icon](assets/images/channel.png)

Notes:



##==##

## RTCDataChannel

<br>

Canal de communication de <font class="color-red">données binaires / textuelles</font>

<br>

Même <font class="color-red">API que les WebSockets</font>



Notes:
/!\ à la version utilisée, cette norme est arrivée après !
Se fait sur une PeerConnection
Expliquer les possibilités 
cf slide à la fin


##==##

## RTCDataChannel



```javascript
var pc = new webkitRTCPeerConnection(servers,
  {optional: [{RtpDataChannels: true}]});
pc.ondatachannel = function(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function(event){
    document.querySelector("div#receive")
          .innerHTML = event.data;
  };
};
sendChannel = pc.createDataChannel(
  "sendDataChannel", {reliable: false});
document.querySelector("button#send").onclick = 
  function (){
  var data = document.querySelector(
    "textarea#send").value;
    sendChannel.send(data);
};
```


Notes:

##==##

## Par exemple

![center h-500](assets/images/data_channel_use_case.png)


##==##

<!-- .slide: data-state="startDataChannel" -->

## Démo


<div class="slideWithDataChannel">
  <section class="container-phone">
    <div id="scene-phone" style="transform: rotateY(20deg)">
      <figure class="front"></figure>
      <figure class="back"></figure>
      <figure class="right"></figure>
      <figure class="left"></figure>
      <figure class="top"></figure>
      <figure class="bottom"></figure>
    </div>
  </section>
</div>


##==##

<!-- .slide: class="transition-black" -->

# Et la sécurité ?

![icon](assets/images/lock.png)

Notes:


##==##

## Sécurité

<br>
 
<font class="color-red">Cryptage</font> des données et des médias

<font class="color-red">Sécurisation graphique</font> via les autorisations !

 ![center h-200](assets/images/allow_camera.png)

<font class="color-red">Sandboxé</font>, sans plugin !

Notes:
Pensée depuis le début
Encryptage SRTP
Le fait de sandboxer garanti la non altération du navigateur.
/!\ Cependant un risque d'attaque type proxy peut être faites avec le signaling !  et donc au final capturer le flux



##==##

## Architecture recommandée

![center](assets/images/securePathways.png)


Notes:
En gros y a pas de secret, pensez HTTPS et WSS ! 



##==##

<!-- .slide: class="transition-black" -->

# Et pour les devs ?


![icon](assets/images/developpment_white.svg)

Notes:


##==##

## Outils : 

<br>

 * Url dans chrome pour suivre ses applications webRTC : **```chrome://webrtc-internals```**

 * [Adapter.js](https://code.google.com/p/webrtc/source/browse/trunk/samples/apprtc/js/base/adapter.js) : une librairie qui supprime les préfixes et harmonise les différences entre Chrome & Firefox

 * Librairies Vidéo / Chat : 
	* [SimpleWebRTC](https://github.com/henrikjoreteg/SimpleWebRTC)
	* [easyRTC](https://github.com/priologic/easyrtc)

 * Librairies orientées Peer2Peer : 
 	* [ShareFest](https://github.com/peer5/sharefest)
 	* [PeerJS](http://peerjs.com/)

Notes:
Solutions avec leur serveur



##==##

## SimpleWebRTC

<br><br>

```html
<!DOCTYPE html>
<html>
    <head>
        < script src="http://simplewebrtc.com/
            latest.js"></ script>
    </head>
    <body>
        <div id="localVideo"></div>
        <div id="remoteVideos"></div>
    </body>
</html>
```

Notes:
Simplement 2 balises ! gère le multi hotes


##==##

## SimpleWebRTC

<br><br>

```javascript
var webrtc = new WebRTC({
  localVideoEl: 'localVideo',
  remoteVideosEl: 'remoteVideos',
  autoRequestMedia: true
});

webrtc.on('readyToCall', function () {
    webrtc.joinRoom('My room name');
});
```

Notes:
Basé sur socket IO et un serveur node ! 

##==##

## PeerJS

Fait pour du Peer2Peer
<br><br>
```javascript
var peer = new Peer('someid', {key: 'apikey'});
peer.on('connection', function(conn) {
  conn.on('data', function(data){
    // Will print 'hi!'
    console.log(data);
  });
});

// Connecting peer
var peer = new Peer('anotherid', {key: 'apikey'});
var conn = peer.connect('someid');
conn.on('open', function(){
  conn.send('hi!');
});
```

Notes:



##==##

<br><br>

![center h-700](assets/images/meme_easy.jpg)

Notes:
C'était simple et ça peut l'être


##==##


<!-- .slide: data-background="assets/images/the-end-is-near.jpg" data-state="hidefooter" class="transition" -->




Notes:

##==##

## What's Next ?

### Pleins de choses ! 

Support dans IE pour <font class="color-red">ORTC</font> !

ORTC (ie <font class="color-red">WebRTC 1.1</font>)

Support Natif


##==##


## Conclusion


<br><br>

**WebRTC** est une technologie prometteuse et riche en possibilités.

<br>

WebRTC = getUserMedia + RTCPeerConnection + RTCDataChannel

<br>

=> Il n'y a pas que de la visio dans le WebRTC ! 

<br>



Notes:
**/!\ Limitation de 12 peerConnections ouvertes en même temps.**



##==##


## Conclusion


Tenez comptes des comptabilités ! 

<br><br>

|Browser|UserMedia|RTCPeerConnection|RTCDataChannel|
|-----|------|-|----------|
|Chrome desktop|18.0.1008+|20+|26+|
|Android|Lollipop 5.0|Lollipop 5.0| Lolipop 5.0|
|Chrome Android|29+|29+|29+|
|Opera|18+|18+|18+|
|Opera for Android|20+|20+|20+|
|FireFox|17+|22+|22+|
|IE|x|11 ORTC|11 ORTC|

<br>

http://iswebrtcreadyyet.com/



Notes:



##==##

## Liens


[Application de démo maintenue par la team WebRTC](http://apprtc.appspot.com/)

[Présentation WebRTC Google IO ](http://simpl.info/rtc/)

[WebRTC and Web Audio resources list](http://bit.ly/webrtcwebaudio)

HTML5 Rocks:
<br><br>
[Getting Started With WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)

[Mise à jour WebRTC](http://www.html5rocks.com/en/search?q=webrtc)

[Capturing audio and video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/)

[RTCDataChannel](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/?redirect_from_locale=fr)


Notes:



##==##

<!-- .slide: class="last-slide" -->


<br><br>

#  Merci  


<br><br><br>
Cette Présentation  [http://goo.gl/B6Phir](http://goo.gl/B6Phir)



<div class="copyright">images & resources provenant des slides de SamDutton</div>
