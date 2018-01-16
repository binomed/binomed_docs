'use strict';

import {
    ConsoleHelper
} from './console.js';

(function () {


    function pageLoad() {
        console.info('domReady');

        new ConsoleHelper();

    }

    window.addEventListener('load', pageLoad);
})();