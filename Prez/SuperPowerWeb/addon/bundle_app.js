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
			byte2 = 0x05;
			byte3 = 0x00;
			byte4 = 0x02;
			byte5 = 0x22;
			if (value === 0){
				byte6 = 0x00;
				byte7 = 0x00;
			}else{

				byte6 = 0xee;
				byte7 = 0x01;
			}
			byte8 = 0x0a;
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


module.exports = {
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
	'genericControl' : genericControl
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
			return characteristic.writeValue(data);
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
		console.log("Change Color : %d,%d,%d",red,green,blue);
		var rHex = red<<8;
		var gHex = green<<16;
		var bHex = blue<<24;
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
				if (wlan0 && location.hostname != 'localhost'){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9tYm90L21ib3QuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZWN1cmUvc2VjdXJlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9ibHVldG9vdGguanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlbnNvcnMvcHJveGltaXR5LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL3ZvaWNlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc29ja2V0L3NvY2tldHMuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC91dGlsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXIubW9kdWxlKFwiU3VwZXJQb3dlckFwcFwiLCBbJ25nTWF0ZXJpYWwnXSlcbi5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG4gICAgLnByaW1hcnlQYWxldHRlKCdyZWQnKVxuICAgIC5hY2NlbnRQYWxldHRlKCdvcmFuZ2UnKTtcbn0pXG4uc2VydmljZSgnU29ja2V0U2VydmljZScsIHJlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKSlcbi5zZXJ2aWNlKCdNb2RlbFNlcnZpY2UnLCByZXF1aXJlKCcuL3V0aWwvbW9kZWwnKSlcbi5kaXJlY3RpdmUoJ2pmVG91Y2hzdGFydCcsIFtmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcblxuICAgICAgICBlbGVtZW50Lm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbChhdHRyLmpmVG91Y2hzdGFydCk7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XSkuZGlyZWN0aXZlKCdqZlRvdWNoZW5kJywgW2Z1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuXG4gICAgICAgIGVsZW1lbnQub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbChhdHRyLmpmVG91Y2hlbmQpOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufV0pXG4uZGlyZWN0aXZlKCdqZkNvbG9ycGlja2VyJywgW2Z1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cil7XG5cdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdGltZy5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL2NvbG9yLXdoZWVsLnBuZydcblx0XHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0ICB2YXIgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG5cdFx0ICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0ICBjYW52YXMud2lkdGggPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuXHRcdCAgY2FudmFzLmhlaWdodCA9IDE1MCAqIGRldmljZVBpeGVsUmF0aW87XG5cdFx0ICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjE1MHB4XCI7XG5cdFx0ICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxNTBweFwiO1xuXHRcdCAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0ICAgIC8vIFJlZnJlc2ggY2FudmFzIGluIGNhc2UgdXNlciB6b29tcyBhbmQgZGV2aWNlUGl4ZWxSYXRpbyBjaGFuZ2VzLlxuXHRcdCAgICBjYW52YXMud2lkdGggPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuXHRcdCAgICBjYW52YXMuaGVpZ2h0ID0gMTUwICogZGV2aWNlUGl4ZWxSYXRpbztcblx0XHQgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG5cdFx0ICAgIHZhciByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdCAgICB2YXIgeCA9IE1hdGgucm91bmQoKGV2dC5jbGllbnRYIC0gcmVjdC5sZWZ0KSAqIGRldmljZVBpeGVsUmF0aW8pO1xuXHRcdCAgICB2YXIgeSA9IE1hdGgucm91bmQoKGV2dC5jbGllbnRZIC0gcmVjdC50b3ApICogZGV2aWNlUGl4ZWxSYXRpbyk7XG5cdFx0ICAgIHZhciBkYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KS5kYXRhO1xuXG5cdFx0ICAgIHZhciByID0gZGF0YVsoKGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0XTtcblx0XHQgICAgdmFyIGcgPSBkYXRhWygoY2FudmFzLndpZHRoICogeSkgKyB4KSAqIDQgKyAxXTtcblx0XHQgICAgdmFyIGIgPSBkYXRhWygoY2FudmFzLndpZHRoICogeSkgKyB4KSAqIDQgKyAyXTtcblx0XHQgICAgXG5cdFx0ICAgIHNjb3BlLiRldmFsKGF0dHIuamZDb2xvcnBpY2tlciwge1xuXHRcdCAgICBcdHJlZDpyLFxuXHRcdCAgICBcdGJsdWU6Yixcblx0XHQgICAgXHRncmVlbjpnXG5cdFx0ICAgIH0pOyBcblx0XHQgICAgXG5cblx0XHQgICAgY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHQgICAgY29udGV4dC5hcmMoeCwgeSArIDIsIDEwICogZGV2aWNlUGl4ZWxSYXRpbywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcblx0XHQgICAgY29udGV4dC5zaGFkb3dDb2xvciA9ICcjMzMzJztcblx0XHQgICAgY29udGV4dC5zaGFkb3dCbHVyID0gNCAqIGRldmljZVBpeGVsUmF0aW87XG5cdFx0ICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHQgICAgY29udGV4dC5maWxsKCk7XG5cdFx0ICB9KTtcblxuXHRcdCAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdH1cblx0fTtcbn1dKVxuLmRpcmVjdGl2ZSgnYXBwJywgWyckbWREaWFsb2cnLCAnJHRpbWVvdXQnLCAnU29ja2V0U2VydmljZScsICdNb2RlbFNlcnZpY2UnLFxuXHRmdW5jdGlvbigkbWREaWFsb2csICR0aW1lb3V0LCBTb2NrZXRTZXJ2aWNlLCBNb2RlbFNlcnZpY2Upe1xuXG5cdFx0U29ja2V0U2VydmljZS5jb25uZWN0KE1vZGVsU2VydmljZSk7XG5cblx0cmV0dXJuIHtcblx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9hcHAuaHRtbCcsXG5cdFx0Y29udHJvbGxlckFzIDogJ2FwcCcsXG5cdFx0YmluZFRvQ29udHJvbGxlciA6IHRydWUsXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuYWN0aW9ucyA9IFtcblx0XHRcdFx0e2xhYmVsIDogXCJCbHVldG9vdGhcIiwgaWNvbiA6ICdmYS1ibHVldG9vdGgnLCBpZEFjdGlvbjogJ2JsZSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIkxpZ2h0XCIsIGljb24gOiAnZmEtbGlnaHRidWxiLW8nLCBpZEFjdGlvbjogJ2xpZ2h0J30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiT3JpZW50YXRpb25cIiwgaWNvbiA6ICdmYS1jb21wYXNzJywgaWRBY3Rpb246ICdvcmllbnRhdGlvbid9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlVzZXJNZWRpYVwiLCBpY29uIDogJ2ZhLWNhbWVyYScsIGlkQWN0aW9uOiAnY2FtZXJhJ30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiUHJveGltaXR5XCIsIGljb24gOiAnZmEtcnNzJywgaWRBY3Rpb246ICdwcm94aW1pdHknfSxcblx0XHRcdFx0e2xhYmVsIDogXCJWb2ljZVwiLCBpY29uIDogJ2ZhLW1pY3JvcGhvbmUnLCBpZEFjdGlvbjogJ21pYyd9XG5cdFx0XHRdO1xuXG5cdFx0XHRcblx0XHRcdFxuXG5cdFx0XHRpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gJz9wcm94aW1pdHknKXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdwcm94aW1pdHlDdHJsJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9wcm94aW1pdHkuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3Byb3hpbWl0eScpLFxuXHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3NlY3VyZUN0cmwnLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3NlY3VyZS5odG1sJyxcblx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKFwiLi9zZWN1cmUvc2VjdXJlXCIpLFxuXHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHQvL3RhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3BlbkRpYWxvZyA9IGZ1bmN0aW9uKGV2ZW50LCB0eXBlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ09wZW4gRGlhbG9nJyk7XG5cdFx0XHRcdGlmICh0eXBlID09PSAnYmxlJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2JsZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvYmx1ZXRvb3RoLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL2JsdWV0b290aCcpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnbGlnaHQnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnbGlnaHRDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2xpZ2h0Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL2xpZ2h0JyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdvcmllbnRhdGlvbicpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdvcmllbnRhdGlvbkN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvb3JpZW50YXRpb24uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvb3JpZW50YXRpb24nKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ21pYycpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICd2b2ljZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvdm9pY2UuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvdm9pY2UnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ3Byb3hpbWl0eScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdwcm94aW1pdHlDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3Byb3hpbWl0eS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9wcm94aW1pdHknKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ2NhbWVyYScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdjYW1lcmFDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3VzZXJtZWRpYS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy91c2VybWVkaWEnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XSk7XG5cblxuZnVuY3Rpb24gcGFnZUxvYWQoKXtcdFxuXHQvL3JlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKTtcbn1cblxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpOyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBERVZJQ0VfTkFNRSA9IFwiTWFrZWJsb2NrX0xFXCIsXG5cdFNFUlZJQ0VfVVVJRCA9IFwiMDAwMGZmZTEtMDAwMC0xMDAwLTgwMDAtMDA4MDVmOWIzNGZiXCIsXG5cdENIQVJBQ1RFUklTVElDX1VVSUQgPSBcIjAwMDBmZmUzLTAwMDAtMTAwMC04MDAwLTAwODA1ZjliMzRmYlwiO1xuXG5jb25zdCBUWVBFX01PVE9SID0gMHgwYSxcblx0VFlQRV9SR0IgPSAweDA4LFxuXHRUWVBFX1NPVU5EID0gMHgwNztcblxuXG5jb25zdCBQT1JUXzEgPSAweDAxLFxuXHRQT1JUXzIgPSAweDAyLFxuXHRQT1JUXzMgPSAweDAzLFxuXHRQT1JUXzQgPSAweDA0LFxuXHRQT1JUXzUgPSAweDA1LFxuXHRQT1JUXzYgPSAweDA2LFxuXHRQT1JUXzcgPSAweDA3LFxuXHRQT1JUXzggPSAweDA4LFxuXHRNXzEgPSAweDA5LFxuXHRNXzIgPSAweDBhO1xuXG5mdW5jdGlvbiBnZW5lcmljQ29udHJvbCh0eXBlLCBwb3J0LCBzbG90LCB2YWx1ZSl7XG5cdC8qXG5cdGZmIDU1IGxlbiBpZHggYWN0aW9uIGRldmljZSBwb3J0ICBzbG90ICBkYXRhIGFcblx0MCAgMSAgMiAgIDMgICA0ICAgICAgNSAgICAgIDYgICAgIDcgICAgIDhcblx0Ki9cblx0Ly91bnNpZ25lZCBjaGFyIGFbMTFdPXsweGZmLDB4NTUsV1JJVEVNT0RVTEUsNywwLDAsMCwwLDAsMCwnXFxuJ307XG4gICAgLy9hWzRdID0gW3R5cGUgaW50VmFsdWVdO1xuICAgIC8vYVs1XSA9IChwb3J0PDw0ICYgMHhmMCl8KHNsb3QgJiAweGYpO1xuICAgIC8vIFN0YXRpYyB2YWx1ZXNcblx0dmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigxNik7XG5cdHZhciBidWZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1Zik7XG5cdFxuXHR2YXIgYnl0ZTAgPSAweGZmLFxuXHRcdGJ5dGUxID0gMHg1NSxcblx0XHRieXRlMiA9IDB4MDksXG5cdFx0Ynl0ZTMgPSAweDAwLFxuXHRcdGJ5dGU0ID0gMHgwMixcblx0XHRieXRlNSA9IHR5cGUsXG5cdFx0Ynl0ZTYgPSBwb3J0LFxuXHRcdGJ5dGU3ID0gc2xvdDtcblx0Ly9keW5hbWljcyB2YWx1ZXNcblx0dmFyIGJ5dGU4ID0gMHgwMCxcblx0XHRieXRlOSA9IDB4MDAsXG5cdFx0Ynl0ZTEwID0gMHgwMCxcblx0XHRieXRlMTEgPSAweDAwO1xuXHQvL0VuZCBvZiBtZXNzYWdlXG5cdHZhciBieXRlMTIgPSAweDBhLFxuXHRcdGJ5dGUxMyA9IDB4MDAsXG5cdFx0Ynl0ZTE0ID0gMHgwMCxcblx0XHRieXRlMTUgPSAweDAwO1xuXG5cdHN3aXRjaCh0eXBlKXtcblx0XHRjYXNlIFRZUEVfTU9UT1I6XG5cdFx0XHQvLyBNb3RvciBNMVxuXHRcdFx0Ly8gZmY6NTUgIDA5OjAwICAwMjowYSAgMDk6NjQgIDAwOjAwICAwMDowMCAgMGFcIlxuXHRcdFx0Ly8gMHg1NWZmOzB4MDAwOTsweDBhMDI7MHgwOTY0OzB4MDAwMDsweDAwMDA7MHgwMDBhOzB4MDAwMDtcblx0XHRcdC8vXCJmZjo1NTowOTowMDowMjowYTowOTowMDowMDowMDowMDowMDowYVwiXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowOTo5YzpmZjowMDowMDowMDowYVxuXHRcdFx0Ly8gTW90b3IgTTJcblx0XHRcdC8vIGZmOjU1OjA5OjAwOjAyOjBhOjBhOjY0OjAwOjAwOjAwOjAwOjBhXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowYTowMDowMDowMDowMDowMDowYVxuXHRcdFx0Ly8gZmY6NTU6MDk6MDA6MDI6MGE6MGE6OWM6ZmY6MDA6MDA6MDA6MGFcblx0XHRcdHZhciB0ZW1wVmFsdWUgPSB2YWx1ZSA8IDAgPyAocGFyc2VJbnQoXCJmZmZmXCIsMTYpICsgTWF0aC5tYXgoLTI1NSx2YWx1ZSkpIDogTWF0aC5taW4oMjU1LCB2YWx1ZSk7XG5cdFx0XHRieXRlNyA9IHRlbXBWYWx1ZSAmIDB4MDBmZjtcdFx0XHRcblx0XHRcdGJ5dGU4ID0gMHgwMDtcblx0XHRcdGJ5dGU4ID0gdGVtcFZhbHVlID4+ODsgXG5cblx0XHRcdC8qYnl0ZTUgPSAweDBhO1xuXHRcdFx0Ynl0ZTYgPSAweDA5O1xuXHRcdFx0Ynl0ZTcgPSAweDY0O1xuXHRcdFx0Ynl0ZTggPSAweDAwOyovXG5cdFx0XHRcblx0XHRicmVhaztcblx0XHRjYXNlIFRZUEVfUkdCOlxuXHRcdFx0Ly8gZmY6NTUgIDA5OjAwICAwMjowOCAgMDY6MDAgIDVjOjk5ICA2ZDowMCAgMGFcblx0XHRcdC8vIDB4NTVmZjsweDAwMDk7MHgwODAyOzB4MDAwNjsweDk5NWM7MHgwMDZkOzB4MDAwYTsweDAwMDA7XG5cdFx0XHRieXRlNyA9IDB4MDA7XG5cdFx0XHRieXRlOCA9IHZhbHVlPj44ICYgMHhmZjtcblx0XHRcdGJ5dGU5ID0gdmFsdWU+PjE2ICYgMHhmZjtcblx0XHRcdGJ5dGUxMCA9IHZhbHVlPj4yNCAmIDB4ZmY7XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBUWVBFX1NPVU5EOlxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjowMDowMDowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjowNjowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjplZTowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjo4ODowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjpiODowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjo1ZDowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjo0YTowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjoyNjowMTowYVxuXHRcdFx0Ynl0ZTIgPSAweDA1O1xuXHRcdFx0Ynl0ZTMgPSAweDAwO1xuXHRcdFx0Ynl0ZTQgPSAweDAyO1xuXHRcdFx0Ynl0ZTUgPSAweDIyO1xuXHRcdFx0aWYgKHZhbHVlID09PSAwKXtcblx0XHRcdFx0Ynl0ZTYgPSAweDAwO1xuXHRcdFx0XHRieXRlNyA9IDB4MDA7XG5cdFx0XHR9ZWxzZXtcblxuXHRcdFx0XHRieXRlNiA9IDB4ZWU7XG5cdFx0XHRcdGJ5dGU3ID0gMHgwMTtcblx0XHRcdH1cblx0XHRcdGJ5dGU4ID0gMHgwYTtcblx0XHRcdGJ5dGUxMj0gMHgwMDtcblxuXHRcdGJyZWFrO1xuXHR9XG5cblx0YnVmVmlld1swXSA9IGJ5dGUxPDw4IHwgYnl0ZTA7XG5cdGJ1ZlZpZXdbMV0gPSBieXRlMzw8OCB8IGJ5dGUyO1xuXHRidWZWaWV3WzJdID0gYnl0ZTU8PDggfCBieXRlNDtcblx0YnVmVmlld1szXSA9IGJ5dGU3PDw4IHwgYnl0ZTY7XG5cdGJ1ZlZpZXdbNF0gPSBieXRlOTw8OCB8IGJ5dGU4O1xuXHRidWZWaWV3WzVdID0gYnl0ZTExPDw4IHwgYnl0ZTEwO1xuXHRidWZWaWV3WzZdID0gYnl0ZTEzPDw4IHwgYnl0ZTEyO1xuXHRidWZWaWV3WzddID0gYnl0ZTE1PDw4IHwgYnl0ZTE0O1xuXHRjb25zb2xlLmxvZyhcblx0XHRcdGJ5dGUwLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUyLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUzLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU0LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU1LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU2LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU3LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU4LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU5LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxMC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTEudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTEyLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxMy50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTQudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTE1LnRvU3RyaW5nKDE2KStcIjpcIlxuXHRcdFx0KTtcblx0Y29uc29sZS5sb2coXG5cdFx0XHRidWZWaWV3WzBdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbMV0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1syXS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzNdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbNF0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1s1XS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzZdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbN10udG9TdHJpbmcoMTYpXG5cdFx0XHQpO1xuXHRyZXR1cm4gYnVmO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQnREVWSUNFX05BTUUnIDogREVWSUNFX05BTUUsXG5cdCdTRVJWSUNFX1VVSUQnIDogU0VSVklDRV9VVUlELFxuXHQnQ0hBUkFDVEVSSVNUSUNfVVVJRCcgOiBDSEFSQUNURVJJU1RJQ19VVUlELFxuXHQnVFlQRV9NT1RPUicgOiBUWVBFX01PVE9SLFxuXHQnVFlQRV9SR0InIDogVFlQRV9SR0IsXG5cdCdUWVBFX1NPVU5EJyA6IFRZUEVfU09VTkQsXG5cdCdQT1JUXzEnIDogUE9SVF8xLFxuXHQnUE9SVF8yJyA6IFBPUlRfMixcblx0J1BPUlRfMycgOiBQT1JUXzMsXG5cdCdQT1JUXzQnIDogUE9SVF80LFxuXHQnUE9SVF81JyA6IFBPUlRfNSxcblx0J1BPUlRfNicgOiBQT1JUXzYsXG5cdCdQT1JUXzcnIDogUE9SVF83LFxuXHQnUE9SVF84JyA6IFBPUlRfOCxcblx0J01fMScgOiBNXzEsXG5cdCdNXzInIDogTV8yLFxuXHQnZ2VuZXJpY0NvbnRyb2wnIDogZ2VuZXJpY0NvbnRyb2xcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBtb2RlbCA9IG51bGwsXG5cdHNvY2tldCA9IG51bGw7XG5cblxuXG5mdW5jdGlvbiBkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBwd2Qpe1xuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcbiAgICBsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcbiAgICBsZXQgcHJvdG9jb2wgPSBtb2RlbC5pc1NTTCgpID8gJ2h0dHBzJyA6ICdodHRwJztcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7cHJvdG9jb2x9Oi8vJHthZGRyZXNzfS9wYXNzd29yZC8ke3B3ZH1gLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKGpzb24uYXV0aCl7XG5cdFx0XHRsb2NhbFN0b3JhZ2VbJ3B3ZCddID0gcHdkO1xuXHRcdFx0c29ja2V0LnNlbmRNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogJ2JsZScsXG5cdFx0XHRcdGFjdGlvbjogJ3N0b3BQaHlzaWNhbFdlYidcblx0XHRcdH0pXG5cdFx0XHRpZiAobG9jYXRpb24uc2VhcmNoID09PSBcIlwiKXtcblx0XHRcdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdGNvbnRleHQubm90dmFsaWQgPSB0cnVlO1xuXHRcdH1cblxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBTZWN1cmVDdHJsKCRtZERpYWxvZywgTW9kZWxTZXJ2aWNlLCBTb2NrZXRTZXJ2aWNlKXtcblx0XG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cdG1vZGVsID0gTW9kZWxTZXJ2aWNlO1xuXHR0aGlzLm5vdHZhbGlkID0gZmFsc2U7XG5cdGxldCBjb250ZXh0ID0gdGhpcztcblxuXHRtb2RlbC5jaGVja0FkZHJlc3MoKVxuXHQudGhlbihmdW5jdGlvbigpe1x0XHRcblx0XHRpZiAobG9jYWxTdG9yYWdlWydwd2QnXSl7XG5cdFx0XHRkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBsb2NhbFN0b3JhZ2VbJ3B3ZCddKTtcblx0XHR9XG5cdH0pXG5cblx0dGhpcy50cnkgPSBmdW5jdGlvbigpe1xuXHRcdGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIGNvbnRleHQucHdkKTtcblx0fVxuXG5cbn1cblxuU2VjdXJlQ3RybC4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnTW9kZWxTZXJ2aWNlJywgJ1NvY2tldFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWN1cmVDdHJsOyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBtYm90QXBpID0gcmVxdWlyZSgnLi4vbWJvdC9tYm90Jyk7ICBcblxuZnVuY3Rpb24gYWIyc3RyKGJ1Zikge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDE2QXJyYXkoYnVmKSk7XG59XG5cbmZ1bmN0aW9uIHN0cjJhYihzdHIpIHtcbiAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihzdHIubGVuZ3RoKjIpOyAvLyAyIGJ5dGVzIGZvciBlYWNoIGNoYXJcbiAgdmFyIGJ1ZlZpZXcgPSBuZXcgVWludDE2QXJyYXkoYnVmKTtcbiAgZm9yICh2YXIgaT0wLCBzdHJMZW49c3RyLmxlbmd0aDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgYnVmVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBidWY7XG59XG5cbnZhciBzZXJ2ZXJHQVRUID0gbnVsbCxcblx0c2VydmljZUdBVFQgPSBudWxsLFxuXHRjaGFyYWN0ZXJpc3RpY0dBVFQgPSBudWxsLFxuXHRlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmZ1bmN0aW9uIGluaXRCbGUoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0bmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHsgXG5cdFx0XHRmaWx0ZXJzOiBbeyBuYW1lOiBtYm90QXBpLkRFVklDRV9OQU1FIH1dLCBvcHRpb25hbFNlcnZpY2VzOiBbbWJvdEFwaS5TRVJWSUNFX1VVSURdXG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihkZXZpY2UpIHtcblx0XHQgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RpbmcuLi5cIik7XG5cdFx0ICAgcmV0dXJuIGRldmljZS5jb25uZWN0R0FUVCgpO1xuXHRcdCB9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXHRcdFx0c2VydmVyR0FUVCA9IHNlcnZlcjtcblx0XHRcdC8vcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShzZXJ2aWNlVVVJRCk7XG5cdFx0ICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIHRpbWVvdXQgd2hlbiBHYXR0U2VydmljZXMgcHJvcGVydHkgd29ya3MgYXMgaW50ZW5kZWQuXG5cdFx0ICAgLy8gY3JidWcuY29tLzU2MDI3N1xuXHRcdCAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlU2VydmljZSwgcmVqZWN0U2VydmljZSkge1xuXHRcdCAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHQgICAgIFx0dHJ5e1xuXHRcdCAgICAgXHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBTZXJ2aWNlXCIpO1xuXHRcdCAgICAgICBcdFx0cmVzb2x2ZVNlcnZpY2Uoc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKG1ib3RBcGkuU0VSVklDRV9VVUlEKSk7XG5cdFx0ICAgICBcdH1jYXRjaChlcnIpe1xuXHRcdCAgICAgXHRcdHJlamVjdFNlcnZpY2UoZXJyKTtcblx0XHQgICAgIFx0fVxuXHRcdCAgICAgfSwgMmUzKTtcblx0XHQgICB9KVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRzZXJ2aWNlR0FUVCA9IHNlcnZpY2U7XG5cdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1x0XHRcdFxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHR9KTtcblx0fSlcbn1cblxuXG5mdW5jdGlvbiBnZXRTZXJ2aWNlKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdGlmIChzZXJ2ZXJHQVRUICYmIHNlcnZlckdBVFQuY29ubmVjdGVkICYmIHNlcnZpY2VHQVRUKXtcblx0XHRcdHJlc29sdmUoc2VydmljZUdBVFQpO1xuXHRcdH1lbHNle1xuXHRcdFx0aW5pdEJsZSgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdFx0cmVzb2x2ZShzZXJ2aWNlKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hhcmFjdGVyaXN0aWMoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKGNoYXJhY3RlcmlzdGljR0FUVCl7XG5cdFx0XHRyZXNvbHZlKGNoYXJhY3RlcmlzdGljR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRnZXRTZXJ2aWNlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byBnZXQgQ2hhcmFjdGVyaXRpYyA6ICVPXCIsc2VydmljZSk7XG5cdFx0XHRcdHJldHVybiBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKG1ib3RBcGkuQ0hBUkFDVEVSSVNUSUNfVVVJRCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXRpYyl7XG5cdFx0XHRcdGNoYXJhY3RlcmlzdGljR0FUVCA9IGNoYXJhY3Rlcml0aWM7XG5cdFx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXRpYyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWModHlwZSwgZGF0YSwgY2FsbGJhY2spe1xuXHRnZXRDaGFyYWN0ZXJpc3RpYygpXG5cdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3RlcmlzdGljKXtcblx0XHRpZiAodHlwZSA9PT0gJ3dyaXRlJyl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byB3cml0ZSB2YWx1ZSA6ICVPXCIsY2hhcmFjdGVyaXN0aWMpO1xuXHRcdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoZGF0YSk7XG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcil7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1xuXHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmluZm8oXCJXcml0ZSBkYXRhcyAhIFwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBkYXRhID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG5cdFx0ICAgIGxldCBkYXRhRGVjcnlwdCA9IGRhdGEuZ2V0VWludDgoMCk7XG5cdFx0ICAgIGNhbGxiYWNrKHt0eXBlOiAncmVhZCcgLCB2YWx1ZSA6IGRhdGFEZWNyeXB0fSk7XG5cdFx0ICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlRGF0YXMgJXMnLCBkYXRhRGVjcnlwdCk7XG5cdFx0fVxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0aWYgKGNhbGxiYWNrKSB7XG5cblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NNb3RvcnModmFsdWVNMSwgdmFsdWVNMil7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oY2hhcmFjdGVyaXN0aWMgPT57XG5cdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8xLCAwLCB2YWx1ZU0xKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWNHQVRULndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8yLCAwLCB2YWx1ZU0yKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0fVxuXHRcdGNvbnNvbGUuaW5mbyhcIldyaXRlIGRhdGFzICEgXCIpO1xuXHR9KS5jYXRjaChlcnJvciA9Pntcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cblxuZnVuY3Rpb24gQmxlQ29udHJvbGxlcigkbWREaWFsb2cpe1xuXG5cdHRoaXMuc2xpZGVyQWN0aXYgPSBmYWxzZTtcblx0dGhpcy5jdXJyZW50VGltZXIgPSBudWxsO1xuXHR0aGlzLnBvd2VyID0gMTI1O1xuXHR0aGlzLnJlZCA9IDA7XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5zdG9wKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fSBcblxuXHR0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcIm9uXCIpO1xuXHR9XG5cblx0dGhpcy51cCA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRjb25zb2xlLmxvZyhcInVwXCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoLTEwMCwxMDApO1xuXHR9XG5cblx0dGhpcy5kb3duID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcImRvd25cIik7XG5cdFx0cHJvY2Vzc01vdG9ycygxMDAsLTEwMCk7XG5cdH1cblx0XG5cdHRoaXMubGVmdCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJsZWZ0XCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoMTAwLDEwMCk7XG5cdH07XG5cblx0dGhpcy5yaWdodCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJyaWdodFwiKTtcblx0XHRwcm9jZXNzTW90b3JzKC0xMDAsLTEwMCk7XG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcInN0b3BcIik7XG5cdFx0cHJvY2Vzc01vdG9ycygwLDApO1xuXHR9XG5cblx0dGhpcy5jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uKHJlZCxibHVlLGdyZWVuKXsgXG5cdFx0Y29uc29sZS5sb2coXCJDaGFuZ2UgQ29sb3IgOiAlZCwlZCwlZFwiLHJlZCxncmVlbixibHVlKTtcblx0XHR2YXIgckhleCA9IHJlZDw8ODtcblx0XHR2YXIgZ0hleCA9IGdyZWVuPDwxNjtcblx0XHR2YXIgYkhleCA9IGJsdWU8PDI0O1xuXHRcdHZhciB2YWx1ZSA9IHJIZXggfCBnSGV4IHwgYkhleDtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgbWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfUkdCLG1ib3RBcGkuUE9SVF82LDAsdmFsdWUpKTtcblx0XHQvL3Byb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcImJyaWdodDpcIit0aGlzLnBvd2VyKTtcblx0fTtcblxuXG59XG5cbkJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJ11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZUNvbnRyb2xsZXI7Lyp7XG5cdHdyaXRlRGF0YSA6IHByb2Nlc3NDaGFyYWN0ZXJpc3RpY1xufSovXG5cbiIsIid1c2Ugc3RyaWN0JztcblxubGV0IHNvY2tldCA9IG51bGw7XG5cbi8vIFRoZSBoYW5kbGVyXG52YXIgZGV2aWNlTGlnaHRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0Ly8gVGhlIHZhbHVlIHdpbGwgbGl2ZSBiZXR3ZWVuIDAgYW5kIH4xNTBcblx0Ly8gQnV0IHdoZW4gaXQgaXMgNDUgaXMgYSBoaWdoIGx1bW9uc2l0eVxuXHR2YXIgdmFsdWUgPSBNYXRoLm1pbig0NSwgZXZlbnQudmFsdWUpOyAgICAgICAgXG5cdGxldCBwZXJjZW50ID0gTWF0aC5yb3VuZCgodmFsdWUgLyA0NSkgKiAxMDApOyAgICAgICBcblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnbGlnaHQnLCB2YWx1ZSA6IHBlcmNlbnR9KTtcbn1cblxuLy8gV2UgYWRkIHRoZSBsaXN0ZW5lclxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIExpZ2h0Q29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbkxpZ2h0Q29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodENvbnRyb2xlcjsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBzb2NrZXQgPSBudWxsLCBcblx0Zmlyc3RWYWx1ZSA9IC0xO1xuXG4vLyBUaGUgaGFuZGxlciBvZiB0aGUgZXZlbnRcbnZhciBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpeyAgICAgICAgXG5cdHZhciBhbHBoYSA9IE1hdGgucm91bmQoZXZlbnQuYWxwaGEpO1xuXHR2YXIgYmV0YSA9IE1hdGgucm91bmQoZXZlbnQuYmV0YSk7XG5cdHZhciBnYW1tYSA9IE1hdGgucm91bmQoZXZlbnQuZ2FtbWEpO1xuXHRpZiAoZmlyc3RWYWx1ZSA9PT0gLTEpe1xuXHRcdGZpcnN0VmFsdWUgPSBhbHBoYTtcblx0fVxuXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICdvcmllbnRhdGlvbicsIHZhbHVlIDogYWxwaGEsICdmaXJzdFZhbHVlJyA6IGZpcnN0VmFsdWV9KTtcdFxufVxuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXHRmaXJzdFZhbHVlID0gLTE7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIE9yaWVudGF0aW9uQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cbk9yaWVudGF0aW9uQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yaWVudGF0aW9uQ29udHJvbGVyOyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbW9kZWwgPSBudWxsLFxuICAgIHNvY2tldCA9IG51bGw7XG5cbi8vIFRoZSBsaXN0ZW5lclxudmFyIGRldmljZVByb3hpbWl0eUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHR2YXIgdmFsdWUgPSBNYXRoLnJvdW5kKGV2ZW50LnZhbHVlKTsgICAgICAgIFxuXHRpZiAodmFsdWUgPT09IDApe1xuICAgICAgICBzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ3N0YXJ0J30pO1xuXHRcdC8qbGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XG5cdFx0bGV0IHNjaGVtZSA9IG1vZGVsLmlzU1NMKCkgID8gXCJodHRwc1wiIDogXCJodHRwXCI7XG5cdFx0d2luZG93LmxvY2F0aW9uID0gYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWw/c3BlZWNoI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLmNocm9taXVtLmNocm9tZTtlbmRgOyovXG5cdH0gICAgXG5cdC8vc29ja2V0LnNlbmRQcm94aW1pdHkodmFsdWUpO1xuXHQvL21hbmFnZVByb3hpbWl0eVZhbHVlKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXByb3hpbWl0eScsIGRldmljZVByb3hpbWl0eUhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlcHJveGltaXR5JywgZGV2aWNlUHJveGltaXR5SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBQcm94aW1pdHlDb250cm9sZXIoJG1kRGlhbG9nLCBNb2RlbFNlcnZpY2UsIFNvY2tldFNlcnZpY2Upe1xuXG5cdG1vZGVsID0gTW9kZWxTZXJ2aWNlO1xuICAgIHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdGlmICh3aW5kb3cuRGV2aWNlUHJveGltaXR5RXZlbnQpe1xuXG5cdFx0XHRyZWdpc3RlcigpO1xuXHRcdH1lbHNle1xuXHRcdFx0bGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XG5cdFx0XHRsZXQgc2NoZW1lID0gbW9kZWwuaXNTU0woKSAgPyBcImh0dHBzXCIgOiBcImh0dHBcIjtcblx0XHRcdC8vd2luZG93LmxvY2F0aW9uID0gYGludGVudDovLzEwLjMzLjQ0LjE4MTozMDAwL2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbD9wcm94aW1pdHkjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcubW96aWxsYS5maXJlZm94X2JldGE7ZW5kYDtcblx0XHR9XG5cdH1cblxuXHR0aGlzLmdvVG9DaHJvbWUgPSBmdW5jdGlvbigpe1xuXHRcdGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuXHRcdGxldCBzY2hlbWUgPSBtb2RlbC5pc1NTTCgpICA/IFwiaHR0cHNcIiA6IFwiaHR0cFwiO1xuXHRcdC8vd2luZG93LmxvY2F0aW9uID0gYGludGVudDovLzEwLjMzLjQ0LjE4MTozMDAwL2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XG5cdFx0d2luZG93LmxvY2F0aW9uID0gYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWwjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcuY2hyb21pdW0uY2hyb21lO2FjdGlvbj1hbmRyb2lkLmludGVudC5hY3Rpb24uVklFVztsYXVuY2hGbGFncz0weDEwMDAwMDAwO2VuZGA7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5Qcm94aW1pdHlDb250cm9sZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ01vZGVsU2VydmljZScsICdTb2NrZXRTZXJ2aWNlJ107XG5cbm1vZHVsZS5leHBvcnRzID0gUHJveGltaXR5Q29udHJvbGVyOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNvY2tldCA9IG51bGwsXG4gIHZpZGVvRWxlbWVudCA9IG51bGwsXG4gIGNhbnZhcyA9IG51bGwsIFxuICB2aWRlb1NvdXJjZSA9IG51bGwsXG4gIHNlbGVjdG9ycyA9IG51bGw7XG5cbiBcblxuZnVuY3Rpb24gZ290RGV2aWNlcyhkZXZpY2VJbmZvcykge1xuICBkZXZpY2VJbmZvcy5mb3JFYWNoKGZ1bmN0aW9uKGRldmljZSl7XG4gICAgaWYgKGRldmljZS5raW5kID09PSAndmlkZW9pbnB1dCcgJiYgZGV2aWNlLmxhYmVsLmluZGV4T2YoJ2JhY2snKSAhPSAwKXtcbiAgICAgIHZpZGVvU291cmNlID0gZGV2aWNlLmRldmljZUlkO1xuICAgIH1cbiAgfSk7ICBcbn1cblxubmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzKClcbiAgLnRoZW4oZ290RGV2aWNlcylcbiAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVyci5uYW1lICsgXCI6IFwiICsgZXJyLm1lc3NhZ2UpO1xuICB9KTtcblxuZnVuY3Rpb24gc3RhcnQoKXtcbiAgaWYgKHdpbmRvdy5zdHJlYW0pIHtcbiAgICB3aW5kb3cuc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcbiAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICB9KTtcbiAgfVxuICB2YXIgY29uc3RyYWludHMgPSB7XG4gICAgYXVkaW8gOiBmYWxzZSxcbiAgICB2aWRlbzoge2RldmljZUlkOiB2aWRlb1NvdXJjZSA/IHtleGFjdDogdmlkZW9Tb3VyY2V9IDogdW5kZWZpbmVkfVxuICB9O1xuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cykudGhlbihzdWNjZXNzQ2FsbGJhY2spLmNhdGNoKGVycm9yQ2FsbGJhY2spO1xufVxuXG5cbmZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhzdHJlYW0pIHtcbiAgd2luZG93LnN0cmVhbSA9IHN0cmVhbTsgLy8gbWFrZSBzdHJlYW0gYXZhaWxhYmxlIHRvIGNvbnNvbGVcbiAgaWYgKCF2aWRlb0VsZW1lbnQpe1xuICAgIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlWaWRlb1wiKTtcbiAgICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Q2FudmFzXCIpO1xuICB9XG4gIHZpZGVvRWxlbWVudC5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pO1xuICB2aWRlb0VsZW1lbnQub25sb2FkZWRtZXRhZGF0YSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2aWRlb0VsZW1lbnQucGxheSgpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBlcnJvckNhbGxiYWNrKGVycm9yKXtcbiAgICBjb25zb2xlLmxvZyhcIm5hdmlnYXRvci5nZXRVc2VyTWVkaWEgZXJyb3I6IFwiLCBlcnJvcik7XG4gIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG4gICAgICBzdGFydCgpO1xuICAgICAgXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuICAgICAgaWYgKHZpZGVvRWxlbWVudCkge1xuICAgICAgICB2aWRlb0VsZW1lbnQucGF1c2UoKTtcbiAgICAgICAgdmlkZW9FbGVtZW50LnNyYyA9IG51bGw7XG4gICAgICB9XG4gICAgICAgICBcbiAgICB9XG5cbmZ1bmN0aW9uIENhbWVyYUN0cmwoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcbiAgc29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuICB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VmlkZW9cIik7XG4gIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDYW52YXNcIik7XG5cbiAgdGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuICAgIHJlZ2lzdGVyKCk7XG4gIH1cblxuICB0aGlzLnBob3RvID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvRWxlbWVudC52aWRlb1dpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB2aWRlb0VsZW1lbnQudmlkZW9IZWlnaHQ7XG4gICAgY29udGV4dC5kcmF3SW1hZ2UodmlkZW9FbGVtZW50LCAwLCAwLCB2aWRlb0VsZW1lbnQudmlkZW9XaWR0aCwgdmlkZW9FbGVtZW50LnZpZGVvSGVpZ2h0KTtcbiAgXG4gICAgdmFyIGRhdGEgPSBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd1c2VybWVkaWEnLCB2YWx1ZSA6IGRhdGF9KTsgICAgICBcbiAgICBcbiAgfVxuXG4gIHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgIHVucmVnaXN0ZXIoKTtcbiAgICAkbWREaWFsb2cuaGlkZSgpO1xuICB9XG59XG5cbkNhbWVyYUN0cmwuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ1NvY2tldFNlcnZpY2UnXVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYUN0cmw7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzb2NrZXQgPSBudWxsO1xudmFyIFNwZWVjaFJlY29nbml0aW9uID0gU3BlZWNoUmVjb2duaXRpb24gfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25cbnZhciBTcGVlY2hHcmFtbWFyTGlzdCA9IFNwZWVjaEdyYW1tYXJMaXN0IHx8IHdlYmtpdFNwZWVjaEdyYW1tYXJMaXN0XG52YXIgU3BlZWNoUmVjb2duaXRpb25FdmVudCA9IFNwZWVjaFJlY29nbml0aW9uRXZlbnQgfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25FdmVudFxuXG4vL3ZhciBncmFtbWFyID0gJyNKU0dGIFYxLjA7IGdyYW1tYXIgY29sb3JzOyBwdWJsaWMgPGNvbG9yPiA9IGFxdWEgfCBhenVyZSB8IGJlaWdlIHwgYmlzcXVlIHwgYmxhY2sgfCBibHVlIHwgYnJvd24gfCBjaG9jb2xhdGUgfCBjb3JhbCB8IGNyaW1zb24gfCBjeWFuIHwgZnVjaHNpYSB8IGdob3N0d2hpdGUgfCBnb2xkIHwgZ29sZGVucm9kIHwgZ3JheSB8IGdyZWVuIHwgaW5kaWdvIHwgaXZvcnkgfCBraGFraSB8IGxhdmVuZGVyIHwgbGltZSB8IGxpbmVuIHwgbWFnZW50YSB8IG1hcm9vbiB8IG1vY2Nhc2luIHwgbmF2eSB8IG9saXZlIHwgb3JhbmdlIHwgb3JjaGlkIHwgcGVydSB8IHBpbmsgfCBwbHVtIHwgcHVycGxlIHwgcmVkIHwgc2FsbW9uIHwgc2llbm5hIHwgc2lsdmVyIHwgc25vdyB8IHRhbiB8IHRlYWwgfCB0aGlzdGxlIHwgdG9tYXRvIHwgdHVycXVvaXNlIHwgdmlvbGV0IHwgd2hpdGUgfCB5ZWxsb3cgOydcbnZhciByZWNvZ25pdGlvbiA9IG5ldyBTcGVlY2hSZWNvZ25pdGlvbigpO1xuLy92YXIgc3BlZWNoUmVjb2duaXRpb25MaXN0ID0gbmV3IFNwZWVjaEdyYW1tYXJMaXN0KCk7XG4vL3NwZWVjaFJlY29nbml0aW9uTGlzdC5hZGRGcm9tU3RyaW5nKGdyYW1tYXIsIDEpO1xuLy9yZWNvZ25pdGlvbi5ncmFtbWFycyA9IHNwZWVjaFJlY29nbml0aW9uTGlzdDtcbnJlY29nbml0aW9uLmNvbnRpbnVvdXMgPSB0cnVlO1xucmVjb2duaXRpb24ubGFuZyA9ICdmci1GUic7XG5yZWNvZ25pdGlvbi5pbnRlcmltUmVzdWx0cyA9IHRydWU7XG4vL3JlY29nbml0aW9uLm1heEFsdGVybmF0aXZlcyA9IDE7XG5cbi8vdmFyIGRpYWdub3N0aWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3V0cHV0Jyk7XG4vL3ZhciBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcblxuZG9jdW1lbnQuYm9keS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gIHJlY29nbml0aW9uLnN0YXJ0KCk7XG4gIGNvbnNvbGUubG9nKCdSZWFkeSB0byByZWNlaXZlIGEgY29sb3IgY29tbWFuZC4nKTtcbn1cblxucmVjb2duaXRpb24ub25yZXN1bHQgPSBmdW5jdGlvbihldmVudCkge1xuICAvLyBUaGUgU3BlZWNoUmVjb2duaXRpb25FdmVudCByZXN1bHRzIHByb3BlcnR5IHJldHVybnMgYSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0XG4gIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdHMuXG4gIC8vIEl0IGhhcyBhIGdldHRlciBzbyBpdCBjYW4gYmUgYWNjZXNzZWQgbGlrZSBhbiBhcnJheVxuICAvLyBUaGUgZmlyc3QgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IGF0IHBvc2l0aW9uIDAuXG4gIC8vIEVhY2ggU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0cyB0aGF0IGNvbnRhaW4gaW5kaXZpZHVhbCByZXN1bHRzLlxuICAvLyBUaGVzZSBhbHNvIGhhdmUgZ2V0dGVycyBzbyB0aGV5IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFycmF5cy5cbiAgLy8gVGhlIHNlY29uZCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBhdCBwb3NpdGlvbiAwLlxuICAvLyBXZSB0aGVuIHJldHVybiB0aGUgdHJhbnNjcmlwdCBwcm9wZXJ0eSBvZiB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3QgXG4gIHZhciBmaW5hbFN0ciA9IGV2ZW50LnJlc3VsdHNbMF1bMF0udHJhbnNjcmlwdDtcbiAgLy9kaWFnbm9zdGljLnRleHRDb250ZW50ID0gJ1Jlc3VsdCByZWNlaXZlZDogJyArIGNvbG9yICsgJy4nO1xuICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICBjb25zb2xlLmxvZygnQ29uZmlkZW5jZTogJyArIGZpbmFsU3RyKTtcbiAgaWYgKGZpbmFsU3RyLmluZGV4T2YoJ3N1aXZhbnQnKSAhPSAtMSl7XG4gIFx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICduZXh0J30pO1xuICB9ZWxzZSBpZiAoZmluYWxTdHIuaW5kZXhPZigncHLDqWPDqWRlbnQnKSAhPSAtMSl7XG4gIFx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICdwcmV2J30pO1xuICB9XG59XG5cbi8vIFdlIGRldGVjdCB0aGUgZW5kIG9mIHNwZWVjaFJlY29nbml0aW9uIHByb2Nlc3NcbiAgICAgIHJlY29nbml0aW9uLm9uZW5kID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJ0VuZCBvZiByZWNvZ25pdGlvbicpXG4gICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFdlIGRldGVjdCBlcnJvcnNcbiAgICAgIHJlY29nbml0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vLXNwZWVjaCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gU3BlZWNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmVycm9yID09ICdhdWRpby1jYXB0dXJlJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBtaWNyb3Bob25lJylcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ25vdC1hbGxvd2VkJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3QgQWxsb3dlZCcpO1xuICAgICAgICB9XG4gICAgICB9OyAgICAgXG5cblxuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0cmVjb2duaXRpb24uc3RvcCgpO1xufVxuXG5cbmZ1bmN0aW9uIFZvaWNlQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XG5cblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcblxuXHRyZWNvZ25pdGlvbi5zdGFydCgpO1xuXHRcblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuXG5Wb2ljZUNvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gVm9pY2VDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzb2NrZXQgPSBudWxsO1xuXG5mdW5jdGlvbiBTb2NrZXRTZXJ2aWNlKCl7XG5cblx0dGhpcy5jb25uZWN0ID0gZnVuY3Rpb24obW9kZWwpe1xuXG5cdFx0bW9kZWwuY2hlY2tBZGRyZXNzKClcblx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0bGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRJb0FkZHJlc3MoKTtcblx0XHRcdGxldCBwcm90b2NvbCA9IG1vZGVsLmlzU1NMKCkgPyAnaHR0cHMnIDogJ2h0dHAnO1xuXHRcdFx0c29ja2V0ID0gaW8oYCR7cHJvdG9jb2x9Oi8vJHthZGRyZXNzfWApO1xuXHRcdH0pO1xuXHR9XG5cdHRoaXMuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xuXHRcdHNvY2tldC5lbWl0KCdzZW5zb3InLCBtc2cpO1xuXHR9XG5cblx0dGhpcy5nZXRTb2NrZXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBzb2NrZXQ7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldFNlcnZpY2U7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBhZGRyZXNzID0gbnVsbCxcblx0aW9BZGRyZXNzID0gbnVsbCxcblx0c3NsID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUFkZHJlc3MoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKGFkZHJlc3Mpe1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0XHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuXHQgICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcblx0ICAgICAgICAgICBtb2RlOiAnY29ycycsXG5cdCAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuXHQgICAgbGV0IHByb3RvY29sID0gJyc7XG5cdCAgICBsZXQgc2NoZW1lID0gJydcblx0ICAgIGxldCBiYXNpY0hvc3QgPSAnJ1xuXHQgICAgaWYgKGxvY2F0aW9uLmhvc3QgJiYgbG9jYXRpb24uaG9zdC5pbmRleE9mKCdsb2NhbGhvc3QnKSA9PT0gLTEpe1xuXHQgICAgXHRwcm90b2NvbCA9ICdodHRwcyc7XG5cdCAgICBcdHNjaGVtZSA9ICc6Ly8nO1xuXHQgICAgXHRiYXNpY0hvc3QgPSAnYmlub21lZC5mcjo4MDAwJztcblx0ICAgIH1cblxuXHRcdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtwcm90b2NvbH0ke3NjaGVtZX0ke2Jhc2ljSG9zdH0vaXBgLG15SW5pdCk7XG5cdFx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihqc29uKXtcblx0XHRcdGxldCBuZXR3b3JrID0ganNvbjtcblxuXHRcdFx0aWYgKGxvY2F0aW9uLnBvcnQgJiYgKGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiKSl7XG5cdFx0XHRcdGxldCB3bGFuMCA9IG5ldHdvcmsuZmluZChmdW5jdGlvbihlbGVtZW50KXtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudC5uYW1lID09PSAnd2xhbjAnO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKHdsYW4wICYmIGxvY2F0aW9uLmhvc3RuYW1lICE9ICdsb2NhbGhvc3QnKXtcblx0XHRcdFx0XHRhZGRyZXNzID0gYCR7d2xhbjAuaXB9OjMwMDBgO1xuXHRcdFx0XHRcdGlvQWRkcmVzcyA9IGAke3dsYW4wLmlwfTo4MDAwYDtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0YWRkcmVzcyA9IFwibG9jYWxob3N0OjMwMDBcIjtcblx0XHRcdFx0XHRpb0FkZHJlc3MgPSBcImxvY2FsaG9zdDo4MDAwXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiODAwMFwiKXtcblx0XHRcdFx0YWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHRcdGlvQWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHRcdHNzbCA9IHRydWU7XG5cdFx0XHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCI4MFwiIHx8IGxvY2F0aW9uLnBvcnQgPT09IFwiXCIpKXtcblx0XHRcdFx0YWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHRcdGlvQWRkcmVzcyA9IFwiYmlub21lZC5mcjo4MDAwXCI7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0YWRkcmVzcyA9IG51bGw7XG5cdFx0XHR9IFxuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuY2FsY3VsYXRlQWRkcmVzcygpO1xuXG5cbmZ1bmN0aW9uIE1vZGVsU2VydmljZSgpe1xuXG5cdHRoaXMuaXNTU0wgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBzc2w7XG5cdH1cblxuXHR0aGlzLmdldEFkZHJlc3MgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBhZGRyZXNzO1xuXHR9XHRcblxuXHR0aGlzLmdldElvQWRkcmVzcyA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGlvQWRkcmVzcztcblx0fVxuXG5cdHRoaXMuY2hlY2tBZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcztcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsU2VydmljZTsiXX0=
