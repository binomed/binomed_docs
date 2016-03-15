(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
var rvModel = require('../model/rivetsModel'),
	utils = require('../utils/utils'),
	gameModel = require('../model/gameModel'),
	compat = require('../utils/compat'), 	
	questions = require('../questions/questions'),
	shake = require('../shake/shake'),
	visibility = require('../sensors/visibility'),
	//notification = require('../sensors/notifications'),
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
	//notification.init(socket);
	

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

	let protocol = '';
    let scheme = ''
    let basicHost = ''
    if (location.host && location.host.indexOf('localhost') === -1){
    	protocol = 'https';
    	scheme = '://';
    	basicHost = 'binomed.fr:8000';
    }

	let myRequest = new Request(`${protocol}${scheme}${basicHost}/currentState`,myInit);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvY29udHJvbGVyL2NvbnRyb2xsZXIuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvZ2FtZS5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9tb2RlbC9nYW1lTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvbW9kZWwvcml2ZXRzTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvcXVlc3Rpb25zL3F1ZXN0aW9ucy5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL3ZpYnJhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL3Zpc2liaWxpdHkuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvc2hha2Uvc2hha2UuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvdXRpbHMvY29tcGF0LmpzIiwiYWRkb24vc2NyaXB0cy9nYW1lL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xudmFyIHJ2TW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9yaXZldHNNb2RlbCcpLFxuXHR1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyksXG5cdGdhbWVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL2dhbWVNb2RlbCcpLFxuXHRjb21wYXQgPSByZXF1aXJlKCcuLi91dGlscy9jb21wYXQnKSwgXHRcblx0cXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vcXVlc3Rpb25zL3F1ZXN0aW9ucycpLFxuXHRzaGFrZSA9IHJlcXVpcmUoJy4uL3NoYWtlL3NoYWtlJyksXG5cdHZpc2liaWxpdHkgPSByZXF1aXJlKCcuLi9zZW5zb3JzL3Zpc2liaWxpdHknKSxcblx0Ly9ub3RpZmljYXRpb24gPSByZXF1aXJlKCcuLi9zZW5zb3JzL25vdGlmaWNhdGlvbnMnKSxcblx0c29ja2V0ID0gbnVsbDtcblxuXG5cbmZ1bmN0aW9uIGluaXRDb250cm9sbGVyKCl7XG4gIFxuXHRpZiAoIWNvbXBhdCgpKXtcblx0XHRydk1vZGVsLmhpZGVNZXNzYWdlID0gdHJ1ZTtcblx0XHRydk1vZGVsLnNob3dRdWVzdGlvbiA9IGZhbHNlOyBcblx0XHRydk1vZGVsLm5vdGNvbXBhdGlibGUgPSB0cnVlO1xuXHRcdHJldHVybjtcblx0fVxuXG5cblx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSAhbG9jYWxTdG9yYWdlWydnYW1lJ10gfHwgbG9jYWxTdG9yYWdlWydnYW1lJ10gPT09IFwicXVlc3Rpb25zXCI7XG5cdHJ2TW9kZWwuZ2FtZVNoYWtlID0gbG9jYWxTdG9yYWdlWydnYW1lJ10gPT09IFwic2hha2VcIjtcblx0aWYgKHJ2TW9kZWwuZ2FtZVNoYWtlKXtcblx0XHRydk1vZGVsLnNob3dDaG9pY2UgPSAhbG9jYWxTdG9yYWdlWyd0ZWFtJ107XG5cdFx0cnZNb2RlbC5zaG93UGhvbmUgPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0fVxuXHRcblxuXHRpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjMwMDBcIil7XG5cdFx0c29ja2V0ID0gaW8uY29ubmVjdChcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKTtcblx0fWVsc2V7IFxuXHRcdHNvY2tldCA9IGlvLmNvbm5lY3QoXCJodHRwczovL2Jpbm9tZWQuZnI6ODAwMFwiKTtcblx0fVx0XG5cblx0dmlzaWJpbGl0eS5pbml0KHNvY2tldCk7XG5cdHF1ZXN0aW9ucy5pbml0KHNvY2tldCk7XG5cdHNoYWtlLmluaXQoc29ja2V0KTtcblx0Ly9ub3RpZmljYXRpb24uaW5pdChzb2NrZXQpO1xuXHRcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdENvbnRyb2xsZXIgOiBpbml0Q29udHJvbGxlclxufSIsIid1c2Ugc3RyaWN0J1xuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkKCl7XG5cdHJpdmV0cy5iaW5kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JyksIHJlcXVpcmUoJy4vbW9kZWwvcml2ZXRzTW9kZWwnKSk7XG5cdFxuXHRyZXF1aXJlKCcuL2NvbnRyb2xlci9jb250cm9sbGVyJykuaW5pdENvbnRyb2xsZXIoKTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG5cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgaWRVc2VyID0gbG9jYWxTdG9yYWdlWyd1c2VySWQnXSA/IGxvY2FsU3RvcmFnZVsndXNlcklkJ10gOiAndXNlcicrbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5sb2NhbFN0b3JhZ2VbJ3VzZXJJZCddID0gaWRVc2VyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aWQgOiBpZFVzZXIsXG5cdGFsbG93UmVzcCA6IHRydWVcbn0iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHNob3dRdWVzdGlvbiA6IHRydWUsIFxuXHRoaWRlTWVzc2FnZSA6IHRydWUsXG5cdG5vdGNvbXBhdGlibGUgOiBmYWxzZSxcblx0Z2FtZVF1ZXN0aW9uIDogdHJ1ZSxcblx0Z2FtZVNoYWtlIDogZmFsc2UsXG5cdHNob3dDaG9pY2UgOiB0cnVlLFxuXHRzaG93UGhvbmUgOiBmYWxzZSxcblx0cmVwQSA6ICdyZXBvbnNlIEEnLFxuXHRyZXBCIDogJ3JlcG9uc2UgQicsXG5cdHJlcEMgOiAncmVwb25zZSBDJyxcblx0cmVwRCA6ICdyZXBvbnNlIEQnLFxuXHRyZXNwQVNlbGVjdCA6IGZhbHNlLFxuXHRyZXNwQlNlbGVjdCA6IGZhbHNlLFxuXHRyZXNwQ1NlbGVjdCA6IGZhbHNlLFxuXHRyZXNwRFNlbGVjdCA6IGZhbHNlXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBydk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvcml2ZXRzTW9kZWwnKSxcblx0Z2FtZU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvZ2FtZU1vZGVsJyksXG5cdHZpYnJhdGlvbiA9IHJlcXVpcmUoJy4uL3NlbnNvcnMvdmlicmF0aW9uJyksXG5cdHNvY2tldCA9IG51bGwsXG5cdHZhbHVlID0gbnVsbDtcblxuZnVuY3Rpb24gY2xpY2tSZXNwKGV2ZW50KXtcbiBcbiBcdGlmICghcnZNb2RlbC5oaWRlTWVzc2FnZSl7XG4gXHRcdHJldHVybjtcbiBcdH1cblx0bGV0IGVsdCA9IGV2ZW50LnNyY0VsZW1lbnQ7XG5cdGxldCBzZW5kTWVzc2FnZSA9IHRydWU7XG5cdGxldCB0eXBlID0gJ25ld1Jlc3AnO1xuXHRzd2l0Y2ggKGVsdC5pZCl7XG5cdFx0Y2FzZSBcInJlc3BBXCI6XG5cdFx0XHR2YWx1ZSA9ICdBJztcblx0XHRcdGlmIChydk1vZGVsLnJlc3BCU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BDU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BEU2VsZWN0KXtcblx0XHRcdFx0dHlwZSA9ICdyZVNlbmQnO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdH1lbHNlIGlmIChydk1vZGVsLnJlc3BBU2VsZWN0KXtcblx0XHRcdFx0c2VuZE1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRicmVhaztcblx0XHRjYXNlIFwicmVzcEJcIjpcblx0XHRcdHZhbHVlID0gJ0InO1xuXHRcdFx0aWYgKHJ2TW9kZWwucmVzcEFTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcENTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xuXHRcdFx0XHR0eXBlID0gJ3JlU2VuZCc7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcEJTZWxlY3Qpe1xuXHRcdFx0XHRzZW5kTWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyZXNwQ1wiOlxuXHRcdFx0dmFsdWUgPSAnQyc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwQ1NlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJlc3BEXCI6XG5cdFx0XHR2YWx1ZSA9ICdEJztcblx0XHRcdGlmIChydk1vZGVsLnJlc3BBU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BCU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BDU2VsZWN0KXtcblx0XHRcdFx0dHlwZSA9ICdyZVNlbmQnO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdH1lbHNlIGlmIChydk1vZGVsLnJlc3BEU2VsZWN0KXtcblx0XHRcdFx0c2VuZE1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRicmVhaztcblx0fVxuXG5cdGlmIChzZW5kTWVzc2FnZSl7XG5cdFx0c29ja2V0LmVtaXQoJ2NvbmZpZycse1xuXHRcdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRcdGlkIDogZ2FtZU1vZGVsLmlkLFxuXHRcdFx0ZXZlbnRUeXBlIDogdHlwZSxcblx0XHRcdHJlc3AgOiB2YWx1ZVxuXHRcdH0pO1xuXHR9XG5cbn1cblxuXG5mdW5jdGlvbiBpbml0KHNvY2tldFRvU2V0KXtcblx0c29ja2V0ID0gc29ja2V0VG9TZXQ7XG5cdHJ2TW9kZWwuY2xpY2tSZXNwID0gY2xpY2tSZXNwO1xuXG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuXHQgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuXHQgICAgICAgbW9kZTogJ2NvcnMnLFxuXHQgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuXG5cdHNvY2tldC5vbignY29uZmlnJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRpZiAoZGF0YS50eXBlID09PSAnZ2FtZScgJiYgZGF0YS5ldmVudFR5cGUgPT09ICdjaGFuZ2VRdWVzdGlvbicpe1xuXHRcdFx0bG9jYWxTdG9yYWdlWydnYW1lJ10gPSBcInF1ZXN0aW9uc1wiO1xuXHRcdFx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSB0cnVlO1xuXHRcdFx0cnZNb2RlbC5nYW1lU2hha2UgPSBmYWxzZTtcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSB0cnVlO1xuXHRcdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSB0cnVlO1xuXHRcdFx0cnZNb2RlbC5yZXBBID0gZGF0YS5yZXBBO1xuXHRcdFx0cnZNb2RlbC5yZXBCID0gZGF0YS5yZXBCO1xuXHRcdFx0cnZNb2RlbC5yZXBDID0gZGF0YS5yZXBDO1xuXHRcdFx0cnZNb2RlbC5yZXBEID0gZGF0YS5yZXBEO1xuXHRcdFx0dmFsdWUgPSBudWxsO1xuXHRcdH1lbHNlIGlmIChkYXRhLnR5cGUgPT09ICdnYW1lJyAmJiBkYXRhLmV2ZW50VHlwZSA9PT0gJ2hpZGVRdWVzdGlvbicpe1xuXHRcdFx0bG9jYWxTdG9yYWdlWydnYW1lJ10gPSBcInF1ZXN0aW9uc1wiO1xuXHRcdFx0cnZNb2RlbC5oaWRlTWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSBmYWxzZTtcblx0XHRcdHJ2TW9kZWwuZ2FtZVF1ZXN0aW9uID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwuZ2FtZVNoYWtlID0gZmFsc2U7XG5cdFx0fWVsc2UgaWYgKGRhdGEudHlwZSA9PT0gJ2dhbWUnICYmIGRhdGEuZXZlbnRUeXBlID09PSAnYW5zd2VyJyl7XG5cdFx0XHRpZiAodmFsdWUgPT09IGRhdGEudmFsdWUpe1xuXHRcdFx0XHR2aWJyYXRpb24udmlicmF0ZShbMjAwLDEwMCwyMDBdKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR2aWJyYXRpb24udmlicmF0ZShbMTAwMF0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0bGV0IHByb3RvY29sID0gJyc7XG4gICAgbGV0IHNjaGVtZSA9ICcnXG4gICAgbGV0IGJhc2ljSG9zdCA9ICcnXG4gICAgaWYgKGxvY2F0aW9uLmhvc3QgJiYgbG9jYXRpb24uaG9zdC5pbmRleE9mKCdsb2NhbGhvc3QnKSA9PT0gLTEpe1xuICAgIFx0cHJvdG9jb2wgPSAnaHR0cHMnO1xuICAgIFx0c2NoZW1lID0gJzovLyc7XG4gICAgXHRiYXNpY0hvc3QgPSAnYmlub21lZC5mcjo4MDAwJztcbiAgICB9XG5cblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke3Byb3RvY29sfSR7c2NoZW1lfSR7YmFzaWNIb3N0fS9jdXJyZW50U3RhdGVgLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdGlmIChqc29uLmhpZGVRdWVzdGlvbil7XG5cdFx0XHRydk1vZGVsLmhpZGVNZXNzYWdlID0gIWpzb24uaGlkZVF1ZXN0aW9uO1xuXHRcdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSBydk1vZGVsLmhpZGVNZXNzYWdlO1xuXHRcdH1cblx0XHRpZiAoanNvbi5zY29yZSAmJiBqc29uLnNjb3JlLnVzZXJzICYmIGpzb24uc2NvcmUudXNlcnNbZ2FtZU1vZGVsLmlkXSl7XG5cdFx0XHRzd2l0Y2goanNvbi5zY29yZS51c2Vyc1tnYW1lTW9kZWwuaWRdKXtcblx0XHRcdFx0Y2FzZSAnQSc6XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0InOlxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdDJzpcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnRCc6XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVx0XHRcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufTsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBjYWxsYmFjayA9IG51bGw7XG5cbi8vIExpc3RlbmVyIG9mIGRldmllTW90aW9uXG52YXIgZGV2aWNlTW90aW9uTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7ICAgICAgICBcblx0dmFyIHggPSBldmVudC5hY2NlbGVyYXRpb24ueDtcblx0dmFyIHkgPSBldmVudC5hY2NlbGVyYXRpb24ueTtcblx0dmFyIHogPSBldmVudC5hY2NlbGVyYXRpb24uejtcblx0Y2FsbGJhY2soTWF0aC5hYnMoeCkpO1xuXHQvL3VwZGF0ZVBlcmNlbnQoKTtcbn1cblxuLy8gV2UgYWRkIHRoZSBsaXN0ZW5lclxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIGRldmljZU1vdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW1vdGlvbicsIGRldmljZU1vdGlvbkxpc3RlbmVyLCBmYWxzZSk7ICAgICAgICBcbn1cblxuZnVuY3Rpb24gaW5pdChjYWxsYmFja01vdGlvbil7XG5cdGNhbGxiYWNrID0gY2FsbGJhY2tNb3Rpb25cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVnaXN0ZXIgOiByZWdpc3Rlcixcblx0dW5yZWdpc3RlciA6IHVucmVnaXN0ZXIsXG5cdGluaXQgOiBpbml0XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4gXHQvLyBXZSB2aWJyYXRlIGFjY29yZGluZyB0byB0aGUgc2VxdWVuY2Vcblx0ZnVuY3Rpb24gdmlicmF0ZShhcnJheU9mVmlicmF0aW9uKXtcblx0XHR3aW5kb3cubmF2aWdhdG9yLnZpYnJhdGUoYXJyYXlPZlZpYnJhdGlvbik7XG5cdH1cblxuXHRmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG5cdFx0bmF2aWdhdG9yLnZpYnJhdGUoMCk7ICAgICAgICBcblx0fVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHR2aWJyYXRlIDogdmlicmF0ZSxcblx0dW5yZWdpc3RlciA6IHVucmVnaXN0ZXJcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIHNvY2tldCA9IG51bGw7XG5cbmZ1bmN0aW9uIG1hbmFnZVZpc2liaWxpdHkoKXtcblx0Ly8gU2V0IHRoZSBuYW1lIG9mIHRoZSBoaWRkZW4gcHJvcGVydHkgYW5kIHRoZSBjaGFuZ2UgZXZlbnQgZm9yIHZpc2liaWxpdHlcblx0dmFyIGhpZGRlbiwgdmlzaWJpbGl0eUNoYW5nZTsgXG5cdGlmICh0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7IC8vIE9wZXJhIDEyLjEwIGFuZCBGaXJlZm94IDE4IGFuZCBsYXRlciBzdXBwb3J0IFxuXHQgIGhpZGRlbiA9IFwiaGlkZGVuXCI7XG5cdCAgdmlzaWJpbGl0eUNoYW5nZSA9IFwidmlzaWJpbGl0eWNoYW5nZVwiO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0ICBoaWRkZW4gPSBcIm1vekhpZGRlblwiO1xuXHQgIHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1venZpc2liaWxpdHljaGFuZ2VcIjtcblx0fSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0ICBoaWRkZW4gPSBcIm1zSGlkZGVuXCI7XG5cdCAgdmlzaWJpbGl0eUNoYW5nZSA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHQgIGhpZGRlbiA9IFwid2Via2l0SGlkZGVuXCI7XG5cdCAgdmlzaWJpbGl0eUNoYW5nZSA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xuXHR9XG5cdCBcblx0Ly8gV2FybiBpZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgYWRkRXZlbnRMaXN0ZW5lciBvciB0aGUgUGFnZSBWaXNpYmlsaXR5IEFQSVxuXHRpZiAodHlwZW9mIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwidW5kZWZpbmVkXCIgfHwgXG5cdCAgdHlwZW9mIGRvY3VtZW50W2hpZGRlbl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0ICBhbGVydChcIlRoaXMgZGVtbyByZXF1aXJlcyBhIGJyb3dzZXIsIHN1Y2ggYXMgR29vZ2xlIENocm9tZSBvciBGaXJlZm94LCB0aGF0IHN1cHBvcnRzIHRoZSBQYWdlIFZpc2liaWxpdHkgQVBJLlwiKTtcblx0fSBlbHNlIHtcblx0XHQvLyBIYW5kbGUgcGFnZSB2aXNpYmlsaXR5IGNoYW5nZSAgIFxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgZnVuY3Rpb24gaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpe1xuXHRcdFx0aWYgKGRvY3VtZW50W2hpZGRlbl0pIHtcblx0XHRcdFx0c29ja2V0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNvY2tldC5jb25uZWN0KCk7XG5cdFx0XHRcdC8vc29ja2V0LmlvLnJlY29ubmVjdCgpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKTtcblx0ICAgIFxuXHQgIFxuXHR9XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblxuXHRtYW5hZ2VWaXNpYmlsaXR5KCk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XHRcbn0iLCIndXNlIHN0cmljdCdcblxubGV0IHJ2TW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9yaXZldHNNb2RlbCcpLFxuXHRnYW1lTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9nYW1lTW9kZWwnKSxcblx0bW90aW9uID0gcmVxdWlyZSgnLi4vc2Vuc29ycy9kZXZpY2Vtb3Rpb24nKSxcblx0c29ja2V0ID0gbnVsbDtcblxuZnVuY3Rpb24gY2hvaWNlVGVhbShldmVudCl7XG5cdGlmIChldmVudC5zcmNFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY2hyb21lJykpe1xuXHRcdGxvY2FsU3RvcmFnZVsndGVhbSddID0gMjtcblx0fWVsc2V7XG5cdFx0bG9jYWxTdG9yYWdlWyd0ZWFtJ10gPSAxO1xuXHR9XG5cblx0cnZNb2RlbC5zaG93Q2hvaWNlID0gZmFsc2U7XG5cdHJ2TW9kZWwuc2hvd1Bob25lID0gdHJ1ZTtcblx0bW90aW9uLnJlZ2lzdGVyKCk7XG59XG5cblxuZnVuY3Rpb24gY2FsbEJhY2tNb3Rpb24obW92ZSl7XG5cdGxldCB0ZWFtID0gbG9jYWxTdG9yYWdlWyd0ZWFtJ107XG5cdHNvY2tldC5lbWl0KCdzZW5zb3InLCB7XG5cdFx0aWQgOiBnYW1lTW9kZWwuaWQsXG5cdFx0dHlwZTonZGV2aWNlbW90aW9uJyxcblx0XHQndGVhbScgOiB0ZWFtLFxuXHRcdHZhbHVlOiBtb3ZlXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBpbml0KHNvY2tldFRvU2V0KXtcblxuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblx0cnZNb2RlbC5jaG9pY2VUZWFtID0gY2hvaWNlVGVhbTtcblxuXHRtb3Rpb24uaW5pdChjYWxsQmFja01vdGlvbik7XG5cblx0c29ja2V0Lm9uKCdjb25maWcnLCBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdGlmIChkYXRhLnR5cGUgPT09ICdnYW1lJyAmJiBkYXRhLmV2ZW50VHlwZSA9PT0gJ2JhdHRlcnknKXtcblx0XHRcdGxvY2FsU3RvcmFnZVsnZ2FtZSddID0gXCJzaGFrZVwiO1xuXHRcdFx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSAhZGF0YS5zaG93O1xuXHRcdFx0cnZNb2RlbC5nYW1lU2hha2UgPSBkYXRhLnNob3c7XHRcblx0XHRcdHJ2TW9kZWwuc2hvd0Nob2ljZSA9ICFsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0XHRcdHJ2TW9kZWwuc2hvd1Bob25lID0gbG9jYWxTdG9yYWdlWyd0ZWFtJ107XG5cdFx0XHRpZiAobG9jYWxTdG9yYWdlWyd0ZWFtJ10pe1x0XHRcdFx0XG5cdFx0XHRcdGlmIChkYXRhLnNob3cpe1xuXHRcdFx0XHRcdG1vdGlvbi5yZWdpc3RlcigpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRtb3Rpb24udW5yZWdpc3RlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAocnZNb2RlbC5nYW1lU2hha2Upe1xuXHRcdG1vdGlvbi5yZWdpc3RlcigpOyBcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0IDogaW5pdFxufTsiLCIndXNlIHN0cmljdCdcblxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIEFwaXMgZXhwb3NlZFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiovXG5cbmZ1bmN0aW9uIGRldmljZU1vdGlvbkF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gd2luZG93LkRldmljZU1vdGlvbkV2ZW50O1xufVxuXG5mdW5jdGlvbiB2aWJyYXRpb25BdmFpbGFibGUoKXtcblx0cmV0dXJuIG5hdmlnYXRvci52aWJyYXRlO1xufVxuXG5mdW5jdGlvbiBwcm94aW1pdHlBdmFpbGFibGUoKXtcblx0cmV0dXJuIHdpbmRvdy5EZXZpY2VQcm94aW1pdHlFdmVudDtcbn1cblxuZnVuY3Rpb24gdmlzaWJpbGl0eUF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gdHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPSBcInVuZGVmaW5lZFwiXG5cdFx0XHR8fCB0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9IFwidW5kZWZpbmVkXCJcblx0XHRcdHx8IHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPSBcInVuZGVmaW5lZFwiXG5cdFx0XHR8fCB0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9IFwidW5kZWZpbmVkXCJcbn1cblxuZnVuY3Rpb24gaXNDb21wYXQoKXtcblx0Y29uc29sZS5sb2coJ0RldmljZSBNb3Rpb24gOiAlcycsIGRldmljZU1vdGlvbkF2YWlsYWJsZSgpKTtcblx0Y29uc29sZS5sb2coJ1ZpYnJhdGlvbiA6ICVzJywgdmlicmF0aW9uQXZhaWxhYmxlKCkpO1xuXHRjb25zb2xlLmxvZygnVmlzaWJpbGl0eSA6ICVzJywgdmlzaWJpbGl0eUF2YWlsYWJsZSgpKTtcblx0Ly9jb25zb2xlLmxvZygnUHJveGltaXR5IDogJXMnLCBwcm94aW1pdHlBdmFpbGFibGUoKSk7XG5cdHJldHVybiBkZXZpY2VNb3Rpb25BdmFpbGFibGUoKVxuXHQgJiYgdmlicmF0aW9uQXZhaWxhYmxlKClcblx0ICYmIHZpc2liaWxpdHlBdmFpbGFibGUoKTtcblx0IC8vJiYgcHJveGltaXR5QXZhaWxhYmxlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNDb21wYXQ7IiwiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIHJpcHBsZUVmZmVjdChldmVudCl7XG5cdGxldCBlbHQgPSBldmVudC5zcmNFbGVtZW50O1xuXHRpZiAoIWVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhYicpKVxuXHRcdHJldHVybjtcblxuICAgICAgXG4gICAgdmFyIGRpdlBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpLFxuICAgIFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyksXG4gICAgXHR4UG9zID0gZXZlbnQucGFnZVggLSBlbHQub2Zmc2V0TGVmdCxcbiAgICAgIFx0eVBvcyA9IGV2ZW50LnBhZ2VZIC0gZWx0Lm9mZnNldFRvcDtcbiAgICAgIFxuICAgIGRpdlBhcmVudC5jbGFzc0xpc3QuYWRkKCdyaXBwbGUnKTtcbiAgICBkaXZQYXJlbnQuc3R5bGUuaGVpZ2h0ID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2UGFyZW50LnN0eWxlLnRvcCA9IC0oZWx0LmNsaWVudEhlaWdodCAvIDIpK1wicHhcIjtcbiAgICBkaXZQYXJlbnQuc3R5bGUud2lkdGggPSBlbHQuY2xpZW50V2lkdGgrXCJweFwiO1xuICAgICAgXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3JpcHBsZS1lZmZlY3QnKTsgXG4gICAgZGl2LnN0eWxlLmhlaWdodCA9IGVsdC5jbGllbnRIZWlnaHQrXCJweFwiO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGVsdC5jbGllbnRIZWlnaHQrXCJweFwiO1xuICAgIGRpdi5zdHlsZS50b3AgPSAoeVBvcyAtIChlbHQuY2xpZW50SGVpZ2h0LzIpKStcInB4XCI7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSAoeFBvcyAtIChlbHQuY2xpZW50SGVpZ2h0LzIpKStcInB4XCI7XG4gICAgZGl2LnN0eWxlLmJhY2tncm91bmQgPSAgXCIjNDM4ODQ0XCI7XG4gICAgICBcbiAgICBkaXZQYXJlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICBlbHQuYXBwZW5kQ2hpbGQoZGl2UGFyZW50KTtcblxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgZWx0LnJlbW92ZUNoaWxkKGRpdlBhcmVudCk7XG4gICAgICB9LCAyMDAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJpcHBsZUVmZmVjdCA6IHJpcHBsZUVmZmVjdFxufSJdfQ==
