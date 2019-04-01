
<!-- .slide: class="first-slide" -->

# **AutoML**


### Ou comment faire du machine learning sans data Scientist

<h3>#TNT19</h3>

##==##

# Disclamer ⚠️

![center w-500](./assets/images/cat-meme.jpg)


##==##

<!-- .slide: data-background="./assets/images/jeshoots-com-436787-unsplash.jpg" class="transition text-white"  -->

# Avant

##==##

## Machine Learning process

![center w-700](./assets/images/Machine_learning.png)

Notes:
Fallait tout hoster, tout entrainer, ...

##==##


<!-- .slide: data-background="./assets/images/tensorflow.jpeg" class="no-filter"  -->


##==##

## Tensorflow process

![center w-700](./assets/images/Machine_learning_Tensorflow.png)

Notes:
Ici les algos sont déjà écrits mais reste à gérer soit même l'entrainement etc...


##==##

<!-- .slide: class="no-filter transition"  -->

# Apis existantes

![center w-700](./assets/images/google-cloud-api.png)

Notes:
La on parle de google mais ça marche aussi pour Microsoft, IBM, Amazon ...
Chacun propose la sienne, déjà pré-entrainée, ...


##==##

## CloudML Api

![center w-700](./assets/images/Machine_learning_visionapi.png)

Notes:
Ici tout est pret pour nous et exposé sous forme d'API Rest

##==##

<!-- .slide: data-type-show="prez"  -->

# Démo

<div id="demo-detect-label">
    <div id="targetVision">You can drag an image file here</div>
    <video id="mirror-label" class="hide"></video>
    <div id="labels-detected" class="hide"></div>
    <button id="startVideo">Start Video</button>
    <button id="takeAPicture">Take A Picture</button>
</div>

Notes:
https://cloud.google.com/vision/docs/detecting-labels

##==##


<!-- .slide: data-background="./assets/images/groot-hodor-chewbacca.jpg" class="transition text-red"  -->


# Et si je veux mon propre modèle ?

Notes:
Je s'appelle Groot

##==##

<!-- .slide: class="no-filter transition"  -->

# AutoML à la rescousse

![center w-700](./assets/images/auto_ml.png)


##==##

## Automl process

![center w-700](./assets/images/Machine_learning_automl.png)


Notes:
ici, on a plus qu'à gérer le dataset

##==##

<!-- .slide: class="no-filter transition"  -->

# Autre APIS

![center w-700](./assets/images/api-lead.png)

Translation | Natural Languages | Vision

Notes:
Natural Langages / Translation


##==##

<!-- .slide: data-type-show="prez"  -->

# Démo

<div id="demo-automl">
    <div id="automl-targetVision">You can drag an image file here</div>
    <video id="automl-mirror-label" class="hide"></video>
    <div id="automl-labels-detected" class="hide"></div>
    <button id="automl-startVideo">Start Video</button>
    <button id="automl-takeAPicture">Take A Picture</button>
</div>

##==##

<!-- .slide: data-background="./assets/images/alen-jacob-589057-unsplash.jpg" class="transition text-red"  -->

# Under the hood


##==##


![center h-500](./assets/images/creating-ml-solutions_2x.png)

Notes:
Tout se joue sur l'utilisation de models pré-entrainés et dédiés à des types de données


##==##



# Génération de datasets

![center w-700](./assets/images/automl_datasets.png)

Notes:
Pricing dépendant du nombre d'images dans le datasets (3$ toutes les 1000 images)

##==##



# Détail d'un dataset

![center w-700](./assets/images/automl_dataset_detail.png)

##==##



# Entrainement d'un modèle

![center w-700](./assets/images/automl_model_training.png)

##==##



# Matrice de confusion

![center w-700](./assets/images/automl_confusion_matrix.png)

##==##



# Test du modèle

![center w-700](./assets/images/automl_training.png)


##==##



<!-- .slide: class="no-filter transition"  -->

# Autres solutions

![center w-700](./assets/images/watson_studio.png)

IBM Watson Studio

##==##

<!-- .slide: class="who-am-i" -->

## Des Questions ?

### Jean-François Garreau

<!-- .element: class="descjf" -->
GDE Web Technologies,  Front-end developer & Community Manager

![avatar w-300 wp-200](assets/images/jf.jpg)


![company_logo](assets/images/logo-SFEIR-blanc-orange.svg)
![gdg_logo](assets/images/GDG-Logo-carre.png)

<!-- .element: class="twitter" -->
[@jefBinomed](https://twitter.com/jefBinomed)
