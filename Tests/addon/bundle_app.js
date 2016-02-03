(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

angular.module("SuperPowerApp", ['ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('orange');
})
.service('SocketService', require('./socket/sockets'))
.service('ModelService', require('./util/model'))
.directive('app', ['$mdDialog', '$timeout', 'SocketService', 'ModelService',
	function($mdDialog, $timeout, SocketService, ModelService){

		SocketService.connect(ModelService);

	return {
		templateUrl: './components/app.html',
		controllerAs : 'app',
		bindToController : true,
		controller: function(){
			this.actions = [
				{label : "Bluetooth", icon : 'fa-bluetooth', idAction: 'ble'},
				{label : "Light", icon : 'fa-lightbulb-o', idAction: 'light'},
				{label : "Orientation", icon : 'fa-compass', idAction: 'orientation'},
				{label : "UserMedia", icon : 'fa-camera', idAction: 'camera'},
				{label : "Proximity", icon : 'fa-rss', idAction: 'proximity'},
				{label : "Voice", icon : 'fa-microphone', idAction: 'mic'}
			];

			
			

			if (window.location.search === '?proximity'){
				$mdDialog.show({
					controllerAs : 'proximityCtrl',
					templateUrl: './components/proximity.html',
					controller: require('./sensors/proximity'),
					parent : angular.element(document.querySelector('#mainContainer')),
					fullScreen : true
				});
			}else if (window.location.search === '?speech'){
				$mdDialog.show({
					controllerAs : 'voiceCtrl',
					templateUrl: './components/voice.html',
					controller: require('./sensors/voice'),
					parent : angular.element(document.querySelector('#mainContainer')),
					fullScreen : true
				});
			}else{
				$mdDialog.show({
					controllerAs : 'secureCtrl',
					templateUrl: './components/secure.html',
					controller: require("./secure/secure"),
					parent : angular.element(document.querySelector('#mainContainer')),
					//targetEvent : event,
					fullScreen : true
				});
			}

			this.openDialog = function(event, type){
				console.log('Open Dialog');
				if (type === 'ble'){
					$mdDialog.show({
						controllerAs : 'bleCtrl',
						templateUrl: './components/bluetooth.html',
						controller: require('./sensors/bluetooth'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'light'){
					$mdDialog.show({
						controllerAs : 'lightCtrl',
						templateUrl: './components/light.html',
						controller: require('./sensors/light'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'orientation'){
					$mdDialog.show({
						controllerAs : 'orientationCtrl',
						templateUrl: './components/orientation.html',
						controller: require('./sensors/orientation'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'mic'){
					$mdDialog.show({
						controllerAs : 'voiceCtrl',
						templateUrl: './components/voice.html',
						controller: require('./sensors/voice'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'proximity'){
					$mdDialog.show({
						controllerAs : 'proximityCtrl',
						templateUrl: './components/proximity.html',
						controller: require('./sensors/proximity'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'camera'){
					$mdDialog.show({
						controllerAs : 'cameraCtrl',
						templateUrl: './components/usermedia.html',
						controller: require('./sensors/usermedia'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}
			}
		}
	}
}]);


function pageLoad(){	
	//require('./socket/sockets');
}



window.addEventListener('load', pageLoad);
},{"./secure/secure":2,"./sensors/bluetooth":3,"./sensors/light":4,"./sensors/orientation":5,"./sensors/proximity":6,"./sensors/usermedia":7,"./sensors/voice":8,"./socket/sockets":9,"./util/model":10}],2:[function(require,module,exports){
'use strict'

var model = null,
	socket = null;



function doRequest($mdDialog, context, pwd){
	let myHeaders = new Headers();
	let myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'cors',
           cache: 'default' };
    let address = model.getAddress();
    let protocol = model.isSSL() ? 'https' : 'http';

	let myRequest = new Request(`${protocol}://${address}/password/${pwd}`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		// On ne retraire pas une question déjà traitée
		if (json.auth){
			localStorage['pwd'] = pwd;
			socket.sendMessage({
				type: 'ble',
				action: 'stopPhysicalWeb'
			})
			if (location.search === ""){
				$mdDialog.hide();
			}
		}else{
			context.notvalid = true;
		}


	});
}

function SecureCtrl($mdDialog, ModelService, SocketService){
	
	socket = SocketService;
	model = ModelService;
	this.notvalid = false;
	let context = this;

	model.checkAddress()
	.then(function(){		
		if (localStorage['pwd']){
			doRequest($mdDialog, context, localStorage['pwd']);
		}
	})

	this.try = function(){
		doRequest($mdDialog, context, context.pwd);
	}


}

SecureCtrl.$inject = ['$mdDialog', 'ModelService', 'SocketService'];

module.exports = SecureCtrl;
},{}],3:[function(require,module,exports){
'use strict'

const serviceUUID = '11111111-2222-3333-4444-000000000000',
	characteristicWriteUUID = '11111111-2222-3333-4444-000000000010';

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

var serverGATT = null,
	serviceGATT = null,
	characteristicGATT = null,
	encoder = new TextEncoder();

function initBle(){
	return new Promise(function(resolve, reject){
		navigator.bluetooth.requestDevice({ 
			filters: [{ name: 'RpiJefLedDevice' }, { name: 'JefLedDevice' }]
		})
		.then(function(device) {
		   console.log("Connecting...");
		   return device.connectGATT();
		 })
		.then(function(server) {
			serverGATT = server;
			//return server.getPrimaryService(serviceUUID);
		   // FIXME: Remove this timeout when GattServices property works as intended.
		   // crbug.com/560277
		   return new Promise(function(resolveService, rejectService) {
		     setTimeout(function() {
		     	try{
		     		console.log("Try to get Service");
		       		resolveService(server.getPrimaryService(serviceUUID));
		     	}catch(err){
		     		rejectService(err);
		     	}
		     }, 2e3);
		   })
		}).then(function(service){
			serviceGATT = service;
			resolve(service);			
		}).catch(function(error){
			console.error(error);
			reject(error);
		});
	})
}


function getService(){
	return new Promise(function(resolve, reject){
		if (serverGATT && serverGATT.connected && serviceGATT){
			resolve(serviceGATT);
		}else{
			initBle()
			.then(function(service){
				resolve(service);
			})
			.catch(function(error){
				reject(error);
			});
		}
	});
}

function getCharacteristic(){
	return new Promise(function(resolve, reject){
		if (characteristicGATT){
			resolve(characteristicGATT);
		}else{
			getService()
			.then(function(service){
				console.log("Try to get Characteritic : %O",service);
				return service.getCharacteristic(characteristicWriteUUID);
			})
			.then(function(characteritic){
				characteristicGATT = characteritic;
				resolve(characteritic);
			}).catch(function(error){
				reject(error);
			});
		}
	});
}

function processCharacteristic(type, data, callback){
	getCharacteristic()
	.then(function(characteristic){
		if (type === 'write'){			
			console.log("Try to write value : %O",characteristic);
			return characteristic.writeValue(encoder.encode(data));
		}else{
			console.log("Try to read value : %O",characteristic);
			return characteristic.readValue();
		}
	}).then(function(buffer){
		if (type === 'write'){
			if(callback){
				callback({type: 'write', value : true});			
			}
			console.info("Write datas ! ");
		}else{
			let data = new DataView(buffer);
		    let dataDecrypt = data.getUint8(0);
		    callback({type: 'read' , value : dataDecrypt});
		    console.log('ReceiveDatas %s', dataDecrypt);
		}
	}).catch(function(error){
		console.error(error);
		if (callback) {

			callback({type : 'error', value : error});
		}
	});
}



function BleController($mdDialog, $timeout){

	this.sliderActiv = false;
	this.currentTimer = null;
	this.power = 125;

	this.close = function(){
		$mdDialog.hide();
	} 

	this.turnOn = function(){
		processCharacteristic('write', "on");
	}

	this.blink = function(){
		processCharacteristic('write', "blink");
	}

	this.turnOff = function(){
		processCharacteristic('write', "off");
	}
	
	this.changePower = function(){
		processCharacteristic('write', "bright:"+this.power);
	};

	this.activSlider = function(){
		if (this.currentTimer){
			$timeout.cancel(this.currentTimer);
		}
		this.sliderActiv = true;
		this.currentTimer = $timeout(function(context){
			context.sliderActiv = false;
		},5000,true, this);
	}
}

BleController.$inject = ['$mdDialog', '$timeout']


module.exports = BleController;/*{
	writeData : processCharacteristic
}*/


},{}],4:[function(require,module,exports){
'use strict';

let socket = null;

// The handler
var deviceLightHandler = function(event) {
	// The value will live between 0 and ~150
	// But when it is 45 is a high lumonsity
	var value = Math.min(45, event.value);        
	let percent = Math.round((value / 45) * 100);       
	socket.sendMessage({type: 'light', value : percent});
}

// We add the listener
function register(){
	window.addEventListener('devicelight', deviceLightHandler, false);
}

function unregister(){
	window.removeEventListener('devicelight', deviceLightHandler, false);
}

function LightControler($mdDialog, SocketService){

	socket = SocketService;

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}

LightControler.$inject = ['$mdDialog', 'SocketService']

module.exports = LightControler;
},{}],5:[function(require,module,exports){
'use strict';

let socket = null, 
	firstValue = -1;

// The handler of the event
var deviceOrientationListener = function(event){        
	var alpha = Math.round(event.alpha);
	var beta = Math.round(event.beta);
	var gamma = Math.round(event.gamma);
	if (firstValue === -1){
		firstValue = alpha;
	}
	socket.sendMessage({type: 'orientation', value : alpha, 'firstValue' : firstValue});	
}

function register(){
	firstValue = -1;
	window.addEventListener('deviceorientation', deviceOrientationListener, false);
}

function unregister(){
	window.removeEventListener('deviceorientation', deviceOrientationListener, false);
}

function OrientationControler($mdDialog, SocketService){

	socket = SocketService;

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}

OrientationControler.$inject = ['$mdDialog', 'SocketService']


module.exports = OrientationControler;
},{}],6:[function(require,module,exports){
'use strict'

var model = null;

// The listener
var deviceProximityHandler = function(event) {
	var value = Math.round(event.value);        
	if (value === 0){
		let address = model.getAddress();
		window.location = `intent://${address}/addon/index_app.html?speech#Intent;scheme=http;package=org.chromium.chrome;end`;
	}    
	//socket.sendProximity(value);
	//manageProximityValue(value);
}

function register(){
	window.addEventListener('deviceproximity', deviceProximityHandler, false);
}

function unregister(){
	window.removeEventListener('deviceproximity', deviceProximityHandler, false);
}

function ProximityControler($mdDialog, ModelService){

	model = ModelService;

	this.turnOn = function(){
		if (window.DeviceProximityEvent){

			register();
		}else{
			let address = model.getAddress();
			//window.location = `intent://10.33.44.181:3000/addon/index_app.html#Intent;scheme=http;package=org.mozilla.firefox_beta;end`;
			window.location = `intent://${address}/addon/index_app.html?proximity#Intent;scheme=http;package=org.mozilla.firefox_beta;end`;
		}
	}

	this.goToChrome = function(){
		let address = model.getAddress();
		//window.location = `intent://10.33.44.181:3000/addon/index_app.html#Intent;scheme=http;package=org.mozilla.firefox_beta;end`;
		window.location = `intent://${address}/addon/index_app.html#Intent;scheme=http;package=org.chromium.chrome;action=android.intent.action.VIEW;launchFlags=0x10000000;end`;
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}

ProximityControler.$inject = ['$mdDialog', 'ModelService'];

module.exports = ProximityControler;
},{}],7:[function(require,module,exports){
'use strict';

var socket = null,
  videoElement = null,
  canvas = null, 
  videoSource = null,
  selectors = null;

 

function gotDevices(deviceInfos) {
  deviceInfos.forEach(function(device){
    if (device.kind === 'videoinput' && device.label.indexOf('back') != 0){
      videoSource = device.deviceId;
    }
  });  
}

navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });

function start(){
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  var constraints = {
    audio : false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
}


function successCallback(stream) {
  window.stream = stream; // make stream available to console
  if (!videoElement){
    videoElement = document.getElementById("myVideo");
    canvas = document.getElementById("myCanvas");
  }
  videoElement.src = window.URL.createObjectURL(stream);
  videoElement.onloadedmetadata = function(e) {
    videoElement.play();
  };
}

function errorCallback(error){
    console.log("navigator.getUserMedia error: ", error);
  }

    function register(){
      start();
      
    }

    function unregister(){
      if (videoElement) {
        videoElement.pause();
        videoElement.src = null;
      }
         
    }

function CameraCtrl($mdDialog, SocketService){
  socket = SocketService;

  videoElement = document.getElementById("myVideo");
  canvas = document.getElementById("myCanvas");

  this.turnOn = function(){
    register();
  }

  this.photo = function(){
    var context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
  
    var data = canvas.toDataURL('image/png');
    console.log(data);
    socket.sendMessage({type: 'usermedia', value : data});      
    
  }

  this.close = function(){
    unregister();
    $mdDialog.hide();
  }
}

CameraCtrl.$inject = ['$mdDialog', 'SocketService']

module.exports = CameraCtrl;
},{}],8:[function(require,module,exports){
'use strict'

var socket = null;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

//var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
var recognition = new SpeechRecognition();
//var speechRecognitionList = new SpeechGrammarList();
//speechRecognitionList.addFromString(grammar, 1);
//recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'fr-FR';
recognition.interimResults = true;
//recognition.maxAlternatives = 1;

//var diagnostic = document.querySelector('.output');
//var bg = document.querySelector('html');

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at position 0.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object 
  var finalStr = event.results[0][0].transcript;
  //diagnostic.textContent = 'Result received: ' + color + '.';
  //bg.style.backgroundColor = color;
  console.log('Confidence: ' + finalStr);
  if (finalStr.indexOf('suivant') != -1){
  	socket.sendMessage({type: 'voice', value : 'next'});
  }else if (finalStr.indexOf('précédent') != -1){
  	socket.sendMessage({type: 'voice', value : 'prev'});
  }
}

// We detect the end of speechRecognition process
      recognition.onend = function(){
        console.log('End of recognition')
        recognition.stop();
      };

      // We detect errors
      recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          console.log('No Speech');
        }
        if (event.error == 'audio-capture') {
          console.log('No microphone')
        }
        if (event.error == 'not-allowed') {
          console.log('Not Allowed');
        }
      };     



function register(){

}

function unregister(){
	recognition.stop();
}


function VoiceControler($mdDialog, SocketService){

	socket = SocketService;

	recognition.start();
	
	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}


VoiceControler.$inject = ['$mdDialog', 'SocketService']

module.exports = VoiceControler;
},{}],9:[function(require,module,exports){
'use strict'

var socket = null;

function SocketService(){

	this.connect = function(model){

		model.checkAddress()
		.then(function(){
			let address = model.getIoAddress();
			let protocol = model.isSSL() ? 'https' : 'http';
			socket = io(`${protocol}://${address}`);
		});
	}
	this.sendMessage = function(msg){
		socket.emit('sensor', msg);
	}

	this.getSocket = function(){
		return socket;
	}

}

module.exports = SocketService;
},{}],10:[function(require,module,exports){
'use strict'

var address = null,
	ioAddress = null,
	ssl = false;

function calculateAddress(){
	return new Promise(function(resolve, reject){
		if (address){
			resolve();
			return;
		}
		let myHeaders = new Headers();
		let myInit = { method: 'GET',
	           headers: myHeaders,
	           mode: 'cors',
	           cache: 'default' };
	    let protocol = '';
	    let scheme = ''
	    let basicHost = ''
	    if (location.host && location.host.indexOf('localhost') === -1){
	    	protocol = 'https';
	    	scheme = '://';
	    	basicHost = 'binomed.fr:8000';
	    }

		let myRequest = new Request(`${protocol}${scheme}${basicHost}/ip`,myInit);
		fetch(myRequest)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			let network = json;

			if (location.port && (location.port === "3000")){
				let wlan0 = network.find(function(element){
					return element.name === 'wlan0';
				});
				if (wlan0){
					address = `${wlan0.ip}:3000`;
					ioAddress = `${wlan0.ip}:8000`;
				}else{
					address = "localhost:3000";
					ioAddress = "localhost:8000";
				}
			}else if (location.port && location.port === "8000"){
				address = "binomed.fr:8000";
				ioAddress = "binomed.fr:8000";
				ssl = true;
			}else{
				address = null;
			} 
			resolve();
		});
	});
}

calculateAddress();


function ModelService(){

	this.isSSL = function(){
		return ssl;
	}

	this.getAddress = function(){
		return address;
	}	

	this.getIoAddress = function(){
		return ioAddress;
	}

	this.checkAddress = calculateAddress;

}

module.exports = ModelService;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZWN1cmUvc2VjdXJlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9ibHVldG9vdGguanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlbnNvcnMvcHJveGltaXR5LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL3ZvaWNlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc29ja2V0L3NvY2tldHMuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC91dGlsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuYW5ndWxhci5tb2R1bGUoXCJTdXBlclBvd2VyQXBwXCIsIFsnbmdNYXRlcmlhbCddKVxuLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAucHJpbWFyeVBhbGV0dGUoJ3JlZCcpXG4gICAgLmFjY2VudFBhbGV0dGUoJ29yYW5nZScpO1xufSlcbi5zZXJ2aWNlKCdTb2NrZXRTZXJ2aWNlJywgcmVxdWlyZSgnLi9zb2NrZXQvc29ja2V0cycpKVxuLnNlcnZpY2UoJ01vZGVsU2VydmljZScsIHJlcXVpcmUoJy4vdXRpbC9tb2RlbCcpKVxuLmRpcmVjdGl2ZSgnYXBwJywgWyckbWREaWFsb2cnLCAnJHRpbWVvdXQnLCAnU29ja2V0U2VydmljZScsICdNb2RlbFNlcnZpY2UnLFxuXHRmdW5jdGlvbigkbWREaWFsb2csICR0aW1lb3V0LCBTb2NrZXRTZXJ2aWNlLCBNb2RlbFNlcnZpY2Upe1xuXG5cdFx0U29ja2V0U2VydmljZS5jb25uZWN0KE1vZGVsU2VydmljZSk7XG5cblx0cmV0dXJuIHtcblx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9hcHAuaHRtbCcsXG5cdFx0Y29udHJvbGxlckFzIDogJ2FwcCcsXG5cdFx0YmluZFRvQ29udHJvbGxlciA6IHRydWUsXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuYWN0aW9ucyA9IFtcblx0XHRcdFx0e2xhYmVsIDogXCJCbHVldG9vdGhcIiwgaWNvbiA6ICdmYS1ibHVldG9vdGgnLCBpZEFjdGlvbjogJ2JsZSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIkxpZ2h0XCIsIGljb24gOiAnZmEtbGlnaHRidWxiLW8nLCBpZEFjdGlvbjogJ2xpZ2h0J30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiT3JpZW50YXRpb25cIiwgaWNvbiA6ICdmYS1jb21wYXNzJywgaWRBY3Rpb246ICdvcmllbnRhdGlvbid9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlVzZXJNZWRpYVwiLCBpY29uIDogJ2ZhLWNhbWVyYScsIGlkQWN0aW9uOiAnY2FtZXJhJ30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiUHJveGltaXR5XCIsIGljb24gOiAnZmEtcnNzJywgaWRBY3Rpb246ICdwcm94aW1pdHknfSxcblx0XHRcdFx0e2xhYmVsIDogXCJWb2ljZVwiLCBpY29uIDogJ2ZhLW1pY3JvcGhvbmUnLCBpZEFjdGlvbjogJ21pYyd9XG5cdFx0XHRdO1xuXG5cdFx0XHRcblx0XHRcdFxuXG5cdFx0XHRpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gJz9wcm94aW1pdHknKXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdwcm94aW1pdHlDdHJsJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9wcm94aW1pdHkuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3Byb3hpbWl0eScpLFxuXHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNlIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoID09PSAnP3NwZWVjaCcpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3ZvaWNlQ3RybCcsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvdm9pY2UuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3ZvaWNlJyksXG5cdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnc2VjdXJlQ3RybCcsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvc2VjdXJlLmh0bWwnLFxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoXCIuL3NlY3VyZS9zZWN1cmVcIiksXG5cdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdC8vdGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vcGVuRGlhbG9nID0gZnVuY3Rpb24oZXZlbnQsIHR5cGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnT3BlbiBEaWFsb2cnKTtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdibGUnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnYmxlQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9ibHVldG9vdGguaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvYmx1ZXRvb3RoJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdsaWdodCcpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdsaWdodEN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvbGlnaHQuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ29yaWVudGF0aW9uJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ29yaWVudGF0aW9uQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9vcmllbnRhdGlvbi5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9vcmllbnRhdGlvbicpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnbWljJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3ZvaWNlQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy92b2ljZS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAncHJveGltaXR5Jyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3Byb3hpbWl0eUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvcHJveGltaXR5Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3Byb3hpbWl0eScpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnY2FtZXJhJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2NhbWVyYUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvdXNlcm1lZGlhLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3VzZXJtZWRpYScpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1dKTtcblxuXG5mdW5jdGlvbiBwYWdlTG9hZCgpe1x0XG5cdC8vcmVxdWlyZSgnLi9zb2NrZXQvc29ja2V0cycpO1xufVxuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBtb2RlbCA9IG51bGwsXG5cdHNvY2tldCA9IG51bGw7XG5cblxuXG5mdW5jdGlvbiBkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBwd2Qpe1xuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcbiAgICBsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcbiAgICBsZXQgcHJvdG9jb2wgPSBtb2RlbC5pc1NTTCgpID8gJ2h0dHBzJyA6ICdodHRwJztcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7cHJvdG9jb2x9Oi8vJHthZGRyZXNzfS9wYXNzd29yZC8ke3B3ZH1gLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKGpzb24uYXV0aCl7XG5cdFx0XHRsb2NhbFN0b3JhZ2VbJ3B3ZCddID0gcHdkO1xuXHRcdFx0c29ja2V0LnNlbmRNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogJ2JsZScsXG5cdFx0XHRcdGFjdGlvbjogJ3N0b3BQaHlzaWNhbFdlYidcblx0XHRcdH0pXG5cdFx0XHRpZiAobG9jYXRpb24uc2VhcmNoID09PSBcIlwiKXtcblx0XHRcdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdGNvbnRleHQubm90dmFsaWQgPSB0cnVlO1xuXHRcdH1cblxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBTZWN1cmVDdHJsKCRtZERpYWxvZywgTW9kZWxTZXJ2aWNlLCBTb2NrZXRTZXJ2aWNlKXtcblx0XG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cdG1vZGVsID0gTW9kZWxTZXJ2aWNlO1xuXHR0aGlzLm5vdHZhbGlkID0gZmFsc2U7XG5cdGxldCBjb250ZXh0ID0gdGhpcztcblxuXHRtb2RlbC5jaGVja0FkZHJlc3MoKVxuXHQudGhlbihmdW5jdGlvbigpe1x0XHRcblx0XHRpZiAobG9jYWxTdG9yYWdlWydwd2QnXSl7XG5cdFx0XHRkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBsb2NhbFN0b3JhZ2VbJ3B3ZCddKTtcblx0XHR9XG5cdH0pXG5cblx0dGhpcy50cnkgPSBmdW5jdGlvbigpe1xuXHRcdGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIGNvbnRleHQucHdkKTtcblx0fVxuXG5cbn1cblxuU2VjdXJlQ3RybC4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnTW9kZWxTZXJ2aWNlJywgJ1NvY2tldFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWN1cmVDdHJsOyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBzZXJ2aWNlVVVJRCA9ICcxMTExMTExMS0yMjIyLTMzMzMtNDQ0NC0wMDAwMDAwMDAwMDAnLFxuXHRjaGFyYWN0ZXJpc3RpY1dyaXRlVVVJRCA9ICcxMTExMTExMS0yMjIyLTMzMzMtNDQ0NC0wMDAwMDAwMDAwMTAnO1xuXG5mdW5jdGlvbiBhYjJzdHIoYnVmKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50MTZBcnJheShidWYpKTtcbn1cblxuZnVuY3Rpb24gc3RyMmFiKHN0cikge1xuICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgZm9yIGVhY2ggY2hhclxuICB2YXIgYnVmVmlldyA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuICBmb3IgKHZhciBpPTAsIHN0ckxlbj1zdHIubGVuZ3RoOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICBidWZWaWV3W2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxudmFyIHNlcnZlckdBVFQgPSBudWxsLFxuXHRzZXJ2aWNlR0FUVCA9IG51bGwsXG5cdGNoYXJhY3RlcmlzdGljR0FUVCA9IG51bGwsXG5cdGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcblxuZnVuY3Rpb24gaW5pdEJsZSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2UoeyBcblx0XHRcdGZpbHRlcnM6IFt7IG5hbWU6ICdScGlKZWZMZWREZXZpY2UnIH0sIHsgbmFtZTogJ0plZkxlZERldmljZScgfV1cblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGRldmljZSkge1xuXHRcdCAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGluZy4uLlwiKTtcblx0XHQgICByZXR1cm4gZGV2aWNlLmNvbm5lY3RHQVRUKCk7XG5cdFx0IH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cdFx0XHRzZXJ2ZXJHQVRUID0gc2VydmVyO1xuXHRcdFx0Ly9yZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHNlcnZpY2VVVUlEKTtcblx0XHQgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgdGltZW91dCB3aGVuIEdhdHRTZXJ2aWNlcyBwcm9wZXJ0eSB3b3JrcyBhcyBpbnRlbmRlZC5cblx0XHQgICAvLyBjcmJ1Zy5jb20vNTYwMjc3XG5cdFx0ICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmVTZXJ2aWNlLCByZWplY3RTZXJ2aWNlKSB7XG5cdFx0ICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgXHR0cnl7XG5cdFx0ICAgICBcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IFNlcnZpY2VcIik7XG5cdFx0ICAgICAgIFx0XHRyZXNvbHZlU2VydmljZShzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2Uoc2VydmljZVVVSUQpKTtcblx0XHQgICAgIFx0fWNhdGNoKGVycil7XG5cdFx0ICAgICBcdFx0cmVqZWN0U2VydmljZShlcnIpO1xuXHRcdCAgICAgXHR9XG5cdFx0ICAgICB9LCAyZTMpO1xuXHRcdCAgIH0pXG5cdFx0fSkudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdHNlcnZpY2VHQVRUID0gc2VydmljZTtcblx0XHRcdHJlc29sdmUoc2VydmljZSk7XHRcdFx0XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHR9KVxufVxuXG5cbmZ1bmN0aW9uIGdldFNlcnZpY2UoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKHNlcnZlckdBVFQgJiYgc2VydmVyR0FUVC5jb25uZWN0ZWQgJiYgc2VydmljZUdBVFQpe1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpbml0QmxlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDaGFyYWN0ZXJpc3RpYygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoY2hhcmFjdGVyaXN0aWNHQVRUKXtcblx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXN0aWNHQVRUKTtcblx0XHR9ZWxzZXtcblx0XHRcdGdldFNlcnZpY2UoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBDaGFyYWN0ZXJpdGljIDogJU9cIixzZXJ2aWNlKTtcblx0XHRcdFx0cmV0dXJuIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNXcml0ZVVVSUQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3Rlcml0aWMpe1xuXHRcdFx0XHRjaGFyYWN0ZXJpc3RpY0dBVFQgPSBjaGFyYWN0ZXJpdGljO1xuXHRcdFx0XHRyZXNvbHZlKGNoYXJhY3Rlcml0aWMpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0NoYXJhY3RlcmlzdGljKHR5cGUsIGRhdGEsIGNhbGxiYWNrKXtcblx0Z2V0Q2hhcmFjdGVyaXN0aWMoKVxuXHQudGhlbihmdW5jdGlvbihjaGFyYWN0ZXJpc3RpYyl7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1x0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gd3JpdGUgdmFsdWUgOiAlT1wiLGNoYXJhY3RlcmlzdGljKTtcblx0XHRcdHJldHVybiBjaGFyYWN0ZXJpc3RpYy53cml0ZVZhbHVlKGVuY29kZXIuZW5jb2RlKGRhdGEpKTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHJlYWQgdmFsdWUgOiAlT1wiLGNoYXJhY3RlcmlzdGljKTtcblx0XHRcdHJldHVybiBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24oYnVmZmVyKXtcblx0XHRpZiAodHlwZSA9PT0gJ3dyaXRlJyl7XG5cdFx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRcdGNhbGxiYWNrKHt0eXBlOiAnd3JpdGUnLCB2YWx1ZSA6IHRydWV9KTtcdFx0XHRcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUuaW5mbyhcIldyaXRlIGRhdGFzICEgXCIpO1xuXHRcdH1lbHNle1xuXHRcdFx0bGV0IGRhdGEgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcblx0XHQgICAgbGV0IGRhdGFEZWNyeXB0ID0gZGF0YS5nZXRVaW50OCgwKTtcblx0XHQgICAgY2FsbGJhY2soe3R5cGU6ICdyZWFkJyAsIHZhbHVlIDogZGF0YURlY3J5cHR9KTtcblx0XHQgICAgY29uc29sZS5sb2coJ1JlY2VpdmVEYXRhcyAlcycsIGRhdGFEZWNyeXB0KTtcblx0XHR9XG5cdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRpZiAoY2FsbGJhY2spIHtcblxuXHRcdFx0Y2FsbGJhY2soe3R5cGUgOiAnZXJyb3InLCB2YWx1ZSA6IGVycm9yfSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuXG5cbmZ1bmN0aW9uIEJsZUNvbnRyb2xsZXIoJG1kRGlhbG9nLCAkdGltZW91dCl7XG5cblx0dGhpcy5zbGlkZXJBY3RpdiA9IGZhbHNlO1xuXHR0aGlzLmN1cnJlbnRUaW1lciA9IG51bGw7XG5cdHRoaXMucG93ZXIgPSAxMjU7XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fSBcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwib25cIik7XG5cdH1cblxuXHR0aGlzLmJsaW5rID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJibGlua1wiKTtcblx0fVxuXG5cdHRoaXMudHVybk9mZiA9IGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwib2ZmXCIpO1xuXHR9XG5cdFxuXHR0aGlzLmNoYW5nZVBvd2VyID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJicmlnaHQ6XCIrdGhpcy5wb3dlcik7XG5cdH07XG5cblx0dGhpcy5hY3RpdlNsaWRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuY3VycmVudFRpbWVyKXtcblx0XHRcdCR0aW1lb3V0LmNhbmNlbCh0aGlzLmN1cnJlbnRUaW1lcik7XG5cdFx0fVxuXHRcdHRoaXMuc2xpZGVyQWN0aXYgPSB0cnVlO1xuXHRcdHRoaXMuY3VycmVudFRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24oY29udGV4dCl7XG5cdFx0XHRjb250ZXh0LnNsaWRlckFjdGl2ID0gZmFsc2U7XG5cdFx0fSw1MDAwLHRydWUsIHRoaXMpO1xuXHR9XG59XG5cbkJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJyR0aW1lb3V0J11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZUNvbnRyb2xsZXI7Lyp7XG5cdHdyaXRlRGF0YSA6IHByb2Nlc3NDaGFyYWN0ZXJpc3RpY1xufSovXG5cbiIsIid1c2Ugc3RyaWN0JztcblxubGV0IHNvY2tldCA9IG51bGw7XG5cbi8vIFRoZSBoYW5kbGVyXG52YXIgZGV2aWNlTGlnaHRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gVGhlIHZhbHVlIHdpbGwgbGl2ZSBiZXR3ZWVuIDAgYW5kIH4xNTBcblx0Ly8gQnV0IHdoZW4gaXQgaXMgNDUgaXMgYSBoaWdoIGx1bW9uc2l0eVxuXHR2YXIgdmFsdWUgPSBNYXRoLm1pbig0NSwgZXZlbnQudmFsdWUpOyAgICAgICAgXG5cdGxldCBwZXJjZW50ID0gTWF0aC5yb3VuZCgodmFsdWUgLyA0NSkgKiAxMDApOyAgICAgICBcblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnbGlnaHQnLCB2YWx1ZSA6IHBlcmNlbnR9KTtcbn1cblxuLy8gV2UgYWRkIHRoZSBsaXN0ZW5lclxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIExpZ2h0Q29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbkxpZ2h0Q29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodENvbnRyb2xlcjsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBzb2NrZXQgPSBudWxsLCBcblx0Zmlyc3RWYWx1ZSA9IC0xO1xuXG4vLyBUaGUgaGFuZGxlciBvZiB0aGUgZXZlbnRcbnZhciBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpeyAgICAgICAgXG5cdHZhciBhbHBoYSA9IE1hdGgucm91bmQoZXZlbnQuYWxwaGEpO1xuXHR2YXIgYmV0YSA9IE1hdGgucm91bmQoZXZlbnQuYmV0YSk7XG5cdHZhciBnYW1tYSA9IE1hdGgucm91bmQoZXZlbnQuZ2FtbWEpO1xuXHRpZiAoZmlyc3RWYWx1ZSA9PT0gLTEpe1xuXHRcdGZpcnN0VmFsdWUgPSBhbHBoYTtcblx0fVxuXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICdvcmllbnRhdGlvbicsIHZhbHVlIDogYWxwaGEsICdmaXJzdFZhbHVlJyA6IGZpcnN0VmFsdWV9KTtcdFxufVxuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXHRmaXJzdFZhbHVlID0gLTE7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIE9yaWVudGF0aW9uQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbk9yaWVudGF0aW9uQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yaWVudGF0aW9uQ29udHJvbGVyOyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbW9kZWwgPSBudWxsO1xuXG4vLyBUaGUgbGlzdGVuZXJcbnZhciBkZXZpY2VQcm94aW1pdHlIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0dmFyIHZhbHVlID0gTWF0aC5yb3VuZChldmVudC52YWx1ZSk7ICAgICAgICBcblx0aWYgKHZhbHVlID09PSAwKXtcblx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcblx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbD9zcGVlY2gjSW50ZW50O3NjaGVtZT1odHRwO3BhY2thZ2U9b3JnLmNocm9taXVtLmNocm9tZTtlbmRgO1xuXHR9ICAgIFxuXHQvL3NvY2tldC5zZW5kUHJveGltaXR5KHZhbHVlKTtcblx0Ly9tYW5hZ2VQcm94aW1pdHlWYWx1ZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vwcm94aW1pdHknLCBkZXZpY2VQcm94aW1pdHlIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZXByb3hpbWl0eScsIGRldmljZVByb3hpbWl0eUhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gUHJveGltaXR5Q29udHJvbGVyKCRtZERpYWxvZywgTW9kZWxTZXJ2aWNlKXtcblxuXHRtb2RlbCA9IE1vZGVsU2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHdpbmRvdy5EZXZpY2VQcm94aW1pdHlFdmVudCl7XG5cblx0XHRcdHJlZ2lzdGVyKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcblx0XHRcdC8vd2luZG93LmxvY2F0aW9uID0gYGludGVudDovLzEwLjMzLjQ0LjE4MTozMDAwL2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9aHR0cDtwYWNrYWdlPW9yZy5tb3ppbGxhLmZpcmVmb3hfYmV0YTtlbmRgO1xuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWw/cHJveGltaXR5I0ludGVudDtzY2hlbWU9aHR0cDtwYWNrYWdlPW9yZy5tb3ppbGxhLmZpcmVmb3hfYmV0YTtlbmRgO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuZ29Ub0Nocm9tZSA9IGZ1bmN0aW9uKCl7XG5cdFx0bGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XG5cdFx0Ly93aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vMTAuMzMuNDQuMTgxOjMwMDAvYWRkb24vaW5kZXhfYXBwLmh0bWwjSW50ZW50O3NjaGVtZT1odHRwO3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0d2luZG93LmxvY2F0aW9uID0gYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWwjSW50ZW50O3NjaGVtZT1odHRwO3BhY2thZ2U9b3JnLmNocm9taXVtLmNocm9tZTthY3Rpb249YW5kcm9pZC5pbnRlbnQuYWN0aW9uLlZJRVc7bGF1bmNoRmxhZ3M9MHgxMDAwMDAwMDtlbmRgO1xuXHR9XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuUHJveGltaXR5Q29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdNb2RlbFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm94aW1pdHlDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc29ja2V0ID0gbnVsbCxcbiAgdmlkZW9FbGVtZW50ID0gbnVsbCxcbiAgY2FudmFzID0gbnVsbCwgXG4gIHZpZGVvU291cmNlID0gbnVsbCxcbiAgc2VsZWN0b3JzID0gbnVsbDtcblxuIFxuXG5mdW5jdGlvbiBnb3REZXZpY2VzKGRldmljZUluZm9zKSB7XG4gIGRldmljZUluZm9zLmZvckVhY2goZnVuY3Rpb24oZGV2aWNlKXtcbiAgICBpZiAoZGV2aWNlLmtpbmQgPT09ICd2aWRlb2lucHV0JyAmJiBkZXZpY2UubGFiZWwuaW5kZXhPZignYmFjaycpICE9IDApe1xuICAgICAgdmlkZW9Tb3VyY2UgPSBkZXZpY2UuZGV2aWNlSWQ7XG4gICAgfVxuICB9KTsgIFxufVxuXG5uYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMoKVxuICAudGhlbihnb3REZXZpY2VzKVxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyLm5hbWUgKyBcIjogXCIgKyBlcnIubWVzc2FnZSk7XG4gIH0pO1xuXG5mdW5jdGlvbiBzdGFydCgpe1xuICBpZiAod2luZG93LnN0cmVhbSkge1xuICAgIHdpbmRvdy5zdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICB9XG4gIHZhciBjb25zdHJhaW50cyA9IHtcbiAgICBhdWRpbyA6IGZhbHNlLFxuICAgIHZpZGVvOiB7ZGV2aWNlSWQ6IHZpZGVvU291cmNlID8ge2V4YWN0OiB2aWRlb1NvdXJjZX0gOiB1bmRlZmluZWR9XG4gIH07XG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKS50aGVuKHN1Y2Nlc3NDYWxsYmFjaykuY2F0Y2goZXJyb3JDYWxsYmFjayk7XG59XG5cblxuZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHN0cmVhbSkge1xuICB3aW5kb3cuc3RyZWFtID0gc3RyZWFtOyAvLyBtYWtlIHN0cmVhbSBhdmFpbGFibGUgdG8gY29uc29sZVxuICBpZiAoIXZpZGVvRWxlbWVudCl7XG4gICAgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVZpZGVvXCIpO1xuICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDYW52YXNcIik7XG4gIH1cbiAgdmlkZW9FbGVtZW50LnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XG4gIHZpZGVvRWxlbWVudC5vbmxvYWRlZG1ldGFkYXRhID0gZnVuY3Rpb24oZSkge1xuICAgIHZpZGVvRWxlbWVudC5wbGF5KCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVycm9yQ2FsbGJhY2soZXJyb3Ipe1xuICAgIGNvbnNvbGUubG9nKFwibmF2aWdhdG9yLmdldFVzZXJNZWRpYSBlcnJvcjogXCIsIGVycm9yKTtcbiAgfVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXIoKXtcbiAgICAgIHN0YXJ0KCk7XG4gICAgICBcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG4gICAgICBpZiAodmlkZW9FbGVtZW50KSB7XG4gICAgICAgIHZpZGVvRWxlbWVudC5wYXVzZSgpO1xuICAgICAgICB2aWRlb0VsZW1lbnQuc3JjID0gbnVsbDtcbiAgICAgIH1cbiAgICAgICAgIFxuICAgIH1cblxuZnVuY3Rpb24gQ2FtZXJhQ3RybCgkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xuICBzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG4gIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlWaWRlb1wiKTtcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcblxuICB0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmVnaXN0ZXIoKTtcbiAgfVxuXG4gIHRoaXMucGhvdG8gPSBmdW5jdGlvbigpe1xuICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY2FudmFzLndpZHRoID0gdmlkZW9FbGVtZW50LnZpZGVvV2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHZpZGVvRWxlbWVudC52aWRlb0hlaWdodDtcbiAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlb0VsZW1lbnQsIDAsIDAsIHZpZGVvRWxlbWVudC52aWRlb1dpZHRoLCB2aWRlb0VsZW1lbnQudmlkZW9IZWlnaHQpO1xuICBcbiAgICB2YXIgZGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ3VzZXJtZWRpYScsIHZhbHVlIDogZGF0YX0pOyAgICAgIFxuICAgIFxuICB9XG5cbiAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgdW5yZWdpc3RlcigpO1xuICAgICRtZERpYWxvZy5oaWRlKCk7XG4gIH1cbn1cblxuQ2FtZXJhQ3RybC4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhQ3RybDsiLCIndXNlIHN0cmljdCdcblxudmFyIHNvY2tldCA9IG51bGw7XG52YXIgU3BlZWNoUmVjb2duaXRpb24gPSBTcGVlY2hSZWNvZ25pdGlvbiB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvblxudmFyIFNwZWVjaEdyYW1tYXJMaXN0ID0gU3BlZWNoR3JhbW1hckxpc3QgfHwgd2Via2l0U3BlZWNoR3JhbW1hckxpc3RcbnZhciBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50ID0gU3BlZWNoUmVjb2duaXRpb25FdmVudCB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvbkV2ZW50XG5cbi8vdmFyIGdyYW1tYXIgPSAnI0pTR0YgVjEuMDsgZ3JhbW1hciBjb2xvcnM7IHB1YmxpYyA8Y29sb3I+ID0gYXF1YSB8IGF6dXJlIHwgYmVpZ2UgfCBiaXNxdWUgfCBibGFjayB8IGJsdWUgfCBicm93biB8IGNob2NvbGF0ZSB8IGNvcmFsIHwgY3JpbXNvbiB8IGN5YW4gfCBmdWNoc2lhIHwgZ2hvc3R3aGl0ZSB8IGdvbGQgfCBnb2xkZW5yb2QgfCBncmF5IHwgZ3JlZW4gfCBpbmRpZ28gfCBpdm9yeSB8IGtoYWtpIHwgbGF2ZW5kZXIgfCBsaW1lIHwgbGluZW4gfCBtYWdlbnRhIHwgbWFyb29uIHwgbW9jY2FzaW4gfCBuYXZ5IHwgb2xpdmUgfCBvcmFuZ2UgfCBvcmNoaWQgfCBwZXJ1IHwgcGluayB8IHBsdW0gfCBwdXJwbGUgfCByZWQgfCBzYWxtb24gfCBzaWVubmEgfCBzaWx2ZXIgfCBzbm93IHwgdGFuIHwgdGVhbCB8IHRoaXN0bGUgfCB0b21hdG8gfCB0dXJxdW9pc2UgfCB2aW9sZXQgfCB3aGl0ZSB8IHllbGxvdyA7J1xudmFyIHJlY29nbml0aW9uID0gbmV3IFNwZWVjaFJlY29nbml0aW9uKCk7XG4vL3ZhciBzcGVlY2hSZWNvZ25pdGlvbkxpc3QgPSBuZXcgU3BlZWNoR3JhbW1hckxpc3QoKTtcbi8vc3BlZWNoUmVjb2duaXRpb25MaXN0LmFkZEZyb21TdHJpbmcoZ3JhbW1hciwgMSk7XG4vL3JlY29nbml0aW9uLmdyYW1tYXJzID0gc3BlZWNoUmVjb2duaXRpb25MaXN0O1xucmVjb2duaXRpb24uY29udGludW91cyA9IHRydWU7XG5yZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcbnJlY29nbml0aW9uLmludGVyaW1SZXN1bHRzID0gdHJ1ZTtcbi8vcmVjb2duaXRpb24ubWF4QWx0ZXJuYXRpdmVzID0gMTtcblxuLy92YXIgZGlhZ25vc3RpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdXRwdXQnKTtcbi8vdmFyIGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG5kb2N1bWVudC5ib2R5Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgcmVjb2duaXRpb24uc3RhcnQoKTtcbiAgY29uc29sZS5sb2coJ1JlYWR5IHRvIHJlY2VpdmUgYSBjb2xvciBjb21tYW5kLicpO1xufVxuXG5yZWNvZ25pdGlvbi5vbnJlc3VsdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHJlc3VsdHMgcHJvcGVydHkgcmV0dXJucyBhIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3RcbiAgLy8gVGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0cy5cbiAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XG4gIC8vIFRoZSBmaXJzdCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgYXQgcG9zaXRpb24gMC5cbiAgLy8gRWFjaCBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3RzIHRoYXQgY29udGFpbiBpbmRpdmlkdWFsIHJlc3VsdHMuXG4gIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxuICAvLyBUaGUgc2Vjb25kIFswXSByZXR1cm5zIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIGF0IHBvc2l0aW9uIDAuXG4gIC8vIFdlIHRoZW4gcmV0dXJuIHRoZSB0cmFuc2NyaXB0IHByb3BlcnR5IG9mIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIG9iamVjdCBcbiAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xuICAvL2RpYWdub3N0aWMudGV4dENvbnRlbnQgPSAnUmVzdWx0IHJlY2VpdmVkOiAnICsgY29sb3IgKyAnLic7XG4gIC8vYmcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XG4gIGNvbnNvbGUubG9nKCdDb25maWRlbmNlOiAnICsgZmluYWxTdHIpO1xuICBpZiAoZmluYWxTdHIuaW5kZXhPZignc3VpdmFudCcpICE9IC0xKXtcbiAgXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ25leHQnfSk7XG4gIH1lbHNlIGlmIChmaW5hbFN0ci5pbmRleE9mKCdwcsOpY8OpZGVudCcpICE9IC0xKXtcbiAgXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ3ByZXYnfSk7XG4gIH1cbn1cblxuLy8gV2UgZGV0ZWN0IHRoZSBlbmQgb2Ygc3BlZWNoUmVjb2duaXRpb24gcHJvY2Vzc1xuICAgICAgcmVjb2duaXRpb24ub25lbmQgPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygnRW5kIG9mIHJlY29nbml0aW9uJylcbiAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgICAgfTtcblxuICAgICAgLy8gV2UgZGV0ZWN0IGVycm9yc1xuICAgICAgcmVjb2duaXRpb24ub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5lcnJvciA9PSAnbm8tc3BlZWNoJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBTcGVlY2gnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ2F1ZGlvLWNhcHR1cmUnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vIG1pY3JvcGhvbmUnKVxuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5lcnJvciA9PSAnbm90LWFsbG93ZWQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdCBBbGxvd2VkJyk7XG4gICAgICAgIH1cbiAgICAgIH07ICAgICBcblxuXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHRyZWNvZ25pdGlvbi5zdG9wKCk7XG59XG5cblxuZnVuY3Rpb24gVm9pY2VDb250cm9sZXIoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcblxuXHRzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG5cdHJlY29nbml0aW9uLnN0YXJ0KCk7XG5cdFxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5cblZvaWNlQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxubW9kdWxlLmV4cG9ydHMgPSBWb2ljZUNvbnRyb2xlcjsiLCIndXNlIHN0cmljdCdcblxudmFyIHNvY2tldCA9IG51bGw7XG5cbmZ1bmN0aW9uIFNvY2tldFNlcnZpY2UoKXtcblxuXHR0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbihtb2RlbCl7XG5cblx0XHRtb2RlbC5jaGVja0FkZHJlc3MoKVxuXHRcdC50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldElvQWRkcmVzcygpO1xuXHRcdFx0bGV0IHByb3RvY29sID0gbW9kZWwuaXNTU0woKSA/ICdodHRwcycgOiAnaHR0cCc7XG5cdFx0XHRzb2NrZXQgPSBpbyhgJHtwcm90b2NvbH06Ly8ke2FkZHJlc3N9YCk7XG5cdFx0fSk7XG5cdH1cblx0dGhpcy5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZyl7XG5cdFx0c29ja2V0LmVtaXQoJ3NlbnNvcicsIG1zZyk7XG5cdH1cblxuXHR0aGlzLmdldFNvY2tldCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHNvY2tldDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ja2V0U2VydmljZTsiLCIndXNlIHN0cmljdCdcblxudmFyIGFkZHJlc3MgPSBudWxsLFxuXHRpb0FkZHJlc3MgPSBudWxsLFxuXHRzc2wgPSBmYWxzZTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoYWRkcmVzcyl7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRcdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG5cdCAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuXHQgICAgICAgICAgIG1vZGU6ICdjb3JzJyxcblx0ICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG5cdCAgICBsZXQgcHJvdG9jb2wgPSAnJztcblx0ICAgIGxldCBzY2hlbWUgPSAnJ1xuXHQgICAgbGV0IGJhc2ljSG9zdCA9ICcnXG5cdCAgICBpZiAobG9jYXRpb24uaG9zdCAmJiBsb2NhdGlvbi5ob3N0LmluZGV4T2YoJ2xvY2FsaG9zdCcpID09PSAtMSl7XG5cdCAgICBcdHByb3RvY29sID0gJ2h0dHBzJztcblx0ICAgIFx0c2NoZW1lID0gJzovLyc7XG5cdCAgICBcdGJhc2ljSG9zdCA9ICdiaW5vbWVkLmZyOjgwMDAnO1xuXHQgICAgfVxuXG5cdFx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke3Byb3RvY29sfSR7c2NoZW1lfSR7YmFzaWNIb3N0fS9pcGAsbXlJbml0KTtcblx0XHRmZXRjaChteVJlcXVlc3QpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdFx0bGV0IG5ldHdvcmsgPSBqc29uO1xuXG5cdFx0XHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRcdFx0bGV0IHdsYW4wID0gbmV0d29yay5maW5kKGZ1bmN0aW9uKGVsZW1lbnQpe1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50Lm5hbWUgPT09ICd3bGFuMCc7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAod2xhbjApe1xuXHRcdFx0XHRcdGFkZHJlc3MgPSBgJHt3bGFuMC5pcH06MzAwMGA7XG5cdFx0XHRcdFx0aW9BZGRyZXNzID0gYCR7d2xhbjAuaXB9OjgwMDBgO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRhZGRyZXNzID0gXCJsb2NhbGhvc3Q6MzAwMFwiO1xuXHRcdFx0XHRcdGlvQWRkcmVzcyA9IFwibG9jYWxob3N0OjgwMDBcIjtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCI4MDAwXCIpe1xuXHRcdFx0XHRhZGRyZXNzID0gXCJiaW5vbWVkLmZyOjgwMDBcIjtcblx0XHRcdFx0aW9BZGRyZXNzID0gXCJiaW5vbWVkLmZyOjgwMDBcIjtcblx0XHRcdFx0c3NsID0gdHJ1ZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRhZGRyZXNzID0gbnVsbDtcblx0XHRcdH0gXG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5jYWxjdWxhdGVBZGRyZXNzKCk7XG5cblxuZnVuY3Rpb24gTW9kZWxTZXJ2aWNlKCl7XG5cblx0dGhpcy5pc1NTTCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHNzbDtcblx0fVxuXG5cdHRoaXMuZ2V0QWRkcmVzcyA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGFkZHJlc3M7XG5cdH1cdFxuXG5cdHRoaXMuZ2V0SW9BZGRyZXNzID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gaW9BZGRyZXNzO1xuXHR9XG5cblx0dGhpcy5jaGVja0FkZHJlc3MgPSBjYWxjdWxhdGVBZGRyZXNzO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxTZXJ2aWNlOyJdfQ==
