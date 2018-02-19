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



(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;


        new TypeText();
        if (!inIframe) {
            new Demos();
            new HighlightEvents();
            // new ControlPrez();
        }

        Reveal.addEventListener('animate-houdini-workflow', () => {

            document.getElementById('houdini_workflow-1').style.display = '';
            document.getElementById('houdini_workflow-2').style.display = 'none';
            Reveal.addEventListener('fragmentshown', callBackFragment);

            function callBackFragment() {
                document.getElementById('houdini_workflow-1').style.display = 'none';
                document.getElementById('houdini_workflow-2').style.display = '';
                Reveal.removeEventListener('fragmentshown', callBackFragment);
            }
        });

    }



    window.addEventListener('load', pageLoad);
})();