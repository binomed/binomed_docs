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

        this.codeMirrorCss = CodeMirror(elt, {
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

        this.codeMirrorCss.setSize('100%', '100%');
        this.codeMirrorCss.on('change', function () {
            _this.applyCss(_this.codeMirrorCss.getValue());
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
			new WorkletAnimation('twitter-header', [new KeyframeEffect(this.avatar, [{ transform: 'translateY(0px)' }, { transform: 'translateY(' + (this.scrollHeight - this.clientHeight) + 'px)' }], {
				delay: this.avatarScrollEndPos / this.scrollHeight * this.maxTime,
				duration: (this.scrollHeight - this.clientHeight) / this.scrollHeight * this.maxTime,
				fill: 'both'
			})], this.scrollTimeline, {}).play();
			/**/
		}
	}, {
		key: 'update',
		value: function update() {
			this.clientHeight = this.scrollSource.clientHeight;
			this.scrollHeight = this.scrollSource.scrollHeight;
			this.maxScroll = this.scrollHeight - this.clientHeight;
			console.log(this.clientHeight, this.scrollHeight, this.maxScroll);
			this.avatarTargetScale = this.sizes.get('--bar-height').value / (this.sizes.get('--avatar-size').value + 2 * this.sizes.get('--avatar-border').value);
			this.avatarScrollEndPos = this.sizes.get('--header-height').value / 2 - this.sizes.get('--avatar-size').value / 2 - this.sizes.get('--avatar-border').value;
			this.avatarTargetTranslate = this.maxScroll - this.avatarScrollEndPos;
			// Stop scaling at this offset and start transform.
			this.avatarScrollEndOffset = this.avatarScrollEndPos / this.maxScroll;

			var aekf = this.avatarEffect.getKeyframes();
			aekf[1].transform = 'translateY(0px) scale(' + this.avatarTargetScale + ')';
			aekf[1].offset = this.avatarScrollEndOffset;
			aekf[2].transform = 'translateY(' + this.avatarTargetTranslate + 'px) scale(' + this.avatarTargetScale + ')';
			this.avatarEffect.setKeyframes(aekf);

			var bekf = this.barEffect.getKeyframes();
			bekf[1].offset = this.avatarScrollEndOffset;
			this.barEffect.setKeyframes(bekf);
		}
	}, {
		key: 'initAvatarEffect',
		value: function initAvatarEffect() {
			this.avatarEffect = new KeyframeEffect(this.avatar, [{ transform: 'translateY(0px) scale(1)', easing: 'ease-in-out', offset: 0 }, { transform: 'translateY(0px) scale(' + 0 /*this.avatarTargetScale*/ + ')', easing: 'linear', offset: 0 /*this.avatarScrollEndOffset*/ }, { transform: 'translateY(' + 0 /*this.avatarTargetTranslate*/ + 'px) scale(' + 0 /*this.avatarTargetScale*/ + ')', offset: 1 }], {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7SUFDYSxVLFdBQUEsVTtBQUNaLHVCQUFjO0FBQUE7O0FBQ2IsT0FBSyxjQUFMOztBQUVBLE9BQUssZUFBTDs7QUFFQSxPQUFLLGFBQUw7QUFDQTs7OzttQ0FFZ0I7QUFDaEIsT0FBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxPQUFNLGdCQUFnQixDQUF0QjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sZUFBZSxDQUFyQjtBQUNBLE9BQU0sY0FBYyxDQUFwQjtBQUNBLE9BQU0sYUFBYSxDQUFuQjs7QUFFQSxZQUFTLGlCQUFULEdBQTRCO0FBQzNCO0FBQ0EsWUFBTyxhQUFQO0FBQ0MsVUFBSyxhQUFMO0FBQW9CO0FBQ25CLGdCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBckMsQ0FBK0MsR0FBL0MsQ0FBbUQsTUFBbkQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLEdBQTlDLENBQWtELE1BQWxEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FBMUMsQ0FBb0QsR0FBcEQsQ0FBd0QsTUFBeEQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxZQUFMO0FBQW1CO0FBQ2xCLGdCQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDLFNBQTFDLENBQW9ELE1BQXBELENBQTJELE1BQTNEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxDQUErQyxNQUEvQyxDQUFzRCxNQUF0RDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBcEMsQ0FBOEMsTUFBOUMsQ0FBcUQsTUFBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGVBQXhCLEVBQXlDLFNBQXpDLENBQW1ELEdBQW5ELENBQXVELFNBQXZEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUFwQyxDQUE4QyxHQUE5QyxDQUFrRCxTQUFsRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsR0FBakQsQ0FBcUQsU0FBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQXZDLENBQWlELEdBQWpELENBQXFELFNBQXJEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsU0FBM0MsQ0FBcUQsR0FBckQsQ0FBeUQsU0FBekQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxZQUFMO0FBQW1CO0FBQ2xCLGdCQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsU0FBMUQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLE1BQTlDLENBQXFELFNBQXJEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxTQUF4RDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsTUFBakQsQ0FBd0QsU0FBeEQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGlCQUF4QixFQUEyQyxTQUEzQyxDQUFxRCxNQUFyRCxDQUE0RCxTQUE1RDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsR0FBakQsQ0FBcUQsUUFBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLFNBQXZDLENBQWlELEdBQWpELENBQXFELFFBQXJEO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsU0FBM0MsQ0FBcUQsR0FBckQsQ0FBeUQsUUFBekQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxHQUF4RCxDQUE0RCxRQUE1RDtBQUNBO0FBQ0E7QUFDRCxVQUFLLFdBQUw7QUFBa0I7QUFDakIsZ0JBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsU0FBOUMsQ0FBd0QsTUFBeEQsQ0FBK0QsUUFBL0Q7QUFDQSxnQkFBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDLFNBQXhDLENBQWtELEdBQWxELENBQXNELGVBQXREO0FBQ0EsZ0JBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsU0FBOUMsQ0FBd0QsR0FBeEQsQ0FBNEQsZUFBNUQ7QUFDQTtBQUNBO0FBQ0QsVUFBSyxVQUFMO0FBQWlCO0FBQ2hCLGdCQUFTLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0MsU0FBeEMsQ0FBa0QsTUFBbEQsQ0FBeUQsZUFBekQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxNQUF4RCxDQUErRCxlQUEvRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsR0FBakQsQ0FBcUQsY0FBckQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxHQUF4RCxDQUE0RCxjQUE1RDtBQUNBO0FBQ0E7QUExQ0Y7QUE0Q0E7O0FBRUQsVUFBTyxnQkFBUCxDQUF3QixnQkFBeEIsRUFBMEMsWUFBSTtBQUM3QyxXQUFPLGdCQUFQLENBQXdCLGVBQXhCLEVBQXlDLGlCQUF6QztBQUNBLG9CQUFnQixDQUFoQjs7QUFFQSxhQUFTLFNBQVQsR0FBb0I7QUFDbkIsWUFBTyxtQkFBUCxDQUEyQixlQUEzQixFQUE0QyxpQkFBNUM7QUFDQSxZQUFPLG1CQUFQLENBQTJCLGNBQTNCLEVBQTJDLFNBQTNDO0FBQ0EsY0FBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLFNBQXJDLENBQStDLE1BQS9DLENBQXNELE1BQXREO0FBQ0EsY0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLENBQThDLE1BQTlDLENBQXFELE1BQXJEO0FBQ0EsY0FBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxTQUExQyxDQUFvRCxNQUFwRCxDQUEyRCxNQUEzRDtBQUNBLGNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxTQUF4RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixVQUF4QixFQUFvQyxTQUFwQyxDQUE4QyxNQUE5QyxDQUFxRCxTQUFyRDtBQUNBLGNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxTQUF4RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsU0FBM0MsQ0FBcUQsTUFBckQsQ0FBNEQsU0FBNUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsU0FBMUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsU0FBMUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsTUFBakQsQ0FBd0QsUUFBeEQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDLFNBQTNDLENBQXFELE1BQXJELENBQTRELFFBQTVEO0FBQ0EsY0FBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxTQUE5QyxDQUF3RCxNQUF4RCxDQUErRCxRQUEvRDtBQUNBLGNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxDQUFpRCxNQUFqRCxDQUF3RCxRQUF4RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixjQUF4QixFQUF3QyxTQUF4QyxDQUFrRCxNQUFsRCxDQUF5RCxlQUF6RDtBQUNBLGNBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsU0FBOUMsQ0FBd0QsTUFBeEQsQ0FBK0QsZUFBL0Q7QUFDQSxjQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsU0FBdkMsQ0FBaUQsTUFBakQsQ0FBd0QsY0FBeEQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLFNBQTlDLENBQXdELE1BQXhELENBQStELGNBQS9EO0FBQ0E7O0FBRUQsZUFBVyxZQUFJO0FBQ2QsWUFBTyxnQkFBUCxDQUF3QixjQUF4QixFQUF3QyxTQUF4QztBQUNBLEtBRkQsRUFFRSxHQUZGO0FBR0EsSUE3QkQ7QUErQkE7OztvQ0FFZ0I7O0FBRVYsVUFBTyxnQkFBUCxDQUF3QiwwQkFBeEIsRUFBb0QsWUFBTTs7QUFFdEQsYUFBUyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxLQUE5QyxDQUFvRCxPQUFwRCxHQUE4RCxFQUE5RDtBQUNBLGFBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsS0FBOUMsQ0FBb0QsT0FBcEQsR0FBOEQsTUFBOUQ7QUFDQSxXQUFPLGdCQUFQLENBQXdCLGVBQXhCLEVBQXlDLGdCQUF6Qzs7QUFFQSxhQUFTLGdCQUFULEdBQTRCO0FBQ3hCLGNBQVMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsS0FBOUMsQ0FBb0QsT0FBcEQsR0FBOEQsTUFBOUQ7QUFDQSxjQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDLEtBQTlDLENBQW9ELE9BQXBELEdBQThELEVBQTlEO0FBQ0EsWUFBTyxtQkFBUCxDQUEyQixlQUEzQixFQUE0QyxnQkFBNUM7QUFDSDtBQUNKLElBWEQ7QUFZTjs7O2tDQUVlO0FBQ2YsT0FBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxPQUFNLFdBQVcsQ0FBakI7QUFDQSxPQUFNLG1CQUFtQixDQUF6QjtBQUNBLE9BQU0sWUFBWSxDQUFsQjtBQUNBLE9BQU0sY0FBYyxDQUFwQjtBQUNBLE9BQU0sWUFBWSxDQUFsQjtBQUNBLE9BQU0sZUFBZSxDQUFyQjs7QUFFQSxZQUFTLGlCQUFULEdBQTRCO0FBQzNCO0FBQ0EsWUFBTyxhQUFQO0FBQ0MsVUFBSyxRQUFMO0FBQWU7QUFDZCxnQkFBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxHQUFyRSxDQUF5RSxNQUF6RTtBQUNBO0FBQ0E7QUFDRCxVQUFLLGdCQUFMO0FBQXVCO0FBQ3RCLGdCQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLEdBQXJFLENBQXlFLE1BQXpFO0FBQ0E7QUFDQTtBQUNELFVBQUssU0FBTDtBQUFnQjtBQUNmLGdCQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLEdBQXJFLENBQXlFLE1BQXpFO0FBQ0E7QUFDQTtBQUNELFVBQUssV0FBTDtBQUFrQjtBQUNqQixnQkFBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxHQUFyRSxDQUF5RSxNQUF6RTtBQUNBO0FBQ0E7QUFDRCxVQUFLLFNBQUw7QUFBZ0I7QUFDZixnQkFBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxHQUFyRSxDQUF5RSxNQUF6RTtBQUNBO0FBQ0E7QUFDRCxVQUFLLFlBQUw7QUFBbUI7QUFDbEIsZ0JBQVMsYUFBVCxDQUF1QixrQ0FBdkIsRUFBMkQsU0FBM0QsQ0FBcUUsR0FBckUsQ0FBeUUsTUFBekU7QUFDQTtBQUNBOztBQXhCRjtBQTJCQTs7QUFFRCxVQUFPLGdCQUFQLENBQXdCLGVBQXhCLEVBQXlDLFlBQUk7QUFDNUMsV0FBTyxnQkFBUCxDQUF3QixlQUF4QixFQUF5QyxpQkFBekM7QUFDQSxvQkFBZ0IsQ0FBaEI7O0FBRUEsYUFBUyxTQUFULEdBQW9CO0FBQ25CLFlBQU8sbUJBQVAsQ0FBMkIsZUFBM0IsRUFBNEMsaUJBQTVDO0FBQ0EsWUFBTyxtQkFBUCxDQUEyQixjQUEzQixFQUEyQyxTQUEzQztBQUNBLGNBQVMsYUFBVCxDQUF1QixrQ0FBdkIsRUFBMkQsU0FBM0QsQ0FBcUUsTUFBckUsQ0FBNEUsTUFBNUU7QUFDQSxjQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLE1BQXJFLENBQTRFLE1BQTVFO0FBQ0EsY0FBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxNQUFyRSxDQUE0RSxNQUE1RTtBQUNBLGNBQVMsYUFBVCxDQUF1QixrQ0FBdkIsRUFBMkQsU0FBM0QsQ0FBcUUsTUFBckUsQ0FBNEUsTUFBNUU7QUFDQSxjQUFTLGFBQVQsQ0FBdUIsa0NBQXZCLEVBQTJELFNBQTNELENBQXFFLE1BQXJFLENBQTRFLE1BQTVFO0FBQ0EsY0FBUyxhQUFULENBQXVCLGtDQUF2QixFQUEyRCxTQUEzRCxDQUFxRSxNQUFyRSxDQUE0RSxNQUE1RTtBQUVBOztBQUVELGVBQVcsWUFBSTtBQUNkLFlBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsU0FBeEM7QUFDQSxLQUZELEVBRUUsR0FGRjtBQUdBLElBbkJEO0FBcUJBOzs7Ozs7O0FDaExGOzs7Ozs7Ozs7QUFDQTs7QUFHQTs7QUFHQTs7OztJQUVhLEssV0FBQSxLO0FBRVQscUJBQWM7QUFBQTs7QUFBQTs7QUFDVixZQUFJOztBQUVBLGlCQUFLLFdBQUw7QUFDQSxpQkFBSyxhQUFMO0FBQ0EsaUJBQUssb0JBQUw7QUFDQSxpQkFBSyxXQUFMO0FBQ0EsaUJBQUssd0JBQUw7QUFDQSxpQkFBSyxpQkFBTCxHQUF5QixLQUF6QjtBQUNBLG1CQUFPLGdCQUFQLENBQXdCLG9CQUF4QixFQUE4QyxZQUFLO0FBQy9DLG9CQUFJLENBQUMsTUFBSyxpQkFBVixFQUE0QjtBQUN4Qix3QkFBSSxnQ0FBSjtBQUNIO0FBQ0osYUFKRDtBQUtBLGlCQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxpQkFBSyxjQUFMO0FBQ0EsaUJBQUssS0FBTCxHQUFhLENBQWI7QUFFSCxTQWpCRCxDQWlCRSxPQUFPLEtBQVAsRUFBYztBQUNaLG9CQUFRLEtBQVIsQ0FBYyxLQUFkO0FBQ0g7QUFFSjs7OztzQ0FFYTtBQUNWLGdCQUFJLENBQUMsT0FBTyxpQkFBWixFQUE4QjtBQUMxQjtBQUNIO0FBQ0QsZ0JBQU0sWUFBWTtBQUNkLGdCQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWdCLENBQWhCLEVBQWtCLENBQWxCLEVBQXFCLElBQUksR0FBSixDQUFRLENBQVIsQ0FBckIsQ0FESjtBQUVBO0FBQ0EsZ0JBQU0sU0FBUyxTQUFTLGFBQVQsQ0FBdUIsYUFBdkIsQ0FBZjtBQUNBLG1CQUFPLGlCQUFQLENBQXlCLEdBQXpCLENBQTZCLFdBQTdCLEVBQTBDLFNBQTFDO0FBQ0EsZ0JBQUksY0FBSjtBQUNBLGdCQUFJLGdCQUFnQixLQUFwQjtBQUNBLHFCQUFTLElBQVQsR0FBZTtBQUNYLDBCQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsQ0FBQyxVQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsQ0FBekIsSUFBOEIsR0FBdEQ7QUFDQSx1QkFBTyxpQkFBUCxDQUF5QixHQUF6QixDQUE2QixXQUE3QixFQUEwQyxTQUExQztBQUNBLHdCQUFRLHNCQUFzQixJQUF0QixDQUFSO0FBQ0g7QUFDRCxtQkFBTyxnQkFBUCxDQUF3QixZQUF4QixFQUFzQztBQUFBLHVCQUFNLE1BQU47QUFBQSxhQUF0QztBQUNBLG1CQUFPLGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDO0FBQUEsdUJBQU0scUJBQXFCLEtBQXJCLENBQU47QUFBQSxhQUF0QztBQUNIOzs7c0NBRWE7QUFDVjtBQUNBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQURKO0FBWUg7OzswQ0FHZ0I7QUFDYixnQkFBSSxLQUFLLEtBQUwsS0FBZSxDQUFuQixFQUFzQjtBQUNsQixxQkFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLLEtBQUw7QUFDSDtBQUNELHFCQUFTLGNBQVQsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBakMsQ0FBdUMsV0FBdkMsQ0FBbUQsU0FBbkQsRUFBOEQsS0FBSyxLQUFuRTtBQUNBLGtDQUFzQixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdEI7QUFDSDs7O21EQUUwQjtBQUN2QixnQkFBSSxnQkFBSixDQUFxQjtBQUNqQixzQkFBTSw0QkFEVztBQUVqQix3QkFBUSxVQUZTO0FBR2pCLDBCQUFVLEtBSE87QUFJakIsOEJBQWM7QUFKRyxhQUFyQjtBQU1BLHFCQUFTLGFBQVQsQ0FBdUIsd0JBQXZCLEVBQWlELGdCQUFqRCxDQUFrRSxPQUFsRSxFQUEyRSxZQUFJO0FBQzNFLHlCQUFTLGFBQVQsQ0FBdUIsb0JBQXZCLEVBQTZDLFNBQTdDLENBQXVELE1BQXZELENBQThELE1BQTlEO0FBQ0EseUJBQVMsYUFBVCxDQUF1QixvQkFBdkIsRUFBNkMsU0FBN0MsQ0FBdUQsR0FBdkQsQ0FBMkQsTUFBM0Q7QUFDSCxhQUhEO0FBSUEscUJBQVMsYUFBVCxDQUF1QiwyQkFBdkIsRUFBb0QsZ0JBQXBELENBQXFFLE9BQXJFLEVBQThFLFlBQUk7QUFDOUUseUJBQVMsYUFBVCxDQUF1Qix1QkFBdkIsRUFBZ0QsU0FBaEQsQ0FBMEQsTUFBMUQsQ0FBaUUsTUFBakU7QUFDQSx5QkFBUyxhQUFULENBQXVCLHVCQUF2QixFQUFnRCxTQUFoRCxDQUEwRCxHQUExRCxDQUE4RCxNQUE5RDtBQUNILGFBSEQ7QUFJSDs7O3dDQUVlO0FBQ1osZ0JBQUksQ0FBQyxjQUFELElBQW1CLEdBQXZCLEVBQTJCO0FBQ3ZCO0FBQ0g7O0FBRUQsYUFBQyxJQUFJLFlBQUosSUFBb0IsWUFBckIsRUFBbUMsU0FBbkMsQ0FBNkMscUNBQTdDOztBQUVBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLDBCQUF4QixDQURKOztBQWFBLGdCQUFJLHVCQUFKLENBQW1CLFNBQVMsY0FBVCxDQUF3QixzQkFBeEIsQ0FBbkIsRUFDSSxZQURKO0FBY0g7OzsrQ0FFc0I7QUFDbkIsZ0JBQUksQ0FBQyxjQUFELElBQW1CLEdBQXZCLEVBQTJCO0FBQ3ZCO0FBQ0g7O0FBRUQsYUFBQyxJQUFJLFlBQUosSUFBb0IsWUFBckIsRUFBbUMsU0FBbkMsQ0FBNkMsOENBQTdDOztBQUVBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLGdDQUF4QixDQURKLGlpQkFtQlIsSUFuQlE7QUFvQkg7Ozt5Q0FFZTtBQUNaLHFCQUFTLGdCQUFULENBQTBCLHdCQUExQixFQUFvRCxPQUFwRCxDQUE0RCxnQkFBUTtBQUNoRSxvQkFBTSxJQUFJLEtBQUssV0FBZjtBQUNBO0FBQ0EscUJBQUssV0FBTCxHQUFtQixFQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLE1BQWlCLEVBQUUsTUFBRixHQUFXLEVBQTVCLElBQWtDLEVBQTdDLENBQVgsQ0FBbkI7QUFDSCxhQUpEO0FBS0EsZ0JBQUksYUFBSixDQUFrQixTQUFsQixDQUE0QixzQ0FBNUI7O0FBRUEsZ0JBQUksT0FBTyxDQUFYO0FBQ0EscUJBQVMsYUFBVCxDQUF1QixzQkFBdkIsRUFBK0MsZ0JBQS9DLENBQWdFLE9BQWhFLEVBQXlFLFlBQUk7QUFDekUsdUJBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE9BQU8sQ0FBbkIsQ0FBUDtBQUNBLHlCQUFTLGFBQVQsQ0FBdUIsa0JBQXZCLEVBQTJDLFNBQTNDLEdBQXVELElBQXZEO0FBQ0EseUJBQVMsYUFBVCxDQUF1QixvQkFBdkIsRUFBNkMsS0FBN0MsQ0FBbUQsV0FBbkQsQ0FBK0QsbUJBQS9ELEVBQW9GLElBQXBGO0FBQ0gsYUFKRDtBQUtBLHFCQUFTLGFBQVQsQ0FBdUIscUJBQXZCLEVBQThDLGdCQUE5QyxDQUErRCxPQUEvRCxFQUF3RSxZQUFJO0FBQ3hFLHVCQUFPLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxPQUFPLENBQW5CLENBQVA7QUFDQSx5QkFBUyxhQUFULENBQXVCLGtCQUF2QixFQUEyQyxTQUEzQyxHQUF1RCxJQUF2RDtBQUNBLHlCQUFTLGFBQVQsQ0FBdUIsb0JBQXZCLEVBQTZDLEtBQTdDLENBQW1ELFdBQW5ELENBQStELG1CQUEvRCxFQUFvRixJQUFwRjtBQUNILGFBSkQ7QUFLSDs7Ozs7Ozs7QUN2TEw7Ozs7Ozs7Ozs7SUFFYSxRLFdBQUEsUTs7QUFFVDs7Ozs7O0FBTUEsc0JBQVksR0FBWixFQUFpQixjQUFqQixFQUFpRDtBQUFBOztBQUFBLFlBQWhCLE1BQWdCLHVFQUFQLEtBQU87O0FBQUE7O0FBQzdDLGFBQUssYUFBTCxHQUFxQixXQUFXLEdBQVgsRUFBZ0I7QUFDakMsbUJBQU8sY0FEMEI7QUFFakMsa0JBQU0sS0FGMkI7QUFHakMseUJBQWEsSUFIb0I7QUFJakMseUJBQWEsSUFKb0I7QUFLakMseUJBQWEsS0FMb0I7QUFNakMscUNBQXlCLElBTlE7QUFPakMsMEJBQWMsSUFQbUI7QUFRakMsNEJBQWdCLE1BUmlCO0FBU2pDLG1CQUFPO0FBVDBCLFNBQWhCLENBQXJCOztBQVlBLFlBQU0sT0FBTyxTQUFTLElBQVQsSUFBaUIsU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUE5QjtBQUNBLGFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGFBQUssTUFBTCxHQUFjLE1BQWQ7O0FBRUEsYUFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixVQUFsQjtBQUNBLFlBQUksS0FBSyxLQUFMLENBQVcsVUFBZixFQUEyQjtBQUN2QixpQkFBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixPQUF0QixHQUFnQyxFQUFoQztBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUF2QjtBQUNIO0FBQ0QsYUFBSyxXQUFMLENBQWlCLEtBQUssS0FBdEI7O0FBRUEsYUFBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLE1BQTNCLEVBQW1DLE1BQW5DO0FBQ0EsYUFBSyxhQUFMLENBQW1CLEVBQW5CLENBQXNCLFFBQXRCLEVBQWdDLFlBQVk7QUFDeEMsa0JBQUssUUFBTCxDQUFjLE1BQUssYUFBTCxDQUFtQixRQUFuQixFQUFkO0FBQ0gsU0FGRDtBQUdBLGFBQUssUUFBTCxDQUFjLGNBQWQ7QUFDSDs7OztpQ0FFUSxLLEVBQU87QUFBQTs7QUFDWixpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMscUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBakIsQ0FBNEIsQ0FBNUI7QUFDSDtBQUNELGlCQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLLE1BQVYsRUFBaUI7QUFDYixzQkFBTSxLQUFOLENBQVksR0FBWixFQUNLLEdBREwsQ0FDUztBQUFBLDJCQUFPLElBQUksSUFBSixFQUFQO0FBQUEsaUJBRFQsRUFFSyxPQUZMLENBRWEsdUJBQWU7QUFDcEIsd0JBQUk7QUFDQSwrQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixVQUFqQixDQUE0QixjQUFjLEdBQTFDO0FBQ0EsK0JBQUssTUFBTDtBQUNILHFCQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDUixnQ0FBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0osaUJBVEw7QUFVSCxhQVhELE1BV0s7QUFDRCxvQkFBSTtBQUNBLHlCQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLENBQTRCLEtBQTVCO0FBQ0EseUJBQUssTUFBTDtBQUNILGlCQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDUiw0QkFBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0o7QUFFSjs7Ozs7Ozs7QUNwRUw7Ozs7Ozs7O0lBRWEsYzs7QUFFVDs7Ozs7O1FBRlMsYyxHQVFULHdCQUFZLEdBQVosRUFBaUIsSUFBakIsRUFBdUIsY0FBdkIsRUFBdUM7QUFBQTs7QUFDbkMsUUFBTSxlQUFlLFdBQVcsR0FBWCxFQUFnQjtBQUNqQyxlQUFPLGNBRDBCO0FBRWpDLGNBQU0sSUFGMkI7QUFHakMscUJBQWEsSUFIb0I7QUFJakMscUJBQWEsSUFKb0I7QUFLakMscUJBQWEsS0FMb0I7QUFNakMsa0JBQVUsSUFOdUI7QUFPakMsaUNBQXlCLElBUFE7QUFRakMsc0JBQWMsSUFSbUI7QUFTakMsd0JBQWdCLE1BVGlCO0FBVWpDLGVBQU87QUFWMEIsS0FBaEIsQ0FBckI7O0FBYUEsaUJBQWEsT0FBYixDQUFxQixNQUFyQixFQUE2QixNQUE3QjtBQUNILEM7OztBQ3pCTDs7Ozs7Ozs7OztBQUVBLElBQU0sVUFBVSxPQUFoQjtBQUNBLElBQU0sY0FBYyxRQUFwQjtBQUNBLElBQU0scUJBQXFCLE9BQTNCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLG1CLFdBQUEsbUI7QUFDVCx1Q0FHRztBQUFBLFlBRkMsTUFFRCxRQUZDLE1BRUQ7QUFBQSxZQURDLGFBQ0QsUUFEQyxhQUNEOztBQUFBOztBQUNDLGFBQUssV0FBTCxHQUFtQixTQUFTLGNBQVQsZ0JBQXFDLE1BQXJDLENBQW5CO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLGFBQXJCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLGVBQU8sZ0JBQVAsV0FBZ0MsTUFBaEMsRUFBMEMsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUExQztBQUNBLGVBQU8sZ0JBQVAsZ0JBQXFDLE1BQXJDLEVBQStDLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBL0M7QUFDSDs7OzswQ0FFaUIsSyxFQUFPO0FBQ3JCLGdCQUFJO0FBQ0Esb0JBQUksYUFBYSxJQUFqQjtBQUNBLG9CQUFJLE1BQU0sSUFBTixLQUFlLE1BQW5CLEVBQTJCO0FBQ3ZCLHdCQUFJLEtBQUssU0FBTCxJQUFrQixDQUF0QixFQUF5QjtBQUNyQixxQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxTQUF4QixDQUFiO0FBQ0g7QUFDSixpQkFKRCxNQUtBLElBQUksTUFBTSxJQUFOLEtBQWUsZUFBbkIsRUFBb0M7QUFDaEMsd0JBQU0sUUFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsaUNBQWEsS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQWI7QUFFSCxpQkFMRCxNQUtPO0FBQ0gsd0JBQU0sU0FBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLE1BQWpCO0FBQ0E7QUFDQSx3QkFBSSxTQUFRLENBQVosRUFBZTtBQUNYLHFDQUFhLEtBQUssYUFBTCxDQUFtQixTQUFRLENBQTNCLENBQWI7QUFDSDtBQUNKO0FBQ0Qsb0JBQU0sT0FBTyxhQUFhLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBYixHQUF1QyxFQUFwRDtBQUNBLG9CQUFNLE9BQU8sRUFBYjtBQUNBLG9CQUFNLFdBQVcsRUFBakI7QUFDQSxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsd0JBQU0sTUFBTSxLQUFLLENBQUwsQ0FBWjtBQUNBLDRCQUFRLElBQVI7QUFDSSw2QkFBSyxRQUFRLE1BQWI7QUFDQSw2QkFBSyxRQUFRLFNBQWI7QUFDQSw2QkFBSyxRQUFRLEtBQWI7QUFDQSw2QkFBSyxRQUFRLFFBQWI7QUFDQSw2QkFBSyxRQUFRLFdBQWI7QUFDQSw2QkFBSyxRQUFRLFlBQWI7QUFDSSxxQ0FBUyxHQUFULElBQWdCLFdBQVcsR0FBWCxDQUFoQjtBQUNBO0FBQ0osNkJBQUssUUFBUSxRQUFiO0FBQ0EsNkJBQUssUUFBUSxPQUFiO0FBQ0EsNkJBQUssUUFBUSxLQUFiO0FBQ0EsNkJBQUssUUFBUSxNQUFiO0FBQ0ksaUNBQUssR0FBTCxJQUFZLFdBQVcsR0FBWCxDQUFaO0FBQ0E7QUFDSjtBQWZKO0FBa0JIOztBQUVELG9CQUFJLFNBQVMsU0FBVCxLQUF1QixTQUEzQixFQUFzQztBQUNsQyw2QkFBUyxTQUFULEdBQXFCLE9BQXJCO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLE9BQVQsS0FBcUIsU0FBckIsSUFBa0MsS0FBSyxNQUFMLEtBQWdCLFNBQXRELEVBQWlFO0FBQzdELHlCQUFLLE1BQUwsR0FBYyxXQUFkO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLElBQVQsS0FBa0IsU0FBbEIsSUFBK0IsS0FBSyxHQUFMLEtBQWEsU0FBaEQsRUFBMkQ7QUFDdkQseUJBQUssR0FBTCxHQUFXLENBQVg7QUFDSDtBQUNELG9CQUFJLFNBQVMsTUFBVCxLQUFvQixTQUFwQixJQUFpQyxLQUFLLEtBQUwsS0FBZSxTQUFwRCxFQUErRDtBQUMzRCx5QkFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNIO0FBQ0Qsb0JBQUksU0FBUyxHQUFULEtBQWlCLFNBQWpCLElBQThCLEtBQUssSUFBTCxLQUFjLFNBQWhELEVBQTJEO0FBQ3ZELHlCQUFLLElBQUwsR0FBWSxDQUFaO0FBQ0g7QUFDRCxxQkFBSyxXQUFMLENBQWlCLElBQWpCLEdBQXdCLElBQXhCO0FBQ0EscUJBQUssV0FBTCxDQUFpQixRQUFqQixHQUE0QixRQUE1QjtBQUNBLHFCQUFLLFdBQUwsQ0FBaUIsVUFBakIsR0FBOEIsV0FBOUI7QUFFSCxhQWhFRCxDQWdFRSxPQUFPLENBQVAsRUFBVTtBQUNSLHdCQUFRLEtBQVIsQ0FBYyxDQUFkO0FBQ0g7QUFDSjs7OzJDQUVrQjtBQUNmLGlCQUFLLGlCQUFMLENBQXVCO0FBQ25CLHNCQUFNLE1BRGE7QUFFbkIsMEJBQVUsU0FBUyxhQUFULENBQXVCLHNCQUF2QjtBQUZTLGFBQXZCO0FBSUEsbUJBQU8sZ0JBQVAsQ0FBd0IsZUFBeEIsRUFBeUMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QztBQUNBLG1CQUFPLGdCQUFQLENBQXdCLGdCQUF4QixFQUEwQyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTFDO0FBQ0g7OzsrQ0FFc0I7QUFDbkIsbUJBQU8sbUJBQVAsQ0FBMkIsZUFBM0IsRUFBNEMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUE1QztBQUNBLG1CQUFPLG1CQUFQLENBQTJCLGdCQUEzQixFQUE2QyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTdDO0FBQ0g7Ozs7Ozs7QUN0R0w7Ozs7Ozs7QUFFQTs7OztBQUlBLElBQU0sY0FBYyxJQUFwQjtBQUNBLElBQU0sb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLGUsV0FBQSxlLEdBQ1QsMkJBQWM7QUFBQTs7QUFDVjtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsYUFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWSxFQVVaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQVZZLEVBZVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsRUFGVjtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBZlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLGFBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sRUFEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlk7QUFISyxLQUF4Qjs7QUF1QkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLG9CQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWTtBQUhLLEtBQXhCOztBQWNBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxtQkFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLG1CQUFPO0FBSEssU0FBRCxFQUlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBSlksRUFRWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVJZLEVBWVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FaWSxFQWdCWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQWhCWTtBQUhLLEtBQXhCOztBQTBCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsZ0JBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWTtBQUhLLEtBQXhCOztBQWtCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsdUJBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlksRUFnQlo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FoQlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLFdBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlksRUFnQlo7QUFDQyxrQkFBTSxFQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FoQlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLHNCQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWTtBQUhLLEtBQXhCOztBQWVBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxtQkFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWix1QkFBVyxPQURDO0FBRVosa0JBQU0sQ0FGTTtBQUdaLHFCQUFTLENBSEc7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLHVCQUFXLE9BRFo7QUFFQyxrQkFBTSxDQUZQO0FBR0MscUJBQVMsQ0FIVjtBQUlDLG1CQUFPO0FBSlIsU0FMWTtBQUhLLEtBQXhCOztBQWdCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsa0JBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlk7QUFISyxLQUF4Qjs7QUFzQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLGlCQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBUlksRUFZWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVpZO0FBSEssS0FBeEI7O0FBc0JBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxZQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGtCQUFNLENBRE07QUFFWixxQkFBUyxDQUZHO0FBR1osbUJBQU87QUFISyxTQUFELEVBSVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FKWSxFQVFaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBUlksRUFZWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVpZO0FBSEssS0FBeEI7O0FBc0JBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxrQkFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVoscUJBQVMsQ0FGRztBQUdaLG1CQUFPO0FBSEssU0FBRCxFQUlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBSlksRUFRWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQVJZLEVBWVo7QUFDQyxrQkFBTSxFQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FaWTtBQUhLLEtBQXhCOztBQXNCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsaUJBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlksRUFnQlo7QUFDQyxrQkFBTSxFQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FoQlk7QUFISyxLQUF4Qjs7QUEwQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLFlBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osa0JBQU0sQ0FETTtBQUVaLHFCQUFTLENBRkc7QUFHWixtQkFBTztBQUhLLFNBQUQsRUFJWjtBQUNDLGtCQUFNLENBRFA7QUFFQyxxQkFBUyxDQUZWO0FBR0MsbUJBQU87QUFIUixTQUpZLEVBUVo7QUFDQyxrQkFBTSxDQURQO0FBRUMscUJBQVMsQ0FGVjtBQUdDLG1CQUFPO0FBSFIsU0FSWSxFQVlaO0FBQ0Msa0JBQU0sQ0FEUDtBQUVDLHFCQUFTLENBRlY7QUFHQyxtQkFBTztBQUhSLFNBWlk7QUFISyxLQUF4QjtBQXdCSCxDOzs7Ozs7Ozs7Ozs7O0lDbldRLGUsV0FBQSxlO0FBRVosNEJBQWE7QUFBQTs7QUFDWixPQUFLLElBQUw7QUFDQTs7OzsrQkFFWTtBQUFBOztBQUNaLElBQUMsZUFBRCxFQUFrQixpQkFBbEIsRUFBcUMsYUFBckMsRUFBb0QsY0FBcEQsRUFBb0UsaUJBQXBFLEVBQ0csT0FESCxDQUNXLGdCQUFRO0FBQ2xCLFFBQUksZ0JBQUosQ0FBcUI7QUFDbkIsZUFEbUI7QUFFbkIsYUFBUSxVQUZXO0FBR25CLG1CQUFjLEtBSEs7QUFJbkIsZUFBVTtBQUpTLEtBQXJCO0FBTUMsSUFSRjtBQVNBLE9BQUksbUJBQW1CLE9BQU8sZ0JBQTlCO0FBQ0EsT0FBSSxHQUFKLEVBQ0MsbUJBQW1CLElBQUksZ0JBQXZCOztBQUVELFFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1Qix1QkFBdkIsRUFBZ0QsZ0JBQWhELEVBQWI7QUFDQSxRQUFLLFlBQUwsR0FBb0IsU0FBUyxhQUFULENBQXVCLHVCQUF2QixDQUFwQjtBQUNBLFFBQUssTUFBTCxHQUFjLFNBQVMsYUFBVCxDQUF1QiwrQkFBdkIsQ0FBZDtBQUNBLFFBQUssR0FBTCxHQUFXLFNBQVMsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBWDtBQUNBLFFBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxRQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsUUFBSyxjQUFMLEdBQXNCLElBQUksY0FBSixDQUFtQjtBQUN4QyxrQkFBYyxLQUFLLFlBRHFCO0FBRXhDLGlCQUFhLE9BRjJCO0FBR3hDLGVBQVcsS0FBSztBQUh3QixJQUFuQixDQUF0QjtBQUtBLE9BQUc7O0FBR0YsVUFBTSxpQkFBaUIsU0FBakIsQ0FBMkIsc0NBQTNCLENBQU47O0FBRUEsU0FBSyxnQkFBTDtBQUNBLFNBQUssYUFBTDtBQUNBLFNBQUssTUFBTDtBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0M7QUFBQSxZQUFLLE1BQUssTUFBTCxFQUFMO0FBQUEsS0FBbEM7QUFDQSxJQVRELENBU0MsT0FBTSxDQUFOLEVBQVE7QUFDUixZQUFRLEdBQVIsQ0FBWSx3QkFBWjtBQUNBOztBQUVEOzs7O0FBSUUsT0FBSSxnQkFBSixDQUFxQixnQkFBckIsRUFDRCxDQUNFLElBQUksY0FBSixDQUFtQixLQUFLLE1BQXhCLEVBQWdDLENBQ2pDLEVBQUMsNEJBQUQsRUFEaUMsRUFFakMsRUFBQyw0QkFBeUIsS0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBbEQsU0FBRCxFQUZpQyxDQUFoQyxFQUdHO0FBQ0osV0FBTyxLQUFLLGtCQUFMLEdBQXdCLEtBQUssWUFBN0IsR0FBNEMsS0FBSyxPQURwRDtBQUVKLGNBQVUsQ0FBQyxLQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUExQixJQUF3QyxLQUFLLFlBQTdDLEdBQTRELEtBQUssT0FGdkU7QUFHSixVQUFNO0FBSEYsSUFISCxDQURGLENBREMsRUFXRCxLQUFLLGNBWEosRUFZRCxFQVpDLEVBYUUsSUFiRjtBQWNGO0FBQ0E7OzsyQkFFUTtBQUNSLFFBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsWUFBdEM7QUFDQSxRQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUFMLENBQWtCLFlBQXRDO0FBQ0EsUUFBSyxTQUFMLEdBQWlCLEtBQUssWUFBTCxHQUFvQixLQUFLLFlBQTFDO0FBQ0EsV0FBUSxHQUFSLENBQVksS0FBSyxZQUFqQixFQUErQixLQUFLLFlBQXBDLEVBQWtELEtBQUssU0FBdkQ7QUFDQSxRQUFLLGlCQUFMLEdBQXlCLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxjQUFmLEVBQStCLEtBQS9CLElBQXdDLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxlQUFmLEVBQWdDLEtBQWhDLEdBQXdDLElBQUksS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLGlCQUFmLEVBQWtDLEtBQXRILENBQXpCO0FBQ0EsUUFBSyxrQkFBTCxHQUEyQixLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsaUJBQWYsRUFBa0MsS0FBbEMsR0FBd0MsQ0FBeEMsR0FBNEMsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLGVBQWYsRUFBZ0MsS0FBaEMsR0FBc0MsQ0FBbEYsR0FBc0YsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLGlCQUFmLEVBQWtDLEtBQW5KO0FBQ0EsUUFBSyxxQkFBTCxHQUE2QixLQUFLLFNBQUwsR0FBaUIsS0FBSyxrQkFBbkQ7QUFDQTtBQUNBLFFBQUsscUJBQUwsR0FBNkIsS0FBSyxrQkFBTCxHQUEwQixLQUFLLFNBQTVEOztBQUVBLE9BQU0sT0FBTyxLQUFLLFlBQUwsQ0FBa0IsWUFBbEIsRUFBYjtBQUNBLFFBQUssQ0FBTCxFQUFRLFNBQVIsOEJBQTZDLEtBQUssaUJBQWxEO0FBQ0EsUUFBSyxDQUFMLEVBQVEsTUFBUixHQUFpQixLQUFLLHFCQUF0QjtBQUNBLFFBQUssQ0FBTCxFQUFRLFNBQVIsbUJBQWtDLEtBQUsscUJBQXZDLGtCQUF5RSxLQUFLLGlCQUE5RTtBQUNBLFFBQUssWUFBTCxDQUFrQixZQUFsQixDQUErQixJQUEvQjs7QUFFQSxPQUFNLE9BQU8sS0FBSyxTQUFMLENBQWUsWUFBZixFQUFiO0FBQ0EsUUFBSyxDQUFMLEVBQVEsTUFBUixHQUFpQixLQUFLLHFCQUF0QjtBQUNBLFFBQUssU0FBTCxDQUFlLFlBQWYsQ0FBNEIsSUFBNUI7QUFDQTs7O3FDQUVrQjtBQUNsQixRQUFLLFlBQUwsR0FBb0IsSUFBSSxjQUFKLENBQW1CLEtBQUssTUFBeEIsRUFBZ0MsQ0FDbkQsRUFBQyxxQ0FBRCxFQUF3QyxRQUFRLGFBQWhELEVBQStELFFBQVEsQ0FBdkUsRUFEbUQsRUFFbkQsRUFBQyxzQ0FBb0MsQ0FBcEMsQ0FBcUMsMEJBQXJDLE1BQUQsRUFBcUUsUUFBUSxRQUE3RSxFQUF1RixRQUFRLENBQS9GLENBQWlHLDhCQUFqRyxFQUZtRCxFQUduRCxFQUFDLDJCQUF5QixDQUF6QixDQUEwQiw4QkFBMUIsa0JBQXFFLENBQXJFLENBQXNFLDBCQUF0RSxNQUFELEVBQXNHLFFBQVEsQ0FBOUcsRUFIbUQsQ0FBaEMsRUFJakI7QUFDRixjQUFVLEtBQUssT0FBTCxHQUFlLEtBQUssT0FENUI7QUFFRixVQUFNLE1BRko7QUFHRixnQkFBWTtBQUhWLElBSmlCLENBQXBCOztBQVVBLE9BQUksZ0JBQUosQ0FBcUIsaUJBQXJCLEVBQ0MsS0FBSyxZQUROLEVBRUMsS0FBSyxjQUZOLEVBR0MsRUFIRCxFQUlFLElBSkY7QUFLQTs7O2tDQUVlO0FBQ2YsUUFBSyxTQUFMLEdBQWlCLElBQUksY0FBSixDQUNoQixLQUFLLEdBRFcsRUFFaEIsQ0FDQSxFQUFDLFNBQVMsQ0FBVixFQUFhLFFBQVEsQ0FBckIsRUFEQSxFQUVBLEVBQUMsU0FBUyxDQUFWLEVBQWEsUUFBUSxDQUFyQixDQUF1Qix5QkFBdkIsRUFGQSxFQUdBLEVBQUMsU0FBUyxDQUFWLEVBQWEsUUFBUSxDQUFyQixFQUhBLENBRmdCLEVBT2hCO0FBQ0EsY0FBVSxLQUFLLE9BQUwsR0FBZSxLQUFLLE9BRDlCO0FBRUEsVUFBTSxNQUZOO0FBR0EsZ0JBQVk7QUFDWjs7Ozs7Ozs7QUFKQSxJQVBnQixDQUFqQjtBQXNCQSxPQUFJLGdCQUFKLENBQXFCLGlCQUFyQixFQUNDLEtBQUssU0FETixFQUVDLEtBQUssY0FGTixFQUdDLEVBSEQsRUFJRSxJQUpGO0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDcklXLEssV0FBQSxLO0FBQ1oscUJBQWE7QUFBQTs7QUFDWixhQUFLLE1BQUw7QUFDQSxhQUFLLEdBQUw7QUFDQSxhQUFLLE1BQUw7QUFDQSxhQUFLLE9BQUw7QUFDQSxhQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0EsYUFBSyxXQUFMOztBQUVBLGFBQUssSUFBTDtBQUNBOztBQUVEOzs7OztzQ0FDaUI7QUFDVixnQkFBTSxRQUFRLEtBQUssR0FBTCxDQUFTLGVBQVQsQ0FBeUIsS0FBSyxNQUE5QixFQUFzQyxLQUFLLE9BQTNDLENBQWQ7QUFDQSxnQkFBTSxXQUFXLElBQUksV0FBSixDQUFnQixNQUFNLElBQU4sQ0FBVyxNQUEzQixDQUFqQjtBQUNBLGdCQUFNLE1BQU0sU0FBUyxNQUFyQjs7QUFFQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCO0FBQzFCLG9CQUFJLEtBQUssTUFBTCxLQUFnQixHQUFwQixFQUF5QjtBQUNyQiw2QkFBUyxDQUFULElBQWMsVUFBZDtBQUNIO0FBQ0o7O0FBRUQsaUJBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsS0FBcEI7QUFDSDs7Ozs7QUFHRDtxQ0FDYTtBQUNULGdCQUFJLEtBQUssS0FBTCxLQUFlLENBQW5CLEVBQXNCO0FBQ2xCLHFCQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUssS0FBTDtBQUNIOztBQUVELGlCQUFLLEdBQUwsQ0FBUyxZQUFULENBQXNCLEtBQUssU0FBTCxDQUFlLEtBQUssS0FBcEIsQ0FBdEIsRUFBa0QsQ0FBbEQsRUFBcUQsQ0FBckQ7QUFDSDs7Ozs7QUFHRDsrQkFDTztBQUFBOztBQUNILGlCQUFLLFVBQUwsQ0FBZ0IsS0FBSyxLQUFyQjs7QUFFQSxpQkFBSyxXQUFMLEdBQW1CLE9BQU8sVUFBUCxDQUFrQixZQUFNO0FBQ3ZDLHVCQUFPLHFCQUFQLENBQTZCLE1BQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxLQUFmLENBQTdCO0FBQ0gsYUFGa0IsRUFFZixPQUFPLEVBRlEsQ0FBbkI7QUFHSDs7Ozs7QUFHRDtnQ0FDUTtBQUNKLGlCQUFLLE1BQUwsR0FBYyxPQUFPLFVBQXJCO0FBQ0EsaUJBQUssT0FBTCxHQUFlLE9BQU8sV0FBdEI7O0FBRUEsaUJBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxNQUF6QjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssT0FBMUI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFwQixFQUF3QixHQUF4QixFQUE2QjtBQUN6QixxQkFBSyxXQUFMO0FBQ0g7O0FBRUQsaUJBQUssSUFBTDtBQUNIOzs7OztBQUdEOytCQUNPO0FBQ0gsaUJBQUssTUFBTCxHQUFjLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFkO0FBQ0EsaUJBQUssR0FBTCxHQUFXLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBWDs7QUFFQSxpQkFBSyxLQUFMO0FBQ0g7Ozs7Ozs7QUN6RUw7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBQ0E7O0FBSUEsQ0FBQyxrQkFBa0I7O0FBR2YsbUJBQWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBRUEsWUFBSSxrQkFBa0IsR0FBdEIsRUFBMEI7QUFDdEIsZ0JBQUc7O0FBRUMsb0JBQUksZ0JBQUosQ0FBcUI7QUFDakIsMEJBQU0sZUFEVztBQUVqQiw0QkFBUSxnQkFGUztBQUdqQiw4QkFBVSxLQUhPO0FBSWpCLGtDQUFjO0FBSkcsaUJBQXJCO0FBTUEsaUJBQUMsSUFBSSxZQUFKLElBQW9CLFlBQXJCLEVBQW1DLFNBQW5DLENBQTZDLG9DQUE3QztBQUNILGFBVEQsQ0FTQyxPQUFNLENBQU4sRUFBUTtBQUNMLHdCQUFRLElBQVIsQ0FBYSxrQkFBYjtBQUNIO0FBQ0o7QUFDRCxZQUFJLFlBQUo7QUFDQSxZQUFJLGdCQUFKO0FBQ0E7QUFDQSxZQUFJLCtCQUFKO0FBQ0EsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYLGdCQUFJLFlBQUo7QUFDSCxTQUZELE1BRUs7QUFDRDtBQUNIO0FBRUo7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBcENEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9ucyB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX2Jyb3dzZXJFbmdpbmUoKTtcblxuXHRcdHRoaXMuX2FuaW1hdGVIb3VkaW5pKCk7XG5cblx0XHR0aGlzLl93b3JrbGV0U3RlcHMoKTtcblx0fVxuXG5cdF9icm93c2VyRW5naW5lKCkge1xuXHRcdGxldCBzdGVwQW5pbWF0aW9uID0gMDtcblx0XHRjb25zdCBTVEVQX0RPV05MT0FEID0gMTtcblx0XHRjb25zdCBTVEVQX1BST0NFU1MgPSAyO1xuXHRcdGNvbnN0IFNURVBfQlJPV1NFUiA9IDM7XG5cdFx0Y29uc3QgU1RFUF9MQVlPVVQgPSA0O1xuXHRcdGNvbnN0IFNURVBfUEFJTlQgPSA1O1xuXG5cdFx0ZnVuY3Rpb24gZnJhZ21lbnRBbmltYXRpb24oKXtcblx0XHRcdHN0ZXBBbmltYXRpb24rKztcblx0XHRcdHN3aXRjaChzdGVwQW5pbWF0aW9uKXtcblx0XHRcdFx0Y2FzZShTVEVQX0RPV05MT0FEKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5hZGQoJ2h0bWwnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LmFkZCgnaHRtbCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9QUk9DRVNTKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLXByb2Nlc3MnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX0JST1dTRVIpOntcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3NlcicpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX0xBWU9VVCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItbGF5b3V0Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX1BBSU5UKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYWludCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1wYWludCcpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdicm93c2VyLWVuZ2luZScsICgpPT57XG5cdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGZyYWdtZW50QW5pbWF0aW9uKTtcblx0XHRcdHN0ZXBBbmltYXRpb24gPSAwO1xuXG5cdFx0XHRmdW5jdGlvbiBjbGVhckFuaW0oKXtcblx0XHRcdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNsb3VkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3NlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFpbnQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItcGFpbnQnKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1wYWludCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XG5cdFx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xuXHRcdFx0fSwxMDApO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRfYW5pbWF0ZUhvdWRpbmkoKXtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0ZS1ob3VkaW5pLXdvcmtmbG93JywgKCkgPT4ge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0xJykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsQmFja0ZyYWdtZW50KCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cdH1cblxuXHRfd29ya2xldFN0ZXBzKCkge1xuXHRcdGxldCBzdGVwQW5pbWF0aW9uID0gMDtcblx0XHRjb25zdCBTVEVQX0FERCA9IDE7XG5cdFx0Y29uc3QgU1RFUF9BRERfV09SS0tFVCA9IDI7XG5cdFx0Y29uc3QgU1RFUF9MT0FEID0gMztcblx0XHRjb25zdCBTVEVQX1JFTkRFUiA9IDQ7XG5cdFx0Y29uc3QgU1RFUF9DQUxMID0gNTtcblx0XHRjb25zdCBTVEVQX0VYRUNVVEUgPSA2O1xuXG5cdFx0ZnVuY3Rpb24gZnJhZ21lbnRBbmltYXRpb24oKXtcblx0XHRcdHN0ZXBBbmltYXRpb24rKztcblx0XHRcdHN3aXRjaChzdGVwQW5pbWF0aW9uKXtcblx0XHRcdFx0Y2FzZShTVEVQX0FERCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0xJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9BRERfV09SS0tFVCk6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0yJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9MT0FEKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTMnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX1JFTkRFUik6e1xuXHRcdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC00JykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UoU1RFUF9DQUxMKTp7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTUnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZShTVEVQX0VYRUNVVEUpOntcblx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtNicpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3dvcmtsZXQtc3RlcHMnLCAoKT0+e1xuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XG5cdFx0XHRzdGVwQW5pbWF0aW9uID0gMDtcblxuXHRcdFx0ZnVuY3Rpb24gY2xlYXJBbmltKCl7XG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnJhZ21lbnRBbmltYXRpb24pO1xuXHRcdFx0XHRSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgY2xlYXJBbmltKTtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTEnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC0yJykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtMycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dvcmtsZXQtZGlhZ3JhbSAud29ya2xldC1zdGVwLTQnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3b3JrbGV0LWRpYWdyYW0gLndvcmtsZXQtc3RlcC01JykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd29ya2xldC1kaWFncmFtIC53b3JrbGV0LXN0ZXAtNicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XG5cdFx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xuXHRcdFx0fSwxMDApO1xuXHRcdH0pO1xuXG5cdH1cbn0iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q3NzXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcbmltcG9ydCB7XG4gICAgQXBwbHlDb2RlTWlyb3Jcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlKcy5qcyc7XG5pbXBvcnQge0FuaW1hdGlvbkhlYWRlcn0gZnJvbSAnLi9ob3VkaW5pL2FuaW1hdGlvbi1oZWFkZXIuanMnXG5cbmV4cG9ydCBjbGFzcyBEZW1vcyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb1R5cGVPTSgpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFpbnRBcGlKc0luQ3NzKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFyKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vUHJvcGVydGllc0FuZFZhbHVlcygpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25EZW1vTG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbkRlbW9TdGF0ZScsICgpID0+e1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb25EZW1vTG9hZCl7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBBbmltYXRpb25IZWFkZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5sYXlvdXREZW1vTG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fZGVtb0xheW91dEFwaSgpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZGVtb1R5cGVPTSgpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuQ1NTVHJhbnNmb3JtVmFsdWUpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IC8vbmV3IENTU1RyYW5zZm9ybVZhbHVlKFtcbiAgICAgICAgICAgIG5ldyBDU1NSb3RhdGUoMCwwLDEsIENTUy5kZWcoMCkpXG4gICAgICAgIC8vXSk7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmVEZW1vJyk7XG4gICAgICAgIHNxdWFyZS5hdHRyaWJ1dGVTdHlsZU1hcC5zZXQoJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XG4gICAgICAgIGxldCByYWZJZDtcbiAgICAgICAgbGV0IHN0b3BBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gZHJhdygpe1xuICAgICAgICAgICAgdHJhbnNmb3JtLmFuZ2xlLnZhbHVlID0gKHRyYW5zZm9ybS5hbmdsZS52YWx1ZSArIDUpICUgMzYwO1xuICAgICAgICAgICAgc3F1YXJlLmF0dHJpYnV0ZVN0eWxlTWFwLnNldCgndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcbiAgICAgICAgICAgIHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xuICAgICAgICB9XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4gZHJhdygpKTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZJZCkpO1xuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFyKCkge1xuICAgICAgICAvKiogKi9cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzJyksXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50IGgye1xuICAgIC0tYS1zdXBlci12YXI6ICNGRkY7XG59XG4jcmVuZGVyLWVsZW1lbnQgLnRleHQtMXtcblxufVxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTJ7XG5cbn1gXG4gICAgICAgICk7XG4gICAgfVxuXG5cbiAgICBfZnJhbWVJbmNyZW1lbnQoKXtcbiAgICAgICAgaWYgKHRoaXMuZnJhbWUgPT09IDkpIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpLnN0eWxlLnNldFByb3BlcnR5KCctLWZyYW1lJywgdGhpcy5mcmFtZSk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9mcmFtZUluY3JlbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfZGVtb1Byb3BlcnRpZXNBbmRWYWx1ZXMoKSB7XG4gICAgICAgIENTUy5yZWdpc3RlclByb3BlcnR5KHtcbiAgICAgICAgICAgIG5hbWU6ICctLXByb3BlcnRpZXMtbW92ZS1yZWdpc3RlcicsXG4gICAgICAgICAgICBzeW50YXg6ICc8bGVuZ3RoPicsXG4gICAgICAgICAgICBpbmhlcml0czogZmFsc2UsXG4gICAgICAgICAgICBpbml0aWFsVmFsdWU6ICcwcHgnLFxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J0bi1zcXVhcmUtcHJvcGVydGllcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtcHJvcGVydGllcycpLmNsYXNzTGlzdC5yZW1vdmUoJ21vdmUnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtcHJvcGVydGllcycpLmNsYXNzTGlzdC5hZGQoJ21vdmUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidG4tc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QuYWRkKCdtb3ZlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9kZW1vUGFpbnRBcGkoKSB7XG4gICAgICAgIGlmICghJ3BhaW50V29ya2xldCcgaW4gQ1NTKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIChDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9jaXJjbGUtd29ya2xldC5qcycpO1xuXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhaW50LWFwaS1jc3MnKSxcbiAgICAgICAgICAgIGAjcmVuZGVyLWVsZW1lbnQtcGFpbnQtYXBpIHtcbiAgICAtLWNpcmNsZS1jb2xvcjogYmxhY2s7XG4gICAgLS13aWR0aC1jaXJjbGU6IDEwMHB4O1xuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSwgMHB4LCByZWQpO1xufVxuLnJldmVhbCBzZWN0aW9uLnBhcmVudC1kZW1vLXBhaW50LmNhZHJle1xuICAgIC0tY2FkcmUtY29sb3I6YmxhY2s7XG59YFxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGknKSxcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcbiAgICAgICAgICAgIGBwYWludChjdHgsIGdlb20sIHByb3BlcnRpZXMsIGFyZ3MpIHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNlbnRlciBwb2ludCBhbmQgcmFkaXVzLlxuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWluKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIpO1xuICAgIGNvbnN0IGJvcmRlciA9IGFyZ3NbMF0udmFsdWU7XG4gICAgLy8gQ2hhbmdlIHRoZSBib3JkZXIgY29sb3IuXG4gICAgY3R4LmZpbGxTdHlsZSA9IGFyZ3NbMV0udG9TdHJpbmcoKTtcbiAgICBjdHguYXJjKGdlb20ud2lkdGggLSBib3JkZXIgLyAyLCBnZW9tLmhlaWdodCAtICAtIGJvcmRlciAvIDIsIHJhZGl1cyAtIGJvcmRlciwgMCwgMiAqIE1hdGguUEkpO1xuICAgIC8vIENoYW5nZSB0aGUgZmlsbCBjb2xvci5cbiAgICBjb25zdCBjb2xvciA9IHByb3BlcnRpZXMuZ2V0KCctLWNpcmNsZS1jb2xvcicpLnRvU3RyaW5nKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5hcmMoZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMiwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XG59YCk7XG4gICAgfVxuXG4gICAgX2RlbW9QYWludEFwaUpzSW5Dc3MoKSB7XG4gICAgICAgIGlmICghJ3BhaW50V29ya2xldCcgaW4gQ1NTKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIChDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9jaXJjbGUtZnJvbS1jc3Mtd29ya2xldC5qcycpO1xuXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhaW50LWFwaS1qcy1pbi1jc3MnKSxcbiAgICAgICAgICAgIGAjcmVuZGVyLWVsZW1lbnQtcGFpbnQtYXBpLWpzLWluLWNzcyB7XG4gICAgLS1jaXJjbGUtY29sb3I6IGJsYWNrO1xuICAgIC0td2lkdGgtY2lyY2xlOiAxMDBweDtcbiAgICB3aWR0aDogdmFyKC0td2lkdGgtY2lyY2xlKTtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBwYWludChjaXJjbGUtZnJvbS1jc3MpO1xuICAgIC0tY2lyY2xlLWpzLWluLWNzczogKGN0eCwgZ2VvbSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xvciA9IFxcYHZhcigtLWNpcmNsZS1jb2xvcilcXGA7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY29uc3QgeCA9IGdlb20ud2lkdGggLyAyO1xuICAgICAgICBjb25zdCB5ID0gZ2VvbS5oZWlnaHQgLyAyO1xuICAgICAgICBsZXQgcmFkaXVzID0gTWF0aC5taW4oeCwgeSk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjdHguYXJjKHgsIHksIHJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgIH1cbn1gLFxudHJ1ZSk7XG4gICAgfVxuXG4gICAgX2RlbW9MYXlvdXRBcGkoKXtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2RlbW9MYXlvdXRXb3JrbGV0IGRpdicpLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0ID0gZWxlbS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIC8vIEN1dCBvdXQgYSByYW5kb20gYW1vdW50IG9mIHRleHQsIGJ1dCBrZWVwIGF0IGxlYXN0IDEwIGNoYXJhY3RlcnNcbiAgICAgICAgICAgIGVsZW0udGV4dENvbnRlbnQgPSB0LnNsaWNlKDAsIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0Lmxlbmd0aCAtIDEwKSArIDEwKSk7XG4gICAgICAgIH0pXG4gICAgICAgIENTUy5sYXlvdXRXb3JrbGV0LmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvbWFzb25yeS13b3JrbGV0LmpzJyk7XG5cbiAgICAgICAgbGV0IGNvbHMgPSAzO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlCdG5NaW51cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgICAgIGNvbHMgPSBNYXRoLm1heCgzLCBjb2xzIC0gMSk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlDb2xzJykuaW5uZXJIVE1MID0gY29scztcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTGF5b3V0V29ya2xldCcpLnN0eWxlLnNldFByb3BlcnR5KCctLW1hc29ucnktY29sdW1ucycsIGNvbHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5QnRuUGx1cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgICAgIGNvbHMgPSBNYXRoLm1pbig4LCBjb2xzICsgMSk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlDb2xzJykuaW5uZXJIVE1MID0gY29scztcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTGF5b3V0V29ya2xldCcpLnN0eWxlLnNldFByb3BlcnR5KCctLW1hc29ucnktY29sdW1ucycsIGNvbHMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpbVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQsIG5vVHJpbSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ2lkZWEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIHRoaXMubm9UcmltID0gbm9UcmltO1xuXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcblxuICAgICAgICB0aGlzLmNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyh0aGlzLmNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFwcGx5Q3NzKGluaXRpYWxDb250ZW50KTtcbiAgICB9XG5cbiAgICBhcHBseUNzcyh2YWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubmJFbHRzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIGlmICghdGhpcy5ub1RyaW0pe1xuICAgICAgICAgICAgdmFsdWUuc3BsaXQoJ30nKVxuICAgICAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yQ3NzICsgJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5uYkVsdHMrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59IiwiJ3VzZSBzdGljdCdcblxuZXhwb3J0IGNsYXNzIEFwcGx5Q29kZU1pcm9yIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbHQsIG1vZGUsIGluaXRpYWxDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvZGVNaXJyb3JKUyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxuICAgICAgICAgICAgdGhlbWU6ICdpZGVhJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb2RlTWlycm9ySlMuc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgfVxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNGVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmxpbmVIZWlnaHQgPSBMSU5FX0hFSUdIVDtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgVFlwZWQgT00gTmV3IFBvc3NpYmlsaXRpZXNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS1uZXcnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxMSxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIFR5cGVkIE9NIE5ldyBBcGlcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndHlwZWRvbS1hcGknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDgsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTAsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vICBUeXBlZCBPTSBDb252ZXJzaW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3R5cGVkb20tY29udmVyc2lvbicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDgsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgVHlwZWQgT00gVHJhbnNmb3JtXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3R5cGVkb20tdHJhbnNmb3JtJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA3LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENTUyBDdXN0b20gUHJvcGVydGllc1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtcHJvcGVydGllcycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENTUyBQcm9wZXJ0aWVzICYgVmFsdWVzIFR5cGVzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3Byb3BlcnRpZXN2YWx1ZXMtdHlwZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDksXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQYWludCBBcGlcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncGFpbnQtYXBpJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDgsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBbmltYXRvciBEZWNsYXJhdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdhbmltYXRvci1kZWNsYXJhdGlvbicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vIEFuaW1hdG9yIFRpbWVMaW5lICYgUmVnaXN0ZXJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnYW5pbWF0b3ItdGltZWxpbmUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wTWFyZ2luOiAnMTE1cHgnLFxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wTWFyZ2luOiAnMTE1cHgnLFxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBbmltYXRvciBFZmZlY3RzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2FuaW1hdG9yLWVmZmVjdHMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNzAwcHgnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDksXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBbmltYXRvciBJbnZva2VcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnYW5pbWF0b3ItaW52b2tlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMYXlvdXQgQXBpXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2xheW91dC1hcGknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExheW91dCBJbnRyaW5zaWMgY2FsY1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdsYXlvdXQtaW50cmluc2ljJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTGF5b3V0IHBvc2l0aW9uIGZyYWdtZW50c1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdsYXlvdXQtcG9zaXRpb24nLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBhcnNlciBBcGlcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncGFyc2VyLWFwaScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cblxuXG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBBbmltYXRpb25IZWFkZXJ7XG5cblx0Y29uc3RydWN0b3IoKXtcblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXG5cdGFzeW5jIGluaXQoKSB7XG5cdFx0WyctLWF2YXRhci1zaXplJywgJy0taGVhZGVyLWhlaWdodCcsICctLWZvbnQtYmFzZScsICctLWJhci1oZWlnaHQnLCAnLS1hdmF0YXItYm9yZGVyJ11cblx0XHQgIC5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdFx0Q1NTLnJlZ2lzdGVyUHJvcGVydHkoe1xuXHRcdFx0ICBuYW1lLFxuXHRcdFx0ICBzeW50YXg6ICc8bGVuZ3RoPicsXG5cdFx0XHQgIGluaXRpYWxWYWx1ZTogJzBweCcsXG5cdFx0XHQgIGluaGVyaXRzOiB0cnVlXG5cdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdGxldCBhbmltYXRpb25Xb3JrbGV0ID0gd2luZG93LmFuaW1hdGlvbldvcmtsZXQ7XG5cdFx0aWYgKENTUylcblx0XHRcdGFuaW1hdGlvbldvcmtsZXQgPSBDU1MuYW5pbWF0aW9uV29ya2xldDtcblxuXHRcdHRoaXMuc2l6ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQnKS5jb21wdXRlZFN0eWxlTWFwKCk7XG5cdFx0dGhpcy5zY3JvbGxTb3VyY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQnKTtcblx0XHR0aGlzLmF2YXRhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vQW5pbWF0aW9uV29ya2xldCAuYXZhdGFyJyk7XG5cdFx0dGhpcy5iYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQgLmJhcicpO1xuXHRcdHRoaXMubWF4VGltZSA9IDEwMDA7XG5cdFx0dGhpcy5lcHNpbG9uID0gMWUtMjtcblx0XHR0aGlzLnNjcm9sbFRpbWVsaW5lID0gbmV3IFNjcm9sbFRpbWVsaW5lKHtcblx0XHRcdHNjcm9sbFNvdXJjZTogdGhpcy5zY3JvbGxTb3VyY2UsXG5cdFx0XHRvcmllbnRhdGlvbjogJ2Jsb2NrJyxcblx0XHRcdHRpbWVSYW5nZTogdGhpcy5tYXhUaW1lLFxuXHRcdH0pO1xuXHRcdHRyeXtcblxuXG5cdFx0XHRhd2FpdCBhbmltYXRpb25Xb3JrbGV0LmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvYW5pbWF0b3ItaGVhZGVyLmpzJyk7XG5cblx0XHRcdHRoaXMuaW5pdEF2YXRhckVmZmVjdCgpO1xuXHRcdFx0dGhpcy5pbml0QmFyRWZmZWN0KCk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF8gPT4gdGhpcy51cGRhdGUoKSk7XG5cdFx0fWNhdGNoKGUpe1xuXHRcdFx0Y29uc29sZS5sb2coJ1dpbGwgVXNlIFBvbHlmaWxsIDpcXCcoJyk7XG5cdFx0fVxuXG5cdFx0LyogY3JidWcoODI0NzgyKTogZGVsYXkgaXMgbm90IHdvcmtpbmcgYXMgZXhwZWN0ZWQgaW4gd29ya2xldCwgaW5zdGVhZCBoZXJlIHdlIGNvbWJpbmVcblx0XHQgICB3aGF0IHdvdWxkIGhhdmUgYmVlbiBhIGRlbGF5ZWQgYW5pbWF0aW9uIHdpdGggdGhlIG90aGVyIGF2YXRhciBhbmltYXRpb24gYnV0IHN0YXJ0XG5cdFx0ICAgaXQgYXQgYSBkaWZmZXJlbnQgb2Zmc2V0LlxuXHRcdCovXG5cdFx0ICBuZXcgV29ya2xldEFuaW1hdGlvbigndHdpdHRlci1oZWFkZXInLFxuXHRcdFx0W1xuXHRcdFx0ICBuZXcgS2V5ZnJhbWVFZmZlY3QodGhpcy5hdmF0YXIsIFtcblx0XHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoMHB4KWB9LFxuXHRcdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3RoaXMuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5jbGllbnRIZWlnaHR9cHgpYH0sXG5cdFx0XHQgIF0sIHtcblx0XHRcdFx0ZGVsYXk6IHRoaXMuYXZhdGFyU2Nyb2xsRW5kUG9zL3RoaXMuc2Nyb2xsSGVpZ2h0ICogdGhpcy5tYXhUaW1lLFxuXHRcdFx0XHRkdXJhdGlvbjogKHRoaXMuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5jbGllbnRIZWlnaHQpL3RoaXMuc2Nyb2xsSGVpZ2h0ICogdGhpcy5tYXhUaW1lLFxuXHRcdFx0XHRmaWxsOiAnYm90aCcsXG5cdFx0XHQgIH0pLFxuXHRcdFx0XSxcblx0XHRcdHRoaXMuc2Nyb2xsVGltZWxpbmUsXG5cdFx0XHR7fVxuXHRcdCAgKS5wbGF5KCk7XG5cdFx0LyoqL1xuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdHRoaXMuY2xpZW50SGVpZ2h0ID0gdGhpcy5zY3JvbGxTb3VyY2UuY2xpZW50SGVpZ2h0O1xuXHRcdHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5zY3JvbGxTb3VyY2Uuc2Nyb2xsSGVpZ2h0O1xuXHRcdHRoaXMubWF4U2Nyb2xsID0gdGhpcy5zY3JvbGxIZWlnaHQgLSB0aGlzLmNsaWVudEhlaWdodDtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmNsaWVudEhlaWdodCwgdGhpcy5zY3JvbGxIZWlnaHQsIHRoaXMubWF4U2Nyb2xsKTtcblx0XHR0aGlzLmF2YXRhclRhcmdldFNjYWxlID0gdGhpcy5zaXplcy5nZXQoJy0tYmFyLWhlaWdodCcpLnZhbHVlIC8gKHRoaXMuc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUgKyAyICogdGhpcy5zaXplcy5nZXQoJy0tYXZhdGFyLWJvcmRlcicpLnZhbHVlKTtcblx0XHR0aGlzLmF2YXRhclNjcm9sbEVuZFBvcyA9ICh0aGlzLnNpemVzLmdldCgnLS1oZWFkZXItaGVpZ2h0JykudmFsdWUvMiAtIHRoaXMuc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUvMiAtIHRoaXMuc2l6ZXMuZ2V0KCctLWF2YXRhci1ib3JkZXInKS52YWx1ZSk7XG5cdFx0dGhpcy5hdmF0YXJUYXJnZXRUcmFuc2xhdGUgPSB0aGlzLm1heFNjcm9sbCAtIHRoaXMuYXZhdGFyU2Nyb2xsRW5kUG9zO1xuXHRcdC8vIFN0b3Agc2NhbGluZyBhdCB0aGlzIG9mZnNldCBhbmQgc3RhcnQgdHJhbnNmb3JtLlxuXHRcdHRoaXMuYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0ID0gdGhpcy5hdmF0YXJTY3JvbGxFbmRQb3MgLyB0aGlzLm1heFNjcm9sbDtcblxuXHRcdGNvbnN0IGFla2YgPSB0aGlzLmF2YXRhckVmZmVjdC5nZXRLZXlmcmFtZXMoKTtcblx0XHRhZWtmWzFdLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoJHt0aGlzLmF2YXRhclRhcmdldFNjYWxlfSlgO1xuXHRcdGFla2ZbMV0ub2Zmc2V0ID0gdGhpcy5hdmF0YXJTY3JvbGxFbmRPZmZzZXQ7XG5cdFx0YWVrZlsyXS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke3RoaXMuYXZhdGFyVGFyZ2V0VHJhbnNsYXRlfXB4KSBzY2FsZSgke3RoaXMuYXZhdGFyVGFyZ2V0U2NhbGV9KWA7XG5cdFx0dGhpcy5hdmF0YXJFZmZlY3Quc2V0S2V5ZnJhbWVzKGFla2YpO1xuXG5cdFx0Y29uc3QgYmVrZiA9IHRoaXMuYmFyRWZmZWN0LmdldEtleWZyYW1lcygpO1xuXHRcdGJla2ZbMV0ub2Zmc2V0ID0gdGhpcy5hdmF0YXJTY3JvbGxFbmRPZmZzZXQ7XG5cdFx0dGhpcy5iYXJFZmZlY3Quc2V0S2V5ZnJhbWVzKGJla2YpO1xuXHR9XG5cblx0aW5pdEF2YXRhckVmZmVjdCgpIHtcblx0XHR0aGlzLmF2YXRhckVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdCh0aGlzLmF2YXRhciwgW1xuXHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoMHB4KSBzY2FsZSgxKWAsIGVhc2luZzogJ2Vhc2UtaW4tb3V0Jywgb2Zmc2V0OiAwfSxcblx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoJHswLyp0aGlzLmF2YXRhclRhcmdldFNjYWxlKi99KWAsIGVhc2luZzogJ2xpbmVhcicsIG9mZnNldDogMCAvKnRoaXMuYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0Ki99LFxuXHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoJHswLyp0aGlzLmF2YXRhclRhcmdldFRyYW5zbGF0ZSovfXB4KSBzY2FsZSgkezAvKnRoaXMuYXZhdGFyVGFyZ2V0U2NhbGUqL30pYCwgb2Zmc2V0OiAxfSxcblx0XHRdLCB7XG5cdFx0XHRkdXJhdGlvbjogdGhpcy5tYXhUaW1lICsgdGhpcy5lcHNpbG9uLFxuXHRcdFx0ZmlsbDogJ2JvdGgnLFxuXHRcdFx0aXRlcmF0aW9uczogSW5maW5pdHksXG5cdFx0fSk7XG5cblx0XHRuZXcgV29ya2xldEFuaW1hdGlvbignYW5pbWF0b3ItaGVhZGVyJyxcblx0XHRcdHRoaXMuYXZhdGFyRWZmZWN0LFxuXHRcdFx0dGhpcy5zY3JvbGxUaW1lbGluZSxcblx0XHRcdFtdXG5cdFx0KS5wbGF5KCk7XG5cdH1cblxuXHRpbml0QmFyRWZmZWN0KCkge1xuXHRcdHRoaXMuYmFyRWZmZWN0ID0gbmV3IEtleWZyYW1lRWZmZWN0KFxuXHRcdFx0dGhpcy5iYXIsXG5cdFx0XHRbXG5cdFx0XHR7b3BhY2l0eTogMCwgb2Zmc2V0OiAwfSxcblx0XHRcdHtvcGFjaXR5OiAxLCBvZmZzZXQ6IDAgLyphdmF0YXJTY3JvbGxFbmRPZmZzZXQqL30sXG5cdFx0XHR7b3BhY2l0eTogMSwgb2Zmc2V0OiAxfVxuXHRcdFx0XSxcblx0XHRcdHtcblx0XHRcdGR1cmF0aW9uOiB0aGlzLm1heFRpbWUgKyB0aGlzLmVwc2lsb24sXG5cdFx0XHRmaWxsOiAnYm90aCcsXG5cdFx0XHRpdGVyYXRpb25zOiBJbmZpbml0eSxcblx0XHRcdC8qIGNyYnVnKDc3OTE4OSk6IFVzZSBpbmZpbml0eSBpdGVyYXRpb24gYW5kIG1heER1cmF0aW9uIHRvIGF2b2lkIGVmZmVjdFxuXHRcdFx0XHRwcmVtYXR1cmVseSBmaW5pc2hpbmcuXG5cblx0XHRcdFx0QlRXLCBXZWIgQW5pbWF0aW9ucyB1c2VzIGFuIGVuZHBvaW50LWV4Y2x1c2l2ZSB0aW1pbmcgbW9kZWwsIHdoaWNoIG1lYW5cblx0XHRcdFx0d2hlbiB0aW1lbGluZSBpcyBhdCBcImR1cmF0aW9uXCIgdGltZSwgaXQgaXMgY29uc2lkZXJlZCB0byBiZSBhdCAwIHRpbWUgb2YgdGhlXG5cdFx0XHRcdHNlY29uZCBpdGVyYXRpb24uIFRvIGF2b2lkIHRoaXMsIHdlIGVuc3VyZSBvdXIgbWF4IHRpbWUgKG1heCBzY3JvbGwgb2Zmc2V0KSBuZXZlclxuXHRcdFx0XHRyZWFjaGVzIGR1cmF0aW9uIGJ5IGhhdmluZyBkdXJhdGlvbiBhbiBlcHNpbG9uIGxhcmdlci4gIFRoaXMgaGFjayBpcyBub3Rcblx0XHRcdFx0bmVlZGVkIG9uY2Ugd2UgZml4IHRoZSBvcmlnaW5hbCBidWcgYWJvdmUuXG5cdFx0XHRcdCovXG5cdFx0XHR9XG5cdFx0KTtcblx0XHRuZXcgV29ya2xldEFuaW1hdGlvbignYW5pbWF0b3ItaGVhZGVyJyxcblx0XHRcdHRoaXMuYmFyRWZmZWN0LFxuXHRcdFx0dGhpcy5zY3JvbGxUaW1lbGluZSxcblx0XHRcdFtdXG5cdFx0KS5wbGF5KCk7XG5cdH1cblxufVxuXG4iLCJleHBvcnQgY2xhc3MgTm9pc2Uge1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdHRoaXMuY2FudmFzO1xuXHRcdHRoaXMuY3R4O1xuXHRcdHRoaXMud1dpZHRoO1xuXHRcdHRoaXMud0hlaWdodDtcblx0XHR0aGlzLm5vaXNlRGF0YSA9IFtdO1xuXHRcdHRoaXMuZnJhbWUgPSAwO1xuXHRcdHRoaXMubG9vcFRpbWVvdXQ7XG5cblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXG5cdC8vIENyZWF0ZSBOb2lzZVxuICAgIGNyZWF0ZU5vaXNlKCkge1xuICAgICAgICBjb25zdCBpZGF0YSA9IHRoaXMuY3R4LmNyZWF0ZUltYWdlRGF0YSh0aGlzLndXaWR0aCwgdGhpcy53SGVpZ2h0KTtcbiAgICAgICAgY29uc3QgYnVmZmVyMzIgPSBuZXcgVWludDMyQXJyYXkoaWRhdGEuZGF0YS5idWZmZXIpO1xuICAgICAgICBjb25zdCBsZW4gPSBidWZmZXIzMi5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjUpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIzMltpXSA9IDB4ZmYwMDAwMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vaXNlRGF0YS5wdXNoKGlkYXRhKTtcbiAgICB9O1xuXG5cbiAgICAvLyBQbGF5IE5vaXNlXG4gICAgcGFpbnROb2lzZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJhbWUgPT09IDkpIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mcmFtZSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdHgucHV0SW1hZ2VEYXRhKHRoaXMubm9pc2VEYXRhW3RoaXMuZnJhbWVdLCAwLCAwKTtcbiAgICB9O1xuXG5cbiAgICAvLyBMb29wXG4gICAgbG9vcCgpIHtcbiAgICAgICAgdGhpcy5wYWludE5vaXNlKHRoaXMuZnJhbWUpO1xuXG4gICAgICAgIHRoaXMubG9vcFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSwgKDEwMDAgLyAyNSkpO1xuICAgIH07XG5cblxuICAgIC8vIFNldHVwXG4gICAgc2V0dXAoKSB7XG4gICAgICAgIHRoaXMud1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMud0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud1dpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLndIZWlnaHQ7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU5vaXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvb3AoKTtcbiAgICB9O1xuXG5cbiAgICAvLyBJbml0XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9pc2UnKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBpbXBvcnQgeyBNYXNrSGlnaGxpZ2h0ZXIgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbWFzay1oaWdobGlnaHRlci9tYXNrLWhpZ2hsaWdodGVyLmpzJztcbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHtcbiAgICBEZW1vc1xufSBmcm9tICcuL2RlbW9zLmpzJztcbmltcG9ydCB7Tm9pc2V9IGZyb20gJy4vaG91ZGluaS9ub2lzZS5qcyc7XG5pbXBvcnQge0FuaW1hdGlvbnN9IGZyb20gJy4vYW5pbWF0aW9ucy9hbmltLmpzJztcblxuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuICAgICAgICBpZiAoJ3BhaW50V29ya2xldCcgaW4gQ1NTKXtcbiAgICAgICAgICAgIHRyeXtcblxuICAgICAgICAgICAgICAgIENTUy5yZWdpc3RlclByb3BlcnR5KHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJy0tY2FkcmUtY29sb3InLFxuICAgICAgICAgICAgICAgICAgICBzeW50YXg6ICc8Y29sb3I+IHwgbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIGluaGVyaXRzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIChDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9jYWRyZS13b3JrbGV0LmpzJyk7XG4gICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdFcnJvciB3aXRoIGNhZHJlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmV3IE5vaXNlKCk7XG4gICAgICAgIG5ldyBBbmltYXRpb25zKCk7XG4gICAgICAgIC8vIG5ldyBUeXBlVGV4dCgpO1xuICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKCk7XG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWdpY1ZpZGVvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiXX0=
