'use strict'

function managementCodeConnect(){

	var eltHiglight = document.querySelector('#highlight-connect-ble');

	function progressFragment(event){
		// event.fragment // the dom element fragment
		console.log(event);
		if (event.type === 'fragmentshown'){

		}else {

		}
	}

	function listenFragments(){
		Reveal.addEventListener('fragmentshown', progressFragment);
		Reveal.addEventListener('fragmenthidden', progressFragment);
	}

	function unregisterFragments(){
		Reveal.removeEventListener('fragmentshown', progressFragment);
		Reveal.removeEventListener('fragmenthidden', progressFragment);
	}

	Reveal.addEventListener('code-connect-ble', function(){
		listenFragments();
	});
	Reveal.addEventListener('stop-code-connect-ble', function(){
		unregisterFragments();
	});
	
}

function init(){

	managementCodeConnect();

}

module.exports = {
	init : init
};