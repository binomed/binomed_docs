import {
    Reveal,
} from '../web_modules/talk-control-revealjs-extensions/talk-control-revealjs-extensions.js';
import {addOverlayWidget, removeOverlayWidget} from  './stats-overlay.js';


Reveal.addEventListener('in-gemma', ()=>{
    console.log('In Gemma');
    addMicButton();
    addOverlayWidget();
})
Reveal.addEventListener('out-gemma', ()=>{
    console.log('Out Gemma');
    removeMicButton();
    removeOverlayWidget();
})


// Variables globales pour la gestion du micro
let micButton = null;
let micState = false; // false = stopped, true = started
let clickListener = null;
let keyListener = null;



/**
 * Ajoute le bouton micro avec les listeners
 * Crée un bouton circulaire avec emoji micro et ombre portée
 */
function addMicButton() {
  try {
    // Éviter les doublons
    if (micButton) {
      console.warn('Micro button already exists');
      return;
    }

    // Création du bouton
    micButton = document.createElement('button');
    micButton.id = 'mic-button';
    micButton.innerHTML = '🎙️';
    micButton.setAttribute('aria-label', 'Toggle microphone');
    
    // Styles CSS inline pour le bouton circulaire avec ombre
    Object.assign(micButton.style, {
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
    micButton.addEventListener('mouseenter', () => {
      micButton.style.transform = 'scale(1.1)';
    });
    
    micButton.addEventListener('mouseleave', () => {
      micButton.style.transform = 'scale(1)';
    });

    // Listener pour le click
    clickListener = () => triggerMic();
    micButton.addEventListener('click', clickListener);

    // Listener pour la touche CMD gauche
    keyListener = (event) => {
      // CMD gauche : keyCode 91 ou key 'MetaLeft'
      if (event.keyCode === 91 || event.key === 'MetaLeft' || event.code === 'MetaLeft') {
        event.preventDefault();
        triggerMic();
      }
    };
    document.addEventListener('keydown', keyListener);

    // Ajout au DOM
    document.body.appendChild(micButton);
    
    console.log('Micro button added successfully');
  } catch (error) {
    console.error('Error adding micro button:', error);
  }
}

/**
 * Retire le bouton micro et nettoie les listeners
 * Supprime complètement le bouton et tous les event listeners
 */
function removeMicButton() {
  try {
    // Retrait des listeners
    if (clickListener && micButton) {
      micButton.removeEventListener('click', clickListener);
      clickListener = null;
    }
    
    if (keyListener) {
      document.removeEventListener('keydown', keyListener);
      keyListener = null;
    }

    // Retrait du bouton du DOM
    if (micButton && micButton.parentNode) {
      micButton.parentNode.removeChild(micButton);
    }
    
    // Reset des variables
    micButton = null;
    micState = false;
    
    console.log('Micro button removed successfully');
  } catch (error) {
    console.error('Error removing micro button:', error);
  }
}

/**
 * Toggle entre startMic et stopMic
 * Change l'état du micro et appelle la fonction appropriée
 */
function triggerMic() {
  try {
    if (micState) {
      stopMic();
    } else {
      startMic();
    }
    micState = !micState;
    
    // Mise à jour visuelle du bouton
    if (micButton) {
      micButton.style.backgroundColor = micState ? '#ff4444' : '#ffffff';
      micButton.style.color = micState ? '#ffffff' : '#000000';
    }
  } catch (error) {
    console.error('Error triggering mic:', error);
  }
}

/**
 * Démarre le microphone
 * À implémenter selon vos besoins spécifiques
 */
function startMic() {
  console.log('Starting microphone...');
  // TODO: Implémenter la logique de démarrage du micro
  // Exemple: navigator.mediaDevices.getUserMedia({ audio: true })
}

/**
 * Arrête le microphone  
 * À implémenter selon vos besoins spécifiques
 */
function stopMic() {
  console.log('Stopping microphone...');
  // TODO: Implémenter la logique d'arrêt du micro
  // Exemple: arrêter le stream audio
}
