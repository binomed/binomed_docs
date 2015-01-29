var ScreenApp = ScreenApp || function () {

  var videoElement = null,
    btnWindow = null,
    btnTab = null,
    streamUM = null;
  

  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  function init(){
    videoElement = document.querySelector("video.screenUserMedia");
    btnWindow = document.querySelector("button.desktopShareBtn");
    btnTab = document.querySelector("button.tabShareBtn");

    btnWindow.addEventListener('click', startWindow);
    btnTab.addEventListener('click', startTab);
    
  }

  function startWindow(){
    window.postMessage({ type: "WebRTC_Prez_JefBinomed_ASK_DESKTOP", idVideo : 'video.screenUserMedia'}, "*");
  }

  function startTab(){
    window.postMessage({ type: "WebRTC_Prez_JefBinomed_ASK_TAB", idVideo : 'video.screenUserMedia'}, "*");
  }

  function successCallback(stream) {
    streamUM = stream; // make stream available to console
    videoElement.src = window.URL.createObjectURL(stream);
    videoElement.play();
  }

  function errorCallback(error){
    console.log("navigator.getUserMedia error: ", error);
  }

  function start(){
    if (!videoElement){
      return;
    }
    if (!!streamUM) {
      videoElement.src = null;
      streamUM.stop();
    }    
  }

  function stop(){
    if (!videoElement){
      return;
    }
    videoElement.pause();
    if (!!streamUM) {
      videoElement.src = null;
      streamUM.stop();
      window.postMessage({ type: "WebRTC_Prez_JefBinomed_STOP_STREAM", idVideo : 'video.screenUserMedia'}, "*");
    }
  }
 

  Reveal.addEventListener( 'ready', function(){
      setTimeout(function() {
        init();
      }, 1000);
  });

  Reveal.addEventListener( 'startUMScreen', start);

  return {
    stopScreen : stop
  };

}();