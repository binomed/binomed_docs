'use strict'

var ModelSlideWebRTC = ModelSlideWebRTC || 
function(){

	var constraints = {};

	function setConstraints(param){
		constraints = param;
	}

	function getConstraints(){
		return constraints;
	}

	return {
		setConstraints : setConstraints,
		getConstraints : getConstraints
	};
}();