'use strict';
import {
    ApplyCss
} from './helper/applyCss.js';
import {
    ApplyCodeMiror
} from './helper/applyJs.js';

export class Demos {

    constructor() {
        try {

            this._demoCssVar();

            this._demoCssVarInJS();

            this._demoPartTheme();

        } catch (error) {
            console.error(error);
        }

    }

    _demoCssVar() {
        /** */
        new ApplyCss(
            document.getElementById('codemirror-css'),
            `
#render-element{
--a-super-var: #FFF;
}
#render-element .text-1{

}
#render-element .text-2{

}
            `
        );
    }

    _demoCssVarInJS() {

        let indiceH = -1;
        let subscribe = false;
        let clientRect = undefined;
        const ghostParent = document.getElementById('demo-ghost-parent');

        function processMouse(event) {
            const deltaX = (clientRect.width + clientRect.left) - event.clientX;
            const median = clientRect.width / 2;
            const left = deltaX > 0 ? (median - deltaX) : (median + (-1 * deltaX));
            ghostParent.style.setProperty('--left-pos', `${left}px`);
            // console.log(`deltaX: ${deltaX} / median : ${median} / width : ${width} / left : ${left}`)
        }

        Reveal.addEventListener('ghost-state', (event) => {
            subscribe = true;
            setTimeout(() => {
                indiceH = Reveal.getIndices().h;
                clientRect = ghostParent.getBoundingClientRect();
                ghostParent.addEventListener('mousemove', processMouse);
            }, 500);
        });

        Reveal.addEventListener('slidechanged', (event) => {
            if (subscribe && indiceH != event.indexh) {
                ghostParent.removeEventListener('mousemove', processMouse);
            }
        });


        new ApplyCss(
            document.getElementById('codemirror-css-in-js-css'),
            `#demo-ghost-parent {
--left-pos:0;
}
#demo-ghost-parent .demo-shadow,
#demo-ghost-parent .demo-ghost{
left: var(--left-pos);
}`
        );

        new ApplyCodeMiror(document.getElementById('codemirror-css-in-js-js'),
            'javascript',
            `document.addEventListener('mousemove', (event) =>{
    const deltaX = this.width - event.clientX;
    const median = this.width / 2;
    const ghostParent = document.getElementById('demo-ghost-parent');
    const left = event.clientX > median ? (event.clientX - median) : -1 * (median - event.clientX);

    ghostParent.style.setProperty('--left-pos', \`\${left}px\`);
});
            `);
    }

    _demoPartTheme(){
        new ApplyCodeMiror(document.getElementById('codemirror-part-css'),
            'css',
            `x-rating::part(subject) {
    padding: 4px;
    min-width: 20px;
    display: inline-block;
}
.uno:hover::part(subject) {
    background: lightgreen;
}
.duo::part(subject) {
    background: goldenrod;
}
.uno::part(rating-thumb-up) {
    background: green;
}
.uno::part(rating-thumb-down) {
    background: tomato;
}
.duo::part(rating-thumb-up) {
    background: yellow;
}
.duo::part(rating-thumb-down) {
    background: black;
}
x-rating::theme(thumb-up) {
    border-radius: 8px;
}
`);

        new ApplyCodeMiror(document.getElementById('codemirror-part-html'),
            'text/html',
            `<x-thumbs>
    #shadow-root
    <div part="thumb-up">👍</div>
    <div part="thumb-down">👎</div>
</x-thumbs>
<x-rating>
    #shadow-root
    <div part="subject"><slot></slot></div>
    <x-thumbs part="* => rating-*"></x-thumbs>
</x-rating>

<x-rating class="uno">❤️</x-rating>
<x-rating class="duo">🤷</x-rating>
`);
    }
}