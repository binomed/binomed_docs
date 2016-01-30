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