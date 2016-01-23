'use strict';

 	// The handler of the event
	var deviceOrientationListener = function(event){        
		var alpha = Math.round(event.alpha);
		var beta = Math.round(event.beta);
		var gamma = Math.round(event.gamma);
		//updateRotation(alpha);
		//socket.sendOrientation(alpha);
	}

	function register(){
		window.addEventListener('deviceorientation', deviceOrientationListener, false);
	}

	function unregister(){
		window.removeEventListener('deviceorientation', deviceOrientationListener, false);
	}

function OrientationControler($mdDialog){

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}


module.exports = OrientationControler;