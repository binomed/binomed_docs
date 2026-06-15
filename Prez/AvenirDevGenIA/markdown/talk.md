<!-- .slide: class="transition" -->
# Quel avenir pour les devs<br>à l’ère de la GenAI ?

### Chronique d'une révolution industrielle de notre métier.

*Jean-François Garreau | DevQuest 2026*

##==##

<!-- .slide: class="speaker-slide" -->

<div class="speaker-slide">

# Jean-François Garreau

## Engineering Director @SFEIR

### ![](fa-bluesky "fa fa-brands tc-icons") jefbinomed

### ![](fa-linkedin "fa fa-brands tc-icons") jeanfrancois.garreau


![](./assets/images/jf.jpg 'speaker')


![](./assets/images/Sfeir-Gris-vector.svg 'company')

![](./assets/images/gdg-nantes.png 'badge')

![](./assets/images/gde.png 'badge')

![](./assets/images/et-si-on-parlait.jpeg 'badge')


</div>

##==##

<!-- SLIDE 2 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/nik-fDaUCTp28dA-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/minifig-lego-bleue-sur-surface-blanche-fDaUCTp28dA) by [Nik](https://unsplash.com/fr/@helloimnik)
<!-- .element: class="credits" -->
##++##
##++##
## La fin du code est-elle (encore) annoncée ?

<div class="headline-box fragment"><i class="fa-solid fa-newspaper"></i>"Anthropic dresse un classement des métiers les plus menacés par l’IA"</div>
<div class="headline-box fragment" style="transform: rotate(1deg);"><i class="fa-solid fa-newspaper"></i>"ChatGPT remplace les développeur·euses juniors"</div>

* <i class="fa-solid fa-bullhorn text-warning"></i> **Promesse Marketing :** +100% de productivité.
* <i class="fa-solid fa-skull-crossbones text-danger"></i> **Peur Diffuse :** Le syndrome du remplacement.
<!-- .element: class="list-fragment" -->
##++##


##==##

<!-- SLIDE 3 -->
## Spoiler : <span style="color:var(--accent-color)">Vous n'allez pas disparaître</span>
(Mais vous allez changer)

<div class="card-container">
    <div class="card fragment">
        <i class="fa-solid fa-chart-line fa-2x"></i>
        <p>Le besoin en logiciel n'a jamais été aussi grand.</p>
    </div>
    <div class="card fragment">
        <i class="fa-solid fa-person-arrow-up-from-line fa-2x"></i>
        <p>Passage de "Pisseur de code" à "L'ingénieur·e".</p>
    </div>
</div>

##==##

<!-- ACTE 0 : L'HISTOIRE BÉGAYE .slide: class="transition act-slide" -->

# ACTE 0 : L'HISTOIRE BÉGAYE
### (Ce n'est pas notre première fin du monde)


##==##

<!-- SLIDE 4 : Cartes Perforées .slide: class="tc-multiple-columns" -->

##++##

## 1950-1970 : La fin des "Câbleurs" <i class="fa-solid fa-network-wired"></i>

* **Avant :** Programmer = Câbler physiquement ou perforer des cartes.
* **La Peur :** L'arrivée de l'Assembleur et des premiers compilateurs.
* **Le Mythe :** "Si la machine traduit le langage humain, on n'aura plus besoin d'opérateurs."
<!-- .element: class="list-fragment" -->

> **Résultat :** On a juste arrêté de gérer des câbles pour gérer des registres mémoire.
<!-- .element: class="fragment" -->
##++##
##++## data-background="./assets/images/femme-cable-gemini.png"
##++##


##==##

<!-- SLIDE 5 (NEW) : 1970-1990 .slide: class="tc-multiple-columns" -->

##++##
## 1970-1990 : La révolution de l'Abstraction

*De l'Assembleur vers le Structuré et l'Objet (C, Pascal, C++).*


<ul style="margin-top:20px;">
    <li class="fragment"><strong>La Peur :</strong> "On perd le contrôle du hardware", "C'est trop lent", "Un vrai dev gère sa mémoire".</li>
    <li class="fragment"><strong>La Réalité :</strong> Sans cette abstraction, impossible de créer des systèmes complexes (OS modernes, GUIs).</li>
</ul>
##++##
##++## data-background="./assets/images/computer-assembleur-gemini.png"
##++##


##==##

<!-- SLIDE 5 : 4GL & UML .slide: class="tc-multiple-columns" -->

##++##
## 1990-2000 : Le rêve du "No Code" (V1)

*L'informatique promettait déjà de se débarrasser des développeur·euses.*

<div class="timeline-step fragment">

**1. Les L4G (Langages 4ème génération)**
<small>Promesse : "Écrivez en anglais, l'ordi compile." -> Échec (trop rigide).</small>
</div>

<div class="timeline-step fragment">

**2. L'UML & MDA (Model Driven Architecture)**
<small>Promesse : "Les architectes dessinent des boîtes, le code est généré."</small>
</div>

<small class="fragment">⚠️ **Réalité :** Les diagrammes sont devenus illisibles et on passait plus de temps à debugger le générateur que le code.<small>

##++##
##++## data-background="./assets/images/no-code-gemini.png"

##==##


<!-- SLIDE 6 : Leçon de l'histoire .slide: class="transition mask bottom" data-background="./assets/images/history-book-gemini.png" -->
# La leçon de l'histoire


##==##

<!-- .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/arisa-chattasa-BoQ3FmPQgZI-unsplash.jpg"

source: [unsplash](https://unsplash.com/fr/photos/un-gros-plan-dun-ascenseur-metallique-avec-des-boutons-BoQ3FmPQgZI) by [Arisa Chattasa](https://unsplash.com/fr/@golfarisa)
<!-- .element: class="credits" -->

##++##
##++##
# La leçon de l'histoire


Chaque abstraction promet la mort du développeur·euse...
...et finit par **l'élever**.

1. **Binaire** -> On gère des signaux.
2. **Assembleur** -> On gère la mémoire.
3. **C/Java** -> On gère des structures de données.
4. **Python/JS** -> On gère des librairies.
5. **GenAI** -> On gère des **intentions**.
<!-- .element: class="list-fragment" -->

<h3 style="color:var(--accent-color); margin-top: 30px;" class="fragment">On ne disparaît pas, on monte d'un étage.</h3>
##++##

##==##

<!-- ACTE 1 .slide: class="transition act-slide" -->

# ACTE 1 : LA GUEULE DE BOIS
### (The Reality Check)

##==##

<!-- SLIDE 7 .slide: class="transition mask" data-background="./assets/images/exponential-gemini.png" -->
## Plus de code, plus vite ?

<div style="display: flex; justify-content: space-around; margin-top: 40px;">
    <div>
        <span class="big-stat">+29%</span>
        <br><small style="color:white;">PR fusionnées en un an (GitHub 2025)<br><i>Accélération record de l'activité globale</i></small>
    </div>    
</div>

**1 milliard de commits** poussés sur GitHub en 2025 (+25% YoY). L'IA ne remplace pas le dev, elle décuple sa production brute.
<!-- .element: style="text-align:center; color:white;" -->


[A year of record growth](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)<!-- .element: style="text-align:center; color:white; text-decoration:underline; " -->

Notes:
Source : GitHub Octoverse 2025 : "A year of record growth" (Rapport annuel publié fin 2025).


##==##

<!-- SLIDE 7  .slide: class="transition mask" data-background="./assets/images/slow-gemini.png" -->
## On va plus vite... vraiment ?

<div style="display: flex; justify-content: space-around; margin-top: 40px;">
    <div>
        <span class="big-stat">45%</span>
        <br><small style="color:white;">Perte de temps (Stack Overflow 2025)<br><i>Devs déclarant perdre du temps à déboguer l'IA</i></small>
    </div>
</div>

⚠️ **Le paradoxe de 2025 :** "L'IA amplifie l'existant. Si vos process sont flous, l'IA produit juste du chaos plus rapidement." (Rapport DORA 2025)
<!-- .element: style="text-align:center; color:white;" -->

Notes:
Source 1 : Stack Overflow Developer Survey 2025 (50 000 répondants).

Source 2 : Google Cloud - DORA Report 2025 : "State of AI-assisted Software Development".

##==##

<!-- SLIDE 8 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/charette-ferrari-gemini.png"
##++##
##++##
## Le Goulot d'Étranglement
### L'illusion de la vitesse

**Le Problème :** Mettre un moteur de Ferrari sur une charrette.

<div class="funnel-container fragment">
    <div class="funnel-top">🤖 IA (Coding) : Production Massive</div>
    <div style="font-size: 2em; margin: 10px;">⬇️</div>
    <div class="funnel-bottom">👓 Humain (Review)</div>
</div>

##++##

Notes:
*Concept clé : Théorie des contraintes.*

##==##

<!-- SLIDE 9 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/evgeny-karchevsky-k1tUxfs8JYY-unsplash.jpg"

source: [unsplash](https://unsplash.com/fr/photos/lot-de-canettes-de-boisson-assorties-ecrasees-k1tUxfs8JYY) by [Evgeny Karchevsky](https://unsplash.com/fr/@kor4insky)
<!-- .element: class="credits" -->
##++##
##++##
## L'ivresse du volume

<span class="big-stat text-danger" style="margin-top:-70px;">x2</span>
**de Code Churn**
*(Comparé à l'ère pré-IA)*

* 🚨 **Code "Kleenex" :** + de code écrit que compris
* 📈 **Dette technique exponentielle :** + de copier-coller / - de refactorisation.
* 📉 **Érosion de la modularité :** Les IA favorisent les "monolithes" longs et répétitifs.
<!-- .element: class="list-fragment" -->

Notes:
*Source : Étude GitClear (Jan. 2025/2026) - 250M+ lignes de code.*
* 🚨 **Code "Kleenex" :** Le code est écrit plus vite qu'il n'est compris.
* 📈 **Dette technique exponentielle :** Explosion du copier-coller au détriment de la refactorisation.
* 📉 **Érosion de la modularité :** Les assistants IA favorisent les fichiers "monolithes" longs et répétitifs.

##++##



##==##

<!--  .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/eco-desastre-gemini.png"
##++##
##++##

# Impacts écologiques très forts

<ul>
<li class="fragment"><i class="fa-regular fa-message fa-2x text-danger"></i> 1 prompt = 10x à 25x une recherche Google</li>
<li class="fragment"><i class="fa-solid fa-image fa-2x text-danger"></i> 1 Image = 1 charge de smartphone</li>
<li class="fragment"><i class="fa-solid fa-laptop-code fa-2x text-danger"></i> 1 Image (Standard)≈400 à 500 lignes de code généré </li>

Notes:
* 1 Recherche Google 🔍 -> Consommation : ~0.3 Wh
  * Comparaison maison : C'est l'équivalent d'une ampoule LED allumée pendant 3 minutes. C'est très optimisé.
* 1 Prompt ChatGPT (Texte simple) 💬 ->Consommation : ~3 Wh
  * Comparaison : C'est 10x une recherche Google.
  * Comparaison maison : C'est une ampoule LED allumée pendant 30 à 40 minutes.
* 1 Conversation standard (20-50 questions) 💧
  * Consommation : ~500 ml d'eau "consommée" (évaporée).
  * Comparaison : Une petite bouteille d'eau minérale.
  * Pour un seul prompt, c'est environ une "gorgée" (10-20ml), ce qui semble peu, mais multiplié par les millions d'utilisateurs quotidiens, c'est un fleuve.

##++##



##==##

<!-- SLIDE 10 .slide: class="tc-multiple-columns" -->

##++##
## La fatigue du "Reviewer"

* 🧠 **Cognitif :** Lire du code est plus dur que d'en écrire.
* 🔋 **Charge :** 77% des employés sentent *plus* de charge de travail avec l'IA.
<!-- .element: class="list-fragment"-->

<div class="card fragment" style="width: 90%; margin-top: 20px;">
    <strong>Risque : Le Burnout Cognitif</strong><br>
    On passe du statut de <em>Créateur</em> (Fun) à celui de <em>Correcteur</em> (Fastidieux).
</div>
##++##
##++## data-background="./assets/images/codeur-fatigue-gemini.png"
##++##

Notes:
juillet 2024 par l'Upwork Research Institute
les 77 % d'employés qui ressentent une charge de travail accrue l'expliquent par trois facteurs principaux :

La relecture et la modération (39 %) : Les salariés déclarent passer énormément de temps à vérifier, corriger et valider le contenu (ou le code) généré par l'IA. On est en plein dans la charge cognitive de la relecture !
Le temps d'apprentissage (23 %) : Le temps nécessaire pour monter en compétence et comprendre comment prompter/utiliser l'outil efficacement.
L'augmentation des attentes (21 %) : Puisque l'employé a une IA, le management lui demande d'en faire plus, créant une surcharge de tâches parallèles.

##==##

<!-- SLIDE 11 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/john-salvino-bqGBbLq_yfc-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/chaine-en-acier-gris-verrouillee-sur-la-porte-bqGBbLq_yfc) by [John Salvino](https://unsplash.com/fr/@jsalvino)
<!-- .element: class="credits" -->
##++##
##++##
## Sécurité : La porte ouverte aux fenêtres

1. **Le Paradoxe de Stanford :** Les devs avec IA écrivent du code moins sûr mais sont *plus confiants*.
2. **Attaques Supply Chain :** Hallucinations de paquets inexistants.
3. **Fuite de données :** Qu'envoyez-vous dans le prompt ?
<!-- .element: class="list-fragment" -->

<div style="text-align: center; margin-top: 20px;" class="fragment">
    <i class="fa-solid fa-shield-cat fa-3x text-danger"></i><br>
    🛡️ <em>Approche nécessaire : Zero Trust.</em>
</div>

Notes:
Histoire de l'hallucination de paquets. C'est visuel et effrayant :
* Le dev demande : "Comment je convertis ce fichier ?"
* L'IA répond : import fast-converter-lib (qui n'existe pas).
* Le dev fait npm install fast-converter-lib.
* Un hacker a réservé ce nom 1h avant.
Boum : Injection de code dans l'entreprise.

##++##

##==##

<!-- ACTE 2 .slide: class="transition act-slide"-->

# ACTE 2 : NOUVEAUX PARADIGMES
### (La Transformation Technique)

##==##

<!-- SLIDE 13 (TIMELINE REWORKED) -->
## De la Complétion à l'Agence

<div class="h-timeline">
    <div class="h-timeline-item fragment">
        <div class="h-marker"><i class="fa-solid fa-keyboard"></i></div>
        <div class="h-content">
            <span class="h-year">2021-2022</span>
            <span class="h-title">Autocomplete</span>
            <small>Complétion simple<br>"Appuie sur TAB"</small>
        </div>
    </div>
    <div class="h-timeline-item fragment">
        <div class="h-marker"><i class="fa-regular fa-comments"></i></div>
        <div class="h-content">
            <span class="h-year">2023-2024</span>
            <span class="h-title">Conversationnel</span>
            <small>ChatGPT, Copilot Chat<br>"Le Prompt"</small>
        </div>
    </div>
    <div class="h-timeline-item fragment">
        <div class="h-marker"><i class="fa-solid fa-robot"></i></div>
        <div class="h-content">
            <span class="h-year">2025+</span>
            <span class="h-title">Agentic</span>
            <small>Autonomie, Planif.<br><strong>"Orchestration"</strong></small>
        </div>
    </div>
</div>

<p style="margin-top:40px; text-align:center;" class="fragment">Le/la développeur·euse ne tape plus, il/elle <strong>orchestre</strong>.</p>

##==##

<!-- SLIDE 13 .slide: class="tc-multiple-columns" -->

##++##
## Context is King

> "Une IA sans contexte est un stagiaire sans onboarding."

**Le défi technique de demain :** <!-- .element: class="fragment" -->
* **Context Window** massive (1M+ tokens).
* **Knowledge Graph** d'entreprise.
<!-- .element: class="list-fragment"-->

##++##
##++## data-background="./assets/images/context-king-gemini.png"
##++##

##==##

<!-- .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/robot-chimie-gemini.png"
##++##

##++##

# De nouveaux paradigmes arrivent

Il faut tester, experimenter, se répartir les essais, communiquer, ...

![]()

##++##

##==##

<!-- SLIDE 14 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/spec-gemini.png"
##++##

##++##
## Spec Driven Development (SDD)
### Le retour de la Spécification

Si l'IA code, l'humain doit savoir **parfaitement demander**.

* ➡️ **Compétence clé :** Exprimer une intention technique et métier claire.
* ✅ **Validation :** Écrire les tests *avant* l'implémentation pour vérifier l'IA.
<!-- .element: class="list-fragment" -->
##++##

Notes:
Parler de speckit / OpenSpec / BMAD


##==##

<!-- .slide: data-background="./assets/images/agent-army-gemini.png" class="transition top" -->

# Des équipes d'agents


##==##

<!-- ACTE 3 .slide: class="transition act-slide"-->

# ACTE 3 : L'HUMAIN AU CENTRE
### (The Future is Human)


##==##

<!-- .slide: class="transition bottom" data-background="./assets/images/human-loop-gemini.png" -->

# Human in the loop !

##==##

<!-- SLIDE 16 .slide: class="tc-multiple-columns" -->

##++##
## Du "Codeur" au "Thinker"

**Déplacement de la valeur ajoutée :**

* ❌ Syntaxe & Boilerplate.
* ✅ Architecture, Design System, Sécurité.
<!-- .element: class="list-fragment" -->

Le "Craft" ne disparaît pas, il se déplace vers la conception de haut niveau.
<!-- .element: class="fragment" -->
##++##
##++## data-background="./assets/images/penseur-rodin-gemini.png"
##++##

Notes:
Le boilerplate ne plait à personne, possibilité de refacto facilement

##==##

<!-- .slide: data-background="./assets/images/robot-train-gemini.png" class="transition bottom" -->

# Devenons coach d'IA !

Notes:
On est là pour driver le programme, et si au lieu de voir le remplacement, on commençait à voir le potentiel de code bien écrit ?

##==##

<!-- SLIDE 17 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/brooke-cagle--uHVRvDr7pg-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/a-group-of-friends-at-a-coffee-shop--uHVRvDr7pg) by [Brooke Cagle](https://unsplash.com/fr/@brookecagle)
<!-- .element: class="credits" -->
##++##
##++##
## Soft Skills > Hard Skills ?

### Savoir parler... aux machines et aux humains <!-- .element: class="fragment" -->

1. 🗣️ **Communication :** Compétence #1 pour prompter (machine) et collaborer (humain).
2. 🧐 **Esprit Critique :** Ne jamais faire confiance aveuglément (Zero Trust AI).
<!-- .element: class="list-fragment" -->

Notes:
C'est une opportunité pour se rapprocher des nos collègues

##++##


##==##

<!-- SLIDE 19 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/redcharlie-HxxmKwvUbgI-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/sol-brun-fissure-HxxmKwvUbgI) by [redcharlie](https://unsplash.com/fr/@redcharlie)
<!-- .element: class="credits" -->
##++##
##++##
## Éthique et Écologie

<div style="text-align: center;">
    <i class="fa-solid fa-leaf fa-2x" style="color:#48bb78;"></i><br>
    50 questions = 500ml d'eau évaporée
</div>
<br><br>
<div style="text-align: center;">
    <i class="fa-solid fa-server fa-2x" style="color:#f56565;"></i><br>
    Data Centers =Impact Carbone
</div>

<br>

*Question : "A-t-on besoin d'une IA pour centrer une div ?"* <!-- .element: class="fragment" -->
##++##

Notes:
Nous nous devons d'être critique d'amener de par notre connaissance de ce monde à challenger les usages.

##==##

<!-- SLIDE 15 -->
## L'avenir : SLM vs LLM


![](./assets/images/david-goliat-gemini.png "h-800 center")

Notes:
<div style="display: flex; gap: 20px;">
    <div style="flex: 1; border: 1px solid #444; padding: 20px;">
        <h4 style="color:#aaa">☁️ LLM (Huge)</h4>
        <small>Généraliste, Cloud, Coûteux.</small>
    </div>
    <div style="flex: 1; border: 1px solid var(--accent-color); padding: 20px; background: rgba(0, 242, 234, 0.1);">
        <h4 style="color:var(--accent-color)">💻 SLM (Small)</h4>
        <small>Spécialisé, Local, Rapide, Privé.</small>
    </div>
</div>
Regarder du côté des modèles nanos, des futurs usages intégrés, edge computing

##==##

<!-- .slide: data-background="./assets/images/ia-zombi-gemini.png" class="transition top"-->

# L'IA n'est pas morte

Notes:
On se rabat vers l'IA gen mais l'IA spécialisée existe toujours et est toujours aussi importante

##==##

<!-- ACTE 4 .slide: class="transition act-slide"-->

# ACTE 4 : ON FAIT QUOI ?
### (Plan d'action)


##==##

<!-- SLIDE 20 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/lilartsy-1KkhQ8uL28g-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/deux-mains-sur-le-point-de-tenir-le-papier-peint-1KkhQ8uL28g) by [lilartsy](https://unsplash.com/fr/@lilartsy)
<!-- .element: class="credits" -->
##++##
##++##
## Accompagner, ne pas subir

**Stratégie d'entreprise :**

* 🔦 **Shadow AI :** Interdire et encadrer.
* 🤝 **Gestion des profils :** Calmer les enthousiastes, rassurer les sceptiques.
* ⏳ **Temps :** Accepter que la courbe d'apprentissage est réelle.
<!-- .element: class="list-fragment" -->

##++##

##==##

<!-- .slide: data-background="./assets/images/personas-gemini.png" class="transition bottom" style="--tc-transition-color:var(--danger-color)" -->

# Pensez produit

##==##

<!-- .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/yumu-Ia3Dwq_azas-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/un-masque-noir-sur-fond-rouge-Ia3Dwq_azas) by [Yumu](https://unsplash.com/fr/@cdd20)
<!-- .element: class="credits" -->
##++##
##++##

# Comprenez vos équipes

* ![](fa-hand-holding-medical "fa tc-icons fa-solid") Quelles sont leurs attentes ?
* ![](fa-hand "fa tc-icons fa-solid") Quels sont leur freins ?
* ![](fa-hand-holding-heart "fa tc-icons fa-solid") Quels sont leur besoins ?
* ![](fa-list-check "fa tc-icons fa-solid") Quelles actions mettre en place par personas ?

<!-- .element: class="list-fragment"-->

##++##

##==##

<!-- SLIDE 21 -->
## Exemple d'actions mise en place

<div class="card-container">
    <div class="card fragment">
        <i class="fa-solid fa-hand"></i><br>Ask me GenAI
    </div>
    <div class="card fragment">
        <i class="fa-solid fa-share-nodes"></i><br>Made with GenAI
    </div>
    <div class="card fragment">
        <i class="fa-regular fa-comments"></i><br>Opentalk GenAI
    </div>
    <div class="card fragment">
        <i class="fa-solid fa-laptop-code"></i><br>AI Dojo
    </div>
</div>

Notes:
objectif majeur, désanclaver, amener de la confiance
Mais aussi, partage de prompts, controles, 


##==##

<!-- SLIDE 18 .slide: class="tc-multiple-columns" -->

##++##
## Le défi des Juniors

*Question : Si l'IA fait les tâches faciles, comment les juniors apprennent-ils ?*

<div class="card" style="width: 90%; border: 1px dashed var(--accent-color);">
    <strong>Solution :</strong><br>
    Mentorat renforcé & Compagnonnage obligatoire.<br>
    <em>Retour au modèle de l'artisanat.</em>
</div>
##++##
##++## data-background="./assets/images/tri-programming-gemini.png"
##++##

Notes:
Pourquoi ne pas proposer d'accompagner les juniors à tri-programmer

##==##

<!-- .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/valeur-ajoute-gemini.png"
##++##
##++##

# Opportunité pour se concentrer sur les bons éléments

* Mon code est-il de qualité ?
* Puis-je faire ce refactoring tant attendu ?
* Je me concentre sur la conception et la montée en compétence des équipes
* ...
<!-- .element: class="list-fragment"-->

Notes:
De nombreux éléments sont là pour nous guider et redéfinir ensemble les enjeux futurs

##++##

##==##

<!-- .slide: class="transition bottom" data-background="./assets/images/genia-sous-gemini.png" -->

# Quid de déploiement à l'échelle ?

##==##

<!-- .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/elena-mozhvilo-j06gLuKK0GM-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/loupe-cadre-rond-dore-et-argent-j06gLuKK0GM) by [Elena Mozhvilo](https://unsplash.com/fr/@miracleday)
<!-- .element: class="credits" -->
##++##
##++##

# Coute-t-elle vraiment cher ?

* Repensez aux gains de productivité.
* Équipez vos équipe ne se discute plus.

##++##

Notes:
Un ajustement marché va devoir s'effectuer par contre.

##==##

<!-- .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/christina-kirschnerova-ul_xnAPWc0g-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/personnes-debout-sur-un-ecran-en-metal-gris-pendant-la-journee-ul_xnAPWc0g) by [Christina Kirschnerova
](https://unsplash.com/fr/@tina_96)
<!-- .element: class="credits" -->
##++##
##++##

# Pas sans controle ni-mesure

1. Universalité : Éviter le "Shadow AI" en fournissant un outil sécurisé à tous.
2. Conditionnalité : Pas de licence sans formation ("Le permis de prompter").
3. Responsabilité : L'outil change, la responsabilité reste (Le développeur est seul signataire du commit).
<!-- .element: class="list-fragment" -->>

##++##

Notes:
Parler de la formation SFEIR

##==##

<!-- SLIDE 22 .slide: class="tc-multiple-columns" -->

##++##
# Le/la développeur·euse augmenté·e

> "L'IA ne remplacera pas les développeur·euses. Les développeur·euses qui utilisent l'IA remplaceront ceux/celles qui ne l'utilisent pas."

### <span style="color:var(--accent-color)">Soyez les pilotes, pas les passagers.</span> 
<!-- .element: class="fragment" data-fragment-index="1" -->

*Merci.*
<!-- .element: class="fragment" data-fragment-index="1" -->

##++##
##++## data-background="./assets/images/iadev-vs-dev-gemini.png"
##++##

##==##

<!-- ACTE 4 .slide: class="transition act-slide"-->

# ACTE 5 : CONCLUSION


Notes:

Embrassez le changement plutôt que de lutter, accompagnez plutôt qu'imposer, gardez de l'humain dans cette transition


##==##

<!-- .slide: class="speaker-slide" -->

<div class="speaker-slide">

# Merci !!

## Des questions ?

### ![](fa-bluesky "fa fa-brands tc-icons") jefbinomed

### ![](fa-linkedin "fa fa-brands tc-icons") jeanfrancois.garreau

![](./assets/images/jf.jpg 'speaker')


![](https://openfeedback.io/X6Zd1NPDkMkDZHl003Yu/0/cmmchyuaq026101nstgt6t46f 'tc-qrcode badge text-below')Open Feedback
<!-- .element: style="margin-top: -100px;" -->

![](https://shorturl.at/yFtjr 'tc-qrcode badge text-below')slides : https://shorturl.at/yFtjr
<!-- .element: style="margin-top: 300px; margin-left:-120px" -->

</div>
