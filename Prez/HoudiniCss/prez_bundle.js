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
            new _highlightEvent.HighlightEvents();
        } else {
            // document.getElementById('magicVideo').style.display = 'none';
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./animations/anim.js":1,"./demos.js":2,"./highlightEvent.js":6,"./houdini/noise.js":8}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FuaW1hdGlvbnMvYW5pbS5qcyIsInNjcmlwdHMvZGVtb3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUNzcy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5SnMuanMiLCJzY3JpcHRzL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0cy9oaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHMvaG91ZGluaS9hbmltYXRpb24taGVhZGVyLmpzIiwic2NyaXB0cy9ob3VkaW5pL25vaXNlLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7SUFDYSxVLFdBQUEsVTtBQUNaLHVCQUFjO0FBQUE7O0FBQ2IsT0FBSyxjQUFMOztBQUVBLE9BQUssZUFBTDtBQUNBOzs7O21DQUVnQjtBQUNoQixPQUFJLGdCQUFnQixDQUFwQjtBQUNBLE9BQU0sZ0JBQWdCLENBQXRCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxlQUFlLENBQXJCO0FBQ0EsT0FBTSxjQUFjLENBQXBCO0FBQ0EsT0FBTSxhQUFhLENBQW5COztBQUVBLFlBQVMsaUJBQVQsR0FBNEI7QUFDM0I7QUFDQSxZQUFPLGFBQVA7QUFDQyxVQUFLLGFBQUw7QUFBb0I7QUFDbkIsZ0JBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxDQUErQyxHQUEvQyxDQUFtRCxNQUFuRDtBQUNBLGdCQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBcEMsQ0FBOEMsR0FBOUMsQ0FBa0QsTUFBbEQ7QUFDQSxnQkFBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxTQUExQyxDQUFvRCxHQUFwRCxDQUF3RCxNQUF4RDtBQUNBO0FBQ0E7QUFDRCxVQUFLLFlBQUw7QUFBbUI7QUFDbEIsZ0JBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsU0FB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QUFULENBQXdCLE9BQXhCLENBQWQ7QUFDQSxpQkFBSyxHQUFMLEdBQVcsS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixDQUFYOztBQUVBLGlCQUFLLEtBQUw7QUFDSDs7Ozs7OztBQ3pFTDs7QUFFQTs7QUFDQTs7QUFHQTs7QUFHQTs7QUFDQTs7QUFJQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUV0QixZQUFNLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUF0Qzs7QUFHQSxZQUFJLGdCQUFKLENBQXFCO0FBQ2pCLGtCQUFNLGVBRFc7QUFFakIsb0JBQVEsZ0JBRlM7QUFHakIsMEJBQWM7QUFIRyxTQUFyQjtBQUtBLFNBQUMsSUFBSSxZQUFKLElBQW9CLFlBQXJCLEVBQW1DLFNBQW5DLENBQTZDLG9DQUE3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWDtBQUNBO0FBQ0gsU0FIRCxNQUdLO0FBQ0Q7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQTdCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiJ3VzZSBzdHJpY3QnXHJcbmV4cG9ydCBjbGFzcyBBbmltYXRpb25zIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuX2Jyb3dzZXJFbmdpbmUoKTtcclxuXHJcblx0XHR0aGlzLl9hbmltYXRlSG91ZGluaSgpO1xyXG5cdH1cclxuXHJcblx0X2Jyb3dzZXJFbmdpbmUoKSB7XHJcblx0XHRsZXQgc3RlcEFuaW1hdGlvbiA9IDA7XHJcblx0XHRjb25zdCBTVEVQX0RPV05MT0FEID0gMTtcclxuXHRcdGNvbnN0IFNURVBfUFJPQ0VTUyA9IDI7XHJcblx0XHRjb25zdCBTVEVQX0JST1dTRVIgPSAzO1xyXG5cdFx0Y29uc3QgU1RFUF9MQVlPVVQgPSA0O1xyXG5cdFx0Y29uc3QgU1RFUF9QQUlOVCA9IDU7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZnJhZ21lbnRBbmltYXRpb24oKXtcclxuXHRcdFx0c3RlcEFuaW1hdGlvbisrO1xyXG5cdFx0XHRzd2l0Y2goc3RlcEFuaW1hdGlvbil7XHJcblx0XHRcdFx0Y2FzZShTVEVQX0RPV05MT0FEKTp7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNsb3VkJykuY2xhc3NMaXN0LmFkZCgnaHRtbCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LmFkZCgnaHRtbCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWRvd25sb2FkJykuY2xhc3NMaXN0LmFkZCgnaHRtbCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhc2UoU1RFUF9QUk9DRVNTKTp7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtZG93bmxvYWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNsb3VkJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLXBhcnNpbmcnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWh0bWwnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLXByb2Nlc3MnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLW9iamVjdHMnKS5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhc2UoU1RFUF9CUk9XU0VSKTp7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFyc2luZycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctcHJvY2VzcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXInKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXInKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1jc3Mtb2JqZWN0cycpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyLWxheW91dCcpLmNsYXNzTGlzdC5hZGQoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhc2UoU1RFUF9MQVlPVVQpOntcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LmFkZCgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhc2UoU1RFUF9QQUlOVCk6e1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItbGF5b3V0Jyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUtcGFpbnQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItcGFpbnQnKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QuYWRkKCdyZW5kZXItcGFpbnQnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdicm93c2VyLWVuZ2luZScsICgpPT57XHJcblx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnJhZ21lbnRBbmltYXRpb24pO1xyXG5cdFx0XHRzdGVwQW5pbWF0aW9uID0gMDtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGNsZWFyQW5pbSgpe1xyXG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnJhZ21lbnRBbmltYXRpb24pO1xyXG5cdFx0XHRcdFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY2xvdWQnKS5jbGFzc0xpc3QucmVtb3ZlKCdodG1sJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgnaHRtbCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1kb3dubG9hZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2h0bWwnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLXByb2Nlc3MnKS5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1odG1sJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWNzcy1vYmplY3RzJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYXJzaW5nJykuY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctb2JqZWN0cycpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlcicpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctY3NzLW9iamVjdHMnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXInKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Zy1icm93c2VyJykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyJyk7XHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlLWxheW91dCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1sYXlvdXQnKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3ZnLWJyb3dzZXItbGF5b3V0JykuY2xhc3NMaXN0LnJlbW92ZSgncmVuZGVyLWxheW91dCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZS1wYWludCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3JlbmRlci1wYWludCcpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdmctYnJvd3Nlci1sYXlvdXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdyZW5kZXItcGFpbnQnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBjbGVhckFuaW0pO1xyXG5cdFx0XHR9LDEwMCk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRfYW5pbWF0ZUhvdWRpbmkoKXtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGUtaG91ZGluaS13b3JrZmxvdycsICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIGNhbGxCYWNrRnJhZ21lbnQpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbEJhY2tGcmFnbWVudCgpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VkaW5pX3dvcmtmbG93LTEnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdWRpbmlfd29ya2Zsb3ctMicpLnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICAgICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgY2FsbEJhY2tGcmFnbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHR9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCB7XHJcbiAgICBBcHBseUNzc1xyXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcclxuaW1wb3J0IHtcclxuICAgIEFwcGx5Q29kZU1pcm9yXHJcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlKcy5qcyc7XHJcbmltcG9ydCB7QW5pbWF0aW9uSGVhZGVyfSBmcm9tICcuL2hvdWRpbmkvYW5pbWF0aW9uLWhlYWRlci5qcydcclxuXHJcbmV4cG9ydCBjbGFzcyBEZW1vcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9UeXBlT00oKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVtb1Byb3BlcnRpZXNBbmRWYWx1ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25EZW1vTG9hZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uRGVtb1N0YXRlJywgKCkgPT57XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uRGVtb0xvYWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBBbmltYXRpb25IZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXREZW1vTG9hZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9kZW1vTGF5b3V0QXBpKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vVHlwZU9NKCkge1xyXG4gICAgICAgIGlmICghd2luZG93LkNTU1RyYW5zZm9ybVZhbHVlKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSAvL25ldyBDU1NUcmFuc2Zvcm1WYWx1ZShbXHJcbiAgICAgICAgICAgIG5ldyBDU1NSb3RhdGUoMCwwLDEsIENTUy5kZWcoMCkpXHJcbiAgICAgICAgLy9dKTtcclxuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlRGVtbycpO1xyXG4gICAgICAgIHNxdWFyZS5hdHRyaWJ1dGVTdHlsZU1hcC5zZXQoJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgbGV0IHJhZklkO1xyXG4gICAgICAgIGxldCBzdG9wQW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgZnVuY3Rpb24gZHJhdygpe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm0uYW5nbGUudmFsdWUgPSAodHJhbnNmb3JtLmFuZ2xlLnZhbHVlICsgNSkgJSAzNjA7XHJcbiAgICAgICAgICAgIHNxdWFyZS5hdHRyaWJ1dGVTdHlsZU1hcC5zZXQoJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IGRyYXcoKSk7XHJcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZJZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIF9kZW1vQ3NzVmFyKCkge1xyXG4gICAgICAgIC8qKiAqL1xyXG4gICAgICAgIG5ldyBBcHBseUNzcyhcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzJyksXHJcbiAgICAgICAgICAgIGAjcmVuZGVyLWVsZW1lbnQgaDJ7XHJcbiAgICAtLWEtc3VwZXItdmFyOiAjRkZGO1xyXG59XHJcbiNyZW5kZXItZWxlbWVudCAudGV4dC0xe1xyXG5cclxufVxyXG4jcmVuZGVyLWVsZW1lbnQgLnRleHQtMntcclxuXHJcbn1gXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgX2ZyYW1lSW5jcmVtZW50KCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWUgPT09IDkpIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9pc2UnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1mcmFtZScsIHRoaXMuZnJhbWUpO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9mcmFtZUluY3JlbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb1Byb3BlcnRpZXNBbmRWYWx1ZXMoKSB7XHJcbiAgICAgICAgQ1NTLnJlZ2lzdGVyUHJvcGVydHkoe1xyXG4gICAgICAgICAgICBuYW1lOiAnLS1wcm9wZXJ0aWVzLW1vdmUtcmVnaXN0ZXInLFxyXG4gICAgICAgICAgICBzeW50YXg6ICc8bGVuZ3RoPicsXHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogJzBweCcsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J0bi1zcXVhcmUtcHJvcGVydGllcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LnJlbW92ZSgnbW92ZScpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QuYWRkKCdtb3ZlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J0bi1zcXVhcmUtbm8tcHJvcGVydGllcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NxdWFyZS1uby1wcm9wZXJ0aWVzJykuY2xhc3NMaXN0LnJlbW92ZSgnbW92ZScpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3F1YXJlLW5vLXByb3BlcnRpZXMnKS5jbGFzc0xpc3QuYWRkKCdtb3ZlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9QYWludEFwaSgpIHtcclxuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLXdvcmtsZXQuanMnKTtcclxuXHJcbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGktY3NzJyksXHJcbiAgICAgICAgICAgIGAjcmVuZGVyLWVsZW1lbnQtcGFpbnQtYXBpIHtcclxuICAgIC0tY2lyY2xlLWNvbG9yOiAjRkZGO1xyXG4gICAgLS13aWR0aC1jaXJjbGU6IDEwMHB4O1xyXG4gICAgd2lkdGg6IHZhcigtLXdpZHRoLWNpcmNsZSk7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBwYWludChjaXJjbGUsIDBweCwgcmVkKTtcclxufWBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpJyksXHJcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcclxuICAgICAgICAgICAgYHBhaW50KGN0eCwgZ2VvbSwgcHJvcGVydGllcywgYXJncykge1xyXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1cy5cclxuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWluKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIpO1xyXG4gICAgY29uc3QgYm9yZGVyID0gYXJnc1swXS52YWx1ZTtcclxuICAgIC8vIENoYW5nZSB0aGUgYm9yZGVyIGNvbG9yLlxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGFyZ3NbMV0udG9TdHJpbmcoKTtcclxuICAgIGN0eC5hcmMoZ2VvbS53aWR0aCAtIGJvcmRlciAvIDIsIGdlb20uaGVpZ2h0IC0gIC0gYm9yZGVyIC8gMiwgcmFkaXVzIC0gYm9yZGVyLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAvLyBDaGFuZ2UgdGhlIGZpbGwgY29sb3IuXHJcbiAgICBjb25zdCBjb2xvciA9IHByb3BlcnRpZXMuZ2V0KCctLWNpcmNsZS1jb2xvcicpLnRvU3RyaW5nKCk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBjdHguYXJjKGdlb20ud2lkdGggLyAyLCBnZW9tLmhlaWdodCAvIDIsIHJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xyXG59YCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9MYXlvdXRBcGkoKXtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjZGVtb0xheW91dFdvcmtsZXQgZGl2JykuZm9yRWFjaChlbGVtID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdCA9IGVsZW0udGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIC8vIEN1dCBvdXQgYSByYW5kb20gYW1vdW50IG9mIHRleHQsIGJ1dCBrZWVwIGF0IGxlYXN0IDEwIGNoYXJhY3RlcnNcclxuICAgICAgICAgICAgZWxlbS50ZXh0Q29udGVudCA9IHQuc2xpY2UoMCwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHQubGVuZ3RoIC0gMTApICsgMTApKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIENTUy5sYXlvdXRXb3JrbGV0LmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvbWFzb25yeS13b3JrbGV0LmpzJyk7XHJcblxyXG4gICAgICAgIGxldCBjb2xzID0gMztcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb01hc29ucnlCdG5NaW51cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcclxuICAgICAgICAgICAgY29scyA9IE1hdGgubWF4KDMsIGNvbHMgLSAxKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9NYXNvbnJ5Q29scycpLmlubmVySFRNTCA9IGNvbHM7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTGF5b3V0V29ya2xldCcpLnN0eWxlLnNldFByb3BlcnR5KCctLW1hc29ucnktY29sdW1ucycsIGNvbHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTWFzb25yeUJ0blBsdXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcbiAgICAgICAgICAgIGNvbHMgPSBNYXRoLm1pbig4LCBjb2xzICsgMSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZW1vTWFzb25yeUNvbHMnKS5pbm5lckhUTUwgPSBjb2xzO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0xheW91dFdvcmtsZXQnKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1tYXNvbnJ5LWNvbHVtbnMnLCBjb2xzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0aWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcclxuICAgICAgICAgICAgbW9kZTogJ2NzcycsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxyXG4gICAgICAgICAgICB0aGVtZTogJ3BhcmFpc28tZGFyaydcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgICAgICB0aGlzLnN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XHJcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuc3R5bGVTaGVldCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9ICcnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcclxuXHJcbiAgICAgICAgY29kZU1pcnJvckNzcy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgICAgICBjb2RlTWlycm9yQ3NzLm9uKCdjaGFuZ2UnLCAoLi4ub2JqKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3MoY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFwcGx5Q3NzKGluaXRpYWxDb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUNzcyh2YWx1ZSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0LmRlbGV0ZVJ1bGUoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuICAgICAgICB2YWx1ZS5zcGxpdCgnfScpXHJcbiAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKHNlbGVjdG9yQ3NzID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yQ3NzICsgJ30nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG1vZGUsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcclxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXHJcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAncGFyYWlzby1kYXJrJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb2RlTWlycm9ySlMuc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XHJcbiAgICB9XHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcclxuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNWVtJztcclxuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7XHJcbiAgICAgICAga2V5RWx0LFxyXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcclxuICAgIH0pIHtcclxuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xyXG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xyXG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcclxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcclxuICAgICAgICB9KTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkhlYWRlcntcclxuXHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgaW5pdCgpIHtcclxuXHRcdFsnLS1hdmF0YXItc2l6ZScsICctLWhlYWRlci1oZWlnaHQnLCAnLS1mb250LWJhc2UnLCAnLS1iYXItaGVpZ2h0JywgJy0tYXZhdGFyLWJvcmRlciddXHJcblx0XHQgIC5mb3JFYWNoKG5hbWUgPT4ge1xyXG5cdFx0XHRDU1MucmVnaXN0ZXJQcm9wZXJ0eSh7XHJcblx0XHRcdCAgbmFtZSxcclxuXHRcdFx0ICBzeW50YXg6ICc8bGVuZ3RoPicsXHJcblx0XHRcdCAgaW5pdGlhbFZhbHVlOiAnMHB4JyxcclxuXHRcdFx0ICBpbmhlcml0czogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdCAgfSk7XHJcblxyXG5cdFx0YXdhaXQgYW5pbWF0aW9uV29ya2xldC5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2FuaW1hdG9yLWhlYWRlci5qcycpO1xyXG5cclxuXHRcdGNvbnN0IHNpemVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0JykuY29tcHV0ZWRTdHlsZU1hcCgpO1xyXG5cdFx0Y29uc3Qgc2Nyb2xsU291cmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0Jyk7XHJcblx0XHRjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVtb0FuaW1hdGlvbldvcmtsZXQgLmF2YXRhcicpO1xyXG5cdFx0Y29uc3QgYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbW9BbmltYXRpb25Xb3JrbGV0IC5iYXInKTtcclxuXHRcdGNvbnN0IG1heFRpbWUgPSAxMDAwO1xyXG5cdFx0Y29uc3QgZXBzaWxvbiA9IDFlLTI7XHJcblx0XHRjb25zdCBzY3JvbGxUaW1lbGluZSA9IG5ldyBTY3JvbGxUaW1lbGluZSh7XHJcblx0XHQgIHNjcm9sbFNvdXJjZSxcclxuXHRcdCAgb3JpZW50YXRpb246ICdibG9jaycsXHJcblx0XHQgIHRpbWVSYW5nZTogbWF4VGltZSxcclxuXHRcdH0pO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coYXZhdGFyU2Nyb2xsRW5kUG9zLCBhdmF0YXJTY3JvbGxFbmRPZmZzZXQpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coc2Nyb2xsU2l6ZSk7XHJcblx0XHRjb25zdCBhdmF0YXJFZmZlY3QgPSBuZXcgS2V5ZnJhbWVFZmZlY3QoYXZhdGFyLCBbXHJcblx0XHQgIHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoMSlgLCBlYXNpbmc6ICdlYXNlLWluLW91dCcsIG9mZnNldDogMH0sXHJcblx0XHQgIHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKDBweCkgc2NhbGUoJHswLyphdmF0YXJUYXJnZXRTY2FsZSovfSlgLCBlYXNpbmc6ICdsaW5lYXInLCBvZmZzZXQ6IDAgLyphdmF0YXJTY3JvbGxFbmRPZmZzZXQqL30sXHJcblx0XHQgIHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7MC8qYXZhdGFyVGFyZ2V0VHJhbnNsYXRlKi99cHgpIHNjYWxlKCR7MC8qYXZhdGFyVGFyZ2V0U2NhbGUqL30pYCwgb2Zmc2V0OiAxfSxcclxuXHRcdF0sIHtcclxuXHRcdCAgZHVyYXRpb246IG1heFRpbWUgKyBlcHNpbG9uLFxyXG5cdFx0ICBmaWxsOiAnYm90aCcsXHJcblx0XHQgIGl0ZXJhdGlvbnM6IEluZmluaXR5LFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bmV3IFdvcmtsZXRBbmltYXRpb24oJ2FuaW1hdG9yLWhlYWRlcicsXHJcblx0XHQgIFthdmF0YXJFZmZlY3RdLFxyXG5cdFx0ICBzY3JvbGxUaW1lbGluZSxcclxuXHRcdCAge31cclxuXHRcdCkucGxheSgpO1xyXG5cclxuXHRcdGNvbnN0IGJhckVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdChcclxuXHRcdCAgYmFyLFxyXG5cdFx0ICBbXHJcblx0XHRcdHtvcGFjaXR5OiAwLCBvZmZzZXQ6IDB9LFxyXG5cdFx0XHR7b3BhY2l0eTogMSwgb2Zmc2V0OiAwIC8qYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0Ki99LFxyXG5cdFx0XHR7b3BhY2l0eTogMSwgb2Zmc2V0OiAxfVxyXG5cdFx0ICBdLFxyXG5cdFx0ICB7XHJcblx0XHRcdGR1cmF0aW9uOiBtYXhUaW1lICsgZXBzaWxvbixcclxuXHRcdFx0ZmlsbDogJ2JvdGgnLFxyXG5cdFx0XHRpdGVyYXRpb25zOiBJbmZpbml0eSxcclxuXHRcdFx0LyogY3JidWcoNzc5MTg5KTogVXNlIGluZmluaXR5IGl0ZXJhdGlvbiBhbmQgbWF4RHVyYXRpb24gdG8gYXZvaWQgZWZmZWN0XHJcblx0XHRcdFx0cHJlbWF0dXJlbHkgZmluaXNoaW5nLlxyXG5cclxuXHRcdFx0XHRCVFcsIFdlYiBBbmltYXRpb25zIHVzZXMgYW4gZW5kcG9pbnQtZXhjbHVzaXZlIHRpbWluZyBtb2RlbCwgd2hpY2ggbWVhblxyXG5cdFx0XHRcdHdoZW4gdGltZWxpbmUgaXMgYXQgXCJkdXJhdGlvblwiIHRpbWUsIGl0IGlzIGNvbnNpZGVyZWQgdG8gYmUgYXQgMCB0aW1lIG9mIHRoZVxyXG5cdFx0XHRcdHNlY29uZCBpdGVyYXRpb24uIFRvIGF2b2lkIHRoaXMsIHdlIGVuc3VyZSBvdXIgbWF4IHRpbWUgKG1heCBzY3JvbGwgb2Zmc2V0KSBuZXZlclxyXG5cdFx0XHRcdHJlYWNoZXMgZHVyYXRpb24gYnkgaGF2aW5nIGR1cmF0aW9uIGFuIGVwc2lsb24gbGFyZ2VyLiAgVGhpcyBoYWNrIGlzIG5vdFxyXG5cdFx0XHRcdG5lZWRlZCBvbmNlIHdlIGZpeCB0aGUgb3JpZ2luYWwgYnVnIGFib3ZlLlxyXG5cdFx0XHQgICovXHJcblx0XHQgIH1cclxuXHRcdCk7XHJcblx0XHRuZXcgV29ya2xldEFuaW1hdGlvbignYW5pbWF0b3ItaGVhZGVyJyxcclxuXHRcdCAgW2JhckVmZmVjdF0sXHJcblx0XHQgIHNjcm9sbFRpbWVsaW5lLFxyXG5cdFx0ICB7fVxyXG5cdFx0KS5wbGF5KCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gdXBkYXRlKCkge1xyXG5cdFx0ICBjb25zdCBjbGllbnRIZWlnaHQgPSBzY3JvbGxTb3VyY2UuY2xpZW50SGVpZ2h0O1xyXG5cdFx0ICBjb25zdCBzY3JvbGxIZWlnaHQgPSBzY3JvbGxTb3VyY2Uuc2Nyb2xsSGVpZ2h0O1xyXG5cdFx0ICBjb25zdCBtYXhTY3JvbGwgPSBzY3JvbGxIZWlnaHQgLSBjbGllbnRIZWlnaHQ7XHJcblx0XHQgIGNvbnNvbGUubG9nKGNsaWVudEhlaWdodCwgc2Nyb2xsSGVpZ2h0LCBtYXhTY3JvbGwpO1xyXG5cdFx0ICBjb25zdCBhdmF0YXJUYXJnZXRTY2FsZSA9IHNpemVzLmdldCgnLS1iYXItaGVpZ2h0JykudmFsdWUgLyAoc2l6ZXMuZ2V0KCctLWF2YXRhci1zaXplJykudmFsdWUgKyAyICogc2l6ZXMuZ2V0KCctLWF2YXRhci1ib3JkZXInKS52YWx1ZSk7XHJcblx0XHQgIGNvbnN0IGF2YXRhclNjcm9sbEVuZFBvcyA9IChzaXplcy5nZXQoJy0taGVhZGVyLWhlaWdodCcpLnZhbHVlLzIgLSBzaXplcy5nZXQoJy0tYXZhdGFyLXNpemUnKS52YWx1ZS8yIC0gc2l6ZXMuZ2V0KCctLWF2YXRhci1ib3JkZXInKS52YWx1ZSk7XHJcblx0XHQgIGNvbnN0IGF2YXRhclRhcmdldFRyYW5zbGF0ZSA9IG1heFNjcm9sbCAtIGF2YXRhclNjcm9sbEVuZFBvcztcclxuXHRcdCAgLy8gU3RvcCBzY2FsaW5nIGF0IHRoaXMgb2Zmc2V0IGFuZCBzdGFydCB0cmFuc2Zvcm0uXHJcblx0XHQgIGNvbnN0IGF2YXRhclNjcm9sbEVuZE9mZnNldCA9IGF2YXRhclNjcm9sbEVuZFBvcyAvIG1heFNjcm9sbDtcclxuXHJcblx0XHQgIGNvbnN0IGFla2YgPSBhdmF0YXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XHJcblx0XHQgIGFla2ZbMV0udHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoMHB4KSBzY2FsZSgke2F2YXRhclRhcmdldFNjYWxlfSlgO1xyXG5cdFx0ICBhZWtmWzFdLm9mZnNldCA9IGF2YXRhclNjcm9sbEVuZE9mZnNldDtcclxuXHRcdCAgYWVrZlsyXS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke2F2YXRhclRhcmdldFRyYW5zbGF0ZX1weCkgc2NhbGUoJHthdmF0YXJUYXJnZXRTY2FsZX0pYDtcclxuXHRcdCAgYXZhdGFyRWZmZWN0LnNldEtleWZyYW1lcyhhZWtmKTtcclxuXHJcblx0XHQgIGNvbnN0IGJla2YgPSBiYXJFZmZlY3QuZ2V0S2V5ZnJhbWVzKCk7XHJcblx0XHQgIGJla2ZbMV0ub2Zmc2V0ID0gYXZhdGFyU2Nyb2xsRW5kT2Zmc2V0O1xyXG5cdFx0ICBiYXJFZmZlY3Quc2V0S2V5ZnJhbWVzKGJla2YpO1xyXG5cdFx0fVxyXG5cdFx0dXBkYXRlKCk7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgXyA9PiB1cGRhdGUoKSk7XHJcblxyXG5cdFx0LyogY3JidWcoODI0NzgyKTogZGVsYXkgaXMgbm90IHdvcmtpbmcgYXMgZXhwZWN0ZWQgaW4gd29ya2xldCwgaW5zdGVhZCBoZXJlIHdlIGNvbWJpbmVcclxuXHRcdCAgIHdoYXQgd291bGQgaGF2ZSBiZWVuIGEgZGVsYXllZCBhbmltYXRpb24gd2l0aCB0aGUgb3RoZXIgYXZhdGFyIGFuaW1hdGlvbiBidXQgc3RhcnRcclxuXHRcdCAgIGl0IGF0IGEgZGlmZmVyZW50IG9mZnNldC5cclxuXHJcblx0XHQgIG5ldyBXb3JrbGV0QW5pbWF0aW9uKCd0d2l0dGVyLWhlYWRlcicsXHJcblx0XHRcdFtcclxuXHRcdFx0ICBuZXcgS2V5ZnJhbWVFZmZlY3QoYXZhdGFyLCBbXHJcblx0XHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZVkoMHB4KWB9LFxyXG5cdFx0XHRcdHt0cmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7c2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0fXB4KWB9LFxyXG5cdFx0XHQgIF0sIHtcclxuXHRcdFx0XHRkZWxheTogYXZhdGFyU2Nyb2xsRW5kUG9zL3Njcm9sbEhlaWdodCAqIG1heFRpbWUsXHJcblx0XHRcdFx0ZHVyYXRpb246IChzY3JvbGxIZWlnaHQgLSBjbGllbnRIZWlnaHQpL3Njcm9sbEhlaWdodCAqIG1heFRpbWUsXHJcblx0XHRcdFx0ZmlsbDogJ2JvdGgnLFxyXG5cdFx0XHQgIH0pLFxyXG5cdFx0XHRdLFxyXG5cdFx0XHRzY3JvbGxUaW1lbGluZSxcclxuXHRcdFx0e31cclxuXHRcdCAgKS8vLnBsYXkoKTtcclxuXHRcdCovXHJcblx0fVxyXG5cclxufVxyXG5cclxuIiwiZXhwb3J0IGNsYXNzIE5vaXNlIHtcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0dGhpcy5jYW52YXM7XHJcblx0XHR0aGlzLmN0eDtcclxuXHRcdHRoaXMud1dpZHRoO1xyXG5cdFx0dGhpcy53SGVpZ2h0O1xyXG5cdFx0dGhpcy5ub2lzZURhdGEgPSBbXTtcclxuXHRcdHRoaXMuZnJhbWUgPSAwO1xyXG5cdFx0dGhpcy5sb29wVGltZW91dDtcclxuXHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdC8vIENyZWF0ZSBOb2lzZVxyXG4gICAgY3JlYXRlTm9pc2UoKSB7XHJcbiAgICAgICAgY29uc3QgaWRhdGEgPSB0aGlzLmN0eC5jcmVhdGVJbWFnZURhdGEodGhpcy53V2lkdGgsIHRoaXMud0hlaWdodCk7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyMzIgPSBuZXcgVWludDMyQXJyYXkoaWRhdGEuZGF0YS5idWZmZXIpO1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IGJ1ZmZlcjMyLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyMzJbaV0gPSAweGZmMDAwMDAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vaXNlRGF0YS5wdXNoKGlkYXRhKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIFBsYXkgTm9pc2VcclxuICAgIHBhaW50Tm9pc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnJhbWUgPT09IDkpIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdHgucHV0SW1hZ2VEYXRhKHRoaXMubm9pc2VEYXRhW3RoaXMuZnJhbWVdLCAwLCAwKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIExvb3BcclxuICAgIGxvb3AoKSB7XHJcbiAgICAgICAgdGhpcy5wYWludE5vaXNlKHRoaXMuZnJhbWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxvb3BUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9LCAoMTAwMCAvIDI1KSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBTZXR1cFxyXG4gICAgc2V0dXAoKSB7XHJcbiAgICAgICAgdGhpcy53V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICB0aGlzLndIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53V2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy53SGVpZ2h0O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVOb2lzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBJbml0XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaXNlJyk7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwKCk7XHJcbiAgICB9O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0RXZlbnRzXHJcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBEZW1vc1xyXG59IGZyb20gJy4vZGVtb3MuanMnO1xyXG5pbXBvcnQge05vaXNlfSBmcm9tICcuL2hvdWRpbmkvbm9pc2UuanMnO1xyXG5pbXBvcnQge0FuaW1hdGlvbnN9IGZyb20gJy4vYW5pbWF0aW9ucy9hbmltLmpzJztcclxuXHJcblxyXG5cclxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcclxuXHJcblxyXG4gICAgICAgIENTUy5yZWdpc3RlclByb3BlcnR5KHtcclxuICAgICAgICAgICAgbmFtZTogJy0tY2FkcmUtY29sb3InLFxyXG4gICAgICAgICAgICBzeW50YXg6ICc8Y29sb3I+IHwgbm9uZScsXHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogJ3doaXRlJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2FkcmUtd29ya2xldC5qcycpO1xyXG4gICAgICAgIG5ldyBOb2lzZSgpO1xyXG4gICAgICAgIG5ldyBBbmltYXRpb25zKCk7XHJcbiAgICAgICAgLy8gbmV3IFR5cGVUZXh0KCk7XHJcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xyXG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcclxuICAgICAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFnaWNWaWRlbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyJdfQ==
