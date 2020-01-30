
const socket = io('http://localhost:9999');

socket.emit('chat message', {test:'test'});