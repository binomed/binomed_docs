'use strict'

	// The listener
	var deviceProximityHandler = function(event) {
		var value = Math.round(event.value);            
		//socket.sendProximity(value);
		//manageProximityValue(value);
	}

	function register(){
		window.addEventListener('deviceproximity', deviceProximityHandler, false);
	}

	function unregister(){
		window.removeEventListener('deviceproximity', deviceProximityHandler, false);
	}

module.exports{
	register : register,
	unregister : unregister
}