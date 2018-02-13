'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';
import {
    HighlightEvents
} from './highlightEvent.js';
import {
    Demos
} from './demos.js';
import { XAdvanced, XHost, XRating, XThumbs2, XWeirdInput, XThumbs } from './partTheme/components-sample.js';


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