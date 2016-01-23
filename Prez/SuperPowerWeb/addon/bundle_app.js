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
},{"../app/bluetooth/bluetooth":2,"../app/light/light":3,"../app/orientation/orientation":4,"../app/voice/voice":5,"./bluetooth/bluetooth":2}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FwcC9hcHAuanMiLCJzY3JpcHRzL2FwcC9ibHVldG9vdGgvYmx1ZXRvb3RoLmpzIiwic2NyaXB0cy9hcHAvbGlnaHQvbGlnaHQuanMiLCJzY3JpcHRzL2FwcC9vcmllbnRhdGlvbi9vcmllbnRhdGlvbi5qcyIsInNjcmlwdHMvYXBwL3ZvaWNlL3ZvaWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXIubW9kdWxlKFwiU3VwZXJQb3dlckFwcFwiLCBbJ25nTWF0ZXJpYWwnXSlcbi5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG4gICAgLnByaW1hcnlQYWxldHRlKCdyZWQnKVxuICAgIC5hY2NlbnRQYWxldHRlKCdvcmFuZ2UnKTtcbn0pXG4uZGlyZWN0aXZlKCdhcHAnLCBbJyRtZERpYWxvZycsICckdGltZW91dCcsIGZ1bmN0aW9uKCRtZERpYWxvZywgJHRpbWVvdXQpe1xuXHRyZXR1cm4ge1xuXHRcdHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy9hcHAuaHRtbCcsXG5cdFx0Y29udHJvbGxlckFzIDogJ2FwcCcsXG5cdFx0YmluZFRvQ29udHJvbGxlciA6IHRydWUsXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuYWN0aW9ucyA9IFtcblx0XHRcdFx0e2xhYmVsIDogXCJCbHVldG9vdGhcIiwgaWNvbiA6ICdmYS1ibHVldG9vdGgnLCBpZEFjdGlvbjogJ2JsZSd9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIkxpZ2h0XCIsIGljb24gOiAnZmEtbGlnaHRidWxiLW8nLCBpZEFjdGlvbjogJ2xpZ2h0J30sXG5cdFx0XHRcdHtsYWJlbCA6IFwiT3JpZW50YXRpb25cIiwgaWNvbiA6ICdmYS1jb21wYXNzJywgaWRBY3Rpb246ICdvcmllbnRhdGlvbid9LFxuXHRcdFx0XHR7bGFiZWwgOiBcIlZvaWNlXCIsIGljb24gOiAnZmEtbWljcm9waG9uZScsIGlkQWN0aW9uOiAnbWljJ31cblx0XHRcdF07XG5cblx0XHRcdHRoaXMub3BlbkRpYWxvZyA9IGZ1bmN0aW9uKGV2ZW50LCB0eXBlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ09wZW4gRGlhbG9nJyk7XG5cdFx0XHRcdGlmICh0eXBlID09PSAnYmxlJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2JsZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2JsdWV0b290aC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4uL2FwcC9ibHVldG9vdGgvYmx1ZXRvb3RoJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdsaWdodCcpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdsaWdodEN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2xpZ2h0Lmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi4vYXBwL2xpZ2h0L2xpZ2h0JyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdvcmllbnRhdGlvbicpe1xuXHRcdFx0XHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXJBcyA6ICdvcmllbnRhdGlvbkN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL29yaWVudGF0aW9uLmh0bWwnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogcmVxdWlyZSgnLi4vYXBwL29yaWVudGF0aW9uL29yaWVudGF0aW9uJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fWVsc2UgaWYgKHR5cGUgPT09ICdtaWMnKXtcblx0XHRcdFx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRcdFx0XHRjb250cm9sbGVyQXMgOiAndm9pY2VDdHJsJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi4vLi4vY29tcG9uZW50cy92b2ljZS5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4uL2FwcC92b2ljZS92b2ljZScpLFxuXHRcdFx0XHRcdFx0cGFyZW50IDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluQ29udGFpbmVyJykpLFxuXHRcdFx0XHRcdFx0dGFyZ2V0RXZlbnQgOiBldmVudCxcblx0XHRcdFx0XHRcdGZ1bGxTY3JlZW4gOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1dKTtcblxudmFyIGJsZSA9IHJlcXVpcmUoJy4vYmx1ZXRvb3RoL2JsdWV0b290aCcpO1xuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkKCl7XHRcblx0Ly9yZXF1aXJlKCcuL3NvY2tldC9zb2NrZXRzJyk7XG59XG5cblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTsiLCIndXNlIHN0cmljdCdcblxuY29uc3Qgc2VydmljZVVVSUQgPSAnMTExMTExMTEtMjIyMi0zMzMzLTQ0NDQtMDAwMDAwMDAwMDAwJyxcblx0Y2hhcmFjdGVyaXN0aWNXcml0ZVVVSUQgPSAnMTExMTExMTEtMjIyMi0zMzMzLTQ0NDQtMDAwMDAwMDAwMDEwJztcblxuZnVuY3Rpb24gYWIyc3RyKGJ1Zikge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDE2QXJyYXkoYnVmKSk7XG59XG5cbmZ1bmN0aW9uIHN0cjJhYihzdHIpIHtcbiAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihzdHIubGVuZ3RoKjIpOyAvLyAyIGJ5dGVzIGZvciBlYWNoIGNoYXJcbiAgdmFyIGJ1ZlZpZXcgPSBuZXcgVWludDE2QXJyYXkoYnVmKTtcbiAgZm9yICh2YXIgaT0wLCBzdHJMZW49c3RyLmxlbmd0aDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgYnVmVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBidWY7XG59XG5cbnZhciBzZXJ2ZXJHQVRUID0gbnVsbCxcblx0c2VydmljZUdBVFQgPSBudWxsLFxuXHRjaGFyYWN0ZXJpc3RpY0dBVFQgPSBudWxsO1xuXG5mdW5jdGlvbiBpbml0QmxlKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZSh7IFxuXHRcdFx0ZmlsdGVyczogW3sgbmFtZTogJ1JwaUplZkxlZERldmljZScgfSwgeyBuYW1lOiAnSmVmTGVkRGV2aWNlJyB9XVxuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oZGV2aWNlKSB7XG5cdFx0ICAgY29uc29sZS5sb2coXCJDb25uZWN0aW5nLi4uXCIpO1xuXHRcdCAgIHJldHVybiBkZXZpY2UuY29ubmVjdEdBVFQoKTtcblx0XHQgfSlcblx0XHQudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblx0XHRcdHNlcnZlckdBVFQgPSBzZXJ2ZXI7XG5cdFx0XHQvL3JldHVybiBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2Uoc2VydmljZVVVSUQpO1xuXHRcdCAgIC8vIEZJWE1FOiBSZW1vdmUgdGhpcyB0aW1lb3V0IHdoZW4gR2F0dFNlcnZpY2VzIHByb3BlcnR5IHdvcmtzIGFzIGludGVuZGVkLlxuXHRcdCAgIC8vIGNyYnVnLmNvbS81NjAyNzdcblx0XHQgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZVNlcnZpY2UsIHJlamVjdFNlcnZpY2UpIHtcblx0XHQgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0ICAgICBcdHRyeXtcblx0XHQgICAgIFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byBnZXQgU2VydmljZVwiKTtcblx0XHQgICAgICAgXHRcdHJlc29sdmVTZXJ2aWNlKHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShzZXJ2aWNlVVVJRCkpO1xuXHRcdCAgICAgXHR9Y2F0Y2goZXJyKXtcblx0XHQgICAgIFx0XHRyZWplY3RTZXJ2aWNlKGVycik7XG5cdFx0ICAgICBcdH1cblx0XHQgICAgIH0sIDJlMyk7XG5cdFx0ICAgfSlcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0c2VydmljZUdBVFQgPSBzZXJ2aWNlO1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlKTtcdFx0XHRcblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0fSk7XG5cdH0pXG59XG5cblxuZnVuY3Rpb24gZ2V0U2VydmljZSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRpZiAoc2VydmVyR0FUVCAmJiBzZXJ2ZXJHQVRULmNvbm5lY3RlZCAmJiBzZXJ2aWNlR0FUVCl7XG5cdFx0XHRyZXNvbHZlKHNlcnZpY2VHQVRUKTtcblx0XHR9ZWxzZXtcblx0XHRcdGluaXRCbGUoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRcdHJlc29sdmUoc2VydmljZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldENoYXJhY3RlcmlzdGljKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdGlmIChjaGFyYWN0ZXJpc3RpY0dBVFQpe1xuXHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpc3RpY0dBVFQpO1xuXHRcdH1lbHNle1xuXHRcdFx0Z2V0U2VydmljZSgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IENoYXJhY3Rlcml0aWMgOiAlT1wiLHNlcnZpY2UpO1xuXHRcdFx0XHRyZXR1cm4gc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY1dyaXRlVVVJRCk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXRpYyl7XG5cdFx0XHRcdGNoYXJhY3RlcmlzdGljR0FUVCA9IGNoYXJhY3Rlcml0aWM7XG5cdFx0XHRcdHJlc29sdmUoY2hhcmFjdGVyaXRpYyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWModHlwZSwgZGF0YSwgY2FsbGJhY2spe1xuXHRnZXRDaGFyYWN0ZXJpc3RpYygpXG5cdC50aGVuKGZ1bmN0aW9uKGNoYXJhY3RlcmlzdGljKXtcblx0XHRpZiAodHlwZSA9PT0gJ3dyaXRlJyl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byB3cml0ZSB2YWx1ZSA6ICVPXCIsY2hhcmFjdGVyaXN0aWMpO1xuXHRcdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoc3RyMmFiKGRhdGEpKTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHJlYWQgdmFsdWUgOiAlT1wiLGNoYXJhY3RlcmlzdGljKTtcblx0XHRcdHJldHVybiBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24oYnVmZmVyKXtcblx0XHRpZiAodHlwZSA9PT0gJ3dyaXRlJyl7XG5cdFx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRcdGNhbGxiYWNrKHt0eXBlOiAnd3JpdGUnLCB2YWx1ZSA6IHRydWV9KTtcdFx0XHRcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUuaW5mbyhcIldyaXRlIGRhdGFzICEgXCIpO1xuXHRcdH1lbHNle1xuXHRcdFx0bGV0IGRhdGEgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcblx0XHQgICAgbGV0IGRhdGFEZWNyeXB0ID0gZGF0YS5nZXRVaW50OCgwKTtcblx0XHQgICAgY2FsbGJhY2soe3R5cGU6ICdyZWFkJyAsIHZhbHVlIDogZGF0YURlY3J5cHR9KTtcblx0XHQgICAgY29uc29sZS5sb2coJ1JlY2VpdmVEYXRhcyAlcycsIGRhdGFEZWNyeXB0KTtcblx0XHR9XG5cdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRpZiAoY2FsbGJhY2spIHtcblxuXHRcdFx0Y2FsbGJhY2soe3R5cGUgOiAnZXJyb3InLCB2YWx1ZSA6IGVycm9yfSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuXG5cbmZ1bmN0aW9uIEJsZUNvbnRyb2xsZXIoJG1kRGlhbG9nLCAkdGltZW91dCl7XG5cblx0dGhpcy5zbGlkZXJBY3RpdiA9IGZhbHNlO1xuXHR0aGlzLmN1cnJlbnRUaW1lciA9IG51bGw7XG5cdHRoaXMucG93ZXIgPSAxMjU7XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fSBcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwib25cIik7XG5cdH1cblxuXHR0aGlzLmJsaW5rID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJibGlua1wiKTtcblx0fVxuXG5cdHRoaXMudHVybk9mZiA9IGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwib2ZmXCIpO1xuXHR9XG5cdFxuXHQvKnRoaXMuJHdhdGNoKCdwb3dlcicsIGZ1bmN0aW9uKG5ld1Bvd2VyLCBvbGRQb3dlcil7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKCd3cml0ZScsIFwiYnJpZ2h0OlwiK25ld1Bvd2VyKTtcblx0fSk7Ki9cblxuXHR0aGlzLmFjdGl2U2xpZGVyID0gZnVuY3Rpb24oKXtcblx0XHRpZiAodGhpcy5jdXJyZW50VGltZXIpe1xuXHRcdFx0dGhpcy5jdXJyZW50VGltZXIuY2FuY2VsKCk7XG5cdFx0fVxuXHRcdHRoaXMuc2xpZGVyQWN0aXYgPSB0cnVlO1xuXHRcdHRoaXMuY3VycmVudFRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24oY29udGV4dCl7XG5cdFx0XHRjb250ZXh0LnNsaWRlckFjdGl2ID0gZmFsc2U7XG5cdFx0fSw1MDAwLHRydWUsIHRoaXMpO1xuXHR9XG59XG5cbkJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJG1kRGlhbG9nJywgJyR0aW1lb3V0J11cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZUNvbnRyb2xsZXI7Lyp7XG5cdHdyaXRlRGF0YSA6IHByb2Nlc3NDaGFyYWN0ZXJpc3RpY1xufSovXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuIFx0Ly8gVGhlIGhhbmRsZXJcblx0dmFyIGRldmljZUxpZ2h0SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0Ly8gVGhlIHZhbHVlIHdpbGwgbGl2ZSBiZXR3ZWVuIDAgYW5kIH4xNTBcblx0XHQvLyBCdXQgd2hlbiBpdCBpcyA0NSBpcyBhIGhpZ2ggbHVtb25zaXR5XG5cdFx0dmFyIHZhbHVlID0gTWF0aC5taW4oNDUsIGV2ZW50LnZhbHVlKTsgICAgICAgIFxuXHRcdHBlcmNlbnQgPSBNYXRoLnJvdW5kKCh2YWx1ZSAvIDQ1KSAqIDEwMCk7ICAgICAgIFxuXHRcdC8vc29ja2V0LnNlbmRMaWdodChwZXJjZW50KTtcblx0XHQvL3VwZGF0ZUxpZ2h0KCk7IFxuXHR9XG5cblx0Ly8gV2UgYWRkIHRoZSBsaXN0ZW5lclxuXHRmdW5jdGlvbiByZWdpc3Rlcigpe1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbGlnaHQnLCBkZXZpY2VMaWdodEhhbmRsZXIsIGZhbHNlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVucmVnaXN0ZXIoKXtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZWxpZ2h0JywgZGV2aWNlTGlnaHRIYW5kbGVyLCBmYWxzZSk7XG5cdH1cblxuZnVuY3Rpb24gTGlnaHRDb250cm9sZXIoJG1kRGlhbG9nKXtcblxuXHR0aGlzLnR1cm5PbiA9IGZ1bmN0aW9uKCl7XG5cdFx0cmVnaXN0ZXIoKTtcblx0fVxuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHRcdHVucmVnaXN0ZXIoKTtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodENvbnRyb2xlcjsiLCIndXNlIHN0cmljdCc7XG5cbiBcdC8vIFRoZSBoYW5kbGVyIG9mIHRoZSBldmVudFxuXHR2YXIgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KXsgICAgICAgIFxuXHRcdHZhciBhbHBoYSA9IE1hdGgucm91bmQoZXZlbnQuYWxwaGEpO1xuXHRcdHZhciBiZXRhID0gTWF0aC5yb3VuZChldmVudC5iZXRhKTtcblx0XHR2YXIgZ2FtbWEgPSBNYXRoLnJvdW5kKGV2ZW50LmdhbW1hKTtcblx0XHQvL3VwZGF0ZVJvdGF0aW9uKGFscGhhKTtcblx0XHQvL3NvY2tldC5zZW5kT3JpZW50YXRpb24oYWxwaGEpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVnaXN0ZXIoKXtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCBkZXZpY2VPcmllbnRhdGlvbkxpc3RlbmVyLCBmYWxzZSk7XG5cdH1cblxuXHRmdW5jdGlvbiB1bnJlZ2lzdGVyKCl7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgZGV2aWNlT3JpZW50YXRpb25MaXN0ZW5lciwgZmFsc2UpO1xuXHR9XG5cbmZ1bmN0aW9uIE9yaWVudGF0aW9uQ29udHJvbGVyKCRtZERpYWxvZyl7XG5cblx0dGhpcy50dXJuT24gPSBmdW5jdGlvbigpe1xuXHRcdHJlZ2lzdGVyKCk7XG5cdH1cblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHR1bnJlZ2lzdGVyKCk7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gT3JpZW50YXRpb25Db250cm9sZXI7IiwiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKCl7XG5cbn1cblxuZnVuY3Rpb24gdW5yZWdpc3Rlcigpe1xuXHRcbn1cblxuXG5mdW5jdGlvbiBWb2ljZUNvbnRyb2xlcigkbWREaWFsb2cpe1xuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRyZWdpc3RlcigpO1xuXHR9XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dW5yZWdpc3RlcigpO1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZvaWNlQ29udHJvbGVyOyJdfQ==
