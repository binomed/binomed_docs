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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9tYm90L21ib3QuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZWN1cmUvc2VjdXJlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9ibHVldG9vdGguanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL2xpZ2h0LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlbnNvcnMvcHJveGltaXR5LmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc2Vuc29ycy91c2VybWVkaWEuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zZW5zb3JzL3ZvaWNlLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvc29ja2V0L3NvY2tldHMuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC91dGlsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXIubW9kdWxlKFwiU3VwZXJQb3dlckFwcFwiLCBbJ25nTWF0ZXJpYWwnXSlcbi5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG4gICAgLnByaW1hcnlQYWxldHRlKCdyZWQnKVxuICAgIC5hY2NlbnRQYWxldHRlKCdvcmFuZ2UnKTtcbn0pXG4uc2VydmljZSgnU29ja2V0U2VydmljZScsIHJlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKSlcbi5zZXJ2aWNlKCdNb2RlbFNlcnZpY2UnLCByZXF1aXJlKCcuL3V0aWwvbW9kZWwnKSlcbi5kaXJlY3RpdmUoJ2pmVG91Y2hzdGFydCcsIFtmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcblxuICAgICAgICBlbGVtZW50Lm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbChhdHRyLmpmVG91Y2hzdGFydCk7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XSkuZGlyZWN0aXZlKCdqZlRvdWNoZW5kJywgW2Z1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuXG4gICAgICAgIGVsZW1lbnQub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbChhdHRyLmpmVG91Y2hlbmQpOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufV0pXG4uZGlyZWN0aXZlKCdqZkNvbG9ycGlja2VyJywgW2Z1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cil7XG5cdFx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdGltZy5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL2NvbG9yLXdoZWVsLnBuZydcblx0XHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0ICB2YXIgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG5cdFx0ICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0ICBjYW52YXMud2lkdGggPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuXHRcdCAgY2FudmFzLmhlaWdodCA9IDE1MCAqIGRldmljZVBpeGVsUmF0aW87XG5cdFx0ICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjE1MHB4XCI7XG5cdFx0ICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxNTBweFwiO1xuXHRcdCAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0ICAgIC8vIFJlZnJlc2ggY2FudmFzIGluIGNhc2UgdXNlciB6b29tcyBhbmQgZGV2aWNlUGl4ZWxSYXRpbyBjaGFuZ2VzLlxuXHRcdCAgICBjYW52YXMud2lkdGggPSAxNTAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuXHRcdCAgICBjYW52YXMuaGVpZ2h0ID0gMTUwICogZGV2aWNlUGl4ZWxSYXRpbztcblx0XHQgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG5cdFx0ICAgIHZhciByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdCAgICB2YXIgeCA9IE1hdGgucm91bmQoKGV2dC5jbGllbnRYIC0gcmVjdC5sZWZ0KSAqIGRldmljZVBpeGVsUmF0aW8pO1xuXHRcdCAgICB2YXIgeSA9IE1hdGgucm91bmQoKGV2dC5jbGllbnRZIC0gcmVjdC50b3ApICogZGV2aWNlUGl4ZWxSYXRpbyk7XG5cdFx0ICAgIHZhciBkYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KS5kYXRhO1xuXG5cdFx0ICAgIHZhciByID0gZGF0YVsoKGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0XTtcblx0XHQgICAgdmFyIGcgPSBkYXRhWygoY2FudmFzLndpZHRoICogeSkgKyB4KSAqIDQgKyAxXTtcblx0XHQgICAgdmFyIGIgPSBkYXRhWygoY2FudmFzLndpZHRoICogeSkgKyB4KSAqIDQgKyAyXTtcblx0XHQgICAgXG5cdFx0ICAgIHNjb3BlLiRldmFsKGF0dHIuamZDb2xvcnBpY2tlciwge1xuXHRcdCAgICBcdHJlZDpyLFxuXHRcdCAgICBcdGJsdWU6Yixcblx0XHQgICAgXHRncmVlbjpnXG5cdFx0ICAgIH0pOyBcblx0XHQgICAgXG5cblx0XHQgICAgY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHQgICAgY29udGV4dC5hcmMoeCwgeSArIDIsIDEwICogZGV2aWNlUGl4ZWxSYXRpbywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcblx0XHQgICAgY29udGV4dC5zaGFkb3dDb2xvciA9ICcjMzMzJztcblx0XHQgICAgY29udGV4dC5zaGFkb3dCbHVyID0gNCAqIGRldmljZVBpeGVsUmF0aW87XG5cdFx0ICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHQgICAgY29udGV4dC5maWxsKCk7XG5cdFx0ICB9KTtcblxuXHRcdCAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdH1cblx0fTtcbn1dKVxuLmRpcmVjdGl2ZSgnYXBwJywgWyckbWREaWFsb2cnLCAnJHRpbWVvdXQnLCAnU29ja2V0U2VydmljZScsICdNb2RlbFNlcnZpY2UnLFxuXHRmdW5jdGlvbigkbWREaWFsb2csICR0aW1lb3V0LCBTb2NrZXRTZXJ2aWNlLCBNb2RlbFNlcnZpY2Upe1xuXG5cdFx0U29ja2V0U2VydmljZS5jb25uZWN0KE1vZGVsU2VydmljZSk7XG5cblx0cmV0dXJuIHtcblx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9hcHAuaHRtbCcsXG5cdFx0Y29udHJvbGxlckFzIDogJ2FwcCcsXG5cdFx0YmluZFRvQ29udHJvbGxlciA6IHRydWUsXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuYWN0aW9ucyA9IFtcblx0XHRcdFx0e2xhYmVsIDogXCJCbHVldG9vdGhcIiwgaWNvbiA6ICdmYS1ibHVldG9vdGgnLCBpZEFjdGlvbjogJ2JsZSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIkxpZ2h0XCIsIGljb24gOiAnZmEtbGlnaHRidWxiLW8nLCBpZEFjdGlvbjogJ2xpZ2h0J30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiT3JpZW50YXRpb25cIiwgaWNvbiA6ICdmYS1jb21wYXNzJywgaWRBY3Rpb246ICdvcmllbnRhdGlvbid9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlVzZXJNZWRpYVwiLCBpY29uIDogJ2ZhLWNhbWVyYScsIGlkQWN0aW9uOiAnY2FtZXJhJ30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiUHJveGltaXR5XCIsIGljb24gOiAnZmEtcnNzJywgaWRBY3Rpb246ICdwcm94aW1pdHknfSxcblx0XHRcdFx0e2xhYmVsIDogXCJWb2ljZVwiLCBpY29uIDogJ2ZhLW1pY3JvcGhvbmUnLCBpZEFjdGlvbjogJ21pYyd9XG5cdFx0XHRdO1xuXG5cdFx0XHRcblx0XHRcdFxuXG5cdFx0XHRpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gJz9wcm94aW1pdHknKXtcblx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdwcm94aW1pdHlDdHJsJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9wcm94aW1pdHkuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL3Byb3hpbWl0eScpLFxuXHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3NlY3VyZUN0cmwnLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3NlY3VyZS5odG1sJyxcblx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKFwiLi9zZWN1cmUvc2VjdXJlXCIpLFxuXHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHQvL3RhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3BlbkRpYWxvZyA9IGZ1bmN0aW9uKGV2ZW50LCB0eXBlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ09wZW4gRGlhbG9nJyk7XG5cdFx0XHRcdGlmICh0eXBlID09PSAnYmxlJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2JsZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvYmx1ZXRvb3RoLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL2JsdWV0b290aCcpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnbGlnaHQnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnbGlnaHRDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2xpZ2h0Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi9zZW5zb3JzL2xpZ2h0JyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdvcmllbnRhdGlvbicpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdvcmllbnRhdGlvbkN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvb3JpZW50YXRpb24uaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvb3JpZW50YXRpb24nKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ21pYycpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICd2b2ljZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvdm9pY2UuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3NlbnNvcnMvdm9pY2UnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ3Byb3hpbWl0eScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdwcm94aW1pdHlDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3Byb3hpbWl0eS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy9wcm94aW1pdHknKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ2NhbWVyYScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdjYW1lcmFDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3VzZXJtZWRpYS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2Vuc29ycy91c2VybWVkaWEnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XSk7XG5cblxuZnVuY3Rpb24gcGFnZUxvYWQoKXtcdFxuXHQvL3JlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKTtcbn1cblxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpOyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBERVZJQ0VfTkFNRSA9IFwiTWFrZWJsb2NrX0xFXCIsXG5cdFNFUlZJQ0VfVVVJRCA9IFwiMDAwMGZmZTEtMDAwMC0xMDAwLTgwMDAtMDA4MDVmOWIzNGZiXCIsXG5cdENIQVJBQ1RFUklTVElDX1VVSUQgPSBcIjAwMDBmZmUzLTAwMDAtMTAwMC04MDAwLTAwODA1ZjliMzRmYlwiO1xuXG5jb25zdCBUWVBFX01PVE9SID0gMHgwYSxcblx0VFlQRV9SR0IgPSAweDA4LFxuXHRUWVBFX1NPVU5EID0gMHgwNztcblxuXG5jb25zdCBQT1JUXzEgPSAweDAxLFxuXHRQT1JUXzIgPSAweDAyLFxuXHRQT1JUXzMgPSAweDAzLFxuXHRQT1JUXzQgPSAweDA0LFxuXHRQT1JUXzUgPSAweDA1LFxuXHRQT1JUXzYgPSAweDA2LFxuXHRQT1JUXzcgPSAweDA3LFxuXHRQT1JUXzggPSAweDA4LFxuXHRNXzEgPSAweDA5LFxuXHRNXzIgPSAweDBhO1xuXG5mdW5jdGlvbiBnZW5lcmljQ29udHJvbCh0eXBlLCBwb3J0LCBzbG90LCB2YWx1ZSl7XG5cdC8qXG5cdGZmIDU1IGxlbiBpZHggYWN0aW9uIGRldmljZSBwb3J0ICBzbG90ICBkYXRhIGFcblx0MCAgMSAgMiAgIDMgICA0ICAgICAgNSAgICAgIDYgICAgIDcgICAgIDhcblx0Ki9cblx0Ly91bnNpZ25lZCBjaGFyIGFbMTFdPXsweGZmLDB4NTUsV1JJVEVNT0RVTEUsNywwLDAsMCwwLDAsMCwnXFxuJ307XG4gICAgLy9hWzRdID0gW3R5cGUgaW50VmFsdWVdO1xuICAgIC8vYVs1XSA9IChwb3J0PDw0ICYgMHhmMCl8KHNsb3QgJiAweGYpO1xuICAgIC8vIFN0YXRpYyB2YWx1ZXNcblx0dmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigxNik7XG5cdHZhciBidWZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1Zik7XG5cdFxuXHR2YXIgYnl0ZTAgPSAweGZmLFxuXHRcdGJ5dGUxID0gMHg1NSxcblx0XHRieXRlMiA9IDB4MDksXG5cdFx0Ynl0ZTMgPSAweDAwLFxuXHRcdGJ5dGU0ID0gMHgwMixcblx0XHRieXRlNSA9IHR5cGUsXG5cdFx0Ynl0ZTYgPSBwb3J0LFxuXHRcdGJ5dGU3ID0gc2xvdDtcblx0Ly9keW5hbWljcyB2YWx1ZXNcblx0dmFyIGJ5dGU4ID0gMHgwMCxcblx0XHRieXRlOSA9IDB4MDAsXG5cdFx0Ynl0ZTEwID0gMHgwMCxcblx0XHRieXRlMTEgPSAweDAwO1xuXHQvL0VuZCBvZiBtZXNzYWdlXG5cdHZhciBieXRlMTIgPSAweDBhLFxuXHRcdGJ5dGUxMyA9IDB4MDAsXG5cdFx0Ynl0ZTE0ID0gMHgwMCxcblx0XHRieXRlMTUgPSAweDAwO1xuXG5cdHN3aXRjaCh0eXBlKXtcblx0XHRjYXNlIFRZUEVfTU9UT1I6XG5cdFx0XHQvLyBNb3RvciBNMVxuXHRcdFx0Ly8gZmY6NTUgIDA5OjAwICAwMjowYSAgMDk6NjQgIDAwOjAwICAwMDowMCAgMGFcIlxuXHRcdFx0Ly8gMHg1NWZmOzB4MDAwOTsweDBhMDI7MHgwOTY0OzB4MDAwMDsweDAwMDA7MHgwMDBhOzB4MDAwMDtcblx0XHRcdC8vXCJmZjo1NTowOTowMDowMjowYTowOTowMDowMDowMDowMDowMDowYVwiXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowOTo5YzpmZjowMDowMDowMDowYVxuXHRcdFx0Ly8gTW90b3IgTTJcblx0XHRcdC8vIGZmOjU1OjA5OjAwOjAyOjBhOjBhOjY0OjAwOjAwOjAwOjAwOjBhXG5cdFx0XHQvLyBmZjo1NTowOTowMDowMjowYTowYTowMDowMDowMDowMDowMDowYVxuXHRcdFx0Ly8gZmY6NTU6MDk6MDA6MDI6MGE6MGE6OWM6ZmY6MDA6MDA6MDA6MGFcblx0XHRcdHZhciB0ZW1wVmFsdWUgPSB2YWx1ZSA8IDAgPyAocGFyc2VJbnQoXCJmZmZmXCIsMTYpICsgTWF0aC5tYXgoLTI1NSx2YWx1ZSkpIDogTWF0aC5taW4oMjU1LCB2YWx1ZSk7XG5cdFx0XHRieXRlNyA9IHRlbXBWYWx1ZSAmIDB4MDBmZjtcdFx0XHRcblx0XHRcdGJ5dGU4ID0gMHgwMDtcblx0XHRcdGJ5dGU4ID0gdGVtcFZhbHVlID4+ODsgXG5cblx0XHRcdC8qYnl0ZTUgPSAweDBhO1xuXHRcdFx0Ynl0ZTYgPSAweDA5O1xuXHRcdFx0Ynl0ZTcgPSAweDY0O1xuXHRcdFx0Ynl0ZTggPSAweDAwOyovXG5cdFx0XHRcblx0XHRicmVhaztcblx0XHRjYXNlIFRZUEVfUkdCOlxuXHRcdFx0Ly8gZmY6NTUgIDA5OjAwICAwMjowOCAgMDY6MDAgIDVjOjk5ICA2ZDowMCAgMGFcblx0XHRcdC8vIDB4NTVmZjsweDAwMDk7MHgwODAyOzB4MDAwNjsweDk5NWM7MHgwMDZkOzB4MDAwYTsweDAwMDA7XG5cdFx0XHRieXRlNyA9IDB4MDA7XG5cdFx0XHRieXRlOCA9IHZhbHVlPj44ICYgMHhmZjtcblx0XHRcdGJ5dGU5ID0gdmFsdWU+PjE2ICYgMHhmZjtcblx0XHRcdGJ5dGUxMCA9IHZhbHVlPj4yNCAmIDB4ZmY7XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSBUWVBFX1NPVU5EOlxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjowMDowMDowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjowNjowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjplZTowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjo4ODowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjpiODowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjo1ZDowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjo0YTowMTowYVxuXHRcdFx0Ly9mZjo1NTowNTowMDowMjoyMjoyNjowMTowYVxuXHRcdFx0Ynl0ZTIgPSAweDA1O1xuXHRcdFx0Ynl0ZTMgPSAweDAwO1xuXHRcdFx0Ynl0ZTQgPSAweDAyO1xuXHRcdFx0Ynl0ZTUgPSAweDIyO1xuXHRcdFx0aWYgKHZhbHVlID09PSAwKXtcblx0XHRcdFx0Ynl0ZTYgPSAweDAwO1xuXHRcdFx0XHRieXRlNyA9IDB4MDA7XG5cdFx0XHR9ZWxzZXtcblxuXHRcdFx0XHRieXRlNiA9IDB4ZWU7XG5cdFx0XHRcdGJ5dGU3ID0gMHgwMTtcblx0XHRcdH1cblx0XHRcdGJ5dGU4ID0gMHgwYTtcblx0XHRcdGJ5dGUxMj0gMHgwMDtcblxuXHRcdGJyZWFrO1xuXHR9XG5cblx0YnVmVmlld1swXSA9IGJ5dGUxPDw4IHwgYnl0ZTA7XG5cdGJ1ZlZpZXdbMV0gPSBieXRlMzw8OCB8IGJ5dGUyO1xuXHRidWZWaWV3WzJdID0gYnl0ZTU8PDggfCBieXRlNDtcblx0YnVmVmlld1szXSA9IGJ5dGU3PDw4IHwgYnl0ZTY7XG5cdGJ1ZlZpZXdbNF0gPSBieXRlOTw8OCB8IGJ5dGU4O1xuXHRidWZWaWV3WzVdID0gYnl0ZTExPDw4IHwgYnl0ZTEwO1xuXHRidWZWaWV3WzZdID0gYnl0ZTEzPDw4IHwgYnl0ZTEyO1xuXHRidWZWaWV3WzddID0gYnl0ZTE1PDw4IHwgYnl0ZTE0O1xuXHRjb25zb2xlLmxvZyhcblx0XHRcdGJ5dGUwLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUyLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUzLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU0LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU1LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU2LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU3LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU4LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGU5LnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxMC50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTEudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTEyLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ5dGUxMy50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRieXRlMTQudG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0Ynl0ZTE1LnRvU3RyaW5nKDE2KStcIjpcIlxuXHRcdFx0KTtcblx0Y29uc29sZS5sb2coXG5cdFx0XHRidWZWaWV3WzBdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbMV0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1syXS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzNdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbNF0udG9TdHJpbmcoMTYpK1wiOlwiK1xuXHRcdFx0YnVmVmlld1s1XS50b1N0cmluZygxNikrXCI6XCIrXG5cdFx0XHRidWZWaWV3WzZdLnRvU3RyaW5nKDE2KStcIjpcIitcblx0XHRcdGJ1ZlZpZXdbN10udG9TdHJpbmcoMTYpXG5cdFx0XHQpO1xuXHRyZXR1cm4gYnVmO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQnREVWSUNFX05BTUUnIDogREVWSUNFX05BTUUsXG5cdCdTRVJWSUNFX1VVSUQnIDogU0VSVklDRV9VVUlELFxuXHQnQ0hBUkFDVEVSSVNUSUNfVVVJRCcgOiBDSEFSQUNURVJJU1RJQ19VVUlELFxuXHQnVFlQRV9NT1RPUicgOiBUWVBFX01PVE9SLFxuXHQnVFlQRV9SR0InIDogVFlQRV9SR0IsXG5cdCdUWVBFX1NPVU5EJyA6IFRZUEVfU09VTkQsXG5cdCdQT1JUXzEnIDogUE9SVF8xLFxuXHQnUE9SVF8yJyA6IFBPUlRfMixcblx0J1BPUlRfMycgOiBQT1JUXzMsXG5cdCdQT1JUXzQnIDogUE9SVF80LFxuXHQnUE9SVF81JyA6IFBPUlRfNSxcblx0J1BPUlRfNicgOiBQT1JUXzYsXG5cdCdQT1JUXzcnIDogUE9SVF83LFxuXHQnUE9SVF84JyA6IFBPUlRfOCxcblx0J01fMScgOiBNXzEsXG5cdCdNXzInIDogTV8yLFxuXHQnZ2VuZXJpY0NvbnRyb2wnIDogZ2VuZXJpY0NvbnRyb2xcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBtb2RlbCA9IG51bGwsXG5cdHNvY2tldCA9IG51bGw7XG5cblxuXG5mdW5jdGlvbiBkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBwd2Qpe1xuXHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuICAgICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcbiAgICBsZXQgYWRkcmVzcyA9IG1vZGVsLmdldEFkZHJlc3MoKTtcbiAgICBsZXQgcHJvdG9jb2wgPSBtb2RlbC5pc1NTTCgpID8gJ2h0dHBzJyA6ICdodHRwJztcblxuXHRsZXQgbXlSZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYCR7cHJvdG9jb2x9Oi8vJHthZGRyZXNzfS9wYXNzd29yZC8ke3B3ZH1gLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKGpzb24uYXV0aCl7XG5cdFx0XHRsb2NhbFN0b3JhZ2VbJ3B3ZCddID0gcHdkO1xuXHRcdFx0c29ja2V0LnNlbmRNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogJ2JsZScsXG5cdFx0XHRcdGFjdGlvbjogJ3N0b3BQaHlzaWNhbFdlYidcblx0XHRcdH0pXG5cdFx0XHRpZiAobG9jYXRpb24uc2VhcmNoID09PSBcIlwiKXtcblx0XHRcdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdGNvbnRleHQubm90dmFsaWQgPSB0cnVlO1xuXHRcdH1cblxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBTZWN1cmVDdHJsKCRtZERpYWxvZywgTW9kZWxTZXJ2aWNlLCBTb2NrZXRTZXJ2aWNlKXtcblx0XG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cdG1vZGVsID0gTW9kZWxTZXJ2aWNlO1xuXHR0aGlzLm5vdHZhbGlkID0gZmFsc2U7XG5cdGxldCBjb250ZXh0ID0gdGhpcztcblxuXHRtb2RlbC5jaGVja0FkZHJlc3MoKVxuXHQudGhlbihmdW5jdGlvbigpe1x0XHRcblx0XHRpZiAobG9jYWxTdG9yYWdlWydwd2QnXSl7XG5cdFx0XHRkb1JlcXVlc3QoJG1kRGlhbG9nLCBjb250ZXh0LCBsb2NhbFN0b3JhZ2VbJ3B3ZCddKTtcblx0XHR9XG5cdH0pXG5cblx0dGhpcy50cnkgPSBmdW5jdGlvbigpe1xuXHRcdGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIGNvbnRleHQucHdkKTtcblx0fVxuXG5cbn1cblxuU2VjdXJlQ3RybC4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnTW9kZWxTZXJ2aWNlJywgJ1NvY2tldFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWN1cmVDdHJsOyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBtYm90QXBpID0gcmVxdWlyZSgnLi4vbWJvdC9tYm90Jyk7ICBcblxuZnVuY3Rpb24gYWIyc3RyKGJ1Zikge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDE2QXJyYXkoYnVmKSk7XG59XG5cbmZ1bmN0aW9uIHN0cjJhYihzdHIpIHtcbiAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihzdHIubGVuZ3RoKjIpOyAvLyAyIGJ5dGVzIGZvciBlYWNoIGNoYXJcbiAgdmFyIGJ1ZlZpZXcgPSBuZXcgVWludDE2QXJyYXkoYnVmKTtcbiAgZm9yICh2YXIgaT0wLCBzdHJMZW49c3RyLmxlbmd0aDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgYnVmVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBidWY7XG59XG5cbnZhciBzZXJ2ZXJHQVRUID0gbnVsbCxcblx0c2VydmljZUdBVFQgPSBudWxsLFxuXHRjaGFyYWN0ZXJpc3RpY0dBVFQgPSBudWxsLFxuXHRlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmZ1bmN0aW9uIGluaXRCbGUoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0bmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHsgXG5cdFx0XHRmaWx0ZXJzOiBbeyBuYW1lOiBtYm90QXBpLkRFVklDRV9OQU1FIH1dLCBvcHRpb25hbFNlcnZpY2VzOiBbbWJvdEFwaS5TRVJWSUNFX1VVSURdXG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihkZXZpY2UpIHtcblx0XHQgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RpbmcuLi5cIik7XG5cdFx0ICAgcmV0dXJuIGRldmljZS5nYXR0LmNvbm5lY3QoKTtcblx0XHQgfSlcblx0XHQudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblx0XHRcdHNlcnZlckdBVFQgPSBzZXJ2ZXI7XG5cdFx0XHQvL3JldHVybiBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2Uoc2VydmljZVVVSUQpO1xuXHRcdCAgIC8vIEZJWE1FOiBSZW1vdmUgdGhpcyB0aW1lb3V0IHdoZW4gR2F0dFNlcnZpY2VzIHByb3BlcnR5IHdvcmtzIGFzIGludGVuZGVkLlxuXHRcdCAgIC8vIGNyYnVnLmNvbS81NjAyNzdcblx0XHQgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZVNlcnZpY2UsIHJlamVjdFNlcnZpY2UpIHtcblx0XHQgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0ICAgICBcdHRyeXtcblx0XHQgICAgIFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byBnZXQgU2VydmljZVwiKTtcblx0XHQgICAgICAgXHRcdHJlc29sdmVTZXJ2aWNlKHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShtYm90QXBpLlNFUlZJQ0VfVVVJRCkpO1xuXHRcdCAgICAgXHR9Y2F0Y2goZXJyKXtcblx0XHQgICAgIFx0XHRyZWplY3RTZXJ2aWNlKGVycik7XG5cdFx0ICAgICBcdH1cblx0XHQgICAgIH0sIDJlMyk7XG5cdFx0ICAgfSlcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0c2VydmljZUdBVFQgPSBzZXJ2aWNlO1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlKTtcdFx0XHRcblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0fSk7XG5cdH0pXG59XG5cblxuZnVuY3Rpb24gZ2V0U2VydmljZSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoc2VydmVyR0FUVCAmJiBzZXJ2ZXJHQVRULmNvbm5lY3RlZCAmJiBzZXJ2aWNlR0FUVCl7XG5cdFx0XHRyZXNvbHZlKHNlcnZpY2VHQVRUKTtcblx0XHR9ZWxzZXtcblx0XHRcdGluaXRCbGUoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRcdHJlc29sdmUoc2VydmljZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldENoYXJhY3RlcmlzdGljKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdGlmIChjaGFyYWN0ZXJpc3RpY0dBVFQpe1xuXHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpc3RpY0dBVFQpO1xuXHRcdH1lbHNle1xuXHRcdFx0Z2V0U2VydmljZSgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IENoYXJhY3Rlcml0aWMgOiAlT1wiLHNlcnZpY2UpO1xuXHRcdFx0XHRyZXR1cm4gc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyhtYm90QXBpLkNIQVJBQ1RFUklTVElDX1VVSUQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3Rlcml0aWMpe1xuXHRcdFx0XHRjaGFyYWN0ZXJpc3RpY0dBVFQgPSBjaGFyYWN0ZXJpdGljO1xuXHRcdFx0XHRyZXNvbHZlKGNoYXJhY3Rlcml0aWMpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0NoYXJhY3RlcmlzdGljKHR5cGUsIGRhdGEpe1xuXHRnZXRDaGFyYWN0ZXJpc3RpYygpXG5cdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3RlcmlzdGljKXtcblx0XHRpZiAodHlwZSA9PT0gJ3dyaXRlJyl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byB3cml0ZSB2YWx1ZSA6ICVPXCIsY2hhcmFjdGVyaXN0aWMpO1xuXHRcdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoZGF0YSk7XG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcil7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1xuXHRcdFx0Y29uc29sZS5pbmZvKFwiV3JpdGUgZGF0YXMgISBcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgZGF0YSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXHRcdCAgICBsZXQgZGF0YURlY3J5cHQgPSBkYXRhLmdldFVpbnQ4KDApO1xuXHRcdCAgICBjb25zb2xlLmxvZygnUmVjZWl2ZURhdGFzICVzJywgZGF0YURlY3J5cHQpO1xuXHRcdH1cblx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1x0XHRcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NNb3RvcnModmFsdWVNMSwgdmFsdWVNMil7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oY2hhcmFjdGVyaXN0aWMgPT57XG5cdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8xLCAwLCB2YWx1ZU0xKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWNHQVRULndyaXRlVmFsdWUobWJvdEFwaS5nZW5lcmljQ29udHJvbChtYm90QXBpLlRZUEVfTU9UT1IsIG1ib3RBcGkuTV8yLCAwLCB2YWx1ZU0yKSk7XG5cdH0pLnRoZW4oKCk9Pntcblx0XHRjb25zb2xlLmluZm8oXCJXcml0ZSBkYXRhcyAhIFwiKTtcblx0fSkuY2F0Y2goZXJyb3IgPT57XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdH0pO1xufVxuXG5cbmZ1bmN0aW9uIEJsZUNvbnRyb2xsZXIoJG1kRGlhbG9nKXtcblxuXHR0aGlzLnNsaWRlckFjdGl2ID0gZmFsc2U7XG5cdHRoaXMuY3VycmVudFRpbWVyID0gbnVsbDtcblx0dGhpcy5wb3dlciA9IDEyNTtcblx0dGhpcy5yZWQgPSAwO1xuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHRoaXMuc3RvcCgpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH0gXG5cblx0dGhpcy5jb25uZWN0ID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJvblwiKTtcblx0fVxuXG5cdHRoaXMudXAgPSBmdW5jdGlvbihldmVudCl7XG5cdFx0Y29uc29sZS5sb2coXCJ1cFwiKTtcblx0XHRwcm9jZXNzTW90b3JzKC0xMDAsMTAwKTtcblx0fVxuXG5cdHRoaXMuZG93biA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJkb3duXCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoMTAwLC0xMDApO1xuXHR9XG5cdFxuXHR0aGlzLmxlZnQgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKFwibGVmdFwiKTtcblx0XHRwcm9jZXNzTW90b3JzKDEwMCwxMDApO1xuXHR9O1xuXG5cdHRoaXMucmlnaHQgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKFwicmlnaHRcIik7XG5cdFx0cHJvY2Vzc01vdG9ycygtMTAwLC0xMDApO1xuXHR9O1xuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJzdG9wXCIpO1xuXHRcdHByb2Nlc3NNb3RvcnMoMCwwKTtcblx0fVxuXG5cdHRoaXMuY2hhbmdlQ29sb3IgPSBmdW5jdGlvbihyZWQsYmx1ZSxncmVlbil7IFxuXHRcdGNvbnNvbGUubG9nKFwiQ2hhbmdlIENvbG9yIDogJWQsJWQsJWRcIixyZWQsZ3JlZW4sYmx1ZSk7XG5cdFx0dmFyIHJIZXggPSByZWQ8PDg7XG5cdFx0dmFyIGdIZXggPSBncmVlbjw8MTY7XG5cdFx0dmFyIGJIZXggPSBibHVlPDwyNDtcblx0XHR2YXIgdmFsdWUgPSBySGV4IHwgZ0hleCB8IGJIZXg7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIG1ib3RBcGkuZ2VuZXJpY0NvbnRyb2wobWJvdEFwaS5UWVBFX1JHQixtYm90QXBpLlBPUlRfNiwwLHZhbHVlKSk7XG5cdFx0Ly9wcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJicmlnaHQ6XCIrdGhpcy5wb3dlcik7XG5cdH07XG5cblxufVxuXG5CbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZyddXG5cblxubW9kdWxlLmV4cG9ydHMgPSBCbGVDb250cm9sbGVyOy8qe1xuXHR3cml0ZURhdGEgOiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWNcbn0qL1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmxldCBzb2NrZXQgPSBudWxsO1xuXG4vLyBUaGUgaGFuZGxlclxudmFyIGRldmljZUxpZ2h0SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdC8vIFRoZSB2YWx1ZSB3aWxsIGxpdmUgYmV0d2VlbiAwIGFuZCB+MTUwXG5cdC8vIEJ1dCB3aGVuIGl0IGlzIDQ1IGlzIGEgaGlnaCBsdW1vbnNpdHlcblx0dmFyIHZhbHVlID0gTWF0aC5taW4oNDUsIGV2ZW50LnZhbHVlKTsgICAgICAgIFxuXHRsZXQgcGVyY2VudCA9IE1hdGgucm91bmQoKHZhbHVlIC8gNDUpICogMTAwKTsgICAgICAgXG5cdHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ2xpZ2h0JywgdmFsdWUgOiBwZXJjZW50fSk7XG59XG5cbi8vIFdlIGFkZCB0aGUgbGlzdGVuZXJcbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VsaWdodCcsIGRldmljZUxpZ2h0SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VsaWdodCcsIGRldmljZUxpZ2h0SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBMaWdodENvbnRyb2xlcigkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xuXG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHJlZ2lzdGVyKCk7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5MaWdodENvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gTGlnaHRDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgc29ja2V0ID0gbnVsbCwgXG5cdGZpcnN0VmFsdWUgPSAtMTtcblxuLy8gVGhlIGhhbmRsZXIgb2YgdGhlIGV2ZW50XG52YXIgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KXsgICAgICAgIFxuXHR2YXIgYWxwaGEgPSBNYXRoLnJvdW5kKGV2ZW50LmFscGhhKTtcblx0dmFyIGJldGEgPSBNYXRoLnJvdW5kKGV2ZW50LmJldGEpO1xuXHR2YXIgZ2FtbWEgPSBNYXRoLnJvdW5kKGV2ZW50LmdhbW1hKTtcblx0aWYgKGZpcnN0VmFsdWUgPT09IC0xKXtcblx0XHRmaXJzdFZhbHVlID0gYWxwaGE7XG5cdH1cblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnb3JpZW50YXRpb24nLCB2YWx1ZSA6IGFscGhhLCAnZmlyc3RWYWx1ZScgOiBmaXJzdFZhbHVlfSk7XHRcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0Zmlyc3RWYWx1ZSA9IC0xO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBPcmllbnRhdGlvbkNvbnRyb2xlcigkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xuXG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHJlZ2lzdGVyKCk7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5PcmllbnRhdGlvbkNvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cblxubW9kdWxlLmV4cG9ydHMgPSBPcmllbnRhdGlvbkNvbnRyb2xlcjsiLCIndXNlIHN0cmljdCdcblxudmFyIG1vZGVsID0gbnVsbCxcbiAgICBzb2NrZXQgPSBudWxsO1xuXG4vLyBUaGUgbGlzdGVuZXJcbnZhciBkZXZpY2VQcm94aW1pdHlIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0dmFyIHZhbHVlID0gTWF0aC5yb3VuZChldmVudC52YWx1ZSk7ICAgICAgICBcblx0aWYgKHZhbHVlID09PSAwKXtcbiAgICAgICAgc29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAndm9pY2UnLCB2YWx1ZSA6ICdzdGFydCd9KTtcblx0XHQvKmxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuXHRcdGxldCBzY2hlbWUgPSBtb2RlbC5pc1NTTCgpICA/IFwiaHR0cHNcIiA6IFwiaHR0cFwiO1xuXHRcdHdpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8ke2FkZHJlc3N9L2FkZG9uL2luZGV4X2FwcC5odG1sP3NwZWVjaCNJbnRlbnQ7c2NoZW1lPSR7c2NoZW1lfTtwYWNrYWdlPW9yZy5jaHJvbWl1bS5jaHJvbWU7ZW5kYDsqL1xuXHR9ICAgIFxuXHQvL3NvY2tldC5zZW5kUHJveGltaXR5KHZhbHVlKTtcblx0Ly9tYW5hZ2VQcm94aW1pdHlWYWx1ZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2Vwcm94aW1pdHknLCBkZXZpY2VQcm94aW1pdHlIYW5kbGVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZXByb3hpbWl0eScsIGRldmljZVByb3hpbWl0eUhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gUHJveGltaXR5Q29udHJvbGVyKCRtZERpYWxvZywgTW9kZWxTZXJ2aWNlLCBTb2NrZXRTZXJ2aWNlKXtcblxuXHRtb2RlbCA9IE1vZGVsU2VydmljZTtcbiAgICBzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRpZiAod2luZG93LkRldmljZVByb3hpbWl0eUV2ZW50KXtcblxuXHRcdFx0cmVnaXN0ZXIoKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBhZGRyZXNzID0gbW9kZWwuZ2V0QWRkcmVzcygpO1xuXHRcdFx0bGV0IHNjaGVtZSA9IG1vZGVsLmlzU1NMKCkgID8gXCJodHRwc1wiIDogXCJodHRwXCI7XG5cdFx0XHQvL3dpbmRvdy5sb2NhdGlvbiA9IGBpbnRlbnQ6Ly8xMC4zMy40NC4xODE6MzAwMC9hZGRvbi9pbmRleF9hcHAuaHRtbCNJbnRlbnQ7c2NoZW1lPSR7c2NoZW1lfTtwYWNrYWdlPW9yZy5tb3ppbGxhLmZpcmVmb3hfYmV0YTtlbmRgO1xuXHRcdFx0d2luZG93Lm9wZW4oYGludGVudDovLyR7YWRkcmVzc30vYWRkb24vaW5kZXhfYXBwLmh0bWw/cHJveGltaXR5I0ludGVudDtzY2hlbWU9JHtzY2hlbWV9O3BhY2thZ2U9b3JnLm1vemlsbGEuZmlyZWZveF9iZXRhO2VuZGApO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuZ29Ub0Nocm9tZSA9IGZ1bmN0aW9uKCl7XG5cdFx0bGV0IGFkZHJlc3MgPSBtb2RlbC5nZXRBZGRyZXNzKCk7XG5cdFx0bGV0IHNjaGVtZSA9IG1vZGVsLmlzU1NMKCkgID8gXCJodHRwc1wiIDogXCJodHRwXCI7XG5cdFx0Ly93aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vMTAuMzMuNDQuMTgxOjMwMDAvYWRkb24vaW5kZXhfYXBwLmh0bWwjSW50ZW50O3NjaGVtZT0ke3NjaGVtZX07cGFja2FnZT1vcmcubW96aWxsYS5maXJlZm94X2JldGE7ZW5kYDtcblx0XHR3aW5kb3cubG9jYXRpb24gPSBgaW50ZW50Oi8vJHthZGRyZXNzfS9hZGRvbi9pbmRleF9hcHAuaHRtbCNJbnRlbnQ7c2NoZW1lPSR7c2NoZW1lfTtwYWNrYWdlPW9yZy5jaHJvbWl1bS5jaHJvbWU7YWN0aW9uPWFuZHJvaWQuaW50ZW50LmFjdGlvbi5WSUVXO2xhdW5jaEZsYWdzPTB4MTAwMDAwMDA7ZW5kYDtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cblByb3hpbWl0eUNvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnTW9kZWxTZXJ2aWNlJywgJ1NvY2tldFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm94aW1pdHlDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc29ja2V0ID0gbnVsbCxcbiAgdmlkZW9FbGVtZW50ID0gbnVsbCxcbiAgY2FudmFzID0gbnVsbCwgXG4gIHZpZGVvU291cmNlID0gbnVsbCxcbiAgc2VsZWN0b3JzID0gbnVsbDtcblxuIFxuXG5mdW5jdGlvbiBnb3REZXZpY2VzKGRldmljZUluZm9zKSB7XG4gIHZhciB0ZW1wVmlkZW9Tb3VyY2UgPSBudWxsO1xuICBkZXZpY2VJbmZvcy5mb3JFYWNoKGZ1bmN0aW9uKGRldmljZSl7XG4gICAgaWYgKGRldmljZS5raW5kID09PSAndmlkZW9pbnB1dCcpe1xuICAgICAgdGVtcFZpZGVvU291cmNlID0gZGV2aWNlLmRldmljZUlkO1xuICAgICAgaWYoIGRldmljZS5sYWJlbC5pbmRleE9mKCdiYWNrJykgIT0gMCl7XG4gICAgICAgIHZpZGVvU291cmNlID0gZGV2aWNlLmRldmljZUlkO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICh2aWRlb1NvdXJjZSA9PT0gbnVsbCl7XG4gICAgdmlkZW9Tb3VyY2UgPSB0ZW1wVmlkZW9Tb3VyY2U7XG4gIH0gIFxufVxuXG5uYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMoKVxuICAudGhlbihnb3REZXZpY2VzKVxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyLm5hbWUgKyBcIjogXCIgKyBlcnIubWVzc2FnZSk7XG4gIH0pO1xuXG5mdW5jdGlvbiBzdGFydCgpe1xuICBpZiAod2luZG93LnN0cmVhbSkge1xuICAgIHdpbmRvdy5zdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICB9XG4gIHZhciBjb25zdHJhaW50cyA9IHtcbiAgICBhdWRpbyA6IGZhbHNlLFxuICAgIHZpZGVvOiB7ZGV2aWNlSWQ6IHZpZGVvU291cmNlID8ge2V4YWN0OiB2aWRlb1NvdXJjZX0gOiB1bmRlZmluZWR9XG4gIH07XG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKS50aGVuKHN1Y2Nlc3NDYWxsYmFjaykuY2F0Y2goZXJyb3JDYWxsYmFjayk7XG59XG5cblxuZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHN0cmVhbSkge1xuICB3aW5kb3cuc3RyZWFtID0gc3RyZWFtOyAvLyBtYWtlIHN0cmVhbSBhdmFpbGFibGUgdG8gY29uc29sZVxuICBpZiAoIXZpZGVvRWxlbWVudCl7XG4gICAgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVZpZGVvXCIpO1xuICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDYW52YXNcIik7XG4gIH1cbiAgdmlkZW9FbGVtZW50LnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XG4gIHZpZGVvRWxlbWVudC5vbmxvYWRlZG1ldGFkYXRhID0gZnVuY3Rpb24oZSkge1xuICAgIHZpZGVvRWxlbWVudC5wbGF5KCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVycm9yQ2FsbGJhY2soZXJyb3Ipe1xuICAgIGNvbnNvbGUubG9nKFwibmF2aWdhdG9yLmdldFVzZXJNZWRpYSBlcnJvcjogXCIsIGVycm9yKTtcbiAgfVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXIoKXtcbiAgICAgIHN0YXJ0KCk7XG4gICAgICBcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG4gICAgICBpZiAodmlkZW9FbGVtZW50KSB7XG4gICAgICAgIHZpZGVvRWxlbWVudC5wYXVzZSgpO1xuICAgICAgICB2aWRlb0VsZW1lbnQuc3JjID0gbnVsbDtcbiAgICAgIH1cbiAgICAgICAgIFxuICAgIH1cblxuZnVuY3Rpb24gQ2FtZXJhQ3RybCgkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xuICBzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG4gIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlWaWRlb1wiKTtcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcblxuICB0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmVnaXN0ZXIoKTtcbiAgfVxuXG4gIHRoaXMucGhvdG8gPSBmdW5jdGlvbigpe1xuICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY2FudmFzLndpZHRoID0gdmlkZW9FbGVtZW50LnZpZGVvV2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHZpZGVvRWxlbWVudC52aWRlb0hlaWdodDtcbiAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlb0VsZW1lbnQsIDAsIDAsIHZpZGVvRWxlbWVudC52aWRlb1dpZHRoLCB2aWRlb0VsZW1lbnQudmlkZW9IZWlnaHQpO1xuICBcbiAgICB2YXIgZGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ3VzZXJtZWRpYScsIHZhbHVlIDogZGF0YX0pOyAgICAgIFxuICAgIFxuICB9XG5cbiAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgdW5yZWdpc3RlcigpO1xuICAgICRtZERpYWxvZy5oaWRlKCk7XG4gIH1cbn1cblxuQ2FtZXJhQ3RybC4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhQ3RybDsiLCIndXNlIHN0cmljdCdcblxudmFyIHNvY2tldCA9IG51bGw7XG52YXIgU3BlZWNoUmVjb2duaXRpb24gPSBTcGVlY2hSZWNvZ25pdGlvbiB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvblxudmFyIFNwZWVjaEdyYW1tYXJMaXN0ID0gU3BlZWNoR3JhbW1hckxpc3QgfHwgd2Via2l0U3BlZWNoR3JhbW1hckxpc3RcbnZhciBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50ID0gU3BlZWNoUmVjb2duaXRpb25FdmVudCB8fCB3ZWJraXRTcGVlY2hSZWNvZ25pdGlvbkV2ZW50XG5cbi8vdmFyIGdyYW1tYXIgPSAnI0pTR0YgVjEuMDsgZ3JhbW1hciBjb2xvcnM7IHB1YmxpYyA8Y29sb3I+ID0gYXF1YSB8IGF6dXJlIHwgYmVpZ2UgfCBiaXNxdWUgfCBibGFjayB8IGJsdWUgfCBicm93biB8IGNob2NvbGF0ZSB8IGNvcmFsIHwgY3JpbXNvbiB8IGN5YW4gfCBmdWNoc2lhIHwgZ2hvc3R3aGl0ZSB8IGdvbGQgfCBnb2xkZW5yb2QgfCBncmF5IHwgZ3JlZW4gfCBpbmRpZ28gfCBpdm9yeSB8IGtoYWtpIHwgbGF2ZW5kZXIgfCBsaW1lIHwgbGluZW4gfCBtYWdlbnRhIHwgbWFyb29uIHwgbW9jY2FzaW4gfCBuYXZ5IHwgb2xpdmUgfCBvcmFuZ2UgfCBvcmNoaWQgfCBwZXJ1IHwgcGluayB8IHBsdW0gfCBwdXJwbGUgfCByZWQgfCBzYWxtb24gfCBzaWVubmEgfCBzaWx2ZXIgfCBzbm93IHwgdGFuIHwgdGVhbCB8IHRoaXN0bGUgfCB0b21hdG8gfCB0dXJxdW9pc2UgfCB2aW9sZXQgfCB3aGl0ZSB8IHllbGxvdyA7J1xudmFyIHJlY29nbml0aW9uID0gbmV3IFNwZWVjaFJlY29nbml0aW9uKCk7XG4vL3ZhciBzcGVlY2hSZWNvZ25pdGlvbkxpc3QgPSBuZXcgU3BlZWNoR3JhbW1hckxpc3QoKTtcbi8vc3BlZWNoUmVjb2duaXRpb25MaXN0LmFkZEZyb21TdHJpbmcoZ3JhbW1hciwgMSk7XG4vL3JlY29nbml0aW9uLmdyYW1tYXJzID0gc3BlZWNoUmVjb2duaXRpb25MaXN0O1xucmVjb2duaXRpb24uY29udGludW91cyA9IHRydWU7XG5yZWNvZ25pdGlvbi5sYW5nID0gJ2ZyLUZSJztcbnJlY29nbml0aW9uLmludGVyaW1SZXN1bHRzID0gdHJ1ZTtcbi8vcmVjb2duaXRpb24ubWF4QWx0ZXJuYXRpdmVzID0gMTtcblxuLy92YXIgZGlhZ25vc3RpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdXRwdXQnKTtcbi8vdmFyIGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG5kb2N1bWVudC5ib2R5Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgcmVjb2duaXRpb24uc3RhcnQoKTtcbiAgY29uc29sZS5sb2coJ1JlYWR5IHRvIHJlY2VpdmUgYSBjb2xvciBjb21tYW5kLicpO1xufVxuXG5yZWNvZ25pdGlvbi5vbnJlc3VsdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIC8vIFRoZSBTcGVlY2hSZWNvZ25pdGlvbkV2ZW50IHJlc3VsdHMgcHJvcGVydHkgcmV0dXJucyBhIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3RcbiAgLy8gVGhlIFNwZWVjaFJlY29nbml0aW9uUmVzdWx0TGlzdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgb2JqZWN0cy5cbiAgLy8gSXQgaGFzIGEgZ2V0dGVyIHNvIGl0IGNhbiBiZSBhY2Nlc3NlZCBsaWtlIGFuIGFycmF5XG4gIC8vIFRoZSBmaXJzdCBbMF0gcmV0dXJucyB0aGUgU3BlZWNoUmVjb2duaXRpb25SZXN1bHQgYXQgcG9zaXRpb24gMC5cbiAgLy8gRWFjaCBTcGVlY2hSZWNvZ25pdGlvblJlc3VsdCBvYmplY3QgY29udGFpbnMgU3BlZWNoUmVjb2duaXRpb25BbHRlcm5hdGl2ZSBvYmplY3RzIHRoYXQgY29udGFpbiBpbmRpdmlkdWFsIHJlc3VsdHMuXG4gIC8vIFRoZXNlIGFsc28gaGF2ZSBnZXR0ZXJzIHNvIHRoZXkgY2FuIGJlIGFjY2Vzc2VkIGxpa2UgYXJyYXlzLlxuICAvLyBUaGUgc2Vjb25kIFswXSByZXR1cm5zIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIGF0IHBvc2l0aW9uIDAuXG4gIC8vIFdlIHRoZW4gcmV0dXJuIHRoZSB0cmFuc2NyaXB0IHByb3BlcnR5IG9mIHRoZSBTcGVlY2hSZWNvZ25pdGlvbkFsdGVybmF0aXZlIG9iamVjdCBcbiAgdmFyIGZpbmFsU3RyID0gZXZlbnQucmVzdWx0c1swXVswXS50cmFuc2NyaXB0O1xuICAvL2RpYWdub3N0aWMudGV4dENvbnRlbnQgPSAnUmVzdWx0IHJlY2VpdmVkOiAnICsgY29sb3IgKyAnLic7XG4gIC8vYmcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XG4gIGNvbnNvbGUubG9nKCdDb25maWRlbmNlOiAnICsgZmluYWxTdHIpO1xuICBpZiAoZmluYWxTdHIuaW5kZXhPZignc3VpdmFudCcpICE9IC0xKXtcbiAgXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ25leHQnfSk7XG4gIH1lbHNlIGlmIChmaW5hbFN0ci5pbmRleE9mKCdwcsOpY8OpZGVudCcpICE9IC0xKXtcbiAgXHRzb2NrZXQuc2VuZE1lc3NhZ2Uoe3R5cGU6ICd2b2ljZScsIHZhbHVlIDogJ3ByZXYnfSk7XG4gIH1cbn1cblxuLy8gV2UgZGV0ZWN0IHRoZSBlbmQgb2Ygc3BlZWNoUmVjb2duaXRpb24gcHJvY2Vzc1xuICAgICAgcmVjb2duaXRpb24ub25lbmQgPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygnRW5kIG9mIHJlY29nbml0aW9uJylcbiAgICAgICAgcmVjb2duaXRpb24uc3RvcCgpO1xuICAgICAgfTtcblxuICAgICAgLy8gV2UgZGV0ZWN0IGVycm9yc1xuICAgICAgcmVjb2duaXRpb24ub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5lcnJvciA9PSAnbm8tc3BlZWNoJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBTcGVlY2gnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuZXJyb3IgPT0gJ2F1ZGlvLWNhcHR1cmUnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vIG1pY3JvcGhvbmUnKVxuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5lcnJvciA9PSAnbm90LWFsbG93ZWQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdCBBbGxvd2VkJyk7XG4gICAgICAgIH1cbiAgICAgIH07ICAgICBcblxuXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHRyZWNvZ25pdGlvbi5zdG9wKCk7XG59XG5cblxuZnVuY3Rpb24gVm9pY2VDb250cm9sZXIoJG1kRGlhbG9nLCBTb2NrZXRTZXJ2aWNlKXtcblxuXHRzb2NrZXQgPSBTb2NrZXRTZXJ2aWNlO1xuXG5cdHJlY29nbml0aW9uLnN0YXJ0KCk7XG5cdFxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5cblZvaWNlQ29udHJvbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICdTb2NrZXRTZXJ2aWNlJ11cblxubW9kdWxlLmV4cG9ydHMgPSBWb2ljZUNvbnRyb2xlcjsiLCIndXNlIHN0cmljdCdcblxudmFyIHNvY2tldCA9IG51bGw7XG5cbmZ1bmN0aW9uIFNvY2tldFNlcnZpY2UoKXtcblxuXHR0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbihtb2RlbCl7XG5cblx0XHRtb2RlbC5jaGVja0FkZHJlc3MoKVxuXHRcdC50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRsZXQgYWRkcmVzcyA9IG1vZGVsLmdldElvQWRkcmVzcygpO1xuXHRcdFx0bGV0IHByb3RvY29sID0gbW9kZWwuaXNTU0woKSA/ICdodHRwcycgOiAnaHR0cCc7XG5cdFx0XHRzb2NrZXQgPSBpbyhgJHtwcm90b2NvbH06Ly8ke2FkZHJlc3N9YCk7XG5cdFx0fSk7XG5cdH1cblx0dGhpcy5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZyl7XG5cdFx0c29ja2V0LmVtaXQoJ3NlbnNvcicsIG1zZyk7XG5cdH1cblxuXHR0aGlzLmdldFNvY2tldCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHNvY2tldDtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ja2V0U2VydmljZTsiLCIndXNlIHN0cmljdCdcblxudmFyIGFkZHJlc3MgPSBudWxsLFxuXHRpb0FkZHJlc3MgPSBudWxsLFxuXHRzc2wgPSBmYWxzZTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoYWRkcmVzcyl7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRcdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG5cdCAgICAgICAgICAgaGVhZGVyczogbXlIZWFkZXJzLFxuXHQgICAgICAgICAgIG1vZGU6ICdjb3JzJyxcblx0ICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG5cdCAgICBsZXQgcHJvdG9jb2wgPSAnJztcblx0ICAgIGxldCBzY2hlbWUgPSAnJ1xuXHQgICAgbGV0IGJhc2ljSG9zdCA9ICcnXG5cdCAgICBpZiAobG9jYXRpb24uaG9zdCAmJiBsb2NhdGlvbi5ob3N0LmluZGV4T2YoJ2xvY2FsaG9zdCcpID09PSAtMSl7XG5cdCAgICBcdHByb3RvY29sID0gJ2h0dHBzJztcblx0ICAgIFx0c2NoZW1lID0gJzovLyc7XG5cdCAgICBcdGJhc2ljSG9zdCA9ICdiaW5vbWVkLmZyOjg0NDMnO1xuXHQgICAgfVxuXG5cdFx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke3Byb3RvY29sfSR7c2NoZW1lfSR7YmFzaWNIb3N0fS9pcGAsbXlJbml0KTtcblx0XHRmZXRjaChteVJlcXVlc3QpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdFx0bGV0IG5ldHdvcmsgPSBqc29uO1xuXG5cdFx0XHRpZiAoKGxvY2F0aW9uLnBvcnQgJiYgKGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiKSlcbiAgICAgICAgICAgICB8fCBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcpe1xuXHRcdFx0XHRsZXQgd2xhbjAgPSBuZXR3b3JrLmZpbmQoZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQubmFtZSA9PT0gJ3dsYW4wJztcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChsb2NhdGlvbi5wb3J0ID09PSBcIjg0NDNcIil7XG5cdFx0XHRcdFx0YWRkcmVzcyA9IFwibG9jYWxob3N0Ojg0NDNcIjtcblx0XHRcdFx0XHRpb0FkZHJlc3MgPSBcImxvY2FsaG9zdDo4NDQzXCI7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHdsYW4wICYmIGxvY2F0aW9uLmhvc3RuYW1lICE9ICdsb2NhbGhvc3QnKXtcblx0XHRcdFx0XHRhZGRyZXNzID0gYCR7d2xhbjAuaXB9OjMwMDBgO1xuXHRcdFx0XHRcdGlvQWRkcmVzcyA9IGAke3dsYW4wLmlwfTo4NDQzYDtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0YWRkcmVzcyA9IFwibG9jYWxob3N0OjMwMDBcIjtcblx0XHRcdFx0XHRpb0FkZHJlc3MgPSBcImxvY2FsaG9zdDo4NDQzXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiODQ0M1wiKXtcblx0XHRcdFx0YWRkcmVzcyA9IFwiYmlub21lZC5mcjo4NDQzXCI7XG5cdFx0XHRcdGlvQWRkcmVzcyA9IFwiYmlub21lZC5mcjo4NDQzXCI7XG5cdFx0XHRcdHNzbCA9IHRydWU7XG5cdFx0XHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCI4MFwiIHx8IGxvY2F0aW9uLnBvcnQgPT09IFwiXCIpKXtcblx0XHRcdFx0YWRkcmVzcyA9IFwiYmlub21lZC5mcjo4NDQzXCI7XG5cdFx0XHRcdGlvQWRkcmVzcyA9IFwiYmlub21lZC5mcjo4NDQzXCI7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0YWRkcmVzcyA9IG51bGw7XG5cdFx0XHR9IFxuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuY2FsY3VsYXRlQWRkcmVzcygpO1xuXG5cbmZ1bmN0aW9uIE1vZGVsU2VydmljZSgpe1xuXG5cdHRoaXMuaXNTU0wgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBzc2w7XG5cdH1cblxuXHR0aGlzLmdldEFkZHJlc3MgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBhZGRyZXNzO1xuXHR9XHRcblxuXHR0aGlzLmdldElvQWRkcmVzcyA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGlvQWRkcmVzcztcblx0fVxuXG5cdHRoaXMuY2hlY2tBZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcztcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsU2VydmljZTsiXX0=
