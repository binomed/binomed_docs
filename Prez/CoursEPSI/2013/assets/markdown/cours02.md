<div class="first-slide"></div>

# **Cours Mobilité**

## 2013 - I5

### 2013.10.16 Epsi @ **Nantes**


##==##

<div class="title"></div>

# **Cours Android / HTML5 **

## Cours Mobilité

### Cours 02 - HTML5

![title center](/assets/images/html5_logo.jpg)

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

* RIA
* AJAX
* HTML5 = spécificités
* Taches Asyncrhones
* Webcomponents
* Stockage

<footer/>

##==##

<!--
  _____  _____          
 |  __ \|_   _|   /\    
 | |__) | | |    /  \   
 |  _  /  | |   / /\ \  
 | | \ \ _| |_ / ____ \ 
 |_|  \_\_____/_/    \_\
                        
                                                                                           
-->

<div class='transition'></div>

# RIA

![icon](/assets/images/html5_logo.jpg)

##==##


## Le RIA

### Rich Internet Application

* Il s'agit de la notion d'application web au sens moderne ou encore Single Page Application.

<br><br>
On distingue la RIA du site Web ! 
<br><br>
Dans ce type d'application, un simple navigateur suffit à afficher l'application


<aside class="notes">

</aside>
<footer/>

##==##


## Le RIA

### DHTML

* Le RIA ne fait pas tout, le DHTML est au coeur du processus.

<br>
Il s'agit donc de pages dynamiques dont le contenu change de façon dynamique en fonction des actions de l'utilisateur. 

Le DHTML ne fait pas référence à une technologie en particulier mais correspond plus à un concepts


<aside class="notes">
Repose sur le JS et l'arbre DOM !
</aside>
<footer/>
##==##

## RIA

<u>Avantages</u>

* Accèssible de partout

* Cross Plateforme

* Pas d'installation

* Mise à jour simplifiée (dépend quand même de la solution choisie)

<u>Inconvénients</u>

* Référencement difficile

* Etre Cross browser ça peut être très compliqué !


<aside class="notes">
MAJ : parler de l'AppCache
</aside>
<footer/>


##==##


## RIA

### Les acteurs actuels 

* GWT
* Flex
* JavaFX
* ExtJS
* AngularJS
* Dojo
* ...

<aside class="notes">
GWT : Java / Flex : ActionScript
</aside>
<footer/>

##==##

## RIA 

### Vs Applications Native ?

* Ne doit pas être considéré comme un remplaçant des applications natives !

* Le besoin doit être étudié ! 

* La fragmentation existe

* Derrière le mythe, il y a la réalité 

![center w-600 wp-500](assets/images/navigateurs_internet.png)


<footer/>

<aside class="notes">
exposer débat et incompréhensions !
</aside>

##==##

<!--
               _         __   __
     /\       | |  /\    \ \ / /
    /  \      | | /  \    \ V / 
   / /\ \ _   | |/ /\ \    > <  
  / ____ \ |__| / ____ \  / . \ 
 /_/    \_\____/_/    \_\/_/ \_\
     
-->

<div class='transition'></div>

# AJAX

![icon](/assets/images/ajax.png)


<aside class="notes">
</aside>
##==##

## AJAX

### Asynchronous Javascript And Xml

* L'asynchrone au coeur du fonctionnement des appels.

* Les appels sont faits via le XMLHttpRequest

* La communication se fait maintenant le plus souvent en JSON 

* Fut créé par Microsoft comme un composant ActiveX à travers le XMLHttpRequest. 

* Fut vraiment répendu à partir entre 2002 et 2005

<aside class="notes">

</aside>
<footer/>
##==##

## AJAX

### Modèle Syncrhone (Appli web classique)

![center w-900 wp-600](assets/images/classic_web_flow.png)

<aside class="notes">

</aside>
<footer/>


##==##

## AJAX

### Modèle Asyncrhone

![center w-900 wp-600](assets/images/ajax_flow.png)

<aside class="notes">

</aside>
<footer/>

##==##


## AJAX

### La philosophie

On lance une requête sans attendre la réponse !

<br>

  * Interaction plus forte

  * On doit repenser notre modèle

  * On accepte de travailler avec des données qui ne sont pas à jour 

<footer/>

##==##
<!--
  _    _ _______ __  __ _      _____ 
 | |  | |__   __|  \/  | |    | ____|
 | |__| |  | |  | \  / | |    | |__  
 |  __  |  | |  | |\/| | |    |___ \ 
 | |  | |  | |  | |  | | |____ ___) |
 |_|  |_|  |_|  |_|  |_|______|____/ 
           
-->

<div class='transition'></div>

# HTML5 : les concepts 

![icon](/assets/images/HTML5-CSS-JS.png)


<aside class="notes">
</aside>
##==##

## HTML5

### C'est quoi ?


![center h-600 hp-400](/assets/images/html5_css_javascript.png)

<aside class="notes">
HTML5 n'est rien sans le javascript
</aside>
<footer/>
##==##


## HTML5

### Concrètement

<br><br><br>

![center h-200 hp-200](/assets/images/html5-infographics-features.jpg)

<aside class="notes">

</aside>
<footer/>
##==##


## HTML5

### Concrètement

<br><br>

![center h-400 hp-300](/assets/images/html5-infographics-features-web.jpg)

<aside class="notes">

</aside>
<footer/>##==##


## HTML5

### Et pour le mobile ?

<br><br>

![center h-400 hp-300](/assets/images/html5-infographics-features-mobile.jpg)

<aside class="notes">

</aside>
<footer/>
##==##


## HTML5

### Nouvelles balises

* Un ensemble de nouvelles balises ont été définies pour mieux structurer son html : 

  > header, footer, asside, article, section, figure, nav, details, audio, video, canvas...


* Une simplication de l'entête html a aussi été prévu : 

```html
<!DOCTYPE html>
```

Suffit pour spécifier le contenu du fichier

<aside class="notes">

</aside>
<footer/>

##==##

## HTML5

### Nouvelles balises

![center w-900 wp-600](assets/images/semantique.jpg)

<aside class="notes">

</aside>
<footer/>
##==##


## HTML5

### Concrètement ça nous sert à quoi ?

* On donne plus de sens à nos pages => On simplifie notre arbre DOM

* On a plus besoin de plugins pour lire des vidéos, jouer des sons, animer des objets => Un simple mobile peut faire tourner des applications riches ! 

<br>

![center w-800 wp-600](assets/images/flash-dead.png)

<footer/>
##==##

## HTML5

### Pour le mobile

Il y a un ensemble de choses à prendre en comptes quand on fait du full mobile 

<br>

 * Ajouter dans la balise head

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

<br>

 * Le click n'existe pas ! Vive le touch

<br>

 * Le mobile ce n'est pas que pour les téléphones ! Il faut utiliser les media quieries

 <br>

 * <span style="color:red"><em>LE HTML5 N'EST PAS LA SOLUTION A TOUT</em></span>

<aside class="notes">
ça sert à ne pas zommer et autoriser le multi touch
Parler de l'amalgame html5 un seul dev 
</aside>
<footer/>


##==##


<!--
            _______     ___   _  _____ _____  _    _  ____  _   _ ______  _____ 
     /\    / ____\ \   / / \ | |/ ____|  __ \| |  | |/ __ \| \ | |  ____|/ ____|
    /  \  | (___  \ \_/ /|  \| | |    | |__) | |__| | |  | |  \| | |__  | (___  
   / /\ \  \___ \  \   / | . ` | |    |  _  /|  __  | |  | | . ` |  __|  \___ \ 
  / ____ \ ____) |  | |  | |\  | |____| | \ \| |  | | |__| | |\  | |____ ____) |
 /_/    \_\_____/   |_|  |_| \_|\_____|_|  \_\_|  |_|\____/|_| \_|______|_____/ 
      
-->

<div class='transition'></div>

# Interractions asyncrhones

![icon](/assets/images/webworker.jpg)
<aside class="notes">

</aside>
##==##


## Interractions asyncrhones

### Interractions serveur 

<br><br>

* AJAX avec un appel serveur classique

<br><br>

* SSE pour Server Send Event => push serveur

<br><br>

* WebSockets => communication bidirectionnelle

<br><br>

* Techniques de Fallback basées sur du polling !

<footer />

<aside class="notes">
Parler du principe du fallback !
</aside>

##==##


## Interractions asyncrhones

### Appels Ajax

![center h-400 hp-300](/assets/images/temps_reel.png)

<br><br>

L'appareil est à l'origine de l'appel !

<aside class="notes">

</aside>
<footer/>

##==##


## Interractions asyncrhones

### Appels Ajax : création

```javascript
var xhr = new XMLHttpRequest(); 
 
xhr.open("GET", "handlingData.php?param1=value1&param2=value2", true);
xhr.send(null);
```

open s'utilise de cette façon : open(sMethod, sUrl, bAsync)

* sMethod : la méthode de transfert : GET ou POST;

* sUrl : la page qui donnera suite à la requête. Ça peut être une page dynamique (PHP, CFM, ASP) ou une page statique (TXT, XML...);

* bAsync : définit si le mode de transfert est asynchrone ou non (synchrone). Dans ce cas, mettez true . Ce paramètre est optionnel et vaut true par défaut, mais il est courant de le définir quand même (je le fais par habitude).


<aside class="notes">
Parler du passage de paramètres !
</aside>
<footer/>

##==##


## Interractions asyncrhones

### Appels Ajax : création

```javascript
var xhr = new XMLHttpRequest(); 
 
xhr.open("POST", "handlingData.php", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("param1=value2&param2=value2");
```
<br>
Poissibilité d'encoder les paramètres ! 

```javascript
var sVar1 = encodeURIComponent("contenu avec des espaces");
var sVar2 = encodeURIComponent("je vois que vous êtes un bon élève... oopa !");
 
xhr.open("GET", "handlingData.php?variable1=" + sVar1 + "&variable2= " + sVar2, true);
xhr.send(null);
```


<aside class="notes">

</aside>
<footer/>

##==##


## Interractions asyncrhones

### SSE Serveur Sent Event

![center h-400 hp-300](/assets/images/temps_reel_sse.png)

<br>

 L'information provient du serveur

<aside class="notes">

</aside>
<footer/>

##==##


## Interractions asyncrhones

### SSE Serveur Sent Event

Le sse a l'intérêt d'être basé sur une simple HttpServlet !

```javascript
if (!!window.EventSource) {
  var source = new EventSource('stream.php');

  source.addEventListener('message', function(e) {
    console.log(e.data);
  }, false);

  source.addEventListener('open', function(e) {
    // Connection was opened.
  }, false);

  source.addEventListener('error', function(e) {
    if (e.readyState == EventSource.CLOSED) {
      // Connection was closed.
    }
  }, false);
} else {
  // Result to xhr polling :(
}
```

Tout se passe sur l'écoute d'événements ! on va écouter un type d'événements et cela conditionnera la données réceptionnée

<aside class="notes">
Parler du LongPolling
</aside>
<footer/>

##==##


## Interractions asyncrhones

### SSE Serveur Sent Event : Format d'échange

Pour bien communiquer le SSE nécessite un format

```javascript
event: update\n
id:12221\n
retry: 10000\n
data: first line data\n
data: last line data\n\n
```

* <em>event</em> : Définit le type d'événement (obligatoire)

* <em>id</em> : Définit un identifiant unique pour notre message (optionnel)

* <em>retry</em> : Définit le délai de reconnection automatique du navigateur en cas de perte de connection (par défaut 3s). Cette variable est en millisecondes (optionnel)

* <em>event</em> : Définit les données. Chaque ligne doit être suivit d'un "\n" et la dernière ligne doit avoir "\n\n" (obligatoire)


<aside class="notes">
Parler du LongPolling
</aside>
<footer/>

##==##


## Interractions asyncrhones

### SSE Serveur Sent Event : Format d'échange

####Exemple d'envoie d'un JSON

<br><br>
```javascript
event: userlogon\n
data: {"username": "jefBinomed"}\n\n


event: message\n
data: {\n
data: "msg": "hello world",\n
data: "id": 12345\n
data: }\n\n
```


<aside class="notes">
Parler du LongPolling
</aside>
<footer/>


##==##


## Interractions asyncrhones

### WebSockets

![center h-400 hp-300](/assets/images/temps_reel_websockets.png)

<br>

 La communication est bidirectionnelle

<aside class="notes">

</aside>
<footer/>

##==##


## Interractions asyncrhones

### WebSockets

Basé sur le protocol HTTP !  Mais nécessite un objet spécifique côté serveur !

```javascript
var connection = new WebSocket('ws://html5rocks.websocket.org/echo');

// When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ' + e.data);
};
```

* <em>onopen</em> : Fonction appelée lors de l'ouverture de la websocket.

* <em>onerror</em> : Fonction appelée lors de la réception d'une erreur

* <em>onmessage</em> : Fonction appelée lors de la réception d'un message

<aside class="notes">
les données sont dispo sour E.DATA ! 
</aside>
<footer/>

##==##


## Interractions asyncrhones

### WebSockets envoie de messages


<br><br>
```javascript
var connection = new WebSocket('ws://html5rocks.websocket.org/echo');


connection.send(message);

```


<aside class="notes">
les données sont dispo sour E.DATA ! 
</aside>
<footer/>


##==##

## Interractions asyncrhones

### WebWorkers


La solution à cette fenêtre ! 

<br><br>

![center w-600 wp-600](assets/images/javascript_unresponsive.webp)


<aside class="notes">

</aside>
<footer/>

##==##

## Interractions asyncrhones

### WebWorkers


<u>Main.js</u>

<br>

```javascript
var worker = new Worker('doWork.js');

worker.addEventListener('message', function(e) {
  console.log('Worker said: ', e.data);
}, false);

worker.postMessage('Hello World'); // Send data to our worker.
```

<br>

1. Déclaration du fichier javascript comprennant la tache longue

2. Ecoute des données provenant du worker

3. Démarage et envoie de données au worker ! 


<aside class="notes">
2 choses un prog principal et un JS exécuté dans un autre thread ! 
</aside>
<footer/>

##==##

## Interractions asyncrhones

### WebWorkers

<u>doWork.js</u>

<br>

```javascript
self.addEventListener('message', function(e) {
  self.postMessage(e.data);
  self.close();
}, false);
```

<br>

1. Ecoute des données du pogramme principal

2. Envoie de données à ce dernier

3. Arret du worker. On pourrait aussi utilser depuis le main.js : 

<br>

```javascript
worker.terminate();
```

<aside class="notes">

</aside>
<footer/>

##==##

<!--
 __          ________ ____   _____ ____  __  __ _____   ____  _   _ ______ _   _ _______ _____ 
 \ \        / /  ____|  _ \ / ____/ __ \|  \/  |  __ \ / __ \| \ | |  ____| \ | |__   __/ ____|
  \ \  /\  / /| |__  | |_) | |   | |  | | \  / | |__) | |  | |  \| | |__  |  \| |  | | | (___  
   \ \/  \/ / |  __| |  _ <| |   | |  | | |\/| |  ___/| |  | | . ` |  __| | . ` |  | |  \___ \ 
    \  /\  /  | |____| |_) | |___| |__| | |  | | |    | |__| | |\  | |____| |\  |  | |  ____) |
     \/  \/   |______|____/ \_____\____/|_|  |_|_|     \____/|_| \_|______|_| \_|  |_| |_____/ 
         
-->


<div class='transition'></div>

# WebComponents

![icon](/assets/images/webcomponents.png)


##==##

## WebComponents

Il s'agit de l'enrichissement de la sémantique web et donc de la création de composants graphiques réutilisables ! 


![center h-600 hp-400](assets/images/caniuse_webcomponents.png)

<footer />

<aside class="notes">
On est vraiment dans de l'urly
Mais ça vaut le coup d'en parler ! 
</aside>

##==##

## WebComponents

### Vocabulaire associé

* Shadow DOM : concept du remplacement du contenu d'une balise html par un ou N tag html => L'objectif est de cacher le cotenu affiché dans l'écriture du html initial. Les contrôles associés sont aussi disponibles.

<br><br>

* Template Tag : Il s'agit de template html. Dans le sens de la réutisabilité ! On va déclare un élément <strong>'```<template>```'</strong> et ce dernier contiendra du html définissant. L'intérêt est qu'il est inactif tant que l'on ne l'a pas activé => Il n'y a pas de chargement de données, pas de chargement de scripts si on en a pas besoin !


<footer />

<aside class="notes">

</aside>

##==##

## WebComponents

### Pourquoi en parler ?

<br>
<br>

1. Car c'est l'avenir du web ! 

2. Car c'est déjà présent (et pas que par les navigateurs)

 1. Polymer.js : Un polyfill puissant permettant l'émulation de nombreuses fonctionnalités des webComponents

 2. AngularJS : Un framework javascript offrant un pseudo mécanisme de templating fort pratique et permettant une réelle réutilisation du code. Developpé par Google

 3. Brick : Librairie Javacript offrant un ensemble de nouvelles balises graphiques réutilisables pour se facilité l'écriture d'applications web. Développé par Mozilla


<footer />

<aside class="notes">
Expliquer Polyfill
Polymer : l'ultime mais compliqué
AngularJS : très bien mais nécessite de suivre les principes du framework
Brick : pratique pour l'utilisation de graphiques !
</aside>

##==##

<!--
   _____ _______ ____   _____ _  __          _____ ______ 
  / ____|__   __/ __ \ / ____| |/ /    /\   / ____|  ____|
 | (___    | | | |  | | |    | ' /    /  \ | |  __| |__   
  \___ \   | | | |  | | |    |  <    / /\ \| | |_ |  __|  
  ____) |  | | | |__| | |____| . \  / ____ \ |__| | |____ 
 |_____/   |_|  \____/ \_____|_|\_\/_/    \_\_____|______|
                                                          
         
-->

<div class='transition'></div>

# Base de données

![icon](/assets/images/html5-local-storage.jpg)


##==##

## Base de données


Il y a plusieurs possibilités pour stocker des donneés sur HTML5 : 

<br><br>

* FileWriter API : Uniquement sur Chrome aujourd'hui

<br>

* SessionStorage : Système de clés valeurs disponible uniquement pour une session

<br>

* LocalStorage : Système de clés valeurs disponible depuis IE7

<br>

* IndexedDB : Système de base de données orienté document (NoSQL)



<footer />
<aside class="notes">
On ne parlera pas de FileWriter
</aside>

##==##

## Base de données

### LocalStorage & SessionStorage


<u>Avantages</u>

<br>

* Implémentation très simple et même API ! 

* Disponible même sur IE7 ! 

<br>

<u>Inconvénients</u>

<br>

* Pas évident à réquêter 

* Ne stocke que des chaines de caractères ! => Dans le cas de la manipulation d'objets, on est obligé de parser / formater notre objet.

<footer />

##==##

## Base de données

### LocalStorage & SessionStorage

c'est accessible directement avec la propriété javascript <strong>'localStorage'</strong> ou <strong>'sessionStorage'</strong>

```javascript
if (localStorage){
  localStorage['maCle'] = 'maValeur';
  localStorage.setitem('maCle2', 'maValeur');
  var valeur = localStorage['maCle'];
  var valeur2 = localStorage.getitem('maCle2');
  var key = localStorage.key(1);
  localStrorage.removeItem('maCle');
  localStorage.clear();
}
```
<br>

* 2 premières lignes : on met à jour une donnée

* 2 suivantes : on récupère une donnée

* key(index) : on récupère la clé à l'index indiqué

* removeItem(clé) : supprimer la donnée du storage

* clear() : vide le storage



<footer />

##==##

## Base de données

### IndexedDB


<u>Avantages</u>

<br>

* Commence à être répendu IE10 et autres

* Stockage plus performant

* Possiblité de requêtage (/!\ pas de SQL pour autant)

<br>

<u>Inconvénients</u>

<br>

* Plus compliqué à mettre en oeuvre

* Asyncrhone => ça peut complexifier l'écriture du code

<footer />

##==##

## Base de données

### IndexedDB

#### 1 : Ouverture

```javascript
var gdgnamespace = {};
gdgnamespace.indexedDB = {};
gdgnamespace.indexedDB.db = null;

gdgnamespace.indexedDB.open = function() {
  var version = 1;
  var request = indexedDB.open("todos", version);

  request.onsuccess = function(e) {
    gdgnamespace.indexedDB.db = e.target.result;
    // Do some more stuff in a minute
  };

  request.onerror = gdgnamespace.indexedDB.onerror;
};
```

On créer une base de données nommée "todos"

<footer />


##==##

## Base de données

### IndexedDB

#### 2 : Création d'un Object Store

Un object Store est l'équivalent d'une table SQL, il doit être déclaré pour être persisté

```javascript
gdgnamespace.indexedDB.open = function() {
  var version = 1;
  var request = indexedDB.open("todos", version);
  // We can only create Object stores in a versionchange transaction.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = gdgnamespace.indexedDB.onerror;
    if(db.objectStoreNames.contains("todo")) {
      db.deleteObjectStore("todo");
    }
    var store = db.createObjectStore("todo",
      {keyPath: "timeStamp"});
    store.createIndex('name', 'name',{unique:false});
  };
};
```

On a créé une "table" todo qui devra systématiquement contenir un champ "timeStamp" !
On a aussi ajouté un index sur notre base pour mieux la requêter

<footer />

##==##

## Base de données

### IndexedDB

#### 3 : Ajout d'un objet dans la base



```javascript
gdgnamespace.indexedDB.addTodo = function(todoText) {
  var db = gdgnamespace.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");
  var request = store.put({
    "name":"myTask"
    "text": todoText,
    "timeStamp" : new Date().getTime()
  });

  request.onsuccess = function(e) {
    // Re-render all the todo's
    gdgnamespace.indexedDB.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log(e.value);
  };
};
```

On doit récupérer le ObjectStore de notre base de données pour ajouter une données dans la "table" ! 

<footer />

##==##

## Base de données

### IndexedDB

#### 4 : Requêtons la base



```javascript
gdgnamespace.indexedDB.getAllTodoItems = function() {
  var todos = document.getElementById("todoItems");
  todos.innerHTML = "";
  var db = gdgnamespace.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;
    renderTodo(result.value);
    result.continue();
  };
  cursorRequest.onerror = gdgnamespace.indexedDB.onerror;
};
```

On ne peut manipuler un Cursor que dans une transaction !

Quand on manipule IDKeyRange, on requête sur l'id de l'objet ! 

<footer />

<aside class="notes">
Demander si cursor ça va pour tout le monde ?
</aside>

##==##

## Base de données

### IndexedDB

#### 5 : Supprimons une donnée



```javascript
gdgnamespace.indexedDB.deleteTodo = function(id) {
  var db = gdgnamespace.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  var request = store.delete(id);

  request.onsuccess = function(e) {
    gdgnamespace.indexedDB.getAllTodoItems();  // Refresh the screen
  };

  request.onerror = function(e) {
    console.log(e);
  };
};
```

<footer />

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