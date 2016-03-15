'use strict'

let voiceEnable = false,
    voiceFR = null,
    synth = null,
    recognition = null;

function populateVoiceList(){    
    let voices= synth.getVoices();    
    for(var i = 0; i < voices.length; i++){
        if (voices[i].lang === 'fr-FR'){
            voiceFR = voices[i];
            console.log("%s, %O ",voices[i].lang, voices[i]);
        }        
    }
}

function handleVoiceResults(event){
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at position 0.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object 
  var finalStr = event.results[0][0].transcript;
  //diagnostic.textContent = 'Result received: ' + color + '.';
  //bg.style.backgroundColor = color;
  console.log('Confidence: ' + finalStr);
  if (finalStr.indexOf('suivant') != -1){
  	speak("Bonjour JF, j'ai compris que tu voulais passer au slide suivant, est ce que c'est bien ça ?")
    .then(()=>{
        recognition.start();
    })
    .catch(()=>{
        console.error("No voiceFR"); 
    });
  }else if (finalStr.indexOf('oui') != -1){
  	Reveal.next();
  }
}

function handleVoiceEnd(){
    // We detect the end of speechRecognition process
    console.log('End of recognition')
    recognition.stop();
};

// We detect errors
function handleVoiceError(event) {
    if (event.error == 'no-speech') {
        console.log('No Speech');
    }
    if (event.error == 'audio-capture') {
        console.log('No microphone')
    }
    if (event.error == 'not-allowed') {
        console.log('Not Allowed');
    }
};     

function speak(value, callbackEnd){
    return new Promise(function(resolve, reject){
        
        if (!voiceFR){
            reject();
        }
        var utterThis = new SpeechSynthesisUtterance(value);
        utterThis.voice = voiceFR;
        utterThis.pitch = 1;
        utterThis.rate = 1;
        utterThis.onend = function(){
            resolve();
        }
        synth.speak(utterThis);
    });
}


function init(socket){

    // Initialisation de la partie reconnaissance vocale
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    recognition = new SpeechRecognition();
    var grammar = '#JSGF V1.0; grammar binomed; public <binomed> = suivant | précédent | precedent | slide | diapositive | suivante | oui ;';
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'fr-FR';
    recognition.interimResults = true;
    recognition.onresult = handleVoiceResults;
    recognition.onend = handleVoiceEnd;
    recognition.onerror = handleVoiceError;

    // Initialisation de la partie synthèse vocale
    synth = window.speechSynthesis;
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    
    
    // Initialisation de la partie communuication
	socket.on('sensor', function(msg){
		if (voiceEnable && msg.type === 'voice'){
            if (msg.value === 'start'){
                recognition.start();
            }else if (msg.value === 'stop'){
                recognition.stop();
            }
		}
	});
	
	Reveal.addEventListener( 'start-webspeech', function(){
        voiceEnable = true;
        
	});

	Reveal.addEventListener( 'stop-webspeech', function(){
		voiceEnable = false;
	});

}

module.exports = {
	init : init
}