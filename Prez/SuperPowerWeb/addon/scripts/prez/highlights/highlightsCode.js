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
		listenFragments();
	});
	Reveal.addEventListener(stopEvent, function(){
		unregisterFragments();
	});
}

function managementCodeConnect(){

	managementGeneric('highlight-connect-ble', 
			'code-connect-ble', 
			'stop-code-connect-ble',
			[
			{
				'top' : 'calc(90px + 1.15em)',
				'width' : '400px'
			}
			]);
	
}

function init(){

	managementCodeConnect();

}

module.exports = {
	init : init
};