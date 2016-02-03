(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3000")){
		return "http://localhost:8000"
	}else if (location.port && location.port === "8000"){
		return "http://binomed.fr:8000";
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
		
	
	if (io && config.address){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3ByZXpfc3VwZXJfcG93ZXIuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy9kZXZpY2Vtb3Rpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy9saWdodC5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL29yaWVudGF0aW9uLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvdXNlcm1lZGlhLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvdm9pY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRyZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxuXHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjgwMDBcIil7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2Jpbm9tZWQuZnI6ODAwMFwiO1xuXHR9ZWxzZXtcblx0XHRyZXR1cm4gbnVsbDtcdFxuXHR9IFxufVxuXG52YXIgYWRkcmVzcyA9IGNhbGN1bGF0ZUFkZHJlc3MoKTtcbnZhciBsb2NhbCA9IGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRhZGRyZXNzIDogYWRkcmVzcyxcblx0bG9jYWwgOiBsb2NhbFxufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29udGV4dCA9IG51bGwsXG5cdFBVQkxJQyA9IDEsXG5cdFdBSVQgPSAyLFxuXHRSRVNQID0gMyxcblx0cHVibGljQnVmZmVyID0gbnVsbCxcblx0d2FpdEJ1ZmZlciA9IG51bGwsXG5cdHJlc3BCdWZmZXIgPSBudWxsLFxuXHRjdXJyZW50U291cmNlID0gbnVsbDtcblxudHJ5e1xuXHR3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXHRjb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufWNhdGNoKGUpe1xuXHRjb250ZXh0ID0gbnVsbDtcblx0Y29uc29sZS5sb2coXCJObyBXZWJBUEkgZGVjdGVjdFwiKTtcbn1cblxuZnVuY3Rpb24gbG9hZFNvdW5kKHVybCwgYnVmZmVyVG9Vc2Upe1xuXHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuXHQvLyBEZWNvZGUgYXN5bmNocm9ub3VzbHlcblx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRjb250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihidWZmZXIpIHtcblx0XHRcdGlmIChidWZmZXJUb1VzZSA9PT0gUFVCTElDKXtcblx0XHQgIFx0XHRwdWJsaWNCdWZmZXIgPSBidWZmZXI7XG5cdFx0XHR9ZWxzZSBpZiAoYnVmZmVyVG9Vc2UgPT09IFdBSVQpe1xuXHRcdCAgXHRcdHdhaXRCdWZmZXIgPSBidWZmZXI7XG5cdFx0XHR9ZWxzZSBpZiAoYnVmZmVyVG9Vc2UgPT09IFJFU1Ape1xuXHRcdCAgXHRcdHJlc3BCdWZmZXIgPSBidWZmZXI7XG5cdFx0XHR9XG5cdFx0fSwgZnVuY3Rpb24oZSl7XG5cdFx0XHRjb25zb2xlLmxvZygnRXJyb3IgZGVjb2RpbmcgZmlsZScsIGUpO1xuXHRcdH0pO1xuXHR9XG5cdHJlcXVlc3Quc2VuZCgpO1xufVxuXG5mdW5jdGlvbiBsb2FkUHVibGljU291bmQoKXtcblx0aWYoY29udGV4dClcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL3F1ZXN0aW9uX3B1YmxpY19jb3VydGUubXAzXCIsIFBVQkxJQyk7XG59XG5cbmZ1bmN0aW9uIGxvYWRXYWl0U291bmQoKXtcblx0aWYgKGNvbnRleHQpXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9hdHRlbnRlX3JlcG9uc2VfY291cnRlLm1wM1wiLCBXQUlUKTtcbn1cblxuZnVuY3Rpb24gbG9hZFJlc3BTb3VuZCgpe1xuXHRpZiAoY29udGV4dClcblx0XHRsb2FkU291bmQoXCJhc3NldHMvc291bmRzL2Jvbm5lX3JlcG9uc2UubXAzXCIsIFJFU1ApO1xufVxuXG5mdW5jdGlvbiBwbGF5U291bmQoYnVmZmVyKXtcblx0dmFyIHNvdXJjZSA9IGNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7IC8vIGNyZWF0ZXMgYSBzb3VuZCBzb3VyY2Vcblx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjsgICAgICAgICAgICAgICAgICAgIC8vIHRlbGwgdGhlIHNvdXJjZSB3aGljaCBzb3VuZCB0byBwbGF5XG5cdHNvdXJjZS5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pOyAgICAgICAvLyBjb25uZWN0IHRoZSBzb3VyY2UgdG8gdGhlIGNvbnRleHQncyBkZXN0aW5hdGlvbiAodGhlIHNwZWFrZXJzKVxuXHRzb3VyY2Uuc3RhcnQoMCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGxheSB0aGUgc291cmNlIG5vd1xuXHRyZXR1cm4gc291cmNlO1xufVxuXG5sb2FkUHVibGljU291bmQoKTtcbmxvYWRXYWl0U291bmQoKTtcbmxvYWRSZXNwU291bmQoKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogQXBpcyBleHBvc2VkXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKi9cblxuZnVuY3Rpb24gcGxheVB1YmxpYygpe1xuXHRpZiAoY29udGV4dCl7XG5cdFx0c3RvcCgpO1xuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQocHVibGljQnVmZmVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwbGF5V2FpdCgpe1xuXHRpZiAoY29udGV4dCl7XG5cdFx0c3RvcCgpO1xuXHRcdGN1cnJlbnRTb3VyY2UgPSBwbGF5U291bmQod2FpdEJ1ZmZlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGxheVJlc3AoKXtcblx0aWYgKGNvbnRleHQpe1xuXHRcdHN0b3AoKTtcblx0XHRjdXJyZW50U291cmNlID0gcGxheVNvdW5kKHJlc3BCdWZmZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0b3AoKXtcblx0aWYgKGN1cnJlbnRTb3VyY2UgJiYgY3VycmVudFNvdXJjZS5zdG9wKXtcblx0XHRjdXJyZW50U291cmNlLnN0b3AoMCk7XG5cdH1cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwbGF5UHVibGljIDogcGxheVB1YmxpYyxcblx0cGxheVdhaXQgOiBwbGF5V2FpdCxcblx0cGxheVJlc3AgOiBwbGF5UmVzcCxcblx0c3RvcCA6IHN0b3Bcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZy9jb25maWcnKSxcblx0YXVkaW8gPSByZXF1aXJlKCcuL2F1ZGlvJyksXG5cdHNvY2tldCA9IG51bGwsXG5cdHNjb3JlSW5kZXggPSB7fTtcblxuXG5cbmZ1bmN0aW9uIGhpZGVRdWVzdGlvbigpe1x0XG5cdGF1ZGlvLnN0b3AoKTtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ2hpZGVRdWVzdGlvbidcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZVF1ZXN0aW9uKGluZGV4KXtcblx0YXVkaW8ucGxheVB1YmxpYygpO1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnY2hhbmdlUXVlc3Rpb24nLFxuXHRcdCdpbmRleCcgOiBpbmRleCxcblx0XHRyZXBBIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEFgKS5pbm5lckhUTUwsXG5cdFx0cmVwQiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBCYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEMgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQ2ApLmlubmVySFRNTCxcblx0XHRyZXBEIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcERgKS5pbm5lckhUTUwsXG5cblx0fSk7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdzaG93Tm90aWZpY2F0aW9uJ1x0XHRcblxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1Njb3JlKGluZGV4KXtcblx0bGV0IG15SGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG5cdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG5cblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke2NvbmZpZy5hZGRyZXNzfS9zY29yZS8ke2luZGV4fWAsbXlJbml0KTtcblx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XG5cdFx0YXVkaW8ucGxheVdhaXQoKTtcblx0XHQvLyBPbiBuZSByZXRyYWlyZSBwYXMgdW5lIHF1ZXN0aW9uIGTDqWrDoCB0cmFpdMOpZVxuXHRcdGlmIChzY29yZUluZGV4W2BxdWVzdGlvbl8ke2luZGV4fWBdKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0bGV0IHRvdGFsID0ganNvbi5yZXBBICsganNvbi5yZXBCICsganNvbi5yZXBDICsganNvbi5yZXBEO1xuXHRcdHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY2hhcnRfcXVlc3Rpb25fJHtpbmRleH1gKS5nZXRDb250ZXh0KFwiMmRcIik7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHQgICAgbGFiZWxzOiBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCJdLFxuXHRcdCAgICBkYXRhc2V0czogW1xuXHRcdCAgICAgICAge1xuXHRcdCAgICAgICAgICAgIGxhYmVsOiBcIkFcIixcblx0XHQgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjUpXCIsXG5cdFx0ICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjgpXCIsXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0RmlsbDogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNzUpXCIsXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcblx0XHQgICAgICAgICAgICBkYXRhOiBbTWF0aC5yb3VuZCgoanNvbi5yZXBBIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQiAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEMgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBEIC8gdG90YWwpICogMTAwKV1cblx0XHQgICAgICAgIH1cblx0XHQgICAgXVxuXHRcdH07XG5cdFx0dmFyIG15QmFyQ2hhcnQgPSBuZXcgQ2hhcnQoY3R4KS5CYXIoZGF0YSwge1xuXHRcdFx0IC8vQm9vbGVhbiAtIFdoZXRoZXIgZ3JpZCBsaW5lcyBhcmUgc2hvd24gYWNyb3NzIHRoZSBjaGFydFxuXHQgICAgXHRzY2FsZVNob3dHcmlkTGluZXMgOiBmYWxzZSxcblx0ICAgIFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBjb2xvdXJcblx0ICAgIFx0c2NhbGVGb250Q29sb3I6IFwib3JhbmdlXCIsXG5cdFx0fSk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0YXVkaW8ucGxheVJlc3AoKTtcblx0XHRcdGxldCBnb29kQW5zd2VyRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cmVzcC1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AuZ29vZGApO1xuXHRcdFx0bGV0IGFud3NlciA9IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBBJykgPyAnQScgOlxuXHRcdFx0XHRcdFx0IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBCJykgPyAnQicgOlxuXHRcdFx0XHRcdFx0IGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXBDJykgPyAnQycgOiAnRCc7XG5cdFx0XHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0XHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0XHRcdGV2ZW50VHlwZSA6ICdhbnN3ZXInLFxuXHRcdFx0XHR2YWx1ZSA6IGFud3NlclxuXHRcdFx0fSk7XHRcdFx0IFxuXHRcdFx0Z29vZEFuc3dlckVsdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0fSwgNTAwMCk7XG5cblxuXHR9KTtcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXRUb1NldCl7XG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xuXHRoaWRlUXVlc3Rpb24oKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMSk7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0xJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMSk7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbigyKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTInLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSgyKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWl0LXF1ZXN0aW9uJywgaGlkZVF1ZXN0aW9uKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZycpO1xuXG5mdW5jdGlvbiBwb3N0UHJvZENvZGVIaWxpZ2h0KCl7XG5cdHZhciBhcnJheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvZGUudG9IaWxpZ2h0Jyk7XG5cdGZvciAodmFyIGkgPTA7IGkgPGFycmF5Lmxlbmd0aDsgaSsrKXtcblx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHR2YXIgdGV4dENvZGUgPSBhcnJheVtpXS5pbm5lckhUTUw7XG5cdFx0ZG97XG5cdFx0XHRsZW5ndGggPSB0ZXh0Q29kZS5sZW5ndGg7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrJmd0OycsICc8bWFyaz4nKTtcblx0XHRcdHRleHRDb2RlID0gdGV4dENvZGUucmVwbGFjZSgnJmx0O21hcmsgY2xhc3M9XCJkaWxsdWF0ZVwiJmd0OycsICc8bWFyayBjbGFzcz1cImRpbGx1YXRlXCI+Jyk7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDsvbWFyayZndDsnLCAnPC9tYXJrPicpO1xuXHRcdH13aGlsZShsZW5ndGggIT0gdGV4dENvZGUubGVuZ3RoKTtcblx0XHRhcnJheVtpXS5pbm5lckhUTUwgPSB0ZXh0Q29kZTtcblxuXHR9XG59XG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVhZHknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgLy8gZXZlbnQuY3VycmVudFNsaWRlLCBldmVudC5pbmRleGgsIGV2ZW50LmluZGV4dlxuXHRcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBcdHBvc3RQcm9kQ29kZUhpbGlnaHQoKTtcblx0fSwgNTAwKTtcblx0XHRcblx0XG5cdGlmIChpbyAmJiBjb25maWcuYWRkcmVzcyl7XG5cdFx0bGV0IHNvY2tldEdhbWUgPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHRyZXF1aXJlKCcuL2dhbWUvcHJlel9nYW1lJykuaW5pdChzb2NrZXRHYW1lKTtcblx0XHRsZXQgc29ja2V0UHJleiA9IG51bGw7XG5cdFx0aWYgKGNvbmZpZy5sb2NhbCl7XG5cdFx0XHRzb2NrZXRQcmV6ID0gc29ja2V0R2FtZTsgICBcblx0XHR9ZWxzZXtcblx0XHRcdHNvY2tldFByZXogPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHR9XG4gXG4gXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKS5pbml0KHNvY2tldFByZXopO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL29yaWVudGF0aW9uJykuaW5pdChzb2NrZXRQcmV6KTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9kZXZpY2Vtb3Rpb24nKS5pbml0KHNvY2tldFByZXopO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL3ZvaWNlJykuaW5pdChzb2NrZXRQcmV6KTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy91c2VybWVkaWEnKS5pbml0KHNvY2tldFByZXopO1xuIFx0XHRcdFxuIFx0XHR9LCAxMDAwKTtcblx0fVx0XG4gXG5cdFxufSApO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBtb3Rpb25FbmFibGUgPSBmYWxzZSxcblx0bW90aW9uRWx0ID0gbnVsbCxcblx0YmF0dGVyeTFFbHQgPSBudWxsLFxuXHRiYXR0ZXJ5MkVsdCA9IG51bGwsXG5cdGNoYXJnZUJhdHRlcnkxID0gMCxcblx0Y2hhcmdlQmF0dGVyeTIgPSAwLFxuXHR3aW5uZXIgPSBudWxsLFxuXHRmdWxsVmFsdWUxID0gMTAwMDAsXG5cdGZ1bGxWYWx1ZTIgPSAxMDAwMCxcblx0bWFwVXNlcnNBY3RpdiA9IHt9O1xuXG5cblxuXG5mdW5jdGlvbiBiYXRVcGRhdGUodGVhbSwgY2hhcmdlKSB7XG5cdGxldCBjb2wgPSBbXSxcblx0ZWx0ID0gbnVsbDtcbiAgaWYgKHRlYW0gPT09IFwiMVwiKSB7XG4gIFx0ZWx0ID0gYmF0dGVyeTFFbHQ7XG4gICAgLy8gUmVkIC0gRGFuZ2VyIVxuICAgIGNvbCA9IFtcIiM3NTA5MDBcIiwgXCIjYzY0NjJiXCIsIFwiI2I3NDQyNFwiLCBcIiNkZjBhMDBcIiwgXCIjNTkwNzAwXCJdO1xuICB9IC8qZWxzZSBpZiAoY2hhcmdlIDwgNDApIHtcbiAgICAvLyBZZWxsb3cgLSBNaWdodCB3YW5uYSBjaGFyZ2Ugc29vbi4uLlxuICAgIGNvbCA9IFtcIiM3NTRmMDBcIiwgXCIjZjJiYjAwXCIsIFwiI2RiYjMwMFwiLCBcIiNkZjhmMDBcIiwgXCIjNTkzYzAwXCJdO1xuICB9ICovZWxzZSB7XG4gIFx0ZWx0ID0gYmF0dGVyeTJFbHQ7XG4gICAgLy8gR3JlZW4gLSBBbGwgZ29vZCFcbiAgICBjb2wgPSBbXCIjMzE2ZDA4XCIsIFwiIzYwYjkzOVwiLCBcIiM1MWFhMzFcIiwgXCIjNjRjZTExXCIsIFwiIzI1NTQwNVwiXTtcbiAgfVxuICBlbHQuc3R5bGVbXCJiYWNrZ3JvdW5kLWltYWdlXCJdID0gXCJsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHRyYW5zcGFyZW50IDUlLCBcIiArIGNvbFswXSArIFwiIDUlLCBcIiArIGNvbFswXSArIFwiIDclLCBcIiArIGNvbFsxXSArIFwiIDglLCBcIiArIGNvbFsxXSArIFwiIDEwJSwgXCIgKyBjb2xbMl0gKyBcIiAxMSUsIFwiICsgY29sWzJdICsgXCIgXCIgKyAoY2hhcmdlIC0gMykgKyBcIiUsIFwiICsgY29sWzNdICsgXCIgXCIgKyAoY2hhcmdlIC0gMikgKyBcIiUsIFwiICsgY29sWzNdICsgXCIgXCIgKyBjaGFyZ2UgKyBcIiUsIFwiICsgY29sWzRdICsgXCIgXCIgKyBjaGFyZ2UgKyBcIiUsIGJsYWNrIFwiICsgKGNoYXJnZSArIDUpICsgXCIlLCBibGFjayA5NSUsIHRyYW5zcGFyZW50IDk1JSksIGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMjU1LDI1NSwyNTUsMC41KSAwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjQpIDQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNyUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSAxNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC44KSAxNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0MCUsIHJnYmEoMjU1LDI1NSwyNTUsMCkgNDElLCByZ2JhKDI1NSwyNTUsMjU1LDApIDgwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDgwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjQpIDg2JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjYpIDkwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjEpIDkyJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjEpIDk1JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpIDk4JSlcIjtcbn1cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCl7XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBmdW5jdGlvbihtc2cpe1xuXHRcdGlmIChtb3Rpb25FbmFibGUgJiYgbXNnLnR5cGUgPT09ICdkZXZpY2Vtb3Rpb24nKXtcblx0XHRcdGlmICghd2lubmVyICYmIG1zZy50ZWFtKXtcblx0XHRcdFx0bGV0IHRtcFVzZXJUZWFtID0gbWFwVXNlcnNBY3Rpdlttc2cuaWRdO1xuXHRcdFx0XHRpZiAoIXRtcFVzZXJUZWFtKXtcblx0XHRcdFx0XHRtYXBVc2Vyc0FjdGl2W21zZy5pZF0gPSBtc2cudGVhbTtcblx0XHRcdFx0XHRpZiAobXNnLnRlYW0gPT09IFwiMVwiKXtcblx0XHRcdFx0XHRcdGZ1bGxWYWx1ZTErPSAxMDAwMDtcblx0XHRcdFx0XHR9ZWxzZSBpZiAobXNnLnRlYW0gPT09IFwiMlwiKXtcblx0XHRcdFx0XHRcdGZ1bGxWYWx1ZTIrPSAxMDAwMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cdFx0XHRcdFxuXHRcdFx0XHRsZXQgcGVyY2VudCA9IDA7XG5cdFx0XHRcdGlmIChtc2cudGVhbSA9PT0gXCIxXCIpe1xuXHRcdFx0XHRcdGNoYXJnZUJhdHRlcnkxKz0gbXNnLnZhbHVlO1xuXHRcdFx0XHRcdHBlcmNlbnQgPSBNYXRoLnJvdW5kKChjaGFyZ2VCYXR0ZXJ5MSAvIGZ1bGxWYWx1ZTEpICoxMDApO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRjaGFyZ2VCYXR0ZXJ5Mis9IG1zZy52YWx1ZTtcblx0XHRcdFx0XHRwZXJjZW50ID0gTWF0aC5yb3VuZCgoY2hhcmdlQmF0dGVyeTIgLyBmdWxsVmFsdWUyKSAqMTAwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhdFVwZGF0ZShtc2cudGVhbSwgTWF0aC5taW4ocGVyY2VudCw5MCkpO1xuXHRcdFx0XHRpZiAoIXdpbm5lciAmJiBNYXRoLm1pbihwZXJjZW50LDkwKSA9PT0gOTApe1xuXHRcdFx0XHRcdHdpbm5lciA9IHRydWU7XG5cdFx0XHRcdFx0aWYgKG1zZy50ZWFtID09PSBcIjFcIil7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV2aWNlbW90aW9uIC53aW4uZmlyZWZveCcpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldmljZW1vdGlvbiAud2luLmNocm9tZScpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fVxuXHR9KTtcblx0YmF0dGVyeTFFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYmF0dGVyeS0xJyk7XG5cdGJhdHRlcnkyRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhdHRlcnktMicpO1xuXG5cdGJhdFVwZGF0ZShcIjFcIiwwKTtcblx0YmF0VXBkYXRlKFwiMlwiLDApO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtZGV2aWNlbW90aW9uJywgZnVuY3Rpb24oKXtcblx0XHRzb2NrZXQuZW1pdCgnY29uZmlnJywge1xuXHRcdFx0dHlwZTpcImdhbWVcIixcblx0XHRcdGV2ZW50VHlwZTpcImJhdHRlcnlcIiwgXG5cdFx0XHRzaG93OnRydWVcblx0XHR9KTtcblx0XHRtb3Rpb25FbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3AtZGV2aWNlbW90aW9uJywgZnVuY3Rpb24oKXtcblx0XHRzb2NrZXQuZW1pdCgnY29uZmlnJywge1xuXHRcdFx0dHlwZTpcImdhbWVcIixcblx0XHRcdGV2ZW50VHlwZTpcImJhdHRlcnlcIiwgXG5cdFx0XHRzaG93OmZhbHNlXG5cdFx0fSk7XG5cdFx0bW90aW9uRW5hYmxlID0gZmFsc2U7XG5cdH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgbGlnaHRFbmFibGUgPSBmYWxzZSxcblx0bGlnaHRFbHQgPSBudWxsO1xuXG5cbi8vIFdlIHVwZGF0ZSB0aGUgY3NzIFN0eWxlXG5mdW5jdGlvbiB1cGRhdGVMaWdodChkYXRhKXtcblx0bGV0IHByZWZpeExpZ2h0ID0gJy13ZWJraXQtJztcblx0bGV0IHBlcmNlbnQgPSBkYXRhO1xuXHR2YXIgc3R5bGUgPSBwcmVmaXhMaWdodCsncmFkaWFsLWdyYWRpZW50KGNlbnRlciwgJ1xuXHQgICAgKycgZWxsaXBzZSBjb3ZlciwgJ1xuXHQgICAgKycgcmdiYSgxOTgsMTk3LDE0NSwxKSAwJSwnXG5cdCAgICArJyByZ2JhKDAsMCwwLDEpICcrcGVyY2VudCsnJSknXG5cdCAgICA7XG5cdGxpZ2h0RWx0LnN0eWxlLmJhY2tncm91bmQgPSBzdHlsZTtcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQpe1xuXG5cdHNvY2tldC5vbignc2Vuc29yJywgZnVuY3Rpb24obXNnKXtcblx0XHRpZiAobGlnaHRFbmFibGUgJiYgbXNnLnR5cGUgPT09ICdsaWdodCcpe1xuXHRcdFx0dXBkYXRlTGlnaHQobXNnLnZhbHVlKTtcblx0XHR9XG5cdH0pO1xuXHRsaWdodEVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saWdodC1iZycpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtbGlnaHQnLCBmdW5jdGlvbigpe1xuXHRcdGxpZ2h0RW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLWxpZ2h0JywgZnVuY3Rpb24oKXtcblx0XHRsaWdodEVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IG9yaWVudGF0aW9uRW5hYmxlID0gZmFsc2UsIFxuXHRsb2NrRWx0ID0gbnVsbCxcblx0cmVzRWx0ID0gbnVsbCxcblx0b3BlbiA9IGZhbHNlO1xuXG5jb25zdCB2YWx1ZXMgPSB7IGZpcnN0IDoge3ZhbHVlOiA1MCwgZm91bmQ6IGZhbHNlfSwgXG5cdFx0XHRcdHNlY29uZCA6IHt2YWx1ZTogODAsIGZvdW5kOiBmYWxzZX0sIFxuXHRcdFx0XHR0aGlyZCA6IHt2YWx1ZSA6IDEwLCBmb3VuZCA6IGZhbHNlfVxuXHRcdFx0fTtcblxuXG4vLyBBY2NvcmRpbmcgdG8gdGhlIG51bWJlciBvZiB1bmxvY2ssIHdlIGp1c3QgdHVybiB0aGUgaW1hZ2Ugb3Igd2Ugb3BlbiB0aGUgZG9vclxuZnVuY3Rpb24gdXBkYXRlUm90YXRpb24oekFscGhhLCBmaXJzdFZhbHVlKXtcblx0aWYgKCFvcGVuKXtcblx0XHRsZXQgZGVsdGEgPSBmaXJzdFZhbHVlIC0gekFscGhhO1xuXHRcdGxldCByb3RhdGlvbiA9IGRlbHRhO1xuXHRcdGlmIChkZWx0YSA8IDApe1xuXHRcdFx0cm90YXRpb24gPSBmaXJzdFZhbHVlKzM2MC16QWxwaGE7XG5cdFx0fVx0XHRcblx0XHRsb2NrRWx0LnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGVaKCcrcm90YXRpb24rJ2RlZyknO1xuXG5cdFx0bGV0IGN1cnJlbnRWYWx1ZSA9IDEwMCAtIE1hdGgucm91bmQoKHJvdGF0aW9uKjEwMCkvMzYwKTtcblx0XHRyZXNFbHQuaW5uZXJIVE1MID0gY3VycmVudFZhbHVlO1xuXHRcdGlmICh2YWx1ZXMuZmlyc3QuZm91bmQgXG5cdFx0XHQmJiB2YWx1ZXMuc2Vjb25kLmZvdW5kXG5cdFx0XHQmJiB2YWx1ZXMudGhpcmQuZm91bmQpe1x0XHRcdFxuXHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24nKS5jbGFzc0xpc3QuYWRkKFwib3BlblwiKTtcblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy5maXJzdC5mb3VuZCkge1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLmZpcnN0LnZhbHVlKXtcdFx0XHRcdFxuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLmZpcnN0Jyk7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LnJlbW92ZShcImZhLXRpbWVzLWNpcmNsZVwiKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuXHRcdFx0XHR2YWx1ZXMuZmlyc3QuZm91bmQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1lbHNlIGlmICghdmFsdWVzLnNlY29uZC5mb3VuZCkge1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLnNlY29uZC52YWx1ZSl7XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAuc2Vjb25kJyk7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LnJlbW92ZShcImZhLXRpbWVzLWNpcmNsZVwiKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QuYWRkKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuXHRcdFx0XHR2YWx1ZXMuc2Vjb25kLmZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy50aGlyZC5mb3VuZCkge1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gdmFsdWVzLnRoaXJkLnZhbHVlKXtcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC50aGlyZCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLnRoaXJkLmZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0KXtcblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGZ1bmN0aW9uKG1zZyl7XG5cdFx0aWYgKG9yaWVudGF0aW9uRW5hYmxlICYmIG1zZy50eXBlID09PSAnb3JpZW50YXRpb24nKXtcblx0XHRcdHVwZGF0ZVJvdGF0aW9uKG1zZy52YWx1ZSwgbXNnLmZpcnN0VmFsdWUpO1xuXHRcdH1cblx0fSk7XG5cblx0bG9ja0VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zYWZlX2xvY2snKTtcblx0cmVzRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yaWVudGF0aW9uIC5yZXNwIC52YWx1ZScpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtb3JpZW50YXRpb24nLCBmdW5jdGlvbigpe1xuXHRcdG9yaWVudGF0aW9uRW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcblx0XHRvcmllbnRhdGlvbkVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcdFxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59OyIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgdXNlcm1lZGlhRW5hYmxlID0gZmFsc2UsXG5cdHVzZXJtZWRpYUVsdCA9IG51bGw7XG5cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCl7XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBmdW5jdGlvbihtc2cpe1xuXHRcdGlmICh1c2VybWVkaWFFbmFibGUgJiYgbXNnLnR5cGUgPT09ICd1c2VybWVkaWEnKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwaG90b1N0cmVhbScpLnNldEF0dHJpYnV0ZSgnc3JjJywgbXNnLnZhbHVlKTtcblx0XHR9XG5cdH0pO1xuXHR1c2VybWVkaWFFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlcm1lZGlhLWJnJyk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC11c2VybWVkaWEnLCBmdW5jdGlvbigpe1xuXHRcdHVzZXJtZWRpYUVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC11c2VybWVkaWEnLCBmdW5jdGlvbigpe1xuXHRcdHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IHZvaWNlRW5hYmxlID0gZmFsc2U7XG5cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCl7XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBmdW5jdGlvbihtc2cpe1xuXHRcdGlmICh2b2ljZUVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ3ZvaWNlJyl7XG5cdFx0XHRpZiAobXNnLnZhbHVlID09PSAnbmV4dCcpe1xuXHRcdFx0XHRSZXZlYWwubmV4dCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdFxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LXdlYnNwZWVjaCcsIGZ1bmN0aW9uKCl7XG5cdFx0dm9pY2VFbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3Atd2Vic3BlZWNoJywgZnVuY3Rpb24oKXtcblx0XHR2b2ljZUVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iXX0=
