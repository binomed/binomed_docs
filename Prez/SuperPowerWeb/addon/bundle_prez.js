(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3000")){
		return "http://localhost:8000"
	}else if (location.port && location.port === "8000"){
		return "https://binomed.fr:8000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();
var local = location.port && location.port === "3000";

module.exports = {
	address : address,
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
	Reveal.addEventListener('quit-question', hideQuestion);

}

module.exports = {
	init : init
}
},{"../config/config":1,"./audio":2}],4:[function(require,module,exports){
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
	
	setTimeout(function() {
    	postProdCodeHilight();
	}, 500);
	
	let inIFrame = window.top != window.self;
	
	if (!inIFrame && io && config.address){
		let socketGame = io.connect(config.address);
		require('./game/prez_game').init(socketGame);
		let socketPrez = null;
		if (config.local){
			socketPrez = socketGame;   
		}else{
			socketPrez = io.connect(config.address);
		}
 
 		setTimeout(function() {
			require('./sensors/light').init(socketPrez);
			require('./sensors/orientation').init(socketPrez);
			require('./sensors/devicemotion').init(socketPrez);
			require('./sensors/voice').init(socketPrez);
			require('./sensors/usermedia').init(socketPrez);
 			
 		}, 1000);
	}	
 
	
} );

},{"./config/config":1,"./game/prez_game":3,"./sensors/devicemotion":5,"./sensors/light":6,"./sensors/orientation":7,"./sensors/usermedia":8,"./sensors/voice":9}],5:[function(require,module,exports){
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


function init(socket){

	socket.on('sensor', function(msg){
		if (motionEnable && msg.type === 'devicemotion'){
			if (!winner && msg.team){
				let tmpUserTeam = mapUsersActiv[msg.id];
				if (!tmpUserTeam){
					mapUsersActiv[msg.id] = msg.team;
					if (msg.team === "1"){
						fullValue1+= 10000;
					}else if (msg.team === "2"){
						fullValue2+= 10000;
					}
				}				
				let percent = 0;
				if (msg.team === "1"){
					chargeBattery1+= msg.value;
					percent = Math.round((chargeBattery1 / fullValue1) *100);
				}else{
					chargeBattery2+= msg.value;
					percent = Math.round((chargeBattery2 / fullValue2) *100);
				}

				batUpdate(msg.team, Math.min(percent,90));
				if (!winner && Math.min(percent,90) === 90){
					winner = true;
					if (msg.team === "1"){
						document.querySelector('.devicemotion .win.firefox').classList.add("show");
					}else{
						document.querySelector('.devicemotion .win.chrome').classList.add("show");
					}
				}
			}
			
		}
	});
	battery1Elt = document.querySelector('#battery-1');
	battery2Elt = document.querySelector('#battery-2');

	batUpdate("1",0);
	batUpdate("2",0);

	Reveal.addEventListener( 'start-devicemotion', function(){
		socket.emit('config', {
			type:"game",
			eventType:"battery", 
			show:true
		});
		motionEnable = true;
	});

	Reveal.addEventListener( 'stop-devicemotion', function(){
		socket.emit('config', {
			type:"game",
			eventType:"battery", 
			show:false
		});
		motionEnable = false;
	});

}

module.exports = {
	init : init
}
},{}],6:[function(require,module,exports){
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

function init(socket){

	socket.on('sensor', function(msg){
		if (lightEnable && msg.type === 'light'){
			updateLight(msg.value);
		}
	});
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
},{}],7:[function(require,module,exports){
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

function init(socket){

	socket.on('sensor', function(msg){
		if (orientationEnable && msg.type === 'orientation'){
			updateRotation(msg.value, msg.firstValue);
		}
	});

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
},{}],8:[function(require,module,exports){
'use strict'

let usermediaEnable = false,
	usermediaElt = null;



function init(socket){

	socket.on('sensor', function(msg){
		if (usermediaEnable && msg.type === 'usermedia'){
			document.getElementById('photoStream').setAttribute('src', msg.value);
		}
	});
	usermediaElt = document.querySelector('.usermedia-bg');

	Reveal.addEventListener( 'start-usermedia', function(){
		usermediaEnable = true;
	});

	Reveal.addEventListener( 'stop-usermedia', function(){
		usermediaEnable = false;
	});

}

module.exports = {
	init : init
}
},{}],9:[function(require,module,exports){
'use strict'

let voiceEnable = false;



function init(socket){

	socket.on('sensor', function(msg){
		if (voiceEnable && msg.type === 'voice'){
			if (msg.value === 'next'){
				Reveal.next();
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
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3ByZXpfc3VwZXJfcG93ZXIuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy9kZXZpY2Vtb3Rpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy9saWdodC5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL29yaWVudGF0aW9uLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvdXNlcm1lZGlhLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvdm9pY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRyZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxuXHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjgwMDBcIil7XG5cdFx0cmV0dXJuIFwiaHR0cHM6Ly9iaW5vbWVkLmZyOjgwMDBcIjtcblx0fWVsc2V7XG5cdFx0cmV0dXJuIG51bGw7XHRcblx0fSBcbn1cblxudmFyIGFkZHJlc3MgPSBjYWxjdWxhdGVBZGRyZXNzKCk7XG52YXIgbG9jYWwgPSBsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkcmVzcyA6IGFkZHJlc3MsXG5cdGxvY2FsIDogbG9jYWxcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbnRleHQgPSBudWxsLFxuXHRQVUJMSUMgPSAxLFxuXHRXQUlUID0gMixcblx0UkVTUCA9IDMsXG5cdHB1YmxpY0J1ZmZlciA9IG51bGwsXG5cdHdhaXRCdWZmZXIgPSBudWxsLFxuXHRyZXNwQnVmZmVyID0gbnVsbCxcblx0Y3VycmVudFNvdXJjZSA9IG51bGw7XG5cbnRyeXtcblx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblx0Y29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbn1jYXRjaChlKXtcblx0Y29udGV4dCA9IG51bGw7XG5cdGNvbnNvbGUubG9nKFwiTm8gV2ViQVBJIGRlY3RlY3RcIik7XG59XG5cbmZ1bmN0aW9uIGxvYWRTb3VuZCh1cmwsIGJ1ZmZlclRvVXNlKXtcblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0Ly8gRGVjb2RlIGFzeW5jaHJvbm91c2x5XG5cdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0Y29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0XHRpZiAoYnVmZmVyVG9Vc2UgPT09IFBVQkxJQyl7XG5cdFx0ICBcdFx0cHVibGljQnVmZmVyID0gYnVmZmVyO1xuXHRcdFx0fWVsc2UgaWYgKGJ1ZmZlclRvVXNlID09PSBXQUlUKXtcblx0XHQgIFx0XHR3YWl0QnVmZmVyID0gYnVmZmVyO1xuXHRcdFx0fWVsc2UgaWYgKGJ1ZmZlclRvVXNlID09PSBSRVNQKXtcblx0XHQgIFx0XHRyZXNwQnVmZmVyID0gYnVmZmVyO1xuXHRcdFx0fVxuXHRcdH0sIGZ1bmN0aW9uKGUpe1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGRlY29kaW5nIGZpbGUnLCBlKTtcblx0XHR9KTtcblx0fVxuXHRyZXF1ZXN0LnNlbmQoKTtcbn1cblxuZnVuY3Rpb24gbG9hZFB1YmxpY1NvdW5kKCl7XG5cdGlmKGNvbnRleHQpXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9xdWVzdGlvbl9wdWJsaWNfY291cnRlLm1wM1wiLCBQVUJMSUMpO1xufVxuXG5mdW5jdGlvbiBsb2FkV2FpdFNvdW5kKCl7XG5cdGlmIChjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvYXR0ZW50ZV9yZXBvbnNlX2NvdXJ0ZS5tcDNcIiwgV0FJVCk7XG59XG5cbmZ1bmN0aW9uIGxvYWRSZXNwU291bmQoKXtcblx0aWYgKGNvbnRleHQpXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9ib25uZV9yZXBvbnNlLm1wM1wiLCBSRVNQKTtcbn1cblxuZnVuY3Rpb24gcGxheVNvdW5kKGJ1ZmZlcil7XG5cdHZhciBzb3VyY2UgPSBjb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpOyAvLyBjcmVhdGVzIGEgc291bmQgc291cmNlXG5cdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7ICAgICAgICAgICAgICAgICAgICAvLyB0ZWxsIHRoZSBzb3VyY2Ugd2hpY2ggc291bmQgdG8gcGxheVxuXHRzb3VyY2UuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKTsgICAgICAgLy8gY29ubmVjdCB0aGUgc291cmNlIHRvIHRoZSBjb250ZXh0J3MgZGVzdGluYXRpb24gKHRoZSBzcGVha2Vycylcblx0c291cmNlLnN0YXJ0KDApOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBsYXkgdGhlIHNvdXJjZSBub3dcblx0cmV0dXJuIHNvdXJjZTtcbn1cblxubG9hZFB1YmxpY1NvdW5kKCk7XG5sb2FkV2FpdFNvdW5kKCk7XG5sb2FkUmVzcFNvdW5kKCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIEFwaXMgZXhwb3NlZFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiovXG5cbmZ1bmN0aW9uIHBsYXlQdWJsaWMoKXtcblx0aWYgKGNvbnRleHQpe1xuXHRcdHN0b3AoKTtcblx0XHRjdXJyZW50U291cmNlID0gcGxheVNvdW5kKHB1YmxpY0J1ZmZlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGxheVdhaXQoKXtcblx0aWYgKGNvbnRleHQpe1xuXHRcdHN0b3AoKTtcblx0XHRjdXJyZW50U291cmNlID0gcGxheVNvdW5kKHdhaXRCdWZmZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBsYXlSZXNwKCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZChyZXNwQnVmZmVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdG9wKCl7XG5cdGlmIChjdXJyZW50U291cmNlICYmIGN1cnJlbnRTb3VyY2Uuc3RvcCl7XG5cdFx0Y3VycmVudFNvdXJjZS5zdG9wKDApO1xuXHR9XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cGxheVB1YmxpYyA6IHBsYXlQdWJsaWMsXG5cdHBsYXlXYWl0IDogcGxheVdhaXQsXG5cdHBsYXlSZXNwIDogcGxheVJlc3AsXG5cdHN0b3AgOiBzdG9wXG59IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcvY29uZmlnJyksXG5cdGF1ZGlvID0gcmVxdWlyZSgnLi9hdWRpbycpLFxuXHRzb2NrZXQgPSBudWxsLFxuXHRzY29yZUluZGV4ID0ge307XG5cblxuXG5mdW5jdGlvbiBoaWRlUXVlc3Rpb24oKXtcdFxuXHRhdWRpby5zdG9wKCk7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdoaWRlUXVlc3Rpb24nXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VRdWVzdGlvbihpbmRleCl7XG5cdGF1ZGlvLnBsYXlQdWJsaWMoKTtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ2NoYW5nZVF1ZXN0aW9uJyxcblx0XHQnaW5kZXgnIDogaW5kZXgsXG5cdFx0cmVwQSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBBYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQmApLmlubmVySFRNTCxcblx0XHRyZXBDIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcENgKS5pbm5lckhUTUwsXG5cdFx0cmVwRCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBEYCkuaW5uZXJIVE1MLFxuXG5cdH0pO1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnc2hvd05vdGlmaWNhdGlvbidcdFx0XG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NTY29yZShpbmRleCl7XG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICBoZWFkZXJzOiBteUhlYWRlcnMsXG4gICAgICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuXG5cdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtjb25maWcuYWRkcmVzc30vc2NvcmUvJHtpbmRleH1gLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdGF1ZGlvLnBsYXlXYWl0KCk7XG5cdFx0Ly8gT24gbmUgcmV0cmFpcmUgcGFzIHVuZSBxdWVzdGlvbiBkw6lqw6AgdHJhaXTDqWVcblx0XHRpZiAoc2NvcmVJbmRleFtgcXVlc3Rpb25fJHtpbmRleH1gXSl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdGxldCB0b3RhbCA9IGpzb24ucmVwQSArIGpzb24ucmVwQiArIGpzb24ucmVwQyArIGpzb24ucmVwRDtcblx0XHR2YXIgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGNoYXJ0X3F1ZXN0aW9uXyR7aW5kZXh9YCkuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0ICAgIGxhYmVsczogW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiXSxcblx0XHQgICAgZGF0YXNldHM6IFtcblx0XHQgICAgICAgIHtcblx0XHQgICAgICAgICAgICBsYWJlbDogXCJBXCIsXG5cdFx0ICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC41KVwiLFxuXHRcdCAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC44KVwiLFxuXHRcdCAgICAgICAgICAgIGhpZ2hsaWdodEZpbGw6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjc1KVwiLFxuXHRcdCAgICAgICAgICAgIGhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDIyMCwyMjAsMjIwLDEpXCIsXG5cdFx0ICAgICAgICAgICAgZGF0YTogW01hdGgucm91bmQoKGpzb24ucmVwQSAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEIgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBDIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwRCAvIHRvdGFsKSAqIDEwMCldXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIF1cblx0XHR9O1xuXHRcdHZhciBteUJhckNoYXJ0ID0gbmV3IENoYXJ0KGN0eCkuQmFyKGRhdGEsIHtcblx0XHRcdCAvL0Jvb2xlYW4gLSBXaGV0aGVyIGdyaWQgbGluZXMgYXJlIHNob3duIGFjcm9zcyB0aGUgY2hhcnRcblx0ICAgIFx0c2NhbGVTaG93R3JpZExpbmVzIDogZmFsc2UsXG5cdCAgICBcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgY29sb3VyXG5cdCAgICBcdHNjYWxlRm9udENvbG9yOiBcIm9yYW5nZVwiLFxuXHRcdH0pO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGF1ZGlvLnBsYXlSZXNwKCk7XG5cdFx0XHRsZXQgZ29vZEFuc3dlckVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXJlc3AtcXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLmdvb2RgKTtcblx0XHRcdGxldCBhbndzZXIgPSBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQScpID8gJ0EnIDpcblx0XHRcdFx0XHRcdCBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQicpID8gJ0InIDpcblx0XHRcdFx0XHRcdCBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQycpID8gJ0MnIDogJ0QnO1xuXHRcdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdFx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdFx0XHRldmVudFR5cGUgOiAnYW5zd2VyJyxcblx0XHRcdFx0dmFsdWUgOiBhbndzZXJcblx0XHRcdH0pO1x0XHRcdCBcblx0XHRcdGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdH0sIDUwMDApO1xuXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblx0aGlkZVF1ZXN0aW9uKCk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDEpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDEpO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMicsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMik7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMik7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0zJywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbigzKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTMnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSgzKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWl0LXF1ZXN0aW9uJywgaGlkZVF1ZXN0aW9uKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZycpO1xuXG5mdW5jdGlvbiBwb3N0UHJvZENvZGVIaWxpZ2h0KCl7XG5cdHZhciBhcnJheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvZGUudG9IaWxpZ2h0Jyk7XG5cdGZvciAodmFyIGkgPTA7IGkgPGFycmF5Lmxlbmd0aDsgaSsrKXtcblx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHR2YXIgdGV4dENvZGUgPSBhcnJheVtpXS5pbm5lckhUTUw7XG5cdFx0ZG97XG5cdFx0XHRsZW5ndGggPSB0ZXh0Q29kZS5sZW5ndGg7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrJmd0OycsICc8bWFyaz4nKTtcblx0XHRcdHRleHRDb2RlID0gdGV4dENvZGUucmVwbGFjZSgnJmx0O21hcmsgY2xhc3M9XCJkaWxsdWF0ZVwiJmd0OycsICc8bWFyayBjbGFzcz1cImRpbGx1YXRlXCI+Jyk7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDsvbWFyayZndDsnLCAnPC9tYXJrPicpO1xuXHRcdH13aGlsZShsZW5ndGggIT0gdGV4dENvZGUubGVuZ3RoKTtcblx0XHRhcnJheVtpXS5pbm5lckhUTUwgPSB0ZXh0Q29kZTtcblxuXHR9XG59XG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVhZHknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgLy8gZXZlbnQuY3VycmVudFNsaWRlLCBldmVudC5pbmRleGgsIGV2ZW50LmluZGV4dlxuXHRcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBcdHBvc3RQcm9kQ29kZUhpbGlnaHQoKTtcblx0fSwgNTAwKTtcblx0XG5cdGxldCBpbklGcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cdFxuXHRpZiAoIWluSUZyYW1lICYmIGlvICYmIGNvbmZpZy5hZGRyZXNzKXtcblx0XHRsZXQgc29ja2V0R2FtZSA9IGlvLmNvbm5lY3QoY29uZmlnLmFkZHJlc3MpO1xuXHRcdHJlcXVpcmUoJy4vZ2FtZS9wcmV6X2dhbWUnKS5pbml0KHNvY2tldEdhbWUpO1xuXHRcdGxldCBzb2NrZXRQcmV6ID0gbnVsbDtcblx0XHRpZiAoY29uZmlnLmxvY2FsKXtcblx0XHRcdHNvY2tldFByZXogPSBzb2NrZXRHYW1lOyAgIFxuXHRcdH1lbHNle1xuXHRcdFx0c29ja2V0UHJleiA9IGlvLmNvbm5lY3QoY29uZmlnLmFkZHJlc3MpO1xuXHRcdH1cbiBcbiBcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9saWdodCcpLmluaXQoc29ja2V0UHJleik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvb3JpZW50YXRpb24nKS5pbml0KHNvY2tldFByZXopO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL2RldmljZW1vdGlvbicpLmluaXQoc29ja2V0UHJleik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvdm9pY2UnKS5pbml0KHNvY2tldFByZXopO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL3VzZXJtZWRpYScpLmluaXQoc29ja2V0UHJleik7XG4gXHRcdFx0XG4gXHRcdH0sIDEwMDApO1xuXHR9XHRcbiBcblx0XG59ICk7XG4iLCIndXNlIHN0cmljdCdcblxubGV0IG1vdGlvbkVuYWJsZSA9IGZhbHNlLFxuXHRtb3Rpb25FbHQgPSBudWxsLFxuXHRiYXR0ZXJ5MUVsdCA9IG51bGwsXG5cdGJhdHRlcnkyRWx0ID0gbnVsbCxcblx0Y2hhcmdlQmF0dGVyeTEgPSAwLFxuXHRjaGFyZ2VCYXR0ZXJ5MiA9IDAsXG5cdHdpbm5lciA9IG51bGwsXG5cdGZ1bGxWYWx1ZTEgPSAxMDAwMCxcblx0ZnVsbFZhbHVlMiA9IDEwMDAwLFxuXHRtYXBVc2Vyc0FjdGl2ID0ge307XG5cblxuXG5cbmZ1bmN0aW9uIGJhdFVwZGF0ZSh0ZWFtLCBjaGFyZ2UpIHtcblx0bGV0IGNvbCA9IFtdLFxuXHRlbHQgPSBudWxsO1xuICBpZiAodGVhbSA9PT0gXCIxXCIpIHtcbiAgXHRlbHQgPSBiYXR0ZXJ5MUVsdDtcbiAgICAvLyBSZWQgLSBEYW5nZXIhXG4gICAgY29sID0gW1wiIzc1MDkwMFwiLCBcIiNjNjQ2MmJcIiwgXCIjYjc0NDI0XCIsIFwiI2RmMGEwMFwiLCBcIiM1OTA3MDBcIl07XG4gIH0gLyplbHNlIGlmIChjaGFyZ2UgPCA0MCkge1xuICAgIC8vIFllbGxvdyAtIE1pZ2h0IHdhbm5hIGNoYXJnZSBzb29uLi4uXG4gICAgY29sID0gW1wiIzc1NGYwMFwiLCBcIiNmMmJiMDBcIiwgXCIjZGJiMzAwXCIsIFwiI2RmOGYwMFwiLCBcIiM1OTNjMDBcIl07XG4gIH0gKi9lbHNlIHtcbiAgXHRlbHQgPSBiYXR0ZXJ5MkVsdDtcbiAgICAvLyBHcmVlbiAtIEFsbCBnb29kIVxuICAgIGNvbCA9IFtcIiMzMTZkMDhcIiwgXCIjNjBiOTM5XCIsIFwiIzUxYWEzMVwiLCBcIiM2NGNlMTFcIiwgXCIjMjU1NDA1XCJdO1xuICB9XG4gIGVsdC5zdHlsZVtcImJhY2tncm91bmQtaW1hZ2VcIl0gPSBcImxpbmVhci1ncmFkaWVudCh0byByaWdodCwgdHJhbnNwYXJlbnQgNSUsIFwiICsgY29sWzBdICsgXCIgNSUsIFwiICsgY29sWzBdICsgXCIgNyUsIFwiICsgY29sWzFdICsgXCIgOCUsIFwiICsgY29sWzFdICsgXCIgMTAlLCBcIiArIGNvbFsyXSArIFwiIDExJSwgXCIgKyBjb2xbMl0gKyBcIiBcIiArIChjaGFyZ2UgLSAzKSArIFwiJSwgXCIgKyBjb2xbM10gKyBcIiBcIiArIChjaGFyZ2UgLSAyKSArIFwiJSwgXCIgKyBjb2xbM10gKyBcIiBcIiArIGNoYXJnZSArIFwiJSwgXCIgKyBjb2xbNF0gKyBcIiBcIiArIGNoYXJnZSArIFwiJSwgYmxhY2sgXCIgKyAoY2hhcmdlICsgNSkgKyBcIiUsIGJsYWNrIDk1JSwgdHJhbnNwYXJlbnQgOTUlKSwgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpIDAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNCkgNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA3JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDE0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjgpIDE0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDQwJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSA0MSUsIHJnYmEoMjU1LDI1NSwyNTUsMCkgODAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgODAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNCkgODYlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNikgOTAlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMSkgOTIlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMSkgOTUlLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSkgOTglKVwiO1xufVxuXG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0KXtcblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGZ1bmN0aW9uKG1zZyl7XG5cdFx0aWYgKG1vdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ2RldmljZW1vdGlvbicpe1xuXHRcdFx0aWYgKCF3aW5uZXIgJiYgbXNnLnRlYW0pe1xuXHRcdFx0XHRsZXQgdG1wVXNlclRlYW0gPSBtYXBVc2Vyc0FjdGl2W21zZy5pZF07XG5cdFx0XHRcdGlmICghdG1wVXNlclRlYW0pe1xuXHRcdFx0XHRcdG1hcFVzZXJzQWN0aXZbbXNnLmlkXSA9IG1zZy50ZWFtO1xuXHRcdFx0XHRcdGlmIChtc2cudGVhbSA9PT0gXCIxXCIpe1xuXHRcdFx0XHRcdFx0ZnVsbFZhbHVlMSs9IDEwMDAwO1xuXHRcdFx0XHRcdH1lbHNlIGlmIChtc2cudGVhbSA9PT0gXCIyXCIpe1xuXHRcdFx0XHRcdFx0ZnVsbFZhbHVlMis9IDEwMDAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVx0XHRcdFx0XG5cdFx0XHRcdGxldCBwZXJjZW50ID0gMDtcblx0XHRcdFx0aWYgKG1zZy50ZWFtID09PSBcIjFcIil7XG5cdFx0XHRcdFx0Y2hhcmdlQmF0dGVyeTErPSBtc2cudmFsdWU7XG5cdFx0XHRcdFx0cGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkxIC8gZnVsbFZhbHVlMSkgKjEwMCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGNoYXJnZUJhdHRlcnkyKz0gbXNnLnZhbHVlO1xuXHRcdFx0XHRcdHBlcmNlbnQgPSBNYXRoLnJvdW5kKChjaGFyZ2VCYXR0ZXJ5MiAvIGZ1bGxWYWx1ZTIpICoxMDApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YmF0VXBkYXRlKG1zZy50ZWFtLCBNYXRoLm1pbihwZXJjZW50LDkwKSk7XG5cdFx0XHRcdGlmICghd2lubmVyICYmIE1hdGgubWluKHBlcmNlbnQsOTApID09PSA5MCl7XG5cdFx0XHRcdFx0d2lubmVyID0gdHJ1ZTtcblx0XHRcdFx0XHRpZiAobXNnLnRlYW0gPT09IFwiMVwiKXtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXZpY2Vtb3Rpb24gLndpbi5maXJlZm94JykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV2aWNlbW90aW9uIC53aW4uY2hyb21lJykuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cdH0pO1xuXHRiYXR0ZXJ5MUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTEnKTtcblx0YmF0dGVyeTJFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYmF0dGVyeS0yJyk7XG5cblx0YmF0VXBkYXRlKFwiMVwiLDApO1xuXHRiYXRVcGRhdGUoXCIyXCIsMCk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpe1xuXHRcdHNvY2tldC5lbWl0KCdjb25maWcnLCB7XG5cdFx0XHR0eXBlOlwiZ2FtZVwiLFxuXHRcdFx0ZXZlbnRUeXBlOlwiYmF0dGVyeVwiLCBcblx0XHRcdHNob3c6dHJ1ZVxuXHRcdH0pO1xuXHRcdG1vdGlvbkVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1kZXZpY2Vtb3Rpb24nLCBmdW5jdGlvbigpe1xuXHRcdHNvY2tldC5lbWl0KCdjb25maWcnLCB7XG5cdFx0XHR0eXBlOlwiZ2FtZVwiLFxuXHRcdFx0ZXZlbnRUeXBlOlwiYmF0dGVyeVwiLCBcblx0XHRcdHNob3c6ZmFsc2Vcblx0XHR9KTtcblx0XHRtb3Rpb25FbmFibGUgPSBmYWxzZTtcblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBsaWdodEVuYWJsZSA9IGZhbHNlLFxuXHRsaWdodEVsdCA9IG51bGw7XG5cblxuLy8gV2UgdXBkYXRlIHRoZSBjc3MgU3R5bGVcbmZ1bmN0aW9uIHVwZGF0ZUxpZ2h0KGRhdGEpe1xuXHRsZXQgcHJlZml4TGlnaHQgPSAnLXdlYmtpdC0nO1xuXHRsZXQgcGVyY2VudCA9IGRhdGE7XG5cdHZhciBzdHlsZSA9IHByZWZpeExpZ2h0KydyYWRpYWwtZ3JhZGllbnQoY2VudGVyLCAnXG5cdCAgICArJyBlbGxpcHNlIGNvdmVyLCAnXG5cdCAgICArJyByZ2JhKDE5OCwxOTcsMTQ1LDEpIDAlLCdcblx0ICAgICsnIHJnYmEoMCwwLDAsMSkgJytwZXJjZW50KyclKSdcblx0ICAgIDtcblx0bGlnaHRFbHQuc3R5bGUuYmFja2dyb3VuZCA9IHN0eWxlO1xufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCl7XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBmdW5jdGlvbihtc2cpe1xuXHRcdGlmIChsaWdodEVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ2xpZ2h0Jyl7XG5cdFx0XHR1cGRhdGVMaWdodChtc2cudmFsdWUpO1xuXHRcdH1cblx0fSk7XG5cdGxpZ2h0RWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZ2h0LWJnJyk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1saWdodCcsIGZ1bmN0aW9uKCl7XG5cdFx0bGlnaHRFbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3AtbGlnaHQnLCBmdW5jdGlvbigpe1xuXHRcdGxpZ2h0RW5hYmxlID0gZmFsc2U7XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgb3JpZW50YXRpb25FbmFibGUgPSBmYWxzZSwgXG5cdGxvY2tFbHQgPSBudWxsLFxuXHRyZXNFbHQgPSBudWxsLFxuXHRvcGVuID0gZmFsc2U7XG5cbmNvbnN0IHZhbHVlcyA9IHsgZmlyc3QgOiB7dmFsdWU6IDUwLCBmb3VuZDogZmFsc2V9LCBcblx0XHRcdFx0c2Vjb25kIDoge3ZhbHVlOiA4MCwgZm91bmQ6IGZhbHNlfSwgXG5cdFx0XHRcdHRoaXJkIDoge3ZhbHVlIDogMTAsIGZvdW5kIDogZmFsc2V9XG5cdFx0XHR9O1xuXG5cbi8vIEFjY29yZGluZyB0byB0aGUgbnVtYmVyIG9mIHVubG9jaywgd2UganVzdCB0dXJuIHRoZSBpbWFnZSBvciB3ZSBvcGVuIHRoZSBkb29yXG5mdW5jdGlvbiB1cGRhdGVSb3RhdGlvbih6QWxwaGEsIGZpcnN0VmFsdWUpe1xuXHRpZiAoIW9wZW4pe1xuXHRcdGxldCBkZWx0YSA9IGZpcnN0VmFsdWUgLSB6QWxwaGE7XG5cdFx0bGV0IHJvdGF0aW9uID0gZGVsdGE7XG5cdFx0aWYgKGRlbHRhIDwgMCl7XG5cdFx0XHRyb3RhdGlvbiA9IGZpcnN0VmFsdWUrMzYwLXpBbHBoYTtcblx0XHR9XHRcdFxuXHRcdGxvY2tFbHQuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooJytyb3RhdGlvbisnZGVnKSc7XG5cblx0XHRsZXQgY3VycmVudFZhbHVlID0gMTAwIC0gTWF0aC5yb3VuZCgocm90YXRpb24qMTAwKS8zNjApO1xuXHRcdHJlc0VsdC5pbm5lckhUTUwgPSBjdXJyZW50VmFsdWU7XG5cdFx0aWYgKHZhbHVlcy5maXJzdC5mb3VuZCBcblx0XHRcdCYmIHZhbHVlcy5zZWNvbmQuZm91bmRcblx0XHRcdCYmIHZhbHVlcy50aGlyZC5mb3VuZCl7XHRcdFx0XG5cdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbicpLmNsYXNzTGlzdC5hZGQoXCJvcGVuXCIpO1xuXHRcdH1lbHNlIGlmICghdmFsdWVzLmZpcnN0LmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMuZmlyc3QudmFsdWUpe1x0XHRcdFx0XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAuZmlyc3QnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy5maXJzdC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMuc2Vjb25kLmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMuc2Vjb25kLnZhbHVlKXtcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5zZWNvbmQnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy5zZWNvbmQuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1lbHNlIGlmICghdmFsdWVzLnRoaXJkLmZvdW5kKSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlID09PSB2YWx1ZXMudGhpcmQudmFsdWUpe1xuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLnRoaXJkJyk7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LnJlbW92ZShcImZhLXRpbWVzLWNpcmNsZVwiKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuXHRcdFx0XHR2YWx1ZXMudGhpcmQuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQpe1xuXG5cdHNvY2tldC5vbignc2Vuc29yJywgZnVuY3Rpb24obXNnKXtcblx0XHRpZiAob3JpZW50YXRpb25FbmFibGUgJiYgbXNnLnR5cGUgPT09ICdvcmllbnRhdGlvbicpe1xuXHRcdFx0dXBkYXRlUm90YXRpb24obXNnLnZhbHVlLCBtc2cuZmlyc3RWYWx1ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRsb2NrRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNhZmVfbG9jaycpO1xuXHRyZXNFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3JpZW50YXRpb24gLnJlc3AgLnZhbHVlJyk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC1vcmllbnRhdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0b3JpZW50YXRpb25FbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3Atb3JpZW50YXRpb24nLCBmdW5jdGlvbigpe1xuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2U7XG5cdH0pO1x0XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCB1c2VybWVkaWFFbmFibGUgPSBmYWxzZSxcblx0dXNlcm1lZGlhRWx0ID0gbnVsbDtcblxuXG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0KXtcblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGZ1bmN0aW9uKG1zZyl7XG5cdFx0aWYgKHVzZXJtZWRpYUVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ3VzZXJtZWRpYScpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bob3RvU3RyZWFtJykuc2V0QXR0cmlidXRlKCdzcmMnLCBtc2cudmFsdWUpO1xuXHRcdH1cblx0fSk7XG5cdHVzZXJtZWRpYUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybWVkaWEtYmcnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LXVzZXJtZWRpYScsIGZ1bmN0aW9uKCl7XG5cdFx0dXNlcm1lZGlhRW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLXVzZXJtZWRpYScsIGZ1bmN0aW9uKCl7XG5cdFx0dXNlcm1lZGlhRW5hYmxlID0gZmFsc2U7XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgdm9pY2VFbmFibGUgPSBmYWxzZTtcblxuXG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0KXtcblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGZ1bmN0aW9uKG1zZyl7XG5cdFx0aWYgKHZvaWNlRW5hYmxlICYmIG1zZy50eXBlID09PSAndm9pY2UnKXtcblx0XHRcdGlmIChtc2cudmFsdWUgPT09ICduZXh0Jyl7XG5cdFx0XHRcdFJldmVhbC5uZXh0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtd2Vic3BlZWNoJywgZnVuY3Rpb24oKXtcblx0XHR2b2ljZUVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC13ZWJzcGVlY2gnLCBmdW5jdGlvbigpe1xuXHRcdHZvaWNlRW5hYmxlID0gZmFsc2U7XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufSJdfQ==
