var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

const port = 9000;

var callBacksAction = [];

/*
Init Server
*/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log(`listening on *:${port}`);
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



module.exports = {
	registerEvent : registerEvent,
	unregisterEvent : unregisterEvent,
	port : port
};