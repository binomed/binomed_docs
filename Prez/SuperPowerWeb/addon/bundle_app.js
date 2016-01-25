(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

angular.module("SuperPowerApp", ['ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('orange');
})
.directive('app', ['$mdDialog', '$timeout', function($mdDialog, $timeout){
	return {
		templateUrl: '../../components/app.html',
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
				templateUrl: '../../components/secure.html',
				controller: require('../app/secure/secure'),
				parent : angular.element(document.querySelector('#mainContainer')),
				targetEvent : event,
				fullScreen : true
			});

			this.openDialog = function(event, type){
				console.log('Open Dialog');
				if (type === 'ble'){
					$mdDialog.show({
						controllerAs : 'bleCtrl',
						templateUrl: '../../components/bluetooth.html',
						controller: require('../app/bluetooth/bluetooth'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'light'){
					$mdDialog.show({
						controllerAs : 'lightCtrl',
						templateUrl: '../../components/light.html',
						controller: require('../app/light/light'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'orientation'){
					$mdDialog.show({
						controllerAs : 'orientationCtrl',
						templateUrl: '../../components/orientation.html',
						controller: require('../app/orientation/orientation'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}else if (type === 'mic'){
					$mdDialog.show({
						controllerAs : 'voiceCtrl',
						templateUrl: '../../components/voice.html',
						controller: require('../app/voice/voice'),
						parent : angular.element(document.querySelector('#mainContainer')),
						targetEvent : event,
						fullScreen : true
					});
				}
			}
		}
	}
}]);

var ble = require('./bluetooth/bluetooth');


function pageLoad(){	
	//require('./socket/sockets');
}



window.addEventListener('load', pageLoad);
},{"../app/bluetooth/bluetooth":2,"../app/light/light":3,"../app/orientation/orientation":4,"../app/secure/secure":5,"../app/voice/voice":6,"./bluetooth/bluetooth":2}],2:[function(require,module,exports){
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
	characteristicGATT = null;

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
			return characteristic.writeValue(str2ab(data));
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
	
	/*this.$watch('power', function(newPower, oldPower){
		processCharacteristic('write', "bright:"+newPower);
	});*/

	this.activSlider = function(){
		if (this.currentTimer){
			this.currentTimer.cancel();
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

 	// The handler
	var deviceLightHandler = function(event) {
		// The value will live between 0 and ~150
		// But when it is 45 is a high lumonsity
		var value = Math.min(45, event.value);        
		percent = Math.round((value / 45) * 100);       
		//socket.sendLight(percent);
		//updateLight(); 
	}

	// We add the listener
	function register(){
	window.addEventListener('devicelight', deviceLightHandler, false);
	}

	function unregister(){
	window.removeEventListener('devicelight', deviceLightHandler, false);
	}

function LightControler($mdDialog){

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}


module.exports = LightControler;
},{}],4:[function(require,module,exports){
'use strict';

 	// The handler of the event
	var deviceOrientationListener = function(event){        
		var alpha = Math.round(event.alpha);
		var beta = Math.round(event.beta);
		var gamma = Math.round(event.gamma);
		//updateRotation(alpha);
		//socket.sendOrientation(alpha);
	}

	function register(){
		window.addEventListener('deviceorientation', deviceOrientationListener, false);
	}

	function unregister(){
		window.removeEventListener('deviceorientation', deviceOrientationListener, false);
	}

function OrientationControler($mdDialog){

	this.turnOn = function(){
		register();
	}

	this.close = function(){
		unregister();
		$mdDialog.hide();
	}
}


module.exports = OrientationControler;
},{}],5:[function(require,module,exports){
'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3010")){
		return "http://localhost:9000"
	}else if (location.port && location.port === "9000"){
		return "http://jef.binomed.fr:9000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();

function SecureCtrl($mdDialog){
	
	this.notvalid = false;

	this.try = function(){
		let myHeaders = new Headers();
		let myInit = { method: 'GET',
	           headers: myHeaders,
	           mode: 'cors',
	           cache: 'default' };
	    let context = this;

		let myRequest = new Request(`${address}/password/${this.pwd}`,myInit);
		fetch(myRequest)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			// On ne retraire pas une question déjà traitée
			if (json.auth){
				$mdDialog.hide();
			}else{
				context.notvalid = true;
			}


		});

	}
}

module.exports = SecureCtrl;
},{}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9hcHAuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9ibHVldG9vdGgvYmx1ZXRvb3RoLmpzIiwiYWRkb24vc2NyaXB0cy9hcHAvbGlnaHQvbGlnaHQuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC9vcmllbnRhdGlvbi9vcmllbnRhdGlvbi5qcyIsImFkZG9uL3NjcmlwdHMvYXBwL3NlY3VyZS9zZWN1cmUuanMiLCJhZGRvbi9zY3JpcHRzL2FwcC92b2ljZS92b2ljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuYW5ndWxhci5tb2R1bGUoXCJTdXBlclBvd2VyQXBwXCIsIFsnbmdNYXRlcmlhbCddKVxuLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAucHJpbWFyeVBhbGV0dGUoJ3JlZCcpXG4gICAgLmFjY2VudFBhbGV0dGUoJ29yYW5nZScpO1xufSlcbi5kaXJlY3RpdmUoJ2FwcCcsIFsnJG1kRGlhbG9nJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJG1kRGlhbG9nLCAkdGltZW91dCl7XG5cdHJldHVybiB7XG5cdFx0dGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2FwcC5odG1sJyxcblx0XHRjb250cm9sbGVyQXMgOiAnYXBwJyxcblx0XHRiaW5kVG9Db250cm9sbGVyIDogdHJ1ZSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5hY3Rpb25zID0gW1xuXHRcdFx0XHR7bGFiZWwgOiBcIkJsdWV0b290aFwiLCBpY29uIDogJ2ZhLWJsdWV0b290aCcsIGlkQWN0aW9uOiAnYmxlJ30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiTGlnaHRcIiwgaWNvbiA6ICdmYS1saWdodGJ1bGItbycsIGlkQWN0aW9uOiAnbGlnaHQnfSxcblx0XHRcdFx0e2xhYmVsIDogXCJPcmllbnRhdGlvblwiLCBpY29uIDogJ2ZhLWNvbXBhc3MnLCBpZEFjdGlvbjogJ29yaWVudGF0aW9uJ30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiVm9pY2VcIiwgaWNvbiA6ICdmYS1taWNyb3Bob25lJywgaWRBY3Rpb246ICdtaWMnfVxuXHRcdFx0XTtcblxuXHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRjb250cm9sbGVyQXMgOiAnc2VjdXJlQ3RybCcsXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9zZWN1cmUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4uL2FwcC9zZWN1cmUvc2VjdXJlJyksXG5cdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLm9wZW5EaWFsb2cgPSBmdW5jdGlvbihldmVudCwgdHlwZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdPcGVuIERpYWxvZycpO1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2JsZScpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdibGVDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9ibHVldG9vdGguaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuLi9hcHAvYmx1ZXRvb3RoL2JsdWV0b290aCcpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnbGlnaHQnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnbGlnaHRDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9saWdodC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4uL2FwcC9saWdodC9saWdodCcpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnb3JpZW50YXRpb24nKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAnb3JpZW50YXRpb25DdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9vcmllbnRhdGlvbi5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4uL2FwcC9vcmllbnRhdGlvbi9vcmllbnRhdGlvbicpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNlIGlmICh0eXBlID09PSAnbWljJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ3ZvaWNlQ3RybCcsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJy4uLy4uL2NvbXBvbmVudHMvdm9pY2UuaHRtbCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiByZXF1aXJlKCcuLi9hcHAvdm9pY2Uvdm9pY2UnKSxcblx0XHRcdFx0XHRcdHBhcmVudCA6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbkNvbnRhaW5lcicpKSxcblx0XHRcdFx0XHRcdHRhcmdldEV2ZW50IDogZXZlbnQsXG5cdFx0XHRcdFx0XHRmdWxsU2NyZWVuIDogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XSk7XG5cbnZhciBibGUgPSByZXF1aXJlKCcuL2JsdWV0b290aC9ibHVldG9vdGgnKTtcblxuXG5mdW5jdGlvbiBwYWdlTG9hZCgpe1x0XG5cdC8vcmVxdWlyZSgnLi9zb2NrZXQvc29ja2V0cycpO1xufVxuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHNlcnZpY2VVVUlEID0gJzExMTExMTExLTIyMjItMzMzMy00NDQ0LTAwMDAwMDAwMDAwMCcsXG5cdGNoYXJhY3RlcmlzdGljV3JpdGVVVUlEID0gJzExMTExMTExLTIyMjItMzMzMy00NDQ0LTAwMDAwMDAwMDAxMCc7XG5cbmZ1bmN0aW9uIGFiMnN0cihidWYpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQxNkFycmF5KGJ1ZikpO1xufVxuXG5mdW5jdGlvbiBzdHIyYWIoc3RyKSB7XG4gIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoc3RyLmxlbmd0aCoyKTsgLy8gMiBieXRlcyBmb3IgZWFjaCBjaGFyXG4gIHZhciBidWZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1Zik7XG4gIGZvciAodmFyIGk9MCwgc3RyTGVuPXN0ci5sZW5ndGg7IGkgPCBzdHJMZW47IGkrKykge1xuICAgIGJ1ZlZpZXdbaV0gPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgfVxuICByZXR1cm4gYnVmO1xufVxuXG52YXIgc2VydmVyR0FUVCA9IG51bGwsXG5cdHNlcnZpY2VHQVRUID0gbnVsbCxcblx0Y2hhcmFjdGVyaXN0aWNHQVRUID0gbnVsbDtcblxuZnVuY3Rpb24gaW5pdEJsZSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2UoeyBcblx0XHRcdGZpbHRlcnM6IFt7IG5hbWU6ICdScGlKZWZMZWREZXZpY2UnIH0sIHsgbmFtZTogJ0plZkxlZERldmljZScgfV1cblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGRldmljZSkge1xuXHRcdCAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGluZy4uLlwiKTtcblx0XHQgICByZXR1cm4gZGV2aWNlLmNvbm5lY3RHQVRUKCk7XG5cdFx0IH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cdFx0XHRzZXJ2ZXJHQVRUID0gc2VydmVyO1xuXHRcdFx0Ly9yZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHNlcnZpY2VVVUlEKTtcblx0XHQgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgdGltZW91dCB3aGVuIEdhdHRTZXJ2aWNlcyBwcm9wZXJ0eSB3b3JrcyBhcyBpbnRlbmRlZC5cblx0XHQgICAvLyBjcmJ1Zy5jb20vNTYwMjc3XG5cdFx0ICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmVTZXJ2aWNlLCByZWplY3RTZXJ2aWNlKSB7XG5cdFx0ICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgXHR0cnl7XG5cdFx0ICAgICBcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IFNlcnZpY2VcIik7XG5cdFx0ICAgICAgIFx0XHRyZXNvbHZlU2VydmljZShzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2Uoc2VydmljZVVVSUQpKTtcblx0XHQgICAgIFx0fWNhdGNoKGVycil7XG5cdFx0ICAgICBcdFx0cmVqZWN0U2VydmljZShlcnIpO1xuXHRcdCAgICAgXHR9XG5cdFx0ICAgICB9LCAyZTMpO1xuXHRcdCAgIH0pXG5cdFx0fSkudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdHNlcnZpY2VHQVRUID0gc2VydmljZTtcblx0XHRcdHJlc29sdmUoc2VydmljZSk7XHRcdFx0XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHR9KVxufVxuXG5cbmZ1bmN0aW9uIGdldFNlcnZpY2UoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKHNlcnZlckdBVFQgJiYgc2VydmVyR0FUVC5jb25uZWN0ZWQgJiYgc2VydmljZUdBVFQpe1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpbml0QmxlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDaGFyYWN0ZXJpc3RpYygpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoY2hhcmFjdGVyaXN0aWNHQVRUKXtcblx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXN0aWNHQVRUKTtcblx0XHR9ZWxzZXtcblx0XHRcdGdldFNlcnZpY2UoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBDaGFyYWN0ZXJpdGljIDogJU9cIixzZXJ2aWNlKTtcblx0XHRcdFx0cmV0dXJuIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNXcml0ZVVVSUQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3Rlcml0aWMpe1xuXHRcdFx0XHRjaGFyYWN0ZXJpc3RpY0dBVFQgPSBjaGFyYWN0ZXJpdGljO1xuXHRcdFx0XHRyZXNvbHZlKGNoYXJhY3Rlcml0aWMpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0NoYXJhY3RlcmlzdGljKHR5cGUsIGRhdGEsIGNhbGxiYWNrKXtcblx0Z2V0Q2hhcmFjdGVyaXN0aWMoKVxuXHQudGhlbihmdW5jdGlvbihjaGFyYWN0ZXJpc3RpYyl7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1x0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gd3JpdGUgdmFsdWUgOiAlT1wiLGNoYXJhY3RlcmlzdGljKTtcblx0XHRcdHJldHVybiBjaGFyYWN0ZXJpc3RpYy53cml0ZVZhbHVlKHN0cjJhYihkYXRhKSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byByZWFkIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMucmVhZFZhbHVlKCk7XG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcil7XG5cdFx0aWYgKHR5cGUgPT09ICd3cml0ZScpe1xuXHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRjYWxsYmFjayh7dHlwZTogJ3dyaXRlJywgdmFsdWUgOiB0cnVlfSk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmluZm8oXCJXcml0ZSBkYXRhcyAhIFwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBkYXRhID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG5cdFx0ICAgIGxldCBkYXRhRGVjcnlwdCA9IGRhdGEuZ2V0VWludDgoMCk7XG5cdFx0ICAgIGNhbGxiYWNrKHt0eXBlOiAncmVhZCcgLCB2YWx1ZSA6IGRhdGFEZWNyeXB0fSk7XG5cdFx0ICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlRGF0YXMgJXMnLCBkYXRhRGVjcnlwdCk7XG5cdFx0fVxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0aWYgKGNhbGxiYWNrKSB7XG5cblx0XHRcdGNhbGxiYWNrKHt0eXBlIDogJ2Vycm9yJywgdmFsdWUgOiBlcnJvcn0pO1xuXHRcdH1cblx0fSk7XG59XG5cblxuXG5mdW5jdGlvbiBCbGVDb250cm9sbGVyKCRtZERpYWxvZywgJHRpbWVvdXQpe1xuXG5cdHRoaXMuc2xpZGVyQWN0aXYgPSBmYWxzZTtcblx0dGhpcy5jdXJyZW50VGltZXIgPSBudWxsO1xuXHR0aGlzLnBvd2VyID0gMTI1O1xuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH0gXG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcIm9uXCIpO1xuXHR9XG5cblx0dGhpcy5ibGluayA9IGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwiYmxpbmtcIik7XG5cdH1cblxuXHR0aGlzLnR1cm5PZmYgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcIm9mZlwiKTtcblx0fVxuXHRcblx0Lyp0aGlzLiR3YXRjaCgncG93ZXInLCBmdW5jdGlvbihuZXdQb3dlciwgb2xkUG93ZXIpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcImJyaWdodDpcIituZXdQb3dlcik7XG5cdH0pOyovXG5cblx0dGhpcy5hY3RpdlNsaWRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuY3VycmVudFRpbWVyKXtcblx0XHRcdHRoaXMuY3VycmVudFRpbWVyLmNhbmNlbCgpO1xuXHRcdH1cblx0XHR0aGlzLnNsaWRlckFjdGl2ID0gdHJ1ZTtcblx0XHR0aGlzLmN1cnJlbnRUaW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uKGNvbnRleHQpe1xuXHRcdFx0Y29udGV4dC5zbGlkZXJBY3RpdiA9IGZhbHNlO1xuXHRcdH0sNTAwMCx0cnVlLCB0aGlzKTtcblx0fVxufVxuXG5CbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRtZERpYWxvZycsICckdGltZW91dCddXG5cblxubW9kdWxlLmV4cG9ydHMgPSBCbGVDb250cm9sbGVyOy8qe1xuXHR3cml0ZURhdGEgOiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWNcbn0qL1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbiBcdC8vIFRoZSBoYW5kbGVyXG5cdHZhciBkZXZpY2VMaWdodEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdC8vIFRoZSB2YWx1ZSB3aWxsIGxpdmUgYmV0d2VlbiAwIGFuZCB+MTUwXG5cdFx0Ly8gQnV0IHdoZW4gaXQgaXMgNDUgaXMgYSBoaWdoIGx1bW9uc2l0eVxuXHRcdHZhciB2YWx1ZSA9IE1hdGgubWluKDQ1LCBldmVudC52YWx1ZSk7ICAgICAgICBcblx0XHRwZXJjZW50ID0gTWF0aC5yb3VuZCgodmFsdWUgLyA0NSkgKiAxMDApOyAgICAgICBcblx0XHQvL3NvY2tldC5zZW5kTGlnaHQocGVyY2VudCk7XG5cdFx0Ly91cGRhdGVMaWdodCgpOyBcblx0fVxuXG5cdC8vIFdlIGFkZCB0aGUgbGlzdGVuZXJcblx0ZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG5cdH1cblxuXHRmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VsaWdodCcsIGRldmljZUxpZ2h0SGFuZGxlciwgZmFsc2UpO1xuXHR9XG5cbmZ1bmN0aW9uIExpZ2h0Q29udHJvbGVyKCRtZERpYWxvZyl7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHJlZ2lzdGVyKCk7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTGlnaHRDb250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG4gXHQvLyBUaGUgaGFuZGxlciBvZiB0aGUgZXZlbnRcblx0dmFyIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7ICAgICAgICBcblx0XHR2YXIgYWxwaGEgPSBNYXRoLnJvdW5kKGV2ZW50LmFscGhhKTtcblx0XHR2YXIgYmV0YSA9IE1hdGgucm91bmQoZXZlbnQuYmV0YSk7XG5cdFx0dmFyIGdhbW1hID0gTWF0aC5yb3VuZChldmVudC5nYW1tYSk7XG5cdFx0Ly91cGRhdGVSb3RhdGlvbihhbHBoYSk7XG5cdFx0Ly9zb2NrZXQuc2VuZE9yaWVudGF0aW9uKGFscGhhKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIGRldmljZU9yaWVudGF0aW9uTGlzdGVuZXIsIGZhbHNlKTtcblx0fVxuXG5mdW5jdGlvbiBPcmllbnRhdGlvbkNvbnRyb2xlcigkbWREaWFsb2cpe1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRyZWdpc3RlcigpO1xuXHR9XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yaWVudGF0aW9uQ29udHJvbGVyOyIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBjYWxjdWxhdGVBZGRyZXNzKCl7XG5cdGlmIChsb2NhdGlvbi5wb3J0ICYmIChsb2NhdGlvbi5wb3J0ID09PSBcIjMwMTBcIikpe1xuXHRcdHJldHVybiBcImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMFwiXG5cdH1lbHNlIGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiOTAwMFwiKXtcblx0XHRyZXR1cm4gXCJodHRwOi8vamVmLmJpbm9tZWQuZnI6OTAwMFwiO1xuXHR9ZWxzZXtcblx0XHRyZXR1cm4gbnVsbDtcdFxuXHR9IFxufVxuXG52YXIgYWRkcmVzcyA9IGNhbGN1bGF0ZUFkZHJlc3MoKTtcblxuZnVuY3Rpb24gU2VjdXJlQ3RybCgkbWREaWFsb2cpe1xuXHRcblx0dGhpcy5ub3R2YWxpZCA9IGZhbHNlO1xuXG5cdHRoaXMudHJ5ID0gZnVuY3Rpb24oKXtcblx0XHRsZXQgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0XHRsZXQgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnLFxuXHQgICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcblx0ICAgICAgICAgICBtb2RlOiAnY29ycycsXG5cdCAgICAgICAgICAgY2FjaGU6ICdkZWZhdWx0JyB9O1xuXHQgICAgbGV0IGNvbnRleHQgPSB0aGlzO1xuXG5cdFx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke2FkZHJlc3N9L3Bhc3N3b3JkLyR7dGhpcy5wd2R9YCxteUluaXQpO1xuXHRcdGZldGNoKG15UmVxdWVzdClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oanNvbil7XG5cdFx0XHQvLyBPbiBuZSByZXRyYWlyZSBwYXMgdW5lIHF1ZXN0aW9uIGTDqWrDoCB0cmFpdMOpZVxuXHRcdFx0aWYgKGpzb24uYXV0aCl7XG5cdFx0XHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Y29udGV4dC5ub3R2YWxpZCA9IHRydWU7XG5cdFx0XHR9XG5cblxuXHRcdH0pO1xuXG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWN1cmVDdHJsOyIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiByZWdpc3Rlcigpe1xuXG59XG5cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0XG59XG5cblxuZnVuY3Rpb24gVm9pY2VDb250cm9sZXIoJG1kRGlhbG9nKXtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBWb2ljZUNvbnRyb2xlcjsiXX0=
