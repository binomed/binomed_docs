<div class="first-slide"></div>

# **WebRTC**

## Devfest Marseille

### 2014.24.04 Devfest @ **Marseille**

<div id="remoteVideo"></div>
 TODO faire le souriez vous êtes filmé ! 


##==##

## Qui suis-je ?

###  Jean-François GARREAU

![avatar center w-300 wp-200](/assets/images/jf.jpg)


![company_logo](/assets/images/sqli_logo.png)
![gdg_logo](/assets/images/GDG-Logo-carre.png)

<footer/>

##==##

## Sommaire ## 

<div class="no-bullet"></div>

<br>

* Un peu d'histoire

<br>

* WebRTC

<br>

* GetUserMedia

<br>

* RTCPeerConnection

<br>

* RTCDataChannel 

<br>

* Sécurisation

<br>

* Pour les devs

<footer/>

##==##

<div class='transition'></div>

# Un peu d'histoire ?

![icon](/assets/images/library.png)


##==##


## Le web aujourd'hui ?

<br><br>

* Quel est le point commun entre tous ces devices ?

<br><br><br><br>

![float-right w-400](assets/images/chromebook.jpg)

![float-right w-400](assets/images/glass.jpg)

![float-right w-400](assets/images/kindle.png)




<aside class="notes">

</aside>
<footer/>
##==##

## Le web aujourd'hui ?


![full-width](assets/images/browser-logos-2.jpg)


<aside class="notes">
Ils ont tous un browser ! 
</aside>
<footer/>


##==##


<div class="photo-slide"></div>

![photo-slide](/assets/images/evolution.png);


<aside class="notes">
Parler des nouvelles apis de plus en plus nouvelles!
Positionner le webRTC
</aside>

##==##

## Le web aujourd'hui ?

<br><br>

# Petites questions ?

<aside class="notes">
Qui lit des vidéos sur sont téléphone ?
Qui fait de la visio ?
Qui fait du peer2peer
</aside>
<footer/>

##==##

## En parlant du Peer2Peer ?

### Est ce normal que le peer2peer soit ça ! 

![center hp-200](/assets/images/no.png)


<aside class="notes">

</aside>
<footer/>

##==##

## En parlant du Peer2Peer ?

### Ne devrait-il pas ressembler à ça ? 

![center hp-200](/assets/images/yes.png)


<aside class="notes">

</aside>
<footer/>

##==##

## Faisons nos courses

### Et si ? 

<br><br>

<div class="fragment"><ul><li>On avait la possibilité de gérer une communication réseaux propre entre pc
</li></ul></div>

<br>

<div class="fragment"><ul><li>On avait la possibilité de ne pas soucier de l'encodage de nos vidéos 
</li></ul></div>

<br>

<div class="fragment"><ul><li>On avait pas à ce soucier d'installer un plugin ! 
</li></ul></div>

<br>

<div class="fragment"><ul><li>On pouvait faire cela avec notre téléphone, notre tablette, ou autre chose ?
</li></ul></div>

<aside class="notes">
Fragments ! (4)
</aside>
<footer/>

##==##

# Et si !

<div class="photo-slide"></div>

![photo-slide](assets/images/web_rtc_chat.jpg)

<div class="copyright">imgur</div>

<aside class="notes">
</aside>

##==##

## Et si



<br><br><br><br>
<h1>WebRTC était la solution !</h1>

<aside class="notes">

</aside>
<footer/>

##==##

<div class='transition'></div>

# WebRTC 


![icon](/assets/images/google-webrtc-logo1.png)


<aside class="notes">
</aside>

##==##

## WebRTC 

<br><br>

![center](/assets/images/web_rtc_what.jpg)


<aside class="notes">
</aside>
<footer/>

##==##

## WebRTC

### RTC pour Real Time Communication

<br><br><br>

* Obtenir l'audio et la vidéo

<br>

* Etablir une connection entre 2 hôtes

<br>

* Communiquer de la vidéo et de l'audio

<br>

* Communication d'autres types de données

<aside class="notes">
Créé en 2013
Parler des problèmes derrières la vidéo et l'audio (hardware / encodage / ...)
</aside>
<footer/>

##==##

## WebRTC

### Concrètement ?

<br>

Grâce à 3 APIS web ! 

<br>

* getUserMedia

<br>

* RTCPeerConnection

<br>

* RTCDataChannel

<aside class="notes">
Demander s'ils pensent savoir à quoi chaque api sert ?
On va dans chaque API
</aside>
<footer/>

##==##

## WebRTC

### Architechture

![center h-600](assets/images/webrtcArchitecture.png)

<aside class="notes">
</aside>
<footer/>

##==##

## GetUserMedia


<br>
Réprésente un ensemble de stream de médias syncrhonisés !

<br>
Peut réprésenter plusieurs flux vidéo / audio sous formes de pistes

<br>
Se récupère simplement sur **```navigator.getUserMedia()```**

<br>
Peut être conditionné par plusieurs paramètres.

<aside class="notes">

</aside>
<footer/>

##==##



<br><br>

![center h-700](assets/images/meme_show_code.jpg)

<footer/>

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
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
```

<aside class="notes">
/!\ tenir compte des préfixs ! 
</aside>
<footer/>

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

navigator.webkitGetUserMedia(constraints, gotStream);
```

<aside class="notes">
/!\ tenir compte des préfixs ! 
</aside>
<footer/>

##==##



## GetUserMedia

### Cas pratique ! 

<div class="slideWithGetUserMedia">
	<video class="firstUserMedia" width='600px'></video>
	<br>
	<button class="firstUserMediaBtn">Miroir, mon beau miroir ...</button>

</div>

<aside class="notes">

</aside>
<footer/>

##==##

## GetUserMedia

### Parlons sécurité !

<br><br>

 * En https : une seule fois

<br><br>

 * Dans les chromes apps : via le **```audioCapture```** et **```videoCapture```**

<br><br>

 * Après on peut changer les paramètres dans chrome



<aside class="notes">
Parler du problème potentiel derrière ça
Dans chrome & https : demandé qu'une fois 
Pas dispo dans les extensions chrome
</aside>
<footer/>

##==##

<br><br>

![full-height center](/assets/images/file.png)

<aside class="notes">
getUM ne peut être lancé en local (hors serveur)
Sinon erreur GET_PERMISSION_DENIED
</aside>
<footer/>


##==##

## GetUserMedia

### Parlons des possibilités

<br>

On peut choisir : 

<br>

 * sa résolution

<br><br>

 * Sa source (```front-facing``` ou ```rear-facing``` : Chrome Beta)

<br><br>

 * récupérer son écran ou son onglet ! 

<aside class="notes">
Dispo en chrome stable pour android
https://simpl.info/getusermedia/sources/

</aside>
<footer/>



##==##

## GetUserMedia

### Konami code ! 

<br>
On peut aussi : 

* enregister du son (http://simpl.info/mediarecorder)
* faire des photos de son flux 
* mixer son flux avec un canva : 
* mixer son flux avec WebAudio

<br><br>

<div class="fragment">
	<blockquote>	
	Vers l'infini et l'au-delà ! 
	</blockquote>
	<img src="assets/images/buzz-leclair-inside.jpg" class="center w-300 ">
</div>


<aside class="notes">
rec son = fait sur window.url.createObjectUrl()
photo = feinte à base canvas et de draw et save image
WebAudio = post traitement du son ! (compatible RTC Peer Connection)
</aside>
<footer/>

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

<aside class="notes">
</aside>
<footer/>

##==##

<div class='transition'></div>

# RTCPeerConnection


![icon](/assets/images/share.png)


<aside class="notes">
</aside>

##==##


## GetUserMedia + RTCPeerConnection = 

![float-left w-500](/assets/images/caller.jpg)

![float-left w-500](/assets/images/callee.jpg)

<aside class="notes">
</aside>
<footer/>

##==##

## RTCPeerConnection

### Sert à : 

<br><br>
 
 * résoudre les problèmes de communications multimédia (codec, résolutions, ...)

<br><br>

 * identifier les adresse des hôtes

<br><br>

 * échanger les données 


<aside class="notes">
</aside>
<footer/>

##==##

# Accrochez-vous !

<div class="photo-slide"></div>

![photo-slide](assets/images/hang-on-pictures.jpg)

<div class="copyright">langmaidpractice.com</div>

<aside class="notes">
</aside>


##==##

## RTCPeerConnection

### Principe de l'offre et de la demande

2 choses à retenir : 
<br>

Il y a d'une part, une notion d'offre et de demande pour communiquer mais aussi une notion de chemin à emprunter ! 

<br>

Il s'agit du **Signaling** ! 

 * Quel type de média et format je supporte. Ce que je veux envoyer

<br>

 * Sur quel type d'infrastructure réseau je suis ? 


<aside class="notes">
Chemin = ICE = passer les proxys
</aside>
<footer/>

##==##

## RTCPeerConnection

### Gestion de l'offre


1. Alice appelle la méthode **```createOffer()```**
1. Dans le callback, Alice appelle **```setLocalDesctiption()```**
1. Alice sérialise l'offre et l'envoie à Eve
1. Eve appelle la méthode **```setRemoteDescription()```** avec l'offre
1. Eve appelle la méthode **```createAnswer()```**
1. Eve appelle la méthode **```setLocalDescription()```** avec la réponse envoyé à Alice
1. Alice reçoit la réponse et appelle **```setRemoteDescription()```**


<aside class="notes">
Chemin = ICE = passer les proxys
la description contient de infos du genre qualité de vidéo, résolution, ...
</aside>
<footer/>

##==##

## RTCPeerConnection

### Gestion du Chemin **Ice Candidate**

ICE pour Interactive Connectivity Establishement

1. Alice & Eve on leurs RTCPeerConnection
1. En cas de succès de chaque côté les icecanditate sont envoyés
1. Alice sérialise ses IceCandidates et les envoie à Eve
1. Eve reçoit les IceCandidates d'Alice et appelle **```addIceCandidate()```**
1. Eve sérialise ses IceCandidates et les envoie à Alice
1. Alice reçoit les IceCandidates d'Eve et appelle **```addIceCandidate()```**
1. Les 2 savent comment communiquer.


<aside class="notes">
ICE = Framework de connection de peers ! 
Au mieu connecté direct en UDP
Après connecté en TCP / via des serveurs de relais
</aside>
<footer/>

##==##

# Déjà vu ?

<div class="photo-slide"></div>

![photo-slide](assets/images/Telephone-operators.jpg)

<div class="copyright">bnb paribas fortis</div>

<aside class="notes">
Ok mais comment fait-on ça ?
</aside>


##==##

## RTCPeerConnection

TODO vérifier l'ordre  !


<aside class="notes">
Chemin = ICE = passer les proxys
</aside>
<footer/>


##==##

## RTCPeerConnection

### Possibilités de signaling

Pour faire ça, on peut utiliser : 

<br>

* Du LongPolling / Comet

<br>

* XHR + SSE

<br>

* **WebSokects**
  * Plus naturel car bidirectionnel
  * Si le webRTC est supporté, alors le webRTC est supporté
  * Peut aussi utiliser le TLS

<br><br>


<aside class="notes">
WebSocket est le plus naturels car bidirectionnel / Si WebRTC toléré, WebSocket est toloré aussi / Utilisation du TLS pour les proxy
Demander si les gens connaissent ?
</aside>
<footer/>

##==##

## RTCPeerConnection

### <a href="http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment" title="Wikipedia ICE article">ICE</a>  : Framework de connection

Il cherche le meilleur chemin pour chaque appels.

1. Au mieu, on est connecté direct en UDP
1. Après on est connecté en TCP / HTTP 
1. En dernier via des serveurs de relais

![center h-400](/assets/images/icestats.png)

<aside class="notes">
le plus souvent on est sur des stun et au pire on passe sur des turn
Actuellement 1 appel sur 7 est sur STUN
</aside>
<footer/>


##==##

## RTCPeerConnection

### STUN / TURN

* STUN = Simple Traversal of UDP through NATs
* TURN = Traversal Using Relays around NAT

![center](/assets/images/STUNandTURN.png)


<aside class="notes">
STUN : protocole client-serveur permettant à un client UDP situé derrière un routeur NAT de découvrir son adresse IP publique ainsi que le type du routeur NAT
TURN: Serveur de relais à travers les NAT
STUN sert à trouver les ip / TURN relais les données ! 
Des serveurs publiques existents
</aside>
<footer/>

##==##

![center h-700](assets/images/meme_head_burning.jpg)

<footer/>

##==##

# c'est bientôt la fin

<div class="photo-slide"></div>

![photo-slide](assets/images/Rollercoaster.jpg)

<div class="copyright">rerb-leblog</div>

<aside class="notes">
Ok mais comment fait-on ça ?
</aside>

##==##

<div class='transition'></div>

# RTCDataChannel

![icon](assets/images/channel.jpg)

<aside class="notes">
</aside>


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

<aside class="notes">
Expliquer les possibilités 
</aside>
<footer/>

##==##

## RTCDataChannel



```javascript
var pc = new webkitRTCPeerConnection(servers,
  {optional: [{RtpDataChannels: true}]});

pc.ondatachannel = function(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function(event){
    document.querySelector("div#receive").innerHTML = event.data;
  };
};

sendChannel = pc.createDataChannel("sendDataChannel", 
	{reliable: false});

document.querySelector("button#send").onclick = function (){
  var data = document.querySelector("textarea#send").value;
  sendChannel.send(data);
};
```


<aside class="notes">

</aside>
<footer/>

##==##

<div class='transition'></div>

# Et la sécurité ?

![icon](assets/images/lock.png)

<aside class="notes">
</aside>

##==##

## Sécurité

<br>

 * Pensée depuis le début
 
<br>

 * Cryptage des données et médias

<br>

 * Sécurisation graphique via les autorisations !

<br>

 ![center h-200](assets/images/allow_camera.png)

<br>

 * Sandboxé, sans plugin !

<aside class="notes">
Le fait de sandboxer garanti la non altération du navigateur.
/!\ Cependant un risque d'attaque type proxy peut être faites avec le signaling !  et donc au final capturer le flux
</aside>
<footer/>


##==##

## Architecture recommandée

![center](assets/images/securePathways.png)


<aside class="notes">
En gros y a pas de secret, pensez HTTPS et WSS ! 
</aside>
<footer/>


##==##

<div class='transition'></div>

# Et pour les devs ?


![icon](assets/images/developpment.svg)

<aside class="notes">

</aside>
<footer/>

##==##

## Outils : 

<br><br>

 * Url dans chrome pour suivre ses applications webRTC : **```chrome://webrtc-internals```**

 <br>

 * [Adapter.js](https://code.google.com/p/webrtc/source/browse/trunk/samples/apprtc/js/base/adapter.js) : une librairie qui supprime les prefixes et armonise les différences entre Chrome & Firefox

 <br> 

 * Librairies Vidéo / Chat : 
	* [SimpleWebRTC](https://github.com/henrikjoreteg/SimpleWebRTC)
	* [easyRTC](https://github.com/priologic/easyrtc)

<br>

 * Librairies orientées Peer2Peer : 
 	* [ShareFest](https://github.com/peer5/sharefest)
 	* [PeerJS](http://peerjs.com/)

<aside class="notes">
Solutions avec leur serveur
</aside>
<footer/>


##==##

## SimpleWebRTC

<br><br>

```html
<!DOCTYPE html>
<html>
    <head>
        < script src="http://simplewebrtc.com/latest.js"></ script>
    </head>
    <body>
        <div id="localVideo"></div>
        <div id="remoteVideos"></div>
    </body>
</html>
```

<aside class="notes">
Simplement 2 balises ! gère le multi hotes
</aside>
<footer/>

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

<aside class="notes">
Basé sur socket IO et un serveur node ! 
</aside>
<footer/>

##==##

<br><br>

![center h-700](assets/images/meme_easy.jpg)

<aside class="notes">
C'était simple et ça peut l'être
</aside>
<footer/>

##==##


<div class="photo-slide"></div>

![photo-slide](assets/images/the-end-is-near.jpg)



<aside class="notes">

</aside>
##==##

## Liens

<br>

* [Application de démo maintenue par la team WebRTC](http://apprtc.appspot.com/)

<br>

* [Présentation WebRTC Google IO ](http://simpl.info/rtc/)

<br>

* [WebRTC and Web Audio resources list](http://bit.ly/webrtcwebaudio)

<br>

* HTML5 Rocks:
	* [Getting Started With WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)
	* [Mise à jour WebRTC](http://www.html5rocks.com/en/search?q=webrtc)
	* [Capturing audio and video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/)


<aside class="notes">
</aside>
<footer/>


##==##

<div class="last-slide"></div>

<div class="topic-title"></div>

# WebRTC

<div class="presenter"></div>

# **Jean-François Garreau**

<div class="gdg-rule"></div>

# GDG Nantes Leader

<div class="work-rule"></div>

# Ingénieur SQLI

<div class="thank-message"></div>

# **Merci**

![avatar](/assets/images/jf.jpg)

<div class="copyright">images provent des slides de SamDutton</div>

