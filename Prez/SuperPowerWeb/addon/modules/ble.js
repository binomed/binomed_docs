'use strict'

var eddystoneBeacon = null,//require('eddystone-beacon'),
	server = require('./server'),
	networks = require('./ips'),
    electronic = require('./electronic'),
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
BLE Service
*/

// Characteristic

const uuidCharacteristic = '11111111222233334444000000000010';

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
    },
    onWriteRequest : function(newData, offset, withoutResponse, callback) {
        if(offset > 0) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            var action = newData.toString('utf8');
            console.log(action);
            if (action === 'blink'){
                electronic.blink();
            }else if (action === 'stop'){
                electronic.stop();
            }else if (action.indexOf('bright') != -1){
                var power = Math.min(255, Math.max(+action.substr(action.indexOf(":")+1, action.length))); 
                electronic.brightness(power);
            }
            data = newData;
            callback(bleno.Characteristic.RESULT_SUCCESS);
        }
    }
})

// Service

const uuidService = '11111111222233334444000000000000';

var myTestService =  new bleno.PrimaryService({
    uuid : uuidService,
    characteristics : [
        CharTest
    ]
});

// Bleno

const deviceName = electronic.isRaspberry() ? "RpiJefLedDevice" : "JefLedDevice";

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising(deviceName,[uuidService]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    if (!error) {
        bleno.setServices([myTestService]);
    }
});