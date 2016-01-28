(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3000")){
		return "http://localhost:8000"
	}else if (location.port && location.port === "8000"){
		return "http://jef.binomed.fr:8000";
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

var config = require('../config/config'),
	socket = null,
	scoreIndex = {};



function hideQuestion(){	
	socket.emit('config',{
		type : 'game',
		eventType : 'hideQuestion'
	});
}

function changeQuestion(index){
	socket.emit('config',{
		type : 'game',
		eventType : 'changeQuestion',
		'index' : index,
		repA : document.querySelector(`[data-state=question-${index}] .resp.repA`).innerHTML,
		repB : document.querySelector(`[data-state=question-${index}] .resp.repB`).innerHTML,
		repC : document.querySelector(`[data-state=question-${index}] .resp.repC`).innerHTML,
		repD : document.querySelector(`[data-state=question-${index}] .resp.repD`).innerHTML,

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
			document.querySelector(`[data-state=resp-question-${index}] .resp.good`).classList.add('show');
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
	Reveal.addEventListener('quit-question', hideQuestion);

}

module.exports = {
	init : init
}
},{"../config/config":1}],3:[function(require,module,exports){
'use strict'

var config = require('./config/config');

Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
	


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
 			
 		}, 1000);
	}	
 
	
} );

},{"./config/config":1,"./game/prez_game":2,"./sensors/devicemotion":4,"./sensors/light":5,"./sensors/orientation":6}],4:[function(require,module,exports){
'use strict'

let motionEnable = false,
	motionElt = null,
	battery1Elt = null,
	battery2Elt = null,
	chargeBattery1 = 0,
	chargeBattery2 = 0,
	winner = null;

const fullValue = 10000;


function batUpdate(team, charge) {
	let col = [],
	elt = null;
  //console.log("Charge: ",charge);
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
				let percent = 0;
				if (msg.team === "1"){
					chargeBattery1+= msg.value;
					percent = Math.round((chargeBattery1 / fullValue) *100);
				}else{
					chargeBattery2+= msg.value;
					percent = Math.round((chargeBattery2 / fullValue) *100);
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL3ByZXpfZ2FtZS5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9wcmV6X3N1cGVyX3Bvd2VyLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvZGV2aWNlbW90aW9uLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvbGlnaHQuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovc2Vuc29ycy9vcmllbnRhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRyZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxuXHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjgwMDBcIil7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2plZi5iaW5vbWVkLmZyOjgwMDBcIjtcblx0fWVsc2V7XG5cdFx0cmV0dXJuIG51bGw7XHRcblx0fSBcbn1cblxudmFyIGFkZHJlc3MgPSBjYWxjdWxhdGVBZGRyZXNzKCk7XG52YXIgbG9jYWwgPSBsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkcmVzcyA6IGFkZHJlc3MsXG5cdGxvY2FsIDogbG9jYWxcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZy9jb25maWcnKSxcblx0c29ja2V0ID0gbnVsbCxcblx0c2NvcmVJbmRleCA9IHt9O1xuXG5cblxuZnVuY3Rpb24gaGlkZVF1ZXN0aW9uKCl7XHRcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ2hpZGVRdWVzdGlvbidcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZVF1ZXN0aW9uKGluZGV4KXtcblx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0ZXZlbnRUeXBlIDogJ2NoYW5nZVF1ZXN0aW9uJyxcblx0XHQnaW5kZXgnIDogaW5kZXgsXG5cdFx0cmVwQSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBBYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQmApLmlubmVySFRNTCxcblx0XHRyZXBDIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcENgKS5pbm5lckhUTUwsXG5cdFx0cmVwRCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBEYCkuaW5uZXJIVE1MLFxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzU2NvcmUoaW5kZXgpe1xuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7Y29uZmlnLmFkZHJlc3N9L3Njb3JlLyR7aW5kZXh9YCxteUluaXQpO1xuXHRmZXRjaChteVJlcXVlc3QpXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihqc29uKXtcblx0XHQvLyBPbiBuZSByZXRyYWlyZSBwYXMgdW5lIHF1ZXN0aW9uIGTDqWrDoCB0cmFpdMOpZVxuXHRcdGlmIChzY29yZUluZGV4W2BxdWVzdGlvbl8ke2luZGV4fWBdKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0bGV0IHRvdGFsID0ganNvbi5yZXBBICsganNvbi5yZXBCICsganNvbi5yZXBDICsganNvbi5yZXBEO1xuXHRcdHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY2hhcnRfcXVlc3Rpb25fJHtpbmRleH1gKS5nZXRDb250ZXh0KFwiMmRcIik7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHQgICAgbGFiZWxzOiBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCJdLFxuXHRcdCAgICBkYXRhc2V0czogW1xuXHRcdCAgICAgICAge1xuXHRcdCAgICAgICAgICAgIGxhYmVsOiBcIkFcIixcblx0XHQgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjUpXCIsXG5cdFx0ICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjgpXCIsXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0RmlsbDogXCJyZ2JhKDIyMCwyMjAsMjIwLDAuNzUpXCIsXG5cdFx0ICAgICAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcblx0XHQgICAgICAgICAgICBkYXRhOiBbTWF0aC5yb3VuZCgoanNvbi5yZXBBIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwQiAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEMgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBEIC8gdG90YWwpICogMTAwKV1cblx0XHQgICAgICAgIH1cblx0XHQgICAgXVxuXHRcdH07XG5cdFx0dmFyIG15QmFyQ2hhcnQgPSBuZXcgQ2hhcnQoY3R4KS5CYXIoZGF0YSwge1xuXHRcdFx0IC8vQm9vbGVhbiAtIFdoZXRoZXIgZ3JpZCBsaW5lcyBhcmUgc2hvd24gYWNyb3NzIHRoZSBjaGFydFxuXHQgICAgXHRzY2FsZVNob3dHcmlkTGluZXMgOiBmYWxzZSxcblx0ICAgIFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBjb2xvdXJcblx0ICAgIFx0c2NhbGVGb250Q29sb3I6IFwib3JhbmdlXCIsXG5cdFx0fSk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cmVzcC1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AuZ29vZGApLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHR9LCA1MDAwKTtcblxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldFRvU2V0KXtcblx0c29ja2V0ID0gc29ja2V0VG9TZXQ7XG5cdGhpZGVRdWVzdGlvbigpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWVzdGlvbi0xJywgZnVuY3Rpb24oKXtcblx0XHRjaGFuZ2VRdWVzdGlvbigxKTtcblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZXNwLXF1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVRdWVzdGlvbigpO1xuXHRcdHByb2Nlc3NTY29yZSgxKTtcblxuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1aXQtcXVlc3Rpb24nLCBoaWRlUXVlc3Rpb24pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcvY29uZmlnJyk7XG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVhZHknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgLy8gZXZlbnQuY3VycmVudFNsaWRlLCBldmVudC5pbmRleGgsIGV2ZW50LmluZGV4dlxuXHRcblxuXG5cdGlmIChpbyAmJiBjb25maWcuYWRkcmVzcyl7XG5cdFx0bGV0IHNvY2tldEdhbWUgPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHRyZXF1aXJlKCcuL2dhbWUvcHJlel9nYW1lJykuaW5pdChzb2NrZXRHYW1lKTtcblx0XHRsZXQgc29ja2V0UHJleiA9IG51bGw7XG5cdFx0aWYgKGNvbmZpZy5sb2NhbCl7XG5cdFx0XHRzb2NrZXRQcmV6ID0gc29ja2V0R2FtZTsgICBcblx0XHR9ZWxzZXtcblx0XHRcdHNvY2tldFByZXogPSBpby5jb25uZWN0KGNvbmZpZy5hZGRyZXNzKTtcblx0XHR9XG4gXG4gXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKS5pbml0KHNvY2tldFByZXopO1xuXHRcdFx0cmVxdWlyZSgnLi9zZW5zb3JzL29yaWVudGF0aW9uJykuaW5pdChzb2NrZXRQcmV6KTtcblx0XHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9kZXZpY2Vtb3Rpb24nKS5pbml0KHNvY2tldFByZXopO1xuIFx0XHRcdFxuIFx0XHR9LCAxMDAwKTtcblx0fVx0XG4gXG5cdFxufSApO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBtb3Rpb25FbmFibGUgPSBmYWxzZSxcblx0bW90aW9uRWx0ID0gbnVsbCxcblx0YmF0dGVyeTFFbHQgPSBudWxsLFxuXHRiYXR0ZXJ5MkVsdCA9IG51bGwsXG5cdGNoYXJnZUJhdHRlcnkxID0gMCxcblx0Y2hhcmdlQmF0dGVyeTIgPSAwLFxuXHR3aW5uZXIgPSBudWxsO1xuXG5jb25zdCBmdWxsVmFsdWUgPSAxMDAwMDtcblxuXG5mdW5jdGlvbiBiYXRVcGRhdGUodGVhbSwgY2hhcmdlKSB7XG5cdGxldCBjb2wgPSBbXSxcblx0ZWx0ID0gbnVsbDtcbiAgLy9jb25zb2xlLmxvZyhcIkNoYXJnZTogXCIsY2hhcmdlKTtcbiAgaWYgKHRlYW0gPT09IFwiMVwiKSB7XG4gIFx0ZWx0ID0gYmF0dGVyeTFFbHQ7XG4gICAgLy8gUmVkIC0gRGFuZ2VyIVxuICAgIGNvbCA9IFtcIiM3NTA5MDBcIiwgXCIjYzY0NjJiXCIsIFwiI2I3NDQyNFwiLCBcIiNkZjBhMDBcIiwgXCIjNTkwNzAwXCJdO1xuICB9IC8qZWxzZSBpZiAoY2hhcmdlIDwgNDApIHtcbiAgICAvLyBZZWxsb3cgLSBNaWdodCB3YW5uYSBjaGFyZ2Ugc29vbi4uLlxuICAgIGNvbCA9IFtcIiM3NTRmMDBcIiwgXCIjZjJiYjAwXCIsIFwiI2RiYjMwMFwiLCBcIiNkZjhmMDBcIiwgXCIjNTkzYzAwXCJdO1xuICB9ICovZWxzZSB7XG4gIFx0ZWx0ID0gYmF0dGVyeTJFbHQ7XG4gICAgLy8gR3JlZW4gLSBBbGwgZ29vZCFcbiAgICBjb2wgPSBbXCIjMzE2ZDA4XCIsIFwiIzYwYjkzOVwiLCBcIiM1MWFhMzFcIiwgXCIjNjRjZTExXCIsIFwiIzI1NTQwNVwiXTtcbiAgfVxuICBlbHQuc3R5bGVbXCJiYWNrZ3JvdW5kLWltYWdlXCJdID0gXCJsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHRyYW5zcGFyZW50IDUlLCBcIiArIGNvbFswXSArIFwiIDUlLCBcIiArIGNvbFswXSArIFwiIDclLCBcIiArIGNvbFsxXSArIFwiIDglLCBcIiArIGNvbFsxXSArIFwiIDEwJSwgXCIgKyBjb2xbMl0gKyBcIiAxMSUsIFwiICsgY29sWzJdICsgXCIgXCIgKyAoY2hhcmdlIC0gMykgKyBcIiUsIFwiICsgY29sWzNdICsgXCIgXCIgKyAoY2hhcmdlIC0gMikgKyBcIiUsIFwiICsgY29sWzNdICsgXCIgXCIgKyBjaGFyZ2UgKyBcIiUsIFwiICsgY29sWzRdICsgXCIgXCIgKyBjaGFyZ2UgKyBcIiUsIGJsYWNrIFwiICsgKGNoYXJnZSArIDUpICsgXCIlLCBibGFjayA5NSUsIHRyYW5zcGFyZW50IDk1JSksIGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMjU1LDI1NSwyNTUsMC41KSAwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjQpIDQlLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNyUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSAxNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC44KSAxNCUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0MCUsIHJnYmEoMjU1LDI1NSwyNTUsMCkgNDElLCByZ2JhKDI1NSwyNTUsMjU1LDApIDgwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjIpIDgwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjQpIDg2JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjYpIDkwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjEpIDkyJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjEpIDk1JSwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpIDk4JSlcIjtcbn1cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCl7XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBmdW5jdGlvbihtc2cpe1xuXHRcdGlmIChtb3Rpb25FbmFibGUgJiYgbXNnLnR5cGUgPT09ICdkZXZpY2Vtb3Rpb24nKXtcblx0XHRcdGlmICghd2lubmVyICYmIG1zZy50ZWFtKXtcdFx0XHRcdFxuXHRcdFx0XHRsZXQgcGVyY2VudCA9IDA7XG5cdFx0XHRcdGlmIChtc2cudGVhbSA9PT0gXCIxXCIpe1xuXHRcdFx0XHRcdGNoYXJnZUJhdHRlcnkxKz0gbXNnLnZhbHVlO1xuXHRcdFx0XHRcdHBlcmNlbnQgPSBNYXRoLnJvdW5kKChjaGFyZ2VCYXR0ZXJ5MSAvIGZ1bGxWYWx1ZSkgKjEwMCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGNoYXJnZUJhdHRlcnkyKz0gbXNnLnZhbHVlO1xuXHRcdFx0XHRcdHBlcmNlbnQgPSBNYXRoLnJvdW5kKChjaGFyZ2VCYXR0ZXJ5MiAvIGZ1bGxWYWx1ZSkgKjEwMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXRVcGRhdGUobXNnLnRlYW0sIE1hdGgubWluKHBlcmNlbnQsOTApKTtcblx0XHRcdFx0aWYgKCF3aW5uZXIgJiYgTWF0aC5taW4ocGVyY2VudCw5MCkgPT09IDkwKXtcblx0XHRcdFx0XHR3aW5uZXIgPSB0cnVlO1xuXHRcdFx0XHRcdGlmIChtc2cudGVhbSA9PT0gXCIxXCIpe1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldmljZW1vdGlvbiAud2luLmZpcmVmb3gnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXZpY2Vtb3Rpb24gLndpbi5jaHJvbWUnKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdH1cblx0fSk7XG5cdGJhdHRlcnkxRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhdHRlcnktMScpO1xuXHRiYXR0ZXJ5MkVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYXR0ZXJ5LTInKTtcblxuXHRiYXRVcGRhdGUoXCIxXCIsMCk7XG5cdGJhdFVwZGF0ZShcIjJcIiwwKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LWRldmljZW1vdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcblx0XHRcdHR5cGU6XCJnYW1lXCIsXG5cdFx0XHRldmVudFR5cGU6XCJiYXR0ZXJ5XCIsIFxuXHRcdFx0c2hvdzp0cnVlXG5cdFx0fSk7XG5cdFx0bW90aW9uRW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLWRldmljZW1vdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycsIHtcblx0XHRcdHR5cGU6XCJnYW1lXCIsXG5cdFx0XHRldmVudFR5cGU6XCJiYXR0ZXJ5XCIsIFxuXHRcdFx0c2hvdzpmYWxzZVxuXHRcdH0pO1xuXHRcdG1vdGlvbkVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IGxpZ2h0RW5hYmxlID0gZmFsc2UsXG5cdGxpZ2h0RWx0ID0gbnVsbDtcblxuXG4vLyBXZSB1cGRhdGUgdGhlIGNzcyBTdHlsZVxuZnVuY3Rpb24gdXBkYXRlTGlnaHQoZGF0YSl7XG5cdGxldCBwcmVmaXhMaWdodCA9ICctd2Via2l0LSc7XG5cdGxldCBwZXJjZW50ID0gZGF0YTtcblx0dmFyIHN0eWxlID0gcHJlZml4TGlnaHQrJ3JhZGlhbC1ncmFkaWVudChjZW50ZXIsICdcblx0ICAgICsnIGVsbGlwc2UgY292ZXIsICdcblx0ICAgICsnIHJnYmEoMTk4LDE5NywxNDUsMSkgMCUsJ1xuXHQgICAgKycgcmdiYSgwLDAsMCwxKSAnK3BlcmNlbnQrJyUpJ1xuXHQgICAgO1xuXHRsaWdodEVsdC5zdHlsZS5iYWNrZ3JvdW5kID0gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0KXtcblxuXHRzb2NrZXQub24oJ3NlbnNvcicsIGZ1bmN0aW9uKG1zZyl7XG5cdFx0aWYgKGxpZ2h0RW5hYmxlICYmIG1zZy50eXBlID09PSAnbGlnaHQnKXtcblx0XHRcdHVwZGF0ZUxpZ2h0KG1zZy52YWx1ZSk7XG5cdFx0fVxuXHR9KTtcblx0bGlnaHRFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGlnaHQtYmcnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LWxpZ2h0JywgZnVuY3Rpb24oKXtcblx0XHRsaWdodEVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1saWdodCcsIGZ1bmN0aW9uKCl7XG5cdFx0bGlnaHRFbmFibGUgPSBmYWxzZTtcblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBvcmllbnRhdGlvbkVuYWJsZSA9IGZhbHNlLCBcblx0bG9ja0VsdCA9IG51bGwsXG5cdHJlc0VsdCA9IG51bGwsXG5cdG9wZW4gPSBmYWxzZTtcblxuY29uc3QgdmFsdWVzID0geyBmaXJzdCA6IHt2YWx1ZTogNTAsIGZvdW5kOiBmYWxzZX0sIFxuXHRcdFx0XHRzZWNvbmQgOiB7dmFsdWU6IDgwLCBmb3VuZDogZmFsc2V9LCBcblx0XHRcdFx0dGhpcmQgOiB7dmFsdWUgOiAxMCwgZm91bmQgOiBmYWxzZX1cblx0XHRcdH07XG5cblxuLy8gQWNjb3JkaW5nIHRvIHRoZSBudW1iZXIgb2YgdW5sb2NrLCB3ZSBqdXN0IHR1cm4gdGhlIGltYWdlIG9yIHdlIG9wZW4gdGhlIGRvb3JcbmZ1bmN0aW9uIHVwZGF0ZVJvdGF0aW9uKHpBbHBoYSwgZmlyc3RWYWx1ZSl7XG5cdGlmICghb3Blbil7XG5cdFx0bGV0IGRlbHRhID0gZmlyc3RWYWx1ZSAtIHpBbHBoYTtcblx0XHRsZXQgcm90YXRpb24gPSBkZWx0YTtcblx0XHRpZiAoZGVsdGEgPCAwKXtcblx0XHRcdHJvdGF0aW9uID0gZmlyc3RWYWx1ZSszNjAtekFscGhhO1xuXHRcdH1cdFx0XG5cdFx0bG9ja0VsdC5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWignK3JvdGF0aW9uKydkZWcpJztcblxuXHRcdGxldCBjdXJyZW50VmFsdWUgPSAxMDAgLSBNYXRoLnJvdW5kKChyb3RhdGlvbioxMDApLzM2MCk7XG5cdFx0cmVzRWx0LmlubmVySFRNTCA9IGN1cnJlbnRWYWx1ZTtcblx0XHRpZiAodmFsdWVzLmZpcnN0LmZvdW5kIFxuXHRcdFx0JiYgdmFsdWVzLnNlY29uZC5mb3VuZFxuXHRcdFx0JiYgdmFsdWVzLnRoaXJkLmZvdW5kKXtcdFx0XHRcblx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uJykuY2xhc3NMaXN0LmFkZChcIm9wZW5cIik7XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMuZmlyc3QuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5maXJzdC52YWx1ZSl7XHRcdFx0XHRcblx0XHRcdFx0bGV0IGlFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2Vuc29yRXhhbXBsZSAub3JpZW50YXRpb24gLnJlc3AgLmNoZXZyb25zIC5maXJzdCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLmZpcnN0LmZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9ZWxzZSBpZiAoIXZhbHVlcy5zZWNvbmQuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy5zZWNvbmQudmFsdWUpe1xuXHRcdFx0XHRsZXQgaUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZW5zb3JFeGFtcGxlIC5vcmllbnRhdGlvbiAucmVzcCAuY2hldnJvbnMgLnNlY29uZCcpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS10aW1lcy1jaXJjbGVcIik7XG5cdFx0XHRcdGlFbHQuY2xhc3NMaXN0LmFkZChcImZhLWNoZXZyb24tZG93blwiKTtcblx0XHRcdFx0dmFsdWVzLnNlY29uZC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fWVsc2UgaWYgKCF2YWx1ZXMudGhpcmQuZm91bmQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT09IHZhbHVlcy50aGlyZC52YWx1ZSl7XG5cdFx0XHRcdGxldCBpRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbnNvckV4YW1wbGUgLm9yaWVudGF0aW9uIC5yZXNwIC5jaGV2cm9ucyAudGhpcmQnKTtcblx0XHRcdFx0aUVsdC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuXHRcdFx0XHRpRWx0LmNsYXNzTGlzdC5hZGQoXCJmYS1jaGV2cm9uLWRvd25cIik7XG5cdFx0XHRcdHZhbHVlcy50aGlyZC5mb3VuZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldCl7XG5cblx0c29ja2V0Lm9uKCdzZW5zb3InLCBmdW5jdGlvbihtc2cpe1xuXHRcdGlmIChvcmllbnRhdGlvbkVuYWJsZSAmJiBtc2cudHlwZSA9PT0gJ29yaWVudGF0aW9uJyl7XG5cdFx0XHR1cGRhdGVSb3RhdGlvbihtc2cudmFsdWUsIG1zZy5maXJzdFZhbHVlKTtcblx0XHR9XG5cdH0pO1xuXG5cdGxvY2tFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2FmZV9sb2NrJyk7XG5cdHJlc0VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmllbnRhdGlvbiAucmVzcCAudmFsdWUnKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3N0YXJ0LW9yaWVudGF0aW9uJywgZnVuY3Rpb24oKXtcblx0XHRvcmllbnRhdGlvbkVuYWJsZSA9IHRydWU7XG5cdH0pO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RvcC1vcmllbnRhdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0b3JpZW50YXRpb25FbmFibGUgPSBmYWxzZTtcblx0fSk7XHRcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufTsiXX0=
