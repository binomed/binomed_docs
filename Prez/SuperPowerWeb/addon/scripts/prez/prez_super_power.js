'use strict'

var config = require('./config/config');

Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
	


	if (io && config.address){
		let socket = io.connect(config.address);
		require('./game/prez_game').init(socket);
	}	

	
} );
