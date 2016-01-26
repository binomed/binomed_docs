'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3000")){
		return "http://localhost:8000"
	}else if (location.port && location.port === "8000"){
		return "http://jef.binomed.fr:8000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();

function doRequest($mdDialog, context, pwd){
	let myHeaders = new Headers();
	let myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'cors',
           cache: 'default' };

	let myRequest = new Request(`${address}/password/${pwd}`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		// On ne retraire pas une question déjà traitée
		if (json.auth){
			localStorage['pwd'] = pwd;
			$mdDialog.hide();
		}else{
			context.notvalid = true;
		}


	});
}

function SecureCtrl($mdDialog){
	
	this.notvalid = false;

	this.try = function(){
		doRequest($mdDialog, this, this.pwd);
	}

	if (localStorage['pwd']){
		doRequest($mdDialog, this, localStorage['pwd']);
	}
}

module.exports = SecureCtrl;