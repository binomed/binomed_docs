<!-- .slide: class="first-slide" -->

# **WebRTC**

### 2014.23.05 BreizhCamp @ **Rennes** <br><br>http://goo.gl/B6Phir


<video id="remoteVideo" autoplay="autoplay" muted="true"></video> 

##==##

<!-- .slide: class="who-am-i" -->

## Qui suis-je ?

### Jean-François GARREAU

![avatar center w-300 wp-200](assets/images/jf.jpg)


![company_logo](assets/images/sqli_logo.png)
![gdg_logo](assets/images/GDG-Logo-carre.png)


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


* Quel est le point commun entre tous ces devices ?

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

<!-- .slide: data-background="assets/images/evolution.png" data-state="hidefooter" class="transition" -->



Notes:
Parler des nouvelles apis de plus en plus nouvelles!
Positionner le webRTC


##==##

## Le web aujourd'hui ?

<br><br>

### Petites questions ?

Notes:
Qui lit des vidéos sur sont téléphone ?
Qui fait de la visio ?
Qui fait du peer2peer


##==##

## En parlant de Peer2Peer ?

Est-ce normal que le Peer2Peer soit comme ça ?

![center hp-200](assets/images/no.png)


Notes:


##==##

## En parlant de Peer2Peer ?

Ne devrait-il pas ressembler à ça ? 

![center hp-200](assets/images/yes.png)


Notes:


##==##

## Faisons nos courses

Et si ? 



<div class="fragment"><ul><li>On avait la possibilité de gérer une communication réseau propre entre pc.
</li></ul></div>

<div class="fragment"><ul><li>On avait la possibilité de ne pas se soucier de l'encodage de nos vidéos.
</li></ul></div>

<div class="fragment"><ul><li>On n'avait pas à se soucier d'installer un plugin ! 
</li></ul></div>

<div class="fragment"><ul><li>On pouvait faire cela avec notre téléphone, notre tablette, ou autre chose ?
</li></ul></div>
 
Notes:
Fragments ! (4)


##==##

# Et si !

<!-- .slide: data-background="assets/images/web_rtc_chat.jpg" data-state="hidefooter" class="transition" -->


<div class="copyright">imgur</div>

Notes:


##==##

## Et si



<br><br><br><br>
<h3>WebRTC était la solution ?</h3>

Notes:


##==##

<!-- .slide: class="transition-black" -->

# WebRTC 


![icon](assets/images/google-webrtc-logo1.png)


Notes:


##==##

## WebRTC 

<br><br>

![center](assets/images/web_rtc_what.jpg)


Notes:


##==##

## WebRTC

RTC pour **Real Time Communication**

<br>

* Obtenir l'audio et la vidéo

* Etablir une connexion entre 2 hôtes

* Communiquer de la vidéo et de l'audio

* Communiquer d'autres types de données

Notes:
Créé en 2013
Parler des problèmes derrières la vidéo et l'audio (hardware / encodage / ...)


##==##

## WebRTC

Concrètement ?

<br>

Grâce à 3 APIS web ! 

<br>

* getUserMedia

* RTCPeerConnection

* RTCDataChannel

Notes:
Demander s'ils pensent savoir à quoi chaque api sert ?
On va dans chaque API


##==##

## WebRTC

Architecture

![center h-600](assets/images/webrtcArchitecture.png)

Notes:


##==##

## GetUserMedia


<br>
Représente un ensemble de stream de médias synchronisés !

<br>
Peut représenter plusieurs flux vidéo / audio sous forme de pistes

<br>
Se récupère simplement sur **```navigator.getUserMedia()```**

<br>
Peut être conditionné par plusieurs paramètres.

Notes:


##==##



<br><br>

![center h-700](assets/images/meme_show_code.jpg)


##==##

## GetUserMedia

Un peu de code

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

Un peu de code

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

Cas pratique ! 

<div class="slideWithGetUserMedia">
	<video class="firstUserMedia" width='600px'></video>
	<br>
	<button class="firstUserMediaBtn">Miroir, mon beau miroir ...</button>

</div>

Notes:


##==##

## GetUserMedia

Parlons sécurité !

<br><br>

 * En https : une seule fois

 * Dans les chromes apps : via le **```audioCapture```** et **```videoCapture```**

 * On peut changer les paramètres dans chrome



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

Parlons des possibilités (contraintes)

<br>

On peut choisir : 

<br>

 * Sa résolution

 * Sa source 

 * Récupérer son écran ou son onglet ! 

Notes:
Dispo en chrome stable pour android
https://simpl.info/getusermedia/sources/


##==##

## GetUserMedia

Choix de résolution ou récupérer l'écran

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

Choix de la source

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

Choix de la source

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

Choix de source ! 

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

Konami code ! 

<br>
On peut aussi : 

* Enregister du son (http://simpl.info/mediarecorder)

* Faire des photos depuis son flux 

* Mixer son flux avec un canvas

* Mixer son flux avec WebAudio


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

Démo ! 

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

Sert à : 

<br><br>
 
 * Résoudre les problèmes de communication multimédia (codec, résolutions, ...)

 * Identifier les adresses des hôtes

 * Echanger les données 


Notes:


##==##

# Accrochez-vous !

<!-- .slide: data-background="assets/images/hang-on-pictures.jpg" data-state="hidefooter" class="transition" -->

<div class="copyright">langmaidpractice.com</div>

Notes:



##==##

## RTCPeerConnection

Principe de l'offre et de la demande

2 choses à retenir : 
<br>

Il y a d'une part, une notion d'offre et de demande pour communiquer mais aussi une notion de chemin à emprunter ! 

<br>

Il s'agit du **Signaling** ! 

 * Quel type de média et format je supporte ? 

 * Que puis-je envoyer ?

 * Quel est mon type d'infrastructure réseau ? 


Notes:
Chemin = ICE = passer les proxys


##==##

## RTCPeerConnection

Gestion de l'offre


1. Alice appelle la méthode **```createOffer()```**
1. Dans le callback, Alice appelle **```setLocalDesctiption()```**
1. Alice sérialise l'offre et l'envoie à Eve
1. Eve appelle la méthode **```setRemoteDescription()```** avec l'offre
1. Eve appelle la méthode **```createAnswer()```**
1. Eve appelle la méthode **```setLocalDescription()```** avec la réponse envoyée à Alice
1. Alice reçoit la réponse et appelle **```setRemoteDescription()```**


Notes:
Chemin = ICE = passer les proxys
la description contient de infos du genre qualité de vidéo, résolution, ...


##==##

## RTCPeerConnection

Gestion du Chemin **Ice Candidate**

ICE pour **Interactive Connectivity Establishement**

1. Alice & Eve ont leur RTCPeerConnection
1. En cas de succès de chaque côté les *IceCanditates* sont envoyées
1. Alice sérialise ses *IceCandidates* et les envoie à Eve
1. Eve reçoit les *IceCandidates* d'Alice et appelle **```addIceCandidate()```**
1. Eve sérialise ses *IceCandidates* et les envoie à Alice
1. Alice reçoit les *IceCandidates* d'Eve et appelle **```addIceCandidate()```**
1. Les 2 savent comment communiquer.


Notes:
ICE = Framework de connexion de peers ! 
Au mieu connecté direct en UDP
Après connecté en TCP / via des serveurs de relais
Le ice est fait en parallèle dès qu'une peerconnection se lance


##==##

# Déjà vu ?

<!-- .slide: data-background="assets/images/Telephone-operators.jpg" data-state="hidefooter" class="transition" -->


<div class="copyright">bnb paribas fortis</div>

Notes:
Ok mais comment fait-on ça ?



##==##

## RTCPeerConnection

Comment fait-on le **signaling** ?

On peut utiliser : 

<br>

* Du LongPolling / Comet

* XHR + SSE

* **WebSockets**
  * Plus naturel car bidirectionnel
  * Si le webRTC est supporté, alors les webSockets sont supportés
  * Peut aussi utiliser le TLS


Notes:
WebSocket est le plus naturels car bidirectionnel / Si WebRTC toléré, WebSocket est toloré aussi / Utilisation du TLS pour les proxy
Demander si les gens connaissent ?


##==##

## RTCPeerConnection

<a href="http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment" title="Wikipedia ICE article">ICE</a>  : Framework de connexion

Il cherche le meilleur chemin pour chaque appel.

1. Au mieux, on est connecté directement en UDP
1. Après on est connecté en TCP / HTTP 
1. En dernier via des serveurs de relais

![center h-400](assets/images/icestats.png)

Notes:
le plus souvent on est sur des stun et au pire on passe sur des turn
Actuellement 1 appel sur 7 est sur STUN



##==##

## RTCPeerConnection

STUN / TURN

* STUN = **Simple Traversal of UDP through NATs**
* TURN = **Traversal Using Relays around NAT**

![center](assets/images/STUNandTURN.png)


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

<div class="copyright">rerb-leblog</div>

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

Canal de communication de données binaires / textuelles

<br>

Même API que les WebSockets


<br>

/!\ à la version utilisée, cette norme est arrivée après !


<br>
Se fait sur une PeerConnection

Notes:
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

<!-- .slide: class="transition-black" -->

# Et la sécurité ?

![icon](assets/images/lock.png)

Notes:


##==##

## Sécurité

<br>

 * Pensée depuis le début
 
 * Cryptage des données et des médias

 * Sécurisation graphique via les autorisations !

 ![center h-200](assets/images/allow_camera.png)

 * Sandboxé, sans plugin !

Notes:
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


## Conclusion


<br><br>

**WebRTC** est une technologie prometteuse et riche en possibilités.

<br>

WebRTC = getUserMedia + RTCPeerConnection + RTCDataChannel

<br>

=> Il n'y a pas que de la visio dans le WebRTC ! 

<br>

**/!\ Limitation de 12 peerConnections ouvertes en même temps.**




Notes:


##==##


## Conclusion



Tenez comptes des comptabilités ! 

<br><br>

|Browser|UserMedia|RTCPeerConnection|RTCDataChannel|
|-----|------|-|----------|
|Chrome desktop|18.0.1008+|20+|26+|
|Chrome Android|29+|29+|29+|
|Opera|18+|18+|18+|
|Opera for Android|20+|20+|20+|
|FireFox|17+|22+|22+|

<br>

http://iswebrtcreadyyet.com/



Notes:



##==##

## Liens


* [Application de démo maintenue par la team WebRTC](http://apprtc.appspot.com/)

* [Cette Présentation](http://goo.gl/B6Phir)

* [Présentation WebRTC Google IO ](http://simpl.info/rtc/)

* [WebRTC and Web Audio resources list](http://bit.ly/webrtcwebaudio)

* HTML5 Rocks:
 * [Getting Started With WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)
 * [Mise à jour WebRTC](http://www.html5rocks.com/en/search?q=webrtc)
 * [Capturing audio and video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/)
 * [RTCDataChannel](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/?redirect_from_locale=fr)


Notes:



##==##

<!-- .slide: class="last-slide" -->


# <!-- .element: class="topic-title" --> WebRTC

# <!-- .element: class="presenter" --> **Jean-François Garreau  **

# <!-- .element: class="work-rule" --> GDG Nantes Leader & Ingénieur SQLI  

# <!-- .element: class="email" --> **jfgarreau**@sqli.com  

# <!-- .element: class="thank-message" --> Merci  

![avatar](/assets/images/jf.jpg)


<div class="copyright">images & resources provenant des slides de SamDutton</div>

