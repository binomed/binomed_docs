(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var local = location.port && location.port === "3000";

module.exports = {
	address : address,
	local : local
}
},{}],2:[function(require,module,exports){
'use strict'

var config = require('../config/config'),
	socket = null,
	scoreIndex = {};



function hideQuestion(){	
	socket.emit('config',{
		type : 'game',
		eventType : 'hideQuestion'
	});
}

function changeQuestion(index){
	socket.emit('config',{
		type : 'game',
		eventType : 'changeQuestion',
		'index' : index,
		repA : document.querySelector(`[data-state=question-${index}] .resp.repA`).innerHTML,
		repB : document.querySelector(`[data-state=question-${index}] .resp.repB`).innerHTML,
		repC : document.querySelector(`[data-state=question-${index}] .resp.repC`).innerHTML,
		repD : document.querySelector(`[data-state=question-${index}] .resp.repD`).innerHTML,

	});
}

function processScore(index){
	let myHeaders = new Headers();
	let myInit = { method: 'GET',
           headers: myHeaders,
           mode: 'cors',
           cache: 'default' };

	let myRequest = new Request(`${config.address}/score/${index}`,myInit);
	fetch(myRequest)
	.then(function(response){
		return response.json();
	})
	.then(function(json){
		// On ne retraire pas une question déjà traitée
		if (scoreIndex[`question_${index}`]){
			return;
		}
		
		let total = json.repA + json.repB + json.repC + json.repD;
		var ctx = document.getElementById(`chart_question_${index}`).getContext("2d");

		var data = {
		    labels: ["A", "B", "C", "D"],
		    datasets: [
		        {
		            label: "A",
		            fillColor: "rgba(220,220,220,0.5)",
		            strokeColor: "rgba(220,220,220,0.8)",
		            highlightFill: "rgba(220,220,220,0.75)",
		            highlightStroke: "rgba(220,220,220,1)",
		            data: [Math.round((json.repA / total) * 100), 
		            		Math.round((json.repB / total) * 100), 
		            		Math.round((json.repC / total) * 100), 
		            		Math.round((json.repD / total) * 100)]
		        }
		    ]
		};
		var myBarChart = new Chart(ctx).Bar(data, {
			 //Boolean - Whether grid lines are shown across the chart
	    	scaleShowGridLines : false,
	    	// String - Scale label font colour
	    	scaleFontColor: "orange",
		});

		setTimeout(function() {
			document.querySelector(`[data-state=resp-question-${index}] .resp.good`).classList.add('show');
		}, 5000);


	});
}

function init(socketToSet){
	socket = socketToSet;
	hideQuestion();

	Reveal.addEventListener('question-1', function(){
		changeQuestion(1);
	});
	Reveal.addEventListener('resp-question-1', function(){
		hideQuestion();
		processScore(1);

	});
	Reveal.addEventListener('quit-question', hideQuestion);

}

module.exports = {
	init : init
}
},{"../config/config":1}],3:[function(require,module,exports){
'use strict'

var config = require('./config/config');

Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
	


	if (io && config.address){
		let socketGame = io.connect(config.address);
		require('./game/prez_game').init(socketGame);
		let socketPrez = null;
		if (config.local){
			socketPrez = socketGame; 
		}else{
			socketPrez = io.connect(config.address);
		}

		require('./sensors/light').init(socketPrez);
	}	
 
	
} );

},{"./config/config":1,"./game/prez_game":2,"./sensors/light":4}],4:[function(require,module,exports){
'use strict'

let lightEnable = false,
	lightElt = null;


// We update the css Style
function updateLight(data){
	let prefixLight = '-webkit-';
	let percent = data;
	var style = prefixLight+'radial-gradient(center, '
	    +' ellipse cover, '
	    +' rgba(198,197,145,1) 0%,'
	    +' rgba(0,0,0,1) '+percent+'%)'
	    ;
	lightElt.style.background = style;
}

function init(socket){

	socket.on('sensor', function(msg){
		if (lightEnable && msg.type === 'light'){
			updateLight(msg.value);
		}
	});
	lightElt = document.querySelector('.light-bg');

	Reveal.addEventListener( 'start-light', function(){
		lightEnable = true;
	});

	Reveal.addEventListener( 'stop-light', function(){
		lightEnable = false;
	});

}

module.exports = {
	init : init
}
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9zY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9nYW1lL3ByZXpfZ2FtZS5qcyIsImFkZG9uL3NjcmlwdHMvcHJlei9wcmV6X3N1cGVyX3Bvd2VyLmpzIiwiYWRkb24vc2NyaXB0cy9wcmV6L3NlbnNvcnMvbGlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUFkZHJlc3MoKXtcblx0aWYgKGxvY2F0aW9uLnBvcnQgJiYgKGxvY2F0aW9uLnBvcnQgPT09IFwiMzAwMFwiKSl7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCJcblx0fWVsc2UgaWYgKGxvY2F0aW9uLnBvcnQgJiYgbG9jYXRpb24ucG9ydCA9PT0gXCI4MDAwXCIpe1xuXHRcdHJldHVybiBcImh0dHA6Ly9qZWYuYmlub21lZC5mcjo4MDAwXCI7XG5cdH1lbHNle1xuXHRcdHJldHVybiBudWxsO1x0XG5cdH0gXG59XG5cbnZhciBhZGRyZXNzID0gY2FsY3VsYXRlQWRkcmVzcygpO1xudmFyIGxvY2FsID0gbG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjMwMDBcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGFkZHJlc3MgOiBhZGRyZXNzLFxuXHRsb2NhbCA6IGxvY2FsXG59IiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcvY29uZmlnJyksXG5cdHNvY2tldCA9IG51bGwsXG5cdHNjb3JlSW5kZXggPSB7fTtcblxuXG5cbmZ1bmN0aW9uIGhpZGVRdWVzdGlvbigpe1x0XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdoaWRlUXVlc3Rpb24nXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjaGFuZ2VRdWVzdGlvbihpbmRleCl7XG5cdHNvY2tldC5lbWl0KCdjb25maWcnLHtcblx0XHR0eXBlIDogJ2dhbWUnLFxuXHRcdGV2ZW50VHlwZSA6ICdjaGFuZ2VRdWVzdGlvbicsXG5cdFx0J2luZGV4JyA6IGluZGV4LFxuXHRcdHJlcEEgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQWApLmlubmVySFRNTCxcblx0XHRyZXBCIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEJgKS5pbm5lckhUTUwsXG5cdFx0cmVwQyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBDYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwRGApLmlubmVySFRNTCxcblxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1Njb3JlKGluZGV4KXtcblx0bGV0IG15SGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG5cdGxldCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICAgICBjYWNoZTogJ2RlZmF1bHQnIH07XG5cblx0bGV0IG15UmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGAke2NvbmZpZy5hZGRyZXNzfS9zY29yZS8ke2luZGV4fWAsbXlJbml0KTtcblx0ZmV0Y2gobXlSZXF1ZXN0KVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oanNvbil7XG5cdFx0Ly8gT24gbmUgcmV0cmFpcmUgcGFzIHVuZSBxdWVzdGlvbiBkw6lqw6AgdHJhaXTDqWVcblx0XHRpZiAoc2NvcmVJbmRleFtgcXVlc3Rpb25fJHtpbmRleH1gXSl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdGxldCB0b3RhbCA9IGpzb24ucmVwQSArIGpzb24ucmVwQiArIGpzb24ucmVwQyArIGpzb24ucmVwRDtcblx0XHR2YXIgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGNoYXJ0X3F1ZXN0aW9uXyR7aW5kZXh9YCkuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0ICAgIGxhYmVsczogW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiXSxcblx0XHQgICAgZGF0YXNldHM6IFtcblx0XHQgICAgICAgIHtcblx0XHQgICAgICAgICAgICBsYWJlbDogXCJBXCIsXG5cdFx0ICAgICAgICAgICAgZmlsbENvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC41KVwiLFxuXHRcdCAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC44KVwiLFxuXHRcdCAgICAgICAgICAgIGhpZ2hsaWdodEZpbGw6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjc1KVwiLFxuXHRcdCAgICAgICAgICAgIGhpZ2hsaWdodFN0cm9rZTogXCJyZ2JhKDIyMCwyMjAsMjIwLDEpXCIsXG5cdFx0ICAgICAgICAgICAgZGF0YTogW01hdGgucm91bmQoKGpzb24ucmVwQSAvIHRvdGFsKSAqIDEwMCksIFxuXHRcdCAgICAgICAgICAgIFx0XHRNYXRoLnJvdW5kKChqc29uLnJlcEIgLyB0b3RhbCkgKiAxMDApLCBcblx0XHQgICAgICAgICAgICBcdFx0TWF0aC5yb3VuZCgoanNvbi5yZXBDIC8gdG90YWwpICogMTAwKSwgXG5cdFx0ICAgICAgICAgICAgXHRcdE1hdGgucm91bmQoKGpzb24ucmVwRCAvIHRvdGFsKSAqIDEwMCldXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIF1cblx0XHR9O1xuXHRcdHZhciBteUJhckNoYXJ0ID0gbmV3IENoYXJ0KGN0eCkuQmFyKGRhdGEsIHtcblx0XHRcdCAvL0Jvb2xlYW4gLSBXaGV0aGVyIGdyaWQgbGluZXMgYXJlIHNob3duIGFjcm9zcyB0aGUgY2hhcnRcblx0ICAgIFx0c2NhbGVTaG93R3JpZExpbmVzIDogZmFsc2UsXG5cdCAgICBcdC8vIFN0cmluZyAtIFNjYWxlIGxhYmVsIGZvbnQgY29sb3VyXG5cdCAgICBcdHNjYWxlRm9udENvbG9yOiBcIm9yYW5nZVwiLFxuXHRcdH0pO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXJlc3AtcXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLmdvb2RgKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0fSwgNTAwMCk7XG5cblxuXHR9KTtcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXRUb1NldCl7XG5cdHNvY2tldCA9IHNvY2tldFRvU2V0O1xuXHRoaWRlUXVlc3Rpb24oKTtcblxuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0Y2hhbmdlUXVlc3Rpb24oMSk7XG5cdH0pO1xuXHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVzcC1xdWVzdGlvbi0xJywgZnVuY3Rpb24oKXtcblx0XHRoaWRlUXVlc3Rpb24oKTtcblx0XHRwcm9jZXNzU2NvcmUoMSk7XG5cblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWl0LXF1ZXN0aW9uJywgaGlkZVF1ZXN0aW9uKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZycpO1xuXG5SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3JlYWR5JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIC8vIGV2ZW50LmN1cnJlbnRTbGlkZSwgZXZlbnQuaW5kZXhoLCBldmVudC5pbmRleHZcblx0XG5cblxuXHRpZiAoaW8gJiYgY29uZmlnLmFkZHJlc3Mpe1xuXHRcdGxldCBzb2NrZXRHYW1lID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XG5cdFx0cmVxdWlyZSgnLi9nYW1lL3ByZXpfZ2FtZScpLmluaXQoc29ja2V0R2FtZSk7XG5cdFx0bGV0IHNvY2tldFByZXogPSBudWxsO1xuXHRcdGlmIChjb25maWcubG9jYWwpe1xuXHRcdFx0c29ja2V0UHJleiA9IHNvY2tldEdhbWU7IFxuXHRcdH1lbHNle1xuXHRcdFx0c29ja2V0UHJleiA9IGlvLmNvbm5lY3QoY29uZmlnLmFkZHJlc3MpO1xuXHRcdH1cblxuXHRcdHJlcXVpcmUoJy4vc2Vuc29ycy9saWdodCcpLmluaXQoc29ja2V0UHJleik7XG5cdH1cdFxuIFxuXHRcbn0gKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgbGlnaHRFbmFibGUgPSBmYWxzZSxcblx0bGlnaHRFbHQgPSBudWxsO1xuXG5cbi8vIFdlIHVwZGF0ZSB0aGUgY3NzIFN0eWxlXG5mdW5jdGlvbiB1cGRhdGVMaWdodChkYXRhKXtcblx0bGV0IHByZWZpeExpZ2h0ID0gJy13ZWJraXQtJztcblx0bGV0IHBlcmNlbnQgPSBkYXRhO1xuXHR2YXIgc3R5bGUgPSBwcmVmaXhMaWdodCsncmFkaWFsLWdyYWRpZW50KGNlbnRlciwgJ1xuXHQgICAgKycgZWxsaXBzZSBjb3ZlciwgJ1xuXHQgICAgKycgcmdiYSgxOTgsMTk3LDE0NSwxKSAwJSwnXG5cdCAgICArJyByZ2JhKDAsMCwwLDEpICcrcGVyY2VudCsnJSknXG5cdCAgICA7XG5cdGxpZ2h0RWx0LnN0eWxlLmJhY2tncm91bmQgPSBzdHlsZTtcbn1cblxuZnVuY3Rpb24gaW5pdChzb2NrZXQpe1xuXG5cdHNvY2tldC5vbignc2Vuc29yJywgZnVuY3Rpb24obXNnKXtcblx0XHRpZiAobGlnaHRFbmFibGUgJiYgbXNnLnR5cGUgPT09ICdsaWdodCcpe1xuXHRcdFx0dXBkYXRlTGlnaHQobXNnLnZhbHVlKTtcblx0XHR9XG5cdH0pO1xuXHRsaWdodEVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saWdodC1iZycpO1xuXG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc3RhcnQtbGlnaHQnLCBmdW5jdGlvbigpe1xuXHRcdGxpZ2h0RW5hYmxlID0gdHJ1ZTtcblx0fSk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdzdG9wLWxpZ2h0JywgZnVuY3Rpb24oKXtcblx0XHRsaWdodEVuYWJsZSA9IGZhbHNlO1xuXHR9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iXX0=
