'use strict'

var socket = null;

function SocketService(){

	this.connect = function(model){

		model.checkAddress()
		.then(function(){
			let address = model.getIoAddress();
			let protocol = model.isSSL() ? 'https' : 'http';
			socket = io(`${protocol}://${address}`);
		});
	}
	this.sendMessage = function(msg){
		socket.emit('sensor', msg);
	}

	this.getSocket = function(){
		return socket;
	}

}

module.exports = SocketService;