'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';
import {
    HighlightEvents
} from './highlightEvent.js';
import {
    Demos
} from './demos.js';
import {Noise} from './houdini/noise.js';
import {Animations} from './animations/anim.js';



(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;


        CSS.registerProperty({
            name: '--cadre-color',
            syntax: '<color> | none',
            initialValue: 'white',
        });
        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/cadre-worklet.js');
        new Noise();
        new Animations();
        // new TypeText();
        if (!inIframe) {
            new Demos();
            new HighlightEvents();
        }else{
            // document.getElementById('magicVideo').style.display = 'none';
        }

    }



    window.addEventListener('load', pageLoad);
})();