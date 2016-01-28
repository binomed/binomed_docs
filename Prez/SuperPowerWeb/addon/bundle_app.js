(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

angular.module("SuperPowerApp", ['ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('orange');
})
.service('SocketService', require('./socket/sockets'))
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
				{label : "Voice", icon : 'fa-microphone', idAction: 'mic'}
			];

			$mdDialog.show({
				controllerAs : 'secureCtrl',
				templateUrl: './components/secure.html',
				controller: require('./secure/secure'),
				parent : angular.element(document.querySelector('#mainContainer')),
				targetEvent : event,
				fullScreen : true
			});

			this.openDialog = function(event, type){
				console.log('Open Dialog');
				if (type === 'ble'){
					$mdDialog.show({
						controllerAs : 'bleCtrl',
						templateUrl: './components/bluetooth.html',
						controller: require('./bluetooth/bluetooth'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'light'){
					$mdDialog.show({
						controllerAs : 'lightCtrl',
						templateUrl: './components/light.html',
						controller: require('./light/light'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'orientation'){
					$mdDialog.show({
						controllerAs : 'orientationCtrl',
						templateUrl: './components/orientation.html',
						controller: require('./orientation/orientation'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'mic'){
					$mdDialog.show({
						controllerAs : 'voiceCtrl',
						templateUrl: './components/voice.html',
						controller: require('./voice/voice'),
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
},{"./bluetooth/bluetooth":2,"./light/light":3,"./orientation/orientation":4,"./secure/secure":5,"./socket/sockets":6,"./voice/voice":7}],2:[function(require,module,exports){
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


},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3000")){
		return "http://localhost:8000"
	}else if (location.port && location.port === "8000"){
		return "http://jef.binomed.fr:8000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();

function doRequest($mdDialog, context, pwd){
	let myHeaders = new Headers();
	let myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'cors',
           cache: 'default' };

	let myRequest = new Request(`${address}/password/${pwd}`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		// On ne retraire pas une question déjà traitée
		if (json.auth){
			localStorage['pwd'] = pwd;
			$mdDialog.hide();
		}else{
			context.notvalid = true;
		}


	});
}

function SecureCtrl($mdDialog){
	
	this.notvalid = false;

	this.try = function(){
		doRequest($mdDialog, this, this.pwd);
	}

	if (localStorage['pwd']){
		doRequest($mdDialog, this, localStorage['pwd']);
	}
}

module.exports = SecureCtrl;
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
'use strict'

function register(){

}

function unregister(){
	
}


function VoiceControler($mdDialog){

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}


module.exports = VoiceControler;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9ibHVldG9vdGgvYmx1ZXRvb3RoLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvbGlnaHQvbGlnaHQuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9vcmllbnRhdGlvbi9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlY3VyZS9zZWN1cmUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9zb2NrZXQvc29ja2V0cy5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3ZvaWNlL3ZvaWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXIubW9kdWxlKFwiU3VwZXJQb3dlckFwcFwiLCBbJ25nTWF0ZXJpYWwnXSlcbi5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG4gICAgLnByaW1hcnlQYWxldHRlKCdyZWQnKVxuICAgIC5hY2NlbnRQYWxldHRlKCdvcmFuZ2UnKTtcbn0pXG4uc2VydmljZSgnU29ja2V0U2VydmljZScsIHJlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKSlcbi5kaXJlY3RpdmUoJ2FwcCcsIFsnJG1kRGlhbG9nJywgJyR0aW1lb3V0JywgJ1NvY2tldFNlcnZpY2UnLFxuXHRmdW5jdGlvbigkbWREaWFsb2csICR0aW1lb3V0LCBTb2NrZXRTZXJ2aWNlKXtcblx0cmV0dXJuIHtcblx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9hcHAuaHRtbCcsXG5cdFx0Y29udHJvbGxlckFzIDogJ2FwcCcsXG5cdFx0YmluZFRvQ29udHJvbGxlciA6IHRydWUsXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuYWN0aW9ucyA9IFtcblx0XHRcdFx0e2xhYmVsIDogXCJCbHVldG9vdGhcIiwgaWNvbiA6ICdmYS1ibHVldG9vdGgnLCBpZEFjdGlvbjogJ2JsZSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIkxpZ2h0XCIsIGljb24gOiAnZmEtbGlnaHRidWxiLW8nLCBpZEFjdGlvbjogJ2xpZ2h0J30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiT3JpZW50YXRpb25cIiwgaWNvbiA6ICdmYS1jb21wYXNzJywgaWRBY3Rpb246ICdvcmllbnRhdGlvbid9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlZvaWNlXCIsIGljb24gOiAnZmEtbWljcm9waG9uZScsIGlkQWN0aW9uOiAnbWljJ31cblx0XHRcdF07XG5cblx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3NlY3VyZUN0cmwnLFxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9zZWN1cmUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vc2VjdXJlL3NlY3VyZScpLFxuXHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5vcGVuRGlhbG9nID0gZnVuY3Rpb24oZXZlbnQsIHR5cGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnT3BlbiBEaWFsb2cnKTtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdibGUnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnYmxlQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9ibHVldG9vdGguaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL2JsdWV0b290aC9ibHVldG9vdGgnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ2xpZ2h0Jyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2xpZ2h0Q3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9saWdodC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vbGlnaHQvbGlnaHQnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ29yaWVudGF0aW9uJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ29yaWVudGF0aW9uQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4vY29tcG9uZW50cy9vcmllbnRhdGlvbi5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vb3JpZW50YXRpb24vb3JpZW50YXRpb24nKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZSBpZiAodHlwZSA9PT0gJ21pYycpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICd2b2ljZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvdm9pY2UuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuL3ZvaWNlL3ZvaWNlJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufV0pO1xuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkKCl7XHRcblx0Ly9yZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJyk7XG59XG5cblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTsiLCIndXNlIHN0cmljdCdcblxuY29uc3Qgc2VydmljZVVVSUQgPSAnMTExMTExMTEtMjIyMi0zMzMzLTQ0NDQtMDAwMDAwMDAwMDAwJyxcblx0Y2hhcmFjdGVyaXN0aWNXcml0ZVVVSUQgPSAnMTExMTExMTEtMjIyMi0zMzMzLTQ0NDQtMDAwMDAwMDAwMDEwJztcblxuZnVuY3Rpb24gYWIyc3RyKGJ1Zikge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDE2QXJyYXkoYnVmKSk7XG59XG5cbmZ1bmN0aW9uIHN0cjJhYihzdHIpIHtcbiAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihzdHIubGVuZ3RoKjIpOyAvLyAyIGJ5dGVzIGZvciBlYWNoIGNoYXJcbiAgdmFyIGJ1ZlZpZXcgPSBuZXcgVWludDE2QXJyYXkoYnVmKTtcbiAgZm9yICh2YXIgaT0wLCBzdHJMZW49c3RyLmxlbmd0aDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgYnVmVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBidWY7XG59XG5cbnZhciBzZXJ2ZXJHQVRUID0gbnVsbCxcblx0c2VydmljZUdBVFQgPSBudWxsLFxuXHRjaGFyYWN0ZXJpc3RpY0dBVFQgPSBudWxsLFxuXHRlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmZ1bmN0aW9uIGluaXRCbGUoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0bmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHsgXG5cdFx0XHRmaWx0ZXJzOiBbeyBuYW1lOiAnUnBpSmVmTGVkRGV2aWNlJyB9LCB7IG5hbWU6ICdKZWZMZWREZXZpY2UnIH1dXG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihkZXZpY2UpIHtcblx0XHQgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RpbmcuLi5cIik7XG5cdFx0ICAgcmV0dXJuIGRldmljZS5jb25uZWN0R0FUVCgpO1xuXHRcdCB9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXHRcdFx0c2VydmVyR0FUVCA9IHNlcnZlcjtcblx0XHRcdC8vcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShzZXJ2aWNlVVVJRCk7XG5cdFx0ICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIHRpbWVvdXQgd2hlbiBHYXR0U2VydmljZXMgcHJvcGVydHkgd29ya3MgYXMgaW50ZW5kZWQuXG5cdFx0ICAgLy8gY3JidWcuY29tLzU2MDI3N1xuXHRcdCAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlU2VydmljZSwgcmVqZWN0U2VydmljZSkge1xuXHRcdCAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHQgICAgIFx0dHJ5e1xuXHRcdCAgICAgXHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBTZXJ2aWNlXCIpO1xuXHRcdCAgICAgICBcdFx0cmVzb2x2ZVNlcnZpY2Uoc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHNlcnZpY2VVVUlEKSk7XG5cdFx0ICAgICBcdH1jYXRjaChlcnIpe1xuXHRcdCAgICAgXHRcdHJlamVjdFNlcnZpY2UoZXJyKTtcblx0XHQgICAgIFx0fVxuXHRcdCAgICAgfSwgMmUzKTtcblx0XHQgICB9KVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRzZXJ2aWNlR0FUVCA9IHNlcnZpY2U7XG5cdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1x0XHRcdFxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHR9KTtcblx0fSlcbn1cblxuXG5mdW5jdGlvbiBnZXRTZXJ2aWNlKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdGlmIChzZXJ2ZXJHQVRUICYmIHNlcnZlckdBVFQuY29ubmVjdGVkICYmIHNlcnZpY2VHQVRUKXtcblx0XHRcdHJlc29sdmUoc2VydmljZUdBVFQpO1xuXHRcdH1lbHNle1xuXHRcdFx0aW5pdEJsZSgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdFx0cmVzb2x2ZShzZXJ2aWNlKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hhcmFjdGVyaXN0aWMoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKGNoYXJhY3RlcmlzdGljR0FUVCl7XG5cdFx0XHRyZXNvbHZlKGNoYXJhY3RlcmlzdGljR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRnZXRTZXJ2aWNlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byBnZXQgQ2hhcmFjdGVyaXRpYyA6ICVPXCIsc2VydmljZSk7XG5cdFx0XHRcdHJldHVybiBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljV3JpdGVVVUlEKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbihjaGFyYWN0ZXJpdGljKXtcblx0XHRcdFx0Y2hhcmFjdGVyaXN0aWNHQVRUID0gY2hhcmFjdGVyaXRpYztcblx0XHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpdGljKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDaGFyYWN0ZXJpc3RpYyh0eXBlLCBkYXRhLCBjYWxsYmFjayl7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXN0aWMpe1xuXHRcdGlmICh0eXBlID09PSAnd3JpdGUnKXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHdyaXRlIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShlbmNvZGVyLmVuY29kZShkYXRhKSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byByZWFkIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMucmVhZFZhbHVlKCk7XG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcil7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1xuXHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmluZm8oXCJXcml0ZSBkYXRhcyAhIFwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBkYXRhID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG5cdFx0ICAgIGxldCBkYXRhRGVjcnlwdCA9IGRhdGEuZ2V0VWludDgoMCk7XG5cdFx0ICAgIGNhbGxiYWNrKHt0eXBlOiAncmVhZCcgLCB2YWx1ZSA6IGRhdGFEZWNyeXB0fSk7XG5cdFx0ICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlRGF0YXMgJXMnLCBkYXRhRGVjcnlwdCk7XG5cdFx0fVxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0aWYgKGNhbGxiYWNrKSB7XG5cblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cblxuXG5mdW5jdGlvbiBCbGVDb250cm9sbGVyKCRtZERpYWxvZywgJHRpbWVvdXQpe1xuXG5cdHRoaXMuc2xpZGVyQWN0aXYgPSBmYWxzZTtcblx0dGhpcy5jdXJyZW50VGltZXIgPSBudWxsO1xuXHR0aGlzLnBvd2VyID0gMTI1O1xuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH0gXG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcIm9uXCIpO1xuXHR9XG5cblx0dGhpcy5ibGluayA9IGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwiYmxpbmtcIik7XG5cdH1cblxuXHR0aGlzLnR1cm5PZmYgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcIm9mZlwiKTtcblx0fVxuXHRcblx0dGhpcy5jaGFuZ2VQb3dlciA9IGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwiYnJpZ2h0OlwiK3RoaXMucG93ZXIpO1xuXHR9O1xuXG5cdHRoaXMuYWN0aXZTbGlkZXIgPSBmdW5jdGlvbigpe1xuXHRcdGlmICh0aGlzLmN1cnJlbnRUaW1lcil7XG5cdFx0XHQkdGltZW91dC5jYW5jZWwodGhpcy5jdXJyZW50VGltZXIpO1xuXHRcdH1cblx0XHR0aGlzLnNsaWRlckFjdGl2ID0gdHJ1ZTtcblx0XHR0aGlzLmN1cnJlbnRUaW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uKGNvbnRleHQpe1xuXHRcdFx0Y29udGV4dC5zbGlkZXJBY3RpdiA9IGZhbHNlO1xuXHRcdH0sNTAwMCx0cnVlLCB0aGlzKTtcblx0fVxufVxuXG5CbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICckdGltZW91dCddXG5cblxubW9kdWxlLmV4cG9ydHMgPSBCbGVDb250cm9sbGVyOy8qe1xuXHR3cml0ZURhdGEgOiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWNcbn0qL1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmxldCBzb2NrZXQgPSBudWxsO1xuXG4vLyBUaGUgaGFuZGxlclxudmFyIGRldmljZUxpZ2h0SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdC8vIFRoZSB2YWx1ZSB3aWxsIGxpdmUgYmV0d2VlbiAwIGFuZCB+MTUwXG5cdC8vIEJ1dCB3aGVuIGl0IGlzIDQ1IGlzIGEgaGlnaCBsdW1vbnNpdHlcblx0dmFyIHZhbHVlID0gTWF0aC5taW4oNDUsIGV2ZW50LnZhbHVlKTsgICAgICAgIFxuXHRsZXQgcGVyY2VudCA9IE1hdGgucm91bmQoKHZhbHVlIC8gNDUpICogMTAwKTsgICAgICAgXG5cdHNvY2tldC5zZW5kTWVzc2FnZSh7dHlwZTogJ2xpZ2h0JywgdmFsdWUgOiBwZXJjZW50fSk7XG59XG5cbi8vIFdlIGFkZCB0aGUgbGlzdGVuZXJcbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VsaWdodCcsIGRldmljZUxpZ2h0SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VsaWdodCcsIGRldmljZUxpZ2h0SGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBMaWdodENvbnRyb2xlcigkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xuXG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHJlZ2lzdGVyKCk7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5MaWdodENvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cbm1vZHVsZS5leHBvcnRzID0gTGlnaHRDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgc29ja2V0ID0gbnVsbCwgXG5cdGZpcnN0VmFsdWUgPSAtMTtcblxuLy8gVGhlIGhhbmRsZXIgb2YgdGhlIGV2ZW50XG52YXIgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KXsgICAgICAgIFxuXHR2YXIgYWxwaGEgPSBNYXRoLnJvdW5kKGV2ZW50LmFscGhhKTtcblx0dmFyIGJldGEgPSBNYXRoLnJvdW5kKGV2ZW50LmJldGEpO1xuXHR2YXIgZ2FtbWEgPSBNYXRoLnJvdW5kKGV2ZW50LmdhbW1hKTtcblx0aWYgKGZpcnN0VmFsdWUgPT09IC0xKXtcblx0XHRmaXJzdFZhbHVlID0gYWxwaGE7XG5cdH1cblx0c29ja2V0LnNlbmRNZXNzYWdlKHt0eXBlOiAnb3JpZW50YXRpb24nLCB2YWx1ZSA6IGFscGhhLCAnZmlyc3RWYWx1ZScgOiBmaXJzdFZhbHVlfSk7XHRcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0Zmlyc3RWYWx1ZSA9IC0xO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBPcmllbnRhdGlvbkNvbnRyb2xlcigkbWREaWFsb2csIFNvY2tldFNlcnZpY2Upe1xuXG5cdHNvY2tldCA9IFNvY2tldFNlcnZpY2U7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHJlZ2lzdGVyKCk7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5PcmllbnRhdGlvbkNvbnRyb2xlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnU29ja2V0U2VydmljZSddXG5cblxubW9kdWxlLmV4cG9ydHMgPSBPcmllbnRhdGlvbkNvbnRyb2xlcjsiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIpKXtcblx0XHRyZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxuXHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjgwMDBcIil7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2plZi5iaW5vbWVkLmZyOjgwMDBcIjtcblx0fWVsc2V7XG5cdFx0cmV0dXJuIG51bGw7XHRcblx0fSBcbn1cblxudmFyIGFkZHJlc3MgPSBjYWxjdWxhdGVBZGRyZXNzKCk7XG5cbmZ1bmN0aW9uIGRvUmVxdWVzdCgkbWREaWFsb2csIGNvbnRleHQsIHB3ZCl7XG5cdGxldCBteUhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICBoZWFkZXJzOiBteUhlYWRlcnMsXG4gICAgICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuXG5cdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHthZGRyZXNzfS9wYXNzd29yZC8ke3B3ZH1gLG15SW5pdCk7XG5cdGZldGNoKG15UmVxdWVzdClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdC8vIE9uIG5lIHJldHJhaXJlIHBhcyB1bmUgcXVlc3Rpb24gZMOpasOgIHRyYWl0w6llXG5cdFx0aWYgKGpzb24uYXV0aCl7XG5cdFx0XHRsb2NhbFN0b3JhZ2VbJ3B3ZCddID0gcHdkO1xuXHRcdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvbnRleHQubm90dmFsaWQgPSB0cnVlO1xuXHRcdH1cblxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBTZWN1cmVDdHJsKCRtZERpYWxvZyl7XG5cdFxuXHR0aGlzLm5vdHZhbGlkID0gZmFsc2U7XG5cblx0dGhpcy50cnkgPSBmdW5jdGlvbigpe1xuXHRcdGRvUmVxdWVzdCgkbWREaWFsb2csIHRoaXMsIHRoaXMucHdkKTtcblx0fVxuXG5cdGlmIChsb2NhbFN0b3JhZ2VbJ3B3ZCddKXtcblx0XHRkb1JlcXVlc3QoJG1kRGlhbG9nLCB0aGlzLCBsb2NhbFN0b3JhZ2VbJ3B3ZCddKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlY3VyZUN0cmw7IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBzb2NrZXQgPSBpbyhcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKTtcblxuZnVuY3Rpb24gU29ja2V0U2VydmljZSgpe1xuXG5cdHRoaXMuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xuXHRcdHNvY2tldC5lbWl0KCdzZW5zb3InLCBtc2cpO1xuXHR9XG5cblx0dGhpcy5nZXRTb2NrZXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBzb2NrZXQ7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldFNlcnZpY2U7IiwiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHRcbn1cblxuXG5mdW5jdGlvbiBWb2ljZUNvbnRyb2xlcigkbWREaWFsb2cpe1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRyZWdpc3RlcigpO1xuXHR9XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZvaWNlQ29udHJvbGVyOyJdfQ==
