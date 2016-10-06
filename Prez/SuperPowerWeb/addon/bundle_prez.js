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


function managementGeneric(idHighlightElt, startEvent, stopEvent, positionArray){

	var eltHiglight = document.querySelector('#'+idHighlightElt);

	function progressFragment(event){
		// event.fragment // the dom element fragment
		try{			
			if (event.type === 'fragmentshown'){
				var index = +event.fragment.getAttribute('data-fragment-index');
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++){
					var key = keys[i];
					eltHiglight.style[key] = properties[key];
				}	
			}else {
				var index = +event.fragment.getAttribute('data-fragment-index');
				// On reset les properties
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++){
					var key = keys[i];
					eltHiglight.style[key] = '';
				}
				if (index > 0){			
					properties = positionArray[index - 1];
					keys = Object.keys(properties);
					for (var i = 0; i < keys.length; i++){
						var key = keys[i];
						eltHiglight.style[key] = properties[key];
					}
				}			
			}
		}catch(e){}
	}

	function listenFragments(){
		Reveal.addEventListener('fragmentshown', progressFragment);
		Reveal.addEventListener('fragmenthidden', progressFragment);
	}

	function unregisterFragments(){
		Reveal.removeEventListener('fragmentshown', progressFragment);
		Reveal.removeEventListener('fragmenthidden', progressFragment);
	}

	Reveal.addEventListener(startEvent, function(){
		listenFragments();
	});
	Reveal.addEventListener(stopEvent, function(){
		unregisterFragments();
	});
}

function managementCodeConnect(){

	managementGeneric('highlight-connect-ble', 
			'code-connect-ble', 
			'stop-code-connect-ble',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '400px'
			}
			]);
	
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovcHJlel9zdXBlcl9wb3dlci5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvb3JpZW50YXRpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy92b2ljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcyhsb2NhbCl7XG5cdGlmIChsb2NhbCB8fCAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKSl7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCJcblx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCI4MDAwXCIpe1xuXHRcdHJldHVybiBcImh0dHBzOi8vYmlub21lZC5mcjo4MDAwXCI7XG5cdH1lbHNle1xuXHRcdHJldHVybiBudWxsO1x0XG5cdH0gXG59XG5cbnZhciBhZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcygpO1xudmFyIGFkZHJlc3NMb2NhbCA9IGNhbGN1bGF0ZUFkZHJlc3ModHJ1ZSk7XG52YXIgbG9jYWwgPSBsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkcmVzcyA6IGFkZHJlc3MsXG4gICAgYWRkcmVzc0xvY2FsIDogYWRkcmVzc0xvY2FsLFxuXHRsb2NhbCA6IGxvY2FsXG59IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb250ZXh0ID0gbnVsbCxcblx0UFVCTElDID0gMSxcblx0V0FJVCA9IDIsXG5cdFJFU1AgPSAzLFxuXHRwdWJsaWNCdWZmZXIgPSBudWxsLFxuXHR3YWl0QnVmZmVyID0gbnVsbCxcblx0cmVzcEJ1ZmZlciA9IG51bGwsXG5cdGN1cnJlbnRTb3VyY2UgPSBudWxsO1xuXG50cnl7XG5cdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cdGNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59Y2F0Y2goZSl7XG5cdGNvbnRleHQgPSBudWxsO1xuXHRjb25zb2xlLmxvZyhcIk5vIFdlYkFQSSBkZWN0ZWN0XCIpO1xufVxuXG5mdW5jdGlvbiBsb2FkU291bmQodXJsLCBidWZmZXJUb1VzZSl7XG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdC8vIERlY29kZSBhc3luY2hyb25vdXNseVxuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdFx0aWYgKGJ1ZmZlclRvVXNlID09PSBQVUJMSUMpe1xuXHRcdCAgXHRcdHB1YmxpY0J1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gV0FJVCl7XG5cdFx0ICBcdFx0d2FpdEJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gUkVTUCl7XG5cdFx0ICBcdFx0cmVzcEJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1cblx0XHR9LCBmdW5jdGlvbihlKXtcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBkZWNvZGluZyBmaWxlJywgZSk7XG5cdFx0fSk7XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGxvYWRQdWJsaWNTb3VuZCgpe1xuXHRpZihjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvcXVlc3Rpb25fcHVibGljX2NvdXJ0ZS5tcDNcIiwgUFVCTElDKTtcbn1cblxuZnVuY3Rpb24gbG9hZFdhaXRTb3VuZCgpe1xuXHRpZiAoY29udGV4dClcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL2F0dGVudGVfcmVwb25zZV9jb3VydGUubXAzXCIsIFdBSVQpO1xufVxuXG5mdW5jdGlvbiBsb2FkUmVzcFNvdW5kKCl7XG5cdGlmIChjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvYm9ubmVfcmVwb25zZS5tcDNcIiwgUkVTUCk7XG59XG5cbmZ1bmN0aW9uIHBsYXlTb3VuZChidWZmZXIpe1xuXHR2YXIgc291cmNlID0gY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgLy8gY3JlYXRlcyBhIHNvdW5kIHNvdXJjZVxuXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyOyAgICAgICAgICAgICAgICAgICAgLy8gdGVsbCB0aGUgc291cmNlIHdoaWNoIHNvdW5kIHRvIHBsYXlcblx0c291cmNlLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7ICAgICAgIC8vIGNvbm5lY3QgdGhlIHNvdXJjZSB0byB0aGUgY29udGV4dCdzIGRlc3RpbmF0aW9uICh0aGUgc3BlYWtlcnMpXG5cdHNvdXJjZS5zdGFydCgwKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwbGF5IHRoZSBzb3VyY2Ugbm93XG5cdHJldHVybiBzb3VyY2U7XG59XG5cbmxvYWRQdWJsaWNTb3VuZCgpO1xubG9hZFdhaXRTb3VuZCgpO1xubG9hZFJlc3BTb3VuZCgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBBcGlzIGV4cG9zZWRcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qL1xuXG5mdW5jdGlvbiBwbGF5UHVibGljKCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZChwdWJsaWNCdWZmZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBsYXlXYWl0KCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZCh3YWl0QnVmZmVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwbGF5UmVzcCgpe1xuXHRpZiAoY29udGV4dCl7XG5cdFx0c3RvcCgpO1xuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQocmVzcEJ1ZmZlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RvcCgpe1xuXHRpZiAoY3VycmVudFNvdXJjZSAmJiBjdXJyZW50U291cmNlLnN0b3Ape1xuXHRcdGN1cnJlbnRTb3VyY2Uuc3RvcCgwKTtcblx0fVxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHBsYXlQdWJsaWMgOiBwbGF5UHVibGljLFxuXHRwbGF5V2FpdCA6IHBsYXlXYWl0LFxuXHRwbGF5UmVzcCA6IHBsYXlSZXNwLFxuXHRzdG9wIDogc3RvcFxufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnL2NvbmZpZycpLFxuXHRhdWRpbyA9IHJlcXVpcmUoJy4vYXVkaW8nKSxcblx0c29ja2V0ID0gbnVsbCxcblx0c2NvcmVJbmRleCA9IHt9O1xuXG5cblxuZnVuY3Rpb24gaGlkZVF1ZXN0aW9uKCl7XHRcblx0YXVkaW8uc3RvcCgpO1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnaGlkZVF1ZXN0aW9uJ1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlUXVlc3Rpb24oaW5kZXgpe1xuXHRhdWRpby5wbGF5UHVibGljKCk7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdjaGFuZ2VRdWVzdGlvbicsXG5cdFx0J2luZGV4JyA6IGluZGV4LFxuXHRcdHJlcEEgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQWApLmlubmVySFRNTCxcblx0XHRyZXBCIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEJgKS5pbm5lckhUTUwsXG5cdFx0cmVwQyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBDYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwRGApLmlubmVySFRNTCxcblxuXHR9KTtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ3Nob3dOb3RpZmljYXRpb24nXHRcdFxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzU2NvcmUoaW5kZXgpe1xuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7Y29uZmlnLmFkZHJlc3N9L3Njb3JlLyR7aW5kZXh9YCxteUluaXQpO1xuXHRmZXRjaChteVJlcXVlc3QpXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihqc29uKXtcblx0XHRhdWRpby5wbGF5V2FpdCgpO1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKHNjb3JlSW5kZXhbYHF1ZXN0aW9uXyR7aW5kZXh9YF0pe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHRsZXQgdG90YWwgPSBqc29uLnJlcEEgKyBqc29uLnJlcEIgKyBqc29uLnJlcEMgKyBqc29uLnJlcEQ7XG5cdFx0dmFyIGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjaGFydF9xdWVzdGlvbl8ke2luZGV4fWApLmdldENvbnRleHQoXCIyZFwiKTtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdCAgICBsYWJlbHM6IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIl0sXG5cdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0ICAgICAgICB7XG5cdFx0ICAgICAgICAgICAgbGFiZWw6IFwiQVwiLFxuXHRcdCAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNSlcIixcblx0XHQgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuOClcIixcblx0XHQgICAgICAgICAgICBoaWdobGlnaHRGaWxsOiBcInJnYmEoMjIwLDIyMCwyMjAsMC43NSlcIixcblx0XHQgICAgICAgICAgICBoaWdobGlnaHRTdHJva2U6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxuXHRcdCAgICAgICAgICAgIGRhdGE6IFtNYXRoLnJvdW5kKChqc29uLnJlcEEgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBCIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQyAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEQgLyB0b3RhbCkgKiAxMDApXVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICBdXG5cdFx0fTtcblx0XHR2YXIgbXlCYXJDaGFydCA9IG5ldyBDaGFydChjdHgpLkJhcihkYXRhLCB7XG5cdFx0XHQgLy9Cb29sZWFuIC0gV2hldGhlciBncmlkIGxpbmVzIGFyZSBzaG93biBhY3Jvc3MgdGhlIGNoYXJ0XG5cdCAgICBcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IGZhbHNlLFxuXHQgICAgXHQvLyBTdHJpbmcgLSBTY2FsZSBsYWJlbCBmb250IGNvbG91clxuXHQgICAgXHRzY2FsZUZvbnRDb2xvcjogXCJvcmFuZ2VcIixcblx0XHR9KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRhdWRpby5wbGF5UmVzcCgpO1xuXHRcdFx0bGV0IGdvb2RBbnN3ZXJFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1yZXNwLXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5nb29kYCk7XG5cdFx0XHRsZXQgYW53c2VyID0gZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEEnKSA/ICdBJyA6XG5cdFx0XHRcdFx0XHQgZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEInKSA/ICdCJyA6XG5cdFx0XHRcdFx0XHQgZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEMnKSA/ICdDJyA6ICdEJztcblx0XHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRcdFx0ZXZlbnRUeXBlIDogJ2Fuc3dlcicsXG5cdFx0XHRcdHZhbHVlIDogYW53c2VyXG5cdFx0XHR9KTtcdFx0XHQgXG5cdFx0XHRnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdGlmIChpbmRleCA9PT0gNCl7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdFx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRcdFx0XHRcdGV2ZW50VHlwZSA6ICdjYWxjdWxhdGVXaW5uZXJzJyxcblx0XHRcdFx0XHRcdG51bWJlcldpbm5lcnMgOiAyLFxuXHRcdFx0XHRcdFx0dmFsdWUgOiBhbndzZXJcblx0XHRcdFx0XHR9KTtcdFx0XG5cdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0fVxuXHRcdH0sIDUwMDApO1xuXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblx0aGlkZVF1ZXN0aW9uKCk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDEpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDEpO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMicsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMik7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMik7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0zJywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbigzKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTMnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSgzKTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTQnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDQpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tNCcsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDQpO1xuXHR9KTtcblxuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWl0LXF1ZXN0aW9uJywgaGlkZVF1ZXN0aW9uKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxuXG5mdW5jdGlvbiBtYW5hZ2VtZW50R2VuZXJpYyhpZEhpZ2hsaWdodEVsdCwgc3RhcnRFdmVudCwgc3RvcEV2ZW50LCBwb3NpdGlvbkFycmF5KXtcblxuXHR2YXIgZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJytpZEhpZ2hsaWdodEVsdCk7XG5cblx0ZnVuY3Rpb24gcHJvZ3Jlc3NGcmFnbWVudChldmVudCl7XG5cdFx0Ly8gZXZlbnQuZnJhZ21lbnQgLy8gdGhlIGRvbSBlbGVtZW50IGZyYWdtZW50XG5cdFx0dHJ5e1x0XHRcdFxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJyl7XG5cdFx0XHRcdHZhciBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcblx0XHRcdFx0dmFyIHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4XTtcblx0XHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHR2YXIga2V5ID0ga2V5c1tpXTtcblx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1lbHNlIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuXHRcdFx0XHQvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuXHRcdFx0XHR2YXIgcHJvcGVydGllcyA9IHBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXHRcdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdHZhciBrZXkgPSBrZXlzW2ldO1xuXHRcdFx0XHRcdGVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaW5kZXggPiAwKXtcdFx0XHRcblx0XHRcdFx0XHRwcm9wZXJ0aWVzID0gcG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuXHRcdFx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0dmFyIGtleSA9IGtleXNbaV07XG5cdFx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVx0XHRcdFxuXHRcdFx0fVxuXHRcdH1jYXRjaChlKXt9XG5cdH1cblxuXHRmdW5jdGlvbiBsaXN0ZW5GcmFnbWVudHMoKXtcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHByb2dyZXNzRnJhZ21lbnQpO1xuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHByb2dyZXNzRnJhZ21lbnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdW5yZWdpc3RlckZyYWdtZW50cygpe1xuXHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgcHJvZ3Jlc3NGcmFnbWVudCk7XG5cdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgcHJvZ3Jlc3NGcmFnbWVudCk7XG5cdH1cblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihzdGFydEV2ZW50LCBmdW5jdGlvbigpe1xuXHRcdGxpc3RlbkZyYWdtZW50cygpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoc3RvcEV2ZW50LCBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXJGcmFnbWVudHMoKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZW1lbnRDb2RlQ29ubmVjdCgpe1xuXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtY29ubmVjdC1ibGUnLCBcblx0XHRcdCdjb2RlLWNvbm5lY3QtYmxlJywgXG5cdFx0XHQnc3RvcC1jb2RlLWNvbm5lY3QtYmxlJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMS4xNWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNDAwcHgnXG5cdFx0XHR9XG5cdFx0XHRdKTtcblx0XG59XG5cbmZ1bmN0aW9uIGluaXQoKXtcblxuXHRtYW5hZ2VtZW50Q29kZUNvbm5lY3QoKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy9jb25maWcnKTtcblxuZnVuY3Rpb24gcG9zdFByb2RDb2RlSGlsaWdodCgpe1xuXHR2YXIgYXJyYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdjb2RlLnRvSGlsaWdodCcpO1xuXHRmb3IgKHZhciBpID0wOyBpIDxhcnJheS5sZW5ndGg7IGkrKyl7XG5cdFx0dmFyIGxlbmd0aCA9IDA7XG5cdFx0dmFyIHRleHRDb2RlID0gYXJyYXlbaV0uaW5uZXJIVE1MO1xuXHRcdGRve1xuXHRcdFx0bGVuZ3RoID0gdGV4dENvZGUubGVuZ3RoO1xuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7bWFyayZndDsnLCAnPG1hcms+Jyk7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrIGNsYXNzPVwiZGlsbHVhdGVcIiZndDsnLCAnPG1hcmsgY2xhc3M9XCJkaWxsdWF0ZVwiPicpO1xuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7L21hcmsmZ3Q7JywgJzwvbWFyaz4nKTtcblx0XHR9d2hpbGUobGVuZ3RoICE9IHRleHRDb2RlLmxlbmd0aCk7XG5cdFx0YXJyYXlbaV0uaW5uZXJIVE1MID0gdGV4dENvZGU7XG5cblx0fVxufVxuXG5SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3JlYWR5JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIC8vIGV2ZW50LmN1cnJlbnRTbGlkZSwgZXZlbnQuaW5kZXhoLCBldmVudC5pbmRleHZcblx0Y29uc29sZS5sb2coJ1JldmVhbEpTIFJlYWR5Jyk7XG4gICAgXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgXHRwb3N0UHJvZENvZGVIaWxpZ2h0KCk7XG5cdH0sIDUwMCk7XG5cdFxuXHRsZXQgaW5JRnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xuXHRcbiAgICBcblx0aWYgKCFpbklGcmFtZSAmJiBpbyAmJiBjb25maWcuYWRkcmVzcyl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR28gdG8gY29uZGl0aW9uICFcIik7XG5cdFx0bGV0IHNvY2tldEdhbWUgPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHRyZXF1aXJlKCcuL2dhbWUvcHJlel9nYW1lJykuaW5pdChzb2NrZXRHYW1lKTtcblx0XHRsZXQgc29ja2V0UHJleiA9IG51bGw7XG5cdFx0bGV0IHNvY2tldFByZXpMb2NhbCA9IG51bGw7XG5cdFx0aWYgKGNvbmZpZy5sb2NhbCl7XG5cdFx0XHRzb2NrZXRQcmV6ID0gc29ja2V0R2FtZTsgICBcblx0XHR9ZWxzZXtcblx0XHRcdHNvY2tldFByZXogPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHRcdHNvY2tldFByZXpMb2NhbCA9IGlvLmNvbm5lY3QoY29uZmlnLmFkZHJlc3NMb2NhbCk7XG5cdFx0fVxuIFxuIFx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgbGlnaHRcIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgT3JpZW50YXRpb25cIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvb3JpZW50YXRpb24nKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgRGV2aWNlTW90aW9uXCIpO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL2RldmljZW1vdGlvbicpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBWb2ljZVwiKTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBVc2VyTWVkaWFcIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvdXNlcm1lZGlhJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xuIFx0XHRcdFxuIFx0XHQvL30sIDEwMDApO1xuXHR9XHRcblxuXHRyZXF1aXJlKCcuL2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUnKS5pbml0KCk7XG4gXG5cdFxufSApO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBtb3Rpb25FbmFibGUgPSBmYWxzZSxcbiAgICBtb3Rpb25FbHQgPSBudWxsLFxuICAgIGJhdHRlcnkxRWx0ID0gbnVsbCxcbiAgICBiYXR0ZXJ5MkVsdCA9IG51bGwsXG4gICAgY2hhcmdlQmF0dGVyeTEgPSAwLFxuICAgIGNoYXJnZUJhdHRlcnkyID0gMCxcbiAgICB3aW5uZXIgPSBudWxsLFxuICAgIGZ1bGxWYWx1ZTEgPSAxMDAwMCxcbiAgICBmdWxsVmFsdWUyID0gMTAwMDAsXG4gICAgbWFwVXNlcnNBY3RpdiA9IHt9O1xuXG5cblxuXG5mdW5jdGlvbiBiYXRVcGRhdGUodGVhbSwgY2hhcmdlKSB7XG4gICAgbGV0IGNvbCA9IFtdLFxuICAgICAgICBlbHQgPSBudWxsO1xuICAgIGlmICh0ZWFtID09PSBcIjFcIikge1xuICAgICAgICBlbHQgPSBiYXR0ZXJ5MUVsdDtcbiAgICAgICAgLy8gUmVkIC0gRGFuZ2VyIVxuICAgICAgICBjb2wgPSBbXCIjNzUwOTAwXCIsIFwiI2M2NDYyYlwiLCBcIiNiNzQ0MjRcIiwgXCIjZGYwYTAwXCIsIFwiIzU5MDcwMFwiXTtcbiAgICB9IC8qZWxzZSBpZiAoY2hhcmdlIDwgNDApIHtcbiAgICAvLyBZZWxsb3cgLSBNaWdodCB3YW5uYSBjaGFyZ2Ugc29vbi4uLlxuICAgIGNvbCA9IFtcIiM3NTRmMDBcIiwgXCIjZjJiYjAwXCIsIFwiI2RiYjMwMFwiLCBcIiNkZjhmMDBcIiwgXCIjNTkzYzAwXCJdO1xuICB9ICovZWxzZSB7XG4gICAgICAgIGVsdCA9IGJhdHRlcnkyRWx0O1xuICAgICAgICAvLyBHcmVlbiAtIEFsbCBnb29kIVxuICAgICAgICBjb2wgPSBbXCIjMzE2ZDA4XCIsIFwiIzYwYjkzOVwiLCBcIiM1MWFhMzFcIiwgXCIjNjRjZTExXCIsIFwiIzI1NTQwNVwiXTtcbiAgICB9XG4gICAgZWx0LnN0eWxlW1wiYmFja2dyb3VuZC1pbWFnZVwiXSA9IFwibGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCB0cmFuc3BhcmVudCA1JSwgXCIgKyBjb2xbMF0gKyBcIiA1JSwgXCIgKyBjb2xbMF0gKyBcIiA3JSwgXCIgKyBjb2xbMV0gKyBcIiA4JSwgXCIgKyBjb2xbMV0gKyBcIiAxMCUsIFwiICsgY29sWzJdICsgXCIgMTElLCBcIiArIGNvbFsyXSArIFwiIFwiICsgKGNoYXJnZSAtIDMpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgKGNoYXJnZSAtIDIpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBcIiArIGNvbFs0XSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBibGFjayBcIiArIChjaGFyZ2UgKyA1KSArIFwiJSwgYmxhY2sgOTUlLCB0cmFuc3BhcmVudCA5NSUpLCBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSkgMCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDclLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuOCkgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDAlLCByZ2JhKDI1NSwyNTUsMjU1LDApIDQxJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA4NiUsIHJnYmEoMjU1LDI1NSwyNTUsMC42KSA5MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5MiUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5NSUsIHJnYmEoMjU1LDI1NSwyNTUsMC41KSA5OCUpXCI7XG59XG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKSB7XG5cbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcbiAgICAgICAgaWYgKG1vdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ2RldmljZW1vdGlvbicpIHtcbiAgICAgICAgICAgIGlmICghd2lubmVyICYmIG1zZy50ZWFtKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRtcFVzZXJUZWFtID0gbWFwVXNlcnNBY3Rpdlttc2cuaWRdO1xuICAgICAgICAgICAgICAgIGlmICghdG1wVXNlclRlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwVXNlcnNBY3Rpdlttc2cuaWRdID0gbXNnLnRlYW07XG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxWYWx1ZTEgKz0gMTAwMDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobXNnLnRlYW0gPT09IFwiMlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsVmFsdWUyICs9IDEwMDAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBwZXJjZW50ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAobXNnLnRlYW0gPT09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJnZUJhdHRlcnkxICs9IG1zZy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkxIC8gZnVsbFZhbHVlMSkgKiAxMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJnZUJhdHRlcnkyICs9IG1zZy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkyIC8gZnVsbFZhbHVlMikgKiAxMDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJhdFVwZGF0ZShtc2cudGVhbSwgTWF0aC5taW4ocGVyY2VudCwgOTApKTtcbiAgICAgICAgICAgICAgICBpZiAoIXdpbm5lciAmJiBNYXRoLm1pbihwZXJjZW50LCA5MCkgPT09IDkwKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbm5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXZpY2Vtb3Rpb24gLndpbi5maXJlZm94JykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV2aWNlbW90aW9uIC53aW4uY2hyb21lJykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvY2tldC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIGlmIChzb2NrZXRMb2NhbCkge1xuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIH1cbiAgICBiYXR0ZXJ5MUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTEnKTtcbiAgICBiYXR0ZXJ5MkVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTInKTtcblxuICAgIGJhdFVwZGF0ZShcIjFcIiwgMCk7XG4gICAgYmF0VXBkYXRlKFwiMlwiLCAwKTtcblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcbiAgICAgICAgICAgIHR5cGU6IFwiZ2FtZVwiLFxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcbiAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIG1vdGlvbkVuYWJsZSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcbiAgICAgICAgICAgIHR5cGU6IFwiZ2FtZVwiLFxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBtb3Rpb25FbmFibGUgPSBmYWxzZTtcbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBsaWdodEVuYWJsZSA9IGZhbHNlLFxuXHRsaWdodEVsdCA9IG51bGw7XG5cblxuLy8gV2UgdXBkYXRlIHRoZSBjc3MgU3R5bGVcbmZ1bmN0aW9uIHVwZGF0ZUxpZ2h0KGRhdGEpe1xuXHRsZXQgcHJlZml4TGlnaHQgPSAnLXdlYmtpdC0nO1xuXHRsZXQgcGVyY2VudCA9IGRhdGE7XG5cdHZhciBzdHlsZSA9IHByZWZpeExpZ2h0KydyYWRpYWwtZ3JhZGllbnQoY2VudGVyLCAnXG5cdCAgICArJyBlbGxpcHNlIGNvdmVyLCAnXG5cdCAgICArJyByZ2JhKDE5OCwxOTcsMTQ1LDEpIDAlLCdcblx0ICAgICsnIHJnYmEoMCwwLDAsMSkgJytwZXJjZW50KyclKSdcblx0ICAgIDtcblx0bGlnaHRFbHQuc3R5bGUuYmFja2dyb3VuZCA9IHN0eWxlO1xufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpe1xuXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKXtcblx0XHRpZiAobGlnaHRFbmFibGUgJiYgbXNnLnR5cGUgPT09ICdsaWdodCcpe1xuXHRcdFx0dXBkYXRlTGlnaHQobXNnLnZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICBpZiAoc29ja2V0TG9jYWwpe1xuXHQgICAgc29ja2V0TG9jYWwub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICB9XG5cdGxpZ2h0RWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZ2h0LWJnJyk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1saWdodCcsIGZ1bmN0aW9uKCl7XG5cdFx0bGlnaHRFbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3AtbGlnaHQnLCBmdW5jdGlvbigpe1xuXHRcdGxpZ2h0RW5hYmxlID0gZmFsc2U7XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgb3JpZW50YXRpb25FbmFibGUgPSBmYWxzZSwgXG5cdGxvY2tFbHQgPSBudWxsLFxuXHRyZXNFbHQgPSBudWxsLFxuXHRvcGVuID0gZmFsc2U7XG5cbmNvbnN0IHZhbHVlcyA9IHsgZmlyc3QgOiB7dmFsdWU6IDUwLCBmb3VuZDogZmFsc2V9LCBcblx0XHRcdFx0c2Vjb25kIDoge3ZhbHVlOiA4MCwgZm91bmQ6IGZhbHNlfSwgXG5cdFx0XHRcdHRoaXJkIDoge3ZhbHVlIDogMTAsIGZvdW5kIDogZmFsc2V9XG5cdFx0XHR9O1xuXG5cbi8vIEFjY29yZGluZyB0byB0aGUgbnVtYmVyIG9mIHVubG9jaywgd2UganVzdCB0dXJuIHRoZSBpbWFnZSBvciB3ZSBvcGVuIHRoZSBkb29yXG5mdW5jdGlvbiB1cGRhdGVSb3RhdGlvbih6QWxwaGEsIGZpcnN0VmFsdWUpe1xuXHRpZiAoIW9wZW4pe1xuXHRcdGxldCBkZWx0YSA9IGZpcnN0VmFsdWUgLSB6QWxwaGE7XG5cdFx0bGV0IHJvdGF0aW9uID0gZGVsdGE7XG5cdFx0aWYgKGRlbHRhIDwgMCl7XG5cdFx0XHRyb3RhdGlvbiA9IGZpcnN0VmFsdWUrMzYwLXpBbHBoYTtcblx0XHR9XHRcdFxuXHRcdGxvY2tFbHQuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooJytyb3RhdGlvbisnZGVnKSc7XG5cblx0XHRsZXQgY3VycmVudFZhbHVlID0gMTAwIC0gTWF0aC5yb3VuZCgocm90YXRpb24qMTAwKS8zNjApO1xuXHRcdHJlc0VsdC5pbm5lckhUTUwgPSBjdXJyZW50VmFsdWU7XG5cdFx0aWYgKHZhbHVlcy5maXJzdC5mb3VuZCBcblx0XHRcdCYmIHZhbHVlcy5zZWNvbmQuZm91bmRcblx0XHRcdCYmIHZhbHVlcy50aGlyZC5mb3VuZCl7XHRcdFx0XG5cdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbicpLmNsYXNzTGlzdC5hZGQoXCJvcGVuXCIpO1xuXHRcdH1lbHNlIGlmICghdmFsdWVzLmZpcnN0LmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMuZmlyc3QudmFsdWUpe1x0XHRcdFx0XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAuZmlyc3QnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy5maXJzdC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMuc2Vjb25kLmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMuc2Vjb25kLnZhbHVlKXtcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5zZWNvbmQnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy5zZWNvbmQuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1lbHNlIGlmICghdmFsdWVzLnRoaXJkLmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMudGhpcmQudmFsdWUpe1xuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLnRoaXJkJyk7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LnJlbW92ZShcImZhLXRpbWVzLWNpcmNsZVwiKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuXHRcdFx0XHR2YWx1ZXMudGhpcmQuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKXtcblxuICAgIGZ1bmN0aW9uIGNhbGxCYWNrU2Vuc29yKG1zZyl7XG5cdFx0aWYgKG9yaWVudGF0aW9uRW5hYmxlICYmIG1zZy50eXBlID09PSAnb3JpZW50YXRpb24nKXtcblx0XHRcdHVwZGF0ZVJvdGF0aW9uKG1zZy52YWx1ZSwgbXNnLmZpcnN0VmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdHNvY2tldC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIGlmKHNvY2tldExvY2FsKXtcblx0ICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgfVxuXG5cdGxvY2tFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2FmZV9sb2NrJyk7XG5cdHJlc0VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmllbnRhdGlvbiAucmVzcCAudmFsdWUnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcblx0XHRvcmllbnRhdGlvbkVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1vcmllbnRhdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0b3JpZW50YXRpb25FbmFibGUgPSBmYWxzZTtcblx0fSk7XHRcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufTsiLCIndXNlIHN0cmljdCdcblxubGV0IHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlLFxuICAgIHVzZXJtZWRpYUVsdCA9IG51bGw7XG5cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpIHtcblxuICAgIGZ1bmN0aW9uIGNhbGxCYWNrU2Vuc29yKG1zZykge1xuICAgICAgICBpZiAodXNlcm1lZGlhRW5hYmxlICYmIG1zZy50eXBlID09PSAndXNlcm1lZGlhJykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob3RvU3RyZWFtJykuc2V0QXR0cmlidXRlKCdzcmMnLCBtc2cudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG5cbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcbiAgICAgICAgc29ja2V0TG9jYWwub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICB9XG4gICAgdXNlcm1lZGlhRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJtZWRpYS1iZycpO1xuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LXVzZXJtZWRpYScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB1c2VybWVkaWFFbmFibGUgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AtdXNlcm1lZGlhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlO1xuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IHZvaWNlRW5hYmxlID0gZmFsc2UsXG4gICAgdm9pY2VGUiA9IG51bGwsXG4gICAgc3ludGggPSBudWxsLFxuICAgIHJlY29nbml0aW9uID0gbnVsbCxcbiAgICByZWNvZ25pdGlvbkRvbmUgPSBmYWxzZSxcbiAgICBuZXh0U2xpZGUgPSBmYWxzZSxcbiAgICBlbHRNaWMgPSBudWxsLFxuICAgIGlucHV0TWljID0gbnVsbFxuICAgIDtcblxuZnVuY3Rpb24gcG9wdWxhdGVWb2ljZUxpc3QoKSB7XG4gICAgbGV0IHZvaWNlcyA9IHN5bnRoLmdldFZvaWNlcygpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm9pY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh2b2ljZXNbaV0ubGFuZyA9PT0gJ2ZyLUZSJykge1xuICAgICAgICAgICAgdm9pY2VGUiA9IHZvaWNlc1tpXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiJXMsICVPIFwiLCB2b2ljZXNbaV0ubGFuZywgdm9pY2VzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlVm9pY2VSZXN1bHRzKGV2ZW50KSB7XG4gICAgLy8gVGhlIFNwZWVjaFJlY29nbml0aW9uRXZlbnQgcmVzdWx0cyBwcm9wZXJ0eSByZXR1cm5zIGEgU3BlZWNoUmVjb2duaXRpb25SZXN1bHRMaXN0IG9iamVjdFxuICAgIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdHMuXG4gICAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XG4gICAgLy8gVGhlIGZpcnN0IFswXSByZXR1cm5zIHRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBhdCBwb3NpdGlvbiAwLlxuICAgIC8vIEVhY2ggU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0cyB0aGF0IGNvbnRhaW4gaW5kaXZpZHVhbCByZXN1bHRzLlxuICAgIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxuICAgIC8vIFRoZSBzZWNvbmQgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgYXQgcG9zaXRpb24gMC5cbiAgICAvLyBXZSB0aGVuIHJldHVybiB0aGUgdHJhbnNjcmlwdCBwcm9wZXJ0eSBvZiB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3QgXG4gICAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xuICAgIGlucHV0TWljLmlubmVySFRNTCA9IGZpbmFsU3RyO1xuICAgIC8vZGlhZ25vc3RpYy50ZXh0Q29udGVudCA9ICdSZXN1bHQgcmVjZWl2ZWQ6ICcgKyBjb2xvciArICcuJztcbiAgICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICAgIGNvbnNvbGUubG9nKCdDb25maWRlbmNlOiAnICsgZmluYWxTdHIpO1xuICAgIGlmIChmaW5hbFN0ci5pbmRleE9mKCdzdWl2YW50JykgIT0gLTEpIHtcbiAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgICAgICBpZiAoIXJlY29nbml0aW9uRG9uZSkge1xuICAgICAgICAgICAgcmVjb2duaXRpb25Eb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHNwZWFrKFwiQm9uam91ciBKRiwgaidhaSBjb21wcmlzIHF1ZSB0dSB2b3VsYWlzIHBhc3NlciBhdSBzbGlkZSBzdWl2YW50LCBhaXMgamUgYmllbiBjb21wcmlzID9cIilcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmluIGRlIHNwZWVjaFwiKVxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyB2b2ljZUZSXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmaW5hbFN0ci5pbmRleE9mKCdvdWknKSAhPSAtMSkge1xuICAgICAgICBpZiAoIW5leHRTbGlkZSkge1xuICAgICAgICAgICAgbmV4dFNsaWRlID0gdHJ1ZTtcbiAgICAgICAgICAgIFJldmVhbC5uZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVZvaWNlRW5kKCkge1xuICAgIC8vIFdlIGRldGVjdCB0aGUgZW5kIG9mIHNwZWVjaFJlY29nbml0aW9uIHByb2Nlc3NcbiAgICBjb25zb2xlLmxvZygnRW5kIG9mIHJlY29nbml0aW9uJylcbiAgICByZWNvZ25pdGlvbi5zdG9wKCk7XG4gICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG59O1xuXG4vLyBXZSBkZXRlY3QgZXJyb3JzXG5mdW5jdGlvbiBoYW5kbGVWb2ljZUVycm9yKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmVycm9yID09ICduby1zcGVlY2gnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBTcGVlY2gnKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmVycm9yID09ICdhdWRpby1jYXB0dXJlJykge1xuICAgICAgICBjb25zb2xlLmxvZygnTm8gbWljcm9waG9uZScpXG4gICAgfVxuICAgIGlmIChldmVudC5lcnJvciA9PSAnbm90LWFsbG93ZWQnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdOb3QgQWxsb3dlZCcpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHNwZWFrKHZhbHVlLCBjYWxsYmFja0VuZCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICBpZiAoIXZvaWNlRlIpIHtcbiAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHZhbHVlKTtcbiAgICAgICAgdXR0ZXJUaGlzLnZvaWNlID0gdm9pY2VGUjtcbiAgICAgICAgdXR0ZXJUaGlzLnBpdGNoID0gMTtcbiAgICAgICAgdXR0ZXJUaGlzLnJhdGUgPSAxO1xuICAgICAgICB1dHRlclRoaXMub25lbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBzeW50aC5zcGVhayh1dHRlclRoaXMpO1xuICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCkge1xuXG4gICAgLy8gSW5pdGlhbGlzYXRpb24gZGUgbGEgcGFydGllIHJlY29ubmFpc3NhbmNlIHZvY2FsZVxuICAgIHZhciBTcGVlY2hSZWNvZ25pdGlvbiA9IFNwZWVjaFJlY29nbml0aW9uIHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uXG4gICAgdmFyIFNwZWVjaEdyYW1tYXJMaXN0ID0gU3BlZWNoR3JhbW1hckxpc3QgfHwgd2Via2l0U3BlZWNoR3JhbW1hckxpc3RcbiAgICB2YXIgU3BlZWNoUmVjb2duaXRpb25FdmVudCA9IFNwZWVjaFJlY29nbml0aW9uRXZlbnQgfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25FdmVudFxuICAgIHJlY29nbml0aW9uID0gbmV3IFNwZWVjaFJlY29nbml0aW9uKCk7XG4gICAgdmFyIGdyYW1tYXIgPSAnI0pTR0YgVjEuMDsgZ3JhbW1hciBiaW5vbWVkOyBwdWJsaWMgPGJpbm9tZWQ+ID0gc3VpdmFudCB8IHByw6ljw6lkZW50IHwgcHJlY2VkZW50IHwgc2xpZGUgfCBkaWFwb3NpdGl2ZSB8IHN1aXZhbnRlIHwgb3VpIDsnO1xuICAgIHZhciBzcGVlY2hSZWNvZ25pdGlvbkxpc3QgPSBuZXcgU3BlZWNoR3JhbW1hckxpc3QoKTtcbiAgICBzcGVlY2hSZWNvZ25pdGlvbkxpc3QuYWRkRnJvbVN0cmluZyhncmFtbWFyLCAxKTtcbiAgICByZWNvZ25pdGlvbi5ncmFtbWFycyA9IHNwZWVjaFJlY29nbml0aW9uTGlzdDtcbiAgICByZWNvZ25pdGlvbi5jb250aW51b3VzID0gdHJ1ZTtcbiAgICByZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcbiAgICByZWNvZ25pdGlvbi5pbnRlcmltUmVzdWx0cyA9IHRydWU7XG4gICAgcmVjb2duaXRpb24ub25yZXN1bHQgPSBoYW5kbGVWb2ljZVJlc3VsdHM7XG4gICAgcmVjb2duaXRpb24ub25lbmQgPSBoYW5kbGVWb2ljZUVuZDtcbiAgICByZWNvZ25pdGlvbi5vbmVycm9yID0gaGFuZGxlVm9pY2VFcnJvcjtcblxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSBzeW50aMOoc2Ugdm9jYWxlXG4gICAgc3ludGggPSB3aW5kb3cuc3BlZWNoU3ludGhlc2lzO1xuICAgIHBvcHVsYXRlVm9pY2VMaXN0KCk7XG4gICAgaWYgKHNwZWVjaFN5bnRoZXNpcy5vbnZvaWNlc2NoYW5nZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzcGVlY2hTeW50aGVzaXMub252b2ljZXNjaGFuZ2VkID0gcG9wdWxhdGVWb2ljZUxpc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKSB7XG4gICAgICAgIGlmICh2b2ljZUVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ3ZvaWNlJykge1xuICAgICAgICAgICAgaWYgKG1zZy52YWx1ZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgICAgIGlmICghZWx0TWljKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsdE1pYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vU3BlZWNoJyk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0TWljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwZWVjaF9pbnB1dCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1zZy52YWx1ZSA9PT0gJ3N0b3AnKSB7XG4gICAgICAgICAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGlzYXRpb24gZGUgbGEgcGFydGllIGNvbW11bnVpY2F0aW9uXG4gICAgc29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgaWYgKHNvY2tldExvY2FsKSB7XG4gICAgICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgfVxuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LXdlYnNwZWVjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2b2ljZUVuYWJsZSA9IHRydWU7XG5cbiAgICB9KTtcblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdG9wLXdlYnNwZWVjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2b2ljZUVuYWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAocmVjb2duaXRpb24pIHtcbiAgICAgICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogaW5pdFxufSJdfQ==
