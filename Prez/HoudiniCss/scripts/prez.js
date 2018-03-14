'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';
import {
    HighlightEvents
} from './highlightEvent.js';
import {
    Demos
} from './demos.js';
import {
    XHost,
    XRating,
    XThumbs
} from './partTheme/components-sample.js';
import {
    ControlPrez
} from './controlPrez.js';
import {
    TypeText
} from './typedText.js'
import {Noise} from './houdini/noise.js';



(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;


        CSS.registerProperty({
            name: '--cadre-corner-1',
            syntax: '<image> | none',
            initialValue: 'none',
        });
        CSS.registerProperty({
            name: '--cadre-corner-2',
            syntax: '<image> | none',
            initialValue: 'none',
        });
        CSS.registerProperty({
            name: '--cadre-corner-3',
            syntax: '<image> | none',
            initialValue: 'none',
        });
        CSS.registerProperty({
            name: '--cadre-corner-4',
            syntax: '<image> | none',
            initialValue: 'none',
        });
        CSS.registerProperty({
            name: '--cadre-color',
            syntax: '<color> | none',
            initialValue: 'white',
        });
        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/cadre-worklet.js');
        new Noise();
        // new TypeText();
        if (!inIframe) {
            new Demos();
            // new HighlightEvents();
            // new ControlPrez();
        }else{
            // document.getElementById('magicVideo').style.display = 'none';
        }

        /*Reveal.addEventListener('animate-houdini-workflow', () => {

            document.getElementById('houdini_workflow-1').style.display = '';
            document.getElementById('houdini_workflow-2').style.display = 'none';
            Reveal.addEventListener('fragmentshown', callBackFragment);

            function callBackFragment() {
                document.getElementById('houdini_workflow-1').style.display = 'none';
                document.getElementById('houdini_workflow-2').style.display = '';
                Reveal.removeEventListener('fragmentshown', callBackFragment);
            }
        });

        Reveal.addEventListener('start-video-magic', () => {
            document.getElementById('magicVideo').src = './assets/images/magic.gif';
        });

        Reveal.addEventListener('start-video-sensor', () => {
            document.getElementById('sensorVideo').src = './assets/images/generic-sensor-api.gif';
        });*/

    }



    window.addEventListener('load', pageLoad);
})();