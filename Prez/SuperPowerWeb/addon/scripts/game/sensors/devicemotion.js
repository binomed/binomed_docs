'use strict';

	// Listener of devieMotion
	var deviceMotionListener = function(event){        
		var x = event.acceleration.x;
		var y = event.acceleration.y;
		var z = event.acceleration.z;
		currentPercent+=Math.abs(x);
		//socket.sendDeviceMotion(Math.abs(x));
		//updatePercent();
	}

	// We add the listener
	function register(){
		window.addEventListener('devicemotion', deviceMotionListener, false);
	}

	function unregister(){
		window.removeEventListener('devicemotion', deviceMotionListener, false);        
	}



module.exports = {
	register : register,
	register : unregister
}