(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

		this._workletSteps();
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
	}, {
		key: '_workletSteps',
		value: function _workletSteps() {
			var stepAnimation = 0;
			var STEP_ADD = 1;
			var STEP_ADD_WORKKET = 2;
			var STEP_LOAD = 3;
			var STEP_RENDER = 4;
			var STEP_CALL = 5;
			var STEP_EXECUTE = 6;

			function fragmentAnimation() {
				stepAnimation++;
				switch (stepAnimation) {
					case STEP_ADD:
						{
							document.querySelector('#worklet-diagram .worklet-step-1').classList.add('show');
							break;
						}
					case STEP_ADD_WORKKET:
						{
							document.querySelector('#worklet-diagram .worklet-step-2').classList.add('show');
							break;
						}
					case STEP_LOAD:
						{
							document.querySelector('#worklet-diagram .worklet-step-3').classList.add('show');
							break;
						}
					case STEP_RENDER:
						{
							document.querySelector('#worklet-diagram .worklet-step-4').classList.add('show');
							break;
						}
					case STEP_CALL:
						{
							document.querySelector('#worklet-diagram .worklet-step-5').classList.add('show');
							break;
						}
					case STEP_EXECUTE:
						{
							document.querySelector('#worklet-diagram .worklet-step-6').classList.add('show');
							break;
						}

				}
			}

			Reveal.addEventListener('worklet-steps', function () {
				Reveal.addEventListener('fragmentshown', fragmentAnimation);
				stepAnimation = 0;

				function clearAnim() {
					Reveal.removeEventListener('fragmentshown', fragmentAnimation);
					Reveal.removeEventListener('slidechanged', clearAnim);
					document.querySelector('#worklet-diagram .worklet-step-1').classList.remove('show');
					document.querySelector('#worklet-diagram .worklet-step-2').classList.remove('show');
					document.querySelector('#worklet-diagram .worklet-step-3').classList.remove('show');
					document.querySelector('#worklet-diagram .worklet-step-4').classList.remove('show');
					document.querySelector('#worklet-diagram .worklet-step-5').classList.remove('show');
					document.querySelector('#worklet-diagram .worklet-step-6').classList.remove('show');
				}

				setTimeout(function () {
					Reveal.addEventListener('slidechanged', clearAnim);
				}, 100);
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
            if (!'paintWorklet' in CSS) {
                return;
            }

            (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-worklet.js');

            new _applyCss.ApplyCss(document.getElementById('codemirror-paint-api-css'), '#render-element-paint-api {\n    --circle-color: black;\n    --width-circle: 100px;\n    width: var(--width-circle);\n    background-image: paint(circle, 0px, red);\n}\n.reveal section.parent-demo-paint.cadre{\n    --cadre-color:black;\n}');

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
			var _this = this;

			['--avatar-size', '--header-height', '--font-base', '--bar-height', '--avatar-border'].forEach(function (name) {
				CSS.registerProperty({
					name: name,
					syntax: '<length>',
					initialValue: '0px',
					inherits: true
				});
			});
			var animationWorklet = window.animationWorklet;
			if (CSS) animationWorklet = CSS.animationWorklet;

			this.sizes = document.querySelector('#demoAnimationWorklet').computedStyleMap();
			this.scrollSource = document.querySelector('#demoAnimationWorklet');
			this.avatar = document.querySelector('#demoAnimationWorklet .avatar');
			this.bar = document.querySelector('#demoAnimationWorklet .bar');
			this.maxTime = 1000;
			this.epsilon = 1e-2;
			this.scrollTimeline = new ScrollTimeline({
				scrollSource: this.scrollSource,
				orientation: 'block',
				timeRange: this.maxTime
			});
			try {

				await animationWorklet.addModule('./scripts/houdini/animator-header.js');

				this.initAvatarEffect();
				this.initBarEffect();
				this.update();
				window.addEventListener('resize', function (_) {
					return _this.update();
				});
			} catch (e) {
				console.log('Will Use Polyfill :\'(');
			}

			/* crbug(824782): delay is not working as expected in worklet, instead here we combine
      what would have been a delayed animation with the other avatar animation but start
      it at a different offset.
   */
			new WorkletAnimation('twitter-header', [new KeyframeEffect(avatar, [{ transform: 'translateY(0px)' }, { transform: 'translateY(' + (scrollHeight - clientHeight) + 'px)' }], {
				delay: avatarScrollEndPos / scrollHeight * maxTime,
				duration: (scrollHeight - clientHeight) / scrollHeight * maxTime,
				fill: 'both'
			})], scrollTimeline, {}).play();
			/**/
		}
	}, {
		key: 'update',
		value: function update() {
			var clientHeight = this.scrollSource.clientHeight;
			var scrollHeight = this.scrollSource.scrollHeight;
			var maxScroll = scrollHeight - clientHeight;
			console.log(clientHeight, scrollHeight, maxScroll);
			var avatarTargetScale = this.sizes.get('--bar-height').value / (this.sizes.get('--avatar-size').value + 2 * this.sizes.get('--avatar-border').value);
			var avatarScrollEndPos = this.sizes.get('--header-height').value / 2 - this.sizes.get('--avatar-size').value / 2 - this.sizes.get('--avatar-border').value;
			var avatarTargetTranslate = maxScroll - avatarScrollEndPos;
			// Stop scaling at this offset and start transform.
			var avatarScrollEndOffset = avatarScrollEndPos / maxScroll;

			var aekf = this.avatarEffect.getKeyframes();
			aekf[1].transform = 'translateY(0px) scale(' + avatarTargetScale + ')';
			aekf[1].offset = avatarScrollEndOffset;
			aekf[2].transform = 'translateY(' + avatarTargetTranslate + 'px) scale(' + avatarTargetScale + ')';
			this.avatarEffect.setKeyframes(aekf);

			var bekf = this.barEffect.getKeyframes();
			bekf[1].offset = avatarScrollEndOffset;
			this.barEffect.setKeyframes(bekf);
		}
	}, {
		key: 'initAvatarEffect',
		value: function initAvatarEffect() {
			this.avatarEffect = new KeyframeEffect(this.avatar, [{ transform: 'translateY(0px) scale(1)', easing: 'ease-in-out', offset: 0 }, { transform: 'translateY(0px) scale(' + 0 /*avatarTargetScale*/ + ')', easing: 'linear', offset: 0 /*avatarScrollEndOffset*/ }, { transform: 'translateY(' + 0 /*avatarTargetTranslate*/ + 'px) scale(' + 0 /*avatarTargetScale*/ + ')', offset: 1 }], {
				duration: this.maxTime + this.epsilon,
				fill: 'both',
				iterations: Infinity
			});

			new WorkletAnimation('animator-header', this.avatarEffect, this.scrollTimeline, []).play();
		}
	}, {
		key: 'initBarEffect',
		value: function initBarEffect() {
			this.barEffect = new KeyframeEffect(this.bar, [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0 /*avatarScrollEndOffset*/ }, { opacity: 1, offset: 1 }], {
				duration: this.maxTime + this.epsilon,
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
			new WorkletAnimation('animator-header', this.barEffect, this.scrollTimeline, []).play();
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

        if ('paintWorklet' in CSS) {
            try {

                CSS.registerProperty({
                    name: '--cadre-color',
                    syntax: '<color> | none',
                    inherits: false,
                    initialValue: 'white'
                });
                (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/cadre-worklet.js');
            } catch (e) {
                console.warn('Error with cadre');
            }
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7SUFDYSxVLFdBQUEsVTtBQUNaLHVCQUFjO0FBQUE7O0FBQ2IsT0FBSyxjQUFMOztBQUVBLE9BQUssZUFBTDs7QUFFQSxPQUFLLGFBQUw7QUFDQTs7OzttQ0FFZ0I7QUFDaEIsT0FBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxPQUFNLGdCQUFnQixDQUF0QjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sY0FBYyxDQUFwQjtBQUNBLE9BQU0sYUFBYSxDQUFuQjs7QUFFQSxZQUFTLGlCQUFULEdBQTRCO0FBQzNCO0FBQ0EsWUFBTyxhQUFQO0FBQ0MsVUFBSyxhQUFMO0FBQW9CO0FBQ25CLGdCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBckMsQ0FBK0MsR0FBL0MsQ0FBbUQsTUFBbkQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLEdBQTlDLENBQWtELE1BQWxEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FBMUMsQ0FBb0QsR0FBcEQsQ0FBd0QsTUFBeEQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxZQUFMO0FBQW1CO0FBQ2xCLGdCQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDLFNBQTFDLENBQW9ELE1BQXBELENBQTJELE1BQTNEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxDQUErQyxNQUEvQyxDQUFzRCxNQUF0RDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBcEMsQ0FBOEMsTUFBOUMsQ0FBcUQsTUFBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGVBQXhCLEVBQXlDLFNBQXpDLENBQW1ELEdBQW5ELENBQXVELFNBQXZEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUFwQyxDQUE4QyxHQUE5QyxDQUFrRCxTQUFsRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsR0FBakQsQ0FBcUQsU0FBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQXZDLENBQWlELEdBQWpELENBQXFELFNBQXJEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsU0FBM0MsQ0FBcUQsR0FBckQsQ0FBeUQsU0FBekQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxZQUFMO0FBQW1CO0FBQ2xCLGdCQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsU0FBMUQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLE1BQTlDLENBQXFELFNBQXJEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxTQUF4RDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsTUFBakQsQ0FBd0QsU0FBeEQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGlCQUF4QixFQUEyQyxTQUEzQyxDQUFxRCxNQUFyRCxDQUE0RCxTQUE1RDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsR0FBakQsQ0FBcUQsUUFBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQXZDLENBQWlELEdBQWpELENBQXFELFFBQXJEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsU0FBM0MsQ0FBcUQsR0FBckQsQ0FBeUQsUUFBekQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxHQUF4RCxDQUE0RCxRQUE1RDtBQUNBO0FBQ0E7QUFDRCxVQUFLLFdBQUw7QUFBa0I7QUFDakIsZ0JBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsU0FBOUMsQ0FBd0QsTUFBeEQsQ0FBK0QsUUFBL0Q7QUFDQSxnQkFBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDLFNBQXhDLENBQWtELEdBQWxELENBQXNELGVBQXREO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsU0FBOUMsQ0FBd0QsR0FBeEQsQ0FBNEQsZUFBNUQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxVQUFMO0FBQWlCO0FBQ2hCLGdCQUFTLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0MsU0FBeEMsQ0FBa0QsTUFBbEQsQ0FBeUQsZUFBekQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxNQUF4RCxDQUErRCxlQUEvRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsR0FBakQsQ0FBcUQsY0FBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxHQUF4RCxDQUE0RCxjQUE1RDtBQUNBO0FBQ0E7QUExQ0Y7QUE0Q0E7O0FBRUQsVUFBTyxnQkFBUCxDQUF3QixnQkFBeEIsRUFBMEMsWUFBSTtBQUM3QyxXQUFPLGdCQUFQLENBQXdCLGVBQXhCLEVBQXlDLGlCQUF6QztBQUNBLG9CQUFnQixDQUFoQjs7QUFFQSxhQUFTLFNBQVQsR0FBb0I7QUFDbkIsWUFBTyxtQkFBUCxDQUEyQixlQUEzQixFQUE0QyxpQkFBNUM7QUFDQSxZQUFPLG1CQUFQLENBQTJCLGNBQTNCLEVBQTJDLFNBQTNDO0FBQ0EsY0FBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLFNBQXJDLENBQStDLE1BQS9DLENBQXNELE1BQXREO0FBQ0EsY0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLE1BQTlDLENBQXFELE1BQXJEO0FBQ0EsY0FBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxTQUExQyxDQUFvRCxNQUFwRCxDQUEyRCxNQUEzRDtBQUNBLGNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxTQUF4RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUFwQyxDQUE4QyxNQUE5QyxDQUFxRCxTQUFyRDtBQUNBLGNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxTQUF4RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsU0FBM0MsQ0FBcUQsTUFBckQsQ0FBNEQsU0FBNUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsU0FBMUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsU0FBMUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsTUFBakQsQ0FBd0QsUUFBeEQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDLFNBQTNDLENBQXFELE1BQXJELENBQTRELFFBQTVEO0FBQ0EsY0FBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxNQUF4RCxDQUErRCxRQUEvRDtBQUNBLGNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxRQUF4RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixjQUF4QixFQUF3QyxTQUF4QyxDQUFrRCxNQUFsRCxDQUF5RCxlQUF6RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsU0FBOUMsQ0FBd0QsTUFBeEQsQ0FBK0QsZUFBL0Q7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsTUFBakQsQ0FBd0QsY0FBeEQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLFNBQTlDLENBQXdELE1BQXhELENBQStELGNBQS9EO0FBQ0E7O0FBRUQsZUFBVyxZQUFJO0FBQ2QsWUFBTyxnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxTQUF4QztBQUNBLEtBRkQsRUFFRSxHQUZGO0FBR0EsSUE3QkQ7QUErQkE7OztvQ0FFZ0I7O0FBRVYsVUFBTyxnQkFBUCxDQUF3QiwwQkFBeEIsRUFBb0QsWUFBTTs7QUFFdEQsYUFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxLQUE5QyxDQUFvRCxPQUFwRCxHQUE4RCxFQUE5RDtBQUNBLGFBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsS0FBOUMsQ0FBb0QsT0FBcEQsR0FBOEQsTUFBOUQ7QUFDQSxXQUFPLGdCQUFQLENBQXdCLGVBQXhCLEVBQXlDLGdCQUF6Qzs7QUFFQSxhQUFTLGdCQUFULEdBQTRCO0FBQ3hCLGNBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsS0FBOUMsQ0FBb0QsT0FBcEQsR0FBOEQsTUFBOUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLEtBQTlDLENBQW9ELE9BQXBELEdBQThELEVBQTlEO0FBQ0EsWUFBTyxtQkFBUCxDQUEyQixlQUEzQixFQUE0QyxnQkFBNUM7QUFDSDtBQUNKLElBWEQ7QUFZTjs7O2tDQUVlO0FBQ2YsT0FBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxPQUFNLFdBQVcsQ0FBakI7QUFDQSxPQUFNLG1CQUFtQixDQUF6QjtBQUNBLE9BQU0sWUFBWSxDQUFsQjtBQUNBLE9BQU0sY0FBYyxDQUFwQjtBQUNBLE9BQU0sWUFBWSxDQUFsQjtBQUNBLE9BQU0sZUFBZSxDQUFyQjs7QUFFQSxZQUFTLGlCQUFULEdBQTRCO0FBQzNCO0FBQ0EsWUFBTyxhQUFQO0FBQ0MsVUFBSyxRQUFMO0FBQWU7QUFDZCxnQkFBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxHQUFyRSxDQUF5RSxNQUF6RTtBQUNBO0FBQ0E7QUFDRCxVQUFLLGdCQUFMO0FBQXVCO0FBQ3RCLGdCQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLEdBQXJFLENBQXlFLE1BQXpFO0FBQ0E7QUFDQTtBQUNELFVBQUssU0FBTDtBQUFnQjtBQUNmLGdCQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLEdBQXJFLENBQXlFLE1BQXpFO0FBQ0E7QUFDQTtBQUNELFVBQUssV0FBTDtBQUFrQjtBQUNqQixnQkFBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxHQUFyRSxDQUF5RSxNQUF6RTtBQUNBO0FBQ0E7QUFDRCxVQUFLLFNBQUw7QUFBZ0I7QUFDZixnQkFBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxHQUFyRSxDQUF5RSxNQUF6RTtBQUNBO0FBQ0E7QUFDRCxVQUFLLFlBQUw7QUFBbUI7QUFDbEIsZ0JBQVMsYUFBVCxDQUF1QixrQ0FBdkIsRUFBMkQsU0FBM0QsQ0FBcUUsR0FBckUsQ0FBeUUsTUFBekU7QUFDQTtBQUNBOztBQXhCRjtBQTJCQTs7QUFFRCxVQUFPLGdCQUFQLENBQXdCLGVBQXhCLEVBQXlDLFlBQUk7QUFDNUMsV0FBTyxnQkFBUCxDQUF3QixlQUF4QixFQUF5QyxpQkFBekM7QUFDQSxvQkFBZ0IsQ0FBaEI7O0FBRUEsYUFBUyxTQUFULEdBQW9CO0FBQ25CLFlBQU8sbUJBQVAsQ0FBMkIsZUFBM0IsRUFBNEMsaUJBQTVDO0FBQ0EsWUFBTyxtQkFBUCxDQUEyQixjQUEzQixFQUEyQyxTQUEzQztBQUNBLGNBQVMsYUFBVCxDQUF1QixrQ0FBdkIsRUFBMkQsU0FBM0QsQ0FBcUUsTUFBckUsQ0FBNEUsTUFBNUU7QUFDQSxjQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLE1BQXJFLENBQTRFLE1BQTVFO0FBQ0EsY0FBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxNQUFyRSxDQUE0RSxNQUE1RTtBQUNBLGNBQVMsYUFBVCxDQUF1QixrQ0FBdkIsRUFBMkQsU0FBM0QsQ0FBcUUsTUFBckUsQ0FBNEUsTUFBNUU7QUFDQSxjQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLE1BQXJFLENBQTRFLE1BQTVFO0FBQ0EsY0FBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxNQUFyRSxDQUE0RSxNQUE1RTtBQUVBOztBQUVELGVBQVcsWUFBSTtBQUNkLFlBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsU0FBeEM7QUFDQSxLQUZELEVBRUUsR0FGRjtBQUdBLElBbkJEO0FBcUJBOzs7Ozs7O0FDaExGOzs7Ozs7Ozs7QUFDQTs7QUFHQTs7QUFHQTs7OztJQUVhLEssV0FBQSxLO0FBRVQscUJBQWM7QUFBQTs7QUFBQTs7QUFDVixZQUFJOztBQUVBLGlCQUFLLFdBQUw7QUFDQSxpQkFBSyxhQUFMO0FBQ0EsaUJBQUssV0FBTDtBQUNBLGlCQUFLLHdCQUFMO0FBQ0EsaUJBQUssaUJBQUwsR0FBeUIsS0FBekI7QUFDQSxtQkFBTyxnQkFBUCxDQUF3QixvQkFBeEIsRUFBOEMsWUFBSztBQUMvQyxvQkFBSSxDQUFDLE1BQUssaUJBQVYsRUFBNEI7QUFDeEIsd0JBQUksZ0NBQUo7QUFDSDtBQUNKLGFBSkQ7QUFLQSxpQkFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsaUJBQUssY0FBTDtBQUNBLGlCQUFLLEtBQUwsR0FBYSxDQUFiO0FBRUgsU0FoQkQsQ0FnQkUsT0FBTyxLQUFQLEVBQWM7QUFDWixvQkFBUSxLQUFSLENBQWMsS0FBZDtBQUNIO0FBRUo7Ozs7c0NBRWE7QUFDVixnQkFBSSxDQUFDLE9BQU8saUJBQVosRUFBOEI7QUFDMUI7QUFDSDtBQUNELGdCQUFNLFlBQVk7QUFDZCxnQkFBSSxTQUFKLENBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQixDQUFsQixFQUFxQixJQUFJLEdBQUosQ0FBUSxDQUFSLENBQXJCLENBREo7QUFFQTtBQUNBLGdCQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLGFBQXZCLENBQWY7QUFDQSxtQkFBTyxpQkFBUCxDQUF5QixHQUF6QixDQUE2QixXQUE3QixFQUEwQyxTQUExQztBQUNBLGdCQUFJLGNBQUo7QUFDQSxnQkFBSSxnQkFBZ0IsS0FBcEI7QUFDQSxxQkFBUyxJQUFULEdBQWU7QUFDWCwwQkFBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLENBQUMsVUFBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLENBQXpCLElBQThCLEdBQXREO0FBQ0EsdUJBQU8saUJBQVAsQ0FBeUIsR0FBekIsQ0FBNkIsV0FBN0IsRUFBMEMsU0FBMUM7QUFDQSx3QkFBUSxzQkFBc0IsSUFBdEIsQ0FBUjtBQUNIO0FBQ0QsbUJBQU8sZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0M7QUFBQSx1QkFBTSxNQUFOO0FBQUEsYUFBdEM7QUFDQSxtQkFBTyxnQkFBUCxDQUF3QixZQUF4QixFQUFzQztBQUFBLHVCQUFNLHFCQUFxQixLQUFyQixDQUFOO0FBQUEsYUFBdEM7QUFDSDs7O3NDQUVhO0FBQ1Y7QUFDQSxnQkFBSSxrQkFBSixDQUNJLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FESjtBQVlIOzs7MENBR2dCO0FBQ2IsZ0JBQUksS0FBSyxLQUFMLEtBQWUsQ0FBbkIsRUFBc0I7QUFDbEIscUJBQUssS0FBTCxHQUFhLENBQWI7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSyxLQUFMO0FBQ0g7QUFDRCxxQkFBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLEtBQWpDLENBQXVDLFdBQXZDLENBQW1ELFNBQW5ELEVBQThELEtBQUssS0FBbkU7QUFDQSxrQ0FBc0IsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXRCO0FBQ0g7OzttREFFMEI7QUFDdkIsZ0JBQUksZ0JBQUosQ0FBcUI7QUFDakIsc0JBQU0sNEJBRFc7QUFFakIsd0JBQVEsVUFGUztBQUdqQiwwQkFBVSxLQUhPO0FBSWpCLDhCQUFjO0FBSkcsYUFBckI7QUFNQSxxQkFBUyxhQUFULENBQXVCLHdCQUF2QixFQUFpRCxnQkFBakQsQ0FBa0UsT0FBbEUsRUFBMkUsWUFBSTtBQUMzRSx5QkFBUyxhQUFULENBQXVCLG9CQUF2QixFQUE2QyxTQUE3QyxDQUF1RCxNQUF2RCxDQUE4RCxNQUE5RDtBQUNBLHlCQUFTLGFBQVQsQ0FBdUIsb0JBQXZCLEVBQTZDLFNBQTdDLENBQXVELEdBQXZELENBQTJELE1BQTNEO0FBQ0gsYUFIRDtBQUlBLHFCQUFTLGFBQVQsQ0FBdUIsMkJBQXZCLEVBQW9ELGdCQUFwRCxDQUFxRSxPQUFyRSxFQUE4RSxZQUFJO0FBQzlFLHlCQUFTLGFBQVQsQ0FBdUIsdUJBQXZCLEVBQWdELFNBQWhELENBQTBELE1BQTFELENBQWlFLE1BQWpFO0FBQ0EseUJBQVMsYUFBVCxDQUF1Qix1QkFBdkIsRUFBZ0QsU0FBaEQsQ0FBMEQsR0FBMUQsQ0FBOEQsTUFBOUQ7QUFDSCxhQUhEO0FBSUg7Ozt3Q0FFZTtBQUNaLGdCQUFJLENBQUMsY0FBRCxJQUFtQixHQUF2QixFQUEyQjtBQUN2QjtBQUNIOztBQUVELGFBQUMsSUFBSSxZQUFKLElBQW9CLFlBQXJCLEVBQW1DLFNBQW5DLENBQTZDLHFDQUE3Qzs7QUFFQSxnQkFBSSxrQkFBSixDQUNJLFNBQVMsY0FBVCxDQUF3QiwwQkFBeEIsQ0FESjs7QUFhQSxnQkFBSSx1QkFBSixDQUFtQixTQUFTLGNBQVQsQ0FBd0Isc0JBQXhCLENBQW5CLEVBQ0ksWUFESjtBQWNIOzs7eUNBRWU7QUFDWixxQkFBUyxnQkFBVCxDQUEwQix3QkFBMUIsRUFBb0QsT0FBcEQsQ0FBNEQsZ0JBQVE7QUFDaEUsb0JBQU0sSUFBSSxLQUFLLFdBQWY7QUFDQTtBQUNBLHFCQUFLLFdBQUwsR0FBbUIsRUFBRSxLQUFGLENBQVEsQ0FBUixFQUFXLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxNQUFpQixFQUFFLE1BQUYsR0FBVyxFQUE1QixJQUFrQyxFQUE3QyxDQUFYLENBQW5CO0FBQ0gsYUFKRDtBQUtBLGdCQUFJLGFBQUosQ0FBa0IsU0FBbEIsQ0FBNEIsc0NBQTVCOztBQUVBLGdCQUFJLE9BQU8sQ0FBWDtBQUNBLHFCQUFTLGFBQVQsQ0FBdUIsc0JBQXZCLEVBQStDLGdCQUEvQyxDQUFnRSxPQUFoRSxFQUF5RSxZQUFJO0FBQ3pFLHVCQUFPLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxPQUFPLENBQW5CLENBQVA7QUFDQSx5QkFBUyxhQUFULENBQXVCLGtCQUF2QixFQUEyQyxTQUEzQyxHQUF1RCxJQUF2RDtBQUNBLHlCQUFTLGFBQVQsQ0FBdUIsb0JBQXZCLEVBQTZDLEtBQTdDLENBQW1ELFdBQW5ELENBQStELG1CQUEvRCxFQUFvRixJQUFwRjtBQUNILGFBSkQ7QUFLQSxxQkFBUyxhQUFULENBQXVCLHFCQUF2QixFQUE4QyxnQkFBOUMsQ0FBK0QsT0FBL0QsRUFBd0UsWUFBSTtBQUN4RSx1QkFBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksT0FBTyxDQUFuQixDQUFQO0FBQ0EseUJBQVMsYUFBVCxDQUF1QixrQkFBdkIsRUFBMkMsU0FBM0MsR0FBdUQsSUFBdkQ7QUFDQSx5QkFBUyxhQUFULENBQXVCLG9CQUF2QixFQUE2QyxLQUE3QyxDQUFtRCxXQUFuRCxDQUErRCxtQkFBL0QsRUFBb0YsSUFBcEY7QUFDSCxhQUpEO0FBS0g7Ozs7Ozs7O0FDekpMOzs7Ozs7Ozs7O0lBRWEsUSxXQUFBLFE7O0FBRVQ7Ozs7O0FBS0Esc0JBQVksR0FBWixFQUFpQixjQUFqQixFQUFpQztBQUFBOztBQUFBOztBQUM3QixZQUFNLGdCQUFnQixXQUFXLEdBQVgsRUFBZ0I7QUFDbEMsbUJBQU8sY0FEMkI7QUFFbEMsa0JBQU0sS0FGNEI7QUFHbEMseUJBQWEsSUFIcUI7QUFJbEMseUJBQWEsSUFKcUI7QUFLbEMseUJBQWEsS0FMcUI7QUFNbEMscUNBQXlCLElBTlM7QUFPbEMsMEJBQWMsSUFQb0I7QUFRbEMsNEJBQWdCLE1BUmtCO0FBU2xDLG1CQUFPO0FBVDJCLFNBQWhCLENBQXRCOztBQVlBLFlBQU0sT0FBTyxTQUFTLElBQVQsSUFBaUIsU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUE5QjtBQUNBLGFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsQ0FBZDs7QUFFQSxhQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLFVBQWxCO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxVQUFmLEVBQTJCO0FBQ3ZCLGlCQUFLLEtBQUwsQ0FBVyxVQUFYLENBQXNCLE9BQXRCLEdBQWdDLEVBQWhDO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsU0FBUyxjQUFULENBQXdCLEVBQXhCLENBQXZCO0FBQ0g7QUFDRCxhQUFLLFdBQUwsQ0FBaUIsS0FBSyxLQUF0Qjs7QUFFQSxzQkFBYyxPQUFkLENBQXNCLE1BQXRCLEVBQThCLE1BQTlCO0FBQ0Esc0JBQWMsRUFBZCxDQUFpQixRQUFqQixFQUEyQixZQUFZO0FBQ25DLGtCQUFLLFFBQUwsQ0FBYyxjQUFjLFFBQWQsRUFBZDtBQUNILFNBRkQ7QUFHQSxhQUFLLFFBQUwsQ0FBYyxjQUFkO0FBQ0g7Ozs7aUNBRVEsSyxFQUFPO0FBQUE7O0FBQ1osaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ2xDLHFCQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLENBQTRCLENBQTVCO0FBQ0g7QUFDRCxpQkFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGtCQUFNLEtBQU4sQ0FBWSxHQUFaLEVBQ0ssR0FETCxDQUNTO0FBQUEsdUJBQU8sSUFBSSxJQUFKLEVBQVA7QUFBQSxhQURULEVBRUssT0FGTCxDQUVhLHVCQUFlO0FBQ3BCLG9CQUFJO0FBQ0EsMkJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBakIsQ0FBNEIsY0FBYyxHQUExQztBQUNBLDJCQUFLLE1BQUw7QUFDSCxpQkFIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1IsNEJBQVEsS0FBUixDQUFjLENBQWQ7QUFDSDtBQUNKLGFBVEw7QUFXSDs7Ozs7Ozs7QUN6REw7Ozs7Ozs7O0lBRWEsYzs7QUFFVDs7Ozs7O1FBRlMsYyxHQVFULHdCQUFZLEdBQVosRUFBaUIsSUFBakIsRUFBdUIsY0FBdkIsRUFBdUM7QUFBQTs7QUFDbkMsUUFBTSxlQUFlLFdBQVcsR0FBWCxFQUFnQjtBQUNqQyxlQUFPLGNBRDBCO0FBRWpDLGNBQU0sSUFGMkI7QUFHakMscUJBQWEsSUFIb0I7QUFJakMscUJBQWEsSUFKb0I7QUFLakMscUJBQWEsS0FMb0I7QUFNakMsa0JBQVUsSUFOdUI7QUFPakMsaUNBQXlCLElBUFE7QUFRakMsc0JBQWMsSUFSbUI7QUFTakMsd0JBQWdCLE1BVGlCO0FBVWpDLGVBQU87QUFWMEIsS0FBaEIsQ0FBckI7O0FBYUEsaUJBQWEsT0FBYixDQUFxQixNQUFyQixFQUE2QixNQUE3QjtBQUNILEM7OztBQ3pCTDs7Ozs7Ozs7OztBQUVBLElBQU0sVUFBVSxPQUFoQjtBQUNBLElBQU0sY0FBYyxRQUFwQjtBQUNBLElBQU0scUJBQXFCLE9BQTNCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLG1CLFdBQUEsbUI7QUFDVCx1Q0FHRztBQUFBLFlBRkMsTUFFRCxRQUZDLE1BRUQ7QUFBQSxZQURDLGFBQ0QsUUFEQyxhQUNEOztBQUFBOztBQUNDLGFBQUssV0FBTCxHQUFtQixTQUFTLGNBQVQsZ0JBQXFDLE1BQXJDLENBQW5CO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLGFBQXJCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLGVBQU8sZ0JBQVAsV0FBZ0MsTUFBaEMsRUFBMEMsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUExQztBQUNBLGVBQU8sZ0JBQVAsZ0JBQXFDLE1BQXJDLEVBQStDLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBL0M7QUFDSDs7OzswQ0FFaUIsSyxFQUFPO0FBQ3JCLGdCQUFJO0FBQ0Esb0JBQUksYUFBYSxJQUFqQjtBQUNBLG9CQUFJLE1BQU0sSUFBTixLQUFlLE1BQW5CLEVBQTJCO0FBQ3ZCLHdCQUFJLEtBQUssU0FBTCxJQUFrQixDQUF0QixFQUF5QjtBQUNyQixxQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxTQUF4QixDQUFiO0FBQ0g7QUFDSixpQkFKRCxNQUtBLElBQUksTUFBTSxJQUFOLEtBQWUsZUFBbkIsRUFBb0M7QUFDaEMsd0JBQU0sUUFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsaUNBQWEsS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQWI7QUFFSCxpQkFMRCxNQUtPO0FBQ0gsd0JBQU0sU0FBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLE1BQWpCO0FBQ0E7QUFDQSx3QkFBSSxTQUFRLENBQVosRUFBZTtBQUNYLHFDQUFhLEtBQUssYUFBTCxDQUFtQixTQUFRLENBQTNCLENBQWI7QUFDSDtBQUNKO0FBQ0Qsb0JBQU0sT0FBTyxhQUFhLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBYixHQUF1QyxFQUFwRDtBQUNBLG9CQUFNLE9BQU8sRUFBYjtBQUNBLG9CQUFNLFdBQVcsRUFBakI7QUFDQSxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsd0JBQU0sTUFBTSxLQUFLLENBQUwsQ0FBWjtBQUNBLDRCQUFRLElBQVI7QUFDSSw2QkFBSyxRQUFRLE1BQWI7QUFDQSw2QkFBSyxRQUFRLFNBQWI7QUFDQSw2QkFBSyxRQUFRLEtBQWI7QUFDQSw2QkFBSyxRQUFRLFFBQWI7QUFDQSw2QkFBSyxRQUFRLFdBQWI7QUFDQSw2QkFBSyxRQUFRLFlBQWI7QUFDSSxxQ0FBUyxHQUFULElBQWdCLFdBQVcsR0FBWCxDQUFoQjtBQUNBO0FBQ0osNkJBQUssUUFBUSxRQUFiO0FBQ0EsNkJBQUssUUFBUSxPQUFiO0FBQ0EsNkJBQUssUUFBUSxLQUFiO0FBQ0EsNkJBQUssUUFBUSxNQUFiO0FBQ0ksaUNBQUssR0FBTCxJQUFZLFdBQVcsR0FBWCxDQUFaO0FBQ0E7QUFDSjtBQWZKO0FBa0JIOztBQUVELG9CQUFJLFNBQVMsU0FBVCxLQUF1QixTQUEzQixFQUFzQztBQUNsQyw2QkFBUyxTQUFULEdBQXFCLE9BQXJCO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLE9BQVQsS0FBcUIsU0FBckIsSUFBa0MsS0FBSyxNQUFMLEtBQWdCLFNBQXRELEVBQWlFO0FBQzdELHlCQUFLLE1BQUwsR0FBYyxXQUFkO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLElBQVQsS0FBa0IsU0FBbEIsSUFBK0IsS0FBSyxHQUFMLEtBQWEsU0FBaEQsRUFBMkQ7QUFDdkQseUJBQUssR0FBTCxHQUFXLENBQVg7QUFDSDtBQUNELG9CQUFJLFNBQVMsTUFBVCxLQUFvQixTQUFwQixJQUFpQyxLQUFLLEtBQUwsS0FBZSxTQUFwRCxFQUErRDtBQUMzRCx5QkFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNIO0FBQ0Qsb0JBQUksU0FBUyxHQUFULEtBQWlCLFNBQWpCLElBQThCLEtBQUssSUFBTCxLQUFjLFNBQWhELEVBQTJEO0FBQ3ZELHlCQUFLLElBQUwsR0FBWSxDQUFaO0FBQ0g7QUFDRCxxQkFBSyxXQUFMLENBQWlCLElBQWpCLEdBQXdCLElBQXhCO0FBQ0EscUJBQUssV0FBTCxDQUFpQixRQUFqQixHQUE0QixRQUE1QjtBQUNBLHFCQUFLLFdBQUwsQ0FBaUIsVUFBakIsR0FBOEIsV0FBOUI7QUFFSCxhQWhFRCxDQWdFRSxPQUFPLENBQVAsRUFBVTtBQUNSLHdCQUFRLEtBQVIsQ0FBYyxDQUFkO0FBQ0g7QUFDSjs7OzJDQUVrQjtBQUNmLGlCQUFLLGlCQUFMLENBQXVCO0FBQ25CLHNCQUFNLE1BRGE7QUFFbkIsMEJBQVUsU0FBUyxhQUFULENBQXVCLHNCQUF2QjtBQUZTLGFBQXZCO0FBSUEsbUJBQU8sZ0JBQVAsQ0FBd0IsZUFBeEIsRUFBeUMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QztBQUNBLG1CQUFPLGdCQUFQLENBQXdCLGdCQUF4QixFQUEwQyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTFDO0FBQ0g7OzsrQ0FFc0I7QUFDbkIsbUJBQU8sbUJBQVAsQ0FBMkIsZUFBM0IsRUFBNEMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUE1QztBQUNBLG1CQUFPLG1CQUFQLENBQTJCLGdCQUEzQixFQUE2QyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTdDO0FBQ0g7Ozs7Ozs7QUN0R0w7Ozs7Ozs7QUFFQTs7OztBQUlBLElBQU0sY0FBYyxJQUFwQjtBQUNBLElBQU0sb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLGUsV0FBQSxlLEdBQ1QsMkJBQWM7QUFBQTs7QUFDVjtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsYUFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWSxFQVVaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQVZZLEVBZVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsRUFGVjtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBZlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLGFBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sRUFEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlk7QUFISyxLQUF4Qjs7QUF1QkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLG9CQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWTtBQUhLLEtBQXhCOztBQWNBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxtQkFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLG1CQUFPO0FBSEssU0FBRCxFQUlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBSlksRUFRWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVJZLEVBWVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FaWSxFQWdCWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQWhCWTtBQUhLLEtBQXhCOztBQTBCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsZ0JBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWTtBQUhLLEtBQXhCOztBQWtCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsdUJBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlksRUFnQlo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FoQlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLFdBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlksRUFnQlo7QUFDQyxrQkFBTSxFQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FoQlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLHNCQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWTtBQUhLLEtBQXhCOztBQWVBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxtQkFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWix1QkFBVyxPQURDO0FBRVosa0JBQU0sQ0FGTTtBQUdaLHFCQUFTLENBSEc7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLHVCQUFXLE9BRFo7QUFFQyxrQkFBTSxDQUZQO0FBR0MscUJBQVMsQ0FIVjtBQUlDLG1CQUFPO0FBSlIsU0FMWTtBQUhLLEtBQXhCOztBQWdCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsa0JBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlk7QUFISyxLQUF4Qjs7QUFzQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLGlCQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBUlksRUFZWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVpZO0FBSEssS0FBeEI7O0FBc0JBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxZQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBUlksRUFZWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVpZO0FBSEssS0FBeEI7O0FBc0JBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxrQkFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLG1CQUFPO0FBSEssU0FBRCxFQUlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBSlksRUFRWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVJZLEVBWVo7QUFDQyxrQkFBTSxFQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FaWTtBQUhLLEtBQXhCOztBQXNCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsaUJBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlksRUFnQlo7QUFDQyxrQkFBTSxFQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FoQlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLFlBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlk7QUFISyxLQUF4QjtBQXdCSCxDOzs7Ozs7Ozs7Ozs7O0lDbldRLGUsV0FBQSxlO0FBRVosNEJBQWE7QUFBQTs7QUFDWixPQUFLLElBQUw7QUFDQTs7OzsrQkFFWTtBQUFBOztBQUNaLElBQUMsZUFBRCxFQUFrQixpQkFBbEIsRUFBcUMsYUFBckMsRUFBb0QsY0FBcEQsRUFBb0UsaUJBQXBFLEVBQ0csT0FESCxDQUNXLGdCQUFRO0FBQ2xCLFFBQUksZ0JBQUosQ0FBcUI7QUFDbkIsZUFEbUI7QUFFbkIsYUFBUSxVQUZXO0FBR25CLG1CQUFjLEtBSEs7QUFJbkIsZUFBVTtBQUpTLEtBQXJCO0FBTUMsSUFSRjtBQVNBLE9BQUksbUJBQW1CLE9BQU8sZ0JBQTlCO0FBQ0EsT0FBSSxHQUFKLEVBQ0MsbUJBQW1CLElBQUksZ0JBQXZCOztBQUVELFFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1Qix1QkFBdkIsRUFBZ0QsZ0JBQWhELEVBQWI7QUFDQSxRQUFLLFlBQUwsR0FBb0IsU0FBUyxhQUFULENBQXVCLHVCQUF2QixDQUFwQjtBQUNBLFFBQUssTUFBTCxHQUFjLFNBQVMsYUFBVCxDQUF1QiwrQkFBdkIsQ0FBZDtBQUNBLFFBQUssR0FBTCxHQUFXLFNBQVMsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBWDtBQUNBLFFBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsUUFBSyxjQUFMLEdBQXNCLElBQUksY0FBSixDQUFtQjtBQUN4QyxrQkFBYyxLQUFLLFlBRHFCO0FBRXhDLGlCQUFhLE9BRjJCO0FBR3hDLGVBQVcsS0FBSztBQUh3QixJQUFuQixDQUF0QjtBQUtBLE9BQUc7O0FBR0YsVUFBTSxpQkFBaUIsU0FBakIsQ0FBMkIsc0NBQTNCLENBQU47O0FBRUEsU0FBSyxnQkFBTDtBQUNBLFNBQUssYUFBTDtBQUNBLFNBQUssTUFBTDtBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0M7QUFBQSxZQUFLLE1BQUssTUFBTCxFQUFMO0FBQUEsS0FBbEM7QUFDQSxJQVRELENBU0MsT0FBTSxDQUFOLEVBQVE7QUFDUixZQUFRLEdBQVIsQ0FBWSx3QkFBWjtBQUNBOztBQUVEOzs7O0FBSUUsT0FBSSxnQkFBSixDQUFxQixnQkFBckIsRUFDRCxDQUNFLElBQUksY0FBSixDQUFtQixNQUFuQixFQUEyQixDQUM1QixFQUFDLDRCQUFELEVBRDRCLEVBRTVCLEVBQUMsNEJBQXlCLGVBQWUsWUFBeEMsU0FBRCxFQUY0QixDQUEzQixFQUdHO0FBQ0osV0FBTyxxQkFBbUIsWUFBbkIsR0FBa0MsT0FEckM7QUFFSixjQUFVLENBQUMsZUFBZSxZQUFoQixJQUE4QixZQUE5QixHQUE2QyxPQUZuRDtBQUdKLFVBQU07QUFIRixJQUhILENBREYsQ0FEQyxFQVdELGNBWEMsRUFZRCxFQVpDLEVBYUUsSUFiRjtBQWNGO0FBQ0E7OzsyQkFFUTtBQUNSLE9BQU0sZUFBZSxLQUFLLFlBQUwsQ0FBa0IsWUFBdkM7QUFDQSxPQUFNLGVBQWUsS0FBSyxZQUFMLENBQWtCLFlBQXZDO0FBQ0EsT0FBTSxZQUFZLGVBQWUsWUFBakM7QUFDQSxXQUFRLEdBQVIsQ0FBWSxZQUFaLEVBQTBCLFlBQTFCLEVBQXdDLFNBQXhDO0FBQ0EsT0FBTSxvQkFBb0IsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLGNBQWYsRUFBK0IsS0FBL0IsSUFBd0MsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLGVBQWYsRUFBZ0MsS0FBaEMsR0FBd0MsSUFBSSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsaUJBQWYsRUFBa0MsS0FBdEgsQ0FBMUI7QUFDQSxPQUFNLHFCQUFzQixLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsaUJBQWYsRUFBa0MsS0FBbEMsR0FBd0MsQ0FBeEMsR0FBNEMsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLGVBQWYsRUFBZ0MsS0FBaEMsR0FBc0MsQ0FBbEYsR0FBc0YsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLGlCQUFmLEVBQWtDLEtBQXBKO0FBQ0EsT0FBTSx3QkFBd0IsWUFBWSxrQkFBMUM7QUFDQTtBQUNBLE9BQU0sd0JBQXdCLHFCQUFxQixTQUFuRDs7QUFFQSxPQUFNLE9BQU8sS0FBSyxZQUFMLENBQWtCLFlBQWxCLEVBQWI7QUFDQSxRQUFLLENBQUwsRUFBUSxTQUFSLDhCQUE2QyxpQkFBN0M7QUFDQSxRQUFLLENBQUwsRUFBUSxNQUFSLEdBQWlCLHFCQUFqQjtBQUNBLFFBQUssQ0FBTCxFQUFRLFNBQVIsbUJBQWtDLHFCQUFsQyxrQkFBb0UsaUJBQXBFO0FBQ0EsUUFBSyxZQUFMLENBQWtCLFlBQWxCLENBQStCLElBQS9COztBQUVBLE9BQU0sT0FBTyxLQUFLLFNBQUwsQ0FBZSxZQUFmLEVBQWI7QUFDQSxRQUFLLENBQUwsRUFBUSxNQUFSLEdBQWlCLHFCQUFqQjtBQUNBLFFBQUssU0FBTCxDQUFlLFlBQWYsQ0FBNEIsSUFBNUI7QUFDQTs7O3FDQUVrQjtBQUNsQixRQUFLLFlBQUwsR0FBb0IsSUFBSSxjQUFKLENBQW1CLEtBQUssTUFBeEIsRUFBZ0MsQ0FDbkQsRUFBQyxxQ0FBRCxFQUF3QyxRQUFRLGFBQWhELEVBQStELFFBQVEsQ0FBdkUsRUFEbUQsRUFFbkQsRUFBQyxzQ0FBb0MsQ0FBcEMsQ0FBcUMscUJBQXJDLE1BQUQsRUFBZ0UsUUFBUSxRQUF4RSxFQUFrRixRQUFRLENBQTFGLENBQTRGLHlCQUE1RixFQUZtRCxFQUduRCxFQUFDLDJCQUF5QixDQUF6QixDQUEwQix5QkFBMUIsa0JBQWdFLENBQWhFLENBQWlFLHFCQUFqRSxNQUFELEVBQTRGLFFBQVEsQ0FBcEcsRUFIbUQsQ0FBaEMsRUFJakI7QUFDRixjQUFVLEtBQUssT0FBTCxHQUFlLEtBQUssT0FENUI7QUFFRixVQUFNLE1BRko7QUFHRixnQkFBWTtBQUhWLElBSmlCLENBQXBCOztBQVVBLE9BQUksZ0JBQUosQ0FBcUIsaUJBQXJCLEVBQ0MsS0FBSyxZQUROLEVBRUMsS0FBSyxjQUZOLEVBR0MsRUFIRCxFQUlFLElBSkY7QUFLQTs7O2tDQUVlO0FBQ2YsUUFBSyxTQUFMLEdBQWlCLElBQUksY0FBSixDQUNoQixLQUFLLEdBRFcsRUFFaEIsQ0FDQSxFQUFDLFNBQVMsQ0FBVixFQUFhLFFBQVEsQ0FBckIsRUFEQSxFQUVBLEVBQUMsU0FBUyxDQUFWLEVBQWEsUUFBUSxDQUFyQixDQUF1Qix5QkFBdkIsRUFGQSxFQUdBLEVBQUMsU0FBUyxDQUFWLEVBQWEsUUFBUSxDQUFyQixFQUhBLENBRmdCLEVBT2hCO0FBQ0EsY0FBVSxLQUFLLE9BQUwsR0FBZSxLQUFLLE9BRDlCO0FBRUEsVUFBTSxNQUZOO0FBR0EsZ0JBQVk7QUFDWjs7Ozs7Ozs7QUFKQSxJQVBnQixDQUFqQjtBQXNCQSxPQUFJLGdCQUFKLENBQXFCLGlCQUFyQixFQUNDLEtBQUssU0FETixFQUVDLEtBQUssY0FGTixFQUdDLEVBSEQsRUFJRSxJQUpGO0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDcklXLEssV0FBQSxLO0FBQ1oscUJBQWE7QUFBQTs7QUFDWixhQUFLLE1BQUw7QUFDQSxhQUFLLEdBQUw7QUFDQSxhQUFLLE1BQUw7QUFDQSxhQUFLLE9BQUw7QUFDQSxhQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0EsYUFBSyxXQUFMOztBQUVBLGFBQUssSUFBTDtBQUNBOztBQUVEOzs7OztzQ0FDaUI7QUFDVixnQkFBTSxRQUFRLEtBQUssR0FBTCxDQUFTLGVBQVQsQ0FBeUIsS0FBSyxNQUE5QixFQUFzQyxLQUFLLE9BQTNDLENBQWQ7QUFDQSxnQkFBTSxXQUFXLElBQUksV0FBSixDQUFnQixNQUFNLElBQU4sQ0FBVyxNQUEzQixDQUFqQjtBQUNBLGdCQUFNLE1BQU0sU0FBUyxNQUFyQjs7QUFFQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCO0FBQzFCLG9CQUFJLEtBQUssTUFBTCxLQUFnQixHQUFwQixFQUF5QjtBQUNyQiw2QkFBUyxDQUFULElBQWMsVUFBZDtBQUNIO0FBQ0o7O0FBRUQsaUJBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsS0FBcEI7QUFDSDs7Ozs7QUFHRDtxQ0FDYTtBQUNULGdCQUFJLEtBQUssS0FBTCxLQUFlLENBQW5CLEVBQXNCO0FBQ2xCLHFCQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUssS0FBTDtBQUNIOztBQUVELGlCQUFLLEdBQUwsQ0FBUyxZQUFULENBQXNCLEtBQUssU0FBTCxDQUFlLEtBQUssS0FBcEIsQ0FBdEIsRUFBa0QsQ0FBbEQsRUFBcUQsQ0FBckQ7QUFDSDs7Ozs7QUFHRDsrQkFDTztBQUFBOztBQUNILGlCQUFLLFVBQUwsQ0FBZ0IsS0FBSyxLQUFyQjs7QUFFQSxpQkFBSyxXQUFMLEdBQW1CLE9BQU8sVUFBUCxDQUFrQixZQUFNO0FBQ3ZDLHVCQUFPLHFCQUFQLENBQTZCLE1BQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxLQUFmLENBQTdCO0FBQ0gsYUFGa0IsRUFFZixPQUFPLEVBRlEsQ0FBbkI7QUFHSDs7Ozs7QUFHRDtnQ0FDUTtBQUNKLGlCQUFLLE1BQUwsR0FBYyxPQUFPLFVBQXJCO0FBQ0EsaUJBQUssT0FBTCxHQUFlLE9BQU8sV0FBdEI7O0FBRUEsaUJBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxNQUF6QjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssT0FBMUI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFwQixFQUF3QixHQUF4QixFQUE2QjtBQUN6QixxQkFBSyxXQUFMO0FBQ0g7O0FBRUQsaUJBQUssSUFBTDtBQUNIOzs7OztBQUdEOytCQUNPO0FBQ0gsaUJBQUssTUFBTCxHQUFjLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFkO0FBQ0EsaUJBQUssR0FBTCxHQUFXLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBWDs7QUFFQSxpQkFBSyxLQUFMO0FBQ0g7Ozs7Ozs7QUN6RUw7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBQ0E7O0FBSUEsQ0FBQyxrQkFBa0I7O0FBR2YsbUJBQWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBRUEsWUFBSSxrQkFBa0IsR0FBdEIsRUFBMEI7QUFDdEIsZ0JBQUc7O0FBRUMsb0JBQUksZ0JBQUosQ0FBcUI7QUFDakIsMEJBQU0sZUFEVztBQUVqQiw0QkFBUSxnQkFGUztBQUdqQiw4QkFBVSxLQUhPO0FBSWpCLGtDQUFjO0FBSkcsaUJBQXJCO0FBTUEsaUJBQUMsSUFBSSxZQUFKLElBQW9CLFlBQXJCLEVBQW1DLFNBQW5DLENBQTZDLG9DQUE3QztBQUNILGFBVEQsQ0FTQyxPQUFNLENBQU4sRUFBUTtBQUNMLHdCQUFRLElBQVIsQ0FBYSxrQkFBYjtBQUNIO0FBQ0o7QUFDRCxZQUFJLFlBQUo7QUFDQSxZQUFJLGdCQUFKO0FBQ0E7QUFDQSxZQUFJLCtCQUFKO0FBQ0EsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYLGdCQUFJLFlBQUo7QUFDSCxTQUZELE1BRUs7QUFDRDtBQUNIO0FBRUo7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBcENEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9ucyB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX2Jyb3dzZXJFbmdpbmUoKTtcblxuXHRcdHRoaXMuX2FuaW1hdGVIb3VkaW5pKCk7XG5cblx0XHR0aGlzLl93b3JrbGV0U3RlcHMoKTtcblx0fVxuXG5cdF9icm93c2VyRW5naW5lKCkge1xuXHRcdGxldCBzdGVwQW5pbWF0aW9uID0gMDtcblx0XHRjb25zdCBTVEVQX0RPV05MT0FEID0gMTtcblx0XHRjb25zdCBTVEVQX1BST0NFU1MgPSAyO1xuXHRcdGNvbnN0IFNURVBfQlJPV1NFUiA9IDM7XG5cdFx0Y29uc3QgU1RFUF9MQVlPVVQgPSA0O1xuXHRcdGNvbnN0IFNURVBfUEFJTlQgPSA1O1xuXG5cdFx0ZnVuY3Rpb24gZnJhZ21lbnRBbmltYXRpb24oKXtcblx0XHRcdHN0ZXBBbmltYXRpb24rKztcblx0XHRcdHN3aXRjaChzdGVwQW5pbWF0aW9uKXtcblx0XHRcdFx0Y2FzZShTVEVQX0RPV05MT0FEKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5hZGQoJ2h0bWwnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LmFkZCgnaHRtbCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9QUk9DRVNTKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLXByb2Nlc3MnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX0JST1dTRVIpOntcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3NlcicpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX0xBWU9VVCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItbGF5b3V0Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX1BBSU5UKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYWludCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1wYWludCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdicm93c2VyLWVuZ2luZScsICgpPT57XG5cdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGZyYWdtZW50QW5pbWF0aW9uKTtcblx0XHRcdHN0ZXBBbmltYXRpb24gPSAwO1xuXG5cdFx0XHRmdW5jdGlvbiBjbGVhckFuaW0oKXtcblx0XHRcdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNsb3VkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3NlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFpbnQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1wYWludCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XG5cdFx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xuXHRcdFx0fSwxMDApO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRfYW5pbWF0ZUhvdWRpbmkoKXtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0ZS1ob3VkaW5pLXdvcmtmbG93JywgKCkgPT4ge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsQmFja0ZyYWdtZW50KCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cdH1cblxuXHRfd29ya2xldFN0ZXBzKCkge1xuXHRcdGxldCBzdGVwQW5pbWF0aW9uID0gMDtcblx0XHRjb25zdCBTVEVQX0FERCA9IDE7XG5cdFx0Y29uc3QgU1RFUF9BRERfV09SS0tFVCA9IDI7XG5cdFx0Y29uc3QgU1RFUF9MT0FEID0gMztcblx0XHRjb25zdCBTVEVQX1JFTkRFUiA9IDQ7XG5cdFx0Y29uc3QgU1RFUF9DQUxMID0gNTtcblx0XHRjb25zdCBTVEVQX0VYRUNVVEUgPSA2O1xuXG5cdFx0ZnVuY3Rpb24gZnJhZ21lbnRBbmltYXRpb24oKXtcblx0XHRcdHN0ZXBBbmltYXRpb24rKztcblx0XHRcdHN3aXRjaChzdGVwQW5pbWF0aW9uKXtcblx0XHRcdFx0Y2FzZShTVEVQX0FERCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0xJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9BRERfV09SS0tFVCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0yJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9MT0FEKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTMnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX1JFTkRFUik6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC00JykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9DQUxMKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTUnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX0VYRUNVVEUpOntcblx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtNicpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3dvcmtsZXQtc3RlcHMnLCAoKT0+e1xuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XG5cdFx0XHRzdGVwQW5pbWF0aW9uID0gMDtcblxuXHRcdFx0ZnVuY3Rpb24gY2xlYXJBbmltKCl7XG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnJhZ21lbnRBbmltYXRpb24pO1xuXHRcdFx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTEnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0yJykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtMycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTQnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC01JykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtNicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XG5cdFx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xuXHRcdFx0fSwxMDApO1xuXHRcdH0pO1xuXG5cdH1cbn0iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q3NzXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcbmltcG9ydCB7XG4gICAgQXBwbHlDb2RlTWlyb3Jcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlKcy5qcyc7XG5pbXBvcnQge0FuaW1hdGlvbkhlYWRlcn0gZnJvbSAnLi9ob3VkaW5pL2FuaW1hdGlvbi1oZWFkZXIuanMnXG5cbmV4cG9ydCBjbGFzcyBEZW1vcyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb1R5cGVPTSgpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFyKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vUHJvcGVydGllc0FuZFZhbHVlcygpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25EZW1vTG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbkRlbW9TdGF0ZScsICgpID0+e1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb25EZW1vTG9hZCl7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBBbmltYXRpb25IZWFkZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5sYXlvdXREZW1vTG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fZGVtb0xheW91dEFwaSgpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZGVtb1R5cGVPTSgpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuQ1NTVHJhbnNmb3JtVmFsdWUpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IC8vbmV3IENTU1RyYW5zZm9ybVZhbHVlKFtcbiAgICAgICAgICAgIG5ldyBDU1NSb3RhdGUoMCwwLDEsIENTUy5kZWcoMCkpXG4gICAgICAgIC8vXSk7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmVEZW1vJyk7XG4gICAgICAgIHNxdWFyZS5hdHRyaWJ1dGVTdHlsZU1hcC5zZXQoJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XG4gICAgICAgIGxldCByYWZJZDtcbiAgICAgICAgbGV0IHN0b3BBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gZHJhdygpe1xuICAgICAgICAgICAgdHJhbnNmb3JtLmFuZ2xlLnZhbHVlID0gKHRyYW5zZm9ybS5hbmdsZS52YWx1ZSArIDUpICUgMzYwO1xuICAgICAgICAgICAgc3F1YXJlLmF0dHJpYnV0ZVN0eWxlTWFwLnNldCgndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcbiAgICAgICAgICAgIHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xuICAgICAgICB9XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4gZHJhdygpKTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZJZCkpO1xuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFyKCkge1xuICAgICAgICAvKiogKi9cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzJyksXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50IGgye1xuICAgIC0tYS1zdXBlci12YXI6ICNGRkY7XG59XG4jcmVuZGVyLWVsZW1lbnQgLnRleHQtMXtcblxufVxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTJ7XG5cbn1gXG4gICAgICAgICk7XG4gICAgfVxuXG5cbiAgICBfZnJhbWVJbmNyZW1lbnQoKXtcbiAgICAgICAgaWYgKHRoaXMuZnJhbWUgPT09IDkpIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpLnN0eWxlLnNldFByb3BlcnR5KCctLWZyYW1lJywgdGhpcy5mcmFtZSk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9mcmFtZUluY3JlbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfZGVtb1Byb3BlcnRpZXNBbmRWYWx1ZXMoKSB7XG4gICAgICAgIENTUy5yZWdpc3RlclByb3BlcnR5KHtcbiAgICAgICAgICAgIG5hbWU6ICctLXByb3BlcnRpZXMtbW92ZS1yZWdpc3RlcicsXG4gICAgICAgICAgICBzeW50YXg6ICc8bGVuZ3RoPicsXG4gICAgICAgICAgICBpbmhlcml0czogZmFsc2UsXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICcwcHgnLFxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J0bi1zcXVhcmUtcHJvcGVydGllcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtcHJvcGVydGllcycpLmNsYXNzTGlzdC5yZW1vdmUoJ21vdmUnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtcHJvcGVydGllcycpLmNsYXNzTGlzdC5hZGQoJ21vdmUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG4tc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QuYWRkKCdtb3ZlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9kZW1vUGFpbnRBcGkoKSB7XG4gICAgICAgIGlmICghJ3BhaW50V29ya2xldCcgaW4gQ1NTKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIChDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9jaXJjbGUtd29ya2xldC5qcycpO1xuXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhaW50LWFwaS1jc3MnKSxcbiAgICAgICAgICAgIGAjcmVuZGVyLWVsZW1lbnQtcGFpbnQtYXBpIHtcbiAgICAtLWNpcmNsZS1jb2xvcjogYmxhY2s7XG4gICAgLS13aWR0aC1jaXJjbGU6IDEwMHB4O1xuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSwgMHB4LCByZWQpO1xufVxuLnJldmVhbCBzZWN0aW9uLnBhcmVudC1kZW1vLXBhaW50LmNhZHJle1xuICAgIC0tY2FkcmUtY29sb3I6YmxhY2s7XG59YFxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGknKSxcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcbiAgICAgICAgICAgIGBwYWludChjdHgsIGdlb20sIHByb3BlcnRpZXMsIGFyZ3MpIHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNlbnRlciBwb2ludCBhbmQgcmFkaXVzLlxuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWluKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIpO1xuICAgIGNvbnN0IGJvcmRlciA9IGFyZ3NbMF0udmFsdWU7XG4gICAgLy8gQ2hhbmdlIHRoZSBib3JkZXIgY29sb3IuXG4gICAgY3R4LmZpbGxTdHlsZSA9IGFyZ3NbMV0udG9TdHJpbmcoKTtcbiAgICBjdHguYXJjKGdlb20ud2lkdGggLSBib3JkZXIgLyAyLCBnZW9tLmhlaWdodCAtICAtIGJvcmRlciAvIDIsIHJhZGl1cyAtIGJvcmRlciwgMCwgMiAqIE1hdGguUEkpO1xuICAgIC8vIENoYW5nZSB0aGUgZmlsbCBjb2xvci5cbiAgICBjb25zdCBjb2xvciA9IHByb3BlcnRpZXMuZ2V0KCctLWNpcmNsZS1jb2xvcicpLnRvU3RyaW5nKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5hcmMoZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMiwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XG59YCk7XG4gICAgfVxuXG4gICAgX2RlbW9MYXlvdXRBcGkoKXtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2RlbW9MYXlvdXRXb3JrbGV0IGRpdicpLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0ID0gZWxlbS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIC8vIEN1dCBvdXQgYSByYW5kb20gYW1vdW50IG9mIHRleHQsIGJ1dCBrZWVwIGF0IGxlYXN0IDEwIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIGVsZW0udGV4dENvbnRlbnQgPSB0LnNsaWNlKDAsIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0Lmxlbmd0aCAtIDEwKSArIDEwKSk7XG4gICAgICAgIH0pXG4gICAgICAgIENTUy5sYXlvdXRXb3JrbGV0LmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvbWFzb25yeS13b3JrbGV0LmpzJyk7XG5cbiAgICAgICAgbGV0IGNvbHMgPSAzO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlCdG5NaW51cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgICAgIGNvbHMgPSBNYXRoLm1heCgzLCBjb2xzIC0gMSk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlDb2xzJykuaW5uZXJIVE1MID0gY29scztcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTGF5b3V0V29ya2xldCcpLnN0eWxlLnNldFByb3BlcnR5KCctLW1hc29ucnktY29sdW1ucycsIGNvbHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5QnRuUGx1cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgICAgIGNvbHMgPSBNYXRoLm1pbig4LCBjb2xzICsgMSk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlDb2xzJykuaW5uZXJIVE1MID0gY29scztcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTGF5b3V0V29ya2xldCcpLnN0eWxlLnNldFByb3BlcnR5KCctLW1hc29ucnktY29sdW1ucycsIGNvbHMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvZGVNaXJyb3JDc3MgPSBDb2RlTWlycm9yKGVsdCwge1xuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxuICAgICAgICAgICAgbW9kZTogJ2NzcycsXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxuICAgICAgICAgICAgdGhlbWU6ICdwYXJhaXNvLWRhcmsnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG5cbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xuXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3MoY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xuICAgIH1cblxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5kZWxldGVSdWxlKDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcbiAgICAgICAgdmFsdWUuc3BsaXQoJ30nKVxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcbiAgICAgICAgICAgIC5mb3JFYWNoKHNlbGVjdG9yQ3NzID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ3BhcmFpc28tZGFyaydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29kZU1pcnJvckpTLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xuICAgIH1cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTRlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5saW5lSGVpZ2h0ID0gTElORV9IRUlHSFQ7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxuICAgICAgICB9KTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG5cbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xuXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gIFRZcGVkIE9NIE5ldyBQb3NzaWJpbGl0aWVzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3R5cGVkb20tbmV3JyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMTEsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBUeXBlZCBPTSBOZXcgQXBpXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3R5cGVkb20tYXBpJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEwLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyAgVHlwZWQgT00gQ29udmVyc2lvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLWNvbnZlcnNpb24nLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIFR5cGVkIE9NIFRyYW5zZm9ybVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLXRyYW5zZm9ybScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDU1MgQ3VzdG9tIFByb3BlcnRpZXNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXByb3BlcnRpZXMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDksXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDU1MgUHJvcGVydGllcyAmIFZhbHVlcyBUeXBlc1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwcm9wZXJ0aWVzdmFsdWVzLXR5cGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUGFpbnQgQXBpXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BhaW50LWFwaScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDQsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQW5pbWF0b3IgRGVjbGFyYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnYW5pbWF0b3ItZGVjbGFyYXRpb24nLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyBBbmltYXRvciBUaW1lTGluZSAmIFJlZ2lzdGVyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2FuaW1hdG9yLXRpbWVsaW5lJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcE1hcmdpbjogJzExNXB4JyxcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcE1hcmdpbjogJzExNXB4JyxcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQW5pbWF0b3IgRWZmZWN0c1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdhbmltYXRvci1lZmZlY3RzJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzcwMHB4J1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQW5pbWF0b3IgSW52b2tlXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2FuaW1hdG9yLWludm9rZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTGF5b3V0IEFwaVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdsYXlvdXQtYXBpJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDgsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMYXlvdXQgSW50cmluc2ljIGNhbGNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnbGF5b3V0LWludHJpbnNpYycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExheW91dCBwb3NpdGlvbiBmcmFnbWVudHNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnbGF5b3V0LXBvc2l0aW9uJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDYsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQYXJzZXIgQXBpXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BhcnNlci1hcGknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDQsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA3LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG5cblxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgQW5pbWF0aW9uSGVhZGVye1xuXG5cdGNvbnN0cnVjdG9yKCl7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblxuXHRhc3luYyBpbml0KCkge1xuXHRcdFsnLS1hdmF0YXItc2l6ZScsICctLWhlYWRlci1oZWlnaHQnLCAnLS1mb250LWJhc2UnLCAnLS1iYXItaGVpZ2h0JywgJy0tYXZhdGFyLWJvcmRlciddXG5cdFx0ICAuZm9yRWFjaChuYW1lID0+IHtcblx0XHRcdENTUy5yZWdpc3RlclByb3BlcnR5KHtcblx0XHRcdCAgbmFtZSxcblx0XHRcdCAgc3ludGF4OiAnPGxlbmd0aD4nLFxuXHRcdFx0ICBpbml0aWFsVmFsdWU6ICcwcHgnLFxuXHRcdFx0ICBpbmhlcml0czogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRsZXQgYW5pbWF0aW9uV29ya2xldCA9IHdpbmRvdy5hbmltYXRpb25Xb3JrbGV0O1xuXHRcdGlmIChDU1MpXG5cdFx0XHRhbmltYXRpb25Xb3JrbGV0ID0gQ1NTLmFuaW1hdGlvbldvcmtsZXQ7XG5cblx0XHR0aGlzLnNpemVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0JykuY29tcHV0ZWRTdHlsZU1hcCgpO1xuXHRcdHRoaXMuc2Nyb2xsU291cmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0Jyk7XG5cdFx0dGhpcy5hdmF0YXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQgLmF2YXRhcicpO1xuXHRcdHRoaXMuYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0IC5iYXInKTtcblx0XHR0aGlzLm1heFRpbWUgPSAxMDAwO1xuXHRcdHRoaXMuZXBzaWxvbiA9IDFlLTI7XG5cdFx0dGhpcy5zY3JvbGxUaW1lbGluZSA9IG5ldyBTY3JvbGxUaW1lbGluZSh7XG5cdFx0XHRzY3JvbGxTb3VyY2U6IHRoaXMuc2Nyb2xsU291cmNlLFxuXHRcdFx0b3JpZW50YXRpb246ICdibG9jaycsXG5cdFx0XHR0aW1lUmFuZ2U6IHRoaXMubWF4VGltZSxcblx0XHR9KTtcblx0XHR0cnl7XG5cblxuXHRcdFx0YXdhaXQgYW5pbWF0aW9uV29ya2xldC5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2FuaW1hdG9yLWhlYWRlci5qcycpO1xuXG5cdFx0XHR0aGlzLmluaXRBdmF0YXJFZmZlY3QoKTtcblx0XHRcdHRoaXMuaW5pdEJhckVmZmVjdCgpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfID0+IHRoaXMudXBkYXRlKCkpO1xuXHRcdH1jYXRjaChlKXtcblx0XHRcdGNvbnNvbGUubG9nKCdXaWxsIFVzZSBQb2x5ZmlsbCA6XFwnKCcpO1xuXHRcdH1cblxuXHRcdC8qIGNyYnVnKDgyNDc4Mik6IGRlbGF5IGlzIG5vdCB3b3JraW5nIGFzIGV4cGVjdGVkIGluIHdvcmtsZXQsIGluc3RlYWQgaGVyZSB3ZSBjb21iaW5lXG5cdFx0ICAgd2hhdCB3b3VsZCBoYXZlIGJlZW4gYSBkZWxheWVkIGFuaW1hdGlvbiB3aXRoIHRoZSBvdGhlciBhdmF0YXIgYW5pbWF0aW9uIGJ1dCBzdGFydFxuXHRcdCAgIGl0IGF0IGEgZGlmZmVyZW50IG9mZnNldC5cblx0XHQqL1xuXHRcdCAgbmV3IFdvcmtsZXRBbmltYXRpb24oJ3R3aXR0ZXItaGVhZGVyJyxcblx0XHRcdFtcblx0XHRcdCAgbmV3IEtleWZyYW1lRWZmZWN0KGF2YXRhciwgW1xuXHRcdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgwcHgpYH0sXG5cdFx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7c2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0fXB4KWB9LFxuXHRcdFx0ICBdLCB7XG5cdFx0XHRcdGRlbGF5OiBhdmF0YXJTY3JvbGxFbmRQb3Mvc2Nyb2xsSGVpZ2h0ICogbWF4VGltZSxcblx0XHRcdFx0ZHVyYXRpb246IChzY3JvbGxIZWlnaHQgLSBjbGllbnRIZWlnaHQpL3Njcm9sbEhlaWdodCAqIG1heFRpbWUsXG5cdFx0XHRcdGZpbGw6ICdib3RoJyxcblx0XHRcdCAgfSksXG5cdFx0XHRdLFxuXHRcdFx0c2Nyb2xsVGltZWxpbmUsXG5cdFx0XHR7fVxuXHRcdCAgKS5wbGF5KCk7XG5cdFx0LyoqL1xuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdGNvbnN0IGNsaWVudEhlaWdodCA9IHRoaXMuc2Nyb2xsU291cmNlLmNsaWVudEhlaWdodDtcblx0XHRjb25zdCBzY3JvbGxIZWlnaHQgPSB0aGlzLnNjcm9sbFNvdXJjZS5zY3JvbGxIZWlnaHQ7XG5cdFx0Y29uc3QgbWF4U2Nyb2xsID0gc2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0O1xuXHRcdGNvbnNvbGUubG9nKGNsaWVudEhlaWdodCwgc2Nyb2xsSGVpZ2h0LCBtYXhTY3JvbGwpO1xuXHRcdGNvbnN0IGF2YXRhclRhcmdldFNjYWxlID0gdGhpcy5zaXplcy5nZXQoJy0tYmFyLWhlaWdodCcpLnZhbHVlIC8gKHRoaXMuc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUgKyAyICogdGhpcy5zaXplcy5nZXQoJy0tYXZhdGFyLWJvcmRlcicpLnZhbHVlKTtcblx0XHRjb25zdCBhdmF0YXJTY3JvbGxFbmRQb3MgPSAodGhpcy5zaXplcy5nZXQoJy0taGVhZGVyLWhlaWdodCcpLnZhbHVlLzIgLSB0aGlzLnNpemVzLmdldCgnLS1hdmF0YXItc2l6ZScpLnZhbHVlLzIgLSB0aGlzLnNpemVzLmdldCgnLS1hdmF0YXItYm9yZGVyJykudmFsdWUpO1xuXHRcdGNvbnN0IGF2YXRhclRhcmdldFRyYW5zbGF0ZSA9IG1heFNjcm9sbCAtIGF2YXRhclNjcm9sbEVuZFBvcztcblx0XHQvLyBTdG9wIHNjYWxpbmcgYXQgdGhpcyBvZmZzZXQgYW5kIHN0YXJ0IHRyYW5zZm9ybS5cblx0XHRjb25zdCBhdmF0YXJTY3JvbGxFbmRPZmZzZXQgPSBhdmF0YXJTY3JvbGxFbmRQb3MgLyBtYXhTY3JvbGw7XG5cblx0XHRjb25zdCBhZWtmID0gdGhpcy5hdmF0YXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XG5cdFx0YWVrZlsxXS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgwcHgpIHNjYWxlKCR7YXZhdGFyVGFyZ2V0U2NhbGV9KWA7XG5cdFx0YWVrZlsxXS5vZmZzZXQgPSBhdmF0YXJTY3JvbGxFbmRPZmZzZXQ7XG5cdFx0YWVrZlsyXS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke2F2YXRhclRhcmdldFRyYW5zbGF0ZX1weCkgc2NhbGUoJHthdmF0YXJUYXJnZXRTY2FsZX0pYDtcblx0XHR0aGlzLmF2YXRhckVmZmVjdC5zZXRLZXlmcmFtZXMoYWVrZik7XG5cblx0XHRjb25zdCBiZWtmID0gdGhpcy5iYXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XG5cdFx0YmVrZlsxXS5vZmZzZXQgPSBhdmF0YXJTY3JvbGxFbmRPZmZzZXQ7XG5cdFx0dGhpcy5iYXJFZmZlY3Quc2V0S2V5ZnJhbWVzKGJla2YpO1xuXHR9XG5cblx0aW5pdEF2YXRhckVmZmVjdCgpIHtcblx0XHR0aGlzLmF2YXRhckVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdCh0aGlzLmF2YXRhciwgW1xuXHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoMHB4KSBzY2FsZSgxKWAsIGVhc2luZzogJ2Vhc2UtaW4tb3V0Jywgb2Zmc2V0OiAwfSxcblx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoJHswLyphdmF0YXJUYXJnZXRTY2FsZSovfSlgLCBlYXNpbmc6ICdsaW5lYXInLCBvZmZzZXQ6IDAgLyphdmF0YXJTY3JvbGxFbmRPZmZzZXQqL30sXG5cdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgkezAvKmF2YXRhclRhcmdldFRyYW5zbGF0ZSovfXB4KSBzY2FsZSgkezAvKmF2YXRhclRhcmdldFNjYWxlKi99KWAsIG9mZnNldDogMX0sXG5cdFx0XSwge1xuXHRcdFx0ZHVyYXRpb246IHRoaXMubWF4VGltZSArIHRoaXMuZXBzaWxvbixcblx0XHRcdGZpbGw6ICdib3RoJyxcblx0XHRcdGl0ZXJhdGlvbnM6IEluZmluaXR5LFxuXHRcdH0pO1xuXG5cdFx0bmV3IFdvcmtsZXRBbmltYXRpb24oJ2FuaW1hdG9yLWhlYWRlcicsXG5cdFx0XHR0aGlzLmF2YXRhckVmZmVjdCxcblx0XHRcdHRoaXMuc2Nyb2xsVGltZWxpbmUsXG5cdFx0XHRbXVxuXHRcdCkucGxheSgpO1xuXHR9XG5cblx0aW5pdEJhckVmZmVjdCgpIHtcblx0XHR0aGlzLmJhckVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdChcblx0XHRcdHRoaXMuYmFyLFxuXHRcdFx0W1xuXHRcdFx0e29wYWNpdHk6IDAsIG9mZnNldDogMH0sXG5cdFx0XHR7b3BhY2l0eTogMSwgb2Zmc2V0OiAwIC8qYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0Ki99LFxuXHRcdFx0e29wYWNpdHk6IDEsIG9mZnNldDogMX1cblx0XHRcdF0sXG5cdFx0XHR7XG5cdFx0XHRkdXJhdGlvbjogdGhpcy5tYXhUaW1lICsgdGhpcy5lcHNpbG9uLFxuXHRcdFx0ZmlsbDogJ2JvdGgnLFxuXHRcdFx0aXRlcmF0aW9uczogSW5maW5pdHksXG5cdFx0XHQvKiBjcmJ1Zyg3NzkxODkpOiBVc2UgaW5maW5pdHkgaXRlcmF0aW9uIGFuZCBtYXhEdXJhdGlvbiB0byBhdm9pZCBlZmZlY3Rcblx0XHRcdFx0cHJlbWF0dXJlbHkgZmluaXNoaW5nLlxuXG5cdFx0XHRcdEJUVywgV2ViIEFuaW1hdGlvbnMgdXNlcyBhbiBlbmRwb2ludC1leGNsdXNpdmUgdGltaW5nIG1vZGVsLCB3aGljaCBtZWFuXG5cdFx0XHRcdHdoZW4gdGltZWxpbmUgaXMgYXQgXCJkdXJhdGlvblwiIHRpbWUsIGl0IGlzIGNvbnNpZGVyZWQgdG8gYmUgYXQgMCB0aW1lIG9mIHRoZVxuXHRcdFx0XHRzZWNvbmQgaXRlcmF0aW9uLiBUbyBhdm9pZCB0aGlzLCB3ZSBlbnN1cmUgb3VyIG1heCB0aW1lIChtYXggc2Nyb2xsIG9mZnNldCkgbmV2ZXJcblx0XHRcdFx0cmVhY2hlcyBkdXJhdGlvbiBieSBoYXZpbmcgZHVyYXRpb24gYW4gZXBzaWxvbiBsYXJnZXIuICBUaGlzIGhhY2sgaXMgbm90XG5cdFx0XHRcdG5lZWRlZCBvbmNlIHdlIGZpeCB0aGUgb3JpZ2luYWwgYnVnIGFib3ZlLlxuXHRcdFx0XHQqL1xuXHRcdFx0fVxuXHRcdCk7XG5cdFx0bmV3IFdvcmtsZXRBbmltYXRpb24oJ2FuaW1hdG9yLWhlYWRlcicsXG5cdFx0XHR0aGlzLmJhckVmZmVjdCxcblx0XHRcdHRoaXMuc2Nyb2xsVGltZWxpbmUsXG5cdFx0XHRbXVxuXHRcdCkucGxheSgpO1xuXHR9XG5cbn1cblxuIiwiZXhwb3J0IGNsYXNzIE5vaXNlIHtcblx0Y29uc3RydWN0b3IoKXtcblx0XHR0aGlzLmNhbnZhcztcblx0XHR0aGlzLmN0eDtcblx0XHR0aGlzLndXaWR0aDtcblx0XHR0aGlzLndIZWlnaHQ7XG5cdFx0dGhpcy5ub2lzZURhdGEgPSBbXTtcblx0XHR0aGlzLmZyYW1lID0gMDtcblx0XHR0aGlzLmxvb3BUaW1lb3V0O1xuXG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblxuXHQvLyBDcmVhdGUgTm9pc2VcbiAgICBjcmVhdGVOb2lzZSgpIHtcbiAgICAgICAgY29uc3QgaWRhdGEgPSB0aGlzLmN0eC5jcmVhdGVJbWFnZURhdGEodGhpcy53V2lkdGgsIHRoaXMud0hlaWdodCk7XG4gICAgICAgIGNvbnN0IGJ1ZmZlcjMyID0gbmV3IFVpbnQzMkFycmF5KGlkYXRhLmRhdGEuYnVmZmVyKTtcbiAgICAgICAgY29uc3QgbGVuID0gYnVmZmVyMzIubGVuZ3RoO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyMzJbaV0gPSAweGZmMDAwMDAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub2lzZURhdGEucHVzaChpZGF0YSk7XG4gICAgfTtcblxuXG4gICAgLy8gUGxheSBOb2lzZVxuICAgIHBhaW50Tm9pc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyYW1lID09PSA5KSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0aGlzLm5vaXNlRGF0YVt0aGlzLmZyYW1lXSwgMCwgMCk7XG4gICAgfTtcblxuXG4gICAgLy8gTG9vcFxuICAgIGxvb3AoKSB7XG4gICAgICAgIHRoaXMucGFpbnROb2lzZSh0aGlzLmZyYW1lKTtcblxuICAgICAgICB0aGlzLmxvb3BUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gICAgICAgIH0sICgxMDAwIC8gMjUpKTtcbiAgICB9O1xuXG5cbiAgICAvLyBTZXR1cFxuICAgIHNldHVwKCkge1xuICAgICAgICB0aGlzLndXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLndIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndXaWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy53SGVpZ2h0O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVOb2lzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb29wKCk7XG4gICAgfTtcblxuXG4gICAgLy8gSW5pdFxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaXNlJyk7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICB0aGlzLnNldHVwKCk7XG4gICAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gaW1wb3J0IHsgTWFza0hpZ2hsaWdodGVyIH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL21hc2staGlnaGxpZ2h0ZXIvbWFzay1oaWdobGlnaHRlci5qcyc7XG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodEV2ZW50c1xufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50LmpzJztcbmltcG9ydCB7XG4gICAgRGVtb3Ncbn0gZnJvbSAnLi9kZW1vcy5qcyc7XG5pbXBvcnQge05vaXNlfSBmcm9tICcuL2hvdWRpbmkvbm9pc2UuanMnO1xuaW1wb3J0IHtBbmltYXRpb25zfSBmcm9tICcuL2FuaW1hdGlvbnMvYW5pbS5qcyc7XG5cblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgaWYgKCdwYWludFdvcmtsZXQnIGluIENTUyl7XG4gICAgICAgICAgICB0cnl7XG5cbiAgICAgICAgICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICctLWNhZHJlLWNvbG9yJyxcbiAgICAgICAgICAgICAgICAgICAgc3ludGF4OiAnPGNvbG9yPiB8IG5vbmUnLFxuICAgICAgICAgICAgICAgICAgICBpbmhlcml0czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2FkcmUtd29ya2xldC5qcycpO1xuICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRXJyb3Igd2l0aCBjYWRyZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5ldyBOb2lzZSgpO1xuICAgICAgICBuZXcgQW5pbWF0aW9ucygpO1xuICAgICAgICAvLyBuZXcgVHlwZVRleHQoKTtcbiAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
