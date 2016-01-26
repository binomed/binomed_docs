'use strict'

var socket = io("http://localhost:8000");

function SocketService(){

	this.sendMessage = function(msg){
		socket.emit('sensor', msg);
	}

	this.getSocket = function(){
		return socket;
	}

}

module.exports = SocketService;