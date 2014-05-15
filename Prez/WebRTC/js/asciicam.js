var CammApp = CammApp || function () {
	var cam, intervalId, canvas, canvasCtx, ascii, streamUM;

	var loopSpeed = 100;
	var width = 160;
	var height = 120;

    var init = function () {
		//Get all the page element we need
        cam = document.getElementById('asciiCam');
        ascii = document.getElementById("asciiText");
		canvas = document.createElement("canvas");
		canvasCtx = canvas.getContext("2d");
		
    };

    var startCam = function (e) {
		// Get specific vendor methods
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

		// If browser supports user media
		if (navigator.getUserMedia) {
			navigator.getUserMedia({video: true, toString: function() { return "video"; } },
				function successCallback(stream) {
					streamUM = stream;
					if(navigator.getUserMedia==navigator.mozGetUserMedia) {
						cam.src = stream;
					} else {
						cam.src = window.URL.createObjectURL(stream) || stream;
					}
					cam.play();
					intervalId = setInterval(loop, loopSpeed);
				},
				function errorCallback(error) {
					alert("An error ocurred getting user media. Code:" + error.code);
				});
		}
		else
		{
			//Browser doesn't support user media
			alert("Your browser does not support user media");
		}

		e.preventDefault();
    };

    var stopCam = function (e) {
		clearInterval(intervalId);
		cam.src = null;
		if (streamUM){
			streamUM.stop();
		}
		if (e){
			e.preventDefault();
		}
    };

    //The generation of the ascii text was taken from this great sample from thecodeplayer:
    //http://thecodeplayer.com/walkthrough/cool-ascii-animation-using-an-image-sprite-canvas-and-javascript
    var loop = function () {
		var r, g, b, gray;
		var character, line = "";

		//clear canvas
		canvasCtx.clearRect (0, 0, width, height);

		//draw the video frame
		canvasCtx.drawImage(cam, 0, 0, width, height);

		//accessing pixel data
		var pixels = canvasCtx.getImageData(0, 0, width, height);
		var colordata = pixels.data;

		//every pixel gives 4 integers -> r, g, b, a
		//so length of colordata array is width*height*4

		ascii.innerHTML = ''; //clear contents

		for(var i = 0; i < colordata.length; i = i+4)
		{
			r = colordata[i];
			g = colordata[i+1];
			b = colordata[i+2];
			//converting the pixel into grayscale
			gray = r*0.2126 + g*0.7152 + b*0.0722;
			//overwriting the colordata array with grayscale values
			//colordata[i] = colordata[i+1] = colordata[i+2] = gray;

			//text for ascii art.
			//blackish = dense characters like "W", "@"
			//whitish = light characters like "`", "."
			if(gray > 250) character = " "; //almost white
			else if(gray > 230) character = "`";
			else if(gray > 200) character = ":";
			else if(gray > 175) character = "*";
			else if(gray > 150) character = "+";
			else if(gray > 125) character = "#";
			else if(gray > 50) character = "W";
			else character = "@"; //almost black

			//newlines and injection into dom
			if(i !== 0 && (i/4)%width === 0) //if the pointer reaches end of pixel-line
			{
				ascii.appendChild(document.createTextNode(line));
				//newline
				ascii.appendChild(document.createElement("br"));
				//emptying line for the next row of pixels.
				line = "";
			}

			line += character;
		}
    };
    
    Reveal.addEventListener( 'ready', function(){
       	setTimeout(function() {
	    	init();
	    }, 500);
    });

    return {
    	startCam : startCam,
    	stopCam : stopCam
    };

}();