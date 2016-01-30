(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
var rvModel = require('../model/rivetsModel'),
	utils = require('../utils/utils'),
	gameModel = require('../model/gameModel'),
	compat = require('../utils/compat'), 	
	questions = require('../questions/questions'),
	shake = require('../shake/shake'),
	visibility = require('../sensors/visibility'),
	socket = null;




function initController(){

	if (!compat()){
		rvModel.hideMessage = true;
		rvModel.showQuestion = false;
		rvModel.notcompatible = true;
		return;
	}


	rvModel.gameQuestion = !localStorage['game'] || localStorage['game'] === "questions";
	rvModel.gameShake = localStorage['game'] === "shake";
	if (rvModel.gameShake){
		rvModel.showChoice = !localStorage['team'];
		rvModel.showPhone = localStorage['team'];
	}
	

	if (location.port && location.port === "3000"){
		socket = io.connect("http://localhost:8000");
	}else{ 
		socket = io.connect("https://binomed.fr:8000");
	}	

	visibility.init(socket);
	questions.init(socket);
	shake.init(socket);
	

}

module.exports = {
	initController : initController
}
},{"../model/gameModel":3,"../model/rivetsModel":4,"../questions/questions":5,"../sensors/visibility":8,"../shake/shake":9,"../utils/compat":10,"../utils/utils":11}],2:[function(require,module,exports){
'use strict'


function pageLoad(){
	rivets.bind(document.querySelector('#content'), require('./model/rivetsModel'));
	
	require('./controler/controller').initController();
}

window.addEventListener('load', pageLoad);


},{"./controler/controller":1,"./model/rivetsModel":4}],3:[function(require,module,exports){
'use strict'

var idUser = localStorage['userId'] ? localStorage['userId'] : 'user'+new Date().getTime();
localStorage['userId'] = idUser;

module.exports = {
	id : idUser,
	allowResp : true
}
},{}],4:[function(require,module,exports){
'use strict'

module.exports = {
	showQuestion : true, 
	hideMessage : true,
	notcompatible : false,
	gameQuestion : true,
	gameShake : false,
	showChoice : true,
	showPhone : false,
	repA : 'reponse A',
	repB : 'reponse B',
	repC : 'reponse C',
	repD : 'reponse D',
	respASelect : false,
	respBSelect : false,
	respCSelect : false,
	respDSelect : false
}
},{}],5:[function(require,module,exports){
'use strict'

let rvModel = require('../model/rivetsModel'),
	gameModel = require('../model/gameModel'),
	vibration = require('../sensors/vibration'),
	socket = null,
	value = null;

function clickResp(event){
 
 	if (!rvModel.hideMessage){
 		return;
 	}
	let elt = event.srcElement;
	let sendMessage = true;
	let type = 'newResp';
	switch (elt.id){
		case "respA":
			value = 'A';
			if (rvModel.respBSelect 
				|| rvModel.respCSelect 
				|| rvModel.respDSelect){
				type = 'reSend';
				rvModel.respASelect = true;
				rvModel.respBSelect = false;
				rvModel.respCSelect = false;
				rvModel.respDSelect = false;
			}else if (rvModel.respASelect){
				sendMessage = false;
			}else{
				rvModel.respASelect = true;
			}
		break;
		case "respB":
			value = 'B';
			if (rvModel.respASelect 
				|| rvModel.respCSelect 
				|| rvModel.respDSelect){
				type = 'reSend';
				rvModel.respASelect = false;
				rvModel.respBSelect = true;
				rvModel.respCSelect = false;
				rvModel.respDSelect = false;
			}else if (rvModel.respBSelect){
				sendMessage = false;
			}else{
				rvModel.respBSelect = true;
			}
		break;
		case "respC":
			value = 'C';
			if (rvModel.respASelect 
				|| rvModel.respBSelect 
				|| rvModel.respDSelect){
				type = 'reSend';
				rvModel.respASelect = false;
				rvModel.respBSelect = false;
				rvModel.respCSelect = true;
				rvModel.respDSelect = false;
			}else if (rvModel.respCSelect){
				sendMessage = false;
			}else{
				rvModel.respCSelect = true;
			}
		break;
		case "respD":
			value = 'D';
			if (rvModel.respASelect 
				|| rvModel.respBSelect 
				|| rvModel.respCSelect){
				type = 'reSend';
				rvModel.respASelect = false;
				rvModel.respBSelect = false;
				rvModel.respCSelect = false;
				rvModel.respDSelect = true;
			}else if (rvModel.respDSelect){
				sendMessage = false;
			}else{
				rvModel.respDSelect = true;
			}
		break;
	}

	if (sendMessage){
		socket.emit('config',{
			type : 'game',
			id : gameModel.id,
			eventType : type,
			resp : value
		});
	}

}


function init(socketToSet){
	socket = socketToSet;
	rvModel.clickResp = clickResp;

	let myHeaders = new Headers();
	let myInit = { method: 'GET',
	       headers: myHeaders,
	       mode: 'cors',
	       cache: 'default' };

	socket.on('config', function (data) {
		if (data.type === 'game' && data.eventType === 'changeQuestion'){
			localStorage['game'] = "questions";
			rvModel.gameQuestion = true;
			rvModel.gameShake = false;
			rvModel.hideMessage = true;
			rvModel.showQuestion = true;
			rvModel.repA = data.repA;
			rvModel.repB = data.repB;
			rvModel.repC = data.repC;
			rvModel.repD = data.repD;
			value = null;
		}else if (data.type === 'game' && data.eventType === 'hideQuestion'){
			localStorage['game'] = "questions";
			rvModel.hideMessage = false;
			rvModel.showQuestion = false;
			rvModel.gameQuestion = true;
			rvModel.gameShake = false;
		}else if (data.type === 'game' && data.eventType === 'answer'){
			if (value === data.value){
				vibration.vibrate([200,100,200]);
			}else{
				vibration.vibrate([1000]);
			}
		}
	});

	let myRequest = new Request(`/currentState`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		if (json.hideQuestion){
			rvModel.hideMessage = !json.hideQuestion;
			rvModel.showQuestion = rvModel.hideMessage;
		}
		if (json.score && json.score.users && json.score.users[gameModel.id]){
			switch(json.score.users[gameModel.id]){
				case 'A':
					rvModel.respASelect = true;
					rvModel.respBSelect = false;
					rvModel.respCSelect = false;
					rvModel.respDSelect = false;
					break;
				case 'B':
					rvModel.respASelect = false;
					rvModel.respBSelect = true;
					rvModel.respCSelect = false;
					rvModel.respDSelect = false;
					break;
				case 'C':
					rvModel.respASelect = false;
					rvModel.respBSelect = false;
					rvModel.respCSelect = true;
					rvModel.respDSelect = false;
					break;
				case 'D':
					rvModel.respASelect = false;
					rvModel.respBSelect = false;
					rvModel.respCSelect = false;
					rvModel.respDSelect = true;
					break;
			}
		}		
	});
}

module.exports = {
	init : init
};
},{"../model/gameModel":3,"../model/rivetsModel":4,"../sensors/vibration":7}],6:[function(require,module,exports){
'use strict';

let callback = null;

// Listener of devieMotion
var deviceMotionListener = function(event){        
	var x = event.acceleration.x;
	var y = event.acceleration.y;
	var z = event.acceleration.z;
	callback(Math.abs(x));
	//updatePercent();
}

// We add the listener
function register(){
	window.addEventListener('devicemotion', deviceMotionListener, false);
}

function unregister(){
	window.removeEventListener('devicemotion', deviceMotionListener, false);        
}

function init(callbackMotion){
	callback = callbackMotion
}


module.exports = {
	register : register,
	unregister : unregister,
	init : init
}
},{}],7:[function(require,module,exports){
'use strict';

 	// We vibrate according to the sequence
	function vibrate(arrayOfVibration){
		window.navigator.vibrate(arrayOfVibration);
	}

	function unregister(){
		navigator.vibrate(0);        
	}


module.exports = {
	vibrate : vibrate,
	unregister : unregister
}
},{}],8:[function(require,module,exports){
'use strict'

var socket = null;

function manageVisibility(){
	// Set the name of the hidden property and the change event for visibility
	var hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
	  hidden = "hidden";
	  visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
	  hidden = "mozHidden";
	  visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
	  hidden = "msHidden";
	  visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
	  hidden = "webkitHidden";
	  visibilityChange = "webkitvisibilitychange";
	}
	 
	// Warn if the browser doesn't support addEventListener or the Page Visibility API
	if (typeof document.addEventListener === "undefined" || 
	  typeof document[hidden] === "undefined") {
	  alert("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
	} else {
		// Handle page visibility change   
		document.addEventListener(visibilityChange, function handleVisibilityChange(){
			if (document[hidden]) {
				socket.disconnect();
			} else {
				socket.connect();
				//socket.io.reconnect();
			}
		}, false);
	    
	  
	}
}

function init(socketToSet){
	socket = socketToSet;

	manageVisibility();
}


module.exports = {
	init : init	
}
},{}],9:[function(require,module,exports){
'use strict'

let rvModel = require('../model/rivetsModel'),
	gameModel = require('../model/gameModel'),
	motion = require('../sensors/devicemotion'),
	socket = null;

function choiceTeam(event){
	if (event.srcElement.classList.contains('chrome')){
		localStorage['team'] = 2;
	}else{
		localStorage['team'] = 1;
	}

	rvModel.showChoice = false;
	rvModel.showPhone = true;
	motion.register();
}


function callBackMotion(move){
	let team = localStorage['team'];
	socket.emit('sensor', {
		id : gameModel.id,
		type:'devicemotion',
		'team' : team,
		value: move
	});
}

function init(socketToSet){

	socket = socketToSet;
	rvModel.choiceTeam = choiceTeam;

	motion.init(callBackMotion);

	socket.on('config', function (data) {
		if (data.type === 'game' && data.eventType === 'battery'){
			localStorage['game'] = "shake";
			rvModel.gameQuestion = !data.show;
			rvModel.gameShake = data.show;	
			rvModel.showChoice = !localStorage['team'];
			rvModel.showPhone = localStorage['team'];
			if (localStorage['team']){				
				if (data.show){
					motion.register();
				}else{
					motion.unregister();
				}
			}
		}
	});

	if (rvModel.gameShake){
		motion.register(); 
	}

}

module.exports = {
	init : init
};
},{"../model/gameModel":3,"../model/rivetsModel":4,"../sensors/devicemotion":6}],10:[function(require,module,exports){
'use strict'



/*****************************
******************************
* Apis exposed
******************************
******************************
*/

function deviceMotionAvailable(){
	return window.DeviceMotionEvent;
}

function vibrationAvailable(){
	return navigator.vibrate;
}

function proximityAvailable(){
	return window.DeviceProximityEvent;
}

function visibilityAvailable(){
	return typeof document.hidden != "undefined"
			|| typeof document.mozHidden != "undefined"
			|| typeof document.msHidden != "undefined"
			|| typeof document.webkitHidden != "undefined"
}

function isCompat(){
	console.log('Device Motion : %s', deviceMotionAvailable());
	console.log('Vibration : %s', vibrationAvailable());
	console.log('Visibility : %s', visibilityAvailable());
	//console.log('Proximity : %s', proximityAvailable());
	return deviceMotionAvailable()
	 && vibrationAvailable()
	 && visibilityAvailable();
	 //&& proximityAvailable();
}

module.exports = isCompat;
},{}],11:[function(require,module,exports){
'use strict'

function rippleEffect(event){
	let elt = event.srcElement;
	if (!elt.classList.contains('fab'))
		return;

      
    var divParent = document.createElement('DIV'),
    	div = document.createElement('DIV'),
    	xPos = event.pageX - elt.offsetLeft,
      	yPos = event.pageY - elt.offsetTop;
      
    divParent.classList.add('ripple');
    divParent.style.height = elt.clientHeight+"px";
    divParent.style.top = -(elt.clientHeight / 2)+"px";
    divParent.style.width = elt.clientWidth+"px";
      
    div.classList.add('ripple-effect'); 
    div.style.height = elt.clientHeight+"px";
    div.style.width = elt.clientHeight+"px";
    div.style.top = (yPos - (elt.clientHeight/2))+"px";
    div.style.left = (xPos - (elt.clientHeight/2))+"px";
    div.style.background =  "#438844";
      
    divParent.appendChild(div);
    elt.appendChild(divParent);

      window.setTimeout(function(){
        elt.removeChild(divParent);
      }, 2000);
}

module.exports = {
	rippleEffect : rippleEffect
}
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvY29udHJvbGVyL2NvbnRyb2xsZXIuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvZ2FtZS5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9tb2RlbC9nYW1lTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvbW9kZWwvcml2ZXRzTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvcXVlc3Rpb25zL3F1ZXN0aW9ucy5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL3ZpYnJhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL3Zpc2liaWxpdHkuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvc2hha2Uvc2hha2UuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvdXRpbHMvY29tcGF0LmpzIiwiYWRkb24vc2NyaXB0cy9nYW1lL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbnZhciBydk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvcml2ZXRzTW9kZWwnKSxcblx0dXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy91dGlscycpLFxuXHRnYW1lTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9nYW1lTW9kZWwnKSxcblx0Y29tcGF0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY29tcGF0JyksIFx0XG5cdHF1ZXN0aW9ucyA9IHJlcXVpcmUoJy4uL3F1ZXN0aW9ucy9xdWVzdGlvbnMnKSxcblx0c2hha2UgPSByZXF1aXJlKCcuLi9zaGFrZS9zaGFrZScpLFxuXHR2aXNpYmlsaXR5ID0gcmVxdWlyZSgnLi4vc2Vuc29ycy92aXNpYmlsaXR5JyksXG5cdHNvY2tldCA9IG51bGw7XG5cblxuXG5cbmZ1bmN0aW9uIGluaXRDb250cm9sbGVyKCl7XG5cblx0aWYgKCFjb21wYXQoKSl7XG5cdFx0cnZNb2RlbC5oaWRlTWVzc2FnZSA9IHRydWU7XG5cdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSBmYWxzZTtcblx0XHRydk1vZGVsLm5vdGNvbXBhdGlibGUgPSB0cnVlO1xuXHRcdHJldHVybjtcblx0fVxuXG5cblx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSAhbG9jYWxTdG9yYWdlWydnYW1lJ10gfHwgbG9jYWxTdG9yYWdlWydnYW1lJ10gPT09IFwicXVlc3Rpb25zXCI7XG5cdHJ2TW9kZWwuZ2FtZVNoYWtlID0gbG9jYWxTdG9yYWdlWydnYW1lJ10gPT09IFwic2hha2VcIjtcblx0aWYgKHJ2TW9kZWwuZ2FtZVNoYWtlKXtcblx0XHRydk1vZGVsLnNob3dDaG9pY2UgPSAhbG9jYWxTdG9yYWdlWyd0ZWFtJ107XG5cdFx0cnZNb2RlbC5zaG93UGhvbmUgPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0fVxuXHRcblxuXHRpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjMwMDBcIil7XG5cdFx0c29ja2V0ID0gaW8uY29ubmVjdChcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKTtcblx0fWVsc2V7IFxuXHRcdHNvY2tldCA9IGlvLmNvbm5lY3QoXCJodHRwczovL2Jpbm9tZWQuZnI6ODAwMFwiKTtcblx0fVx0XG5cblx0dmlzaWJpbGl0eS5pbml0KHNvY2tldCk7XG5cdHF1ZXN0aW9ucy5pbml0KHNvY2tldCk7XG5cdHNoYWtlLmluaXQoc29ja2V0KTtcblx0XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXRDb250cm9sbGVyIDogaW5pdENvbnRyb2xsZXJcbn0iLCIndXNlIHN0cmljdCdcblxuXG5mdW5jdGlvbiBwYWdlTG9hZCgpe1xuXHRyaXZldHMuYmluZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpLCByZXF1aXJlKCcuL21vZGVsL3JpdmV0c01vZGVsJykpO1xuXHRcblx0cmVxdWlyZSgnLi9jb250cm9sZXIvY29udHJvbGxlcicpLmluaXRDb250cm9sbGVyKCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xuXG4iLCIndXNlIHN0cmljdCdcblxudmFyIGlkVXNlciA9IGxvY2FsU3RvcmFnZVsndXNlcklkJ10gPyBsb2NhbFN0b3JhZ2VbJ3VzZXJJZCddIDogJ3VzZXInK25ldyBEYXRlKCkuZ2V0VGltZSgpO1xubG9jYWxTdG9yYWdlWyd1c2VySWQnXSA9IGlkVXNlcjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGlkIDogaWRVc2VyLFxuXHRhbGxvd1Jlc3AgOiB0cnVlXG59IiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzaG93UXVlc3Rpb24gOiB0cnVlLCBcblx0aGlkZU1lc3NhZ2UgOiB0cnVlLFxuXHRub3Rjb21wYXRpYmxlIDogZmFsc2UsXG5cdGdhbWVRdWVzdGlvbiA6IHRydWUsXG5cdGdhbWVTaGFrZSA6IGZhbHNlLFxuXHRzaG93Q2hvaWNlIDogdHJ1ZSxcblx0c2hvd1Bob25lIDogZmFsc2UsXG5cdHJlcEEgOiAncmVwb25zZSBBJyxcblx0cmVwQiA6ICdyZXBvbnNlIEInLFxuXHRyZXBDIDogJ3JlcG9uc2UgQycsXG5cdHJlcEQgOiAncmVwb25zZSBEJyxcblx0cmVzcEFTZWxlY3QgOiBmYWxzZSxcblx0cmVzcEJTZWxlY3QgOiBmYWxzZSxcblx0cmVzcENTZWxlY3QgOiBmYWxzZSxcblx0cmVzcERTZWxlY3QgOiBmYWxzZVxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgcnZNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL3JpdmV0c01vZGVsJyksXG5cdGdhbWVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL2dhbWVNb2RlbCcpLFxuXHR2aWJyYXRpb24gPSByZXF1aXJlKCcuLi9zZW5zb3JzL3ZpYnJhdGlvbicpLFxuXHRzb2NrZXQgPSBudWxsLFxuXHR2YWx1ZSA9IG51bGw7XG5cbmZ1bmN0aW9uIGNsaWNrUmVzcChldmVudCl7XG4gXG4gXHRpZiAoIXJ2TW9kZWwuaGlkZU1lc3NhZ2Upe1xuIFx0XHRyZXR1cm47XG4gXHR9XG5cdGxldCBlbHQgPSBldmVudC5zcmNFbGVtZW50O1xuXHRsZXQgc2VuZE1lc3NhZ2UgPSB0cnVlO1xuXHRsZXQgdHlwZSA9ICduZXdSZXNwJztcblx0c3dpdGNoIChlbHQuaWQpe1xuXHRcdGNhc2UgXCJyZXNwQVwiOlxuXHRcdFx0dmFsdWUgPSAnQSc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJlc3BCXCI6XG5cdFx0XHR2YWx1ZSA9ICdCJztcblx0XHRcdGlmIChydk1vZGVsLnJlc3BBU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BDU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BEU2VsZWN0KXtcblx0XHRcdFx0dHlwZSA9ICdyZVNlbmQnO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdH1lbHNlIGlmIChydk1vZGVsLnJlc3BCU2VsZWN0KXtcblx0XHRcdFx0c2VuZE1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRicmVhaztcblx0XHRjYXNlIFwicmVzcENcIjpcblx0XHRcdHZhbHVlID0gJ0MnO1xuXHRcdFx0aWYgKHJ2TW9kZWwucmVzcEFTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcEJTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xuXHRcdFx0XHR0eXBlID0gJ3JlU2VuZCc7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcENTZWxlY3Qpe1xuXHRcdFx0XHRzZW5kTWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyZXNwRFwiOlxuXHRcdFx0dmFsdWUgPSAnRCc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRpZiAoc2VuZE1lc3NhZ2Upe1xuXHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0XHRpZCA6IGdhbWVNb2RlbC5pZCxcblx0XHRcdGV2ZW50VHlwZSA6IHR5cGUsXG5cdFx0XHRyZXNwIDogdmFsdWVcblx0XHR9KTtcblx0fVxuXG59XG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXRUb1NldCl7XG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xuXHRydk1vZGVsLmNsaWNrUmVzcCA9IGNsaWNrUmVzcDtcblxuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcblx0ICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcblx0ICAgICAgIG1vZGU6ICdjb3JzJyxcblx0ICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRzb2NrZXQub24oJ2NvbmZpZycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0aWYgKGRhdGEudHlwZSA9PT0gJ2dhbWUnICYmIGRhdGEuZXZlbnRUeXBlID09PSAnY2hhbmdlUXVlc3Rpb24nKXtcblx0XHRcdGxvY2FsU3RvcmFnZVsnZ2FtZSddID0gXCJxdWVzdGlvbnNcIjtcblx0XHRcdHJ2TW9kZWwuZ2FtZVF1ZXN0aW9uID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwuZ2FtZVNoYWtlID0gZmFsc2U7XG5cdFx0XHRydk1vZGVsLmhpZGVNZXNzYWdlID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwucmVwQSA9IGRhdGEucmVwQTtcblx0XHRcdHJ2TW9kZWwucmVwQiA9IGRhdGEucmVwQjtcblx0XHRcdHJ2TW9kZWwucmVwQyA9IGRhdGEucmVwQztcblx0XHRcdHJ2TW9kZWwucmVwRCA9IGRhdGEucmVwRDtcblx0XHRcdHZhbHVlID0gbnVsbDtcblx0XHR9ZWxzZSBpZiAoZGF0YS50eXBlID09PSAnZ2FtZScgJiYgZGF0YS5ldmVudFR5cGUgPT09ICdoaWRlUXVlc3Rpb24nKXtcblx0XHRcdGxvY2FsU3RvcmFnZVsnZ2FtZSddID0gXCJxdWVzdGlvbnNcIjtcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gZmFsc2U7XG5cdFx0XHRydk1vZGVsLmdhbWVRdWVzdGlvbiA9IHRydWU7XG5cdFx0XHRydk1vZGVsLmdhbWVTaGFrZSA9IGZhbHNlO1xuXHRcdH1lbHNlIGlmIChkYXRhLnR5cGUgPT09ICdnYW1lJyAmJiBkYXRhLmV2ZW50VHlwZSA9PT0gJ2Fuc3dlcicpe1xuXHRcdFx0aWYgKHZhbHVlID09PSBkYXRhLnZhbHVlKXtcblx0XHRcdFx0dmlicmF0aW9uLnZpYnJhdGUoWzIwMCwxMDAsMjAwXSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dmlicmF0aW9uLnZpYnJhdGUoWzEwMDBdKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgL2N1cnJlbnRTdGF0ZWAsbXlJbml0KTtcblx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XG5cdFx0aWYgKGpzb24uaGlkZVF1ZXN0aW9uKXtcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSAhanNvbi5oaWRlUXVlc3Rpb247XG5cdFx0XHRydk1vZGVsLnNob3dRdWVzdGlvbiA9IHJ2TW9kZWwuaGlkZU1lc3NhZ2U7XG5cdFx0fVxuXHRcdGlmIChqc29uLnNjb3JlICYmIGpzb24uc2NvcmUudXNlcnMgJiYganNvbi5zY29yZS51c2Vyc1tnYW1lTW9kZWwuaWRdKXtcblx0XHRcdHN3aXRjaChqc29uLnNjb3JlLnVzZXJzW2dhbWVNb2RlbC5pZF0pe1xuXHRcdFx0XHRjYXNlICdBJzpcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnQic6XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0MnOlxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IHRydWU7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdEJzpcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XHRcdFxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59OyIsIid1c2Ugc3RyaWN0JztcblxubGV0IGNhbGxiYWNrID0gbnVsbDtcblxuLy8gTGlzdGVuZXIgb2YgZGV2aWVNb3Rpb25cbnZhciBkZXZpY2VNb3Rpb25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KXsgICAgICAgIFxuXHR2YXIgeCA9IGV2ZW50LmFjY2VsZXJhdGlvbi54O1xuXHR2YXIgeSA9IGV2ZW50LmFjY2VsZXJhdGlvbi55O1xuXHR2YXIgeiA9IGV2ZW50LmFjY2VsZXJhdGlvbi56O1xuXHRjYWxsYmFjayhNYXRoLmFicyh4KSk7XG5cdC8vdXBkYXRlUGVyY2VudCgpO1xufVxuXG4vLyBXZSBhZGQgdGhlIGxpc3RlbmVyXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgZGV2aWNlTW90aW9uTGlzdGVuZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgZGV2aWNlTW90aW9uTGlzdGVuZXIsIGZhbHNlKTsgICAgICAgIFxufVxuXG5mdW5jdGlvbiBpbml0KGNhbGxiYWNrTW90aW9uKXtcblx0Y2FsbGJhY2sgPSBjYWxsYmFja01vdGlvblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3RlciA6IHJlZ2lzdGVyLFxuXHR1bnJlZ2lzdGVyIDogdW5yZWdpc3Rlcixcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCc7XG5cbiBcdC8vIFdlIHZpYnJhdGUgYWNjb3JkaW5nIHRvIHRoZSBzZXF1ZW5jZVxuXHRmdW5jdGlvbiB2aWJyYXRlKGFycmF5T2ZWaWJyYXRpb24pe1xuXHRcdHdpbmRvdy5uYXZpZ2F0b3IudmlicmF0ZShhcnJheU9mVmlicmF0aW9uKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0XHRuYXZpZ2F0b3IudmlicmF0ZSgwKTsgICAgICAgIFxuXHR9XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHZpYnJhdGUgOiB2aWJyYXRlLFxuXHR1bnJlZ2lzdGVyIDogdW5yZWdpc3RlclxufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgc29ja2V0ID0gbnVsbDtcblxuZnVuY3Rpb24gbWFuYWdlVmlzaWJpbGl0eSgpe1xuXHQvLyBTZXQgdGhlIG5hbWUgb2YgdGhlIGhpZGRlbiBwcm9wZXJ0eSBhbmQgdGhlIGNoYW5nZSBldmVudCBmb3IgdmlzaWJpbGl0eVxuXHR2YXIgaGlkZGVuLCB2aXNpYmlsaXR5Q2hhbmdlOyBcblx0aWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gT3BlcmEgMTIuMTAgYW5kIEZpcmVmb3ggMTggYW5kIGxhdGVyIHN1cHBvcnQgXG5cdCAgaGlkZGVuID0gXCJoaWRkZW5cIjtcblx0ICB2aXNpYmlsaXR5Q2hhbmdlID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHQgIGhpZGRlbiA9IFwibW96SGlkZGVuXCI7XG5cdCAgdmlzaWJpbGl0eUNoYW5nZSA9IFwibW96dmlzaWJpbGl0eWNoYW5nZVwiO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHQgIGhpZGRlbiA9IFwibXNIaWRkZW5cIjtcblx0ICB2aXNpYmlsaXR5Q2hhbmdlID0gXCJtc3Zpc2liaWxpdHljaGFuZ2VcIjtcblx0fSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdCAgaGlkZGVuID0gXCJ3ZWJraXRIaWRkZW5cIjtcblx0ICB2aXNpYmlsaXR5Q2hhbmdlID0gXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCI7XG5cdH1cblx0IFxuXHQvLyBXYXJuIGlmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBhZGRFdmVudExpc3RlbmVyIG9yIHRoZSBQYWdlIFZpc2liaWxpdHkgQVBJXG5cdGlmICh0eXBlb2YgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBcblx0ICB0eXBlb2YgZG9jdW1lbnRbaGlkZGVuXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHQgIGFsZXJ0KFwiVGhpcyBkZW1vIHJlcXVpcmVzIGEgYnJvd3Nlciwgc3VjaCBhcyBHb29nbGUgQ2hyb21lIG9yIEZpcmVmb3gsIHRoYXQgc3VwcG9ydHMgdGhlIFBhZ2UgVmlzaWJpbGl0eSBBUEkuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIEhhbmRsZSBwYWdlIHZpc2liaWxpdHkgY2hhbmdlICAgXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBmdW5jdGlvbiBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlKCl7XG5cdFx0XHRpZiAoZG9jdW1lbnRbaGlkZGVuXSkge1xuXHRcdFx0XHRzb2NrZXQuZGlzY29ubmVjdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c29ja2V0LmNvbm5lY3QoKTtcblx0XHRcdFx0Ly9zb2NrZXQuaW8ucmVjb25uZWN0KCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXHQgICAgXG5cdCAgXG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXRUb1NldCl7XG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xuXG5cdG1hbmFnZVZpc2liaWxpdHkoKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgcnZNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL3JpdmV0c01vZGVsJyksXG5cdGdhbWVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL2dhbWVNb2RlbCcpLFxuXHRtb3Rpb24gPSByZXF1aXJlKCcuLi9zZW5zb3JzL2RldmljZW1vdGlvbicpLFxuXHRzb2NrZXQgPSBudWxsO1xuXG5mdW5jdGlvbiBjaG9pY2VUZWFtKGV2ZW50KXtcblx0aWYgKGV2ZW50LnNyY0VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaHJvbWUnKSl7XG5cdFx0bG9jYWxTdG9yYWdlWyd0ZWFtJ10gPSAyO1xuXHR9ZWxzZXtcblx0XHRsb2NhbFN0b3JhZ2VbJ3RlYW0nXSA9IDE7XG5cdH1cblxuXHRydk1vZGVsLnNob3dDaG9pY2UgPSBmYWxzZTtcblx0cnZNb2RlbC5zaG93UGhvbmUgPSB0cnVlO1xuXHRtb3Rpb24ucmVnaXN0ZXIoKTtcbn1cblxuXG5mdW5jdGlvbiBjYWxsQmFja01vdGlvbihtb3ZlKXtcblx0bGV0IHRlYW0gPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0c29ja2V0LmVtaXQoJ3NlbnNvcicsIHtcblx0XHRpZCA6IGdhbWVNb2RlbC5pZCxcblx0XHR0eXBlOidkZXZpY2Vtb3Rpb24nLFxuXHRcdCd0ZWFtJyA6IHRlYW0sXG5cdFx0dmFsdWU6IG1vdmVcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xuXHRydk1vZGVsLmNob2ljZVRlYW0gPSBjaG9pY2VUZWFtO1xuXG5cdG1vdGlvbi5pbml0KGNhbGxCYWNrTW90aW9uKTtcblxuXHRzb2NrZXQub24oJ2NvbmZpZycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0aWYgKGRhdGEudHlwZSA9PT0gJ2dhbWUnICYmIGRhdGEuZXZlbnRUeXBlID09PSAnYmF0dGVyeScpe1xuXHRcdFx0bG9jYWxTdG9yYWdlWydnYW1lJ10gPSBcInNoYWtlXCI7XG5cdFx0XHRydk1vZGVsLmdhbWVRdWVzdGlvbiA9ICFkYXRhLnNob3c7XG5cdFx0XHRydk1vZGVsLmdhbWVTaGFrZSA9IGRhdGEuc2hvdztcdFxuXHRcdFx0cnZNb2RlbC5zaG93Q2hvaWNlID0gIWxvY2FsU3RvcmFnZVsndGVhbSddO1xuXHRcdFx0cnZNb2RlbC5zaG93UGhvbmUgPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0XHRcdGlmIChsb2NhbFN0b3JhZ2VbJ3RlYW0nXSl7XHRcdFx0XHRcblx0XHRcdFx0aWYgKGRhdGEuc2hvdyl7XG5cdFx0XHRcdFx0bW90aW9uLnJlZ2lzdGVyKCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdG1vdGlvbi51bnJlZ2lzdGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGlmIChydk1vZGVsLmdhbWVTaGFrZSl7XG5cdFx0bW90aW9uLnJlZ2lzdGVyKCk7IFxuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59OyIsIid1c2Ugc3RyaWN0J1xuXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogQXBpcyBleHBvc2VkXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKi9cblxuZnVuY3Rpb24gZGV2aWNlTW90aW9uQXZhaWxhYmxlKCl7XG5cdHJldHVybiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQ7XG59XG5cbmZ1bmN0aW9uIHZpYnJhdGlvbkF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gbmF2aWdhdG9yLnZpYnJhdGU7XG59XG5cbmZ1bmN0aW9uIHByb3hpbWl0eUF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gd2luZG93LkRldmljZVByb3hpbWl0eUV2ZW50O1xufVxuXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXZhaWxhYmxlKCl7XG5cdHJldHVybiB0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9IFwidW5kZWZpbmVkXCJcblx0XHRcdHx8IHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT0gXCJ1bmRlZmluZWRcIlxuXHRcdFx0fHwgdHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9IFwidW5kZWZpbmVkXCJcblx0XHRcdHx8IHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT0gXCJ1bmRlZmluZWRcIlxufVxuXG5mdW5jdGlvbiBpc0NvbXBhdCgpe1xuXHRjb25zb2xlLmxvZygnRGV2aWNlIE1vdGlvbiA6ICVzJywgZGV2aWNlTW90aW9uQXZhaWxhYmxlKCkpO1xuXHRjb25zb2xlLmxvZygnVmlicmF0aW9uIDogJXMnLCB2aWJyYXRpb25BdmFpbGFibGUoKSk7XG5cdGNvbnNvbGUubG9nKCdWaXNpYmlsaXR5IDogJXMnLCB2aXNpYmlsaXR5QXZhaWxhYmxlKCkpO1xuXHQvL2NvbnNvbGUubG9nKCdQcm94aW1pdHkgOiAlcycsIHByb3hpbWl0eUF2YWlsYWJsZSgpKTtcblx0cmV0dXJuIGRldmljZU1vdGlvbkF2YWlsYWJsZSgpXG5cdCAmJiB2aWJyYXRpb25BdmFpbGFibGUoKVxuXHQgJiYgdmlzaWJpbGl0eUF2YWlsYWJsZSgpO1xuXHQgLy8mJiBwcm94aW1pdHlBdmFpbGFibGUoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0NvbXBhdDsiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gcmlwcGxlRWZmZWN0KGV2ZW50KXtcblx0bGV0IGVsdCA9IGV2ZW50LnNyY0VsZW1lbnQ7XG5cdGlmICghZWx0LmNsYXNzTGlzdC5jb250YWlucygnZmFiJykpXG5cdFx0cmV0dXJuO1xuXG4gICAgICBcbiAgICB2YXIgZGl2UGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyksXG4gICAgXHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKSxcbiAgICBcdHhQb3MgPSBldmVudC5wYWdlWCAtIGVsdC5vZmZzZXRMZWZ0LFxuICAgICAgXHR5UG9zID0gZXZlbnQucGFnZVkgLSBlbHQub2Zmc2V0VG9wO1xuICAgICAgXG4gICAgZGl2UGFyZW50LmNsYXNzTGlzdC5hZGQoJ3JpcHBsZScpO1xuICAgIGRpdlBhcmVudC5zdHlsZS5oZWlnaHQgPSBlbHQuY2xpZW50SGVpZ2h0K1wicHhcIjtcbiAgICBkaXZQYXJlbnQuc3R5bGUudG9wID0gLShlbHQuY2xpZW50SGVpZ2h0IC8gMikrXCJweFwiO1xuICAgIGRpdlBhcmVudC5zdHlsZS53aWR0aCA9IGVsdC5jbGllbnRXaWR0aCtcInB4XCI7XG4gICAgICBcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgncmlwcGxlLWVmZmVjdCcpOyBcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2LnN0eWxlLnRvcCA9ICh5UG9zIC0gKGVsdC5jbGllbnRIZWlnaHQvMikpK1wicHhcIjtcbiAgICBkaXYuc3R5bGUubGVmdCA9ICh4UG9zIC0gKGVsdC5jbGllbnRIZWlnaHQvMikpK1wicHhcIjtcbiAgICBkaXYuc3R5bGUuYmFja2dyb3VuZCA9ICBcIiM0Mzg4NDRcIjtcbiAgICAgIFxuICAgIGRpdlBhcmVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIGVsdC5hcHBlbmRDaGlsZChkaXZQYXJlbnQpO1xuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBlbHQucmVtb3ZlQ2hpbGQoZGl2UGFyZW50KTtcbiAgICAgIH0sIDIwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmlwcGxlRWZmZWN0IDogcmlwcGxlRWZmZWN0XG59Il19
