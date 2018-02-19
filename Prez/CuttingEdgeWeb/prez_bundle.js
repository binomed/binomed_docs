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

    // generic sensor
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'generic-sensor',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 0,
            nbLines: 1,
            width: '60%'
        }, {
            line: 2,
            nbLines: 3,
            width: '80%'
        }, {
            line: 6,
            nbLines: 2,
            width: '80%'
        }, {
            line: 9,
            nbLines: 3,
            width: '80%'
        }]
    });

    // Accelerometer sensor
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'accelerometer-sensor',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 0,
            nbLines: 4,
            width: '100%'
        }, {
            line: 6,
            nbLines: 1,
            left: '50px',
            width: '80%'
        }, {
            line: 7,
            left: '50px',
            nbLines: 5,
            width: '80%'
        }, {
            line: 13,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NvbnRyb2xQcmV6LmpzIiwic2NyaXB0cy9kZW1vcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlKcy5qcyIsInNjcmlwdHMvaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzL2hpZ2hsaWdodEV2ZW50LmpzIiwic2NyaXB0cy9saWJzL3RoaW5neS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzIiwic2NyaXB0cy9wYXJ0VGhlbWUvbGlicy9wYXJ0LXRoZW1lLmpzIiwic2NyaXB0cy9wcmV6LmpzIiwic2NyaXB0cy90eXBlZFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7Ozs7SUFJYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7O0FBQ1YsYUFBSyxlQUFMLEdBQXVCLEtBQXZCOztBQUVBLGVBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXhDO0FBQ0g7Ozs7OENBRXFCO0FBQ2xCLGdCQUFJO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3RCO0FBQ0g7QUFDRCxvQkFBTSxTQUFTLG1CQUFXO0FBQ3RCLGdDQUFZO0FBRFUsaUJBQVgsQ0FBZjtBQUdBLHNCQUFNLE9BQU8sT0FBUCxFQUFOO0FBQ0EscUJBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLG9CQUFNLFVBQVUsTUFBTSxPQUFPLGVBQVAsRUFBdEI7QUFDQSxvQkFBTSxhQUFhLE1BQU0sYUFBYSxpQkFBYixFQUF6QjtBQUNBLG9CQUFJLGVBQWUsUUFBbkIsRUFBNkI7QUFDekIsNEJBQVEsR0FBUix5Q0FBa0QsUUFBUSxLQUExRDtBQUNILGlCQUZELE1BRU87QUFDSCw0QkFBUSxHQUFS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WUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYO0FBQ0E7QUFDQTtBQUNIOztBQUVELGVBQU8sZ0JBQVAsQ0FBd0IsMEJBQXhCLEVBQW9ELFlBQU07O0FBRXRELHFCQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLEtBQTlDLENBQW9ELE9BQXBELEdBQThELEVBQTlEO0FBQ0EscUJBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsS0FBOUMsQ0FBb0QsT0FBcEQsR0FBOEQsTUFBOUQ7QUFDQSxtQkFBTyxnQkFBUCxDQUF3QixlQUF4QixFQUF5QyxnQkFBekM7O0FBRUEscUJBQVMsZ0JBQVQsR0FBNEI7QUFDeEIseUJBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsS0FBOUMsQ0FBb0QsT0FBcEQsR0FBOEQsTUFBOUQ7QUFDQSx5QkFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxLQUE5QyxDQUFvRCxPQUFwRCxHQUE4RCxFQUE5RDtBQUNBLHVCQUFPLG1CQUFQLENBQTJCLGVBQTNCLEVBQTRDLGdCQUE1QztBQUNIO0FBQ0osU0FYRDtBQWFIOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQWpDRDs7O0FDdkJBOzs7Ozs7OztJQUVhLFEsV0FBQSxRLEdBRVosb0JBQWE7QUFBQTs7QUFDWixRQUFPLGdCQUFQLENBQXdCLGNBQXhCLEVBQXdDLFlBQUk7QUFDM0MsU0FBTyxlQUFQLEVBQXdCLEVBQXhCLEVBQTRCLENBQTVCLEVBQ0MsSUFERCxDQUNNLGVBRE4sRUFDdUIsSUFEdkIsQ0FDNEIsSUFENUIsRUFDa0MsS0FEbEMsQ0FDd0MsRUFEeEMsRUFFQyxNQUZELENBRVEsV0FGUixFQUVxQixJQUZyQixDQUUwQixHQUYxQixFQUUrQixLQUYvQixDQUVxQyxHQUZyQyxFQUdDLElBSEQsQ0FHTSxtQkFITjtBQUlBLEVBTEQ7QUFNQSxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7XG4gICAgVGhpbmd5XG59IGZyb20gJy4vbGlicy90aGluZ3kuanMnO1xuXG5leHBvcnQgY2xhc3MgQ29udHJvbFByZXoge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRoaW5neUNvbm5lY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCB0aGlzLnRoaW5neUNvbnRyb2wuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgdGhpbmd5Q29udHJvbCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRoaW5neUNvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRoaW5neSA9IG5ldyBUaGluZ3koe1xuICAgICAgICAgICAgICAgIGxvZ0VuYWJsZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXdhaXQgdGhpbmd5LmNvbm5lY3QoKTtcbiAgICAgICAgICAgIHRoaXMudGhpbmd5Q29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IGJhdHRlcnkgPSBhd2FpdCB0aGluZ3kuZ2V0QmF0dGVyeUxldmVsKCk7XG4gICAgICAgICAgICBjb25zdCBwZXJtaXNzaW9uID0gYXdhaXQgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgICAgICAgICBpZiAocGVybWlzc2lvbiA9PT0gXCJkZW5pZWRcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUaGluZ3kgQ29ubmVjdCBhbmQgbGV2ZWwgYmF0dGVyeSA6ICR7YmF0dGVyeS52YWx1ZX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRoaW5neSBDb25uZWN0IGFuZCBsZXZlbCBiYXR0ZXJ5IDogJHtiYXR0ZXJ5LnZhbHVlfWAsIGJhdHRlcnkpO1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpZmljYXRpb24oXCJUaGluZ3kgQ29ubmVjdCAhIFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGAgVGhpbmd5IENvbm5lY3QgYW5kIGxldmVsIGJhdHRlcnkgOiAke2JhdHRlcnkudmFsdWV9JWBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpbmd5LmJ1dHRvbkVuYWJsZSgoc3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGFwJywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBSZXZlYWwubmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdGUpO1xuXG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCB7XG4gICAgQXBwbHlDc3Ncbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xuaW1wb3J0IHtcbiAgICBBcHBseUNvZGVNaXJvclxufSBmcm9tICcuL2hlbHBlci9hcHBseUpzLmpzJztcblxuZXhwb3J0IGNsYXNzIERlbW9zIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXJJbkpTKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9QYXJ0VGhlbWUoKTtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhcigpIHtcbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcycpLFxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudCBoMntcbiAgICAtLWEtc3VwZXItdmFyOiAjRkZGO1xufVxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XG5cbn1cbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xuXG59YFxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFySW5KUygpIHtcblxuICAgICAgICBsZXQgaW5kaWNlSCA9IC0xO1xuICAgICAgICBsZXQgc3Vic2NyaWJlID0gZmFsc2U7XG4gICAgICAgIGxldCBjbGllbnRSZWN0ID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBnaG9zdFBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vLWdob3N0LXBhcmVudCcpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NNb3VzZShldmVudCkge1xuICAgICAgICAgICAgY29uc3QgZGVsdGFYID0gKGNsaWVudFJlY3Qud2lkdGggKyBjbGllbnRSZWN0LmxlZnQpIC0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICAgIGNvbnN0IG1lZGlhbiA9IGNsaWVudFJlY3Qud2lkdGggLyAyO1xuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGRlbHRhWCA+IDAgPyAobWVkaWFuIC0gZGVsdGFYKSA6IChtZWRpYW4gKyAoLTEgKiBkZWx0YVgpKTtcbiAgICAgICAgICAgIGdob3N0UGFyZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcG9zJywgYCR7bGVmdH1weGApO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYGRlbHRhWDogJHtkZWx0YVh9IC8gbWVkaWFuIDogJHttZWRpYW59IC8gd2lkdGggOiAke3dpZHRofSAvIGxlZnQgOiAke2xlZnR9YClcbiAgICAgICAgfVxuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdnaG9zdC1zdGF0ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGluZGljZUggPSBSZXZlYWwuZ2V0SW5kaWNlcygpLmg7XG4gICAgICAgICAgICAgICAgY2xpZW50UmVjdCA9IGdob3N0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGdob3N0UGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHByb2Nlc3NNb3VzZSk7XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlICYmIGluZGljZUggIT0gZXZlbnQuaW5kZXhoKSB7XG4gICAgICAgICAgICAgICAgZ2hvc3RQYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcHJvY2Vzc01vdXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MtaW4tanMtY3NzJyksXG4gICAgICAgICAgICBgI2RlbW8tZ2hvc3QtcGFyZW50IHtcbiAgICAtLWxlZnQtcG9zOiAwO1xufVxuI2RlbW8tZ2hvc3QtcGFyZW50IC5kZW1vLXNoYWRvdyxcbiNkZW1vLWdob3N0LXBhcmVudCAuZGVtby1naG9zdCB7XG4gICAgbGVmdDogdmFyKC0tbGVmdC1wb3MpO1xufWBcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzLWluLWpzLWpzJyksXG4gICAgICAgICAgICAnamF2YXNjcmlwdCcsXG4gICAgICAgICAgICBgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZGVsdGFYID0gdGhpcy53aWR0aCAtIGV2ZW50LmNsaWVudFg7XG4gICAgY29uc3QgbWVkaWFuID0gdGhpcy53aWR0aCAvIDI7XG4gICAgY29uc3QgZ2hvc3RQYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtby1naG9zdC1wYXJlbnQnKTtcbiAgICBjb25zdCBsZWZ0ID0gZXZlbnQuY2xpZW50WCA+IG1lZGlhbiA/IChldmVudC5jbGllbnRYIC0gbWVkaWFuKSA6IC0xICogKG1lZGlhbiAtIGV2ZW50LmNsaWVudFgpO1xuXG4gICAgZ2hvc3RQYXJlbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wb3MnLCBcXGBcXCR7bGVmdH1weFxcYCk7XG59KTtgKTtcbiAgICB9XG5cbiAgICBfZGVtb1BhcnRUaGVtZSgpIHtcbiAgICAgICAgbmV3IEFwcGx5Q29kZU1pcm9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhcnQtY3NzJyksXG4gICAgICAgICAgICAnY3NzJyxcbiAgICAgICAgICAgIGB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XG4gICAgcGFkZGluZzogNHB4O1xuICAgIG1pbi13aWR0aDogMjBweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG4udW5vOmhvdmVyOjpwYXJ0KHN1YmplY3QpIHtcbiAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xufVxuLmR1bzo6cGFydChzdWJqZWN0KSB7XG4gICAgYmFja2dyb3VuZDogZ29sZGVucm9kO1xufVxuLnVubzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcbiAgICBiYWNrZ3JvdW5kOiBncmVlbjtcbn1cbi51bm86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcbiAgICBiYWNrZ3JvdW5kOiB0b21hdG87XG59XG4uZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xuICAgIGJhY2tncm91bmQ6IHllbGxvdztcbn1cbi5kdW86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcbiAgICBiYWNrZ3JvdW5kOiBibGFjaztcbn1cbngtcmF0aW5nOjp0aGVtZSh0aHVtYi11cCkge1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbn1cbmApO1xuXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYXJ0LWh0bWwnKSxcbiAgICAgICAgICAgICd0ZXh0L2h0bWwnLFxuICAgICAgICAgICAgYDx4LXRodW1icz5cbiAgICAjc2hhZG93LXJvb3RcbiAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cbiAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi1kb3duXCI+8J+RjjwvZGl2PlxuPC94LXRodW1icz5cbjx4LXJhdGluZz5cbiAgICAjc2hhZG93LXJvb3RcbiAgICA8ZGl2IHBhcnQ9XCJzdWJqZWN0XCI+PHNsb3Q+PC9zbG90PjwvZGl2PlxuICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XG48L3gtcmF0aW5nPlxuXG48eC1yYXRpbmcgY2xhc3M9XCJ1bm9cIj7inaTvuI88L3gtcmF0aW5nPlxuPHgtcmF0aW5nIGNsYXNzPVwiZHVvXCI+8J+ktzwveC1yYXRpbmc+XG5gKTtcbiAgICB9XG5cbiAgICBfZGVtb1BhaW50QXBpKCkge1xuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLXdvcmtsZXQuanMnKTtcblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGktY3NzJyksXG4gICAgICAgICAgICBgXG4jcmVuZGVyLWVsZW1lbnQtcGFpbnQtYXBpIHtcbiAgICAtLWNpcmNsZS1jb2xvcjogI0ZGRjtcbiAgICAtLXdpZHRoLWNpcmNsZTogMTAwcHg7XG4gICAgd2lkdGg6IHZhcigtLXdpZHRoLWNpcmNsZSk7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogcGFpbnQoY2lyY2xlKTtcbn1cblxuICAgICAgICAgICAgYFxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGknKSxcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcbiAgICAgICAgICAgIGBwYWludChjdHgsIGdlb20sIHByb3BlcnRpZXMpIHtcbiAgICAvLyBDaGFuZ2UgdGhlIGZpbGwgY29sb3IuXG4gICAgY29uc3QgY29sb3IgPSBwcm9wZXJ0aWVzLmdldCgnLS1jaXJjbGUtY29sb3InKS50b1N0cmluZygpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNlbnRlciBwb2ludCBhbmQgcmFkaXVzLlxuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWluKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIpO1xuICAgIC8vIERyYXcgdGhlIGNpcmNsZSBcXFxcby9cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyhnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyLCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICBjdHguZmlsbCgpO1xufVxuICAgICAgICAgICAgYCk7XG4gICAgfVxuXG59IiwiJ3VzZSBzdGljdCdcblxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCkge1xuICAgICAgICBjb25zdCBjb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnYmxhY2tib2FyZCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdGhpcy5zdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcblxuICAgICAgICB0aGlzLnN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xuICAgICAgICB9XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZSk7XG5cbiAgICAgICAgY29kZU1pcnJvckNzcy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcbiAgICAgICAgY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyhjb2RlTWlycm9yQ3NzLmdldFZhbHVlKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hcHBseUNzcyhpbml0aWFsQ29udGVudCk7XG4gICAgfVxuXG4gICAgYXBwbHlDc3ModmFsdWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0LmRlbGV0ZVJ1bGUoMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuICAgICAgICB2YWx1ZS5zcGxpdCgnfScpXG4gICAgICAgICAgICAubWFwKHN0ciA9PiBzdHIudHJpbSgpKVxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcyArICd9Jyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxufSIsIid1c2Ugc3RpY3QnXG5cbmV4cG9ydCBjbGFzcyBBcHBseUNvZGVNaXJvciB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWx0LCBtb2RlLCBpbml0aWFsQ29udGVudCkge1xuICAgICAgICBjb25zdCBjb2RlTWlycm9ySlMgPSBDb2RlTWlycm9yKGVsdCwge1xuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxuICAgICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnYmxhY2tib2FyZCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29kZU1pcnJvckpTLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xuICAgIH1cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzkwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNWVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxuICAgICAgICB9KTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG5cbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xuXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uIGluIEpTXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZS1pbi1qcycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcxMDBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjYwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzM1MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIDo6UGFydFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwYXJ0JyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUZW1wbGF0ZSBJbnN0YW50aWF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3RlbXBsYXRlLWluc3RhbnRpYXRpb24nLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBIVE1MIE1vZHVsZVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdodG1sLW1vZHVsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEwLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQYWludCBBUElcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncGFpbnQtYXBpJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8gZ2VuZXJpYyBzZW5zb3JcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnZ2VuZXJpYy1zZW5zb3InLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWNjZWxlcm9tZXRlciBzZW5zb3JcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnYWNjZWxlcm9tZXRlci1zZW5zb3InLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDcsXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwcHgnLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTMsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIvKiogKi9cbmV4cG9ydCBjbGFzcyBUaGluZ3kge1xuICAvKipcbiAgICAgKiAgVGhpbmd5OjUyIFdlYiBCbHVldG9vdGggQVBJLiA8YnI+XG4gICAgICogIEJMRSBzZXJ2aWNlIGRldGFpbHMge0BsaW5rIGh0dHBzOi8vbm9yZGljc2VtaWNvbmR1Y3Rvci5naXRodWIuaW8vTm9yZGljLVRoaW5neTUyLUZXL2RvY3VtZW50YXRpb24vZmlybXdhcmVfYXJjaGl0ZWN0dXJlLmh0bWwjZndfYXJjaF9ibGVfc2VydmljZXMgaGVyZX1cbiAgICAgKlxuICAgICAqXG4gICAgICogIEBjb25zdHJ1Y3RvclxuICAgICAqICBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7bG9nRW5hYmxlZDogZmFsc2V9XSAtIE9wdGlvbnMgb2JqZWN0IGZvciBUaGluZ3lcbiAgICAgKiAgQHBhcmFtIHtib29sZWFufSBvcHRpb25zLmxvZ0VuYWJsZWQgLSBFbmFibGVzIGxvZ2dpbmcgb2YgYWxsIEJMRSBhY3Rpb25zLlxuICAgICAqXG4gICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHtsb2dFbmFibGVkOiBmYWxzZX0pIHtcbiAgICB0aGlzLmxvZ0VuYWJsZWQgPSBvcHRpb25zLmxvZ0VuYWJsZWQ7XG5cbiAgICAvLyBUQ1MgPSBUaGluZ3kgQ29uZmlndXJhdGlvbiBTZXJ2aWNlXG4gICAgdGhpcy5UQ1NfVVVJRCA9IFwiZWY2ODAxMDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UQ1NfTkFNRV9VVUlEID0gXCJlZjY4MDEwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRDU19BRFZfUEFSQU1TX1VVSUQgPSBcImVmNjgwMTAyLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVENTX0NPTk5fUEFSQU1TX1VVSUQgPSBcImVmNjgwMTA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVENTX0VERFlTVE9ORV9VVUlEID0gXCJlZjY4MDEwNS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRDU19DTE9VRF9UT0tFTl9VVUlEID0gXCJlZjY4MDEwNi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRDU19GV19WRVJfVVVJRCA9IFwiZWY2ODAxMDctOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UQ1NfTVRVX1JFUVVFU1RfVVVJRCA9IFwiZWY2ODAxMDgtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG5cbiAgICAvLyBURVMgPSBUaGluZ3kgRW52aXJvbm1lbnQgU2VydmljZVxuICAgIHRoaXMuVEVTX1VVSUQgPSBcImVmNjgwMjAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVEVTX1RFTVBfVVVJRCA9IFwiZWY2ODAyMDEtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5URVNfUFJFU1NVUkVfVVVJRCA9IFwiZWY2ODAyMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5URVNfSFVNSURJVFlfVVVJRCA9IFwiZWY2ODAyMDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5URVNfR0FTX1VVSUQgPSBcImVmNjgwMjA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVEVTX0NPTE9SX1VVSUQgPSBcImVmNjgwMjA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVEVTX0NPTkZJR19VVUlEID0gXCJlZjY4MDIwNi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcblxuICAgIC8vIFRVSVMgPSBUaGluZ3kgVXNlciBJbnRlcmZhY2UgU2VydmljZVxuICAgIHRoaXMuVFVJU19VVUlEID0gXCJlZjY4MDMwMC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRVSVNfTEVEX1VVSUQgPSBcImVmNjgwMzAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVFVJU19CVE5fVVVJRCA9IFwiZWY2ODAzMDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UVUlTX1BJTl9VVUlEID0gXCJlZjY4MDMwMy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcblxuICAgIC8vIFRNUyA9IFRoaW5neSBNb3Rpb24gU2VydmljZVxuICAgIHRoaXMuVE1TX1VVSUQgPSBcImVmNjgwNDAwLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX0NPTkZJR19VVUlEID0gXCJlZjY4MDQwMS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19UQVBfVVVJRCA9IFwiZWY2ODA0MDItOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfT1JJRU5UQVRJT05fVVVJRCA9IFwiZWY2ODA0MDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfUVVBVEVSTklPTl9VVUlEID0gXCJlZjY4MDQwNC05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19TVEVQX1VVSUQgPSBcImVmNjgwNDA1LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX1JBV19VVUlEID0gXCJlZjY4MDQwNi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19FVUxFUl9VVUlEID0gXCJlZjY4MDQwNy05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRNU19ST1RfTUFUUklYX1VVSUQgPSBcImVmNjgwNDA4LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVE1TX0hFQURJTkdfVVVJRCA9IFwiZWY2ODA0MDktOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UTVNfR1JBVklUWV9VVUlEID0gXCJlZjY4MDQwYS05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcblxuICAgIC8vIFRTUyA9IFRoaW5neSBTb3VuZCBTZXJ2aWNlXG4gICAgdGhpcy5UU1NfVVVJRCA9IFwiZWY2ODA1MDAtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UU1NfQ09ORklHX1VVSUQgPSBcImVmNjgwNTAxLTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuICAgIHRoaXMuVFNTX1NQRUFLRVJfREFUQV9VVUlEID0gXCJlZjY4MDUwMi05YjM1LTQ5MzMtOWIxMC01MmZmYTk3NDAwNDJcIjtcbiAgICB0aGlzLlRTU19TUEVBS0VSX1NUQVRfVVVJRCA9IFwiZWY2ODA1MDMtOWIzNS00OTMzLTliMTAtNTJmZmE5NzQwMDQyXCI7XG4gICAgdGhpcy5UU1NfTUlDX1VVSUQgPSBcImVmNjgwNTA0LTliMzUtNDkzMy05YjEwLTUyZmZhOTc0MDA0MlwiO1xuXG4gICAgdGhpcy5zZXJ2aWNlVVVJRHMgPSBbXG4gICAgICBcImJhdHRlcnlfc2VydmljZVwiLFxuICAgICAgdGhpcy5UQ1NfVVVJRCxcbiAgICAgIHRoaXMuVEVTX1VVSUQsXG4gICAgICB0aGlzLlRVSVNfVVVJRCxcbiAgICAgIHRoaXMuVE1TX1VVSUQsXG4gICAgICB0aGlzLlRTU19VVUlELFxuICAgIF07XG5cbiAgICB0aGlzLmJsZUlzQnVzeSA9IGZhbHNlO1xuICAgIHRoaXMuZGV2aWNlO1xuICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMudGVtcEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5nYXNFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMuaGVhZGluZ0V2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVycyA9IFtudWxsLCBbXV07XG4gICAgdGhpcy5zcGVha2VyU3RhdHVzRXZlbnRMaXN0ZW5lcnMgPSBbbnVsbCwgW11dO1xuICAgIHRoaXMubWljcm9waG9uZUV2ZW50TGlzdGVuZXJzID0gW251bGwsIFtdXTtcbiAgfVxuXG4gIC8qKlxuICAgICAqICBNZXRob2QgdG8gcmVhZCBkYXRhIGZyb20gYSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljLlxuICAgICAqICBJbXBsZW1lbnRzIGEgc2ltcGxlIHNvbHV0aW9uIHRvIGF2b2lkIHN0YXJ0aW5nIG5ldyBHQVRUIHJlcXVlc3RzIHdoaWxlIGFub3RoZXIgaXMgcGVuZGluZy5cbiAgICAgKiAgQW55IGF0dGVtcHQgdG8gcmVhZCB3aGlsZSBhbm90aGVyIEdBVFQgb3BlcmF0aW9uIGlzIGluIHByb2dyZXNzLCB3aWxsIHJlc3VsdCBpbiBhIHJlamVjdGVkIHByb21pc2UuXG4gICAgICpcbiAgICAgKiAgQGFzeW5jXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBjaGFyYWN0ZXJpc3RpYyAtIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMgb2JqZWN0XG4gICAgICogIEByZXR1cm4ge1Byb21pc2U8RGF0YVZpZXc+fSBSZXR1cm5zIFVpbnQ4QXJyYXkgd2hlbiByZXNvbHZlZCBvciBhbiBlcnJvciB3aGVuIHJlamVjdGVkXG4gICAgICpcbiAgICAgKiAgQHByaXZhdGVcblxuICAgICovXG4gIGFzeW5jIF9yZWFkRGF0YShjaGFyYWN0ZXJpc3RpYykge1xuICAgIGlmICghdGhpcy5ibGVJc0J1c3kpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgZGF0YUFycmF5ID0gYXdhaXQgY2hhcmFjdGVyaXN0aWMucmVhZFZhbHVlKCk7XG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIGRhdGFBcnJheTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkdBVFQgb3BlcmF0aW9uIGFscmVhZHkgcGVuZGluZ1wiKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBNZXRob2QgdG8gd3JpdGUgZGF0YSB0byBhIFdlYiBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMuXG4gICAqICBJbXBsZW1lbnRzIGEgc2ltcGxlIHNvbHV0aW9uIHRvIGF2b2lkIHN0YXJ0aW5nIG5ldyBHQVRUIHJlcXVlc3RzIHdoaWxlIGFub3RoZXIgaXMgcGVuZGluZy5cbiAgICogIEFueSBhdHRlbXB0IHRvIHNlbmQgZGF0YSBkdXJpbmcgYW5vdGhlciBHQVRUIG9wZXJhdGlvbiB3aWxsIHJlc3VsdCBpbiBhIHJlamVjdGVkIHByb21pc2UuXG4gICAqICBObyByZXRyYW5zbWlzc2lvbiBpcyBpbXBsZW1lbnRlZCBhdCB0aGlzIGxldmVsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge09iamVjdH0gY2hhcmFjdGVyaXN0aWMgLSBXZWIgQmx1ZXRvb3RoIGNoYXJhY3RlcmlzdGljIG9iamVjdFxuICAgKiAgQHBhcmFtIHtVaW50OEFycmF5fSBkYXRhQXJyYXkgLSBUeXBlZCBhcnJheSBvZiBieXRlcyB0byBzZW5kXG4gICAqICBAcmV0dXJuIHtQcm9taXNlfVxuICAgKlxuICAgKiAgQHByaXZhdGVcbiAgICpcbiAgKi9cbiAgYXN5bmMgX3dyaXRlRGF0YShjaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KSB7XG4gICAgaWYgKCF0aGlzLmJsZUlzQnVzeSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5ibGVJc0J1c3kgPSB0cnVlO1xuICAgICAgICBhd2FpdCBjaGFyYWN0ZXJpc3RpYy53cml0ZVZhbHVlKGRhdGFBcnJheSk7XG4gICAgICAgIHRoaXMuYmxlSXNCdXN5ID0gZmFsc2U7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJHQVRUIG9wZXJhdGlvbiBhbHJlYWR5IHBlbmRpbmdcIikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgQ29ubmVjdHMgdG8gVGhpbmd5LlxuICAgKiAgVGhlIGZ1bmN0aW9uIHN0b3JlcyBhbGwgZGlzY292ZXJlZCBzZXJ2aWNlcyBhbmQgY2hhcmFjdGVyaXN0aWNzIHRvIHRoZSBUaGluZ3kgb2JqZWN0LlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhbiBlbXB0eSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBjb25uZWN0KCkge1xuICAgIHRyeSB7XG4gICAgICAvLyBTY2FuIGZvciBUaGluZ3lzXG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBTY2FubmluZyBmb3IgZGV2aWNlcyB3aXRoIHNlcnZpY2UgVVVJRCBlcXVhbCB0byAke3RoaXMuVENTX1VVSUR9YCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGV2aWNlID0gYXdhaXQgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHtcbiAgICAgICAgZmlsdGVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNlcnZpY2VzOiBbdGhpcy5UQ1NfVVVJRF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgb3B0aW9uYWxTZXJ2aWNlczogdGhpcy5zZXJ2aWNlVVVJRHMsXG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEZvdW5kIFRoaW5neSBuYW1lZCBcIiR7dGhpcy5kZXZpY2UubmFtZX1cIiwgdHJ5aW5nIHRvIGNvbm5lY3RgKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ29ubmVjdCB0byBHQVRUIHNlcnZlclxuICAgICAgY29uc3Qgc2VydmVyID0gYXdhaXQgdGhpcy5kZXZpY2UuZ2F0dC5jb25uZWN0KCk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBDb25uZWN0ZWQgdG8gXCIke3RoaXMuZGV2aWNlLm5hbWV9XCJgKTtcbiAgICAgIH1cblxuICAgICAgLy8gQmF0dGVyeSBzZXJ2aWNlXG4gICAgICBjb25zdCBiYXR0ZXJ5U2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZShcImJhdHRlcnlfc2VydmljZVwiKTtcbiAgICAgIHRoaXMuYmF0dGVyeUNoYXJhY3RlcmlzdGljID0gYXdhaXQgYmF0dGVyeVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWMoXCJiYXR0ZXJ5X2xldmVsXCIpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgYmF0dGVyeSBzZXJ2aWNlIGFuZCBiYXR0ZXJ5IGxldmVsIGNoYXJhY3RlcmlzdGljXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGluZ3kgY29uZmlndXJhdGlvbiBzZXJ2aWNlXG4gICAgICB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVENTX1VVSUQpO1xuICAgICAgdGhpcy5uYW1lQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX05BTUVfVVVJRCk7XG4gICAgICB0aGlzLmFkdlBhcmFtc0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRDU19BRFZfUEFSQU1TX1VVSUQpO1xuICAgICAgdGhpcy5jbG91ZFRva2VuQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0NMT1VEX1RPS0VOX1VVSUQpO1xuICAgICAgdGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX0NPTk5fUEFSQU1TX1VVSUQpO1xuICAgICAgdGhpcy5lZGR5c3RvbmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfRUREWVNUT05FX1VVSUQpO1xuICAgICAgdGhpcy5maXJtd2FyZVZlcnNpb25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UQ1NfRldfVkVSX1VVSUQpO1xuICAgICAgdGhpcy5tdHVSZXF1ZXN0Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVENTX01UVV9SRVFVRVNUX1VVSUQpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IGNvbmZpZ3VyYXRpb24gc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpbmd5IGVudmlyb25tZW50IHNlcnZpY2VcbiAgICAgIHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlID0gYXdhaXQgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuVEVTX1VVSUQpO1xuICAgICAgdGhpcy50ZW1wZXJhdHVyZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfVEVNUF9VVUlEKTtcbiAgICAgIHRoaXMuY29sb3JDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0NPTE9SX1VVSUQpO1xuICAgICAgdGhpcy5nYXNDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0dBU19VVUlEKTtcbiAgICAgIHRoaXMuaHVtaWRpdHlDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuZW52aXJvbm1lbnRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVEVTX0hVTUlESVRZX1VVSUQpO1xuICAgICAgdGhpcy5wcmVzc3VyZUNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5lbnZpcm9ubWVudFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5URVNfUFJFU1NVUkVfVVVJRCk7XG4gICAgICB0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLmVudmlyb25tZW50U2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRFU19DT05GSUdfVVVJRCk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgZW52aXJvbm1lbnQgc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpbmd5IHVzZXIgaW50ZXJmYWNlIHNlcnZpY2VcbiAgICAgIHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UVUlTX1VVSUQpO1xuICAgICAgdGhpcy5idXR0b25DaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMudXNlckludGVyZmFjZVNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UVUlTX0JUTl9VVUlEKTtcbiAgICAgIHRoaXMubGVkQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFVJU19MRURfVVVJRCk7XG4gICAgICB0aGlzLmV4dGVybmFsUGluQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnVzZXJJbnRlcmZhY2VTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFVJU19QSU5fVVVJRCk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgdXNlciBpbnRlcmZhY2Ugc2VydmljZSBhbmQgaXRzIGNoYXJhY3RlcmlzdGljc1wiKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpbmd5IG1vdGlvbiBzZXJ2aWNlXG4gICAgICB0aGlzLm1vdGlvblNlcnZpY2UgPSBhd2FpdCBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5UTVNfVVVJRCk7XG4gICAgICB0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0NPTkZJR19VVUlEKTtcbiAgICAgIHRoaXMuZXVsZXJDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19FVUxFUl9VVUlEKTtcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX0dSQVZJVFlfVVVJRCk7XG4gICAgICB0aGlzLmhlYWRpbmdDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19IRUFESU5HX1VVSUQpO1xuICAgICAgdGhpcy5vcmllbnRhdGlvbkNoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX09SSUVOVEFUSU9OX1VVSUQpO1xuICAgICAgdGhpcy5xdWF0ZXJuaW9uQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfUVVBVEVSTklPTl9VVUlEKTtcbiAgICAgIHRoaXMubW90aW9uUmF3Q2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLm1vdGlvblNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UTVNfUkFXX1VVSUQpO1xuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeENoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5tb3Rpb25TZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVE1TX1JPVF9NQVRSSVhfVVVJRCk7XG4gICAgICB0aGlzLnN0ZXBDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19TVEVQX1VVSUQpO1xuICAgICAgdGhpcy50YXBDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMubW90aW9uU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRNU19UQVBfVVVJRCk7XG4gICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY292ZXJlZCBUaGluZ3kgbW90aW9uIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaW5neSBzb3VuZCBzZXJ2aWNlXG4gICAgICB0aGlzLnNvdW5kU2VydmljZSA9IGF3YWl0IHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLlRTU19VVUlEKTtcbiAgICAgIHRoaXMudHNzQ29uZmlnQ2hhcmFjdGVyaXN0aWMgPSBhd2FpdCB0aGlzLnNvdW5kU2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLlRTU19DT05GSUdfVVVJRCk7XG4gICAgICB0aGlzLm1pY3JvcGhvbmVDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX01JQ19VVUlEKTtcbiAgICAgIHRoaXMuc3BlYWtlckRhdGFDaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IHRoaXMuc291bmRTZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuVFNTX1NQRUFLRVJfREFUQV9VVUlEKTtcbiAgICAgIHRoaXMuc3BlYWtlclN0YXR1c0NoYXJhY3RlcmlzdGljID0gYXdhaXQgdGhpcy5zb3VuZFNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5UU1NfU1BFQUtFUl9TVEFUX1VVSUQpO1xuICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2NvdmVyZWQgVGhpbmd5IHNvdW5kIHNlcnZpY2UgYW5kIGl0cyBjaGFyYWN0ZXJpc3RpY3NcIik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIE1ldGhvZCB0byBkaXNjb25uZWN0IGZyb20gVGhpbmd5LlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhbiBlbXB0eSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKi9cbiAgYXN5bmMgZGlzY29ubmVjdCgpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5kZXZpY2UuZ2F0dC5kaXNjb25uZWN0KCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gZW5hYmxlIGFuZCBkaXNhYmxlIG5vdGlmaWNhdGlvbnMgZm9yIGEgY2hhcmFjdGVyaXN0aWNcbiAgYXN5bmMgX25vdGlmeUNoYXJhY3RlcmlzdGljKGNoYXJhY3RlcmlzdGljLCBlbmFibGUsIG5vdGlmeUhhbmRsZXIpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5zdGFydE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90aWZpY2F0aW9ucyBlbmFibGVkIGZvciBcIiArIGNoYXJhY3RlcmlzdGljLnV1aWQpO1xuICAgICAgICB9XG4gICAgICAgIGNoYXJhY3RlcmlzdGljLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZFwiLCBub3RpZnlIYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMuc3RvcE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90aWZpY2F0aW9ucyBkaXNhYmxlZCBmb3IgXCIsIGNoYXJhY3RlcmlzdGljLnV1aWQpO1xuICAgICAgICB9XG4gICAgICAgIGNoYXJhY3RlcmlzdGljLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZFwiLCBub3RpZnlIYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiAgQ29uZmlndXJhdGlvbiBzZXJ2aWNlICAqL1xuICAvKipcbiAgICogIEdldHMgdGhlIG5hbWUgb2YgdGhlIFRoaW5neSBkZXZpY2UuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nfEVycm9yPn0gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBuYW1lIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0TmFtZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubmFtZUNoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkZWNvZGVyLmRlY29kZShkYXRhKTtcbiAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBkZXZpY2UgbmFtZTogXCIgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBuYW1lIG9mIHRoZSBUaGluZ3kgZGV2aWNlLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIHRoYXQgd2lsbCBiZSBnaXZlbiB0byB0aGUgVGhpbmd5LlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0TmFtZShuYW1lKSB7XG4gICAgaWYgKG5hbWUubGVuZ3RoID4gMTApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiVGhlIG5hbWUgY2FuJ3QgYmUgbW9yZSB0aGFuIDEwIGNoYXJhY3RlcnMgbG9uZy5cIikpO1xuICAgIH1cbiAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShuYW1lLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBieXRlQXJyYXlbaV0gPSBuYW1lLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5uYW1lQ2hhcmFjdGVyaXN0aWMsIGJ5dGVBcnJheSk7XG4gIH1cblxuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgYWR2ZXJ0aXNpbmcgcGFyYW1ldGVyc1xuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdHxFcnJvcj59IFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGFkdmVydGlzaW5nIHBhcmFtZXRlcnMgd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqL1xuICBhc3luYyBnZXRBZHZQYXJhbXMoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuYWR2UGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xuXG4gICAgICAvLyBJbnRlcnZhbCBpcyBnaXZlbiBpbiB1bml0cyBvZiAwLjYyNSBtaWxsaXNlY29uZHNcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgICBjb25zdCBpbnRlcnZhbCA9IChyZWNlaXZlZERhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbikgKiAwLjYyNSkudG9GaXhlZCgwKTtcbiAgICAgIGNvbnN0IHRpbWVvdXQgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMik7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIGludGVydmFsOiB7XG4gICAgICAgICAgaW50ZXJ2YWw6IGludGVydmFsLFxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcbiAgICAgICAgfSxcbiAgICAgICAgdGltZW91dDoge1xuICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgICAgdW5pdDogXCJzXCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgYWR2ZXJ0aXNpbmcgcGFyYW1ldGVyc1xuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT2JqZWN0IHdpdGgga2V5L3ZhbHVlIHBhaXJzICdpbnRlcnZhbCcgYW5kICd0aW1lb3V0JzogPGNvZGU+e2ludGVydmFsOiBzb21lSW50ZXJ2YWwsIHRpbWVvdXQ6IHNvbWVUaW1lb3V0fTwvY29kZT4uXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVydmFsIC0gVGhlIGFkdmVydGlzaW5nIGludGVydmFsIGluIG1pbGxpc2Vjb25kcyBpbiB0aGUgcmFuZ2Ugb2YgMjAgbXMgdG8gNSAwMDAgbXMuXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLnRpbWVvdXQgLSBUaGUgYWR2ZXJ0aXNpbmcgdGltZW91dCBpbiBzZWNvbmRzIGluIHRoZSByYW5nZSAxIHMgdG8gMTgwIHMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRBZHZQYXJhbXMocGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT09IFwib2JqZWN0XCIgfHwgcGFyYW1zLmludGVydmFsID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLnRpbWVvdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgVHlwZUVycm9yKFwiVGhlIGFyZ3VtZW50IGhhcyB0byBiZSBhbiBvYmplY3Qgd2l0aCBrZXkvdmFsdWUgcGFpcnMgaW50ZXJ2YWwnIGFuZCAndGltZW91dCc6IHtpbnRlcnZhbDogc29tZUludGVydmFsLCB0aW1lb3V0OiBzb21lVGltZW91dH1cIilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gSW50ZXJ2YWwgaXMgaW4gdW5pdHMgb2YgMC42MjUgbXMuXG4gICAgY29uc3QgaW50ZXJ2YWwgPSBwYXJhbXMuaW50ZXJ2YWwgKiAxLjY7XG4gICAgY29uc3QgdGltZW91dCA9IHBhcmFtcy50aW1lb3V0O1xuXG4gICAgLy8gQ2hlY2sgcGFyYW1ldGVyc1xuICAgIGlmIChpbnRlcnZhbCA8IDMyIHx8IGludGVydmFsID4gODAwMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIGFkdmVydGlzaW5nIGludGVydmFsIG11c3QgYmUgd2l0aGluIHRoZSByYW5nZSBvZiAyMCBtcyB0byA1IDAwMCBtc1wiKSk7XG4gICAgfVxuICAgIGlmICh0aW1lb3V0IDwgMCB8fCB0aW1lb3V0ID4gMTgwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgYWR2ZXJ0aXNpbmcgdGltZW91dCBtdXN0IGJlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgMCB0byAxODAgc1wiKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMyk7XG4gICAgZGF0YUFycmF5WzBdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgIGRhdGFBcnJheVsxXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG4gICAgZGF0YUFycmF5WzJdID0gdGltZW91dDtcblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5hZHZQYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25uZWN0aW9uIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgY29ubmVjdGlvbiBwYXJhbWV0ZXJzIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0Q29ublBhcmFtcygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xuXG4gICAgICAvLyBDb25uZWN0aW9uIGludGVydmFscyBhcmUgZ2l2ZW4gaW4gdW5pdHMgb2YgMS4yNSBtc1xuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG1pbkNvbm5JbnRlcnZhbCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKSAqIDEuMjU7XG4gICAgICBjb25zdCBtYXhDb25uSW50ZXJ2YWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbikgKiAxLjI1O1xuICAgICAgY29uc3Qgc2xhdmVMYXRlbmN5ID0gcmVjZWl2ZWREYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xuXG4gICAgICAvLyBTdXBlcnZpc2lvbiB0aW1lb3V0IGlzIGdpdmVuIGkgdW5pdHMgb2YgMTAgbXNcbiAgICAgIGNvbnN0IHN1cGVydmlzaW9uVGltZW91dCA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKSAqIDEwO1xuICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBjb25uZWN0aW9uSW50ZXJ2YWw6IHtcbiAgICAgICAgICBtaW46IG1pbkNvbm5JbnRlcnZhbCxcbiAgICAgICAgICBtYXg6IG1heENvbm5JbnRlcnZhbCxcbiAgICAgICAgICB1bml0OiBcIm1zXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHNsYXZlTGF0ZW5jeToge1xuICAgICAgICAgIHZhbHVlOiBzbGF2ZUxhdGVuY3ksXG4gICAgICAgICAgdW5pdDogXCJudW1iZXIgb2YgY29ubmVjdGlvbiBpbnRlcnZhbHNcIixcbiAgICAgICAgfSxcbiAgICAgICAgc3VwZXJ2aXNpb25UaW1lb3V0OiB7XG4gICAgICAgICAgdGltZW91dDogc3VwZXJ2aXNpb25UaW1lb3V0LFxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBjb25uZWN0aW9uIGludGVydmFsXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDb25uZWN0aW9uIGludGVydmFsIG9iamVjdDogPGNvZGU+e21pbkludGVydmFsOiBzb21lVmFsdWUsIG1heEludGVydmFsOiBzb21lVmFsdWV9PC9jb2RlPlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5taW5JbnRlcnZhbCAtIFRoZSBtaW5pbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlID49IDcuNSBtcy5cbiAgICogIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4SW50ZXJ2YWwgLSBUaGUgbWF4aW11bSBjb25uZWN0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSA8PSA0IDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldENvbm5JbnRlcnZhbChwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyAhPT0gXCJvYmplY3RcIiB8fCBwYXJhbXMubWluSW50ZXJ2YWwgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubWF4SW50ZXJ2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgYXJndW1lbnQgaGFzIHRvIGJlIGFuIG9iamVjdDoge21pbkludGVydmFsOiB2YWx1ZSwgbWF4SW50ZXJ2YWw6IHZhbHVlfVwiKSk7XG4gICAgfVxuXG4gICAgbGV0IG1pbkludGVydmFsID0gcGFyYW1zLm1pbkludGVydmFsO1xuICAgIGxldCBtYXhJbnRlcnZhbCA9IHBhcmFtcy5tYXhJbnRlcnZhbDtcblxuICAgIGlmIChtaW5JbnRlcnZhbCA9PT0gbnVsbCB8fCBtYXhJbnRlcnZhbCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJCb3RoIG1pbmltdW0gYW5kIG1heGltdW0gYWNjZXB0YWJsZSBpbnRlcnZhbCBtdXN0IGJlIHBhc3NlZCBhcyBhcmd1bWVudHNcIikpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcbiAgICBpZiAobWluSW50ZXJ2YWwgPCA3LjUgfHwgbWluSW50ZXJ2YWwgPiBtYXhJbnRlcnZhbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgUmFuZ2VFcnJvcihcIlRoZSBtaW5pbXVtIGNvbm5lY3Rpb24gaW50ZXJ2YWwgbXVzdCBiZSBncmVhdGVyIHRoYW4gNy41IG1zIGFuZCA8PSBtYXhpbXVtIGludGVydmFsXCIpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAobWF4SW50ZXJ2YWwgPiA0MDAwIHx8IG1heEludGVydmFsIDwgbWluSW50ZXJ2YWwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgbmV3IFJhbmdlRXJyb3IoXCJUaGUgbWluaW11bSBjb25uZWN0aW9uIGludGVydmFsIG11c3QgYmUgbGVzcyB0aGFuIDQgMDAwIG1zIGFuZCA+PSBtaW5pbXVtIGludGVydmFsXCIpXG4gICAgICApO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg4KTtcblxuICAgICAgLy8gSW50ZXJ2YWwgaXMgaW4gdW5pdHMgb2YgMS4yNSBtcy5cbiAgICAgIG1pbkludGVydmFsID0gTWF0aC5yb3VuZChtaW5JbnRlcnZhbCAqIDAuOCk7XG4gICAgICBtYXhJbnRlcnZhbCA9IE1hdGgucm91bmQobWF4SW50ZXJ2YWwgKiAwLjgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVswXSA9IG1pbkludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVsxXSA9IChtaW5JbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbMl0gPSBtYXhJbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbM10gPSAobWF4SW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiRXJyb3Igd2hlbiB1cGRhdGluZyBjb25uZWN0aW9uIGludGVydmFsOiBcIiArIGVycm9yKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBjb25uZWN0aW9uIHNsYXZlIGxhdGVuY3lcbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHNsYXZlTGF0ZW5jeSAtIFRoZSBkZXNpcmVkIHNsYXZlIGxhdGVuY3kgaW4gdGhlIHJhbmdlIGZyb20gMCB0byA0OTkgY29ubmVjdGlvbiBpbnRlcnZhbHMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPE9iamVjdD59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0Q29ublNsYXZlTGF0ZW5jeShzbGF2ZUxhdGVuY3kpIHtcbiAgICAvLyBDaGVjayBwYXJhbWV0ZXJzXG4gICAgaWYgKHNsYXZlTGF0ZW5jeSA8IDAgfHwgc2xhdmVMYXRlbmN5ID4gNDk5KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgIG5ldyBSYW5nZUVycm9yKFwiVGhlIHNsYXZlIGxhdGVuY3kgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgZnJvbSAwIHRvIDQ5OSBjb25uZWN0aW9uIGludGVydmFscy5cIilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuY29ublBhcmFtc0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs0XSA9IHNsYXZlTGF0ZW5jeSAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbNV0gPSAoc2xhdmVMYXRlbmN5ID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNvbm5QYXJhbXNDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gdXBkYXRpbmcgc2xhdmUgbGF0ZW5jeTogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBjb25uZWN0aW9uIHN1cGVydmlzaW9uIHRpbWVvdXRcbiAgICogIDxiPk5vdGU6PC9iPiBBY2NvcmRpbmcgdG8gdGhlIEJsdWV0b290aCBMb3cgRW5lcmd5IHNwZWNpZmljYXRpb24sIHRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBtdXN0IGJlIGdyZWF0ZXJcbiAgICogIHRoYW4gKDEgKyBzbGF2ZUxhdGVuY3kpICogbWF4Q29ubkludGVydmFsICogMiwgd2hlcmUgbWF4Q29ubkludGVydmFsIGlzIGFsc28gZ2l2ZW4gaW4gbWlsbGlzZWNvbmRzLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge251bWJlcn0gdGltZW91dCAtIFRoZSBkZXNpcmVkIGNvbm5lY3Rpb24gc3VwZXJ2aXNpb24gdGltZW91dCBpbiBtaWxsaXNlY29uZHMgYW5kIGluIHRoZSByYW5nZSBvZiAxMDAgbXMgdG8gMzIgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0Q29ublRpbWVvdXQodGltZW91dCkge1xuICAgIC8vIENoZWNrIHBhcmFtZXRlcnNcbiAgICBpZiAodGltZW91dCA8IDEwMCB8fCB0aW1lb3V0ID4gMzIwMDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0IG11c3QgYmUgaW4gdGhlIHJhbmdlIGZyb20gMTAwIG1zIHRvIDMyIDAwMCBtcy5cIikpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUaGUgc3VwZXJ2aXNpb24gdGltZW91dCBoYXMgdG8gYmUgc2V0IGluIHVuaXRzIG9mIDEwIG1zXG4gICAgICB0aW1lb3V0ID0gTWF0aC5yb3VuZCh0aW1lb3V0IC8gMTApO1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgdGltZW91dCBvYmV5cyAgY29ubl9zdXBfdGltZW91dCAqIDQgPiAoMSArIHNsYXZlX2xhdGVuY3kpICogbWF4X2Nvbm5faW50ZXJ2YWxcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgICBjb25zdCBtYXhDb25uSW50ZXJ2YWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDIsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCBzbGF2ZUxhdGVuY3kgPSByZWNlaXZlZERhdGEuZ2V0VWludDE2KDQsIGxpdHRsZUVuZGlhbik7XG5cbiAgICAgIGlmICh0aW1lb3V0ICogNCA8ICgxICsgc2xhdmVMYXRlbmN5KSAqIG1heENvbm5JbnRlcnZhbCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIHN1cGVydmlzaW9uIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIG11c3QgYmUgZ3JlYXRlciB0aGFuICgxICsgc2xhdmVMYXRlbmN5KSAqIG1heENvbm5JbnRlcnZhbCAqIDIsIHdoZXJlIG1heENvbm5JbnRlcnZhbCBpcyBhbHNvIGdpdmVuIGluIG1pbGxpc2Vjb25kcy5cIilcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzZdID0gdGltZW91dCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbN10gPSAodGltZW91dCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy5jb25uUGFyYW1zQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHVwZGF0aW5nIHRoZSBzdXBlcnZpc2lvbiB0aW1lb3V0OiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIEdldHMgdGhlIGNvbmZpZ3VyZWQgRWRkeXN0b25lIFVSTFxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPFVSTHxFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgVVJMIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0RWRkeXN0b25lVXJsKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVkZHlzdG9uZUNoYXJhY3RlcmlzdGljKTtcblxuICAgICAgLy8gQWNjb3JkaW5nIHRvIEVkZHlzdG9uZSBVUkwgZW5jb2Rpbmcgc3BlY2lmaWNhdGlvbiwgY2VydGFpbiBlbGVtZW50cyBjYW4gYmUgZXhwYW5kZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZWRkeXN0b25lL3RyZWUvbWFzdGVyL2VkZHlzdG9uZS11cmxcbiAgICAgIGNvbnN0IHByZWZpeEFycmF5ID0gW1wiaHR0cDovL3d3dy5cIiwgXCJodHRwczovL3d3dy5cIiwgXCJodHRwOi8vXCIsIFwiaHR0cHM6Ly9cIl07XG4gICAgICBjb25zdCBleHBhbnNpb25Db2RlcyA9IFtcbiAgICAgICAgXCIuY29tL1wiLFxuICAgICAgICBcIi5vcmcvXCIsXG4gICAgICAgIFwiLmVkdS9cIixcbiAgICAgICAgXCIubmV0L1wiLFxuICAgICAgICBcIi5pbmZvL1wiLFxuICAgICAgICBcIi5iaXovXCIsXG4gICAgICAgIFwiLmdvdi9cIixcbiAgICAgICAgXCIuY29tXCIsXG4gICAgICAgIFwiLm9yZ1wiLFxuICAgICAgICBcIi5lZHVcIixcbiAgICAgICAgXCIubmV0XCIsXG4gICAgICAgIFwiLmluZm9cIixcbiAgICAgICAgXCIuYml6XCIsXG4gICAgICAgIFwiLmdvdlwiLFxuICAgICAgXTtcbiAgICAgIGNvbnN0IHByZWZpeCA9IHByZWZpeEFycmF5W3JlY2VpdmVkRGF0YS5nZXRVaW50OCgwKV07XG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIik7XG4gICAgICBsZXQgdXJsID0gZGVjb2Rlci5kZWNvZGUocmVjZWl2ZWREYXRhKTtcbiAgICAgIHVybCA9IHByZWZpeCArIHVybC5zbGljZSgxKTtcblxuICAgICAgZXhwYW5zaW9uQ29kZXMuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xuICAgICAgICBpZiAodXJsLmluZGV4T2YoU3RyaW5nLmZyb21DaGFyQ29kZShpKSkgIT09IC0xKSB7XG4gICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoU3RyaW5nLmZyb21DaGFyQ29kZShpKSwgZXhwYW5zaW9uQ29kZXNbaV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5ldyBVUkwodXJsKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgRWRkeXN0b25lIFVSTFxuICAgKiAgSXQncyByZWNvbW1lZW5kZWQgdG8gdXNlIFVSTCBzaG9ydGVuZXIgdG8gc3RheSB3aXRoaW4gdGhlIGxpbWl0IG9mIDE0IGNoYXJhY3RlcnMgbG9uZyBVUkxcbiAgICogIFVSTCBzY2hlbWUgcHJlZml4IHN1Y2ggYXMgXCJodHRwczovL1wiIGFuZCBcImh0dHBzOi8vd3d3LlwiIGRvIG5vdCBjb3VudCB0b3dhcmRzIHRoYXQgbGltaXQsXG4gICAqICBuZWl0aGVyIGRvZXMgZXhwYW5zaW9uIGNvZGVzIHN1Y2ggYXMgXCIuY29tL1wiIGFuZCBcIi5vcmdcIi5cbiAgICogIEZ1bGwgZGV0YWlscyBpbiB0aGUgRWRkeXN0b25lIFVSTCBzcGVjaWZpY2F0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2VkZHlzdG9uZS90cmVlL21hc3Rlci9lZGR5c3RvbmUtdXJsXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7c3RyaW5nfSB1cmxTdHJpbmcgLSBUaGUgVVJMIHRoYXQgc2hvdWxkIGJlIGJyb2FkY2FzdGVkLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0RWRkeXN0b25lVXJsKHVybFN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAvLyBVc2VzIFVSTCBBUEkgdG8gY2hlY2sgZm9yIHZhbGlkIFVSTFxuICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh1cmxTdHJpbmcpO1xuXG4gICAgICAvLyBFZGR5c3RvbmUgVVJMIHNwZWNpZmljYXRpb24gZGVmaW5lcyBjb2RlcyBmb3IgVVJMIHNjaGVtZSBwcmVmaXhlcyBhbmQgZXhwYW5zaW9uIGNvZGVzIGluIHRoZSBVUkwuXG4gICAgICAvLyBUaGUgYXJyYXkgaW5kZXggY29ycmVzcG9uZHMgdG8gdGhlIGRlZmluZWQgY29kZSBpbiB0aGUgc3BlY2lmaWNhdGlvbi5cbiAgICAgIC8vIERldGFpbHMgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9lZGR5c3RvbmUvdHJlZS9tYXN0ZXIvZWRkeXN0b25lLXVybFxuICAgICAgY29uc3QgcHJlZml4QXJyYXkgPSBbXCJodHRwOi8vd3d3LlwiLCBcImh0dHBzOi8vd3d3LlwiLCBcImh0dHA6Ly9cIiwgXCJodHRwczovL1wiXTtcbiAgICAgIGNvbnN0IGV4cGFuc2lvbkNvZGVzID0gW1xuICAgICAgICBcIi5jb20vXCIsXG4gICAgICAgIFwiLm9yZy9cIixcbiAgICAgICAgXCIuZWR1L1wiLFxuICAgICAgICBcIi5uZXQvXCIsXG4gICAgICAgIFwiLmluZm8vXCIsXG4gICAgICAgIFwiLmJpei9cIixcbiAgICAgICAgXCIuZ292L1wiLFxuICAgICAgICBcIi5jb21cIixcbiAgICAgICAgXCIub3JnXCIsXG4gICAgICAgIFwiLmVkdVwiLFxuICAgICAgICBcIi5uZXRcIixcbiAgICAgICAgXCIuaW5mb1wiLFxuICAgICAgICBcIi5iaXpcIixcbiAgICAgICAgXCIuZ292XCIsXG4gICAgICBdO1xuICAgICAgbGV0IHByZWZpeENvZGUgPSBudWxsO1xuICAgICAgbGV0IGV4cGFuc2lvbkNvZGUgPSBudWxsO1xuICAgICAgbGV0IGVkZHlzdG9uZVVybCA9IHVybC5ocmVmO1xuICAgICAgbGV0IGxlbiA9IGVkZHlzdG9uZVVybC5sZW5ndGg7XG5cbiAgICAgIHByZWZpeEFycmF5LmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcbiAgICAgICAgaWYgKHVybC5ocmVmLmluZGV4T2YoZWxlbWVudCkgIT09IC0xICYmIHByZWZpeENvZGUgPT09IG51bGwpIHtcbiAgICAgICAgICBwcmVmaXhDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICAgICAgICBlZGR5c3RvbmVVcmwgPSBlZGR5c3RvbmVVcmwucmVwbGFjZShlbGVtZW50LCBwcmVmaXhDb2RlKTtcbiAgICAgICAgICBsZW4gLT0gZWxlbWVudC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBleHBhbnNpb25Db2Rlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XG4gICAgICAgIGlmICh1cmwuaHJlZi5pbmRleE9mKGVsZW1lbnQpICE9PSAtMSAmJiBleHBhbnNpb25Db2RlID09PSBudWxsKSB7XG4gICAgICAgICAgZXhwYW5zaW9uQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAgICAgICAgZWRkeXN0b25lVXJsID0gZWRkeXN0b25lVXJsLnJlcGxhY2UoZWxlbWVudCwgZXhwYW5zaW9uQ29kZSk7XG4gICAgICAgICAgbGVuIC09IGVsZW1lbnQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGxlbiA8IDEgfHwgbGVuID4gMTQpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJUaGUgVVJMIGNhbid0IGJlIGxvbmdlciB0aGFuIDE0IGNoYXJhY3RlcnMsIGV4Y2x1ZGluZyBVUkwgc2NoZW1lIHN1Y2ggYXMgXFxcImh0dHBzOi8vXFxcIiBhbmQgXFxcIi5jb20vXFxcIi5cIilcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoZWRkeXN0b25lVXJsLmxlbmd0aCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWRkeXN0b25lVXJsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJ5dGVBcnJheVtpXSA9IGVkZHlzdG9uZVVybC5jaGFyQ29kZUF0KGkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fd3JpdGVEYXRhKHRoaXMuZWRkeXN0b25lQ2hhcmFjdGVyaXN0aWMsIGJ5dGVBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjb25maWd1cmVkIGNsb3VkIHRva2VuLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPHN0cmluZ3xFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgY2xvdWQgdG9rZW4gd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRDbG91ZFRva2VuKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmNsb3VkVG9rZW5DaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIik7XG4gICAgICBjb25zdCB0b2tlbiA9IGRlY29kZXIuZGVjb2RlKHJlY2VpdmVkRGF0YSk7XG5cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgY2xvdWQgdG9rZW4uXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBjbG91ZCB0b2tlbiB0byBiZSBzdG9yZWQuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRDbG91ZFRva2VuKHRva2VuKSB7XG4gICAgaWYgKHRva2VuLmxlbmd0aCA+IDI1MCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBjbG91ZCB0b2tlbiBjYW4gbm90IGV4Y2VlZCAyNTAgY2hhcmFjdGVycy5cIikpO1xuICAgIH1cblxuICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoXCJ1dGYtOFwiKS5lbmNvZGUodG9rZW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLmNsb3VkVG9rZW5DaGFyYWN0ZXJpc3RpYywgZW5jb2Rlcik7XG4gIH1cblxuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgTWF4aW1hbCBUcmFuc21pc3Npb24gVW5pdCAoTVRVKVxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPG51bWJlcnxFcnJvcj59IFJldHVybnMgdGhlIE1UVSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldE10dSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5tdHVSZXF1ZXN0Q2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG10dSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50MTYoMSwgbGl0dGxlRW5kaWFuKTtcblxuICAgICAgcmV0dXJuIG10dTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgY3VycmVudCBNYXhpbWFsIFRyYW5zbWlzc2lvbiBVbml0IChNVFUpXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zID0ge3BlcmlwaGVyYWxSZXF1ZXN0OiB0cnVlfV0gLSBNVFUgc2V0dGluZ3Mgb2JqZWN0OiB7bXR1U2l6ZTogdmFsdWUsIHBlcmlwaGVyYWxSZXF1ZXN0OiB2YWx1ZX0sIHdoZXJlIHBlcmlwaGVyYWxSZXF1ZXN0IGlzIG9wdGlvbmFsLlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tdHVTaXplIC0gVGhlIGRlc2lyZWQgTVRVIHNpemUuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5wZXJpcGhlcmFsUmVxdWVzdCAtIE9wdGlvbmFsLiBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgcGVyaXBoZXJhbCBzaG91bGQgc2VuZCBhbiBNVFUgZXhjaGFuZ2UgcmVxdWVzdC4gRGVmYXVsdCBpcyA8Y29kZT50cnVlPC9jb2RlPjtcbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldE10dShwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyAhPT0gXCJvYmplY3RcIiB8fCBwYXJhbXMubXR1U2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBhcmd1bWVudCBoYXMgdG8gYmUgYW4gb2JqZWN0XCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBtdHVTaXplID0gcGFyYW1zLm10dVNpemU7XG4gICAgY29uc3QgcGVyaXBoZXJhbFJlcXVlc3QgPSBwYXJhbXMucGVyaXBoZXJhbFJlcXVlc3QgfHwgdHJ1ZTtcblxuICAgIGlmIChtdHVTaXplIDwgMjMgfHwgbXR1U2l6ZSA+IDI3Nikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk1UVSBzaXplIG11c3QgYmUgaW4gcmFuZ2UgMjMgLSAyNzYgYnl0ZXNcIikpO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDMpO1xuICAgIGRhdGFBcnJheVswXSA9IHBlcmlwaGVyYWxSZXF1ZXN0ID8gMSA6IDA7XG4gICAgZGF0YUFycmF5WzFdID0gbXR1U2l6ZSAmIDB4ZmY7XG4gICAgZGF0YUFycmF5WzJdID0gKG10dVNpemUgPj4gOCkgJiAweGZmO1xuXG4gICAgcmV0dXJuIHRoaXMuX3dyaXRlRGF0YSh0aGlzLm10dVJlcXVlc3RDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBmaXJtd2FyZSB2ZXJzaW9uLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPHN0cmluZ3xFcnJvcj59IFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgZmlybXdhcmUgdmVyc2lvbiBvciBhIHByb21pc2Ugd2l0aCBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRGaXJtd2FyZVZlcnNpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZmlybXdhcmVWZXJzaW9uQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgbWFqb3IgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMCk7XG4gICAgICBjb25zdCBtaW5vciA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OCgxKTtcbiAgICAgIGNvbnN0IHBhdGNoID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KDIpO1xuICAgICAgY29uc3QgdmVyc2lvbiA9IGB2JHttYWpvcn0uJHttaW5vcn0uJHtwYXRjaH1gO1xuXG4gICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8vICAqKioqKiogIC8vXG5cbiAgLyogIEVudmlyb25tZW50IHNlcnZpY2UgICovXG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gb2YgdGhlIFRoaW5neSBlbnZpcm9ubWVudCBtb2R1bGUuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBlbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIG9iamVjdCB3aGVuIHByb21pc2UgcmVzb2x2ZXMsIG9yIGFuIGVycm9yIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2V0RW52aXJvbm1lbnRDb25maWcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHRlbXBJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCBwcmVzc3VyZUludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IGh1bWlkaXR5SW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNig0LCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3QgY29sb3JJbnRlcnZhbCA9IGRhdGEuZ2V0VWludDE2KDYsIGxpdHRsZUVuZGlhbik7XG4gICAgICBjb25zdCBnYXNNb2RlID0gZGF0YS5nZXRVaW50OCg4KTtcbiAgICAgIGNvbnN0IGNvbG9yU2Vuc29yUmVkID0gZGF0YS5nZXRVaW50OCg5KTtcbiAgICAgIGNvbnN0IGNvbG9yU2Vuc29yR3JlZW4gPSBkYXRhLmdldFVpbnQ4KDEwKTtcbiAgICAgIGNvbnN0IGNvbG9yU2Vuc29yQmx1ZSA9IGRhdGEuZ2V0VWludDgoMTEpO1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICB0ZW1wSW50ZXJ2YWw6IHRlbXBJbnRlcnZhbCxcbiAgICAgICAgcHJlc3N1cmVJbnRlcnZhbDogcHJlc3N1cmVJbnRlcnZhbCxcbiAgICAgICAgaHVtaWRpdHlJbnRlcnZhbDogaHVtaWRpdHlJbnRlcnZhbCxcbiAgICAgICAgY29sb3JJbnRlcnZhbDogY29sb3JJbnRlcnZhbCxcbiAgICAgICAgZ2FzTW9kZTogZ2FzTW9kZSxcbiAgICAgICAgY29sb3JTZW5zb3JSZWQ6IGNvbG9yU2Vuc29yUmVkLFxuICAgICAgICBjb2xvclNlbnNvckdyZWVuOiBjb2xvclNlbnNvckdyZWVuLFxuICAgICAgICBjb2xvclNlbnNvckJsdWU6IGNvbG9yU2Vuc29yQmx1ZSxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgZW52aXJvbm1lbnQgc2Vuc29ycyBjb25maWd1cmF0aW9uczogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSB0ZW1wZXJhdHVyZSBtZWFzdXJlbWVudCB1cGRhdGUgaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRlbXBlcmF0dXJlIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBNdXN0IGJlIGluIHRoZSByYW5nZSAxMDAgbXMgdG8gNjAgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0VGVtcGVyYXR1cmVJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgPCA1MCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSB0ZW1wZXJhdHVyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzBdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzFdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHRlbXBlcmF0dXJlIHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBwcmVzc3VyZSBtZWFzdXJlbWVudCB1cGRhdGUgaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRoZSBwcmVzc3VyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgNTAgbXMgdG8gNjAgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0UHJlc3N1cmVJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgPCA1MCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBwcmVzc3VyZSBzZW5zb3IgdXBkYXRlIGludGVydmFsIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyAtIDYwIDAwMCBtc1wiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzJdID0gaW50ZXJ2YWwgJiAweGZmO1xuICAgICAgZGF0YUFycmF5WzNdID0gKGludGVydmFsID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHByZXNzdXJlIHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBodW1pZGl0eSBtZWFzdXJlbWVudCB1cGRhdGUgaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIEh1bWlkaXR5IHNlbnNvciBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA2MCAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRIdW1pZGl0eUludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBodW1pZGl0eSBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbNF0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbNV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgaHVtaWRpdHkgdXBkYXRlIGludGVydmFsOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIGNvbG9yIHNlbnNvciB1cGRhdGUgaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIENvbG9yIHNlbnNvciBzYW1wbGluZyBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDIwMCBtcyB0byA2MCAwMDAgbXMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRDb2xvckludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbnRlcnZhbCA8IDIwMCB8fCBpbnRlcnZhbCA+IDYwMDAwKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBzZW5zb3Igc2FtcGxpbmcgaW50ZXJ2YWwgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMjAwIG1zIC0gNjAgMDAwIG1zXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbNl0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbN10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgY29sb3Igc2Vuc29yIHVwZGF0ZSBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBnYXMgc2Vuc29yIHNhbXBsaW5nIGludGVydmFsLlxuICAgKlxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gVGhlIGdhcyBzZW5zb3IgdXBkYXRlIGludGVydmFsIGluIHNlY29uZHMuIEFsbG93ZWQgdmFsdWVzIGFyZSAxLCAxMCwgYW5kIDYwIHNlY29uZHMuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRHYXNJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgIHRyeSB7XG4gICAgICBsZXQgbW9kZTtcblxuICAgICAgaWYgKGludGVydmFsID09PSAxKSB7XG4gICAgICAgIG1vZGUgPSAxO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA9PT0gMTApIHtcbiAgICAgICAgbW9kZSA9IDI7XG4gICAgICB9IGVsc2UgaWYgKGludGVydmFsID09PSA2MCkge1xuICAgICAgICBtb2RlID0gMztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBnYXMgc2Vuc29yIGludGVydmFsIGhhcyB0byBiZSAxLCAxMCBvciA2MCBzZWNvbmRzLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZW52aXJvbm1lbnRDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSgxMik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzhdID0gbW9kZTtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGdhcyBzZW5zb3IgaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgQ29uZmlndXJlcyBjb2xvciBzZW5zb3IgTEVEIGNhbGlicmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSByZWQgLSBUaGUgcmVkIGludGVuc2l0eSwgcmFuZ2luZyBmcm9tIDAgdG8gMjU1LlxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGdyZWVuIC0gVGhlIGdyZWVuIGludGVuc2l0eSwgcmFuZ2luZyBmcm9tIDAgdG8gMjU1LlxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IGJsdWUgLSBUaGUgYmx1ZSBpbnRlbnNpdHksIHJhbmdpbmcgZnJvbSAwIHRvIDI1NS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIGNvbG9yU2Vuc29yQ2FsaWJyYXRlKHJlZCwgZ3JlZW4sIGJsdWUpIHtcbiAgICB0cnkge1xuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5lbnZpcm9ubWVudENvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDEyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbOV0gPSByZWQ7XG4gICAgICBkYXRhQXJyYXlbMTBdID0gZ3JlZW47XG4gICAgICBkYXRhQXJyYXlbMTFdID0gYmx1ZTtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLmVudmlyb25tZW50Q29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IGNvbG9yIHNlbnNvciBwYXJhbWV0ZXJzOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgdGVtcGVyYXR1cmUgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgdGVtcGVyYXR1cmUgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgdGVtcGVyYXR1cmVFbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3RlbXBlcmF0dXJlTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnRlbXBlcmF0dXJlQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy50ZW1wRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX3RlbXBlcmF0dXJlTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgaW50ZWdlciA9IGRhdGEuZ2V0VWludDgoMCk7XG4gICAgY29uc3QgZGVjaW1hbCA9IGRhdGEuZ2V0VWludDgoMSk7XG4gICAgY29uc3QgdGVtcGVyYXR1cmUgPSBpbnRlZ2VyICsgZGVjaW1hbCAvIDEwMDtcbiAgICB0aGlzLnRlbXBFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHZhbHVlOiB0ZW1wZXJhdHVyZSxcbiAgICAgICAgdW5pdDogXCJDZWxzaXVzXCIsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBwcmVzc3VyZSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBwcmVzc3VyZSBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBwcmVzc3VyZUVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMucHJlc3N1cmVFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3ByZXNzdXJlTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLnByZXNzdXJlQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5wcmVzc3VyZUV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9wcmVzc3VyZU5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgY29uc3QgaW50ZWdlciA9IGRhdGEuZ2V0VWludDMyKDAsIGxpdHRsZUVuZGlhbik7XG4gICAgY29uc3QgZGVjaW1hbCA9IGRhdGEuZ2V0VWludDgoNCk7XG4gICAgY29uc3QgcHJlc3N1cmUgPSBpbnRlZ2VyICsgZGVjaW1hbCAvIDEwMDtcbiAgICB0aGlzLnByZXNzdXJlRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICB2YWx1ZTogcHJlc3N1cmUsXG4gICAgICAgIHVuaXQ6IFwiaFBhXCIsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBodW1pZGl0eSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBodW1pZGl0eSBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBodW1pZGl0eUVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2h1bWlkaXR5Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmh1bWlkaXR5RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5odW1pZGl0eUNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMuaHVtaWRpdHlFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfaHVtaWRpdHlOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBodW1pZGl0eSA9IGRhdGEuZ2V0VWludDgoMCk7XG4gICAgdGhpcy5odW1pZGl0eUV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgdmFsdWU6IGh1bWlkaXR5LFxuICAgICAgICB1bml0OiBcIiVcIixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIGdhcyBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBnYXMgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ2FzRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5nYXNFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2dhc05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmdhc0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5nYXNDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmdhc0V2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuICBfZ2FzTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICBjb25zdCBlY28yID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcbiAgICBjb25zdCB0dm9jID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcblxuICAgIHRoaXMuZ2FzRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICBlQ08yOiB7XG4gICAgICAgICAgdmFsdWU6IGVjbzIsXG4gICAgICAgICAgdW5pdDogXCJwcG1cIixcbiAgICAgICAgfSxcbiAgICAgICAgVFZPQzoge1xuICAgICAgICAgIHZhbHVlOiB0dm9jLFxuICAgICAgICAgIHVuaXQ6IFwicHBiXCIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBjb2xvciBzZW5zb3Igbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgY29sb3Igc2Vuc29yIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIGNvbG9yRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5jb2xvckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fY29sb3JOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuY29sb3JFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuY29sb3JDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX2NvbG9yTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgbGl0dGxlRW5kaWFuID0gdHJ1ZTtcbiAgICBjb25zdCByID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcbiAgICBjb25zdCBnID0gZGF0YS5nZXRVaW50MTYoMiwgbGl0dGxlRW5kaWFuKTtcbiAgICBjb25zdCBiID0gZGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcbiAgICBjb25zdCBjID0gZGF0YS5nZXRVaW50MTYoNiwgbGl0dGxlRW5kaWFuKTtcbiAgICBjb25zdCByUmF0aW8gPSByIC8gKHIgKyBnICsgYik7XG4gICAgY29uc3QgZ1JhdGlvID0gZyAvIChyICsgZyArIGIpO1xuICAgIGNvbnN0IGJSYXRpbyA9IGIgLyAociArIGcgKyBiKTtcbiAgICBjb25zdCBjbGVhckF0QmxhY2sgPSAzMDA7XG4gICAgY29uc3QgY2xlYXJBdFdoaXRlID0gNDAwO1xuICAgIGNvbnN0IGNsZWFyRGlmZiA9IGNsZWFyQXRXaGl0ZSAtIGNsZWFyQXRCbGFjaztcbiAgICBsZXQgY2xlYXJOb3JtYWxpemVkID0gKGMgLSBjbGVhckF0QmxhY2spIC8gY2xlYXJEaWZmO1xuXG4gICAgaWYgKGNsZWFyTm9ybWFsaXplZCA8IDApIHtcbiAgICAgIGNsZWFyTm9ybWFsaXplZCA9IDA7XG4gICAgfVxuXG4gICAgbGV0IHJlZCA9IHJSYXRpbyAqIDI1NS4wICogMyAqIGNsZWFyTm9ybWFsaXplZDtcblxuICAgIGlmIChyZWQgPiAyNTUpIHtcbiAgICAgIHJlZCA9IDI1NTtcbiAgICB9XG4gICAgbGV0IGdyZWVuID0gZ1JhdGlvICogMjU1LjAgKiAzICogY2xlYXJOb3JtYWxpemVkO1xuXG4gICAgaWYgKGdyZWVuID4gMjU1KSB7XG4gICAgICBncmVlbiA9IDI1NTtcbiAgICB9XG4gICAgbGV0IGJsdWUgPSBiUmF0aW8gKiAyNTUuMCAqIDMgKiBjbGVhck5vcm1hbGl6ZWQ7XG5cbiAgICBpZiAoYmx1ZSA+IDI1NSkge1xuICAgICAgYmx1ZSA9IDI1NTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbG9yRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICByZWQ6IHJlZC50b0ZpeGVkKDApLFxuICAgICAgICBncmVlbjogZ3JlZW4udG9GaXhlZCgwKSxcbiAgICAgICAgYmx1ZTogYmx1ZS50b0ZpeGVkKDApLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAgKioqKioqICAvL1xuICAvKiAgVXNlciBpbnRlcmZhY2Ugc2VydmljZSAgKi9cblxuICAvKipcbiAgICogIEdldHMgdGhlIGN1cnJlbnQgTEVEIHNldHRpbmdzIGZyb20gdGhlIFRoaW5neSBkZXZpY2UuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggc3RydWN0dXJlIHRoYXQgZGVwZW5kcyBvbiB0aGUgc2V0dGluZ3MuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gUmV0dXJucyBhIExFRCBzdGF0dXMgb2JqZWN0LiBUaGUgY29udGVudCBhbmQgc3RydWN0dXJlIGRlcGVuZHMgb24gdGhlIGN1cnJlbnQgbW9kZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldExlZFN0YXR1cygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMubGVkQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgbW9kZSA9IGRhdGEuZ2V0VWludDgoMCk7XG4gICAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgICAgbGV0IHN0YXR1cztcblxuICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHN0YXR1cyA9IHtMRURzdGF0dXM6IHttb2RlOiBtb2RlfX07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBzdGF0dXMgPSB7XG4gICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICByOiBkYXRhLmdldFVpbnQ4KDEpLFxuICAgICAgICAgIGc6IGRhdGEuZ2V0VWludDgoMiksXG4gICAgICAgICAgYjogZGF0YS5nZXRVaW50OCgzKSxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHN0YXR1cyA9IHtcbiAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgIGNvbG9yOiBkYXRhLmdldFVpbnQ4KDEpLFxuICAgICAgICAgIGludGVuc2l0eTogZGF0YS5nZXRVaW50OCgyKSxcbiAgICAgICAgICBkZWxheTogZGF0YS5nZXRVaW50MTYoMywgbGl0dGxlRW5kaWFuKSxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHN0YXR1cyA9IHtcbiAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgIGNvbG9yOiBkYXRhLmdldFVpbnQ4KDEpLFxuICAgICAgICAgIGludGVuc2l0eTogZGF0YS5nZXRVaW50OCgyKSxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBnZXR0aW5nIFRoaW5neSBMRUQgc3RhdHVzOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBfbGVkU2V0KGRhdGFBcnJheSkge1xuICAgIHJldHVybiB0aGlzLl93cml0ZURhdGEodGhpcy5sZWRDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB0aGUgTEVEIGluIGNvbnN0YW50IG1vZGUgd2l0aCB0aGUgc3BlY2lmaWVkIFJHQiBjb2xvci5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IGNvbG9yIC0gQ29sb3Igb2JqZWN0IHdpdGggUkdCIHZhbHVlc1xuICAgKiAgQHBhcmFtIHtudW1iZXJ9IGNvbG9yLnJlZCAtIFRoZSB2YWx1ZSBmb3IgcmVkIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXG4gICAqICBAcGFyYW0ge251bWJlcn0gY29sb3IuZ3JlZW4gLSBUaGUgdmFsdWUgZm9yIGdyZWVuIGNvbG9yIGluIGFuIFJHQiBjb2xvci4gUmFuZ2VzIGZyb20gMCB0byAyNTUuXG4gICAqICBAcGFyYW0ge251bWJlcn0gY29sb3IuYmx1ZSAtIFRoZSB2YWx1ZSBmb3IgYmx1ZSBjb2xvciBpbiBhbiBSR0IgY29sb3IuIFJhbmdlcyBmcm9tIDAgdG8gMjU1LlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSByZXNvbHZlZCBwcm9taXNlIG9yIGFuIGVycm9yIGluIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICpcbiAgICovXG4gIGFzeW5jIGxlZENvbnN0YW50KGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yLnJlZCA9PT0gdW5kZWZpbmVkIHx8IGNvbG9yLmdyZWVuID09PSB1bmRlZmluZWQgfHwgY29sb3IuYmx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcIlRoZSBvcHRpb25zIG9iamVjdCBmb3IgbXVzdCBoYXZlIHRoZSBwcm9wZXJ0aWVzICdyZWQnLCAnZ3JlZW4nIGFuZCAnYmx1ZScuXCIpKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgY29sb3IucmVkIDwgMCB8fFxuICAgICAgY29sb3IucmVkID4gMjU1IHx8XG4gICAgICBjb2xvci5ncmVlbiA8IDAgfHxcbiAgICAgIGNvbG9yLmdyZWVuID4gMjU1IHx8XG4gICAgICBjb2xvci5ibHVlIDwgMCB8fFxuICAgICAgY29sb3IuYmx1ZSA+IDI1NVxuICAgICkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBSYW5nZUVycm9yKFwiVGhlIFJHQiB2YWx1ZXMgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDI1NVwiKSk7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9sZWRTZXQobmV3IFVpbnQ4QXJyYXkoWzEsIGNvbG9yLnJlZCwgY29sb3IuZ3JlZW4sIGNvbG9yLmJsdWVdKSk7XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIExFRCBpbiBcImJyZWF0aGVcIiBtb2RlIHdoZXJlIHRoZSBMRUQgY29udGludW91c2x5IHB1bHNlcyB3aXRoIHRoZSBzcGVjaWZpZWQgY29sb3IsIGludGVuc2l0eSBhbmQgZGVsYXkgYmV0d2VlbiBwdWxzZXMuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPcHRpb25zIG9iamVjdCBmb3IgTEVEIGJyZWF0aGUgbW9kZVxuICAgKiAgQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBwYXJhbXMuY29sb3IgLSBUaGUgY29sb3IgY29kZSBvciBjb2xvciBuYW1lLiAxID0gcmVkLCAyID0gZ3JlZW4sIDMgPSB5ZWxsb3csIDQgPSBibHVlLCA1ID0gcHVycGxlLCA2ID0gY3lhbiwgNyA9IHdoaXRlLlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5pbnRlbnNpdHkgLSBJbnRlbnNpdHkgb2YgTEVEIHB1bHNlcy4gUmFuZ2UgZnJvbSAwIHRvIDEwMCBbJV0uXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmRlbGF5IC0gRGVsYXkgYmV0d2VlbiBwdWxzZXMgaW4gbWlsbGlzZWNvbmRzLiBSYW5nZSBmcm9tIDUwIG1zIHRvIDEwIDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBsZWRCcmVhdGhlKHBhcmFtcykge1xuICAgIGNvbnN0IGNvbG9ycyA9IFtcInJlZFwiLCBcImdyZWVuXCIsIFwieWVsbG93XCIsIFwiYmx1ZVwiLCBcInB1cnBsZVwiLCBcImN5YW5cIiwgXCJ3aGl0ZVwiXTtcbiAgICBjb25zdCBjb2xvckNvZGUgPSB0eXBlb2YgcGFyYW1zLmNvbG9yID09PSBcInN0cmluZ1wiID8gY29sb3JzLmluZGV4T2YocGFyYW1zLmNvbG9yKSArIDEgOiBwYXJhbXMuY29sb3I7XG5cbiAgICBpZiAocGFyYW1zLmNvbG9yID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmludGVuc2l0eSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5kZWxheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoXCJUaGUgb3B0aW9ucyBvYmplY3QgZm9yIG11c3QgaGF2ZSB0aGUgcHJvcGVydGllcyAnY29sb3InLCAnaW50ZW5zaXR5JyBhbmQgJ2ludGVuc2l0eScuXCIpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoY29sb3JDb2RlIDwgMSB8fCBjb2xvckNvZGUgPiA3KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgY29sb3IgY29kZSBtdXN0IGJlIGluIHRoZSByYW5nZSAxIC0gN1wiKSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuaW50ZW5zaXR5IDwgMCB8fCBwYXJhbXMuaW50ZW5zaXR5ID4gMTAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgaW50ZW5zaXR5IG11c3QgYmUgaW4gdGhlIHJhbmdlIDAgLSAxMDAlXCIpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5kZWxheSA8IDUwIHx8IHBhcmFtcy5kZWxheSA+IDEwMDAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJhbmdlRXJyb3IoXCJUaGUgZGVsYXkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgNTAgbXMgLSAxMCAwMDAgbXNcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9sZWRTZXQobmV3IFVpbnQ4QXJyYXkoWzIsIGNvbG9yQ29kZSwgcGFyYW1zLmludGVuc2l0eSwgcGFyYW1zLmRlbGF5ICYgMHhmZiwgKHBhcmFtcy5kZWxheSA+PiA4KSAmIDB4ZmZdKSk7XG4gIH1cblxuICAvKipcbiAgICogIFNldHMgdGhlIExFRCBpbiBvbmUtc2hvdCBtb2RlLiBPbmUtc2hvdCBtb2RlIHdpbGwgcmVzdWx0IGluIG9uZSBzaW5nbGUgcHVsc2Ugb2YgdGhlIExFRC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIE9wdGlvbiBvYmplY3QgZm9yIExFRCBpbiBvbmUtc2hvdCBtb2RlXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmNvbG9yIC0gVGhlIGNvbG9yIGNvZGUuIDEgPSByZWQsIDIgPSBncmVlbiwgMyA9IHllbGxvdywgNCA9IGJsdWUsIDUgPSBwdXJwbGUsIDYgPSBjeWFuLCA3ID0gd2hpdGUuXG4gICAqICBAcGFyYW0ge251bWJlcn0gcGFyYW1zLmludGVuc2l0eSAtIEludGVuc2l0eSBvZiBMRUQgcHVsc2VzLiBSYW5nZSBmcm9tIDAgdG8gMTAwIFslXS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhbiBlcnJvciBpbiBhIHJlamVjdGVkIHByb21pc2UuXG4gICAqXG4gICAqL1xuICBhc3luYyBsZWRPbmVTaG90KHBhcmFtcykge1xuICAgIGNvbnN0IGNvbG9ycyA9IFtcInJlZFwiLCBcImdyZWVuXCIsIFwieWVsbG93XCIsIFwiYmx1ZVwiLCBcInB1cnBsZVwiLCBcImN5YW5cIiwgXCJ3aGl0ZVwiXTtcbiAgICBjb25zdCBjb2xvckNvZGUgPSB0eXBlb2YgcGFyYW1zLmNvbG9yID09PSBcInN0cmluZ1wiID8gY29sb3JzLmluZGV4T2YocGFyYW1zLmNvbG9yKSArIDEgOiBwYXJhbXMuY29sb3I7XG5cbiAgICBpZiAoY29sb3JDb2RlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmludGVuc2l0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoXCJUaGUgb3B0aW9ucyBvYmplY3QgZm9yIExFRCBvbmUtc2hvdCBtdXN0IGhhdmUgdGhlIHByb3BlcnRpZXMgJ2NvbG9yJyBhbmQgJ2ludGVuc2l0eS5cIilcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChjb2xvckNvZGUgPCAxIHx8IGNvbG9yQ29kZSA+IDcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBjb2xvciBjb2RlIG11c3QgYmUgaW4gdGhlIHJhbmdlIDEgLSA3XCIpKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5pbnRlbnNpdHkgPCAxIHx8IHBhcmFtcy5pbnRlbnNpdHkgPiAxMDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgUmFuZ2VFcnJvcihcIlRoZSBpbnRlbnNpdHkgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgMCAtIDEwMFwiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2xlZFNldChuZXcgVWludDhBcnJheShbMywgY29sb3JDb2RlLCBwYXJhbXMuaW50ZW5zaXR5XSkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIGJ1dHRvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBidXR0b24gb24gdGhlIFRoaW5neSBpcyBwdXNoZWQgb3IgcmVsZWFzZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGJ1dHRvbiBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdpdGggYnV0dG9uIHN0YXRlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgYnV0dG9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2J1dHRvbk5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmJ1dHRvbkV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMuYnV0dG9uQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5idXR0b25FdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfYnV0dG9uTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3Qgc3RhdGUgPSBkYXRhLmdldFVpbnQ4KDApO1xuICAgIHRoaXMuYnV0dG9uRXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoc3RhdGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBHZXRzIHRoZSBjdXJyZW50IGV4dGVybmFsIHBpbiBzZXR0aW5ncyBmcm9tIHRoZSBUaGluZ3kgZGV2aWNlLiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHBpbiBzdGF0dXMgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0fEVycm9yPn0gUmV0dXJucyBhbiBleHRlcm5hbCBwaW4gc3RhdHVzIG9iamVjdC5cbiAgICpcbiAgICovXG4gIGFzeW5jIGV4dGVybmFsUGluc1N0YXR1cygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBwaW5TdGF0dXMgPSB7XG4gICAgICAgIHBpbjE6IGRhdGEuZ2V0VWludDgoMCksXG4gICAgICAgIHBpbjI6IGRhdGEuZ2V0VWludDgoMSksXG4gICAgICAgIHBpbjM6IGRhdGEuZ2V0VWludDgoMiksXG4gICAgICAgIHBpbjQ6IGRhdGEuZ2V0VWludDgoMyksXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHBpblN0YXR1cztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gcmVhZGluZyBmcm9tIGV4dGVybmFsIHBpbiBjaGFyYWN0ZXJpc3RpYzogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXQgYW4gZXh0ZXJuYWwgcGluIHRvIGNob3NlbiBzdGF0ZS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHBpbiAtIERldGVybWluZXMgd2hpY2ggcGluIGlzIHNldC4gUmFuZ2UgMSAtIDQuXG4gICAqICBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgcGluLiAwID0gT0ZGLCAyNTUgPSBPTi5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldEV4dGVybmFsUGluKHBpbiwgdmFsdWUpIHtcbiAgICBpZiAocGluIDwgMSB8fCBwaW4gPiA0KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUGluIG51bWJlciBtdXN0IGJlIDEgLSA0XCIpKTtcbiAgICB9XG4gICAgaWYgKCEodmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDI1NSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQaW4gc3RhdHVzIHZhbHVlIG11c3QgYmUgMCBvciAyNTVcIikpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHBpbnMgdGhhdCBhcmUgbm90IGJlaW5nIHNldFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5leHRlcm5hbFBpbkNoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDQpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVtwaW4gLSAxXSA9IHZhbHVlO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMuZXh0ZXJuYWxQaW5DaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBleHRlcm5hbCBwaW5zOiBcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvLyAgKioqKioqICAvL1xuICAvKiAgTW90aW9uIHNlcnZpY2UgICovXG4gIC8qKlxuICAgKiAgR2V0cyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIG9mIHRoZSBUaGluZ3kgbW90aW9uIG1vZHVsZS5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3R8RXJyb3I+fSBSZXR1cm5zIGEgbW90aW9uIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdoZW4gcHJvbWlzZSByZXNvbHZlcywgb3IgYW4gZXJyb3IgaWYgcmVqZWN0ZWQuXG4gICAqXG4gICAqL1xuICBhc3luYyBnZXRNb3Rpb25Db25maWcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGxpdHRsZUVuZGlhbiA9IHRydWU7XG4gICAgICBjb25zdCBzdGVwQ291bnRlckludGVydmFsID0gZGF0YS5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IHRlbXBDb21wSW50ZXJ2YWwgPSBkYXRhLmdldFVpbnQxNigyLCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3QgbWFnbmV0Q29tcEludGVydmFsID0gZGF0YS5nZXRVaW50MTYoNCwgbGl0dGxlRW5kaWFuKTtcbiAgICAgIGNvbnN0IG1vdGlvblByb2Nlc3NpbmdGcmVxdWVuY3kgPSBkYXRhLmdldFVpbnQxNig2LCBsaXR0bGVFbmRpYW4pO1xuICAgICAgY29uc3Qgd2FrZU9uTW90aW9uID0gZGF0YS5nZXRVaW50OCg4KTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgc3RlcENvdW50SW50ZXJ2YWw6IHN0ZXBDb3VudGVySW50ZXJ2YWwsXG4gICAgICAgIHRlbXBDb21wSW50ZXJ2YWw6IHRlbXBDb21wSW50ZXJ2YWwsXG4gICAgICAgIG1hZ25ldENvbXBJbnRlcnZhbDogbWFnbmV0Q29tcEludGVydmFsLFxuICAgICAgICBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5OiBtb3Rpb25Qcm9jZXNzaW5nRnJlcXVlbmN5LFxuICAgICAgICB3YWtlT25Nb3Rpb246IHdha2VPbk1vdGlvbixcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIGdldHRpbmcgVGhpbmd5IG1vdGlvbiBtb2R1bGUgY29uZmlndXJhdGlvbjogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBzdGVwIGNvdW50ZXIgaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCAtIFN0ZXAgY291bnRlciBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA1IDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldFN0ZXBDb3VudGVySW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGludGVydmFsIDwgMTAwIHx8IGludGVydmFsID4gNTAwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgMTAwIC0gNTAwMCBtcy5cIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVswXSA9IGludGVydmFsICYgMHhmZjtcbiAgICAgIGRhdGFBcnJheVsxXSA9IChpbnRlcnZhbCA+PiA4KSAmIDB4ZmY7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgc3RlcCBjb3VudCBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSB0ZW1wZXJhdHVyZSBjb21wZW5zYXRpb24gaW50ZXJ2YWwuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCAtIFRlbXBlcmF0dXJlIGNvbXBlbnNhdGlvbiBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMuIE11c3QgYmUgaW4gdGhlIHJhbmdlIDEwMCBtcyB0byA1IDAwMCBtcy5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldFRlbXBlcmF0dXJlQ29tcEludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDUwMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDEwMCAtIDUwMDAgbXMuXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbMl0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbM10gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IHRlbXBlcmF0dXJlIGNvbXBlbnNhdGlvbiBpbnRlcnZhbDogXCIgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBTZXRzIHRoZSBtYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge051bWJlcn0gaW50ZXJ2YWwgLSBNYWduZXRvbWV0ZXIgY29tcGVuc2F0aW9uIGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gTXVzdCBiZSBpbiB0aGUgcmFuZ2UgMTAwIG1zIHRvIDEgMDAwIG1zLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uLlxuICAgKlxuICAgKi9cbiAgYXN5bmMgc2V0TWFnbmV0Q29tcEludGVydmFsKGludGVydmFsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbnRlcnZhbCA8IDEwMCB8fCBpbnRlcnZhbCA+IDEwMDApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBpbnRlcnZhbCBoYXMgdG8gYmUgaW4gdGhlIHJhbmdlIDEwMCAtIDEwMDAgbXMuXCIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlc2VydmUgdmFsdWVzIGZvciB0aG9zZSBzZXR0aW5ncyB0aGF0IGFyZSBub3QgYmVpbmcgY2hhbmdlZFxuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYyk7XG4gICAgICBjb25zdCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheSg5KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YUFycmF5W2ldID0gcmVjZWl2ZWREYXRhLmdldFVpbnQ4KGkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhQXJyYXlbNF0gPSBpbnRlcnZhbCAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbNV0gPSAoaW50ZXJ2YWwgPj4gOCkgJiAweGZmO1xuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fd3JpdGVEYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMsIGRhdGFBcnJheSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJFcnJvciB3aGVuIHNldHRpbmcgbmV3IG1hZ25ldG9tZXRlciBjb21wZW5zYXRpb24gaW50ZXJ2YWw6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyBtb3Rpb24gcHJvY2Vzc2luZyB1bml0IHVwZGF0ZSBmcmVxdWVuY3kuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBmcmVxdWVuY3kgLSBNb3Rpb24gcHJvY2Vzc2luZyBmcmVxdWVuY3kgaW4gSHouIFRoZSBhbGxvd2VkIHJhbmdlIGlzIDUgLSAyMDAgSHouXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb24uXG4gICAqXG4gICAqL1xuICBhc3luYyBzZXRNb3Rpb25Qcm9jZXNzRnJlcXVlbmN5KGZyZXF1ZW5jeSkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnJlcXVlbmN5IDwgMTAwIHx8IGZyZXF1ZW5jeSA+IDIwMCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIGludGVydmFsIGhhcyB0byBiZSBpbiB0aGUgcmFuZ2UgNSAtIDIwMCBIei5cIikpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVzZXJ2ZSB2YWx1ZXMgZm9yIHRob3NlIHNldHRpbmdzIHRoYXQgYXJlIG5vdCBiZWluZyBjaGFuZ2VkXG4gICAgICBjb25zdCByZWNlaXZlZERhdGEgPSBhd2FpdCB0aGlzLl9yZWFkRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljKTtcbiAgICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KDkpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkYXRhQXJyYXlbaV0gPSByZWNlaXZlZERhdGEuZ2V0VWludDgoaSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFBcnJheVs2XSA9IGZyZXF1ZW5jeSAmIDB4ZmY7XG4gICAgICBkYXRhQXJyYXlbN10gPSAoZnJlcXVlbmN5ID4+IDgpICYgMHhmZjtcblxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3dyaXRlRGF0YSh0aGlzLnRtc0NvbmZpZ0NoYXJhY3RlcmlzdGljLCBkYXRhQXJyYXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiRXJyb3Igd2hlbiBzZXR0aW5nIG5ldyBtb3Rpb24gcG9yY2Vzc2luZyB1bml0IHVwZGF0ZSBmcmVxdWVuY3k6IFwiICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgU2V0cyB3YWtlLW9uLW1vdGlvbiBmZWF0dXJlIHRvIGVuYWJsZWQgb3IgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gU2V0IHRvIFRydWUgdG8gZW5hYmxlIG9yIEZhbHNlIHRvIGRpc2FibGUgd2FrZS1vbi1tb3Rpb24gZmVhdHVyZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvbi5cbiAgICpcbiAgICovXG4gIGFzeW5jIHNldFdha2VPbk1vdGlvbihlbmFibGUpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHR5cGVvZiBlbmFibGUgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgYXJndW1lbnQgbXVzdCBiZSB0cnVlIG9yIGZhbHNlLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXNlcnZlIHZhbHVlcyBmb3IgdGhvc2Ugc2V0dGluZ3MgdGhhdCBhcmUgbm90IGJlaW5nIGNoYW5nZWRcbiAgICAgIGNvbnN0IHJlY2VpdmVkRGF0YSA9IGF3YWl0IHRoaXMuX3JlYWREYXRhKHRoaXMudG1zQ29uZmlnQ2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoOSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFBcnJheVtpXSA9IHJlY2VpdmVkRGF0YS5nZXRVaW50OChpKTtcbiAgICAgIH1cblxuICAgICAgZGF0YUFycmF5WzhdID0gZW5hYmxlID8gMSA6IDA7XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl93cml0ZURhdGEodGhpcy50bXNDb25maWdDaGFyYWN0ZXJpc3RpYywgZGF0YUFycmF5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkVycm9yIHdoZW4gc2V0dGluZyBuZXcgbWFnbmV0b21ldGVyIGNvbXBlbnNhdGlvbiBpbnRlcnZhbDpcIiArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgdGFwIGRldGVjdGlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSB0YXAgZGV0ZWN0aW9uIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIHRhcEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMudGFwRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl90YXBOb3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnRhcEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy50YXBFdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMudGFwQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy50YXBFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfdGFwTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gZGF0YS5nZXRVaW50OCgwKTtcbiAgICBjb25zdCBjb3VudCA9IGRhdGEuZ2V0VWludDgoMSk7XG4gICAgdGhpcy50YXBFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxuICAgICAgICBjb3VudDogY291bnQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyBvcmllbnRhdGlvbiBkZXRlY3Rpb24gbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgb3JpZW50YXRpb24gZGV0ZWN0aW9uIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIG9yaWVudGF0aW9uRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5vcmllbnRhdGlvbkV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fb3JpZW50YXRpb25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMub3JpZW50YXRpb25DaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm9yaWVudGF0aW9uRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX29yaWVudGF0aW9uTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkYXRhLmdldFVpbnQ4KDApO1xuICAgIHRoaXMub3JpZW50YXRpb25FdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcihvcmllbnRhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgcXVhdGVybmlvbiBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBxdWF0ZXJuaW9uIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICovXG4gIGFzeW5jIHF1YXRlcm5pb25FbmFibGUoZXZlbnRIYW5kbGVyLCBlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlKSB7XG4gICAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3F1YXRlcm5pb25Ob3RpZnlIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVyc1sxXS5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnF1YXRlcm5pb25FdmVudExpc3RlbmVycy5pbmRleE9mKFtldmVudEhhbmRsZXJdKSwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX25vdGlmeUNoYXJhY3RlcmlzdGljKHRoaXMucXVhdGVybmlvbkNoYXJhY3RlcmlzdGljLCBlbmFibGUsIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9xdWF0ZXJuaW9uTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICAvLyBEaXZpZGUgYnkgKDEgPDwgMzApIGFjY29yZGluZyB0byBzZW5zb3Igc3BlY2lmaWNhdGlvblxuICAgIGxldCB3ID0gZGF0YS5nZXRJbnQzMigwLCB0cnVlKSAvICgxIDw8IDMwKTtcbiAgICBsZXQgeCA9IGRhdGEuZ2V0SW50MzIoNCwgdHJ1ZSkgLyAoMSA8PCAzMCk7XG4gICAgbGV0IHkgPSBkYXRhLmdldEludDMyKDgsIHRydWUpIC8gKDEgPDwgMzApO1xuICAgIGxldCB6ID0gZGF0YS5nZXRJbnQzMigxMiwgdHJ1ZSkgLyAoMSA8PCAzMCk7XG4gICAgY29uc3QgbWFnbml0dWRlID0gTWF0aC5zcXJ0KE1hdGgucG93KHcsIDIpICsgTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSArIE1hdGgucG93KHosIDIpKTtcblxuICAgIGlmIChtYWduaXR1ZGUgIT09IDApIHtcbiAgICAgIHcgLz0gbWFnbml0dWRlO1xuICAgICAgeCAvPSBtYWduaXR1ZGU7XG4gICAgICB5IC89IG1hZ25pdHVkZTtcbiAgICAgIHogLz0gbWFnbml0dWRlO1xuICAgIH1cblxuICAgIHRoaXMucXVhdGVybmlvbkV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgdzogdyxcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeSxcbiAgICAgICAgejogeixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIHN0ZXAgY291bnRlciBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSBzdGVwIGNvdW50ZXIgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgc3RlcEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fc3RlcE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuc3RlcEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5zdGVwQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5zdGVwRXZlbnRMaXN0ZW5lcnNbMF0pO1xuICB9XG5cbiAgX3N0ZXBOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBjb25zdCBsaXR0bGVFbmRpYW4gPSB0cnVlO1xuICAgIGNvbnN0IGNvdW50ID0gZGF0YS5nZXRVaW50MzIoMCwgbGl0dGxlRW5kaWFuKTtcbiAgICBjb25zdCB0aW1lID0gZGF0YS5nZXRVaW50MzIoNCwgbGl0dGxlRW5kaWFuKTtcbiAgICB0aGlzLnN0ZXBFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIGNvdW50OiBjb3VudCxcbiAgICAgICAgdGltZToge1xuICAgICAgICAgIHZhbHVlOiB0aW1lLFxuICAgICAgICAgIHVuaXQ6IFwibXNcIixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIHJhdyBtb3Rpb24gZGF0YSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYSByYXcgbW90aW9uIGRhdGEgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgbW90aW9uUmF3RW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5tb3Rpb25SYXdFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX21vdGlvblJhd05vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5tb3Rpb25SYXdDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm1vdGlvblJhd0V2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9tb3Rpb25SYXdOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIC8vIERpdmlkZSBieSAyXjYgPSA2NCB0byBnZXQgYWNjZWxlcm9tZXRlciBjb3JyZWN0IHZhbHVlc1xuICAgIGNvbnN0IGFjY1ggPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNjQ7XG4gICAgY29uc3QgYWNjWSA9IGRhdGEuZ2V0SW50MTYoMiwgdHJ1ZSkgLyA2NDtcbiAgICBjb25zdCBhY2NaID0gZGF0YS5nZXRJbnQxNig0LCB0cnVlKSAvIDY0O1xuXG4gICAgLy8gRGl2aWRlIGJ5IDJeMTEgPSAyMDQ4IHRvIGdldCBjb3JyZWN0IGd5cm9zY29wZSB2YWx1ZXNcbiAgICBjb25zdCBneXJvWCA9IGRhdGEuZ2V0SW50MTYoNiwgdHJ1ZSkgLyAyMDQ4O1xuICAgIGNvbnN0IGd5cm9ZID0gZGF0YS5nZXRJbnQxNig4LCB0cnVlKSAvIDIwNDg7XG4gICAgY29uc3QgZ3lyb1ogPSBkYXRhLmdldEludDE2KDEwLCB0cnVlKSAvIDIwNDg7XG5cbiAgICAvLyBEaXZpZGUgYnkgMl4xMiA9IDQwOTYgdG8gZ2V0IGNvcnJlY3QgY29tcGFzcyB2YWx1ZXNcbiAgICBjb25zdCBjb21wYXNzWCA9IGRhdGEuZ2V0SW50MTYoMTIsIHRydWUpIC8gNDA5NjtcbiAgICBjb25zdCBjb21wYXNzWSA9IGRhdGEuZ2V0SW50MTYoMTQsIHRydWUpIC8gNDA5NjtcbiAgICBjb25zdCBjb21wYXNzWiA9IGRhdGEuZ2V0SW50MTYoMTYsIHRydWUpIC8gNDA5NjtcblxuICAgIHRoaXMubW90aW9uUmF3RXZlbnRMaXN0ZW5lcnNbMV0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyKSA9PiB7XG4gICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICBhY2NlbGVyb21ldGVyOiB7XG4gICAgICAgICAgeDogYWNjWCxcbiAgICAgICAgICB5OiBhY2NZLFxuICAgICAgICAgIHo6IGFjY1osXG4gICAgICAgICAgdW5pdDogXCJHXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGd5cm9zY29wZToge1xuICAgICAgICAgIHg6IGd5cm9YLFxuICAgICAgICAgIHk6IGd5cm9ZLFxuICAgICAgICAgIHo6IGd5cm9aLFxuICAgICAgICAgIHVuaXQ6IFwiZGVnL3NcIixcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGFzczoge1xuICAgICAgICAgIHg6IGNvbXBhc3NYLFxuICAgICAgICAgIHk6IGNvbXBhc3NZLFxuICAgICAgICAgIHo6IGNvbXBhc3NaLFxuICAgICAgICAgIHVuaXQ6IFwibWljcm9UZXNsYVwiLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIEVuYWJsZXMgRXVsZXIgYW5nbGUgZGF0YSBub3RpZmljYXRpb25zIGZyb20gVGhpbmd5LiBUaGUgYXNzaWduZWQgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGNhbGxlZCB3aGVuIG5vdGlmaWNhdGlvbnMgYXJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiAgQGFzeW5jXG4gICAqICBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudEhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyB0cmlnZ2VyZWQgb24gbm90aWZpY2F0aW9uLiBXaWxsIHJlY2VpdmUgYW4gRXVsZXIgYW5nbGUgZGF0YSBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBldWxlckVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2V1bGVyTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmV1bGVyRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmV1bGVyQ2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5ldWxlckV2ZW50TGlzdGVuZXJzWzBdKTtcbiAgfVxuXG4gIF9ldWxlck5vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gRGl2aWRlIGJ5IHR3byBieXRlcyAoMTw8MTYgb3IgMl4xNiBvciA2NTUzNikgdG8gZ2V0IGNvcnJlY3QgdmFsdWVcbiAgICBjb25zdCByb2xsID0gZGF0YS5nZXRJbnQzMigwLCB0cnVlKSAvIDY1NTM2O1xuICAgIGNvbnN0IHBpdGNoID0gZGF0YS5nZXRJbnQzMig0LCB0cnVlKSAvIDY1NTM2O1xuICAgIGNvbnN0IHlhdyA9IGRhdGEuZ2V0SW50MzIoOCwgdHJ1ZSkgLyA2NTUzNjtcblxuICAgIHRoaXMuZXVsZXJFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHJvbGw6IHJvbGwsXG4gICAgICAgIHBpdGNoOiBwaXRjaCxcbiAgICAgICAgeWF3OiB5YXcsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRW5hYmxlcyByb3RhdGlvbiBtYXRyaXggbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3VuY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGFuIHJvdGF0aW9uIG1hdHJpeCBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyByb3RhdGlvbk1hdHJpeEVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX3JvdGF0aW9uTWF0cml4Tm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLnJvdGF0aW9uTWF0cml4RXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyhcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhDaGFyYWN0ZXJpc3RpYyxcbiAgICAgIGVuYWJsZSxcbiAgICAgIHRoaXMucm90YXRpb25NYXRyaXhFdmVudExpc3RlbmVyc1swXVxuICAgICk7XG4gIH1cblxuICBfcm90YXRpb25NYXRyaXhOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIC8vIERpdmlkZSBieSAyXjIgPSA0IHRvIGdldCBjb3JyZWN0IHZhbHVlc1xuICAgIGNvbnN0IHIxYzEgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByMWMyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjFjMyA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIyYzEgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByMmMyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjJjMyA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuICAgIGNvbnN0IHIzYzEgPSBkYXRhLmdldEludDE2KDAsIHRydWUpIC8gNDtcbiAgICBjb25zdCByM2MyID0gZGF0YS5nZXRJbnQxNigwLCB0cnVlKSAvIDQ7XG4gICAgY29uc3QgcjNjMyA9IGRhdGEuZ2V0SW50MTYoMCwgdHJ1ZSkgLyA0O1xuXG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeEV2ZW50TGlzdGVuZXJzWzFdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgZXZlbnRIYW5kbGVyKHtcbiAgICAgICAgcm93MTogW3IxYzEsIHIxYzIsIHIxYzNdLFxuICAgICAgICByb3cyOiBbcjJjMSwgcjJjMiwgcjJjM10sXG4gICAgICAgIHJvdzM6IFtyM2MxLCByM2MyLCByM2MzXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIGhlYWRpbmcgbm90aWZpY2F0aW9ucyBmcm9tIFRoaW5neS4gVGhlIGFzc2lnbmVkIGV2ZW50IGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgd2hlbiBub3RpZmljYXRpb25zIGFyZSByZWNlaXZlZC5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIG5vdGlmaWNhdGlvbi4gV2lsbCByZWNlaXZlIGEgaGVhZGluZyBvYmplY3QgYXMgYXJndW1lbnQuXG4gICAqICBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIEVuYWJsZXMgbm90aWZpY2F0aW9ucyBpZiB0cnVlIG9yIGRpc2FibGVzIHRoZW0gaWYgc2V0IHRvIGZhbHNlLlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxFcnJvcj59IFJldHVybnMgYSBwcm9taXNlIHdoZW4gcmVzb2x2ZWQgb3IgYSBwcm9taXNlIHdpdGggYW4gZXJyb3Igb24gcmVqZWN0aW9uXG4gICAqXG4gICAqL1xuICBhc3luYyBoZWFkaW5nRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9oZWFkaW5nTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1sxXS5zcGxpY2UodGhpcy5oZWFkaW5nRXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihbZXZlbnRIYW5kbGVyXSksIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLmhlYWRpbmdDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfaGVhZGluZ05vdGlmeUhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gRGl2aWRlIGJ5IDJeMTYgPSA2NTUzNiB0byBnZXQgY29ycmVjdCBoZWFkaW5nIHZhbHVlc1xuICAgIGNvbnN0IGhlYWRpbmcgPSBkYXRhLmdldEludDMyKDAsIHRydWUpIC8gNjU1MzY7XG5cbiAgICB0aGlzLmhlYWRpbmdFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHZhbHVlOiBoZWFkaW5nLFxuICAgICAgICB1bml0OiBcImRlZ3JlZXNcIixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIGdyYXZpdHkgdmVjdG9yIG5vdGlmaWNhdGlvbnMgZnJvbSBUaGluZ3kuIFRoZSBhc3NpZ25lZCBldmVudCBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIHdoZW4gbm90aWZpY2F0aW9ucyBhcmUgcmVjZWl2ZWQuXG4gICAqXG4gICAqICBAYXN5bmNcbiAgICogIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50SGFuZGxlciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIHRyaWdnZXJlZCBvbiBub3RpZmljYXRpb24uIFdpbGwgcmVjZWl2ZSBhIGhlYWRpbmcgb2JqZWN0IGFzIGFyZ3VtZW50LlxuICAgKiAgQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBFbmFibGVzIG5vdGlmaWNhdGlvbnMgaWYgdHJ1ZSBvciBkaXNhYmxlcyB0aGVtIGlmIHNldCB0byBmYWxzZS5cbiAgICogIEByZXR1cm4ge1Byb21pc2U8RXJyb3I+fSBSZXR1cm5zIGEgcHJvbWlzZSB3aGVuIHJlc29sdmVkIG9yIGEgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG9uIHJlamVjdGlvblxuICAgKlxuICAgKi9cbiAgYXN5bmMgZ3Jhdml0eVZlY3RvckVuYWJsZShldmVudEhhbmRsZXIsIGVuYWJsZSkge1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzBdID0gdGhpcy5fZ3Jhdml0eVZlY3Rvck5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzFdLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ncmF2aXR5VmVjdG9yRXZlbnRMaXN0ZW5lcnNbMV0uc3BsaWNlKHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWMoXG4gICAgICB0aGlzLmdyYXZpdHlWZWN0b3JDaGFyYWN0ZXJpc3RpYyxcbiAgICAgIGVuYWJsZSxcbiAgICAgIHRoaXMuZ3Jhdml0eVZlY3RvckV2ZW50TGlzdGVuZXJzWzBdXG4gICAgKTtcbiAgfVxuXG4gIF9ncmF2aXR5VmVjdG9yTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgeCA9IGRhdGEuZ2V0RmxvYXQzMigwLCB0cnVlKTtcbiAgICBjb25zdCB5ID0gZGF0YS5nZXRGbG9hdDMyKDQsIHRydWUpO1xuICAgIGNvbnN0IHogPSBkYXRhLmdldEZsb2F0MzIoOCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmdyYXZpdHlWZWN0b3JFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHo6IHosXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vICAqKioqKiogIC8vXG5cbiAgLyogIFNvdW5kIHNlcnZpY2UgICovXG5cbiAgbWljcm9waG9uZUVuYWJsZShlbmFibGUpIHtcbiAgICAvLyBUYWJsZXMgb2YgY29uc3RhbnRzIG5lZWRlZCBmb3Igd2hlbiB3ZSBkZWNvZGUgdGhlIGFkcGNtLWVuY29kZWQgYXVkaW8gZnJvbSB0aGUgVGhpbmd5XG4gICAgaWYgKHRoaXMuX01JQ1JPUEhPTkVfSU5ERVhfVEFCTEUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fTUlDUk9QSE9ORV9JTkRFWF9UQUJMRSA9IFstMSwgLTEsIC0xLCAtMSwgMiwgNCwgNiwgOCwgLTEsIC0xLCAtMSwgLTEsIDIsIDQsIDYsIDhdO1xuICAgIH1cbiAgICBpZiAodGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fTUlDUk9QSE9ORV9TVEVQX1NJWkVfVEFCTEUgPSBbNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNiwgMTcsIDE5LCAyMSwgMjMsIDI1LCAyOCwgMzEsIDM0LCAzNywgNDEsIDQ1LCA1MCwgNTUsIDYwLCA2NiwgNzMsIDgwLCA4OCwgOTcsIDEwNywgMTE4LCAxMzAsIDE0MywgMTU3LCAxNzMsIDE5MCwgMjA5LFxuICAgICAgICAyMzAsIDI1MywgMjc5LCAzMDcsIDMzNywgMzcxLCA0MDgsIDQ0OSwgNDk0LCA1NDQsIDU5OCwgNjU4LCA3MjQsIDc5NiwgODc2LCA5NjMsIDEwNjAsIDExNjYsIDEyODIsIDE0MTEsIDE1NTIsIDE3MDcsIDE4NzgsIDIwNjYsIDIyNzIsIDI0OTksIDI3NDksIDMwMjQsIDMzMjcsIDM2NjAsIDQwMjYsIDQ0MjgsIDQ4NzEsIDUzNTgsXG4gICAgICAgIDU4OTQsIDY0ODQsIDcxMzIsIDc4NDUsIDg2MzAsIDk0OTMsIDEwNDQyLCAxMTQ4NywgMTI2MzUsIDEzODk5LCAxNTI4OSwgMTY4MTgsIDE4NTAwLCAyMDM1MCwgMjIzODUsIDI0NjIzLCAyNzA4NiwgMjk3OTQsIDMyNzY3XTtcbiAgICB9XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5taWNyb3Bob25lRXZlbnRMaXN0ZW5lcnNbMF0gPSB0aGlzLl9taWNyb3Bob25lTm90aWZ5SGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgLy8gbGFnZXIgZW4gbnkgYXVkaW8gY29udGV4dCwgc2thbCBiYXJlIGhhIMOpbiBhdiBkZW5uZVxuICAgICAgaWYgKHRoaXMuYXVkaW9DdHggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICAgICAgIHRoaXMuYXVkaW9DdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9ub3RpZnlDaGFyYWN0ZXJpc3RpYyh0aGlzLm1pY3JvcGhvbmVDaGFyYWN0ZXJpc3RpYywgZW5hYmxlLCB0aGlzLm1pY3JvcGhvbmVFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cbiAgX21pY3JvcGhvbmVOb3RpZnlIYW5kbGVyKGV2ZW50KSB7XG4gICAgY29uc3QgYXVkaW9QYWNrZXQgPSBldmVudC50YXJnZXQudmFsdWUuYnVmZmVyO1xuICAgIGNvbnN0IGFkcGNtID0ge1xuICAgICAgaGVhZGVyOiBuZXcgRGF0YVZpZXcoYXVkaW9QYWNrZXQuc2xpY2UoMCwgMykpLFxuICAgICAgZGF0YTogbmV3IERhdGFWaWV3KGF1ZGlvUGFja2V0LnNsaWNlKDMpKSxcbiAgICB9O1xuICAgIGNvbnN0IGRlY29kZWRBdWRpbyA9IHRoaXMuX2RlY29kZUF1ZGlvKGFkcGNtKTtcbiAgICB0aGlzLl9wbGF5RGVjb2RlZEF1ZGlvKGRlY29kZWRBdWRpbyk7XG4gIH1cbiAgLyogIFNvdW5kIHNlcnZpY2UgICovXG4gIF9kZWNvZGVBdWRpbyhhZHBjbSkge1xuICAgIC8vIEFsbG9jYXRlIG91dHB1dCBidWZmZXJcbiAgICBjb25zdCBhdWRpb0J1ZmZlckRhdGFMZW5ndGggPSBhZHBjbS5kYXRhLmJ5dGVMZW5ndGg7XG4gICAgY29uc3QgYXVkaW9CdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNTEyKTtcbiAgICBjb25zdCBwY20gPSBuZXcgRGF0YVZpZXcoYXVkaW9CdWZmZXIpO1xuICAgIGxldCBkaWZmO1xuICAgIGxldCBidWZmZXJTdGVwID0gZmFsc2U7XG4gICAgbGV0IGlucHV0QnVmZmVyID0gMDtcbiAgICBsZXQgZGVsdGEgPSAwO1xuICAgIGxldCBzaWduID0gMDtcbiAgICBsZXQgc3RlcDtcblxuICAgIC8vIFRoZSBmaXJzdCAyIGJ5dGVzIG9mIEFEUENNIGZyYW1lIGFyZSB0aGUgcHJlZGljdGVkIHZhbHVlXG4gICAgbGV0IHZhbHVlUHJlZGljdGVkID0gYWRwY20uaGVhZGVyLmdldEludDE2KDAsIGZhbHNlKTtcbiAgICAvLyBUaGUgM3JkIGJ5dGUgaXMgdGhlIGluZGV4IHZhbHVlXG4gICAgbGV0IGluZGV4ID0gYWRwY20uaGVhZGVyLmdldEludDgoMik7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICBpZiAoaW5kZXggPiA4OCkge1xuICAgICAgaW5kZXggPSA4ODtcbiAgICB9XG4gICAgc3RlcCA9IHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFW2luZGV4XTtcbiAgICBmb3IgKGxldCBfaW4gPSAwLCBfb3V0ID0gMDsgX2luIDwgYXVkaW9CdWZmZXJEYXRhTGVuZ3RoOyBfb3V0ICs9IDIpIHtcbiAgICAgIC8qIFN0ZXAgMSAtIGdldCB0aGUgZGVsdGEgdmFsdWUgKi9cbiAgICAgIGlmIChidWZmZXJTdGVwKSB7XG4gICAgICAgIGRlbHRhID0gaW5wdXRCdWZmZXIgJiAweDBGO1xuICAgICAgICBfaW4rKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0QnVmZmVyID0gYWRwY20uZGF0YS5nZXRJbnQ4KF9pbik7XG4gICAgICAgIGRlbHRhID0gKGlucHV0QnVmZmVyID4+IDQpICYgMHgwRjtcbiAgICAgIH1cbiAgICAgIGJ1ZmZlclN0ZXAgPSAhYnVmZmVyU3RlcDtcbiAgICAgIC8qIFN0ZXAgMiAtIEZpbmQgbmV3IGluZGV4IHZhbHVlIChmb3IgbGF0ZXIpICovXG4gICAgICBpbmRleCArPSB0aGlzLl9NSUNST1BIT05FX0lOREVYX1RBQkxFW2RlbHRhXTtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgaW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4ID4gODgpIHtcbiAgICAgICAgaW5kZXggPSA4ODtcbiAgICAgIH1cbiAgICAgIC8qIFN0ZXAgMyAtIFNlcGFyYXRlIHNpZ24gYW5kIG1hZ25pdHVkZSAqL1xuICAgICAgc2lnbiA9IGRlbHRhICYgODtcbiAgICAgIGRlbHRhID0gZGVsdGEgJiA3O1xuICAgICAgLyogU3RlcCA0IC0gQ29tcHV0ZSBkaWZmZXJlbmNlIGFuZCBuZXcgcHJlZGljdGVkIHZhbHVlICovXG4gICAgICBkaWZmID0gKHN0ZXAgPj4gMyk7XG4gICAgICBpZiAoKGRlbHRhICYgNCkgPiAwKSB7XG4gICAgICAgIGRpZmYgKz0gc3RlcDtcbiAgICAgIH1cbiAgICAgIGlmICgoZGVsdGEgJiAyKSA+IDApIHtcbiAgICAgICAgZGlmZiArPSAoc3RlcCA+PiAxKTtcbiAgICAgIH1cbiAgICAgIGlmICgoZGVsdGEgJiAxKSA+IDApIHtcbiAgICAgICAgZGlmZiArPSAoc3RlcCA+PiAyKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaWduID4gMCkge1xuICAgICAgICB2YWx1ZVByZWRpY3RlZCAtPSBkaWZmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgKz0gZGlmZjtcbiAgICAgIH1cbiAgICAgIC8qIFN0ZXAgNSAtIGNsYW1wIG91dHB1dCB2YWx1ZSAqL1xuICAgICAgaWYgKHZhbHVlUHJlZGljdGVkID4gMzI3NjcpIHtcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgPSAzMjc2NztcbiAgICAgIH0gZWxzZSBpZiAodmFsdWVQcmVkaWN0ZWQgPCAtMzI3NjgpIHtcbiAgICAgICAgdmFsdWVQcmVkaWN0ZWQgPSAtMzI3Njg7XG4gICAgICB9XG4gICAgICAvKiBTdGVwIDYgLSBVcGRhdGUgc3RlcCB2YWx1ZSAqL1xuICAgICAgc3RlcCA9IHRoaXMuX01JQ1JPUEhPTkVfU1RFUF9TSVpFX1RBQkxFW2luZGV4XTtcbiAgICAgIC8qIFN0ZXAgNyAtIE91dHB1dCB2YWx1ZSAqL1xuICAgICAgcGNtLnNldEludDE2KF9vdXQsIHZhbHVlUHJlZGljdGVkLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHBjbTtcbiAgfVxuICBfcGxheURlY29kZWRBdWRpbyhhdWRpbykge1xuICAgIGlmICh0aGlzLl9hdWRpb1N0YWNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2F1ZGlvU3RhY2sgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fYXVkaW9TdGFjay5wdXNoKGF1ZGlvKTtcbiAgICBpZiAodGhpcy5fYXVkaW9TdGFjay5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX3NjaGVkdWxlQXVkaW9CdWZmZXJzKCk7XG4gICAgfVxuICB9XG4gIF9zY2hlZHVsZUF1ZGlvQnVmZmVycygpIHtcbiAgICB3aGlsZSAodGhpcy5fYXVkaW9TdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBidWZmZXJUaW1lID0gMC4wMTsgLy8gQnVmZmVyIHRpbWUgaW4gc2Vjb25kcyBiZWZvcmUgaW5pdGlhbCBhdWRpbyBjaHVuayBpcyBwbGF5ZWRcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX2F1ZGlvU3RhY2suc2hpZnQoKTtcbiAgICAgIGNvbnN0IGNoYW5uZWxzID0gMTtcbiAgICAgIGNvbnN0IGZyYW1lY291bnQgPSBidWZmZXIuYnl0ZUxlbmd0aCAvIDI7XG4gICAgICBpZiAodGhpcy5fYXVkaW9OZXh0VGltZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2F1ZGlvTmV4dFRpbWUgPSAwO1xuICAgICAgfVxuICAgICAgY29uc3QgbXlBcnJheUJ1ZmZlciA9IHRoaXMuYXVkaW9DdHguY3JlYXRlQnVmZmVyKGNoYW5uZWxzLCBmcmFtZWNvdW50LCAxNjAwMCk7XG4gICAgICAvLyBUaGlzIGdpdmVzIHVzIHRoZSBhY3R1YWwgYXJyYXkgdGhhdCBjb250YWlucyB0aGUgZGF0YVxuICAgICAgY29uc3Qgbm93QnVmZmVyaW5nID0gbXlBcnJheUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyLmJ5dGVMZW5ndGggLyAyOyBpKyspIHtcbiAgICAgICAgbm93QnVmZmVyaW5nW2ldID0gYnVmZmVyLmdldEludDE2KDIgKiBpLCB0cnVlKSAvIDMyNzY4LjA7XG4gICAgICB9XG4gICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgc291cmNlLmJ1ZmZlciA9IG15QXJyYXlCdWZmZXI7XG4gICAgICBzb3VyY2UuY29ubmVjdCh0aGlzLmF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9hdWRpb05leHRUaW1lID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2F1ZGlvTmV4dFRpbWUgPSB0aGlzLmF1ZGlvQ3R4LmN1cnJlbnRUaW1lICsgYnVmZmVyVGltZTtcbiAgICAgIH1cbiAgICAgIHNvdXJjZS5zdGFydCh0aGlzLl9hdWRpb05leHRUaW1lKTtcbiAgICAgIHRoaXMuX2F1ZGlvTmV4dFRpbWUgKz0gc291cmNlLmJ1ZmZlci5kdXJhdGlvbjtcbiAgICB9XG4gIH1cbiAgLy8gICoqKioqKiAgLy9cblxuICAvKiAgQmF0dGVyeSBzZXJ2aWNlICAqL1xuICAvKipcbiAgICogIEdldHMgdGhlIGJhdHRlcnkgbGV2ZWwgb2YgVGhpbmd5LlxuICAgKlxuICAgKiAgQHJldHVybiB7UHJvbWlzZTxPYmplY3QgfCBFcnJvcj59IFJldHVybnMgYmF0dGVyeSBsZXZlbCBpbiBwZXJjZW50YWdlIHdoZW4gcHJvbWlzZSBpcyByZXNvbHZlZCBvciBhbiBlcnJvciBpZiByZWplY3RlZC5cbiAgICpcbiAgICovXG4gIGFzeW5jIGdldEJhdHRlcnlMZXZlbCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVjZWl2ZWREYXRhID0gYXdhaXQgdGhpcy5fcmVhZERhdGEodGhpcy5iYXR0ZXJ5Q2hhcmFjdGVyaXN0aWMpO1xuICAgICAgY29uc3QgbGV2ZWwgPSByZWNlaXZlZERhdGEuZ2V0VWludDgoMCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBsZXZlbCxcbiAgICAgICAgdW5pdDogXCIlXCIsXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBFbmFibGVzIGJhdHRlcnkgbGV2ZWwgbm90aWZpY2F0aW9ucy5cbiAgICpcbiAgICogIEBhc3luY1xuICAgKiAgQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRIYW5kbGVyIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uIGJhdHRlcnkgbGV2ZWwgY2hhbmdlLiBXaWxsIHJlY2VpdmUgYSBiYXR0ZXJ5IGxldmVsIG9iamVjdCBhcyBhcmd1bWVudC5cbiAgICogIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gRW5hYmxlcyBub3RpZmljYXRpb25zIGlmIHRydWUgb3IgZGlzYWJsZXMgdGhlbSBpZiBzZXQgdG8gZmFsc2UuXG4gICAqICBAcmV0dXJuIHtQcm9taXNlPEVycm9yPn0gUmV0dXJucyBhIHByb21pc2Ugd2hlbiByZXNvbHZlZCBvciBhIHByb21pc2Ugd2l0aCBhbiBlcnJvciBvbiByZWplY3Rpb25cbiAgICpcbiAgICAgKi9cbiAgYXN5bmMgYmF0dGVyeUxldmVsRW5hYmxlKGV2ZW50SGFuZGxlciwgZW5hYmxlKSB7XG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1swXSA9IHRoaXMuX2JhdHRlcnlMZXZlbE5vdGlmeUhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuYmF0dGVyeUxldmVsRXZlbnRMaXN0ZW5lcnNbMV0ucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzWzFdLnNwbGljZSh0aGlzLmJhdHRlcnlMZXZlbEV2ZW50TGlzdGVuZXJzLmluZGV4T2YoW2V2ZW50SGFuZGxlcl0pLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fbm90aWZ5Q2hhcmFjdGVyaXN0aWModGhpcy5iYXR0ZXJ5Q2hhcmFjdGVyaXN0aWMsIGVuYWJsZSwgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1swXSk7XG4gIH1cblxuICBfYmF0dGVyeUxldmVsTm90aWZ5SGFuZGxlcihldmVudCkge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc3QgdmFsdWUgPSBkYXRhLmdldFVpbnQ4KDApO1xuXG4gICAgdGhpcy5iYXR0ZXJ5TGV2ZWxFdmVudExpc3RlbmVyc1sxXS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgIGV2ZW50SGFuZGxlcih7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgdW5pdDogXCIlXCIsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG4vLyAgKioqKioqICAvL1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1BhcnRUaGVtZU1peGlufSBmcm9tICcuL2xpYnMvcGFydC10aGVtZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBQYXJ0VGhlbWVFbGVtZW50IGV4dGVuZHMgUGFydFRoZW1lTWl4aW4oSFRNTEVsZW1lbnQpIHtcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIGBgO1xuICAgIH1cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmICghdGhpcy5zaGFkb3dSb290KSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5jb25zdHJ1Y3Rvci50ZW1wbGF0ZTtcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcbiAgICAgICAgICBjb25zdCBkb20gPSBkb2N1bWVudC5pbXBvcnROb2RlKFxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChkb20pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG5leHBvcnQgY2xhc3MgWFRodW1icyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cbiAgICAgICAgPGRpdiBwYXJ0PVwidGh1bWItZG93blwiPvCfkY48L2Rpdj5cbiAgICAgIGA7XG4gICAgfVxuICB9XG5cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXRodW1icycsIFhUaHVtYnMpO1xuXG5leHBvcnQgY2xhc3MgWFJhdGluZyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXRodW1iczo6cGFydCh0aHVtYi11cCkge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIGdyZWVuO1xuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogYmx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgeC10aHVtYnM6OnBhcnQodGh1bWItZG93bikge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIHJlZDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICB9XG4gICAgICAgIDwvc3R5bGU+XG4gICAgICAgIDxkaXYgcGFydD1cInN1YmplY3RcIj48c2xvdD48L3Nsb3Q+PC9kaXY+XG4gICAgICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XG4gICAgICBgO1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtcmF0aW5nJywgWFJhdGluZyk7XG5cbmV4cG9ydCBjbGFzcyBYSG9zdCBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCBvcmFuZ2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtcmF0aW5nIHtcbiAgICAgICAgICAgIG1hcmdpbjogNHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtcmF0aW5nIHtcbiAgICAgICAgICAgIC0tZTEtcGFydC1zdWJqZWN0LXBhZGRpbmc6IDRweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLnVubzpob3Zlcjo6cGFydChzdWJqZWN0KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAuZHVvOjpwYXJ0KHN1YmplY3QpIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdvbGRlbnJvZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLnVubzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdyZWVuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAudW5vOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0b21hdG87XG4gICAgICAgICAgfVxuICAgICAgICAgIC5kdW86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB5ZWxsb3c7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5kdW86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsYWNrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXJhdGluZzo6dGhlbWUodGh1bWItdXApIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwidW5vXCI+4p2k77iPPC94LXJhdGluZz5cbiAgICAgICAgPGJyPlxuICAgICAgICA8eC1yYXRpbmcgY2xhc3M9XCJkdW9cIj7wn6S3PC94LXJhdGluZz5cbiAgICAgIGA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1ob3N0JywgWEhvc3QpOyIsIi8qXG5AbGljZW5zZVxuQ29weXJpZ2h0IChjKSAyMDE3IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcblRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG5UaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbkNvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG5zdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuKi9cblxuY29uc3QgcGFydERhdGFLZXkgPSAnX19jc3NQYXJ0cyc7XG5jb25zdCBwYXJ0SWRLZXkgPSAnX19wYXJ0SWQnO1xuXG4vKipcbiAqIENvbnZlcnRzIGFueSBzdHlsZSBlbGVtZW50cyBpbiB0aGUgc2hhZG93Um9vdCB0byByZXBsYWNlIDo6cGFydC86OnRoZW1lXG4gKiB3aXRoIGN1c3RvbSBwcm9wZXJ0aWVzIHVzZWQgdG8gdHJhbnNtaXQgdGhpcyBkYXRhIGRvd24gdGhlIGRvbSB0cmVlLiBBbHNvXG4gKiBjYWNoZXMgcGFydCBtZXRhZGF0YSBmb3IgbGF0ZXIgbG9va3VwLlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVBhcnRzKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IG51bGw7XG4gICAgcmV0dXJuO1xuICB9XG4gIEFycmF5LmZyb20oZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJykpLmZvckVhY2goc3R5bGUgPT4ge1xuICAgIGNvbnN0IGluZm8gPSBwYXJ0Q3NzVG9DdXN0b21Qcm9wQ3NzKGVsZW1lbnQsIHN0eWxlLnRleHRDb250ZW50KTtcbiAgICBpZiAoaW5mby5wYXJ0cykge1xuICAgICAgZWxlbWVudFtwYXJ0RGF0YUtleV0gPSBlbGVtZW50W3BhcnREYXRhS2V5XSB8fCBbXTtcbiAgICAgIGVsZW1lbnRbcGFydERhdGFLZXldLnB1c2goLi4uaW5mby5wYXJ0cyk7XG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9IGluZm8uY3NzO1xuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gZW5zdXJlUGFydERhdGEoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ19fY3NzUGFydHMnKSkge1xuICAgIGluaXRpYWxpemVQYXJ0cyhlbGVtZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJ0RGF0YUZvckVsZW1lbnQoZWxlbWVudCkge1xuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcbiAgcmV0dXJuIGVsZW1lbnRbcGFydERhdGFLZXldO1xufVxuXG4vLyBUT0RPKHNvcnZlbGwpOiBicml0dGxlIGR1ZSB0byByZWdleC1pbmcgY3NzLiBJbnN0ZWFkIHVzZSBhIGNzcyBwYXJzZXIuXG4vKipcbiAqIFR1cm5zIGNzcyB1c2luZyBgOjpwYXJ0YCBpbnRvIGNzcyB1c2luZyB2YXJpYWJsZXMgZm9yIHRob3NlIHBhcnRzLlxuICogQWxzbyByZXR1cm5zIHBhcnQgbWV0YWRhdGEuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBjc3NUZXh0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjc3M6IHBhcnRpZmllZCBjc3MsIHBhcnRzOiBhcnJheSBvZiBwYXJ0cyBvZiB0aGUgZm9ybVxuICoge25hbWUsIHNlbGVjdG9yLCBwcm9wc31cbiAqIEV4YW1wbGUgb2YgcGFydC1pZmllZCBjc3MsIGdpdmVuOlxuICogLmZvbzo6cGFydChiYXIpIHsgY29sb3I6IHJlZCB9XG4gKiBvdXRwdXQ6XG4gKiAuZm9vIHsgLS1lMS1wYXJ0LWJhci1jb2xvcjogcmVkOyB9XG4gKiB3aGVyZSBgZTFgIGlzIGEgZ3VpZCBmb3IgdGhpcyBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBwYXJ0Q3NzVG9DdXN0b21Qcm9wQ3NzKGVsZW1lbnQsIGNzc1RleHQpIHtcbiAgbGV0IHBhcnRzO1xuICBsZXQgY3NzID0gY3NzVGV4dC5yZXBsYWNlKGNzc1JlLCAobSwgc2VsZWN0b3IsIHR5cGUsIG5hbWUsIGVuZFNlbGVjdG9yLCBwcm9wc1N0cikgPT4ge1xuICAgIHBhcnRzID0gcGFydHMgfHwgW107XG4gICAgbGV0IHByb3BzID0ge307XG4gICAgY29uc3QgcHJvcHNBcnJheSA9IHByb3BzU3RyLnNwbGl0KC9cXHMqO1xccyovKTtcbiAgICBwcm9wc0FycmF5LmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBjb25zdCBzID0gcHJvcC5zcGxpdCgnOicpO1xuICAgICAgY29uc3QgbmFtZSA9IHMuc2hpZnQoKS50cmltKCk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHMuam9pbignOicpO1xuICAgICAgcHJvcHNbbmFtZV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XG4gICAgcGFydHMucHVzaCh7c2VsZWN0b3IsIGVuZFNlbGVjdG9yLCBuYW1lLCBwcm9wcywgaXNUaGVtZTogdHlwZSA9PSB0aGVtZX0pO1xuICAgIGxldCBwYXJ0UHJvcHMgPSAnJztcbiAgICBmb3IgKGxldCBwIGluIHByb3BzKSB7XG4gICAgICBwYXJ0UHJvcHMgPSBgJHtwYXJ0UHJvcHN9XFxuXFx0JHt2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwLCBlbmRTZWxlY3Rvcil9OiAke3Byb3BzW3BdfTtgO1xuICAgIH1cbiAgICByZXR1cm4gYFxcbiR7c2VsZWN0b3IgfHwgJyonfSB7XFxuXFx0JHtwYXJ0UHJvcHMudHJpbSgpfVxcbn1gO1xuICB9KTtcbiAgcmV0dXJuIHtwYXJ0cywgY3NzfTtcbn1cblxuLy8gZ3VpZCBmb3IgZWxlbWVudCBwYXJ0IHNjb3Blc1xubGV0IHBhcnRJZCA9IDA7XG5mdW5jdGlvbiBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnRbcGFydElkS2V5XSA9PSB1bmRlZmluZWQpIHtcbiAgICBlbGVtZW50W3BhcnRJZEtleV0gPSBwYXJ0SWQrKztcbiAgfVxuICByZXR1cm4gZWxlbWVudFtwYXJ0SWRLZXldO1xufVxuXG5jb25zdCB0aGVtZSA9ICc6OnRoZW1lJztcbmNvbnN0IGNzc1JlID0gL1xccyooLiopKDo6KD86cGFydHx0aGVtZSkpXFwoKFteKV0rKVxcKShbXlxcc3tdKilcXHMqe1xccyooW159XSopXFxzKn0vZ1xuXG4vLyBjcmVhdGVzIGEgY3VzdG9tIHByb3BlcnR5IG5hbWUgZm9yIGEgcGFydC5cbmZ1bmN0aW9uIHZhckZvclBhcnQoaWQsIG5hbWUsIHByb3AsIGVuZFNlbGVjdG9yKSB7XG4gIHJldHVybiBgLS1lJHtpZH0tcGFydC0ke25hbWV9LSR7cHJvcH0ke2VuZFNlbGVjdG9yID8gYC0ke2VuZFNlbGVjdG9yLnJlcGxhY2UoL1xcOi9nLCAnJyl9YCA6ICcnfWA7XG59XG5cbi8qKlxuICogUHJvZHVjZXMgYSBzdHlsZSB1c2luZyBjc3MgY3VzdG9tIHByb3BlcnRpZXMgdG8gc3R5bGUgOjpwYXJ0Lzo6dGhlbWVcbiAqIGZvciBhbGwgdGhlIGRvbSBpbiB0aGUgZWxlbWVudCdzIHNoYWRvd1Jvb3QuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGFydFRoZW1lKGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQuc2hhZG93Um9vdCkge1xuICAgIGNvbnN0IG9sZFN0eWxlID0gZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlW3BhcnRzXScpO1xuICAgIGlmIChvbGRTdHlsZSkge1xuICAgICAgb2xkU3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGRTdHlsZSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGhvc3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCkuaG9zdDtcbiAgaWYgKGhvc3QpIHtcbiAgICAvLyBub3RlOiBlbnN1cmUgaG9zdCBoYXMgcGFydCBkYXRhIHNvIHRoYXQgZWxlbWVudHMgdGhhdCBib290IHVwXG4gICAgLy8gd2hpbGUgdGhlIGhvc3QgaXMgYmVpbmcgY29ubmVjdGVkIGNhbiBzdHlsZSBwYXJ0cy5cbiAgICBlbnN1cmVQYXJ0RGF0YShob3N0KTtcbiAgICBjb25zdCBjc3MgPSBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpO1xuICAgIGlmIChjc3MpIHtcbiAgICAgIGNvbnN0IG5ld1N0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIG5ld1N0eWxlLnRleHRDb250ZW50ID0gY3NzO1xuICAgICAgZWxlbWVudC5zaGFkb3dSb290LmFwcGVuZENoaWxkKG5ld1N0eWxlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBjc3NUZXh0IGEgc3R5bGUgZWxlbWVudCB0byBhcHBseSBwYXJ0IGNzcyB0byBhIGdpdmVuIGVsZW1lbnQuXG4gKiBUaGUgZWxlbWVudCdzIHNoYWRvd1Jvb3QgZG9tIGlzIHNjYW5uZWQgZm9yIG5vZGVzIHdpdGggYSBgcGFydGAgYXR0cmlidXRlLlxuICogVGhlbiBzZWxlY3RvcnMgYXJlIGNyZWF0ZWQgbWF0Y2hpbmcgdGhlIHBhcnQgYXR0cmlidXRlIGNvbnRhaW5pbmcgcHJvcGVydGllc1xuICogd2l0aCBwYXJ0cyBkZWZpbmVkIGluIHRoZSBlbGVtZW50J3MgaG9zdC5cbiAqIFRoZSBhbmNlc3RvciB0cmVlIGlzIHRyYXZlcnNlZCBmb3IgZm9yd2FyZGVkIHBhcnRzIGFuZCB0aGVtZS5cbiAqIGUuZy5cbiAqIFtwYXJ0PVwiYmFyXCJdIHtcbiAqICAgY29sb3I6IHZhcigtLWUxLXBhcnQtYmFyLWNvbG9yKTtcbiAqIH1cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IGZvciB3aGljaCB0byBhcHBseSBwYXJ0IGNzc1xuICovXG5mdW5jdGlvbiBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpIHtcbiAgZW5zdXJlUGFydERhdGEoZWxlbWVudCk7XG4gIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcbiAgY29uc3QgcGFydE5vZGVzID0gZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1twYXJ0XScpO1xuICBsZXQgY3NzID0gJyc7XG4gIGZvciAobGV0IGk9MDsgaSA8IHBhcnROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGF0dHIgPSBwYXJ0Tm9kZXNbaV0uZ2V0QXR0cmlidXRlKCdwYXJ0Jyk7XG4gICAgY29uc3QgcGFydEluZm8gPSBwYXJ0SW5mb0Zyb21BdHRyKGF0dHIpO1xuICAgIGNzcyA9IGAke2Nzc31cXG5cXHQke3J1bGVGb3JQYXJ0SW5mbyhwYXJ0SW5mbywgYXR0ciwgZWxlbWVudCl9YFxuICB9XG4gIHJldHVybiBjc3M7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNzcyBydWxlIHRoYXQgYXBwbGllcyBhIHBhcnQuXG4gKiBAcGFyYW0geyp9IHBhcnRJbmZvIEFycmF5IG9mIHBhcnQgaW5mbyBmcm9tIHBhcnQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyp9IGF0dHIgUGFydCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Kn0gZWxlbWVudCBFbGVtZW50IHdpdGhpbiB3aGljaCB0aGUgcGFydCBleGlzdHNcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRleHQgb2YgdGhlIGNzcyBydWxlIG9mIHRoZSBmb3JtIGBzZWxlY3RvciB7IHByb3BlcnRpZXMgfWBcbiAqL1xuZnVuY3Rpb24gcnVsZUZvclBhcnRJbmZvKHBhcnRJbmZvLCBhdHRyLCBlbGVtZW50KSB7XG4gIGxldCB0ZXh0ID0gJyc7XG4gIHBhcnRJbmZvLmZvckVhY2goaW5mbyA9PiB7XG4gICAgaWYgKCFpbmZvLmZvcndhcmQpIHtcbiAgICAgIGNvbnN0IHByb3BzID0gcHJvcHNGb3JQYXJ0KGluZm8ubmFtZSwgZWxlbWVudCk7XG4gICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgZm9yIChsZXQgYnVja2V0IGluIHByb3BzKSB7XG4gICAgICAgICAgbGV0IHByb3BzQnVja2V0ID0gcHJvcHNbYnVja2V0XTtcbiAgICAgICAgICBsZXQgcGFydFByb3BzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgcCBpbiBwcm9wc0J1Y2tldCkge1xuICAgICAgICAgICAgcGFydFByb3BzLnB1c2goYCR7cH06ICR7cHJvcHNCdWNrZXRbcF19O2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0ZXh0ID0gYCR7dGV4dH1cXG5bcGFydD1cIiR7YXR0cn1cIl0ke2J1Y2tldH0ge1xcblxcdCR7cGFydFByb3BzLmpvaW4oJ1xcblxcdCcpfVxcbn1gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRleHQ7XG59XG5cbi8qKlxuICogUGFyc2VzIGEgcGFydCBhdHRyaWJ1dGUgaW50byBhbiBhcnJheSBvZiBwYXJ0IGluZm9cbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZSB2YWx1ZVxuICogQHJldHVybnMge2FycmF5fSBBcnJheSBvZiBwYXJ0IGluZm8gb2JqZWN0cyBvZiB0aGUgZm9ybSB7bmFtZSwgZm93YXJkfVxuICovXG5mdW5jdGlvbiBwYXJ0SW5mb0Zyb21BdHRyKGF0dHIpIHtcbiAgY29uc3QgcGllY2VzID0gYXR0ciA/IGF0dHIuc3BsaXQoL1xccyosXFxzKi8pIDogW107XG4gIGxldCBwYXJ0cyA9IFtdO1xuICBwaWVjZXMuZm9yRWFjaChwID0+IHtcbiAgICBjb25zdCBtID0gcCA/IHAubWF0Y2goLyhbXj1cXHNdKikoPzpcXHMqPT5cXHMqKC4qKSk/LykgOiBbXTtcbiAgICBpZiAobSkge1xuICAgICAgcGFydHMucHVzaCh7bmFtZTogbVsyXSB8fCBtWzFdLCBmb3J3YXJkOiBtWzJdID8gbVsxXSA6IG51bGx9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcGFydHM7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gcGFydCBuYW1lIHJldHVybnMgYSBwcm9wZXJ0aWVzIG9iamVjdCB3aGljaCBzZXRzIGFueSBhbmNlc3RvclxuICogcHJvdmlkZWQgcGFydCBwcm9wZXJ0aWVzIHRvIHRoZSBwcm9wZXIgYW5jZXN0b3IgcHJvdmlkZWQgY3NzIHZhcmlhYmxlIG5hbWUuXG4gKiBlLmcuXG4gKiBjb2xvcjogYHZhcigtLWUxLXBhcnQtYmFyLWNvbG9yKTtgXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHBhcnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGhpbiB3aGljaCBkb20gd2l0aCBwYXJ0IGV4aXN0c1xuICogQHBhcmFtIHtib29sZWFufSByZXF1aXJlVGhlbWUgVHJ1ZSBpZiBvbmx5IDo6dGhlbWUgc2hvdWxkIGJlIGNvbGxlY3RlZC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiBwcm9wZXJ0aWVzIGZvciB0aGUgZ2l2ZW4gcGFydCBzZXQgdG8gcGFydCB2YXJpYWJsZXNcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50cyBhbmNlc3RvcnMuXG4gKi9cbmZ1bmN0aW9uIHByb3BzRm9yUGFydChuYW1lLCBlbGVtZW50LCByZXF1aXJlVGhlbWUpIHtcbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQgJiYgZWxlbWVudC5nZXRSb290Tm9kZSgpLmhvc3Q7XG4gIGlmICghaG9zdCkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBjb2xsZWN0IHByb3BzIGZyb20gaG9zdCBlbGVtZW50LlxuICBsZXQgcHJvcHMgPSBwcm9wc0Zyb21FbGVtZW50KG5hbWUsIGhvc3QsIHJlcXVpcmVUaGVtZSk7XG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kIG1hdGNoaW5nIGB0aGVtZWAgcHJvcGVydGllc1xuICBjb25zdCB0aGVtZVByb3BzID0gcHJvcHNGb3JQYXJ0KG5hbWUsIGhvc3QsIHRydWUpO1xuICBwcm9wcyA9IG1peFBhcnRQcm9wcyhwcm9wcywgdGhlbWVQcm9wcyk7XG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kICpmb3J3YXJkZWQqIHBhcnQgcHJvcGVydGllc1xuICBpZiAoIXJlcXVpcmVUaGVtZSkge1xuICAgIC8vIGZvcndhcmRpbmc6IHJlY3Vyc2VzIHVwIGFuY2VzdG9yIHRyZWUhXG4gICAgY29uc3QgcGFydEluZm8gPSBwYXJ0SW5mb0Zyb21BdHRyKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdwYXJ0JykpO1xuICAgIC8vIHtuYW1lLCBmb3J3YXJkfSB3aGVyZSBgKmAgY2FuIGJlIGluY2x1ZGVkXG4gICAgcGFydEluZm8uZm9yRWFjaChpbmZvID0+IHtcbiAgICAgIGxldCBjYXRjaEFsbCA9IGluZm8uZm9yd2FyZCAmJiAoaW5mby5mb3J3YXJkLmluZGV4T2YoJyonKSA+PSAwKTtcbiAgICAgIGlmIChuYW1lID09IGluZm8uZm9yd2FyZCB8fCBjYXRjaEFsbCkge1xuICAgICAgICBjb25zdCBhbmNlc3Rvck5hbWUgPSBjYXRjaEFsbCA/IGluZm8ubmFtZS5yZXBsYWNlKCcqJywgbmFtZSkgOiBpbmZvLm5hbWU7XG4gICAgICAgIGNvbnN0IGZvcndhcmRlZCA9IHByb3BzRm9yUGFydChhbmNlc3Rvck5hbWUsIGhvc3QpO1xuICAgICAgICBwcm9wcyA9IG1peFBhcnRQcm9wcyhwcm9wcywgZm9yd2FyZGVkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBwcm9wcztcbn1cblxuLyoqXG4gKiBDb2xsZWN0cyBjc3MgZm9yIHRoZSBnaXZlbiBuYW1lIGZyb20gdGhlIHBhcnQgZGF0YSBmb3IgdGhlIGdpdmVuXG4gKiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcGFydFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2l0aCBwYXJ0IGNzcy9kYXRhLlxuICogQHBhcmFtIHtCb29sZWFufSByZXF1aXJlVGhlbWUgVHJ1ZSBpZiBzaG91bGQgb25seSBtYXRjaCA6OnRoZW1lXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgb2YgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHBhcnQgc2V0IHRvIHBhcnQgdmFyaWFibGVzXG4gKiBwcm92aWRlZCBieSB0aGUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gcHJvcHNGcm9tRWxlbWVudChuYW1lLCBlbGVtZW50LCByZXF1aXJlVGhlbWUpIHtcbiAgbGV0IHByb3BzO1xuICBjb25zdCBwYXJ0cyA9IHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KTtcbiAgaWYgKHBhcnRzKSB7XG4gICAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIGlmIChwYXJ0cykge1xuICAgICAgcGFydHMuZm9yRWFjaCgocGFydCkgPT4ge1xuICAgICAgICBpZiAocGFydC5uYW1lID09IG5hbWUgJiYgKCFyZXF1aXJlVGhlbWUgfHwgcGFydC5pc1RoZW1lKSkge1xuICAgICAgICAgIHByb3BzID0gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvcHM7XG59XG5cbi8qKlxuICogQWRkIHBhcnQgY3NzIHRvIHRoZSBwcm9wcyBvYmplY3QgZm9yIHRoZSBnaXZlbiBwYXJ0L25hbWUuXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgT2JqZWN0IGNvbnRhaW5pbmcgcGFydCBjc3NcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0IFBhcnQgZGF0YVxuICogQHBhcmFtIHtubWJlcn0gaWQgZWxlbWVudCBwYXJ0IGlkXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lIG9mIHBhcnRcbiAqL1xuZnVuY3Rpb24gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSkge1xuICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICBjb25zdCBidWNrZXQgPSBwYXJ0LmVuZFNlbGVjdG9yIHx8ICcnO1xuICBjb25zdCBiID0gcHJvcHNbYnVja2V0XSA9IHByb3BzW2J1Y2tldF0gfHwge307XG4gIGZvciAobGV0IHAgaW4gcGFydC5wcm9wcykge1xuICAgIGJbcF0gPSBgdmFyKCR7dmFyRm9yUGFydChpZCwgbmFtZSwgcCwgcGFydC5lbmRTZWxlY3Rvcil9KWA7XG4gIH1cbiAgcmV0dXJuIHByb3BzO1xufVxuXG5mdW5jdGlvbiBtaXhQYXJ0UHJvcHMoYSwgYikge1xuICBpZiAoYSAmJiBiKSB7XG4gICAgZm9yIChsZXQgaSBpbiBiKSB7XG4gICAgICAvLyBlbnN1cmUgc3RvcmFnZSBleGlzdHNcbiAgICAgIGlmICghYVtpXSkge1xuICAgICAgICBhW2ldID0ge307XG4gICAgICB9XG4gICAgICBPYmplY3QuYXNzaWduKGFbaV0sIGJbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYSB8fCBiO1xufVxuXG4vKipcbiAqIEN1c3RvbUVsZW1lbnQgbWl4aW4gdGhhdCBjYW4gYmUgYXBwbGllZCB0byBwcm92aWRlIDo6cGFydC86OnRoZW1lIHN1cHBvcnQuXG4gKiBAcGFyYW0geyp9IHN1cGVyQ2xhc3NcbiAqL1xuZXhwb3J0IGxldCBQYXJ0VGhlbWVNaXhpbiA9IHN1cGVyQ2xhc3MgPT4ge1xuXG4gIHJldHVybiBjbGFzcyBQYXJ0VGhlbWVDbGFzcyBleHRlbmRzIHN1cGVyQ2xhc3Mge1xuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBpZiAoc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLl9hcHBseVBhcnRUaGVtZSgpKTtcbiAgICB9XG5cbiAgICBfYXBwbHlQYXJ0VGhlbWUoKSB7XG4gICAgICBhcHBseVBhcnRUaGVtZSh0aGlzKTtcbiAgICB9XG5cbiAgfVxuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBpbXBvcnQgeyBNYXNrSGlnaGxpZ2h0ZXIgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbWFzay1oaWdobGlnaHRlci9tYXNrLWhpZ2hsaWdodGVyLmpzJztcbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHtcbiAgICBEZW1vc1xufSBmcm9tICcuL2RlbW9zLmpzJztcbmltcG9ydCB7XG4gICAgWEhvc3QsXG4gICAgWFJhdGluZyxcbiAgICBYVGh1bWJzXG59IGZyb20gJy4vcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzJztcbmltcG9ydCB7XG4gICAgQ29udHJvbFByZXpcbn0gZnJvbSAnLi9jb250cm9sUHJlei5qcyc7XG5pbXBvcnQge1xuICAgIFR5cGVUZXh0XG59IGZyb20gJy4vdHlwZWRUZXh0LmpzJ1xuXG5cblxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcblxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgICAgY29uc3QgaW5JZnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xuXG5cbiAgICAgICAgbmV3IFR5cGVUZXh0KCk7XG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xuICAgICAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xuICAgICAgICAgICAgLy8gbmV3IENvbnRyb2xQcmV6KCk7XG4gICAgICAgIH1cblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0ZS1ob3VkaW5pLXdvcmtmbG93JywgKCkgPT4ge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsQmFja0ZyYWdtZW50KCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIFR5cGVUZXh0IHtcblxuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdjc3MtdmFyLXR5cGUnLCAoKT0+e1xuXHRcdFx0dHlwaW5nKCd0aXRsZS1jc3MtdmFyJywgMTAsIDApXG5cdFx0XHQudHlwZSgnQ1NTIFZhcmlhYmxlcycpLndhaXQoMjAwMCkuc3BlZWQoNTApXG5cdFx0XHQuZGVsZXRlKCdWYXJpYWJsZXMnKS53YWl0KDUwMCkuc3BlZWQoMTAwKVxuXHRcdFx0LnR5cGUoJ0N1c3RvbSBQcm9wZXJ0aWVzJyk7XG5cdFx0fSk7XG5cdH1cbn0iXX0=
