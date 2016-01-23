'use strict'

function register(){

}

function unregister(){
	
}


function VoiceControler($mdDialog){

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}


module.exports = VoiceControler;