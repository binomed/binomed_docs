'use strict';

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


module.exports = {
	register : register,
	register : unregister
}