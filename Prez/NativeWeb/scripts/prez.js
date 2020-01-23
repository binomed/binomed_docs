'use strict';

import {
    HighlightEvents
} from './highlightEvent.js';


(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;

        new HighlightEvents()
        if (!inIframe) {
            new Demos();
        }

    }



    window.addEventListener('load', pageLoad);
})();