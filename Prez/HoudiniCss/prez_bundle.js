(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ControlPrez = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _thingy = require('./libs/thingy.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ControlPrez = exports.ControlPrez = function () {
    function ControlPrez() {
        _classCallCheck(this, ControlPrez);

        this.thingyConnected = false;

        Reveal.addEventListener('slidechanged', this.thingyControl.bind(this));
    }

    _createClass(ControlPrez, [{
        key: 'thingyControl',
        value: async function thingyControl() {
            try {
                if (this.thingyConnected) {
                    return;
                }
                var thingy = new _thingy.Thingy({
                    logEnabled: true
                });
                await thingy.connect();
                this.thingyConnected = true;
                var battery = await thingy.getBatteryLevel();
                var permission = await Notification.requestPermission();
                if (permission === "denied") {
                    console.log('Thingy Connect and level battery : ' + battery.value);
                } else {
                    console.log('Thingy Connect and level battery : ' + battery.value, battery);
                    new Notification("Thingy Connect ! ", {
                        body: ' Thingy Connect and level battery : ' + battery.value + '%'
                    });
                }
                var state = await thingy.buttonEnable(function (state) {
                    console.log('tap', state);
                    if (state) {
                        Reveal.next();
                    }
                }, true);
                console.log(state);
            } catch (error) {
                console.error(error);
            }
        }
    }]);

    return ControlPrez;
}();

},{"./libs/thingy.js":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Demos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _applyCss = require('./helper/applyCss.js');

var _applyJs = require('./helper/applyJs.js');

var _noise = require('./houdini/noise.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demos = exports.Demos = function () {
    function Demos() {
        _classCallCheck(this, Demos);

        try {

            this._demoPaintApi();
            this.frame = 0;
        } catch (error) {
            console.error(error);
        }
    }

    _createClass(Demos, [{
        key: '_demoPaintApi',
        value: function _demoPaintApi() {
            //(CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');
            //(CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/noise-worklet.js');


            //requestAnimationFrame(this._frameIncrement.bind(this));
        }
    }, {
        key: '_frameIncrement',
        value: function _frameIncrement() {
            if (this.frame === 9) {
                this.frame = 0;
            } else {
                this.frame++;
            }
            document.getElementById('noise').style.setProperty('--frame', this.frame);
            requestAnimationFrame(this._frameIncrement.bind(this));
        }
    }]);

    return Demos;
}();

},{"./helper/applyCss.js":3,"./helper/applyJs.js":4,"./houdini/noise.js":7}],3:[function(require,module,exports){
'use strict';
'use stict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplyCss = exports.ApplyCss = function () {

    /**
     *
     * @param {HtmlElement} elt
     * @param {string} initialContent
     */
    function ApplyCss(elt, initialContent) {
        var _this = this;

        _classCallCheck(this, ApplyCss);

        var codeMirrorCss = CodeMirror(elt, {
            value: initialContent,
            mode: 'css',
            lineNumbers: true,
            autoRefresh: true,
            fixedGutter: false,
            showCursorWhenSelecting: true,
            lineWrapping: true,
            scrollbarStyle: 'null',
            theme: 'blackboard'
        });

        var head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        this.nbElts = 0;

        this.style.type = 'text/css';
        if (this.style.styleSheet) {
            this.style.styleSheet.cssText = '';
        } else {
            this.style.appendChild(document.createTextNode(''));
        }
        head.appendChild(this.style);

        codeMirrorCss.setSize('100%', '100%');
        codeMirrorCss.on('change', function () {
            _this.applyCss(codeMirrorCss.getValue());
        });
        this.applyCss(initialContent);
    }

    _createClass(ApplyCss, [{
        key: 'applyCss',
        value: function applyCss(value) {
            var _this2 = this;

            for (var i = 0; i < this.nbElts; i++) {
                this.style.sheet.deleteRule(0);
            }
            this.nbElts = 0;
            value.split('}').map(function (str) {
                return str.trim();
            }).forEach(function (selectorCss) {
                try {
                    _this2.style.sheet.insertRule(selectorCss + '}');
                    _this2.nbElts++;
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }]);

    return ApplyCss;
}();

},{}],4:[function(require,module,exports){
'use strict';
'use stict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplyCodeMiror =

/**
 *
 * @param {HtmlElement} elt
 * @param {string} mode
 * @param {string} initialContent
 */
exports.ApplyCodeMiror = function ApplyCodeMiror(elt, mode, initialContent) {
    _classCallCheck(this, ApplyCodeMiror);

    var codeMirrorJS = CodeMirror(elt, {
        value: initialContent,
        mode: mode,
        lineNumbers: true,
        autoRefresh: true,
        fixedGutter: false,
        readOnly: true,
        showCursorWhenSelecting: true,
        lineWrapping: true,
        scrollbarStyle: 'null',
        theme: 'blackboard'
    });

    codeMirrorJS.setSize('100%', '100%');
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_TOP = '100px';
var LINE_HEIGHT = '1.15em';
var ADDITIONNAL_HEIGHT = '0.4em';
var COL_WIDTH = 35;

var HighlightCodeHelper = exports.HighlightCodeHelper = function () {
    function HighlightCodeHelper(_ref) {
        var keyElt = _ref.keyElt,
            positionArray = _ref.positionArray;

        _classCallCheck(this, HighlightCodeHelper);

        this.eltHiglight = document.getElementById('highlight-' + keyElt);
        this.positionArray = positionArray;
        this.lastIndex = 0;

        Reveal.addEventListener('code-' + keyElt, this._listenFragments.bind(this));
        Reveal.addEventListener('stop-code-' + keyElt, this._unregisterFragments.bind(this));
    }

    _createClass(HighlightCodeHelper, [{
        key: '_progressFragment',
        value: function _progressFragment(event) {
            try {
                var properties = null;
                if (event.type === 'init') {
                    if (this.lastIndex != 0) {
                        properties = this.positionArray[this.lastIndex];
                    }
                } else if (event.type === 'fragmentshown') {
                    var index = +event.fragment.getAttribute('data-fragment-index');
                    this.lastIndex = index;
                    properties = this.positionArray[index];
                } else {
                    var _index = +event.fragment.getAttribute('data-fragment-index');
                    this.lastIndex = _index;
                    // On reset les properties
                    if (_index > 0) {
                        properties = this.positionArray[_index - 1];
                    }
                }
                var keys = properties ? Object.keys(properties) : [];
                var area = {};
                var position = {};
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    switch (true) {
                        case key === 'line':
                        case key === 'nbLines':
                        case key === 'col':
                        case key === 'nbCols':
                        case key === 'topMargin':
                        case key === 'leftMargin':
                            position[key] = properties[key];
                            break;
                        case key === 'height':
                        case key === 'width':
                        case key === 'top':
                        case key === 'left':
                            area[key] = properties[key];
                            break;
                        default:
                    }
                }

                if (position.topMargin === undefined) {
                    position.topMargin = MIN_TOP;
                }
                if (position.nbLines === undefined && area.height === undefined) {
                    area.height = LINE_HEIGHT;
                }
                if (position.line === undefined && area.top === undefined) {
                    area.top = 0;
                }
                if (position.nbCols === undefined && area.width === undefined) {
                    area.width = 0;
                }
                if (position.col === undefined && area.left === undefined) {
                    area.left = 0;
                }
                this.eltHiglight.area = area;
                this.eltHiglight.position = position;
            } catch (e) {
                console.error(e);
            }
        }
    }, {
        key: '_listenFragments',
        value: function _listenFragments() {
            this._progressFragment({
                type: "init",
                fragment: document.querySelector('div.fragment.visible')
            });
            Reveal.addEventListener('fragmentshown', this._progressFragment.bind(this));
            Reveal.addEventListener('fragmenthidden', this._progressFragment.bind(this));
        }
    }, {
        key: '_unregisterFragments',
        value: function _unregisterFragments() {
            Reveal.removeEventListener('fragmentshown', this._progressFragment.bind(this));
            Reveal.removeEventListener('fragmenthidden', this._progressFragment.bind(this));
        }
    }]);

    return HighlightCodeHelper;
}();

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HighlightEvents = undefined;

var _highlightCodeHelper = require('./helper/highlightCodeHelper.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LINE_HEIGHT = 1.15;
var ADDITIONNAL_HEIGT = 0.4;
var COL_WIDTH = 35;

var HighlightEvents = exports.HighlightEvents = function HighlightEvents() {
    _classCallCheck(this, HighlightEvents);

    //  Css Variable Declaration
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'css-variable',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 4,
            width: '40%'
        }, {
            line: 5,
            nbLines: 4,
            width: '40%'
        }, {
            line: 9,
            nbLines: 4,
            width: '40%'
        }]
    });

    //  Css Variable Declaration in JS
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'css-variable-in-js',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '100px',
            height: '260px',
            width: '60%'
        }, {
            top: '350px',
            height: '300px',
            width: '60%'
        }, {
            top: 0,
            height: '100%',
            width: '100%'
        }]
    });

    // ::Part
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'part',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: 0,
            height: '100%',
            width: '60%'
        }, {
            line: 3,
            nbLines: 4,
            width: '60%'
        }]
    });

    // Template Instantiation
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'template-instantiation',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 3,
            width: '100%'
        }, {
            line: 5,
            nbLines: 6,
            width: '100%'
        }, {
            top: 0,
            height: '100%',
            width: '100%'
        }]
    });

    // HTML Module
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'html-module',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 8,
            width: '100%'
        }, {
            line: 10,
            nbLines: 4,
            width: '100%'
        }, {
            top: 0,
            height: '100%',
            width: '100%'
        }]
    });

    // Paint API
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'paint-api',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 0,
            nbLines: 2,
            width: '100%'
        }, {
            line: 3,
            nbLines: 8,
            width: '100%'
        }, {
            line: 12,
            nbLines: 3,
            width: '100%'
        }]
    });

    // generic sensor
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'generic-sensor',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '60%'
        }, {
            line: 2,
            nbLines: 3,
            width: '80%'
        }, {
            line: 5,
            nbLines: 2,
            width: '80%'
        }, {
            line: 7,
            nbLines: 3,
            width: '80%'
        }]
    });

    // Accelerometer sensor
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'accelerometer-sensor',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 4,
            width: '100%'
        }, {
            line: 5,
            nbLines: 1,
            left: '50px',
            width: '80%'
        }, {
            line: 6,
            left: '50px',
            nbLines: 5,
            width: '80%'
        }, {
            line: 11,
            nbLines: 1,
            left: '50px',
            width: '80%'
        }]
    });
};

},{"./helper/highlightCodeHelper.js":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Noise = exports.Noise = function () {
    function Noise() {
        _classCallCheck(this, Noise);

        this.canvas;
        this.ctx;
        this.wWidth;
        this.wHeight;
        this.noiseData = [];
        this.frame = 0;
        this.loopTimeout;

        this.init();
    }

    // Create Noise


    _createClass(Noise, [{
        key: 'createNoise',
        value: function createNoise() {
            var idata = this.ctx.createImageData(this.wWidth, this.wHeight);
            var buffer32 = new Uint32Array(idata.data.buffer);
            var len = buffer32.length;

            for (var i = 0; i < len; i++) {
                if (Math.random() < 0.5) {
                    buffer32[i] = 0xff000000;
                }
            }

            this.noiseData.push(idata);
        }
    }, {
        key: 'paintNoise',


        // Play Noise
        value: function paintNoise() {
            if (this.frame === 9) {
                this.frame = 0;
            } else {
                this.frame++;
            }

            this.ctx.putImageData(this.noiseData[this.frame], 0, 0);
        }
    }, {
        key: 'loop',


        // Loop
        value: function loop() {
            var _this = this;

            this.paintNoise(this.frame);

            this.loopTimeout = window.setTimeout(function () {
                window.requestAnimationFrame(_this.loop.bind(_this));
            }, 1000 / 25);
        }
    }, {
        key: 'setup',


        // Setup
        value: function setup() {
            this.wWidth = window.innerWidth;
            this.wHeight = window.innerHeight;

            this.canvas.width = this.wWidth;
            this.canvas.height = this.wHeight;

            for (var i = 0; i < 10; i++) {
                this.createNoise();
            }

            this.loop();
        }
    }, {
        key: 'init',


        // Init
        value: function init() {
            this.canvas = document.getElementById('noise');
            this.ctx = this.canvas.getContext('2d');

            this.setup();
        }
    }]);

    return Noise;
}();

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** */
var Thingy = exports.Thingy = function () {
  /**
     *  Thingy:52 Web Bluetooth API. <br>
     *  BLE service details {@link https://nordicsemiconductor.github.io/Nordic-Thingy52-FW/documentation/firmware_architecture.html#fw_arch_ble_services here}
     *
     *
     *  @constructor
     *  @param {Object} [options = {logEnabled: false}] - Options object for Thingy
     *  @param {boolean} options.logEnabled - Enables logging of all BLE actions.
     *
    */
  function Thingy() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { logEnabled: false };

    _classCallCheck(this, Thingy);

    this.logEnabled = options.logEnabled;

    // TCS = Thingy Configuration Service
    this.TCS_UUID = "ef680100-9b35-4933-9b10-52ffa9740042";
    this.TCS_NAME_UUID = "ef680101-9b35-4933-9b10-52ffa9740042";
    this.TCS_ADV_PARAMS_UUID = "ef680102-9b35-4933-9b10-52ffa9740042";
    this.TCS_CONN_PARAMS_UUID = "ef680104-9b35-4933-9b10-52ffa9740042";
    this.TCS_EDDYSTONE_UUID = "ef680105-9b35-4933-9b10-52ffa9740042";
    this.TCS_CLOUD_TOKEN_UUID = "ef680106-9b35-4933-9b10-52ffa9740042";
    this.TCS_FW_VER_UUID = "ef680107-9b35-4933-9b10-52ffa9740042";
    this.TCS_MTU_REQUEST_UUID = "ef680108-9b35-4933-9b10-52ffa9740042";

    // TES = Thingy Environment Service
    this.TES_UUID = "ef680200-9b35-4933-9b10-52ffa9740042";
    this.TES_TEMP_UUID = "ef680201-9b35-4933-9b10-52ffa9740042";
    this.TES_PRESSURE_UUID = "ef680202-9b35-4933-9b10-52ffa9740042";
    this.TES_HUMIDITY_UUID = "ef680203-9b35-4933-9b10-52ffa9740042";
    this.TES_GAS_UUID = "ef680204-9b35-4933-9b10-52ffa9740042";
    this.TES_COLOR_UUID = "ef680205-9b35-4933-9b10-52ffa9740042";
    this.TES_CONFIG_UUID = "ef680206-9b35-4933-9b10-52ffa9740042";

    // TUIS = Thingy User Interface Service
    this.TUIS_UUID = "ef680300-9b35-4933-9b10-52ffa9740042";
    this.TUIS_LED_UUID = "ef680301-9b35-4933-9b10-52ffa9740042";
    this.TUIS_BTN_UUID = "ef680302-9b35-4933-9b10-52ffa9740042";
    this.TUIS_PIN_UUID = "ef680303-9b35-4933-9b10-52ffa9740042";

    // TMS = Thingy Motion Service
    this.TMS_UUID = "ef680400-9b35-4933-9b10-52ffa9740042";
    this.TMS_CONFIG_UUID = "ef680401-9b35-4933-9b10-52ffa9740042";
    this.TMS_TAP_UUID = "ef680402-9b35-4933-9b10-52ffa9740042";
    this.TMS_ORIENTATION_UUID = "ef680403-9b35-4933-9b10-52ffa9740042";
    this.TMS_QUATERNION_UUID = "ef680404-9b35-4933-9b10-52ffa9740042";
    this.TMS_STEP_UUID = "ef680405-9b35-4933-9b10-52ffa9740042";
    this.TMS_RAW_UUID = "ef680406-9b35-4933-9b10-52ffa9740042";
    this.TMS_EULER_UUID = "ef680407-9b35-4933-9b10-52ffa9740042";
    this.TMS_ROT_MATRIX_UUID = "ef680408-9b35-4933-9b10-52ffa9740042";
    this.TMS_HEADING_UUID = "ef680409-9b35-4933-9b10-52ffa9740042";
    this.TMS_GRAVITY_UUID = "ef68040a-9b35-4933-9b10-52ffa9740042";

    // TSS = Thingy Sound Service
    this.TSS_UUID = "ef680500-9b35-4933-9b10-52ffa9740042";
    this.TSS_CONFIG_UUID = "ef680501-9b35-4933-9b10-52ffa9740042";
    this.TSS_SPEAKER_DATA_UUID = "ef680502-9b35-4933-9b10-52ffa9740042";
    this.TSS_SPEAKER_STAT_UUID = "ef680503-9b35-4933-9b10-52ffa9740042";
    this.TSS_MIC_UUID = "ef680504-9b35-4933-9b10-52ffa9740042";

    this.serviceUUIDs = ["battery_service", this.TCS_UUID, this.TES_UUID, this.TUIS_UUID, this.TMS_UUID, this.TSS_UUID];

    this.bleIsBusy = false;
    this.device;
    this.batteryLevelEventListeners = [null, []];
    this.tempEventListeners = [null, []];
    this.pressureEventListeners = [null, []];
    this.humidityEventListeners = [null, []];
    this.gasEventListeners = [null, []];
    this.colorEventListeners = [null, []];
    this.buttonEventListeners = [null, []];
    this.tapEventListeners = [null, []];
    this.orientationEventListeners = [null, []];
    this.quaternionEventListeners = [null, []];
    this.stepEventListeners = [null, []];
    this.motionRawEventListeners = [null, []];
    this.eulerEventListeners = [null, []];
    this.rotationMatrixEventListeners = [null, []];
    this.headingEventListeners = [null, []];
    this.gravityVectorEventListeners = [null, []];
    this.speakerStatusEventListeners = [null, []];
    this.microphoneEventListeners = [null, []];
  }

  /**
     *  Method to read data from a Web Bluetooth characteristic.
     *  Implements a simple solution to avoid starting new GATT requests while another is pending.
     *  Any attempt to read while another GATT operation is in progress, will result in a rejected promise.
     *
     *  @async
     *  @param {Object} characteristic - Web Bluetooth characteristic object
     *  @return {Promise<DataView>} Returns Uint8Array when resolved or an error when rejected
     *
     *  @private
      */


  _createClass(Thingy, [{
    key: "_readData",
    value: async function _readData(characteristic) {
      if (!this.bleIsBusy) {
        try {
          this.bleIsBusy = true;
          var dataArray = await characteristic.readValue();
          this.bleIsBusy = false;

          return dataArray;
        } catch (error) {
          return error;
        }
      } else {
        return Promise.reject(new Error("GATT operation already pending"));
      }
    }

    /**
     *  Method to write data to a Web Bluetooth characteristic.
     *  Implements a simple solution to avoid starting new GATT requests while another is pending.
     *  Any attempt to send data during another GATT operation will result in a rejected promise.
     *  No retransmission is implemented at this level.
     *
     *  @async
     *  @param {Object} characteristic - Web Bluetooth characteristic object
     *  @param {Uint8Array} dataArray - Typed array of bytes to send
     *  @return {Promise}
     *
     *  @private
     *
    */

  }, {
    key: "_writeData",
    value: async function _writeData(characteristic, dataArray) {
      if (!this.bleIsBusy) {
        try {
          this.bleIsBusy = true;
          await characteristic.writeValue(dataArray);
          this.bleIsBusy = false;
        } catch (error) {
          return error;
        }
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("GATT operation already pending"));
      }
    }

    /**
     *  Connects to Thingy.
     *  The function stores all discovered services and characteristics to the Thingy object.
     *
     *  @async
     *  @return {Promise<Error>} Returns an empty promise when resolved or a promise with error on rejection
     *
     */

  }, {
    key: "connect",
    value: async function connect() {
      try {
        // Scan for Thingys
        if (this.logEnabled) {
          console.log("Scanning for devices with service UUID equal to " + this.TCS_UUID);
        }

        this.device = await navigator.bluetooth.requestDevice({
          filters: [{
            services: [this.TCS_UUID]
          }],
          optionalServices: this.serviceUUIDs
        });
        if (this.logEnabled) {
          console.log("Found Thingy named \"" + this.device.name + "\", trying to connect");
        }

        // Connect to GATT server
        var server = await this.device.gatt.connect();
        if (this.logEnabled) {
          console.log("Connected to \"" + this.device.name + "\"");
        }

        // Battery service
        var batteryService = await server.getPrimaryService("battery_service");
        this.batteryCharacteristic = await batteryService.getCharacteristic("battery_level");
        if (this.logEnabled) {
          console.log("Discovered battery service and battery level characteristic");
        }

        // Thingy configuration service
        this.configurationService = await server.getPrimaryService(this.TCS_UUID);
        this.nameCharacteristic = await this.configurationService.getCharacteristic(this.TCS_NAME_UUID);
        this.advParamsCharacteristic = await this.configurationService.getCharacteristic(this.TCS_ADV_PARAMS_UUID);
        this.cloudTokenCharacteristic = await this.configurationService.getCharacteristic(this.TCS_CLOUD_TOKEN_UUID);
        this.connParamsCharacteristic = await this.configurationService.getCharacteristic(this.TCS_CONN_PARAMS_UUID);
        this.eddystoneCharacteristic = await this.configurationService.getCharacteristic(this.TCS_EDDYSTONE_UUID);
        this.firmwareVersionCharacteristic = await this.configurationService.getCharacteristic(this.TCS_FW_VER_UUID);
        this.mtuRequestCharacteristic = await this.configurationService.getCharacteristic(this.TCS_MTU_REQUEST_UUID);
        if (this.logEnabled) {
          console.log("Discovered Thingy configuration service and its characteristics");
        }

        // Thingy environment service
        this.environmentService = await server.getPrimaryService(this.TES_UUID);
        this.temperatureCharacteristic = await this.environmentService.getCharacteristic(this.TES_TEMP_UUID);
        this.colorCharacteristic = await this.environmentService.getCharacteristic(this.TES_COLOR_UUID);
        this.gasCharacteristic = await this.environmentService.getCharacteristic(this.TES_GAS_UUID);
        this.humidityCharacteristic = await this.environmentService.getCharacteristic(this.TES_HUMIDITY_UUID);
        this.pressureCharacteristic = await this.environmentService.getCharacteristic(this.TES_PRESSURE_UUID);
        this.environmentConfigCharacteristic = await this.environmentService.getCharacteristic(this.TES_CONFIG_UUID);
        if (this.logEnabled) {
          console.log("Discovered Thingy environment service and its characteristics");
        }

        // Thingy user interface service
        this.userInterfaceService = await server.getPrimaryService(this.TUIS_UUID);
        this.buttonCharacteristic = await this.userInterfaceService.getCharacteristic(this.TUIS_BTN_UUID);
        this.ledCharacteristic = await this.userInterfaceService.getCharacteristic(this.TUIS_LED_UUID);
        this.externalPinCharacteristic = await this.userInterfaceService.getCharacteristic(this.TUIS_PIN_UUID);
        if (this.logEnabled) {
          console.log("Discovered Thingy user interface service and its characteristics");
        }

        // Thingy motion service
        this.motionService = await server.getPrimaryService(this.TMS_UUID);
        this.tmsConfigCharacteristic = await this.motionService.getCharacteristic(this.TMS_CONFIG_UUID);
        this.eulerCharacteristic = await this.motionService.getCharacteristic(this.TMS_EULER_UUID);
        this.gravityVectorCharacteristic = await this.motionService.getCharacteristic(this.TMS_GRAVITY_UUID);
        this.headingCharacteristic = await this.motionService.getCharacteristic(this.TMS_HEADING_UUID);
        this.orientationCharacteristic = await this.motionService.getCharacteristic(this.TMS_ORIENTATION_UUID);
        this.quaternionCharacteristic = await this.motionService.getCharacteristic(this.TMS_QUATERNION_UUID);
        this.motionRawCharacteristic = await this.motionService.getCharacteristic(this.TMS_RAW_UUID);
        this.rotationMatrixCharacteristic = await this.motionService.getCharacteristic(this.TMS_ROT_MATRIX_UUID);
        this.stepCharacteristic = await this.motionService.getCharacteristic(this.TMS_STEP_UUID);
        this.tapCharacteristic = await this.motionService.getCharacteristic(this.TMS_TAP_UUID);
        if (this.logEnabled) {
          console.log("Discovered Thingy motion service and its characteristics");
        }

        // Thingy sound service
        this.soundService = await server.getPrimaryService(this.TSS_UUID);
        this.tssConfigCharacteristic = await this.soundService.getCharacteristic(this.TSS_CONFIG_UUID);
        this.microphoneCharacteristic = await this.soundService.getCharacteristic(this.TSS_MIC_UUID);
        this.speakerDataCharacteristic = await this.soundService.getCharacteristic(this.TSS_SPEAKER_DATA_UUID);
        this.speakerStatusCharacteristic = await this.soundService.getCharacteristic(this.TSS_SPEAKER_STAT_UUID);
        if (this.logEnabled) {
          console.log("Discovered Thingy sound service and its characteristics");
        }
      } catch (error) {
        return error;
      }
    }

    /**
     *  Method to disconnect from Thingy.
     *
     *  @async
     *  @return {Promise<Error>} Returns an empty promise when resolved or a promise with error on rejection.
     */

  }, {
    key: "disconnect",
    value: async function disconnect() {
      try {
        await this.device.gatt.disconnect();
      } catch (error) {
        return error;
      }
    }

    // Method to enable and disable notifications for a characteristic

  }, {
    key: "_notifyCharacteristic",
    value: async function _notifyCharacteristic(characteristic, enable, notifyHandler) {
      if (enable) {
        try {
          await characteristic.startNotifications();
          if (this.logEnabled) {
            console.log("Notifications enabled for " + characteristic.uuid);
          }
          characteristic.addEventListener("characteristicvaluechanged", notifyHandler);
        } catch (error) {
          return error;
        }
      } else {
        try {
          await characteristic.stopNotifications();
          if (this.logEnabled) {
            console.log("Notifications disabled for ", characteristic.uuid);
          }
          characteristic.removeEventListener("characteristicvaluechanged", notifyHandler);
        } catch (error) {
          return error;
        }
      }
    }

    /*  Configuration service  */
    /**
     *  Gets the name of the Thingy device.
     *
     *  @async
     *  @return {Promise<string|Error>} Returns a string with the name when resolved or a promise with error on rejection.
     *
     */

  }, {
    key: "getName",
    value: async function getName() {
      try {
        var data = await this._readData(this.nameCharacteristic);
        var decoder = new TextDecoder("utf-8");
        var name = decoder.decode(data);
        if (this.logEnabled) {
          console.log("Received device name: " + name);
        }
        return name;
      } catch (error) {
        return error;
      }
    }

    /**
     *  Sets the name of the Thingy device.
     *
     *  @async
     *  @param {string} name - The name that will be given to the Thingy.
     *  @return {Promise<Error>} Returns a promise.
     *
     */

  }, {
    key: "setName",
    value: async function setName(name) {
      if (name.length > 10) {
        return Promise.reject(new TypeError("The name can't be more than 10 characters long."));
      }
      var byteArray = new Uint8Array(name.length);
      for (var i = 0; i < name.length; i += 1) {
        byteArray[i] = name.charCodeAt(i);
      }
      return await this._writeData(this.nameCharacteristic, byteArray);
    }

    /**
     *  Gets the current advertising parameters
     *
     *  @async
     *  @return {Promise<Object|Error>} Returns an object with the advertising parameters when resolved or a promise with error on rejection.
     */

  }, {
    key: "getAdvParams",
    value: async function getAdvParams() {
      try {
        var receivedData = await this._readData(this.advParamsCharacteristic);

        // Interval is given in units of 0.625 milliseconds
        var littleEndian = true;
        var interval = (receivedData.getUint16(0, littleEndian) * 0.625).toFixed(0);
        var timeout = receivedData.getUint8(2);
        var params = {
          interval: {
            interval: interval,
            unit: "ms"
          },
          timeout: {
            timeout: timeout,
            unit: "s"
          }
        };
        return params;
      } catch (error) {
        return error;
      }
    }

    /**
     *  Sets the advertising parameters
     *
     *  @async
     *  @param {Object} params - Object with key/value pairs 'interval' and 'timeout': <code>{interval: someInterval, timeout: someTimeout}</code>.
     *  @param {number} params.interval - The advertising interval in milliseconds in the range of 20 ms to 5 000 ms.
     *  @param {number} params.timeout - The advertising timeout in seconds in the range 1 s to 180 s.
     *  @return {Promise<Error>} Returns a promise.
     *
     */

  }, {
    key: "setAdvParams",
    value: async function setAdvParams(params) {
      if ((typeof params === "undefined" ? "undefined" : _typeof(params)) !== "object" || params.interval === undefined || params.timeout === undefined) {
        return Promise.reject(new TypeError("The argument has to be an object with key/value pairs interval' and 'timeout': {interval: someInterval, timeout: someTimeout}"));
      }

      // Interval is in units of 0.625 ms.
      var interval = params.interval * 1.6;
      var timeout = params.timeout;

      // Check parameters
      if (interval < 32 || interval > 8000) {
        return Promise.reject(new RangeError("The advertising interval must be within the range of 20 ms to 5 000 ms"));
      }
      if (timeout < 0 || timeout > 180) {
        return Promise.reject(new RangeError("The advertising timeout must be within the range of 0 to 180 s"));
      }

      var dataArray = new Uint8Array(3);
      dataArray[0] = interval & 0xff;
      dataArray[1] = interval >> 8 & 0xff;
      dataArray[2] = timeout;

      return await this._writeData(this.advParamsCharacteristic, dataArray);
    }

    /**
     *  Gets the current connection parameters.
     *
     *  @async
     *  @return {Promise<Object|Error>} Returns an object with the connection parameters when resolved or a promise with error on rejection.
     *
     */

  }, {
    key: "getConnParams",
    value: async function getConnParams() {
      try {
        var receivedData = await this._readData(this.connParamsCharacteristic);

        // Connection intervals are given in units of 1.25 ms
        var littleEndian = true;
        var minConnInterval = receivedData.getUint16(0, littleEndian) * 1.25;
        var maxConnInterval = receivedData.getUint16(2, littleEndian) * 1.25;
        var slaveLatency = receivedData.getUint16(4, littleEndian);

        // Supervision timeout is given i units of 10 ms
        var supervisionTimeout = receivedData.getUint16(6, littleEndian) * 10;
        var params = {
          connectionInterval: {
            min: minConnInterval,
            max: maxConnInterval,
            unit: "ms"
          },
          slaveLatency: {
            value: slaveLatency,
            unit: "number of connection intervals"
          },
          supervisionTimeout: {
            timeout: supervisionTimeout,
            unit: "ms"
          }
        };
        return params;
      } catch (error) {
        return error;
      }
    }

    /**
     *  Sets the connection interval
     *
     *  @async
     *  @param {Object} params - Connection interval object: <code>{minInterval: someValue, maxInterval: someValue}</code>
     *  @param {number} params.minInterval - The minimum connection interval in milliseconds. Must be >= 7.5 ms.
     *  @param {number} params.maxInterval - The maximum connection interval in milliseconds. Must be <= 4 000 ms.
     *  @return {Promise<Error>} Returns a promise.
     *
     */

  }, {
    key: "setConnInterval",
    value: async function setConnInterval(params) {
      if ((typeof params === "undefined" ? "undefined" : _typeof(params)) !== "object" || params.minInterval === undefined || params.maxInterval === undefined) {
        return Promise.reject(new TypeError("The argument has to be an object: {minInterval: value, maxInterval: value}"));
      }

      var minInterval = params.minInterval;
      var maxInterval = params.maxInterval;

      if (minInterval === null || maxInterval === null) {
        return Promise.reject(new TypeError("Both minimum and maximum acceptable interval must be passed as arguments"));
      }

      // Check parameters
      if (minInterval < 7.5 || minInterval > maxInterval) {
        return Promise.reject(new RangeError("The minimum connection interval must be greater than 7.5 ms and <= maximum interval"));
      }
      if (maxInterval > 4000 || maxInterval < minInterval) {
        return Promise.reject(new RangeError("The minimum connection interval must be less than 4 000 ms and >= minimum interval"));
      }

      try {
        var receivedData = await this._readData(this.connParamsCharacteristic);
        var dataArray = new Uint8Array(8);

        // Interval is in units of 1.25 ms.
        minInterval = Math.round(minInterval * 0.8);
        maxInterval = Math.round(maxInterval * 0.8);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[0] = minInterval & 0xff;
        dataArray[1] = minInterval >> 8 & 0xff;
        dataArray[2] = maxInterval & 0xff;
        dataArray[3] = maxInterval >> 8 & 0xff;

        return await this._writeData(this.connParamsCharacteristic, dataArray);
      } catch (error) {
        return Promise.reject(new Error("Error when updating connection interval: " + error));
      }
    }

    /**
     *  Sets the connection slave latency
     *
     *  @async
     *  @param {number} slaveLatency - The desired slave latency in the range from 0 to 499 connection intervals.
     *  @return {Promise<Object>} Returns a promise.
     *
     */

  }, {
    key: "setConnSlaveLatency",
    value: async function setConnSlaveLatency(slaveLatency) {
      // Check parameters
      if (slaveLatency < 0 || slaveLatency > 499) {
        return Promise.reject(new RangeError("The slave latency must be in the range from 0 to 499 connection intervals."));
      }

      try {
        var receivedData = await this._readData(this.connParamsCharacteristic);
        var dataArray = new Uint8Array(8);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[4] = slaveLatency & 0xff;
        dataArray[5] = slaveLatency >> 8 & 0xff;

        return await this._writeData(this.connParamsCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when updating slave latency: " + error);
      }
    }

    /**
     *  Sets the connection supervision timeout
     *  <b>Note:</b> According to the Bluetooth Low Energy specification, the supervision timeout in milliseconds must be greater
     *  than (1 + slaveLatency) * maxConnInterval * 2, where maxConnInterval is also given in milliseconds.
     *
     *  @async
     *  @param {number} timeout - The desired connection supervision timeout in milliseconds and in the range of 100 ms to 32 000 ms.
     *  @return {Promise<Error>} Returns a promise.
     *
     */

  }, {
    key: "setConnTimeout",
    value: async function setConnTimeout(timeout) {
      // Check parameters
      if (timeout < 100 || timeout > 32000) {
        return Promise.reject(new RangeError("The supervision timeout must be in the range from 100 ms to 32 000 ms."));
      }

      try {
        // The supervision timeout has to be set in units of 10 ms
        timeout = Math.round(timeout / 10);
        var receivedData = await this._readData(this.connParamsCharacteristic);
        var dataArray = new Uint8Array(8);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        // Check that the timeout obeys  conn_sup_timeout * 4 > (1 + slave_latency) * max_conn_interval
        var littleEndian = true;
        var maxConnInterval = receivedData.getUint16(2, littleEndian);
        var slaveLatency = receivedData.getUint16(4, littleEndian);

        if (timeout * 4 < (1 + slaveLatency) * maxConnInterval) {
          return Promise.reject(new Error("The supervision timeout in milliseconds must be greater than (1 + slaveLatency) * maxConnInterval * 2, where maxConnInterval is also given in milliseconds."));
        }

        dataArray[6] = timeout & 0xff;
        dataArray[7] = timeout >> 8 & 0xff;

        return await this._writeData(this.connParamsCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when updating the supervision timeout: " + error);
      }
    }

    /**
     *  Gets the configured Eddystone URL
     *
     *  @async
     *  @return {Promise<URL|Error>} Returns a string with the URL when resolved or a promise with error on rejection.
     *
     */

  }, {
    key: "getEddystoneUrl",
    value: async function getEddystoneUrl() {
      try {
        var receivedData = await this._readData(this.eddystoneCharacteristic);

        // According to Eddystone URL encoding specification, certain elements can be expanded: https://github.com/google/eddystone/tree/master/eddystone-url
        var prefixArray = ["http://www.", "https://www.", "http://", "https://"];
        var expansionCodes = [".com/", ".org/", ".edu/", ".net/", ".info/", ".biz/", ".gov/", ".com", ".org", ".edu", ".net", ".info", ".biz", ".gov"];
        var prefix = prefixArray[receivedData.getUint8(0)];
        var decoder = new TextDecoder("utf-8");
        var url = decoder.decode(receivedData);
        url = prefix + url.slice(1);

        expansionCodes.forEach(function (element, i) {
          if (url.indexOf(String.fromCharCode(i)) !== -1) {
            url = url.replace(String.fromCharCode(i), expansionCodes[i]);
          }
        });

        return new URL(url);
      } catch (error) {
        return error;
      }
    }

    /**
     *  Sets the Eddystone URL
     *  It's recommeended to use URL shortener to stay within the limit of 14 characters long URL
     *  URL scheme prefix such as "https://" and "https://www." do not count towards that limit,
     *  neither does expansion codes such as ".com/" and ".org".
     *  Full details in the Eddystone URL specification: https://github.com/google/eddystone/tree/master/eddystone-url
     *
     *  @async
     *  @param {string} urlString - The URL that should be broadcasted.
     *  @return {Promise<Error>} Returns a promise.
     *
     */

  }, {
    key: "setEddystoneUrl",
    value: async function setEddystoneUrl(urlString) {
      try {
        // Uses URL API to check for valid URL
        var url = new URL(urlString);

        // Eddystone URL specification defines codes for URL scheme prefixes and expansion codes in the URL.
        // The array index corresponds to the defined code in the specification.
        // Details here: https://github.com/google/eddystone/tree/master/eddystone-url
        var prefixArray = ["http://www.", "https://www.", "http://", "https://"];
        var expansionCodes = [".com/", ".org/", ".edu/", ".net/", ".info/", ".biz/", ".gov/", ".com", ".org", ".edu", ".net", ".info", ".biz", ".gov"];
        var prefixCode = null;
        var expansionCode = null;
        var eddystoneUrl = url.href;
        var len = eddystoneUrl.length;

        prefixArray.forEach(function (element, i) {
          if (url.href.indexOf(element) !== -1 && prefixCode === null) {
            prefixCode = String.fromCharCode(i);
            eddystoneUrl = eddystoneUrl.replace(element, prefixCode);
            len -= element.length;
          }
        });

        expansionCodes.forEach(function (element, i) {
          if (url.href.indexOf(element) !== -1 && expansionCode === null) {
            expansionCode = String.fromCharCode(i);
            eddystoneUrl = eddystoneUrl.replace(element, expansionCode);
            len -= element.length;
          }
        });

        if (len < 1 || len > 14) {
          return Promise.reject(new TypeError("The URL can't be longer than 14 characters, excluding URL scheme such as \"https://\" and \".com/\"."));
        }

        var byteArray = new Uint8Array(eddystoneUrl.length);

        for (var i = 0; i < eddystoneUrl.length; i++) {
          byteArray[i] = eddystoneUrl.charCodeAt(i);
        }

        return this._writeData(this.eddystoneCharacteristic, byteArray);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    /**
     *  Gets the configured cloud token.
     *
     *  @async
     *  @return {Promise<string|Error>} Returns a string with the cloud token when resolved or a promise with error on rejection.
     *
     */

  }, {
    key: "getCloudToken",
    value: async function getCloudToken() {
      try {
        var receivedData = await this._readData(this.cloudTokenCharacteristic);
        var decoder = new TextDecoder("utf-8");
        var token = decoder.decode(receivedData);

        return token;
      } catch (error) {
        return error;
      }
    }

    /**
     *  Sets the cloud token.
     *
     *  @async
     *  @param {string} token - The cloud token to be stored.
     *  @return {Promise<Error>} Returns a promise.
     *
     */

  }, {
    key: "setCloudToken",
    value: async function setCloudToken(token) {
      if (token.length > 250) {
        return Promise.reject(new Error("The cloud token can not exceed 250 characters."));
      }

      var encoder = new TextEncoder("utf-8").encode(token);

      return this._writeData(this.cloudTokenCharacteristic, encoder);
    }

    /**
     *  Gets the current Maximal Transmission Unit (MTU)
     *
     *  @async
     *  @return {Promise<number|Error>} Returns the MTU when resolved or a promise with error on rejection.
     *
     */

  }, {
    key: "getMtu",
    value: async function getMtu() {
      try {
        var receivedData = await this._readData(this.mtuRequestCharacteristic);
        var littleEndian = true;
        var mtu = receivedData.getUint16(1, littleEndian);

        return mtu;
      } catch (error) {
        return error;
      }
    }

    /**
     *  Sets the current Maximal Transmission Unit (MTU)
     *
     *  @async
     *  @param {Object} [params = {peripheralRequest: true}] - MTU settings object: {mtuSize: value, peripheralRequest: value}, where peripheralRequest is optional.
     *  @param {number} params.mtuSize - The desired MTU size.
     *  @param {boolean} params.peripheralRequest - Optional. Set to <code>true</code> if peripheral should send an MTU exchange request. Default is <code>true</code>;
     *  @return {Promise<Error>} Returns a promise.
     *
     */

  }, {
    key: "setMtu",
    value: async function setMtu(params) {
      if ((typeof params === "undefined" ? "undefined" : _typeof(params)) !== "object" || params.mtuSize === undefined) {
        return Promise.reject(new TypeError("The argument has to be an object"));
      }

      var mtuSize = params.mtuSize;
      var peripheralRequest = params.peripheralRequest || true;

      if (mtuSize < 23 || mtuSize > 276) {
        return Promise.reject(new Error("MTU size must be in range 23 - 276 bytes"));
      }

      var dataArray = new Uint8Array(3);
      dataArray[0] = peripheralRequest ? 1 : 0;
      dataArray[1] = mtuSize & 0xff;
      dataArray[2] = mtuSize >> 8 & 0xff;

      return this._writeData(this.mtuRequestCharacteristic, dataArray);
    }

    /**
     *  Gets the current firmware version.
     *
     *  @async
     *  @return {Promise<string|Error>} Returns a string with the firmware version or a promise with error on rejection.
     *
     */

  }, {
    key: "getFirmwareVersion",
    value: async function getFirmwareVersion() {
      try {
        var receivedData = await this._readData(this.firmwareVersionCharacteristic);
        var major = receivedData.getUint8(0);
        var minor = receivedData.getUint8(1);
        var patch = receivedData.getUint8(2);
        var version = "v" + major + "." + minor + "." + patch;

        return version;
      } catch (error) {
        return error;
      }
    }

    //  ******  //

    /*  Environment service  */

    /**
     *  Gets the current configuration of the Thingy environment module.
     *
     *  @async
     *  @return {Promise<Object|Error>} Returns an environment configuration object when promise resolves, or an error if rejected.
     *
     */

  }, {
    key: "getEnvironmentConfig",
    value: async function getEnvironmentConfig() {
      try {
        var data = await this._readData(this.environmentConfigCharacteristic);
        var littleEndian = true;
        var tempInterval = data.getUint16(0, littleEndian);
        var pressureInterval = data.getUint16(2, littleEndian);
        var humidityInterval = data.getUint16(4, littleEndian);
        var colorInterval = data.getUint16(6, littleEndian);
        var gasMode = data.getUint8(8);
        var colorSensorRed = data.getUint8(9);
        var colorSensorGreen = data.getUint8(10);
        var colorSensorBlue = data.getUint8(11);
        var config = {
          tempInterval: tempInterval,
          pressureInterval: pressureInterval,
          humidityInterval: humidityInterval,
          colorInterval: colorInterval,
          gasMode: gasMode,
          colorSensorRed: colorSensorRed,
          colorSensorGreen: colorSensorGreen,
          colorSensorBlue: colorSensorBlue
        };

        return config;
      } catch (error) {
        return new Error("Error when getting environment sensors configurations: " + error);
      }
    }

    /**
     *  Sets the temperature measurement update interval.
     *
     *  @async
     *  @param {Number} interval - Temperature sensor update interval in milliseconds. Must be in the range 100 ms to 60 000 ms.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setTemperatureInterval",
    value: async function setTemperatureInterval(interval) {
      try {
        if (interval < 50 || interval > 60000) {
          return Promise.reject(new RangeError("The temperature sensor update interval must be in the range 100 ms - 60 000 ms"));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.environmentConfigCharacteristic);
        var dataArray = new Uint8Array(12);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[0] = interval & 0xff;
        dataArray[1] = interval >> 8 & 0xff;

        return await this._writeData(this.environmentConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new temperature update interval: " + error);
      }
    }

    /**
     *  Sets the pressure measurement update interval.
     *
     *  @async
     *  @param {Number} interval - The pressure sensor update interval in milliseconds. Must be in the range 50 ms to 60 000 ms.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setPressureInterval",
    value: async function setPressureInterval(interval) {
      try {
        if (interval < 50 || interval > 60000) {
          return Promise.reject(new RangeError("The pressure sensor update interval must be in the range 100 ms - 60 000 ms"));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.environmentConfigCharacteristic);
        var dataArray = new Uint8Array(12);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[2] = interval & 0xff;
        dataArray[3] = interval >> 8 & 0xff;

        return await this._writeData(this.environmentConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new pressure update interval: " + error);
      }
    }

    /**
     *  Sets the humidity measurement update interval.
     *
     *  @async
     *  @param {Number} interval - Humidity sensor interval in milliseconds. Must be in the range 100 ms to 60 000 ms.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setHumidityInterval",
    value: async function setHumidityInterval(interval) {
      try {
        if (interval < 100 || interval > 60000) {
          return Promise.reject(new RangeError("The humidity sensor sampling interval must be in the range 100 ms - 60 000 ms"));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.environmentConfigCharacteristic);
        var dataArray = new Uint8Array(12);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[4] = interval & 0xff;
        dataArray[5] = interval >> 8 & 0xff;

        return await this._writeData(this.environmentConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new humidity update interval: " + error);
      }
    }

    /**
     *  Sets the color sensor update interval.
     *
     *  @async
     *  @param {Number} interval - Color sensor sampling interval in milliseconds. Must be in the range 200 ms to 60 000 ms.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setColorInterval",
    value: async function setColorInterval(interval) {
      try {
        if (interval < 200 || interval > 60000) {
          return Promise.reject(new RangeError("The color sensor sampling interval must be in the range 200 ms - 60 000 ms"));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.environmentConfigCharacteristic);
        var dataArray = new Uint8Array(12);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[6] = interval & 0xff;
        dataArray[7] = interval >> 8 & 0xff;

        return await this._writeData(this.environmentConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new color sensor update interval: " + error);
      }
    }

    /**
     *  Sets the gas sensor sampling interval.
     *
     *  @param {Number} interval - The gas sensor update interval in seconds. Allowed values are 1, 10, and 60 seconds.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setGasInterval",
    value: async function setGasInterval(interval) {
      try {
        var mode = void 0;

        if (interval === 1) {
          mode = 1;
        } else if (interval === 10) {
          mode = 2;
        } else if (interval === 60) {
          mode = 3;
        } else {
          return Promise.reject(new RangeError("The gas sensor interval has to be 1, 10 or 60 seconds."));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.environmentConfigCharacteristic);
        var dataArray = new Uint8Array(12);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[8] = mode;

        return await this._writeData(this.environmentConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new gas sensor interval: " + error);
      }
    }

    /**
     *  Configures color sensor LED calibration parameters.
     *
     *  @async
     *  @param {Number} red - The red intensity, ranging from 0 to 255.
     *  @param {Number} green - The green intensity, ranging from 0 to 255.
     *  @param {Number} blue - The blue intensity, ranging from 0 to 255.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "colorSensorCalibrate",
    value: async function colorSensorCalibrate(red, green, blue) {
      try {
        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.environmentConfigCharacteristic);
        var dataArray = new Uint8Array(12);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[9] = red;
        dataArray[10] = green;
        dataArray[11] = blue;

        return await this._writeData(this.environmentConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new color sensor parameters: " + error);
      }
    }

    /**
     *  Enables temperature notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a temperature object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "temperatureEnable",
    value: async function temperatureEnable(eventHandler, enable) {
      if (enable) {
        this.tempEventListeners[0] = this._temperatureNotifyHandler.bind(this);
        this.tempEventListeners[1].push(eventHandler);
      } else {
        this.tempEventListeners[1].splice(this.tempEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.temperatureCharacteristic, enable, this.tempEventListeners[0]);
    }
  }, {
    key: "_temperatureNotifyHandler",
    value: function _temperatureNotifyHandler(event) {
      var data = event.target.value;
      var integer = data.getUint8(0);
      var decimal = data.getUint8(1);
      var temperature = integer + decimal / 100;
      this.tempEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          value: temperature,
          unit: "Celsius"
        });
      });
    }

    /**
     *  Enables pressure notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a pressure object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "pressureEnable",
    value: async function pressureEnable(eventHandler, enable) {
      if (enable) {
        this.pressureEventListeners[0] = this._pressureNotifyHandler.bind(this);
        this.pressureEventListeners[1].push(eventHandler);
      } else {
        this.pressureEventListeners[1].splice(this.pressureEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.pressureCharacteristic, enable, this.pressureEventListeners[0]);
    }
  }, {
    key: "_pressureNotifyHandler",
    value: function _pressureNotifyHandler(event) {
      var data = event.target.value;
      var littleEndian = true;
      var integer = data.getUint32(0, littleEndian);
      var decimal = data.getUint8(4);
      var pressure = integer + decimal / 100;
      this.pressureEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          value: pressure,
          unit: "hPa"
        });
      });
    }

    /**
     *  Enables humidity notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a humidity object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "humidityEnable",
    value: async function humidityEnable(eventHandler, enable) {
      if (enable) {
        this.humidityEventListeners[0] = this._humidityNotifyHandler.bind(this);
        this.humidityEventListeners[1].push(eventHandler);
      } else {
        this.humidityEventListeners[1].splice(this.humidityEventListeners.indexOf([eventHandler]), 1);
      }
      return await this._notifyCharacteristic(this.humidityCharacteristic, enable, this.humidityEventListeners[0]);
    }
  }, {
    key: "_humidityNotifyHandler",
    value: function _humidityNotifyHandler(event) {
      var data = event.target.value;
      var humidity = data.getUint8(0);
      this.humidityEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          value: humidity,
          unit: "%"
        });
      });
    }

    /**
     *  Enables gas notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a gas object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "gasEnable",
    value: async function gasEnable(eventHandler, enable) {
      if (enable) {
        this.gasEventListeners[0] = this._gasNotifyHandler.bind(this);
        this.gasEventListeners[1].push(eventHandler);
      } else {
        this.gasEventListeners[1].splice(this.gasEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.gasCharacteristic, enable, this.gasEventListeners[0]);
    }
  }, {
    key: "_gasNotifyHandler",
    value: function _gasNotifyHandler(event) {
      var data = event.target.value;
      var littleEndian = true;
      var eco2 = data.getUint16(0, littleEndian);
      var tvoc = data.getUint16(2, littleEndian);

      this.gasEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          eCO2: {
            value: eco2,
            unit: "ppm"
          },
          TVOC: {
            value: tvoc,
            unit: "ppb"
          }
        });
      });
    }

    /**
     *  Enables color sensor notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a color sensor object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "colorEnable",
    value: async function colorEnable(eventHandler, enable) {
      if (enable) {
        this.colorEventListeners[0] = this._colorNotifyHandler.bind(this);
        this.colorEventListeners[1].push(eventHandler);
      } else {
        this.colorEventListeners[1].splice(this.colorEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.colorCharacteristic, enable, this.colorEventListeners[0]);
    }
  }, {
    key: "_colorNotifyHandler",
    value: function _colorNotifyHandler(event) {
      var data = event.target.value;
      var littleEndian = true;
      var r = data.getUint16(0, littleEndian);
      var g = data.getUint16(2, littleEndian);
      var b = data.getUint16(4, littleEndian);
      var c = data.getUint16(6, littleEndian);
      var rRatio = r / (r + g + b);
      var gRatio = g / (r + g + b);
      var bRatio = b / (r + g + b);
      var clearAtBlack = 300;
      var clearAtWhite = 400;
      var clearDiff = clearAtWhite - clearAtBlack;
      var clearNormalized = (c - clearAtBlack) / clearDiff;

      if (clearNormalized < 0) {
        clearNormalized = 0;
      }

      var red = rRatio * 255.0 * 3 * clearNormalized;

      if (red > 255) {
        red = 255;
      }
      var green = gRatio * 255.0 * 3 * clearNormalized;

      if (green > 255) {
        green = 255;
      }
      var blue = bRatio * 255.0 * 3 * clearNormalized;

      if (blue > 255) {
        blue = 255;
      }

      this.colorEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          red: red.toFixed(0),
          green: green.toFixed(0),
          blue: blue.toFixed(0)
        });
      });
    }

    //  ******  //
    /*  User interface service  */

    /**
     *  Gets the current LED settings from the Thingy device. Returns an object with structure that depends on the settings.
     *
     *  @async
     *  @return {Promise<Object>} Returns a LED status object. The content and structure depends on the current mode.
     *
     */

  }, {
    key: "getLedStatus",
    value: async function getLedStatus() {
      try {
        var data = await this._readData(this.ledCharacteristic);
        var mode = data.getUint8(0);
        var littleEndian = true;
        var status = void 0;

        switch (mode) {
          case 0:
            status = { LEDstatus: { mode: mode } };
            break;
          case 1:
            status = {
              mode: mode,
              r: data.getUint8(1),
              g: data.getUint8(2),
              b: data.getUint8(3)
            };
            break;
          case 2:
            status = {
              mode: mode,
              color: data.getUint8(1),
              intensity: data.getUint8(2),
              delay: data.getUint16(3, littleEndian)
            };
            break;
          case 3:
            status = {
              mode: mode,
              color: data.getUint8(1),
              intensity: data.getUint8(2)
            };
            break;
        }
        return status;
      } catch (error) {
        return new Error("Error when getting Thingy LED status: " + error);
      }
    }
  }, {
    key: "_ledSet",
    value: function _ledSet(dataArray) {
      return this._writeData(this.ledCharacteristic, dataArray);
    }

    /**
     *  Sets the LED in constant mode with the specified RGB color.
     *
     *  @async
     *  @param {Object} color - Color object with RGB values
     *  @param {number} color.red - The value for red color in an RGB color. Ranges from 0 to 255.
     *  @param {number} color.green - The value for green color in an RGB color. Ranges from 0 to 255.
     *  @param {number} color.blue - The value for blue color in an RGB color. Ranges from 0 to 255.
     *  @return {Promise<Error>} Returns a resolved promise or an error in a rejected promise.
     *
     */

  }, {
    key: "ledConstant",
    value: async function ledConstant(color) {
      if (color.red === undefined || color.green === undefined || color.blue === undefined) {
        return Promise.reject(new TypeError("The options object for must have the properties 'red', 'green' and 'blue'."));
      }
      if (color.red < 0 || color.red > 255 || color.green < 0 || color.green > 255 || color.blue < 0 || color.blue > 255) {
        return Promise.reject(new RangeError("The RGB values must be in the range 0 - 255"));
      }
      return await this._ledSet(new Uint8Array([1, color.red, color.green, color.blue]));
    }

    /**
     *  Sets the LED in "breathe" mode where the LED continuously pulses with the specified color, intensity and delay between pulses.
     *
     *  @async
     *  @param {Object} params - Options object for LED breathe mode
     *  @param {number|string} params.color - The color code or color name. 1 = red, 2 = green, 3 = yellow, 4 = blue, 5 = purple, 6 = cyan, 7 = white.
     *  @param {number} params.intensity - Intensity of LED pulses. Range from 0 to 100 [%].
     *  @param {number} params.delay - Delay between pulses in milliseconds. Range from 50 ms to 10 000 ms.
     *  @return {Promise<Error>} Returns a resolved promise or an error in a rejected promise.
     *
     */

  }, {
    key: "ledBreathe",
    value: async function ledBreathe(params) {
      var colors = ["red", "green", "yellow", "blue", "purple", "cyan", "white"];
      var colorCode = typeof params.color === "string" ? colors.indexOf(params.color) + 1 : params.color;

      if (params.color === undefined || params.intensity === undefined || params.delay === undefined) {
        return Promise.reject(new TypeError("The options object for must have the properties 'color', 'intensity' and 'intensity'."));
      }
      if (colorCode < 1 || colorCode > 7) {
        return Promise.reject(new RangeError("The color code must be in the range 1 - 7"));
      }
      if (params.intensity < 0 || params.intensity > 100) {
        return Promise.reject(new RangeError("The intensity must be in the range 0 - 100%"));
      }
      if (params.delay < 50 || params.delay > 10000) {
        return Promise.reject(new RangeError("The delay must be in the range 50 ms - 10 000 ms"));
      }

      return await this._ledSet(new Uint8Array([2, colorCode, params.intensity, params.delay & 0xff, params.delay >> 8 & 0xff]));
    }

    /**
     *  Sets the LED in one-shot mode. One-shot mode will result in one single pulse of the LED.
     *
     *  @async
     *  @param {Object} params - Option object for LED in one-shot mode
     *  @param {number} params.color - The color code. 1 = red, 2 = green, 3 = yellow, 4 = blue, 5 = purple, 6 = cyan, 7 = white.
     *  @param {number} params.intensity - Intensity of LED pulses. Range from 0 to 100 [%].
     *  @return {Promise<Error>} Returns a resolved promise or an error in a rejected promise.
     *
     */

  }, {
    key: "ledOneShot",
    value: async function ledOneShot(params) {
      var colors = ["red", "green", "yellow", "blue", "purple", "cyan", "white"];
      var colorCode = typeof params.color === "string" ? colors.indexOf(params.color) + 1 : params.color;

      if (colorCode === undefined || params.intensity === undefined) {
        return Promise.reject(new TypeError("The options object for LED one-shot must have the properties 'color' and 'intensity."));
      }
      if (colorCode < 1 || colorCode > 7) {
        return Promise.reject(new RangeError("The color code must be in the range 1 - 7"));
      }
      if (params.intensity < 1 || params.intensity > 100) {
        return Promise.reject(new RangeError("The intensity must be in the range 0 - 100"));
      }

      return await this._ledSet(new Uint8Array([3, colorCode, params.intensity]));
    }

    /**
     *  Enables button notifications from Thingy. The assigned event handler will be called when the button on the Thingy is pushed or released.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a button object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise with button state when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "buttonEnable",
    value: async function buttonEnable(eventHandler, enable) {
      if (enable) {
        this.buttonEventListeners[0] = this._buttonNotifyHandler.bind(this);
        this.buttonEventListeners[1].push(eventHandler);
      } else {
        this.buttonEventListeners[1].splice(this.buttonEventListeners.indexOf([eventHandler]), 1);
      }
      return await this._notifyCharacteristic(this.buttonCharacteristic, enable, this.buttonEventListeners[0]);
    }
  }, {
    key: "_buttonNotifyHandler",
    value: function _buttonNotifyHandler(event) {
      var data = event.target.value;
      var state = data.getUint8(0);
      this.buttonEventListeners[1].forEach(function (eventHandler) {
        eventHandler(state);
      });
    }

    /**
     *  Gets the current external pin settings from the Thingy device. Returns an object with pin status information.
     *
     *  @async
     *  @return {Promise<Object|Error>} Returns an external pin status object.
     *
     */

  }, {
    key: "externalPinsStatus",
    value: async function externalPinsStatus() {
      try {
        var data = await this._readData(this.externalPinCharacteristic);
        var pinStatus = {
          pin1: data.getUint8(0),
          pin2: data.getUint8(1),
          pin3: data.getUint8(2),
          pin4: data.getUint8(3)
        };
        return pinStatus;
      } catch (error) {
        return new Error("Error when reading from external pin characteristic: " + error);
      }
    }

    /**
     *  Set an external pin to chosen state.
     *
     *  @async
     *  @param {number} pin - Determines which pin is set. Range 1 - 4.
     *  @param {number} value - Sets the value of the pin. 0 = OFF, 255 = ON.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setExternalPin",
    value: async function setExternalPin(pin, value) {
      if (pin < 1 || pin > 4) {
        return Promise.reject(new Error("Pin number must be 1 - 4"));
      }
      if (!(value === 0 || value === 255)) {
        return Promise.reject(new Error("Pin status value must be 0 or 255"));
      }

      try {
        // Preserve values for those pins that are not being set
        var receivedData = await this._readData(this.externalPinCharacteristic);
        var dataArray = new Uint8Array(4);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[pin - 1] = value;

        return await this._writeData(this.externalPinCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting external pins: " + error);
      }
    }

    //  ******  //
    /*  Motion service  */
    /**
     *  Gets the current configuration of the Thingy motion module.
     *
     *  @async
     *  @return {Promise<Object|Error>} Returns a motion configuration object when promise resolves, or an error if rejected.
     *
     */

  }, {
    key: "getMotionConfig",
    value: async function getMotionConfig() {
      try {
        var data = await this._readData(this.tmsConfigCharacteristic);
        var littleEndian = true;
        var stepCounterInterval = data.getUint16(0, littleEndian);
        var tempCompInterval = data.getUint16(2, littleEndian);
        var magnetCompInterval = data.getUint16(4, littleEndian);
        var motionProcessingFrequency = data.getUint16(6, littleEndian);
        var wakeOnMotion = data.getUint8(8);
        var config = {
          stepCountInterval: stepCounterInterval,
          tempCompInterval: tempCompInterval,
          magnetCompInterval: magnetCompInterval,
          motionProcessingFrequency: motionProcessingFrequency,
          wakeOnMotion: wakeOnMotion
        };

        return config;
      } catch (error) {
        return new Error("Error when getting Thingy motion module configuration: " + error);
      }
    }

    /**
     *  Sets the step counter interval.
     *
     *  @async
     *  @param {number} interval - Step counter interval in milliseconds. Must be in the range 100 ms to 5 000 ms.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setStepCounterInterval",
    value: async function setStepCounterInterval(interval) {
      try {
        if (interval < 100 || interval > 5000) {
          return Promise.reject(new Error("The interval has to be in the range 100 - 5000 ms."));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.tmsConfigCharacteristic);
        var dataArray = new Uint8Array(9);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[0] = interval & 0xff;
        dataArray[1] = interval >> 8 & 0xff;

        return await this._writeData(this.tmsConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new step count interval: " + error);
      }
    }

    /**
     *  Sets the temperature compensation interval.
     *
     *  @async
     *  @param {Number} interval - Temperature compensation interval in milliseconds. Must be in the range 100 ms to 5 000 ms.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setTemperatureCompInterval",
    value: async function setTemperatureCompInterval(interval) {
      try {
        if (interval < 100 || interval > 5000) {
          return Promise.reject(new Error("The interval has to be in the range 100 - 5000 ms."));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.tmsConfigCharacteristic);
        var dataArray = new Uint8Array(9);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[2] = interval & 0xff;
        dataArray[3] = interval >> 8 & 0xff;

        return await this._writeData(this.tmsConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new temperature compensation interval: " + error);
      }
    }

    /**
     *  Sets the magnetometer compensation interval.
     *
     *  @async
     *  @param {Number} interval - Magnetometer compensation interval in milliseconds. Must be in the range 100 ms to 1 000 ms.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setMagnetCompInterval",
    value: async function setMagnetCompInterval(interval) {
      try {
        if (interval < 100 || interval > 1000) {
          return Promise.reject(new Error("The interval has to be in the range 100 - 1000 ms."));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.tmsConfigCharacteristic);
        var dataArray = new Uint8Array(9);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[4] = interval & 0xff;
        dataArray[5] = interval >> 8 & 0xff;

        return await this._writeData(this.tmsConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new magnetometer compensation interval: " + error);
      }
    }

    /**
     *  Sets motion processing unit update frequency.
     *
     *  @async
     *  @param {Number} frequency - Motion processing frequency in Hz. The allowed range is 5 - 200 Hz.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setMotionProcessFrequency",
    value: async function setMotionProcessFrequency(frequency) {
      try {
        if (frequency < 100 || frequency > 200) {
          return Promise.reject(new Error("The interval has to be in the range 5 - 200 Hz."));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.tmsConfigCharacteristic);
        var dataArray = new Uint8Array(9);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[6] = frequency & 0xff;
        dataArray[7] = frequency >> 8 & 0xff;

        return await this._writeData(this.tmsConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new motion porcessing unit update frequency: " + error);
      }
    }

    /**
     *  Sets wake-on-motion feature to enabled or disabled state.
     *
     *  @async
     *  @param {boolean} enable - Set to True to enable or False to disable wake-on-motion feature.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection.
     *
     */

  }, {
    key: "setWakeOnMotion",
    value: async function setWakeOnMotion(enable) {
      try {
        if (typeof enable !== "boolean") {
          return Promise.reject(new Error("The argument must be true or false."));
        }

        // Preserve values for those settings that are not being changed
        var receivedData = await this._readData(this.tmsConfigCharacteristic);
        var dataArray = new Uint8Array(9);

        for (var i = 0; i < dataArray.length; i++) {
          dataArray[i] = receivedData.getUint8(i);
        }

        dataArray[8] = enable ? 1 : 0;

        return await this._writeData(this.tmsConfigCharacteristic, dataArray);
      } catch (error) {
        return new Error("Error when setting new magnetometer compensation interval:" + error);
      }
    }

    /**
     *  Enables tap detection notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a tap detection object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "tapEnable",
    value: async function tapEnable(eventHandler, enable) {
      if (enable) {
        this.tapEventListeners[0] = this._tapNotifyHandler.bind(this);
        this.tapEventListeners[1].push(eventHandler);
      } else {
        this.tapEventListeners[1].splice(this.tapEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.tapCharacteristic, enable, this.tapEventListeners[0]);
    }
  }, {
    key: "_tapNotifyHandler",
    value: function _tapNotifyHandler(event) {
      var data = event.target.value;
      var direction = data.getUint8(0);
      var count = data.getUint8(1);
      this.tapEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          direction: direction,
          count: count
        });
      });
    }

    /**
     *  Enables orientation detection notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a orientation detection object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "orientationEnable",
    value: async function orientationEnable(eventHandler, enable) {
      if (enable) {
        this.orientationEventListeners[0] = this._orientationNotifyHandler.bind(this);
        this.orientationEventListeners[1].push(eventHandler);
      } else {
        this.orientationEventListeners[1].splice(this.orientationEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.orientationCharacteristic, enable, this.orientationEventListeners[0]);
    }
  }, {
    key: "_orientationNotifyHandler",
    value: function _orientationNotifyHandler(event) {
      var data = event.target.value;
      var orientation = data.getUint8(0);
      this.orientationEventListeners[1].forEach(function (eventHandler) {
        eventHandler(orientation);
      });
    }

    /**
     *  Enables quaternion notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a quaternion object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "quaternionEnable",
    value: async function quaternionEnable(eventHandler, enable) {
      if (enable) {
        this.quaternionEventListeners[0] = this._quaternionNotifyHandler.bind(this);
        this.quaternionEventListeners[1].push(eventHandler);
      } else {
        this.quaternionEventListeners[1].splice(this.quaternionEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.quaternionCharacteristic, enable, this.quaternionEventListeners[0]);
    }
  }, {
    key: "_quaternionNotifyHandler",
    value: function _quaternionNotifyHandler(event) {
      var data = event.target.value;

      // Divide by (1 << 30) according to sensor specification
      var w = data.getInt32(0, true) / (1 << 30);
      var x = data.getInt32(4, true) / (1 << 30);
      var y = data.getInt32(8, true) / (1 << 30);
      var z = data.getInt32(12, true) / (1 << 30);
      var magnitude = Math.sqrt(Math.pow(w, 2) + Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

      if (magnitude !== 0) {
        w /= magnitude;
        x /= magnitude;
        y /= magnitude;
        z /= magnitude;
      }

      this.quaternionEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          w: w,
          x: x,
          y: y,
          z: z
        });
      });
    }

    /**
     *  Enables step counter notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a step counter object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "stepEnable",
    value: async function stepEnable(eventHandler, enable) {
      if (enable) {
        this.stepEventListeners[0] = this._stepNotifyHandler.bind(this);
        this.stepEventListeners[1].push(eventHandler);
      } else {
        this.stepEventListeners[1].splice(this.stepEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.stepCharacteristic, enable, this.stepEventListeners[0]);
    }
  }, {
    key: "_stepNotifyHandler",
    value: function _stepNotifyHandler(event) {
      var data = event.target.value;
      var littleEndian = true;
      var count = data.getUint32(0, littleEndian);
      var time = data.getUint32(4, littleEndian);
      this.stepEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          count: count,
          time: {
            value: time,
            unit: "ms"
          }
        });
      });
    }

    /**
     *  Enables raw motion data notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a raw motion data object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "motionRawEnable",
    value: async function motionRawEnable(eventHandler, enable) {
      if (enable) {
        this.motionRawEventListeners[0] = this._motionRawNotifyHandler.bind(this);
        this.motionRawEventListeners[1].push(eventHandler);
      } else {
        this.motionRawEventListeners[1].splice(this.motionRawEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.motionRawCharacteristic, enable, this.motionRawEventListeners[0]);
    }
  }, {
    key: "_motionRawNotifyHandler",
    value: function _motionRawNotifyHandler(event) {
      var data = event.target.value;

      // Divide by 2^6 = 64 to get accelerometer correct values
      var accX = data.getInt16(0, true) / 64;
      var accY = data.getInt16(2, true) / 64;
      var accZ = data.getInt16(4, true) / 64;

      // Divide by 2^11 = 2048 to get correct gyroscope values
      var gyroX = data.getInt16(6, true) / 2048;
      var gyroY = data.getInt16(8, true) / 2048;
      var gyroZ = data.getInt16(10, true) / 2048;

      // Divide by 2^12 = 4096 to get correct compass values
      var compassX = data.getInt16(12, true) / 4096;
      var compassY = data.getInt16(14, true) / 4096;
      var compassZ = data.getInt16(16, true) / 4096;

      this.motionRawEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          accelerometer: {
            x: accX,
            y: accY,
            z: accZ,
            unit: "G"
          },
          gyroscope: {
            x: gyroX,
            y: gyroY,
            z: gyroZ,
            unit: "deg/s"
          },
          compass: {
            x: compassX,
            y: compassY,
            z: compassZ,
            unit: "microTesla"
          }
        });
      });
    }

    /**
     *  Enables Euler angle data notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive an Euler angle data object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "eulerEnable",
    value: async function eulerEnable(eventHandler, enable) {
      if (enable) {
        this.eulerEventListeners[0] = this._eulerNotifyHandler.bind(this);
        this.eulerEventListeners[1].push(eventHandler);
      } else {
        this.eulerEventListeners[1].splice(this.eulerEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.eulerCharacteristic, enable, this.eulerEventListeners[0]);
    }
  }, {
    key: "_eulerNotifyHandler",
    value: function _eulerNotifyHandler(event) {
      var data = event.target.value;

      // Divide by two bytes (1<<16 or 2^16 or 65536) to get correct value
      var roll = data.getInt32(0, true) / 65536;
      var pitch = data.getInt32(4, true) / 65536;
      var yaw = data.getInt32(8, true) / 65536;

      this.eulerEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          roll: roll,
          pitch: pitch,
          yaw: yaw
        });
      });
    }

    /**
     *  Enables rotation matrix notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @asunc
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive an rotation matrix object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "rotationMatrixEnable",
    value: async function rotationMatrixEnable(eventHandler, enable) {
      if (enable) {
        this.rotationMatrixEventListeners[0] = this._rotationMatrixNotifyHandler.bind(this);
        this.rotationMatrixEventListeners[1].push(eventHandler);
      } else {
        this.rotationMatrixEventListeners[1].splice(this.rotationMatrixEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.rotationMatrixCharacteristic, enable, this.rotationMatrixEventListeners[0]);
    }
  }, {
    key: "_rotationMatrixNotifyHandler",
    value: function _rotationMatrixNotifyHandler(event) {
      var data = event.target.value;

      // Divide by 2^2 = 4 to get correct values
      var r1c1 = data.getInt16(0, true) / 4;
      var r1c2 = data.getInt16(0, true) / 4;
      var r1c3 = data.getInt16(0, true) / 4;
      var r2c1 = data.getInt16(0, true) / 4;
      var r2c2 = data.getInt16(0, true) / 4;
      var r2c3 = data.getInt16(0, true) / 4;
      var r3c1 = data.getInt16(0, true) / 4;
      var r3c2 = data.getInt16(0, true) / 4;
      var r3c3 = data.getInt16(0, true) / 4;

      this.rotationMatrixEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          row1: [r1c1, r1c2, r1c3],
          row2: [r2c1, r2c2, r2c3],
          row3: [r3c1, r3c2, r3c3]
        });
      });
    }

    /**
     *  Enables heading notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a heading object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "headingEnable",
    value: async function headingEnable(eventHandler, enable) {
      if (enable) {
        this.headingEventListeners[0] = this._headingNotifyHandler.bind(this);
        this.headingEventListeners[1].push(eventHandler);
      } else {
        this.headingEventListeners[1].splice(this.headingEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.headingCharacteristic, enable, this.headingEventListeners[0]);
    }
  }, {
    key: "_headingNotifyHandler",
    value: function _headingNotifyHandler(event) {
      var data = event.target.value;

      // Divide by 2^16 = 65536 to get correct heading values
      var heading = data.getInt32(0, true) / 65536;

      this.headingEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          value: heading,
          unit: "degrees"
        });
      });
    }

    /**
     *  Enables gravity vector notifications from Thingy. The assigned event handler will be called when notifications are received.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on notification. Will receive a heading object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
     */

  }, {
    key: "gravityVectorEnable",
    value: async function gravityVectorEnable(eventHandler, enable) {
      if (enable) {
        this.gravityVectorEventListeners[0] = this._gravityVectorNotifyHandler.bind(this);
        this.gravityVectorEventListeners[1].push(eventHandler);
      } else {
        this.gravityVectorEventListeners[1].splice(this.gravityVectorEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.gravityVectorCharacteristic, enable, this.gravityVectorEventListeners[0]);
    }
  }, {
    key: "_gravityVectorNotifyHandler",
    value: function _gravityVectorNotifyHandler(event) {
      var data = event.target.value;
      var x = data.getFloat32(0, true);
      var y = data.getFloat32(4, true);
      var z = data.getFloat32(8, true);

      this.gravityVectorEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          x: x,
          y: y,
          z: z
        });
      });
    }

    //  ******  //

    /*  Sound service  */

  }, {
    key: "microphoneEnable",
    value: function microphoneEnable(enable) {
      // Tables of constants needed for when we decode the adpcm-encoded audio from the Thingy
      if (this._MICROPHONE_INDEX_TABLE === undefined) {
        this._MICROPHONE_INDEX_TABLE = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
      }
      if (this._MICROPHONE_STEP_SIZE_TABLE === undefined) {
        this._MICROPHONE_STEP_SIZE_TABLE = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
      }
      if (enable) {
        this.microphoneEventListeners[0] = this._microphoneNotifyHandler.bind(this);
        // lager en ny audio context, skal bare ha én av denne
        if (this.audioCtx === undefined) {
          var AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioCtx = new AudioContext();
        }
      }
      return this._notifyCharacteristic(this.microphoneCharacteristic, enable, this.microphoneEventListeners[0]);
    }
  }, {
    key: "_microphoneNotifyHandler",
    value: function _microphoneNotifyHandler(event) {
      var audioPacket = event.target.value.buffer;
      var adpcm = {
        header: new DataView(audioPacket.slice(0, 3)),
        data: new DataView(audioPacket.slice(3))
      };
      var decodedAudio = this._decodeAudio(adpcm);
      this._playDecodedAudio(decodedAudio);
    }
    /*  Sound service  */

  }, {
    key: "_decodeAudio",
    value: function _decodeAudio(adpcm) {
      // Allocate output buffer
      var audioBufferDataLength = adpcm.data.byteLength;
      var audioBuffer = new ArrayBuffer(512);
      var pcm = new DataView(audioBuffer);
      var diff = void 0;
      var bufferStep = false;
      var inputBuffer = 0;
      var delta = 0;
      var sign = 0;
      var step = void 0;

      // The first 2 bytes of ADPCM frame are the predicted value
      var valuePredicted = adpcm.header.getInt16(0, false);
      // The 3rd byte is the index value
      var index = adpcm.header.getInt8(2);
      if (index < 0) {
        index = 0;
      }
      if (index > 88) {
        index = 88;
      }
      step = this._MICROPHONE_STEP_SIZE_TABLE[index];
      for (var _in = 0, _out = 0; _in < audioBufferDataLength; _out += 2) {
        /* Step 1 - get the delta value */
        if (bufferStep) {
          delta = inputBuffer & 0x0F;
          _in++;
        } else {
          inputBuffer = adpcm.data.getInt8(_in);
          delta = inputBuffer >> 4 & 0x0F;
        }
        bufferStep = !bufferStep;
        /* Step 2 - Find new index value (for later) */
        index += this._MICROPHONE_INDEX_TABLE[delta];
        if (index < 0) {
          index = 0;
        }
        if (index > 88) {
          index = 88;
        }
        /* Step 3 - Separate sign and magnitude */
        sign = delta & 8;
        delta = delta & 7;
        /* Step 4 - Compute difference and new predicted value */
        diff = step >> 3;
        if ((delta & 4) > 0) {
          diff += step;
        }
        if ((delta & 2) > 0) {
          diff += step >> 1;
        }
        if ((delta & 1) > 0) {
          diff += step >> 2;
        }
        if (sign > 0) {
          valuePredicted -= diff;
        } else {
          valuePredicted += diff;
        }
        /* Step 5 - clamp output value */
        if (valuePredicted > 32767) {
          valuePredicted = 32767;
        } else if (valuePredicted < -32768) {
          valuePredicted = -32768;
        }
        /* Step 6 - Update step value */
        step = this._MICROPHONE_STEP_SIZE_TABLE[index];
        /* Step 7 - Output value */
        pcm.setInt16(_out, valuePredicted, true);
      }
      return pcm;
    }
  }, {
    key: "_playDecodedAudio",
    value: function _playDecodedAudio(audio) {
      if (this._audioStack === undefined) {
        this._audioStack = [];
      }
      this._audioStack.push(audio);
      if (this._audioStack.length) {
        this._scheduleAudioBuffers();
      }
    }
  }, {
    key: "_scheduleAudioBuffers",
    value: function _scheduleAudioBuffers() {
      while (this._audioStack.length > 0) {
        var bufferTime = 0.01; // Buffer time in seconds before initial audio chunk is played
        var buffer = this._audioStack.shift();
        var channels = 1;
        var framecount = buffer.byteLength / 2;
        if (this._audioNextTime === undefined) {
          this._audioNextTime = 0;
        }
        var myArrayBuffer = this.audioCtx.createBuffer(channels, framecount, 16000);
        // This gives us the actual array that contains the data
        var nowBuffering = myArrayBuffer.getChannelData(0);
        for (var i = 0; i < buffer.byteLength / 2; i++) {
          nowBuffering[i] = buffer.getInt16(2 * i, true) / 32768.0;
        }
        var source = this.audioCtx.createBufferSource();
        source.buffer = myArrayBuffer;
        source.connect(this.audioCtx.destination);
        if (this._audioNextTime === 0) {
          this._audioNextTime = this.audioCtx.currentTime + bufferTime;
        }
        source.start(this._audioNextTime);
        this._audioNextTime += source.buffer.duration;
      }
    }
    //  ******  //

    /*  Battery service  */
    /**
     *  Gets the battery level of Thingy.
     *
     *  @return {Promise<Object | Error>} Returns battery level in percentage when promise is resolved or an error if rejected.
     *
     */

  }, {
    key: "getBatteryLevel",
    value: async function getBatteryLevel() {
      try {
        var receivedData = await this._readData(this.batteryCharacteristic);
        var level = receivedData.getUint8(0);

        return {
          value: level,
          unit: "%"
        };
      } catch (error) {
        return error;
      }
    }

    /**
     *  Enables battery level notifications.
     *
     *  @async
     *  @param {function} eventHandler - The callback function that is triggered on battery level change. Will receive a battery level object as argument.
     *  @param {boolean} enable - Enables notifications if true or disables them if set to false.
     *  @return {Promise<Error>} Returns a promise when resolved or a promise with an error on rejection
     *
       */

  }, {
    key: "batteryLevelEnable",
    value: async function batteryLevelEnable(eventHandler, enable) {
      if (enable) {
        this.batteryLevelEventListeners[0] = this._batteryLevelNotifyHandler.bind(this);
        this.batteryLevelEventListeners[1].push(eventHandler);
      } else {
        this.batteryLevelEventListeners[1].splice(this.batteryLevelEventListeners.indexOf([eventHandler]), 1);
      }

      return await this._notifyCharacteristic(this.batteryCharacteristic, enable, this.batteryLevelEventListeners[0]);
    }
  }, {
    key: "_batteryLevelNotifyHandler",
    value: function _batteryLevelNotifyHandler(event) {
      var data = event.target.value;
      var value = data.getUint8(0);

      this.batteryLevelEventListeners[1].forEach(function (eventHandler) {
        eventHandler({
          value: value,
          unit: "%"
        });
      });
    }
  }]);

  return Thingy;
}();

//  ******  //

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XHost = exports.XRating = exports.XThumbs = exports.PartThemeElement = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _partTheme = require('./libs/part-theme.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartThemeElement = exports.PartThemeElement = function (_PartThemeMixin) {
  _inherits(PartThemeElement, _PartThemeMixin);

  function PartThemeElement() {
    _classCallCheck(this, PartThemeElement);

    return _possibleConstructorReturn(this, (PartThemeElement.__proto__ || Object.getPrototypeOf(PartThemeElement)).apply(this, arguments));
  }

  _createClass(PartThemeElement, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      if (!this.shadowRoot) {
        var template = this.constructor.template;
        if (template) {
          if (!this.constructor._templateElement) {
            this.constructor._templateElement = document.createElement('template');
            this.constructor._templateElement.innerHTML = template;
          }
          this.attachShadow({ mode: 'open' });
          var dom = document.importNode(this.constructor._templateElement.content, true);
          this.shadowRoot.appendChild(dom);
        }
      }
      _get(PartThemeElement.prototype.__proto__ || Object.getPrototypeOf(PartThemeElement.prototype), 'connectedCallback', this).call(this);
    }
  }], [{
    key: 'template',
    get: function get() {
      return '';
    }
  }]);

  return PartThemeElement;
}((0, _partTheme.PartThemeMixin)(HTMLElement));

var XThumbs = exports.XThumbs = function (_PartThemeElement) {
  _inherits(XThumbs, _PartThemeElement);

  function XThumbs() {
    _classCallCheck(this, XThumbs);

    return _possibleConstructorReturn(this, (XThumbs.__proto__ || Object.getPrototypeOf(XThumbs)).apply(this, arguments));
  }

  _createClass(XThumbs, null, [{
    key: 'template',
    get: function get() {
      return '\n        <div part="thumb-up">\uD83D\uDC4D</div>\n        <div part="thumb-down">\uD83D\uDC4E</div>\n      ';
    }
  }]);

  return XThumbs;
}(PartThemeElement);

customElements.define('x-thumbs', XThumbs);

var XRating = exports.XRating = function (_PartThemeElement2) {
  _inherits(XRating, _PartThemeElement2);

  function XRating() {
    _classCallCheck(this, XRating);

    return _possibleConstructorReturn(this, (XRating.__proto__ || Object.getPrototypeOf(XRating)).apply(this, arguments));
  }

  _createClass(XRating, null, [{
    key: 'template',
    get: function get() {
      return '\n        <style>\n          :host {\n            display: inline-block;\n          }\n          x-thumbs::part(thumb-up) {\n            border: 1px dotted green;\n            padding: 4px;\n            min-width: 20px;\n            display: inline-block;\n            background: blue;\n          }\n          x-thumbs::part(thumb-down) {\n            border: 1px dotted red;\n            padding: 4px;\n            min-width: 20px;\n            display: inline-block;\n          }\n        </style>\n        <div part="subject"><slot></slot></div>\n        <x-thumbs part="* => rating-*"></x-thumbs>\n      ';
    }
  }]);

  return XRating;
}(PartThemeElement);

customElements.define('x-rating', XRating);

var XHost = exports.XHost = function (_PartThemeElement3) {
  _inherits(XHost, _PartThemeElement3);

  function XHost() {
    _classCallCheck(this, XHost);

    return _possibleConstructorReturn(this, (XHost.__proto__ || Object.getPrototypeOf(XHost)).apply(this, arguments));
  }

  _createClass(XHost, null, [{
    key: 'template',
    get: function get() {
      return '\n        <style>\n          :host {\n            display: block;\n            border: 2px solid orange;\n          }\n          x-rating {\n            margin: 4px;\n          }\n          x-rating::part(subject) {\n            padding: 4px;\n            min-width: 20px;\n            display: inline-block;\n          }\n          x-rating {\n            --e1-part-subject-padding: 4px;\n          }\n          .uno:hover::part(subject) {\n            background: lightgreen;\n          }\n          .duo::part(subject) {\n            background: goldenrod;\n          }\n          .uno::part(rating-thumb-up) {\n            background: green;\n          }\n          .uno::part(rating-thumb-down) {\n            background: tomato;\n          }\n          .duo::part(rating-thumb-up) {\n            background: yellow;\n          }\n          .duo::part(rating-thumb-down) {\n            background: black;\n          }\n          x-rating::theme(thumb-up) {\n            border-radius: 8px;\n          }\n\n        </style>\n        <x-rating class="uno">\u2764\uFE0F</x-rating>\n        <br>\n        <x-rating class="duo">\uD83E\uDD37</x-rating>\n      ';
    }
  }]);

  return XHost;
}(PartThemeElement);

customElements.define('x-host', XHost);

},{"./libs/part-theme.js":10}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.applyPartTheme = applyPartTheme;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

var partDataKey = '__cssParts';
var partIdKey = '__partId';

/**
 * Converts any style elements in the shadowRoot to replace ::part/::theme
 * with custom properties used to transmit this data down the dom tree. Also
 * caches part metadata for later lookup.
 * @param {Element} element
 */

function initializeParts(element) {
  if (!element.shadowRoot) {
    element[partDataKey] = null;
    return;
  }
  Array.from(element.shadowRoot.querySelectorAll('style')).forEach(function (style) {
    var info = partCssToCustomPropCss(element, style.textContent);
    if (info.parts) {
      var _element$partDataKey;

      element[partDataKey] = element[partDataKey] || [];
      (_element$partDataKey = element[partDataKey]).push.apply(_element$partDataKey, _toConsumableArray(info.parts));
      style.textContent = info.css;
    }
  });
}

function ensurePartData(element) {
  if (!element.hasOwnProperty('__cssParts')) {
    initializeParts(element);
  }
}

function partDataForElement(element) {
  ensurePartData(element);
  return element[partDataKey];
}

// TODO(sorvell): brittle due to regex-ing css. Instead use a css parser.
/**
 * Turns css using `::part` into css using variables for those parts.
 * Also returns part metadata.
 * @param {Element} element
 * @param {string} cssText
 * @returns {Object} css: partified css, parts: array of parts of the form
 * {name, selector, props}
 * Example of part-ified css, given:
 * .foo::part(bar) { color: red }
 * output:
 * .foo { --e1-part-bar-color: red; }
 * where `e1` is a guid for this element.
 */
function partCssToCustomPropCss(element, cssText) {
  var parts = void 0;
  var css = cssText.replace(cssRe, function (m, selector, type, name, endSelector, propsStr) {
    parts = parts || [];
    var props = {};
    var propsArray = propsStr.split(/\s*;\s*/);
    propsArray.forEach(function (prop) {
      var s = prop.split(':');
      var name = s.shift().trim();
      var value = s.join(':');
      props[name] = value;
    });
    var id = partIdForElement(element);
    parts.push({ selector: selector, endSelector: endSelector, name: name, props: props, isTheme: type == theme });
    var partProps = '';
    for (var p in props) {
      partProps = partProps + '\n\t' + varForPart(id, name, p, endSelector) + ': ' + props[p] + ';';
    }
    return '\n' + (selector || '*') + ' {\n\t' + partProps.trim() + '\n}';
  });
  return { parts: parts, css: css };
}

// guid for element part scopes
var partId = 0;
function partIdForElement(element) {
  if (element[partIdKey] == undefined) {
    element[partIdKey] = partId++;
  }
  return element[partIdKey];
}

var theme = '::theme';
var cssRe = /\s*(.*)(::(?:part|theme))\(([^)]+)\)([^\s{]*)\s*{\s*([^}]*)\s*}/g;

// creates a custom property name for a part.
function varForPart(id, name, prop, endSelector) {
  return '--e' + id + '-part-' + name + '-' + prop + (endSelector ? '-' + endSelector.replace(/\:/g, '') : '');
}

/**
 * Produces a style using css custom properties to style ::part/::theme
 * for all the dom in the element's shadowRoot.
 * @param {Element} element
 */
function applyPartTheme(element) {
  if (element.shadowRoot) {
    var oldStyle = element.shadowRoot.querySelector('style[parts]');
    if (oldStyle) {
      oldStyle.parentNode.removeChild(oldStyle);
    }
  }
  var host = element.getRootNode().host;
  if (host) {
    // note: ensure host has part data so that elements that boot up
    // while the host is being connected can style parts.
    ensurePartData(host);
    var css = cssForElementDom(element);
    if (css) {
      var newStyle = document.createElement('style');
      newStyle.textContent = css;
      element.shadowRoot.appendChild(newStyle);
    }
  }
}

/**
 * Produces cssText a style element to apply part css to a given element.
 * The element's shadowRoot dom is scanned for nodes with a `part` attribute.
 * Then selectors are created matching the part attribute containing properties
 * with parts defined in the element's host.
 * The ancestor tree is traversed for forwarded parts and theme.
 * e.g.
 * [part="bar"] {
 *   color: var(--e1-part-bar-color);
 * }
 * @param {Element} element Element for which to apply part css
 */
function cssForElementDom(element) {
  ensurePartData(element);
  var id = partIdForElement(element);
  var partNodes = element.shadowRoot.querySelectorAll('[part]');
  var css = '';
  for (var i = 0; i < partNodes.length; i++) {
    var attr = partNodes[i].getAttribute('part');
    var partInfo = partInfoFromAttr(attr);
    css = css + '\n\t' + ruleForPartInfo(partInfo, attr, element);
  }
  return css;
}

/**
 * Creates a css rule that applies a part.
 * @param {*} partInfo Array of part info from part attribute
 * @param {*} attr Part attribute
 * @param {*} element Element within which the part exists
 * @returns {string} Text of the css rule of the form `selector { properties }`
 */
function ruleForPartInfo(partInfo, attr, element) {
  var text = '';
  partInfo.forEach(function (info) {
    if (!info.forward) {
      var props = propsForPart(info.name, element);
      if (props) {
        for (var bucket in props) {
          var propsBucket = props[bucket];
          var partProps = [];
          for (var p in propsBucket) {
            partProps.push(p + ': ' + propsBucket[p] + ';');
          }
          text = text + '\n[part="' + attr + '"]' + bucket + ' {\n\t' + partProps.join('\n\t') + '\n}';
        }
      }
    }
  });
  return text;
}

/**
 * Parses a part attribute into an array of part info
 * @param {*} attr Part attribute value
 * @returns {array} Array of part info objects of the form {name, foward}
 */
function partInfoFromAttr(attr) {
  var pieces = attr ? attr.split(/\s*,\s*/) : [];
  var parts = [];
  pieces.forEach(function (p) {
    var m = p ? p.match(/([^=\s]*)(?:\s*=>\s*(.*))?/) : [];
    if (m) {
      parts.push({ name: m[2] || m[1], forward: m[2] ? m[1] : null });
    }
  });
  return parts;
}

/**
 * For a given part name returns a properties object which sets any ancestor
 * provided part properties to the proper ancestor provided css variable name.
 * e.g.
 * color: `var(--e1-part-bar-color);`
 * @param {string} name Name of part
 * @param {Element} element Element within which dom with part exists
 * @param {boolean} requireTheme True if only ::theme should be collected.
 * @returns {object} Object of properties for the given part set to part variables
 * provided by the elements ancestors.
 */
function propsForPart(name, element, requireTheme) {
  var host = element && element.getRootNode().host;
  if (!host) {
    return;
  }
  // collect props from host element.
  var props = propsFromElement(name, host, requireTheme);
  // now recurse ancestors to find matching `theme` properties
  var themeProps = propsForPart(name, host, true);
  props = mixPartProps(props, themeProps);
  // now recurse ancestors to find *forwarded* part properties
  if (!requireTheme) {
    // forwarding: recurses up ancestor tree!
    var partInfo = partInfoFromAttr(element.getAttribute('part'));
    // {name, forward} where `*` can be included
    partInfo.forEach(function (info) {
      var catchAll = info.forward && info.forward.indexOf('*') >= 0;
      if (name == info.forward || catchAll) {
        var ancestorName = catchAll ? info.name.replace('*', name) : info.name;
        var forwarded = propsForPart(ancestorName, host);
        props = mixPartProps(props, forwarded);
      }
    });
  }

  return props;
}

/**
 * Collects css for the given name from the part data for the given
 * element.
 *
 * @param {string} name Name of part
 * @param {Element} element Element with part css/data.
 * @param {Boolean} requireTheme True if should only match ::theme
 * @returns {object} Object of properties for the given part set to part variables
 * provided by the element.
 */
function propsFromElement(name, element, requireTheme) {
  var props = void 0;
  var parts = partDataForElement(element);
  if (parts) {
    var id = partIdForElement(element);
    if (parts) {
      parts.forEach(function (part) {
        if (part.name == name && (!requireTheme || part.isTheme)) {
          props = addPartProps(props, part, id, name);
        }
      });
    }
  }
  return props;
}

/**
 * Add part css to the props object for the given part/name.
 * @param {object} props Object containing part css
 * @param {object} part Part data
 * @param {nmber} id element part id
 * @param {string} name name of part
 */
function addPartProps(props, part, id, name) {
  props = props || {};
  var bucket = part.endSelector || '';
  var b = props[bucket] = props[bucket] || {};
  for (var p in part.props) {
    b[p] = 'var(' + varForPart(id, name, p, part.endSelector) + ')';
  }
  return props;
}

function mixPartProps(a, b) {
  if (a && b) {
    for (var i in b) {
      // ensure storage exists
      if (!a[i]) {
        a[i] = {};
      }
      Object.assign(a[i], b[i]);
    }
  }
  return a || b;
}

/**
 * CustomElement mixin that can be applied to provide ::part/::theme support.
 * @param {*} superClass
 */
var PartThemeMixin = exports.PartThemeMixin = function PartThemeMixin(superClass) {

  return function (_superClass) {
    _inherits(PartThemeClass, _superClass);

    function PartThemeClass() {
      _classCallCheck(this, PartThemeClass);

      return _possibleConstructorReturn(this, (PartThemeClass.__proto__ || Object.getPrototypeOf(PartThemeClass)).apply(this, arguments));
    }

    _createClass(PartThemeClass, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var _this2 = this;

        if (_get(PartThemeClass.prototype.__proto__ || Object.getPrototypeOf(PartThemeClass.prototype), 'connectedCallback', this)) {
          _get(PartThemeClass.prototype.__proto__ || Object.getPrototypeOf(PartThemeClass.prototype), 'connectedCallback', this).call(this);
        }
        requestAnimationFrame(function () {
          return _this2._applyPartTheme();
        });
      }
    }, {
      key: '_applyPartTheme',
      value: function _applyPartTheme() {
        applyPartTheme(this);
      }
    }]);

    return PartThemeClass;
  }(superClass);
};

},{}],11:[function(require,module,exports){
'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';

var _highlightEvent = require('./highlightEvent.js');

var _demos = require('./demos.js');

var _componentsSample = require('./partTheme/components-sample.js');

var _controlPrez = require('./controlPrez.js');

var _typedText = require('./typedText.js');

var _noise = require('./houdini/noise.js');

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

        CSS.registerProperty({
            name: '--cadre-corner-1',
            syntax: '<image> | none',
            initialValue: 'none'
        });
        CSS.registerProperty({
            name: '--cadre-corner-2',
            syntax: '<image> | none',
            initialValue: 'none'
        });
        CSS.registerProperty({
            name: '--cadre-corner-3',
            syntax: '<image> | none',
            initialValue: 'none'
        });
        CSS.registerProperty({
            name: '--cadre-corner-4',
            syntax: '<image> | none',
            initialValue: 'none'
        });
        CSS.registerProperty({
            name: '--cadre-color',
            syntax: '<color> | none',
            initialValue: 'white'
        });
        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/cadre-worklet.js');
        new _noise.Noise();
        // new TypeText();
        if (!inIframe) {
            new _demos.Demos();
            // new HighlightEvents();
            // new ControlPrez();
        } else {}
            // document.getElementById('magicVideo').style.display = 'none';


            /*Reveal.addEventListener('animate-houdini-workflow', () => {
                  document.getElementById('houdini_workflow-1').style.display = '';
                document.getElementById('houdini_workflow-2').style.display = 'none';
                Reveal.addEventListener('fragmentshown', callBackFragment);
                  function callBackFragment() {
                    document.getElementById('houdini_workflow-1').style.display = 'none';
                    document.getElementById('houdini_workflow-2').style.display = '';
                    Reveal.removeEventListener('fragmentshown', callBackFragment);
                }
            });
              Reveal.addEventListener('start-video-magic', () => {
                document.getElementById('magicVideo').src = './assets/images/magic.gif';
            });
              Reveal.addEventListener('start-video-sensor', () => {
                document.getElementById('sensorVideo').src = './assets/images/generic-sensor-api.gif';
            });*/
    }

    window.addEventListener('load', pageLoad);
})();

},{"./controlPrez.js":1,"./demos.js":2,"./highlightEvent.js":6,"./houdini/noise.js":7,"./partTheme/components-sample.js":9,"./typedText.js":12}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TypeText = exports.TypeText = function TypeText() {
	_classCallCheck(this, TypeText);

	Reveal.addEventListener('css-var-type', function () {
		typing('title-css-var', 10, 0).type('CSS Variables').wait(2000).speed(50).delete('Variables').wait(500).speed(100).type('Custom Properties');
	});
};

},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NvbnRyb2xQcmV6LmpzIiwic2NyaXB0cy9kZW1vcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlKcy5qcyIsInNjcmlwdHMvaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzL2hpZ2hsaWdodEV2ZW50LmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9saWJzL3RoaW5neS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzIiwic2NyaXB0cy9wYXJ0VGhlbWUvbGlicy9wYXJ0LXRoZW1lLmpzIiwic2NyaXB0cy9wcmV6LmpzIiwic2NyaXB0cy90eXBlZFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7Ozs7SUFJYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7O0FBQ1YsYUFBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUVBLGVBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXhDO0FBQ0g7Ozs7OENBRXFCO0FBQ2xCLGdCQUFJO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3RCO0FBQ0g7QUFDRCxvQkFBTSxTQUFTLG1CQUFXO0FBQ3RCLGdDQUFZO0FBRFUsaUJBQVgsQ0FBZjtBQUdBLHNCQUFNLE9BQU8sT0FBUCxFQUFOO0FBQ0EscUJBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLG9CQUFNLFVBQVUsTUFBTSxPQUFPLGVBQVAsRUFBdEI7QUFDQSxvQkFBTSxhQUFhLE1BQU0sYUFBYSxpQkFBYixFQUF6QjtBQUNBLG9CQUFJLGVBQWUsUUFBbkIsRUFBNkI7QUFDekIsNEJBQVEsR0FBUix5Q0FBa0QsUUFBUSxLQUExRDtBQUNILGlCQUZELE1BRU87QUFDSCw0QkFBUSxHQUFSLHlDQUFrRCxRQUFRLEtBQTFELEVBQW1FLE9BQW5FO0FBQ0Esd0JBQUksWUFBSixDQUFpQixtQkFBakIsRUFBc0M7QUFDbEMsdUVBQTZDLFFBQVEsS0FBckQ7QUFEa0MscUJBQXRDO0FBR0g7QUFDRCxvQkFBTSxRQUFRLE1BQU0sT0FBTyxZQUFQLENBQW9CLFVBQUMsS0FBRCxFQUFXO0FBQy9DLDRCQUFRLEdBQVIsQ0FBWSxLQUFaLEVBQW1CLEtBQW5CO0FBQ0Esd0JBQUksS0FBSixFQUFXO0FBQ1AsK0JBQU8sSUFBUDtBQUNIO0FBQ0osaUJBTG1CLEVBS2pCLElBTGlCLENBQXBCO0FBTUEsd0JBQVEsR0FBUixDQUFZLEtBQVo7QUFHSCxhQTVCRCxDQTRCRSxPQUFPLEtBQVAsRUFBYztBQUNaLHdCQUFRLEtBQVIsQ0FBYyxLQUFkO0FBQ0g7QUFDSjs7Ozs7OztBQzVDTDs7Ozs7Ozs7O0FBQ0E7O0FBR0E7O0FBR0E7Ozs7SUFFYSxLLFdBQUEsSztBQUVULHFCQUFjO0FBQUE7O0FBQ1YsWUFBSTs7QUFFQSxpQkFBSyxhQUFMO0FBQ0EsaUJBQUssS0FBTCxHQUFhLENBQWI7QUFFSCxTQUxELENBS0UsT0FBTyxLQUFQLEVBQWM7QUFDWixvQkFBUSxLQUFSLENBQWMsS0FBZDtBQUNIO0FBRUo7Ozs7d0NBRWU7QUFDWjtBQUNBOzs7QUFHQTtBQUNIOzs7MENBRWdCO0FBQ2IsZ0JBQUksS0FBSyxLQUFMLEtBQWUsQ0FBbkIsRUFBc0I7QUFDbEIscUJBQUssS0FBTCxHQUFhLENBQWI7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSyxLQUFMO0FBQ0g7QUFDRCxxQkFBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLEtBQWpDLENBQXVDLFdBQXZDLENBQW1ELFNBQW5ELEVBQThELEtBQUssS0FBbkU7QUFDQSxrQ0FBc0IsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXRCO0FBQ0g7Ozs7Ozs7O0FDdkNMOzs7Ozs7Ozs7O0lBRWEsUSxXQUFBLFE7O0FBRVQ7Ozs7O0FBS0Esc0JBQVksR0FBWixFQUFpQixjQUFqQixFQUFpQztBQUFBOztBQUFBOztBQUM3QixZQUFNLGdCQUFnQixXQUFXLEdBQVgsRUFBZ0I7QUFDbEMsbUJBQU8sY0FEMkI7QUFFbEMsa0JBQU0sS0FGNEI7QUFHbEMseUJBQWEsSUFIcUI7QUFJbEMseUJBQWEsSUFKcUI7QUFLbEMseUJBQWEsS0FMcUI7QUFNbEMscUNBQXlCLElBTlM7QUFPbEMsMEJBQWMsSUFQb0I7QUFRbEMsNEJBQWdCLE1BUmtCO0FBU2xDLG1CQUFPO0FBVDJCLFNBQWhCLENBQXRCOztBQVlBLFlBQU0sT0FBTyxTQUFTLElBQVQsSUFBaUIsU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUE5QjtBQUNBLGFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsQ0FBZDs7QUFFQSxhQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLFVBQWxCO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxVQUFmLEVBQTJCO0FBQ3ZCLGlCQUFLLEtBQUwsQ0FBVyxVQUFYLENBQXNCLE9BQXRCLEdBQWdDLEVBQWhDO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsU0FBUyxjQUFULENBQXdCLEVBQXhCLENBQXZCO0FBQ0g7QUFDRCxhQUFLLFdBQUwsQ0FBaUIsS0FBSyxLQUF0Qjs7QUFFQSxzQkFBYyxPQUFkLENBQXNCLE1BQXRCLEVBQThCLE1BQTlCO0FBQ0Esc0JBQWMsRUFBZCxDQUFpQixRQUFqQixFQUEyQixZQUFZO0FBQ25DLGtCQUFLLFFBQUwsQ0FBYyxjQUFjLFFBQWQsRUFBZDtBQUNILFNBRkQ7QUFHQSxhQUFLLFFBQUwsQ0FBYyxjQUFkO0FBQ0g7Ozs7aUNBRVEsSyxFQUFPO0FBQUE7O0FBQ1osaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ2xDLHFCQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLENBQTRCLENBQTVCO0FBQ0g7QUFDRCxpQkFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGtCQUFNLEtBQU4sQ0FBWSxHQUFaLEVBQ0ssR0FETCxDQUNTO0FBQUEsdUJBQU8sSUFBSSxJQUFKLEVBQVA7QUFBQSxhQURULEVBRUssT0FGTCxDQUVhLHVCQUFlO0FBQ3BCLG9CQUFJO0FBQ0EsMkJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBakIsQ0FBNEIsY0FBYyxHQUExQztBQUNBLDJCQUFLLE1BQUw7QUFDSCxpQkFIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1IsNEJBQVEsS0FBUixDQUFjLENBQWQ7QUFDSDtBQUNKLGFBVEw7QUFXSDs7Ozs7Ozs7QUN6REw7Ozs7Ozs7O0lBRWEsYzs7QUFFVDs7Ozs7O1FBRlMsYyxHQVFULHdCQUFZLEdBQVosRUFBaUIsSUFBakIsRUFBdUIsY0FBdkIsRUFBdUM7QUFBQTs7QUFDbkMsUUFBTSxlQUFlLFdBQVcsR0FBWCxFQUFnQjtBQUNqQyxlQUFPLGNBRDBCO0FBRWpDLGNBQU0sSUFGMkI7QUFHakMscUJBQWEsSUFIb0I7QUFJakMscUJBQWEsSUFKb0I7QUFLakMscUJBQWEsS0FMb0I7QUFNakMsa0JBQVUsSUFOdUI7QUFPakMsaUNBQXlCLElBUFE7QUFRakMsc0JBQWMsSUFSbUI7QUFTakMsd0JBQWdCLE1BVGlCO0FBVWpDLGVBQU87QUFWMEIsS0FBaEIsQ0FBckI7O0FBYUEsaUJBQWEsT0FBYixDQUFxQixNQUFyQixFQUE2QixNQUE3QjtBQUNILEM7OztBQ3pCTDs7Ozs7Ozs7OztBQUVBLElBQU0sVUFBVSxPQUFoQjtBQUNBLElBQU0sY0FBYyxRQUFwQjtBQUNBLElBQU0scUJBQXFCLE9BQTNCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLG1CLFdBQUEsbUI7QUFDVCx1Q0FHRztBQUFBLFlBRkMsTUFFRCxRQUZDLE1BRUQ7QUFBQSxZQURDLGFBQ0QsUUFEQyxhQUNEOztBQUFBOztBQUNDLGFBQUssV0FBTCxHQUFtQixTQUFTLGNBQVQsZ0JBQXFDLE1BQXJDLENBQW5CO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLGFBQXJCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLGVBQU8sZ0JBQVAsV0FBZ0MsTUFBaEMsRUFBMEMsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUExQztBQUNBLGVBQU8sZ0JBQVAsZ0JBQXFDLE1BQXJDLEVBQStDLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBL0M7QUFDSDs7OzswQ0FFaUIsSyxFQUFPO0FBQ3JCLGdCQUFJO0FBQ0Esb0JBQUksYUFBYSxJQUFqQjtBQUNBLG9CQUFJLE1BQU0sSUFBTixLQUFlLE1BQW5CLEVBQTJCO0FBQ3ZCLHdCQUFJLEtBQUssU0FBTCxJQUFrQixDQUF0QixFQUF5QjtBQUNyQixxQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxTQUF4QixDQUFiO0FBQ0g7QUFDSixpQkFKRCxNQUtBLElBQUksTUFBTSxJQUFOLEtBQWUsZUFBbkIsRUFBb0M7QUFDaEMsd0JBQU0sUUFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsaUNBQWEsS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQWI7QUFFSCxpQkFMRCxNQUtPO0FBQ0gsd0JBQU0sU0FBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLE1BQWpCO0FBQ0E7QUFDQSx3QkFBSSxTQUFRLENBQVosRUFBZTtBQUNYLHFDQUFhLEtBQUssYUFBTCxDQUFtQixTQUFRLENBQTNCLENBQWI7QUFDSDtBQUNKO0FBQ0Qsb0JBQU0sT0FBTyxhQUFhLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBYixHQUF1QyxFQUFwRDtBQUNBLG9CQUFNLE9BQU8sRUFBYjtBQUNBLG9CQUFNLFdBQVcsRUFBakI7QUFDQSxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsd0JBQU0sTUFBTSxLQUFLLENBQUwsQ0FBWjtBQUNBLDRCQUFRLElBQVI7QUFDSSw2QkFBSyxRQUFRLE1BQWI7QUFDQSw2QkFBSyxRQUFRLFNBQWI7QUFDQSw2QkFBSyxRQUFRLEtBQWI7QUFDQSw2QkFBSyxRQUFRLFFBQWI7QUFDQSw2QkFBSyxRQUFRLFdBQWI7QUFDQSw2QkFBSyxRQUFRLFlBQWI7QUFDSSxxQ0FBUyxHQUFULElBQWdCLFdBQVcsR0FBWCxDQUFoQjtBQUNBO0FBQ0osNkJBQUssUUFBUSxRQUFiO0FBQ0EsNkJBQUssUUFBUSxPQUFiO0FBQ0EsNkJBQUssUUFBUSxLQUFiO0FBQ0EsNkJBQUssUUFBUSxNQUFiO0FBQ0ksaUNBQUssR0FBTCxJQUFZLFdBQVcsR0FBWCxDQUFaO0FBQ0E7QUFDSjtBQWZKO0FBa0JIOztBQUVELG9CQUFJLFNBQVMsU0FBVCxLQUF1QixTQUEzQixFQUFzQztBQUNsQyw2QkFBUyxTQUFULEdBQXFCLE9BQXJCO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLE9BQVQsS0FBcUIsU0FBckIsSUFBa0MsS0FBSyxNQUFMLEtBQWdCLFNBQXRELEVBQWlFO0FBQzdELHlCQUFLLE1BQUwsR0FBYyxXQUFkO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLElBQVQsS0FBa0IsU0FBbEIsSUFBK0IsS0FBSyxHQUFMLEtBQWEsU0FBaEQsRUFBMkQ7QUFDdkQseUJBQUssR0FBTCxHQUFXLENBQVg7QUFDSDtBQUNELG9CQUFJLFNBQVMsTUFBVCxLQUFvQixTQUFwQixJQUFpQyxLQUFLLEtBQUwsS0FBZSxTQUFwRCxFQUErRDtBQUMzRCx5QkFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNIO0FBQ0Qsb0JBQUksU0FBUyxHQUFULEtBQWlCLFNBQWpCLElBQThCLEtBQUssSUFBTCxLQUFjLFNBQWhELEVBQTJEO0FBQ3ZELHlCQUFLLElBQUwsR0FBWSxDQUFaO0FBQ0g7QUFDRCxxQkFBSyxXQUFMLENBQWlCLElBQWpCLEdBQXdCLElBQXhCO0FBQ0EscUJBQUssV0FBTCxDQUFpQixRQUFqQixHQUE0QixRQUE1QjtBQUVILGFBL0RELENBK0RFLE9BQU8sQ0FBUCxFQUFVO0FBQ1Isd0JBQVEsS0FBUixDQUFjLENBQWQ7QUFDSDtBQUNKOzs7MkNBRWtCO0FBQ2YsaUJBQUssaUJBQUwsQ0FBdUI7QUFDbkIsc0JBQU0sTUFEYTtBQUVuQiwwQkFBVSxTQUFTLGFBQVQsQ0FBdUIsc0JBQXZCO0FBRlMsYUFBdkI7QUFJQSxtQkFBTyxnQkFBUCxDQUF3QixlQUF4QixFQUF5QyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXpDO0FBQ0EsbUJBQU8sZ0JBQVAsQ0FBd0IsZ0JBQXhCLEVBQTBDLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBMUM7QUFDSDs7OytDQUVzQjtBQUNuQixtQkFBTyxtQkFBUCxDQUEyQixlQUEzQixFQUE0QyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTVDO0FBQ0EsbUJBQU8sbUJBQVAsQ0FBMkIsZ0JBQTNCLEVBQTZDLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBN0M7QUFDSDs7Ozs7OztBQ3JHTDs7Ozs7OztBQUVBOzs7O0FBSUEsSUFBTSxjQUFjLElBQXBCO0FBQ0EsSUFBTSxvQkFBb0IsR0FBMUI7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRWEsZSxXQUFBLGUsR0FDVCwyQkFBYztBQUFBOztBQUNWO0FBQ0EsaURBQXdCO0FBQ3BCLGdCQUFRLGNBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWTtBQUhLLEtBQXhCOztBQWtCQTtBQUNBLGlEQUF3QjtBQUNwQixnQkFBUSxvQkFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixpQkFBSyxPQURPO0FBRVosb0JBQVEsT0FGSTtBQUdaLG1CQUFPO0FBSEssU0FBRCxFQUlaO0FBQ0MsaUJBQUssT0FETjtBQUVDLG9CQUFRLE9BRlQ7QUFHQyxtQkFBTztBQUhSLFNBSlksRUFRWjtBQUNDLGlCQUFLLENBRE47QUFFQyxvQkFBUSxNQUZUO0FBR0MsbUJBQU87QUFIUixTQVJZO0FBSEssS0FBeEI7O0FBa0JBO0FBQ0EsaURBQXdCO0FBQ3BCLGdCQUFRLE1BRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osaUJBQUssQ0FETztBQUVaLG9CQUFRLE1BRkk7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZO0FBSEssS0FBeEI7O0FBY0E7QUFDQSxpREFBd0I7QUFDcEIsZ0JBQVEsd0JBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxpQkFBSyxDQUROO0FBRUMsb0JBQVEsTUFGVDtBQUdDLG1CQUFPO0FBSFIsU0FSWTtBQUhLLEtBQXhCOztBQWtCQTtBQUNBLGlEQUF3QjtBQUNwQixnQkFBUSxhQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxFQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0MsaUJBQUssQ0FETjtBQUVDLG9CQUFRLE1BRlQ7QUFHQyxtQkFBTztBQUhSLFNBUlk7QUFISyxLQUF4Qjs7QUFrQkE7QUFDQSxpREFBd0I7QUFDcEIsZ0JBQVEsV0FEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLG1CQUFPO0FBSEssU0FBRCxFQUlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBSlksRUFRWjtBQUNDLGtCQUFNLEVBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVJZO0FBSEssS0FBeEI7O0FBbUJBO0FBQ0EsaURBQXdCO0FBQ3BCLGdCQUFRLGdCQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBUlksRUFZWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVpZO0FBSEssS0FBeEI7O0FBc0JBO0FBQ0EsaURBQXdCO0FBQ3BCLGdCQUFRLHNCQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLGtCQUFNLE1BSFA7QUFJQyxtQkFBTztBQUpSLFNBSlksRUFTWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxrQkFBTSxNQUZQO0FBR0MscUJBQVMsQ0FIVjtBQUlDLG1CQUFPO0FBSlIsU0FUWSxFQWNaO0FBQ0Msa0JBQU0sRUFEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxrQkFBTSxNQUhQO0FBSUMsbUJBQU87QUFKUixTQWRZO0FBSEssS0FBeEI7QUF5QkgsQzs7Ozs7Ozs7Ozs7OztJQzVLUSxLLFdBQUEsSztBQUNaLHFCQUFhO0FBQUE7O0FBQ1osYUFBSyxNQUFMO0FBQ0EsYUFBSyxHQUFMO0FBQ0EsYUFBSyxNQUFMO0FBQ0EsYUFBSyxPQUFMO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsYUFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNBLGFBQUssV0FBTDs7QUFFQSxhQUFLLElBQUw7QUFDQTs7QUFFRDs7Ozs7c0NBQ2lCO0FBQ1YsZ0JBQU0sUUFBUSxLQUFLLEdBQUwsQ0FBUyxlQUFULENBQXlCLEtBQUssTUFBOUIsRUFBc0MsS0FBSyxPQUEzQyxDQUFkO0FBQ0EsZ0JBQU0sV0FBVyxJQUFJLFdBQUosQ0FBZ0IsTUFBTSxJQUFOLENBQVcsTUFBM0IsQ0FBakI7QUFDQSxnQkFBTSxNQUFNLFNBQVMsTUFBckI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxHQUFwQixFQUF5QixHQUF6QixFQUE4QjtBQUMxQixvQkFBSSxLQUFLLE1BQUwsS0FBZ0IsR0FBcEIsRUFBeUI7QUFDckIsNkJBQVMsQ0FBVCxJQUFjLFVBQWQ7QUFDSDtBQUNKOztBQUVELGlCQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLEtBQXBCO0FBQ0g7Ozs7O0FBR0Q7cUNBQ2E7QUFDVCxnQkFBSSxLQUFLLEtBQUwsS0FBZSxDQUFuQixFQUFzQjtBQUNsQixxQkFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLLEtBQUw7QUFDSDs7QUFFRCxpQkFBSyxHQUFMLENBQVMsWUFBVCxDQUFzQixLQUFLLFNBQUwsQ0FBZSxLQUFLLEtBQXBCLENBQXRCLEVBQWtELENBQWxELEVBQXFELENBQXJEO0FBQ0g7Ozs7O0FBR0Q7K0JBQ087QUFBQTs7QUFDSCxpQkFBSyxVQUFMLENBQWdCLEtBQUssS0FBckI7O0FBRUEsaUJBQUssV0FBTCxHQUFtQixPQUFPLFVBQVAsQ0FBa0IsWUFBTTtBQUN2Qyx1QkFBTyxxQkFBUCxDQUE2QixNQUFLLElBQUwsQ0FBVSxJQUFWLE9BQTdCO0FBQ0gsYUFGa0IsRUFFZixPQUFPLEVBRlEsQ0FBbkI7QUFHSDs7Ozs7QUFHRDtnQ0FDUTtBQUNKLGlCQUFLLE1BQUwsR0FBYyxPQUFPLFVBQXJCO0FBQ0EsaUJBQUssT0FBTCxHQUFlLE9BQU8sV0FBdEI7O0FBRUEsaUJBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxNQUF6QjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssT0FBMUI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFwQixFQUF3QixHQUF4QixFQUE2QjtBQUN6QixxQkFBSyxXQUFMO0FBQ0g7O0FBRUQsaUJBQUssSUFBTDtBQUNIOzs7OztBQUdEOytCQUNPO0FBQ0gsaUJBQUssTUFBTCxHQUFjLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFkO0FBQ0EsaUJBQUssR0FBTCxHQUFXLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBWDs7QUFFQSxpQkFBSyxLQUFMO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6RUw7SUFDYSxNLFdBQUEsTTtBQUNYOzs7Ozs7Ozs7O0FBVUEsb0JBQTJDO0FBQUEsUUFBL0IsT0FBK0IsdUVBQXJCLEVBQUMsWUFBWSxLQUFiLEVBQXFCOztBQUFBOztBQUN6QyxTQUFLLFVBQUwsR0FBa0IsUUFBUSxVQUExQjs7QUFFQTtBQUNBLFNBQUssUUFBTCxHQUFnQixzQ0FBaEI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsc0NBQXJCO0FBQ0EsU0FBSyxtQkFBTCxHQUEyQixzQ0FBM0I7QUFDQSxTQUFLLG9CQUFMLEdBQTRCLHNDQUE1QjtBQUNBLFNBQUssa0JBQUwsR0FBMEIsc0NBQTFCO0FBQ0EsU0FBSyxvQkFBTCxHQUE0QixzQ0FBNUI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsc0NBQXZCO0FBQ0EsU0FBSyxvQkFBTCxHQUE0QixzQ0FBNUI7O0FBRUE7QUFDQSxTQUFLLFFBQUwsR0FBZ0Isc0NBQWhCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLHNDQUFyQjtBQUNBLFNBQUssaUJBQUwsR0FBeUIsc0NBQXpCO0FBQ0EsU0FBSyxpQkFBTCxHQUF5QixzQ0FBekI7QUFDQSxTQUFLLFlBQUwsR0FBb0Isc0NBQXBCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLHNDQUF0QjtBQUNBLFNBQUssZUFBTCxHQUF1QixzQ0FBdkI7O0FBRUE7QUFDQSxTQUFLLFNBQUwsR0FBaUIsc0NBQWpCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLHNDQUFyQjtBQUNBLFNBQUssYUFBTCxHQUFxQixzQ0FBckI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsc0NBQXJCOztBQUVBO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLHNDQUFoQjtBQUNBLFNBQUssZUFBTCxHQUF1QixzQ0FBdkI7QUFDQSxTQUFLLFlBQUwsR0FBb0Isc0NBQXBCO0FBQ0EsU0FBSyxvQkFBTCxHQUE0QixzQ0FBNUI7QUFDQSxTQUFLLG1CQUFMLEdBQTJCLHNDQUEzQjtBQUNBLFNBQUssYUFBTCxHQUFxQixzQ0FBckI7QUFDQSxTQUFLLFlBQUwsR0FBb0Isc0NBQXBCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLHNDQUF0QjtBQUNBLFNBQUssbUJBQUwsR0FBMkIsc0NBQTNCO0FBQ0EsU0FBSyxnQkFBTCxHQUF3QixzQ0FBeEI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLHNDQUF4Qjs7QUFFQTtBQUNBLFNBQUssUUFBTCxHQUFnQixzQ0FBaEI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsc0NBQXZCO0FBQ0EsU0FBSyxxQkFBTCxHQUE2QixzQ0FBN0I7QUFDQSxTQUFLLHFCQUFMLEdBQTZCLHNDQUE3QjtBQUNBLFNBQUssWUFBTCxHQUFvQixzQ0FBcEI7O0FBRUEsU0FBSyxZQUFMLEdBQW9CLENBQ2xCLGlCQURrQixFQUVsQixLQUFLLFFBRmEsRUFHbEIsS0FBSyxRQUhhLEVBSWxCLEtBQUssU0FKYSxFQUtsQixLQUFLLFFBTGEsRUFNbEIsS0FBSyxRQU5hLENBQXBCOztBQVNBLFNBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLFNBQUssTUFBTDtBQUNBLFNBQUssMEJBQUwsR0FBa0MsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFsQztBQUNBLFNBQUssa0JBQUwsR0FBMEIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUExQjtBQUNBLFNBQUssc0JBQUwsR0FBOEIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUE5QjtBQUNBLFNBQUssc0JBQUwsR0FBOEIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUE5QjtBQUNBLFNBQUssaUJBQUwsR0FBeUIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUF6QjtBQUNBLFNBQUssbUJBQUwsR0FBMkIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUEzQjtBQUNBLFNBQUssb0JBQUwsR0FBNEIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUE1QjtBQUNBLFNBQUssaUJBQUwsR0FBeUIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUF6QjtBQUNBLFNBQUsseUJBQUwsR0FBaUMsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFqQztBQUNBLFNBQUssd0JBQUwsR0FBZ0MsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFoQztBQUNBLFNBQUssa0JBQUwsR0FBMEIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUExQjtBQUNBLFNBQUssdUJBQUwsR0FBK0IsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUEvQjtBQUNBLFNBQUssbUJBQUwsR0FBMkIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUEzQjtBQUNBLFNBQUssNEJBQUwsR0FBb0MsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFwQztBQUNBLFNBQUsscUJBQUwsR0FBNkIsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUE3QjtBQUNBLFNBQUssMkJBQUwsR0FBbUMsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFuQztBQUNBLFNBQUssMkJBQUwsR0FBbUMsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFuQztBQUNBLFNBQUssd0JBQUwsR0FBZ0MsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFoQztBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7b0NBWWdCLGMsRUFBZ0I7QUFDOUIsVUFBSSxDQUFDLEtBQUssU0FBVixFQUFxQjtBQUNuQixZQUFJO0FBQ0YsZUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsY0FBTSxZQUFZLE1BQU0sZUFBZSxTQUFmLEVBQXhCO0FBQ0EsZUFBSyxTQUFMLEdBQWlCLEtBQWpCOztBQUVBLGlCQUFPLFNBQVA7QUFDRCxTQU5ELENBTUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxpQkFBTyxLQUFQO0FBQ0Q7QUFDRixPQVZELE1BVU87QUFDTCxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGdDQUFWLENBQWYsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O3FDQWNpQixjLEVBQWdCLFMsRUFBVztBQUMxQyxVQUFJLENBQUMsS0FBSyxTQUFWLEVBQXFCO0FBQ25CLFlBQUk7QUFDRixlQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxnQkFBTSxlQUFlLFVBQWYsQ0FBMEIsU0FBMUIsQ0FBTjtBQUNBLGVBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNELFNBSkQsQ0FJRSxPQUFPLEtBQVAsRUFBYztBQUNkLGlCQUFPLEtBQVA7QUFDRDtBQUNELGVBQU8sUUFBUSxPQUFSLEVBQVA7QUFDRCxPQVRELE1BU087QUFDTCxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGdDQUFWLENBQWYsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O29DQVFnQjtBQUNkLFVBQUk7QUFDRjtBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsc0RBQStELEtBQUssUUFBcEU7QUFDRDs7QUFFRCxhQUFLLE1BQUwsR0FBYyxNQUFNLFVBQVUsU0FBVixDQUFvQixhQUFwQixDQUFrQztBQUNwRCxtQkFBUyxDQUNQO0FBQ0Usc0JBQVUsQ0FBQyxLQUFLLFFBQU47QUFEWixXQURPLENBRDJDO0FBTXBELDRCQUFrQixLQUFLO0FBTjZCLFNBQWxDLENBQXBCO0FBUUEsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsa0JBQVEsR0FBUiwyQkFBbUMsS0FBSyxNQUFMLENBQVksSUFBL0M7QUFDRDs7QUFFRDtBQUNBLFlBQU0sU0FBUyxNQUFNLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsT0FBakIsRUFBckI7QUFDQSxZQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixrQkFBUSxHQUFSLHFCQUE2QixLQUFLLE1BQUwsQ0FBWSxJQUF6QztBQUNEOztBQUVEO0FBQ0EsWUFBTSxpQkFBaUIsTUFBTSxPQUFPLGlCQUFQLENBQXlCLGlCQUF6QixDQUE3QjtBQUNBLGFBQUsscUJBQUwsR0FBNkIsTUFBTSxlQUFlLGlCQUFmLENBQWlDLGVBQWpDLENBQW5DO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsa0JBQVEsR0FBUixDQUFZLDZEQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFLLG9CQUFMLEdBQTRCLE1BQU0sT0FBTyxpQkFBUCxDQUF5QixLQUFLLFFBQTlCLENBQWxDO0FBQ0EsYUFBSyxrQkFBTCxHQUEwQixNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssYUFBakQsQ0FBaEM7QUFDQSxhQUFLLHVCQUFMLEdBQStCLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxtQkFBakQsQ0FBckM7QUFDQSxhQUFLLHdCQUFMLEdBQWdDLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxvQkFBakQsQ0FBdEM7QUFDQSxhQUFLLHdCQUFMLEdBQWdDLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxvQkFBakQsQ0FBdEM7QUFDQSxhQUFLLHVCQUFMLEdBQStCLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxrQkFBakQsQ0FBckM7QUFDQSxhQUFLLDZCQUFMLEdBQXFDLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxlQUFqRCxDQUEzQztBQUNBLGFBQUssd0JBQUwsR0FBZ0MsTUFBTSxLQUFLLG9CQUFMLENBQTBCLGlCQUExQixDQUE0QyxLQUFLLG9CQUFqRCxDQUF0QztBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsQ0FBWSxpRUFBWjtBQUNEOztBQUVEO0FBQ0EsYUFBSyxrQkFBTCxHQUEwQixNQUFNLE9BQU8saUJBQVAsQ0FBeUIsS0FBSyxRQUE5QixDQUFoQztBQUNBLGFBQUsseUJBQUwsR0FBaUMsTUFBTSxLQUFLLGtCQUFMLENBQXdCLGlCQUF4QixDQUEwQyxLQUFLLGFBQS9DLENBQXZDO0FBQ0EsYUFBSyxtQkFBTCxHQUEyQixNQUFNLEtBQUssa0JBQUwsQ0FBd0IsaUJBQXhCLENBQTBDLEtBQUssY0FBL0MsQ0FBakM7QUFDQSxhQUFLLGlCQUFMLEdBQXlCLE1BQU0sS0FBSyxrQkFBTCxDQUF3QixpQkFBeEIsQ0FBMEMsS0FBSyxZQUEvQyxDQUEvQjtBQUNBLGFBQUssc0JBQUwsR0FBOEIsTUFBTSxLQUFLLGtCQUFMLENBQXdCLGlCQUF4QixDQUEwQyxLQUFLLGlCQUEvQyxDQUFwQztBQUNBLGFBQUssc0JBQUwsR0FBOEIsTUFBTSxLQUFLLGtCQUFMLENBQXdCLGlCQUF4QixDQUEwQyxLQUFLLGlCQUEvQyxDQUFwQztBQUNBLGFBQUssK0JBQUwsR0FBdUMsTUFBTSxLQUFLLGtCQUFMLENBQXdCLGlCQUF4QixDQUEwQyxLQUFLLGVBQS9DLENBQTdDO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsa0JBQVEsR0FBUixDQUFZLCtEQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFLLG9CQUFMLEdBQTRCLE1BQU0sT0FBTyxpQkFBUCxDQUF5QixLQUFLLFNBQTlCLENBQWxDO0FBQ0EsYUFBSyxvQkFBTCxHQUE0QixNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssYUFBakQsQ0FBbEM7QUFDQSxhQUFLLGlCQUFMLEdBQXlCLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxhQUFqRCxDQUEvQjtBQUNBLGFBQUsseUJBQUwsR0FBaUMsTUFBTSxLQUFLLG9CQUFMLENBQTBCLGlCQUExQixDQUE0QyxLQUFLLGFBQWpELENBQXZDO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsa0JBQVEsR0FBUixDQUFZLGtFQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFLLGFBQUwsR0FBcUIsTUFBTSxPQUFPLGlCQUFQLENBQXlCLEtBQUssUUFBOUIsQ0FBM0I7QUFDQSxhQUFLLHVCQUFMLEdBQStCLE1BQU0sS0FBSyxhQUFMLENBQW1CLGlCQUFuQixDQUFxQyxLQUFLLGVBQTFDLENBQXJDO0FBQ0EsYUFBSyxtQkFBTCxHQUEyQixNQUFNLEtBQUssYUFBTCxDQUFtQixpQkFBbkIsQ0FBcUMsS0FBSyxjQUExQyxDQUFqQztBQUNBLGFBQUssMkJBQUwsR0FBbUMsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssZ0JBQTFDLENBQXpDO0FBQ0EsYUFBSyxxQkFBTCxHQUE2QixNQUFNLEtBQUssYUFBTCxDQUFtQixpQkFBbkIsQ0FBcUMsS0FBSyxnQkFBMUMsQ0FBbkM7QUFDQSxhQUFLLHlCQUFMLEdBQWlDLE1BQU0sS0FBSyxhQUFMLENBQW1CLGlCQUFuQixDQUFxQyxLQUFLLG9CQUExQyxDQUF2QztBQUNBLGFBQUssd0JBQUwsR0FBZ0MsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssbUJBQTFDLENBQXRDO0FBQ0EsYUFBSyx1QkFBTCxHQUErQixNQUFNLEtBQUssYUFBTCxDQUFtQixpQkFBbkIsQ0FBcUMsS0FBSyxZQUExQyxDQUFyQztBQUNBLGFBQUssNEJBQUwsR0FBb0MsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssbUJBQTFDLENBQTFDO0FBQ0EsYUFBSyxrQkFBTCxHQUEwQixNQUFNLEtBQUssYUFBTCxDQUFtQixpQkFBbkIsQ0FBcUMsS0FBSyxhQUExQyxDQUFoQztBQUNBLGFBQUssaUJBQUwsR0FBeUIsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssWUFBMUMsQ0FBL0I7QUFDQSxZQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixrQkFBUSxHQUFSLENBQVksMERBQVo7QUFDRDs7QUFFRDtBQUNBLGFBQUssWUFBTCxHQUFvQixNQUFNLE9BQU8saUJBQVAsQ0FBeUIsS0FBSyxRQUE5QixDQUExQjtBQUNBLGFBQUssdUJBQUwsR0FBK0IsTUFBTSxLQUFLLFlBQUwsQ0FBa0IsaUJBQWxCLENBQW9DLEtBQUssZUFBekMsQ0FBckM7QUFDQSxhQUFLLHdCQUFMLEdBQWdDLE1BQU0sS0FBSyxZQUFMLENBQWtCLGlCQUFsQixDQUFvQyxLQUFLLFlBQXpDLENBQXRDO0FBQ0EsYUFBSyx5QkFBTCxHQUFpQyxNQUFNLEtBQUssWUFBTCxDQUFrQixpQkFBbEIsQ0FBb0MsS0FBSyxxQkFBekMsQ0FBdkM7QUFDQSxhQUFLLDJCQUFMLEdBQW1DLE1BQU0sS0FBSyxZQUFMLENBQWtCLGlCQUFsQixDQUFvQyxLQUFLLHFCQUF6QyxDQUF6QztBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsQ0FBWSx5REFBWjtBQUNEO0FBQ0YsT0ExRkQsQ0EwRkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7dUNBTW1CO0FBQ2pCLFVBQUk7QUFDRixjQUFNLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsVUFBakIsRUFBTjtBQUNELE9BRkQsQ0FFRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Z0RBQzRCLGMsRUFBZ0IsTSxFQUFRLGEsRUFBZTtBQUNqRSxVQUFJLE1BQUosRUFBWTtBQUNWLFlBQUk7QUFDRixnQkFBTSxlQUFlLGtCQUFmLEVBQU47QUFDQSxjQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixvQkFBUSxHQUFSLENBQVksK0JBQStCLGVBQWUsSUFBMUQ7QUFDRDtBQUNELHlCQUFlLGdCQUFmLENBQWdDLDRCQUFoQyxFQUE4RCxhQUE5RDtBQUNELFNBTkQsQ0FNRSxPQUFPLEtBQVAsRUFBYztBQUNkLGlCQUFPLEtBQVA7QUFDRDtBQUNGLE9BVkQsTUFVTztBQUNMLFlBQUk7QUFDRixnQkFBTSxlQUFlLGlCQUFmLEVBQU47QUFDQSxjQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixvQkFBUSxHQUFSLENBQVksNkJBQVosRUFBMkMsZUFBZSxJQUExRDtBQUNEO0FBQ0QseUJBQWUsbUJBQWYsQ0FBbUMsNEJBQW5DLEVBQWlFLGFBQWpFO0FBQ0QsU0FORCxDQU1FLE9BQU8sS0FBUCxFQUFjO0FBQ2QsaUJBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBOzs7Ozs7Ozs7O29DQU9nQjtBQUNkLFVBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLGtCQUFwQixDQUFuQjtBQUNBLFlBQU0sVUFBVSxJQUFJLFdBQUosQ0FBZ0IsT0FBaEIsQ0FBaEI7QUFDQSxZQUFNLE9BQU8sUUFBUSxNQUFSLENBQWUsSUFBZixDQUFiO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsa0JBQVEsR0FBUixDQUFZLDJCQUEyQixJQUF2QztBQUNEO0FBQ0QsZUFBTyxJQUFQO0FBQ0QsT0FSRCxDQVFFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7a0NBUWMsSSxFQUFNO0FBQ2xCLFVBQUksS0FBSyxNQUFMLEdBQWMsRUFBbEIsRUFBc0I7QUFDcEIsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFNBQUosQ0FBYyxpREFBZCxDQUFmLENBQVA7QUFDRDtBQUNELFVBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxLQUFLLE1BQXBCLENBQWxCO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsS0FBSyxDQUF0QyxFQUF5QztBQUN2QyxrQkFBVSxDQUFWLElBQWUsS0FBSyxVQUFMLENBQWdCLENBQWhCLENBQWY7QUFDRDtBQUNELGFBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxrQkFBckIsRUFBeUMsU0FBekMsQ0FBYjtBQUNEOztBQUVEOzs7Ozs7Ozs7eUNBTXFCO0FBQ25CLFVBQUk7QUFDRixZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHVCQUFwQixDQUEzQjs7QUFFQTtBQUNBLFlBQU0sZUFBZSxJQUFyQjtBQUNBLFlBQU0sV0FBVyxDQUFDLGFBQWEsU0FBYixDQUF1QixDQUF2QixFQUEwQixZQUExQixJQUEwQyxLQUEzQyxFQUFrRCxPQUFsRCxDQUEwRCxDQUExRCxDQUFqQjtBQUNBLFlBQU0sVUFBVSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBaEI7QUFDQSxZQUFNLFNBQVM7QUFDYixvQkFBVTtBQUNSLHNCQUFVLFFBREY7QUFFUixrQkFBTTtBQUZFLFdBREc7QUFLYixtQkFBUztBQUNQLHFCQUFTLE9BREY7QUFFUCxrQkFBTTtBQUZDO0FBTEksU0FBZjtBQVVBLGVBQU8sTUFBUDtBQUNELE9BbEJELENBa0JFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7Ozt1Q0FVbUIsTSxFQUFRO0FBQ3pCLFVBQUksUUFBTyxNQUFQLHlDQUFPLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEIsT0FBTyxRQUFQLEtBQW9CLFNBQWxELElBQStELE9BQU8sT0FBUCxLQUFtQixTQUF0RixFQUFpRztBQUMvRixlQUFPLFFBQVEsTUFBUixDQUNMLElBQUksU0FBSixDQUFjLCtIQUFkLENBREssQ0FBUDtBQUdEOztBQUVEO0FBQ0EsVUFBTSxXQUFXLE9BQU8sUUFBUCxHQUFrQixHQUFuQztBQUNBLFVBQU0sVUFBVSxPQUFPLE9BQXZCOztBQUVBO0FBQ0EsVUFBSSxXQUFXLEVBQVgsSUFBaUIsV0FBVyxJQUFoQyxFQUFzQztBQUNwQyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLHdFQUFmLENBQWYsQ0FBUDtBQUNEO0FBQ0QsVUFBSSxVQUFVLENBQVYsSUFBZSxVQUFVLEdBQTdCLEVBQWtDO0FBQ2hDLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsZ0VBQWYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsVUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7QUFDQSxnQkFBVSxDQUFWLElBQWUsV0FBVyxJQUExQjtBQUNBLGdCQUFVLENBQVYsSUFBZ0IsWUFBWSxDQUFiLEdBQWtCLElBQWpDO0FBQ0EsZ0JBQVUsQ0FBVixJQUFlLE9BQWY7O0FBRUEsYUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHVCQUFyQixFQUE4QyxTQUE5QyxDQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7MENBT3NCO0FBQ3BCLFVBQUk7QUFDRixZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHdCQUFwQixDQUEzQjs7QUFFQTtBQUNBLFlBQU0sZUFBZSxJQUFyQjtBQUNBLFlBQU0sa0JBQWtCLGFBQWEsU0FBYixDQUF1QixDQUF2QixFQUEwQixZQUExQixJQUEwQyxJQUFsRTtBQUNBLFlBQU0sa0JBQWtCLGFBQWEsU0FBYixDQUF1QixDQUF2QixFQUEwQixZQUExQixJQUEwQyxJQUFsRTtBQUNBLFlBQU0sZUFBZSxhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsQ0FBckI7O0FBRUE7QUFDQSxZQUFNLHFCQUFxQixhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsSUFBMEMsRUFBckU7QUFDQSxZQUFNLFNBQVM7QUFDYiw4QkFBb0I7QUFDbEIsaUJBQUssZUFEYTtBQUVsQixpQkFBSyxlQUZhO0FBR2xCLGtCQUFNO0FBSFksV0FEUDtBQU1iLHdCQUFjO0FBQ1osbUJBQU8sWUFESztBQUVaLGtCQUFNO0FBRk0sV0FORDtBQVViLDhCQUFvQjtBQUNsQixxQkFBUyxrQkFEUztBQUVsQixrQkFBTTtBQUZZO0FBVlAsU0FBZjtBQWVBLGVBQU8sTUFBUDtBQUNELE9BM0JELENBMkJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OzswQ0FVc0IsTSxFQUFRO0FBQzVCLFVBQUksUUFBTyxNQUFQLHlDQUFPLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEIsT0FBTyxXQUFQLEtBQXVCLFNBQXJELElBQWtFLE9BQU8sV0FBUCxLQUF1QixTQUE3RixFQUF3RztBQUN0RyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksU0FBSixDQUFjLDRFQUFkLENBQWYsQ0FBUDtBQUNEOztBQUVELFVBQUksY0FBYyxPQUFPLFdBQXpCO0FBQ0EsVUFBSSxjQUFjLE9BQU8sV0FBekI7O0FBRUEsVUFBSSxnQkFBZ0IsSUFBaEIsSUFBd0IsZ0JBQWdCLElBQTVDLEVBQWtEO0FBQ2hELGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxTQUFKLENBQWMsMEVBQWQsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJLGNBQWMsR0FBZCxJQUFxQixjQUFjLFdBQXZDLEVBQW9EO0FBQ2xELGVBQU8sUUFBUSxNQUFSLENBQ0wsSUFBSSxVQUFKLENBQWUscUZBQWYsQ0FESyxDQUFQO0FBR0Q7QUFDRCxVQUFJLGNBQWMsSUFBZCxJQUFzQixjQUFjLFdBQXhDLEVBQXFEO0FBQ25ELGVBQU8sUUFBUSxNQUFSLENBQ0wsSUFBSSxVQUFKLENBQWUsb0ZBQWYsQ0FESyxDQUFQO0FBR0Q7O0FBRUQsVUFBSTtBQUNGLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssd0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7O0FBRUE7QUFDQSxzQkFBYyxLQUFLLEtBQUwsQ0FBVyxjQUFjLEdBQXpCLENBQWQ7QUFDQSxzQkFBYyxLQUFLLEtBQUwsQ0FBVyxjQUFjLEdBQXpCLENBQWQ7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLGNBQWMsSUFBN0I7QUFDQSxrQkFBVSxDQUFWLElBQWdCLGVBQWUsQ0FBaEIsR0FBcUIsSUFBcEM7QUFDQSxrQkFBVSxDQUFWLElBQWUsY0FBYyxJQUE3QjtBQUNBLGtCQUFVLENBQVYsSUFBZ0IsZUFBZSxDQUFoQixHQUFxQixJQUFwQzs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssd0JBQXJCLEVBQStDLFNBQS9DLENBQWI7QUFDRCxPQWxCRCxDQWtCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsOENBQThDLEtBQXhELENBQWYsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7OzhDQVEwQixZLEVBQWM7QUFDdEM7QUFDQSxVQUFJLGVBQWUsQ0FBZixJQUFvQixlQUFlLEdBQXZDLEVBQTRDO0FBQzFDLGVBQU8sUUFBUSxNQUFSLENBQ0wsSUFBSSxVQUFKLENBQWUsNEVBQWYsQ0FESyxDQUFQO0FBR0Q7O0FBRUQsVUFBSTtBQUNGLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssd0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLGVBQWUsSUFBOUI7QUFDQSxrQkFBVSxDQUFWLElBQWdCLGdCQUFnQixDQUFqQixHQUFzQixJQUFyQzs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssd0JBQXJCLEVBQStDLFNBQS9DLENBQWI7QUFDRCxPQVpELENBWUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLHdDQUF3QyxLQUFsRCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7Ozt5Q0FVcUIsTyxFQUFTO0FBQzVCO0FBQ0EsVUFBSSxVQUFVLEdBQVYsSUFBaUIsVUFBVSxLQUEvQixFQUFzQztBQUNwQyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLHdFQUFmLENBQWYsQ0FBUDtBQUNEOztBQUVELFVBQUk7QUFDRjtBQUNBLGtCQUFVLEtBQUssS0FBTCxDQUFXLFVBQVUsRUFBckIsQ0FBVjtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssd0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsSUFBckI7QUFDQSxZQUFNLGtCQUFrQixhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsQ0FBeEI7QUFDQSxZQUFNLGVBQWUsYUFBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLENBQXJCOztBQUVBLFlBQUksVUFBVSxDQUFWLEdBQWMsQ0FBQyxJQUFJLFlBQUwsSUFBcUIsZUFBdkMsRUFBd0Q7QUFDdEQsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsNkpBQVYsQ0FBZixDQUFQO0FBRUQ7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLFVBQVUsSUFBekI7QUFDQSxrQkFBVSxDQUFWLElBQWdCLFdBQVcsQ0FBWixHQUFpQixJQUFoQzs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssd0JBQXJCLEVBQStDLFNBQS9DLENBQWI7QUFDRCxPQXhCRCxDQXdCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsa0RBQWtELEtBQTVELENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OzRDQU93QjtBQUN0QixVQUFJO0FBQ0YsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx1QkFBcEIsQ0FBM0I7O0FBRUE7QUFDQSxZQUFNLGNBQWMsQ0FBQyxhQUFELEVBQWdCLGNBQWhCLEVBQWdDLFNBQWhDLEVBQTJDLFVBQTNDLENBQXBCO0FBQ0EsWUFBTSxpQkFBaUIsQ0FDckIsT0FEcUIsRUFFckIsT0FGcUIsRUFHckIsT0FIcUIsRUFJckIsT0FKcUIsRUFLckIsUUFMcUIsRUFNckIsT0FOcUIsRUFPckIsT0FQcUIsRUFRckIsTUFScUIsRUFTckIsTUFUcUIsRUFVckIsTUFWcUIsRUFXckIsTUFYcUIsRUFZckIsT0FacUIsRUFhckIsTUFicUIsRUFjckIsTUFkcUIsQ0FBdkI7QUFnQkEsWUFBTSxTQUFTLFlBQVksYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQVosQ0FBZjtBQUNBLFlBQU0sVUFBVSxJQUFJLFdBQUosQ0FBZ0IsT0FBaEIsQ0FBaEI7QUFDQSxZQUFJLE1BQU0sUUFBUSxNQUFSLENBQWUsWUFBZixDQUFWO0FBQ0EsY0FBTSxTQUFTLElBQUksS0FBSixDQUFVLENBQVYsQ0FBZjs7QUFFQSx1QkFBZSxPQUFmLENBQXVCLFVBQUMsT0FBRCxFQUFVLENBQVYsRUFBZ0I7QUFDckMsY0FBSSxJQUFJLE9BQUosQ0FBWSxPQUFPLFlBQVAsQ0FBb0IsQ0FBcEIsQ0FBWixNQUF3QyxDQUFDLENBQTdDLEVBQWdEO0FBQzlDLGtCQUFNLElBQUksT0FBSixDQUFZLE9BQU8sWUFBUCxDQUFvQixDQUFwQixDQUFaLEVBQW9DLGVBQWUsQ0FBZixDQUFwQyxDQUFOO0FBQ0Q7QUFDRixTQUpEOztBQU1BLGVBQU8sSUFBSSxHQUFKLENBQVEsR0FBUixDQUFQO0FBQ0QsT0FqQ0QsQ0FpQ0UsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7MENBWXNCLFMsRUFBVztBQUMvQixVQUFJO0FBQ0Y7QUFDQSxZQUFNLE1BQU0sSUFBSSxHQUFKLENBQVEsU0FBUixDQUFaOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQU0sY0FBYyxDQUFDLGFBQUQsRUFBZ0IsY0FBaEIsRUFBZ0MsU0FBaEMsRUFBMkMsVUFBM0MsQ0FBcEI7QUFDQSxZQUFNLGlCQUFpQixDQUNyQixPQURxQixFQUVyQixPQUZxQixFQUdyQixPQUhxQixFQUlyQixPQUpxQixFQUtyQixRQUxxQixFQU1yQixPQU5xQixFQU9yQixPQVBxQixFQVFyQixNQVJxQixFQVNyQixNQVRxQixFQVVyQixNQVZxQixFQVdyQixNQVhxQixFQVlyQixPQVpxQixFQWFyQixNQWJxQixFQWNyQixNQWRxQixDQUF2QjtBQWdCQSxZQUFJLGFBQWEsSUFBakI7QUFDQSxZQUFJLGdCQUFnQixJQUFwQjtBQUNBLFlBQUksZUFBZSxJQUFJLElBQXZCO0FBQ0EsWUFBSSxNQUFNLGFBQWEsTUFBdkI7O0FBRUEsb0JBQVksT0FBWixDQUFvQixVQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWdCO0FBQ2xDLGNBQUksSUFBSSxJQUFKLENBQVMsT0FBVCxDQUFpQixPQUFqQixNQUE4QixDQUFDLENBQS9CLElBQW9DLGVBQWUsSUFBdkQsRUFBNkQ7QUFDM0QseUJBQWEsT0FBTyxZQUFQLENBQW9CLENBQXBCLENBQWI7QUFDQSwyQkFBZSxhQUFhLE9BQWIsQ0FBcUIsT0FBckIsRUFBOEIsVUFBOUIsQ0FBZjtBQUNBLG1CQUFPLFFBQVEsTUFBZjtBQUNEO0FBQ0YsU0FORDs7QUFRQSx1QkFBZSxPQUFmLENBQXVCLFVBQUMsT0FBRCxFQUFVLENBQVYsRUFBZ0I7QUFDckMsY0FBSSxJQUFJLElBQUosQ0FBUyxPQUFULENBQWlCLE9BQWpCLE1BQThCLENBQUMsQ0FBL0IsSUFBb0Msa0JBQWtCLElBQTFELEVBQWdFO0FBQzlELDRCQUFnQixPQUFPLFlBQVAsQ0FBb0IsQ0FBcEIsQ0FBaEI7QUFDQSwyQkFBZSxhQUFhLE9BQWIsQ0FBcUIsT0FBckIsRUFBOEIsYUFBOUIsQ0FBZjtBQUNBLG1CQUFPLFFBQVEsTUFBZjtBQUNEO0FBQ0YsU0FORDs7QUFRQSxZQUFJLE1BQU0sQ0FBTixJQUFXLE1BQU0sRUFBckIsRUFBeUI7QUFDdkIsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxTQUFKLENBQWMsc0dBQWQsQ0FBZixDQUFQO0FBRUQ7O0FBRUQsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLGFBQWEsTUFBNUIsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGFBQWEsTUFBakMsRUFBeUMsR0FBekMsRUFBOEM7QUFDNUMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsVUFBYixDQUF3QixDQUF4QixDQUFmO0FBQ0Q7O0FBRUQsZUFBTyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyx1QkFBckIsRUFBOEMsU0FBOUMsQ0FBUDtBQUNELE9BekRELENBeURFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxRQUFRLE1BQVIsQ0FBZSxLQUFmLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OzBDQU9zQjtBQUNwQixVQUFJO0FBQ0YsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx3QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFVBQVUsSUFBSSxXQUFKLENBQWdCLE9BQWhCLENBQWhCO0FBQ0EsWUFBTSxRQUFRLFFBQVEsTUFBUixDQUFlLFlBQWYsQ0FBZDs7QUFFQSxlQUFPLEtBQVA7QUFDRCxPQU5ELENBTUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozt3Q0FRb0IsSyxFQUFPO0FBQ3pCLFVBQUksTUFBTSxNQUFOLEdBQWUsR0FBbkIsRUFBd0I7QUFDdEIsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxnREFBVixDQUFmLENBQVA7QUFDRDs7QUFFRCxVQUFNLFVBQVUsSUFBSSxXQUFKLENBQWdCLE9BQWhCLEVBQXlCLE1BQXpCLENBQWdDLEtBQWhDLENBQWhCOztBQUVBLGFBQU8sS0FBSyxVQUFMLENBQWdCLEtBQUssd0JBQXJCLEVBQStDLE9BQS9DLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OzttQ0FPZTtBQUNiLFVBQUk7QUFDRixZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHdCQUFwQixDQUEzQjtBQUNBLFlBQU0sZUFBZSxJQUFyQjtBQUNBLFlBQU0sTUFBTSxhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsQ0FBWjs7QUFFQSxlQUFPLEdBQVA7QUFDRCxPQU5ELENBTUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7O2lDQVVhLE0sRUFBUTtBQUNuQixVQUFJLFFBQU8sTUFBUCx5Q0FBTyxNQUFQLE9BQWtCLFFBQWxCLElBQThCLE9BQU8sT0FBUCxLQUFtQixTQUFyRCxFQUFnRTtBQUM5RCxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksU0FBSixDQUFjLGtDQUFkLENBQWYsQ0FBUDtBQUNEOztBQUVELFVBQU0sVUFBVSxPQUFPLE9BQXZCO0FBQ0EsVUFBTSxvQkFBb0IsT0FBTyxpQkFBUCxJQUE0QixJQUF0RDs7QUFFQSxVQUFJLFVBQVUsRUFBVixJQUFnQixVQUFVLEdBQTlCLEVBQW1DO0FBQ2pDLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsMENBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsVUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7QUFDQSxnQkFBVSxDQUFWLElBQWUsb0JBQW9CLENBQXBCLEdBQXdCLENBQXZDO0FBQ0EsZ0JBQVUsQ0FBVixJQUFlLFVBQVUsSUFBekI7QUFDQSxnQkFBVSxDQUFWLElBQWdCLFdBQVcsQ0FBWixHQUFpQixJQUFoQzs7QUFFQSxhQUFPLEtBQUssVUFBTCxDQUFnQixLQUFLLHdCQUFyQixFQUErQyxTQUEvQyxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7K0NBTzJCO0FBQ3pCLFVBQUk7QUFDRixZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLDZCQUFwQixDQUEzQjtBQUNBLFlBQU0sUUFBUSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZDtBQUNBLFlBQU0sUUFBUSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZDtBQUNBLFlBQU0sUUFBUSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZDtBQUNBLFlBQU0sZ0JBQWMsS0FBZCxTQUF1QixLQUF2QixTQUFnQyxLQUF0Qzs7QUFFQSxlQUFPLE9BQVA7QUFDRCxPQVJELENBUUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOztBQUVBOztBQUVBOzs7Ozs7Ozs7O2lEQU82QjtBQUMzQixVQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSywrQkFBcEIsQ0FBbkI7QUFDQSxZQUFNLGVBQWUsSUFBckI7QUFDQSxZQUFNLGVBQWUsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFyQjtBQUNBLFlBQU0sbUJBQW1CLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBekI7QUFDQSxZQUFNLG1CQUFtQixLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQXpCO0FBQ0EsWUFBTSxnQkFBZ0IsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUF0QjtBQUNBLFlBQU0sVUFBVSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWhCO0FBQ0EsWUFBTSxpQkFBaUIsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUF2QjtBQUNBLFlBQU0sbUJBQW1CLEtBQUssUUFBTCxDQUFjLEVBQWQsQ0FBekI7QUFDQSxZQUFNLGtCQUFrQixLQUFLLFFBQUwsQ0FBYyxFQUFkLENBQXhCO0FBQ0EsWUFBTSxTQUFTO0FBQ2Isd0JBQWMsWUFERDtBQUViLDRCQUFrQixnQkFGTDtBQUdiLDRCQUFrQixnQkFITDtBQUliLHlCQUFlLGFBSkY7QUFLYixtQkFBUyxPQUxJO0FBTWIsMEJBQWdCLGNBTkg7QUFPYiw0QkFBa0IsZ0JBUEw7QUFRYiwyQkFBaUI7QUFSSixTQUFmOztBQVdBLGVBQU8sTUFBUDtBQUNELE9BdkJELENBdUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSw0REFBNEQsS0FBdEUsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O2lEQVE2QixRLEVBQVU7QUFDckMsVUFBSTtBQUNGLFlBQUksV0FBVyxFQUFYLElBQWlCLFdBQVcsS0FBaEMsRUFBdUM7QUFDckMsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsZ0ZBQWYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLCtCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxFQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxXQUFXLElBQTFCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixZQUFZLENBQWIsR0FBa0IsSUFBakM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLCtCQUFyQixFQUFzRCxTQUF0RCxDQUFiO0FBQ0QsT0FqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLHlEQUF5RCxLQUFuRSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OENBUTBCLFEsRUFBVTtBQUNsQyxVQUFJO0FBQ0YsWUFBSSxXQUFXLEVBQVgsSUFBaUIsV0FBVyxLQUFoQyxFQUF1QztBQUNyQyxpQkFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSw2RUFBZixDQUFmLENBQVA7QUFDRDs7QUFFRDtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssK0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLEVBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLFdBQVcsSUFBMUI7QUFDQSxrQkFBVSxDQUFWLElBQWdCLFlBQVksQ0FBYixHQUFrQixJQUFqQzs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssK0JBQXJCLEVBQXNELFNBQXRELENBQWI7QUFDRCxPQWpCRCxDQWlCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsc0RBQXNELEtBQWhFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs4Q0FRMEIsUSxFQUFVO0FBQ2xDLFVBQUk7QUFDRixZQUFJLFdBQVcsR0FBWCxJQUFrQixXQUFXLEtBQWpDLEVBQXdDO0FBQ3RDLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLCtFQUFmLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSywrQkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsRUFBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsV0FBVyxJQUExQjtBQUNBLGtCQUFVLENBQVYsSUFBZ0IsWUFBWSxDQUFiLEdBQWtCLElBQWpDOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSywrQkFBckIsRUFBc0QsU0FBdEQsQ0FBYjtBQUNELE9BakJELENBaUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSxzREFBc0QsS0FBaEUsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7OzJDQVF1QixRLEVBQVU7QUFDL0IsVUFBSTtBQUNGLFlBQUksV0FBVyxHQUFYLElBQWtCLFdBQVcsS0FBakMsRUFBd0M7QUFDdEMsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsNEVBQWYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLCtCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxFQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxXQUFXLElBQTFCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixZQUFZLENBQWIsR0FBa0IsSUFBakM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLCtCQUFyQixFQUFzRCxTQUF0RCxDQUFiO0FBQ0QsT0FqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLDBEQUEwRCxLQUFwRSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozt5Q0FPcUIsUSxFQUFVO0FBQzdCLFVBQUk7QUFDRixZQUFJLGFBQUo7O0FBRUEsWUFBSSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCLGlCQUFPLENBQVA7QUFDRCxTQUZELE1BRU8sSUFBSSxhQUFhLEVBQWpCLEVBQXFCO0FBQzFCLGlCQUFPLENBQVA7QUFDRCxTQUZNLE1BRUEsSUFBSSxhQUFhLEVBQWpCLEVBQXFCO0FBQzFCLGlCQUFPLENBQVA7QUFDRCxTQUZNLE1BRUE7QUFDTCxpQkFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSx3REFBZixDQUFmLENBQVA7QUFDRDs7QUFFRDtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssK0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLEVBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLElBQWY7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLCtCQUFyQixFQUFzRCxTQUF0RCxDQUFiO0FBQ0QsT0F4QkQsQ0F3QkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLGlEQUFpRCxLQUEzRCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OzsrQ0FVMkIsRyxFQUFLLEssRUFBTyxJLEVBQU07QUFDM0MsVUFBSTtBQUNGO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSywrQkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsRUFBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsR0FBZjtBQUNBLGtCQUFVLEVBQVYsSUFBZ0IsS0FBaEI7QUFDQSxrQkFBVSxFQUFWLElBQWdCLElBQWhCOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSywrQkFBckIsRUFBc0QsU0FBdEQsQ0FBYjtBQUNELE9BZEQsQ0FjRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUscURBQXFELEtBQS9ELENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7NENBU3dCLFksRUFBYyxNLEVBQVE7QUFDNUMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLGtCQUFMLENBQXdCLENBQXhCLElBQTZCLEtBQUsseUJBQUwsQ0FBK0IsSUFBL0IsQ0FBb0MsSUFBcEMsQ0FBN0I7QUFDQSxhQUFLLGtCQUFMLENBQXdCLENBQXhCLEVBQTJCLElBQTNCLENBQWdDLFlBQWhDO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxrQkFBTCxDQUF3QixDQUF4QixFQUEyQixNQUEzQixDQUFrQyxLQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBQWdDLENBQUMsWUFBRCxDQUFoQyxDQUFsQyxFQUFtRixDQUFuRjtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUsseUJBQWhDLEVBQTJELE1BQTNELEVBQW1FLEtBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsQ0FBbkUsQ0FBYjtBQUNEOzs7OENBRXlCLEssRUFBTztBQUMvQixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7QUFDQSxVQUFNLFVBQVUsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFoQjtBQUNBLFVBQU0sVUFBVSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWhCO0FBQ0EsVUFBTSxjQUFjLFVBQVUsVUFBVSxHQUF4QztBQUNBLFdBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsRUFBMkIsT0FBM0IsQ0FBbUMsVUFBQyxZQUFELEVBQWtCO0FBQ25ELHFCQUFhO0FBQ1gsaUJBQU8sV0FESTtBQUVYLGdCQUFNO0FBRkssU0FBYjtBQUlELE9BTEQ7QUFNRDs7QUFFRDs7Ozs7Ozs7Ozs7O3lDQVNxQixZLEVBQWMsTSxFQUFRO0FBQ3pDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyxzQkFBTCxDQUE0QixDQUE1QixJQUFpQyxLQUFLLHNCQUFMLENBQTRCLElBQTVCLENBQWlDLElBQWpDLENBQWpDO0FBQ0EsYUFBSyxzQkFBTCxDQUE0QixDQUE1QixFQUErQixJQUEvQixDQUFvQyxZQUFwQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssc0JBQUwsQ0FBNEIsQ0FBNUIsRUFBK0IsTUFBL0IsQ0FBc0MsS0FBSyxzQkFBTCxDQUE0QixPQUE1QixDQUFvQyxDQUFDLFlBQUQsQ0FBcEMsQ0FBdEMsRUFBMkYsQ0FBM0Y7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLHNCQUFoQyxFQUF3RCxNQUF4RCxFQUFnRSxLQUFLLHNCQUFMLENBQTRCLENBQTVCLENBQWhFLENBQWI7QUFDRDs7OzJDQUVzQixLLEVBQU87QUFDNUIsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxlQUFlLElBQXJCO0FBQ0EsVUFBTSxVQUFVLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBaEI7QUFDQSxVQUFNLFVBQVUsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFoQjtBQUNBLFVBQU0sV0FBVyxVQUFVLFVBQVUsR0FBckM7QUFDQSxXQUFLLHNCQUFMLENBQTRCLENBQTVCLEVBQStCLE9BQS9CLENBQXVDLFVBQUMsWUFBRCxFQUFrQjtBQUN2RCxxQkFBYTtBQUNYLGlCQUFPLFFBREk7QUFFWCxnQkFBTTtBQUZLLFNBQWI7QUFJRCxPQUxEO0FBTUQ7O0FBRUQ7Ozs7Ozs7Ozs7Ozt5Q0FTcUIsWSxFQUFjLE0sRUFBUTtBQUN6QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssc0JBQUwsQ0FBNEIsQ0FBNUIsSUFBaUMsS0FBSyxzQkFBTCxDQUE0QixJQUE1QixDQUFpQyxJQUFqQyxDQUFqQztBQUNBLGFBQUssc0JBQUwsQ0FBNEIsQ0FBNUIsRUFBK0IsSUFBL0IsQ0FBb0MsWUFBcEM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLHNCQUFMLENBQTRCLENBQTVCLEVBQStCLE1BQS9CLENBQXNDLEtBQUssc0JBQUwsQ0FBNEIsT0FBNUIsQ0FBb0MsQ0FBQyxZQUFELENBQXBDLENBQXRDLEVBQTJGLENBQTNGO0FBQ0Q7QUFDRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLHNCQUFoQyxFQUF3RCxNQUF4RCxFQUFnRSxLQUFLLHNCQUFMLENBQTRCLENBQTVCLENBQWhFLENBQWI7QUFDRDs7OzJDQUVzQixLLEVBQU87QUFDNUIsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxXQUFXLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBakI7QUFDQSxXQUFLLHNCQUFMLENBQTRCLENBQTVCLEVBQStCLE9BQS9CLENBQXVDLFVBQUMsWUFBRCxFQUFrQjtBQUN2RCxxQkFBYTtBQUNYLGlCQUFPLFFBREk7QUFFWCxnQkFBTTtBQUZLLFNBQWI7QUFJRCxPQUxEO0FBTUQ7O0FBRUQ7Ozs7Ozs7Ozs7OztvQ0FTZ0IsWSxFQUFjLE0sRUFBUTtBQUNwQyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssaUJBQUwsQ0FBdUIsQ0FBdkIsSUFBNEIsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUE1QjtBQUNBLGFBQUssaUJBQUwsQ0FBdUIsQ0FBdkIsRUFBMEIsSUFBMUIsQ0FBK0IsWUFBL0I7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLGlCQUFMLENBQXVCLENBQXZCLEVBQTBCLE1BQTFCLENBQWlDLEtBQUssaUJBQUwsQ0FBdUIsT0FBdkIsQ0FBK0IsQ0FBQyxZQUFELENBQS9CLENBQWpDLEVBQWlGLENBQWpGO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyxpQkFBaEMsRUFBbUQsTUFBbkQsRUFBMkQsS0FBSyxpQkFBTCxDQUF1QixDQUF2QixDQUEzRCxDQUFiO0FBQ0Q7OztzQ0FDaUIsSyxFQUFPO0FBQ3ZCLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjtBQUNBLFVBQU0sZUFBZSxJQUFyQjtBQUNBLFVBQU0sT0FBTyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQWI7QUFDQSxVQUFNLE9BQU8sS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFiOztBQUVBLFdBQUssaUJBQUwsQ0FBdUIsQ0FBdkIsRUFBMEIsT0FBMUIsQ0FBa0MsVUFBQyxZQUFELEVBQWtCO0FBQ2xELHFCQUFhO0FBQ1gsZ0JBQU07QUFDSixtQkFBTyxJQURIO0FBRUosa0JBQU07QUFGRixXQURLO0FBS1gsZ0JBQU07QUFDSixtQkFBTyxJQURIO0FBRUosa0JBQU07QUFGRjtBQUxLLFNBQWI7QUFVRCxPQVhEO0FBWUQ7O0FBRUQ7Ozs7Ozs7Ozs7OztzQ0FTa0IsWSxFQUFjLE0sRUFBUTtBQUN0QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssbUJBQUwsQ0FBeUIsQ0FBekIsSUFBOEIsS0FBSyxtQkFBTCxDQUF5QixJQUF6QixDQUE4QixJQUE5QixDQUE5QjtBQUNBLGFBQUssbUJBQUwsQ0FBeUIsQ0FBekIsRUFBNEIsSUFBNUIsQ0FBaUMsWUFBakM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLG1CQUFMLENBQXlCLENBQXpCLEVBQTRCLE1BQTVCLENBQW1DLEtBQUssbUJBQUwsQ0FBeUIsT0FBekIsQ0FBaUMsQ0FBQyxZQUFELENBQWpDLENBQW5DLEVBQXFGLENBQXJGO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyxtQkFBaEMsRUFBcUQsTUFBckQsRUFBNkQsS0FBSyxtQkFBTCxDQUF5QixDQUF6QixDQUE3RCxDQUFiO0FBQ0Q7Ozt3Q0FFbUIsSyxFQUFPO0FBQ3pCLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjtBQUNBLFVBQU0sZUFBZSxJQUFyQjtBQUNBLFVBQU0sSUFBSSxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQVY7QUFDQSxVQUFNLElBQUksS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFWO0FBQ0EsVUFBTSxJQUFJLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBVjtBQUNBLFVBQU0sSUFBSSxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQVY7QUFDQSxVQUFNLFNBQVMsS0FBSyxJQUFJLENBQUosR0FBUSxDQUFiLENBQWY7QUFDQSxVQUFNLFNBQVMsS0FBSyxJQUFJLENBQUosR0FBUSxDQUFiLENBQWY7QUFDQSxVQUFNLFNBQVMsS0FBSyxJQUFJLENBQUosR0FBUSxDQUFiLENBQWY7QUFDQSxVQUFNLGVBQWUsR0FBckI7QUFDQSxVQUFNLGVBQWUsR0FBckI7QUFDQSxVQUFNLFlBQVksZUFBZSxZQUFqQztBQUNBLFVBQUksa0JBQWtCLENBQUMsSUFBSSxZQUFMLElBQXFCLFNBQTNDOztBQUVBLFVBQUksa0JBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLDBCQUFrQixDQUFsQjtBQUNEOztBQUVELFVBQUksTUFBTSxTQUFTLEtBQVQsR0FBaUIsQ0FBakIsR0FBcUIsZUFBL0I7O0FBRUEsVUFBSSxNQUFNLEdBQVYsRUFBZTtBQUNiLGNBQU0sR0FBTjtBQUNEO0FBQ0QsVUFBSSxRQUFRLFNBQVMsS0FBVCxHQUFpQixDQUFqQixHQUFxQixlQUFqQzs7QUFFQSxVQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNmLGdCQUFRLEdBQVI7QUFDRDtBQUNELFVBQUksT0FBTyxTQUFTLEtBQVQsR0FBaUIsQ0FBakIsR0FBcUIsZUFBaEM7O0FBRUEsVUFBSSxPQUFPLEdBQVgsRUFBZ0I7QUFDZCxlQUFPLEdBQVA7QUFDRDs7QUFFRCxXQUFLLG1CQUFMLENBQXlCLENBQXpCLEVBQTRCLE9BQTVCLENBQW9DLFVBQUMsWUFBRCxFQUFrQjtBQUNwRCxxQkFBYTtBQUNYLGVBQUssSUFBSSxPQUFKLENBQVksQ0FBWixDQURNO0FBRVgsaUJBQU8sTUFBTSxPQUFOLENBQWMsQ0FBZCxDQUZJO0FBR1gsZ0JBQU0sS0FBSyxPQUFMLENBQWEsQ0FBYjtBQUhLLFNBQWI7QUFLRCxPQU5EO0FBT0Q7O0FBRUQ7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozt5Q0FPcUI7QUFDbkIsVUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssaUJBQXBCLENBQW5CO0FBQ0EsWUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBYjtBQUNBLFlBQU0sZUFBZSxJQUFyQjtBQUNBLFlBQUksZUFBSjs7QUFFQSxnQkFBUSxJQUFSO0FBQ0EsZUFBSyxDQUFMO0FBQ0UscUJBQVMsRUFBQyxXQUFXLEVBQUMsTUFBTSxJQUFQLEVBQVosRUFBVDtBQUNBO0FBQ0YsZUFBSyxDQUFMO0FBQ0UscUJBQVM7QUFDUCxvQkFBTSxJQURDO0FBRVAsaUJBQUcsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUZJO0FBR1AsaUJBQUcsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUhJO0FBSVAsaUJBQUcsS0FBSyxRQUFMLENBQWMsQ0FBZDtBQUpJLGFBQVQ7QUFNQTtBQUNGLGVBQUssQ0FBTDtBQUNFLHFCQUFTO0FBQ1Asb0JBQU0sSUFEQztBQUVQLHFCQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FGQTtBQUdQLHlCQUFXLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FISjtBQUlQLHFCQUFPLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEI7QUFKQSxhQUFUO0FBTUE7QUFDRixlQUFLLENBQUw7QUFDRSxxQkFBUztBQUNQLG9CQUFNLElBREM7QUFFUCxxQkFBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBRkE7QUFHUCx5QkFBVyxLQUFLLFFBQUwsQ0FBYyxDQUFkO0FBSEosYUFBVDtBQUtBO0FBMUJGO0FBNEJBLGVBQU8sTUFBUDtBQUNELE9BbkNELENBbUNFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSwyQ0FBMkMsS0FBckQsQ0FBUDtBQUNEO0FBQ0Y7Ozs0QkFFTyxTLEVBQVc7QUFDakIsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxpQkFBckIsRUFBd0MsU0FBeEMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7OztzQ0FXa0IsSyxFQUFPO0FBQ3ZCLFVBQUksTUFBTSxHQUFOLEtBQWMsU0FBZCxJQUEyQixNQUFNLEtBQU4sS0FBZ0IsU0FBM0MsSUFBd0QsTUFBTSxJQUFOLEtBQWUsU0FBM0UsRUFBc0Y7QUFDcEYsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFNBQUosQ0FBYyw0RUFBZCxDQUFmLENBQVA7QUFDRDtBQUNELFVBQ0UsTUFBTSxHQUFOLEdBQVksQ0FBWixJQUNBLE1BQU0sR0FBTixHQUFZLEdBRFosSUFFQSxNQUFNLEtBQU4sR0FBYyxDQUZkLElBR0EsTUFBTSxLQUFOLEdBQWMsR0FIZCxJQUlBLE1BQU0sSUFBTixHQUFhLENBSmIsSUFLQSxNQUFNLElBQU4sR0FBYSxHQU5mLEVBT0U7QUFDQSxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLDZDQUFmLENBQWYsQ0FBUDtBQUNEO0FBQ0QsYUFBTyxNQUFNLEtBQUssT0FBTCxDQUFhLElBQUksVUFBSixDQUFlLENBQUMsQ0FBRCxFQUFJLE1BQU0sR0FBVixFQUFlLE1BQU0sS0FBckIsRUFBNEIsTUFBTSxJQUFsQyxDQUFmLENBQWIsQ0FBYjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7OztxQ0FXaUIsTSxFQUFRO0FBQ3ZCLFVBQU0sU0FBUyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTZDLE1BQTdDLEVBQXFELE9BQXJELENBQWY7QUFDQSxVQUFNLFlBQVksT0FBTyxPQUFPLEtBQWQsS0FBd0IsUUFBeEIsR0FBbUMsT0FBTyxPQUFQLENBQWUsT0FBTyxLQUF0QixJQUErQixDQUFsRSxHQUFzRSxPQUFPLEtBQS9GOztBQUVBLFVBQUksT0FBTyxLQUFQLEtBQWlCLFNBQWpCLElBQThCLE9BQU8sU0FBUCxLQUFxQixTQUFuRCxJQUFnRSxPQUFPLEtBQVAsS0FBaUIsU0FBckYsRUFBZ0c7QUFDOUYsZUFBTyxRQUFRLE1BQVIsQ0FDTCxJQUFJLFNBQUosQ0FBYyx1RkFBZCxDQURLLENBQVA7QUFHRDtBQUNELFVBQUksWUFBWSxDQUFaLElBQWlCLFlBQVksQ0FBakMsRUFBb0M7QUFDbEMsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSwyQ0FBZixDQUFmLENBQVA7QUFDRDtBQUNELFVBQUksT0FBTyxTQUFQLEdBQW1CLENBQW5CLElBQXdCLE9BQU8sU0FBUCxHQUFtQixHQUEvQyxFQUFvRDtBQUNsRCxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLDZDQUFmLENBQWYsQ0FBUDtBQUNEO0FBQ0QsVUFBSSxPQUFPLEtBQVAsR0FBZSxFQUFmLElBQXFCLE9BQU8sS0FBUCxHQUFlLEtBQXhDLEVBQStDO0FBQzdDLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsa0RBQWYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUssT0FBTCxDQUFhLElBQUksVUFBSixDQUFlLENBQUMsQ0FBRCxFQUFJLFNBQUosRUFBZSxPQUFPLFNBQXRCLEVBQWlDLE9BQU8sS0FBUCxHQUFlLElBQWhELEVBQXVELE9BQU8sS0FBUCxJQUFnQixDQUFqQixHQUFzQixJQUE1RSxDQUFmLENBQWIsQ0FBYjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7O3FDQVVpQixNLEVBQVE7QUFDdkIsVUFBTSxTQUFTLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNkMsTUFBN0MsRUFBcUQsT0FBckQsQ0FBZjtBQUNBLFVBQU0sWUFBWSxPQUFPLE9BQU8sS0FBZCxLQUF3QixRQUF4QixHQUFtQyxPQUFPLE9BQVAsQ0FBZSxPQUFPLEtBQXRCLElBQStCLENBQWxFLEdBQXNFLE9BQU8sS0FBL0Y7O0FBRUEsVUFBSSxjQUFjLFNBQWQsSUFBMkIsT0FBTyxTQUFQLEtBQXFCLFNBQXBELEVBQStEO0FBQzdELGVBQU8sUUFBUSxNQUFSLENBQ0wsSUFBSSxTQUFKLENBQWMsc0ZBQWQsQ0FESyxDQUFQO0FBR0Q7QUFDRCxVQUFJLFlBQVksQ0FBWixJQUFpQixZQUFZLENBQWpDLEVBQW9DO0FBQ2xDLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsMkNBQWYsQ0FBZixDQUFQO0FBQ0Q7QUFDRCxVQUFJLE9BQU8sU0FBUCxHQUFtQixDQUFuQixJQUF3QixPQUFPLFNBQVAsR0FBbUIsR0FBL0MsRUFBb0Q7QUFDbEQsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSw0Q0FBZixDQUFmLENBQVA7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxPQUFMLENBQWEsSUFBSSxVQUFKLENBQWUsQ0FBQyxDQUFELEVBQUksU0FBSixFQUFlLE9BQU8sU0FBdEIsQ0FBZixDQUFiLENBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3VDQVNtQixZLEVBQWMsTSxFQUFRO0FBQ3ZDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyxvQkFBTCxDQUEwQixDQUExQixJQUErQixLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQStCLElBQS9CLENBQS9CO0FBQ0EsYUFBSyxvQkFBTCxDQUEwQixDQUExQixFQUE2QixJQUE3QixDQUFrQyxZQUFsQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssb0JBQUwsQ0FBMEIsQ0FBMUIsRUFBNkIsTUFBN0IsQ0FBb0MsS0FBSyxvQkFBTCxDQUEwQixPQUExQixDQUFrQyxDQUFDLFlBQUQsQ0FBbEMsQ0FBcEMsRUFBdUYsQ0FBdkY7QUFDRDtBQUNELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUssb0JBQWhDLEVBQXNELE1BQXRELEVBQThELEtBQUssb0JBQUwsQ0FBMEIsQ0FBMUIsQ0FBOUQsQ0FBYjtBQUNEOzs7eUNBRW9CLEssRUFBTztBQUMxQixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7QUFDQSxVQUFNLFFBQVEsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFkO0FBQ0EsV0FBSyxvQkFBTCxDQUEwQixDQUExQixFQUE2QixPQUE3QixDQUFxQyxVQUFDLFlBQUQsRUFBa0I7QUFDckQscUJBQWEsS0FBYjtBQUNELE9BRkQ7QUFHRDs7QUFFRDs7Ozs7Ozs7OzsrQ0FPMkI7QUFDekIsVUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUsseUJBQXBCLENBQW5CO0FBQ0EsWUFBTSxZQUFZO0FBQ2hCLGdCQUFNLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FEVTtBQUVoQixnQkFBTSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBRlU7QUFHaEIsZ0JBQU0sS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUhVO0FBSWhCLGdCQUFNLEtBQUssUUFBTCxDQUFjLENBQWQ7QUFKVSxTQUFsQjtBQU1BLGVBQU8sU0FBUDtBQUNELE9BVEQsQ0FTRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsMERBQTBELEtBQXBFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7eUNBU3FCLEcsRUFBSyxLLEVBQU87QUFDL0IsVUFBSSxNQUFNLENBQU4sSUFBVyxNQUFNLENBQXJCLEVBQXdCO0FBQ3RCLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsMEJBQVYsQ0FBZixDQUFQO0FBQ0Q7QUFDRCxVQUFJLEVBQUUsVUFBVSxDQUFWLElBQWUsVUFBVSxHQUEzQixDQUFKLEVBQXFDO0FBQ25DLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsbUNBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsVUFBSTtBQUNGO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx5QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsQ0FBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxNQUFNLENBQWhCLElBQXFCLEtBQXJCOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyx5QkFBckIsRUFBZ0QsU0FBaEQsQ0FBYjtBQUNELE9BWkQsQ0FZRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsdUNBQXVDLEtBQWpELENBQVA7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs0Q0FPd0I7QUFDdEIsVUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssdUJBQXBCLENBQW5CO0FBQ0EsWUFBTSxlQUFlLElBQXJCO0FBQ0EsWUFBTSxzQkFBc0IsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUE1QjtBQUNBLFlBQU0sbUJBQW1CLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBekI7QUFDQSxZQUFNLHFCQUFxQixLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQTNCO0FBQ0EsWUFBTSw0QkFBNEIsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFsQztBQUNBLFlBQU0sZUFBZSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXJCO0FBQ0EsWUFBTSxTQUFTO0FBQ2IsNkJBQW1CLG1CQUROO0FBRWIsNEJBQWtCLGdCQUZMO0FBR2IsOEJBQW9CLGtCQUhQO0FBSWIscUNBQTJCLHlCQUpkO0FBS2Isd0JBQWM7QUFMRCxTQUFmOztBQVFBLGVBQU8sTUFBUDtBQUNELE9BakJELENBaUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSw0REFBNEQsS0FBdEUsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O2lEQVE2QixRLEVBQVU7QUFDckMsVUFBSTtBQUNGLFlBQUksV0FBVyxHQUFYLElBQWtCLFdBQVcsSUFBakMsRUFBdUM7QUFDckMsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsb0RBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHVCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxXQUFXLElBQTFCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixZQUFZLENBQWIsR0FBa0IsSUFBakM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHVCQUFyQixFQUE4QyxTQUE5QyxDQUFiO0FBQ0QsT0FqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLGlEQUFpRCxLQUEzRCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7cURBUWlDLFEsRUFBVTtBQUN6QyxVQUFJO0FBQ0YsWUFBSSxXQUFXLEdBQVgsSUFBa0IsV0FBVyxJQUFqQyxFQUF1QztBQUNyQyxpQkFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxvREFBVixDQUFmLENBQVA7QUFDRDs7QUFFRDtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssdUJBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLFdBQVcsSUFBMUI7QUFDQSxrQkFBVSxDQUFWLElBQWdCLFlBQVksQ0FBYixHQUFrQixJQUFqQzs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssdUJBQXJCLEVBQThDLFNBQTlDLENBQWI7QUFDRCxPQWpCRCxDQWlCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsK0RBQStELEtBQXpFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OztnREFRNEIsUSxFQUFVO0FBQ3BDLFVBQUk7QUFDRixZQUFJLFdBQVcsR0FBWCxJQUFrQixXQUFXLElBQWpDLEVBQXVDO0FBQ3JDLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLG9EQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx1QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsQ0FBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsV0FBVyxJQUExQjtBQUNBLGtCQUFVLENBQVYsSUFBZ0IsWUFBWSxDQUFiLEdBQWtCLElBQWpDOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyx1QkFBckIsRUFBOEMsU0FBOUMsQ0FBYjtBQUNELE9BakJELENBaUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSxnRUFBZ0UsS0FBMUUsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O29EQVFnQyxTLEVBQVc7QUFDekMsVUFBSTtBQUNGLFlBQUksWUFBWSxHQUFaLElBQW1CLFlBQVksR0FBbkMsRUFBd0M7QUFDdEMsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaURBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHVCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxZQUFZLElBQTNCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixhQUFhLENBQWQsR0FBbUIsSUFBbEM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHVCQUFyQixFQUE4QyxTQUE5QyxDQUFiO0FBQ0QsT0FqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLHFFQUFxRSxLQUEvRSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7MENBUXNCLE0sRUFBUTtBQUM1QixVQUFJO0FBQ0YsWUFBSSxPQUFPLE1BQVAsS0FBa0IsU0FBdEIsRUFBaUM7QUFDL0IsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUscUNBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHVCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxTQUFTLENBQVQsR0FBYSxDQUE1Qjs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssdUJBQXJCLEVBQThDLFNBQTlDLENBQWI7QUFDRCxPQWhCRCxDQWdCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsK0RBQStELEtBQXpFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7b0NBU2dCLFksRUFBYyxNLEVBQVE7QUFDcEMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLGlCQUFMLENBQXVCLENBQXZCLElBQTRCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBNUI7QUFDQSxhQUFLLGlCQUFMLENBQXVCLENBQXZCLEVBQTBCLElBQTFCLENBQStCLFlBQS9CO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxpQkFBTCxDQUF1QixDQUF2QixFQUEwQixNQUExQixDQUFpQyxLQUFLLGlCQUFMLENBQXVCLE9BQXZCLENBQStCLENBQUMsWUFBRCxDQUEvQixDQUFqQyxFQUFpRixDQUFqRjtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUssaUJBQWhDLEVBQW1ELE1BQW5ELEVBQTJELEtBQUssaUJBQUwsQ0FBdUIsQ0FBdkIsQ0FBM0QsQ0FBYjtBQUNEOzs7c0NBRWlCLEssRUFBTztBQUN2QixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7QUFDQSxVQUFNLFlBQVksS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFsQjtBQUNBLFVBQU0sUUFBUSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWQ7QUFDQSxXQUFLLGlCQUFMLENBQXVCLENBQXZCLEVBQTBCLE9BQTFCLENBQWtDLFVBQUMsWUFBRCxFQUFrQjtBQUNsRCxxQkFBYTtBQUNYLHFCQUFXLFNBREE7QUFFWCxpQkFBTztBQUZJLFNBQWI7QUFJRCxPQUxEO0FBTUQ7O0FBRUQ7Ozs7Ozs7Ozs7Ozs0Q0FTd0IsWSxFQUFjLE0sRUFBUTtBQUM1QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUsseUJBQUwsQ0FBK0IsQ0FBL0IsSUFBb0MsS0FBSyx5QkFBTCxDQUErQixJQUEvQixDQUFvQyxJQUFwQyxDQUFwQztBQUNBLGFBQUsseUJBQUwsQ0FBK0IsQ0FBL0IsRUFBa0MsSUFBbEMsQ0FBdUMsWUFBdkM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLHlCQUFMLENBQStCLENBQS9CLEVBQWtDLE1BQWxDLENBQXlDLEtBQUsseUJBQUwsQ0FBK0IsT0FBL0IsQ0FBdUMsQ0FBQyxZQUFELENBQXZDLENBQXpDLEVBQWlHLENBQWpHO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyx5QkFBaEMsRUFBMkQsTUFBM0QsRUFBbUUsS0FBSyx5QkFBTCxDQUErQixDQUEvQixDQUFuRSxDQUFiO0FBQ0Q7Ozs4Q0FFeUIsSyxFQUFPO0FBQy9CLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjtBQUNBLFVBQU0sY0FBYyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXBCO0FBQ0EsV0FBSyx5QkFBTCxDQUErQixDQUEvQixFQUFrQyxPQUFsQyxDQUEwQyxVQUFDLFlBQUQsRUFBa0I7QUFDMUQscUJBQWEsV0FBYjtBQUNELE9BRkQ7QUFHRDs7QUFFRDs7Ozs7Ozs7Ozs7OzJDQVN1QixZLEVBQWMsTSxFQUFRO0FBQzNDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyx3QkFBTCxDQUE4QixDQUE5QixJQUFtQyxLQUFLLHdCQUFMLENBQThCLElBQTlCLENBQW1DLElBQW5DLENBQW5DO0FBQ0EsYUFBSyx3QkFBTCxDQUE4QixDQUE5QixFQUFpQyxJQUFqQyxDQUFzQyxZQUF0QztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssd0JBQUwsQ0FBOEIsQ0FBOUIsRUFBaUMsTUFBakMsQ0FBd0MsS0FBSyx3QkFBTCxDQUE4QixPQUE5QixDQUFzQyxDQUFDLFlBQUQsQ0FBdEMsQ0FBeEMsRUFBK0YsQ0FBL0Y7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLHdCQUFoQyxFQUEwRCxNQUExRCxFQUFrRSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBQWxFLENBQWI7QUFDRDs7OzZDQUV3QixLLEVBQU87QUFDOUIsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCOztBQUVBO0FBQ0EsVUFBSSxJQUFJLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsS0FBMEIsS0FBSyxFQUEvQixDQUFSO0FBQ0EsVUFBSSxJQUFJLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsS0FBMEIsS0FBSyxFQUEvQixDQUFSO0FBQ0EsVUFBSSxJQUFJLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsS0FBMEIsS0FBSyxFQUEvQixDQUFSO0FBQ0EsVUFBSSxJQUFJLEtBQUssUUFBTCxDQUFjLEVBQWQsRUFBa0IsSUFBbEIsS0FBMkIsS0FBSyxFQUFoQyxDQUFSO0FBQ0EsVUFBTSxZQUFZLEtBQUssSUFBTCxDQUFVLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLElBQWlCLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQWpCLEdBQWtDLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQWxDLEdBQW1ELEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQTdELENBQWxCOztBQUVBLFVBQUksY0FBYyxDQUFsQixFQUFxQjtBQUNuQixhQUFLLFNBQUw7QUFDQSxhQUFLLFNBQUw7QUFDQSxhQUFLLFNBQUw7QUFDQSxhQUFLLFNBQUw7QUFDRDs7QUFFRCxXQUFLLHdCQUFMLENBQThCLENBQTlCLEVBQWlDLE9BQWpDLENBQXlDLFVBQUMsWUFBRCxFQUFrQjtBQUN6RCxxQkFBYTtBQUNYLGFBQUcsQ0FEUTtBQUVYLGFBQUcsQ0FGUTtBQUdYLGFBQUcsQ0FIUTtBQUlYLGFBQUc7QUFKUSxTQUFiO0FBTUQsT0FQRDtBQVFEOztBQUVEOzs7Ozs7Ozs7Ozs7cUNBU2lCLFksRUFBYyxNLEVBQVE7QUFDckMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLGtCQUFMLENBQXdCLENBQXhCLElBQTZCLEtBQUssa0JBQUwsQ0FBd0IsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FBN0I7QUFDQSxhQUFLLGtCQUFMLENBQXdCLENBQXhCLEVBQTJCLElBQTNCLENBQWdDLFlBQWhDO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxrQkFBTCxDQUF3QixDQUF4QixFQUEyQixNQUEzQixDQUFrQyxLQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBQWdDLENBQUMsWUFBRCxDQUFoQyxDQUFsQyxFQUFtRixDQUFuRjtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUssa0JBQWhDLEVBQW9ELE1BQXBELEVBQTRELEtBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsQ0FBNUQsQ0FBYjtBQUNEOzs7dUNBRWtCLEssRUFBTztBQUN4QixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7QUFDQSxVQUFNLGVBQWUsSUFBckI7QUFDQSxVQUFNLFFBQVEsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFkO0FBQ0EsVUFBTSxPQUFPLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBYjtBQUNBLFdBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsRUFBMkIsT0FBM0IsQ0FBbUMsVUFBQyxZQUFELEVBQWtCO0FBQ25ELHFCQUFhO0FBQ1gsaUJBQU8sS0FESTtBQUVYLGdCQUFNO0FBQ0osbUJBQU8sSUFESDtBQUVKLGtCQUFNO0FBRkY7QUFGSyxTQUFiO0FBT0QsT0FSRDtBQVNEOztBQUVEOzs7Ozs7Ozs7Ozs7MENBU3NCLFksRUFBYyxNLEVBQVE7QUFDMUMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLHVCQUFMLENBQTZCLENBQTdCLElBQWtDLEtBQUssdUJBQUwsQ0FBNkIsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FBbEM7QUFDQSxhQUFLLHVCQUFMLENBQTZCLENBQTdCLEVBQWdDLElBQWhDLENBQXFDLFlBQXJDO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyx1QkFBTCxDQUE2QixDQUE3QixFQUFnQyxNQUFoQyxDQUF1QyxLQUFLLHVCQUFMLENBQTZCLE9BQTdCLENBQXFDLENBQUMsWUFBRCxDQUFyQyxDQUF2QyxFQUE2RixDQUE3RjtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUssdUJBQWhDLEVBQXlELE1BQXpELEVBQWlFLEtBQUssdUJBQUwsQ0FBNkIsQ0FBN0IsQ0FBakUsQ0FBYjtBQUNEOzs7NENBRXVCLEssRUFBTztBQUM3QixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7O0FBRUE7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixFQUF0QztBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLEVBQXRDO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsRUFBdEM7O0FBRUE7QUFDQSxVQUFNLFFBQVEsS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixJQUF2QztBQUNBLFVBQU0sUUFBUSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLElBQXZDO0FBQ0EsVUFBTSxRQUFRLEtBQUssUUFBTCxDQUFjLEVBQWQsRUFBa0IsSUFBbEIsSUFBMEIsSUFBeEM7O0FBRUE7QUFDQSxVQUFNLFdBQVcsS0FBSyxRQUFMLENBQWMsRUFBZCxFQUFrQixJQUFsQixJQUEwQixJQUEzQztBQUNBLFVBQU0sV0FBVyxLQUFLLFFBQUwsQ0FBYyxFQUFkLEVBQWtCLElBQWxCLElBQTBCLElBQTNDO0FBQ0EsVUFBTSxXQUFXLEtBQUssUUFBTCxDQUFjLEVBQWQsRUFBa0IsSUFBbEIsSUFBMEIsSUFBM0M7O0FBRUEsV0FBSyx1QkFBTCxDQUE2QixDQUE3QixFQUFnQyxPQUFoQyxDQUF3QyxVQUFDLFlBQUQsRUFBa0I7QUFDeEQscUJBQWE7QUFDWCx5QkFBZTtBQUNiLGVBQUcsSUFEVTtBQUViLGVBQUcsSUFGVTtBQUdiLGVBQUcsSUFIVTtBQUliLGtCQUFNO0FBSk8sV0FESjtBQU9YLHFCQUFXO0FBQ1QsZUFBRyxLQURNO0FBRVQsZUFBRyxLQUZNO0FBR1QsZUFBRyxLQUhNO0FBSVQsa0JBQU07QUFKRyxXQVBBO0FBYVgsbUJBQVM7QUFDUCxlQUFHLFFBREk7QUFFUCxlQUFHLFFBRkk7QUFHUCxlQUFHLFFBSEk7QUFJUCxrQkFBTTtBQUpDO0FBYkUsU0FBYjtBQW9CRCxPQXJCRDtBQXNCRDs7QUFFRDs7Ozs7Ozs7Ozs7O3NDQVNrQixZLEVBQWMsTSxFQUFRO0FBQ3RDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyxtQkFBTCxDQUF5QixDQUF6QixJQUE4QixLQUFLLG1CQUFMLENBQXlCLElBQXpCLENBQThCLElBQTlCLENBQTlCO0FBQ0EsYUFBSyxtQkFBTCxDQUF5QixDQUF6QixFQUE0QixJQUE1QixDQUFpQyxZQUFqQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssbUJBQUwsQ0FBeUIsQ0FBekIsRUFBNEIsTUFBNUIsQ0FBbUMsS0FBSyxtQkFBTCxDQUF5QixPQUF6QixDQUFpQyxDQUFDLFlBQUQsQ0FBakMsQ0FBbkMsRUFBcUYsQ0FBckY7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLG1CQUFoQyxFQUFxRCxNQUFyRCxFQUE2RCxLQUFLLG1CQUFMLENBQXlCLENBQXpCLENBQTdELENBQWI7QUFDRDs7O3dDQUVtQixLLEVBQU87QUFDekIsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCOztBQUVBO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsS0FBdEM7QUFDQSxVQUFNLFFBQVEsS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixLQUF2QztBQUNBLFVBQU0sTUFBTSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLEtBQXJDOztBQUVBLFdBQUssbUJBQUwsQ0FBeUIsQ0FBekIsRUFBNEIsT0FBNUIsQ0FBb0MsVUFBQyxZQUFELEVBQWtCO0FBQ3BELHFCQUFhO0FBQ1gsZ0JBQU0sSUFESztBQUVYLGlCQUFPLEtBRkk7QUFHWCxlQUFLO0FBSE0sU0FBYjtBQUtELE9BTkQ7QUFPRDs7QUFFRDs7Ozs7Ozs7Ozs7OytDQVMyQixZLEVBQWMsTSxFQUFRO0FBQy9DLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyw0QkFBTCxDQUFrQyxDQUFsQyxJQUF1QyxLQUFLLDRCQUFMLENBQWtDLElBQWxDLENBQXVDLElBQXZDLENBQXZDO0FBQ0EsYUFBSyw0QkFBTCxDQUFrQyxDQUFsQyxFQUFxQyxJQUFyQyxDQUEwQyxZQUExQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssNEJBQUwsQ0FBa0MsQ0FBbEMsRUFBcUMsTUFBckMsQ0FBNEMsS0FBSyw0QkFBTCxDQUFrQyxPQUFsQyxDQUEwQyxDQUFDLFlBQUQsQ0FBMUMsQ0FBNUMsRUFBdUcsQ0FBdkc7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUNYLEtBQUssNEJBRE0sRUFFWCxNQUZXLEVBR1gsS0FBSyw0QkFBTCxDQUFrQyxDQUFsQyxDQUhXLENBQWI7QUFLRDs7O2lEQUU0QixLLEVBQU87QUFDbEMsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCOztBQUVBO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsQ0FBdEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixDQUF0QztBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLENBQXRDO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsQ0FBdEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixDQUF0QztBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLENBQXRDO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsQ0FBdEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixDQUF0QztBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLENBQXRDOztBQUVBLFdBQUssNEJBQUwsQ0FBa0MsQ0FBbEMsRUFBcUMsT0FBckMsQ0FBNkMsVUFBQyxZQUFELEVBQWtCO0FBQzdELHFCQUFhO0FBQ1gsZ0JBQU0sQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsQ0FESztBQUVYLGdCQUFNLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBRks7QUFHWCxnQkFBTSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYjtBQUhLLFNBQWI7QUFLRCxPQU5EO0FBT0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt3Q0FTb0IsWSxFQUFjLE0sRUFBUTtBQUN4QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUsscUJBQUwsQ0FBMkIsQ0FBM0IsSUFBZ0MsS0FBSyxxQkFBTCxDQUEyQixJQUEzQixDQUFnQyxJQUFoQyxDQUFoQztBQUNBLGFBQUsscUJBQUwsQ0FBMkIsQ0FBM0IsRUFBOEIsSUFBOUIsQ0FBbUMsWUFBbkM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLHFCQUFMLENBQTJCLENBQTNCLEVBQThCLE1BQTlCLENBQXFDLEtBQUsscUJBQUwsQ0FBMkIsT0FBM0IsQ0FBbUMsQ0FBQyxZQUFELENBQW5DLENBQXJDLEVBQXlGLENBQXpGO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyxxQkFBaEMsRUFBdUQsTUFBdkQsRUFBK0QsS0FBSyxxQkFBTCxDQUEyQixDQUEzQixDQUEvRCxDQUFiO0FBQ0Q7OzswQ0FFcUIsSyxFQUFPO0FBQzNCLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjs7QUFFQTtBQUNBLFVBQU0sVUFBVSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLEtBQXpDOztBQUVBLFdBQUsscUJBQUwsQ0FBMkIsQ0FBM0IsRUFBOEIsT0FBOUIsQ0FBc0MsVUFBQyxZQUFELEVBQWtCO0FBQ3RELHFCQUFhO0FBQ1gsaUJBQU8sT0FESTtBQUVYLGdCQUFNO0FBRkssU0FBYjtBQUlELE9BTEQ7QUFNRDs7QUFFRDs7Ozs7Ozs7Ozs7OzhDQVMwQixZLEVBQWMsTSxFQUFRO0FBQzlDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSywyQkFBTCxDQUFpQyxDQUFqQyxJQUFzQyxLQUFLLDJCQUFMLENBQWlDLElBQWpDLENBQXNDLElBQXRDLENBQXRDO0FBQ0EsYUFBSywyQkFBTCxDQUFpQyxDQUFqQyxFQUFvQyxJQUFwQyxDQUF5QyxZQUF6QztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssMkJBQUwsQ0FBaUMsQ0FBakMsRUFBb0MsTUFBcEMsQ0FBMkMsS0FBSywyQkFBTCxDQUFpQyxPQUFqQyxDQUF5QyxDQUFDLFlBQUQsQ0FBekMsQ0FBM0MsRUFBcUcsQ0FBckc7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUNYLEtBQUssMkJBRE0sRUFFWCxNQUZXLEVBR1gsS0FBSywyQkFBTCxDQUFpQyxDQUFqQyxDQUhXLENBQWI7QUFLRDs7O2dEQUUyQixLLEVBQU87QUFDakMsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxJQUFJLEtBQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQixJQUFuQixDQUFWO0FBQ0EsVUFBTSxJQUFJLEtBQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQixJQUFuQixDQUFWO0FBQ0EsVUFBTSxJQUFJLEtBQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQixJQUFuQixDQUFWOztBQUVBLFdBQUssMkJBQUwsQ0FBaUMsQ0FBakMsRUFBb0MsT0FBcEMsQ0FBNEMsVUFBQyxZQUFELEVBQWtCO0FBQzVELHFCQUFhO0FBQ1gsYUFBRyxDQURRO0FBRVgsYUFBRyxDQUZRO0FBR1gsYUFBRztBQUhRLFNBQWI7QUFLRCxPQU5EO0FBT0Q7O0FBRUQ7O0FBRUE7Ozs7cUNBRWlCLE0sRUFBUTtBQUN2QjtBQUNBLFVBQUksS0FBSyx1QkFBTCxLQUFpQyxTQUFyQyxFQUFnRDtBQUM5QyxhQUFLLHVCQUFMLEdBQStCLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBQyxDQUFOLEVBQVMsQ0FBQyxDQUFWLEVBQWEsQ0FBQyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCLENBQUMsQ0FBOUIsRUFBaUMsQ0FBQyxDQUFsQyxFQUFxQyxDQUFDLENBQXRDLEVBQXlDLENBQUMsQ0FBMUMsRUFBNkMsQ0FBN0MsRUFBZ0QsQ0FBaEQsRUFBbUQsQ0FBbkQsRUFBc0QsQ0FBdEQsQ0FBL0I7QUFDRDtBQUNELFVBQUksS0FBSywyQkFBTCxLQUFxQyxTQUF6QyxFQUFvRDtBQUNsRCxhQUFLLDJCQUFMLEdBQW1DLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFBMEIsRUFBMUIsRUFBOEIsRUFBOUIsRUFBa0MsRUFBbEMsRUFBc0MsRUFBdEMsRUFBMEMsRUFBMUMsRUFBOEMsRUFBOUMsRUFBa0QsRUFBbEQsRUFBc0QsRUFBdEQsRUFBMEQsRUFBMUQsRUFBOEQsRUFBOUQsRUFBa0UsRUFBbEUsRUFBc0UsRUFBdEUsRUFBMEUsRUFBMUUsRUFBOEUsRUFBOUUsRUFBa0YsRUFBbEYsRUFBc0YsRUFBdEYsRUFBMEYsRUFBMUYsRUFBOEYsRUFBOUYsRUFBa0csRUFBbEcsRUFBc0csRUFBdEcsRUFBMEcsRUFBMUcsRUFBOEcsR0FBOUcsRUFBbUgsR0FBbkgsRUFBd0gsR0FBeEgsRUFBNkgsR0FBN0gsRUFBa0ksR0FBbEksRUFBdUksR0FBdkksRUFBNEksR0FBNUksRUFBaUosR0FBakosRUFDakMsR0FEaUMsRUFDNUIsR0FENEIsRUFDdkIsR0FEdUIsRUFDbEIsR0FEa0IsRUFDYixHQURhLEVBQ1IsR0FEUSxFQUNILEdBREcsRUFDRSxHQURGLEVBQ08sR0FEUCxFQUNZLEdBRFosRUFDaUIsR0FEakIsRUFDc0IsR0FEdEIsRUFDMkIsR0FEM0IsRUFDZ0MsR0FEaEMsRUFDcUMsR0FEckMsRUFDMEMsR0FEMUMsRUFDK0MsSUFEL0MsRUFDcUQsSUFEckQsRUFDMkQsSUFEM0QsRUFDaUUsSUFEakUsRUFDdUUsSUFEdkUsRUFDNkUsSUFEN0UsRUFDbUYsSUFEbkYsRUFDeUYsSUFEekYsRUFDK0YsSUFEL0YsRUFDcUcsSUFEckcsRUFDMkcsSUFEM0csRUFDaUgsSUFEakgsRUFDdUgsSUFEdkgsRUFDNkgsSUFEN0gsRUFDbUksSUFEbkksRUFDeUksSUFEekksRUFDK0ksSUFEL0ksRUFDcUosSUFEckosRUFFakMsSUFGaUMsRUFFM0IsSUFGMkIsRUFFckIsSUFGcUIsRUFFZixJQUZlLEVBRVQsSUFGUyxFQUVILElBRkcsRUFFRyxLQUZILEVBRVUsS0FGVixFQUVpQixLQUZqQixFQUV3QixLQUZ4QixFQUUrQixLQUYvQixFQUVzQyxLQUZ0QyxFQUU2QyxLQUY3QyxFQUVvRCxLQUZwRCxFQUUyRCxLQUYzRCxFQUVrRSxLQUZsRSxFQUV5RSxLQUZ6RSxFQUVnRixLQUZoRixFQUV1RixLQUZ2RixDQUFuQztBQUdEO0FBQ0QsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLHdCQUFMLENBQThCLENBQTlCLElBQW1DLEtBQUssd0JBQUwsQ0FBOEIsSUFBOUIsQ0FBbUMsSUFBbkMsQ0FBbkM7QUFDQTtBQUNBLFlBQUksS0FBSyxRQUFMLEtBQWtCLFNBQXRCLEVBQWlDO0FBQy9CLGNBQU0sZUFBZSxPQUFPLFlBQVAsSUFBdUIsT0FBTyxrQkFBbkQ7QUFDQSxlQUFLLFFBQUwsR0FBZ0IsSUFBSSxZQUFKLEVBQWhCO0FBQ0Q7QUFDRjtBQUNELGFBQU8sS0FBSyxxQkFBTCxDQUEyQixLQUFLLHdCQUFoQyxFQUEwRCxNQUExRCxFQUFrRSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBQWxFLENBQVA7QUFDRDs7OzZDQUN3QixLLEVBQU87QUFDOUIsVUFBTSxjQUFjLE1BQU0sTUFBTixDQUFhLEtBQWIsQ0FBbUIsTUFBdkM7QUFDQSxVQUFNLFFBQVE7QUFDWixnQkFBUSxJQUFJLFFBQUosQ0FBYSxZQUFZLEtBQVosQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBYixDQURJO0FBRVosY0FBTSxJQUFJLFFBQUosQ0FBYSxZQUFZLEtBQVosQ0FBa0IsQ0FBbEIsQ0FBYjtBQUZNLE9BQWQ7QUFJQSxVQUFNLGVBQWUsS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQXJCO0FBQ0EsV0FBSyxpQkFBTCxDQUF1QixZQUF2QjtBQUNEO0FBQ0Q7Ozs7aUNBQ2EsSyxFQUFPO0FBQ2xCO0FBQ0EsVUFBTSx3QkFBd0IsTUFBTSxJQUFOLENBQVcsVUFBekM7QUFDQSxVQUFNLGNBQWMsSUFBSSxXQUFKLENBQWdCLEdBQWhCLENBQXBCO0FBQ0EsVUFBTSxNQUFNLElBQUksUUFBSixDQUFhLFdBQWIsQ0FBWjtBQUNBLFVBQUksYUFBSjtBQUNBLFVBQUksYUFBYSxLQUFqQjtBQUNBLFVBQUksY0FBYyxDQUFsQjtBQUNBLFVBQUksUUFBUSxDQUFaO0FBQ0EsVUFBSSxPQUFPLENBQVg7QUFDQSxVQUFJLGFBQUo7O0FBRUE7QUFDQSxVQUFJLGlCQUFpQixNQUFNLE1BQU4sQ0FBYSxRQUFiLENBQXNCLENBQXRCLEVBQXlCLEtBQXpCLENBQXJCO0FBQ0E7QUFDQSxVQUFJLFFBQVEsTUFBTSxNQUFOLENBQWEsT0FBYixDQUFxQixDQUFyQixDQUFaO0FBQ0EsVUFBSSxRQUFRLENBQVosRUFBZTtBQUNiLGdCQUFRLENBQVI7QUFDRDtBQUNELFVBQUksUUFBUSxFQUFaLEVBQWdCO0FBQ2QsZ0JBQVEsRUFBUjtBQUNEO0FBQ0QsYUFBTyxLQUFLLDJCQUFMLENBQWlDLEtBQWpDLENBQVA7QUFDQSxXQUFLLElBQUksTUFBTSxDQUFWLEVBQWEsT0FBTyxDQUF6QixFQUE0QixNQUFNLHFCQUFsQyxFQUF5RCxRQUFRLENBQWpFLEVBQW9FO0FBQ2xFO0FBQ0EsWUFBSSxVQUFKLEVBQWdCO0FBQ2Qsa0JBQVEsY0FBYyxJQUF0QjtBQUNBO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsd0JBQWMsTUFBTSxJQUFOLENBQVcsT0FBWCxDQUFtQixHQUFuQixDQUFkO0FBQ0Esa0JBQVMsZUFBZSxDQUFoQixHQUFxQixJQUE3QjtBQUNEO0FBQ0QscUJBQWEsQ0FBQyxVQUFkO0FBQ0E7QUFDQSxpQkFBUyxLQUFLLHVCQUFMLENBQTZCLEtBQTdCLENBQVQ7QUFDQSxZQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2Isa0JBQVEsQ0FBUjtBQUNEO0FBQ0QsWUFBSSxRQUFRLEVBQVosRUFBZ0I7QUFDZCxrQkFBUSxFQUFSO0FBQ0Q7QUFDRDtBQUNBLGVBQU8sUUFBUSxDQUFmO0FBQ0EsZ0JBQVEsUUFBUSxDQUFoQjtBQUNBO0FBQ0EsZUFBUSxRQUFRLENBQWhCO0FBQ0EsWUFBSSxDQUFDLFFBQVEsQ0FBVCxJQUFjLENBQWxCLEVBQXFCO0FBQ25CLGtCQUFRLElBQVI7QUFDRDtBQUNELFlBQUksQ0FBQyxRQUFRLENBQVQsSUFBYyxDQUFsQixFQUFxQjtBQUNuQixrQkFBUyxRQUFRLENBQWpCO0FBQ0Q7QUFDRCxZQUFJLENBQUMsUUFBUSxDQUFULElBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsa0JBQVMsUUFBUSxDQUFqQjtBQUNEO0FBQ0QsWUFBSSxPQUFPLENBQVgsRUFBYztBQUNaLDRCQUFrQixJQUFsQjtBQUNELFNBRkQsTUFFTztBQUNMLDRCQUFrQixJQUFsQjtBQUNEO0FBQ0Q7QUFDQSxZQUFJLGlCQUFpQixLQUFyQixFQUE0QjtBQUMxQiwyQkFBaUIsS0FBakI7QUFDRCxTQUZELE1BRU8sSUFBSSxpQkFBaUIsQ0FBQyxLQUF0QixFQUE2QjtBQUNsQywyQkFBaUIsQ0FBQyxLQUFsQjtBQUNEO0FBQ0Q7QUFDQSxlQUFPLEtBQUssMkJBQUwsQ0FBaUMsS0FBakMsQ0FBUDtBQUNBO0FBQ0EsWUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixjQUFuQixFQUFtQyxJQUFuQztBQUNEO0FBQ0QsYUFBTyxHQUFQO0FBQ0Q7OztzQ0FDaUIsSyxFQUFPO0FBQ3ZCLFVBQUksS0FBSyxXQUFMLEtBQXFCLFNBQXpCLEVBQW9DO0FBQ2xDLGFBQUssV0FBTCxHQUFtQixFQUFuQjtBQUNEO0FBQ0QsV0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLEtBQXRCO0FBQ0EsVUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBckIsRUFBNkI7QUFDM0IsYUFBSyxxQkFBTDtBQUNEO0FBQ0Y7Ozs0Q0FDdUI7QUFDdEIsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsR0FBMEIsQ0FBakMsRUFBb0M7QUFDbEMsWUFBTSxhQUFhLElBQW5CLENBRGtDLENBQ1Q7QUFDekIsWUFBTSxTQUFTLEtBQUssV0FBTCxDQUFpQixLQUFqQixFQUFmO0FBQ0EsWUFBTSxXQUFXLENBQWpCO0FBQ0EsWUFBTSxhQUFhLE9BQU8sVUFBUCxHQUFvQixDQUF2QztBQUNBLFlBQUksS0FBSyxjQUFMLEtBQXdCLFNBQTVCLEVBQXVDO0FBQ3JDLGVBQUssY0FBTCxHQUFzQixDQUF0QjtBQUNEO0FBQ0QsWUFBTSxnQkFBZ0IsS0FBSyxRQUFMLENBQWMsWUFBZCxDQUEyQixRQUEzQixFQUFxQyxVQUFyQyxFQUFpRCxLQUFqRCxDQUF0QjtBQUNBO0FBQ0EsWUFBTSxlQUFlLGNBQWMsY0FBZCxDQUE2QixDQUE3QixDQUFyQjtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLFVBQVAsR0FBb0IsQ0FBeEMsRUFBMkMsR0FBM0MsRUFBZ0Q7QUFDOUMsdUJBQWEsQ0FBYixJQUFrQixPQUFPLFFBQVAsQ0FBZ0IsSUFBSSxDQUFwQixFQUF1QixJQUF2QixJQUErQixPQUFqRDtBQUNEO0FBQ0QsWUFBTSxTQUFTLEtBQUssUUFBTCxDQUFjLGtCQUFkLEVBQWY7QUFDQSxlQUFPLE1BQVAsR0FBZ0IsYUFBaEI7QUFDQSxlQUFPLE9BQVAsQ0FBZSxLQUFLLFFBQUwsQ0FBYyxXQUE3QjtBQUNBLFlBQUksS0FBSyxjQUFMLEtBQXdCLENBQTVCLEVBQStCO0FBQzdCLGVBQUssY0FBTCxHQUFzQixLQUFLLFFBQUwsQ0FBYyxXQUFkLEdBQTRCLFVBQWxEO0FBQ0Q7QUFDRCxlQUFPLEtBQVAsQ0FBYSxLQUFLLGNBQWxCO0FBQ0EsYUFBSyxjQUFMLElBQXVCLE9BQU8sTUFBUCxDQUFjLFFBQXJDO0FBQ0Q7QUFDRjtBQUNEOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs0Q0FNd0I7QUFDdEIsVUFBSTtBQUNGLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUsscUJBQXBCLENBQTNCO0FBQ0EsWUFBTSxRQUFRLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFkOztBQUVBLGVBQU87QUFDTCxpQkFBTyxLQURGO0FBRUwsZ0JBQU07QUFGRCxTQUFQO0FBSUQsT0FSRCxDQVFFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OzZDQVN5QixZLEVBQWMsTSxFQUFRO0FBQzdDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSywwQkFBTCxDQUFnQyxDQUFoQyxJQUFxQyxLQUFLLDBCQUFMLENBQWdDLElBQWhDLENBQXFDLElBQXJDLENBQXJDO0FBQ0EsYUFBSywwQkFBTCxDQUFnQyxDQUFoQyxFQUFtQyxJQUFuQyxDQUF3QyxZQUF4QztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssMEJBQUwsQ0FBZ0MsQ0FBaEMsRUFBbUMsTUFBbkMsQ0FBMEMsS0FBSywwQkFBTCxDQUFnQyxPQUFoQyxDQUF3QyxDQUFDLFlBQUQsQ0FBeEMsQ0FBMUMsRUFBbUcsQ0FBbkc7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLHFCQUFoQyxFQUF1RCxNQUF2RCxFQUErRCxLQUFLLDBCQUFMLENBQWdDLENBQWhDLENBQS9ELENBQWI7QUFDRDs7OytDQUUwQixLLEVBQU87QUFDaEMsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxRQUFRLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBZDs7QUFFQSxXQUFLLDBCQUFMLENBQWdDLENBQWhDLEVBQW1DLE9BQW5DLENBQTJDLFVBQUMsWUFBRCxFQUFrQjtBQUMzRCxxQkFBYTtBQUNYLGlCQUFPLEtBREk7QUFFWCxnQkFBTTtBQUZLLFNBQWI7QUFJRCxPQUxEO0FBTUQ7Ozs7OztBQUdIOzs7QUM5cEVBOzs7Ozs7Ozs7OztBQUVBOzs7Ozs7OztJQUVhLGdCLFdBQUEsZ0I7Ozs7Ozs7Ozs7O3dDQUlXO0FBQ2xCLFVBQUksQ0FBQyxLQUFLLFVBQVYsRUFBc0I7QUFDcEIsWUFBTSxXQUFXLEtBQUssV0FBTCxDQUFpQixRQUFsQztBQUNBLFlBQUksUUFBSixFQUFjO0FBQ1osY0FBSSxDQUFDLEtBQUssV0FBTCxDQUFpQixnQkFBdEIsRUFBd0M7QUFDdEMsaUJBQUssV0FBTCxDQUFpQixnQkFBakIsR0FBb0MsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQXBDO0FBQ0EsaUJBQUssV0FBTCxDQUFpQixnQkFBakIsQ0FBa0MsU0FBbEMsR0FBOEMsUUFBOUM7QUFDRDtBQUNELGVBQUssWUFBTCxDQUFrQixFQUFDLE1BQU0sTUFBUCxFQUFsQjtBQUNBLGNBQU0sTUFBTSxTQUFTLFVBQVQsQ0FDVixLQUFLLFdBQUwsQ0FBaUIsZ0JBQWpCLENBQWtDLE9BRHhCLEVBQ2lDLElBRGpDLENBQVo7QUFFQSxlQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsQ0FBNEIsR0FBNUI7QUFDRDtBQUNGO0FBQ0Q7QUFDRDs7O3dCQWxCcUI7QUFDcEI7QUFDRDs7OztFQUhpQywrQkFBZSxXQUFmLEM7O0lBc0J6QixPLFdBQUEsTzs7Ozs7Ozs7Ozs7d0JBQ2E7QUFDcEI7QUFJRDs7OztFQU53QixnQjs7QUFTM0IsZUFBZSxNQUFmLENBQXNCLFVBQXRCLEVBQWtDLE9BQWxDOztJQUVXLE8sV0FBQSxPOzs7Ozs7Ozs7Ozt3QkFDYTtBQUNwQjtBQXNCRDs7OztFQXhCd0IsZ0I7O0FBMEIzQixlQUFlLE1BQWYsQ0FBc0IsVUFBdEIsRUFBa0MsT0FBbEM7O0lBRVcsSyxXQUFBLEs7Ozs7Ozs7Ozs7O3dCQUNhO0FBQ3BCO0FBNENEOzs7O0VBOUNzQixnQjs7QUFnRHpCLGVBQWUsTUFBZixDQUFzQixRQUF0QixFQUFnQyxLQUFoQzs7Ozs7Ozs7Ozs7OztRQ1JjLGMsR0FBQSxjOzs7Ozs7Ozs7O0FBekdoQjs7Ozs7Ozs7OztBQVVBLElBQU0sY0FBYyxZQUFwQjtBQUNBLElBQU0sWUFBWSxVQUFsQjs7QUFFQTs7Ozs7OztBQU9BLFNBQVMsZUFBVCxDQUF5QixPQUF6QixFQUFrQztBQUNoQyxNQUFJLENBQUMsUUFBUSxVQUFiLEVBQXlCO0FBQ3ZCLFlBQVEsV0FBUixJQUF1QixJQUF2QjtBQUNBO0FBQ0Q7QUFDRCxRQUFNLElBQU4sQ0FBVyxRQUFRLFVBQVIsQ0FBbUIsZ0JBQW5CLENBQW9DLE9BQXBDLENBQVgsRUFBeUQsT0FBekQsQ0FBaUUsaUJBQVM7QUFDeEUsUUFBTSxPQUFPLHVCQUF1QixPQUF2QixFQUFnQyxNQUFNLFdBQXRDLENBQWI7QUFDQSxRQUFJLEtBQUssS0FBVCxFQUFnQjtBQUFBOztBQUNkLGNBQVEsV0FBUixJQUF1QixRQUFRLFdBQVIsS0FBd0IsRUFBL0M7QUFDQSxzQ0FBUSxXQUFSLEdBQXFCLElBQXJCLGdEQUE2QixLQUFLLEtBQWxDO0FBQ0EsWUFBTSxXQUFOLEdBQW9CLEtBQUssR0FBekI7QUFDRDtBQUNGLEdBUEQ7QUFRRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7QUFDL0IsTUFBSSxDQUFDLFFBQVEsY0FBUixDQUF1QixZQUF2QixDQUFMLEVBQTJDO0FBQ3pDLG9CQUFnQixPQUFoQjtBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxrQkFBVCxDQUE0QixPQUE1QixFQUFxQztBQUNuQyxpQkFBZSxPQUFmO0FBQ0EsU0FBTyxRQUFRLFdBQVIsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFTLHNCQUFULENBQWdDLE9BQWhDLEVBQXlDLE9BQXpDLEVBQWtEO0FBQ2hELE1BQUksY0FBSjtBQUNBLE1BQUksTUFBTSxRQUFRLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBdUIsVUFBQyxDQUFELEVBQUksUUFBSixFQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFBMEIsV0FBMUIsRUFBdUMsUUFBdkMsRUFBb0Q7QUFDbkYsWUFBUSxTQUFTLEVBQWpCO0FBQ0EsUUFBSSxRQUFRLEVBQVo7QUFDQSxRQUFNLGFBQWEsU0FBUyxLQUFULENBQWUsU0FBZixDQUFuQjtBQUNBLGVBQVcsT0FBWCxDQUFtQixnQkFBUTtBQUN6QixVQUFNLElBQUksS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFWO0FBQ0EsVUFBTSxPQUFPLEVBQUUsS0FBRixHQUFVLElBQVYsRUFBYjtBQUNBLFVBQU0sUUFBUSxFQUFFLElBQUYsQ0FBTyxHQUFQLENBQWQ7QUFDQSxZQUFNLElBQU4sSUFBYyxLQUFkO0FBQ0QsS0FMRDtBQU1BLFFBQU0sS0FBSyxpQkFBaUIsT0FBakIsQ0FBWDtBQUNBLFVBQU0sSUFBTixDQUFXLEVBQUMsa0JBQUQsRUFBVyx3QkFBWCxFQUF3QixVQUF4QixFQUE4QixZQUE5QixFQUFxQyxTQUFTLFFBQVEsS0FBdEQsRUFBWDtBQUNBLFFBQUksWUFBWSxFQUFoQjtBQUNBLFNBQUssSUFBSSxDQUFULElBQWMsS0FBZCxFQUFxQjtBQUNuQixrQkFBZSxTQUFmLFlBQStCLFdBQVcsRUFBWCxFQUFlLElBQWYsRUFBcUIsQ0FBckIsRUFBd0IsV0FBeEIsQ0FBL0IsVUFBd0UsTUFBTSxDQUFOLENBQXhFO0FBQ0Q7QUFDRCxtQkFBWSxZQUFZLEdBQXhCLGVBQW9DLFVBQVUsSUFBVixFQUFwQztBQUNELEdBakJTLENBQVY7QUFrQkEsU0FBTyxFQUFDLFlBQUQsRUFBUSxRQUFSLEVBQVA7QUFDRDs7QUFFRDtBQUNBLElBQUksU0FBUyxDQUFiO0FBQ0EsU0FBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQztBQUNqQyxNQUFJLFFBQVEsU0FBUixLQUFzQixTQUExQixFQUFxQztBQUNuQyxZQUFRLFNBQVIsSUFBcUIsUUFBckI7QUFDRDtBQUNELFNBQU8sUUFBUSxTQUFSLENBQVA7QUFDRDs7QUFFRCxJQUFNLFFBQVEsU0FBZDtBQUNBLElBQU0sUUFBUSxrRUFBZDs7QUFFQTtBQUNBLFNBQVMsVUFBVCxDQUFvQixFQUFwQixFQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQyxXQUFwQyxFQUFpRDtBQUMvQyxpQkFBYSxFQUFiLGNBQXdCLElBQXhCLFNBQWdDLElBQWhDLElBQXVDLG9CQUFrQixZQUFZLE9BQVosQ0FBb0IsS0FBcEIsRUFBMkIsRUFBM0IsQ0FBbEIsR0FBcUQsRUFBNUY7QUFDRDs7QUFFRDs7Ozs7QUFLTyxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7QUFDdEMsTUFBSSxRQUFRLFVBQVosRUFBd0I7QUFDdEIsUUFBTSxXQUFXLFFBQVEsVUFBUixDQUFtQixhQUFuQixDQUFpQyxjQUFqQyxDQUFqQjtBQUNBLFFBQUksUUFBSixFQUFjO0FBQ1osZUFBUyxVQUFULENBQW9CLFdBQXBCLENBQWdDLFFBQWhDO0FBQ0Q7QUFDRjtBQUNELE1BQU0sT0FBTyxRQUFRLFdBQVIsR0FBc0IsSUFBbkM7QUFDQSxNQUFJLElBQUosRUFBVTtBQUNSO0FBQ0E7QUFDQSxtQkFBZSxJQUFmO0FBQ0EsUUFBTSxNQUFNLGlCQUFpQixPQUFqQixDQUFaO0FBQ0EsUUFBSSxHQUFKLEVBQVM7QUFDUCxVQUFNLFdBQVcsU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQWpCO0FBQ0EsZUFBUyxXQUFULEdBQXVCLEdBQXZCO0FBQ0EsY0FBUSxVQUFSLENBQW1CLFdBQW5CLENBQStCLFFBQS9CO0FBQ0Q7QUFDRjtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7QUFZQSxTQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DO0FBQ2pDLGlCQUFlLE9BQWY7QUFDQSxNQUFNLEtBQUssaUJBQWlCLE9BQWpCLENBQVg7QUFDQSxNQUFNLFlBQVksUUFBUSxVQUFSLENBQW1CLGdCQUFuQixDQUFvQyxRQUFwQyxDQUFsQjtBQUNBLE1BQUksTUFBTSxFQUFWO0FBQ0EsT0FBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUksVUFBVSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUN2QyxRQUFNLE9BQU8sVUFBVSxDQUFWLEVBQWEsWUFBYixDQUEwQixNQUExQixDQUFiO0FBQ0EsUUFBTSxXQUFXLGlCQUFpQixJQUFqQixDQUFqQjtBQUNBLFVBQVMsR0FBVCxZQUFtQixnQkFBZ0IsUUFBaEIsRUFBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsQ0FBbkI7QUFDRDtBQUNELFNBQU8sR0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsU0FBUyxlQUFULENBQXlCLFFBQXpCLEVBQW1DLElBQW5DLEVBQXlDLE9BQXpDLEVBQWtEO0FBQ2hELE1BQUksT0FBTyxFQUFYO0FBQ0EsV0FBUyxPQUFULENBQWlCLGdCQUFRO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLLE9BQVYsRUFBbUI7QUFDakIsVUFBTSxRQUFRLGFBQWEsS0FBSyxJQUFsQixFQUF3QixPQUF4QixDQUFkO0FBQ0EsVUFBSSxLQUFKLEVBQVc7QUFDVCxhQUFLLElBQUksTUFBVCxJQUFtQixLQUFuQixFQUEwQjtBQUN4QixjQUFJLGNBQWMsTUFBTSxNQUFOLENBQWxCO0FBQ0EsY0FBSSxZQUFZLEVBQWhCO0FBQ0EsZUFBSyxJQUFJLENBQVQsSUFBYyxXQUFkLEVBQTJCO0FBQ3pCLHNCQUFVLElBQVYsQ0FBa0IsQ0FBbEIsVUFBd0IsWUFBWSxDQUFaLENBQXhCO0FBQ0Q7QUFDRCxpQkFBVSxJQUFWLGlCQUEwQixJQUExQixVQUFtQyxNQUFuQyxjQUFrRCxVQUFVLElBQVYsQ0FBZSxNQUFmLENBQWxEO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsR0FkRDtBQWVBLFNBQU8sSUFBUDtBQUNEOztBQUVEOzs7OztBQUtBLFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0M7QUFDOUIsTUFBTSxTQUFTLE9BQU8sS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFQLEdBQStCLEVBQTlDO0FBQ0EsTUFBSSxRQUFRLEVBQVo7QUFDQSxTQUFPLE9BQVAsQ0FBZSxhQUFLO0FBQ2xCLFFBQU0sSUFBSSxJQUFJLEVBQUUsS0FBRixDQUFRLDRCQUFSLENBQUosR0FBNEMsRUFBdEQ7QUFDQSxRQUFJLENBQUosRUFBTztBQUNMLFlBQU0sSUFBTixDQUFXLEVBQUMsTUFBTSxFQUFFLENBQUYsS0FBUSxFQUFFLENBQUYsQ0FBZixFQUFxQixTQUFTLEVBQUUsQ0FBRixJQUFPLEVBQUUsQ0FBRixDQUFQLEdBQWMsSUFBNUMsRUFBWDtBQUNEO0FBQ0YsR0FMRDtBQU1BLFNBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQVdBLFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixPQUE1QixFQUFxQyxZQUFyQyxFQUFtRDtBQUNqRCxNQUFNLE9BQU8sV0FBVyxRQUFRLFdBQVIsR0FBc0IsSUFBOUM7QUFDQSxNQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1Q7QUFDRDtBQUNEO0FBQ0EsTUFBSSxRQUFRLGlCQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QixZQUE3QixDQUFaO0FBQ0E7QUFDQSxNQUFNLGFBQWEsYUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLENBQW5CO0FBQ0EsVUFBUSxhQUFhLEtBQWIsRUFBb0IsVUFBcEIsQ0FBUjtBQUNBO0FBQ0EsTUFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDakI7QUFDQSxRQUFNLFdBQVcsaUJBQWlCLFFBQVEsWUFBUixDQUFxQixNQUFyQixDQUFqQixDQUFqQjtBQUNBO0FBQ0EsYUFBUyxPQUFULENBQWlCLGdCQUFRO0FBQ3ZCLFVBQUksV0FBVyxLQUFLLE9BQUwsSUFBaUIsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixLQUE2QixDQUE3RDtBQUNBLFVBQUksUUFBUSxLQUFLLE9BQWIsSUFBd0IsUUFBNUIsRUFBc0M7QUFDcEMsWUFBTSxlQUFlLFdBQVcsS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixHQUFsQixFQUF1QixJQUF2QixDQUFYLEdBQTBDLEtBQUssSUFBcEU7QUFDQSxZQUFNLFlBQVksYUFBYSxZQUFiLEVBQTJCLElBQTNCLENBQWxCO0FBQ0EsZ0JBQVEsYUFBYSxLQUFiLEVBQW9CLFNBQXBCLENBQVI7QUFDRDtBQUNGLEtBUEQ7QUFRRDs7QUFFRCxTQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsWUFBekMsRUFBdUQ7QUFDckQsTUFBSSxjQUFKO0FBQ0EsTUFBTSxRQUFRLG1CQUFtQixPQUFuQixDQUFkO0FBQ0EsTUFBSSxLQUFKLEVBQVc7QUFDVCxRQUFNLEtBQUssaUJBQWlCLE9BQWpCLENBQVg7QUFDQSxRQUFJLEtBQUosRUFBVztBQUNULFlBQU0sT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFlBQUksS0FBSyxJQUFMLElBQWEsSUFBYixLQUFzQixDQUFDLFlBQUQsSUFBaUIsS0FBSyxPQUE1QyxDQUFKLEVBQTBEO0FBQ3hELGtCQUFRLGFBQWEsS0FBYixFQUFvQixJQUFwQixFQUEwQixFQUExQixFQUE4QixJQUE5QixDQUFSO0FBQ0Q7QUFDRixPQUpEO0FBS0Q7QUFDRjtBQUNELFNBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCLElBQTdCLEVBQW1DLEVBQW5DLEVBQXVDLElBQXZDLEVBQTZDO0FBQzNDLFVBQVEsU0FBUyxFQUFqQjtBQUNBLE1BQU0sU0FBUyxLQUFLLFdBQUwsSUFBb0IsRUFBbkM7QUFDQSxNQUFNLElBQUksTUFBTSxNQUFOLElBQWdCLE1BQU0sTUFBTixLQUFpQixFQUEzQztBQUNBLE9BQUssSUFBSSxDQUFULElBQWMsS0FBSyxLQUFuQixFQUEwQjtBQUN4QixNQUFFLENBQUYsYUFBYyxXQUFXLEVBQVgsRUFBZSxJQUFmLEVBQXFCLENBQXJCLEVBQXdCLEtBQUssV0FBN0IsQ0FBZDtBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBUyxZQUFULENBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCO0FBQzFCLE1BQUksS0FBSyxDQUFULEVBQVk7QUFDVixTQUFLLElBQUksQ0FBVCxJQUFjLENBQWQsRUFBaUI7QUFDZjtBQUNBLFVBQUksQ0FBQyxFQUFFLENBQUYsQ0FBTCxFQUFXO0FBQ1QsVUFBRSxDQUFGLElBQU8sRUFBUDtBQUNEO0FBQ0QsYUFBTyxNQUFQLENBQWMsRUFBRSxDQUFGLENBQWQsRUFBb0IsRUFBRSxDQUFGLENBQXBCO0FBQ0Q7QUFDRjtBQUNELFNBQU8sS0FBSyxDQUFaO0FBQ0Q7O0FBRUQ7Ozs7QUFJTyxJQUFJLDBDQUFpQixTQUFqQixjQUFpQixhQUFjOztBQUV4QztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMENBRXNCO0FBQUE7O0FBQ2xCLG9JQUE2QjtBQUMzQjtBQUNEO0FBQ0QsOEJBQXNCO0FBQUEsaUJBQU0sT0FBSyxlQUFMLEVBQU47QUFBQSxTQUF0QjtBQUNEO0FBUEg7QUFBQTtBQUFBLHdDQVNvQjtBQUNoQix1QkFBZSxJQUFmO0FBQ0Q7QUFYSDs7QUFBQTtBQUFBLElBQW9DLFVBQXBDO0FBZUQsQ0FqQk07OztBQ3RTUDs7QUFFQTs7QUFDQTs7QUFHQTs7QUFHQTs7QUFLQTs7QUFHQTs7QUFHQTs7QUFJQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUV0QixZQUFNLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUF0Qzs7QUFHQSxZQUFJLGdCQUFKLENBQXFCO0FBQ2pCLGtCQUFNLGtCQURXO0FBRWpCLG9CQUFRLGdCQUZTO0FBR2pCLDBCQUFjO0FBSEcsU0FBckI7QUFLQSxZQUFJLGdCQUFKLENBQXFCO0FBQ2pCLGtCQUFNLGtCQURXO0FBRWpCLG9CQUFRLGdCQUZTO0FBR2pCLDBCQUFjO0FBSEcsU0FBckI7QUFLQSxZQUFJLGdCQUFKLENBQXFCO0FBQ2pCLGtCQUFNLGtCQURXO0FBRWpCLG9CQUFRLGdCQUZTO0FBR2pCLDBCQUFjO0FBSEcsU0FBckI7QUFLQSxZQUFJLGdCQUFKLENBQXFCO0FBQ2pCLGtCQUFNLGtCQURXO0FBRWpCLG9CQUFRLGdCQUZTO0FBR2pCLDBCQUFjO0FBSEcsU0FBckI7QUFLQSxZQUFJLGdCQUFKLENBQXFCO0FBQ2pCLGtCQUFNLGVBRFc7QUFFakIsb0JBQVEsZ0JBRlM7QUFHakIsMEJBQWM7QUFIRyxTQUFyQjtBQUtBLFNBQUMsSUFBSSxZQUFKLElBQW9CLFlBQXJCLEVBQW1DLFNBQW5DLENBQTZDLG9DQUE3QztBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1g7QUFDQTtBQUNBO0FBQ0gsU0FKRCxNQUlLLENBRUo7QUFERzs7O0FBR0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkg7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBdEVEOzs7QUN4QkE7Ozs7Ozs7O0lBRWEsUSxXQUFBLFEsR0FFWixvQkFBYTtBQUFBOztBQUNaLFFBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsWUFBSTtBQUMzQyxTQUFPLGVBQVAsRUFBd0IsRUFBeEIsRUFBNEIsQ0FBNUIsRUFDQyxJQURELENBQ00sZUFETixFQUN1QixJQUR2QixDQUM0QixJQUQ1QixFQUNrQyxLQURsQyxDQUN3QyxFQUR4QyxFQUVDLE1BRkQsQ0FFUSxXQUZSLEVBRXFCLElBRnJCLENBRTBCLEdBRjFCLEVBRStCLEtBRi9CLENBRXFDLEdBRnJDLEVBR0MsSUFIRCxDQUdNLG1CQUhOO0FBSUEsRUFMRDtBQU1BLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge1xyXG4gICAgVGhpbmd5XHJcbn0gZnJvbSAnLi9saWJzL3RoaW5neS5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJvbFByZXoge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy50aGluZ3lDb25uZWN0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHRoaXMudGhpbmd5Q29udHJvbC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB0aGluZ3lDb250cm9sKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRoaW5neUNvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHRoaW5neSA9IG5ldyBUaGluZ3koe1xyXG4gICAgICAgICAgICAgICAgbG9nRW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpbmd5LmNvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy50aGluZ3lDb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBiYXR0ZXJ5ID0gYXdhaXQgdGhpbmd5LmdldEJhdHRlcnlMZXZlbCgpO1xyXG4gICAgICAgICAgICBjb25zdCBwZXJtaXNzaW9uID0gYXdhaXQgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XHJcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9uID09PSBcImRlbmllZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9YCwgYmF0dGVyeSk7XHJcbiAgICAgICAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKFwiVGhpbmd5IENvbm5lY3QgISBcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGAgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9JWBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpbmd5LmJ1dHRvbkVuYWJsZSgoc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YXAnLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdGUpO1xyXG5cclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQge1xyXG4gICAgQXBwbHlDc3NcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUNzcy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBBcHBseUNvZGVNaXJvclxyXG59IGZyb20gJy4vaGVscGVyL2FwcGx5SnMuanMnO1xyXG5pbXBvcnQge05vaXNlfSBmcm9tICcuL2hvdWRpbmkvbm9pc2UuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlbW9zIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vUGFpbnRBcGkoKSB7XHJcbiAgICAgICAgLy8oQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLXdvcmtsZXQuanMnKTtcclxuICAgICAgICAvLyhDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9ub2lzZS13b3JrbGV0LmpzJyk7XHJcblxyXG5cclxuICAgICAgICAvL3JlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9mcmFtZUluY3JlbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfZnJhbWVJbmNyZW1lbnQoKXtcclxuICAgICAgICBpZiAodGhpcy5mcmFtZSA9PT0gOSkge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpLnN0eWxlLnNldFByb3BlcnR5KCctLWZyYW1lJywgdGhpcy5mcmFtZSk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2ZyYW1lSW5jcmVtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcclxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXHJcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxyXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAnYmxhY2tib2FyZCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgICAgICB0aGlzLnN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XHJcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuc3R5bGVTaGVldCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9ICcnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcclxuXHJcbiAgICAgICAgY29kZU1pcnJvckNzcy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgICAgICBjb2RlTWlycm9yQ3NzLm9uKCdjaGFuZ2UnLCAoLi4ub2JqKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3MoY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFwcGx5Q3NzKGluaXRpYWxDb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUNzcyh2YWx1ZSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0LmRlbGV0ZVJ1bGUoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuICAgICAgICB2YWx1ZS5zcGxpdCgnfScpXHJcbiAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKHNlbGVjdG9yQ3NzID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yQ3NzICsgJ30nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG1vZGUsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcclxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXHJcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAnYmxhY2tib2FyZCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29kZU1pcnJvckpTLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xyXG4gICAgfVxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuY29uc3QgTUlOX1RPUCA9ICcxMDBweCc7XHJcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIGtleUVsdCxcclxuICAgICAgICBwb3NpdGlvbkFycmF5XHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcclxuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcclxuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcclxuXHJcbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcclxuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvbiBpbiBKU1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlLWluLWpzJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIHRvcDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI2MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICczNTBweCcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIDo6UGFydFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncGFydCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBUZW1wbGF0ZSBJbnN0YW50aWF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICd0ZW1wbGF0ZS1pbnN0YW50aWF0aW9uJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEhUTUwgTW9kdWxlXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdodG1sLW1vZHVsZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTAsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUGFpbnQgQVBJXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwYWludC1hcGknLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMCxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxMixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyBnZW5lcmljIHNlbnNvclxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnZ2VuZXJpYy1zZW5zb3InLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWNjZWxlcm9tZXRlciBzZW5zb3JcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2FjY2VsZXJvbWV0ZXItc2Vuc29yJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgTm9pc2Uge1xyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLmNhbnZhcztcclxuXHRcdHRoaXMuY3R4O1xyXG5cdFx0dGhpcy53V2lkdGg7XHJcblx0XHR0aGlzLndIZWlnaHQ7XHJcblx0XHR0aGlzLm5vaXNlRGF0YSA9IFtdO1xyXG5cdFx0dGhpcy5mcmFtZSA9IDA7XHJcblx0XHR0aGlzLmxvb3BUaW1lb3V0O1xyXG5cclxuXHRcdHRoaXMuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0Ly8gQ3JlYXRlIE5vaXNlXHJcbiAgICBjcmVhdGVOb2lzZSgpIHtcclxuICAgICAgICBjb25zdCBpZGF0YSA9IHRoaXMuY3R4LmNyZWF0ZUltYWdlRGF0YSh0aGlzLndXaWR0aCwgdGhpcy53SGVpZ2h0KTtcclxuICAgICAgICBjb25zdCBidWZmZXIzMiA9IG5ldyBVaW50MzJBcnJheShpZGF0YS5kYXRhLmJ1ZmZlcik7XHJcbiAgICAgICAgY29uc3QgbGVuID0gYnVmZmVyMzIubGVuZ3RoO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIzMltpXSA9IDB4ZmYwMDAwMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm9pc2VEYXRhLnB1c2goaWRhdGEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gUGxheSBOb2lzZVxyXG4gICAgcGFpbnROb2lzZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5mcmFtZSA9PT0gOSkge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGhpcy5ub2lzZURhdGFbdGhpcy5mcmFtZV0sIDAsIDApO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gTG9vcFxyXG4gICAgbG9vcCgpIHtcclxuICAgICAgICB0aGlzLnBhaW50Tm9pc2UodGhpcy5mcmFtZSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9vcFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH0sICgxMDAwIC8gMjUpKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIFNldHVwXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICB0aGlzLndXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIHRoaXMud0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLndIZWlnaHQ7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU5vaXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvb3AoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEluaXRcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9pc2UnKTtcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXAoKTtcclxuICAgIH07XHJcbn1cclxuIiwiLyoqICovXHJcbmV4cG9ydCBjbGFzcyBUaGluZ3kge1xyXG4gIC8qKlxyXG4gICAgICogIFRoaW5neTo1MiBXZWIgQmx1ZXRvb3RoIEFQSS4gPGJyPlxyXG4gICAgICogIEJMRSBzZXJ2aWNlIGRldGFpbHMge0BsaW5rIGh0dHBzOi8vbm9yZGljc2VtaWNvbmR1Y3Rvci5naXRodWIuaW8vTm9yZGljLVRoaW5neTUyLUZXL2RvY3VtZW50YXRpb24vZmlybXdhcmVfYXJjaGl0ZWN0dXJlLmh0bWwjZndfYXJjaF9ibGVfc2VydmljZXMgaGVyZX1cclxuICAgICAqXHJcbiAgICAgKlxyXG4gICAgICogIEBjb25zdHJ1Y3RvclxyXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHtsb2dFbmFibGVkOiBmYWxzZX1dIC0gT3B0aW9ucyBvYmplY3QgZm9yIFRoaW5neVxyXG4gICAgICogIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5sb2dFbmFibGVkIC0gRW5hYmxlcyBsb2dnaW5nIG9mIGFsbCBCTEUgYWN0aW9ucy5cclxuICAgICAqXHJcbiAgICAqL1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7bG9nRW5hYmxlZDogZmFsc2V9KSB7XHJcbiAgICB0aGlzLmxvZ0VuYWJsZWQgPSBvcHRpb25zLmxvZ0VuYWJsZWQ7XHJcblxyXG4gICAgLy8gVENTID0gVGhpbmd5IENvbmZpZ3VyYXRpb24gU2VydmljZVxyXG4gICAgdGhpcy5UQ1NfVVVJRCA9IFwiZWY2ODAxMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19OQU1FX1VVSUQgPSBcImVmNjgwMTAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfQURWX1BBUkFNU19VVUlEID0gXCJlZjY4MDEwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX0NPTk5fUEFSQU1TX1VVSUQgPSBcImVmNjgwMTA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfRUREWVNUT05FX1VVSUQgPSBcImVmNjgwMTA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfQ0xPVURfVE9LRU5fVVVJRCA9IFwiZWY2ODAxMDYtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19GV19WRVJfVVVJRCA9IFwiZWY2ODAxMDctOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19NVFVfUkVRVUVTVF9VVUlEID0gXCJlZjY4MDEwOC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuXHJcbiAgICAvLyBURVMgPSBUaGluZ3kgRW52aXJvbm1lbnQgU2VydmljZVxyXG4gICAgdGhpcy5URVNfVVVJRCA9IFwiZWY2ODAyMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19URU1QX1VVSUQgPSBcImVmNjgwMjAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfUFJFU1NVUkVfVVVJRCA9IFwiZWY2ODAyMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19IVU1JRElUWV9VVUlEID0gXCJlZjY4MDIwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX0dBU19VVUlEID0gXCJlZjY4MDIwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX0NPTE9SX1VVSUQgPSBcImVmNjgwMjA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfQ09ORklHX1VVSUQgPSBcImVmNjgwMjA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIC8vIFRVSVMgPSBUaGluZ3kgVXNlciBJbnRlcmZhY2UgU2VydmljZVxyXG4gICAgdGhpcy5UVUlTX1VVSUQgPSBcImVmNjgwMzAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UVUlTX0xFRF9VVUlEID0gXCJlZjY4MDMwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFVJU19CVE5fVVVJRCA9IFwiZWY2ODAzMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRVSVNfUElOX1VVSUQgPSBcImVmNjgwMzAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIC8vIFRNUyA9IFRoaW5neSBNb3Rpb24gU2VydmljZVxyXG4gICAgdGhpcy5UTVNfVVVJRCA9IFwiZWY2ODA0MDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19DT05GSUdfVVVJRCA9IFwiZWY2ODA0MDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19UQVBfVVVJRCA9IFwiZWY2ODA0MDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19PUklFTlRBVElPTl9VVUlEID0gXCJlZjY4MDQwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX1FVQVRFUk5JT05fVVVJRCA9IFwiZWY2ODA0MDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19TVEVQX1VVSUQgPSBcImVmNjgwNDA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfUkFXX1VVSUQgPSBcImVmNjgwNDA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfRVVMRVJfVVVJRCA9IFwiZWY2ODA0MDctOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19ST1RfTUFUUklYX1VVSUQgPSBcImVmNjgwNDA4LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfSEVBRElOR19VVUlEID0gXCJlZjY4MDQwOS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX0dSQVZJVFlfVVVJRCA9IFwiZWY2ODA0MGEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcblxyXG4gICAgLy8gVFNTID0gVGhpbmd5IFNvdW5kIFNlcnZpY2VcclxuICAgIHRoaXMuVFNTX1VVSUQgPSBcImVmNjgwNTAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfQ09ORklHX1VVSUQgPSBcImVmNjgwNTAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfU1BFQUtFUl9EQVRBX1VVSUQgPSBcImVmNjgwNTAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfU1BFQUtFUl9TVEFUX1VVSUQgPSBcImVmNjgwNTAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfTUlDX1VVSUQgPSBcImVmNjgwNTA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIHRoaXMuc2VydmljZVVVSURzID0gW1xyXG4gICAgICBcImJhdHRlcnlfc2VydmljZVwiLFxyXG4gICAgICB0aGlzLlRDU19VVUlELFxyXG4gICAgICB0aGlzLlRFU19VVUlELFxyXG4gICAgICB0aGlzLlRVSVNfVVVJRCxcclxuICAgICAgdGhpcy5UTVNfVVVJRCxcclxuICAgICAgdGhpcy5UU1NfVVVJRCxcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5ibGVJc0J1c3kgPSBmYWxzZTtcclxuICAgIHRoaXMuZGV2aWNlO1xyXG4gICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy50YXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuc3BlYWtlclN0YXR1c0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMubWljcm9waG9uZUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAgICogIE1ldGhvZCB0byByZWFkIGRhdGEgZnJvbSBhIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMuXHJcbiAgICAgKiAgSW1wbGVtZW50cyBhIHNpbXBsZSBzb2x1dGlvbiB0byBhdm9pZCBzdGFydGluZyBuZXcgR0FUVCByZXF1ZXN0cyB3aGlsZSBhbm90aGVyIGlzIHBlbmRpbmcuXHJcbiAgICAgKiAgQW55IGF0dGVtcHQgdG8gcmVhZCB3aGlsZSBhbm90aGVyIEdBVFQgb3BlcmF0aW9uIGlzIGluIHByb2dyZXNzLCB3aWxsIHJlc3VsdCBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICAgKlxyXG4gICAgICogIEBhc3luY1xyXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBjaGFyYWN0ZXJpc3RpYyAtIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMgb2JqZWN0XHJcbiAgICAgKiAgQHJldHVybiB7UHJvbWlzZTxEYXRhVmlldz59IFJldHVybnMgVWludDhBcnJheSB3aGVuIHJlc29sdmVkIG9yIGFuIGVycm9yIHdoZW4gcmVqZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiAgQHByaXZhdGVcclxuXHJcbiAgICAqL1xyXG4gIGFzeW5jIF9yZWFkRGF0YShjaGFyYWN0ZXJpc3RpYykge1xyXG4gICAgaWYgKCF0aGlzLmJsZUlzQnVzeSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBkYXRhQXJyYXkgPSBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcclxuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YUFycmF5O1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkdBVFQgb3BlcmF0aW9uIGFscmVhZHkgcGVuZGluZ1wiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgTWV0aG9kIHRvIHdyaXRlIGRhdGEgdG8gYSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljLlxyXG4gICAqICBJbXBsZW1lbnRzIGEgc2ltcGxlIHNvbHV0aW9uIHRvIGF2b2lkIHN0YXJ0aW5nIG5ldyBHQVRUIHJlcXVlc3RzIHdoaWxlIGFub3RoZXIgaXMgcGVuZGluZy5cclxuICAgKiAgQW55IGF0dGVtcHQgdG8gc2VuZCBkYXRhIGR1cmluZyBhbm90aGVyIEdBVFQgb3BlcmF0aW9uIHdpbGwgcmVzdWx0IGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cclxuICAgKiAgTm8gcmV0cmFuc21pc3Npb24gaXMgaW1wbGVtZW50ZWQgYXQgdGhpcyBsZXZlbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IGNoYXJhY3RlcmlzdGljIC0gV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYyBvYmplY3RcclxuICAgKiAgQHBhcmFtIHtVaW50OEFycmF5fSBkYXRhQXJyYXkgLSBUeXBlZCBhcnJheSBvZiBieXRlcyB0byBzZW5kXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2V9XHJcbiAgICpcclxuICAgKiAgQHByaXZhdGVcclxuICAgKlxyXG4gICovXHJcbiAgYXN5bmMgX3dyaXRlRGF0YShjaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KSB7XHJcbiAgICBpZiAoIXRoaXMuYmxlSXNCdXN5KSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSB0cnVlO1xyXG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoZGF0YUFycmF5KTtcclxuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiR0FUVCBvcGVyYXRpb24gYWxyZWFkeSBwZW5kaW5nXCIpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBDb25uZWN0cyB0byBUaGluZ3kuXHJcbiAgICogIFRoZSBmdW5jdGlvbiBzdG9yZXMgYWxsIGRpc2NvdmVyZWQgc2VydmljZXMgYW5kIGNoYXJhY3RlcmlzdGljcyB0byB0aGUgVGhpbmd5IG9iamVjdC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYW4gZW1wdHkgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgY29ubmVjdCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFNjYW4gZm9yIFRoaW5neXNcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBTY2FubmluZyBmb3IgZGV2aWNlcyB3aXRoIHNlcnZpY2UgVVVJRCBlcXVhbCB0byAke3RoaXMuVENTX1VVSUR9YCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGV2aWNlID0gYXdhaXQgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHtcclxuICAgICAgICBmaWx0ZXJzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlcnZpY2VzOiBbdGhpcy5UQ1NfVVVJRF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgb3B0aW9uYWxTZXJ2aWNlczogdGhpcy5zZXJ2aWNlVVVJRHMsXHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEZvdW5kIFRoaW5neSBuYW1lZCBcIiR7dGhpcy5kZXZpY2UubmFtZX1cIiwgdHJ5aW5nIHRvIGNvbm5lY3RgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ29ubmVjdCB0byBHQVRUIHNlcnZlclxyXG4gICAgICBjb25zdCBzZXJ2ZXIgPSBhd2FpdCB0aGlzLmRldmljZS5nYXR0LmNvbm5lY3QoKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBDb25uZWN0ZWQgdG8gXCIke3RoaXMuZGV2aWNlLm5hbWV9XCJgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQmF0dGVyeSBzZXJ2aWNlXHJcbiAgICAgIGNvbnN0IGJhdHRlcnlTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKFwiYmF0dGVyeV9zZXJ2aWNlXCIpO1xyXG4gICAgICB0aGlzLmJhdHRlcnlDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IGJhdHRlcnlTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKFwiYmF0dGVyeV9sZXZlbFwiKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBiYXR0ZXJ5IHNlcnZpY2UgYW5kIGJhdHRlcnkgbGV2ZWwgY2hhcmFjdGVyaXN0aWNcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBjb25maWd1cmF0aW9uIHNlcnZpY2VcclxuICAgICAgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRDU19VVUlEKTtcclxuICAgICAgdGhpcy5uYW1lQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX05BTUVfVVVJRCk7XHJcbiAgICAgIHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0FEVl9QQVJBTVNfVVVJRCk7XHJcbiAgICAgIHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19DTE9VRF9UT0tFTl9VVUlEKTtcclxuICAgICAgdGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0NPTk5fUEFSQU1TX1VVSUQpO1xyXG4gICAgICB0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19FRERZU1RPTkVfVVVJRCk7XHJcbiAgICAgIHRoaXMuZmlybXdhcmVWZXJzaW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0ZXX1ZFUl9VVUlEKTtcclxuICAgICAgdGhpcy5tdHVSZXF1ZXN0Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX01UVV9SRVFVRVNUX1VVSUQpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBjb25maWd1cmF0aW9uIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBlbnZpcm9ubWVudCBzZXJ2aWNlXHJcbiAgICAgIHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVEVTX1VVSUQpO1xyXG4gICAgICB0aGlzLnRlbXBlcmF0dXJlQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19URU1QX1VVSUQpO1xyXG4gICAgICB0aGlzLmNvbG9yQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19DT0xPUl9VVUlEKTtcclxuICAgICAgdGhpcy5nYXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0dBU19VVUlEKTtcclxuICAgICAgdGhpcy5odW1pZGl0eUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfSFVNSURJVFlfVVVJRCk7XHJcbiAgICAgIHRoaXMucHJlc3N1cmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX1BSRVNTVVJFX1VVSUQpO1xyXG4gICAgICB0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19DT05GSUdfVVVJRCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IGVudmlyb25tZW50IHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSB1c2VyIGludGVyZmFjZSBzZXJ2aWNlXHJcbiAgICAgIHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UVUlTX1VVSUQpO1xyXG4gICAgICB0aGlzLmJ1dHRvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfQlROX1VVSUQpO1xyXG4gICAgICB0aGlzLmxlZENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfTEVEX1VVSUQpO1xyXG4gICAgICB0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFVJU19QSU5fVVVJRCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IHVzZXIgaW50ZXJmYWNlIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBtb3Rpb24gc2VydmljZVxyXG4gICAgICB0aGlzLm1vdGlvblNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UTVNfVVVJRCk7XHJcbiAgICAgIHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfQ09ORklHX1VVSUQpO1xyXG4gICAgICB0aGlzLmV1bGVyQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfRVVMRVJfVVVJRCk7XHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0dSQVZJVFlfVVVJRCk7XHJcbiAgICAgIHRoaXMuaGVhZGluZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0hFQURJTkdfVVVJRCk7XHJcbiAgICAgIHRoaXMub3JpZW50YXRpb25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19PUklFTlRBVElPTl9VVUlEKTtcclxuICAgICAgdGhpcy5xdWF0ZXJuaW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfUVVBVEVSTklPTl9VVUlEKTtcclxuICAgICAgdGhpcy5tb3Rpb25SYXdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19SQVdfVVVJRCk7XHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19ST1RfTUFUUklYX1VVSUQpO1xyXG4gICAgICB0aGlzLnN0ZXBDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19TVEVQX1VVSUQpO1xyXG4gICAgICB0aGlzLnRhcENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1RBUF9VVUlEKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgbW90aW9uIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBzb3VuZCBzZXJ2aWNlXHJcbiAgICAgIHRoaXMuc291bmRTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVFNTX1VVSUQpO1xyXG4gICAgICB0aGlzLnRzc0NvbmZpZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfQ09ORklHX1VVSUQpO1xyXG4gICAgICB0aGlzLm1pY3JvcGhvbmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX01JQ19VVUlEKTtcclxuICAgICAgdGhpcy5zcGVha2VyRGF0YUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfU1BFQUtFUl9EQVRBX1VVSUQpO1xyXG4gICAgICB0aGlzLnNwZWFrZXJTdGF0dXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX1NQRUFLRVJfU1RBVF9VVUlEKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgc291bmQgc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIE1ldGhvZCB0byBkaXNjb25uZWN0IGZyb20gVGhpbmd5LlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhbiBlbXB0eSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqL1xyXG4gIGFzeW5jIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCB0aGlzLmRldmljZS5nYXR0LmRpc2Nvbm5lY3QoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE1ldGhvZCB0byBlbmFibGUgYW5kIGRpc2FibGUgbm90aWZpY2F0aW9ucyBmb3IgYSBjaGFyYWN0ZXJpc3RpY1xyXG4gIGFzeW5jIF9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCBub3RpZnlIYW5kbGVyKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMuc3RhcnROb3RpZmljYXRpb25zKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJOb3RpZmljYXRpb25zIGVuYWJsZWQgZm9yIFwiICsgY2hhcmFjdGVyaXN0aWMudXVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYXJhY3RlcmlzdGljLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZFwiLCBub3RpZnlIYW5kbGVyKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMuc3RvcE5vdGlmaWNhdGlvbnMoKTtcclxuICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdGlmaWNhdGlvbnMgZGlzYWJsZWQgZm9yIFwiLCBjaGFyYWN0ZXJpc3RpYy51dWlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkXCIsIG5vdGlmeUhhbmRsZXIpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogIENvbmZpZ3VyYXRpb24gc2VydmljZSAgKi9cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgbmFtZSBvZiB0aGUgVGhpbmd5IGRldmljZS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIG5hbWUgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXROYW1lKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubmFtZUNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xyXG4gICAgICBjb25zdCBuYW1lID0gZGVjb2Rlci5kZWNvZGUoZGF0YSk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGRldmljZSBuYW1lOiBcIiArIG5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIG5hbWUgb2YgdGhlIFRoaW5neSBkZXZpY2UuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgdGhhdCB3aWxsIGJlIGdpdmVuIHRvIHRoZSBUaGluZ3kuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldE5hbWUobmFtZSkge1xyXG4gICAgaWYgKG5hbWUubGVuZ3RoID4gMTApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgbmFtZSBjYW4ndCBiZSBtb3JlIHRoYW4gMTAgY2hhcmFjdGVycyBsb25nLlwiKSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShuYW1lLmxlbmd0aCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgYnl0ZUFycmF5W2ldID0gbmFtZS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLm5hbWVDaGFyYWN0ZXJpc3RpYywgYnl0ZUFycmF5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGFkdmVydGlzaW5nIHBhcmFtZXRlcnNcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBhZHZlcnRpc2luZyBwYXJhbWV0ZXJzIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEFkdlBhcmFtcygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xyXG5cclxuICAgICAgLy8gSW50ZXJ2YWwgaXMgZ2l2ZW4gaW4gdW5pdHMgb2YgMC42MjUgbWlsbGlzZWNvbmRzXHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IGludGVydmFsID0gKHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKSAqIDAuNjI1KS50b0ZpeGVkKDApO1xyXG4gICAgICBjb25zdCB0aW1lb3V0ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDIpO1xyXG4gICAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgaW50ZXJ2YWw6IHtcclxuICAgICAgICAgIGludGVydmFsOiBpbnRlcnZhbCxcclxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpbWVvdXQ6IHtcclxuICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXHJcbiAgICAgICAgICB1bml0OiBcInNcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGFkdmVydGlzaW5nIHBhcmFtZXRlcnNcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIE9iamVjdCB3aXRoIGtleS92YWx1ZSBwYWlycyAnaW50ZXJ2YWwnIGFuZCAndGltZW91dCc6IDxjb2RlPntpbnRlcnZhbDogc29tZUludGVydmFsLCB0aW1lb3V0OiBzb21lVGltZW91dH08L2NvZGU+LlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVydmFsIC0gVGhlIGFkdmVydGlzaW5nIGludGVydmFsIGluIG1pbGxpc2Vjb25kcyBpbiB0aGUgcmFuZ2Ugb2YgMjAgbXMgdG8gNSAwMDAgbXMuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMudGltZW91dCAtIFRoZSBhZHZlcnRpc2luZyB0aW1lb3V0IGluIHNlY29uZHMgaW4gdGhlIHJhbmdlIDEgcyB0byAxODAgcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0QWR2UGFyYW1zKHBhcmFtcykge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLmludGVydmFsID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLnRpbWVvdXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0IHdpdGgga2V5L3ZhbHVlIHBhaXJzIGludGVydmFsJyBhbmQgJ3RpbWVvdXQnOiB7aW50ZXJ2YWw6IHNvbWVJbnRlcnZhbCwgdGltZW91dDogc29tZVRpbWVvdXR9XCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW50ZXJ2YWwgaXMgaW4gdW5pdHMgb2YgMC42MjUgbXMuXHJcbiAgICBjb25zdCBpbnRlcnZhbCA9IHBhcmFtcy5pbnRlcnZhbCAqIDEuNjtcclxuICAgIGNvbnN0IHRpbWVvdXQgPSBwYXJhbXMudGltZW91dDtcclxuXHJcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXHJcbiAgICBpZiAoaW50ZXJ2YWwgPCAzMiB8fCBpbnRlcnZhbCA+IDgwMDApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGFkdmVydGlzaW5nIGludGVydmFsIG11c3QgYmUgd2l0aGluIHRoZSByYW5nZSBvZiAyMCBtcyB0byA1IDAwMCBtc1wiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGltZW91dCA8IDAgfHwgdGltZW91dCA+IDE4MCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgYWR2ZXJ0aXNpbmcgdGltZW91dCBtdXN0IGJlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgMCB0byAxODAgc1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMyk7XHJcbiAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICBkYXRhQXJyYXlbMV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG4gICAgZGF0YUFycmF5WzJdID0gdGltZW91dDtcclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25uZWN0aW9uIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgY29ubmVjdGlvbiBwYXJhbWV0ZXJzIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0Q29ublBhcmFtcygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcclxuXHJcbiAgICAgIC8vIENvbm5lY3Rpb24gaW50ZXJ2YWxzIGFyZSBnaXZlbiBpbiB1bml0cyBvZiAxLjI1IG1zXHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IG1pbkNvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKSAqIDEuMjU7XHJcbiAgICAgIGNvbnN0IG1heENvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKSAqIDEuMjU7XHJcbiAgICAgIGNvbnN0IHNsYXZlTGF0ZW5jeSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgIC8vIFN1cGVydmlzaW9uIHRpbWVvdXQgaXMgZ2l2ZW4gaSB1bml0cyBvZiAxMCBtc1xyXG4gICAgICBjb25zdCBzdXBlcnZpc2lvblRpbWVvdXQgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbikgKiAxMDtcclxuICAgICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICAgIGNvbm5lY3Rpb25JbnRlcnZhbDoge1xyXG4gICAgICAgICAgbWluOiBtaW5Db25uSW50ZXJ2YWwsXHJcbiAgICAgICAgICBtYXg6IG1heENvbm5JbnRlcnZhbCxcclxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNsYXZlTGF0ZW5jeToge1xyXG4gICAgICAgICAgdmFsdWU6IHNsYXZlTGF0ZW5jeSxcclxuICAgICAgICAgIHVuaXQ6IFwibnVtYmVyIG9mIGNvbm5lY3Rpb24gaW50ZXJ2YWxzXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdXBlcnZpc2lvblRpbWVvdXQ6IHtcclxuICAgICAgICAgIHRpbWVvdXQ6IHN1cGVydmlzaW9uVGltZW91dCxcclxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gaW50ZXJ2YWxcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIENvbm5lY3Rpb24gaW50ZXJ2YWwgb2JqZWN0OiA8Y29kZT57bWluSW50ZXJ2YWw6IHNvbWVWYWx1ZSwgbWF4SW50ZXJ2YWw6IHNvbWVWYWx1ZX08L2NvZGU+XHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWluSW50ZXJ2YWwgLSBUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSA+PSA3LjUgbXMuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4SW50ZXJ2YWwgLSBUaGUgbWF4aW11bSBjb25uZWN0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSA8PSA0IDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0Q29ubkludGVydmFsKHBhcmFtcykge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLm1pbkludGVydmFsID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLm1heEludGVydmFsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgYXJndW1lbnQgaGFzIHRvIGJlIGFuIG9iamVjdDoge21pbkludGVydmFsOiB2YWx1ZSwgbWF4SW50ZXJ2YWw6IHZhbHVlfVwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1pbkludGVydmFsID0gcGFyYW1zLm1pbkludGVydmFsO1xyXG4gICAgbGV0IG1heEludGVydmFsID0gcGFyYW1zLm1heEludGVydmFsO1xyXG5cclxuICAgIGlmIChtaW5JbnRlcnZhbCA9PT0gbnVsbCB8fCBtYXhJbnRlcnZhbCA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIkJvdGggbWluaW11bSBhbmQgbWF4aW11bSBhY2NlcHRhYmxlIGludGVydmFsIG11c3QgYmUgcGFzc2VkIGFzIGFyZ3VtZW50c1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xyXG4gICAgaWYgKG1pbkludGVydmFsIDwgNy41IHx8IG1pbkludGVydmFsID4gbWF4SW50ZXJ2YWwpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIG1pbmltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiA3LjUgbXMgYW5kIDw9IG1heGltdW0gaW50ZXJ2YWxcIilcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmIChtYXhJbnRlcnZhbCA+IDQwMDAgfHwgbWF4SW50ZXJ2YWwgPCBtaW5JbnRlcnZhbCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFJhbmdlRXJyb3IoXCJUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIG11c3QgYmUgbGVzcyB0aGFuIDQgMDAwIG1zIGFuZCA+PSBtaW5pbXVtIGludGVydmFsXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg4KTtcclxuXHJcbiAgICAgIC8vIEludGVydmFsIGlzIGluIHVuaXRzIG9mIDEuMjUgbXMuXHJcbiAgICAgIG1pbkludGVydmFsID0gTWF0aC5yb3VuZChtaW5JbnRlcnZhbCAqIDAuOCk7XHJcbiAgICAgIG1heEludGVydmFsID0gTWF0aC5yb3VuZChtYXhJbnRlcnZhbCAqIDAuOCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzBdID0gbWluSW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbMV0gPSAobWluSW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbMl0gPSBtYXhJbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVszXSA9IChtYXhJbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkVycm9yIHdoZW4gdXBkYXRpbmcgY29ubmVjdGlvbiBpbnRlcnZhbDogXCIgKyBlcnJvcikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gc2xhdmUgbGF0ZW5jeVxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gc2xhdmVMYXRlbmN5IC0gVGhlIGRlc2lyZWQgc2xhdmUgbGF0ZW5jeSBpbiB0aGUgcmFuZ2UgZnJvbSAwIHRvIDQ5OSBjb25uZWN0aW9uIGludGVydmFscy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldENvbm5TbGF2ZUxhdGVuY3koc2xhdmVMYXRlbmN5KSB7XHJcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXHJcbiAgICBpZiAoc2xhdmVMYXRlbmN5IDwgMCB8fCBzbGF2ZUxhdGVuY3kgPiA0OTkpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIHNsYXZlIGxhdGVuY3kgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgZnJvbSAwIHRvIDQ5OSBjb25uZWN0aW9uIGludGVydmFscy5cIilcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs0XSA9IHNsYXZlTGF0ZW5jeSAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs1XSA9IChzbGF2ZUxhdGVuY3kgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHVwZGF0aW5nIHNsYXZlIGxhdGVuY3k6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gc3VwZXJ2aXNpb24gdGltZW91dFxyXG4gICAqICA8Yj5Ob3RlOjwvYj4gQWNjb3JkaW5nIHRvIHRoZSBCbHVldG9vdGggTG93IEVuZXJneSBzcGVjaWZpY2F0aW9uLCB0aGUgc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgbXVzdCBiZSBncmVhdGVyXHJcbiAgICogIHRoYW4gKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsICogMiwgd2hlcmUgbWF4Q29ubkludGVydmFsIGlzIGFsc28gZ2l2ZW4gaW4gbWlsbGlzZWNvbmRzLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gdGltZW91dCAtIFRoZSBkZXNpcmVkIGNvbm5lY3Rpb24gc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgYW5kIGluIHRoZSByYW5nZSBvZiAxMDAgbXMgdG8gMzIgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRDb25uVGltZW91dCh0aW1lb3V0KSB7XHJcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXHJcbiAgICBpZiAodGltZW91dCA8IDEwMCB8fCB0aW1lb3V0ID4gMzIwMDApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgZnJvbSAxMDAgbXMgdG8gMzIgMDAwIG1zLlwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgaGFzIHRvIGJlIHNldCBpbiB1bml0cyBvZiAxMCBtc1xyXG4gICAgICB0aW1lb3V0ID0gTWF0aC5yb3VuZCh0aW1lb3V0IC8gMTApO1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHRpbWVvdXQgb2JleXMgIGNvbm5fc3VwX3RpbWVvdXQgKiA0ID4gKDEgKyBzbGF2ZV9sYXRlbmN5KSAqIG1heF9jb25uX2ludGVydmFsXHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IG1heENvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3Qgc2xhdmVMYXRlbmN5ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xyXG5cclxuICAgICAgaWYgKHRpbWVvdXQgKiA0IDwgKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAoMSArIHNsYXZlTGF0ZW5jeSkgKiBtYXhDb25uSW50ZXJ2YWwgKiAyLCB3aGVyZSBtYXhDb25uSW50ZXJ2YWwgaXMgYWxzbyBnaXZlbiBpbiBtaWxsaXNlY29uZHMuXCIpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzZdID0gdGltZW91dCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs3XSA9ICh0aW1lb3V0ID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiB1cGRhdGluZyB0aGUgc3VwZXJ2aXNpb24gdGltZW91dDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY29uZmlndXJlZCBFZGR5c3RvbmUgVVJMXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8VVJMfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBVUkwgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRFZGR5c3RvbmVVcmwoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljKTtcclxuXHJcbiAgICAgIC8vIEFjY29yZGluZyB0byBFZGR5c3RvbmUgVVJMIGVuY29kaW5nIHNwZWNpZmljYXRpb24sIGNlcnRhaW4gZWxlbWVudHMgY2FuIGJlIGV4cGFuZGVkOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXHJcbiAgICAgIGNvbnN0IHByZWZpeEFycmF5ID0gW1wiaHR0cDovL3d3dy5cIiwgXCJodHRwczovL3d3dy5cIiwgXCJodHRwOi8vXCIsIFwiaHR0cHM6Ly9cIl07XHJcbiAgICAgIGNvbnN0IGV4cGFuc2lvbkNvZGVzID0gW1xyXG4gICAgICAgIFwiLmNvbS9cIixcclxuICAgICAgICBcIi5vcmcvXCIsXHJcbiAgICAgICAgXCIuZWR1L1wiLFxyXG4gICAgICAgIFwiLm5ldC9cIixcclxuICAgICAgICBcIi5pbmZvL1wiLFxyXG4gICAgICAgIFwiLmJpei9cIixcclxuICAgICAgICBcIi5nb3YvXCIsXHJcbiAgICAgICAgXCIuY29tXCIsXHJcbiAgICAgICAgXCIub3JnXCIsXHJcbiAgICAgICAgXCIuZWR1XCIsXHJcbiAgICAgICAgXCIubmV0XCIsXHJcbiAgICAgICAgXCIuaW5mb1wiLFxyXG4gICAgICAgIFwiLmJpelwiLFxyXG4gICAgICAgIFwiLmdvdlwiLFxyXG4gICAgICBdO1xyXG4gICAgICBjb25zdCBwcmVmaXggPSBwcmVmaXhBcnJheVtyZWNlaXZlZERhdGEuZ2V0VWludDgoMCldO1xyXG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIik7XHJcbiAgICAgIGxldCB1cmwgPSBkZWNvZGVyLmRlY29kZShyZWNlaXZlZERhdGEpO1xyXG4gICAgICB1cmwgPSBwcmVmaXggKyB1cmwuc2xpY2UoMSk7XHJcblxyXG4gICAgICBleHBhbnNpb25Db2Rlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKFN0cmluZy5mcm9tQ2hhckNvZGUoaSkpICE9PSAtMSkge1xyXG4gICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoU3RyaW5nLmZyb21DaGFyQ29kZShpKSwgZXhwYW5zaW9uQ29kZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gbmV3IFVSTCh1cmwpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIEVkZHlzdG9uZSBVUkxcclxuICAgKiAgSXQncyByZWNvbW1lZW5kZWQgdG8gdXNlIFVSTCBzaG9ydGVuZXIgdG8gc3RheSB3aXRoaW4gdGhlIGxpbWl0IG9mIDE0IGNoYXJhY3RlcnMgbG9uZyBVUkxcclxuICAgKiAgVVJMIHNjaGVtZSBwcmVmaXggc3VjaCBhcyBcImh0dHBzOi8vXCIgYW5kIFwiaHR0cHM6Ly93d3cuXCIgZG8gbm90IGNvdW50IHRvd2FyZHMgdGhhdCBsaW1pdCxcclxuICAgKiAgbmVpdGhlciBkb2VzIGV4cGFuc2lvbiBjb2RlcyBzdWNoIGFzIFwiLmNvbS9cIiBhbmQgXCIub3JnXCIuXHJcbiAgICogIEZ1bGwgZGV0YWlscyBpbiB0aGUgRWRkeXN0b25lIFVSTCBzcGVjaWZpY2F0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7c3RyaW5nfSB1cmxTdHJpbmcgLSBUaGUgVVJMIHRoYXQgc2hvdWxkIGJlIGJyb2FkY2FzdGVkLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRFZGR5c3RvbmVVcmwodXJsU3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBVc2VzIFVSTCBBUEkgdG8gY2hlY2sgZm9yIHZhbGlkIFVSTFxyXG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHVybFN0cmluZyk7XHJcblxyXG4gICAgICAvLyBFZGR5c3RvbmUgVVJMIHNwZWNpZmljYXRpb24gZGVmaW5lcyBjb2RlcyBmb3IgVVJMIHNjaGVtZSBwcmVmaXhlcyBhbmQgZXhwYW5zaW9uIGNvZGVzIGluIHRoZSBVUkwuXHJcbiAgICAgIC8vIFRoZSBhcnJheSBpbmRleCBjb3JyZXNwb25kcyB0byB0aGUgZGVmaW5lZCBjb2RlIGluIHRoZSBzcGVjaWZpY2F0aW9uLlxyXG4gICAgICAvLyBEZXRhaWxzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZWRkeXN0b25lL3RyZWUvbWFzdGVyL2VkZHlzdG9uZS11cmxcclxuICAgICAgY29uc3QgcHJlZml4QXJyYXkgPSBbXCJodHRwOi8vd3d3LlwiLCBcImh0dHBzOi8vd3d3LlwiLCBcImh0dHA6Ly9cIiwgXCJodHRwczovL1wiXTtcclxuICAgICAgY29uc3QgZXhwYW5zaW9uQ29kZXMgPSBbXHJcbiAgICAgICAgXCIuY29tL1wiLFxyXG4gICAgICAgIFwiLm9yZy9cIixcclxuICAgICAgICBcIi5lZHUvXCIsXHJcbiAgICAgICAgXCIubmV0L1wiLFxyXG4gICAgICAgIFwiLmluZm8vXCIsXHJcbiAgICAgICAgXCIuYml6L1wiLFxyXG4gICAgICAgIFwiLmdvdi9cIixcclxuICAgICAgICBcIi5jb21cIixcclxuICAgICAgICBcIi5vcmdcIixcclxuICAgICAgICBcIi5lZHVcIixcclxuICAgICAgICBcIi5uZXRcIixcclxuICAgICAgICBcIi5pbmZvXCIsXHJcbiAgICAgICAgXCIuYml6XCIsXHJcbiAgICAgICAgXCIuZ292XCIsXHJcbiAgICAgIF07XHJcbiAgICAgIGxldCBwcmVmaXhDb2RlID0gbnVsbDtcclxuICAgICAgbGV0IGV4cGFuc2lvbkNvZGUgPSBudWxsO1xyXG4gICAgICBsZXQgZWRkeXN0b25lVXJsID0gdXJsLmhyZWY7XHJcbiAgICAgIGxldCBsZW4gPSBlZGR5c3RvbmVVcmwubGVuZ3RoO1xyXG5cclxuICAgICAgcHJlZml4QXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xyXG4gICAgICAgIGlmICh1cmwuaHJlZi5pbmRleE9mKGVsZW1lbnQpICE9PSAtMSAmJiBwcmVmaXhDb2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgICBwcmVmaXhDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcclxuICAgICAgICAgIGVkZHlzdG9uZVVybCA9IGVkZHlzdG9uZVVybC5yZXBsYWNlKGVsZW1lbnQsIHByZWZpeENvZGUpO1xyXG4gICAgICAgICAgbGVuIC09IGVsZW1lbnQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBleHBhbnNpb25Db2Rlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHVybC5ocmVmLmluZGV4T2YoZWxlbWVudCkgIT09IC0xICYmIGV4cGFuc2lvbkNvZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgIGV4cGFuc2lvbkNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xyXG4gICAgICAgICAgZWRkeXN0b25lVXJsID0gZWRkeXN0b25lVXJsLnJlcGxhY2UoZWxlbWVudCwgZXhwYW5zaW9uQ29kZSk7XHJcbiAgICAgICAgICBsZW4gLT0gZWxlbWVudC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChsZW4gPCAxIHx8IGxlbiA+IDE0KSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgVVJMIGNhbid0IGJlIGxvbmdlciB0aGFuIDE0IGNoYXJhY3RlcnMsIGV4Y2x1ZGluZyBVUkwgc2NoZW1lIHN1Y2ggYXMgXFxcImh0dHBzOi8vXFxcIiBhbmQgXFxcIi5jb20vXFxcIi5cIilcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShlZGR5c3RvbmVVcmwubGVuZ3RoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWRkeXN0b25lVXJsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYnl0ZUFycmF5W2ldID0gZWRkeXN0b25lVXJsLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5lZGR5c3RvbmVDaGFyYWN0ZXJpc3RpYywgYnl0ZUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY29uZmlndXJlZCBjbG91ZCB0b2tlbi5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIGNsb3VkIHRva2VuIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0Q2xvdWRUb2tlbigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xyXG4gICAgICBjb25zdCB0b2tlbiA9IGRlY29kZXIuZGVjb2RlKHJlY2VpdmVkRGF0YSk7XHJcblxyXG4gICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgY2xvdWQgdG9rZW4uXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBjbG91ZCB0b2tlbiB0byBiZSBzdG9yZWQuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldENsb3VkVG9rZW4odG9rZW4pIHtcclxuICAgIGlmICh0b2tlbi5sZW5ndGggPiAyNTApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBjbG91ZCB0b2tlbiBjYW4gbm90IGV4Y2VlZCAyNTAgY2hhcmFjdGVycy5cIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoXCJ1dGYtOFwiKS5lbmNvZGUodG9rZW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5jbG91ZFRva2VuQ2hhcmFjdGVyaXN0aWMsIGVuY29kZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgTWF4aW1hbCBUcmFuc21pc3Npb24gVW5pdCAoTVRVKVxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPG51bWJlcnxFcnJvcj59IFJldHVybnMgdGhlIE1UVSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldE10dSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubXR1UmVxdWVzdENoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgY29uc3QgbXR1ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigxLCBsaXR0bGVFbmRpYW4pO1xyXG5cclxuICAgICAgcmV0dXJuIG10dTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjdXJyZW50IE1heGltYWwgVHJhbnNtaXNzaW9uIFVuaXQgKE1UVSlcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMgPSB7cGVyaXBoZXJhbFJlcXVlc3Q6IHRydWV9XSAtIE1UVSBzZXR0aW5ncyBvYmplY3Q6IHttdHVTaXplOiB2YWx1ZSwgcGVyaXBoZXJhbFJlcXVlc3Q6IHZhbHVlfSwgd2hlcmUgcGVyaXBoZXJhbFJlcXVlc3QgaXMgb3B0aW9uYWwuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubXR1U2l6ZSAtIFRoZSBkZXNpcmVkIE1UVSBzaXplLlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5wZXJpcGhlcmFsUmVxdWVzdCAtIE9wdGlvbmFsLiBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgcGVyaXBoZXJhbCBzaG91bGQgc2VuZCBhbiBNVFUgZXhjaGFuZ2UgcmVxdWVzdC4gRGVmYXVsdCBpcyA8Y29kZT50cnVlPC9jb2RlPjtcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0TXR1KHBhcmFtcykge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLm10dVNpemUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0XCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtdHVTaXplID0gcGFyYW1zLm10dVNpemU7XHJcbiAgICBjb25zdCBwZXJpcGhlcmFsUmVxdWVzdCA9IHBhcmFtcy5wZXJpcGhlcmFsUmVxdWVzdCB8fCB0cnVlO1xyXG5cclxuICAgIGlmIChtdHVTaXplIDwgMjMgfHwgbXR1U2l6ZSA+IDI3Nikge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTVRVIHNpemUgbXVzdCBiZSBpbiByYW5nZSAyMyAtIDI3NiBieXRlc1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMyk7XHJcbiAgICBkYXRhQXJyYXlbMF0gPSBwZXJpcGhlcmFsUmVxdWVzdCA/IDEgOiAwO1xyXG4gICAgZGF0YUFycmF5WzFdID0gbXR1U2l6ZSAmIDB4ZmY7XHJcbiAgICBkYXRhQXJyYXlbMl0gPSAobXR1U2l6ZSA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLm10dVJlcXVlc3RDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGZpcm13YXJlIHZlcnNpb24uXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBmaXJtd2FyZSB2ZXJzaW9uIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEZpcm13YXJlVmVyc2lvbigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZmlybXdhcmVWZXJzaW9uQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBtYWpvciA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgwKTtcclxuICAgICAgY29uc3QgbWlub3IgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMSk7XHJcbiAgICAgIGNvbnN0IHBhdGNoID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDIpO1xyXG4gICAgICBjb25zdCB2ZXJzaW9uID0gYHYke21ham9yfS4ke21pbm9yfS4ke3BhdGNofWA7XHJcblxyXG4gICAgICByZXR1cm4gdmVyc2lvbjtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICAqKioqKiogIC8vXHJcblxyXG4gIC8qICBFbnZpcm9ubWVudCBzZXJ2aWNlICAqL1xyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIG9mIHRoZSBUaGluZ3kgZW52aXJvbm1lbnQgbW9kdWxlLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gZW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvYmplY3Qgd2hlbiBwcm9taXNlIHJlc29sdmVzLCBvciBhbiBlcnJvciBpZiByZWplY3RlZC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEVudmlyb25tZW50Q29uZmlnKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IHRlbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IHByZXNzdXJlSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBodW1pZGl0eUludGVydmFsID0gZGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgY29sb3JJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IGdhc01vZGUgPSBkYXRhLmdldFVpbnQ4KDgpO1xyXG4gICAgICBjb25zdCBjb2xvclNlbnNvclJlZCA9IGRhdGEuZ2V0VWludDgoOSk7XHJcbiAgICAgIGNvbnN0IGNvbG9yU2Vuc29yR3JlZW4gPSBkYXRhLmdldFVpbnQ4KDEwKTtcclxuICAgICAgY29uc3QgY29sb3JTZW5zb3JCbHVlID0gZGF0YS5nZXRVaW50OCgxMSk7XHJcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICB0ZW1wSW50ZXJ2YWw6IHRlbXBJbnRlcnZhbCxcclxuICAgICAgICBwcmVzc3VyZUludGVydmFsOiBwcmVzc3VyZUludGVydmFsLFxyXG4gICAgICAgIGh1bWlkaXR5SW50ZXJ2YWw6IGh1bWlkaXR5SW50ZXJ2YWwsXHJcbiAgICAgICAgY29sb3JJbnRlcnZhbDogY29sb3JJbnRlcnZhbCxcclxuICAgICAgICBnYXNNb2RlOiBnYXNNb2RlLFxyXG4gICAgICAgIGNvbG9yU2Vuc29yUmVkOiBjb2xvclNlbnNvclJlZCxcclxuICAgICAgICBjb2xvclNlbnNvckdyZWVuOiBjb2xvclNlbnNvckdyZWVuLFxyXG4gICAgICAgIGNvbG9yU2Vuc29yQmx1ZTogY29sb3JTZW5zb3JCbHVlLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgZW52aXJvbm1lbnQgc2Vuc29ycyBjb25maWd1cmF0aW9uczogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgdGVtcGVyYXR1cmUgbWVhc3VyZW1lbnQgdXBkYXRlIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUZW1wZXJhdHVyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDYwIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0VGVtcGVyYXR1cmVJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgNTAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSB0ZW1wZXJhdHVyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVswXSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzFdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgdGVtcGVyYXR1cmUgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBwcmVzc3VyZSBtZWFzdXJlbWVudCB1cGRhdGUgaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRoZSBwcmVzc3VyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgNTAgbXMgdG8gNjAgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRQcmVzc3VyZUludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCA1MCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHByZXNzdXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzJdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbM10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBwcmVzc3VyZSB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGh1bWlkaXR5IG1lYXN1cmVtZW50IHVwZGF0ZSBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gSHVtaWRpdHkgc2Vuc29yIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDYwIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0SHVtaWRpdHlJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gNjAwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgaHVtaWRpdHkgc2Vuc29yIHNhbXBsaW5nIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs0XSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzVdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgaHVtaWRpdHkgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjb2xvciBzZW5zb3IgdXBkYXRlIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBDb2xvciBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAyMDAgbXMgdG8gNjAgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRDb2xvckludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCAyMDAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMjAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzZdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbN10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBjb2xvciBzZW5zb3IgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBnYXMgc2Vuc29yIHNhbXBsaW5nIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRoZSBnYXMgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBpbiBzZWNvbmRzLiBBbGxvd2VkIHZhbHVlcyBhcmUgMSwgMTAsIGFuZCA2MCBzZWNvbmRzLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRHYXNJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IG1vZGU7XHJcblxyXG4gICAgICBpZiAoaW50ZXJ2YWwgPT09IDEpIHtcclxuICAgICAgICBtb2RlID0gMTtcclxuICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA9PT0gMTApIHtcclxuICAgICAgICBtb2RlID0gMjtcclxuICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA9PT0gNjApIHtcclxuICAgICAgICBtb2RlID0gMztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgZ2FzIHNlbnNvciBpbnRlcnZhbCBoYXMgdG8gYmUgMSwgMTAgb3IgNjAgc2Vjb25kcy5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbOF0gPSBtb2RlO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBnYXMgc2Vuc29yIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBDb25maWd1cmVzIGNvbG9yIHNlbnNvciBMRUQgY2FsaWJyYXRpb24gcGFyYW1ldGVycy5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IHJlZCAtIFRoZSByZWQgaW50ZW5zaXR5LCByYW5naW5nIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBncmVlbiAtIFRoZSBncmVlbiBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGJsdWUgLSBUaGUgYmx1ZSBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgY29sb3JTZW5zb3JDYWxpYnJhdGUocmVkLCBncmVlbiwgYmx1ZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzldID0gcmVkO1xyXG4gICAgICBkYXRhQXJyYXlbMTBdID0gZ3JlZW47XHJcbiAgICAgIGRhdGFBcnJheVsxMV0gPSBibHVlO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBjb2xvciBzZW5zb3IgcGFyYW1ldGVyczogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyB0ZW1wZXJhdHVyZSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSB0ZW1wZXJhdHVyZSBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgdGVtcGVyYXR1cmVFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl90ZW1wZXJhdHVyZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy50ZW1wZXJhdHVyZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF90ZW1wZXJhdHVyZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBpbnRlZ2VyID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIGNvbnN0IGRlY2ltYWwgPSBkYXRhLmdldFVpbnQ4KDEpO1xyXG4gICAgY29uc3QgdGVtcGVyYXR1cmUgPSBpbnRlZ2VyICsgZGVjaW1hbCAvIDEwMDtcclxuICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHZhbHVlOiB0ZW1wZXJhdHVyZSxcclxuICAgICAgICB1bml0OiBcIkNlbHNpdXNcIixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHByZXNzdXJlIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHByZXNzdXJlIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBwcmVzc3VyZUVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9wcmVzc3VyZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5wcmVzc3VyZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfcHJlc3N1cmVOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgIGNvbnN0IGludGVnZXIgPSBkYXRhLmdldFVpbnQzMigwLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgZGVjaW1hbCA9IGRhdGEuZ2V0VWludDgoNCk7XHJcbiAgICBjb25zdCBwcmVzc3VyZSA9IGludGVnZXIgKyBkZWNpbWFsIC8gMTAwO1xyXG4gICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHZhbHVlOiBwcmVzc3VyZSxcclxuICAgICAgICB1bml0OiBcImhQYVwiLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgaHVtaWRpdHkgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgaHVtaWRpdHkgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGh1bWlkaXR5RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2h1bWlkaXR5Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuaHVtaWRpdHlDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2h1bWlkaXR5Tm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGh1bWlkaXR5ID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB2YWx1ZTogaHVtaWRpdHksXHJcbiAgICAgICAgdW5pdDogXCIlXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBnYXMgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgZ2FzIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnYXNFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2dhc05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmdhc0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5nYXNDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcbiAgX2dhc05vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgY29uc3QgZWNvMiA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCB0dm9jID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIGVDTzI6IHtcclxuICAgICAgICAgIHZhbHVlOiBlY28yLFxyXG4gICAgICAgICAgdW5pdDogXCJwcG1cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIFRWT0M6IHtcclxuICAgICAgICAgIHZhbHVlOiB0dm9jLFxyXG4gICAgICAgICAgdW5pdDogXCJwcGJcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgY29sb3Igc2Vuc29yIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGNvbG9yIHNlbnNvciBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgY29sb3JFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fY29sb3JOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuY29sb3JFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuY29sb3JDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2NvbG9yTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICBjb25zdCByID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IGcgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgYiA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCBjID0gZGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IHJSYXRpbyA9IHIgLyAociArIGcgKyBiKTtcclxuICAgIGNvbnN0IGdSYXRpbyA9IGcgLyAociArIGcgKyBiKTtcclxuICAgIGNvbnN0IGJSYXRpbyA9IGIgLyAociArIGcgKyBiKTtcclxuICAgIGNvbnN0IGNsZWFyQXRCbGFjayA9IDMwMDtcclxuICAgIGNvbnN0IGNsZWFyQXRXaGl0ZSA9IDQwMDtcclxuICAgIGNvbnN0IGNsZWFyRGlmZiA9IGNsZWFyQXRXaGl0ZSAtIGNsZWFyQXRCbGFjaztcclxuICAgIGxldCBjbGVhck5vcm1hbGl6ZWQgPSAoYyAtIGNsZWFyQXRCbGFjaykgLyBjbGVhckRpZmY7XHJcblxyXG4gICAgaWYgKGNsZWFyTm9ybWFsaXplZCA8IDApIHtcclxuICAgICAgY2xlYXJOb3JtYWxpemVkID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVkID0gclJhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xyXG5cclxuICAgIGlmIChyZWQgPiAyNTUpIHtcclxuICAgICAgcmVkID0gMjU1O1xyXG4gICAgfVxyXG4gICAgbGV0IGdyZWVuID0gZ1JhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xyXG5cclxuICAgIGlmIChncmVlbiA+IDI1NSkge1xyXG4gICAgICBncmVlbiA9IDI1NTtcclxuICAgIH1cclxuICAgIGxldCBibHVlID0gYlJhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xyXG5cclxuICAgIGlmIChibHVlID4gMjU1KSB7XHJcbiAgICAgIGJsdWUgPSAyNTU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHJlZDogcmVkLnRvRml4ZWQoMCksXHJcbiAgICAgICAgZ3JlZW46IGdyZWVuLnRvRml4ZWQoMCksXHJcbiAgICAgICAgYmx1ZTogYmx1ZS50b0ZpeGVkKDApLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gICoqKioqKiAgLy9cclxuICAvKiAgVXNlciBpbnRlcmZhY2Ugc2VydmljZSAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgTEVEIHNldHRpbmdzIGZyb20gdGhlIFRoaW5neSBkZXZpY2UuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggc3RydWN0dXJlIHRoYXQgZGVwZW5kcyBvbiB0aGUgc2V0dGluZ3MuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gUmV0dXJucyBhIExFRCBzdGF0dXMgb2JqZWN0LiBUaGUgY29udGVudCBhbmQgc3RydWN0dXJlIGRlcGVuZHMgb24gdGhlIGN1cnJlbnQgbW9kZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldExlZFN0YXR1cygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmxlZENoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbW9kZSA9IGRhdGEuZ2V0VWludDgoMCk7XHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGxldCBzdGF0dXM7XHJcblxyXG4gICAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIHN0YXR1cyA9IHtMRURzdGF0dXM6IHttb2RlOiBtb2RlfX07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICBzdGF0dXMgPSB7XHJcbiAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgcjogZGF0YS5nZXRVaW50OCgxKSxcclxuICAgICAgICAgIGc6IGRhdGEuZ2V0VWludDgoMiksXHJcbiAgICAgICAgICBiOiBkYXRhLmdldFVpbnQ4KDMpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICBzdGF0dXMgPSB7XHJcbiAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgY29sb3I6IGRhdGEuZ2V0VWludDgoMSksXHJcbiAgICAgICAgICBpbnRlbnNpdHk6IGRhdGEuZ2V0VWludDgoMiksXHJcbiAgICAgICAgICBkZWxheTogZGF0YS5nZXRVaW50MTYoMywgbGl0dGxlRW5kaWFuKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgc3RhdHVzID0ge1xyXG4gICAgICAgICAgbW9kZTogbW9kZSxcclxuICAgICAgICAgIGNvbG9yOiBkYXRhLmdldFVpbnQ4KDEpLFxyXG4gICAgICAgICAgaW50ZW5zaXR5OiBkYXRhLmdldFVpbnQ4KDIpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHN0YXR1cztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgVGhpbmd5IExFRCBzdGF0dXM6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2xlZFNldChkYXRhQXJyYXkpIHtcclxuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5sZWRDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gY29uc3RhbnQgbW9kZSB3aXRoIHRoZSBzcGVjaWZpZWQgUkdCIGNvbG9yLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gY29sb3IgLSBDb2xvciBvYmplY3Qgd2l0aCBSR0IgdmFsdWVzXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5yZWQgLSBUaGUgdmFsdWUgZm9yIHJlZCBjb2xvciBpbiBhbiBSR0IgY29sb3IuIFJhbmdlcyBmcm9tIDAgdG8gMjU1LlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gY29sb3IuZ3JlZW4gLSBUaGUgdmFsdWUgZm9yIGdyZWVuIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5ibHVlIC0gVGhlIHZhbHVlIGZvciBibHVlIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBsZWRDb25zdGFudChjb2xvcikge1xyXG4gICAgaWYgKGNvbG9yLnJlZCA9PT0gdW5kZWZpbmVkIHx8IGNvbG9yLmdyZWVuID09PSB1bmRlZmluZWQgfHwgY29sb3IuYmx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBtdXN0IGhhdmUgdGhlIHByb3BlcnRpZXMgJ3JlZCcsICdncmVlbicgYW5kICdibHVlJy5cIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKFxyXG4gICAgICBjb2xvci5yZWQgPCAwIHx8XHJcbiAgICAgIGNvbG9yLnJlZCA+IDI1NSB8fFxyXG4gICAgICBjb2xvci5ncmVlbiA8IDAgfHxcclxuICAgICAgY29sb3IuZ3JlZW4gPiAyNTUgfHxcclxuICAgICAgY29sb3IuYmx1ZSA8IDAgfHxcclxuICAgICAgY29sb3IuYmx1ZSA+IDI1NVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBSR0IgdmFsdWVzIG11c3QgYmUgaW4gdGhlIHJhbmdlIDAgLSAyNTVcIikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMSwgY29sb3IucmVkLCBjb2xvci5ncmVlbiwgY29sb3IuYmx1ZV0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gXCJicmVhdGhlXCIgbW9kZSB3aGVyZSB0aGUgTEVEIGNvbnRpbnVvdXNseSBwdWxzZXMgd2l0aCB0aGUgc3BlY2lmaWVkIGNvbG9yLCBpbnRlbnNpdHkgYW5kIGRlbGF5IGJldHdlZW4gcHVsc2VzLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT3B0aW9ucyBvYmplY3QgZm9yIExFRCBicmVhdGhlIG1vZGVcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBwYXJhbXMuY29sb3IgLSBUaGUgY29sb3IgY29kZSBvciBjb2xvciBuYW1lLiAxID0gcmVkLCAyID0gZ3JlZW4sIDMgPSB5ZWxsb3csIDQgPSBibHVlLCA1ID0gcHVycGxlLCA2ID0gY3lhbiwgNyA9IHdoaXRlLlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVuc2l0eSAtIEludGVuc2l0eSBvZiBMRUQgcHVsc2VzLiBSYW5nZSBmcm9tIDAgdG8gMTAwIFslXS5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5kZWxheSAtIERlbGF5IGJldHdlZW4gcHVsc2VzIGluIG1pbGxpc2Vjb25kcy4gUmFuZ2UgZnJvbSA1MCBtcyB0byAxMCAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBsZWRCcmVhdGhlKHBhcmFtcykge1xyXG4gICAgY29uc3QgY29sb3JzID0gW1wicmVkXCIsIFwiZ3JlZW5cIiwgXCJ5ZWxsb3dcIiwgXCJibHVlXCIsIFwicHVycGxlXCIsIFwiY3lhblwiLCBcIndoaXRlXCJdO1xyXG4gICAgY29uc3QgY29sb3JDb2RlID0gdHlwZW9mIHBhcmFtcy5jb2xvciA9PT0gXCJzdHJpbmdcIiA/IGNvbG9ycy5pbmRleE9mKHBhcmFtcy5jb2xvcikgKyAxIDogcGFyYW1zLmNvbG9yO1xyXG5cclxuICAgIGlmIChwYXJhbXMuY29sb3IgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaW50ZW5zaXR5ID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmRlbGF5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoXCJUaGUgb3B0aW9ucyBvYmplY3QgZm9yIG11c3QgaGF2ZSB0aGUgcHJvcGVydGllcyAnY29sb3InLCAnaW50ZW5zaXR5JyBhbmQgJ2ludGVuc2l0eScuXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sb3JDb2RlIDwgMSB8fCBjb2xvckNvZGUgPiA3KSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBjb2RlIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEgLSA3XCIpKTtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMuaW50ZW5zaXR5IDwgMCB8fCBwYXJhbXMuaW50ZW5zaXR5ID4gMTAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBpbnRlbnNpdHkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDEwMCVcIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmFtcy5kZWxheSA8IDUwIHx8IHBhcmFtcy5kZWxheSA+IDEwMDAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBkZWxheSBtdXN0IGJlIGluIHRoZSByYW5nZSA1MCBtcyAtIDEwIDAwMCBtc1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMiwgY29sb3JDb2RlLCBwYXJhbXMuaW50ZW5zaXR5LCBwYXJhbXMuZGVsYXkgJiAweGZmLCAocGFyYW1zLmRlbGF5ID4+IDgpICYgMHhmZl0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gb25lLXNob3QgbW9kZS4gT25lLXNob3QgbW9kZSB3aWxsIHJlc3VsdCBpbiBvbmUgc2luZ2xlIHB1bHNlIG9mIHRoZSBMRUQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPcHRpb24gb2JqZWN0IGZvciBMRUQgaW4gb25lLXNob3QgbW9kZVxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmNvbG9yIC0gVGhlIGNvbG9yIGNvZGUuIDEgPSByZWQsIDIgPSBncmVlbiwgMyA9IHllbGxvdywgNCA9IGJsdWUsIDUgPSBwdXJwbGUsIDYgPSBjeWFuLCA3ID0gd2hpdGUuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuaW50ZW5zaXR5IC0gSW50ZW5zaXR5IG9mIExFRCBwdWxzZXMuIFJhbmdlIGZyb20gMCB0byAxMDAgWyVdLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHJlc29sdmVkIHByb21pc2Ugb3IgYW4gZXJyb3IgaW4gYSByZWplY3RlZCBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgbGVkT25lU2hvdChwYXJhbXMpIHtcclxuICAgIGNvbnN0IGNvbG9ycyA9IFtcInJlZFwiLCBcImdyZWVuXCIsIFwieWVsbG93XCIsIFwiYmx1ZVwiLCBcInB1cnBsZVwiLCBcImN5YW5cIiwgXCJ3aGl0ZVwiXTtcclxuICAgIGNvbnN0IGNvbG9yQ29kZSA9IHR5cGVvZiBwYXJhbXMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBjb2xvcnMuaW5kZXhPZihwYXJhbXMuY29sb3IpICsgMSA6IHBhcmFtcy5jb2xvcjtcclxuXHJcbiAgICBpZiAoY29sb3JDb2RlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmludGVuc2l0eSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcclxuICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBMRUQgb25lLXNob3QgbXVzdCBoYXZlIHRoZSBwcm9wZXJ0aWVzICdjb2xvcicgYW5kICdpbnRlbnNpdHkuXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sb3JDb2RlIDwgMSB8fCBjb2xvckNvZGUgPiA3KSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBjb2RlIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEgLSA3XCIpKTtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMuaW50ZW5zaXR5IDwgMSB8fCBwYXJhbXMuaW50ZW5zaXR5ID4gMTAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBpbnRlbnNpdHkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDEwMFwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMywgY29sb3JDb2RlLCBwYXJhbXMuaW50ZW5zaXR5XSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgYnV0dG9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGJ1dHRvbiBvbiB0aGUgVGhpbmd5IGlzIHB1c2hlZCBvciByZWxlYXNlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgYnV0dG9uIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdpdGggYnV0dG9uIHN0YXRlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgYnV0dG9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9idXR0b25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5idXR0b25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5idXR0b25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9idXR0b25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3Qgc3RhdGUgPSBkYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHN0YXRlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgZXh0ZXJuYWwgcGluIHNldHRpbmdzIGZyb20gdGhlIFRoaW5neSBkZXZpY2UuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggcGluIHN0YXR1cyBpbmZvcm1hdGlvbi5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIGV4dGVybmFsIHBpbiBzdGF0dXMgb2JqZWN0LlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZXh0ZXJuYWxQaW5zU3RhdHVzKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IHBpblN0YXR1cyA9IHtcclxuICAgICAgICBwaW4xOiBkYXRhLmdldFVpbnQ4KDApLFxyXG4gICAgICAgIHBpbjI6IGRhdGEuZ2V0VWludDgoMSksXHJcbiAgICAgICAgcGluMzogZGF0YS5nZXRVaW50OCgyKSxcclxuICAgICAgICBwaW40OiBkYXRhLmdldFVpbnQ4KDMpLFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcGluU3RhdHVzO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gcmVhZGluZyBmcm9tIGV4dGVybmFsIHBpbiBjaGFyYWN0ZXJpc3RpYzogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0IGFuIGV4dGVybmFsIHBpbiB0byBjaG9zZW4gc3RhdGUuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwaW4gLSBEZXRlcm1pbmVzIHdoaWNoIHBpbiBpcyBzZXQuIFJhbmdlIDEgLSA0LlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgcGluLiAwID0gT0ZGLCAyNTUgPSBPTi5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0RXh0ZXJuYWxQaW4ocGluLCB2YWx1ZSkge1xyXG4gICAgaWYgKHBpbiA8IDEgfHwgcGluID4gNCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUGluIG51bWJlciBtdXN0IGJlIDEgLSA0XCIpKTtcclxuICAgIH1cclxuICAgIGlmICghKHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAyNTUpKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQaW4gc3RhdHVzIHZhbHVlIG11c3QgYmUgMCBvciAyNTVcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2UgcGlucyB0aGF0IGFyZSBub3QgYmVpbmcgc2V0XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDQpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVtwaW4gLSAxXSA9IHZhbHVlO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIGV4dGVybmFsIHBpbnM6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gICoqKioqKiAgLy9cclxuICAvKiAgTW90aW9uIHNlcnZpY2UgICovXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBvZiB0aGUgVGhpbmd5IG1vdGlvbiBtb2R1bGUuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhIG1vdGlvbiBjb25maWd1cmF0aW9uIG9iamVjdCB3aGVuIHByb21pc2UgcmVzb2x2ZXMsIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0TW90aW9uQ29uZmlnKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBjb25zdCBzdGVwQ291bnRlckludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgdGVtcENvbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IG1hZ25ldENvbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IG1vdGlvblByb2Nlc3NpbmdGcmVxdWVuY3kgPSBkYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCB3YWtlT25Nb3Rpb24gPSBkYXRhLmdldFVpbnQ4KDgpO1xyXG4gICAgICBjb25zdCBjb25maWcgPSB7XHJcbiAgICAgICAgc3RlcENvdW50SW50ZXJ2YWw6IHN0ZXBDb3VudGVySW50ZXJ2YWwsXHJcbiAgICAgICAgdGVtcENvbXBJbnRlcnZhbDogdGVtcENvbXBJbnRlcnZhbCxcclxuICAgICAgICBtYWduZXRDb21wSW50ZXJ2YWw6IG1hZ25ldENvbXBJbnRlcnZhbCxcclxuICAgICAgICBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5OiBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5LFxyXG4gICAgICAgIHdha2VPbk1vdGlvbjogd2FrZU9uTW90aW9uLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgVGhpbmd5IG1vdGlvbiBtb2R1bGUgY29uZmlndXJhdGlvbjogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgc3RlcCBjb3VudGVyIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gaW50ZXJ2YWwgLSBTdGVwIGNvdW50ZXIgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNSAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldFN0ZXBDb3VudGVySW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDUwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gNTAwMCBtcy5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVsxXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBzdGVwIGNvdW50IGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSB0ZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRlbXBlcmF0dXJlIGNvbXBlbnNhdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA1IDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0VGVtcGVyYXR1cmVDb21wSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDUwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gNTAwMCBtcy5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbMl0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVszXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyB0ZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIE1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gMSAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldE1hZ25ldENvbXBJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gMTAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSAxMDAgLSAxMDAwIG1zLlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs0XSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzVdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgbW90aW9uIHByb2Nlc3NpbmcgdW5pdCB1cGRhdGUgZnJlcXVlbmN5LlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gZnJlcXVlbmN5IC0gTW90aW9uIHByb2Nlc3NpbmcgZnJlcXVlbmN5IGluIEh6LiBUaGUgYWxsb3dlZCByYW5nZSBpcyA1IC0gMjAwIEh6LlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRNb3Rpb25Qcm9jZXNzRnJlcXVlbmN5KGZyZXF1ZW5jeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGZyZXF1ZW5jeSA8IDEwMCB8fCBmcmVxdWVuY3kgPiAyMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgNSAtIDIwMCBIei5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbNl0gPSBmcmVxdWVuY3kgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbN10gPSAoZnJlcXVlbmN5ID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1vdGlvbiBwb3JjZXNzaW5nIHVuaXQgdXBkYXRlIGZyZXF1ZW5jeTogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB3YWtlLW9uLW1vdGlvbiBmZWF0dXJlIHRvIGVuYWJsZWQgb3IgZGlzYWJsZWQgc3RhdGUuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gU2V0IHRvIFRydWUgdG8gZW5hYmxlIG9yIEZhbHNlIHRvIGRpc2FibGUgd2FrZS1vbi1tb3Rpb24gZmVhdHVyZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0V2FrZU9uTW90aW9uKGVuYWJsZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKHR5cGVvZiBlbmFibGUgIT09IFwiYm9vbGVhblwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBhcmd1bWVudCBtdXN0IGJlIHRydWUgb3IgZmFsc2UuXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzhdID0gZW5hYmxlID8gMSA6IDA7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBtYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsOlwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgdGFwIGRldGVjdGlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSB0YXAgZGV0ZWN0aW9uIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyB0YXBFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3RhcE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnRhcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy50YXBDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF90YXBOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIGNvbnN0IGNvdW50ID0gZGF0YS5nZXRVaW50OCgxKTtcclxuICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgY291bnQ6IGNvdW50LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgb3JpZW50YXRpb24gZGV0ZWN0aW9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIG9yaWVudGF0aW9uIGRldGVjdGlvbiBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgb3JpZW50YXRpb25FbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fb3JpZW50YXRpb25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMub3JpZW50YXRpb25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX29yaWVudGF0aW9uTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKG9yaWVudGF0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgcXVhdGVybmlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBxdWF0ZXJuaW9uIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBxdWF0ZXJuaW9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fcXVhdGVybmlvbk5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5xdWF0ZXJuaW9uQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX3F1YXRlcm5pb25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAoMSA8PCAzMCkgYWNjb3JkaW5nIHRvIHNlbnNvciBzcGVjaWZpY2F0aW9uXHJcbiAgICBsZXQgdyA9IGRhdGEuZ2V0SW50MzIoMCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XHJcbiAgICBsZXQgeCA9IGRhdGEuZ2V0SW50MzIoNCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XHJcbiAgICBsZXQgeSA9IGRhdGEuZ2V0SW50MzIoOCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XHJcbiAgICBsZXQgeiA9IGRhdGEuZ2V0SW50MzIoMTIsIHRydWUpIC8gKDEgPDwgMzApO1xyXG4gICAgY29uc3QgbWFnbml0dWRlID0gTWF0aC5zcXJ0KE1hdGgucG93KHcsIDIpICsgTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSArIE1hdGgucG93KHosIDIpKTtcclxuXHJcbiAgICBpZiAobWFnbml0dWRlICE9PSAwKSB7XHJcbiAgICAgIHcgLz0gbWFnbml0dWRlO1xyXG4gICAgICB4IC89IG1hZ25pdHVkZTtcclxuICAgICAgeSAvPSBtYWduaXR1ZGU7XHJcbiAgICAgIHogLz0gbWFnbml0dWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHc6IHcsXHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIHo6IHosXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBzdGVwIGNvdW50ZXIgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgc3RlcCBjb3VudGVyIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzdGVwRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fc3RlcE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5zdGVwQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX3N0ZXBOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgIGNvbnN0IGNvdW50ID0gZGF0YS5nZXRVaW50MzIoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRhLmdldFVpbnQzMig0LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgY291bnQ6IGNvdW50LFxyXG4gICAgICAgIHRpbWU6IHtcclxuICAgICAgICAgIHZhbHVlOiB0aW1lLFxyXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyByYXcgbW90aW9uIGRhdGEgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgcmF3IG1vdGlvbiBkYXRhIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBtb3Rpb25SYXdFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX21vdGlvblJhd05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5tb3Rpb25SYXdDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9tb3Rpb25SYXdOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjYgPSA2NCB0byBnZXQgYWNjZWxlcm9tZXRlciBjb3JyZWN0IHZhbHVlc1xyXG4gICAgY29uc3QgYWNjWCA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA2NDtcclxuICAgIGNvbnN0IGFjY1kgPSBkYXRhLmdldEludDE2KDIsIHRydWUpIC8gNjQ7XHJcbiAgICBjb25zdCBhY2NaID0gZGF0YS5nZXRJbnQxNig0LCB0cnVlKSAvIDY0O1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjExID0gMjA0OCB0byBnZXQgY29ycmVjdCBneXJvc2NvcGUgdmFsdWVzXHJcbiAgICBjb25zdCBneXJvWCA9IGRhdGEuZ2V0SW50MTYoNiwgdHJ1ZSkgLyAyMDQ4O1xyXG4gICAgY29uc3QgZ3lyb1kgPSBkYXRhLmdldEludDE2KDgsIHRydWUpIC8gMjA0ODtcclxuICAgIGNvbnN0IGd5cm9aID0gZGF0YS5nZXRJbnQxNigxMCwgdHJ1ZSkgLyAyMDQ4O1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjEyID0gNDA5NiB0byBnZXQgY29ycmVjdCBjb21wYXNzIHZhbHVlc1xyXG4gICAgY29uc3QgY29tcGFzc1ggPSBkYXRhLmdldEludDE2KDEyLCB0cnVlKSAvIDQwOTY7XHJcbiAgICBjb25zdCBjb21wYXNzWSA9IGRhdGEuZ2V0SW50MTYoMTQsIHRydWUpIC8gNDA5NjtcclxuICAgIGNvbnN0IGNvbXBhc3NaID0gZGF0YS5nZXRJbnQxNigxNiwgdHJ1ZSkgLyA0MDk2O1xyXG5cclxuICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgYWNjZWxlcm9tZXRlcjoge1xyXG4gICAgICAgICAgeDogYWNjWCxcclxuICAgICAgICAgIHk6IGFjY1ksXHJcbiAgICAgICAgICB6OiBhY2NaLFxyXG4gICAgICAgICAgdW5pdDogXCJHXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBneXJvc2NvcGU6IHtcclxuICAgICAgICAgIHg6IGd5cm9YLFxyXG4gICAgICAgICAgeTogZ3lyb1ksXHJcbiAgICAgICAgICB6OiBneXJvWixcclxuICAgICAgICAgIHVuaXQ6IFwiZGVnL3NcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBhc3M6IHtcclxuICAgICAgICAgIHg6IGNvbXBhc3NYLFxyXG4gICAgICAgICAgeTogY29tcGFzc1ksXHJcbiAgICAgICAgICB6OiBjb21wYXNzWixcclxuICAgICAgICAgIHVuaXQ6IFwibWljcm9UZXNsYVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBFdWxlciBhbmdsZSBkYXRhIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhbiBFdWxlciBhbmdsZSBkYXRhIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBldWxlckVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9ldWxlck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5ldWxlckNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfZXVsZXJOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSB0d28gYnl0ZXMgKDE8PDE2IG9yIDJeMTYgb3IgNjU1MzYpIHRvIGdldCBjb3JyZWN0IHZhbHVlXHJcbiAgICBjb25zdCByb2xsID0gZGF0YS5nZXRJbnQzMigwLCB0cnVlKSAvIDY1NTM2O1xyXG4gICAgY29uc3QgcGl0Y2ggPSBkYXRhLmdldEludDMyKDQsIHRydWUpIC8gNjU1MzY7XHJcbiAgICBjb25zdCB5YXcgPSBkYXRhLmdldEludDMyKDgsIHRydWUpIC8gNjU1MzY7XHJcblxyXG4gICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHJvbGw6IHJvbGwsXHJcbiAgICAgICAgcGl0Y2g6IHBpdGNoLFxyXG4gICAgICAgIHlhdzogeWF3LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgcm90YXRpb24gbWF0cml4IG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzdW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhbiByb3RhdGlvbiBtYXRyaXggb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHJvdGF0aW9uTWF0cml4RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3JvdGF0aW9uTWF0cml4Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeENoYXJhY3RlcmlzdGljLFxyXG4gICAgICBlbmFibGUsXHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1swXVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIF9yb3RhdGlvbk1hdHJpeE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5IDJeMiA9IDQgdG8gZ2V0IGNvcnJlY3QgdmFsdWVzXHJcbiAgICBjb25zdCByMWMxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMWMyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMWMzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMmMxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMmMyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMmMzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByM2MxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByM2MyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByM2MzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcblxyXG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHJvdzE6IFtyMWMxLCByMWMyLCByMWMzXSxcclxuICAgICAgICByb3cyOiBbcjJjMSwgcjJjMiwgcjJjM10sXHJcbiAgICAgICAgcm93MzogW3IzYzEsIHIzYzIsIHIzYzNdLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgaGVhZGluZyBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBoZWFkaW5nIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBoZWFkaW5nRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5faGVhZGluZ05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5oZWFkaW5nQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2hlYWRpbmdOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjE2ID0gNjU1MzYgdG8gZ2V0IGNvcnJlY3QgaGVhZGluZyB2YWx1ZXNcclxuICAgIGNvbnN0IGhlYWRpbmcgPSBkYXRhLmdldEludDMyKDAsIHRydWUpIC8gNjU1MzY7XHJcblxyXG4gICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgdmFsdWU6IGhlYWRpbmcsXHJcbiAgICAgICAgdW5pdDogXCJkZWdyZWVzXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBncmF2aXR5IHZlY3RvciBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBoZWFkaW5nIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBncmF2aXR5VmVjdG9yRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fZ3Jhdml0eVZlY3Rvck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWMoXHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckNoYXJhY3RlcmlzdGljLFxyXG4gICAgICBlbmFibGUsXHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzBdXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgX2dyYXZpdHlWZWN0b3JOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgeCA9IGRhdGEuZ2V0RmxvYXQzMigwLCB0cnVlKTtcclxuICAgIGNvbnN0IHkgPSBkYXRhLmdldEZsb2F0MzIoNCwgdHJ1ZSk7XHJcbiAgICBjb25zdCB6ID0gZGF0YS5nZXRGbG9hdDMyKDgsIHRydWUpO1xyXG5cclxuICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHg6IHgsXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICB6OiB6LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gICoqKioqKiAgLy9cclxuXHJcbiAgLyogIFNvdW5kIHNlcnZpY2UgICovXHJcblxyXG4gIG1pY3JvcGhvbmVFbmFibGUoZW5hYmxlKSB7XHJcbiAgICAvLyBUYWJsZXMgb2YgY29uc3RhbnRzIG5lZWRlZCBmb3Igd2hlbiB3ZSBkZWNvZGUgdGhlIGFkcGNtLWVuY29kZWQgYXVkaW8gZnJvbSB0aGUgVGhpbmd5XHJcbiAgICBpZiAodGhpcy5fTUlDUk9QSE9ORV9JTkRFWF9UQUJMRSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX01JQ1JPUEhPTkVfSU5ERVhfVEFCTEUgPSBbLTEsIC0xLCAtMSwgLTEsIDIsIDQsIDYsIDgsIC0xLCAtMSwgLTEsIC0xLCAyLCA0LCA2LCA4XTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFID0gWzcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTYsIDE3LCAxOSwgMjEsIDIzLCAyNSwgMjgsIDMxLCAzNCwgMzcsIDQxLCA0NSwgNTAsIDU1LCA2MCwgNjYsIDczLCA4MCwgODgsIDk3LCAxMDcsIDExOCwgMTMwLCAxNDMsIDE1NywgMTczLCAxOTAsIDIwOSxcclxuICAgICAgICAyMzAsIDI1MywgMjc5LCAzMDcsIDMzNywgMzcxLCA0MDgsIDQ0OSwgNDk0LCA1NDQsIDU5OCwgNjU4LCA3MjQsIDc5NiwgODc2LCA5NjMsIDEwNjAsIDExNjYsIDEyODIsIDE0MTEsIDE1NTIsIDE3MDcsIDE4NzgsIDIwNjYsIDIyNzIsIDI0OTksIDI3NDksIDMwMjQsIDMzMjcsIDM2NjAsIDQwMjYsIDQ0MjgsIDQ4NzEsIDUzNTgsXHJcbiAgICAgICAgNTg5NCwgNjQ4NCwgNzEzMiwgNzg0NSwgODYzMCwgOTQ5MywgMTA0NDIsIDExNDg3LCAxMjYzNSwgMTM4OTksIDE1Mjg5LCAxNjgxOCwgMTg1MDAsIDIwMzUwLCAyMjM4NSwgMjQ2MjMsIDI3MDg2LCAyOTc5NCwgMzI3NjddO1xyXG4gICAgfVxyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLm1pY3JvcGhvbmVFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX21pY3JvcGhvbmVOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIC8vIGxhZ2VyIGVuIG55IGF1ZGlvIGNvbnRleHQsIHNrYWwgYmFyZSBoYSDDqW4gYXYgZGVubmVcclxuICAgICAgaWYgKHRoaXMuYXVkaW9DdHggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcclxuICAgICAgICB0aGlzLmF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5taWNyb3Bob25lQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5taWNyb3Bob25lRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuICBfbWljcm9waG9uZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGF1ZGlvUGFja2V0ID0gZXZlbnQudGFyZ2V0LnZhbHVlLmJ1ZmZlcjtcclxuICAgIGNvbnN0IGFkcGNtID0ge1xyXG4gICAgICBoZWFkZXI6IG5ldyBEYXRhVmlldyhhdWRpb1BhY2tldC5zbGljZSgwLCAzKSksXHJcbiAgICAgIGRhdGE6IG5ldyBEYXRhVmlldyhhdWRpb1BhY2tldC5zbGljZSgzKSksXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZGVjb2RlZEF1ZGlvID0gdGhpcy5fZGVjb2RlQXVkaW8oYWRwY20pO1xyXG4gICAgdGhpcy5fcGxheURlY29kZWRBdWRpbyhkZWNvZGVkQXVkaW8pO1xyXG4gIH1cclxuICAvKiAgU291bmQgc2VydmljZSAgKi9cclxuICBfZGVjb2RlQXVkaW8oYWRwY20pIHtcclxuICAgIC8vIEFsbG9jYXRlIG91dHB1dCBidWZmZXJcclxuICAgIGNvbnN0IGF1ZGlvQnVmZmVyRGF0YUxlbmd0aCA9IGFkcGNtLmRhdGEuYnl0ZUxlbmd0aDtcclxuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDUxMik7XHJcbiAgICBjb25zdCBwY20gPSBuZXcgRGF0YVZpZXcoYXVkaW9CdWZmZXIpO1xyXG4gICAgbGV0IGRpZmY7XHJcbiAgICBsZXQgYnVmZmVyU3RlcCA9IGZhbHNlO1xyXG4gICAgbGV0IGlucHV0QnVmZmVyID0gMDtcclxuICAgIGxldCBkZWx0YSA9IDA7XHJcbiAgICBsZXQgc2lnbiA9IDA7XHJcbiAgICBsZXQgc3RlcDtcclxuXHJcbiAgICAvLyBUaGUgZmlyc3QgMiBieXRlcyBvZiBBRFBDTSBmcmFtZSBhcmUgdGhlIHByZWRpY3RlZCB2YWx1ZVxyXG4gICAgbGV0IHZhbHVlUHJlZGljdGVkID0gYWRwY20uaGVhZGVyLmdldEludDE2KDAsIGZhbHNlKTtcclxuICAgIC8vIFRoZSAzcmQgYnl0ZSBpcyB0aGUgaW5kZXggdmFsdWVcclxuICAgIGxldCBpbmRleCA9IGFkcGNtLmhlYWRlci5nZXRJbnQ4KDIpO1xyXG4gICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICBpbmRleCA9IDA7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggPiA4OCkge1xyXG4gICAgICBpbmRleCA9IDg4O1xyXG4gICAgfVxyXG4gICAgc3RlcCA9IHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFW2luZGV4XTtcclxuICAgIGZvciAobGV0IF9pbiA9IDAsIF9vdXQgPSAwOyBfaW4gPCBhdWRpb0J1ZmZlckRhdGFMZW5ndGg7IF9vdXQgKz0gMikge1xyXG4gICAgICAvKiBTdGVwIDEgLSBnZXQgdGhlIGRlbHRhIHZhbHVlICovXHJcbiAgICAgIGlmIChidWZmZXJTdGVwKSB7XHJcbiAgICAgICAgZGVsdGEgPSBpbnB1dEJ1ZmZlciAmIDB4MEY7XHJcbiAgICAgICAgX2luKys7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5wdXRCdWZmZXIgPSBhZHBjbS5kYXRhLmdldEludDgoX2luKTtcclxuICAgICAgICBkZWx0YSA9IChpbnB1dEJ1ZmZlciA+PiA0KSAmIDB4MEY7XHJcbiAgICAgIH1cclxuICAgICAgYnVmZmVyU3RlcCA9ICFidWZmZXJTdGVwO1xyXG4gICAgICAvKiBTdGVwIDIgLSBGaW5kIG5ldyBpbmRleCB2YWx1ZSAoZm9yIGxhdGVyKSAqL1xyXG4gICAgICBpbmRleCArPSB0aGlzLl9NSUNST1BIT05FX0lOREVYX1RBQkxFW2RlbHRhXTtcclxuICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaW5kZXggPiA4OCkge1xyXG4gICAgICAgIGluZGV4ID0gODg7XHJcbiAgICAgIH1cclxuICAgICAgLyogU3RlcCAzIC0gU2VwYXJhdGUgc2lnbiBhbmQgbWFnbml0dWRlICovXHJcbiAgICAgIHNpZ24gPSBkZWx0YSAmIDg7XHJcbiAgICAgIGRlbHRhID0gZGVsdGEgJiA3O1xyXG4gICAgICAvKiBTdGVwIDQgLSBDb21wdXRlIGRpZmZlcmVuY2UgYW5kIG5ldyBwcmVkaWN0ZWQgdmFsdWUgKi9cclxuICAgICAgZGlmZiA9IChzdGVwID4+IDMpO1xyXG4gICAgICBpZiAoKGRlbHRhICYgNCkgPiAwKSB7XHJcbiAgICAgICAgZGlmZiArPSBzdGVwO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgoZGVsdGEgJiAyKSA+IDApIHtcclxuICAgICAgICBkaWZmICs9IChzdGVwID4+IDEpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgoZGVsdGEgJiAxKSA+IDApIHtcclxuICAgICAgICBkaWZmICs9IChzdGVwID4+IDIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzaWduID4gMCkge1xyXG4gICAgICAgIHZhbHVlUHJlZGljdGVkIC09IGRpZmY7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgKz0gZGlmZjtcclxuICAgICAgfVxyXG4gICAgICAvKiBTdGVwIDUgLSBjbGFtcCBvdXRwdXQgdmFsdWUgKi9cclxuICAgICAgaWYgKHZhbHVlUHJlZGljdGVkID4gMzI3NjcpIHtcclxuICAgICAgICB2YWx1ZVByZWRpY3RlZCA9IDMyNzY3O1xyXG4gICAgICB9IGVsc2UgaWYgKHZhbHVlUHJlZGljdGVkIDwgLTMyNzY4KSB7XHJcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgPSAtMzI3Njg7XHJcbiAgICAgIH1cclxuICAgICAgLyogU3RlcCA2IC0gVXBkYXRlIHN0ZXAgdmFsdWUgKi9cclxuICAgICAgc3RlcCA9IHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFW2luZGV4XTtcclxuICAgICAgLyogU3RlcCA3IC0gT3V0cHV0IHZhbHVlICovXHJcbiAgICAgIHBjbS5zZXRJbnQxNihfb3V0LCB2YWx1ZVByZWRpY3RlZCwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGNtO1xyXG4gIH1cclxuICBfcGxheURlY29kZWRBdWRpbyhhdWRpbykge1xyXG4gICAgaWYgKHRoaXMuX2F1ZGlvU3RhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9hdWRpb1N0YWNrID0gW107XHJcbiAgICB9XHJcbiAgICB0aGlzLl9hdWRpb1N0YWNrLnB1c2goYXVkaW8pO1xyXG4gICAgaWYgKHRoaXMuX2F1ZGlvU3RhY2subGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuX3NjaGVkdWxlQXVkaW9CdWZmZXJzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIF9zY2hlZHVsZUF1ZGlvQnVmZmVycygpIHtcclxuICAgIHdoaWxlICh0aGlzLl9hdWRpb1N0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgYnVmZmVyVGltZSA9IDAuMDE7IC8vIEJ1ZmZlciB0aW1lIGluIHNlY29uZHMgYmVmb3JlIGluaXRpYWwgYXVkaW8gY2h1bmsgaXMgcGxheWVkXHJcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX2F1ZGlvU3RhY2suc2hpZnQoKTtcclxuICAgICAgY29uc3QgY2hhbm5lbHMgPSAxO1xyXG4gICAgICBjb25zdCBmcmFtZWNvdW50ID0gYnVmZmVyLmJ5dGVMZW5ndGggLyAyO1xyXG4gICAgICBpZiAodGhpcy5fYXVkaW9OZXh0VGltZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgbXlBcnJheUJ1ZmZlciA9IHRoaXMuYXVkaW9DdHguY3JlYXRlQnVmZmVyKGNoYW5uZWxzLCBmcmFtZWNvdW50LCAxNjAwMCk7XHJcbiAgICAgIC8vIFRoaXMgZ2l2ZXMgdXMgdGhlIGFjdHVhbCBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhXHJcbiAgICAgIGNvbnN0IG5vd0J1ZmZlcmluZyA9IG15QXJyYXlCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyLmJ5dGVMZW5ndGggLyAyOyBpKyspIHtcclxuICAgICAgICBub3dCdWZmZXJpbmdbaV0gPSBidWZmZXIuZ2V0SW50MTYoMiAqIGksIHRydWUpIC8gMzI3NjguMDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICBzb3VyY2UuYnVmZmVyID0gbXlBcnJheUJ1ZmZlcjtcclxuICAgICAgc291cmNlLmNvbm5lY3QodGhpcy5hdWRpb0N0eC5kZXN0aW5hdGlvbik7XHJcbiAgICAgIGlmICh0aGlzLl9hdWRpb05leHRUaW1lID09PSAwKSB7XHJcbiAgICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSA9IHRoaXMuYXVkaW9DdHguY3VycmVudFRpbWUgKyBidWZmZXJUaW1lO1xyXG4gICAgICB9XHJcbiAgICAgIHNvdXJjZS5zdGFydCh0aGlzLl9hdWRpb05leHRUaW1lKTtcclxuICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSArPSBzb3VyY2UuYnVmZmVyLmR1cmF0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyAgKioqKioqICAvL1xyXG5cclxuICAvKiAgQmF0dGVyeSBzZXJ2aWNlICAqL1xyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBiYXR0ZXJ5IGxldmVsIG9mIFRoaW5neS5cclxuICAgKlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdCB8IEVycm9yPn0gUmV0dXJucyBiYXR0ZXJ5IGxldmVsIGluIHBlcmNlbnRhZ2Ugd2hlbiBwcm9taXNlIGlzIHJlc29sdmVkIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0QmF0dGVyeUxldmVsKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5iYXR0ZXJ5Q2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBsZXZlbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgwKTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsdWU6IGxldmVsLFxyXG4gICAgICAgIHVuaXQ6IFwiJVwiLFxyXG4gICAgICB9O1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgYmF0dGVyeSBsZXZlbCBub3RpZmljYXRpb25zLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gYmF0dGVyeSBsZXZlbCBjaGFuZ2UuIFdpbGwgcmVjZWl2ZSBhIGJhdHRlcnkgbGV2ZWwgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAgICovXHJcbiAgYXN5bmMgYmF0dGVyeUxldmVsRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9iYXR0ZXJ5TGV2ZWxOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuYmF0dGVyeUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2JhdHRlcnlMZXZlbE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGRhdGEuZ2V0VWludDgoMCk7XHJcblxyXG4gICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgdW5pdDogXCIlXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyAgKioqKioqICAvL1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQge1BhcnRUaGVtZU1peGlufSBmcm9tICcuL2xpYnMvcGFydC10aGVtZS5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFydFRoZW1lRWxlbWVudCBleHRlbmRzIFBhcnRUaGVtZU1peGluKEhUTUxFbGVtZW50KSB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYGA7XHJcbiAgICB9XHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgaWYgKCF0aGlzLnNoYWRvd1Jvb3QpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuY29uc3RydWN0b3IudGVtcGxhdGU7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSk7XHJcbiAgICAgICAgICBjb25zdCBkb20gPSBkb2N1bWVudC5pbXBvcnROb2RlKFxyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoZG9tKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5leHBvcnQgY2xhc3MgWFRodW1icyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cclxuICAgICAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi1kb3duXCI+8J+RjjwvZGl2PlxyXG4gICAgICBgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXRodW1icycsIFhUaHVtYnMpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFhSYXRpbmcgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAgOmhvc3Qge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXRodW1iczo6cGFydCh0aHVtYi11cCkge1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBkb3R0ZWQgZ3JlZW47XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXRodW1iczo6cGFydCh0aHVtYi1kb3duKSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCByZWQ7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICA8ZGl2IHBhcnQ9XCJzdWJqZWN0XCI+PHNsb3Q+PC9zbG90PjwvZGl2PlxyXG4gICAgICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1yYXRpbmcnLCBYUmF0aW5nKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBYSG9zdCBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgICA6aG9zdCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCBvcmFuZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZyB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogNHB4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmc6OnBhcnQoc3ViamVjdCkge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmcge1xyXG4gICAgICAgICAgICAtLWUxLXBhcnQtc3ViamVjdC1wYWRkaW5nOiA0cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAudW5vOmhvdmVyOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGlnaHRncmVlbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC5kdW86OnBhcnQoc3ViamVjdCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBnb2xkZW5yb2Q7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAudW5vOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBncmVlbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdG9tYXRvO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLmR1bzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogeWVsbG93O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLmR1bzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBibGFjaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nOjp0aGVtZSh0aHVtYi11cCkge1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIDwvc3R5bGU+XHJcbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwidW5vXCI+4p2k77iPPC94LXJhdGluZz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwiZHVvXCI+8J+ktzwveC1yYXRpbmc+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1ob3N0JywgWEhvc3QpOyIsIi8qXHJcbkBsaWNlbnNlXHJcbkNvcHlyaWdodCAoYykgMjAxNyBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcclxuVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcclxuVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XHJcbkNvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXHJcbnN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XHJcbiovXHJcblxyXG5jb25zdCBwYXJ0RGF0YUtleSA9ICdfX2Nzc1BhcnRzJztcclxuY29uc3QgcGFydElkS2V5ID0gJ19fcGFydElkJztcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhbnkgc3R5bGUgZWxlbWVudHMgaW4gdGhlIHNoYWRvd1Jvb3QgdG8gcmVwbGFjZSA6OnBhcnQvOjp0aGVtZVxyXG4gKiB3aXRoIGN1c3RvbSBwcm9wZXJ0aWVzIHVzZWQgdG8gdHJhbnNtaXQgdGhpcyBkYXRhIGRvd24gdGhlIGRvbSB0cmVlLiBBbHNvXHJcbiAqIGNhY2hlcyBwYXJ0IG1ldGFkYXRhIGZvciBsYXRlciBsb29rdXAuXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVQYXJ0cyhlbGVtZW50KSB7XHJcbiAgaWYgKCFlbGVtZW50LnNoYWRvd1Jvb3QpIHtcclxuICAgIGVsZW1lbnRbcGFydERhdGFLZXldID0gbnVsbDtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgQXJyYXkuZnJvbShlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSkuZm9yRWFjaChzdHlsZSA9PiB7XHJcbiAgICBjb25zdCBpbmZvID0gcGFydENzc1RvQ3VzdG9tUHJvcENzcyhlbGVtZW50LCBzdHlsZS50ZXh0Q29udGVudCk7XHJcbiAgICBpZiAoaW5mby5wYXJ0cykge1xyXG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IGVsZW1lbnRbcGFydERhdGFLZXldIHx8IFtdO1xyXG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XS5wdXNoKC4uLmluZm8ucGFydHMpO1xyXG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9IGluZm8uY3NzO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpIHtcclxuICBpZiAoIWVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ19fY3NzUGFydHMnKSkge1xyXG4gICAgaW5pdGlhbGl6ZVBhcnRzKGVsZW1lbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFydERhdGFGb3JFbGVtZW50KGVsZW1lbnQpIHtcclxuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcclxuICByZXR1cm4gZWxlbWVudFtwYXJ0RGF0YUtleV07XHJcbn1cclxuXHJcbi8vIFRPRE8oc29ydmVsbCk6IGJyaXR0bGUgZHVlIHRvIHJlZ2V4LWluZyBjc3MuIEluc3RlYWQgdXNlIGEgY3NzIHBhcnNlci5cclxuLyoqXHJcbiAqIFR1cm5zIGNzcyB1c2luZyBgOjpwYXJ0YCBpbnRvIGNzcyB1c2luZyB2YXJpYWJsZXMgZm9yIHRob3NlIHBhcnRzLlxyXG4gKiBBbHNvIHJldHVybnMgcGFydCBtZXRhZGF0YS5cclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjc3NUZXh0XHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IGNzczogcGFydGlmaWVkIGNzcywgcGFydHM6IGFycmF5IG9mIHBhcnRzIG9mIHRoZSBmb3JtXHJcbiAqIHtuYW1lLCBzZWxlY3RvciwgcHJvcHN9XHJcbiAqIEV4YW1wbGUgb2YgcGFydC1pZmllZCBjc3MsIGdpdmVuOlxyXG4gKiAuZm9vOjpwYXJ0KGJhcikgeyBjb2xvcjogcmVkIH1cclxuICogb3V0cHV0OlxyXG4gKiAuZm9vIHsgLS1lMS1wYXJ0LWJhci1jb2xvcjogcmVkOyB9XHJcbiAqIHdoZXJlIGBlMWAgaXMgYSBndWlkIGZvciB0aGlzIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJ0Q3NzVG9DdXN0b21Qcm9wQ3NzKGVsZW1lbnQsIGNzc1RleHQpIHtcclxuICBsZXQgcGFydHM7XHJcbiAgbGV0IGNzcyA9IGNzc1RleHQucmVwbGFjZShjc3NSZSwgKG0sIHNlbGVjdG9yLCB0eXBlLCBuYW1lLCBlbmRTZWxlY3RvciwgcHJvcHNTdHIpID0+IHtcclxuICAgIHBhcnRzID0gcGFydHMgfHwgW107XHJcbiAgICBsZXQgcHJvcHMgPSB7fTtcclxuICAgIGNvbnN0IHByb3BzQXJyYXkgPSBwcm9wc1N0ci5zcGxpdCgvXFxzKjtcXHMqLyk7XHJcbiAgICBwcm9wc0FycmF5LmZvckVhY2gocHJvcCA9PiB7XHJcbiAgICAgIGNvbnN0IHMgPSBwcm9wLnNwbGl0KCc6Jyk7XHJcbiAgICAgIGNvbnN0IG5hbWUgPSBzLnNoaWZ0KCkudHJpbSgpO1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IHMuam9pbignOicpO1xyXG4gICAgICBwcm9wc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICBwYXJ0cy5wdXNoKHtzZWxlY3RvciwgZW5kU2VsZWN0b3IsIG5hbWUsIHByb3BzLCBpc1RoZW1lOiB0eXBlID09IHRoZW1lfSk7XHJcbiAgICBsZXQgcGFydFByb3BzID0gJyc7XHJcbiAgICBmb3IgKGxldCBwIGluIHByb3BzKSB7XHJcbiAgICAgIHBhcnRQcm9wcyA9IGAke3BhcnRQcm9wc31cXG5cXHQke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIGVuZFNlbGVjdG9yKX06ICR7cHJvcHNbcF19O2A7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYFxcbiR7c2VsZWN0b3IgfHwgJyonfSB7XFxuXFx0JHtwYXJ0UHJvcHMudHJpbSgpfVxcbn1gO1xyXG4gIH0pO1xyXG4gIHJldHVybiB7cGFydHMsIGNzc307XHJcbn1cclxuXHJcbi8vIGd1aWQgZm9yIGVsZW1lbnQgcGFydCBzY29wZXNcclxubGV0IHBhcnRJZCA9IDA7XHJcbmZ1bmN0aW9uIHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCkge1xyXG4gIGlmIChlbGVtZW50W3BhcnRJZEtleV0gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBlbGVtZW50W3BhcnRJZEtleV0gPSBwYXJ0SWQrKztcclxuICB9XHJcbiAgcmV0dXJuIGVsZW1lbnRbcGFydElkS2V5XTtcclxufVxyXG5cclxuY29uc3QgdGhlbWUgPSAnOjp0aGVtZSc7XHJcbmNvbnN0IGNzc1JlID0gL1xccyooLiopKDo6KD86cGFydHx0aGVtZSkpXFwoKFteKV0rKVxcKShbXlxcc3tdKilcXHMqe1xccyooW159XSopXFxzKn0vZ1xyXG5cclxuLy8gY3JlYXRlcyBhIGN1c3RvbSBwcm9wZXJ0eSBuYW1lIGZvciBhIHBhcnQuXHJcbmZ1bmN0aW9uIHZhckZvclBhcnQoaWQsIG5hbWUsIHByb3AsIGVuZFNlbGVjdG9yKSB7XHJcbiAgcmV0dXJuIGAtLWUke2lkfS1wYXJ0LSR7bmFtZX0tJHtwcm9wfSR7ZW5kU2VsZWN0b3IgPyBgLSR7ZW5kU2VsZWN0b3IucmVwbGFjZSgvXFw6L2csICcnKX1gIDogJyd9YDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFByb2R1Y2VzIGEgc3R5bGUgdXNpbmcgY3NzIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIHN0eWxlIDo6cGFydC86OnRoZW1lXHJcbiAqIGZvciBhbGwgdGhlIGRvbSBpbiB0aGUgZWxlbWVudCdzIHNoYWRvd1Jvb3QuXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGFydFRoZW1lKGVsZW1lbnQpIHtcclxuICBpZiAoZWxlbWVudC5zaGFkb3dSb290KSB7XHJcbiAgICBjb25zdCBvbGRTdHlsZSA9IGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdHlsZVtwYXJ0c10nKTtcclxuICAgIGlmIChvbGRTdHlsZSkge1xyXG4gICAgICBvbGRTdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZFN0eWxlKTtcclxuICAgIH1cclxuICB9XHJcbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xyXG4gIGlmIChob3N0KSB7XHJcbiAgICAvLyBub3RlOiBlbnN1cmUgaG9zdCBoYXMgcGFydCBkYXRhIHNvIHRoYXQgZWxlbWVudHMgdGhhdCBib290IHVwXHJcbiAgICAvLyB3aGlsZSB0aGUgaG9zdCBpcyBiZWluZyBjb25uZWN0ZWQgY2FuIHN0eWxlIHBhcnRzLlxyXG4gICAgZW5zdXJlUGFydERhdGEoaG9zdCk7XHJcbiAgICBjb25zdCBjc3MgPSBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpO1xyXG4gICAgaWYgKGNzcykge1xyXG4gICAgICBjb25zdCBuZXdTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICAgIG5ld1N0eWxlLnRleHRDb250ZW50ID0gY3NzO1xyXG4gICAgICBlbGVtZW50LnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQobmV3U3R5bGUpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFByb2R1Y2VzIGNzc1RleHQgYSBzdHlsZSBlbGVtZW50IHRvIGFwcGx5IHBhcnQgY3NzIHRvIGEgZ2l2ZW4gZWxlbWVudC5cclxuICogVGhlIGVsZW1lbnQncyBzaGFkb3dSb290IGRvbSBpcyBzY2FubmVkIGZvciBub2RlcyB3aXRoIGEgYHBhcnRgIGF0dHJpYnV0ZS5cclxuICogVGhlbiBzZWxlY3RvcnMgYXJlIGNyZWF0ZWQgbWF0Y2hpbmcgdGhlIHBhcnQgYXR0cmlidXRlIGNvbnRhaW5pbmcgcHJvcGVydGllc1xyXG4gKiB3aXRoIHBhcnRzIGRlZmluZWQgaW4gdGhlIGVsZW1lbnQncyBob3N0LlxyXG4gKiBUaGUgYW5jZXN0b3IgdHJlZSBpcyB0cmF2ZXJzZWQgZm9yIGZvcndhcmRlZCBwYXJ0cyBhbmQgdGhlbWUuXHJcbiAqIGUuZy5cclxuICogW3BhcnQ9XCJiYXJcIl0ge1xyXG4gKiAgIGNvbG9yOiB2YXIoLS1lMS1wYXJ0LWJhci1jb2xvcik7XHJcbiAqIH1cclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgZm9yIHdoaWNoIHRvIGFwcGx5IHBhcnQgY3NzXHJcbiAqL1xyXG5mdW5jdGlvbiBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpIHtcclxuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcclxuICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgY29uc3QgcGFydE5vZGVzID0gZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1twYXJ0XScpO1xyXG4gIGxldCBjc3MgPSAnJztcclxuICBmb3IgKGxldCBpPTA7IGkgPCBwYXJ0Tm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGF0dHIgPSBwYXJ0Tm9kZXNbaV0uZ2V0QXR0cmlidXRlKCdwYXJ0Jyk7XHJcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoYXR0cik7XHJcbiAgICBjc3MgPSBgJHtjc3N9XFxuXFx0JHtydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpfWBcclxuICB9XHJcbiAgcmV0dXJuIGNzcztcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBjc3MgcnVsZSB0aGF0IGFwcGxpZXMgYSBwYXJ0LlxyXG4gKiBAcGFyYW0geyp9IHBhcnRJbmZvIEFycmF5IG9mIHBhcnQgaW5mbyBmcm9tIHBhcnQgYXR0cmlidXRlXHJcbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0geyp9IGVsZW1lbnQgRWxlbWVudCB3aXRoaW4gd2hpY2ggdGhlIHBhcnQgZXhpc3RzXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRleHQgb2YgdGhlIGNzcyBydWxlIG9mIHRoZSBmb3JtIGBzZWxlY3RvciB7IHByb3BlcnRpZXMgfWBcclxuICovXHJcbmZ1bmN0aW9uIHJ1bGVGb3JQYXJ0SW5mbyhwYXJ0SW5mbywgYXR0ciwgZWxlbWVudCkge1xyXG4gIGxldCB0ZXh0ID0gJyc7XHJcbiAgcGFydEluZm8uZm9yRWFjaChpbmZvID0+IHtcclxuICAgIGlmICghaW5mby5mb3J3YXJkKSB7XHJcbiAgICAgIGNvbnN0IHByb3BzID0gcHJvcHNGb3JQYXJ0KGluZm8ubmFtZSwgZWxlbWVudCk7XHJcbiAgICAgIGlmIChwcm9wcykge1xyXG4gICAgICAgIGZvciAobGV0IGJ1Y2tldCBpbiBwcm9wcykge1xyXG4gICAgICAgICAgbGV0IHByb3BzQnVja2V0ID0gcHJvcHNbYnVja2V0XTtcclxuICAgICAgICAgIGxldCBwYXJ0UHJvcHMgPSBbXTtcclxuICAgICAgICAgIGZvciAobGV0IHAgaW4gcHJvcHNCdWNrZXQpIHtcclxuICAgICAgICAgICAgcGFydFByb3BzLnB1c2goYCR7cH06ICR7cHJvcHNCdWNrZXRbcF19O2ApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGV4dCA9IGAke3RleHR9XFxuW3BhcnQ9XCIke2F0dHJ9XCJdJHtidWNrZXR9IHtcXG5cXHQke3BhcnRQcm9wcy5qb2luKCdcXG5cXHQnKX1cXG59YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gdGV4dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcnNlcyBhIHBhcnQgYXR0cmlidXRlIGludG8gYW4gYXJyYXkgb2YgcGFydCBpbmZvXHJcbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YXJyYXl9IEFycmF5IG9mIHBhcnQgaW5mbyBvYmplY3RzIG9mIHRoZSBmb3JtIHtuYW1lLCBmb3dhcmR9XHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJ0SW5mb0Zyb21BdHRyKGF0dHIpIHtcclxuICBjb25zdCBwaWVjZXMgPSBhdHRyID8gYXR0ci5zcGxpdCgvXFxzKixcXHMqLykgOiBbXTtcclxuICBsZXQgcGFydHMgPSBbXTtcclxuICBwaWVjZXMuZm9yRWFjaChwID0+IHtcclxuICAgIGNvbnN0IG0gPSBwID8gcC5tYXRjaCgvKFtePVxcc10qKSg/Olxccyo9PlxccyooLiopKT8vKSA6IFtdO1xyXG4gICAgaWYgKG0pIHtcclxuICAgICAgcGFydHMucHVzaCh7bmFtZTogbVsyXSB8fCBtWzFdLCBmb3J3YXJkOiBtWzJdID8gbVsxXSA6IG51bGx9KTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gcGFydHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGb3IgYSBnaXZlbiBwYXJ0IG5hbWUgcmV0dXJucyBhIHByb3BlcnRpZXMgb2JqZWN0IHdoaWNoIHNldHMgYW55IGFuY2VzdG9yXHJcbiAqIHByb3ZpZGVkIHBhcnQgcHJvcGVydGllcyB0byB0aGUgcHJvcGVyIGFuY2VzdG9yIHByb3ZpZGVkIGNzcyB2YXJpYWJsZSBuYW1lLlxyXG4gKiBlLmcuXHJcbiAqIGNvbG9yOiBgdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO2BcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGhpbiB3aGljaCBkb20gd2l0aCBwYXJ0IGV4aXN0c1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIG9ubHkgOjp0aGVtZSBzaG91bGQgYmUgY29sbGVjdGVkLlxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgb2YgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHBhcnQgc2V0IHRvIHBhcnQgdmFyaWFibGVzXHJcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50cyBhbmNlc3RvcnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm9wc0ZvclBhcnQobmFtZSwgZWxlbWVudCwgcmVxdWlyZVRoZW1lKSB7XHJcbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQgJiYgZWxlbWVudC5nZXRSb290Tm9kZSgpLmhvc3Q7XHJcbiAgaWYgKCFob3N0KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGNvbGxlY3QgcHJvcHMgZnJvbSBob3N0IGVsZW1lbnQuXHJcbiAgbGV0IHByb3BzID0gcHJvcHNGcm9tRWxlbWVudChuYW1lLCBob3N0LCByZXF1aXJlVGhlbWUpO1xyXG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kIG1hdGNoaW5nIGB0aGVtZWAgcHJvcGVydGllc1xyXG4gIGNvbnN0IHRoZW1lUHJvcHMgPSBwcm9wc0ZvclBhcnQobmFtZSwgaG9zdCwgdHJ1ZSk7XHJcbiAgcHJvcHMgPSBtaXhQYXJ0UHJvcHMocHJvcHMsIHRoZW1lUHJvcHMpO1xyXG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kICpmb3J3YXJkZWQqIHBhcnQgcHJvcGVydGllc1xyXG4gIGlmICghcmVxdWlyZVRoZW1lKSB7XHJcbiAgICAvLyBmb3J3YXJkaW5nOiByZWN1cnNlcyB1cCBhbmNlc3RvciB0cmVlIVxyXG4gICAgY29uc3QgcGFydEluZm8gPSBwYXJ0SW5mb0Zyb21BdHRyKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdwYXJ0JykpO1xyXG4gICAgLy8ge25hbWUsIGZvcndhcmR9IHdoZXJlIGAqYCBjYW4gYmUgaW5jbHVkZWRcclxuICAgIHBhcnRJbmZvLmZvckVhY2goaW5mbyA9PiB7XHJcbiAgICAgIGxldCBjYXRjaEFsbCA9IGluZm8uZm9yd2FyZCAmJiAoaW5mby5mb3J3YXJkLmluZGV4T2YoJyonKSA+PSAwKTtcclxuICAgICAgaWYgKG5hbWUgPT0gaW5mby5mb3J3YXJkIHx8IGNhdGNoQWxsKSB7XHJcbiAgICAgICAgY29uc3QgYW5jZXN0b3JOYW1lID0gY2F0Y2hBbGwgPyBpbmZvLm5hbWUucmVwbGFjZSgnKicsIG5hbWUpIDogaW5mby5uYW1lO1xyXG4gICAgICAgIGNvbnN0IGZvcndhcmRlZCA9IHByb3BzRm9yUGFydChhbmNlc3Rvck5hbWUsIGhvc3QpO1xyXG4gICAgICAgIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCBmb3J3YXJkZWQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwcm9wcztcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbGxlY3RzIGNzcyBmb3IgdGhlIGdpdmVuIG5hbWUgZnJvbSB0aGUgcGFydCBkYXRhIGZvciB0aGUgZ2l2ZW5cclxuICogZWxlbWVudC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGggcGFydCBjc3MvZGF0YS5cclxuICogQHBhcmFtIHtCb29sZWFufSByZXF1aXJlVGhlbWUgVHJ1ZSBpZiBzaG91bGQgb25seSBtYXRjaCA6OnRoZW1lXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiBwcm9wZXJ0aWVzIGZvciB0aGUgZ2l2ZW4gcGFydCBzZXQgdG8gcGFydCB2YXJpYWJsZXNcclxuICogcHJvdmlkZWQgYnkgdGhlIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm9wc0Zyb21FbGVtZW50KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xyXG4gIGxldCBwcm9wcztcclxuICBjb25zdCBwYXJ0cyA9IHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KTtcclxuICBpZiAocGFydHMpIHtcclxuICAgIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcclxuICAgIGlmIChwYXJ0cykge1xyXG4gICAgICBwYXJ0cy5mb3JFYWNoKChwYXJ0KSA9PiB7XHJcbiAgICAgICAgaWYgKHBhcnQubmFtZSA9PSBuYW1lICYmICghcmVxdWlyZVRoZW1lIHx8IHBhcnQuaXNUaGVtZSkpIHtcclxuICAgICAgICAgIHByb3BzID0gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHByb3BzO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIHBhcnQgY3NzIHRvIHRoZSBwcm9wcyBvYmplY3QgZm9yIHRoZSBnaXZlbiBwYXJ0L25hbWUuXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBPYmplY3QgY29udGFpbmluZyBwYXJ0IGNzc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gcGFydCBQYXJ0IGRhdGFcclxuICogQHBhcmFtIHtubWJlcn0gaWQgZWxlbWVudCBwYXJ0IGlkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgcGFydFxyXG4gKi9cclxuZnVuY3Rpb24gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSkge1xyXG4gIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgY29uc3QgYnVja2V0ID0gcGFydC5lbmRTZWxlY3RvciB8fCAnJztcclxuICBjb25zdCBiID0gcHJvcHNbYnVja2V0XSA9IHByb3BzW2J1Y2tldF0gfHwge307XHJcbiAgZm9yIChsZXQgcCBpbiBwYXJ0LnByb3BzKSB7XHJcbiAgICBiW3BdID0gYHZhcigke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIHBhcnQuZW5kU2VsZWN0b3IpfSlgO1xyXG4gIH1cclxuICByZXR1cm4gcHJvcHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1peFBhcnRQcm9wcyhhLCBiKSB7XHJcbiAgaWYgKGEgJiYgYikge1xyXG4gICAgZm9yIChsZXQgaSBpbiBiKSB7XHJcbiAgICAgIC8vIGVuc3VyZSBzdG9yYWdlIGV4aXN0c1xyXG4gICAgICBpZiAoIWFbaV0pIHtcclxuICAgICAgICBhW2ldID0ge307XHJcbiAgICAgIH1cclxuICAgICAgT2JqZWN0LmFzc2lnbihhW2ldLCBiW2ldKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGEgfHwgYjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEN1c3RvbUVsZW1lbnQgbWl4aW4gdGhhdCBjYW4gYmUgYXBwbGllZCB0byBwcm92aWRlIDo6cGFydC86OnRoZW1lIHN1cHBvcnQuXHJcbiAqIEBwYXJhbSB7Kn0gc3VwZXJDbGFzc1xyXG4gKi9cclxuZXhwb3J0IGxldCBQYXJ0VGhlbWVNaXhpbiA9IHN1cGVyQ2xhc3MgPT4ge1xyXG5cclxuICByZXR1cm4gY2xhc3MgUGFydFRoZW1lQ2xhc3MgZXh0ZW5kcyBzdXBlckNsYXNzIHtcclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgaWYgKHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKSB7XHJcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgICAgfVxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5fYXBwbHlQYXJ0VGhlbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2FwcGx5UGFydFRoZW1lKCkge1xyXG4gICAgICBhcHBseVBhcnRUaGVtZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gaW1wb3J0IHsgTWFza0hpZ2hsaWdodGVyIH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL21hc2staGlnaGxpZ2h0ZXIvbWFzay1oaWdobGlnaHRlci5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBIaWdobGlnaHRFdmVudHNcclxufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50LmpzJztcclxuaW1wb3J0IHtcclxuICAgIERlbW9zXHJcbn0gZnJvbSAnLi9kZW1vcy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBYSG9zdCxcclxuICAgIFhSYXRpbmcsXHJcbiAgICBYVGh1bWJzXHJcbn0gZnJvbSAnLi9wYXJ0VGhlbWUvY29tcG9uZW50cy1zYW1wbGUuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgQ29udHJvbFByZXpcclxufSBmcm9tICcuL2NvbnRyb2xQcmV6LmpzJztcclxuaW1wb3J0IHtcclxuICAgIFR5cGVUZXh0XHJcbn0gZnJvbSAnLi90eXBlZFRleHQuanMnXHJcbmltcG9ydCB7Tm9pc2V9IGZyb20gJy4vaG91ZGluaS9ub2lzZS5qcyc7XHJcblxyXG5cclxuXHJcbihhc3luYyBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG5cclxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XHJcblxyXG5cclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLWNhZHJlLWNvcm5lci0xJyxcclxuICAgICAgICAgICAgc3ludGF4OiAnPGltYWdlPiB8IG5vbmUnLFxyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICdub25lJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLWNhZHJlLWNvcm5lci0yJyxcclxuICAgICAgICAgICAgc3ludGF4OiAnPGltYWdlPiB8IG5vbmUnLFxyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICdub25lJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLWNhZHJlLWNvcm5lci0zJyxcclxuICAgICAgICAgICAgc3ludGF4OiAnPGltYWdlPiB8IG5vbmUnLFxyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICdub25lJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLWNhZHJlLWNvcm5lci00JyxcclxuICAgICAgICAgICAgc3ludGF4OiAnPGltYWdlPiB8IG5vbmUnLFxyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICdub25lJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLWNhZHJlLWNvbG9yJyxcclxuICAgICAgICAgICAgc3ludGF4OiAnPGNvbG9yPiB8IG5vbmUnLFxyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICd3aGl0ZScsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NhZHJlLXdvcmtsZXQuanMnKTtcclxuICAgICAgICBuZXcgTm9pc2UoKTtcclxuICAgICAgICAvLyBuZXcgVHlwZVRleHQoKTtcclxuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XHJcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xyXG4gICAgICAgICAgICAvLyBuZXcgSGlnaGxpZ2h0RXZlbnRzKCk7XHJcbiAgICAgICAgICAgIC8vIG5ldyBDb250cm9sUHJleigpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRlLWhvdWRpbmktd29ya2Zsb3cnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxCYWNrRnJhZ21lbnQoKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC12aWRlby1tYWdpYycsICgpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hZ2ljVmlkZW8nKS5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL21hZ2ljLmdpZic7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC12aWRlby1zZW5zb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5zb3JWaWRlbycpLnNyYyA9ICcuL2Fzc2V0cy9pbWFnZXMvZ2VuZXJpYy1zZW5zb3ItYXBpLmdpZic7XHJcbiAgICAgICAgfSk7Ki9cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZVRleHQge1xyXG5cclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Nzcy12YXItdHlwZScsICgpPT57XHJcblx0XHRcdHR5cGluZygndGl0bGUtY3NzLXZhcicsIDEwLCAwKVxyXG5cdFx0XHQudHlwZSgnQ1NTIFZhcmlhYmxlcycpLndhaXQoMjAwMCkuc3BlZWQoNTApXHJcblx0XHRcdC5kZWxldGUoJ1ZhcmlhYmxlcycpLndhaXQoNTAwKS5zcGVlZCgxMDApXHJcblx0XHRcdC50eXBlKCdDdXN0b20gUHJvcGVydGllcycpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59Il19