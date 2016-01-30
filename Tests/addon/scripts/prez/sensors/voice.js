'use strict'

let voiceEnable = false;



function init(socket){

	socket.on('sensor', function(msg){
		if (voiceEnable && msg.type === 'voice'){
			if (msg.value === 'next'){
				Reveal.next();
			}
		}
	});
	
	Reveal.addEventListener( 'start-webspeech', function(){
		voiceEnable = true;
	});

	Reveal.addEventListener( 'stop-webspeech', function(){
		voiceEnable = false;
	});

}

module.exports = {
	init : init
}