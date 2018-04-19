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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7SUFDYSxVLFdBQUEsVTtBQUNaLHVCQUFjO0FBQUE7O0FBQ2IsT0FBSyxjQUFMOztBQUVBLE9BQUssZUFBTDtBQUNBOzs7O21DQUVnQjtBQUNoQixPQUFJLGdCQUFnQixDQUFwQjtBQUNBLE9BQU0sZ0JBQWdCLENBQXRCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxjQUFjLENBQXBCO0FBQ0EsT0FBTSxhQUFhLENBQW5COztBQUVBLFlBQVMsaUJBQVQsR0FBNEI7QUFDM0I7QUFDQSxZQUFPLGFBQVA7QUFDQyxVQUFLLGFBQUw7QUFBb0I7QUFDbkIsZ0JBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxDQUErQyxHQUEvQyxDQUFtRCxNQUFuRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBcEMsQ0FBOEMsR0FBOUMsQ0FBa0QsTUFBbEQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxTQUExQyxDQUFvRCxHQUFwRCxDQUF3RCxNQUF4RDtBQUNBO0FBQ0E7QUFDRCxVQUFLLFlBQUw7QUFBbUI7QUFDbEIsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FB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Q0E7QUFDQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1g7QUFDSCxTQUZELE1BRUs7QUFDRDtBQUNIO0FBRUo7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBN0JEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIndXNlIHN0cmljdCdcclxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbnMge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5fYnJvd3NlckVuZ2luZSgpO1xyXG5cclxuXHRcdHRoaXMuX2FuaW1hdGVIb3VkaW5pKCk7XHJcblx0fVxyXG5cclxuXHRfYnJvd3NlckVuZ2luZSgpIHtcclxuXHRcdGxldCBzdGVwQW5pbWF0aW9uID0gMDtcclxuXHRcdGNvbnN0IFNURVBfRE9XTkxPQUQgPSAxO1xyXG5cdFx0Y29uc3QgU1RFUF9QUk9DRVNTID0gMjtcclxuXHRcdGNvbnN0IFNURVBfQlJPV1NFUiA9IDM7XHJcblx0XHRjb25zdCBTVEVQX0xBWU9VVCA9IDQ7XHJcblx0XHRjb25zdCBTVEVQX1BBSU5UID0gNTtcclxuXHJcblx0XHRmdW5jdGlvbiBmcmFnbWVudEFuaW1hdGlvbigpe1xyXG5cdFx0XHRzdGVwQW5pbWF0aW9uKys7XHJcblx0XHRcdHN3aXRjaChzdGVwQW5pbWF0aW9uKXtcclxuXHRcdFx0XHRjYXNlKFNURVBfRE9XTkxPQUQpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtZG93bmxvYWQnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX1BST0NFU1MpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX0JST1dTRVIpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3NlcicpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX0xBWU9VVCk6e1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX1BBSU5UKTp7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYWludCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1wYWludCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1wYWludCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Jyb3dzZXItZW5naW5lJywgKCk9PntcclxuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XHJcblx0XHRcdHN0ZXBBbmltYXRpb24gPSAwO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2xlYXJBbmltKCl7XHJcblx0XHRcdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XHJcblx0XHRcdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIGNsZWFyQW5pbSk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhaW50JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLXBhaW50Jyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1wYWludCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIGNsZWFyQW5pbSk7XHJcblx0XHRcdH0sMTAwKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdF9hbmltYXRlSG91ZGluaSgpe1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0ZS1ob3VkaW5pLXdvcmtmbG93JywgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMScpLnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgY2FsbEJhY2tGcmFnbWVudCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsQmFja0ZyYWdtZW50KCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHtcclxuICAgIEFwcGx5Q3NzXHJcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgQXBwbHlDb2RlTWlyb3JcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUpzLmpzJztcclxuaW1wb3J0IHtBbmltYXRpb25IZWFkZXJ9IGZyb20gJy4vaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIERlbW9zIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZGVtb1R5cGVPTSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFpbnRBcGkoKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUHJvcGVydGllc0FuZFZhbHVlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkRlbW9Mb2FkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25EZW1vU3RhdGUnLCAoKSA9PntcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb25EZW1vTG9hZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEFuaW1hdGlvbkhlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLmxheW91dERlbW9Mb2FkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9MYXlvdXRBcGkoKTtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9UeXBlT00oKSB7XHJcbiAgICAgICAgaWYgKCF3aW5kb3cuQ1NTVHJhbnNmb3JtVmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IC8vbmV3IENTU1RyYW5zZm9ybVZhbHVlKFtcclxuICAgICAgICAgICAgbmV3IENTU1JvdGF0ZSgwLDAsMSwgQ1NTLmRlZygwKSlcclxuICAgICAgICAvL10pO1xyXG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmVEZW1vJyk7XHJcbiAgICAgICAgc3F1YXJlLmF0dHJpYnV0ZVN0eWxlTWFwLnNldCgndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcclxuICAgICAgICBsZXQgcmFmSWQ7XHJcbiAgICAgICAgbGV0IHN0b3BBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICBmdW5jdGlvbiBkcmF3KCl7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybS5hbmdsZS52YWx1ZSA9ICh0cmFuc2Zvcm0uYW5nbGUudmFsdWUgKyA1KSAlIDM2MDtcclxuICAgICAgICAgICAgc3F1YXJlLmF0dHJpYnV0ZVN0eWxlTWFwLnNldCgndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4gZHJhdygpKTtcclxuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9Dc3NWYXIoKSB7XHJcbiAgICAgICAgLyoqICovXHJcbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcclxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudCBoMntcclxuICAgIC0tYS1zdXBlci12YXI6ICNGRkY7XHJcbn1cclxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XHJcblxyXG59XHJcbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xyXG5cclxufWBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBfZnJhbWVJbmNyZW1lbnQoKXtcclxuICAgICAgICBpZiAodGhpcy5mcmFtZSA9PT0gOSkge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpLnN0eWxlLnNldFByb3BlcnR5KCctLWZyYW1lJywgdGhpcy5mcmFtZSk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2ZyYW1lSW5jcmVtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vUHJvcGVydGllc0FuZFZhbHVlcygpIHtcclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLXByb3BlcnRpZXMtbW92ZS1yZWdpc3RlcicsXHJcbiAgICAgICAgICAgIHN5bnRheDogJzxsZW5ndGg+JyxcclxuICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiAnMHB4JyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnRuLXNxdWFyZS1wcm9wZXJ0aWVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtcHJvcGVydGllcycpLmNsYXNzTGlzdC5hZGQoJ21vdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnRuLXNxdWFyZS1uby1wcm9wZXJ0aWVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtbm8tcHJvcGVydGllcycpLmNsYXNzTGlzdC5hZGQoJ21vdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb1BhaW50QXBpKCkge1xyXG4gICAgICAgIChDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9jaXJjbGUtd29ya2xldC5qcycpO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDc3MoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhaW50LWFwaS1jc3MnKSxcclxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudC1wYWludC1hcGkge1xyXG4gICAgLS1jaXJjbGUtY29sb3I6ICNGRkY7XHJcbiAgICAtLXdpZHRoLWNpcmNsZTogMTAwcHg7XHJcbiAgICB3aWR0aDogdmFyKC0td2lkdGgtY2lyY2xlKTtcclxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSwgMHB4LCByZWQpO1xyXG59YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGknKSxcclxuICAgICAgICAgICAgJ2phdmFzY3JpcHQnLFxyXG4gICAgICAgICAgICBgcGFpbnQoY3R4LCBnZW9tLCBwcm9wZXJ0aWVzLCBhcmdzKSB7XHJcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNlbnRlciBwb2ludCBhbmQgcmFkaXVzLlxyXG4gICAgY29uc3QgcmFkaXVzID0gTWF0aC5taW4oZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMik7XHJcbiAgICBjb25zdCBib3JkZXIgPSBhcmdzWzBdLnZhbHVlO1xyXG4gICAgLy8gQ2hhbmdlIHRoZSBib3JkZXIgY29sb3IuXHJcbiAgICBjdHguZmlsbFN0eWxlID0gYXJnc1sxXS50b1N0cmluZygpO1xyXG4gICAgY3R4LmFyYyhnZW9tLndpZHRoIC0gYm9yZGVyIC8gMiwgZ2VvbS5oZWlnaHQgLSAgLSBib3JkZXIgLyAyLCByYWRpdXMgLSBib3JkZXIsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgIC8vIENoYW5nZSB0aGUgZmlsbCBjb2xvci5cclxuICAgIGNvbnN0IGNvbG9yID0gcHJvcGVydGllcy5nZXQoJy0tY2lyY2xlLWNvbG9yJykudG9TdHJpbmcoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIGN0eC5hcmMoZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMiwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbn1gKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb0xheW91dEFwaSgpe1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNkZW1vTGF5b3V0V29ya2xldCBkaXYnKS5mb3JFYWNoKGVsZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gZWxlbS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgLy8gQ3V0IG91dCBhIHJhbmRvbSBhbW91bnQgb2YgdGV4dCwgYnV0IGtlZXAgYXQgbGVhc3QgMTAgY2hhcmFjdGVyc1xyXG4gICAgICAgICAgICBlbGVtLnRleHRDb250ZW50ID0gdC5zbGljZSgwLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodC5sZW5ndGggLSAxMCkgKyAxMCkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgQ1NTLmxheW91dFdvcmtsZXQuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9tYXNvbnJ5LXdvcmtsZXQuanMnKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbHMgPSAzO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTWFzb25yeUJ0bk1pbnVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG4gICAgICAgICAgICBjb2xzID0gTWF0aC5tYXgoMywgY29scyAtIDEpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlDb2xzJykuaW5uZXJIVE1MID0gY29scztcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9MYXlvdXRXb3JrbGV0Jykuc3R5bGUuc2V0UHJvcGVydHkoJy0tbWFzb25yeS1jb2x1bW5zJywgY29scyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5QnRuUGx1cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuICAgICAgICAgICAgY29scyA9IE1hdGgubWluKDgsIGNvbHMgKyAxKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5Q29scycpLmlubmVySFRNTCA9IGNvbHM7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTGF5b3V0V29ya2xldCcpLnN0eWxlLnNldFByb3BlcnR5KCctLW1hc29ucnktY29sdW1ucycsIGNvbHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcclxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXHJcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxyXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAncGFyYWlzby1kYXJrJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyhjb2RlTWlycm9yQ3NzLmdldFZhbHVlKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdGljdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBseUNvZGVNaXJvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9ySlMgPSBDb2RlTWlycm9yKGVsdCwge1xyXG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXHJcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcclxuICAgICAgICAgICAgdGhlbWU6ICdwYXJhaXNvLWRhcmsnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xyXG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE0ZW0nO1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xyXG5jb25zdCBDT0xfV0lEVEggPSAzNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtcclxuICAgICAgICBrZXlFbHQsXHJcbiAgICAgICAgcG9zaXRpb25BcnJheVxyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XHJcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmxpbmVIZWlnaHQgPSBMSU5FX0hFSUdIVDtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xyXG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcclxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcclxuICAgICAgICB9KTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICBUWXBlZCBPTSBOZXcgUG9zc2liaWxpdGllc1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS1uZXcnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcclxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDExLFxyXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgVHlwZWQgT00gTmV3IEFwaVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS1hcGknLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTAsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgVHlwZWQgT00gTmV3IGNhbGNcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3R5cGVkb20tY2FsYycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc3NjBweCcsIC8vIGxpbnV4IDogODAwcHggLyB3aW5kb3dzIDogNzYwcHhcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMzUwcHgnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6JzYxMHB4JywgLy8gbGludXggOiA2MzBweCAvIHdpbmRvd3MgOiAgNjEwcHhcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMzAwcHgnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6JzYxMHB4JywgLy8gbGludXggOiA2MzBweCAvIHdpbmRvd3MgOiA2MTBweFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICczMDBweCdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDgsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc1MDBweCdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBUeXBlZCBPTSBPcGVyYXRpb25zXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLW9wZXJhdGlvbnMnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFR5cGVkIE9NIENvbnZlcnNpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3R5cGVkb20tY29udmVyc2lvbicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOCxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBUeXBlZCBPTSBUcmFuc2Zvcm1cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3R5cGVkb20tdHJhbnNmb3JtJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQ1NTIEN1c3RvbSBQcm9wZXJ0aWVzXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtcHJvcGVydGllcycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDksXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBDU1MgUHJvcGVydGllcyAmIFZhbHVlcyBUeXBlc1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncHJvcGVydGllc3ZhbHVlcy10eXBlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUGFpbnQgQXBpXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwYWludC1hcGknLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOCxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQW5pbWF0b3IgRGVjbGFyYXRpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2FuaW1hdG9yLWRlY2xhcmF0aW9uJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIEFuaW1hdG9yIFRpbWVMaW5lICYgUmVnaXN0ZXJcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2FuaW1hdG9yLXRpbWVsaW5lJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIHRvcE1hcmdpbjogJzExNXB4JyxcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3BNYXJnaW46ICcxMTVweCcsXHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQW5pbWF0b3IgRWZmZWN0c1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnYW5pbWF0b3ItZWZmZWN0cycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNzAwcHgnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFuaW1hdG9yIEludm9rZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnYW5pbWF0b3ItaW52b2tlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBMYXlvdXQgQXBpXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdsYXlvdXQtYXBpJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDgsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBMYXlvdXQgSW50cmluc2ljIGNhbGNcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2xheW91dC1pbnRyaW5zaWMnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBMYXlvdXQgcG9zaXRpb24gZnJhZ21lbnRzXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdsYXlvdXQtcG9zaXRpb24nLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUGFyc2VyIEFwaVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncGFyc2VyLWFwaScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBBbmltYXRpb25IZWFkZXJ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGluaXQoKSB7XHJcblx0XHRbJy0tYXZhdGFyLXNpemUnLCAnLS1oZWFkZXItaGVpZ2h0JywgJy0tZm9udC1iYXNlJywgJy0tYmFyLWhlaWdodCcsICctLWF2YXRhci1ib3JkZXInXVxyXG5cdFx0ICAuZm9yRWFjaChuYW1lID0+IHtcclxuXHRcdFx0Q1NTLnJlZ2lzdGVyUHJvcGVydHkoe1xyXG5cdFx0XHQgIG5hbWUsXHJcblx0XHRcdCAgc3ludGF4OiAnPGxlbmd0aD4nLFxyXG5cdFx0XHQgIGluaXRpYWxWYWx1ZTogJzBweCcsXHJcblx0XHRcdCAgaW5oZXJpdHM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHQgIH0pO1xyXG5cclxuXHRcdGF3YWl0IGFuaW1hdGlvbldvcmtsZXQuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9hbmltYXRvci1oZWFkZXIuanMnKTtcclxuXHJcblx0XHRjb25zdCBzaXplcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCcpLmNvbXB1dGVkU3R5bGVNYXAoKTtcclxuXHRcdGNvbnN0IHNjcm9sbFNvdXJjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCcpO1xyXG5cdFx0Y29uc3QgYXZhdGFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0IC5hdmF0YXInKTtcclxuXHRcdGNvbnN0IGJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCAuYmFyJyk7XHJcblx0XHRjb25zdCBtYXhUaW1lID0gMTAwMDtcclxuXHRcdGNvbnN0IGVwc2lsb24gPSAxZS0yO1xyXG5cdFx0Y29uc3Qgc2Nyb2xsVGltZWxpbmUgPSBuZXcgU2Nyb2xsVGltZWxpbmUoe1xyXG5cdFx0ICBzY3JvbGxTb3VyY2UsXHJcblx0XHQgIG9yaWVudGF0aW9uOiAnYmxvY2snLFxyXG5cdFx0ICB0aW1lUmFuZ2U6IG1heFRpbWUsXHJcblx0XHR9KTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKGF2YXRhclNjcm9sbEVuZFBvcywgYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0KTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKHNjcm9sbFNpemUpO1xyXG5cdFx0Y29uc3QgYXZhdGFyRWZmZWN0ID0gbmV3IEtleWZyYW1lRWZmZWN0KGF2YXRhciwgW1xyXG5cdFx0ICB7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgwcHgpIHNjYWxlKDEpYCwgZWFzaW5nOiAnZWFzZS1pbi1vdXQnLCBvZmZzZXQ6IDB9LFxyXG5cdFx0ICB7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgwcHgpIHNjYWxlKCR7MC8qYXZhdGFyVGFyZ2V0U2NhbGUqL30pYCwgZWFzaW5nOiAnbGluZWFyJywgb2Zmc2V0OiAwIC8qYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0Ki99LFxyXG5cdFx0ICB7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgkezAvKmF2YXRhclRhcmdldFRyYW5zbGF0ZSovfXB4KSBzY2FsZSgkezAvKmF2YXRhclRhcmdldFNjYWxlKi99KWAsIG9mZnNldDogMX0sXHJcblx0XHRdLCB7XHJcblx0XHQgIGR1cmF0aW9uOiBtYXhUaW1lICsgZXBzaWxvbixcclxuXHRcdCAgZmlsbDogJ2JvdGgnLFxyXG5cdFx0ICBpdGVyYXRpb25zOiBJbmZpbml0eSxcclxuXHRcdH0pO1xyXG5cclxuXHRcdG5ldyBXb3JrbGV0QW5pbWF0aW9uKCdhbmltYXRvci1oZWFkZXInLFxyXG5cdFx0ICBbYXZhdGFyRWZmZWN0XSxcclxuXHRcdCAgc2Nyb2xsVGltZWxpbmUsXHJcblx0XHQgIHt9XHJcblx0XHQpLnBsYXkoKTtcclxuXHJcblx0XHRjb25zdCBiYXJFZmZlY3QgPSBuZXcgS2V5ZnJhbWVFZmZlY3QoXHJcblx0XHQgIGJhcixcclxuXHRcdCAgW1xyXG5cdFx0XHR7b3BhY2l0eTogMCwgb2Zmc2V0OiAwfSxcclxuXHRcdFx0e29wYWNpdHk6IDEsIG9mZnNldDogMCAvKmF2YXRhclNjcm9sbEVuZE9mZnNldCovfSxcclxuXHRcdFx0e29wYWNpdHk6IDEsIG9mZnNldDogMX1cclxuXHRcdCAgXSxcclxuXHRcdCAge1xyXG5cdFx0XHRkdXJhdGlvbjogbWF4VGltZSArIGVwc2lsb24sXHJcblx0XHRcdGZpbGw6ICdib3RoJyxcclxuXHRcdFx0aXRlcmF0aW9uczogSW5maW5pdHksXHJcblx0XHRcdC8qIGNyYnVnKDc3OTE4OSk6IFVzZSBpbmZpbml0eSBpdGVyYXRpb24gYW5kIG1heER1cmF0aW9uIHRvIGF2b2lkIGVmZmVjdFxyXG5cdFx0XHRcdHByZW1hdHVyZWx5IGZpbmlzaGluZy5cclxuXHJcblx0XHRcdFx0QlRXLCBXZWIgQW5pbWF0aW9ucyB1c2VzIGFuIGVuZHBvaW50LWV4Y2x1c2l2ZSB0aW1pbmcgbW9kZWwsIHdoaWNoIG1lYW5cclxuXHRcdFx0XHR3aGVuIHRpbWVsaW5lIGlzIGF0IFwiZHVyYXRpb25cIiB0aW1lLCBpdCBpcyBjb25zaWRlcmVkIHRvIGJlIGF0IDAgdGltZSBvZiB0aGVcclxuXHRcdFx0XHRzZWNvbmQgaXRlcmF0aW9uLiBUbyBhdm9pZCB0aGlzLCB3ZSBlbnN1cmUgb3VyIG1heCB0aW1lIChtYXggc2Nyb2xsIG9mZnNldCkgbmV2ZXJcclxuXHRcdFx0XHRyZWFjaGVzIGR1cmF0aW9uIGJ5IGhhdmluZyBkdXJhdGlvbiBhbiBlcHNpbG9uIGxhcmdlci4gIFRoaXMgaGFjayBpcyBub3RcclxuXHRcdFx0XHRuZWVkZWQgb25jZSB3ZSBmaXggdGhlIG9yaWdpbmFsIGJ1ZyBhYm92ZS5cclxuXHRcdFx0ICAqL1xyXG5cdFx0ICB9XHJcblx0XHQpO1xyXG5cdFx0bmV3IFdvcmtsZXRBbmltYXRpb24oJ2FuaW1hdG9yLWhlYWRlcicsXHJcblx0XHQgIFtiYXJFZmZlY3RdLFxyXG5cdFx0ICBzY3JvbGxUaW1lbGluZSxcclxuXHRcdCAge31cclxuXHRcdCkucGxheSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuXHRcdCAgY29uc3QgY2xpZW50SGVpZ2h0ID0gc2Nyb2xsU291cmNlLmNsaWVudEhlaWdodDtcclxuXHRcdCAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gc2Nyb2xsU291cmNlLnNjcm9sbEhlaWdodDtcclxuXHRcdCAgY29uc3QgbWF4U2Nyb2xsID0gc2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0O1xyXG5cdFx0ICBjb25zb2xlLmxvZyhjbGllbnRIZWlnaHQsIHNjcm9sbEhlaWdodCwgbWF4U2Nyb2xsKTtcclxuXHRcdCAgY29uc3QgYXZhdGFyVGFyZ2V0U2NhbGUgPSBzaXplcy5nZXQoJy0tYmFyLWhlaWdodCcpLnZhbHVlIC8gKHNpemVzLmdldCgnLS1hdmF0YXItc2l6ZScpLnZhbHVlICsgMiAqIHNpemVzLmdldCgnLS1hdmF0YXItYm9yZGVyJykudmFsdWUpO1xyXG5cdFx0ICBjb25zdCBhdmF0YXJTY3JvbGxFbmRQb3MgPSAoc2l6ZXMuZ2V0KCctLWhlYWRlci1oZWlnaHQnKS52YWx1ZS8yIC0gc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUvMiAtIHNpemVzLmdldCgnLS1hdmF0YXItYm9yZGVyJykudmFsdWUpO1xyXG5cdFx0ICBjb25zdCBhdmF0YXJUYXJnZXRUcmFuc2xhdGUgPSBtYXhTY3JvbGwgLSBhdmF0YXJTY3JvbGxFbmRQb3M7XHJcblx0XHQgIC8vIFN0b3Agc2NhbGluZyBhdCB0aGlzIG9mZnNldCBhbmQgc3RhcnQgdHJhbnNmb3JtLlxyXG5cdFx0ICBjb25zdCBhdmF0YXJTY3JvbGxFbmRPZmZzZXQgPSBhdmF0YXJTY3JvbGxFbmRQb3MgLyBtYXhTY3JvbGw7XHJcblxyXG5cdFx0ICBjb25zdCBhZWtmID0gYXZhdGFyRWZmZWN0LmdldEtleWZyYW1lcygpO1xyXG5cdFx0ICBhZWtmWzFdLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoJHthdmF0YXJUYXJnZXRTY2FsZX0pYDtcclxuXHRcdCAgYWVrZlsxXS5vZmZzZXQgPSBhdmF0YXJTY3JvbGxFbmRPZmZzZXQ7XHJcblx0XHQgIGFla2ZbMl0udHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHthdmF0YXJUYXJnZXRUcmFuc2xhdGV9cHgpIHNjYWxlKCR7YXZhdGFyVGFyZ2V0U2NhbGV9KWA7XHJcblx0XHQgIGF2YXRhckVmZmVjdC5zZXRLZXlmcmFtZXMoYWVrZik7XHJcblxyXG5cdFx0ICBjb25zdCBiZWtmID0gYmFyRWZmZWN0LmdldEtleWZyYW1lcygpO1xyXG5cdFx0ICBiZWtmWzFdLm9mZnNldCA9IGF2YXRhclNjcm9sbEVuZE9mZnNldDtcclxuXHRcdCAgYmFyRWZmZWN0LnNldEtleWZyYW1lcyhiZWtmKTtcclxuXHRcdH1cclxuXHRcdHVwZGF0ZSgpO1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF8gPT4gdXBkYXRlKCkpO1xyXG5cclxuXHRcdC8qIGNyYnVnKDgyNDc4Mik6IGRlbGF5IGlzIG5vdCB3b3JraW5nIGFzIGV4cGVjdGVkIGluIHdvcmtsZXQsIGluc3RlYWQgaGVyZSB3ZSBjb21iaW5lXHJcblx0XHQgICB3aGF0IHdvdWxkIGhhdmUgYmVlbiBhIGRlbGF5ZWQgYW5pbWF0aW9uIHdpdGggdGhlIG90aGVyIGF2YXRhciBhbmltYXRpb24gYnV0IHN0YXJ0XHJcblx0XHQgICBpdCBhdCBhIGRpZmZlcmVudCBvZmZzZXQuXHJcblxyXG5cdFx0ICBuZXcgV29ya2xldEFuaW1hdGlvbigndHdpdHRlci1oZWFkZXInLFxyXG5cdFx0XHRbXHJcblx0XHRcdCAgbmV3IEtleWZyYW1lRWZmZWN0KGF2YXRhciwgW1xyXG5cdFx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweClgfSxcclxuXHRcdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3Njcm9sbEhlaWdodCAtIGNsaWVudEhlaWdodH1weClgfSxcclxuXHRcdFx0ICBdLCB7XHJcblx0XHRcdFx0ZGVsYXk6IGF2YXRhclNjcm9sbEVuZFBvcy9zY3JvbGxIZWlnaHQgKiBtYXhUaW1lLFxyXG5cdFx0XHRcdGR1cmF0aW9uOiAoc2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0KS9zY3JvbGxIZWlnaHQgKiBtYXhUaW1lLFxyXG5cdFx0XHRcdGZpbGw6ICdib3RoJyxcclxuXHRcdFx0ICB9KSxcclxuXHRcdFx0XSxcclxuXHRcdFx0c2Nyb2xsVGltZWxpbmUsXHJcblx0XHRcdHt9XHJcblx0XHQgICkvLy5wbGF5KCk7XHJcblx0XHQqL1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbiIsImV4cG9ydCBjbGFzcyBOb2lzZSB7XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMuY2FudmFzO1xyXG5cdFx0dGhpcy5jdHg7XHJcblx0XHR0aGlzLndXaWR0aDtcclxuXHRcdHRoaXMud0hlaWdodDtcclxuXHRcdHRoaXMubm9pc2VEYXRhID0gW107XHJcblx0XHR0aGlzLmZyYW1lID0gMDtcclxuXHRcdHRoaXMubG9vcFRpbWVvdXQ7XHJcblxyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fVxyXG5cclxuXHQvLyBDcmVhdGUgTm9pc2VcclxuICAgIGNyZWF0ZU5vaXNlKCkge1xyXG4gICAgICAgIGNvbnN0IGlkYXRhID0gdGhpcy5jdHguY3JlYXRlSW1hZ2VEYXRhKHRoaXMud1dpZHRoLCB0aGlzLndIZWlnaHQpO1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlcjMyID0gbmV3IFVpbnQzMkFycmF5KGlkYXRhLmRhdGEuYnVmZmVyKTtcclxuICAgICAgICBjb25zdCBsZW4gPSBidWZmZXIzMi5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjUpIHtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcjMyW2ldID0gMHhmZjAwMDAwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ub2lzZURhdGEucHVzaChpZGF0YSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBQbGF5IE5vaXNlXHJcbiAgICBwYWludE5vaXNlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZyYW1lID09PSA5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0aGlzLm5vaXNlRGF0YVt0aGlzLmZyYW1lXSwgMCwgMCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBMb29wXHJcbiAgICBsb29wKCkge1xyXG4gICAgICAgIHRoaXMucGFpbnROb2lzZSh0aGlzLmZyYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb29wVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfSwgKDEwMDAgLyAyNSkpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gU2V0dXBcclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIHRoaXMud1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgdGhpcy53SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud1dpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMud0hlaWdodDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTm9pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gSW5pdFxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cCgpO1xyXG4gICAgfTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBpbXBvcnQgeyBNYXNrSGlnaGxpZ2h0ZXIgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbWFzay1oaWdobGlnaHRlci9tYXNrLWhpZ2hsaWdodGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodEV2ZW50c1xyXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgRGVtb3NcclxufSBmcm9tICcuL2RlbW9zLmpzJztcclxuaW1wb3J0IHtOb2lzZX0gZnJvbSAnLi9ob3VkaW5pL25vaXNlLmpzJztcclxuaW1wb3J0IHtBbmltYXRpb25zfSBmcm9tICcuL2FuaW1hdGlvbnMvYW5pbS5qcyc7XHJcblxyXG5cclxuXHJcbihhc3luYyBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG5cclxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XHJcblxyXG5cclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLWNhZHJlLWNvbG9yJyxcclxuICAgICAgICAgICAgc3ludGF4OiAnPGNvbG9yPiB8IG5vbmUnLFxyXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICd3aGl0ZScsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NhZHJlLXdvcmtsZXQuanMnKTtcclxuICAgICAgICBuZXcgTm9pc2UoKTtcclxuICAgICAgICBuZXcgQW5pbWF0aW9ucygpO1xyXG4gICAgICAgIC8vIG5ldyBUeXBlVGV4dCgpO1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcclxuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XHJcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyJdfQ==
