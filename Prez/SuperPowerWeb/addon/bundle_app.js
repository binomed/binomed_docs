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
				{label : "Bluetooth", icon : 'fa-bluetooth', idAction: 'ble'}
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
				}
			}
		}
	}
}]);

var ble = require('./bluetooth/bluetooth');


function pageLoad(){
	document.getElementById('clickMe').addEventListener('click', function(){
		//completeWriteOperation();

		//processCharacteristic(true);
	});

	document.getElementById('clickMeInfo').addEventListener('click', function(){
		//processCharacteristic(false);
	});
	
	//require('./socket/sockets');
}



window.addEventListener('load', pageLoad);
},{"../app/bluetooth/bluetooth":2,"./bluetooth/bluetooth":2}],2:[function(require,module,exports){
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


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FwcC9hcHAuanMiLCJzY3JpcHRzL2FwcC9ibHVldG9vdGgvYmx1ZXRvb3RoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuYW5ndWxhci5tb2R1bGUoXCJTdXBlclBvd2VyQXBwXCIsIFsnbmdNYXRlcmlhbCddKVxuLmNvbmZpZyhmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAucHJpbWFyeVBhbGV0dGUoJ3JlZCcpXG4gICAgLmFjY2VudFBhbGV0dGUoJ29yYW5nZScpO1xufSlcbi5kaXJlY3RpdmUoJ2FwcCcsIFsnJG1kRGlhbG9nJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJG1kRGlhbG9nLCAkdGltZW91dCl7XG5cdHJldHVybiB7XG5cdFx0dGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2FwcC5odG1sJyxcblx0XHRjb250cm9sbGVyQXMgOiAnYXBwJyxcblx0XHRiaW5kVG9Db250cm9sbGVyIDogdHJ1ZSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5hY3Rpb25zID0gW1xuXHRcdFx0XHR7bGFiZWwgOiBcIkJsdWV0b290aFwiLCBpY29uIDogJ2ZhLWJsdWV0b290aCcsIGlkQWN0aW9uOiAnYmxlJ31cblx0XHRcdF07XG5cblx0XHRcdHRoaXMub3BlbkRpYWxvZyA9IGZ1bmN0aW9uKGV2ZW50LCB0eXBlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ09wZW4gRGlhbG9nJyk7XG5cdFx0XHRcdGlmICh0eXBlID09PSAnYmxlJyl7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0Y29udHJvbGxlckFzIDogJ2JsZUN0cmwnLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICcuLi8uLi9jb21wb25lbnRzL2JsdWV0b290aC5odG1sJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4uL2FwcC9ibHVldG9vdGgvYmx1ZXRvb3RoJyksXG5cdFx0XHRcdFx0XHRwYXJlbnQgOiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW5Db250YWluZXInKSksXG5cdFx0XHRcdFx0XHR0YXJnZXRFdmVudCA6IGV2ZW50LFxuXHRcdFx0XHRcdFx0ZnVsbFNjcmVlbiA6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufV0pO1xuXG52YXIgYmxlID0gcmVxdWlyZSgnLi9ibHVldG9vdGgvYmx1ZXRvb3RoJyk7XG5cblxuZnVuY3Rpb24gcGFnZUxvYWQoKXtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsaWNrTWUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb21wbGV0ZVdyaXRlT3BlcmF0aW9uKCk7XG5cblx0XHQvL3Byb2Nlc3NDaGFyYWN0ZXJpc3RpYyh0cnVlKTtcblx0fSk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsaWNrTWVJbmZvJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdC8vcHJvY2Vzc0NoYXJhY3RlcmlzdGljKGZhbHNlKTtcblx0fSk7XG5cdFxuXHQvL3JlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKTtcbn1cblxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpOyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBzZXJ2aWNlVVVJRCA9ICcxMTExMTExMS0yMjIyLTMzMzMtNDQ0NC0wMDAwMDAwMDAwMDAnLFxuXHRjaGFyYWN0ZXJpc3RpY1dyaXRlVVVJRCA9ICcxMTExMTExMS0yMjIyLTMzMzMtNDQ0NC0wMDAwMDAwMDAwMTAnO1xuXG5mdW5jdGlvbiBhYjJzdHIoYnVmKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50MTZBcnJheShidWYpKTtcbn1cblxuZnVuY3Rpb24gc3RyMmFiKHN0cikge1xuICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgZm9yIGVhY2ggY2hhclxuICB2YXIgYnVmVmlldyA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuICBmb3IgKHZhciBpPTAsIHN0ckxlbj1zdHIubGVuZ3RoOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICBidWZWaWV3W2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxudmFyIHNlcnZlckdBVFQgPSBudWxsLFxuXHRzZXJ2aWNlR0FUVCA9IG51bGwsXG5cdGNoYXJhY3RlcmlzdGljR0FUVCA9IG51bGw7XG5cbmZ1bmN0aW9uIGluaXRCbGUoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0bmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHsgXG5cdFx0XHRmaWx0ZXJzOiBbeyBuYW1lOiAnUnBpSmVmTGVkRGV2aWNlJyB9LCB7IG5hbWU6ICdKZWZMZWREZXZpY2UnIH1dXG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihkZXZpY2UpIHtcblx0XHQgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RpbmcuLi5cIik7XG5cdFx0ICAgcmV0dXJuIGRldmljZS5jb25uZWN0R0FUVCgpO1xuXHRcdCB9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXHRcdFx0c2VydmVyR0FUVCA9IHNlcnZlcjtcblx0XHRcdC8vcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShzZXJ2aWNlVVVJRCk7XG5cdFx0ICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIHRpbWVvdXQgd2hlbiBHYXR0U2VydmljZXMgcHJvcGVydHkgd29ya3MgYXMgaW50ZW5kZWQuXG5cdFx0ICAgLy8gY3JidWcuY29tLzU2MDI3N1xuXHRcdCAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlU2VydmljZSwgcmVqZWN0U2VydmljZSkge1xuXHRcdCAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHQgICAgIFx0dHJ5e1xuXHRcdCAgICAgXHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIGdldCBTZXJ2aWNlXCIpO1xuXHRcdCAgICAgICBcdFx0cmVzb2x2ZVNlcnZpY2Uoc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHNlcnZpY2VVVUlEKSk7XG5cdFx0ICAgICBcdH1jYXRjaChlcnIpe1xuXHRcdCAgICAgXHRcdHJlamVjdFNlcnZpY2UoZXJyKTtcblx0XHQgICAgIFx0fVxuXHRcdCAgICAgfSwgMmUzKTtcblx0XHQgICB9KVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRzZXJ2aWNlR0FUVCA9IHNlcnZpY2U7XG5cdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1x0XHRcdFxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHR9KTtcblx0fSlcbn1cblxuXG5mdW5jdGlvbiBnZXRTZXJ2aWNlKCl7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdGlmIChzZXJ2ZXJHQVRUICYmIHNlcnZlckdBVFQuY29ubmVjdGVkICYmIHNlcnZpY2VHQVRUKXtcblx0XHRcdHJlc29sdmUoc2VydmljZUdBVFQpO1xuXHRcdH1lbHNle1xuXHRcdFx0aW5pdEJsZSgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdFx0cmVzb2x2ZShzZXJ2aWNlKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hhcmFjdGVyaXN0aWMoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKGNoYXJhY3RlcmlzdGljR0FUVCl7XG5cdFx0XHRyZXNvbHZlKGNoYXJhY3RlcmlzdGljR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRnZXRTZXJ2aWNlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byBnZXQgQ2hhcmFjdGVyaXRpYyA6ICVPXCIsc2VydmljZSk7XG5cdFx0XHRcdHJldHVybiBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljV3JpdGVVVUlEKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihmdW5jdGlvbihjaGFyYWN0ZXJpdGljKXtcblx0XHRcdFx0Y2hhcmFjdGVyaXN0aWNHQVRUID0gY2hhcmFjdGVyaXRpYztcblx0XHRcdFx0cmVzb2x2ZShjaGFyYWN0ZXJpdGljKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDaGFyYWN0ZXJpc3RpYyh0eXBlLCBkYXRhLCBjYWxsYmFjayl7XG5cdGdldENoYXJhY3RlcmlzdGljKClcblx0LnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXN0aWMpe1xuXHRcdGlmICh0eXBlID09PSAnd3JpdGUnKXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHdyaXRlIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShzdHIyYWIoZGF0YSkpO1xuXHRcdH1lbHNle1xuXHRcdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gcmVhZCB2YWx1ZSA6ICVPXCIsY2hhcmFjdGVyaXN0aWMpO1xuXHRcdFx0cmV0dXJuIGNoYXJhY3RlcmlzdGljLnJlYWRWYWx1ZSgpO1xuXHRcdH1cblx0fSkudGhlbihmdW5jdGlvbihidWZmZXIpe1xuXHRcdGlmICh0eXBlID09PSAnd3JpdGUnKXtcblx0XHRcdGlmKGNhbGxiYWNrKXtcblx0XHRcdFx0Y2FsbGJhY2soe3R5cGU6ICd3cml0ZScsIHZhbHVlIDogdHJ1ZX0pO1x0XHRcdFxuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5pbmZvKFwiV3JpdGUgZGF0YXMgISBcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgZGF0YSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXHRcdCAgICBsZXQgZGF0YURlY3J5cHQgPSBkYXRhLmdldFVpbnQ4KDApO1xuXHRcdCAgICBjYWxsYmFjayh7dHlwZTogJ3JlYWQnICwgdmFsdWUgOiBkYXRhRGVjcnlwdH0pO1xuXHRcdCAgICBjb25zb2xlLmxvZygnUmVjZWl2ZURhdGFzICVzJywgZGF0YURlY3J5cHQpO1xuXHRcdH1cblx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdGlmIChjYWxsYmFjaykge1xuXG5cdFx0XHRjYWxsYmFjayh7dHlwZSA6ICdlcnJvcicsIHZhbHVlIDogZXJyb3J9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5cblxuZnVuY3Rpb24gQmxlQ29udHJvbGxlcigkbWREaWFsb2csICR0aW1lb3V0KXtcblxuXHR0aGlzLnNsaWRlckFjdGl2ID0gZmFsc2U7XG5cdHRoaXMuY3VycmVudFRpbWVyID0gbnVsbDtcblx0dGhpcy5wb3dlciA9IDEyNTtcblxuXHR0aGlzLmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9IFxuXG5cdHRoaXMudHVybk9uID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJvblwiKTtcblx0fVxuXG5cdHRoaXMuYmxpbmsgPSBmdW5jdGlvbigpe1xuXHRcdHByb2Nlc3NDaGFyYWN0ZXJpc3RpYygnd3JpdGUnLCBcImJsaW5rXCIpO1xuXHR9XG5cblx0dGhpcy50dXJuT2ZmID0gZnVuY3Rpb24oKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJvZmZcIik7XG5cdH1cblx0XG5cdC8qdGhpcy4kd2F0Y2goJ3Bvd2VyJywgZnVuY3Rpb24obmV3UG93ZXIsIG9sZFBvd2VyKXtcblx0XHRwcm9jZXNzQ2hhcmFjdGVyaXN0aWMoJ3dyaXRlJywgXCJicmlnaHQ6XCIrbmV3UG93ZXIpO1xuXHR9KTsqL1xuXG5cdHRoaXMuYWN0aXZTbGlkZXIgPSBmdW5jdGlvbigpe1xuXHRcdGlmICh0aGlzLmN1cnJlbnRUaW1lcil7XG5cdFx0XHR0aGlzLmN1cnJlbnRUaW1lci5jYW5jZWwoKTtcblx0XHR9XG5cdFx0dGhpcy5zbGlkZXJBY3RpdiA9IHRydWU7XG5cdFx0dGhpcy5jdXJyZW50VGltZXIgPSAkdGltZW91dChmdW5jdGlvbihjb250ZXh0KXtcblx0XHRcdGNvbnRleHQuc2xpZGVyQWN0aXYgPSBmYWxzZTtcblx0XHR9LDUwMDAsdHJ1ZSwgdGhpcyk7XG5cdH1cbn1cblxuQmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckbWREaWFsb2cnLCAnJHRpbWVvdXQnXVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQmxlQ29udHJvbGxlcjsvKntcblx0d3JpdGVEYXRhIDogcHJvY2Vzc0NoYXJhY3RlcmlzdGljXG59Ki9cblxuIl19
