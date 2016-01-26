'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3010")){
		return "http://localhost:9000"
	}else if (location.port && location.port === "9000"){
		return "http://jef.binomed.fr:9000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();

function SecureCtrl($mdDialog){
	
	this.notvalid = false;

	this.try = function(){
		let myHeaders = new Headers();
		let myInit = { method: 'GET',
	           headers: myHeaders,
	           mode: 'cors',
	           cache: 'default' };
	    let context = this;

		let myRequest = new Request(`${address}/password/${this.pwd}`,myInit);
		fetch(myRequest)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			// On ne retraire pas une question déjà traitée
			if (json.auth){
				$mdDialog.hide();
			}else{
				context.notvalid = true;
			}


		});

	}
}

module.exports = SecureCtrl;