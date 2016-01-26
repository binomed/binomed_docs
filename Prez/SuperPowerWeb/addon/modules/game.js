'use strict'

var scores = {},
	index = 0, 
	hideQuestion = true;


function callBackGame(msg){
	console.log(msg);
	switch (msg.eventType){
		case 'newResp':
		case 'reSend':{
			let currentScore = scores[`question_${index}`];
			if (msg.eventType === 'reSend'){
				let previousRep = currentScore.users[msg.id];
				resp: switch(previousRep){
					case 'A':
						currentScore.repA--;
						break resp;
					case 'B':
						currentScore.repB--;
						break resp;
					case 'C':
						currentScore.repC--;
						break resp;
					case 'D':
						currentScore.repD--;
						break resp;
				}
			}
			currentScore.users[msg.id] = msg.resp;
			switch(msg.resp){
				case 'A':
					currentScore.repA++;
					break;
				case 'B':
					currentScore.repB++;
					break;
				case 'C':
					currentScore.repC++;
					break;
				case 'D':
					currentScore.repD++;
					break;
			}
			break;
		}
		case 'changeQuestion':
			hideQuestion = false;
			index = msg.index;
			if (!scores[`question_${index}`]){				
				scores[`question_${index}`] = {
					users : {},
					repA : 0,
					repB : 0,
					repC : 0,
					repD : 0,
				};
			}
		break;
		case 'hideQuestion':
			hideQuestion = true;
		break;
	}
	
}


function initGameServer(server){
	server.registerEvent('gameServer','game', callBackGame);

	server.specifyRoute('/score/:index', function(req, res){

		let questionIndex = req.params.index;
		let currentScore = scores[`question_${questionIndex}`];
		if (currentScore){
			res.json(currentScore);
		}else{
			res.send({type:'error unkown index'});
		}
	});

	server.specifyRoute('/currentState', function(req, res){

		res.json({
			'index' : index,
			'hideQuestion' : hideQuestion,
			score : index ? scores[`question_${index}`] : {}
		});
		
	});
}

module.exports = {
	initGameServer : initGameServer
};