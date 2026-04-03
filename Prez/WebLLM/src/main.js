import { PrezDemosControler } from './prez-demos-controler.js';

const DEBUG = true;
// --- Utilitaires de log et UI ---
window.log = (msg, logIdElt, type = 'info', msgOrError) => {
    if (!type){
        type = 'debug';
    }
    if(type === 'info' ||  type === 'debug' && DEBUG){
        console.log(`[${type.toUpperCase()}] ${msg}`, msgOrError);
    }else if (type === 'error'){ 
        console.error(`[${type.toUpperCase()}]`, msg, msgOrError);        
    }
    
    if (logIdElt){
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] [${type.toUpperCase()}] ${msg}`;
        const logDisplay = document.getElementById(logIdElt);
        logDisplay.prepend(entry);
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