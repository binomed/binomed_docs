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
        if (!inIframe) {
            new _demos.Demos();
            // new HighlightEvents();
        } else {
                // document.getElementById('magicVideo').style.display = 'none';
            }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./animations/anim.js":1,"./demos.js":2,"./highlightEvent.js":6,"./houdini/noise.js":8}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7SUFDYSxVLFdBQUEsVTtBQUNaLHVCQUFjO0FBQUE7O0FBQ2IsT0FBSyxjQUFMOztBQUVBLE9BQUssZUFBTDtBQUNBOzs7O21DQUVnQjtBQUNoQixPQUFJLGdCQUFnQixDQUFwQjtBQUNBLE9BQU0sZ0JBQWdCLENBQXRCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxjQUFjLENBQXBCO0FBQ0EsT0FBTSxhQUFhLENBQW5COztBQUVBLFlBQVMsaUJBQVQsR0FBNEI7QUFDM0I7QUFDQSxZQUFPLGFBQVA7QUFDQyxVQUFLLGFBQUw7QUFBb0I7QUFDbkIsZ0JBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxDQUErQyxHQUEvQyxDQUFtRCxNQUFuRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBcEMsQ0FBOEMsR0FBOUMsQ0FBa0QsTUFBbEQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxTQUExQyxDQUFvRCxHQUFwRCxDQUF3RCxNQUF4RDtBQUNBO0FBQ0E7QUFDRCxVQUFLLFlBQUw7QUFBbUI7QUFDbEIsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FB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LGlCQUFLLEdBQUwsR0FBVyxLQUFLLE1BQUwsQ0FBWSxVQUFaLENBQXVCLElBQXZCLENBQVg7O0FBRUEsaUJBQUssS0FBTDtBQUNIOzs7Ozs7O0FDekVMOztBQUVBOztBQUNBOztBQUdBOztBQUdBOztBQUNBOztBQUlBLENBQUMsa0JBQWtCOztBQUdmLG1CQUFlLFFBQWYsR0FBMEI7O0FBRXRCLFlBQU0sV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXRDOztBQUdBLFlBQUksZ0JBQUosQ0FBcUI7QUFDakIsa0JBQU0sZUFEVztBQUVqQixvQkFBUSxnQkFGUztBQUdqQiwwQkFBYztBQUhHLFNBQXJCO0FBS0EsU0FBQyxJQUFJLFlBQUosSUFBb0IsWUFBckIsRUFBbUMsU0FBbkMsQ0FBNkMsb0NBQTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYO0FBQ0E7QUFDSCxTQUhELE1BR0s7QUFDRDtBQUNIO0FBRUo7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBN0JEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIndXNlIHN0cmljdCdcclxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbnMge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5fYnJvd3NlckVuZ2luZSgpO1xyXG5cclxuXHRcdHRoaXMuX2FuaW1hdGVIb3VkaW5pKCk7XHJcblx0fVxyXG5cclxuXHRfYnJvd3NlckVuZ2luZSgpIHtcclxuXHRcdGxldCBzdGVwQW5pbWF0aW9uID0gMDtcclxuXHRcdGNvbnN0IFNURVBfRE9XTkxPQUQgPSAxO1xyXG5cdFx0Y29uc3QgU1RFUF9QUk9DRVNTID0gMjtcclxuXHRcdGNvbnN0IFNURVBfQlJPV1NFUiA9IDM7XHJcblx0XHRjb25zdCBTVEVQX0xBWU9VVCA9IDQ7XHJcblx0XHRjb25zdCBTVEVQX1BBSU5UID0gNTtcclxuXHJcblx0XHRmdW5jdGlvbiBmcmFnbWVudEFuaW1hdGlvbigpe1xyXG5cdFx0XHRzdGVwQW5pbWF0aW9uKys7XHJcblx0XHRcdHN3aXRjaChzdGVwQW5pbWF0aW9uKXtcclxuXHRcdFx0XHRjYXNlKFNURVBfRE9XTkxPQUQpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtZG93bmxvYWQnKS5jbGFzc0xpc3QuYWRkKCdodG1sJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX1BST0NFU1MpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX0JST1dTRVIpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1wcm9jZXNzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3NlcicpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX0xBWU9VVCk6e1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FzZShTVEVQX1BBSU5UKTp7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYWludCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1wYWludCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlci1wYWludCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Jyb3dzZXItZW5naW5lJywgKCk9PntcclxuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XHJcblx0XHRcdHN0ZXBBbmltYXRpb24gPSAwO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2xlYXJBbmltKCl7XHJcblx0XHRcdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmcmFnbWVudEFuaW1hdGlvbik7XHJcblx0XHRcdFx0UmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIGNsZWFyQW5pbSk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jbG91ZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhaW50JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLXBhaW50Jyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1wYWludCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIGNsZWFyQW5pbSk7XHJcblx0XHRcdH0sMTAwKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdF9hbmltYXRlSG91ZGluaSgpe1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0ZS1ob3VkaW5pLXdvcmtmbG93JywgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMScpLnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgY2FsbEJhY2tGcmFnbWVudCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsQmFja0ZyYWdtZW50KCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91ZGluaV93b3JrZmxvdy0yJykuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBjYWxsQmFja0ZyYWdtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHtcclxuICAgIEFwcGx5Q3NzXHJcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgQXBwbHlDb2RlTWlyb3JcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUpzLmpzJztcclxuaW1wb3J0IHtBbmltYXRpb25IZWFkZXJ9IGZyb20gJy4vaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIERlbW9zIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZGVtb1R5cGVPTSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFpbnRBcGkoKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUHJvcGVydGllc0FuZFZhbHVlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkRlbW9Mb2FkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25EZW1vU3RhdGUnLCAoKSA9PntcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb25EZW1vTG9hZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEFuaW1hdGlvbkhlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLmxheW91dERlbW9Mb2FkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9MYXlvdXRBcGkoKTtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9UeXBlT00oKSB7XHJcbiAgICAgICAgaWYgKCF3aW5kb3cuQ1NTVHJhbnNmb3JtVmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IC8vbmV3IENTU1RyYW5zZm9ybVZhbHVlKFtcclxuICAgICAgICAgICAgbmV3IENTU1JvdGF0ZSgwLDAsMSwgQ1NTLmRlZygwKSlcclxuICAgICAgICAvL10pO1xyXG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmVEZW1vJyk7XHJcbiAgICAgICAgc3F1YXJlLmF0dHJpYnV0ZVN0eWxlTWFwLnNldCgndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcclxuICAgICAgICBsZXQgcmFmSWQ7XHJcbiAgICAgICAgbGV0IHN0b3BBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICBmdW5jdGlvbiBkcmF3KCl7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybS5hbmdsZS52YWx1ZSA9ICh0cmFuc2Zvcm0uYW5nbGUudmFsdWUgKyA1KSAlIDM2MDtcclxuICAgICAgICAgICAgc3F1YXJlLmF0dHJpYnV0ZVN0eWxlTWFwLnNldCgndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4gZHJhdygpKTtcclxuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9Dc3NWYXIoKSB7XHJcbiAgICAgICAgLyoqICovXHJcbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcclxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudCBoMntcclxuICAgIC0tYS1zdXBlci12YXI6ICNGRkY7XHJcbn1cclxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XHJcblxyXG59XHJcbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xyXG5cclxufWBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBfZnJhbWVJbmNyZW1lbnQoKXtcclxuICAgICAgICBpZiAodGhpcy5mcmFtZSA9PT0gOSkge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub2lzZScpLnN0eWxlLnNldFByb3BlcnR5KCctLWZyYW1lJywgdGhpcy5mcmFtZSk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2ZyYW1lSW5jcmVtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vUHJvcGVydGllc0FuZFZhbHVlcygpIHtcclxuICAgICAgICBDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcbiAgICAgICAgICAgIG5hbWU6ICctLXByb3BlcnRpZXMtbW92ZS1yZWdpc3RlcicsXHJcbiAgICAgICAgICAgIHN5bnRheDogJzxsZW5ndGg+JyxcclxuICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiAnMHB4JyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnRuLXNxdWFyZS1wcm9wZXJ0aWVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtcHJvcGVydGllcycpLmNsYXNzTGlzdC5hZGQoJ21vdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnRuLXNxdWFyZS1uby1wcm9wZXJ0aWVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCdtb3ZlJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcXVhcmUtbm8tcHJvcGVydGllcycpLmNsYXNzTGlzdC5hZGQoJ21vdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb1BhaW50QXBpKCkge1xyXG4gICAgICAgIChDU1MucGFpbnRXb3JrbGV0IHx8IHBhaW50V29ya2xldCkuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9jaXJjbGUtd29ya2xldC5qcycpO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDc3MoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhaW50LWFwaS1jc3MnKSxcclxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudC1wYWludC1hcGkge1xyXG4gICAgLS1jaXJjbGUtY29sb3I6ICNGRkY7XHJcbiAgICAtLXdpZHRoLWNpcmNsZTogMTAwcHg7XHJcbiAgICB3aWR0aDogdmFyKC0td2lkdGgtY2lyY2xlKTtcclxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZSwgMHB4LCByZWQpO1xyXG59YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGknKSxcclxuICAgICAgICAgICAgJ2phdmFzY3JpcHQnLFxyXG4gICAgICAgICAgICBgcGFpbnQoY3R4LCBnZW9tLCBwcm9wZXJ0aWVzLCBhcmdzKSB7XHJcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNlbnRlciBwb2ludCBhbmQgcmFkaXVzLlxyXG4gICAgY29uc3QgcmFkaXVzID0gTWF0aC5taW4oZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMik7XHJcbiAgICBjb25zdCBib3JkZXIgPSBhcmdzWzBdLnZhbHVlO1xyXG4gICAgLy8gQ2hhbmdlIHRoZSBib3JkZXIgY29sb3IuXHJcbiAgICBjdHguZmlsbFN0eWxlID0gYXJnc1sxXS50b1N0cmluZygpO1xyXG4gICAgY3R4LmFyYyhnZW9tLndpZHRoIC0gYm9yZGVyIC8gMiwgZ2VvbS5oZWlnaHQgLSAgLSBib3JkZXIgLyAyLCByYWRpdXMgLSBib3JkZXIsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgIC8vIENoYW5nZSB0aGUgZmlsbCBjb2xvci5cclxuICAgIGNvbnN0IGNvbG9yID0gcHJvcGVydGllcy5nZXQoJy0tY2lyY2xlLWNvbG9yJykudG9TdHJpbmcoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIGN0eC5hcmMoZ2VvbS53aWR0aCAvIDIsIGdlb20uaGVpZ2h0IC8gMiwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbn1gKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb0xheW91dEFwaSgpe1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNkZW1vTGF5b3V0V29ya2xldCBkaXYnKS5mb3JFYWNoKGVsZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gZWxlbS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgLy8gQ3V0IG91dCBhIHJhbmRvbSBhbW91bnQgb2YgdGV4dCwgYnV0IGtlZXAgYXQgbGVhc3QgMTAgY2hhcmFjdGVyc1xyXG4gICAgICAgICAgICBlbGVtLnRleHRDb250ZW50ID0gdC5zbGljZSgwLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodC5sZW5ndGggLSAxMCkgKyAxMCkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgQ1NTLmxheW91dFdvcmtsZXQuYWRkTW9kdWxlKCcuL3NjcmlwdHMvaG91ZGluaS9tYXNvbnJ5LXdvcmtsZXQuanMnKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbHMgPSAzO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTWFzb25yeUJ0bk1pbnVzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG4gICAgICAgICAgICBjb2xzID0gTWF0aC5tYXgoMywgY29scyAtIDEpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlDb2xzJykuaW5uZXJIVE1MID0gY29scztcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9MYXlvdXRXb3JrbGV0Jykuc3R5bGUuc2V0UHJvcGVydHkoJy0tbWFzb25yeS1jb2x1bW5zJywgY29scyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5QnRuUGx1cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuICAgICAgICAgICAgY29scyA9IE1hdGgubWluKDgsIGNvbHMgKyAxKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5Q29scycpLmlubmVySFRNTCA9IGNvbHM7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTGF5b3V0V29ya2xldCcpLnN0eWxlLnNldFByb3BlcnR5KCctLW1hc29ucnktY29sdW1ucycsIGNvbHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcclxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXHJcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxyXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAncGFyYWlzby1kYXJrJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyhjb2RlTWlycm9yQ3NzLmdldFZhbHVlKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MgKyAnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdGljdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBseUNvZGVNaXJvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlTWlycm9ySlMgPSBDb2RlTWlycm9yKGVsdCwge1xyXG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXHJcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcclxuICAgICAgICAgICAgdGhlbWU6ICdwYXJhaXNvLWRhcmsnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xyXG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE1ZW0nO1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xyXG5jb25zdCBDT0xfV0lEVEggPSAzNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtcclxuICAgICAgICBrZXlFbHQsXHJcbiAgICAgICAgcG9zaXRpb25BcnJheVxyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XHJcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW5pdFwiLFxyXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmltcG9ydCB7XHJcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXHJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XHJcblxyXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xyXG5jb25zdCBDT0xfV0lEVEggPSAzNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvblxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDksXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb24gaW4gSlNcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZS1pbi1qcycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNjBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyA6OlBhcnRcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BhcnQnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVGVtcGxhdGUgSW5zdGFudGlhdGlvblxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAndGVtcGxhdGUtaW5zdGFudGlhdGlvbicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBIVE1MIE1vZHVsZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnaHRtbC1tb2R1bGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEwLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFBhaW50IEFQSVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncGFpbnQtYXBpJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDAsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogOCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gZ2VuZXJpYyBzZW5zb3JcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2dlbmVyaWMtc2Vuc29yJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFjY2VsZXJvbWV0ZXIgc2Vuc29yXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdhY2NlbGVyb21ldGVyLXNlbnNvcicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkhlYWRlcntcclxuXHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgaW5pdCgpIHtcclxuXHRcdFsnLS1hdmF0YXItc2l6ZScsICctLWhlYWRlci1oZWlnaHQnLCAnLS1mb250LWJhc2UnLCAnLS1iYXItaGVpZ2h0JywgJy0tYXZhdGFyLWJvcmRlciddXHJcblx0XHQgIC5mb3JFYWNoKG5hbWUgPT4ge1xyXG5cdFx0XHRDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcblx0XHRcdCAgbmFtZSxcclxuXHRcdFx0ICBzeW50YXg6ICc8bGVuZ3RoPicsXHJcblx0XHRcdCAgaW5pdGlhbFZhbHVlOiAnMHB4JyxcclxuXHRcdFx0ICBpbmhlcml0czogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdCAgfSk7XHJcblxyXG5cdFx0YXdhaXQgYW5pbWF0aW9uV29ya2xldC5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2FuaW1hdG9yLWhlYWRlci5qcycpO1xyXG5cclxuXHRcdGNvbnN0IHNpemVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0JykuY29tcHV0ZWRTdHlsZU1hcCgpO1xyXG5cdFx0Y29uc3Qgc2Nyb2xsU291cmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0Jyk7XHJcblx0XHRjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQgLmF2YXRhcicpO1xyXG5cdFx0Y29uc3QgYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0IC5iYXInKTtcclxuXHRcdGNvbnN0IG1heFRpbWUgPSAxMDAwO1xyXG5cdFx0Y29uc3QgZXBzaWxvbiA9IDFlLTI7XHJcblx0XHRjb25zdCBzY3JvbGxUaW1lbGluZSA9IG5ldyBTY3JvbGxUaW1lbGluZSh7XHJcblx0XHQgIHNjcm9sbFNvdXJjZSxcclxuXHRcdCAgb3JpZW50YXRpb246ICdibG9jaycsXHJcblx0XHQgIHRpbWVSYW5nZTogbWF4VGltZSxcclxuXHRcdH0pO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coYXZhdGFyU2Nyb2xsRW5kUG9zLCBhdmF0YXJTY3JvbGxFbmRPZmZzZXQpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coc2Nyb2xsU2l6ZSk7XHJcblx0XHRjb25zdCBhdmF0YXJFZmZlY3QgPSBuZXcgS2V5ZnJhbWVFZmZlY3QoYXZhdGFyLCBbXHJcblx0XHQgIHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoMSlgLCBlYXNpbmc6ICdlYXNlLWluLW91dCcsIG9mZnNldDogMH0sXHJcblx0XHQgIHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoJHswLyphdmF0YXJUYXJnZXRTY2FsZSovfSlgLCBlYXNpbmc6ICdsaW5lYXInLCBvZmZzZXQ6IDAgLyphdmF0YXJTY3JvbGxFbmRPZmZzZXQqL30sXHJcblx0XHQgIHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7MC8qYXZhdGFyVGFyZ2V0VHJhbnNsYXRlKi99cHgpIHNjYWxlKCR7MC8qYXZhdGFyVGFyZ2V0U2NhbGUqL30pYCwgb2Zmc2V0OiAxfSxcclxuXHRcdF0sIHtcclxuXHRcdCAgZHVyYXRpb246IG1heFRpbWUgKyBlcHNpbG9uLFxyXG5cdFx0ICBmaWxsOiAnYm90aCcsXHJcblx0XHQgIGl0ZXJhdGlvbnM6IEluZmluaXR5LFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bmV3IFdvcmtsZXRBbmltYXRpb24oJ2FuaW1hdG9yLWhlYWRlcicsXHJcblx0XHQgIFthdmF0YXJFZmZlY3RdLFxyXG5cdFx0ICBzY3JvbGxUaW1lbGluZSxcclxuXHRcdCAge31cclxuXHRcdCkucGxheSgpO1xyXG5cclxuXHRcdGNvbnN0IGJhckVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdChcclxuXHRcdCAgYmFyLFxyXG5cdFx0ICBbXHJcblx0XHRcdHtvcGFjaXR5OiAwLCBvZmZzZXQ6IDB9LFxyXG5cdFx0XHR7b3BhY2l0eTogMSwgb2Zmc2V0OiAwIC8qYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0Ki99LFxyXG5cdFx0XHR7b3BhY2l0eTogMSwgb2Zmc2V0OiAxfVxyXG5cdFx0ICBdLFxyXG5cdFx0ICB7XHJcblx0XHRcdGR1cmF0aW9uOiBtYXhUaW1lICsgZXBzaWxvbixcclxuXHRcdFx0ZmlsbDogJ2JvdGgnLFxyXG5cdFx0XHRpdGVyYXRpb25zOiBJbmZpbml0eSxcclxuXHRcdFx0LyogY3JidWcoNzc5MTg5KTogVXNlIGluZmluaXR5IGl0ZXJhdGlvbiBhbmQgbWF4RHVyYXRpb24gdG8gYXZvaWQgZWZmZWN0XHJcblx0XHRcdFx0cHJlbWF0dXJlbHkgZmluaXNoaW5nLlxyXG5cclxuXHRcdFx0XHRCVFcsIFdlYiBBbmltYXRpb25zIHVzZXMgYW4gZW5kcG9pbnQtZXhjbHVzaXZlIHRpbWluZyBtb2RlbCwgd2hpY2ggbWVhblxyXG5cdFx0XHRcdHdoZW4gdGltZWxpbmUgaXMgYXQgXCJkdXJhdGlvblwiIHRpbWUsIGl0IGlzIGNvbnNpZGVyZWQgdG8gYmUgYXQgMCB0aW1lIG9mIHRoZVxyXG5cdFx0XHRcdHNlY29uZCBpdGVyYXRpb24uIFRvIGF2b2lkIHRoaXMsIHdlIGVuc3VyZSBvdXIgbWF4IHRpbWUgKG1heCBzY3JvbGwgb2Zmc2V0KSBuZXZlclxyXG5cdFx0XHRcdHJlYWNoZXMgZHVyYXRpb24gYnkgaGF2aW5nIGR1cmF0aW9uIGFuIGVwc2lsb24gbGFyZ2VyLiAgVGhpcyBoYWNrIGlzIG5vdFxyXG5cdFx0XHRcdG5lZWRlZCBvbmNlIHdlIGZpeCB0aGUgb3JpZ2luYWwgYnVnIGFib3ZlLlxyXG5cdFx0XHQgICovXHJcblx0XHQgIH1cclxuXHRcdCk7XHJcblx0XHRuZXcgV29ya2xldEFuaW1hdGlvbignYW5pbWF0b3ItaGVhZGVyJyxcclxuXHRcdCAgW2JhckVmZmVjdF0sXHJcblx0XHQgIHNjcm9sbFRpbWVsaW5lLFxyXG5cdFx0ICB7fVxyXG5cdFx0KS5wbGF5KCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gdXBkYXRlKCkge1xyXG5cdFx0ICBjb25zdCBjbGllbnRIZWlnaHQgPSBzY3JvbGxTb3VyY2UuY2xpZW50SGVpZ2h0O1xyXG5cdFx0ICBjb25zdCBzY3JvbGxIZWlnaHQgPSBzY3JvbGxTb3VyY2Uuc2Nyb2xsSGVpZ2h0O1xyXG5cdFx0ICBjb25zdCBtYXhTY3JvbGwgPSBzY3JvbGxIZWlnaHQgLSBjbGllbnRIZWlnaHQ7XHJcblx0XHQgIGNvbnNvbGUubG9nKGNsaWVudEhlaWdodCwgc2Nyb2xsSGVpZ2h0LCBtYXhTY3JvbGwpO1xyXG5cdFx0ICBjb25zdCBhdmF0YXJUYXJnZXRTY2FsZSA9IHNpemVzLmdldCgnLS1iYXItaGVpZ2h0JykudmFsdWUgLyAoc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUgKyAyICogc2l6ZXMuZ2V0KCctLWF2YXRhci1ib3JkZXInKS52YWx1ZSk7XHJcblx0XHQgIGNvbnN0IGF2YXRhclNjcm9sbEVuZFBvcyA9IChzaXplcy5nZXQoJy0taGVhZGVyLWhlaWdodCcpLnZhbHVlLzIgLSBzaXplcy5nZXQoJy0tYXZhdGFyLXNpemUnKS52YWx1ZS8yIC0gc2l6ZXMuZ2V0KCctLWF2YXRhci1ib3JkZXInKS52YWx1ZSk7XHJcblx0XHQgIGNvbnN0IGF2YXRhclRhcmdldFRyYW5zbGF0ZSA9IG1heFNjcm9sbCAtIGF2YXRhclNjcm9sbEVuZFBvcztcclxuXHRcdCAgLy8gU3RvcCBzY2FsaW5nIGF0IHRoaXMgb2Zmc2V0IGFuZCBzdGFydCB0cmFuc2Zvcm0uXHJcblx0XHQgIGNvbnN0IGF2YXRhclNjcm9sbEVuZE9mZnNldCA9IGF2YXRhclNjcm9sbEVuZFBvcyAvIG1heFNjcm9sbDtcclxuXHJcblx0XHQgIGNvbnN0IGFla2YgPSBhdmF0YXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XHJcblx0XHQgIGFla2ZbMV0udHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoMHB4KSBzY2FsZSgke2F2YXRhclRhcmdldFNjYWxlfSlgO1xyXG5cdFx0ICBhZWtmWzFdLm9mZnNldCA9IGF2YXRhclNjcm9sbEVuZE9mZnNldDtcclxuXHRcdCAgYWVrZlsyXS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke2F2YXRhclRhcmdldFRyYW5zbGF0ZX1weCkgc2NhbGUoJHthdmF0YXJUYXJnZXRTY2FsZX0pYDtcclxuXHRcdCAgYXZhdGFyRWZmZWN0LnNldEtleWZyYW1lcyhhZWtmKTtcclxuXHJcblx0XHQgIGNvbnN0IGJla2YgPSBiYXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XHJcblx0XHQgIGJla2ZbMV0ub2Zmc2V0ID0gYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0O1xyXG5cdFx0ICBiYXJFZmZlY3Quc2V0S2V5ZnJhbWVzKGJla2YpO1xyXG5cdFx0fVxyXG5cdFx0dXBkYXRlKCk7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgXyA9PiB1cGRhdGUoKSk7XHJcblxyXG5cdFx0LyogY3JidWcoODI0NzgyKTogZGVsYXkgaXMgbm90IHdvcmtpbmcgYXMgZXhwZWN0ZWQgaW4gd29ya2xldCwgaW5zdGVhZCBoZXJlIHdlIGNvbWJpbmVcclxuXHRcdCAgIHdoYXQgd291bGQgaGF2ZSBiZWVuIGEgZGVsYXllZCBhbmltYXRpb24gd2l0aCB0aGUgb3RoZXIgYXZhdGFyIGFuaW1hdGlvbiBidXQgc3RhcnRcclxuXHRcdCAgIGl0IGF0IGEgZGlmZmVyZW50IG9mZnNldC5cclxuXHJcblx0XHQgIG5ldyBXb3JrbGV0QW5pbWF0aW9uKCd0d2l0dGVyLWhlYWRlcicsXHJcblx0XHRcdFtcclxuXHRcdFx0ICBuZXcgS2V5ZnJhbWVFZmZlY3QoYXZhdGFyLCBbXHJcblx0XHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoMHB4KWB9LFxyXG5cdFx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7c2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0fXB4KWB9LFxyXG5cdFx0XHQgIF0sIHtcclxuXHRcdFx0XHRkZWxheTogYXZhdGFyU2Nyb2xsRW5kUG9zL3Njcm9sbEhlaWdodCAqIG1heFRpbWUsXHJcblx0XHRcdFx0ZHVyYXRpb246IChzY3JvbGxIZWlnaHQgLSBjbGllbnRIZWlnaHQpL3Njcm9sbEhlaWdodCAqIG1heFRpbWUsXHJcblx0XHRcdFx0ZmlsbDogJ2JvdGgnLFxyXG5cdFx0XHQgIH0pLFxyXG5cdFx0XHRdLFxyXG5cdFx0XHRzY3JvbGxUaW1lbGluZSxcclxuXHRcdFx0e31cclxuXHRcdCAgKS8vLnBsYXkoKTtcclxuXHRcdCovXHJcblx0fVxyXG5cclxufVxyXG5cclxuIiwiZXhwb3J0IGNsYXNzIE5vaXNlIHtcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0dGhpcy5jYW52YXM7XHJcblx0XHR0aGlzLmN0eDtcclxuXHRcdHRoaXMud1dpZHRoO1xyXG5cdFx0dGhpcy53SGVpZ2h0O1xyXG5cdFx0dGhpcy5ub2lzZURhdGEgPSBbXTtcclxuXHRcdHRoaXMuZnJhbWUgPSAwO1xyXG5cdFx0dGhpcy5sb29wVGltZW91dDtcclxuXHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdC8vIENyZWF0ZSBOb2lzZVxyXG4gICAgY3JlYXRlTm9pc2UoKSB7XHJcbiAgICAgICAgY29uc3QgaWRhdGEgPSB0aGlzLmN0eC5jcmVhdGVJbWFnZURhdGEodGhpcy53V2lkdGgsIHRoaXMud0hlaWdodCk7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyMzIgPSBuZXcgVWludDMyQXJyYXkoaWRhdGEuZGF0YS5idWZmZXIpO1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IGJ1ZmZlcjMyLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyMzJbaV0gPSAweGZmMDAwMDAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vaXNlRGF0YS5wdXNoKGlkYXRhKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIFBsYXkgTm9pc2VcclxuICAgIHBhaW50Tm9pc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWUgPT09IDkpIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdHgucHV0SW1hZ2VEYXRhKHRoaXMubm9pc2VEYXRhW3RoaXMuZnJhbWVdLCAwLCAwKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIExvb3BcclxuICAgIGxvb3AoKSB7XHJcbiAgICAgICAgdGhpcy5wYWludE5vaXNlKHRoaXMuZnJhbWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxvb3BUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9LCAoMTAwMCAvIDI1KSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBTZXR1cFxyXG4gICAgc2V0dXAoKSB7XHJcbiAgICAgICAgdGhpcy53V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICB0aGlzLndIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53V2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy53SGVpZ2h0O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVOb2lzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaXNlJyk7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwKCk7XHJcbiAgICB9O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0RXZlbnRzXHJcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBEZW1vc1xyXG59IGZyb20gJy4vZGVtb3MuanMnO1xyXG5pbXBvcnQge05vaXNlfSBmcm9tICcuL2hvdWRpbmkvbm9pc2UuanMnO1xyXG5pbXBvcnQge0FuaW1hdGlvbnN9IGZyb20gJy4vYW5pbWF0aW9ucy9hbmltLmpzJztcclxuXHJcblxyXG5cclxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcclxuXHJcblxyXG4gICAgICAgIENTUy5yZWdpc3RlclByb3BlcnR5KHtcclxuICAgICAgICAgICAgbmFtZTogJy0tY2FkcmUtY29sb3InLFxyXG4gICAgICAgICAgICBzeW50YXg6ICc8Y29sb3I+IHwgbm9uZScsXHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogJ3doaXRlJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2FkcmUtd29ya2xldC5qcycpO1xyXG4gICAgICAgIG5ldyBOb2lzZSgpO1xyXG4gICAgICAgIG5ldyBBbmltYXRpb25zKCk7XHJcbiAgICAgICAgLy8gbmV3IFR5cGVUZXh0KCk7XHJcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xyXG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcclxuICAgICAgICAgICAgLy8gbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyJdfQ==
