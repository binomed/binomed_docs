'use strict'

var ble = require('bluetooth/bluetooth');


function pageLoad(){
	document.getElementById('clickMe').addEventListener('click', function(){
		//completeWriteOperation();

		//processCharacteristic(true);
	});

	document.getElementById('clickMeInfo').addEventListener('click', function(){
		//processCharacteristic(false);
	});
	
	//require('./socket/sockets');
}



window.addEventListener('load', pageLoad);