'use strict'

// Premièrement, vérifions que nous avons la permission de publier des notifications. Si ce n'est pas le cas, demandons la
if (window.Notification && Notification.permission !== "granted") {
	Notification.requestPermission(function (status) {
		if (Notification.permission !== status) {
			Notification.permission = status;
		}
	});
}



function init(socket){
	socket.on('config', function(msg){
		if (msg.type === 'game' && msg.eventType == "showNotification"){
			// Si l'utilisateur accepte d'être notifié
		    if (window.Notification && Notification.permission === "granted") {
		    	navigator.serviceWorker.ready.then(function(registration) {
			    	let options = {
			    		tag: 'superPowerNotification',
			    		icon: './assets/images/binomed_wet_asphalt.png',
			    		body : "C'est à vous de répondre  !",
			    		vibrate: [200, 100, 200, 100, 200, 100, 200]
			    	};
			    	//let n = ServiceWorkerRegistration.showNotification("A vous de jouer ! ", options);
			        registration.showNotification('A vous de jouer ! ', options);
			      });
		      	//let n = new Notification("A vous de jouer !",options);
		    }
		}
	})
}

module.exports = {
	init : init
}