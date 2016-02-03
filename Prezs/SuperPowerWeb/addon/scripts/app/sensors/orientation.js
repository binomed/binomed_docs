'use strict';

let socket = null, 
	firstValue = -1;

// The handler of the event
var deviceOrientationListener = function(event){        
	var alpha = Math.round(event.alpha);
	var beta = Math.round(event.beta);
	var gamma = Math.round(event.gamma);
	if (firstValue === -1){
		firstValue = alpha;
	}
	socket.sendMessage({type: 'orientation', value : alpha, 'firstValue' : firstValue});	
}

function register(){
	firstValue = -1;
	window.addEventListener('deviceorientation', deviceOrientationListener, false);
}

function unregister(){
	window.removeEventListener('deviceorientation', deviceOrientationListener, false);
}

function OrientationControler($mdDialog, SocketService){

	socket = SocketService;

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}

OrientationControler.$inject = ['$mdDialog', 'SocketService']


module.exports = OrientationControler;