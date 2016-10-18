'use strict'

var address = null,
	ioAddress = null,
	ssl = false;

function calculateAddress(){
	return new Promise(function(resolve, reject){
		if (address){
			resolve();
			return;
		}
		let myHeaders = new Headers();
		let myInit = { method: 'GET',
	           headers: myHeaders,
	           mode: 'cors',
	           cache: 'default' };
	    let protocol = '';
	    let scheme = ''
	    let basicHost = ''
	    if (location.host && location.host.indexOf('localhost') === -1){
	    	protocol = 'https';
	    	scheme = '://';
	    	basicHost = 'binomed.fr:8443';
	    }

		let myRequest = new Request(`${protocol}${scheme}${basicHost}/ip`,myInit);
		fetch(myRequest)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			let network = json;

			if ((location.port && (location.port === "3000"))
             || location.hostname === 'localhost'){
				let wlan0 = network.find(function(element){
					return element.name === 'wlan0';
				});
				if (location.port === "8443"){
					address = "localhost:8443";
					ioAddress = "localhost:8443";
                }else if (wlan0 && location.hostname != 'localhost'){
					address = `${wlan0.ip}:3000`;
					ioAddress = `${wlan0.ip}:8443`;
				}else{
					address = "localhost:3000";
					ioAddress = "localhost:8443";
				}
			}else if (location.port && location.port === "8443"){
				address = "binomed.fr:8443";
				ioAddress = "binomed.fr:8443";
				ssl = true;
			}else if (location.port && (location.port === "80" || location.port === "")){
				address = "binomed.fr:8443";
				ioAddress = "binomed.fr:8443";
			}else{
				address = null;
			} 
			resolve();
		});
	});
}

calculateAddress();


function ModelService(){

	this.isSSL = function(){
		return ssl;
	}

	this.getAddress = function(){
		return address;
	}	

	this.getIoAddress = function(){
		return ioAddress;
	}

	this.checkAddress = calculateAddress;

}

module.exports = ModelService;