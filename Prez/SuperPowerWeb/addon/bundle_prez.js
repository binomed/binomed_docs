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

function init(){

	// Code Connect
	managementGeneric('highlight-connect-ble', 
			'code-connect-ble', 
			'stop-code-connect-ble',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '400px'
			}
			]);

	// Code Read Characteristic
	managementGeneric('highlight-read-charact', 
			'code-read-charact', 
			'stop-code-read-charact',
			[
			{
				'top' : 'calc(90px + 3.45em)',
				'left' : '100px'
			},
			{
				'top' : 'calc(90px + 6.90em)',
				'width' : '500px'
			},
			{
				'top' : 'calc(90px + 10.35em)',
				'width' : '850px',
				'height' : '2.4em'
			}
			]);

	// Code Write Characteristic
	managementGeneric('highlight-write-charact', 
			'code-write-charact', 
			'stop-code-write-charact',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '1000px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '700px',
				'left' : '100px'
			},
			{
				'top' : 'calc(90px + 5.75em)',
				'width' : '800px'
			}
			]);

	// Code Orientation
	managementGeneric('highlight-orientation', 
			'code-orientation', 
			'stop-code-orientation',
			[
			{
				'top' : 'calc(90px + 8.05em)',
				'width' : '400px',
				'height' : '3.4em'
			}
			]);

	// Code Motion
	managementGeneric('highlight-motion', 
			'code-motion', 
			'stop-code-motion',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '750px',
				'height' : '4.4em'
			}
			]);


	// Code Battery
	managementGeneric('highlight-battery', 
			'code-battery', 
			'stop-code-battery',
			[
			{
				'top' : 'calc(90px + 4.6em)',
				'left' : '600px',
				'width' : '200px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 10.35em)',
				'left' : '60px',
				'width' : '1000px',
				'height' : '2.4em'
			}
			]);


	// Code User Media 1
	managementGeneric('highlight-user-media-v1', 
			'code-user-media-v1', 
			'stop-code-user-media-v1',
			[
			{
				'top' : 'calc(90px + 13.8em)',
				'left' : '60px',
				'width' : '1000px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 7.75em)',
				'left' : '190px',
				'width' : '210px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 7.75em)',
				'left' : '410px',
				'width' : '90px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 10.35em)',
				'left' : '100px',
				'width' : '800px',
				'height' : '2.4em'
			}
			]);

	// Code Device Proximity
	managementGeneric('highlight-device-proximity', 
			'code-device-proximity', 
			'stop-code-device-proximity',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'left' : '250px',
				'width' : '170px'
			}
			]);

	// Code User Proximity
	managementGeneric('highlight-user-proximity', 
			'code-user-proximity', 
			'stop-code-user-proximity',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'left' : '150px',
				'width' : '150px'
			}
			]);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovcHJlel9zdXBlcl9wb3dlci5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvb3JpZW50YXRpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy92b2ljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcyhsb2NhbCl7XG5cdGlmIChsb2NhbCB8fCAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKSl7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCJcblx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCI4MDAwXCIpe1xuXHRcdHJldHVybiBcImh0dHBzOi8vYmlub21lZC5mcjo4MDAwXCI7XG5cdH1lbHNle1xuXHRcdHJldHVybiBudWxsO1x0XG5cdH0gXG59XG5cbnZhciBhZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcygpO1xudmFyIGFkZHJlc3NMb2NhbCA9IGNhbGN1bGF0ZUFkZHJlc3ModHJ1ZSk7XG52YXIgbG9jYWwgPSBsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkcmVzcyA6IGFkZHJlc3MsXG4gICAgYWRkcmVzc0xvY2FsIDogYWRkcmVzc0xvY2FsLFxuXHRsb2NhbCA6IGxvY2FsXG59IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb250ZXh0ID0gbnVsbCxcblx0UFVCTElDID0gMSxcblx0V0FJVCA9IDIsXG5cdFJFU1AgPSAzLFxuXHRwdWJsaWNCdWZmZXIgPSBudWxsLFxuXHR3YWl0QnVmZmVyID0gbnVsbCxcblx0cmVzcEJ1ZmZlciA9IG51bGwsXG5cdGN1cnJlbnRTb3VyY2UgPSBudWxsO1xuXG50cnl7XG5cdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cdGNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59Y2F0Y2goZSl7XG5cdGNvbnRleHQgPSBudWxsO1xuXHRjb25zb2xlLmxvZyhcIk5vIFdlYkFQSSBkZWN0ZWN0XCIpO1xufVxuXG5mdW5jdGlvbiBsb2FkU291bmQodXJsLCBidWZmZXJUb1VzZSl7XG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdC8vIERlY29kZSBhc3luY2hyb25vdXNseVxuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdFx0aWYgKGJ1ZmZlclRvVXNlID09PSBQVUJMSUMpe1xuXHRcdCAgXHRcdHB1YmxpY0J1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gV0FJVCl7XG5cdFx0ICBcdFx0d2FpdEJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gUkVTUCl7XG5cdFx0ICBcdFx0cmVzcEJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1cblx0XHR9LCBmdW5jdGlvbihlKXtcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBkZWNvZGluZyBmaWxlJywgZSk7XG5cdFx0fSk7XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGxvYWRQdWJsaWNTb3VuZCgpe1xuXHRpZihjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvcXVlc3Rpb25fcHVibGljX2NvdXJ0ZS5tcDNcIiwgUFVCTElDKTtcbn1cblxuZnVuY3Rpb24gbG9hZFdhaXRTb3VuZCgpe1xuXHRpZiAoY29udGV4dClcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL2F0dGVudGVfcmVwb25zZV9jb3VydGUubXAzXCIsIFdBSVQpO1xufVxuXG5mdW5jdGlvbiBsb2FkUmVzcFNvdW5kKCl7XG5cdGlmIChjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvYm9ubmVfcmVwb25zZS5tcDNcIiwgUkVTUCk7XG59XG5cbmZ1bmN0aW9uIHBsYXlTb3VuZChidWZmZXIpe1xuXHR2YXIgc291cmNlID0gY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgLy8gY3JlYXRlcyBhIHNvdW5kIHNvdXJjZVxuXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyOyAgICAgICAgICAgICAgICAgICAgLy8gdGVsbCB0aGUgc291cmNlIHdoaWNoIHNvdW5kIHRvIHBsYXlcblx0c291cmNlLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7ICAgICAgIC8vIGNvbm5lY3QgdGhlIHNvdXJjZSB0byB0aGUgY29udGV4dCdzIGRlc3RpbmF0aW9uICh0aGUgc3BlYWtlcnMpXG5cdHNvdXJjZS5zdGFydCgwKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwbGF5IHRoZSBzb3VyY2Ugbm93XG5cdHJldHVybiBzb3VyY2U7XG59XG5cbmxvYWRQdWJsaWNTb3VuZCgpO1xubG9hZFdhaXRTb3VuZCgpO1xubG9hZFJlc3BTb3VuZCgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBBcGlzIGV4cG9zZWRcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qL1xuXG5mdW5jdGlvbiBwbGF5UHVibGljKCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZChwdWJsaWNCdWZmZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBsYXlXYWl0KCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZCh3YWl0QnVmZmVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwbGF5UmVzcCgpe1xuXHRpZiAoY29udGV4dCl7XG5cdFx0c3RvcCgpO1xuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQocmVzcEJ1ZmZlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RvcCgpe1xuXHRpZiAoY3VycmVudFNvdXJjZSAmJiBjdXJyZW50U291cmNlLnN0b3Ape1xuXHRcdGN1cnJlbnRTb3VyY2Uuc3RvcCgwKTtcblx0fVxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHBsYXlQdWJsaWMgOiBwbGF5UHVibGljLFxuXHRwbGF5V2FpdCA6IHBsYXlXYWl0LFxuXHRwbGF5UmVzcCA6IHBsYXlSZXNwLFxuXHRzdG9wIDogc3RvcFxufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnL2NvbmZpZycpLFxuXHRhdWRpbyA9IHJlcXVpcmUoJy4vYXVkaW8nKSxcblx0c29ja2V0ID0gbnVsbCxcblx0c2NvcmVJbmRleCA9IHt9O1xuXG5cblxuZnVuY3Rpb24gaGlkZVF1ZXN0aW9uKCl7XHRcblx0YXVkaW8uc3RvcCgpO1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnaGlkZVF1ZXN0aW9uJ1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlUXVlc3Rpb24oaW5kZXgpe1xuXHRhdWRpby5wbGF5UHVibGljKCk7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdjaGFuZ2VRdWVzdGlvbicsXG5cdFx0J2luZGV4JyA6IGluZGV4LFxuXHRcdHJlcEEgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQWApLmlubmVySFRNTCxcblx0XHRyZXBCIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEJgKS5pbm5lckhUTUwsXG5cdFx0cmVwQyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBDYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwRGApLmlubmVySFRNTCxcblxuXHR9KTtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ3Nob3dOb3RpZmljYXRpb24nXHRcdFxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzU2NvcmUoaW5kZXgpe1xuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7Y29uZmlnLmFkZHJlc3N9L3Njb3JlLyR7aW5kZXh9YCxteUluaXQpO1xuXHRmZXRjaChteVJlcXVlc3QpXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihqc29uKXtcblx0XHRhdWRpby5wbGF5V2FpdCgpO1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKHNjb3JlSW5kZXhbYHF1ZXN0aW9uXyR7aW5kZXh9YF0pe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHRsZXQgdG90YWwgPSBqc29uLnJlcEEgKyBqc29uLnJlcEIgKyBqc29uLnJlcEMgKyBqc29uLnJlcEQ7XG5cdFx0dmFyIGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjaGFydF9xdWVzdGlvbl8ke2luZGV4fWApLmdldENvbnRleHQoXCIyZFwiKTtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdCAgICBsYWJlbHM6IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIl0sXG5cdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0ICAgICAgICB7XG5cdFx0ICAgICAgICAgICAgbGFiZWw6IFwiQVwiLFxuXHRcdCAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNSlcIixcblx0XHQgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuOClcIixcblx0XHQgICAgICAgICAgICBoaWdobGlnaHRGaWxsOiBcInJnYmEoMjIwLDIyMCwyMjAsMC43NSlcIixcblx0XHQgICAgICAgICAgICBoaWdobGlnaHRTdHJva2U6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxuXHRcdCAgICAgICAgICAgIGRhdGE6IFtNYXRoLnJvdW5kKChqc29uLnJlcEEgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBCIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQyAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEQgLyB0b3RhbCkgKiAxMDApXVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICBdXG5cdFx0fTtcblx0XHR2YXIgbXlCYXJDaGFydCA9IG5ldyBDaGFydChjdHgpLkJhcihkYXRhLCB7XG5cdFx0XHQgLy9Cb29sZWFuIC0gV2hldGhlciBncmlkIGxpbmVzIGFyZSBzaG93biBhY3Jvc3MgdGhlIGNoYXJ0XG5cdCAgICBcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IGZhbHNlLFxuXHQgICAgXHQvLyBTdHJpbmcgLSBTY2FsZSBsYWJlbCBmb250IGNvbG91clxuXHQgICAgXHRzY2FsZUZvbnRDb2xvcjogXCJvcmFuZ2VcIixcblx0XHR9KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRhdWRpby5wbGF5UmVzcCgpO1xuXHRcdFx0bGV0IGdvb2RBbnN3ZXJFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1yZXNwLXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5nb29kYCk7XG5cdFx0XHRsZXQgYW53c2VyID0gZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEEnKSA/ICdBJyA6XG5cdFx0XHRcdFx0XHQgZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEInKSA/ICdCJyA6XG5cdFx0XHRcdFx0XHQgZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEMnKSA/ICdDJyA6ICdEJztcblx0XHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRcdFx0ZXZlbnRUeXBlIDogJ2Fuc3dlcicsXG5cdFx0XHRcdHZhbHVlIDogYW53c2VyXG5cdFx0XHR9KTtcdFx0XHQgXG5cdFx0XHRnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdGlmIChpbmRleCA9PT0gNCl7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdFx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRcdFx0XHRcdGV2ZW50VHlwZSA6ICdjYWxjdWxhdGVXaW5uZXJzJyxcblx0XHRcdFx0XHRcdG51bWJlcldpbm5lcnMgOiAyLFxuXHRcdFx0XHRcdFx0dmFsdWUgOiBhbndzZXJcblx0XHRcdFx0XHR9KTtcdFx0XG5cdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0fVxuXHRcdH0sIDUwMDApO1xuXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblx0aGlkZVF1ZXN0aW9uKCk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDEpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDEpO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMicsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMik7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMik7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0zJywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbigzKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTMnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSgzKTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTQnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDQpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tNCcsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDQpO1xuXHR9KTtcblxuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWl0LXF1ZXN0aW9uJywgaGlkZVF1ZXN0aW9uKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxuXG5mdW5jdGlvbiBtYW5hZ2VtZW50R2VuZXJpYyhpZEhpZ2hsaWdodEVsdCwgc3RhcnRFdmVudCwgc3RvcEV2ZW50LCBwb3NpdGlvbkFycmF5KXtcblxuXHR2YXIgZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJytpZEhpZ2hsaWdodEVsdCk7XG5cblx0ZnVuY3Rpb24gcHJvZ3Jlc3NGcmFnbWVudChldmVudCl7XG5cdFx0Ly8gZXZlbnQuZnJhZ21lbnQgLy8gdGhlIGRvbSBlbGVtZW50IGZyYWdtZW50XG5cdFx0dHJ5e1x0XHRcdFxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJyl7XG5cdFx0XHRcdHZhciBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcblx0XHRcdFx0dmFyIHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4XTtcblx0XHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHR2YXIga2V5ID0ga2V5c1tpXTtcblx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1lbHNlIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuXHRcdFx0XHQvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuXHRcdFx0XHR2YXIgcHJvcGVydGllcyA9IHBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXHRcdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdHZhciBrZXkgPSBrZXlzW2ldO1xuXHRcdFx0XHRcdGVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaW5kZXggPiAwKXtcdFx0XHRcblx0XHRcdFx0XHRwcm9wZXJ0aWVzID0gcG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuXHRcdFx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0dmFyIGtleSA9IGtleXNbaV07XG5cdFx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVx0XHRcdFxuXHRcdFx0fVxuXHRcdH1jYXRjaChlKXt9XG5cdH1cblxuXHRmdW5jdGlvbiBsaXN0ZW5GcmFnbWVudHMoKXtcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHByb2dyZXNzRnJhZ21lbnQpO1xuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHByb2dyZXNzRnJhZ21lbnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdW5yZWdpc3RlckZyYWdtZW50cygpe1xuXHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgcHJvZ3Jlc3NGcmFnbWVudCk7XG5cdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgcHJvZ3Jlc3NGcmFnbWVudCk7XG5cdH1cblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihzdGFydEV2ZW50LCBmdW5jdGlvbigpe1xuXHRcdGxpc3RlbkZyYWdtZW50cygpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoc3RvcEV2ZW50LCBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXJGcmFnbWVudHMoKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKXtcblxuXHQvLyBDb2RlIENvbm5lY3Rcblx0bWFuYWdlbWVudEdlbmVyaWMoJ2hpZ2hsaWdodC1jb25uZWN0LWJsZScsIFxuXHRcdFx0J2NvZGUtY29ubmVjdC1ibGUnLCBcblx0XHRcdCdzdG9wLWNvZGUtY29ubmVjdC1ibGUnLFxuXHRcdFx0W1xuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyAxLjE1ZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc0MDBweCdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cdC8vIENvZGUgUmVhZCBDaGFyYWN0ZXJpc3RpY1xuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LXJlYWQtY2hhcmFjdCcsIFxuXHRcdFx0J2NvZGUtcmVhZC1jaGFyYWN0JywgXG5cdFx0XHQnc3RvcC1jb2RlLXJlYWQtY2hhcmFjdCcsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDMuNDVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMTAwcHgnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyA2LjkwZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc1MDBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEwLjM1ZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc4NTBweCcsXG5cdFx0XHRcdCdoZWlnaHQnIDogJzIuNGVtJ1xuXHRcdFx0fVxuXHRcdFx0XSk7XG5cblx0Ly8gQ29kZSBXcml0ZSBDaGFyYWN0ZXJpc3RpY1xuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LXdyaXRlLWNoYXJhY3QnLCBcblx0XHRcdCdjb2RlLXdyaXRlLWNoYXJhY3QnLCBcblx0XHRcdCdzdG9wLWNvZGUtd3JpdGUtY2hhcmFjdCcsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEuMTVlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzEwMDBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDQuNjBlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzcwMHB4Jyxcblx0XHRcdFx0J2xlZnQnIDogJzEwMHB4J1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgNS43NWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnODAwcHgnXG5cdFx0XHR9XG5cdFx0XHRdKTtcblxuXHQvLyBDb2RlIE9yaWVudGF0aW9uXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtb3JpZW50YXRpb24nLCBcblx0XHRcdCdjb2RlLW9yaWVudGF0aW9uJywgXG5cdFx0XHQnc3RvcC1jb2RlLW9yaWVudGF0aW9uJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgOC4wNWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNDAwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICczLjRlbSdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cdC8vIENvZGUgTW90aW9uXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtbW90aW9uJywgXG5cdFx0XHQnY29kZS1tb3Rpb24nLCBcblx0XHRcdCdzdG9wLWNvZGUtbW90aW9uJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMi4zMGVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNzUwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICc0LjRlbSdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cblx0Ly8gQ29kZSBCYXR0ZXJ5XG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtYmF0dGVyeScsIFxuXHRcdFx0J2NvZGUtYmF0dGVyeScsIFxuXHRcdFx0J3N0b3AtY29kZS1iYXR0ZXJ5Jyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgNC42ZW0pJyxcblx0XHRcdFx0J2xlZnQnIDogJzYwMHB4Jyxcblx0XHRcdFx0J3dpZHRoJyA6ICcyMDBweCcsXG5cdFx0XHRcdCdoZWlnaHQnIDogJzEuNGVtJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMTAuMzVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnNjBweCcsXG5cdFx0XHRcdCd3aWR0aCcgOiAnMTAwMHB4Jyxcblx0XHRcdFx0J2hlaWdodCcgOiAnMi40ZW0nXG5cdFx0XHR9XG5cdFx0XHRdKTtcblxuXG5cdC8vIENvZGUgVXNlciBNZWRpYSAxXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtdXNlci1tZWRpYS12MScsIFxuXHRcdFx0J2NvZGUtdXNlci1tZWRpYS12MScsIFxuXHRcdFx0J3N0b3AtY29kZS11c2VyLW1lZGlhLXYxJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMTMuOGVtKScsXG5cdFx0XHRcdCdsZWZ0JyA6ICc2MHB4Jyxcblx0XHRcdFx0J3dpZHRoJyA6ICcxMDAwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICcxLjRlbSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDcuNzVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMTkwcHgnLFxuXHRcdFx0XHQnd2lkdGgnIDogJzIxMHB4Jyxcblx0XHRcdFx0J2hlaWdodCcgOiAnMS40ZW0nXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyA3Ljc1ZW0pJyxcblx0XHRcdFx0J2xlZnQnIDogJzQxMHB4Jyxcblx0XHRcdFx0J3dpZHRoJyA6ICc5MHB4Jyxcblx0XHRcdFx0J2hlaWdodCcgOiAnMS40ZW0nXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyAxMC4zNWVtKScsXG5cdFx0XHRcdCdsZWZ0JyA6ICcxMDBweCcsXG5cdFx0XHRcdCd3aWR0aCcgOiAnODAwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICcyLjRlbSdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cdC8vIENvZGUgRGV2aWNlIFByb3hpbWl0eVxuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LWRldmljZS1wcm94aW1pdHknLCBcblx0XHRcdCdjb2RlLWRldmljZS1wcm94aW1pdHknLCBcblx0XHRcdCdzdG9wLWNvZGUtZGV2aWNlLXByb3hpbWl0eScsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEuMTVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMjUwcHgnLFxuXHRcdFx0XHQnd2lkdGgnIDogJzE3MHB4J1xuXHRcdFx0fVxuXHRcdFx0XSk7XG5cblx0Ly8gQ29kZSBVc2VyIFByb3hpbWl0eVxuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LXVzZXItcHJveGltaXR5JywgXG5cdFx0XHQnY29kZS11c2VyLXByb3hpbWl0eScsIFxuXHRcdFx0J3N0b3AtY29kZS11c2VyLXByb3hpbWl0eScsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEuMTVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMTUwcHgnLFxuXHRcdFx0XHQnd2lkdGgnIDogJzE1MHB4J1xuXHRcdFx0fVxuXHRcdFx0XSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59OyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcvY29uZmlnJyk7XG5cbmZ1bmN0aW9uIHBvc3RQcm9kQ29kZUhpbGlnaHQoKXtcblx0dmFyIGFycmF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnY29kZS50b0hpbGlnaHQnKTtcblx0Zm9yICh2YXIgaSA9MDsgaSA8YXJyYXkubGVuZ3RoOyBpKyspe1xuXHRcdHZhciBsZW5ndGggPSAwO1xuXHRcdHZhciB0ZXh0Q29kZSA9IGFycmF5W2ldLmlubmVySFRNTDtcblx0XHRkb3tcblx0XHRcdGxlbmd0aCA9IHRleHRDb2RlLmxlbmd0aDtcblx0XHRcdHRleHRDb2RlID0gdGV4dENvZGUucmVwbGFjZSgnJmx0O21hcmsmZ3Q7JywgJzxtYXJrPicpO1xuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7bWFyayBjbGFzcz1cImRpbGx1YXRlXCImZ3Q7JywgJzxtYXJrIGNsYXNzPVwiZGlsbHVhdGVcIj4nKTtcblx0XHRcdHRleHRDb2RlID0gdGV4dENvZGUucmVwbGFjZSgnJmx0Oy9tYXJrJmd0OycsICc8L21hcms+Jyk7XG5cdFx0fXdoaWxlKGxlbmd0aCAhPSB0ZXh0Q29kZS5sZW5ndGgpO1xuXHRcdGFycmF5W2ldLmlubmVySFRNTCA9IHRleHRDb2RlO1xuXG5cdH1cbn1cblxuUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdyZWFkeScsIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAvLyBldmVudC5jdXJyZW50U2xpZGUsIGV2ZW50LmluZGV4aCwgZXZlbnQuaW5kZXh2XG5cdGNvbnNvbGUubG9nKCdSZXZlYWxKUyBSZWFkeScpO1xuICAgIFxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIFx0cG9zdFByb2RDb2RlSGlsaWdodCgpO1xuXHR9LCA1MDApO1xuXHRcblx0bGV0IGluSUZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblx0XG4gICAgXG5cdGlmICghaW5JRnJhbWUgJiYgaW8gJiYgY29uZmlnLmFkZHJlc3Mpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvIHRvIGNvbmRpdGlvbiAhXCIpO1xuXHRcdGxldCBzb2NrZXRHYW1lID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XG5cdFx0cmVxdWlyZSgnLi9nYW1lL3ByZXpfZ2FtZScpLmluaXQoc29ja2V0R2FtZSk7XG5cdFx0bGV0IHNvY2tldFByZXogPSBudWxsO1xuXHRcdGxldCBzb2NrZXRQcmV6TG9jYWwgPSBudWxsO1xuXHRcdGlmIChjb25maWcubG9jYWwpe1xuXHRcdFx0c29ja2V0UHJleiA9IHNvY2tldEdhbWU7ICAgXG5cdFx0fWVsc2V7XG5cdFx0XHRzb2NrZXRQcmV6ID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XG5cdFx0XHRzb2NrZXRQcmV6TG9jYWwgPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzTG9jYWwpO1xuXHRcdH1cbiBcbiBcdFx0Ly9zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIGxpZ2h0XCIpO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL2xpZ2h0JykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIE9yaWVudGF0aW9uXCIpO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL29yaWVudGF0aW9uJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIERldmljZU1vdGlvblwiKTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9kZXZpY2Vtb3Rpb24nKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgVm9pY2VcIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvdm9pY2UnKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgVXNlck1lZGlhXCIpO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL3VzZXJtZWRpYScpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcbiBcdFx0XHRcbiBcdFx0Ly99LCAxMDAwKTtcblx0fVx0XG5cblx0cmVxdWlyZSgnLi9oaWdobGlnaHRzL2hpZ2hsaWdodHNDb2RlJykuaW5pdCgpO1xuIFxuXHRcbn0gKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgbW90aW9uRW5hYmxlID0gZmFsc2UsXG4gICAgbW90aW9uRWx0ID0gbnVsbCxcbiAgICBiYXR0ZXJ5MUVsdCA9IG51bGwsXG4gICAgYmF0dGVyeTJFbHQgPSBudWxsLFxuICAgIGNoYXJnZUJhdHRlcnkxID0gMCxcbiAgICBjaGFyZ2VCYXR0ZXJ5MiA9IDAsXG4gICAgd2lubmVyID0gbnVsbCxcbiAgICBmdWxsVmFsdWUxID0gMTAwMDAsXG4gICAgZnVsbFZhbHVlMiA9IDEwMDAwLFxuICAgIG1hcFVzZXJzQWN0aXYgPSB7fTtcblxuXG5cblxuZnVuY3Rpb24gYmF0VXBkYXRlKHRlYW0sIGNoYXJnZSkge1xuICAgIGxldCBjb2wgPSBbXSxcbiAgICAgICAgZWx0ID0gbnVsbDtcbiAgICBpZiAodGVhbSA9PT0gXCIxXCIpIHtcbiAgICAgICAgZWx0ID0gYmF0dGVyeTFFbHQ7XG4gICAgICAgIC8vIFJlZCAtIERhbmdlciFcbiAgICAgICAgY29sID0gW1wiIzc1MDkwMFwiLCBcIiNjNjQ2MmJcIiwgXCIjYjc0NDI0XCIsIFwiI2RmMGEwMFwiLCBcIiM1OTA3MDBcIl07XG4gICAgfSAvKmVsc2UgaWYgKGNoYXJnZSA8IDQwKSB7XG4gICAgLy8gWWVsbG93IC0gTWlnaHQgd2FubmEgY2hhcmdlIHNvb24uLi5cbiAgICBjb2wgPSBbXCIjNzU0ZjAwXCIsIFwiI2YyYmIwMFwiLCBcIiNkYmIzMDBcIiwgXCIjZGY4ZjAwXCIsIFwiIzU5M2MwMFwiXTtcbiAgfSAqL2Vsc2Uge1xuICAgICAgICBlbHQgPSBiYXR0ZXJ5MkVsdDtcbiAgICAgICAgLy8gR3JlZW4gLSBBbGwgZ29vZCFcbiAgICAgICAgY29sID0gW1wiIzMxNmQwOFwiLCBcIiM2MGI5MzlcIiwgXCIjNTFhYTMxXCIsIFwiIzY0Y2UxMVwiLCBcIiMyNTU0MDVcIl07XG4gICAgfVxuICAgIGVsdC5zdHlsZVtcImJhY2tncm91bmQtaW1hZ2VcIl0gPSBcImxpbmVhci1ncmFkaWVudCh0byByaWdodCwgdHJhbnNwYXJlbnQgNSUsIFwiICsgY29sWzBdICsgXCIgNSUsIFwiICsgY29sWzBdICsgXCIgNyUsIFwiICsgY29sWzFdICsgXCIgOCUsIFwiICsgY29sWzFdICsgXCIgMTAlLCBcIiArIGNvbFsyXSArIFwiIDExJSwgXCIgKyBjb2xbMl0gKyBcIiBcIiArIChjaGFyZ2UgLSAzKSArIFwiJSwgXCIgKyBjb2xbM10gKyBcIiBcIiArIChjaGFyZ2UgLSAyKSArIFwiJSwgXCIgKyBjb2xbM10gKyBcIiBcIiArIGNoYXJnZSArIFwiJSwgXCIgKyBjb2xbNF0gKyBcIiBcIiArIGNoYXJnZSArIFwiJSwgYmxhY2sgXCIgKyAoY2hhcmdlICsgNSkgKyBcIiUsIGJsYWNrIDk1JSwgdHJhbnNwYXJlbnQgOTUlKSwgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpIDAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNCkgNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA3JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDE0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjgpIDE0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQwJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSA0MSUsIHJnYmEoMjU1LDI1NSwyNTUsMCkgODAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgODAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNCkgODYlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNikgOTAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMSkgOTIlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMSkgOTUlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSkgOTglKVwiO1xufVxuXG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCkge1xuXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKSB7XG4gICAgICAgIGlmIChtb3Rpb25FbmFibGUgJiYgbXNnLnR5cGUgPT09ICdkZXZpY2Vtb3Rpb24nKSB7XG4gICAgICAgICAgICBpZiAoIXdpbm5lciAmJiBtc2cudGVhbSkge1xuICAgICAgICAgICAgICAgIGxldCB0bXBVc2VyVGVhbSA9IG1hcFVzZXJzQWN0aXZbbXNnLmlkXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRtcFVzZXJUZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcFVzZXJzQWN0aXZbbXNnLmlkXSA9IG1zZy50ZWFtO1xuICAgICAgICAgICAgICAgICAgICBpZiAobXNnLnRlYW0gPT09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsVmFsdWUxICs9IDEwMDAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1zZy50ZWFtID09PSBcIjJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFZhbHVlMiArPSAxMDAwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgcGVyY2VudCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKG1zZy50ZWFtID09PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICBjaGFyZ2VCYXR0ZXJ5MSArPSBtc2cudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSBNYXRoLnJvdW5kKChjaGFyZ2VCYXR0ZXJ5MSAvIGZ1bGxWYWx1ZTEpICogMTAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGFyZ2VCYXR0ZXJ5MiArPSBtc2cudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSBNYXRoLnJvdW5kKChjaGFyZ2VCYXR0ZXJ5MiAvIGZ1bGxWYWx1ZTIpICogMTAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBiYXRVcGRhdGUobXNnLnRlYW0sIE1hdGgubWluKHBlcmNlbnQsIDkwKSk7XG4gICAgICAgICAgICAgICAgaWYgKCF3aW5uZXIgJiYgTWF0aC5taW4ocGVyY2VudCwgOTApID09PSA5MCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5uZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAobXNnLnRlYW0gPT09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV2aWNlbW90aW9uIC53aW4uZmlyZWZveCcpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldmljZW1vdGlvbiAud2luLmNocm9tZScpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcbiAgICAgICAgc29ja2V0TG9jYWwub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICB9XG4gICAgYmF0dGVyeTFFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYmF0dGVyeS0xJyk7XG4gICAgYmF0dGVyeTJFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYmF0dGVyeS0yJyk7XG5cbiAgICBiYXRVcGRhdGUoXCIxXCIsIDApO1xuICAgIGJhdFVwZGF0ZShcIjJcIiwgMCk7XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RhcnQtZGV2aWNlbW90aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNvY2tldC5lbWl0KCdjb25maWcnLCB7XG4gICAgICAgICAgICB0eXBlOiBcImdhbWVcIixcbiAgICAgICAgICAgIGV2ZW50VHlwZTogXCJiYXR0ZXJ5XCIsXG4gICAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBtb3Rpb25FbmFibGUgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AtZGV2aWNlbW90aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNvY2tldC5lbWl0KCdjb25maWcnLCB7XG4gICAgICAgICAgICB0eXBlOiBcImdhbWVcIixcbiAgICAgICAgICAgIGV2ZW50VHlwZTogXCJiYXR0ZXJ5XCIsXG4gICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgbW90aW9uRW5hYmxlID0gZmFsc2U7XG4gICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgbGlnaHRFbmFibGUgPSBmYWxzZSxcblx0bGlnaHRFbHQgPSBudWxsO1xuXG5cbi8vIFdlIHVwZGF0ZSB0aGUgY3NzIFN0eWxlXG5mdW5jdGlvbiB1cGRhdGVMaWdodChkYXRhKXtcblx0bGV0IHByZWZpeExpZ2h0ID0gJy13ZWJraXQtJztcblx0bGV0IHBlcmNlbnQgPSBkYXRhO1xuXHR2YXIgc3R5bGUgPSBwcmVmaXhMaWdodCsncmFkaWFsLWdyYWRpZW50KGNlbnRlciwgJ1xuXHQgICAgKycgZWxsaXBzZSBjb3ZlciwgJ1xuXHQgICAgKycgcmdiYSgxOTgsMTk3LDE0NSwxKSAwJSwnXG5cdCAgICArJyByZ2JhKDAsMCwwLDEpICcrcGVyY2VudCsnJSknXG5cdCAgICA7XG5cdGxpZ2h0RWx0LnN0eWxlLmJhY2tncm91bmQgPSBzdHlsZTtcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKXtcblxuICAgIGZ1bmN0aW9uIGNhbGxCYWNrU2Vuc29yKG1zZyl7XG5cdFx0aWYgKGxpZ2h0RW5hYmxlICYmIG1zZy50eXBlID09PSAnbGlnaHQnKXtcblx0XHRcdHVwZGF0ZUxpZ2h0KG1zZy52YWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgaWYgKHNvY2tldExvY2FsKXtcblx0ICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgfVxuXHRsaWdodEVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saWdodC1iZycpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtbGlnaHQnLCBmdW5jdGlvbigpe1xuXHRcdGxpZ2h0RW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLWxpZ2h0JywgZnVuY3Rpb24oKXtcblx0XHRsaWdodEVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2UsIFxuXHRsb2NrRWx0ID0gbnVsbCxcblx0cmVzRWx0ID0gbnVsbCxcblx0b3BlbiA9IGZhbHNlO1xuXG5jb25zdCB2YWx1ZXMgPSB7IGZpcnN0IDoge3ZhbHVlOiA1MCwgZm91bmQ6IGZhbHNlfSwgXG5cdFx0XHRcdHNlY29uZCA6IHt2YWx1ZTogODAsIGZvdW5kOiBmYWxzZX0sIFxuXHRcdFx0XHR0aGlyZCA6IHt2YWx1ZSA6IDEwLCBmb3VuZCA6IGZhbHNlfVxuXHRcdFx0fTtcblxuXG4vLyBBY2NvcmRpbmcgdG8gdGhlIG51bWJlciBvZiB1bmxvY2ssIHdlIGp1c3QgdHVybiB0aGUgaW1hZ2Ugb3Igd2Ugb3BlbiB0aGUgZG9vclxuZnVuY3Rpb24gdXBkYXRlUm90YXRpb24oekFscGhhLCBmaXJzdFZhbHVlKXtcblx0aWYgKCFvcGVuKXtcblx0XHRsZXQgZGVsdGEgPSBmaXJzdFZhbHVlIC0gekFscGhhO1xuXHRcdGxldCByb3RhdGlvbiA9IGRlbHRhO1xuXHRcdGlmIChkZWx0YSA8IDApe1xuXHRcdFx0cm90YXRpb24gPSBmaXJzdFZhbHVlKzM2MC16QWxwaGE7XG5cdFx0fVx0XHRcblx0XHRsb2NrRWx0LnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGVaKCcrcm90YXRpb24rJ2RlZyknO1xuXG5cdFx0bGV0IGN1cnJlbnRWYWx1ZSA9IDEwMCAtIE1hdGgucm91bmQoKHJvdGF0aW9uKjEwMCkvMzYwKTtcblx0XHRyZXNFbHQuaW5uZXJIVE1MID0gY3VycmVudFZhbHVlO1xuXHRcdGlmICh2YWx1ZXMuZmlyc3QuZm91bmQgXG5cdFx0XHQmJiB2YWx1ZXMuc2Vjb25kLmZvdW5kXG5cdFx0XHQmJiB2YWx1ZXMudGhpcmQuZm91bmQpe1x0XHRcdFxuXHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24nKS5jbGFzc0xpc3QuYWRkKFwib3BlblwiKTtcblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy5maXJzdC5mb3VuZCkge1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLmZpcnN0LnZhbHVlKXtcdFx0XHRcdFxuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLmZpcnN0Jyk7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LnJlbW92ZShcImZhLXRpbWVzLWNpcmNsZVwiKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuXHRcdFx0XHR2YWx1ZXMuZmlyc3QuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1lbHNlIGlmICghdmFsdWVzLnNlY29uZC5mb3VuZCkge1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLnNlY29uZC52YWx1ZSl7XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAuc2Vjb25kJyk7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LnJlbW92ZShcImZhLXRpbWVzLWNpcmNsZVwiKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuXHRcdFx0XHR2YWx1ZXMuc2Vjb25kLmZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy50aGlyZC5mb3VuZCkge1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLnRoaXJkLnZhbHVlKXtcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC50aGlyZCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLnRoaXJkLmZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCl7XG5cbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpe1xuXHRcdGlmIChvcmllbnRhdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ29yaWVudGF0aW9uJyl7XG5cdFx0XHR1cGRhdGVSb3RhdGlvbihtc2cudmFsdWUsIG1zZy5maXJzdFZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICBpZihzb2NrZXRMb2NhbCl7XG5cdCAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIH1cblxuXHRsb2NrRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNhZmVfbG9jaycpO1xuXHRyZXNFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3JpZW50YXRpb24gLnJlc3AgLnZhbHVlJyk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1vcmllbnRhdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0b3JpZW50YXRpb25FbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3Atb3JpZW50YXRpb24nLCBmdW5jdGlvbigpe1xuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2U7XG5cdH0pO1x0XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCB1c2VybWVkaWFFbmFibGUgPSBmYWxzZSxcbiAgICB1c2VybWVkaWFFbHQgPSBudWxsO1xuXG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKSB7XG5cbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcbiAgICAgICAgaWYgKHVzZXJtZWRpYUVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ3VzZXJtZWRpYScpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwaG90b1N0cmVhbScpLnNldEF0dHJpYnV0ZSgnc3JjJywgbXNnLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvY2tldC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuXG4gICAgaWYgKHNvY2tldExvY2FsKSB7XG4gICAgICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgfVxuICAgIHVzZXJtZWRpYUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybWVkaWEtYmcnKTtcblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC11c2VybWVkaWEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdXNlcm1lZGlhRW5hYmxlID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdG9wLXVzZXJtZWRpYScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB1c2VybWVkaWFFbmFibGUgPSBmYWxzZTtcbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCB2b2ljZUVuYWJsZSA9IGZhbHNlLFxuICAgIHZvaWNlRlIgPSBudWxsLFxuICAgIHN5bnRoID0gbnVsbCxcbiAgICByZWNvZ25pdGlvbiA9IG51bGwsXG4gICAgcmVjb2duaXRpb25Eb25lID0gZmFsc2UsXG4gICAgbmV4dFNsaWRlID0gZmFsc2UsXG4gICAgZWx0TWljID0gbnVsbCxcbiAgICBpbnB1dE1pYyA9IG51bGxcbiAgICA7XG5cbmZ1bmN0aW9uIHBvcHVsYXRlVm9pY2VMaXN0KCkge1xuICAgIGxldCB2b2ljZXMgPSBzeW50aC5nZXRWb2ljZXMoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZvaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodm9pY2VzW2ldLmxhbmcgPT09ICdmci1GUicpIHtcbiAgICAgICAgICAgIHZvaWNlRlIgPSB2b2ljZXNbaV07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiVzLCAlTyBcIiwgdm9pY2VzW2ldLmxhbmcsIHZvaWNlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVZvaWNlUmVzdWx0cyhldmVudCkge1xuICAgIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHJlc3VsdHMgcHJvcGVydHkgcmV0dXJucyBhIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3RcbiAgICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25SZXN1bHRMaXN0IG9iamVjdCBjb250YWlucyBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBvYmplY3RzLlxuICAgIC8vIEl0IGhhcyBhIGdldHRlciBzbyBpdCBjYW4gYmUgYWNjZXNzZWQgbGlrZSBhbiBhcnJheVxuICAgIC8vIFRoZSBmaXJzdCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgYXQgcG9zaXRpb24gMC5cbiAgICAvLyBFYWNoIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdCBjb250YWlucyBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIG9iamVjdHMgdGhhdCBjb250YWluIGluZGl2aWR1YWwgcmVzdWx0cy5cbiAgICAvLyBUaGVzZSBhbHNvIGhhdmUgZ2V0dGVycyBzbyB0aGV5IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFycmF5cy5cbiAgICAvLyBUaGUgc2Vjb25kIFswXSByZXR1cm5zIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIGF0IHBvc2l0aW9uIDAuXG4gICAgLy8gV2UgdGhlbiByZXR1cm4gdGhlIHRyYW5zY3JpcHQgcHJvcGVydHkgb2YgdGhlIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0IFxuICAgIHZhciBmaW5hbFN0ciA9IGV2ZW50LnJlc3VsdHNbMF1bMF0udHJhbnNjcmlwdDtcbiAgICBpbnB1dE1pYy5pbm5lckhUTUwgPSBmaW5hbFN0cjtcbiAgICAvL2RpYWdub3N0aWMudGV4dENvbnRlbnQgPSAnUmVzdWx0IHJlY2VpdmVkOiAnICsgY29sb3IgKyAnLic7XG4gICAgLy9iZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcbiAgICBjb25zb2xlLmxvZygnQ29uZmlkZW5jZTogJyArIGZpbmFsU3RyKTtcbiAgICBpZiAoZmluYWxTdHIuaW5kZXhPZignc3VpdmFudCcpICE9IC0xKSB7XG4gICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICAgICAgaWYgKCFyZWNvZ25pdGlvbkRvbmUpIHtcbiAgICAgICAgICAgIHJlY29nbml0aW9uRG9uZSA9IHRydWU7XG4gICAgICAgICAgICBzcGVhayhcIkJvbmpvdXIgSkYsIGonYWkgY29tcHJpcyBxdWUgdHUgdm91bGFpcyBwYXNzZXIgYXUgc2xpZGUgc3VpdmFudCwgYWlzIGplIGJpZW4gY29tcHJpcyA/XCIpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbiBkZSBzcGVlY2hcIilcbiAgICAgICAgICAgICAgICAgICAgcmVjb2duaXRpb24uc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gdm9pY2VGUlwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmluYWxTdHIuaW5kZXhPZignb3VpJykgIT0gLTEpIHtcbiAgICAgICAgaWYgKCFuZXh0U2xpZGUpIHtcbiAgICAgICAgICAgIG5leHRTbGlkZSA9IHRydWU7XG4gICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVWb2ljZUVuZCgpIHtcbiAgICAvLyBXZSBkZXRlY3QgdGhlIGVuZCBvZiBzcGVlY2hSZWNvZ25pdGlvbiBwcm9jZXNzXG4gICAgY29uc29sZS5sb2coJ0VuZCBvZiByZWNvZ25pdGlvbicpXG4gICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufTtcblxuLy8gV2UgZGV0ZWN0IGVycm9yc1xuZnVuY3Rpb24gaGFuZGxlVm9pY2VFcnJvcihldmVudCkge1xuICAgIGlmIChldmVudC5lcnJvciA9PSAnbm8tc3BlZWNoJykge1xuICAgICAgICBjb25zb2xlLmxvZygnTm8gU3BlZWNoJyk7XG4gICAgfVxuICAgIGlmIChldmVudC5lcnJvciA9PSAnYXVkaW8tY2FwdHVyZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ05vIG1pY3JvcGhvbmUnKVxuICAgIH1cbiAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vdC1hbGxvd2VkJykge1xuICAgICAgICBjb25zb2xlLmxvZygnTm90IEFsbG93ZWQnKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBzcGVhayh2YWx1ZSwgY2FsbGJhY2tFbmQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgaWYgKCF2b2ljZUZSKSB7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXR0ZXJUaGlzID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSh2YWx1ZSk7XG4gICAgICAgIHV0dGVyVGhpcy52b2ljZSA9IHZvaWNlRlI7XG4gICAgICAgIHV0dGVyVGhpcy5waXRjaCA9IDE7XG4gICAgICAgIHV0dGVyVGhpcy5yYXRlID0gMTtcbiAgICAgICAgdXR0ZXJUaGlzLm9uZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3ludGguc3BlYWsodXR0ZXJUaGlzKTtcbiAgICB9KTtcbn1cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpIHtcblxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSByZWNvbm5haXNzYW5jZSB2b2NhbGVcbiAgICB2YXIgU3BlZWNoUmVjb2duaXRpb24gPSBTcGVlY2hSZWNvZ25pdGlvbiB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvblxuICAgIHZhciBTcGVlY2hHcmFtbWFyTGlzdCA9IFNwZWVjaEdyYW1tYXJMaXN0IHx8IHdlYmtpdFNwZWVjaEdyYW1tYXJMaXN0XG4gICAgdmFyIFNwZWVjaFJlY29nbml0aW9uRXZlbnQgPSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uRXZlbnRcbiAgICByZWNvZ25pdGlvbiA9IG5ldyBTcGVlY2hSZWNvZ25pdGlvbigpO1xuICAgIHZhciBncmFtbWFyID0gJyNKU0dGIFYxLjA7IGdyYW1tYXIgYmlub21lZDsgcHVibGljIDxiaW5vbWVkPiA9IHN1aXZhbnQgfCBwcsOpY8OpZGVudCB8IHByZWNlZGVudCB8IHNsaWRlIHwgZGlhcG9zaXRpdmUgfCBzdWl2YW50ZSB8IG91aSA7JztcbiAgICB2YXIgc3BlZWNoUmVjb2duaXRpb25MaXN0ID0gbmV3IFNwZWVjaEdyYW1tYXJMaXN0KCk7XG4gICAgc3BlZWNoUmVjb2duaXRpb25MaXN0LmFkZEZyb21TdHJpbmcoZ3JhbW1hciwgMSk7XG4gICAgcmVjb2duaXRpb24uZ3JhbW1hcnMgPSBzcGVlY2hSZWNvZ25pdGlvbkxpc3Q7XG4gICAgcmVjb2duaXRpb24uY29udGludW91cyA9IHRydWU7XG4gICAgcmVjb2duaXRpb24ubGFuZyA9ICdmci1GUic7XG4gICAgcmVjb2duaXRpb24uaW50ZXJpbVJlc3VsdHMgPSB0cnVlO1xuICAgIHJlY29nbml0aW9uLm9ucmVzdWx0ID0gaGFuZGxlVm9pY2VSZXN1bHRzO1xuICAgIHJlY29nbml0aW9uLm9uZW5kID0gaGFuZGxlVm9pY2VFbmQ7XG4gICAgcmVjb2duaXRpb24ub25lcnJvciA9IGhhbmRsZVZvaWNlRXJyb3I7XG5cbiAgICAvLyBJbml0aWFsaXNhdGlvbiBkZSBsYSBwYXJ0aWUgc3ludGjDqHNlIHZvY2FsZVxuICAgIHN5bnRoID0gd2luZG93LnNwZWVjaFN5bnRoZXNpcztcbiAgICBwb3B1bGF0ZVZvaWNlTGlzdCgpO1xuICAgIGlmIChzcGVlY2hTeW50aGVzaXMub252b2ljZXNjaGFuZ2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3BlZWNoU3ludGhlc2lzLm9udm9pY2VzY2hhbmdlZCA9IHBvcHVsYXRlVm9pY2VMaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGxCYWNrU2Vuc29yKG1zZykge1xuICAgICAgICBpZiAodm9pY2VFbmFibGUgJiYgbXNnLnR5cGUgPT09ICd2b2ljZScpIHtcbiAgICAgICAgICAgIGlmIChtc2cudmFsdWUgPT09ICdzdGFydCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVsdE1pYykge1xuICAgICAgICAgICAgICAgICAgICBlbHRNaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtb1NwZWVjaCcpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dE1pYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGVlY2hfaW5wdXQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdGFydCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtc2cudmFsdWUgPT09ICdzdG9wJykge1xuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSBjb21tdW51aWNhdGlvblxuICAgIHNvY2tldC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIGlmIChzb2NrZXRMb2NhbCkge1xuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIH1cblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC13ZWJzcGVlY2gnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdm9pY2VFbmFibGUgPSB0cnVlO1xuXG4gICAgfSk7XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcC13ZWJzcGVlY2gnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdm9pY2VFbmFibGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHJlY29nbml0aW9uKSB7XG4gICAgICAgICAgICByZWNvZ25pdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGluaXRcbn0iXX0=
