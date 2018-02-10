'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';
import {
    ApplyCss
} from './applyCss.js';
import {
    HighlightEvents
} from './highlightEvent.js';


(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;

        if (!inIframe) {
            _codeMirorsDetects();
            new HighlightEvents();
        }

    }

    function _codeMirorsDetects() {
        try {

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

        } catch (error) {
            console.error(error);
        }

    }




    window.addEventListener('load', pageLoad);
})();