# Vite Build Setup

Le projet utilise Vite pour builder le code source (`src/`) en un bundle unique (`dist/main.js`).

## Architecture

```
src/
├── main.js (entrypoint)
├── chat-component.js (composant Lit)
├── chat-controller.js (contrôleur)
├── prez-demos-controler.js
└── ... (autres fichiers)
        ↓ (Vite build)
dist/
└── main.js (bundle único + sourcemap)
        ↓ (import depuis)
scripts/slides.js → slides.html
```

## Workflow de Développement

### 1. Build unique
```bash
npm run build:src
```
Génère `dist/main.js` et `dist/main.js.map` une seule fois.

### 2. Développement avec watch
```bash
npm run dev:src
```
Rebuid automatiquement `dist/main.js` à chaque modification dans `src/`.

### 3. Stack complet (dev)
```bash
npm start
```
Lance en parallèle :
- Serveur Express (port 3000)
- Live-server (port 4242)
- Vite watch (rebuild auto)
- Sass watch (CSS)

## Avantages de cette approche

✅ **Résolution des modules** : Vite résout `@lit/reactive-element` et autres imports correctement  
✅ **Pas de web_modules** : Import simple `from 'lit'` au lieu de chemins complexes  
✅ **Sourcemaps** : Debug facile avec `dist/main.js.map`  
✅ **Auto-reload** : `npm run dev:src` rebuid à chaque changement  
✅ **Single bundle** : Un seul fichier `dist/main.js` importé par `scripts/slides.js`

## Imports dans src/

Utilise les imports naturels NPM :

```javascript
// ✅ Correct (Vite résout)
import { LitElement, html, css } from 'lit';
import { ChatComponent } from './chat-component.js';

// ❌ Ancien (plus besoin)
import { LitElement } from '../node_modules/lit/index.js';
```

## Configuration

- **Entry point** : `src/main.js`
- **Output** : `dist/main.js` (ES modules)
- **Minification** : Désactivée
- **Sourcemaps** : Activées (`dist/main.js.map`)
- **Watch** : Activé en mode dev

Voir `vite.config.js` pour plus de détails.

## Dépannage

### Erreur: "Cannot find module"
→ Utilise les imports NPM simples (`from 'lit'`) au lieu de chemins relatifs

### dist/main.js ne change pas
→ Utilise `npm run dev:src` pour le watch mode, pas `npm run build:src`

### Les changements ne se reflètent pas dans le navigateur
→ Assure-toi que `npm run dev:src` est actif et que live-server regarde `dist/`
