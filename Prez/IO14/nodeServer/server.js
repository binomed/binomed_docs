var express = require('express')
, http = require('http'),
 qs = require('qs');




var indexH = 0, indexV=0;
var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');
// On Connection message
socket.on('connect', function(){            
    console.log('Connect ! ');
});



socket.on('message', function(data){     
	console.log(data);       
    if( data.type === "config" && data.indices){
    	indexH = data.indices.h;
    	indexV = data.indices.v;
    }
});

// Server part
console.log(__dirname);
console.log(process.cwd());
//var express = require('express');
var app = express()
  .use(express.logger('dev'))
  .use(express.static('public'))
  .use(function(req, res){
   if (req.query.action){
   		console.log("Action for slides ! "+req.query.action+"| h : "+indexH+" | v : "+indexV);
    	if (req.query.action === "next"){
    		indexH+=1;
    		socket.emit('message', {
    			type : 'operation', 
              	data : 'show', 
              	index: {
    				h : indexH,
    				v : indexV,
    				f : 0
    			}
    		});
    	}else if (req.query.action === "prev"){
    		indexH-=1;
    		socket.emit('message', {
    			type : 'operation', 
              	data : 'show', 
              	index: {
    				h : indexH,
    				v : indexV,
    				f : 0
    			}
    		});
    	}
    }
    res.end('hello world\n'+req.query.test);
  });

http.createServer(app).listen(8090);
console.log('Start server on port : '+8090);

