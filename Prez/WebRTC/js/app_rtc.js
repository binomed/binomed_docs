'use strict';

var AppSlideWebRTC = AppSlideWebRTC || 
function(){

  
  var currentId = "idPeer"+(new Date().getTime()),
      isChannelReady,
      isPrez,
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
    'optional': 
      webrtcDetectedBrowser === 'firefox' ?
      [{'DtlsSrtpKeyAgreement': true},
      {'RtpDataChannels': true}] :
      []
    };

  // Set up audio and video regardless of what devices are present.
  var sdpConstraints = {'mandatory': {
    'OfferToReceiveAudio':false,
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
    message.idPeer = currentId;
  	console.log('Sending message: ', message);
    socket.emit('message', message);
  }

  socket.on('message', function (message){
    try{

      console.log('Received message:', message);
      if (message.type === 'got_user_media' && message.idPeer != currentId) {
        createPeerConnection();
      } else if (message.type === 'offer' && message.idPeer != currentId) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
      } else if (message.type === 'answer' && message.idPeer != currentId) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(message));
      } else if (message.type === 'candidate'/* && message.idPeer != currentId*/) {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex:message.label,
          candidate:message.candidate
        });
        peerConnection.addIceCandidate(candidate);
      } else if (message === 'bye' && message.idPeer != currentId) {
        hangup();
      } else if (message.type === 'peerConnectionCreated' && message.idPeer != currentId){
        if (!isPrez){
          doCall();
        }
      }
    }catch(e){
      console.error(e);
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
    createPeerConnection();
    sendMessage({type : 'got_user_media'});
  }


  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  //////// Application
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////

  // On fait appel au serveur turn pour l'authent
  var remoteVideo = null;
  
  function initPhone(){
    isPrez = false;
  }

  function initPrez(){
    isPrez = true;
    remoteVideo = document.querySelector('#remoteVideo');
  }
  
  window.onbeforeunload = function(e){
    handleRemoteHangup();
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
      console.log('Created RTCPeerConnnection with:\n' +
        '  constraints: \'' + JSON.stringify(pc_constraints) + '\'.');

      peerConnection = new RTCPeerConnection(pc_config, pc_constraints);
      peerConnection.onicecandidate = handleIceCandidate;
      peerConnection.onaddstream = handleRemoteStreamAdded;
      peerConnection.onremovestream = handleRemoteStreamRemoved;

      if (!isPrez){
        if (localStream){
          peerConnection.addStream(localStream);
        }
        createDataChannel();
      }else{
        peerConnection.ondatachannel = gotDataChannel;
        //doCall();
      }    
      sendMessage({type:'peerConnectionCreated'});
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object.');
        return;
    }

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
    //console.log('Sending offer to peer, with constraints: \n'+'  \''+ JSON.stringify(constraints) + '\'.');*/
    console.log('Sending offer to peer');
    peerConnection.createOffer(setLocalAndSendMessage,  
      function onCreateSessionDescriptionError(error){
        console.error('Failed to create session description: ' + error.toString());
      },  
      constraints);
  }

  function doAnswer() {
    console.log('Sending answer to peer.');
    peerConnection.createAnswer(setLocalAndSendMessage, 
      function onCreateSessionDescriptionError(error){
        console.error('Failed to create session description: ' + error.toString());
      }
      , sdpConstraints);
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
    trace('SetlocalAndSendMessage from localPeerConnection \n' + sessionDescription.sdp);
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

  
  function initDataChannel(){
    try{

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
    }catch(e){
      console.error(e);
    }
  }

  function gotDataChannel(event){
    console.info("Data Channel Arrived : "+event.channel);
    communicationDataChannel = event.channel;
    initDataChannel();
  }

  function createDataChannel(){
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

 
  return {
    handleUserMedia : handleUserMedia,
    hangup : hangup, 
    initPhone : initPhone,
    initPrez : initPrez,
    sendMessageDataChannel : sendMessageDataChannel,
    setCallBackDataChannel : setCallBackDataChannel
  };
}();
