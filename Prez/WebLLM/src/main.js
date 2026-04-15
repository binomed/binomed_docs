import { PrezDemosControler } from './prez-demos-controler.js';
import './chat-component.js';

const DEBUG = true;
// --- Utilitaires de log et UI ---
window.log = (msg, type = 'info', msgOrError) => {
    if (!type){
        type = 'debug';
    }
    if(type === 'info' ||  type === 'debug' && DEBUG){
        console.log(`[${type.toUpperCase()}] ${msg}`, msgOrError);
    }else if (type === 'error'){
        console.error(`[${type.toUpperCase()}]`, msg, msgOrError);
    }
};

(async function () {

    async function pageLoad() {

        // On ne lance pas le script dans les notes speakers
        const inIframe = window.top != window.self;
        // On n'autorise pas tout le chargement des démos en mode restit (on affiche que la théorie)
        const dataType = document.querySelector('.slides').getAttribute('data-type');

        if (!inIframe && dataType && dataType === 'on-stage') {
             
            new PrezDemosControler();

        }

    }

    window.addEventListener('load', pageLoad);
})();