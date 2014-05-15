var SourceApp = SourceApp || function () {

  var videoElement = null,
    audioSelect = null,
    videoSelect = null,
    streamUM = null;
  

  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  function init(){
    videoElement = document.querySelector("video.thirdUserMedia");
    audioSelect = document.querySelector("select#audioSource");
    videoSelect = document.querySelector("select#videoSource");
    audioSelect.onchange = start;
    videoSelect.onchange = start;

    if (typeof MediaStreamTrack === 'undefined'){
      alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
    } else {
      MediaStreamTrack.getSources(gotSources);
    }
  }

  function gotSources(sourceInfos) {
    for (var i = 0; i != sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];
      var option = document.createElement("option");
      option.value = sourceInfo.id;
      if (sourceInfo.kind === 'audio') {
        option.text = sourceInfo.label || 'microphone ' + (audioSelect.length + 1);
        audioSelect.appendChild(option);
      } else if (sourceInfo.kind === 'video') {
        option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source: ', sourceInfo);
      }
    }
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
    var audioSource = audioSelect.value;
    var videoSource = videoSelect.value;
    var constraints = {
      audio: {
        optional: [{sourceId: audioSource}]
      },
      video: {
        optional: [{sourceId: videoSource}]
      }
    };
    navigator.getUserMedia(constraints, successCallback, errorCallback);
  }

  function stop(){
    if (!videoElement){
      return;
    }
    videoElement.pause();
    if (!!streamUM) {
      videoElement.src = null;
      streamUM.stop();
    }
  }
 

  Reveal.addEventListener( 'ready', function(){
      setTimeout(function() {
        init();
      }, 1000);
  });

  Reveal.addEventListener( 'startUMSource', start);

  return {
    stopSource : stop
  };

}();