'use strict'
import {
    RevealEngineEvents
} from './prez/revealEngineEvents.js';


(function () {


    function pageLoad() {
        new RevealEngineEvents();
    }


    window.addEventListener('load', pageLoad);
})();