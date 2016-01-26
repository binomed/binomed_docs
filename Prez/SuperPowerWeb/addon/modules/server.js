'use strict'

var express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	io = require('socket.io')(http);

var callBacksAction = [];

/*
Init Server
*/
app.use(express.static(__dirname+'/../..'));

function init(port){
	http.listen(port, function(){
	  console.log(`listening on *:${port}`);
	});	
}

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/*
Init WebSocket
*/

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('sensor', sensorEvt);
  
  socket.on('config', configEvt);

  socket.on('disconnect', function(){
  	console.log('user disconnected');
  })
});

/*
Resolution of events
*/
function sensorEvt(msg){
  	io.emit('sensor', msg);
}

function configEvt(msg){
	callBacksAction.forEach(function(elt){
		if (elt.key === msg.type){
			elt.callback(msg);
		}
	});
	io.emit('config', msg);
}

/*
Exposed Methods
*/

function registerEvent(id, key, callback){
	var cb = callBacksAction.find(function(elt){
		return elt.id === id && elt.key === key;
	});
	if (!cb){
		callBacksAction.push({
			'id' : id,
			'key' : key, 
			'callback' : callback
		});
	}
}

function unregisterEvent(id, key){
	callBacksAction = callBacksAction.filter(function(elt){
		return elt.id != id || elt.key != key;
	});
}


function specifyRoute(path, callback){
	app.get(path, callback);
}


module.exports = {
	init : init,
	registerEvent : registerEvent,
	unregisterEvent : unregisterEvent,
	specifyRoute : specifyRoute
};