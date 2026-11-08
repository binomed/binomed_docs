import {
    Reveal,
    ThemeInitializer,
    featherIconPack,
    fontAwesomeIconPack,
    materialSymbolsIconPack,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';

console.log('Reveal version', Reveal.VERSION);
console.log('Reveal instance', Reveal);

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
    tcThemeOptions: { defaultTheme: 'rtt' },
});
