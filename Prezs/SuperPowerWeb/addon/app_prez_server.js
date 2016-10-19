'use strict'


var server = require('./modules/server'),
	networks = require('./modules/ips'),
	game = require('./modules/game');

const port = 8443;

var ip = networks.find(function(networkConf){
	return networkConf.name === 'wlan0';
});
if (!ip){
	ip = networks.find(function(networkConf){
		return networkConf.name === 'lo';
	})
}

server.init(port);

server.specifyRoute('/password/:pwd', function(req, res){

	let pwdQuery = req.params.pwd;
	let pwd = 'superpower';

	res.json({"auth": pwdQuery === pwd});
	
});

server.specifyRoute('/ip', function(req,res){
	res.json(networks);
});

game.initGameServer(server);