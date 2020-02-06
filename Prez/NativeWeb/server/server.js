const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
//});
app.use(express.static(__dirname +'/'));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });

    socket.on('contacts', (contacts)=>{
      socket.broadcast.emit('contacts', contacts);
    })
    socket.on('nfc', (ndef)=>{
      socket.broadcast.emit('nfc', ndef);
    })
    socket.on('light', (light)=>{
      socket.broadcast.emit('light', light);
    })
  });

http.listen(9999, () => {
  console.log('listening on *:9999');
});
