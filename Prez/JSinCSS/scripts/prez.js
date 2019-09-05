'use strict';

import {
    Demos
} from './demos.js';


(async function () {


    async function pageLoad() {

        const inIframe = window.top != window.self;

        if (!inIframe) {
            new Demos();
        }

    }



    window.addEventListener('load', pageLoad);
})();