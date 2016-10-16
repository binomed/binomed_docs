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
		try{
			listenFragments();
		}catch(e){
			console.error(e);
		}
	});
	Reveal.addEventListener(stopEvent, function(){
		try{
			unregisterFragments();
		}catch(e){
			console.error(e);
		}
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

	// Code Web Speech
	managementGeneric('highlight-web-speech', 
			'code-web-speech', 
			'stop-code-web-speech',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '400px'
			},
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '500px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '550px'			
			},
			{
				'top' : 'calc(90px + 5.75em)',
				'width' : '300px'			
			},
			{
				'top' : 'calc(90px + 6.90em)',
				'width' : '300px'
			},
			{
				'top' : 'calc(90px + 8.05em)',				
				'left' : '300px',
				'width' : '450px'
			}
			]);

	// Code Web Speech Grammar
	managementGeneric('highlight-web-speech-grammar', 
			'code-web-speech-grammar', 
			'stop-code-web-speech-grammar',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '750px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '700px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '650px'
			}
			]);

	// Code Web Speech Synthesis
	managementGeneric('highlight-web-speech-synthesis', 
			'code-web-speech-synthesis', 
			'stop-code-web-speech-synthesis',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '850px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '400px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '450px'
			},
			{
				'top' : 'calc(90px + 5.75em)',
				'width' : '400px'
			},
			{
				'top' : 'calc(90px + 6.90em)',
				'width' : '350px'
			}
			]);

	// Code Notifications
	managementGeneric('highlight-notification', 
			'code-notification', 
			'stop-code-notification',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '350px',
				'left' : '130px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '800px',
				'left' : '150px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '800px',
				'height': '5.5em',
				'left' : '180px'
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
        try{
            voiceEnable = true;
        }catch(e){
            console.error(e);
        }

    });

    Reveal.addEventListener('stop-webspeech', function() {
        try{            
            voiceEnable = false;
            if (recognition) {
                recognition.stop();
                eltMic.style.display = 'none';
            }
        }catch(e){
            console.error(e);
        }
    });

}

module.exports = {
    init: init
}
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovcHJlel9zdXBlcl9wb3dlci5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvb3JpZW50YXRpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy92b2ljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcyhsb2NhbCl7XG5cdGlmIChsb2NhbCB8fCAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKSl7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCJcblx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCI4MDAwXCIpe1xuXHRcdHJldHVybiBcImh0dHBzOi8vYmlub21lZC5mcjo4MDAwXCI7XG5cdH1lbHNle1xuXHRcdHJldHVybiBudWxsO1x0XG5cdH0gXG59XG5cbnZhciBhZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcygpO1xudmFyIGFkZHJlc3NMb2NhbCA9IGNhbGN1bGF0ZUFkZHJlc3ModHJ1ZSk7XG52YXIgbG9jYWwgPSBsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkcmVzcyA6IGFkZHJlc3MsXG4gICAgYWRkcmVzc0xvY2FsIDogYWRkcmVzc0xvY2FsLFxuXHRsb2NhbCA6IGxvY2FsXG59IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb250ZXh0ID0gbnVsbCxcblx0UFVCTElDID0gMSxcblx0V0FJVCA9IDIsXG5cdFJFU1AgPSAzLFxuXHRwdWJsaWNCdWZmZXIgPSBudWxsLFxuXHR3YWl0QnVmZmVyID0gbnVsbCxcblx0cmVzcEJ1ZmZlciA9IG51bGwsXG5cdGN1cnJlbnRTb3VyY2UgPSBudWxsO1xuXG50cnl7XG5cdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cdGNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59Y2F0Y2goZSl7XG5cdGNvbnRleHQgPSBudWxsO1xuXHRjb25zb2xlLmxvZyhcIk5vIFdlYkFQSSBkZWN0ZWN0XCIpO1xufVxuXG5mdW5jdGlvbiBsb2FkU291bmQodXJsLCBidWZmZXJUb1VzZSl7XG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG5cdC8vIERlY29kZSBhc3luY2hyb25vdXNseVxuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdFx0aWYgKGJ1ZmZlclRvVXNlID09PSBQVUJMSUMpe1xuXHRcdCAgXHRcdHB1YmxpY0J1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gV0FJVCl7XG5cdFx0ICBcdFx0d2FpdEJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gUkVTUCl7XG5cdFx0ICBcdFx0cmVzcEJ1ZmZlciA9IGJ1ZmZlcjtcblx0XHRcdH1cblx0XHR9LCBmdW5jdGlvbihlKXtcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBkZWNvZGluZyBmaWxlJywgZSk7XG5cdFx0fSk7XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGxvYWRQdWJsaWNTb3VuZCgpe1xuXHRpZihjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvcXVlc3Rpb25fcHVibGljX2NvdXJ0ZS5tcDNcIiwgUFVCTElDKTtcbn1cblxuZnVuY3Rpb24gbG9hZFdhaXRTb3VuZCgpe1xuXHRpZiAoY29udGV4dClcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL2F0dGVudGVfcmVwb25zZV9jb3VydGUubXAzXCIsIFdBSVQpO1xufVxuXG5mdW5jdGlvbiBsb2FkUmVzcFNvdW5kKCl7XG5cdGlmIChjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvYm9ubmVfcmVwb25zZS5tcDNcIiwgUkVTUCk7XG59XG5cbmZ1bmN0aW9uIHBsYXlTb3VuZChidWZmZXIpe1xuXHR2YXIgc291cmNlID0gY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTsgLy8gY3JlYXRlcyBhIHNvdW5kIHNvdXJjZVxuXHRzb3VyY2UuYnVmZmVyID0gYnVmZmVyOyAgICAgICAgICAgICAgICAgICAgLy8gdGVsbCB0aGUgc291cmNlIHdoaWNoIHNvdW5kIHRvIHBsYXlcblx0c291cmNlLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7ICAgICAgIC8vIGNvbm5lY3QgdGhlIHNvdXJjZSB0byB0aGUgY29udGV4dCdzIGRlc3RpbmF0aW9uICh0aGUgc3BlYWtlcnMpXG5cdHNvdXJjZS5zdGFydCgwKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwbGF5IHRoZSBzb3VyY2Ugbm93XG5cdHJldHVybiBzb3VyY2U7XG59XG5cbmxvYWRQdWJsaWNTb3VuZCgpO1xubG9hZFdhaXRTb3VuZCgpO1xubG9hZFJlc3BTb3VuZCgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBBcGlzIGV4cG9zZWRcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qL1xuXG5mdW5jdGlvbiBwbGF5UHVibGljKCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZChwdWJsaWNCdWZmZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBsYXlXYWl0KCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZCh3YWl0QnVmZmVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwbGF5UmVzcCgpe1xuXHRpZiAoY29udGV4dCl7XG5cdFx0c3RvcCgpO1xuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQocmVzcEJ1ZmZlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RvcCgpe1xuXHRpZiAoY3VycmVudFNvdXJjZSAmJiBjdXJyZW50U291cmNlLnN0b3Ape1xuXHRcdGN1cnJlbnRTb3VyY2Uuc3RvcCgwKTtcblx0fVxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHBsYXlQdWJsaWMgOiBwbGF5UHVibGljLFxuXHRwbGF5V2FpdCA6IHBsYXlXYWl0LFxuXHRwbGF5UmVzcCA6IHBsYXlSZXNwLFxuXHRzdG9wIDogc3RvcFxufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnL2NvbmZpZycpLFxuXHRhdWRpbyA9IHJlcXVpcmUoJy4vYXVkaW8nKSxcblx0c29ja2V0ID0gbnVsbCxcblx0c2NvcmVJbmRleCA9IHt9O1xuXG5cblxuZnVuY3Rpb24gaGlkZVF1ZXN0aW9uKCl7XHRcblx0YXVkaW8uc3RvcCgpO1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnaGlkZVF1ZXN0aW9uJ1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlUXVlc3Rpb24oaW5kZXgpe1xuXHRhdWRpby5wbGF5UHVibGljKCk7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdjaGFuZ2VRdWVzdGlvbicsXG5cdFx0J2luZGV4JyA6IGluZGV4LFxuXHRcdHJlcEEgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQWApLmlubmVySFRNTCxcblx0XHRyZXBCIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEJgKS5pbm5lckhUTUwsXG5cdFx0cmVwQyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBDYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwRGApLmlubmVySFRNTCxcblxuXHR9KTtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ3Nob3dOb3RpZmljYXRpb24nXHRcdFxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzU2NvcmUoaW5kZXgpe1xuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7Y29uZmlnLmFkZHJlc3N9L3Njb3JlLyR7aW5kZXh9YCxteUluaXQpO1xuXHRmZXRjaChteVJlcXVlc3QpXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihqc29uKXtcblx0XHRhdWRpby5wbGF5V2FpdCgpO1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKHNjb3JlSW5kZXhbYHF1ZXN0aW9uXyR7aW5kZXh9YF0pe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHRsZXQgdG90YWwgPSBqc29uLnJlcEEgKyBqc29uLnJlcEIgKyBqc29uLnJlcEMgKyBqc29uLnJlcEQ7XG5cdFx0dmFyIGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjaGFydF9xdWVzdGlvbl8ke2luZGV4fWApLmdldENvbnRleHQoXCIyZFwiKTtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdCAgICBsYWJlbHM6IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIl0sXG5cdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0ICAgICAgICB7XG5cdFx0ICAgICAgICAgICAgbGFiZWw6IFwiQVwiLFxuXHRcdCAgICAgICAgICAgIGZpbGxDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNSlcIixcblx0XHQgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuOClcIixcblx0XHQgICAgICAgICAgICBoaWdobGlnaHRGaWxsOiBcInJnYmEoMjIwLDIyMCwyMjAsMC43NSlcIixcblx0XHQgICAgICAgICAgICBoaWdobGlnaHRTdHJva2U6IFwicmdiYSgyMjAsMjIwLDIyMCwxKVwiLFxuXHRcdCAgICAgICAgICAgIGRhdGE6IFtNYXRoLnJvdW5kKChqc29uLnJlcEEgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBCIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQyAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEQgLyB0b3RhbCkgKiAxMDApXVxuXHRcdCAgICAgICAgfVxuXHRcdCAgICBdXG5cdFx0fTtcblx0XHR2YXIgbXlCYXJDaGFydCA9IG5ldyBDaGFydChjdHgpLkJhcihkYXRhLCB7XG5cdFx0XHQgLy9Cb29sZWFuIC0gV2hldGhlciBncmlkIGxpbmVzIGFyZSBzaG93biBhY3Jvc3MgdGhlIGNoYXJ0XG5cdCAgICBcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IGZhbHNlLFxuXHQgICAgXHQvLyBTdHJpbmcgLSBTY2FsZSBsYWJlbCBmb250IGNvbG91clxuXHQgICAgXHRzY2FsZUZvbnRDb2xvcjogXCJvcmFuZ2VcIixcblx0XHR9KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRhdWRpby5wbGF5UmVzcCgpO1xuXHRcdFx0bGV0IGdvb2RBbnN3ZXJFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1yZXNwLXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5nb29kYCk7XG5cdFx0XHRsZXQgYW53c2VyID0gZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEEnKSA/ICdBJyA6XG5cdFx0XHRcdFx0XHQgZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEInKSA/ICdCJyA6XG5cdFx0XHRcdFx0XHQgZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEMnKSA/ICdDJyA6ICdEJztcblx0XHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRcdFx0ZXZlbnRUeXBlIDogJ2Fuc3dlcicsXG5cdFx0XHRcdHZhbHVlIDogYW53c2VyXG5cdFx0XHR9KTtcdFx0XHQgXG5cdFx0XHRnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdGlmIChpbmRleCA9PT0gNCl7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdFx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRcdFx0XHRcdGV2ZW50VHlwZSA6ICdjYWxjdWxhdGVXaW5uZXJzJyxcblx0XHRcdFx0XHRcdG51bWJlcldpbm5lcnMgOiAyLFxuXHRcdFx0XHRcdFx0dmFsdWUgOiBhbndzZXJcblx0XHRcdFx0XHR9KTtcdFx0XG5cdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0fVxuXHRcdH0sIDUwMDApO1xuXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblx0aGlkZVF1ZXN0aW9uKCk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDEpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDEpO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMicsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMik7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMik7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0zJywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbigzKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTMnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSgzKTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTQnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDQpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tNCcsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDQpO1xuXHR9KTtcblxuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWl0LXF1ZXN0aW9uJywgaGlkZVF1ZXN0aW9uKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxuXG5mdW5jdGlvbiBtYW5hZ2VtZW50R2VuZXJpYyhpZEhpZ2hsaWdodEVsdCwgc3RhcnRFdmVudCwgc3RvcEV2ZW50LCBwb3NpdGlvbkFycmF5KXtcblxuXHR2YXIgZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJytpZEhpZ2hsaWdodEVsdCk7XG5cblx0ZnVuY3Rpb24gcHJvZ3Jlc3NGcmFnbWVudChldmVudCl7XG5cdFx0Ly8gZXZlbnQuZnJhZ21lbnQgLy8gdGhlIGRvbSBlbGVtZW50IGZyYWdtZW50XG5cdFx0dHJ5e1x0XHRcdFxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJyl7XG5cdFx0XHRcdHZhciBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcblx0XHRcdFx0dmFyIHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4XTtcblx0XHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHR2YXIga2V5ID0ga2V5c1tpXTtcblx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1lbHNlIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuXHRcdFx0XHQvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuXHRcdFx0XHR2YXIgcHJvcGVydGllcyA9IHBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXHRcdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdHZhciBrZXkgPSBrZXlzW2ldO1xuXHRcdFx0XHRcdGVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaW5kZXggPiAwKXtcdFx0XHRcblx0XHRcdFx0XHRwcm9wZXJ0aWVzID0gcG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuXHRcdFx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0dmFyIGtleSA9IGtleXNbaV07XG5cdFx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVx0XHRcdFxuXHRcdFx0fVxuXHRcdH1jYXRjaChlKXt9XG5cdH1cblxuXHRmdW5jdGlvbiBsaXN0ZW5GcmFnbWVudHMoKXtcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHByb2dyZXNzRnJhZ21lbnQpO1xuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHByb2dyZXNzRnJhZ21lbnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdW5yZWdpc3RlckZyYWdtZW50cygpe1xuXHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgcHJvZ3Jlc3NGcmFnbWVudCk7XG5cdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgcHJvZ3Jlc3NGcmFnbWVudCk7XG5cdH1cblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihzdGFydEV2ZW50LCBmdW5jdGlvbigpe1xuXHRcdHRyeXtcblx0XHRcdGxpc3RlbkZyYWdtZW50cygpO1xuXHRcdH1jYXRjaChlKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0fVxuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoc3RvcEV2ZW50LCBmdW5jdGlvbigpe1xuXHRcdHRyeXtcblx0XHRcdHVucmVnaXN0ZXJGcmFnbWVudHMoKTtcblx0XHR9Y2F0Y2goZSl7XG5cdFx0XHRjb25zb2xlLmVycm9yKGUpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKXtcblxuXHQvLyBDb2RlIENvbm5lY3Rcblx0bWFuYWdlbWVudEdlbmVyaWMoJ2hpZ2hsaWdodC1jb25uZWN0LWJsZScsIFxuXHRcdFx0J2NvZGUtY29ubmVjdC1ibGUnLCBcblx0XHRcdCdzdG9wLWNvZGUtY29ubmVjdC1ibGUnLFxuXHRcdFx0W1xuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyAxLjE1ZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc0MDBweCdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cdC8vIENvZGUgUmVhZCBDaGFyYWN0ZXJpc3RpY1xuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LXJlYWQtY2hhcmFjdCcsIFxuXHRcdFx0J2NvZGUtcmVhZC1jaGFyYWN0JywgXG5cdFx0XHQnc3RvcC1jb2RlLXJlYWQtY2hhcmFjdCcsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDMuNDVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMTAwcHgnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyA2LjkwZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc1MDBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEwLjM1ZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc4NTBweCcsXG5cdFx0XHRcdCdoZWlnaHQnIDogJzIuNGVtJ1xuXHRcdFx0fVxuXHRcdFx0XSk7XG5cblx0Ly8gQ29kZSBXcml0ZSBDaGFyYWN0ZXJpc3RpY1xuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LXdyaXRlLWNoYXJhY3QnLCBcblx0XHRcdCdjb2RlLXdyaXRlLWNoYXJhY3QnLCBcblx0XHRcdCdzdG9wLWNvZGUtd3JpdGUtY2hhcmFjdCcsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEuMTVlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzEwMDBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDQuNjBlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzcwMHB4Jyxcblx0XHRcdFx0J2xlZnQnIDogJzEwMHB4J1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgNS43NWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnODAwcHgnXG5cdFx0XHR9XG5cdFx0XHRdKTtcblxuXHQvLyBDb2RlIE9yaWVudGF0aW9uXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtb3JpZW50YXRpb24nLCBcblx0XHRcdCdjb2RlLW9yaWVudGF0aW9uJywgXG5cdFx0XHQnc3RvcC1jb2RlLW9yaWVudGF0aW9uJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgOC4wNWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNDAwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICczLjRlbSdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cdC8vIENvZGUgTW90aW9uXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtbW90aW9uJywgXG5cdFx0XHQnY29kZS1tb3Rpb24nLCBcblx0XHRcdCdzdG9wLWNvZGUtbW90aW9uJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMi4zMGVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNzUwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICc0LjRlbSdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cblx0Ly8gQ29kZSBCYXR0ZXJ5XG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtYmF0dGVyeScsIFxuXHRcdFx0J2NvZGUtYmF0dGVyeScsIFxuXHRcdFx0J3N0b3AtY29kZS1iYXR0ZXJ5Jyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgNC42ZW0pJyxcblx0XHRcdFx0J2xlZnQnIDogJzYwMHB4Jyxcblx0XHRcdFx0J3dpZHRoJyA6ICcyMDBweCcsXG5cdFx0XHRcdCdoZWlnaHQnIDogJzEuNGVtJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMTAuMzVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnNjBweCcsXG5cdFx0XHRcdCd3aWR0aCcgOiAnMTAwMHB4Jyxcblx0XHRcdFx0J2hlaWdodCcgOiAnMi40ZW0nXG5cdFx0XHR9XG5cdFx0XHRdKTtcblxuXG5cdC8vIENvZGUgVXNlciBNZWRpYSAxXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtdXNlci1tZWRpYS12MScsIFxuXHRcdFx0J2NvZGUtdXNlci1tZWRpYS12MScsIFxuXHRcdFx0J3N0b3AtY29kZS11c2VyLW1lZGlhLXYxJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMTMuOGVtKScsXG5cdFx0XHRcdCdsZWZ0JyA6ICc2MHB4Jyxcblx0XHRcdFx0J3dpZHRoJyA6ICcxMDAwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICcxLjRlbSdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDcuNzVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMTkwcHgnLFxuXHRcdFx0XHQnd2lkdGgnIDogJzIxMHB4Jyxcblx0XHRcdFx0J2hlaWdodCcgOiAnMS40ZW0nXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyA3Ljc1ZW0pJyxcblx0XHRcdFx0J2xlZnQnIDogJzQxMHB4Jyxcblx0XHRcdFx0J3dpZHRoJyA6ICc5MHB4Jyxcblx0XHRcdFx0J2hlaWdodCcgOiAnMS40ZW0nXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyAxMC4zNWVtKScsXG5cdFx0XHRcdCdsZWZ0JyA6ICcxMDBweCcsXG5cdFx0XHRcdCd3aWR0aCcgOiAnODAwcHgnLFxuXHRcdFx0XHQnaGVpZ2h0JyA6ICcyLjRlbSdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cdC8vIENvZGUgRGV2aWNlIFByb3hpbWl0eVxuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LWRldmljZS1wcm94aW1pdHknLCBcblx0XHRcdCdjb2RlLWRldmljZS1wcm94aW1pdHknLCBcblx0XHRcdCdzdG9wLWNvZGUtZGV2aWNlLXByb3hpbWl0eScsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEuMTVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMjUwcHgnLFxuXHRcdFx0XHQnd2lkdGgnIDogJzE3MHB4J1xuXHRcdFx0fVxuXHRcdFx0XSk7XG5cblx0Ly8gQ29kZSBVc2VyIFByb3hpbWl0eVxuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LXVzZXItcHJveGltaXR5JywgXG5cdFx0XHQnY29kZS11c2VyLXByb3hpbWl0eScsIFxuXHRcdFx0J3N0b3AtY29kZS11c2VyLXByb3hpbWl0eScsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDEuMTVlbSknLFxuXHRcdFx0XHQnbGVmdCcgOiAnMTUwcHgnLFxuXHRcdFx0XHQnd2lkdGgnIDogJzE1MHB4J1xuXHRcdFx0fVxuXHRcdFx0XSk7XG5cblx0Ly8gQ29kZSBXZWIgU3BlZWNoXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtd2ViLXNwZWVjaCcsIFxuXHRcdFx0J2NvZGUtd2ViLXNwZWVjaCcsIFxuXHRcdFx0J3N0b3AtY29kZS13ZWItc3BlZWNoJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMS4xNWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNDAwcHgnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyAyLjMwZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc1MDBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDMuNDVlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzU1MHB4J1x0XHRcdFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgNS43NWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnMzAwcHgnXHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyA2LjkwZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICczMDBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDguMDVlbSknLFx0XHRcdFx0XG5cdFx0XHRcdCdsZWZ0JyA6ICczMDBweCcsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNDUwcHgnXG5cdFx0XHR9XG5cdFx0XHRdKTtcblxuXHQvLyBDb2RlIFdlYiBTcGVlY2ggR3JhbW1hclxuXHRtYW5hZ2VtZW50R2VuZXJpYygnaGlnaGxpZ2h0LXdlYi1zcGVlY2gtZ3JhbW1hcicsIFxuXHRcdFx0J2NvZGUtd2ViLXNwZWVjaC1ncmFtbWFyJywgXG5cdFx0XHQnc3RvcC1jb2RlLXdlYi1zcGVlY2gtZ3JhbW1hcicsXG5cdFx0XHRbXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDIuMzBlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzc1MHB4J1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMy40NWVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNzAwcHgnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyA0LjYwZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc2NTBweCdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG5cdC8vIENvZGUgV2ViIFNwZWVjaCBTeW50aGVzaXNcblx0bWFuYWdlbWVudEdlbmVyaWMoJ2hpZ2hsaWdodC13ZWItc3BlZWNoLXN5bnRoZXNpcycsIFxuXHRcdFx0J2NvZGUtd2ViLXNwZWVjaC1zeW50aGVzaXMnLCBcblx0XHRcdCdzdG9wLWNvZGUtd2ViLXNwZWVjaC1zeW50aGVzaXMnLFxuXHRcdFx0W1xuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyAyLjMwZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc4NTBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDMuNDVlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzQwMHB4J1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgNC42MGVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnNDUwcHgnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyA1Ljc1ZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc0MDBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDYuOTBlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzM1MHB4J1xuXHRcdFx0fVxuXHRcdFx0XSk7XG5cblx0Ly8gQ29kZSBOb3RpZmljYXRpb25zXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdoaWdobGlnaHQtbm90aWZpY2F0aW9uJywgXG5cdFx0XHQnY29kZS1ub3RpZmljYXRpb24nLCBcblx0XHRcdCdzdG9wLWNvZGUtbm90aWZpY2F0aW9uJyxcblx0XHRcdFtcblx0XHRcdHtcblx0XHRcdFx0J3RvcCcgOiAnY2FsYyg5MHB4ICsgMi4zMGVtKScsXG5cdFx0XHRcdCd3aWR0aCcgOiAnMzUwcHgnLFxuXHRcdFx0XHQnbGVmdCcgOiAnMTMwcHgnXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQndG9wJyA6ICdjYWxjKDkwcHggKyAzLjQ1ZW0pJyxcblx0XHRcdFx0J3dpZHRoJyA6ICc4MDBweCcsXG5cdFx0XHRcdCdsZWZ0JyA6ICcxNTBweCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCd0b3AnIDogJ2NhbGMoOTBweCArIDQuNjBlbSknLFxuXHRcdFx0XHQnd2lkdGgnIDogJzgwMHB4Jyxcblx0XHRcdFx0J2hlaWdodCc6ICc1LjVlbScsXG5cdFx0XHRcdCdsZWZ0JyA6ICcxODBweCdcblx0XHRcdH1cblx0XHRcdF0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufTsiLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZycpO1xuXG5mdW5jdGlvbiBwb3N0UHJvZENvZGVIaWxpZ2h0KCl7XG5cdHZhciBhcnJheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvZGUudG9IaWxpZ2h0Jyk7XG5cdGZvciAodmFyIGkgPTA7IGkgPGFycmF5Lmxlbmd0aDsgaSsrKXtcblx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHR2YXIgdGV4dENvZGUgPSBhcnJheVtpXS5pbm5lckhUTUw7XG5cdFx0ZG97XG5cdFx0XHRsZW5ndGggPSB0ZXh0Q29kZS5sZW5ndGg7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrJmd0OycsICc8bWFyaz4nKTtcblx0XHRcdHRleHRDb2RlID0gdGV4dENvZGUucmVwbGFjZSgnJmx0O21hcmsgY2xhc3M9XCJkaWxsdWF0ZVwiJmd0OycsICc8bWFyayBjbGFzcz1cImRpbGx1YXRlXCI+Jyk7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDsvbWFyayZndDsnLCAnPC9tYXJrPicpO1xuXHRcdH13aGlsZShsZW5ndGggIT0gdGV4dENvZGUubGVuZ3RoKTtcblx0XHRhcnJheVtpXS5pbm5lckhUTUwgPSB0ZXh0Q29kZTtcblxuXHR9XG59XG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVhZHknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgLy8gZXZlbnQuY3VycmVudFNsaWRlLCBldmVudC5pbmRleGgsIGV2ZW50LmluZGV4dlxuXHRjb25zb2xlLmxvZygnUmV2ZWFsSlMgUmVhZHknKTtcbiAgICBcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBcdHBvc3RQcm9kQ29kZUhpbGlnaHQoKTtcblx0fSwgNTAwKTtcblx0XG5cdGxldCBpbklGcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cdFxuICAgIFxuXHRpZiAoIWluSUZyYW1lICYmIGlvICYmIGNvbmZpZy5hZGRyZXNzKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJHbyB0byBjb25kaXRpb24gIVwiKTtcblx0XHRsZXQgc29ja2V0R2FtZSA9IGlvLmNvbm5lY3QoY29uZmlnLmFkZHJlc3MpO1xuXHRcdHJlcXVpcmUoJy4vZ2FtZS9wcmV6X2dhbWUnKS5pbml0KHNvY2tldEdhbWUpO1xuXHRcdGxldCBzb2NrZXRQcmV6ID0gbnVsbDtcblx0XHRsZXQgc29ja2V0UHJlekxvY2FsID0gbnVsbDtcblx0XHRpZiAoY29uZmlnLmxvY2FsKXtcblx0XHRcdHNvY2tldFByZXogPSBzb2NrZXRHYW1lOyAgIFxuXHRcdH1lbHNle1xuXHRcdFx0c29ja2V0UHJleiA9IGlvLmNvbm5lY3QoY29uZmlnLmFkZHJlc3MpO1xuXHRcdFx0c29ja2V0UHJlekxvY2FsID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzc0xvY2FsKTtcblx0XHR9XG4gXG4gXHRcdC8vc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBsaWdodFwiKTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9saWdodCcpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBPcmllbnRhdGlvblwiKTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9vcmllbnRhdGlvbicpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBEZXZpY2VNb3Rpb25cIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvZGV2aWNlbW90aW9uJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIFZvaWNlXCIpO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL3ZvaWNlJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIFVzZXJNZWRpYVwiKTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy91c2VybWVkaWEnKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XG4gXHRcdFx0XG4gXHRcdC8vfSwgMTAwMCk7XG5cdH1cdFxuXG5cdHJlcXVpcmUoJy4vaGlnaGxpZ2h0cy9oaWdobGlnaHRzQ29kZScpLmluaXQoKTtcbiBcblx0XG59ICk7XG4iLCIndXNlIHN0cmljdCdcblxubGV0IG1vdGlvbkVuYWJsZSA9IGZhbHNlLFxuICAgIG1vdGlvbkVsdCA9IG51bGwsXG4gICAgYmF0dGVyeTFFbHQgPSBudWxsLFxuICAgIGJhdHRlcnkyRWx0ID0gbnVsbCxcbiAgICBjaGFyZ2VCYXR0ZXJ5MSA9IDAsXG4gICAgY2hhcmdlQmF0dGVyeTIgPSAwLFxuICAgIHdpbm5lciA9IG51bGwsXG4gICAgZnVsbFZhbHVlMSA9IDEwMDAwLFxuICAgIGZ1bGxWYWx1ZTIgPSAxMDAwMCxcbiAgICBtYXBVc2Vyc0FjdGl2ID0ge307XG5cblxuXG5cbmZ1bmN0aW9uIGJhdFVwZGF0ZSh0ZWFtLCBjaGFyZ2UpIHtcbiAgICBsZXQgY29sID0gW10sXG4gICAgICAgIGVsdCA9IG51bGw7XG4gICAgaWYgKHRlYW0gPT09IFwiMVwiKSB7XG4gICAgICAgIGVsdCA9IGJhdHRlcnkxRWx0O1xuICAgICAgICAvLyBSZWQgLSBEYW5nZXIhXG4gICAgICAgIGNvbCA9IFtcIiM3NTA5MDBcIiwgXCIjYzY0NjJiXCIsIFwiI2I3NDQyNFwiLCBcIiNkZjBhMDBcIiwgXCIjNTkwNzAwXCJdO1xuICAgIH0gLyplbHNlIGlmIChjaGFyZ2UgPCA0MCkge1xuICAgIC8vIFllbGxvdyAtIE1pZ2h0IHdhbm5hIGNoYXJnZSBzb29uLi4uXG4gICAgY29sID0gW1wiIzc1NGYwMFwiLCBcIiNmMmJiMDBcIiwgXCIjZGJiMzAwXCIsIFwiI2RmOGYwMFwiLCBcIiM1OTNjMDBcIl07XG4gIH0gKi9lbHNlIHtcbiAgICAgICAgZWx0ID0gYmF0dGVyeTJFbHQ7XG4gICAgICAgIC8vIEdyZWVuIC0gQWxsIGdvb2QhXG4gICAgICAgIGNvbCA9IFtcIiMzMTZkMDhcIiwgXCIjNjBiOTM5XCIsIFwiIzUxYWEzMVwiLCBcIiM2NGNlMTFcIiwgXCIjMjU1NDA1XCJdO1xuICAgIH1cbiAgICBlbHQuc3R5bGVbXCJiYWNrZ3JvdW5kLWltYWdlXCJdID0gXCJsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHRyYW5zcGFyZW50IDUlLCBcIiArIGNvbFswXSArIFwiIDUlLCBcIiArIGNvbFswXSArIFwiIDclLCBcIiArIGNvbFsxXSArIFwiIDglLCBcIiArIGNvbFsxXSArIFwiIDEwJSwgXCIgKyBjb2xbMl0gKyBcIiAxMSUsIFwiICsgY29sWzJdICsgXCIgXCIgKyAoY2hhcmdlIC0gMykgKyBcIiUsIFwiICsgY29sWzNdICsgXCIgXCIgKyAoY2hhcmdlIC0gMikgKyBcIiUsIFwiICsgY29sWzNdICsgXCIgXCIgKyBjaGFyZ2UgKyBcIiUsIFwiICsgY29sWzRdICsgXCIgXCIgKyBjaGFyZ2UgKyBcIiUsIGJsYWNrIFwiICsgKGNoYXJnZSArIDUpICsgXCIlLCBibGFjayA5NSUsIHRyYW5zcGFyZW50IDk1JSksIGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMjU1LDI1NSwyNTUsMC41KSAwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjQpIDQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNyUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSAxNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC44KSAxNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0MCUsIHJnYmEoMjU1LDI1NSwyNTUsMCkgNDElLCByZ2JhKDI1NSwyNTUsMjU1LDApIDgwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDgwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjQpIDg2JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjYpIDkwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjEpIDkyJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjEpIDk1JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpIDk4JSlcIjtcbn1cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpIHtcblxuICAgIGZ1bmN0aW9uIGNhbGxCYWNrU2Vuc29yKG1zZykge1xuICAgICAgICBpZiAobW90aW9uRW5hYmxlICYmIG1zZy50eXBlID09PSAnZGV2aWNlbW90aW9uJykge1xuICAgICAgICAgICAgaWYgKCF3aW5uZXIgJiYgbXNnLnRlYW0pIHtcbiAgICAgICAgICAgICAgICBsZXQgdG1wVXNlclRlYW0gPSBtYXBVc2Vyc0FjdGl2W21zZy5pZF07XG4gICAgICAgICAgICAgICAgaWYgKCF0bXBVc2VyVGVhbSkge1xuICAgICAgICAgICAgICAgICAgICBtYXBVc2Vyc0FjdGl2W21zZy5pZF0gPSBtc2cudGVhbTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1zZy50ZWFtID09PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFZhbHVlMSArPSAxMDAwMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtc2cudGVhbSA9PT0gXCIyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxWYWx1ZTIgKz0gMTAwMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmdlQmF0dGVyeTEgKz0gbXNnLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gTWF0aC5yb3VuZCgoY2hhcmdlQmF0dGVyeTEgLyBmdWxsVmFsdWUxKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmdlQmF0dGVyeTIgKz0gbXNnLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gTWF0aC5yb3VuZCgoY2hhcmdlQmF0dGVyeTIgLyBmdWxsVmFsdWUyKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYmF0VXBkYXRlKG1zZy50ZWFtLCBNYXRoLm1pbihwZXJjZW50LCA5MCkpO1xuICAgICAgICAgICAgICAgIGlmICghd2lubmVyICYmIE1hdGgubWluKHBlcmNlbnQsIDkwKSA9PT0gOTApIHtcbiAgICAgICAgICAgICAgICAgICAgd2lubmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1zZy50ZWFtID09PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldmljZW1vdGlvbiAud2luLmZpcmVmb3gnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXZpY2Vtb3Rpb24gLndpbi5jaHJvbWUnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgaWYgKHNvY2tldExvY2FsKSB7XG4gICAgICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgfVxuICAgIGJhdHRlcnkxRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhdHRlcnktMScpO1xuICAgIGJhdHRlcnkyRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhdHRlcnktMicpO1xuXG4gICAgYmF0VXBkYXRlKFwiMVwiLCAwKTtcbiAgICBiYXRVcGRhdGUoXCIyXCIsIDApO1xuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LWRldmljZW1vdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzb2NrZXQuZW1pdCgnY29uZmlnJywge1xuICAgICAgICAgICAgdHlwZTogXCJnYW1lXCIsXG4gICAgICAgICAgICBldmVudFR5cGU6IFwiYmF0dGVyeVwiLFxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgbW90aW9uRW5hYmxlID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdG9wLWRldmljZW1vdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzb2NrZXQuZW1pdCgnY29uZmlnJywge1xuICAgICAgICAgICAgdHlwZTogXCJnYW1lXCIsXG4gICAgICAgICAgICBldmVudFR5cGU6IFwiYmF0dGVyeVwiLFxuICAgICAgICAgICAgc2hvdzogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIG1vdGlvbkVuYWJsZSA9IGZhbHNlO1xuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IGxpZ2h0RW5hYmxlID0gZmFsc2UsXG5cdGxpZ2h0RWx0ID0gbnVsbDtcblxuXG4vLyBXZSB1cGRhdGUgdGhlIGNzcyBTdHlsZVxuZnVuY3Rpb24gdXBkYXRlTGlnaHQoZGF0YSl7XG5cdGxldCBwcmVmaXhMaWdodCA9ICctd2Via2l0LSc7XG5cdGxldCBwZXJjZW50ID0gZGF0YTtcblx0dmFyIHN0eWxlID0gcHJlZml4TGlnaHQrJ3JhZGlhbC1ncmFkaWVudChjZW50ZXIsICdcblx0ICAgICsnIGVsbGlwc2UgY292ZXIsICdcblx0ICAgICsnIHJnYmEoMTk4LDE5NywxNDUsMSkgMCUsJ1xuXHQgICAgKycgcmdiYSgwLDAsMCwxKSAnK3BlcmNlbnQrJyUpJ1xuXHQgICAgO1xuXHRsaWdodEVsdC5zdHlsZS5iYWNrZ3JvdW5kID0gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCl7XG5cbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpe1xuXHRcdGlmIChsaWdodEVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ2xpZ2h0Jyl7XG5cdFx0XHR1cGRhdGVMaWdodChtc2cudmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdHNvY2tldC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIGlmIChzb2NrZXRMb2NhbCl7XG5cdCAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIH1cblx0bGlnaHRFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlnaHQtYmcnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LWxpZ2h0JywgZnVuY3Rpb24oKXtcblx0XHRsaWdodEVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1saWdodCcsIGZ1bmN0aW9uKCl7XG5cdFx0bGlnaHRFbmFibGUgPSBmYWxzZTtcblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBvcmllbnRhdGlvbkVuYWJsZSA9IGZhbHNlLCBcblx0bG9ja0VsdCA9IG51bGwsXG5cdHJlc0VsdCA9IG51bGwsXG5cdG9wZW4gPSBmYWxzZTtcblxuY29uc3QgdmFsdWVzID0geyBmaXJzdCA6IHt2YWx1ZTogNTAsIGZvdW5kOiBmYWxzZX0sIFxuXHRcdFx0XHRzZWNvbmQgOiB7dmFsdWU6IDgwLCBmb3VuZDogZmFsc2V9LCBcblx0XHRcdFx0dGhpcmQgOiB7dmFsdWUgOiAxMCwgZm91bmQgOiBmYWxzZX1cblx0XHRcdH07XG5cblxuLy8gQWNjb3JkaW5nIHRvIHRoZSBudW1iZXIgb2YgdW5sb2NrLCB3ZSBqdXN0IHR1cm4gdGhlIGltYWdlIG9yIHdlIG9wZW4gdGhlIGRvb3JcbmZ1bmN0aW9uIHVwZGF0ZVJvdGF0aW9uKHpBbHBoYSwgZmlyc3RWYWx1ZSl7XG5cdGlmICghb3Blbil7XG5cdFx0bGV0IGRlbHRhID0gZmlyc3RWYWx1ZSAtIHpBbHBoYTtcblx0XHRsZXQgcm90YXRpb24gPSBkZWx0YTtcblx0XHRpZiAoZGVsdGEgPCAwKXtcblx0XHRcdHJvdGF0aW9uID0gZmlyc3RWYWx1ZSszNjAtekFscGhhO1xuXHRcdH1cdFx0XG5cdFx0bG9ja0VsdC5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWignK3JvdGF0aW9uKydkZWcpJztcblxuXHRcdGxldCBjdXJyZW50VmFsdWUgPSAxMDAgLSBNYXRoLnJvdW5kKChyb3RhdGlvbioxMDApLzM2MCk7XG5cdFx0cmVzRWx0LmlubmVySFRNTCA9IGN1cnJlbnRWYWx1ZTtcblx0XHRpZiAodmFsdWVzLmZpcnN0LmZvdW5kIFxuXHRcdFx0JiYgdmFsdWVzLnNlY29uZC5mb3VuZFxuXHRcdFx0JiYgdmFsdWVzLnRoaXJkLmZvdW5kKXtcdFx0XHRcblx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uJykuY2xhc3NMaXN0LmFkZChcIm9wZW5cIik7XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMuZmlyc3QuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5maXJzdC52YWx1ZSl7XHRcdFx0XHRcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5maXJzdCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLmZpcnN0LmZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy5zZWNvbmQuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5zZWNvbmQudmFsdWUpe1xuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLnNlY29uZCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLnNlY29uZC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMudGhpcmQuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy50aGlyZC52YWx1ZSl7XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAudGhpcmQnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy50aGlyZC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpe1xuXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKXtcblx0XHRpZiAob3JpZW50YXRpb25FbmFibGUgJiYgbXNnLnR5cGUgPT09ICdvcmllbnRhdGlvbicpe1xuXHRcdFx0dXBkYXRlUm90YXRpb24obXNnLnZhbHVlLCBtc2cuZmlyc3RWYWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgaWYoc29ja2V0TG9jYWwpe1xuXHQgICAgc29ja2V0TG9jYWwub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICB9XG5cblx0bG9ja0VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zYWZlX2xvY2snKTtcblx0cmVzRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yaWVudGF0aW9uIC5yZXNwIC52YWx1ZScpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtb3JpZW50YXRpb24nLCBmdW5jdGlvbigpe1xuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcblx0XHRvcmllbnRhdGlvbkVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcdFxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59OyIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgdXNlcm1lZGlhRW5hYmxlID0gZmFsc2UsXG4gICAgdXNlcm1lZGlhRWx0ID0gbnVsbDtcblxuXG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCkge1xuXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKSB7XG4gICAgICAgIGlmICh1c2VybWVkaWFFbmFibGUgJiYgbXNnLnR5cGUgPT09ICd1c2VybWVkaWEnKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGhvdG9TdHJlYW0nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsIG1zZy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcblxuICAgIGlmIChzb2NrZXRMb2NhbCkge1xuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIH1cbiAgICB1c2VybWVkaWFFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlcm1lZGlhLWJnJyk7XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RhcnQtdXNlcm1lZGlhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJtZWRpYUVuYWJsZSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcC11c2VybWVkaWEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdXNlcm1lZGlhRW5hYmxlID0gZmFsc2U7XG4gICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgdm9pY2VFbmFibGUgPSBmYWxzZSxcbiAgICB2b2ljZUZSID0gbnVsbCxcbiAgICBzeW50aCA9IG51bGwsXG4gICAgcmVjb2duaXRpb24gPSBudWxsLFxuICAgIHJlY29nbml0aW9uRG9uZSA9IGZhbHNlLFxuICAgIG5leHRTbGlkZSA9IGZhbHNlLFxuICAgIGVsdE1pYyA9IG51bGwsXG4gICAgaW5wdXRNaWMgPSBudWxsXG4gICAgO1xuXG5mdW5jdGlvbiBwb3B1bGF0ZVZvaWNlTGlzdCgpIHtcbiAgICBsZXQgdm9pY2VzID0gc3ludGguZ2V0Vm9pY2VzKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2b2ljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHZvaWNlc1tpXS5sYW5nID09PSAnZnItRlInKSB7XG4gICAgICAgICAgICB2b2ljZUZSID0gdm9pY2VzW2ldO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIlcywgJU8gXCIsIHZvaWNlc1tpXS5sYW5nLCB2b2ljZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVWb2ljZVJlc3VsdHMoZXZlbnQpIHtcbiAgICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25FdmVudCByZXN1bHRzIHByb3BlcnR5IHJldHVybnMgYSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0XG4gICAgLy8gVGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0cy5cbiAgICAvLyBJdCBoYXMgYSBnZXR0ZXIgc28gaXQgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYW4gYXJyYXlcbiAgICAvLyBUaGUgZmlyc3QgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IGF0IHBvc2l0aW9uIDAuXG4gICAgLy8gRWFjaCBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3RzIHRoYXQgY29udGFpbiBpbmRpdmlkdWFsIHJlc3VsdHMuXG4gICAgLy8gVGhlc2UgYWxzbyBoYXZlIGdldHRlcnMgc28gdGhleSBjYW4gYmUgYWNjZXNzZWQgbGlrZSBhcnJheXMuXG4gICAgLy8gVGhlIHNlY29uZCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBhdCBwb3NpdGlvbiAwLlxuICAgIC8vIFdlIHRoZW4gcmV0dXJuIHRoZSB0cmFuc2NyaXB0IHByb3BlcnR5IG9mIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIG9iamVjdCBcbiAgICB2YXIgZmluYWxTdHIgPSBldmVudC5yZXN1bHRzWzBdWzBdLnRyYW5zY3JpcHQ7XG4gICAgaW5wdXRNaWMuaW5uZXJIVE1MID0gZmluYWxTdHI7XG4gICAgLy9kaWFnbm9zdGljLnRleHRDb250ZW50ID0gJ1Jlc3VsdCByZWNlaXZlZDogJyArIGNvbG9yICsgJy4nO1xuICAgIC8vYmcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XG4gICAgY29uc29sZS5sb2coJ0NvbmZpZGVuY2U6ICcgKyBmaW5hbFN0cik7XG4gICAgaWYgKGZpbmFsU3RyLmluZGV4T2YoJ3N1aXZhbnQnKSAhPSAtMSkge1xuICAgICAgICByZWNvZ25pdGlvbi5zdG9wKCk7XG4gICAgICAgIGlmICghcmVjb2duaXRpb25Eb25lKSB7XG4gICAgICAgICAgICByZWNvZ25pdGlvbkRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgc3BlYWsoXCJCb25qb3VyIEpGLCBqJ2FpIGNvbXByaXMgcXVlIHR1IHZvdWxhaXMgcGFzc2VyIGF1IHNsaWRlIHN1aXZhbnQsIGFpcyBqZSBiaWVuIGNvbXByaXMgP1wiKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaW4gZGUgc3BlZWNoXCIpXG4gICAgICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHZvaWNlRlJcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpbmFsU3RyLmluZGV4T2YoJ291aScpICE9IC0xKSB7XG4gICAgICAgIGlmICghbmV4dFNsaWRlKSB7XG4gICAgICAgICAgICBuZXh0U2xpZGUgPSB0cnVlO1xuICAgICAgICAgICAgUmV2ZWFsLm5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlVm9pY2VFbmQoKSB7XG4gICAgLy8gV2UgZGV0ZWN0IHRoZSBlbmQgb2Ygc3BlZWNoUmVjb2duaXRpb24gcHJvY2Vzc1xuICAgIGNvbnNvbGUubG9nKCdFbmQgb2YgcmVjb2duaXRpb24nKVxuICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbn07XG5cbi8vIFdlIGRldGVjdCBlcnJvcnNcbmZ1bmN0aW9uIGhhbmRsZVZvaWNlRXJyb3IoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vLXNwZWVjaCcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ05vIFNwZWVjaCcpO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ2F1ZGlvLWNhcHR1cmUnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBtaWNyb3Bob25lJylcbiAgICB9XG4gICAgaWYgKGV2ZW50LmVycm9yID09ICdub3QtYWxsb3dlZCcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ05vdCBBbGxvd2VkJyk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gc3BlYWsodmFsdWUsIGNhbGxiYWNrRW5kKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgIGlmICghdm9pY2VGUikge1xuICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHV0dGVyVGhpcyA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UodmFsdWUpO1xuICAgICAgICB1dHRlclRoaXMudm9pY2UgPSB2b2ljZUZSO1xuICAgICAgICB1dHRlclRoaXMucGl0Y2ggPSAxO1xuICAgICAgICB1dHRlclRoaXMucmF0ZSA9IDE7XG4gICAgICAgIHV0dGVyVGhpcy5vbmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHN5bnRoLnNwZWFrKHV0dGVyVGhpcyk7XG4gICAgfSk7XG59XG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKSB7XG5cbiAgICAvLyBJbml0aWFsaXNhdGlvbiBkZSBsYSBwYXJ0aWUgcmVjb25uYWlzc2FuY2Ugdm9jYWxlXG4gICAgdmFyIFNwZWVjaFJlY29nbml0aW9uID0gU3BlZWNoUmVjb2duaXRpb24gfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25cbiAgICB2YXIgU3BlZWNoR3JhbW1hckxpc3QgPSBTcGVlY2hHcmFtbWFyTGlzdCB8fCB3ZWJraXRTcGVlY2hHcmFtbWFyTGlzdFxuICAgIHZhciBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50ID0gU3BlZWNoUmVjb2duaXRpb25FdmVudCB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvbkV2ZW50XG4gICAgcmVjb2duaXRpb24gPSBuZXcgU3BlZWNoUmVjb2duaXRpb24oKTtcbiAgICB2YXIgZ3JhbW1hciA9ICcjSlNHRiBWMS4wOyBncmFtbWFyIGJpbm9tZWQ7IHB1YmxpYyA8Ymlub21lZD4gPSBzdWl2YW50IHwgcHLDqWPDqWRlbnQgfCBwcmVjZWRlbnQgfCBzbGlkZSB8IGRpYXBvc2l0aXZlIHwgc3VpdmFudGUgfCBvdWkgOyc7XG4gICAgdmFyIHNwZWVjaFJlY29nbml0aW9uTGlzdCA9IG5ldyBTcGVlY2hHcmFtbWFyTGlzdCgpO1xuICAgIHNwZWVjaFJlY29nbml0aW9uTGlzdC5hZGRGcm9tU3RyaW5nKGdyYW1tYXIsIDEpO1xuICAgIHJlY29nbml0aW9uLmdyYW1tYXJzID0gc3BlZWNoUmVjb2duaXRpb25MaXN0O1xuICAgIHJlY29nbml0aW9uLmNvbnRpbnVvdXMgPSB0cnVlO1xuICAgIHJlY29nbml0aW9uLmxhbmcgPSAnZnItRlInO1xuICAgIHJlY29nbml0aW9uLmludGVyaW1SZXN1bHRzID0gdHJ1ZTtcbiAgICByZWNvZ25pdGlvbi5vbnJlc3VsdCA9IGhhbmRsZVZvaWNlUmVzdWx0cztcbiAgICByZWNvZ25pdGlvbi5vbmVuZCA9IGhhbmRsZVZvaWNlRW5kO1xuICAgIHJlY29nbml0aW9uLm9uZXJyb3IgPSBoYW5kbGVWb2ljZUVycm9yO1xuXG4gICAgLy8gSW5pdGlhbGlzYXRpb24gZGUgbGEgcGFydGllIHN5bnRow6hzZSB2b2NhbGVcbiAgICBzeW50aCA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXM7XG4gICAgcG9wdWxhdGVWb2ljZUxpc3QoKTtcbiAgICBpZiAoc3BlZWNoU3ludGhlc2lzLm9udm9pY2VzY2hhbmdlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNwZWVjaFN5bnRoZXNpcy5vbnZvaWNlc2NoYW5nZWQgPSBwb3B1bGF0ZVZvaWNlTGlzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcbiAgICAgICAgaWYgKHZvaWNlRW5hYmxlICYmIG1zZy50eXBlID09PSAndm9pY2UnKSB7XG4gICAgICAgICAgICBpZiAobXNnLnZhbHVlID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbHRNaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgZWx0TWljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW9TcGVlY2gnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRNaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3BlZWNoX2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgcmVjb2duaXRpb24uc3RhcnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobXNnLnZhbHVlID09PSAnc3RvcCcpIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICAgICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXNhdGlvbiBkZSBsYSBwYXJ0aWUgY29tbXVudWljYXRpb25cbiAgICBzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcbiAgICAgICAgc29ja2V0TG9jYWwub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICB9XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RhcnQtd2Vic3BlZWNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHZvaWNlRW5hYmxlID0gdHJ1ZTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcC13ZWJzcGVlY2gnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdHJ5eyAgICAgICAgICAgIFxuICAgICAgICAgICAgdm9pY2VFbmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChyZWNvZ25pdGlvbikge1xuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGluaXRcbn0iXX0=
