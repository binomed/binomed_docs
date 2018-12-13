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
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), '#render-element h2{\n    --a-super-var: #FFF;\n}\n#render-element .text-1{\n\n}\n#render-element .text-2{\n\n}');
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

            new _applyCss.ApplyCss(document.getElementById('codemirror-css-in-js-css'), '#demo-ghost-parent {\n    --left-pos: 0;\n}\n#demo-ghost-parent .demo-shadow,\n#demo-ghost-parent .demo-ghost {\n    left: var(--left-pos);\n}');

            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-css-in-js-js'), 'javascript', 'document.addEventListener(\'mousemove\', (event) => {\n    const deltaX = this.width - event.clientX;\n    const median = this.width / 2;\n    const ghostParent = document.getElementById(\'demo-ghost-parent\');\n    const left = event.clientX > median ? (event.clientX - median) : -1 * (median - event.clientX);\n\n    ghostParent.style.setProperty(\'--left-pos\', `${left}px`);\n});');
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

            new _applyCss.ApplyCss(document.getElementById('codemirror-paint-api-css'), '\n#render-element-paint-api {\n    --circle-color: #FFF;\n    --width-circle: 100px;\n    width: var(--width-circle);\n    background-image: paint(circle);\n}\n\n            ');

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
        } else {
            document.getElementById('magicVideo').style.display = 'none';
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

        Reveal.addEventListener('start-video-magic', function () {
            document.getElementById('magicVideo').src = './assets/images/magic.gif';
        });

        Reveal.addEventListener('start-video-sensor', function () {
            document.getElementById('sensorVideo').src = './assets/images/generic-sensor-api.gif';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NvbnRyb2xQcmV6LmpzIiwic2NyaXB0cy9kZW1vcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlKcy5qcyIsInNjcmlwdHMvaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzL2hpZ2hsaWdodEV2ZW50LmpzIiwic2NyaXB0cy9saWJzL3RoaW5neS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzIiwic2NyaXB0cy9wYXJ0VGhlbWUvbGlicy9wYXJ0LXRoZW1lLmpzIiwic2NyaXB0cy9wcmV6LmpzIiwic2NyaXB0cy90eXBlZFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7Ozs7SUFJYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7O0FBQ1YsYUFBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUVBLGVBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXhDO0FBQ0g7Ozs7OENBRXFCO0FBQ2xCLGdCQUFJO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3RCO0FBQ0g7QUFDRCxvQkFBTSxTQUFTLG1CQUFXO0FBQ3RCLGdDQUFZO0FBRFUsaUJBQVgsQ0FBZjtBQUdBLHNCQUFNLE9BQU8sT0FBUCxFQUFOO0FBQ0EscUJBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLG9CQUFNLFVBQVUsTUFBTSxPQUFPLGVBQVAsRUFBdEI7QUFDQSxvQkFBTSxhQUFhLE1BQU0sYUFBYSxpQkFBYixFQUF6QjtBQUNBLG9CQUFJLGVBQWUsUUFBbkIsRUFBNkI7QUFDekIsNEJBQVEsR0FBUix5Q0FBa0QsUUFBUSxLQUExRDtBQUNILGlCQUZELE1BRU87QUFDSCw0QkFBUSxHQUFS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QzNDLFNBQU8sZUFBUCxFQUF3QixFQUF4QixFQUE0QixDQUE1QixFQUNDLElBREQsQ0FDTSxlQUROLEVBQ3VCLElBRHZCLENBQzRCLElBRDVCLEVBQ2tDLEtBRGxDLENBQ3dDLEVBRHhDLEVBRUMsTUFGRCxDQUVRLFdBRlIsRUFFcUIsSUFGckIsQ0FFMEIsR0FGMUIsRUFFK0IsS0FGL0IsQ0FFcUMsR0FGckMsRUFHQyxJQUhELENBR00sbUJBSE47QUFJQSxFQUxEO0FBTUEsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1xuICAgIFRoaW5neVxufSBmcm9tICcuL2xpYnMvdGhpbmd5LmpzJztcblxuZXhwb3J0IGNsYXNzIENvbnRyb2xQcmV6IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50aGluZ3lDb25uZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdGhpcy50aGluZ3lDb250cm9sLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGFzeW5jIHRoaW5neUNvbnRyb2woKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy50aGluZ3lDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0aGluZ3kgPSBuZXcgVGhpbmd5KHtcbiAgICAgICAgICAgICAgICBsb2dFbmFibGVkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaW5neS5jb25uZWN0KCk7XG4gICAgICAgICAgICB0aGlzLnRoaW5neUNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBiYXR0ZXJ5ID0gYXdhaXQgdGhpbmd5LmdldEJhdHRlcnlMZXZlbCgpO1xuICAgICAgICAgICAgY29uc3QgcGVybWlzc2lvbiA9IGF3YWl0IE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb24gPT09IFwiZGVuaWVkXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaGluZ3kgQ29ubmVjdCBhbmQgbGV2ZWwgYmF0dGVyeSA6ICR7YmF0dGVyeS52YWx1ZX1gLCBiYXR0ZXJ5KTtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKFwiVGhpbmd5IENvbm5lY3QgISBcIiwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBgIFRoaW5neSBDb25uZWN0IGFuZCBsZXZlbCBiYXR0ZXJ5IDogJHtiYXR0ZXJ5LnZhbHVlfSVgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHRoaW5neS5idXR0b25FbmFibGUoKHN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RhcCcsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgUmV2ZWFsLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXRlKTtcblxuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q3NzXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcbmltcG9ydCB7XG4gICAgQXBwbHlDb2RlTWlyb3Jcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlKcy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEZW1vcyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFySW5KUygpO1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFydFRoZW1lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9QYWludEFwaSgpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2RlbW9Dc3NWYXIoKSB7XG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcbiAgICAgICAgICAgIGAjcmVuZGVyLWVsZW1lbnQgaDJ7XG4gICAgLS1hLXN1cGVyLXZhcjogI0ZGRjtcbn1cbiNyZW5kZXItZWxlbWVudCAudGV4dC0xe1xuXG59XG4jcmVuZGVyLWVsZW1lbnQgLnRleHQtMntcblxufWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhckluSlMoKSB7XG5cbiAgICAgICAgbGV0IGluZGljZUggPSAtMTtcbiAgICAgICAgbGV0IHN1YnNjcmliZSA9IGZhbHNlO1xuICAgICAgICBsZXQgY2xpZW50UmVjdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgZ2hvc3RQYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtby1naG9zdC1wYXJlbnQnKTtcblxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzTW91c2UoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWCA9IChjbGllbnRSZWN0LndpZHRoICsgY2xpZW50UmVjdC5sZWZ0KSAtIGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgICBjb25zdCBtZWRpYW4gPSBjbGllbnRSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBkZWx0YVggPiAwID8gKG1lZGlhbiAtIGRlbHRhWCkgOiAobWVkaWFuICsgKC0xICogZGVsdGFYKSk7XG4gICAgICAgICAgICBnaG9zdFBhcmVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1sZWZ0LXBvcycsIGAke2xlZnR9cHhgKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBkZWx0YVg6ICR7ZGVsdGFYfSAvIG1lZGlhbiA6ICR7bWVkaWFufSAvIHdpZHRoIDogJHt3aWR0aH0gLyBsZWZ0IDogJHtsZWZ0fWApXG4gICAgICAgIH1cblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZ2hvc3Qtc3RhdGUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZSA9IHRydWU7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpbmRpY2VIID0gUmV2ZWFsLmdldEluZGljZXMoKS5oO1xuICAgICAgICAgICAgICAgIGNsaWVudFJlY3QgPSBnaG9zdFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBnaG9zdFBhcmVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBwcm9jZXNzTW91c2UpO1xuICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN1YnNjcmliZSAmJiBpbmRpY2VIICE9IGV2ZW50LmluZGV4aCkge1xuICAgICAgICAgICAgICAgIGdob3N0UGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHByb2Nlc3NNb3VzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzLWluLWpzLWNzcycpLFxuICAgICAgICAgICAgYCNkZW1vLWdob3N0LXBhcmVudCB7XG4gICAgLS1sZWZ0LXBvczogMDtcbn1cbiNkZW1vLWdob3N0LXBhcmVudCAuZGVtby1zaGFkb3csXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tZ2hvc3Qge1xuICAgIGxlZnQ6IHZhcigtLWxlZnQtcG9zKTtcbn1gXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IEFwcGx5Q29kZU1pcm9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcy1pbi1qcy1qcycpLFxuICAgICAgICAgICAgJ2phdmFzY3JpcHQnLFxuICAgICAgICAgICAgYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRlbHRhWCA9IHRoaXMud2lkdGggLSBldmVudC5jbGllbnRYO1xuICAgIGNvbnN0IG1lZGlhbiA9IHRoaXMud2lkdGggLyAyO1xuICAgIGNvbnN0IGdob3N0UGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tZ2hvc3QtcGFyZW50Jyk7XG4gICAgY29uc3QgbGVmdCA9IGV2ZW50LmNsaWVudFggPiBtZWRpYW4gPyAoZXZlbnQuY2xpZW50WCAtIG1lZGlhbikgOiAtMSAqIChtZWRpYW4gLSBldmVudC5jbGllbnRYKTtcblxuICAgIGdob3N0UGFyZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcG9zJywgXFxgXFwke2xlZnR9cHhcXGApO1xufSk7YCk7XG4gICAgfVxuXG4gICAgX2RlbW9QYXJ0VGhlbWUoKSB7XG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYXJ0LWNzcycpLFxuICAgICAgICAgICAgJ2NzcycsXG4gICAgICAgICAgICBgeC1yYXRpbmc6OnBhcnQoc3ViamVjdCkge1xuICAgIHBhZGRpbmc6IDRweDtcbiAgICBtaW4td2lkdGg6IDIwcHg7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuLnVubzpob3Zlcjo6cGFydChzdWJqZWN0KSB7XG4gICAgYmFja2dyb3VuZDogbGlnaHRncmVlbjtcbn1cbi5kdW86OnBhcnQoc3ViamVjdCkge1xuICAgIGJhY2tncm91bmQ6IGdvbGRlbnJvZDtcbn1cbi51bm86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XG4gICAgYmFja2dyb3VuZDogZ3JlZW47XG59XG4udW5vOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XG4gICAgYmFja2dyb3VuZDogdG9tYXRvO1xufVxuLmR1bzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcbiAgICBiYWNrZ3JvdW5kOiB5ZWxsb3c7XG59XG4uZHVvOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XG4gICAgYmFja2dyb3VuZDogYmxhY2s7XG59XG54LXJhdGluZzo6dGhlbWUodGh1bWItdXApIHtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG59XG5gKTtcblxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFydC1odG1sJyksXG4gICAgICAgICAgICAndGV4dC9odG1sJyxcbiAgICAgICAgICAgIGA8eC10aHVtYnM+XG4gICAgI3NoYWRvdy1yb290XG4gICAgPGRpdiBwYXJ0PVwidGh1bWItdXBcIj7wn5GNPC9kaXY+XG4gICAgPGRpdiBwYXJ0PVwidGh1bWItZG93blwiPvCfkY48L2Rpdj5cbjwveC10aHVtYnM+XG48eC1yYXRpbmc+XG4gICAgI3NoYWRvdy1yb290XG4gICAgPGRpdiBwYXJ0PVwic3ViamVjdFwiPjxzbG90Pjwvc2xvdD48L2Rpdj5cbiAgICA8eC10aHVtYnMgcGFydD1cIiogPT4gcmF0aW5nLSpcIj48L3gtdGh1bWJzPlxuPC94LXJhdGluZz5cblxuPHgtcmF0aW5nIGNsYXNzPVwidW5vXCI+4p2k77iPPC94LXJhdGluZz5cbjx4LXJhdGluZyBjbGFzcz1cImR1b1wiPvCfpLc8L3gtcmF0aW5nPlxuYCk7XG4gICAgfVxuXG4gICAgX2RlbW9QYWludEFwaSgpIHtcbiAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NpcmNsZS13b3JrbGV0LmpzJyk7XG5cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpLWNzcycpLFxuICAgICAgICAgICAgYFxuI3JlbmRlci1lbGVtZW50LXBhaW50LWFwaSB7XG4gICAgLS1jaXJjbGUtY29sb3I6ICNGRkY7XG4gICAgLS13aWR0aC1jaXJjbGU6IDEwMHB4O1xuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSk7XG59XG5cbiAgICAgICAgICAgIGBcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpJyksXG4gICAgICAgICAgICAnamF2YXNjcmlwdCcsXG4gICAgICAgICAgICBgcGFpbnQoY3R4LCBnZW9tLCBwcm9wZXJ0aWVzKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSBmaWxsIGNvbG9yLlxuICAgIGNvbnN0IGNvbG9yID0gcHJvcGVydGllcy5nZXQoJy0tY2lyY2xlLWNvbG9yJykudG9TdHJpbmcoKTtcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1cy5cbiAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1pbihnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyKTtcbiAgICAvLyBEcmF3IHRoZSBjaXJjbGUgXFxcXG8vXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMiwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XG4gICAgY3R4LmZpbGwoKTtcbn1cbiAgICAgICAgICAgIGApO1xuICAgIH1cblxufSIsIid1c2Ugc3RpY3QnXG5cbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ2JsYWNrYm9hcmQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG5cbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xuXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3MoY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xuICAgIH1cblxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5kZWxldGVSdWxlKDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcbiAgICAgICAgdmFsdWUuc3BsaXQoJ30nKVxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcbiAgICAgICAgICAgIC5mb3JFYWNoKHNlbGVjdG9yQ3NzID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ2JsYWNrYm9hcmQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcbiAgICB9XG5cbn0iLCIndXNlIHN0cmljdCdcblxuY29uc3QgTUlOX1RPUCA9ICcxMDBweCc7XG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE1ZW0nO1xuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBrZXlFbHQsXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcbiAgICB9KSB7XG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDksXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb24gaW4gSlNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlLWluLWpzJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNjBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzUwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gOjpQYXJ0XG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BhcnQnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRlbXBsYXRlIEluc3RhbnRpYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndGVtcGxhdGUtaW5zdGFudGlhdGlvbicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEhUTUwgTW9kdWxlXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2h0bWwtbW9kdWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTAsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBhaW50IEFQSVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwYWludC1hcGknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyBnZW5lcmljIHNlbnNvclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdnZW5lcmljLXNlbnNvcicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBY2NlbGVyb21ldGVyIHNlbnNvclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdhY2NlbGVyb21ldGVyLXNlbnNvcicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNixcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIGxlZnQ6ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgfVxufSIsIi8qKiAqL1xuZXhwb3J0IGNsYXNzIFRoaW5neSB7XG4gIC8qKlxuICAgICAqICBUaGluZ3k6NTIgV2ViIEJsdWV0b290aCBBUEkuIDxicj5cbiAgICAgKiAgQkxFIHNlcnZpY2UgZGV0YWlscyB7QGxpbmsgaHR0cHM6Ly9ub3JkaWNzZW1pY29uZHVjdG9yLmdpdGh1Yi5pby9Ob3JkaWMtVGhpbmd5NTItRlcvZG9jdW1lbnRhdGlvbi9maXJtd2FyZV9hcmNoaXRlY3R1cmUuaHRtbCNmd19hcmNoX2JsZV9zZXJ2aWNlcyBoZXJlfVxuICAgICAqXG4gICAgICpcbiAgICAgKiAgQGNvbnN0cnVjdG9yXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHtsb2dFbmFibGVkOiBmYWxzZX1dIC0gT3B0aW9ucyBvYmplY3QgZm9yIFRoaW5neVxuICAgICAqICBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbnMubG9nRW5hYmxlZCAtIEVuYWJsZXMgbG9nZ2luZyBvZiBhbGwgQkxFIGFjdGlvbnMuXG4gICAgICpcbiAgICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge2xvZ0VuYWJsZWQ6IGZhbHNlfSkge1xuICAgIHRoaXMubG9nRW5hYmxlZCA9IG9wdGlvbnMubG9nRW5hYmxlZDtcblxuICAgIC8vIFRDUyA9IFRoaW5neSBDb25maWd1cmF0aW9uIFNlcnZpY2VcbiAgICB0aGlzLlRDU19VVUlEID0gXCJlZjY4MDEwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRDU19OQU1FX1VVSUQgPSBcImVmNjgwMTAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVENTX0FEVl9QQVJBTVNfVVVJRCA9IFwiZWY2ODAxMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UQ1NfQ09OTl9QQVJBTVNfVVVJRCA9IFwiZWY2ODAxMDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UQ1NfRUREWVNUT05FX1VVSUQgPSBcImVmNjgwMTA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVENTX0NMT1VEX1RPS0VOX1VVSUQgPSBcImVmNjgwMTA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVENTX0ZXX1ZFUl9VVUlEID0gXCJlZjY4MDEwNy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRDU19NVFVfUkVRVUVTVF9VVUlEID0gXCJlZjY4MDEwOC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcblxuICAgIC8vIFRFUyA9IFRoaW5neSBFbnZpcm9ubWVudCBTZXJ2aWNlXG4gICAgdGhpcy5URVNfVVVJRCA9IFwiZWY2ODAyMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5URVNfVEVNUF9VVUlEID0gXCJlZjY4MDIwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRFU19QUkVTU1VSRV9VVUlEID0gXCJlZjY4MDIwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRFU19IVU1JRElUWV9VVUlEID0gXCJlZjY4MDIwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRFU19HQVNfVVVJRCA9IFwiZWY2ODAyMDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5URVNfQ09MT1JfVVVJRCA9IFwiZWY2ODAyMDUtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5URVNfQ09ORklHX1VVSUQgPSBcImVmNjgwMjA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuXG4gICAgLy8gVFVJUyA9IFRoaW5neSBVc2VyIEludGVyZmFjZSBTZXJ2aWNlXG4gICAgdGhpcy5UVUlTX1VVSUQgPSBcImVmNjgwMzAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVFVJU19MRURfVVVJRCA9IFwiZWY2ODAzMDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UVUlTX0JUTl9VVUlEID0gXCJlZjY4MDMwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRVSVNfUElOX1VVSUQgPSBcImVmNjgwMzAzLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuXG4gICAgLy8gVE1TID0gVGhpbmd5IE1vdGlvbiBTZXJ2aWNlXG4gICAgdGhpcy5UTVNfVVVJRCA9IFwiZWY2ODA0MDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfQ09ORklHX1VVSUQgPSBcImVmNjgwNDAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX1RBUF9VVUlEID0gXCJlZjY4MDQwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19PUklFTlRBVElPTl9VVUlEID0gXCJlZjY4MDQwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19RVUFURVJOSU9OX1VVSUQgPSBcImVmNjgwNDA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX1NURVBfVVVJRCA9IFwiZWY2ODA0MDUtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfUkFXX1VVSUQgPSBcImVmNjgwNDA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX0VVTEVSX1VVSUQgPSBcImVmNjgwNDA3LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX1JPVF9NQVRSSVhfVVVJRCA9IFwiZWY2ODA0MDgtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfSEVBRElOR19VVUlEID0gXCJlZjY4MDQwOS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19HUkFWSVRZX1VVSUQgPSBcImVmNjgwNDBhLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuXG4gICAgLy8gVFNTID0gVGhpbmd5IFNvdW5kIFNlcnZpY2VcbiAgICB0aGlzLlRTU19VVUlEID0gXCJlZjY4MDUwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRTU19DT05GSUdfVVVJRCA9IFwiZWY2ODA1MDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UU1NfU1BFQUtFUl9EQVRBX1VVSUQgPSBcImVmNjgwNTAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVFNTX1NQRUFLRVJfU1RBVF9VVUlEID0gXCJlZjY4MDUwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRTU19NSUNfVVVJRCA9IFwiZWY2ODA1MDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG5cbiAgICB0aGlzLnNlcnZpY2VVVUlEcyA9IFtcbiAgICAgIFwiYmF0dGVyeV9zZXJ2aWNlXCIsXG4gICAgICB0aGlzLlRDU19VVUlELFxuICAgICAgdGhpcy5URVNfVVVJRCxcbiAgICAgIHRoaXMuVFVJU19VVUlELFxuICAgICAgdGhpcy5UTVNfVVVJRCxcbiAgICAgIHRoaXMuVFNTX1VVSUQsXG4gICAgXTtcblxuICAgIHRoaXMuYmxlSXNCdXN5ID0gZmFsc2U7XG4gICAgdGhpcy5kZXZpY2U7XG4gICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLnNwZWFrZXJTdGF0dXNFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5taWNyb3Bob25lRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICB9XG5cbiAgLyoqXG4gICAgICogIE1ldGhvZCB0byByZWFkIGRhdGEgZnJvbSBhIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMuXG4gICAgICogIEltcGxlbWVudHMgYSBzaW1wbGUgc29sdXRpb24gdG8gYXZvaWQgc3RhcnRpbmcgbmV3IEdBVFQgcmVxdWVzdHMgd2hpbGUgYW5vdGhlciBpcyBwZW5kaW5nLlxuICAgICAqICBBbnkgYXR0ZW1wdCB0byByZWFkIHdoaWxlIGFub3RoZXIgR0FUVCBvcGVyYXRpb24gaXMgaW4gcHJvZ3Jlc3MsIHdpbGwgcmVzdWx0IGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqICBAYXN5bmNcbiAgICAgKiAgQHBhcmFtIHtPYmplY3R9IGNoYXJhY3RlcmlzdGljIC0gV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYyBvYmplY3RcbiAgICAgKiAgQHJldHVybiB7UHJvbWlzZTxEYXRhVmlldz59IFJldHVybnMgVWludDhBcnJheSB3aGVuIHJlc29sdmVkIG9yIGFuIGVycm9yIHdoZW4gcmVqZWN0ZWRcbiAgICAgKlxuICAgICAqICBAcHJpdmF0ZVxuXG4gICAgKi9cbiAgYXN5bmMgX3JlYWREYXRhKGNoYXJhY3RlcmlzdGljKSB7XG4gICAgaWYgKCF0aGlzLmJsZUlzQnVzeSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSB0cnVlO1xuICAgICAgICBjb25zdCBkYXRhQXJyYXkgPSBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gZGF0YUFycmF5O1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiR0FUVCBvcGVyYXRpb24gYWxyZWFkeSBwZW5kaW5nXCIpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIE1ldGhvZCB0byB3cml0ZSBkYXRhIHRvIGEgV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYy5cbiAgICogIEltcGxlbWVudHMgYSBzaW1wbGUgc29sdXRpb24gdG8gYXZvaWQgc3RhcnRpbmcgbmV3IEdBVFQgcmVxdWVzdHMgd2hpbGUgYW5vdGhlciBpcyBwZW5kaW5nLlxuICAgKiAgQW55IGF0dGVtcHQgdG8gc2VuZCBkYXRhIGR1cmluZyBhbm90aGVyIEdBVFQgb3BlcmF0aW9uIHdpbGwgcmVzdWx0IGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICogIE5vIHJldHJhbnNtaXNzaW9uIGlzIGltcGxlbWVudGVkIGF0IHRoaXMgbGV2ZWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBjaGFyYWN0ZXJpc3RpYyAtIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMgb2JqZWN0XG4gICAqICBAcGFyYW0ge1VpbnQ4QXJyYXl9IGRhdGFBcnJheSAtIFR5cGVkIGFycmF5IG9mIGJ5dGVzIHRvIHNlbmRcbiAgICogIEByZXR1cm4ge1Byb21pc2V9XG4gICAqXG4gICAqICBAcHJpdmF0ZVxuICAgKlxuICAqL1xuICBhc3luYyBfd3JpdGVEYXRhKGNoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpIHtcbiAgICBpZiAoIXRoaXMuYmxlSXNCdXN5KSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IHRydWU7XG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUoZGF0YUFycmF5KTtcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSBmYWxzZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkdBVFQgb3BlcmF0aW9uIGFscmVhZHkgcGVuZGluZ1wiKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBDb25uZWN0cyB0byBUaGluZ3kuXG4gICAqICBUaGUgZnVuY3Rpb24gc3RvcmVzIGFsbCBkaXNjb3ZlcmVkIHNlcnZpY2VzIGFuZCBjaGFyYWN0ZXJpc3RpY3MgdG8gdGhlIFRoaW5neSBvYmplY3QuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGFuIGVtcHR5IHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIGNvbm5lY3QoKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFNjYW4gZm9yIFRoaW5neXNcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coYFNjYW5uaW5nIGZvciBkZXZpY2VzIHdpdGggc2VydmljZSBVVUlEIGVxdWFsIHRvICR7dGhpcy5UQ1NfVVVJRH1gKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kZXZpY2UgPSBhd2FpdCBuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2Uoe1xuICAgICAgICBmaWx0ZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2VydmljZXM6IFt0aGlzLlRDU19VVUlEXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBvcHRpb25hbFNlcnZpY2VzOiB0aGlzLnNlcnZpY2VVVUlEcyxcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgRm91bmQgVGhpbmd5IG5hbWVkIFwiJHt0aGlzLmRldmljZS5uYW1lfVwiLCB0cnlpbmcgdG8gY29ubmVjdGApO1xuICAgICAgfVxuXG4gICAgICAvLyBDb25uZWN0IHRvIEdBVFQgc2VydmVyXG4gICAgICBjb25zdCBzZXJ2ZXIgPSBhd2FpdCB0aGlzLmRldmljZS5nYXR0LmNvbm5lY3QoKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coYENvbm5lY3RlZCB0byBcIiR7dGhpcy5kZXZpY2UubmFtZX1cImApO1xuICAgICAgfVxuXG4gICAgICAvLyBCYXR0ZXJ5IHNlcnZpY2VcbiAgICAgIGNvbnN0IGJhdHRlcnlTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKFwiYmF0dGVyeV9zZXJ2aWNlXCIpO1xuICAgICAgdGhpcy5iYXR0ZXJ5Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCBiYXR0ZXJ5U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyhcImJhdHRlcnlfbGV2ZWxcIik7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBiYXR0ZXJ5IHNlcnZpY2UgYW5kIGJhdHRlcnkgbGV2ZWwgY2hhcmFjdGVyaXN0aWNcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaW5neSBjb25maWd1cmF0aW9uIHNlcnZpY2VcbiAgICAgIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UQ1NfVVVJRCk7XG4gICAgICB0aGlzLm5hbWVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfTkFNRV9VVUlEKTtcbiAgICAgIHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0FEVl9QQVJBTVNfVVVJRCk7XG4gICAgICB0aGlzLmNsb3VkVG9rZW5DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfQ0xPVURfVE9LRU5fVVVJRCk7XG4gICAgICB0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfQ09OTl9QQVJBTVNfVVVJRCk7XG4gICAgICB0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19FRERZU1RPTkVfVVVJRCk7XG4gICAgICB0aGlzLmZpcm13YXJlVmVyc2lvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19GV19WRVJfVVVJRCk7XG4gICAgICB0aGlzLm10dVJlcXVlc3RDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfTVRVX1JFUVVFU1RfVVVJRCk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgY29uZmlndXJhdGlvbiBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGluZ3kgZW52aXJvbm1lbnQgc2VydmljZVxuICAgICAgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5URVNfVVVJRCk7XG4gICAgICB0aGlzLnRlbXBlcmF0dXJlQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19URU1QX1VVSUQpO1xuICAgICAgdGhpcy5jb2xvckNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfQ09MT1JfVVVJRCk7XG4gICAgICB0aGlzLmdhc0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfR0FTX1VVSUQpO1xuICAgICAgdGhpcy5odW1pZGl0eUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfSFVNSURJVFlfVVVJRCk7XG4gICAgICB0aGlzLnByZXNzdXJlQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19QUkVTU1VSRV9VVUlEKTtcbiAgICAgIHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0NPTkZJR19VVUlEKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBlbnZpcm9ubWVudCBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGluZ3kgdXNlciBpbnRlcmZhY2Ugc2VydmljZVxuICAgICAgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRVSVNfVVVJRCk7XG4gICAgICB0aGlzLmJ1dHRvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfQlROX1VVSUQpO1xuICAgICAgdGhpcy5sZWRDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UVUlTX0xFRF9VVUlEKTtcbiAgICAgIHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UVUlTX1BJTl9VVUlEKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSB1c2VyIGludGVyZmFjZSBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGluZ3kgbW90aW9uIHNlcnZpY2VcbiAgICAgIHRoaXMubW90aW9uU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRNU19VVUlEKTtcbiAgICAgIHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfQ09ORklHX1VVSUQpO1xuICAgICAgdGhpcy5ldWxlckNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0VVTEVSX1VVSUQpO1xuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfR1JBVklUWV9VVUlEKTtcbiAgICAgIHRoaXMuaGVhZGluZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0hFQURJTkdfVVVJRCk7XG4gICAgICB0aGlzLm9yaWVudGF0aW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfT1JJRU5UQVRJT05fVVVJRCk7XG4gICAgICB0aGlzLnF1YXRlcm5pb25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19RVUFURVJOSU9OX1VVSUQpO1xuICAgICAgdGhpcy5tb3Rpb25SYXdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19SQVdfVVVJRCk7XG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfUk9UX01BVFJJWF9VVUlEKTtcbiAgICAgIHRoaXMuc3RlcENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1NURVBfVVVJRCk7XG4gICAgICB0aGlzLnRhcENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1RBUF9VVUlEKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBtb3Rpb24gc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpbmd5IHNvdW5kIHNlcnZpY2VcbiAgICAgIHRoaXMuc291bmRTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVFNTX1VVSUQpO1xuICAgICAgdGhpcy50c3NDb25maWdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX0NPTkZJR19VVUlEKTtcbiAgICAgIHRoaXMubWljcm9waG9uZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfTUlDX1VVSUQpO1xuICAgICAgdGhpcy5zcGVha2VyRGF0YUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfU1BFQUtFUl9EQVRBX1VVSUQpO1xuICAgICAgdGhpcy5zcGVha2VyU3RhdHVzQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19TUEVBS0VSX1NUQVRfVVVJRCk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgc291bmQgc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgTWV0aG9kIHRvIGRpc2Nvbm5lY3QgZnJvbSBUaGluZ3kuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGFuIGVtcHR5IHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqL1xuICBhc3luYyBkaXNjb25uZWN0KCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmRldmljZS5nYXR0LmRpc2Nvbm5lY3QoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBlbmFibGUgYW5kIGRpc2FibGUgbm90aWZpY2F0aW9ucyBmb3IgYSBjaGFyYWN0ZXJpc3RpY1xuICBhc3luYyBfbm90aWZ5Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgbm90aWZ5SGFuZGxlcikge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJOb3RpZmljYXRpb25zIGVuYWJsZWQgZm9yIFwiICsgY2hhcmFjdGVyaXN0aWMudXVpZCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hhcmFjdGVyaXN0aWMuYWRkRXZlbnRMaXN0ZW5lcihcImNoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkXCIsIG5vdGlmeUhhbmRsZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5zdG9wTm90aWZpY2F0aW9ucygpO1xuICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJOb3RpZmljYXRpb25zIGRpc2FibGVkIGZvciBcIiwgY2hhcmFjdGVyaXN0aWMudXVpZCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hhcmFjdGVyaXN0aWMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkXCIsIG5vdGlmeUhhbmRsZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qICBDb25maWd1cmF0aW9uIHNlcnZpY2UgICovXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgbmFtZSBvZiB0aGUgVGhpbmd5IGRldmljZS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxzdHJpbmd8RXJyb3I+fSBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIG5hbWUgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXROYW1lKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5uYW1lQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xuICAgICAgY29uc3QgbmFtZSA9IGRlY29kZXIuZGVjb2RlKGRhdGEpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGRldmljZSBuYW1lOiBcIiArIG5hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIG5hbWUgb2YgdGhlIFRoaW5neSBkZXZpY2UuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgdGhhdCB3aWxsIGJlIGdpdmVuIHRvIHRoZSBUaGluZ3kuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXROYW1lKG5hbWUpIHtcbiAgICBpZiAobmFtZS5sZW5ndGggPiAxMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgbmFtZSBjYW4ndCBiZSBtb3JlIHRoYW4gMTAgY2hhcmFjdGVycyBsb25nLlwiKSk7XG4gICAgfVxuICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KG5hbWUubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGJ5dGVBcnJheVtpXSA9IG5hbWUuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLm5hbWVDaGFyYWN0ZXJpc3RpYywgYnl0ZUFycmF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBhZHZlcnRpc2luZyBwYXJhbWV0ZXJzXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgYWR2ZXJ0aXNpbmcgcGFyYW1ldGVycyB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICovXG4gIGFzeW5jIGdldEFkdlBhcmFtcygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5hZHZQYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XG5cbiAgICAgIC8vIEludGVydmFsIGlzIGdpdmVuIGluIHVuaXRzIG9mIDAuNjI1IG1pbGxpc2Vjb25kc1xuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGludGVydmFsID0gKHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKSAqIDAuNjI1KS50b0ZpeGVkKDApO1xuICAgICAgY29uc3QgdGltZW91dCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgyKTtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgaW50ZXJ2YWw6IHtcbiAgICAgICAgICBpbnRlcnZhbDogaW50ZXJ2YWwsXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxuICAgICAgICB9LFxuICAgICAgICB0aW1lb3V0OiB7XG4gICAgICAgICAgdGltZW91dDogdGltZW91dCxcbiAgICAgICAgICB1bml0OiBcInNcIixcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBhZHZlcnRpc2luZyBwYXJhbWV0ZXJzXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPYmplY3Qgd2l0aCBrZXkvdmFsdWUgcGFpcnMgJ2ludGVydmFsJyBhbmQgJ3RpbWVvdXQnOiA8Y29kZT57aW50ZXJ2YWw6IHNvbWVJbnRlcnZhbCwgdGltZW91dDogc29tZVRpbWVvdXR9PC9jb2RlPi5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuaW50ZXJ2YWwgLSBUaGUgYWR2ZXJ0aXNpbmcgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGluIHRoZSByYW5nZSBvZiAyMCBtcyB0byA1IDAwMCBtcy5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMudGltZW91dCAtIFRoZSBhZHZlcnRpc2luZyB0aW1lb3V0IGluIHNlY29uZHMgaW4gdGhlIHJhbmdlIDEgcyB0byAxODAgcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldEFkdlBhcmFtcyhwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyAhPT0gXCJvYmplY3RcIiB8fCBwYXJhbXMuaW50ZXJ2YWwgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMudGltZW91dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoXCJUaGUgYXJndW1lbnQgaGFzIHRvIGJlIGFuIG9iamVjdCB3aXRoIGtleS92YWx1ZSBwYWlycyBpbnRlcnZhbCcgYW5kICd0aW1lb3V0Jzoge2ludGVydmFsOiBzb21lSW50ZXJ2YWwsIHRpbWVvdXQ6IHNvbWVUaW1lb3V0fVwiKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBJbnRlcnZhbCBpcyBpbiB1bml0cyBvZiAwLjYyNSBtcy5cbiAgICBjb25zdCBpbnRlcnZhbCA9IHBhcmFtcy5pbnRlcnZhbCAqIDEuNjtcbiAgICBjb25zdCB0aW1lb3V0ID0gcGFyYW1zLnRpbWVvdXQ7XG5cbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXG4gICAgaWYgKGludGVydmFsIDwgMzIgfHwgaW50ZXJ2YWwgPiA4MDAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgYWR2ZXJ0aXNpbmcgaW50ZXJ2YWwgbXVzdCBiZSB3aXRoaW4gdGhlIHJhbmdlIG9mIDIwIG1zIHRvIDUgMDAwIG1zXCIpKTtcbiAgICB9XG4gICAgaWYgKHRpbWVvdXQgPCAwIHx8IHRpbWVvdXQgPiAxODApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBhZHZlcnRpc2luZyB0aW1lb3V0IG11c3QgYmUgd2l0aGluIHRoZSByYW5nZSBvZiAwIHRvIDE4MCBzXCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgzKTtcbiAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgZGF0YUFycmF5WzFdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcbiAgICBkYXRhQXJyYXlbMl0gPSB0aW1lb3V0O1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmFkdlBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGNvbm5lY3Rpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBjb25uZWN0aW9uIHBhcmFtZXRlcnMgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRDb25uUGFyYW1zKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XG5cbiAgICAgIC8vIENvbm5lY3Rpb24gaW50ZXJ2YWxzIGFyZSBnaXZlbiBpbiB1bml0cyBvZiAxLjI1IG1zXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgY29uc3QgbWluQ29ubkludGVydmFsID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pICogMS4yNTtcbiAgICAgIGNvbnN0IG1heENvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKSAqIDEuMjU7XG4gICAgICBjb25zdCBzbGF2ZUxhdGVuY3kgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XG5cbiAgICAgIC8vIFN1cGVydmlzaW9uIHRpbWVvdXQgaXMgZ2l2ZW4gaSB1bml0cyBvZiAxMCBtc1xuICAgICAgY29uc3Qgc3VwZXJ2aXNpb25UaW1lb3V0ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pICogMTA7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIGNvbm5lY3Rpb25JbnRlcnZhbDoge1xuICAgICAgICAgIG1pbjogbWluQ29ubkludGVydmFsLFxuICAgICAgICAgIG1heDogbWF4Q29ubkludGVydmFsLFxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcbiAgICAgICAgfSxcbiAgICAgICAgc2xhdmVMYXRlbmN5OiB7XG4gICAgICAgICAgdmFsdWU6IHNsYXZlTGF0ZW5jeSxcbiAgICAgICAgICB1bml0OiBcIm51bWJlciBvZiBjb25uZWN0aW9uIGludGVydmFsc1wiLFxuICAgICAgICB9LFxuICAgICAgICBzdXBlcnZpc2lvblRpbWVvdXQ6IHtcbiAgICAgICAgICB0aW1lb3V0OiBzdXBlcnZpc2lvblRpbWVvdXQsXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gaW50ZXJ2YWxcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIENvbm5lY3Rpb24gaW50ZXJ2YWwgb2JqZWN0OiA8Y29kZT57bWluSW50ZXJ2YWw6IHNvbWVWYWx1ZSwgbWF4SW50ZXJ2YWw6IHNvbWVWYWx1ZX08L2NvZGU+XG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm1pbkludGVydmFsIC0gVGhlIG1pbmltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgPj0gNy41IG1zLlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhJbnRlcnZhbCAtIFRoZSBtYXhpbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIDw9IDQgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0Q29ubkludGVydmFsKHBhcmFtcykge1xuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiIHx8IHBhcmFtcy5taW5JbnRlcnZhbCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5tYXhJbnRlcnZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0OiB7bWluSW50ZXJ2YWw6IHZhbHVlLCBtYXhJbnRlcnZhbDogdmFsdWV9XCIpKTtcbiAgICB9XG5cbiAgICBsZXQgbWluSW50ZXJ2YWwgPSBwYXJhbXMubWluSW50ZXJ2YWw7XG4gICAgbGV0IG1heEludGVydmFsID0gcGFyYW1zLm1heEludGVydmFsO1xuXG4gICAgaWYgKG1pbkludGVydmFsID09PSBudWxsIHx8IG1heEludGVydmFsID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIkJvdGggbWluaW11bSBhbmQgbWF4aW11bSBhY2NlcHRhYmxlIGludGVydmFsIG11c3QgYmUgcGFzc2VkIGFzIGFyZ3VtZW50c1wiKSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xuICAgIGlmIChtaW5JbnRlcnZhbCA8IDcuNSB8fCBtaW5JbnRlcnZhbCA+IG1heEludGVydmFsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIG1pbmltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiA3LjUgbXMgYW5kIDw9IG1heGltdW0gaW50ZXJ2YWxcIilcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChtYXhJbnRlcnZhbCA+IDQwMDAgfHwgbWF4SW50ZXJ2YWwgPCBtaW5JbnRlcnZhbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgUmFuZ2VFcnJvcihcIlRoZSBtaW5pbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgbXVzdCBiZSBsZXNzIHRoYW4gNCAwMDAgbXMgYW5kID49IG1pbmltdW0gaW50ZXJ2YWxcIilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xuXG4gICAgICAvLyBJbnRlcnZhbCBpcyBpbiB1bml0cyBvZiAxLjI1IG1zLlxuICAgICAgbWluSW50ZXJ2YWwgPSBNYXRoLnJvdW5kKG1pbkludGVydmFsICogMC44KTtcbiAgICAgIG1heEludGVydmFsID0gTWF0aC5yb3VuZChtYXhJbnRlcnZhbCAqIDAuOCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzBdID0gbWluSW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzFdID0gKG1pbkludGVydmFsID4+IDgpICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVsyXSA9IG1heEludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVszXSA9IChtYXhJbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHVwZGF0aW5nIGNvbm5lY3Rpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gc2xhdmUgbGF0ZW5jeVxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge251bWJlcn0gc2xhdmVMYXRlbmN5IC0gVGhlIGRlc2lyZWQgc2xhdmUgbGF0ZW5jeSBpbiB0aGUgcmFuZ2UgZnJvbSAwIHRvIDQ5OSBjb25uZWN0aW9uIGludGVydmFscy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRDb25uU2xhdmVMYXRlbmN5KHNsYXZlTGF0ZW5jeSkge1xuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcbiAgICBpZiAoc2xhdmVMYXRlbmN5IDwgMCB8fCBzbGF2ZUxhdGVuY3kgPiA0OTkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgbmV3IFJhbmdlRXJyb3IoXCJUaGUgc2xhdmUgbGF0ZW5jeSBtdXN0IGJlIGluIHRoZSByYW5nZSBmcm9tIDAgdG8gNDk5IGNvbm5lY3Rpb24gaW50ZXJ2YWxzLlwiKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzRdID0gc2xhdmVMYXRlbmN5ICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVs1XSA9IChzbGF2ZUxhdGVuY3kgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiB1cGRhdGluZyBzbGF2ZSBsYXRlbmN5OiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGNvbm5lY3Rpb24gc3VwZXJ2aXNpb24gdGltZW91dFxuICAgKiAgPGI+Tm90ZTo8L2I+IEFjY29yZGluZyB0byB0aGUgQmx1ZXRvb3RoIExvdyBFbmVyZ3kgc3BlY2lmaWNhdGlvbiwgdGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIG11c3QgYmUgZ3JlYXRlclxuICAgKiAgdGhhbiAoMSArIHNsYXZlTGF0ZW5jeSkgKiBtYXhDb25uSW50ZXJ2YWwgKiAyLCB3aGVyZSBtYXhDb25uSW50ZXJ2YWwgaXMgYWxzbyBnaXZlbiBpbiBtaWxsaXNlY29uZHMuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gVGhlIGRlc2lyZWQgY29ubmVjdGlvbiBzdXBlcnZpc2lvbiB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBhbmQgaW4gdGhlIHJhbmdlIG9mIDEwMCBtcyB0byAzMiAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRDb25uVGltZW91dCh0aW1lb3V0KSB7XG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xuICAgIGlmICh0aW1lb3V0IDwgMTAwIHx8IHRpbWVvdXQgPiAzMjAwMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgZnJvbSAxMDAgbXMgdG8gMzIgMDAwIG1zLlwiKSk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IGhhcyB0byBiZSBzZXQgaW4gdW5pdHMgb2YgMTAgbXNcbiAgICAgIHRpbWVvdXQgPSBNYXRoLnJvdW5kKHRpbWVvdXQgLyAxMCk7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg4KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayB0aGF0IHRoZSB0aW1lb3V0IG9iZXlzICBjb25uX3N1cF90aW1lb3V0ICogNCA+ICgxICsgc2xhdmVfbGF0ZW5jeSkgKiBtYXhfY29ubl9pbnRlcnZhbFxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG1heENvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IHNsYXZlTGF0ZW5jeSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcblxuICAgICAgaWYgKHRpbWVvdXQgKiA0IDwgKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgbXVzdCBiZSBncmVhdGVyIHRoYW4gKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsICogMiwgd2hlcmUgbWF4Q29ubkludGVydmFsIGlzIGFsc28gZ2l2ZW4gaW4gbWlsbGlzZWNvbmRzLlwiKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbNl0gPSB0aW1lb3V0ICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVs3XSA9ICh0aW1lb3V0ID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gdXBkYXRpbmcgdGhlIHN1cGVydmlzaW9uIHRpbWVvdXQ6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY29uZmlndXJlZCBFZGR5c3RvbmUgVVJMXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8VVJMfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBVUkwgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRFZGR5c3RvbmVVcmwoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZWRkeXN0b25lQ2hhcmFjdGVyaXN0aWMpO1xuXG4gICAgICAvLyBBY2NvcmRpbmcgdG8gRWRkeXN0b25lIFVSTCBlbmNvZGluZyBzcGVjaWZpY2F0aW9uLCBjZXJ0YWluIGVsZW1lbnRzIGNhbiBiZSBleHBhbmRlZDogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9lZGR5c3RvbmUvdHJlZS9tYXN0ZXIvZWRkeXN0b25lLXVybFxuICAgICAgY29uc3QgcHJlZml4QXJyYXkgPSBbXCJodHRwOi8vd3d3LlwiLCBcImh0dHBzOi8vd3d3LlwiLCBcImh0dHA6Ly9cIiwgXCJodHRwczovL1wiXTtcbiAgICAgIGNvbnN0IGV4cGFuc2lvbkNvZGVzID0gW1xuICAgICAgICBcIi5jb20vXCIsXG4gICAgICAgIFwiLm9yZy9cIixcbiAgICAgICAgXCIuZWR1L1wiLFxuICAgICAgICBcIi5uZXQvXCIsXG4gICAgICAgIFwiLmluZm8vXCIsXG4gICAgICAgIFwiLmJpei9cIixcbiAgICAgICAgXCIuZ292L1wiLFxuICAgICAgICBcIi5jb21cIixcbiAgICAgICAgXCIub3JnXCIsXG4gICAgICAgIFwiLmVkdVwiLFxuICAgICAgICBcIi5uZXRcIixcbiAgICAgICAgXCIuaW5mb1wiLFxuICAgICAgICBcIi5iaXpcIixcbiAgICAgICAgXCIuZ292XCIsXG4gICAgICBdO1xuICAgICAgY29uc3QgcHJlZml4ID0gcHJlZml4QXJyYXlbcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDApXTtcbiAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKTtcbiAgICAgIGxldCB1cmwgPSBkZWNvZGVyLmRlY29kZShyZWNlaXZlZERhdGEpO1xuICAgICAgdXJsID0gcHJlZml4ICsgdXJsLnNsaWNlKDEpO1xuXG4gICAgICBleHBhbnNpb25Db2Rlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XG4gICAgICAgIGlmICh1cmwuaW5kZXhPZihTdHJpbmcuZnJvbUNoYXJDb2RlKGkpKSAhPT0gLTEpIHtcbiAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShTdHJpbmcuZnJvbUNoYXJDb2RlKGkpLCBleHBhbnNpb25Db2Rlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbmV3IFVSTCh1cmwpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBFZGR5c3RvbmUgVVJMXG4gICAqICBJdCdzIHJlY29tbWVlbmRlZCB0byB1c2UgVVJMIHNob3J0ZW5lciB0byBzdGF5IHdpdGhpbiB0aGUgbGltaXQgb2YgMTQgY2hhcmFjdGVycyBsb25nIFVSTFxuICAgKiAgVVJMIHNjaGVtZSBwcmVmaXggc3VjaCBhcyBcImh0dHBzOi8vXCIgYW5kIFwiaHR0cHM6Ly93d3cuXCIgZG8gbm90IGNvdW50IHRvd2FyZHMgdGhhdCBsaW1pdCxcbiAgICogIG5laXRoZXIgZG9lcyBleHBhbnNpb24gY29kZXMgc3VjaCBhcyBcIi5jb20vXCIgYW5kIFwiLm9yZ1wiLlxuICAgKiAgRnVsbCBkZXRhaWxzIGluIHRoZSBFZGR5c3RvbmUgVVJMIHNwZWNpZmljYXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZWRkeXN0b25lL3RyZWUvbWFzdGVyL2VkZHlzdG9uZS11cmxcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtzdHJpbmd9IHVybFN0cmluZyAtIFRoZSBVUkwgdGhhdCBzaG91bGQgYmUgYnJvYWRjYXN0ZWQuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRFZGR5c3RvbmVVcmwodXJsU3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFVzZXMgVVJMIEFQSSB0byBjaGVjayBmb3IgdmFsaWQgVVJMXG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHVybFN0cmluZyk7XG5cbiAgICAgIC8vIEVkZHlzdG9uZSBVUkwgc3BlY2lmaWNhdGlvbiBkZWZpbmVzIGNvZGVzIGZvciBVUkwgc2NoZW1lIHByZWZpeGVzIGFuZCBleHBhbnNpb24gY29kZXMgaW4gdGhlIFVSTC5cbiAgICAgIC8vIFRoZSBhcnJheSBpbmRleCBjb3JyZXNwb25kcyB0byB0aGUgZGVmaW5lZCBjb2RlIGluIHRoZSBzcGVjaWZpY2F0aW9uLlxuICAgICAgLy8gRGV0YWlscyBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXG4gICAgICBjb25zdCBwcmVmaXhBcnJheSA9IFtcImh0dHA6Ly93d3cuXCIsIFwiaHR0cHM6Ly93d3cuXCIsIFwiaHR0cDovL1wiLCBcImh0dHBzOi8vXCJdO1xuICAgICAgY29uc3QgZXhwYW5zaW9uQ29kZXMgPSBbXG4gICAgICAgIFwiLmNvbS9cIixcbiAgICAgICAgXCIub3JnL1wiLFxuICAgICAgICBcIi5lZHUvXCIsXG4gICAgICAgIFwiLm5ldC9cIixcbiAgICAgICAgXCIuaW5mby9cIixcbiAgICAgICAgXCIuYml6L1wiLFxuICAgICAgICBcIi5nb3YvXCIsXG4gICAgICAgIFwiLmNvbVwiLFxuICAgICAgICBcIi5vcmdcIixcbiAgICAgICAgXCIuZWR1XCIsXG4gICAgICAgIFwiLm5ldFwiLFxuICAgICAgICBcIi5pbmZvXCIsXG4gICAgICAgIFwiLmJpelwiLFxuICAgICAgICBcIi5nb3ZcIixcbiAgICAgIF07XG4gICAgICBsZXQgcHJlZml4Q29kZSA9IG51bGw7XG4gICAgICBsZXQgZXhwYW5zaW9uQ29kZSA9IG51bGw7XG4gICAgICBsZXQgZWRkeXN0b25lVXJsID0gdXJsLmhyZWY7XG4gICAgICBsZXQgbGVuID0gZWRkeXN0b25lVXJsLmxlbmd0aDtcblxuICAgICAgcHJlZml4QXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xuICAgICAgICBpZiAodXJsLmhyZWYuaW5kZXhPZihlbGVtZW50KSAhPT0gLTEgJiYgcHJlZml4Q29kZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHByZWZpeENvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgICAgICAgIGVkZHlzdG9uZVVybCA9IGVkZHlzdG9uZVVybC5yZXBsYWNlKGVsZW1lbnQsIHByZWZpeENvZGUpO1xuICAgICAgICAgIGxlbiAtPSBlbGVtZW50Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGV4cGFuc2lvbkNvZGVzLmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcbiAgICAgICAgaWYgKHVybC5ocmVmLmluZGV4T2YoZWxlbWVudCkgIT09IC0xICYmIGV4cGFuc2lvbkNvZGUgPT09IG51bGwpIHtcbiAgICAgICAgICBleHBhbnNpb25Db2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICAgICAgICBlZGR5c3RvbmVVcmwgPSBlZGR5c3RvbmVVcmwucmVwbGFjZShlbGVtZW50LCBleHBhbnNpb25Db2RlKTtcbiAgICAgICAgICBsZW4gLT0gZWxlbWVudC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAobGVuIDwgMSB8fCBsZW4gPiAxNCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBVUkwgY2FuJ3QgYmUgbG9uZ2VyIHRoYW4gMTQgY2hhcmFjdGVycywgZXhjbHVkaW5nIFVSTCBzY2hlbWUgc3VjaCBhcyBcXFwiaHR0cHM6Ly9cXFwiIGFuZCBcXFwiLmNvbS9cXFwiLlwiKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShlZGR5c3RvbmVVcmwubGVuZ3RoKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlZGR5c3RvbmVVcmwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYnl0ZUFycmF5W2ldID0gZWRkeXN0b25lVXJsLmNoYXJDb2RlQXQoaSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5lZGR5c3RvbmVDaGFyYWN0ZXJpc3RpYywgYnl0ZUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIEdldHMgdGhlIGNvbmZpZ3VyZWQgY2xvdWQgdG9rZW4uXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBjbG91ZCB0b2tlbiB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldENsb3VkVG9rZW4oKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKTtcbiAgICAgIGNvbnN0IHRva2VuID0gZGVjb2Rlci5kZWNvZGUocmVjZWl2ZWREYXRhKTtcblxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBjbG91ZCB0b2tlbi5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIGNsb3VkIHRva2VuIHRvIGJlIHN0b3JlZC5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldENsb3VkVG9rZW4odG9rZW4pIHtcbiAgICBpZiAodG9rZW4ubGVuZ3RoID4gMjUwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGNsb3VkIHRva2VuIGNhbiBub3QgZXhjZWVkIDI1MCBjaGFyYWN0ZXJzLlwiKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcihcInV0Zi04XCIpLmVuY29kZSh0b2tlbik7XG5cbiAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljLCBlbmNvZGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBNYXhpbWFsIFRyYW5zbWlzc2lvbiBVbml0IChNVFUpXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8bnVtYmVyfEVycm9yPn0gUmV0dXJucyB0aGUgTVRVIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0TXR1KCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLm10dVJlcXVlc3RDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgY29uc3QgbXR1ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNigxLCBsaXR0bGVFbmRpYW4pO1xuXG4gICAgICByZXR1cm4gbXR1O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBjdXJyZW50IE1heGltYWwgVHJhbnNtaXNzaW9uIFVuaXQgKE1UVSlcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMgPSB7cGVyaXBoZXJhbFJlcXVlc3Q6IHRydWV9XSAtIE1UVSBzZXR0aW5ncyBvYmplY3Q6IHttdHVTaXplOiB2YWx1ZSwgcGVyaXBoZXJhbFJlcXVlc3Q6IHZhbHVlfSwgd2hlcmUgcGVyaXBoZXJhbFJlcXVlc3QgaXMgb3B0aW9uYWwuXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm10dVNpemUgLSBUaGUgZGVzaXJlZCBNVFUgc2l6ZS5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLnBlcmlwaGVyYWxSZXF1ZXN0IC0gT3B0aW9uYWwuIFNldCB0byA8Y29kZT50cnVlPC9jb2RlPiBpZiBwZXJpcGhlcmFsIHNob3VsZCBzZW5kIGFuIE1UVSBleGNoYW5nZSByZXF1ZXN0LiBEZWZhdWx0IGlzIDxjb2RlPnRydWU8L2NvZGU+O1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0TXR1KHBhcmFtcykge1xuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiIHx8IHBhcmFtcy5tdHVTaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIGFyZ3VtZW50IGhhcyB0byBiZSBhbiBvYmplY3RcIikpO1xuICAgIH1cblxuICAgIGNvbnN0IG10dVNpemUgPSBwYXJhbXMubXR1U2l6ZTtcbiAgICBjb25zdCBwZXJpcGhlcmFsUmVxdWVzdCA9IHBhcmFtcy5wZXJpcGhlcmFsUmVxdWVzdCB8fCB0cnVlO1xuXG4gICAgaWYgKG10dVNpemUgPCAyMyB8fCBtdHVTaXplID4gMjc2KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTVRVIHNpemUgbXVzdCBiZSBpbiByYW5nZSAyMyAtIDI3NiBieXRlc1wiKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMyk7XG4gICAgZGF0YUFycmF5WzBdID0gcGVyaXBoZXJhbFJlcXVlc3QgPyAxIDogMDtcbiAgICBkYXRhQXJyYXlbMV0gPSBtdHVTaXplICYgMHhmZjtcbiAgICBkYXRhQXJyYXlbMl0gPSAobXR1U2l6ZSA+PiA4KSAmIDB4ZmY7XG5cbiAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMubXR1UmVxdWVzdENoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGZpcm13YXJlIHZlcnNpb24uXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBmaXJtd2FyZSB2ZXJzaW9uIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldEZpcm13YXJlVmVyc2lvbigpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5maXJtd2FyZVZlcnNpb25DaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBtYWpvciA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgwKTtcbiAgICAgIGNvbnN0IG1pbm9yID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDEpO1xuICAgICAgY29uc3QgcGF0Y2ggPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMik7XG4gICAgICBjb25zdCB2ZXJzaW9uID0gYHYke21ham9yfS4ke21pbm9yfS4ke3BhdGNofWA7XG5cbiAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLy8gICoqKioqKiAgLy9cblxuICAvKiAgRW52aXJvbm1lbnQgc2VydmljZSAgKi9cblxuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBvZiB0aGUgVGhpbmd5IGVudmlyb25tZW50IG1vZHVsZS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIGVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdoZW4gcHJvbWlzZSByZXNvbHZlcywgb3IgYW4gZXJyb3IgaWYgcmVqZWN0ZWQuXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRFbnZpcm9ubWVudENvbmZpZygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgY29uc3QgdGVtcEludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IHByZXNzdXJlSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3QgaHVtaWRpdHlJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCBjb2xvckludGVydmFsID0gZGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IGdhc01vZGUgPSBkYXRhLmdldFVpbnQ4KDgpO1xuICAgICAgY29uc3QgY29sb3JTZW5zb3JSZWQgPSBkYXRhLmdldFVpbnQ4KDkpO1xuICAgICAgY29uc3QgY29sb3JTZW5zb3JHcmVlbiA9IGRhdGEuZ2V0VWludDgoMTApO1xuICAgICAgY29uc3QgY29sb3JTZW5zb3JCbHVlID0gZGF0YS5nZXRVaW50OCgxMSk7XG4gICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHRlbXBJbnRlcnZhbDogdGVtcEludGVydmFsLFxuICAgICAgICBwcmVzc3VyZUludGVydmFsOiBwcmVzc3VyZUludGVydmFsLFxuICAgICAgICBodW1pZGl0eUludGVydmFsOiBodW1pZGl0eUludGVydmFsLFxuICAgICAgICBjb2xvckludGVydmFsOiBjb2xvckludGVydmFsLFxuICAgICAgICBnYXNNb2RlOiBnYXNNb2RlLFxuICAgICAgICBjb2xvclNlbnNvclJlZDogY29sb3JTZW5zb3JSZWQsXG4gICAgICAgIGNvbG9yU2Vuc29yR3JlZW46IGNvbG9yU2Vuc29yR3JlZW4sXG4gICAgICAgIGNvbG9yU2Vuc29yQmx1ZTogY29sb3JTZW5zb3JCbHVlLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gZ2V0dGluZyBlbnZpcm9ubWVudCBzZW5zb3JzIGNvbmZpZ3VyYXRpb25zOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIHRlbXBlcmF0dXJlIG1lYXN1cmVtZW50IHVwZGF0ZSBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGVtcGVyYXR1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA2MCAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRUZW1wZXJhdHVyZUludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbnRlcnZhbCA8IDUwIHx8IGludGVydmFsID4gNjAwMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHRlbXBlcmF0dXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbMV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgdGVtcGVyYXR1cmUgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIHByZXNzdXJlIG1lYXN1cmVtZW50IHVwZGF0ZSBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGhlIHByZXNzdXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSA1MCBtcyB0byA2MCAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRQcmVzc3VyZUludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbnRlcnZhbCA8IDUwIHx8IGludGVydmFsID4gNjAwMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIHByZXNzdXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbMl0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbM10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgcHJlc3N1cmUgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGh1bWlkaXR5IG1lYXN1cmVtZW50IHVwZGF0ZSBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gSHVtaWRpdHkgc2Vuc29yIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDYwIDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldEh1bWlkaXR5SW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gNjAwMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGh1bWlkaXR5IHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs0XSA9IGludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVs1XSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBodW1pZGl0eSB1cGRhdGUgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgY29sb3Igc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gQ29sb3Igc2Vuc29yIHNhbXBsaW5nIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMjAwIG1zIHRvIDYwIDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldENvbG9ySW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGludGVydmFsIDwgMjAwIHx8IGludGVydmFsID4gNjAwMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGNvbG9yIHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAyMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs2XSA9IGludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVs3XSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBjb2xvciBzZW5zb3IgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGdhcyBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUaGUgZ2FzIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgaW4gc2Vjb25kcy4gQWxsb3dlZCB2YWx1ZXMgYXJlIDEsIDEwLCBhbmQgNjAgc2Vjb25kcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldEdhc0ludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBtb2RlO1xuXG4gICAgICBpZiAoaW50ZXJ2YWwgPT09IDEpIHtcbiAgICAgICAgbW9kZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKGludGVydmFsID09PSAxMCkge1xuICAgICAgICBtb2RlID0gMjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPT09IDYwKSB7XG4gICAgICAgIG1vZGUgPSAzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGdhcyBzZW5zb3IgaW50ZXJ2YWwgaGFzIHRvIGJlIDEsIDEwIG9yIDYwIHNlY29uZHMuXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbOF0gPSBtb2RlO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgZ2FzIHNlbnNvciBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBDb25maWd1cmVzIGNvbG9yIHNlbnNvciBMRUQgY2FsaWJyYXRpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IHJlZCAtIFRoZSByZWQgaW50ZW5zaXR5LCByYW5naW5nIGZyb20gMCB0byAyNTUuXG4gICAqICBAcGFyYW0ge051bWJlcn0gZ3JlZW4gLSBUaGUgZ3JlZW4gaW50ZW5zaXR5LCByYW5naW5nIGZyb20gMCB0byAyNTUuXG4gICAqICBAcGFyYW0ge051bWJlcn0gYmx1ZSAtIFRoZSBibHVlIGludGVuc2l0eSwgcmFuZ2luZyBmcm9tIDAgdG8gMjU1LlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgY29sb3JTZW5zb3JDYWxpYnJhdGUocmVkLCBncmVlbiwgYmx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs5XSA9IHJlZDtcbiAgICAgIGRhdGFBcnJheVsxMF0gPSBncmVlbjtcbiAgICAgIGRhdGFBcnJheVsxMV0gPSBibHVlO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgY29sb3Igc2Vuc29yIHBhcmFtZXRlcnM6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyB0ZW1wZXJhdHVyZSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSB0ZW1wZXJhdHVyZSBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyB0ZW1wZXJhdHVyZUVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fdGVtcGVyYXR1cmVOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnRlbXBFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMudGVtcGVyYXR1cmVDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfdGVtcGVyYXR1cmVOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBpbnRlZ2VyID0gZGF0YS5nZXRVaW50OCgwKTtcbiAgICBjb25zdCBkZWNpbWFsID0gZGF0YS5nZXRVaW50OCgxKTtcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IGludGVnZXIgKyBkZWNpbWFsIC8gMTAwO1xuICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgdmFsdWU6IHRlbXBlcmF0dXJlLFxuICAgICAgICB1bml0OiBcIkNlbHNpdXNcIixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIHByZXNzdXJlIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHByZXNzdXJlIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIHByZXNzdXJlRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fcHJlc3N1cmVOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMucHJlc3N1cmVDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX3ByZXNzdXJlTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICBjb25zdCBpbnRlZ2VyID0gZGF0YS5nZXRVaW50MzIoMCwgbGl0dGxlRW5kaWFuKTtcbiAgICBjb25zdCBkZWNpbWFsID0gZGF0YS5nZXRVaW50OCg0KTtcbiAgICBjb25zdCBwcmVzc3VyZSA9IGludGVnZXIgKyBkZWNpbWFsIC8gMTAwO1xuICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHZhbHVlOiBwcmVzc3VyZSxcbiAgICAgICAgdW5pdDogXCJoUGFcIixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIGh1bWlkaXR5IG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGh1bWlkaXR5IG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIGh1bWlkaXR5RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5faHVtaWRpdHlOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmh1bWlkaXR5Q2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9odW1pZGl0eU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IGh1bWlkaXR5ID0gZGF0YS5nZXRVaW50OCgwKTtcbiAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICB2YWx1ZTogaHVtaWRpdHksXG4gICAgICAgIHVuaXQ6IFwiJVwiLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgZ2FzIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGdhcyBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBnYXNFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fZ2FzTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmdhc0NoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG4gIF9nYXNOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgIGNvbnN0IGVjbzIgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xuICAgIGNvbnN0IHR2b2MgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xuXG4gICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIGVDTzI6IHtcbiAgICAgICAgICB2YWx1ZTogZWNvMixcbiAgICAgICAgICB1bml0OiBcInBwbVwiLFxuICAgICAgICB9LFxuICAgICAgICBUVk9DOiB7XG4gICAgICAgICAgdmFsdWU6IHR2b2MsXG4gICAgICAgICAgdW5pdDogXCJwcGJcIixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIGNvbG9yIHNlbnNvciBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBjb2xvciBzZW5zb3Igb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgY29sb3JFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9jb2xvck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5jb2xvckNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfY29sb3JOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgIGNvbnN0IHIgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xuICAgIGNvbnN0IGcgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xuICAgIGNvbnN0IGIgPSBkYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xuICAgIGNvbnN0IGMgPSBkYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pO1xuICAgIGNvbnN0IHJSYXRpbyA9IHIgLyAociArIGcgKyBiKTtcbiAgICBjb25zdCBnUmF0aW8gPSBnIC8gKHIgKyBnICsgYik7XG4gICAgY29uc3QgYlJhdGlvID0gYiAvIChyICsgZyArIGIpO1xuICAgIGNvbnN0IGNsZWFyQXRCbGFjayA9IDMwMDtcbiAgICBjb25zdCBjbGVhckF0V2hpdGUgPSA0MDA7XG4gICAgY29uc3QgY2xlYXJEaWZmID0gY2xlYXJBdFdoaXRlIC0gY2xlYXJBdEJsYWNrO1xuICAgIGxldCBjbGVhck5vcm1hbGl6ZWQgPSAoYyAtIGNsZWFyQXRCbGFjaykgLyBjbGVhckRpZmY7XG5cbiAgICBpZiAoY2xlYXJOb3JtYWxpemVkIDwgMCkge1xuICAgICAgY2xlYXJOb3JtYWxpemVkID0gMDtcbiAgICB9XG5cbiAgICBsZXQgcmVkID0gclJhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xuXG4gICAgaWYgKHJlZCA+IDI1NSkge1xuICAgICAgcmVkID0gMjU1O1xuICAgIH1cbiAgICBsZXQgZ3JlZW4gPSBnUmF0aW8gKiAyNTUuMCAqIDMgKiBjbGVhck5vcm1hbGl6ZWQ7XG5cbiAgICBpZiAoZ3JlZW4gPiAyNTUpIHtcbiAgICAgIGdyZWVuID0gMjU1O1xuICAgIH1cbiAgICBsZXQgYmx1ZSA9IGJSYXRpbyAqIDI1NS4wICogMyAqIGNsZWFyTm9ybWFsaXplZDtcblxuICAgIGlmIChibHVlID4gMjU1KSB7XG4gICAgICBibHVlID0gMjU1O1xuICAgIH1cblxuICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHJlZDogcmVkLnRvRml4ZWQoMCksXG4gICAgICAgIGdyZWVuOiBncmVlbi50b0ZpeGVkKDApLFxuICAgICAgICBibHVlOiBibHVlLnRvRml4ZWQoMCksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vICAqKioqKiogIC8vXG4gIC8qICBVc2VyIGludGVyZmFjZSBzZXJ2aWNlICAqL1xuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBMRUQgc2V0dGluZ3MgZnJvbSB0aGUgVGhpbmd5IGRldmljZS4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBzdHJ1Y3R1cmUgdGhhdCBkZXBlbmRzIG9uIHRoZSBzZXR0aW5ncy5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSBSZXR1cm5zIGEgTEVEIHN0YXR1cyBvYmplY3QuIFRoZSBjb250ZW50IGFuZCBzdHJ1Y3R1cmUgZGVwZW5kcyBvbiB0aGUgY3VycmVudCBtb2RlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0TGVkU3RhdHVzKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5sZWRDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBtb2RlID0gZGF0YS5nZXRVaW50OCgwKTtcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgICBsZXQgc3RhdHVzO1xuXG4gICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc3RhdHVzID0ge0xFRHN0YXR1czoge21vZGU6IG1vZGV9fTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHN0YXR1cyA9IHtcbiAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgIHI6IGRhdGEuZ2V0VWludDgoMSksXG4gICAgICAgICAgZzogZGF0YS5nZXRVaW50OCgyKSxcbiAgICAgICAgICBiOiBkYXRhLmdldFVpbnQ4KDMpLFxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgc3RhdHVzID0ge1xuICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgY29sb3I6IGRhdGEuZ2V0VWludDgoMSksXG4gICAgICAgICAgaW50ZW5zaXR5OiBkYXRhLmdldFVpbnQ4KDIpLFxuICAgICAgICAgIGRlbGF5OiBkYXRhLmdldFVpbnQxNigzLCBsaXR0bGVFbmRpYW4pLFxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgc3RhdHVzID0ge1xuICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgY29sb3I6IGRhdGEuZ2V0VWludDgoMSksXG4gICAgICAgICAgaW50ZW5zaXR5OiBkYXRhLmdldFVpbnQ4KDIpLFxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgVGhpbmd5IExFRCBzdGF0dXM6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIF9sZWRTZXQoZGF0YUFycmF5KSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLmxlZENoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBMRUQgaW4gY29uc3RhbnQgbW9kZSB3aXRoIHRoZSBzcGVjaWZpZWQgUkdCIGNvbG9yLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge09iamVjdH0gY29sb3IgLSBDb2xvciBvYmplY3Qgd2l0aCBSR0IgdmFsdWVzXG4gICAqICBAcGFyYW0ge251bWJlcn0gY29sb3IucmVkIC0gVGhlIHZhbHVlIGZvciByZWQgY29sb3IgaW4gYW4gUkdCIGNvbG9yLiBSYW5nZXMgZnJvbSAwIHRvIDI1NS5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5ncmVlbiAtIFRoZSB2YWx1ZSBmb3IgZ3JlZW4gY29sb3IgaW4gYW4gUkdCIGNvbG9yLiBSYW5nZXMgZnJvbSAwIHRvIDI1NS5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBjb2xvci5ibHVlIC0gVGhlIHZhbHVlIGZvciBibHVlIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHJlc29sdmVkIHByb21pc2Ugb3IgYW4gZXJyb3IgaW4gYSByZWplY3RlZCBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgbGVkQ29uc3RhbnQoY29sb3IpIHtcbiAgICBpZiAoY29sb3IucmVkID09PSB1bmRlZmluZWQgfHwgY29sb3IuZ3JlZW4gPT09IHVuZGVmaW5lZCB8fCBjb2xvci5ibHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBtdXN0IGhhdmUgdGhlIHByb3BlcnRpZXMgJ3JlZCcsICdncmVlbicgYW5kICdibHVlJy5cIikpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBjb2xvci5yZWQgPCAwIHx8XG4gICAgICBjb2xvci5yZWQgPiAyNTUgfHxcbiAgICAgIGNvbG9yLmdyZWVuIDwgMCB8fFxuICAgICAgY29sb3IuZ3JlZW4gPiAyNTUgfHxcbiAgICAgIGNvbG9yLmJsdWUgPCAwIHx8XG4gICAgICBjb2xvci5ibHVlID4gMjU1XG4gICAgKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgUkdCIHZhbHVlcyBtdXN0IGJlIGluIHRoZSByYW5nZSAwIC0gMjU1XCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMSwgY29sb3IucmVkLCBjb2xvci5ncmVlbiwgY29sb3IuYmx1ZV0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgTEVEIGluIFwiYnJlYXRoZVwiIG1vZGUgd2hlcmUgdGhlIExFRCBjb250aW51b3VzbHkgcHVsc2VzIHdpdGggdGhlIHNwZWNpZmllZCBjb2xvciwgaW50ZW5zaXR5IGFuZCBkZWxheSBiZXR3ZWVuIHB1bHNlcy5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIE9wdGlvbnMgb2JqZWN0IGZvciBMRUQgYnJlYXRoZSBtb2RlXG4gICAqICBAcGFyYW0ge251bWJlcnxzdHJpbmd9IHBhcmFtcy5jb2xvciAtIFRoZSBjb2xvciBjb2RlIG9yIGNvbG9yIG5hbWUuIDEgPSByZWQsIDIgPSBncmVlbiwgMyA9IHllbGxvdywgNCA9IGJsdWUsIDUgPSBwdXJwbGUsIDYgPSBjeWFuLCA3ID0gd2hpdGUuXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVuc2l0eSAtIEludGVuc2l0eSBvZiBMRUQgcHVsc2VzLiBSYW5nZSBmcm9tIDAgdG8gMTAwIFslXS5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuZGVsYXkgLSBEZWxheSBiZXR3ZWVuIHB1bHNlcyBpbiBtaWxsaXNlY29uZHMuIFJhbmdlIGZyb20gNTAgbXMgdG8gMTAgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSByZXNvbHZlZCBwcm9taXNlIG9yIGFuIGVycm9yIGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIGxlZEJyZWF0aGUocGFyYW1zKSB7XG4gICAgY29uc3QgY29sb3JzID0gW1wicmVkXCIsIFwiZ3JlZW5cIiwgXCJ5ZWxsb3dcIiwgXCJibHVlXCIsIFwicHVycGxlXCIsIFwiY3lhblwiLCBcIndoaXRlXCJdO1xuICAgIGNvbnN0IGNvbG9yQ29kZSA9IHR5cGVvZiBwYXJhbXMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBjb2xvcnMuaW5kZXhPZihwYXJhbXMuY29sb3IpICsgMSA6IHBhcmFtcy5jb2xvcjtcblxuICAgIGlmIChwYXJhbXMuY29sb3IgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaW50ZW5zaXR5ID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmRlbGF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcIlRoZSBvcHRpb25zIG9iamVjdCBmb3IgbXVzdCBoYXZlIHRoZSBwcm9wZXJ0aWVzICdjb2xvcicsICdpbnRlbnNpdHknIGFuZCAnaW50ZW5zaXR5Jy5cIilcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChjb2xvckNvZGUgPCAxIHx8IGNvbG9yQ29kZSA+IDcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBjb2RlIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEgLSA3XCIpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5pbnRlbnNpdHkgPCAwIHx8IHBhcmFtcy5pbnRlbnNpdHkgPiAxMDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBpbnRlbnNpdHkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDEwMCVcIikpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmRlbGF5IDwgNTAgfHwgcGFyYW1zLmRlbGF5ID4gMTAwMDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBkZWxheSBtdXN0IGJlIGluIHRoZSByYW5nZSA1MCBtcyAtIDEwIDAwMCBtc1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMiwgY29sb3JDb2RlLCBwYXJhbXMuaW50ZW5zaXR5LCBwYXJhbXMuZGVsYXkgJiAweGZmLCAocGFyYW1zLmRlbGF5ID4+IDgpICYgMHhmZl0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgTEVEIGluIG9uZS1zaG90IG1vZGUuIE9uZS1zaG90IG1vZGUgd2lsbCByZXN1bHQgaW4gb25lIHNpbmdsZSBwdWxzZSBvZiB0aGUgTEVELlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT3B0aW9uIG9iamVjdCBmb3IgTEVEIGluIG9uZS1zaG90IG1vZGVcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuY29sb3IgLSBUaGUgY29sb3IgY29kZS4gMSA9IHJlZCwgMiA9IGdyZWVuLCAzID0geWVsbG93LCA0ID0gYmx1ZSwgNSA9IHB1cnBsZSwgNiA9IGN5YW4sIDcgPSB3aGl0ZS5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuaW50ZW5zaXR5IC0gSW50ZW5zaXR5IG9mIExFRCBwdWxzZXMuIFJhbmdlIGZyb20gMCB0byAxMDAgWyVdLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSByZXNvbHZlZCBwcm9taXNlIG9yIGFuIGVycm9yIGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIGxlZE9uZVNob3QocGFyYW1zKSB7XG4gICAgY29uc3QgY29sb3JzID0gW1wicmVkXCIsIFwiZ3JlZW5cIiwgXCJ5ZWxsb3dcIiwgXCJibHVlXCIsIFwicHVycGxlXCIsIFwiY3lhblwiLCBcIndoaXRlXCJdO1xuICAgIGNvbnN0IGNvbG9yQ29kZSA9IHR5cGVvZiBwYXJhbXMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBjb2xvcnMuaW5kZXhPZihwYXJhbXMuY29sb3IpICsgMSA6IHBhcmFtcy5jb2xvcjtcblxuICAgIGlmIChjb2xvckNvZGUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaW50ZW5zaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcIlRoZSBvcHRpb25zIG9iamVjdCBmb3IgTEVEIG9uZS1zaG90IG11c3QgaGF2ZSB0aGUgcHJvcGVydGllcyAnY29sb3InIGFuZCAnaW50ZW5zaXR5LlwiKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGNvbG9yQ29kZSA8IDEgfHwgY29sb3JDb2RlID4gNykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGNvbG9yIGNvZGUgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMSAtIDdcIikpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmludGVuc2l0eSA8IDEgfHwgcGFyYW1zLmludGVuc2l0eSA+IDEwMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGludGVuc2l0eSBtdXN0IGJlIGluIHRoZSByYW5nZSAwIC0gMTAwXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbGVkU2V0KG5ldyBVaW50OEFycmF5KFszLCBjb2xvckNvZGUsIHBhcmFtcy5pbnRlbnNpdHldKSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgYnV0dG9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGJ1dHRvbiBvbiB0aGUgVGhpbmd5IGlzIHB1c2hlZCBvciByZWxlYXNlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgYnV0dG9uIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2l0aCBidXR0b24gc3RhdGUgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBidXR0b25FbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fYnV0dG9uTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5idXR0b25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9idXR0b25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBzdGF0ZSA9IGRhdGEuZ2V0VWludDgoMCk7XG4gICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcihzdGF0ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgZXh0ZXJuYWwgcGluIHNldHRpbmdzIGZyb20gdGhlIFRoaW5neSBkZXZpY2UuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggcGluIHN0YXR1cyBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIGV4dGVybmFsIHBpbiBzdGF0dXMgb2JqZWN0LlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZXh0ZXJuYWxQaW5zU3RhdHVzKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IHBpblN0YXR1cyA9IHtcbiAgICAgICAgcGluMTogZGF0YS5nZXRVaW50OCgwKSxcbiAgICAgICAgcGluMjogZGF0YS5nZXRVaW50OCgxKSxcbiAgICAgICAgcGluMzogZGF0YS5nZXRVaW50OCgyKSxcbiAgICAgICAgcGluNDogZGF0YS5nZXRVaW50OCgzKSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gcGluU3RhdHVzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiByZWFkaW5nIGZyb20gZXh0ZXJuYWwgcGluIGNoYXJhY3RlcmlzdGljOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldCBhbiBleHRlcm5hbCBwaW4gdG8gY2hvc2VuIHN0YXRlLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGluIC0gRGV0ZXJtaW5lcyB3aGljaCBwaW4gaXMgc2V0LiBSYW5nZSAxIC0gNC5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBwaW4uIDAgPSBPRkYsIDI1NSA9IE9OLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0RXh0ZXJuYWxQaW4ocGluLCB2YWx1ZSkge1xuICAgIGlmIChwaW4gPCAxIHx8IHBpbiA+IDQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQaW4gbnVtYmVyIG11c3QgYmUgMSAtIDRcIikpO1xuICAgIH1cbiAgICBpZiAoISh2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gMjU1KSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlBpbiBzdGF0dXMgdmFsdWUgbXVzdCBiZSAwIG9yIDI1NVwiKSk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2UgcGlucyB0aGF0IGFyZSBub3QgYmVpbmcgc2V0XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5W3BpbiAtIDFdID0gdmFsdWU7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIGV4dGVybmFsIHBpbnM6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8vICAqKioqKiogIC8vXG4gIC8qICBNb3Rpb24gc2VydmljZSAgKi9cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gb2YgdGhlIFRoaW5neSBtb3Rpb24gbW9kdWxlLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYSBtb3Rpb24gY29uZmlndXJhdGlvbiBvYmplY3Qgd2hlbiBwcm9taXNlIHJlc29sdmVzLCBvciBhbiBlcnJvciBpZiByZWplY3RlZC5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldE1vdGlvbkNvbmZpZygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHN0ZXBDb3VudGVySW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3QgdGVtcENvbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCBtYWduZXRDb21wSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3QgbW90aW9uUHJvY2Vzc2luZ0ZyZXF1ZW5jeSA9IGRhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCB3YWtlT25Nb3Rpb24gPSBkYXRhLmdldFVpbnQ4KDgpO1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBzdGVwQ291bnRJbnRlcnZhbDogc3RlcENvdW50ZXJJbnRlcnZhbCxcbiAgICAgICAgdGVtcENvbXBJbnRlcnZhbDogdGVtcENvbXBJbnRlcnZhbCxcbiAgICAgICAgbWFnbmV0Q29tcEludGVydmFsOiBtYWduZXRDb21wSW50ZXJ2YWwsXG4gICAgICAgIG1vdGlvblByb2Nlc3NpbmdGcmVxdWVuY3k6IG1vdGlvblByb2Nlc3NpbmdGcmVxdWVuY3ksXG4gICAgICAgIHdha2VPbk1vdGlvbjogd2FrZU9uTW90aW9uLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gZ2V0dGluZyBUaGluZ3kgbW90aW9uIG1vZHVsZSBjb25maWd1cmF0aW9uOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIHN0ZXAgY291bnRlciBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGludGVydmFsIC0gU3RlcCBjb3VudGVyIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDUgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0U3RlcENvdW50ZXJJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiA1MDAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSAxMDAgLSA1MDAwIG1zLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzBdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzFdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBzdGVwIGNvdW50IGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIHRlbXBlcmF0dXJlIGNvbXBlbnNhdGlvbiBpbnRlcnZhbC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGVtcGVyYXR1cmUgY29tcGVuc2F0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDUgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0VGVtcGVyYXR1cmVDb21wSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gNTAwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gNTAwMCBtcy5cIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVsyXSA9IGludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVszXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgdGVtcGVyYXR1cmUgY29tcGVuc2F0aW9uIGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIE1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gMSAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRNYWduZXRDb21wSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gMTAwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gMTAwMCBtcy5cIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs0XSA9IGludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVs1XSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgbWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIG1vdGlvbiBwcm9jZXNzaW5nIHVuaXQgdXBkYXRlIGZyZXF1ZW5jeS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGZyZXF1ZW5jeSAtIE1vdGlvbiBwcm9jZXNzaW5nIGZyZXF1ZW5jeSBpbiBIei4gVGhlIGFsbG93ZWQgcmFuZ2UgaXMgNSAtIDIwMCBIei5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldE1vdGlvblByb2Nlc3NGcmVxdWVuY3koZnJlcXVlbmN5KSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcmVxdWVuY3kgPCAxMDAgfHwgZnJlcXVlbmN5ID4gMjAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgaW50ZXJ2YWwgaGFzIHRvIGJlIGluIHRoZSByYW5nZSA1IC0gMjAwIEh6LlwiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzZdID0gZnJlcXVlbmN5ICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVs3XSA9IChmcmVxdWVuY3kgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1vdGlvbiBwb3JjZXNzaW5nIHVuaXQgdXBkYXRlIGZyZXF1ZW5jeTogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHdha2Utb24tbW90aW9uIGZlYXR1cmUgdG8gZW5hYmxlZCBvciBkaXNhYmxlZCBzdGF0ZS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBTZXQgdG8gVHJ1ZSB0byBlbmFibGUgb3IgRmFsc2UgdG8gZGlzYWJsZSB3YWtlLW9uLW1vdGlvbiBmZWF0dXJlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0V2FrZU9uTW90aW9uKGVuYWJsZSkge1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIGVuYWJsZSAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBhcmd1bWVudCBtdXN0IGJlIHRydWUgb3IgZmFsc2UuXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbOF0gPSBlbmFibGUgPyAxIDogMDtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBtYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsOlwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyB0YXAgZGV0ZWN0aW9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHRhcCBkZXRlY3Rpb24gb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgdGFwRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3RhcE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnRhcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy50YXBDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF90YXBOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBkYXRhLmdldFVpbnQ4KDApO1xuICAgIGNvbnN0IGNvdW50ID0gZGF0YS5nZXRVaW50OCgxKTtcbiAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXG4gICAgICAgIGNvdW50OiBjb3VudCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIG9yaWVudGF0aW9uIGRldGVjdGlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBvcmllbnRhdGlvbiBkZXRlY3Rpb24gb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgb3JpZW50YXRpb25FbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9vcmllbnRhdGlvbk5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5vcmllbnRhdGlvbkNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfb3JpZW50YXRpb25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGRhdGEuZ2V0VWludDgoMCk7XG4gICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKG9yaWVudGF0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBxdWF0ZXJuaW9uIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHF1YXRlcm5pb24gb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgcXVhdGVybmlvbkVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fcXVhdGVybmlvbk5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5xdWF0ZXJuaW9uQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX3F1YXRlcm5pb25Ob3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIC8vIERpdmlkZSBieSAoMSA8PCAzMCkgYWNjb3JkaW5nIHRvIHNlbnNvciBzcGVjaWZpY2F0aW9uXG4gICAgbGV0IHcgPSBkYXRhLmdldEludDMyKDAsIHRydWUpIC8gKDEgPDwgMzApO1xuICAgIGxldCB4ID0gZGF0YS5nZXRJbnQzMig0LCB0cnVlKSAvICgxIDw8IDMwKTtcbiAgICBsZXQgeSA9IGRhdGEuZ2V0SW50MzIoOCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XG4gICAgbGV0IHogPSBkYXRhLmdldEludDMyKDEyLCB0cnVlKSAvICgxIDw8IDMwKTtcbiAgICBjb25zdCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoTWF0aC5wb3codywgMikgKyBNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpICsgTWF0aC5wb3coeiwgMikpO1xuXG4gICAgaWYgKG1hZ25pdHVkZSAhPT0gMCkge1xuICAgICAgdyAvPSBtYWduaXR1ZGU7XG4gICAgICB4IC89IG1hZ25pdHVkZTtcbiAgICAgIHkgLz0gbWFnbml0dWRlO1xuICAgICAgeiAvPSBtYWduaXR1ZGU7XG4gICAgfVxuXG4gICAgdGhpcy5xdWF0ZXJuaW9uRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICB3OiB3LFxuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICB6OiB6LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgc3RlcCBjb3VudGVyIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHN0ZXAgY291bnRlciBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBzdGVwRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9zdGVwTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnN0ZXBDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfc3RlcE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgY29uc3QgY291bnQgPSBkYXRhLmdldFVpbnQzMigwLCBsaXR0bGVFbmRpYW4pO1xuICAgIGNvbnN0IHRpbWUgPSBkYXRhLmdldFVpbnQzMig0LCBsaXR0bGVFbmRpYW4pO1xuICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICB0aW1lOiB7XG4gICAgICAgICAgdmFsdWU6IHRpbWUsXG4gICAgICAgICAgdW5pdDogXCJtc1wiLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgcmF3IG1vdGlvbiBkYXRhIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHJhdyBtb3Rpb24gZGF0YSBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBtb3Rpb25SYXdFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fbW90aW9uUmF3Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLm1vdGlvblJhd0NoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX21vdGlvblJhd05vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gRGl2aWRlIGJ5IDJeNiA9IDY0IHRvIGdldCBhY2NlbGVyb21ldGVyIGNvcnJlY3QgdmFsdWVzXG4gICAgY29uc3QgYWNjWCA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA2NDtcbiAgICBjb25zdCBhY2NZID0gZGF0YS5nZXRJbnQxNigyLCB0cnVlKSAvIDY0O1xuICAgIGNvbnN0IGFjY1ogPSBkYXRhLmdldEludDE2KDQsIHRydWUpIC8gNjQ7XG5cbiAgICAvLyBEaXZpZGUgYnkgMl4xMSA9IDIwNDggdG8gZ2V0IGNvcnJlY3QgZ3lyb3Njb3BlIHZhbHVlc1xuICAgIGNvbnN0IGd5cm9YID0gZGF0YS5nZXRJbnQxNig2LCB0cnVlKSAvIDIwNDg7XG4gICAgY29uc3QgZ3lyb1kgPSBkYXRhLmdldEludDE2KDgsIHRydWUpIC8gMjA0ODtcbiAgICBjb25zdCBneXJvWiA9IGRhdGEuZ2V0SW50MTYoMTAsIHRydWUpIC8gMjA0ODtcblxuICAgIC8vIERpdmlkZSBieSAyXjEyID0gNDA5NiB0byBnZXQgY29ycmVjdCBjb21wYXNzIHZhbHVlc1xuICAgIGNvbnN0IGNvbXBhc3NYID0gZGF0YS5nZXRJbnQxNigxMiwgdHJ1ZSkgLyA0MDk2O1xuICAgIGNvbnN0IGNvbXBhc3NZID0gZGF0YS5nZXRJbnQxNigxNCwgdHJ1ZSkgLyA0MDk2O1xuICAgIGNvbnN0IGNvbXBhc3NaID0gZGF0YS5nZXRJbnQxNigxNiwgdHJ1ZSkgLyA0MDk2O1xuXG4gICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIGFjY2VsZXJvbWV0ZXI6IHtcbiAgICAgICAgICB4OiBhY2NYLFxuICAgICAgICAgIHk6IGFjY1ksXG4gICAgICAgICAgejogYWNjWixcbiAgICAgICAgICB1bml0OiBcIkdcIixcbiAgICAgICAgfSxcbiAgICAgICAgZ3lyb3Njb3BlOiB7XG4gICAgICAgICAgeDogZ3lyb1gsXG4gICAgICAgICAgeTogZ3lyb1ksXG4gICAgICAgICAgejogZ3lyb1osXG4gICAgICAgICAgdW5pdDogXCJkZWcvc1wiLFxuICAgICAgICB9LFxuICAgICAgICBjb21wYXNzOiB7XG4gICAgICAgICAgeDogY29tcGFzc1gsXG4gICAgICAgICAgeTogY29tcGFzc1ksXG4gICAgICAgICAgejogY29tcGFzc1osXG4gICAgICAgICAgdW5pdDogXCJtaWNyb1Rlc2xhXCIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBFdWxlciBhbmdsZSBkYXRhIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhbiBFdWxlciBhbmdsZSBkYXRhIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIGV1bGVyRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fZXVsZXJOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuZXVsZXJFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuZXVsZXJDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX2V1bGVyTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICAvLyBEaXZpZGUgYnkgdHdvIGJ5dGVzICgxPDwxNiBvciAyXjE2IG9yIDY1NTM2KSB0byBnZXQgY29ycmVjdCB2YWx1ZVxuICAgIGNvbnN0IHJvbGwgPSBkYXRhLmdldEludDMyKDAsIHRydWUpIC8gNjU1MzY7XG4gICAgY29uc3QgcGl0Y2ggPSBkYXRhLmdldEludDMyKDQsIHRydWUpIC8gNjU1MzY7XG4gICAgY29uc3QgeWF3ID0gZGF0YS5nZXRJbnQzMig4LCB0cnVlKSAvIDY1NTM2O1xuXG4gICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgcm9sbDogcm9sbCxcbiAgICAgICAgcGl0Y2g6IHBpdGNoLFxuICAgICAgICB5YXc6IHlhdyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIHJvdGF0aW9uIG1hdHJpeCBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzdW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYW4gcm90YXRpb24gbWF0cml4IG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIHJvdGF0aW9uTWF0cml4RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fcm90YXRpb25NYXRyaXhOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKFxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeENoYXJhY3RlcmlzdGljLFxuICAgICAgZW5hYmxlLFxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzBdXG4gICAgKTtcbiAgfVxuXG4gIF9yb3RhdGlvbk1hdHJpeE5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gRGl2aWRlIGJ5IDJeMiA9IDQgdG8gZ2V0IGNvcnJlY3QgdmFsdWVzXG4gICAgY29uc3QgcjFjMSA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIxYzIgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByMWMzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjJjMSA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIyYzIgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByMmMzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjNjMSA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIzYzIgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByM2MzID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG5cbiAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICByb3cxOiBbcjFjMSwgcjFjMiwgcjFjM10sXG4gICAgICAgIHJvdzI6IFtyMmMxLCByMmMyLCByMmMzXSxcbiAgICAgICAgcm93MzogW3IzYzEsIHIzYzIsIHIzYzNdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgaGVhZGluZyBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBoZWFkaW5nIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIGhlYWRpbmdFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2hlYWRpbmdOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuaGVhZGluZ0NoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9oZWFkaW5nTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICAvLyBEaXZpZGUgYnkgMl4xNiA9IDY1NTM2IHRvIGdldCBjb3JyZWN0IGhlYWRpbmcgdmFsdWVzXG4gICAgY29uc3QgaGVhZGluZyA9IGRhdGEuZ2V0SW50MzIoMCwgdHJ1ZSkgLyA2NTUzNjtcblxuICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgdmFsdWU6IGhlYWRpbmcsXG4gICAgICAgIHVuaXQ6IFwiZGVncmVlc1wiLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgZ3Jhdml0eSB2ZWN0b3Igbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgaGVhZGluZyBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBncmF2aXR5VmVjdG9yRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9ncmF2aXR5VmVjdG9yTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckNoYXJhY3RlcmlzdGljLFxuICAgICAgZW5hYmxlLFxuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMF1cbiAgICApO1xuICB9XG5cbiAgX2dyYXZpdHlWZWN0b3JOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCB4ID0gZGF0YS5nZXRGbG9hdDMyKDAsIHRydWUpO1xuICAgIGNvbnN0IHkgPSBkYXRhLmdldEZsb2F0MzIoNCwgdHJ1ZSk7XG4gICAgY29uc3QgeiA9IGRhdGEuZ2V0RmxvYXQzMig4LCB0cnVlKTtcblxuICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeSxcbiAgICAgICAgejogeixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gICoqKioqKiAgLy9cblxuICAvKiAgU291bmQgc2VydmljZSAgKi9cblxuICBtaWNyb3Bob25lRW5hYmxlKGVuYWJsZSkge1xuICAgIC8vIFRhYmxlcyBvZiBjb25zdGFudHMgbmVlZGVkIGZvciB3aGVuIHdlIGRlY29kZSB0aGUgYWRwY20tZW5jb2RlZCBhdWRpbyBmcm9tIHRoZSBUaGluZ3lcbiAgICBpZiAodGhpcy5fTUlDUk9QSE9ORV9JTkRFWF9UQUJMRSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9NSUNST1BIT05FX0lOREVYX1RBQkxFID0gWy0xLCAtMSwgLTEsIC0xLCAyLCA0LCA2LCA4LCAtMSwgLTEsIC0xLCAtMSwgMiwgNCwgNiwgOF07XG4gICAgfVxuICAgIGlmICh0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRSA9IFs3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE2LCAxNywgMTksIDIxLCAyMywgMjUsIDI4LCAzMSwgMzQsIDM3LCA0MSwgNDUsIDUwLCA1NSwgNjAsIDY2LCA3MywgODAsIDg4LCA5NywgMTA3LCAxMTgsIDEzMCwgMTQzLCAxNTcsIDE3MywgMTkwLCAyMDksXG4gICAgICAgIDIzMCwgMjUzLCAyNzksIDMwNywgMzM3LCAzNzEsIDQwOCwgNDQ5LCA0OTQsIDU0NCwgNTk4LCA2NTgsIDcyNCwgNzk2LCA4NzYsIDk2MywgMTA2MCwgMTE2NiwgMTI4MiwgMTQxMSwgMTU1MiwgMTcwNywgMTg3OCwgMjA2NiwgMjI3MiwgMjQ5OSwgMjc0OSwgMzAyNCwgMzMyNywgMzY2MCwgNDAyNiwgNDQyOCwgNDg3MSwgNTM1OCxcbiAgICAgICAgNTg5NCwgNjQ4NCwgNzEzMiwgNzg0NSwgODYzMCwgOTQ5MywgMTA0NDIsIDExNDg3LCAxMjYzNSwgMTM4OTksIDE1Mjg5LCAxNjgxOCwgMTg1MDAsIDIwMzUwLCAyMjM4NSwgMjQ2MjMsIDI3MDg2LCAyOTc5NCwgMzI3NjddO1xuICAgIH1cbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLm1pY3JvcGhvbmVFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX21pY3JvcGhvbmVOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAvLyBsYWdlciBlbiBueSBhdWRpbyBjb250ZXh0LCBza2FsIGJhcmUgaGEgw6luIGF2IGRlbm5lXG4gICAgICBpZiAodGhpcy5hdWRpb0N0eCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICAgICAgdGhpcy5hdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMubWljcm9waG9uZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMubWljcm9waG9uZUV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuICBfbWljcm9waG9uZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBhdWRpb1BhY2tldCA9IGV2ZW50LnRhcmdldC52YWx1ZS5idWZmZXI7XG4gICAgY29uc3QgYWRwY20gPSB7XG4gICAgICBoZWFkZXI6IG5ldyBEYXRhVmlldyhhdWRpb1BhY2tldC5zbGljZSgwLCAzKSksXG4gICAgICBkYXRhOiBuZXcgRGF0YVZpZXcoYXVkaW9QYWNrZXQuc2xpY2UoMykpLFxuICAgIH07XG4gICAgY29uc3QgZGVjb2RlZEF1ZGlvID0gdGhpcy5fZGVjb2RlQXVkaW8oYWRwY20pO1xuICAgIHRoaXMuX3BsYXlEZWNvZGVkQXVkaW8oZGVjb2RlZEF1ZGlvKTtcbiAgfVxuICAvKiAgU291bmQgc2VydmljZSAgKi9cbiAgX2RlY29kZUF1ZGlvKGFkcGNtKSB7XG4gICAgLy8gQWxsb2NhdGUgb3V0cHV0IGJ1ZmZlclxuICAgIGNvbnN0IGF1ZGlvQnVmZmVyRGF0YUxlbmd0aCA9IGFkcGNtLmRhdGEuYnl0ZUxlbmd0aDtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig1MTIpO1xuICAgIGNvbnN0IHBjbSA9IG5ldyBEYXRhVmlldyhhdWRpb0J1ZmZlcik7XG4gICAgbGV0IGRpZmY7XG4gICAgbGV0IGJ1ZmZlclN0ZXAgPSBmYWxzZTtcbiAgICBsZXQgaW5wdXRCdWZmZXIgPSAwO1xuICAgIGxldCBkZWx0YSA9IDA7XG4gICAgbGV0IHNpZ24gPSAwO1xuICAgIGxldCBzdGVwO1xuXG4gICAgLy8gVGhlIGZpcnN0IDIgYnl0ZXMgb2YgQURQQ00gZnJhbWUgYXJlIHRoZSBwcmVkaWN0ZWQgdmFsdWVcbiAgICBsZXQgdmFsdWVQcmVkaWN0ZWQgPSBhZHBjbS5oZWFkZXIuZ2V0SW50MTYoMCwgZmFsc2UpO1xuICAgIC8vIFRoZSAzcmQgYnl0ZSBpcyB0aGUgaW5kZXggdmFsdWVcbiAgICBsZXQgaW5kZXggPSBhZHBjbS5oZWFkZXIuZ2V0SW50OCgyKTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIGlmIChpbmRleCA+IDg4KSB7XG4gICAgICBpbmRleCA9IDg4O1xuICAgIH1cbiAgICBzdGVwID0gdGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEVbaW5kZXhdO1xuICAgIGZvciAobGV0IF9pbiA9IDAsIF9vdXQgPSAwOyBfaW4gPCBhdWRpb0J1ZmZlckRhdGFMZW5ndGg7IF9vdXQgKz0gMikge1xuICAgICAgLyogU3RlcCAxIC0gZ2V0IHRoZSBkZWx0YSB2YWx1ZSAqL1xuICAgICAgaWYgKGJ1ZmZlclN0ZXApIHtcbiAgICAgICAgZGVsdGEgPSBpbnB1dEJ1ZmZlciAmIDB4MEY7XG4gICAgICAgIF9pbisrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRCdWZmZXIgPSBhZHBjbS5kYXRhLmdldEludDgoX2luKTtcbiAgICAgICAgZGVsdGEgPSAoaW5wdXRCdWZmZXIgPj4gNCkgJiAweDBGO1xuICAgICAgfVxuICAgICAgYnVmZmVyU3RlcCA9ICFidWZmZXJTdGVwO1xuICAgICAgLyogU3RlcCAyIC0gRmluZCBuZXcgaW5kZXggdmFsdWUgKGZvciBsYXRlcikgKi9cbiAgICAgIGluZGV4ICs9IHRoaXMuX01JQ1JPUEhPTkVfSU5ERVhfVEFCTEVbZGVsdGFdO1xuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICBpbmRleCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggPiA4OCkge1xuICAgICAgICBpbmRleCA9IDg4O1xuICAgICAgfVxuICAgICAgLyogU3RlcCAzIC0gU2VwYXJhdGUgc2lnbiBhbmQgbWFnbml0dWRlICovXG4gICAgICBzaWduID0gZGVsdGEgJiA4O1xuICAgICAgZGVsdGEgPSBkZWx0YSAmIDc7XG4gICAgICAvKiBTdGVwIDQgLSBDb21wdXRlIGRpZmZlcmVuY2UgYW5kIG5ldyBwcmVkaWN0ZWQgdmFsdWUgKi9cbiAgICAgIGRpZmYgPSAoc3RlcCA+PiAzKTtcbiAgICAgIGlmICgoZGVsdGEgJiA0KSA+IDApIHtcbiAgICAgICAgZGlmZiArPSBzdGVwO1xuICAgICAgfVxuICAgICAgaWYgKChkZWx0YSAmIDIpID4gMCkge1xuICAgICAgICBkaWZmICs9IChzdGVwID4+IDEpO1xuICAgICAgfVxuICAgICAgaWYgKChkZWx0YSAmIDEpID4gMCkge1xuICAgICAgICBkaWZmICs9IChzdGVwID4+IDIpO1xuICAgICAgfVxuICAgICAgaWYgKHNpZ24gPiAwKSB7XG4gICAgICAgIHZhbHVlUHJlZGljdGVkIC09IGRpZmY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZVByZWRpY3RlZCArPSBkaWZmO1xuICAgICAgfVxuICAgICAgLyogU3RlcCA1IC0gY2xhbXAgb3V0cHV0IHZhbHVlICovXG4gICAgICBpZiAodmFsdWVQcmVkaWN0ZWQgPiAzMjc2Nykge1xuICAgICAgICB2YWx1ZVByZWRpY3RlZCA9IDMyNzY3O1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZVByZWRpY3RlZCA8IC0zMjc2OCkge1xuICAgICAgICB2YWx1ZVByZWRpY3RlZCA9IC0zMjc2ODtcbiAgICAgIH1cbiAgICAgIC8qIFN0ZXAgNiAtIFVwZGF0ZSBzdGVwIHZhbHVlICovXG4gICAgICBzdGVwID0gdGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEVbaW5kZXhdO1xuICAgICAgLyogU3RlcCA3IC0gT3V0cHV0IHZhbHVlICovXG4gICAgICBwY20uc2V0SW50MTYoX291dCwgdmFsdWVQcmVkaWN0ZWQsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gcGNtO1xuICB9XG4gIF9wbGF5RGVjb2RlZEF1ZGlvKGF1ZGlvKSB7XG4gICAgaWYgKHRoaXMuX2F1ZGlvU3RhY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fYXVkaW9TdGFjayA9IFtdO1xuICAgIH1cbiAgICB0aGlzLl9hdWRpb1N0YWNrLnB1c2goYXVkaW8pO1xuICAgIGlmICh0aGlzLl9hdWRpb1N0YWNrLmxlbmd0aCkge1xuICAgICAgdGhpcy5fc2NoZWR1bGVBdWRpb0J1ZmZlcnMoKTtcbiAgICB9XG4gIH1cbiAgX3NjaGVkdWxlQXVkaW9CdWZmZXJzKCkge1xuICAgIHdoaWxlICh0aGlzLl9hdWRpb1N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGJ1ZmZlclRpbWUgPSAwLjAxOyAvLyBCdWZmZXIgdGltZSBpbiBzZWNvbmRzIGJlZm9yZSBpbml0aWFsIGF1ZGlvIGNodW5rIGlzIHBsYXllZFxuICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5fYXVkaW9TdGFjay5zaGlmdCgpO1xuICAgICAgY29uc3QgY2hhbm5lbHMgPSAxO1xuICAgICAgY29uc3QgZnJhbWVjb3VudCA9IGJ1ZmZlci5ieXRlTGVuZ3RoIC8gMjtcbiAgICAgIGlmICh0aGlzLl9hdWRpb05leHRUaW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSA9IDA7XG4gICAgICB9XG4gICAgICBjb25zdCBteUFycmF5QnVmZmVyID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVCdWZmZXIoY2hhbm5lbHMsIGZyYW1lY291bnQsIDE2MDAwKTtcbiAgICAgIC8vIFRoaXMgZ2l2ZXMgdXMgdGhlIGFjdHVhbCBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhXG4gICAgICBjb25zdCBub3dCdWZmZXJpbmcgPSBteUFycmF5QnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXIuYnl0ZUxlbmd0aCAvIDI7IGkrKykge1xuICAgICAgICBub3dCdWZmZXJpbmdbaV0gPSBidWZmZXIuZ2V0SW50MTYoMiAqIGksIHRydWUpIC8gMzI3NjguMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuYXVkaW9DdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICBzb3VyY2UuYnVmZmVyID0gbXlBcnJheUJ1ZmZlcjtcbiAgICAgIHNvdXJjZS5jb25uZWN0KHRoaXMuYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICAgICAgaWYgKHRoaXMuX2F1ZGlvTmV4dFRpbWUgPT09IDApIHtcbiAgICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSA9IHRoaXMuYXVkaW9DdHguY3VycmVudFRpbWUgKyBidWZmZXJUaW1lO1xuICAgICAgfVxuICAgICAgc291cmNlLnN0YXJ0KHRoaXMuX2F1ZGlvTmV4dFRpbWUpO1xuICAgICAgdGhpcy5fYXVkaW9OZXh0VGltZSArPSBzb3VyY2UuYnVmZmVyLmR1cmF0aW9uO1xuICAgIH1cbiAgfVxuICAvLyAgKioqKioqICAvL1xuXG4gIC8qICBCYXR0ZXJ5IHNlcnZpY2UgICovXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgYmF0dGVyeSBsZXZlbCBvZiBUaGluZ3kuXG4gICAqXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdCB8IEVycm9yPn0gUmV0dXJucyBiYXR0ZXJ5IGxldmVsIGluIHBlcmNlbnRhZ2Ugd2hlbiBwcm9taXNlIGlzIHJlc29sdmVkIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0QmF0dGVyeUxldmVsKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmJhdHRlcnlDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBsZXZlbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgwKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IGxldmVsLFxuICAgICAgICB1bml0OiBcIiVcIixcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgYmF0dGVyeSBsZXZlbCBub3RpZmljYXRpb25zLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gYmF0dGVyeSBsZXZlbCBjaGFuZ2UuIFdpbGwgcmVjZWl2ZSBhIGJhdHRlcnkgbGV2ZWwgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgICAqL1xuICBhc3luYyBiYXR0ZXJ5TGV2ZWxFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fYmF0dGVyeUxldmVsTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmJhdHRlcnlDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9iYXR0ZXJ5TGV2ZWxOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCB2YWx1ZSA9IGRhdGEuZ2V0VWludDgoMCk7XG5cbiAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB1bml0OiBcIiVcIixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbi8vICAqKioqKiogIC8vXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7UGFydFRoZW1lTWl4aW59IGZyb20gJy4vbGlicy9wYXJ0LXRoZW1lLmpzJztcblxuZXhwb3J0IGNsYXNzIFBhcnRUaGVtZUVsZW1lbnQgZXh0ZW5kcyBQYXJ0VGhlbWVNaXhpbihIVE1MRWxlbWVudCkge1xuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gYGA7XG4gICAgfVxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgaWYgKCF0aGlzLnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmNvbnN0cnVjdG9yLnRlbXBsYXRlO1xuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6ICdvcGVuJ30pO1xuICAgICAgICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LmltcG9ydE5vZGUoXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKGRvbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbmV4cG9ydCBjbGFzcyBYVGh1bWJzIGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLXVwXCI+8J+RjTwvZGl2PlxuICAgICAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi1kb3duXCI+8J+RjjwvZGl2PlxuICAgICAgYDtcbiAgICB9XG4gIH1cblxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtdGh1bWJzJywgWFRodW1icyk7XG5cbmV4cG9ydCBjbGFzcyBYUmF0aW5nIGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLXVwKSB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBkb3R0ZWQgZ3JlZW47XG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBibHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXRodW1iczo6cGFydCh0aHVtYi1kb3duKSB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBkb3R0ZWQgcmVkO1xuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgIH1cbiAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgPGRpdiBwYXJ0PVwic3ViamVjdFwiPjxzbG90Pjwvc2xvdD48L2Rpdj5cbiAgICAgICAgPHgtdGh1bWJzIHBhcnQ9XCIqID0+IHJhdGluZy0qXCI+PC94LXRodW1icz5cbiAgICAgIGA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1yYXRpbmcnLCBYUmF0aW5nKTtcblxuZXhwb3J0IGNsYXNzIFhIb3N0IGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxzdHlsZT5cbiAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIG9yYW5nZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgeC1yYXRpbmcge1xuICAgICAgICAgICAgbWFyZ2luOiA0cHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtcmF0aW5nOjpwYXJ0KHN1YmplY3QpIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICB9XG4gICAgICAgICAgeC1yYXRpbmcge1xuICAgICAgICAgICAgLS1lMS1wYXJ0LXN1YmplY3QtcGFkZGluZzogNHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICAudW5vOmhvdmVyOjpwYXJ0KHN1YmplY3QpIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpZ2h0Z3JlZW47XG4gICAgICAgICAgfVxuICAgICAgICAgIC5kdW86OnBhcnQoc3ViamVjdCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogZ29sZGVucm9kO1xuICAgICAgICAgIH1cbiAgICAgICAgICAudW5vOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogZ3JlZW47XG4gICAgICAgICAgfVxuICAgICAgICAgIC51bm86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRvbWF0bztcbiAgICAgICAgICB9XG4gICAgICAgICAgLmR1bzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHllbGxvdztcbiAgICAgICAgICB9XG4gICAgICAgICAgLmR1bzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogYmxhY2s7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtcmF0aW5nOjp0aGVtZSh0aHVtYi11cCkge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgIH1cblxuICAgICAgICA8L3N0eWxlPlxuICAgICAgICA8eC1yYXRpbmcgY2xhc3M9XCJ1bm9cIj7inaTvuI88L3gtcmF0aW5nPlxuICAgICAgICA8YnI+XG4gICAgICAgIDx4LXJhdGluZyBjbGFzcz1cImR1b1wiPvCfpLc8L3gtcmF0aW5nPlxuICAgICAgYDtcbiAgICB9XG4gIH1cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LWhvc3QnLCBYSG9zdCk7IiwiLypcbkBsaWNlbnNlXG5Db3B5cmlnaHQgKGMpIDIwMTcgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuVGhpcyBjb2RlIG1heSBvbmx5IGJlIHVzZWQgdW5kZXIgdGhlIEJTRCBzdHlsZSBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcblRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxuQ29kZSBkaXN0cmlidXRlZCBieSBHb29nbGUgYXMgcGFydCBvZiB0aGUgcG9seW1lciBwcm9qZWN0IGlzIGFsc29cbnN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4qL1xuXG5jb25zdCBwYXJ0RGF0YUtleSA9ICdfX2Nzc1BhcnRzJztcbmNvbnN0IHBhcnRJZEtleSA9ICdfX3BhcnRJZCc7XG5cbi8qKlxuICogQ29udmVydHMgYW55IHN0eWxlIGVsZW1lbnRzIGluIHRoZSBzaGFkb3dSb290IHRvIHJlcGxhY2UgOjpwYXJ0Lzo6dGhlbWVcbiAqIHdpdGggY3VzdG9tIHByb3BlcnRpZXMgdXNlZCB0byB0cmFuc21pdCB0aGlzIGRhdGEgZG93biB0aGUgZG9tIHRyZWUuIEFsc29cbiAqIGNhY2hlcyBwYXJ0IG1ldGFkYXRhIGZvciBsYXRlciBsb29rdXAuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplUGFydHMoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQuc2hhZG93Um9vdCkge1xuICAgIGVsZW1lbnRbcGFydERhdGFLZXldID0gbnVsbDtcbiAgICByZXR1cm47XG4gIH1cbiAgQXJyYXkuZnJvbShlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSkuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgY29uc3QgaW5mbyA9IHBhcnRDc3NUb0N1c3RvbVByb3BDc3MoZWxlbWVudCwgc3R5bGUudGV4dENvbnRlbnQpO1xuICAgIGlmIChpbmZvLnBhcnRzKSB7XG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IGVsZW1lbnRbcGFydERhdGFLZXldIHx8IFtdO1xuICAgICAgZWxlbWVudFtwYXJ0RGF0YUtleV0ucHVzaCguLi5pbmZvLnBhcnRzKTtcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gaW5mby5jc3M7XG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnX19jc3NQYXJ0cycpKSB7XG4gICAgaW5pdGlhbGl6ZVBhcnRzKGVsZW1lbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpO1xuICByZXR1cm4gZWxlbWVudFtwYXJ0RGF0YUtleV07XG59XG5cbi8vIFRPRE8oc29ydmVsbCk6IGJyaXR0bGUgZHVlIHRvIHJlZ2V4LWluZyBjc3MuIEluc3RlYWQgdXNlIGEgY3NzIHBhcnNlci5cbi8qKlxuICogVHVybnMgY3NzIHVzaW5nIGA6OnBhcnRgIGludG8gY3NzIHVzaW5nIHZhcmlhYmxlcyBmb3IgdGhvc2UgcGFydHMuXG4gKiBBbHNvIHJldHVybnMgcGFydCBtZXRhZGF0YS5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IGNzc1RleHRcbiAqIEByZXR1cm5zIHtPYmplY3R9IGNzczogcGFydGlmaWVkIGNzcywgcGFydHM6IGFycmF5IG9mIHBhcnRzIG9mIHRoZSBmb3JtXG4gKiB7bmFtZSwgc2VsZWN0b3IsIHByb3BzfVxuICogRXhhbXBsZSBvZiBwYXJ0LWlmaWVkIGNzcywgZ2l2ZW46XG4gKiAuZm9vOjpwYXJ0KGJhcikgeyBjb2xvcjogcmVkIH1cbiAqIG91dHB1dDpcbiAqIC5mb28geyAtLWUxLXBhcnQtYmFyLWNvbG9yOiByZWQ7IH1cbiAqIHdoZXJlIGBlMWAgaXMgYSBndWlkIGZvciB0aGlzIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHBhcnRDc3NUb0N1c3RvbVByb3BDc3MoZWxlbWVudCwgY3NzVGV4dCkge1xuICBsZXQgcGFydHM7XG4gIGxldCBjc3MgPSBjc3NUZXh0LnJlcGxhY2UoY3NzUmUsIChtLCBzZWxlY3RvciwgdHlwZSwgbmFtZSwgZW5kU2VsZWN0b3IsIHByb3BzU3RyKSA9PiB7XG4gICAgcGFydHMgPSBwYXJ0cyB8fCBbXTtcbiAgICBsZXQgcHJvcHMgPSB7fTtcbiAgICBjb25zdCBwcm9wc0FycmF5ID0gcHJvcHNTdHIuc3BsaXQoL1xccyo7XFxzKi8pO1xuICAgIHByb3BzQXJyYXkuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGNvbnN0IHMgPSBwcm9wLnNwbGl0KCc6Jyk7XG4gICAgICBjb25zdCBuYW1lID0gcy5zaGlmdCgpLnRyaW0oKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcy5qb2luKCc6Jyk7XG4gICAgICBwcm9wc1tuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBwYXJ0cy5wdXNoKHtzZWxlY3RvciwgZW5kU2VsZWN0b3IsIG5hbWUsIHByb3BzLCBpc1RoZW1lOiB0eXBlID09IHRoZW1lfSk7XG4gICAgbGV0IHBhcnRQcm9wcyA9ICcnO1xuICAgIGZvciAobGV0IHAgaW4gcHJvcHMpIHtcbiAgICAgIHBhcnRQcm9wcyA9IGAke3BhcnRQcm9wc31cXG5cXHQke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIGVuZFNlbGVjdG9yKX06ICR7cHJvcHNbcF19O2A7XG4gICAgfVxuICAgIHJldHVybiBgXFxuJHtzZWxlY3RvciB8fCAnKid9IHtcXG5cXHQke3BhcnRQcm9wcy50cmltKCl9XFxufWA7XG4gIH0pO1xuICByZXR1cm4ge3BhcnRzLCBjc3N9O1xufVxuXG4vLyBndWlkIGZvciBlbGVtZW50IHBhcnQgc2NvcGVzXG5sZXQgcGFydElkID0gMDtcbmZ1bmN0aW9uIHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudFtwYXJ0SWRLZXldID09IHVuZGVmaW5lZCkge1xuICAgIGVsZW1lbnRbcGFydElkS2V5XSA9IHBhcnRJZCsrO1xuICB9XG4gIHJldHVybiBlbGVtZW50W3BhcnRJZEtleV07XG59XG5cbmNvbnN0IHRoZW1lID0gJzo6dGhlbWUnO1xuY29uc3QgY3NzUmUgPSAvXFxzKiguKikoOjooPzpwYXJ0fHRoZW1lKSlcXCgoW14pXSspXFwpKFteXFxze10qKVxccyp7XFxzKihbXn1dKilcXHMqfS9nXG5cbi8vIGNyZWF0ZXMgYSBjdXN0b20gcHJvcGVydHkgbmFtZSBmb3IgYSBwYXJ0LlxuZnVuY3Rpb24gdmFyRm9yUGFydChpZCwgbmFtZSwgcHJvcCwgZW5kU2VsZWN0b3IpIHtcbiAgcmV0dXJuIGAtLWUke2lkfS1wYXJ0LSR7bmFtZX0tJHtwcm9wfSR7ZW5kU2VsZWN0b3IgPyBgLSR7ZW5kU2VsZWN0b3IucmVwbGFjZSgvXFw6L2csICcnKX1gIDogJyd9YDtcbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBhIHN0eWxlIHVzaW5nIGNzcyBjdXN0b20gcHJvcGVydGllcyB0byBzdHlsZSA6OnBhcnQvOjp0aGVtZVxuICogZm9yIGFsbCB0aGUgZG9tIGluIHRoZSBlbGVtZW50J3Mgc2hhZG93Um9vdC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQYXJ0VGhlbWUoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC5zaGFkb3dSb290KSB7XG4gICAgY29uc3Qgb2xkU3R5bGUgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3R5bGVbcGFydHNdJyk7XG4gICAgaWYgKG9sZFN0eWxlKSB7XG4gICAgICBvbGRTdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZFN0eWxlKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xuICBpZiAoaG9zdCkge1xuICAgIC8vIG5vdGU6IGVuc3VyZSBob3N0IGhhcyBwYXJ0IGRhdGEgc28gdGhhdCBlbGVtZW50cyB0aGF0IGJvb3QgdXBcbiAgICAvLyB3aGlsZSB0aGUgaG9zdCBpcyBiZWluZyBjb25uZWN0ZWQgY2FuIHN0eWxlIHBhcnRzLlxuICAgIGVuc3VyZVBhcnREYXRhKGhvc3QpO1xuICAgIGNvbnN0IGNzcyA9IGNzc0ZvckVsZW1lbnREb20oZWxlbWVudCk7XG4gICAgaWYgKGNzcykge1xuICAgICAgY29uc3QgbmV3U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgbmV3U3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XG4gICAgICBlbGVtZW50LnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQobmV3U3R5bGUpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByb2R1Y2VzIGNzc1RleHQgYSBzdHlsZSBlbGVtZW50IHRvIGFwcGx5IHBhcnQgY3NzIHRvIGEgZ2l2ZW4gZWxlbWVudC5cbiAqIFRoZSBlbGVtZW50J3Mgc2hhZG93Um9vdCBkb20gaXMgc2Nhbm5lZCBmb3Igbm9kZXMgd2l0aCBhIGBwYXJ0YCBhdHRyaWJ1dGUuXG4gKiBUaGVuIHNlbGVjdG9ycyBhcmUgY3JlYXRlZCBtYXRjaGluZyB0aGUgcGFydCBhdHRyaWJ1dGUgY29udGFpbmluZyBwcm9wZXJ0aWVzXG4gKiB3aXRoIHBhcnRzIGRlZmluZWQgaW4gdGhlIGVsZW1lbnQncyBob3N0LlxuICogVGhlIGFuY2VzdG9yIHRyZWUgaXMgdHJhdmVyc2VkIGZvciBmb3J3YXJkZWQgcGFydHMgYW5kIHRoZW1lLlxuICogZS5nLlxuICogW3BhcnQ9XCJiYXJcIl0ge1xuICogICBjb2xvcjogdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO1xuICogfVxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgZm9yIHdoaWNoIHRvIGFwcGx5IHBhcnQgY3NzXG4gKi9cbmZ1bmN0aW9uIGNzc0ZvckVsZW1lbnREb20oZWxlbWVudCkge1xuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcbiAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xuICBjb25zdCBwYXJ0Tm9kZXMgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW3BhcnRdJyk7XG4gIGxldCBjc3MgPSAnJztcbiAgZm9yIChsZXQgaT0wOyBpIDwgcGFydE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYXR0ciA9IHBhcnROb2Rlc1tpXS5nZXRBdHRyaWJ1dGUoJ3BhcnQnKTtcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoYXR0cik7XG4gICAgY3NzID0gYCR7Y3NzfVxcblxcdCR7cnVsZUZvclBhcnRJbmZvKHBhcnRJbmZvLCBhdHRyLCBlbGVtZW50KX1gXG4gIH1cbiAgcmV0dXJuIGNzcztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY3NzIHJ1bGUgdGhhdCBhcHBsaWVzIGEgcGFydC5cbiAqIEBwYXJhbSB7Kn0gcGFydEluZm8gQXJyYXkgb2YgcGFydCBpbmZvIGZyb20gcGFydCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsqfSBlbGVtZW50IEVsZW1lbnQgd2l0aGluIHdoaWNoIHRoZSBwYXJ0IGV4aXN0c1xuICogQHJldHVybnMge3N0cmluZ30gVGV4dCBvZiB0aGUgY3NzIHJ1bGUgb2YgdGhlIGZvcm0gYHNlbGVjdG9yIHsgcHJvcGVydGllcyB9YFxuICovXG5mdW5jdGlvbiBydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpIHtcbiAgbGV0IHRleHQgPSAnJztcbiAgcGFydEluZm8uZm9yRWFjaChpbmZvID0+IHtcbiAgICBpZiAoIWluZm8uZm9yd2FyZCkge1xuICAgICAgY29uc3QgcHJvcHMgPSBwcm9wc0ZvclBhcnQoaW5mby5uYW1lLCBlbGVtZW50KTtcbiAgICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBidWNrZXQgaW4gcHJvcHMpIHtcbiAgICAgICAgICBsZXQgcHJvcHNCdWNrZXQgPSBwcm9wc1tidWNrZXRdO1xuICAgICAgICAgIGxldCBwYXJ0UHJvcHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGxldCBwIGluIHByb3BzQnVja2V0KSB7XG4gICAgICAgICAgICBwYXJ0UHJvcHMucHVzaChgJHtwfTogJHtwcm9wc0J1Y2tldFtwXX07YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRleHQgPSBgJHt0ZXh0fVxcbltwYXJ0PVwiJHthdHRyfVwiXSR7YnVja2V0fSB7XFxuXFx0JHtwYXJ0UHJvcHMuam9pbignXFxuXFx0Jyl9XFxufWA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGV4dDtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBwYXJ0IGF0dHJpYnV0ZSBpbnRvIGFuIGFycmF5IG9mIHBhcnQgaW5mb1xuICogQHBhcmFtIHsqfSBhdHRyIFBhcnQgYXR0cmlidXRlIHZhbHVlXG4gKiBAcmV0dXJucyB7YXJyYXl9IEFycmF5IG9mIHBhcnQgaW5mbyBvYmplY3RzIG9mIHRoZSBmb3JtIHtuYW1lLCBmb3dhcmR9XG4gKi9cbmZ1bmN0aW9uIHBhcnRJbmZvRnJvbUF0dHIoYXR0cikge1xuICBjb25zdCBwaWVjZXMgPSBhdHRyID8gYXR0ci5zcGxpdCgvXFxzKixcXHMqLykgOiBbXTtcbiAgbGV0IHBhcnRzID0gW107XG4gIHBpZWNlcy5mb3JFYWNoKHAgPT4ge1xuICAgIGNvbnN0IG0gPSBwID8gcC5tYXRjaCgvKFtePVxcc10qKSg/Olxccyo9PlxccyooLiopKT8vKSA6IFtdO1xuICAgIGlmIChtKSB7XG4gICAgICBwYXJ0cy5wdXNoKHtuYW1lOiBtWzJdIHx8IG1bMV0sIGZvcndhcmQ6IG1bMl0gPyBtWzFdIDogbnVsbH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwYXJ0cztcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiBwYXJ0IG5hbWUgcmV0dXJucyBhIHByb3BlcnRpZXMgb2JqZWN0IHdoaWNoIHNldHMgYW55IGFuY2VzdG9yXG4gKiBwcm92aWRlZCBwYXJ0IHByb3BlcnRpZXMgdG8gdGhlIHByb3BlciBhbmNlc3RvciBwcm92aWRlZCBjc3MgdmFyaWFibGUgbmFtZS5cbiAqIGUuZy5cbiAqIGNvbG9yOiBgdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO2BcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcGFydFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2l0aGluIHdoaWNoIGRvbSB3aXRoIHBhcnQgZXhpc3RzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIG9ubHkgOjp0aGVtZSBzaG91bGQgYmUgY29sbGVjdGVkLlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHByb3BlcnRpZXMgZm9yIHRoZSBnaXZlbiBwYXJ0IHNldCB0byBwYXJ0IHZhcmlhYmxlc1xuICogcHJvdmlkZWQgYnkgdGhlIGVsZW1lbnRzIGFuY2VzdG9ycy5cbiAqL1xuZnVuY3Rpb24gcHJvcHNGb3JQYXJ0KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xuICBjb25zdCBob3N0ID0gZWxlbWVudCAmJiBlbGVtZW50LmdldFJvb3ROb2RlKCkuaG9zdDtcbiAgaWYgKCFob3N0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGNvbGxlY3QgcHJvcHMgZnJvbSBob3N0IGVsZW1lbnQuXG4gIGxldCBwcm9wcyA9IHByb3BzRnJvbUVsZW1lbnQobmFtZSwgaG9zdCwgcmVxdWlyZVRoZW1lKTtcbiAgLy8gbm93IHJlY3Vyc2UgYW5jZXN0b3JzIHRvIGZpbmQgbWF0Y2hpbmcgYHRoZW1lYCBwcm9wZXJ0aWVzXG4gIGNvbnN0IHRoZW1lUHJvcHMgPSBwcm9wc0ZvclBhcnQobmFtZSwgaG9zdCwgdHJ1ZSk7XG4gIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCB0aGVtZVByb3BzKTtcbiAgLy8gbm93IHJlY3Vyc2UgYW5jZXN0b3JzIHRvIGZpbmQgKmZvcndhcmRlZCogcGFydCBwcm9wZXJ0aWVzXG4gIGlmICghcmVxdWlyZVRoZW1lKSB7XG4gICAgLy8gZm9yd2FyZGluZzogcmVjdXJzZXMgdXAgYW5jZXN0b3IgdHJlZSFcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3BhcnQnKSk7XG4gICAgLy8ge25hbWUsIGZvcndhcmR9IHdoZXJlIGAqYCBjYW4gYmUgaW5jbHVkZWRcbiAgICBwYXJ0SW5mby5mb3JFYWNoKGluZm8gPT4ge1xuICAgICAgbGV0IGNhdGNoQWxsID0gaW5mby5mb3J3YXJkICYmIChpbmZvLmZvcndhcmQuaW5kZXhPZignKicpID49IDApO1xuICAgICAgaWYgKG5hbWUgPT0gaW5mby5mb3J3YXJkIHx8IGNhdGNoQWxsKSB7XG4gICAgICAgIGNvbnN0IGFuY2VzdG9yTmFtZSA9IGNhdGNoQWxsID8gaW5mby5uYW1lLnJlcGxhY2UoJyonLCBuYW1lKSA6IGluZm8ubmFtZTtcbiAgICAgICAgY29uc3QgZm9yd2FyZGVkID0gcHJvcHNGb3JQYXJ0KGFuY2VzdG9yTmFtZSwgaG9zdCk7XG4gICAgICAgIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCBmb3J3YXJkZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHByb3BzO1xufVxuXG4vKipcbiAqIENvbGxlY3RzIGNzcyBmb3IgdGhlIGdpdmVuIG5hbWUgZnJvbSB0aGUgcGFydCBkYXRhIGZvciB0aGUgZ2l2ZW5cbiAqIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aXRoIHBhcnQgY3NzL2RhdGEuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIHNob3VsZCBvbmx5IG1hdGNoIDo6dGhlbWVcbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiBwcm9wZXJ0aWVzIGZvciB0aGUgZ2l2ZW4gcGFydCBzZXQgdG8gcGFydCB2YXJpYWJsZXNcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBwcm9wc0Zyb21FbGVtZW50KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xuICBsZXQgcHJvcHM7XG4gIGNvbnN0IHBhcnRzID0gcGFydERhdGFGb3JFbGVtZW50KGVsZW1lbnQpO1xuICBpZiAocGFydHMpIHtcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XG4gICAgaWYgKHBhcnRzKSB7XG4gICAgICBwYXJ0cy5mb3JFYWNoKChwYXJ0KSA9PiB7XG4gICAgICAgIGlmIChwYXJ0Lm5hbWUgPT0gbmFtZSAmJiAoIXJlcXVpcmVUaGVtZSB8fCBwYXJ0LmlzVGhlbWUpKSB7XG4gICAgICAgICAgcHJvcHMgPSBhZGRQYXJ0UHJvcHMocHJvcHMsIHBhcnQsIGlkLCBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9wcztcbn1cblxuLyoqXG4gKiBBZGQgcGFydCBjc3MgdG8gdGhlIHByb3BzIG9iamVjdCBmb3IgdGhlIGdpdmVuIHBhcnQvbmFtZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBPYmplY3QgY29udGFpbmluZyBwYXJ0IGNzc1xuICogQHBhcmFtIHtvYmplY3R9IHBhcnQgUGFydCBkYXRhXG4gKiBAcGFyYW0ge25tYmVyfSBpZCBlbGVtZW50IHBhcnQgaWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgcGFydFxuICovXG5mdW5jdGlvbiBhZGRQYXJ0UHJvcHMocHJvcHMsIHBhcnQsIGlkLCBuYW1lKSB7XG4gIHByb3BzID0gcHJvcHMgfHwge307XG4gIGNvbnN0IGJ1Y2tldCA9IHBhcnQuZW5kU2VsZWN0b3IgfHwgJyc7XG4gIGNvbnN0IGIgPSBwcm9wc1tidWNrZXRdID0gcHJvcHNbYnVja2V0XSB8fCB7fTtcbiAgZm9yIChsZXQgcCBpbiBwYXJ0LnByb3BzKSB7XG4gICAgYltwXSA9IGB2YXIoJHt2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwLCBwYXJ0LmVuZFNlbGVjdG9yKX0pYDtcbiAgfVxuICByZXR1cm4gcHJvcHM7XG59XG5cbmZ1bmN0aW9uIG1peFBhcnRQcm9wcyhhLCBiKSB7XG4gIGlmIChhICYmIGIpIHtcbiAgICBmb3IgKGxldCBpIGluIGIpIHtcbiAgICAgIC8vIGVuc3VyZSBzdG9yYWdlIGV4aXN0c1xuICAgICAgaWYgKCFhW2ldKSB7XG4gICAgICAgIGFbaV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5hc3NpZ24oYVtpXSwgYltpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhIHx8IGI7XG59XG5cbi8qKlxuICogQ3VzdG9tRWxlbWVudCBtaXhpbiB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIHByb3ZpZGUgOjpwYXJ0Lzo6dGhlbWUgc3VwcG9ydC5cbiAqIEBwYXJhbSB7Kn0gc3VwZXJDbGFzc1xuICovXG5leHBvcnQgbGV0IFBhcnRUaGVtZU1peGluID0gc3VwZXJDbGFzcyA9PiB7XG5cbiAgcmV0dXJuIGNsYXNzIFBhcnRUaGVtZUNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmIChzdXBlci5jb25uZWN0ZWRDYWxsYmFjaykge1xuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgfVxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX2FwcGx5UGFydFRoZW1lKCkpO1xuICAgIH1cblxuICAgIF9hcHBseVBhcnRUaGVtZSgpIHtcbiAgICAgIGFwcGx5UGFydFRoZW1lKHRoaXMpO1xuICAgIH1cblxuICB9XG5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRFdmVudHNcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XG5pbXBvcnQge1xuICAgIERlbW9zXG59IGZyb20gJy4vZGVtb3MuanMnO1xuaW1wb3J0IHtcbiAgICBYSG9zdCxcbiAgICBYUmF0aW5nLFxuICAgIFhUaHVtYnNcbn0gZnJvbSAnLi9wYXJ0VGhlbWUvY29tcG9uZW50cy1zYW1wbGUuanMnO1xuaW1wb3J0IHtcbiAgICBDb250cm9sUHJlelxufSBmcm9tICcuL2NvbnRyb2xQcmV6LmpzJztcbmltcG9ydCB7XG4gICAgVHlwZVRleHRcbn0gZnJvbSAnLi90eXBlZFRleHQuanMnXG5cblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cblxuICAgICAgICBuZXcgVHlwZVRleHQoKTtcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKCk7XG4gICAgICAgICAgICAvLyBuZXcgQ29udHJvbFByZXooKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0ZS1ob3VkaW5pLXdvcmtmbG93JywgKCkgPT4ge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsQmFja0ZyYWdtZW50KCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LXZpZGVvLW1hZ2ljJywgKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hZ2ljVmlkZW8nKS5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL21hZ2ljLmdpZic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC12aWRlby1zZW5zb3InLCAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Vuc29yVmlkZW8nKS5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL2dlbmVyaWMtc2Vuc29yLWFwaS5naWYnO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgVHlwZVRleHQge1xuXG5cdGNvbnN0cnVjdG9yKCl7XG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Nzcy12YXItdHlwZScsICgpPT57XG5cdFx0XHR0eXBpbmcoJ3RpdGxlLWNzcy12YXInLCAxMCwgMClcblx0XHRcdC50eXBlKCdDU1MgVmFyaWFibGVzJykud2FpdCgyMDAwKS5zcGVlZCg1MClcblx0XHRcdC5kZWxldGUoJ1ZhcmlhYmxlcycpLndhaXQoNTAwKS5zcGVlZCgxMDApXG5cdFx0XHQudHlwZSgnQ3VzdG9tIFByb3BlcnRpZXMnKTtcblx0XHR9KTtcblx0fVxufSJdfQ==
