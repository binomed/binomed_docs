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

            new _noise.Noise();
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
        this.frame;
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

            this.canvas.width = wWidth;
            this.canvas.height = wHeight;

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
            this.ctx = canvas.getContext('2d');

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

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

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

},{"./controlPrez.js":1,"./demos.js":2,"./highlightEvent.js":6,"./partTheme/components-sample.js":9,"./typedText.js":12}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NvbnRyb2xQcmV6LmpzIiwic2NyaXB0cy9kZW1vcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlKcy5qcyIsInNjcmlwdHMvaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzL2hpZ2hsaWdodEV2ZW50LmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9saWJzL3RoaW5neS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzIiwic2NyaXB0cy9wYXJ0VGhlbWUvbGlicy9wYXJ0LXRoZW1lLmpzIiwic2NyaXB0cy9wcmV6LmpzIiwic2NyaXB0cy90eXBlZFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7Ozs7SUFJYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7O0FBQ1YsYUFBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUVBLGVBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXhDO0FBQ0g7Ozs7OENBRXFCO0FBQ2xCLGdCQUFJO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3RCO0FBQ0g7QUFDRCxvQkFBTSxTQUFTLG1CQUFXO0FBQ3RCLGdDQUFZO0FBRFUsaUJBQVgsQ0FBZjtBQUdBLHNCQUFNLE9BQU8sT0FBUCxFQUFOO0FBQ0EscUJBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLG9CQUFNLFVBQVUsTUFBTSxPQUFPLGVBQVAsRUFBdEI7QUFDQSxvQkFBTSxhQUFhLE1BQU0sYUFBYSxpQkFBYixFQUF6QjtBQUNBLG9CQUFJLGVBQWUsUUFBbkIsRUFBNkI7QUFDekIsNEJBQVEsR0FBUix5Q0FBa0QsUUFBUSxLQUExRDtBQUNI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IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge1xyXG4gICAgVGhpbmd5XHJcbn0gZnJvbSAnLi9saWJzL3RoaW5neS5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJvbFByZXoge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy50aGluZ3lDb25uZWN0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHRoaXMudGhpbmd5Q29udHJvbC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB0aGluZ3lDb250cm9sKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRoaW5neUNvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHRoaW5neSA9IG5ldyBUaGluZ3koe1xyXG4gICAgICAgICAgICAgICAgbG9nRW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpbmd5LmNvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy50aGluZ3lDb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBiYXR0ZXJ5ID0gYXdhaXQgdGhpbmd5LmdldEJhdHRlcnlMZXZlbCgpO1xyXG4gICAgICAgICAgICBjb25zdCBwZXJtaXNzaW9uID0gYXdhaXQgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XHJcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9uID09PSBcImRlbmllZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9YCwgYmF0dGVyeSk7XHJcbiAgICAgICAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKFwiVGhpbmd5IENvbm5lY3QgISBcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGAgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9JWBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpbmd5LmJ1dHRvbkVuYWJsZSgoc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YXAnLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdGUpO1xyXG5cclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQge1xyXG4gICAgQXBwbHlDc3NcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUNzcy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBBcHBseUNvZGVNaXJvclxyXG59IGZyb20gJy4vaGVscGVyL2FwcGx5SnMuanMnO1xyXG5pbXBvcnQge05vaXNlfSBmcm9tICcuL2hvdWRpbmkvbm9pc2UuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlbW9zIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vUGFpbnRBcGkoKSB7XHJcbiAgICAgICAgLy8oQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLXdvcmtsZXQuanMnKTtcclxuICAgICAgICAvLyhDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9ub2lzZS13b3JrbGV0LmpzJyk7XHJcblxyXG4gICAgICAgIG5ldyBOb2lzZSgpO1xyXG4gICAgICAgIC8vcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2ZyYW1lSW5jcmVtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF9mcmFtZUluY3JlbWVudCgpe1xyXG4gICAgICAgIGlmICh0aGlzLmZyYW1lID09PSA5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaXNlJykuc3R5bGUuc2V0UHJvcGVydHkoJy0tZnJhbWUnLCB0aGlzLmZyYW1lKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZnJhbWVJbmNyZW1lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG59IiwiJ3VzZSBzdGljdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvZGVNaXJyb3JDc3MgPSBDb2RlTWlycm9yKGVsdCwge1xyXG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXHJcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcclxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXHJcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcclxuICAgICAgICAgICAgdGhlbWU6ICdibGFja2JvYXJkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyhjb2RlTWlycm9yQ3NzLmdldFZhbHVlKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdGljdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBseUNvZGVNaXJvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9ySlMgPSBDb2RlTWlycm9yKGVsdCwge1xyXG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXHJcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcclxuICAgICAgICAgICAgdGhlbWU6ICdibGFja2JvYXJkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9ySlMuc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XHJcbiAgICB9XHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcclxuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNWVtJztcclxuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7XHJcbiAgICAgICAga2V5RWx0LFxyXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcclxuICAgIH0pIHtcclxuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xyXG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xyXG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcclxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcclxuICAgICAgICB9KTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uIGluIEpTXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUtaW4tanMnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjYwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzM1MHB4JyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzMwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gOjpQYXJ0XHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwYXJ0JyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFRlbXBsYXRlIEluc3RhbnRpYXRpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RlbXBsYXRlLWluc3RhbnRpYXRpb24nLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gSFRNTCBNb2R1bGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2h0bWwtbW9kdWxlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxMCxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBQYWludCBBUElcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BhaW50LWFwaScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIGdlbmVyaWMgc2Vuc29yXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdnZW5lcmljLXNlbnNvcicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBY2NlbGVyb21ldGVyIHNlbnNvclxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnYWNjZWxlcm9tZXRlci1zZW5zb3InLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDYsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBOb2lzZSB7XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMuY2FudmFzO1xyXG5cdFx0dGhpcy5jdHg7XHJcblx0XHR0aGlzLndXaWR0aDtcclxuXHRcdHRoaXMud0hlaWdodDtcclxuXHRcdHRoaXMuZnJhbWU7XHJcblx0XHR0aGlzLmxvb3BUaW1lb3V0O1xyXG5cclxuXHRcdHRoaXMuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0Ly8gQ3JlYXRlIE5vaXNlXHJcbiAgICBjcmVhdGVOb2lzZSgpIHtcclxuICAgICAgICBjb25zdCBpZGF0YSA9IHRoaXMuY3R4LmNyZWF0ZUltYWdlRGF0YSh0aGlzLndXaWR0aCwgdGhpcy53SGVpZ2h0KTtcclxuICAgICAgICBjb25zdCBidWZmZXIzMiA9IG5ldyBVaW50MzJBcnJheShpZGF0YS5kYXRhLmJ1ZmZlcik7XHJcbiAgICAgICAgY29uc3QgbGVuID0gYnVmZmVyMzIubGVuZ3RoO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIzMltpXSA9IDB4ZmYwMDAwMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm9pc2VEYXRhLnB1c2goaWRhdGEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gUGxheSBOb2lzZVxyXG4gICAgcGFpbnROb2lzZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5mcmFtZSA9PT0gOSkge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGhpcy5ub2lzZURhdGFbdGhpcy5mcmFtZV0sIDAsIDApO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gTG9vcFxyXG4gICAgbG9vcCgpIHtcclxuICAgICAgICB0aGlzLnBhaW50Tm9pc2UodGhpcy5mcmFtZSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9vcFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH0sICgxMDAwIC8gMjUpKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIFNldHVwXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICB0aGlzLndXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIHRoaXMud0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3V2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd0hlaWdodDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTm9pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gSW5pdFxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXAoKTtcclxuICAgIH07XHJcbn1cclxuIiwiLyoqICovXHJcbmV4cG9ydCBjbGFzcyBUaGluZ3kge1xyXG4gIC8qKlxyXG4gICAgICogIFRoaW5neTo1MiBXZWIgQmx1ZXRvb3RoIEFQSS4gPGJyPlxyXG4gICAgICogIEJMRSBzZXJ2aWNlIGRldGFpbHMge0BsaW5rIGh0dHBzOi8vbm9yZGljc2VtaWNvbmR1Y3Rvci5naXRodWIuaW8vTm9yZGljLVRoaW5neTUyLUZXL2RvY3VtZW50YXRpb24vZmlybXdhcmVfYXJjaGl0ZWN0dXJlLmh0bWwjZndfYXJjaF9ibGVfc2VydmljZXMgaGVyZX1cclxuICAgICAqXHJcbiAgICAgKlxyXG4gICAgICogIEBjb25zdHJ1Y3RvclxyXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHtsb2dFbmFibGVkOiBmYWxzZX1dIC0gT3B0aW9ucyBvYmplY3QgZm9yIFRoaW5neVxyXG4gICAgICogIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5sb2dFbmFibGVkIC0gRW5hYmxlcyBsb2dnaW5nIG9mIGFsbCBCTEUgYWN0aW9ucy5cclxuICAgICAqXHJcbiAgICAqL1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7bG9nRW5hYmxlZDogZmFsc2V9KSB7XHJcbiAgICB0aGlzLmxvZ0VuYWJsZWQgPSBvcHRpb25zLmxvZ0VuYWJsZWQ7XHJcblxyXG4gICAgLy8gVENTID0gVGhpbmd5IENvbmZpZ3VyYXRpb24gU2VydmljZVxyXG4gICAgdGhpcy5UQ1NfVVVJRCA9IFwiZWY2ODAxMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19OQU1FX1VVSUQgPSBcImVmNjgwMTAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfQURWX1BBUkFNU19VVUlEID0gXCJlZjY4MDEwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX0NPTk5fUEFSQU1TX1VVSUQgPSBcImVmNjgwMTA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfRUREWVNUT05FX1VVSUQgPSBcImVmNjgwMTA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfQ0xPVURfVE9LRU5fVVVJRCA9IFwiZWY2ODAxMDYtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19GV19WRVJfVVVJRCA9IFwiZWY2ODAxMDctOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19NVFVfUkVRVUVTVF9VVUlEID0gXCJlZjY4MDEwOC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuXHJcbiAgICAvLyBURVMgPSBUaGluZ3kgRW52aXJvbm1lbnQgU2VydmljZVxyXG4gICAgdGhpcy5URVNfVVVJRCA9IFwiZWY2ODAyMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19URU1QX1VVSUQgPSBcImVmNjgwMjAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfUFJFU1NVUkVfVVVJRCA9IFwiZWY2ODAyMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19IVU1JRElUWV9VVUlEID0gXCJlZjY4MDIwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX0dBU19VVUlEID0gXCJlZjY4MDIwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX0NPTE9SX1VVSUQgPSBcImVmNjgwMjA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfQ09ORklHX1VVSUQgPSBcImVmNjgwMjA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIC8vIFRVSVMgPSBUaGluZ3kgVXNlciBJbnRlcmZhY2UgU2VydmljZVxyXG4gICAgdGhpcy5UVUlTX1VVSUQgPSBcImVmNjgwMzAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UVUlTX0xFRF9VVUlEID0gXCJlZjY4MDMwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFVJU19CVE5fVVVJRCA9IFwiZWY2ODAzMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRVSVNfUElOX1VVSUQgPSBcImVmNjgwMzAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIC8vIFRNUyA9IFRoaW5neSBNb3Rpb24gU2VydmljZVxyXG4gICAgdGhpcy5UTVNfVVVJRCA9IFwiZWY2ODA0MDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19DT05GSUdfVVVJRCA9IFwiZWY2ODA0MDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19UQVBfVVVJRCA9IFwiZWY2ODA0MDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19PUklFTlRBVElPTl9VVUlEID0gXCJlZjY4MDQwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX1FVQVRFUk5JT05fVVVJRCA9IFwiZWY2ODA0MDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19TVEVQX1VVSUQgPSBcImVmNjgwNDA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfUkFXX1VVSUQgPSBcImVmNjgwNDA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfRVVMRVJfVVVJRCA9IFwiZWY2ODA0MDctOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19ST1RfTUFUUklYX1VVSUQgPSBcImVmNjgwNDA4LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfSEVBRElOR19VVUlEID0gXCJlZjY4MDQwOS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX0dSQVZJVFlfVVVJRCA9IFwiZWY2ODA0MGEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcblxyXG4gICAgLy8gVFNTID0gVGhpbmd5IFNvdW5kIFNlcnZpY2VcclxuICAgIHRoaXMuVFNTX1VVSUQgPSBcImVmNjgwNTAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfQ09ORklHX1VVSUQgPSBcImVmNjgwNTAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfU1BFQUtFUl9EQVRBX1VVSUQgPSBcImVmNjgwNTAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfU1BFQUtFUl9TVEFUX1VVSUQgPSBcImVmNjgwNTAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UU1NfTUlDX1VVSUQgPSBcImVmNjgwNTA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIHRoaXMuc2VydmljZVVVSURzID0gW1xyXG4gICAgICBcImJhdHRlcnlfc2VydmljZVwiLFxyXG4gICAgICB0aGlzLlRDU19VVUlELFxyXG4gICAgICB0aGlzLlRFU19VVUlELFxyXG4gICAgICB0aGlzLlRVSVNfVVVJRCxcclxuICAgICAgdGhpcy5UTVNfVVVJRCxcclxuICAgICAgdGhpcy5UU1NfVVVJRCxcclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5ibGVJc0J1c3kgPSBmYWxzZTtcclxuICAgIHRoaXMuZGV2aWNlO1xyXG4gICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy50YXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuc3BlYWtlclN0YXR1c0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMubWljcm9waG9uZUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAgICogIE1ldGhvZCB0byByZWFkIGRhdGEgZnJvbSBhIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMuXHJcbiAgICAgKiAgSW1wbGVtZW50cyBhIHNpbXBsZSBzb2x1dGlvbiB0byBhdm9pZCBzdGFydGluZyBuZXcgR0FUVCByZXF1ZXN0cyB3aGlsZSBhbm90aGVyIGlzIHBlbmRpbmcuXHJcbiAgICAgKiAgQW55IGF0dGVtcHQgdG8gcmVhZCB3aGlsZSBhbm90aGVyIEdBVFQgb3BlcmF0aW9uIGlzIGluIHByb2dyZXNzLCB3aWxsIHJlc3VsdCBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICAgKlxyXG4gICAgICogIEBhc3luY1xyXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBjaGFyYWN0ZXJpc3RpYyAtIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMgb2JqZWN0XHJcbiAgICAgKiAgQHJldHVybiB7UHJvbWlzZTxEYXRhVmlldz59IFJldHVybnMgVWludDhBcnJheSB3aGVuIHJlc29sdmVkIG9yIGFuIGVycm9yIHdoZW4gcmVqZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiAgQHByaXZhdGVcclxuXHJcbiAgICAqL1xyXG4gIGFzeW5jIF9yZWFkRGF0YShjaGFyYWN0ZXJpc3RpYykge1xyXG4gICAgaWYgKCF0aGlzLmJsZUlzQnVzeSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBkYXRhQXJyYXkgPSBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcclxuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YUFycmF5O1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkdBVFQgb3BlcmF0aW9uIGFscmVhZHkgcGVuZGluZ1wiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgTWV0aG9kIHRvIHdyaXRlIGRhdGEgdG8gYSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljLlxyXG4gICAqICBJbXBsZW1lbnRzIGEgc2ltcGxlIHNvbHV0aW9uIHRvIGF2b2lkIHN0YXJ0aW5nIG5ldyBHQVRUIHJlcXVlc3RzIHdoaWxlIGFub3RoZXIgaXMgcGVuZGluZy5cclxuICAgKiAgQW55IGF0dGVtcHQgdG8gc2VuZCBkYXRhIGR1cmluZyBhbm90aGVyIEdBVFQgb3BlcmF0aW9uIHdpbGwgcmVzdWx0IGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cclxuICAgKiAgTm8gcmV0cmFuc21pc3Npb24gaXMgaW1wbGVtZW50ZWQgYXQgdGhpcyBsZXZlbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IGNoYXJhY3RlcmlzdGljIC0gV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYyBvYmplY3RcclxuICAgKiAgQHBhcmFtIHtVaW50OEFycmF5fSBkYXRhQXJyYXkgLSBUeXBlZCBhcnJheSBvZiBieXRlcyB0byBzZW5kXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2V9XHJcbiAgICpcclxuICAgKiAgQHByaXZhdGVcclxuICAgKlxyXG4gICovXHJcbiAgYXN5bmMgX3dyaXRlRGF0YShjaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KSB7XHJcbiAgICBpZiAoIXRoaXMuYmxlSXNCdXN5KSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSB0cnVlO1xyXG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoZGF0YUFycmF5KTtcclxuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiR0FUVCBvcGVyYXRpb24gYWxyZWFkeSBwZW5kaW5nXCIpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBDb25uZWN0cyB0byBUaGluZ3kuXHJcbiAgICogIFRoZSBmdW5jdGlvbiBzdG9yZXMgYWxsIGRpc2NvdmVyZWQgc2VydmljZXMgYW5kIGNoYXJhY3RlcmlzdGljcyB0byB0aGUgVGhpbmd5IG9iamVjdC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYW4gZW1wdHkgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgY29ubmVjdCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFNjYW4gZm9yIFRoaW5neXNcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBTY2FubmluZyBmb3IgZGV2aWNlcyB3aXRoIHNlcnZpY2UgVVVJRCBlcXVhbCB0byAke3RoaXMuVENTX1VVSUR9YCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGV2aWNlID0gYXdhaXQgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHtcclxuICAgICAgICBmaWx0ZXJzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlcnZpY2VzOiBbdGhpcy5UQ1NfVVVJRF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgb3B0aW9uYWxTZXJ2aWNlczogdGhpcy5zZXJ2aWNlVVVJRHMsXHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEZvdW5kIFRoaW5neSBuYW1lZCBcIiR7dGhpcy5kZXZpY2UubmFtZX1cIiwgdHJ5aW5nIHRvIGNvbm5lY3RgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ29ubmVjdCB0byBHQVRUIHNlcnZlclxyXG4gICAgICBjb25zdCBzZXJ2ZXIgPSBhd2FpdCB0aGlzLmRldmljZS5nYXR0LmNvbm5lY3QoKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBDb25uZWN0ZWQgdG8gXCIke3RoaXMuZGV2aWNlLm5hbWV9XCJgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQmF0dGVyeSBzZXJ2aWNlXHJcbiAgICAgIGNvbnN0IGJhdHRlcnlTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKFwiYmF0dGVyeV9zZXJ2aWNlXCIpO1xyXG4gICAgICB0aGlzLmJhdHRlcnlDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IGJhdHRlcnlTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKFwiYmF0dGVyeV9sZXZlbFwiKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBiYXR0ZXJ5IHNlcnZpY2UgYW5kIGJhdHRlcnkgbGV2ZWwgY2hhcmFjdGVyaXN0aWNcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBjb25maWd1cmF0aW9uIHNlcnZpY2VcclxuICAgICAgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRDU19VVUlEKTtcclxuICAgICAgdGhpcy5uYW1lQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX05BTUVfVVVJRCk7XHJcbiAgICAgIHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0FEVl9QQVJBTVNfVVVJRCk7XHJcbiAgICAgIHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19DTE9VRF9UT0tFTl9VVUlEKTtcclxuICAgICAgdGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0NPTk5fUEFSQU1TX1VVSUQpO1xyXG4gICAgICB0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19FRERZU1RPTkVfVVVJRCk7XHJcbiAgICAgIHRoaXMuZmlybXdhcmVWZXJzaW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0ZXX1ZFUl9VVUlEKTtcclxuICAgICAgdGhpcy5tdHVSZXF1ZXN0Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX01UVV9SRVFVRVNUX1VVSUQpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBjb25maWd1cmF0aW9uIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBlbnZpcm9ubWVudCBzZXJ2aWNlXHJcbiAgICAgIHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVEVTX1VVSUQpO1xyXG4gICAgICB0aGlzLnRlbXBlcmF0dXJlQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19URU1QX1VVSUQpO1xyXG4gICAgICB0aGlzLmNvbG9yQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19DT0xPUl9VVUlEKTtcclxuICAgICAgdGhpcy5nYXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0dBU19VVUlEKTtcclxuICAgICAgdGhpcy5odW1pZGl0eUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfSFVNSURJVFlfVVVJRCk7XHJcbiAgICAgIHRoaXMucHJlc3N1cmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX1BSRVNTVVJFX1VVSUQpO1xyXG4gICAgICB0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19DT05GSUdfVVVJRCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IGVudmlyb25tZW50IHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSB1c2VyIGludGVyZmFjZSBzZXJ2aWNlXHJcbiAgICAgIHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UVUlTX1VVSUQpO1xyXG4gICAgICB0aGlzLmJ1dHRvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfQlROX1VVSUQpO1xyXG4gICAgICB0aGlzLmxlZENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfTEVEX1VVSUQpO1xyXG4gICAgICB0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFVJU19QSU5fVVVJRCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IHVzZXIgaW50ZXJmYWNlIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBtb3Rpb24gc2VydmljZVxyXG4gICAgICB0aGlzLm1vdGlvblNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UTVNfVVVJRCk7XHJcbiAgICAgIHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfQ09ORklHX1VVSUQpO1xyXG4gICAgICB0aGlzLmV1bGVyQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfRVVMRVJfVVVJRCk7XHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0dSQVZJVFlfVVVJRCk7XHJcbiAgICAgIHRoaXMuaGVhZGluZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0hFQURJTkdfVVVJRCk7XHJcbiAgICAgIHRoaXMub3JpZW50YXRpb25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19PUklFTlRBVElPTl9VVUlEKTtcclxuICAgICAgdGhpcy5xdWF0ZXJuaW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfUVVBVEVSTklPTl9VVUlEKTtcclxuICAgICAgdGhpcy5tb3Rpb25SYXdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19SQVdfVVVJRCk7XHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19ST1RfTUFUUklYX1VVSUQpO1xyXG4gICAgICB0aGlzLnN0ZXBDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19TVEVQX1VVSUQpO1xyXG4gICAgICB0aGlzLnRhcENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1RBUF9VVUlEKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgbW90aW9uIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoaW5neSBzb3VuZCBzZXJ2aWNlXHJcbiAgICAgIHRoaXMuc291bmRTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVFNTX1VVSUQpO1xyXG4gICAgICB0aGlzLnRzc0NvbmZpZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfQ09ORklHX1VVSUQpO1xyXG4gICAgICB0aGlzLm1pY3JvcGhvbmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX01JQ19VVUlEKTtcclxuICAgICAgdGhpcy5zcGVha2VyRGF0YUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfU1BFQUtFUl9EQVRBX1VVSUQpO1xyXG4gICAgICB0aGlzLnNwZWFrZXJTdGF0dXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX1NQRUFLRVJfU1RBVF9VVUlEKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgc291bmQgc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIE1ldGhvZCB0byBkaXNjb25uZWN0IGZyb20gVGhpbmd5LlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhbiBlbXB0eSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqL1xyXG4gIGFzeW5jIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCB0aGlzLmRldmljZS5nYXR0LmRpc2Nvbm5lY3QoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE1ldGhvZCB0byBlbmFibGUgYW5kIGRpc2FibGUgbm90aWZpY2F0aW9ucyBmb3IgYSBjaGFyYWN0ZXJpc3RpY1xyXG4gIGFzeW5jIF9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCBub3RpZnlIYW5kbGVyKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMuc3RhcnROb3RpZmljYXRpb25zKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJOb3RpZmljYXRpb25zIGVuYWJsZWQgZm9yIFwiICsgY2hhcmFjdGVyaXN0aWMudXVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYXJhY3RlcmlzdGljLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZFwiLCBub3RpZnlIYW5kbGVyKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMuc3RvcE5vdGlmaWNhdGlvbnMoKTtcclxuICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdGlmaWNhdGlvbnMgZGlzYWJsZWQgZm9yIFwiLCBjaGFyYWN0ZXJpc3RpYy51dWlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkXCIsIG5vdGlmeUhhbmRsZXIpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogIENvbmZpZ3VyYXRpb24gc2VydmljZSAgKi9cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgbmFtZSBvZiB0aGUgVGhpbmd5IGRldmljZS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIG5hbWUgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXROYW1lKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubmFtZUNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xyXG4gICAgICBjb25zdCBuYW1lID0gZGVjb2Rlci5kZWNvZGUoZGF0YSk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGRldmljZSBuYW1lOiBcIiArIG5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIG5hbWUgb2YgdGhlIFRoaW5neSBkZXZpY2UuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgdGhhdCB3aWxsIGJlIGdpdmVuIHRvIHRoZSBUaGluZ3kuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldE5hbWUobmFtZSkge1xyXG4gICAgaWYgKG5hbWUubGVuZ3RoID4gMTApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgbmFtZSBjYW4ndCBiZSBtb3JlIHRoYW4gMTAgY2hhcmFjdGVycyBsb25nLlwiKSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShuYW1lLmxlbmd0aCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgYnl0ZUFycmF5W2ldID0gbmFtZS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLm5hbWVDaGFyYWN0ZXJpc3RpYywgYnl0ZUFycmF5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGFkdmVydGlzaW5nIHBhcmFtZXRlcnNcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBhZHZlcnRpc2luZyBwYXJhbWV0ZXJzIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEFkdlBhcmFtcygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xyXG5cclxuICAgICAgLy8gSW50ZXJ2YWwgaXMgZ2l2ZW4gaW4gdW5pdHMgb2YgMC42MjUgbWlsbGlzZWNvbmRzXHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IGludGVydmFsID0gKHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKSAqIDAuNjI1KS50b0ZpeGVkKDApO1xyXG4gICAgICBjb25zdCB0aW1lb3V0ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDIpO1xyXG4gICAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgaW50ZXJ2YWw6IHtcclxuICAgICAgICAgIGludGVydmFsOiBpbnRlcnZhbCxcclxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpbWVvdXQ6IHtcclxuICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXHJcbiAgICAgICAgICB1bml0OiBcInNcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGFkdmVydGlzaW5nIHBhcmFtZXRlcnNcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIE9iamVjdCB3aXRoIGtleS92YWx1ZSBwYWlycyAnaW50ZXJ2YWwnIGFuZCAndGltZW91dCc6IDxjb2RlPntpbnRlcnZhbDogc29tZUludGVydmFsLCB0aW1lb3V0OiBzb21lVGltZW91dH08L2NvZGU+LlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVydmFsIC0gVGhlIGFkdmVydGlzaW5nIGludGVydmFsIGluIG1pbGxpc2Vjb25kcyBpbiB0aGUgcmFuZ2Ugb2YgMjAgbXMgdG8gNSAwMDAgbXMuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMudGltZW91dCAtIFRoZSBhZHZlcnRpc2luZyB0aW1lb3V0IGluIHNlY29uZHMgaW4gdGhlIHJhbmdlIDEgcyB0byAxODAgcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0QWR2UGFyYW1zKHBhcmFtcykge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLmludGVydmFsID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLnRpbWVvdXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0IHdpdGgga2V5L3ZhbHVlIHBhaXJzIGludGVydmFsJyBhbmQgJ3RpbWVvdXQnOiB7aW50ZXJ2YWw6IHNvbWVJbnRlcnZhbCwgdGltZW91dDogc29tZVRpbWVvdXR9XCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW50ZXJ2YWwgaXMgaW4gdW5pdHMgb2YgMC42MjUgbXMuXHJcbiAgICBjb25zdCBpbnRlcnZhbCA9IHBhcmFtcy5pbnRlcnZhbCAqIDEuNjtcclxuICAgIGNvbnN0IHRpbWVvdXQgPSBwYXJhbXMudGltZW91dDtcclxuXHJcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXHJcbiAgICBpZiAoaW50ZXJ2YWwgPCAzMiB8fCBpbnRlcnZhbCA+IDgwMDApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGFkdmVydGlzaW5nIGludGVydmFsIG11c3QgYmUgd2l0aGluIHRoZSByYW5nZSBvZiAyMCBtcyB0byA1IDAwMCBtc1wiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGltZW91dCA8IDAgfHwgdGltZW91dCA+IDE4MCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgYWR2ZXJ0aXNpbmcgdGltZW91dCBtdXN0IGJlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgMCB0byAxODAgc1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMyk7XHJcbiAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICBkYXRhQXJyYXlbMV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG4gICAgZGF0YUFycmF5WzJdID0gdGltZW91dDtcclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25uZWN0aW9uIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgY29ubmVjdGlvbiBwYXJhbWV0ZXJzIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0Q29ublBhcmFtcygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcclxuXHJcbiAgICAgIC8vIENvbm5lY3Rpb24gaW50ZXJ2YWxzIGFyZSBnaXZlbiBpbiB1bml0cyBvZiAxLjI1IG1zXHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IG1pbkNvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKSAqIDEuMjU7XHJcbiAgICAgIGNvbnN0IG1heENvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKSAqIDEuMjU7XHJcbiAgICAgIGNvbnN0IHNsYXZlTGF0ZW5jeSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgIC8vIFN1cGVydmlzaW9uIHRpbWVvdXQgaXMgZ2l2ZW4gaSB1bml0cyBvZiAxMCBtc1xyXG4gICAgICBjb25zdCBzdXBlcnZpc2lvblRpbWVvdXQgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbikgKiAxMDtcclxuICAgICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICAgIGNvbm5lY3Rpb25JbnRlcnZhbDoge1xyXG4gICAgICAgICAgbWluOiBtaW5Db25uSW50ZXJ2YWwsXHJcbiAgICAgICAgICBtYXg6IG1heENvbm5JbnRlcnZhbCxcclxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNsYXZlTGF0ZW5jeToge1xyXG4gICAgICAgICAgdmFsdWU6IHNsYXZlTGF0ZW5jeSxcclxuICAgICAgICAgIHVuaXQ6IFwibnVtYmVyIG9mIGNvbm5lY3Rpb24gaW50ZXJ2YWxzXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdXBlcnZpc2lvblRpbWVvdXQ6IHtcclxuICAgICAgICAgIHRpbWVvdXQ6IHN1cGVydmlzaW9uVGltZW91dCxcclxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gaW50ZXJ2YWxcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIENvbm5lY3Rpb24gaW50ZXJ2YWwgb2JqZWN0OiA8Y29kZT57bWluSW50ZXJ2YWw6IHNvbWVWYWx1ZSwgbWF4SW50ZXJ2YWw6IHNvbWVWYWx1ZX08L2NvZGU+XHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWluSW50ZXJ2YWwgLSBUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSA+PSA3LjUgbXMuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4SW50ZXJ2YWwgLSBUaGUgbWF4aW11bSBjb25uZWN0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSA8PSA0IDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0Q29ubkludGVydmFsKHBhcmFtcykge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLm1pbkludGVydmFsID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLm1heEludGVydmFsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgYXJndW1lbnQgaGFzIHRvIGJlIGFuIG9iamVjdDoge21pbkludGVydmFsOiB2YWx1ZSwgbWF4SW50ZXJ2YWw6IHZhbHVlfVwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1pbkludGVydmFsID0gcGFyYW1zLm1pbkludGVydmFsO1xyXG4gICAgbGV0IG1heEludGVydmFsID0gcGFyYW1zLm1heEludGVydmFsO1xyXG5cclxuICAgIGlmIChtaW5JbnRlcnZhbCA9PT0gbnVsbCB8fCBtYXhJbnRlcnZhbCA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIkJvdGggbWluaW11bSBhbmQgbWF4aW11bSBhY2NlcHRhYmxlIGludGVydmFsIG11c3QgYmUgcGFzc2VkIGFzIGFyZ3VtZW50c1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xyXG4gICAgaWYgKG1pbkludGVydmFsIDwgNy41IHx8IG1pbkludGVydmFsID4gbWF4SW50ZXJ2YWwpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIG1pbmltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiA3LjUgbXMgYW5kIDw9IG1heGltdW0gaW50ZXJ2YWxcIilcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmIChtYXhJbnRlcnZhbCA+IDQwMDAgfHwgbWF4SW50ZXJ2YWwgPCBtaW5JbnRlcnZhbCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFJhbmdlRXJyb3IoXCJUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIG11c3QgYmUgbGVzcyB0aGFuIDQgMDAwIG1zIGFuZCA+PSBtaW5pbXVtIGludGVydmFsXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg4KTtcclxuXHJcbiAgICAgIC8vIEludGVydmFsIGlzIGluIHVuaXRzIG9mIDEuMjUgbXMuXHJcbiAgICAgIG1pbkludGVydmFsID0gTWF0aC5yb3VuZChtaW5JbnRlcnZhbCAqIDAuOCk7XHJcbiAgICAgIG1heEludGVydmFsID0gTWF0aC5yb3VuZChtYXhJbnRlcnZhbCAqIDAuOCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzBdID0gbWluSW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbMV0gPSAobWluSW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbMl0gPSBtYXhJbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVszXSA9IChtYXhJbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkVycm9yIHdoZW4gdXBkYXRpbmcgY29ubmVjdGlvbiBpbnRlcnZhbDogXCIgKyBlcnJvcikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gc2xhdmUgbGF0ZW5jeVxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gc2xhdmVMYXRlbmN5IC0gVGhlIGRlc2lyZWQgc2xhdmUgbGF0ZW5jeSBpbiB0aGUgcmFuZ2UgZnJvbSAwIHRvIDQ5OSBjb25uZWN0aW9uIGludGVydmFscy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldENvbm5TbGF2ZUxhdGVuY3koc2xhdmVMYXRlbmN5KSB7XHJcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXHJcbiAgICBpZiAoc2xhdmVMYXRlbmN5IDwgMCB8fCBzbGF2ZUxhdGVuY3kgPiA0OTkpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIHNsYXZlIGxhdGVuY3kgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgZnJvbSAwIHRvIDQ5OSBjb25uZWN0aW9uIGludGVydmFscy5cIilcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs0XSA9IHNsYXZlTGF0ZW5jeSAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs1XSA9IChzbGF2ZUxhdGVuY3kgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHVwZGF0aW5nIHNsYXZlIGxhdGVuY3k6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gc3VwZXJ2aXNpb24gdGltZW91dFxyXG4gICAqICA8Yj5Ob3RlOjwvYj4gQWNjb3JkaW5nIHRvIHRoZSBCbHVldG9vdGggTG93IEVuZXJneSBzcGVjaWZpY2F0aW9uLCB0aGUgc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgbXVzdCBiZSBncmVhdGVyXHJcbiAgICogIHRoYW4gKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsICogMiwgd2hlcmUgbWF4Q29ubkludGVydmFsIGlzIGFsc28gZ2l2ZW4gaW4gbWlsbGlzZWNvbmRzLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gdGltZW91dCAtIFRoZSBkZXNpcmVkIGNvbm5lY3Rpb24gc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgYW5kIGluIHRoZSByYW5nZSBvZiAxMDAgbXMgdG8gMzIgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRDb25uVGltZW91dCh0aW1lb3V0KSB7XHJcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXHJcbiAgICBpZiAodGltZW91dCA8IDEwMCB8fCB0aW1lb3V0ID4gMzIwMDApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgZnJvbSAxMDAgbXMgdG8gMzIgMDAwIG1zLlwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgaGFzIHRvIGJlIHNldCBpbiB1bml0cyBvZiAxMCBtc1xyXG4gICAgICB0aW1lb3V0ID0gTWF0aC5yb3VuZCh0aW1lb3V0IC8gMTApO1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHRpbWVvdXQgb2JleXMgIGNvbm5fc3VwX3RpbWVvdXQgKiA0ID4gKDEgKyBzbGF2ZV9sYXRlbmN5KSAqIG1heF9jb25uX2ludGVydmFsXHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IG1heENvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3Qgc2xhdmVMYXRlbmN5ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xyXG5cclxuICAgICAgaWYgKHRpbWVvdXQgKiA0IDwgKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAoMSArIHNsYXZlTGF0ZW5jeSkgKiBtYXhDb25uSW50ZXJ2YWwgKiAyLCB3aGVyZSBtYXhDb25uSW50ZXJ2YWwgaXMgYWxzbyBnaXZlbiBpbiBtaWxsaXNlY29uZHMuXCIpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzZdID0gdGltZW91dCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs3XSA9ICh0aW1lb3V0ID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiB1cGRhdGluZyB0aGUgc3VwZXJ2aXNpb24gdGltZW91dDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY29uZmlndXJlZCBFZGR5c3RvbmUgVVJMXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8VVJMfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBVUkwgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRFZGR5c3RvbmVVcmwoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljKTtcclxuXHJcbiAgICAgIC8vIEFjY29yZGluZyB0byBFZGR5c3RvbmUgVVJMIGVuY29kaW5nIHNwZWNpZmljYXRpb24sIGNlcnRhaW4gZWxlbWVudHMgY2FuIGJlIGV4cGFuZGVkOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXHJcbiAgICAgIGNvbnN0IHByZWZpeEFycmF5ID0gW1wiaHR0cDovL3d3dy5cIiwgXCJodHRwczovL3d3dy5cIiwgXCJodHRwOi8vXCIsIFwiaHR0cHM6Ly9cIl07XHJcbiAgICAgIGNvbnN0IGV4cGFuc2lvbkNvZGVzID0gW1xyXG4gICAgICAgIFwiLmNvbS9cIixcclxuICAgICAgICBcIi5vcmcvXCIsXHJcbiAgICAgICAgXCIuZWR1L1wiLFxyXG4gICAgICAgIFwiLm5ldC9cIixcclxuICAgICAgICBcIi5pbmZvL1wiLFxyXG4gICAgICAgIFwiLmJpei9cIixcclxuICAgICAgICBcIi5nb3YvXCIsXHJcbiAgICAgICAgXCIuY29tXCIsXHJcbiAgICAgICAgXCIub3JnXCIsXHJcbiAgICAgICAgXCIuZWR1XCIsXHJcbiAgICAgICAgXCIubmV0XCIsXHJcbiAgICAgICAgXCIuaW5mb1wiLFxyXG4gICAgICAgIFwiLmJpelwiLFxyXG4gICAgICAgIFwiLmdvdlwiLFxyXG4gICAgICBdO1xyXG4gICAgICBjb25zdCBwcmVmaXggPSBwcmVmaXhBcnJheVtyZWNlaXZlZERhdGEuZ2V0VWludDgoMCldO1xyXG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIik7XHJcbiAgICAgIGxldCB1cmwgPSBkZWNvZGVyLmRlY29kZShyZWNlaXZlZERhdGEpO1xyXG4gICAgICB1cmwgPSBwcmVmaXggKyB1cmwuc2xpY2UoMSk7XHJcblxyXG4gICAgICBleHBhbnNpb25Db2Rlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKFN0cmluZy5mcm9tQ2hhckNvZGUoaSkpICE9PSAtMSkge1xyXG4gICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoU3RyaW5nLmZyb21DaGFyQ29kZShpKSwgZXhwYW5zaW9uQ29kZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gbmV3IFVSTCh1cmwpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIEVkZHlzdG9uZSBVUkxcclxuICAgKiAgSXQncyByZWNvbW1lZW5kZWQgdG8gdXNlIFVSTCBzaG9ydGVuZXIgdG8gc3RheSB3aXRoaW4gdGhlIGxpbWl0IG9mIDE0IGNoYXJhY3RlcnMgbG9uZyBVUkxcclxuICAgKiAgVVJMIHNjaGVtZSBwcmVmaXggc3VjaCBhcyBcImh0dHBzOi8vXCIgYW5kIFwiaHR0cHM6Ly93d3cuXCIgZG8gbm90IGNvdW50IHRvd2FyZHMgdGhhdCBsaW1pdCxcclxuICAgKiAgbmVpdGhlciBkb2VzIGV4cGFuc2lvbiBjb2RlcyBzdWNoIGFzIFwiLmNvbS9cIiBhbmQgXCIub3JnXCIuXHJcbiAgICogIEZ1bGwgZGV0YWlscyBpbiB0aGUgRWRkeXN0b25lIFVSTCBzcGVjaWZpY2F0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7c3RyaW5nfSB1cmxTdHJpbmcgLSBUaGUgVVJMIHRoYXQgc2hvdWxkIGJlIGJyb2FkY2FzdGVkLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRFZGR5c3RvbmVVcmwodXJsU3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBVc2VzIFVSTCBBUEkgdG8gY2hlY2sgZm9yIHZhbGlkIFVSTFxyXG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHVybFN0cmluZyk7XHJcblxyXG4gICAgICAvLyBFZGR5c3RvbmUgVVJMIHNwZWNpZmljYXRpb24gZGVmaW5lcyBjb2RlcyBmb3IgVVJMIHNjaGVtZSBwcmVmaXhlcyBhbmQgZXhwYW5zaW9uIGNvZGVzIGluIHRoZSBVUkwuXHJcbiAgICAgIC8vIFRoZSBhcnJheSBpbmRleCBjb3JyZXNwb25kcyB0byB0aGUgZGVmaW5lZCBjb2RlIGluIHRoZSBzcGVjaWZpY2F0aW9uLlxyXG4gICAgICAvLyBEZXRhaWxzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZWRkeXN0b25lL3RyZWUvbWFzdGVyL2VkZHlzdG9uZS11cmxcclxuICAgICAgY29uc3QgcHJlZml4QXJyYXkgPSBbXCJodHRwOi8vd3d3LlwiLCBcImh0dHBzOi8vd3d3LlwiLCBcImh0dHA6Ly9cIiwgXCJodHRwczovL1wiXTtcclxuICAgICAgY29uc3QgZXhwYW5zaW9uQ29kZXMgPSBbXHJcbiAgICAgICAgXCIuY29tL1wiLFxyXG4gICAgICAgIFwiLm9yZy9cIixcclxuICAgICAgICBcIi5lZHUvXCIsXHJcbiAgICAgICAgXCIubmV0L1wiLFxyXG4gICAgICAgIFwiLmluZm8vXCIsXHJcbiAgICAgICAgXCIuYml6L1wiLFxyXG4gICAgICAgIFwiLmdvdi9cIixcclxuICAgICAgICBcIi5jb21cIixcclxuICAgICAgICBcIi5vcmdcIixcclxuICAgICAgICBcIi5lZHVcIixcclxuICAgICAgICBcIi5uZXRcIixcclxuICAgICAgICBcIi5pbmZvXCIsXHJcbiAgICAgICAgXCIuYml6XCIsXHJcbiAgICAgICAgXCIuZ292XCIsXHJcbiAgICAgIF07XHJcbiAgICAgIGxldCBwcmVmaXhDb2RlID0gbnVsbDtcclxuICAgICAgbGV0IGV4cGFuc2lvbkNvZGUgPSBudWxsO1xyXG4gICAgICBsZXQgZWRkeXN0b25lVXJsID0gdXJsLmhyZWY7XHJcbiAgICAgIGxldCBsZW4gPSBlZGR5c3RvbmVVcmwubGVuZ3RoO1xyXG5cclxuICAgICAgcHJlZml4QXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xyXG4gICAgICAgIGlmICh1cmwuaHJlZi5pbmRleE9mKGVsZW1lbnQpICE9PSAtMSAmJiBwcmVmaXhDb2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgICBwcmVmaXhDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcclxuICAgICAgICAgIGVkZHlzdG9uZVVybCA9IGVkZHlzdG9uZVVybC5yZXBsYWNlKGVsZW1lbnQsIHByZWZpeENvZGUpO1xyXG4gICAgICAgICAgbGVuIC09IGVsZW1lbnQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBleHBhbnNpb25Db2Rlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHVybC5ocmVmLmluZGV4T2YoZWxlbWVudCkgIT09IC0xICYmIGV4cGFuc2lvbkNvZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgIGV4cGFuc2lvbkNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xyXG4gICAgICAgICAgZWRkeXN0b25lVXJsID0gZWRkeXN0b25lVXJsLnJlcGxhY2UoZWxlbWVudCwgZXhwYW5zaW9uQ29kZSk7XHJcbiAgICAgICAgICBsZW4gLT0gZWxlbWVudC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChsZW4gPCAxIHx8IGxlbiA+IDE0KSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgVVJMIGNhbid0IGJlIGxvbmdlciB0aGFuIDE0IGNoYXJhY3RlcnMsIGV4Y2x1ZGluZyBVUkwgc2NoZW1lIHN1Y2ggYXMgXFxcImh0dHBzOi8vXFxcIiBhbmQgXFxcIi5jb20vXFxcIi5cIilcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShlZGR5c3RvbmVVcmwubGVuZ3RoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWRkeXN0b25lVXJsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYnl0ZUFycmF5W2ldID0gZWRkeXN0b25lVXJsLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5lZGR5c3RvbmVDaGFyYWN0ZXJpc3RpYywgYnl0ZUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY29uZmlndXJlZCBjbG91ZCB0b2tlbi5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIGNsb3VkIHRva2VuIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0Q2xvdWRUb2tlbigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xyXG4gICAgICBjb25zdCB0b2tlbiA9IGRlY29kZXIuZGVjb2RlKHJlY2VpdmVkRGF0YSk7XHJcblxyXG4gICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgY2xvdWQgdG9rZW4uXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBjbG91ZCB0b2tlbiB0byBiZSBzdG9yZWQuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldENsb3VkVG9rZW4odG9rZW4pIHtcclxuICAgIGlmICh0b2tlbi5sZW5ndGggPiAyNTApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBjbG91ZCB0b2tlbiBjYW4gbm90IGV4Y2VlZCAyNTAgY2hhcmFjdGVycy5cIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoXCJ1dGYtOFwiKS5lbmNvZGUodG9rZW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5jbG91ZFRva2VuQ2hhcmFjdGVyaXN0aWMsIGVuY29kZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgTWF4aW1hbCBUcmFuc21pc3Npb24gVW5pdCAoTVRVKVxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPG51bWJlcnxFcnJvcj59IFJldHVybnMgdGhlIE1UVSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldE10dSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubXR1UmVxdWVzdENoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgY29uc3QgbXR1ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigxLCBsaXR0bGVFbmRpYW4pO1xyXG5cclxuICAgICAgcmV0dXJuIG10dTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjdXJyZW50IE1heGltYWwgVHJhbnNtaXNzaW9uIFVuaXQgKE1UVSlcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMgPSB7cGVyaXBoZXJhbFJlcXVlc3Q6IHRydWV9XSAtIE1UVSBzZXR0aW5ncyBvYmplY3Q6IHttdHVTaXplOiB2YWx1ZSwgcGVyaXBoZXJhbFJlcXVlc3Q6IHZhbHVlfSwgd2hlcmUgcGVyaXBoZXJhbFJlcXVlc3QgaXMgb3B0aW9uYWwuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubXR1U2l6ZSAtIFRoZSBkZXNpcmVkIE1UVSBzaXplLlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5wZXJpcGhlcmFsUmVxdWVzdCAtIE9wdGlvbmFsLiBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgcGVyaXBoZXJhbCBzaG91bGQgc2VuZCBhbiBNVFUgZXhjaGFuZ2UgcmVxdWVzdC4gRGVmYXVsdCBpcyA8Y29kZT50cnVlPC9jb2RlPjtcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0TXR1KHBhcmFtcykge1xyXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLm10dVNpemUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0XCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtdHVTaXplID0gcGFyYW1zLm10dVNpemU7XHJcbiAgICBjb25zdCBwZXJpcGhlcmFsUmVxdWVzdCA9IHBhcmFtcy5wZXJpcGhlcmFsUmVxdWVzdCB8fCB0cnVlO1xyXG5cclxuICAgIGlmIChtdHVTaXplIDwgMjMgfHwgbXR1U2l6ZSA+IDI3Nikge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTVRVIHNpemUgbXVzdCBiZSBpbiByYW5nZSAyMyAtIDI3NiBieXRlc1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMyk7XHJcbiAgICBkYXRhQXJyYXlbMF0gPSBwZXJpcGhlcmFsUmVxdWVzdCA/IDEgOiAwO1xyXG4gICAgZGF0YUFycmF5WzFdID0gbXR1U2l6ZSAmIDB4ZmY7XHJcbiAgICBkYXRhQXJyYXlbMl0gPSAobXR1U2l6ZSA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLm10dVJlcXVlc3RDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGZpcm13YXJlIHZlcnNpb24uXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBmaXJtd2FyZSB2ZXJzaW9uIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEZpcm13YXJlVmVyc2lvbigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZmlybXdhcmVWZXJzaW9uQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBtYWpvciA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgwKTtcclxuICAgICAgY29uc3QgbWlub3IgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMSk7XHJcbiAgICAgIGNvbnN0IHBhdGNoID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDIpO1xyXG4gICAgICBjb25zdCB2ZXJzaW9uID0gYHYke21ham9yfS4ke21pbm9yfS4ke3BhdGNofWA7XHJcblxyXG4gICAgICByZXR1cm4gdmVyc2lvbjtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICAqKioqKiogIC8vXHJcblxyXG4gIC8qICBFbnZpcm9ubWVudCBzZXJ2aWNlICAqL1xyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIG9mIHRoZSBUaGluZ3kgZW52aXJvbm1lbnQgbW9kdWxlLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gZW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvYmplY3Qgd2hlbiBwcm9taXNlIHJlc29sdmVzLCBvciBhbiBlcnJvciBpZiByZWplY3RlZC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEVudmlyb25tZW50Q29uZmlnKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IHRlbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IHByZXNzdXJlSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBodW1pZGl0eUludGVydmFsID0gZGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgY29sb3JJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IGdhc01vZGUgPSBkYXRhLmdldFVpbnQ4KDgpO1xyXG4gICAgICBjb25zdCBjb2xvclNlbnNvclJlZCA9IGRhdGEuZ2V0VWludDgoOSk7XHJcbiAgICAgIGNvbnN0IGNvbG9yU2Vuc29yR3JlZW4gPSBkYXRhLmdldFVpbnQ4KDEwKTtcclxuICAgICAgY29uc3QgY29sb3JTZW5zb3JCbHVlID0gZGF0YS5nZXRVaW50OCgxMSk7XHJcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICB0ZW1wSW50ZXJ2YWw6IHRlbXBJbnRlcnZhbCxcclxuICAgICAgICBwcmVzc3VyZUludGVydmFsOiBwcmVzc3VyZUludGVydmFsLFxyXG4gICAgICAgIGh1bWlkaXR5SW50ZXJ2YWw6IGh1bWlkaXR5SW50ZXJ2YWwsXHJcbiAgICAgICAgY29sb3JJbnRlcnZhbDogY29sb3JJbnRlcnZhbCxcclxuICAgICAgICBnYXNNb2RlOiBnYXNNb2RlLFxyXG4gICAgICAgIGNvbG9yU2Vuc29yUmVkOiBjb2xvclNlbnNvclJlZCxcclxuICAgICAgICBjb2xvclNlbnNvckdyZWVuOiBjb2xvclNlbnNvckdyZWVuLFxyXG4gICAgICAgIGNvbG9yU2Vuc29yQmx1ZTogY29sb3JTZW5zb3JCbHVlLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgZW52aXJvbm1lbnQgc2Vuc29ycyBjb25maWd1cmF0aW9uczogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgdGVtcGVyYXR1cmUgbWVhc3VyZW1lbnQgdXBkYXRlIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUZW1wZXJhdHVyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDYwIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0VGVtcGVyYXR1cmVJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgNTAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSB0ZW1wZXJhdHVyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVswXSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzFdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgdGVtcGVyYXR1cmUgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBwcmVzc3VyZSBtZWFzdXJlbWVudCB1cGRhdGUgaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRoZSBwcmVzc3VyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgNTAgbXMgdG8gNjAgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRQcmVzc3VyZUludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCA1MCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHByZXNzdXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzJdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbM10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBwcmVzc3VyZSB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGh1bWlkaXR5IG1lYXN1cmVtZW50IHVwZGF0ZSBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gSHVtaWRpdHkgc2Vuc29yIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDYwIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0SHVtaWRpdHlJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gNjAwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgaHVtaWRpdHkgc2Vuc29yIHNhbXBsaW5nIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs0XSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzVdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgaHVtaWRpdHkgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjb2xvciBzZW5zb3IgdXBkYXRlIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBDb2xvciBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAyMDAgbXMgdG8gNjAgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRDb2xvckludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCAyMDAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMjAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzZdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbN10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBjb2xvciBzZW5zb3IgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBnYXMgc2Vuc29yIHNhbXBsaW5nIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRoZSBnYXMgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBpbiBzZWNvbmRzLiBBbGxvd2VkIHZhbHVlcyBhcmUgMSwgMTAsIGFuZCA2MCBzZWNvbmRzLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRHYXNJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IG1vZGU7XHJcblxyXG4gICAgICBpZiAoaW50ZXJ2YWwgPT09IDEpIHtcclxuICAgICAgICBtb2RlID0gMTtcclxuICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA9PT0gMTApIHtcclxuICAgICAgICBtb2RlID0gMjtcclxuICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA9PT0gNjApIHtcclxuICAgICAgICBtb2RlID0gMztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgZ2FzIHNlbnNvciBpbnRlcnZhbCBoYXMgdG8gYmUgMSwgMTAgb3IgNjAgc2Vjb25kcy5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbOF0gPSBtb2RlO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBnYXMgc2Vuc29yIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBDb25maWd1cmVzIGNvbG9yIHNlbnNvciBMRUQgY2FsaWJyYXRpb24gcGFyYW1ldGVycy5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IHJlZCAtIFRoZSByZWQgaW50ZW5zaXR5LCByYW5naW5nIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBncmVlbiAtIFRoZSBncmVlbiBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGJsdWUgLSBUaGUgYmx1ZSBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgY29sb3JTZW5zb3JDYWxpYnJhdGUocmVkLCBncmVlbiwgYmx1ZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzldID0gcmVkO1xyXG4gICAgICBkYXRhQXJyYXlbMTBdID0gZ3JlZW47XHJcbiAgICAgIGRhdGFBcnJheVsxMV0gPSBibHVlO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBjb2xvciBzZW5zb3IgcGFyYW1ldGVyczogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyB0ZW1wZXJhdHVyZSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSB0ZW1wZXJhdHVyZSBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgdGVtcGVyYXR1cmVFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl90ZW1wZXJhdHVyZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy50ZW1wZXJhdHVyZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF90ZW1wZXJhdHVyZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBpbnRlZ2VyID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIGNvbnN0IGRlY2ltYWwgPSBkYXRhLmdldFVpbnQ4KDEpO1xyXG4gICAgY29uc3QgdGVtcGVyYXR1cmUgPSBpbnRlZ2VyICsgZGVjaW1hbCAvIDEwMDtcclxuICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHZhbHVlOiB0ZW1wZXJhdHVyZSxcclxuICAgICAgICB1bml0OiBcIkNlbHNpdXNcIixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHByZXNzdXJlIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHByZXNzdXJlIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBwcmVzc3VyZUVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9wcmVzc3VyZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5wcmVzc3VyZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfcHJlc3N1cmVOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgIGNvbnN0IGludGVnZXIgPSBkYXRhLmdldFVpbnQzMigwLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgZGVjaW1hbCA9IGRhdGEuZ2V0VWludDgoNCk7XHJcbiAgICBjb25zdCBwcmVzc3VyZSA9IGludGVnZXIgKyBkZWNpbWFsIC8gMTAwO1xyXG4gICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHZhbHVlOiBwcmVzc3VyZSxcclxuICAgICAgICB1bml0OiBcImhQYVwiLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgaHVtaWRpdHkgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgaHVtaWRpdHkgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGh1bWlkaXR5RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2h1bWlkaXR5Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuaHVtaWRpdHlDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2h1bWlkaXR5Tm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGh1bWlkaXR5ID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB2YWx1ZTogaHVtaWRpdHksXHJcbiAgICAgICAgdW5pdDogXCIlXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBnYXMgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgZ2FzIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnYXNFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2dhc05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmdhc0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5nYXNDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcbiAgX2dhc05vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgY29uc3QgZWNvMiA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCB0dm9jID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIGVDTzI6IHtcclxuICAgICAgICAgIHZhbHVlOiBlY28yLFxyXG4gICAgICAgICAgdW5pdDogXCJwcG1cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIFRWT0M6IHtcclxuICAgICAgICAgIHZhbHVlOiB0dm9jLFxyXG4gICAgICAgICAgdW5pdDogXCJwcGJcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgY29sb3Igc2Vuc29yIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGNvbG9yIHNlbnNvciBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgY29sb3JFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fY29sb3JOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuY29sb3JFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuY29sb3JDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2NvbG9yTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICBjb25zdCByID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IGcgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgYiA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCBjID0gZGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IHJSYXRpbyA9IHIgLyAociArIGcgKyBiKTtcclxuICAgIGNvbnN0IGdSYXRpbyA9IGcgLyAociArIGcgKyBiKTtcclxuICAgIGNvbnN0IGJSYXRpbyA9IGIgLyAociArIGcgKyBiKTtcclxuICAgIGNvbnN0IGNsZWFyQXRCbGFjayA9IDMwMDtcclxuICAgIGNvbnN0IGNsZWFyQXRXaGl0ZSA9IDQwMDtcclxuICAgIGNvbnN0IGNsZWFyRGlmZiA9IGNsZWFyQXRXaGl0ZSAtIGNsZWFyQXRCbGFjaztcclxuICAgIGxldCBjbGVhck5vcm1hbGl6ZWQgPSAoYyAtIGNsZWFyQXRCbGFjaykgLyBjbGVhckRpZmY7XHJcblxyXG4gICAgaWYgKGNsZWFyTm9ybWFsaXplZCA8IDApIHtcclxuICAgICAgY2xlYXJOb3JtYWxpemVkID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVkID0gclJhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xyXG5cclxuICAgIGlmIChyZWQgPiAyNTUpIHtcclxuICAgICAgcmVkID0gMjU1O1xyXG4gICAgfVxyXG4gICAgbGV0IGdyZWVuID0gZ1JhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xyXG5cclxuICAgIGlmIChncmVlbiA+IDI1NSkge1xyXG4gICAgICBncmVlbiA9IDI1NTtcclxuICAgIH1cclxuICAgIGxldCBibHVlID0gYlJhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xyXG5cclxuICAgIGlmIChibHVlID4gMjU1KSB7XHJcbiAgICAgIGJsdWUgPSAyNTU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHJlZDogcmVkLnRvRml4ZWQoMCksXHJcbiAgICAgICAgZ3JlZW46IGdyZWVuLnRvRml4ZWQoMCksXHJcbiAgICAgICAgYmx1ZTogYmx1ZS50b0ZpeGVkKDApLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gICoqKioqKiAgLy9cclxuICAvKiAgVXNlciBpbnRlcmZhY2Ugc2VydmljZSAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgTEVEIHNldHRpbmdzIGZyb20gdGhlIFRoaW5neSBkZXZpY2UuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggc3RydWN0dXJlIHRoYXQgZGVwZW5kcyBvbiB0aGUgc2V0dGluZ3MuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gUmV0dXJucyBhIExFRCBzdGF0dXMgb2JqZWN0LiBUaGUgY29udGVudCBhbmQgc3RydWN0dXJlIGRlcGVuZHMgb24gdGhlIGN1cnJlbnQgbW9kZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldExlZFN0YXR1cygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmxlZENoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbW9kZSA9IGRhdGEuZ2V0VWludDgoMCk7XHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGxldCBzdGF0dXM7XHJcblxyXG4gICAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIHN0YXR1cyA9IHtMRURzdGF0dXM6IHttb2RlOiBtb2RlfX07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICBzdGF0dXMgPSB7XHJcbiAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgcjogZGF0YS5nZXRVaW50OCgxKSxcclxuICAgICAgICAgIGc6IGRhdGEuZ2V0VWludDgoMiksXHJcbiAgICAgICAgICBiOiBkYXRhLmdldFVpbnQ4KDMpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICBzdGF0dXMgPSB7XHJcbiAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgY29sb3I6IGRhdGEuZ2V0VWludDgoMSksXHJcbiAgICAgICAgICBpbnRlbnNpdHk6IGRhdGEuZ2V0VWludDgoMiksXHJcbiAgICAgICAgICBkZWxheTogZGF0YS5nZXRVaW50MTYoMywgbGl0dGxlRW5kaWFuKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgc3RhdHVzID0ge1xyXG4gICAgICAgICAgbW9kZTogbW9kZSxcclxuICAgICAgICAgIGNvbG9yOiBkYXRhLmdldFVpbnQ4KDEpLFxyXG4gICAgICAgICAgaW50ZW5zaXR5OiBkYXRhLmdldFVpbnQ4KDIpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHN0YXR1cztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgVGhpbmd5IExFRCBzdGF0dXM6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2xlZFNldChkYXRhQXJyYXkpIHtcclxuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5sZWRDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gY29uc3RhbnQgbW9kZSB3aXRoIHRoZSBzcGVjaWZpZWQgUkdCIGNvbG9yLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gY29sb3IgLSBDb2xvciBvYmplY3Qgd2l0aCBSR0IgdmFsdWVzXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5yZWQgLSBUaGUgdmFsdWUgZm9yIHJlZCBjb2xvciBpbiBhbiBSR0IgY29sb3IuIFJhbmdlcyBmcm9tIDAgdG8gMjU1LlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gY29sb3IuZ3JlZW4gLSBUaGUgdmFsdWUgZm9yIGdyZWVuIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5ibHVlIC0gVGhlIHZhbHVlIGZvciBibHVlIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBsZWRDb25zdGFudChjb2xvcikge1xyXG4gICAgaWYgKGNvbG9yLnJlZCA9PT0gdW5kZWZpbmVkIHx8IGNvbG9yLmdyZWVuID09PSB1bmRlZmluZWQgfHwgY29sb3IuYmx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBtdXN0IGhhdmUgdGhlIHByb3BlcnRpZXMgJ3JlZCcsICdncmVlbicgYW5kICdibHVlJy5cIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKFxyXG4gICAgICBjb2xvci5yZWQgPCAwIHx8XHJcbiAgICAgIGNvbG9yLnJlZCA+IDI1NSB8fFxyXG4gICAgICBjb2xvci5ncmVlbiA8IDAgfHxcclxuICAgICAgY29sb3IuZ3JlZW4gPiAyNTUgfHxcclxuICAgICAgY29sb3IuYmx1ZSA8IDAgfHxcclxuICAgICAgY29sb3IuYmx1ZSA+IDI1NVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBSR0IgdmFsdWVzIG11c3QgYmUgaW4gdGhlIHJhbmdlIDAgLSAyNTVcIikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMSwgY29sb3IucmVkLCBjb2xvci5ncmVlbiwgY29sb3IuYmx1ZV0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gXCJicmVhdGhlXCIgbW9kZSB3aGVyZSB0aGUgTEVEIGNvbnRpbnVvdXNseSBwdWxzZXMgd2l0aCB0aGUgc3BlY2lmaWVkIGNvbG9yLCBpbnRlbnNpdHkgYW5kIGRlbGF5IGJldHdlZW4gcHVsc2VzLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT3B0aW9ucyBvYmplY3QgZm9yIExFRCBicmVhdGhlIG1vZGVcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBwYXJhbXMuY29sb3IgLSBUaGUgY29sb3IgY29kZSBvciBjb2xvciBuYW1lLiAxID0gcmVkLCAyID0gZ3JlZW4sIDMgPSB5ZWxsb3csIDQgPSBibHVlLCA1ID0gcHVycGxlLCA2ID0gY3lhbiwgNyA9IHdoaXRlLlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVuc2l0eSAtIEludGVuc2l0eSBvZiBMRUQgcHVsc2VzLiBSYW5nZSBmcm9tIDAgdG8gMTAwIFslXS5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5kZWxheSAtIERlbGF5IGJldHdlZW4gcHVsc2VzIGluIG1pbGxpc2Vjb25kcy4gUmFuZ2UgZnJvbSA1MCBtcyB0byAxMCAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBsZWRCcmVhdGhlKHBhcmFtcykge1xyXG4gICAgY29uc3QgY29sb3JzID0gW1wicmVkXCIsIFwiZ3JlZW5cIiwgXCJ5ZWxsb3dcIiwgXCJibHVlXCIsIFwicHVycGxlXCIsIFwiY3lhblwiLCBcIndoaXRlXCJdO1xyXG4gICAgY29uc3QgY29sb3JDb2RlID0gdHlwZW9mIHBhcmFtcy5jb2xvciA9PT0gXCJzdHJpbmdcIiA/IGNvbG9ycy5pbmRleE9mKHBhcmFtcy5jb2xvcikgKyAxIDogcGFyYW1zLmNvbG9yO1xyXG5cclxuICAgIGlmIChwYXJhbXMuY29sb3IgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaW50ZW5zaXR5ID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmRlbGF5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoXCJUaGUgb3B0aW9ucyBvYmplY3QgZm9yIG11c3QgaGF2ZSB0aGUgcHJvcGVydGllcyAnY29sb3InLCAnaW50ZW5zaXR5JyBhbmQgJ2ludGVuc2l0eScuXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sb3JDb2RlIDwgMSB8fCBjb2xvckNvZGUgPiA3KSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBjb2RlIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEgLSA3XCIpKTtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMuaW50ZW5zaXR5IDwgMCB8fCBwYXJhbXMuaW50ZW5zaXR5ID4gMTAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBpbnRlbnNpdHkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDEwMCVcIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmFtcy5kZWxheSA8IDUwIHx8IHBhcmFtcy5kZWxheSA+IDEwMDAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBkZWxheSBtdXN0IGJlIGluIHRoZSByYW5nZSA1MCBtcyAtIDEwIDAwMCBtc1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMiwgY29sb3JDb2RlLCBwYXJhbXMuaW50ZW5zaXR5LCBwYXJhbXMuZGVsYXkgJiAweGZmLCAocGFyYW1zLmRlbGF5ID4+IDgpICYgMHhmZl0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gb25lLXNob3QgbW9kZS4gT25lLXNob3QgbW9kZSB3aWxsIHJlc3VsdCBpbiBvbmUgc2luZ2xlIHB1bHNlIG9mIHRoZSBMRUQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPcHRpb24gb2JqZWN0IGZvciBMRUQgaW4gb25lLXNob3QgbW9kZVxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmNvbG9yIC0gVGhlIGNvbG9yIGNvZGUuIDEgPSByZWQsIDIgPSBncmVlbiwgMyA9IHllbGxvdywgNCA9IGJsdWUsIDUgPSBwdXJwbGUsIDYgPSBjeWFuLCA3ID0gd2hpdGUuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuaW50ZW5zaXR5IC0gSW50ZW5zaXR5IG9mIExFRCBwdWxzZXMuIFJhbmdlIGZyb20gMCB0byAxMDAgWyVdLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHJlc29sdmVkIHByb21pc2Ugb3IgYW4gZXJyb3IgaW4gYSByZWplY3RlZCBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgbGVkT25lU2hvdChwYXJhbXMpIHtcclxuICAgIGNvbnN0IGNvbG9ycyA9IFtcInJlZFwiLCBcImdyZWVuXCIsIFwieWVsbG93XCIsIFwiYmx1ZVwiLCBcInB1cnBsZVwiLCBcImN5YW5cIiwgXCJ3aGl0ZVwiXTtcclxuICAgIGNvbnN0IGNvbG9yQ29kZSA9IHR5cGVvZiBwYXJhbXMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBjb2xvcnMuaW5kZXhPZihwYXJhbXMuY29sb3IpICsgMSA6IHBhcmFtcy5jb2xvcjtcclxuXHJcbiAgICBpZiAoY29sb3JDb2RlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmludGVuc2l0eSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcclxuICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBMRUQgb25lLXNob3QgbXVzdCBoYXZlIHRoZSBwcm9wZXJ0aWVzICdjb2xvcicgYW5kICdpbnRlbnNpdHkuXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sb3JDb2RlIDwgMSB8fCBjb2xvckNvZGUgPiA3KSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBjb2RlIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEgLSA3XCIpKTtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMuaW50ZW5zaXR5IDwgMSB8fCBwYXJhbXMuaW50ZW5zaXR5ID4gMTAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBpbnRlbnNpdHkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDEwMFwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMywgY29sb3JDb2RlLCBwYXJhbXMuaW50ZW5zaXR5XSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgYnV0dG9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGJ1dHRvbiBvbiB0aGUgVGhpbmd5IGlzIHB1c2hlZCBvciByZWxlYXNlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgYnV0dG9uIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdpdGggYnV0dG9uIHN0YXRlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgYnV0dG9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9idXR0b25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5idXR0b25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5idXR0b25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9idXR0b25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3Qgc3RhdGUgPSBkYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHN0YXRlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgZXh0ZXJuYWwgcGluIHNldHRpbmdzIGZyb20gdGhlIFRoaW5neSBkZXZpY2UuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggcGluIHN0YXR1cyBpbmZvcm1hdGlvbi5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIGV4dGVybmFsIHBpbiBzdGF0dXMgb2JqZWN0LlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZXh0ZXJuYWxQaW5zU3RhdHVzKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IHBpblN0YXR1cyA9IHtcclxuICAgICAgICBwaW4xOiBkYXRhLmdldFVpbnQ4KDApLFxyXG4gICAgICAgIHBpbjI6IGRhdGEuZ2V0VWludDgoMSksXHJcbiAgICAgICAgcGluMzogZGF0YS5nZXRVaW50OCgyKSxcclxuICAgICAgICBwaW40OiBkYXRhLmdldFVpbnQ4KDMpLFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcGluU3RhdHVzO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gcmVhZGluZyBmcm9tIGV4dGVybmFsIHBpbiBjaGFyYWN0ZXJpc3RpYzogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0IGFuIGV4dGVybmFsIHBpbiB0byBjaG9zZW4gc3RhdGUuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwaW4gLSBEZXRlcm1pbmVzIHdoaWNoIHBpbiBpcyBzZXQuIFJhbmdlIDEgLSA0LlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgcGluLiAwID0gT0ZGLCAyNTUgPSBPTi5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0RXh0ZXJuYWxQaW4ocGluLCB2YWx1ZSkge1xyXG4gICAgaWYgKHBpbiA8IDEgfHwgcGluID4gNCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUGluIG51bWJlciBtdXN0IGJlIDEgLSA0XCIpKTtcclxuICAgIH1cclxuICAgIGlmICghKHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAyNTUpKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQaW4gc3RhdHVzIHZhbHVlIG11c3QgYmUgMCBvciAyNTVcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2UgcGlucyB0aGF0IGFyZSBub3QgYmVpbmcgc2V0XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDQpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVtwaW4gLSAxXSA9IHZhbHVlO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIGV4dGVybmFsIHBpbnM6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gICoqKioqKiAgLy9cclxuICAvKiAgTW90aW9uIHNlcnZpY2UgICovXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBvZiB0aGUgVGhpbmd5IG1vdGlvbiBtb2R1bGUuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhIG1vdGlvbiBjb25maWd1cmF0aW9uIG9iamVjdCB3aGVuIHByb21pc2UgcmVzb2x2ZXMsIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0TW90aW9uQ29uZmlnKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBjb25zdCBzdGVwQ291bnRlckludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgdGVtcENvbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IG1hZ25ldENvbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IG1vdGlvblByb2Nlc3NpbmdGcmVxdWVuY3kgPSBkYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCB3YWtlT25Nb3Rpb24gPSBkYXRhLmdldFVpbnQ4KDgpO1xyXG4gICAgICBjb25zdCBjb25maWcgPSB7XHJcbiAgICAgICAgc3RlcENvdW50SW50ZXJ2YWw6IHN0ZXBDb3VudGVySW50ZXJ2YWwsXHJcbiAgICAgICAgdGVtcENvbXBJbnRlcnZhbDogdGVtcENvbXBJbnRlcnZhbCxcclxuICAgICAgICBtYWduZXRDb21wSW50ZXJ2YWw6IG1hZ25ldENvbXBJbnRlcnZhbCxcclxuICAgICAgICBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5OiBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5LFxyXG4gICAgICAgIHdha2VPbk1vdGlvbjogd2FrZU9uTW90aW9uLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgVGhpbmd5IG1vdGlvbiBtb2R1bGUgY29uZmlndXJhdGlvbjogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgc3RlcCBjb3VudGVyIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gaW50ZXJ2YWwgLSBTdGVwIGNvdW50ZXIgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNSAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldFN0ZXBDb3VudGVySW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDUwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gNTAwMCBtcy5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVsxXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBzdGVwIGNvdW50IGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSB0ZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRlbXBlcmF0dXJlIGNvbXBlbnNhdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA1IDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0VGVtcGVyYXR1cmVDb21wSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDUwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gNTAwMCBtcy5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbMl0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVszXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyB0ZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIE1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gMSAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldE1hZ25ldENvbXBJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gMTAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSAxMDAgLSAxMDAwIG1zLlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs0XSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzVdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgbW90aW9uIHByb2Nlc3NpbmcgdW5pdCB1cGRhdGUgZnJlcXVlbmN5LlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gZnJlcXVlbmN5IC0gTW90aW9uIHByb2Nlc3NpbmcgZnJlcXVlbmN5IGluIEh6LiBUaGUgYWxsb3dlZCByYW5nZSBpcyA1IC0gMjAwIEh6LlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRNb3Rpb25Qcm9jZXNzRnJlcXVlbmN5KGZyZXF1ZW5jeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGZyZXF1ZW5jeSA8IDEwMCB8fCBmcmVxdWVuY3kgPiAyMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgNSAtIDIwMCBIei5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbNl0gPSBmcmVxdWVuY3kgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbN10gPSAoZnJlcXVlbmN5ID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1vdGlvbiBwb3JjZXNzaW5nIHVuaXQgdXBkYXRlIGZyZXF1ZW5jeTogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB3YWtlLW9uLW1vdGlvbiBmZWF0dXJlIHRvIGVuYWJsZWQgb3IgZGlzYWJsZWQgc3RhdGUuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gU2V0IHRvIFRydWUgdG8gZW5hYmxlIG9yIEZhbHNlIHRvIGRpc2FibGUgd2FrZS1vbi1tb3Rpb24gZmVhdHVyZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0V2FrZU9uTW90aW9uKGVuYWJsZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKHR5cGVvZiBlbmFibGUgIT09IFwiYm9vbGVhblwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBhcmd1bWVudCBtdXN0IGJlIHRydWUgb3IgZmFsc2UuXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzhdID0gZW5hYmxlID8gMSA6IDA7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBtYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsOlwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgdGFwIGRldGVjdGlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSB0YXAgZGV0ZWN0aW9uIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyB0YXBFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3RhcE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnRhcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy50YXBDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF90YXBOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIGNvbnN0IGNvdW50ID0gZGF0YS5nZXRVaW50OCgxKTtcclxuICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgY291bnQ6IGNvdW50LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgb3JpZW50YXRpb24gZGV0ZWN0aW9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIG9yaWVudGF0aW9uIGRldGVjdGlvbiBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgb3JpZW50YXRpb25FbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fb3JpZW50YXRpb25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMub3JpZW50YXRpb25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX29yaWVudGF0aW9uTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKG9yaWVudGF0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgcXVhdGVybmlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBxdWF0ZXJuaW9uIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBxdWF0ZXJuaW9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fcXVhdGVybmlvbk5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5xdWF0ZXJuaW9uQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX3F1YXRlcm5pb25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAoMSA8PCAzMCkgYWNjb3JkaW5nIHRvIHNlbnNvciBzcGVjaWZpY2F0aW9uXHJcbiAgICBsZXQgdyA9IGRhdGEuZ2V0SW50MzIoMCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XHJcbiAgICBsZXQgeCA9IGRhdGEuZ2V0SW50MzIoNCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XHJcbiAgICBsZXQgeSA9IGRhdGEuZ2V0SW50MzIoOCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XHJcbiAgICBsZXQgeiA9IGRhdGEuZ2V0SW50MzIoMTIsIHRydWUpIC8gKDEgPDwgMzApO1xyXG4gICAgY29uc3QgbWFnbml0dWRlID0gTWF0aC5zcXJ0KE1hdGgucG93KHcsIDIpICsgTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSArIE1hdGgucG93KHosIDIpKTtcclxuXHJcbiAgICBpZiAobWFnbml0dWRlICE9PSAwKSB7XHJcbiAgICAgIHcgLz0gbWFnbml0dWRlO1xyXG4gICAgICB4IC89IG1hZ25pdHVkZTtcclxuICAgICAgeSAvPSBtYWduaXR1ZGU7XHJcbiAgICAgIHogLz0gbWFnbml0dWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHc6IHcsXHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIHo6IHosXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBzdGVwIGNvdW50ZXIgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgc3RlcCBjb3VudGVyIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzdGVwRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fc3RlcE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5zdGVwQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX3N0ZXBOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgIGNvbnN0IGNvdW50ID0gZGF0YS5nZXRVaW50MzIoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRhLmdldFVpbnQzMig0LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgY291bnQ6IGNvdW50LFxyXG4gICAgICAgIHRpbWU6IHtcclxuICAgICAgICAgIHZhbHVlOiB0aW1lLFxyXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyByYXcgbW90aW9uIGRhdGEgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgcmF3IG1vdGlvbiBkYXRhIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBtb3Rpb25SYXdFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX21vdGlvblJhd05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5tb3Rpb25SYXdDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9tb3Rpb25SYXdOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjYgPSA2NCB0byBnZXQgYWNjZWxlcm9tZXRlciBjb3JyZWN0IHZhbHVlc1xyXG4gICAgY29uc3QgYWNjWCA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA2NDtcclxuICAgIGNvbnN0IGFjY1kgPSBkYXRhLmdldEludDE2KDIsIHRydWUpIC8gNjQ7XHJcbiAgICBjb25zdCBhY2NaID0gZGF0YS5nZXRJbnQxNig0LCB0cnVlKSAvIDY0O1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjExID0gMjA0OCB0byBnZXQgY29ycmVjdCBneXJvc2NvcGUgdmFsdWVzXHJcbiAgICBjb25zdCBneXJvWCA9IGRhdGEuZ2V0SW50MTYoNiwgdHJ1ZSkgLyAyMDQ4O1xyXG4gICAgY29uc3QgZ3lyb1kgPSBkYXRhLmdldEludDE2KDgsIHRydWUpIC8gMjA0ODtcclxuICAgIGNvbnN0IGd5cm9aID0gZGF0YS5nZXRJbnQxNigxMCwgdHJ1ZSkgLyAyMDQ4O1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjEyID0gNDA5NiB0byBnZXQgY29ycmVjdCBjb21wYXNzIHZhbHVlc1xyXG4gICAgY29uc3QgY29tcGFzc1ggPSBkYXRhLmdldEludDE2KDEyLCB0cnVlKSAvIDQwOTY7XHJcbiAgICBjb25zdCBjb21wYXNzWSA9IGRhdGEuZ2V0SW50MTYoMTQsIHRydWUpIC8gNDA5NjtcclxuICAgIGNvbnN0IGNvbXBhc3NaID0gZGF0YS5nZXRJbnQxNigxNiwgdHJ1ZSkgLyA0MDk2O1xyXG5cclxuICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgYWNjZWxlcm9tZXRlcjoge1xyXG4gICAgICAgICAgeDogYWNjWCxcclxuICAgICAgICAgIHk6IGFjY1ksXHJcbiAgICAgICAgICB6OiBhY2NaLFxyXG4gICAgICAgICAgdW5pdDogXCJHXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBneXJvc2NvcGU6IHtcclxuICAgICAgICAgIHg6IGd5cm9YLFxyXG4gICAgICAgICAgeTogZ3lyb1ksXHJcbiAgICAgICAgICB6OiBneXJvWixcclxuICAgICAgICAgIHVuaXQ6IFwiZGVnL3NcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBhc3M6IHtcclxuICAgICAgICAgIHg6IGNvbXBhc3NYLFxyXG4gICAgICAgICAgeTogY29tcGFzc1ksXHJcbiAgICAgICAgICB6OiBjb21wYXNzWixcclxuICAgICAgICAgIHVuaXQ6IFwibWljcm9UZXNsYVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBFdWxlciBhbmdsZSBkYXRhIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhbiBFdWxlciBhbmdsZSBkYXRhIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBldWxlckVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9ldWxlck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5ldWxlckNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfZXVsZXJOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSB0d28gYnl0ZXMgKDE8PDE2IG9yIDJeMTYgb3IgNjU1MzYpIHRvIGdldCBjb3JyZWN0IHZhbHVlXHJcbiAgICBjb25zdCByb2xsID0gZGF0YS5nZXRJbnQzMigwLCB0cnVlKSAvIDY1NTM2O1xyXG4gICAgY29uc3QgcGl0Y2ggPSBkYXRhLmdldEludDMyKDQsIHRydWUpIC8gNjU1MzY7XHJcbiAgICBjb25zdCB5YXcgPSBkYXRhLmdldEludDMyKDgsIHRydWUpIC8gNjU1MzY7XHJcblxyXG4gICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHJvbGw6IHJvbGwsXHJcbiAgICAgICAgcGl0Y2g6IHBpdGNoLFxyXG4gICAgICAgIHlhdzogeWF3LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgcm90YXRpb24gbWF0cml4IG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzdW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhbiByb3RhdGlvbiBtYXRyaXggb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHJvdGF0aW9uTWF0cml4RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3JvdGF0aW9uTWF0cml4Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeENoYXJhY3RlcmlzdGljLFxyXG4gICAgICBlbmFibGUsXHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1swXVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIF9yb3RhdGlvbk1hdHJpeE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5IDJeMiA9IDQgdG8gZ2V0IGNvcnJlY3QgdmFsdWVzXHJcbiAgICBjb25zdCByMWMxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMWMyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMWMzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMmMxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMmMyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByMmMzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByM2MxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByM2MyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcbiAgICBjb25zdCByM2MzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XHJcblxyXG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHJvdzE6IFtyMWMxLCByMWMyLCByMWMzXSxcclxuICAgICAgICByb3cyOiBbcjJjMSwgcjJjMiwgcjJjM10sXHJcbiAgICAgICAgcm93MzogW3IzYzEsIHIzYzIsIHIzYzNdLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgaGVhZGluZyBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBoZWFkaW5nIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBoZWFkaW5nRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5faGVhZGluZ05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5oZWFkaW5nQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2hlYWRpbmdOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjE2ID0gNjU1MzYgdG8gZ2V0IGNvcnJlY3QgaGVhZGluZyB2YWx1ZXNcclxuICAgIGNvbnN0IGhlYWRpbmcgPSBkYXRhLmdldEludDMyKDAsIHRydWUpIC8gNjU1MzY7XHJcblxyXG4gICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgdmFsdWU6IGhlYWRpbmcsXHJcbiAgICAgICAgdW5pdDogXCJkZWdyZWVzXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBncmF2aXR5IHZlY3RvciBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBoZWFkaW5nIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBncmF2aXR5VmVjdG9yRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fZ3Jhdml0eVZlY3Rvck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWMoXHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckNoYXJhY3RlcmlzdGljLFxyXG4gICAgICBlbmFibGUsXHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzBdXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgX2dyYXZpdHlWZWN0b3JOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgeCA9IGRhdGEuZ2V0RmxvYXQzMigwLCB0cnVlKTtcclxuICAgIGNvbnN0IHkgPSBkYXRhLmdldEZsb2F0MzIoNCwgdHJ1ZSk7XHJcbiAgICBjb25zdCB6ID0gZGF0YS5nZXRGbG9hdDMyKDgsIHRydWUpO1xyXG5cclxuICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHg6IHgsXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICB6OiB6LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gICoqKioqKiAgLy9cclxuXHJcbiAgLyogIFNvdW5kIHNlcnZpY2UgICovXHJcblxyXG4gIG1pY3JvcGhvbmVFbmFibGUoZW5hYmxlKSB7XHJcbiAgICAvLyBUYWJsZXMgb2YgY29uc3RhbnRzIG5lZWRlZCBmb3Igd2hlbiB3ZSBkZWNvZGUgdGhlIGFkcGNtLWVuY29kZWQgYXVkaW8gZnJvbSB0aGUgVGhpbmd5XHJcbiAgICBpZiAodGhpcy5fTUlDUk9QSE9ORV9JTkRFWF9UQUJMRSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX01JQ1JPUEhPTkVfSU5ERVhfVEFCTEUgPSBbLTEsIC0xLCAtMSwgLTEsIDIsIDQsIDYsIDgsIC0xLCAtMSwgLTEsIC0xLCAyLCA0LCA2LCA4XTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFID0gWzcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTYsIDE3LCAxOSwgMjEsIDIzLCAyNSwgMjgsIDMxLCAzNCwgMzcsIDQxLCA0NSwgNTAsIDU1LCA2MCwgNjYsIDczLCA4MCwgODgsIDk3LCAxMDcsIDExOCwgMTMwLCAxNDMsIDE1NywgMTczLCAxOTAsIDIwOSxcclxuICAgICAgICAyMzAsIDI1MywgMjc5LCAzMDcsIDMzNywgMzcxLCA0MDgsIDQ0OSwgNDk0LCA1NDQsIDU5OCwgNjU4LCA3MjQsIDc5NiwgODc2LCA5NjMsIDEwNjAsIDExNjYsIDEyODIsIDE0MTEsIDE1NTIsIDE3MDcsIDE4NzgsIDIwNjYsIDIyNzIsIDI0OTksIDI3NDksIDMwMjQsIDMzMjcsIDM2NjAsIDQwMjYsIDQ0MjgsIDQ4NzEsIDUzNTgsXHJcbiAgICAgICAgNTg5NCwgNjQ4NCwgNzEzMiwgNzg0NSwgODYzMCwgOTQ5MywgMTA0NDIsIDExNDg3LCAxMjYzNSwgMTM4OTksIDE1Mjg5LCAxNjgxOCwgMTg1MDAsIDIwMzUwLCAyMjM4NSwgMjQ2MjMsIDI3MDg2LCAyOTc5NCwgMzI3NjddO1xyXG4gICAgfVxyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLm1pY3JvcGhvbmVFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX21pY3JvcGhvbmVOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIC8vIGxhZ2VyIGVuIG55IGF1ZGlvIGNvbnRleHQsIHNrYWwgYmFyZSBoYSDDqW4gYXYgZGVubmVcclxuICAgICAgaWYgKHRoaXMuYXVkaW9DdHggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcclxuICAgICAgICB0aGlzLmF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5taWNyb3Bob25lQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5taWNyb3Bob25lRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuICBfbWljcm9waG9uZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGF1ZGlvUGFja2V0ID0gZXZlbnQudGFyZ2V0LnZhbHVlLmJ1ZmZlcjtcclxuICAgIGNvbnN0IGFkcGNtID0ge1xyXG4gICAgICBoZWFkZXI6IG5ldyBEYXRhVmlldyhhdWRpb1BhY2tldC5zbGljZSgwLCAzKSksXHJcbiAgICAgIGRhdGE6IG5ldyBEYXRhVmlldyhhdWRpb1BhY2tldC5zbGljZSgzKSksXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZGVjb2RlZEF1ZGlvID0gdGhpcy5fZGVjb2RlQXVkaW8oYWRwY20pO1xyXG4gICAgdGhpcy5fcGxheURlY29kZWRBdWRpbyhkZWNvZGVkQXVkaW8pO1xyXG4gIH1cclxuICAvKiAgU291bmQgc2VydmljZSAgKi9cclxuICBfZGVjb2RlQXVkaW8oYWRwY20pIHtcclxuICAgIC8vIEFsbG9jYXRlIG91dHB1dCBidWZmZXJcclxuICAgIGNvbnN0IGF1ZGlvQnVmZmVyRGF0YUxlbmd0aCA9IGFkcGNtLmRhdGEuYnl0ZUxlbmd0aDtcclxuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDUxMik7XHJcbiAgICBjb25zdCBwY20gPSBuZXcgRGF0YVZpZXcoYXVkaW9CdWZmZXIpO1xyXG4gICAgbGV0IGRpZmY7XHJcbiAgICBsZXQgYnVmZmVyU3RlcCA9IGZhbHNlO1xyXG4gICAgbGV0IGlucHV0QnVmZmVyID0gMDtcclxuICAgIGxldCBkZWx0YSA9IDA7XHJcbiAgICBsZXQgc2lnbiA9IDA7XHJcbiAgICBsZXQgc3RlcDtcclxuXHJcbiAgICAvLyBUaGUgZmlyc3QgMiBieXRlcyBvZiBBRFBDTSBmcmFtZSBhcmUgdGhlIHByZWRpY3RlZCB2YWx1ZVxyXG4gICAgbGV0IHZhbHVlUHJlZGljdGVkID0gYWRwY20uaGVhZGVyLmdldEludDE2KDAsIGZhbHNlKTtcclxuICAgIC8vIFRoZSAzcmQgYnl0ZSBpcyB0aGUgaW5kZXggdmFsdWVcclxuICAgIGxldCBpbmRleCA9IGFkcGNtLmhlYWRlci5nZXRJbnQ4KDIpO1xyXG4gICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICBpbmRleCA9IDA7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggPiA4OCkge1xyXG4gICAgICBpbmRleCA9IDg4O1xyXG4gICAgfVxyXG4gICAgc3RlcCA9IHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFW2luZGV4XTtcclxuICAgIGZvciAobGV0IF9pbiA9IDAsIF9vdXQgPSAwOyBfaW4gPCBhdWRpb0J1ZmZlckRhdGFMZW5ndGg7IF9vdXQgKz0gMikge1xyXG4gICAgICAvKiBTdGVwIDEgLSBnZXQgdGhlIGRlbHRhIHZhbHVlICovXHJcbiAgICAgIGlmIChidWZmZXJTdGVwKSB7XHJcbiAgICAgICAgZGVsdGEgPSBpbnB1dEJ1ZmZlciAmIDB4MEY7XHJcbiAgICAgICAgX2luKys7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5wdXRCdWZmZXIgPSBhZHBjbS5kYXRhLmdldEludDgoX2luKTtcclxuICAgICAgICBkZWx0YSA9IChpbnB1dEJ1ZmZlciA+PiA0KSAmIDB4MEY7XHJcbiAgICAgIH1cclxuICAgICAgYnVmZmVyU3RlcCA9ICFidWZmZXJTdGVwO1xyXG4gICAgICAvKiBTdGVwIDIgLSBGaW5kIG5ldyBpbmRleCB2YWx1ZSAoZm9yIGxhdGVyKSAqL1xyXG4gICAgICBpbmRleCArPSB0aGlzLl9NSUNST1BIT05FX0lOREVYX1RBQkxFW2RlbHRhXTtcclxuICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaW5kZXggPiA4OCkge1xyXG4gICAgICAgIGluZGV4ID0gODg7XHJcbiAgICAgIH1cclxuICAgICAgLyogU3RlcCAzIC0gU2VwYXJhdGUgc2lnbiBhbmQgbWFnbml0dWRlICovXHJcbiAgICAgIHNpZ24gPSBkZWx0YSAmIDg7XHJcbiAgICAgIGRlbHRhID0gZGVsdGEgJiA3O1xyXG4gICAgICAvKiBTdGVwIDQgLSBDb21wdXRlIGRpZmZlcmVuY2UgYW5kIG5ldyBwcmVkaWN0ZWQgdmFsdWUgKi9cclxuICAgICAgZGlmZiA9IChzdGVwID4+IDMpO1xyXG4gICAgICBpZiAoKGRlbHRhICYgNCkgPiAwKSB7XHJcbiAgICAgICAgZGlmZiArPSBzdGVwO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgoZGVsdGEgJiAyKSA+IDApIHtcclxuICAgICAgICBkaWZmICs9IChzdGVwID4+IDEpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgoZGVsdGEgJiAxKSA+IDApIHtcclxuICAgICAgICBkaWZmICs9IChzdGVwID4+IDIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzaWduID4gMCkge1xyXG4gICAgICAgIHZhbHVlUHJlZGljdGVkIC09IGRpZmY7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgKz0gZGlmZjtcclxuICAgICAgfVxyXG4gICAgICAvKiBTdGVwIDUgLSBjbGFtcCBvdXRwdXQgdmFsdWUgKi9cclxuICAgICAgaWYgKHZhbHVlUHJlZGljdGVkID4gMzI3NjcpIHtcclxuICAgICAgICB2YWx1ZVByZWRpY3RlZCA9IDMyNzY3O1xyXG4gICAgICB9IGVsc2UgaWYgKHZhbHVlUHJlZGljdGVkIDwgLTMyNzY4KSB7XHJcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgPSAtMzI3Njg7XHJcbiAgICAgIH1cclxuICAgICAgLyogU3RlcCA2IC0gVXBkYXRlIHN0ZXAgdmFsdWUgKi9cclxuICAgICAgc3RlcCA9IHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFW2luZGV4XTtcclxuICAgICAgLyogU3RlcCA3IC0gT3V0cHV0IHZhbHVlICovXHJcbiAgICAgIHBjbS5zZXRJbnQxNihfb3V0LCB2YWx1ZVByZWRpY3RlZCwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGNtO1xyXG4gIH1cclxuICBfcGxheURlY29kZWRBdWRpbyhhdWRpbykge1xyXG4gICAgaWYgKHRoaXMuX2F1ZGlvU3RhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9hdWRpb1N0YWNrID0gW107XHJcbiAgICB9XHJcbiAgICB0aGlzLl9hdWRpb1N0YWNrLnB1c2goYXVkaW8pO1xyXG4gICAgaWYgKHRoaXMuX2F1ZGlvU3RhY2subGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuX3NjaGVkdWxlQXVkaW9CdWZmZXJzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIF9zY2hlZHVsZUF1ZGlvQnVmZmVycygpIHtcclxuICAgIHdoaWxlICh0aGlzLl9hdWRpb1N0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgYnVmZmVyVGltZSA9IDAuMDE7IC8vIEJ1ZmZlciB0aW1lIGluIHNlY29uZHMgYmVmb3JlIGluaXRpYWwgYXVkaW8gY2h1bmsgaXMgcGxheWVkXHJcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX2F1ZGlvU3RhY2suc2hpZnQoKTtcclxuICAgICAgY29uc3QgY2hhbm5lbHMgPSAxO1xyXG4gICAgICBjb25zdCBmcmFtZWNvdW50ID0gYnVmZmVyLmJ5dGVMZW5ndGggLyAyO1xyXG4gICAgICBpZiAodGhpcy5fYXVkaW9OZXh0VGltZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgbXlBcnJheUJ1ZmZlciA9IHRoaXMuYXVkaW9DdHguY3JlYXRlQnVmZmVyKGNoYW5uZWxzLCBmcmFtZWNvdW50LCAxNjAwMCk7XHJcbiAgICAgIC8vIFRoaXMgZ2l2ZXMgdXMgdGhlIGFjdHVhbCBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhXHJcbiAgICAgIGNvbnN0IG5vd0J1ZmZlcmluZyA9IG15QXJyYXlCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyLmJ5dGVMZW5ndGggLyAyOyBpKyspIHtcclxuICAgICAgICBub3dCdWZmZXJpbmdbaV0gPSBidWZmZXIuZ2V0SW50MTYoMiAqIGksIHRydWUpIC8gMzI3NjguMDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICBzb3VyY2UuYnVmZmVyID0gbXlBcnJheUJ1ZmZlcjtcclxuICAgICAgc291cmNlLmNvbm5lY3QodGhpcy5hdWRpb0N0eC5kZXN0aW5hdGlvbik7XHJcbiAgICAgIGlmICh0aGlzLl9hdWRpb05leHRUaW1lID09PSAwKSB7XHJcbiAgICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSA9IHRoaXMuYXVkaW9DdHguY3VycmVudFRpbWUgKyBidWZmZXJUaW1lO1xyXG4gICAgICB9XHJcbiAgICAgIHNvdXJjZS5zdGFydCh0aGlzLl9hdWRpb05leHRUaW1lKTtcclxuICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSArPSBzb3VyY2UuYnVmZmVyLmR1cmF0aW9uO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyAgKioqKioqICAvL1xyXG5cclxuICAvKiAgQmF0dGVyeSBzZXJ2aWNlICAqL1xyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBiYXR0ZXJ5IGxldmVsIG9mIFRoaW5neS5cclxuICAgKlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdCB8IEVycm9yPn0gUmV0dXJucyBiYXR0ZXJ5IGxldmVsIGluIHBlcmNlbnRhZ2Ugd2hlbiBwcm9taXNlIGlzIHJlc29sdmVkIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0QmF0dGVyeUxldmVsKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5iYXR0ZXJ5Q2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBsZXZlbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgwKTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsdWU6IGxldmVsLFxyXG4gICAgICAgIHVuaXQ6IFwiJVwiLFxyXG4gICAgICB9O1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgYmF0dGVyeSBsZXZlbCBub3RpZmljYXRpb25zLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gYmF0dGVyeSBsZXZlbCBjaGFuZ2UuIFdpbGwgcmVjZWl2ZSBhIGJhdHRlcnkgbGV2ZWwgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAgICovXHJcbiAgYXN5bmMgYmF0dGVyeUxldmVsRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9iYXR0ZXJ5TGV2ZWxOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuYmF0dGVyeUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2JhdHRlcnlMZXZlbE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGRhdGEuZ2V0VWludDgoMCk7XHJcblxyXG4gICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgdW5pdDogXCIlXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyAgKioqKioqICAvL1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQge1BhcnRUaGVtZU1peGlufSBmcm9tICcuL2xpYnMvcGFydC10aGVtZS5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFydFRoZW1lRWxlbWVudCBleHRlbmRzIFBhcnRUaGVtZU1peGluKEhUTUxFbGVtZW50KSB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYGA7XHJcbiAgICB9XHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgaWYgKCF0aGlzLnNoYWRvd1Jvb3QpIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuY29uc3RydWN0b3IudGVtcGxhdGU7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSk7XHJcbiAgICAgICAgICBjb25zdCBkb20gPSBkb2N1bWVudC5pbXBvcnROb2RlKFxyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoZG9tKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5leHBvcnQgY2xhc3MgWFRodW1icyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cclxuICAgICAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi1kb3duXCI+8J+RjjwvZGl2PlxyXG4gICAgICBgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXRodW1icycsIFhUaHVtYnMpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFhSYXRpbmcgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAgOmhvc3Qge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXRodW1iczo6cGFydCh0aHVtYi11cCkge1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBkb3R0ZWQgZ3JlZW47XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXRodW1iczo6cGFydCh0aHVtYi1kb3duKSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCByZWQ7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICA8ZGl2IHBhcnQ9XCJzdWJqZWN0XCI+PHNsb3Q+PC9zbG90PjwvZGl2PlxyXG4gICAgICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1yYXRpbmcnLCBYUmF0aW5nKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBYSG9zdCBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgICA6aG9zdCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCBvcmFuZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZyB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogNHB4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmc6OnBhcnQoc3ViamVjdCkge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmcge1xyXG4gICAgICAgICAgICAtLWUxLXBhcnQtc3ViamVjdC1wYWRkaW5nOiA0cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAudW5vOmhvdmVyOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGlnaHRncmVlbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC5kdW86OnBhcnQoc3ViamVjdCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBnb2xkZW5yb2Q7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAudW5vOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBncmVlbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdG9tYXRvO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLmR1bzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogeWVsbG93O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLmR1bzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBibGFjaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nOjp0aGVtZSh0aHVtYi11cCkge1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIDwvc3R5bGU+XHJcbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwidW5vXCI+4p2k77iPPC94LXJhdGluZz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwiZHVvXCI+8J+ktzwveC1yYXRpbmc+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1ob3N0JywgWEhvc3QpOyIsIi8qXHJcbkBsaWNlbnNlXHJcbkNvcHlyaWdodCAoYykgMjAxNyBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcclxuVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcclxuVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XHJcbkNvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXHJcbnN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XHJcbiovXHJcblxyXG5jb25zdCBwYXJ0RGF0YUtleSA9ICdfX2Nzc1BhcnRzJztcclxuY29uc3QgcGFydElkS2V5ID0gJ19fcGFydElkJztcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhbnkgc3R5bGUgZWxlbWVudHMgaW4gdGhlIHNoYWRvd1Jvb3QgdG8gcmVwbGFjZSA6OnBhcnQvOjp0aGVtZVxyXG4gKiB3aXRoIGN1c3RvbSBwcm9wZXJ0aWVzIHVzZWQgdG8gdHJhbnNtaXQgdGhpcyBkYXRhIGRvd24gdGhlIGRvbSB0cmVlLiBBbHNvXHJcbiAqIGNhY2hlcyBwYXJ0IG1ldGFkYXRhIGZvciBsYXRlciBsb29rdXAuXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVQYXJ0cyhlbGVtZW50KSB7XHJcbiAgaWYgKCFlbGVtZW50LnNoYWRvd1Jvb3QpIHtcclxuICAgIGVsZW1lbnRbcGFydERhdGFLZXldID0gbnVsbDtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgQXJyYXkuZnJvbShlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSkuZm9yRWFjaChzdHlsZSA9PiB7XHJcbiAgICBjb25zdCBpbmZvID0gcGFydENzc1RvQ3VzdG9tUHJvcENzcyhlbGVtZW50LCBzdHlsZS50ZXh0Q29udGVudCk7XHJcbiAgICBpZiAoaW5mby5wYXJ0cykge1xyXG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IGVsZW1lbnRbcGFydERhdGFLZXldIHx8IFtdO1xyXG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XS5wdXNoKC4uLmluZm8ucGFydHMpO1xyXG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9IGluZm8uY3NzO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpIHtcclxuICBpZiAoIWVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ19fY3NzUGFydHMnKSkge1xyXG4gICAgaW5pdGlhbGl6ZVBhcnRzKGVsZW1lbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFydERhdGFGb3JFbGVtZW50KGVsZW1lbnQpIHtcclxuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcclxuICByZXR1cm4gZWxlbWVudFtwYXJ0RGF0YUtleV07XHJcbn1cclxuXHJcbi8vIFRPRE8oc29ydmVsbCk6IGJyaXR0bGUgZHVlIHRvIHJlZ2V4LWluZyBjc3MuIEluc3RlYWQgdXNlIGEgY3NzIHBhcnNlci5cclxuLyoqXHJcbiAqIFR1cm5zIGNzcyB1c2luZyBgOjpwYXJ0YCBpbnRvIGNzcyB1c2luZyB2YXJpYWJsZXMgZm9yIHRob3NlIHBhcnRzLlxyXG4gKiBBbHNvIHJldHVybnMgcGFydCBtZXRhZGF0YS5cclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjc3NUZXh0XHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IGNzczogcGFydGlmaWVkIGNzcywgcGFydHM6IGFycmF5IG9mIHBhcnRzIG9mIHRoZSBmb3JtXHJcbiAqIHtuYW1lLCBzZWxlY3RvciwgcHJvcHN9XHJcbiAqIEV4YW1wbGUgb2YgcGFydC1pZmllZCBjc3MsIGdpdmVuOlxyXG4gKiAuZm9vOjpwYXJ0KGJhcikgeyBjb2xvcjogcmVkIH1cclxuICogb3V0cHV0OlxyXG4gKiAuZm9vIHsgLS1lMS1wYXJ0LWJhci1jb2xvcjogcmVkOyB9XHJcbiAqIHdoZXJlIGBlMWAgaXMgYSBndWlkIGZvciB0aGlzIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJ0Q3NzVG9DdXN0b21Qcm9wQ3NzKGVsZW1lbnQsIGNzc1RleHQpIHtcclxuICBsZXQgcGFydHM7XHJcbiAgbGV0IGNzcyA9IGNzc1RleHQucmVwbGFjZShjc3NSZSwgKG0sIHNlbGVjdG9yLCB0eXBlLCBuYW1lLCBlbmRTZWxlY3RvciwgcHJvcHNTdHIpID0+IHtcclxuICAgIHBhcnRzID0gcGFydHMgfHwgW107XHJcbiAgICBsZXQgcHJvcHMgPSB7fTtcclxuICAgIGNvbnN0IHByb3BzQXJyYXkgPSBwcm9wc1N0ci5zcGxpdCgvXFxzKjtcXHMqLyk7XHJcbiAgICBwcm9wc0FycmF5LmZvckVhY2gocHJvcCA9PiB7XHJcbiAgICAgIGNvbnN0IHMgPSBwcm9wLnNwbGl0KCc6Jyk7XHJcbiAgICAgIGNvbnN0IG5hbWUgPSBzLnNoaWZ0KCkudHJpbSgpO1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IHMuam9pbignOicpO1xyXG4gICAgICBwcm9wc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICBwYXJ0cy5wdXNoKHtzZWxlY3RvciwgZW5kU2VsZWN0b3IsIG5hbWUsIHByb3BzLCBpc1RoZW1lOiB0eXBlID09IHRoZW1lfSk7XHJcbiAgICBsZXQgcGFydFByb3BzID0gJyc7XHJcbiAgICBmb3IgKGxldCBwIGluIHByb3BzKSB7XHJcbiAgICAgIHBhcnRQcm9wcyA9IGAke3BhcnRQcm9wc31cXG5cXHQke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIGVuZFNlbGVjdG9yKX06ICR7cHJvcHNbcF19O2A7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYFxcbiR7c2VsZWN0b3IgfHwgJyonfSB7XFxuXFx0JHtwYXJ0UHJvcHMudHJpbSgpfVxcbn1gO1xyXG4gIH0pO1xyXG4gIHJldHVybiB7cGFydHMsIGNzc307XHJcbn1cclxuXHJcbi8vIGd1aWQgZm9yIGVsZW1lbnQgcGFydCBzY29wZXNcclxubGV0IHBhcnRJZCA9IDA7XHJcbmZ1bmN0aW9uIHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCkge1xyXG4gIGlmIChlbGVtZW50W3BhcnRJZEtleV0gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBlbGVtZW50W3BhcnRJZEtleV0gPSBwYXJ0SWQrKztcclxuICB9XHJcbiAgcmV0dXJuIGVsZW1lbnRbcGFydElkS2V5XTtcclxufVxyXG5cclxuY29uc3QgdGhlbWUgPSAnOjp0aGVtZSc7XHJcbmNvbnN0IGNzc1JlID0gL1xccyooLiopKDo6KD86cGFydHx0aGVtZSkpXFwoKFteKV0rKVxcKShbXlxcc3tdKilcXHMqe1xccyooW159XSopXFxzKn0vZ1xyXG5cclxuLy8gY3JlYXRlcyBhIGN1c3RvbSBwcm9wZXJ0eSBuYW1lIGZvciBhIHBhcnQuXHJcbmZ1bmN0aW9uIHZhckZvclBhcnQoaWQsIG5hbWUsIHByb3AsIGVuZFNlbGVjdG9yKSB7XHJcbiAgcmV0dXJuIGAtLWUke2lkfS1wYXJ0LSR7bmFtZX0tJHtwcm9wfSR7ZW5kU2VsZWN0b3IgPyBgLSR7ZW5kU2VsZWN0b3IucmVwbGFjZSgvXFw6L2csICcnKX1gIDogJyd9YDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFByb2R1Y2VzIGEgc3R5bGUgdXNpbmcgY3NzIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIHN0eWxlIDo6cGFydC86OnRoZW1lXHJcbiAqIGZvciBhbGwgdGhlIGRvbSBpbiB0aGUgZWxlbWVudCdzIHNoYWRvd1Jvb3QuXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGFydFRoZW1lKGVsZW1lbnQpIHtcclxuICBpZiAoZWxlbWVudC5zaGFkb3dSb290KSB7XHJcbiAgICBjb25zdCBvbGRTdHlsZSA9IGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdHlsZVtwYXJ0c10nKTtcclxuICAgIGlmIChvbGRTdHlsZSkge1xyXG4gICAgICBvbGRTdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZFN0eWxlKTtcclxuICAgIH1cclxuICB9XHJcbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xyXG4gIGlmIChob3N0KSB7XHJcbiAgICAvLyBub3RlOiBlbnN1cmUgaG9zdCBoYXMgcGFydCBkYXRhIHNvIHRoYXQgZWxlbWVudHMgdGhhdCBib290IHVwXHJcbiAgICAvLyB3aGlsZSB0aGUgaG9zdCBpcyBiZWluZyBjb25uZWN0ZWQgY2FuIHN0eWxlIHBhcnRzLlxyXG4gICAgZW5zdXJlUGFydERhdGEoaG9zdCk7XHJcbiAgICBjb25zdCBjc3MgPSBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpO1xyXG4gICAgaWYgKGNzcykge1xyXG4gICAgICBjb25zdCBuZXdTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICAgIG5ld1N0eWxlLnRleHRDb250ZW50ID0gY3NzO1xyXG4gICAgICBlbGVtZW50LnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQobmV3U3R5bGUpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFByb2R1Y2VzIGNzc1RleHQgYSBzdHlsZSBlbGVtZW50IHRvIGFwcGx5IHBhcnQgY3NzIHRvIGEgZ2l2ZW4gZWxlbWVudC5cclxuICogVGhlIGVsZW1lbnQncyBzaGFkb3dSb290IGRvbSBpcyBzY2FubmVkIGZvciBub2RlcyB3aXRoIGEgYHBhcnRgIGF0dHJpYnV0ZS5cclxuICogVGhlbiBzZWxlY3RvcnMgYXJlIGNyZWF0ZWQgbWF0Y2hpbmcgdGhlIHBhcnQgYXR0cmlidXRlIGNvbnRhaW5pbmcgcHJvcGVydGllc1xyXG4gKiB3aXRoIHBhcnRzIGRlZmluZWQgaW4gdGhlIGVsZW1lbnQncyBob3N0LlxyXG4gKiBUaGUgYW5jZXN0b3IgdHJlZSBpcyB0cmF2ZXJzZWQgZm9yIGZvcndhcmRlZCBwYXJ0cyBhbmQgdGhlbWUuXHJcbiAqIGUuZy5cclxuICogW3BhcnQ9XCJiYXJcIl0ge1xyXG4gKiAgIGNvbG9yOiB2YXIoLS1lMS1wYXJ0LWJhci1jb2xvcik7XHJcbiAqIH1cclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgZm9yIHdoaWNoIHRvIGFwcGx5IHBhcnQgY3NzXHJcbiAqL1xyXG5mdW5jdGlvbiBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpIHtcclxuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcclxuICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgY29uc3QgcGFydE5vZGVzID0gZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1twYXJ0XScpO1xyXG4gIGxldCBjc3MgPSAnJztcclxuICBmb3IgKGxldCBpPTA7IGkgPCBwYXJ0Tm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGF0dHIgPSBwYXJ0Tm9kZXNbaV0uZ2V0QXR0cmlidXRlKCdwYXJ0Jyk7XHJcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoYXR0cik7XHJcbiAgICBjc3MgPSBgJHtjc3N9XFxuXFx0JHtydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpfWBcclxuICB9XHJcbiAgcmV0dXJuIGNzcztcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBjc3MgcnVsZSB0aGF0IGFwcGxpZXMgYSBwYXJ0LlxyXG4gKiBAcGFyYW0geyp9IHBhcnRJbmZvIEFycmF5IG9mIHBhcnQgaW5mbyBmcm9tIHBhcnQgYXR0cmlidXRlXHJcbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0geyp9IGVsZW1lbnQgRWxlbWVudCB3aXRoaW4gd2hpY2ggdGhlIHBhcnQgZXhpc3RzXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRleHQgb2YgdGhlIGNzcyBydWxlIG9mIHRoZSBmb3JtIGBzZWxlY3RvciB7IHByb3BlcnRpZXMgfWBcclxuICovXHJcbmZ1bmN0aW9uIHJ1bGVGb3JQYXJ0SW5mbyhwYXJ0SW5mbywgYXR0ciwgZWxlbWVudCkge1xyXG4gIGxldCB0ZXh0ID0gJyc7XHJcbiAgcGFydEluZm8uZm9yRWFjaChpbmZvID0+IHtcclxuICAgIGlmICghaW5mby5mb3J3YXJkKSB7XHJcbiAgICAgIGNvbnN0IHByb3BzID0gcHJvcHNGb3JQYXJ0KGluZm8ubmFtZSwgZWxlbWVudCk7XHJcbiAgICAgIGlmIChwcm9wcykge1xyXG4gICAgICAgIGZvciAobGV0IGJ1Y2tldCBpbiBwcm9wcykge1xyXG4gICAgICAgICAgbGV0IHByb3BzQnVja2V0ID0gcHJvcHNbYnVja2V0XTtcclxuICAgICAgICAgIGxldCBwYXJ0UHJvcHMgPSBbXTtcclxuICAgICAgICAgIGZvciAobGV0IHAgaW4gcHJvcHNCdWNrZXQpIHtcclxuICAgICAgICAgICAgcGFydFByb3BzLnB1c2goYCR7cH06ICR7cHJvcHNCdWNrZXRbcF19O2ApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGV4dCA9IGAke3RleHR9XFxuW3BhcnQ9XCIke2F0dHJ9XCJdJHtidWNrZXR9IHtcXG5cXHQke3BhcnRQcm9wcy5qb2luKCdcXG5cXHQnKX1cXG59YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gdGV4dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcnNlcyBhIHBhcnQgYXR0cmlidXRlIGludG8gYW4gYXJyYXkgb2YgcGFydCBpbmZvXHJcbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7YXJyYXl9IEFycmF5IG9mIHBhcnQgaW5mbyBvYmplY3RzIG9mIHRoZSBmb3JtIHtuYW1lLCBmb3dhcmR9XHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJ0SW5mb0Zyb21BdHRyKGF0dHIpIHtcclxuICBjb25zdCBwaWVjZXMgPSBhdHRyID8gYXR0ci5zcGxpdCgvXFxzKixcXHMqLykgOiBbXTtcclxuICBsZXQgcGFydHMgPSBbXTtcclxuICBwaWVjZXMuZm9yRWFjaChwID0+IHtcclxuICAgIGNvbnN0IG0gPSBwID8gcC5tYXRjaCgvKFtePVxcc10qKSg/Olxccyo9PlxccyooLiopKT8vKSA6IFtdO1xyXG4gICAgaWYgKG0pIHtcclxuICAgICAgcGFydHMucHVzaCh7bmFtZTogbVsyXSB8fCBtWzFdLCBmb3J3YXJkOiBtWzJdID8gbVsxXSA6IG51bGx9KTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gcGFydHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGb3IgYSBnaXZlbiBwYXJ0IG5hbWUgcmV0dXJucyBhIHByb3BlcnRpZXMgb2JqZWN0IHdoaWNoIHNldHMgYW55IGFuY2VzdG9yXHJcbiAqIHByb3ZpZGVkIHBhcnQgcHJvcGVydGllcyB0byB0aGUgcHJvcGVyIGFuY2VzdG9yIHByb3ZpZGVkIGNzcyB2YXJpYWJsZSBuYW1lLlxyXG4gKiBlLmcuXHJcbiAqIGNvbG9yOiBgdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO2BcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGhpbiB3aGljaCBkb20gd2l0aCBwYXJ0IGV4aXN0c1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIG9ubHkgOjp0aGVtZSBzaG91bGQgYmUgY29sbGVjdGVkLlxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgb2YgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHBhcnQgc2V0IHRvIHBhcnQgdmFyaWFibGVzXHJcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50cyBhbmNlc3RvcnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm9wc0ZvclBhcnQobmFtZSwgZWxlbWVudCwgcmVxdWlyZVRoZW1lKSB7XHJcbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQgJiYgZWxlbWVudC5nZXRSb290Tm9kZSgpLmhvc3Q7XHJcbiAgaWYgKCFob3N0KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGNvbGxlY3QgcHJvcHMgZnJvbSBob3N0IGVsZW1lbnQuXHJcbiAgbGV0IHByb3BzID0gcHJvcHNGcm9tRWxlbWVudChuYW1lLCBob3N0LCByZXF1aXJlVGhlbWUpO1xyXG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kIG1hdGNoaW5nIGB0aGVtZWAgcHJvcGVydGllc1xyXG4gIGNvbnN0IHRoZW1lUHJvcHMgPSBwcm9wc0ZvclBhcnQobmFtZSwgaG9zdCwgdHJ1ZSk7XHJcbiAgcHJvcHMgPSBtaXhQYXJ0UHJvcHMocHJvcHMsIHRoZW1lUHJvcHMpO1xyXG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kICpmb3J3YXJkZWQqIHBhcnQgcHJvcGVydGllc1xyXG4gIGlmICghcmVxdWlyZVRoZW1lKSB7XHJcbiAgICAvLyBmb3J3YXJkaW5nOiByZWN1cnNlcyB1cCBhbmNlc3RvciB0cmVlIVxyXG4gICAgY29uc3QgcGFydEluZm8gPSBwYXJ0SW5mb0Zyb21BdHRyKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdwYXJ0JykpO1xyXG4gICAgLy8ge25hbWUsIGZvcndhcmR9IHdoZXJlIGAqYCBjYW4gYmUgaW5jbHVkZWRcclxuICAgIHBhcnRJbmZvLmZvckVhY2goaW5mbyA9PiB7XHJcbiAgICAgIGxldCBjYXRjaEFsbCA9IGluZm8uZm9yd2FyZCAmJiAoaW5mby5mb3J3YXJkLmluZGV4T2YoJyonKSA+PSAwKTtcclxuICAgICAgaWYgKG5hbWUgPT0gaW5mby5mb3J3YXJkIHx8IGNhdGNoQWxsKSB7XHJcbiAgICAgICAgY29uc3QgYW5jZXN0b3JOYW1lID0gY2F0Y2hBbGwgPyBpbmZvLm5hbWUucmVwbGFjZSgnKicsIG5hbWUpIDogaW5mby5uYW1lO1xyXG4gICAgICAgIGNvbnN0IGZvcndhcmRlZCA9IHByb3BzRm9yUGFydChhbmNlc3Rvck5hbWUsIGhvc3QpO1xyXG4gICAgICAgIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCBmb3J3YXJkZWQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwcm9wcztcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbGxlY3RzIGNzcyBmb3IgdGhlIGdpdmVuIG5hbWUgZnJvbSB0aGUgcGFydCBkYXRhIGZvciB0aGUgZ2l2ZW5cclxuICogZWxlbWVudC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGggcGFydCBjc3MvZGF0YS5cclxuICogQHBhcmFtIHtCb29sZWFufSByZXF1aXJlVGhlbWUgVHJ1ZSBpZiBzaG91bGQgb25seSBtYXRjaCA6OnRoZW1lXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiBwcm9wZXJ0aWVzIGZvciB0aGUgZ2l2ZW4gcGFydCBzZXQgdG8gcGFydCB2YXJpYWJsZXNcclxuICogcHJvdmlkZWQgYnkgdGhlIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm9wc0Zyb21FbGVtZW50KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xyXG4gIGxldCBwcm9wcztcclxuICBjb25zdCBwYXJ0cyA9IHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KTtcclxuICBpZiAocGFydHMpIHtcclxuICAgIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcclxuICAgIGlmIChwYXJ0cykge1xyXG4gICAgICBwYXJ0cy5mb3JFYWNoKChwYXJ0KSA9PiB7XHJcbiAgICAgICAgaWYgKHBhcnQubmFtZSA9PSBuYW1lICYmICghcmVxdWlyZVRoZW1lIHx8IHBhcnQuaXNUaGVtZSkpIHtcclxuICAgICAgICAgIHByb3BzID0gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHByb3BzO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIHBhcnQgY3NzIHRvIHRoZSBwcm9wcyBvYmplY3QgZm9yIHRoZSBnaXZlbiBwYXJ0L25hbWUuXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBPYmplY3QgY29udGFpbmluZyBwYXJ0IGNzc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gcGFydCBQYXJ0IGRhdGFcclxuICogQHBhcmFtIHtubWJlcn0gaWQgZWxlbWVudCBwYXJ0IGlkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgcGFydFxyXG4gKi9cclxuZnVuY3Rpb24gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSkge1xyXG4gIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgY29uc3QgYnVja2V0ID0gcGFydC5lbmRTZWxlY3RvciB8fCAnJztcclxuICBjb25zdCBiID0gcHJvcHNbYnVja2V0XSA9IHByb3BzW2J1Y2tldF0gfHwge307XHJcbiAgZm9yIChsZXQgcCBpbiBwYXJ0LnByb3BzKSB7XHJcbiAgICBiW3BdID0gYHZhcigke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIHBhcnQuZW5kU2VsZWN0b3IpfSlgO1xyXG4gIH1cclxuICByZXR1cm4gcHJvcHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1peFBhcnRQcm9wcyhhLCBiKSB7XHJcbiAgaWYgKGEgJiYgYikge1xyXG4gICAgZm9yIChsZXQgaSBpbiBiKSB7XHJcbiAgICAgIC8vIGVuc3VyZSBzdG9yYWdlIGV4aXN0c1xyXG4gICAgICBpZiAoIWFbaV0pIHtcclxuICAgICAgICBhW2ldID0ge307XHJcbiAgICAgIH1cclxuICAgICAgT2JqZWN0LmFzc2lnbihhW2ldLCBiW2ldKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGEgfHwgYjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEN1c3RvbUVsZW1lbnQgbWl4aW4gdGhhdCBjYW4gYmUgYXBwbGllZCB0byBwcm92aWRlIDo6cGFydC86OnRoZW1lIHN1cHBvcnQuXHJcbiAqIEBwYXJhbSB7Kn0gc3VwZXJDbGFzc1xyXG4gKi9cclxuZXhwb3J0IGxldCBQYXJ0VGhlbWVNaXhpbiA9IHN1cGVyQ2xhc3MgPT4ge1xyXG5cclxuICByZXR1cm4gY2xhc3MgUGFydFRoZW1lQ2xhc3MgZXh0ZW5kcyBzdXBlckNsYXNzIHtcclxuXHJcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgICAgaWYgKHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKSB7XHJcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgICAgfVxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5fYXBwbHlQYXJ0VGhlbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2FwcGx5UGFydFRoZW1lKCkge1xyXG4gICAgICBhcHBseVBhcnRUaGVtZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gaW1wb3J0IHsgTWFza0hpZ2hsaWdodGVyIH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL21hc2staGlnaGxpZ2h0ZXIvbWFzay1oaWdobGlnaHRlci5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBIaWdobGlnaHRFdmVudHNcclxufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50LmpzJztcclxuaW1wb3J0IHtcclxuICAgIERlbW9zXHJcbn0gZnJvbSAnLi9kZW1vcy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBYSG9zdCxcclxuICAgIFhSYXRpbmcsXHJcbiAgICBYVGh1bWJzXHJcbn0gZnJvbSAnLi9wYXJ0VGhlbWUvY29tcG9uZW50cy1zYW1wbGUuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgQ29udHJvbFByZXpcclxufSBmcm9tICcuL2NvbnRyb2xQcmV6LmpzJztcclxuaW1wb3J0IHtcclxuICAgIFR5cGVUZXh0XHJcbn0gZnJvbSAnLi90eXBlZFRleHQuanMnXHJcblxyXG5cclxuXHJcbihhc3luYyBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG5cclxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XHJcblxyXG5cclxuICAgICAgICAvLyBuZXcgVHlwZVRleHQoKTtcclxuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XHJcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xyXG4gICAgICAgICAgICAvLyBuZXcgSGlnaGxpZ2h0RXZlbnRzKCk7XHJcbiAgICAgICAgICAgIC8vIG5ldyBDb250cm9sUHJleigpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRlLWhvdWRpbmktd29ya2Zsb3cnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxCYWNrRnJhZ21lbnQoKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC12aWRlby1tYWdpYycsICgpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hZ2ljVmlkZW8nKS5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL21hZ2ljLmdpZic7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC12aWRlby1zZW5zb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5zb3JWaWRlbycpLnNyYyA9ICcuL2Fzc2V0cy9pbWFnZXMvZ2VuZXJpYy1zZW5zb3ItYXBpLmdpZic7XHJcbiAgICAgICAgfSk7Ki9cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZVRleHQge1xyXG5cclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Nzcy12YXItdHlwZScsICgpPT57XHJcblx0XHRcdHR5cGluZygndGl0bGUtY3NzLXZhcicsIDEwLCAwKVxyXG5cdFx0XHQudHlwZSgnQ1NTIFZhcmlhYmxlcycpLndhaXQoMjAwMCkuc3BlZWQoNTApXHJcblx0XHRcdC5kZWxldGUoJ1ZhcmlhYmxlcycpLndhaXQoNTAwKS5zcGVlZCgxMDApXHJcblx0XHRcdC50eXBlKCdDdXN0b20gUHJvcGVydGllcycpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59Il19
