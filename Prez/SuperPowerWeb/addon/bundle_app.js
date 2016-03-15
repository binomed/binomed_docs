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
.directive('jfTouchstart', [function() {
    return function(scope, element, attr) {

        element.on('touchstart', function(event) {
        	event.preventDefault();
            scope.$apply(function() { 
                scope.$eval(attr.jfTouchstart); 
            });
        });
    };
}]).directive('jfTouchend', [function() {
    return function(scope, element, attr) {

        element.on('touchend', function(event) {
        	event.preventDefault();
            scope.$apply(function() { 
                scope.$eval(attr.jfTouchend); 
            });
        });
    };
}])
.directive('jfColorpicker', [function(){
	return function(scope, element, attr){
		var img = new Image();
		img.src = './assets/images/color-wheel.png'
		img.onload = function() {
		  var canvas = document.querySelector('canvas');
		  var context = canvas.getContext('2d');

		  canvas.width = 150 * devicePixelRatio;
		  canvas.height = 150 * devicePixelRatio;
		  canvas.style.width = "150px";
		  canvas.style.height = "150px";
		  canvas.addEventListener('click', function(evt) {
		    // Refresh canvas in case user zooms and devicePixelRatio changes.
		    canvas.width = 150 * devicePixelRatio;
		    canvas.height = 150 * devicePixelRatio;
		    context.drawImage(img, 0, 0, canvas.width, canvas.height);

		    var rect = canvas.getBoundingClientRect();
		    var x = Math.round((evt.clientX - rect.left) * devicePixelRatio);
		    var y = Math.round((evt.clientY - rect.top) * devicePixelRatio);
		    var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

		    var r = data[((canvas.width * y) + x) * 4];
		    var g = data[((canvas.width * y) + x) * 4 + 1];
		    var b = data[((canvas.width * y) + x) * 4 + 2];
		    
		    scope.$eval(attr.jfColorpicker, {
		    	red:r,
		    	blue:b,
		    	green:g
		    }); 
		    

		    context.beginPath();
		    context.arc(x, y + 2, 10 * devicePixelRatio, 0, 2 * Math.PI, false);
		    context.shadowColor = '#333';
		    context.shadowBlur = 4 * devicePixelRatio;
		    context.fillStyle = 'white';
		    context.fill();
		  });

		  context.drawImage(img, 0, 0, canvas.width, canvas.height);
		}
	};
}])
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
},{"./secure/secure":3,"./sensors/bluetooth":4,"./sensors/light":5,"./sensors/orientation":6,"./sensors/proximity":7,"./sensors/usermedia":8,"./sensors/voice":9,"./socket/sockets":10,"./util/model":11}],2:[function(require,module,exports){
'use strict'

const DEVICE_NAME = "Makeblock_LE",
	SERVICE_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb",
	CHARACTERISTIC_UUID = "0000ffe3-0000-1000-8000-00805f9b34fb";

const TYPE_MOTOR = 0x0a,
	TYPE_RGB = 0x08,
	TYPE_SOUND = 0x07;


const PORT_1 = 0x01,
	PORT_2 = 0x02,
	PORT_3 = 0x03,
	PORT_4 = 0x04,
	PORT_5 = 0x05,
	PORT_6 = 0x06,
	PORT_7 = 0x07,
	PORT_8 = 0x08,
	M_1 = 0x09,
	M_2 = 0x0a;

function genericControl(type, port, slot, value){
	/*
	ff 55 len idx action device port  slot  data a
	0  1  2   3   4      5      6     7     8
	*/
	//unsigned char a[11]={0xff,0x55,WRITEMODULE,7,0,0,0,0,0,0,'\n'};
    //a[4] = [type intValue];
    //a[5] = (port<<4 & 0xf0)|(slot & 0xf);
    // Static values
	var buf = new ArrayBuffer(16);
	var bufView = new Uint16Array(buf);
	
	var byte0 = 0xff,
		byte1 = 0x55,
		byte2 = 0x09,
		byte3 = 0x00,
		byte4 = 0x02,
		byte5 = type,
		byte6 = port,
		byte7 = slot;
	//dynamics values
	var byte8 = 0x00,
		byte9 = 0x00,
		byte10 = 0x00,
		byte11 = 0x00;
	//End of message
	var byte12 = 0x0a,
		byte13 = 0x00,
		byte14 = 0x00,
		byte15 = 0x00;

	switch(type){
		case TYPE_MOTOR:
			// Motor M1
			// ff:55  09:00  02:0a  09:64  00:00  00:00  0a"
			// 0x55ff;0x0009;0x0a02;0x0964;0x0000;0x0000;0x000a;0x0000;
			//"ff:55:09:00:02:0a:09:00:00:00:00:00:0a"
			// ff:55:09:00:02:0a:09:9c:ff:00:00:00:0a
			// Motor M2
			// ff:55:09:00:02:0a:0a:64:00:00:00:00:0a
			// ff:55:09:00:02:0a:0a:00:00:00:00:00:0a
			// ff:55:09:00:02:0a:0a:9c:ff:00:00:00:0a
			var tempValue = value < 0 ? (parseInt("ffff",16) + Math.max(-255,value)) : Math.min(255, value);
			byte7 = tempValue & 0x00ff;			
			byte8 = 0x00;
			byte8 = tempValue >>8; 

			/*byte5 = 0x0a;
			byte6 = 0x09;
			byte7 = 0x64;
			byte8 = 0x00;*/
			
		break;
		case TYPE_RGB:
			// ff:55  09:00  02:08  06:00  5c:99  6d:00  0a
			// 0x55ff;0x0009;0x0802;0x0006;0x995c;0x006d;0x000a;0x0000;
			byte7 = 0x00;
			byte8 = value>>8 & 0xff;
			byte9 = value>>16 & 0xff;
			byte10 = value>>24 & 0xff;
		break;
		case TYPE_SOUND:
			//ff:55:05:00:02:22:00:00:0a
			//ff:55:05:00:02:22:06:01:0a
			//ff:55:05:00:02:22:ee:01:0a
			//ff:55:05:00:02:22:88:01:0a
			//ff:55:05:00:02:22:b8:01:0a
			//ff:55:05:00:02:22:5d:01:0a
			//ff:55:05:00:02:22:4a:01:0a
			//ff:55:05:00:02:22:26:01:0a
			byte3 = 0x05;
			byte4 = 0x00;
			byte5 = 0x02;
			byte6 = 0x22;
			if (value === 0){
				byte7 = 0x00;
				byte8 = 0x00;
			}else{

				byte7 = 0xee;
				byte8 = 0x01;
			}
			byte9 = 0x0a;
			byte12= 0x00;

		break;
	}

	bufView[0] = byte1<<8 | byte0;
	bufView[1] = byte3<<8 | byte2;
	bufView[2] = byte5<<8 | byte4;
	bufView[3] = byte7<<8 | byte6;
	bufView[4] = byte9<<8 | byte8;
	bufView[5] = byte11<<8 | byte10;
	bufView[6] = byte13<<8 | byte12;
	bufView[7] = byte15<<8 | byte14;
	console.log(
			byte0.toString(16)+":"+
			byte1.toString(16)+":"+
			byte2.toString(16)+":"+
			byte3.toString(16)+":"+
			byte4.toString(16)+":"+
			byte5.toString(16)+":"+
			byte6.toString(16)+":"+
			byte7.toString(16)+":"+
			byte8.toString(16)+":"+
			byte9.toString(16)+":"+
			byte10.toString(16)+":"+
			byte11.toString(16)+":"+
			byte12.toString(16)+":"+
			byte13.toString(16)+":"+
			byte14.toString(16)+":"+
			byte15.toString(16)+":"
			);
	console.log(
			bufView[0].toString(16)+":"+
			bufView[1].toString(16)+":"+
			bufView[2].toString(16)+":"+
			bufView[3].toString(16)+":"+
			bufView[4].toString(16)+":"+
			bufView[5].toString(16)+":"+
			bufView[6].toString(16)+":"+
			bufView[7].toString(16)
			);
	return buf;
}


module.epxorts = {
	'DEVICE_NAME' : DEVICE_NAME,
	'SERVICE_UUID' : SERVICE_UUID,
	'CHARACTERISTIC_UUID' : CHARACTERISTIC_UUID,
	'TYPE_MOTOR' : TYPE_MOTOR,
	'TYPE_RGB' : TYPE_RGB,
	'TYPE_SOUND' : TYPE_SOUND,
	'PORT_1' : PORT_1,
	'PORT_2' : PORT_2,
	'PORT_3' : PORT_3,
	'PORT_4' : PORT_4,
	'PORT_5' : PORT_5,
	'PORT_6' : PORT_6,
	'PORT_7' : PORT_7,
	'PORT_8' : PORT_8,
	'M_1' : M_1,
	'M_2' : M_2,
	genericControl : genericControl
};
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
'use strict'

const mbotApi = require('../mbot/mbot');  

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
			filters: [{ name: mbotApi.DEVICE_NAME }], optionalServices: [mbotApi.SERVICE_UUID]
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
		       		resolveService(server.getPrimaryService(mbotApi.SERVICE_UUID));
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
				return service.getCharacteristic(mbotApi.CHARACTERISTIC_UUID);
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

function processMotors(valueM1, valueM2){
	getCharacteristic()
	.then(characteristic =>{
		return characteristic.writeValue(mbotApi.genericControl(mbotApi.TYPE_MOTOR, mbotApi.M_1, 0, valueM1));
	}).then(()=>{
		return characteristicGATT.writeValue(mbotApi.genericControl(mbotApi.TYPE_MOTOR, mbotApi.M_2, 0, valueM2));
	}).then(()=>{
		if(callback){
			callback({type: 'write', value : true});			
		}
		console.info("Write datas ! ");
	}).catch(error =>{
		console.error(error);
		if (callback) {
			callback({type : 'error', value : error});
		}
	});
}


function BleController($mdDialog){

	this.sliderActiv = false;
	this.currentTimer = null;
	this.power = 125;
	this.red = 0;

	this.close = function(){
		this.stop();
		$mdDialog.hide();
	} 

	this.connect = function(){
		processCharacteristic('write', "on");
	}

	this.up = function(event){
		console.log("up");
		processMotors(-100,100);
	}

	this.down = function(){
		console.log("down");
		processMotors(100,-100);
	}
	
	this.left = function(){
		console.log("left");
		processMotors(100,100);
	};

	this.right = function(){
		console.log("right");
		processMotors(-100,-100);
	};

	this.stop = function(){
		console.log("stop");
		processMotors(0,0);
	}

	this.changeColor = function(red,blue,green){ 
		console.log("Change Color : %d,%d,%d",red,blue,green)
		if (picker){
			valueArray[0] = picker.rgb[0];
			valueArray[1] = picker.rgb[1];
			valueArray[2] = picker.rgb[2];
		}
		var rHex = valueArray[0]<<8;
		var gHex = valueArray[1]<<16;
		var bHex = valueArray[2]<<24;
		var value = rHex | gHex | bHex;
		processCharacteristic('write', mbotApi.genericControl(mbotApi.TYPE_RGB,mbotApi.PORT_6,0,value));
		//processCharacteristic('write', "bright:"+this.power);
	};


}

BleController.$inject = ['$mdDialog']


module.exports = BleController;/*{
	writeData : processCharacteristic
}*/


},{"../mbot/mbot":2}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
'use strict'

var model = null,
    socket = null;

// The listener
var deviceProximityHandler = function(event) {
	var value = Math.round(event.value);        
	if (value === 0){
        socket.sendMessage({type: 'voice', value : 'start'});
		/*let address = model.getAddress();
		let scheme = model.isSSL()  ? "https" : "http";
		window.location = `intent://${address}/addon/index_app.html?speech#Intent;scheme=${scheme};package=org.chromium.chrome;end`;*/
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

function ProximityControler($mdDialog, ModelService, SocketService){

	model = ModelService;
    socket = SocketService;

	this.turnOn = function(){
		if (window.DeviceProximityEvent){

			register();
		}else{
			let address = model.getAddress();
			let scheme = model.isSSL()  ? "https" : "http";
			//window.location = `intent://10.33.44.181:3000/addon/index_app.html#Intent;scheme=${scheme};package=org.mozilla.firefox_beta;end`;
			window.location = `intent://${address}/addon/index_app.html?proximity#Intent;scheme=${scheme};package=org.mozilla.firefox_beta;end`;
		}
	}

	this.goToChrome = function(){
		let address = model.getAddress();
		let scheme = model.isSSL()  ? "https" : "http";
		//window.location = `intent://10.33.44.181:3000/addon/index_app.html#Intent;scheme=${scheme};package=org.mozilla.firefox_beta;end`;
		window.location = `intent://${address}/addon/index_app.html#Intent;scheme=${scheme};package=org.chromium.chrome;action=android.intent.action.VIEW;launchFlags=0x10000000;end`;
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}

ProximityControler.$inject = ['$mdDialog', 'ModelService', 'SocketService'];

module.exports = ProximityControler;
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
			}else if (location.port && (location.port === "80" || location.port === "")){
				address = "binomed.fr:8000";
				ioAddress = "binomed.fr:8000";
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9tYm90L21ib3QuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZWN1cmUvc2VjdXJlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9ibHVldG9vdGguanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlbnNvcnMvcHJveGltaXR5LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL3ZvaWNlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc29ja2V0L3NvY2tldHMuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC91dGlsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyLm1vZHVsZShcIlN1cGVyUG93ZXJBcHBcIiwgWyduZ01hdGVyaWFsJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xuICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuICAgIC5wcmltYXJ5UGFsZXR0ZSgncmVkJylcbiAgICAuYWNjZW50UGFsZXR0ZSgnb3JhbmdlJyk7XG59KVxuLnNlcnZpY2UoJ1NvY2tldFNlcnZpY2UnLCByZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJykpXG4uc2VydmljZSgnTW9kZWxTZXJ2aWNlJywgcmVxdWlyZSgnLi91dGlsL21vZGVsJykpXG4uZGlyZWN0aXZlKCdqZlRvdWNoc3RhcnQnLCBbZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG5cbiAgICAgICAgZWxlbWVudC5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWwoYXR0ci5qZlRvdWNoc3RhcnQpOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufV0pLmRpcmVjdGl2ZSgnamZUb3VjaGVuZCcsIFtmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcblxuICAgICAgICBlbGVtZW50Lm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWwoYXR0ci5qZlRvdWNoZW5kKTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1dKVxuLmRpcmVjdGl2ZSgnamZDb2xvcnBpY2tlcicsIFtmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpe1xuXHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHRpbWcuc3JjID0gJy4vYXNzZXRzL2ltYWdlcy9jb2xvci13aGVlbC5wbmcnXG5cdFx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdCAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuXHRcdCAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuXHRcdCAgY2FudmFzLndpZHRoID0gMTUwICogZGV2aWNlUGl4ZWxSYXRpbztcblx0XHQgIGNhbnZhcy5oZWlnaHQgPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuXHRcdCAgY2FudmFzLnN0eWxlLndpZHRoID0gXCIxNTBweFwiO1xuXHRcdCAgY2FudmFzLnN0eWxlLmhlaWdodCA9IFwiMTUwcHhcIjtcblx0XHQgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdCAgICAvLyBSZWZyZXNoIGNhbnZhcyBpbiBjYXNlIHVzZXIgem9vbXMgYW5kIGRldmljZVBpeGVsUmF0aW8gY2hhbmdlcy5cblx0XHQgICAgY2FudmFzLndpZHRoID0gMTUwICogZGV2aWNlUGl4ZWxSYXRpbztcblx0XHQgICAgY2FudmFzLmhlaWdodCA9IDE1MCAqIGRldmljZVBpeGVsUmF0aW87XG5cdFx0ICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuXHRcdCAgICB2YXIgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHQgICAgdmFyIHggPSBNYXRoLnJvdW5kKChldnQuY2xpZW50WCAtIHJlY3QubGVmdCkgKiBkZXZpY2VQaXhlbFJhdGlvKTtcblx0XHQgICAgdmFyIHkgPSBNYXRoLnJvdW5kKChldnQuY2xpZW50WSAtIHJlY3QudG9wKSAqIGRldmljZVBpeGVsUmF0aW8pO1xuXHRcdCAgICB2YXIgZGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCkuZGF0YTtcblxuXHRcdCAgICB2YXIgciA9IGRhdGFbKChjYW52YXMud2lkdGggKiB5KSArIHgpICogNF07XG5cdFx0ICAgIHZhciBnID0gZGF0YVsoKGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0ICsgMV07XG5cdFx0ICAgIHZhciBiID0gZGF0YVsoKGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0ICsgMl07XG5cdFx0ICAgIFxuXHRcdCAgICBzY29wZS4kZXZhbChhdHRyLmpmQ29sb3JwaWNrZXIsIHtcblx0XHQgICAgXHRyZWQ6cixcblx0XHQgICAgXHRibHVlOmIsXG5cdFx0ICAgIFx0Z3JlZW46Z1xuXHRcdCAgICB9KTsgXG5cdFx0ICAgIFxuXG5cdFx0ICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0ICAgIGNvbnRleHQuYXJjKHgsIHkgKyAyLCAxMCAqIGRldmljZVBpeGVsUmF0aW8sIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG5cdFx0ICAgIGNvbnRleHQuc2hhZG93Q29sb3IgPSAnIzMzMyc7XG5cdFx0ICAgIGNvbnRleHQuc2hhZG93Qmx1ciA9IDQgKiBkZXZpY2VQaXhlbFJhdGlvO1xuXHRcdCAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0ICAgIGNvbnRleHQuZmlsbCgpO1xuXHRcdCAgfSk7XG5cblx0XHQgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0XHR9XG5cdH07XG59XSlcbi5kaXJlY3RpdmUoJ2FwcCcsIFsnJG1kRGlhbG9nJywgJyR0aW1lb3V0JywgJ1NvY2tldFNlcnZpY2UnLCAnTW9kZWxTZXJ2aWNlJyxcblx0ZnVuY3Rpb24oJG1kRGlhbG9nLCAkdGltZW91dCwgU29ja2V0U2VydmljZSwgTW9kZWxTZXJ2aWNlKXtcblxuXHRcdFNvY2tldFNlcnZpY2UuY29ubmVjdChNb2RlbFNlcnZpY2UpO1xuXG5cdHJldHVybiB7XG5cdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvYXBwLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXJBcyA6ICdhcHAnLFxuXHRcdGJpbmRUb0NvbnRyb2xsZXIgOiB0cnVlLFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLmFjdGlvbnMgPSBbXG5cdFx0XHRcdHtsYWJlbCA6IFwiQmx1ZXRvb3RoXCIsIGljb24gOiAnZmEtYmx1ZXRvb3RoJywgaWRBY3Rpb246ICdibGUnfSxcblx0XHRcdFx0e2xhYmVsIDogXCJMaWdodFwiLCBpY29uIDogJ2ZhLWxpZ2h0YnVsYi1vJywgaWRBY3Rpb246ICdsaWdodCd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIk9yaWVudGF0aW9uXCIsIGljb24gOiAnZmEtY29tcGFzcycsIGlkQWN0aW9uOiAnb3JpZW50YXRpb24nfSxcblx0XHRcdFx0e2xhYmVsIDogXCJVc2VyTWVkaWFcIiwgaWNvbiA6ICdmYS1jYW1lcmEnLCBpZEFjdGlvbjogJ2NhbWVyYSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlByb3hpbWl0eVwiLCBpY29uIDogJ2ZhLXJzcycsIGlkQWN0aW9uOiAncHJveGltaXR5J30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiVm9pY2VcIiwgaWNvbiA6ICdmYS1taWNyb3Bob25lJywgaWRBY3Rpb246ICdtaWMnfVxuXHRcdFx0XTtcblxuXHRcdFx0XG5cdFx0XHRcblxuXHRcdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPT09ICc/cHJveGltaXR5Jyl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAncHJveGltaXR5Q3RybCcsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvcHJveGltaXR5Lmh0bWwnLFxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9wcm94aW1pdHknKSxcblx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdzZWN1cmVDdHJsJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9zZWN1cmUuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZShcIi4vc2VjdXJlL3NlY3VyZVwiKSxcblx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0Ly90YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm9wZW5EaWFsb2cgPSBmdW5jdGlvbihldmVudCwgdHlwZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdPcGVuIERpYWxvZycpO1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2JsZScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdibGVDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2JsdWV0b290aC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9ibHVldG9vdGgnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ2xpZ2h0Jyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2xpZ2h0Q3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9saWdodC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9saWdodCcpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnb3JpZW50YXRpb24nKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnb3JpZW50YXRpb25DdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL29yaWVudGF0aW9uLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL29yaWVudGF0aW9uJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdtaWMnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAndm9pY2VDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3ZvaWNlLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3ZvaWNlJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdwcm94aW1pdHknKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAncHJveGltaXR5Q3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9wcm94aW1pdHkuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvcHJveGltaXR5JyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdjYW1lcmEnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnY2FtZXJhQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy91c2VybWVkaWEuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvdXNlcm1lZGlhJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufV0pO1xuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkKCl7XHRcblx0Ly9yZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJyk7XG59XG5cblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTsiLCIndXNlIHN0cmljdCdcblxuY29uc3QgREVWSUNFX05BTUUgPSBcIk1ha2VibG9ja19MRVwiLFxuXHRTRVJWSUNFX1VVSUQgPSBcIjAwMDBmZmUxLTAwMDAtMTAwMC04MDAwLTAwODA1ZjliMzRmYlwiLFxuXHRDSEFSQUNURVJJU1RJQ19VVUlEID0gXCIwMDAwZmZlMy0wMDAwLTEwMDAtODAwMC0wMDgwNWY5YjM0ZmJcIjtcblxuY29uc3QgVFlQRV9NT1RPUiA9IDB4MGEsXG5cdFRZUEVfUkdCID0gMHgwOCxcblx0VFlQRV9TT1VORCA9IDB4MDc7XG5cblxuY29uc3QgUE9SVF8xID0gMHgwMSxcblx0UE9SVF8yID0gMHgwMixcblx0UE9SVF8zID0gMHgwMyxcblx0UE9SVF80ID0gMHgwNCxcblx0UE9SVF81ID0gMHgwNSxcblx0UE9SVF82ID0gMHgwNixcblx0UE9SVF83ID0gMHgwNyxcblx0UE9SVF84ID0gMHgwOCxcblx0TV8xID0gMHgwOSxcblx0TV8yID0gMHgwYTtcblxuZnVuY3Rpb24gZ2VuZXJpY0NvbnRyb2wodHlwZSwgcG9ydCwgc2xvdCwgdmFsdWUpe1xuXHQvKlxuXHRmZiA1NSBsZW4gaWR4IGFjdGlvbiBkZXZpY2UgcG9ydCAgc2xvdCAgZGF0YSBhXG5cdDAgIDEgIDIgICAzICAgNCAgICAgIDUgICAgICA2ICAgICA3ICAgICA4XG5cdCovXG5cdC8vdW5zaWduZWQgY2hhciBhWzExXT17MHhmZiwweDU1LFdSSVRFTU9EVUxFLDcsMCwwLDAsMCwwLDAsJ1xcbid9O1xuICAgIC8vYVs0XSA9IFt0eXBlIGludFZhbHVlXTtcbiAgICAvL2FbNV0gPSAocG9ydDw8NCAmIDB4ZjApfChzbG90ICYgMHhmKTtcbiAgICAvLyBTdGF0aWMgdmFsdWVzXG5cdHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMTYpO1xuXHR2YXIgYnVmVmlldyA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuXHRcblx0dmFyIGJ5dGUwID0gMHhmZixcblx0XHRieXRlMSA9IDB4NTUsXG5cdFx0Ynl0ZTIgPSAweDA5LFxuXHRcdGJ5dGUzID0gMHgwMCxcblx0XHRieXRlNCA9IDB4MDIsXG5cdFx0Ynl0ZTUgPSB0eXBlLFxuXHRcdGJ5dGU2ID0gcG9ydCxcblx0XHRieXRlNyA9IHNsb3Q7XG5cdC8vZHluYW1pY3MgdmFsdWVzXG5cdHZhciBieXRlOCA9IDB4MDAsXG5cdFx0Ynl0ZTkgPSAweDAwLFxuXHRcdGJ5dGUxMCA9IDB4MDAsXG5cdFx0Ynl0ZTExID0gMHgwMDtcblx0Ly9FbmQgb2YgbWVzc2FnZVxuXHR2YXIgYnl0ZTEyID0gMHgwYSxcblx0XHRieXRlMTMgPSAweDAwLFxuXHRcdGJ5dGUxNCA9IDB4MDAsXG5cdFx0Ynl0ZTE1ID0gMHgwMDtcblxuXHRzd2l0Y2godHlwZSl7XG5cdFx0Y2FzZSBUWVBFX01PVE9SOlxuXHRcdFx0Ly8gTW90b3IgTTFcblx0XHRcdC8vIGZmOjU1ICAwOTowMCAgMDI6MGEgIDA5OjY0ICAwMDowMCAgMDA6MDAgIDBhXCJcblx0XHRcdC8vIDB4NTVmZjsweDAwMDk7MHgwYTAyOzB4MDk2NDsweDAwMDA7MHgwMDAwOzB4MDAwYTsweDAwMDA7XG5cdFx0XHQvL1wiZmY6NTU6MDk6MDA6MDI6MGE6MDk6MDA6MDA6MDA6MDA6MDA6MGFcIlxuXHRcdFx0Ly8gZmY6NTU6MDk6MDA6MDI6MGE6MDk6OWM6ZmY6MDA6MDA6MDA6MGFcblx0XHRcdC8vIE1vdG9yIE0yXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowYTo2NDowMDowMDowMDowMDowYVxuXHRcdFx0Ly8gZmY6NTU6MDk6MDA6MDI6MGE6MGE6MDA6MDA6MDA6MDA6MDA6MGFcblx0XHRcdC8vIGZmOjU1OjA5OjAwOjAyOjBhOjBhOjljOmZmOjAwOjAwOjAwOjBhXG5cdFx0XHR2YXIgdGVtcFZhbHVlID0gdmFsdWUgPCAwID8gKHBhcnNlSW50KFwiZmZmZlwiLDE2KSArIE1hdGgubWF4KC0yNTUsdmFsdWUpKSA6IE1hdGgubWluKDI1NSwgdmFsdWUpO1xuXHRcdFx0Ynl0ZTcgPSB0ZW1wVmFsdWUgJiAweDAwZmY7XHRcdFx0XG5cdFx0XHRieXRlOCA9IDB4MDA7XG5cdFx0XHRieXRlOCA9IHRlbXBWYWx1ZSA+Pjg7IFxuXG5cdFx0XHQvKmJ5dGU1ID0gMHgwYTtcblx0XHRcdGJ5dGU2ID0gMHgwOTtcblx0XHRcdGJ5dGU3ID0gMHg2NDtcblx0XHRcdGJ5dGU4ID0gMHgwMDsqL1xuXHRcdFx0XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBUWVBFX1JHQjpcblx0XHRcdC8vIGZmOjU1ICAwOTowMCAgMDI6MDggIDA2OjAwICA1Yzo5OSAgNmQ6MDAgIDBhXG5cdFx0XHQvLyAweDU1ZmY7MHgwMDA5OzB4MDgwMjsweDAwMDY7MHg5OTVjOzB4MDA2ZDsweDAwMGE7MHgwMDAwO1xuXHRcdFx0Ynl0ZTcgPSAweDAwO1xuXHRcdFx0Ynl0ZTggPSB2YWx1ZT4+OCAmIDB4ZmY7XG5cdFx0XHRieXRlOSA9IHZhbHVlPj4xNiAmIDB4ZmY7XG5cdFx0XHRieXRlMTAgPSB2YWx1ZT4+MjQgJiAweGZmO1xuXHRcdGJyZWFrO1xuXHRcdGNhc2UgVFlQRV9TT1VORDpcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MDA6MDA6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MDY6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6ZWU6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6ODg6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6Yjg6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6NWQ6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6NGE6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MjY6MDE6MGFcblx0XHRcdGJ5dGUzID0gMHgwNTtcblx0XHRcdGJ5dGU0ID0gMHgwMDtcblx0XHRcdGJ5dGU1ID0gMHgwMjtcblx0XHRcdGJ5dGU2ID0gMHgyMjtcblx0XHRcdGlmICh2YWx1ZSA9PT0gMCl7XG5cdFx0XHRcdGJ5dGU3ID0gMHgwMDtcblx0XHRcdFx0Ynl0ZTggPSAweDAwO1xuXHRcdFx0fWVsc2V7XG5cblx0XHRcdFx0Ynl0ZTcgPSAweGVlO1xuXHRcdFx0XHRieXRlOCA9IDB4MDE7XG5cdFx0XHR9XG5cdFx0XHRieXRlOSA9IDB4MGE7XG5cdFx0XHRieXRlMTI9IDB4MDA7XG5cblx0XHRicmVhaztcblx0fVxuXG5cdGJ1ZlZpZXdbMF0gPSBieXRlMTw8OCB8IGJ5dGUwO1xuXHRidWZWaWV3WzFdID0gYnl0ZTM8PDggfCBieXRlMjtcblx0YnVmVmlld1syXSA9IGJ5dGU1PDw4IHwgYnl0ZTQ7XG5cdGJ1ZlZpZXdbM10gPSBieXRlNzw8OCB8IGJ5dGU2O1xuXHRidWZWaWV3WzRdID0gYnl0ZTk8PDggfCBieXRlODtcblx0YnVmVmlld1s1XSA9IGJ5dGUxMTw8OCB8IGJ5dGUxMDtcblx0YnVmVmlld1s2XSA9IGJ5dGUxMzw8OCB8IGJ5dGUxMjtcblx0YnVmVmlld1s3XSA9IGJ5dGUxNTw8OCB8IGJ5dGUxNDtcblx0Y29uc29sZS5sb2coXG5cdFx0XHRieXRlMC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMi50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMy50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNi50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNy50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlOC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlOS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTAudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTExLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxMi50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTMudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTE0LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxNS50b1N0cmluZygxNikrXCI6XCJcblx0XHRcdCk7XG5cdGNvbnNvbGUubG9nKFxuXHRcdFx0YnVmVmlld1swXS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzFdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbMl0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1szXS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzRdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbNV0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1s2XS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzddLnRvU3RyaW5nKDE2KVxuXHRcdFx0KTtcblx0cmV0dXJuIGJ1Zjtcbn1cblxuXG5tb2R1bGUuZXB4b3J0cyA9IHtcblx0J0RFVklDRV9OQU1FJyA6IERFVklDRV9OQU1FLFxuXHQnU0VSVklDRV9VVUlEJyA6IFNFUlZJQ0VfVVVJRCxcblx0J0NIQVJBQ1RFUklTVElDX1VVSUQnIDogQ0hBUkFDVEVSSVNUSUNfVVVJRCxcblx0J1RZUEVfTU9UT1InIDogVFlQRV9NT1RPUixcblx0J1RZUEVfUkdCJyA6IFRZUEVfUkdCLFxuXHQnVFlQRV9TT1VORCcgOiBUWVBFX1NPVU5ELFxuXHQnUE9SVF8xJyA6IFBPUlRfMSxcblx0J1BPUlRfMicgOiBQT1JUXzIsXG5cdCdQT1JUXzMnIDogUE9SVF8zLFxuXHQnUE9SVF80JyA6IFBPUlRfNCxcblx0J1BPUlRfNScgOiBQT1JUXzUsXG5cdCdQT1JUXzYnIDogUE9SVF82LFxuXHQnUE9SVF83JyA6IFBPUlRfNyxcblx0J1BPUlRfOCcgOiBQT1JUXzgsXG5cdCdNXzEnIDogTV8xLFxuXHQnTV8yJyA6IE1fMixcblx0Z2VuZXJpY0NvbnRyb2wgOiBnZW5lcmljQ29udHJvbFxufTsiLCIndXNlIHN0cmljdCdcblxudmFyIG1vZGVsID0gbnVsbCxcblx0c29ja2V0ID0gbnVsbDtcblxuXG5cbmZ1bmN0aW9uIGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIHB3ZCl7XG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICBoZWFkZXJzOiBteUhlYWRlcnMsXG4gICAgICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuICAgIGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuICAgIGxldCBwcm90b2NvbCA9IG1vZGVsLmlzU1NMKCkgPyAnaHR0cHMnIDogJ2h0dHAnO1xuXG5cdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtwcm90b2NvbH06Ly8ke2FkZHJlc3N9L3Bhc3N3b3JkLyR7cHdkfWAsbXlJbml0KTtcblx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XG5cdFx0Ly8gT24gbmUgcmV0cmFpcmUgcGFzIHVuZSBxdWVzdGlvbiBkw6lqw6AgdHJhaXTDqWVcblx0XHRpZiAoanNvbi5hdXRoKXtcblx0XHRcdGxvY2FsU3RvcmFnZVsncHdkJ10gPSBwd2Q7XG5cdFx0XHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe1xuXHRcdFx0XHR0eXBlOiAnYmxlJyxcblx0XHRcdFx0YWN0aW9uOiAnc3RvcFBoeXNpY2FsV2ViJ1xuXHRcdFx0fSlcblx0XHRcdGlmIChsb2NhdGlvbi5zZWFyY2ggPT09IFwiXCIpe1xuXHRcdFx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0Y29udGV4dC5ub3R2YWxpZCA9IHRydWU7XG5cdFx0fVxuXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIFNlY3VyZUN0cmwoJG1kRGlhbG9nLCBNb2RlbFNlcnZpY2UsIFNvY2tldFNlcnZpY2Upe1xuXHRcblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblx0bW9kZWwgPSBNb2RlbFNlcnZpY2U7XG5cdHRoaXMubm90dmFsaWQgPSBmYWxzZTtcblx0bGV0IGNvbnRleHQgPSB0aGlzO1xuXG5cdG1vZGVsLmNoZWNrQWRkcmVzcygpXG5cdC50aGVuKGZ1bmN0aW9uKCl7XHRcdFxuXHRcdGlmIChsb2NhbFN0b3JhZ2VbJ3B3ZCddKXtcblx0XHRcdGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIGxvY2FsU3RvcmFnZVsncHdkJ10pO1xuXHRcdH1cblx0fSlcblxuXHR0aGlzLnRyeSA9IGZ1bmN0aW9uKCl7XG5cdFx0ZG9SZXF1ZXN0KCRtZERpYWxvZywgY29udGV4dCwgY29udGV4dC5wd2QpO1xuXHR9XG5cblxufVxuXG5TZWN1cmVDdHJsLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdNb2RlbFNlcnZpY2UnLCAnU29ja2V0U2VydmljZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlY3VyZUN0cmw7IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IG1ib3RBcGkgPSByZXF1aXJlKCcuLi9tYm90L21ib3QnKTsgIFxuXG5mdW5jdGlvbiBhYjJzdHIoYnVmKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50MTZBcnJheShidWYpKTtcbn1cblxuZnVuY3Rpb24gc3RyMmFiKHN0cikge1xuICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgZm9yIGVhY2ggY2hhclxuICB2YXIgYnVmVmlldyA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuICBmb3IgKHZhciBpPTAsIHN0ckxlbj1zdHIubGVuZ3RoOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICBidWZWaWV3W2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxudmFyIHNlcnZlckdBVFQgPSBudWxsLFxuXHRzZXJ2aWNlR0FUVCA9IG51bGwsXG5cdGNoYXJhY3RlcmlzdGljR0FUVCA9IG51bGwsXG5cdGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcblxuZnVuY3Rpb24gaW5pdEJsZSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2UoeyBcblx0XHRcdGZpbHRlcnM6IFt7IG5hbWU6IG1ib3RBcGkuREVWSUNFX05BTUUgfV0sIG9wdGlvbmFsU2VydmljZXM6IFttYm90QXBpLlNFUlZJQ0VfVVVJRF1cblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGRldmljZSkge1xuXHRcdCAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGluZy4uLlwiKTtcblx0XHQgICByZXR1cm4gZGV2aWNlLmNvbm5lY3RHQVRUKCk7XG5cdFx0IH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cdFx0XHRzZXJ2ZXJHQVRUID0gc2VydmVyO1xuXHRcdFx0Ly9yZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHNlcnZpY2VVVUlEKTtcblx0XHQgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgdGltZW91dCB3aGVuIEdhdHRTZXJ2aWNlcyBwcm9wZXJ0eSB3b3JrcyBhcyBpbnRlbmRlZC5cblx0XHQgICAvLyBjcmJ1Zy5jb20vNTYwMjc3XG5cdFx0ICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmVTZXJ2aWNlLCByZWplY3RTZXJ2aWNlKSB7XG5cdFx0ICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgXHR0cnl7XG5cdFx0ICAgICBcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IFNlcnZpY2VcIik7XG5cdFx0ICAgICAgIFx0XHRyZXNvbHZlU2VydmljZShzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UobWJvdEFwaS5TRVJWSUNFX1VVSUQpKTtcblx0XHQgICAgIFx0fWNhdGNoKGVycil7XG5cdFx0ICAgICBcdFx0cmVqZWN0U2VydmljZShlcnIpO1xuXHRcdCAgICAgXHR9XG5cdFx0ICAgICB9LCAyZTMpO1xuXHRcdCAgIH0pXG5cdFx0fSkudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdHNlcnZpY2VHQVRUID0gc2VydmljZTtcblx0XHRcdHJlc29sdmUoc2VydmljZSk7XHRcdFx0XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHR9KVxufVxuXG5cbmZ1bmN0aW9uIGdldFNlcnZpY2UoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKHNlcnZlckdBVFQgJiYgc2VydmVyR0FUVC5jb25uZWN0ZWQgJiYgc2VydmljZUdBVFQpe1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpbml0QmxlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDaGFyYWN0ZXJpc3RpYygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoY2hhcmFjdGVyaXN0aWNHQVRUKXtcblx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXN0aWNHQVRUKTtcblx0XHR9ZWxzZXtcblx0XHRcdGdldFNlcnZpY2UoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBDaGFyYWN0ZXJpdGljIDogJU9cIixzZXJ2aWNlKTtcblx0XHRcdFx0cmV0dXJuIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMobWJvdEFwaS5DSEFSQUNURVJJU1RJQ19VVUlEKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbihjaGFyYWN0ZXJpdGljKXtcblx0XHRcdFx0Y2hhcmFjdGVyaXN0aWNHQVRUID0gY2hhcmFjdGVyaXRpYztcblx0XHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpdGljKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDaGFyYWN0ZXJpc3RpYyh0eXBlLCBkYXRhLCBjYWxsYmFjayl7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXN0aWMpe1xuXHRcdGlmICh0eXBlID09PSAnd3JpdGUnKXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHdyaXRlIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShlbmNvZGVyLmVuY29kZShkYXRhKSk7XG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcil7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1xuXHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmluZm8oXCJXcml0ZSBkYXRhcyAhIFwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBkYXRhID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG5cdFx0ICAgIGxldCBkYXRhRGVjcnlwdCA9IGRhdGEuZ2V0VWludDgoMCk7XG5cdFx0ICAgIGNhbGxiYWNrKHt0eXBlOiAncmVhZCcgLCB2YWx1ZSA6IGRhdGFEZWNyeXB0fSk7XG5cdFx0ICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlRGF0YXMgJXMnLCBkYXRhRGVjcnlwdCk7XG5cdFx0fVxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0aWYgKGNhbGxiYWNrKSB7XG5cblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NNb3RvcnModmFsdWVNMSwgdmFsdWVNMil7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oY2hhcmFjdGVyaXN0aWMgPT57XG5cdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8xLCAwLCB2YWx1ZU0xKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWNHQVRULndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8yLCAwLCB2YWx1ZU0yKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0fVxuXHRcdGNvbnNvbGUuaW5mbyhcIldyaXRlIGRhdGFzICEgXCIpO1xuXHR9KS5jYXRjaChlcnJvciA9Pntcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cblxuZnVuY3Rpb24gQmxlQ29udHJvbGxlcigkbWREaWFsb2cpe1xuXG5cdHRoaXMuc2xpZGVyQWN0aXYgPSBmYWxzZTtcblx0dGhpcy5jdXJyZW50VGltZXIgPSBudWxsO1xuXHR0aGlzLnBvd2VyID0gMTI1O1xuXHR0aGlzLnJlZCA9IDA7XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5zdG9wKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fSBcblxuXHR0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcIm9uXCIpO1xuXHR9XG5cblx0dGhpcy51cCA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRjb25zb2xlLmxvZyhcInVwXCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoLTEwMCwxMDApO1xuXHR9XG5cblx0dGhpcy5kb3duID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcImRvd25cIik7XG5cdFx0cHJvY2Vzc01vdG9ycygxMDAsLTEwMCk7XG5cdH1cblx0XG5cdHRoaXMubGVmdCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJsZWZ0XCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoMTAwLDEwMCk7XG5cdH07XG5cblx0dGhpcy5yaWdodCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJyaWdodFwiKTtcblx0XHRwcm9jZXNzTW90b3JzKC0xMDAsLTEwMCk7XG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcInN0b3BcIik7XG5cdFx0cHJvY2Vzc01vdG9ycygwLDApO1xuXHR9XG5cblx0dGhpcy5jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uKHJlZCxibHVlLGdyZWVuKXsgXG5cdFx0Y29uc29sZS5sb2coXCJDaGFuZ2UgQ29sb3IgOiAlZCwlZCwlZFwiLHJlZCxibHVlLGdyZWVuKVxuXHRcdGlmIChwaWNrZXIpe1xuXHRcdFx0dmFsdWVBcnJheVswXSA9IHBpY2tlci5yZ2JbMF07XG5cdFx0XHR2YWx1ZUFycmF5WzFdID0gcGlja2VyLnJnYlsxXTtcblx0XHRcdHZhbHVlQXJyYXlbMl0gPSBwaWNrZXIucmdiWzJdO1xuXHRcdH1cblx0XHR2YXIgckhleCA9IHZhbHVlQXJyYXlbMF08PDg7XG5cdFx0dmFyIGdIZXggPSB2YWx1ZUFycmF5WzFdPDwxNjtcblx0XHR2YXIgYkhleCA9IHZhbHVlQXJyYXlbMl08PDI0O1xuXHRcdHZhciB2YWx1ZSA9IHJIZXggfCBnSGV4IHwgYkhleDtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgbWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfUkdCLG1ib3RBcGkuUE9SVF82LDAsdmFsdWUpKTtcblx0XHQvL3Byb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcImJyaWdodDpcIit0aGlzLnBvd2VyKTtcblx0fTtcblxuXG59XG5cbkJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJ11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZUNvbnRyb2xsZXI7Lyp7XG5cdHdyaXRlRGF0YSA6IHByb2Nlc3NDaGFyYWN0ZXJpc3RpY1xufSovXG5cbiIsIid1c2Ugc3RyaWN0JztcblxubGV0IHNvY2tldCA9IG51bGw7XG5cbi8vIFRoZSBoYW5kbGVyXG52YXIgZGV2aWNlTGlnaHRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gVGhlIHZhbHVlIHdpbGwgbGl2ZSBiZXR3ZWVuIDAgYW5kIH4xNTBcblx0Ly8gQnV0IHdoZW4gaXQgaXMgNDUgaXMgYSBoaWdoIGx1bW9uc2l0eVxuXHR2YXIgdmFsdWUgPSBNYXRoLm1pbig0NSwgZXZlbnQudmFsdWUpOyAgICAgICAgXG5cdGxldCBwZXJjZW50ID0gTWF0aC5yb3VuZCgodmFsdWUgLyA0NSkgKiAxMDApOyAgICAgICBcblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnbGlnaHQnLCB2YWx1ZSA6IHBlcmNlbnR9KTtcbn1cblxuLy8gV2UgYWRkIHRoZSBsaXN0ZW5lclxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIExpZ2h0Q29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbkxpZ2h0Q29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodENvbnRyb2xlcjsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBzb2NrZXQgPSBudWxsLCBcblx0Zmlyc3RWYWx1ZSA9IC0xO1xuXG4vLyBUaGUgaGFuZGxlciBvZiB0aGUgZXZlbnRcbnZhciBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpeyAgICAgICAgXG5cdHZhciBhbHBoYSA9IE1hdGgucm91bmQoZXZlbnQuYWxwaGEpO1xuXHR2YXIgYmV0YSA9IE1hdGgucm91bmQoZXZlbnQuYmV0YSk7XG5cdHZhciBnYW1tYSA9IE1hdGgucm91bmQoZXZlbnQuZ2FtbWEpO1xuXHRpZiAoZmlyc3RWYWx1ZSA9PT0gLTEpe1xuXHRcdGZpcnN0VmFsdWUgPSBhbHBoYTtcblx0fVxuXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICdvcmllbnRhdGlvbicsIHZhbHVlIDogYWxwaGEsICdmaXJzdFZhbHVlJyA6IGZpcnN0VmFsdWV9KTtcdFxufVxuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXHRmaXJzdFZhbHVlID0gLTE7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIE9yaWVudGF0aW9uQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbk9yaWVudGF0aW9uQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yaWVudGF0aW9uQ29udHJvbGVyOyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbW9kZWwgPSBudWxsLFxuICAgIHNvY2tldCA9IG51bGw7XG5cbi8vIFRoZSBsaXN0ZW5lclxudmFyIGRldmljZVByb3hpbWl0eUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHR2YXIgdmFsdWUgPSBNYXRoLnJvdW5kKGV2ZW50LnZhbHVlKTsgICAgICAgIFxuXHRpZiAodmFsdWUgPT09IDApe1xuICAgICAgICBzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ3N0YXJ0J30pO1xuXHRcdC8qbGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XG5cdFx0bGV0IHNjaGVtZSA9IG1vZGVsLmlzU1NMKCkgID8gXCJodHRwc1wiIDogXCJodHRwXCI7XG5cdFx0d2luZG93LmxvY2F0aW9uID0gYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWw/c3BlZWNoI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLmNocm9taXVtLmNocm9tZTtlbmRgOyovXG5cdH0gICAgXG5cdC8vc29ja2V0LnNlbmRQcm94aW1pdHkodmFsdWUpO1xuXHQvL21hbmFnZVByb3hpbWl0eVZhbHVlKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXByb3hpbWl0eScsIGRldmljZVByb3hpbWl0eUhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlcHJveGltaXR5JywgZGV2aWNlUHJveGltaXR5SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBQcm94aW1pdHlDb250cm9sZXIoJG1kRGlhbG9nLCBNb2RlbFNlcnZpY2UsIFNvY2tldFNlcnZpY2Upe1xuXG5cdG1vZGVsID0gTW9kZWxTZXJ2aWNlO1xuICAgIHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdGlmICh3aW5kb3cuRGV2aWNlUHJveGltaXR5RXZlbnQpe1xuXG5cdFx0XHRyZWdpc3RlcigpO1xuXHRcdH1lbHNle1xuXHRcdFx0bGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XG5cdFx0XHRsZXQgc2NoZW1lID0gbW9kZWwuaXNTU0woKSAgPyBcImh0dHBzXCIgOiBcImh0dHBcIjtcblx0XHRcdC8vd2luZG93LmxvY2F0aW9uID0gYGludGVudDovLzEwLjMzLjQ0LjE4MTozMDAwL2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbD9wcm94aW1pdHkjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcubW96aWxsYS5maXJlZm94X2JldGE7ZW5kYDtcblx0XHR9XG5cdH1cblxuXHR0aGlzLmdvVG9DaHJvbWUgPSBmdW5jdGlvbigpe1xuXHRcdGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuXHRcdGxldCBzY2hlbWUgPSBtb2RlbC5pc1NTTCgpICA/IFwiaHR0cHNcIiA6IFwiaHR0cFwiO1xuXHRcdC8vd2luZG93LmxvY2F0aW9uID0gYGludGVudDovLzEwLjMzLjQ0LjE4MTozMDAwL2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0d2luZG93LmxvY2F0aW9uID0gYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWwjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcuY2hyb21pdW0uY2hyb21lO2FjdGlvbj1hbmRyb2lkLmludGVudC5hY3Rpb24uVklFVztsYXVuY2hGbGFncz0weDEwMDAwMDAwO2VuZGA7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5Qcm94aW1pdHlDb250cm9sZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ01vZGVsU2VydmljZScsICdTb2NrZXRTZXJ2aWNlJ107XG5cbm1vZHVsZS5leHBvcnRzID0gUHJveGltaXR5Q29udHJvbGVyOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNvY2tldCA9IG51bGwsXG4gIHZpZGVvRWxlbWVudCA9IG51bGwsXG4gIGNhbnZhcyA9IG51bGwsIFxuICB2aWRlb1NvdXJjZSA9IG51bGwsXG4gIHNlbGVjdG9ycyA9IG51bGw7XG5cbiBcblxuZnVuY3Rpb24gZ290RGV2aWNlcyhkZXZpY2VJbmZvcykge1xuICBkZXZpY2VJbmZvcy5mb3JFYWNoKGZ1bmN0aW9uKGRldmljZSl7XG4gICAgaWYgKGRldmljZS5raW5kID09PSAndmlkZW9pbnB1dCcgJiYgZGV2aWNlLmxhYmVsLmluZGV4T2YoJ2JhY2snKSAhPSAwKXtcbiAgICAgIHZpZGVvU291cmNlID0gZGV2aWNlLmRldmljZUlkO1xuICAgIH1cbiAgfSk7ICBcbn1cblxubmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzKClcbiAgLnRoZW4oZ290RGV2aWNlcylcbiAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVyci5uYW1lICsgXCI6IFwiICsgZXJyLm1lc3NhZ2UpO1xuICB9KTtcblxuZnVuY3Rpb24gc3RhcnQoKXtcbiAgaWYgKHdpbmRvdy5zdHJlYW0pIHtcbiAgICB3aW5kb3cuc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcbiAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICB9KTtcbiAgfVxuICB2YXIgY29uc3RyYWludHMgPSB7XG4gICAgYXVkaW8gOiBmYWxzZSxcbiAgICB2aWRlbzoge2RldmljZUlkOiB2aWRlb1NvdXJjZSA/IHtleGFjdDogdmlkZW9Tb3VyY2V9IDogdW5kZWZpbmVkfVxuICB9O1xuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cykudGhlbihzdWNjZXNzQ2FsbGJhY2spLmNhdGNoKGVycm9yQ2FsbGJhY2spO1xufVxuXG5cbmZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhzdHJlYW0pIHtcbiAgd2luZG93LnN0cmVhbSA9IHN0cmVhbTsgLy8gbWFrZSBzdHJlYW0gYXZhaWxhYmxlIHRvIGNvbnNvbGVcbiAgaWYgKCF2aWRlb0VsZW1lbnQpe1xuICAgIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlWaWRlb1wiKTtcbiAgICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Q2FudmFzXCIpO1xuICB9XG4gIHZpZGVvRWxlbWVudC5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pO1xuICB2aWRlb0VsZW1lbnQub25sb2FkZWRtZXRhZGF0YSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2aWRlb0VsZW1lbnQucGxheSgpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBlcnJvckNhbGxiYWNrKGVycm9yKXtcbiAgICBjb25zb2xlLmxvZyhcIm5hdmlnYXRvci5nZXRVc2VyTWVkaWEgZXJyb3I6IFwiLCBlcnJvcik7XG4gIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG4gICAgICBzdGFydCgpO1xuICAgICAgXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuICAgICAgaWYgKHZpZGVvRWxlbWVudCkge1xuICAgICAgICB2aWRlb0VsZW1lbnQucGF1c2UoKTtcbiAgICAgICAgdmlkZW9FbGVtZW50LnNyYyA9IG51bGw7XG4gICAgICB9XG4gICAgICAgICBcbiAgICB9XG5cbmZ1bmN0aW9uIENhbWVyYUN0cmwoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcbiAgc29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuICB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VmlkZW9cIik7XG4gIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDYW52YXNcIik7XG5cbiAgdGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuICAgIHJlZ2lzdGVyKCk7XG4gIH1cblxuICB0aGlzLnBob3RvID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvRWxlbWVudC52aWRlb1dpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB2aWRlb0VsZW1lbnQudmlkZW9IZWlnaHQ7XG4gICAgY29udGV4dC5kcmF3SW1hZ2UodmlkZW9FbGVtZW50LCAwLCAwLCB2aWRlb0VsZW1lbnQudmlkZW9XaWR0aCwgdmlkZW9FbGVtZW50LnZpZGVvSGVpZ2h0KTtcbiAgXG4gICAgdmFyIGRhdGEgPSBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd1c2VybWVkaWEnLCB2YWx1ZSA6IGRhdGF9KTsgICAgICBcbiAgICBcbiAgfVxuXG4gIHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgIHVucmVnaXN0ZXIoKTtcbiAgICAkbWREaWFsb2cuaGlkZSgpO1xuICB9XG59XG5cbkNhbWVyYUN0cmwuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ1NvY2tldFNlcnZpY2UnXVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYUN0cmw7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzb2NrZXQgPSBudWxsO1xudmFyIFNwZWVjaFJlY29nbml0aW9uID0gU3BlZWNoUmVjb2duaXRpb24gfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25cbnZhciBTcGVlY2hHcmFtbWFyTGlzdCA9IFNwZWVjaEdyYW1tYXJMaXN0IHx8IHdlYmtpdFNwZWVjaEdyYW1tYXJMaXN0XG52YXIgU3BlZWNoUmVjb2duaXRpb25FdmVudCA9IFNwZWVjaFJlY29nbml0aW9uRXZlbnQgfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25FdmVudFxuXG4vL3ZhciBncmFtbWFyID0gJyNKU0dGIFYxLjA7IGdyYW1tYXIgY29sb3JzOyBwdWJsaWMgPGNvbG9yPiA9IGFxdWEgfCBhenVyZSB8IGJlaWdlIHwgYmlzcXVlIHwgYmxhY2sgfCBibHVlIHwgYnJvd24gfCBjaG9jb2xhdGUgfCBjb3JhbCB8IGNyaW1zb24gfCBjeWFuIHwgZnVjaHNpYSB8IGdob3N0d2hpdGUgfCBnb2xkIHwgZ29sZGVucm9kIHwgZ3JheSB8IGdyZWVuIHwgaW5kaWdvIHwgaXZvcnkgfCBraGFraSB8IGxhdmVuZGVyIHwgbGltZSB8IGxpbmVuIHwgbWFnZW50YSB8IG1hcm9vbiB8IG1vY2Nhc2luIHwgbmF2eSB8IG9saXZlIHwgb3JhbmdlIHwgb3JjaGlkIHwgcGVydSB8IHBpbmsgfCBwbHVtIHwgcHVycGxlIHwgcmVkIHwgc2FsbW9uIHwgc2llbm5hIHwgc2lsdmVyIHwgc25vdyB8IHRhbiB8IHRlYWwgfCB0aGlzdGxlIHwgdG9tYXRvIHwgdHVycXVvaXNlIHwgdmlvbGV0IHwgd2hpdGUgfCB5ZWxsb3cgOydcbnZhciByZWNvZ25pdGlvbiA9IG5ldyBTcGVlY2hSZWNvZ25pdGlvbigpO1xuLy92YXIgc3BlZWNoUmVjb2duaXRpb25MaXN0ID0gbmV3IFNwZWVjaEdyYW1tYXJMaXN0KCk7XG4vL3NwZWVjaFJlY29nbml0aW9uTGlzdC5hZGRGcm9tU3RyaW5nKGdyYW1tYXIsIDEpO1xuLy9yZWNvZ25pdGlvbi5ncmFtbWFycyA9IHNwZWVjaFJlY29nbml0aW9uTGlzdDtcbnJlY29nbml0aW9uLmNvbnRpbnVvdXMgPSB0cnVlO1xucmVjb2duaXRpb24ubGFuZyA9ICdmci1GUic7XG5yZWNvZ25pdGlvbi5pbnRlcmltUmVzdWx0cyA9IHRydWU7XG4vL3JlY29nbml0aW9uLm1heEFsdGVybmF0aXZlcyA9IDE7XG5cbi8vdmFyIGRpYWdub3N0aWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3V0cHV0Jyk7XG4vL3ZhciBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuZG9jdW1lbnQuYm9keS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gIHJlY29nbml0aW9uLnN0YXJ0KCk7XG4gIGNvbnNvbGUubG9nKCdSZWFkeSB0byByZWNlaXZlIGEgY29sb3IgY29tbWFuZC4nKTtcbn1cblxucmVjb2duaXRpb24ub25yZXN1bHQgPSBmdW5jdGlvbihldmVudCkge1xuICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25FdmVudCByZXN1bHRzIHByb3BlcnR5IHJldHVybnMgYSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0XG4gIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdHMuXG4gIC8vIEl0IGhhcyBhIGdldHRlciBzbyBpdCBjYW4gYmUgYWNjZXNzZWQgbGlrZSBhbiBhcnJheVxuICAvLyBUaGUgZmlyc3QgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IGF0IHBvc2l0aW9uIDAuXG4gIC8vIEVhY2ggU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0cyB0aGF0IGNvbnRhaW4gaW5kaXZpZHVhbCByZXN1bHRzLlxuICAvLyBUaGVzZSBhbHNvIGhhdmUgZ2V0dGVycyBzbyB0aGV5IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFycmF5cy5cbiAgLy8gVGhlIHNlY29uZCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBhdCBwb3NpdGlvbiAwLlxuICAvLyBXZSB0aGVuIHJldHVybiB0aGUgdHJhbnNjcmlwdCBwcm9wZXJ0eSBvZiB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3QgXG4gIHZhciBmaW5hbFN0ciA9IGV2ZW50LnJlc3VsdHNbMF1bMF0udHJhbnNjcmlwdDtcbiAgLy9kaWFnbm9zdGljLnRleHRDb250ZW50ID0gJ1Jlc3VsdCByZWNlaXZlZDogJyArIGNvbG9yICsgJy4nO1xuICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICBjb25zb2xlLmxvZygnQ29uZmlkZW5jZTogJyArIGZpbmFsU3RyKTtcbiAgaWYgKGZpbmFsU3RyLmluZGV4T2YoJ3N1aXZhbnQnKSAhPSAtMSl7XG4gIFx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICduZXh0J30pO1xuICB9ZWxzZSBpZiAoZmluYWxTdHIuaW5kZXhPZigncHLDqWPDqWRlbnQnKSAhPSAtMSl7XG4gIFx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICdwcmV2J30pO1xuICB9XG59XG5cbi8vIFdlIGRldGVjdCB0aGUgZW5kIG9mIHNwZWVjaFJlY29nbml0aW9uIHByb2Nlc3NcbiAgICAgIHJlY29nbml0aW9uLm9uZW5kID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJ0VuZCBvZiByZWNvZ25pdGlvbicpXG4gICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFdlIGRldGVjdCBlcnJvcnNcbiAgICAgIHJlY29nbml0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vLXNwZWVjaCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gU3BlZWNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmVycm9yID09ICdhdWRpby1jYXB0dXJlJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBtaWNyb3Bob25lJylcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vdC1hbGxvd2VkJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3QgQWxsb3dlZCcpO1xuICAgICAgICB9XG4gICAgICB9OyAgICAgXG5cblxuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0cmVjb2duaXRpb24uc3RvcCgpO1xufVxuXG5cbmZ1bmN0aW9uIFZvaWNlQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHRyZWNvZ25pdGlvbi5zdGFydCgpO1xuXHRcblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuXG5Wb2ljZUNvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gVm9pY2VDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzb2NrZXQgPSBudWxsO1xuXG5mdW5jdGlvbiBTb2NrZXRTZXJ2aWNlKCl7XG5cblx0dGhpcy5jb25uZWN0ID0gZnVuY3Rpb24obW9kZWwpe1xuXG5cdFx0bW9kZWwuY2hlY2tBZGRyZXNzKClcblx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0bGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRJb0FkZHJlc3MoKTtcblx0XHRcdGxldCBwcm90b2NvbCA9IG1vZGVsLmlzU1NMKCkgPyAnaHR0cHMnIDogJ2h0dHAnO1xuXHRcdFx0c29ja2V0ID0gaW8oYCR7cHJvdG9jb2x9Oi8vJHthZGRyZXNzfWApO1xuXHRcdH0pO1xuXHR9XG5cdHRoaXMuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xuXHRcdHNvY2tldC5lbWl0KCdzZW5zb3InLCBtc2cpO1xuXHR9XG5cblx0dGhpcy5nZXRTb2NrZXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBzb2NrZXQ7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldFNlcnZpY2U7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBhZGRyZXNzID0gbnVsbCxcblx0aW9BZGRyZXNzID0gbnVsbCxcblx0c3NsID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUFkZHJlc3MoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKGFkZHJlc3Mpe1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0XHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuXHQgICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcblx0ICAgICAgICAgICBtb2RlOiAnY29ycycsXG5cdCAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuXHQgICAgbGV0IHByb3RvY29sID0gJyc7XG5cdCAgICBsZXQgc2NoZW1lID0gJydcblx0ICAgIGxldCBiYXNpY0hvc3QgPSAnJ1xuXHQgICAgaWYgKGxvY2F0aW9uLmhvc3QgJiYgbG9jYXRpb24uaG9zdC5pbmRleE9mKCdsb2NhbGhvc3QnKSA9PT0gLTEpe1xuXHQgICAgXHRwcm90b2NvbCA9ICdodHRwcyc7XG5cdCAgICBcdHNjaGVtZSA9ICc6Ly8nO1xuXHQgICAgXHRiYXNpY0hvc3QgPSAnYmlub21lZC5mcjo4MDAwJztcblx0ICAgIH1cblxuXHRcdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtwcm90b2NvbH0ke3NjaGVtZX0ke2Jhc2ljSG9zdH0vaXBgLG15SW5pdCk7XG5cdFx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihqc29uKXtcblx0XHRcdGxldCBuZXR3b3JrID0ganNvbjtcblxuXHRcdFx0aWYgKGxvY2F0aW9uLnBvcnQgJiYgKGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiKSl7XG5cdFx0XHRcdGxldCB3bGFuMCA9IG5ldHdvcmsuZmluZChmdW5jdGlvbihlbGVtZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudC5uYW1lID09PSAnd2xhbjAnO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKHdsYW4wKXtcblx0XHRcdFx0XHRhZGRyZXNzID0gYCR7d2xhbjAuaXB9OjMwMDBgO1xuXHRcdFx0XHRcdGlvQWRkcmVzcyA9IGAke3dsYW4wLmlwfTo4MDAwYDtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0YWRkcmVzcyA9IFwibG9jYWxob3N0OjMwMDBcIjtcblx0XHRcdFx0XHRpb0FkZHJlc3MgPSBcImxvY2FsaG9zdDo4MDAwXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiODAwMFwiKXtcblx0XHRcdFx0YWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHRcdGlvQWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHRcdHNzbCA9IHRydWU7XG5cdFx0XHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCI4MFwiIHx8IGxvY2F0aW9uLnBvcnQgPT09IFwiXCIpKXtcblx0XHRcdFx0YWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHRcdGlvQWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0YWRkcmVzcyA9IG51bGw7XG5cdFx0XHR9IFxuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuY2FsY3VsYXRlQWRkcmVzcygpO1xuXG5cbmZ1bmN0aW9uIE1vZGVsU2VydmljZSgpe1xuXG5cdHRoaXMuaXNTU0wgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBzc2w7XG5cdH1cblxuXHR0aGlzLmdldEFkZHJlc3MgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBhZGRyZXNzO1xuXHR9XHRcblxuXHR0aGlzLmdldElvQWRkcmVzcyA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGlvQWRkcmVzcztcblx0fVxuXG5cdHRoaXMuY2hlY2tBZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcztcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsU2VydmljZTsiXX0=
