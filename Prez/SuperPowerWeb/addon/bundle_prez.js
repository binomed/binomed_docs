(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function calculateAddress(){
	if (location.port && (location.port === "3000" || location.port === "8000")){
		return "http://localhost:8000"
	}else if (location.port && location.port === "9000"){
		return "http://jef.binomed.fr:8000";
	}else{
		return null;	
	} 
}

var address = calculateAddress();

module.exports = {
	address : address
}
},{}],2:[function(require,module,exports){
'use strict'

var config = require('../config/config'),
	socket = null;

	

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

function init(socketToSet){
	socket = socketToSet;
	hideQuestion();

	Reveal.addEventListener('question-1', function(){
		changeQuestion(1);
	});
	Reveal.addEventListener('resp-question-1', function(){
		hideQuestion();
		let myHeaders = new Headers();
		let myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

		let myRequest = new Request(`${config.address}/score/1`,myInit);
		fetch(myRequest)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			console.log(json);
		});

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
	var ctx = document.getElementById("chart_question_1").getContext("2d");

	var data = {
	    labels: ["A", "B", "C", "D"],
	    datasets: [
	        {
	            label: "A",
	            fillColor: "rgba(220,220,220,0.5)",
	            strokeColor: "rgba(220,220,220,0.8)",
	            highlightFill: "rgba(220,220,220,0.75)",
	            highlightStroke: "rgba(220,220,220,1)",
	            data: [65, 59, 80, 81]
	        }
	    ]
	};
	var myBarChart = new Chart(ctx).Bar(data, {
		 //Boolean - Whether grid lines are shown across the chart
    	scaleShowGridLines : false,
    	// String - Scale label font colour
    	scaleFontColor: "orange",
	});



	if (io && config.address){
		let socket = io.connect(config.address);
		require('./game/prez_game').init(socket);
	}	

	
} );

},{"./config/config":1,"./game/prez_game":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL3ByZXovY29uZmlnL2NvbmZpZy5qcyIsInNjcmlwdHMvcHJlei9nYW1lL3ByZXpfZ2FtZS5qcyIsInNjcmlwdHMvcHJlei9wcmV6X3N1cGVyX3Bvd2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gY2FsY3VsYXRlQWRkcmVzcygpe1xuXHRpZiAobG9jYXRpb24ucG9ydCAmJiAobG9jYXRpb24ucG9ydCA9PT0gXCIzMDAwXCIgfHwgbG9jYXRpb24ucG9ydCA9PT0gXCI4MDAwXCIpKXtcblx0XHRyZXR1cm4gXCJodHRwOi8vbG9jYWxob3N0OjgwMDBcIlxuXHR9ZWxzZSBpZiAobG9jYXRpb24ucG9ydCAmJiBsb2NhdGlvbi5wb3J0ID09PSBcIjkwMDBcIil7XG5cdFx0cmV0dXJuIFwiaHR0cDovL2plZi5iaW5vbWVkLmZyOjgwMDBcIjtcblx0fWVsc2V7XG5cdFx0cmV0dXJuIG51bGw7XHRcblx0fSBcbn1cblxudmFyIGFkZHJlc3MgPSBjYWxjdWxhdGVBZGRyZXNzKCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRhZGRyZXNzIDogYWRkcmVzc1xufSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnL2NvbmZpZycpLFxuXHRzb2NrZXQgPSBudWxsO1xuXG5cdFxuXG5mdW5jdGlvbiBoaWRlUXVlc3Rpb24oKXtcdFxuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnaGlkZVF1ZXN0aW9uJ1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlUXVlc3Rpb24oaW5kZXgpe1xuXHRzb2NrZXQuZW1pdCgnY29uZmlnJyx7XG5cdFx0dHlwZSA6ICdnYW1lJyxcblx0XHRldmVudFR5cGUgOiAnY2hhbmdlUXVlc3Rpb24nLFxuXHRcdCdpbmRleCcgOiBpbmRleCxcblx0XHRyZXBBIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcEFgKS5pbm5lckhUTUwsXG5cdFx0cmVwQiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXN0YXRlPXF1ZXN0aW9uLSR7aW5kZXh9XSAucmVzcC5yZXBCYCkuaW5uZXJIVE1MLFxuXHRcdHJlcEMgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zdGF0ZT1xdWVzdGlvbi0ke2luZGV4fV0gLnJlc3AucmVwQ2ApLmlubmVySFRNTCxcblx0XHRyZXBEIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3RhdGU9cXVlc3Rpb24tJHtpbmRleH1dIC5yZXNwLnJlcERgKS5pbm5lckhUTUwsXG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoc29ja2V0VG9TZXQpe1xuXHRzb2NrZXQgPSBzb2NrZXRUb1NldDtcblx0aGlkZVF1ZXN0aW9uKCk7XG5cblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3F1ZXN0aW9uLTEnLCBmdW5jdGlvbigpe1xuXHRcdGNoYW5nZVF1ZXN0aW9uKDEpO1xuXHR9KTtcblx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3AtcXVlc3Rpb24tMScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZVF1ZXN0aW9uKCk7XG5cdFx0bGV0IG15SGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG5cdFx0bGV0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgICAgICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgICAgICAgIGNhY2hlOiAnZGVmYXVsdCcgfTtcblxuXHRcdGxldCBteVJlcXVlc3QgPSBuZXcgUmVxdWVzdChgJHtjb25maWcuYWRkcmVzc30vc2NvcmUvMWAsbXlJbml0KTtcblx0XHRmZXRjaChteVJlcXVlc3QpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGpzb24pe1xuXHRcdFx0Y29uc29sZS5sb2coanNvbik7XG5cdFx0fSk7XG5cblx0fSk7XG5cdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdxdWl0LXF1ZXN0aW9uJywgaGlkZVF1ZXN0aW9uKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdCA6IGluaXRcbn0iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZycpO1xuXG5SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3JlYWR5JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIC8vIGV2ZW50LmN1cnJlbnRTbGlkZSwgZXZlbnQuaW5kZXhoLCBldmVudC5pbmRleHZcblx0dmFyIGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcnRfcXVlc3Rpb25fMVwiKS5nZXRDb250ZXh0KFwiMmRcIik7XG5cblx0dmFyIGRhdGEgPSB7XG5cdCAgICBsYWJlbHM6IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIl0sXG5cdCAgICBkYXRhc2V0czogW1xuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgbGFiZWw6IFwiQVwiLFxuXHQgICAgICAgICAgICBmaWxsQ29sb3I6IFwicmdiYSgyMjAsMjIwLDIyMCwwLjUpXCIsXG5cdCAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcInJnYmEoMjIwLDIyMCwyMjAsMC44KVwiLFxuXHQgICAgICAgICAgICBoaWdobGlnaHRGaWxsOiBcInJnYmEoMjIwLDIyMCwyMjAsMC43NSlcIixcblx0ICAgICAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiBcInJnYmEoMjIwLDIyMCwyMjAsMSlcIixcblx0ICAgICAgICAgICAgZGF0YTogWzY1LCA1OSwgODAsIDgxXVxuXHQgICAgICAgIH1cblx0ICAgIF1cblx0fTtcblx0dmFyIG15QmFyQ2hhcnQgPSBuZXcgQ2hhcnQoY3R4KS5CYXIoZGF0YSwge1xuXHRcdCAvL0Jvb2xlYW4gLSBXaGV0aGVyIGdyaWQgbGluZXMgYXJlIHNob3duIGFjcm9zcyB0aGUgY2hhcnRcbiAgICBcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IGZhbHNlLFxuICAgIFx0Ly8gU3RyaW5nIC0gU2NhbGUgbGFiZWwgZm9udCBjb2xvdXJcbiAgICBcdHNjYWxlRm9udENvbG9yOiBcIm9yYW5nZVwiLFxuXHR9KTtcblxuXG5cblx0aWYgKGlvICYmIGNvbmZpZy5hZGRyZXNzKXtcblx0XHRsZXQgc29ja2V0ID0gaW8uY29ubmVjdChjb25maWcuYWRkcmVzcyk7XG5cdFx0cmVxdWlyZSgnLi9nYW1lL3ByZXpfZ2FtZScpLmluaXQoc29ja2V0KTtcblx0fVx0XG5cblx0XG59ICk7XG4iXX0=
