'use strict'
var rvModel = require('../model/rivetsModel'),
	utils = require('../utils/utils'),
	gameModel = require('../model/gameModel'),
	compat = require('../utils/compat'), 	
	questions = require('../questions/questions'),
	shake = require('../shake/shake'),
	visibility = require('../sensors/visibility'),
	socket = null;




function initController(){

	if (!compat()){
		rvModel.hideMessage = true;
		rvModel.showQuestion = false;
		rvModel.notcompatible = true;
		return;
	}


	rvModel.gameQuestion = !localStorage['game'] || localStorage['game'] === "questions";
	rvModel.gameShake = localStorage['game'] === "shake";
	if (rvModel.gameShake){
		rvModel.showChoice = !localStorage['team'];
		rvModel.showPhone = localStorage['team'];
	}
	

	if (location.port && location.port === "3000"){
		socket = io.connect("http://localhost:8000");
	}else{ 
		socket = io.connect("https://binomed.fr:8000");
	}	

	visibility.init(socket);
	questions.init(socket);
	shake.init(socket);
	

}

module.exports = {
	initController : initController
}