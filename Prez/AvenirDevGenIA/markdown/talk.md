<!-- .slide: class="transition" -->
# Quel avenir pour les devs<br>à l’ère de la GenAI ?

### Chronique d'une révolution industrielle de notre métier.

*Jean-François Garreau | Décembre 2025*

##==##

<!-- .slide: class="speaker-slide" -->

<div class="speaker-slide">

# Jean-François Garreau

## Engineering Director @SFEIR

### @jefbinomed

### GDG Nantes Organizer

![](./assets/images/jf.jpg 'speaker')

![](./assets/images/gdg-nantes.png 'company')

![](./assets/images/gde.png 'badge')


</div>

##==##

<!-- SLIDE 2 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/nik-fDaUCTp28dA-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/minifig-lego-bleue-sur-surface-blanche-fDaUCTp28dA) by [Nik](https://unsplash.com/fr/@helloimnik)
<!-- .element: class="credits" -->
##++##
##++##
## La fin du code est-elle (encore) annoncée ?

<div class="headline-box fragment"><i class="fa-solid fa-newspaper"></i>"Devin, le premier ingénieur IA autonome"</div>
<div class="headline-box fragment" style="transform: rotate(1deg);"><i class="fa-solid fa-newspaper"></i>"ChatGPT remplace les développeurs juniors"</div>

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
        <p>Passage de "Pisseur de code" à "Architecte de valeur".</p>
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

<!--
<div style="display:flex; gap:20px; align-items:center; margin-top:20px;">
    <div class="code-box" style="background:#1e293b; color:#fff; flex:1;">
        MOV AX, 1<br>ADD AX, 2<br>JMP L1<br><br><span style="color:#aaa;">// Contrôle total</span>
    </div>
    <div style="font-size:2em;">→</div>
    <div class="code-box" style="background:#eff6ff; color:#333; border:1px solid #93c5fd; flex:1;">
        class User {<br>  login() { ... }<br>}<br><br><span style="color:#2563eb;">// Modélisation</span>
    </div>
</div>
-->

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

*L'informatique promettait déjà de se débarrasser des développeurs.*

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


Chaque abstraction promet la mort du développeur...
...et finit par **l'élever**.

1. **Binaire** -> On gère des signaux.
2. **Assembleur** -> On gère la mémoire.
3. **C/Java** -> On gère des structures de données.
4. **Python/JS** -> On gère des librairies.
5. **GenAI** -> On gère des **intentions**.

<h3 style="color:var(--accent-color); margin-top: 30px;">On ne disparaît pas, on monte d'un étage.</h3>
##++##

##==##

<!-- ACTE 1 .slide: class="transition act-slide" -->

# ACTE 1 : LA GUEULE DE BOIS
### (The Reality Check)

##==##

<!-- SLIDE 7 .slide: class="transition mask" data-background="./assets/images/exponential-gemini.png" -->
## On va plus vite... vraiment ?

<div style="display: flex; justify-content: space-around; margin-top: 40px;">
    <div>
        <span class="big-stat">+55%</span>
        <br><small style="color:white;">Vitesse (GitHub 2023)<br><i>Sur tâches simples</i></small>
    </div>    
</div>



##==##

<!-- SLIDE 7  .slide: class="transition mask" data-background="./assets/images/slow-gemini.png" -->
## On va plus vite... vraiment ?


<div style="display: flex; justify-content: space-around; margin-top: 40px;">
    <div>
        <span class="big-stat text-warning">20-45%</span>
        <br><small style="color:white;">Gain Réel (McKinsey)<br><i>Sur ingénierie globale</i></small>
    </div>
</div>

⚠️ **Réalité Terrain :** "Le code généré n'est pas du code livré."
<!-- .element: style="text-align:center;" -->

##==##

<!-- SLIDE 8 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/charette-ferrari-gemini.png"
##++##
##++##
## Le Goulot d'Étranglement
### L'illusion de la vitesse

**Le Problème :** Mettre un moteur de Ferrari sur une charrette.

<div class="funnel-container">
    <div class="funnel-top">🤖 IA (Coding) : Production Massive</div>
    <div style="font-size: 2em; margin: 10px;">⬇️</div>
    <div class="funnel-bottom">👓 Humain (Review)</div>
</div>

*Concept clé : Théorie des contraintes.*
##++##

##==##

<!-- SLIDE 9 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/evgeny-karchevsky-k1tUxfs8JYY-unsplash.jpg"

source: [unsplash](https://unsplash.com/fr/photos/lot-de-canettes-de-boisson-assorties-ecrasees-k1tUxfs8JYY) by [Evgeny Karchevsky](https://unsplash.com/fr/@kor4insky)
<!-- .element: class="credits" -->
##++##
##++##
## On produit plus, on jette plus

*Source : Étude GitClear (Jan 2024) - 150M lignes de code.*

<span class="big-stat text-danger">+41%</span>
**de Code Churn**
*(Code écrit puis jeté/modifié < 2 semaines)*

* 📉 Explosion de la dette technique.
* 📋 Moins de réutilisation, plus de copier-coller.
##++##

##==##

<!-- SLIDE 10 .slide: class="tc-multiple-columns" -->

##++##
## La fatigue du "Reviewer"

* 🧠 **Cognitif :** Lire du code est plus dur que d'en écrire.
* 🔋 **Charge :** 77% des employés sentent *plus* de charge de travail avec l'IA.

<div class="card" style="width: 90%; margin-top: 20px;">
    <strong>Risque : Le Burnout Cognitif</strong><br>
    On passe du statut de <em>Créateur</em> (Fun) à celui de <em>Correcteur</em> (Fastidieux).
</div>
##++##
##++## data-background="./assets/images/codeur-fatigue-gemini.png"
##++##

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

<div style="text-align: center; margin-top: 20px;">
    <i class="fa-solid fa-shield-cat fa-3x text-danger"></i><br>
    🛡️ <em>Approche nécessaire : Zero Trust.</em>
</div>
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

**Le défi technique de demain :**
* **RAG** (Retrieval-Augmented Generation).
* **Context Window** massive (1M+ tokens).
* **Knowledge Graph** d'entreprise.
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
##++##


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

Le "Craft" ne disparaît pas, il se déplace vers la conception de haut niveau.
##++##
##++## data-background="./assets/images/penseur-rodin-gemini.png"
##++##

##==##

<!-- .slide: data-background="./assets/images/robot-train-gemini.png" -->

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

### Savoir parler... aux machines et aux humains

1. 🗣️ **Communication :** Compétence #1 pour prompter (machine) et collaborer (humain).
2. 🧐 **Esprit Critique :** Ne jamais faire confiance aveuglément (Zero Trust AI).
##++##


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

<!-- SLIDE 19 .slide: class="tc-multiple-columns" -->

##++## data-background="./assets/images/redcharlie-HxxmKwvUbgI-unsplash.jpg"
source: [unsplash](https://unsplash.com/fr/photos/sol-brun-fissure-HxxmKwvUbgI) by [redcharlie](https://unsplash.com/fr/@redcharlie)
<!-- .element: class="credits" -->
##++##
##++##
## Éthique et Écologie

<div style="text-align: center;">
    <i class="fa-solid fa-leaf fa-2x" style="color:#48bb78;"></i><br>
    1 Image =<br>1 recharge smartphone
</div>
<br><br>
<div style="text-align: center;">
    <i class="fa-solid fa-server fa-2x" style="color:#f56565;"></i><br>
    Data Centers =<br>Impact Carbone
</div>

<br>

*Question : "A-t-on besoin d'une IA pour centrer une div ?"*
##++##

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

##==##

<!-- ACTE 4 .slide: class="transition act-slide"-->

# ACTE 4 : ON FAIT QUOI ?
### (Plan d'action)


##==##

<!-- SLIDE 20 -->
## Accompagner, ne pas subir

**Stratégie d'entreprise :**
* 🔦 **Shadow AI :** Ne pas interdire, mais encadrer.
* 🤝 **Gestion des profils :** Calmer les enthousiastes, rassurer les sceptiques.
* ⏳ **Temps :** Accepter que la courbe d'apprentissage est réelle.

##==##

<!-- SLIDE 21 -->
## Créer une culture de l'IA

<div class="card-container">
    <div class="card">
        <i class="fa-solid fa-flask"></i><br>Hackathons
    </div>
    <div class="card">
        <i class="fa-solid fa-share-nodes"></i><br>Partage de prompts
    </div>
    <div class="card">
        <i class="fa-regular fa-comments"></i><br>Dialogue ouvert
    </div>
</div>

##==##

<!-- SLIDE 22 -->
# Le développeur augmenté

> "L'IA ne remplacera pas les développeurs. Les développeurs qui utilisent l'IA remplaceront ceux qui ne l'utilisent pas."

### <span style="color:var(--accent-color)">Soyez les pilotes, pas les passagers.</span>

*Merci.*

##==##

<!-- ACTE 4 .slide: class="transition act-slide"-->

# ACTE 5 : CONCLUSION

