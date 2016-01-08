'use strict';

 	// The handler
	var deviceLightHandler = function(event) {
		// The value will live between 0 and ~150
		// But when it is 45 is a high lumonsity
		var value = Math.min(45, event.value);        
		percent = Math.round((value / 45) * 100);       
		//socket.sendLight(percent);
		//updateLight(); 
	}

	// We add the listener
	function register(){
	window.addEventListener('devicelight', deviceLightHandler, false);
	}

	function unregister(){
	window.removeEventListener('devicelight', deviceLightHandler, false);
	}


module.exports = {
	register : register,
	register : unregister
}