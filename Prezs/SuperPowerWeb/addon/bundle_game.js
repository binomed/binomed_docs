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
		socket = io.connect("http://localhost:8443");
	}else{ 
		socket = io.connect("https://binomed.fr:8443");
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
	winner : false,
	looser : false,
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
			timestamp : new Date().getTime(),
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
		console.info(data);
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
		}else if (data.type === 'game' && data.eventType === 'winners'){
			
			rvModel.hideMessage = true;
			rvModel.showQuestion = false;
			rvModel.gameQuestion = true;
			rvModel.gameShake = false;
			if (data.value.indexOf(gameModel.id) != -1){
				rvModel.winner = true;
				vibration.vibrate([500,200,500]);
			}else{
				rvModel.looser = true;
			}
		}
	});

	let protocol = '';
    let scheme = ''
    let basicHost = ''
    if (location.host && location.host.indexOf('localhost') === -1){
    	protocol = 'https';
    	scheme = '://';
    	basicHost = 'binomed.fr:8443';
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvY29udHJvbGVyL2NvbnRyb2xsZXIuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvZ2FtZS5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9tb2RlbC9nYW1lTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvbW9kZWwvcml2ZXRzTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvcXVlc3Rpb25zL3F1ZXN0aW9ucy5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL3ZpYnJhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL3Zpc2liaWxpdHkuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvc2hha2Uvc2hha2UuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvdXRpbHMvY29tcGF0LmpzIiwiYWRkb24vc2NyaXB0cy9nYW1lL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXHJcbnZhciBydk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvcml2ZXRzTW9kZWwnKSxcclxuXHR1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyksXHJcblx0Z2FtZU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvZ2FtZU1vZGVsJyksXHJcblx0Y29tcGF0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY29tcGF0JyksIFx0XHJcblx0cXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vcXVlc3Rpb25zL3F1ZXN0aW9ucycpLFxyXG5cdHNoYWtlID0gcmVxdWlyZSgnLi4vc2hha2Uvc2hha2UnKSxcclxuXHR2aXNpYmlsaXR5ID0gcmVxdWlyZSgnLi4vc2Vuc29ycy92aXNpYmlsaXR5JyksXHJcblx0Ly9ub3RpZmljYXRpb24gPSByZXF1aXJlKCcuLi9zZW5zb3JzL25vdGlmaWNhdGlvbnMnKSxcclxuXHRzb2NrZXQgPSBudWxsO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0Q29udHJvbGxlcigpe1xyXG4gIFxyXG5cdGlmICghY29tcGF0KCkpe1xyXG5cdFx0cnZNb2RlbC5oaWRlTWVzc2FnZSA9IHRydWU7XHJcblx0XHRydk1vZGVsLnNob3dRdWVzdGlvbiA9IGZhbHNlOyBcclxuXHRcdHJ2TW9kZWwubm90Y29tcGF0aWJsZSA9IHRydWU7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHJcblx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSAhbG9jYWxTdG9yYWdlWydnYW1lJ10gfHwgbG9jYWxTdG9yYWdlWydnYW1lJ10gPT09IFwicXVlc3Rpb25zXCI7XHJcblx0cnZNb2RlbC5nYW1lU2hha2UgPSBsb2NhbFN0b3JhZ2VbJ2dhbWUnXSA9PT0gXCJzaGFrZVwiO1xyXG5cdGlmIChydk1vZGVsLmdhbWVTaGFrZSl7XHJcblx0XHRydk1vZGVsLnNob3dDaG9pY2UgPSAhbG9jYWxTdG9yYWdlWyd0ZWFtJ107XHJcblx0XHRydk1vZGVsLnNob3dQaG9uZSA9IGxvY2FsU3RvcmFnZVsndGVhbSddO1xyXG5cdH1cclxuXHRcclxuXHJcblx0aWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpe1xyXG5cdFx0c29ja2V0ID0gaW8uY29ubmVjdChcImh0dHA6Ly9sb2NhbGhvc3Q6ODQ0M1wiKTtcclxuXHR9ZWxzZXsgXHJcblx0XHRzb2NrZXQgPSBpby5jb25uZWN0KFwiaHR0cHM6Ly9iaW5vbWVkLmZyOjg0NDNcIik7XHJcblx0fVx0XHJcblxyXG5cdHZpc2liaWxpdHkuaW5pdChzb2NrZXQpO1xyXG5cdHF1ZXN0aW9ucy5pbml0KHNvY2tldCk7XHJcblx0c2hha2UuaW5pdChzb2NrZXQpO1xyXG5cdC8vbm90aWZpY2F0aW9uLmluaXQoc29ja2V0KTtcclxuXHRcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGluaXRDb250cm9sbGVyIDogaW5pdENvbnRyb2xsZXJcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuXHJcbmZ1bmN0aW9uIHBhZ2VMb2FkKCl7XHJcblx0cml2ZXRzLmJpbmQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKSwgcmVxdWlyZSgnLi9tb2RlbC9yaXZldHNNb2RlbCcpKTtcclxuXHRcclxuXHRyZXF1aXJlKCcuL2NvbnRyb2xlci9jb250cm9sbGVyJykuaW5pdENvbnRyb2xsZXIoKTtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XHJcblxyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBpZFVzZXIgPSBsb2NhbFN0b3JhZ2VbJ3VzZXJJZCddID8gbG9jYWxTdG9yYWdlWyd1c2VySWQnXSA6ICd1c2VyJytuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxubG9jYWxTdG9yYWdlWyd1c2VySWQnXSA9IGlkVXNlcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGlkIDogaWRVc2VyLFxyXG5cdGFsbG93UmVzcCA6IHRydWVcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0c2hvd1F1ZXN0aW9uIDogdHJ1ZSwgXHJcblx0aGlkZU1lc3NhZ2UgOiB0cnVlLFxyXG5cdG5vdGNvbXBhdGlibGUgOiBmYWxzZSxcclxuXHRnYW1lUXVlc3Rpb24gOiB0cnVlLFxyXG5cdGdhbWVTaGFrZSA6IGZhbHNlLFxyXG5cdHNob3dDaG9pY2UgOiB0cnVlLFxyXG5cdHNob3dQaG9uZSA6IGZhbHNlLFxyXG5cdHdpbm5lciA6IGZhbHNlLFxyXG5cdGxvb3NlciA6IGZhbHNlLFxyXG5cdHJlcEEgOiAncmVwb25zZSBBJyxcclxuXHRyZXBCIDogJ3JlcG9uc2UgQicsXHJcblx0cmVwQyA6ICdyZXBvbnNlIEMnLFxyXG5cdHJlcEQgOiAncmVwb25zZSBEJyxcclxuXHRyZXNwQVNlbGVjdCA6IGZhbHNlLFxyXG5cdHJlc3BCU2VsZWN0IDogZmFsc2UsXHJcblx0cmVzcENTZWxlY3QgOiBmYWxzZSxcclxuXHRyZXNwRFNlbGVjdCA6IGZhbHNlXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmxldCBydk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvcml2ZXRzTW9kZWwnKSxcclxuXHRnYW1lTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9nYW1lTW9kZWwnKSxcclxuXHR2aWJyYXRpb24gPSByZXF1aXJlKCcuLi9zZW5zb3JzL3ZpYnJhdGlvbicpLFxyXG5cdHNvY2tldCA9IG51bGwsXHJcblx0dmFsdWUgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gY2xpY2tSZXNwKGV2ZW50KXtcclxuIFxyXG4gXHRpZiAoIXJ2TW9kZWwuaGlkZU1lc3NhZ2Upe1xyXG4gXHRcdHJldHVybjtcclxuIFx0fVxyXG5cdGxldCBlbHQgPSBldmVudC5zcmNFbGVtZW50O1xyXG5cdGxldCBzZW5kTWVzc2FnZSA9IHRydWU7XHJcblx0bGV0IHR5cGUgPSAnbmV3UmVzcCc7XHJcblx0c3dpdGNoIChlbHQuaWQpe1xyXG5cdFx0Y2FzZSBcInJlc3BBXCI6XHJcblx0XHRcdHZhbHVlID0gJ0EnO1xyXG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQlNlbGVjdCBcclxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BDU2VsZWN0IFxyXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xyXG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcclxuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcEFTZWxlY3Qpe1xyXG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgXCJyZXNwQlwiOlxyXG5cdFx0XHR2YWx1ZSA9ICdCJztcclxuXHRcdFx0aWYgKHJ2TW9kZWwucmVzcEFTZWxlY3QgXHJcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCBcclxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BEU2VsZWN0KXtcclxuXHRcdFx0XHR0eXBlID0gJ3JlU2VuZCc7XHJcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSB0cnVlO1xyXG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdH1lbHNlIGlmIChydk1vZGVsLnJlc3BCU2VsZWN0KXtcclxuXHRcdFx0XHRzZW5kTWVzc2FnZSA9IGZhbHNlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwicmVzcENcIjpcclxuXHRcdFx0dmFsdWUgPSAnQyc7XHJcblx0XHRcdGlmIChydk1vZGVsLnJlc3BBU2VsZWN0IFxyXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcEJTZWxlY3QgXHJcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwRFNlbGVjdCl7XHJcblx0XHRcdFx0dHlwZSA9ICdyZVNlbmQnO1xyXG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IHRydWU7XHJcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xyXG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwQ1NlbGVjdCl7XHJcblx0XHRcdFx0c2VuZE1lc3NhZ2UgPSBmYWxzZTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBcInJlc3BEXCI6XHJcblx0XHRcdHZhbHVlID0gJ0QnO1xyXG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCBcclxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BCU2VsZWN0IFxyXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcENTZWxlY3Qpe1xyXG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcclxuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gdHJ1ZTtcclxuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xyXG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRicmVhaztcclxuXHR9XHJcblxyXG5cdGlmIChzZW5kTWVzc2FnZSl7XHJcblx0XHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XHJcblx0XHRcdHR5cGUgOiAnZ2FtZScsXHJcblx0XHRcdGlkIDogZ2FtZU1vZGVsLmlkLFxyXG5cdFx0XHRldmVudFR5cGUgOiB0eXBlLFxyXG5cdFx0XHR0aW1lc3RhbXAgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuXHRcdFx0cmVzcCA6IHZhbHVlXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdChzb2NrZXRUb1NldCl7XHJcblx0c29ja2V0ID0gc29ja2V0VG9TZXQ7XHJcblx0cnZNb2RlbC5jbGlja1Jlc3AgPSBjbGlja1Jlc3A7XHJcblxyXG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG5cdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXHJcblx0ICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcclxuXHQgICAgICAgbW9kZTogJ2NvcnMnLFxyXG5cdCAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XHJcblxyXG5cdHNvY2tldC5vbignY29uZmlnJywgZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdGNvbnNvbGUuaW5mbyhkYXRhKTtcclxuXHRcdGlmIChkYXRhLnR5cGUgPT09ICdnYW1lJyAmJiBkYXRhLmV2ZW50VHlwZSA9PT0gJ2NoYW5nZVF1ZXN0aW9uJyl7XHJcblx0XHRcdGxvY2FsU3RvcmFnZVsnZ2FtZSddID0gXCJxdWVzdGlvbnNcIjtcclxuXHRcdFx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSB0cnVlO1xyXG5cdFx0XHRydk1vZGVsLmdhbWVTaGFrZSA9IGZhbHNlO1xyXG5cdFx0XHRydk1vZGVsLmhpZGVNZXNzYWdlID0gdHJ1ZTtcclxuXHRcdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSB0cnVlO1xyXG5cdFx0XHRydk1vZGVsLnJlcEEgPSBkYXRhLnJlcEE7XHJcblx0XHRcdHJ2TW9kZWwucmVwQiA9IGRhdGEucmVwQjtcclxuXHRcdFx0cnZNb2RlbC5yZXBDID0gZGF0YS5yZXBDO1xyXG5cdFx0XHRydk1vZGVsLnJlcEQgPSBkYXRhLnJlcEQ7XHJcblx0XHRcdHZhbHVlID0gbnVsbDtcclxuXHRcdH1lbHNlIGlmIChkYXRhLnR5cGUgPT09ICdnYW1lJyAmJiBkYXRhLmV2ZW50VHlwZSA9PT0gJ2hpZGVRdWVzdGlvbicpe1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2VbJ2dhbWUnXSA9IFwicXVlc3Rpb25zXCI7XHJcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcclxuXHRcdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSBmYWxzZTtcclxuXHRcdFx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSB0cnVlO1xyXG5cdFx0XHRydk1vZGVsLmdhbWVTaGFrZSA9IGZhbHNlO1xyXG5cdFx0fWVsc2UgaWYgKGRhdGEudHlwZSA9PT0gJ2dhbWUnICYmIGRhdGEuZXZlbnRUeXBlID09PSAnYW5zd2VyJyl7XHJcblx0XHRcdGlmICh2YWx1ZSA9PT0gZGF0YS52YWx1ZSl7XHJcblx0XHRcdFx0dmlicmF0aW9uLnZpYnJhdGUoWzIwMCwxMDAsMjAwXSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHZpYnJhdGlvbi52aWJyYXRlKFsxMDAwXSk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXRhLnR5cGUgPT09ICdnYW1lJyAmJiBkYXRhLmV2ZW50VHlwZSA9PT0gJ3dpbm5lcnMnKXtcclxuXHRcdFx0XHJcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSB0cnVlO1xyXG5cdFx0XHRydk1vZGVsLnNob3dRdWVzdGlvbiA9IGZhbHNlO1xyXG5cdFx0XHRydk1vZGVsLmdhbWVRdWVzdGlvbiA9IHRydWU7XHJcblx0XHRcdHJ2TW9kZWwuZ2FtZVNoYWtlID0gZmFsc2U7XHJcblx0XHRcdGlmIChkYXRhLnZhbHVlLmluZGV4T2YoZ2FtZU1vZGVsLmlkKSAhPSAtMSl7XHJcblx0XHRcdFx0cnZNb2RlbC53aW5uZXIgPSB0cnVlO1xyXG5cdFx0XHRcdHZpYnJhdGlvbi52aWJyYXRlKFs1MDAsMjAwLDUwMF0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRydk1vZGVsLmxvb3NlciA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bGV0IHByb3RvY29sID0gJyc7XHJcbiAgICBsZXQgc2NoZW1lID0gJydcclxuICAgIGxldCBiYXNpY0hvc3QgPSAnJ1xyXG4gICAgaWYgKGxvY2F0aW9uLmhvc3QgJiYgbG9jYXRpb24uaG9zdC5pbmRleE9mKCdsb2NhbGhvc3QnKSA9PT0gLTEpe1xyXG4gICAgXHRwcm90b2NvbCA9ICdodHRwcyc7XHJcbiAgICBcdHNjaGVtZSA9ICc6Ly8nO1xyXG4gICAgXHRiYXNpY0hvc3QgPSAnYmlub21lZC5mcjo4NDQzJztcclxuICAgIH1cclxuXHJcblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke3Byb3RvY29sfSR7c2NoZW1lfSR7YmFzaWNIb3N0fS9jdXJyZW50U3RhdGVgLG15SW5pdCk7XHJcblx0ZmV0Y2gobXlSZXF1ZXN0KVxyXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0fSlcclxuXHQudGhlbihmdW5jdGlvbihqc29uKXtcclxuXHRcdGlmIChqc29uLmhpZGVRdWVzdGlvbil7XHJcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSAhanNvbi5oaWRlUXVlc3Rpb247XHJcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gcnZNb2RlbC5oaWRlTWVzc2FnZTtcclxuXHRcdH1cclxuXHRcdGlmIChqc29uLnNjb3JlICYmIGpzb24uc2NvcmUudXNlcnMgJiYganNvbi5zY29yZS51c2Vyc1tnYW1lTW9kZWwuaWRdKXtcclxuXHRcdFx0c3dpdGNoKGpzb24uc2NvcmUudXNlcnNbZ2FtZU1vZGVsLmlkXSl7XHJcblx0XHRcdFx0Y2FzZSAnQSc6XHJcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ0InOlxyXG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IHRydWU7XHJcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdDJzpcclxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xyXG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnRCc6XHJcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHRcdFxyXG5cdH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0IDogaW5pdFxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBjYWxsYmFjayA9IG51bGw7XHJcblxyXG4vLyBMaXN0ZW5lciBvZiBkZXZpZU1vdGlvblxyXG52YXIgZGV2aWNlTW90aW9uTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7ICAgICAgICBcclxuXHR2YXIgeCA9IGV2ZW50LmFjY2VsZXJhdGlvbi54O1xyXG5cdHZhciB5ID0gZXZlbnQuYWNjZWxlcmF0aW9uLnk7XHJcblx0dmFyIHogPSBldmVudC5hY2NlbGVyYXRpb24uejtcclxuXHRjYWxsYmFjayhNYXRoLmFicyh4KSk7XHJcblx0Ly91cGRhdGVQZXJjZW50KCk7XHJcbn1cclxuXHJcbi8vIFdlIGFkZCB0aGUgbGlzdGVuZXJcclxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcclxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgZGV2aWNlTW90aW9uTGlzdGVuZXIsIGZhbHNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xyXG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBkZXZpY2VNb3Rpb25MaXN0ZW5lciwgZmFsc2UpOyAgICAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoY2FsbGJhY2tNb3Rpb24pe1xyXG5cdGNhbGxiYWNrID0gY2FsbGJhY2tNb3Rpb25cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHJlZ2lzdGVyIDogcmVnaXN0ZXIsXHJcblx0dW5yZWdpc3RlciA6IHVucmVnaXN0ZXIsXHJcblx0aW5pdCA6IGluaXRcclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbiBcdC8vIFdlIHZpYnJhdGUgYWNjb3JkaW5nIHRvIHRoZSBzZXF1ZW5jZVxyXG5cdGZ1bmN0aW9uIHZpYnJhdGUoYXJyYXlPZlZpYnJhdGlvbil7XHJcblx0XHR3aW5kb3cubmF2aWdhdG9yLnZpYnJhdGUoYXJyYXlPZlZpYnJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XHJcblx0XHRuYXZpZ2F0b3IudmlicmF0ZSgwKTsgICAgICAgIFxyXG5cdH1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHR2aWJyYXRlIDogdmlicmF0ZSxcclxuXHR1bnJlZ2lzdGVyIDogdW5yZWdpc3RlclxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgc29ja2V0ID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIG1hbmFnZVZpc2liaWxpdHkoKXtcclxuXHQvLyBTZXQgdGhlIG5hbWUgb2YgdGhlIGhpZGRlbiBwcm9wZXJ0eSBhbmQgdGhlIGNoYW5nZSBldmVudCBmb3IgdmlzaWJpbGl0eVxyXG5cdHZhciBoaWRkZW4sIHZpc2liaWxpdHlDaGFuZ2U7IFxyXG5cdGlmICh0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7IC8vIE9wZXJhIDEyLjEwIGFuZCBGaXJlZm94IDE4IGFuZCBsYXRlciBzdXBwb3J0IFxyXG5cdCAgaGlkZGVuID0gXCJoaWRkZW5cIjtcclxuXHQgIHZpc2liaWxpdHlDaGFuZ2UgPSBcInZpc2liaWxpdHljaGFuZ2VcIjtcclxuXHR9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHQgIGhpZGRlbiA9IFwibW96SGlkZGVuXCI7XHJcblx0ICB2aXNpYmlsaXR5Q2hhbmdlID0gXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCI7XHJcblx0fSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHQgIGhpZGRlbiA9IFwibXNIaWRkZW5cIjtcclxuXHQgIHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiO1xyXG5cdH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdCAgaGlkZGVuID0gXCJ3ZWJraXRIaWRkZW5cIjtcclxuXHQgIHZpc2liaWxpdHlDaGFuZ2UgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIjtcclxuXHR9XHJcblx0IFxyXG5cdC8vIFdhcm4gaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGFkZEV2ZW50TGlzdGVuZXIgb3IgdGhlIFBhZ2UgVmlzaWJpbGl0eSBBUElcclxuXHRpZiAodHlwZW9mIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwidW5kZWZpbmVkXCIgfHwgXHJcblx0ICB0eXBlb2YgZG9jdW1lbnRbaGlkZGVuXSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdCAgYWxlcnQoXCJUaGlzIGRlbW8gcmVxdWlyZXMgYSBicm93c2VyLCBzdWNoIGFzIEdvb2dsZSBDaHJvbWUgb3IgRmlyZWZveCwgdGhhdCBzdXBwb3J0cyB0aGUgUGFnZSBWaXNpYmlsaXR5IEFQSS5cIik7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vIEhhbmRsZSBwYWdlIHZpc2liaWxpdHkgY2hhbmdlICAgXHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGZ1bmN0aW9uIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UoKXtcclxuXHRcdFx0aWYgKGRvY3VtZW50W2hpZGRlbl0pIHtcclxuXHRcdFx0XHRzb2NrZXQuZGlzY29ubmVjdCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNvY2tldC5jb25uZWN0KCk7XHJcblx0XHRcdFx0Ly9zb2NrZXQuaW8ucmVjb25uZWN0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0sIGZhbHNlKTtcclxuXHQgICAgXHJcblx0ICBcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xyXG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xyXG5cclxuXHRtYW5hZ2VWaXNpYmlsaXR5KCk7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0IDogaW5pdFx0XHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmxldCBydk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvcml2ZXRzTW9kZWwnKSxcclxuXHRnYW1lTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9nYW1lTW9kZWwnKSxcclxuXHRtb3Rpb24gPSByZXF1aXJlKCcuLi9zZW5zb3JzL2RldmljZW1vdGlvbicpLFxyXG5cdHNvY2tldCA9IG51bGw7XHJcblxyXG5mdW5jdGlvbiBjaG9pY2VUZWFtKGV2ZW50KXtcclxuXHRpZiAoZXZlbnQuc3JjRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nocm9tZScpKXtcclxuXHRcdGxvY2FsU3RvcmFnZVsndGVhbSddID0gMjtcclxuXHR9ZWxzZXtcclxuXHRcdGxvY2FsU3RvcmFnZVsndGVhbSddID0gMTtcclxuXHR9XHJcblxyXG5cdHJ2TW9kZWwuc2hvd0Nob2ljZSA9IGZhbHNlO1xyXG5cdHJ2TW9kZWwuc2hvd1Bob25lID0gdHJ1ZTtcclxuXHRtb3Rpb24ucmVnaXN0ZXIoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNhbGxCYWNrTW90aW9uKG1vdmUpe1xyXG5cdGxldCB0ZWFtID0gbG9jYWxTdG9yYWdlWyd0ZWFtJ107XHJcblx0c29ja2V0LmVtaXQoJ3NlbnNvcicsIHtcclxuXHRcdGlkIDogZ2FtZU1vZGVsLmlkLFxyXG5cdFx0dHlwZTonZGV2aWNlbW90aW9uJyxcclxuXHRcdCd0ZWFtJyA6IHRlYW0sXHJcblx0XHR2YWx1ZTogbW92ZVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KHNvY2tldFRvU2V0KXtcclxuXHJcblx0c29ja2V0ID0gc29ja2V0VG9TZXQ7XHJcblx0cnZNb2RlbC5jaG9pY2VUZWFtID0gY2hvaWNlVGVhbTtcclxuXHJcblx0bW90aW9uLmluaXQoY2FsbEJhY2tNb3Rpb24pO1xyXG5cclxuXHRzb2NrZXQub24oJ2NvbmZpZycsIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRpZiAoZGF0YS50eXBlID09PSAnZ2FtZScgJiYgZGF0YS5ldmVudFR5cGUgPT09ICdiYXR0ZXJ5Jyl7XHJcblx0XHRcdGxvY2FsU3RvcmFnZVsnZ2FtZSddID0gXCJzaGFrZVwiO1xyXG5cdFx0XHRydk1vZGVsLmdhbWVRdWVzdGlvbiA9ICFkYXRhLnNob3c7XHJcblx0XHRcdHJ2TW9kZWwuZ2FtZVNoYWtlID0gZGF0YS5zaG93O1x0XHJcblx0XHRcdHJ2TW9kZWwuc2hvd0Nob2ljZSA9ICFsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcclxuXHRcdFx0cnZNb2RlbC5zaG93UGhvbmUgPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcclxuXHRcdFx0aWYgKGxvY2FsU3RvcmFnZVsndGVhbSddKXtcdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChkYXRhLnNob3cpe1xyXG5cdFx0XHRcdFx0bW90aW9uLnJlZ2lzdGVyKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRtb3Rpb24udW5yZWdpc3RlcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRpZiAocnZNb2RlbC5nYW1lU2hha2Upe1xyXG5cdFx0bW90aW9uLnJlZ2lzdGVyKCk7IFxyXG5cdH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGluaXQgOiBpbml0XHJcbn07IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiBBcGlzIGV4cG9zZWRcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZGV2aWNlTW90aW9uQXZhaWxhYmxlKCl7XHJcblx0cmV0dXJuIHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gdmlicmF0aW9uQXZhaWxhYmxlKCl7XHJcblx0cmV0dXJuIG5hdmlnYXRvci52aWJyYXRlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm94aW1pdHlBdmFpbGFibGUoKXtcclxuXHRyZXR1cm4gd2luZG93LkRldmljZVByb3hpbWl0eUV2ZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXZhaWxhYmxlKCl7XHJcblx0cmV0dXJuIHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT0gXCJ1bmRlZmluZWRcIlxyXG5cdFx0XHR8fCB0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0fHwgdHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0fHwgdHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPSBcInVuZGVmaW5lZFwiXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQ29tcGF0KCl7XHJcblx0Y29uc29sZS5sb2coJ0RldmljZSBNb3Rpb24gOiAlcycsIGRldmljZU1vdGlvbkF2YWlsYWJsZSgpKTtcclxuXHRjb25zb2xlLmxvZygnVmlicmF0aW9uIDogJXMnLCB2aWJyYXRpb25BdmFpbGFibGUoKSk7XHJcblx0Y29uc29sZS5sb2coJ1Zpc2liaWxpdHkgOiAlcycsIHZpc2liaWxpdHlBdmFpbGFibGUoKSk7XHJcblx0Ly9jb25zb2xlLmxvZygnUHJveGltaXR5IDogJXMnLCBwcm94aW1pdHlBdmFpbGFibGUoKSk7XHJcblx0cmV0dXJuIGRldmljZU1vdGlvbkF2YWlsYWJsZSgpXHJcblx0ICYmIHZpYnJhdGlvbkF2YWlsYWJsZSgpXHJcblx0ICYmIHZpc2liaWxpdHlBdmFpbGFibGUoKTtcclxuXHQgLy8mJiBwcm94aW1pdHlBdmFpbGFibGUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0NvbXBhdDsiLCIndXNlIHN0cmljdCdcclxuXHJcbmZ1bmN0aW9uIHJpcHBsZUVmZmVjdChldmVudCl7XHJcblx0bGV0IGVsdCA9IGV2ZW50LnNyY0VsZW1lbnQ7XHJcblx0aWYgKCFlbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYWInKSlcclxuXHRcdHJldHVybjtcclxuXHJcbiAgICAgIFxyXG4gICAgdmFyIGRpdlBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpLFxyXG4gICAgXHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKSxcclxuICAgIFx0eFBvcyA9IGV2ZW50LnBhZ2VYIC0gZWx0Lm9mZnNldExlZnQsXHJcbiAgICAgIFx0eVBvcyA9IGV2ZW50LnBhZ2VZIC0gZWx0Lm9mZnNldFRvcDtcclxuICAgICAgXHJcbiAgICBkaXZQYXJlbnQuY2xhc3NMaXN0LmFkZCgncmlwcGxlJyk7XHJcbiAgICBkaXZQYXJlbnQuc3R5bGUuaGVpZ2h0ID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XHJcbiAgICBkaXZQYXJlbnQuc3R5bGUudG9wID0gLShlbHQuY2xpZW50SGVpZ2h0IC8gMikrXCJweFwiO1xyXG4gICAgZGl2UGFyZW50LnN0eWxlLndpZHRoID0gZWx0LmNsaWVudFdpZHRoK1wicHhcIjtcclxuICAgICAgXHJcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgncmlwcGxlLWVmZmVjdCcpOyBcclxuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSBlbHQuY2xpZW50SGVpZ2h0K1wicHhcIjtcclxuICAgIGRpdi5zdHlsZS53aWR0aCA9IGVsdC5jbGllbnRIZWlnaHQrXCJweFwiO1xyXG4gICAgZGl2LnN0eWxlLnRvcCA9ICh5UG9zIC0gKGVsdC5jbGllbnRIZWlnaHQvMikpK1wicHhcIjtcclxuICAgIGRpdi5zdHlsZS5sZWZ0ID0gKHhQb3MgLSAoZWx0LmNsaWVudEhlaWdodC8yKSkrXCJweFwiO1xyXG4gICAgZGl2LnN0eWxlLmJhY2tncm91bmQgPSAgXCIjNDM4ODQ0XCI7XHJcbiAgICAgIFxyXG4gICAgZGl2UGFyZW50LmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICBlbHQuYXBwZW5kQ2hpbGQoZGl2UGFyZW50KTtcclxuXHJcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZWx0LnJlbW92ZUNoaWxkKGRpdlBhcmVudCk7XHJcbiAgICAgIH0sIDIwMDApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyaXBwbGVFZmZlY3QgOiByaXBwbGVFZmZlY3RcclxufSJdfQ==
