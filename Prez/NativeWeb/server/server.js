const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
//});
app.use(express.static(__dirname +'/'));

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });
  });

http.listen(9999, function(){
  console.log('listening on *:9999');
});