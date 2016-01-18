(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'


function pageLoad(){
	document.getElementById('clickMe').addEventListener('click', function(){
		navigator.bluetooth.requestDevice({ filters: [{ name: 'MyDevice' }]})
		 .then(function(device) {
		   document.querySelector('#output').textContent = 'connecting...';
		   return device.connectGATT();
		 })
		 .then(function(server) {
		   // FIXME: Remove this timeout when GattServices property works as intended.
		   // crbug.com/560277
		   return new Promise(function(resolve, reject) {
		     setTimeout(function() {
		     	try{
		       		resolve(server.getPrimaryService('11111111-2222-3333-4444-000000000000'));
		     	}catch(err){
		     		reject(err);
		     	}
		     }, 2e3);
		   })
		}).then(function(service){
			document.querySelector('#output').textContent = service;
			console.log(service);
		}).catch(function(error){
			console.error(error);
		});
	});
	
	//require('./socket/sockets');
}

window.addEventListener('load', pageLoad);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuXG5mdW5jdGlvbiBwYWdlTG9hZCgpe1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xpY2tNZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2UoeyBmaWx0ZXJzOiBbeyBuYW1lOiAnTXlEZXZpY2UnIH1dfSlcblx0XHQgLnRoZW4oZnVuY3Rpb24oZGV2aWNlKSB7XG5cdFx0ICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI291dHB1dCcpLnRleHRDb250ZW50ID0gJ2Nvbm5lY3RpbmcuLi4nO1xuXHRcdCAgIHJldHVybiBkZXZpY2UuY29ubmVjdEdBVFQoKTtcblx0XHQgfSlcblx0XHQgLnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cdFx0ICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIHRpbWVvdXQgd2hlbiBHYXR0U2VydmljZXMgcHJvcGVydHkgd29ya3MgYXMgaW50ZW5kZWQuXG5cdFx0ICAgLy8gY3JidWcuY29tLzU2MDI3N1xuXHRcdCAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHQgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0ICAgICBcdHRyeXtcblx0XHQgICAgICAgXHRcdHJlc29sdmUoc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKCcxMTExMTExMS0yMjIyLTMzMzMtNDQ0NC0wMDAwMDAwMDAwMDAnKSk7XG5cdFx0ICAgICBcdH1jYXRjaChlcnIpe1xuXHRcdCAgICAgXHRcdHJlamVjdChlcnIpO1xuXHRcdCAgICAgXHR9XG5cdFx0ICAgICB9LCAyZTMpO1xuXHRcdCAgIH0pXG5cdFx0fSkudGhlbihmdW5jdGlvbihzZXJ2aWNlKXtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQnKS50ZXh0Q29udGVudCA9IHNlcnZpY2U7XG5cdFx0XHRjb25zb2xlLmxvZyhzZXJ2aWNlKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHR9KTtcblx0fSk7XG5cdFxuXHQvL3JlcXVpcmUoJy4vc29ja2V0L3NvY2tldHMnKTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7Il19
