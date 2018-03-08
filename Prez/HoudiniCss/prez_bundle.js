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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NvbnRyb2xQcmV6LmpzIiwic2NyaXB0cy9kZW1vcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlKcy5qcyIsInNjcmlwdHMvaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzL2hpZ2hsaWdodEV2ZW50LmpzIiwic2NyaXB0cy9saWJzL3RoaW5neS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzIiwic2NyaXB0cy9wYXJ0VGhlbWUvbGlicy9wYXJ0LXRoZW1lLmpzIiwic2NyaXB0cy9wcmV6LmpzIiwic2NyaXB0cy90eXBlZFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7Ozs7SUFJYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7O0FBQ1YsYUFBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUVBLGVBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXhDO0FBQ0g7Ozs7OENBRXFCO0FBQ2xCLGdCQUFJO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3RCO0FBQ0g7QUFDRCxvQkFBTSxTQUFTLG1CQUFXO0FBQ3RCLGdDQUFZO0FBRFUsaUJBQVgsQ0FBZjtBQUdBLHNCQUFNLE9BQU8sT0FBUCxFQUFOO0FBQ0EscUJBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLG9CQUFNLFVBQVUsTUFBTSxPQUFPLGVBQVAsRUFBdEI7QUFDQSxvQkFBTSxhQUFhLE1BQU0sYUFBYSxpQkFBYixFQUF6QjtBQUNBLG9CQUFJLGVBQWUsUUFBbkIsRUFBNkI7QUFDekIsNEJBQVEsR0FBUix5Q0FBa0QsUUFBUSxLQUExRDtBQUNILGlCQUZELE1BRU87QUFDSCw0QkFBUSxHQUFS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QzNDLFNBQU8sZUFBUCxFQUF3QixFQUF4QixFQUE0QixDQUE1QixFQUNDLElBREQsQ0FDTSxlQUROLEVBQ3VCLElBRHZCLENBQzRCLElBRDVCLEVBQ2tDLEtBRGxDLENBQ3dDLEVBRHhDLEVBRUMsTUFGRCxDQUVRLFdBRlIsRUFFcUIsSUFGckIsQ0FFMEIsR0FGMUIsRUFFK0IsS0FGL0IsQ0FFcUMsR0FGckMsRUFHQyxJQUhELENBR00sbUJBSE47QUFJQSxFQUxEO0FBTUEsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7XHJcbiAgICBUaGluZ3lcclxufSBmcm9tICcuL2xpYnMvdGhpbmd5LmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sUHJleiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnRoaW5neUNvbm5lY3RlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdGhpcy50aGluZ3lDb250cm9sLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHRoaW5neUNvbnRyb2woKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGhpbmd5Q29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdGhpbmd5ID0gbmV3IFRoaW5neSh7XHJcbiAgICAgICAgICAgICAgICBsb2dFbmFibGVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGluZ3kuY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRoaW5neUNvbm5lY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhdHRlcnkgPSBhd2FpdCB0aGluZ3kuZ2V0QmF0dGVyeUxldmVsKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBlcm1pc3Npb24gPSBhd2FpdCBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKTtcclxuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb24gPT09IFwiZGVuaWVkXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaGluZ3kgQ29ubmVjdCBhbmQgbGV2ZWwgYmF0dGVyeSA6ICR7YmF0dGVyeS52YWx1ZX1gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaGluZ3kgQ29ubmVjdCBhbmQgbGV2ZWwgYmF0dGVyeSA6ICR7YmF0dGVyeS52YWx1ZX1gLCBiYXR0ZXJ5KTtcclxuICAgICAgICAgICAgICAgIG5ldyBOb3RpZmljYXRpb24oXCJUaGluZ3kgQ29ubmVjdCAhIFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keTogYCBUaGluZ3kgQ29ubmVjdCBhbmQgbGV2ZWwgYmF0dGVyeSA6ICR7YmF0dGVyeS52YWx1ZX0lYFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBhd2FpdCB0aGluZ3kuYnV0dG9uRW5hYmxlKChzdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RhcCcsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0ZSk7XHJcblxyXG5cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCB7XHJcbiAgICBBcHBseUNzc1xyXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcclxuaW1wb3J0IHtcclxuICAgIEFwcGx5Q29kZU1pcm9yXHJcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlKcy5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVtb3Mge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFyKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFySW5KUygpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZGVtb1BhcnRUaGVtZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9Dc3NWYXIoKSB7XHJcbiAgICAgICAgLyoqICovXHJcbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcclxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudCBoMntcclxuICAgIC0tYS1zdXBlci12YXI6ICNGRkY7XHJcbn1cclxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XHJcblxyXG59XHJcbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xyXG5cclxufWBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vQ3NzVmFySW5KUygpIHtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZUggPSAtMTtcclxuICAgICAgICBsZXQgc3Vic2NyaWJlID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGNsaWVudFJlY3QgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3QgZ2hvc3RQYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtby1naG9zdC1wYXJlbnQnKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc01vdXNlKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWCA9IChjbGllbnRSZWN0LndpZHRoICsgY2xpZW50UmVjdC5sZWZ0KSAtIGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lZGlhbiA9IGNsaWVudFJlY3Qud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gZGVsdGFYID4gMCA/IChtZWRpYW4gLSBkZWx0YVgpIDogKG1lZGlhbiArICgtMSAqIGRlbHRhWCkpO1xyXG4gICAgICAgICAgICBnaG9zdFBhcmVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1sZWZ0LXBvcycsIGAke2xlZnR9cHhgKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYGRlbHRhWDogJHtkZWx0YVh9IC8gbWVkaWFuIDogJHttZWRpYW59IC8gd2lkdGggOiAke3dpZHRofSAvIGxlZnQgOiAke2xlZnR9YClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdnaG9zdC1zdGF0ZScsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBzdWJzY3JpYmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGluZGljZUggPSBSZXZlYWwuZ2V0SW5kaWNlcygpLmg7XHJcbiAgICAgICAgICAgICAgICBjbGllbnRSZWN0ID0gZ2hvc3RQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBnaG9zdFBhcmVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBwcm9jZXNzTW91c2UpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzdWJzY3JpYmUgJiYgaW5kaWNlSCAhPSBldmVudC5pbmRleGgpIHtcclxuICAgICAgICAgICAgICAgIGdob3N0UGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHByb2Nlc3NNb3VzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIG5ldyBBcHBseUNzcyhcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzLWluLWpzLWNzcycpLFxyXG4gICAgICAgICAgICBgI2RlbW8tZ2hvc3QtcGFyZW50IHtcclxuICAgIC0tbGVmdC1wb3M6IDA7XHJcbn1cclxuI2RlbW8tZ2hvc3QtcGFyZW50IC5kZW1vLXNoYWRvdyxcclxuI2RlbW8tZ2hvc3QtcGFyZW50IC5kZW1vLWdob3N0IHtcclxuICAgIGxlZnQ6IHZhcigtLWxlZnQtcG9zKTtcclxufWBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzLWluLWpzLWpzJyksXHJcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcclxuICAgICAgICAgICAgYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFYID0gdGhpcy53aWR0aCAtIGV2ZW50LmNsaWVudFg7XHJcbiAgICBjb25zdCBtZWRpYW4gPSB0aGlzLndpZHRoIC8gMjtcclxuICAgIGNvbnN0IGdob3N0UGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tZ2hvc3QtcGFyZW50Jyk7XHJcbiAgICBjb25zdCBsZWZ0ID0gZXZlbnQuY2xpZW50WCA+IG1lZGlhbiA/IChldmVudC5jbGllbnRYIC0gbWVkaWFuKSA6IC0xICogKG1lZGlhbiAtIGV2ZW50LmNsaWVudFgpO1xyXG5cclxuICAgIGdob3N0UGFyZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcG9zJywgXFxgXFwke2xlZnR9cHhcXGApO1xyXG59KTtgKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb1BhcnRUaGVtZSgpIHtcclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFydC1jc3MnKSxcclxuICAgICAgICAgICAgJ2NzcycsXHJcbiAgICAgICAgICAgIGB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbn1cclxuLnVubzpob3Zlcjo6cGFydChzdWJqZWN0KSB7XHJcbiAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xyXG59XHJcbi5kdW86OnBhcnQoc3ViamVjdCkge1xyXG4gICAgYmFja2dyb3VuZDogZ29sZGVucm9kO1xyXG59XHJcbi51bm86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XHJcbiAgICBiYWNrZ3JvdW5kOiBncmVlbjtcclxufVxyXG4udW5vOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XHJcbiAgICBiYWNrZ3JvdW5kOiB0b21hdG87XHJcbn1cclxuLmR1bzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcclxuICAgIGJhY2tncm91bmQ6IHllbGxvdztcclxufVxyXG4uZHVvOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XHJcbiAgICBiYWNrZ3JvdW5kOiBibGFjaztcclxufVxyXG54LXJhdGluZzo6dGhlbWUodGh1bWItdXApIHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxufVxyXG5gKTtcclxuXHJcbiAgICAgICAgbmV3IEFwcGx5Q29kZU1pcm9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhcnQtaHRtbCcpLFxyXG4gICAgICAgICAgICAndGV4dC9odG1sJyxcclxuICAgICAgICAgICAgYDx4LXRodW1icz5cclxuICAgICNzaGFkb3ctcm9vdFxyXG4gICAgPGRpdiBwYXJ0PVwidGh1bWItdXBcIj7wn5GNPC9kaXY+XHJcbiAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi1kb3duXCI+8J+RjjwvZGl2PlxyXG48L3gtdGh1bWJzPlxyXG48eC1yYXRpbmc+XHJcbiAgICAjc2hhZG93LXJvb3RcclxuICAgIDxkaXYgcGFydD1cInN1YmplY3RcIj48c2xvdD48L3Nsb3Q+PC9kaXY+XHJcbiAgICA8eC10aHVtYnMgcGFydD1cIiogPT4gcmF0aW5nLSpcIj48L3gtdGh1bWJzPlxyXG48L3gtcmF0aW5nPlxyXG5cclxuPHgtcmF0aW5nIGNsYXNzPVwidW5vXCI+4p2k77iPPC94LXJhdGluZz5cclxuPHgtcmF0aW5nIGNsYXNzPVwiZHVvXCI+8J+ktzwveC1yYXRpbmc+XHJcbmApO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vUGFpbnRBcGkoKSB7XHJcbiAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NpcmNsZS13b3JrbGV0LmpzJyk7XHJcblxyXG4gICAgICAgIG5ldyBBcHBseUNzcyhcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpLWNzcycpLFxyXG4gICAgICAgICAgICBgXHJcbiNyZW5kZXItZWxlbWVudC1wYWludC1hcGkge1xyXG4gICAgLS1jaXJjbGUtY29sb3I6ICNGRkY7XHJcbiAgICAtLXdpZHRoLWNpcmNsZTogMTAwcHg7XHJcbiAgICB3aWR0aDogdmFyKC0td2lkdGgtY2lyY2xlKTtcclxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSk7XHJcbn1cclxuXHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpJyksXHJcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcclxuICAgICAgICAgICAgYHBhaW50KGN0eCwgZ2VvbSwgcHJvcGVydGllcykge1xyXG4gICAgLy8gQ2hhbmdlIHRoZSBmaWxsIGNvbG9yLlxyXG4gICAgY29uc3QgY29sb3IgPSBwcm9wZXJ0aWVzLmdldCgnLS1jaXJjbGUtY29sb3InKS50b1N0cmluZygpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1cy5cclxuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWluKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIpO1xyXG4gICAgLy8gRHJhdyB0aGUgY2lyY2xlIFxcXFxvL1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyhnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyLCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgIGN0eC5maWxsKCk7XHJcbn1cclxuICAgICAgICAgICAgYCk7XHJcbiAgICB9XHJcblxyXG59IiwiJ3VzZSBzdGljdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvZGVNaXJyb3JDc3MgPSBDb2RlTWlycm9yKGVsdCwge1xyXG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXHJcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcclxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXHJcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcclxuICAgICAgICAgICAgdGhlbWU6ICdibGFja2JvYXJkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyhjb2RlTWlycm9yQ3NzLmdldFZhbHVlKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdGljdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBseUNvZGVNaXJvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9ySlMgPSBDb2RlTWlycm9yKGVsdCwge1xyXG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXHJcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcclxuICAgICAgICAgICAgdGhlbWU6ICdibGFja2JvYXJkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9ySlMuc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XHJcbiAgICB9XHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcclxuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNWVtJztcclxuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7XHJcbiAgICAgICAga2V5RWx0LFxyXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcclxuICAgIH0pIHtcclxuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xyXG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xyXG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcclxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcclxuICAgICAgICB9KTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uIGluIEpTXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUtaW4tanMnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjYwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzM1MHB4JyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzMwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gOjpQYXJ0XHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwYXJ0JyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFRlbXBsYXRlIEluc3RhbnRpYXRpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RlbXBsYXRlLWluc3RhbnRpYXRpb24nLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gSFRNTCBNb2R1bGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2h0bWwtbW9kdWxlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxMCxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBQYWludCBBUElcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BhaW50LWFwaScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIGdlbmVyaWMgc2Vuc29yXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdnZW5lcmljLXNlbnNvcicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBY2NlbGVyb21ldGVyIHNlbnNvclxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnYWNjZWxlcm9tZXRlci1zZW5zb3InLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDYsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIi8qKiAqL1xyXG5leHBvcnQgY2xhc3MgVGhpbmd5IHtcclxuICAvKipcclxuICAgICAqICBUaGluZ3k6NTIgV2ViIEJsdWV0b290aCBBUEkuIDxicj5cclxuICAgICAqICBCTEUgc2VydmljZSBkZXRhaWxzIHtAbGluayBodHRwczovL25vcmRpY3NlbWljb25kdWN0b3IuZ2l0aHViLmlvL05vcmRpYy1UaGluZ3k1Mi1GVy9kb2N1bWVudGF0aW9uL2Zpcm13YXJlX2FyY2hpdGVjdHVyZS5odG1sI2Z3X2FyY2hfYmxlX3NlcnZpY2VzIGhlcmV9XHJcbiAgICAgKlxyXG4gICAgICpcclxuICAgICAqICBAY29uc3RydWN0b3JcclxuICAgICAqICBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7bG9nRW5hYmxlZDogZmFsc2V9XSAtIE9wdGlvbnMgb2JqZWN0IGZvciBUaGluZ3lcclxuICAgICAqICBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbnMubG9nRW5hYmxlZCAtIEVuYWJsZXMgbG9nZ2luZyBvZiBhbGwgQkxFIGFjdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgKi9cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge2xvZ0VuYWJsZWQ6IGZhbHNlfSkge1xyXG4gICAgdGhpcy5sb2dFbmFibGVkID0gb3B0aW9ucy5sb2dFbmFibGVkO1xyXG5cclxuICAgIC8vIFRDUyA9IFRoaW5neSBDb25maWd1cmF0aW9uIFNlcnZpY2VcclxuICAgIHRoaXMuVENTX1VVSUQgPSBcImVmNjgwMTAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfTkFNRV9VVUlEID0gXCJlZjY4MDEwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX0FEVl9QQVJBTVNfVVVJRCA9IFwiZWY2ODAxMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRDU19DT05OX1BBUkFNU19VVUlEID0gXCJlZjY4MDEwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX0VERFlTVE9ORV9VVUlEID0gXCJlZjY4MDEwNS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVENTX0NMT1VEX1RPS0VOX1VVSUQgPSBcImVmNjgwMTA2LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfRldfVkVSX1VVSUQgPSBcImVmNjgwMTA3LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UQ1NfTVRVX1JFUVVFU1RfVVVJRCA9IFwiZWY2ODAxMDgtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcblxyXG4gICAgLy8gVEVTID0gVGhpbmd5IEVudmlyb25tZW50IFNlcnZpY2VcclxuICAgIHRoaXMuVEVTX1VVSUQgPSBcImVmNjgwMjAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfVEVNUF9VVUlEID0gXCJlZjY4MDIwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX1BSRVNTVVJFX1VVSUQgPSBcImVmNjgwMjAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5URVNfSFVNSURJVFlfVVVJRCA9IFwiZWY2ODAyMDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19HQVNfVVVJRCA9IFwiZWY2ODAyMDQtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRFU19DT0xPUl9VVUlEID0gXCJlZjY4MDIwNS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVEVTX0NPTkZJR19VVUlEID0gXCJlZjY4MDIwNi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuXHJcbiAgICAvLyBUVUlTID0gVGhpbmd5IFVzZXIgSW50ZXJmYWNlIFNlcnZpY2VcclxuICAgIHRoaXMuVFVJU19VVUlEID0gXCJlZjY4MDMwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFVJU19MRURfVVVJRCA9IFwiZWY2ODAzMDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRVSVNfQlROX1VVSUQgPSBcImVmNjgwMzAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UVUlTX1BJTl9VVUlEID0gXCJlZjY4MDMwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuXHJcbiAgICAvLyBUTVMgPSBUaGluZ3kgTW90aW9uIFNlcnZpY2VcclxuICAgIHRoaXMuVE1TX1VVSUQgPSBcImVmNjgwNDAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfQ09ORklHX1VVSUQgPSBcImVmNjgwNDAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfVEFQX1VVSUQgPSBcImVmNjgwNDAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfT1JJRU5UQVRJT05fVVVJRCA9IFwiZWY2ODA0MDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19RVUFURVJOSU9OX1VVSUQgPSBcImVmNjgwNDA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfU1RFUF9VVUlEID0gXCJlZjY4MDQwNS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX1JBV19VVUlEID0gXCJlZjY4MDQwNi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX0VVTEVSX1VVSUQgPSBcImVmNjgwNDA3LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG4gICAgdGhpcy5UTVNfUk9UX01BVFJJWF9VVUlEID0gXCJlZjY4MDQwOC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVE1TX0hFQURJTkdfVVVJRCA9IFwiZWY2ODA0MDktOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XHJcbiAgICB0aGlzLlRNU19HUkFWSVRZX1VVSUQgPSBcImVmNjgwNDBhLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xyXG5cclxuICAgIC8vIFRTUyA9IFRoaW5neSBTb3VuZCBTZXJ2aWNlXHJcbiAgICB0aGlzLlRTU19VVUlEID0gXCJlZjY4MDUwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFNTX0NPTkZJR19VVUlEID0gXCJlZjY4MDUwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFNTX1NQRUFLRVJfREFUQV9VVUlEID0gXCJlZjY4MDUwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFNTX1NQRUFLRVJfU1RBVF9VVUlEID0gXCJlZjY4MDUwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuICAgIHRoaXMuVFNTX01JQ19VVUlEID0gXCJlZjY4MDUwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcclxuXHJcbiAgICB0aGlzLnNlcnZpY2VVVUlEcyA9IFtcclxuICAgICAgXCJiYXR0ZXJ5X3NlcnZpY2VcIixcclxuICAgICAgdGhpcy5UQ1NfVVVJRCxcclxuICAgICAgdGhpcy5URVNfVVVJRCxcclxuICAgICAgdGhpcy5UVUlTX1VVSUQsXHJcbiAgICAgIHRoaXMuVE1TX1VVSUQsXHJcbiAgICAgIHRoaXMuVFNTX1VVSUQsXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMuYmxlSXNCdXN5ID0gZmFsc2U7XHJcbiAgICB0aGlzLmRldmljZTtcclxuICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xyXG4gICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcclxuICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLnNwZWFrZXJTdGF0dXNFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgICB0aGlzLm1pY3JvcGhvbmVFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgICAqICBNZXRob2QgdG8gcmVhZCBkYXRhIGZyb20gYSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljLlxyXG4gICAgICogIEltcGxlbWVudHMgYSBzaW1wbGUgc29sdXRpb24gdG8gYXZvaWQgc3RhcnRpbmcgbmV3IEdBVFQgcmVxdWVzdHMgd2hpbGUgYW5vdGhlciBpcyBwZW5kaW5nLlxyXG4gICAgICogIEFueSBhdHRlbXB0IHRvIHJlYWQgd2hpbGUgYW5vdGhlciBHQVRUIG9wZXJhdGlvbiBpcyBpbiBwcm9ncmVzcywgd2lsbCByZXN1bHQgaW4gYSByZWplY3RlZCBwcm9taXNlLlxyXG4gICAgICpcclxuICAgICAqICBAYXN5bmNcclxuICAgICAqICBAcGFyYW0ge09iamVjdH0gY2hhcmFjdGVyaXN0aWMgLSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljIG9iamVjdFxyXG4gICAgICogIEByZXR1cm4ge1Byb21pc2U8RGF0YVZpZXc+fSBSZXR1cm5zIFVpbnQ4QXJyYXkgd2hlbiByZXNvbHZlZCBvciBhbiBlcnJvciB3aGVuIHJlamVjdGVkXHJcbiAgICAgKlxyXG4gICAgICogIEBwcml2YXRlXHJcblxyXG4gICAgKi9cclxuICBhc3luYyBfcmVhZERhdGEoY2hhcmFjdGVyaXN0aWMpIHtcclxuICAgIGlmICghdGhpcy5ibGVJc0J1c3kpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB0aGlzLmJsZUlzQnVzeSA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgZGF0YUFycmF5ID0gYXdhaXQgY2hhcmFjdGVyaXN0aWMucmVhZFZhbHVlKCk7XHJcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGFBcnJheTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJHQVRUIG9wZXJhdGlvbiBhbHJlYWR5IHBlbmRpbmdcIikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIE1ldGhvZCB0byB3cml0ZSBkYXRhIHRvIGEgV2ViIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYy5cclxuICAgKiAgSW1wbGVtZW50cyBhIHNpbXBsZSBzb2x1dGlvbiB0byBhdm9pZCBzdGFydGluZyBuZXcgR0FUVCByZXF1ZXN0cyB3aGlsZSBhbm90aGVyIGlzIHBlbmRpbmcuXHJcbiAgICogIEFueSBhdHRlbXB0IHRvIHNlbmQgZGF0YSBkdXJpbmcgYW5vdGhlciBHQVRUIG9wZXJhdGlvbiB3aWxsIHJlc3VsdCBpbiBhIHJlamVjdGVkIHByb21pc2UuXHJcbiAgICogIE5vIHJldHJhbnNtaXNzaW9uIGlzIGltcGxlbWVudGVkIGF0IHRoaXMgbGV2ZWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBjaGFyYWN0ZXJpc3RpYyAtIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMgb2JqZWN0XHJcbiAgICogIEBwYXJhbSB7VWludDhBcnJheX0gZGF0YUFycmF5IC0gVHlwZWQgYXJyYXkgb2YgYnl0ZXMgdG8gc2VuZFxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlfVxyXG4gICAqXHJcbiAgICogIEBwcml2YXRlXHJcbiAgICpcclxuICAqL1xyXG4gIGFzeW5jIF93cml0ZURhdGEoY2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSkge1xyXG4gICAgaWYgKCF0aGlzLmJsZUlzQnVzeSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gdHJ1ZTtcclxuICAgICAgICBhd2FpdCBjaGFyYWN0ZXJpc3RpYy53cml0ZVZhbHVlKGRhdGFBcnJheSk7XHJcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSBmYWxzZTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkdBVFQgb3BlcmF0aW9uIGFscmVhZHkgcGVuZGluZ1wiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgQ29ubmVjdHMgdG8gVGhpbmd5LlxyXG4gICAqICBUaGUgZnVuY3Rpb24gc3RvcmVzIGFsbCBkaXNjb3ZlcmVkIHNlcnZpY2VzIGFuZCBjaGFyYWN0ZXJpc3RpY3MgdG8gdGhlIFRoaW5neSBvYmplY3QuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGFuIGVtcHR5IHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGNvbm5lY3QoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBTY2FuIGZvciBUaGluZ3lzXHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgU2Nhbm5pbmcgZm9yIGRldmljZXMgd2l0aCBzZXJ2aWNlIFVVSUQgZXF1YWwgdG8gJHt0aGlzLlRDU19VVUlEfWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRldmljZSA9IGF3YWl0IG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZSh7XHJcbiAgICAgICAgZmlsdGVyczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzZXJ2aWNlczogW3RoaXMuVENTX1VVSURdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIG9wdGlvbmFsU2VydmljZXM6IHRoaXMuc2VydmljZVVVSURzLFxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBGb3VuZCBUaGluZ3kgbmFtZWQgXCIke3RoaXMuZGV2aWNlLm5hbWV9XCIsIHRyeWluZyB0byBjb25uZWN0YCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENvbm5lY3QgdG8gR0FUVCBzZXJ2ZXJcclxuICAgICAgY29uc3Qgc2VydmVyID0gYXdhaXQgdGhpcy5kZXZpY2UuZ2F0dC5jb25uZWN0KCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgQ29ubmVjdGVkIHRvIFwiJHt0aGlzLmRldmljZS5uYW1lfVwiYCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEJhdHRlcnkgc2VydmljZVxyXG4gICAgICBjb25zdCBiYXR0ZXJ5U2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShcImJhdHRlcnlfc2VydmljZVwiKTtcclxuICAgICAgdGhpcy5iYXR0ZXJ5Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCBiYXR0ZXJ5U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyhcImJhdHRlcnlfbGV2ZWxcIik7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgYmF0dGVyeSBzZXJ2aWNlIGFuZCBiYXR0ZXJ5IGxldmVsIGNoYXJhY3RlcmlzdGljXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGluZ3kgY29uZmlndXJhdGlvbiBzZXJ2aWNlXHJcbiAgICAgIHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UQ1NfVVVJRCk7XHJcbiAgICAgIHRoaXMubmFtZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19OQU1FX1VVSUQpO1xyXG4gICAgICB0aGlzLmFkdlBhcmFtc0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19BRFZfUEFSQU1TX1VVSUQpO1xyXG4gICAgICB0aGlzLmNsb3VkVG9rZW5DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfQ0xPVURfVE9LRU5fVVVJRCk7XHJcbiAgICAgIHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19DT05OX1BBUkFNU19VVUlEKTtcclxuICAgICAgdGhpcy5lZGR5c3RvbmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfRUREWVNUT05FX1VVSUQpO1xyXG4gICAgICB0aGlzLmZpcm13YXJlVmVyc2lvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19GV19WRVJfVVVJRCk7XHJcbiAgICAgIHRoaXMubXR1UmVxdWVzdENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19NVFVfUkVRVUVTVF9VVUlEKTtcclxuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgY29uZmlndXJhdGlvbiBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGluZ3kgZW52aXJvbm1lbnQgc2VydmljZVxyXG4gICAgICB0aGlzLmVudmlyb25tZW50U2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRFU19VVUlEKTtcclxuICAgICAgdGhpcy50ZW1wZXJhdHVyZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfVEVNUF9VVUlEKTtcclxuICAgICAgdGhpcy5jb2xvckNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfQ09MT1JfVVVJRCk7XHJcbiAgICAgIHRoaXMuZ2FzQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19HQVNfVVVJRCk7XHJcbiAgICAgIHRoaXMuaHVtaWRpdHlDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0hVTUlESVRZX1VVSUQpO1xyXG4gICAgICB0aGlzLnByZXNzdXJlQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19QUkVTU1VSRV9VVUlEKTtcclxuICAgICAgdGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfQ09ORklHX1VVSUQpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSBlbnZpcm9ubWVudCBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGluZ3kgdXNlciBpbnRlcmZhY2Ugc2VydmljZVxyXG4gICAgICB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVFVJU19VVUlEKTtcclxuICAgICAgdGhpcy5idXR0b25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UVUlTX0JUTl9VVUlEKTtcclxuICAgICAgdGhpcy5sZWRDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UVUlTX0xFRF9VVUlEKTtcclxuICAgICAgdGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy51c2VySW50ZXJmYWNlU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRVSVNfUElOX1VVSUQpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb3ZlcmVkIFRoaW5neSB1c2VyIGludGVyZmFjZSBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGluZ3kgbW90aW9uIHNlcnZpY2VcclxuICAgICAgdGhpcy5tb3Rpb25TZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVE1TX1VVSUQpO1xyXG4gICAgICB0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0NPTkZJR19VVUlEKTtcclxuICAgICAgdGhpcy5ldWxlckNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0VVTEVSX1VVSUQpO1xyXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19HUkFWSVRZX1VVSUQpO1xyXG4gICAgICB0aGlzLmhlYWRpbmdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19IRUFESU5HX1VVSUQpO1xyXG4gICAgICB0aGlzLm9yaWVudGF0aW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfT1JJRU5UQVRJT05fVVVJRCk7XHJcbiAgICAgIHRoaXMucXVhdGVybmlvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1FVQVRFUk5JT05fVVVJRCk7XHJcbiAgICAgIHRoaXMubW90aW9uUmF3Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfUkFXX1VVSUQpO1xyXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfUk9UX01BVFJJWF9VVUlEKTtcclxuICAgICAgdGhpcy5zdGVwQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfU1RFUF9VVUlEKTtcclxuICAgICAgdGhpcy50YXBDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19UQVBfVVVJRCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IG1vdGlvbiBzZXJ2aWNlIGFuZCBpdHMgY2hhcmFjdGVyaXN0aWNzXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGluZ3kgc291bmQgc2VydmljZVxyXG4gICAgICB0aGlzLnNvdW5kU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRTU19VVUlEKTtcclxuICAgICAgdGhpcy50c3NDb25maWdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX0NPTkZJR19VVUlEKTtcclxuICAgICAgdGhpcy5taWNyb3Bob25lQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19NSUNfVVVJRCk7XHJcbiAgICAgIHRoaXMuc3BlYWtlckRhdGFDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX1NQRUFLRVJfREFUQV9VVUlEKTtcclxuICAgICAgdGhpcy5zcGVha2VyU3RhdHVzQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19TUEVBS0VSX1NUQVRfVVVJRCk7XHJcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IHNvdW5kIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBNZXRob2QgdG8gZGlzY29ubmVjdCBmcm9tIFRoaW5neS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYW4gZW1wdHkgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKi9cclxuICBhc3luYyBkaXNjb25uZWN0KCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgdGhpcy5kZXZpY2UuZ2F0dC5kaXNjb25uZWN0KCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2QgdG8gZW5hYmxlIGFuZCBkaXNhYmxlIG5vdGlmaWNhdGlvbnMgZm9yIGEgY2hhcmFjdGVyaXN0aWNcclxuICBhc3luYyBfbm90aWZ5Q2hhcmFjdGVyaXN0aWMoY2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgbm90aWZ5SGFuZGxlcikge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xyXG4gICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90aWZpY2F0aW9ucyBlbmFibGVkIGZvciBcIiArIGNoYXJhY3RlcmlzdGljLnV1aWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGFyYWN0ZXJpc3RpYy5hZGRFdmVudExpc3RlbmVyKFwiY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWRcIiwgbm90aWZ5SGFuZGxlcik7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLnN0b3BOb3RpZmljYXRpb25zKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJOb3RpZmljYXRpb25zIGRpc2FibGVkIGZvciBcIiwgY2hhcmFjdGVyaXN0aWMudXVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYXJhY3RlcmlzdGljLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZFwiLCBub3RpZnlIYW5kbGVyKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICBDb25maWd1cmF0aW9uIHNlcnZpY2UgICovXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIG5hbWUgb2YgdGhlIFRoaW5neSBkZXZpY2UuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBuYW1lIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0TmFtZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLm5hbWVDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKTtcclxuICAgICAgY29uc3QgbmFtZSA9IGRlY29kZXIuZGVjb2RlKGRhdGEpO1xyXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBkZXZpY2UgbmFtZTogXCIgKyBuYW1lKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmFtZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBuYW1lIG9mIHRoZSBUaGluZ3kgZGV2aWNlLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIHRoYXQgd2lsbCBiZSBnaXZlbiB0byB0aGUgVGhpbmd5LlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXROYW1lKG5hbWUpIHtcclxuICAgIGlmIChuYW1lLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIG5hbWUgY2FuJ3QgYmUgbW9yZSB0aGFuIDEwIGNoYXJhY3RlcnMgbG9uZy5cIikpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkobmFtZS5sZW5ndGgpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGJ5dGVBcnJheVtpXSA9IG5hbWUuY2hhckNvZGVBdChpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5uYW1lQ2hhcmFjdGVyaXN0aWMsIGJ5dGVBcnJheSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBhZHZlcnRpc2luZyBwYXJhbWV0ZXJzXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgYWR2ZXJ0aXNpbmcgcGFyYW1ldGVycyB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKi9cclxuICBhc3luYyBnZXRBZHZQYXJhbXMoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmFkdlBhcmFtc0NoYXJhY3RlcmlzdGljKTtcclxuXHJcbiAgICAgIC8vIEludGVydmFsIGlzIGdpdmVuIGluIHVuaXRzIG9mIDAuNjI1IG1pbGxpc2Vjb25kc1xyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBjb25zdCBpbnRlcnZhbCA9IChyZWNlaXZlZERhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbikgKiAwLjYyNSkudG9GaXhlZCgwKTtcclxuICAgICAgY29uc3QgdGltZW91dCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgyKTtcclxuICAgICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICAgIGludGVydmFsOiB7XHJcbiAgICAgICAgICBpbnRlcnZhbDogaW50ZXJ2YWwsXHJcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aW1lb3V0OiB7XHJcbiAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxyXG4gICAgICAgICAgdW5pdDogXCJzXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHBhcmFtcztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBhZHZlcnRpc2luZyBwYXJhbWV0ZXJzXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPYmplY3Qgd2l0aCBrZXkvdmFsdWUgcGFpcnMgJ2ludGVydmFsJyBhbmQgJ3RpbWVvdXQnOiA8Y29kZT57aW50ZXJ2YWw6IHNvbWVJbnRlcnZhbCwgdGltZW91dDogc29tZVRpbWVvdXR9PC9jb2RlPi5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5pbnRlcnZhbCAtIFRoZSBhZHZlcnRpc2luZyBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMgaW4gdGhlIHJhbmdlIG9mIDIwIG1zIHRvIDUgMDAwIG1zLlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLnRpbWVvdXQgLSBUaGUgYWR2ZXJ0aXNpbmcgdGltZW91dCBpbiBzZWNvbmRzIGluIHRoZSByYW5nZSAxIHMgdG8gMTgwIHMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldEFkdlBhcmFtcyhwYXJhbXMpIHtcclxuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiIHx8IHBhcmFtcy5pbnRlcnZhbCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy50aW1lb3V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoXCJUaGUgYXJndW1lbnQgaGFzIHRvIGJlIGFuIG9iamVjdCB3aXRoIGtleS92YWx1ZSBwYWlycyBpbnRlcnZhbCcgYW5kICd0aW1lb3V0Jzoge2ludGVydmFsOiBzb21lSW50ZXJ2YWwsIHRpbWVvdXQ6IHNvbWVUaW1lb3V0fVwiKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEludGVydmFsIGlzIGluIHVuaXRzIG9mIDAuNjI1IG1zLlxyXG4gICAgY29uc3QgaW50ZXJ2YWwgPSBwYXJhbXMuaW50ZXJ2YWwgKiAxLjY7XHJcbiAgICBjb25zdCB0aW1lb3V0ID0gcGFyYW1zLnRpbWVvdXQ7XHJcblxyXG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xyXG4gICAgaWYgKGludGVydmFsIDwgMzIgfHwgaW50ZXJ2YWwgPiA4MDAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBhZHZlcnRpc2luZyBpbnRlcnZhbCBtdXN0IGJlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgMjAgbXMgdG8gNSAwMDAgbXNcIikpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRpbWVvdXQgPCAwIHx8IHRpbWVvdXQgPiAxODApIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGFkdmVydGlzaW5nIHRpbWVvdXQgbXVzdCBiZSB3aXRoaW4gdGhlIHJhbmdlIG9mIDAgdG8gMTgwIHNcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDMpO1xyXG4gICAgZGF0YUFycmF5WzBdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgZGF0YUFycmF5WzFdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuICAgIGRhdGFBcnJheVsyXSA9IHRpbWVvdXQ7XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmFkdlBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgY29ubmVjdGlvbiBwYXJhbWV0ZXJzLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGNvbm5lY3Rpb24gcGFyYW1ldGVycyB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldENvbm5QYXJhbXMoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XHJcblxyXG4gICAgICAvLyBDb25uZWN0aW9uIGludGVydmFscyBhcmUgZ2l2ZW4gaW4gdW5pdHMgb2YgMS4yNSBtc1xyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBjb25zdCBtaW5Db25uSW50ZXJ2YWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbikgKiAxLjI1O1xyXG4gICAgICBjb25zdCBtYXhDb25uSW50ZXJ2YWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbikgKiAxLjI1O1xyXG4gICAgICBjb25zdCBzbGF2ZUxhdGVuY3kgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgICAvLyBTdXBlcnZpc2lvbiB0aW1lb3V0IGlzIGdpdmVuIGkgdW5pdHMgb2YgMTAgbXNcclxuICAgICAgY29uc3Qgc3VwZXJ2aXNpb25UaW1lb3V0ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pICogMTA7XHJcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgICBjb25uZWN0aW9uSW50ZXJ2YWw6IHtcclxuICAgICAgICAgIG1pbjogbWluQ29ubkludGVydmFsLFxyXG4gICAgICAgICAgbWF4OiBtYXhDb25uSW50ZXJ2YWwsXHJcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzbGF2ZUxhdGVuY3k6IHtcclxuICAgICAgICAgIHZhbHVlOiBzbGF2ZUxhdGVuY3ksXHJcbiAgICAgICAgICB1bml0OiBcIm51bWJlciBvZiBjb25uZWN0aW9uIGludGVydmFsc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VwZXJ2aXNpb25UaW1lb3V0OiB7XHJcbiAgICAgICAgICB0aW1lb3V0OiBzdXBlcnZpc2lvblRpbWVvdXQsXHJcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHBhcmFtcztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjb25uZWN0aW9uIGludGVydmFsXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDb25uZWN0aW9uIGludGVydmFsIG9iamVjdDogPGNvZGU+e21pbkludGVydmFsOiBzb21lVmFsdWUsIG1heEludGVydmFsOiBzb21lVmFsdWV9PC9jb2RlPlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm1pbkludGVydmFsIC0gVGhlIG1pbmltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgPj0gNy41IG1zLlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm1heEludGVydmFsIC0gVGhlIG1heGltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgPD0gNCAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldENvbm5JbnRlcnZhbChwYXJhbXMpIHtcclxuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiIHx8IHBhcmFtcy5taW5JbnRlcnZhbCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5tYXhJbnRlcnZhbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIGFyZ3VtZW50IGhhcyB0byBiZSBhbiBvYmplY3Q6IHttaW5JbnRlcnZhbDogdmFsdWUsIG1heEludGVydmFsOiB2YWx1ZX1cIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtaW5JbnRlcnZhbCA9IHBhcmFtcy5taW5JbnRlcnZhbDtcclxuICAgIGxldCBtYXhJbnRlcnZhbCA9IHBhcmFtcy5tYXhJbnRlcnZhbDtcclxuXHJcbiAgICBpZiAobWluSW50ZXJ2YWwgPT09IG51bGwgfHwgbWF4SW50ZXJ2YWwgPT09IG51bGwpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJCb3RoIG1pbmltdW0gYW5kIG1heGltdW0gYWNjZXB0YWJsZSBpbnRlcnZhbCBtdXN0IGJlIHBhc3NlZCBhcyBhcmd1bWVudHNcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcclxuICAgIGlmIChtaW5JbnRlcnZhbCA8IDcuNSB8fCBtaW5JbnRlcnZhbCA+IG1heEludGVydmFsKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcclxuICAgICAgICBuZXcgUmFuZ2VFcnJvcihcIlRoZSBtaW5pbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgbXVzdCBiZSBncmVhdGVyIHRoYW4gNy41IG1zIGFuZCA8PSBtYXhpbXVtIGludGVydmFsXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAobWF4SW50ZXJ2YWwgPiA0MDAwIHx8IG1heEludGVydmFsIDwgbWluSW50ZXJ2YWwpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxyXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIG1pbmltdW0gY29ubmVjdGlvbiBpbnRlcnZhbCBtdXN0IGJlIGxlc3MgdGhhbiA0IDAwMCBtcyBhbmQgPj0gbWluaW11bSBpbnRlcnZhbFwiKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOCk7XHJcblxyXG4gICAgICAvLyBJbnRlcnZhbCBpcyBpbiB1bml0cyBvZiAxLjI1IG1zLlxyXG4gICAgICBtaW5JbnRlcnZhbCA9IE1hdGgucm91bmQobWluSW50ZXJ2YWwgKiAwLjgpO1xyXG4gICAgICBtYXhJbnRlcnZhbCA9IE1hdGgucm91bmQobWF4SW50ZXJ2YWwgKiAwLjgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVswXSA9IG1pbkludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzFdID0gKG1pbkludGVydmFsID4+IDgpICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzJdID0gbWF4SW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbM10gPSAobWF4SW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHVwZGF0aW5nIGNvbm5lY3Rpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjb25uZWN0aW9uIHNsYXZlIGxhdGVuY3lcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHNsYXZlTGF0ZW5jeSAtIFRoZSBkZXNpcmVkIHNsYXZlIGxhdGVuY3kgaW4gdGhlIHJhbmdlIGZyb20gMCB0byA0OTkgY29ubmVjdGlvbiBpbnRlcnZhbHMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRDb25uU2xhdmVMYXRlbmN5KHNsYXZlTGF0ZW5jeSkge1xyXG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xyXG4gICAgaWYgKHNsYXZlTGF0ZW5jeSA8IDAgfHwgc2xhdmVMYXRlbmN5ID4gNDk5KSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcclxuICAgICAgICBuZXcgUmFuZ2VFcnJvcihcIlRoZSBzbGF2ZSBsYXRlbmN5IG11c3QgYmUgaW4gdGhlIHJhbmdlIGZyb20gMCB0byA0OTkgY29ubmVjdGlvbiBpbnRlcnZhbHMuXCIpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg4KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbNF0gPSBzbGF2ZUxhdGVuY3kgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbNV0gPSAoc2xhdmVMYXRlbmN5ID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiB1cGRhdGluZyBzbGF2ZSBsYXRlbmN5OiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBjb25uZWN0aW9uIHN1cGVydmlzaW9uIHRpbWVvdXRcclxuICAgKiAgPGI+Tm90ZTo8L2I+IEFjY29yZGluZyB0byB0aGUgQmx1ZXRvb3RoIExvdyBFbmVyZ3kgc3BlY2lmaWNhdGlvbiwgdGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIG11c3QgYmUgZ3JlYXRlclxyXG4gICAqICB0aGFuICgxICsgc2xhdmVMYXRlbmN5KSAqIG1heENvbm5JbnRlcnZhbCAqIDIsIHdoZXJlIG1heENvbm5JbnRlcnZhbCBpcyBhbHNvIGdpdmVuIGluIG1pbGxpc2Vjb25kcy5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgLSBUaGUgZGVzaXJlZCBjb25uZWN0aW9uIHN1cGVydmlzaW9uIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIGFuZCBpbiB0aGUgcmFuZ2Ugb2YgMTAwIG1zIHRvIDMyIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0Q29ublRpbWVvdXQodGltZW91dCkge1xyXG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xyXG4gICAgaWYgKHRpbWVvdXQgPCAxMDAgfHwgdGltZW91dCA+IDMyMDAwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IG11c3QgYmUgaW4gdGhlIHJhbmdlIGZyb20gMTAwIG1zIHRvIDMyIDAwMCBtcy5cIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IGhhcyB0byBiZSBzZXQgaW4gdW5pdHMgb2YgMTAgbXNcclxuICAgICAgdGltZW91dCA9IE1hdGgucm91bmQodGltZW91dCAvIDEwKTtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg4KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGF0IHRoZSB0aW1lb3V0IG9iZXlzICBjb25uX3N1cF90aW1lb3V0ICogNCA+ICgxICsgc2xhdmVfbGF0ZW5jeSkgKiBtYXhfY29ubl9pbnRlcnZhbFxyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBjb25zdCBtYXhDb25uSW50ZXJ2YWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IHNsYXZlTGF0ZW5jeSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgIGlmICh0aW1lb3V0ICogNCA8ICgxICsgc2xhdmVMYXRlbmN5KSAqIG1heENvbm5JbnRlcnZhbCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgbXVzdCBiZSBncmVhdGVyIHRoYW4gKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsICogMiwgd2hlcmUgbWF4Q29ubkludGVydmFsIGlzIGFsc28gZ2l2ZW4gaW4gbWlsbGlzZWNvbmRzLlwiKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs2XSA9IHRpbWVvdXQgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbN10gPSAodGltZW91dCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gdXBkYXRpbmcgdGhlIHN1cGVydmlzaW9uIHRpbWVvdXQ6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGNvbmZpZ3VyZWQgRWRkeXN0b25lIFVSTFxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPFVSTHxFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgVVJMIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0RWRkeXN0b25lVXJsKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lZGR5c3RvbmVDaGFyYWN0ZXJpc3RpYyk7XHJcblxyXG4gICAgICAvLyBBY2NvcmRpbmcgdG8gRWRkeXN0b25lIFVSTCBlbmNvZGluZyBzcGVjaWZpY2F0aW9uLCBjZXJ0YWluIGVsZW1lbnRzIGNhbiBiZSBleHBhbmRlZDogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9lZGR5c3RvbmUvdHJlZS9tYXN0ZXIvZWRkeXN0b25lLXVybFxyXG4gICAgICBjb25zdCBwcmVmaXhBcnJheSA9IFtcImh0dHA6Ly93d3cuXCIsIFwiaHR0cHM6Ly93d3cuXCIsIFwiaHR0cDovL1wiLCBcImh0dHBzOi8vXCJdO1xyXG4gICAgICBjb25zdCBleHBhbnNpb25Db2RlcyA9IFtcclxuICAgICAgICBcIi5jb20vXCIsXHJcbiAgICAgICAgXCIub3JnL1wiLFxyXG4gICAgICAgIFwiLmVkdS9cIixcclxuICAgICAgICBcIi5uZXQvXCIsXHJcbiAgICAgICAgXCIuaW5mby9cIixcclxuICAgICAgICBcIi5iaXovXCIsXHJcbiAgICAgICAgXCIuZ292L1wiLFxyXG4gICAgICAgIFwiLmNvbVwiLFxyXG4gICAgICAgIFwiLm9yZ1wiLFxyXG4gICAgICAgIFwiLmVkdVwiLFxyXG4gICAgICAgIFwiLm5ldFwiLFxyXG4gICAgICAgIFwiLmluZm9cIixcclxuICAgICAgICBcIi5iaXpcIixcclxuICAgICAgICBcIi5nb3ZcIixcclxuICAgICAgXTtcclxuICAgICAgY29uc3QgcHJlZml4ID0gcHJlZml4QXJyYXlbcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDApXTtcclxuICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpO1xyXG4gICAgICBsZXQgdXJsID0gZGVjb2Rlci5kZWNvZGUocmVjZWl2ZWREYXRhKTtcclxuICAgICAgdXJsID0gcHJlZml4ICsgdXJsLnNsaWNlKDEpO1xyXG5cclxuICAgICAgZXhwYW5zaW9uQ29kZXMuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xyXG4gICAgICAgIGlmICh1cmwuaW5kZXhPZihTdHJpbmcuZnJvbUNoYXJDb2RlKGkpKSAhPT0gLTEpIHtcclxuICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKFN0cmluZy5mcm9tQ2hhckNvZGUoaSksIGV4cGFuc2lvbkNvZGVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBVUkwodXJsKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBFZGR5c3RvbmUgVVJMXHJcbiAgICogIEl0J3MgcmVjb21tZWVuZGVkIHRvIHVzZSBVUkwgc2hvcnRlbmVyIHRvIHN0YXkgd2l0aGluIHRoZSBsaW1pdCBvZiAxNCBjaGFyYWN0ZXJzIGxvbmcgVVJMXHJcbiAgICogIFVSTCBzY2hlbWUgcHJlZml4IHN1Y2ggYXMgXCJodHRwczovL1wiIGFuZCBcImh0dHBzOi8vd3d3LlwiIGRvIG5vdCBjb3VudCB0b3dhcmRzIHRoYXQgbGltaXQsXHJcbiAgICogIG5laXRoZXIgZG9lcyBleHBhbnNpb24gY29kZXMgc3VjaCBhcyBcIi5jb20vXCIgYW5kIFwiLm9yZ1wiLlxyXG4gICAqICBGdWxsIGRldGFpbHMgaW4gdGhlIEVkZHlzdG9uZSBVUkwgc3BlY2lmaWNhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9lZGR5c3RvbmUvdHJlZS9tYXN0ZXIvZWRkeXN0b25lLXVybFxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge3N0cmluZ30gdXJsU3RyaW5nIC0gVGhlIFVSTCB0aGF0IHNob3VsZCBiZSBicm9hZGNhc3RlZC5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0RWRkeXN0b25lVXJsKHVybFN0cmluZykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gVXNlcyBVUkwgQVBJIHRvIGNoZWNrIGZvciB2YWxpZCBVUkxcclxuICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh1cmxTdHJpbmcpO1xyXG5cclxuICAgICAgLy8gRWRkeXN0b25lIFVSTCBzcGVjaWZpY2F0aW9uIGRlZmluZXMgY29kZXMgZm9yIFVSTCBzY2hlbWUgcHJlZml4ZXMgYW5kIGV4cGFuc2lvbiBjb2RlcyBpbiB0aGUgVVJMLlxyXG4gICAgICAvLyBUaGUgYXJyYXkgaW5kZXggY29ycmVzcG9uZHMgdG8gdGhlIGRlZmluZWQgY29kZSBpbiB0aGUgc3BlY2lmaWNhdGlvbi5cclxuICAgICAgLy8gRGV0YWlscyBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXHJcbiAgICAgIGNvbnN0IHByZWZpeEFycmF5ID0gW1wiaHR0cDovL3d3dy5cIiwgXCJodHRwczovL3d3dy5cIiwgXCJodHRwOi8vXCIsIFwiaHR0cHM6Ly9cIl07XHJcbiAgICAgIGNvbnN0IGV4cGFuc2lvbkNvZGVzID0gW1xyXG4gICAgICAgIFwiLmNvbS9cIixcclxuICAgICAgICBcIi5vcmcvXCIsXHJcbiAgICAgICAgXCIuZWR1L1wiLFxyXG4gICAgICAgIFwiLm5ldC9cIixcclxuICAgICAgICBcIi5pbmZvL1wiLFxyXG4gICAgICAgIFwiLmJpei9cIixcclxuICAgICAgICBcIi5nb3YvXCIsXHJcbiAgICAgICAgXCIuY29tXCIsXHJcbiAgICAgICAgXCIub3JnXCIsXHJcbiAgICAgICAgXCIuZWR1XCIsXHJcbiAgICAgICAgXCIubmV0XCIsXHJcbiAgICAgICAgXCIuaW5mb1wiLFxyXG4gICAgICAgIFwiLmJpelwiLFxyXG4gICAgICAgIFwiLmdvdlwiLFxyXG4gICAgICBdO1xyXG4gICAgICBsZXQgcHJlZml4Q29kZSA9IG51bGw7XHJcbiAgICAgIGxldCBleHBhbnNpb25Db2RlID0gbnVsbDtcclxuICAgICAgbGV0IGVkZHlzdG9uZVVybCA9IHVybC5ocmVmO1xyXG4gICAgICBsZXQgbGVuID0gZWRkeXN0b25lVXJsLmxlbmd0aDtcclxuXHJcbiAgICAgIHByZWZpeEFycmF5LmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcclxuICAgICAgICBpZiAodXJsLmhyZWYuaW5kZXhPZihlbGVtZW50KSAhPT0gLTEgJiYgcHJlZml4Q29kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgcHJlZml4Q29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XHJcbiAgICAgICAgICBlZGR5c3RvbmVVcmwgPSBlZGR5c3RvbmVVcmwucmVwbGFjZShlbGVtZW50LCBwcmVmaXhDb2RlKTtcclxuICAgICAgICAgIGxlbiAtPSBlbGVtZW50Lmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZXhwYW5zaW9uQ29kZXMuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xyXG4gICAgICAgIGlmICh1cmwuaHJlZi5pbmRleE9mKGVsZW1lbnQpICE9PSAtMSAmJiBleHBhbnNpb25Db2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgICBleHBhbnNpb25Db2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcclxuICAgICAgICAgIGVkZHlzdG9uZVVybCA9IGVkZHlzdG9uZVVybC5yZXBsYWNlKGVsZW1lbnQsIGV4cGFuc2lvbkNvZGUpO1xyXG4gICAgICAgICAgbGVuIC09IGVsZW1lbnQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAobGVuIDwgMSB8fCBsZW4gPiAxNCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIFVSTCBjYW4ndCBiZSBsb25nZXIgdGhhbiAxNCBjaGFyYWN0ZXJzLCBleGNsdWRpbmcgVVJMIHNjaGVtZSBzdWNoIGFzIFxcXCJodHRwczovL1xcXCIgYW5kIFxcXCIuY29tL1xcXCIuXCIpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoZWRkeXN0b25lVXJsLmxlbmd0aCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVkZHlzdG9uZVVybC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGJ5dGVBcnJheVtpXSA9IGVkZHlzdG9uZVVybC5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMuZWRkeXN0b25lQ2hhcmFjdGVyaXN0aWMsIGJ5dGVBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGNvbmZpZ3VyZWQgY2xvdWQgdG9rZW4uXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBjbG91ZCB0b2tlbiB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldENsb3VkVG9rZW4oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNsb3VkVG9rZW5DaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKTtcclxuICAgICAgY29uc3QgdG9rZW4gPSBkZWNvZGVyLmRlY29kZShyZWNlaXZlZERhdGEpO1xyXG5cclxuICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIGNsb3VkIHRva2VuLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUaGUgY2xvdWQgdG9rZW4gdG8gYmUgc3RvcmVkLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRDbG91ZFRva2VuKHRva2VuKSB7XHJcbiAgICBpZiAodG9rZW4ubGVuZ3RoID4gMjUwKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgY2xvdWQgdG9rZW4gY2FuIG5vdCBleGNlZWQgMjUwIGNoYXJhY3RlcnMuXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKFwidXRmLThcIikuZW5jb2RlKHRva2VuKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMuY2xvdWRUb2tlbkNoYXJhY3RlcmlzdGljLCBlbmNvZGVyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IE1heGltYWwgVHJhbnNtaXNzaW9uIFVuaXQgKE1UVSlcclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxudW1iZXJ8RXJyb3I+fSBSZXR1cm5zIHRoZSBNVFUgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRNdHUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLm10dVJlcXVlc3RDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICAgIGNvbnN0IG10dSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMSwgbGl0dGxlRW5kaWFuKTtcclxuXHJcbiAgICAgIHJldHVybiBtdHU7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgY3VycmVudCBNYXhpbWFsIFRyYW5zbWlzc2lvbiBVbml0IChNVFUpXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zID0ge3BlcmlwaGVyYWxSZXF1ZXN0OiB0cnVlfV0gLSBNVFUgc2V0dGluZ3Mgb2JqZWN0OiB7bXR1U2l6ZTogdmFsdWUsIHBlcmlwaGVyYWxSZXF1ZXN0OiB2YWx1ZX0sIHdoZXJlIHBlcmlwaGVyYWxSZXF1ZXN0IGlzIG9wdGlvbmFsLlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm10dVNpemUgLSBUaGUgZGVzaXJlZCBNVFUgc2l6ZS5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBwYXJhbXMucGVyaXBoZXJhbFJlcXVlc3QgLSBPcHRpb25hbC4gU2V0IHRvIDxjb2RlPnRydWU8L2NvZGU+IGlmIHBlcmlwaGVyYWwgc2hvdWxkIHNlbmQgYW4gTVRVIGV4Y2hhbmdlIHJlcXVlc3QuIERlZmF1bHQgaXMgPGNvZGU+dHJ1ZTwvY29kZT47XHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldE10dShwYXJhbXMpIHtcclxuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiIHx8IHBhcmFtcy5tdHVTaXplID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgYXJndW1lbnQgaGFzIHRvIGJlIGFuIG9iamVjdFwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbXR1U2l6ZSA9IHBhcmFtcy5tdHVTaXplO1xyXG4gICAgY29uc3QgcGVyaXBoZXJhbFJlcXVlc3QgPSBwYXJhbXMucGVyaXBoZXJhbFJlcXVlc3QgfHwgdHJ1ZTtcclxuXHJcbiAgICBpZiAobXR1U2l6ZSA8IDIzIHx8IG10dVNpemUgPiAyNzYpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk1UVSBzaXplIG11c3QgYmUgaW4gcmFuZ2UgMjMgLSAyNzYgYnl0ZXNcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDMpO1xyXG4gICAgZGF0YUFycmF5WzBdID0gcGVyaXBoZXJhbFJlcXVlc3QgPyAxIDogMDtcclxuICAgIGRhdGFBcnJheVsxXSA9IG10dVNpemUgJiAweGZmO1xyXG4gICAgZGF0YUFycmF5WzJdID0gKG10dVNpemUgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5tdHVSZXF1ZXN0Q2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBmaXJtd2FyZSB2ZXJzaW9uLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPHN0cmluZ3xFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgZmlybXdhcmUgdmVyc2lvbiBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRGaXJtd2FyZVZlcnNpb24oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmZpcm13YXJlVmVyc2lvbkNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbWFqb3IgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMCk7XHJcbiAgICAgIGNvbnN0IG1pbm9yID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDEpO1xyXG4gICAgICBjb25zdCBwYXRjaCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgyKTtcclxuICAgICAgY29uc3QgdmVyc2lvbiA9IGB2JHttYWpvcn0uJHttaW5vcn0uJHtwYXRjaH1gO1xyXG5cclxuICAgICAgcmV0dXJuIHZlcnNpb247XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAgKioqKioqICAvL1xyXG5cclxuICAvKiAgRW52aXJvbm1lbnQgc2VydmljZSAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBvZiB0aGUgVGhpbmd5IGVudmlyb25tZW50IG1vZHVsZS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGFuIGVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdoZW4gcHJvbWlzZSByZXNvbHZlcywgb3IgYW4gZXJyb3IgaWYgcmVqZWN0ZWQuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRFbnZpcm9ubWVudENvbmZpZygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBjb25zdCB0ZW1wSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBwcmVzc3VyZUludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3QgaHVtaWRpdHlJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IGNvbG9ySW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBnYXNNb2RlID0gZGF0YS5nZXRVaW50OCg4KTtcclxuICAgICAgY29uc3QgY29sb3JTZW5zb3JSZWQgPSBkYXRhLmdldFVpbnQ4KDkpO1xyXG4gICAgICBjb25zdCBjb2xvclNlbnNvckdyZWVuID0gZGF0YS5nZXRVaW50OCgxMCk7XHJcbiAgICAgIGNvbnN0IGNvbG9yU2Vuc29yQmx1ZSA9IGRhdGEuZ2V0VWludDgoMTEpO1xyXG4gICAgICBjb25zdCBjb25maWcgPSB7XHJcbiAgICAgICAgdGVtcEludGVydmFsOiB0ZW1wSW50ZXJ2YWwsXHJcbiAgICAgICAgcHJlc3N1cmVJbnRlcnZhbDogcHJlc3N1cmVJbnRlcnZhbCxcclxuICAgICAgICBodW1pZGl0eUludGVydmFsOiBodW1pZGl0eUludGVydmFsLFxyXG4gICAgICAgIGNvbG9ySW50ZXJ2YWw6IGNvbG9ySW50ZXJ2YWwsXHJcbiAgICAgICAgZ2FzTW9kZTogZ2FzTW9kZSxcclxuICAgICAgICBjb2xvclNlbnNvclJlZDogY29sb3JTZW5zb3JSZWQsXHJcbiAgICAgICAgY29sb3JTZW5zb3JHcmVlbjogY29sb3JTZW5zb3JHcmVlbixcclxuICAgICAgICBjb2xvclNlbnNvckJsdWU6IGNvbG9yU2Vuc29yQmx1ZSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBnZXR0aW5nIGVudmlyb25tZW50IHNlbnNvcnMgY29uZmlndXJhdGlvbnM6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIHRlbXBlcmF0dXJlIG1lYXN1cmVtZW50IHVwZGF0ZSBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGVtcGVyYXR1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA2MCAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldFRlbXBlcmF0dXJlSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDUwIHx8IGludGVydmFsID4gNjAwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgdGVtcGVyYXR1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbMF0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVsxXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHRlbXBlcmF0dXJlIHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgcHJlc3N1cmUgbWVhc3VyZW1lbnQgdXBkYXRlIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUaGUgcHJlc3N1cmUgc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDUwIG1zIHRvIDYwIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0UHJlc3N1cmVJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgNTAgfHwgaW50ZXJ2YWwgPiA2MDAwMCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBwcmVzc3VyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVsyXSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzNdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgcHJlc3N1cmUgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBodW1pZGl0eSBtZWFzdXJlbWVudCB1cGRhdGUgaW50ZXJ2YWwuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIEh1bWlkaXR5IHNlbnNvciBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA2MCAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldEh1bWlkaXR5SW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGh1bWlkaXR5IHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbCBtdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgLSA2MCAwMDAgbXNcIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbNF0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs1XSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGh1bWlkaXR5IHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgY29sb3Igc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gQ29sb3Igc2Vuc29yIHNhbXBsaW5nIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMjAwIG1zIHRvIDYwIDAwMCBtcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0Q29sb3JJbnRlcnZhbChpbnRlcnZhbCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGludGVydmFsIDwgMjAwIHx8IGludGVydmFsID4gNjAwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgY29sb3Igc2Vuc29yIHNhbXBsaW5nIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDIwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs2XSA9IGludGVydmFsICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzddID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgY29sb3Igc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgZ2FzIHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUaGUgZ2FzIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgaW4gc2Vjb25kcy4gQWxsb3dlZCB2YWx1ZXMgYXJlIDEsIDEwLCBhbmQgNjAgc2Vjb25kcy5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0R2FzSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBtb2RlO1xyXG5cclxuICAgICAgaWYgKGludGVydmFsID09PSAxKSB7XHJcbiAgICAgICAgbW9kZSA9IDE7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPT09IDEwKSB7XHJcbiAgICAgICAgbW9kZSA9IDI7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJ2YWwgPT09IDYwKSB7XHJcbiAgICAgICAgbW9kZSA9IDM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGdhcyBzZW5zb3IgaW50ZXJ2YWwgaGFzIHRvIGJlIDEsIDEwIG9yIDYwIHNlY29uZHMuXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzhdID0gbW9kZTtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgZ2FzIHNlbnNvciBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgQ29uZmlndXJlcyBjb2xvciBzZW5zb3IgTEVEIGNhbGlicmF0aW9uIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSByZWQgLSBUaGUgcmVkIGludGVuc2l0eSwgcmFuZ2luZyBmcm9tIDAgdG8gMjU1LlxyXG4gICAqICBAcGFyYW0ge051bWJlcn0gZ3JlZW4gLSBUaGUgZ3JlZW4gaW50ZW5zaXR5LCByYW5naW5nIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBibHVlIC0gVGhlIGJsdWUgaW50ZW5zaXR5LCByYW5naW5nIGZyb20gMCB0byAyNTUuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGNvbG9yU2Vuc29yQ2FsaWJyYXRlKHJlZCwgZ3JlZW4sIGJsdWUpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTIpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs5XSA9IHJlZDtcclxuICAgICAgZGF0YUFycmF5WzEwXSA9IGdyZWVuO1xyXG4gICAgICBkYXRhQXJyYXlbMTFdID0gYmx1ZTtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgY29sb3Igc2Vuc29yIHBhcmFtZXRlcnM6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgdGVtcGVyYXR1cmUgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgdGVtcGVyYXR1cmUgb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHRlbXBlcmF0dXJlRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fdGVtcGVyYXR1cmVOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnRlbXBFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMudGVtcGVyYXR1cmVDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfdGVtcGVyYXR1cmVOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgaW50ZWdlciA9IGRhdGEuZ2V0VWludDgoMCk7XHJcbiAgICBjb25zdCBkZWNpbWFsID0gZGF0YS5nZXRVaW50OCgxKTtcclxuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gaW50ZWdlciArIGRlY2ltYWwgLyAxMDA7XHJcbiAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB2YWx1ZTogdGVtcGVyYXR1cmUsXHJcbiAgICAgICAgdW5pdDogXCJDZWxzaXVzXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgRW5hYmxlcyBwcmVzc3VyZSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBwcmVzc3VyZSBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgcHJlc3N1cmVFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fcHJlc3N1cmVOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMucHJlc3N1cmVDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX3ByZXNzdXJlTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICBjb25zdCBpbnRlZ2VyID0gZGF0YS5nZXRVaW50MzIoMCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IGRlY2ltYWwgPSBkYXRhLmdldFVpbnQ4KDQpO1xyXG4gICAgY29uc3QgcHJlc3N1cmUgPSBpbnRlZ2VyICsgZGVjaW1hbCAvIDEwMDtcclxuICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB2YWx1ZTogcHJlc3N1cmUsXHJcbiAgICAgICAgdW5pdDogXCJoUGFcIixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIGh1bWlkaXR5IG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGh1bWlkaXR5IG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBodW1pZGl0eUVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9odW1pZGl0eU5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmh1bWlkaXR5Q2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9odW1pZGl0eU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBodW1pZGl0eSA9IGRhdGEuZ2V0VWludDgoMCk7XHJcbiAgICB0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgdmFsdWU6IGh1bWlkaXR5LFxyXG4gICAgICAgIHVuaXQ6IFwiJVwiLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgZ2FzIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGdhcyBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ2FzRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9nYXNOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5nYXNFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuZ2FzQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5nYXNFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG4gIF9nYXNOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgIGNvbnN0IGVjbzIgPSBkYXRhLmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgdHZvYyA9IGRhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XHJcblxyXG4gICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICBlQ08yOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZWNvMixcclxuICAgICAgICAgIHVuaXQ6IFwicHBtXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBUVk9DOiB7XHJcbiAgICAgICAgICB2YWx1ZTogdHZvYyxcclxuICAgICAgICAgIHVuaXQ6IFwicHBiXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIGNvbG9yIHNlbnNvciBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBjb2xvciBzZW5zb3Igb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGNvbG9yRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2NvbG9yTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmNvbG9yQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9jb2xvck5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgY29uc3QgciA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCBnID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcclxuICAgIGNvbnN0IGIgPSBkYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgY29uc3QgYyA9IGRhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCByUmF0aW8gPSByIC8gKHIgKyBnICsgYik7XHJcbiAgICBjb25zdCBnUmF0aW8gPSBnIC8gKHIgKyBnICsgYik7XHJcbiAgICBjb25zdCBiUmF0aW8gPSBiIC8gKHIgKyBnICsgYik7XHJcbiAgICBjb25zdCBjbGVhckF0QmxhY2sgPSAzMDA7XHJcbiAgICBjb25zdCBjbGVhckF0V2hpdGUgPSA0MDA7XHJcbiAgICBjb25zdCBjbGVhckRpZmYgPSBjbGVhckF0V2hpdGUgLSBjbGVhckF0QmxhY2s7XHJcbiAgICBsZXQgY2xlYXJOb3JtYWxpemVkID0gKGMgLSBjbGVhckF0QmxhY2spIC8gY2xlYXJEaWZmO1xyXG5cclxuICAgIGlmIChjbGVhck5vcm1hbGl6ZWQgPCAwKSB7XHJcbiAgICAgIGNsZWFyTm9ybWFsaXplZCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlZCA9IHJSYXRpbyAqIDI1NS4wICogMyAqIGNsZWFyTm9ybWFsaXplZDtcclxuXHJcbiAgICBpZiAocmVkID4gMjU1KSB7XHJcbiAgICAgIHJlZCA9IDI1NTtcclxuICAgIH1cclxuICAgIGxldCBncmVlbiA9IGdSYXRpbyAqIDI1NS4wICogMyAqIGNsZWFyTm9ybWFsaXplZDtcclxuXHJcbiAgICBpZiAoZ3JlZW4gPiAyNTUpIHtcclxuICAgICAgZ3JlZW4gPSAyNTU7XHJcbiAgICB9XHJcbiAgICBsZXQgYmx1ZSA9IGJSYXRpbyAqIDI1NS4wICogMyAqIGNsZWFyTm9ybWFsaXplZDtcclxuXHJcbiAgICBpZiAoYmx1ZSA+IDI1NSkge1xyXG4gICAgICBibHVlID0gMjU1O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29sb3JFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICByZWQ6IHJlZC50b0ZpeGVkKDApLFxyXG4gICAgICAgIGdyZWVuOiBncmVlbi50b0ZpeGVkKDApLFxyXG4gICAgICAgIGJsdWU6IGJsdWUudG9GaXhlZCgwKSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICAqKioqKiogIC8vXHJcbiAgLyogIFVzZXIgaW50ZXJmYWNlIHNlcnZpY2UgICovXHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IExFRCBzZXR0aW5ncyBmcm9tIHRoZSBUaGluZ3kgZGV2aWNlLiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHN0cnVjdHVyZSB0aGF0IGRlcGVuZHMgb24gdGhlIHNldHRpbmdzLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdD59IFJldHVybnMgYSBMRUQgc3RhdHVzIG9iamVjdC4gVGhlIGNvbnRlbnQgYW5kIHN0cnVjdHVyZSBkZXBlbmRzIG9uIHRoZSBjdXJyZW50IG1vZGUuXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBnZXRMZWRTdGF0dXMoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5sZWRDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IG1vZGUgPSBkYXRhLmdldFVpbnQ4KDApO1xyXG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xyXG4gICAgICBsZXQgc3RhdHVzO1xyXG5cclxuICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBzdGF0dXMgPSB7TEVEc3RhdHVzOiB7bW9kZTogbW9kZX19O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgc3RhdHVzID0ge1xyXG4gICAgICAgICAgbW9kZTogbW9kZSxcclxuICAgICAgICAgIHI6IGRhdGEuZ2V0VWludDgoMSksXHJcbiAgICAgICAgICBnOiBkYXRhLmdldFVpbnQ4KDIpLFxyXG4gICAgICAgICAgYjogZGF0YS5nZXRVaW50OCgzKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgc3RhdHVzID0ge1xyXG4gICAgICAgICAgbW9kZTogbW9kZSxcclxuICAgICAgICAgIGNvbG9yOiBkYXRhLmdldFVpbnQ4KDEpLFxyXG4gICAgICAgICAgaW50ZW5zaXR5OiBkYXRhLmdldFVpbnQ4KDIpLFxyXG4gICAgICAgICAgZGVsYXk6IGRhdGEuZ2V0VWludDE2KDMsIGxpdHRsZUVuZGlhbiksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgIHN0YXR1cyA9IHtcclxuICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICBjb2xvcjogZGF0YS5nZXRVaW50OCgxKSxcclxuICAgICAgICAgIGludGVuc2l0eTogZGF0YS5nZXRVaW50OCgyKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzdGF0dXM7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBnZXR0aW5nIFRoaW5neSBMRUQgc3RhdHVzOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9sZWRTZXQoZGF0YUFycmF5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMubGVkQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgTEVEIGluIGNvbnN0YW50IG1vZGUgd2l0aCB0aGUgc3BlY2lmaWVkIFJHQiBjb2xvci5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IGNvbG9yIC0gQ29sb3Igb2JqZWN0IHdpdGggUkdCIHZhbHVlc1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gY29sb3IucmVkIC0gVGhlIHZhbHVlIGZvciByZWQgY29sb3IgaW4gYW4gUkdCIGNvbG9yLiBSYW5nZXMgZnJvbSAwIHRvIDI1NS5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGNvbG9yLmdyZWVuIC0gVGhlIHZhbHVlIGZvciBncmVlbiBjb2xvciBpbiBhbiBSR0IgY29sb3IuIFJhbmdlcyBmcm9tIDAgdG8gMjU1LlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gY29sb3IuYmx1ZSAtIFRoZSB2YWx1ZSBmb3IgYmx1ZSBjb2xvciBpbiBhbiBSR0IgY29sb3IuIFJhbmdlcyBmcm9tIDAgdG8gMjU1LlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHJlc29sdmVkIHByb21pc2Ugb3IgYW4gZXJyb3IgaW4gYSByZWplY3RlZCBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgbGVkQ29uc3RhbnQoY29sb3IpIHtcclxuICAgIGlmIChjb2xvci5yZWQgPT09IHVuZGVmaW5lZCB8fCBjb2xvci5ncmVlbiA9PT0gdW5kZWZpbmVkIHx8IGNvbG9yLmJsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBvcHRpb25zIG9iamVjdCBmb3IgbXVzdCBoYXZlIHRoZSBwcm9wZXJ0aWVzICdyZWQnLCAnZ3JlZW4nIGFuZCAnYmx1ZScuXCIpKTtcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgY29sb3IucmVkIDwgMCB8fFxyXG4gICAgICBjb2xvci5yZWQgPiAyNTUgfHxcclxuICAgICAgY29sb3IuZ3JlZW4gPCAwIHx8XHJcbiAgICAgIGNvbG9yLmdyZWVuID4gMjU1IHx8XHJcbiAgICAgIGNvbG9yLmJsdWUgPCAwIHx8XHJcbiAgICAgIGNvbG9yLmJsdWUgPiAyNTVcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgUkdCIHZhbHVlcyBtdXN0IGJlIGluIHRoZSByYW5nZSAwIC0gMjU1XCIpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9sZWRTZXQobmV3IFVpbnQ4QXJyYXkoWzEsIGNvbG9yLnJlZCwgY29sb3IuZ3JlZW4sIGNvbG9yLmJsdWVdKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgTEVEIGluIFwiYnJlYXRoZVwiIG1vZGUgd2hlcmUgdGhlIExFRCBjb250aW51b3VzbHkgcHVsc2VzIHdpdGggdGhlIHNwZWNpZmllZCBjb2xvciwgaW50ZW5zaXR5IGFuZCBkZWxheSBiZXR3ZWVuIHB1bHNlcy5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIE9wdGlvbnMgb2JqZWN0IGZvciBMRUQgYnJlYXRoZSBtb2RlXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gcGFyYW1zLmNvbG9yIC0gVGhlIGNvbG9yIGNvZGUgb3IgY29sb3IgbmFtZS4gMSA9IHJlZCwgMiA9IGdyZWVuLCAzID0geWVsbG93LCA0ID0gYmx1ZSwgNSA9IHB1cnBsZSwgNiA9IGN5YW4sIDcgPSB3aGl0ZS5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5pbnRlbnNpdHkgLSBJbnRlbnNpdHkgb2YgTEVEIHB1bHNlcy4gUmFuZ2UgZnJvbSAwIHRvIDEwMCBbJV0uXHJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuZGVsYXkgLSBEZWxheSBiZXR3ZWVuIHB1bHNlcyBpbiBtaWxsaXNlY29uZHMuIFJhbmdlIGZyb20gNTAgbXMgdG8gMTAgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHJlc29sdmVkIHByb21pc2Ugb3IgYW4gZXJyb3IgaW4gYSByZWplY3RlZCBwcm9taXNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgbGVkQnJlYXRoZShwYXJhbXMpIHtcclxuICAgIGNvbnN0IGNvbG9ycyA9IFtcInJlZFwiLCBcImdyZWVuXCIsIFwieWVsbG93XCIsIFwiYmx1ZVwiLCBcInB1cnBsZVwiLCBcImN5YW5cIiwgXCJ3aGl0ZVwiXTtcclxuICAgIGNvbnN0IGNvbG9yQ29kZSA9IHR5cGVvZiBwYXJhbXMuY29sb3IgPT09IFwic3RyaW5nXCIgPyBjb2xvcnMuaW5kZXhPZihwYXJhbXMuY29sb3IpICsgMSA6IHBhcmFtcy5jb2xvcjtcclxuXHJcbiAgICBpZiAocGFyYW1zLmNvbG9yID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmludGVuc2l0eSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5kZWxheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcclxuICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlIG9wdGlvbnMgb2JqZWN0IGZvciBtdXN0IGhhdmUgdGhlIHByb3BlcnRpZXMgJ2NvbG9yJywgJ2ludGVuc2l0eScgYW5kICdpbnRlbnNpdHknLlwiKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbG9yQ29kZSA8IDEgfHwgY29sb3JDb2RlID4gNykge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgY29sb3IgY29kZSBtdXN0IGJlIGluIHRoZSByYW5nZSAxIC0gN1wiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAocGFyYW1zLmludGVuc2l0eSA8IDAgfHwgcGFyYW1zLmludGVuc2l0eSA+IDEwMCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgaW50ZW5zaXR5IG11c3QgYmUgaW4gdGhlIHJhbmdlIDAgLSAxMDAlXCIpKTtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMuZGVsYXkgPCA1MCB8fCBwYXJhbXMuZGVsYXkgPiAxMDAwMCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgZGVsYXkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgNTAgbXMgLSAxMCAwMDAgbXNcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9sZWRTZXQobmV3IFVpbnQ4QXJyYXkoWzIsIGNvbG9yQ29kZSwgcGFyYW1zLmludGVuc2l0eSwgcGFyYW1zLmRlbGF5ICYgMHhmZiwgKHBhcmFtcy5kZWxheSA+PiA4KSAmIDB4ZmZdKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgTEVEIGluIG9uZS1zaG90IG1vZGUuIE9uZS1zaG90IG1vZGUgd2lsbCByZXN1bHQgaW4gb25lIHNpbmdsZSBwdWxzZSBvZiB0aGUgTEVELlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT3B0aW9uIG9iamVjdCBmb3IgTEVEIGluIG9uZS1zaG90IG1vZGVcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5jb2xvciAtIFRoZSBjb2xvciBjb2RlLiAxID0gcmVkLCAyID0gZ3JlZW4sIDMgPSB5ZWxsb3csIDQgPSBibHVlLCA1ID0gcHVycGxlLCA2ID0gY3lhbiwgNyA9IHdoaXRlLlxyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVuc2l0eSAtIEludGVuc2l0eSBvZiBMRUQgcHVsc2VzLiBSYW5nZSBmcm9tIDAgdG8gMTAwIFslXS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSByZXNvbHZlZCBwcm9taXNlIG9yIGFuIGVycm9yIGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGxlZE9uZVNob3QocGFyYW1zKSB7XHJcbiAgICBjb25zdCBjb2xvcnMgPSBbXCJyZWRcIiwgXCJncmVlblwiLCBcInllbGxvd1wiLCBcImJsdWVcIiwgXCJwdXJwbGVcIiwgXCJjeWFuXCIsIFwid2hpdGVcIl07XHJcbiAgICBjb25zdCBjb2xvckNvZGUgPSB0eXBlb2YgcGFyYW1zLmNvbG9yID09PSBcInN0cmluZ1wiID8gY29sb3JzLmluZGV4T2YocGFyYW1zLmNvbG9yKSArIDEgOiBwYXJhbXMuY29sb3I7XHJcblxyXG4gICAgaWYgKGNvbG9yQ29kZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pbnRlbnNpdHkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXHJcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcIlRoZSBvcHRpb25zIG9iamVjdCBmb3IgTEVEIG9uZS1zaG90IG11c3QgaGF2ZSB0aGUgcHJvcGVydGllcyAnY29sb3InIGFuZCAnaW50ZW5zaXR5LlwiKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbG9yQ29kZSA8IDEgfHwgY29sb3JDb2RlID4gNykge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgY29sb3IgY29kZSBtdXN0IGJlIGluIHRoZSByYW5nZSAxIC0gN1wiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAocGFyYW1zLmludGVuc2l0eSA8IDEgfHwgcGFyYW1zLmludGVuc2l0eSA+IDEwMCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgaW50ZW5zaXR5IG11c3QgYmUgaW4gdGhlIHJhbmdlIDAgLSAxMDBcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9sZWRTZXQobmV3IFVpbnQ4QXJyYXkoWzMsIGNvbG9yQ29kZSwgcGFyYW1zLmludGVuc2l0eV0pKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIGJ1dHRvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBidXR0b24gb24gdGhlIFRoaW5neSBpcyBwdXNoZWQgb3IgcmVsZWFzZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGJ1dHRvbiBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aXRoIGJ1dHRvbiBzdGF0ZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGJ1dHRvbkVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fYnV0dG9uTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuYnV0dG9uQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfYnV0dG9uTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IHN0YXRlID0gZGF0YS5nZXRVaW50OCgwKTtcclxuICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcihzdGF0ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGV4dGVybmFsIHBpbiBzZXR0aW5ncyBmcm9tIHRoZSBUaGluZ3kgZGV2aWNlLiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHBpbiBzdGF0dXMgaW5mb3JtYXRpb24uXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBleHRlcm5hbCBwaW4gc3RhdHVzIG9iamVjdC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGV4dGVybmFsUGluc1N0YXR1cygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBwaW5TdGF0dXMgPSB7XHJcbiAgICAgICAgcGluMTogZGF0YS5nZXRVaW50OCgwKSxcclxuICAgICAgICBwaW4yOiBkYXRhLmdldFVpbnQ4KDEpLFxyXG4gICAgICAgIHBpbjM6IGRhdGEuZ2V0VWludDgoMiksXHJcbiAgICAgICAgcGluNDogZGF0YS5nZXRVaW50OCgzKSxcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHBpblN0YXR1cztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHJlYWRpbmcgZnJvbSBleHRlcm5hbCBwaW4gY2hhcmFjdGVyaXN0aWM6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldCBhbiBleHRlcm5hbCBwaW4gdG8gY2hvc2VuIHN0YXRlLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGluIC0gRGV0ZXJtaW5lcyB3aGljaCBwaW4gaXMgc2V0LiBSYW5nZSAxIC0gNC5cclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gU2V0cyB0aGUgdmFsdWUgb2YgdGhlIHBpbi4gMCA9IE9GRiwgMjU1ID0gT04uXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldEV4dGVybmFsUGluKHBpbiwgdmFsdWUpIHtcclxuICAgIGlmIChwaW4gPCAxIHx8IHBpbiA+IDQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlBpbiBudW1iZXIgbXVzdCBiZSAxIC0gNFwiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoISh2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gMjU1KSkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUGluIHN0YXR1cyB2YWx1ZSBtdXN0IGJlIDAgb3IgMjU1XCIpKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHBpbnMgdGhhdCBhcmUgbm90IGJlaW5nIHNldFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg0KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbcGluIC0gMV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBleHRlcm5hbCBwaW5zOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICAqKioqKiogIC8vXHJcbiAgLyogIE1vdGlvbiBzZXJ2aWNlICAqL1xyXG4gIC8qKlxyXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gb2YgdGhlIFRoaW5neSBtb3Rpb24gbW9kdWxlLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYSBtb3Rpb24gY29uZmlndXJhdGlvbiBvYmplY3Qgd2hlbiBwcm9taXNlIHJlc29sdmVzLCBvciBhbiBlcnJvciBpZiByZWplY3RlZC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldE1vdGlvbkNvbmZpZygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcclxuICAgICAgY29uc3Qgc3RlcENvdW50ZXJJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICAgIGNvbnN0IHRlbXBDb21wSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBtYWduZXRDb21wSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xyXG4gICAgICBjb25zdCBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5ID0gZGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKTtcclxuICAgICAgY29uc3Qgd2FrZU9uTW90aW9uID0gZGF0YS5nZXRVaW50OCg4KTtcclxuICAgICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICAgIHN0ZXBDb3VudEludGVydmFsOiBzdGVwQ291bnRlckludGVydmFsLFxyXG4gICAgICAgIHRlbXBDb21wSW50ZXJ2YWw6IHRlbXBDb21wSW50ZXJ2YWwsXHJcbiAgICAgICAgbWFnbmV0Q29tcEludGVydmFsOiBtYWduZXRDb21wSW50ZXJ2YWwsXHJcbiAgICAgICAgbW90aW9uUHJvY2Vzc2luZ0ZyZXF1ZW5jeTogbW90aW9uUHJvY2Vzc2luZ0ZyZXF1ZW5jeSxcclxuICAgICAgICB3YWtlT25Nb3Rpb246IHdha2VPbk1vdGlvbixcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBnZXR0aW5nIFRoaW5neSBtb3Rpb24gbW9kdWxlIGNvbmZpZ3VyYXRpb246IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgdGhlIHN0ZXAgY291bnRlciBpbnRlcnZhbC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGludGVydmFsIC0gU3RlcCBjb3VudGVyIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDUgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRTdGVwQ291bnRlckludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiA1MDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDEwMCAtIDUwMDAgbXMuXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzBdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbMV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgc3RlcCBjb3VudCBpbnRlcnZhbDogXCIgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAgU2V0cyB0aGUgdGVtcGVyYXR1cmUgY29tcGVuc2F0aW9uIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBUZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNSAwMDAgbXMuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldFRlbXBlcmF0dXJlQ29tcEludGVydmFsKGludGVydmFsKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPCAxMDAgfHwgaW50ZXJ2YWwgPiA1MDAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDEwMCAtIDUwMDAgbXMuXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzJdID0gaW50ZXJ2YWwgJiAweGZmO1xyXG4gICAgICBkYXRhQXJyYXlbM10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgdGVtcGVyYXR1cmUgY29tcGVuc2F0aW9uIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIHRoZSBtYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBNYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDEgMDAwIG1zLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyBzZXRNYWduZXRDb21wSW50ZXJ2YWwoaW50ZXJ2YWwpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDEwMDApIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gMTAwMCBtcy5cIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xyXG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhQXJyYXlbNF0gPSBpbnRlcnZhbCAmIDB4ZmY7XHJcbiAgICAgIGRhdGFBcnJheVs1XSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBtYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsOiBcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBTZXRzIG1vdGlvbiBwcm9jZXNzaW5nIHVuaXQgdXBkYXRlIGZyZXF1ZW5jeS5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGZyZXF1ZW5jeSAtIE1vdGlvbiBwcm9jZXNzaW5nIGZyZXF1ZW5jeSBpbiBIei4gVGhlIGFsbG93ZWQgcmFuZ2UgaXMgNSAtIDIwMCBIei5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc2V0TW90aW9uUHJvY2Vzc0ZyZXF1ZW5jeShmcmVxdWVuY3kpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChmcmVxdWVuY3kgPCAxMDAgfHwgZnJlcXVlbmN5ID4gMjAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDUgLSAyMDAgSHouXCIpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxyXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YUFycmF5WzZdID0gZnJlcXVlbmN5ICYgMHhmZjtcclxuICAgICAgZGF0YUFycmF5WzddID0gKGZyZXF1ZW5jeSA+PiA4KSAmIDB4ZmY7XHJcblxyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBtb3Rpb24gcG9yY2Vzc2luZyB1bml0IHVwZGF0ZSBmcmVxdWVuY3k6IFwiICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIFNldHMgd2FrZS1vbi1tb3Rpb24gZmVhdHVyZSB0byBlbmFibGVkIG9yIGRpc2FibGVkIHN0YXRlLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIFNldCB0byBUcnVlIHRvIGVuYWJsZSBvciBGYWxzZSB0byBkaXNhYmxlIHdha2Utb24tbW90aW9uIGZlYXR1cmUuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIHNldFdha2VPbk1vdGlvbihlbmFibGUpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0eXBlb2YgZW5hYmxlICE9PSBcImJvb2xlYW5cIikge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgYXJndW1lbnQgbXVzdCBiZSB0cnVlIG9yIGZhbHNlLlwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcclxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XHJcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGFBcnJheVs4XSA9IGVuYWJsZSA/IDEgOiAwO1xyXG5cclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgbWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbDpcIiArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHRhcCBkZXRlY3Rpb24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgdGFwIGRldGVjdGlvbiBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgdGFwRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl90YXBOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy50YXBFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMudGFwQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy50YXBFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfdGFwTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGRhdGEuZ2V0VWludDgoMCk7XHJcbiAgICBjb25zdCBjb3VudCA9IGRhdGEuZ2V0VWludDgoMSk7XHJcbiAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgICAgIGNvdW50OiBjb3VudCxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIG9yaWVudGF0aW9uIGRldGVjdGlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBvcmllbnRhdGlvbiBkZXRlY3Rpb24gb2JqZWN0IGFzIGFyZ3VtZW50LlxyXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxyXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIG9yaWVudGF0aW9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX29yaWVudGF0aW9uTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLm9yaWVudGF0aW9uQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9vcmllbnRhdGlvbk5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGRhdGEuZ2V0VWludDgoMCk7XHJcbiAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcihvcmllbnRhdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHF1YXRlcm5pb24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgcXVhdGVybmlvbiBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgcXVhdGVybmlvbkVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3F1YXRlcm5pb25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMucXVhdGVybmlvbkNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9xdWF0ZXJuaW9uTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAvLyBEaXZpZGUgYnkgKDEgPDwgMzApIGFjY29yZGluZyB0byBzZW5zb3Igc3BlY2lmaWNhdGlvblxyXG4gICAgbGV0IHcgPSBkYXRhLmdldEludDMyKDAsIHRydWUpIC8gKDEgPDwgMzApO1xyXG4gICAgbGV0IHggPSBkYXRhLmdldEludDMyKDQsIHRydWUpIC8gKDEgPDwgMzApO1xyXG4gICAgbGV0IHkgPSBkYXRhLmdldEludDMyKDgsIHRydWUpIC8gKDEgPDwgMzApO1xyXG4gICAgbGV0IHogPSBkYXRhLmdldEludDMyKDEyLCB0cnVlKSAvICgxIDw8IDMwKTtcclxuICAgIGNvbnN0IG1hZ25pdHVkZSA9IE1hdGguc3FydChNYXRoLnBvdyh3LCAyKSArIE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgKyBNYXRoLnBvdyh6LCAyKSk7XHJcblxyXG4gICAgaWYgKG1hZ25pdHVkZSAhPT0gMCkge1xyXG4gICAgICB3IC89IG1hZ25pdHVkZTtcclxuICAgICAgeCAvPSBtYWduaXR1ZGU7XHJcbiAgICAgIHkgLz0gbWFnbml0dWRlO1xyXG4gICAgICB6IC89IG1hZ25pdHVkZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB3OiB3LFxyXG4gICAgICAgIHg6IHgsXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICB6OiB6LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgc3RlcCBjb3VudGVyIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHN0ZXAgY291bnRlciBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgc3RlcEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3N0ZXBOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnN0ZXBFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuc3RlcENoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9zdGVwTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XHJcbiAgICBjb25zdCBjb3VudCA9IGRhdGEuZ2V0VWludDMyKDAsIGxpdHRsZUVuZGlhbik7XHJcbiAgICBjb25zdCB0aW1lID0gZGF0YS5nZXRVaW50MzIoNCwgbGl0dGxlRW5kaWFuKTtcclxuICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIGNvdW50OiBjb3VudCxcclxuICAgICAgICB0aW1lOiB7XHJcbiAgICAgICAgICB2YWx1ZTogdGltZSxcclxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgcmF3IG1vdGlvbiBkYXRhIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXHJcbiAgICpcclxuICAgKiAgQGFzeW5jXHJcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIHJhdyBtb3Rpb24gZGF0YSBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgbW90aW9uUmF3RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9tb3Rpb25SYXdOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMubW90aW9uUmF3Q2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1swXSk7XHJcbiAgfVxyXG5cclxuICBfbW90aW9uUmF3Tm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAvLyBEaXZpZGUgYnkgMl42ID0gNjQgdG8gZ2V0IGFjY2VsZXJvbWV0ZXIgY29ycmVjdCB2YWx1ZXNcclxuICAgIGNvbnN0IGFjY1ggPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNjQ7XHJcbiAgICBjb25zdCBhY2NZID0gZGF0YS5nZXRJbnQxNigyLCB0cnVlKSAvIDY0O1xyXG4gICAgY29uc3QgYWNjWiA9IGRhdGEuZ2V0SW50MTYoNCwgdHJ1ZSkgLyA2NDtcclxuXHJcbiAgICAvLyBEaXZpZGUgYnkgMl4xMSA9IDIwNDggdG8gZ2V0IGNvcnJlY3QgZ3lyb3Njb3BlIHZhbHVlc1xyXG4gICAgY29uc3QgZ3lyb1ggPSBkYXRhLmdldEludDE2KDYsIHRydWUpIC8gMjA0ODtcclxuICAgIGNvbnN0IGd5cm9ZID0gZGF0YS5nZXRJbnQxNig4LCB0cnVlKSAvIDIwNDg7XHJcbiAgICBjb25zdCBneXJvWiA9IGRhdGEuZ2V0SW50MTYoMTAsIHRydWUpIC8gMjA0ODtcclxuXHJcbiAgICAvLyBEaXZpZGUgYnkgMl4xMiA9IDQwOTYgdG8gZ2V0IGNvcnJlY3QgY29tcGFzcyB2YWx1ZXNcclxuICAgIGNvbnN0IGNvbXBhc3NYID0gZGF0YS5nZXRJbnQxNigxMiwgdHJ1ZSkgLyA0MDk2O1xyXG4gICAgY29uc3QgY29tcGFzc1kgPSBkYXRhLmdldEludDE2KDE0LCB0cnVlKSAvIDQwOTY7XHJcbiAgICBjb25zdCBjb21wYXNzWiA9IGRhdGEuZ2V0SW50MTYoMTYsIHRydWUpIC8gNDA5NjtcclxuXHJcbiAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIGFjY2VsZXJvbWV0ZXI6IHtcclxuICAgICAgICAgIHg6IGFjY1gsXHJcbiAgICAgICAgICB5OiBhY2NZLFxyXG4gICAgICAgICAgejogYWNjWixcclxuICAgICAgICAgIHVuaXQ6IFwiR1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3lyb3Njb3BlOiB7XHJcbiAgICAgICAgICB4OiBneXJvWCxcclxuICAgICAgICAgIHk6IGd5cm9ZLFxyXG4gICAgICAgICAgejogZ3lyb1osXHJcbiAgICAgICAgICB1bml0OiBcImRlZy9zXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb21wYXNzOiB7XHJcbiAgICAgICAgICB4OiBjb21wYXNzWCxcclxuICAgICAgICAgIHk6IGNvbXBhc3NZLFxyXG4gICAgICAgICAgejogY29tcGFzc1osXHJcbiAgICAgICAgICB1bml0OiBcIm1pY3JvVGVzbGFcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgRXVsZXIgYW5nbGUgZGF0YSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3luY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYW4gRXVsZXIgYW5nbGUgZGF0YSBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZXVsZXJFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fZXVsZXJOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuZXVsZXJFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuZXVsZXJDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnNbMF0pO1xyXG4gIH1cclxuXHJcbiAgX2V1bGVyTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAvLyBEaXZpZGUgYnkgdHdvIGJ5dGVzICgxPDwxNiBvciAyXjE2IG9yIDY1NTM2KSB0byBnZXQgY29ycmVjdCB2YWx1ZVxyXG4gICAgY29uc3Qgcm9sbCA9IGRhdGEuZ2V0SW50MzIoMCwgdHJ1ZSkgLyA2NTUzNjtcclxuICAgIGNvbnN0IHBpdGNoID0gZGF0YS5nZXRJbnQzMig0LCB0cnVlKSAvIDY1NTM2O1xyXG4gICAgY29uc3QgeWF3ID0gZGF0YS5nZXRJbnQzMig4LCB0cnVlKSAvIDY1NTM2O1xyXG5cclxuICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICByb2xsOiByb2xsLFxyXG4gICAgICAgIHBpdGNoOiBwaXRjaCxcclxuICAgICAgICB5YXc6IHlhdyxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIHJvdGF0aW9uIG1hdHJpeCBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxyXG4gICAqXHJcbiAgICogIEBhc3VuY1xyXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYW4gcm90YXRpb24gbWF0cml4IG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICBhc3luYyByb3RhdGlvbk1hdHJpeEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9yb3RhdGlvbk1hdHJpeE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWMoXHJcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhDaGFyYWN0ZXJpc3RpYyxcclxuICAgICAgZW5hYmxlLFxyXG4gICAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnNbMF1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBfcm90YXRpb25NYXRyaXhOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuICAgIC8vIERpdmlkZSBieSAyXjIgPSA0IHRvIGdldCBjb3JyZWN0IHZhbHVlc1xyXG4gICAgY29uc3QgcjFjMSA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjFjMiA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjFjMyA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjJjMSA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjJjMiA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjJjMyA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjNjMSA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjNjMiA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG4gICAgY29uc3QgcjNjMyA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xyXG5cclxuICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICByb3cxOiBbcjFjMSwgcjFjMiwgcjFjM10sXHJcbiAgICAgICAgcm93MjogW3IyYzEsIHIyYzIsIHIyYzNdLFxyXG4gICAgICAgIHJvdzM6IFtyM2MxLCByM2MyLCByM2MzXSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIGhlYWRpbmcgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgaGVhZGluZyBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgaGVhZGluZ0VuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2hlYWRpbmdOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuaGVhZGluZ0NoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9oZWFkaW5nTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAvLyBEaXZpZGUgYnkgMl4xNiA9IDY1NTM2IHRvIGdldCBjb3JyZWN0IGhlYWRpbmcgdmFsdWVzXHJcbiAgICBjb25zdCBoZWFkaW5nID0gZGF0YS5nZXRJbnQzMigwLCB0cnVlKSAvIDY1NTM2O1xyXG5cclxuICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xyXG4gICAgICBldmVudEhhbmRsZXIoe1xyXG4gICAgICAgIHZhbHVlOiBoZWFkaW5nLFxyXG4gICAgICAgIHVuaXQ6IFwiZGVncmVlc1wiLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogIEVuYWJsZXMgZ3Jhdml0eSB2ZWN0b3Igbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgaGVhZGluZyBvYmplY3QgYXMgYXJndW1lbnQuXHJcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXHJcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxyXG4gICAqXHJcbiAgICovXHJcbiAgYXN5bmMgZ3Jhdml0eVZlY3RvckVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2dyYXZpdHlWZWN0b3JOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKFxyXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JDaGFyYWN0ZXJpc3RpYyxcclxuICAgICAgZW5hYmxlLFxyXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1swXVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIF9ncmF2aXR5VmVjdG9yTm90aWZ5SGFuZGxlcihldmVudCkge1xyXG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGNvbnN0IHggPSBkYXRhLmdldEZsb2F0MzIoMCwgdHJ1ZSk7XHJcbiAgICBjb25zdCB5ID0gZGF0YS5nZXRGbG9hdDMyKDQsIHRydWUpO1xyXG4gICAgY29uc3QgeiA9IGRhdGEuZ2V0RmxvYXQzMig4LCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcclxuICAgICAgZXZlbnRIYW5kbGVyKHtcclxuICAgICAgICB4OiB4LFxyXG4gICAgICAgIHk6IHksXHJcbiAgICAgICAgejogeixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICAqKioqKiogIC8vXHJcblxyXG4gIC8qICBTb3VuZCBzZXJ2aWNlICAqL1xyXG5cclxuICBtaWNyb3Bob25lRW5hYmxlKGVuYWJsZSkge1xyXG4gICAgLy8gVGFibGVzIG9mIGNvbnN0YW50cyBuZWVkZWQgZm9yIHdoZW4gd2UgZGVjb2RlIHRoZSBhZHBjbS1lbmNvZGVkIGF1ZGlvIGZyb20gdGhlIFRoaW5neVxyXG4gICAgaWYgKHRoaXMuX01JQ1JPUEhPTkVfSU5ERVhfVEFCTEUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9NSUNST1BIT05FX0lOREVYX1RBQkxFID0gWy0xLCAtMSwgLTEsIC0xLCAyLCA0LCA2LCA4LCAtMSwgLTEsIC0xLCAtMSwgMiwgNCwgNiwgOF07XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRSA9IFs3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE2LCAxNywgMTksIDIxLCAyMywgMjUsIDI4LCAzMSwgMzQsIDM3LCA0MSwgNDUsIDUwLCA1NSwgNjAsIDY2LCA3MywgODAsIDg4LCA5NywgMTA3LCAxMTgsIDEzMCwgMTQzLCAxNTcsIDE3MywgMTkwLCAyMDksXHJcbiAgICAgICAgMjMwLCAyNTMsIDI3OSwgMzA3LCAzMzcsIDM3MSwgNDA4LCA0NDksIDQ5NCwgNTQ0LCA1OTgsIDY1OCwgNzI0LCA3OTYsIDg3NiwgOTYzLCAxMDYwLCAxMTY2LCAxMjgyLCAxNDExLCAxNTUyLCAxNzA3LCAxODc4LCAyMDY2LCAyMjcyLCAyNDk5LCAyNzQ5LCAzMDI0LCAzMzI3LCAzNjYwLCA0MDI2LCA0NDI4LCA0ODcxLCA1MzU4LFxyXG4gICAgICAgIDU4OTQsIDY0ODQsIDcxMzIsIDc4NDUsIDg2MzAsIDk0OTMsIDEwNDQyLCAxMTQ4NywgMTI2MzUsIDEzODk5LCAxNTI4OSwgMTY4MTgsIDE4NTAwLCAyMDM1MCwgMjIzODUsIDI0NjIzLCAyNzA4NiwgMjk3OTQsIDMyNzY3XTtcclxuICAgIH1cclxuICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgdGhpcy5taWNyb3Bob25lRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9taWNyb3Bob25lTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAvLyBsYWdlciBlbiBueSBhdWRpbyBjb250ZXh0LCBza2FsIGJhcmUgaGEgw6luIGF2IGRlbm5lXHJcbiAgICAgIGlmICh0aGlzLmF1ZGlvQ3R4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5hdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMubWljcm9waG9uZUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMubWljcm9waG9uZUV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcbiAgX21pY3JvcGhvbmVOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBhdWRpb1BhY2tldCA9IGV2ZW50LnRhcmdldC52YWx1ZS5idWZmZXI7XHJcbiAgICBjb25zdCBhZHBjbSA9IHtcclxuICAgICAgaGVhZGVyOiBuZXcgRGF0YVZpZXcoYXVkaW9QYWNrZXQuc2xpY2UoMCwgMykpLFxyXG4gICAgICBkYXRhOiBuZXcgRGF0YVZpZXcoYXVkaW9QYWNrZXQuc2xpY2UoMykpLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGRlY29kZWRBdWRpbyA9IHRoaXMuX2RlY29kZUF1ZGlvKGFkcGNtKTtcclxuICAgIHRoaXMuX3BsYXlEZWNvZGVkQXVkaW8oZGVjb2RlZEF1ZGlvKTtcclxuICB9XHJcbiAgLyogIFNvdW5kIHNlcnZpY2UgICovXHJcbiAgX2RlY29kZUF1ZGlvKGFkcGNtKSB7XHJcbiAgICAvLyBBbGxvY2F0ZSBvdXRwdXQgYnVmZmVyXHJcbiAgICBjb25zdCBhdWRpb0J1ZmZlckRhdGFMZW5ndGggPSBhZHBjbS5kYXRhLmJ5dGVMZW5ndGg7XHJcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig1MTIpO1xyXG4gICAgY29uc3QgcGNtID0gbmV3IERhdGFWaWV3KGF1ZGlvQnVmZmVyKTtcclxuICAgIGxldCBkaWZmO1xyXG4gICAgbGV0IGJ1ZmZlclN0ZXAgPSBmYWxzZTtcclxuICAgIGxldCBpbnB1dEJ1ZmZlciA9IDA7XHJcbiAgICBsZXQgZGVsdGEgPSAwO1xyXG4gICAgbGV0IHNpZ24gPSAwO1xyXG4gICAgbGV0IHN0ZXA7XHJcblxyXG4gICAgLy8gVGhlIGZpcnN0IDIgYnl0ZXMgb2YgQURQQ00gZnJhbWUgYXJlIHRoZSBwcmVkaWN0ZWQgdmFsdWVcclxuICAgIGxldCB2YWx1ZVByZWRpY3RlZCA9IGFkcGNtLmhlYWRlci5nZXRJbnQxNigwLCBmYWxzZSk7XHJcbiAgICAvLyBUaGUgM3JkIGJ5dGUgaXMgdGhlIGluZGV4IHZhbHVlXHJcbiAgICBsZXQgaW5kZXggPSBhZHBjbS5oZWFkZXIuZ2V0SW50OCgyKTtcclxuICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgaW5kZXggPSAwO1xyXG4gICAgfVxyXG4gICAgaWYgKGluZGV4ID4gODgpIHtcclxuICAgICAgaW5kZXggPSA4ODtcclxuICAgIH1cclxuICAgIHN0ZXAgPSB0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRVtpbmRleF07XHJcbiAgICBmb3IgKGxldCBfaW4gPSAwLCBfb3V0ID0gMDsgX2luIDwgYXVkaW9CdWZmZXJEYXRhTGVuZ3RoOyBfb3V0ICs9IDIpIHtcclxuICAgICAgLyogU3RlcCAxIC0gZ2V0IHRoZSBkZWx0YSB2YWx1ZSAqL1xyXG4gICAgICBpZiAoYnVmZmVyU3RlcCkge1xyXG4gICAgICAgIGRlbHRhID0gaW5wdXRCdWZmZXIgJiAweDBGO1xyXG4gICAgICAgIF9pbisrO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlucHV0QnVmZmVyID0gYWRwY20uZGF0YS5nZXRJbnQ4KF9pbik7XHJcbiAgICAgICAgZGVsdGEgPSAoaW5wdXRCdWZmZXIgPj4gNCkgJiAweDBGO1xyXG4gICAgICB9XHJcbiAgICAgIGJ1ZmZlclN0ZXAgPSAhYnVmZmVyU3RlcDtcclxuICAgICAgLyogU3RlcCAyIC0gRmluZCBuZXcgaW5kZXggdmFsdWUgKGZvciBsYXRlcikgKi9cclxuICAgICAgaW5kZXggKz0gdGhpcy5fTUlDUk9QSE9ORV9JTkRFWF9UQUJMRVtkZWx0YV07XHJcbiAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGluZGV4ID4gODgpIHtcclxuICAgICAgICBpbmRleCA9IDg4O1xyXG4gICAgICB9XHJcbiAgICAgIC8qIFN0ZXAgMyAtIFNlcGFyYXRlIHNpZ24gYW5kIG1hZ25pdHVkZSAqL1xyXG4gICAgICBzaWduID0gZGVsdGEgJiA4O1xyXG4gICAgICBkZWx0YSA9IGRlbHRhICYgNztcclxuICAgICAgLyogU3RlcCA0IC0gQ29tcHV0ZSBkaWZmZXJlbmNlIGFuZCBuZXcgcHJlZGljdGVkIHZhbHVlICovXHJcbiAgICAgIGRpZmYgPSAoc3RlcCA+PiAzKTtcclxuICAgICAgaWYgKChkZWx0YSAmIDQpID4gMCkge1xyXG4gICAgICAgIGRpZmYgKz0gc3RlcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoKGRlbHRhICYgMikgPiAwKSB7XHJcbiAgICAgICAgZGlmZiArPSAoc3RlcCA+PiAxKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoKGRlbHRhICYgMSkgPiAwKSB7XHJcbiAgICAgICAgZGlmZiArPSAoc3RlcCA+PiAyKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoc2lnbiA+IDApIHtcclxuICAgICAgICB2YWx1ZVByZWRpY3RlZCAtPSBkaWZmO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlUHJlZGljdGVkICs9IGRpZmY7XHJcbiAgICAgIH1cclxuICAgICAgLyogU3RlcCA1IC0gY2xhbXAgb3V0cHV0IHZhbHVlICovXHJcbiAgICAgIGlmICh2YWx1ZVByZWRpY3RlZCA+IDMyNzY3KSB7XHJcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgPSAzMjc2NztcclxuICAgICAgfSBlbHNlIGlmICh2YWx1ZVByZWRpY3RlZCA8IC0zMjc2OCkge1xyXG4gICAgICAgIHZhbHVlUHJlZGljdGVkID0gLTMyNzY4O1xyXG4gICAgICB9XHJcbiAgICAgIC8qIFN0ZXAgNiAtIFVwZGF0ZSBzdGVwIHZhbHVlICovXHJcbiAgICAgIHN0ZXAgPSB0aGlzLl9NSUNST1BIT05FX1NURVBfU0laRV9UQUJMRVtpbmRleF07XHJcbiAgICAgIC8qIFN0ZXAgNyAtIE91dHB1dCB2YWx1ZSAqL1xyXG4gICAgICBwY20uc2V0SW50MTYoX291dCwgdmFsdWVQcmVkaWN0ZWQsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBjbTtcclxuICB9XHJcbiAgX3BsYXlEZWNvZGVkQXVkaW8oYXVkaW8pIHtcclxuICAgIGlmICh0aGlzLl9hdWRpb1N0YWNrID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5fYXVkaW9TdGFjayA9IFtdO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYXVkaW9TdGFjay5wdXNoKGF1ZGlvKTtcclxuICAgIGlmICh0aGlzLl9hdWRpb1N0YWNrLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLl9zY2hlZHVsZUF1ZGlvQnVmZmVycygpO1xyXG4gICAgfVxyXG4gIH1cclxuICBfc2NoZWR1bGVBdWRpb0J1ZmZlcnMoKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fYXVkaW9TdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IGJ1ZmZlclRpbWUgPSAwLjAxOyAvLyBCdWZmZXIgdGltZSBpbiBzZWNvbmRzIGJlZm9yZSBpbml0aWFsIGF1ZGlvIGNodW5rIGlzIHBsYXllZFxyXG4gICAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9hdWRpb1N0YWNrLnNoaWZ0KCk7XHJcbiAgICAgIGNvbnN0IGNoYW5uZWxzID0gMTtcclxuICAgICAgY29uc3QgZnJhbWVjb3VudCA9IGJ1ZmZlci5ieXRlTGVuZ3RoIC8gMjtcclxuICAgICAgaWYgKHRoaXMuX2F1ZGlvTmV4dFRpbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX2F1ZGlvTmV4dFRpbWUgPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG15QXJyYXlCdWZmZXIgPSB0aGlzLmF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlcihjaGFubmVscywgZnJhbWVjb3VudCwgMTYwMDApO1xyXG4gICAgICAvLyBUaGlzIGdpdmVzIHVzIHRoZSBhY3R1YWwgYXJyYXkgdGhhdCBjb250YWlucyB0aGUgZGF0YVxyXG4gICAgICBjb25zdCBub3dCdWZmZXJpbmcgPSBteUFycmF5QnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlci5ieXRlTGVuZ3RoIC8gMjsgaSsrKSB7XHJcbiAgICAgICAgbm93QnVmZmVyaW5nW2ldID0gYnVmZmVyLmdldEludDE2KDIgKiBpLCB0cnVlKSAvIDMyNzY4LjA7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgc291cmNlLmJ1ZmZlciA9IG15QXJyYXlCdWZmZXI7XHJcbiAgICAgIHNvdXJjZS5jb25uZWN0KHRoaXMuYXVkaW9DdHguZGVzdGluYXRpb24pO1xyXG4gICAgICBpZiAodGhpcy5fYXVkaW9OZXh0VGltZSA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuX2F1ZGlvTmV4dFRpbWUgPSB0aGlzLmF1ZGlvQ3R4LmN1cnJlbnRUaW1lICsgYnVmZmVyVGltZTtcclxuICAgICAgfVxyXG4gICAgICBzb3VyY2Uuc3RhcnQodGhpcy5fYXVkaW9OZXh0VGltZSk7XHJcbiAgICAgIHRoaXMuX2F1ZGlvTmV4dFRpbWUgKz0gc291cmNlLmJ1ZmZlci5kdXJhdGlvbjtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gICoqKioqKiAgLy9cclxuXHJcbiAgLyogIEJhdHRlcnkgc2VydmljZSAgKi9cclxuICAvKipcclxuICAgKiAgR2V0cyB0aGUgYmF0dGVyeSBsZXZlbCBvZiBUaGluZ3kuXHJcbiAgICpcclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3QgfCBFcnJvcj59IFJldHVybnMgYmF0dGVyeSBsZXZlbCBpbiBwZXJjZW50YWdlIHdoZW4gcHJvbWlzZSBpcyByZXNvbHZlZCBvciBhbiBlcnJvciBpZiByZWplY3RlZC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEJhdHRlcnlMZXZlbCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuYmF0dGVyeUNoYXJhY3RlcmlzdGljKTtcclxuICAgICAgY29uc3QgbGV2ZWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMCk7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHZhbHVlOiBsZXZlbCxcclxuICAgICAgICB1bml0OiBcIiVcIixcclxuICAgICAgfTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBFbmFibGVzIGJhdHRlcnkgbGV2ZWwgbm90aWZpY2F0aW9ucy5cclxuICAgKlxyXG4gICAqICBAYXN5bmNcclxuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIGJhdHRlcnkgbGV2ZWwgY2hhbmdlLiBXaWxsIHJlY2VpdmUgYSBiYXR0ZXJ5IGxldmVsIG9iamVjdCBhcyBhcmd1bWVudC5cclxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cclxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXHJcbiAgICpcclxuICAgICAqL1xyXG4gIGFzeW5jIGJhdHRlcnlMZXZlbEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xyXG4gICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fYmF0dGVyeUxldmVsTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmJhdHRlcnlDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzBdKTtcclxuICB9XHJcblxyXG4gIF9iYXR0ZXJ5TGV2ZWxOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgY29uc3QgdmFsdWUgPSBkYXRhLmdldFVpbnQ4KDApO1xyXG5cclxuICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XHJcbiAgICAgIGV2ZW50SGFuZGxlcih7XHJcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgIHVuaXQ6IFwiJVwiLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuLy8gICoqKioqKiAgLy9cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHtQYXJ0VGhlbWVNaXhpbn0gZnJvbSAnLi9saWJzL3BhcnQtdGhlbWUuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnRUaGVtZUVsZW1lbnQgZXh0ZW5kcyBQYXJ0VGhlbWVNaXhpbihIVE1MRWxlbWVudCkge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBgO1xyXG4gICAgfVxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgIGlmICghdGhpcy5zaGFkb3dSb290KSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmNvbnN0cnVjdG9yLnRlbXBsYXRlO1xyXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6ICdvcGVuJ30pO1xyXG4gICAgICAgICAgY29uc3QgZG9tID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgICAgdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKGRvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuZXhwb3J0IGNsYXNzIFhUaHVtYnMgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBwYXJ0PVwidGh1bWItdXBcIj7wn5GNPC9kaXY+XHJcbiAgICAgICAgPGRpdiBwYXJ0PVwidGh1bWItZG93blwiPvCfkY48L2Rpdj5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC10aHVtYnMnLCBYVGh1bWJzKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBYUmF0aW5nIGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxzdHlsZT5cclxuICAgICAgICAgIDpob3N0IHtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC10aHVtYnM6OnBhcnQodGh1bWItdXApIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIGdyZWVuO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBibHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC10aHVtYnM6OnBhcnQodGh1bWItZG93bikge1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBkb3R0ZWQgcmVkO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDwvc3R5bGU+XHJcbiAgICAgICAgPGRpdiBwYXJ0PVwic3ViamVjdFwiPjxzbG90Pjwvc2xvdD48L2Rpdj5cclxuICAgICAgICA8eC10aHVtYnMgcGFydD1cIiogPT4gcmF0aW5nLSpcIj48L3gtdGh1bWJzPlxyXG4gICAgICBgO1xyXG4gICAgfVxyXG4gIH1cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtcmF0aW5nJywgWFJhdGluZyk7XHJcblxyXG5leHBvcnQgY2xhc3MgWEhvc3QgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAgOmhvc3Qge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgYm9yZGVyOiAycHggc29saWQgb3JhbmdlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmcge1xyXG4gICAgICAgICAgICBtYXJnaW46IDRweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nIHtcclxuICAgICAgICAgICAgLS1lMS1wYXJ0LXN1YmplY3QtcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLnVubzpob3Zlcjo6cGFydChzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpZ2h0Z3JlZW47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAuZHVvOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogZ29sZGVucm9kO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLnVubzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogZ3JlZW47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAudW5vOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRvbWF0bztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC5kdW86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHllbGxvdztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC5kdW86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogYmxhY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZzo6dGhlbWUodGh1bWItdXApIHtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICA8L3N0eWxlPlxyXG4gICAgICAgIDx4LXJhdGluZyBjbGFzcz1cInVub1wiPuKdpO+4jzwveC1yYXRpbmc+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDx4LXJhdGluZyBjbGFzcz1cImR1b1wiPvCfpLc8L3gtcmF0aW5nPlxyXG4gICAgICBgO1xyXG4gICAgfVxyXG4gIH1cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtaG9zdCcsIFhIb3N0KTsiLCIvKlxyXG5AbGljZW5zZVxyXG5Db3B5cmlnaHQgKGMpIDIwMTcgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5UaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XHJcblRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XHJcblRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxyXG5Db2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xyXG5zdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxyXG4qL1xyXG5cclxuY29uc3QgcGFydERhdGFLZXkgPSAnX19jc3NQYXJ0cyc7XHJcbmNvbnN0IHBhcnRJZEtleSA9ICdfX3BhcnRJZCc7XHJcblxyXG4vKipcclxuICogQ29udmVydHMgYW55IHN0eWxlIGVsZW1lbnRzIGluIHRoZSBzaGFkb3dSb290IHRvIHJlcGxhY2UgOjpwYXJ0Lzo6dGhlbWVcclxuICogd2l0aCBjdXN0b20gcHJvcGVydGllcyB1c2VkIHRvIHRyYW5zbWl0IHRoaXMgZGF0YSBkb3duIHRoZSBkb20gdHJlZS4gQWxzb1xyXG4gKiBjYWNoZXMgcGFydCBtZXRhZGF0YSBmb3IgbGF0ZXIgbG9va3VwLlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcclxuICovXHJcblxyXG5mdW5jdGlvbiBpbml0aWFsaXplUGFydHMoZWxlbWVudCkge1xyXG4gIGlmICghZWxlbWVudC5zaGFkb3dSb290KSB7XHJcbiAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IG51bGw7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIEFycmF5LmZyb20oZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJykpLmZvckVhY2goc3R5bGUgPT4ge1xyXG4gICAgY29uc3QgaW5mbyA9IHBhcnRDc3NUb0N1c3RvbVByb3BDc3MoZWxlbWVudCwgc3R5bGUudGV4dENvbnRlbnQpO1xyXG4gICAgaWYgKGluZm8ucGFydHMpIHtcclxuICAgICAgZWxlbWVudFtwYXJ0RGF0YUtleV0gPSBlbGVtZW50W3BhcnREYXRhS2V5XSB8fCBbXTtcclxuICAgICAgZWxlbWVudFtwYXJ0RGF0YUtleV0ucHVzaCguLi5pbmZvLnBhcnRzKTtcclxuICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBpbmZvLmNzcztcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KSB7XHJcbiAgaWYgKCFlbGVtZW50Lmhhc093blByb3BlcnR5KCdfX2Nzc1BhcnRzJykpIHtcclxuICAgIGluaXRpYWxpemVQYXJ0cyhlbGVtZW50KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KSB7XHJcbiAgZW5zdXJlUGFydERhdGEoZWxlbWVudCk7XHJcbiAgcmV0dXJuIGVsZW1lbnRbcGFydERhdGFLZXldO1xyXG59XHJcblxyXG4vLyBUT0RPKHNvcnZlbGwpOiBicml0dGxlIGR1ZSB0byByZWdleC1pbmcgY3NzLiBJbnN0ZWFkIHVzZSBhIGNzcyBwYXJzZXIuXHJcbi8qKlxyXG4gKiBUdXJucyBjc3MgdXNpbmcgYDo6cGFydGAgaW50byBjc3MgdXNpbmcgdmFyaWFibGVzIGZvciB0aG9zZSBwYXJ0cy5cclxuICogQWxzbyByZXR1cm5zIHBhcnQgbWV0YWRhdGEuXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY3NzVGV4dFxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjc3M6IHBhcnRpZmllZCBjc3MsIHBhcnRzOiBhcnJheSBvZiBwYXJ0cyBvZiB0aGUgZm9ybVxyXG4gKiB7bmFtZSwgc2VsZWN0b3IsIHByb3BzfVxyXG4gKiBFeGFtcGxlIG9mIHBhcnQtaWZpZWQgY3NzLCBnaXZlbjpcclxuICogLmZvbzo6cGFydChiYXIpIHsgY29sb3I6IHJlZCB9XHJcbiAqIG91dHB1dDpcclxuICogLmZvbyB7IC0tZTEtcGFydC1iYXItY29sb3I6IHJlZDsgfVxyXG4gKiB3aGVyZSBgZTFgIGlzIGEgZ3VpZCBmb3IgdGhpcyBlbGVtZW50LlxyXG4gKi9cclxuZnVuY3Rpb24gcGFydENzc1RvQ3VzdG9tUHJvcENzcyhlbGVtZW50LCBjc3NUZXh0KSB7XHJcbiAgbGV0IHBhcnRzO1xyXG4gIGxldCBjc3MgPSBjc3NUZXh0LnJlcGxhY2UoY3NzUmUsIChtLCBzZWxlY3RvciwgdHlwZSwgbmFtZSwgZW5kU2VsZWN0b3IsIHByb3BzU3RyKSA9PiB7XHJcbiAgICBwYXJ0cyA9IHBhcnRzIHx8IFtdO1xyXG4gICAgbGV0IHByb3BzID0ge307XHJcbiAgICBjb25zdCBwcm9wc0FycmF5ID0gcHJvcHNTdHIuc3BsaXQoL1xccyo7XFxzKi8pO1xyXG4gICAgcHJvcHNBcnJheS5mb3JFYWNoKHByb3AgPT4ge1xyXG4gICAgICBjb25zdCBzID0gcHJvcC5zcGxpdCgnOicpO1xyXG4gICAgICBjb25zdCBuYW1lID0gcy5zaGlmdCgpLnRyaW0oKTtcclxuICAgICAgY29uc3QgdmFsdWUgPSBzLmpvaW4oJzonKTtcclxuICAgICAgcHJvcHNbbmFtZV0gPSB2YWx1ZTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgcGFydHMucHVzaCh7c2VsZWN0b3IsIGVuZFNlbGVjdG9yLCBuYW1lLCBwcm9wcywgaXNUaGVtZTogdHlwZSA9PSB0aGVtZX0pO1xyXG4gICAgbGV0IHBhcnRQcm9wcyA9ICcnO1xyXG4gICAgZm9yIChsZXQgcCBpbiBwcm9wcykge1xyXG4gICAgICBwYXJ0UHJvcHMgPSBgJHtwYXJ0UHJvcHN9XFxuXFx0JHt2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwLCBlbmRTZWxlY3Rvcil9OiAke3Byb3BzW3BdfTtgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGBcXG4ke3NlbGVjdG9yIHx8ICcqJ30ge1xcblxcdCR7cGFydFByb3BzLnRyaW0oKX1cXG59YDtcclxuICB9KTtcclxuICByZXR1cm4ge3BhcnRzLCBjc3N9O1xyXG59XHJcblxyXG4vLyBndWlkIGZvciBlbGVtZW50IHBhcnQgc2NvcGVzXHJcbmxldCBwYXJ0SWQgPSAwO1xyXG5mdW5jdGlvbiBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpIHtcclxuICBpZiAoZWxlbWVudFtwYXJ0SWRLZXldID09IHVuZGVmaW5lZCkge1xyXG4gICAgZWxlbWVudFtwYXJ0SWRLZXldID0gcGFydElkKys7XHJcbiAgfVxyXG4gIHJldHVybiBlbGVtZW50W3BhcnRJZEtleV07XHJcbn1cclxuXHJcbmNvbnN0IHRoZW1lID0gJzo6dGhlbWUnO1xyXG5jb25zdCBjc3NSZSA9IC9cXHMqKC4qKSg6Oig/OnBhcnR8dGhlbWUpKVxcKChbXildKylcXCkoW15cXHN7XSopXFxzKntcXHMqKFtefV0qKVxccyp9L2dcclxuXHJcbi8vIGNyZWF0ZXMgYSBjdXN0b20gcHJvcGVydHkgbmFtZSBmb3IgYSBwYXJ0LlxyXG5mdW5jdGlvbiB2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwcm9wLCBlbmRTZWxlY3Rvcikge1xyXG4gIHJldHVybiBgLS1lJHtpZH0tcGFydC0ke25hbWV9LSR7cHJvcH0ke2VuZFNlbGVjdG9yID8gYC0ke2VuZFNlbGVjdG9yLnJlcGxhY2UoL1xcOi9nLCAnJyl9YCA6ICcnfWA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQcm9kdWNlcyBhIHN0eWxlIHVzaW5nIGNzcyBjdXN0b20gcHJvcGVydGllcyB0byBzdHlsZSA6OnBhcnQvOjp0aGVtZVxyXG4gKiBmb3IgYWxsIHRoZSBkb20gaW4gdGhlIGVsZW1lbnQncyBzaGFkb3dSb290LlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhcnRUaGVtZShlbGVtZW50KSB7XHJcbiAgaWYgKGVsZW1lbnQuc2hhZG93Um9vdCkge1xyXG4gICAgY29uc3Qgb2xkU3R5bGUgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3R5bGVbcGFydHNdJyk7XHJcbiAgICBpZiAob2xkU3R5bGUpIHtcclxuICAgICAgb2xkU3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGRTdHlsZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNvbnN0IGhvc3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCkuaG9zdDtcclxuICBpZiAoaG9zdCkge1xyXG4gICAgLy8gbm90ZTogZW5zdXJlIGhvc3QgaGFzIHBhcnQgZGF0YSBzbyB0aGF0IGVsZW1lbnRzIHRoYXQgYm9vdCB1cFxyXG4gICAgLy8gd2hpbGUgdGhlIGhvc3QgaXMgYmVpbmcgY29ubmVjdGVkIGNhbiBzdHlsZSBwYXJ0cy5cclxuICAgIGVuc3VyZVBhcnREYXRhKGhvc3QpO1xyXG4gICAgY29uc3QgY3NzID0gY3NzRm9yRWxlbWVudERvbShlbGVtZW50KTtcclxuICAgIGlmIChjc3MpIHtcclxuICAgICAgY29uc3QgbmV3U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICBuZXdTdHlsZS50ZXh0Q29udGVudCA9IGNzcztcclxuICAgICAgZWxlbWVudC5zaGFkb3dSb290LmFwcGVuZENoaWxkKG5ld1N0eWxlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQcm9kdWNlcyBjc3NUZXh0IGEgc3R5bGUgZWxlbWVudCB0byBhcHBseSBwYXJ0IGNzcyB0byBhIGdpdmVuIGVsZW1lbnQuXHJcbiAqIFRoZSBlbGVtZW50J3Mgc2hhZG93Um9vdCBkb20gaXMgc2Nhbm5lZCBmb3Igbm9kZXMgd2l0aCBhIGBwYXJ0YCBhdHRyaWJ1dGUuXHJcbiAqIFRoZW4gc2VsZWN0b3JzIGFyZSBjcmVhdGVkIG1hdGNoaW5nIHRoZSBwYXJ0IGF0dHJpYnV0ZSBjb250YWluaW5nIHByb3BlcnRpZXNcclxuICogd2l0aCBwYXJ0cyBkZWZpbmVkIGluIHRoZSBlbGVtZW50J3MgaG9zdC5cclxuICogVGhlIGFuY2VzdG9yIHRyZWUgaXMgdHJhdmVyc2VkIGZvciBmb3J3YXJkZWQgcGFydHMgYW5kIHRoZW1lLlxyXG4gKiBlLmcuXHJcbiAqIFtwYXJ0PVwiYmFyXCJdIHtcclxuICogICBjb2xvcjogdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO1xyXG4gKiB9XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IGZvciB3aGljaCB0byBhcHBseSBwYXJ0IGNzc1xyXG4gKi9cclxuZnVuY3Rpb24gY3NzRm9yRWxlbWVudERvbShlbGVtZW50KSB7XHJcbiAgZW5zdXJlUGFydERhdGEoZWxlbWVudCk7XHJcbiAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xyXG4gIGNvbnN0IHBhcnROb2RlcyA9IGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbcGFydF0nKTtcclxuICBsZXQgY3NzID0gJyc7XHJcbiAgZm9yIChsZXQgaT0wOyBpIDwgcGFydE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBhdHRyID0gcGFydE5vZGVzW2ldLmdldEF0dHJpYnV0ZSgncGFydCcpO1xyXG4gICAgY29uc3QgcGFydEluZm8gPSBwYXJ0SW5mb0Zyb21BdHRyKGF0dHIpO1xyXG4gICAgY3NzID0gYCR7Y3NzfVxcblxcdCR7cnVsZUZvclBhcnRJbmZvKHBhcnRJbmZvLCBhdHRyLCBlbGVtZW50KX1gXHJcbiAgfVxyXG4gIHJldHVybiBjc3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgY3NzIHJ1bGUgdGhhdCBhcHBsaWVzIGEgcGFydC5cclxuICogQHBhcmFtIHsqfSBwYXJ0SW5mbyBBcnJheSBvZiBwYXJ0IGluZm8gZnJvbSBwYXJ0IGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0geyp9IGF0dHIgUGFydCBhdHRyaWJ1dGVcclxuICogQHBhcmFtIHsqfSBlbGVtZW50IEVsZW1lbnQgd2l0aGluIHdoaWNoIHRoZSBwYXJ0IGV4aXN0c1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUZXh0IG9mIHRoZSBjc3MgcnVsZSBvZiB0aGUgZm9ybSBgc2VsZWN0b3IgeyBwcm9wZXJ0aWVzIH1gXHJcbiAqL1xyXG5mdW5jdGlvbiBydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpIHtcclxuICBsZXQgdGV4dCA9ICcnO1xyXG4gIHBhcnRJbmZvLmZvckVhY2goaW5mbyA9PiB7XHJcbiAgICBpZiAoIWluZm8uZm9yd2FyZCkge1xyXG4gICAgICBjb25zdCBwcm9wcyA9IHByb3BzRm9yUGFydChpbmZvLm5hbWUsIGVsZW1lbnQpO1xyXG4gICAgICBpZiAocHJvcHMpIHtcclxuICAgICAgICBmb3IgKGxldCBidWNrZXQgaW4gcHJvcHMpIHtcclxuICAgICAgICAgIGxldCBwcm9wc0J1Y2tldCA9IHByb3BzW2J1Y2tldF07XHJcbiAgICAgICAgICBsZXQgcGFydFByb3BzID0gW107XHJcbiAgICAgICAgICBmb3IgKGxldCBwIGluIHByb3BzQnVja2V0KSB7XHJcbiAgICAgICAgICAgIHBhcnRQcm9wcy5wdXNoKGAke3B9OiAke3Byb3BzQnVja2V0W3BdfTtgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRleHQgPSBgJHt0ZXh0fVxcbltwYXJ0PVwiJHthdHRyfVwiXSR7YnVja2V0fSB7XFxuXFx0JHtwYXJ0UHJvcHMuam9pbignXFxuXFx0Jyl9XFxufWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHRleHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQYXJzZXMgYSBwYXJ0IGF0dHJpYnV0ZSBpbnRvIGFuIGFycmF5IG9mIHBhcnQgaW5mb1xyXG4gKiBAcGFyYW0geyp9IGF0dHIgUGFydCBhdHRyaWJ1dGUgdmFsdWVcclxuICogQHJldHVybnMge2FycmF5fSBBcnJheSBvZiBwYXJ0IGluZm8gb2JqZWN0cyBvZiB0aGUgZm9ybSB7bmFtZSwgZm93YXJkfVxyXG4gKi9cclxuZnVuY3Rpb24gcGFydEluZm9Gcm9tQXR0cihhdHRyKSB7XHJcbiAgY29uc3QgcGllY2VzID0gYXR0ciA/IGF0dHIuc3BsaXQoL1xccyosXFxzKi8pIDogW107XHJcbiAgbGV0IHBhcnRzID0gW107XHJcbiAgcGllY2VzLmZvckVhY2gocCA9PiB7XHJcbiAgICBjb25zdCBtID0gcCA/IHAubWF0Y2goLyhbXj1cXHNdKikoPzpcXHMqPT5cXHMqKC4qKSk/LykgOiBbXTtcclxuICAgIGlmIChtKSB7XHJcbiAgICAgIHBhcnRzLnB1c2goe25hbWU6IG1bMl0gfHwgbVsxXSwgZm9yd2FyZDogbVsyXSA/IG1bMV0gOiBudWxsfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBhcnRzO1xyXG59XHJcblxyXG4vKipcclxuICogRm9yIGEgZ2l2ZW4gcGFydCBuYW1lIHJldHVybnMgYSBwcm9wZXJ0aWVzIG9iamVjdCB3aGljaCBzZXRzIGFueSBhbmNlc3RvclxyXG4gKiBwcm92aWRlZCBwYXJ0IHByb3BlcnRpZXMgdG8gdGhlIHByb3BlciBhbmNlc3RvciBwcm92aWRlZCBjc3MgdmFyaWFibGUgbmFtZS5cclxuICogZS5nLlxyXG4gKiBjb2xvcjogYHZhcigtLWUxLXBhcnQtYmFyLWNvbG9yKTtgXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcGFydFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aXRoaW4gd2hpY2ggZG9tIHdpdGggcGFydCBleGlzdHNcclxuICogQHBhcmFtIHtib29sZWFufSByZXF1aXJlVGhlbWUgVHJ1ZSBpZiBvbmx5IDo6dGhlbWUgc2hvdWxkIGJlIGNvbGxlY3RlZC5cclxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHByb3BlcnRpZXMgZm9yIHRoZSBnaXZlbiBwYXJ0IHNldCB0byBwYXJ0IHZhcmlhYmxlc1xyXG4gKiBwcm92aWRlZCBieSB0aGUgZWxlbWVudHMgYW5jZXN0b3JzLlxyXG4gKi9cclxuZnVuY3Rpb24gcHJvcHNGb3JQYXJ0KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xyXG4gIGNvbnN0IGhvc3QgPSBlbGVtZW50ICYmIGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xyXG4gIGlmICghaG9zdCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICAvLyBjb2xsZWN0IHByb3BzIGZyb20gaG9zdCBlbGVtZW50LlxyXG4gIGxldCBwcm9wcyA9IHByb3BzRnJvbUVsZW1lbnQobmFtZSwgaG9zdCwgcmVxdWlyZVRoZW1lKTtcclxuICAvLyBub3cgcmVjdXJzZSBhbmNlc3RvcnMgdG8gZmluZCBtYXRjaGluZyBgdGhlbWVgIHByb3BlcnRpZXNcclxuICBjb25zdCB0aGVtZVByb3BzID0gcHJvcHNGb3JQYXJ0KG5hbWUsIGhvc3QsIHRydWUpO1xyXG4gIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCB0aGVtZVByb3BzKTtcclxuICAvLyBub3cgcmVjdXJzZSBhbmNlc3RvcnMgdG8gZmluZCAqZm9yd2FyZGVkKiBwYXJ0IHByb3BlcnRpZXNcclxuICBpZiAoIXJlcXVpcmVUaGVtZSkge1xyXG4gICAgLy8gZm9yd2FyZGluZzogcmVjdXJzZXMgdXAgYW5jZXN0b3IgdHJlZSFcclxuICAgIGNvbnN0IHBhcnRJbmZvID0gcGFydEluZm9Gcm9tQXR0cihlbGVtZW50LmdldEF0dHJpYnV0ZSgncGFydCcpKTtcclxuICAgIC8vIHtuYW1lLCBmb3J3YXJkfSB3aGVyZSBgKmAgY2FuIGJlIGluY2x1ZGVkXHJcbiAgICBwYXJ0SW5mby5mb3JFYWNoKGluZm8gPT4ge1xyXG4gICAgICBsZXQgY2F0Y2hBbGwgPSBpbmZvLmZvcndhcmQgJiYgKGluZm8uZm9yd2FyZC5pbmRleE9mKCcqJykgPj0gMCk7XHJcbiAgICAgIGlmIChuYW1lID09IGluZm8uZm9yd2FyZCB8fCBjYXRjaEFsbCkge1xyXG4gICAgICAgIGNvbnN0IGFuY2VzdG9yTmFtZSA9IGNhdGNoQWxsID8gaW5mby5uYW1lLnJlcGxhY2UoJyonLCBuYW1lKSA6IGluZm8ubmFtZTtcclxuICAgICAgICBjb25zdCBmb3J3YXJkZWQgPSBwcm9wc0ZvclBhcnQoYW5jZXN0b3JOYW1lLCBob3N0KTtcclxuICAgICAgICBwcm9wcyA9IG1peFBhcnRQcm9wcyhwcm9wcywgZm9yd2FyZGVkKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJvcHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb2xsZWN0cyBjc3MgZm9yIHRoZSBnaXZlbiBuYW1lIGZyb20gdGhlIHBhcnQgZGF0YSBmb3IgdGhlIGdpdmVuXHJcbiAqIGVsZW1lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcGFydFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aXRoIHBhcnQgY3NzL2RhdGEuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVxdWlyZVRoZW1lIFRydWUgaWYgc2hvdWxkIG9ubHkgbWF0Y2ggOjp0aGVtZVxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgb2YgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHBhcnQgc2V0IHRvIHBhcnQgdmFyaWFibGVzXHJcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50LlxyXG4gKi9cclxuZnVuY3Rpb24gcHJvcHNGcm9tRWxlbWVudChuYW1lLCBlbGVtZW50LCByZXF1aXJlVGhlbWUpIHtcclxuICBsZXQgcHJvcHM7XHJcbiAgY29uc3QgcGFydHMgPSBwYXJ0RGF0YUZvckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgaWYgKHBhcnRzKSB7XHJcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICBpZiAocGFydHMpIHtcclxuICAgICAgcGFydHMuZm9yRWFjaCgocGFydCkgPT4ge1xyXG4gICAgICAgIGlmIChwYXJ0Lm5hbWUgPT0gbmFtZSAmJiAoIXJlcXVpcmVUaGVtZSB8fCBwYXJ0LmlzVGhlbWUpKSB7XHJcbiAgICAgICAgICBwcm9wcyA9IGFkZFBhcnRQcm9wcyhwcm9wcywgcGFydCwgaWQsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBwcm9wcztcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBwYXJ0IGNzcyB0byB0aGUgcHJvcHMgb2JqZWN0IGZvciB0aGUgZ2l2ZW4gcGFydC9uYW1lLlxyXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgT2JqZWN0IGNvbnRhaW5pbmcgcGFydCBjc3NcclxuICogQHBhcmFtIHtvYmplY3R9IHBhcnQgUGFydCBkYXRhXHJcbiAqIEBwYXJhbSB7bm1iZXJ9IGlkIGVsZW1lbnQgcGFydCBpZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lIG9mIHBhcnRcclxuICovXHJcbmZ1bmN0aW9uIGFkZFBhcnRQcm9wcyhwcm9wcywgcGFydCwgaWQsIG5hbWUpIHtcclxuICBwcm9wcyA9IHByb3BzIHx8IHt9O1xyXG4gIGNvbnN0IGJ1Y2tldCA9IHBhcnQuZW5kU2VsZWN0b3IgfHwgJyc7XHJcbiAgY29uc3QgYiA9IHByb3BzW2J1Y2tldF0gPSBwcm9wc1tidWNrZXRdIHx8IHt9O1xyXG4gIGZvciAobGV0IHAgaW4gcGFydC5wcm9wcykge1xyXG4gICAgYltwXSA9IGB2YXIoJHt2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwLCBwYXJ0LmVuZFNlbGVjdG9yKX0pYDtcclxuICB9XHJcbiAgcmV0dXJuIHByb3BzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtaXhQYXJ0UHJvcHMoYSwgYikge1xyXG4gIGlmIChhICYmIGIpIHtcclxuICAgIGZvciAobGV0IGkgaW4gYikge1xyXG4gICAgICAvLyBlbnN1cmUgc3RvcmFnZSBleGlzdHNcclxuICAgICAgaWYgKCFhW2ldKSB7XHJcbiAgICAgICAgYVtpXSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIE9iamVjdC5hc3NpZ24oYVtpXSwgYltpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhIHx8IGI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDdXN0b21FbGVtZW50IG1peGluIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gcHJvdmlkZSA6OnBhcnQvOjp0aGVtZSBzdXBwb3J0LlxyXG4gKiBAcGFyYW0geyp9IHN1cGVyQ2xhc3NcclxuICovXHJcbmV4cG9ydCBsZXQgUGFydFRoZW1lTWl4aW4gPSBzdXBlckNsYXNzID0+IHtcclxuXHJcbiAgcmV0dXJuIGNsYXNzIFBhcnRUaGVtZUNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XHJcblxyXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICAgIGlmIChzdXBlci5jb25uZWN0ZWRDYWxsYmFjaykge1xyXG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX2FwcGx5UGFydFRoZW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIF9hcHBseVBhcnRUaGVtZSgpIHtcclxuICAgICAgYXBwbHlQYXJ0VGhlbWUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0RXZlbnRzXHJcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBEZW1vc1xyXG59IGZyb20gJy4vZGVtb3MuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgWEhvc3QsXHJcbiAgICBYUmF0aW5nLFxyXG4gICAgWFRodW1ic1xyXG59IGZyb20gJy4vcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzJztcclxuaW1wb3J0IHtcclxuICAgIENvbnRyb2xQcmV6XHJcbn0gZnJvbSAnLi9jb250cm9sUHJlei5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBUeXBlVGV4dFxyXG59IGZyb20gJy4vdHlwZWRUZXh0LmpzJ1xyXG5cclxuXHJcblxyXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcclxuXHJcbiAgICAgICAgY29uc3QgaW5JZnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xyXG5cclxuXHJcbiAgICAgICAgbmV3IFR5cGVUZXh0KCk7XHJcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xyXG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcclxuICAgICAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xyXG4gICAgICAgICAgICAvLyBuZXcgQ29udHJvbFByZXooKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hZ2ljVmlkZW8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGUtaG91ZGluaS13b3JrZmxvdycsICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbEJhY2tGcmFnbWVudCgpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICAgICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgY2FsbEJhY2tGcmFnbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LXZpZGVvLW1hZ2ljJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnNyYyA9ICcuL2Fzc2V0cy9pbWFnZXMvbWFnaWMuZ2lmJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LXZpZGVvLXNlbnNvcicsICgpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbnNvclZpZGVvJykuc3JjID0gJy4vYXNzZXRzL2ltYWdlcy9nZW5lcmljLXNlbnNvci1hcGkuZ2lmJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZVRleHQge1xyXG5cclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Nzcy12YXItdHlwZScsICgpPT57XHJcblx0XHRcdHR5cGluZygndGl0bGUtY3NzLXZhcicsIDEwLCAwKVxyXG5cdFx0XHQudHlwZSgnQ1NTIFZhcmlhYmxlcycpLndhaXQoMjAwMCkuc3BlZWQoNTApXHJcblx0XHRcdC5kZWxldGUoJ1ZhcmlhYmxlcycpLndhaXQoNTAwKS5zcGVlZCgxMDApXHJcblx0XHRcdC50eXBlKCdDdXN0b20gUHJvcGVydGllcycpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59Il19
