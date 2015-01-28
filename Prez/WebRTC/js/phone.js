'use strict'

var ModelSlideWebRTC = ModelSlideWebRTC || 
function(){

	var myLocalStream = null;

	var loadAdditionnalScripts = function(){
	    
	    loadScript('http://'+window.location.hostname+':9999/socket.io/socket.io.js');
	    setTimeout(function() {	    	
	    	loadScript('js/app_rtc.js');
	    	setTimeout(function() {
	    		AppSlideWebRTC.initPhone();
	    	}, 100);	    	
	    }, 500);
	  };

	// Function that load a script
  	var loadScript = function(url){
	    var js_script = document.createElement('script');
	    js_script.type = "text/javascript";
	    js_script.src = url;
	    js_script.async = true;
	    document.getElementsByTagName('head')[0].appendChild(js_script);
	  };

	loadAdditionnalScripts();

	var videoElement = document.querySelector("video");
	var videoSelect = document.querySelector("select#videoSource");
	var startButton = document.querySelector("button#startWebRTC");
	var stopButton = document.querySelector("button#stopWebRTC");

	navigator.getUserMedia = navigator.getUserMedia ||
		navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	function gotSources(sourceInfos) {
	  for (var i = 0; i != sourceInfos.length; ++i) {
	    var sourceInfo = sourceInfos[i];
	    var option = document.createElement("option");
	    option.value = sourceInfo.id;
	    if (sourceInfo.kind === 'video') {
	      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
	      videoSelect.appendChild(option);
	    } else {
	      console.log('Some other kind of source: ', sourceInfo);
	    }
	  }
	}

	if (typeof MediaStreamTrack === 'undefined'){
	  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
	} else {
	  MediaStreamTrack.getSources(gotSources);
	}


	function successCallback(stream) {
	  myLocalStream = stream; // make stream available to console
	  videoElement.src = window.URL.createObjectURL(stream);
	  videoElement.play();
	}

	function errorCallback(error){
	  console.log("navigator.getUserMedia error: ", error);
	}

	function start(){
	  if (!!myLocalStream) {
	    videoElement.src = null;
	    myLocalStream.stop();
	  }
	  var videoSource = videoSelect.value;
	  var constraints = {
	    video: {
	      optional: [{sourceId: videoSource}]
	    }
	  };
	  navigator.getUserMedia(constraints, successCallback, errorCallback);

	  // Gestion de l'orientation pour le rtcdatachannel
	  if (window.DeviceOrientationEvent){
	  	window.addEventListener('deviceorientation', function(eventData){
	  		if (window.AppSlideWebRTC){

		  		AppSlideWebRTC.sendMessageDataChannel({
		  			gamma : eventData.gamma,
		  			beta : eventData.beta,
		  			alpha : eventData.alpha
		  		});
	  		}
	  	}, false);
	  }
	}

	videoSelect.onchange = start;

	startButton.addEventListener('click', function(){
		AppSlideWebRTC.handleUserMedia(myLocalStream);
	});

	stopButton.addEventListener('click', function(){
		AppSlideWebRTC.hangup();
	});

	start();

	return {
		
	};
}();