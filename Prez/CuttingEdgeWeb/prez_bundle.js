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
                    console.log('Thingy Connect and level battery : ' + battery);
                } else {
                    console.log('Thingy Connect and level battery : ' + battery, battery);
                    new Notification("Thingy Connect ! ", {
                        body: ' Thingy Connect and level battery : ' + battery
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

            this._demoPaintApi();
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
    }, {
        key: '_demoPaintApi',
        value: function _demoPaintApi() {
            (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');

            new _applyCss.ApplyCss(document.getElementById('codemirror-paint-api-css'), '\n#render-element-paint-api{\n    --circle-color: #FFF;\n    --width-circle:100px;\n    width: var(--width-circle);\n    background-image: paint(circle);\n}\n\n            ');

            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-paint-api'), 'javascript', 'paint(ctx, geom, properties) {\n    // Change the fill color.\n    const color = properties.get(\'--circle-color\').toString();\n    ctx.fillStyle = color;\n    // Determine the center point and radius.\n    const radius = Math.min(geom.width / 2, geom.height / 2);\n    // Draw the circle \\o/\n    ctx.beginPath();\n    ctx.arc(geom.width / 2, geom.height / 2, radius, 0, 2 * Math.PI);\n    ctx.fill();\n}\n            ');
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
            lineNumbers: true,
            autoRefresh: true,
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
        lineNumbers: true,
        autoRefresh: true,
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
            // new ControlPrez();
        }

        Reveal.addEventListener('animate-houdini-workflow', function () {

            document.getElementById('houdini_workflow-1').style.display = '';
            document.getElementById('houdini_workflow-2').style.display = 'none';
            Reveal.addEventListener('fragmentshown', callBackFragment);

            function callBackFragment() {
                document.getElementById('houdini_workflow-1').style.display = 'none';
                document.getElementById('houdini_workflow-2').style.display = '';
                Reveal.removeEventListener('fragmentshown', callBackFragment);
            }
        });
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
		typing('title-css-var', 10, 0).type('CSS Variables').wait(2000).speed(50).delete('Variables').wait(500).speed(100).type('Custom Properties');
	});
};

},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NvbnRyb2xQcmV6LmpzIiwic2NyaXB0cy9kZW1vcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlKcy5qcyIsInNjcmlwdHMvaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzL2hpZ2hsaWdodEV2ZW50LmpzIiwic2NyaXB0cy9saWJzL3RoaW5neS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzIiwic2NyaXB0cy9wYXJ0VGhlbWUvbGlicy9wYXJ0LXRoZW1lLmpzIiwic2NyaXB0cy9wcmV6LmpzIiwic2NyaXB0cy90eXBlZFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7Ozs7SUFJYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7O0FBQ1YsYUFBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUVBLGVBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXhDO0FBQ0g7Ozs7OENBRXFCO0FBQ2xCLGdCQUFJO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3RCO0FBQ0g7QUFDRCxvQkFBTSxTQUFTLG1CQUFXO0FBQ3RCLGdDQUFZO0FBRFUsaUJBQVgsQ0FBZjtBQUdBLHNCQUFNLE9BQU8sT0FBUCxFQUFOO0FBQ0EscUJBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLG9CQUFNLFVBQVUsTUFBTSxPQUFPLGVBQVAsRUFBdEI7QUFDQSxvQkFBTSxhQUFhLE1BQU0sYUFBYSxpQkFBYixFQUF6QjtBQUNBLG9CQUFJLGVBQWUsUUFBbkIsRUFBNkI7QUFDekIsNEJBQVEsR0FBUix5Q0FBa0QsT0FBbEQ7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsNEJBQVEsR0FBUix5Q0FB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TSxlQUROLEVBQ3VCLElBRHZCLENBQzRCLElBRDVCLEVBQ2tDLEtBRGxDLENBQ3dDLEVBRHhDLEVBRUMsTUFGRCxDQUVRLFdBRlIsRUFFcUIsSUFGckIsQ0FFMEIsR0FGMUIsRUFFK0IsS0FGL0IsQ0FFcUMsR0FGckMsRUFHQyxJQUhELENBR00sbUJBSE47QUFJQSxFQUxEO0FBTUEsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1xuICAgIFRoaW5neVxufSBmcm9tICcuL2xpYnMvdGhpbmd5LmpzJztcblxuZXhwb3J0IGNsYXNzIENvbnRyb2xQcmV6IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50aGluZ3lDb25uZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdGhpcy50aGluZ3lDb250cm9sLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFzeW5jIHRoaW5neUNvbnRyb2woKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy50aGluZ3lDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0aGluZ3kgPSBuZXcgVGhpbmd5KHtcbiAgICAgICAgICAgICAgICBsb2dFbmFibGVkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaW5neS5jb25uZWN0KCk7XG4gICAgICAgICAgICB0aGlzLnRoaW5neUNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBiYXR0ZXJ5ID0gYXdhaXQgdGhpbmd5LmdldEJhdHRlcnlMZXZlbCgpO1xuICAgICAgICAgICAgY29uc3QgcGVybWlzc2lvbiA9IGF3YWl0IE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb24gPT09IFwiZGVuaWVkXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnl9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaGluZ3kgQ29ubmVjdCBhbmQgbGV2ZWwgYmF0dGVyeSA6ICR7YmF0dGVyeX1gLCBiYXR0ZXJ5KTtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKFwiVGhpbmd5IENvbm5lY3QgISBcIiwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBgIFRoaW5neSBDb25uZWN0IGFuZCBsZXZlbCBiYXR0ZXJ5IDogJHtiYXR0ZXJ5fWBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpbmd5LmJ1dHRvbkVuYWJsZSgoc3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGFwJywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdGUpO1xuXG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCB7XG4gICAgQXBwbHlDc3Ncbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xuaW1wb3J0IHtcbiAgICBBcHBseUNvZGVNaXJvclxufSBmcm9tICcuL2hlbHBlci9hcHBseUpzLmpzJztcblxuZXhwb3J0IGNsYXNzIERlbW9zIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXJJbkpTKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9QYXJ0VGhlbWUoKTtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhcigpIHtcbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcycpLFxuICAgICAgICAgICAgYFxuI3JlbmRlci1lbGVtZW50e1xuLS1hLXN1cGVyLXZhcjogI0ZGRjtcbn1cbiNyZW5kZXItZWxlbWVudCAudGV4dC0xe1xuXG59XG4jcmVuZGVyLWVsZW1lbnQgLnRleHQtMntcblxufVxuICAgICAgICAgICAgYFxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFySW5KUygpIHtcblxuICAgICAgICBsZXQgaW5kaWNlSCA9IC0xO1xuICAgICAgICBsZXQgc3Vic2NyaWJlID0gZmFsc2U7XG4gICAgICAgIGxldCBjbGllbnRSZWN0ID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBnaG9zdFBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vLWdob3N0LXBhcmVudCcpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NNb3VzZShldmVudCkge1xuICAgICAgICAgICAgY29uc3QgZGVsdGFYID0gKGNsaWVudFJlY3Qud2lkdGggKyBjbGllbnRSZWN0LmxlZnQpIC0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICAgIGNvbnN0IG1lZGlhbiA9IGNsaWVudFJlY3Qud2lkdGggLyAyO1xuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGRlbHRhWCA+IDAgPyAobWVkaWFuIC0gZGVsdGFYKSA6IChtZWRpYW4gKyAoLTEgKiBkZWx0YVgpKTtcbiAgICAgICAgICAgIGdob3N0UGFyZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcG9zJywgYCR7bGVmdH1weGApO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYGRlbHRhWDogJHtkZWx0YVh9IC8gbWVkaWFuIDogJHttZWRpYW59IC8gd2lkdGggOiAke3dpZHRofSAvIGxlZnQgOiAke2xlZnR9YClcbiAgICAgICAgfVxuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdnaG9zdC1zdGF0ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGluZGljZUggPSBSZXZlYWwuZ2V0SW5kaWNlcygpLmg7XG4gICAgICAgICAgICAgICAgY2xpZW50UmVjdCA9IGdob3N0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGdob3N0UGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHByb2Nlc3NNb3VzZSk7XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlICYmIGluZGljZUggIT0gZXZlbnQuaW5kZXhoKSB7XG4gICAgICAgICAgICAgICAgZ2hvc3RQYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcHJvY2Vzc01vdXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MtaW4tanMtY3NzJyksXG4gICAgICAgICAgICBgI2RlbW8tZ2hvc3QtcGFyZW50IHtcbi0tbGVmdC1wb3M6MDtcbn1cbiNkZW1vLWdob3N0LXBhcmVudCAuZGVtby1zaGFkb3csXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tZ2hvc3R7XG5sZWZ0OiB2YXIoLS1sZWZ0LXBvcyk7XG59YFxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MtaW4tanMtanMnKSxcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcbiAgICAgICAgICAgIGBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpID0+e1xuICAgIGNvbnN0IGRlbHRhWCA9IHRoaXMud2lkdGggLSBldmVudC5jbGllbnRYO1xuICAgIGNvbnN0IG1lZGlhbiA9IHRoaXMud2lkdGggLyAyO1xuICAgIGNvbnN0IGdob3N0UGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tZ2hvc3QtcGFyZW50Jyk7XG4gICAgY29uc3QgbGVmdCA9IGV2ZW50LmNsaWVudFggPiBtZWRpYW4gPyAoZXZlbnQuY2xpZW50WCAtIG1lZGlhbikgOiAtMSAqIChtZWRpYW4gLSBldmVudC5jbGllbnRYKTtcblxuICAgIGdob3N0UGFyZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcG9zJywgXFxgXFwke2xlZnR9cHhcXGApO1xufSk7XG4gICAgICAgICAgICBgKTtcbiAgICB9XG5cbiAgICBfZGVtb1BhcnRUaGVtZSgpIHtcbiAgICAgICAgbmV3IEFwcGx5Q29kZU1pcm9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhcnQtY3NzJyksXG4gICAgICAgICAgICAnY3NzJyxcbiAgICAgICAgICAgIGB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XG4gICAgcGFkZGluZzogNHB4O1xuICAgIG1pbi13aWR0aDogMjBweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG4udW5vOmhvdmVyOjpwYXJ0KHN1YmplY3QpIHtcbiAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xufVxuLmR1bzo6cGFydChzdWJqZWN0KSB7XG4gICAgYmFja2dyb3VuZDogZ29sZGVucm9kO1xufVxuLnVubzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcbiAgICBiYWNrZ3JvdW5kOiBncmVlbjtcbn1cbi51bm86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcbiAgICBiYWNrZ3JvdW5kOiB0b21hdG87XG59XG4uZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xuICAgIGJhY2tncm91bmQ6IHllbGxvdztcbn1cbi5kdW86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcbiAgICBiYWNrZ3JvdW5kOiBibGFjaztcbn1cbngtcmF0aW5nOjp0aGVtZSh0aHVtYi11cCkge1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbn1cbmApO1xuXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYXJ0LWh0bWwnKSxcbiAgICAgICAgICAgICd0ZXh0L2h0bWwnLFxuICAgICAgICAgICAgYDx4LXRodW1icz5cbiAgICAjc2hhZG93LXJvb3RcbiAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cbiAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi1kb3duXCI+8J+RjjwvZGl2PlxuPC94LXRodW1icz5cbjx4LXJhdGluZz5cbiAgICAjc2hhZG93LXJvb3RcbiAgICA8ZGl2IHBhcnQ9XCJzdWJqZWN0XCI+PHNsb3Q+PC9zbG90PjwvZGl2PlxuICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XG48L3gtcmF0aW5nPlxuXG48eC1yYXRpbmcgY2xhc3M9XCJ1bm9cIj7inaTvuI88L3gtcmF0aW5nPlxuPHgtcmF0aW5nIGNsYXNzPVwiZHVvXCI+8J+ktzwveC1yYXRpbmc+XG5gKTtcbiAgICB9XG5cbiAgICBfZGVtb1BhaW50QXBpKCkge1xuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLXdvcmtsZXQuanMnKTtcblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGktY3NzJyksXG4gICAgICAgICAgICBgXG4jcmVuZGVyLWVsZW1lbnQtcGFpbnQtYXBpe1xuICAgIC0tY2lyY2xlLWNvbG9yOiAjRkZGO1xuICAgIC0td2lkdGgtY2lyY2xlOjEwMHB4O1xuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSk7XG59XG5cbiAgICAgICAgICAgIGBcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpJyksXG4gICAgICAgICAgICAnamF2YXNjcmlwdCcsXG4gICAgICAgICAgICBgcGFpbnQoY3R4LCBnZW9tLCBwcm9wZXJ0aWVzKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSBmaWxsIGNvbG9yLlxuICAgIGNvbnN0IGNvbG9yID0gcHJvcGVydGllcy5nZXQoJy0tY2lyY2xlLWNvbG9yJykudG9TdHJpbmcoKTtcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1cy5cbiAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1pbihnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyKTtcbiAgICAvLyBEcmF3IHRoZSBjaXJjbGUgXFxcXG8vXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMiwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XG4gICAgY3R4LmZpbGwoKTtcbn1cbiAgICAgICAgICAgIGApO1xuICAgIH1cblxufSIsIid1c2Ugc3RpY3QnXG5cbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ3NvbGFyaXplZCBkYXJrJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICB0aGlzLnN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlLnN0eWxlU2hlZXQpe1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xuXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3MoY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xuICAgIH1cblxuICAgIGFwcGx5Q3NzKHZhbHVlKXtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcbiAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXG4gICAgICAgICAgICAuZm9yRWFjaChzZWxlY3RvckNzcyA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MrJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYkVsdHMrKztcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihlKTt9XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ3NvbGFyaXplZCBkYXJrJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb2RlTWlycm9ySlMuc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgfVxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnOTBweCc7XG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE1ZW0nO1xuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBrZXlFbHQsXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcbiAgICB9KSB7XG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDksXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb24gaW4gSlNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlLWluLWpzJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNjBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzUwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gOjpQYXJ0XG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BhcnQnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRlbXBsYXRlIEluc3RhbnRpYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndGVtcGxhdGUtaW5zdGFudGlhdGlvbicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEhUTUwgTW9kdWxlXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2h0bWwtbW9kdWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTAsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBhaW50IEFQSVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwYWludC1hcGknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICB9XG59IiwiLyoqICovXG5leHBvcnQgY2xhc3MgVGhpbmd5IHtcbiAgLyoqXG4gICAgICogIFRoaW5neTo1MiBXZWIgQmx1ZXRvb3RoIEFQSS4gPGJyPlxuICAgICAqICBCTEUgc2VydmljZSBkZXRhaWxzIHtAbGluayBodHRwczovL25vcmRpY3NlbWljb25kdWN0b3IuZ2l0aHViLmlvL05vcmRpYy1UaGluZ3k1Mi1GVy9kb2N1bWVudGF0aW9uL2Zpcm13YXJlX2FyY2hpdGVjdHVyZS5odG1sI2Z3X2FyY2hfYmxlX3NlcnZpY2VzIGhlcmV9XG4gICAgICpcbiAgICAgKlxuICAgICAqICBAY29uc3RydWN0b3JcbiAgICAgKiAgQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge2xvZ0VuYWJsZWQ6IGZhbHNlfV0gLSBPcHRpb25zIG9iamVjdCBmb3IgVGhpbmd5XG4gICAgICogIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5sb2dFbmFibGVkIC0gRW5hYmxlcyBsb2dnaW5nIG9mIGFsbCBCTEUgYWN0aW9ucy5cbiAgICAgKlxuICAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7bG9nRW5hYmxlZDogZmFsc2V9KSB7XG4gICAgdGhpcy5sb2dFbmFibGVkID0gb3B0aW9ucy5sb2dFbmFibGVkO1xuXG4gICAgLy8gVENTID0gVGhpbmd5IENvbmZpZ3VyYXRpb24gU2VydmljZVxuICAgIHRoaXMuVENTX1VVSUQgPSBcImVmNjgwMTAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVENTX05BTUVfVVVJRCA9IFwiZWY2ODAxMDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UQ1NfQURWX1BBUkFNU19VVUlEID0gXCJlZjY4MDEwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRDU19DT05OX1BBUkFNU19VVUlEID0gXCJlZjY4MDEwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRDU19FRERZU1RPTkVfVVVJRCA9IFwiZWY2ODAxMDUtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UQ1NfQ0xPVURfVE9LRU5fVVVJRCA9IFwiZWY2ODAxMDYtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UQ1NfRldfVkVSX1VVSUQgPSBcImVmNjgwMTA3LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVENTX01UVV9SRVFVRVNUX1VVSUQgPSBcImVmNjgwMTA4LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuXG4gICAgLy8gVEVTID0gVGhpbmd5IEVudmlyb25tZW50IFNlcnZpY2VcbiAgICB0aGlzLlRFU19VVUlEID0gXCJlZjY4MDIwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRFU19URU1QX1VVSUQgPSBcImVmNjgwMjAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVEVTX1BSRVNTVVJFX1VVSUQgPSBcImVmNjgwMjAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVEVTX0hVTUlESVRZX1VVSUQgPSBcImVmNjgwMjAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVEVTX0dBU19VVUlEID0gXCJlZjY4MDIwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRFU19DT0xPUl9VVUlEID0gXCJlZjY4MDIwNS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRFU19DT05GSUdfVVVJRCA9IFwiZWY2ODAyMDYtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG5cbiAgICAvLyBUVUlTID0gVGhpbmd5IFVzZXIgSW50ZXJmYWNlIFNlcnZpY2VcbiAgICB0aGlzLlRVSVNfVVVJRCA9IFwiZWY2ODAzMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UVUlTX0xFRF9VVUlEID0gXCJlZjY4MDMwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRVSVNfQlROX1VVSUQgPSBcImVmNjgwMzAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVFVJU19QSU5fVVVJRCA9IFwiZWY2ODAzMDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG5cbiAgICAvLyBUTVMgPSBUaGluZ3kgTW90aW9uIFNlcnZpY2VcbiAgICB0aGlzLlRNU19VVUlEID0gXCJlZjY4MDQwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19DT05GSUdfVVVJRCA9IFwiZWY2ODA0MDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfVEFQX1VVSUQgPSBcImVmNjgwNDAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX09SSUVOVEFUSU9OX1VVSUQgPSBcImVmNjgwNDAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX1FVQVRFUk5JT05fVVVJRCA9IFwiZWY2ODA0MDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfU1RFUF9VVUlEID0gXCJlZjY4MDQwNS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19SQVdfVVVJRCA9IFwiZWY2ODA0MDYtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfRVVMRVJfVVVJRCA9IFwiZWY2ODA0MDctOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfUk9UX01BVFJJWF9VVUlEID0gXCJlZjY4MDQwOC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19IRUFESU5HX1VVSUQgPSBcImVmNjgwNDA5LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX0dSQVZJVFlfVVVJRCA9IFwiZWY2ODA0MGEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG5cbiAgICAvLyBUU1MgPSBUaGluZ3kgU291bmQgU2VydmljZVxuICAgIHRoaXMuVFNTX1VVSUQgPSBcImVmNjgwNTAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVFNTX0NPTkZJR19VVUlEID0gXCJlZjY4MDUwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRTU19TUEVBS0VSX0RBVEFfVVVJRCA9IFwiZWY2ODA1MDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UU1NfU1BFQUtFUl9TVEFUX1VVSUQgPSBcImVmNjgwNTAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVFNTX01JQ19VVUlEID0gXCJlZjY4MDUwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcblxuICAgIHRoaXMuc2VydmljZVVVSURzID0gW1xuICAgICAgXCJiYXR0ZXJ5X3NlcnZpY2VcIixcbiAgICAgIHRoaXMuVENTX1VVSUQsXG4gICAgICB0aGlzLlRFU19VVUlELFxuICAgICAgdGhpcy5UVUlTX1VVSUQsXG4gICAgICB0aGlzLlRNU19VVUlELFxuICAgICAgdGhpcy5UU1NfVVVJRCxcbiAgICBdO1xuXG4gICAgdGhpcy5ibGVJc0J1c3kgPSBmYWxzZTtcbiAgICB0aGlzLmRldmljZTtcbiAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy50YXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuc3BlYWtlclN0YXR1c0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLm1pY3JvcGhvbmVFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gIH1cblxuICAvKipcbiAgICAgKiAgTWV0aG9kIHRvIHJlYWQgZGF0YSBmcm9tIGEgV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYy5cbiAgICAgKiAgSW1wbGVtZW50cyBhIHNpbXBsZSBzb2x1dGlvbiB0byBhdm9pZCBzdGFydGluZyBuZXcgR0FUVCByZXF1ZXN0cyB3aGlsZSBhbm90aGVyIGlzIHBlbmRpbmcuXG4gICAgICogIEFueSBhdHRlbXB0IHRvIHJlYWQgd2hpbGUgYW5vdGhlciBHQVRUIG9wZXJhdGlvbiBpcyBpbiBwcm9ncmVzcywgd2lsbCByZXN1bHQgaW4gYSByZWplY3RlZCBwcm9taXNlLlxuICAgICAqXG4gICAgICogIEBhc3luY1xuICAgICAqICBAcGFyYW0ge09iamVjdH0gY2hhcmFjdGVyaXN0aWMgLSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljIG9iamVjdFxuICAgICAqICBAcmV0dXJuIHtQcm9taXNlPERhdGFWaWV3Pn0gUmV0dXJucyBVaW50OEFycmF5IHdoZW4gcmVzb2x2ZWQgb3IgYW4gZXJyb3Igd2hlbiByZWplY3RlZFxuICAgICAqXG4gICAgICogIEBwcml2YXRlXG5cbiAgICAqL1xuICBhc3luYyBfcmVhZERhdGEoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICBpZiAoIXRoaXMuYmxlSXNCdXN5KSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IHRydWU7XG4gICAgICAgIGNvbnN0IGRhdGFBcnJheSA9IGF3YWl0IGNoYXJhY3RlcmlzdGljLnJlYWRWYWx1ZSgpO1xuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBkYXRhQXJyYXk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJHQVRUIG9wZXJhdGlvbiBhbHJlYWR5IHBlbmRpbmdcIikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgTWV0aG9kIHRvIHdyaXRlIGRhdGEgdG8gYSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljLlxuICAgKiAgSW1wbGVtZW50cyBhIHNpbXBsZSBzb2x1dGlvbiB0byBhdm9pZCBzdGFydGluZyBuZXcgR0FUVCByZXF1ZXN0cyB3aGlsZSBhbm90aGVyIGlzIHBlbmRpbmcuXG4gICAqICBBbnkgYXR0ZW1wdCB0byBzZW5kIGRhdGEgZHVyaW5nIGFub3RoZXIgR0FUVCBvcGVyYXRpb24gd2lsbCByZXN1bHQgaW4gYSByZWplY3RlZCBwcm9taXNlLlxuICAgKiAgTm8gcmV0cmFuc21pc3Npb24gaXMgaW1wbGVtZW50ZWQgYXQgdGhpcyBsZXZlbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IGNoYXJhY3RlcmlzdGljIC0gV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYyBvYmplY3RcbiAgICogIEBwYXJhbSB7VWludDhBcnJheX0gZGF0YUFycmF5IC0gVHlwZWQgYXJyYXkgb2YgYnl0ZXMgdG8gc2VuZFxuICAgKiAgQHJldHVybiB7UHJvbWlzZX1cbiAgICpcbiAgICogIEBwcml2YXRlXG4gICAqXG4gICovXG4gIGFzeW5jIF93cml0ZURhdGEoY2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSkge1xuICAgIGlmICghdGhpcy5ibGVJc0J1c3kpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gdHJ1ZTtcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShkYXRhQXJyYXkpO1xuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiR0FUVCBvcGVyYXRpb24gYWxyZWFkeSBwZW5kaW5nXCIpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIENvbm5lY3RzIHRvIFRoaW5neS5cbiAgICogIFRoZSBmdW5jdGlvbiBzdG9yZXMgYWxsIGRpc2NvdmVyZWQgc2VydmljZXMgYW5kIGNoYXJhY3RlcmlzdGljcyB0byB0aGUgVGhpbmd5IG9iamVjdC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYW4gZW1wdHkgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgY29ubmVjdCgpIHtcbiAgICB0cnkge1xuICAgICAgLy8gU2NhbiBmb3IgVGhpbmd5c1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgU2Nhbm5pbmcgZm9yIGRldmljZXMgd2l0aCBzZXJ2aWNlIFVVSUQgZXF1YWwgdG8gJHt0aGlzLlRDU19VVUlEfWApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRldmljZSA9IGF3YWl0IG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZSh7XG4gICAgICAgIGZpbHRlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzZXJ2aWNlczogW3RoaXMuVENTX1VVSURdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG9wdGlvbmFsU2VydmljZXM6IHRoaXMuc2VydmljZVVVSURzLFxuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBGb3VuZCBUaGluZ3kgbmFtZWQgXCIke3RoaXMuZGV2aWNlLm5hbWV9XCIsIHRyeWluZyB0byBjb25uZWN0YCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbm5lY3QgdG8gR0FUVCBzZXJ2ZXJcbiAgICAgIGNvbnN0IHNlcnZlciA9IGF3YWl0IHRoaXMuZGV2aWNlLmdhdHQuY29ubmVjdCgpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgQ29ubmVjdGVkIHRvIFwiJHt0aGlzLmRldmljZS5uYW1lfVwiYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEJhdHRlcnkgc2VydmljZVxuICAgICAgY29uc3QgYmF0dGVyeVNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UoXCJiYXR0ZXJ5X3NlcnZpY2VcIik7XG4gICAgICB0aGlzLmJhdHRlcnlDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IGJhdHRlcnlTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKFwiYmF0dGVyeV9sZXZlbFwiKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIGJhdHRlcnkgc2VydmljZSBhbmQgYmF0dGVyeSBsZXZlbCBjaGFyYWN0ZXJpc3RpY1wiKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpbmd5IGNvbmZpZ3VyYXRpb24gc2VydmljZVxuICAgICAgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRDU19VVUlEKTtcbiAgICAgIHRoaXMubmFtZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19OQU1FX1VVSUQpO1xuICAgICAgdGhpcy5hZHZQYXJhbXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfQURWX1BBUkFNU19VVUlEKTtcbiAgICAgIHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19DTE9VRF9UT0tFTl9VVUlEKTtcbiAgICAgIHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19DT05OX1BBUkFNU19VVUlEKTtcbiAgICAgIHRoaXMuZWRkeXN0b25lQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0VERFlTVE9ORV9VVUlEKTtcbiAgICAgIHRoaXMuZmlybXdhcmVWZXJzaW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0ZXX1ZFUl9VVUlEKTtcbiAgICAgIHRoaXMubXR1UmVxdWVzdENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19NVFVfUkVRVUVTVF9VVUlEKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBjb25maWd1cmF0aW9uIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaW5neSBlbnZpcm9ubWVudCBzZXJ2aWNlXG4gICAgICB0aGlzLmVudmlyb25tZW50U2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRFU19VVUlEKTtcbiAgICAgIHRoaXMudGVtcGVyYXR1cmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX1RFTVBfVVVJRCk7XG4gICAgICB0aGlzLmNvbG9yQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19DT0xPUl9VVUlEKTtcbiAgICAgIHRoaXMuZ2FzQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19HQVNfVVVJRCk7XG4gICAgICB0aGlzLmh1bWlkaXR5Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19IVU1JRElUWV9VVUlEKTtcbiAgICAgIHRoaXMucHJlc3N1cmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX1BSRVNTVVJFX1VVSUQpO1xuICAgICAgdGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfQ09ORklHX1VVSUQpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IGVudmlyb25tZW50IHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaW5neSB1c2VyIGludGVyZmFjZSBzZXJ2aWNlXG4gICAgICB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVFVJU19VVUlEKTtcbiAgICAgIHRoaXMuYnV0dG9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFVJU19CVE5fVVVJRCk7XG4gICAgICB0aGlzLmxlZENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfTEVEX1VVSUQpO1xuICAgICAgdGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfUElOX1VVSUQpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IHVzZXIgaW50ZXJmYWNlIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaW5neSBtb3Rpb24gc2VydmljZVxuICAgICAgdGhpcy5tb3Rpb25TZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVE1TX1VVSUQpO1xuICAgICAgdGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19DT05GSUdfVVVJRCk7XG4gICAgICB0aGlzLmV1bGVyQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfRVVMRVJfVVVJRCk7XG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19HUkFWSVRZX1VVSUQpO1xuICAgICAgdGhpcy5oZWFkaW5nQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfSEVBRElOR19VVUlEKTtcbiAgICAgIHRoaXMub3JpZW50YXRpb25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19PUklFTlRBVElPTl9VVUlEKTtcbiAgICAgIHRoaXMucXVhdGVybmlvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1FVQVRFUk5JT05fVVVJRCk7XG4gICAgICB0aGlzLm1vdGlvblJhd0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1JBV19VVUlEKTtcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19ST1RfTUFUUklYX1VVSUQpO1xuICAgICAgdGhpcy5zdGVwQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfU1RFUF9VVUlEKTtcbiAgICAgIHRoaXMudGFwQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfVEFQX1VVSUQpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IG1vdGlvbiBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGluZ3kgc291bmQgc2VydmljZVxuICAgICAgdGhpcy5zb3VuZFNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UU1NfVVVJRCk7XG4gICAgICB0aGlzLnRzc0NvbmZpZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfQ09ORklHX1VVSUQpO1xuICAgICAgdGhpcy5taWNyb3Bob25lQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19NSUNfVVVJRCk7XG4gICAgICB0aGlzLnNwZWFrZXJEYXRhQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19TUEVBS0VSX0RBVEFfVVVJRCk7XG4gICAgICB0aGlzLnNwZWFrZXJTdGF0dXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX1NQRUFLRVJfU1RBVF9VVUlEKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBzb3VuZCBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBNZXRob2QgdG8gZGlzY29ubmVjdCBmcm9tIFRoaW5neS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYW4gZW1wdHkgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICovXG4gIGFzeW5jIGRpc2Nvbm5lY3QoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLmdhdHQuZGlzY29ubmVjdCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGVuYWJsZSBhbmQgZGlzYWJsZSBub3RpZmljYXRpb25zIGZvciBhIGNoYXJhY3RlcmlzdGljXG4gIGFzeW5jIF9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCBub3RpZnlIYW5kbGVyKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMuc3RhcnROb3RpZmljYXRpb25zKCk7XG4gICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdGlmaWNhdGlvbnMgZW5hYmxlZCBmb3IgXCIgKyBjaGFyYWN0ZXJpc3RpYy51dWlkKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5hZGRFdmVudExpc3RlbmVyKFwiY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWRcIiwgbm90aWZ5SGFuZGxlcik7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLnN0b3BOb3RpZmljYXRpb25zKCk7XG4gICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdGlmaWNhdGlvbnMgZGlzYWJsZWQgZm9yIFwiLCBjaGFyYWN0ZXJpc3RpYy51dWlkKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWRcIiwgbm90aWZ5SGFuZGxlcik7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyogIENvbmZpZ3VyYXRpb24gc2VydmljZSAgKi9cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBuYW1lIG9mIHRoZSBUaGluZ3kgZGV2aWNlLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPHN0cmluZ3xFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgbmFtZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldE5hbWUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLm5hbWVDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIik7XG4gICAgICBjb25zdCBuYW1lID0gZGVjb2Rlci5kZWNvZGUoZGF0YSk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgZGV2aWNlIG5hbWU6IFwiICsgbmFtZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgbmFtZSBvZiB0aGUgVGhpbmd5IGRldmljZS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSB0aGF0IHdpbGwgYmUgZ2l2ZW4gdG8gdGhlIFRoaW5neS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldE5hbWUobmFtZSkge1xuICAgIGlmIChuYW1lLmxlbmd0aCA+IDEwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBuYW1lIGNhbid0IGJlIG1vcmUgdGhhbiAxMCBjaGFyYWN0ZXJzIGxvbmcuXCIpKTtcbiAgICB9XG4gICAgY29uc3QgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkobmFtZS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgYnl0ZUFycmF5W2ldID0gbmFtZS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMubmFtZUNoYXJhY3RlcmlzdGljLCBieXRlQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGFkdmVydGlzaW5nIHBhcmFtZXRlcnNcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBhZHZlcnRpc2luZyBwYXJhbWV0ZXJzIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKi9cbiAgYXN5bmMgZ2V0QWR2UGFyYW1zKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmFkdlBhcmFtc0NoYXJhY3RlcmlzdGljKTtcblxuICAgICAgLy8gSW50ZXJ2YWwgaXMgZ2l2ZW4gaW4gdW5pdHMgb2YgMC42MjUgbWlsbGlzZWNvbmRzXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgY29uc3QgaW50ZXJ2YWwgPSAocmVjZWl2ZWREYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pICogMC42MjUpLnRvRml4ZWQoMCk7XG4gICAgICBjb25zdCB0aW1lb3V0ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDIpO1xuICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBpbnRlcnZhbDoge1xuICAgICAgICAgIGludGVydmFsOiBpbnRlcnZhbCxcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVvdXQ6IHtcbiAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgIHVuaXQ6IFwic1wiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGFkdmVydGlzaW5nIHBhcmFtZXRlcnNcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIE9iamVjdCB3aXRoIGtleS92YWx1ZSBwYWlycyAnaW50ZXJ2YWwnIGFuZCAndGltZW91dCc6IDxjb2RlPntpbnRlcnZhbDogc29tZUludGVydmFsLCB0aW1lb3V0OiBzb21lVGltZW91dH08L2NvZGU+LlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5pbnRlcnZhbCAtIFRoZSBhZHZlcnRpc2luZyBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMgaW4gdGhlIHJhbmdlIG9mIDIwIG1zIHRvIDUgMDAwIG1zLlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy50aW1lb3V0IC0gVGhlIGFkdmVydGlzaW5nIHRpbWVvdXQgaW4gc2Vjb25kcyBpbiB0aGUgcmFuZ2UgMSBzIHRvIDE4MCBzLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0QWR2UGFyYW1zKHBhcmFtcykge1xuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiIHx8IHBhcmFtcy5pbnRlcnZhbCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy50aW1lb3V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0IHdpdGgga2V5L3ZhbHVlIHBhaXJzIGludGVydmFsJyBhbmQgJ3RpbWVvdXQnOiB7aW50ZXJ2YWw6IHNvbWVJbnRlcnZhbCwgdGltZW91dDogc29tZVRpbWVvdXR9XCIpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIEludGVydmFsIGlzIGluIHVuaXRzIG9mIDAuNjI1IG1zLlxuICAgIGNvbnN0IGludGVydmFsID0gcGFyYW1zLmludGVydmFsICogMS42O1xuICAgIGNvbnN0IHRpbWVvdXQgPSBwYXJhbXMudGltZW91dDtcblxuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcbiAgICBpZiAoaW50ZXJ2YWwgPCAzMiB8fCBpbnRlcnZhbCA+IDgwMDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBhZHZlcnRpc2luZyBpbnRlcnZhbCBtdXN0IGJlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgMjAgbXMgdG8gNSAwMDAgbXNcIikpO1xuICAgIH1cbiAgICBpZiAodGltZW91dCA8IDAgfHwgdGltZW91dCA+IDE4MCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGFkdmVydGlzaW5nIHRpbWVvdXQgbXVzdCBiZSB3aXRoaW4gdGhlIHJhbmdlIG9mIDAgdG8gMTgwIHNcIikpO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDMpO1xuICAgIGRhdGFBcnJheVswXSA9IGludGVydmFsICYgMHhmZjtcbiAgICBkYXRhQXJyYXlbMV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuICAgIGRhdGFBcnJheVsyXSA9IHRpbWVvdXQ7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgY29ubmVjdGlvbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGNvbm5lY3Rpb24gcGFyYW1ldGVycyB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldENvbm5QYXJhbXMoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcblxuICAgICAgLy8gQ29ubmVjdGlvbiBpbnRlcnZhbHMgYXJlIGdpdmVuIGluIHVuaXRzIG9mIDEuMjUgbXNcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgICBjb25zdCBtaW5Db25uSW50ZXJ2YWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbikgKiAxLjI1O1xuICAgICAgY29uc3QgbWF4Q29ubkludGVydmFsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pICogMS4yNTtcbiAgICAgIGNvbnN0IHNsYXZlTGF0ZW5jeSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcblxuICAgICAgLy8gU3VwZXJ2aXNpb24gdGltZW91dCBpcyBnaXZlbiBpIHVuaXRzIG9mIDEwIG1zXG4gICAgICBjb25zdCBzdXBlcnZpc2lvblRpbWVvdXQgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbikgKiAxMDtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgY29ubmVjdGlvbkludGVydmFsOiB7XG4gICAgICAgICAgbWluOiBtaW5Db25uSW50ZXJ2YWwsXG4gICAgICAgICAgbWF4OiBtYXhDb25uSW50ZXJ2YWwsXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxuICAgICAgICB9LFxuICAgICAgICBzbGF2ZUxhdGVuY3k6IHtcbiAgICAgICAgICB2YWx1ZTogc2xhdmVMYXRlbmN5LFxuICAgICAgICAgIHVuaXQ6IFwibnVtYmVyIG9mIGNvbm5lY3Rpb24gaW50ZXJ2YWxzXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHN1cGVydmlzaW9uVGltZW91dDoge1xuICAgICAgICAgIHRpbWVvdXQ6IHN1cGVydmlzaW9uVGltZW91dCxcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgY29ubmVjdGlvbiBpbnRlcnZhbFxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gQ29ubmVjdGlvbiBpbnRlcnZhbCBvYmplY3Q6IDxjb2RlPnttaW5JbnRlcnZhbDogc29tZVZhbHVlLCBtYXhJbnRlcnZhbDogc29tZVZhbHVlfTwvY29kZT5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWluSW50ZXJ2YWwgLSBUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSA+PSA3LjUgbXMuXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm1heEludGVydmFsIC0gVGhlIG1heGltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgPD0gNCAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRDb25uSW50ZXJ2YWwocGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLm1pbkludGVydmFsID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLm1heEludGVydmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIGFyZ3VtZW50IGhhcyB0byBiZSBhbiBvYmplY3Q6IHttaW5JbnRlcnZhbDogdmFsdWUsIG1heEludGVydmFsOiB2YWx1ZX1cIikpO1xuICAgIH1cblxuICAgIGxldCBtaW5JbnRlcnZhbCA9IHBhcmFtcy5taW5JbnRlcnZhbDtcbiAgICBsZXQgbWF4SW50ZXJ2YWwgPSBwYXJhbXMubWF4SW50ZXJ2YWw7XG5cbiAgICBpZiAobWluSW50ZXJ2YWwgPT09IG51bGwgfHwgbWF4SW50ZXJ2YWwgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiQm90aCBtaW5pbXVtIGFuZCBtYXhpbXVtIGFjY2VwdGFibGUgaW50ZXJ2YWwgbXVzdCBiZSBwYXNzZWQgYXMgYXJndW1lbnRzXCIpKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXG4gICAgaWYgKG1pbkludGVydmFsIDwgNy41IHx8IG1pbkludGVydmFsID4gbWF4SW50ZXJ2YWwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgbmV3IFJhbmdlRXJyb3IoXCJUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIG11c3QgYmUgZ3JlYXRlciB0aGFuIDcuNSBtcyBhbmQgPD0gbWF4aW11bSBpbnRlcnZhbFwiKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKG1heEludGVydmFsID4gNDAwMCB8fCBtYXhJbnRlcnZhbCA8IG1pbkludGVydmFsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIG1pbmltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBtdXN0IGJlIGxlc3MgdGhhbiA0IDAwMCBtcyBhbmQgPj0gbWluaW11bSBpbnRlcnZhbFwiKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOCk7XG5cbiAgICAgIC8vIEludGVydmFsIGlzIGluIHVuaXRzIG9mIDEuMjUgbXMuXG4gICAgICBtaW5JbnRlcnZhbCA9IE1hdGgucm91bmQobWluSW50ZXJ2YWwgKiAwLjgpO1xuICAgICAgbWF4SW50ZXJ2YWwgPSBNYXRoLnJvdW5kKG1heEludGVydmFsICogMC44KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbMF0gPSBtaW5JbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbMV0gPSAobWluSW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzJdID0gbWF4SW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzNdID0gKG1heEludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkVycm9yIHdoZW4gdXBkYXRpbmcgY29ubmVjdGlvbiBpbnRlcnZhbDogXCIgKyBlcnJvcikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgY29ubmVjdGlvbiBzbGF2ZSBsYXRlbmN5XG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBzbGF2ZUxhdGVuY3kgLSBUaGUgZGVzaXJlZCBzbGF2ZSBsYXRlbmN5IGluIHRoZSByYW5nZSBmcm9tIDAgdG8gNDk5IGNvbm5lY3Rpb24gaW50ZXJ2YWxzLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldENvbm5TbGF2ZUxhdGVuY3koc2xhdmVMYXRlbmN5KSB7XG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xuICAgIGlmIChzbGF2ZUxhdGVuY3kgPCAwIHx8IHNsYXZlTGF0ZW5jeSA+IDQ5OSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgUmFuZ2VFcnJvcihcIlRoZSBzbGF2ZSBsYXRlbmN5IG11c3QgYmUgaW4gdGhlIHJhbmdlIGZyb20gMCB0byA0OTkgY29ubmVjdGlvbiBpbnRlcnZhbHMuXCIpXG4gICAgICApO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg4KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbNF0gPSBzbGF2ZUxhdGVuY3kgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzVdID0gKHNsYXZlTGF0ZW5jeSA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHVwZGF0aW5nIHNsYXZlIGxhdGVuY3k6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgY29ubmVjdGlvbiBzdXBlcnZpc2lvbiB0aW1lb3V0XG4gICAqICA8Yj5Ob3RlOjwvYj4gQWNjb3JkaW5nIHRvIHRoZSBCbHVldG9vdGggTG93IEVuZXJneSBzcGVjaWZpY2F0aW9uLCB0aGUgc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgbXVzdCBiZSBncmVhdGVyXG4gICAqICB0aGFuICgxICsgc2xhdmVMYXRlbmN5KSAqIG1heENvbm5JbnRlcnZhbCAqIDIsIHdoZXJlIG1heENvbm5JbnRlcnZhbCBpcyBhbHNvIGdpdmVuIGluIG1pbGxpc2Vjb25kcy5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgLSBUaGUgZGVzaXJlZCBjb25uZWN0aW9uIHN1cGVydmlzaW9uIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIGFuZCBpbiB0aGUgcmFuZ2Ugb2YgMTAwIG1zIHRvIDMyIDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldENvbm5UaW1lb3V0KHRpbWVvdXQpIHtcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXG4gICAgaWYgKHRpbWVvdXQgPCAxMDAgfHwgdGltZW91dCA+IDMyMDAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgc3VwZXJ2aXNpb24gdGltZW91dCBtdXN0IGJlIGluIHRoZSByYW5nZSBmcm9tIDEwMCBtcyB0byAzMiAwMDAgbXMuXCIpKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgaGFzIHRvIGJlIHNldCBpbiB1bml0cyBvZiAxMCBtc1xuICAgICAgdGltZW91dCA9IE1hdGgucm91bmQodGltZW91dCAvIDEwKTtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHRpbWVvdXQgb2JleXMgIGNvbm5fc3VwX3RpbWVvdXQgKiA0ID4gKDEgKyBzbGF2ZV9sYXRlbmN5KSAqIG1heF9jb25uX2ludGVydmFsXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgY29uc3QgbWF4Q29ubkludGVydmFsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3Qgc2xhdmVMYXRlbmN5ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xuXG4gICAgICBpZiAodGltZW91dCAqIDQgPCAoMSArIHNsYXZlTGF0ZW5jeSkgKiBtYXhDb25uSW50ZXJ2YWwpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAoMSArIHNsYXZlTGF0ZW5jeSkgKiBtYXhDb25uSW50ZXJ2YWwgKiAyLCB3aGVyZSBtYXhDb25uSW50ZXJ2YWwgaXMgYWxzbyBnaXZlbiBpbiBtaWxsaXNlY29uZHMuXCIpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs2XSA9IHRpbWVvdXQgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzddID0gKHRpbWVvdXQgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiB1cGRhdGluZyB0aGUgc3VwZXJ2aXNpb24gdGltZW91dDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjb25maWd1cmVkIEVkZHlzdG9uZSBVUkxcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxVUkx8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIFVSTCB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldEVkZHlzdG9uZVVybCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lZGR5c3RvbmVDaGFyYWN0ZXJpc3RpYyk7XG5cbiAgICAgIC8vIEFjY29yZGluZyB0byBFZGR5c3RvbmUgVVJMIGVuY29kaW5nIHNwZWNpZmljYXRpb24sIGNlcnRhaW4gZWxlbWVudHMgY2FuIGJlIGV4cGFuZGVkOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXG4gICAgICBjb25zdCBwcmVmaXhBcnJheSA9IFtcImh0dHA6Ly93d3cuXCIsIFwiaHR0cHM6Ly93d3cuXCIsIFwiaHR0cDovL1wiLCBcImh0dHBzOi8vXCJdO1xuICAgICAgY29uc3QgZXhwYW5zaW9uQ29kZXMgPSBbXG4gICAgICAgIFwiLmNvbS9cIixcbiAgICAgICAgXCIub3JnL1wiLFxuICAgICAgICBcIi5lZHUvXCIsXG4gICAgICAgIFwiLm5ldC9cIixcbiAgICAgICAgXCIuaW5mby9cIixcbiAgICAgICAgXCIuYml6L1wiLFxuICAgICAgICBcIi5nb3YvXCIsXG4gICAgICAgIFwiLmNvbVwiLFxuICAgICAgICBcIi5vcmdcIixcbiAgICAgICAgXCIuZWR1XCIsXG4gICAgICAgIFwiLm5ldFwiLFxuICAgICAgICBcIi5pbmZvXCIsXG4gICAgICAgIFwiLmJpelwiLFxuICAgICAgICBcIi5nb3ZcIixcbiAgICAgIF07XG4gICAgICBjb25zdCBwcmVmaXggPSBwcmVmaXhBcnJheVtyZWNlaXZlZERhdGEuZ2V0VWludDgoMCldO1xuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xuICAgICAgbGV0IHVybCA9IGRlY29kZXIuZGVjb2RlKHJlY2VpdmVkRGF0YSk7XG4gICAgICB1cmwgPSBwcmVmaXggKyB1cmwuc2xpY2UoMSk7XG5cbiAgICAgIGV4cGFuc2lvbkNvZGVzLmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKFN0cmluZy5mcm9tQ2hhckNvZGUoaSkpICE9PSAtMSkge1xuICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKFN0cmluZy5mcm9tQ2hhckNvZGUoaSksIGV4cGFuc2lvbkNvZGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBuZXcgVVJMKHVybCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIEVkZHlzdG9uZSBVUkxcbiAgICogIEl0J3MgcmVjb21tZWVuZGVkIHRvIHVzZSBVUkwgc2hvcnRlbmVyIHRvIHN0YXkgd2l0aGluIHRoZSBsaW1pdCBvZiAxNCBjaGFyYWN0ZXJzIGxvbmcgVVJMXG4gICAqICBVUkwgc2NoZW1lIHByZWZpeCBzdWNoIGFzIFwiaHR0cHM6Ly9cIiBhbmQgXCJodHRwczovL3d3dy5cIiBkbyBub3QgY291bnQgdG93YXJkcyB0aGF0IGxpbWl0LFxuICAgKiAgbmVpdGhlciBkb2VzIGV4cGFuc2lvbiBjb2RlcyBzdWNoIGFzIFwiLmNvbS9cIiBhbmQgXCIub3JnXCIuXG4gICAqICBGdWxsIGRldGFpbHMgaW4gdGhlIEVkZHlzdG9uZSBVUkwgc3BlY2lmaWNhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9lZGR5c3RvbmUvdHJlZS9tYXN0ZXIvZWRkeXN0b25lLXVybFxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge3N0cmluZ30gdXJsU3RyaW5nIC0gVGhlIFVSTCB0aGF0IHNob3VsZCBiZSBicm9hZGNhc3RlZC5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldEVkZHlzdG9uZVVybCh1cmxTdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgLy8gVXNlcyBVUkwgQVBJIHRvIGNoZWNrIGZvciB2YWxpZCBVUkxcbiAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwodXJsU3RyaW5nKTtcblxuICAgICAgLy8gRWRkeXN0b25lIFVSTCBzcGVjaWZpY2F0aW9uIGRlZmluZXMgY29kZXMgZm9yIFVSTCBzY2hlbWUgcHJlZml4ZXMgYW5kIGV4cGFuc2lvbiBjb2RlcyBpbiB0aGUgVVJMLlxuICAgICAgLy8gVGhlIGFycmF5IGluZGV4IGNvcnJlc3BvbmRzIHRvIHRoZSBkZWZpbmVkIGNvZGUgaW4gdGhlIHNwZWNpZmljYXRpb24uXG4gICAgICAvLyBEZXRhaWxzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZWRkeXN0b25lL3RyZWUvbWFzdGVyL2VkZHlzdG9uZS11cmxcbiAgICAgIGNvbnN0IHByZWZpeEFycmF5ID0gW1wiaHR0cDovL3d3dy5cIiwgXCJodHRwczovL3d3dy5cIiwgXCJodHRwOi8vXCIsIFwiaHR0cHM6Ly9cIl07XG4gICAgICBjb25zdCBleHBhbnNpb25Db2RlcyA9IFtcbiAgICAgICAgXCIuY29tL1wiLFxuICAgICAgICBcIi5vcmcvXCIsXG4gICAgICAgIFwiLmVkdS9cIixcbiAgICAgICAgXCIubmV0L1wiLFxuICAgICAgICBcIi5pbmZvL1wiLFxuICAgICAgICBcIi5iaXovXCIsXG4gICAgICAgIFwiLmdvdi9cIixcbiAgICAgICAgXCIuY29tXCIsXG4gICAgICAgIFwiLm9yZ1wiLFxuICAgICAgICBcIi5lZHVcIixcbiAgICAgICAgXCIubmV0XCIsXG4gICAgICAgIFwiLmluZm9cIixcbiAgICAgICAgXCIuYml6XCIsXG4gICAgICAgIFwiLmdvdlwiLFxuICAgICAgXTtcbiAgICAgIGxldCBwcmVmaXhDb2RlID0gbnVsbDtcbiAgICAgIGxldCBleHBhbnNpb25Db2RlID0gbnVsbDtcbiAgICAgIGxldCBlZGR5c3RvbmVVcmwgPSB1cmwuaHJlZjtcbiAgICAgIGxldCBsZW4gPSBlZGR5c3RvbmVVcmwubGVuZ3RoO1xuXG4gICAgICBwcmVmaXhBcnJheS5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XG4gICAgICAgIGlmICh1cmwuaHJlZi5pbmRleE9mKGVsZW1lbnQpICE9PSAtMSAmJiBwcmVmaXhDb2RlID09PSBudWxsKSB7XG4gICAgICAgICAgcHJlZml4Q29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAgICAgICAgZWRkeXN0b25lVXJsID0gZWRkeXN0b25lVXJsLnJlcGxhY2UoZWxlbWVudCwgcHJlZml4Q29kZSk7XG4gICAgICAgICAgbGVuIC09IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZXhwYW5zaW9uQ29kZXMuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xuICAgICAgICBpZiAodXJsLmhyZWYuaW5kZXhPZihlbGVtZW50KSAhPT0gLTEgJiYgZXhwYW5zaW9uQ29kZSA9PT0gbnVsbCkge1xuICAgICAgICAgIGV4cGFuc2lvbkNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgICAgICAgIGVkZHlzdG9uZVVybCA9IGVkZHlzdG9uZVVybC5yZXBsYWNlKGVsZW1lbnQsIGV4cGFuc2lvbkNvZGUpO1xuICAgICAgICAgIGxlbiAtPSBlbGVtZW50Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChsZW4gPCAxIHx8IGxlbiA+IDE0KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIFVSTCBjYW4ndCBiZSBsb25nZXIgdGhhbiAxNCBjaGFyYWN0ZXJzLCBleGNsdWRpbmcgVVJMIHNjaGVtZSBzdWNoIGFzIFxcXCJodHRwczovL1xcXCIgYW5kIFxcXCIuY29tL1xcXCIuXCIpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGVkZHlzdG9uZVVybC5sZW5ndGgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVkZHlzdG9uZVVybC5sZW5ndGg7IGkrKykge1xuICAgICAgICBieXRlQXJyYXlbaV0gPSBlZGR5c3RvbmVVcmwuY2hhckNvZGVBdChpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljLCBieXRlQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY29uZmlndXJlZCBjbG91ZCB0b2tlbi5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIGNsb3VkIHRva2VuIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0Q2xvdWRUb2tlbigpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jbG91ZFRva2VuQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xuICAgICAgY29uc3QgdG9rZW4gPSBkZWNvZGVyLmRlY29kZShyZWNlaXZlZERhdGEpO1xuXG4gICAgICByZXR1cm4gdG9rZW47XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGNsb3VkIHRva2VuLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUaGUgY2xvdWQgdG9rZW4gdG8gYmUgc3RvcmVkLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0Q2xvdWRUb2tlbih0b2tlbikge1xuICAgIGlmICh0b2tlbi5sZW5ndGggPiAyNTApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgY2xvdWQgdG9rZW4gY2FuIG5vdCBleGNlZWQgMjUwIGNoYXJhY3RlcnMuXCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKFwidXRmLThcIikuZW5jb2RlKHRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5jbG91ZFRva2VuQ2hhcmFjdGVyaXN0aWMsIGVuY29kZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IE1heGltYWwgVHJhbnNtaXNzaW9uIFVuaXQgKE1UVSlcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxudW1iZXJ8RXJyb3I+fSBSZXR1cm5zIHRoZSBNVFUgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRNdHUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubXR1UmVxdWVzdENoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgICBjb25zdCBtdHUgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDEsIGxpdHRsZUVuZGlhbik7XG5cbiAgICAgIHJldHVybiBtdHU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGN1cnJlbnQgTWF4aW1hbCBUcmFuc21pc3Npb24gVW5pdCAoTVRVKVxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge09iamVjdH0gW3BhcmFtcyA9IHtwZXJpcGhlcmFsUmVxdWVzdDogdHJ1ZX1dIC0gTVRVIHNldHRpbmdzIG9iamVjdDoge210dVNpemU6IHZhbHVlLCBwZXJpcGhlcmFsUmVxdWVzdDogdmFsdWV9LCB3aGVyZSBwZXJpcGhlcmFsUmVxdWVzdCBpcyBvcHRpb25hbC5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubXR1U2l6ZSAtIFRoZSBkZXNpcmVkIE1UVSBzaXplLlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBwYXJhbXMucGVyaXBoZXJhbFJlcXVlc3QgLSBPcHRpb25hbC4gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IGlmIHBlcmlwaGVyYWwgc2hvdWxkIHNlbmQgYW4gTVRVIGV4Y2hhbmdlIHJlcXVlc3QuIERlZmF1bHQgaXMgPGNvZGU+dHJ1ZTwvY29kZT47XG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRNdHUocGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLm10dVNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgYXJndW1lbnQgaGFzIHRvIGJlIGFuIG9iamVjdFwiKSk7XG4gICAgfVxuXG4gICAgY29uc3QgbXR1U2l6ZSA9IHBhcmFtcy5tdHVTaXplO1xuICAgIGNvbnN0IHBlcmlwaGVyYWxSZXF1ZXN0ID0gcGFyYW1zLnBlcmlwaGVyYWxSZXF1ZXN0IHx8IHRydWU7XG5cbiAgICBpZiAobXR1U2l6ZSA8IDIzIHx8IG10dVNpemUgPiAyNzYpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJNVFUgc2l6ZSBtdXN0IGJlIGluIHJhbmdlIDIzIC0gMjc2IGJ5dGVzXCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgzKTtcbiAgICBkYXRhQXJyYXlbMF0gPSBwZXJpcGhlcmFsUmVxdWVzdCA/IDEgOiAwO1xuICAgIGRhdGFBcnJheVsxXSA9IG10dVNpemUgJiAweGZmO1xuICAgIGRhdGFBcnJheVsyXSA9IChtdHVTaXplID4+IDgpICYgMHhmZjtcblxuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5tdHVSZXF1ZXN0Q2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgZmlybXdhcmUgdmVyc2lvbi5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIGZpcm13YXJlIHZlcnNpb24gb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0RmlybXdhcmVWZXJzaW9uKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmZpcm13YXJlVmVyc2lvbkNoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IG1ham9yID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDApO1xuICAgICAgY29uc3QgbWlub3IgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMSk7XG4gICAgICBjb25zdCBwYXRjaCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgyKTtcbiAgICAgIGNvbnN0IHZlcnNpb24gPSBgdiR7bWFqb3J9LiR7bWlub3J9LiR7cGF0Y2h9YDtcblxuICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvLyAgKioqKioqICAvL1xuXG4gIC8qICBFbnZpcm9ubWVudCBzZXJ2aWNlICAqL1xuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIG9mIHRoZSBUaGluZ3kgZW52aXJvbm1lbnQgbW9kdWxlLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gZW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBvYmplY3Qgd2hlbiBwcm9taXNlIHJlc29sdmVzLCBvciBhbiBlcnJvciBpZiByZWplY3RlZC5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldEVudmlyb25tZW50Q29uZmlnKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgICBjb25zdCB0ZW1wSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3QgcHJlc3N1cmVJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCBodW1pZGl0eUludGVydmFsID0gZGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IGNvbG9ySW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3QgZ2FzTW9kZSA9IGRhdGEuZ2V0VWludDgoOCk7XG4gICAgICBjb25zdCBjb2xvclNlbnNvclJlZCA9IGRhdGEuZ2V0VWludDgoOSk7XG4gICAgICBjb25zdCBjb2xvclNlbnNvckdyZWVuID0gZGF0YS5nZXRVaW50OCgxMCk7XG4gICAgICBjb25zdCBjb2xvclNlbnNvckJsdWUgPSBkYXRhLmdldFVpbnQ4KDExKTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgdGVtcEludGVydmFsOiB0ZW1wSW50ZXJ2YWwsXG4gICAgICAgIHByZXNzdXJlSW50ZXJ2YWw6IHByZXNzdXJlSW50ZXJ2YWwsXG4gICAgICAgIGh1bWlkaXR5SW50ZXJ2YWw6IGh1bWlkaXR5SW50ZXJ2YWwsXG4gICAgICAgIGNvbG9ySW50ZXJ2YWw6IGNvbG9ySW50ZXJ2YWwsXG4gICAgICAgIGdhc01vZGU6IGdhc01vZGUsXG4gICAgICAgIGNvbG9yU2Vuc29yUmVkOiBjb2xvclNlbnNvclJlZCxcbiAgICAgICAgY29sb3JTZW5zb3JHcmVlbjogY29sb3JTZW5zb3JHcmVlbixcbiAgICAgICAgY29sb3JTZW5zb3JCbHVlOiBjb2xvclNlbnNvckJsdWUsXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBnZXR0aW5nIGVudmlyb25tZW50IHNlbnNvcnMgY29uZmlndXJhdGlvbnM6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgdGVtcGVyYXR1cmUgbWVhc3VyZW1lbnQgdXBkYXRlIGludGVydmFsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUZW1wZXJhdHVyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDYwIDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldFRlbXBlcmF0dXJlSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGludGVydmFsIDwgNTAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgdGVtcGVyYXR1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVswXSA9IGludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVsxXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyB0ZW1wZXJhdHVyZSB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgcHJlc3N1cmUgbWVhc3VyZW1lbnQgdXBkYXRlIGludGVydmFsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUaGUgcHJlc3N1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDUwIG1zIHRvIDYwIDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldFByZXNzdXJlSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGludGVydmFsIDwgNTAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgcHJlc3N1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVsyXSA9IGludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVszXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBwcmVzc3VyZSB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgaHVtaWRpdHkgbWVhc3VyZW1lbnQgdXBkYXRlIGludGVydmFsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBIdW1pZGl0eSBzZW5zb3IgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNjAgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0SHVtaWRpdHlJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgaHVtaWRpdHkgc2Vuc29yIHNhbXBsaW5nIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzRdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzVdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGh1bWlkaXR5IHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBjb2xvciBzZW5zb3IgdXBkYXRlIGludGVydmFsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBDb2xvciBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAyMDAgbXMgdG8gNjAgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0Q29sb3JJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgPCAyMDAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgY29sb3Igc2Vuc29yIHNhbXBsaW5nIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDIwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzZdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzddID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGNvbG9yIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgZ2FzIHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRoZSBnYXMgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBpbiBzZWNvbmRzLiBBbGxvd2VkIHZhbHVlcyBhcmUgMSwgMTAsIGFuZCA2MCBzZWNvbmRzLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0R2FzSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IG1vZGU7XG5cbiAgICAgIGlmIChpbnRlcnZhbCA9PT0gMSkge1xuICAgICAgICBtb2RlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPT09IDEwKSB7XG4gICAgICAgIG1vZGUgPSAyO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA9PT0gNjApIHtcbiAgICAgICAgbW9kZSA9IDM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgZ2FzIHNlbnNvciBpbnRlcnZhbCBoYXMgdG8gYmUgMSwgMTAgb3IgNjAgc2Vjb25kcy5cIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs4XSA9IG1vZGU7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBnYXMgc2Vuc29yIGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIENvbmZpZ3VyZXMgY29sb3Igc2Vuc29yIExFRCBjYWxpYnJhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gcmVkIC0gVGhlIHJlZCBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cbiAgICogIEBwYXJhbSB7TnVtYmVyfSBncmVlbiAtIFRoZSBncmVlbiBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cbiAgICogIEBwYXJhbSB7TnVtYmVyfSBibHVlIC0gVGhlIGJsdWUgaW50ZW5zaXR5LCByYW5naW5nIGZyb20gMCB0byAyNTUuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBjb2xvclNlbnNvckNhbGlicmF0ZShyZWQsIGdyZWVuLCBibHVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzldID0gcmVkO1xuICAgICAgZGF0YUFycmF5WzEwXSA9IGdyZWVuO1xuICAgICAgZGF0YUFycmF5WzExXSA9IGJsdWU7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBjb2xvciBzZW5zb3IgcGFyYW1ldGVyczogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIHRlbXBlcmF0dXJlIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHRlbXBlcmF0dXJlIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIHRlbXBlcmF0dXJlRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl90ZW1wZXJhdHVyZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy50ZW1wZXJhdHVyZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF90ZW1wZXJhdHVyZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IGludGVnZXIgPSBkYXRhLmdldFVpbnQ4KDApO1xuICAgIGNvbnN0IGRlY2ltYWwgPSBkYXRhLmdldFVpbnQ4KDEpO1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gaW50ZWdlciArIGRlY2ltYWwgLyAxMDA7XG4gICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICB2YWx1ZTogdGVtcGVyYXR1cmUsXG4gICAgICAgIHVuaXQ6IFwiQ2Vsc2l1c1wiLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgcHJlc3N1cmUgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgcHJlc3N1cmUgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgcHJlc3N1cmVFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9wcmVzc3VyZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5wcmVzc3VyZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfcHJlc3N1cmVOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgIGNvbnN0IGludGVnZXIgPSBkYXRhLmdldFVpbnQzMigwLCBsaXR0bGVFbmRpYW4pO1xuICAgIGNvbnN0IGRlY2ltYWwgPSBkYXRhLmdldFVpbnQ4KDQpO1xuICAgIGNvbnN0IHByZXNzdXJlID0gaW50ZWdlciArIGRlY2ltYWwgLyAxMDA7XG4gICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgdmFsdWU6IHByZXNzdXJlLFxuICAgICAgICB1bml0OiBcImhQYVwiLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgaHVtaWRpdHkgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgaHVtaWRpdHkgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgaHVtaWRpdHlFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9odW1pZGl0eU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuaHVtaWRpdHlDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX2h1bWlkaXR5Tm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgaHVtaWRpdHkgPSBkYXRhLmdldFVpbnQ4KDApO1xuICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHZhbHVlOiBodW1pZGl0eSxcbiAgICAgICAgdW5pdDogXCIlXCIsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBnYXMgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgZ2FzIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIGdhc0VuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9nYXNOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5nYXNFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuZ2FzQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5nYXNFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cbiAgX2dhc05vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgY29uc3QgZWNvMiA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XG4gICAgY29uc3QgdHZvYyA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XG5cbiAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgZUNPMjoge1xuICAgICAgICAgIHZhbHVlOiBlY28yLFxuICAgICAgICAgIHVuaXQ6IFwicHBtXCIsXG4gICAgICAgIH0sXG4gICAgICAgIFRWT0M6IHtcbiAgICAgICAgICB2YWx1ZTogdHZvYyxcbiAgICAgICAgICB1bml0OiBcInBwYlwiLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgY29sb3Igc2Vuc29yIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGNvbG9yIHNlbnNvciBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBjb2xvckVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2NvbG9yTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmNvbG9yQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9jb2xvck5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgY29uc3QgciA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XG4gICAgY29uc3QgZyA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XG4gICAgY29uc3QgYiA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XG4gICAgY29uc3QgYyA9IGRhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbik7XG4gICAgY29uc3QgclJhdGlvID0gciAvIChyICsgZyArIGIpO1xuICAgIGNvbnN0IGdSYXRpbyA9IGcgLyAociArIGcgKyBiKTtcbiAgICBjb25zdCBiUmF0aW8gPSBiIC8gKHIgKyBnICsgYik7XG4gICAgY29uc3QgY2xlYXJBdEJsYWNrID0gMzAwO1xuICAgIGNvbnN0IGNsZWFyQXRXaGl0ZSA9IDQwMDtcbiAgICBjb25zdCBjbGVhckRpZmYgPSBjbGVhckF0V2hpdGUgLSBjbGVhckF0QmxhY2s7XG4gICAgbGV0IGNsZWFyTm9ybWFsaXplZCA9IChjIC0gY2xlYXJBdEJsYWNrKSAvIGNsZWFyRGlmZjtcblxuICAgIGlmIChjbGVhck5vcm1hbGl6ZWQgPCAwKSB7XG4gICAgICBjbGVhck5vcm1hbGl6ZWQgPSAwO1xuICAgIH1cblxuICAgIGxldCByZWQgPSByUmF0aW8gKiAyNTUuMCAqIDMgKiBjbGVhck5vcm1hbGl6ZWQ7XG5cbiAgICBpZiAocmVkID4gMjU1KSB7XG4gICAgICByZWQgPSAyNTU7XG4gICAgfVxuICAgIGxldCBncmVlbiA9IGdSYXRpbyAqIDI1NS4wICogMyAqIGNsZWFyTm9ybWFsaXplZDtcblxuICAgIGlmIChncmVlbiA+IDI1NSkge1xuICAgICAgZ3JlZW4gPSAyNTU7XG4gICAgfVxuICAgIGxldCBibHVlID0gYlJhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xuXG4gICAgaWYgKGJsdWUgPiAyNTUpIHtcbiAgICAgIGJsdWUgPSAyNTU7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgcmVkOiByZWQudG9GaXhlZCgwKSxcbiAgICAgICAgZ3JlZW46IGdyZWVuLnRvRml4ZWQoMCksXG4gICAgICAgIGJsdWU6IGJsdWUudG9GaXhlZCgwKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gICoqKioqKiAgLy9cbiAgLyogIFVzZXIgaW50ZXJmYWNlIHNlcnZpY2UgICovXG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IExFRCBzZXR0aW5ncyBmcm9tIHRoZSBUaGluZ3kgZGV2aWNlLiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHN0cnVjdHVyZSB0aGF0IGRlcGVuZHMgb24gdGhlIHNldHRpbmdzLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdD59IFJldHVybnMgYSBMRUQgc3RhdHVzIG9iamVjdC4gVGhlIGNvbnRlbnQgYW5kIHN0cnVjdHVyZSBkZXBlbmRzIG9uIHRoZSBjdXJyZW50IG1vZGUuXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRMZWRTdGF0dXMoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmxlZENoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IG1vZGUgPSBkYXRhLmdldFVpbnQ4KDApO1xuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgIGxldCBzdGF0dXM7XG5cbiAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBzdGF0dXMgPSB7TEVEc3RhdHVzOiB7bW9kZTogbW9kZX19O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgc3RhdHVzID0ge1xuICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgcjogZGF0YS5nZXRVaW50OCgxKSxcbiAgICAgICAgICBnOiBkYXRhLmdldFVpbnQ4KDIpLFxuICAgICAgICAgIGI6IGRhdGEuZ2V0VWludDgoMyksXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBzdGF0dXMgPSB7XG4gICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICBjb2xvcjogZGF0YS5nZXRVaW50OCgxKSxcbiAgICAgICAgICBpbnRlbnNpdHk6IGRhdGEuZ2V0VWludDgoMiksXG4gICAgICAgICAgZGVsYXk6IGRhdGEuZ2V0VWludDE2KDMsIGxpdHRsZUVuZGlhbiksXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBzdGF0dXMgPSB7XG4gICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICBjb2xvcjogZGF0YS5nZXRVaW50OCgxKSxcbiAgICAgICAgICBpbnRlbnNpdHk6IGRhdGEuZ2V0VWludDgoMiksXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gZ2V0dGluZyBUaGluZ3kgTEVEIHN0YXR1czogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgX2xlZFNldChkYXRhQXJyYXkpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMubGVkQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIExFRCBpbiBjb25zdGFudCBtb2RlIHdpdGggdGhlIHNwZWNpZmllZCBSR0IgY29sb3IuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBjb2xvciAtIENvbG9yIG9iamVjdCB3aXRoIFJHQiB2YWx1ZXNcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5yZWQgLSBUaGUgdmFsdWUgZm9yIHJlZCBjb2xvciBpbiBhbiBSR0IgY29sb3IuIFJhbmdlcyBmcm9tIDAgdG8gMjU1LlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGNvbG9yLmdyZWVuIC0gVGhlIHZhbHVlIGZvciBncmVlbiBjb2xvciBpbiBhbiBSR0IgY29sb3IuIFJhbmdlcyBmcm9tIDAgdG8gMjU1LlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGNvbG9yLmJsdWUgLSBUaGUgdmFsdWUgZm9yIGJsdWUgY29sb3IgaW4gYW4gUkdCIGNvbG9yLiBSYW5nZXMgZnJvbSAwIHRvIDI1NS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBsZWRDb25zdGFudChjb2xvcikge1xuICAgIGlmIChjb2xvci5yZWQgPT09IHVuZGVmaW5lZCB8fCBjb2xvci5ncmVlbiA9PT0gdW5kZWZpbmVkIHx8IGNvbG9yLmJsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgb3B0aW9ucyBvYmplY3QgZm9yIG11c3QgaGF2ZSB0aGUgcHJvcGVydGllcyAncmVkJywgJ2dyZWVuJyBhbmQgJ2JsdWUnLlwiKSk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGNvbG9yLnJlZCA8IDAgfHxcbiAgICAgIGNvbG9yLnJlZCA+IDI1NSB8fFxuICAgICAgY29sb3IuZ3JlZW4gPCAwIHx8XG4gICAgICBjb2xvci5ncmVlbiA+IDI1NSB8fFxuICAgICAgY29sb3IuYmx1ZSA8IDAgfHxcbiAgICAgIGNvbG9yLmJsdWUgPiAyNTVcbiAgICApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBSR0IgdmFsdWVzIG11c3QgYmUgaW4gdGhlIHJhbmdlIDAgLSAyNTVcIikpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbGVkU2V0KG5ldyBVaW50OEFycmF5KFsxLCBjb2xvci5yZWQsIGNvbG9yLmdyZWVuLCBjb2xvci5ibHVlXSkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gXCJicmVhdGhlXCIgbW9kZSB3aGVyZSB0aGUgTEVEIGNvbnRpbnVvdXNseSBwdWxzZXMgd2l0aCB0aGUgc3BlY2lmaWVkIGNvbG9yLCBpbnRlbnNpdHkgYW5kIGRlbGF5IGJldHdlZW4gcHVsc2VzLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT3B0aW9ucyBvYmplY3QgZm9yIExFRCBicmVhdGhlIG1vZGVcbiAgICogIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gcGFyYW1zLmNvbG9yIC0gVGhlIGNvbG9yIGNvZGUgb3IgY29sb3IgbmFtZS4gMSA9IHJlZCwgMiA9IGdyZWVuLCAzID0geWVsbG93LCA0ID0gYmx1ZSwgNSA9IHB1cnBsZSwgNiA9IGN5YW4sIDcgPSB3aGl0ZS5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuaW50ZW5zaXR5IC0gSW50ZW5zaXR5IG9mIExFRCBwdWxzZXMuIFJhbmdlIGZyb20gMCB0byAxMDAgWyVdLlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5kZWxheSAtIERlbGF5IGJldHdlZW4gcHVsc2VzIGluIG1pbGxpc2Vjb25kcy4gUmFuZ2UgZnJvbSA1MCBtcyB0byAxMCAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHJlc29sdmVkIHByb21pc2Ugb3IgYW4gZXJyb3IgaW4gYSByZWplY3RlZCBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgbGVkQnJlYXRoZShwYXJhbXMpIHtcbiAgICBjb25zdCBjb2xvcnMgPSBbXCJyZWRcIiwgXCJncmVlblwiLCBcInllbGxvd1wiLCBcImJsdWVcIiwgXCJwdXJwbGVcIiwgXCJjeWFuXCIsIFwid2hpdGVcIl07XG4gICAgY29uc3QgY29sb3JDb2RlID0gdHlwZW9mIHBhcmFtcy5jb2xvciA9PT0gXCJzdHJpbmdcIiA/IGNvbG9ycy5pbmRleE9mKHBhcmFtcy5jb2xvcikgKyAxIDogcGFyYW1zLmNvbG9yO1xuXG4gICAgaWYgKHBhcmFtcy5jb2xvciA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pbnRlbnNpdHkgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuZGVsYXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBtdXN0IGhhdmUgdGhlIHByb3BlcnRpZXMgJ2NvbG9yJywgJ2ludGVuc2l0eScgYW5kICdpbnRlbnNpdHknLlwiKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGNvbG9yQ29kZSA8IDEgfHwgY29sb3JDb2RlID4gNykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGNvbG9yIGNvZGUgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMSAtIDdcIikpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmludGVuc2l0eSA8IDAgfHwgcGFyYW1zLmludGVuc2l0eSA+IDEwMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGludGVuc2l0eSBtdXN0IGJlIGluIHRoZSByYW5nZSAwIC0gMTAwJVwiKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuZGVsYXkgPCA1MCB8fCBwYXJhbXMuZGVsYXkgPiAxMDAwMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGRlbGF5IG11c3QgYmUgaW4gdGhlIHJhbmdlIDUwIG1zIC0gMTAgMDAwIG1zXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbGVkU2V0KG5ldyBVaW50OEFycmF5KFsyLCBjb2xvckNvZGUsIHBhcmFtcy5pbnRlbnNpdHksIHBhcmFtcy5kZWxheSAmIDB4ZmYsIChwYXJhbXMuZGVsYXkgPj4gOCkgJiAweGZmXSkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gb25lLXNob3QgbW9kZS4gT25lLXNob3QgbW9kZSB3aWxsIHJlc3VsdCBpbiBvbmUgc2luZ2xlIHB1bHNlIG9mIHRoZSBMRUQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPcHRpb24gb2JqZWN0IGZvciBMRUQgaW4gb25lLXNob3QgbW9kZVxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5jb2xvciAtIFRoZSBjb2xvciBjb2RlLiAxID0gcmVkLCAyID0gZ3JlZW4sIDMgPSB5ZWxsb3csIDQgPSBibHVlLCA1ID0gcHVycGxlLCA2ID0gY3lhbiwgNyA9IHdoaXRlLlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5pbnRlbnNpdHkgLSBJbnRlbnNpdHkgb2YgTEVEIHB1bHNlcy4gUmFuZ2UgZnJvbSAwIHRvIDEwMCBbJV0uXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHJlc29sdmVkIHByb21pc2Ugb3IgYW4gZXJyb3IgaW4gYSByZWplY3RlZCBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgbGVkT25lU2hvdChwYXJhbXMpIHtcbiAgICBjb25zdCBjb2xvcnMgPSBbXCJyZWRcIiwgXCJncmVlblwiLCBcInllbGxvd1wiLCBcImJsdWVcIiwgXCJwdXJwbGVcIiwgXCJjeWFuXCIsIFwid2hpdGVcIl07XG4gICAgY29uc3QgY29sb3JDb2RlID0gdHlwZW9mIHBhcmFtcy5jb2xvciA9PT0gXCJzdHJpbmdcIiA/IGNvbG9ycy5pbmRleE9mKHBhcmFtcy5jb2xvcikgKyAxIDogcGFyYW1zLmNvbG9yO1xuXG4gICAgaWYgKGNvbG9yQ29kZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pbnRlbnNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBMRUQgb25lLXNob3QgbXVzdCBoYXZlIHRoZSBwcm9wZXJ0aWVzICdjb2xvcicgYW5kICdpbnRlbnNpdHkuXCIpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoY29sb3JDb2RlIDwgMSB8fCBjb2xvckNvZGUgPiA3KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgY29sb3IgY29kZSBtdXN0IGJlIGluIHRoZSByYW5nZSAxIC0gN1wiKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuaW50ZW5zaXR5IDwgMSB8fCBwYXJhbXMuaW50ZW5zaXR5ID4gMTAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgaW50ZW5zaXR5IG11c3QgYmUgaW4gdGhlIHJhbmdlIDAgLSAxMDBcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9sZWRTZXQobmV3IFVpbnQ4QXJyYXkoWzMsIGNvbG9yQ29kZSwgcGFyYW1zLmludGVuc2l0eV0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBidXR0b24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgYnV0dG9uIG9uIHRoZSBUaGluZ3kgaXMgcHVzaGVkIG9yIHJlbGVhc2VkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBidXR0b24gb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aXRoIGJ1dHRvbiBzdGF0ZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGJ1dHRvbkVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9idXR0b25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5idXR0b25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmJ1dHRvbkNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX2J1dHRvbk5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IHN0YXRlID0gZGF0YS5nZXRVaW50OCgwKTtcbiAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHN0YXRlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBleHRlcm5hbCBwaW4gc2V0dGluZ3MgZnJvbSB0aGUgVGhpbmd5IGRldmljZS4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBwaW4gc3RhdHVzIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gZXh0ZXJuYWwgcGluIHN0YXR1cyBvYmplY3QuXG4gICAqXG4gICAqL1xuICBhc3luYyBleHRlcm5hbFBpbnNTdGF0dXMoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgcGluU3RhdHVzID0ge1xuICAgICAgICBwaW4xOiBkYXRhLmdldFVpbnQ4KDApLFxuICAgICAgICBwaW4yOiBkYXRhLmdldFVpbnQ4KDEpLFxuICAgICAgICBwaW4zOiBkYXRhLmdldFVpbnQ4KDIpLFxuICAgICAgICBwaW40OiBkYXRhLmdldFVpbnQ4KDMpLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBwaW5TdGF0dXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHJlYWRpbmcgZnJvbSBleHRlcm5hbCBwaW4gY2hhcmFjdGVyaXN0aWM6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0IGFuIGV4dGVybmFsIHBpbiB0byBjaG9zZW4gc3RhdGUuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwaW4gLSBEZXRlcm1pbmVzIHdoaWNoIHBpbiBpcyBzZXQuIFJhbmdlIDEgLSA0LlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gU2V0cyB0aGUgdmFsdWUgb2YgdGhlIHBpbi4gMCA9IE9GRiwgMjU1ID0gT04uXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRFeHRlcm5hbFBpbihwaW4sIHZhbHVlKSB7XG4gICAgaWYgKHBpbiA8IDEgfHwgcGluID4gNCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlBpbiBudW1iZXIgbXVzdCBiZSAxIC0gNFwiKSk7XG4gICAgfVxuICAgIGlmICghKHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAyNTUpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUGluIHN0YXR1cyB2YWx1ZSBtdXN0IGJlIDAgb3IgMjU1XCIpKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBwaW5zIHRoYXQgYXJlIG5vdCBiZWluZyBzZXRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg0KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbcGluIC0gMV0gPSB2YWx1ZTtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgZXh0ZXJuYWwgcGluczogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLy8gICoqKioqKiAgLy9cbiAgLyogIE1vdGlvbiBzZXJ2aWNlICAqL1xuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBvZiB0aGUgVGhpbmd5IG1vdGlvbiBtb2R1bGUuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhIG1vdGlvbiBjb25maWd1cmF0aW9uIG9iamVjdCB3aGVuIHByb21pc2UgcmVzb2x2ZXMsIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0TW90aW9uQ29uZmlnKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgY29uc3Qgc3RlcENvdW50ZXJJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCB0ZW1wQ29tcEludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IG1hZ25ldENvbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5ID0gZGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IHdha2VPbk1vdGlvbiA9IGRhdGEuZ2V0VWludDgoOCk7XG4gICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHN0ZXBDb3VudEludGVydmFsOiBzdGVwQ291bnRlckludGVydmFsLFxuICAgICAgICB0ZW1wQ29tcEludGVydmFsOiB0ZW1wQ29tcEludGVydmFsLFxuICAgICAgICBtYWduZXRDb21wSW50ZXJ2YWw6IG1hZ25ldENvbXBJbnRlcnZhbCxcbiAgICAgICAgbW90aW9uUHJvY2Vzc2luZ0ZyZXF1ZW5jeTogbW90aW9uUHJvY2Vzc2luZ0ZyZXF1ZW5jeSxcbiAgICAgICAgd2FrZU9uTW90aW9uOiB3YWtlT25Nb3Rpb24sXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBnZXR0aW5nIFRoaW5neSBtb3Rpb24gbW9kdWxlIGNvbmZpZ3VyYXRpb246IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgc3RlcCBjb3VudGVyIGludGVydmFsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge251bWJlcn0gaW50ZXJ2YWwgLSBTdGVwIGNvdW50ZXIgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNSAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRTdGVwQ291bnRlckludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDUwMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDEwMCAtIDUwMDAgbXMuXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbMV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHN0ZXAgY291bnQgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgdGVtcGVyYXR1cmUgY29tcGVuc2F0aW9uIGludGVydmFsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNSAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRUZW1wZXJhdHVyZUNvbXBJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiA1MDAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSAxMDAgLSA1MDAwIG1zLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzJdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzNdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyB0ZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgbWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gTWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byAxIDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldE1hZ25ldENvbXBJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiAxMDAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSAxMDAgLSAxMDAwIG1zLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzRdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzVdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBtYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgbW90aW9uIHByb2Nlc3NpbmcgdW5pdCB1cGRhdGUgZnJlcXVlbmN5LlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gZnJlcXVlbmN5IC0gTW90aW9uIHByb2Nlc3NpbmcgZnJlcXVlbmN5IGluIEh6LiBUaGUgYWxsb3dlZCByYW5nZSBpcyA1IC0gMjAwIEh6LlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0TW90aW9uUHJvY2Vzc0ZyZXF1ZW5jeShmcmVxdWVuY3kpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGZyZXF1ZW5jeSA8IDEwMCB8fCBmcmVxdWVuY3kgPiAyMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDUgLSAyMDAgSHouXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbNl0gPSBmcmVxdWVuY3kgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzddID0gKGZyZXF1ZW5jeSA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgbW90aW9uIHBvcmNlc3NpbmcgdW5pdCB1cGRhdGUgZnJlcXVlbmN5OiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgd2FrZS1vbi1tb3Rpb24gZmVhdHVyZSB0byBlbmFibGVkIG9yIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIFNldCB0byBUcnVlIHRvIGVuYWJsZSBvciBGYWxzZSB0byBkaXNhYmxlIHdha2Utb24tbW90aW9uIGZlYXR1cmUuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRXYWtlT25Nb3Rpb24oZW5hYmxlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0eXBlb2YgZW5hYmxlICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGFyZ3VtZW50IG11c3QgYmUgdHJ1ZSBvciBmYWxzZS5cIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs4XSA9IGVuYWJsZSA/IDEgOiAwO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWw6XCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIHRhcCBkZXRlY3Rpb24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgdGFwIGRldGVjdGlvbiBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyB0YXBFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fdGFwTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMudGFwRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnRhcENoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX3RhcE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGRhdGEuZ2V0VWludDgoMCk7XG4gICAgY29uc3QgY291bnQgPSBkYXRhLmdldFVpbnQ4KDEpO1xuICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcbiAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgb3JpZW50YXRpb24gZGV0ZWN0aW9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIG9yaWVudGF0aW9uIGRldGVjdGlvbiBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBvcmllbnRhdGlvbkVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX29yaWVudGF0aW9uTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLm9yaWVudGF0aW9uQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9vcmllbnRhdGlvbk5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZGF0YS5nZXRVaW50OCgwKTtcbiAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIob3JpZW50YXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIHF1YXRlcm5pb24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgcXVhdGVybmlvbiBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBxdWF0ZXJuaW9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9xdWF0ZXJuaW9uTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnF1YXRlcm5pb25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfcXVhdGVybmlvbk5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gRGl2aWRlIGJ5ICgxIDw8IDMwKSBhY2NvcmRpbmcgdG8gc2Vuc29yIHNwZWNpZmljYXRpb25cbiAgICBsZXQgdyA9IGRhdGEuZ2V0SW50MzIoMCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XG4gICAgbGV0IHggPSBkYXRhLmdldEludDMyKDQsIHRydWUpIC8gKDEgPDwgMzApO1xuICAgIGxldCB5ID0gZGF0YS5nZXRJbnQzMig4LCB0cnVlKSAvICgxIDw8IDMwKTtcbiAgICBsZXQgeiA9IGRhdGEuZ2V0SW50MzIoMTIsIHRydWUpIC8gKDEgPDwgMzApO1xuICAgIGNvbnN0IG1hZ25pdHVkZSA9IE1hdGguc3FydChNYXRoLnBvdyh3LCAyKSArIE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgKyBNYXRoLnBvdyh6LCAyKSk7XG5cbiAgICBpZiAobWFnbml0dWRlICE9PSAwKSB7XG4gICAgICB3IC89IG1hZ25pdHVkZTtcbiAgICAgIHggLz0gbWFnbml0dWRlO1xuICAgICAgeSAvPSBtYWduaXR1ZGU7XG4gICAgICB6IC89IG1hZ25pdHVkZTtcbiAgICB9XG5cbiAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHc6IHcsXG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHo6IHosXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBzdGVwIGNvdW50ZXIgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgc3RlcCBjb3VudGVyIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIHN0ZXBFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3N0ZXBOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnN0ZXBFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuc3RlcENoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9zdGVwTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICBjb25zdCBjb3VudCA9IGRhdGEuZ2V0VWludDMyKDAsIGxpdHRsZUVuZGlhbik7XG4gICAgY29uc3QgdGltZSA9IGRhdGEuZ2V0VWludDMyKDQsIGxpdHRsZUVuZGlhbik7XG4gICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgIHRpbWU6IHtcbiAgICAgICAgICB2YWx1ZTogdGltZSxcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyByYXcgbW90aW9uIGRhdGEgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgcmF3IG1vdGlvbiBkYXRhIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIG1vdGlvblJhd0VuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9tb3Rpb25SYXdOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMubW90aW9uUmF3Q2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfbW90aW9uUmF3Tm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICAvLyBEaXZpZGUgYnkgMl42ID0gNjQgdG8gZ2V0IGFjY2VsZXJvbWV0ZXIgY29ycmVjdCB2YWx1ZXNcbiAgICBjb25zdCBhY2NYID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDY0O1xuICAgIGNvbnN0IGFjY1kgPSBkYXRhLmdldEludDE2KDIsIHRydWUpIC8gNjQ7XG4gICAgY29uc3QgYWNjWiA9IGRhdGEuZ2V0SW50MTYoNCwgdHJ1ZSkgLyA2NDtcblxuICAgIC8vIERpdmlkZSBieSAyXjExID0gMjA0OCB0byBnZXQgY29ycmVjdCBneXJvc2NvcGUgdmFsdWVzXG4gICAgY29uc3QgZ3lyb1ggPSBkYXRhLmdldEludDE2KDYsIHRydWUpIC8gMjA0ODtcbiAgICBjb25zdCBneXJvWSA9IGRhdGEuZ2V0SW50MTYoOCwgdHJ1ZSkgLyAyMDQ4O1xuICAgIGNvbnN0IGd5cm9aID0gZGF0YS5nZXRJbnQxNigxMCwgdHJ1ZSkgLyAyMDQ4O1xuXG4gICAgLy8gRGl2aWRlIGJ5IDJeMTIgPSA0MDk2IHRvIGdldCBjb3JyZWN0IGNvbXBhc3MgdmFsdWVzXG4gICAgY29uc3QgY29tcGFzc1ggPSBkYXRhLmdldEludDE2KDEyLCB0cnVlKSAvIDQwOTY7XG4gICAgY29uc3QgY29tcGFzc1kgPSBkYXRhLmdldEludDE2KDE0LCB0cnVlKSAvIDQwOTY7XG4gICAgY29uc3QgY29tcGFzc1ogPSBkYXRhLmdldEludDE2KDE2LCB0cnVlKSAvIDQwOTY7XG5cbiAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgYWNjZWxlcm9tZXRlcjoge1xuICAgICAgICAgIHg6IGFjY1gsXG4gICAgICAgICAgeTogYWNjWSxcbiAgICAgICAgICB6OiBhY2NaLFxuICAgICAgICAgIHVuaXQ6IFwiR1wiLFxuICAgICAgICB9LFxuICAgICAgICBneXJvc2NvcGU6IHtcbiAgICAgICAgICB4OiBneXJvWCxcbiAgICAgICAgICB5OiBneXJvWSxcbiAgICAgICAgICB6OiBneXJvWixcbiAgICAgICAgICB1bml0OiBcImRlZy9zXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBhc3M6IHtcbiAgICAgICAgICB4OiBjb21wYXNzWCxcbiAgICAgICAgICB5OiBjb21wYXNzWSxcbiAgICAgICAgICB6OiBjb21wYXNzWixcbiAgICAgICAgICB1bml0OiBcIm1pY3JvVGVzbGFcIixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIEV1bGVyIGFuZ2xlIGRhdGEgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGFuIEV1bGVyIGFuZ2xlIGRhdGEgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgZXVsZXJFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9ldWxlck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5ldWxlckNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfZXVsZXJOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIC8vIERpdmlkZSBieSB0d28gYnl0ZXMgKDE8PDE2IG9yIDJeMTYgb3IgNjU1MzYpIHRvIGdldCBjb3JyZWN0IHZhbHVlXG4gICAgY29uc3Qgcm9sbCA9IGRhdGEuZ2V0SW50MzIoMCwgdHJ1ZSkgLyA2NTUzNjtcbiAgICBjb25zdCBwaXRjaCA9IGRhdGEuZ2V0SW50MzIoNCwgdHJ1ZSkgLyA2NTUzNjtcbiAgICBjb25zdCB5YXcgPSBkYXRhLmdldEludDMyKDgsIHRydWUpIC8gNjU1MzY7XG5cbiAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICByb2xsOiByb2xsLFxuICAgICAgICBwaXRjaDogcGl0Y2gsXG4gICAgICAgIHlhdzogeWF3LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgcm90YXRpb24gbWF0cml4IG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN1bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhbiByb3RhdGlvbiBtYXRyaXggb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgcm90YXRpb25NYXRyaXhFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9yb3RhdGlvbk1hdHJpeE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWMoXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4Q2hhcmFjdGVyaXN0aWMsXG4gICAgICBlbmFibGUsXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMF1cbiAgICApO1xuICB9XG5cbiAgX3JvdGF0aW9uTWF0cml4Tm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICAvLyBEaXZpZGUgYnkgMl4yID0gNCB0byBnZXQgY29ycmVjdCB2YWx1ZXNcbiAgICBjb25zdCByMWMxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjFjMiA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIxYzMgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByMmMxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjJjMiA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIyYzMgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByM2MxID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjNjMiA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIzYzMgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcblxuICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHJvdzE6IFtyMWMxLCByMWMyLCByMWMzXSxcbiAgICAgICAgcm93MjogW3IyYzEsIHIyYzIsIHIyYzNdLFxuICAgICAgICByb3czOiBbcjNjMSwgcjNjMiwgcjNjM10sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBoZWFkaW5nIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGhlYWRpbmcgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgaGVhZGluZ0VuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5faGVhZGluZ05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5oZWFkaW5nQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX2hlYWRpbmdOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIC8vIERpdmlkZSBieSAyXjE2ID0gNjU1MzYgdG8gZ2V0IGNvcnJlY3QgaGVhZGluZyB2YWx1ZXNcbiAgICBjb25zdCBoZWFkaW5nID0gZGF0YS5nZXRJbnQzMigwLCB0cnVlKSAvIDY1NTM2O1xuXG4gICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICB2YWx1ZTogaGVhZGluZyxcbiAgICAgICAgdW5pdDogXCJkZWdyZWVzXCIsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBncmF2aXR5IHZlY3RvciBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBoZWFkaW5nIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIGdyYXZpdHlWZWN0b3JFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2dyYXZpdHlWZWN0b3JOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKFxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yQ2hhcmFjdGVyaXN0aWMsXG4gICAgICBlbmFibGUsXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1swXVxuICAgICk7XG4gIH1cblxuICBfZ3Jhdml0eVZlY3Rvck5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IHggPSBkYXRhLmdldEZsb2F0MzIoMCwgdHJ1ZSk7XG4gICAgY29uc3QgeSA9IGRhdGEuZ2V0RmxvYXQzMig0LCB0cnVlKTtcbiAgICBjb25zdCB6ID0gZGF0YS5nZXRGbG9hdDMyKDgsIHRydWUpO1xuXG4gICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICB6OiB6LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAgKioqKioqICAvL1xuXG4gIC8qICBTb3VuZCBzZXJ2aWNlICAqL1xuXG4gIG1pY3JvcGhvbmVFbmFibGUoZW5hYmxlKSB7XG4gICAgLy8gVGFibGVzIG9mIGNvbnN0YW50cyBuZWVkZWQgZm9yIHdoZW4gd2UgZGVjb2RlIHRoZSBhZHBjbS1lbmNvZGVkIGF1ZGlvIGZyb20gdGhlIFRoaW5neVxuICAgIGlmICh0aGlzLl9NSUNST1BIT05FX0lOREVYX1RBQkxFID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX01JQ1JPUEhPTkVfSU5ERVhfVEFCTEUgPSBbLTEsIC0xLCAtMSwgLTEsIDIsIDQsIDYsIDgsIC0xLCAtMSwgLTEsIC0xLCAyLCA0LCA2LCA4XTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFID0gWzcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTYsIDE3LCAxOSwgMjEsIDIzLCAyNSwgMjgsIDMxLCAzNCwgMzcsIDQxLCA0NSwgNTAsIDU1LCA2MCwgNjYsIDczLCA4MCwgODgsIDk3LCAxMDcsIDExOCwgMTMwLCAxNDMsIDE1NywgMTczLCAxOTAsIDIwOSxcbiAgICAgICAgMjMwLCAyNTMsIDI3OSwgMzA3LCAzMzcsIDM3MSwgNDA4LCA0NDksIDQ5NCwgNTQ0LCA1OTgsIDY1OCwgNzI0LCA3OTYsIDg3NiwgOTYzLCAxMDYwLCAxMTY2LCAxMjgyLCAxNDExLCAxNTUyLCAxNzA3LCAxODc4LCAyMDY2LCAyMjcyLCAyNDk5LCAyNzQ5LCAzMDI0LCAzMzI3LCAzNjYwLCA0MDI2LCA0NDI4LCA0ODcxLCA1MzU4LFxuICAgICAgICA1ODk0LCA2NDg0LCA3MTMyLCA3ODQ1LCA4NjMwLCA5NDkzLCAxMDQ0MiwgMTE0ODcsIDEyNjM1LCAxMzg5OSwgMTUyODksIDE2ODE4LCAxODUwMCwgMjAzNTAsIDIyMzg1LCAyNDYyMywgMjcwODYsIDI5Nzk0LCAzMjc2N107XG4gICAgfVxuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMubWljcm9waG9uZUV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fbWljcm9waG9uZU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIC8vIGxhZ2VyIGVuIG55IGF1ZGlvIGNvbnRleHQsIHNrYWwgYmFyZSBoYSDDqW4gYXYgZGVubmVcbiAgICAgIGlmICh0aGlzLmF1ZGlvQ3R4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgICAgICB0aGlzLmF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5taWNyb3Bob25lQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5taWNyb3Bob25lRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG4gIF9taWNyb3Bob25lTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGF1ZGlvUGFja2V0ID0gZXZlbnQudGFyZ2V0LnZhbHVlLmJ1ZmZlcjtcbiAgICBjb25zdCBhZHBjbSA9IHtcbiAgICAgIGhlYWRlcjogbmV3IERhdGFWaWV3KGF1ZGlvUGFja2V0LnNsaWNlKDAsIDMpKSxcbiAgICAgIGRhdGE6IG5ldyBEYXRhVmlldyhhdWRpb1BhY2tldC5zbGljZSgzKSksXG4gICAgfTtcbiAgICBjb25zdCBkZWNvZGVkQXVkaW8gPSB0aGlzLl9kZWNvZGVBdWRpbyhhZHBjbSk7XG4gICAgdGhpcy5fcGxheURlY29kZWRBdWRpbyhkZWNvZGVkQXVkaW8pO1xuICB9XG4gIC8qICBTb3VuZCBzZXJ2aWNlICAqL1xuICBfZGVjb2RlQXVkaW8oYWRwY20pIHtcbiAgICAvLyBBbGxvY2F0ZSBvdXRwdXQgYnVmZmVyXG4gICAgY29uc3QgYXVkaW9CdWZmZXJEYXRhTGVuZ3RoID0gYWRwY20uZGF0YS5ieXRlTGVuZ3RoO1xuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDUxMik7XG4gICAgY29uc3QgcGNtID0gbmV3IERhdGFWaWV3KGF1ZGlvQnVmZmVyKTtcbiAgICBsZXQgZGlmZjtcbiAgICBsZXQgYnVmZmVyU3RlcCA9IGZhbHNlO1xuICAgIGxldCBpbnB1dEJ1ZmZlciA9IDA7XG4gICAgbGV0IGRlbHRhID0gMDtcbiAgICBsZXQgc2lnbiA9IDA7XG4gICAgbGV0IHN0ZXA7XG5cbiAgICAvLyBUaGUgZmlyc3QgMiBieXRlcyBvZiBBRFBDTSBmcmFtZSBhcmUgdGhlIHByZWRpY3RlZCB2YWx1ZVxuICAgIGxldCB2YWx1ZVByZWRpY3RlZCA9IGFkcGNtLmhlYWRlci5nZXRJbnQxNigwLCBmYWxzZSk7XG4gICAgLy8gVGhlIDNyZCBieXRlIGlzIHRoZSBpbmRleCB2YWx1ZVxuICAgIGxldCBpbmRleCA9IGFkcGNtLmhlYWRlci5nZXRJbnQ4KDIpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgaWYgKGluZGV4ID4gODgpIHtcbiAgICAgIGluZGV4ID0gODg7XG4gICAgfVxuICAgIHN0ZXAgPSB0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRVtpbmRleF07XG4gICAgZm9yIChsZXQgX2luID0gMCwgX291dCA9IDA7IF9pbiA8IGF1ZGlvQnVmZmVyRGF0YUxlbmd0aDsgX291dCArPSAyKSB7XG4gICAgICAvKiBTdGVwIDEgLSBnZXQgdGhlIGRlbHRhIHZhbHVlICovXG4gICAgICBpZiAoYnVmZmVyU3RlcCkge1xuICAgICAgICBkZWx0YSA9IGlucHV0QnVmZmVyICYgMHgwRjtcbiAgICAgICAgX2luKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dEJ1ZmZlciA9IGFkcGNtLmRhdGEuZ2V0SW50OChfaW4pO1xuICAgICAgICBkZWx0YSA9IChpbnB1dEJ1ZmZlciA+PiA0KSAmIDB4MEY7XG4gICAgICB9XG4gICAgICBidWZmZXJTdGVwID0gIWJ1ZmZlclN0ZXA7XG4gICAgICAvKiBTdGVwIDIgLSBGaW5kIG5ldyBpbmRleCB2YWx1ZSAoZm9yIGxhdGVyKSAqL1xuICAgICAgaW5kZXggKz0gdGhpcy5fTUlDUk9QSE9ORV9JTkRFWF9UQUJMRVtkZWx0YV07XG4gICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIGluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChpbmRleCA+IDg4KSB7XG4gICAgICAgIGluZGV4ID0gODg7XG4gICAgICB9XG4gICAgICAvKiBTdGVwIDMgLSBTZXBhcmF0ZSBzaWduIGFuZCBtYWduaXR1ZGUgKi9cbiAgICAgIHNpZ24gPSBkZWx0YSAmIDg7XG4gICAgICBkZWx0YSA9IGRlbHRhICYgNztcbiAgICAgIC8qIFN0ZXAgNCAtIENvbXB1dGUgZGlmZmVyZW5jZSBhbmQgbmV3IHByZWRpY3RlZCB2YWx1ZSAqL1xuICAgICAgZGlmZiA9IChzdGVwID4+IDMpO1xuICAgICAgaWYgKChkZWx0YSAmIDQpID4gMCkge1xuICAgICAgICBkaWZmICs9IHN0ZXA7XG4gICAgICB9XG4gICAgICBpZiAoKGRlbHRhICYgMikgPiAwKSB7XG4gICAgICAgIGRpZmYgKz0gKHN0ZXAgPj4gMSk7XG4gICAgICB9XG4gICAgICBpZiAoKGRlbHRhICYgMSkgPiAwKSB7XG4gICAgICAgIGRpZmYgKz0gKHN0ZXAgPj4gMik7XG4gICAgICB9XG4gICAgICBpZiAoc2lnbiA+IDApIHtcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgLT0gZGlmZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlUHJlZGljdGVkICs9IGRpZmY7XG4gICAgICB9XG4gICAgICAvKiBTdGVwIDUgLSBjbGFtcCBvdXRwdXQgdmFsdWUgKi9cbiAgICAgIGlmICh2YWx1ZVByZWRpY3RlZCA+IDMyNzY3KSB7XG4gICAgICAgIHZhbHVlUHJlZGljdGVkID0gMzI3Njc7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlUHJlZGljdGVkIDwgLTMyNzY4KSB7XG4gICAgICAgIHZhbHVlUHJlZGljdGVkID0gLTMyNzY4O1xuICAgICAgfVxuICAgICAgLyogU3RlcCA2IC0gVXBkYXRlIHN0ZXAgdmFsdWUgKi9cbiAgICAgIHN0ZXAgPSB0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRVtpbmRleF07XG4gICAgICAvKiBTdGVwIDcgLSBPdXRwdXQgdmFsdWUgKi9cbiAgICAgIHBjbS5zZXRJbnQxNihfb3V0LCB2YWx1ZVByZWRpY3RlZCwgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiBwY207XG4gIH1cbiAgX3BsYXlEZWNvZGVkQXVkaW8oYXVkaW8pIHtcbiAgICBpZiAodGhpcy5fYXVkaW9TdGFjayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9hdWRpb1N0YWNrID0gW107XG4gICAgfVxuICAgIHRoaXMuX2F1ZGlvU3RhY2sucHVzaChhdWRpbyk7XG4gICAgaWYgKHRoaXMuX2F1ZGlvU3RhY2subGVuZ3RoKSB7XG4gICAgICB0aGlzLl9zY2hlZHVsZUF1ZGlvQnVmZmVycygpO1xuICAgIH1cbiAgfVxuICBfc2NoZWR1bGVBdWRpb0J1ZmZlcnMoKSB7XG4gICAgd2hpbGUgKHRoaXMuX2F1ZGlvU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgYnVmZmVyVGltZSA9IDAuMDE7IC8vIEJ1ZmZlciB0aW1lIGluIHNlY29uZHMgYmVmb3JlIGluaXRpYWwgYXVkaW8gY2h1bmsgaXMgcGxheWVkXG4gICAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9hdWRpb1N0YWNrLnNoaWZ0KCk7XG4gICAgICBjb25zdCBjaGFubmVscyA9IDE7XG4gICAgICBjb25zdCBmcmFtZWNvdW50ID0gYnVmZmVyLmJ5dGVMZW5ndGggLyAyO1xuICAgICAgaWYgKHRoaXMuX2F1ZGlvTmV4dFRpbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hdWRpb05leHRUaW1lID0gMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG15QXJyYXlCdWZmZXIgPSB0aGlzLmF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlcihjaGFubmVscywgZnJhbWVjb3VudCwgMTYwMDApO1xuICAgICAgLy8gVGhpcyBnaXZlcyB1cyB0aGUgYWN0dWFsIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIGRhdGFcbiAgICAgIGNvbnN0IG5vd0J1ZmZlcmluZyA9IG15QXJyYXlCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlci5ieXRlTGVuZ3RoIC8gMjsgaSsrKSB7XG4gICAgICAgIG5vd0J1ZmZlcmluZ1tpXSA9IGJ1ZmZlci5nZXRJbnQxNigyICogaSwgdHJ1ZSkgLyAzMjc2OC4wO1xuICAgICAgfVxuICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgIHNvdXJjZS5idWZmZXIgPSBteUFycmF5QnVmZmVyO1xuICAgICAgc291cmNlLmNvbm5lY3QodGhpcy5hdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gICAgICBpZiAodGhpcy5fYXVkaW9OZXh0VGltZSA9PT0gMCkge1xuICAgICAgICB0aGlzLl9hdWRpb05leHRUaW1lID0gdGhpcy5hdWRpb0N0eC5jdXJyZW50VGltZSArIGJ1ZmZlclRpbWU7XG4gICAgICB9XG4gICAgICBzb3VyY2Uuc3RhcnQodGhpcy5fYXVkaW9OZXh0VGltZSk7XG4gICAgICB0aGlzLl9hdWRpb05leHRUaW1lICs9IHNvdXJjZS5idWZmZXIuZHVyYXRpb247XG4gICAgfVxuICB9XG4gIC8vICAqKioqKiogIC8vXG5cbiAgLyogIEJhdHRlcnkgc2VydmljZSAgKi9cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBiYXR0ZXJ5IGxldmVsIG9mIFRoaW5neS5cbiAgICpcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0IHwgRXJyb3I+fSBSZXR1cm5zIGJhdHRlcnkgbGV2ZWwgaW4gcGVyY2VudGFnZSB3aGVuIHByb21pc2UgaXMgcmVzb2x2ZWQgb3IgYW4gZXJyb3IgaWYgcmVqZWN0ZWQuXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRCYXR0ZXJ5TGV2ZWwoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuYmF0dGVyeUNoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGxldmVsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDApO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogbGV2ZWwsXG4gICAgICAgIHVuaXQ6IFwiJVwiLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBiYXR0ZXJ5IGxldmVsIG5vdGlmaWNhdGlvbnMuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBiYXR0ZXJ5IGxldmVsIGNoYW5nZS4gV2lsbCByZWNlaXZlIGEgYmF0dGVyeSBsZXZlbCBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAgICovXG4gIGFzeW5jIGJhdHRlcnlMZXZlbEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9iYXR0ZXJ5TGV2ZWxOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuYmF0dGVyeUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX2JhdHRlcnlMZXZlbE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IHZhbHVlID0gZGF0YS5nZXRVaW50OCgwKTtcblxuICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHVuaXQ6IFwiJVwiLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gICoqKioqKiAgLy9cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtQYXJ0VGhlbWVNaXhpbn0gZnJvbSAnLi9saWJzL3BhcnQtdGhlbWUuanMnO1xuXG5leHBvcnQgY2xhc3MgUGFydFRoZW1lRWxlbWVudCBleHRlbmRzIFBhcnRUaGVtZU1peGluKEhUTUxFbGVtZW50KSB7XG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiBgYDtcbiAgICB9XG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBpZiAoIXRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuY29uc3RydWN0b3IudGVtcGxhdGU7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGlmICghdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSk7XG4gICAgICAgICAgY29uc3QgZG9tID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoZG9tKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuZXhwb3J0IGNsYXNzIFhUaHVtYnMgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBwYXJ0PVwidGh1bWItdXBcIj7wn5GNPC9kaXY+XG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLWRvd25cIj7wn5GOPC9kaXY+XG4gICAgICBgO1xuICAgIH1cbiAgfVxuXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC10aHVtYnMnLCBYVGh1bWJzKTtcblxuZXhwb3J0IGNsYXNzIFhSYXRpbmcgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICB9XG4gICAgICAgICAgeC10aHVtYnM6OnBhcnQodGh1bWItdXApIHtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCBncmVlbjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLWRvd24pIHtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCByZWQ7XG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgfVxuICAgICAgICA8L3N0eWxlPlxuICAgICAgICA8ZGl2IHBhcnQ9XCJzdWJqZWN0XCI+PHNsb3Q+PC9zbG90PjwvZGl2PlxuICAgICAgICA8eC10aHVtYnMgcGFydD1cIiogPT4gcmF0aW5nLSpcIj48L3gtdGh1bWJzPlxuICAgICAgYDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXJhdGluZycsIFhSYXRpbmcpO1xuXG5leHBvcnQgY2xhc3MgWEhvc3QgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgYm9yZGVyOiAycHggc29saWQgb3JhbmdlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXJhdGluZyB7XG4gICAgICAgICAgICBtYXJnaW46IDRweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgeC1yYXRpbmc6OnBhcnQoc3ViamVjdCkge1xuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXJhdGluZyB7XG4gICAgICAgICAgICAtLWUxLXBhcnQtc3ViamVjdC1wYWRkaW5nOiA0cHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIC51bm86aG92ZXI6OnBhcnQoc3ViamVjdCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogbGlnaHRncmVlbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmR1bzo6cGFydChzdWJqZWN0KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBnb2xkZW5yb2Q7XG4gICAgICAgICAgfVxuICAgICAgICAgIC51bm86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBncmVlbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLnVubzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdG9tYXRvO1xuICAgICAgICAgIH1cbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogeWVsbG93O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBibGFjaztcbiAgICAgICAgICB9XG4gICAgICAgICAgeC1yYXRpbmc6OnRoZW1lKHRodW1iLXVwKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgfVxuXG4gICAgICAgIDwvc3R5bGU+XG4gICAgICAgIDx4LXJhdGluZyBjbGFzcz1cInVub1wiPuKdpO+4jzwveC1yYXRpbmc+XG4gICAgICAgIDxicj5cbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwiZHVvXCI+8J+ktzwveC1yYXRpbmc+XG4gICAgICBgO1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtaG9zdCcsIFhIb3N0KTsiLCIvKlxuQGxpY2Vuc2VcbkNvcHlyaWdodCAoYykgMjAxNyBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5UaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG5UaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG5Db2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiovXG5cbmNvbnN0IHBhcnREYXRhS2V5ID0gJ19fY3NzUGFydHMnO1xuY29uc3QgcGFydElkS2V5ID0gJ19fcGFydElkJztcblxuLyoqXG4gKiBDb252ZXJ0cyBhbnkgc3R5bGUgZWxlbWVudHMgaW4gdGhlIHNoYWRvd1Jvb3QgdG8gcmVwbGFjZSA6OnBhcnQvOjp0aGVtZVxuICogd2l0aCBjdXN0b20gcHJvcGVydGllcyB1c2VkIHRvIHRyYW5zbWl0IHRoaXMgZGF0YSBkb3duIHRoZSBkb20gdHJlZS4gQWxzb1xuICogY2FjaGVzIHBhcnQgbWV0YWRhdGEgZm9yIGxhdGVyIGxvb2t1cC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQYXJ0cyhlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudC5zaGFkb3dSb290KSB7XG4gICAgZWxlbWVudFtwYXJ0RGF0YUtleV0gPSBudWxsO1xuICAgIHJldHVybjtcbiAgfVxuICBBcnJheS5mcm9tKGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpKS5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICBjb25zdCBpbmZvID0gcGFydENzc1RvQ3VzdG9tUHJvcENzcyhlbGVtZW50LCBzdHlsZS50ZXh0Q29udGVudCk7XG4gICAgaWYgKGluZm8ucGFydHMpIHtcbiAgICAgIGVsZW1lbnRbcGFydERhdGFLZXldID0gZWxlbWVudFtwYXJ0RGF0YUtleV0gfHwgW107XG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XS5wdXNoKC4uLmluZm8ucGFydHMpO1xuICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBpbmZvLmNzcztcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50Lmhhc093blByb3BlcnR5KCdfX2Nzc1BhcnRzJykpIHtcbiAgICBpbml0aWFsaXplUGFydHMoZWxlbWVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFydERhdGFGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgZW5zdXJlUGFydERhdGEoZWxlbWVudCk7XG4gIHJldHVybiBlbGVtZW50W3BhcnREYXRhS2V5XTtcbn1cblxuLy8gVE9ETyhzb3J2ZWxsKTogYnJpdHRsZSBkdWUgdG8gcmVnZXgtaW5nIGNzcy4gSW5zdGVhZCB1c2UgYSBjc3MgcGFyc2VyLlxuLyoqXG4gKiBUdXJucyBjc3MgdXNpbmcgYDo6cGFydGAgaW50byBjc3MgdXNpbmcgdmFyaWFibGVzIGZvciB0aG9zZSBwYXJ0cy5cbiAqIEFsc28gcmV0dXJucyBwYXJ0IG1ldGFkYXRhLlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge3N0cmluZ30gY3NzVGV4dFxuICogQHJldHVybnMge09iamVjdH0gY3NzOiBwYXJ0aWZpZWQgY3NzLCBwYXJ0czogYXJyYXkgb2YgcGFydHMgb2YgdGhlIGZvcm1cbiAqIHtuYW1lLCBzZWxlY3RvciwgcHJvcHN9XG4gKiBFeGFtcGxlIG9mIHBhcnQtaWZpZWQgY3NzLCBnaXZlbjpcbiAqIC5mb286OnBhcnQoYmFyKSB7IGNvbG9yOiByZWQgfVxuICogb3V0cHV0OlxuICogLmZvbyB7IC0tZTEtcGFydC1iYXItY29sb3I6IHJlZDsgfVxuICogd2hlcmUgYGUxYCBpcyBhIGd1aWQgZm9yIHRoaXMgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gcGFydENzc1RvQ3VzdG9tUHJvcENzcyhlbGVtZW50LCBjc3NUZXh0KSB7XG4gIGxldCBwYXJ0cztcbiAgbGV0IGNzcyA9IGNzc1RleHQucmVwbGFjZShjc3NSZSwgKG0sIHNlbGVjdG9yLCB0eXBlLCBuYW1lLCBlbmRTZWxlY3RvciwgcHJvcHNTdHIpID0+IHtcbiAgICBwYXJ0cyA9IHBhcnRzIHx8IFtdO1xuICAgIGxldCBwcm9wcyA9IHt9O1xuICAgIGNvbnN0IHByb3BzQXJyYXkgPSBwcm9wc1N0ci5zcGxpdCgvXFxzKjtcXHMqLyk7XG4gICAgcHJvcHNBcnJheS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgY29uc3QgcyA9IHByb3Auc3BsaXQoJzonKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBzLnNoaWZ0KCkudHJpbSgpO1xuICAgICAgY29uc3QgdmFsdWUgPSBzLmpvaW4oJzonKTtcbiAgICAgIHByb3BzW25hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIHBhcnRzLnB1c2goe3NlbGVjdG9yLCBlbmRTZWxlY3RvciwgbmFtZSwgcHJvcHMsIGlzVGhlbWU6IHR5cGUgPT0gdGhlbWV9KTtcbiAgICBsZXQgcGFydFByb3BzID0gJyc7XG4gICAgZm9yIChsZXQgcCBpbiBwcm9wcykge1xuICAgICAgcGFydFByb3BzID0gYCR7cGFydFByb3BzfVxcblxcdCR7dmFyRm9yUGFydChpZCwgbmFtZSwgcCwgZW5kU2VsZWN0b3IpfTogJHtwcm9wc1twXX07YDtcbiAgICB9XG4gICAgcmV0dXJuIGBcXG4ke3NlbGVjdG9yIHx8ICcqJ30ge1xcblxcdCR7cGFydFByb3BzLnRyaW0oKX1cXG59YDtcbiAgfSk7XG4gIHJldHVybiB7cGFydHMsIGNzc307XG59XG5cbi8vIGd1aWQgZm9yIGVsZW1lbnQgcGFydCBzY29wZXNcbmxldCBwYXJ0SWQgPSAwO1xuZnVuY3Rpb24gcGFydElkRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50W3BhcnRJZEtleV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgZWxlbWVudFtwYXJ0SWRLZXldID0gcGFydElkKys7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRbcGFydElkS2V5XTtcbn1cblxuY29uc3QgdGhlbWUgPSAnOjp0aGVtZSc7XG5jb25zdCBjc3NSZSA9IC9cXHMqKC4qKSg6Oig/OnBhcnR8dGhlbWUpKVxcKChbXildKylcXCkoW15cXHN7XSopXFxzKntcXHMqKFtefV0qKVxccyp9L2dcblxuLy8gY3JlYXRlcyBhIGN1c3RvbSBwcm9wZXJ0eSBuYW1lIGZvciBhIHBhcnQuXG5mdW5jdGlvbiB2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwcm9wLCBlbmRTZWxlY3Rvcikge1xuICByZXR1cm4gYC0tZSR7aWR9LXBhcnQtJHtuYW1lfS0ke3Byb3B9JHtlbmRTZWxlY3RvciA/IGAtJHtlbmRTZWxlY3Rvci5yZXBsYWNlKC9cXDovZywgJycpfWAgOiAnJ31gO1xufVxuXG4vKipcbiAqIFByb2R1Y2VzIGEgc3R5bGUgdXNpbmcgY3NzIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIHN0eWxlIDo6cGFydC86OnRoZW1lXG4gKiBmb3IgYWxsIHRoZSBkb20gaW4gdGhlIGVsZW1lbnQncyBzaGFkb3dSb290LlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhcnRUaGVtZShlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICBjb25zdCBvbGRTdHlsZSA9IGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdHlsZVtwYXJ0c10nKTtcbiAgICBpZiAob2xkU3R5bGUpIHtcbiAgICAgIG9sZFN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkU3R5bGUpO1xuICAgIH1cbiAgfVxuICBjb25zdCBob3N0ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpLmhvc3Q7XG4gIGlmIChob3N0KSB7XG4gICAgLy8gbm90ZTogZW5zdXJlIGhvc3QgaGFzIHBhcnQgZGF0YSBzbyB0aGF0IGVsZW1lbnRzIHRoYXQgYm9vdCB1cFxuICAgIC8vIHdoaWxlIHRoZSBob3N0IGlzIGJlaW5nIGNvbm5lY3RlZCBjYW4gc3R5bGUgcGFydHMuXG4gICAgZW5zdXJlUGFydERhdGEoaG9zdCk7XG4gICAgY29uc3QgY3NzID0gY3NzRm9yRWxlbWVudERvbShlbGVtZW50KTtcbiAgICBpZiAoY3NzKSB7XG4gICAgICBjb25zdCBuZXdTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBuZXdTdHlsZS50ZXh0Q29udGVudCA9IGNzcztcbiAgICAgIGVsZW1lbnQuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChuZXdTdHlsZSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJvZHVjZXMgY3NzVGV4dCBhIHN0eWxlIGVsZW1lbnQgdG8gYXBwbHkgcGFydCBjc3MgdG8gYSBnaXZlbiBlbGVtZW50LlxuICogVGhlIGVsZW1lbnQncyBzaGFkb3dSb290IGRvbSBpcyBzY2FubmVkIGZvciBub2RlcyB3aXRoIGEgYHBhcnRgIGF0dHJpYnV0ZS5cbiAqIFRoZW4gc2VsZWN0b3JzIGFyZSBjcmVhdGVkIG1hdGNoaW5nIHRoZSBwYXJ0IGF0dHJpYnV0ZSBjb250YWluaW5nIHByb3BlcnRpZXNcbiAqIHdpdGggcGFydHMgZGVmaW5lZCBpbiB0aGUgZWxlbWVudCdzIGhvc3QuXG4gKiBUaGUgYW5jZXN0b3IgdHJlZSBpcyB0cmF2ZXJzZWQgZm9yIGZvcndhcmRlZCBwYXJ0cyBhbmQgdGhlbWUuXG4gKiBlLmcuXG4gKiBbcGFydD1cImJhclwiXSB7XG4gKiAgIGNvbG9yOiB2YXIoLS1lMS1wYXJ0LWJhci1jb2xvcik7XG4gKiB9XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCBmb3Igd2hpY2ggdG8gYXBwbHkgcGFydCBjc3NcbiAqL1xuZnVuY3Rpb24gY3NzRm9yRWxlbWVudERvbShlbGVtZW50KSB7XG4gIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpO1xuICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XG4gIGNvbnN0IHBhcnROb2RlcyA9IGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbcGFydF0nKTtcbiAgbGV0IGNzcyA9ICcnO1xuICBmb3IgKGxldCBpPTA7IGkgPCBwYXJ0Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBhdHRyID0gcGFydE5vZGVzW2ldLmdldEF0dHJpYnV0ZSgncGFydCcpO1xuICAgIGNvbnN0IHBhcnRJbmZvID0gcGFydEluZm9Gcm9tQXR0cihhdHRyKTtcbiAgICBjc3MgPSBgJHtjc3N9XFxuXFx0JHtydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpfWBcbiAgfVxuICByZXR1cm4gY3NzO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBjc3MgcnVsZSB0aGF0IGFwcGxpZXMgYSBwYXJ0LlxuICogQHBhcmFtIHsqfSBwYXJ0SW5mbyBBcnJheSBvZiBwYXJ0IGluZm8gZnJvbSBwYXJ0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsqfSBhdHRyIFBhcnQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyp9IGVsZW1lbnQgRWxlbWVudCB3aXRoaW4gd2hpY2ggdGhlIHBhcnQgZXhpc3RzXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUZXh0IG9mIHRoZSBjc3MgcnVsZSBvZiB0aGUgZm9ybSBgc2VsZWN0b3IgeyBwcm9wZXJ0aWVzIH1gXG4gKi9cbmZ1bmN0aW9uIHJ1bGVGb3JQYXJ0SW5mbyhwYXJ0SW5mbywgYXR0ciwgZWxlbWVudCkge1xuICBsZXQgdGV4dCA9ICcnO1xuICBwYXJ0SW5mby5mb3JFYWNoKGluZm8gPT4ge1xuICAgIGlmICghaW5mby5mb3J3YXJkKSB7XG4gICAgICBjb25zdCBwcm9wcyA9IHByb3BzRm9yUGFydChpbmZvLm5hbWUsIGVsZW1lbnQpO1xuICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IGJ1Y2tldCBpbiBwcm9wcykge1xuICAgICAgICAgIGxldCBwcm9wc0J1Y2tldCA9IHByb3BzW2J1Y2tldF07XG4gICAgICAgICAgbGV0IHBhcnRQcm9wcyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IHAgaW4gcHJvcHNCdWNrZXQpIHtcbiAgICAgICAgICAgIHBhcnRQcm9wcy5wdXNoKGAke3B9OiAke3Byb3BzQnVja2V0W3BdfTtgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGV4dCA9IGAke3RleHR9XFxuW3BhcnQ9XCIke2F0dHJ9XCJdJHtidWNrZXR9IHtcXG5cXHQke3BhcnRQcm9wcy5qb2luKCdcXG5cXHQnKX1cXG59YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0ZXh0O1xufVxuXG4vKipcbiAqIFBhcnNlcyBhIHBhcnQgYXR0cmlidXRlIGludG8gYW4gYXJyYXkgb2YgcGFydCBpbmZvXG4gKiBAcGFyYW0geyp9IGF0dHIgUGFydCBhdHRyaWJ1dGUgdmFsdWVcbiAqIEByZXR1cm5zIHthcnJheX0gQXJyYXkgb2YgcGFydCBpbmZvIG9iamVjdHMgb2YgdGhlIGZvcm0ge25hbWUsIGZvd2FyZH1cbiAqL1xuZnVuY3Rpb24gcGFydEluZm9Gcm9tQXR0cihhdHRyKSB7XG4gIGNvbnN0IHBpZWNlcyA9IGF0dHIgPyBhdHRyLnNwbGl0KC9cXHMqLFxccyovKSA6IFtdO1xuICBsZXQgcGFydHMgPSBbXTtcbiAgcGllY2VzLmZvckVhY2gocCA9PiB7XG4gICAgY29uc3QgbSA9IHAgPyBwLm1hdGNoKC8oW149XFxzXSopKD86XFxzKj0+XFxzKiguKikpPy8pIDogW107XG4gICAgaWYgKG0pIHtcbiAgICAgIHBhcnRzLnB1c2goe25hbWU6IG1bMl0gfHwgbVsxXSwgZm9yd2FyZDogbVsyXSA/IG1bMV0gOiBudWxsfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vKipcbiAqIEZvciBhIGdpdmVuIHBhcnQgbmFtZSByZXR1cm5zIGEgcHJvcGVydGllcyBvYmplY3Qgd2hpY2ggc2V0cyBhbnkgYW5jZXN0b3JcbiAqIHByb3ZpZGVkIHBhcnQgcHJvcGVydGllcyB0byB0aGUgcHJvcGVyIGFuY2VzdG9yIHByb3ZpZGVkIGNzcyB2YXJpYWJsZSBuYW1lLlxuICogZS5nLlxuICogY29sb3I6IGB2YXIoLS1lMS1wYXJ0LWJhci1jb2xvcik7YFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aXRoaW4gd2hpY2ggZG9tIHdpdGggcGFydCBleGlzdHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVxdWlyZVRoZW1lIFRydWUgaWYgb25seSA6OnRoZW1lIHNob3VsZCBiZSBjb2xsZWN0ZWQuXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgb2YgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHBhcnQgc2V0IHRvIHBhcnQgdmFyaWFibGVzXG4gKiBwcm92aWRlZCBieSB0aGUgZWxlbWVudHMgYW5jZXN0b3JzLlxuICovXG5mdW5jdGlvbiBwcm9wc0ZvclBhcnQobmFtZSwgZWxlbWVudCwgcmVxdWlyZVRoZW1lKSB7XG4gIGNvbnN0IGhvc3QgPSBlbGVtZW50ICYmIGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xuICBpZiAoIWhvc3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gY29sbGVjdCBwcm9wcyBmcm9tIGhvc3QgZWxlbWVudC5cbiAgbGV0IHByb3BzID0gcHJvcHNGcm9tRWxlbWVudChuYW1lLCBob3N0LCByZXF1aXJlVGhlbWUpO1xuICAvLyBub3cgcmVjdXJzZSBhbmNlc3RvcnMgdG8gZmluZCBtYXRjaGluZyBgdGhlbWVgIHByb3BlcnRpZXNcbiAgY29uc3QgdGhlbWVQcm9wcyA9IHByb3BzRm9yUGFydChuYW1lLCBob3N0LCB0cnVlKTtcbiAgcHJvcHMgPSBtaXhQYXJ0UHJvcHMocHJvcHMsIHRoZW1lUHJvcHMpO1xuICAvLyBub3cgcmVjdXJzZSBhbmNlc3RvcnMgdG8gZmluZCAqZm9yd2FyZGVkKiBwYXJ0IHByb3BlcnRpZXNcbiAgaWYgKCFyZXF1aXJlVGhlbWUpIHtcbiAgICAvLyBmb3J3YXJkaW5nOiByZWN1cnNlcyB1cCBhbmNlc3RvciB0cmVlIVxuICAgIGNvbnN0IHBhcnRJbmZvID0gcGFydEluZm9Gcm9tQXR0cihlbGVtZW50LmdldEF0dHJpYnV0ZSgncGFydCcpKTtcbiAgICAvLyB7bmFtZSwgZm9yd2FyZH0gd2hlcmUgYCpgIGNhbiBiZSBpbmNsdWRlZFxuICAgIHBhcnRJbmZvLmZvckVhY2goaW5mbyA9PiB7XG4gICAgICBsZXQgY2F0Y2hBbGwgPSBpbmZvLmZvcndhcmQgJiYgKGluZm8uZm9yd2FyZC5pbmRleE9mKCcqJykgPj0gMCk7XG4gICAgICBpZiAobmFtZSA9PSBpbmZvLmZvcndhcmQgfHwgY2F0Y2hBbGwpIHtcbiAgICAgICAgY29uc3QgYW5jZXN0b3JOYW1lID0gY2F0Y2hBbGwgPyBpbmZvLm5hbWUucmVwbGFjZSgnKicsIG5hbWUpIDogaW5mby5uYW1lO1xuICAgICAgICBjb25zdCBmb3J3YXJkZWQgPSBwcm9wc0ZvclBhcnQoYW5jZXN0b3JOYW1lLCBob3N0KTtcbiAgICAgICAgcHJvcHMgPSBtaXhQYXJ0UHJvcHMocHJvcHMsIGZvcndhcmRlZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcHJvcHM7XG59XG5cbi8qKlxuICogQ29sbGVjdHMgY3NzIGZvciB0aGUgZ2l2ZW4gbmFtZSBmcm9tIHRoZSBwYXJ0IGRhdGEgZm9yIHRoZSBnaXZlblxuICogZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHBhcnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGggcGFydCBjc3MvZGF0YS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVxdWlyZVRoZW1lIFRydWUgaWYgc2hvdWxkIG9ubHkgbWF0Y2ggOjp0aGVtZVxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHByb3BlcnRpZXMgZm9yIHRoZSBnaXZlbiBwYXJ0IHNldCB0byBwYXJ0IHZhcmlhYmxlc1xuICogcHJvdmlkZWQgYnkgdGhlIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHByb3BzRnJvbUVsZW1lbnQobmFtZSwgZWxlbWVudCwgcmVxdWlyZVRoZW1lKSB7XG4gIGxldCBwcm9wcztcbiAgY29uc3QgcGFydHMgPSBwYXJ0RGF0YUZvckVsZW1lbnQoZWxlbWVudCk7XG4gIGlmIChwYXJ0cykge1xuICAgIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBpZiAocGFydHMpIHtcbiAgICAgIHBhcnRzLmZvckVhY2goKHBhcnQpID0+IHtcbiAgICAgICAgaWYgKHBhcnQubmFtZSA9PSBuYW1lICYmICghcmVxdWlyZVRoZW1lIHx8IHBhcnQuaXNUaGVtZSkpIHtcbiAgICAgICAgICBwcm9wcyA9IGFkZFBhcnRQcm9wcyhwcm9wcywgcGFydCwgaWQsIG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb3BzO1xufVxuXG4vKipcbiAqIEFkZCBwYXJ0IGNzcyB0byB0aGUgcHJvcHMgb2JqZWN0IGZvciB0aGUgZ2l2ZW4gcGFydC9uYW1lLlxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzIE9iamVjdCBjb250YWluaW5nIHBhcnQgY3NzXG4gKiBAcGFyYW0ge29iamVjdH0gcGFydCBQYXJ0IGRhdGFcbiAqIEBwYXJhbSB7bm1iZXJ9IGlkIGVsZW1lbnQgcGFydCBpZFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiBwYXJ0XG4gKi9cbmZ1bmN0aW9uIGFkZFBhcnRQcm9wcyhwcm9wcywgcGFydCwgaWQsIG5hbWUpIHtcbiAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgY29uc3QgYnVja2V0ID0gcGFydC5lbmRTZWxlY3RvciB8fCAnJztcbiAgY29uc3QgYiA9IHByb3BzW2J1Y2tldF0gPSBwcm9wc1tidWNrZXRdIHx8IHt9O1xuICBmb3IgKGxldCBwIGluIHBhcnQucHJvcHMpIHtcbiAgICBiW3BdID0gYHZhcigke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIHBhcnQuZW5kU2VsZWN0b3IpfSlgO1xuICB9XG4gIHJldHVybiBwcm9wcztcbn1cblxuZnVuY3Rpb24gbWl4UGFydFByb3BzKGEsIGIpIHtcbiAgaWYgKGEgJiYgYikge1xuICAgIGZvciAobGV0IGkgaW4gYikge1xuICAgICAgLy8gZW5zdXJlIHN0b3JhZ2UgZXhpc3RzXG4gICAgICBpZiAoIWFbaV0pIHtcbiAgICAgICAgYVtpXSA9IHt9O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmFzc2lnbihhW2ldLCBiW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGEgfHwgYjtcbn1cblxuLyoqXG4gKiBDdXN0b21FbGVtZW50IG1peGluIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gcHJvdmlkZSA6OnBhcnQvOjp0aGVtZSBzdXBwb3J0LlxuICogQHBhcmFtIHsqfSBzdXBlckNsYXNzXG4gKi9cbmV4cG9ydCBsZXQgUGFydFRoZW1lTWl4aW4gPSBzdXBlckNsYXNzID0+IHtcblxuICByZXR1cm4gY2xhc3MgUGFydFRoZW1lQ2xhc3MgZXh0ZW5kcyBzdXBlckNsYXNzIHtcblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgaWYgKHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKSB7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5fYXBwbHlQYXJ0VGhlbWUoKSk7XG4gICAgfVxuXG4gICAgX2FwcGx5UGFydFRoZW1lKCkge1xuICAgICAgYXBwbHlQYXJ0VGhlbWUodGhpcyk7XG4gICAgfVxuXG4gIH1cblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gaW1wb3J0IHsgTWFza0hpZ2hsaWdodGVyIH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL21hc2staGlnaGxpZ2h0ZXIvbWFzay1oaWdobGlnaHRlci5qcyc7XG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodEV2ZW50c1xufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50LmpzJztcbmltcG9ydCB7XG4gICAgRGVtb3Ncbn0gZnJvbSAnLi9kZW1vcy5qcyc7XG5pbXBvcnQge1xuICAgIFhIb3N0LFxuICAgIFhSYXRpbmcsXG4gICAgWFRodW1ic1xufSBmcm9tICcuL3BhcnRUaGVtZS9jb21wb25lbnRzLXNhbXBsZS5qcyc7XG5pbXBvcnQge1xuICAgIENvbnRyb2xQcmV6XG59IGZyb20gJy4vY29udHJvbFByZXouanMnO1xuaW1wb3J0IHtcbiAgICBUeXBlVGV4dFxufSBmcm9tICcuL3R5cGVkVGV4dC5qcydcblxuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuXG4gICAgICAgIG5ldyBUeXBlVGV4dCgpO1xuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcbiAgICAgICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcbiAgICAgICAgICAgIC8vIG5ldyBDb250cm9sUHJleigpO1xuICAgICAgICB9XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGUtaG91ZGluaS13b3JrZmxvdycsICgpID0+IHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMScpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbEJhY2tGcmFnbWVudCgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgY2FsbEJhY2tGcmFnbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBUeXBlVGV4dCB7XG5cblx0Y29uc3RydWN0b3IoKXtcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignY3NzLXZhci10eXBlJywgKCk9Pntcblx0XHRcdHR5cGluZygndGl0bGUtY3NzLXZhcicsIDEwLCAwKVxuXHRcdFx0LnR5cGUoJ0NTUyBWYXJpYWJsZXMnKS53YWl0KDIwMDApLnNwZWVkKDUwKVxuXHRcdFx0LmRlbGV0ZSgnVmFyaWFibGVzJykud2FpdCg1MDApLnNwZWVkKDEwMClcblx0XHRcdC50eXBlKCdDdXN0b20gUHJvcGVydGllcycpO1xuXHRcdH0pO1xuXHR9XG59Il19
