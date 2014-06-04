var port = chrome.runtime.connect({name:'content_script'});

var peerConnection = null;
var sourcePeer = "";
var videoId = null;

/*
* MESSAGE FROM WEB PAGE !
*/

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

	switch(event.data.type){
		case "WebRTC_Prez_JefBinomed_ASK_DESKTOP":
		case "WebRTC_Prez_JefBinomed_ASK_TAB":
			videoId = event.data.idVideo;
    		port.postMessage(event.data);
		break;		
		case "WebRTC_Prez_JefBinomed_STOP_STREAM":
			port.postMessage({type:"stopStream"});
		break;
	}
  
}, false);

/*
* MESSAGE FROM Background
*/


port.onMessage.addListener(function(msg){
	console.info('Message From LongLivedConnection');
	console.info(msg);
	switch(msg.type){
	case 'gotScreen' :
		try{
			gotStream(msg.streamData);
		}catch(e){
			console.error(e);
		}
		break;
	case 'gotScreenError' : 
		getUserMediaError();
		break;
	case 'call':
		sourcePeer = msg.peerId;		
		var server = null;
		peerConnection = new webkitRTCPeerConnection(server); 
		peerConnection.onicecandidate = function(event){
			if (event.candidate) {
				port.postMessage({peerId : sourcePeer, type:'candidate', candidate : event.candidate});			    
			}
		};
		peerConnection.onaddstream = gotStream;
		port.postMessage({peerId : sourcePeer, type:'continue'});			   
		break;
	case 'candidate':
        peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
        break;
    case 'description':
        peerConnection.setRemoteDescription(new RTCSessionDescription(msg.description));
        peerConnection.createAnswer(function(desc){
        	peerConnection.setLocalDescription(desc);
        	port.postMessage({peerId : sourcePeer, type:'description', description : desc});			    
        });
        break;
	}
});

function gotStream(stream) {
  console.log("Received local stream");
  var video = document.querySelector(videoId);
  var url = URL.createObjectURL(stream.stream);
  video.src = url;
  localstream = stream.stream;
  stream.onended = function() { console.log("Ended"); };
}

function getUserMediaError(e) {
  console.log("getUserMedia() failed.");
  console.error(e);
}
