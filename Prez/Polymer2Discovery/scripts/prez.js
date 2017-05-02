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


            setTimeout(() => {
                if (Date.now() % 2 === 0){

                    document.querySelector('#firstTest').area = {
                        width: 500,
                        height: 100,
                        top: 50,
                        left: 50
                    };
                }else{
                    document.querySelector('#firstTest').area = null;
                }
            },1000);
        });
    }

    window.addEventListener('load', pageLoad);
})();