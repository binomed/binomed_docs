'use strict'

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


	if (io && location.port && location.port === "3000"){
		let socket = io.connect("http://localhost:8000");
		require('./game/prez_game').init(socket);
	}else if (io && location.port && location.port === "9000"){
		let socket = io.connect("http://jef.binomed.fr:8000");
		require('./game/prez_game').init(socket);
	}	

	
} );
