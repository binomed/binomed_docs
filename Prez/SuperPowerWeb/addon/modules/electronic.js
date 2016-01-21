'use strict'

var five = require("johnny-five"),
	Raspi = null,	
	os = require("os"),
	board = null,
	portLed = 13,
	led = null;

try{
	Raspi = require("raspi-io");
	board = new five.Board({io: new Raspi()});
	portLed = "P1-7";
}catch(e){
	Raspi = null;
	board = new five.Board();
}


board.on("ready", function() {
  led = new five.Led(portLed);
});

function brightnessLed(power){
	if (led){
		led.brightness(power);
	}
}

function blink(){
	if (led){
		led.blink(500);
	}
}

function stopLed(){
	if (led) {
		led.stop();
		led.off();
	}
}

function isRaspberry(){
	return Raspi;
}

module.exports = {
	brightnessLed : brightnessLed,
	blink : blink,
	stop : stop, 
	isRapberry : isRapberry
}