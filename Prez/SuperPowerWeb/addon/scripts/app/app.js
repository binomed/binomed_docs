'use strict'


function pageLoad(){
	document.getElementById('clickMe').addEventListener('click', function(){
		navigator.bluetooth.requestDevice({ filters: [{ name: 'MyDevice' }]})
		 .then(function(device) {
		   document.querySelector('#output').textContent = 'connecting...';
		   return device.connectGATT();
		 })
		 .then(function(server) {
		   // FIXME: Remove this timeout when GattServices property works as intended.
		   // crbug.com/560277
		   return new Promise(function(resolve, reject) {
		     setTimeout(function() {
		     	try{
		       		resolve(server.getPrimaryService('11111111-2222-3333-4444-000000000000'));
		     	}catch(err){
		     		reject(err);
		     	}
		     }, 2e3);
		   })
		}).then(function(service){
			document.querySelector('#output').textContent = service;
			console.log(service);
		}).catch(function(error){
			console.error(error);
		});
	});
	
	//require('./socket/sockets');
}

window.addEventListener('load', pageLoad);