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

<div class="no-bullet"></div>

* Un peu d'histoire
* WebRTC What ?
* Applications 

<footer/>

##==##

<!--
  __  __  ____  _   _ _____  ______   __  __  ____  ____ _____ _      ______ 
 |  \/  |/ __ \| \ | |  __ \|  ____| |  \/  |/ __ \|  _ \_   _| |    |  ____|
 | \  / | |  | |  \| | |  | | |__    | \  / | |  | | |_) || | | |    | |__   
 | |\/| | |  | | . ` | |  | |  __|   | |\/| | |  | |  _ < | | | |    |  __|  
 | |  | | |__| | |\  | |__| | |____  | |  | | |__| | |_) || |_| |____| |____ 
 |_|  |_|\____/|_| \_|_____/|______| |_|  |_|\____/|____/_____|______|______|
                                                                             
-->

<div class='transition'></div>

# Un peu d'histoire ?

![icon](/assets/images/android_donut.jpg)

<!-- TODO trouver une image -->


##==##


## Le web aujourd'hui ?

* Quel est le point commun entre tous ces devices ?

<br>
  TODO mettre un image de pc, de tablette, de voiture, de glass




<aside class="notes">

</aside>
<footer/>
##==##

## Le web aujourd'hui ?



<br><br><br><br>
<h1>Ils ont tous un browser ! </h1>

<aside class="notes">

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

### Petites questions !

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

TODO mettre des fragements

<br><br>

* On avait la possibilité de gérer une communication réseaux propre entre pc

<br>

* On avait la possibilité de ne pas soucier de l'encodage de nos vidéos 

<br>

* On avait pas à ce soucier d'installer un plugin ! 

<br>

* On pouvait faire cela avec notre téléphone, notre tablette, ou autre chose ?

<aside class="notes">

</aside>
<footer/>

##==##

## Faisons nos courses

### Et si ? 

<br><br>
<h1>WebRTC était la solution !</h1>

<aside class="notes">

</aside>
<footer/>

##==##

<!--
//               _   _   _____    _____     ____    _____   _____  
//       /\     | \ | | |  __ \  |  __ \   / __ \  |_   _| |  __ \ 
//      /  \    |  \| | | |  | | | |__) | | |  | |   | |   | |  | |
//     / /\ \   | . ` | | |  | | |  _  /  | |  | |   | |   | |  | |
//    / ____ \  | |\  | | |__| | | | \ \  | |__| |  _| |_  | |__| |
//   /_/    \_\ |_| \_| |_____/  |_|  \_\  \____/  |_____| |_____/ 
//                                                                 
//  
-->

<div class='transition'></div>

# WebRTC What ?


TODO image raptor
![icon](/assets/images/android_eclair.jpg)


<aside class="notes">
</aside>

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

* getUserMedia

* RTCPeerConnection

* RTCDataChannel

<aside class="notes">
Demander s'ils pensent savoir à quoi chaque api sert ?
On va dans chaque API
</aside>
<footer/>

##==##

## WebRTC

### Architechture

TODO mettre l'image de l'architecture de webRTC

<aside class="notes">
</aside>
<footer/>

##==##

## GetUserMedia

Réprésente un ensemble de stream de médias syncrhonisés !


Peut réprésenter plusieurs flux vidéo / audio sous formes de pistes


Se récupère simplement sur ```navigator.getUserMedia()```


peut être conditionné par plusieurs paramètres.

<aside class="notes">

</aside>
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

### Cas pratique ! 

TODO Démo du carillion

<aside class="notes">

</aside>
<footer/>

##==##

## GetUserMedia

### Parlons sécurité !

En https : une seule fois

Dans les chromes apps : via le ```audioCapture``` et ```videoCapture```

Après on peut changer les paramètres dans chrome

TODO vérifier dispo des apis dans chrome extension

<aside class="notes">
Parler du problème potentiel derrière ça
Dans chrome & https : demandé qu'une fois 
</aside>
<footer/>

##==##

## Pas de fichiers

<div class="photo-slide"></div>

![photo-slide](/assets/images/file.png)

<aside class="notes">
getUM ne peut être lancé en local (hors serveur)
Sinon erreur GET_PERMISSION_DENIED
</aside>
<footer/>


##==##

## GetUserMedia

### Parlons des possibilités

On peut choisir : 


sa résolution


Sa source (```front-facing``` ou ```rear-facing``` : Chrome Beta)

TODO vérifier si c'est toujours chrome beta ? lire les specs http://www.w3.org/TR/mediacapture-streams/#video-facing-mode-enum


récupérer son écran ou son onglet ! 

<aside class="notes">

</aside>
<footer/>



##==##

## GetUserMedia

### Conami code ! 

TODO : revoir l'orthographe du conami code

On aussi : 

enregister du son (http://simpl.info/mediarecorder)

faire des photos de son flux 

mixer son flux avec un canva : 

mixer son flux avec WebAudio

bref !

<pre>
Vers l'infini et l'au-delà ! 
</pre>

TODO trouver la quote

<aside class="notes">
rec son = fait sur window.url.createObjectUrl()
photo = feinte à base canvas et de draw et save image
WebAudio = post traitement du son ! (compatible RTC Peer Connection)
</aside>
<footer/>

##==##

## GetUserMedia

### Démo ! 

<div id="photo">
</div>

<div id="sayCheese">
</div>

TODO faire le code associé

<aside class="notes">
</aside>
<footer/>

##==##

<div class='transition'></div>

# RTCPeerConnection


![icon](/assets/images/android_eclair.jpg)


<aside class="notes">
</aside>

##==##

## RTCPeerConnection

GetUserMedia + RTCPeerConnection = 

TODO Mettre les images

TODO : envoyer un mail à sam pour la réutilisation de ces images

<aside class="notes">
</aside>
<footer/>

##==##

## RTCPeerConnection

Sert à : 

résoudre les problèmes de communications multimédia (codec, résolutions, ...)

identifier les adresse des hôtes

échanger les données 


<aside class="notes">
</aside>
<footer/>

##==##

## RTCPeerConnection

TODO slide accrochez vous !  


<aside class="notes">
</aside>
<footer/>

##==##

## RTCPeerConnection

### Principe de l'offre et de la demande

2 choses à retenir : 

Il y a d'une part, une notion d'offre et de demande pour communiquer mais aussi une notion de chemin à emprunter ! 

Il s'agit du **Signaling** ! 

 * Quel type de média et format je supporte. Ce que je veux envoyer
 * Sur quel type d'infrastructure réseau je suis ? 


<aside class="notes">
Chemin = ICE = passer les proxys
</aside>
<footer/>

##==##

## RTCPeerConnection

### Gestion de l'offre


1. Alice appelle la méthode ```createOffer()```
1. Dans le callback, Alice appelle ```setLocalDesctiption()```
1. Alice sérialise l'offre et l'envoie à Eve
1. Eve appelle la méthode ```setRemoteDescription()``` avec l'offre
1. Eve appelle la méthode ```createAnswer()```
1. Eve appelle la méthode ```setLocalDescription()``` avec la réponse envoyé à Alice
1. Alice reçoit la réponse et appelle ```setRemoteDescription()```


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
1. Eve reçoit les IceCandidates d'Alice et appelle ```addIceCandidate()```
1. Eve sérialise ses IceCandidates et les envoie à Alice
1. Alice reçoit les IceCandidates d'Eve et appelle ```addIceCandidate()```
1. Les 2 savent comment communiquer.


<aside class="notes">
ICE = Framework de connection de peers ! 
Au mieu connecté direct en UDP
Après connecté en TCP / via des serveurs de relais
</aside>
<footer/>

##==##

## RTCPeerConnection

### Possibilités de signaling

Pour faire ça, on peut utiliser : 

* Du LongPolling / Comet
* XHR + SSE
* **WebSokects** (le plus naturel)


<aside class="notes">
WebSocket est le plus naturels car bidirectionnel / Si WebRTC toléré, WebSocket est toloré aussi / Utilisation du TLS pour les proxy
</aside>
<footer/>

##==##

## RTCPeerConnection

### <a href="http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment" title="Wikipedia ICE article">ICE</a>  : Framework de connection

Il cherche le meilleur chemin pour chaque appels

![center](/assets/images/icestats.png)

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

<div class='transition'></div>

## RTCDataChannel


<aside class="notes">
</aside>

##==##

## RTCDataChannel

Canal de communication de données binaires / textuelles

Même API que les WebSockets

/!\ à la version utilisée, cette norme est arrivée après !

Se fait sur une PeerConnection

<aside class="notes">

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

sendChannel = pc.createDataChannel("sendDataChannel", {reliable: false});

document.querySelector("button#send").onclick = function (){
  var data = document.querySelector("textarea#send").value;
  sendChannel.send(data);
};
```


<aside class="notes">

</aside>
<footer/>



##==##

## RTCPeerConnection

TODO vérifier l'ordre  !


<aside class="notes">
Chemin = ICE = passer les proxys
</aside>
<footer/>

##==##

## STUN & TURN

STUN : Servers permettant d


<aside class="notes">
Expliquer pour on a besoin de serveurs (proxy, firewall,...)
</aside>
<footer/>

##==##

## Liens


Mettre un lien vers la prez de Sam

TODO Créer une session privée pour la prez ! pas de compte google !

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

<footer/>