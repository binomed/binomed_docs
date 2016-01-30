'use strict'

var config = require('./config/config');

Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
	


	if (io && config.address){
		let socketGame = io.connect(config.address);
		require('./game/prez_game').init(socketGame);
		let socketPrez = null;
		if (config.local){
			socketPrez = socketGame;   
		}else{
			socketPrez = io.connect(config.address);
		}
 
 		setTimeout(function() {
			require('./sensors/light').init(socketPrez);
			require('./sensors/orientation').init(socketPrez);
			require('./sensors/devicemotion').init(socketPrez);
			require('./sensors/voice').init(socketPrez);
			require('./sensors/usermedia').init(socketPrez);
 			
 		}, 1000);
	}	
 
	
} );
