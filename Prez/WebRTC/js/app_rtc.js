'use strict';

var AppSlideWebRTC = AppSlideWebRTC || 
function(){

  
  var isChannelReady,
      isPrez,
      isStarted,
      peerConnection,
      localStream,
      remoteStream,
      callBackDataChannel,
      communicationDataChannel,
      turnReady;

  var pc_config = webrtcDetectedBrowser === 'firefox' ?
    {'iceServers':[{'url':'stun:23.21.150.121'}]} : // number IP
    {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

  var pc_constraints = {
    'optional': [
      /*{'DtlsSrtpKeyAgreement': true},*/
      {'RtpDataChannels': true}
    ]};

  // Set up audio and video regardless of what devices are present.
  var sdpConstraints = {'mandatory': {
    'OfferToReceiveAudio':true,
    'OfferToReceiveVideo':true }};

  /////////////////////////////////////////////
  /////////////////////////////////////////////
  /////////////////////////////////////////////
  /////////////    Signaling ! 
  /////////////////////////////////////////////
  /////////////////////////////////////////////


  var room = 'PrezWebRTC_jefBinomed';
  
  
  if (!window.io){
    return{};
  }




  var socket = io.connect('http://'+window.location.hostname+':9999');

  if (room !== '') {
    console.log('Create or join room', room);
    socket.emit('create or join', room);
  }

  socket.on('created', function (room){
    console.log('Created room ' + room);
    
  });

  socket.on('full', function (room){
    console.log('Room ' + room + ' is full');
  });

  socket.on('join', function (room){
    console.log('Another peer made a request to join room ' + room);
    console.log('This peer is the initiator of room ' + room + '!');
    isChannelReady = true;
  });

  socket.on('joined', function (room){
    console.log('This peer has joined room ' + room);
    isChannelReady = true;
  });

  socket.on('log', function (array){
    console.log.apply(console, array);
  });

  ////////////////////////////////////////////////

  function sendMessage(message){
  	console.log('Sending message: ', message);
    socket.emit('message', message);
  }

  socket.on('message', function (message){
    console.log('Received message:', message);
    if (message === 'got user media') {
    	maybeStart();
    } else if (message.type === 'offer') {
      if (!isPrez && !isStarted) {
        maybeStart();
      }
      peerConnection.setRemoteDescription(new RTCSessionDescription(message));
      doAnswer();
    } else if (message.type === 'answer' && isStarted) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === 'candidate' && isStarted) {
      var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,
        candidate:message.candidate});
      peerConnection.addIceCandidate(candidate);
    } else if (message === 'bye' && isStarted) {
      handleRemoteHangup();
    }
  });

  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ///////////////// UM methods 
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////


  function handleUserMedia(stream) {
    localStream = stream;
    //attachMediaStream(localVideo, stream);
    //console.log('Adding local stream.');
    //if (isPrez) {
      maybeStart();
    //}
    sendMessage('got user media');
  }

  function maybeStart() {
    if (!isStarted /*&& /*(localStream || isPrez)*/  && isChannelReady) {
      isStarted = true;
      createPeerConnection();
      if (!isPrez){
        if (localStream){
          peerConnection.addStream(localStream);
        }
        startDataChannel();
      }else{
        listenDataChannel();
      }
      if (isPrez) {
        doCall();
      }
    }
  }

  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  //////// Application
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////

  // On fait appel au serveur turn pour l'authent
  var remoteVideo = document.querySelector('#remoteVideo');
  var init = false;
  
  function initPhone(){
    isPrez = false;
    remoteVideo = document.querySelector('#remoteVideo');

  }
  function initPrez(){
    isPrez = true;
    remoteVideo = document.querySelector('#remoteVideo');
  }
  //requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
  window.onbeforeunload = function(e){
  	sendMessage('bye');
  }

  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  //////////// PeerConnections
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////

  function createPeerConnection() {
    try {
      peerConnection = new RTCPeerConnection(null, pc_constraints);
      peerConnection.onicecandidate = handleIceCandidate;
      console.log('Created RTCPeerConnnection with:\n' +
        '  config: \'' + JSON.stringify(pc_config) + '\';\n' +
        '  constraints: \'' + JSON.stringify(pc_constraints) + '\'.');
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object.');
        return;
    }
    peerConnection.onaddstream = handleRemoteStreamAdded;
    peerConnection.onremovestream = handleRemoteStreamRemoved;

    
    

  }

  function handleIceCandidate(event) {
    console.log('handleIceCandidate event: ', event);
    if (event.candidate) {
      sendMessage({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate});
    } else {
      console.log('End of candidates.');
    }
  }

  function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    attachMediaStream(remoteVideo, event.stream);
    remoteStream = event.stream;
  }

  function doCall() {
    var constraints = {'optional': [], 'mandatory': {'MozDontOfferDataChannel': true}};
    // temporary measure to remove Moz* constraints in Chrome
    if (webrtcDetectedBrowser === 'chrome') {
      for (var prop in constraints.mandatory) {
        if (prop.indexOf('Moz') !== -1) {
          delete constraints.mandatory[prop];
        }
       }
     }
    constraints = mergeConstraints(constraints, sdpConstraints);
    console.log('Sending offer to peer, with constraints: \n' +
      '  \'' + JSON.stringify(constraints) + '\'.');
    peerConnection.createOffer(setLocalAndSendMessage, null, constraints);
  }

  function doAnswer() {
    console.log('Sending answer to peer.');
    peerConnection.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
  }

  function mergeConstraints(cons1, cons2) {
    var merged = cons1;
    for (var name in cons2.mandatory) {
      merged.mandatory[name] = cons2.mandatory[name];
    }
    merged.optional.concat(cons2.optional);
    return merged;
  }

  function setLocalAndSendMessage(sessionDescription) {
    // Set Opus as the preferred codec in SDP if Opus is present.
    sessionDescription.sdp = preferOpus(sessionDescription.sdp);
    peerConnection.setLocalDescription(sessionDescription);
    sendMessage(sessionDescription);
  }

  function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    attachMediaStream(remoteVideo, event.stream);
    remoteStream = event.stream;
  }

  function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
  }

  function hangup() {
    console.log('Hanging up.');
    stop();
    sendMessage('bye');
  }

  function handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
    isPrez = false;
  }

  function stop() {
    isStarted = false;
    // isAudioMuted = false;
    // isVideoMuted = false;
    if (communicationDataChannel){
      try{
        communicationDataChannel.close();        
      }catch(e){
      }
    }
    communicationDataChannel = null;
    
    if (peerConnection){
      try{
        peerConnection.close();
      }catch(e){        
      }
    }
    peerConnection = null;
  }

  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  //////////// Data Channel
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////

  function listenDataChannel(){
    peerConnection.ondatachannel = function(event){
      console.info("Data Channel Arrived : "+event.channel);
      if (!communicationDataChannel){        
        communicationDataChannel = event.channel;
        initDataChannel();
      }
    }
  }

  function initDataChannel(){
    if (communicationDataChannel){
      communicationDataChannel.onerror = function (error) {
        console.error(">>>>>Data Channel Error:", error);
        console.error(error);
      };

      communicationDataChannel.onopen = function () {
        console.info(">>>>>>Data Channel Open ! ")
        communicationDataChannel.send("Hello World!");
      };

      communicationDataChannel.onclose = function () {
        console.info(">>>>The Data Channel is Closed");
      };

      communicationDataChannel.onmessage = function(event){
        console.info(">>>>> Data Channel message : "+event.data);
      }
    }
  }

  function startDataChannel(){
    var dataChannelOptions = {
      reliable:false/*,
      ordered: true*/
    };
    communicationDataChannel = peerConnection.createDataChannel('orientation', dataChannelOptions);
    console.info(">>>>> Create a dataChannel : orientation")
    initDataChannel();
  }

  function sendMessageDataChannel(message){
    if (communicationDataChannel && communicationDataChannel.readyState === 'open'){
      communicationDataChannel.send(JSON.stringify(message));
    }
  }
  
  function setCallBackDataChannel(callBack){
    if (communicationDataChannel){
      communicationDataChannel.onmessage = callBack;
    }
  }

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  //////// Audio configuration
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  // Set Opus as the default audio codec if it's present.
  function preferOpus(sdp) {
    var sdpLines = sdp.split('\r\n');
    var mLineIndex;
    // Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
          mLineIndex = i;
          break;
        }
    }
    if (mLineIndex === null) {
      return sdp;
    }

    // If Opus is available, set it as the default in m line.
    for (i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('opus/48000') !== -1) {
        var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
        if (opusPayload) {
          sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
        }
        break;
      }
    }

    // Remove CN in m line and sdp.
    sdpLines = removeCN(sdpLines, mLineIndex);

    sdp = sdpLines.join('\r\n');
    return sdp;
  }

  function extractSdp(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
  }

  // Set the selected codec to the first in m line.
  function setDefaultCodec(mLine, payload) {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
      if (index === 3) { // Format of media starts from the fourth.
        newLine[index++] = payload; // Put target payload to the first.
      }
      if (elements[i] !== payload) {
        newLine[index++] = elements[i];
      }
    }
    return newLine.join(' ');
  }

  // Strip CN from sdp before CN constraints is ready.
  function removeCN(sdpLines, mLineIndex) {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    // Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length-1; i >= 0; i--) {
      var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
      if (payload) {
        var cnPos = mLineElements.indexOf(payload);
        if (cnPos !== -1) {
          // Remove CN payload from m line.
          mLineElements.splice(cnPos, 1);
        }
        // Remove CN line in sdp
        sdpLines.splice(i, 1);
      }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
  }


  return {
    handleUserMedia : handleUserMedia,
    hangup : hangup, 
    initPhone : initPhone,
    initPrez : initPrez,
    startDataChannel : startDataChannel,    
    sendMessageDataChannel : sendMessageDataChannel,
    setCallBackDataChannel : setCallBackDataChannel
  };
}();
