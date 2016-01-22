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