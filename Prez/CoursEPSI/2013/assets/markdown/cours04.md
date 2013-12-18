<div class="first-slide"></div>

# **Cours Mobilité**

## 2013 - I5

### 2013.12.18 Epsi @ **Nantes**


##==##

<div class="title"></div>

# **Cours Android / HTML5 **

## Cours Mobilité

### Cours 04 - Android Optimisations Graphiques

![title](/assets/images/Android-Developers.png)

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

* Optimisations graphiques

<br>

* Les Outils ?

<br>

* Fragments  & Multi Layouts

<br>

* Support Library

<br>

* Internationnalisation

<br>

<footer/>


<!--
//     ____  _____ _______ _____ __  __    _____ _____            _____  _    _ 
//    / __ \|  __ \__   __|_   _|  \/  |  / ____|  __ \     /\   |  __ \| |  | |
//   | |  | | |__) | | |    | | | \  / | | |  __| |__) |   /  \  | |__) | |__| |
//   | |  | |  ___/  | |    | | | |\/| | | | |_ |  _  /   / /\ \ |  ___/|  __  |
//   | |__| | |      | |   _| |_| |  | | | |__| | | \ \  / ____ \| |    | |  | |
//    \____/|_|      |_|  |_____|_|  |_|  \_____|_|  \_\/_/    \_\_|    |_|  |_|
//                                                                              
//      
-->
##==##


<div class='transition'></div>

# Optimisations graphiques

![icon](/assets/images/hierarchy_viewer_01.png)

##==##

## Optimisations

### Pour quoi faire ?

Les ralentissements, on doit tenir comptes du poids général de nos écrans afin d'éviter une surchage en terme de création d'objets !  

<br>

L'objectif derrière l'optimisation graphique est toujours la minimisation de la création des objets ainsi que la minimisation des écritures graphiques.


<aside class="notes">
Introduire l'overdraw
</aside>

<footer/>


##==##

## Optimisations

### OverDraw ?

L'overdraw c'est le fait de surcharger des couches graphiques déjà dessinées. 

<br>

On définit un premier fond pour un élément en arrière plan puis on fait de même pour les éléments au dessus =>

<br>

  Le Framework va déssiner autant de fois une couleur de fond qu'il y a de couches qui le demandent


<aside class="notes">
Dire qu'on verra avec les outils comment l'identifier
</aside>

<footer/>

##==##

## Optimisations

### OverDraw ?

Pour l'éviter c'est très simple, il faut : 

<br>
<br>

* Ne pas mettre systématiquement des background a ses layouts ! 

<br>

* Rendre le plus plat que possible ses layouts ! 

 * Utilisations des RelativeLayout ou du GridLayout
 * Utilisation des balises ```merge``` et ```include```


<aside class="notes">
Expliquer ce que veut dire rendre plat
</aside>

<footer/>

##==##

## Optimisations

### Utilisation de merge & include

Un layout à réutiliser peut être écrit comme suit : 

<strong> activity.xml</strong>

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent" android:layout_height="fill_parent"
    android:orientation="vertical">

    // some views

    <include layout="@layout/view_part"/>

   // probably more views

</LinearLayout>
```

<strong> view_part.xml</strong>

```xml
<merge xmlns:android="http://schemas.android.com/apk/res/android">

    // the views to be merged

</merge>
```


<aside class="notes">
Expliquer ce que veut dire rendre plat
</aside>

<footer/>

##==##

## Optimisations

### Grid Layout

Il s'agit d'une grille optimisée permettant de mettre tous ses objets au même niveau

![w-600 wp-500 center](/assets/images/grid_layout_example.png)


<aside class="notes">
Montrer le principe de répartition
</aside>

<footer/>

##==##

## Optimisations

### Grid Layout

Le positionnement est intelligent

![w-600 wp-500 center](/assets/images/grid_layout_auto.png)


<aside class="notes">
Dire que c'est le layout recommandé par google !
</aside>

<footer/>

##==##

## Optimisations

### Grid Layout

```xml
<GridLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:useDefaultMargins="true"
        android:alignmentMode="alignBounds"
        android:columnOrderPreserved="false"
        android:columnCount="4"
        >
    <TextView
            android:text="Email setup"
            android:textSize="32dip"
            android:layout_columnSpan="4"
            android:layout_gravity="center_horizontal"
            />
    <Space
            android:layout_row="4"
            android:layout_column="0"
            android:layout_columnSpan="3"
            android:layout_gravity="fill"
            />
</GridLayout>
```

<aside class="notes">
Parler de la retro compatbilité jusqu'à 7 !
</aside>

<footer/>

##==##

## Optimisations

### RelativeLayout

Ce layout permet de positionner des éléments les uns par rapport aux autres. Il n'est pas ici question de placement dans une grille mais d'un placement par référence.

![w-700 wp-500 center](/assets/images/listview-sketch.png)

<aside class="notes">
Dire que là par exemple on centre plus difficillement des éléments.
</aside>

<footer/>


##==##

## Optimisations

### View Holder

![h-700 hp-400 center](/assets/images/list_view_explain.jpg)

<aside class="notes">
Expliquer ce que veut dire rendre plat
</aside>

<footer/>



##==##

## Optimisations

### View Holder

<strong>Pas bien ! </strong>

<pre class="java"><code class='toHilight'>
public View getView(int position, View convertView, ViewGroup parent) {
    <mark>LayoutInflater inflater = (LayoutInflater) context
        .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    View rowView = inflater.inflate(R.layout.rowlayout, parent, false);</mark>
    TextView textView = (TextView) rowView.findViewById(R.id.label);
    ImageView imageView = (ImageView) rowView.findViewById(R.id.icon);
    textView.setText(values[position]);
    // Change the icon for Windows and iPhone
    String s = values[position];
    if (s.startsWith("iPhone")) {
      imageView.setImageResource(R.drawable.no);
    } else {
      imageView.setImageResource(R.drawable.ok);
    }

    return rowView;
  }
</code></pre>


<aside class="notes">
Expliquer ce que veut dire rendre plat
</aside>

<footer/>

##==##

## Optimisations

### View Holder

<strong>Bien ! </strong>

<pre class="java"><code class='toHilight'>
public View getView(int position, View convertView, ViewGroup parent) {
  View rowView = null;

  <mark>if (convertView == null){</mark>
      LayoutInflater inflater = (LayoutInflater) context
          .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
      rowView = inflater.inflate(R.layout.rowlayout, parent, false);
  }else{
    <mark>rowView = convertView;</mark>
  }
    TextView textView = (TextView) rowView.findViewById(R.id.label);
    ImageView imageView = (ImageView) rowView.findViewById(R.id.icon);
    textView.setText(values[position]);
    // Change the icon for Windows and iPhone
    String s = values[position];
    if (s.startsWith("iPhone")) {
      imageView.setImageResource(R.drawable.no);
    } else {
      imageView.setImageResource(R.drawable.ok);
    }
    return rowView;
  }
</code></pre>


<aside class="notes">

</aside>

<footer/>

<!--
//     ____  _    _ _______ _____ _       _____ 
//    / __ \| |  | |__   __|_   _| |     / ____|
//   | |  | | |  | |  | |    | | | |    | (___  
//   | |  | | |  | |  | |    | | | |     \___ \ 
//   | |__| | |__| |  | |   _| |_| |____ ____) |
//    \____/ \____/   |_|  |_____|______|_____/ 
//                                              
//   
-->

##==##


<div class='transition'></div>

# Les Outils

![icon](/assets/images/Development.png)


##==##

## Les Outils

### Hierachy Viewer

Outils permettant d'afficher l'arbroscence d'une activité

![w-700 wp-500 center](/assets/images/hierarchy_viewer_01.png)


<aside class="notes">
On verra ça en tp !
</aside>

<footer/>

##==##

## Les Outils

### Droid inspector

Idem mais en 3D et en plus permet de détecter l'overDraw

![h-600 hp-400 center](/assets/images/android_node_inspector.png)


<aside class="notes">
On verra ça en tp ! 

Pas un outils officiel ! 
</aside>

<footer/>

##==##

## Les Outils

### Draw9Patch


![h-600 hp-400 center](/assets/images/d9p.png)


<aside class="notes">
On verra ça en tp !  parler des lignes du bas

Pas un outils officiel ! 
</aside>

<footer/>


##==##

## Les Outils

### Les options de développement dans le téléphone

Permet entre autre de déterminer l'overdraw (4.2 +)


![h-600 hp-400 center](/assets/images/overdraw.png)


<aside class="notes">
On verra ça en tp !  parler des lignes du bas

Pas un outils officiel ! 
</aside>

<footer/>


<!--
//    ______ _____            _____ __  __ ______ _   _ _______ _____ 
//   |  ____|  __ \     /\   / ____|  \/  |  ____| \ | |__   __/ ____|
//   | |__  | |__) |   /  \ | |  __| \  / | |__  |  \| |  | | | (___  
//   |  __| |  _  /   / /\ \| | |_ | |\/| |  __| | . ` |  | |  \___ \ 
//   | |    | | \ \  / ____ \ |__| | |  | | |____| |\  |  | |  ____) |
//   |_|    |_|  \_\/_/    \_\_____|_|  |_|______|_| \_|  |_| |_____/ 
//                                                                    
//    
-->

##==##


<div class='transition'></div>

# Les Fragments & les multi layouts

![icon](/assets/images/tablet_phone.jpg)


##==##

## Les Fragments


Rappel

![h-600 hp-400 center](/assets/images/fragments.png)


<aside class="notes">
Rappeler ce que c'est
</aside>

<footer/>


##==##

## Les Fragments


Pourquoi utiliser cela ?

<br>

* Car ça permet d'avoir des blocs de code graphiques réutilisables

<br>

* ça permet de faire des ihms modulables en fonction de la résolution / portrait, paysage / tablette ou téléphone

<br>

* Un Fragment possède un cycle de vie plus facilement identifiable (en oposition à une simple customView)


<aside class="notes">

</aside>

<footer/>

##==##

## Les Fragments


Comment code-t-on cela ?

<br>

Il y a 2 manières d'instancier des Fragments

* De façon "statique" via les layouts xml

<br>

* De façon "dynamique" via le code en tenant compte d'une transaction

<br><br>

Dans tous les cas, nous devons avoir une classe héritant de ```android.app.Fragment``` ou ```android.support.v4.app.Fragment```. Et un fragment sera toujours dans une **FragmentActivity**.


<aside class="notes">
Expliquer la différence entre les héritages
</aside>

<footer/>


##==##

## Les Fragments


### Fragment Statique 

```java
package com.binomed.epsi.fragment;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.binomed.epsi.R;

public class FixeFragment extends Fragment {
  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container,
      Bundle savedInstanceState) {
    return inflater.inflate(R.layout.fragment, container, false);
  }
}
```


```xml
<?xml version="1.0" encoding="utf-8"?>
<fragment xmlns:android="http://schemas.android.com/apk/res/android"
    android:name="com.binomed.epsi.fragment.FixeFragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

<aside class="notes">
XML = xml de l'activity
Parler du layout classique du fragment
</aside>

<footer/>

##==##

## Les Fragments


### Fragment Dynamique


On va utiliser un ```FragmentManager``` qui nous permettra de récupérer nos Fragments, de cette façon on peut récupérer des Fragments précédements créés. De même l'ajout dynamique d'un Fragment se fait via ce manager. De cette manière on peut interragir avec l'activité mère des façons suivantes : 

<br>

* Ajout à la pile standard pour une gestion du bouton back

* Ajout d'items dans l'actionBar

* Récupération de fragments en caches

<aside class="notes">
</aside>

<footer/>

##==##

## Les Fragments


### Fragment Dynamique


```java
private void setupFragments() {
    final FragmentManager fm = getSupportFragmentManager();
    this.mDynamic1Fragment = (Dynamic1Fragment) fm
            .findFragmentByTag(Dynamic1Fragment.TAG);
    if (this.mDynamic1Fragment == null) {
        this.mDynamic1Fragment = new Dynamic1Fragment();
    }
}

private void showFragment(final Fragment fragment) {
  if (fragment == null)
    return;
  final FragmentManager fm = getSupportFragmentManager();
  final FragmentTransaction ft = fm.beginTransaction();
  // We can also animate the changing of fragment
  ft.setCustomAnimations(android.R.anim.slide_in_left,
      android.R.anim.slide_out_right);

  ft.replace(R.id.frameLayoutListView, fragment);

  ft.commit();
}

```



<aside class="notes">

</aside>

<footer/>


##==##

## Multi Layouts

Dans android on définit nos layouts d'activité via des xml et ces derniers sont dans des répertoires précis avec un sens bien défini. En effet, le fait de changer le nom du répertoire dans lequel se trouve le layout a une incidence sur la plateforme  l'application.

On peut ainsi définir un layout différent par : 

* Orientation de l'écran 
 * -port
 * -land
* Taille d'écran
 * nodpi / ldpi / mdpi / hdpi / xhdpi / tvdpi
 * small / normal / large / xlarge
 * **ws600dp / w600dp / h600dp**
* Plateforme
* Langue



<aside class="notes">
le troisième est mieux ! ws pour Smallest Width  => inf à  media queries style => only 3.2 ! 

Le nom du xml doit rester le même
</aside>

<footer/>



##==##

## Multi Layouts

Exemple 

<br><br><br>

```
 '
  `layout/activity.xml
 '
  `layout-large/activity.xml
 '
  `layout-ws600dp/activity.xml


```



<aside class="notes">
1 pour les cas nominaux 
2 pour avant 3.2
3 pour après 3.2
</aside>

<footer/>





<!--
//     _____ _    _ _____  _____   ____  _____ _______   _      _____ ____  
//    / ____| |  | |  __ \|  __ \ / __ \|  __ \__   __| | |    |_   _|  _ \ 
//   | (___ | |  | | |__) | |__) | |  | | |__) | | |    | |      | | | |_) |
//    \___ \| |  | |  ___/|  ___/| |  | |  _  /  | |    | |      | | |  _ < 
//    ____) | |__| | |    | |    | |__| | | \ \  | |    | |____ _| |_| |_) |
//   |_____/ \____/|_|    |_|     \____/|_|  \_\ |_|    |______|_____|____/ 
//                                                                          
//    
-->

##==##


<div class='transition'></div>

# La support library

![icon](/assets/images/icon_support_lib.png)


##==##

## Support Library

Ensemble de librairies android permettant d'assurer une rétro compatibilité sur certaines fonctionnalités apparues avec HoneyComb nottament.

* V4 : Fragment / ViewPager / Navigation Drawer / Loader

* V7actionbar : ActionBar

* V7gridlayout : GridLayout

* V7mediarouter : Media router pour ChromeCast

* V8 : RenderScript

* V13 : Autre version des fragments


<aside class="notes">

</aside>

<footer/>

##==##

## Support Library

En fonction de la librairie, on doit copier un jar ou avoir une dépendance vers la librairie

* V4 : Jar

* V7actionbar : Dépendance

* V7gridlayout : Dépendance

* V7mediarouter : Dépendance

* V8 : Jar

* V13 : Jar


<aside class="notes">

</aside>

<footer/>


##==##

## Support Library

### V4 : Fragments

Toutes les classes héritent de ```android.app.support.v4``` au lieu de ```android.app``` mais sinon globallement les apis restent exactement les mêmes ! 

<br>

Il faut faire quand attention à ce que tous les imports de votre application soient cohérents ! Les 2 packages ne peuvent pas cohabités ensembles.

<aside class="notes">

</aside>

<footer/>

##==##

## Google Play Services

Autre librairie importante permettant d'apporter des fonctionnalités à vos applications et cela quelque soit votre plateforme. 

L'application doit tourner sur un téléphone au minimum sous Froyo et le téléphone doit avoir le play store d'installé ! 

* Google Maps : carto + géolocalisation

* Google Plus : SignIn 

* Google Cloud Platform : Mobile Backend

* Google Cloud Messaging : Push

* App Billing : In app purchase

* Wallet : intégration de la platforme de paiement

* Google Analytics : Statistiques sur votre application

* Google mobile Ads : publicité dans votre application


<aside class="notes">

</aside>

<footer/>

##==##

## Google Play Services

L'installation de cette librairie se fait uniquement via un système de dépendances et nécessite d'activer des apis Google dans la console d'api Google.


<aside class="notes">

</aside>

<footer/>


<!--
//    _____ __  ___  _   _ 
//   |_   _/_ |/ _ \| \ | |
//     | |  | | (_) |  \| |
//     | |  | |> _ <| . ` |
//    _| |_ | | (_) | |\  |
//   |_____||_|\___/|_| \_|
//                         
//    
-->

##==##


<div class='transition'></div>

# L'internationnalisation

![icon](/assets/images/multilingue.jpg)

##==##

## Internationnalisation

Comme pour les layouts, les chaines de caractères sont gérés via des fichiers xml. On peut gérer nos chaines directement sans les variabiliser mais ce n'est pas une bonne pratique.

<br>

Il convient de les mettre dans des fichiers xml en respectant le même nom de clé pour chaque langue ainsi que leur nombre


<aside class="notes">

</aside>

<footer/>

##==##

## Internationnalisation

<br>

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="title">Mon Application</string>
    <string name="hello_world">Bonjour le monde !</string>
</resources>
```

<br>

On sépare les fichiers xml dans des répertoires nommés ```'values'```, on suffixera le nom du répertoire par la langue choisit. Par convention le nom du fichier de langue s'appelle **strings.xml**

<aside class="notes">

</aside>

<footer/>


##==##

## Internationnalisation

**values/strings.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="title">My Application</string>
    <string name="hello_world">Hello World!</string>
</resources>
```

<br><br>

**values-fr/strings.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="title">Mon Application</string>
    <string name="hello_world">Bonjour le monde !</string>
</resources>
```


<aside class="notes">

</aside>

<footer/>


##==##

## Internationnalisation

**layout/activity.xml**
```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/hello_world" />
```

<br><br>

**com.binomed.epsi.MonActivity.java**
```java
// Get a string resource from your app's Resources
String hello = getResources().getString(R.string.hello_world);

// Or supply a string resource to a method that requires a string
TextView textView = new TextView(this);
textView.setText(R.string.hello_world);
```


<aside class="notes">

</aside>

<footer/>

##==##

<div class="last-slide"></div>

<div class="topic-title"></div>

# Cours Mobilité - 04 Android

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