(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
var rvModel = require('../model/rivetsModel'),
	utils = require('../utils/utils'),
	gameModel = require('../model/gameModel'),
	compat = require('../utils/compat'), 
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

function initController(){

	if (!compat()){
		rvModel.hideMessage = true;
		rvModel.showQuestion = false;
		rvModel.notcompatible = true;
		return;
	}

	rvModel.clickResp = clickResp;

	if (location.port && location.port === "3000"){
		socket = io.connect("http://localhost:8000");
	}else{
		socket = io.connect();
	}
	socket.on('config', function (data) {
		if (data.type === 'game' && data.eventType === 'changeQuestion'){
			rvModel.hideMessage = true;
			rvModel.showQuestion = true;
			rvModel.repA = data.repA;
			rvModel.repB = data.repB;
			rvModel.repC = data.repC;
			rvModel.repD = data.repD;
		}else if (data.type === 'game' && data.eventType === 'hideQuestion'){
			rvModel.hideMessage = false;
			rvModel.showQuestion = false;
		}
	});

	let myHeaders = new Headers();
	let myInit = { method: 'GET',
	       headers: myHeaders,
	       mode: 'cors',
	       cache: 'default' };

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
	initController : initController
}
},{"../model/gameModel":3,"../model/rivetsModel":4,"../utils/compat":5,"../utils/utils":6}],2:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvY29udHJvbGVyL2NvbnRyb2xsZXIuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvZ2FtZS5qcyIsImFkZG9uL3NjcmlwdHMvZ2FtZS9tb2RlbC9nYW1lTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvbW9kZWwvcml2ZXRzTW9kZWwuanMiLCJhZGRvbi9zY3JpcHRzL2dhbWUvdXRpbHMvY29tcGF0LmpzIiwiYWRkb24vc2NyaXB0cy9nYW1lL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xudmFyIHJ2TW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9yaXZldHNNb2RlbCcpLFxuXHR1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyksXG5cdGdhbWVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL2dhbWVNb2RlbCcpLFxuXHRjb21wYXQgPSByZXF1aXJlKCcuLi91dGlscy9jb21wYXQnKSwgXG5cdHNvY2tldCA9IG51bGw7XG5cblxuXG5cbmZ1bmN0aW9uIGNsaWNrUmVzcChldmVudCl7XG4gXG4gXHRpZiAoIXJ2TW9kZWwuaGlkZU1lc3NhZ2Upe1xuIFx0XHRyZXR1cm47XG4gXHR9XG5cdGxldCBlbHQgPSBldmVudC5zcmNFbGVtZW50O1xuXHRsZXQgc2VuZE1lc3NhZ2UgPSB0cnVlO1xuXHRsZXQgdHlwZSA9ICduZXdSZXNwJztcblx0bGV0IHZhbHVlID0gbnVsbDtcblx0c3dpdGNoIChlbHQuaWQpe1xuXHRcdGNhc2UgXCJyZXNwQVwiOlxuXHRcdFx0dmFsdWUgPSAnQSc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQ1NlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJlc3BCXCI6XG5cdFx0XHR2YWx1ZSA9ICdCJztcblx0XHRcdGlmIChydk1vZGVsLnJlc3BBU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BDU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BEU2VsZWN0KXtcblx0XHRcdFx0dHlwZSA9ICdyZVNlbmQnO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdH1lbHNlIGlmIChydk1vZGVsLnJlc3BCU2VsZWN0KXtcblx0XHRcdFx0c2VuZE1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRicmVhaztcblx0XHRjYXNlIFwicmVzcENcIjpcblx0XHRcdHZhbHVlID0gJ0MnO1xuXHRcdFx0aWYgKHJ2TW9kZWwucmVzcEFTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcEJTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xuXHRcdFx0XHR0eXBlID0gJ3JlU2VuZCc7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcENTZWxlY3Qpe1xuXHRcdFx0XHRzZW5kTWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyZXNwRFwiOlxuXHRcdFx0dmFsdWUgPSAnRCc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRpZiAoc2VuZE1lc3NhZ2Upe1xuXHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0XHRpZCA6IGdhbWVNb2RlbC5pZCxcblx0XHRcdGV2ZW50VHlwZSA6IHR5cGUsXG5cdFx0XHRyZXNwIDogdmFsdWVcblx0XHR9KTtcblx0fVxuXG59XG5cbmZ1bmN0aW9uIGluaXRDb250cm9sbGVyKCl7XG5cblx0aWYgKCFjb21wYXQoKSl7XG5cdFx0cnZNb2RlbC5oaWRlTWVzc2FnZSA9IHRydWU7XG5cdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSBmYWxzZTtcblx0XHRydk1vZGVsLm5vdGNvbXBhdGlibGUgPSB0cnVlO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHJ2TW9kZWwuY2xpY2tSZXNwID0gY2xpY2tSZXNwO1xuXG5cdGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiKXtcblx0XHRzb2NrZXQgPSBpby5jb25uZWN0KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCIpO1xuXHR9ZWxzZXtcblx0XHRzb2NrZXQgPSBpby5jb25uZWN0KCk7XG5cdH1cblx0c29ja2V0Lm9uKCdjb25maWcnLCBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdGlmIChkYXRhLnR5cGUgPT09ICdnYW1lJyAmJiBkYXRhLmV2ZW50VHlwZSA9PT0gJ2NoYW5nZVF1ZXN0aW9uJyl7XG5cdFx0XHRydk1vZGVsLmhpZGVNZXNzYWdlID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gdHJ1ZTtcblx0XHRcdHJ2TW9kZWwucmVwQSA9IGRhdGEucmVwQTtcblx0XHRcdHJ2TW9kZWwucmVwQiA9IGRhdGEucmVwQjtcblx0XHRcdHJ2TW9kZWwucmVwQyA9IGRhdGEucmVwQztcblx0XHRcdHJ2TW9kZWwucmVwRCA9IGRhdGEucmVwRDtcblx0XHR9ZWxzZSBpZiAoZGF0YS50eXBlID09PSAnZ2FtZScgJiYgZGF0YS5ldmVudFR5cGUgPT09ICdoaWRlUXVlc3Rpb24nKXtcblx0XHRcdHJ2TW9kZWwuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdHJ2TW9kZWwuc2hvd1F1ZXN0aW9uID0gZmFsc2U7XG5cdFx0fVxuXHR9KTtcblxuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcblx0ICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcblx0ICAgICAgIG1vZGU6ICdjb3JzJyxcblx0ICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYC9jdXJyZW50U3RhdGVgLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdGlmIChqc29uLmhpZGVRdWVzdGlvbil7XG5cdFx0XHRydk1vZGVsLmhpZGVNZXNzYWdlID0gIWpzb24uaGlkZVF1ZXN0aW9uO1xuXHRcdFx0cnZNb2RlbC5zaG93UXVlc3Rpb24gPSBydk1vZGVsLmhpZGVNZXNzYWdlO1xuXHRcdH1cblx0XHRpZiAoanNvbi5zY29yZSAmJiBqc29uLnNjb3JlLnVzZXJzICYmIGpzb24uc2NvcmUudXNlcnNbZ2FtZU1vZGVsLmlkXSl7XG5cdFx0XHRzd2l0Y2goanNvbi5zY29yZS51c2Vyc1tnYW1lTW9kZWwuaWRdKXtcblx0XHRcdFx0Y2FzZSAnQSc6XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BEU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0InOlxuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdDJzpcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnRCc6XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVx0XHRcblx0fSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXRDb250cm9sbGVyIDogaW5pdENvbnRyb2xsZXJcbn0iLCIndXNlIHN0cmljdCdcblxuXG5mdW5jdGlvbiBwYWdlTG9hZCgpe1xuXHRyaXZldHMuYmluZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpLCByZXF1aXJlKCcuL21vZGVsL3JpdmV0c01vZGVsJykpO1xuXHRcblx0cmVxdWlyZSgnLi9jb250cm9sZXIvY29udHJvbGxlcicpLmluaXRDb250cm9sbGVyKCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xuXG4iLCIndXNlIHN0cmljdCdcblxudmFyIGlkVXNlciA9IGxvY2FsU3RvcmFnZVsndXNlcklkJ10gPyBsb2NhbFN0b3JhZ2VbJ3VzZXJJZCddIDogJ3VzZXInK25ldyBEYXRlKCkuZ2V0VGltZSgpO1xubG9jYWxTdG9yYWdlWyd1c2VySWQnXSA9IGlkVXNlcjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGlkIDogaWRVc2VyLFxuXHRhbGxvd1Jlc3AgOiB0cnVlXG59IiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzaG93UXVlc3Rpb24gOiB0cnVlLCBcblx0aGlkZU1lc3NhZ2UgOiB0cnVlLFxuXHRub3Rjb21wYXRpYmxlIDogZmFsc2UsXG5cdHJlcEEgOiAncmVwb25zZSBBJyxcblx0cmVwQiA6ICdyZXBvbnNlIEInLFxuXHRyZXBDIDogJ3JlcG9uc2UgQycsXG5cdHJlcEQgOiAncmVwb25zZSBEJyxcblx0cmVzcEFTZWxlY3QgOiBmYWxzZSxcblx0cmVzcEJTZWxlY3QgOiBmYWxzZSxcblx0cmVzcENTZWxlY3QgOiBmYWxzZSxcblx0cmVzcERTZWxlY3QgOiBmYWxzZVxufSIsIid1c2Ugc3RyaWN0J1xuXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogQXBpcyBleHBvc2VkXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKi9cblxuZnVuY3Rpb24gZGV2aWNlTW90aW9uQXZhaWxhYmxlKCl7XG5cdHJldHVybiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQ7XG59XG5cbmZ1bmN0aW9uIHZpYnJhdGlvbkF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gbmF2aWdhdG9yLnZpYnJhdGU7XG59XG5cbmZ1bmN0aW9uIHByb3hpbWl0eUF2YWlsYWJsZSgpe1xuXHRyZXR1cm4gd2luZG93LkRldmljZVByb3hpbWl0eUV2ZW50O1xufVxuXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXZhaWxhYmxlKCl7XG5cdHJldHVybiB0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9IFwidW5kZWZpbmVkXCJcblx0XHRcdHx8IHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT0gXCJ1bmRlZmluZWRcIlxuXHRcdFx0fHwgdHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9IFwidW5kZWZpbmVkXCJcblx0XHRcdHx8IHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT0gXCJ1bmRlZmluZWRcIlxufVxuXG5mdW5jdGlvbiBpc0NvbXBhdCgpe1xuXHRjb25zb2xlLmxvZygnRGV2aWNlIE1vdGlvbiA6ICVzJywgZGV2aWNlTW90aW9uQXZhaWxhYmxlKCkpO1xuXHRjb25zb2xlLmxvZygnVmlicmF0aW9uIDogJXMnLCB2aWJyYXRpb25BdmFpbGFibGUoKSk7XG5cdGNvbnNvbGUubG9nKCdWaXNpYmlsaXR5IDogJXMnLCB2aXNpYmlsaXR5QXZhaWxhYmxlKCkpO1xuXHQvL2NvbnNvbGUubG9nKCdQcm94aW1pdHkgOiAlcycsIHByb3hpbWl0eUF2YWlsYWJsZSgpKTtcblx0cmV0dXJuIGRldmljZU1vdGlvbkF2YWlsYWJsZSgpXG5cdCAmJiB2aWJyYXRpb25BdmFpbGFibGUoKVxuXHQgJiYgdmlzaWJpbGl0eUF2YWlsYWJsZSgpO1xuXHQgLy8mJiBwcm94aW1pdHlBdmFpbGFibGUoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0NvbXBhdDsiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gcmlwcGxlRWZmZWN0KGV2ZW50KXtcblx0bGV0IGVsdCA9IGV2ZW50LnNyY0VsZW1lbnQ7XG5cdGlmICghZWx0LmNsYXNzTGlzdC5jb250YWlucygnZmFiJykpXG5cdFx0cmV0dXJuO1xuXG4gICAgICBcbiAgICB2YXIgZGl2UGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyksXG4gICAgXHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKSxcbiAgICBcdHhQb3MgPSBldmVudC5wYWdlWCAtIGVsdC5vZmZzZXRMZWZ0LFxuICAgICAgXHR5UG9zID0gZXZlbnQucGFnZVkgLSBlbHQub2Zmc2V0VG9wO1xuICAgICAgXG4gICAgZGl2UGFyZW50LmNsYXNzTGlzdC5hZGQoJ3JpcHBsZScpO1xuICAgIGRpdlBhcmVudC5zdHlsZS5oZWlnaHQgPSBlbHQuY2xpZW50SGVpZ2h0K1wicHhcIjtcbiAgICBkaXZQYXJlbnQuc3R5bGUudG9wID0gLShlbHQuY2xpZW50SGVpZ2h0IC8gMikrXCJweFwiO1xuICAgIGRpdlBhcmVudC5zdHlsZS53aWR0aCA9IGVsdC5jbGllbnRXaWR0aCtcInB4XCI7XG4gICAgICBcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgncmlwcGxlLWVmZmVjdCcpOyBcbiAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2LnN0eWxlLnRvcCA9ICh5UG9zIC0gKGVsdC5jbGllbnRIZWlnaHQvMikpK1wicHhcIjtcbiAgICBkaXYuc3R5bGUubGVmdCA9ICh4UG9zIC0gKGVsdC5jbGllbnRIZWlnaHQvMikpK1wicHhcIjtcbiAgICBkaXYuc3R5bGUuYmFja2dyb3VuZCA9ICBcIiM0Mzg4NDRcIjtcbiAgICAgIFxuICAgIGRpdlBhcmVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIGVsdC5hcHBlbmRDaGlsZChkaXZQYXJlbnQpO1xuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBlbHQucmVtb3ZlQ2hpbGQoZGl2UGFyZW50KTtcbiAgICAgIH0sIDIwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmlwcGxlRWZmZWN0IDogcmlwcGxlRWZmZWN0XG59Il19
