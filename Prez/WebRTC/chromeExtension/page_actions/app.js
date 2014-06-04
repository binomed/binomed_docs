var peerConnection = null, 
    localStream = null,
    portContentBackground = null;

var portContentBackground = chrome.runtime.connect({name:'tab_share'});

portContentBackground.onMessage.addListener(callBackMessagesBackground);

function callBackMessagesBackground(message){
    console.info('message from background.js');
    switch(message.type) {
    case 'candidate':
        peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        break;
    case 'description':
        peerConnection.setRemoteDescription(new RTCSessionDescription(message.description));
        break;
    case 'continue':
        peerConnection.addStream(localStream);
        peerConnection.createOffer(function(desc){
            peerConnection.setLocalDescription(desc);
            portContentBackground.postMessage({peerId : "popupTab", type:'description', description : desc});        
        });
        break;   
    }
}

function manageRTCConnection(stream){
    localStream = stream;
    var server = null;
    peerConnection = new webkitRTCPeerConnection(server); 
    peerConnection.onicecandidate = function(event){
        if (event.candidate) {
            portContentBackground.postMessage({peerId : "popupTab", type:'candidate', candidate : event.candidate});        
        }
    };
    portContentBackground.postMessage({peerId : "popupTab", type:'call'});    
    //portContentBackground.postMessage({peerId : "popupTab", type:'backToTab'});        

}

document.querySelector('#share').addEventListener('click', function(e) {
   /*chrome.tabs.getSelected(null, function(tab) {
        chrome.tabCapture.capture({audio: true, video: true}, manageRTCConnection);
    });
*/
});


document.querySelector('#cancel').addEventListener('click', function(e) {
  window.close();
  //portContentBackground.postMessage({peerId : "popupTab", type:'backToTab'});        
});
