var peerConnection = null, 
    localStream = null,
    portContentScript = null,
    portPopup = null,
    portPopupTab = null,
    tabReference = -1;

/*
 Action of sharing tab
*/
chrome.pageAction.onClicked.addListener(function(tab){
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabCapture.capture({audio: true, video: true}, manageRTCConnection);
    });
});

/* background page, responsible for actually choosing media */
chrome.runtime.onConnect.addListener(function (channel) {
    console.info('Register a new Channel ! '+channel.name+".");
    switch(channel.name){
        case 'content_script':
            portContentScript = channel;
            portContentScript.onMessage.addListener(callBackMessagesContentScript);
        break;
        case 'popup':
            portPopup = channel;
            portPopup.onMessage.addListener(callBackMessagesPopup);
        break;
        case 'tab_share':
            portPopupTab = channel;
            channel.onMessage.addListener(callBackMessageForward);
        break;
    }
    
});

function callBackMessageForward(message){
    switch(message.type){
        case 'backToTab':
            
        break;
        default:
        portContentScript.postMessage(message);
    }
}

function callBackMessagesPopup(message){
    switch(message.type){
        case 'selectTab':
        chrome.tabs.query({'active': true}, function(tabs) {
            tabReference = tabs[0].id;
        });
        chrome.tabs.update(+message.tabId, {
            active : true
        }, function(){
           chrome.pageAction.show(+message.tabId);
        });
        portContentScript.postMessage(message);
        break;
    }
}

function callBackMessagesContentScript(message){
    console.info('message from background.js');
    switch(message.type) {
    case 'stopStream':
        if (localStream){
            localStream.stop();
        }
        break;
    case 'candidate':
        if (message.peerId === "background"){
            peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }else{
            portPopupTab.postMessage(message);
        }
        break;
    case 'description':
        if (message.peerId === "background"){
            peerConnection.setRemoteDescription(new RTCSessionDescription(message.description));
        }else{
            portPopupTab.postMessage(message);
        }
        break;
    case 'continue':
        if (message.peerId === "background"){
            peerConnection.addStream(localStream);
            peerConnection.createOffer(function(desc){
                peerConnection.setLocalDescription(desc);
                portContentScript.postMessage({peerId : "background", type:'description', description : desc});        
            });
        }else{
            portPopupTab.postMessage(message);
        }
        break;
    case 'WebRTC_Prez_JefBinomed_ASK_TAB':
        chrome.windows.create({
          url : 'background/popup.html',
          focused : true,
          type : 'popup',
          width: 700,
          height: 600
          
        });
        break;
    case 'WebRTC_Prez_JefBinomed_ASK_DESKTOP':
        var pending = chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], function (streamid) {
            // communicate this string to the app so it can call getUserMedia with it
            navigator.webkitGetUserMedia({
                  audio:false,
                  video: { mandatory: { chromeMediaSource: "desktop",
                                        chromeMediaSourceId: streamid } }
              }, manageRTCConnection, function(){
                portContentScript.postMessage({type: 'gotScreenError'});
              });
        });
        break;
    case 'cancelGetScreen':
        chrome.desktopCapture.cancelChooseDesktopMedia(message.request);
        message.type = 'canceledGetScreen';
        portContentScript.postMessage(message);
        break;
    default:
        console.info(message);
    }
}

function manageRTCConnection(stream){
    localStream = stream;
    var server = null;
    peerConnection = new webkitRTCPeerConnection(server); 
    peerConnection.onicecandidate = function(event){
        if (event.candidate) {
            portContentScript.postMessage({peerId : "background", type:'candidate', candidate : event.candidate});        
        }
    };
    portContentScript.postMessage({peerId : "background", type:'call'});        
    chrome.tabs.update(tabReference, {
        active : true
    }, function(){
    });
}
