'use strict'


function managementGeneric(idHighlightElt, startEvent, stopEvent, positionArray){

	var eltHiglight = document.querySelector('#'+idHighlightElt);

	function progressFragment(event){
		// event.fragment // the dom element fragment
		try{			
			if (event.type === 'fragmentshown'){
				var index = +event.fragment.getAttribute('data-fragment-index');
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++){
					var key = keys[i];
					eltHiglight.style[key] = properties[key];
				}	
			}else {
				var index = +event.fragment.getAttribute('data-fragment-index');
				// On reset les properties
				var properties = positionArray[index];
				var keys = Object.keys(properties);
				for (var i = 0; i < keys.length; i++){
					var key = keys[i];
					eltHiglight.style[key] = '';
				}
				if (index > 0){			
					properties = positionArray[index - 1];
					keys = Object.keys(properties);
					for (var i = 0; i < keys.length; i++){
						var key = keys[i];
						eltHiglight.style[key] = properties[key];
					}
				}			
			}
		}catch(e){}
	}

	function listenFragments(){
		Reveal.addEventListener('fragmentshown', progressFragment);
		Reveal.addEventListener('fragmenthidden', progressFragment);
	}

	function unregisterFragments(){
		Reveal.removeEventListener('fragmentshown', progressFragment);
		Reveal.removeEventListener('fragmenthidden', progressFragment);
	}

	Reveal.addEventListener(startEvent, function(){
		try{
			listenFragments();
		}catch(e){
			console.error(e);
		}
	});
	Reveal.addEventListener(stopEvent, function(){
		try{
			unregisterFragments();
		}catch(e){
			console.error(e);
		}
	});
}

function init(){

	// Code Connect
	managementGeneric('highlight-connect-ble', 
			'code-connect-ble', 
			'stop-code-connect-ble',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '400px'
			}
			]);

	// Code Read Characteristic
	managementGeneric('highlight-read-charact', 
			'code-read-charact', 
			'stop-code-read-charact',
			[
			{
				'top' : 'calc(90px + 3.45em)',
				'left' : '100px'
			},
			{
				'top' : 'calc(90px + 6.90em)',
				'width' : '500px'
			},
			{
				'top' : 'calc(90px + 10.35em)',
				'width' : '850px',
				'height' : '2.4em'
			}
			]);

	// Code Write Characteristic
	managementGeneric('highlight-write-charact', 
			'code-write-charact', 
			'stop-code-write-charact',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '1000px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '700px',
				'left' : '100px'
			},
			{
				'top' : 'calc(90px + 5.75em)',
				'width' : '800px'
			}
			]);

	// Code Orientation
	managementGeneric('highlight-orientation', 
			'code-orientation', 
			'stop-code-orientation',
			[
			{
				'top' : 'calc(90px + 8.05em)',
				'width' : '400px',
				'height' : '3.4em'
			}
			]);

	// Code Motion
	managementGeneric('highlight-motion', 
			'code-motion', 
			'stop-code-motion',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '750px',
				'height' : '4.4em'
			}
			]);


	// Code Battery
	managementGeneric('highlight-battery', 
			'code-battery', 
			'stop-code-battery',
			[
			{
				'top' : 'calc(90px + 4.6em)',
				'left' : '600px',
				'width' : '200px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 10.35em)',
				'left' : '60px',
				'width' : '1000px',
				'height' : '2.4em'
			}
			]);


	// Code User Media 1
	managementGeneric('highlight-user-media-v1', 
			'code-user-media-v1', 
			'stop-code-user-media-v1',
			[
			{
				'top' : 'calc(90px + 13.8em)',
				'left' : '60px',
				'width' : '1000px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 7.75em)',
				'left' : '190px',
				'width' : '210px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 7.75em)',
				'left' : '410px',
				'width' : '90px',
				'height' : '1.4em'
			},
			{
				'top' : 'calc(90px + 10.35em)',
				'left' : '100px',
				'width' : '800px',
				'height' : '2.4em'
			}
			]);

	// Code Device Proximity
	managementGeneric('highlight-device-proximity', 
			'code-device-proximity', 
			'stop-code-device-proximity',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'left' : '250px',
				'width' : '170px'
			}
			]);

	// Code User Proximity
	managementGeneric('highlight-user-proximity', 
			'code-user-proximity', 
			'stop-code-user-proximity',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'left' : '150px',
				'width' : '150px'
			}
			]);

	// Code Web Speech
	managementGeneric('highlight-web-speech', 
			'code-web-speech', 
			'stop-code-web-speech',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '400px'
			},
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '500px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '550px'			
			},
			{
				'top' : 'calc(90px + 5.75em)',
				'width' : '300px'			
			},
			{
				'top' : 'calc(90px + 6.90em)',
				'width' : '300px'
			},
			{
				'top' : 'calc(90px + 8.05em)',				
				'left' : '300px',
				'width' : '450px'
			}
			]);

	// Code Web Speech Grammar
	managementGeneric('highlight-web-speech-grammar', 
			'code-web-speech-grammar', 
			'stop-code-web-speech-grammar',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '750px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '700px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '650px'
			}
			]);

	// Code Web Speech Synthesis
	managementGeneric('highlight-web-speech-synthesis', 
			'code-web-speech-synthesis', 
			'stop-code-web-speech-synthesis',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '850px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '400px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '450px'
			},
			{
				'top' : 'calc(90px + 5.75em)',
				'width' : '400px'
			},
			{
				'top' : 'calc(90px + 6.90em)',
				'width' : '350px'
			}
			]);

	// Code Notifications
	managementGeneric('highlight-notification', 
			'code-notification', 
			'stop-code-notification',
			[
			{
				'top' : 'calc(90px + 2.30em)',
				'width' : '350px',
				'left' : '130px'
			},
			{
				'top' : 'calc(90px + 3.45em)',
				'width' : '800px',
				'left' : '150px'
			},
			{
				'top' : 'calc(90px + 4.60em)',
				'width' : '800px',
				'height': '5.5em',
				'left' : '180px'
			}
			]);

}

module.exports = {
	init : init
};