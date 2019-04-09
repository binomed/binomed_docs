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
            this._demoPaintApiJsInCss();
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
        key: '_demoPaintApiJsInCss',
        value: function _demoPaintApiJsInCss() {
            if (!'paintWorklet' in CSS) {
                return;
            }

            (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-from-css-worklet.js');

            new _applyCss.ApplyCss(document.getElementById('codemirror-paint-api-js-in-css'), '#render-element-paint-api-js-in-css {\n    --circle-color: black;\n    --width-circle: 100px;\n    width: var(--width-circle);\n    background-image: paint(circle-from-css);\n    --circle-js-in-css: (ctx, geom) => {\n        const color = `var(--circle-color)`;\n        ctx.fillStyle = color;\n        const x = geom.width / 2;\n        const y = geom.height / 2;\n        let radius = Math.min(x, y);\n        ctx.beginPath();\n        ctx.fillStyle = color;\n        ctx.arc(x, y, radius, 0, 2 * Math.PI);\n        ctx.fill();\n    }\n}', true);
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
     * @param {boolean} noTrim
     */
    function ApplyCss(elt, initialContent) {
        var _this = this;

        var noTrim = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
            theme: 'idea'
        });

        var head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        this.nbElts = 0;
        this.noTrim = noTrim;

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
            if (!this.noTrim) {
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
            } else {
                try {
                    this.style.sheet.insertRule(value);
                    this.nbElts++;
                } catch (e) {
                    console.error(e);
                }
            }
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
        theme: 'idea'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7SUFDYSxVLFdBQUEsVTtBQUNaLHVCQUFjO0FBQUE7O0FBQ2IsT0FBSyxjQUFMOztBQUVBLE9BQUssZUFBTDs7QUFFQSxPQUFLLGFBQUw7QUFDQTs7OzttQ0FFZ0I7QUFDaEIsT0FBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxPQUFNLGdCQUFnQixDQUF0QjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sY0FBYyxDQUFwQjtBQUNBLE9BQU0sYUFBYSxDQUFuQjs7QUFFQSxZQUFTLGlCQUFULEdBQTRCO0FBQzNCO0FBQ0EsWUFBTyxhQUFQO0FBQ0MsVUFBSyxhQUFMO0FBQW9CO0FBQ25CLGdCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBckMsQ0FBK0MsR0FBL0MsQ0FBbUQsTUFBbkQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLEdBQTlDLENBQWtELE1BQWxEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FBMUMsQ0FBb0QsR0FBcEQsQ0FBd0QsTUFBeEQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxZQUFMO0FBQW1CO0FBQ2xCLGdCQUFTLGNBQVQsQ0FBd0Is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QUNIOzs7Ozs7O0FDekVMOztBQUVBOztBQUNBOztBQUdBOztBQUdBOztBQUNBOztBQUlBLENBQUMsa0JBQWtCOztBQUdmLG1CQUFlLFFBQWYsR0FBMEI7O0FBRXRCLFlBQU0sV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXRDOztBQUVBLFlBQUksa0JBQWtCLEdBQXRCLEVBQTBCO0FBQ3RCLGdCQUFHOztBQUVDLG9CQUFJLGdCQUFKLENBQXFCO0FBQ2pCLDBCQUFNLGVBRFc7QUFFakIsNEJBQVEsZ0JBRlM7QUFHakIsOEJBQVUsS0FITztBQUlqQixrQ0FBYztBQUpHLGlCQUFyQjtBQU1BLGlCQUFDLElBQUksWUFBSixJQUFvQixZQUFyQixFQUFtQyxTQUFuQyxDQUE2QyxvQ0FBN0M7QUFDSCxhQVRELENBU0MsT0FBTSxDQUFOLEVBQVE7QUFDTCx3QkFBUSxJQUFSLENBQWEsa0JBQWI7QUFDSDtBQUNKO0FBQ0QsWUFBSSxZQUFKO0FBQ0EsWUFBSSxnQkFBSjtBQUNBO0FBQ0EsWUFBSSwrQkFBSjtBQUNBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxnQkFBSSxZQUFKO0FBQ0gsU0FGRCxNQUVLO0FBQ0Q7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQXBDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0J1xuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbnMge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl9icm93c2VyRW5naW5lKCk7XG5cblx0XHR0aGlzLl9hbmltYXRlSG91ZGluaSgpO1xuXG5cdFx0dGhpcy5fd29ya2xldFN0ZXBzKCk7XG5cdH1cblxuXHRfYnJvd3NlckVuZ2luZSgpIHtcblx0XHRsZXQgc3RlcEFuaW1hdGlvbiA9IDA7XG5cdFx0Y29uc3QgU1RFUF9ET1dOTE9BRCA9IDE7XG5cdFx0Y29uc3QgU1RFUF9QUk9DRVNTID0gMjtcblx0XHRjb25zdCBTVEVQX0JST1dTRVIgPSAzO1xuXHRcdGNvbnN0IFNURVBfTEFZT1VUID0gNDtcblx0XHRjb25zdCBTVEVQX1BBSU5UID0gNTtcblxuXHRcdGZ1bmN0aW9uIGZyYWdtZW50QW5pbWF0aW9uKCl7XG5cdFx0XHRzdGVwQW5pbWF0aW9uKys7XG5cdFx0XHRzd2l0Y2goc3RlcEFuaW1hdGlvbil7XG5cdFx0XHRcdGNhc2UoU1RFUF9ET1dOTE9BRCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LmFkZCgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5hZGQoJ2h0bWwnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlKFNURVBfUFJPQ0VTUyk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNsb3VkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9CUk9XU0VSKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXInKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9MQVlPVVQpOntcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9QQUlOVCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItbGF5b3V0Jyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFpbnQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLXBhaW50Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYnJvd3Nlci1lbmdpbmUnLCAoKT0+e1xuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XG5cdFx0XHRzdGVwQW5pbWF0aW9uID0gMDtcblxuXHRcdFx0ZnVuY3Rpb24gY2xlYXJBbmltKCl7XG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnJhZ21lbnRBbmltYXRpb24pO1xuXHRcdFx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtZG93bmxvYWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhaW50JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLXBhaW50Jyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdH1cblxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xuXHRcdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcblx0XHRcdH0sMTAwKTtcblx0XHR9KTtcblxuXHR9XG5cblx0X2FuaW1hdGVIb3VkaW5pKCl7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGUtaG91ZGluaS13b3JrZmxvdycsICgpID0+IHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMScpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbEJhY2tGcmFnbWVudCgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgY2FsbEJhY2tGcmFnbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXHR9XG5cblx0X3dvcmtsZXRTdGVwcygpIHtcblx0XHRsZXQgc3RlcEFuaW1hdGlvbiA9IDA7XG5cdFx0Y29uc3QgU1RFUF9BREQgPSAxO1xuXHRcdGNvbnN0IFNURVBfQUREX1dPUktLRVQgPSAyO1xuXHRcdGNvbnN0IFNURVBfTE9BRCA9IDM7XG5cdFx0Y29uc3QgU1RFUF9SRU5ERVIgPSA0O1xuXHRcdGNvbnN0IFNURVBfQ0FMTCA9IDU7XG5cdFx0Y29uc3QgU1RFUF9FWEVDVVRFID0gNjtcblxuXHRcdGZ1bmN0aW9uIGZyYWdtZW50QW5pbWF0aW9uKCl7XG5cdFx0XHRzdGVwQW5pbWF0aW9uKys7XG5cdFx0XHRzd2l0Y2goc3RlcEFuaW1hdGlvbil7XG5cdFx0XHRcdGNhc2UoU1RFUF9BREQpOntcblx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtMScpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlKFNURVBfQUREX1dPUktLRVQpOntcblx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtMicpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlKFNURVBfTE9BRCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0zJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9SRU5ERVIpOntcblx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtNCcpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlKFNURVBfQ0FMTCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC01JykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9FWEVDVVRFKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTYnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCd3b3JrbGV0LXN0ZXBzJywgKCk9Pntcblx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnJhZ21lbnRBbmltYXRpb24pO1xuXHRcdFx0c3RlcEFuaW1hdGlvbiA9IDA7XG5cblx0XHRcdGZ1bmN0aW9uIGNsZWFyQW5pbSgpe1xuXHRcdFx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGZyYWdtZW50QW5pbWF0aW9uKTtcblx0XHRcdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIGNsZWFyQW5pbSk7XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0xJykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtMicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTMnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC00JykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtNScpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTYnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cblx0XHRcdH1cblxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xuXHRcdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcblx0XHRcdH0sMTAwKTtcblx0XHR9KTtcblxuXHR9XG59IiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHtcbiAgICBBcHBseUNzc1xufSBmcm9tICcuL2hlbHBlci9hcHBseUNzcy5qcyc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q29kZU1pcm9yXG59IGZyb20gJy4vaGVscGVyL2FwcGx5SnMuanMnO1xuaW1wb3J0IHtBbmltYXRpb25IZWFkZXJ9IGZyb20gJy4vaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzJ1xuXG5leHBvcnQgY2xhc3MgRGVtb3Mge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9UeXBlT00oKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9QYWludEFwaSgpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpSnNJbkNzcygpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1Byb3BlcnRpZXNBbmRWYWx1ZXMoKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRGVtb0xvYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25EZW1vU3RhdGUnLCAoKSA9PntcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uRGVtb0xvYWQpe1xuICAgICAgICAgICAgICAgICAgICBuZXcgQW5pbWF0aW9uSGVhZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMubGF5b3V0RGVtb0xvYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9MYXlvdXRBcGkoKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2RlbW9UeXBlT00oKSB7XG4gICAgICAgIGlmICghd2luZG93LkNTU1RyYW5zZm9ybVZhbHVlKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSAvL25ldyBDU1NUcmFuc2Zvcm1WYWx1ZShbXG4gICAgICAgICAgICBuZXcgQ1NTUm90YXRlKDAsMCwxLCBDU1MuZGVnKDApKVxuICAgICAgICAvL10pO1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlRGVtbycpO1xuICAgICAgICBzcXVhcmUuYXR0cmlidXRlU3R5bGVNYXAuc2V0KCd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pO1xuICAgICAgICBsZXQgcmFmSWQ7XG4gICAgICAgIGxldCBzdG9wQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICAgIGZ1bmN0aW9uIGRyYXcoKXtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5hbmdsZS52YWx1ZSA9ICh0cmFuc2Zvcm0uYW5nbGUudmFsdWUgKyA1KSAlIDM2MDtcbiAgICAgICAgICAgIHNxdWFyZS5hdHRyaWJ1dGVTdHlsZU1hcC5zZXQoJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgICAgICAgfVxuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IGRyYXcoKSk7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpKTtcbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhcigpIHtcbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcycpLFxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudCBoMntcbiAgICAtLWEtc3VwZXItdmFyOiAjRkZGO1xufVxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XG5cbn1cbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xuXG59YFxuICAgICAgICApO1xuICAgIH1cblxuXG4gICAgX2ZyYW1lSW5jcmVtZW50KCl7XG4gICAgICAgIGlmICh0aGlzLmZyYW1lID09PSA5KSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUrKztcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9pc2UnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1mcmFtZScsIHRoaXMuZnJhbWUpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZnJhbWVJbmNyZW1lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX2RlbW9Qcm9wZXJ0aWVzQW5kVmFsdWVzKCkge1xuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XG4gICAgICAgICAgICBuYW1lOiAnLS1wcm9wZXJ0aWVzLW1vdmUtcmVnaXN0ZXInLFxuICAgICAgICAgICAgc3ludGF4OiAnPGxlbmd0aD4nLFxuICAgICAgICAgICAgaW5oZXJpdHM6IGZhbHNlLFxuICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiAnMHB4JyxcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG4tc3F1YXJlLXByb3BlcnRpZXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QuYWRkKCdtb3ZlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnRuLXNxdWFyZS1uby1wcm9wZXJ0aWVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1uby1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LnJlbW92ZSgnbW92ZScpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1uby1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LmFkZCgnbW92ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVtb1BhaW50QXBpKCkge1xuICAgICAgICBpZiAoISdwYWludFdvcmtsZXQnIGluIENTUyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLXdvcmtsZXQuanMnKTtcblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGktY3NzJyksXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50LXBhaW50LWFwaSB7XG4gICAgLS1jaXJjbGUtY29sb3I6IGJsYWNrO1xuICAgIC0td2lkdGgtY2lyY2xlOiAxMDBweDtcbiAgICB3aWR0aDogdmFyKC0td2lkdGgtY2lyY2xlKTtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBwYWludChjaXJjbGUsIDBweCwgcmVkKTtcbn1cbi5yZXZlYWwgc2VjdGlvbi5wYXJlbnQtZGVtby1wYWludC5jYWRyZXtcbiAgICAtLWNhZHJlLWNvbG9yOmJsYWNrO1xufWBcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpJyksXG4gICAgICAgICAgICAnamF2YXNjcmlwdCcsXG4gICAgICAgICAgICBgcGFpbnQoY3R4LCBnZW9tLCBwcm9wZXJ0aWVzLCBhcmdzKSB7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1cy5cbiAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1pbihnZW9tLndpZHRoIC8gMiwgZ2VvbS5oZWlnaHQgLyAyKTtcbiAgICBjb25zdCBib3JkZXIgPSBhcmdzWzBdLnZhbHVlO1xuICAgIC8vIENoYW5nZSB0aGUgYm9yZGVyIGNvbG9yLlxuICAgIGN0eC5maWxsU3R5bGUgPSBhcmdzWzFdLnRvU3RyaW5nKCk7XG4gICAgY3R4LmFyYyhnZW9tLndpZHRoIC0gYm9yZGVyIC8gMiwgZ2VvbS5oZWlnaHQgLSAgLSBib3JkZXIgLyAyLCByYWRpdXMgLSBib3JkZXIsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAvLyBDaGFuZ2UgdGhlIGZpbGwgY29sb3IuXG4gICAgY29uc3QgY29sb3IgPSBwcm9wZXJ0aWVzLmdldCgnLS1jaXJjbGUtY29sb3InKS50b1N0cmluZygpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguYXJjKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIsIHJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xufWApO1xuICAgIH1cblxuICAgIF9kZW1vUGFpbnRBcGlKc0luQ3NzKCkge1xuICAgICAgICBpZiAoISdwYWludFdvcmtsZXQnIGluIENTUyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLWZyb20tY3NzLXdvcmtsZXQuanMnKTtcblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGktanMtaW4tY3NzJyksXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50LXBhaW50LWFwaS1qcy1pbi1jc3Mge1xuICAgIC0tY2lyY2xlLWNvbG9yOiBibGFjaztcbiAgICAtLXdpZHRoLWNpcmNsZTogMTAwcHg7XG4gICAgd2lkdGg6IHZhcigtLXdpZHRoLWNpcmNsZSk7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogcGFpbnQoY2lyY2xlLWZyb20tY3NzKTtcbiAgICAtLWNpcmNsZS1qcy1pbi1jc3M6IChjdHgsIGdlb20pID0+IHtcbiAgICAgICAgY29uc3QgY29sb3IgPSBcXGB2YXIoLS1jaXJjbGUtY29sb3IpXFxgO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIGNvbnN0IHggPSBnZW9tLndpZHRoIC8gMjtcbiAgICAgICAgY29uc3QgeSA9IGdlb20uaGVpZ2h0IC8gMjtcbiAgICAgICAgbGV0IHJhZGl1cyA9IE1hdGgubWluKHgsIHkpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG59YCxcbnRydWUpO1xuICAgIH1cblxuICAgIF9kZW1vTGF5b3V0QXBpKCl7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNkZW1vTGF5b3V0V29ya2xldCBkaXYnKS5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgdCA9IGVsZW0udGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAvLyBDdXQgb3V0IGEgcmFuZG9tIGFtb3VudCBvZiB0ZXh0LCBidXQga2VlcCBhdCBsZWFzdCAxMCBjaGFyYWN0ZXJzXG4gICAgICAgICAgICBlbGVtLnRleHRDb250ZW50ID0gdC5zbGljZSgwLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodC5sZW5ndGggLSAxMCkgKyAxMCkpO1xuICAgICAgICB9KVxuICAgICAgICBDU1MubGF5b3V0V29ya2xldC5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL21hc29ucnktd29ya2xldC5qcycpO1xuXG4gICAgICAgIGxldCBjb2xzID0gMztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5QnRuTWludXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBjb2xzID0gTWF0aC5tYXgoMywgY29scyAtIDEpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5Q29scycpLmlubmVySFRNTCA9IGNvbHM7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0xheW91dFdvcmtsZXQnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1tYXNvbnJ5LWNvbHVtbnMnLCBjb2xzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTWFzb25yeUJ0blBsdXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBjb2xzID0gTWF0aC5taW4oOCwgY29scyArIDEpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5Q29scycpLmlubmVySFRNTCA9IGNvbHM7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0xheW91dFdvcmtsZXQnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1tYXNvbnJ5LWNvbHVtbnMnLCBjb2xzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59IiwiJ3VzZSBzdGljdCdcblxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBub1RyaW1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50LCBub1RyaW0gPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBjb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnaWRlYSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdGhpcy5zdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcbiAgICAgICAgdGhpcy5ub1RyaW0gPSBub1RyaW07XG5cbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xuXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3MoY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xuICAgIH1cblxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5kZWxldGVSdWxlKDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcbiAgICAgICAgaWYgKCF0aGlzLm5vVHJpbSl7XG4gICAgICAgICAgICB2YWx1ZS5zcGxpdCgnfScpXG4gICAgICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChzZWxlY3RvckNzcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYkVsdHMrKztcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ2lkZWEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcbiAgICB9XG5cbn0iLCIndXNlIHN0cmljdCdcblxuY29uc3QgTUlOX1RPUCA9ICcxMDBweCc7XG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE0ZW0nO1xuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBrZXlFbHQsXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcbiAgICB9KSB7XG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQubGluZUhlaWdodCA9IExJTkVfSEVJR0hUO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcbiAgICAgICAgICAgIHR5cGU6IFwiaW5pdFwiLFxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcbiAgICAgICAgfSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcblxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vICBUWXBlZCBPTSBOZXcgUG9zc2liaWxpdGllc1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLW5ldycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDExLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgVHlwZWQgT00gTmV3IEFwaVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0eXBlZG9tLWFwaScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDQsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8gIFR5cGVkIE9NIENvbnZlcnNpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS1jb252ZXJzaW9uJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBUeXBlZCBPTSBUcmFuc2Zvcm1cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS10cmFuc2Zvcm0nLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ1NTIEN1c3RvbSBQcm9wZXJ0aWVzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy1wcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ1NTIFByb3BlcnRpZXMgJiBWYWx1ZXMgVHlwZXNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncHJvcGVydGllc3ZhbHVlcy10eXBlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDcsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBhaW50IEFwaVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwYWludC1hcGknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDYsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFuaW1hdG9yIERlY2xhcmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2FuaW1hdG9yLWRlY2xhcmF0aW9uJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8gQW5pbWF0b3IgVGltZUxpbmUgJiBSZWdpc3RlclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdhbmltYXRvci10aW1lbGluZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3BNYXJnaW46ICcxMTVweCcsXG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3BNYXJnaW46ICcxMTVweCcsXG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFuaW1hdG9yIEVmZmVjdHNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnYW5pbWF0b3ItZWZmZWN0cycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc3MDBweCdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFuaW1hdG9yIEludm9rZVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdhbmltYXRvci1pbnZva2UnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExheW91dCBBcGlcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnbGF5b3V0LWFwaScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTGF5b3V0IEludHJpbnNpYyBjYWxjXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2xheW91dC1pbnRyaW5zaWMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMYXlvdXQgcG9zaXRpb24gZnJhZ21lbnRzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2xheW91dC1wb3NpdGlvbicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUGFyc2VyIEFwaVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwYXJzZXItYXBpJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDQsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuXG5cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkhlYWRlcntcblxuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpIHtcblx0XHRbJy0tYXZhdGFyLXNpemUnLCAnLS1oZWFkZXItaGVpZ2h0JywgJy0tZm9udC1iYXNlJywgJy0tYmFyLWhlaWdodCcsICctLWF2YXRhci1ib3JkZXInXVxuXHRcdCAgLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XG5cdFx0XHQgIG5hbWUsXG5cdFx0XHQgIHN5bnRheDogJzxsZW5ndGg+Jyxcblx0XHRcdCAgaW5pdGlhbFZhbHVlOiAnMHB4Jyxcblx0XHRcdCAgaW5oZXJpdHM6IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0bGV0IGFuaW1hdGlvbldvcmtsZXQgPSB3aW5kb3cuYW5pbWF0aW9uV29ya2xldDtcblx0XHRpZiAoQ1NTKVxuXHRcdFx0YW5pbWF0aW9uV29ya2xldCA9IENTUy5hbmltYXRpb25Xb3JrbGV0O1xuXG5cdFx0dGhpcy5zaXplcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCcpLmNvbXB1dGVkU3R5bGVNYXAoKTtcblx0XHR0aGlzLnNjcm9sbFNvdXJjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCcpO1xuXHRcdHRoaXMuYXZhdGFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0IC5hdmF0YXInKTtcblx0XHR0aGlzLmJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCAuYmFyJyk7XG5cdFx0dGhpcy5tYXhUaW1lID0gMTAwMDtcblx0XHR0aGlzLmVwc2lsb24gPSAxZS0yO1xuXHRcdHRoaXMuc2Nyb2xsVGltZWxpbmUgPSBuZXcgU2Nyb2xsVGltZWxpbmUoe1xuXHRcdFx0c2Nyb2xsU291cmNlOiB0aGlzLnNjcm9sbFNvdXJjZSxcblx0XHRcdG9yaWVudGF0aW9uOiAnYmxvY2snLFxuXHRcdFx0dGltZVJhbmdlOiB0aGlzLm1heFRpbWUsXG5cdFx0fSk7XG5cdFx0dHJ5e1xuXG5cblx0XHRcdGF3YWl0IGFuaW1hdGlvbldvcmtsZXQuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9hbmltYXRvci1oZWFkZXIuanMnKTtcblxuXHRcdFx0dGhpcy5pbml0QXZhdGFyRWZmZWN0KCk7XG5cdFx0XHR0aGlzLmluaXRCYXJFZmZlY3QoKTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgXyA9PiB0aGlzLnVwZGF0ZSgpKTtcblx0XHR9Y2F0Y2goZSl7XG5cdFx0XHRjb25zb2xlLmxvZygnV2lsbCBVc2UgUG9seWZpbGwgOlxcJygnKTtcblx0XHR9XG5cblx0XHQvKiBjcmJ1Zyg4MjQ3ODIpOiBkZWxheSBpcyBub3Qgd29ya2luZyBhcyBleHBlY3RlZCBpbiB3b3JrbGV0LCBpbnN0ZWFkIGhlcmUgd2UgY29tYmluZVxuXHRcdCAgIHdoYXQgd291bGQgaGF2ZSBiZWVuIGEgZGVsYXllZCBhbmltYXRpb24gd2l0aCB0aGUgb3RoZXIgYXZhdGFyIGFuaW1hdGlvbiBidXQgc3RhcnRcblx0XHQgICBpdCBhdCBhIGRpZmZlcmVudCBvZmZzZXQuXG5cdFx0Ki9cblx0XHQgIG5ldyBXb3JrbGV0QW5pbWF0aW9uKCd0d2l0dGVyLWhlYWRlcicsXG5cdFx0XHRbXG5cdFx0XHQgIG5ldyBLZXlmcmFtZUVmZmVjdChhdmF0YXIsIFtcblx0XHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoMHB4KWB9LFxuXHRcdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3Njcm9sbEhlaWdodCAtIGNsaWVudEhlaWdodH1weClgfSxcblx0XHRcdCAgXSwge1xuXHRcdFx0XHRkZWxheTogYXZhdGFyU2Nyb2xsRW5kUG9zL3Njcm9sbEhlaWdodCAqIG1heFRpbWUsXG5cdFx0XHRcdGR1cmF0aW9uOiAoc2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0KS9zY3JvbGxIZWlnaHQgKiBtYXhUaW1lLFxuXHRcdFx0XHRmaWxsOiAnYm90aCcsXG5cdFx0XHQgIH0pLFxuXHRcdFx0XSxcblx0XHRcdHNjcm9sbFRpbWVsaW5lLFxuXHRcdFx0e31cblx0XHQgICkucGxheSgpO1xuXHRcdC8qKi9cblx0fVxuXG5cdHVwZGF0ZSgpIHtcblx0XHRjb25zdCBjbGllbnRIZWlnaHQgPSB0aGlzLnNjcm9sbFNvdXJjZS5jbGllbnRIZWlnaHQ7XG5cdFx0Y29uc3Qgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5zY3JvbGxTb3VyY2Uuc2Nyb2xsSGVpZ2h0O1xuXHRcdGNvbnN0IG1heFNjcm9sbCA9IHNjcm9sbEhlaWdodCAtIGNsaWVudEhlaWdodDtcblx0XHRjb25zb2xlLmxvZyhjbGllbnRIZWlnaHQsIHNjcm9sbEhlaWdodCwgbWF4U2Nyb2xsKTtcblx0XHRjb25zdCBhdmF0YXJUYXJnZXRTY2FsZSA9IHRoaXMuc2l6ZXMuZ2V0KCctLWJhci1oZWlnaHQnKS52YWx1ZSAvICh0aGlzLnNpemVzLmdldCgnLS1hdmF0YXItc2l6ZScpLnZhbHVlICsgMiAqIHRoaXMuc2l6ZXMuZ2V0KCctLWF2YXRhci1ib3JkZXInKS52YWx1ZSk7XG5cdFx0Y29uc3QgYXZhdGFyU2Nyb2xsRW5kUG9zID0gKHRoaXMuc2l6ZXMuZ2V0KCctLWhlYWRlci1oZWlnaHQnKS52YWx1ZS8yIC0gdGhpcy5zaXplcy5nZXQoJy0tYXZhdGFyLXNpemUnKS52YWx1ZS8yIC0gdGhpcy5zaXplcy5nZXQoJy0tYXZhdGFyLWJvcmRlcicpLnZhbHVlKTtcblx0XHRjb25zdCBhdmF0YXJUYXJnZXRUcmFuc2xhdGUgPSBtYXhTY3JvbGwgLSBhdmF0YXJTY3JvbGxFbmRQb3M7XG5cdFx0Ly8gU3RvcCBzY2FsaW5nIGF0IHRoaXMgb2Zmc2V0IGFuZCBzdGFydCB0cmFuc2Zvcm0uXG5cdFx0Y29uc3QgYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0ID0gYXZhdGFyU2Nyb2xsRW5kUG9zIC8gbWF4U2Nyb2xsO1xuXG5cdFx0Y29uc3QgYWVrZiA9IHRoaXMuYXZhdGFyRWZmZWN0LmdldEtleWZyYW1lcygpO1xuXHRcdGFla2ZbMV0udHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoMHB4KSBzY2FsZSgke2F2YXRhclRhcmdldFNjYWxlfSlgO1xuXHRcdGFla2ZbMV0ub2Zmc2V0ID0gYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0O1xuXHRcdGFla2ZbMl0udHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHthdmF0YXJUYXJnZXRUcmFuc2xhdGV9cHgpIHNjYWxlKCR7YXZhdGFyVGFyZ2V0U2NhbGV9KWA7XG5cdFx0dGhpcy5hdmF0YXJFZmZlY3Quc2V0S2V5ZnJhbWVzKGFla2YpO1xuXG5cdFx0Y29uc3QgYmVrZiA9IHRoaXMuYmFyRWZmZWN0LmdldEtleWZyYW1lcygpO1xuXHRcdGJla2ZbMV0ub2Zmc2V0ID0gYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0O1xuXHRcdHRoaXMuYmFyRWZmZWN0LnNldEtleWZyYW1lcyhiZWtmKTtcblx0fVxuXG5cdGluaXRBdmF0YXJFZmZlY3QoKSB7XG5cdFx0dGhpcy5hdmF0YXJFZmZlY3QgPSBuZXcgS2V5ZnJhbWVFZmZlY3QodGhpcy5hdmF0YXIsIFtcblx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoMSlgLCBlYXNpbmc6ICdlYXNlLWluLW91dCcsIG9mZnNldDogMH0sXG5cdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgwcHgpIHNjYWxlKCR7MC8qYXZhdGFyVGFyZ2V0U2NhbGUqL30pYCwgZWFzaW5nOiAnbGluZWFyJywgb2Zmc2V0OiAwIC8qYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0Ki99LFxuXHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoJHswLyphdmF0YXJUYXJnZXRUcmFuc2xhdGUqL31weCkgc2NhbGUoJHswLyphdmF0YXJUYXJnZXRTY2FsZSovfSlgLCBvZmZzZXQ6IDF9LFxuXHRcdF0sIHtcblx0XHRcdGR1cmF0aW9uOiB0aGlzLm1heFRpbWUgKyB0aGlzLmVwc2lsb24sXG5cdFx0XHRmaWxsOiAnYm90aCcsXG5cdFx0XHRpdGVyYXRpb25zOiBJbmZpbml0eSxcblx0XHR9KTtcblxuXHRcdG5ldyBXb3JrbGV0QW5pbWF0aW9uKCdhbmltYXRvci1oZWFkZXInLFxuXHRcdFx0dGhpcy5hdmF0YXJFZmZlY3QsXG5cdFx0XHR0aGlzLnNjcm9sbFRpbWVsaW5lLFxuXHRcdFx0W11cblx0XHQpLnBsYXkoKTtcblx0fVxuXG5cdGluaXRCYXJFZmZlY3QoKSB7XG5cdFx0dGhpcy5iYXJFZmZlY3QgPSBuZXcgS2V5ZnJhbWVFZmZlY3QoXG5cdFx0XHR0aGlzLmJhcixcblx0XHRcdFtcblx0XHRcdHtvcGFjaXR5OiAwLCBvZmZzZXQ6IDB9LFxuXHRcdFx0e29wYWNpdHk6IDEsIG9mZnNldDogMCAvKmF2YXRhclNjcm9sbEVuZE9mZnNldCovfSxcblx0XHRcdHtvcGFjaXR5OiAxLCBvZmZzZXQ6IDF9XG5cdFx0XHRdLFxuXHRcdFx0e1xuXHRcdFx0ZHVyYXRpb246IHRoaXMubWF4VGltZSArIHRoaXMuZXBzaWxvbixcblx0XHRcdGZpbGw6ICdib3RoJyxcblx0XHRcdGl0ZXJhdGlvbnM6IEluZmluaXR5LFxuXHRcdFx0LyogY3JidWcoNzc5MTg5KTogVXNlIGluZmluaXR5IGl0ZXJhdGlvbiBhbmQgbWF4RHVyYXRpb24gdG8gYXZvaWQgZWZmZWN0XG5cdFx0XHRcdHByZW1hdHVyZWx5IGZpbmlzaGluZy5cblxuXHRcdFx0XHRCVFcsIFdlYiBBbmltYXRpb25zIHVzZXMgYW4gZW5kcG9pbnQtZXhjbHVzaXZlIHRpbWluZyBtb2RlbCwgd2hpY2ggbWVhblxuXHRcdFx0XHR3aGVuIHRpbWVsaW5lIGlzIGF0IFwiZHVyYXRpb25cIiB0aW1lLCBpdCBpcyBjb25zaWRlcmVkIHRvIGJlIGF0IDAgdGltZSBvZiB0aGVcblx0XHRcdFx0c2Vjb25kIGl0ZXJhdGlvbi4gVG8gYXZvaWQgdGhpcywgd2UgZW5zdXJlIG91ciBtYXggdGltZSAobWF4IHNjcm9sbCBvZmZzZXQpIG5ldmVyXG5cdFx0XHRcdHJlYWNoZXMgZHVyYXRpb24gYnkgaGF2aW5nIGR1cmF0aW9uIGFuIGVwc2lsb24gbGFyZ2VyLiAgVGhpcyBoYWNrIGlzIG5vdFxuXHRcdFx0XHRuZWVkZWQgb25jZSB3ZSBmaXggdGhlIG9yaWdpbmFsIGJ1ZyBhYm92ZS5cblx0XHRcdFx0Ki9cblx0XHRcdH1cblx0XHQpO1xuXHRcdG5ldyBXb3JrbGV0QW5pbWF0aW9uKCdhbmltYXRvci1oZWFkZXInLFxuXHRcdFx0dGhpcy5iYXJFZmZlY3QsXG5cdFx0XHR0aGlzLnNjcm9sbFRpbWVsaW5lLFxuXHRcdFx0W11cblx0XHQpLnBsYXkoKTtcblx0fVxuXG59XG5cbiIsImV4cG9ydCBjbGFzcyBOb2lzZSB7XG5cdGNvbnN0cnVjdG9yKCl7XG5cdFx0dGhpcy5jYW52YXM7XG5cdFx0dGhpcy5jdHg7XG5cdFx0dGhpcy53V2lkdGg7XG5cdFx0dGhpcy53SGVpZ2h0O1xuXHRcdHRoaXMubm9pc2VEYXRhID0gW107XG5cdFx0dGhpcy5mcmFtZSA9IDA7XG5cdFx0dGhpcy5sb29wVGltZW91dDtcblxuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0Ly8gQ3JlYXRlIE5vaXNlXG4gICAgY3JlYXRlTm9pc2UoKSB7XG4gICAgICAgIGNvbnN0IGlkYXRhID0gdGhpcy5jdHguY3JlYXRlSW1hZ2VEYXRhKHRoaXMud1dpZHRoLCB0aGlzLndIZWlnaHQpO1xuICAgICAgICBjb25zdCBidWZmZXIzMiA9IG5ldyBVaW50MzJBcnJheShpZGF0YS5kYXRhLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGxlbiA9IGJ1ZmZlcjMyLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xuICAgICAgICAgICAgICAgIGJ1ZmZlcjMyW2ldID0gMHhmZjAwMDAwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm9pc2VEYXRhLnB1c2goaWRhdGEpO1xuICAgIH07XG5cblxuICAgIC8vIFBsYXkgTm9pc2VcbiAgICBwYWludE5vaXNlKCkge1xuICAgICAgICBpZiAodGhpcy5mcmFtZSA9PT0gOSkge1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lKys7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGhpcy5ub2lzZURhdGFbdGhpcy5mcmFtZV0sIDAsIDApO1xuICAgIH07XG5cblxuICAgIC8vIExvb3BcbiAgICBsb29wKCkge1xuICAgICAgICB0aGlzLnBhaW50Tm9pc2UodGhpcy5mcmFtZSk7XG5cbiAgICAgICAgdGhpcy5sb29wVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICAgICAgICB9LCAoMTAwMCAvIDI1KSk7XG4gICAgfTtcblxuXG4gICAgLy8gU2V0dXBcbiAgICBzZXR1cCgpIHtcbiAgICAgICAgdGhpcy53V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy53SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53V2lkdGg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMud0hlaWdodDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTm9pc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9vcCgpO1xuICAgIH07XG5cblxuICAgIC8vIEluaXRcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpO1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgdGhpcy5zZXR1cCgpO1xuICAgIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRFdmVudHNcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XG5pbXBvcnQge1xuICAgIERlbW9zXG59IGZyb20gJy4vZGVtb3MuanMnO1xuaW1wb3J0IHtOb2lzZX0gZnJvbSAnLi9ob3VkaW5pL25vaXNlLmpzJztcbmltcG9ydCB7QW5pbWF0aW9uc30gZnJvbSAnLi9hbmltYXRpb25zL2FuaW0uanMnO1xuXG5cblxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcblxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgICAgY29uc3QgaW5JZnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xuXG4gICAgICAgIGlmICgncGFpbnRXb3JrbGV0JyBpbiBDU1Mpe1xuICAgICAgICAgICAgdHJ5e1xuXG4gICAgICAgICAgICAgICAgQ1NTLnJlZ2lzdGVyUHJvcGVydHkoe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnLS1jYWRyZS1jb2xvcicsXG4gICAgICAgICAgICAgICAgICAgIHN5bnRheDogJzxjb2xvcj4gfCBub25lJyxcbiAgICAgICAgICAgICAgICAgICAgaW5oZXJpdHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsVmFsdWU6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NhZHJlLXdvcmtsZXQuanMnKTtcbiAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0Vycm9yIHdpdGggY2FkcmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBuZXcgTm9pc2UoKTtcbiAgICAgICAgbmV3IEFuaW1hdGlvbnMoKTtcbiAgICAgICAgLy8gbmV3IFR5cGVUZXh0KCk7XG4gICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hZ2ljVmlkZW8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyJdfQ==
