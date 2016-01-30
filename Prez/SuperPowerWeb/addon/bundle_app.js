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
.directive('app', ['$mdDialog', '$timeout', 'SocketService',
	function($mdDialog, $timeout, SocketService){
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

var model = null;



function doRequest($mdDialog, context, pwd){
	let myHeaders = new Headers();
	let myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'cors',
           cache: 'default' };
    let address = model.getAddress();

	let myRequest = new Request(`http://${address}/password/${pwd}`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		// On ne retraire pas une question déjà traitée
		if (json.auth){
			localStorage['pwd'] = pwd;
			if (location.search === ""){
				$mdDialog.hide();
			}
		}else{
			context.notvalid = true;
		}


	});
}

function SecureCtrl($mdDialog, ModelService){
	
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

SecureCtrl.$inject = ['$mdDialog', 'ModelService'];

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
    canvas.width = 112;
    canvas.height = 150;
    context.drawImage(videoElement, 0, 0, 112, 150);
  
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

var socket = io("http://localhost:8000");

function SocketService(){

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

var address = null;

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

		let myRequest = new Request(`/ip`,myInit);
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
				}else{
					address = "localhost:3000";
				}
			}else if (location.port && location.port === "8000"){
				address = "jef.binomed.fr:8000";
			}else{
				address = null;
			} 
			resolve();
		});
	});
}

calculateAddress();


function ModelService(){

	this.getAddress = function(){
		return address;
	}	

	this.checkAddress = calculateAddress;

}

module.exports = ModelService;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZWN1cmUvc2VjdXJlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9ibHVldG9vdGguanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlbnNvcnMvcHJveGltaXR5LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL3ZvaWNlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc29ja2V0L3NvY2tldHMuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC91dGlsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyLm1vZHVsZShcIlN1cGVyUG93ZXJBcHBcIiwgWyduZ01hdGVyaWFsJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xuICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuICAgIC5wcmltYXJ5UGFsZXR0ZSgncmVkJylcbiAgICAuYWNjZW50UGFsZXR0ZSgnb3JhbmdlJyk7XG59KVxuLnNlcnZpY2UoJ1NvY2tldFNlcnZpY2UnLCByZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJykpXG4uc2VydmljZSgnTW9kZWxTZXJ2aWNlJywgcmVxdWlyZSgnLi91dGlsL21vZGVsJykpXG4uZGlyZWN0aXZlKCdhcHAnLCBbJyRtZERpYWxvZycsICckdGltZW91dCcsICdTb2NrZXRTZXJ2aWNlJyxcblx0ZnVuY3Rpb24oJG1kRGlhbG9nLCAkdGltZW91dCwgU29ja2V0U2VydmljZSl7XG5cdHJldHVybiB7XG5cdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvYXBwLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXJBcyA6ICdhcHAnLFxuXHRcdGJpbmRUb0NvbnRyb2xsZXIgOiB0cnVlLFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmFjdGlvbnMgPSBbXG5cdFx0XHRcdHtsYWJlbCA6IFwiQmx1ZXRvb3RoXCIsIGljb24gOiAnZmEtYmx1ZXRvb3RoJywgaWRBY3Rpb246ICdibGUnfSxcblx0XHRcdFx0e2xhYmVsIDogXCJMaWdodFwiLCBpY29uIDogJ2ZhLWxpZ2h0YnVsYi1vJywgaWRBY3Rpb246ICdsaWdodCd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIk9yaWVudGF0aW9uXCIsIGljb24gOiAnZmEtY29tcGFzcycsIGlkQWN0aW9uOiAnb3JpZW50YXRpb24nfSxcblx0XHRcdFx0e2xhYmVsIDogXCJVc2VyTWVkaWFcIiwgaWNvbiA6ICdmYS1jYW1lcmEnLCBpZEFjdGlvbjogJ2NhbWVyYSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlByb3hpbWl0eVwiLCBpY29uIDogJ2ZhLXJzcycsIGlkQWN0aW9uOiAncHJveGltaXR5J30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiVm9pY2VcIiwgaWNvbiA6ICdmYS1taWNyb3Bob25lJywgaWRBY3Rpb246ICdtaWMnfVxuXHRcdFx0XTtcblxuXHRcdFx0XG5cdFx0XHRcblxuXHRcdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPT09ICc/cHJveGltaXR5Jyl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAncHJveGltaXR5Q3RybCcsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvcHJveGltaXR5Lmh0bWwnLFxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9wcm94aW1pdHknKSxcblx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9ZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gJz9zcGVlY2gnKXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICd2b2ljZUN0cmwnLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3ZvaWNlLmh0bWwnLFxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLFxuXHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3NlY3VyZUN0cmwnLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3NlY3VyZS5odG1sJyxcblx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKFwiLi9zZWN1cmUvc2VjdXJlXCIpLFxuXHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHQvL3RhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3BlbkRpYWxvZyA9IGZ1bmN0aW9uKGV2ZW50LCB0eXBlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ09wZW4gRGlhbG9nJyk7XG5cdFx0XHRcdGlmICh0eXBlID09PSAnYmxlJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2JsZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvYmx1ZXRvb3RoLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL2JsdWV0b290aCcpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnbGlnaHQnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnbGlnaHRDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2xpZ2h0Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL2xpZ2h0JyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdvcmllbnRhdGlvbicpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdvcmllbnRhdGlvbkN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvb3JpZW50YXRpb24uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvb3JpZW50YXRpb24nKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ21pYycpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICd2b2ljZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvdm9pY2UuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvdm9pY2UnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ3Byb3hpbWl0eScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdwcm94aW1pdHlDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3Byb3hpbWl0eS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9wcm94aW1pdHknKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ2NhbWVyYScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdjYW1lcmFDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3VzZXJtZWRpYS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy91c2VybWVkaWEnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XSk7XG5cblxuZnVuY3Rpb24gcGFnZUxvYWQoKXtcdFxuXHQvL3JlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKTtcbn1cblxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpOyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbW9kZWwgPSBudWxsO1xuXG5cblxuZnVuY3Rpb24gZG9SZXF1ZXN0KCRtZERpYWxvZywgY29udGV4dCwgcHdkKXtcblx0bGV0IG15SGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG5cdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG4gICAgbGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XG5cblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGBodHRwOi8vJHthZGRyZXNzfS9wYXNzd29yZC8ke3B3ZH1gLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKGpzb24uYXV0aCl7XG5cdFx0XHRsb2NhbFN0b3JhZ2VbJ3B3ZCddID0gcHdkO1xuXHRcdFx0aWYgKGxvY2F0aW9uLnNlYXJjaCA9PT0gXCJcIil7XG5cdFx0XHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRjb250ZXh0Lm5vdHZhbGlkID0gdHJ1ZTtcblx0XHR9XG5cblxuXHR9KTtcbn1cblxuZnVuY3Rpb24gU2VjdXJlQ3RybCgkbWREaWFsb2csIE1vZGVsU2VydmljZSl7XG5cdFxuXHRtb2RlbCA9IE1vZGVsU2VydmljZTtcblx0dGhpcy5ub3R2YWxpZCA9IGZhbHNlO1xuXHRsZXQgY29udGV4dCA9IHRoaXM7XG5cblx0bW9kZWwuY2hlY2tBZGRyZXNzKClcblx0LnRoZW4oZnVuY3Rpb24oKXtcdFx0XG5cdFx0aWYgKGxvY2FsU3RvcmFnZVsncHdkJ10pe1xuXHRcdFx0ZG9SZXF1ZXN0KCRtZERpYWxvZywgY29udGV4dCwgbG9jYWxTdG9yYWdlWydwd2QnXSk7XG5cdFx0fVxuXHR9KVxuXG5cdHRoaXMudHJ5ID0gZnVuY3Rpb24oKXtcblx0XHRkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBjb250ZXh0LnB3ZCk7XG5cdH1cblxuXG59XG5cblNlY3VyZUN0cmwuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ01vZGVsU2VydmljZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlY3VyZUN0cmw7IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHNlcnZpY2VVVUlEID0gJzExMTExMTExLTIyMjItMzMzMy00NDQ0LTAwMDAwMDAwMDAwMCcsXG5cdGNoYXJhY3RlcmlzdGljV3JpdGVVVUlEID0gJzExMTExMTExLTIyMjItMzMzMy00NDQ0LTAwMDAwMDAwMDAxMCc7XG5cbmZ1bmN0aW9uIGFiMnN0cihidWYpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQxNkFycmF5KGJ1ZikpO1xufVxuXG5mdW5jdGlvbiBzdHIyYWIoc3RyKSB7XG4gIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoc3RyLmxlbmd0aCoyKTsgLy8gMiBieXRlcyBmb3IgZWFjaCBjaGFyXG4gIHZhciBidWZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1Zik7XG4gIGZvciAodmFyIGk9MCwgc3RyTGVuPXN0ci5sZW5ndGg7IGkgPCBzdHJMZW47IGkrKykge1xuICAgIGJ1ZlZpZXdbaV0gPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgfVxuICByZXR1cm4gYnVmO1xufVxuXG52YXIgc2VydmVyR0FUVCA9IG51bGwsXG5cdHNlcnZpY2VHQVRUID0gbnVsbCxcblx0Y2hhcmFjdGVyaXN0aWNHQVRUID0gbnVsbCxcblx0ZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG5mdW5jdGlvbiBpbml0QmxlKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZSh7IFxuXHRcdFx0ZmlsdGVyczogW3sgbmFtZTogJ1JwaUplZkxlZERldmljZScgfSwgeyBuYW1lOiAnSmVmTGVkRGV2aWNlJyB9XVxuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oZGV2aWNlKSB7XG5cdFx0ICAgY29uc29sZS5sb2coXCJDb25uZWN0aW5nLi4uXCIpO1xuXHRcdCAgIHJldHVybiBkZXZpY2UuY29ubmVjdEdBVFQoKTtcblx0XHQgfSlcblx0XHQudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblx0XHRcdHNlcnZlckdBVFQgPSBzZXJ2ZXI7XG5cdFx0XHQvL3JldHVybiBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2Uoc2VydmljZVVVSUQpO1xuXHRcdCAgIC8vIEZJWE1FOiBSZW1vdmUgdGhpcyB0aW1lb3V0IHdoZW4gR2F0dFNlcnZpY2VzIHByb3BlcnR5IHdvcmtzIGFzIGludGVuZGVkLlxuXHRcdCAgIC8vIGNyYnVnLmNvbS81NjAyNzdcblx0XHQgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZVNlcnZpY2UsIHJlamVjdFNlcnZpY2UpIHtcblx0XHQgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0ICAgICBcdHRyeXtcblx0XHQgICAgIFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byBnZXQgU2VydmljZVwiKTtcblx0XHQgICAgICAgXHRcdHJlc29sdmVTZXJ2aWNlKHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShzZXJ2aWNlVVVJRCkpO1xuXHRcdCAgICAgXHR9Y2F0Y2goZXJyKXtcblx0XHQgICAgIFx0XHRyZWplY3RTZXJ2aWNlKGVycik7XG5cdFx0ICAgICBcdH1cblx0XHQgICAgIH0sIDJlMyk7XG5cdFx0ICAgfSlcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0c2VydmljZUdBVFQgPSBzZXJ2aWNlO1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlKTtcdFx0XHRcblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0fSk7XG5cdH0pXG59XG5cblxuZnVuY3Rpb24gZ2V0U2VydmljZSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoc2VydmVyR0FUVCAmJiBzZXJ2ZXJHQVRULmNvbm5lY3RlZCAmJiBzZXJ2aWNlR0FUVCl7XG5cdFx0XHRyZXNvbHZlKHNlcnZpY2VHQVRUKTtcblx0XHR9ZWxzZXtcblx0XHRcdGluaXRCbGUoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRcdHJlc29sdmUoc2VydmljZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldENoYXJhY3RlcmlzdGljKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdGlmIChjaGFyYWN0ZXJpc3RpY0dBVFQpe1xuXHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpc3RpY0dBVFQpO1xuXHRcdH1lbHNle1xuXHRcdFx0Z2V0U2VydmljZSgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IENoYXJhY3Rlcml0aWMgOiAlT1wiLHNlcnZpY2UpO1xuXHRcdFx0XHRyZXR1cm4gc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY1dyaXRlVVVJRCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXRpYyl7XG5cdFx0XHRcdGNoYXJhY3RlcmlzdGljR0FUVCA9IGNoYXJhY3Rlcml0aWM7XG5cdFx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXRpYyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWModHlwZSwgZGF0YSwgY2FsbGJhY2spe1xuXHRnZXRDaGFyYWN0ZXJpc3RpYygpXG5cdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3RlcmlzdGljKXtcblx0XHRpZiAodHlwZSA9PT0gJ3dyaXRlJyl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byB3cml0ZSB2YWx1ZSA6ICVPXCIsY2hhcmFjdGVyaXN0aWMpO1xuXHRcdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoZW5jb2Rlci5lbmNvZGUoZGF0YSkpO1xuXHRcdH1lbHNle1xuXHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gcmVhZCB2YWx1ZSA6ICVPXCIsY2hhcmFjdGVyaXN0aWMpO1xuXHRcdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLnJlYWRWYWx1ZSgpO1xuXHRcdH1cblx0fSkudGhlbihmdW5jdGlvbihidWZmZXIpe1xuXHRcdGlmICh0eXBlID09PSAnd3JpdGUnKXtcblx0XHRcdGlmKGNhbGxiYWNrKXtcblx0XHRcdFx0Y2FsbGJhY2soe3R5cGU6ICd3cml0ZScsIHZhbHVlIDogdHJ1ZX0pO1x0XHRcdFxuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5pbmZvKFwiV3JpdGUgZGF0YXMgISBcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgZGF0YSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXHRcdCAgICBsZXQgZGF0YURlY3J5cHQgPSBkYXRhLmdldFVpbnQ4KDApO1xuXHRcdCAgICBjYWxsYmFjayh7dHlwZTogJ3JlYWQnICwgdmFsdWUgOiBkYXRhRGVjcnlwdH0pO1xuXHRcdCAgICBjb25zb2xlLmxvZygnUmVjZWl2ZURhdGFzICVzJywgZGF0YURlY3J5cHQpO1xuXHRcdH1cblx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdGlmIChjYWxsYmFjaykge1xuXG5cdFx0XHRjYWxsYmFjayh7dHlwZSA6ICdlcnJvcicsIHZhbHVlIDogZXJyb3J9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5cblxuZnVuY3Rpb24gQmxlQ29udHJvbGxlcigkbWREaWFsb2csICR0aW1lb3V0KXtcblxuXHR0aGlzLnNsaWRlckFjdGl2ID0gZmFsc2U7XG5cdHRoaXMuY3VycmVudFRpbWVyID0gbnVsbDtcblx0dGhpcy5wb3dlciA9IDEyNTtcblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9IFxuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJvblwiKTtcblx0fVxuXG5cdHRoaXMuYmxpbmsgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcImJsaW5rXCIpO1xuXHR9XG5cblx0dGhpcy50dXJuT2ZmID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJvZmZcIik7XG5cdH1cblx0XG5cdHRoaXMuY2hhbmdlUG93ZXIgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcImJyaWdodDpcIit0aGlzLnBvd2VyKTtcblx0fTtcblxuXHR0aGlzLmFjdGl2U2xpZGVyID0gZnVuY3Rpb24oKXtcblx0XHRpZiAodGhpcy5jdXJyZW50VGltZXIpe1xuXHRcdFx0JHRpbWVvdXQuY2FuY2VsKHRoaXMuY3VycmVudFRpbWVyKTtcblx0XHR9XG5cdFx0dGhpcy5zbGlkZXJBY3RpdiA9IHRydWU7XG5cdFx0dGhpcy5jdXJyZW50VGltZXIgPSAkdGltZW91dChmdW5jdGlvbihjb250ZXh0KXtcblx0XHRcdGNvbnRleHQuc2xpZGVyQWN0aXYgPSBmYWxzZTtcblx0XHR9LDUwMDAsdHJ1ZSwgdGhpcyk7XG5cdH1cbn1cblxuQmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnJHRpbWVvdXQnXVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQmxlQ29udHJvbGxlcjsvKntcblx0d3JpdGVEYXRhIDogcHJvY2Vzc0NoYXJhY3RlcmlzdGljXG59Ki9cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgc29ja2V0ID0gbnVsbDtcblxuLy8gVGhlIGhhbmRsZXJcbnZhciBkZXZpY2VMaWdodEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHQvLyBUaGUgdmFsdWUgd2lsbCBsaXZlIGJldHdlZW4gMCBhbmQgfjE1MFxuXHQvLyBCdXQgd2hlbiBpdCBpcyA0NSBpcyBhIGhpZ2ggbHVtb25zaXR5XG5cdHZhciB2YWx1ZSA9IE1hdGgubWluKDQ1LCBldmVudC52YWx1ZSk7ICAgICAgICBcblx0bGV0IHBlcmNlbnQgPSBNYXRoLnJvdW5kKCh2YWx1ZSAvIDQ1KSAqIDEwMCk7ICAgICAgIFxuXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICdsaWdodCcsIHZhbHVlIDogcGVyY2VudH0pO1xufVxuXG4vLyBXZSBhZGQgdGhlIGxpc3RlbmVyXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbGlnaHQnLCBkZXZpY2VMaWdodEhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlbGlnaHQnLCBkZXZpY2VMaWdodEhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gTGlnaHRDb250cm9sZXIoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcblxuXHRzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRyZWdpc3RlcigpO1xuXHR9XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuTGlnaHRDb250cm9sZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ1NvY2tldFNlcnZpY2UnXVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpZ2h0Q29udHJvbGVyOyIsIid1c2Ugc3RyaWN0JztcblxubGV0IHNvY2tldCA9IG51bGwsIFxuXHRmaXJzdFZhbHVlID0gLTE7XG5cbi8vIFRoZSBoYW5kbGVyIG9mIHRoZSBldmVudFxudmFyIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7ICAgICAgICBcblx0dmFyIGFscGhhID0gTWF0aC5yb3VuZChldmVudC5hbHBoYSk7XG5cdHZhciBiZXRhID0gTWF0aC5yb3VuZChldmVudC5iZXRhKTtcblx0dmFyIGdhbW1hID0gTWF0aC5yb3VuZChldmVudC5nYW1tYSk7XG5cdGlmIChmaXJzdFZhbHVlID09PSAtMSl7XG5cdFx0Zmlyc3RWYWx1ZSA9IGFscGhhO1xuXHR9XG5cdHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ29yaWVudGF0aW9uJywgdmFsdWUgOiBhbHBoYSwgJ2ZpcnN0VmFsdWUnIDogZmlyc3RWYWx1ZX0pO1x0XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cdGZpcnN0VmFsdWUgPSAtMTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gT3JpZW50YXRpb25Db250cm9sZXIoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcblxuXHRzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRyZWdpc3RlcigpO1xuXHR9XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuT3JpZW50YXRpb25Db250cm9sZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ1NvY2tldFNlcnZpY2UnXVxuXG5cbm1vZHVsZS5leHBvcnRzID0gT3JpZW50YXRpb25Db250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBtb2RlbCA9IG51bGw7XG5cbi8vIFRoZSBsaXN0ZW5lclxudmFyIGRldmljZVByb3hpbWl0eUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHR2YXIgdmFsdWUgPSBNYXRoLnJvdW5kKGV2ZW50LnZhbHVlKTsgICAgICAgIFxuXHRpZiAodmFsdWUgPT09IDApe1xuXHRcdGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuXHRcdHdpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8ke2FkZHJlc3N9L2FkZG9uL2luZGV4X2FwcC5odG1sP3NwZWVjaCNJbnRlbnQ7c2NoZW1lPWh0dHA7cGFja2FnZT1vcmcuY2hyb21pdW0uY2hyb21lO2VuZGA7XG5cdH0gICAgXG5cdC8vc29ja2V0LnNlbmRQcm94aW1pdHkodmFsdWUpO1xuXHQvL21hbmFnZVByb3hpbWl0eVZhbHVlKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXByb3hpbWl0eScsIGRldmljZVByb3hpbWl0eUhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlcHJveGltaXR5JywgZGV2aWNlUHJveGltaXR5SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBQcm94aW1pdHlDb250cm9sZXIoJG1kRGlhbG9nLCBNb2RlbFNlcnZpY2Upe1xuXG5cdG1vZGVsID0gTW9kZWxTZXJ2aWNlO1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRpZiAod2luZG93LkRldmljZVByb3hpbWl0eUV2ZW50KXtcblxuXHRcdFx0cmVnaXN0ZXIoKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuXHRcdFx0Ly93aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vMTAuMzMuNDQuMTgxOjMwMDAvYWRkb24vaW5kZXhfYXBwLmh0bWwjSW50ZW50O3NjaGVtZT1odHRwO3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbD9wcm94aW1pdHkjSW50ZW50O3NjaGVtZT1odHRwO3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5nb1RvQ2hyb21lID0gZnVuY3Rpb24oKXtcblx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcblx0XHQvL3dpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8xMC4zMy40NC4xODE6MzAwMC9hZGRvbi9pbmRleF9hcHAuaHRtbCNJbnRlbnQ7c2NoZW1lPWh0dHA7cGFja2FnZT1vcmcubW96aWxsYS5maXJlZm94X2JldGE7ZW5kYDtcblx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbCNJbnRlbnQ7c2NoZW1lPWh0dHA7cGFja2FnZT1vcmcuY2hyb21pdW0uY2hyb21lO2FjdGlvbj1hbmRyb2lkLmludGVudC5hY3Rpb24uVklFVztsYXVuY2hGbGFncz0weDEwMDAwMDAwO2VuZGA7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5Qcm94aW1pdHlDb250cm9sZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ01vZGVsU2VydmljZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3hpbWl0eUNvbnRyb2xlcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzb2NrZXQgPSBudWxsLFxuICB2aWRlb0VsZW1lbnQgPSBudWxsLFxuICBjYW52YXMgPSBudWxsLCBcbiAgdmlkZW9Tb3VyY2UgPSBudWxsLFxuICBzZWxlY3RvcnMgPSBudWxsO1xuXG4gXG5cbmZ1bmN0aW9uIGdvdERldmljZXMoZGV2aWNlSW5mb3MpIHtcbiAgZGV2aWNlSW5mb3MuZm9yRWFjaChmdW5jdGlvbihkZXZpY2Upe1xuICAgIGlmIChkZXZpY2Uua2luZCA9PT0gJ3ZpZGVvaW5wdXQnICYmIGRldmljZS5sYWJlbC5pbmRleE9mKCdiYWNrJykgIT0gMCl7XG4gICAgICB2aWRlb1NvdXJjZSA9IGRldmljZS5kZXZpY2VJZDtcbiAgICB9XG4gIH0pOyAgXG59XG5cbm5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpXG4gIC50aGVuKGdvdERldmljZXMpXG4gIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhlcnIubmFtZSArIFwiOiBcIiArIGVyci5tZXNzYWdlKTtcbiAgfSk7XG5cbmZ1bmN0aW9uIHN0YXJ0KCl7XG4gIGlmICh3aW5kb3cuc3RyZWFtKSB7XG4gICAgd2luZG93LnN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICB0cmFjay5zdG9wKCk7XG4gICAgfSk7XG4gIH1cbiAgdmFyIGNvbnN0cmFpbnRzID0ge1xuICAgIGF1ZGlvIDogZmFsc2UsXG4gICAgdmlkZW86IHtkZXZpY2VJZDogdmlkZW9Tb3VyY2UgPyB7ZXhhY3Q6IHZpZGVvU291cmNlfSA6IHVuZGVmaW5lZH1cbiAgfTtcbiAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4oc3VjY2Vzc0NhbGxiYWNrKS5jYXRjaChlcnJvckNhbGxiYWNrKTtcbn1cblxuXG5mdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2soc3RyZWFtKSB7XG4gIHdpbmRvdy5zdHJlYW0gPSBzdHJlYW07IC8vIG1ha2Ugc3RyZWFtIGF2YWlsYWJsZSB0byBjb25zb2xlXG4gIGlmICghdmlkZW9FbGVtZW50KXtcbiAgICB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VmlkZW9cIik7XG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcbiAgfVxuICB2aWRlb0VsZW1lbnQuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoc3RyZWFtKTtcbiAgdmlkZW9FbGVtZW50Lm9ubG9hZGVkbWV0YWRhdGEgPSBmdW5jdGlvbihlKSB7XG4gICAgdmlkZW9FbGVtZW50LnBsYXkoKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhlcnJvcil7XG4gICAgY29uc29sZS5sb2coXCJuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIGVycm9yOiBcIiwgZXJyb3IpO1xuICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3Rlcigpe1xuICAgICAgc3RhcnQoKTtcbiAgICAgIFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcbiAgICAgIGlmICh2aWRlb0VsZW1lbnQpIHtcbiAgICAgICAgdmlkZW9FbGVtZW50LnBhdXNlKCk7XG4gICAgICAgIHZpZGVvRWxlbWVudC5zcmMgPSBudWxsO1xuICAgICAgfVxuICAgICAgICAgXG4gICAgfVxuXG5mdW5jdGlvbiBDYW1lcmFDdHJsKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG4gIHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cbiAgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVZpZGVvXCIpO1xuICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Q2FudmFzXCIpO1xuXG4gIHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcbiAgICByZWdpc3RlcigpO1xuICB9XG5cbiAgdGhpcy5waG90byA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjYW52YXMud2lkdGggPSAxMTI7XG4gICAgY2FudmFzLmhlaWdodCA9IDE1MDtcbiAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlb0VsZW1lbnQsIDAsIDAsIDExMiwgMTUwKTtcbiAgXG4gICAgdmFyIGRhdGEgPSBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd1c2VybWVkaWEnLCB2YWx1ZSA6IGRhdGF9KTsgICAgICBcbiAgICBcbiAgfVxuXG4gIHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgIHVucmVnaXN0ZXIoKTtcbiAgICAkbWREaWFsb2cuaGlkZSgpO1xuICB9XG59XG5cbkNhbWVyYUN0cmwuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ1NvY2tldFNlcnZpY2UnXVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYUN0cmw7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzb2NrZXQgPSBudWxsO1xudmFyIFNwZWVjaFJlY29nbml0aW9uID0gU3BlZWNoUmVjb2duaXRpb24gfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25cbnZhciBTcGVlY2hHcmFtbWFyTGlzdCA9IFNwZWVjaEdyYW1tYXJMaXN0IHx8IHdlYmtpdFNwZWVjaEdyYW1tYXJMaXN0XG52YXIgU3BlZWNoUmVjb2duaXRpb25FdmVudCA9IFNwZWVjaFJlY29nbml0aW9uRXZlbnQgfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25FdmVudFxuXG4vL3ZhciBncmFtbWFyID0gJyNKU0dGIFYxLjA7IGdyYW1tYXIgY29sb3JzOyBwdWJsaWMgPGNvbG9yPiA9IGFxdWEgfCBhenVyZSB8IGJlaWdlIHwgYmlzcXVlIHwgYmxhY2sgfCBibHVlIHwgYnJvd24gfCBjaG9jb2xhdGUgfCBjb3JhbCB8IGNyaW1zb24gfCBjeWFuIHwgZnVjaHNpYSB8IGdob3N0d2hpdGUgfCBnb2xkIHwgZ29sZGVucm9kIHwgZ3JheSB8IGdyZWVuIHwgaW5kaWdvIHwgaXZvcnkgfCBraGFraSB8IGxhdmVuZGVyIHwgbGltZSB8IGxpbmVuIHwgbWFnZW50YSB8IG1hcm9vbiB8IG1vY2Nhc2luIHwgbmF2eSB8IG9saXZlIHwgb3JhbmdlIHwgb3JjaGlkIHwgcGVydSB8IHBpbmsgfCBwbHVtIHwgcHVycGxlIHwgcmVkIHwgc2FsbW9uIHwgc2llbm5hIHwgc2lsdmVyIHwgc25vdyB8IHRhbiB8IHRlYWwgfCB0aGlzdGxlIHwgdG9tYXRvIHwgdHVycXVvaXNlIHwgdmlvbGV0IHwgd2hpdGUgfCB5ZWxsb3cgOydcbnZhciByZWNvZ25pdGlvbiA9IG5ldyBTcGVlY2hSZWNvZ25pdGlvbigpO1xuLy92YXIgc3BlZWNoUmVjb2duaXRpb25MaXN0ID0gbmV3IFNwZWVjaEdyYW1tYXJMaXN0KCk7XG4vL3NwZWVjaFJlY29nbml0aW9uTGlzdC5hZGRGcm9tU3RyaW5nKGdyYW1tYXIsIDEpO1xuLy9yZWNvZ25pdGlvbi5ncmFtbWFycyA9IHNwZWVjaFJlY29nbml0aW9uTGlzdDtcbnJlY29nbml0aW9uLmNvbnRpbnVvdXMgPSB0cnVlO1xucmVjb2duaXRpb24ubGFuZyA9ICdmci1GUic7XG5yZWNvZ25pdGlvbi5pbnRlcmltUmVzdWx0cyA9IHRydWU7XG4vL3JlY29nbml0aW9uLm1heEFsdGVybmF0aXZlcyA9IDE7XG5cbi8vdmFyIGRpYWdub3N0aWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3V0cHV0Jyk7XG4vL3ZhciBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuZG9jdW1lbnQuYm9keS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gIHJlY29nbml0aW9uLnN0YXJ0KCk7XG4gIGNvbnNvbGUubG9nKCdSZWFkeSB0byByZWNlaXZlIGEgY29sb3IgY29tbWFuZC4nKTtcbn1cblxucmVjb2duaXRpb24ub25yZXN1bHQgPSBmdW5jdGlvbihldmVudCkge1xuICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25FdmVudCByZXN1bHRzIHByb3BlcnR5IHJldHVybnMgYSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0XG4gIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdHMuXG4gIC8vIEl0IGhhcyBhIGdldHRlciBzbyBpdCBjYW4gYmUgYWNjZXNzZWQgbGlrZSBhbiBhcnJheVxuICAvLyBUaGUgZmlyc3QgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IGF0IHBvc2l0aW9uIDAuXG4gIC8vIEVhY2ggU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0cyB0aGF0IGNvbnRhaW4gaW5kaXZpZHVhbCByZXN1bHRzLlxuICAvLyBUaGVzZSBhbHNvIGhhdmUgZ2V0dGVycyBzbyB0aGV5IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFycmF5cy5cbiAgLy8gVGhlIHNlY29uZCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBhdCBwb3NpdGlvbiAwLlxuICAvLyBXZSB0aGVuIHJldHVybiB0aGUgdHJhbnNjcmlwdCBwcm9wZXJ0eSBvZiB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3QgXG4gIHZhciBmaW5hbFN0ciA9IGV2ZW50LnJlc3VsdHNbMF1bMF0udHJhbnNjcmlwdDtcbiAgLy9kaWFnbm9zdGljLnRleHRDb250ZW50ID0gJ1Jlc3VsdCByZWNlaXZlZDogJyArIGNvbG9yICsgJy4nO1xuICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICBjb25zb2xlLmxvZygnQ29uZmlkZW5jZTogJyArIGZpbmFsU3RyKTtcbiAgaWYgKGZpbmFsU3RyLmluZGV4T2YoJ3N1aXZhbnQnKSAhPSAtMSl7XG4gIFx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICduZXh0J30pO1xuICB9ZWxzZSBpZiAoZmluYWxTdHIuaW5kZXhPZigncHLDqWPDqWRlbnQnKSAhPSAtMSl7XG4gIFx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICdwcmV2J30pO1xuICB9XG59XG5cbi8vIFdlIGRldGVjdCB0aGUgZW5kIG9mIHNwZWVjaFJlY29nbml0aW9uIHByb2Nlc3NcbiAgICAgIHJlY29nbml0aW9uLm9uZW5kID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJ0VuZCBvZiByZWNvZ25pdGlvbicpXG4gICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFdlIGRldGVjdCBlcnJvcnNcbiAgICAgIHJlY29nbml0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vLXNwZWVjaCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gU3BlZWNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmVycm9yID09ICdhdWRpby1jYXB0dXJlJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBtaWNyb3Bob25lJylcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vdC1hbGxvd2VkJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3QgQWxsb3dlZCcpO1xuICAgICAgICB9XG4gICAgICB9OyAgICAgXG5cblxuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0cmVjb2duaXRpb24uc3RvcCgpO1xufVxuXG5cbmZ1bmN0aW9uIFZvaWNlQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHRyZWNvZ25pdGlvbi5zdGFydCgpO1xuXHRcblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuXG5Wb2ljZUNvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gVm9pY2VDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzb2NrZXQgPSBpbyhcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKTtcblxuZnVuY3Rpb24gU29ja2V0U2VydmljZSgpe1xuXG5cdHRoaXMuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xuXHRcdHNvY2tldC5lbWl0KCdzZW5zb3InLCBtc2cpO1xuXHR9XG5cblx0dGhpcy5nZXRTb2NrZXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBzb2NrZXQ7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldFNlcnZpY2U7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBhZGRyZXNzID0gbnVsbDtcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoYWRkcmVzcyl7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRcdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG5cdCAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuXHQgICAgICAgICAgIG1vZGU6ICdjb3JzJyxcblx0ICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG5cblx0XHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYC9pcGAsbXlJbml0KTtcblx0XHRmZXRjaChteVJlcXVlc3QpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdFx0bGV0IG5ldHdvcmsgPSBqc29uO1xuXG5cdFx0XHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRcdFx0bGV0IHdsYW4wID0gbmV0d29yay5maW5kKGZ1bmN0aW9uKGVsZW1lbnQpe1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50Lm5hbWUgPT09ICd3bGFuMCc7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAod2xhbjApe1xuXHRcdFx0XHRcdGFkZHJlc3MgPSBgJHt3bGFuMC5pcH06MzAwMGA7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGFkZHJlc3MgPSBcImxvY2FsaG9zdDozMDAwXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiODAwMFwiKXtcblx0XHRcdFx0YWRkcmVzcyA9IFwiamVmLmJpbm9tZWQuZnI6ODAwMFwiO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGFkZHJlc3MgPSBudWxsO1xuXHRcdFx0fSBcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fSk7XG59XG5cbmNhbGN1bGF0ZUFkZHJlc3MoKTtcblxuXG5mdW5jdGlvbiBNb2RlbFNlcnZpY2UoKXtcblxuXHR0aGlzLmdldEFkZHJlc3MgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBhZGRyZXNzO1xuXHR9XHRcblxuXHR0aGlzLmNoZWNrQWRkcmVzcyA9IGNhbGN1bGF0ZUFkZHJlc3M7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFNlcnZpY2U7Il19
