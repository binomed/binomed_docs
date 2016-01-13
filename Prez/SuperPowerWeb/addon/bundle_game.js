(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var rvModel = require('./model/rivetsModel'),
	utils = require('./utils/utils'),
	gameModel = {
		allowResp : true
	}, 
	socket = null;

function clickResp(event){
 
	utils.rippleEffect(event);	 
	console.log("click !");
	let elt = event.srcElement;
	let sendMessage = true;
	let type = 'newResp';
	let value = null;
	switch (elt.id){
		case "respA":
			value = 'A';
			if (rvModel.respBSelect 
				|| rvModel.respCSelect 
				|| rvModel.respDSelect){
				type = 'reSend';
				rvModel.respASelect = true;
				rvModel.respBSelect = false;
				rvModel.respCSelect = false;
				rvModel.respDSelect = false;
			}else if (rvModel.respASelect){
				sendMessage = false;
			}else{
				rvModel.respASelect = true;
			}
		break;
		case "respB":
			value = 'B';
			if (rvModel.respASelect 
				|| rvModel.respCSelect 
				|| rvModel.respDSelect){
				type = 'reSend';
				rvModel.respASelect = false;
				rvModel.respBSelect = true;
				rvModel.respCSelect = false;
				rvModel.respDSelect = false;
			}else if (rvModel.respBSelect){
				sendMessage = false;
			}else{
				rvModel.respBSelect = true;
			}
		break;
		case "respC":
		value = 'C';
			if (rvModel.respASelect 
				|| rvModel.respBSelect 
				|| rvModel.respDSelect){
				type = 'reSend';
				rvModel.respASelect = false;
				rvModel.respBSelect = false;
				rvModel.respCSelect = true;
				rvModel.respDSelect = false;
			}else if (rvModel.respCSelect){
				sendMessage = false;
			}else{
				rvModel.respCSelect = true;
			}
		break;
		case "respD":
			value = 'D';
			if (rvModel.respASelect 
				|| rvModel.respBSelect 
				|| rvModel.respCSelect){
				type = 'reSend';
				rvModel.respASelect = false;
				rvModel.respBSelect = false;
				rvModel.respCSelect = false;
				rvModel.respDSelect = true;
			}else if (rvModel.respDSelect){
				sendMessage = false;
			}else{
				rvModel.respDSelect = true;
			}
		break;
	}

	if (sendMessage){
		socket.emit('config',{
			type : 'game',
			eventType : type,
			resp : value
		});
	}

}

function pageLoad(){
	rivets.bind(document.querySelector('#content'), rvModel);
	
	rvModel.clickResp = clickResp;

	if (location.port && location.port === "3010"){
		socket = io.connect("http://localhost:8000");
	}else{
		socket = io.connect();
	}
	socket.on('config', function (data) {
		console.log(data);
	});
}

window.addEventListener('load', pageLoad);


},{"./model/rivetsModel":2,"./utils/utils":3}],2:[function(require,module,exports){
'use strict'

module.exports = {
	hideMessage : true, 
	repA : 'reponse A',
	repB : 'reponse B',
	repC : 'reponse C',
	repD : 'reponse D',
	respASelect : false,
	respBSelect : false,
	respCSelect : false,
	respDSelect : false
}
},{}],3:[function(require,module,exports){
'use strict'

function rippleEffect(event){
	let elt = event.srcElement;
	if (!elt.classList.contains('fab'))
		return;

      
    var divParent = document.createElement('DIV'),
    	div = document.createElement('DIV'),
    	xPos = event.pageX - elt.offsetLeft,
      	yPos = event.pageY - elt.offsetTop;
      
    divParent.classList.add('ripple');
    divParent.style.height = elt.clientHeight+"px";
    divParent.style.top = -(elt.clientHeight / 2)+"px";
    divParent.style.width = elt.clientWidth+"px";
      
    div.classList.add('ripple-effect'); 
    div.style.height = elt.clientHeight+"px";
    div.style.width = elt.clientHeight+"px";
    div.style.top = (yPos - (elt.clientHeight/2))+"px";
    div.style.left = (xPos - (elt.clientHeight/2))+"px";
    div.style.background =  "#89669b";
      
    divParent.appendChild(div);
    elt.appendChild(divParent);

      window.setTimeout(function(){
        elt.removeChild(divParent);
      }, 2000);
}

module.exports = {
	rippleEffect : rippleEffect
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2dhbWUvZ2FtZS5qcyIsInNjcmlwdHMvZ2FtZS9tb2RlbC9yaXZldHNNb2RlbC5qcyIsInNjcmlwdHMvZ2FtZS91dGlscy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBydk1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbC9yaXZldHNNb2RlbCcpLFxuXHR1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMvdXRpbHMnKSxcblx0Z2FtZU1vZGVsID0ge1xuXHRcdGFsbG93UmVzcCA6IHRydWVcblx0fSwgXG5cdHNvY2tldCA9IG51bGw7XG5cbmZ1bmN0aW9uIGNsaWNrUmVzcChldmVudCl7XG4gXG5cdHV0aWxzLnJpcHBsZUVmZmVjdChldmVudCk7XHQgXG5cdGNvbnNvbGUubG9nKFwiY2xpY2sgIVwiKTtcblx0bGV0IGVsdCA9IGV2ZW50LnNyY0VsZW1lbnQ7XG5cdGxldCBzZW5kTWVzc2FnZSA9IHRydWU7XG5cdGxldCB0eXBlID0gJ25ld1Jlc3AnO1xuXHRsZXQgdmFsdWUgPSBudWxsO1xuXHRzd2l0Y2ggKGVsdC5pZCl7XG5cdFx0Y2FzZSBcInJlc3BBXCI6XG5cdFx0XHR2YWx1ZSA9ICdBJztcblx0XHRcdGlmIChydk1vZGVsLnJlc3BCU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BDU2VsZWN0IFxuXHRcdFx0XHR8fCBydk1vZGVsLnJlc3BEU2VsZWN0KXtcblx0XHRcdFx0dHlwZSA9ICdyZVNlbmQnO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcERTZWxlY3QgPSBmYWxzZTtcblx0XHRcdH1lbHNlIGlmIChydk1vZGVsLnJlc3BBU2VsZWN0KXtcblx0XHRcdFx0c2VuZE1lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRydk1vZGVsLnJlc3BBU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRicmVhaztcblx0XHRjYXNlIFwicmVzcEJcIjpcblx0XHRcdHZhbHVlID0gJ0InO1xuXHRcdFx0aWYgKHJ2TW9kZWwucmVzcEFTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcENTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xuXHRcdFx0XHR0eXBlID0gJ3JlU2VuZCc7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IHRydWU7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcEJTZWxlY3Qpe1xuXHRcdFx0XHRzZW5kTWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEJTZWxlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyZXNwQ1wiOlxuXHRcdHZhbHVlID0gJ0MnO1xuXHRcdFx0aWYgKHJ2TW9kZWwucmVzcEFTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcEJTZWxlY3QgXG5cdFx0XHRcdHx8IHJ2TW9kZWwucmVzcERTZWxlY3Qpe1xuXHRcdFx0XHR0eXBlID0gJ3JlU2VuZCc7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcEFTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwQlNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BDU2VsZWN0ID0gdHJ1ZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0fWVsc2UgaWYgKHJ2TW9kZWwucmVzcENTZWxlY3Qpe1xuXHRcdFx0XHRzZW5kTWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJyZXNwRFwiOlxuXHRcdFx0dmFsdWUgPSAnRCc7XG5cdFx0XHRpZiAocnZNb2RlbC5yZXNwQVNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQlNlbGVjdCBcblx0XHRcdFx0fHwgcnZNb2RlbC5yZXNwQ1NlbGVjdCl7XG5cdFx0XHRcdHR5cGUgPSAncmVTZW5kJztcblx0XHRcdFx0cnZNb2RlbC5yZXNwQVNlbGVjdCA9IGZhbHNlO1xuXHRcdFx0XHRydk1vZGVsLnJlc3BCU2VsZWN0ID0gZmFsc2U7XG5cdFx0XHRcdHJ2TW9kZWwucmVzcENTZWxlY3QgPSBmYWxzZTtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9ZWxzZSBpZiAocnZNb2RlbC5yZXNwRFNlbGVjdCl7XG5cdFx0XHRcdHNlbmRNZXNzYWdlID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cnZNb2RlbC5yZXNwRFNlbGVjdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRpZiAoc2VuZE1lc3NhZ2Upe1xuXHRcdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHRcdHR5cGUgOiAnZ2FtZScsXG5cdFx0XHRldmVudFR5cGUgOiB0eXBlLFxuXHRcdFx0cmVzcCA6IHZhbHVlXG5cdFx0fSk7XG5cdH1cblxufVxuXG5mdW5jdGlvbiBwYWdlTG9hZCgpe1xuXHRyaXZldHMuYmluZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpLCBydk1vZGVsKTtcblx0XG5cdHJ2TW9kZWwuY2xpY2tSZXNwID0gY2xpY2tSZXNwO1xuXG5cdGlmIChsb2NhdGlvbi5wb3J0ICYmIGxvY2F0aW9uLnBvcnQgPT09IFwiMzAxMFwiKXtcblx0XHRzb2NrZXQgPSBpby5jb25uZWN0KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCIpO1xuXHR9ZWxzZXtcblx0XHRzb2NrZXQgPSBpby5jb25uZWN0KCk7XG5cdH1cblx0c29ja2V0Lm9uKCdjb25maWcnLCBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHR9KTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG5cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aGlkZU1lc3NhZ2UgOiB0cnVlLCBcblx0cmVwQSA6ICdyZXBvbnNlIEEnLFxuXHRyZXBCIDogJ3JlcG9uc2UgQicsXG5cdHJlcEMgOiAncmVwb25zZSBDJyxcblx0cmVwRCA6ICdyZXBvbnNlIEQnLFxuXHRyZXNwQVNlbGVjdCA6IGZhbHNlLFxuXHRyZXNwQlNlbGVjdCA6IGZhbHNlLFxuXHRyZXNwQ1NlbGVjdCA6IGZhbHNlLFxuXHRyZXNwRFNlbGVjdCA6IGZhbHNlXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIHJpcHBsZUVmZmVjdChldmVudCl7XG5cdGxldCBlbHQgPSBldmVudC5zcmNFbGVtZW50O1xuXHRpZiAoIWVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhYicpKVxuXHRcdHJldHVybjtcblxuICAgICAgXG4gICAgdmFyIGRpdlBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpLFxuICAgIFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyksXG4gICAgXHR4UG9zID0gZXZlbnQucGFnZVggLSBlbHQub2Zmc2V0TGVmdCxcbiAgICAgIFx0eVBvcyA9IGV2ZW50LnBhZ2VZIC0gZWx0Lm9mZnNldFRvcDtcbiAgICAgIFxuICAgIGRpdlBhcmVudC5jbGFzc0xpc3QuYWRkKCdyaXBwbGUnKTtcbiAgICBkaXZQYXJlbnQuc3R5bGUuaGVpZ2h0ID0gZWx0LmNsaWVudEhlaWdodCtcInB4XCI7XG4gICAgZGl2UGFyZW50LnN0eWxlLnRvcCA9IC0oZWx0LmNsaWVudEhlaWdodCAvIDIpK1wicHhcIjtcbiAgICBkaXZQYXJlbnQuc3R5bGUud2lkdGggPSBlbHQuY2xpZW50V2lkdGgrXCJweFwiO1xuICAgICAgXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3JpcHBsZS1lZmZlY3QnKTsgXG4gICAgZGl2LnN0eWxlLmhlaWdodCA9IGVsdC5jbGllbnRIZWlnaHQrXCJweFwiO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9IGVsdC5jbGllbnRIZWlnaHQrXCJweFwiO1xuICAgIGRpdi5zdHlsZS50b3AgPSAoeVBvcyAtIChlbHQuY2xpZW50SGVpZ2h0LzIpKStcInB4XCI7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSAoeFBvcyAtIChlbHQuY2xpZW50SGVpZ2h0LzIpKStcInB4XCI7XG4gICAgZGl2LnN0eWxlLmJhY2tncm91bmQgPSAgXCIjODk2NjliXCI7XG4gICAgICBcbiAgICBkaXZQYXJlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICBlbHQuYXBwZW5kQ2hpbGQoZGl2UGFyZW50KTtcblxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgZWx0LnJlbW92ZUNoaWxkKGRpdlBhcmVudCk7XG4gICAgICB9LCAyMDAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJpcHBsZUVmZmVjdCA6IHJpcHBsZUVmZmVjdFxufSJdfQ==
