'use strict'

var five = require("johnny-five"),
	Raspi = null,	
	os = require("os"),
	board = null,
	portLed = 11,
	led = null;

try{
	Raspi = require("raspi-io");
	board = new five.Board({io: new Raspi()});
	portLed = "P1-7";
	console.log("On Rpi");
}catch(e){
	Raspi = null;
	board = new five.Board();
	console.log("On Computer");
}


board.on("ready", function() {
  led = new five.Led(portLed);

});

function on(){
	if (led){
		led.on();
	}
}

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
	brightness : brightnessLed,
	blink : blink,
	stop : stopLed, 
	on : on,
	isRaspberry : isRaspberry
}