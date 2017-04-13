'use strict'
import {
    RevealEngineEvents
} from './prez/revealEngineEvents.js';


(function () {


    function pageLoad() {
        new RevealEngineEvents();

        _manageTimer();

    }

    function _manageTimer() {

        let startTimer = false;
        Reveal.addEventListener('slidechanged', (event) => {
            console.log(event);
            if(event.indexh > 0 && !startTimer){
                startTimer = true;
                document.querySelector('gdg-timer').toggle = true;
            }else if(event.indexh === 0 && startTimer){
                startTimer = false;
            }
        });
    }

    window.addEventListener('load', pageLoad);
})();