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

        if ('paintWorklet' in CSS){
            try{

                CSS.registerProperty({
                    name: '--cadre-color',
                    syntax: '<color> | none',
                    inherits: false,
                    initialValue: 'white',
                });
                (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/cadre-worklet.js');
            }catch(e){
                console.warn('Error with cadre');
            }
        }
        new Noise();
        new Animations();
        // new TypeText();
        new HighlightEvents();
        if (!inIframe) {
            new Demos();
        }else{
            // document.getElementById('magicVideo').style.display = 'none';
        }

    }



    window.addEventListener('load', pageLoad);
})();