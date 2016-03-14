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

var model = null;

// The listener
var deviceProximityHandler = function(event) {
	var value = Math.round(event.value);        
	if (value === 0){
		let address = model.getAddress();
		let scheme = model.isSSL()  ? "https" : "http";
		window.location = `intent://${address}/addon/index_app.html?speech#Intent;scheme=${scheme};package=org.chromium.chrome;end`;
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

ProximityControler.$inject = ['$mdDialog', 'ModelService'];

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9tYm90L21ib3QuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZWN1cmUvc2VjdXJlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9ibHVldG9vdGguanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlbnNvcnMvcHJveGltaXR5LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL3ZvaWNlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc29ja2V0L3NvY2tldHMuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC91dGlsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuYW5ndWxhci5tb2R1bGUoXCJTdXBlclBvd2VyQXBwXCIsIFsnbmdNYXRlcmlhbCddKVxuLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAucHJpbWFyeVBhbGV0dGUoJ3JlZCcpXG4gICAgLmFjY2VudFBhbGV0dGUoJ29yYW5nZScpO1xufSlcbi5zZXJ2aWNlKCdTb2NrZXRTZXJ2aWNlJywgcmVxdWlyZSgnLi9zb2NrZXQvc29ja2V0cycpKVxuLnNlcnZpY2UoJ01vZGVsU2VydmljZScsIHJlcXVpcmUoJy4vdXRpbC9tb2RlbCcpKVxuLmRpcmVjdGl2ZSgnamZUb3VjaHN0YXJ0JywgW2Z1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuXG4gICAgICAgIGVsZW1lbnQub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHIuamZUb3VjaHN0YXJ0KTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1dKS5kaXJlY3RpdmUoJ2pmVG91Y2hlbmQnLCBbZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG5cbiAgICAgICAgZWxlbWVudC5vbigndG91Y2hlbmQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHIuamZUb3VjaGVuZCk7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XSlcbi5kaXJlY3RpdmUoJ2pmQ29sb3JwaWNrZXInLCBbZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKXtcblx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0aW1nLnNyYyA9ICcuL2Fzc2V0cy9pbWFnZXMvY29sb3Itd2hlZWwucG5nJ1xuXHRcdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHQgIHZhciBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblx0XHQgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cblx0XHQgIGNhbnZhcy53aWR0aCA9IDE1MCAqIGRldmljZVBpeGVsUmF0aW87XG5cdFx0ICBjYW52YXMuaGVpZ2h0ID0gMTUwICogZGV2aWNlUGl4ZWxSYXRpbztcblx0XHQgIGNhbnZhcy5zdHlsZS53aWR0aCA9IFwiMTUwcHhcIjtcblx0XHQgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBcIjE1MHB4XCI7XG5cdFx0ICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldnQpIHtcblx0XHQgICAgLy8gUmVmcmVzaCBjYW52YXMgaW4gY2FzZSB1c2VyIHpvb21zIGFuZCBkZXZpY2VQaXhlbFJhdGlvIGNoYW5nZXMuXG5cdFx0ICAgIGNhbnZhcy53aWR0aCA9IDE1MCAqIGRldmljZVBpeGVsUmF0aW87XG5cdFx0ICAgIGNhbnZhcy5oZWlnaHQgPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuXHRcdCAgICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cblx0XHQgICAgdmFyIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0ICAgIHZhciB4ID0gTWF0aC5yb3VuZCgoZXZ0LmNsaWVudFggLSByZWN0LmxlZnQpICogZGV2aWNlUGl4ZWxSYXRpbyk7XG5cdFx0ICAgIHZhciB5ID0gTWF0aC5yb3VuZCgoZXZ0LmNsaWVudFkgLSByZWN0LnRvcCkgKiBkZXZpY2VQaXhlbFJhdGlvKTtcblx0XHQgICAgdmFyIGRhdGEgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpLmRhdGE7XG5cblx0XHQgICAgdmFyIHIgPSBkYXRhWygoY2FudmFzLndpZHRoICogeSkgKyB4KSAqIDRdO1xuXHRcdCAgICB2YXIgZyA9IGRhdGFbKChjYW52YXMud2lkdGggKiB5KSArIHgpICogNCArIDFdO1xuXHRcdCAgICB2YXIgYiA9IGRhdGFbKChjYW52YXMud2lkdGggKiB5KSArIHgpICogNCArIDJdO1xuXHRcdCAgICBcblx0XHQgICAgc2NvcGUuJGV2YWwoYXR0ci5qZkNvbG9ycGlja2VyLCB7XG5cdFx0ICAgIFx0cmVkOnIsXG5cdFx0ICAgIFx0Ymx1ZTpiLFxuXHRcdCAgICBcdGdyZWVuOmdcblx0XHQgICAgfSk7IFxuXHRcdCAgICBcblxuXHRcdCAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdCAgICBjb250ZXh0LmFyYyh4LCB5ICsgMiwgMTAgKiBkZXZpY2VQaXhlbFJhdGlvLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdCAgICBjb250ZXh0LnNoYWRvd0NvbG9yID0gJyMzMzMnO1xuXHRcdCAgICBjb250ZXh0LnNoYWRvd0JsdXIgPSA0ICogZGV2aWNlUGl4ZWxSYXRpbztcblx0XHQgICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdCAgICBjb250ZXh0LmZpbGwoKTtcblx0XHQgIH0pO1xuXG5cdFx0ICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cdFx0fVxuXHR9O1xufV0pXG4uZGlyZWN0aXZlKCdhcHAnLCBbJyRtZERpYWxvZycsICckdGltZW91dCcsICdTb2NrZXRTZXJ2aWNlJywgJ01vZGVsU2VydmljZScsXG5cdGZ1bmN0aW9uKCRtZERpYWxvZywgJHRpbWVvdXQsIFNvY2tldFNlcnZpY2UsIE1vZGVsU2VydmljZSl7XG5cblx0XHRTb2NrZXRTZXJ2aWNlLmNvbm5lY3QoTW9kZWxTZXJ2aWNlKTtcblxuXHRyZXR1cm4ge1xuXHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2FwcC5odG1sJyxcblx0XHRjb250cm9sbGVyQXMgOiAnYXBwJyxcblx0XHRiaW5kVG9Db250cm9sbGVyIDogdHJ1ZSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5hY3Rpb25zID0gW1xuXHRcdFx0XHR7bGFiZWwgOiBcIkJsdWV0b290aFwiLCBpY29uIDogJ2ZhLWJsdWV0b290aCcsIGlkQWN0aW9uOiAnYmxlJ30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiTGlnaHRcIiwgaWNvbiA6ICdmYS1saWdodGJ1bGItbycsIGlkQWN0aW9uOiAnbGlnaHQnfSxcblx0XHRcdFx0e2xhYmVsIDogXCJPcmllbnRhdGlvblwiLCBpY29uIDogJ2ZhLWNvbXBhc3MnLCBpZEFjdGlvbjogJ29yaWVudGF0aW9uJ30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiVXNlck1lZGlhXCIsIGljb24gOiAnZmEtY2FtZXJhJywgaWRBY3Rpb246ICdjYW1lcmEnfSxcblx0XHRcdFx0e2xhYmVsIDogXCJQcm94aW1pdHlcIiwgaWNvbiA6ICdmYS1yc3MnLCBpZEFjdGlvbjogJ3Byb3hpbWl0eSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlZvaWNlXCIsIGljb24gOiAnZmEtbWljcm9waG9uZScsIGlkQWN0aW9uOiAnbWljJ31cblx0XHRcdF07XG5cblx0XHRcdFxuXHRcdFx0XG5cblx0XHRcdGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoID09PSAnP3Byb3hpbWl0eScpe1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3Byb3hpbWl0eUN0cmwnLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3Byb3hpbWl0eS5odG1sJyxcblx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvcHJveGltaXR5JyksXG5cdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2UgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPT09ICc/c3BlZWNoJyl7XG5cdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAndm9pY2VDdHJsJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy92b2ljZS5odG1sJyxcblx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvdm9pY2UnKSxcblx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdzZWN1cmVDdHJsJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9zZWN1cmUuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZShcIi4vc2VjdXJlL3NlY3VyZVwiKSxcblx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0Ly90YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm9wZW5EaWFsb2cgPSBmdW5jdGlvbihldmVudCwgdHlwZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdPcGVuIERpYWxvZycpO1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2JsZScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdibGVDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2JsdWV0b290aC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9ibHVldG9vdGgnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ2xpZ2h0Jyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2xpZ2h0Q3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9saWdodC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9saWdodCcpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnb3JpZW50YXRpb24nKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnb3JpZW50YXRpb25DdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL29yaWVudGF0aW9uLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL29yaWVudGF0aW9uJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdtaWMnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAndm9pY2VDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3ZvaWNlLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3ZvaWNlJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdwcm94aW1pdHknKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAncHJveGltaXR5Q3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9wcm94aW1pdHkuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvcHJveGltaXR5JyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdjYW1lcmEnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnY2FtZXJhQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy91c2VybWVkaWEuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvdXNlcm1lZGlhJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufV0pO1xuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkKCl7XHRcblx0Ly9yZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJyk7XG59XG5cblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTsiLCIndXNlIHN0cmljdCdcblxuY29uc3QgREVWSUNFX05BTUUgPSBcIk1ha2VibG9ja19MRVwiLFxuXHRTRVJWSUNFX1VVSUQgPSBcIjAwMDBmZmUxLTAwMDAtMTAwMC04MDAwLTAwODA1ZjliMzRmYlwiLFxuXHRDSEFSQUNURVJJU1RJQ19VVUlEID0gXCIwMDAwZmZlMy0wMDAwLTEwMDAtODAwMC0wMDgwNWY5YjM0ZmJcIjtcblxuY29uc3QgVFlQRV9NT1RPUiA9IDB4MGEsXG5cdFRZUEVfUkdCID0gMHgwOCxcblx0VFlQRV9TT1VORCA9IDB4MDc7XG5cblxuY29uc3QgUE9SVF8xID0gMHgwMSxcblx0UE9SVF8yID0gMHgwMixcblx0UE9SVF8zID0gMHgwMyxcblx0UE9SVF80ID0gMHgwNCxcblx0UE9SVF81ID0gMHgwNSxcblx0UE9SVF82ID0gMHgwNixcblx0UE9SVF83ID0gMHgwNyxcblx0UE9SVF84ID0gMHgwOCxcblx0TV8xID0gMHgwOSxcblx0TV8yID0gMHgwYTtcblxuZnVuY3Rpb24gZ2VuZXJpY0NvbnRyb2wodHlwZSwgcG9ydCwgc2xvdCwgdmFsdWUpe1xuXHQvKlxuXHRmZiA1NSBsZW4gaWR4IGFjdGlvbiBkZXZpY2UgcG9ydCAgc2xvdCAgZGF0YSBhXG5cdDAgIDEgIDIgICAzICAgNCAgICAgIDUgICAgICA2ICAgICA3ICAgICA4XG5cdCovXG5cdC8vdW5zaWduZWQgY2hhciBhWzExXT17MHhmZiwweDU1LFdSSVRFTU9EVUxFLDcsMCwwLDAsMCwwLDAsJ1xcbid9O1xuICAgIC8vYVs0XSA9IFt0eXBlIGludFZhbHVlXTtcbiAgICAvL2FbNV0gPSAocG9ydDw8NCAmIDB4ZjApfChzbG90ICYgMHhmKTtcbiAgICAvLyBTdGF0aWMgdmFsdWVzXG5cdHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMTYpO1xuXHR2YXIgYnVmVmlldyA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuXHRcblx0dmFyIGJ5dGUwID0gMHhmZixcblx0XHRieXRlMSA9IDB4NTUsXG5cdFx0Ynl0ZTIgPSAweDA5LFxuXHRcdGJ5dGUzID0gMHgwMCxcblx0XHRieXRlNCA9IDB4MDIsXG5cdFx0Ynl0ZTUgPSB0eXBlLFxuXHRcdGJ5dGU2ID0gcG9ydCxcblx0XHRieXRlNyA9IHNsb3Q7XG5cdC8vZHluYW1pY3MgdmFsdWVzXG5cdHZhciBieXRlOCA9IDB4MDAsXG5cdFx0Ynl0ZTkgPSAweDAwLFxuXHRcdGJ5dGUxMCA9IDB4MDAsXG5cdFx0Ynl0ZTExID0gMHgwMDtcblx0Ly9FbmQgb2YgbWVzc2FnZVxuXHR2YXIgYnl0ZTEyID0gMHgwYSxcblx0XHRieXRlMTMgPSAweDAwLFxuXHRcdGJ5dGUxNCA9IDB4MDAsXG5cdFx0Ynl0ZTE1ID0gMHgwMDtcblxuXHRzd2l0Y2godHlwZSl7XG5cdFx0Y2FzZSBUWVBFX01PVE9SOlxuXHRcdFx0Ly8gTW90b3IgTTFcblx0XHRcdC8vIGZmOjU1ICAwOTowMCAgMDI6MGEgIDA5OjY0ICAwMDowMCAgMDA6MDAgIDBhXCJcblx0XHRcdC8vIDB4NTVmZjsweDAwMDk7MHgwYTAyOzB4MDk2NDsweDAwMDA7MHgwMDAwOzB4MDAwYTsweDAwMDA7XG5cdFx0XHQvL1wiZmY6NTU6MDk6MDA6MDI6MGE6MDk6MDA6MDA6MDA6MDA6MDA6MGFcIlxuXHRcdFx0Ly8gZmY6NTU6MDk6MDA6MDI6MGE6MDk6OWM6ZmY6MDA6MDA6MDA6MGFcblx0XHRcdC8vIE1vdG9yIE0yXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowYTo2NDowMDowMDowMDowMDowYVxuXHRcdFx0Ly8gZmY6NTU6MDk6MDA6MDI6MGE6MGE6MDA6MDA6MDA6MDA6MDA6MGFcblx0XHRcdC8vIGZmOjU1OjA5OjAwOjAyOjBhOjBhOjljOmZmOjAwOjAwOjAwOjBhXG5cdFx0XHR2YXIgdGVtcFZhbHVlID0gdmFsdWUgPCAwID8gKHBhcnNlSW50KFwiZmZmZlwiLDE2KSArIE1hdGgubWF4KC0yNTUsdmFsdWUpKSA6IE1hdGgubWluKDI1NSwgdmFsdWUpO1xuXHRcdFx0Ynl0ZTcgPSB0ZW1wVmFsdWUgJiAweDAwZmY7XHRcdFx0XG5cdFx0XHRieXRlOCA9IDB4MDA7XG5cdFx0XHRieXRlOCA9IHRlbXBWYWx1ZSA+Pjg7IFxuXG5cdFx0XHQvKmJ5dGU1ID0gMHgwYTtcblx0XHRcdGJ5dGU2ID0gMHgwOTtcblx0XHRcdGJ5dGU3ID0gMHg2NDtcblx0XHRcdGJ5dGU4ID0gMHgwMDsqL1xuXHRcdFx0XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBUWVBFX1JHQjpcblx0XHRcdC8vIGZmOjU1ICAwOTowMCAgMDI6MDggIDA2OjAwICA1Yzo5OSAgNmQ6MDAgIDBhXG5cdFx0XHQvLyAweDU1ZmY7MHgwMDA5OzB4MDgwMjsweDAwMDY7MHg5OTVjOzB4MDA2ZDsweDAwMGE7MHgwMDAwO1xuXHRcdFx0Ynl0ZTcgPSAweDAwO1xuXHRcdFx0Ynl0ZTggPSB2YWx1ZT4+OCAmIDB4ZmY7XG5cdFx0XHRieXRlOSA9IHZhbHVlPj4xNiAmIDB4ZmY7XG5cdFx0XHRieXRlMTAgPSB2YWx1ZT4+MjQgJiAweGZmO1xuXHRcdGJyZWFrO1xuXHRcdGNhc2UgVFlQRV9TT1VORDpcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MDA6MDA6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MDY6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6ZWU6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6ODg6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6Yjg6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6NWQ6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6NGE6MDE6MGFcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MjY6MDE6MGFcblx0XHRcdGJ5dGUzID0gMHgwNTtcblx0XHRcdGJ5dGU0ID0gMHgwMDtcblx0XHRcdGJ5dGU1ID0gMHgwMjtcblx0XHRcdGJ5dGU2ID0gMHgyMjtcblx0XHRcdGlmICh2YWx1ZSA9PT0gMCl7XG5cdFx0XHRcdGJ5dGU3ID0gMHgwMDtcblx0XHRcdFx0Ynl0ZTggPSAweDAwO1xuXHRcdFx0fWVsc2V7XG5cblx0XHRcdFx0Ynl0ZTcgPSAweGVlO1xuXHRcdFx0XHRieXRlOCA9IDB4MDE7XG5cdFx0XHR9XG5cdFx0XHRieXRlOSA9IDB4MGE7XG5cdFx0XHRieXRlMTI9IDB4MDA7XG5cblx0XHRicmVhaztcblx0fVxuXG5cdGJ1ZlZpZXdbMF0gPSBieXRlMTw8OCB8IGJ5dGUwO1xuXHRidWZWaWV3WzFdID0gYnl0ZTM8PDggfCBieXRlMjtcblx0YnVmVmlld1syXSA9IGJ5dGU1PDw4IHwgYnl0ZTQ7XG5cdGJ1ZlZpZXdbM10gPSBieXRlNzw8OCB8IGJ5dGU2O1xuXHRidWZWaWV3WzRdID0gYnl0ZTk8PDggfCBieXRlODtcblx0YnVmVmlld1s1XSA9IGJ5dGUxMTw8OCB8IGJ5dGUxMDtcblx0YnVmVmlld1s2XSA9IGJ5dGUxMzw8OCB8IGJ5dGUxMjtcblx0YnVmVmlld1s3XSA9IGJ5dGUxNTw8OCB8IGJ5dGUxNDtcblx0Y29uc29sZS5sb2coXG5cdFx0XHRieXRlMC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMi50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMy50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNi50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlNy50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlOC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlOS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTAudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTExLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxMi50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTMudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTE0LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxNS50b1N0cmluZygxNikrXCI6XCJcblx0XHRcdCk7XG5cdGNvbnNvbGUubG9nKFxuXHRcdFx0YnVmVmlld1swXS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzFdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbMl0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1szXS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzRdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbNV0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1s2XS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzddLnRvU3RyaW5nKDE2KVxuXHRcdFx0KTtcblx0cmV0dXJuIGJ1Zjtcbn1cblxuXG5tb2R1bGUuZXB4b3J0cyA9IHtcblx0J0RFVklDRV9OQU1FJyA6IERFVklDRV9OQU1FLFxuXHQnU0VSVklDRV9VVUlEJyA6IFNFUlZJQ0VfVVVJRCxcblx0J0NIQVJBQ1RFUklTVElDX1VVSUQnIDogQ0hBUkFDVEVSSVNUSUNfVVVJRCxcblx0J1RZUEVfTU9UT1InIDogVFlQRV9NT1RPUixcblx0J1RZUEVfUkdCJyA6IFRZUEVfUkdCLFxuXHQnVFlQRV9TT1VORCcgOiBUWVBFX1NPVU5ELFxuXHQnUE9SVF8xJyA6IFBPUlRfMSxcblx0J1BPUlRfMicgOiBQT1JUXzIsXG5cdCdQT1JUXzMnIDogUE9SVF8zLFxuXHQnUE9SVF80JyA6IFBPUlRfNCxcblx0J1BPUlRfNScgOiBQT1JUXzUsXG5cdCdQT1JUXzYnIDogUE9SVF82LFxuXHQnUE9SVF83JyA6IFBPUlRfNyxcblx0J1BPUlRfOCcgOiBQT1JUXzgsXG5cdCdNXzEnIDogTV8xLFxuXHQnTV8yJyA6IE1fMixcblx0Z2VuZXJpY0NvbnRyb2wgOiBnZW5lcmljQ29udHJvbFxufTsiLCIndXNlIHN0cmljdCdcblxudmFyIG1vZGVsID0gbnVsbCxcblx0c29ja2V0ID0gbnVsbDtcblxuXG5cbmZ1bmN0aW9uIGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIHB3ZCl7XG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICBoZWFkZXJzOiBteUhlYWRlcnMsXG4gICAgICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuICAgIGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuICAgIGxldCBwcm90b2NvbCA9IG1vZGVsLmlzU1NMKCkgPyAnaHR0cHMnIDogJ2h0dHAnO1xuXG5cdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtwcm90b2NvbH06Ly8ke2FkZHJlc3N9L3Bhc3N3b3JkLyR7cHdkfWAsbXlJbml0KTtcblx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XG5cdFx0Ly8gT24gbmUgcmV0cmFpcmUgcGFzIHVuZSBxdWVzdGlvbiBkw6lqw6AgdHJhaXTDqWVcblx0XHRpZiAoanNvbi5hdXRoKXtcblx0XHRcdGxvY2FsU3RvcmFnZVsncHdkJ10gPSBwd2Q7XG5cdFx0XHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe1xuXHRcdFx0XHR0eXBlOiAnYmxlJyxcblx0XHRcdFx0YWN0aW9uOiAnc3RvcFBoeXNpY2FsV2ViJ1xuXHRcdFx0fSlcblx0XHRcdGlmIChsb2NhdGlvbi5zZWFyY2ggPT09IFwiXCIpe1xuXHRcdFx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0Y29udGV4dC5ub3R2YWxpZCA9IHRydWU7XG5cdFx0fVxuXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIFNlY3VyZUN0cmwoJG1kRGlhbG9nLCBNb2RlbFNlcnZpY2UsIFNvY2tldFNlcnZpY2Upe1xuXHRcblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblx0bW9kZWwgPSBNb2RlbFNlcnZpY2U7XG5cdHRoaXMubm90dmFsaWQgPSBmYWxzZTtcblx0bGV0IGNvbnRleHQgPSB0aGlzO1xuXG5cdG1vZGVsLmNoZWNrQWRkcmVzcygpXG5cdC50aGVuKGZ1bmN0aW9uKCl7XHRcdFxuXHRcdGlmIChsb2NhbFN0b3JhZ2VbJ3B3ZCddKXtcblx0XHRcdGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIGxvY2FsU3RvcmFnZVsncHdkJ10pO1xuXHRcdH1cblx0fSlcblxuXHR0aGlzLnRyeSA9IGZ1bmN0aW9uKCl7XG5cdFx0ZG9SZXF1ZXN0KCRtZERpYWxvZywgY29udGV4dCwgY29udGV4dC5wd2QpO1xuXHR9XG5cblxufVxuXG5TZWN1cmVDdHJsLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdNb2RlbFNlcnZpY2UnLCAnU29ja2V0U2VydmljZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlY3VyZUN0cmw7IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IG1ib3RBcGkgPSByZXF1aXJlKCcuLi9tYm90L21ib3QnKTsgIFxuXG5mdW5jdGlvbiBhYjJzdHIoYnVmKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50MTZBcnJheShidWYpKTtcbn1cblxuZnVuY3Rpb24gc3RyMmFiKHN0cikge1xuICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgZm9yIGVhY2ggY2hhclxuICB2YXIgYnVmVmlldyA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuICBmb3IgKHZhciBpPTAsIHN0ckxlbj1zdHIubGVuZ3RoOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICBidWZWaWV3W2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxudmFyIHNlcnZlckdBVFQgPSBudWxsLFxuXHRzZXJ2aWNlR0FUVCA9IG51bGwsXG5cdGNoYXJhY3RlcmlzdGljR0FUVCA9IG51bGwsXG5cdGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcblxuZnVuY3Rpb24gaW5pdEJsZSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2UoeyBcblx0XHRcdGZpbHRlcnM6IFt7IG5hbWU6IG1ib3RBcGkuREVWSUNFX05BTUUgfV0sIG9wdGlvbmFsU2VydmljZXM6IFttYm90QXBpLlNFUlZJQ0VfVVVJRF1cblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGRldmljZSkge1xuXHRcdCAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGluZy4uLlwiKTtcblx0XHQgICByZXR1cm4gZGV2aWNlLmNvbm5lY3RHQVRUKCk7XG5cdFx0IH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cdFx0XHRzZXJ2ZXJHQVRUID0gc2VydmVyO1xuXHRcdFx0Ly9yZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHNlcnZpY2VVVUlEKTtcblx0XHQgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgdGltZW91dCB3aGVuIEdhdHRTZXJ2aWNlcyBwcm9wZXJ0eSB3b3JrcyBhcyBpbnRlbmRlZC5cblx0XHQgICAvLyBjcmJ1Zy5jb20vNTYwMjc3XG5cdFx0ICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmVTZXJ2aWNlLCByZWplY3RTZXJ2aWNlKSB7XG5cdFx0ICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgXHR0cnl7XG5cdFx0ICAgICBcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IFNlcnZpY2VcIik7XG5cdFx0ICAgICAgIFx0XHRyZXNvbHZlU2VydmljZShzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UobWJvdEFwaS5TRVJWSUNFX1VVSUQpKTtcblx0XHQgICAgIFx0fWNhdGNoKGVycil7XG5cdFx0ICAgICBcdFx0cmVqZWN0U2VydmljZShlcnIpO1xuXHRcdCAgICAgXHR9XG5cdFx0ICAgICB9LCAyZTMpO1xuXHRcdCAgIH0pXG5cdFx0fSkudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdHNlcnZpY2VHQVRUID0gc2VydmljZTtcblx0XHRcdHJlc29sdmUoc2VydmljZSk7XHRcdFx0XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHR9KVxufVxuXG5cbmZ1bmN0aW9uIGdldFNlcnZpY2UoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKHNlcnZlckdBVFQgJiYgc2VydmVyR0FUVC5jb25uZWN0ZWQgJiYgc2VydmljZUdBVFQpe1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpbml0QmxlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDaGFyYWN0ZXJpc3RpYygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoY2hhcmFjdGVyaXN0aWNHQVRUKXtcblx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXN0aWNHQVRUKTtcblx0XHR9ZWxzZXtcblx0XHRcdGdldFNlcnZpY2UoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBDaGFyYWN0ZXJpdGljIDogJU9cIixzZXJ2aWNlKTtcblx0XHRcdFx0cmV0dXJuIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMobWJvdEFwaS5DSEFSQUNURVJJU1RJQ19VVUlEKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbihjaGFyYWN0ZXJpdGljKXtcblx0XHRcdFx0Y2hhcmFjdGVyaXN0aWNHQVRUID0gY2hhcmFjdGVyaXRpYztcblx0XHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpdGljKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDaGFyYWN0ZXJpc3RpYyh0eXBlLCBkYXRhLCBjYWxsYmFjayl7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXN0aWMpe1xuXHRcdGlmICh0eXBlID09PSAnd3JpdGUnKXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHdyaXRlIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShlbmNvZGVyLmVuY29kZShkYXRhKSk7XG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcil7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1xuXHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmluZm8oXCJXcml0ZSBkYXRhcyAhIFwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBkYXRhID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG5cdFx0ICAgIGxldCBkYXRhRGVjcnlwdCA9IGRhdGEuZ2V0VWludDgoMCk7XG5cdFx0ICAgIGNhbGxiYWNrKHt0eXBlOiAncmVhZCcgLCB2YWx1ZSA6IGRhdGFEZWNyeXB0fSk7XG5cdFx0ICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlRGF0YXMgJXMnLCBkYXRhRGVjcnlwdCk7XG5cdFx0fVxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0aWYgKGNhbGxiYWNrKSB7XG5cblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NNb3RvcnModmFsdWVNMSwgdmFsdWVNMil7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oY2hhcmFjdGVyaXN0aWMgPT57XG5cdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8xLCAwLCB2YWx1ZU0xKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWNHQVRULndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8yLCAwLCB2YWx1ZU0yKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0fVxuXHRcdGNvbnNvbGUuaW5mbyhcIldyaXRlIGRhdGFzICEgXCIpO1xuXHR9KS5jYXRjaChlcnJvciA9Pntcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cblxuZnVuY3Rpb24gQmxlQ29udHJvbGxlcigkbWREaWFsb2cpe1xuXG5cdHRoaXMuc2xpZGVyQWN0aXYgPSBmYWxzZTtcblx0dGhpcy5jdXJyZW50VGltZXIgPSBudWxsO1xuXHR0aGlzLnBvd2VyID0gMTI1O1xuXHR0aGlzLnJlZCA9IDA7XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5zdG9wKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fSBcblxuXHR0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcIm9uXCIpO1xuXHR9XG5cblx0dGhpcy51cCA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRjb25zb2xlLmxvZyhcInVwXCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoLTEwMCwxMDApO1xuXHR9XG5cblx0dGhpcy5kb3duID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcImRvd25cIik7XG5cdFx0cHJvY2Vzc01vdG9ycygxMDAsLTEwMCk7XG5cdH1cblx0XG5cdHRoaXMubGVmdCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJsZWZ0XCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoMTAwLDEwMCk7XG5cdH07XG5cblx0dGhpcy5yaWdodCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJyaWdodFwiKTtcblx0XHRwcm9jZXNzTW90b3JzKC0xMDAsLTEwMCk7XG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcInN0b3BcIik7XG5cdFx0cHJvY2Vzc01vdG9ycygwLDApO1xuXHR9XG5cblx0dGhpcy5jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uKHJlZCxibHVlLGdyZWVuKXsgXG5cdFx0Y29uc29sZS5sb2coXCJDaGFuZ2UgQ29sb3IgOiAlZCwlZCwlZFwiLHJlZCxibHVlLGdyZWVuKVxuXHRcdGlmIChwaWNrZXIpe1xuXHRcdFx0dmFsdWVBcnJheVswXSA9IHBpY2tlci5yZ2JbMF07XG5cdFx0XHR2YWx1ZUFycmF5WzFdID0gcGlja2VyLnJnYlsxXTtcblx0XHRcdHZhbHVlQXJyYXlbMl0gPSBwaWNrZXIucmdiWzJdO1xuXHRcdH1cblx0XHR2YXIgckhleCA9IHZhbHVlQXJyYXlbMF08PDg7XG5cdFx0dmFyIGdIZXggPSB2YWx1ZUFycmF5WzFdPDwxNjtcblx0XHR2YXIgYkhleCA9IHZhbHVlQXJyYXlbMl08PDI0O1xuXHRcdHZhciB2YWx1ZSA9IHJIZXggfCBnSGV4IHwgYkhleDtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgbWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfUkdCLG1ib3RBcGkuUE9SVF82LDAsdmFsdWUpKTtcblx0XHQvL3Byb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcImJyaWdodDpcIit0aGlzLnBvd2VyKTtcblx0fTtcblxuXG59XG5cbkJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJ11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZUNvbnRyb2xsZXI7Lyp7XG5cdHdyaXRlRGF0YSA6IHByb2Nlc3NDaGFyYWN0ZXJpc3RpY1xufSovXG5cbiIsIid1c2Ugc3RyaWN0JztcblxubGV0IHNvY2tldCA9IG51bGw7XG5cbi8vIFRoZSBoYW5kbGVyXG52YXIgZGV2aWNlTGlnaHRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gVGhlIHZhbHVlIHdpbGwgbGl2ZSBiZXR3ZWVuIDAgYW5kIH4xNTBcblx0Ly8gQnV0IHdoZW4gaXQgaXMgNDUgaXMgYSBoaWdoIGx1bW9uc2l0eVxuXHR2YXIgdmFsdWUgPSBNYXRoLm1pbig0NSwgZXZlbnQudmFsdWUpOyAgICAgICAgXG5cdGxldCBwZXJjZW50ID0gTWF0aC5yb3VuZCgodmFsdWUgLyA0NSkgKiAxMDApOyAgICAgICBcblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnbGlnaHQnLCB2YWx1ZSA6IHBlcmNlbnR9KTtcbn1cblxuLy8gV2UgYWRkIHRoZSBsaXN0ZW5lclxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIExpZ2h0Q29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbkxpZ2h0Q29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodENvbnRyb2xlcjsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBzb2NrZXQgPSBudWxsLCBcblx0Zmlyc3RWYWx1ZSA9IC0xO1xuXG4vLyBUaGUgaGFuZGxlciBvZiB0aGUgZXZlbnRcbnZhciBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpeyAgICAgICAgXG5cdHZhciBhbHBoYSA9IE1hdGgucm91bmQoZXZlbnQuYWxwaGEpO1xuXHR2YXIgYmV0YSA9IE1hdGgucm91bmQoZXZlbnQuYmV0YSk7XG5cdHZhciBnYW1tYSA9IE1hdGgucm91bmQoZXZlbnQuZ2FtbWEpO1xuXHRpZiAoZmlyc3RWYWx1ZSA9PT0gLTEpe1xuXHRcdGZpcnN0VmFsdWUgPSBhbHBoYTtcblx0fVxuXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICdvcmllbnRhdGlvbicsIHZhbHVlIDogYWxwaGEsICdmaXJzdFZhbHVlJyA6IGZpcnN0VmFsdWV9KTtcdFxufVxuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXHRmaXJzdFZhbHVlID0gLTE7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIE9yaWVudGF0aW9uQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbk9yaWVudGF0aW9uQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yaWVudGF0aW9uQ29udHJvbGVyOyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbW9kZWwgPSBudWxsO1xuXG4vLyBUaGUgbGlzdGVuZXJcbnZhciBkZXZpY2VQcm94aW1pdHlIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0dmFyIHZhbHVlID0gTWF0aC5yb3VuZChldmVudC52YWx1ZSk7ICAgICAgICBcblx0aWYgKHZhbHVlID09PSAwKXtcblx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcblx0XHRsZXQgc2NoZW1lID0gbW9kZWwuaXNTU0woKSAgPyBcImh0dHBzXCIgOiBcImh0dHBcIjtcblx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbD9zcGVlY2gjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcuY2hyb21pdW0uY2hyb21lO2VuZGA7XG5cdH0gICAgXG5cdC8vc29ja2V0LnNlbmRQcm94aW1pdHkodmFsdWUpO1xuXHQvL21hbmFnZVByb3hpbWl0eVZhbHVlKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXByb3hpbWl0eScsIGRldmljZVByb3hpbWl0eUhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlcHJveGltaXR5JywgZGV2aWNlUHJveGltaXR5SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBQcm94aW1pdHlDb250cm9sZXIoJG1kRGlhbG9nLCBNb2RlbFNlcnZpY2Upe1xuXG5cdG1vZGVsID0gTW9kZWxTZXJ2aWNlO1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRpZiAod2luZG93LkRldmljZVByb3hpbWl0eUV2ZW50KXtcblxuXHRcdFx0cmVnaXN0ZXIoKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuXHRcdFx0bGV0IHNjaGVtZSA9IG1vZGVsLmlzU1NMKCkgID8gXCJodHRwc1wiIDogXCJodHRwXCI7XG5cdFx0XHQvL3dpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8xMC4zMy40NC4xODE6MzAwMC9hZGRvbi9pbmRleF9hcHAuaHRtbCNJbnRlbnQ7c2NoZW1lPSR7c2NoZW1lfTtwYWNrYWdlPW9yZy5tb3ppbGxhLmZpcmVmb3hfYmV0YTtlbmRgO1xuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWw/cHJveGltaXR5I0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5nb1RvQ2hyb21lID0gZnVuY3Rpb24oKXtcblx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcblx0XHRsZXQgc2NoZW1lID0gbW9kZWwuaXNTU0woKSAgPyBcImh0dHBzXCIgOiBcImh0dHBcIjtcblx0XHQvL3dpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8xMC4zMy40NC4xODE6MzAwMC9hZGRvbi9pbmRleF9hcHAuaHRtbCNJbnRlbnQ7c2NoZW1lPSR7c2NoZW1lfTtwYWNrYWdlPW9yZy5tb3ppbGxhLmZpcmVmb3hfYmV0YTtlbmRgO1xuXHRcdHdpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8ke2FkZHJlc3N9L2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLmNocm9taXVtLmNocm9tZTthY3Rpb249YW5kcm9pZC5pbnRlbnQuYWN0aW9uLlZJRVc7bGF1bmNoRmxhZ3M9MHgxMDAwMDAwMDtlbmRgO1xuXHR9XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuUHJveGltaXR5Q29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdNb2RlbFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm94aW1pdHlDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc29ja2V0ID0gbnVsbCxcbiAgdmlkZW9FbGVtZW50ID0gbnVsbCxcbiAgY2FudmFzID0gbnVsbCwgXG4gIHZpZGVvU291cmNlID0gbnVsbCxcbiAgc2VsZWN0b3JzID0gbnVsbDtcblxuIFxuXG5mdW5jdGlvbiBnb3REZXZpY2VzKGRldmljZUluZm9zKSB7XG4gIGRldmljZUluZm9zLmZvckVhY2goZnVuY3Rpb24oZGV2aWNlKXtcbiAgICBpZiAoZGV2aWNlLmtpbmQgPT09ICd2aWRlb2lucHV0JyAmJiBkZXZpY2UubGFiZWwuaW5kZXhPZignYmFjaycpICE9IDApe1xuICAgICAgdmlkZW9Tb3VyY2UgPSBkZXZpY2UuZGV2aWNlSWQ7XG4gICAgfVxuICB9KTsgIFxufVxuXG5uYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMoKVxuICAudGhlbihnb3REZXZpY2VzKVxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyLm5hbWUgKyBcIjogXCIgKyBlcnIubWVzc2FnZSk7XG4gIH0pO1xuXG5mdW5jdGlvbiBzdGFydCgpe1xuICBpZiAod2luZG93LnN0cmVhbSkge1xuICAgIHdpbmRvdy5zdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICB9XG4gIHZhciBjb25zdHJhaW50cyA9IHtcbiAgICBhdWRpbyA6IGZhbHNlLFxuICAgIHZpZGVvOiB7ZGV2aWNlSWQ6IHZpZGVvU291cmNlID8ge2V4YWN0OiB2aWRlb1NvdXJjZX0gOiB1bmRlZmluZWR9XG4gIH07XG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKS50aGVuKHN1Y2Nlc3NDYWxsYmFjaykuY2F0Y2goZXJyb3JDYWxsYmFjayk7XG59XG5cblxuZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHN0cmVhbSkge1xuICB3aW5kb3cuc3RyZWFtID0gc3RyZWFtOyAvLyBtYWtlIHN0cmVhbSBhdmFpbGFibGUgdG8gY29uc29sZVxuICBpZiAoIXZpZGVvRWxlbWVudCl7XG4gICAgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVZpZGVvXCIpO1xuICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDYW52YXNcIik7XG4gIH1cbiAgdmlkZW9FbGVtZW50LnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XG4gIHZpZGVvRWxlbWVudC5vbmxvYWRlZG1ldGFkYXRhID0gZnVuY3Rpb24oZSkge1xuICAgIHZpZGVvRWxlbWVudC5wbGF5KCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVycm9yQ2FsbGJhY2soZXJyb3Ipe1xuICAgIGNvbnNvbGUubG9nKFwibmF2aWdhdG9yLmdldFVzZXJNZWRpYSBlcnJvcjogXCIsIGVycm9yKTtcbiAgfVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXIoKXtcbiAgICAgIHN0YXJ0KCk7XG4gICAgICBcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG4gICAgICBpZiAodmlkZW9FbGVtZW50KSB7XG4gICAgICAgIHZpZGVvRWxlbWVudC5wYXVzZSgpO1xuICAgICAgICB2aWRlb0VsZW1lbnQuc3JjID0gbnVsbDtcbiAgICAgIH1cbiAgICAgICAgIFxuICAgIH1cblxuZnVuY3Rpb24gQ2FtZXJhQ3RybCgkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xuICBzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG4gIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlWaWRlb1wiKTtcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcblxuICB0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmVnaXN0ZXIoKTtcbiAgfVxuXG4gIHRoaXMucGhvdG8gPSBmdW5jdGlvbigpe1xuICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY2FudmFzLndpZHRoID0gdmlkZW9FbGVtZW50LnZpZGVvV2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHZpZGVvRWxlbWVudC52aWRlb0hlaWdodDtcbiAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlb0VsZW1lbnQsIDAsIDAsIHZpZGVvRWxlbWVudC52aWRlb1dpZHRoLCB2aWRlb0VsZW1lbnQudmlkZW9IZWlnaHQpO1xuICBcbiAgICB2YXIgZGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ3VzZXJtZWRpYScsIHZhbHVlIDogZGF0YX0pOyAgICAgIFxuICAgIFxuICB9XG5cbiAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgdW5yZWdpc3RlcigpO1xuICAgICRtZERpYWxvZy5oaWRlKCk7XG4gIH1cbn1cblxuQ2FtZXJhQ3RybC4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhQ3RybDsiLCIndXNlIHN0cmljdCdcblxudmFyIHNvY2tldCA9IG51bGw7XG52YXIgU3BlZWNoUmVjb2duaXRpb24gPSBTcGVlY2hSZWNvZ25pdGlvbiB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvblxudmFyIFNwZWVjaEdyYW1tYXJMaXN0ID0gU3BlZWNoR3JhbW1hckxpc3QgfHwgd2Via2l0U3BlZWNoR3JhbW1hckxpc3RcbnZhciBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50ID0gU3BlZWNoUmVjb2duaXRpb25FdmVudCB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvbkV2ZW50XG5cbi8vdmFyIGdyYW1tYXIgPSAnI0pTR0YgVjEuMDsgZ3JhbW1hciBjb2xvcnM7IHB1YmxpYyA8Y29sb3I+ID0gYXF1YSB8IGF6dXJlIHwgYmVpZ2UgfCBiaXNxdWUgfCBibGFjayB8IGJsdWUgfCBicm93biB8IGNob2NvbGF0ZSB8IGNvcmFsIHwgY3JpbXNvbiB8IGN5YW4gfCBmdWNoc2lhIHwgZ2hvc3R3aGl0ZSB8IGdvbGQgfCBnb2xkZW5yb2QgfCBncmF5IHwgZ3JlZW4gfCBpbmRpZ28gfCBpdm9yeSB8IGtoYWtpIHwgbGF2ZW5kZXIgfCBsaW1lIHwgbGluZW4gfCBtYWdlbnRhIHwgbWFyb29uIHwgbW9jY2FzaW4gfCBuYXZ5IHwgb2xpdmUgfCBvcmFuZ2UgfCBvcmNoaWQgfCBwZXJ1IHwgcGluayB8IHBsdW0gfCBwdXJwbGUgfCByZWQgfCBzYWxtb24gfCBzaWVubmEgfCBzaWx2ZXIgfCBzbm93IHwgdGFuIHwgdGVhbCB8IHRoaXN0bGUgfCB0b21hdG8gfCB0dXJxdW9pc2UgfCB2aW9sZXQgfCB3aGl0ZSB8IHllbGxvdyA7J1xudmFyIHJlY29nbml0aW9uID0gbmV3IFNwZWVjaFJlY29nbml0aW9uKCk7XG4vL3ZhciBzcGVlY2hSZWNvZ25pdGlvbkxpc3QgPSBuZXcgU3BlZWNoR3JhbW1hckxpc3QoKTtcbi8vc3BlZWNoUmVjb2duaXRpb25MaXN0LmFkZEZyb21TdHJpbmcoZ3JhbW1hciwgMSk7XG4vL3JlY29nbml0aW9uLmdyYW1tYXJzID0gc3BlZWNoUmVjb2duaXRpb25MaXN0O1xucmVjb2duaXRpb24uY29udGludW91cyA9IHRydWU7XG5yZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcbnJlY29nbml0aW9uLmludGVyaW1SZXN1bHRzID0gdHJ1ZTtcbi8vcmVjb2duaXRpb24ubWF4QWx0ZXJuYXRpdmVzID0gMTtcblxuLy92YXIgZGlhZ25vc3RpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdXRwdXQnKTtcbi8vdmFyIGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG5kb2N1bWVudC5ib2R5Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgcmVjb2duaXRpb24uc3RhcnQoKTtcbiAgY29uc29sZS5sb2coJ1JlYWR5IHRvIHJlY2VpdmUgYSBjb2xvciBjb21tYW5kLicpO1xufVxuXG5yZWNvZ25pdGlvbi5vbnJlc3VsdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHJlc3VsdHMgcHJvcGVydHkgcmV0dXJucyBhIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3RcbiAgLy8gVGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0cy5cbiAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XG4gIC8vIFRoZSBmaXJzdCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgYXQgcG9zaXRpb24gMC5cbiAgLy8gRWFjaCBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3RzIHRoYXQgY29udGFpbiBpbmRpdmlkdWFsIHJlc3VsdHMuXG4gIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxuICAvLyBUaGUgc2Vjb25kIFswXSByZXR1cm5zIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIGF0IHBvc2l0aW9uIDAuXG4gIC8vIFdlIHRoZW4gcmV0dXJuIHRoZSB0cmFuc2NyaXB0IHByb3BlcnR5IG9mIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIG9iamVjdCBcbiAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xuICAvL2RpYWdub3N0aWMudGV4dENvbnRlbnQgPSAnUmVzdWx0IHJlY2VpdmVkOiAnICsgY29sb3IgKyAnLic7XG4gIC8vYmcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XG4gIGNvbnNvbGUubG9nKCdDb25maWRlbmNlOiAnICsgZmluYWxTdHIpO1xuICBpZiAoZmluYWxTdHIuaW5kZXhPZignc3VpdmFudCcpICE9IC0xKXtcbiAgXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ25leHQnfSk7XG4gIH1lbHNlIGlmIChmaW5hbFN0ci5pbmRleE9mKCdwcsOpY8OpZGVudCcpICE9IC0xKXtcbiAgXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ3ByZXYnfSk7XG4gIH1cbn1cblxuLy8gV2UgZGV0ZWN0IHRoZSBlbmQgb2Ygc3BlZWNoUmVjb2duaXRpb24gcHJvY2Vzc1xuICAgICAgcmVjb2duaXRpb24ub25lbmQgPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygnRW5kIG9mIHJlY29nbml0aW9uJylcbiAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgICAgfTtcblxuICAgICAgLy8gV2UgZGV0ZWN0IGVycm9yc1xuICAgICAgcmVjb2duaXRpb24ub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5lcnJvciA9PSAnbm8tc3BlZWNoJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBTcGVlY2gnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ2F1ZGlvLWNhcHR1cmUnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vIG1pY3JvcGhvbmUnKVxuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5lcnJvciA9PSAnbm90LWFsbG93ZWQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdCBBbGxvd2VkJyk7XG4gICAgICAgIH1cbiAgICAgIH07ICAgICBcblxuXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHRyZWNvZ25pdGlvbi5zdG9wKCk7XG59XG5cblxuZnVuY3Rpb24gVm9pY2VDb250cm9sZXIoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcblxuXHRzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG5cdHJlY29nbml0aW9uLnN0YXJ0KCk7XG5cdFxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5cblZvaWNlQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxubW9kdWxlLmV4cG9ydHMgPSBWb2ljZUNvbnRyb2xlcjsiLCIndXNlIHN0cmljdCdcblxudmFyIHNvY2tldCA9IG51bGw7XG5cbmZ1bmN0aW9uIFNvY2tldFNlcnZpY2UoKXtcblxuXHR0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbihtb2RlbCl7XG5cblx0XHRtb2RlbC5jaGVja0FkZHJlc3MoKVxuXHRcdC50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldElvQWRkcmVzcygpO1xuXHRcdFx0bGV0IHByb3RvY29sID0gbW9kZWwuaXNTU0woKSA/ICdodHRwcycgOiAnaHR0cCc7XG5cdFx0XHRzb2NrZXQgPSBpbyhgJHtwcm90b2NvbH06Ly8ke2FkZHJlc3N9YCk7XG5cdFx0fSk7XG5cdH1cblx0dGhpcy5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZyl7XG5cdFx0c29ja2V0LmVtaXQoJ3NlbnNvcicsIG1zZyk7XG5cdH1cblxuXHR0aGlzLmdldFNvY2tldCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHNvY2tldDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ja2V0U2VydmljZTsiLCIndXNlIHN0cmljdCdcblxudmFyIGFkZHJlc3MgPSBudWxsLFxuXHRpb0FkZHJlc3MgPSBudWxsLFxuXHRzc2wgPSBmYWxzZTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoYWRkcmVzcyl7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRcdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG5cdCAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuXHQgICAgICAgICAgIG1vZGU6ICdjb3JzJyxcblx0ICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG5cdCAgICBsZXQgcHJvdG9jb2wgPSAnJztcblx0ICAgIGxldCBzY2hlbWUgPSAnJ1xuXHQgICAgbGV0IGJhc2ljSG9zdCA9ICcnXG5cdCAgICBpZiAobG9jYXRpb24uaG9zdCAmJiBsb2NhdGlvbi5ob3N0LmluZGV4T2YoJ2xvY2FsaG9zdCcpID09PSAtMSl7XG5cdCAgICBcdHByb3RvY29sID0gJ2h0dHBzJztcblx0ICAgIFx0c2NoZW1lID0gJzovLyc7XG5cdCAgICBcdGJhc2ljSG9zdCA9ICdiaW5vbWVkLmZyOjgwMDAnO1xuXHQgICAgfVxuXG5cdFx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke3Byb3RvY29sfSR7c2NoZW1lfSR7YmFzaWNIb3N0fS9pcGAsbXlJbml0KTtcblx0XHRmZXRjaChteVJlcXVlc3QpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdFx0bGV0IG5ldHdvcmsgPSBqc29uO1xuXG5cdFx0XHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRcdFx0bGV0IHdsYW4wID0gbmV0d29yay5maW5kKGZ1bmN0aW9uKGVsZW1lbnQpe1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50Lm5hbWUgPT09ICd3bGFuMCc7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAod2xhbjApe1xuXHRcdFx0XHRcdGFkZHJlc3MgPSBgJHt3bGFuMC5pcH06MzAwMGA7XG5cdFx0XHRcdFx0aW9BZGRyZXNzID0gYCR7d2xhbjAuaXB9OjgwMDBgO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRhZGRyZXNzID0gXCJsb2NhbGhvc3Q6MzAwMFwiO1xuXHRcdFx0XHRcdGlvQWRkcmVzcyA9IFwibG9jYWxob3N0OjgwMDBcIjtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCI4MDAwXCIpe1xuXHRcdFx0XHRhZGRyZXNzID0gXCJiaW5vbWVkLmZyOjgwMDBcIjtcblx0XHRcdFx0aW9BZGRyZXNzID0gXCJiaW5vbWVkLmZyOjgwMDBcIjtcblx0XHRcdFx0c3NsID0gdHJ1ZTtcblx0XHRcdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIChsb2NhdGlvbi5wb3J0ID09PSBcIjgwXCIgfHwgbG9jYXRpb24ucG9ydCA9PT0gXCJcIikpe1xuXHRcdFx0XHRhZGRyZXNzID0gXCJiaW5vbWVkLmZyOjgwMDBcIjtcblx0XHRcdFx0aW9BZGRyZXNzID0gXCJiaW5vbWVkLmZyOjgwMDBcIjtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRhZGRyZXNzID0gbnVsbDtcblx0XHRcdH0gXG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5jYWxjdWxhdGVBZGRyZXNzKCk7XG5cblxuZnVuY3Rpb24gTW9kZWxTZXJ2aWNlKCl7XG5cblx0dGhpcy5pc1NTTCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHNzbDtcblx0fVxuXG5cdHRoaXMuZ2V0QWRkcmVzcyA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGFkZHJlc3M7XG5cdH1cdFxuXG5cdHRoaXMuZ2V0SW9BZGRyZXNzID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gaW9BZGRyZXNzO1xuXHR9XG5cblx0dGhpcy5jaGVja0FkZHJlc3MgPSBjYWxjdWxhdGVBZGRyZXNzO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxTZXJ2aWNlOyJdfQ==
