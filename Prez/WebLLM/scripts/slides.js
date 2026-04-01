import {
    Reveal,
    ThemeInitializer,
    featherIconPack,
    fontAwesomeIconPack,
    materialSymbolsIconPack,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';

import '../src/actions.js';

console.log('Reveal version', Reveal.VERSION);
console.log('Reveal instance', Reveal);

// One method per module
function slides(showType) {
    return [
        'talk.md'
    ];
}


function formation(showType) {
    return [
        //
        ...slides(),
    ]
        .filter((element) => element !== undefined)
        .map((slidePath) => {
            return { path: slidePath };
        });
}

await ThemeInitializer.init({
    slidesFactory: formation,
    tcMarkedOptions: {
        fontIcons: [
            fontAwesomeIconPack(),
            featherIconPack(),
            materialSymbolsIconPack(),
        ],
        knowStyles: ['custom-img-style'],
    },
    tcI18nOptions: {
        baseMarkdownPath: 'markdown/',
    },
    tcCustomBackgroundOptions: {
        basePath: '/assets/images/',
        mapBackgrounds: (theme) => {
            return {
                'transition':'#1e293b',
                'first-slide': '#1e293b',
                'yellow-slide': 'yellow',
                'orange-slide': '#f9cb9c',
                'transition-wall': theme === 'dark' ? 'party.jpg' : 'wall.jpg',
            };
        },
    },
    tcThemeOptions: {defaultTheme:"lema"},
});
