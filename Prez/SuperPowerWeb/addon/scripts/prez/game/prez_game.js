'use strict'

var config = require('../config/config'),
	socket = null;

	

function hideQuestion(){	
	socket.emit('config',{
		type : 'game',
		eventType : 'hideQuestion'
	});
}

function changeQuestion(index){
	socket.emit('config',{
		type : 'game',
		eventType : 'changeQuestion',
		'index' : index,
		repA : document.querySelector(`[data-state=question-${index}] .resp.repA`).innerHTML,
		repB : document.querySelector(`[data-state=question-${index}] .resp.repB`).innerHTML,
		repC : document.querySelector(`[data-state=question-${index}] .resp.repC`).innerHTML,
		repD : document.querySelector(`[data-state=question-${index}] .resp.repD`).innerHTML,

	});
}

function init(socketToSet){
	socket = socketToSet;
	hideQuestion();

	Reveal.addEventListener('question-1', function(){
		changeQuestion(1);
	});
	Reveal.addEventListener('resp-question-1', function(){
		hideQuestion();
		let myHeaders = new Headers();
		let myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

		let myRequest = new Request(`${config.address}/score/1`,myInit);
		fetch(myRequest)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			console.log(json);
		});

	});
	Reveal.addEventListener('quit-question', hideQuestion);

}

module.exports = {
	init : init
}