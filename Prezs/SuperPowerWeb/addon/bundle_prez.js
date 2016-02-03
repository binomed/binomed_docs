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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL2F1ZGlvLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L2dhbWUvcHJlel9nYW1lLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3ByZXpfc3VwZXJfcG93ZXIuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy9kZXZpY2Vtb3Rpb24uanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy9saWdodC5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9zZW5zb3JzL29yaWVudGF0aW9uLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvdXNlcm1lZGlhLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvdm9pY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRyZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxuXHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjgwMDBcIil7XG5cdFx0cmV0dXJuIFwiaHR0cHM6Ly9iaW5vbWVkLmZyOjgwMDBcIjtcblx0fWVsc2V7XG5cdFx0cmV0dXJuIG51bGw7XHRcblx0fSBcbn1cblxudmFyIGFkZHJlc3MgPSBjYWxjdWxhdGVBZGRyZXNzKCk7XG52YXIgbG9jYWwgPSBsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkcmVzcyA6IGFkZHJlc3MsXG5cdGxvY2FsIDogbG9jYWxcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbnRleHQgPSBudWxsLFxuXHRQVUJMSUMgPSAxLFxuXHRXQUlUID0gMixcblx0UkVTUCA9IDMsXG5cdHB1YmxpY0J1ZmZlciA9IG51bGwsXG5cdHdhaXRCdWZmZXIgPSBudWxsLFxuXHRyZXNwQnVmZmVyID0gbnVsbCxcblx0Y3VycmVudFNvdXJjZSA9IG51bGw7XG5cbnRyeXtcblx0d2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblx0Y29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbn1jYXRjaChlKXtcblx0Y29udGV4dCA9IG51bGw7XG5cdGNvbnNvbGUubG9nKFwiTm8gV2ViQVBJIGRlY3RlY3RcIik7XG59XG5cbmZ1bmN0aW9uIGxvYWRTb3VuZCh1cmwsIGJ1ZmZlclRvVXNlKXtcblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXHRyZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cblx0Ly8gRGVjb2RlIGFzeW5jaHJvbm91c2x5XG5cdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0Y29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0XHRpZiAoYnVmZmVyVG9Vc2UgPT09IFBVQkxJQyl7XG5cdFx0ICBcdFx0cHVibGljQnVmZmVyID0gYnVmZmVyO1xuXHRcdFx0fWVsc2UgaWYgKGJ1ZmZlclRvVXNlID09PSBXQUlUKXtcblx0XHQgIFx0XHR3YWl0QnVmZmVyID0gYnVmZmVyO1xuXHRcdFx0fWVsc2UgaWYgKGJ1ZmZlclRvVXNlID09PSBSRVNQKXtcblx0XHQgIFx0XHRyZXNwQnVmZmVyID0gYnVmZmVyO1xuXHRcdFx0fVxuXHRcdH0sIGZ1bmN0aW9uKGUpe1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGRlY29kaW5nIGZpbGUnLCBlKTtcblx0XHR9KTtcblx0fVxuXHRyZXF1ZXN0LnNlbmQoKTtcbn1cblxuZnVuY3Rpb24gbG9hZFB1YmxpY1NvdW5kKCl7XG5cdGlmKGNvbnRleHQpXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9xdWVzdGlvbl9wdWJsaWNfY291cnRlLm1wM1wiLCBQVUJMSUMpO1xufVxuXG5mdW5jdGlvbiBsb2FkV2FpdFNvdW5kKCl7XG5cdGlmIChjb250ZXh0KVxuXHRcdGxvYWRTb3VuZChcImFzc2V0cy9zb3VuZHMvYXR0ZW50ZV9yZXBvbnNlX2NvdXJ0ZS5tcDNcIiwgV0FJVCk7XG59XG5cbmZ1bmN0aW9uIGxvYWRSZXNwU291bmQoKXtcblx0aWYgKGNvbnRleHQpXG5cdFx0bG9hZFNvdW5kKFwiYXNzZXRzL3NvdW5kcy9ib25uZV9yZXBvbnNlLm1wM1wiLCBSRVNQKTtcbn1cblxuZnVuY3Rpb24gcGxheVNvdW5kKGJ1ZmZlcil7XG5cdHZhciBzb3VyY2UgPSBjb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpOyAvLyBjcmVhdGVzIGEgc291bmQgc291cmNlXG5cdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7ICAgICAgICAgICAgICAgICAgICAvLyB0ZWxsIHRoZSBzb3VyY2Ugd2hpY2ggc291bmQgdG8gcGxheVxuXHRzb3VyY2UuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKTsgICAgICAgLy8gY29ubmVjdCB0aGUgc291cmNlIHRvIHRoZSBjb250ZXh0J3MgZGVzdGluYXRpb24gKHRoZSBzcGVha2Vycylcblx0c291cmNlLnN0YXJ0KDApOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBsYXkgdGhlIHNvdXJjZSBub3dcblx0cmV0dXJuIHNvdXJjZTtcbn1cblxubG9hZFB1YmxpY1NvdW5kKCk7XG5sb2FkV2FpdFNvdW5kKCk7XG5sb2FkUmVzcFNvdW5kKCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIEFwaXMgZXhwb3NlZFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiovXG5cbmZ1bmN0aW9uIHBsYXlQdWJsaWMoKXtcblx0aWYgKGNvbnRleHQpe1xuXHRcdHN0b3AoKTtcblx0XHRjdXJyZW50U291cmNlID0gcGxheVNvdW5kKHB1YmxpY0J1ZmZlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGxheVdhaXQoKXtcblx0aWYgKGNvbnRleHQpe1xuXHRcdHN0b3AoKTtcblx0XHRjdXJyZW50U291cmNlID0gcGxheVNvdW5kKHdhaXRCdWZmZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBsYXlSZXNwKCl7XG5cdGlmIChjb250ZXh0KXtcblx0XHRzdG9wKCk7XG5cdFx0Y3VycmVudFNvdXJjZSA9IHBsYXlTb3VuZChyZXNwQnVmZmVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdG9wKCl7XG5cdGlmIChjdXJyZW50U291cmNlICYmIGN1cnJlbnRTb3VyY2Uuc3RvcCl7XG5cdFx0Y3VycmVudFNvdXJjZS5zdG9wKDApO1xuXHR9XG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cGxheVB1YmxpYyA6IHBsYXlQdWJsaWMsXG5cdHBsYXlXYWl0IDogcGxheVdhaXQsXG5cdHBsYXlSZXNwIDogcGxheVJlc3AsXG5cdHN0b3AgOiBzdG9wXG59IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcvY29uZmlnJyksXG5cdGF1ZGlvID0gcmVxdWlyZSgnLi9hdWRpbycpLFxuXHRzb2NrZXQgPSBudWxsLFxuXHRzY29yZUluZGV4ID0ge307XG5cblxuXG5mdW5jdGlvbiBoaWRlUXVlc3Rpb24oKXtcdFxuXHRhdWRpby5zdG9wKCk7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdoaWRlUXVlc3Rpb24nXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VRdWVzdGlvbihpbmRleCl7XG5cdGF1ZGlvLnBsYXlQdWJsaWMoKTtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ2NoYW5nZVF1ZXN0aW9uJyxcblx0XHQnaW5kZXgnIDogaW5kZXgsXG5cdFx0cmVwQSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBBYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQmApLmlubmVySFRNTCxcblx0XHRyZXBDIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcENgKS5pbm5lckhUTUwsXG5cdFx0cmVwRCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBEYCkuaW5uZXJIVE1MLFxuXG5cdH0pO1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnc2hvd05vdGlmaWNhdGlvbidcdFx0XG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NTY29yZShpbmRleCl7XG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICBoZWFkZXJzOiBteUhlYWRlcnMsXG4gICAgICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuXG5cdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtjb25maWcuYWRkcmVzc30vc2NvcmUvJHtpbmRleH1gLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdGF1ZGlvLnBsYXlXYWl0KCk7XG5cdFx0Ly8gT24gbmUgcmV0cmFpcmUgcGFzIHVuZSBxdWVzdGlvbiBkw6lqw6AgdHJhaXTDqWVcblx0XHRpZiAoc2NvcmVJbmRleFtgcXVlc3Rpb25fJHtpbmRleH1gXSl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdGxldCB0b3RhbCA9IGpzb24ucmVwQSArIGpzb24ucmVwQiArIGpzb24ucmVwQyArIGpzb24ucmVwRDtcblx0XHR2YXIgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGNoYXJ0X3F1ZXN0aW9uXyR7aW5kZXh9YCkuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0ICAgIGxhYmVsczogW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiXSxcblx0XHQgICAgZGF0YXNldHM6IFtcblx0XHQgICAgICAgIHtcblx0XHQgICAgICAgICAgICBsYWJlbDogXCJBXCIsXG5cdFx0ICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC41KVwiLFxuXHRcdCAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC44KVwiLFxuXHRcdCAgICAgICAgICAgIGhpZ2hsaWdodEZpbGw6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjc1KVwiLFxuXHRcdCAgICAgICAgICAgIGhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDIyMCwyMjAsMjIwLDEpXCIsXG5cdFx0ICAgICAgICAgICAgZGF0YTogW01hdGgucm91bmQoKGpzb24ucmVwQSAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEIgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBDIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwRCAvIHRvdGFsKSAqIDEwMCldXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIF1cblx0XHR9O1xuXHRcdHZhciBteUJhckNoYXJ0ID0gbmV3IENoYXJ0KGN0eCkuQmFyKGRhdGEsIHtcblx0XHRcdCAvL0Jvb2xlYW4gLSBXaGV0aGVyIGdyaWQgbGluZXMgYXJlIHNob3duIGFjcm9zcyB0aGUgY2hhcnRcblx0ICAgIFx0c2NhbGVTaG93R3JpZExpbmVzIDogZmFsc2UsXG5cdCAgICBcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgY29sb3VyXG5cdCAgICBcdHNjYWxlRm9udENvbG9yOiBcIm9yYW5nZVwiLFxuXHRcdH0pO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGF1ZGlvLnBsYXlSZXNwKCk7XG5cdFx0XHRsZXQgZ29vZEFuc3dlckVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXJlc3AtcXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLmdvb2RgKTtcblx0XHRcdGxldCBhbndzZXIgPSBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQScpID8gJ0EnIDpcblx0XHRcdFx0XHRcdCBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQicpID8gJ0InIDpcblx0XHRcdFx0XHRcdCBnb29kQW5zd2VyRWx0LmNsYXNzTGlzdC5jb250YWlucygncmVwQycpID8gJ0MnIDogJ0QnO1xuXHRcdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdFx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdFx0XHRldmVudFR5cGUgOiAnYW5zd2VyJyxcblx0XHRcdFx0dmFsdWUgOiBhbndzZXJcblx0XHRcdH0pO1x0XHRcdCBcblx0XHRcdGdvb2RBbnN3ZXJFbHQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdH0sIDUwMDApO1xuXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblx0aGlkZVF1ZXN0aW9uKCk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDEpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0cHJvY2Vzc1Njb3JlKDEpO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMicsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMik7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0yJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMik7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVpdC1xdWVzdGlvbicsIGhpZGVRdWVzdGlvbik7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy9jb25maWcnKTtcblxuZnVuY3Rpb24gcG9zdFByb2RDb2RlSGlsaWdodCgpe1xuXHR2YXIgYXJyYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdjb2RlLnRvSGlsaWdodCcpO1xuXHRmb3IgKHZhciBpID0wOyBpIDxhcnJheS5sZW5ndGg7IGkrKyl7XG5cdFx0dmFyIGxlbmd0aCA9IDA7XG5cdFx0dmFyIHRleHRDb2RlID0gYXJyYXlbaV0uaW5uZXJIVE1MO1xuXHRcdGRve1xuXHRcdFx0bGVuZ3RoID0gdGV4dENvZGUubGVuZ3RoO1xuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7bWFyayZndDsnLCAnPG1hcms+Jyk7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrIGNsYXNzPVwiZGlsbHVhdGVcIiZndDsnLCAnPG1hcmsgY2xhc3M9XCJkaWxsdWF0ZVwiPicpO1xuXHRcdFx0dGV4dENvZGUgPSB0ZXh0Q29kZS5yZXBsYWNlKCcmbHQ7L21hcmsmZ3Q7JywgJzwvbWFyaz4nKTtcblx0XHR9d2hpbGUobGVuZ3RoICE9IHRleHRDb2RlLmxlbmd0aCk7XG5cdFx0YXJyYXlbaV0uaW5uZXJIVE1MID0gdGV4dENvZGU7XG5cblx0fVxufVxuXG5SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3JlYWR5JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIC8vIGV2ZW50LmN1cnJlbnRTbGlkZSwgZXZlbnQuaW5kZXhoLCBldmVudC5pbmRleHZcblx0XG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgXHRwb3N0UHJvZENvZGVIaWxpZ2h0KCk7XG5cdH0sIDUwMCk7XG5cdFx0XG5cdFxuXHRpZiAoaW8gJiYgY29uZmlnLmFkZHJlc3Mpe1xuXHRcdGxldCBzb2NrZXRHYW1lID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XG5cdFx0cmVxdWlyZSgnLi9nYW1lL3ByZXpfZ2FtZScpLmluaXQoc29ja2V0R2FtZSk7XG5cdFx0bGV0IHNvY2tldFByZXogPSBudWxsO1xuXHRcdGlmIChjb25maWcubG9jYWwpe1xuXHRcdFx0c29ja2V0UHJleiA9IHNvY2tldEdhbWU7ICAgXG5cdFx0fWVsc2V7XG5cdFx0XHRzb2NrZXRQcmV6ID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XG5cdFx0fVxuIFxuIFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL2xpZ2h0JykuaW5pdChzb2NrZXRQcmV6KTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9vcmllbnRhdGlvbicpLmluaXQoc29ja2V0UHJleik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvZGV2aWNlbW90aW9uJykuaW5pdChzb2NrZXRQcmV6KTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLmluaXQoc29ja2V0UHJleik7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvdXNlcm1lZGlhJykuaW5pdChzb2NrZXRQcmV6KTtcbiBcdFx0XHRcbiBcdFx0fSwgMTAwMCk7XG5cdH1cdFxuIFxuXHRcbn0gKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgbW90aW9uRW5hYmxlID0gZmFsc2UsXG5cdG1vdGlvbkVsdCA9IG51bGwsXG5cdGJhdHRlcnkxRWx0ID0gbnVsbCxcblx0YmF0dGVyeTJFbHQgPSBudWxsLFxuXHRjaGFyZ2VCYXR0ZXJ5MSA9IDAsXG5cdGNoYXJnZUJhdHRlcnkyID0gMCxcblx0d2lubmVyID0gbnVsbCxcblx0ZnVsbFZhbHVlMSA9IDEwMDAwLFxuXHRmdWxsVmFsdWUyID0gMTAwMDAsXG5cdG1hcFVzZXJzQWN0aXYgPSB7fTtcblxuXG5cblxuZnVuY3Rpb24gYmF0VXBkYXRlKHRlYW0sIGNoYXJnZSkge1xuXHRsZXQgY29sID0gW10sXG5cdGVsdCA9IG51bGw7XG4gIGlmICh0ZWFtID09PSBcIjFcIikge1xuICBcdGVsdCA9IGJhdHRlcnkxRWx0O1xuICAgIC8vIFJlZCAtIERhbmdlciFcbiAgICBjb2wgPSBbXCIjNzUwOTAwXCIsIFwiI2M2NDYyYlwiLCBcIiNiNzQ0MjRcIiwgXCIjZGYwYTAwXCIsIFwiIzU5MDcwMFwiXTtcbiAgfSAvKmVsc2UgaWYgKGNoYXJnZSA8IDQwKSB7XG4gICAgLy8gWWVsbG93IC0gTWlnaHQgd2FubmEgY2hhcmdlIHNvb24uLi5cbiAgICBjb2wgPSBbXCIjNzU0ZjAwXCIsIFwiI2YyYmIwMFwiLCBcIiNkYmIzMDBcIiwgXCIjZGY4ZjAwXCIsIFwiIzU5M2MwMFwiXTtcbiAgfSAqL2Vsc2Uge1xuICBcdGVsdCA9IGJhdHRlcnkyRWx0O1xuICAgIC8vIEdyZWVuIC0gQWxsIGdvb2QhXG4gICAgY29sID0gW1wiIzMxNmQwOFwiLCBcIiM2MGI5MzlcIiwgXCIjNTFhYTMxXCIsIFwiIzY0Y2UxMVwiLCBcIiMyNTU0MDVcIl07XG4gIH1cbiAgZWx0LnN0eWxlW1wiYmFja2dyb3VuZC1pbWFnZVwiXSA9IFwibGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCB0cmFuc3BhcmVudCA1JSwgXCIgKyBjb2xbMF0gKyBcIiA1JSwgXCIgKyBjb2xbMF0gKyBcIiA3JSwgXCIgKyBjb2xbMV0gKyBcIiA4JSwgXCIgKyBjb2xbMV0gKyBcIiAxMCUsIFwiICsgY29sWzJdICsgXCIgMTElLCBcIiArIGNvbFsyXSArIFwiIFwiICsgKGNoYXJnZSAtIDMpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgKGNoYXJnZSAtIDIpICsgXCIlLCBcIiArIGNvbFszXSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBcIiArIGNvbFs0XSArIFwiIFwiICsgY2hhcmdlICsgXCIlLCBibGFjayBcIiArIChjaGFyZ2UgKyA1KSArIFwiJSwgYmxhY2sgOTUlLCB0cmFuc3BhcmVudCA5NSUpLCBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSkgMCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA0JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDclLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuOCkgMTQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDAlLCByZ2JhKDI1NSwyNTUsMjU1LDApIDQxJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA4MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC40KSA4NiUsIHJnYmEoMjU1LDI1NSwyNTUsMC42KSA5MCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5MiUsIHJnYmEoMjU1LDI1NSwyNTUsMC4xKSA5NSUsIHJnYmEoMjU1LDI1NSwyNTUsMC41KSA5OCUpXCI7XG59XG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQpe1xuXG5cdHNvY2tldC5vbignc2Vuc29yJywgZnVuY3Rpb24obXNnKXtcblx0XHRpZiAobW90aW9uRW5hYmxlICYmIG1zZy50eXBlID09PSAnZGV2aWNlbW90aW9uJyl7XG5cdFx0XHRpZiAoIXdpbm5lciAmJiBtc2cudGVhbSl7XG5cdFx0XHRcdGxldCB0bXBVc2VyVGVhbSA9IG1hcFVzZXJzQWN0aXZbbXNnLmlkXTtcblx0XHRcdFx0aWYgKCF0bXBVc2VyVGVhbSl7XG5cdFx0XHRcdFx0bWFwVXNlcnNBY3Rpdlttc2cuaWRdID0gbXNnLnRlYW07XG5cdFx0XHRcdFx0aWYgKG1zZy50ZWFtID09PSBcIjFcIil7XG5cdFx0XHRcdFx0XHRmdWxsVmFsdWUxKz0gMTAwMDA7XG5cdFx0XHRcdFx0fWVsc2UgaWYgKG1zZy50ZWFtID09PSBcIjJcIil7XG5cdFx0XHRcdFx0XHRmdWxsVmFsdWUyKz0gMTAwMDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XHRcdFx0XHRcblx0XHRcdFx0bGV0IHBlcmNlbnQgPSAwO1xuXHRcdFx0XHRpZiAobXNnLnRlYW0gPT09IFwiMVwiKXtcblx0XHRcdFx0XHRjaGFyZ2VCYXR0ZXJ5MSs9IG1zZy52YWx1ZTtcblx0XHRcdFx0XHRwZXJjZW50ID0gTWF0aC5yb3VuZCgoY2hhcmdlQmF0dGVyeTEgLyBmdWxsVmFsdWUxKSAqMTAwKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0Y2hhcmdlQmF0dGVyeTIrPSBtc2cudmFsdWU7XG5cdFx0XHRcdFx0cGVyY2VudCA9IE1hdGgucm91bmQoKGNoYXJnZUJhdHRlcnkyIC8gZnVsbFZhbHVlMikgKjEwMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXRVcGRhdGUobXNnLnRlYW0sIE1hdGgubWluKHBlcmNlbnQsOTApKTtcblx0XHRcdFx0aWYgKCF3aW5uZXIgJiYgTWF0aC5taW4ocGVyY2VudCw5MCkgPT09IDkwKXtcblx0XHRcdFx0XHR3aW5uZXIgPSB0cnVlO1xuXHRcdFx0XHRcdGlmIChtc2cudGVhbSA9PT0gXCIxXCIpe1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldmljZW1vdGlvbiAud2luLmZpcmVmb3gnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXZpY2Vtb3Rpb24gLndpbi5jaHJvbWUnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdH1cblx0fSk7XG5cdGJhdHRlcnkxRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhdHRlcnktMScpO1xuXHRiYXR0ZXJ5MkVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTInKTtcblxuXHRiYXRVcGRhdGUoXCIxXCIsMCk7XG5cdGJhdFVwZGF0ZShcIjJcIiwwKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LWRldmljZW1vdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcblx0XHRcdHR5cGU6XCJnYW1lXCIsXG5cdFx0XHRldmVudFR5cGU6XCJiYXR0ZXJ5XCIsIFxuXHRcdFx0c2hvdzp0cnVlXG5cdFx0fSk7XG5cdFx0bW90aW9uRW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLWRldmljZW1vdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcblx0XHRcdHR5cGU6XCJnYW1lXCIsXG5cdFx0XHRldmVudFR5cGU6XCJiYXR0ZXJ5XCIsIFxuXHRcdFx0c2hvdzpmYWxzZVxuXHRcdH0pO1xuXHRcdG1vdGlvbkVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IGxpZ2h0RW5hYmxlID0gZmFsc2UsXG5cdGxpZ2h0RWx0ID0gbnVsbDtcblxuXG4vLyBXZSB1cGRhdGUgdGhlIGNzcyBTdHlsZVxuZnVuY3Rpb24gdXBkYXRlTGlnaHQoZGF0YSl7XG5cdGxldCBwcmVmaXhMaWdodCA9ICctd2Via2l0LSc7XG5cdGxldCBwZXJjZW50ID0gZGF0YTtcblx0dmFyIHN0eWxlID0gcHJlZml4TGlnaHQrJ3JhZGlhbC1ncmFkaWVudChjZW50ZXIsICdcblx0ICAgICsnIGVsbGlwc2UgY292ZXIsICdcblx0ICAgICsnIHJnYmEoMTk4LDE5NywxNDUsMSkgMCUsJ1xuXHQgICAgKycgcmdiYSgwLDAsMCwxKSAnK3BlcmNlbnQrJyUpJ1xuXHQgICAgO1xuXHRsaWdodEVsdC5zdHlsZS5iYWNrZ3JvdW5kID0gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0KXtcblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGZ1bmN0aW9uKG1zZyl7XG5cdFx0aWYgKGxpZ2h0RW5hYmxlICYmIG1zZy50eXBlID09PSAnbGlnaHQnKXtcblx0XHRcdHVwZGF0ZUxpZ2h0KG1zZy52YWx1ZSk7XG5cdFx0fVxuXHR9KTtcblx0bGlnaHRFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlnaHQtYmcnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LWxpZ2h0JywgZnVuY3Rpb24oKXtcblx0XHRsaWdodEVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1saWdodCcsIGZ1bmN0aW9uKCl7XG5cdFx0bGlnaHRFbmFibGUgPSBmYWxzZTtcblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBvcmllbnRhdGlvbkVuYWJsZSA9IGZhbHNlLCBcblx0bG9ja0VsdCA9IG51bGwsXG5cdHJlc0VsdCA9IG51bGwsXG5cdG9wZW4gPSBmYWxzZTtcblxuY29uc3QgdmFsdWVzID0geyBmaXJzdCA6IHt2YWx1ZTogNTAsIGZvdW5kOiBmYWxzZX0sIFxuXHRcdFx0XHRzZWNvbmQgOiB7dmFsdWU6IDgwLCBmb3VuZDogZmFsc2V9LCBcblx0XHRcdFx0dGhpcmQgOiB7dmFsdWUgOiAxMCwgZm91bmQgOiBmYWxzZX1cblx0XHRcdH07XG5cblxuLy8gQWNjb3JkaW5nIHRvIHRoZSBudW1iZXIgb2YgdW5sb2NrLCB3ZSBqdXN0IHR1cm4gdGhlIGltYWdlIG9yIHdlIG9wZW4gdGhlIGRvb3JcbmZ1bmN0aW9uIHVwZGF0ZVJvdGF0aW9uKHpBbHBoYSwgZmlyc3RWYWx1ZSl7XG5cdGlmICghb3Blbil7XG5cdFx0bGV0IGRlbHRhID0gZmlyc3RWYWx1ZSAtIHpBbHBoYTtcblx0XHRsZXQgcm90YXRpb24gPSBkZWx0YTtcblx0XHRpZiAoZGVsdGEgPCAwKXtcblx0XHRcdHJvdGF0aW9uID0gZmlyc3RWYWx1ZSszNjAtekFscGhhO1xuXHRcdH1cdFx0XG5cdFx0bG9ja0VsdC5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWignK3JvdGF0aW9uKydkZWcpJztcblxuXHRcdGxldCBjdXJyZW50VmFsdWUgPSAxMDAgLSBNYXRoLnJvdW5kKChyb3RhdGlvbioxMDApLzM2MCk7XG5cdFx0cmVzRWx0LmlubmVySFRNTCA9IGN1cnJlbnRWYWx1ZTtcblx0XHRpZiAodmFsdWVzLmZpcnN0LmZvdW5kIFxuXHRcdFx0JiYgdmFsdWVzLnNlY29uZC5mb3VuZFxuXHRcdFx0JiYgdmFsdWVzLnRoaXJkLmZvdW5kKXtcdFx0XHRcblx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uJykuY2xhc3NMaXN0LmFkZChcIm9wZW5cIik7XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMuZmlyc3QuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5maXJzdC52YWx1ZSl7XHRcdFx0XHRcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5maXJzdCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLmZpcnN0LmZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy5zZWNvbmQuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5zZWNvbmQudmFsdWUpe1xuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLnNlY29uZCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLnNlY29uZC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMudGhpcmQuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy50aGlyZC52YWx1ZSl7XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAudGhpcmQnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy50aGlyZC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCl7XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBmdW5jdGlvbihtc2cpe1xuXHRcdGlmIChvcmllbnRhdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ29yaWVudGF0aW9uJyl7XG5cdFx0XHR1cGRhdGVSb3RhdGlvbihtc2cudmFsdWUsIG1zZy5maXJzdFZhbHVlKTtcblx0XHR9XG5cdH0pO1xuXG5cdGxvY2tFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2FmZV9sb2NrJyk7XG5cdHJlc0VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmllbnRhdGlvbiAucmVzcCAudmFsdWUnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcblx0XHRvcmllbnRhdGlvbkVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1vcmllbnRhdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0b3JpZW50YXRpb25FbmFibGUgPSBmYWxzZTtcblx0fSk7XHRcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufTsiLCIndXNlIHN0cmljdCdcblxubGV0IHVzZXJtZWRpYUVuYWJsZSA9IGZhbHNlLFxuXHR1c2VybWVkaWFFbHQgPSBudWxsO1xuXG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQpe1xuXG5cdHNvY2tldC5vbignc2Vuc29yJywgZnVuY3Rpb24obXNnKXtcblx0XHRpZiAodXNlcm1lZGlhRW5hYmxlICYmIG1zZy50eXBlID09PSAndXNlcm1lZGlhJyl7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGhvdG9TdHJlYW0nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsIG1zZy52YWx1ZSk7XG5cdFx0fVxuXHR9KTtcblx0dXNlcm1lZGlhRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJtZWRpYS1iZycpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtdXNlcm1lZGlhJywgZnVuY3Rpb24oKXtcblx0XHR1c2VybWVkaWFFbmFibGUgPSB0cnVlO1xuXHR9KTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0b3AtdXNlcm1lZGlhJywgZnVuY3Rpb24oKXtcblx0XHR1c2VybWVkaWFFbmFibGUgPSBmYWxzZTtcblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCB2b2ljZUVuYWJsZSA9IGZhbHNlO1xuXG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQpe1xuXG5cdHNvY2tldC5vbignc2Vuc29yJywgZnVuY3Rpb24obXNnKXtcblx0XHRpZiAodm9pY2VFbmFibGUgJiYgbXNnLnR5cGUgPT09ICd2b2ljZScpe1xuXHRcdFx0aWYgKG1zZy52YWx1ZSA9PT0gJ25leHQnKXtcblx0XHRcdFx0UmV2ZWFsLm5leHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXHRcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdGFydC13ZWJzcGVlY2gnLCBmdW5jdGlvbigpe1xuXHRcdHZvaWNlRW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLXdlYnNwZWVjaCcsIGZ1bmN0aW9uKCl7XG5cdFx0dm9pY2VFbmFibGUgPSBmYWxzZTtcblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59Il19
