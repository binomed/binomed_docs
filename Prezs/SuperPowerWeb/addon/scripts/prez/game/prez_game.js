'use strict'

var config = require('../config/config'),
	audio = require('./audio'),
	socket = null,
	scoreIndex = {};



function hideQuestion(){	
	audio.stop();
	socket.emit('config',{
		type : 'game',
		eventType : 'hideQuestion'
	});
}

function changeQuestion(index){
	audio.playPublic();
	socket.emit('config',{
		type : 'game',
		eventType : 'changeQuestion',
		'index' : index,
		repA : document.querySelector(`[data-state=question-${index}] .resp.repA`).innerHTML,
		repB : document.querySelector(`[data-state=question-${index}] .resp.repB`).innerHTML,
		repC : document.querySelector(`[data-state=question-${index}] .resp.repC`).innerHTML,
		repD : document.querySelector(`[data-state=question-${index}] .resp.repD`).innerHTML,

	});
	socket.emit('config',{
		type : 'game',
		eventType : 'showNotification'		

	});
}

function processScore(index){
	let myHeaders = new Headers();
	let myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'cors',
           cache: 'default' };

	let myRequest = new Request(`${config.address}/score/${index}`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		audio.playWait();
		// On ne retraire pas une question déjà traitée
		if (scoreIndex[`question_${index}`]){
			return;
		}
		
		let total = json.repA + json.repB + json.repC + json.repD;
		var ctx = document.getElementById(`chart_question_${index}`).getContext("2d");

		var data = {
		    labels: ["A", "B", "C", "D"],
		    datasets: [
		        {
		            label: "A",
		            fillColor: "rgba(220,220,220,0.5)",
		            strokeColor: "rgba(220,220,220,0.8)",
		            highlightFill: "rgba(220,220,220,0.75)",
		            highlightStroke: "rgba(220,220,220,1)",
		            data: [Math.round((json.repA / total) * 100), 
		            		Math.round((json.repB / total) * 100), 
		            		Math.round((json.repC / total) * 100), 
		            		Math.round((json.repD / total) * 100)]
		        }
		    ]
		};
		var myBarChart = new Chart(ctx).Bar(data, {
			 //Boolean - Whether grid lines are shown across the chart
	    	scaleShowGridLines : false,
	    	// String - Scale label font colour
	    	scaleFontColor: "orange",
		});

		setTimeout(function() {
			audio.playResp();
			let goodAnswerElt = document.querySelector(`[data-state=resp-question-${index}] .resp.good`);
			let anwser = goodAnswerElt.classList.contains('repA') ? 'A' :
						 goodAnswerElt.classList.contains('repB') ? 'B' :
						 goodAnswerElt.classList.contains('repC') ? 'C' : 'D';
			socket.emit('config',{
				type : 'game',
				eventType : 'answer',
				value : anwser
			});			 
			goodAnswerElt.classList.add('show');
			if (index === 4){
				setTimeout(function() {
					socket.emit('config',{
						type : 'game',
						eventType : 'calculateWinners',
						numberWinners : 2,
						value : anwser
					});		
				}, 1000);
			}
		}, 5000);


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
		processScore(1);
	});

	Reveal.addEventListener('question-2', function(){
		changeQuestion(2);
	});
	Reveal.addEventListener('resp-question-2', function(){
		hideQuestion();
		processScore(2);
	});

	Reveal.addEventListener('question-3', function(){
		changeQuestion(3);
	});
	Reveal.addEventListener('resp-question-3', function(){
		hideQuestion();
		processScore(3);
	});

	Reveal.addEventListener('question-4', function(){
		changeQuestion(4);
	});
	Reveal.addEventListener('resp-question-4', function(){
		hideQuestion();
		processScore(4);
	});


	Reveal.addEventListener('quit-question', hideQuestion);

}

module.exports = {
	init : init
}