import {
    Reveal,
    ThemeInitializer,
    featherIconPack,
    fontAwesomeIconPack,
    materialSymbolsIconPack,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';

console.log('Reveal version', Reveal.VERSION);
console.log('Reveal instance', Reveal);

// Fonds pleins des slides de transition, par thème (cf. theme-rtt.css).
// Le markdown pose seulement une classe ; ne pas y remettre de data-background,
// talk-control ignore alors la slide.
const BACKGROUNDS = {
    atelier: {
        'tone-1': '#24476b',
        'tone-2': '#2f6b5e',
        'tone-3': '#b0662a',
        invalid: '#a33a2f',
        'transition-black': '#1b1e24',
        'transition-white': '#f4f1ea',
    },
    nuit: {
        'tone-1': '#16263b',
        'tone-2': '#142e2a',
        'tone-3': '#33240f',
        invalid: '#3a1414',
        'transition-black': '#000000',
        'transition-white': '#ece7dc',
    },
};

function slides() {
    return [
        'prez.md',
    ];
}

function presentation() {
    return slides()
        .filter((element) => element !== undefined)
        .map((slidePath) => {
            return { path: slidePath };
        });
}

await ThemeInitializer.init({
    slidesFactory: presentation,
    tcMarkedOptions: {
        fontIcons: [
            fontAwesomeIconPack(),
            featherIconPack(),
            materialSymbolsIconPack(),
        ]
    },
    tcI18nOptions: {
        baseMarkdownPath: 'markdown/',
    },
    tcCustomBackgroundOptions: {
        basePath: './assets/images/',
        mapBackgrounds: (theme) => BACKGROUNDS[theme] ?? BACKGROUNDS.atelier,
    },
    tcThemeOptions: { defaultTheme: 'atelier' },
});
