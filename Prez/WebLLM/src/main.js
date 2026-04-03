import { PrezDemosControler } from './prez-demos-controler.js';

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

        const inIframe = window.top != window.self;

        if (!inIframe) {
            new PrezDemosControler();
        }

    }

    window.addEventListener('load', pageLoad);
})();