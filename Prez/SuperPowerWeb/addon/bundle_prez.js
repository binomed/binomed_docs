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


	/*
	// Code User Media 1
	managementGeneric('user-media-v1', [{
			'top': 'calc(90px + 13.8em)',
			'left': '60px',
			'width': '1000px',
			'height': '1.4em'
		},
		{
			'top': 'calc(90px + 7.75em)',
			'left': '180px',
			'width': '210px',
			'height': '1.4em'
		},
		{
			'top': 'calc(90px + 7.75em)',
			'left': '380px',
			'width': '90px',
			'height': '1.4em'
		},
		{
			'top': 'calc(90px + 10.35em)',
			'left': '100px',
			'width': '800px',
			'height': '2.4em'
		}
	]);

	// Code Device Proximity
	managementGeneric('device-proximity', [{
		'top': 'calc(90px + 1.15em)',
		'left': '250px',
		'width': '170px'
	}]);

	// Code User Proximity
	managementGeneric('user-proximity', [{
		'top': 'calc(90px + 1.15em)',
		'left': '150px',
		'width': '150px'
	}]);

	// Code Web Speech
	managementGeneric('web-speech', [{
			'top': 'calc(90px + 1.15em)',
			'width': '400px'
		},
		{
			'top': 'calc(90px + 2.30em)',
			'width': '500px'
		},
		{
			'top': 'calc(90px + 3.45em)',
			'width': '550px'
		},
		{
			'top': 'calc(90px + 5.75em)',
			'width': '300px'
		},
		{
			'top': 'calc(90px + 6.90em)',
			'width': '300px'
		},
		{
			'top': 'calc(90px + 8.05em)',
			'left': '280px',
			'width': '450px'
		}
	]);

	// Code Web Speech Grammar
	managementGeneric('web-speech-grammar', [{
			'top': 'calc(90px + 2.30em)',
			'width': '750px'
		},
		{
			'top': 'calc(90px + 3.45em)',
			'width': '700px'
		},
		{
			'top': 'calc(90px + 4.60em)',
			'width': '650px'
		}
	]);

	// Code Web Speech Synthesis
	managementGeneric('web-speech-synthesis', [{
			'top': 'calc(90px + 2.30em)',
			'width': '850px'
		},
		{
			'top': 'calc(90px + 3.45em)',
			'width': '400px'
		},
		{
			'top': 'calc(90px + 4.60em)',
			'width': '450px'
		},
		{
			'top': 'calc(90px + 5.75em)',
			'width': '400px'
		},
		{
			'top': 'calc(90px + 6.90em)',
			'width': '350px'
		}
	]);

	// Code Notifications
	managementGeneric('notification', [{
			'top': 'calc(90px + 2.30em)',
			'width': '350px',
			'left': '120px'
		},
		{
			'top': 'calc(90px + 3.45em)',
			'width': '800px',
			'left': '140px'
		},
		{
			'top': 'calc(90px + 4.60em)',
			'width': '800px',
			'height': '5.5em',
			'left': '170px'
		}
	]);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovcHJlel9zdXBlcl9wb3dlci5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvb3JpZW50YXRpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy92b2ljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25aQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUFkZHJlc3MobG9jYWwpe1xuXHRpZiAobG9jYWwgfHwgKGxvY2F0aW9uLnBvcnQgJiYgKGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiKSkpe1xuXHRcdHJldHVybiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODQ0M1wiXG5cdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiODQ0M1wiKXtcblx0XHRyZXR1cm4gXCJodHRwczovL2Jpbm9tZWQuZnI6ODQ0M1wiO1xuXHR9ZWxzZXtcblx0XHRyZXR1cm4gbnVsbDtcdFxuXHR9IFxufVxuXG52YXIgYWRkcmVzcyA9IGNhbGN1bGF0ZUFkZHJlc3MoKTtcbnZhciBhZGRyZXNzTG9jYWwgPSBjYWxjdWxhdGVBZGRyZXNzKHRydWUpO1xudmFyIGxvY2FsID0gbG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjMwMDBcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGFkZHJlc3MgOiBhZGRyZXNzLFxuICAgIGFkZHJlc3NMb2NhbCA6IGFkZHJlc3NMb2NhbCxcblx0bG9jYWwgOiBsb2NhbFxufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29udGV4dCA9IG51bGwsXG5cdFBVQkxJQyA9IDEsXG5cdFdBSVQgPSAyLFxuXHRSRVNQID0gMyxcblx0cHVibGljQnVmZmVyID0gbnVsbCxcblx0d2FpdEJ1ZmZlciA9IG51bGwsXG5cdHJlc3BCdWZmZXIgPSBudWxsLFxuXHRjdXJyZW50U291cmNlID0gbnVsbDtcblxudHJ5e1xuXHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXHRjb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufWNhdGNoKGUpe1xuXHRjb250ZXh0ID0gbnVsbDtcblx0Y29uc29sZS5sb2coXCJObyBXZWJBUEkgZGVjdGVjdFwiKTtcbn1cblxuZnVuY3Rpb24gbG9hZFNvdW5kKHVybCwgYnVmZmVyVG9Vc2Upe1xuXHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHQvLyBEZWNvZGUgYXN5bmNocm9ub3VzbHlcblx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRjb250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihidWZmZXIpIHtcblx0XHRcdGlmIChidWZmZXJUb1VzZSA9PT0gUFVCTElDKXtcblx0XHQgIFx0XHRwdWJsaWNCdWZmZXIgPSBidWZmZXI7XG5cdFx0XHR9ZWxzZSBpZiAoYnVmZmVyVG9Vc2UgPT09IFdBSVQpe1xuXHRcdCAgXHRcdHdhaXRCdWZmZXIgPSBidWZmZXI7XG5cdFx0XHR9ZWxzZSBpZiAoYnVmZmVyVG9Vc2UgPT09IFJFU1Ape1xuXHRcdCAgXHRcdHJlc3BCdWZmZXIgPSBidWZmZXI7XG5cdFx0XHR9XG5cdFx0fSwgZnVuY3Rpb24oZSl7XG5cdFx0XHRjb25zb2xlLmxvZygnRXJyb3IgZGVjb2RpbmcgZmlsZScsIGUpO1xuXHRcdH0pO1xuXHR9XG5cdHJlcXVlc3Quc2VuZCgpO1xufVxuXG5mdW5jdGlvbiBsb2FkUHVibGljU291bmQoKXtcblx0aWYoY29udGV4dClcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL3F1ZXN0aW9uX3B1YmxpY19jb3VydGUubXAzXCIsIFBVQkxJQyk7XG59XG5cbmZ1bmN0aW9uIGxvYWRXYWl0U291bmQoKXtcblx0aWYgKGNvbnRleHQpXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9hdHRlbnRlX3JlcG9uc2VfY291cnRlLm1wM1wiLCBXQUlUKTtcbn1cblxuZnVuY3Rpb24gbG9hZFJlc3BTb3VuZCgpe1xuXHRpZiAoY29udGV4dClcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL2Jvbm5lX3JlcG9uc2UubXAzXCIsIFJFU1ApO1xufVxuXG5mdW5jdGlvbiBwbGF5U291bmQoYnVmZmVyKXtcblx0dmFyIHNvdXJjZSA9IGNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7IC8vIGNyZWF0ZXMgYSBzb3VuZCBzb3VyY2Vcblx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIC8vIHRlbGwgdGhlIHNvdXJjZSB3aGljaCBzb3VuZCB0byBwbGF5XG5cdHNvdXJjZS5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pOyAgICAgICAvLyBjb25uZWN0IHRoZSBzb3VyY2UgdG8gdGhlIGNvbnRleHQncyBkZXN0aW5hdGlvbiAodGhlIHNwZWFrZXJzKVxuXHRzb3VyY2Uuc3RhcnQoMCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGxheSB0aGUgc291cmNlIG5vd1xuXHRyZXR1cm4gc291cmNlO1xufVxuXG5sb2FkUHVibGljU291bmQoKTtcbmxvYWRXYWl0U291bmQoKTtcbmxvYWRSZXNwU291bmQoKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogQXBpcyBleHBvc2VkXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKi9cblxuZnVuY3Rpb24gcGxheVB1YmxpYygpe1xuXHRpZiAoY29udGV4dCl7XG5cdFx0c3RvcCgpO1xuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQocHVibGljQnVmZmVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwbGF5V2FpdCgpe1xuXHRpZiAoY29udGV4dCl7XG5cdFx0c3RvcCgpO1xuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQod2FpdEJ1ZmZlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGxheVJlc3AoKXtcblx0aWYgKGNvbnRleHQpe1xuXHRcdHN0b3AoKTtcblx0XHRjdXJyZW50U291cmNlID0gcGxheVNvdW5kKHJlc3BCdWZmZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0b3AoKXtcblx0aWYgKGN1cnJlbnRTb3VyY2UgJiYgY3VycmVudFNvdXJjZS5zdG9wKXtcblx0XHRjdXJyZW50U291cmNlLnN0b3AoMCk7XG5cdH1cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwbGF5UHVibGljIDogcGxheVB1YmxpYyxcblx0cGxheVdhaXQgOiBwbGF5V2FpdCxcblx0cGxheVJlc3AgOiBwbGF5UmVzcCxcblx0c3RvcCA6IHN0b3Bcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZy9jb25maWcnKSxcblx0YXVkaW8gPSByZXF1aXJlKCcuL2F1ZGlvJyksXG5cdHNvY2tldCA9IG51bGwsXG5cdHNjb3JlSW5kZXggPSB7fTtcblxuXG5cbmZ1bmN0aW9uIGhpZGVRdWVzdGlvbigpe1x0XG5cdGF1ZGlvLnN0b3AoKTtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ2hpZGVRdWVzdGlvbidcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZVF1ZXN0aW9uKGluZGV4KXtcblx0YXVkaW8ucGxheVB1YmxpYygpO1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnY2hhbmdlUXVlc3Rpb24nLFxuXHRcdCdpbmRleCcgOiBpbmRleCxcblx0XHRyZXBBIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEFgKS5pbm5lckhUTUwsXG5cdFx0cmVwQiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBCYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEMgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQ2ApLmlubmVySFRNTCxcblx0XHRyZXBEIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcERgKS5pbm5lckhUTUwsXG5cblx0fSk7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdzaG93Tm90aWZpY2F0aW9uJ1x0XHRcblxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1Njb3JlKGluZGV4KXtcblx0bGV0IG15SGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG5cdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG5cblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke2NvbmZpZy5hZGRyZXNzfS9zY29yZS8ke2luZGV4fWAsbXlJbml0KTtcblx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XG5cdFx0YXVkaW8ucGxheVdhaXQoKTtcblx0XHQvLyBPbiBuZSByZXRyYWlyZSBwYXMgdW5lIHF1ZXN0aW9uIGTDqWrDoCB0cmFpdMOpZVxuXHRcdGlmIChzY29yZUluZGV4W2BxdWVzdGlvbl8ke2luZGV4fWBdKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0bGV0IHRvdGFsID0ganNvbi5yZXBBICsganNvbi5yZXBCICsganNvbi5yZXBDICsganNvbi5yZXBEO1xuXHRcdHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY2hhcnRfcXVlc3Rpb25fJHtpbmRleH1gKS5nZXRDb250ZXh0KFwiMmRcIik7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHQgICAgbGFiZWxzOiBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCJdLFxuXHRcdCAgICBkYXRhc2V0czogW1xuXHRcdCAgICAgICAge1xuXHRcdCAgICAgICAgICAgIGxhYmVsOiBcIkFcIixcblx0XHQgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjUpXCIsXG5cdFx0ICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjgpXCIsXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0RmlsbDogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNzUpXCIsXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcblx0XHQgICAgICAgICAgICBkYXRhOiBbTWF0aC5yb3VuZCgoanNvbi5yZXBBIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQiAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEMgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBEIC8gdG90YWwpICogMTAwKV1cblx0XHQgICAgICAgIH1cblx0XHQgICAgXVxuXHRcdH07XG5cdFx0dmFyIG15QmFyQ2hhcnQgPSBuZXcgQ2hhcnQoY3R4KS5CYXIoZGF0YSwge1xuXHRcdFx0IC8vQm9vbGVhbiAtIFdoZXRoZXIgZ3JpZCBsaW5lcyBhcmUgc2hvd24gYWNyb3NzIHRoZSBjaGFydFxuXHQgICAgXHRzY2FsZVNob3dHcmlkTGluZXMgOiBmYWxzZSxcblx0ICAgIFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBjb2xvdXJcblx0ICAgIFx0c2NhbGVGb250Q29sb3I6IFwib3JhbmdlXCIsXG5cdFx0fSk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0YXVkaW8ucGxheVJlc3AoKTtcblx0XHRcdGxldCBnb29kQW5zd2VyRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cmVzcC1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AuZ29vZGApO1xuXHRcdFx0bGV0IGFud3NlciA9IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBBJykgPyAnQScgOlxuXHRcdFx0XHRcdFx0IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBCJykgPyAnQicgOlxuXHRcdFx0XHRcdFx0IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBDJykgPyAnQycgOiAnRCc7XG5cdFx0XHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0XHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0XHRcdGV2ZW50VHlwZSA6ICdhbnN3ZXInLFxuXHRcdFx0XHR2YWx1ZSA6IGFud3NlclxuXHRcdFx0fSk7XHRcdFx0IFxuXHRcdFx0Z29vZEFuc3dlckVsdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0XHRpZiAoaW5kZXggPT09IDQpe1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdFx0XHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0XHRcdFx0XHRldmVudFR5cGUgOiAnY2FsY3VsYXRlV2lubmVycycsXG5cdFx0XHRcdFx0XHRudW1iZXJXaW5uZXJzIDogMixcblx0XHRcdFx0XHRcdHZhbHVlIDogYW53c2VyXG5cdFx0XHRcdFx0fSk7XHRcdFxuXHRcdFx0XHR9LCAxMDAwKTtcblx0XHRcdH1cblx0XHR9LCA1MDAwKTtcblxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldFRvU2V0KXtcblx0c29ja2V0ID0gc29ja2V0VG9TZXQ7XG5cdGhpZGVRdWVzdGlvbigpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0xJywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbigxKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSgxKTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTInLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDIpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tMicsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDIpO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMycsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMyk7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0zJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMyk7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi00JywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbig0KTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTQnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSg0KTtcblx0fSk7XG5cblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVpdC1xdWVzdGlvbicsIGhpZGVRdWVzdGlvbik7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnOTVweCc7XG5jb25zdCBMSU5FX0hFSUdIVCA9ICcwLjU1ZW0nO1xuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuY29uc3QgTEVGVF9GSVJTVCA9ICc2MHB4JztcbmNvbnN0IExFRlRfVEFCID0gJzEwMHB4JztcblxuZnVuY3Rpb24gbWFuYWdlbWVudEdlbmVyaWMoa2V5RWx0LCBwb3NpdGlvbkFycmF5KSB7XG5cblx0Y29uc3QgZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xuXHRsZXQgcHJvZ3Jlc3MgPSBSZXZlYWwuZ2V0UHJvZ3Jlc3MoKTtcblxuXHRmdW5jdGlvbiBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuXHRcdHRyeSB7XG5cdFx0XHRsZXQgcHJvcGVydGllcyA9IG51bGxcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG5cdFx0XHRcdHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4ICsgMV07XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuXHRcdFx0XHRwcm9wZXJ0aWVzID0gcG9zaXRpb25BcnJheVtpbmRleF07XG5cdFx0XHRcdC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG5cdFx0XHRcdC8qaWYgKGluZGV4ID4gMCkge1xuXHRcdFx0XHRcdHByb3BlcnRpZXMgPSBwb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG5cdFx0XHRcdH0qL1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFwcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0YXBwbHlQcm9wZXJ0aWVzKHByb3BlcnRpZXMpO1xuXG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihlKVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGFwcGx5UHJvcGVydGllcyhwcm9wZXJ0aWVzKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcblx0XHRcdGNvbnN0IGFyZWEgPSB7fTtcblx0XHRcdGNvbnN0IHBvc2l0aW9uID0ge307XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3Qga2V5ID0ga2V5c1tpXTtcblx0XHRcdFx0c3dpdGNoICh0cnVlKSB7XG5cdFx0XHRcdFx0Y2FzZSBrZXkgPT09ICdsaW5lJzpcblx0XHRcdFx0XHRjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxuXHRcdFx0XHRcdGNhc2Uga2V5ID09PSAnY29sJzpcblx0XHRcdFx0XHRjYXNlIGtleSA9PT0gJ25iQ29scyc6XG5cdFx0XHRcdFx0Y2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxuXHRcdFx0XHRcdGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG5cdFx0XHRcdFx0XHRwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuXHRcdFx0XHRcdGNhc2Uga2V5ID09PSAnd2lkdGgnOlxuXHRcdFx0XHRcdGNhc2Uga2V5ID09PSAndG9wJzpcblx0XHRcdFx0XHRjYXNlIGtleSA9PT0gJ2xlZnQnOlxuXHRcdFx0XHRcdFx0YXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0YXJlYS50b3AgPSAwO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRhcmVhLndpZHRoID0gMDtcblx0XHRcdH1cblx0XHRcdGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRhcmVhLmxlZnQgPSAwO1xuXHRcdFx0fVxuXHRcdFx0ZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG5cdFx0XHRlbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXHRcdH0gY2F0Y2ggKGUpIHt9XG5cdH1cblxuXHRmdW5jdGlvbiBwcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG5cdFx0Ly8gZXZlbnQuZnJhZ21lbnQgLy8gdGhlIGRvbSBlbGVtZW50IGZyYWdtZW50XG5cdFx0dHJ5IHtcblx0XHRcdGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuXHRcdFx0XHR2YXIgcHJvcGVydGllcyA9IHBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXHRcdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIga2V5ID0ga2V5c1tpXTtcblx0XHRcdFx0XHRlbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG5cdFx0XHRcdC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG5cdFx0XHRcdHZhciBwcm9wZXJ0aWVzID0gcG9zaXRpb25BcnJheVtpbmRleF07XG5cdFx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZhciBrZXkgPSBrZXlzW2ldO1xuXHRcdFx0XHRcdGVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSAnJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaW5kZXggPiAwKSB7XG5cdFx0XHRcdFx0cHJvcGVydGllcyA9IHBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcblx0XHRcdFx0XHRrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIga2V5ID0ga2V5c1tpXTtcblx0XHRcdFx0XHRcdGVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge31cblx0fVxuXG5cdGZ1bmN0aW9uIGxpc3RlbkZyYWdtZW50cygpIHtcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIF9wcm9ncmVzc0ZyYWdtZW50KTtcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCBfcHJvZ3Jlc3NGcmFnbWVudCk7XG5cdH1cblxuXHRmdW5jdGlvbiB1bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuXHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgX3Byb2dyZXNzRnJhZ21lbnQpO1xuXHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIF9wcm9ncmVzc0ZyYWdtZW50KTtcblx0fVxuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdHRyeSB7XG5cdFx0XHRsZXQgY3VycmVudFByb2dyZXNzID0gUmV2ZWFsLmdldFByb2dyZXNzKCk7XG5cdFx0XHRhcHBseVByb3BlcnRpZXMoY3VycmVudFByb2dyZXNzID4gcHJvZ3Jlc3MgPyBwb3NpdGlvbkFycmF5WzBdIDogcG9zaXRpb25BcnJheVtwb3NpdGlvbkFycmF5Lmxlbmd0aCAtIDFdKTtcblx0XHRcdGxpc3RlbkZyYWdtZW50cygpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0fVxuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHR0cnkge1xuXHRcdFx0cHJvZ3Jlc3MgPSBSZXZlYWwuZ2V0UHJvZ3Jlc3MoKTtcblx0XHRcdHVucmVnaXN0ZXJGcmFnbWVudHMoKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGUpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cblx0Ly8gQ29kZSBDb25uZWN0XG5cdG1hbmFnZW1lbnRHZW5lcmljKCdjb25uZWN0LWJsZScsIFt7XG5cdFx0XHRsaW5lOiAxLFxuXHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGluZTogMixcblx0XHRcdHdpZHRoOiAnNDAwcHgnXG5cdFx0fVxuXHRdKTtcblxuXHQvLyBDb2RlIENvbm5lY3QgYnkgbmFtZVxuXHRtYW5hZ2VtZW50R2VuZXJpYygnY29ubmVjdC1ieS1uYW1lJywgW3tcblx0XHR3aWR0aDogJzQwMHB4Jyxcblx0XHRsaW5lOiAxLFxuXHRcdGxlZnQ6ICc2NzBweCdcblx0fV0pO1xuXG5cdC8vIENvZGUgQ29ubmVjdGlvblxuXHRtYW5hZ2VtZW50R2VuZXJpYygnY29ubmVjdGlvbicsIFt7XG5cdFx0d2lkdGg6ICc0MDBweCcsXG5cdFx0bGluZTogMyxcblx0XHRsZWZ0OiBMRUZUX1RBQlxuXHR9XSk7XG5cblx0Ly8gQ29kZSBSZWFkIENoYXJhY3RlcmlzdGljXG5cdG1hbmFnZW1lbnRHZW5lcmljKCdyZWFkLWNoYXJhY3QnLCBbe1xuXHRcdFx0d2lkdGg6ICc3MDBweCcsXG5cdFx0XHRsaW5lOiAxLFxuXHRcdFx0bGVmdDogTEVGVF9GSVJTVFxuXHRcdH0sIHtcblx0XHRcdGxpbmU6IDQsXG5cdFx0XHR3aWR0aDogJzcwMHB4Jyxcblx0XHRcdGxlZnQ6IExFRlRfVEFCXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsaW5lOiA3LFxuXHRcdFx0bGVmdDogTEVGVF9UQUIsXG5cdFx0XHR3aWR0aDogJzUwMHB4J1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGluZTogMTAsXG5cdFx0XHRuYkxpbmVzOiAyLFxuXHRcdFx0d2lkdGg6ICc4NTBweCcsXG5cdFx0XHRsZWZ0OiBMRUZUX1RBQlxuXHRcdH1cblx0XSk7XG5cblx0Ly8gQ29kZSBXcml0ZSBDaGFyYWN0ZXJpc3RpY1xuXHRtYW5hZ2VtZW50R2VuZXJpYygnd3JpdGUtY2hhcmFjdCcsIFt7XG5cdFx0XHR3aWR0aDogJzY1MHB4Jyxcblx0XHRcdGxpbmU6IDEsXG5cdFx0XHRsZWZ0OiBMRUZUX0ZJUlNUXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsaW5lOiAyLFxuXHRcdFx0d2lkdGg6ICcxMDAwcHgnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsaW5lOiA1LFxuXHRcdFx0d2lkdGg6ICc3MDBweCcsXG5cdFx0XHRsZWZ0OiBMRUZUX1RBQlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGluZTogNixcblx0XHRcdHdpZHRoOiAnODAwcHgnXG5cdFx0fVxuXHRdKTtcblxuXHQvLyBDb2RlIFdyaXRlIENoYXJhY3RlcmlzdGljXG5cdG1hbmFnZW1lbnRHZW5lcmljKCd2aWJyYXRlJywgW3tcblx0XHR3aWR0aDogJzM1MHB4Jyxcblx0XHRsaW5lOiA1LFxuXHRcdGxlZnQ6IExFRlRfRklSU1Rcblx0fV0pO1xuXG5cdC8vIENvZGUgT3JpZW50YXRpb25cblx0bWFuYWdlbWVudEdlbmVyaWMoJ29yaWVudGF0aW9uJywgW3tcblx0XHR3aWR0aDogJzg1MHB4Jyxcblx0XHRsaW5lOiAyLFxuXHRcdGxlZnQ6IExFRlRfRklSU1Rcblx0fSwge1xuXHRcdGxpbmU6IDgsXG5cdFx0d2lkdGg6ICc0MDBweCcsXG5cdFx0bmJMaW5lczogMyxcblx0XHRsZWZ0OiBMRUZUX0ZJUlNUXG5cdH1dKTtcblxuXHQvLyBDb2RlIE1vdGlvblxuXHRtYW5hZ2VtZW50R2VuZXJpYygnbW90aW9uJywgW3tcblx0XHR3aWR0aDogJzk1MHB4Jyxcblx0XHRsaW5lOiAxMSxcblx0XHRsZWZ0OiBMRUZUX1RBQlxuXHR9LCB7XG5cdFx0bGluZTogMyxcblx0XHR3aWR0aDogJzc1MHB4Jyxcblx0XHRuYkxpbmVzOiA0LFxuXHRcdGxlZnQ6IExFRlRfVEFCXG5cdH1dKTtcblxuXG5cdC8vIENvZGUgQmF0dGVyeVxuXHRtYW5hZ2VtZW50R2VuZXJpYygnYmF0dGVyeScsIFt7XG5cdFx0XHR3aWR0aDogJzk1MHB4Jyxcblx0XHRcdGxpbmU6IDEsXG5cdFx0XHRuYkxpbmVzOiAyXG5cdFx0fSwge1xuXHRcdFx0bGluZTogNSxcblx0XHRcdGxlZnQ6ICc2MDBweCcsXG5cdFx0XHR3aWR0aDogJzIwMHB4J1xuXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsaW5lOiAxMCxcblx0XHRcdHdpZHRoOiAnMTAwMHB4Jyxcblx0XHRcdG5iTGluZXM6IDJcblx0XHR9XG5cdF0pO1xuXG5cblx0Lypcblx0Ly8gQ29kZSBVc2VyIE1lZGlhIDFcblx0bWFuYWdlbWVudEdlbmVyaWMoJ3VzZXItbWVkaWEtdjEnLCBbe1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyAxMy44ZW0pJyxcblx0XHRcdCdsZWZ0JzogJzYwcHgnLFxuXHRcdFx0J3dpZHRoJzogJzEwMDBweCcsXG5cdFx0XHQnaGVpZ2h0JzogJzEuNGVtJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyA3Ljc1ZW0pJyxcblx0XHRcdCdsZWZ0JzogJzE4MHB4Jyxcblx0XHRcdCd3aWR0aCc6ICcyMTBweCcsXG5cdFx0XHQnaGVpZ2h0JzogJzEuNGVtJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyA3Ljc1ZW0pJyxcblx0XHRcdCdsZWZ0JzogJzM4MHB4Jyxcblx0XHRcdCd3aWR0aCc6ICc5MHB4Jyxcblx0XHRcdCdoZWlnaHQnOiAnMS40ZW0nXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQndG9wJzogJ2NhbGMoOTBweCArIDEwLjM1ZW0pJyxcblx0XHRcdCdsZWZ0JzogJzEwMHB4Jyxcblx0XHRcdCd3aWR0aCc6ICc4MDBweCcsXG5cdFx0XHQnaGVpZ2h0JzogJzIuNGVtJ1xuXHRcdH1cblx0XSk7XG5cblx0Ly8gQ29kZSBEZXZpY2UgUHJveGltaXR5XG5cdG1hbmFnZW1lbnRHZW5lcmljKCdkZXZpY2UtcHJveGltaXR5JywgW3tcblx0XHQndG9wJzogJ2NhbGMoOTBweCArIDEuMTVlbSknLFxuXHRcdCdsZWZ0JzogJzI1MHB4Jyxcblx0XHQnd2lkdGgnOiAnMTcwcHgnXG5cdH1dKTtcblxuXHQvLyBDb2RlIFVzZXIgUHJveGltaXR5XG5cdG1hbmFnZW1lbnRHZW5lcmljKCd1c2VyLXByb3hpbWl0eScsIFt7XG5cdFx0J3RvcCc6ICdjYWxjKDkwcHggKyAxLjE1ZW0pJyxcblx0XHQnbGVmdCc6ICcxNTBweCcsXG5cdFx0J3dpZHRoJzogJzE1MHB4J1xuXHR9XSk7XG5cblx0Ly8gQ29kZSBXZWIgU3BlZWNoXG5cdG1hbmFnZW1lbnRHZW5lcmljKCd3ZWItc3BlZWNoJywgW3tcblx0XHRcdCd0b3AnOiAnY2FsYyg5MHB4ICsgMS4xNWVtKScsXG5cdFx0XHQnd2lkdGgnOiAnNDAwcHgnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQndG9wJzogJ2NhbGMoOTBweCArIDIuMzBlbSknLFxuXHRcdFx0J3dpZHRoJzogJzUwMHB4J1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyAzLjQ1ZW0pJyxcblx0XHRcdCd3aWR0aCc6ICc1NTBweCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdCd0b3AnOiAnY2FsYyg5MHB4ICsgNS43NWVtKScsXG5cdFx0XHQnd2lkdGgnOiAnMzAwcHgnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQndG9wJzogJ2NhbGMoOTBweCArIDYuOTBlbSknLFxuXHRcdFx0J3dpZHRoJzogJzMwMHB4J1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyA4LjA1ZW0pJyxcblx0XHRcdCdsZWZ0JzogJzI4MHB4Jyxcblx0XHRcdCd3aWR0aCc6ICc0NTBweCdcblx0XHR9XG5cdF0pO1xuXG5cdC8vIENvZGUgV2ViIFNwZWVjaCBHcmFtbWFyXG5cdG1hbmFnZW1lbnRHZW5lcmljKCd3ZWItc3BlZWNoLWdyYW1tYXInLCBbe1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyAyLjMwZW0pJyxcblx0XHRcdCd3aWR0aCc6ICc3NTBweCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdCd0b3AnOiAnY2FsYyg5MHB4ICsgMy40NWVtKScsXG5cdFx0XHQnd2lkdGgnOiAnNzAwcHgnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQndG9wJzogJ2NhbGMoOTBweCArIDQuNjBlbSknLFxuXHRcdFx0J3dpZHRoJzogJzY1MHB4J1xuXHRcdH1cblx0XSk7XG5cblx0Ly8gQ29kZSBXZWIgU3BlZWNoIFN5bnRoZXNpc1xuXHRtYW5hZ2VtZW50R2VuZXJpYygnd2ViLXNwZWVjaC1zeW50aGVzaXMnLCBbe1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyAyLjMwZW0pJyxcblx0XHRcdCd3aWR0aCc6ICc4NTBweCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdCd0b3AnOiAnY2FsYyg5MHB4ICsgMy40NWVtKScsXG5cdFx0XHQnd2lkdGgnOiAnNDAwcHgnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQndG9wJzogJ2NhbGMoOTBweCArIDQuNjBlbSknLFxuXHRcdFx0J3dpZHRoJzogJzQ1MHB4J1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyA1Ljc1ZW0pJyxcblx0XHRcdCd3aWR0aCc6ICc0MDBweCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdCd0b3AnOiAnY2FsYyg5MHB4ICsgNi45MGVtKScsXG5cdFx0XHQnd2lkdGgnOiAnMzUwcHgnXG5cdFx0fVxuXHRdKTtcblxuXHQvLyBDb2RlIE5vdGlmaWNhdGlvbnNcblx0bWFuYWdlbWVudEdlbmVyaWMoJ25vdGlmaWNhdGlvbicsIFt7XG5cdFx0XHQndG9wJzogJ2NhbGMoOTBweCArIDIuMzBlbSknLFxuXHRcdFx0J3dpZHRoJzogJzM1MHB4Jyxcblx0XHRcdCdsZWZ0JzogJzEyMHB4J1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J3RvcCc6ICdjYWxjKDkwcHggKyAzLjQ1ZW0pJyxcblx0XHRcdCd3aWR0aCc6ICc4MDBweCcsXG5cdFx0XHQnbGVmdCc6ICcxNDBweCdcblx0XHR9LFxuXHRcdHtcblx0XHRcdCd0b3AnOiAnY2FsYyg5MHB4ICsgNC42MGVtKScsXG5cdFx0XHQnd2lkdGgnOiAnODAwcHgnLFxuXHRcdFx0J2hlaWdodCc6ICc1LjVlbScsXG5cdFx0XHQnbGVmdCc6ICcxNzBweCdcblx0XHR9XG5cdF0pO1xuXHQqL1xuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy9jb25maWcnKTtcblxuZnVuY3Rpb24gcG9zdFByb2RDb2RlSGlsaWdodCgpe1xuXHR2YXIgYXJyYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdjb2RlLnRvSGlsaWdodCcpO1xuXHRmb3IgKHZhciBpID0wOyBpIDxhcnJheS5sZW5ndGg7IGkrKyl7XG5cdFx0dmFyIGxlbmd0aCA9IDA7XG5cdFx0dmFyIHRleHRDb2RlID0gYXJyYXlbaV0uaW5uZXJIVE1MO1xuXHRcdGRve1xuXHRcdFx0bGVuZ3RoID0gdGV4dENvZGUubGVuZ3RoO1xuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7bWFyayZndDsnLCAnPG1hcms+Jyk7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrIGNsYXNzPVwiZGlsbHVhdGVcIiZndDsnLCAnPG1hcmsgY2xhc3M9XCJkaWxsdWF0ZVwiPicpO1xuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7L21hcmsmZ3Q7JywgJzwvbWFyaz4nKTtcblx0XHR9d2hpbGUobGVuZ3RoICE9IHRleHRDb2RlLmxlbmd0aCk7XG5cdFx0YXJyYXlbaV0uaW5uZXJIVE1MID0gdGV4dENvZGU7XG5cblx0fVxufVxuXG5SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3JlYWR5JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIC8vIGV2ZW50LmN1cnJlbnRTbGlkZSwgZXZlbnQuaW5kZXhoLCBldmVudC5pbmRleHZcblx0Y29uc29sZS5sb2coJ1JldmVhbEpTIFJlYWR5Jyk7XG4gICAgXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgXHRwb3N0UHJvZENvZGVIaWxpZ2h0KCk7XG5cdH0sIDUwMCk7XG5cdFxuXHRsZXQgaW5JRnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xuXHRcbiAgICBcblx0aWYgKCFpbklGcmFtZSAmJiB0eXBlb2Yod2luZG93LmlvKSAhPSAndW5kZWZpbmVkJyAmJiBjb25maWcuYWRkcmVzcyl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR28gdG8gY29uZGl0aW9uICFcIik7XG5cdFx0bGV0IHNvY2tldEdhbWUgPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHRyZXF1aXJlKCcuL2dhbWUvcHJlel9nYW1lJykuaW5pdChzb2NrZXRHYW1lKTtcblx0XHRsZXQgc29ja2V0UHJleiA9IG51bGw7XG5cdFx0bGV0IHNvY2tldFByZXpMb2NhbCA9IG51bGw7XG5cdFx0aWYgKGNvbmZpZy5sb2NhbCl7XG5cdFx0XHRzb2NrZXRQcmV6ID0gc29ja2V0R2FtZTsgICBcblx0XHR9ZWxzZXtcblx0XHRcdHNvY2tldFByZXogPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHRcdHNvY2tldFByZXpMb2NhbCA9IGlvLmNvbm5lY3QoY29uZmlnLmFkZHJlc3NMb2NhbCk7XG5cdFx0fVxuIFxuIFx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgbGlnaHRcIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgT3JpZW50YXRpb25cIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvb3JpZW50YXRpb24nKS5pbml0KHNvY2tldFByZXosIHNvY2tldFByZXpMb2NhbCk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCZWZvcmUgRGV2aWNlTW90aW9uXCIpO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL2RldmljZW1vdGlvbicpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBWb2ljZVwiKTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLmluaXQoc29ja2V0UHJleiwgc29ja2V0UHJlekxvY2FsKTtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBVc2VyTWVkaWFcIik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvdXNlcm1lZGlhJykuaW5pdChzb2NrZXRQcmV6LCBzb2NrZXRQcmV6TG9jYWwpO1xuIFx0XHRcdFxuIFx0XHQvL30sIDEwMDApO1xuXHR9XHRcblxuXHRyZXF1aXJlKCcuL2hpZ2hsaWdodHMvaGlnaGxpZ2h0c0NvZGUnKS5pbml0KCk7XG4gXG5cdFxufSApO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBtb3Rpb25FbmFibGUgPSBmYWxzZSxcbiAgICBtb3Rpb25FbHQgPSBudWxsLFxuICAgIGJhdHRlcnkxRWx0ID0gbnVsbCxcbiAgICBiYXR0ZXJ5MkVsdCA9IG51bGwsXG4gICAgY2hhcmdlQmF0dGVyeTEgPSAwLFxuICAgIGNoYXJnZUJhdHRlcnkyID0gMCxcbiAgICB3aW5uZXIgPSBudWxsLFxuICAgIGZ1bGxWYWx1ZTEgPSAxMDAwMCxcbiAgICBmdWxsVmFsdWUyID0gMTAwMDAsXG4gICAgbWFwVXNlcnNBY3RpdiA9IHt9O1xuXG5cblxuXG5mdW5jdGlvbiBiYXRVcGRhdGUodGVhbSwgY2hhcmdlKSB7XG4gICAgbGV0IGNvbCA9IFtdLFxuICAgICAgICBlbHQgPSBudWxsO1xuICAgIGlmICh0ZWFtID09PSBcIjFcIikge1xuICAgICAgICBlbHQgPSBiYXR0ZXJ5MUVsdDtcbiAgICAgICAgLy8gUmVkIC0gRGFuZ2VyIVxuICAgICAgICBjb2wgPSBbXCIjNzUwOTAwXCIsIFwiI2M2NDYyYlwiLCBcIiNiNzQ0MjRcIiwgXCIjZGYwYTAwXCIsIFwiIzU5MDcwMFwiXTtcbiAgICB9IC8qZWxzZSBpZiAoY2hhcmdlIDwgNDApIHtcbiAgICAvLyBZZWxsb3cgLSBNaWdodCB3YW5uYSBjaGFyZ2Ugc29vbi4uLlxuICAgIGNvbCA9IFtcIiM3NTRmMDBcIiwgXCIjZjJiYjAwXCIsIFwiI2RiYjMwMFwiLCBcIiNkZjhmMDBcIiwgXCIjNTkzYzAwXCJdO1xuICB9ICovZWxzZSB7XG4gICAgICAgIGVsdCA9IGJhdHRlcnkyRWx0O1xuICAgICAgICAvLyBHcmVlbiAtIEFsbCBnb29kIVxuICAgICAgICBjb2wgPSBbXCIjMzE2ZDA4XCIsIFwiIzYwYjkzOVwiLCBcIiM1MWFhMzFcIiwgXCIjNjRjZTExXCIsIFwiIzI1NTQwNVwiXTtcbiAgICB9XG4gICAgZWx0LnN0eWxlW1wiYmFja2dyb3VuZC1pbWFnZVwiXSA9IFwibGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCB0cmFuc3BhcmVudCA1JSwgXCIgKyBjb2xbMF0gKyBcIiA1JSwgXCIgKyBjb2xbMF0gKyBcIiA3JSwgXCIgKyBjb2xbMV0gKyBcIiA4JSwgXCIgKyBjb2xbMV0gKyBcIiAxMCUsIFwiICsgY29sWzJdICsgXCIgMTElLCBcIiArIGNvbFsyXSArIFwiIFwiICsgKGNoYXJnZSAtIDMpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgKGNoYXJnZSAtIDIpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBcIiArIGNvbFs0XSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBibGFjayBcIiArIChjaGFyZ2UgKyA1KSArIFwiJSwgYmxhY2sgOTUlLCB0cmFuc3BhcmVudCA5NSUpLCBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSkgMCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDclLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuOCkgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDAlLCByZ2JhKDI1NSwyNTUsMjU1LDApIDQxJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA4NiUsIHJnYmEoMjU1LDI1NSwyNTUsMC42KSA5MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5MiUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5NSUsIHJnYmEoMjU1LDI1NSwyNTUsMC41KSA5OCUpXCI7XG59XG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKSB7XG5cbiAgICBmdW5jdGlvbiBjYWxsQmFja1NlbnNvcihtc2cpIHtcbiAgICAgICAgaWYgKG1vdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ2RldmljZW1vdGlvbicpIHtcbiAgICAgICAgICAgIGlmICghd2lubmVyICYmIG1zZy50ZWFtKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRtcFVzZXJUZWFtID0gbWFwVXNlcnNBY3Rpdlttc2cuaWRdO1xuICAgICAgICAgICAgICAgIGlmICghdG1wVXNlclRlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwVXNlcnNBY3Rpdlttc2cuaWRdID0gbXNnLnRlYW07XG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxWYWx1ZTEgKz0gMTAwMDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobXNnLnRlYW0gPT09IFwiMlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsVmFsdWUyICs9IDEwMDAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBwZXJjZW50ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAobXNnLnRlYW0gPT09IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJnZUJhdHRlcnkxICs9IG1zZy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkxIC8gZnVsbFZhbHVlMSkgKiAxMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJnZUJhdHRlcnkyICs9IG1zZy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkyIC8gZnVsbFZhbHVlMikgKiAxMDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJhdFVwZGF0ZShtc2cudGVhbSwgTWF0aC5taW4ocGVyY2VudCwgOTApKTtcbiAgICAgICAgICAgICAgICBpZiAoIXdpbm5lciAmJiBNYXRoLm1pbihwZXJjZW50LCA5MCkgPT09IDkwKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbm5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cudGVhbSA9PT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXZpY2Vtb3Rpb24gLndpbi5maXJlZm94JykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV2aWNlbW90aW9uIC53aW4uY2hyb21lJykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvY2tldC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIGlmIChzb2NrZXRMb2NhbCkge1xuICAgICAgICBzb2NrZXRMb2NhbC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIH1cbiAgICBiYXR0ZXJ5MUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTEnKTtcbiAgICBiYXR0ZXJ5MkVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTInKTtcblxuICAgIGJhdFVwZGF0ZShcIjFcIiwgMCk7XG4gICAgYmF0VXBkYXRlKFwiMlwiLCAwKTtcblxuICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcbiAgICAgICAgICAgIHR5cGU6IFwiZ2FtZVwiLFxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcbiAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIG1vdGlvbkVuYWJsZSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcbiAgICAgICAgICAgIHR5cGU6IFwiZ2FtZVwiLFxuICAgICAgICAgICAgZXZlbnRUeXBlOiBcImJhdHRlcnlcIixcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBtb3Rpb25FbmFibGUgPSBmYWxzZTtcbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBsaWdodEVuYWJsZSA9IGZhbHNlLFxuXHRsaWdodEVsdCA9IG51bGw7XG5cblxuLy8gV2UgdXBkYXRlIHRoZSBjc3MgU3R5bGVcbmZ1bmN0aW9uIHVwZGF0ZUxpZ2h0KGRhdGEpe1xuXHRsZXQgcHJlZml4TGlnaHQgPSAnLXdlYmtpdC0nO1xuXHRsZXQgcGVyY2VudCA9IGRhdGE7XG5cdHZhciBzdHlsZSA9IHByZWZpeExpZ2h0KydyYWRpYWwtZ3JhZGllbnQoY2VudGVyLCAnXG5cdCAgICArJyBlbGxpcHNlIGNvdmVyLCAnXG5cdCAgICArJyByZ2JhKDE5OCwxOTcsMTQ1LDEpIDAlLCdcblx0ICAgICsnIHJnYmEoMCwwLDAsMSkgJytwZXJjZW50KyclKSdcblx0ICAgIDtcblx0bGlnaHRFbHQuc3R5bGUuYmFja2dyb3VuZCA9IHN0eWxlO1xufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpe1xuXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKXtcblx0XHRpZiAobGlnaHRFbmFibGUgJiYgbXNnLnR5cGUgPT09ICdsaWdodCcpe1xuXHRcdFx0dXBkYXRlTGlnaHQobXNnLnZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICBpZiAoc29ja2V0TG9jYWwpe1xuXHQgICAgc29ja2V0TG9jYWwub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICB9XG5cdGxpZ2h0RWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZ2h0LWJnJyk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1saWdodCcsIGZ1bmN0aW9uKCl7XG5cdFx0bGlnaHRFbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3AtbGlnaHQnLCBmdW5jdGlvbigpe1xuXHRcdGxpZ2h0RW5hYmxlID0gZmFsc2U7XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgb3JpZW50YXRpb25FbmFibGUgPSBmYWxzZSwgXG5cdGxvY2tFbHQgPSBudWxsLFxuXHRyZXNFbHQgPSBudWxsLFxuXHRvcGVuID0gZmFsc2U7XG5cbmNvbnN0IHZhbHVlcyA9IHsgZmlyc3QgOiB7dmFsdWU6IDUwLCBmb3VuZDogZmFsc2V9LCBcblx0XHRcdFx0c2Vjb25kIDoge3ZhbHVlOiA4MCwgZm91bmQ6IGZhbHNlfSwgXG5cdFx0XHRcdHRoaXJkIDoge3ZhbHVlIDogMTAsIGZvdW5kIDogZmFsc2V9XG5cdFx0XHR9O1xuXG5cbi8vIEFjY29yZGluZyB0byB0aGUgbnVtYmVyIG9mIHVubG9jaywgd2UganVzdCB0dXJuIHRoZSBpbWFnZSBvciB3ZSBvcGVuIHRoZSBkb29yXG5mdW5jdGlvbiB1cGRhdGVSb3RhdGlvbih6QWxwaGEsIGZpcnN0VmFsdWUpe1xuXHRpZiAoIW9wZW4pe1xuXHRcdGxldCBkZWx0YSA9IGZpcnN0VmFsdWUgLSB6QWxwaGE7XG5cdFx0bGV0IHJvdGF0aW9uID0gZGVsdGE7XG5cdFx0aWYgKGRlbHRhIDwgMCl7XG5cdFx0XHRyb3RhdGlvbiA9IGZpcnN0VmFsdWUrMzYwLXpBbHBoYTtcblx0XHR9XHRcdFxuXHRcdGxvY2tFbHQuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooJytyb3RhdGlvbisnZGVnKSc7XG5cblx0XHRsZXQgY3VycmVudFZhbHVlID0gMTAwIC0gTWF0aC5yb3VuZCgocm90YXRpb24qMTAwKS8zNjApO1xuXHRcdHJlc0VsdC5pbm5lckhUTUwgPSBjdXJyZW50VmFsdWU7XG5cdFx0aWYgKHZhbHVlcy5maXJzdC5mb3VuZCBcblx0XHRcdCYmIHZhbHVlcy5zZWNvbmQuZm91bmRcblx0XHRcdCYmIHZhbHVlcy50aGlyZC5mb3VuZCl7XHRcdFx0XG5cdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbicpLmNsYXNzTGlzdC5hZGQoXCJvcGVuXCIpO1xuXHRcdH1lbHNlIGlmICghdmFsdWVzLmZpcnN0LmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMuZmlyc3QudmFsdWUpe1x0XHRcdFx0XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAuZmlyc3QnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy5maXJzdC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMuc2Vjb25kLmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMuc2Vjb25kLnZhbHVlKXtcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5zZWNvbmQnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy5zZWNvbmQuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1lbHNlIGlmICghdmFsdWVzLnRoaXJkLmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMudGhpcmQudmFsdWUpe1xuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLnRoaXJkJyk7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LnJlbW92ZShcImZhLXRpbWVzLWNpcmNsZVwiKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuXHRcdFx0XHR2YWx1ZXMudGhpcmQuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQsIHNvY2tldExvY2FsKXtcblxuICAgIGZ1bmN0aW9uIGNhbGxCYWNrU2Vuc29yKG1zZyl7XG5cdFx0aWYgKG9yaWVudGF0aW9uRW5hYmxlICYmIG1zZy50eXBlID09PSAnb3JpZW50YXRpb24nKXtcblx0XHRcdHVwZGF0ZVJvdGF0aW9uKG1zZy52YWx1ZSwgbXNnLmZpcnN0VmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdHNvY2tldC5vbignc2Vuc29yJywgY2FsbEJhY2tTZW5zb3IpO1xuICAgIGlmKHNvY2tldExvY2FsKXtcblx0ICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgfVxuXG5cdGxvY2tFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2FmZV9sb2NrJyk7XG5cdHJlc0VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmllbnRhdGlvbiAucmVzcCAudmFsdWUnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcblx0XHRvcmllbnRhdGlvbkVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1vcmllbnRhdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0b3JpZW50YXRpb25FbmFibGUgPSBmYWxzZTtcblx0fSk7XHRcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufTsiLCIndXNlIHN0cmljdCdcblxubGV0IHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlLFxuICAgIHVzZXJtZWRpYUVsdCA9IG51bGw7XG5cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCwgc29ja2V0TG9jYWwpIHtcblxuICAgIGZ1bmN0aW9uIGNhbGxCYWNrU2Vuc29yKG1zZykge1xuICAgICAgICBpZiAodXNlcm1lZGlhRW5hYmxlICYmIG1zZy50eXBlID09PSAndXNlcm1lZGlhJykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob3RvU3RyZWFtJykuc2V0QXR0cmlidXRlKCdzcmMnLCBtc2cudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG5cbiAgICBpZiAoc29ja2V0TG9jYWwpIHtcbiAgICAgICAgc29ja2V0TG9jYWwub24oJ3NlbnNvcicsIGNhbGxCYWNrU2Vuc29yKTtcbiAgICB9XG4gICAgdXNlcm1lZGlhRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJtZWRpYS1iZycpO1xuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LXVzZXJtZWRpYScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB1c2VybWVkaWFFbmFibGUgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3AtdXNlcm1lZGlhJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlO1xuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IHZvaWNlRW5hYmxlID0gZmFsc2UsXG4gICAgdm9pY2VGUiA9IG51bGwsXG4gICAgc3ludGggPSBudWxsLFxuICAgIHJlY29nbml0aW9uID0gbnVsbCxcbiAgICByZWNvZ25pdGlvbkRvbmUgPSBmYWxzZSxcbiAgICBuZXh0U2xpZGUgPSBmYWxzZSxcbiAgICBlbHRNaWMgPSBudWxsLFxuICAgIGlucHV0TWljID0gbnVsbFxuICAgIDtcblxuZnVuY3Rpb24gcG9wdWxhdGVWb2ljZUxpc3QoKSB7XG4gICAgbGV0IHZvaWNlcyA9IHN5bnRoLmdldFZvaWNlcygpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm9pY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh2b2ljZXNbaV0ubGFuZyA9PT0gJ2ZyLUZSJykge1xuICAgICAgICAgICAgdm9pY2VGUiA9IHZvaWNlc1tpXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiJXMsICVPIFwiLCB2b2ljZXNbaV0ubGFuZywgdm9pY2VzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlVm9pY2VSZXN1bHRzKGV2ZW50KSB7XG4gICAgLy8gVGhlIFNwZWVjaFJlY29nbml0aW9uRXZlbnQgcmVzdWx0cyBwcm9wZXJ0eSByZXR1cm5zIGEgU3BlZWNoUmVjb2duaXRpb25SZXN1bHRMaXN0IG9iamVjdFxuICAgIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdHMuXG4gICAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XG4gICAgLy8gVGhlIGZpcnN0IFswXSByZXR1cm5zIHRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBhdCBwb3NpdGlvbiAwLlxuICAgIC8vIEVhY2ggU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0cyB0aGF0IGNvbnRhaW4gaW5kaXZpZHVhbCByZXN1bHRzLlxuICAgIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxuICAgIC8vIFRoZSBzZWNvbmQgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgYXQgcG9zaXRpb24gMC5cbiAgICAvLyBXZSB0aGVuIHJldHVybiB0aGUgdHJhbnNjcmlwdCBwcm9wZXJ0eSBvZiB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3QgXG4gICAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xuICAgIGlucHV0TWljLmlubmVySFRNTCA9IGZpbmFsU3RyO1xuICAgIC8vZGlhZ25vc3RpYy50ZXh0Q29udGVudCA9ICdSZXN1bHQgcmVjZWl2ZWQ6ICcgKyBjb2xvciArICcuJztcbiAgICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICAgIGNvbnNvbGUubG9nKCdDb25maWRlbmNlOiAnICsgZmluYWxTdHIpO1xuICAgIGlmIChmaW5hbFN0ci5pbmRleE9mKCdzdWl2YW50JykgIT0gLTEpIHtcbiAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgICAgICBpZiAoIXJlY29nbml0aW9uRG9uZSkge1xuICAgICAgICAgICAgcmVjb2duaXRpb25Eb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHNwZWFrKFwiQm9uam91ciBKRiwgaidhaSBjb21wcmlzIHF1ZSB0dSB2b3VsYWlzIHBhc3NlciBhdSBzbGlkZSBzdWl2YW50LCBhaXMgamUgYmllbiBjb21wcmlzID9cIilcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmluIGRlIHNwZWVjaFwiKVxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyB2b2ljZUZSXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmaW5hbFN0ci5pbmRleE9mKCdvdWknKSAhPSAtMSkge1xuICAgICAgICBpZiAoIW5leHRTbGlkZSkge1xuICAgICAgICAgICAgbmV4dFNsaWRlID0gdHJ1ZTtcbiAgICAgICAgICAgIFJldmVhbC5uZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVZvaWNlRW5kKCkge1xuICAgIC8vIFdlIGRldGVjdCB0aGUgZW5kIG9mIHNwZWVjaFJlY29nbml0aW9uIHByb2Nlc3NcbiAgICBjb25zb2xlLmxvZygnRW5kIG9mIHJlY29nbml0aW9uJylcbiAgICByZWNvZ25pdGlvbi5zdG9wKCk7XG4gICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG59O1xuXG4vLyBXZSBkZXRlY3QgZXJyb3JzXG5mdW5jdGlvbiBoYW5kbGVWb2ljZUVycm9yKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmVycm9yID09ICduby1zcGVlY2gnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBTcGVlY2gnKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmVycm9yID09ICdhdWRpby1jYXB0dXJlJykge1xuICAgICAgICBjb25zb2xlLmxvZygnTm8gbWljcm9waG9uZScpXG4gICAgfVxuICAgIGlmIChldmVudC5lcnJvciA9PSAnbm90LWFsbG93ZWQnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdOb3QgQWxsb3dlZCcpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHNwZWFrKHZhbHVlLCBjYWxsYmFja0VuZCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICBpZiAoIXZvaWNlRlIpIHtcbiAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1dHRlclRoaXMgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHZhbHVlKTtcbiAgICAgICAgdXR0ZXJUaGlzLnZvaWNlID0gdm9pY2VGUjtcbiAgICAgICAgdXR0ZXJUaGlzLnBpdGNoID0gMTtcbiAgICAgICAgdXR0ZXJUaGlzLnJhdGUgPSAxO1xuICAgICAgICB1dHRlclRoaXMub25lbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBzeW50aC5zcGVhayh1dHRlclRoaXMpO1xuICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0LCBzb2NrZXRMb2NhbCkge1xuXG4gICAgLy8gSW5pdGlhbGlzYXRpb24gZGUgbGEgcGFydGllIHJlY29ubmFpc3NhbmNlIHZvY2FsZVxuICAgIHZhciBTcGVlY2hSZWNvZ25pdGlvbiA9IFNwZWVjaFJlY29nbml0aW9uIHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uXG4gICAgdmFyIFNwZWVjaEdyYW1tYXJMaXN0ID0gU3BlZWNoR3JhbW1hckxpc3QgfHwgd2Via2l0U3BlZWNoR3JhbW1hckxpc3RcbiAgICB2YXIgU3BlZWNoUmVjb2duaXRpb25FdmVudCA9IFNwZWVjaFJlY29nbml0aW9uRXZlbnQgfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25FdmVudFxuICAgIHJlY29nbml0aW9uID0gbmV3IFNwZWVjaFJlY29nbml0aW9uKCk7XG4gICAgdmFyIGdyYW1tYXIgPSAnI0pTR0YgVjEuMDsgZ3JhbW1hciBiaW5vbWVkOyBwdWJsaWMgPGJpbm9tZWQ+ID0gc3VpdmFudCB8IHByw6ljw6lkZW50IHwgcHJlY2VkZW50IHwgc2xpZGUgfCBkaWFwb3NpdGl2ZSB8IHN1aXZhbnRlIHwgb3VpIDsnO1xuICAgIHZhciBzcGVlY2hSZWNvZ25pdGlvbkxpc3QgPSBuZXcgU3BlZWNoR3JhbW1hckxpc3QoKTtcbiAgICBzcGVlY2hSZWNvZ25pdGlvbkxpc3QuYWRkRnJvbVN0cmluZyhncmFtbWFyLCAxKTtcbiAgICByZWNvZ25pdGlvbi5ncmFtbWFycyA9IHNwZWVjaFJlY29nbml0aW9uTGlzdDtcbiAgICByZWNvZ25pdGlvbi5jb250aW51b3VzID0gdHJ1ZTtcbiAgICByZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcbiAgICByZWNvZ25pdGlvbi5pbnRlcmltUmVzdWx0cyA9IHRydWU7XG4gICAgcmVjb2duaXRpb24ub25yZXN1bHQgPSBoYW5kbGVWb2ljZVJlc3VsdHM7XG4gICAgcmVjb2duaXRpb24ub25lbmQgPSBoYW5kbGVWb2ljZUVuZDtcbiAgICByZWNvZ25pdGlvbi5vbmVycm9yID0gaGFuZGxlVm9pY2VFcnJvcjtcblxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGxhIHBhcnRpZSBzeW50aMOoc2Ugdm9jYWxlXG4gICAgc3ludGggPSB3aW5kb3cuc3BlZWNoU3ludGhlc2lzO1xuICAgIHBvcHVsYXRlVm9pY2VMaXN0KCk7XG4gICAgaWYgKHNwZWVjaFN5bnRoZXNpcy5vbnZvaWNlc2NoYW5nZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzcGVlY2hTeW50aGVzaXMub252b2ljZXNjaGFuZ2VkID0gcG9wdWxhdGVWb2ljZUxpc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsbEJhY2tTZW5zb3IobXNnKSB7XG4gICAgICAgIGlmICh2b2ljZUVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ3ZvaWNlJykge1xuICAgICAgICAgICAgaWYgKG1zZy52YWx1ZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgICAgIGlmICghZWx0TWljKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsdE1pYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vU3BlZWNoJyk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0TWljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwZWVjaF9pbnB1dCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHRNaWMuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgICAgIHJlY29nbml0aW9uLnN0YXJ0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1zZy52YWx1ZSA9PT0gJ3N0b3AnKSB7XG4gICAgICAgICAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgICAgICAgICAgICAgIGVsdE1pYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGlzYXRpb24gZGUgbGEgcGFydGllIGNvbW11bnVpY2F0aW9uXG4gICAgc29ja2V0Lm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgaWYgKHNvY2tldExvY2FsKSB7XG4gICAgICAgIHNvY2tldExvY2FsLm9uKCdzZW5zb3InLCBjYWxsQmFja1NlbnNvcik7XG4gICAgfVxuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LXdlYnNwZWVjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICB2b2ljZUVuYWJsZSA9IHRydWU7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3Atd2Vic3BlZWNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRyeXsgICAgICAgICAgICBcbiAgICAgICAgICAgIHZvaWNlRW5hYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAocmVjb2duaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICAgICAgZWx0TWljLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBpbml0XG59Il19
