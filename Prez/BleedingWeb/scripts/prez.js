'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';
import {
    ApplyCss
} from './helper/applyCss.js';
import {
    ApplyJS
} from './helper/applyJs.js';
import {
    HighlightEvents
} from './highlightEvent.js';
import {
    Demos
} from './demos.js';


(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;

        if (!inIframe) {
            new Demos();
            new HighlightEvents();
        }

    }






    window.addEventListener('load', pageLoad);
})();