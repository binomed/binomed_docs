'use strict'

var server = require("./modules/server");
const port = 8000;
server.init(port);


var scores = {},
	index = 0;

function callBackGame(msg){
	switch (msg.eventType){
		case 'newResp':
		case 'reSend':{
			let currentScore = scores[`question_${index}`];
			if (msg.eventType === 'reSend'){
				let previousRep = currentScore.users[msg.id];
				switch(msg.resp){
					case 'A':
						currentScore.repA--;
						break;
					case 'B':
						currentScore.repB--;
						break;
					case 'C':
						currentScore.repC--;
						break;
					case 'D':
						currentScore.repD--;
						break;
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
			index = msg.index;
			scores[`question_${index}`] = {
				users : {},
				repA : 0,
				repB : 0,
				repC : 0,
				repD : 0,
			}
		break;
	}
	console.log(msg);
}

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