/**
 * Gère la reconnaissance de speech
 */
export class SpeechRecognitionControler{

    #recognition = null; //SpeechRecognition
    isListening = false; // true or false according to state of listening

    constructor(stateListener){
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            log("Web Speech API non supportée sur ce navigateur.", 'error');
            stateListener({state:'error', msg: 'not-availlable'})
            return;
        }

        this.#recognition = new SpeechRecognition();
        this.#recognition.interimResults = false;
        this.#recognition.maxAlternatives = 1;

    
        this.isListening = false;
    
        this.#recognition.onstart = () => {
            this.isListening = true;
            stateListener({state:'start'})
            //btnVoice.classList.add('listening');
            //btnVoice.textContent = '⏹️';
            //if (typeof log === 'function') log(`Microphone activé [${recognition.lang}], parlez maintenant...`, 'info');
        };

        this.#recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            stateListener({state:'result', msg : transcript});
            //if (typeof log === 'function') log(`Reconnaissance vocale : "${transcript}"`, 'success');
        };

        this.#recognition.onspeechend = () => {
            this.#recognition.stop();
            stateListener({state:'speechend'});
        };

        this.#recognition.onend = () => {
            this.isListening = false;
            stateListener({state:'stop'});
        };

        this.#recognition.onerror = (event) => {
            this.isListening = false;
            stateListener({state:'error', msg : event.error});            
        };
    }

    startListening(){
        if (!this.#recognition){
            return;
        }
        if (this.isListening) {
            this.#recognition.stop();
        } else {
            // Ajuster la langue de reconnaissance selon la direction
            // Si fr-en -> on parle français. Si en-fr -> on parle anglais.
            //const direction = directionSelect.value;
            //recognition.lang = direction.startsWith('fr') ? 'fr-FR' : 'en-US';
            this.#recognition.lang = 'fr-FR';
            this.#recognition.start();
        }
    }

    stopListening(){
        if (!this.#recognition){
            return;
        }
        if (this.isListening) {
            this.#recognition.stop();
        }        
    }

}

/**
 * Controler pourla gestion du micro
 */
export class MicControler{


    // Variables globales pour la gestion du micro
    #micButton = null;
    micState = false; // false = stopped, true = started
    #clickListener = null;
    #keyListener = null;
    #stateListener = null; // {state:string};

    constructor(stateListener){
        this.#stateListener = stateListener;
    }


    /**
     * Ajoute le bouton micro avec les listeners
     * Crée un bouton circulaire avec emoji micro et ombre portée
     */
    addMicButton() {
        try {
            // Éviter les doublons
            if (this.#micButton) {
                console.warn('Micro button already exists');
                return;
            }

            // Création du bouton
            this.#micButton = document.createElement('button');
            this.#micButton.id = 'mic-button';
            this.#micButton.innerHTML = '🎙️';
            this.#micButton.setAttribute('aria-label', 'Toggle microphone');
            
            // Styles CSS inline pour le bouton circulaire avec ombre
            Object.assign(this.#micButton.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#ffffff',
                fontSize: '24px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: '1000',
                transition: 'transform 0.1s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                });

            // Effet hover
            this.#micButton.addEventListener('mouseenter', () => {
                this.#micButton.style.transform = 'scale(1.1)';
            });
            
            this.#micButton.addEventListener('mouseleave', () => {
                this.#micButton.style.transform = 'scale(1)';
            });

            // Listener pour le click
            this.#clickListener = () => this.triggerMic();
            this.#micButton.addEventListener('click', this.#clickListener);

            // Listener pour la touche CMD gauche
            this.#keyListener = (event) => {
                // CMD gauche : keyCode 91 ou key 'MetaLeft'
                if (event.keyCode === 91 || event.key === 'MetaLeft' || event.code === 'MetaLeft') {
                    event.preventDefault();
                    this.triggerMic();
                }
            };
            document.addEventListener('keydown', this.#keyListener);

            // Ajout au DOM
            document.body.appendChild(this.#micButton);
            
            log('Micro button added successfully');
        } catch (error) {
            log('Error adding micro button:', 'error' ,error);
        }
    }

    /**
     * Retire le bouton micro et nettoie les listeners
     * Supprime complètement le bouton et tous les event listeners
     */
    removeMicButton() {
        try {
            // Retrait des listeners
            if (this.#clickListener && this.#micButton) {
                this.#micButton.removeEventListener('click', this.#clickListener);
                this.#clickListener = null;
            }
            
            if (this.#keyListener) {
                document.removeEventListener('keydown', this.#keyListener);
                this.#keyListener = null;
            }

            // Retrait du bouton du DOM
            if (this.#micButton && this.#micButton.parentNode) {
                this.#micButton.parentNode.removeChild(this.#micButton);
            }
            
            // Reset des variables
            this.#micButton = null;
            this.micState = false;
            
            log('Micro button removed successfully');
        } catch (error) {
            log('Error removing micro button:', error);
        }
    }

    /**
     * Toggle entre startMic et stopMic
     * Change l'état du micro et appelle la fonction appropriée
     */
    triggerMic() {
        try {
            if (this.micState) {
                this.#stopMic();
            } else {
                this.#startMic();
            }
            this.micState = !this.micState;
            
            // Mise à jour visuelle du bouton
            if (this.#micButton) {
                this.#micButton.style.backgroundColor = this.micState ? '#ff4444' : '#ffffff';
                this.#micButton.style.color = this.micState ? '#ffffff' : '#000000';
            }
        } catch (error) {
            log('Error triggering mic:', 'error', error);
        }
    }

    /**
     * Démarre le microphone
     * À implémenter selon vos besoins spécifiques
     */
    #startMic() {
        log('Starting microphone...');
        this.#stateListener({state:'start'});
    }
    
    /**
     * Arrête le microphone  
     * À implémenter selon vos besoins spécifiques
    */
   #stopMic() {
       log('Stopping microphone...');
       this.#stateListener({state:'stop'});        
    }
}