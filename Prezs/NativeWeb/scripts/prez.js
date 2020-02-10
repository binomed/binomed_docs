'use strict';

import {
    HighlightEvents
} from './highlightEvent.js';
import { Demos } from './demos.js';


(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;

        if (!inIframe) {
            new HighlightEvents()
            new Demos();
        }

    }



    window.addEventListener('load', pageLoad);
})();