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
		   return device.gatt.connect();
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

function processCharacteristic(type, data){
	getCharacteristic()
	.then(function(characteristic){
		if (type === 'write'){			
			console.log("Try to write value : %O",characteristic);
			return characteristic.writeValue(data);
		}
	}).then(function(buffer){
		if (type === 'write'){
			console.info("Write datas ! ");
		}else{
			let data = new DataView(buffer);
		    let dataDecrypt = data.getUint8(0);
		    console.log('ReceiveDatas %s', dataDecrypt);
		}
	}).catch(function(error){
		console.error(error);		
	});
}

function processMotors(valueM1, valueM2){
	getCharacteristic()
	.then(characteristic =>{
		return characteristic.writeValue(mbotApi.genericControl(mbotApi.TYPE_MOTOR, mbotApi.M_1, 0, valueM1));
	}).then(()=>{
		return characteristicGATT.writeValue(mbotApi.genericControl(mbotApi.TYPE_MOTOR, mbotApi.M_2, 0, valueM2));
	}).then(()=>{
		console.info("Write datas ! ");
	}).catch(error =>{
		console.error(error);
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
			window.open(`intent://${address}/addon/index_app.html?proximity#Intent;scheme=${scheme};package=org.mozilla.firefox_beta;end`);
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
  var tempVideoSource = null;
  deviceInfos.forEach(function(device){
    if (device.kind === 'videoinput'){
      tempVideoSource = device.deviceId;
      if( device.label.indexOf('back') != 0){
        videoSource = device.deviceId;
      }
    }
  });
  if (videoSource === null){
    videoSource = tempVideoSource;
  }  
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
	    	basicHost = 'binomed.fr:8443';
	    }

		let myRequest = new Request(`${protocol}${scheme}${basicHost}/ip`,myInit);
		fetch(myRequest)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			let network = json;

			if ((location.port && (location.port === "3000"))
             || location.hostname === 'localhost'){
				let wlan0 = network.find(function(element){
					return element.name === 'wlan0';
				});
				if (location.port === "8443"){
					address = "localhost:8443";
					ioAddress = "localhost:8443";
                }else if (wlan0 && location.hostname != 'localhost'){
					address = `${wlan0.ip}:3000`;
					ioAddress = `${wlan0.ip}:8443`;
				}else{
					address = "localhost:3000";
					ioAddress = "localhost:8443";
				}
			}else if (location.port && location.port === "8443"){
				address = "binomed.fr:8443";
				ioAddress = "binomed.fr:8443";
				ssl = true;
			}else if (location.port && (location.port === "80" || location.port === "")){
				address = "binomed.fr:8443";
				ioAddress = "binomed.fr:8443";
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9tYm90L21ib3QuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZWN1cmUvc2VjdXJlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9ibHVldG9vdGguanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlbnNvcnMvcHJveGltaXR5LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL3ZvaWNlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc29ja2V0L3NvY2tldHMuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC91dGlsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5hbmd1bGFyLm1vZHVsZShcIlN1cGVyUG93ZXJBcHBcIiwgWyduZ01hdGVyaWFsJ10pXHJcbi5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XHJcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcclxuICAgIC5wcmltYXJ5UGFsZXR0ZSgncmVkJylcclxuICAgIC5hY2NlbnRQYWxldHRlKCdvcmFuZ2UnKTtcclxufSlcclxuLnNlcnZpY2UoJ1NvY2tldFNlcnZpY2UnLCByZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJykpXHJcbi5zZXJ2aWNlKCdNb2RlbFNlcnZpY2UnLCByZXF1aXJlKCcuL3V0aWwvbW9kZWwnKSlcclxuLmRpcmVjdGl2ZSgnamZUb3VjaHN0YXJ0JywgW2Z1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XHJcblxyXG4gICAgICAgIGVsZW1lbnQub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHIuamZUb3VjaHN0YXJ0KTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufV0pLmRpcmVjdGl2ZSgnamZUb3VjaGVuZCcsIFtmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xyXG5cclxuICAgICAgICBlbGVtZW50Lm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7IFxyXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWwoYXR0ci5qZlRvdWNoZW5kKTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufV0pXHJcbi5kaXJlY3RpdmUoJ2pmQ29sb3JwaWNrZXInLCBbZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpe1xyXG5cdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0aW1nLnNyYyA9ICcuL2Fzc2V0cy9pbWFnZXMvY29sb3Itd2hlZWwucG5nJ1xyXG5cdFx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ICB2YXIgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XHJcblx0XHQgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5cdFx0ICBjYW52YXMud2lkdGggPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG5cdFx0ICBjYW52YXMuaGVpZ2h0ID0gMTUwICogZGV2aWNlUGl4ZWxSYXRpbztcclxuXHRcdCAgY2FudmFzLnN0eWxlLndpZHRoID0gXCIxNTBweFwiO1xyXG5cdFx0ICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxNTBweFwiO1xyXG5cdFx0ICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldnQpIHtcclxuXHRcdCAgICAvLyBSZWZyZXNoIGNhbnZhcyBpbiBjYXNlIHVzZXIgem9vbXMgYW5kIGRldmljZVBpeGVsUmF0aW8gY2hhbmdlcy5cclxuXHRcdCAgICBjYW52YXMud2lkdGggPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG5cdFx0ICAgIGNhbnZhcy5oZWlnaHQgPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG5cdFx0ICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHQgICAgdmFyIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHQgICAgdmFyIHggPSBNYXRoLnJvdW5kKChldnQuY2xpZW50WCAtIHJlY3QubGVmdCkgKiBkZXZpY2VQaXhlbFJhdGlvKTtcclxuXHRcdCAgICB2YXIgeSA9IE1hdGgucm91bmQoKGV2dC5jbGllbnRZIC0gcmVjdC50b3ApICogZGV2aWNlUGl4ZWxSYXRpbyk7XHJcblx0XHQgICAgdmFyIGRhdGEgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpLmRhdGE7XHJcblxyXG5cdFx0ICAgIHZhciByID0gZGF0YVsoKGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0XTtcclxuXHRcdCAgICB2YXIgZyA9IGRhdGFbKChjYW52YXMud2lkdGggKiB5KSArIHgpICogNCArIDFdO1xyXG5cdFx0ICAgIHZhciBiID0gZGF0YVsoKGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0ICsgMl07XHJcblx0XHQgICAgXHJcblx0XHQgICAgc2NvcGUuJGV2YWwoYXR0ci5qZkNvbG9ycGlja2VyLCB7XHJcblx0XHQgICAgXHRyZWQ6cixcclxuXHRcdCAgICBcdGJsdWU6YixcclxuXHRcdCAgICBcdGdyZWVuOmdcclxuXHRcdCAgICB9KTsgXHJcblx0XHQgICAgXHJcblxyXG5cdFx0ICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblx0XHQgICAgY29udGV4dC5hcmMoeCwgeSArIDIsIDEwICogZGV2aWNlUGl4ZWxSYXRpbywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuXHRcdCAgICBjb250ZXh0LnNoYWRvd0NvbG9yID0gJyMzMzMnO1xyXG5cdFx0ICAgIGNvbnRleHQuc2hhZG93Qmx1ciA9IDQgKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG5cdFx0ICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcclxuXHRcdCAgICBjb250ZXh0LmZpbGwoKTtcclxuXHRcdCAgfSk7XHJcblxyXG5cdFx0ICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblx0XHR9XHJcblx0fTtcclxufV0pXHJcbi5kaXJlY3RpdmUoJ2FwcCcsIFsnJG1kRGlhbG9nJywgJyR0aW1lb3V0JywgJ1NvY2tldFNlcnZpY2UnLCAnTW9kZWxTZXJ2aWNlJyxcclxuXHRmdW5jdGlvbigkbWREaWFsb2csICR0aW1lb3V0LCBTb2NrZXRTZXJ2aWNlLCBNb2RlbFNlcnZpY2Upe1xyXG5cclxuXHRcdFNvY2tldFNlcnZpY2UuY29ubmVjdChNb2RlbFNlcnZpY2UpO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvYXBwLmh0bWwnLFxyXG5cdFx0Y29udHJvbGxlckFzIDogJ2FwcCcsXHJcblx0XHRiaW5kVG9Db250cm9sbGVyIDogdHJ1ZSxcclxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMuYWN0aW9ucyA9IFtcclxuXHRcdFx0XHR7bGFiZWwgOiBcIkJsdWV0b290aFwiLCBpY29uIDogJ2ZhLWJsdWV0b290aCcsIGlkQWN0aW9uOiAnYmxlJ30sXHJcblx0XHRcdFx0e2xhYmVsIDogXCJMaWdodFwiLCBpY29uIDogJ2ZhLWxpZ2h0YnVsYi1vJywgaWRBY3Rpb246ICdsaWdodCd9LFxyXG5cdFx0XHRcdHtsYWJlbCA6IFwiT3JpZW50YXRpb25cIiwgaWNvbiA6ICdmYS1jb21wYXNzJywgaWRBY3Rpb246ICdvcmllbnRhdGlvbid9LFxyXG5cdFx0XHRcdHtsYWJlbCA6IFwiVXNlck1lZGlhXCIsIGljb24gOiAnZmEtY2FtZXJhJywgaWRBY3Rpb246ICdjYW1lcmEnfSxcclxuXHRcdFx0XHR7bGFiZWwgOiBcIlByb3hpbWl0eVwiLCBpY29uIDogJ2ZhLXJzcycsIGlkQWN0aW9uOiAncHJveGltaXR5J30sXHJcblx0XHRcdFx0e2xhYmVsIDogXCJWb2ljZVwiLCBpY29uIDogJ2ZhLW1pY3JvcGhvbmUnLCBpZEFjdGlvbjogJ21pYyd9XHJcblx0XHRcdF07XHJcblxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblxyXG5cdFx0XHRpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gJz9wcm94aW1pdHknKXtcclxuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAncHJveGltaXR5Q3RybCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9wcm94aW1pdHkuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvcHJveGltaXR5JyksXHJcblx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXHJcblx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnc2VjdXJlQ3RybCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9zZWN1cmUuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKFwiLi9zZWN1cmUvc2VjdXJlXCIpLFxyXG5cdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxyXG5cdFx0XHRcdFx0Ly90YXJnZXRFdmVudCA6IGV2ZW50LFxyXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcGVuRGlhbG9nID0gZnVuY3Rpb24oZXZlbnQsIHR5cGUpe1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdPcGVuIERpYWxvZycpO1xyXG5cdFx0XHRcdGlmICh0eXBlID09PSAnYmxlJyl7XHJcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdibGVDdHJsJyxcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvYmx1ZXRvb3RoLmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvYmx1ZXRvb3RoJyksXHJcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcclxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcclxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnbGlnaHQnKXtcclxuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2xpZ2h0Q3RybCcsXHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2xpZ2h0Lmh0bWwnLFxyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvbGlnaHQnKSxcclxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxyXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxyXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdvcmllbnRhdGlvbicpe1xyXG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnb3JpZW50YXRpb25DdHJsJyxcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvb3JpZW50YXRpb24uaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9vcmllbnRhdGlvbicpLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXHJcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXHJcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ21pYycpe1xyXG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAndm9pY2VDdHJsJyxcclxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvdm9pY2UuaHRtbCcsXHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy92b2ljZScpLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXHJcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXHJcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ3Byb3hpbWl0eScpe1xyXG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAncHJveGltaXR5Q3RybCcsXHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3Byb3hpbWl0eS5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3Byb3hpbWl0eScpLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXHJcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXHJcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ2NhbWVyYScpe1xyXG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xyXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnY2FtZXJhQ3RybCcsXHJcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3VzZXJtZWRpYS5odG1sJyxcclxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3VzZXJtZWRpYScpLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXHJcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXHJcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1dKTtcclxuXHJcblxyXG5mdW5jdGlvbiBwYWdlTG9hZCgpe1x0XHJcblx0Ly9yZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJyk7XHJcbn1cclxuXHJcblxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBERVZJQ0VfTkFNRSA9IFwiTWFrZWJsb2NrX0xFXCIsXHJcblx0U0VSVklDRV9VVUlEID0gXCIwMDAwZmZlMS0wMDAwLTEwMDAtODAwMC0wMDgwNWY5YjM0ZmJcIixcclxuXHRDSEFSQUNURVJJU1RJQ19VVUlEID0gXCIwMDAwZmZlMy0wMDAwLTEwMDAtODAwMC0wMDgwNWY5YjM0ZmJcIjtcclxuXHJcbmNvbnN0IFRZUEVfTU9UT1IgPSAweDBhLFxyXG5cdFRZUEVfUkdCID0gMHgwOCxcclxuXHRUWVBFX1NPVU5EID0gMHgwNztcclxuXHJcblxyXG5jb25zdCBQT1JUXzEgPSAweDAxLFxyXG5cdFBPUlRfMiA9IDB4MDIsXHJcblx0UE9SVF8zID0gMHgwMyxcclxuXHRQT1JUXzQgPSAweDA0LFxyXG5cdFBPUlRfNSA9IDB4MDUsXHJcblx0UE9SVF82ID0gMHgwNixcclxuXHRQT1JUXzcgPSAweDA3LFxyXG5cdFBPUlRfOCA9IDB4MDgsXHJcblx0TV8xID0gMHgwOSxcclxuXHRNXzIgPSAweDBhO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJpY0NvbnRyb2wodHlwZSwgcG9ydCwgc2xvdCwgdmFsdWUpe1xyXG5cdC8qXHJcblx0ZmYgNTUgbGVuIGlkeCBhY3Rpb24gZGV2aWNlIHBvcnQgIHNsb3QgIGRhdGEgYVxyXG5cdDAgIDEgIDIgICAzICAgNCAgICAgIDUgICAgICA2ICAgICA3ICAgICA4XHJcblx0Ki9cclxuXHQvL3Vuc2lnbmVkIGNoYXIgYVsxMV09ezB4ZmYsMHg1NSxXUklURU1PRFVMRSw3LDAsMCwwLDAsMCwwLCdcXG4nfTtcclxuICAgIC8vYVs0XSA9IFt0eXBlIGludFZhbHVlXTtcclxuICAgIC8vYVs1XSA9IChwb3J0PDw0ICYgMHhmMCl8KHNsb3QgJiAweGYpO1xyXG4gICAgLy8gU3RhdGljIHZhbHVlc1xyXG5cdHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMTYpO1xyXG5cdHZhciBidWZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1Zik7XHJcblx0XHJcblx0dmFyIGJ5dGUwID0gMHhmZixcclxuXHRcdGJ5dGUxID0gMHg1NSxcclxuXHRcdGJ5dGUyID0gMHgwOSxcclxuXHRcdGJ5dGUzID0gMHgwMCxcclxuXHRcdGJ5dGU0ID0gMHgwMixcclxuXHRcdGJ5dGU1ID0gdHlwZSxcclxuXHRcdGJ5dGU2ID0gcG9ydCxcclxuXHRcdGJ5dGU3ID0gc2xvdDtcclxuXHQvL2R5bmFtaWNzIHZhbHVlc1xyXG5cdHZhciBieXRlOCA9IDB4MDAsXHJcblx0XHRieXRlOSA9IDB4MDAsXHJcblx0XHRieXRlMTAgPSAweDAwLFxyXG5cdFx0Ynl0ZTExID0gMHgwMDtcclxuXHQvL0VuZCBvZiBtZXNzYWdlXHJcblx0dmFyIGJ5dGUxMiA9IDB4MGEsXHJcblx0XHRieXRlMTMgPSAweDAwLFxyXG5cdFx0Ynl0ZTE0ID0gMHgwMCxcclxuXHRcdGJ5dGUxNSA9IDB4MDA7XHJcblxyXG5cdHN3aXRjaCh0eXBlKXtcclxuXHRcdGNhc2UgVFlQRV9NT1RPUjpcclxuXHRcdFx0Ly8gTW90b3IgTTFcclxuXHRcdFx0Ly8gZmY6NTUgIDA5OjAwICAwMjowYSAgMDk6NjQgIDAwOjAwICAwMDowMCAgMGFcIlxyXG5cdFx0XHQvLyAweDU1ZmY7MHgwMDA5OzB4MGEwMjsweDA5NjQ7MHgwMDAwOzB4MDAwMDsweDAwMGE7MHgwMDAwO1xyXG5cdFx0XHQvL1wiZmY6NTU6MDk6MDA6MDI6MGE6MDk6MDA6MDA6MDA6MDA6MDA6MGFcIlxyXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowOTo5YzpmZjowMDowMDowMDowYVxyXG5cdFx0XHQvLyBNb3RvciBNMlxyXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowYTo2NDowMDowMDowMDowMDowYVxyXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowYTowMDowMDowMDowMDowMDowYVxyXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowYTo5YzpmZjowMDowMDowMDowYVxyXG5cdFx0XHR2YXIgdGVtcFZhbHVlID0gdmFsdWUgPCAwID8gKHBhcnNlSW50KFwiZmZmZlwiLDE2KSArIE1hdGgubWF4KC0yNTUsdmFsdWUpKSA6IE1hdGgubWluKDI1NSwgdmFsdWUpO1xyXG5cdFx0XHRieXRlNyA9IHRlbXBWYWx1ZSAmIDB4MDBmZjtcdFx0XHRcclxuXHRcdFx0Ynl0ZTggPSAweDAwO1xyXG5cdFx0XHRieXRlOCA9IHRlbXBWYWx1ZSA+Pjg7IFxyXG5cclxuXHRcdFx0LypieXRlNSA9IDB4MGE7XHJcblx0XHRcdGJ5dGU2ID0gMHgwOTtcclxuXHRcdFx0Ynl0ZTcgPSAweDY0O1xyXG5cdFx0XHRieXRlOCA9IDB4MDA7Ki9cclxuXHRcdFx0XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgVFlQRV9SR0I6XHJcblx0XHRcdC8vIGZmOjU1ICAwOTowMCAgMDI6MDggIDA2OjAwICA1Yzo5OSAgNmQ6MDAgIDBhXHJcblx0XHRcdC8vIDB4NTVmZjsweDAwMDk7MHgwODAyOzB4MDAwNjsweDk5NWM7MHgwMDZkOzB4MDAwYTsweDAwMDA7XHJcblx0XHRcdGJ5dGU3ID0gMHgwMDtcclxuXHRcdFx0Ynl0ZTggPSB2YWx1ZT4+OCAmIDB4ZmY7XHJcblx0XHRcdGJ5dGU5ID0gdmFsdWU+PjE2ICYgMHhmZjtcclxuXHRcdFx0Ynl0ZTEwID0gdmFsdWU+PjI0ICYgMHhmZjtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBUWVBFX1NPVU5EOlxyXG5cdFx0XHQvL2ZmOjU1OjA1OjAwOjAyOjIyOjAwOjAwOjBhXHJcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MDY6MDE6MGFcclxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjplZTowMTowYVxyXG5cdFx0XHQvL2ZmOjU1OjA1OjAwOjAyOjIyOjg4OjAxOjBhXHJcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6Yjg6MDE6MGFcclxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjo1ZDowMTowYVxyXG5cdFx0XHQvL2ZmOjU1OjA1OjAwOjAyOjIyOjRhOjAxOjBhXHJcblx0XHRcdC8vZmY6NTU6MDU6MDA6MDI6MjI6MjY6MDE6MGFcclxuXHRcdFx0Ynl0ZTIgPSAweDA1O1xyXG5cdFx0XHRieXRlMyA9IDB4MDA7XHJcblx0XHRcdGJ5dGU0ID0gMHgwMjtcclxuXHRcdFx0Ynl0ZTUgPSAweDIyO1xyXG5cdFx0XHRpZiAodmFsdWUgPT09IDApe1xyXG5cdFx0XHRcdGJ5dGU2ID0gMHgwMDtcclxuXHRcdFx0XHRieXRlNyA9IDB4MDA7XHJcblx0XHRcdH1lbHNle1xyXG5cclxuXHRcdFx0XHRieXRlNiA9IDB4ZWU7XHJcblx0XHRcdFx0Ynl0ZTcgPSAweDAxO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJ5dGU4ID0gMHgwYTtcclxuXHRcdFx0Ynl0ZTEyPSAweDAwO1xyXG5cclxuXHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblx0YnVmVmlld1swXSA9IGJ5dGUxPDw4IHwgYnl0ZTA7XHJcblx0YnVmVmlld1sxXSA9IGJ5dGUzPDw4IHwgYnl0ZTI7XHJcblx0YnVmVmlld1syXSA9IGJ5dGU1PDw4IHwgYnl0ZTQ7XHJcblx0YnVmVmlld1szXSA9IGJ5dGU3PDw4IHwgYnl0ZTY7XHJcblx0YnVmVmlld1s0XSA9IGJ5dGU5PDw4IHwgYnl0ZTg7XHJcblx0YnVmVmlld1s1XSA9IGJ5dGUxMTw8OCB8IGJ5dGUxMDtcclxuXHRidWZWaWV3WzZdID0gYnl0ZTEzPDw4IHwgYnl0ZTEyO1xyXG5cdGJ1ZlZpZXdbN10gPSBieXRlMTU8PDggfCBieXRlMTQ7XHJcblx0Y29uc29sZS5sb2coXHJcblx0XHRcdGJ5dGUwLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTEudG9TdHJpbmcoMTYpK1wiOlwiK1xyXG5cdFx0XHRieXRlMi50b1N0cmluZygxNikrXCI6XCIrXHJcblx0XHRcdGJ5dGUzLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTQudG9TdHJpbmcoMTYpK1wiOlwiK1xyXG5cdFx0XHRieXRlNS50b1N0cmluZygxNikrXCI6XCIrXHJcblx0XHRcdGJ5dGU2LnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTcudG9TdHJpbmcoMTYpK1wiOlwiK1xyXG5cdFx0XHRieXRlOC50b1N0cmluZygxNikrXCI6XCIrXHJcblx0XHRcdGJ5dGU5LnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTEwLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTExLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTEyLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTEzLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTE0LnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0Ynl0ZTE1LnRvU3RyaW5nKDE2KStcIjpcIlxyXG5cdFx0XHQpO1xyXG5cdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRidWZWaWV3WzBdLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0YnVmVmlld1sxXS50b1N0cmluZygxNikrXCI6XCIrXHJcblx0XHRcdGJ1ZlZpZXdbMl0udG9TdHJpbmcoMTYpK1wiOlwiK1xyXG5cdFx0XHRidWZWaWV3WzNdLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0YnVmVmlld1s0XS50b1N0cmluZygxNikrXCI6XCIrXHJcblx0XHRcdGJ1ZlZpZXdbNV0udG9TdHJpbmcoMTYpK1wiOlwiK1xyXG5cdFx0XHRidWZWaWV3WzZdLnRvU3RyaW5nKDE2KStcIjpcIitcclxuXHRcdFx0YnVmVmlld1s3XS50b1N0cmluZygxNilcclxuXHRcdFx0KTtcclxuXHRyZXR1cm4gYnVmO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0J0RFVklDRV9OQU1FJyA6IERFVklDRV9OQU1FLFxyXG5cdCdTRVJWSUNFX1VVSUQnIDogU0VSVklDRV9VVUlELFxyXG5cdCdDSEFSQUNURVJJU1RJQ19VVUlEJyA6IENIQVJBQ1RFUklTVElDX1VVSUQsXHJcblx0J1RZUEVfTU9UT1InIDogVFlQRV9NT1RPUixcclxuXHQnVFlQRV9SR0InIDogVFlQRV9SR0IsXHJcblx0J1RZUEVfU09VTkQnIDogVFlQRV9TT1VORCxcclxuXHQnUE9SVF8xJyA6IFBPUlRfMSxcclxuXHQnUE9SVF8yJyA6IFBPUlRfMixcclxuXHQnUE9SVF8zJyA6IFBPUlRfMyxcclxuXHQnUE9SVF80JyA6IFBPUlRfNCxcclxuXHQnUE9SVF81JyA6IFBPUlRfNSxcclxuXHQnUE9SVF82JyA6IFBPUlRfNixcclxuXHQnUE9SVF83JyA6IFBPUlRfNyxcclxuXHQnUE9SVF84JyA6IFBPUlRfOCxcclxuXHQnTV8xJyA6IE1fMSxcclxuXHQnTV8yJyA6IE1fMixcclxuXHQnZ2VuZXJpY0NvbnRyb2wnIDogZ2VuZXJpY0NvbnRyb2xcclxufTsiLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBtb2RlbCA9IG51bGwsXHJcblx0c29ja2V0ID0gbnVsbDtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZG9SZXF1ZXN0KCRtZERpYWxvZywgY29udGV4dCwgcHdkKXtcclxuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcclxuICAgICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xyXG4gICAgbGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XHJcbiAgICBsZXQgcHJvdG9jb2wgPSBtb2RlbC5pc1NTTCgpID8gJ2h0dHBzJyA6ICdodHRwJztcclxuXHJcblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke3Byb3RvY29sfTovLyR7YWRkcmVzc30vcGFzc3dvcmQvJHtwd2R9YCxteUluaXQpO1xyXG5cdGZldGNoKG15UmVxdWVzdClcclxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XHJcblx0XHQvLyBPbiBuZSByZXRyYWlyZSBwYXMgdW5lIHF1ZXN0aW9uIGTDqWrDoCB0cmFpdMOpZVxyXG5cdFx0aWYgKGpzb24uYXV0aCl7XHJcblx0XHRcdGxvY2FsU3RvcmFnZVsncHdkJ10gPSBwd2Q7XHJcblx0XHRcdHNvY2tldC5zZW5kTWVzc2FnZSh7XHJcblx0XHRcdFx0dHlwZTogJ2JsZScsXHJcblx0XHRcdFx0YWN0aW9uOiAnc3RvcFBoeXNpY2FsV2ViJ1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRpZiAobG9jYXRpb24uc2VhcmNoID09PSBcIlwiKXtcclxuXHRcdFx0XHQkbWREaWFsb2cuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y29udGV4dC5ub3R2YWxpZCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gU2VjdXJlQ3RybCgkbWREaWFsb2csIE1vZGVsU2VydmljZSwgU29ja2V0U2VydmljZSl7XHJcblx0XHJcblx0c29ja2V0ID0gU29ja2V0U2VydmljZTtcclxuXHRtb2RlbCA9IE1vZGVsU2VydmljZTtcclxuXHR0aGlzLm5vdHZhbGlkID0gZmFsc2U7XHJcblx0bGV0IGNvbnRleHQgPSB0aGlzO1xyXG5cclxuXHRtb2RlbC5jaGVja0FkZHJlc3MoKVxyXG5cdC50aGVuKGZ1bmN0aW9uKCl7XHRcdFxyXG5cdFx0aWYgKGxvY2FsU3RvcmFnZVsncHdkJ10pe1xyXG5cdFx0XHRkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBsb2NhbFN0b3JhZ2VbJ3B3ZCddKTtcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHR0aGlzLnRyeSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBjb250ZXh0LnB3ZCk7XHJcblx0fVxyXG5cclxuXHJcbn1cclxuXHJcblNlY3VyZUN0cmwuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ01vZGVsU2VydmljZScsICdTb2NrZXRTZXJ2aWNlJ107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlY3VyZUN0cmw7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBtYm90QXBpID0gcmVxdWlyZSgnLi4vbWJvdC9tYm90Jyk7ICBcclxuXHJcbmZ1bmN0aW9uIGFiMnN0cihidWYpIHtcclxuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDE2QXJyYXkoYnVmKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cjJhYihzdHIpIHtcclxuICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgZm9yIGVhY2ggY2hhclxyXG4gIHZhciBidWZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1Zik7XHJcbiAgZm9yICh2YXIgaT0wLCBzdHJMZW49c3RyLmxlbmd0aDsgaSA8IHN0ckxlbjsgaSsrKSB7XHJcbiAgICBidWZWaWV3W2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgfVxyXG4gIHJldHVybiBidWY7XHJcbn1cclxuXHJcbnZhciBzZXJ2ZXJHQVRUID0gbnVsbCxcclxuXHRzZXJ2aWNlR0FUVCA9IG51bGwsXHJcblx0Y2hhcmFjdGVyaXN0aWNHQVRUID0gbnVsbCxcclxuXHRlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XHJcblxyXG5mdW5jdGlvbiBpbml0QmxlKCl7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2UoeyBcclxuXHRcdFx0ZmlsdGVyczogW3sgbmFtZTogbWJvdEFwaS5ERVZJQ0VfTkFNRSB9XSwgb3B0aW9uYWxTZXJ2aWNlczogW21ib3RBcGkuU0VSVklDRV9VVUlEXVxyXG5cdFx0fSlcclxuXHRcdC50aGVuKGZ1bmN0aW9uKGRldmljZSkge1xyXG5cdFx0ICAgY29uc29sZS5sb2coXCJDb25uZWN0aW5nLi4uXCIpO1xyXG5cdFx0ICAgcmV0dXJuIGRldmljZS5nYXR0LmNvbm5lY3QoKTtcclxuXHRcdCB9KVxyXG5cdFx0LnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XHJcblx0XHRcdHNlcnZlckdBVFQgPSBzZXJ2ZXI7XHJcblx0XHRcdC8vcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShzZXJ2aWNlVVVJRCk7XHJcblx0XHQgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgdGltZW91dCB3aGVuIEdhdHRTZXJ2aWNlcyBwcm9wZXJ0eSB3b3JrcyBhcyBpbnRlbmRlZC5cclxuXHRcdCAgIC8vIGNyYnVnLmNvbS81NjAyNzdcclxuXHRcdCAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlU2VydmljZSwgcmVqZWN0U2VydmljZSkge1xyXG5cdFx0ICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgICBcdHRyeXtcclxuXHRcdCAgICAgXHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBTZXJ2aWNlXCIpO1xyXG5cdFx0ICAgICAgIFx0XHRyZXNvbHZlU2VydmljZShzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UobWJvdEFwaS5TRVJWSUNFX1VVSUQpKTtcclxuXHRcdCAgICAgXHR9Y2F0Y2goZXJyKXtcclxuXHRcdCAgICAgXHRcdHJlamVjdFNlcnZpY2UoZXJyKTtcclxuXHRcdCAgICAgXHR9XHJcblx0XHQgICAgIH0sIDJlMyk7XHJcblx0XHQgICB9KVxyXG5cdFx0fSkudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcclxuXHRcdFx0c2VydmljZUdBVFQgPSBzZXJ2aWNlO1xyXG5cdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1x0XHRcdFxyXG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcclxuXHRcdFx0cmVqZWN0KGVycm9yKTtcclxuXHRcdH0pO1xyXG5cdH0pXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZXJ2aWNlKCl7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRpZiAoc2VydmVyR0FUVCAmJiBzZXJ2ZXJHQVRULmNvbm5lY3RlZCAmJiBzZXJ2aWNlR0FUVCl7XHJcblx0XHRcdHJlc29sdmUoc2VydmljZUdBVFQpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGluaXRCbGUoKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcclxuXHRcdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xyXG5cdFx0XHRcdHJlamVjdChlcnJvcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaGFyYWN0ZXJpc3RpYygpe1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0aWYgKGNoYXJhY3RlcmlzdGljR0FUVCl7XHJcblx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXN0aWNHQVRUKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRnZXRTZXJ2aWNlKClcclxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IENoYXJhY3Rlcml0aWMgOiAlT1wiLHNlcnZpY2UpO1xyXG5cdFx0XHRcdHJldHVybiBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKG1ib3RBcGkuQ0hBUkFDVEVSSVNUSUNfVVVJRCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3Rlcml0aWMpe1xyXG5cdFx0XHRcdGNoYXJhY3RlcmlzdGljR0FUVCA9IGNoYXJhY3Rlcml0aWM7XHJcblx0XHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpdGljKTtcclxuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xyXG5cdFx0XHRcdHJlamVjdChlcnJvcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWModHlwZSwgZGF0YSl7XHJcblx0Z2V0Q2hhcmFjdGVyaXN0aWMoKVxyXG5cdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3RlcmlzdGljKXtcclxuXHRcdGlmICh0eXBlID09PSAnd3JpdGUnKXtcdFx0XHRcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gd3JpdGUgdmFsdWUgOiAlT1wiLGNoYXJhY3RlcmlzdGljKTtcclxuXHRcdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoZGF0YSk7XHJcblx0XHR9XHJcblx0fSkudGhlbihmdW5jdGlvbihidWZmZXIpe1xyXG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1xyXG5cdFx0XHRjb25zb2xlLmluZm8oXCJXcml0ZSBkYXRhcyAhIFwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgZGF0YSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xyXG5cdFx0ICAgIGxldCBkYXRhRGVjcnlwdCA9IGRhdGEuZ2V0VWludDgoMCk7XHJcblx0XHQgICAgY29uc29sZS5sb2coJ1JlY2VpdmVEYXRhcyAlcycsIGRhdGFEZWNyeXB0KTtcclxuXHRcdH1cclxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XHJcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcdFx0XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NNb3RvcnModmFsdWVNMSwgdmFsdWVNMil7XHJcblx0Z2V0Q2hhcmFjdGVyaXN0aWMoKVxyXG5cdC50aGVuKGNoYXJhY3RlcmlzdGljID0+e1xyXG5cdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8xLCAwLCB2YWx1ZU0xKSk7XHJcblx0fSkudGhlbigoKT0+e1xyXG5cdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljR0FUVC53cml0ZVZhbHVlKG1ib3RBcGkuZ2VuZXJpY0NvbnRyb2wobWJvdEFwaS5UWVBFX01PVE9SLCBtYm90QXBpLk1fMiwgMCwgdmFsdWVNMikpO1xyXG5cdH0pLnRoZW4oKCk9PntcclxuXHRcdGNvbnNvbGUuaW5mbyhcIldyaXRlIGRhdGFzICEgXCIpO1xyXG5cdH0pLmNhdGNoKGVycm9yID0+e1xyXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBCbGVDb250cm9sbGVyKCRtZERpYWxvZyl7XHJcblxyXG5cdHRoaXMuc2xpZGVyQWN0aXYgPSBmYWxzZTtcclxuXHR0aGlzLmN1cnJlbnRUaW1lciA9IG51bGw7XHJcblx0dGhpcy5wb3dlciA9IDEyNTtcclxuXHR0aGlzLnJlZCA9IDA7XHJcblxyXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5zdG9wKCk7XHJcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xyXG5cdH0gXHJcblxyXG5cdHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJvblwiKTtcclxuXHR9XHJcblxyXG5cdHRoaXMudXAgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRjb25zb2xlLmxvZyhcInVwXCIpO1xyXG5cdFx0cHJvY2Vzc01vdG9ycygtMTAwLDEwMCk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmRvd24gPSBmdW5jdGlvbigpe1xyXG5cdFx0Y29uc29sZS5sb2coXCJkb3duXCIpO1xyXG5cdFx0cHJvY2Vzc01vdG9ycygxMDAsLTEwMCk7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMubGVmdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRjb25zb2xlLmxvZyhcImxlZnRcIik7XHJcblx0XHRwcm9jZXNzTW90b3JzKDEwMCwxMDApO1xyXG5cdH07XHJcblxyXG5cdHRoaXMucmlnaHQgPSBmdW5jdGlvbigpe1xyXG5cdFx0Y29uc29sZS5sb2coXCJyaWdodFwiKTtcclxuXHRcdHByb2Nlc3NNb3RvcnMoLTEwMCwtMTAwKTtcclxuXHR9O1xyXG5cclxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbigpe1xyXG5cdFx0Y29uc29sZS5sb2coXCJzdG9wXCIpO1xyXG5cdFx0cHJvY2Vzc01vdG9ycygwLDApO1xyXG5cdH1cclxuXHJcblx0dGhpcy5jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uKHJlZCxibHVlLGdyZWVuKXsgXHJcblx0XHRjb25zb2xlLmxvZyhcIkNoYW5nZSBDb2xvciA6ICVkLCVkLCVkXCIscmVkLGdyZWVuLGJsdWUpO1xyXG5cdFx0dmFyIHJIZXggPSByZWQ8PDg7XHJcblx0XHR2YXIgZ0hleCA9IGdyZWVuPDwxNjtcclxuXHRcdHZhciBiSGV4ID0gYmx1ZTw8MjQ7XHJcblx0XHR2YXIgdmFsdWUgPSBySGV4IHwgZ0hleCB8IGJIZXg7XHJcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgbWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfUkdCLG1ib3RBcGkuUE9SVF82LDAsdmFsdWUpKTtcclxuXHRcdC8vcHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwiYnJpZ2h0OlwiK3RoaXMucG93ZXIpO1xyXG5cdH07XHJcblxyXG5cclxufVxyXG5cclxuQmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnXVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxlQ29udHJvbGxlcjsvKntcclxuXHR3cml0ZURhdGEgOiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWNcclxufSovXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgc29ja2V0ID0gbnVsbDtcclxuXHJcbi8vIFRoZSBoYW5kbGVyXHJcbnZhciBkZXZpY2VMaWdodEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdC8vIFRoZSB2YWx1ZSB3aWxsIGxpdmUgYmV0d2VlbiAwIGFuZCB+MTUwXHJcblx0Ly8gQnV0IHdoZW4gaXQgaXMgNDUgaXMgYSBoaWdoIGx1bW9uc2l0eVxyXG5cdHZhciB2YWx1ZSA9IE1hdGgubWluKDQ1LCBldmVudC52YWx1ZSk7ICAgICAgICBcclxuXHRsZXQgcGVyY2VudCA9IE1hdGgucm91bmQoKHZhbHVlIC8gNDUpICogMTAwKTsgICAgICAgXHJcblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnbGlnaHQnLCB2YWx1ZSA6IHBlcmNlbnR9KTtcclxufVxyXG5cclxuLy8gV2UgYWRkIHRoZSBsaXN0ZW5lclxyXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VsaWdodCcsIGRldmljZUxpZ2h0SGFuZGxlciwgZmFsc2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XHJcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExpZ2h0Q29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XHJcblxyXG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XHJcblxyXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcclxuXHRcdHJlZ2lzdGVyKCk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcclxuXHRcdHVucmVnaXN0ZXIoKTtcclxuXHRcdCRtZERpYWxvZy5oaWRlKCk7XHJcblx0fVxyXG59XHJcblxyXG5MaWdodENvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpZ2h0Q29udHJvbGVyOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBzb2NrZXQgPSBudWxsLCBcclxuXHRmaXJzdFZhbHVlID0gLTE7XHJcblxyXG4vLyBUaGUgaGFuZGxlciBvZiB0aGUgZXZlbnRcclxudmFyIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7ICAgICAgICBcclxuXHR2YXIgYWxwaGEgPSBNYXRoLnJvdW5kKGV2ZW50LmFscGhhKTtcclxuXHR2YXIgYmV0YSA9IE1hdGgucm91bmQoZXZlbnQuYmV0YSk7XHJcblx0dmFyIGdhbW1hID0gTWF0aC5yb3VuZChldmVudC5nYW1tYSk7XHJcblx0aWYgKGZpcnN0VmFsdWUgPT09IC0xKXtcclxuXHRcdGZpcnN0VmFsdWUgPSBhbHBoYTtcclxuXHR9XHJcblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnb3JpZW50YXRpb24nLCB2YWx1ZSA6IGFscGhhLCAnZmlyc3RWYWx1ZScgOiBmaXJzdFZhbHVlfSk7XHRcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcclxuXHRmaXJzdFZhbHVlID0gLTE7XHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XHJcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBPcmllbnRhdGlvbkNvbnRyb2xlcigkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xyXG5cclxuXHRzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xyXG5cclxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRyZWdpc3RlcigpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHR1bnJlZ2lzdGVyKCk7XHJcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xyXG5cdH1cclxufVxyXG5cclxuT3JpZW50YXRpb25Db250cm9sZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJ1NvY2tldFNlcnZpY2UnXVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3JpZW50YXRpb25Db250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgbW9kZWwgPSBudWxsLFxyXG4gICAgc29ja2V0ID0gbnVsbDtcclxuXHJcbi8vIFRoZSBsaXN0ZW5lclxyXG52YXIgZGV2aWNlUHJveGltaXR5SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0dmFyIHZhbHVlID0gTWF0aC5yb3VuZChldmVudC52YWx1ZSk7ICAgICAgICBcclxuXHRpZiAodmFsdWUgPT09IDApe1xyXG4gICAgICAgIHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ3ZvaWNlJywgdmFsdWUgOiAnc3RhcnQnfSk7XHJcblx0XHQvKmxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xyXG5cdFx0bGV0IHNjaGVtZSA9IG1vZGVsLmlzU1NMKCkgID8gXCJodHRwc1wiIDogXCJodHRwXCI7XHJcblx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbD9zcGVlY2gjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcuY2hyb21pdW0uY2hyb21lO2VuZGA7Ki9cclxuXHR9ICAgIFxyXG5cdC8vc29ja2V0LnNlbmRQcm94aW1pdHkodmFsdWUpO1xyXG5cdC8vbWFuYWdlUHJveGltaXR5VmFsdWUodmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vwcm94aW1pdHknLCBkZXZpY2VQcm94aW1pdHlIYW5kbGVyLCBmYWxzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcclxuXHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZGV2aWNlcHJveGltaXR5JywgZGV2aWNlUHJveGltaXR5SGFuZGxlciwgZmFsc2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBQcm94aW1pdHlDb250cm9sZXIoJG1kRGlhbG9nLCBNb2RlbFNlcnZpY2UsIFNvY2tldFNlcnZpY2Upe1xyXG5cclxuXHRtb2RlbCA9IE1vZGVsU2VydmljZTtcclxuICAgIHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XHJcblxyXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcclxuXHRcdGlmICh3aW5kb3cuRGV2aWNlUHJveGltaXR5RXZlbnQpe1xyXG5cclxuXHRcdFx0cmVnaXN0ZXIoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcclxuXHRcdFx0bGV0IHNjaGVtZSA9IG1vZGVsLmlzU1NMKCkgID8gXCJodHRwc1wiIDogXCJodHRwXCI7XHJcblx0XHRcdC8vd2luZG93LmxvY2F0aW9uID0gYGludGVudDovLzEwLjMzLjQ0LjE4MTozMDAwL2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGA7XHJcblx0XHRcdHdpbmRvdy5vcGVuKGBpbnRlbnQ6Ly8ke2FkZHJlc3N9L2FkZG9uL2luZGV4X2FwcC5odG1sP3Byb3hpbWl0eSNJbnRlbnQ7c2NoZW1lPSR7c2NoZW1lfTtwYWNrYWdlPW9yZy5tb3ppbGxhLmZpcmVmb3hfYmV0YTtlbmRgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuZ29Ub0Nocm9tZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcclxuXHRcdGxldCBzY2hlbWUgPSBtb2RlbC5pc1NTTCgpICA/IFwiaHR0cHNcIiA6IFwiaHR0cFwiO1xyXG5cdFx0Ly93aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vMTAuMzMuNDQuMTgxOjMwMDAvYWRkb24vaW5kZXhfYXBwLmh0bWwjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcubW96aWxsYS5maXJlZm94X2JldGE7ZW5kYDtcclxuXHRcdHdpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8ke2FkZHJlc3N9L2FkZG9uL2luZGV4X2FwcC5odG1sI0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLmNocm9taXVtLmNocm9tZTthY3Rpb249YW5kcm9pZC5pbnRlbnQuYWN0aW9uLlZJRVc7bGF1bmNoRmxhZ3M9MHgxMDAwMDAwMDtlbmRgO1xyXG5cdH1cclxuXHJcblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHR1bnJlZ2lzdGVyKCk7XHJcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xyXG5cdH1cclxufVxyXG5cclxuUHJveGltaXR5Q29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdNb2RlbFNlcnZpY2UnLCAnU29ja2V0U2VydmljZSddO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcm94aW1pdHlDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHNvY2tldCA9IG51bGwsXHJcbiAgdmlkZW9FbGVtZW50ID0gbnVsbCxcclxuICBjYW52YXMgPSBudWxsLCBcclxuICB2aWRlb1NvdXJjZSA9IG51bGwsXHJcbiAgc2VsZWN0b3JzID0gbnVsbDtcclxuXHJcbiBcclxuXHJcbmZ1bmN0aW9uIGdvdERldmljZXMoZGV2aWNlSW5mb3MpIHtcclxuICB2YXIgdGVtcFZpZGVvU291cmNlID0gbnVsbDtcclxuICBkZXZpY2VJbmZvcy5mb3JFYWNoKGZ1bmN0aW9uKGRldmljZSl7XHJcbiAgICBpZiAoZGV2aWNlLmtpbmQgPT09ICd2aWRlb2lucHV0Jyl7XHJcbiAgICAgIHRlbXBWaWRlb1NvdXJjZSA9IGRldmljZS5kZXZpY2VJZDtcclxuICAgICAgaWYoIGRldmljZS5sYWJlbC5pbmRleE9mKCdiYWNrJykgIT0gMCl7XHJcbiAgICAgICAgdmlkZW9Tb3VyY2UgPSBkZXZpY2UuZGV2aWNlSWQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBpZiAodmlkZW9Tb3VyY2UgPT09IG51bGwpe1xyXG4gICAgdmlkZW9Tb3VyY2UgPSB0ZW1wVmlkZW9Tb3VyY2U7XHJcbiAgfSAgXHJcbn1cclxuXHJcbm5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpXHJcbiAgLnRoZW4oZ290RGV2aWNlcylcclxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubmFtZSArIFwiOiBcIiArIGVyci5tZXNzYWdlKTtcclxuICB9KTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCl7XHJcbiAgaWYgKHdpbmRvdy5zdHJlYW0pIHtcclxuICAgIHdpbmRvdy5zdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xyXG4gICAgICB0cmFjay5zdG9wKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgdmFyIGNvbnN0cmFpbnRzID0ge1xyXG4gICAgYXVkaW8gOiBmYWxzZSxcclxuICAgIHZpZGVvOiB7ZGV2aWNlSWQ6IHZpZGVvU291cmNlID8ge2V4YWN0OiB2aWRlb1NvdXJjZX0gOiB1bmRlZmluZWR9XHJcbiAgfTtcclxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cykudGhlbihzdWNjZXNzQ2FsbGJhY2spLmNhdGNoKGVycm9yQ2FsbGJhY2spO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHN0cmVhbSkge1xyXG4gIHdpbmRvdy5zdHJlYW0gPSBzdHJlYW07IC8vIG1ha2Ugc3RyZWFtIGF2YWlsYWJsZSB0byBjb25zb2xlXHJcbiAgaWYgKCF2aWRlb0VsZW1lbnQpe1xyXG4gICAgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVZpZGVvXCIpO1xyXG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcclxuICB9XHJcbiAgdmlkZW9FbGVtZW50LnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XHJcbiAgdmlkZW9FbGVtZW50Lm9ubG9hZGVkbWV0YWRhdGEgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB2aWRlb0VsZW1lbnQucGxheSgpO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVycm9yQ2FsbGJhY2soZXJyb3Ipe1xyXG4gICAgY29uc29sZS5sb2coXCJuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIGVycm9yOiBcIiwgZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWdpc3Rlcigpe1xyXG4gICAgICBzdGFydCgpO1xyXG4gICAgICBcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XHJcbiAgICAgIGlmICh2aWRlb0VsZW1lbnQpIHtcclxuICAgICAgICB2aWRlb0VsZW1lbnQucGF1c2UoKTtcclxuICAgICAgICB2aWRlb0VsZW1lbnQuc3JjID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgICAgICBcclxuICAgIH1cclxuXHJcbmZ1bmN0aW9uIENhbWVyYUN0cmwoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcclxuICBzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xyXG5cclxuICB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VmlkZW9cIik7XHJcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcclxuXHJcbiAgdGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xyXG4gICAgcmVnaXN0ZXIoKTtcclxuICB9XHJcblxyXG4gIHRoaXMucGhvdG8gPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvRWxlbWVudC52aWRlb1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHZpZGVvRWxlbWVudC52aWRlb0hlaWdodDtcclxuICAgIGNvbnRleHQuZHJhd0ltYWdlKHZpZGVvRWxlbWVudCwgMCwgMCwgdmlkZW9FbGVtZW50LnZpZGVvV2lkdGgsIHZpZGVvRWxlbWVudC52aWRlb0hlaWdodCk7XHJcbiAgXHJcbiAgICB2YXIgZGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xyXG4gICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICBzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd1c2VybWVkaWEnLCB2YWx1ZSA6IGRhdGF9KTsgICAgICBcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB1bnJlZ2lzdGVyKCk7XHJcbiAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gIH1cclxufVxyXG5cclxuQ2FtZXJhQ3RybC4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYUN0cmw7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgc29ja2V0ID0gbnVsbDtcclxudmFyIFNwZWVjaFJlY29nbml0aW9uID0gU3BlZWNoUmVjb2duaXRpb24gfHwgd2Via2l0U3BlZWNoUmVjb2duaXRpb25cclxudmFyIFNwZWVjaEdyYW1tYXJMaXN0ID0gU3BlZWNoR3JhbW1hckxpc3QgfHwgd2Via2l0U3BlZWNoR3JhbW1hckxpc3RcclxudmFyIFNwZWVjaFJlY29nbml0aW9uRXZlbnQgPSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHx8IHdlYmtpdFNwZWVjaFJlY29nbml0aW9uRXZlbnRcclxuXHJcbi8vdmFyIGdyYW1tYXIgPSAnI0pTR0YgVjEuMDsgZ3JhbW1hciBjb2xvcnM7IHB1YmxpYyA8Y29sb3I+ID0gYXF1YSB8IGF6dXJlIHwgYmVpZ2UgfCBiaXNxdWUgfCBibGFjayB8IGJsdWUgfCBicm93biB8IGNob2NvbGF0ZSB8IGNvcmFsIHwgY3JpbXNvbiB8IGN5YW4gfCBmdWNoc2lhIHwgZ2hvc3R3aGl0ZSB8IGdvbGQgfCBnb2xkZW5yb2QgfCBncmF5IHwgZ3JlZW4gfCBpbmRpZ28gfCBpdm9yeSB8IGtoYWtpIHwgbGF2ZW5kZXIgfCBsaW1lIHwgbGluZW4gfCBtYWdlbnRhIHwgbWFyb29uIHwgbW9jY2FzaW4gfCBuYXZ5IHwgb2xpdmUgfCBvcmFuZ2UgfCBvcmNoaWQgfCBwZXJ1IHwgcGluayB8IHBsdW0gfCBwdXJwbGUgfCByZWQgfCBzYWxtb24gfCBzaWVubmEgfCBzaWx2ZXIgfCBzbm93IHwgdGFuIHwgdGVhbCB8IHRoaXN0bGUgfCB0b21hdG8gfCB0dXJxdW9pc2UgfCB2aW9sZXQgfCB3aGl0ZSB8IHllbGxvdyA7J1xyXG52YXIgcmVjb2duaXRpb24gPSBuZXcgU3BlZWNoUmVjb2duaXRpb24oKTtcclxuLy92YXIgc3BlZWNoUmVjb2duaXRpb25MaXN0ID0gbmV3IFNwZWVjaEdyYW1tYXJMaXN0KCk7XHJcbi8vc3BlZWNoUmVjb2duaXRpb25MaXN0LmFkZEZyb21TdHJpbmcoZ3JhbW1hciwgMSk7XHJcbi8vcmVjb2duaXRpb24uZ3JhbW1hcnMgPSBzcGVlY2hSZWNvZ25pdGlvbkxpc3Q7XHJcbnJlY29nbml0aW9uLmNvbnRpbnVvdXMgPSB0cnVlO1xyXG5yZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcclxucmVjb2duaXRpb24uaW50ZXJpbVJlc3VsdHMgPSB0cnVlO1xyXG4vL3JlY29nbml0aW9uLm1heEFsdGVybmF0aXZlcyA9IDE7XHJcblxyXG4vL3ZhciBkaWFnbm9zdGljID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm91dHB1dCcpO1xyXG4vL3ZhciBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcclxuXHJcbmRvY3VtZW50LmJvZHkub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gIHJlY29nbml0aW9uLnN0YXJ0KCk7XHJcbiAgY29uc29sZS5sb2coJ1JlYWR5IHRvIHJlY2VpdmUgYSBjb2xvciBjb21tYW5kLicpO1xyXG59XHJcblxyXG5yZWNvZ25pdGlvbi5vbnJlc3VsdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgLy8gVGhlIFNwZWVjaFJlY29nbml0aW9uRXZlbnQgcmVzdWx0cyBwcm9wZXJ0eSByZXR1cm5zIGEgU3BlZWNoUmVjb2duaXRpb25SZXN1bHRMaXN0IG9iamVjdFxyXG4gIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdExpc3Qgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0IG9iamVjdHMuXHJcbiAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XHJcbiAgLy8gVGhlIGZpcnN0IFswXSByZXR1cm5zIHRoZSBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBhdCBwb3NpdGlvbiAwLlxyXG4gIC8vIEVhY2ggU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0IGNvbnRhaW5zIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgb2JqZWN0cyB0aGF0IGNvbnRhaW4gaW5kaXZpZHVhbCByZXN1bHRzLlxyXG4gIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxyXG4gIC8vIFRoZSBzZWNvbmQgWzBdIHJldHVybnMgdGhlIFNwZWVjaFJlY29nbml0aW9uQWx0ZXJuYXRpdmUgYXQgcG9zaXRpb24gMC5cclxuICAvLyBXZSB0aGVuIHJldHVybiB0aGUgdHJhbnNjcmlwdCBwcm9wZXJ0eSBvZiB0aGUgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3QgXHJcbiAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xyXG4gIC8vZGlhZ25vc3RpYy50ZXh0Q29udGVudCA9ICdSZXN1bHQgcmVjZWl2ZWQ6ICcgKyBjb2xvciArICcuJztcclxuICAvL2JnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gIGNvbnNvbGUubG9nKCdDb25maWRlbmNlOiAnICsgZmluYWxTdHIpO1xyXG4gIGlmIChmaW5hbFN0ci5pbmRleE9mKCdzdWl2YW50JykgIT0gLTEpe1xyXG4gIFx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICduZXh0J30pO1xyXG4gIH1lbHNlIGlmIChmaW5hbFN0ci5pbmRleE9mKCdwcsOpY8OpZGVudCcpICE9IC0xKXtcclxuICBcdHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ3ZvaWNlJywgdmFsdWUgOiAncHJldid9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIFdlIGRldGVjdCB0aGUgZW5kIG9mIHNwZWVjaFJlY29nbml0aW9uIHByb2Nlc3NcclxuICAgICAgcmVjb2duaXRpb24ub25lbmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdFbmQgb2YgcmVjb2duaXRpb24nKVxyXG4gICAgICAgIHJlY29nbml0aW9uLnN0b3AoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFdlIGRldGVjdCBlcnJvcnNcclxuICAgICAgcmVjb2duaXRpb24ub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmVycm9yID09ICduby1zcGVlY2gnKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gU3BlZWNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudC5lcnJvciA9PSAnYXVkaW8tY2FwdHVyZScpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBtaWNyb3Bob25lJylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50LmVycm9yID09ICdub3QtYWxsb3dlZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3QgQWxsb3dlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTsgICAgIFxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xyXG5cdHJlY29nbml0aW9uLnN0b3AoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFZvaWNlQ29udHJvbGVyKCRtZERpYWxvZywgU29ja2V0U2VydmljZSl7XHJcblxyXG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XHJcblxyXG5cdHJlY29nbml0aW9uLnN0YXJ0KCk7XHJcblx0XHJcblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHR1bnJlZ2lzdGVyKCk7XHJcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblZvaWNlQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVm9pY2VDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG52YXIgc29ja2V0ID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIFNvY2tldFNlcnZpY2UoKXtcclxuXHJcblx0dGhpcy5jb25uZWN0ID0gZnVuY3Rpb24obW9kZWwpe1xyXG5cclxuXHRcdG1vZGVsLmNoZWNrQWRkcmVzcygpXHJcblx0XHQudGhlbihmdW5jdGlvbigpe1xyXG5cdFx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldElvQWRkcmVzcygpO1xyXG5cdFx0XHRsZXQgcHJvdG9jb2wgPSBtb2RlbC5pc1NTTCgpID8gJ2h0dHBzJyA6ICdodHRwJztcclxuXHRcdFx0c29ja2V0ID0gaW8oYCR7cHJvdG9jb2x9Oi8vJHthZGRyZXNzfWApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHRoaXMuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xyXG5cdFx0c29ja2V0LmVtaXQoJ3NlbnNvcicsIG1zZyk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmdldFNvY2tldCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gc29ja2V0O1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29ja2V0U2VydmljZTsiLCIndXNlIHN0cmljdCdcclxuXHJcbnZhciBhZGRyZXNzID0gbnVsbCxcclxuXHRpb0FkZHJlc3MgPSBudWxsLFxyXG5cdHNzbCA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0aWYgKGFkZHJlc3Mpe1xyXG5cdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG5cdFx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcclxuXHQgICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcclxuXHQgICAgICAgICAgIG1vZGU6ICdjb3JzJyxcclxuXHQgICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcclxuXHQgICAgbGV0IHByb3RvY29sID0gJyc7XHJcblx0ICAgIGxldCBzY2hlbWUgPSAnJ1xyXG5cdCAgICBsZXQgYmFzaWNIb3N0ID0gJydcclxuXHQgICAgaWYgKGxvY2F0aW9uLmhvc3QgJiYgbG9jYXRpb24uaG9zdC5pbmRleE9mKCdsb2NhbGhvc3QnKSA9PT0gLTEpe1xyXG5cdCAgICBcdHByb3RvY29sID0gJ2h0dHBzJztcclxuXHQgICAgXHRzY2hlbWUgPSAnOi8vJztcclxuXHQgICAgXHRiYXNpY0hvc3QgPSAnYmlub21lZC5mcjo4NDQzJztcclxuXHQgICAgfVxyXG5cclxuXHRcdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtwcm90b2NvbH0ke3NjaGVtZX0ke2Jhc2ljSG9zdH0vaXBgLG15SW5pdCk7XHJcblx0XHRmZXRjaChteVJlcXVlc3QpXHJcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0XHR9KVxyXG5cdFx0LnRoZW4oZnVuY3Rpb24oanNvbil7XHJcblx0XHRcdGxldCBuZXR3b3JrID0ganNvbjtcclxuXHJcblx0XHRcdGlmICgobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKVxyXG4gICAgICAgICAgICAgfHwgbG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnKXtcclxuXHRcdFx0XHRsZXQgd2xhbjAgPSBuZXR3b3JrLmZpbmQoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudC5uYW1lID09PSAnd2xhbjAnO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmIChsb2NhdGlvbi5wb3J0ID09PSBcIjg0NDNcIil7XHJcblx0XHRcdFx0XHRhZGRyZXNzID0gXCJsb2NhbGhvc3Q6ODQ0M1wiO1xyXG5cdFx0XHRcdFx0aW9BZGRyZXNzID0gXCJsb2NhbGhvc3Q6ODQ0M1wiO1xyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHdsYW4wICYmIGxvY2F0aW9uLmhvc3RuYW1lICE9ICdsb2NhbGhvc3QnKXtcclxuXHRcdFx0XHRcdGFkZHJlc3MgPSBgJHt3bGFuMC5pcH06MzAwMGA7XHJcblx0XHRcdFx0XHRpb0FkZHJlc3MgPSBgJHt3bGFuMC5pcH06ODQ0M2A7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRhZGRyZXNzID0gXCJsb2NhbGhvc3Q6MzAwMFwiO1xyXG5cdFx0XHRcdFx0aW9BZGRyZXNzID0gXCJsb2NhbGhvc3Q6ODQ0M1wiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCI4NDQzXCIpe1xyXG5cdFx0XHRcdGFkZHJlc3MgPSBcImJpbm9tZWQuZnI6ODQ0M1wiO1xyXG5cdFx0XHRcdGlvQWRkcmVzcyA9IFwiYmlub21lZC5mcjo4NDQzXCI7XHJcblx0XHRcdFx0c3NsID0gdHJ1ZTtcclxuXHRcdFx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgKGxvY2F0aW9uLnBvcnQgPT09IFwiODBcIiB8fCBsb2NhdGlvbi5wb3J0ID09PSBcIlwiKSl7XHJcblx0XHRcdFx0YWRkcmVzcyA9IFwiYmlub21lZC5mcjo4NDQzXCI7XHJcblx0XHRcdFx0aW9BZGRyZXNzID0gXCJiaW5vbWVkLmZyOjg0NDNcIjtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWRkcmVzcyA9IG51bGw7XHJcblx0XHRcdH0gXHJcblx0XHRcdHJlc29sdmUoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG5jYWxjdWxhdGVBZGRyZXNzKCk7XHJcblxyXG5cclxuZnVuY3Rpb24gTW9kZWxTZXJ2aWNlKCl7XHJcblxyXG5cdHRoaXMuaXNTU0wgPSBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIHNzbDtcclxuXHR9XHJcblxyXG5cdHRoaXMuZ2V0QWRkcmVzcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gYWRkcmVzcztcclxuXHR9XHRcclxuXHJcblx0dGhpcy5nZXRJb0FkZHJlc3MgPSBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGlvQWRkcmVzcztcclxuXHR9XHJcblxyXG5cdHRoaXMuY2hlY2tBZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcztcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWxTZXJ2aWNlOyJdfQ==
