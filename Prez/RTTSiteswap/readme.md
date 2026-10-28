# Le Siteswap

Présentation reveal.js basée sur [talk-control](https://github.com/TalkControl/talk-control-revealjs-extensions), même socle que les autres conférences (cf. `../WebLLM`). Projet 100% autonome : plus aucune dépendance à des symlinks externes.

## Démarrer

```bash
npm install
npm run serve
```

`npm install` récupère `@talk-control/talk-control-revealjs-extensions` et le script `prepare` le copie dans `./web_modules` (requis par l'import map d'`index.html`).

## Structure

- `markdown/prez.md` : contenu des slides (séparateur `##==##`, notes avec `Notes:`).
- `assets/images/` : images de la présentation.
- `scripts/slides.js` : configuration de `ThemeInitializer` (liste des slides, thème par défaut).
- `theme-rtt.css` : variables de thème (`body[data-theme='rtt']`), point de départ à retravailler.
- `rtt.css` : CSS libre additionnel.
