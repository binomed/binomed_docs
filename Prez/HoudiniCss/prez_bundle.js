(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animations = exports.Animations = function () {
	function Animations() {
		_classCallCheck(this, Animations);

		this._browserEngine();

		this._animateHoudini();
	}

	_createClass(Animations, [{
		key: '_browserEngine',
		value: function _browserEngine() {
			var stepAnimation = 0;
			var STEP_DOWNLOAD = 1;
			var STEP_PROCESS = 2;
			var STEP_BROWSER = 3;
			var STEP_LAYOUT = 4;
			var STEP_PAINT = 5;

			function fragmentAnimation() {
				stepAnimation++;
				switch (stepAnimation) {
					case STEP_DOWNLOAD:
						{
							document.getElementById('svg-cloud').classList.add('html');
							document.getElementById('svg-html').classList.add('html');
							document.getElementById('title-download').classList.add('html');
							break;
						}
					case STEP_PROCESS:
						{
							document.getElementById('title-download').classList.remove('html');
							document.getElementById('svg-cloud').classList.remove('html');
							document.getElementById('svg-html').classList.remove('html');
							document.getElementById('title-parsing').classList.add('process');
							document.getElementById('svg-html').classList.add('process');
							document.getElementById('svg-process').classList.add('process');
							document.getElementById('svg-objects').classList.add('process');
							document.getElementById('svg-css-objects').classList.add('process');
							break;
						}
					case STEP_BROWSER:
						{
							document.getElementById('title-parsing').classList.remove('process');
							document.getElementById('svg-html').classList.remove('process');
							document.getElementById('svg-process').classList.remove('process');
							document.getElementById('svg-objects').classList.remove('process');
							document.getElementById('svg-css-objects').classList.remove('process');
							document.getElementById('svg-browser').classList.add('render');
							document.getElementById('svg-objects').classList.add('render');
							document.getElementById('svg-css-objects').classList.add('render');
							document.getElementById('svg-browser-layout').classList.add('render');
							break;
						}
					case STEP_LAYOUT:
						{
							document.getElementById('svg-browser-layout').classList.remove('render');
							document.getElementById('title-layout').classList.add('render-layout');
							document.getElementById('svg-browser-layout').classList.add('render-layout');
							break;
						}
					case STEP_PAINT:
						{
							document.getElementById('title-layout').classList.remove('render-layout');
							document.getElementById('svg-browser-layout').classList.remove('render-layout');
							document.getElementById('title-paint').classList.add('render-paint');
							document.getElementById('svg-browser-layout').classList.add('render-paint');
							break;
						}
				}
			}

			Reveal.addEventListener('browser-engine', function () {
				Reveal.addEventListener('fragmentshown', fragmentAnimation);
				stepAnimation = 0;

				function clearAnim() {
					Reveal.removeEventListener('fragmentshown', fragmentAnimation);
					Reveal.removeEventListener('slidechanged', clearAnim);
					document.getElementById('svg-cloud').classList.remove('html');
					document.getElementById('svg-html').classList.remove('html');
					document.getElementById('title-download').classList.remove('html');
					document.getElementById('svg-process').classList.remove('process');
					document.getElementById('svg-html').classList.remove('process');
					document.getElementById('svg-objects').classList.remove('process');
					document.getElementById('svg-css-objects').classList.remove('process');
					document.getElementById('title-parsing').classList.remove('process');
					document.getElementById('title-parsing').classList.remove('process');
					document.getElementById('svg-objects').classList.remove('render');
					document.getElementById('svg-css-objects').classList.remove('render');
					document.getElementById('svg-browser-layout').classList.remove('render');
					document.getElementById('svg-browser').classList.remove('render');
					document.getElementById('title-layout').classList.remove('render-layout');
					document.getElementById('svg-browser-layout').classList.remove('render-layout');
					document.getElementById('title-paint').classList.remove('render-paint');
					document.getElementById('svg-browser-layout').classList.remove('render-paint');
				}

				setTimeout(function () {
					Reveal.addEventListener('slidechanged', clearAnim);
				}, 100);
			});
		}
	}, {
		key: '_animateHoudini',
		value: function _animateHoudini() {

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
	}]);

	return Animations;
}();

},{}],2:[function(require,module,exports){
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

            this._demoTypeOM();
            this._demoPaintApi();
            this._demoCssVar();
            this._demoPropertiesAndValues();
            this.frame = 0;
        } catch (error) {
            console.error(error);
        }
    }

    _createClass(Demos, [{
        key: '_demoTypeOM',
        value: function _demoTypeOM() {
            if (!window.CSSTransformValue) {
                return;
            }
            var transform = //new CSSTransformValue([
            new CSSRotate(0, 0, 1, CSS.deg(0));
            //]);
            var square = document.querySelector('#squareDemo');
            square.attributeStyleMap.set('transform', transform);
            var rafId = void 0;
            var stopAnimation = false;
            function draw() {
                transform.angle.value = (transform.angle.value + 5) % 360;
                square.attributeStyleMap.set('transform', transform);
                rafId = requestAnimationFrame(draw);
            }
            square.addEventListener('mouseenter', function () {
                return draw();
            });
            square.addEventListener('mouseleave', function () {
                return cancelAnimationFrame(rafId);
            });
        }
    }, {
        key: '_demoCssVar',
        value: function _demoCssVar() {
            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), '#render-element h2{\n    --a-super-var: #FFF;\n}\n#render-element .text-1{\n\n}\n#render-element .text-2{\n\n}');
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
    }, {
        key: '_demoPropertiesAndValues',
        value: function _demoPropertiesAndValues() {
            CSS.registerProperty({
                name: '--properties-move-register',
                syntax: '<length>',
                initialValue: '0px'
            });
            document.querySelector('#btn-square-properties').addEventListener('click', function () {
                document.querySelector('#square-properties').classList.remove('move');
                document.querySelector('#square-properties').classList.add('move');
            });
            document.querySelector('#btn-square-no-properties').addEventListener('click', function () {
                document.querySelector('#square-no-properties').classList.remove('move');
                document.querySelector('#square-no-properties').classList.add('move');
            });
        }
    }, {
        key: '_demoPaintApi',
        value: function _demoPaintApi() {
            (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');

            new _applyCss.ApplyCss(document.getElementById('codemirror-paint-api-css'), '#render-element-paint-api {\n    --circle-color: #FFF;\n    --width-circle: 100px;\n    width: var(--width-circle);\n    background-image: paint(circle, 0px, red);\n}');

            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-paint-api'), 'javascript', 'paint(ctx, geom, properties, args) {\n    // Determine the center point and radius.\n    const radius = Math.min(geom.width / 2, geom.height / 2);\n    const border = args[0].value;\n    // Change the border color.\n    ctx.fillStyle = args[1].toString();\n    ctx.arc(geom.width - border / 2, geom.height -  - border / 2, radius - border, 0, 2 * Math.PI);\n    // Change the fill color.\n    const color = properties.get(\'--circle-color\').toString();\n    ctx.fillStyle = color;\n    ctx.arc(geom.width / 2, geom.height / 2, radius, 0, 2 * Math.PI);\n}');
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
            theme: 'paraiso-dark'
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
        theme: 'paraiso-dark'
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
'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';

var _highlightEvent = require('./highlightEvent.js');

var _demos = require('./demos.js');

var _noise = require('./houdini/noise.js');

var _anim = require('./animations/anim.js');

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

        CSS.registerProperty({
            name: '--cadre-color',
            syntax: '<color> | none',
            initialValue: 'white'
        });
        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/cadre-worklet.js');
        new _noise.Noise();
        new _anim.Animations();
        // new TypeText();
        if (!inIframe) {
            new _demos.Demos();
            // new HighlightEvents();
        } else {
                // document.getElementById('magicVideo').style.display = 'none';
            }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./animations/anim.js":1,"./demos.js":2,"./highlightEvent.js":6,"./houdini/noise.js":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9ub2lzZS5qcyIsInNjcmlwdHMvcHJlei5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7O0lBQ2EsVSxXQUFBLFU7QUFDWix1QkFBYztBQUFBOztBQUNiLE9BQUssY0FBTDs7QUFFQSxPQUFLLGVBQUw7QUFDQTs7OzttQ0FFZ0I7QUFDaEIsT0FBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxPQUFNLGdCQUFnQixDQUF0QjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sY0FBYyxDQUFwQjtBQUNBLE9BQU0sYUFBYSxDQUFuQjs7QUFFQSxZQUFTLGlCQUFULEdBQTRCO0FBQzNCO0FBQ0EsWUFBTyxhQUFQO0FBQ0MsVUFBSyxhQUFMO0FBQW9CO0FBQ25CLGdCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBckMsQ0FBK0MsR0FBL0MsQ0FBbUQsTUFBbkQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLEdBQTlDLENBQWtELE1BQWxEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FBMUMsQ0FBb0QsR0FBcEQsQ0FBd0QsTUFBeEQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxZQUFMO0FBQW1CO0FBQ2xCLGdCQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDLFNBQTFDLENBQW9ELE1BQXBELENBQTJELE1BQTNEO0FBQ0EsZ0JBQVMs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aUJBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxNQUF6QjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssT0FBMUI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFwQixFQUF3QixHQUF4QixFQUE2QjtBQUN6QixxQkFBSyxXQUFMO0FBQ0g7O0FBRUQsaUJBQUssSUFBTDtBQUNIOzs7OztBQUdEOytCQUNPO0FBQ0gsaUJBQUssTUFBTCxHQUFjLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFkO0FBQ0EsaUJBQUssR0FBTCxHQUFXLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBWDs7QUFFQSxpQkFBSyxLQUFMO0FBQ0g7Ozs7Ozs7QUN6RUw7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBQ0E7O0FBSUEsQ0FBQyxrQkFBa0I7O0FBR2YsbUJBQWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBR0EsWUFBSSxnQkFBSixDQUFxQjtBQUNqQixrQkFBTSxlQURXO0FBRWpCLG9CQUFRLGdCQUZTO0FBR2pCLDBCQUFjO0FBSEcsU0FBckI7QUFLQSxTQUFDLElBQUksWUFBSixJQUFvQixZQUFyQixFQUFtQyxTQUFuQyxDQUE2QyxvQ0FBN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1g7QUFDQTtBQUNILFNBSEQsTUFHSztBQUNEO0FBQ0g7QUFFSjs7QUFJRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0E3QkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIid1c2Ugc3RyaWN0J1xyXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9ucyB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLl9icm93c2VyRW5naW5lKCk7XHJcblxyXG5cdFx0dGhpcy5fYW5pbWF0ZUhvdWRpbmkoKTtcclxuXHR9XHJcblxyXG5cdF9icm93c2VyRW5naW5lKCkge1xyXG5cdFx0bGV0IHN0ZXBBbmltYXRpb24gPSAwO1xyXG5cdFx0Y29uc3QgU1RFUF9ET1dOTE9BRCA9IDE7XHJcblx0XHRjb25zdCBTVEVQX1BST0NFU1MgPSAyO1xyXG5cdFx0Y29uc3QgU1RFUF9CUk9XU0VSID0gMztcclxuXHRcdGNvbnN0IFNURVBfTEFZT1VUID0gNDtcclxuXHRcdGNvbnN0IFNURVBfUEFJTlQgPSA1O1xyXG5cclxuXHRcdGZ1bmN0aW9uIGZyYWdtZW50QW5pbWF0aW9uKCl7XHJcblx0XHRcdHN0ZXBBbmltYXRpb24rKztcclxuXHRcdFx0c3dpdGNoKHN0ZXBBbmltYXRpb24pe1xyXG5cdFx0XHRcdGNhc2UoU1RFUF9ET1dOTE9BRCk6e1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5hZGQoJ2h0bWwnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ2h0bWwnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5hZGQoJ2h0bWwnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXNlKFNURVBfUFJPQ0VTUyk6e1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXNlKFNURVBfQlJPV1NFUik6e1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLXByb2Nlc3MnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyJykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXNlKFNURVBfTEFZT1VUKTp7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXNlKFNURVBfUEFJTlQpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhaW50JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLXBhaW50Jyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLXBhaW50Jyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYnJvd3Nlci1lbmdpbmUnLCAoKT0+e1xyXG5cdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGZyYWdtZW50QW5pbWF0aW9uKTtcclxuXHRcdFx0c3RlcEFuaW1hdGlvbiA9IDA7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjbGVhckFuaW0oKXtcclxuXHRcdFx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGZyYWdtZW50QW5pbWF0aW9uKTtcclxuXHRcdFx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNsb3VkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtZG93bmxvYWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3NlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFpbnQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItcGFpbnQnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLXBhaW50Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcclxuXHRcdFx0fSwxMDApO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0X2FuaW1hdGVIb3VkaW5pKCl7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRlLWhvdWRpbmktd29ya2Zsb3cnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxCYWNrRnJhZ21lbnQoKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQge1xyXG4gICAgQXBwbHlDc3NcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUNzcy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBBcHBseUNvZGVNaXJvclxyXG59IGZyb20gJy4vaGVscGVyL2FwcGx5SnMuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlbW9zIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZGVtb1R5cGVPTSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFpbnRBcGkoKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUHJvcGVydGllc0FuZFZhbHVlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBfZGVtb1R5cGVPTSgpIHtcclxuICAgICAgICBpZiAoIXdpbmRvdy5DU1NUcmFuc2Zvcm1WYWx1ZSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gLy9uZXcgQ1NTVHJhbnNmb3JtVmFsdWUoW1xyXG4gICAgICAgICAgICBuZXcgQ1NTUm90YXRlKDAsMCwxLCBDU1MuZGVnKDApKVxyXG4gICAgICAgIC8vXSk7XHJcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZURlbW8nKTtcclxuICAgICAgICBzcXVhcmUuYXR0cmlidXRlU3R5bGVNYXAuc2V0KCd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgIGxldCByYWZJZDtcclxuICAgICAgICBsZXQgc3RvcEFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXcoKXtcclxuICAgICAgICAgICAgdHJhbnNmb3JtLmFuZ2xlLnZhbHVlID0gKHRyYW5zZm9ybS5hbmdsZS52YWx1ZSArIDUpICUgMzYwO1xyXG4gICAgICAgICAgICBzcXVhcmUuYXR0cmlidXRlU3R5bGVNYXAuc2V0KCd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiBkcmF3KCkpO1xyXG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb0Nzc1ZhcigpIHtcclxuICAgICAgICAvKiogKi9cclxuICAgICAgICBuZXcgQXBwbHlDc3MoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcycpLFxyXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50IGgye1xyXG4gICAgLS1hLXN1cGVyLXZhcjogI0ZGRjtcclxufVxyXG4jcmVuZGVyLWVsZW1lbnQgLnRleHQtMXtcclxuXHJcbn1cclxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTJ7XHJcblxyXG59YFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIF9mcmFtZUluY3JlbWVudCgpe1xyXG4gICAgICAgIGlmICh0aGlzLmZyYW1lID09PSA5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaXNlJykuc3R5bGUuc2V0UHJvcGVydHkoJy0tZnJhbWUnLCB0aGlzLmZyYW1lKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZnJhbWVJbmNyZW1lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9Qcm9wZXJ0aWVzQW5kVmFsdWVzKCkge1xyXG4gICAgICAgIENTUy5yZWdpc3RlclByb3BlcnR5KHtcclxuICAgICAgICAgICAgbmFtZTogJy0tcHJvcGVydGllcy1tb3ZlLXJlZ2lzdGVyJyxcclxuICAgICAgICAgICAgc3ludGF4OiAnPGxlbmd0aD4nLFxyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICcwcHgnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG4tc3F1YXJlLXByb3BlcnRpZXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtcHJvcGVydGllcycpLmNsYXNzTGlzdC5yZW1vdmUoJ21vdmUnKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LmFkZCgnbW92ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG4tc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtbm8tcHJvcGVydGllcycpLmNsYXNzTGlzdC5yZW1vdmUoJ21vdmUnKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1uby1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LmFkZCgnbW92ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vUGFpbnRBcGkoKSB7XHJcbiAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NpcmNsZS13b3JrbGV0LmpzJyk7XHJcblxyXG4gICAgICAgIG5ldyBBcHBseUNzcyhcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpLWNzcycpLFxyXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50LXBhaW50LWFwaSB7XHJcbiAgICAtLWNpcmNsZS1jb2xvcjogI0ZGRjtcclxuICAgIC0td2lkdGgtY2lyY2xlOiAxMDBweDtcclxuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xyXG4gICAgYmFja2dyb3VuZC1pbWFnZTogcGFpbnQoY2lyY2xlLCAwcHgsIHJlZCk7XHJcbn1gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbmV3IEFwcGx5Q29kZU1pcm9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhaW50LWFwaScpLFxyXG4gICAgICAgICAgICAnamF2YXNjcmlwdCcsXHJcbiAgICAgICAgICAgIGBwYWludChjdHgsIGdlb20sIHByb3BlcnRpZXMsIGFyZ3MpIHtcclxuICAgIC8vIERldGVybWluZSB0aGUgY2VudGVyIHBvaW50IGFuZCByYWRpdXMuXHJcbiAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1pbihnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyKTtcclxuICAgIGNvbnN0IGJvcmRlciA9IGFyZ3NbMF0udmFsdWU7XHJcbiAgICAvLyBDaGFuZ2UgdGhlIGJvcmRlciBjb2xvci5cclxuICAgIGN0eC5maWxsU3R5bGUgPSBhcmdzWzFdLnRvU3RyaW5nKCk7XHJcbiAgICBjdHguYXJjKGdlb20ud2lkdGggLSBib3JkZXIgLyAyLCBnZW9tLmhlaWdodCAtICAtIGJvcmRlciAvIDIsIHJhZGl1cyAtIGJvcmRlciwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgLy8gQ2hhbmdlIHRoZSBmaWxsIGNvbG9yLlxyXG4gICAgY29uc3QgY29sb3IgPSBwcm9wZXJ0aWVzLmdldCgnLS1jaXJjbGUtY29sb3InKS50b1N0cmluZygpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY3R4LmFyYyhnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyLCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxufWApO1xyXG4gICAgfVxyXG5cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcclxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXHJcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxyXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAncGFyYWlzby1kYXJrJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyhjb2RlTWlycm9yQ3NzLmdldFZhbHVlKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdGljdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBseUNvZGVNaXJvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9ySlMgPSBDb2RlTWlycm9yKGVsdCwge1xyXG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXHJcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcclxuICAgICAgICAgICAgdGhlbWU6ICdwYXJhaXNvLWRhcmsnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xyXG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE1ZW0nO1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xyXG5jb25zdCBDT0xfV0lEVEggPSAzNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtcclxuICAgICAgICBrZXlFbHQsXHJcbiAgICAgICAgcG9zaXRpb25BcnJheVxyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XHJcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW5pdFwiLFxyXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmltcG9ydCB7XHJcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXHJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XHJcblxyXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xyXG5jb25zdCBDT0xfV0lEVEggPSAzNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvblxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDksXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb24gaW4gSlNcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZS1pbi1qcycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNjBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyA6OlBhcnRcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BhcnQnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVGVtcGxhdGUgSW5zdGFudGlhdGlvblxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAndGVtcGxhdGUtaW5zdGFudGlhdGlvbicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBIVE1MIE1vZHVsZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnaHRtbC1tb2R1bGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEwLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFBhaW50IEFQSVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncGFpbnQtYXBpJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gZ2VuZXJpYyBzZW5zb3JcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2dlbmVyaWMtc2Vuc29yJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFjY2VsZXJvbWV0ZXIgc2Vuc29yXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdhY2NlbGVyb21ldGVyLXNlbnNvcicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIE5vaXNlIHtcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0dGhpcy5jYW52YXM7XHJcblx0XHR0aGlzLmN0eDtcclxuXHRcdHRoaXMud1dpZHRoO1xyXG5cdFx0dGhpcy53SGVpZ2h0O1xyXG5cdFx0dGhpcy5ub2lzZURhdGEgPSBbXTtcclxuXHRcdHRoaXMuZnJhbWUgPSAwO1xyXG5cdFx0dGhpcy5sb29wVGltZW91dDtcclxuXHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdC8vIENyZWF0ZSBOb2lzZVxyXG4gICAgY3JlYXRlTm9pc2UoKSB7XHJcbiAgICAgICAgY29uc3QgaWRhdGEgPSB0aGlzLmN0eC5jcmVhdGVJbWFnZURhdGEodGhpcy53V2lkdGgsIHRoaXMud0hlaWdodCk7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyMzIgPSBuZXcgVWludDMyQXJyYXkoaWRhdGEuZGF0YS5idWZmZXIpO1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IGJ1ZmZlcjMyLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyMzJbaV0gPSAweGZmMDAwMDAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vaXNlRGF0YS5wdXNoKGlkYXRhKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIFBsYXkgTm9pc2VcclxuICAgIHBhaW50Tm9pc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWUgPT09IDkpIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdHgucHV0SW1hZ2VEYXRhKHRoaXMubm9pc2VEYXRhW3RoaXMuZnJhbWVdLCAwLCAwKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIExvb3BcclxuICAgIGxvb3AoKSB7XHJcbiAgICAgICAgdGhpcy5wYWludE5vaXNlKHRoaXMuZnJhbWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxvb3BUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9LCAoMTAwMCAvIDI1KSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBTZXR1cFxyXG4gICAgc2V0dXAoKSB7XHJcbiAgICAgICAgdGhpcy53V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICB0aGlzLndIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53V2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy53SGVpZ2h0O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVOb2lzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaXNlJyk7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwKCk7XHJcbiAgICB9O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0RXZlbnRzXHJcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBEZW1vc1xyXG59IGZyb20gJy4vZGVtb3MuanMnO1xyXG5pbXBvcnQge05vaXNlfSBmcm9tICcuL2hvdWRpbmkvbm9pc2UuanMnO1xyXG5pbXBvcnQge0FuaW1hdGlvbnN9IGZyb20gJy4vYW5pbWF0aW9ucy9hbmltLmpzJztcclxuXHJcblxyXG5cclxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcclxuXHJcblxyXG4gICAgICAgIENTUy5yZWdpc3RlclByb3BlcnR5KHtcclxuICAgICAgICAgICAgbmFtZTogJy0tY2FkcmUtY29sb3InLFxyXG4gICAgICAgICAgICBzeW50YXg6ICc8Y29sb3I+IHwgbm9uZScsXHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogJ3doaXRlJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2FkcmUtd29ya2xldC5qcycpO1xyXG4gICAgICAgIG5ldyBOb2lzZSgpO1xyXG4gICAgICAgIG5ldyBBbmltYXRpb25zKCk7XHJcbiAgICAgICAgLy8gbmV3IFR5cGVUZXh0KCk7XHJcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xyXG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcclxuICAgICAgICAgICAgLy8gbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyJdfQ==
