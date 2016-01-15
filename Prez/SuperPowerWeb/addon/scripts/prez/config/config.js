'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3000" || location.port === "8000")){
		return "http://localhost:8000"
	}else if (location.port && location.port === "9000"){
		return "http://jef.binomed.fr:8000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();

module.exports = {
	address : address
}