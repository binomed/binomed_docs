(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
var rvModel = require('../model/rivetsModel'),
	utils = require('../utils/utils'),
	gameModel = require('../model/gameModel'),
	compat = require('../utils/compat'), 	
	questions = require('../questions/questions'),
	shake = require('../shake/shake'),
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
		socket = io.connect();
	}	

	questions.init(socket);
	shake.init(socket);
	

}

module.exports = {
	initController : initController
}
},{"../model/gameModel":3,"../model/rivetsModel":4,"../questions/questions":5,"../shake/shake":7,"../utils/compat":8,"../utils/utils":9}],2:[function(require,module,exports){
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
	socket = null;

function clickResp(event){
 
 	if (!rvModel.hideMessage){
 		return;
 	}
	let elt = event.srcElement;
	let sendMessage = true;
	let type = 'newResp';
	let value = null;
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


function init(socket){
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
		}else if (data.type === 'game' && data.eventType === 'hideQuestion'){
			localStorage['game'] = "questions";
			rvModel.hideMessage = false;
			rvModel.showQuestion = false;
			rvModel.gameQuestion = true;
			rvModel.gameShake = false;
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
},{"../model/gameModel":3,"../model/rivetsModel":4}],6:[function(require,module,exports){
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
},{"../model/gameModel":3,"../model/rivetsModel":4,"../sensors/devicemotion":6}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvY29udHJvbGVyL2NvbnRyb2xsZXIuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvZ2FtZS5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9tb2RlbC9nYW1lTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvbW9kZWwvcml2ZXRzTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvcXVlc3Rpb25zL3F1ZXN0aW9ucy5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zZW5zb3JzL2RldmljZW1vdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9zaGFrZS9zaGFrZS5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS91dGlscy9jb21wYXQuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvdXRpbHMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xudmFyIHJ2TW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9yaXZldHNNb2RlbCcpLFxuXHR1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyksXG5cdGdhbWVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL2dhbWVNb2RlbCcpLFxuXHRjb21wYXQgPSByZXF1aXJlKCcuLi91dGlscy9jb21wYXQnKSwgXHRcblx0cXVlc3Rpb25zID0gcmVxdWlyZSgnLi4vcXVlc3Rpb25zL3F1ZXN0aW9ucycpLFxuXHRzaGFrZSA9IHJlcXVpcmUoJy4uL3NoYWtlL3NoYWtlJyksXG5cdHNvY2tldCA9IG51bGw7XG5cblxuXG5cbmZ1bmN0aW9uIGluaXRDb250cm9sbGVyKCl7XG5cblx0aWYgKCFjb21wYXQoKSl7XG5cdFx0cnZNb2RlbC5oaWRlTWVzc2FnZSA9IHRydWU7XG5cdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSBmYWxzZTtcblx0XHRydk1vZGVsLm5vdGNvbXBhdGlibGUgPSB0cnVlO1xuXHRcdHJldHVybjtcblx0fVxuXG5cblx0cnZNb2RlbC5nYW1lUXVlc3Rpb24gPSAhbG9jYWxTdG9yYWdlWydnYW1lJ10gfHwgbG9jYWxTdG9yYWdlWydnYW1lJ10gPT09IFwicXVlc3Rpb25zXCI7XG5cdHJ2TW9kZWwuZ2FtZVNoYWtlID0gbG9jYWxTdG9yYWdlWydnYW1lJ10gPT09IFwic2hha2VcIjtcblx0aWYgKHJ2TW9kZWwuZ2FtZVNoYWtlKXtcblx0XHRydk1vZGVsLnNob3dDaG9pY2UgPSAhbG9jYWxTdG9yYWdlWyd0ZWFtJ107XG5cdFx0cnZNb2RlbC5zaG93UGhvbmUgPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0fVxuXHRcblxuXHRpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjMwMDBcIil7XG5cdFx0c29ja2V0ID0gaW8uY29ubmVjdChcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKTtcblx0fWVsc2V7IFxuXHRcdHNvY2tldCA9IGlvLmNvbm5lY3QoKTtcblx0fVx0XG5cblx0cXVlc3Rpb25zLmluaXQoc29ja2V0KTtcblx0c2hha2UuaW5pdChzb2NrZXQpO1xuXHRcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdENvbnRyb2xsZXIgOiBpbml0Q29udHJvbGxlclxufSIsIid1c2Ugc3RyaWN0J1xuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkKCl7XG5cdHJpdmV0cy5iaW5kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JyksIHJlcXVpcmUoJy4vbW9kZWwvcml2ZXRzTW9kZWwnKSk7XG5cdFxuXHRyZXF1aXJlKCcuL2NvbnRyb2xlci9jb250cm9sbGVyJykuaW5pdENvbnRyb2xsZXIoKTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG5cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgaWRVc2VyID0gbG9jYWxTdG9yYWdlWyd1c2VySWQnXSA/IGxvY2FsU3RvcmFnZVsndXNlcklkJ10gOiAndXNlcicrbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5sb2NhbFN0b3JhZ2VbJ3VzZXJJZCddID0gaWRVc2VyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aWQgOiBpZFVzZXIsXG5cdGFsbG93UmVzcCA6IHRydWVcbn0iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHNob3dRdWVzdGlvbiA6IHRydWUsIFxuXHRoaWRlTWVzc2FnZSA6IHRydWUsXG5cdG5vdGNvbXBhdGlibGUgOiBmYWxzZSxcblx0Z2FtZVF1ZXN0aW9uIDogdHJ1ZSxcblx0Z2FtZVNoYWtlIDogZmFsc2UsXG5cdHNob3dDaG9pY2UgOiB0cnVlLFxuXHRzaG93UGhvbmUgOiBmYWxzZSxcblx0cmVwQSA6ICdyZXBvbnNlIEEnLFxuXHRyZXBCIDogJ3JlcG9uc2UgQicsXG5cdHJlcEMgOiAncmVwb25zZSBDJyxcblx0cmVwRCA6ICdyZXBvbnNlIEQnLFxuXHRyZXNwQVNlbGVjdCA6IGZhbHNlLFxuXHRyZXNwQlNlbGVjdCA6IGZhbHNlLFxuXHRyZXNwQ1NlbGVjdCA6IGZhbHNlLFxuXHRyZXNwRFNlbGVjdCA6IGZhbHNlXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBydk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvcml2ZXRzTW9kZWwnKSxcblx0Z2FtZU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvZ2FtZU1vZGVsJyksXG5cdHNvY2tldCA9IG51bGw7XG5cbmZ1bmN0aW9uIGNsaWNrUmVzcChldmVudCl7XG4gXG4gXHRpZiAoIXJ2TW9kZWwuaGlkZU1lc3NhZ2Upe1xuIFx0XHRyZXR1cm47XG4gXHR9XG5cdGxldCBlbHQgPSBldmVudC5zcmNFbGVtZW50O1xuXHRsZXQgc2VuZE1lc3NhZ2UgPSB0cnVlO1xuXHRsZXQgdHlwZSA9ICduZXdSZXNwJztcblx0bGV0IHZhbHVlID0gbnVsbDtcblx0c3dpdGNoIChlbHQuaWQpe1xuXHRcdGNhc2UgXCJyZXNwQVwiOlxuXHRcdFx0dmFsdWUgPSAnQSc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJlc3BCXCI6XG5cdFx0XHR2YWx1ZSA9ICdCJztcblx0XHRcdGlmIChydk1vZGVsLnJlc3BBU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BDU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BEU2VsZWN0KXtcblx0XHRcdFx0dHlwZSA9ICdyZVNlbmQnO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdH1lbHNlIGlmIChydk1vZGVsLnJlc3BCU2VsZWN0KXtcblx0XHRcdFx0c2VuZE1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRicmVhaztcblx0XHRjYXNlIFwicmVzcENcIjpcblx0XHRcdHZhbHVlID0gJ0MnO1xuXHRcdFx0aWYgKHJ2TW9kZWwucmVzcEFTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcEJTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xuXHRcdFx0XHR0eXBlID0gJ3JlU2VuZCc7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcENTZWxlY3Qpe1xuXHRcdFx0XHRzZW5kTWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyZXNwRFwiOlxuXHRcdFx0dmFsdWUgPSAnRCc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRpZiAoc2VuZE1lc3NhZ2Upe1xuXHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0XHRpZCA6IGdhbWVNb2RlbC5pZCxcblx0XHRcdGV2ZW50VHlwZSA6IHR5cGUsXG5cdFx0XHRyZXNwIDogdmFsdWVcblx0XHR9KTtcblx0fVxuXG59XG5cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQpe1xuXHRydk1vZGVsLmNsaWNrUmVzcCA9IGNsaWNrUmVzcDtcblxuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcblx0ICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcblx0ICAgICAgIG1vZGU6ICdjb3JzJyxcblx0ICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRzb2NrZXQub24oJ2NvbmZpZycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0aWYgKGRhdGEudHlwZSA9PT0gJ2dhbWUnICYmIGRhdGEuZXZlbnRUeXBlID09PSAnY2hhbmdlUXVlc3Rpb24nKXtcblx0XHRcdGxvY2FsU3RvcmFnZVsnZ2FtZSddID0gXCJxdWVzdGlvbnNcIjtcblx0XHRcdHJ2TW9kZWwuZ2FtZVF1ZXN0aW9uID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwuZ2FtZVNoYWtlID0gZmFsc2U7XG5cdFx0XHRydk1vZGVsLmhpZGVNZXNzYWdlID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwucmVwQSA9IGRhdGEucmVwQTtcblx0XHRcdHJ2TW9kZWwucmVwQiA9IGRhdGEucmVwQjtcblx0XHRcdHJ2TW9kZWwucmVwQyA9IGRhdGEucmVwQztcblx0XHRcdHJ2TW9kZWwucmVwRCA9IGRhdGEucmVwRDtcblx0XHR9ZWxzZSBpZiAoZGF0YS50eXBlID09PSAnZ2FtZScgJiYgZGF0YS5ldmVudFR5cGUgPT09ICdoaWRlUXVlc3Rpb24nKXtcblx0XHRcdGxvY2FsU3RvcmFnZVsnZ2FtZSddID0gXCJxdWVzdGlvbnNcIjtcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gZmFsc2U7XG5cdFx0XHRydk1vZGVsLmdhbWVRdWVzdGlvbiA9IHRydWU7XG5cdFx0XHRydk1vZGVsLmdhbWVTaGFrZSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAvY3VycmVudFN0YXRlYCxteUluaXQpO1xuXHRmZXRjaChteVJlcXVlc3QpXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihqc29uKXtcblx0XHRpZiAoanNvbi5oaWRlUXVlc3Rpb24pe1xuXHRcdFx0cnZNb2RlbC5oaWRlTWVzc2FnZSA9ICFqc29uLmhpZGVRdWVzdGlvbjtcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gcnZNb2RlbC5oaWRlTWVzc2FnZTtcblx0XHR9XG5cdFx0aWYgKGpzb24uc2NvcmUgJiYganNvbi5zY29yZS51c2VycyAmJiBqc29uLnNjb3JlLnVzZXJzW2dhbWVNb2RlbC5pZF0pe1xuXHRcdFx0c3dpdGNoKGpzb24uc2NvcmUudXNlcnNbZ2FtZU1vZGVsLmlkXSl7XG5cdFx0XHRcdGNhc2UgJ0EnOlxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdCJzpcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnQyc6XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0QnOlxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cdFx0XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgY2FsbGJhY2sgPSBudWxsO1xuXG4vLyBMaXN0ZW5lciBvZiBkZXZpZU1vdGlvblxudmFyIGRldmljZU1vdGlvbkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpeyAgICAgICAgXG5cdHZhciB4ID0gZXZlbnQuYWNjZWxlcmF0aW9uLng7XG5cdHZhciB5ID0gZXZlbnQuYWNjZWxlcmF0aW9uLnk7XG5cdHZhciB6ID0gZXZlbnQuYWNjZWxlcmF0aW9uLno7XG5cdGNhbGxiYWNrKE1hdGguYWJzKHgpKTtcblx0Ly91cGRhdGVQZXJjZW50KCk7XG59XG5cbi8vIFdlIGFkZCB0aGUgbGlzdGVuZXJcbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBkZXZpY2VNb3Rpb25MaXN0ZW5lciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCBkZXZpY2VNb3Rpb25MaXN0ZW5lciwgZmFsc2UpOyAgICAgICAgXG59XG5cbmZ1bmN0aW9uIGluaXQoY2FsbGJhY2tNb3Rpb24pe1xuXHRjYWxsYmFjayA9IGNhbGxiYWNrTW90aW9uXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyIDogcmVnaXN0ZXIsXG5cdHVucmVnaXN0ZXIgOiB1bnJlZ2lzdGVyLFxuXHRpbml0IDogaW5pdFxufSIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgcnZNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL3JpdmV0c01vZGVsJyksXG5cdGdhbWVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL2dhbWVNb2RlbCcpLFxuXHRtb3Rpb24gPSByZXF1aXJlKCcuLi9zZW5zb3JzL2RldmljZW1vdGlvbicpLFxuXHRzb2NrZXQgPSBudWxsO1xuXG5mdW5jdGlvbiBjaG9pY2VUZWFtKGV2ZW50KXtcblx0aWYgKGV2ZW50LnNyY0VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaHJvbWUnKSl7XG5cdFx0bG9jYWxTdG9yYWdlWyd0ZWFtJ10gPSAyO1xuXHR9ZWxzZXtcblx0XHRsb2NhbFN0b3JhZ2VbJ3RlYW0nXSA9IDE7XG5cdH1cblxuXHRydk1vZGVsLnNob3dDaG9pY2UgPSBmYWxzZTtcblx0cnZNb2RlbC5zaG93UGhvbmUgPSB0cnVlO1xuXHRtb3Rpb24ucmVnaXN0ZXIoKTtcbn1cblxuXG5mdW5jdGlvbiBjYWxsQmFja01vdGlvbihtb3ZlKXtcblx0bGV0IHRlYW0gPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0c29ja2V0LmVtaXQoJ3NlbnNvcicsIHtcblx0XHR0eXBlOidkZXZpY2Vtb3Rpb24nLFxuXHRcdCd0ZWFtJyA6IHRlYW0sXG5cdFx0dmFsdWU6IG1vdmVcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xuXHRydk1vZGVsLmNob2ljZVRlYW0gPSBjaG9pY2VUZWFtO1xuXG5cdG1vdGlvbi5pbml0KGNhbGxCYWNrTW90aW9uKTtcblxuXHRzb2NrZXQub24oJ2NvbmZpZycsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0aWYgKGRhdGEudHlwZSA9PT0gJ2dhbWUnICYmIGRhdGEuZXZlbnRUeXBlID09PSAnYmF0dGVyeScpe1xuXHRcdFx0bG9jYWxTdG9yYWdlWydnYW1lJ10gPSBcInNoYWtlXCI7XG5cdFx0XHRydk1vZGVsLmdhbWVRdWVzdGlvbiA9ICFkYXRhLnNob3c7XG5cdFx0XHRydk1vZGVsLmdhbWVTaGFrZSA9IGRhdGEuc2hvdztcdFxuXHRcdFx0cnZNb2RlbC5zaG93Q2hvaWNlID0gIWxvY2FsU3RvcmFnZVsndGVhbSddO1xuXHRcdFx0cnZNb2RlbC5zaG93UGhvbmUgPSBsb2NhbFN0b3JhZ2VbJ3RlYW0nXTtcblx0XHRcdGlmIChsb2NhbFN0b3JhZ2VbJ3RlYW0nXSl7XHRcdFx0XHRcblx0XHRcdFx0aWYgKGRhdGEuc2hvdyl7XG5cdFx0XHRcdFx0bW90aW9uLnJlZ2lzdGVyKCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdG1vdGlvbi51bnJlZ2lzdGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGlmIChydk1vZGVsLmdhbWVTaGFrZSl7XG5cdFx0bW90aW9uLnJlZ2lzdGVyKCk7IFxuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQgOiBpbml0XG59OyIsIid1c2Ugc3RyaWN0J1xuXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogQXBpcyBleHBvc2VkXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKi9cblxuZnVuY3Rpb24gZGV2aWNlTW90aW9uQXZhaWxhYmxlKCl7XG5cdHJldHVybiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQ7XG59XG5cbmZ1bmN0aW9uIHZpYnJhdGlvbkF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gbmF2aWdhdG9yLnZpYnJhdGU7XG59XG5cbmZ1bmN0aW9uIHByb3hpbWl0eUF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gd2luZG93LkRldmljZVByb3hpbWl0eUV2ZW50O1xufVxuXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXZhaWxhYmxlKCl7XG5cdHJldHVybiB0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9IFwidW5kZWZpbmVkXCJcblx0XHRcdHx8IHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT0gXCJ1bmRlZmluZWRcIlxuXHRcdFx0fHwgdHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9IFwidW5kZWZpbmVkXCJcblx0XHRcdHx8IHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT0gXCJ1bmRlZmluZWRcIlxufVxuXG5mdW5jdGlvbiBpc0NvbXBhdCgpe1xuXHRjb25zb2xlLmxvZygnRGV2aWNlIE1vdGlvbiA6ICVzJywgZGV2aWNlTW90aW9uQXZhaWxhYmxlKCkpO1xuXHRjb25zb2xlLmxvZygnVmlicmF0aW9uIDogJXMnLCB2aWJyYXRpb25BdmFpbGFibGUoKSk7XG5cdGNvbnNvbGUubG9nKCdWaXNpYmlsaXR5IDogJXMnLCB2aXNpYmlsaXR5QXZhaWxhYmxlKCkpO1xuXHQvL2NvbnNvbGUubG9nKCdQcm94aW1pdHkgOiAlcycsIHByb3hpbWl0eUF2YWlsYWJsZSgpKTtcblx0cmV0dXJuIGRldmljZU1vdGlvbkF2YWlsYWJsZSgpXG5cdCAmJiB2aWJyYXRpb25BdmFpbGFibGUoKVxuXHQgJiYgdmlzaWJpbGl0eUF2YWlsYWJsZSgpO1xuXHQgLy8mJiBwcm94aW1pdHlBdmFpbGFibGUoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0NvbXBhdDsiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gcmlwcGxlRWZmZWN0KGV2ZW50KXtcblx0bGV0IGVsdCA9IGV2ZW50LnNyY0VsZW1lbnQ7XG5cdGlmICghZWx0LmNsYXNzTGlzdC5jb250YWlucygnZmFiJykpXG5cdFx0cmV0dXJuO1xuXG4gICAgICBcbiAgICB2YXIgZGl2UGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyksXG4gICAgXHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKSxcbiAgICBcdHhQb3MgPSBldmVudC5wYWdlWCAtIGVsdC5vZmZzZXRMZWZ0LFxuICAgICAgXHR5UG9zID0gZXZlbnQucGFnZVkgLSBlbHQub2Zmc2V0VG9wO1xuICAgICAgXG4gICAgZGl2UGFyZW50LmNsYXNzTGlzdC5hZGQoJ3JpcHBsZScpO1xuICAgIGRpdlBhcmVudC5zdHlsZS5oZWlnaHQgPSBlbHQuY2xpZW50SGVpZ2h0K1wicHhcIjtcbiAgICBkaXZQYXJlbnQuc3R5bGUudG9wID0gLShlbHQuY2xpZW50SGVpZ2h0IC8gMikrXCJweFwiO1xuICAgIGRpdlBhcmVudC5zdHlsZS53aWR0aCA9IGVsdC5jbGllbnRXaWR0aCtcInB4XCI7XG4gICAgICBcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgncmlwcGxlLWVmZmVjdCcpOyBcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2LnN0eWxlLnRvcCA9ICh5UG9zIC0gKGVsdC5jbGllbnRIZWlnaHQvMikpK1wicHhcIjtcbiAgICBkaXYuc3R5bGUubGVmdCA9ICh4UG9zIC0gKGVsdC5jbGllbnRIZWlnaHQvMikpK1wicHhcIjtcbiAgICBkaXYuc3R5bGUuYmFja2dyb3VuZCA9ICBcIiM0Mzg4NDRcIjtcbiAgICAgIFxuICAgIGRpdlBhcmVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIGVsdC5hcHBlbmRDaGlsZChkaXZQYXJlbnQpO1xuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBlbHQucmVtb3ZlQ2hpbGQoZGl2UGFyZW50KTtcbiAgICAgIH0sIDIwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmlwcGxlRWZmZWN0IDogcmlwcGxlRWZmZWN0XG59Il19
