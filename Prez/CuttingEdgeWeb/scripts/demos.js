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

            this._demoPaintApi();

            this._demoPictureInPicture();

        } catch (error) {
            console.error(error);
        }

    }

    _demoCssVar() {
        if (!document.getElementById('codemirror-css')){
            return;
        }
        /** */
        new ApplyCss(
            document.getElementById('codemirror-css'),
            `#render-element h2{
    --a-super-var: #FFF;
}
#render-element .text-1{

}
#render-element .text-2{

}`
        );
    }

    _demoCssVarInJS() {
        if (!document.getElementById('demo-ghost-parent')){
            return;
        }

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
    --left-pos: 0;
}
#demo-ghost-parent .demo-shadow,
#demo-ghost-parent .demo-ghost {
    left: var(--left-pos);
}`
        );

        new ApplyCodeMiror(document.getElementById('codemirror-css-in-js-js'),
            'javascript',
            `document.addEventListener('mousemove', (event) => {
    const deltaX = this.width - event.clientX;
    const median = this.width / 2;
    const ghostParent = document.getElementById('demo-ghost-parent');
    const left = event.clientX > median ? (event.clientX - median) : -1 * (median - event.clientX);

    ghostParent.style.setProperty('--left-pos', \`\${left}px\`);
});`);
    }

    _demoPartTheme() {
        if(!document.getElementById('codemirror-part-css')){
            return;
        }

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

    _demoPaintApi() {
        if (!document.getElementById('codemirror-paint-api-css')){
            return;
        }

        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');

        new ApplyCss(
            document.getElementById('codemirror-paint-api-css'),
            `
#render-element-paint-api {
    --circle-color: #FFF;
    --width-circle: 100px;
    width: var(--width-circle);
    background-image: paint(circle);
}

            `
        );

        new ApplyCodeMiror(document.getElementById('codemirror-paint-api'),
            'javascript',
            `paint(ctx, geom, properties) {
    // Change the fill color.
    const color = properties.get('--circle-color').toString();
    ctx.fillStyle = color;
    // Determine the center point and radius.
    const radius = Math.min(geom.width / 2, geom.height / 2);
    // Draw the circle \\o/
    ctx.beginPath();
    ctx.arc(geom.width / 2, geom.height / 2, radius, 0, 2 * Math.PI);
    ctx.fill();
}
            `);
    }

    _demoPictureInPicture(){
        if (!document.getElementById('demo-pip')){
            return;
        }

        const videoPip = document.getElementById('video-pip');
        const btnPip = document.getElementById('button-pip');

        btnPip.addEventListener('click', async ()=>{
            btnPip.disabled = true;
            try{

                await videoPip.requestPictureInPicture();
            }catch(e){
                console.error(e);
            }
            btnPip.disabled = false;
        });
    }

}