$(function(){

	setTimeout(function() {

		var socket = io.connect("http://"+location.hostname+":8080");

		var orientationEnable = false;
		var deviceMotionEnable = false;
		var proximityEnable = false;
		var lightEnable = false;
		var webSpeechEnable = false;

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
		    }else if (webSpeechEnable && data.type === 'WebSpeechEvent'){
		    	tasksGame.push(data.data);
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

		Reveal.addEventListener( 'start-proximity', function(){
			proximityEnable = true;
		});

		Reveal.addEventListener( 'stop-proximity', function(){
			proximityEnable = true;
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

		Reveal.addEventListener( 'start-light', function(){
			lightEnable = true;
		});

		Reveal.addEventListener( 'stop-light', function(){
			lightEnable = true;
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

		Reveal.addEventListener( 'start-usermedia', function(){
			register();
		});

		Reveal.addEventListener( 'stop-usermedia', function(){
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

                
        /**
        ** VIBRATION 
        **/


        var inputMorseText = $('#inputMorseText');
         // We manage the keypress => send to phone the instruction
      	inputMorseText.keypress(function(event) {
	        var key = event.which || event.keyCode;
	        if(key === 13) {
	          socket.emit('message',{
	          	'type' : 'morseText',
	          	'data' : inputMorseText.val(),
	          	'source' : false
	          });
	          inputMorseText.val("");            
	        }
	    });

        /**
        ** WEBSPEECH
        **/

        Reveal.addEventListener( 'start-webspeech', function(){
			webSpeechEnable = true;
			gameInit();
		});

		Reveal.addEventListener( 'stop-webspeech', function(){
			webSpeechEnable = true;
		});

        var tasksGame = [];
        function gameInit(){


	      var canvas = document.getElementById('canvasWebSpeech');
	      var ctx = canvas.getContext("2d");
	      canvas.width = 512;
	      canvas.height = 480;

	      // Background image
	      var bgReady = false;
	      var bgImage = new Image();
	      bgImage.onload = function () {
	        bgReady = true;
	      };
	      bgImage.src = "../assets/images/background.png";

	      // Hero image
	      var heroReady = false;
	      var heroImage = new Image();
	      heroImage.onload = function () {
	        heroReady = true;
	      };
	      heroImage.src = "../assets/images/hero.png";

	      // Monster image
	      var monsterReady = false;
	      var monsterImage = new Image();
	      monsterImage.onload = function () {
	        monsterReady = true;
	      };
	      monsterImage.src = "../assets/images/monster.png";

	      // Game objects
	      var hero = {
	        speed: 256 // movement in pixels per second
	      };
	      var monster = {};
	      var monstersCaught = 0;

	      // Handle keyboard controls
	      tasksGame = [];

	      /*$rootScope.$on('gameEvent', function(event, data){
	        
	      });*/ 

	      // Reset the game when the player catches a monster
	      var reset = function () {
	        hero.x = canvas.width / 2;
	        hero.y = canvas.height / 2;

	        // Throw the monster somewhere on the screen randomly
	        monster.x = 32 + (Math.random() * (canvas.width - 64));
	        monster.y = 32 + (Math.random() * (canvas.height - 64));
	      };

	      // Update game objects
	      var update = function (modifier) {
	        var data = tasksGame[0];
	        tasksGame = tasksGame.slice(1,tasksGame.length);
	        var mvt = 20;
	        if (data === 'haut'){          
	          hero.y -= mvt;//hero.speed * modifier;
	        }else if (data === 'bas'){
	          hero.y += mvt;//hero.speed * modifier;          
	        }else if (data === 'gauche'){
	          hero.x -= mvt;//hero.speed * modifier;          
	        }else if (data === 'droite'){
	          hero.x += mvt;//hero.speed * modifier;          
	        }
	        
	        // Are they touching?
	        if (
	          hero.x <= (monster.x + 32)
	          && monster.x <= (hero.x + 32)
	          && hero.y <= (monster.y + 32)
	          && monster.y <= (hero.y + 32)
	        ) {
	          ++monstersCaught;
	          reset();
	        }
	      };

	      // Draw everything
	      var render = function () {
	        if (bgReady) {
	          ctx.drawImage(bgImage, 0, 0);
	        }

	        if (heroReady) {
	          ctx.drawImage(heroImage, hero.x, hero.y);
	        }

	        if (monsterReady) {
	          ctx.drawImage(monsterImage, monster.x, monster.y);
	        }

	        // Score
	        ctx.fillStyle = "rgb(250, 250, 250)";
	        ctx.font = "24px Helvetica";
	        ctx.textAlign = "left";
	        ctx.textBaseline = "top";
	        ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	      };

	      // The main game loop
	      var main = function () {
	        var now = Date.now();
	        var delta = now - then;

	        update(delta / 1000);
	        render();

	        then = now;
	      };

	      // Let's play this game!
	      reset();
	      var then = Date.now();
	      setInterval(main, 1); // Execute as fast as possible

        }

	
	}, 1000);
});
