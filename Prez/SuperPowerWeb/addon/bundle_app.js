(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	serviceGATT = null;

function initBle(){
	return new Promise(function(resolve, reject){
		navigator.bluetooth.requestDevice({ 
			filters: [{ name: 'MyDevice' }]
		})
		.then(function(device) {
		   document.querySelector('#output').textContent = 'connecting...';
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

function pageLoad(){
	document.getElementById('clickMe').addEventListener('click', function(){
		//completeWriteOperation();
		processCharacteristic(true);
	});

	document.getElementById('clickMeInfo').addEventListener('click', function(){
		processCharacteristic(false);
	});

	document.getElementById('nfcRead').addEventListener('click', function(){
		processNfc();
	});
	
	//require('./socket/sockets');
}

function completeWriteOperation(){
	navigator.bluetooth.requestDevice({ 
		filters: [{ name: 'MyDevice' }]
	})
	.then(function(device) {
	   document.querySelector('#output').textContent = 'connecting...';
	   return device.connectGATT();
	 })
	.then(function(server) {
		// FIXME: Remove this timeout when GattServices property works as intended.
	   // crbug.com/560277
	   return new Promise(function(resolveService, rejectService) {
	     setTimeout(function() {
	     	try{
	       		resolveService(server.getPrimaryService(serviceUUID));
	     	}catch(err){
	     		rejectService(err);
	     	}
	     }, 2e3);
	   })
	}).then(function(service){
		console.log("Try to get Characteritic : %O",service);
		return service.getCharacteristic(characteristicWriteUUID);	
	}).then(function(characteristic){
		if (true){			
			console.log("Try to write value : %O",characteristic);
			return characteristic.writeValue(str2ab("test"));
		}else{
			return characteristic.readValue();
		}
	}).then(function(buffer){
		if (true){
			document.querySelector('#output').textContent = 'Write Datas ! ';
			console.info("Write datas ! ");
		}else{
			let data = new DataView(buffer);
		    let dataDecrypt = data.getUint8(0);
		    document.querySelector('#output').textContent = `Receive Datas ${dataDecrypt}`;
		    console.log('ReceiveDatas %s', dataDecrypt);
		}
	}).catch(function(error){
		console.error(error);
		reject(error);
	});
}

function getService(){
	return new Promise(function(resolve, reject){
		if (serverGATT && serverGATT.connected){
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

function processCharacteristic(write){
	getService()
	.then(function(service){
		console.log("Try to get Characteritic : %O",service);
		return service.getCharacteristic(characteristicWriteUUID);
	}).then(function(characteristic){
		if (write){			
			console.log("Try to write value : %O",characteristic);
			return characteristic.writeValue(str2ab("test"));
		}else{
			return characteristic.readValue();
		}
	}).then(function(buffer){
		if (write){
			document.querySelector('#output').textContent = 'Write Datas ! ';
			console.info("Write datas ! ");
		}else{
			let data = new DataView(buffer);
		    let dataDecrypt = data.getUint8(0);
		    document.querySelector('#output').textContent = `Receive Datas ${dataDecrypt}`;
		    console.log('ReceiveDatas %s', dataDecrypt);
		}
	}).catch(function(error){
		console.error(error);
		document.querySelector('#output').textContent = `Error :  ${error}`;
	});
}

function processMessage(message) {
  for (let record of message.data) {
    switch (record.recordType) {
      case "text":
        console.log('Data is text: ' + record.data);
        break;
      case "url":
        console.log('Data is URL: ' + record.data);
        break;
      case "json":
        console.log('JSON data: ' + record.data.myProperty.toString());
        break;
      case "opaque":
        if (record.mediaType == 'image/png') {
          var img = document.createElement("img");
          img.src = URL.createObjectURL(new Blob(record.data, record.mediaType));
          img.onload = function() {
            window.URL.revokeObjectURL(this.src);
          };
        }
        break;
    }
  }
}

function processNfc(){
	navigator.nfc.watch((message) => {
		if (message.data[0].recordType == 'empty') {
			navigator.nfc.push({
			  url: "/custom/path",
			  data: [{ recordType: "text", data: 'Hello World' }]
			});
		} else {
			console.log('Read message written by ' + message.url);
			processMessage(message);
		}
	}).then(() => {
		console.log("Added a watch.");
	}).catch((error) => {
		console.log("Adding watch failed: " + error.name);
	});

}

window.addEventListener('load', pageLoad);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBzZXJ2aWNlVVVJRCA9ICcxMTExMTExMS0yMjIyLTMzMzMtNDQ0NC0wMDAwMDAwMDAwMDAnLFxuXHRjaGFyYWN0ZXJpc3RpY1dyaXRlVVVJRCA9ICcxMTExMTExMS0yMjIyLTMzMzMtNDQ0NC0wMDAwMDAwMDAwMTAnO1xuXG5mdW5jdGlvbiBhYjJzdHIoYnVmKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50MTZBcnJheShidWYpKTtcbn1cblxuZnVuY3Rpb24gc3RyMmFiKHN0cikge1xuICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgZm9yIGVhY2ggY2hhclxuICB2YXIgYnVmVmlldyA9IG5ldyBVaW50MTZBcnJheShidWYpO1xuICBmb3IgKHZhciBpPTAsIHN0ckxlbj1zdHIubGVuZ3RoOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICBidWZWaWV3W2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxudmFyIHNlcnZlckdBVFQgPSBudWxsLFxuXHRzZXJ2aWNlR0FUVCA9IG51bGw7XG5cbmZ1bmN0aW9uIGluaXRCbGUoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0bmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHsgXG5cdFx0XHRmaWx0ZXJzOiBbeyBuYW1lOiAnTXlEZXZpY2UnIH1dXG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihkZXZpY2UpIHtcblx0XHQgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3V0cHV0JykudGV4dENvbnRlbnQgPSAnY29ubmVjdGluZy4uLic7XG5cdFx0ICAgcmV0dXJuIGRldmljZS5jb25uZWN0R0FUVCgpO1xuXHRcdCB9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXHRcdFx0c2VydmVyR0FUVCA9IHNlcnZlcjtcblx0XHRcdC8vcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShzZXJ2aWNlVVVJRCk7XG5cdFx0ICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIHRpbWVvdXQgd2hlbiBHYXR0U2VydmljZXMgcHJvcGVydHkgd29ya3MgYXMgaW50ZW5kZWQuXG5cdFx0ICAgLy8gY3JidWcuY29tLzU2MDI3N1xuXHRcdCAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlU2VydmljZSwgcmVqZWN0U2VydmljZSkge1xuXHRcdCAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHQgICAgIFx0dHJ5e1xuXHRcdCAgICAgICBcdFx0cmVzb2x2ZVNlcnZpY2Uoc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHNlcnZpY2VVVUlEKSk7XG5cdFx0ICAgICBcdH1jYXRjaChlcnIpe1xuXHRcdCAgICAgXHRcdHJlamVjdFNlcnZpY2UoZXJyKTtcblx0XHQgICAgIFx0fVxuXHRcdCAgICAgfSwgMmUzKTtcblx0XHQgICB9KVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0XHRzZXJ2aWNlR0FUVCA9IHNlcnZpY2U7XG5cdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1x0XHRcdFxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHR9KTtcblx0fSlcbn1cblxuZnVuY3Rpb24gcGFnZUxvYWQoKXtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsaWNrTWUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb21wbGV0ZVdyaXRlT3BlcmF0aW9uKCk7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKHRydWUpO1xuXHR9KTtcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xpY2tNZUluZm8nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc0NoYXJhY3RlcmlzdGljKGZhbHNlKTtcblx0fSk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25mY1JlYWQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0cHJvY2Vzc05mYygpO1xuXHR9KTtcblx0XG5cdC8vcmVxdWlyZSgnLi9zb2NrZXQvc29ja2V0cycpO1xufVxuXG5mdW5jdGlvbiBjb21wbGV0ZVdyaXRlT3BlcmF0aW9uKCl7XG5cdG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZSh7IFxuXHRcdGZpbHRlcnM6IFt7IG5hbWU6ICdNeURldmljZScgfV1cblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZGV2aWNlKSB7XG5cdCAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQnKS50ZXh0Q29udGVudCA9ICdjb25uZWN0aW5nLi4uJztcblx0ICAgcmV0dXJuIGRldmljZS5jb25uZWN0R0FUVCgpO1xuXHQgfSlcblx0LnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cdFx0Ly8gRklYTUU6IFJlbW92ZSB0aGlzIHRpbWVvdXQgd2hlbiBHYXR0U2VydmljZXMgcHJvcGVydHkgd29ya3MgYXMgaW50ZW5kZWQuXG5cdCAgIC8vIGNyYnVnLmNvbS81NjAyNzdcblx0ICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmVTZXJ2aWNlLCByZWplY3RTZXJ2aWNlKSB7XG5cdCAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0ICAgICBcdHRyeXtcblx0ICAgICAgIFx0XHRyZXNvbHZlU2VydmljZShzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2Uoc2VydmljZVVVSUQpKTtcblx0ICAgICBcdH1jYXRjaChlcnIpe1xuXHQgICAgIFx0XHRyZWplY3RTZXJ2aWNlKGVycik7XG5cdCAgICAgXHR9XG5cdCAgICAgfSwgMmUzKTtcblx0ICAgfSlcblx0fSkudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRjb25zb2xlLmxvZyhcIlRyeSB0byBnZXQgQ2hhcmFjdGVyaXRpYyA6ICVPXCIsc2VydmljZSk7XG5cdFx0cmV0dXJuIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWNXcml0ZVVVSUQpO1x0XG5cdH0pLnRoZW4oZnVuY3Rpb24oY2hhcmFjdGVyaXN0aWMpe1xuXHRcdGlmICh0cnVlKXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHdyaXRlIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShzdHIyYWIoXCJ0ZXN0XCIpKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24oYnVmZmVyKXtcblx0XHRpZiAodHJ1ZSl7XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3V0cHV0JykudGV4dENvbnRlbnQgPSAnV3JpdGUgRGF0YXMgISAnO1xuXHRcdFx0Y29uc29sZS5pbmZvKFwiV3JpdGUgZGF0YXMgISBcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgZGF0YSA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXHRcdCAgICBsZXQgZGF0YURlY3J5cHQgPSBkYXRhLmdldFVpbnQ4KDApO1xuXHRcdCAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3V0cHV0JykudGV4dENvbnRlbnQgPSBgUmVjZWl2ZSBEYXRhcyAke2RhdGFEZWNyeXB0fWA7XG5cdFx0ICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlRGF0YXMgJXMnLCBkYXRhRGVjcnlwdCk7XG5cdFx0fVxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0cmVqZWN0KGVycm9yKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldFNlcnZpY2UoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0aWYgKHNlcnZlckdBVFQgJiYgc2VydmVyR0FUVC5jb25uZWN0ZWQpe1xuXHRcdFx0cmVzb2x2ZShzZXJ2aWNlR0FUVCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpbml0QmxlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHNlcnZpY2Upe1xuXHRcdFx0XHRyZXNvbHZlKHNlcnZpY2UpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzQ2hhcmFjdGVyaXN0aWMod3JpdGUpe1xuXHRnZXRTZXJ2aWNlKClcblx0LnRoZW4oZnVuY3Rpb24oc2VydmljZSl7XG5cdFx0Y29uc29sZS5sb2coXCJUcnkgdG8gZ2V0IENoYXJhY3Rlcml0aWMgOiAlT1wiLHNlcnZpY2UpO1xuXHRcdHJldHVybiBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljV3JpdGVVVUlEKTtcblx0fSkudGhlbihmdW5jdGlvbihjaGFyYWN0ZXJpc3RpYyl7XG5cdFx0aWYgKHdyaXRlKXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKFwiVHJ5IHRvIHdyaXRlIHZhbHVlIDogJU9cIixjaGFyYWN0ZXJpc3RpYyk7XG5cdFx0XHRyZXR1cm4gY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShzdHIyYWIoXCJ0ZXN0XCIpKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24oYnVmZmVyKXtcblx0XHRpZiAod3JpdGUpe1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI291dHB1dCcpLnRleHRDb250ZW50ID0gJ1dyaXRlIERhdGFzICEgJztcblx0XHRcdGNvbnNvbGUuaW5mbyhcIldyaXRlIGRhdGFzICEgXCIpO1xuXHRcdH1lbHNle1xuXHRcdFx0bGV0IGRhdGEgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcblx0XHQgICAgbGV0IGRhdGFEZWNyeXB0ID0gZGF0YS5nZXRVaW50OCgwKTtcblx0XHQgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI291dHB1dCcpLnRleHRDb250ZW50ID0gYFJlY2VpdmUgRGF0YXMgJHtkYXRhRGVjcnlwdH1gO1xuXHRcdCAgICBjb25zb2xlLmxvZygnUmVjZWl2ZURhdGFzICVzJywgZGF0YURlY3J5cHQpO1xuXHRcdH1cblx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQnKS50ZXh0Q29udGVudCA9IGBFcnJvciA6ICAke2Vycm9yfWA7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzTWVzc2FnZShtZXNzYWdlKSB7XG4gIGZvciAobGV0IHJlY29yZCBvZiBtZXNzYWdlLmRhdGEpIHtcbiAgICBzd2l0Y2ggKHJlY29yZC5yZWNvcmRUeXBlKSB7XG4gICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICBjb25zb2xlLmxvZygnRGF0YSBpcyB0ZXh0OiAnICsgcmVjb3JkLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1cmxcIjpcbiAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgaXMgVVJMOiAnICsgcmVjb3JkLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJqc29uXCI6XG4gICAgICAgIGNvbnNvbGUubG9nKCdKU09OIGRhdGE6ICcgKyByZWNvcmQuZGF0YS5teVByb3BlcnR5LnRvU3RyaW5nKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJvcGFxdWVcIjpcbiAgICAgICAgaWYgKHJlY29yZC5tZWRpYVR5cGUgPT0gJ2ltYWdlL3BuZycpIHtcbiAgICAgICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICBpbWcuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihyZWNvcmQuZGF0YSwgcmVjb3JkLm1lZGlhVHlwZSkpO1xuICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHRoaXMuc3JjKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzTmZjKCl7XG5cdG5hdmlnYXRvci5uZmMud2F0Y2goKG1lc3NhZ2UpID0+IHtcblx0XHRpZiAobWVzc2FnZS5kYXRhWzBdLnJlY29yZFR5cGUgPT0gJ2VtcHR5Jykge1xuXHRcdFx0bmF2aWdhdG9yLm5mYy5wdXNoKHtcblx0XHRcdCAgdXJsOiBcIi9jdXN0b20vcGF0aFwiLFxuXHRcdFx0ICBkYXRhOiBbeyByZWNvcmRUeXBlOiBcInRleHRcIiwgZGF0YTogJ0hlbGxvIFdvcmxkJyB9XVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdSZWFkIG1lc3NhZ2Ugd3JpdHRlbiBieSAnICsgbWVzc2FnZS51cmwpO1xuXHRcdFx0cHJvY2Vzc01lc3NhZ2UobWVzc2FnZSk7XG5cdFx0fVxuXHR9KS50aGVuKCgpID0+IHtcblx0XHRjb25zb2xlLmxvZyhcIkFkZGVkIGEgd2F0Y2guXCIpO1xuXHR9KS5jYXRjaCgoZXJyb3IpID0+IHtcblx0XHRjb25zb2xlLmxvZyhcIkFkZGluZyB3YXRjaCBmYWlsZWQ6IFwiICsgZXJyb3IubmFtZSk7XG5cdH0pO1xuXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpOyJdfQ==
