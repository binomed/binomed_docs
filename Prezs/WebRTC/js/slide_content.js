

var SlideWebRTC = SlideWebRTC || 
function(){

	// WebRTC FirstPage
	var videoRTC;
	// UserMedia First Example
	var videoUM,
		btnUM,
		streamUM;
	// UserMedia Ascii
	var canvasAscii,
		videoAscii,
		btnAscii;

	function init(){
		// UserMedia First Example
		videoUM = document.querySelector('.firstUserMedia');
		btnUM = document.querySelector('.firstUserMediaBtn');
		btnUM.addEventListener('click',firstSlideWithUserMediaBtnHandler);

		// Ascii
		btnAscii = document.querySelector('.asciiCamBtn');
		btnAscii.addEventListener('click',function(){CammApp.startCam()});

		// We init the first slide
		slideChanged();
		Reveal.addEventListener( 'slidechanged', slideChanged);

		//AppSlideWebRTC.initPrez();
	}

	
	function slideChanged(event){
		console.info('slideChanged'); 
		var currentElement = document.querySelector('section.present');

		stopFirstUserMedia();
		CammApp.stopCam();
		switch (checkAllSlideWithActions(currentElement)){			
			case 'slideWithGetUserMedia' : 
			break;
			case 'slideWithAsciiCam' : 
			break;
			default:
			break;
		}

	}

	function checkAllSlideWithActions(currentElement){

		if (currentElement.querySelector('.slideWithGetUserMedia')){
			return 'slideWithGetUserMedia';
		}else if (currentElement.querySelector('.slideWithAsciiCam')){
			return 'slideWithAsciiCam';
		}else{
			return '';
		}
	}

	
	function firstSlideWithUserMediaBtnHandler(){
		var gUM = Modernizr.prefixed('getUserMedia', navigator);
		gUM(
			{
				video:true, 
				audio:false
			}, 
			function(stream){
				streamUM = stream;
				videoUM.src = window.URL.createObjectURL(stream);
				videoUM.play();
			}, 
			function(error){

			}
		);
	}

	function stopFirstUserMedia(){
		videoUM.pause();
		if (streamUM){
			videoUM.src = '';
			streamUM.stop();
			streamUM = null;
		}
	}


	function hasGetUserMedia() {
	  	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
	        navigator.mozGetUserMedia || navigator.msGetUserMedia);
	}

	Reveal.addEventListener( 'ready', function(){
       	setTimeout(function() {
			init();
		}, 500);
    });

	return {

	};
}();

