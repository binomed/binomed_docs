<div class="first-slide"></div>

# **GDG DevFest**

## 2013 Season

### year.mm.dd Meeting Name @ **Where**


##==##

<div class="title"></div>

# **Cours Android 5ème année**

## Cours Mobilité

### Cours 01 - Présentation de la plateforme

![title](/assets/images/Android-Developers.png)

<footer/>


##==##
## Qui suis-je ?

###  Jean-François GARREAU

![avatar center w-300 wp-200](/assets/images/jf.jpg)


![company_logo](/assets/images/sqli_logo.png)
![gdg_logo](/assets/images/GDG-Logo-carre.png)

<footer/>

##==##

<div class="photo-slide"></div>

# un super titre de transition

![photo-slide](/assets/images/iron_droid.jpg)

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

* ![sommaire](/assets/images/android_cupcake.jpg) 
* ![sommaire](/assets/images/android_donut.jpg) Android ?
* ![sommaire](/assets/images/android_eclair.jpg) Concepts 
* ![sommaire](/assets/images/android_froyo.png) Economiquement intéressant ?
* ![sommaire](/assets/images/android_gingerbread.jpg) Développement 
* ![sommaire](/assets/images/android_honeycomb.png) Liens
* ![sommaire](/assets/images/android_icecreamsandwich.jpg) Questions
* ![sommaire](/assets/images/android_jellybean.png)

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

# Android ?

![icon](/assets/images/android_donut.jpg)


<aside class="notes">
Modèle choisi

Architecture

Langage

Avantages 

Inconvéninents
</aside>
##==##

## Android

### Modèle Choisi

* OS libre basé sur un noyau linux.

* Android c’est Google mais aussi d’autres boîtes : 

* Open Handset Alliance : 

    * Ensemble de sociétés (84 aujourd’hui) dont l’objectif est de développer des normes ouvertes pour les appareils mobiles

    * Créé en 2007 à l’initiative de google.

<aside class="notes">
Quelques débats existent quand à la main mise sur android par google…
</aside>
<footer/>
##==##


## Android

### Architecture

![center h-600 hp-400](/assets/images/system-architecture.jpg)
<footer/>
##==##

## Android

### Historique des versions

* 2007 : 1.1 → La base
* 05 2009 : 1.5 (Cupcake) → Widgets
* 09 2009 : 1.6 (Donut) → Synthèse vocale
* 10 2009 : 2.0->2.1 (Eclair) → Expérience utilisateur améliorée
* 05 2010 : 2.2 (Froyo) → JIT
* 10 2010 : 2.3 (Gingerbreard) → NFC
* 01 2011 : 3.0->3.2 (HoneyComb) → Android & tablettes
* 11 2011 : 4.0.x (Ice Cream Sandwich) → Unification tablettes et téléphones
* 05/12, 10/12, 07/13 : 4.1.x->4.3.x (Jelly Bean) → La rapidité en vue

<footer/>
##==##

## Android

### Langage

* Java dans une version 1.5 light

* Google a intégré une bonne partie des packages bas niveau Java.

    * Google a fait sa propre JVM =» Dalvik Virtual Machine

    * Tout le code est converti en .dex (dalvik Executable) avant d’être envoyé sur le téléphone.

<aside class="notes">
Il existe aussi la possibilité de coder en php via un framework externe ASE (ajoute un interpreteur)

sinon google autorise avec le NDK du developpement C C++

Il existe aussi la possibilité de coder e,n C# avec mono android (dispo depuis peu pour android 4.0)

Sinon des solutions comme PhoneGap ou HTML5 via une webview !
</aside>
<footer/>
##==##


## Android

### Avantages

* Android est libre et en Java

 De plus en plus de frameworks sont compatibles Android 

	* REST

	* Xstream

	* Spring

* Le monde Java est très riche en tutoriels en tout genre.

* Google travaille activement à enrichir le framework

<footer/>
##==##

## Android

### Inconvénients



* Le manque de certaines librairies bas niveau

* La fragmentation d’Android

 Par les versions

 Par le parc d’appareils
 
<footer/>
##==##
## Android

### Fragmentation

<div class="hidden-print"></div>
![float-left w-500 wp-200](/assets/images/chart.png)


|Version|Codename|API|Distribution|
|-----|------|-|----------|
|2.2|Froyo|8|2.4%|
|2.3.3 - 2.3.7|Gingerbread|10|30.7%|
|3.2|Honeycomb|13|0.1%|
|4.0.3 - 4.0.4|Ice Cream Sandwich|15|21.7%|
|4.1.x|Jelly Bean|16|36.6%|
|4.2.x||17|8.5%|

<aside class="notes">
Les evolutions d’api ! Car comme le système est neuf, il évolue souvent et donc il faut faire des fois du code spécifique par target.

Concernant openGL on est obligé de faire du spécifique par téléphone. Des frameworks arrivent pour aider AndEngine, PlayN 

Android avait pour vocation de poser des choses communes mais au final on constate que les constructeurs ne jouent pas vraiment le jeu.
</aside>
<footer/>

##==##
<!--
//     _____    ____    _   _    _____   ______   _____    _______    _____ 
//    / ____|  / __ \  | \ | |  / ____| |  ____| |  __ \  |__   __|  / ____|
//   | |      | |  | | |  \| | | |      | |__    | |__) |    | |    | (___  
//   | |      | |  | | | . ` | | |      |  __|   |  ___/     | |     \___ \ 
//   | |____  | |__| | | |\  | | |____  | |____  | |         | |     ____) |
//    \_____|  \____/  |_| \_|  \_____| |______| |_|         |_|    |_____/ 
//                                                                          
//      
-->

<div class='transition'></div>

# Concepts

![icon](/assets/images/android_eclair.jpg)


<aside class="notes">
Activity

Fragments

Cycle de vie des activités

Les services

Les Intents

Les contents providers

Broadcast recivers

Le reste
</aside>
##==##

## Concepts

### Activity

* Base graphique

* Une application graphique possède au moins une activité

* Une activité est définie par un layout

  Définition xml des éléments graphiques

* Une activité peut posséder des filtres de lancements

<aside class="notes">
Les filtres servent par exemple à définir quelle sera l'activité principale quand on lance l'application
</aside>
<footer/>
##==##


## Concepts

### Cycle de vie des activités

![center h-700 hp-400](/assets/images/activity_lifecycle.png)

<aside class="notes">
Quand un process est trop longtemps mis en tache de fond il peut être killé
</aside>
<footer/>
##==##


## Concepts

### Fragments

* Comme une activité mais en plus basique

* Une activité peut avoir N Fragment

* Un fragment peut être réutilisé

* Un fragment possède son propre cycle de vie

![center h-400 hp-200](/assets/images/fragments.png)

<aside class="notes">
Les fragments sont la base à utiliser quand on envisage un développement
</aside>
<footer/>
##==##


## Concepts

### Cycle de vie des fragments

![center h-700 hp-400](/assets/images/fragment_lifecycle.png)
<footer/>
##==##

## Concepts

### Service

* Sortes de threads

* Sont des tâches démons d'Android !

* Permet de réaliser des tâches asynchornes

* N'a pas besoin de couche graphique

<aside class="notes">
Les services sont très utiles pour gérer tous les traitements un minimum longs

Attention cependant à bien les lancer dans des threads car sinon il bloquent le process qui en est à l'origine.

Donner un exemple de lecteur MP3 Ou alors d'avoir les accès HTTP
</aside>
<footer/>
##==##


## Concepts

### Cycle de vie  des services

![center h-700 hp-400](/assets/images/service_lifecycle.png)

<aside class="notes">
Comme vous pouvez le voir, un service à la possibilité de communiquer avec un Binder (souvent son appelant) de cette manière on peut tenir au courant l'ihm des avancées du service.
</aside>
<footer/>
##==##

## Concepts

### Intent

* Gestion des messages dans Android

* Ils peuvent transporter des informations

  Par défaut simples

  Mais on peut envoyer des objets complexes

* Plusieurs applications peuvent les réceptionner

* En mode broadcast

<aside class="notes">
L'intent est très très important car sans lui les différents processus (activités, services, …) ne pourraient pas communiquer.

Si on veut faire passer des objets complexes, il faut que nos objets implémentent une certaine interface

L'avantage de la multi réception est d'avoir la possibilité de réécrire des briques métiers. On peut ainsi enrichir les fonctionnalités de bases.

Expliquer en quoi c'est puissant les boradcast ! Sms etc ...
</aside>
<footer/>
##==##


## Concepts

### ContentProvider

* Sorte de base de données partagées

* On peut définir ses propres contentProvider

<aside class="notes">
De cette manière on peut accéder facilement aux données du téléphone

On peut aussi offrir la possibilité de toucher aux données de son application.
</aside>
<footer/>
##==##


## Concepts

### BroadCastReceiver

* C'est ce qui permet d'intercepter les messages du téléphone et les intents des autres applications

<aside class="notes">
De cette manière on peut agir sur la réception d'un SMS ou d'un appel.
</aside>
<footer/>
##==##


## Concepts

### Quelques autres concepts

* Les widgets

* SQL

* L’internationalisation

* Le draw9Patch

* Natif

* Sensors

* Graphique : 

* Canvas

* OpenGL ES


<aside class="notes">
Il resterait encore plein de notions à traiter mais parlons rapidement de celles là.

Les widgets sont des éléments graphiques propres à android et disponible uniquement depuis l'application de bureau d'android. Les widgets sont des éléments indépendants ou non de l'application auquel ils appartiennent.

La base de données est SQLLite (connu au niveau HTML5)

L'internationnalisation est très simplifée, il suffit de déclarer un fichier par langue et le framework android s'occupe du reste

Le draw9Patch : très pratique pour les ressources graphiques =» principe de déclarer uniquement les zones extensibles.

Encore bien d'autres choses....
</aside>
<footer/>

##==##
<!--
//    ______    _____    ____    _   _    ____    __  __   _____    ____    _    _   ______   __  __   ______   _   _   _______ 
//   |  ____|  / ____|  / __ \  | \ | |  / __ \  |  \/  | |_   _|  / __ \  | |  | | |  ____| |  \/  | |  ____| | \ | | |__   __|
//   | |__    | |      | |  | | |  \| | | |  | | | \  / |   | |   | |  | | | |  | | | |__    | \  / | | |__    |  \| |    | |   
//   |  __|   | |      | |  | | | . ` | | |  | | | |\/| |   | |   | |  | | | |  | | |  __|   | |\/| | |  __|   | . ` |    | |   
//   | |____  | |____  | |__| | | |\  | | |__| | | |  | |  _| |_  | |__| | | |__| | | |____  | |  | | | |____  | |\  |    | |   
//   |______|  \_____|  \____/  |_| \_|  \____/  |_|  |_| |_____|  \___\_\  \____/  |______| |_|  |_| |______| |_| \_|    |_|   
//                                                                                                                              
//   
-->



<div class='transition'></div>

# Economiquement Intéressant ?

![icon](/assets/images/android_froyo.png)
##==##


## Economiquement Intéressant ?

* Amalgame open source = gratuit

  Beaucoup d'applications sont gratuites et les gens ont du mal à acheter encore sur Android.

    * L'Iphone reste un meilleur vecteur.

    * Les développeurs doivent oser vendre !

* Le problème de compatibilité n'arrange pas la commercialisation

* La pub est par contre plus rémunératrice.

* Nombre grandissant d'activations.

* Paiement « in App » =» très bon compromis !


<aside class="notes">
Les premiers utilisateurs étaient les déçus d'iphone et surtout des geeks =» on recherche beaucoup du gratuit

Il faut lancer une dynamique de payement =» ce n'est pas par ce que notre application est développée par un amateur qu'elle ne mérite pas une rétribution

L'arrivée du paiment in app est une grande avancée dans la monétisation des applications
</aside>
<footer/>
##==##

## Economiquement Intéressant ?

### L'android market

* Moyen officiel de distribuer ses applications

* Pourcentage 70% développeur, 30% google

* L'android market n'est pas le seul market : 

    * Amazon

    * AppsLib (Archos)

    * SlideMe

    * Camangi

    * ...

<aside class="notes">
Parler des pays ayant le market payant
</aside>
<footer/>


##==##
<!--
//    _____    ______  __      __  ______   _         ____    _____    _____    ______   __  __   ______   _   _   _______ 
//   |  __ \  |  ____| \ \    / / |  ____| | |       / __ \  |  __ \  |  __ \  |  ____| |  \/  | |  ____| | \ | | |__   __|
//   | |  | | | |__     \ \  / /  | |__    | |      | |  | | | |__) | | |__) | | |__    | \  / | | |__    |  \| |    | |   
//   | |  | | |  __|     \ \/ /   |  __|   | |      | |  | | |  ___/  |  ___/  |  __|   | |\/| | |  __|   | . ` |    | |   
//   | |__| | | |____     \  /    | |____  | |____  | |__| | | |      | |      | |____  | |  | | | |____  | |\  |    | |   
//   |_____/  |______|     \/     |______| |______|  \____/  |_|      |_|      |______| |_|  |_| |______| |_| \_|    |_|   
//                                                                                                                         
// 
-->

<div class='transition'></div>

# Développement

![icon](/assets/images/android_gingerbread.jpg)


<aside class="notes">
Les composants graphiques
</aside>
##==##


## Développement

### Emulateur

![center h-400 hp-300](/assets/images/emulator.png)

* Permet d'émuler efficacement le téléphone
 * GPS
 * Téléphone
 * SMS

* Multi résolution

<aside class="notes">
On peut aussi simuler les perturbation réseaux

On peut faire du debug

O n a accès aux logs de l'application

On peut faire des captures d'écrans

Parler de ce qu'on ne peut pas faire : BluTooth, NFC, Caméra c'est pas évident, ...
</aside>
<footer/>
##==##


## Développement

### Les éléments graphiques

* Les TextView et EditText

![center](/assets/images/textViewAndEditText.png)
<footer/>
##==##

## Développement

### Les éléments graphiques

* Button et ImageButton / CheckBox, RadioButton, Spinner

![float-left](/assets/images/ImageButton.png)

![float-right](/assets/images/ChcRadioSpinner.png)
<footer/>
##==##

## Développement

### Les éléments graphiques

* Gallery, GridView et ListView

![float-left w-300 wp-200](/assets/images/GalleryView.png)

![float-right w-300 wp-200](/assets/images/GridView.png)

![center w-300 wp-200](/assets/images/ListView.png)
<footer/>
##==##

## Développement

### Les éléments graphiques


* TabView

![center](/assets/images/TabView.png)
 

Et bien d'autres ...

<aside class="notes">
Et il en existe encore pleins d'autres … TimePicket, DatePicker ....
</aside>
<footer/>
##==##


## Développement

### Multi Plateformes

* Développer sous android se fait aussi facilement sous linux, windows ou mac.

* Sous windows il suffit d'installer les drivers et le téléphone est reconnu

* Sous Linux il faut modifier un fichier en spécifiant le constructeur

* Sous Mac ça marche direct

<footer/>
##==##


## Développement

### Hello World

![center ](/assets/images/project_1.jpg)

<aside class="notes">
On défini le nom du projet, 

La version android visée

Le fait de choisir google apis, vous permet d'avoir accès aux api google du genre maps.

On doit ensuite choisir un nom de package afin d'intentifier votre application (ils sont unique pour les applis du market)

On définit une Activité par défaut
</aside>
<footer/>


##==##


## Développement

### Le Projet

![float-left h-600 hp-400](/assets/images/project_3.png)

![dev_code](/assets/images//arrow_left.png)

![dev_gen](/assets/images//arrow_left.png)

![dev_res](/assets/images//arrow_split.png)

![dev_manifest](/assets/images//arrow_left.png)

Votre code 
<br><br><br>
Le code auto généré
<br><br><br>
Vos ressources dynamiques
<br><br><br><br>
Le manifest 




<aside class="notes">
Le projet est constitué d'une partie statique (votre code, vos ressources)

Et d'une partie dynamique (la partie gen) contenant toutes les constantes.

La partie res est très importante car elle contient toutes les ressources « dynamiques » extérieurs à votre projet

On peut voir différents répertoire en fonction de la résolution 
</aside>
<footer/>


##==##
## Développement
### Le layout
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    >
    <TextView
        android:layout_width="fill_parent" 
        android:layout_height="wrap_content" 
        android:text="@string/hello"
        />
</LinearLayout>
```

<aside class="notes">
Déclaration d'un sumple texte dans une vue. On remarque que le texte provient d'une ressource

Parler de l'aspect multi résolution

Les xml de définitions peuvent être spécifiques =» un chaque téléphone peut avoir une présentation différente. On peut définir des agencements différents entre les différentes résolutions

On peut aussi affecter des thèmes très simplement à nos applications 
</aside>
<footer/>
##==##
## Développement

### Manifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
      package="com.binomed.sqli"
      android:versionCode="1"
      android:versionName="1.0">
    <application android:icon="@drawable/icon" android:label="@string/app_name">
        <activity android:name=".Convert"
                  android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
    <uses-sdk android:minSdkVersion="9" />

</manifest> 
```

<aside class="notes">
On retrouve le nom de l'application, l'icone, la déclaration de l'activité principale
</aside>
<footer/>
##==##
<!--
//    _        _____   ______   _   _    _____ 
//   | |      |_   _| |  ____| | \ | |  / ____|
//   | |        | |   | |__    |  \| | | (___  
//   | |        | |   |  __|   | . ` |  \___ \ 
//   | |____   _| |_  | |____  | |\  |  ____) |
//   |______| |_____| |______| |_| \_| |_____/ 
//                                             
//   
-->

<div class='transition'></div>

# Liens

![icon](/assets/images/android_honeycomb.png)

##==##
## Liens

* Android

http://developer.android.com/index.html 

http://android.git.kernel.org/ 

http://androidcookbook.oreilly.com/ 

* Graphiques 

23 liens graphiques : http://goo.gl/9yxu6

Création d'icones : http://goo.gl/zCxLd

http://www.iconfinder.com/

http://www.androiduipatterns.com/

Préconisations Google : http://goo.gl/OsR2L

* Projets :

Github Jean-François :  https://github.com/organizations/binomed
<footer/>
##==##
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

<div class='transition'></div>

# Questions

![icon](/assets/images/andquestionsag.png)


##==##

<div class="last-slide"></div>

<div class="topic-title"></div>

# Cours Mobilité

<div class="presenter"></div>

# **Jean-François Garreau**

<div class="gdg-rule"></div>

# GDG Nantes Leader

<div class="work-rule"></div>

# Ingénieur SQLI

<div class="email"></div>

# **jef**@gdgnantes.com

<div class="thank-message"></div>

# **Merci**

![avatar](/assets/images/jf.jpg)

<footer/>