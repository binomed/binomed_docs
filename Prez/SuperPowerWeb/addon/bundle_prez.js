(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function calculateAddress(local){
	if (local || (location.port && (location.port === "3000"))){
		return "http://localhost:8443"
	}else if (location.port && location.port === "8443"){
		return "https://binomed.fr:8443";
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

const MIN_TOP = '95px';
const LINE_HEIGHT = '0.55em';
const ADDITIONNAL_HEIGHT = '0.4em';
const COL_WIDTH = 35;
const LEFT_FIRST = '60px';
const LEFT_TAB = '100px';

function managementGeneric(keyElt, positionArray) {

	const eltHiglight = document.getElementById(`highlight-${keyElt}`);
	let progress = Reveal.getProgress();

	function _progressFragment(event) {
		try {
			let properties = null
			if (event.type === 'fragmentshown') {
				const index = +event.fragment.getAttribute('data-fragment-index');
				properties = positionArray[index + 1];

			} else {
				const index = +event.fragment.getAttribute('data-fragment-index');
				properties = positionArray[index];
				// On reset les properties
				/*if (index > 0) {
					properties = positionArray[index - 1];
				}*/
			}
			if (!properties) {
				return;
			}

			applyProperties(properties);

		} catch (e) {
			console.error(e)
		}
	}

	function applyProperties(properties) {
		try {
			const keys = Object.keys(properties);
			const area = {};
			const position = {};
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				switch (true) {
					case key === 'line':
					case key === 'nbLines':
					case key === 'col':
					case key === 'nbCols':
					case key === 'topMargin':
					case key === 'leftMargin':
						position[key] = properties[key];
						break;
					case key === 'height':
					case key === 'width':
					case key === 'top':
					case key === 'left':
						area[key] = properties[key];
						break;
					default:
				}

			}

			if (position.topMargin === undefined) {
				position.topMargin = MIN_TOP;
			}
			if (position.nbLines === undefined && area.height === undefined) {
				area.height = LINE_HEIGHT;
			}
			if (position.line === undefined && area.top === undefined) {
				area.top = 0;
			}
			if (position.nbCols === undefined && area.width === undefined) {
				area.width = 0;
			}
			if (position.col === undefined && area.left === undefined) {
				area.left = 0;
			}
			eltHiglight.area = area;
			eltHiglight.position = position;
		} catch (e) {}
	}

	function progressFragment(event) {
		// event.fragment // the dom element fragment
		try {
			if (event.type === 'fragmentshown') {
				var index = +event.fragment.getAttribute('data-fragment-index');
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					eltHiglight.style[key] = properties[key];
				}
			} else {
				var index = +event.fragment.getAttribute('data-fragment-index');
				// On reset les properties
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					eltHiglight.style[key] = '';
				}
				if (index > 0) {
					properties = positionArray[index - 1];
					keys = Object.keys(properties);
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i];
						eltHiglight.style[key] = properties[key];
					}
				}
			}
		} catch (e) {}
	}

	function listenFragments() {
		Reveal.addEventListener('fragmentshown', _progressFragment);
		Reveal.addEventListener('fragmenthidden', _progressFragment);
	}

	function unregisterFragments() {
		Reveal.removeEventListener('fragmentshown', _progressFragment);
		Reveal.removeEventListener('fragmenthidden', _progressFragment);
	}

	Reveal.addEventListener(`code-${keyElt}`, function (event) {
		try {
			let currentProgress = Reveal.getProgress();
			applyProperties(currentProgress > progress ? positionArray[0] : positionArray[positionArray.length - 1]);
			listenFragments();
		} catch (e) {
			console.error(e);
		}
	});
	Reveal.addEventListener(`stop-code-${keyElt}`, function (event) {
		try {
			progress = Reveal.getProgress();
			unregisterFragments();
		} catch (e) {
			console.error(e);
		}
	});
}

function init() {

	// Code Connect
	managementGeneric('connect-ble', [{
			line: 1,
			width: '100%'
		},
		{
			line: 2,
			width: '400px'
		}
	]);

	// Code Connect by name
	managementGeneric('connect-by-name', [{
		width: '400px',
		line: 1,
		left: '670px'
	}]);

	// Code Connection
	managementGeneric('connection', [{
		width: '400px',
		line: 3,
		left: LEFT_TAB
	}]);

	// Code Read Characteristic
	managementGeneric('read-charact', [{
			width: '700px',
			line: 1,
			left: LEFT_FIRST
		}, {
			line: 4,
			width: '700px',
			left: LEFT_TAB
		},
		{
			line: 7,
			left: LEFT_TAB,
			width: '500px'
		},
		{
			line: 10,
			nbLines: 2,
			width: '850px',
			left: LEFT_TAB
		}
	]);

	// Code Write Characteristic
	managementGeneric('write-charact', [{
			width: '650px',
			line: 1,
			left: LEFT_FIRST
		},
		{
			line: 2,
			width: '1000px'
		},
		{
			line: 5,
			width: '700px',
			left: LEFT_TAB
		},
		{
			line: 6,
			width: '800px'
		}
	]);

	// Code Write Characteristic
	managementGeneric('vibrate', [{
		width: '350px',
		line: 5,
		left: LEFT_FIRST
	}]);

	// Code Orientation
	managementGeneric('orientation', [{
		width: '850px',
		line: 2,
		left: LEFT_FIRST
	}, {
		line: 8,
		width: '400px',
		nbLines: 3,
		left: LEFT_FIRST
	}]);

	// Code Motion
	managementGeneric('motion', [{
		width: '950px',
		line: 11,
		left: LEFT_TAB
	}, {
		line: 3,
		width: '750px',
		nbLines: 4,
		left: LEFT_TAB
	}]);


	// Code Battery
	managementGeneric('battery', [{
			width: '950px',
			line: 1,
			nbLines: 2
		}, {
			line: 5,
			left: '600px',
			width: '200px'

		},
		{
			line: 10,
			width: '1000px',
			nbLines: 2
		}
	]);


	// Code User Media 1
	managementGeneric('user-media-v1', [{
			width: '500px',
			line: 2,
			left: LEFT_FIRST
		}, {
			line: 13,
			left: LEFT_FIRST,
			width: '1000px'
		},
		{
			line: 8,
			left: '190px',
			width: '210px'
		},
		{
			line: 8,
			left: '400px',
			width: '90px'
		},
		{
			line: 10,
			nbLines: 2,
			left: LEFT_TAB,
			width: '800px'
		}
	]);

	// Code User Media 1
	managementGeneric('user-media-v2', [{
		width: '800px',
		line: 12,
		nbLines: 2,
		left: LEFT_FIRST
	}, {
		line: 10,
		left: LEFT_TAB,
		width: '600px'
	}]);

	// Code Device Proximity
	managementGeneric('device-proximity', [{
		width: '1000px',
		line: 6,
		left: LEFT_TAB
	}, {
		line: 2,
		left: '250px',
		width: '170px'
	}]);

	// Code User Proximity
	managementGeneric('user-proximity', [{
		width: '1000px',
		line: 8,
		left: LEFT_TAB
	}, {
		line: 2,
		left: '150px',
		width: '150px'
	}]);

	// Code Web Speech
	managementGeneric('web-speech', [{
			width: '650px',
			line: 1
		}, {
			line: 2,
			width: '450px'
		},
		{
			line: 3,
			width: '500px'
		},
		{
			line: 4,
			width: '550px'
		},
		{
			line: 6,
			width: '350px'
		},
		{
			line: 7,
			width: '350px'
		},
		{
			line: 8,
			left: '290px',
			width: '450px'
		}
	]);

	// Code Web Speech Grammar
	managementGeneric('web-speech-grammar', [{
			width: '1200px',
			line: 1
		}, {
			line: 3,
			width: '800px'
		},
		{
			line: 4,
			width: '750px'
		},
		{
			line: 5,
			width: '700px'
		}
	]);

	// Code Web Speech Synthesis
	managementGeneric('web-speech-synthesis', [{
			width: '550px',
			line: 1
		}, {
			line: 3,
			width: '900px'
		},
		{
			line: 4,
			width: '450px'
		},
		{
			line: 5,
			width: '500px'
		},
		{
			line: 6,
			width: '450px'
		},
		{
			line: 7,
			width: '400px'
		}
	]);

	// Code Notifications
	managementGeneric('notification', [{
			width: '800px',
			line: 2,
			left: LEFT_TAB
		}, {
			line: 3,
			width: '350px',
			left: '120px'
		},
		{
			line: 4,
			width: '800px',
			left: '140px'
		},
		{
			line: 5,
			width: '800px',
			nbLines: 5,
			left: '170px'
		}
	]);

	// Code Visibility
	managementGeneric('visibility', [{
		line: 11,
		width: '1000px',
		left: LEFT_TAB
	}, {
		line: 2,
		width: '550px',
		left: LEFT_TAB
	}]);
	/*
	 */


}

module.exports = {
	init: init
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
	
    
	if (!inIFrame && typeof(window.io) != 'undefined' && config.address){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovcHJlel9zdXBlcl9wb3dlci5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvb3JpZW50YXRpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy92b2ljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVBZGRyZXNzKGxvY2FsKXtcclxuXHRpZiAobG9jYWwgfHwgKGxvY2F0aW9uLnBvcnQgJiYgKGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiKSkpe1xyXG5cdFx0cmV0dXJuIFwiaHR0cDovL2xvY2FsaG9zdDo4NDQzXCJcclxuXHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjg0NDNcIil7XHJcblx0XHRyZXR1cm4gXCJodHRwczovL2Jpbm9tZWQuZnI6ODQ0M1wiO1xyXG5cdH1lbHNle1xyXG5cdFx0cmV0dXJuIG51bGw7XHRcclxuXHR9IFxyXG59XHJcblxyXG52YXIgYWRkcmVzcyA9IGNhbGN1bGF0ZUFkZHJlc3MoKTtcclxudmFyIGFkZHJlc3NMb2NhbCA9IGNhbGN1bGF0ZUFkZHJlc3ModHJ1ZSk7XHJcbnZhciBsb2NhbCA9IGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRhZGRyZXNzIDogYWRkcmVzcyxcclxuICAgIGFkZHJlc3NMb2NhbCA6IGFkZHJlc3NMb2NhbCxcclxuXHRsb2NhbCA6IGxvY2FsXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBjb250ZXh0ID0gbnVsbCxcclxuXHRQVUJMSUMgPSAxLFxyXG5cdFdBSVQgPSAyLFxyXG5cdFJFU1AgPSAzLFxyXG5cdHB1YmxpY0J1ZmZlciA9IG51bGwsXHJcblx0d2FpdEJ1ZmZlciA9IG51bGwsXHJcblx0cmVzcEJ1ZmZlciA9IG51bGwsXHJcblx0Y3VycmVudFNvdXJjZSA9IG51bGw7XHJcblxyXG50cnl7XHJcblx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcclxuXHRjb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG59Y2F0Y2goZSl7XHJcblx0Y29udGV4dCA9IG51bGw7XHJcblx0Y29uc29sZS5sb2coXCJObyBXZWJBUEkgZGVjdGVjdFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFNvdW5kKHVybCwgYnVmZmVyVG9Vc2Upe1xyXG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG5cdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuXHJcblx0Ly8gRGVjb2RlIGFzeW5jaHJvbm91c2x5XHJcblx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKGJ1ZmZlcikge1xyXG5cdFx0XHRpZiAoYnVmZmVyVG9Vc2UgPT09IFBVQkxJQyl7XHJcblx0XHQgIFx0XHRwdWJsaWNCdWZmZXIgPSBidWZmZXI7XHJcblx0XHRcdH1lbHNlIGlmIChidWZmZXJUb1VzZSA9PT0gV0FJVCl7XHJcblx0XHQgIFx0XHR3YWl0QnVmZmVyID0gYnVmZmVyO1xyXG5cdFx0XHR9ZWxzZSBpZiAoYnVmZmVyVG9Vc2UgPT09IFJFU1Ape1xyXG5cdFx0ICBcdFx0cmVzcEJ1ZmZlciA9IGJ1ZmZlcjtcclxuXHRcdFx0fVxyXG5cdFx0fSwgZnVuY3Rpb24oZSl7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBkZWNvZGluZyBmaWxlJywgZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0cmVxdWVzdC5zZW5kKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRQdWJsaWNTb3VuZCgpe1xyXG5cdGlmKGNvbnRleHQpXHJcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL3F1ZXN0aW9uX3B1YmxpY19jb3VydGUubXAzXCIsIFBVQkxJQyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRXYWl0U291bmQoKXtcclxuXHRpZiAoY29udGV4dClcclxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvYXR0ZW50ZV9yZXBvbnNlX2NvdXJ0ZS5tcDNcIiwgV0FJVCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRSZXNwU291bmQoKXtcclxuXHRpZiAoY29udGV4dClcclxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvYm9ubmVfcmVwb25zZS5tcDNcIiwgUkVTUCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXlTb3VuZChidWZmZXIpe1xyXG5cdHZhciBzb3VyY2UgPSBjb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpOyAvLyBjcmVhdGVzIGEgc291bmQgc291cmNlXHJcblx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIC8vIHRlbGwgdGhlIHNvdXJjZSB3aGljaCBzb3VuZCB0byBwbGF5XHJcblx0c291cmNlLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7ICAgICAgIC8vIGNvbm5lY3QgdGhlIHNvdXJjZSB0byB0aGUgY29udGV4dCdzIGRlc3RpbmF0aW9uICh0aGUgc3BlYWtlcnMpXHJcblx0c291cmNlLnN0YXJ0KDApOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBsYXkgdGhlIHNvdXJjZSBub3dcclxuXHRyZXR1cm4gc291cmNlO1xyXG59XHJcblxyXG5sb2FkUHVibGljU291bmQoKTtcclxubG9hZFdhaXRTb3VuZCgpO1xyXG5sb2FkUmVzcFNvdW5kKCk7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiogQXBpcyBleHBvc2VkXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHBsYXlQdWJsaWMoKXtcclxuXHRpZiAoY29udGV4dCl7XHJcblx0XHRzdG9wKCk7XHJcblx0XHRjdXJyZW50U291cmNlID0gcGxheVNvdW5kKHB1YmxpY0J1ZmZlcik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5V2FpdCgpe1xyXG5cdGlmIChjb250ZXh0KXtcclxuXHRcdHN0b3AoKTtcclxuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQod2FpdEJ1ZmZlcik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5UmVzcCgpe1xyXG5cdGlmIChjb250ZXh0KXtcclxuXHRcdHN0b3AoKTtcclxuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQocmVzcEJ1ZmZlcik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9wKCl7XHJcblx0aWYgKGN1cnJlbnRTb3VyY2UgJiYgY3VycmVudFNvdXJjZS5zdG9wKXtcclxuXHRcdGN1cnJlbnRTb3VyY2Uuc3RvcCgwKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cGxheVB1YmxpYyA6IHBsYXlQdWJsaWMsXHJcblx0cGxheVdhaXQgOiBwbGF5V2FpdCxcclxuXHRwbGF5UmVzcCA6IHBsYXlSZXNwLFxyXG5cdHN0b3AgOiBzdG9wXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcvY29uZmlnJyksXHJcblx0YXVkaW8gPSByZXF1aXJlKCcuL2F1ZGlvJyksXHJcblx0c29ja2V0ID0gbnVsbCxcclxuXHRzY29yZUluZGV4ID0ge307XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGhpZGVRdWVzdGlvbigpe1x0XHJcblx0YXVkaW8uc3RvcCgpO1xyXG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcclxuXHRcdHR5cGUgOiAnZ2FtZScsXHJcblx0XHRldmVudFR5cGUgOiAnaGlkZVF1ZXN0aW9uJ1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFuZ2VRdWVzdGlvbihpbmRleCl7XHJcblx0YXVkaW8ucGxheVB1YmxpYygpO1xyXG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcclxuXHRcdHR5cGUgOiAnZ2FtZScsXHJcblx0XHRldmVudFR5cGUgOiAnY2hhbmdlUXVlc3Rpb24nLFxyXG5cdFx0J2luZGV4JyA6IGluZGV4LFxyXG5cdFx0cmVwQSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBBYCkuaW5uZXJIVE1MLFxyXG5cdFx0cmVwQiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBCYCkuaW5uZXJIVE1MLFxyXG5cdFx0cmVwQyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBDYCkuaW5uZXJIVE1MLFxyXG5cdFx0cmVwRCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBEYCkuaW5uZXJIVE1MLFxyXG5cclxuXHR9KTtcclxuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XHJcblx0XHR0eXBlIDogJ2dhbWUnLFxyXG5cdFx0ZXZlbnRUeXBlIDogJ3Nob3dOb3RpZmljYXRpb24nXHRcdFxyXG5cclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc1Njb3JlKGluZGV4KXtcclxuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcclxuICAgICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xyXG5cclxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7Y29uZmlnLmFkZHJlc3N9L3Njb3JlLyR7aW5kZXh9YCxteUluaXQpO1xyXG5cdGZldGNoKG15UmVxdWVzdClcclxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XHJcblx0XHRhdWRpby5wbGF5V2FpdCgpO1xyXG5cdFx0Ly8gT24gbmUgcmV0cmFpcmUgcGFzIHVuZSBxdWVzdGlvbiBkw6lqw6AgdHJhaXTDqWVcclxuXHRcdGlmIChzY29yZUluZGV4W2BxdWVzdGlvbl8ke2luZGV4fWBdKXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRsZXQgdG90YWwgPSBqc29uLnJlcEEgKyBqc29uLnJlcEIgKyBqc29uLnJlcEMgKyBqc29uLnJlcEQ7XHJcblx0XHR2YXIgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGNoYXJ0X3F1ZXN0aW9uXyR7aW5kZXh9YCkuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuXHRcdHZhciBkYXRhID0ge1xyXG5cdFx0ICAgIGxhYmVsczogW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiXSxcclxuXHRcdCAgICBkYXRhc2V0czogW1xyXG5cdFx0ICAgICAgICB7XHJcblx0XHQgICAgICAgICAgICBsYWJlbDogXCJBXCIsXHJcblx0XHQgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjUpXCIsXHJcblx0XHQgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuOClcIixcclxuXHRcdCAgICAgICAgICAgIGhpZ2hsaWdodEZpbGw6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjc1KVwiLFxyXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcclxuXHRcdCAgICAgICAgICAgIGRhdGE6IFtNYXRoLnJvdW5kKChqc29uLnJlcEEgLyB0b3RhbCkgKiAxMDApLCBcclxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEIgLyB0b3RhbCkgKiAxMDApLCBcclxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEMgLyB0b3RhbCkgKiAxMDApLCBcclxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEQgLyB0b3RhbCkgKiAxMDApXVxyXG5cdFx0ICAgICAgICB9XHJcblx0XHQgICAgXVxyXG5cdFx0fTtcclxuXHRcdHZhciBteUJhckNoYXJ0ID0gbmV3IENoYXJ0KGN0eCkuQmFyKGRhdGEsIHtcclxuXHRcdFx0IC8vQm9vbGVhbiAtIFdoZXRoZXIgZ3JpZCBsaW5lcyBhcmUgc2hvd24gYWNyb3NzIHRoZSBjaGFydFxyXG5cdCAgICBcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IGZhbHNlLFxyXG5cdCAgICBcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgY29sb3VyXHJcblx0ICAgIFx0c2NhbGVGb250Q29sb3I6IFwib3JhbmdlXCIsXHJcblx0XHR9KTtcclxuXHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRhdWRpby5wbGF5UmVzcCgpO1xyXG5cdFx0XHRsZXQgZ29vZEFuc3dlckVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXJlc3AtcXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLmdvb2RgKTtcclxuXHRcdFx0bGV0IGFud3NlciA9IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBBJykgPyAnQScgOlxyXG5cdFx0XHRcdFx0XHQgZ29vZEFuc3dlckVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ3JlcEInKSA/ICdCJyA6XHJcblx0XHRcdFx0XHRcdCBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQycpID8gJ0MnIDogJ0QnO1xyXG5cdFx0XHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XHJcblx0XHRcdFx0dHlwZSA6ICdnYW1lJyxcclxuXHRcdFx0XHRldmVudFR5cGUgOiAnYW5zd2VyJyxcclxuXHRcdFx0XHR2YWx1ZSA6IGFud3NlclxyXG5cdFx0XHR9KTtcdFx0XHQgXHJcblx0XHRcdGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cdFx0XHRpZiAoaW5kZXggPT09IDQpe1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XHJcblx0XHRcdFx0XHRcdHR5cGUgOiAnZ2FtZScsXHJcblx0XHRcdFx0XHRcdGV2ZW50VHlwZSA6ICdjYWxjdWxhdGVXaW5uZXJzJyxcclxuXHRcdFx0XHRcdFx0bnVtYmVyV2lubmVycyA6IDIsXHJcblx0XHRcdFx0XHRcdHZhbHVlIDogYW53c2VyXHJcblx0XHRcdFx0XHR9KTtcdFx0XHJcblx0XHRcdFx0fSwgMTAwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0sIDUwMDApO1xyXG5cclxuXHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xyXG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xyXG5cdGhpZGVRdWVzdGlvbigpO1xyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XHJcblx0XHRjaGFuZ2VRdWVzdGlvbigxKTtcclxuXHR9KTtcclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0xJywgZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVRdWVzdGlvbigpO1xyXG5cdFx0cHJvY2Vzc1Njb3JlKDEpO1xyXG5cdH0pO1xyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMicsIGZ1bmN0aW9uKCl7XHJcblx0XHRjaGFuZ2VRdWVzdGlvbigyKTtcclxuXHR9KTtcclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVRdWVzdGlvbigpO1xyXG5cdFx0cHJvY2Vzc1Njb3JlKDIpO1xyXG5cdH0pO1xyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMycsIGZ1bmN0aW9uKCl7XHJcblx0XHRjaGFuZ2VRdWVzdGlvbigzKTtcclxuXHR9KTtcclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0zJywgZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVRdWVzdGlvbigpO1xyXG5cdFx0cHJvY2Vzc1Njb3JlKDMpO1xyXG5cdH0pO1xyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tNCcsIGZ1bmN0aW9uKCl7XHJcblx0XHRjaGFuZ2VRdWVzdGlvbig0KTtcclxuXHR9KTtcclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi00JywgZnVuY3Rpb24oKXtcclxuXHRcdGhpZGVRdWVzdGlvbigpO1xyXG5cdFx0cHJvY2Vzc1Njb3JlKDQpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1aXQtcXVlc3Rpb24nLCBoaWRlUXVlc3Rpb24pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0aW5pdCA6IGluaXRcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuY29uc3QgTUlOX1RPUCA9ICc5NXB4JztcclxuY29uc3QgTElORV9IRUlHSFQgPSAnMC41NWVtJztcclxuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcbmNvbnN0IExFRlRfRklSU1QgPSAnNjBweCc7XHJcbmNvbnN0IExFRlRfVEFCID0gJzEwMHB4JztcclxuXHJcbmZ1bmN0aW9uIG1hbmFnZW1lbnRHZW5lcmljKGtleUVsdCwgcG9zaXRpb25BcnJheSkge1xyXG5cclxuXHRjb25zdCBlbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcblx0bGV0IHByb2dyZXNzID0gUmV2ZWFsLmdldFByb2dyZXNzKCk7XHJcblxyXG5cdGZ1bmN0aW9uIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRsZXQgcHJvcGVydGllcyA9IG51bGxcclxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xyXG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG5cdFx0XHRcdHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4ICsgMV07XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG5cdFx0XHRcdHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4XTtcclxuXHRcdFx0XHQvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xyXG5cdFx0XHRcdC8qaWYgKGluZGV4ID4gMCkge1xyXG5cdFx0XHRcdFx0cHJvcGVydGllcyA9IHBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcclxuXHRcdFx0XHR9Ki9cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIXByb3BlcnRpZXMpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFwcGx5UHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcclxuXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFwcGx5UHJvcGVydGllcyhwcm9wZXJ0aWVzKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcblx0XHRcdGNvbnN0IGFyZWEgPSB7fTtcclxuXHRcdFx0Y29uc3QgcG9zaXRpb24gPSB7fTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpXTtcclxuXHRcdFx0XHRzd2l0Y2ggKHRydWUpIHtcclxuXHRcdFx0XHRcdGNhc2Uga2V5ID09PSAnbGluZSc6XHJcblx0XHRcdFx0XHRjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxyXG5cdFx0XHRcdFx0Y2FzZSBrZXkgPT09ICdjb2wnOlxyXG5cdFx0XHRcdFx0Y2FzZSBrZXkgPT09ICduYkNvbHMnOlxyXG5cdFx0XHRcdFx0Y2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxyXG5cdFx0XHRcdFx0Y2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcclxuXHRcdFx0XHRcdFx0cG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIGtleSA9PT0gJ2hlaWdodCc6XHJcblx0XHRcdFx0XHRjYXNlIGtleSA9PT0gJ3dpZHRoJzpcclxuXHRcdFx0XHRcdGNhc2Uga2V5ID09PSAndG9wJzpcclxuXHRcdFx0XHRcdGNhc2Uga2V5ID09PSAnbGVmdCc6XHJcblx0XHRcdFx0XHRcdGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0YXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRhcmVhLnRvcCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGFyZWEud2lkdGggPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGFyZWEubGVmdCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XHJcblx0XHRcdGVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcblx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xyXG5cdFx0Ly8gZXZlbnQuZnJhZ21lbnQgLy8gdGhlIGRvbSBlbGVtZW50IGZyYWdtZW50XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XHJcblx0XHRcdFx0dmFyIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0aWVzID0gcG9zaXRpb25BcnJheVtpbmRleF07XHJcblx0XHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHZhciBrZXkgPSBrZXlzW2ldO1xyXG5cdFx0XHRcdFx0ZWx0SGlnbGlnaHQuc3R5bGVba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG5cdFx0XHRcdC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXHJcblx0XHRcdFx0dmFyIHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4XTtcclxuXHRcdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dmFyIGtleSA9IGtleXNbaV07XHJcblx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChpbmRleCA+IDApIHtcclxuXHRcdFx0XHRcdHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XHJcblx0XHRcdFx0XHRrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGtleSA9IGtleXNbaV07XHJcblx0XHRcdFx0XHRcdGVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbGlzdGVuRnJhZ21lbnRzKCkge1xyXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBfcHJvZ3Jlc3NGcmFnbWVudCk7XHJcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCBfcHJvZ3Jlc3NGcmFnbWVudCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xyXG5cdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBfcHJvZ3Jlc3NGcmFnbWVudCk7XHJcblx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCBfcHJvZ3Jlc3NGcmFnbWVudCk7XHJcblx0fVxyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCBjdXJyZW50UHJvZ3Jlc3MgPSBSZXZlYWwuZ2V0UHJvZ3Jlc3MoKTtcclxuXHRcdFx0YXBwbHlQcm9wZXJ0aWVzKGN1cnJlbnRQcm9ncmVzcyA+IHByb2dyZXNzID8gcG9zaXRpb25BcnJheVswXSA6IHBvc2l0aW9uQXJyYXlbcG9zaXRpb25BcnJheS5sZW5ndGggLSAxXSk7XHJcblx0XHRcdGxpc3RlbkZyYWdtZW50cygpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGUpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRwcm9ncmVzcyA9IFJldmVhbC5nZXRQcm9ncmVzcygpO1xyXG5cdFx0XHR1bnJlZ2lzdGVyRnJhZ21lbnRzKCk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG5cdC8vIENvZGUgQ29ubmVjdFxyXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdjb25uZWN0LWJsZScsIFt7XHJcblx0XHRcdGxpbmU6IDEsXHJcblx0XHRcdHdpZHRoOiAnMTAwJSdcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGxpbmU6IDIsXHJcblx0XHRcdHdpZHRoOiAnNDAwcHgnXHJcblx0XHR9XHJcblx0XSk7XHJcblxyXG5cdC8vIENvZGUgQ29ubmVjdCBieSBuYW1lXHJcblx0bWFuYWdlbWVudEdlbmVyaWMoJ2Nvbm5lY3QtYnktbmFtZScsIFt7XHJcblx0XHR3aWR0aDogJzQwMHB4JyxcclxuXHRcdGxpbmU6IDEsXHJcblx0XHRsZWZ0OiAnNjcwcHgnXHJcblx0fV0pO1xyXG5cclxuXHQvLyBDb2RlIENvbm5lY3Rpb25cclxuXHRtYW5hZ2VtZW50R2VuZXJpYygnY29ubmVjdGlvbicsIFt7XHJcblx0XHR3aWR0aDogJzQwMHB4JyxcclxuXHRcdGxpbmU6IDMsXHJcblx0XHRsZWZ0OiBMRUZUX1RBQlxyXG5cdH1dKTtcclxuXHJcblx0Ly8gQ29kZSBSZWFkIENoYXJhY3RlcmlzdGljXHJcblx0bWFuYWdlbWVudEdlbmVyaWMoJ3JlYWQtY2hhcmFjdCcsIFt7XHJcblx0XHRcdHdpZHRoOiAnNzAwcHgnLFxyXG5cdFx0XHRsaW5lOiAxLFxyXG5cdFx0XHRsZWZ0OiBMRUZUX0ZJUlNUXHJcblx0XHR9LCB7XHJcblx0XHRcdGxpbmU6IDQsXHJcblx0XHRcdHdpZHRoOiAnNzAwcHgnLFxyXG5cdFx0XHRsZWZ0OiBMRUZUX1RBQlxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogNyxcclxuXHRcdFx0bGVmdDogTEVGVF9UQUIsXHJcblx0XHRcdHdpZHRoOiAnNTAwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiAxMCxcclxuXHRcdFx0bmJMaW5lczogMixcclxuXHRcdFx0d2lkdGg6ICc4NTBweCcsXHJcblx0XHRcdGxlZnQ6IExFRlRfVEFCXHJcblx0XHR9XHJcblx0XSk7XHJcblxyXG5cdC8vIENvZGUgV3JpdGUgQ2hhcmFjdGVyaXN0aWNcclxuXHRtYW5hZ2VtZW50R2VuZXJpYygnd3JpdGUtY2hhcmFjdCcsIFt7XHJcblx0XHRcdHdpZHRoOiAnNjUwcHgnLFxyXG5cdFx0XHRsaW5lOiAxLFxyXG5cdFx0XHRsZWZ0OiBMRUZUX0ZJUlNUXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiAyLFxyXG5cdFx0XHR3aWR0aDogJzEwMDBweCdcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGxpbmU6IDUsXHJcblx0XHRcdHdpZHRoOiAnNzAwcHgnLFxyXG5cdFx0XHRsZWZ0OiBMRUZUX1RBQlxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogNixcclxuXHRcdFx0d2lkdGg6ICc4MDBweCdcclxuXHRcdH1cclxuXHRdKTtcclxuXHJcblx0Ly8gQ29kZSBXcml0ZSBDaGFyYWN0ZXJpc3RpY1xyXG5cdG1hbmFnZW1lbnRHZW5lcmljKCd2aWJyYXRlJywgW3tcclxuXHRcdHdpZHRoOiAnMzUwcHgnLFxyXG5cdFx0bGluZTogNSxcclxuXHRcdGxlZnQ6IExFRlRfRklSU1RcclxuXHR9XSk7XHJcblxyXG5cdC8vIENvZGUgT3JpZW50YXRpb25cclxuXHRtYW5hZ2VtZW50R2VuZXJpYygnb3JpZW50YXRpb24nLCBbe1xyXG5cdFx0d2lkdGg6ICc4NTBweCcsXHJcblx0XHRsaW5lOiAyLFxyXG5cdFx0bGVmdDogTEVGVF9GSVJTVFxyXG5cdH0sIHtcclxuXHRcdGxpbmU6IDgsXHJcblx0XHR3aWR0aDogJzQwMHB4JyxcclxuXHRcdG5iTGluZXM6IDMsXHJcblx0XHRsZWZ0OiBMRUZUX0ZJUlNUXHJcblx0fV0pO1xyXG5cclxuXHQvLyBDb2RlIE1vdGlvblxyXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdtb3Rpb24nLCBbe1xyXG5cdFx0d2lkdGg6ICc5NTBweCcsXHJcblx0XHRsaW5lOiAxMSxcclxuXHRcdGxlZnQ6IExFRlRfVEFCXHJcblx0fSwge1xyXG5cdFx0bGluZTogMyxcclxuXHRcdHdpZHRoOiAnNzUwcHgnLFxyXG5cdFx0bmJMaW5lczogNCxcclxuXHRcdGxlZnQ6IExFRlRfVEFCXHJcblx0fV0pO1xyXG5cclxuXHJcblx0Ly8gQ29kZSBCYXR0ZXJ5XHJcblx0bWFuYWdlbWVudEdlbmVyaWMoJ2JhdHRlcnknLCBbe1xyXG5cdFx0XHR3aWR0aDogJzk1MHB4JyxcclxuXHRcdFx0bGluZTogMSxcclxuXHRcdFx0bmJMaW5lczogMlxyXG5cdFx0fSwge1xyXG5cdFx0XHRsaW5lOiA1LFxyXG5cdFx0XHRsZWZ0OiAnNjAwcHgnLFxyXG5cdFx0XHR3aWR0aDogJzIwMHB4J1xyXG5cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGxpbmU6IDEwLFxyXG5cdFx0XHR3aWR0aDogJzEwMDBweCcsXHJcblx0XHRcdG5iTGluZXM6IDJcclxuXHRcdH1cclxuXHRdKTtcclxuXHJcblxyXG5cdC8vIENvZGUgVXNlciBNZWRpYSAxXHJcblx0bWFuYWdlbWVudEdlbmVyaWMoJ3VzZXItbWVkaWEtdjEnLCBbe1xyXG5cdFx0XHR3aWR0aDogJzUwMHB4JyxcclxuXHRcdFx0bGluZTogMixcclxuXHRcdFx0bGVmdDogTEVGVF9GSVJTVFxyXG5cdFx0fSwge1xyXG5cdFx0XHRsaW5lOiAxMyxcclxuXHRcdFx0bGVmdDogTEVGVF9GSVJTVCxcclxuXHRcdFx0d2lkdGg6ICcxMDAwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiA4LFxyXG5cdFx0XHRsZWZ0OiAnMTkwcHgnLFxyXG5cdFx0XHR3aWR0aDogJzIxMHB4J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogOCxcclxuXHRcdFx0bGVmdDogJzQwMHB4JyxcclxuXHRcdFx0d2lkdGg6ICc5MHB4J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogMTAsXHJcblx0XHRcdG5iTGluZXM6IDIsXHJcblx0XHRcdGxlZnQ6IExFRlRfVEFCLFxyXG5cdFx0XHR3aWR0aDogJzgwMHB4J1xyXG5cdFx0fVxyXG5cdF0pO1xyXG5cclxuXHQvLyBDb2RlIFVzZXIgTWVkaWEgMVxyXG5cdG1hbmFnZW1lbnRHZW5lcmljKCd1c2VyLW1lZGlhLXYyJywgW3tcclxuXHRcdHdpZHRoOiAnODAwcHgnLFxyXG5cdFx0bGluZTogMTIsXHJcblx0XHRuYkxpbmVzOiAyLFxyXG5cdFx0bGVmdDogTEVGVF9GSVJTVFxyXG5cdH0sIHtcclxuXHRcdGxpbmU6IDEwLFxyXG5cdFx0bGVmdDogTEVGVF9UQUIsXHJcblx0XHR3aWR0aDogJzYwMHB4J1xyXG5cdH1dKTtcclxuXHJcblx0Ly8gQ29kZSBEZXZpY2UgUHJveGltaXR5XHJcblx0bWFuYWdlbWVudEdlbmVyaWMoJ2RldmljZS1wcm94aW1pdHknLCBbe1xyXG5cdFx0d2lkdGg6ICcxMDAwcHgnLFxyXG5cdFx0bGluZTogNixcclxuXHRcdGxlZnQ6IExFRlRfVEFCXHJcblx0fSwge1xyXG5cdFx0bGluZTogMixcclxuXHRcdGxlZnQ6ICcyNTBweCcsXHJcblx0XHR3aWR0aDogJzE3MHB4J1xyXG5cdH1dKTtcclxuXHJcblx0Ly8gQ29kZSBVc2VyIFByb3hpbWl0eVxyXG5cdG1hbmFnZW1lbnRHZW5lcmljKCd1c2VyLXByb3hpbWl0eScsIFt7XHJcblx0XHR3aWR0aDogJzEwMDBweCcsXHJcblx0XHRsaW5lOiA4LFxyXG5cdFx0bGVmdDogTEVGVF9UQUJcclxuXHR9LCB7XHJcblx0XHRsaW5lOiAyLFxyXG5cdFx0bGVmdDogJzE1MHB4JyxcclxuXHRcdHdpZHRoOiAnMTUwcHgnXHJcblx0fV0pO1xyXG5cclxuXHQvLyBDb2RlIFdlYiBTcGVlY2hcclxuXHRtYW5hZ2VtZW50R2VuZXJpYygnd2ViLXNwZWVjaCcsIFt7XHJcblx0XHRcdHdpZHRoOiAnNjUwcHgnLFxyXG5cdFx0XHRsaW5lOiAxXHJcblx0XHR9LCB7XHJcblx0XHRcdGxpbmU6IDIsXHJcblx0XHRcdHdpZHRoOiAnNDUwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiAzLFxyXG5cdFx0XHR3aWR0aDogJzUwMHB4J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogNCxcclxuXHRcdFx0d2lkdGg6ICc1NTBweCdcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGxpbmU6IDYsXHJcblx0XHRcdHdpZHRoOiAnMzUwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiA3LFxyXG5cdFx0XHR3aWR0aDogJzM1MHB4J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogOCxcclxuXHRcdFx0bGVmdDogJzI5MHB4JyxcclxuXHRcdFx0d2lkdGg6ICc0NTBweCdcclxuXHRcdH1cclxuXHRdKTtcclxuXHJcblx0Ly8gQ29kZSBXZWIgU3BlZWNoIEdyYW1tYXJcclxuXHRtYW5hZ2VtZW50R2VuZXJpYygnd2ViLXNwZWVjaC1ncmFtbWFyJywgW3tcclxuXHRcdFx0d2lkdGg6ICcxMjAwcHgnLFxyXG5cdFx0XHRsaW5lOiAxXHJcblx0XHR9LCB7XHJcblx0XHRcdGxpbmU6IDMsXHJcblx0XHRcdHdpZHRoOiAnODAwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiA0LFxyXG5cdFx0XHR3aWR0aDogJzc1MHB4J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogNSxcclxuXHRcdFx0d2lkdGg6ICc3MDBweCdcclxuXHRcdH1cclxuXHRdKTtcclxuXHJcblx0Ly8gQ29kZSBXZWIgU3BlZWNoIFN5bnRoZXNpc1xyXG5cdG1hbmFnZW1lbnRHZW5lcmljKCd3ZWItc3BlZWNoLXN5bnRoZXNpcycsIFt7XHJcblx0XHRcdHdpZHRoOiAnNTUwcHgnLFxyXG5cdFx0XHRsaW5lOiAxXHJcblx0XHR9LCB7XHJcblx0XHRcdGxpbmU6IDMsXHJcblx0XHRcdHdpZHRoOiAnOTAwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiA0LFxyXG5cdFx0XHR3aWR0aDogJzQ1MHB4J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogNSxcclxuXHRcdFx0d2lkdGg6ICc1MDBweCdcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGxpbmU6IDYsXHJcblx0XHRcdHdpZHRoOiAnNDUwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiA3LFxyXG5cdFx0XHR3aWR0aDogJzQwMHB4J1xyXG5cdFx0fVxyXG5cdF0pO1xyXG5cclxuXHQvLyBDb2RlIE5vdGlmaWNhdGlvbnNcclxuXHRtYW5hZ2VtZW50R2VuZXJpYygnbm90aWZpY2F0aW9uJywgW3tcclxuXHRcdFx0d2lkdGg6ICc4MDBweCcsXHJcblx0XHRcdGxpbmU6IDIsXHJcblx0XHRcdGxlZnQ6IExFRlRfVEFCXHJcblx0XHR9LCB7XHJcblx0XHRcdGxpbmU6IDMsXHJcblx0XHRcdHdpZHRoOiAnMzUwcHgnLFxyXG5cdFx0XHRsZWZ0OiAnMTIwcHgnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRsaW5lOiA0LFxyXG5cdFx0XHR3aWR0aDogJzgwMHB4JyxcclxuXHRcdFx0bGVmdDogJzE0MHB4J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0bGluZTogNSxcclxuXHRcdFx0d2lkdGg6ICc4MDBweCcsXHJcblx0XHRcdG5iTGluZXM6IDUsXHJcblx0XHRcdGxlZnQ6ICcxNzBweCdcclxuXHRcdH1cclxuXHRdKTtcclxuXHJcblx0Ly8gQ29kZSBWaXNpYmlsaXR5XHJcblx0bWFuYWdlbWVudEdlbmVyaWMoJ3Zpc2liaWxpdHknLCBbe1xyXG5cdFx0bGluZTogMTEsXHJcblx0XHR3aWR0aDogJzEwMDBweCcsXHJcblx0XHRsZWZ0OiBMRUZUX1RBQlxyXG5cdH0sIHtcclxuXHRcdGxpbmU6IDIsXHJcblx0XHR3aWR0aDogJzU1MHB4JyxcclxuXHRcdGxlZnQ6IExFRlRfVEFCXHJcblx0fV0pO1xyXG5cdC8qXHJcblx0ICovXHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0aW5pdDogaW5pdFxyXG59OyIsIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZycpO1xyXG5cclxuZnVuY3Rpb24gcG9zdFByb2RDb2RlSGlsaWdodCgpe1xyXG5cdHZhciBhcnJheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvZGUudG9IaWxpZ2h0Jyk7XHJcblx0Zm9yICh2YXIgaSA9MDsgaSA8YXJyYXkubGVuZ3RoOyBpKyspe1xyXG5cdFx0dmFyIGxlbmd0aCA9IDA7XHJcblx0XHR2YXIgdGV4dENvZGUgPSBhcnJheVtpXS5pbm5lckhUTUw7XHJcblx0XHRkb3tcclxuXHRcdFx0bGVuZ3RoID0gdGV4dENvZGUubGVuZ3RoO1xyXG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrJmd0OycsICc8bWFyaz4nKTtcclxuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7bWFyayBjbGFzcz1cImRpbGx1YXRlXCImZ3Q7JywgJzxtYXJrIGNsYXNzPVwiZGlsbHVhdGVcIj4nKTtcclxuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7L21hcmsmZ3Q7JywgJzwvbWFyaz4nKTtcclxuXHRcdH13aGlsZShsZW5ndGggIT0gdGV4dENvZGUubGVuZ3RoKTtcclxuXHRcdGFycmF5W2ldLmlubmVySFRNTCA9IHRleHRDb2RlO1xyXG5cclxuXHR9XHJcbn1cclxuXHJcblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVhZHknLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcbiAgICAvLyBldmVudC5jdXJyZW50U2xpZGUsIGV2ZW50LmluZGV4aCwgZXZlbnQuaW5kZXh2XHJcblx0Y29uc29sZS5sb2coJ1JldmVhbEpTIFJlYWR5Jyk7XHJcbiAgICBcclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgXHRwb3N0UHJvZENvZGVIaWxpZ2h0KCk7XHJcblx0fSwgNTAwKTtcclxuXHRcclxuXHRsZXQgaW5JRnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xyXG5cdFxyXG4gICAgXHJcblx0aWYgKCFpbklGcmFtZSAmJiB0eXBlb2Yod2luZG93LmlvKSAhPSAndW5kZWZpbmVkJyAmJiBjb25maWcuYWRkcmVzcyl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJHbyB0byBjb25kaXRpb24gIVwiKTtcclxuXHRcdGxldCBzb2NrZXRHYW1lID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XHJcblx0XHRyZXF1aXJlKCcuL2dhbWUvcHJlel9nYW1lJykuaW5pdChzb2NrZXRHYW1lKTtcclxuXHRcdGxldCBzb2NrZXRQcmV6ID0gbnVsbDtcclxuXHRcdGxldCBzb2NrZXRQcmV6TG9jYWwgPSBudWxsO1xyXG5cdFx0aWYgKGNvbmZpZy5sb2NhbCl7XHJcblx0XHRcdHNvY2tldFByZXogPSBzb2NrZXRHYW1lOyAgIFxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHNvY2tldFByZXogPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcclxuXHRcdFx0c29ja2V0UHJlekxvY2FsID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzc0xvY2FsKTtcclxuXHRcdH1cclxuIFxyXG4gXHRcdC8vc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIGxpZ2h0XCIpO1xyXG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBPcmllbnRhdGlvblwiKTtcclxuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL29yaWVudGF0aW9uJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgRGV2aWNlTW90aW9uXCIpO1xyXG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvZGV2aWNlbW90aW9uJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgVm9pY2VcIik7XHJcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmVmb3JlIFVzZXJNZWRpYVwiKTtcclxuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL3VzZXJtZWRpYScpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcclxuIFx0XHRcdFxyXG4gXHRcdC8vfSwgMTAwMCk7XHJcblx0fVx0XHJcblxyXG5cdHJlcXVpcmUoJy4vaGlnaGxpZ2h0cy9oaWdobGlnaHRzQ29kZScpLmluaXQoKTtcclxuIFxyXG5cdFxyXG59ICk7XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxubGV0IG1vdGlvbkVuYWJsZSA9IGZhbHNlLFxyXG4gICAgbW90aW9uRWx0ID0gbnVsbCxcclxuICAgIGJhdHRlcnkxRWx0ID0gbnVsbCxcclxuICAgIGJhdHRlcnkyRWx0ID0gbnVsbCxcclxuICAgIGNoYXJnZUJhdHRlcnkxID0gMCxcclxuICAgIGNoYXJnZUJhdHRlcnkyID0gMCxcclxuICAgIHdpbm5lciA9IG51bGwsXHJcbiAgICBmdWxsVmFsdWUxID0gMTAwMDAsXHJcbiAgICBmdWxsVmFsdWUyID0gMTAwMDAsXHJcbiAgICBtYXBVc2Vyc0FjdGl2ID0ge307XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBiYXRVcGRhdGUodGVhbSwgY2hhcmdlKSB7XHJcbiAgICBsZXQgY29sID0gW10sXHJcbiAgICAgICAgZWx0ID0gbnVsbDtcclxuICAgIGlmICh0ZWFtID09PSBcIjFcIikge1xyXG4gICAgICAgIGVsdCA9IGJhdHRlcnkxRWx0O1xyXG4gICAgICAgIC8vIFJlZCAtIERhbmdlciFcclxuICAgICAgICBjb2wgPSBbXCIjNzUwOTAwXCIsIFwiI2M2NDYyYlwiLCBcIiNiNzQ0MjRcIiwgXCIjZGYwYTAwXCIsIFwiIzU5MDcwMFwiXTtcclxuICAgIH0gLyplbHNlIGlmIChjaGFyZ2UgPCA0MCkge1xyXG4gICAgLy8gWWVsbG93IC0gTWlnaHQgd2FubmEgY2hhcmdlIHNvb24uLi5cclxuICAgIGNvbCA9IFtcIiM3NTRmMDBcIiwgXCIjZjJiYjAwXCIsIFwiI2RiYjMwMFwiLCBcIiNkZjhmMDBcIiwgXCIjNTkzYzAwXCJdO1xyXG4gIH0gKi9lbHNlIHtcclxuICAgICAgICBlbHQgPSBiYXR0ZXJ5MkVsdDtcclxuICAgICAgICAvLyBHcmVlbiAtIEFsbCBnb29kIVxyXG4gICAgICAgIGNvbCA9IFtcIiMzMTZkMDhcIiwgXCIjNjBiOTM5XCIsIFwiIzUxYWEzMVwiLCBcIiM2NGNlMTFcIiwgXCIjMjU1NDA1XCJdO1xyXG4gICAgfVxyXG4gICAgZWx0LnN0eWxlW1wiYmFja2dyb3VuZC1pbWFnZVwiXSA9IFwibGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCB0cmFuc3BhcmVudCA1JSwgXCIgKyBjb2xbMF0gKyBcIiA1JSwgXCIgKyBjb2xbMF0gKyBcIiA3JSwgXCIgKyBjb2xbMV0gKyBcIiA4JSwgXCIgKyBjb2xbMV0gKyBcIiAxMCUsIFwiICsgY29sWzJdICsgXCIgMTElLCBcIiArIGNvbFsyXSArIFwiIFwiICsgKGNoYXJnZSAtIDMpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgKGNoYXJnZSAtIDIpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBcIiArIGNvbFs0XSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBibGFjayBcIiArIChjaGFyZ2UgKyA1KSArIFwiJSwgYmxhY2sgOTUlLCB0cmFuc3BhcmVudCA5NSUpLCBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSkgMCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDclLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuOCkgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDAlLCByZ2JhKDI1NSwyNTUsMjU1LDApIDQxJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA4NiUsIHJnYmEoMjU1LDI1NSwyNTUsMC42KSA5MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5MiUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5NSUsIHJnYmEoMjU1LDI1NSwyNTUsMC41KSA5OCUpXCI7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcclxuICAgICAgICBpZiAobW90aW9uRW5hYmxlICYmIG1zZy50eXBlID09PSAnZGV2aWNlbW90aW9uJykge1xyXG4gICAgICAgICAgICBpZiAoIXdpbm5lciAmJiBtc2cudGVhbSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRtcFVzZXJUZWFtID0gbWFwVXNlcnNBY3Rpdlttc2cuaWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0bXBVc2VyVGVhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcFVzZXJzQWN0aXZbbXNnLmlkXSA9IG1zZy50ZWFtO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFZhbHVlMSArPSAxMDAwMDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1zZy50ZWFtID09PSBcIjJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsVmFsdWUyICs9IDEwMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBwZXJjZW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFyZ2VCYXR0ZXJ5MSArPSBtc2cudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkxIC8gZnVsbFZhbHVlMSkgKiAxMDApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFyZ2VCYXR0ZXJ5MiArPSBtc2cudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkyIC8gZnVsbFZhbHVlMikgKiAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJhdFVwZGF0ZShtc2cudGVhbSwgTWF0aC5taW4ocGVyY2VudCwgOTApKTtcclxuICAgICAgICAgICAgICAgIGlmICghd2lubmVyICYmIE1hdGgubWluKHBlcmNlbnQsIDkwKSA9PT0gOTApIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5uZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldmljZW1vdGlvbiAud2luLmZpcmVmb3gnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV2aWNlbW90aW9uIC53aW4uY2hyb21lJykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcclxuICAgIGlmIChzb2NrZXRMb2NhbCkge1xyXG4gICAgICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICB9XHJcbiAgICBiYXR0ZXJ5MUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTEnKTtcclxuICAgIGJhdHRlcnkyRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhdHRlcnktMicpO1xyXG5cclxuICAgIGJhdFVwZGF0ZShcIjFcIiwgMCk7XHJcbiAgICBiYXRVcGRhdGUoXCIyXCIsIDApO1xyXG5cclxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzb2NrZXQuZW1pdCgnY29uZmlnJywge1xyXG4gICAgICAgICAgICB0eXBlOiBcImdhbWVcIixcclxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vdGlvbkVuYWJsZSA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzb2NrZXQuZW1pdCgnY29uZmlnJywge1xyXG4gICAgICAgICAgICB0eXBlOiBcImdhbWVcIixcclxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcclxuICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb3Rpb25FbmFibGUgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0OiBpbml0XHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmxldCBsaWdodEVuYWJsZSA9IGZhbHNlLFxyXG5cdGxpZ2h0RWx0ID0gbnVsbDtcclxuXHJcblxyXG4vLyBXZSB1cGRhdGUgdGhlIGNzcyBTdHlsZVxyXG5mdW5jdGlvbiB1cGRhdGVMaWdodChkYXRhKXtcclxuXHRsZXQgcHJlZml4TGlnaHQgPSAnLXdlYmtpdC0nO1xyXG5cdGxldCBwZXJjZW50ID0gZGF0YTtcclxuXHR2YXIgc3R5bGUgPSBwcmVmaXhMaWdodCsncmFkaWFsLWdyYWRpZW50KGNlbnRlciwgJ1xyXG5cdCAgICArJyBlbGxpcHNlIGNvdmVyLCAnXHJcblx0ICAgICsnIHJnYmEoMTk4LDE5NywxNDUsMSkgMCUsJ1xyXG5cdCAgICArJyByZ2JhKDAsMCwwLDEpICcrcGVyY2VudCsnJSknXHJcblx0ICAgIDtcclxuXHRsaWdodEVsdC5zdHlsZS5iYWNrZ3JvdW5kID0gc3R5bGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCl7XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKXtcclxuXHRcdGlmIChsaWdodEVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ2xpZ2h0Jyl7XHJcblx0XHRcdHVwZGF0ZUxpZ2h0KG1zZy52YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcclxuICAgIGlmIChzb2NrZXRMb2NhbCl7XHJcblx0ICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICB9XHJcblx0bGlnaHRFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlnaHQtYmcnKTtcclxuXHJcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1saWdodCcsIGZ1bmN0aW9uKCl7XHJcblx0XHRsaWdodEVuYWJsZSA9IHRydWU7XHJcblx0fSk7XHJcblxyXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1saWdodCcsIGZ1bmN0aW9uKCl7XHJcblx0XHRsaWdodEVuYWJsZSA9IGZhbHNlO1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0aW5pdCA6IGluaXRcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxubGV0IG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2UsIFxyXG5cdGxvY2tFbHQgPSBudWxsLFxyXG5cdHJlc0VsdCA9IG51bGwsXHJcblx0b3BlbiA9IGZhbHNlO1xyXG5cclxuY29uc3QgdmFsdWVzID0geyBmaXJzdCA6IHt2YWx1ZTogNTAsIGZvdW5kOiBmYWxzZX0sIFxyXG5cdFx0XHRcdHNlY29uZCA6IHt2YWx1ZTogODAsIGZvdW5kOiBmYWxzZX0sIFxyXG5cdFx0XHRcdHRoaXJkIDoge3ZhbHVlIDogMTAsIGZvdW5kIDogZmFsc2V9XHJcblx0XHRcdH07XHJcblxyXG5cclxuLy8gQWNjb3JkaW5nIHRvIHRoZSBudW1iZXIgb2YgdW5sb2NrLCB3ZSBqdXN0IHR1cm4gdGhlIGltYWdlIG9yIHdlIG9wZW4gdGhlIGRvb3JcclxuZnVuY3Rpb24gdXBkYXRlUm90YXRpb24oekFscGhhLCBmaXJzdFZhbHVlKXtcclxuXHRpZiAoIW9wZW4pe1xyXG5cdFx0bGV0IGRlbHRhID0gZmlyc3RWYWx1ZSAtIHpBbHBoYTtcclxuXHRcdGxldCByb3RhdGlvbiA9IGRlbHRhO1xyXG5cdFx0aWYgKGRlbHRhIDwgMCl7XHJcblx0XHRcdHJvdGF0aW9uID0gZmlyc3RWYWx1ZSszNjAtekFscGhhO1xyXG5cdFx0fVx0XHRcclxuXHRcdGxvY2tFbHQuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooJytyb3RhdGlvbisnZGVnKSc7XHJcblxyXG5cdFx0bGV0IGN1cnJlbnRWYWx1ZSA9IDEwMCAtIE1hdGgucm91bmQoKHJvdGF0aW9uKjEwMCkvMzYwKTtcclxuXHRcdHJlc0VsdC5pbm5lckhUTUwgPSBjdXJyZW50VmFsdWU7XHJcblx0XHRpZiAodmFsdWVzLmZpcnN0LmZvdW5kIFxyXG5cdFx0XHQmJiB2YWx1ZXMuc2Vjb25kLmZvdW5kXHJcblx0XHRcdCYmIHZhbHVlcy50aGlyZC5mb3VuZCl7XHRcdFx0XHJcblx0XHRcdG9wZW4gPSB0cnVlO1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24nKS5jbGFzc0xpc3QuYWRkKFwib3BlblwiKTtcclxuXHRcdH1lbHNlIGlmICghdmFsdWVzLmZpcnN0LmZvdW5kKSB7XHJcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5maXJzdC52YWx1ZSl7XHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLmZpcnN0Jyk7XHJcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xyXG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcclxuXHRcdFx0XHR2YWx1ZXMuZmlyc3QuZm91bmQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy5zZWNvbmQuZm91bmQpIHtcclxuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLnNlY29uZC52YWx1ZSl7XHJcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5zZWNvbmQnKTtcclxuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XHJcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xyXG5cdFx0XHRcdHZhbHVlcy5zZWNvbmQuZm91bmQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy50aGlyZC5mb3VuZCkge1xyXG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMudGhpcmQudmFsdWUpe1xyXG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAudGhpcmQnKTtcclxuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XHJcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xyXG5cdFx0XHRcdHZhbHVlcy50aGlyZC5mb3VuZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCl7XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKXtcclxuXHRcdGlmIChvcmllbnRhdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ29yaWVudGF0aW9uJyl7XHJcblx0XHRcdHVwZGF0ZVJvdGF0aW9uKG1zZy52YWx1ZSwgbXNnLmZpcnN0VmFsdWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICBpZihzb2NrZXRMb2NhbCl7XHJcblx0ICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICB9XHJcblxyXG5cdGxvY2tFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2FmZV9sb2NrJyk7XHJcblx0cmVzRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yaWVudGF0aW9uIC5yZXNwIC52YWx1ZScpO1xyXG5cclxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcclxuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gdHJ1ZTtcclxuXHR9KTtcclxuXHJcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcclxuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2U7XHJcblx0fSk7XHRcclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0IDogaW5pdFxyXG59OyIsIid1c2Ugc3RyaWN0J1xyXG5cclxubGV0IHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlLFxyXG4gICAgdXNlcm1lZGlhRWx0ID0gbnVsbDtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKSB7XHJcbiAgICAgICAgaWYgKHVzZXJtZWRpYUVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ3VzZXJtZWRpYScpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob3RvU3RyZWFtJykuc2V0QXR0cmlidXRlKCdzcmMnLCBtc2cudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcclxuXHJcbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcclxuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xyXG4gICAgfVxyXG4gICAgdXNlcm1lZGlhRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJtZWRpYS1iZycpO1xyXG5cclxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC11c2VybWVkaWEnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB1c2VybWVkaWFFbmFibGUgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AtdXNlcm1lZGlhJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdXNlcm1lZGlhRW5hYmxlID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdDogaW5pdFxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5sZXQgdm9pY2VFbmFibGUgPSBmYWxzZSxcclxuICAgIHZvaWNlRlIgPSBudWxsLFxyXG4gICAgc3ludGggPSBudWxsLFxyXG4gICAgcmVjb2duaXRpb24gPSBudWxsLFxyXG4gICAgcmVjb2duaXRpb25Eb25lID0gZmFsc2UsXHJcbiAgICBuZXh0U2xpZGUgPSBmYWxzZSxcclxuICAgIGVsdE1pYyA9IG51bGwsXHJcbiAgICBpbnB1dE1pYyA9IG51bGxcclxuICAgIDtcclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlVm9pY2VMaXN0KCkge1xyXG4gICAgbGV0IHZvaWNlcyA9IHN5bnRoLmdldFZvaWNlcygpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2b2ljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodm9pY2VzW2ldLmxhbmcgPT09ICdmci1GUicpIHtcclxuICAgICAgICAgICAgdm9pY2VGUiA9IHZvaWNlc1tpXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIlcywgJU8gXCIsIHZvaWNlc1tpXS5sYW5nLCB2b2ljZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVm9pY2VSZXN1bHRzKGV2ZW50KSB7XHJcbiAgICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25FdmVudCByZXN1bHRzIHByb3BlcnR5IHJldHVybnMgYSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0XHJcbiAgICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25SZXN1bHRMaXN0IG9iamVjdCBjb250YWlucyBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBvYmplY3RzLlxyXG4gICAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XHJcbiAgICAvLyBUaGUgZmlyc3QgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IGF0IHBvc2l0aW9uIDAuXHJcbiAgICAvLyBFYWNoIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdCBjb250YWlucyBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIG9iamVjdHMgdGhhdCBjb250YWluIGluZGl2aWR1YWwgcmVzdWx0cy5cclxuICAgIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxyXG4gICAgLy8gVGhlIHNlY29uZCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBhdCBwb3NpdGlvbiAwLlxyXG4gICAgLy8gV2UgdGhlbiByZXR1cm4gdGhlIHRyYW5zY3JpcHQgcHJvcGVydHkgb2YgdGhlIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0IFxyXG4gICAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xyXG4gICAgaW5wdXRNaWMuaW5uZXJIVE1MID0gZmluYWxTdHI7XHJcbiAgICAvL2RpYWdub3N0aWMudGV4dENvbnRlbnQgPSAnUmVzdWx0IHJlY2VpdmVkOiAnICsgY29sb3IgKyAnLic7XHJcbiAgICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgY29uc29sZS5sb2coJ0NvbmZpZGVuY2U6ICcgKyBmaW5hbFN0cik7XHJcbiAgICBpZiAoZmluYWxTdHIuaW5kZXhPZignc3VpdmFudCcpICE9IC0xKSB7XHJcbiAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xyXG4gICAgICAgIGlmICghcmVjb2duaXRpb25Eb25lKSB7XHJcbiAgICAgICAgICAgIHJlY29nbml0aW9uRG9uZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHNwZWFrKFwiQm9uam91ciBKRiwgaidhaSBjb21wcmlzIHF1ZSB0dSB2b3VsYWlzIHBhc3NlciBhdSBzbGlkZSBzdWl2YW50LCBhaXMgamUgYmllbiBjb21wcmlzID9cIilcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbiBkZSBzcGVlY2hcIilcclxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gdm9pY2VGUlwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZmluYWxTdHIuaW5kZXhPZignb3VpJykgIT0gLTEpIHtcclxuICAgICAgICBpZiAoIW5leHRTbGlkZSkge1xyXG4gICAgICAgICAgICBuZXh0U2xpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVm9pY2VFbmQoKSB7XHJcbiAgICAvLyBXZSBkZXRlY3QgdGhlIGVuZCBvZiBzcGVlY2hSZWNvZ25pdGlvbiBwcm9jZXNzXHJcbiAgICBjb25zb2xlLmxvZygnRW5kIG9mIHJlY29nbml0aW9uJylcclxuICAgIHJlY29nbml0aW9uLnN0b3AoKTtcclxuICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG59O1xyXG5cclxuLy8gV2UgZGV0ZWN0IGVycm9yc1xyXG5mdW5jdGlvbiBoYW5kbGVWb2ljZUVycm9yKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vLXNwZWVjaCcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTm8gU3BlZWNoJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ2F1ZGlvLWNhcHR1cmUnKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ05vIG1pY3JvcGhvbmUnKVxyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmVycm9yID09ICdub3QtYWxsb3dlZCcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTm90IEFsbG93ZWQnKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIHNwZWFrKHZhbHVlLCBjYWxsYmFja0VuZCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG5cclxuICAgICAgICBpZiAoIXZvaWNlRlIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHZhbHVlKTtcclxuICAgICAgICB1dHRlclRoaXMudm9pY2UgPSB2b2ljZUZSO1xyXG4gICAgICAgIHV0dGVyVGhpcy5waXRjaCA9IDE7XHJcbiAgICAgICAgdXR0ZXJUaGlzLnJhdGUgPSAxO1xyXG4gICAgICAgIHV0dGVyVGhpcy5vbmVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN5bnRoLnNwZWFrKHV0dGVyVGhpcyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCkge1xyXG5cclxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSByZWNvbm5haXNzYW5jZSB2b2NhbGVcclxuICAgIHZhciBTcGVlY2hSZWNvZ25pdGlvbiA9IFNwZWVjaFJlY29nbml0aW9uIHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uXHJcbiAgICB2YXIgU3BlZWNoR3JhbW1hckxpc3QgPSBTcGVlY2hHcmFtbWFyTGlzdCB8fCB3ZWJraXRTcGVlY2hHcmFtbWFyTGlzdFxyXG4gICAgdmFyIFNwZWVjaFJlY29nbml0aW9uRXZlbnQgPSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uRXZlbnRcclxuICAgIHJlY29nbml0aW9uID0gbmV3IFNwZWVjaFJlY29nbml0aW9uKCk7XHJcbiAgICB2YXIgZ3JhbW1hciA9ICcjSlNHRiBWMS4wOyBncmFtbWFyIGJpbm9tZWQ7IHB1YmxpYyA8Ymlub21lZD4gPSBzdWl2YW50IHwgcHLDqWPDqWRlbnQgfCBwcmVjZWRlbnQgfCBzbGlkZSB8IGRpYXBvc2l0aXZlIHwgc3VpdmFudGUgfCBvdWkgOyc7XHJcbiAgICB2YXIgc3BlZWNoUmVjb2duaXRpb25MaXN0ID0gbmV3IFNwZWVjaEdyYW1tYXJMaXN0KCk7XHJcbiAgICBzcGVlY2hSZWNvZ25pdGlvbkxpc3QuYWRkRnJvbVN0cmluZyhncmFtbWFyLCAxKTtcclxuICAgIHJlY29nbml0aW9uLmdyYW1tYXJzID0gc3BlZWNoUmVjb2duaXRpb25MaXN0O1xyXG4gICAgcmVjb2duaXRpb24uY29udGludW91cyA9IHRydWU7XHJcbiAgICByZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcclxuICAgIHJlY29nbml0aW9uLmludGVyaW1SZXN1bHRzID0gdHJ1ZTtcclxuICAgIHJlY29nbml0aW9uLm9ucmVzdWx0ID0gaGFuZGxlVm9pY2VSZXN1bHRzO1xyXG4gICAgcmVjb2duaXRpb24ub25lbmQgPSBoYW5kbGVWb2ljZUVuZDtcclxuICAgIHJlY29nbml0aW9uLm9uZXJyb3IgPSBoYW5kbGVWb2ljZUVycm9yO1xyXG5cclxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSBzeW50aMOoc2Ugdm9jYWxlXHJcbiAgICBzeW50aCA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXM7XHJcbiAgICBwb3B1bGF0ZVZvaWNlTGlzdCgpO1xyXG4gICAgaWYgKHNwZWVjaFN5bnRoZXNpcy5vbnZvaWNlc2NoYW5nZWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNwZWVjaFN5bnRoZXNpcy5vbnZvaWNlc2NoYW5nZWQgPSBwb3B1bGF0ZVZvaWNlTGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcclxuICAgICAgICBpZiAodm9pY2VFbmFibGUgJiYgbXNnLnR5cGUgPT09ICd2b2ljZScpIHtcclxuICAgICAgICAgICAgaWYgKG1zZy52YWx1ZSA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFlbHRNaWMpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbHRNaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtb1NwZWVjaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0TWljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwZWVjaF9pbnB1dCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobXNnLnZhbHVlID09PSAnc3RvcCcpIHtcclxuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSBjb21tdW51aWNhdGlvblxyXG4gICAgc29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XHJcbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcclxuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC13ZWJzcGVlY2gnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIHZvaWNlRW5hYmxlID0gdHJ1ZTtcclxuICAgICAgICB9Y2F0Y2goZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdG9wLXdlYnNwZWVjaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRyeXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdm9pY2VFbmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHJlY29nbml0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1jYXRjaChlKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5pdDogaW5pdFxyXG59Il19
