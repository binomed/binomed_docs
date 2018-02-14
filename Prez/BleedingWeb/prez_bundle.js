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
                await thingy.buttonEnable(function (state) {
                    console.log('tap', state);
                    if (state) {
                        Reveal.next();
                    }
                }, true);
            } catch (error) {
                console.error(error);
            }
        }
    }]);

    return ControlPrez;
}();

},{"./libs/thingy.js":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Demos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _applyCss = require('./helper/applyCss.js');

var _applyJs = require('./helper/applyJs.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demos = exports.Demos = function () {
    function Demos() {
        _classCallCheck(this, Demos);

        try {

            this._demoCssVar();

            this._demoCssVarInJS();

            this._demoPartTheme();
        } catch (error) {
            console.error(error);
        }
    }

    _createClass(Demos, [{
        key: '_demoCssVar',
        value: function _demoCssVar() {
            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), '\n#render-element{\n--a-super-var: #FFF;\n}\n#render-element .text-1{\n\n}\n#render-element .text-2{\n\n}\n            ');
        }
    }, {
        key: '_demoCssVarInJS',
        value: function _demoCssVarInJS() {

            var indiceH = -1;
            var subscribe = false;
            var clientRect = undefined;
            var ghostParent = document.getElementById('demo-ghost-parent');

            function processMouse(event) {
                var deltaX = clientRect.width + clientRect.left - event.clientX;
                var median = clientRect.width / 2;
                var left = deltaX > 0 ? median - deltaX : median + -1 * deltaX;
                ghostParent.style.setProperty('--left-pos', left + 'px');
                // console.log(`deltaX: ${deltaX} / median : ${median} / width : ${width} / left : ${left}`)
            }

            Reveal.addEventListener('ghost-state', function (event) {
                subscribe = true;
                setTimeout(function () {
                    indiceH = Reveal.getIndices().h;
                    clientRect = ghostParent.getBoundingClientRect();
                    ghostParent.addEventListener('mousemove', processMouse);
                }, 500);
            });

            Reveal.addEventListener('slidechanged', function (event) {
                if (subscribe && indiceH != event.indexh) {
                    ghostParent.removeEventListener('mousemove', processMouse);
                }
            });

            new _applyCss.ApplyCss(document.getElementById('codemirror-css-in-js-css'), '#demo-ghost-parent {\n--left-pos:0;\n}\n#demo-ghost-parent .demo-shadow,\n#demo-ghost-parent .demo-ghost{\nleft: var(--left-pos);\n}');

            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-css-in-js-js'), 'javascript', 'document.addEventListener(\'mousemove\', (event) =>{\n    const deltaX = this.width - event.clientX;\n    const median = this.width / 2;\n    const ghostParent = document.getElementById(\'demo-ghost-parent\');\n    const left = event.clientX > median ? (event.clientX - median) : -1 * (median - event.clientX);\n\n    ghostParent.style.setProperty(\'--left-pos\', `${left}px`);\n});\n            ');
        }
    }, {
        key: '_demoPartTheme',
        value: function _demoPartTheme() {
            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-part-css'), 'css', 'x-rating::part(subject) {\n    padding: 4px;\n    min-width: 20px;\n    display: inline-block;\n}\n.uno:hover::part(subject) {\n    background: lightgreen;\n}\n.duo::part(subject) {\n    background: goldenrod;\n}\n.uno::part(rating-thumb-up) {\n    background: green;\n}\n.uno::part(rating-thumb-down) {\n    background: tomato;\n}\n.duo::part(rating-thumb-up) {\n    background: yellow;\n}\n.duo::part(rating-thumb-down) {\n    background: black;\n}\nx-rating::theme(thumb-up) {\n    border-radius: 8px;\n}\n');

            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-part-html'), 'text/html', '<x-thumbs>\n    #shadow-root\n    <div part="thumb-up">\uD83D\uDC4D</div>\n    <div part="thumb-down">\uD83D\uDC4E</div>\n</x-thumbs>\n<x-rating>\n    #shadow-root\n    <div part="subject"><slot></slot></div>\n    <x-thumbs part="* => rating-*"></x-thumbs>\n</x-rating>\n\n<x-rating class="uno">\u2764\uFE0F</x-rating>\n<x-rating class="duo">\uD83E\uDD37</x-rating>\n');
        }
    }]);

    return Demos;
}();

},{"./helper/applyCss.js":3,"./helper/applyJs.js":4}],3:[function(require,module,exports){
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
            lineNumber: 'true',
            fixedGutter: false,
            showCursorWhenSelecting: true,
            lineWrapping: true,
            scrollbarStyle: 'null',
            theme: 'solarized dark'
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
        lineNumber: 'true',
        fixedGutter: false,
        readOnly: true,
        showCursorWhenSelecting: true,
        lineWrapping: true,
        scrollbarStyle: 'null',
        theme: 'solarized dark'
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

var MIN_TOP = '90px';
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
};

},{"./helper/highlightCodeHelper.js":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./libs/part-theme.js":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

        new _typedText.TypeText();
        if (!inIframe) {
            new _demos.Demos();
            new _highlightEvent.HighlightEvents();
            new _controlPrez.ControlPrez();
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./controlPrez.js":1,"./demos.js":2,"./highlightEvent.js":6,"./partTheme/components-sample.js":8,"./typedText.js":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TypeText = exports.TypeText = function TypeText() {
	_classCallCheck(this, TypeText);

	Reveal.addEventListener('css-var-type', function () {
		typing('title-css-var', 200, 0).type('CSS Variables').wait(1000).speed(100).delete('Variables').wait(500).speed(100).type('Properties');
	});
};

},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NvbnRyb2xQcmV6LmpzIiwic2NyaXB0cy9kZW1vcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlKcy5qcyIsInNjcmlwdHMvaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzL2hpZ2hsaWdodEV2ZW50LmpzIiwic2NyaXB0cy9saWJzL3RoaW5neS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzIiwic2NyaXB0cy9wYXJ0VGhlbWUvbGlicy9wYXJ0LXRoZW1lLmpzIiwic2NyaXB0cy9wcmV6LmpzIiwic2NyaXB0cy90eXBlZFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7Ozs7SUFJYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7O0FBQ1YsYUFBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUVBLGVBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXhDO0FBQ0g7Ozs7OENBRXFCO0FBQ2xCLGdCQUFJO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3RCO0FBQ0g7QUFDRCxvQkFBTSxTQUFTLG1CQUFXO0FBQ3RCLGdDQUFZO0FBRFUsaUJBQVgsQ0FBZjtBQUdBLHNCQUFNLE9BQU8sT0FBUCxFQUFOO0FBQ0EscUJBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLHNCQUFNLE9BQU8sWUFBUCxDQUFvQixVQUFDLEtBQUQsRUFBVztBQUNqQyw0QkFBUSxHQUFSLENBQVksS0FBWixFQUFtQixLQUFuQjtBQUNBLHdCQUFJLEtBQUosRUFBVztBQUNQLCtCQUFPLElBQVA7QUFDSDtBQUNKLGlCQUxLLEVBS0gsSUFMRyxDQUFOO0FBUUgsYUFqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDWix3QkFBUSxLQUFSLENBQWMsS0FBZDtBQUNIO0FBQ0o7Ozs7Ozs7QUNqQ0w7Ozs7Ozs7OztBQUNBOztBQUdBOzs7O0lBSWEsSyxXQUFBLEs7QUFFVCxxQkFBYztBQUFBOztBQUNWLFlBQUk7O0FBRUEsaUJBQUssV0FBTDs7QUFFQSxpQkFBSyxlQUFMOztBQUVBLGlCQUFLLGNBQUw7QUFFSCxTQVJELENBUUUsT0FBTyxLQUFQLEVBQWM7QUFDWixvQkFBUSxLQUFSLENBQWMsS0FBZDtBQUNIO0FBRUo7Ozs7c0NBRWE7QUFDVjtBQUNBLG1DQUNJLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FESjtBQWNIOzs7MENBRWlCOztBQUVkLGdCQUFJLFVBQVUsQ0FBQyxDQUFmO0FBQ0EsZ0JBQUksWUFBWSxLQUFoQjtBQUNBLGdCQUFJLGFBQWEsU0FBakI7QUFDQSxnQkFBTSxjQUFjLFNBQVMsY0FBVCxDQUF3QixtQkFBeEIsQ0FBcEI7O0FBRUEscUJBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QjtBQUN6QixvQkFBTSxTQUFVLFdBQVcsS0FBWCxHQUFtQixXQUFXLElBQS9CLEdBQXVDLE1BQU0sT0FBNUQ7QUFDQSxvQkFBTSxTQUFTLFdBQVcsS0FBWCxHQUFtQixDQUFsQztBQUNBLG9CQUFNLE9BQU8sU0FBUyxDQUFULEdBQWMsU0FBUyxNQUF2QixHQUFrQyxTQUFVLENBQUMsQ0FBRCxHQUFLLE1BQTlEO0FBQ0EsNEJBQVksS0FBWixDQUFrQixXQUFsQixDQUE4QixZQUE5QixFQUErQyxJQUEvQztBQUNBO0FBQ0g7O0FBRUQsbUJBQU8sZ0JBQVAsQ0FBd0IsYUFBeEIsRUFBdUMsVUFBQyxLQUFELEVBQVc7QUFDOUMsNEJBQVksSUFBWjtBQUNBLDJCQUFXLFlBQU07QUFDYiw4QkFBVSxPQUFPLFVBQVAsR0FBb0IsQ0FBOUI7QUFDQSxpQ0FBYSxZQUFZLHFCQUFaLEVBQWI7QUFDQSxnQ0FBWSxnQkFBWixDQUE2QixXQUE3QixFQUEwQyxZQUExQztBQUNILGlCQUpELEVBSUcsR0FKSDtBQUtILGFBUEQ7O0FBU0EsbUJBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsVUFBQyxLQUFELEVBQVc7QUFDL0Msb0JBQUksYUFBYSxXQUFXLE1BQU0sTUFBbEMsRUFBMEM7QUFDdEMsZ0NBQVksbUJBQVosQ0FBZ0MsV0FBaEMsRUFBNkMsWUFBN0M7QUFDSDtBQUNKLGFBSkQ7O0FBT0EsbUNBQ0ksU0FBUyxjQUFULENBQXdCLDBCQUF4QixDQURKOztBQVdBLHdDQUFtQixTQUFTLGNBQVQsQ0FBd0IseUJBQXhCLENBQW5CLEVBQ0ksWUFESjtBQVdIOzs7eUNBRWU7QUFDWix3Q0FBbUIsU0FBUyxjQUFULENBQXdCLHFCQUF4QixDQUFuQixFQUNJLEtBREo7O0FBOEJBLHdDQUFtQixTQUFTLGNBQVQsQ0FBd0Isc0JBQXhCLENBQW5CLEVBQ0ksV0FESjtBQWdCSDs7Ozs7Ozs7QUNqSkw7Ozs7Ozs7Ozs7SUFFYSxRLFdBQUEsUTs7QUFFVDs7Ozs7QUFLQSxzQkFBWSxHQUFaLEVBQWlCLGNBQWpCLEVBQWlDO0FBQUE7O0FBQUE7O0FBQzdCLFlBQU0sZ0JBQWdCLFdBQVcsR0FBWCxFQUFnQjtBQUNsQyxtQkFBTyxjQUQyQjtBQUVsQyxrQkFBTSxLQUY0QjtBQUdsQyx3QkFBWSxNQUhzQjtBQUlsQyx5QkFBYSxLQUpxQjtBQUtsQyxxQ0FBeUIsSUFMUztBQU1sQywwQkFBYyxJQU5vQjtBQU9sQyw0QkFBZ0IsTUFQa0I7QUFRbEMsbUJBQU87QUFSMkIsU0FBaEIsQ0FBdEI7O0FBV0EsWUFBTSxPQUFPLFNBQVMsSUFBVCxJQUFpQixTQUFTLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLENBQTlCO0FBQ0EsYUFBSyxLQUFMLEdBQWEsU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxhQUFLLE1BQUwsR0FBYyxDQUFkOztBQUVBLGFBQUssS0FBTCxDQUFXLElBQVgsR0FBa0IsVUFBbEI7QUFDQSxZQUFJLEtBQUssS0FBTCxDQUFXLFVBQWYsRUFBMEI7QUFDdEIsaUJBQUssS0FBTCxDQUFXLFVBQVgsQ0FBc0IsT0FBdEIsR0FBZ0MsRUFBaEM7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsQ0FBdkI7QUFDSDtBQUNELGFBQUssV0FBTCxDQUFpQixLQUFLLEtBQXRCOztBQUVBLHNCQUFjLE9BQWQsQ0FBc0IsTUFBdEIsRUFBOEIsTUFBOUI7QUFDQSxzQkFBYyxFQUFkLENBQWlCLFFBQWpCLEVBQTJCLFlBQVk7QUFDbkMsa0JBQUssUUFBTCxDQUFjLGNBQWMsUUFBZCxFQUFkO0FBQ0gsU0FGRDtBQUdBLGFBQUssUUFBTCxDQUFjLGNBQWQ7QUFDSDs7OztpQ0FFUSxLLEVBQU07QUFBQTs7QUFDWCxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBcUM7QUFDakMscUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBakIsQ0FBNEIsQ0FBNUI7QUFDSDtBQUNELGlCQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0Esa0JBQU0sS0FBTixDQUFZLEdBQVosRUFDSyxHQURMLENBQ1M7QUFBQSx1QkFBTyxJQUFJLElBQUosRUFBUDtBQUFBLGFBRFQsRUFFSyxPQUZMLENBRWEsdUJBQWU7QUFDcEIsb0JBQUc7QUFDQywyQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixVQUFqQixDQUE0QixjQUFZLEdBQXhDO0FBQ0EsMkJBQUssTUFBTDtBQUNILGlCQUhELENBR0MsT0FBTSxDQUFOLEVBQVE7QUFBQyw0QkFBUSxLQUFSLENBQWMsQ0FBZDtBQUFrQjtBQUMvQixhQVBMO0FBU0g7Ozs7Ozs7O0FDdERMOzs7Ozs7OztJQUVhLGM7O0FBRVQ7Ozs7OztRQUZTLGMsR0FRVCx3QkFBWSxHQUFaLEVBQWlCLElBQWpCLEVBQXVCLGNBQXZCLEVBQXVDO0FBQUE7O0FBQ25DLFFBQU0sZUFBZSxXQUFXLEdBQVgsRUFBZ0I7QUFDakMsZUFBTyxjQUQwQjtBQUVqQyxjQUFNLElBRjJCO0FBR2pDLG9CQUFZLE1BSHFCO0FBSWpDLHFCQUFhLEtBSm9CO0FBS2pDLGtCQUFVLElBTHVCO0FBTWpDLGlDQUF5QixJQU5RO0FBT2pDLHNCQUFjLElBUG1CO0FBUWpDLHdCQUFnQixNQVJpQjtBQVNqQyxlQUFPO0FBVDBCLEtBQWhCLENBQXJCOztBQVlBLGlCQUFhLE9BQWIsQ0FBcUIsTUFBckIsRUFBNkIsTUFBN0I7QUFDSCxDOzs7QUN4Qkw7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFVBQVUsTUFBaEI7QUFDQSxJQUFNLGNBQWMsUUFBcEI7QUFDQSxJQUFNLHFCQUFxQixPQUEzQjtBQUNBLElBQU0sWUFBWSxFQUFsQjs7SUFFYSxtQixXQUFBLG1CO0FBQ1QsdUNBR0c7QUFBQSxZQUZDLE1BRUQsUUFGQyxNQUVEO0FBQUEsWUFEQyxhQUNELFFBREMsYUFDRDs7QUFBQTs7QUFDQyxhQUFLLFdBQUwsR0FBbUIsU0FBUyxjQUFULGdCQUFxQyxNQUFyQyxDQUFuQjtBQUNBLGFBQUssYUFBTCxHQUFxQixhQUFyQjtBQUNBLGFBQUssU0FBTCxHQUFpQixDQUFqQjs7QUFFQSxlQUFPLGdCQUFQLFdBQWdDLE1BQWhDLEVBQTBDLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBMUM7QUFDQSxlQUFPLGdCQUFQLGdCQUFxQyxNQUFyQyxFQUErQyxLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQStCLElBQS9CLENBQS9DO0FBQ0g7Ozs7MENBRWlCLEssRUFBTztBQUNyQixnQkFBSTtBQUNBLG9CQUFJLGFBQWEsSUFBakI7QUFDQSxvQkFBSSxNQUFNLElBQU4sS0FBZSxNQUFuQixFQUEyQjtBQUN2Qix3QkFBSSxLQUFLLFNBQUwsSUFBa0IsQ0FBdEIsRUFBeUI7QUFDckIscUNBQWEsS0FBSyxhQUFMLENBQW1CLEtBQUssU0FBeEIsQ0FBYjtBQUNIO0FBQ0osaUJBSkQsTUFLQSxJQUFJLE1BQU0sSUFBTixLQUFlLGVBQW5CLEVBQW9DO0FBQ2hDLHdCQUFNLFFBQVEsQ0FBQyxNQUFNLFFBQU4sQ0FBZSxZQUFmLENBQTRCLHFCQUE1QixDQUFmO0FBQ0EseUJBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLGlDQUFhLEtBQUssYUFBTCxDQUFtQixLQUFuQixDQUFiO0FBRUgsaUJBTEQsTUFLTztBQUNILHdCQUFNLFNBQVEsQ0FBQyxNQUFNLFFBQU4sQ0FBZSxZQUFmLENBQTRCLHFCQUE1QixDQUFmO0FBQ0EseUJBQUssU0FBTCxHQUFpQixNQUFqQjtBQUNBO0FBQ0Esd0JBQUksU0FBUSxDQUFaLEVBQWU7QUFDWCxxQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsU0FBUSxDQUEzQixDQUFiO0FBQ0g7QUFDSjtBQUNELG9CQUFNLE9BQU8sYUFBYSxPQUFPLElBQVAsQ0FBWSxVQUFaLENBQWIsR0FBdUMsRUFBcEQ7QUFDQSxvQkFBTSxPQUFPLEVBQWI7QUFDQSxvQkFBTSxXQUFXLEVBQWpCO0FBQ0EscUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ2xDLHdCQUFNLE1BQU0sS0FBSyxDQUFMLENBQVo7QUFDQSw0QkFBUSxJQUFSO0FBQ0ksNkJBQUssUUFBUSxNQUFiO0FBQ0EsNkJBQUssUUFBUSxTQUFiO0FBQ0EsNkJBQUssUUFBUSxLQUFiO0FBQ0EsNkJBQUssUUFBUSxRQUFiO0FBQ0EsNkJBQUssUUFBUSxXQUFiO0FBQ0EsNkJBQUssUUFBUSxZQUFiO0FBQ0kscUNBQVMsR0FBVCxJQUFnQixXQUFXLEdBQVgsQ0FBaEI7QUFDQTtBQUNKLDZCQUFLLFFBQVEsUUFBYjtBQUNBLDZCQUFLLFFBQVEsT0FBYjtBQUNBLDZCQUFLLFFBQVEsS0FBYjtBQUNBLDZCQUFLLFFBQVEsTUFBYjtBQUNJLGlDQUFLLEdBQUwsSUFBWSxXQUFXLEdBQVgsQ0FBWjtBQUNBO0FBQ0o7QUFmSjtBQWtCSDs7QUFFRCxvQkFBSSxTQUFTLFNBQVQsS0FBdUIsU0FBM0IsRUFBc0M7QUFDbEMsNkJBQVMsU0FBVCxHQUFxQixPQUFyQjtBQUNIO0FBQ0Qsb0JBQUksU0FBUyxPQUFULEtBQXFCLFNBQXJCLElBQWtDLEtBQUssTUFBTCxLQUFnQixTQUF0RCxFQUFpRTtBQUM3RCx5QkFBSyxNQUFMLEdBQWMsV0FBZDtBQUNIO0FBQ0Qsb0JBQUksU0FBUyxJQUFULEtBQWtCLFNBQWxCLElBQStCLEtBQUssR0FBTCxLQUFhLFNBQWhELEVBQTJEO0FBQ3ZELHlCQUFLLEdBQUwsR0FBVyxDQUFYO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLE1BQVQsS0FBb0IsU0FBcEIsSUFBaUMsS0FBSyxLQUFMLEtBQWUsU0FBcEQsRUFBK0Q7QUFDM0QseUJBQUssS0FBTCxHQUFhLENBQWI7QUFDSDtBQUNELG9CQUFJLFNBQVMsR0FBVCxLQUFpQixTQUFqQixJQUE4QixLQUFLLElBQUwsS0FBYyxTQUFoRCxFQUEyRDtBQUN2RCx5QkFBSyxJQUFMLEdBQVksQ0FBWjtBQUNIO0FBQ0QscUJBQUssV0FBTCxDQUFpQixJQUFqQixHQUF3QixJQUF4QjtBQUNBLHFCQUFLLFdBQUwsQ0FBaUIsUUFBakIsR0FBNEIsUUFBNUI7QUFFSCxhQS9ERCxDQStERSxPQUFPLENBQVAsRUFBVTtBQUNSLHdCQUFRLEtBQVIsQ0FBYyxDQUFkO0FBQ0g7QUFDSjs7OzJDQUVrQjtBQUNmLGlCQUFLLGlCQUFMLENBQXVCO0FBQ25CLHNCQUFNLE1BRGE7QUFFbkIsMEJBQVUsU0FBUyxhQUFULENBQXVCLHNCQUF2QjtBQUZTLGFBQXZCO0FBSUEsbUJBQU8sZ0JBQVAsQ0FBd0IsZUFBeEIsRUFBeUMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QztBQUNBLG1CQUFPLGdCQUFQLENBQXdCLGdCQUF4QixFQUEwQyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTFDO0FBQ0g7OzsrQ0FFc0I7QUFDbkIsbUJBQU8sbUJBQVAsQ0FBMkIsZUFBM0IsRUFBNEMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUE1QztBQUNBLG1CQUFPLG1CQUFQLENBQTJCLGdCQUEzQixFQUE2QyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTdDO0FBQ0g7Ozs7Ozs7QUNyR0w7Ozs7Ozs7QUFFQTs7OztBQUlBLElBQU0sY0FBYyxJQUFwQjtBQUNBLElBQU0sb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLGUsV0FBQSxlLEdBQ1QsMkJBQWM7QUFBQTs7QUFDVjtBQUNBLGlEQUF3QjtBQUNwQixnQkFBUSxjQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBUlk7QUFISyxLQUF4Qjs7QUFrQkE7QUFDQSxpREFBd0I7QUFDcEIsZ0JBQVEsb0JBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osaUJBQUssT0FETztBQUVaLG9CQUFRLE9BRkk7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxPQUZUO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxpQkFBSyxDQUROO0FBRUMsb0JBQVEsTUFGVDtBQUdDLG1CQUFPO0FBSFIsU0FSWTtBQUhLLEtBQXhCOztBQWtCQTtBQUNBLGlEQUF3QjtBQUNwQixnQkFBUSxNQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGlCQUFLLENBRE87QUFFWixvQkFBUSxNQUZJO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWTtBQUhLLEtBQXhCOztBQWNBO0FBQ0EsaURBQXdCO0FBQ3BCLGdCQUFRLHdCQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0MsaUJBQUssQ0FETjtBQUVDLG9CQUFRLE1BRlQ7QUFHQyxtQkFBTztBQUhSLFNBUlk7QUFISyxLQUF4Qjs7QUFrQkE7QUFDQSxpREFBd0I7QUFDcEIsZ0JBQVEsYUFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLG1CQUFPO0FBSEssU0FBRCxFQUlaO0FBQ0Msa0JBQU0sRUFEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBSlksRUFRWjtBQUNDLGlCQUFLLENBRE47QUFFQyxvQkFBUSxNQUZUO0FBR0MsbUJBQU87QUFIUixTQVJZO0FBSEssS0FBeEI7QUFrQkgsQzs7Ozs7Ozs7Ozs7Ozs7O0FDdkdMO0lBQ2EsTSxXQUFBLE07QUFDWDs7Ozs7Ozs7OztBQVVBLG9CQUEyQztBQUFBLFFBQS9CLE9BQStCLHVFQUFyQixFQUFDLFlBQVksS0FBYixFQUFxQjs7QUFBQTs7QUFDekMsU0FBSyxVQUFMLEdBQWtCLFFBQVEsVUFBMUI7O0FBRUE7QUFDQSxTQUFLLFFBQUwsR0FBZ0Isc0NBQWhCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLHNDQUFyQjtBQUNBLFNBQUssbUJBQUwsR0FBMkIsc0NBQTNCO0FBQ0EsU0FBSyxvQkFBTCxHQUE0QixzQ0FBNUI7QUFDQSxTQUFLLGtCQUFMLEdBQTBCLHNDQUExQjtBQUNBLFNBQUssb0JBQUwsR0FBNEIsc0NBQTVCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLHNDQUF2QjtBQUNBLFNBQUssb0JBQUwsR0FBNEIsc0NBQTVCOztBQUVBO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLHNDQUFoQjtBQUNBLFNBQUssYUFBTCxHQUFxQixzQ0FBckI7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLHNDQUF6QjtBQUNBLFNBQUssaUJBQUwsR0FBeUIsc0NBQXpCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLHNDQUFwQjtBQUNBLFNBQUssY0FBTCxHQUFzQixzQ0FBdEI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsc0NBQXZCOztBQUVBO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLHNDQUFqQjtBQUNBLFNBQUssYUFBTCxHQUFxQixzQ0FBckI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsc0NBQXJCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLHNDQUFyQjs7QUFFQTtBQUNBLFNBQUssUUFBTCxHQUFnQixzQ0FBaEI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsc0NBQXZCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLHNDQUFwQjtBQUNBLFNBQUssb0JBQUwsR0FBNEIsc0NBQTVCO0FBQ0EsU0FBSyxtQkFBTCxHQUEyQixzQ0FBM0I7QUFDQSxTQUFLLGFBQUwsR0FBcUIsc0NBQXJCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLHNDQUFwQjtBQUNBLFNBQUssY0FBTCxHQUFzQixzQ0FBdEI7QUFDQSxTQUFLLG1CQUFMLEdBQTJCLHNDQUEzQjtBQUNBLFNBQUssZ0JBQUwsR0FBd0Isc0NBQXhCO0FBQ0EsU0FBSyxnQkFBTCxHQUF3QixzQ0FBeEI7O0FBRUE7QUFDQSxTQUFLLFFBQUwsR0FBZ0Isc0NBQWhCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLHNDQUF2QjtBQUNBLFNBQUsscUJBQUwsR0FBNkIsc0NBQTdCO0FBQ0EsU0FBSyxxQkFBTCxHQUE2QixzQ0FBN0I7QUFDQSxTQUFLLFlBQUwsR0FBb0Isc0NBQXBCOztBQUVBLFNBQUssWUFBTCxHQUFvQixDQUNsQixpQkFEa0IsRUFFbEIsS0FBSyxRQUZhLEVBR2xCLEtBQUssUUFIYSxFQUlsQixLQUFLLFNBSmEsRUFLbEIsS0FBSyxRQUxhLEVBTWxCLEtBQUssUUFOYSxDQUFwQjs7QUFTQSxTQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxTQUFLLE1BQUw7QUFDQSxTQUFLLDBCQUFMLEdBQWtDLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBbEM7QUFDQSxTQUFLLGtCQUFMLEdBQTBCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBMUI7QUFDQSxTQUFLLHNCQUFMLEdBQThCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBOUI7QUFDQSxTQUFLLHNCQUFMLEdBQThCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBOUI7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBekI7QUFDQSxTQUFLLG1CQUFMLEdBQTJCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBM0I7QUFDQSxTQUFLLG9CQUFMLEdBQTRCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBNUI7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBekI7QUFDQSxTQUFLLHlCQUFMLEdBQWlDLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBakM7QUFDQSxTQUFLLHdCQUFMLEdBQWdDLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBaEM7QUFDQSxTQUFLLGtCQUFMLEdBQTBCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBMUI7QUFDQSxTQUFLLHVCQUFMLEdBQStCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBL0I7QUFDQSxTQUFLLG1CQUFMLEdBQTJCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBM0I7QUFDQSxTQUFLLDRCQUFMLEdBQW9DLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBcEM7QUFDQSxTQUFLLHFCQUFMLEdBQTZCLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBN0I7QUFDQSxTQUFLLDJCQUFMLEdBQW1DLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBbkM7QUFDQSxTQUFLLDJCQUFMLEdBQW1DLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBbkM7QUFDQSxTQUFLLHdCQUFMLEdBQWdDLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBaEM7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7O29DQVlnQixjLEVBQWdCO0FBQzlCLFVBQUksQ0FBQyxLQUFLLFNBQVYsRUFBcUI7QUFDbkIsWUFBSTtBQUNGLGVBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNBLGNBQU0sWUFBWSxNQUFNLGVBQWUsU0FBZixFQUF4QjtBQUNBLGVBQUssU0FBTCxHQUFpQixLQUFqQjs7QUFFQSxpQkFBTyxTQUFQO0FBQ0QsU0FORCxDQU1FLE9BQU8sS0FBUCxFQUFjO0FBQ2QsaUJBQU8sS0FBUDtBQUNEO0FBQ0YsT0FWRCxNQVVPO0FBQ0wsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxnQ0FBVixDQUFmLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztxQ0FjaUIsYyxFQUFnQixTLEVBQVc7QUFDMUMsVUFBSSxDQUFDLEtBQUssU0FBVixFQUFxQjtBQUNuQixZQUFJO0FBQ0YsZUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsZ0JBQU0sZUFBZSxVQUFmLENBQTBCLFNBQTFCLENBQU47QUFDQSxlQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDRCxTQUpELENBSUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxpQkFBTyxLQUFQO0FBQ0Q7QUFDRCxlQUFPLFFBQVEsT0FBUixFQUFQO0FBQ0QsT0FURCxNQVNPO0FBQ0wsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxnQ0FBVixDQUFmLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OztvQ0FRZ0I7QUFDZCxVQUFJO0FBQ0Y7QUFDQSxZQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixrQkFBUSxHQUFSLHNEQUErRCxLQUFLLFFBQXBFO0FBQ0Q7O0FBRUQsYUFBSyxNQUFMLEdBQWMsTUFBTSxVQUFVLFNBQVYsQ0FBb0IsYUFBcEIsQ0FBa0M7QUFDcEQsbUJBQVMsQ0FDUDtBQUNFLHNCQUFVLENBQUMsS0FBSyxRQUFOO0FBRFosV0FETyxDQUQyQztBQU1wRCw0QkFBa0IsS0FBSztBQU42QixTQUFsQyxDQUFwQjtBQVFBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsMkJBQW1DLEtBQUssTUFBTCxDQUFZLElBQS9DO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLFNBQVMsTUFBTSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLE9BQWpCLEVBQXJCO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsa0JBQVEsR0FBUixxQkFBNkIsS0FBSyxNQUFMLENBQVksSUFBekM7QUFDRDs7QUFFRDtBQUNBLFlBQU0saUJBQWlCLE1BQU0sT0FBTyxpQkFBUCxDQUF5QixpQkFBekIsQ0FBN0I7QUFDQSxhQUFLLHFCQUFMLEdBQTZCLE1BQU0sZUFBZSxpQkFBZixDQUFpQyxlQUFqQyxDQUFuQztBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsQ0FBWSw2REFBWjtBQUNEOztBQUVEO0FBQ0EsYUFBSyxvQkFBTCxHQUE0QixNQUFNLE9BQU8saUJBQVAsQ0FBeUIsS0FBSyxRQUE5QixDQUFsQztBQUNBLGFBQUssa0JBQUwsR0FBMEIsTUFBTSxLQUFLLG9CQUFMLENBQTBCLGlCQUExQixDQUE0QyxLQUFLLGFBQWpELENBQWhDO0FBQ0EsYUFBSyx1QkFBTCxHQUErQixNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssbUJBQWpELENBQXJDO0FBQ0EsYUFBSyx3QkFBTCxHQUFnQyxNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssb0JBQWpELENBQXRDO0FBQ0EsYUFBSyx3QkFBTCxHQUFnQyxNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssb0JBQWpELENBQXRDO0FBQ0EsYUFBSyx1QkFBTCxHQUErQixNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssa0JBQWpELENBQXJDO0FBQ0EsYUFBSyw2QkFBTCxHQUFxQyxNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssZUFBakQsQ0FBM0M7QUFDQSxhQUFLLHdCQUFMLEdBQWdDLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxvQkFBakQsQ0FBdEM7QUFDQSxZQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixrQkFBUSxHQUFSLENBQVksaUVBQVo7QUFDRDs7QUFFRDtBQUNBLGFBQUssa0JBQUwsR0FBMEIsTUFBTSxPQUFPLGlCQUFQLENBQXlCLEtBQUssUUFBOUIsQ0FBaEM7QUFDQSxhQUFLLHlCQUFMLEdBQWlDLE1BQU0sS0FBSyxrQkFBTCxDQUF3QixpQkFBeEIsQ0FBMEMsS0FBSyxhQUEvQyxDQUF2QztBQUNBLGFBQUssbUJBQUwsR0FBMkIsTUFBTSxLQUFLLGtCQUFMLENBQXdCLGlCQUF4QixDQUEwQyxLQUFLLGNBQS9DLENBQWpDO0FBQ0EsYUFBSyxpQkFBTCxHQUF5QixNQUFNLEtBQUssa0JBQUwsQ0FBd0IsaUJBQXhCLENBQTBDLEtBQUssWUFBL0MsQ0FBL0I7QUFDQSxhQUFLLHNCQUFMLEdBQThCLE1BQU0sS0FBSyxrQkFBTCxDQUF3QixpQkFBeEIsQ0FBMEMsS0FBSyxpQkFBL0MsQ0FBcEM7QUFDQSxhQUFLLHNCQUFMLEdBQThCLE1BQU0sS0FBSyxrQkFBTCxDQUF3QixpQkFBeEIsQ0FBMEMsS0FBSyxpQkFBL0MsQ0FBcEM7QUFDQSxhQUFLLCtCQUFMLEdBQXVDLE1BQU0sS0FBSyxrQkFBTCxDQUF3QixpQkFBeEIsQ0FBMEMsS0FBSyxlQUEvQyxDQUE3QztBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsQ0FBWSwrREFBWjtBQUNEOztBQUVEO0FBQ0EsYUFBSyxvQkFBTCxHQUE0QixNQUFNLE9BQU8saUJBQVAsQ0FBeUIsS0FBSyxTQUE5QixDQUFsQztBQUNBLGFBQUssb0JBQUwsR0FBNEIsTUFBTSxLQUFLLG9CQUFMLENBQTBCLGlCQUExQixDQUE0QyxLQUFLLGFBQWpELENBQWxDO0FBQ0EsYUFBSyxpQkFBTCxHQUF5QixNQUFNLEtBQUssb0JBQUwsQ0FBMEIsaUJBQTFCLENBQTRDLEtBQUssYUFBakQsQ0FBL0I7QUFDQSxhQUFLLHlCQUFMLEdBQWlDLE1BQU0sS0FBSyxvQkFBTCxDQUEwQixpQkFBMUIsQ0FBNEMsS0FBSyxhQUFqRCxDQUF2QztBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsQ0FBWSxrRUFBWjtBQUNEOztBQUVEO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLE1BQU0sT0FBTyxpQkFBUCxDQUF5QixLQUFLLFFBQTlCLENBQTNCO0FBQ0EsYUFBSyx1QkFBTCxHQUErQixNQUFNLEtBQUssYUFBTCxDQUFtQixpQkFBbkIsQ0FBcUMsS0FBSyxlQUExQyxDQUFyQztBQUNBLGFBQUssbUJBQUwsR0FBMkIsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssY0FBMUMsQ0FBakM7QUFDQSxhQUFLLDJCQUFMLEdBQW1DLE1BQU0sS0FBSyxhQUFMLENBQW1CLGlCQUFuQixDQUFxQyxLQUFLLGdCQUExQyxDQUF6QztBQUNBLGFBQUsscUJBQUwsR0FBNkIsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssZ0JBQTFDLENBQW5DO0FBQ0EsYUFBSyx5QkFBTCxHQUFpQyxNQUFNLEtBQUssYUFBTCxDQUFtQixpQkFBbkIsQ0FBcUMsS0FBSyxvQkFBMUMsQ0FBdkM7QUFDQSxhQUFLLHdCQUFMLEdBQWdDLE1BQU0sS0FBSyxhQUFMLENBQW1CLGlCQUFuQixDQUFxQyxLQUFLLG1CQUExQyxDQUF0QztBQUNBLGFBQUssdUJBQUwsR0FBK0IsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssWUFBMUMsQ0FBckM7QUFDQSxhQUFLLDRCQUFMLEdBQW9DLE1BQU0sS0FBSyxhQUFMLENBQW1CLGlCQUFuQixDQUFxQyxLQUFLLG1CQUExQyxDQUExQztBQUNBLGFBQUssa0JBQUwsR0FBMEIsTUFBTSxLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssYUFBMUMsQ0FBaEM7QUFDQSxhQUFLLGlCQUFMLEdBQXlCLE1BQU0sS0FBSyxhQUFMLENBQW1CLGlCQUFuQixDQUFxQyxLQUFLLFlBQTFDLENBQS9CO0FBQ0EsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsa0JBQVEsR0FBUixDQUFZLDBEQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFLLFlBQUwsR0FBb0IsTUFBTSxPQUFPLGlCQUFQLENBQXlCLEtBQUssUUFBOUIsQ0FBMUI7QUFDQSxhQUFLLHVCQUFMLEdBQStCLE1BQU0sS0FBSyxZQUFMLENBQWtCLGlCQUFsQixDQUFvQyxLQUFLLGVBQXpDLENBQXJDO0FBQ0EsYUFBSyx3QkFBTCxHQUFnQyxNQUFNLEtBQUssWUFBTCxDQUFrQixpQkFBbEIsQ0FBb0MsS0FBSyxZQUF6QyxDQUF0QztBQUNBLGFBQUsseUJBQUwsR0FBaUMsTUFBTSxLQUFLLFlBQUwsQ0FBa0IsaUJBQWxCLENBQW9DLEtBQUsscUJBQXpDLENBQXZDO0FBQ0EsYUFBSywyQkFBTCxHQUFtQyxNQUFNLEtBQUssWUFBTCxDQUFrQixpQkFBbEIsQ0FBb0MsS0FBSyxxQkFBekMsQ0FBekM7QUFDQSxZQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixrQkFBUSxHQUFSLENBQVkseURBQVo7QUFDRDtBQUNGLE9BMUZELENBMEZFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3VDQU1tQjtBQUNqQixVQUFJO0FBQ0YsY0FBTSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLFVBQWpCLEVBQU47QUFDRCxPQUZELENBRUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7O2dEQUM0QixjLEVBQWdCLE0sRUFBUSxhLEVBQWU7QUFDakUsVUFBSSxNQUFKLEVBQVk7QUFDVixZQUFJO0FBQ0YsZ0JBQU0sZUFBZSxrQkFBZixFQUFOO0FBQ0EsY0FBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsb0JBQVEsR0FBUixDQUFZLCtCQUErQixlQUFlLElBQTFEO0FBQ0Q7QUFDRCx5QkFBZSxnQkFBZixDQUFnQyw0QkFBaEMsRUFBOEQsYUFBOUQ7QUFDRCxTQU5ELENBTUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxpQkFBTyxLQUFQO0FBQ0Q7QUFDRixPQVZELE1BVU87QUFDTCxZQUFJO0FBQ0YsZ0JBQU0sZUFBZSxpQkFBZixFQUFOO0FBQ0EsY0FBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsb0JBQVEsR0FBUixDQUFZLDZCQUFaLEVBQTJDLGVBQWUsSUFBMUQ7QUFDRDtBQUNELHlCQUFlLG1CQUFmLENBQW1DLDRCQUFuQyxFQUFpRSxhQUFqRTtBQUNELFNBTkQsQ0FNRSxPQUFPLEtBQVAsRUFBYztBQUNkLGlCQUFPLEtBQVA7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQTs7Ozs7Ozs7OztvQ0FPZ0I7QUFDZCxVQUFJO0FBQ0YsWUFBTSxPQUFPLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyxrQkFBcEIsQ0FBbkI7QUFDQSxZQUFNLFVBQVUsSUFBSSxXQUFKLENBQWdCLE9BQWhCLENBQWhCO0FBQ0EsWUFBTSxPQUFPLFFBQVEsTUFBUixDQUFlLElBQWYsQ0FBYjtBQUNBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGtCQUFRLEdBQVIsQ0FBWSwyQkFBMkIsSUFBdkM7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNELE9BUkQsQ0FRRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O2tDQVFjLEksRUFBTTtBQUNsQixVQUFJLEtBQUssTUFBTCxHQUFjLEVBQWxCLEVBQXNCO0FBQ3BCLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxTQUFKLENBQWMsaURBQWQsQ0FBZixDQUFQO0FBQ0Q7QUFDRCxVQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsS0FBSyxNQUFwQixDQUFsQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEtBQUssQ0FBdEMsRUFBeUM7QUFDdkMsa0JBQVUsQ0FBVixJQUFlLEtBQUssVUFBTCxDQUFnQixDQUFoQixDQUFmO0FBQ0Q7QUFDRCxhQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssa0JBQXJCLEVBQXlDLFNBQXpDLENBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7O3lDQU1xQjtBQUNuQixVQUFJO0FBQ0YsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx1QkFBcEIsQ0FBM0I7O0FBRUE7QUFDQSxZQUFNLGVBQWUsSUFBckI7QUFDQSxZQUFNLFdBQVcsQ0FBQyxhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsSUFBMEMsS0FBM0MsRUFBa0QsT0FBbEQsQ0FBMEQsQ0FBMUQsQ0FBakI7QUFDQSxZQUFNLFVBQVUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWhCO0FBQ0EsWUFBTSxTQUFTO0FBQ2Isb0JBQVU7QUFDUixzQkFBVSxRQURGO0FBRVIsa0JBQU07QUFGRSxXQURHO0FBS2IsbUJBQVM7QUFDUCxxQkFBUyxPQURGO0FBRVAsa0JBQU07QUFGQztBQUxJLFNBQWY7QUFVQSxlQUFPLE1BQVA7QUFDRCxPQWxCRCxDQWtCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7dUNBVW1CLE0sRUFBUTtBQUN6QixVQUFJLFFBQU8sTUFBUCx5Q0FBTyxNQUFQLE9BQWtCLFFBQWxCLElBQThCLE9BQU8sUUFBUCxLQUFvQixTQUFsRCxJQUErRCxPQUFPLE9BQVAsS0FBbUIsU0FBdEYsRUFBaUc7QUFDL0YsZUFBTyxRQUFRLE1BQVIsQ0FDTCxJQUFJLFNBQUosQ0FBYywrSEFBZCxDQURLLENBQVA7QUFHRDs7QUFFRDtBQUNBLFVBQU0sV0FBVyxPQUFPLFFBQVAsR0FBa0IsR0FBbkM7QUFDQSxVQUFNLFVBQVUsT0FBTyxPQUF2Qjs7QUFFQTtBQUNBLFVBQUksV0FBVyxFQUFYLElBQWlCLFdBQVcsSUFBaEMsRUFBc0M7QUFDcEMsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSx3RUFBZixDQUFmLENBQVA7QUFDRDtBQUNELFVBQUksVUFBVSxDQUFWLElBQWUsVUFBVSxHQUE3QixFQUFrQztBQUNoQyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLGdFQUFmLENBQWYsQ0FBUDtBQUNEOztBQUVELFVBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCO0FBQ0EsZ0JBQVUsQ0FBVixJQUFlLFdBQVcsSUFBMUI7QUFDQSxnQkFBVSxDQUFWLElBQWdCLFlBQVksQ0FBYixHQUFrQixJQUFqQztBQUNBLGdCQUFVLENBQVYsSUFBZSxPQUFmOztBQUVBLGFBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyx1QkFBckIsRUFBOEMsU0FBOUMsQ0FBYjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzBDQU9zQjtBQUNwQixVQUFJO0FBQ0YsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx3QkFBcEIsQ0FBM0I7O0FBRUE7QUFDQSxZQUFNLGVBQWUsSUFBckI7QUFDQSxZQUFNLGtCQUFrQixhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsSUFBMEMsSUFBbEU7QUFDQSxZQUFNLGtCQUFrQixhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsWUFBMUIsSUFBMEMsSUFBbEU7QUFDQSxZQUFNLGVBQWUsYUFBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLENBQXJCOztBQUVBO0FBQ0EsWUFBTSxxQkFBcUIsYUFBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLElBQTBDLEVBQXJFO0FBQ0EsWUFBTSxTQUFTO0FBQ2IsOEJBQW9CO0FBQ2xCLGlCQUFLLGVBRGE7QUFFbEIsaUJBQUssZUFGYTtBQUdsQixrQkFBTTtBQUhZLFdBRFA7QUFNYix3QkFBYztBQUNaLG1CQUFPLFlBREs7QUFFWixrQkFBTTtBQUZNLFdBTkQ7QUFVYiw4QkFBb0I7QUFDbEIscUJBQVMsa0JBRFM7QUFFbEIsa0JBQU07QUFGWTtBQVZQLFNBQWY7QUFlQSxlQUFPLE1BQVA7QUFDRCxPQTNCRCxDQTJCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7MENBVXNCLE0sRUFBUTtBQUM1QixVQUFJLFFBQU8sTUFBUCx5Q0FBTyxNQUFQLE9BQWtCLFFBQWxCLElBQThCLE9BQU8sV0FBUCxLQUF1QixTQUFyRCxJQUFrRSxPQUFPLFdBQVAsS0FBdUIsU0FBN0YsRUFBd0c7QUFDdEcsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFNBQUosQ0FBYyw0RUFBZCxDQUFmLENBQVA7QUFDRDs7QUFFRCxVQUFJLGNBQWMsT0FBTyxXQUF6QjtBQUNBLFVBQUksY0FBYyxPQUFPLFdBQXpCOztBQUVBLFVBQUksZ0JBQWdCLElBQWhCLElBQXdCLGdCQUFnQixJQUE1QyxFQUFrRDtBQUNoRCxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksU0FBSixDQUFjLDBFQUFkLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsVUFBSSxjQUFjLEdBQWQsSUFBcUIsY0FBYyxXQUF2QyxFQUFvRDtBQUNsRCxlQUFPLFFBQVEsTUFBUixDQUNMLElBQUksVUFBSixDQUFlLHFGQUFmLENBREssQ0FBUDtBQUdEO0FBQ0QsVUFBSSxjQUFjLElBQWQsSUFBc0IsY0FBYyxXQUF4QyxFQUFxRDtBQUNuRCxlQUFPLFFBQVEsTUFBUixDQUNMLElBQUksVUFBSixDQUFlLG9GQUFmLENBREssQ0FBUDtBQUdEOztBQUVELFVBQUk7QUFDRixZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHdCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCOztBQUVBO0FBQ0Esc0JBQWMsS0FBSyxLQUFMLENBQVcsY0FBYyxHQUF6QixDQUFkO0FBQ0Esc0JBQWMsS0FBSyxLQUFMLENBQVcsY0FBYyxHQUF6QixDQUFkOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxjQUFjLElBQTdCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixlQUFlLENBQWhCLEdBQXFCLElBQXBDO0FBQ0Esa0JBQVUsQ0FBVixJQUFlLGNBQWMsSUFBN0I7QUFDQSxrQkFBVSxDQUFWLElBQWdCLGVBQWUsQ0FBaEIsR0FBcUIsSUFBcEM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHdCQUFyQixFQUErQyxTQUEvQyxDQUFiO0FBQ0QsT0FsQkQsQ0FrQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLDhDQUE4QyxLQUF4RCxDQUFmLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs4Q0FRMEIsWSxFQUFjO0FBQ3RDO0FBQ0EsVUFBSSxlQUFlLENBQWYsSUFBb0IsZUFBZSxHQUF2QyxFQUE0QztBQUMxQyxlQUFPLFFBQVEsTUFBUixDQUNMLElBQUksVUFBSixDQUFlLDRFQUFmLENBREssQ0FBUDtBQUdEOztBQUVELFVBQUk7QUFDRixZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHdCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxlQUFlLElBQTlCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixnQkFBZ0IsQ0FBakIsR0FBc0IsSUFBckM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHdCQUFyQixFQUErQyxTQUEvQyxDQUFiO0FBQ0QsT0FaRCxDQVlFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSx3Q0FBd0MsS0FBbEQsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7eUNBVXFCLE8sRUFBUztBQUM1QjtBQUNBLFVBQUksVUFBVSxHQUFWLElBQWlCLFVBQVUsS0FBL0IsRUFBc0M7QUFDcEMsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSx3RUFBZixDQUFmLENBQVA7QUFDRDs7QUFFRCxVQUFJO0FBQ0Y7QUFDQSxrQkFBVSxLQUFLLEtBQUwsQ0FBVyxVQUFVLEVBQXJCLENBQVY7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHdCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLElBQXJCO0FBQ0EsWUFBTSxrQkFBa0IsYUFBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLENBQXhCO0FBQ0EsWUFBTSxlQUFlLGFBQWEsU0FBYixDQUF1QixDQUF2QixFQUEwQixZQUExQixDQUFyQjs7QUFFQSxZQUFJLFVBQVUsQ0FBVixHQUFjLENBQUMsSUFBSSxZQUFMLElBQXFCLGVBQXZDLEVBQXdEO0FBQ3RELGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLDZKQUFWLENBQWYsQ0FBUDtBQUVEOztBQUVELGtCQUFVLENBQVYsSUFBZSxVQUFVLElBQXpCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixXQUFXLENBQVosR0FBaUIsSUFBaEM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHdCQUFyQixFQUErQyxTQUEvQyxDQUFiO0FBQ0QsT0F4QkQsQ0F3QkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLGtEQUFrRCxLQUE1RCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs0Q0FPd0I7QUFDdEIsVUFBSTtBQUNGLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssdUJBQXBCLENBQTNCOztBQUVBO0FBQ0EsWUFBTSxjQUFjLENBQUMsYUFBRCxFQUFnQixjQUFoQixFQUFnQyxTQUFoQyxFQUEyQyxVQUEzQyxDQUFwQjtBQUNBLFlBQU0saUJBQWlCLENBQ3JCLE9BRHFCLEVBRXJCLE9BRnFCLEVBR3JCLE9BSHFCLEVBSXJCLE9BSnFCLEVBS3JCLFFBTHFCLEVBTXJCLE9BTnFCLEVBT3JCLE9BUHFCLEVBUXJCLE1BUnFCLEVBU3JCLE1BVHFCLEVBVXJCLE1BVnFCLEVBV3JCLE1BWHFCLEVBWXJCLE9BWnFCLEVBYXJCLE1BYnFCLEVBY3JCLE1BZHFCLENBQXZCO0FBZ0JBLFlBQU0sU0FBUyxZQUFZLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFaLENBQWY7QUFDQSxZQUFNLFVBQVUsSUFBSSxXQUFKLENBQWdCLE9BQWhCLENBQWhCO0FBQ0EsWUFBSSxNQUFNLFFBQVEsTUFBUixDQUFlLFlBQWYsQ0FBVjtBQUNBLGNBQU0sU0FBUyxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQWY7O0FBRUEsdUJBQWUsT0FBZixDQUF1QixVQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWdCO0FBQ3JDLGNBQUksSUFBSSxPQUFKLENBQVksT0FBTyxZQUFQLENBQW9CLENBQXBCLENBQVosTUFBd0MsQ0FBQyxDQUE3QyxFQUFnRDtBQUM5QyxrQkFBTSxJQUFJLE9BQUosQ0FBWSxPQUFPLFlBQVAsQ0FBb0IsQ0FBcEIsQ0FBWixFQUFvQyxlQUFlLENBQWYsQ0FBcEMsQ0FBTjtBQUNEO0FBQ0YsU0FKRDs7QUFNQSxlQUFPLElBQUksR0FBSixDQUFRLEdBQVIsQ0FBUDtBQUNELE9BakNELENBaUNFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OzBDQVlzQixTLEVBQVc7QUFDL0IsVUFBSTtBQUNGO0FBQ0EsWUFBTSxNQUFNLElBQUksR0FBSixDQUFRLFNBQVIsQ0FBWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFNLGNBQWMsQ0FBQyxhQUFELEVBQWdCLGNBQWhCLEVBQWdDLFNBQWhDLEVBQTJDLFVBQTNDLENBQXBCO0FBQ0EsWUFBTSxpQkFBaUIsQ0FDckIsT0FEcUIsRUFFckIsT0FGcUIsRUFHckIsT0FIcUIsRUFJckIsT0FKcUIsRUFLckIsUUFMcUIsRUFNckIsT0FOcUIsRUFPckIsT0FQcUIsRUFRckIsTUFScUIsRUFTckIsTUFUcUIsRUFVckIsTUFWcUIsRUFXckIsTUFYcUIsRUFZckIsT0FacUIsRUFhckIsTUFicUIsRUFjckIsTUFkcUIsQ0FBdkI7QUFnQkEsWUFBSSxhQUFhLElBQWpCO0FBQ0EsWUFBSSxnQkFBZ0IsSUFBcEI7QUFDQSxZQUFJLGVBQWUsSUFBSSxJQUF2QjtBQUNBLFlBQUksTUFBTSxhQUFhLE1BQXZCOztBQUVBLG9CQUFZLE9BQVosQ0FBb0IsVUFBQyxPQUFELEVBQVUsQ0FBVixFQUFnQjtBQUNsQyxjQUFJLElBQUksSUFBSixDQUFTLE9BQVQsQ0FBaUIsT0FBakIsTUFBOEIsQ0FBQyxDQUEvQixJQUFvQyxlQUFlLElBQXZELEVBQTZEO0FBQzNELHlCQUFhLE9BQU8sWUFBUCxDQUFvQixDQUFwQixDQUFiO0FBQ0EsMkJBQWUsYUFBYSxPQUFiLENBQXFCLE9BQXJCLEVBQThCLFVBQTlCLENBQWY7QUFDQSxtQkFBTyxRQUFRLE1BQWY7QUFDRDtBQUNGLFNBTkQ7O0FBUUEsdUJBQWUsT0FBZixDQUF1QixVQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWdCO0FBQ3JDLGNBQUksSUFBSSxJQUFKLENBQVMsT0FBVCxDQUFpQixPQUFqQixNQUE4QixDQUFDLENBQS9CLElBQW9DLGtCQUFrQixJQUExRCxFQUFnRTtBQUM5RCw0QkFBZ0IsT0FBTyxZQUFQLENBQW9CLENBQXBCLENBQWhCO0FBQ0EsMkJBQWUsYUFBYSxPQUFiLENBQXFCLE9BQXJCLEVBQThCLGFBQTlCLENBQWY7QUFDQSxtQkFBTyxRQUFRLE1BQWY7QUFDRDtBQUNGLFNBTkQ7O0FBUUEsWUFBSSxNQUFNLENBQU4sSUFBVyxNQUFNLEVBQXJCLEVBQXlCO0FBQ3ZCLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksU0FBSixDQUFjLHNHQUFkLENBQWYsQ0FBUDtBQUVEOztBQUVELFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxhQUFhLE1BQTVCLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxhQUFhLE1BQWpDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzVDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFVBQWIsQ0FBd0IsQ0FBeEIsQ0FBZjtBQUNEOztBQUVELGVBQU8sS0FBSyxVQUFMLENBQWdCLEtBQUssdUJBQXJCLEVBQThDLFNBQTlDLENBQVA7QUFDRCxPQXpERCxDQXlERSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sUUFBUSxNQUFSLENBQWUsS0FBZixDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7OzswQ0FPc0I7QUFDcEIsVUFBSTtBQUNGLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssd0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxVQUFVLElBQUksV0FBSixDQUFnQixPQUFoQixDQUFoQjtBQUNBLFlBQU0sUUFBUSxRQUFRLE1BQVIsQ0FBZSxZQUFmLENBQWQ7O0FBRUEsZUFBTyxLQUFQO0FBQ0QsT0FORCxDQU1FLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7d0NBUW9CLEssRUFBTztBQUN6QixVQUFJLE1BQU0sTUFBTixHQUFlLEdBQW5CLEVBQXdCO0FBQ3RCLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsZ0RBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsVUFBTSxVQUFVLElBQUksV0FBSixDQUFnQixPQUFoQixFQUF5QixNQUF6QixDQUFnQyxLQUFoQyxDQUFoQjs7QUFFQSxhQUFPLEtBQUssVUFBTCxDQUFnQixLQUFLLHdCQUFyQixFQUErQyxPQUEvQyxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7bUNBT2U7QUFDYixVQUFJO0FBQ0YsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx3QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLGVBQWUsSUFBckI7QUFDQSxZQUFNLE1BQU0sYUFBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLFlBQTFCLENBQVo7O0FBRUEsZUFBTyxHQUFQO0FBQ0QsT0FORCxDQU1FLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OztpQ0FVYSxNLEVBQVE7QUFDbkIsVUFBSSxRQUFPLE1BQVAseUNBQU8sTUFBUCxPQUFrQixRQUFsQixJQUE4QixPQUFPLE9BQVAsS0FBbUIsU0FBckQsRUFBZ0U7QUFDOUQsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFNBQUosQ0FBYyxrQ0FBZCxDQUFmLENBQVA7QUFDRDs7QUFFRCxVQUFNLFVBQVUsT0FBTyxPQUF2QjtBQUNBLFVBQU0sb0JBQW9CLE9BQU8saUJBQVAsSUFBNEIsSUFBdEQ7O0FBRUEsVUFBSSxVQUFVLEVBQVYsSUFBZ0IsVUFBVSxHQUE5QixFQUFtQztBQUNqQyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLDBDQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVELFVBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCO0FBQ0EsZ0JBQVUsQ0FBVixJQUFlLG9CQUFvQixDQUFwQixHQUF3QixDQUF2QztBQUNBLGdCQUFVLENBQVYsSUFBZSxVQUFVLElBQXpCO0FBQ0EsZ0JBQVUsQ0FBVixJQUFnQixXQUFXLENBQVosR0FBaUIsSUFBaEM7O0FBRUEsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyx3QkFBckIsRUFBK0MsU0FBL0MsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OytDQU8yQjtBQUN6QixVQUFJO0FBQ0YsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyw2QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFFBQVEsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWQ7QUFDQSxZQUFNLFFBQVEsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWQ7QUFDQSxZQUFNLFFBQVEsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWQ7QUFDQSxZQUFNLGdCQUFjLEtBQWQsU0FBdUIsS0FBdkIsU0FBZ0MsS0FBdEM7O0FBRUEsZUFBTyxPQUFQO0FBQ0QsT0FSRCxDQVFFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7QUFFQTs7QUFFQTs7Ozs7Ozs7OztpREFPNkI7QUFDM0IsVUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssK0JBQXBCLENBQW5CO0FBQ0EsWUFBTSxlQUFlLElBQXJCO0FBQ0EsWUFBTSxlQUFlLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBckI7QUFDQSxZQUFNLG1CQUFtQixLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQXpCO0FBQ0EsWUFBTSxtQkFBbUIsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUF6QjtBQUNBLFlBQU0sZ0JBQWdCLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBdEI7QUFDQSxZQUFNLFVBQVUsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFoQjtBQUNBLFlBQU0saUJBQWlCLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBdkI7QUFDQSxZQUFNLG1CQUFtQixLQUFLLFFBQUwsQ0FBYyxFQUFkLENBQXpCO0FBQ0EsWUFBTSxrQkFBa0IsS0FBSyxRQUFMLENBQWMsRUFBZCxDQUF4QjtBQUNBLFlBQU0sU0FBUztBQUNiLHdCQUFjLFlBREQ7QUFFYiw0QkFBa0IsZ0JBRkw7QUFHYiw0QkFBa0IsZ0JBSEw7QUFJYix5QkFBZSxhQUpGO0FBS2IsbUJBQVMsT0FMSTtBQU1iLDBCQUFnQixjQU5IO0FBT2IsNEJBQWtCLGdCQVBMO0FBUWIsMkJBQWlCO0FBUkosU0FBZjs7QUFXQSxlQUFPLE1BQVA7QUFDRCxPQXZCRCxDQXVCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsNERBQTRELEtBQXRFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OztpREFRNkIsUSxFQUFVO0FBQ3JDLFVBQUk7QUFDRixZQUFJLFdBQVcsRUFBWCxJQUFpQixXQUFXLEtBQWhDLEVBQXVDO0FBQ3JDLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLGdGQUFmLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSywrQkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsRUFBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsV0FBVyxJQUExQjtBQUNBLGtCQUFVLENBQVYsSUFBZ0IsWUFBWSxDQUFiLEdBQWtCLElBQWpDOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSywrQkFBckIsRUFBc0QsU0FBdEQsQ0FBYjtBQUNELE9BakJELENBaUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSx5REFBeUQsS0FBbkUsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7OzhDQVEwQixRLEVBQVU7QUFDbEMsVUFBSTtBQUNGLFlBQUksV0FBVyxFQUFYLElBQWlCLFdBQVcsS0FBaEMsRUFBdUM7QUFDckMsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsNkVBQWYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLCtCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxFQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxXQUFXLElBQTFCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixZQUFZLENBQWIsR0FBa0IsSUFBakM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLCtCQUFyQixFQUFzRCxTQUF0RCxDQUFiO0FBQ0QsT0FqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLHNEQUFzRCxLQUFoRSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OENBUTBCLFEsRUFBVTtBQUNsQyxVQUFJO0FBQ0YsWUFBSSxXQUFXLEdBQVgsSUFBa0IsV0FBVyxLQUFqQyxFQUF3QztBQUN0QyxpQkFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSwrRUFBZixDQUFmLENBQVA7QUFDRDs7QUFFRDtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssK0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLEVBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLFdBQVcsSUFBMUI7QUFDQSxrQkFBVSxDQUFWLElBQWdCLFlBQVksQ0FBYixHQUFrQixJQUFqQzs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssK0JBQXJCLEVBQXNELFNBQXRELENBQWI7QUFDRCxPQWpCRCxDQWlCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsc0RBQXNELEtBQWhFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OzsyQ0FRdUIsUSxFQUFVO0FBQy9CLFVBQUk7QUFDRixZQUFJLFdBQVcsR0FBWCxJQUFrQixXQUFXLEtBQWpDLEVBQXdDO0FBQ3RDLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLDRFQUFmLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSywrQkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsRUFBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsV0FBVyxJQUExQjtBQUNBLGtCQUFVLENBQVYsSUFBZ0IsWUFBWSxDQUFiLEdBQWtCLElBQWpDOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSywrQkFBckIsRUFBc0QsU0FBdEQsQ0FBYjtBQUNELE9BakJELENBaUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSwwREFBMEQsS0FBcEUsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7eUNBT3FCLFEsRUFBVTtBQUM3QixVQUFJO0FBQ0YsWUFBSSxhQUFKOztBQUVBLFlBQUksYUFBYSxDQUFqQixFQUFvQjtBQUNsQixpQkFBTyxDQUFQO0FBQ0QsU0FGRCxNQUVPLElBQUksYUFBYSxFQUFqQixFQUFxQjtBQUMxQixpQkFBTyxDQUFQO0FBQ0QsU0FGTSxNQUVBLElBQUksYUFBYSxFQUFqQixFQUFxQjtBQUMxQixpQkFBTyxDQUFQO0FBQ0QsU0FGTSxNQUVBO0FBQ0wsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsd0RBQWYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLCtCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxFQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxJQUFmOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSywrQkFBckIsRUFBc0QsU0FBdEQsQ0FBYjtBQUNELE9BeEJELENBd0JFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSxpREFBaUQsS0FBM0QsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7K0NBVTJCLEcsRUFBSyxLLEVBQU8sSSxFQUFNO0FBQzNDLFVBQUk7QUFDRjtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssK0JBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLEVBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLEdBQWY7QUFDQSxrQkFBVSxFQUFWLElBQWdCLEtBQWhCO0FBQ0Esa0JBQVUsRUFBVixJQUFnQixJQUFoQjs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssK0JBQXJCLEVBQXNELFNBQXRELENBQWI7QUFDRCxPQWRELENBY0UsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLHFEQUFxRCxLQUEvRCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OzRDQVN3QixZLEVBQWMsTSxFQUFRO0FBQzVDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyxrQkFBTCxDQUF3QixDQUF4QixJQUE2QixLQUFLLHlCQUFMLENBQStCLElBQS9CLENBQW9DLElBQXBDLENBQTdCO0FBQ0EsYUFBSyxrQkFBTCxDQUF3QixDQUF4QixFQUEyQixJQUEzQixDQUFnQyxZQUFoQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsRUFBMkIsTUFBM0IsQ0FBa0MsS0FBSyxrQkFBTCxDQUF3QixPQUF4QixDQUFnQyxDQUFDLFlBQUQsQ0FBaEMsQ0FBbEMsRUFBbUYsQ0FBbkY7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLHlCQUFoQyxFQUEyRCxNQUEzRCxFQUFtRSxLQUFLLGtCQUFMLENBQXdCLENBQXhCLENBQW5FLENBQWI7QUFDRDs7OzhDQUV5QixLLEVBQU87QUFDL0IsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxVQUFVLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBaEI7QUFDQSxVQUFNLFVBQVUsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFoQjtBQUNBLFVBQU0sY0FBYyxVQUFVLFVBQVUsR0FBeEM7QUFDQSxXQUFLLGtCQUFMLENBQXdCLENBQXhCLEVBQTJCLE9BQTNCLENBQW1DLFVBQUMsWUFBRCxFQUFrQjtBQUNuRCxxQkFBYTtBQUNYLGlCQUFPLFdBREk7QUFFWCxnQkFBTTtBQUZLLFNBQWI7QUFJRCxPQUxEO0FBTUQ7O0FBRUQ7Ozs7Ozs7Ozs7Ozt5Q0FTcUIsWSxFQUFjLE0sRUFBUTtBQUN6QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssc0JBQUwsQ0FBNEIsQ0FBNUIsSUFBaUMsS0FBSyxzQkFBTCxDQUE0QixJQUE1QixDQUFpQyxJQUFqQyxDQUFqQztBQUNBLGFBQUssc0JBQUwsQ0FBNEIsQ0FBNUIsRUFBK0IsSUFBL0IsQ0FBb0MsWUFBcEM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLHNCQUFMLENBQTRCLENBQTVCLEVBQStCLE1BQS9CLENBQXNDLEtBQUssc0JBQUwsQ0FBNEIsT0FBNUIsQ0FBb0MsQ0FBQyxZQUFELENBQXBDLENBQXRDLEVBQTJGLENBQTNGO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyxzQkFBaEMsRUFBd0QsTUFBeEQsRUFBZ0UsS0FBSyxzQkFBTCxDQUE0QixDQUE1QixDQUFoRSxDQUFiO0FBQ0Q7OzsyQ0FFc0IsSyxFQUFPO0FBQzVCLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjtBQUNBLFVBQU0sZUFBZSxJQUFyQjtBQUNBLFVBQU0sVUFBVSxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQWhCO0FBQ0EsVUFBTSxVQUFVLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBaEI7QUFDQSxVQUFNLFdBQVcsVUFBVSxVQUFVLEdBQXJDO0FBQ0EsV0FBSyxzQkFBTCxDQUE0QixDQUE1QixFQUErQixPQUEvQixDQUF1QyxVQUFDLFlBQUQsRUFBa0I7QUFDdkQscUJBQWE7QUFDWCxpQkFBTyxRQURJO0FBRVgsZ0JBQU07QUFGSyxTQUFiO0FBSUQsT0FMRDtBQU1EOztBQUVEOzs7Ozs7Ozs7Ozs7eUNBU3FCLFksRUFBYyxNLEVBQVE7QUFDekMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLHNCQUFMLENBQTRCLENBQTVCLElBQWlDLEtBQUssc0JBQUwsQ0FBNEIsSUFBNUIsQ0FBaUMsSUFBakMsQ0FBakM7QUFDQSxhQUFLLHNCQUFMLENBQTRCLENBQTVCLEVBQStCLElBQS9CLENBQW9DLFlBQXBDO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxzQkFBTCxDQUE0QixDQUE1QixFQUErQixNQUEvQixDQUFzQyxLQUFLLHNCQUFMLENBQTRCLE9BQTVCLENBQW9DLENBQUMsWUFBRCxDQUFwQyxDQUF0QyxFQUEyRixDQUEzRjtBQUNEO0FBQ0QsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyxzQkFBaEMsRUFBd0QsTUFBeEQsRUFBZ0UsS0FBSyxzQkFBTCxDQUE0QixDQUE1QixDQUFoRSxDQUFiO0FBQ0Q7OzsyQ0FFc0IsSyxFQUFPO0FBQzVCLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjtBQUNBLFVBQU0sV0FBVyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWpCO0FBQ0EsV0FBSyxzQkFBTCxDQUE0QixDQUE1QixFQUErQixPQUEvQixDQUF1QyxVQUFDLFlBQUQsRUFBa0I7QUFDdkQscUJBQWE7QUFDWCxpQkFBTyxRQURJO0FBRVgsZ0JBQU07QUFGSyxTQUFiO0FBSUQsT0FMRDtBQU1EOztBQUVEOzs7Ozs7Ozs7Ozs7b0NBU2dCLFksRUFBYyxNLEVBQVE7QUFDcEMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLGlCQUFMLENBQXVCLENBQXZCLElBQTRCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBNUI7QUFDQSxhQUFLLGlCQUFMLENBQXVCLENBQXZCLEVBQTBCLElBQTFCLENBQStCLFlBQS9CO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxpQkFBTCxDQUF1QixDQUF2QixFQUEwQixNQUExQixDQUFpQyxLQUFLLGlCQUFMLENBQXVCLE9BQXZCLENBQStCLENBQUMsWUFBRCxDQUEvQixDQUFqQyxFQUFpRixDQUFqRjtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUssaUJBQWhDLEVBQW1ELE1BQW5ELEVBQTJELEtBQUssaUJBQUwsQ0FBdUIsQ0FBdkIsQ0FBM0QsQ0FBYjtBQUNEOzs7c0NBQ2lCLEssRUFBTztBQUN2QixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7QUFDQSxVQUFNLGVBQWUsSUFBckI7QUFDQSxVQUFNLE9BQU8sS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFiO0FBQ0EsVUFBTSxPQUFPLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBYjs7QUFFQSxXQUFLLGlCQUFMLENBQXVCLENBQXZCLEVBQTBCLE9BQTFCLENBQWtDLFVBQUMsWUFBRCxFQUFrQjtBQUNsRCxxQkFBYTtBQUNYLGdCQUFNO0FBQ0osbUJBQU8sSUFESDtBQUVKLGtCQUFNO0FBRkYsV0FESztBQUtYLGdCQUFNO0FBQ0osbUJBQU8sSUFESDtBQUVKLGtCQUFNO0FBRkY7QUFMSyxTQUFiO0FBVUQsT0FYRDtBQVlEOztBQUVEOzs7Ozs7Ozs7Ozs7c0NBU2tCLFksRUFBYyxNLEVBQVE7QUFDdEMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLG1CQUFMLENBQXlCLENBQXpCLElBQThCLEtBQUssbUJBQUwsQ0FBeUIsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBOUI7QUFDQSxhQUFLLG1CQUFMLENBQXlCLENBQXpCLEVBQTRCLElBQTVCLENBQWlDLFlBQWpDO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxtQkFBTCxDQUF5QixDQUF6QixFQUE0QixNQUE1QixDQUFtQyxLQUFLLG1CQUFMLENBQXlCLE9BQXpCLENBQWlDLENBQUMsWUFBRCxDQUFqQyxDQUFuQyxFQUFxRixDQUFyRjtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUssbUJBQWhDLEVBQXFELE1BQXJELEVBQTZELEtBQUssbUJBQUwsQ0FBeUIsQ0FBekIsQ0FBN0QsQ0FBYjtBQUNEOzs7d0NBRW1CLEssRUFBTztBQUN6QixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7QUFDQSxVQUFNLGVBQWUsSUFBckI7QUFDQSxVQUFNLElBQUksS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFWO0FBQ0EsVUFBTSxJQUFJLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBVjtBQUNBLFVBQU0sSUFBSSxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQVY7QUFDQSxVQUFNLElBQUksS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUFWO0FBQ0EsVUFBTSxTQUFTLEtBQUssSUFBSSxDQUFKLEdBQVEsQ0FBYixDQUFmO0FBQ0EsVUFBTSxTQUFTLEtBQUssSUFBSSxDQUFKLEdBQVEsQ0FBYixDQUFmO0FBQ0EsVUFBTSxTQUFTLEtBQUssSUFBSSxDQUFKLEdBQVEsQ0FBYixDQUFmO0FBQ0EsVUFBTSxlQUFlLEdBQXJCO0FBQ0EsVUFBTSxlQUFlLEdBQXJCO0FBQ0EsVUFBTSxZQUFZLGVBQWUsWUFBakM7QUFDQSxVQUFJLGtCQUFrQixDQUFDLElBQUksWUFBTCxJQUFxQixTQUEzQzs7QUFFQSxVQUFJLGtCQUFrQixDQUF0QixFQUF5QjtBQUN2QiwwQkFBa0IsQ0FBbEI7QUFDRDs7QUFFRCxVQUFJLE1BQU0sU0FBUyxLQUFULEdBQWlCLENBQWpCLEdBQXFCLGVBQS9COztBQUVBLFVBQUksTUFBTSxHQUFWLEVBQWU7QUFDYixjQUFNLEdBQU47QUFDRDtBQUNELFVBQUksUUFBUSxTQUFTLEtBQVQsR0FBaUIsQ0FBakIsR0FBcUIsZUFBakM7O0FBRUEsVUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDZixnQkFBUSxHQUFSO0FBQ0Q7QUFDRCxVQUFJLE9BQU8sU0FBUyxLQUFULEdBQWlCLENBQWpCLEdBQXFCLGVBQWhDOztBQUVBLFVBQUksT0FBTyxHQUFYLEVBQWdCO0FBQ2QsZUFBTyxHQUFQO0FBQ0Q7O0FBRUQsV0FBSyxtQkFBTCxDQUF5QixDQUF6QixFQUE0QixPQUE1QixDQUFvQyxVQUFDLFlBQUQsRUFBa0I7QUFDcEQscUJBQWE7QUFDWCxlQUFLLElBQUksT0FBSixDQUFZLENBQVosQ0FETTtBQUVYLGlCQUFPLE1BQU0sT0FBTixDQUFjLENBQWQsQ0FGSTtBQUdYLGdCQUFNLEtBQUssT0FBTCxDQUFhLENBQWI7QUFISyxTQUFiO0FBS0QsT0FORDtBQU9EOztBQUVEO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7eUNBT3FCO0FBQ25CLFVBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLGlCQUFwQixDQUFuQjtBQUNBLFlBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWI7QUFDQSxZQUFNLGVBQWUsSUFBckI7QUFDQSxZQUFJLGVBQUo7O0FBRUEsZ0JBQVEsSUFBUjtBQUNBLGVBQUssQ0FBTDtBQUNFLHFCQUFTLEVBQUMsV0FBVyxFQUFDLE1BQU0sSUFBUCxFQUFaLEVBQVQ7QUFDQTtBQUNGLGVBQUssQ0FBTDtBQUNFLHFCQUFTO0FBQ1Asb0JBQU0sSUFEQztBQUVQLGlCQUFHLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FGSTtBQUdQLGlCQUFHLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FISTtBQUlQLGlCQUFHLEtBQUssUUFBTCxDQUFjLENBQWQ7QUFKSSxhQUFUO0FBTUE7QUFDRixlQUFLLENBQUw7QUFDRSxxQkFBUztBQUNQLG9CQUFNLElBREM7QUFFUCxxQkFBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBRkE7QUFHUCx5QkFBVyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBSEo7QUFJUCxxQkFBTyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCO0FBSkEsYUFBVDtBQU1BO0FBQ0YsZUFBSyxDQUFMO0FBQ0UscUJBQVM7QUFDUCxvQkFBTSxJQURDO0FBRVAscUJBQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUZBO0FBR1AseUJBQVcsS0FBSyxRQUFMLENBQWMsQ0FBZDtBQUhKLGFBQVQ7QUFLQTtBQTFCRjtBQTRCQSxlQUFPLE1BQVA7QUFDRCxPQW5DRCxDQW1DRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsMkNBQTJDLEtBQXJELENBQVA7QUFDRDtBQUNGOzs7NEJBRU8sUyxFQUFXO0FBQ2pCLGFBQU8sS0FBSyxVQUFMLENBQWdCLEtBQUssaUJBQXJCLEVBQXdDLFNBQXhDLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7c0NBV2tCLEssRUFBTztBQUN2QixVQUFJLE1BQU0sR0FBTixLQUFjLFNBQWQsSUFBMkIsTUFBTSxLQUFOLEtBQWdCLFNBQTNDLElBQXdELE1BQU0sSUFBTixLQUFlLFNBQTNFLEVBQXNGO0FBQ3BGLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxTQUFKLENBQWMsNEVBQWQsQ0FBZixDQUFQO0FBQ0Q7QUFDRCxVQUNFLE1BQU0sR0FBTixHQUFZLENBQVosSUFDQSxNQUFNLEdBQU4sR0FBWSxHQURaLElBRUEsTUFBTSxLQUFOLEdBQWMsQ0FGZCxJQUdBLE1BQU0sS0FBTixHQUFjLEdBSGQsSUFJQSxNQUFNLElBQU4sR0FBYSxDQUpiLElBS0EsTUFBTSxJQUFOLEdBQWEsR0FOZixFQU9FO0FBQ0EsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSw2Q0FBZixDQUFmLENBQVA7QUFDRDtBQUNELGFBQU8sTUFBTSxLQUFLLE9BQUwsQ0FBYSxJQUFJLFVBQUosQ0FBZSxDQUFDLENBQUQsRUFBSSxNQUFNLEdBQVYsRUFBZSxNQUFNLEtBQXJCLEVBQTRCLE1BQU0sSUFBbEMsQ0FBZixDQUFiLENBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7cUNBV2lCLE0sRUFBUTtBQUN2QixVQUFNLFNBQVMsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixRQUFqQixFQUEyQixNQUEzQixFQUFtQyxRQUFuQyxFQUE2QyxNQUE3QyxFQUFxRCxPQUFyRCxDQUFmO0FBQ0EsVUFBTSxZQUFZLE9BQU8sT0FBTyxLQUFkLEtBQXdCLFFBQXhCLEdBQW1DLE9BQU8sT0FBUCxDQUFlLE9BQU8sS0FBdEIsSUFBK0IsQ0FBbEUsR0FBc0UsT0FBTyxLQUEvRjs7QUFFQSxVQUFJLE9BQU8sS0FBUCxLQUFpQixTQUFqQixJQUE4QixPQUFPLFNBQVAsS0FBcUIsU0FBbkQsSUFBZ0UsT0FBTyxLQUFQLEtBQWlCLFNBQXJGLEVBQWdHO0FBQzlGLGVBQU8sUUFBUSxNQUFSLENBQ0wsSUFBSSxTQUFKLENBQWMsdUZBQWQsQ0FESyxDQUFQO0FBR0Q7QUFDRCxVQUFJLFlBQVksQ0FBWixJQUFpQixZQUFZLENBQWpDLEVBQW9DO0FBQ2xDLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsMkNBQWYsQ0FBZixDQUFQO0FBQ0Q7QUFDRCxVQUFJLE9BQU8sU0FBUCxHQUFtQixDQUFuQixJQUF3QixPQUFPLFNBQVAsR0FBbUIsR0FBL0MsRUFBb0Q7QUFDbEQsZUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLFVBQUosQ0FBZSw2Q0FBZixDQUFmLENBQVA7QUFDRDtBQUNELFVBQUksT0FBTyxLQUFQLEdBQWUsRUFBZixJQUFxQixPQUFPLEtBQVAsR0FBZSxLQUF4QyxFQUErQztBQUM3QyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLGtEQUFmLENBQWYsQ0FBUDtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLE9BQUwsQ0FBYSxJQUFJLFVBQUosQ0FBZSxDQUFDLENBQUQsRUFBSSxTQUFKLEVBQWUsT0FBTyxTQUF0QixFQUFpQyxPQUFPLEtBQVAsR0FBZSxJQUFoRCxFQUF1RCxPQUFPLEtBQVAsSUFBZ0IsQ0FBakIsR0FBc0IsSUFBNUUsQ0FBZixDQUFiLENBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7OztxQ0FVaUIsTSxFQUFRO0FBQ3ZCLFVBQU0sU0FBUyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTZDLE1BQTdDLEVBQXFELE9BQXJELENBQWY7QUFDQSxVQUFNLFlBQVksT0FBTyxPQUFPLEtBQWQsS0FBd0IsUUFBeEIsR0FBbUMsT0FBTyxPQUFQLENBQWUsT0FBTyxLQUF0QixJQUErQixDQUFsRSxHQUFzRSxPQUFPLEtBQS9GOztBQUVBLFVBQUksY0FBYyxTQUFkLElBQTJCLE9BQU8sU0FBUCxLQUFxQixTQUFwRCxFQUErRDtBQUM3RCxlQUFPLFFBQVEsTUFBUixDQUNMLElBQUksU0FBSixDQUFjLHNGQUFkLENBREssQ0FBUDtBQUdEO0FBQ0QsVUFBSSxZQUFZLENBQVosSUFBaUIsWUFBWSxDQUFqQyxFQUFvQztBQUNsQyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksVUFBSixDQUFlLDJDQUFmLENBQWYsQ0FBUDtBQUNEO0FBQ0QsVUFBSSxPQUFPLFNBQVAsR0FBbUIsQ0FBbkIsSUFBd0IsT0FBTyxTQUFQLEdBQW1CLEdBQS9DLEVBQW9EO0FBQ2xELGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxVQUFKLENBQWUsNENBQWYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUssT0FBTCxDQUFhLElBQUksVUFBSixDQUFlLENBQUMsQ0FBRCxFQUFJLFNBQUosRUFBZSxPQUFPLFNBQXRCLENBQWYsQ0FBYixDQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt1Q0FTbUIsWSxFQUFjLE0sRUFBUTtBQUN2QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssb0JBQUwsQ0FBMEIsQ0FBMUIsSUFBK0IsS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixJQUEvQixDQUEvQjtBQUNBLGFBQUssb0JBQUwsQ0FBMEIsQ0FBMUIsRUFBNkIsSUFBN0IsQ0FBa0MsWUFBbEM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLG9CQUFMLENBQTBCLENBQTFCLEVBQTZCLE1BQTdCLENBQW9DLEtBQUssb0JBQUwsQ0FBMEIsT0FBMUIsQ0FBa0MsQ0FBQyxZQUFELENBQWxDLENBQXBDLEVBQXVGLENBQXZGO0FBQ0Q7QUFDRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLG9CQUFoQyxFQUFzRCxNQUF0RCxFQUE4RCxLQUFLLG9CQUFMLENBQTBCLENBQTFCLENBQTlELENBQWI7QUFDRDs7O3lDQUVvQixLLEVBQU87QUFDMUIsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxRQUFRLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBZDtBQUNBLFdBQUssb0JBQUwsQ0FBMEIsQ0FBMUIsRUFBNkIsT0FBN0IsQ0FBcUMsVUFBQyxZQUFELEVBQWtCO0FBQ3JELHFCQUFhLEtBQWI7QUFDRCxPQUZEO0FBR0Q7O0FBRUQ7Ozs7Ozs7Ozs7K0NBTzJCO0FBQ3pCLFVBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHlCQUFwQixDQUFuQjtBQUNBLFlBQU0sWUFBWTtBQUNoQixnQkFBTSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBRFU7QUFFaEIsZ0JBQU0sS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUZVO0FBR2hCLGdCQUFNLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FIVTtBQUloQixnQkFBTSxLQUFLLFFBQUwsQ0FBYyxDQUFkO0FBSlUsU0FBbEI7QUFNQSxlQUFPLFNBQVA7QUFDRCxPQVRELENBU0UsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLDBEQUEwRCxLQUFwRSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7O3lDQVNxQixHLEVBQUssSyxFQUFPO0FBQy9CLFVBQUksTUFBTSxDQUFOLElBQVcsTUFBTSxDQUFyQixFQUF3QjtBQUN0QixlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLDBCQUFWLENBQWYsQ0FBUDtBQUNEO0FBQ0QsVUFBSSxFQUFFLFVBQVUsQ0FBVixJQUFlLFVBQVUsR0FBM0IsQ0FBSixFQUFxQztBQUNuQyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLG1DQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVELFVBQUk7QUFDRjtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUsseUJBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsTUFBTSxDQUFoQixJQUFxQixLQUFyQjs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUsseUJBQXJCLEVBQWdELFNBQWhELENBQWI7QUFDRCxPQVpELENBWUUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLHVDQUF1QyxLQUFqRCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7NENBT3dCO0FBQ3RCLFVBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHVCQUFwQixDQUFuQjtBQUNBLFlBQU0sZUFBZSxJQUFyQjtBQUNBLFlBQU0sc0JBQXNCLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBNUI7QUFDQSxZQUFNLG1CQUFtQixLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQXpCO0FBQ0EsWUFBTSxxQkFBcUIsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixZQUFsQixDQUEzQjtBQUNBLFlBQU0sNEJBQTRCLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBbEM7QUFDQSxZQUFNLGVBQWUsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFyQjtBQUNBLFlBQU0sU0FBUztBQUNiLDZCQUFtQixtQkFETjtBQUViLDRCQUFrQixnQkFGTDtBQUdiLDhCQUFvQixrQkFIUDtBQUliLHFDQUEyQix5QkFKZDtBQUtiLHdCQUFjO0FBTEQsU0FBZjs7QUFRQSxlQUFPLE1BQVA7QUFDRCxPQWpCRCxDQWlCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsNERBQTRELEtBQXRFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OztpREFRNkIsUSxFQUFVO0FBQ3JDLFVBQUk7QUFDRixZQUFJLFdBQVcsR0FBWCxJQUFrQixXQUFXLElBQWpDLEVBQXVDO0FBQ3JDLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLG9EQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx1QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsQ0FBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsV0FBVyxJQUExQjtBQUNBLGtCQUFVLENBQVYsSUFBZ0IsWUFBWSxDQUFiLEdBQWtCLElBQWpDOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyx1QkFBckIsRUFBOEMsU0FBOUMsQ0FBYjtBQUNELE9BakJELENBaUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSxpREFBaUQsS0FBM0QsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O3FEQVFpQyxRLEVBQVU7QUFDekMsVUFBSTtBQUNGLFlBQUksV0FBVyxHQUFYLElBQWtCLFdBQVcsSUFBakMsRUFBdUM7QUFDckMsaUJBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsb0RBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHVCQUFwQixDQUEzQjtBQUNBLFlBQU0sWUFBWSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQWxCOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLG9CQUFVLENBQVYsSUFBZSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZjtBQUNEOztBQUVELGtCQUFVLENBQVYsSUFBZSxXQUFXLElBQTFCO0FBQ0Esa0JBQVUsQ0FBVixJQUFnQixZQUFZLENBQWIsR0FBa0IsSUFBakM7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHVCQUFyQixFQUE4QyxTQUE5QyxDQUFiO0FBQ0QsT0FqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLCtEQUErRCxLQUF6RSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7Z0RBUTRCLFEsRUFBVTtBQUNwQyxVQUFJO0FBQ0YsWUFBSSxXQUFXLEdBQVgsSUFBa0IsV0FBVyxJQUFqQyxFQUF1QztBQUNyQyxpQkFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxvREFBVixDQUFmLENBQVA7QUFDRDs7QUFFRDtBQUNBLFlBQU0sZUFBZSxNQUFNLEtBQUssU0FBTCxDQUFlLEtBQUssdUJBQXBCLENBQTNCO0FBQ0EsWUFBTSxZQUFZLElBQUksVUFBSixDQUFlLENBQWYsQ0FBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsb0JBQVUsQ0FBVixJQUFlLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFmO0FBQ0Q7O0FBRUQsa0JBQVUsQ0FBVixJQUFlLFdBQVcsSUFBMUI7QUFDQSxrQkFBVSxDQUFWLElBQWdCLFlBQVksQ0FBYixHQUFrQixJQUFqQzs7QUFFQSxlQUFPLE1BQU0sS0FBSyxVQUFMLENBQWdCLEtBQUssdUJBQXJCLEVBQThDLFNBQTlDLENBQWI7QUFDRCxPQWpCRCxDQWlCRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sSUFBSSxLQUFKLENBQVUsZ0VBQWdFLEtBQTFFLENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OztvREFRZ0MsUyxFQUFXO0FBQ3pDLFVBQUk7QUFDRixZQUFJLFlBQVksR0FBWixJQUFtQixZQUFZLEdBQW5DLEVBQXdDO0FBQ3RDLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGlEQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx1QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsQ0FBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsWUFBWSxJQUEzQjtBQUNBLGtCQUFVLENBQVYsSUFBZ0IsYUFBYSxDQUFkLEdBQW1CLElBQWxDOztBQUVBLGVBQU8sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyx1QkFBckIsRUFBOEMsU0FBOUMsQ0FBYjtBQUNELE9BakJELENBaUJFLE9BQU8sS0FBUCxFQUFjO0FBQ2QsZUFBTyxJQUFJLEtBQUosQ0FBVSxxRUFBcUUsS0FBL0UsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7OzBDQVFzQixNLEVBQVE7QUFDNUIsVUFBSTtBQUNGLFlBQUksT0FBTyxNQUFQLEtBQWtCLFNBQXRCLEVBQWlDO0FBQy9CLGlCQUFPLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLHFDQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBTSxlQUFlLE1BQU0sS0FBSyxTQUFMLENBQWUsS0FBSyx1QkFBcEIsQ0FBM0I7QUFDQSxZQUFNLFlBQVksSUFBSSxVQUFKLENBQWUsQ0FBZixDQUFsQjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxvQkFBVSxDQUFWLElBQWUsYUFBYSxRQUFiLENBQXNCLENBQXRCLENBQWY7QUFDRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsU0FBUyxDQUFULEdBQWEsQ0FBNUI7O0FBRUEsZUFBTyxNQUFNLEtBQUssVUFBTCxDQUFnQixLQUFLLHVCQUFyQixFQUE4QyxTQUE5QyxDQUFiO0FBQ0QsT0FoQkQsQ0FnQkUsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFPLElBQUksS0FBSixDQUFVLCtEQUErRCxLQUF6RSxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7O29DQVNnQixZLEVBQWMsTSxFQUFRO0FBQ3BDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyxpQkFBTCxDQUF1QixDQUF2QixJQUE0QixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTVCO0FBQ0EsYUFBSyxpQkFBTCxDQUF1QixDQUF2QixFQUEwQixJQUExQixDQUErQixZQUEvQjtBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssaUJBQUwsQ0FBdUIsQ0FBdkIsRUFBMEIsTUFBMUIsQ0FBaUMsS0FBSyxpQkFBTCxDQUF1QixPQUF2QixDQUErQixDQUFDLFlBQUQsQ0FBL0IsQ0FBakMsRUFBaUYsQ0FBakY7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLGlCQUFoQyxFQUFtRCxNQUFuRCxFQUEyRCxLQUFLLGlCQUFMLENBQXVCLENBQXZCLENBQTNELENBQWI7QUFDRDs7O3NDQUVpQixLLEVBQU87QUFDdkIsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxZQUFZLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBbEI7QUFDQSxVQUFNLFFBQVEsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFkO0FBQ0EsV0FBSyxpQkFBTCxDQUF1QixDQUF2QixFQUEwQixPQUExQixDQUFrQyxVQUFDLFlBQUQsRUFBa0I7QUFDbEQscUJBQWE7QUFDWCxxQkFBVyxTQURBO0FBRVgsaUJBQU87QUFGSSxTQUFiO0FBSUQsT0FMRDtBQU1EOztBQUVEOzs7Ozs7Ozs7Ozs7NENBU3dCLFksRUFBYyxNLEVBQVE7QUFDNUMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLHlCQUFMLENBQStCLENBQS9CLElBQW9DLEtBQUsseUJBQUwsQ0FBK0IsSUFBL0IsQ0FBb0MsSUFBcEMsQ0FBcEM7QUFDQSxhQUFLLHlCQUFMLENBQStCLENBQS9CLEVBQWtDLElBQWxDLENBQXVDLFlBQXZDO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyx5QkFBTCxDQUErQixDQUEvQixFQUFrQyxNQUFsQyxDQUF5QyxLQUFLLHlCQUFMLENBQStCLE9BQS9CLENBQXVDLENBQUMsWUFBRCxDQUF2QyxDQUF6QyxFQUFpRyxDQUFqRztBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUsseUJBQWhDLEVBQTJELE1BQTNELEVBQW1FLEtBQUsseUJBQUwsQ0FBK0IsQ0FBL0IsQ0FBbkUsQ0FBYjtBQUNEOzs7OENBRXlCLEssRUFBTztBQUMvQixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7QUFDQSxVQUFNLGNBQWMsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFwQjtBQUNBLFdBQUsseUJBQUwsQ0FBK0IsQ0FBL0IsRUFBa0MsT0FBbEMsQ0FBMEMsVUFBQyxZQUFELEVBQWtCO0FBQzFELHFCQUFhLFdBQWI7QUFDRCxPQUZEO0FBR0Q7O0FBRUQ7Ozs7Ozs7Ozs7OzsyQ0FTdUIsWSxFQUFjLE0sRUFBUTtBQUMzQyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssd0JBQUwsQ0FBOEIsQ0FBOUIsSUFBbUMsS0FBSyx3QkFBTCxDQUE4QixJQUE5QixDQUFtQyxJQUFuQyxDQUFuQztBQUNBLGFBQUssd0JBQUwsQ0FBOEIsQ0FBOUIsRUFBaUMsSUFBakMsQ0FBc0MsWUFBdEM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLHdCQUFMLENBQThCLENBQTlCLEVBQWlDLE1BQWpDLENBQXdDLEtBQUssd0JBQUwsQ0FBOEIsT0FBOUIsQ0FBc0MsQ0FBQyxZQUFELENBQXRDLENBQXhDLEVBQStGLENBQS9GO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyx3QkFBaEMsRUFBMEQsTUFBMUQsRUFBa0UsS0FBSyx3QkFBTCxDQUE4QixDQUE5QixDQUFsRSxDQUFiO0FBQ0Q7Ozs2Q0FFd0IsSyxFQUFPO0FBQzlCLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjs7QUFFQTtBQUNBLFVBQUksSUFBSSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLEtBQTBCLEtBQUssRUFBL0IsQ0FBUjtBQUNBLFVBQUksSUFBSSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLEtBQTBCLEtBQUssRUFBL0IsQ0FBUjtBQUNBLFVBQUksSUFBSSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLEtBQTBCLEtBQUssRUFBL0IsQ0FBUjtBQUNBLFVBQUksSUFBSSxLQUFLLFFBQUwsQ0FBYyxFQUFkLEVBQWtCLElBQWxCLEtBQTJCLEtBQUssRUFBaEMsQ0FBUjtBQUNBLFVBQU0sWUFBWSxLQUFLLElBQUwsQ0FBVSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixJQUFpQixLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixDQUFqQixHQUFrQyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixDQUFsQyxHQUFtRCxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixDQUE3RCxDQUFsQjs7QUFFQSxVQUFJLGNBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsYUFBSyxTQUFMO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsYUFBSyxTQUFMO0FBQ0Q7O0FBRUQsV0FBSyx3QkFBTCxDQUE4QixDQUE5QixFQUFpQyxPQUFqQyxDQUF5QyxVQUFDLFlBQUQsRUFBa0I7QUFDekQscUJBQWE7QUFDWCxhQUFHLENBRFE7QUFFWCxhQUFHLENBRlE7QUFHWCxhQUFHLENBSFE7QUFJWCxhQUFHO0FBSlEsU0FBYjtBQU1ELE9BUEQ7QUFRRDs7QUFFRDs7Ozs7Ozs7Ozs7O3FDQVNpQixZLEVBQWMsTSxFQUFRO0FBQ3JDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyxrQkFBTCxDQUF3QixDQUF4QixJQUE2QixLQUFLLGtCQUFMLENBQXdCLElBQXhCLENBQTZCLElBQTdCLENBQTdCO0FBQ0EsYUFBSyxrQkFBTCxDQUF3QixDQUF4QixFQUEyQixJQUEzQixDQUFnQyxZQUFoQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsRUFBMkIsTUFBM0IsQ0FBa0MsS0FBSyxrQkFBTCxDQUF3QixPQUF4QixDQUFnQyxDQUFDLFlBQUQsQ0FBaEMsQ0FBbEMsRUFBbUYsQ0FBbkY7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLGtCQUFoQyxFQUFvRCxNQUFwRCxFQUE0RCxLQUFLLGtCQUFMLENBQXdCLENBQXhCLENBQTVELENBQWI7QUFDRDs7O3VDQUVrQixLLEVBQU87QUFDeEIsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCO0FBQ0EsVUFBTSxlQUFlLElBQXJCO0FBQ0EsVUFBTSxRQUFRLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsWUFBbEIsQ0FBZDtBQUNBLFVBQU0sT0FBTyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFlBQWxCLENBQWI7QUFDQSxXQUFLLGtCQUFMLENBQXdCLENBQXhCLEVBQTJCLE9BQTNCLENBQW1DLFVBQUMsWUFBRCxFQUFrQjtBQUNuRCxxQkFBYTtBQUNYLGlCQUFPLEtBREk7QUFFWCxnQkFBTTtBQUNKLG1CQUFPLElBREg7QUFFSixrQkFBTTtBQUZGO0FBRkssU0FBYjtBQU9ELE9BUkQ7QUFTRDs7QUFFRDs7Ozs7Ozs7Ozs7OzBDQVNzQixZLEVBQWMsTSxFQUFRO0FBQzFDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyx1QkFBTCxDQUE2QixDQUE3QixJQUFrQyxLQUFLLHVCQUFMLENBQTZCLElBQTdCLENBQWtDLElBQWxDLENBQWxDO0FBQ0EsYUFBSyx1QkFBTCxDQUE2QixDQUE3QixFQUFnQyxJQUFoQyxDQUFxQyxZQUFyQztBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssdUJBQUwsQ0FBNkIsQ0FBN0IsRUFBZ0MsTUFBaEMsQ0FBdUMsS0FBSyx1QkFBTCxDQUE2QixPQUE3QixDQUFxQyxDQUFDLFlBQUQsQ0FBckMsQ0FBdkMsRUFBNkYsQ0FBN0Y7QUFDRDs7QUFFRCxhQUFPLE1BQU0sS0FBSyxxQkFBTCxDQUEyQixLQUFLLHVCQUFoQyxFQUF5RCxNQUF6RCxFQUFpRSxLQUFLLHVCQUFMLENBQTZCLENBQTdCLENBQWpFLENBQWI7QUFDRDs7OzRDQUV1QixLLEVBQU87QUFDN0IsVUFBTSxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQTFCOztBQUVBO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsRUFBdEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixFQUF0QztBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLEVBQXRDOztBQUVBO0FBQ0EsVUFBTSxRQUFRLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsSUFBdkM7QUFDQSxVQUFNLFFBQVEsS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixJQUF2QztBQUNBLFVBQU0sUUFBUSxLQUFLLFFBQUwsQ0FBYyxFQUFkLEVBQWtCLElBQWxCLElBQTBCLElBQXhDOztBQUVBO0FBQ0EsVUFBTSxXQUFXLEtBQUssUUFBTCxDQUFjLEVBQWQsRUFBa0IsSUFBbEIsSUFBMEIsSUFBM0M7QUFDQSxVQUFNLFdBQVcsS0FBSyxRQUFMLENBQWMsRUFBZCxFQUFrQixJQUFsQixJQUEwQixJQUEzQztBQUNBLFVBQU0sV0FBVyxLQUFLLFFBQUwsQ0FBYyxFQUFkLEVBQWtCLElBQWxCLElBQTBCLElBQTNDOztBQUVBLFdBQUssdUJBQUwsQ0FBNkIsQ0FBN0IsRUFBZ0MsT0FBaEMsQ0FBd0MsVUFBQyxZQUFELEVBQWtCO0FBQ3hELHFCQUFhO0FBQ1gseUJBQWU7QUFDYixlQUFHLElBRFU7QUFFYixlQUFHLElBRlU7QUFHYixlQUFHLElBSFU7QUFJYixrQkFBTTtBQUpPLFdBREo7QUFPWCxxQkFBVztBQUNULGVBQUcsS0FETTtBQUVULGVBQUcsS0FGTTtBQUdULGVBQUcsS0FITTtBQUlULGtCQUFNO0FBSkcsV0FQQTtBQWFYLG1CQUFTO0FBQ1AsZUFBRyxRQURJO0FBRVAsZUFBRyxRQUZJO0FBR1AsZUFBRyxRQUhJO0FBSVAsa0JBQU07QUFKQztBQWJFLFNBQWI7QUFvQkQsT0FyQkQ7QUFzQkQ7O0FBRUQ7Ozs7Ozs7Ozs7OztzQ0FTa0IsWSxFQUFjLE0sRUFBUTtBQUN0QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssbUJBQUwsQ0FBeUIsQ0FBekIsSUFBOEIsS0FBSyxtQkFBTCxDQUF5QixJQUF6QixDQUE4QixJQUE5QixDQUE5QjtBQUNBLGFBQUssbUJBQUwsQ0FBeUIsQ0FBekIsRUFBNEIsSUFBNUIsQ0FBaUMsWUFBakM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLG1CQUFMLENBQXlCLENBQXpCLEVBQTRCLE1BQTVCLENBQW1DLEtBQUssbUJBQUwsQ0FBeUIsT0FBekIsQ0FBaUMsQ0FBQyxZQUFELENBQWpDLENBQW5DLEVBQXFGLENBQXJGO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyxtQkFBaEMsRUFBcUQsTUFBckQsRUFBNkQsS0FBSyxtQkFBTCxDQUF5QixDQUF6QixDQUE3RCxDQUFiO0FBQ0Q7Ozt3Q0FFbUIsSyxFQUFPO0FBQ3pCLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjs7QUFFQTtBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLEtBQXRDO0FBQ0EsVUFBTSxRQUFRLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsS0FBdkM7QUFDQSxVQUFNLE1BQU0sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixLQUFyQzs7QUFFQSxXQUFLLG1CQUFMLENBQXlCLENBQXpCLEVBQTRCLE9BQTVCLENBQW9DLFVBQUMsWUFBRCxFQUFrQjtBQUNwRCxxQkFBYTtBQUNYLGdCQUFNLElBREs7QUFFWCxpQkFBTyxLQUZJO0FBR1gsZUFBSztBQUhNLFNBQWI7QUFLRCxPQU5EO0FBT0Q7O0FBRUQ7Ozs7Ozs7Ozs7OzsrQ0FTMkIsWSxFQUFjLE0sRUFBUTtBQUMvQyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssNEJBQUwsQ0FBa0MsQ0FBbEMsSUFBdUMsS0FBSyw0QkFBTCxDQUFrQyxJQUFsQyxDQUF1QyxJQUF2QyxDQUF2QztBQUNBLGFBQUssNEJBQUwsQ0FBa0MsQ0FBbEMsRUFBcUMsSUFBckMsQ0FBMEMsWUFBMUM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLDRCQUFMLENBQWtDLENBQWxDLEVBQXFDLE1BQXJDLENBQTRDLEtBQUssNEJBQUwsQ0FBa0MsT0FBbEMsQ0FBMEMsQ0FBQyxZQUFELENBQTFDLENBQTVDLEVBQXVHLENBQXZHO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FDWCxLQUFLLDRCQURNLEVBRVgsTUFGVyxFQUdYLEtBQUssNEJBQUwsQ0FBa0MsQ0FBbEMsQ0FIVyxDQUFiO0FBS0Q7OztpREFFNEIsSyxFQUFPO0FBQ2xDLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjs7QUFFQTtBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLENBQXRDO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsQ0FBdEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixDQUF0QztBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLENBQXRDO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsQ0FBdEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixDQUF0QztBQUNBLFVBQU0sT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLElBQXlCLENBQXRDO0FBQ0EsVUFBTSxPQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsSUFBakIsSUFBeUIsQ0FBdEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixDQUF0Qzs7QUFFQSxXQUFLLDRCQUFMLENBQWtDLENBQWxDLEVBQXFDLE9BQXJDLENBQTZDLFVBQUMsWUFBRCxFQUFrQjtBQUM3RCxxQkFBYTtBQUNYLGdCQUFNLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBREs7QUFFWCxnQkFBTSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUZLO0FBR1gsZ0JBQU0sQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWI7QUFISyxTQUFiO0FBS0QsT0FORDtBQU9EOztBQUVEOzs7Ozs7Ozs7Ozs7d0NBU29CLFksRUFBYyxNLEVBQVE7QUFDeEMsVUFBSSxNQUFKLEVBQVk7QUFDVixhQUFLLHFCQUFMLENBQTJCLENBQTNCLElBQWdDLEtBQUsscUJBQUwsQ0FBMkIsSUFBM0IsQ0FBZ0MsSUFBaEMsQ0FBaEM7QUFDQSxhQUFLLHFCQUFMLENBQTJCLENBQTNCLEVBQThCLElBQTlCLENBQW1DLFlBQW5DO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxxQkFBTCxDQUEyQixDQUEzQixFQUE4QixNQUE5QixDQUFxQyxLQUFLLHFCQUFMLENBQTJCLE9BQTNCLENBQW1DLENBQUMsWUFBRCxDQUFuQyxDQUFyQyxFQUF5RixDQUF6RjtBQUNEOztBQUVELGFBQU8sTUFBTSxLQUFLLHFCQUFMLENBQTJCLEtBQUsscUJBQWhDLEVBQXVELE1BQXZELEVBQStELEtBQUsscUJBQUwsQ0FBMkIsQ0FBM0IsQ0FBL0QsQ0FBYjtBQUNEOzs7MENBRXFCLEssRUFBTztBQUMzQixVQUFNLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBMUI7O0FBRUE7QUFDQSxVQUFNLFVBQVUsS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixJQUF5QixLQUF6Qzs7QUFFQSxXQUFLLHFCQUFMLENBQTJCLENBQTNCLEVBQThCLE9BQTlCLENBQXNDLFVBQUMsWUFBRCxFQUFrQjtBQUN0RCxxQkFBYTtBQUNYLGlCQUFPLE9BREk7QUFFWCxnQkFBTTtBQUZLLFNBQWI7QUFJRCxPQUxEO0FBTUQ7O0FBRUQ7Ozs7Ozs7Ozs7Ozs4Q0FTMEIsWSxFQUFjLE0sRUFBUTtBQUM5QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssMkJBQUwsQ0FBaUMsQ0FBakMsSUFBc0MsS0FBSywyQkFBTCxDQUFpQyxJQUFqQyxDQUFzQyxJQUF0QyxDQUF0QztBQUNBLGFBQUssMkJBQUwsQ0FBaUMsQ0FBakMsRUFBb0MsSUFBcEMsQ0FBeUMsWUFBekM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLDJCQUFMLENBQWlDLENBQWpDLEVBQW9DLE1BQXBDLENBQTJDLEtBQUssMkJBQUwsQ0FBaUMsT0FBakMsQ0FBeUMsQ0FBQyxZQUFELENBQXpDLENBQTNDLEVBQXFHLENBQXJHO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FDWCxLQUFLLDJCQURNLEVBRVgsTUFGVyxFQUdYLEtBQUssMkJBQUwsQ0FBaUMsQ0FBakMsQ0FIVyxDQUFiO0FBS0Q7OztnREFFMkIsSyxFQUFPO0FBQ2pDLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjtBQUNBLFVBQU0sSUFBSSxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBbkIsQ0FBVjtBQUNBLFVBQU0sSUFBSSxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBbkIsQ0FBVjtBQUNBLFVBQU0sSUFBSSxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBbkIsQ0FBVjs7QUFFQSxXQUFLLDJCQUFMLENBQWlDLENBQWpDLEVBQW9DLE9BQXBDLENBQTRDLFVBQUMsWUFBRCxFQUFrQjtBQUM1RCxxQkFBYTtBQUNYLGFBQUcsQ0FEUTtBQUVYLGFBQUcsQ0FGUTtBQUdYLGFBQUc7QUFIUSxTQUFiO0FBS0QsT0FORDtBQU9EOztBQUVEOztBQUVBOzs7O3FDQUVpQixNLEVBQVE7QUFDdkI7QUFDQSxVQUFJLEtBQUssdUJBQUwsS0FBaUMsU0FBckMsRUFBZ0Q7QUFDOUMsYUFBSyx1QkFBTCxHQUErQixDQUFDLENBQUMsQ0FBRixFQUFLLENBQUMsQ0FBTixFQUFTLENBQUMsQ0FBVixFQUFhLENBQUMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QixDQUFDLENBQTlCLEVBQWlDLENBQUMsQ0FBbEMsRUFBcUMsQ0FBQyxDQUF0QyxFQUF5QyxDQUFDLENBQTFDLEVBQTZDLENBQTdDLEVBQWdELENBQWhELEVBQW1ELENBQW5ELEVBQXNELENBQXRELENBQS9CO0FBQ0Q7QUFDRCxVQUFJLEtBQUssMkJBQUwsS0FBcUMsU0FBekMsRUFBb0Q7QUFDbEQsYUFBSywyQkFBTCxHQUFtQyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLEVBQXRCLEVBQTBCLEVBQTFCLEVBQThCLEVBQTlCLEVBQWtDLEVBQWxDLEVBQXNDLEVBQXRDLEVBQTBDLEVBQTFDLEVBQThDLEVBQTlDLEVBQWtELEVBQWxELEVBQXNELEVBQXRELEVBQTBELEVBQTFELEVBQThELEVBQTlELEVBQWtFLEVBQWxFLEVBQXNFLEVBQXRFLEVBQTBFLEVBQTFFLEVBQThFLEVBQTlFLEVBQWtGLEVBQWxGLEVBQXNGLEVBQXRGLEVBQTBGLEVBQTFGLEVBQThGLEVBQTlGLEVBQWtHLEVBQWxHLEVBQXNHLEVBQXRHLEVBQTBHLEVBQTFHLEVBQThHLEdBQTlHLEVBQW1ILEdBQW5ILEVBQXdILEdBQXhILEVBQTZILEdBQTdILEVBQWtJLEdBQWxJLEVBQXVJLEdBQXZJLEVBQTRJLEdBQTVJLEVBQWlKLEdBQWpKLEVBQ2pDLEdBRGlDLEVBQzVCLEdBRDRCLEVBQ3ZCLEdBRHVCLEVBQ2xCLEdBRGtCLEVBQ2IsR0FEYSxFQUNSLEdBRFEsRUFDSCxHQURHLEVBQ0UsR0FERixFQUNPLEdBRFAsRUFDWSxHQURaLEVBQ2lCLEdBRGpCLEVBQ3NCLEdBRHRCLEVBQzJCLEdBRDNCLEVBQ2dDLEdBRGhDLEVBQ3FDLEdBRHJDLEVBQzBDLEdBRDFDLEVBQytDLElBRC9DLEVBQ3FELElBRHJELEVBQzJELElBRDNELEVBQ2lFLElBRGpFLEVBQ3VFLElBRHZFLEVBQzZFLElBRDdFLEVBQ21GLElBRG5GLEVBQ3lGLElBRHpGLEVBQytGLElBRC9GLEVBQ3FHLElBRHJHLEVBQzJHLElBRDNHLEVBQ2lILElBRGpILEVBQ3VILElBRHZILEVBQzZILElBRDdILEVBQ21JLElBRG5JLEVBQ3lJLElBRHpJLEVBQytJLElBRC9JLEVBQ3FKLElBRHJKLEVBRWpDLElBRmlDLEVBRTNCLElBRjJCLEVBRXJCLElBRnFCLEVBRWYsSUFGZSxFQUVULElBRlMsRUFFSCxJQUZHLEVBRUcsS0FGSCxFQUVVLEtBRlYsRUFFaUIsS0FGakIsRUFFd0IsS0FGeEIsRUFFK0IsS0FGL0IsRUFFc0MsS0FGdEMsRUFFNkMsS0FGN0MsRUFFb0QsS0FGcEQsRUFFMkQsS0FGM0QsRUFFa0UsS0FGbEUsRUFFeUUsS0FGekUsRUFFZ0YsS0FGaEYsRUFFdUYsS0FGdkYsQ0FBbkM7QUFHRDtBQUNELFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyx3QkFBTCxDQUE4QixDQUE5QixJQUFtQyxLQUFLLHdCQUFMLENBQThCLElBQTlCLENBQW1DLElBQW5DLENBQW5DO0FBQ0E7QUFDQSxZQUFJLEtBQUssUUFBTCxLQUFrQixTQUF0QixFQUFpQztBQUMvQixjQUFNLGVBQWUsT0FBTyxZQUFQLElBQXVCLE9BQU8sa0JBQW5EO0FBQ0EsZUFBSyxRQUFMLEdBQWdCLElBQUksWUFBSixFQUFoQjtBQUNEO0FBQ0Y7QUFDRCxhQUFPLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyx3QkFBaEMsRUFBMEQsTUFBMUQsRUFBa0UsS0FBSyx3QkFBTCxDQUE4QixDQUE5QixDQUFsRSxDQUFQO0FBQ0Q7Ozs2Q0FDd0IsSyxFQUFPO0FBQzlCLFVBQU0sY0FBYyxNQUFNLE1BQU4sQ0FBYSxLQUFiLENBQW1CLE1BQXZDO0FBQ0EsVUFBTSxRQUFRO0FBQ1osZ0JBQVEsSUFBSSxRQUFKLENBQWEsWUFBWSxLQUFaLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQWIsQ0FESTtBQUVaLGNBQU0sSUFBSSxRQUFKLENBQWEsWUFBWSxLQUFaLENBQWtCLENBQWxCLENBQWI7QUFGTSxPQUFkO0FBSUEsVUFBTSxlQUFlLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFyQjtBQUNBLFdBQUssaUJBQUwsQ0FBdUIsWUFBdkI7QUFDRDtBQUNEOzs7O2lDQUNhLEssRUFBTztBQUNsQjtBQUNBLFVBQU0sd0JBQXdCLE1BQU0sSUFBTixDQUFXLFVBQXpDO0FBQ0EsVUFBTSxjQUFjLElBQUksV0FBSixDQUFnQixHQUFoQixDQUFwQjtBQUNBLFVBQU0sTUFBTSxJQUFJLFFBQUosQ0FBYSxXQUFiLENBQVo7QUFDQSxVQUFJLGFBQUo7QUFDQSxVQUFJLGFBQWEsS0FBakI7QUFDQSxVQUFJLGNBQWMsQ0FBbEI7QUFDQSxVQUFJLFFBQVEsQ0FBWjtBQUNBLFVBQUksT0FBTyxDQUFYO0FBQ0EsVUFBSSxhQUFKOztBQUVBO0FBQ0EsVUFBSSxpQkFBaUIsTUFBTSxNQUFOLENBQWEsUUFBYixDQUFzQixDQUF0QixFQUF5QixLQUF6QixDQUFyQjtBQUNBO0FBQ0EsVUFBSSxRQUFRLE1BQU0sTUFBTixDQUFhLE9BQWIsQ0FBcUIsQ0FBckIsQ0FBWjtBQUNBLFVBQUksUUFBUSxDQUFaLEVBQWU7QUFDYixnQkFBUSxDQUFSO0FBQ0Q7QUFDRCxVQUFJLFFBQVEsRUFBWixFQUFnQjtBQUNkLGdCQUFRLEVBQVI7QUFDRDtBQUNELGFBQU8sS0FBSywyQkFBTCxDQUFpQyxLQUFqQyxDQUFQO0FBQ0EsV0FBSyxJQUFJLE1BQU0sQ0FBVixFQUFhLE9BQU8sQ0FBekIsRUFBNEIsTUFBTSxxQkFBbEMsRUFBeUQsUUFBUSxDQUFqRSxFQUFvRTtBQUNsRTtBQUNBLFlBQUksVUFBSixFQUFnQjtBQUNkLGtCQUFRLGNBQWMsSUFBdEI7QUFDQTtBQUNELFNBSEQsTUFHTztBQUNMLHdCQUFjLE1BQU0sSUFBTixDQUFXLE9BQVgsQ0FBbUIsR0FBbkIsQ0FBZDtBQUNBLGtCQUFTLGVBQWUsQ0FBaEIsR0FBcUIsSUFBN0I7QUFDRDtBQUNELHFCQUFhLENBQUMsVUFBZDtBQUNBO0FBQ0EsaUJBQVMsS0FBSyx1QkFBTCxDQUE2QixLQUE3QixDQUFUO0FBQ0EsWUFBSSxRQUFRLENBQVosRUFBZTtBQUNiLGtCQUFRLENBQVI7QUFDRDtBQUNELFlBQUksUUFBUSxFQUFaLEVBQWdCO0FBQ2Qsa0JBQVEsRUFBUjtBQUNEO0FBQ0Q7QUFDQSxlQUFPLFFBQVEsQ0FBZjtBQUNBLGdCQUFRLFFBQVEsQ0FBaEI7QUFDQTtBQUNBLGVBQVEsUUFBUSxDQUFoQjtBQUNBLFlBQUksQ0FBQyxRQUFRLENBQVQsSUFBYyxDQUFsQixFQUFxQjtBQUNuQixrQkFBUSxJQUFSO0FBQ0Q7QUFDRCxZQUFJLENBQUMsUUFBUSxDQUFULElBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsa0JBQVMsUUFBUSxDQUFqQjtBQUNEO0FBQ0QsWUFBSSxDQUFDLFFBQVEsQ0FBVCxJQUFjLENBQWxCLEVBQXFCO0FBQ25CLGtCQUFTLFFBQVEsQ0FBakI7QUFDRDtBQUNELFlBQUksT0FBTyxDQUFYLEVBQWM7QUFDWiw0QkFBa0IsSUFBbEI7QUFDRCxTQUZELE1BRU87QUFDTCw0QkFBa0IsSUFBbEI7QUFDRDtBQUNEO0FBQ0EsWUFBSSxpQkFBaUIsS0FBckIsRUFBNEI7QUFDMUIsMkJBQWlCLEtBQWpCO0FBQ0QsU0FGRCxNQUVPLElBQUksaUJBQWlCLENBQUMsS0FBdEIsRUFBNkI7QUFDbEMsMkJBQWlCLENBQUMsS0FBbEI7QUFDRDtBQUNEO0FBQ0EsZUFBTyxLQUFLLDJCQUFMLENBQWlDLEtBQWpDLENBQVA7QUFDQTtBQUNBLFlBQUksUUFBSixDQUFhLElBQWIsRUFBbUIsY0FBbkIsRUFBbUMsSUFBbkM7QUFDRDtBQUNELGFBQU8sR0FBUDtBQUNEOzs7c0NBQ2lCLEssRUFBTztBQUN2QixVQUFJLEtBQUssV0FBTCxLQUFxQixTQUF6QixFQUFvQztBQUNsQyxhQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDRDtBQUNELFdBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixLQUF0QjtBQUNBLFVBQUksS0FBSyxXQUFMLENBQWlCLE1BQXJCLEVBQTZCO0FBQzNCLGFBQUsscUJBQUw7QUFDRDtBQUNGOzs7NENBQ3VCO0FBQ3RCLGFBQU8sS0FBSyxXQUFMLENBQWlCLE1BQWpCLEdBQTBCLENBQWpDLEVBQW9DO0FBQ2xDLFlBQU0sYUFBYSxJQUFuQixDQURrQyxDQUNUO0FBQ3pCLFlBQU0sU0FBUyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsRUFBZjtBQUNBLFlBQU0sV0FBVyxDQUFqQjtBQUNBLFlBQU0sYUFBYSxPQUFPLFVBQVAsR0FBb0IsQ0FBdkM7QUFDQSxZQUFJLEtBQUssY0FBTCxLQUF3QixTQUE1QixFQUF1QztBQUNyQyxlQUFLLGNBQUwsR0FBc0IsQ0FBdEI7QUFDRDtBQUNELFlBQU0sZ0JBQWdCLEtBQUssUUFBTCxDQUFjLFlBQWQsQ0FBMkIsUUFBM0IsRUFBcUMsVUFBckMsRUFBaUQsS0FBakQsQ0FBdEI7QUFDQTtBQUNBLFlBQU0sZUFBZSxjQUFjLGNBQWQsQ0FBNkIsQ0FBN0IsQ0FBckI7QUFDQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxVQUFQLEdBQW9CLENBQXhDLEVBQTJDLEdBQTNDLEVBQWdEO0FBQzlDLHVCQUFhLENBQWIsSUFBa0IsT0FBTyxRQUFQLENBQWdCLElBQUksQ0FBcEIsRUFBdUIsSUFBdkIsSUFBK0IsT0FBakQ7QUFDRDtBQUNELFlBQU0sU0FBUyxLQUFLLFFBQUwsQ0FBYyxrQkFBZCxFQUFmO0FBQ0EsZUFBTyxNQUFQLEdBQWdCLGFBQWhCO0FBQ0EsZUFBTyxPQUFQLENBQWUsS0FBSyxRQUFMLENBQWMsV0FBN0I7QUFDQSxZQUFJLEtBQUssY0FBTCxLQUF3QixDQUE1QixFQUErQjtBQUM3QixlQUFLLGNBQUwsR0FBc0IsS0FBSyxRQUFMLENBQWMsV0FBZCxHQUE0QixVQUFsRDtBQUNEO0FBQ0QsZUFBTyxLQUFQLENBQWEsS0FBSyxjQUFsQjtBQUNBLGFBQUssY0FBTCxJQUF1QixPQUFPLE1BQVAsQ0FBYyxRQUFyQztBQUNEO0FBQ0Y7QUFDRDs7QUFFQTtBQUNBOzs7Ozs7Ozs7NENBTXdCO0FBQ3RCLFVBQUk7QUFDRixZQUFNLGVBQWUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLHFCQUFwQixDQUEzQjtBQUNBLFlBQU0sUUFBUSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBZDs7QUFFQSxlQUFPO0FBQ0wsaUJBQU8sS0FERjtBQUVMLGdCQUFNO0FBRkQsU0FBUDtBQUlELE9BUkQsQ0FRRSxPQUFPLEtBQVAsRUFBYztBQUNkLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7Ozs2Q0FTeUIsWSxFQUFjLE0sRUFBUTtBQUM3QyxVQUFJLE1BQUosRUFBWTtBQUNWLGFBQUssMEJBQUwsQ0FBZ0MsQ0FBaEMsSUFBcUMsS0FBSywwQkFBTCxDQUFnQyxJQUFoQyxDQUFxQyxJQUFyQyxDQUFyQztBQUNBLGFBQUssMEJBQUwsQ0FBZ0MsQ0FBaEMsRUFBbUMsSUFBbkMsQ0FBd0MsWUFBeEM7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLDBCQUFMLENBQWdDLENBQWhDLEVBQW1DLE1BQW5DLENBQTBDLEtBQUssMEJBQUwsQ0FBZ0MsT0FBaEMsQ0FBd0MsQ0FBQyxZQUFELENBQXhDLENBQTFDLEVBQW1HLENBQW5HO0FBQ0Q7O0FBRUQsYUFBTyxNQUFNLEtBQUsscUJBQUwsQ0FBMkIsS0FBSyxxQkFBaEMsRUFBdUQsTUFBdkQsRUFBK0QsS0FBSywwQkFBTCxDQUFnQyxDQUFoQyxDQUEvRCxDQUFiO0FBQ0Q7OzsrQ0FFMEIsSyxFQUFPO0FBQ2hDLFVBQU0sT0FBTyxNQUFNLE1BQU4sQ0FBYSxLQUExQjtBQUNBLFVBQU0sUUFBUSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWQ7O0FBRUEsV0FBSywwQkFBTCxDQUFnQyxDQUFoQyxFQUFtQyxPQUFuQyxDQUEyQyxVQUFDLFlBQUQsRUFBa0I7QUFDM0QscUJBQWE7QUFDWCxpQkFBTyxLQURJO0FBRVgsZ0JBQU07QUFGSyxTQUFiO0FBSUQsT0FMRDtBQU1EOzs7Ozs7QUFHSDs7O0FDOXBFQTs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7SUFFYSxnQixXQUFBLGdCOzs7Ozs7Ozs7Ozt3Q0FJVztBQUNsQixVQUFJLENBQUMsS0FBSyxVQUFWLEVBQXNCO0FBQ3BCLFlBQU0sV0FBVyxLQUFLLFdBQUwsQ0FBaUIsUUFBbEM7QUFDQSxZQUFJLFFBQUosRUFBYztBQUNaLGNBQUksQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsZ0JBQXRCLEVBQXdDO0FBQ3RDLGlCQUFLLFdBQUwsQ0FBaUIsZ0JBQWpCLEdBQW9DLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFwQztBQUNBLGlCQUFLLFdBQUwsQ0FBaUIsZ0JBQWpCLENBQWtDLFNBQWxDLEdBQThDLFFBQTlDO0FBQ0Q7QUFDRCxlQUFLLFlBQUwsQ0FBa0IsRUFBQyxNQUFNLE1BQVAsRUFBbEI7QUFDQSxjQUFNLE1BQU0sU0FBUyxVQUFULENBQ1YsS0FBSyxXQUFMLENBQWlCLGdCQUFqQixDQUFrQyxPQUR4QixFQUNpQyxJQURqQyxDQUFaO0FBRUEsZUFBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLEdBQTVCO0FBQ0Q7QUFDRjtBQUNEO0FBQ0Q7Ozt3QkFsQnFCO0FBQ3BCO0FBQ0Q7Ozs7RUFIaUMsK0JBQWUsV0FBZixDOztJQXNCekIsTyxXQUFBLE87Ozs7Ozs7Ozs7O3dCQUNhO0FBQ3BCO0FBSUQ7Ozs7RUFOd0IsZ0I7O0FBUzNCLGVBQWUsTUFBZixDQUFzQixVQUF0QixFQUFrQyxPQUFsQzs7SUFFVyxPLFdBQUEsTzs7Ozs7Ozs7Ozs7d0JBQ2E7QUFDcEI7QUFzQkQ7Ozs7RUF4QndCLGdCOztBQTBCM0IsZUFBZSxNQUFmLENBQXNCLFVBQXRCLEVBQWtDLE9BQWxDOztJQUVXLEssV0FBQSxLOzs7Ozs7Ozs7Ozt3QkFDYTtBQUNwQjtBQTRDRDs7OztFQTlDc0IsZ0I7O0FBZ0R6QixlQUFlLE1BQWYsQ0FBc0IsUUFBdEIsRUFBZ0MsS0FBaEM7Ozs7Ozs7Ozs7Ozs7UUNSYyxjLEdBQUEsYzs7Ozs7Ozs7OztBQXpHaEI7Ozs7Ozs7Ozs7QUFVQSxJQUFNLGNBQWMsWUFBcEI7QUFDQSxJQUFNLFlBQVksVUFBbEI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0M7QUFDaEMsTUFBSSxDQUFDLFFBQVEsVUFBYixFQUF5QjtBQUN2QixZQUFRLFdBQVIsSUFBdUIsSUFBdkI7QUFDQTtBQUNEO0FBQ0QsUUFBTSxJQUFOLENBQVcsUUFBUSxVQUFSLENBQW1CLGdCQUFuQixDQUFvQyxPQUFwQyxDQUFYLEVBQXlELE9BQXpELENBQWlFLGlCQUFTO0FBQ3hFLFFBQU0sT0FBTyx1QkFBdUIsT0FBdkIsRUFBZ0MsTUFBTSxXQUF0QyxDQUFiO0FBQ0EsUUFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFBQTs7QUFDZCxjQUFRLFdBQVIsSUFBdUIsUUFBUSxXQUFSLEtBQXdCLEVBQS9DO0FBQ0Esc0NBQVEsV0FBUixHQUFxQixJQUFyQixnREFBNkIsS0FBSyxLQUFsQztBQUNBLFlBQU0sV0FBTixHQUFvQixLQUFLLEdBQXpCO0FBQ0Q7QUFDRixHQVBEO0FBUUQ7O0FBRUQsU0FBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDO0FBQy9CLE1BQUksQ0FBQyxRQUFRLGNBQVIsQ0FBdUIsWUFBdkIsQ0FBTCxFQUEyQztBQUN6QyxvQkFBZ0IsT0FBaEI7QUFDRDtBQUNGOztBQUVELFNBQVMsa0JBQVQsQ0FBNEIsT0FBNUIsRUFBcUM7QUFDbkMsaUJBQWUsT0FBZjtBQUNBLFNBQU8sUUFBUSxXQUFSLENBQVA7QUFDRDs7QUFFRDtBQUNBOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUyxzQkFBVCxDQUFnQyxPQUFoQyxFQUF5QyxPQUF6QyxFQUFrRDtBQUNoRCxNQUFJLGNBQUo7QUFDQSxNQUFJLE1BQU0sUUFBUSxPQUFSLENBQWdCLEtBQWhCLEVBQXVCLFVBQUMsQ0FBRCxFQUFJLFFBQUosRUFBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCLFdBQTFCLEVBQXVDLFFBQXZDLEVBQW9EO0FBQ25GLFlBQVEsU0FBUyxFQUFqQjtBQUNBLFFBQUksUUFBUSxFQUFaO0FBQ0EsUUFBTSxhQUFhLFNBQVMsS0FBVCxDQUFlLFNBQWYsQ0FBbkI7QUFDQSxlQUFXLE9BQVgsQ0FBbUIsZ0JBQVE7QUFDekIsVUFBTSxJQUFJLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBVjtBQUNBLFVBQU0sT0FBTyxFQUFFLEtBQUYsR0FBVSxJQUFWLEVBQWI7QUFDQSxVQUFNLFFBQVEsRUFBRSxJQUFGLENBQU8sR0FBUCxDQUFkO0FBQ0EsWUFBTSxJQUFOLElBQWMsS0FBZDtBQUNELEtBTEQ7QUFNQSxRQUFNLEtBQUssaUJBQWlCLE9BQWpCLENBQVg7QUFDQSxVQUFNLElBQU4sQ0FBVyxFQUFDLGtCQUFELEVBQVcsd0JBQVgsRUFBd0IsVUFBeEIsRUFBOEIsWUFBOUIsRUFBcUMsU0FBUyxRQUFRLEtBQXRELEVBQVg7QUFDQSxRQUFJLFlBQVksRUFBaEI7QUFDQSxTQUFLLElBQUksQ0FBVCxJQUFjLEtBQWQsRUFBcUI7QUFDbkIsa0JBQWUsU0FBZixZQUErQixXQUFXLEVBQVgsRUFBZSxJQUFmLEVBQXFCLENBQXJCLEVBQXdCLFdBQXhCLENBQS9CLFVBQXdFLE1BQU0sQ0FBTixDQUF4RTtBQUNEO0FBQ0QsbUJBQVksWUFBWSxHQUF4QixlQUFvQyxVQUFVLElBQVYsRUFBcEM7QUFDRCxHQWpCUyxDQUFWO0FBa0JBLFNBQU8sRUFBQyxZQUFELEVBQVEsUUFBUixFQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxJQUFJLFNBQVMsQ0FBYjtBQUNBLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUM7QUFDakMsTUFBSSxRQUFRLFNBQVIsS0FBc0IsU0FBMUIsRUFBcUM7QUFDbkMsWUFBUSxTQUFSLElBQXFCLFFBQXJCO0FBQ0Q7QUFDRCxTQUFPLFFBQVEsU0FBUixDQUFQO0FBQ0Q7O0FBRUQsSUFBTSxRQUFRLFNBQWQ7QUFDQSxJQUFNLFFBQVEsa0VBQWQ7O0FBRUE7QUFDQSxTQUFTLFVBQVQsQ0FBb0IsRUFBcEIsRUFBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0MsV0FBcEMsRUFBaUQ7QUFDL0MsaUJBQWEsRUFBYixjQUF3QixJQUF4QixTQUFnQyxJQUFoQyxJQUF1QyxvQkFBa0IsWUFBWSxPQUFaLENBQW9CLEtBQXBCLEVBQTJCLEVBQTNCLENBQWxCLEdBQXFELEVBQTVGO0FBQ0Q7O0FBRUQ7Ozs7O0FBS08sU0FBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDO0FBQ3RDLE1BQUksUUFBUSxVQUFaLEVBQXdCO0FBQ3RCLFFBQU0sV0FBVyxRQUFRLFVBQVIsQ0FBbUIsYUFBbkIsQ0FBaUMsY0FBakMsQ0FBakI7QUFDQSxRQUFJLFFBQUosRUFBYztBQUNaLGVBQVMsVUFBVCxDQUFvQixXQUFwQixDQUFnQyxRQUFoQztBQUNEO0FBQ0Y7QUFDRCxNQUFNLE9BQU8sUUFBUSxXQUFSLEdBQXNCLElBQW5DO0FBQ0EsTUFBSSxJQUFKLEVBQVU7QUFDUjtBQUNBO0FBQ0EsbUJBQWUsSUFBZjtBQUNBLFFBQU0sTUFBTSxpQkFBaUIsT0FBakIsQ0FBWjtBQUNBLFFBQUksR0FBSixFQUFTO0FBQ1AsVUFBTSxXQUFXLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFqQjtBQUNBLGVBQVMsV0FBVCxHQUF1QixHQUF2QjtBQUNBLGNBQVEsVUFBUixDQUFtQixXQUFuQixDQUErQixRQUEvQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7O0FBWUEsU0FBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQztBQUNqQyxpQkFBZSxPQUFmO0FBQ0EsTUFBTSxLQUFLLGlCQUFpQixPQUFqQixDQUFYO0FBQ0EsTUFBTSxZQUFZLFFBQVEsVUFBUixDQUFtQixnQkFBbkIsQ0FBb0MsUUFBcEMsQ0FBbEI7QUFDQSxNQUFJLE1BQU0sRUFBVjtBQUNBLE9BQUssSUFBSSxJQUFFLENBQVgsRUFBYyxJQUFJLFVBQVUsTUFBNUIsRUFBb0MsR0FBcEMsRUFBeUM7QUFDdkMsUUFBTSxPQUFPLFVBQVUsQ0FBVixFQUFhLFlBQWIsQ0FBMEIsTUFBMUIsQ0FBYjtBQUNBLFFBQU0sV0FBVyxpQkFBaUIsSUFBakIsQ0FBakI7QUFDQSxVQUFTLEdBQVQsWUFBbUIsZ0JBQWdCLFFBQWhCLEVBQTBCLElBQTFCLEVBQWdDLE9BQWhDLENBQW5CO0FBQ0Q7QUFDRCxTQUFPLEdBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFNBQVMsZUFBVCxDQUF5QixRQUF6QixFQUFtQyxJQUFuQyxFQUF5QyxPQUF6QyxFQUFrRDtBQUNoRCxNQUFJLE9BQU8sRUFBWDtBQUNBLFdBQVMsT0FBVCxDQUFpQixnQkFBUTtBQUN2QixRQUFJLENBQUMsS0FBSyxPQUFWLEVBQW1CO0FBQ2pCLFVBQU0sUUFBUSxhQUFhLEtBQUssSUFBbEIsRUFBd0IsT0FBeEIsQ0FBZDtBQUNBLFVBQUksS0FBSixFQUFXO0FBQ1QsYUFBSyxJQUFJLE1BQVQsSUFBbUIsS0FBbkIsRUFBMEI7QUFDeEIsY0FBSSxjQUFjLE1BQU0sTUFBTixDQUFsQjtBQUNBLGNBQUksWUFBWSxFQUFoQjtBQUNBLGVBQUssSUFBSSxDQUFULElBQWMsV0FBZCxFQUEyQjtBQUN6QixzQkFBVSxJQUFWLENBQWtCLENBQWxCLFVBQXdCLFlBQVksQ0FBWixDQUF4QjtBQUNEO0FBQ0QsaUJBQVUsSUFBVixpQkFBMEIsSUFBMUIsVUFBbUMsTUFBbkMsY0FBa0QsVUFBVSxJQUFWLENBQWUsTUFBZixDQUFsRDtBQUNEO0FBQ0Y7QUFDRjtBQUNGLEdBZEQ7QUFlQSxTQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7QUFLQSxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQzlCLE1BQU0sU0FBUyxPQUFPLEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FBUCxHQUErQixFQUE5QztBQUNBLE1BQUksUUFBUSxFQUFaO0FBQ0EsU0FBTyxPQUFQLENBQWUsYUFBSztBQUNsQixRQUFNLElBQUksSUFBSSxFQUFFLEtBQUYsQ0FBUSw0QkFBUixDQUFKLEdBQTRDLEVBQXREO0FBQ0EsUUFBSSxDQUFKLEVBQU87QUFDTCxZQUFNLElBQU4sQ0FBVyxFQUFDLE1BQU0sRUFBRSxDQUFGLEtBQVEsRUFBRSxDQUFGLENBQWYsRUFBcUIsU0FBUyxFQUFFLENBQUYsSUFBTyxFQUFFLENBQUYsQ0FBUCxHQUFjLElBQTVDLEVBQVg7QUFDRDtBQUNGLEdBTEQ7QUFNQSxTQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7QUFXQSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsT0FBNUIsRUFBcUMsWUFBckMsRUFBbUQ7QUFDakQsTUFBTSxPQUFPLFdBQVcsUUFBUSxXQUFSLEdBQXNCLElBQTlDO0FBQ0EsTUFBSSxDQUFDLElBQUwsRUFBVztBQUNUO0FBQ0Q7QUFDRDtBQUNBLE1BQUksUUFBUSxpQkFBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsWUFBN0IsQ0FBWjtBQUNBO0FBQ0EsTUFBTSxhQUFhLGFBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixDQUFuQjtBQUNBLFVBQVEsYUFBYSxLQUFiLEVBQW9CLFVBQXBCLENBQVI7QUFDQTtBQUNBLE1BQUksQ0FBQyxZQUFMLEVBQW1CO0FBQ2pCO0FBQ0EsUUFBTSxXQUFXLGlCQUFpQixRQUFRLFlBQVIsQ0FBcUIsTUFBckIsQ0FBakIsQ0FBakI7QUFDQTtBQUNBLGFBQVMsT0FBVCxDQUFpQixnQkFBUTtBQUN2QixVQUFJLFdBQVcsS0FBSyxPQUFMLElBQWlCLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsS0FBNkIsQ0FBN0Q7QUFDQSxVQUFJLFFBQVEsS0FBSyxPQUFiLElBQXdCLFFBQTVCLEVBQXNDO0FBQ3BDLFlBQU0sZUFBZSxXQUFXLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsSUFBdkIsQ0FBWCxHQUEwQyxLQUFLLElBQXBFO0FBQ0EsWUFBTSxZQUFZLGFBQWEsWUFBYixFQUEyQixJQUEzQixDQUFsQjtBQUNBLGdCQUFRLGFBQWEsS0FBYixFQUFvQixTQUFwQixDQUFSO0FBQ0Q7QUFDRixLQVBEO0FBUUQ7O0FBRUQsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLE9BQWhDLEVBQXlDLFlBQXpDLEVBQXVEO0FBQ3JELE1BQUksY0FBSjtBQUNBLE1BQU0sUUFBUSxtQkFBbUIsT0FBbkIsQ0FBZDtBQUNBLE1BQUksS0FBSixFQUFXO0FBQ1QsUUFBTSxLQUFLLGlCQUFpQixPQUFqQixDQUFYO0FBQ0EsUUFBSSxLQUFKLEVBQVc7QUFDVCxZQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBVTtBQUN0QixZQUFJLEtBQUssSUFBTCxJQUFhLElBQWIsS0FBc0IsQ0FBQyxZQUFELElBQWlCLEtBQUssT0FBNUMsQ0FBSixFQUEwRDtBQUN4RCxrQkFBUSxhQUFhLEtBQWIsRUFBb0IsSUFBcEIsRUFBMEIsRUFBMUIsRUFBOEIsSUFBOUIsQ0FBUjtBQUNEO0FBQ0YsT0FKRDtBQUtEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixJQUE3QixFQUFtQyxFQUFuQyxFQUF1QyxJQUF2QyxFQUE2QztBQUMzQyxVQUFRLFNBQVMsRUFBakI7QUFDQSxNQUFNLFNBQVMsS0FBSyxXQUFMLElBQW9CLEVBQW5DO0FBQ0EsTUFBTSxJQUFJLE1BQU0sTUFBTixJQUFnQixNQUFNLE1BQU4sS0FBaUIsRUFBM0M7QUFDQSxPQUFLLElBQUksQ0FBVCxJQUFjLEtBQUssS0FBbkIsRUFBMEI7QUFDeEIsTUFBRSxDQUFGLGFBQWMsV0FBVyxFQUFYLEVBQWUsSUFBZixFQUFxQixDQUFyQixFQUF3QixLQUFLLFdBQTdCLENBQWQ7QUFDRDtBQUNELFNBQU8sS0FBUDtBQUNEOztBQUVELFNBQVMsWUFBVCxDQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QjtBQUMxQixNQUFJLEtBQUssQ0FBVCxFQUFZO0FBQ1YsU0FBSyxJQUFJLENBQVQsSUFBYyxDQUFkLEVBQWlCO0FBQ2Y7QUFDQSxVQUFJLENBQUMsRUFBRSxDQUFGLENBQUwsRUFBVztBQUNULFVBQUUsQ0FBRixJQUFPLEVBQVA7QUFDRDtBQUNELGFBQU8sTUFBUCxDQUFjLEVBQUUsQ0FBRixDQUFkLEVBQW9CLEVBQUUsQ0FBRixDQUFwQjtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEtBQUssQ0FBWjtBQUNEOztBQUVEOzs7O0FBSU8sSUFBSSwwQ0FBaUIsU0FBakIsY0FBaUIsYUFBYzs7QUFFeEM7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDBDQUVzQjtBQUFBOztBQUNsQixvSUFBNkI7QUFDM0I7QUFDRDtBQUNELDhCQUFzQjtBQUFBLGlCQUFNLE9BQUssZUFBTCxFQUFOO0FBQUEsU0FBdEI7QUFDRDtBQVBIO0FBQUE7QUFBQSx3Q0FTb0I7QUFDaEIsdUJBQWUsSUFBZjtBQUNEO0FBWEg7O0FBQUE7QUFBQSxJQUFvQyxVQUFwQztBQWVELENBakJNOzs7QUN0U1A7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBS0E7O0FBR0E7O0FBTUEsQ0FBQyxrQkFBa0I7O0FBR2YsbUJBQWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBR0E7QUFDQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1g7QUFDQTtBQUNBO0FBQ0g7QUFFSjs7QUFJRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0FwQkQ7OztBQ3ZCQTs7Ozs7Ozs7SUFFYSxRLFdBQUEsUSxHQUVaLG9CQUFhO0FBQUE7O0FBQ1osUUFBTyxnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxZQUFJO0FBQzNDLFNBQU8sZUFBUCxFQUF3QixHQUF4QixFQUE2QixDQUE3QixFQUNDLElBREQsQ0FDTSxlQUROLEVBQ3VCLElBRHZCLENBQzRCLElBRDVCLEVBQ2tDLEtBRGxDLENBQ3dDLEdBRHhDLEVBRUMsTUFGRCxDQUVRLFdBRlIsRUFFcUIsSUFGckIsQ0FFMEIsR0FGMUIsRUFFK0IsS0FGL0IsQ0FFcUMsR0FGckMsRUFHQyxJQUhELENBR00sWUFITjtBQUlBLEVBTEQ7QUFNQSxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtcclxuICAgIFRoaW5neVxyXG59IGZyb20gJy4vbGlicy90aGluZ3kuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRyb2xQcmV6IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGhpbmd5Q29ubmVjdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCB0aGlzLnRoaW5neUNvbnRyb2wuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgdGhpbmd5Q29udHJvbCgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aGluZ3lDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB0aGluZ3kgPSBuZXcgVGhpbmd5KHtcclxuICAgICAgICAgICAgICAgIGxvZ0VuYWJsZWQ6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaW5neS5jb25uZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudGhpbmd5Q29ubmVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpbmd5LmJ1dHRvbkVuYWJsZSgoc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YXAnLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0cnVlKTtcclxuXHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHtcclxuICAgIEFwcGx5Q3NzXHJcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgQXBwbHlDb2RlTWlyb3JcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUpzLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZW1vcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXJJbkpTKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFydFRoZW1lKCk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9Dc3NWYXIoKSB7XHJcbiAgICAgICAgLyoqICovXHJcbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcclxuICAgICAgICAgICAgYFxyXG4jcmVuZGVyLWVsZW1lbnR7XHJcbi0tYS1zdXBlci12YXI6ICNGRkY7XHJcbn1cclxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XHJcblxyXG59XHJcbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xyXG5cclxufVxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb0Nzc1ZhckluSlMoKSB7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2VIID0gLTE7XHJcbiAgICAgICAgbGV0IHN1YnNjcmliZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBjbGllbnRSZWN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IGdob3N0UGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tZ2hvc3QtcGFyZW50Jyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NNb3VzZShldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWx0YVggPSAoY2xpZW50UmVjdC53aWR0aCArIGNsaWVudFJlY3QubGVmdCkgLSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgICAgICBjb25zdCBtZWRpYW4gPSBjbGllbnRSZWN0LndpZHRoIC8gMjtcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGRlbHRhWCA+IDAgPyAobWVkaWFuIC0gZGVsdGFYKSA6IChtZWRpYW4gKyAoLTEgKiBkZWx0YVgpKTtcclxuICAgICAgICAgICAgZ2hvc3RQYXJlbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wb3MnLCBgJHtsZWZ0fXB4YCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBkZWx0YVg6ICR7ZGVsdGFYfSAvIG1lZGlhbiA6ICR7bWVkaWFufSAvIHdpZHRoIDogJHt3aWR0aH0gLyBsZWZ0IDogJHtsZWZ0fWApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZ2hvc3Qtc3RhdGUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VIID0gUmV2ZWFsLmdldEluZGljZXMoKS5oO1xyXG4gICAgICAgICAgICAgICAgY2xpZW50UmVjdCA9IGdob3N0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgZ2hvc3RQYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcHJvY2Vzc01vdXNlKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlICYmIGluZGljZUggIT0gZXZlbnQuaW5kZXhoKSB7XHJcbiAgICAgICAgICAgICAgICBnaG9zdFBhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBwcm9jZXNzTW91c2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBuZXcgQXBwbHlDc3MoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcy1pbi1qcy1jc3MnKSxcclxuICAgICAgICAgICAgYCNkZW1vLWdob3N0LXBhcmVudCB7XHJcbi0tbGVmdC1wb3M6MDtcclxufVxyXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tc2hhZG93LFxyXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tZ2hvc3R7XHJcbmxlZnQ6IHZhcigtLWxlZnQtcG9zKTtcclxufWBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzLWluLWpzLWpzJyksXHJcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcclxuICAgICAgICAgICAgYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT57XHJcbiAgICBjb25zdCBkZWx0YVggPSB0aGlzLndpZHRoIC0gZXZlbnQuY2xpZW50WDtcclxuICAgIGNvbnN0IG1lZGlhbiA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgZ2hvc3RQYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtby1naG9zdC1wYXJlbnQnKTtcclxuICAgIGNvbnN0IGxlZnQgPSBldmVudC5jbGllbnRYID4gbWVkaWFuID8gKGV2ZW50LmNsaWVudFggLSBtZWRpYW4pIDogLTEgKiAobWVkaWFuIC0gZXZlbnQuY2xpZW50WCk7XHJcblxyXG4gICAgZ2hvc3RQYXJlbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wb3MnLCBcXGBcXCR7bGVmdH1weFxcYCk7XHJcbn0pO1xyXG4gICAgICAgICAgICBgKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb1BhcnRUaGVtZSgpe1xyXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYXJ0LWNzcycpLFxyXG4gICAgICAgICAgICAnY3NzJyxcclxuICAgICAgICAgICAgYHgtcmF0aW5nOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgIHBhZGRpbmc6IDRweDtcclxuICAgIG1pbi13aWR0aDogMjBweDtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufVxyXG4udW5vOmhvdmVyOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgIGJhY2tncm91bmQ6IGxpZ2h0Z3JlZW47XHJcbn1cclxuLmR1bzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICBiYWNrZ3JvdW5kOiBnb2xkZW5yb2Q7XHJcbn1cclxuLnVubzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcclxuICAgIGJhY2tncm91bmQ6IGdyZWVuO1xyXG59XHJcbi51bm86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcclxuICAgIGJhY2tncm91bmQ6IHRvbWF0bztcclxufVxyXG4uZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xyXG4gICAgYmFja2dyb3VuZDogeWVsbG93O1xyXG59XHJcbi5kdW86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcclxuICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG59XHJcbngtcmF0aW5nOjp0aGVtZSh0aHVtYi11cCkge1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG59XHJcbmApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFydC1odG1sJyksXHJcbiAgICAgICAgICAgICd0ZXh0L2h0bWwnLFxyXG4gICAgICAgICAgICBgPHgtdGh1bWJzPlxyXG4gICAgI3NoYWRvdy1yb290XHJcbiAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cclxuICAgIDxkaXYgcGFydD1cInRodW1iLWRvd25cIj7wn5GOPC9kaXY+XHJcbjwveC10aHVtYnM+XHJcbjx4LXJhdGluZz5cclxuICAgICNzaGFkb3ctcm9vdFxyXG4gICAgPGRpdiBwYXJ0PVwic3ViamVjdFwiPjxzbG90Pjwvc2xvdD48L2Rpdj5cclxuICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XHJcbjwveC1yYXRpbmc+XHJcblxyXG48eC1yYXRpbmcgY2xhc3M9XCJ1bm9cIj7inaTvuI88L3gtcmF0aW5nPlxyXG48eC1yYXRpbmcgY2xhc3M9XCJkdW9cIj7wn6S3PC94LXJhdGluZz5cclxuYCk7XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0aWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcclxuICAgICAgICAgICAgbW9kZTogJ2NzcycsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6ICd0cnVlJyxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxyXG4gICAgICAgICAgICB0aGVtZTogJ3NvbGFyaXplZCBkYXJrJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KXtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XHJcbiAgICAgICAgY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5Q3NzKGNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hcHBseUNzcyhpbml0aWFsQ29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlDc3ModmFsdWUpe1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcysnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihlKTt9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG1vZGUsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiAndHJ1ZScsXHJcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAnc29sYXJpemVkIGRhcmsnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnOTBweCc7XHJcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIGtleUVsdCxcclxuICAgICAgICBwb3NpdGlvbkFycmF5XHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcclxuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcclxuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcclxuXHJcbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcclxuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvbiBpbiBKU1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlLWluLWpzJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIHRvcDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI2MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICczNTBweCcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIDo6UGFydFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncGFydCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBUZW1wbGF0ZSBJbnN0YW50aWF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICd0ZW1wbGF0ZS1pbnN0YW50aWF0aW9uJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEhUTUwgTW9kdWxlXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdodG1sLW1vZHVsZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTAsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn0iLCIvKiogKi9cclxuZXhwb3J0IGNsYXNzIFRoaW5neSB7XHJcbiAgLyoqXHJcbiAgICAgKiAgVGhpbmd5OjUyIFdlYiBCbHVldG9vdGggQVBJLiA8YnI+XHJcbiAgICAgKiAgQkxFIHNlcnZpY2UgZGV0YWlscyB7QGxpbmsgaHR0cHM6Ly9ub3JkaWNzZW1pY29uZHVjdG9yLmdpdGh1Yi5pby9Ob3JkaWMtVGhpbmd5NTItRlcvZG9jdW1lbnRhdGlvbi9maXJtd2FyZV9hcmNoaXRlY3R1cmUuaHRtbCNmd19hcmNoX2JsZV9zZXJ2aWNlcyBoZXJlfVxyXG4gICAgICpcclxuICAgICAqXHJcbiAgICAgKiAgQGNvbnN0cnVjdG9yXHJcbiAgICAgKiAgQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge2xvZ0VuYWJsZWQ6IGZhbHNlfV0gLSBPcHRpb25zIG9iamVjdCBmb3IgVGhpbmd5XHJcbiAgICAgKiAgQHBhcmFtIHtib29sZWFufSBvcHRpb25zLmxvZ0VuYWJsZWQgLSBFbmFibGVzIGxvZ2dpbmcgb2YgYWxsIEJMRSBhY3Rpb25zLlxyXG4gICAgICpcclxuICAgICovXHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHtsb2dFbmFibGVkOiBmYWxzZX0pIHtcclxuICAgIHRoaXMubG9nRW5hYmxlZCA9IG9wdGlvbnMubG9nRW5hYmxlZDtcclxuXHJcbiAgICAvLyBUQ1MgPSBUaGluZ3kgQ29uZmlndXJhdGlvbiBTZXJ2aWNlXHJcbiAgICB0aGlzLlRDU19VVUlEID0gXCJlZjY4MDEwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX05BTUVfVVVJRCA9IFwiZWY2ODAxMDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19BRFZfUEFSQU1TX1VVSUQgPSBcImVmNjgwMTAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfQ09OTl9QQVJBTVNfVVVJRCA9IFwiZWY2ODAxMDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19FRERZU1RPTkVfVVVJRCA9IFwiZWY2ODAxMDUtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19DTE9VRF9UT0tFTl9VVUlEID0gXCJlZjY4MDEwNi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX0ZXX1ZFUl9VVUlEID0gXCJlZjY4MDEwNy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX01UVV9SRVFVRVNUX1VVSUQgPSBcImVmNjgwMTA4LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIC8vIFRFUyA9IFRoaW5neSBFbnZpcm9ubWVudCBTZXJ2aWNlXHJcbiAgICB0aGlzLlRFU19VVUlEID0gXCJlZjY4MDIwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX1RFTVBfVVVJRCA9IFwiZWY2ODAyMDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19QUkVTU1VSRV9VVUlEID0gXCJlZjY4MDIwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX0hVTUlESVRZX1VVSUQgPSBcImVmNjgwMjAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfR0FTX1VVSUQgPSBcImVmNjgwMjA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfQ09MT1JfVVVJRCA9IFwiZWY2ODAyMDUtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19DT05GSUdfVVVJRCA9IFwiZWY2ODAyMDYtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcblxyXG4gICAgLy8gVFVJUyA9IFRoaW5neSBVc2VyIEludGVyZmFjZSBTZXJ2aWNlXHJcbiAgICB0aGlzLlRVSVNfVVVJRCA9IFwiZWY2ODAzMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRVSVNfTEVEX1VVSUQgPSBcImVmNjgwMzAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UVUlTX0JUTl9VVUlEID0gXCJlZjY4MDMwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFVJU19QSU5fVVVJRCA9IFwiZWY2ODAzMDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcblxyXG4gICAgLy8gVE1TID0gVGhpbmd5IE1vdGlvbiBTZXJ2aWNlXHJcbiAgICB0aGlzLlRNU19VVUlEID0gXCJlZjY4MDQwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX0NPTkZJR19VVUlEID0gXCJlZjY4MDQwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX1RBUF9VVUlEID0gXCJlZjY4MDQwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX09SSUVOVEFUSU9OX1VVSUQgPSBcImVmNjgwNDAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfUVVBVEVSTklPTl9VVUlEID0gXCJlZjY4MDQwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX1NURVBfVVVJRCA9IFwiZWY2ODA0MDUtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19SQVdfVVVJRCA9IFwiZWY2ODA0MDYtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19FVUxFUl9VVUlEID0gXCJlZjY4MDQwNy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX1JPVF9NQVRSSVhfVVVJRCA9IFwiZWY2ODA0MDgtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19IRUFESU5HX1VVSUQgPSBcImVmNjgwNDA5LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfR1JBVklUWV9VVUlEID0gXCJlZjY4MDQwYS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuXHJcbiAgICAvLyBUU1MgPSBUaGluZ3kgU291bmQgU2VydmljZVxyXG4gICAgdGhpcy5UU1NfVVVJRCA9IFwiZWY2ODA1MDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRTU19DT05GSUdfVVVJRCA9IFwiZWY2ODA1MDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRTU19TUEVBS0VSX0RBVEFfVVVJRCA9IFwiZWY2ODA1MDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRTU19TUEVBS0VSX1NUQVRfVVVJRCA9IFwiZWY2ODA1MDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRTU19NSUNfVVVJRCA9IFwiZWY2ODA1MDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcblxyXG4gICAgdGhpcy5zZXJ2aWNlVVVJRHMgPSBbXHJcbiAgICAgIFwiYmF0dGVyeV9zZXJ2aWNlXCIsXHJcbiAgICAgIHRoaXMuVENTX1VVSUQsXHJcbiAgICAgIHRoaXMuVEVTX1VVSUQsXHJcbiAgICAgIHRoaXMuVFVJU19VVUlELFxyXG4gICAgICB0aGlzLlRNU19VVUlELFxyXG4gICAgICB0aGlzLlRTU19VVUlELFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xyXG4gICAgdGhpcy5kZXZpY2U7XHJcbiAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5nYXNFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5zcGVha2VyU3RhdHVzRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5taWNyb3Bob25lRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICAgKiAgTWV0aG9kIHRvIHJlYWQgZGF0YSBmcm9tIGEgV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYy5cclxuICAgICAqICBJbXBsZW1lbnRzIGEgc2ltcGxlIHNvbHV0aW9uIHRvIGF2b2lkIHN0YXJ0aW5nIG5ldyBHQVRUIHJlcXVlc3RzIHdoaWxlIGFub3RoZXIgaXMgcGVuZGluZy5cclxuICAgICAqICBBbnkgYXR0ZW1wdCB0byByZWFkIHdoaWxlIGFub3RoZXIgR0FUVCBvcGVyYXRpb24gaXMgaW4gcHJvZ3Jlc3MsIHdpbGwgcmVzdWx0IGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cclxuICAgICAqXHJcbiAgICAgKiAgQGFzeW5jXHJcbiAgICAgKiAgQHBhcmFtIHtPYmplY3R9IGNoYXJhY3RlcmlzdGljIC0gV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYyBvYmplY3RcclxuICAgICAqICBAcmV0dXJuIHtQcm9taXNlPERhdGFWaWV3Pn0gUmV0dXJucyBVaW50OEFycmF5IHdoZW4gcmVzb2x2ZWQgb3IgYW4gZXJyb3Igd2hlbiByZWplY3RlZFxyXG4gICAgICpcclxuICAgICAqICBAcHJpdmF0ZVxyXG5cclxuICAgICovXHJcbiAgYXN5bmMgX3JlYWREYXRhKGNoYXJhY3RlcmlzdGljKSB7XHJcbiAgICBpZiAoIXRoaXMuYmxlSXNCdXN5KSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IGRhdGFBcnJheSA9IGF3YWl0IGNoYXJhY3RlcmlzdGljLnJlYWRWYWx1ZSgpO1xyXG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhQXJyYXk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiR0FUVCBvcGVyYXRpb24gYWxyZWFkeSBwZW5kaW5nXCIpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBNZXRob2QgdG8gd3JpdGUgZGF0YSB0byBhIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMuXHJcbiAgICogIEltcGxlbWVudHMgYSBzaW1wbGUgc29sdXRpb24gdG8gYXZvaWQgc3RhcnRpbmcgbmV3IEdBVFQgcmVxdWVzdHMgd2hpbGUgYW5vdGhlciBpcyBwZW5kaW5nLlxyXG4gICAqICBBbnkgYXR0ZW1wdCB0byBzZW5kIGRhdGEgZHVyaW5nIGFub3RoZXIgR0FUVCBvcGVyYXRpb24gd2lsbCByZXN1bHQgaW4gYSByZWplY3RlZCBwcm9taXNlLlxyXG4gICAqICBObyByZXRyYW5zbWlzc2lvbiBpcyBpbXBsZW1lbnRlZCBhdCB0aGlzIGxldmVsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gY2hhcmFjdGVyaXN0aWMgLSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljIG9iamVjdFxyXG4gICAqICBAcGFyYW0ge1VpbnQ4QXJyYXl9IGRhdGFBcnJheSAtIFR5cGVkIGFycmF5IG9mIGJ5dGVzIHRvIHNlbmRcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZX1cclxuICAgKlxyXG4gICAqICBAcHJpdmF0ZVxyXG4gICAqXHJcbiAgKi9cclxuICBhc3luYyBfd3JpdGVEYXRhKGNoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpIHtcclxuICAgIGlmICghdGhpcy5ibGVJc0J1c3kpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShkYXRhQXJyYXkpO1xyXG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gZmFsc2U7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJHQVRUIG9wZXJhdGlvbiBhbHJlYWR5IHBlbmRpbmdcIikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIENvbm5lY3RzIHRvIFRoaW5neS5cclxuICAgKiAgVGhlIGZ1bmN0aW9uIHN0b3JlcyBhbGwgZGlzY292ZXJlZCBzZXJ2aWNlcyBhbmQgY2hhcmFjdGVyaXN0aWNzIHRvIHRoZSBUaGluZ3kgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhbiBlbXB0eSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBjb25uZWN0KCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gU2NhbiBmb3IgVGhpbmd5c1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFNjYW5uaW5nIGZvciBkZXZpY2VzIHdpdGggc2VydmljZSBVVUlEIGVxdWFsIHRvICR7dGhpcy5UQ1NfVVVJRH1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kZXZpY2UgPSBhd2FpdCBuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2Uoe1xyXG4gICAgICAgIGZpbHRlcnM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc2VydmljZXM6IFt0aGlzLlRDU19VVUlEXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBvcHRpb25hbFNlcnZpY2VzOiB0aGlzLnNlcnZpY2VVVUlEcyxcclxuICAgICAgfSk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgRm91bmQgVGhpbmd5IG5hbWVkIFwiJHt0aGlzLmRldmljZS5uYW1lfVwiLCB0cnlpbmcgdG8gY29ubmVjdGApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDb25uZWN0IHRvIEdBVFQgc2VydmVyXHJcbiAgICAgIGNvbnN0IHNlcnZlciA9IGF3YWl0IHRoaXMuZGV2aWNlLmdhdHQuY29ubmVjdCgpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYENvbm5lY3RlZCB0byBcIiR7dGhpcy5kZXZpY2UubmFtZX1cImApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBCYXR0ZXJ5IHNlcnZpY2VcclxuICAgICAgY29uc3QgYmF0dGVyeVNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UoXCJiYXR0ZXJ5X3NlcnZpY2VcIik7XHJcbiAgICAgIHRoaXMuYmF0dGVyeUNoYXJhY3RlcmlzdGljID0gYXdhaXQgYmF0dGVyeVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMoXCJiYXR0ZXJ5X2xldmVsXCIpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIGJhdHRlcnkgc2VydmljZSBhbmQgYmF0dGVyeSBsZXZlbCBjaGFyYWN0ZXJpc3RpY1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhpbmd5IGNvbmZpZ3VyYXRpb24gc2VydmljZVxyXG4gICAgICB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVENTX1VVSUQpO1xyXG4gICAgICB0aGlzLm5hbWVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfTkFNRV9VVUlEKTtcclxuICAgICAgdGhpcy5hZHZQYXJhbXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfQURWX1BBUkFNU19VVUlEKTtcclxuICAgICAgdGhpcy5jbG91ZFRva2VuQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0NMT1VEX1RPS0VOX1VVSUQpO1xyXG4gICAgICB0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfQ09OTl9QQVJBTVNfVVVJRCk7XHJcbiAgICAgIHRoaXMuZWRkeXN0b25lQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0VERFlTVE9ORV9VVUlEKTtcclxuICAgICAgdGhpcy5maXJtd2FyZVZlcnNpb25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfRldfVkVSX1VVSUQpO1xyXG4gICAgICB0aGlzLm10dVJlcXVlc3RDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfTVRVX1JFUVVFU1RfVVVJRCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IGNvbmZpZ3VyYXRpb24gc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhpbmd5IGVudmlyb25tZW50IHNlcnZpY2VcclxuICAgICAgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5URVNfVVVJRCk7XHJcbiAgICAgIHRoaXMudGVtcGVyYXR1cmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX1RFTVBfVVVJRCk7XHJcbiAgICAgIHRoaXMuY29sb3JDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0NPTE9SX1VVSUQpO1xyXG4gICAgICB0aGlzLmdhc0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfR0FTX1VVSUQpO1xyXG4gICAgICB0aGlzLmh1bWlkaXR5Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19IVU1JRElUWV9VVUlEKTtcclxuICAgICAgdGhpcy5wcmVzc3VyZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfUFJFU1NVUkVfVVVJRCk7XHJcbiAgICAgIHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0NPTkZJR19VVUlEKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgZW52aXJvbm1lbnQgc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhpbmd5IHVzZXIgaW50ZXJmYWNlIHNlcnZpY2VcclxuICAgICAgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRVSVNfVVVJRCk7XHJcbiAgICAgIHRoaXMuYnV0dG9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFVJU19CVE5fVVVJRCk7XHJcbiAgICAgIHRoaXMubGVkQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFVJU19MRURfVVVJRCk7XHJcbiAgICAgIHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UVUlTX1BJTl9VVUlEKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgdXNlciBpbnRlcmZhY2Ugc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhpbmd5IG1vdGlvbiBzZXJ2aWNlXHJcbiAgICAgIHRoaXMubW90aW9uU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRNU19VVUlEKTtcclxuICAgICAgdGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19DT05GSUdfVVVJRCk7XHJcbiAgICAgIHRoaXMuZXVsZXJDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19FVUxFUl9VVUlEKTtcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfR1JBVklUWV9VVUlEKTtcclxuICAgICAgdGhpcy5oZWFkaW5nQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfSEVBRElOR19VVUlEKTtcclxuICAgICAgdGhpcy5vcmllbnRhdGlvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX09SSUVOVEFUSU9OX1VVSUQpO1xyXG4gICAgICB0aGlzLnF1YXRlcm5pb25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19RVUFURVJOSU9OX1VVSUQpO1xyXG4gICAgICB0aGlzLm1vdGlvblJhd0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1JBV19VVUlEKTtcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1JPVF9NQVRSSVhfVVVJRCk7XHJcbiAgICAgIHRoaXMuc3RlcENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1NURVBfVVVJRCk7XHJcbiAgICAgIHRoaXMudGFwQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfVEFQX1VVSUQpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBtb3Rpb24gc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhpbmd5IHNvdW5kIHNlcnZpY2VcclxuICAgICAgdGhpcy5zb3VuZFNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UU1NfVVVJRCk7XHJcbiAgICAgIHRoaXMudHNzQ29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19DT05GSUdfVVVJRCk7XHJcbiAgICAgIHRoaXMubWljcm9waG9uZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfTUlDX1VVSUQpO1xyXG4gICAgICB0aGlzLnNwZWFrZXJEYXRhQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19TUEVBS0VSX0RBVEFfVVVJRCk7XHJcbiAgICAgIHRoaXMuc3BlYWtlclN0YXR1c0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfU1BFQUtFUl9TVEFUX1VVSUQpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBzb3VuZCBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgTWV0aG9kIHRvIGRpc2Nvbm5lY3QgZnJvbSBUaGluZ3kuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGFuIGVtcHR5IHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICovXHJcbiAgYXN5bmMgZGlzY29ubmVjdCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLmdhdHQuZGlzY29ubmVjdCgpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gTWV0aG9kIHRvIGVuYWJsZSBhbmQgZGlzYWJsZSBub3RpZmljYXRpb25zIGZvciBhIGNoYXJhY3RlcmlzdGljXHJcbiAgYXN5bmMgX25vdGlmeUNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljLCBlbmFibGUsIG5vdGlmeUhhbmRsZXIpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5zdGFydE5vdGlmaWNhdGlvbnMoKTtcclxuICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdGlmaWNhdGlvbnMgZW5hYmxlZCBmb3IgXCIgKyBjaGFyYWN0ZXJpc3RpYy51dWlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhcmFjdGVyaXN0aWMuYWRkRXZlbnRMaXN0ZW5lcihcImNoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkXCIsIG5vdGlmeUhhbmRsZXIpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5zdG9wTm90aWZpY2F0aW9ucygpO1xyXG4gICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90aWZpY2F0aW9ucyBkaXNhYmxlZCBmb3IgXCIsIGNoYXJhY3RlcmlzdGljLnV1aWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWRcIiwgbm90aWZ5SGFuZGxlcik7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgQ29uZmlndXJhdGlvbiBzZXJ2aWNlICAqL1xyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBuYW1lIG9mIHRoZSBUaGluZ3kgZGV2aWNlLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPHN0cmluZ3xFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgbmFtZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldE5hbWUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5uYW1lQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIik7XHJcbiAgICAgIGNvbnN0IG5hbWUgPSBkZWNvZGVyLmRlY29kZShkYXRhKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgZGV2aWNlIG5hbWU6IFwiICsgbmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgbmFtZSBvZiB0aGUgVGhpbmd5IGRldmljZS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSB0aGF0IHdpbGwgYmUgZ2l2ZW4gdG8gdGhlIFRoaW5neS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0TmFtZShuYW1lKSB7XHJcbiAgICBpZiAobmFtZS5sZW5ndGggPiAxMCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBuYW1lIGNhbid0IGJlIG1vcmUgdGhhbiAxMCBjaGFyYWN0ZXJzIGxvbmcuXCIpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KG5hbWUubGVuZ3RoKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBieXRlQXJyYXlbaV0gPSBuYW1lLmNoYXJDb2RlQXQoaSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMubmFtZUNoYXJhY3RlcmlzdGljLCBieXRlQXJyYXkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgYWR2ZXJ0aXNpbmcgcGFyYW1ldGVyc1xyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGFkdmVydGlzaW5nIHBhcmFtZXRlcnMgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0QWR2UGFyYW1zKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5hZHZQYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XHJcblxyXG4gICAgICAvLyBJbnRlcnZhbCBpcyBnaXZlbiBpbiB1bml0cyBvZiAwLjYyNSBtaWxsaXNlY29uZHNcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgY29uc3QgaW50ZXJ2YWwgPSAocmVjZWl2ZWREYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pICogMC42MjUpLnRvRml4ZWQoMCk7XHJcbiAgICAgIGNvbnN0IHRpbWVvdXQgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMik7XHJcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgICBpbnRlcnZhbDoge1xyXG4gICAgICAgICAgaW50ZXJ2YWw6IGludGVydmFsLFxyXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGltZW91dDoge1xyXG4gICAgICAgICAgdGltZW91dDogdGltZW91dCxcclxuICAgICAgICAgIHVuaXQ6IFwic1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiBwYXJhbXM7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgYWR2ZXJ0aXNpbmcgcGFyYW1ldGVyc1xyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT2JqZWN0IHdpdGgga2V5L3ZhbHVlIHBhaXJzICdpbnRlcnZhbCcgYW5kICd0aW1lb3V0JzogPGNvZGU+e2ludGVydmFsOiBzb21lSW50ZXJ2YWwsIHRpbWVvdXQ6IHNvbWVUaW1lb3V0fTwvY29kZT4uXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuaW50ZXJ2YWwgLSBUaGUgYWR2ZXJ0aXNpbmcgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGluIHRoZSByYW5nZSBvZiAyMCBtcyB0byA1IDAwMCBtcy5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy50aW1lb3V0IC0gVGhlIGFkdmVydGlzaW5nIHRpbWVvdXQgaW4gc2Vjb25kcyBpbiB0aGUgcmFuZ2UgMSBzIHRvIDE4MCBzLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRBZHZQYXJhbXMocGFyYW1zKSB7XHJcbiAgICBpZiAodHlwZW9mIHBhcmFtcyAhPT0gXCJvYmplY3RcIiB8fCBwYXJhbXMuaW50ZXJ2YWwgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMudGltZW91dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcclxuICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlIGFyZ3VtZW50IGhhcyB0byBiZSBhbiBvYmplY3Qgd2l0aCBrZXkvdmFsdWUgcGFpcnMgaW50ZXJ2YWwnIGFuZCAndGltZW91dCc6IHtpbnRlcnZhbDogc29tZUludGVydmFsLCB0aW1lb3V0OiBzb21lVGltZW91dH1cIilcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbnRlcnZhbCBpcyBpbiB1bml0cyBvZiAwLjYyNSBtcy5cclxuICAgIGNvbnN0IGludGVydmFsID0gcGFyYW1zLmludGVydmFsICogMS42O1xyXG4gICAgY29uc3QgdGltZW91dCA9IHBhcmFtcy50aW1lb3V0O1xyXG5cclxuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcclxuICAgIGlmIChpbnRlcnZhbCA8IDMyIHx8IGludGVydmFsID4gODAwMCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgYWR2ZXJ0aXNpbmcgaW50ZXJ2YWwgbXVzdCBiZSB3aXRoaW4gdGhlIHJhbmdlIG9mIDIwIG1zIHRvIDUgMDAwIG1zXCIpKTtcclxuICAgIH1cclxuICAgIGlmICh0aW1lb3V0IDwgMCB8fCB0aW1lb3V0ID4gMTgwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBhZHZlcnRpc2luZyB0aW1lb3V0IG11c3QgYmUgd2l0aGluIHRoZSByYW5nZSBvZiAwIHRvIDE4MCBzXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgzKTtcclxuICAgIGRhdGFBcnJheVswXSA9IGludGVydmFsICYgMHhmZjtcclxuICAgIGRhdGFBcnJheVsxXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcbiAgICBkYXRhQXJyYXlbMl0gPSB0aW1lb3V0O1xyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5hZHZQYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGNvbm5lY3Rpb24gcGFyYW1ldGVycy5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBjb25uZWN0aW9uIHBhcmFtZXRlcnMgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRDb25uUGFyYW1zKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xyXG5cclxuICAgICAgLy8gQ29ubmVjdGlvbiBpbnRlcnZhbHMgYXJlIGdpdmVuIGluIHVuaXRzIG9mIDEuMjUgbXNcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgY29uc3QgbWluQ29ubkludGVydmFsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pICogMS4yNTtcclxuICAgICAgY29uc3QgbWF4Q29ubkludGVydmFsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pICogMS4yNTtcclxuICAgICAgY29uc3Qgc2xhdmVMYXRlbmN5ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xyXG5cclxuICAgICAgLy8gU3VwZXJ2aXNpb24gdGltZW91dCBpcyBnaXZlbiBpIHVuaXRzIG9mIDEwIG1zXHJcbiAgICAgIGNvbnN0IHN1cGVydmlzaW9uVGltZW91dCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKSAqIDEwO1xyXG4gICAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgICAgY29ubmVjdGlvbkludGVydmFsOiB7XHJcbiAgICAgICAgICBtaW46IG1pbkNvbm5JbnRlcnZhbCxcclxuICAgICAgICAgIG1heDogbWF4Q29ubkludGVydmFsLFxyXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2xhdmVMYXRlbmN5OiB7XHJcbiAgICAgICAgICB2YWx1ZTogc2xhdmVMYXRlbmN5LFxyXG4gICAgICAgICAgdW5pdDogXCJudW1iZXIgb2YgY29ubmVjdGlvbiBpbnRlcnZhbHNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1cGVydmlzaW9uVGltZW91dDoge1xyXG4gICAgICAgICAgdGltZW91dDogc3VwZXJ2aXNpb25UaW1lb3V0LFxyXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiBwYXJhbXM7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgY29ubmVjdGlvbiBpbnRlcnZhbFxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gQ29ubmVjdGlvbiBpbnRlcnZhbCBvYmplY3Q6IDxjb2RlPnttaW5JbnRlcnZhbDogc29tZVZhbHVlLCBtYXhJbnRlcnZhbDogc29tZVZhbHVlfTwvY29kZT5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5taW5JbnRlcnZhbCAtIFRoZSBtaW5pbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlID49IDcuNSBtcy5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhJbnRlcnZhbCAtIFRoZSBtYXhpbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIDw9IDQgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRDb25uSW50ZXJ2YWwocGFyYW1zKSB7XHJcbiAgICBpZiAodHlwZW9mIHBhcmFtcyAhPT0gXCJvYmplY3RcIiB8fCBwYXJhbXMubWluSW50ZXJ2YWwgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubWF4SW50ZXJ2YWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0OiB7bWluSW50ZXJ2YWw6IHZhbHVlLCBtYXhJbnRlcnZhbDogdmFsdWV9XCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWluSW50ZXJ2YWwgPSBwYXJhbXMubWluSW50ZXJ2YWw7XHJcbiAgICBsZXQgbWF4SW50ZXJ2YWwgPSBwYXJhbXMubWF4SW50ZXJ2YWw7XHJcblxyXG4gICAgaWYgKG1pbkludGVydmFsID09PSBudWxsIHx8IG1heEludGVydmFsID09PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiQm90aCBtaW5pbXVtIGFuZCBtYXhpbXVtIGFjY2VwdGFibGUgaW50ZXJ2YWwgbXVzdCBiZSBwYXNzZWQgYXMgYXJndW1lbnRzXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXHJcbiAgICBpZiAobWluSW50ZXJ2YWwgPCA3LjUgfHwgbWluSW50ZXJ2YWwgPiBtYXhJbnRlcnZhbCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFJhbmdlRXJyb3IoXCJUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIG11c3QgYmUgZ3JlYXRlciB0aGFuIDcuNSBtcyBhbmQgPD0gbWF4aW11bSBpbnRlcnZhbFwiKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKG1heEludGVydmFsID4gNDAwMCB8fCBtYXhJbnRlcnZhbCA8IG1pbkludGVydmFsKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcclxuICAgICAgICBuZXcgUmFuZ2VFcnJvcihcIlRoZSBtaW5pbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgbXVzdCBiZSBsZXNzIHRoYW4gNCAwMDAgbXMgYW5kID49IG1pbmltdW0gaW50ZXJ2YWxcIilcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xyXG5cclxuICAgICAgLy8gSW50ZXJ2YWwgaXMgaW4gdW5pdHMgb2YgMS4yNSBtcy5cclxuICAgICAgbWluSW50ZXJ2YWwgPSBNYXRoLnJvdW5kKG1pbkludGVydmFsICogMC44KTtcclxuICAgICAgbWF4SW50ZXJ2YWwgPSBNYXRoLnJvdW5kKG1heEludGVydmFsICogMC44KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbMF0gPSBtaW5JbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVsxXSA9IChtaW5JbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVsyXSA9IG1heEludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzNdID0gKG1heEludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiRXJyb3Igd2hlbiB1cGRhdGluZyBjb25uZWN0aW9uIGludGVydmFsOiBcIiArIGVycm9yKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgY29ubmVjdGlvbiBzbGF2ZSBsYXRlbmN5XHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBzbGF2ZUxhdGVuY3kgLSBUaGUgZGVzaXJlZCBzbGF2ZSBsYXRlbmN5IGluIHRoZSByYW5nZSBmcm9tIDAgdG8gNDk5IGNvbm5lY3Rpb24gaW50ZXJ2YWxzLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdD59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0Q29ublNsYXZlTGF0ZW5jeShzbGF2ZUxhdGVuY3kpIHtcclxuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcclxuICAgIGlmIChzbGF2ZUxhdGVuY3kgPCAwIHx8IHNsYXZlTGF0ZW5jeSA+IDQ5OSkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFJhbmdlRXJyb3IoXCJUaGUgc2xhdmUgbGF0ZW5jeSBtdXN0IGJlIGluIHRoZSByYW5nZSBmcm9tIDAgdG8gNDk5IGNvbm5lY3Rpb24gaW50ZXJ2YWxzLlwiKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzRdID0gc2xhdmVMYXRlbmN5ICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzVdID0gKHNsYXZlTGF0ZW5jeSA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gdXBkYXRpbmcgc2xhdmUgbGF0ZW5jeTogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgY29ubmVjdGlvbiBzdXBlcnZpc2lvbiB0aW1lb3V0XHJcbiAgICogIDxiPk5vdGU6PC9iPiBBY2NvcmRpbmcgdG8gdGhlIEJsdWV0b290aCBMb3cgRW5lcmd5IHNwZWNpZmljYXRpb24sIHRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBtdXN0IGJlIGdyZWF0ZXJcclxuICAgKiAgdGhhbiAoMSArIHNsYXZlTGF0ZW5jeSkgKiBtYXhDb25uSW50ZXJ2YWwgKiAyLCB3aGVyZSBtYXhDb25uSW50ZXJ2YWwgaXMgYWxzbyBnaXZlbiBpbiBtaWxsaXNlY29uZHMuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gVGhlIGRlc2lyZWQgY29ubmVjdGlvbiBzdXBlcnZpc2lvbiB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBhbmQgaW4gdGhlIHJhbmdlIG9mIDEwMCBtcyB0byAzMiAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldENvbm5UaW1lb3V0KHRpbWVvdXQpIHtcclxuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcclxuICAgIGlmICh0aW1lb3V0IDwgMTAwIHx8IHRpbWVvdXQgPiAzMjAwMCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgc3VwZXJ2aXNpb24gdGltZW91dCBtdXN0IGJlIGluIHRoZSByYW5nZSBmcm9tIDEwMCBtcyB0byAzMiAwMDAgbXMuXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBUaGUgc3VwZXJ2aXNpb24gdGltZW91dCBoYXMgdG8gYmUgc2V0IGluIHVuaXRzIG9mIDEwIG1zXHJcbiAgICAgIHRpbWVvdXQgPSBNYXRoLnJvdW5kKHRpbWVvdXQgLyAxMCk7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgdGltZW91dCBvYmV5cyAgY29ubl9zdXBfdGltZW91dCAqIDQgPiAoMSArIHNsYXZlX2xhdGVuY3kpICogbWF4X2Nvbm5faW50ZXJ2YWxcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgY29uc3QgbWF4Q29ubkludGVydmFsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBzbGF2ZUxhdGVuY3kgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgICBpZiAodGltZW91dCAqIDQgPCAoMSArIHNsYXZlTGF0ZW5jeSkgKiBtYXhDb25uSW50ZXJ2YWwpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIG11c3QgYmUgZ3JlYXRlciB0aGFuICgxICsgc2xhdmVMYXRlbmN5KSAqIG1heENvbm5JbnRlcnZhbCAqIDIsIHdoZXJlIG1heENvbm5JbnRlcnZhbCBpcyBhbHNvIGdpdmVuIGluIG1pbGxpc2Vjb25kcy5cIilcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbNl0gPSB0aW1lb3V0ICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzddID0gKHRpbWVvdXQgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHVwZGF0aW5nIHRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0OiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjb25maWd1cmVkIEVkZHlzdG9uZSBVUkxcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxVUkx8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIFVSTCB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEVkZHlzdG9uZVVybCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZWRkeXN0b25lQ2hhcmFjdGVyaXN0aWMpO1xyXG5cclxuICAgICAgLy8gQWNjb3JkaW5nIHRvIEVkZHlzdG9uZSBVUkwgZW5jb2Rpbmcgc3BlY2lmaWNhdGlvbiwgY2VydGFpbiBlbGVtZW50cyBjYW4gYmUgZXhwYW5kZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZWRkeXN0b25lL3RyZWUvbWFzdGVyL2VkZHlzdG9uZS11cmxcclxuICAgICAgY29uc3QgcHJlZml4QXJyYXkgPSBbXCJodHRwOi8vd3d3LlwiLCBcImh0dHBzOi8vd3d3LlwiLCBcImh0dHA6Ly9cIiwgXCJodHRwczovL1wiXTtcclxuICAgICAgY29uc3QgZXhwYW5zaW9uQ29kZXMgPSBbXHJcbiAgICAgICAgXCIuY29tL1wiLFxyXG4gICAgICAgIFwiLm9yZy9cIixcclxuICAgICAgICBcIi5lZHUvXCIsXHJcbiAgICAgICAgXCIubmV0L1wiLFxyXG4gICAgICAgIFwiLmluZm8vXCIsXHJcbiAgICAgICAgXCIuYml6L1wiLFxyXG4gICAgICAgIFwiLmdvdi9cIixcclxuICAgICAgICBcIi5jb21cIixcclxuICAgICAgICBcIi5vcmdcIixcclxuICAgICAgICBcIi5lZHVcIixcclxuICAgICAgICBcIi5uZXRcIixcclxuICAgICAgICBcIi5pbmZvXCIsXHJcbiAgICAgICAgXCIuYml6XCIsXHJcbiAgICAgICAgXCIuZ292XCIsXHJcbiAgICAgIF07XHJcbiAgICAgIGNvbnN0IHByZWZpeCA9IHByZWZpeEFycmF5W3JlY2VpdmVkRGF0YS5nZXRVaW50OCgwKV07XHJcbiAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKTtcclxuICAgICAgbGV0IHVybCA9IGRlY29kZXIuZGVjb2RlKHJlY2VpdmVkRGF0YSk7XHJcbiAgICAgIHVybCA9IHByZWZpeCArIHVybC5zbGljZSgxKTtcclxuXHJcbiAgICAgIGV4cGFuc2lvbkNvZGVzLmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcclxuICAgICAgICBpZiAodXJsLmluZGV4T2YoU3RyaW5nLmZyb21DaGFyQ29kZShpKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShTdHJpbmcuZnJvbUNoYXJDb2RlKGkpLCBleHBhbnNpb25Db2Rlc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgVVJMKHVybCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgRWRkeXN0b25lIFVSTFxyXG4gICAqICBJdCdzIHJlY29tbWVlbmRlZCB0byB1c2UgVVJMIHNob3J0ZW5lciB0byBzdGF5IHdpdGhpbiB0aGUgbGltaXQgb2YgMTQgY2hhcmFjdGVycyBsb25nIFVSTFxyXG4gICAqICBVUkwgc2NoZW1lIHByZWZpeCBzdWNoIGFzIFwiaHR0cHM6Ly9cIiBhbmQgXCJodHRwczovL3d3dy5cIiBkbyBub3QgY291bnQgdG93YXJkcyB0aGF0IGxpbWl0LFxyXG4gICAqICBuZWl0aGVyIGRvZXMgZXhwYW5zaW9uIGNvZGVzIHN1Y2ggYXMgXCIuY29tL1wiIGFuZCBcIi5vcmdcIi5cclxuICAgKiAgRnVsbCBkZXRhaWxzIGluIHRoZSBFZGR5c3RvbmUgVVJMIHNwZWNpZmljYXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZWRkeXN0b25lL3RyZWUvbWFzdGVyL2VkZHlzdG9uZS11cmxcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtzdHJpbmd9IHVybFN0cmluZyAtIFRoZSBVUkwgdGhhdCBzaG91bGQgYmUgYnJvYWRjYXN0ZWQuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldEVkZHlzdG9uZVVybCh1cmxTdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFVzZXMgVVJMIEFQSSB0byBjaGVjayBmb3IgdmFsaWQgVVJMXHJcbiAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwodXJsU3RyaW5nKTtcclxuXHJcbiAgICAgIC8vIEVkZHlzdG9uZSBVUkwgc3BlY2lmaWNhdGlvbiBkZWZpbmVzIGNvZGVzIGZvciBVUkwgc2NoZW1lIHByZWZpeGVzIGFuZCBleHBhbnNpb24gY29kZXMgaW4gdGhlIFVSTC5cclxuICAgICAgLy8gVGhlIGFycmF5IGluZGV4IGNvcnJlc3BvbmRzIHRvIHRoZSBkZWZpbmVkIGNvZGUgaW4gdGhlIHNwZWNpZmljYXRpb24uXHJcbiAgICAgIC8vIERldGFpbHMgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9lZGR5c3RvbmUvdHJlZS9tYXN0ZXIvZWRkeXN0b25lLXVybFxyXG4gICAgICBjb25zdCBwcmVmaXhBcnJheSA9IFtcImh0dHA6Ly93d3cuXCIsIFwiaHR0cHM6Ly93d3cuXCIsIFwiaHR0cDovL1wiLCBcImh0dHBzOi8vXCJdO1xyXG4gICAgICBjb25zdCBleHBhbnNpb25Db2RlcyA9IFtcclxuICAgICAgICBcIi5jb20vXCIsXHJcbiAgICAgICAgXCIub3JnL1wiLFxyXG4gICAgICAgIFwiLmVkdS9cIixcclxuICAgICAgICBcIi5uZXQvXCIsXHJcbiAgICAgICAgXCIuaW5mby9cIixcclxuICAgICAgICBcIi5iaXovXCIsXHJcbiAgICAgICAgXCIuZ292L1wiLFxyXG4gICAgICAgIFwiLmNvbVwiLFxyXG4gICAgICAgIFwiLm9yZ1wiLFxyXG4gICAgICAgIFwiLmVkdVwiLFxyXG4gICAgICAgIFwiLm5ldFwiLFxyXG4gICAgICAgIFwiLmluZm9cIixcclxuICAgICAgICBcIi5iaXpcIixcclxuICAgICAgICBcIi5nb3ZcIixcclxuICAgICAgXTtcclxuICAgICAgbGV0IHByZWZpeENvZGUgPSBudWxsO1xyXG4gICAgICBsZXQgZXhwYW5zaW9uQ29kZSA9IG51bGw7XHJcbiAgICAgIGxldCBlZGR5c3RvbmVVcmwgPSB1cmwuaHJlZjtcclxuICAgICAgbGV0IGxlbiA9IGVkZHlzdG9uZVVybC5sZW5ndGg7XHJcblxyXG4gICAgICBwcmVmaXhBcnJheS5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHVybC5ocmVmLmluZGV4T2YoZWxlbWVudCkgIT09IC0xICYmIHByZWZpeENvZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgIHByZWZpeENvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xyXG4gICAgICAgICAgZWRkeXN0b25lVXJsID0gZWRkeXN0b25lVXJsLnJlcGxhY2UoZWxlbWVudCwgcHJlZml4Q29kZSk7XHJcbiAgICAgICAgICBsZW4gLT0gZWxlbWVudC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGV4cGFuc2lvbkNvZGVzLmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcclxuICAgICAgICBpZiAodXJsLmhyZWYuaW5kZXhPZihlbGVtZW50KSAhPT0gLTEgJiYgZXhwYW5zaW9uQ29kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgZXhwYW5zaW9uQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XHJcbiAgICAgICAgICBlZGR5c3RvbmVVcmwgPSBlZGR5c3RvbmVVcmwucmVwbGFjZShlbGVtZW50LCBleHBhbnNpb25Db2RlKTtcclxuICAgICAgICAgIGxlbiAtPSBlbGVtZW50Lmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKGxlbiA8IDEgfHwgbGVuID4gMTQpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBVUkwgY2FuJ3QgYmUgbG9uZ2VyIHRoYW4gMTQgY2hhcmFjdGVycywgZXhjbHVkaW5nIFVSTCBzY2hlbWUgc3VjaCBhcyBcXFwiaHR0cHM6Ly9cXFwiIGFuZCBcXFwiLmNvbS9cXFwiLlwiKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGVkZHlzdG9uZVVybC5sZW5ndGgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlZGR5c3RvbmVVcmwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBieXRlQXJyYXlbaV0gPSBlZGR5c3RvbmVVcmwuY2hhckNvZGVBdChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljLCBieXRlQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjb25maWd1cmVkIGNsb3VkIHRva2VuLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPHN0cmluZ3xFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgY2xvdWQgdG9rZW4gd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRDbG91ZFRva2VuKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jbG91ZFRva2VuQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIik7XHJcbiAgICAgIGNvbnN0IHRva2VuID0gZGVjb2Rlci5kZWNvZGUocmVjZWl2ZWREYXRhKTtcclxuXHJcbiAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjbG91ZCB0b2tlbi5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIGNsb3VkIHRva2VuIHRvIGJlIHN0b3JlZC5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0Q2xvdWRUb2tlbih0b2tlbikge1xyXG4gICAgaWYgKHRva2VuLmxlbmd0aCA+IDI1MCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGNsb3VkIHRva2VuIGNhbiBub3QgZXhjZWVkIDI1MCBjaGFyYWN0ZXJzLlwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcihcInV0Zi04XCIpLmVuY29kZSh0b2tlbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNsb3VkVG9rZW5DaGFyYWN0ZXJpc3RpYywgZW5jb2Rlcik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBNYXhpbWFsIFRyYW5zbWlzc2lvbiBVbml0IChNVFUpXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8bnVtYmVyfEVycm9yPn0gUmV0dXJucyB0aGUgTVRVIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0TXR1KCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5tdHVSZXF1ZXN0Q2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBjb25zdCBtdHUgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDEsIGxpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgICByZXR1cm4gbXR1O1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGN1cnJlbnQgTWF4aW1hbCBUcmFuc21pc3Npb24gVW5pdCAoTVRVKVxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gW3BhcmFtcyA9IHtwZXJpcGhlcmFsUmVxdWVzdDogdHJ1ZX1dIC0gTVRVIHNldHRpbmdzIG9iamVjdDoge210dVNpemU6IHZhbHVlLCBwZXJpcGhlcmFsUmVxdWVzdDogdmFsdWV9LCB3aGVyZSBwZXJpcGhlcmFsUmVxdWVzdCBpcyBvcHRpb25hbC5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tdHVTaXplIC0gVGhlIGRlc2lyZWQgTVRVIHNpemUuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLnBlcmlwaGVyYWxSZXF1ZXN0IC0gT3B0aW9uYWwuIFNldCB0byA8Y29kZT50cnVlPC9jb2RlPiBpZiBwZXJpcGhlcmFsIHNob3VsZCBzZW5kIGFuIE1UVSBleGNoYW5nZSByZXF1ZXN0LiBEZWZhdWx0IGlzIDxjb2RlPnRydWU8L2NvZGU+O1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRNdHUocGFyYW1zKSB7XHJcbiAgICBpZiAodHlwZW9mIHBhcmFtcyAhPT0gXCJvYmplY3RcIiB8fCBwYXJhbXMubXR1U2l6ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIGFyZ3VtZW50IGhhcyB0byBiZSBhbiBvYmplY3RcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG10dVNpemUgPSBwYXJhbXMubXR1U2l6ZTtcclxuICAgIGNvbnN0IHBlcmlwaGVyYWxSZXF1ZXN0ID0gcGFyYW1zLnBlcmlwaGVyYWxSZXF1ZXN0IHx8IHRydWU7XHJcblxyXG4gICAgaWYgKG10dVNpemUgPCAyMyB8fCBtdHVTaXplID4gMjc2KSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJNVFUgc2l6ZSBtdXN0IGJlIGluIHJhbmdlIDIzIC0gMjc2IGJ5dGVzXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgzKTtcclxuICAgIGRhdGFBcnJheVswXSA9IHBlcmlwaGVyYWxSZXF1ZXN0ID8gMSA6IDA7XHJcbiAgICBkYXRhQXJyYXlbMV0gPSBtdHVTaXplICYgMHhmZjtcclxuICAgIGRhdGFBcnJheVsyXSA9IChtdHVTaXplID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMubXR1UmVxdWVzdENoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgZmlybXdhcmUgdmVyc2lvbi5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIGZpcm13YXJlIHZlcnNpb24gb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0RmlybXdhcmVWZXJzaW9uKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5maXJtd2FyZVZlcnNpb25DaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IG1ham9yID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgICBjb25zdCBtaW5vciA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgxKTtcclxuICAgICAgY29uc3QgcGF0Y2ggPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMik7XHJcbiAgICAgIGNvbnN0IHZlcnNpb24gPSBgdiR7bWFqb3J9LiR7bWlub3J9LiR7cGF0Y2h9YDtcclxuXHJcbiAgICAgIHJldHVybiB2ZXJzaW9uO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gICoqKioqKiAgLy9cclxuXHJcbiAgLyogIEVudmlyb25tZW50IHNlcnZpY2UgICovXHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gb2YgdGhlIFRoaW5neSBlbnZpcm9ubWVudCBtb2R1bGUuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBlbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIG9iamVjdCB3aGVuIHByb21pc2UgcmVzb2x2ZXMsIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0RW52aXJvbm1lbnRDb25maWcoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgY29uc3QgdGVtcEludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgcHJlc3N1cmVJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IGh1bWlkaXR5SW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBjb2xvckludGVydmFsID0gZGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgZ2FzTW9kZSA9IGRhdGEuZ2V0VWludDgoOCk7XHJcbiAgICAgIGNvbnN0IGNvbG9yU2Vuc29yUmVkID0gZGF0YS5nZXRVaW50OCg5KTtcclxuICAgICAgY29uc3QgY29sb3JTZW5zb3JHcmVlbiA9IGRhdGEuZ2V0VWludDgoMTApO1xyXG4gICAgICBjb25zdCBjb2xvclNlbnNvckJsdWUgPSBkYXRhLmdldFVpbnQ4KDExKTtcclxuICAgICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICAgIHRlbXBJbnRlcnZhbDogdGVtcEludGVydmFsLFxyXG4gICAgICAgIHByZXNzdXJlSW50ZXJ2YWw6IHByZXNzdXJlSW50ZXJ2YWwsXHJcbiAgICAgICAgaHVtaWRpdHlJbnRlcnZhbDogaHVtaWRpdHlJbnRlcnZhbCxcclxuICAgICAgICBjb2xvckludGVydmFsOiBjb2xvckludGVydmFsLFxyXG4gICAgICAgIGdhc01vZGU6IGdhc01vZGUsXHJcbiAgICAgICAgY29sb3JTZW5zb3JSZWQ6IGNvbG9yU2Vuc29yUmVkLFxyXG4gICAgICAgIGNvbG9yU2Vuc29yR3JlZW46IGNvbG9yU2Vuc29yR3JlZW4sXHJcbiAgICAgICAgY29sb3JTZW5zb3JCbHVlOiBjb2xvclNlbnNvckJsdWUsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gZ2V0dGluZyBlbnZpcm9ubWVudCBzZW5zb3JzIGNvbmZpZ3VyYXRpb25zOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSB0ZW1wZXJhdHVyZSBtZWFzdXJlbWVudCB1cGRhdGUgaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRlbXBlcmF0dXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNjAgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRUZW1wZXJhdHVyZUludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCA1MCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHRlbXBlcmF0dXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzBdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbMV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyB0ZW1wZXJhdHVyZSB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIHByZXNzdXJlIG1lYXN1cmVtZW50IHVwZGF0ZSBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGhlIHByZXNzdXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSA1MCBtcyB0byA2MCAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldFByZXNzdXJlSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDUwIHx8IGludGVydmFsID4gNjAwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgcHJlc3N1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbMl0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVszXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHByZXNzdXJlIHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgaHVtaWRpdHkgbWVhc3VyZW1lbnQgdXBkYXRlIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBIdW1pZGl0eSBzZW5zb3IgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNjAgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRIdW1pZGl0eUludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBodW1pZGl0eSBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzRdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbNV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBodW1pZGl0eSB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNvbG9yIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIENvbG9yIHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDIwMCBtcyB0byA2MCAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldENvbG9ySW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDIwMCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGNvbG9yIHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAyMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbNl0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs3XSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGNvbG9yIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGdhcyBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGhlIGdhcyBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIHNlY29uZHMuIEFsbG93ZWQgdmFsdWVzIGFyZSAxLCAxMCwgYW5kIDYwIHNlY29uZHMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldEdhc0ludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgbW9kZTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnZhbCA9PT0gMSkge1xyXG4gICAgICAgIG1vZGUgPSAxO1xyXG4gICAgICB9IGVsc2UgaWYgKGludGVydmFsID09PSAxMCkge1xyXG4gICAgICAgIG1vZGUgPSAyO1xyXG4gICAgICB9IGVsc2UgaWYgKGludGVydmFsID09PSA2MCkge1xyXG4gICAgICAgIG1vZGUgPSAzO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBnYXMgc2Vuc29yIGludGVydmFsIGhhcyB0byBiZSAxLCAxMCBvciA2MCBzZWNvbmRzLlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs4XSA9IG1vZGU7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGdhcyBzZW5zb3IgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIENvbmZpZ3VyZXMgY29sb3Igc2Vuc29yIExFRCBjYWxpYnJhdGlvbiBwYXJhbWV0ZXJzLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gcmVkIC0gVGhlIHJlZCBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGdyZWVuIC0gVGhlIGdyZWVuIGludGVuc2l0eSwgcmFuZ2luZyBmcm9tIDAgdG8gMjU1LlxyXG4gICAqICBAcGFyYW0ge051bWJlcn0gYmx1ZSAtIFRoZSBibHVlIGludGVuc2l0eSwgcmFuZ2luZyBmcm9tIDAgdG8gMjU1LlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBjb2xvclNlbnNvckNhbGlicmF0ZShyZWQsIGdyZWVuLCBibHVlKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbOV0gPSByZWQ7XHJcbiAgICAgIGRhdGFBcnJheVsxMF0gPSBncmVlbjtcclxuICAgICAgZGF0YUFycmF5WzExXSA9IGJsdWU7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGNvbG9yIHNlbnNvciBwYXJhbWV0ZXJzOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHRlbXBlcmF0dXJlIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHRlbXBlcmF0dXJlIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyB0ZW1wZXJhdHVyZUVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3RlbXBlcmF0dXJlTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnRlbXBlcmF0dXJlQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX3RlbXBlcmF0dXJlTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGludGVnZXIgPSBkYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgY29uc3QgZGVjaW1hbCA9IGRhdGEuZ2V0VWludDgoMSk7XHJcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IGludGVnZXIgKyBkZWNpbWFsIC8gMTAwO1xyXG4gICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgdmFsdWU6IHRlbXBlcmF0dXJlLFxyXG4gICAgICAgIHVuaXQ6IFwiQ2Vsc2l1c1wiLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgcHJlc3N1cmUgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgcHJlc3N1cmUgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHByZXNzdXJlRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3ByZXNzdXJlTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnByZXNzdXJlQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9wcmVzc3VyZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgY29uc3QgaW50ZWdlciA9IGRhdGEuZ2V0VWludDMyKDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCBkZWNpbWFsID0gZGF0YS5nZXRVaW50OCg0KTtcclxuICAgIGNvbnN0IHByZXNzdXJlID0gaW50ZWdlciArIGRlY2ltYWwgLyAxMDA7XHJcbiAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgdmFsdWU6IHByZXNzdXJlLFxyXG4gICAgICAgIHVuaXQ6IFwiaFBhXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBodW1pZGl0eSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBodW1pZGl0eSBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgaHVtaWRpdHlFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5faHVtaWRpdHlOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5odW1pZGl0eUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfaHVtaWRpdHlOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgaHVtaWRpdHkgPSBkYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHZhbHVlOiBodW1pZGl0eSxcclxuICAgICAgICB1bml0OiBcIiVcIixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIGdhcyBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBnYXMgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdhc0VuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fZ2FzTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmdhc0NoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuICBfZ2FzTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICBjb25zdCBlY28yID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IHR2b2MgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xyXG5cclxuICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgZUNPMjoge1xyXG4gICAgICAgICAgdmFsdWU6IGVjbzIsXHJcbiAgICAgICAgICB1bml0OiBcInBwbVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVFZPQzoge1xyXG4gICAgICAgICAgdmFsdWU6IHR2b2MsXHJcbiAgICAgICAgICB1bml0OiBcInBwYlwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBjb2xvciBzZW5zb3Igbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgY29sb3Igc2Vuc29yIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBjb2xvckVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9jb2xvck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5jb2xvckNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfY29sb3JOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgIGNvbnN0IHIgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgZyA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCBiID0gZGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IGMgPSBkYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgclJhdGlvID0gciAvIChyICsgZyArIGIpO1xyXG4gICAgY29uc3QgZ1JhdGlvID0gZyAvIChyICsgZyArIGIpO1xyXG4gICAgY29uc3QgYlJhdGlvID0gYiAvIChyICsgZyArIGIpO1xyXG4gICAgY29uc3QgY2xlYXJBdEJsYWNrID0gMzAwO1xyXG4gICAgY29uc3QgY2xlYXJBdFdoaXRlID0gNDAwO1xyXG4gICAgY29uc3QgY2xlYXJEaWZmID0gY2xlYXJBdFdoaXRlIC0gY2xlYXJBdEJsYWNrO1xyXG4gICAgbGV0IGNsZWFyTm9ybWFsaXplZCA9IChjIC0gY2xlYXJBdEJsYWNrKSAvIGNsZWFyRGlmZjtcclxuXHJcbiAgICBpZiAoY2xlYXJOb3JtYWxpemVkIDwgMCkge1xyXG4gICAgICBjbGVhck5vcm1hbGl6ZWQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZWQgPSByUmF0aW8gKiAyNTUuMCAqIDMgKiBjbGVhck5vcm1hbGl6ZWQ7XHJcblxyXG4gICAgaWYgKHJlZCA+IDI1NSkge1xyXG4gICAgICByZWQgPSAyNTU7XHJcbiAgICB9XHJcbiAgICBsZXQgZ3JlZW4gPSBnUmF0aW8gKiAyNTUuMCAqIDMgKiBjbGVhck5vcm1hbGl6ZWQ7XHJcblxyXG4gICAgaWYgKGdyZWVuID4gMjU1KSB7XHJcbiAgICAgIGdyZWVuID0gMjU1O1xyXG4gICAgfVxyXG4gICAgbGV0IGJsdWUgPSBiUmF0aW8gKiAyNTUuMCAqIDMgKiBjbGVhck5vcm1hbGl6ZWQ7XHJcblxyXG4gICAgaWYgKGJsdWUgPiAyNTUpIHtcclxuICAgICAgYmx1ZSA9IDI1NTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgcmVkOiByZWQudG9GaXhlZCgwKSxcclxuICAgICAgICBncmVlbjogZ3JlZW4udG9GaXhlZCgwKSxcclxuICAgICAgICBibHVlOiBibHVlLnRvRml4ZWQoMCksXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyAgKioqKioqICAvL1xyXG4gIC8qICBVc2VyIGludGVyZmFjZSBzZXJ2aWNlICAqL1xyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBMRUQgc2V0dGluZ3MgZnJvbSB0aGUgVGhpbmd5IGRldmljZS4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBzdHJ1Y3R1cmUgdGhhdCBkZXBlbmRzIG9uIHRoZSBzZXR0aW5ncy5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSBSZXR1cm5zIGEgTEVEIHN0YXR1cyBvYmplY3QuIFRoZSBjb250ZW50IGFuZCBzdHJ1Y3R1cmUgZGVwZW5kcyBvbiB0aGUgY3VycmVudCBtb2RlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0TGVkU3RhdHVzKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubGVkQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBtb2RlID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgbGV0IHN0YXR1cztcclxuXHJcbiAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgc3RhdHVzID0ge0xFRHN0YXR1czoge21vZGU6IG1vZGV9fTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHN0YXR1cyA9IHtcclxuICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICByOiBkYXRhLmdldFVpbnQ4KDEpLFxyXG4gICAgICAgICAgZzogZGF0YS5nZXRVaW50OCgyKSxcclxuICAgICAgICAgIGI6IGRhdGEuZ2V0VWludDgoMyksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHN0YXR1cyA9IHtcclxuICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICBjb2xvcjogZGF0YS5nZXRVaW50OCgxKSxcclxuICAgICAgICAgIGludGVuc2l0eTogZGF0YS5nZXRVaW50OCgyKSxcclxuICAgICAgICAgIGRlbGF5OiBkYXRhLmdldFVpbnQxNigzLCBsaXR0bGVFbmRpYW4pLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICBzdGF0dXMgPSB7XHJcbiAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgY29sb3I6IGRhdGEuZ2V0VWludDgoMSksXHJcbiAgICAgICAgICBpbnRlbnNpdHk6IGRhdGEuZ2V0VWludDgoMiksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc3RhdHVzO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gZ2V0dGluZyBUaGluZ3kgTEVEIHN0YXR1czogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfbGVkU2V0KGRhdGFBcnJheSkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLmxlZENoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIExFRCBpbiBjb25zdGFudCBtb2RlIHdpdGggdGhlIHNwZWNpZmllZCBSR0IgY29sb3IuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBjb2xvciAtIENvbG9yIG9iamVjdCB3aXRoIFJHQiB2YWx1ZXNcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGNvbG9yLnJlZCAtIFRoZSB2YWx1ZSBmb3IgcmVkIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5ncmVlbiAtIFRoZSB2YWx1ZSBmb3IgZ3JlZW4gY29sb3IgaW4gYW4gUkdCIGNvbG9yLiBSYW5nZXMgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGNvbG9yLmJsdWUgLSBUaGUgdmFsdWUgZm9yIGJsdWUgY29sb3IgaW4gYW4gUkdCIGNvbG9yLiBSYW5nZXMgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSByZXNvbHZlZCBwcm9taXNlIG9yIGFuIGVycm9yIGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGxlZENvbnN0YW50KGNvbG9yKSB7XHJcbiAgICBpZiAoY29sb3IucmVkID09PSB1bmRlZmluZWQgfHwgY29sb3IuZ3JlZW4gPT09IHVuZGVmaW5lZCB8fCBjb2xvci5ibHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgb3B0aW9ucyBvYmplY3QgZm9yIG11c3QgaGF2ZSB0aGUgcHJvcGVydGllcyAncmVkJywgJ2dyZWVuJyBhbmQgJ2JsdWUnLlwiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoXHJcbiAgICAgIGNvbG9yLnJlZCA8IDAgfHxcclxuICAgICAgY29sb3IucmVkID4gMjU1IHx8XHJcbiAgICAgIGNvbG9yLmdyZWVuIDwgMCB8fFxyXG4gICAgICBjb2xvci5ncmVlbiA+IDI1NSB8fFxyXG4gICAgICBjb2xvci5ibHVlIDwgMCB8fFxyXG4gICAgICBjb2xvci5ibHVlID4gMjU1XHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIFJHQiB2YWx1ZXMgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDI1NVwiKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbGVkU2V0KG5ldyBVaW50OEFycmF5KFsxLCBjb2xvci5yZWQsIGNvbG9yLmdyZWVuLCBjb2xvci5ibHVlXSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIExFRCBpbiBcImJyZWF0aGVcIiBtb2RlIHdoZXJlIHRoZSBMRUQgY29udGludW91c2x5IHB1bHNlcyB3aXRoIHRoZSBzcGVjaWZpZWQgY29sb3IsIGludGVuc2l0eSBhbmQgZGVsYXkgYmV0d2VlbiBwdWxzZXMuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPcHRpb25zIG9iamVjdCBmb3IgTEVEIGJyZWF0aGUgbW9kZVxyXG4gICAqICBAcGFyYW0ge251bWJlcnxzdHJpbmd9IHBhcmFtcy5jb2xvciAtIFRoZSBjb2xvciBjb2RlIG9yIGNvbG9yIG5hbWUuIDEgPSByZWQsIDIgPSBncmVlbiwgMyA9IHllbGxvdywgNCA9IGJsdWUsIDUgPSBwdXJwbGUsIDYgPSBjeWFuLCA3ID0gd2hpdGUuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuaW50ZW5zaXR5IC0gSW50ZW5zaXR5IG9mIExFRCBwdWxzZXMuIFJhbmdlIGZyb20gMCB0byAxMDAgWyVdLlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmRlbGF5IC0gRGVsYXkgYmV0d2VlbiBwdWxzZXMgaW4gbWlsbGlzZWNvbmRzLiBSYW5nZSBmcm9tIDUwIG1zIHRvIDEwIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSByZXNvbHZlZCBwcm9taXNlIG9yIGFuIGVycm9yIGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGxlZEJyZWF0aGUocGFyYW1zKSB7XHJcbiAgICBjb25zdCBjb2xvcnMgPSBbXCJyZWRcIiwgXCJncmVlblwiLCBcInllbGxvd1wiLCBcImJsdWVcIiwgXCJwdXJwbGVcIiwgXCJjeWFuXCIsIFwid2hpdGVcIl07XHJcbiAgICBjb25zdCBjb2xvckNvZGUgPSB0eXBlb2YgcGFyYW1zLmNvbG9yID09PSBcInN0cmluZ1wiID8gY29sb3JzLmluZGV4T2YocGFyYW1zLmNvbG9yKSArIDEgOiBwYXJhbXMuY29sb3I7XHJcblxyXG4gICAgaWYgKHBhcmFtcy5jb2xvciA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pbnRlbnNpdHkgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuZGVsYXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcIlRoZSBvcHRpb25zIG9iamVjdCBmb3IgbXVzdCBoYXZlIHRoZSBwcm9wZXJ0aWVzICdjb2xvcicsICdpbnRlbnNpdHknIGFuZCAnaW50ZW5zaXR5Jy5cIilcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmIChjb2xvckNvZGUgPCAxIHx8IGNvbG9yQ29kZSA+IDcpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGNvbG9yIGNvZGUgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMSAtIDdcIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmFtcy5pbnRlbnNpdHkgPCAwIHx8IHBhcmFtcy5pbnRlbnNpdHkgPiAxMDApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGludGVuc2l0eSBtdXN0IGJlIGluIHRoZSByYW5nZSAwIC0gMTAwJVwiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAocGFyYW1zLmRlbGF5IDwgNTAgfHwgcGFyYW1zLmRlbGF5ID4gMTAwMDApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGRlbGF5IG11c3QgYmUgaW4gdGhlIHJhbmdlIDUwIG1zIC0gMTAgMDAwIG1zXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbGVkU2V0KG5ldyBVaW50OEFycmF5KFsyLCBjb2xvckNvZGUsIHBhcmFtcy5pbnRlbnNpdHksIHBhcmFtcy5kZWxheSAmIDB4ZmYsIChwYXJhbXMuZGVsYXkgPj4gOCkgJiAweGZmXSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIExFRCBpbiBvbmUtc2hvdCBtb2RlLiBPbmUtc2hvdCBtb2RlIHdpbGwgcmVzdWx0IGluIG9uZSBzaW5nbGUgcHVsc2Ugb2YgdGhlIExFRC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIE9wdGlvbiBvYmplY3QgZm9yIExFRCBpbiBvbmUtc2hvdCBtb2RlXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuY29sb3IgLSBUaGUgY29sb3IgY29kZS4gMSA9IHJlZCwgMiA9IGdyZWVuLCAzID0geWVsbG93LCA0ID0gYmx1ZSwgNSA9IHB1cnBsZSwgNiA9IGN5YW4sIDcgPSB3aGl0ZS5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5pbnRlbnNpdHkgLSBJbnRlbnNpdHkgb2YgTEVEIHB1bHNlcy4gUmFuZ2UgZnJvbSAwIHRvIDEwMCBbJV0uXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBsZWRPbmVTaG90KHBhcmFtcykge1xyXG4gICAgY29uc3QgY29sb3JzID0gW1wicmVkXCIsIFwiZ3JlZW5cIiwgXCJ5ZWxsb3dcIiwgXCJibHVlXCIsIFwicHVycGxlXCIsIFwiY3lhblwiLCBcIndoaXRlXCJdO1xyXG4gICAgY29uc3QgY29sb3JDb2RlID0gdHlwZW9mIHBhcmFtcy5jb2xvciA9PT0gXCJzdHJpbmdcIiA/IGNvbG9ycy5pbmRleE9mKHBhcmFtcy5jb2xvcikgKyAxIDogcGFyYW1zLmNvbG9yO1xyXG5cclxuICAgIGlmIChjb2xvckNvZGUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaW50ZW5zaXR5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoXCJUaGUgb3B0aW9ucyBvYmplY3QgZm9yIExFRCBvbmUtc2hvdCBtdXN0IGhhdmUgdGhlIHByb3BlcnRpZXMgJ2NvbG9yJyBhbmQgJ2ludGVuc2l0eS5cIilcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmIChjb2xvckNvZGUgPCAxIHx8IGNvbG9yQ29kZSA+IDcpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGNvbG9yIGNvZGUgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMSAtIDdcIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmFtcy5pbnRlbnNpdHkgPCAxIHx8IHBhcmFtcy5pbnRlbnNpdHkgPiAxMDApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGludGVuc2l0eSBtdXN0IGJlIGluIHRoZSByYW5nZSAwIC0gMTAwXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbGVkU2V0KG5ldyBVaW50OEFycmF5KFszLCBjb2xvckNvZGUsIHBhcmFtcy5pbnRlbnNpdHldKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBidXR0b24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgYnV0dG9uIG9uIHRoZSBUaGluZ3kgaXMgcHVzaGVkIG9yIHJlbGVhc2VkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBidXR0b24gb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2l0aCBidXR0b24gc3RhdGUgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBidXR0b25FbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2J1dHRvbk5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmJ1dHRvbkNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2J1dHRvbk5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBzdGF0ZSA9IGRhdGEuZ2V0VWludDgoMCk7XHJcbiAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoc3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBleHRlcm5hbCBwaW4gc2V0dGluZ3MgZnJvbSB0aGUgVGhpbmd5IGRldmljZS4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBwaW4gc3RhdHVzIGluZm9ybWF0aW9uLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gZXh0ZXJuYWwgcGluIHN0YXR1cyBvYmplY3QuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBleHRlcm5hbFBpbnNTdGF0dXMoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgcGluU3RhdHVzID0ge1xyXG4gICAgICAgIHBpbjE6IGRhdGEuZ2V0VWludDgoMCksXHJcbiAgICAgICAgcGluMjogZGF0YS5nZXRVaW50OCgxKSxcclxuICAgICAgICBwaW4zOiBkYXRhLmdldFVpbnQ4KDIpLFxyXG4gICAgICAgIHBpbjQ6IGRhdGEuZ2V0VWludDgoMyksXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiBwaW5TdGF0dXM7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiByZWFkaW5nIGZyb20gZXh0ZXJuYWwgcGluIGNoYXJhY3RlcmlzdGljOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXQgYW4gZXh0ZXJuYWwgcGluIHRvIGNob3NlbiBzdGF0ZS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBpbiAtIERldGVybWluZXMgd2hpY2ggcGluIGlzIHNldC4gUmFuZ2UgMSAtIDQuXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBwaW4uIDAgPSBPRkYsIDI1NSA9IE9OLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRFeHRlcm5hbFBpbihwaW4sIHZhbHVlKSB7XHJcbiAgICBpZiAocGluIDwgMSB8fCBwaW4gPiA0KSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQaW4gbnVtYmVyIG11c3QgYmUgMSAtIDRcIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKCEodmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDI1NSkpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlBpbiBzdGF0dXMgdmFsdWUgbXVzdCBiZSAwIG9yIDI1NVwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBwaW5zIHRoYXQgYXJlIG5vdCBiZWluZyBzZXRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoNCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5W3BpbiAtIDFdID0gdmFsdWU7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgZXh0ZXJuYWwgcGluczogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAgKioqKioqICAvL1xyXG4gIC8qICBNb3Rpb24gc2VydmljZSAgKi9cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIG9mIHRoZSBUaGluZ3kgbW90aW9uIG1vZHVsZS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGEgbW90aW9uIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdoZW4gcHJvbWlzZSByZXNvbHZlcywgb3IgYW4gZXJyb3IgaWYgcmVqZWN0ZWQuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRNb3Rpb25Db25maWcoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IHN0ZXBDb3VudGVySW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCB0ZW1wQ29tcEludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgbWFnbmV0Q29tcEludGVydmFsID0gZGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgbW90aW9uUHJvY2Vzc2luZ0ZyZXF1ZW5jeSA9IGRhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IHdha2VPbk1vdGlvbiA9IGRhdGEuZ2V0VWludDgoOCk7XHJcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICBzdGVwQ291bnRJbnRlcnZhbDogc3RlcENvdW50ZXJJbnRlcnZhbCxcclxuICAgICAgICB0ZW1wQ29tcEludGVydmFsOiB0ZW1wQ29tcEludGVydmFsLFxyXG4gICAgICAgIG1hZ25ldENvbXBJbnRlcnZhbDogbWFnbmV0Q29tcEludGVydmFsLFxyXG4gICAgICAgIG1vdGlvblByb2Nlc3NpbmdGcmVxdWVuY3k6IG1vdGlvblByb2Nlc3NpbmdGcmVxdWVuY3ksXHJcbiAgICAgICAgd2FrZU9uTW90aW9uOiB3YWtlT25Nb3Rpb24sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gZ2V0dGluZyBUaGluZ3kgbW90aW9uIG1vZHVsZSBjb25maWd1cmF0aW9uOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBzdGVwIGNvdW50ZXIgaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCAtIFN0ZXAgY291bnRlciBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA1IDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0U3RlcENvdW50ZXJJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gNTAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSAxMDAgLSA1MDAwIG1zLlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVswXSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzFdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHN0ZXAgY291bnQgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIHRlbXBlcmF0dXJlIGNvbXBlbnNhdGlvbiBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGVtcGVyYXR1cmUgY29tcGVuc2F0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDUgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRUZW1wZXJhdHVyZUNvbXBJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gNTAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSAxMDAgLSA1MDAwIG1zLlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVsyXSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzNdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHRlbXBlcmF0dXJlIGNvbXBlbnNhdGlvbiBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgbWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gTWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byAxIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0TWFnbmV0Q29tcEludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiAxMDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDEwMCAtIDEwMDAgbXMuXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzRdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbNV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgbWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyBtb3Rpb24gcHJvY2Vzc2luZyB1bml0IHVwZGF0ZSBmcmVxdWVuY3kuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBmcmVxdWVuY3kgLSBNb3Rpb24gcHJvY2Vzc2luZyBmcmVxdWVuY3kgaW4gSHouIFRoZSBhbGxvd2VkIHJhbmdlIGlzIDUgLSAyMDAgSHouXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldE1vdGlvblByb2Nlc3NGcmVxdWVuY3koZnJlcXVlbmN5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoZnJlcXVlbmN5IDwgMTAwIHx8IGZyZXF1ZW5jeSA+IDIwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSA1IC0gMjAwIEh6LlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs2XSA9IGZyZXF1ZW5jeSAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs3XSA9IChmcmVxdWVuY3kgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgbW90aW9uIHBvcmNlc3NpbmcgdW5pdCB1cGRhdGUgZnJlcXVlbmN5OiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHdha2Utb24tbW90aW9uIGZlYXR1cmUgdG8gZW5hYmxlZCBvciBkaXNhYmxlZCBzdGF0ZS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBTZXQgdG8gVHJ1ZSB0byBlbmFibGUgb3IgRmFsc2UgdG8gZGlzYWJsZSB3YWtlLW9uLW1vdGlvbiBmZWF0dXJlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRXYWtlT25Nb3Rpb24oZW5hYmxlKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodHlwZW9mIGVuYWJsZSAhPT0gXCJib29sZWFuXCIpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGFyZ3VtZW50IG11c3QgYmUgdHJ1ZSBvciBmYWxzZS5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbOF0gPSBlbmFibGUgPyAxIDogMDtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWw6XCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyB0YXAgZGV0ZWN0aW9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHRhcCBkZXRlY3Rpb24gb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHRhcEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fdGFwTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMudGFwRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnRhcENoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX3RhcE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBkYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgY29uc3QgY291bnQgPSBkYXRhLmdldFVpbnQ4KDEpO1xyXG4gICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgICBjb3VudDogY291bnQsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBvcmllbnRhdGlvbiBkZXRlY3Rpb24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgb3JpZW50YXRpb24gZGV0ZWN0aW9uIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBvcmllbnRhdGlvbkVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9vcmllbnRhdGlvbk5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5vcmllbnRhdGlvbkNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfb3JpZW50YXRpb25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIob3JpZW50YXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBxdWF0ZXJuaW9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHF1YXRlcm5pb24gb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHF1YXRlcm5pb25FbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9xdWF0ZXJuaW9uTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnF1YXRlcm5pb25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfcXVhdGVybmlvbk5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5ICgxIDw8IDMwKSBhY2NvcmRpbmcgdG8gc2Vuc29yIHNwZWNpZmljYXRpb25cclxuICAgIGxldCB3ID0gZGF0YS5nZXRJbnQzMigwLCB0cnVlKSAvICgxIDw8IDMwKTtcclxuICAgIGxldCB4ID0gZGF0YS5nZXRJbnQzMig0LCB0cnVlKSAvICgxIDw8IDMwKTtcclxuICAgIGxldCB5ID0gZGF0YS5nZXRJbnQzMig4LCB0cnVlKSAvICgxIDw8IDMwKTtcclxuICAgIGxldCB6ID0gZGF0YS5nZXRJbnQzMigxMiwgdHJ1ZSkgLyAoMSA8PCAzMCk7XHJcbiAgICBjb25zdCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoTWF0aC5wb3codywgMikgKyBNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpICsgTWF0aC5wb3coeiwgMikpO1xyXG5cclxuICAgIGlmIChtYWduaXR1ZGUgIT09IDApIHtcclxuICAgICAgdyAvPSBtYWduaXR1ZGU7XHJcbiAgICAgIHggLz0gbWFnbml0dWRlO1xyXG4gICAgICB5IC89IG1hZ25pdHVkZTtcclxuICAgICAgeiAvPSBtYWduaXR1ZGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgdzogdyxcclxuICAgICAgICB4OiB4LFxyXG4gICAgICAgIHk6IHksXHJcbiAgICAgICAgejogeixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHN0ZXAgY291bnRlciBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBzdGVwIGNvdW50ZXIgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHN0ZXBFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9zdGVwTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnN0ZXBDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfc3RlcE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgY29uc3QgY291bnQgPSBkYXRhLmdldFVpbnQzMigwLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgdGltZSA9IGRhdGEuZ2V0VWludDMyKDQsIGxpdHRsZUVuZGlhbik7XHJcbiAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICBjb3VudDogY291bnQsXHJcbiAgICAgICAgdGltZToge1xyXG4gICAgICAgICAgdmFsdWU6IHRpbWUsXHJcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHJhdyBtb3Rpb24gZGF0YSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSByYXcgbW90aW9uIGRhdGEgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIG1vdGlvblJhd0VuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fbW90aW9uUmF3Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLm1vdGlvblJhd0NoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX21vdGlvblJhd05vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5IDJeNiA9IDY0IHRvIGdldCBhY2NlbGVyb21ldGVyIGNvcnJlY3QgdmFsdWVzXHJcbiAgICBjb25zdCBhY2NYID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDY0O1xyXG4gICAgY29uc3QgYWNjWSA9IGRhdGEuZ2V0SW50MTYoMiwgdHJ1ZSkgLyA2NDtcclxuICAgIGNvbnN0IGFjY1ogPSBkYXRhLmdldEludDE2KDQsIHRydWUpIC8gNjQ7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5IDJeMTEgPSAyMDQ4IHRvIGdldCBjb3JyZWN0IGd5cm9zY29wZSB2YWx1ZXNcclxuICAgIGNvbnN0IGd5cm9YID0gZGF0YS5nZXRJbnQxNig2LCB0cnVlKSAvIDIwNDg7XHJcbiAgICBjb25zdCBneXJvWSA9IGRhdGEuZ2V0SW50MTYoOCwgdHJ1ZSkgLyAyMDQ4O1xyXG4gICAgY29uc3QgZ3lyb1ogPSBkYXRhLmdldEludDE2KDEwLCB0cnVlKSAvIDIwNDg7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5IDJeMTIgPSA0MDk2IHRvIGdldCBjb3JyZWN0IGNvbXBhc3MgdmFsdWVzXHJcbiAgICBjb25zdCBjb21wYXNzWCA9IGRhdGEuZ2V0SW50MTYoMTIsIHRydWUpIC8gNDA5NjtcclxuICAgIGNvbnN0IGNvbXBhc3NZID0gZGF0YS5nZXRJbnQxNigxNCwgdHJ1ZSkgLyA0MDk2O1xyXG4gICAgY29uc3QgY29tcGFzc1ogPSBkYXRhLmdldEludDE2KDE2LCB0cnVlKSAvIDQwOTY7XHJcblxyXG4gICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICBhY2NlbGVyb21ldGVyOiB7XHJcbiAgICAgICAgICB4OiBhY2NYLFxyXG4gICAgICAgICAgeTogYWNjWSxcclxuICAgICAgICAgIHo6IGFjY1osXHJcbiAgICAgICAgICB1bml0OiBcIkdcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGd5cm9zY29wZToge1xyXG4gICAgICAgICAgeDogZ3lyb1gsXHJcbiAgICAgICAgICB5OiBneXJvWSxcclxuICAgICAgICAgIHo6IGd5cm9aLFxyXG4gICAgICAgICAgdW5pdDogXCJkZWcvc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGFzczoge1xyXG4gICAgICAgICAgeDogY29tcGFzc1gsXHJcbiAgICAgICAgICB5OiBjb21wYXNzWSxcclxuICAgICAgICAgIHo6IGNvbXBhc3NaLFxyXG4gICAgICAgICAgdW5pdDogXCJtaWNyb1Rlc2xhXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIEV1bGVyIGFuZ2xlIGRhdGEgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGFuIEV1bGVyIGFuZ2xlIGRhdGEgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGV1bGVyRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2V1bGVyTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmV1bGVyQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9ldWxlck5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5IHR3byBieXRlcyAoMTw8MTYgb3IgMl4xNiBvciA2NTUzNikgdG8gZ2V0IGNvcnJlY3QgdmFsdWVcclxuICAgIGNvbnN0IHJvbGwgPSBkYXRhLmdldEludDMyKDAsIHRydWUpIC8gNjU1MzY7XHJcbiAgICBjb25zdCBwaXRjaCA9IGRhdGEuZ2V0SW50MzIoNCwgdHJ1ZSkgLyA2NTUzNjtcclxuICAgIGNvbnN0IHlhdyA9IGRhdGEuZ2V0SW50MzIoOCwgdHJ1ZSkgLyA2NTUzNjtcclxuXHJcbiAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgcm9sbDogcm9sbCxcclxuICAgICAgICBwaXRjaDogcGl0Y2gsXHJcbiAgICAgICAgeWF3OiB5YXcsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyByb3RhdGlvbiBtYXRyaXggbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN1bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGFuIHJvdGF0aW9uIG1hdHJpeCBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgcm90YXRpb25NYXRyaXhFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fcm90YXRpb25NYXRyaXhOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKFxyXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4Q2hhcmFjdGVyaXN0aWMsXHJcbiAgICAgIGVuYWJsZSxcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzBdXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgX3JvdGF0aW9uTWF0cml4Tm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAvLyBEaXZpZGUgYnkgMl4yID0gNCB0byBnZXQgY29ycmVjdCB2YWx1ZXNcclxuICAgIGNvbnN0IHIxYzEgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIxYzIgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIxYzMgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIyYzEgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIyYzIgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIyYzMgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIzYzEgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIzYzIgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuICAgIGNvbnN0IHIzYzMgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcclxuXHJcbiAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgcm93MTogW3IxYzEsIHIxYzIsIHIxYzNdLFxyXG4gICAgICAgIHJvdzI6IFtyMmMxLCByMmMyLCByMmMzXSxcclxuICAgICAgICByb3czOiBbcjNjMSwgcjNjMiwgcjNjM10sXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBoZWFkaW5nIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGhlYWRpbmcgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGhlYWRpbmdFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9oZWFkaW5nTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmhlYWRpbmdDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfaGVhZGluZ05vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgLy8gRGl2aWRlIGJ5IDJeMTYgPSA2NTUzNiB0byBnZXQgY29ycmVjdCBoZWFkaW5nIHZhbHVlc1xyXG4gICAgY29uc3QgaGVhZGluZyA9IGRhdGEuZ2V0SW50MzIoMCwgdHJ1ZSkgLyA2NTUzNjtcclxuXHJcbiAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB2YWx1ZTogaGVhZGluZyxcclxuICAgICAgICB1bml0OiBcImRlZ3JlZXNcIixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIGdyYXZpdHkgdmVjdG9yIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGhlYWRpbmcgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdyYXZpdHlWZWN0b3JFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9ncmF2aXR5VmVjdG9yTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yQ2hhcmFjdGVyaXN0aWMsXHJcbiAgICAgIGVuYWJsZSxcclxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMF1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBfZ3Jhdml0eVZlY3Rvck5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCB4ID0gZGF0YS5nZXRGbG9hdDMyKDAsIHRydWUpO1xyXG4gICAgY29uc3QgeSA9IGRhdGEuZ2V0RmxvYXQzMig0LCB0cnVlKTtcclxuICAgIGNvbnN0IHogPSBkYXRhLmdldEZsb2F0MzIoOCwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIHo6IHosXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyAgKioqKioqICAvL1xyXG5cclxuICAvKiAgU291bmQgc2VydmljZSAgKi9cclxuXHJcbiAgbWljcm9waG9uZUVuYWJsZShlbmFibGUpIHtcclxuICAgIC8vIFRhYmxlcyBvZiBjb25zdGFudHMgbmVlZGVkIGZvciB3aGVuIHdlIGRlY29kZSB0aGUgYWRwY20tZW5jb2RlZCBhdWRpbyBmcm9tIHRoZSBUaGluZ3lcclxuICAgIGlmICh0aGlzLl9NSUNST1BIT05FX0lOREVYX1RBQkxFID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5fTUlDUk9QSE9ORV9JTkRFWF9UQUJMRSA9IFstMSwgLTEsIC0xLCAtMSwgMiwgNCwgNiwgOCwgLTEsIC0xLCAtMSwgLTEsIDIsIDQsIDYsIDhdO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEUgPSBbNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNiwgMTcsIDE5LCAyMSwgMjMsIDI1LCAyOCwgMzEsIDM0LCAzNywgNDEsIDQ1LCA1MCwgNTUsIDYwLCA2NiwgNzMsIDgwLCA4OCwgOTcsIDEwNywgMTE4LCAxMzAsIDE0MywgMTU3LCAxNzMsIDE5MCwgMjA5LFxyXG4gICAgICAgIDIzMCwgMjUzLCAyNzksIDMwNywgMzM3LCAzNzEsIDQwOCwgNDQ5LCA0OTQsIDU0NCwgNTk4LCA2NTgsIDcyNCwgNzk2LCA4NzYsIDk2MywgMTA2MCwgMTE2NiwgMTI4MiwgMTQxMSwgMTU1MiwgMTcwNywgMTg3OCwgMjA2NiwgMjI3MiwgMjQ5OSwgMjc0OSwgMzAyNCwgMzMyNywgMzY2MCwgNDAyNiwgNDQyOCwgNDg3MSwgNTM1OCxcclxuICAgICAgICA1ODk0LCA2NDg0LCA3MTMyLCA3ODQ1LCA4NjMwLCA5NDkzLCAxMDQ0MiwgMTE0ODcsIDEyNjM1LCAxMzg5OSwgMTUyODksIDE2ODE4LCAxODUwMCwgMjAzNTAsIDIyMzg1LCAyNDYyMywgMjcwODYsIDI5Nzk0LCAzMjc2N107XHJcbiAgICB9XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMubWljcm9waG9uZUV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fbWljcm9waG9uZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgLy8gbGFnZXIgZW4gbnkgYXVkaW8gY29udGV4dCwgc2thbCBiYXJlIGhhIMOpbiBhdiBkZW5uZVxyXG4gICAgICBpZiAodGhpcy5hdWRpb0N0eCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xyXG4gICAgICAgIHRoaXMuYXVkaW9DdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLm1pY3JvcGhvbmVDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm1pY3JvcGhvbmVFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG4gIF9taWNyb3Bob25lTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgYXVkaW9QYWNrZXQgPSBldmVudC50YXJnZXQudmFsdWUuYnVmZmVyO1xyXG4gICAgY29uc3QgYWRwY20gPSB7XHJcbiAgICAgIGhlYWRlcjogbmV3IERhdGFWaWV3KGF1ZGlvUGFja2V0LnNsaWNlKDAsIDMpKSxcclxuICAgICAgZGF0YTogbmV3IERhdGFWaWV3KGF1ZGlvUGFja2V0LnNsaWNlKDMpKSxcclxuICAgIH07XHJcbiAgICBjb25zdCBkZWNvZGVkQXVkaW8gPSB0aGlzLl9kZWNvZGVBdWRpbyhhZHBjbSk7XHJcbiAgICB0aGlzLl9wbGF5RGVjb2RlZEF1ZGlvKGRlY29kZWRBdWRpbyk7XHJcbiAgfVxyXG4gIC8qICBTb3VuZCBzZXJ2aWNlICAqL1xyXG4gIF9kZWNvZGVBdWRpbyhhZHBjbSkge1xyXG4gICAgLy8gQWxsb2NhdGUgb3V0cHV0IGJ1ZmZlclxyXG4gICAgY29uc3QgYXVkaW9CdWZmZXJEYXRhTGVuZ3RoID0gYWRwY20uZGF0YS5ieXRlTGVuZ3RoO1xyXG4gICAgY29uc3QgYXVkaW9CdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNTEyKTtcclxuICAgIGNvbnN0IHBjbSA9IG5ldyBEYXRhVmlldyhhdWRpb0J1ZmZlcik7XHJcbiAgICBsZXQgZGlmZjtcclxuICAgIGxldCBidWZmZXJTdGVwID0gZmFsc2U7XHJcbiAgICBsZXQgaW5wdXRCdWZmZXIgPSAwO1xyXG4gICAgbGV0IGRlbHRhID0gMDtcclxuICAgIGxldCBzaWduID0gMDtcclxuICAgIGxldCBzdGVwO1xyXG5cclxuICAgIC8vIFRoZSBmaXJzdCAyIGJ5dGVzIG9mIEFEUENNIGZyYW1lIGFyZSB0aGUgcHJlZGljdGVkIHZhbHVlXHJcbiAgICBsZXQgdmFsdWVQcmVkaWN0ZWQgPSBhZHBjbS5oZWFkZXIuZ2V0SW50MTYoMCwgZmFsc2UpO1xyXG4gICAgLy8gVGhlIDNyZCBieXRlIGlzIHRoZSBpbmRleCB2YWx1ZVxyXG4gICAgbGV0IGluZGV4ID0gYWRwY20uaGVhZGVyLmdldEludDgoMik7XHJcbiAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgIGluZGV4ID0gMDtcclxuICAgIH1cclxuICAgIGlmIChpbmRleCA+IDg4KSB7XHJcbiAgICAgIGluZGV4ID0gODg7XHJcbiAgICB9XHJcbiAgICBzdGVwID0gdGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEVbaW5kZXhdO1xyXG4gICAgZm9yIChsZXQgX2luID0gMCwgX291dCA9IDA7IF9pbiA8IGF1ZGlvQnVmZmVyRGF0YUxlbmd0aDsgX291dCArPSAyKSB7XHJcbiAgICAgIC8qIFN0ZXAgMSAtIGdldCB0aGUgZGVsdGEgdmFsdWUgKi9cclxuICAgICAgaWYgKGJ1ZmZlclN0ZXApIHtcclxuICAgICAgICBkZWx0YSA9IGlucHV0QnVmZmVyICYgMHgwRjtcclxuICAgICAgICBfaW4rKztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnB1dEJ1ZmZlciA9IGFkcGNtLmRhdGEuZ2V0SW50OChfaW4pO1xyXG4gICAgICAgIGRlbHRhID0gKGlucHV0QnVmZmVyID4+IDQpICYgMHgwRjtcclxuICAgICAgfVxyXG4gICAgICBidWZmZXJTdGVwID0gIWJ1ZmZlclN0ZXA7XHJcbiAgICAgIC8qIFN0ZXAgMiAtIEZpbmQgbmV3IGluZGV4IHZhbHVlIChmb3IgbGF0ZXIpICovXHJcbiAgICAgIGluZGV4ICs9IHRoaXMuX01JQ1JPUEhPTkVfSU5ERVhfVEFCTEVbZGVsdGFdO1xyXG4gICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgaW5kZXggPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpbmRleCA+IDg4KSB7XHJcbiAgICAgICAgaW5kZXggPSA4ODtcclxuICAgICAgfVxyXG4gICAgICAvKiBTdGVwIDMgLSBTZXBhcmF0ZSBzaWduIGFuZCBtYWduaXR1ZGUgKi9cclxuICAgICAgc2lnbiA9IGRlbHRhICYgODtcclxuICAgICAgZGVsdGEgPSBkZWx0YSAmIDc7XHJcbiAgICAgIC8qIFN0ZXAgNCAtIENvbXB1dGUgZGlmZmVyZW5jZSBhbmQgbmV3IHByZWRpY3RlZCB2YWx1ZSAqL1xyXG4gICAgICBkaWZmID0gKHN0ZXAgPj4gMyk7XHJcbiAgICAgIGlmICgoZGVsdGEgJiA0KSA+IDApIHtcclxuICAgICAgICBkaWZmICs9IHN0ZXA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKChkZWx0YSAmIDIpID4gMCkge1xyXG4gICAgICAgIGRpZmYgKz0gKHN0ZXAgPj4gMSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKChkZWx0YSAmIDEpID4gMCkge1xyXG4gICAgICAgIGRpZmYgKz0gKHN0ZXAgPj4gMik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHNpZ24gPiAwKSB7XHJcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgLT0gZGlmZjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZVByZWRpY3RlZCArPSBkaWZmO1xyXG4gICAgICB9XHJcbiAgICAgIC8qIFN0ZXAgNSAtIGNsYW1wIG91dHB1dCB2YWx1ZSAqL1xyXG4gICAgICBpZiAodmFsdWVQcmVkaWN0ZWQgPiAzMjc2Nykge1xyXG4gICAgICAgIHZhbHVlUHJlZGljdGVkID0gMzI3Njc7XHJcbiAgICAgIH0gZWxzZSBpZiAodmFsdWVQcmVkaWN0ZWQgPCAtMzI3NjgpIHtcclxuICAgICAgICB2YWx1ZVByZWRpY3RlZCA9IC0zMjc2ODtcclxuICAgICAgfVxyXG4gICAgICAvKiBTdGVwIDYgLSBVcGRhdGUgc3RlcCB2YWx1ZSAqL1xyXG4gICAgICBzdGVwID0gdGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEVbaW5kZXhdO1xyXG4gICAgICAvKiBTdGVwIDcgLSBPdXRwdXQgdmFsdWUgKi9cclxuICAgICAgcGNtLnNldEludDE2KF9vdXQsIHZhbHVlUHJlZGljdGVkLCB0cnVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwY207XHJcbiAgfVxyXG4gIF9wbGF5RGVjb2RlZEF1ZGlvKGF1ZGlvKSB7XHJcbiAgICBpZiAodGhpcy5fYXVkaW9TdGFjayA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX2F1ZGlvU3RhY2sgPSBbXTtcclxuICAgIH1cclxuICAgIHRoaXMuX2F1ZGlvU3RhY2sucHVzaChhdWRpbyk7XHJcbiAgICBpZiAodGhpcy5fYXVkaW9TdGFjay5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5fc2NoZWR1bGVBdWRpb0J1ZmZlcnMoKTtcclxuICAgIH1cclxuICB9XHJcbiAgX3NjaGVkdWxlQXVkaW9CdWZmZXJzKCkge1xyXG4gICAgd2hpbGUgKHRoaXMuX2F1ZGlvU3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCBidWZmZXJUaW1lID0gMC4wMTsgLy8gQnVmZmVyIHRpbWUgaW4gc2Vjb25kcyBiZWZvcmUgaW5pdGlhbCBhdWRpbyBjaHVuayBpcyBwbGF5ZWRcclxuICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5fYXVkaW9TdGFjay5zaGlmdCgpO1xyXG4gICAgICBjb25zdCBjaGFubmVscyA9IDE7XHJcbiAgICAgIGNvbnN0IGZyYW1lY291bnQgPSBidWZmZXIuYnl0ZUxlbmd0aCAvIDI7XHJcbiAgICAgIGlmICh0aGlzLl9hdWRpb05leHRUaW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLl9hdWRpb05leHRUaW1lID0gMDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBteUFycmF5QnVmZmVyID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVCdWZmZXIoY2hhbm5lbHMsIGZyYW1lY291bnQsIDE2MDAwKTtcclxuICAgICAgLy8gVGhpcyBnaXZlcyB1cyB0aGUgYWN0dWFsIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIGRhdGFcclxuICAgICAgY29uc3Qgbm93QnVmZmVyaW5nID0gbXlBcnJheUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXIuYnl0ZUxlbmd0aCAvIDI7IGkrKykge1xyXG4gICAgICAgIG5vd0J1ZmZlcmluZ1tpXSA9IGJ1ZmZlci5nZXRJbnQxNigyICogaSwgdHJ1ZSkgLyAzMjc2OC4wO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuYXVkaW9DdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgIHNvdXJjZS5idWZmZXIgPSBteUFycmF5QnVmZmVyO1xyXG4gICAgICBzb3VyY2UuY29ubmVjdCh0aGlzLmF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcclxuICAgICAgaWYgKHRoaXMuX2F1ZGlvTmV4dFRpbWUgPT09IDApIHtcclxuICAgICAgICB0aGlzLl9hdWRpb05leHRUaW1lID0gdGhpcy5hdWRpb0N0eC5jdXJyZW50VGltZSArIGJ1ZmZlclRpbWU7XHJcbiAgICAgIH1cclxuICAgICAgc291cmNlLnN0YXJ0KHRoaXMuX2F1ZGlvTmV4dFRpbWUpO1xyXG4gICAgICB0aGlzLl9hdWRpb05leHRUaW1lICs9IHNvdXJjZS5idWZmZXIuZHVyYXRpb247XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vICAqKioqKiogIC8vXHJcblxyXG4gIC8qICBCYXR0ZXJ5IHNlcnZpY2UgICovXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGJhdHRlcnkgbGV2ZWwgb2YgVGhpbmd5LlxyXG4gICAqXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0IHwgRXJyb3I+fSBSZXR1cm5zIGJhdHRlcnkgbGV2ZWwgaW4gcGVyY2VudGFnZSB3aGVuIHByb21pc2UgaXMgcmVzb2x2ZWQgb3IgYW4gZXJyb3IgaWYgcmVqZWN0ZWQuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRCYXR0ZXJ5TGV2ZWwoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmJhdHRlcnlDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGxldmVsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDApO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB2YWx1ZTogbGV2ZWwsXHJcbiAgICAgICAgdW5pdDogXCIlXCIsXHJcbiAgICAgIH07XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBiYXR0ZXJ5IGxldmVsIG5vdGlmaWNhdGlvbnMuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBiYXR0ZXJ5IGxldmVsIGNoYW5nZS4gV2lsbCByZWNlaXZlIGEgYmF0dGVyeSBsZXZlbCBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICAgKi9cclxuICBhc3luYyBiYXR0ZXJ5TGV2ZWxFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2JhdHRlcnlMZXZlbE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5iYXR0ZXJ5Q2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfYmF0dGVyeUxldmVsTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IHZhbHVlID0gZGF0YS5nZXRVaW50OCgwKTtcclxuXHJcbiAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICB1bml0OiBcIiVcIixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vICAqKioqKiogIC8vXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7UGFydFRoZW1lTWl4aW59IGZyb20gJy4vbGlicy9wYXJ0LXRoZW1lLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0VGhlbWVFbGVtZW50IGV4dGVuZHMgUGFydFRoZW1lTWl4aW4oSFRNTEVsZW1lbnQpIHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgYDtcclxuICAgIH1cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICBpZiAoIXRoaXMuc2hhZG93Um9vdCkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5jb25zdHJ1Y3Rvci50ZW1wbGF0ZTtcclxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcclxuICAgICAgICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LmltcG9ydE5vZGUoXHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5jb250ZW50LCB0cnVlKTtcclxuICAgICAgICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChkb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBYVGh1bWJzIGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLXVwXCI+8J+RjTwvZGl2PlxyXG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLWRvd25cIj7wn5GOPC9kaXY+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtdGh1bWJzJywgWFRodW1icyk7XHJcblxyXG5leHBvcnQgY2xhc3MgWFJhdGluZyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgICA6aG9zdCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCBncmVlbjtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogYmx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLWRvd24pIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIHJlZDtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgIH1cclxuICAgICAgICA8L3N0eWxlPlxyXG4gICAgICAgIDxkaXYgcGFydD1cInN1YmplY3RcIj48c2xvdD48L3Nsb3Q+PC9kaXY+XHJcbiAgICAgICAgPHgtdGh1bWJzIHBhcnQ9XCIqID0+IHJhdGluZy0qXCI+PC94LXRodW1icz5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXJhdGluZycsIFhSYXRpbmcpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFhIb3N0IGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxzdHlsZT5cclxuICAgICAgICAgIDpob3N0IHtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIG9yYW5nZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nIHtcclxuICAgICAgICAgICAgbWFyZ2luOiA0cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZyB7XHJcbiAgICAgICAgICAgIC0tZTEtcGFydC1zdWJqZWN0LXBhZGRpbmc6IDRweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86aG92ZXI6OnBhcnQoc3ViamVjdCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLmR1bzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdvbGRlbnJvZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdyZWVuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLnVubzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0b21hdG87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB5ZWxsb3c7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmc6OnRoZW1lKHRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICA8eC1yYXRpbmcgY2xhc3M9XCJ1bm9cIj7inaTvuI88L3gtcmF0aW5nPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8eC1yYXRpbmcgY2xhc3M9XCJkdW9cIj7wn6S3PC94LXJhdGluZz5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LWhvc3QnLCBYSG9zdCk7IiwiLypcbkBsaWNlbnNlXG5Db3B5cmlnaHQgKGMpIDIwMTcgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuVGhpcyBjb2RlIG1heSBvbmx5IGJlIHVzZWQgdW5kZXIgdGhlIEJTRCBzdHlsZSBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcblRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxuQ29kZSBkaXN0cmlidXRlZCBieSBHb29nbGUgYXMgcGFydCBvZiB0aGUgcG9seW1lciBwcm9qZWN0IGlzIGFsc29cbnN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4qL1xuXG5jb25zdCBwYXJ0RGF0YUtleSA9ICdfX2Nzc1BhcnRzJztcbmNvbnN0IHBhcnRJZEtleSA9ICdfX3BhcnRJZCc7XG5cbi8qKlxuICogQ29udmVydHMgYW55IHN0eWxlIGVsZW1lbnRzIGluIHRoZSBzaGFkb3dSb290IHRvIHJlcGxhY2UgOjpwYXJ0Lzo6dGhlbWVcbiAqIHdpdGggY3VzdG9tIHByb3BlcnRpZXMgdXNlZCB0byB0cmFuc21pdCB0aGlzIGRhdGEgZG93biB0aGUgZG9tIHRyZWUuIEFsc29cbiAqIGNhY2hlcyBwYXJ0IG1ldGFkYXRhIGZvciBsYXRlciBsb29rdXAuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplUGFydHMoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQuc2hhZG93Um9vdCkge1xuICAgIGVsZW1lbnRbcGFydERhdGFLZXldID0gbnVsbDtcbiAgICByZXR1cm47XG4gIH1cbiAgQXJyYXkuZnJvbShlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSkuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgY29uc3QgaW5mbyA9IHBhcnRDc3NUb0N1c3RvbVByb3BDc3MoZWxlbWVudCwgc3R5bGUudGV4dENvbnRlbnQpO1xuICAgIGlmIChpbmZvLnBhcnRzKSB7XG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IGVsZW1lbnRbcGFydERhdGFLZXldIHx8IFtdO1xuICAgICAgZWxlbWVudFtwYXJ0RGF0YUtleV0ucHVzaCguLi5pbmZvLnBhcnRzKTtcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gaW5mby5jc3M7XG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnX19jc3NQYXJ0cycpKSB7XG4gICAgaW5pdGlhbGl6ZVBhcnRzKGVsZW1lbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpO1xuICByZXR1cm4gZWxlbWVudFtwYXJ0RGF0YUtleV07XG59XG5cbi8vIFRPRE8oc29ydmVsbCk6IGJyaXR0bGUgZHVlIHRvIHJlZ2V4LWluZyBjc3MuIEluc3RlYWQgdXNlIGEgY3NzIHBhcnNlci5cbi8qKlxuICogVHVybnMgY3NzIHVzaW5nIGA6OnBhcnRgIGludG8gY3NzIHVzaW5nIHZhcmlhYmxlcyBmb3IgdGhvc2UgcGFydHMuXG4gKiBBbHNvIHJldHVybnMgcGFydCBtZXRhZGF0YS5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IGNzc1RleHRcbiAqIEByZXR1cm5zIHtPYmplY3R9IGNzczogcGFydGlmaWVkIGNzcywgcGFydHM6IGFycmF5IG9mIHBhcnRzIG9mIHRoZSBmb3JtXG4gKiB7bmFtZSwgc2VsZWN0b3IsIHByb3BzfVxuICogRXhhbXBsZSBvZiBwYXJ0LWlmaWVkIGNzcywgZ2l2ZW46XG4gKiAuZm9vOjpwYXJ0KGJhcikgeyBjb2xvcjogcmVkIH1cbiAqIG91dHB1dDpcbiAqIC5mb28geyAtLWUxLXBhcnQtYmFyLWNvbG9yOiByZWQ7IH1cbiAqIHdoZXJlIGBlMWAgaXMgYSBndWlkIGZvciB0aGlzIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHBhcnRDc3NUb0N1c3RvbVByb3BDc3MoZWxlbWVudCwgY3NzVGV4dCkge1xuICBsZXQgcGFydHM7XG4gIGxldCBjc3MgPSBjc3NUZXh0LnJlcGxhY2UoY3NzUmUsIChtLCBzZWxlY3RvciwgdHlwZSwgbmFtZSwgZW5kU2VsZWN0b3IsIHByb3BzU3RyKSA9PiB7XG4gICAgcGFydHMgPSBwYXJ0cyB8fCBbXTtcbiAgICBsZXQgcHJvcHMgPSB7fTtcbiAgICBjb25zdCBwcm9wc0FycmF5ID0gcHJvcHNTdHIuc3BsaXQoL1xccyo7XFxzKi8pO1xuICAgIHByb3BzQXJyYXkuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGNvbnN0IHMgPSBwcm9wLnNwbGl0KCc6Jyk7XG4gICAgICBjb25zdCBuYW1lID0gcy5zaGlmdCgpLnRyaW0oKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcy5qb2luKCc6Jyk7XG4gICAgICBwcm9wc1tuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBwYXJ0cy5wdXNoKHtzZWxlY3RvciwgZW5kU2VsZWN0b3IsIG5hbWUsIHByb3BzLCBpc1RoZW1lOiB0eXBlID09IHRoZW1lfSk7XG4gICAgbGV0IHBhcnRQcm9wcyA9ICcnO1xuICAgIGZvciAobGV0IHAgaW4gcHJvcHMpIHtcbiAgICAgIHBhcnRQcm9wcyA9IGAke3BhcnRQcm9wc31cXG5cXHQke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIGVuZFNlbGVjdG9yKX06ICR7cHJvcHNbcF19O2A7XG4gICAgfVxuICAgIHJldHVybiBgXFxuJHtzZWxlY3RvciB8fCAnKid9IHtcXG5cXHQke3BhcnRQcm9wcy50cmltKCl9XFxufWA7XG4gIH0pO1xuICByZXR1cm4ge3BhcnRzLCBjc3N9O1xufVxuXG4vLyBndWlkIGZvciBlbGVtZW50IHBhcnQgc2NvcGVzXG5sZXQgcGFydElkID0gMDtcbmZ1bmN0aW9uIHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudFtwYXJ0SWRLZXldID09IHVuZGVmaW5lZCkge1xuICAgIGVsZW1lbnRbcGFydElkS2V5XSA9IHBhcnRJZCsrO1xuICB9XG4gIHJldHVybiBlbGVtZW50W3BhcnRJZEtleV07XG59XG5cbmNvbnN0IHRoZW1lID0gJzo6dGhlbWUnO1xuY29uc3QgY3NzUmUgPSAvXFxzKiguKikoOjooPzpwYXJ0fHRoZW1lKSlcXCgoW14pXSspXFwpKFteXFxze10qKVxccyp7XFxzKihbXn1dKilcXHMqfS9nXG5cbi8vIGNyZWF0ZXMgYSBjdXN0b20gcHJvcGVydHkgbmFtZSBmb3IgYSBwYXJ0LlxuZnVuY3Rpb24gdmFyRm9yUGFydChpZCwgbmFtZSwgcHJvcCwgZW5kU2VsZWN0b3IpIHtcbiAgcmV0dXJuIGAtLWUke2lkfS1wYXJ0LSR7bmFtZX0tJHtwcm9wfSR7ZW5kU2VsZWN0b3IgPyBgLSR7ZW5kU2VsZWN0b3IucmVwbGFjZSgvXFw6L2csICcnKX1gIDogJyd9YDtcbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBhIHN0eWxlIHVzaW5nIGNzcyBjdXN0b20gcHJvcGVydGllcyB0byBzdHlsZSA6OnBhcnQvOjp0aGVtZVxuICogZm9yIGFsbCB0aGUgZG9tIGluIHRoZSBlbGVtZW50J3Mgc2hhZG93Um9vdC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQYXJ0VGhlbWUoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC5zaGFkb3dSb290KSB7XG4gICAgY29uc3Qgb2xkU3R5bGUgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3R5bGVbcGFydHNdJyk7XG4gICAgaWYgKG9sZFN0eWxlKSB7XG4gICAgICBvbGRTdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZFN0eWxlKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xuICBpZiAoaG9zdCkge1xuICAgIC8vIG5vdGU6IGVuc3VyZSBob3N0IGhhcyBwYXJ0IGRhdGEgc28gdGhhdCBlbGVtZW50cyB0aGF0IGJvb3QgdXBcbiAgICAvLyB3aGlsZSB0aGUgaG9zdCBpcyBiZWluZyBjb25uZWN0ZWQgY2FuIHN0eWxlIHBhcnRzLlxuICAgIGVuc3VyZVBhcnREYXRhKGhvc3QpO1xuICAgIGNvbnN0IGNzcyA9IGNzc0ZvckVsZW1lbnREb20oZWxlbWVudCk7XG4gICAgaWYgKGNzcykge1xuICAgICAgY29uc3QgbmV3U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgbmV3U3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XG4gICAgICBlbGVtZW50LnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQobmV3U3R5bGUpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByb2R1Y2VzIGNzc1RleHQgYSBzdHlsZSBlbGVtZW50IHRvIGFwcGx5IHBhcnQgY3NzIHRvIGEgZ2l2ZW4gZWxlbWVudC5cbiAqIFRoZSBlbGVtZW50J3Mgc2hhZG93Um9vdCBkb20gaXMgc2Nhbm5lZCBmb3Igbm9kZXMgd2l0aCBhIGBwYXJ0YCBhdHRyaWJ1dGUuXG4gKiBUaGVuIHNlbGVjdG9ycyBhcmUgY3JlYXRlZCBtYXRjaGluZyB0aGUgcGFydCBhdHRyaWJ1dGUgY29udGFpbmluZyBwcm9wZXJ0aWVzXG4gKiB3aXRoIHBhcnRzIGRlZmluZWQgaW4gdGhlIGVsZW1lbnQncyBob3N0LlxuICogVGhlIGFuY2VzdG9yIHRyZWUgaXMgdHJhdmVyc2VkIGZvciBmb3J3YXJkZWQgcGFydHMgYW5kIHRoZW1lLlxuICogZS5nLlxuICogW3BhcnQ9XCJiYXJcIl0ge1xuICogICBjb2xvcjogdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO1xuICogfVxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgZm9yIHdoaWNoIHRvIGFwcGx5IHBhcnQgY3NzXG4gKi9cbmZ1bmN0aW9uIGNzc0ZvckVsZW1lbnREb20oZWxlbWVudCkge1xuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcbiAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xuICBjb25zdCBwYXJ0Tm9kZXMgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW3BhcnRdJyk7XG4gIGxldCBjc3MgPSAnJztcbiAgZm9yIChsZXQgaT0wOyBpIDwgcGFydE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYXR0ciA9IHBhcnROb2Rlc1tpXS5nZXRBdHRyaWJ1dGUoJ3BhcnQnKTtcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoYXR0cik7XG4gICAgY3NzID0gYCR7Y3NzfVxcblxcdCR7cnVsZUZvclBhcnRJbmZvKHBhcnRJbmZvLCBhdHRyLCBlbGVtZW50KX1gXG4gIH1cbiAgcmV0dXJuIGNzcztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY3NzIHJ1bGUgdGhhdCBhcHBsaWVzIGEgcGFydC5cbiAqIEBwYXJhbSB7Kn0gcGFydEluZm8gQXJyYXkgb2YgcGFydCBpbmZvIGZyb20gcGFydCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsqfSBlbGVtZW50IEVsZW1lbnQgd2l0aGluIHdoaWNoIHRoZSBwYXJ0IGV4aXN0c1xuICogQHJldHVybnMge3N0cmluZ30gVGV4dCBvZiB0aGUgY3NzIHJ1bGUgb2YgdGhlIGZvcm0gYHNlbGVjdG9yIHsgcHJvcGVydGllcyB9YFxuICovXG5mdW5jdGlvbiBydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpIHtcbiAgbGV0IHRleHQgPSAnJztcbiAgcGFydEluZm8uZm9yRWFjaChpbmZvID0+IHtcbiAgICBpZiAoIWluZm8uZm9yd2FyZCkge1xuICAgICAgY29uc3QgcHJvcHMgPSBwcm9wc0ZvclBhcnQoaW5mby5uYW1lLCBlbGVtZW50KTtcbiAgICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBidWNrZXQgaW4gcHJvcHMpIHtcbiAgICAgICAgICBsZXQgcHJvcHNCdWNrZXQgPSBwcm9wc1tidWNrZXRdO1xuICAgICAgICAgIGxldCBwYXJ0UHJvcHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGxldCBwIGluIHByb3BzQnVja2V0KSB7XG4gICAgICAgICAgICBwYXJ0UHJvcHMucHVzaChgJHtwfTogJHtwcm9wc0J1Y2tldFtwXX07YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRleHQgPSBgJHt0ZXh0fVxcbltwYXJ0PVwiJHthdHRyfVwiXSR7YnVja2V0fSB7XFxuXFx0JHtwYXJ0UHJvcHMuam9pbignXFxuXFx0Jyl9XFxufWA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGV4dDtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBwYXJ0IGF0dHJpYnV0ZSBpbnRvIGFuIGFycmF5IG9mIHBhcnQgaW5mb1xuICogQHBhcmFtIHsqfSBhdHRyIFBhcnQgYXR0cmlidXRlIHZhbHVlXG4gKiBAcmV0dXJucyB7YXJyYXl9IEFycmF5IG9mIHBhcnQgaW5mbyBvYmplY3RzIG9mIHRoZSBmb3JtIHtuYW1lLCBmb3dhcmR9XG4gKi9cbmZ1bmN0aW9uIHBhcnRJbmZvRnJvbUF0dHIoYXR0cikge1xuICBjb25zdCBwaWVjZXMgPSBhdHRyID8gYXR0ci5zcGxpdCgvXFxzKixcXHMqLykgOiBbXTtcbiAgbGV0IHBhcnRzID0gW107XG4gIHBpZWNlcy5mb3JFYWNoKHAgPT4ge1xuICAgIGNvbnN0IG0gPSBwID8gcC5tYXRjaCgvKFtePVxcc10qKSg/Olxccyo9PlxccyooLiopKT8vKSA6IFtdO1xuICAgIGlmIChtKSB7XG4gICAgICBwYXJ0cy5wdXNoKHtuYW1lOiBtWzJdIHx8IG1bMV0sIGZvcndhcmQ6IG1bMl0gPyBtWzFdIDogbnVsbH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwYXJ0cztcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiBwYXJ0IG5hbWUgcmV0dXJucyBhIHByb3BlcnRpZXMgb2JqZWN0IHdoaWNoIHNldHMgYW55IGFuY2VzdG9yXG4gKiBwcm92aWRlZCBwYXJ0IHByb3BlcnRpZXMgdG8gdGhlIHByb3BlciBhbmNlc3RvciBwcm92aWRlZCBjc3MgdmFyaWFibGUgbmFtZS5cbiAqIGUuZy5cbiAqIGNvbG9yOiBgdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO2BcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcGFydFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2l0aGluIHdoaWNoIGRvbSB3aXRoIHBhcnQgZXhpc3RzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIG9ubHkgOjp0aGVtZSBzaG91bGQgYmUgY29sbGVjdGVkLlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHByb3BlcnRpZXMgZm9yIHRoZSBnaXZlbiBwYXJ0IHNldCB0byBwYXJ0IHZhcmlhYmxlc1xuICogcHJvdmlkZWQgYnkgdGhlIGVsZW1lbnRzIGFuY2VzdG9ycy5cbiAqL1xuZnVuY3Rpb24gcHJvcHNGb3JQYXJ0KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xuICBjb25zdCBob3N0ID0gZWxlbWVudCAmJiBlbGVtZW50LmdldFJvb3ROb2RlKCkuaG9zdDtcbiAgaWYgKCFob3N0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGNvbGxlY3QgcHJvcHMgZnJvbSBob3N0IGVsZW1lbnQuXG4gIGxldCBwcm9wcyA9IHByb3BzRnJvbUVsZW1lbnQobmFtZSwgaG9zdCwgcmVxdWlyZVRoZW1lKTtcbiAgLy8gbm93IHJlY3Vyc2UgYW5jZXN0b3JzIHRvIGZpbmQgbWF0Y2hpbmcgYHRoZW1lYCBwcm9wZXJ0aWVzXG4gIGNvbnN0IHRoZW1lUHJvcHMgPSBwcm9wc0ZvclBhcnQobmFtZSwgaG9zdCwgdHJ1ZSk7XG4gIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCB0aGVtZVByb3BzKTtcbiAgLy8gbm93IHJlY3Vyc2UgYW5jZXN0b3JzIHRvIGZpbmQgKmZvcndhcmRlZCogcGFydCBwcm9wZXJ0aWVzXG4gIGlmICghcmVxdWlyZVRoZW1lKSB7XG4gICAgLy8gZm9yd2FyZGluZzogcmVjdXJzZXMgdXAgYW5jZXN0b3IgdHJlZSFcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3BhcnQnKSk7XG4gICAgLy8ge25hbWUsIGZvcndhcmR9IHdoZXJlIGAqYCBjYW4gYmUgaW5jbHVkZWRcbiAgICBwYXJ0SW5mby5mb3JFYWNoKGluZm8gPT4ge1xuICAgICAgbGV0IGNhdGNoQWxsID0gaW5mby5mb3J3YXJkICYmIChpbmZvLmZvcndhcmQuaW5kZXhPZignKicpID49IDApO1xuICAgICAgaWYgKG5hbWUgPT0gaW5mby5mb3J3YXJkIHx8IGNhdGNoQWxsKSB7XG4gICAgICAgIGNvbnN0IGFuY2VzdG9yTmFtZSA9IGNhdGNoQWxsID8gaW5mby5uYW1lLnJlcGxhY2UoJyonLCBuYW1lKSA6IGluZm8ubmFtZTtcbiAgICAgICAgY29uc3QgZm9yd2FyZGVkID0gcHJvcHNGb3JQYXJ0KGFuY2VzdG9yTmFtZSwgaG9zdCk7XG4gICAgICAgIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCBmb3J3YXJkZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHByb3BzO1xufVxuXG4vKipcbiAqIENvbGxlY3RzIGNzcyBmb3IgdGhlIGdpdmVuIG5hbWUgZnJvbSB0aGUgcGFydCBkYXRhIGZvciB0aGUgZ2l2ZW5cbiAqIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aXRoIHBhcnQgY3NzL2RhdGEuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIHNob3VsZCBvbmx5IG1hdGNoIDo6dGhlbWVcbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiBwcm9wZXJ0aWVzIGZvciB0aGUgZ2l2ZW4gcGFydCBzZXQgdG8gcGFydCB2YXJpYWJsZXNcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBwcm9wc0Zyb21FbGVtZW50KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xuICBsZXQgcHJvcHM7XG4gIGNvbnN0IHBhcnRzID0gcGFydERhdGFGb3JFbGVtZW50KGVsZW1lbnQpO1xuICBpZiAocGFydHMpIHtcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XG4gICAgaWYgKHBhcnRzKSB7XG4gICAgICBwYXJ0cy5mb3JFYWNoKChwYXJ0KSA9PiB7XG4gICAgICAgIGlmIChwYXJ0Lm5hbWUgPT0gbmFtZSAmJiAoIXJlcXVpcmVUaGVtZSB8fCBwYXJ0LmlzVGhlbWUpKSB7XG4gICAgICAgICAgcHJvcHMgPSBhZGRQYXJ0UHJvcHMocHJvcHMsIHBhcnQsIGlkLCBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9wcztcbn1cblxuLyoqXG4gKiBBZGQgcGFydCBjc3MgdG8gdGhlIHByb3BzIG9iamVjdCBmb3IgdGhlIGdpdmVuIHBhcnQvbmFtZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBPYmplY3QgY29udGFpbmluZyBwYXJ0IGNzc1xuICogQHBhcmFtIHtvYmplY3R9IHBhcnQgUGFydCBkYXRhXG4gKiBAcGFyYW0ge25tYmVyfSBpZCBlbGVtZW50IHBhcnQgaWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgcGFydFxuICovXG5mdW5jdGlvbiBhZGRQYXJ0UHJvcHMocHJvcHMsIHBhcnQsIGlkLCBuYW1lKSB7XG4gIHByb3BzID0gcHJvcHMgfHwge307XG4gIGNvbnN0IGJ1Y2tldCA9IHBhcnQuZW5kU2VsZWN0b3IgfHwgJyc7XG4gIGNvbnN0IGIgPSBwcm9wc1tidWNrZXRdID0gcHJvcHNbYnVja2V0XSB8fCB7fTtcbiAgZm9yIChsZXQgcCBpbiBwYXJ0LnByb3BzKSB7XG4gICAgYltwXSA9IGB2YXIoJHt2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwLCBwYXJ0LmVuZFNlbGVjdG9yKX0pYDtcbiAgfVxuICByZXR1cm4gcHJvcHM7XG59XG5cbmZ1bmN0aW9uIG1peFBhcnRQcm9wcyhhLCBiKSB7XG4gIGlmIChhICYmIGIpIHtcbiAgICBmb3IgKGxldCBpIGluIGIpIHtcbiAgICAgIC8vIGVuc3VyZSBzdG9yYWdlIGV4aXN0c1xuICAgICAgaWYgKCFhW2ldKSB7XG4gICAgICAgIGFbaV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5hc3NpZ24oYVtpXSwgYltpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhIHx8IGI7XG59XG5cbi8qKlxuICogQ3VzdG9tRWxlbWVudCBtaXhpbiB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIHByb3ZpZGUgOjpwYXJ0Lzo6dGhlbWUgc3VwcG9ydC5cbiAqIEBwYXJhbSB7Kn0gc3VwZXJDbGFzc1xuICovXG5leHBvcnQgbGV0IFBhcnRUaGVtZU1peGluID0gc3VwZXJDbGFzcyA9PiB7XG5cbiAgcmV0dXJuIGNsYXNzIFBhcnRUaGVtZUNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmIChzdXBlci5jb25uZWN0ZWRDYWxsYmFjaykge1xuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgfVxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX2FwcGx5UGFydFRoZW1lKCkpO1xuICAgIH1cblxuICAgIF9hcHBseVBhcnRUaGVtZSgpIHtcbiAgICAgIGFwcGx5UGFydFRoZW1lKHRoaXMpO1xuICAgIH1cblxuICB9XG5cbn07XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBpbXBvcnQgeyBNYXNrSGlnaGxpZ2h0ZXIgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbWFzay1oaWdobGlnaHRlci9tYXNrLWhpZ2hsaWdodGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodEV2ZW50c1xyXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgRGVtb3NcclxufSBmcm9tICcuL2RlbW9zLmpzJztcclxuaW1wb3J0IHtcclxuICAgIFhIb3N0LFxyXG4gICAgWFJhdGluZyxcclxuICAgIFhUaHVtYnNcclxufSBmcm9tICcuL3BhcnRUaGVtZS9jb21wb25lbnRzLXNhbXBsZS5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBDb250cm9sUHJlelxyXG59IGZyb20gJy4vY29udHJvbFByZXouanMnO1xyXG5pbXBvcnQge1xyXG4gICAgVHlwZVRleHRcclxufSBmcm9tICcuL3R5cGVkVGV4dC5qcydcclxuXHJcblxyXG5cclxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcclxuXHJcblxyXG4gICAgICAgIG5ldyBUeXBlVGV4dCgpO1xyXG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcclxuICAgICAgICAgICAgbmV3IERlbW9zKCk7XHJcbiAgICAgICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcclxuICAgICAgICAgICAgbmV3IENvbnRyb2xQcmV6KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlVGV4dCB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignY3NzLXZhci10eXBlJywgKCk9PntcclxuXHRcdFx0dHlwaW5nKCd0aXRsZS1jc3MtdmFyJywgMjAwLCAwKVxyXG5cdFx0XHQudHlwZSgnQ1NTIFZhcmlhYmxlcycpLndhaXQoMTAwMCkuc3BlZWQoMTAwKVxyXG5cdFx0XHQuZGVsZXRlKCdWYXJpYWJsZXMnKS53YWl0KDUwMCkuc3BlZWQoMTAwKVxyXG5cdFx0XHQudHlwZSgnUHJvcGVydGllcycpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59Il19
