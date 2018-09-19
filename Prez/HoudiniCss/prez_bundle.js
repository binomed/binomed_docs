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

var _animationHeader = require('./houdini/animation-header.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demos = exports.Demos = function () {
    function Demos() {
        var _this = this;

        _classCallCheck(this, Demos);

        try {

            this._demoTypeOM();
            this._demoPaintApi();
            this._demoCssVar();
            this._demoPropertiesAndValues();
            this.animationDemoLoad = false;
            Reveal.addEventListener('animationDemoState', function () {
                if (!_this.animationDemoLoad) {
                    new _animationHeader.AnimationHeader();
                }
            });
            this.layoutDemoLoad = false;
            this._demoLayoutApi();
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
                inherits: false,
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
    }, {
        key: '_demoLayoutApi',
        value: function _demoLayoutApi() {
            document.querySelectorAll('#demoLayoutWorklet div').forEach(function (elem) {
                var t = elem.textContent;
                // Cut out a random amount of text, but keep at least 10 characters
                elem.textContent = t.slice(0, Math.floor(Math.random() * (t.length - 10) + 10));
            });
            CSS.layoutWorklet.addModule('./scripts/houdini/masonry-worklet.js');

            var cols = 3;
            document.querySelector('#demoMasonryBtnMinus').addEventListener('click', function () {
                cols = Math.max(3, cols - 1);
                document.querySelector('#demoMasonryCols').innerHTML = cols;
                document.querySelector('#demoLayoutWorklet').style.setProperty('--masonry-columns', cols);
            });
            document.querySelector('#demoMasonryBtnPlus').addEventListener('click', function () {
                cols = Math.min(8, cols + 1);
                document.querySelector('#demoMasonryCols').innerHTML = cols;
                document.querySelector('#demoLayoutWorklet').style.setProperty('--masonry-columns', cols);
            });
        }
    }]);

    return Demos;
}();

},{"./helper/applyCss.js":3,"./helper/applyJs.js":4,"./houdini/animation-header.js":7}],3:[function(require,module,exports){
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
var LINE_HEIGHT = '1.14em';
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
                this.eltHiglight.lineHeight = LINE_HEIGHT;
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

    //  TYped OM New Possibilities
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'typedom-new',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 2,
            leftMargin: '50px',
            width: '100%'
        }, {
            line: 1,
            nbLines: 5,
            leftMargin: '50px',
            width: '100%'
        }, {
            line: 1,
            nbLines: 8,
            leftMargin: '50px',
            width: '100%'
        }, {
            line: 1,
            nbLines: 11,
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  Typed OM New Api
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'typedom-api',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 2,
            width: '100%'
        }, {
            line: 4,
            nbLines: 3,
            width: '100%'
        }, {
            line: 8,
            nbLines: 1,
            width: '100%'
        }, {
            line: 10,
            nbLines: 2,
            width: '100%'
        }]
    });

    //  Typed OM New calc
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'typedom-calc',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            left: '760px', // linux : 800px / windows : 760px
            width: '350px'
        }, {
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 3,
            nbLines: 1,
            left: '610px', // linux : 630px / windows :  610px
            width: '300px'
        }, {
            line: 3,
            nbLines: 1,
            width: '100%'
        }, {
            line: 5,
            nbLines: 1,
            left: '610px', // linux : 630px / windows : 610px
            width: '300px'
        }, {
            line: 5,
            nbLines: 1,
            width: '100%'
        }, {
            line: 8,
            nbLines: 1,
            width: '500px'
        }, {
            line: 7,
            nbLines: 2,
            width: '100%'
        }]
    });

    //  Typed OM Operations
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'typedom-operations',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 2,
            width: '100%'
        }, {
            line: 4,
            nbLines: 2,
            width: '100%'
        }, {
            line: 7,
            nbLines: 5,
            width: '100%'
        }]
    });

    //  Typed OM Conversion
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'typedom-conversion',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 6,
            width: '100%'
        }, {
            line: 8,
            nbLines: 2,
            width: '100%'
        }]
    });

    //  Typed OM Transform
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'typedom-transform',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 1,
            nbLines: 3,
            width: '100%'
        }, {
            line: 1,
            nbLines: 4,
            width: '100%'
        }, {
            line: 1,
            nbLines: 5,
            width: '100%'
        }, {
            line: 1,
            nbLines: 7,
            width: '100%'
        }]
    });

    // CSS Custom Properties
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'css-properties',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 3,
            width: '100%'
        }, {
            line: 5,
            nbLines: 3,
            width: '100%'
        }, {
            line: 9,
            nbLines: 3,
            width: '100%'
        }]
    });

    // CSS Properties & Values Types
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'propertiesvalues-type',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 3,
            nbLines: 1,
            width: '100%'
        }, {
            line: 5,
            nbLines: 1,
            width: '100%'
        }, {
            line: 7,
            nbLines: 1,
            width: '100%'
        }, {
            line: 9,
            nbLines: 1,
            width: '100%'
        }]
    });

    // Paint Api
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'paint-api',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 2,
            width: '100%'
        }, {
            line: 4,
            nbLines: 2,
            width: '100%'
        }, {
            line: 6,
            nbLines: 2,
            width: '100%'
        }, {
            line: 8,
            nbLines: 3,
            width: '100%'
        }, {
            line: 12,
            nbLines: 1,
            width: '100%'
        }]
    });

    // Animator Declaration
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'animator-declaration',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 3,
            width: '100%'
        }, {
            line: 5,
            nbLines: 4,
            width: '100%'
        }]
    });

    // Animator TimeLine & Register
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'animator-timeline',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            topMargin: '115px',
            line: 2,
            nbLines: 2,
            width: '100%'
        }, {
            topMargin: '115px',
            line: 5,
            nbLines: 6,
            width: '100%'
        }]
    });

    // Animator Effects
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'animator-effects',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '700px'
        }, {
            line: 2,
            nbLines: 1,
            width: '100%'
        }, {
            line: 3,
            nbLines: 6,
            width: '100%'
        }, {
            line: 9,
            nbLines: 3,
            width: '100%'
        }]
    });

    // Animator Invoke
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'animator-invoke',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 1,
            nbLines: 2,
            width: '100%'
        }, {
            line: 1,
            nbLines: 3,
            width: '100%'
        }, {
            line: 1,
            nbLines: 5,
            width: '100%'
        }]
    });

    // Layout Api
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'layout-api',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 2,
            nbLines: 3,
            width: '100%'
        }, {
            line: 5,
            nbLines: 3,
            width: '100%'
        }, {
            line: 8,
            nbLines: 3,
            width: '100%'
        }]
    });

    // Layout Intrinsic calc
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'layout-intrinsic',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 2,
            nbLines: 3,
            width: '100%'
        }, {
            line: 5,
            nbLines: 6,
            width: '100%'
        }, {
            line: 11,
            nbLines: 1,
            width: '100%'
        }]
    });

    // Layout position fragments
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'layout-position',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 2,
            nbLines: 3,
            width: '100%'
        }, {
            line: 5,
            nbLines: 1,
            width: '100%'
        }, {
            line: 6,
            nbLines: 5,
            width: '100%'
        }, {
            line: 11,
            nbLines: 1,
            width: '100%'
        }]
    });

    // Parser Api
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'parser-api',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 1,
            width: '100%'
        }, {
            line: 1,
            nbLines: 2,
            width: '100%'
        }, {
            line: 4,
            nbLines: 4,
            width: '100%'
        }, {
            line: 4,
            nbLines: 7,
            width: '100%'
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

var AnimationHeader = exports.AnimationHeader = function () {
	function AnimationHeader() {
		_classCallCheck(this, AnimationHeader);

		this.init();
	}

	_createClass(AnimationHeader, [{
		key: 'init',
		value: async function init() {
			['--avatar-size', '--header-height', '--font-base', '--bar-height', '--avatar-border'].forEach(function (name) {
				CSS.registerProperty({
					name: name,
					syntax: '<length>',
					initialValue: '0px',
					inherits: true
				});
			});

			await animationWorklet.addModule('./scripts/houdini/animator-header.js');

			var sizes = document.querySelector('#demoAnimationWorklet').computedStyleMap();
			var scrollSource = document.querySelector('#demoAnimationWorklet');
			var avatar = document.querySelector('#demoAnimationWorklet .avatar');
			var bar = document.querySelector('#demoAnimationWorklet .bar');
			var maxTime = 1000;
			var epsilon = 1e-2;
			var scrollTimeline = new ScrollTimeline({
				scrollSource: scrollSource,
				orientation: 'block',
				timeRange: maxTime
			});
			// console.log(avatarScrollEndPos, avatarScrollEndOffset);
			// console.log(scrollSize);
			var avatarEffect = new KeyframeEffect(avatar, [{ transform: 'translateY(0px) scale(1)', easing: 'ease-in-out', offset: 0 }, { transform: 'translateY(0px) scale(' + 0 /*avatarTargetScale*/ + ')', easing: 'linear', offset: 0 /*avatarScrollEndOffset*/ }, { transform: 'translateY(' + 0 /*avatarTargetTranslate*/ + 'px) scale(' + 0 /*avatarTargetScale*/ + ')', offset: 1 }], {
				duration: maxTime + epsilon,
				fill: 'both',
				iterations: Infinity
			});

			new WorkletAnimation('animator-header', [avatarEffect], scrollTimeline, {}).play();

			var barEffect = new KeyframeEffect(bar, [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0 /*avatarScrollEndOffset*/ }, { opacity: 1, offset: 1 }], {
				duration: maxTime + epsilon,
				fill: 'both',
				iterations: Infinity
				/* crbug(779189): Use infinity iteration and maxDuration to avoid effect
    	prematurely finishing.
    		BTW, Web Animations uses an endpoint-exclusive timing model, which mean
    	when timeline is at "duration" time, it is considered to be at 0 time of the
    	second iteration. To avoid this, we ensure our max time (max scroll offset) never
    	reaches duration by having duration an epsilon larger.  This hack is not
    	needed once we fix the original bug above.
      */
			});
			new WorkletAnimation('animator-header', [barEffect], scrollTimeline, {}).play();

			function update() {
				var clientHeight = scrollSource.clientHeight;
				var scrollHeight = scrollSource.scrollHeight;
				var maxScroll = scrollHeight - clientHeight;
				console.log(clientHeight, scrollHeight, maxScroll);
				var avatarTargetScale = sizes.get('--bar-height').value / (sizes.get('--avatar-size').value + 2 * sizes.get('--avatar-border').value);
				var avatarScrollEndPos = sizes.get('--header-height').value / 2 - sizes.get('--avatar-size').value / 2 - sizes.get('--avatar-border').value;
				var avatarTargetTranslate = maxScroll - avatarScrollEndPos;
				// Stop scaling at this offset and start transform.
				var avatarScrollEndOffset = avatarScrollEndPos / maxScroll;

				var aekf = avatarEffect.getKeyframes();
				aekf[1].transform = 'translateY(0px) scale(' + avatarTargetScale + ')';
				aekf[1].offset = avatarScrollEndOffset;
				aekf[2].transform = 'translateY(' + avatarTargetTranslate + 'px) scale(' + avatarTargetScale + ')';
				avatarEffect.setKeyframes(aekf);

				var bekf = barEffect.getKeyframes();
				bekf[1].offset = avatarScrollEndOffset;
				barEffect.setKeyframes(bekf);
			}
			update();
			window.addEventListener('resize', function (_) {
				return update();
			});

			/* crbug(824782): delay is not working as expected in worklet, instead here we combine
      what would have been a delayed animation with the other avatar animation but start
      it at a different offset.
   	  new WorkletAnimation('twitter-header',
   	[
   	  new KeyframeEffect(avatar, [
   		{transform: `translateY(0px)`},
   		{transform: `translateY(${scrollHeight - clientHeight}px)`},
   	  ], {
   		delay: avatarScrollEndPos/scrollHeight * maxTime,
   		duration: (scrollHeight - clientHeight)/scrollHeight * maxTime,
   		fill: 'both',
   	  }),
   	],
   	scrollTimeline,
   	{}
     )//.play();
   */
		}
	}]);

	return AnimationHeader;
}();

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
            inherits: false,
            initialValue: 'white'
        });
        (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/cadre-worklet.js');
        new _noise.Noise();
        new _anim.Animations();
        // new TypeText();
        new _highlightEvent.HighlightEvents();
        if (!inIframe) {
            new _demos.Demos();
        } else {
            // document.getElementById('magicVideo').style.display = 'none';
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./animations/anim.js":1,"./demos.js":2,"./highlightEvent.js":6,"./houdini/noise.js":8}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7SUFDYSxVLFdBQUEsVTtBQUNaLHVCQUFjO0FBQUE7O0FBQ2IsT0FBSyxjQUFMOztBQUVBLE9BQUssZUFBTDtBQUNBOzs7O21DQUVnQjtBQUNoQixPQUFJLGdCQUFnQixDQUFwQjtBQUNBLE9BQU0sZ0JBQWdCLENBQXRCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxjQUFjLENBQXBCO0FBQ0EsT0FBTSxhQUFhLENBQW5COztBQUVBLFlBQVMsaUJBQVQsR0FBNEI7QUFDM0I7QUFDQSxZQUFPLGFBQVA7QUFDQyxVQUFLLGFBQUw7QUFBb0I7QUFDbkIsZ0JBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxDQUErQyxHQUEvQyxDQUFtRCxNQUFuRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBcEMsQ0FBOEMsR0FBOUMsQ0FBa0QsTUFBbEQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxTQUExQyxDQUFvRCxHQUFwRCxDQUF3RCxNQUF4RDtBQUNBO0FBQ0E7QUFDRCxVQUFLLFlBQUw7QUFBbUI7QUFDbEIsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FB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QW5DLENBQTZDLG9DQUE3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYO0FBQ0gsU0FGRCxNQUVLO0FBQ0Q7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQTlCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiJ3VzZSBzdHJpY3QnXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9ucyB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX2Jyb3dzZXJFbmdpbmUoKTtcblxuXHRcdHRoaXMuX2FuaW1hdGVIb3VkaW5pKCk7XG5cdH1cblxuXHRfYnJvd3NlckVuZ2luZSgpIHtcblx0XHRsZXQgc3RlcEFuaW1hdGlvbiA9IDA7XG5cdFx0Y29uc3QgU1RFUF9ET1dOTE9BRCA9IDE7XG5cdFx0Y29uc3QgU1RFUF9QUk9DRVNTID0gMjtcblx0XHRjb25zdCBTVEVQX0JST1dTRVIgPSAzO1xuXHRcdGNvbnN0IFNURVBfTEFZT1VUID0gNDtcblx0XHRjb25zdCBTVEVQX1BBSU5UID0gNTtcblxuXHRcdGZ1bmN0aW9uIGZyYWdtZW50QW5pbWF0aW9uKCl7XG5cdFx0XHRzdGVwQW5pbWF0aW9uKys7XG5cdFx0XHRzd2l0Y2goc3RlcEFuaW1hdGlvbil7XG5cdFx0XHRcdGNhc2UoU1RFUF9ET1dOTE9BRCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LmFkZCgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5hZGQoJ2h0bWwnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlKFNURVBfUFJPQ0VTUyk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNsb3VkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9CUk9XU0VSKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXInKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9MQVlPVVQpOntcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9QQUlOVCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItbGF5b3V0Jyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFpbnQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLXBhaW50Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYnJvd3Nlci1lbmdpbmUnLCAoKT0+e1xuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XG5cdFx0XHRzdGVwQW5pbWF0aW9uID0gMDtcblxuXHRcdFx0ZnVuY3Rpb24gY2xlYXJBbmltKCl7XG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnJhZ21lbnRBbmltYXRpb24pO1xuXHRcdFx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtZG93bmxvYWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhaW50JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLXBhaW50Jyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdH1cblxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xuXHRcdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcblx0XHRcdH0sMTAwKTtcblx0XHR9KTtcblxuXHR9XG5cblx0X2FuaW1hdGVIb3VkaW5pKCl7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGUtaG91ZGluaS13b3JrZmxvdycsICgpID0+IHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMScpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbEJhY2tGcmFnbWVudCgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgY2FsbEJhY2tGcmFnbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXHR9XG59IiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHtcbiAgICBBcHBseUNzc1xufSBmcm9tICcuL2hlbHBlci9hcHBseUNzcy5qcyc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q29kZU1pcm9yXG59IGZyb20gJy4vaGVscGVyL2FwcGx5SnMuanMnO1xuaW1wb3J0IHtBbmltYXRpb25IZWFkZXJ9IGZyb20gJy4vaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzJ1xuXG5leHBvcnQgY2xhc3MgRGVtb3Mge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9UeXBlT00oKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9QYWludEFwaSgpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1Byb3BlcnRpZXNBbmRWYWx1ZXMoKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRGVtb0xvYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25EZW1vU3RhdGUnLCAoKSA9PntcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uRGVtb0xvYWQpe1xuICAgICAgICAgICAgICAgICAgICBuZXcgQW5pbWF0aW9uSGVhZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMubGF5b3V0RGVtb0xvYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9MYXlvdXRBcGkoKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2RlbW9UeXBlT00oKSB7XG4gICAgICAgIGlmICghd2luZG93LkNTU1RyYW5zZm9ybVZhbHVlKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSAvL25ldyBDU1NUcmFuc2Zvcm1WYWx1ZShbXG4gICAgICAgICAgICBuZXcgQ1NTUm90YXRlKDAsMCwxLCBDU1MuZGVnKDApKVxuICAgICAgICAvL10pO1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlRGVtbycpO1xuICAgICAgICBzcXVhcmUuYXR0cmlidXRlU3R5bGVNYXAuc2V0KCd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pO1xuICAgICAgICBsZXQgcmFmSWQ7XG4gICAgICAgIGxldCBzdG9wQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICAgIGZ1bmN0aW9uIGRyYXcoKXtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5hbmdsZS52YWx1ZSA9ICh0cmFuc2Zvcm0uYW5nbGUudmFsdWUgKyA1KSAlIDM2MDtcbiAgICAgICAgICAgIHNxdWFyZS5hdHRyaWJ1dGVTdHlsZU1hcC5zZXQoJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgICAgICAgfVxuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IGRyYXcoKSk7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpKTtcbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhcigpIHtcbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcycpLFxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudCBoMntcbiAgICAtLWEtc3VwZXItdmFyOiAjRkZGO1xufVxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XG5cbn1cbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xuXG59YFxuICAgICAgICApO1xuICAgIH1cblxuXG4gICAgX2ZyYW1lSW5jcmVtZW50KCl7XG4gICAgICAgIGlmICh0aGlzLmZyYW1lID09PSA5KSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9pc2UnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1mcmFtZScsIHRoaXMuZnJhbWUpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZnJhbWVJbmNyZW1lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX2RlbW9Qcm9wZXJ0aWVzQW5kVmFsdWVzKCkge1xuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XG4gICAgICAgICAgICBuYW1lOiAnLS1wcm9wZXJ0aWVzLW1vdmUtcmVnaXN0ZXInLFxuICAgICAgICAgICAgc3ludGF4OiAnPGxlbmd0aD4nLFxuICAgICAgICAgICAgaW5oZXJpdHM6IGZhbHNlLFxuICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiAnMHB4JyxcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG4tc3F1YXJlLXByb3BlcnRpZXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QuYWRkKCdtb3ZlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnRuLXNxdWFyZS1uby1wcm9wZXJ0aWVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1uby1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LnJlbW92ZSgnbW92ZScpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1uby1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LmFkZCgnbW92ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVtb1BhaW50QXBpKCkge1xuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLXdvcmtsZXQuanMnKTtcblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGktY3NzJyksXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50LXBhaW50LWFwaSB7XG4gICAgLS1jaXJjbGUtY29sb3I6ICNGRkY7XG4gICAgLS13aWR0aC1jaXJjbGU6IDEwMHB4O1xuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSwgMHB4LCByZWQpO1xufWBcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpJyksXG4gICAgICAgICAgICAnamF2YXNjcmlwdCcsXG4gICAgICAgICAgICBgcGFpbnQoY3R4LCBnZW9tLCBwcm9wZXJ0aWVzLCBhcmdzKSB7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1cy5cbiAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1pbihnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyKTtcbiAgICBjb25zdCBib3JkZXIgPSBhcmdzWzBdLnZhbHVlO1xuICAgIC8vIENoYW5nZSB0aGUgYm9yZGVyIGNvbG9yLlxuICAgIGN0eC5maWxsU3R5bGUgPSBhcmdzWzFdLnRvU3RyaW5nKCk7XG4gICAgY3R4LmFyYyhnZW9tLndpZHRoIC0gYm9yZGVyIC8gMiwgZ2VvbS5oZWlnaHQgLSAgLSBib3JkZXIgLyAyLCByYWRpdXMgLSBib3JkZXIsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAvLyBDaGFuZ2UgdGhlIGZpbGwgY29sb3IuXG4gICAgY29uc3QgY29sb3IgPSBwcm9wZXJ0aWVzLmdldCgnLS1jaXJjbGUtY29sb3InKS50b1N0cmluZygpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguYXJjKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIsIHJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xufWApO1xuICAgIH1cblxuICAgIF9kZW1vTGF5b3V0QXBpKCl7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNkZW1vTGF5b3V0V29ya2xldCBkaXYnKS5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdCA9IGVsZW0udGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAvLyBDdXQgb3V0IGEgcmFuZG9tIGFtb3VudCBvZiB0ZXh0LCBidXQga2VlcCBhdCBsZWFzdCAxMCBjaGFyYWN0ZXJzXG4gICAgICAgICAgICBlbGVtLnRleHRDb250ZW50ID0gdC5zbGljZSgwLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodC5sZW5ndGggLSAxMCkgKyAxMCkpO1xuICAgICAgICB9KVxuICAgICAgICBDU1MubGF5b3V0V29ya2xldC5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL21hc29ucnktd29ya2xldC5qcycpO1xuXG4gICAgICAgIGxldCBjb2xzID0gMztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5QnRuTWludXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBjb2xzID0gTWF0aC5tYXgoMywgY29scyAtIDEpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5Q29scycpLmlubmVySFRNTCA9IGNvbHM7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0xheW91dFdvcmtsZXQnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1tYXNvbnJ5LWNvbHVtbnMnLCBjb2xzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTWFzb25yeUJ0blBsdXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBjb2xzID0gTWF0aC5taW4oOCwgY29scyArIDEpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5Q29scycpLmlubmVySFRNTCA9IGNvbHM7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0xheW91dFdvcmtsZXQnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1tYXNvbnJ5LWNvbHVtbnMnLCBjb2xzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59IiwiJ3VzZSBzdGljdCdcblxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCkge1xuICAgICAgICBjb25zdCBjb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAncGFyYWlzby1kYXJrJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICB0aGlzLnN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcblxuICAgICAgICBjb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xuICAgICAgICBjb2RlTWlycm9yQ3NzLm9uKCdjaGFuZ2UnLCAoLi4ub2JqKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFwcGx5Q3NzKGNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFwcGx5Q3NzKGluaXRpYWxDb250ZW50KTtcbiAgICB9XG5cbiAgICBhcHBseUNzcyh2YWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubmJFbHRzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcbiAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXG4gICAgICAgICAgICAuZm9yRWFjaChzZWxlY3RvckNzcyA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yQ3NzICsgJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYkVsdHMrKztcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG59IiwiJ3VzZSBzdGljdCdcblxuZXhwb3J0IGNsYXNzIEFwcGx5Q29kZU1pcm9yIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbHQsIG1vZGUsIGluaXRpYWxDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvZGVNaXJyb3JKUyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxuICAgICAgICAgICAgdGhlbWU6ICdwYXJhaXNvLWRhcmsnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcbiAgICB9XG5cbn0iLCIndXNlIHN0cmljdCdcblxuY29uc3QgTUlOX1RPUCA9ICcxMDBweCc7XG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE0ZW0nO1xuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBrZXlFbHQsXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcbiAgICB9KSB7XG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQubGluZUhlaWdodCA9IExJTkVfSEVJR0hUO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcbiAgICAgICAgICAgIHR5cGU6IFwiaW5pdFwiLFxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcbiAgICAgICAgfSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcblxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vICBUWXBlZCBPTSBOZXcgUG9zc2liaWxpdGllc1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLW5ldycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDExLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgVHlwZWQgT00gTmV3IEFwaVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLWFwaScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDQsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBUeXBlZCBPTSBOZXcgY2FsY1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLWNhbGMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIGxlZnQ6ICc3NjBweCcsIC8vIGxpbnV4IDogODAwcHggLyB3aW5kb3dzIDogNzYwcHhcbiAgICAgICAgICAgICAgICB3aWR0aDogJzM1MHB4J1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIGxlZnQ6JzYxMHB4JywgLy8gbGludXggOiA2MzBweCAvIHdpbmRvd3MgOiAgNjEwcHhcbiAgICAgICAgICAgICAgICB3aWR0aDogJzMwMHB4J1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIGxlZnQ6JzYxMHB4JywgLy8gbGludXggOiA2MzBweCAvIHdpbmRvd3MgOiA2MTBweFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMzAwcHgnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc1MDBweCdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIFR5cGVkIE9NIE9wZXJhdGlvbnNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS1vcGVyYXRpb25zJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIFR5cGVkIE9NIENvbnZlcnNpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS1jb252ZXJzaW9uJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBUeXBlZCBPTSBUcmFuc2Zvcm1cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS10cmFuc2Zvcm0nLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ1NTIEN1c3RvbSBQcm9wZXJ0aWVzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy1wcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ1NTIFByb3BlcnRpZXMgJiBWYWx1ZXMgVHlwZXNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncHJvcGVydGllc3ZhbHVlcy10eXBlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDcsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBhaW50IEFwaVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwYWludC1hcGknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDYsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFuaW1hdG9yIERlY2xhcmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2FuaW1hdG9yLWRlY2xhcmF0aW9uJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8gQW5pbWF0b3IgVGltZUxpbmUgJiBSZWdpc3RlclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdhbmltYXRvci10aW1lbGluZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3BNYXJnaW46ICcxMTVweCcsXG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3BNYXJnaW46ICcxMTVweCcsXG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFuaW1hdG9yIEVmZmVjdHNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnYW5pbWF0b3ItZWZmZWN0cycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc3MDBweCdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFuaW1hdG9yIEludm9rZVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdhbmltYXRvci1pbnZva2UnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExheW91dCBBcGlcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnbGF5b3V0LWFwaScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTGF5b3V0IEludHJpbnNpYyBjYWxjXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2xheW91dC1pbnRyaW5zaWMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMYXlvdXQgcG9zaXRpb24gZnJhZ21lbnRzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2xheW91dC1wb3NpdGlvbicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUGFyc2VyIEFwaVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwYXJzZXItYXBpJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDQsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuXG5cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkhlYWRlcntcblxuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRbJy0tYXZhdGFyLXNpemUnLCAnLS1oZWFkZXItaGVpZ2h0JywgJy0tZm9udC1iYXNlJywgJy0tYmFyLWhlaWdodCcsICctLWF2YXRhci1ib3JkZXInXVxuXHRcdCAgLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XG5cdFx0XHQgIG5hbWUsXG5cdFx0XHQgIHN5bnRheDogJzxsZW5ndGg+Jyxcblx0XHRcdCAgaW5pdGlhbFZhbHVlOiAnMHB4Jyxcblx0XHRcdCAgaW5oZXJpdHM6IHRydWVcblx0XHRcdH0pO1xuXHRcdCAgfSk7XG5cblx0XHRhd2FpdCBhbmltYXRpb25Xb3JrbGV0LmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvYW5pbWF0b3ItaGVhZGVyLmpzJyk7XG5cblx0XHRjb25zdCBzaXplcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCcpLmNvbXB1dGVkU3R5bGVNYXAoKTtcblx0XHRjb25zdCBzY3JvbGxTb3VyY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQnKTtcblx0XHRjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQgLmF2YXRhcicpO1xuXHRcdGNvbnN0IGJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCAuYmFyJyk7XG5cdFx0Y29uc3QgbWF4VGltZSA9IDEwMDA7XG5cdFx0Y29uc3QgZXBzaWxvbiA9IDFlLTI7XG5cdFx0Y29uc3Qgc2Nyb2xsVGltZWxpbmUgPSBuZXcgU2Nyb2xsVGltZWxpbmUoe1xuXHRcdCAgc2Nyb2xsU291cmNlLFxuXHRcdCAgb3JpZW50YXRpb246ICdibG9jaycsXG5cdFx0ICB0aW1lUmFuZ2U6IG1heFRpbWUsXG5cdFx0fSk7XG5cdFx0Ly8gY29uc29sZS5sb2coYXZhdGFyU2Nyb2xsRW5kUG9zLCBhdmF0YXJTY3JvbGxFbmRPZmZzZXQpO1xuXHRcdC8vIGNvbnNvbGUubG9nKHNjcm9sbFNpemUpO1xuXHRcdGNvbnN0IGF2YXRhckVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdChhdmF0YXIsIFtcblx0XHQgIHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoMSlgLCBlYXNpbmc6ICdlYXNlLWluLW91dCcsIG9mZnNldDogMH0sXG5cdFx0ICB7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgwcHgpIHNjYWxlKCR7MC8qYXZhdGFyVGFyZ2V0U2NhbGUqL30pYCwgZWFzaW5nOiAnbGluZWFyJywgb2Zmc2V0OiAwIC8qYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0Ki99LFxuXHRcdCAge3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoJHswLyphdmF0YXJUYXJnZXRUcmFuc2xhdGUqL31weCkgc2NhbGUoJHswLyphdmF0YXJUYXJnZXRTY2FsZSovfSlgLCBvZmZzZXQ6IDF9LFxuXHRcdF0sIHtcblx0XHQgIGR1cmF0aW9uOiBtYXhUaW1lICsgZXBzaWxvbixcblx0XHQgIGZpbGw6ICdib3RoJyxcblx0XHQgIGl0ZXJhdGlvbnM6IEluZmluaXR5LFxuXHRcdH0pO1xuXG5cdFx0bmV3IFdvcmtsZXRBbmltYXRpb24oJ2FuaW1hdG9yLWhlYWRlcicsXG5cdFx0ICBbYXZhdGFyRWZmZWN0XSxcblx0XHQgIHNjcm9sbFRpbWVsaW5lLFxuXHRcdCAge31cblx0XHQpLnBsYXkoKTtcblxuXHRcdGNvbnN0IGJhckVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdChcblx0XHQgIGJhcixcblx0XHQgIFtcblx0XHRcdHtvcGFjaXR5OiAwLCBvZmZzZXQ6IDB9LFxuXHRcdFx0e29wYWNpdHk6IDEsIG9mZnNldDogMCAvKmF2YXRhclNjcm9sbEVuZE9mZnNldCovfSxcblx0XHRcdHtvcGFjaXR5OiAxLCBvZmZzZXQ6IDF9XG5cdFx0ICBdLFxuXHRcdCAge1xuXHRcdFx0ZHVyYXRpb246IG1heFRpbWUgKyBlcHNpbG9uLFxuXHRcdFx0ZmlsbDogJ2JvdGgnLFxuXHRcdFx0aXRlcmF0aW9uczogSW5maW5pdHksXG5cdFx0XHQvKiBjcmJ1Zyg3NzkxODkpOiBVc2UgaW5maW5pdHkgaXRlcmF0aW9uIGFuZCBtYXhEdXJhdGlvbiB0byBhdm9pZCBlZmZlY3Rcblx0XHRcdFx0cHJlbWF0dXJlbHkgZmluaXNoaW5nLlxuXG5cdFx0XHRcdEJUVywgV2ViIEFuaW1hdGlvbnMgdXNlcyBhbiBlbmRwb2ludC1leGNsdXNpdmUgdGltaW5nIG1vZGVsLCB3aGljaCBtZWFuXG5cdFx0XHRcdHdoZW4gdGltZWxpbmUgaXMgYXQgXCJkdXJhdGlvblwiIHRpbWUsIGl0IGlzIGNvbnNpZGVyZWQgdG8gYmUgYXQgMCB0aW1lIG9mIHRoZVxuXHRcdFx0XHRzZWNvbmQgaXRlcmF0aW9uLiBUbyBhdm9pZCB0aGlzLCB3ZSBlbnN1cmUgb3VyIG1heCB0aW1lIChtYXggc2Nyb2xsIG9mZnNldCkgbmV2ZXJcblx0XHRcdFx0cmVhY2hlcyBkdXJhdGlvbiBieSBoYXZpbmcgZHVyYXRpb24gYW4gZXBzaWxvbiBsYXJnZXIuICBUaGlzIGhhY2sgaXMgbm90XG5cdFx0XHRcdG5lZWRlZCBvbmNlIHdlIGZpeCB0aGUgb3JpZ2luYWwgYnVnIGFib3ZlLlxuXHRcdFx0ICAqL1xuXHRcdCAgfVxuXHRcdCk7XG5cdFx0bmV3IFdvcmtsZXRBbmltYXRpb24oJ2FuaW1hdG9yLWhlYWRlcicsXG5cdFx0ICBbYmFyRWZmZWN0XSxcblx0XHQgIHNjcm9sbFRpbWVsaW5lLFxuXHRcdCAge31cblx0XHQpLnBsYXkoKTtcblxuXHRcdGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblx0XHQgIGNvbnN0IGNsaWVudEhlaWdodCA9IHNjcm9sbFNvdXJjZS5jbGllbnRIZWlnaHQ7XG5cdFx0ICBjb25zdCBzY3JvbGxIZWlnaHQgPSBzY3JvbGxTb3VyY2Uuc2Nyb2xsSGVpZ2h0O1xuXHRcdCAgY29uc3QgbWF4U2Nyb2xsID0gc2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0O1xuXHRcdCAgY29uc29sZS5sb2coY2xpZW50SGVpZ2h0LCBzY3JvbGxIZWlnaHQsIG1heFNjcm9sbCk7XG5cdFx0ICBjb25zdCBhdmF0YXJUYXJnZXRTY2FsZSA9IHNpemVzLmdldCgnLS1iYXItaGVpZ2h0JykudmFsdWUgLyAoc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUgKyAyICogc2l6ZXMuZ2V0KCctLWF2YXRhci1ib3JkZXInKS52YWx1ZSk7XG5cdFx0ICBjb25zdCBhdmF0YXJTY3JvbGxFbmRQb3MgPSAoc2l6ZXMuZ2V0KCctLWhlYWRlci1oZWlnaHQnKS52YWx1ZS8yIC0gc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUvMiAtIHNpemVzLmdldCgnLS1hdmF0YXItYm9yZGVyJykudmFsdWUpO1xuXHRcdCAgY29uc3QgYXZhdGFyVGFyZ2V0VHJhbnNsYXRlID0gbWF4U2Nyb2xsIC0gYXZhdGFyU2Nyb2xsRW5kUG9zO1xuXHRcdCAgLy8gU3RvcCBzY2FsaW5nIGF0IHRoaXMgb2Zmc2V0IGFuZCBzdGFydCB0cmFuc2Zvcm0uXG5cdFx0ICBjb25zdCBhdmF0YXJTY3JvbGxFbmRPZmZzZXQgPSBhdmF0YXJTY3JvbGxFbmRQb3MgLyBtYXhTY3JvbGw7XG5cblx0XHQgIGNvbnN0IGFla2YgPSBhdmF0YXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XG5cdFx0ICBhZWtmWzFdLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoJHthdmF0YXJUYXJnZXRTY2FsZX0pYDtcblx0XHQgIGFla2ZbMV0ub2Zmc2V0ID0gYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0O1xuXHRcdCAgYWVrZlsyXS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke2F2YXRhclRhcmdldFRyYW5zbGF0ZX1weCkgc2NhbGUoJHthdmF0YXJUYXJnZXRTY2FsZX0pYDtcblx0XHQgIGF2YXRhckVmZmVjdC5zZXRLZXlmcmFtZXMoYWVrZik7XG5cblx0XHQgIGNvbnN0IGJla2YgPSBiYXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XG5cdFx0ICBiZWtmWzFdLm9mZnNldCA9IGF2YXRhclNjcm9sbEVuZE9mZnNldDtcblx0XHQgIGJhckVmZmVjdC5zZXRLZXlmcmFtZXMoYmVrZik7XG5cdFx0fVxuXHRcdHVwZGF0ZSgpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfID0+IHVwZGF0ZSgpKTtcblxuXHRcdC8qIGNyYnVnKDgyNDc4Mik6IGRlbGF5IGlzIG5vdCB3b3JraW5nIGFzIGV4cGVjdGVkIGluIHdvcmtsZXQsIGluc3RlYWQgaGVyZSB3ZSBjb21iaW5lXG5cdFx0ICAgd2hhdCB3b3VsZCBoYXZlIGJlZW4gYSBkZWxheWVkIGFuaW1hdGlvbiB3aXRoIHRoZSBvdGhlciBhdmF0YXIgYW5pbWF0aW9uIGJ1dCBzdGFydFxuXHRcdCAgIGl0IGF0IGEgZGlmZmVyZW50IG9mZnNldC5cblxuXHRcdCAgbmV3IFdvcmtsZXRBbmltYXRpb24oJ3R3aXR0ZXItaGVhZGVyJyxcblx0XHRcdFtcblx0XHRcdCAgbmV3IEtleWZyYW1lRWZmZWN0KGF2YXRhciwgW1xuXHRcdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgwcHgpYH0sXG5cdFx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7c2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0fXB4KWB9LFxuXHRcdFx0ICBdLCB7XG5cdFx0XHRcdGRlbGF5OiBhdmF0YXJTY3JvbGxFbmRQb3Mvc2Nyb2xsSGVpZ2h0ICogbWF4VGltZSxcblx0XHRcdFx0ZHVyYXRpb246IChzY3JvbGxIZWlnaHQgLSBjbGllbnRIZWlnaHQpL3Njcm9sbEhlaWdodCAqIG1heFRpbWUsXG5cdFx0XHRcdGZpbGw6ICdib3RoJyxcblx0XHRcdCAgfSksXG5cdFx0XHRdLFxuXHRcdFx0c2Nyb2xsVGltZWxpbmUsXG5cdFx0XHR7fVxuXHRcdCAgKS8vLnBsYXkoKTtcblx0XHQqL1xuXHR9XG5cbn1cblxuIiwiZXhwb3J0IGNsYXNzIE5vaXNlIHtcblx0Y29uc3RydWN0b3IoKXtcblx0XHR0aGlzLmNhbnZhcztcblx0XHR0aGlzLmN0eDtcblx0XHR0aGlzLndXaWR0aDtcblx0XHR0aGlzLndIZWlnaHQ7XG5cdFx0dGhpcy5ub2lzZURhdGEgPSBbXTtcblx0XHR0aGlzLmZyYW1lID0gMDtcblx0XHR0aGlzLmxvb3BUaW1lb3V0O1xuXG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblxuXHQvLyBDcmVhdGUgTm9pc2VcbiAgICBjcmVhdGVOb2lzZSgpIHtcbiAgICAgICAgY29uc3QgaWRhdGEgPSB0aGlzLmN0eC5jcmVhdGVJbWFnZURhdGEodGhpcy53V2lkdGgsIHRoaXMud0hlaWdodCk7XG4gICAgICAgIGNvbnN0IGJ1ZmZlcjMyID0gbmV3IFVpbnQzMkFycmF5KGlkYXRhLmRhdGEuYnVmZmVyKTtcbiAgICAgICAgY29uc3QgbGVuID0gYnVmZmVyMzIubGVuZ3RoO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyMzJbaV0gPSAweGZmMDAwMDAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub2lzZURhdGEucHVzaChpZGF0YSk7XG4gICAgfTtcblxuXG4gICAgLy8gUGxheSBOb2lzZVxuICAgIHBhaW50Tm9pc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyYW1lID09PSA5KSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0aGlzLm5vaXNlRGF0YVt0aGlzLmZyYW1lXSwgMCwgMCk7XG4gICAgfTtcblxuXG4gICAgLy8gTG9vcFxuICAgIGxvb3AoKSB7XG4gICAgICAgIHRoaXMucGFpbnROb2lzZSh0aGlzLmZyYW1lKTtcblxuICAgICAgICB0aGlzLmxvb3BUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gICAgICAgIH0sICgxMDAwIC8gMjUpKTtcbiAgICB9O1xuXG5cbiAgICAvLyBTZXR1cFxuICAgIHNldHVwKCkge1xuICAgICAgICB0aGlzLndXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLndIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndXaWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy53SGVpZ2h0O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVOb2lzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb29wKCk7XG4gICAgfTtcblxuXG4gICAgLy8gSW5pdFxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaXNlJyk7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICB0aGlzLnNldHVwKCk7XG4gICAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gaW1wb3J0IHsgTWFza0hpZ2hsaWdodGVyIH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL21hc2staGlnaGxpZ2h0ZXIvbWFzay1oaWdobGlnaHRlci5qcyc7XG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodEV2ZW50c1xufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50LmpzJztcbmltcG9ydCB7XG4gICAgRGVtb3Ncbn0gZnJvbSAnLi9kZW1vcy5qcyc7XG5pbXBvcnQge05vaXNlfSBmcm9tICcuL2hvdWRpbmkvbm9pc2UuanMnO1xuaW1wb3J0IHtBbmltYXRpb25zfSBmcm9tICcuL2FuaW1hdGlvbnMvYW5pbS5qcyc7XG5cblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cblxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XG4gICAgICAgICAgICBuYW1lOiAnLS1jYWRyZS1jb2xvcicsXG4gICAgICAgICAgICBzeW50YXg6ICc8Y29sb3I+IHwgbm9uZScsXG4gICAgICAgICAgICBpbmhlcml0czogZmFsc2UsXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICd3aGl0ZScsXG4gICAgICAgIH0pO1xuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2FkcmUtd29ya2xldC5qcycpO1xuICAgICAgICBuZXcgTm9pc2UoKTtcbiAgICAgICAgbmV3IEFuaW1hdGlvbnMoKTtcbiAgICAgICAgLy8gbmV3IFR5cGVUZXh0KCk7XG4gICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hZ2ljVmlkZW8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyJdfQ==
