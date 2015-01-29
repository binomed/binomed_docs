var AnimatePhoneApp = AnimatePhoneApp || function () {
	
	var phone = null;

    var init = function () {
		//Get all the page element we need
        phone = document.getElementById('scene-phone');
		
    };

    var callBackAnimation = function(event){

    	try{

    	var data = JSON.parse(event.data);
    	if (phone){
    		phone.style.webkitTransform = "rotate("+ data.gamma +"deg) rotate3d(1,0,0, "+ (data.beta*-1)+"deg)";
			phone.style.MozTransform = "rotate("+ data.gamma +"deg)";
			phone.style.transform = "rotate("+ data.gamma +"deg) rotate3d(1,0,0, "+ (data.beta*-1)+"deg)";
    	}
    	}catch(e){}
    };

    Reveal.addEventListener( 'ready', function(){
       	setTimeout(function() {
	    	init();
	    }, 500);
    });

    Reveal.addEventListener('startDataChannel', function(){
    	AppSlideWebRTC.setCallBackDataChannel(callBackAnimation);
    });

    return {
    	callBackAnimation : callBackAnimation
    };

}();