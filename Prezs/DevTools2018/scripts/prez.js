'use strict';

import {
    ConsoleHelper
} from './console.js';
import {
    DebugHelper
} from './debug.js';

(function () {


    function pageLoad() {
        console.info('domReady');

        new ConsoleHelper();
        new DebugHelper();

    }

    window.addEventListener('load', pageLoad);
})();