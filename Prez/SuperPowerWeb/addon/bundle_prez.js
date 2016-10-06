(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function calculateAddress(local){
	if (local || (location.port && (location.port === "3000"))){
		return "http://localhost:8000"
	}else if (location.port && location.port === "8000"){
		return "https://binomed.fr:8000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();
var addressLocal = calculateAddress(true);
var local = location.port && location.port === "3000";

module.exports = {
	address : address,
    addressLocal : addressLocal,
	local : local
}
},{}],2:[function(require,module,exports){
'use strict'

var context = null,
	PUBLIC = 1,
	WAIT = 2,
	RESP = 3,
	publicBuffer = null,
	waitBuffer = null,
	respBuffer = null,
	currentSource = null;

try{
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
}catch(e){
	context = null;
	console.log("No WebAPI dectect");
}

function loadSound(url, bufferToUse){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			if (bufferToUse === PUBLIC){
		  		publicBuffer = buffer;
			}else if (bufferToUse === WAIT){
		  		waitBuffer = buffer;
			}else if (bufferToUse === RESP){
		  		respBuffer = buffer;
			}
		}, function(e){
			console.log('Error decoding file', e);
		});
	}
	request.send();
}

function loadPublicSound(){
	if(context)
		loadSound("assets/sounds/question_public_courte.mp3", PUBLIC);
}

function loadWaitSound(){
	if (context)
		loadSound("assets/sounds/attente_reponse_courte.mp3", WAIT);
}

function loadRespSound(){
	if (context)
		loadSound("assets/sounds/bonne_reponse.mp3", RESP);
}

function playSound(buffer){
	var source = context.createBufferSource(); // creates a sound source
	source.buffer = buffer;                    // tell the source which sound to play
	source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	source.start(0);                           // play the source now
	return source;
}

loadPublicSound();
loadWaitSound();
loadRespSound();

/*****************************
******************************
* Apis exposed
******************************
******************************
*/

function playPublic(){
	if (context){
		stop();
		currentSource = playSound(publicBuffer);
	}
}

function playWait(){
	if (context){
		stop();
		currentSource = playSound(waitBuffer);
	}
}

function playResp(){
	if (context){
		stop();
		currentSource = playSound(respBuffer);
	}
}

function stop(){
	if (currentSource && currentSource.stop){
		currentSource.stop(0);
	}
}



module.exports = {
	playPublic : playPublic,
	playWait : playWait,
	playResp : playResp,
	stop : stop
}
},{}],3:[function(require,module,exports){
'use strict'

var config = require('../config/config'),
	audio = require('./audio'),
	socket = null,
	scoreIndex = {};



function hideQuestion(){	
	audio.stop();
	socket.emit('config',{
		type : 'game',
		eventType : 'hideQuestion'
	});
}

function changeQuestion(index){
	audio.playPublic();
	socket.emit('config',{
		type : 'game',
		eventType : 'changeQuestion',
		'index' : index,
		repA : document.querySelector(`[data-state=question-${index}] .resp.repA`).innerHTML,
		repB : document.querySelector(`[data-state=question-${index}] .resp.repB`).innerHTML,
		repC : document.querySelector(`[data-state=question-${index}] .resp.repC`).innerHTML,
		repD : document.querySelector(`[data-state=question-${index}] .resp.repD`).innerHTML,

	});
	socket.emit('config',{
		type : 'game',
		eventType : 'showNotification'		

	});
}

function processScore(index){
	let myHeaders = new Headers();
	let myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'cors',
           cache: 'default' };

	let myRequest = new Request(`${config.address}/score/${index}`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		audio.playWait();
		// On ne retraire pas une question déjà traitée
		if (scoreIndex[`question_${index}`]){
			return;
		}
		
		let total = json.repA + json.repB + json.repC + json.repD;
		var ctx = document.getElementById(`chart_question_${index}`).getContext("2d");

		var data = {
		    labels: ["A", "B", "C", "D"],
		    datasets: [
		        {
		            label: "A",
		            fillColor: "rgba(220,220,220,0.5)",
		            strokeColor: "rgba(220,220,220,0.8)",
		            highlightFill: "rgba(220,220,220,0.75)",
		            highlightStroke: "rgba(220,220,220,1)",
		            data: [Math.round((json.repA / total) * 100), 
		            		Math.round((json.repB / total) * 100), 
		            		Math.round((json.repC / total) * 100), 
		            		Math.round((json.repD / total) * 100)]
		        }
		    ]
		};
		var myBarChart = new Chart(ctx).Bar(data, {
			 //Boolean - Whether grid lines are shown across the chart
	    	scaleShowGridLines : false,
	    	// String - Scale label font colour
	    	scaleFontColor: "orange",
		});

		setTimeout(function() {
			audio.playResp();
			let goodAnswerElt = document.querySelector(`[data-state=resp-question-${index}] .resp.good`);
			let anwser = goodAnswerElt.classList.contains('repA') ? 'A' :
						 goodAnswerElt.classList.contains('repB') ? 'B' :
						 goodAnswerElt.classList.contains('repC') ? 'C' : 'D';
			socket.emit('config',{
				type : 'game',
				eventType : 'answer',
				value : anwser
			});			 
			goodAnswerElt.classList.add('show');
			if (index === 4){
				setTimeout(function() {
					socket.emit('config',{
						type : 'game',
						eventType : 'calculateWinners',
						numberWinners : 2,
						value : anwser
					});		
				}, 1000);
			}
		}, 5000);


	});
}

function init(socketToSet){
	socket = socketToSet;
	hideQuestion();

	Reveal.addEventListener('question-1', function(){
		changeQuestion(1);
	});
	Reveal.addEventListener('resp-question-1', function(){
		hideQuestion();
		processScore(1);
	});

	Reveal.addEventListener('question-2', function(){
		changeQuestion(2);
	});
	Reveal.addEventListener('resp-question-2', function(){
		hideQuestion();
		processScore(2);
	});

	Reveal.addEventListener('question-3', function(){
		changeQuestion(3);
	});
	Reveal.addEventListener('resp-question-3', function(){
		hideQuestion();
		processScore(3);
	});

	Reveal.addEventListener('question-4', function(){
		changeQuestion(4);
	});
	Reveal.addEventListener('resp-question-4', function(){
		hideQuestion();
		processScore(4);
	});


	Reveal.addEventListener('quit-question', hideQuestion);

}

module.exports = {
	init : init
}
},{"../config/config":1,"./audio":2}],4:[function(require,module,exports){
'use strict'

function managementCodeConnect(){

	var eltHiglight = document.querySelector('#highlight-connect-ble');

	function progressFragment(event){
		// event.fragment // the dom element fragment
		console.log(event);
		if (event.type === 'fragmentshown'){

		}else {

		}
	}

	function listenFragments(){
		Reveal.addEventListener('fragmentshown', progressFragment);
		Reveal.addEventListener('fragmenthidden', progressFragment);
	}

	function unregisterFragments(){
		Reveal.removeEventListener('fragmentshown', progressFragment);
		Reveal.removeEventListener('fragmenthidden', progressFragment);
	}

	Reveal.addEventListener('code-connect-ble', function(){
		listenFragments();
	});
	Reveal.addEventListener('stop-code-connect-ble', function(){
		unregisterFragments();
	});
	
}

function init(){

	managementCodeConnect();

}

module.exports = {
	init : init
};
},{}],5:[function(require,module,exports){
'use strict'

var config = require('./config/config');

function postProdCodeHilight(){
	var array = document.querySelectorAll('code.toHilight');
	for (var i =0; i <array.length; i++){
		var length = 0;
		var textCode = array[i].innerHTML;
		do{
			length = textCode.length;
			textCode = textCode.replace('&lt;mark&gt;', '<mark>');
			textCode = textCode.replace('&lt;mark class="dilluate"&gt;', '<mark class="dilluate">');
			textCode = textCode.replace('&lt;/mark&gt;', '</mark>');
		}while(length != textCode.length);
		array[i].innerHTML = textCode;

	}
}

Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
	console.log('RevealJS Ready');
    
	setTimeout(function() {
    	postProdCodeHilight();
	}, 500);
	
	let inIFrame = window.top != window.self;
	
    
	if (!inIFrame && io && config.address){
        console.log("Go to condition !");
		let socketGame = io.connect(config.address);
		require('./game/prez_game').init(socketGame);
		let socketPrez = null;
		let socketPrezLocal = null;
		if (config.local){
			socketPrez = socketGame;   
		}else{
			socketPrez = io.connect(config.address);
			socketPrezLocal = io.connect(config.addressLocal);
		}
 
 		//setTimeout(function() {
             console.log("Before light");
			require('./sensors/light').init(socketPrez, socketPrezLocal);
             console.log("Before Orientation");
			require('./sensors/orientation').init(socketPrez, socketPrezLocal);
             console.log("Before DeviceMotion");
			require('./sensors/devicemotion').init(socketPrez, socketPrezLocal);
             console.log("Before Voice");
			require('./sensors/voice').init(socketPrez, socketPrezLocal);
             console.log("Before UserMedia");
			require('./sensors/usermedia').init(socketPrez, socketPrezLocal);
 			
 		//}, 1000);
	}	

	require('./highlights/highlightsCode').init();
 
	
} );

},{"./config/config":1,"./game/prez_game":3,"./highlights/highlightsCode":4,"./sensors/devicemotion":6,"./sensors/light":7,"./sensors/orientation":8,"./sensors/usermedia":9,"./sensors/voice":10}],6:[function(require,module,exports){
'use strict'

let motionEnable = false,
    motionElt = null,
    battery1Elt = null,
    battery2Elt = null,
    chargeBattery1 = 0,
    chargeBattery2 = 0,
    winner = null,
    fullValue1 = 10000,
    fullValue2 = 10000,
    mapUsersActiv = {};




function batUpdate(team, charge) {
    let col = [],
        elt = null;
    if (team === "1") {
        elt = battery1Elt;
        // Red - Danger!
        col = ["#750900", "#c6462b", "#b74424", "#df0a00", "#590700"];
    } /*else if (charge < 40) {
    // Yellow - Might wanna charge soon...
    col = ["#754f00", "#f2bb00", "#dbb300", "#df8f00", "#593c00"];
  } */else {
        elt = battery2Elt;
        // Green - All good!
        col = ["#316d08", "#60b939", "#51aa31", "#64ce11", "#255405"];
    }
    elt.style["background-image"] = "linear-gradient(to right, transparent 5%, " + col[0] + " 5%, " + col[0] + " 7%, " + col[1] + " 8%, " + col[1] + " 10%, " + col[2] + " 11%, " + col[2] + " " + (charge - 3) + "%, " + col[3] + " " + (charge - 2) + "%, " + col[3] + " " + charge + "%, " + col[4] + " " + charge + "%, black " + (charge + 5) + "%, black 95%, transparent 95%), linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) 4%, rgba(255,255,255,0.2) 7%, rgba(255,255,255,0.2) 14%, rgba(255,255,255,0.8) 14%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 41%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.4) 86%, rgba(255,255,255,0.6) 90%, rgba(255,255,255,0.1) 92%, rgba(255,255,255,0.1) 95%, rgba(255,255,255,0.5) 98%)";
}


function init(socket, socketLocal) {

    function callBackSensor(msg) {
        if (motionEnable && msg.type === 'devicemotion') {
            if (!winner && msg.team) {
                let tmpUserTeam = mapUsersActiv[msg.id];
                if (!tmpUserTeam) {
                    mapUsersActiv[msg.id] = msg.team;
                    if (msg.team === "1") {
                        fullValue1 += 10000;
                    } else if (msg.team === "2") {
                        fullValue2 += 10000;
                    }
                }
                let percent = 0;
                if (msg.team === "1") {
                    chargeBattery1 += msg.value;
                    percent = Math.round((chargeBattery1 / fullValue1) * 100);
                } else {
                    chargeBattery2 += msg.value;
                    percent = Math.round((chargeBattery2 / fullValue2) * 100);
                }

                batUpdate(msg.team, Math.min(percent, 90));
                if (!winner && Math.min(percent, 90) === 90) {
                    winner = true;
                    if (msg.team === "1") {
                        document.querySelector('.devicemotion .win.firefox').classList.add("show");
                    } else {
                        document.querySelector('.devicemotion .win.chrome').classList.add("show");
                    }
                }
            }

        }
    }

    socket.on('sensor', callBackSensor);
    if (socketLocal) {
        socketLocal.on('sensor', callBackSensor);
    }
    battery1Elt = document.querySelector('#battery-1');
    battery2Elt = document.querySelector('#battery-2');

    batUpdate("1", 0);
    batUpdate("2", 0);

    Reveal.addEventListener('start-devicemotion', function() {
        socket.emit('config', {
            type: "game",
            eventType: "battery",
            show: true
        });
        motionEnable = true;
    });

    Reveal.addEventListener('stop-devicemotion', function() {
        socket.emit('config', {
            type: "game",
            eventType: "battery",
            show: false
        });
        motionEnable = false;
    });

}

module.exports = {
    init: init
}
},{}],7:[function(require,module,exports){
'use strict'

let lightEnable = false,
	lightElt = null;


// We update the css Style
function updateLight(data){
	let prefixLight = '-webkit-';
	let percent = data;
	var style = prefixLight+'radial-gradient(center, '
	    +' ellipse cover, '
	    +' rgba(198,197,145,1) 0%,'
	    +' rgba(0,0,0,1) '+percent+'%)'
	    ;
	lightElt.style.background = style;
}

function init(socket, socketLocal){

    function callBackSensor(msg){
		if (lightEnable && msg.type === 'light'){
			updateLight(msg.value);
		}
	}

	socket.on('sensor', callBackSensor);
    if (socketLocal){
	    socketLocal.on('sensor', callBackSensor);
    }
	lightElt = document.querySelector('.light-bg');

	Reveal.addEventListener( 'start-light', function(){
		lightEnable = true;
	});

	Reveal.addEventListener( 'stop-light', function(){
		lightEnable = false;
	});

}

module.exports = {
	init : init
}
},{}],8:[function(require,module,exports){
'use strict'

let orientationEnable = false, 
	lockElt = null,
	resElt = null,
	open = false;

const values = { first : {value: 50, found: false}, 
				second : {value: 80, found: false}, 
				third : {value : 10, found : false}
			};


// According to the number of unlock, we just turn the image or we open the door
function updateRotation(zAlpha, firstValue){
	if (!open){
		let delta = firstValue - zAlpha;
		let rotation = delta;
		if (delta < 0){
			rotation = firstValue+360-zAlpha;
		}		
		lockElt.style.transform = 'rotateZ('+rotation+'deg)';

		let currentValue = 100 - Math.round((rotation*100)/360);
		resElt.innerHTML = currentValue;
		if (values.first.found 
			&& values.second.found
			&& values.third.found){			
			open = true;
			document.querySelector('.sensorExample .orientation').classList.add("open");
		}else if (!values.first.found) {
			if (currentValue === values.first.value){				
				let iElt = document.querySelector('.sensorExample .orientation .resp .chevrons .first');
				iElt.classList.remove("fa-times-circle");
				iElt.classList.add("fa-chevron-down");
				values.first.found = true;
			}
		}else if (!values.second.found) {
			if (currentValue === values.second.value){
				let iElt = document.querySelector('.sensorExample .orientation .resp .chevrons .second');
				iElt.classList.remove("fa-times-circle");
				iElt.classList.add("fa-chevron-down");
				values.second.found = true;
			}
		}else if (!values.third.found) {
			if (currentValue === values.third.value){
				let iElt = document.querySelector('.sensorExample .orientation .resp .chevrons .third');
				iElt.classList.remove("fa-times-circle");
				iElt.classList.add("fa-chevron-down");
				values.third.found = true;
			}
		}
	}
	
}

function init(socket, socketLocal){

    function callBackSensor(msg){
		if (orientationEnable && msg.type === 'orientation'){
			updateRotation(msg.value, msg.firstValue);
		}
	}

	socket.on('sensor', callBackSensor);
    if(socketLocal){
	    socketLocal.on('sensor', callBackSensor);
    }

	lockElt = document.querySelector('.safe_lock');
	resElt = document.querySelector('.orientation .resp .value');

	Reveal.addEventListener( 'start-orientation', function(){
		orientationEnable = true;
	});

	Reveal.addEventListener( 'stop-orientation', function(){
		orientationEnable = false;
	});	

}


module.exports = {
	init : init
};
},{}],9:[function(require,module,exports){
'use strict'

let usermediaEnable = false,
    usermediaElt = null;



function init(socket, socketLocal) {

    function callBackSensor(msg) {
        if (usermediaEnable && msg.type === 'usermedia') {
            document.getElementById('photoStream').setAttribute('src', msg.value);
        }
    }

    socket.on('sensor', callBackSensor);

    if (socketLocal) {
        socketLocal.on('sensor', callBackSensor);
    }
    usermediaElt = document.querySelector('.usermedia-bg');

    Reveal.addEventListener('start-usermedia', function() {
        usermediaEnable = true;
    });

    Reveal.addEventListener('stop-usermedia', function() {
        usermediaEnable = false;
    });

}

module.exports = {
    init: init
}
},{}],10:[function(require,module,exports){
'use strict'

let voiceEnable = false,
    voiceFR = null,
    synth = null,
    recognition = null,
    recognitionDone = false,
    nextSlide = false,
    eltMic = null,
    inputMic = null
    ;

function populateVoiceList() {
    let voices = synth.getVoices();
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang === 'fr-FR') {
            voiceFR = voices[i];
            console.log("%s, %O ", voices[i].lang, voices[i]);
        }
    }
}

function handleVoiceResults(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var finalStr = event.results[0][0].transcript;
    inputMic.innerHTML = finalStr;
    //diagnostic.textContent = 'Result received: ' + color + '.';
    //bg.style.backgroundColor = color;
    console.log('Confidence: ' + finalStr);
    if (finalStr.indexOf('suivant') != -1) {
        recognition.stop();
        if (!recognitionDone) {
            recognitionDone = true;
            speak("Bonjour JF, j'ai compris que tu voulais passer au slide suivant, ais je bien compris ?")
                .then(() => {
                    console.log("Fin de speech")
                    recognition.start();
                    eltMic.style.display = '';
                })
                .catch((e) => {
                    console.error(e);
                    console.error("No voiceFR");
                });
        }
    } else if (finalStr.indexOf('oui') != -1) {
        if (!nextSlide) {
            nextSlide = true;
            Reveal.next();
        }
    }
}

function handleVoiceEnd() {
    // We detect the end of speechRecognition process
    console.log('End of recognition')
    recognition.stop();
    eltMic.style.display = 'none';
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

function speak(value, callbackEnd) {
    return new Promise(function(resolve, reject) {

        if (!voiceFR) {
            reject();
        }
        var utterThis = new SpeechSynthesisUtterance(value);
        utterThis.voice = voiceFR;
        utterThis.pitch = 1;
        utterThis.rate = 1;
        utterThis.onend = function() {
            resolve();
        }
        synth.speak(utterThis);
    });
}


function init(socket, socketLocal) {

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

    function callBackSensor(msg) {
        if (voiceEnable && msg.type === 'voice') {
            if (msg.value === 'start') {
                if (!eltMic) {
                    eltMic = document.getElementById('demoSpeech');
                    inputMic = document.getElementById('speech_input');
                }
                eltMic.style.display = '';
                recognition.start();
            } else if (msg.value === 'stop') {
                recognition.stop();
                eltMic.style.display = 'none';
            }
        }
    }

    // Initialisation de la partie communuication
    socket.on('sensor', callBackSensor);
    if (socketLocal) {
        socketLocal.on('sensor', callBackSensor);
    }

    Reveal.addEventListener('start-webspeech', function() {
        voiceEnable = true;

    });

    Reveal.addEventListener('stop-webspeech', function() {
        voiceEnable = false;
        if (recognition) {
            recognition.stop();
            eltMic.style.display = 'none';
        }
    });

}

module.exports = {
    init: init
}
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovcHJlel9zdXBlcl9wb3dlci5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvb3JpZW50YXRpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy92b2ljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZUFkZHJlc3MobG9jYWwpe1xyXG5cdGlmIChsb2NhbCB8fCAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKSl7XHJcblx0XHRyZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxyXG5cdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiODAwMFwiKXtcclxuXHRcdHJldHVybiBcImh0dHBzOi8vYmlub21lZC5mcjo4MDAwXCI7XHJcblx0fWVsc2V7XHJcblx0XHRyZXR1cm4gbnVsbDtcdFxyXG5cdH0gXHJcbn1cclxuXHJcbnZhciBhZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcygpO1xyXG52YXIgYWRkcmVzc0xvY2FsID0gY2FsY3VsYXRlQWRkcmVzcyh0cnVlKTtcclxudmFyIGxvY2FsID0gbG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjMwMDBcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGFkZHJlc3MgOiBhZGRyZXNzLFxyXG4gICAgYWRkcmVzc0xvY2FsIDogYWRkcmVzc0xvY2FsLFxyXG5cdGxvY2FsIDogbG9jYWxcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGNvbnRleHQgPSBudWxsLFxyXG5cdFBVQkxJQyA9IDEsXHJcblx0V0FJVCA9IDIsXHJcblx0UkVTUCA9IDMsXHJcblx0cHVibGljQnVmZmVyID0gbnVsbCxcclxuXHR3YWl0QnVmZmVyID0gbnVsbCxcclxuXHRyZXNwQnVmZmVyID0gbnVsbCxcclxuXHRjdXJyZW50U291cmNlID0gbnVsbDtcclxuXHJcbnRyeXtcclxuXHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xyXG5cdGNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XHJcbn1jYXRjaChlKXtcclxuXHRjb250ZXh0ID0gbnVsbDtcclxuXHRjb25zb2xlLmxvZyhcIk5vIFdlYkFQSSBkZWN0ZWN0XCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU291bmQodXJsLCBidWZmZXJUb1VzZSl7XHJcblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG5cclxuXHQvLyBEZWNvZGUgYXN5bmNocm9ub3VzbHlcclxuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKSB7XHJcblx0XHRcdGlmIChidWZmZXJUb1VzZSA9PT0gUFVCTElDKXtcclxuXHRcdCAgXHRcdHB1YmxpY0J1ZmZlciA9IGJ1ZmZlcjtcclxuXHRcdFx0fWVsc2UgaWYgKGJ1ZmZlclRvVXNlID09PSBXQUlUKXtcclxuXHRcdCAgXHRcdHdhaXRCdWZmZXIgPSBidWZmZXI7XHJcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gUkVTUCl7XHJcblx0XHQgIFx0XHRyZXNwQnVmZmVyID0gYnVmZmVyO1xyXG5cdFx0XHR9XHJcblx0XHR9LCBmdW5jdGlvbihlKXtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGRlY29kaW5nIGZpbGUnLCBlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRyZXF1ZXN0LnNlbmQoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFB1YmxpY1NvdW5kKCl7XHJcblx0aWYoY29udGV4dClcclxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvcXVlc3Rpb25fcHVibGljX2NvdXJ0ZS5tcDNcIiwgUFVCTElDKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFdhaXRTb3VuZCgpe1xyXG5cdGlmIChjb250ZXh0KVxyXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9hdHRlbnRlX3JlcG9uc2VfY291cnRlLm1wM1wiLCBXQUlUKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFJlc3BTb3VuZCgpe1xyXG5cdGlmIChjb250ZXh0KVxyXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9ib25uZV9yZXBvbnNlLm1wM1wiLCBSRVNQKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGxheVNvdW5kKGJ1ZmZlcil7XHJcblx0dmFyIHNvdXJjZSA9IGNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7IC8vIGNyZWF0ZXMgYSBzb3VuZCBzb3VyY2VcclxuXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyOyAgICAgICAgICAgICAgICAgICAgLy8gdGVsbCB0aGUgc291cmNlIHdoaWNoIHNvdW5kIHRvIHBsYXlcclxuXHRzb3VyY2UuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKTsgICAgICAgLy8gY29ubmVjdCB0aGUgc291cmNlIHRvIHRoZSBjb250ZXh0J3MgZGVzdGluYXRpb24gKHRoZSBzcGVha2VycylcclxuXHRzb3VyY2Uuc3RhcnQoMCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGxheSB0aGUgc291cmNlIG5vd1xyXG5cdHJldHVybiBzb3VyY2U7XHJcbn1cclxuXHJcbmxvYWRQdWJsaWNTb3VuZCgpO1xyXG5sb2FkV2FpdFNvdW5kKCk7XHJcbmxvYWRSZXNwU291bmQoKTtcclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiBBcGlzIGV4cG9zZWRcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gcGxheVB1YmxpYygpe1xyXG5cdGlmIChjb250ZXh0KXtcclxuXHRcdHN0b3AoKTtcclxuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQocHVibGljQnVmZmVyKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXlXYWl0KCl7XHJcblx0aWYgKGNvbnRleHQpe1xyXG5cdFx0c3RvcCgpO1xyXG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZCh3YWl0QnVmZmVyKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXlSZXNwKCl7XHJcblx0aWYgKGNvbnRleHQpe1xyXG5cdFx0c3RvcCgpO1xyXG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZChyZXNwQnVmZmVyKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0b3AoKXtcclxuXHRpZiAoY3VycmVudFNvdXJjZSAmJiBjdXJyZW50U291cmNlLnN0b3Ape1xyXG5cdFx0Y3VycmVudFNvdXJjZS5zdG9wKDApO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRwbGF5UHVibGljIDogcGxheVB1YmxpYyxcclxuXHRwbGF5V2FpdCA6IHBsYXlXYWl0LFxyXG5cdHBsYXlSZXNwIDogcGxheVJlc3AsXHJcblx0c3RvcCA6IHN0b3BcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZy9jb25maWcnKSxcclxuXHRhdWRpbyA9IHJlcXVpcmUoJy4vYXVkaW8nKSxcclxuXHRzb2NrZXQgPSBudWxsLFxyXG5cdHNjb3JlSW5kZXggPSB7fTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaGlkZVF1ZXN0aW9uKCl7XHRcclxuXHRhdWRpby5zdG9wKCk7XHJcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xyXG5cdFx0dHlwZSA6ICdnYW1lJyxcclxuXHRcdGV2ZW50VHlwZSA6ICdoaWRlUXVlc3Rpb24nXHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoYW5nZVF1ZXN0aW9uKGluZGV4KXtcclxuXHRhdWRpby5wbGF5UHVibGljKCk7XHJcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xyXG5cdFx0dHlwZSA6ICdnYW1lJyxcclxuXHRcdGV2ZW50VHlwZSA6ICdjaGFuZ2VRdWVzdGlvbicsXHJcblx0XHQnaW5kZXgnIDogaW5kZXgsXHJcblx0XHRyZXBBIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEFgKS5pbm5lckhUTUwsXHJcblx0XHRyZXBCIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEJgKS5pbm5lckhUTUwsXHJcblx0XHRyZXBDIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcENgKS5pbm5lckhUTUwsXHJcblx0XHRyZXBEIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcERgKS5pbm5lckhUTUwsXHJcblxyXG5cdH0pO1xyXG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcclxuXHRcdHR5cGUgOiAnZ2FtZScsXHJcblx0XHRldmVudFR5cGUgOiAnc2hvd05vdGlmaWNhdGlvbidcdFx0XHJcblxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzU2NvcmUoaW5kZXgpe1xyXG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG5cdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxyXG4gICAgICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XHJcblxyXG5cdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtjb25maWcuYWRkcmVzc30vc2NvcmUvJHtpbmRleH1gLG15SW5pdCk7XHJcblx0ZmV0Y2gobXlSZXF1ZXN0KVxyXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0fSlcclxuXHQudGhlbihmdW5jdGlvbihqc29uKXtcclxuXHRcdGF1ZGlvLnBsYXlXYWl0KCk7XHJcblx0XHQvLyBPbiBuZSByZXRyYWlyZSBwYXMgdW5lIHF1ZXN0aW9uIGTDqWrDoCB0cmFpdMOpZVxyXG5cdFx0aWYgKHNjb3JlSW5kZXhbYHF1ZXN0aW9uXyR7aW5kZXh9YF0pe1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGxldCB0b3RhbCA9IGpzb24ucmVwQSArIGpzb24ucmVwQiArIGpzb24ucmVwQyArIGpzb24ucmVwRDtcclxuXHRcdHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY2hhcnRfcXVlc3Rpb25fJHtpbmRleH1gKS5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5cdFx0dmFyIGRhdGEgPSB7XHJcblx0XHQgICAgbGFiZWxzOiBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCJdLFxyXG5cdFx0ICAgIGRhdGFzZXRzOiBbXHJcblx0XHQgICAgICAgIHtcclxuXHRcdCAgICAgICAgICAgIGxhYmVsOiBcIkFcIixcclxuXHRcdCAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNSlcIixcclxuXHRcdCAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC44KVwiLFxyXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0RmlsbDogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNzUpXCIsXHJcblx0XHQgICAgICAgICAgICBoaWdobGlnaHRTdHJva2U6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxyXG5cdFx0ICAgICAgICAgICAgZGF0YTogW01hdGgucm91bmQoKGpzb24ucmVwQSAvIHRvdGFsKSAqIDEwMCksIFxyXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQiAvIHRvdGFsKSAqIDEwMCksIFxyXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQyAvIHRvdGFsKSAqIDEwMCksIFxyXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwRCAvIHRvdGFsKSAqIDEwMCldXHJcblx0XHQgICAgICAgIH1cclxuXHRcdCAgICBdXHJcblx0XHR9O1xyXG5cdFx0dmFyIG15QmFyQ2hhcnQgPSBuZXcgQ2hhcnQoY3R4KS5CYXIoZGF0YSwge1xyXG5cdFx0XHQgLy9Cb29sZWFuIC0gV2hldGhlciBncmlkIGxpbmVzIGFyZSBzaG93biBhY3Jvc3MgdGhlIGNoYXJ0XHJcblx0ICAgIFx0c2NhbGVTaG93R3JpZExpbmVzIDogZmFsc2UsXHJcblx0ICAgIFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBjb2xvdXJcclxuXHQgICAgXHRzY2FsZUZvbnRDb2xvcjogXCJvcmFuZ2VcIixcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGF1ZGlvLnBsYXlSZXNwKCk7XHJcblx0XHRcdGxldCBnb29kQW5zd2VyRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cmVzcC1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AuZ29vZGApO1xyXG5cdFx0XHRsZXQgYW53c2VyID0gZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEEnKSA/ICdBJyA6XHJcblx0XHRcdFx0XHRcdCBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQicpID8gJ0InIDpcclxuXHRcdFx0XHRcdFx0IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBDJykgPyAnQycgOiAnRCc7XHJcblx0XHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcclxuXHRcdFx0XHR0eXBlIDogJ2dhbWUnLFxyXG5cdFx0XHRcdGV2ZW50VHlwZSA6ICdhbnN3ZXInLFxyXG5cdFx0XHRcdHZhbHVlIDogYW53c2VyXHJcblx0XHRcdH0pO1x0XHRcdCBcclxuXHRcdFx0Z29vZEFuc3dlckVsdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblx0XHRcdGlmIChpbmRleCA9PT0gNCl7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcclxuXHRcdFx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcclxuXHRcdFx0XHRcdFx0ZXZlbnRUeXBlIDogJ2NhbGN1bGF0ZVdpbm5lcnMnLFxyXG5cdFx0XHRcdFx0XHRudW1iZXJXaW5uZXJzIDogMixcclxuXHRcdFx0XHRcdFx0dmFsdWUgOiBhbndzZXJcclxuXHRcdFx0XHRcdH0pO1x0XHRcclxuXHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSwgNTAwMCk7XHJcblxyXG5cclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdChzb2NrZXRUb1NldCl7XHJcblx0c29ja2V0ID0gc29ja2V0VG9TZXQ7XHJcblx0aGlkZVF1ZXN0aW9uKCk7XHJcblxyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0xJywgZnVuY3Rpb24oKXtcclxuXHRcdGNoYW5nZVF1ZXN0aW9uKDEpO1xyXG5cdH0pO1xyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xyXG5cdFx0aGlkZVF1ZXN0aW9uKCk7XHJcblx0XHRwcm9jZXNzU2NvcmUoMSk7XHJcblx0fSk7XHJcblxyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcclxuXHRcdGNoYW5nZVF1ZXN0aW9uKDIpO1xyXG5cdH0pO1xyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTInLCBmdW5jdGlvbigpe1xyXG5cdFx0aGlkZVF1ZXN0aW9uKCk7XHJcblx0XHRwcm9jZXNzU2NvcmUoMik7XHJcblx0fSk7XHJcblxyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0zJywgZnVuY3Rpb24oKXtcclxuXHRcdGNoYW5nZVF1ZXN0aW9uKDMpO1xyXG5cdH0pO1xyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTMnLCBmdW5jdGlvbigpe1xyXG5cdFx0aGlkZVF1ZXN0aW9uKCk7XHJcblx0XHRwcm9jZXNzU2NvcmUoMyk7XHJcblx0fSk7XHJcblxyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi00JywgZnVuY3Rpb24oKXtcclxuXHRcdGNoYW5nZVF1ZXN0aW9uKDQpO1xyXG5cdH0pO1xyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTQnLCBmdW5jdGlvbigpe1xyXG5cdFx0aGlkZVF1ZXN0aW9uKCk7XHJcblx0XHRwcm9jZXNzU2NvcmUoNCk7XHJcblx0fSk7XHJcblxyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVpdC1xdWVzdGlvbicsIGhpZGVRdWVzdGlvbik7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0IDogaW5pdFxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5mdW5jdGlvbiBtYW5hZ2VtZW50Q29kZUNvbm5lY3QoKXtcclxuXHJcblx0dmFyIGVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hpZ2hsaWdodC1jb25uZWN0LWJsZScpO1xyXG5cclxuXHRmdW5jdGlvbiBwcm9ncmVzc0ZyYWdtZW50KGV2ZW50KXtcclxuXHRcdC8vIGV2ZW50LmZyYWdtZW50IC8vIHRoZSBkb20gZWxlbWVudCBmcmFnbWVudFxyXG5cdFx0Y29uc29sZS5sb2coZXZlbnQpO1xyXG5cdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJyl7XHJcblxyXG5cdFx0fWVsc2Uge1xyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxpc3RlbkZyYWdtZW50cygpe1xyXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBwcm9ncmVzc0ZyYWdtZW50KTtcclxuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHByb2dyZXNzRnJhZ21lbnQpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdW5yZWdpc3RlckZyYWdtZW50cygpe1xyXG5cdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBwcm9ncmVzc0ZyYWdtZW50KTtcclxuXHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHByb2dyZXNzRnJhZ21lbnQpO1xyXG5cdH1cclxuXHJcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvZGUtY29ubmVjdC1ibGUnLCBmdW5jdGlvbigpe1xyXG5cdFx0bGlzdGVuRnJhZ21lbnRzKCk7XHJcblx0fSk7XHJcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AtY29kZS1jb25uZWN0LWJsZScsIGZ1bmN0aW9uKCl7XHJcblx0XHR1bnJlZ2lzdGVyRnJhZ21lbnRzKCk7XHJcblx0fSk7XHJcblx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKXtcclxuXHJcblx0bWFuYWdlbWVudENvZGVDb25uZWN0KCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0IDogaW5pdFxyXG59OyIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZycpO1xyXG5cclxuZnVuY3Rpb24gcG9zdFByb2RDb2RlSGlsaWdodCgpe1xyXG5cdHZhciBhcnJheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvZGUudG9IaWxpZ2h0Jyk7XHJcblx0Zm9yICh2YXIgaSA9MDsgaSA8YXJyYXkubGVuZ3RoOyBpKyspe1xyXG5cdFx0dmFyIGxlbmd0aCA9IDA7XHJcblx0XHR2YXIgdGV4dENvZGUgPSBhcnJheVtpXS5pbm5lckhUTUw7XHJcblx0XHRkb3tcclxuXHRcdFx0bGVuZ3RoID0gdGV4dENvZGUubGVuZ3RoO1xyXG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrJmd0OycsICc8bWFyaz4nKTtcclxuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7bWFyayBjbGFzcz1cImRpbGx1YXRlXCImZ3Q7JywgJzxtYXJrIGNsYXNzPVwiZGlsbHVhdGVcIj4nKTtcclxuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7L21hcmsmZ3Q7JywgJzwvbWFyaz4nKTtcclxuXHRcdH13aGlsZShsZW5ndGggIT0gdGV4dENvZGUubGVuZ3RoKTtcclxuXHRcdGFycmF5W2ldLmlubmVySFRNTCA9IHRleHRDb2RlO1xyXG5cclxuXHR9XHJcbn1cclxuXHJcblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVhZHknLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcbiAgICAvLyBldmVudC5jdXJyZW50U2xpZGUsIGV2ZW50LmluZGV4aCwgZXZlbnQuaW5kZXh2XHJcblx0Y29uc29sZS5sb2coJ1JldmVhbEpTIFJlYWR5Jyk7XHJcbiAgICBcclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgXHRwb3N0UHJvZENvZGVIaWxpZ2h0KCk7XHJcblx0fSwgNTAwKTtcclxuXHRcclxuXHRsZXQgaW5JRnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xyXG5cdFxyXG4gICAgXHJcblx0aWYgKCFpbklGcmFtZSAmJiBpbyAmJiBjb25maWcuYWRkcmVzcyl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJHbyB0byBjb25kaXRpb24gIVwiKTtcclxuXHRcdGxldCBzb2NrZXRHYW1lID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XHJcblx0XHRyZXF1aXJlKCcuL2dhbWUvcHJlel9nYW1lJykuaW5pdChzb2NrZXRHYW1lKTtcclxuXHRcdGxldCBzb2NrZXRQcmV6ID0gbnVsbDtcclxuXHRcdGxldCBzb2NrZXRQcmV6TG9jYWwgPSBudWxsO1xyXG5cdFx0aWYgKGNvbmZpZy5sb2NhbCl7XHJcblx0XHRcdHNvY2tldFByZXogPSBzb2NrZXRHYW1lOyAgIFxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHNvY2tldFByZXogPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcclxuXHRcdFx0c29ja2V0UHJlekxvY2FsID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzc0xvY2FsKTtcclxuXHRcdH1cclxuIFxyXG4gXHRcdC8vc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIGxpZ2h0XCIpO1xyXG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBPcmllbnRhdGlvblwiKTtcclxuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL29yaWVudGF0aW9uJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgRGV2aWNlTW90aW9uXCIpO1xyXG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvZGV2aWNlbW90aW9uJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgVm9pY2VcIik7XHJcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIFVzZXJNZWRpYVwiKTtcclxuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL3VzZXJtZWRpYScpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcclxuIFx0XHRcdFxyXG4gXHRcdC8vfSwgMTAwMCk7XHJcblx0fVx0XHJcblxyXG5cdHJlcXVpcmUoJy4vaGlnaGxpZ2h0cy9oaWdobGlnaHRzQ29kZScpLmluaXQoKTtcclxuIFxyXG5cdFxyXG59ICk7XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxubGV0IG1vdGlvbkVuYWJsZSA9IGZhbHNlLFxyXG4gICAgbW90aW9uRWx0ID0gbnVsbCxcclxuICAgIGJhdHRlcnkxRWx0ID0gbnVsbCxcclxuICAgIGJhdHRlcnkyRWx0ID0gbnVsbCxcclxuICAgIGNoYXJnZUJhdHRlcnkxID0gMCxcclxuICAgIGNoYXJnZUJhdHRlcnkyID0gMCxcclxuICAgIHdpbm5lciA9IG51bGwsXHJcbiAgICBmdWxsVmFsdWUxID0gMTAwMDAsXHJcbiAgICBmdWxsVmFsdWUyID0gMTAwMDAsXHJcbiAgICBtYXBVc2Vyc0FjdGl2ID0ge307XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBiYXRVcGRhdGUodGVhbSwgY2hhcmdlKSB7XHJcbiAgICBsZXQgY29sID0gW10sXHJcbiAgICAgICAgZWx0ID0gbnVsbDtcclxuICAgIGlmICh0ZWFtID09PSBcIjFcIikge1xyXG4gICAgICAgIGVsdCA9IGJhdHRlcnkxRWx0O1xyXG4gICAgICAgIC8vIFJlZCAtIERhbmdlciFcclxuICAgICAgICBjb2wgPSBbXCIjNzUwOTAwXCIsIFwiI2M2NDYyYlwiLCBcIiNiNzQ0MjRcIiwgXCIjZGYwYTAwXCIsIFwiIzU5MDcwMFwiXTtcclxuICAgIH0gLyplbHNlIGlmIChjaGFyZ2UgPCA0MCkge1xyXG4gICAgLy8gWWVsbG93IC0gTWlnaHQgd2FubmEgY2hhcmdlIHNvb24uLi5cclxuICAgIGNvbCA9IFtcIiM3NTRmMDBcIiwgXCIjZjJiYjAwXCIsIFwiI2RiYjMwMFwiLCBcIiNkZjhmMDBcIiwgXCIjNTkzYzAwXCJdO1xyXG4gIH0gKi9lbHNlIHtcclxuICAgICAgICBlbHQgPSBiYXR0ZXJ5MkVsdDtcclxuICAgICAgICAvLyBHcmVlbiAtIEFsbCBnb29kIVxyXG4gICAgICAgIGNvbCA9IFtcIiMzMTZkMDhcIiwgXCIjNjBiOTM5XCIsIFwiIzUxYWEzMVwiLCBcIiM2NGNlMTFcIiwgXCIjMjU1NDA1XCJdO1xyXG4gICAgfVxyXG4gICAgZWx0LnN0eWxlW1wiYmFja2dyb3VuZC1pbWFnZVwiXSA9IFwibGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCB0cmFuc3BhcmVudCA1JSwgXCIgKyBjb2xbMF0gKyBcIiA1JSwgXCIgKyBjb2xbMF0gKyBcIiA3JSwgXCIgKyBjb2xbMV0gKyBcIiA4JSwgXCIgKyBjb2xbMV0gKyBcIiAxMCUsIFwiICsgY29sWzJdICsgXCIgMTElLCBcIiArIGNvbFsyXSArIFwiIFwiICsgKGNoYXJnZSAtIDMpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgKGNoYXJnZSAtIDIpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBcIiArIGNvbFs0XSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBibGFjayBcIiArIChjaGFyZ2UgKyA1KSArIFwiJSwgYmxhY2sgOTUlLCB0cmFuc3BhcmVudCA5NSUpLCBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSkgMCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDclLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuOCkgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDAlLCByZ2JhKDI1NSwyNTUsMjU1LDApIDQxJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA4NiUsIHJnYmEoMjU1LDI1NSwyNTUsMC42KSA5MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5MiUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5NSUsIHJnYmEoMjU1LDI1NSwyNTUsMC41KSA5OCUpXCI7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcclxuICAgICAgICBpZiAobW90aW9uRW5hYmxlICYmIG1zZy50eXBlID09PSAnZGV2aWNlbW90aW9uJykge1xyXG4gICAgICAgICAgICBpZiAoIXdpbm5lciAmJiBtc2cudGVhbSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRtcFVzZXJUZWFtID0gbWFwVXNlcnNBY3Rpdlttc2cuaWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0bXBVc2VyVGVhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcFVzZXJzQWN0aXZbbXNnLmlkXSA9IG1zZy50ZWFtO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFZhbHVlMSArPSAxMDAwMDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1zZy50ZWFtID09PSBcIjJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsVmFsdWUyICs9IDEwMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBwZXJjZW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFyZ2VCYXR0ZXJ5MSArPSBtc2cudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkxIC8gZnVsbFZhbHVlMSkgKiAxMDApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFyZ2VCYXR0ZXJ5MiArPSBtc2cudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkyIC8gZnVsbFZhbHVlMikgKiAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJhdFVwZGF0ZShtc2cudGVhbSwgTWF0aC5taW4ocGVyY2VudCwgOTApKTtcclxuICAgICAgICAgICAgICAgIGlmICghd2lubmVyICYmIE1hdGgubWluKHBlcmNlbnQsIDkwKSA9PT0gOTApIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5uZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldmljZW1vdGlvbiAud2luLmZpcmVmb3gnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV2aWNlbW90aW9uIC53aW4uY2hyb21lJykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcclxuICAgIGlmIChzb2NrZXRMb2NhbCkge1xyXG4gICAgICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICB9XHJcbiAgICBiYXR0ZXJ5MUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTEnKTtcclxuICAgIGJhdHRlcnkyRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhdHRlcnktMicpO1xyXG5cclxuICAgIGJhdFVwZGF0ZShcIjFcIiwgMCk7XHJcbiAgICBiYXRVcGRhdGUoXCIyXCIsIDApO1xyXG5cclxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzb2NrZXQuZW1pdCgnY29uZmlnJywge1xyXG4gICAgICAgICAgICB0eXBlOiBcImdhbWVcIixcclxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vdGlvbkVuYWJsZSA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzb2NrZXQuZW1pdCgnY29uZmlnJywge1xyXG4gICAgICAgICAgICB0eXBlOiBcImdhbWVcIixcclxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcclxuICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb3Rpb25FbmFibGUgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0OiBpbml0XHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmxldCBsaWdodEVuYWJsZSA9IGZhbHNlLFxyXG5cdGxpZ2h0RWx0ID0gbnVsbDtcclxuXHJcblxyXG4vLyBXZSB1cGRhdGUgdGhlIGNzcyBTdHlsZVxyXG5mdW5jdGlvbiB1cGRhdGVMaWdodChkYXRhKXtcclxuXHRsZXQgcHJlZml4TGlnaHQgPSAnLXdlYmtpdC0nO1xyXG5cdGxldCBwZXJjZW50ID0gZGF0YTtcclxuXHR2YXIgc3R5bGUgPSBwcmVmaXhMaWdodCsncmFkaWFsLWdyYWRpZW50KGNlbnRlciwgJ1xyXG5cdCAgICArJyBlbGxpcHNlIGNvdmVyLCAnXHJcblx0ICAgICsnIHJnYmEoMTk4LDE5NywxNDUsMSkgMCUsJ1xyXG5cdCAgICArJyByZ2JhKDAsMCwwLDEpICcrcGVyY2VudCsnJSknXHJcblx0ICAgIDtcclxuXHRsaWdodEVsdC5zdHlsZS5iYWNrZ3JvdW5kID0gc3R5bGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCl7XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKXtcclxuXHRcdGlmIChsaWdodEVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ2xpZ2h0Jyl7XHJcblx0XHRcdHVwZGF0ZUxpZ2h0KG1zZy52YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcclxuICAgIGlmIChzb2NrZXRMb2NhbCl7XHJcblx0ICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICB9XHJcblx0bGlnaHRFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlnaHQtYmcnKTtcclxuXHJcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1saWdodCcsIGZ1bmN0aW9uKCl7XHJcblx0XHRsaWdodEVuYWJsZSA9IHRydWU7XHJcblx0fSk7XHJcblxyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1saWdodCcsIGZ1bmN0aW9uKCl7XHJcblx0XHRsaWdodEVuYWJsZSA9IGZhbHNlO1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0aW5pdCA6IGluaXRcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxubGV0IG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2UsIFxyXG5cdGxvY2tFbHQgPSBudWxsLFxyXG5cdHJlc0VsdCA9IG51bGwsXHJcblx0b3BlbiA9IGZhbHNlO1xyXG5cclxuY29uc3QgdmFsdWVzID0geyBmaXJzdCA6IHt2YWx1ZTogNTAsIGZvdW5kOiBmYWxzZX0sIFxyXG5cdFx0XHRcdHNlY29uZCA6IHt2YWx1ZTogODAsIGZvdW5kOiBmYWxzZX0sIFxyXG5cdFx0XHRcdHRoaXJkIDoge3ZhbHVlIDogMTAsIGZvdW5kIDogZmFsc2V9XHJcblx0XHRcdH07XHJcblxyXG5cclxuLy8gQWNjb3JkaW5nIHRvIHRoZSBudW1iZXIgb2YgdW5sb2NrLCB3ZSBqdXN0IHR1cm4gdGhlIGltYWdlIG9yIHdlIG9wZW4gdGhlIGRvb3JcclxuZnVuY3Rpb24gdXBkYXRlUm90YXRpb24oekFscGhhLCBmaXJzdFZhbHVlKXtcclxuXHRpZiAoIW9wZW4pe1xyXG5cdFx0bGV0IGRlbHRhID0gZmlyc3RWYWx1ZSAtIHpBbHBoYTtcclxuXHRcdGxldCByb3RhdGlvbiA9IGRlbHRhO1xyXG5cdFx0aWYgKGRlbHRhIDwgMCl7XHJcblx0XHRcdHJvdGF0aW9uID0gZmlyc3RWYWx1ZSszNjAtekFscGhhO1xyXG5cdFx0fVx0XHRcclxuXHRcdGxvY2tFbHQuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooJytyb3RhdGlvbisnZGVnKSc7XHJcblxyXG5cdFx0bGV0IGN1cnJlbnRWYWx1ZSA9IDEwMCAtIE1hdGgucm91bmQoKHJvdGF0aW9uKjEwMCkvMzYwKTtcclxuXHRcdHJlc0VsdC5pbm5lckhUTUwgPSBjdXJyZW50VmFsdWU7XHJcblx0XHRpZiAodmFsdWVzLmZpcnN0LmZvdW5kIFxyXG5cdFx0XHQmJiB2YWx1ZXMuc2Vjb25kLmZvdW5kXHJcblx0XHRcdCYmIHZhbHVlcy50aGlyZC5mb3VuZCl7XHRcdFx0XHJcblx0XHRcdG9wZW4gPSB0cnVlO1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24nKS5jbGFzc0xpc3QuYWRkKFwib3BlblwiKTtcclxuXHRcdH1lbHNlIGlmICghdmFsdWVzLmZpcnN0LmZvdW5kKSB7XHJcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5maXJzdC52YWx1ZSl7XHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLmZpcnN0Jyk7XHJcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xyXG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcclxuXHRcdFx0XHR2YWx1ZXMuZmlyc3QuZm91bmQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy5zZWNvbmQuZm91bmQpIHtcclxuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLnNlY29uZC52YWx1ZSl7XHJcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5zZWNvbmQnKTtcclxuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XHJcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xyXG5cdFx0XHRcdHZhbHVlcy5zZWNvbmQuZm91bmQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy50aGlyZC5mb3VuZCkge1xyXG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMudGhpcmQudmFsdWUpe1xyXG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAudGhpcmQnKTtcclxuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XHJcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xyXG5cdFx0XHRcdHZhbHVlcy50aGlyZC5mb3VuZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCl7XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKXtcclxuXHRcdGlmIChvcmllbnRhdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ29yaWVudGF0aW9uJyl7XHJcblx0XHRcdHVwZGF0ZVJvdGF0aW9uKG1zZy52YWx1ZSwgbXNnLmZpcnN0VmFsdWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICBpZihzb2NrZXRMb2NhbCl7XHJcblx0ICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICB9XHJcblxyXG5cdGxvY2tFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2FmZV9sb2NrJyk7XHJcblx0cmVzRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yaWVudGF0aW9uIC5yZXNwIC52YWx1ZScpO1xyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcclxuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gdHJ1ZTtcclxuXHR9KTtcclxuXHJcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcclxuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2U7XHJcblx0fSk7XHRcclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0IDogaW5pdFxyXG59OyIsIid1c2Ugc3RyaWN0J1xyXG5cclxubGV0IHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlLFxyXG4gICAgdXNlcm1lZGlhRWx0ID0gbnVsbDtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKSB7XHJcbiAgICAgICAgaWYgKHVzZXJtZWRpYUVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ3VzZXJtZWRpYScpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob3RvU3RyZWFtJykuc2V0QXR0cmlidXRlKCdzcmMnLCBtc2cudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcclxuXHJcbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcclxuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xyXG4gICAgfVxyXG4gICAgdXNlcm1lZGlhRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJtZWRpYS1iZycpO1xyXG5cclxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC11c2VybWVkaWEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB1c2VybWVkaWFFbmFibGUgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AtdXNlcm1lZGlhJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdXNlcm1lZGlhRW5hYmxlID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdDogaW5pdFxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5sZXQgdm9pY2VFbmFibGUgPSBmYWxzZSxcclxuICAgIHZvaWNlRlIgPSBudWxsLFxyXG4gICAgc3ludGggPSBudWxsLFxyXG4gICAgcmVjb2duaXRpb24gPSBudWxsLFxyXG4gICAgcmVjb2duaXRpb25Eb25lID0gZmFsc2UsXHJcbiAgICBuZXh0U2xpZGUgPSBmYWxzZSxcclxuICAgIGVsdE1pYyA9IG51bGwsXHJcbiAgICBpbnB1dE1pYyA9IG51bGxcclxuICAgIDtcclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlVm9pY2VMaXN0KCkge1xyXG4gICAgbGV0IHZvaWNlcyA9IHN5bnRoLmdldFZvaWNlcygpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2b2ljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodm9pY2VzW2ldLmxhbmcgPT09ICdmci1GUicpIHtcclxuICAgICAgICAgICAgdm9pY2VGUiA9IHZvaWNlc1tpXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIlcywgJU8gXCIsIHZvaWNlc1tpXS5sYW5nLCB2b2ljZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVm9pY2VSZXN1bHRzKGV2ZW50KSB7XHJcbiAgICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25FdmVudCByZXN1bHRzIHByb3BlcnR5IHJldHVybnMgYSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0XHJcbiAgICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25SZXN1bHRMaXN0IG9iamVjdCBjb250YWlucyBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBvYmplY3RzLlxyXG4gICAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XHJcbiAgICAvLyBUaGUgZmlyc3QgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IGF0IHBvc2l0aW9uIDAuXHJcbiAgICAvLyBFYWNoIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdCBjb250YWlucyBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIG9iamVjdHMgdGhhdCBjb250YWluIGluZGl2aWR1YWwgcmVzdWx0cy5cclxuICAgIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxyXG4gICAgLy8gVGhlIHNlY29uZCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBhdCBwb3NpdGlvbiAwLlxyXG4gICAgLy8gV2UgdGhlbiByZXR1cm4gdGhlIHRyYW5zY3JpcHQgcHJvcGVydHkgb2YgdGhlIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0IFxyXG4gICAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xyXG4gICAgaW5wdXRNaWMuaW5uZXJIVE1MID0gZmluYWxTdHI7XHJcbiAgICAvL2RpYWdub3N0aWMudGV4dENvbnRlbnQgPSAnUmVzdWx0IHJlY2VpdmVkOiAnICsgY29sb3IgKyAnLic7XHJcbiAgICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgY29uc29sZS5sb2coJ0NvbmZpZGVuY2U6ICcgKyBmaW5hbFN0cik7XHJcbiAgICBpZiAoZmluYWxTdHIuaW5kZXhPZignc3VpdmFudCcpICE9IC0xKSB7XHJcbiAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xyXG4gICAgICAgIGlmICghcmVjb2duaXRpb25Eb25lKSB7XHJcbiAgICAgICAgICAgIHJlY29nbml0aW9uRG9uZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHNwZWFrKFwiQm9uam91ciBKRiwgaidhaSBjb21wcmlzIHF1ZSB0dSB2b3VsYWlzIHBhc3NlciBhdSBzbGlkZSBzdWl2YW50LCBhaXMgamUgYmllbiBjb21wcmlzID9cIilcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbiBkZSBzcGVlY2hcIilcclxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gdm9pY2VGUlwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZmluYWxTdHIuaW5kZXhPZignb3VpJykgIT0gLTEpIHtcclxuICAgICAgICBpZiAoIW5leHRTbGlkZSkge1xyXG4gICAgICAgICAgICBuZXh0U2xpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVm9pY2VFbmQoKSB7XHJcbiAgICAvLyBXZSBkZXRlY3QgdGhlIGVuZCBvZiBzcGVlY2hSZWNvZ25pdGlvbiBwcm9jZXNzXHJcbiAgICBjb25zb2xlLmxvZygnRW5kIG9mIHJlY29nbml0aW9uJylcclxuICAgIHJlY29nbml0aW9uLnN0b3AoKTtcclxuICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG59O1xyXG5cclxuLy8gV2UgZGV0ZWN0IGVycm9yc1xyXG5mdW5jdGlvbiBoYW5kbGVWb2ljZUVycm9yKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vLXNwZWVjaCcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTm8gU3BlZWNoJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ2F1ZGlvLWNhcHR1cmUnKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ05vIG1pY3JvcGhvbmUnKVxyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmVycm9yID09ICdub3QtYWxsb3dlZCcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTm90IEFsbG93ZWQnKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIHNwZWFrKHZhbHVlLCBjYWxsYmFja0VuZCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG5cclxuICAgICAgICBpZiAoIXZvaWNlRlIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHZhbHVlKTtcclxuICAgICAgICB1dHRlclRoaXMudm9pY2UgPSB2b2ljZUZSO1xyXG4gICAgICAgIHV0dGVyVGhpcy5waXRjaCA9IDE7XHJcbiAgICAgICAgdXR0ZXJUaGlzLnJhdGUgPSAxO1xyXG4gICAgICAgIHV0dGVyVGhpcy5vbmVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN5bnRoLnNwZWFrKHV0dGVyVGhpcyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCkge1xyXG5cclxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSByZWNvbm5haXNzYW5jZSB2b2NhbGVcclxuICAgIHZhciBTcGVlY2hSZWNvZ25pdGlvbiA9IFNwZWVjaFJlY29nbml0aW9uIHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uXHJcbiAgICB2YXIgU3BlZWNoR3JhbW1hckxpc3QgPSBTcGVlY2hHcmFtbWFyTGlzdCB8fCB3ZWJraXRTcGVlY2hHcmFtbWFyTGlzdFxyXG4gICAgdmFyIFNwZWVjaFJlY29nbml0aW9uRXZlbnQgPSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uRXZlbnRcclxuICAgIHJlY29nbml0aW9uID0gbmV3IFNwZWVjaFJlY29nbml0aW9uKCk7XHJcbiAgICB2YXIgZ3JhbW1hciA9ICcjSlNHRiBWMS4wOyBncmFtbWFyIGJpbm9tZWQ7IHB1YmxpYyA8Ymlub21lZD4gPSBzdWl2YW50IHwgcHLDqWPDqWRlbnQgfCBwcmVjZWRlbnQgfCBzbGlkZSB8IGRpYXBvc2l0aXZlIHwgc3VpdmFudGUgfCBvdWkgOyc7XHJcbiAgICB2YXIgc3BlZWNoUmVjb2duaXRpb25MaXN0ID0gbmV3IFNwZWVjaEdyYW1tYXJMaXN0KCk7XHJcbiAgICBzcGVlY2hSZWNvZ25pdGlvbkxpc3QuYWRkRnJvbVN0cmluZyhncmFtbWFyLCAxKTtcclxuICAgIHJlY29nbml0aW9uLmdyYW1tYXJzID0gc3BlZWNoUmVjb2duaXRpb25MaXN0O1xyXG4gICAgcmVjb2duaXRpb24uY29udGludW91cyA9IHRydWU7XHJcbiAgICByZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcclxuICAgIHJlY29nbml0aW9uLmludGVyaW1SZXN1bHRzID0gdHJ1ZTtcclxuICAgIHJlY29nbml0aW9uLm9ucmVzdWx0ID0gaGFuZGxlVm9pY2VSZXN1bHRzO1xyXG4gICAgcmVjb2duaXRpb24ub25lbmQgPSBoYW5kbGVWb2ljZUVuZDtcclxuICAgIHJlY29nbml0aW9uLm9uZXJyb3IgPSBoYW5kbGVWb2ljZUVycm9yO1xyXG5cclxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSBzeW50aMOoc2Ugdm9jYWxlXHJcbiAgICBzeW50aCA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXM7XHJcbiAgICBwb3B1bGF0ZVZvaWNlTGlzdCgpO1xyXG4gICAgaWYgKHNwZWVjaFN5bnRoZXNpcy5vbnZvaWNlc2NoYW5nZWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNwZWVjaFN5bnRoZXNpcy5vbnZvaWNlc2NoYW5nZWQgPSBwb3B1bGF0ZVZvaWNlTGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcclxuICAgICAgICBpZiAodm9pY2VFbmFibGUgJiYgbXNnLnR5cGUgPT09ICd2b2ljZScpIHtcclxuICAgICAgICAgICAgaWYgKG1zZy52YWx1ZSA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFlbHRNaWMpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbHRNaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtb1NwZWVjaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0TWljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwZWVjaF9pbnB1dCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobXNnLnZhbHVlID09PSAnc3RvcCcpIHtcclxuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSBjb21tdW51aWNhdGlvblxyXG4gICAgc29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcclxuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC13ZWJzcGVlY2gnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2b2ljZUVuYWJsZSA9IHRydWU7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3Atd2Vic3BlZWNoJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdm9pY2VFbmFibGUgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmVjb2duaXRpb24pIHtcclxuICAgICAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xyXG4gICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdDogaW5pdFxyXG59Il19
