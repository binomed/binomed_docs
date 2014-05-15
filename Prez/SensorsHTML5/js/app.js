$(function(){

	setTimeout(function() {

		var socket = io.connect("http://"+location.hostname+":8080");

		var orientationEnable = false;
		var deviceMotionEnable = false;
		var proximityEnable = false;
		var lightEnable = false;

		socket.on('message', function (data) {
		    console.log(data);
		    if (orientationEnable && data.type === 'OrientationEvent'){
		    	updateRotation(data.data);
		    }else if (deviceMotionEnable && data.type === 'DevieMotionEvent'){
		    	updatePercent(data.data);
		    }else if (proximityEnable && data.type === 'ProximityEvent'){
		    	manageProximityValue(data.data);
		    }else if (lightEnable && data.type === 'LightEvent'){
		    	updateLight(data.data);
		    }
		});


		/**
		** ORIENTATION
		**/

		Reveal.addEventListener( 'start-orientation', function(){
			orientationEnable = true;
		});

		Reveal.addEventListener( 'stop-orientation', function(){
			orientationEnable = true;
		});

		/*$('#startOrientation').on('click', function(){
			orientationEnable = true;
		});

		$('#stopOrientation').on('click', function(){
			orientationEnable = false;
		});*/

		// We get the html elements
		var lock = $('.safe_lock');
		// We get the correct css prefix
		var prefixRotation = Modernizr.prefixed('transform');

		// According to the number of unlock, we just turn the image or we open the door
		function updateRotation(zAlpha){
		 lock.css(prefixRotation,'rotateZ('+zAlpha+'deg)');
		}

	
		/**
		** DEVICEMOTION
		**/

		Reveal.addEventListener( 'start-devicemotion', function(){
			deviceMotionEnable = true;
		});

		Reveal.addEventListener( 'stop-devicemotion', function(){
			deviceMotionEnable = true;
		});

		/*$('#startDeviceMotion').on('click', function(){
			deviceMotionEnable = true;
		});

		$('#stopDeviceMotion').on('click', function(){
			deviceMotionEnable = false;
		});*/

		// Init the device motion element
		var gradient = $('.devicemotion-percent');
		// Height of the battery
		var maxHeight = 335;

		// Variable that will live when we shake the phone
		var currentPercent = 0;

		// Update the style
		function updatePercent(data){
			currentPercent+=data;
			gradient.css('height', Math.min(currentPercent, maxHeight) +'px');           
		}

		/**
		** PROXIMITY
		**/

		$('#startProximity').on('click', function(){
			proximityEnable = true;
		});

		$('#stopProximity').on('click', function(){
			proximityEnable = false;
		});

		// We get the html element
		var pushButton = $('.push_button');


		// We manage the push state
		function pushTheButton(){
			if (!pushButton.hasClass('press')){
			  pushButton.addClass('press');
			}
		}

		// We manage the unpush state
		function unPushTheButton(){
			pushButton.removeClass('press');
		}


		// According to the value of proximity, we define if we push or unpush the button
		function manageProximityValue(value){
			if (value < 2){
			  pushTheButton();
			}else{
			  unPushTheButton();
			}        
		}


		/**
		** LIGHT
		**/

		$('#startLight').on('click', function(){
			lightEnable = true;
		});

		$('#stopLight').on('click', function(){
			lightEnable = false;
		});

		// The light element
		var lightElt = $('.light-bg').get(0);
		//  The percent of luminosity
		var percent = 50;
		// The prefix to use for the gradient
		var prefixLight = Modernizr.prefixed('transform') === 'transform' ? '-webkit-' : "-moz-";

		// We update the css Style
		function updateLight(data){
			prefixLight = '-webkit-';
			percent = data;
			var style = prefixLight+'radial-gradient(center, '
			    +' ellipse cover, '
			    +' rgba(198,197,145,1) 0%,'
			    +' rgba(0,0,0,1) '+percent+'%)'
			    ;
			lightElt.style.background = style;
		}


		/**
		** USER MEIDA
		**/

		$('#startUserMedia').on('click', function(){
			register();
		});

		$('#stopUserMedia').on('click', function(){
          	unregister();
		});

		// we get the html elements
        var videoParent = $('.videoParent');
        var video = $('video').get(0);
        // the stream of video
        var localStream = null;
     
        /*
        * Your Code ! 
        */

        // We define the video constraints
        var constraints = {video: true};

        // We get the correct navigator method
        var gUM = Modernizr.prefixed('getUserMedia', navigator);

        // We manage an error while getting the stream
        function handleUserMediaError(error){
          console.log('navigator.getUserMedia error: ', error);
        }

        // We manage the success of getting the stream
        function handleUserMedia(stream){
          localStream = stream;
          video.src = window.URL.createObjectURL(stream);
          video.play();
          videoParent.addClass('rotate');
        }

        function register(){
          gUM(constraints, handleUserMedia, handleUserMediaError);
        }

        function unregister(){
          if (video) {
            video.pause();
          }
          if (localStream){
            localStream.stop();
          } 
          localStream = null;          
        }

                


	
	}, 1000);
});
