# Guide pour les Agents IA (AGENTS.md)

Ce fichier sert de référence pour tout agent IA (Gemini, Claude, etc.) travaillant sur ce repository. Il décrit l'architecture, les conventions et le fonctionnement du projet.

## 🌟 Présentation du Projet
Ce repository est une présentation interactive utilisant **Reveal.js** traitant de **WebLLM** et des **Built-in APIs** (APIs IA natives des navigateurs). Il contient des démos intégrées permettant d'interagir avec des modèles d'IA localement dans le navigateur.

## 🛠 Tech Stack
- **Framework de présentation** : Reveal.js (via une extension maison `talk-control-revealjs-extensions`).
- **Build Tool** : [Vite](https://vitejs.dev/).
- **Langage** : JavaScript (ESM).
- **Documentation** : JSDoc pour l'autocomplétion et la clarté.
- **UI** : [Lit-html](https://lit.dev/docs/libraries/standalone-templates/) pour certains composants web.
- **IA** : Chrome AI APIs (Prompt API, Translation API, Summarization API, etc.) et [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js/).

## 📁 Structure du Projet
- `src/` : Coeur de l'application (logique des démos et contrôleurs).
- `markdown/talk.md` : Contenu des slides au format Markdown.
- `assets/` : Ressources statiques (images, etc.).
- `scripts/` : Scripts utilitaires pour la présentation.
- `web_modules/` : Dépendances frontend gérées manuellement ou via des scripts.

## 🏗 Architecture de `src/`
L'application suit une architecture pilotée par des contrôleurs :

- **`main.js`** : Point d'entrée, initialise `PrezDemosControler`.
- **`prez-demos-controler.js`** : Orchestrateur principal. Il écoute les événements Reveal.js (`slidechanged`) pour activer/désactiver les démos.
- **`chat-controller.js` & `chat-component.js`** : Gèrent l'interface de chat et la communication avec l'utilisateur.
- **`built-in.js`** : Abstraction pour les APIs IA natives de Chrome.
- **`prompt-controler.js`** : Gère l'état du téléchargement des modèles et l'affichage du statut des APIs.
- **`action-handler.js`** : Permet à l'IA d'exécuter des actions sur la présentation (ex: `[[ACTION:NEXT_SLIDE]]`).
- **`speech.js` & `tts.js`** : Gèrent respectivement la reconnaissance vocale et la synthèse vocale.
- **`camera-controller.js`** : Gère l'accès à la webcam pour les démos de vision.

## 📝 Conventions de Code
- **Langue** : Commentaires et documentation en français. Code (variables, fonctions, classes) en **anglais**.
- **Styles de JS** : Utiliser uniquement des modules ESM (`import`/`export`).
- **JSDoc** : Obligatoire pour toutes les classes et méthodes publiques afin de faciliter l'assistance de l'IA.
- **Démos** : Les démos sont activées via des attributs `data-state` dans les slides de `talk.md`, capturés par `PrezDemosControler`.

## 🚀 Commandes Utiles
- `npm run start` : Lance l'environnement de développement complet (serveur, sass, vite).
- `npm run build:src` : Compile les assets via Vite.
- `npm run serve` : Lance uniquement le serveur de présentation sur le port 4242.

## 🤖 Instructions spécifiques pour l'IA
- Toujours vérifier le `package.json` avant de suggérer une nouvelle dépendance.
- Respecter le pattern des contrôleurs privés (`#property`) utilisé dans `prez-demos-controler.js`.
- Lors de la modification des slides (`talk.md`), faire attention aux marqueurs `##==##` qui séparent les slides.
