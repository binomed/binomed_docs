var eddystoneBeacon = require('eddystone-beacon');


var uuid = '10ee03676f6f2e672f39744275366c0000000000';
uuid = '1006'


/*var options = {
  name: 'Beacon',    // set device name when advertising (Linux only)
  txPowerLevel: -22, // override TX Power Level, default value is -21,
  tlmCount: 2,       // 2 TLM frames
  tlmPeriod: 10      // every 10 advertisements
};*/

var url = 'https://goo.gl/KsQhXJ';

eddystoneBeacon.advertiseUrl(url);

