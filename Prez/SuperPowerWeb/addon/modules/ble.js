'use strict'

var eddystoneBeacon = null,//require('eddystone-beacon'),
	server = require('./server'),
	networks = require('./ips'),
	bleno = require('bleno');

const port = 9000;

var ip = networks.find(function(networkConf){
	return networkConf.name === 'wlan0';
});
if (!ip){
	ip = networks.find(function(networkConf){
		return networkConf.name === 'lo';
	})
}

var url = `http://${ip.ip}:${port}`;

url = 'http://goo.gl/KsQhXJ'; // DevFest Nantes

//eddystoneBeacon.advertiseUrl(url);

server.init(port);
server.registerEvent('ble', 'changeAdvert', function(msg){
	//eddystoneBeacon.advertiseUrl(msg.url);
});

/*
BLE Tests ! 

*/

// Characteristic

var uuidCharacteristic = '11111111222233334444000000000010';

// new characteristic added to the service
var CharTest = new bleno.Characteristic({
    uuid : uuidCharacteristic,
    properties : ['read','writeWithoutResponse'],
    descriptors:[
    	new bleno.Descriptor({
    		uuid:'2901',
    		value: 'test Descriptor ! '
    	})
    ],
    onReadRequest : function(offset, callback) {
    	if (offset){
    		callback(bleno.Characteristic.RESULT_ATTR_NOT_LONG, null);
    	}else{
    		var data = new Buffer(1);
		    data.writeUInt8(1, 0);
		    callback(this.RESULT_SUCCESS, data);
    	}
        /*if(offset > data.length) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            callback(bleno.Characteristic.RESULT_SUCCESS, data.slice(offset));
        }*/
    },
    onWriteRequest : function(newData, offset, withoutResponse, callback) {
        if(offset > 0) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            console.log(newData.toString('utf8'));
            data = newData;
            callback(bleno.Characteristic.RESULT_SUCCESS);
        }
    }
})

// Service

var uuidService = '11111111222233334444000000000000';

var myTestService =  new bleno.PrimaryService({
    uuid : uuidService,
    characteristics : [
        CharTest
    ]
});

// Bleno

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising('MyDevice',[uuidService]);
    } else {
        bleno.stopAdvertising();
    }
});

var data = new Buffer('Send me some data to display');

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    if (!error) {
        bleno.setServices([myTestService]);
    }
});

var toUse = 'b1a67521-52eb-4d36-e13e-357d7c225465';