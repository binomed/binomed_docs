(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Demos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _applyCss = require('./helper/applyCss.js');

var _HelperJSInCSS = require('./helper/HelperJSInCSS.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demos = exports.Demos = function () {
    function Demos() {
        _classCallCheck(this, Demos);

        try {

            this._demoCssVar();
            this._demoRandomColor();
            this._demoDependancy();
            this._demoArgs();
            this._demoPaintApiJsInCss();
        } catch (error) {
            console.error(error);
        }
    }

    _createClass(Demos, [{
        key: '_demoCssVar',
        value: function _demoCssVar() {

            var helperColor = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#pure-css'), "--randomColor");

            var helperBg1 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg1'), '--url', false, ['--imgToUse']);
            var helperBg2 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg2'), '--url', false, ['--imgToUse']);

            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), ':root{\n    --codemiror-size: 30px;\n}\n#pure-css{\n    background: var(--computeRandomColor);\n}\n#pure-css .bg{\n    background-image:var(--computeUrl);\n}\n#pure-css #bg1 {\n    --imgToUse: var(--img1);\n}\n#pure-css #bg2 {\n    --imgToUse: var(--img2);\n}\n', false, [helperColor, helperBg1, helperBg2]);
        }
    }, {
        key: '_demoRandomColor',
        value: function _demoRandomColor() {

            var helperColor = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#random-color-css'), "--randomColor");
            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-random'), '#random-color-css{\n    --randomColor: () => {\n        let red = Math.random()*255;\n        let green = Math.random()*255;\n        let blue = Math.random()*255;\n        return `rgb(${red},${green},${blue})`;\n    };\n    background: var(--computeRandomColor);\n}\n', false, [helperColor]);
        }
    }, {
        key: '_demoDependancy',
        value: function _demoDependancy() {

            var helperDependancy = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#dependancy-css h1'), "--dependancy", false);

            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-dependancy'), '#dependancy-css h1 {\n    --color:blue;\n    --dependancy : () => `var(--color)`;\n    color: var(--computeDependancy);\n}\n', false, [helperDependancy]);
        }
    }, {
        key: '_demoArgs',
        value: function _demoArgs() {

            var helperBg1 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg1-args'), '--url', false, ['--imgToUse']);
            var helperBg2 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg2-args'), '--url', false, ['--imgToUse']);

            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-args'), ':root{\n    --prefix: http://localhost:3000/assets/images/;\n    --img1: hack1.jpg;\n    --img2: hack2.jpg;\n}\n#args-css .bg{\n    --url: (img) => {\n        let prefix = `var(--prefix)`;\n        let urlConcat = prefix+img;\n        return "url("+urlConcat.split(\' \').join(\'\')+")";\n    };\n    background-image:var(--computeUrl);\n}\n#args-css #bg1-args {\n    --imgToUse: var(--img1);\n}\n#args-css #bg2-args {\n    --imgToUse: var(--img2);\n}\n', false, [helperBg1, helperBg2]);
        }
    }, {
        key: '_demoPaintApiJsInCss',
        value: function _demoPaintApiJsInCss() {
            if (!'paintWorklet' in CSS) {
                return;
            }

            (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-from-css-worklet.js');

            new _applyCss.ApplyCss(document.getElementById('codemirror-paint-api-js-in-css'), '#render-element-paint-api-js-in-css {\n    --circle-color: black;\n    --width-circle: 100px;\n    width: var(--width-circle);\n    background-image: paint(circle-from-css);\n    --circle: (ctx, geom) => {\n        const color = `var(--circle-color)`;\n        ctx.fillStyle = color;\n        const x = geom.width / 2;\n        const y = geom.height / 2;\n        let radius = Math.min(x, y);\n        ctx.beginPath();\n        ctx.fillStyle = color;\n        ctx.arc(x, y, radius, 0, 2 * Math.PI);\n        ctx.fill();\n    }\n}\n', true);
        }
    }]);

    return Demos;
}();

},{"./helper/HelperJSInCSS.js":2,"./helper/applyCss.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class that helps you to play with custom properties 
 * and turn them into JS Code that you execute
 * 
 * If your custom property is named --myVar, this will create a --computeMyVar
 * 
 */
var HelperJsInCss = exports.HelperJsInCss = function () {

    /**
     * 
     * @param {Element} element : The dom element where we find the custom property and where we apply the compute value
     * @param {string} customProperty : the complete name of custom property (with '--')
     * @param {boolean} loop : true if you want to watch the custom property
     * @param {string[]} args : the list of arguments you can pass to your function (arguments must be custom proerties)
     */
    function HelperJsInCss(element, customProperty, loop, args) {
        _classCallCheck(this, HelperJsInCss);

        this.element = element;
        this.customProperty = customProperty;
        this.lastValue = undefined;
        this.loop = loop;
        this.args = args;
        if (loop) {
            window.requestAnimationFrame(this.checkElements.bind(this));
        } else {
            this.checkElements();
        }
    }

    /**
     * Check the custom property and evaluate the script
     */


    _createClass(HelperJsInCss, [{
        key: "checkElements",
        value: function checkElements() {
            var _this = this;

            var value = window.getComputedStyle(this.element).getPropertyValue(this.customProperty);
            var computeArguments = [];
            if (this.args && this.args.length > 0) {
                this.args.forEach(function (argumentProperty) {
                    var argValue = window.getComputedStyle(_this.element).getPropertyValue(argumentProperty);
                    computeArguments.push(argValue);
                });
            }

            try {
                var evaluateValue = eval(value).apply(undefined, computeArguments);
                if (this.lastValue === evaluateValue) {
                    if (this.loop) {
                        window.requestAnimationFrame(this.checkElements.bind(this));
                    }
                    return;
                }

                this.lastValue = evaluateValue;
                var computeName = "--compute" + this.customProperty[2].toUpperCase() + this.customProperty.substring(3);
                this.element.style.setProperty(computeName, evaluateValue);
            } catch (err) {}

            if (this.loop) {
                window.requestAnimationFrame(this.checkElements.bind(this));
            }
        }
    }]);

    return HelperJsInCss;
}();

},{}],3:[function(require,module,exports){
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
        var jsInCssHelpers = arguments[3];

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
            if (jsInCssHelpers && jsInCssHelpers.length > 0) {
                jsInCssHelpers.forEach(function (jsInCssHelper) {
                    return jsInCssHelper.checkElements();
                });
            }
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
                value.split('}\n').map(function (str) {
                    return str.trim();
                }).forEach(function (selectorCss) {
                    try {
                        if (!selectorCss || selectorCss.length === 0) {
                            return;
                        }
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

},{}],5:[function(require,module,exports){
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

    //  My var space explanation
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'myvar',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            height: '200px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '270px',
            height: '300px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  limit url concat
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'url',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '180px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '250px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '450px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  limit Houdini
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'houdini',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '280px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '280px',
            height: '50px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '330px',
            height: '50px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '380px',
            height: '350px',
            leftMargin: '50px',
            width: '100%'
        }]
    });
};

},{"./helper/highlightCodeHelper.js":4}],6:[function(require,module,exports){
'use strict';

var _highlightEvent = require('./highlightEvent.js');

var _demos = require('./demos.js');

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

        new _highlightEvent.HighlightEvents();
        if (!inIframe) {
            new _demos.Demos();
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./demos.js":1,"./highlightEvent.js":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvSGVscGVySlNJbkNTUy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7O0FBR0E7Ozs7SUFFYSxLLFdBQUEsSztBQUVULHFCQUFjO0FBQUE7O0FBQ1YsWUFBSTs7QUFFQSxpQkFBSyxXQUFMO0FBQ0EsaUJBQUssZ0JBQUw7QUFDQSxpQkFBSyxlQUFMO0FBQ0EsaUJBQUssU0FBTDtBQUNBLGlCQUFLLG9CQUFMO0FBQ0gsU0FQRCxDQU9FLE9BQU8sS0FBUCxFQUFjO0FBQ1osb0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFDSDtBQUVKOzs7O3NDQUVhOztBQUVWLGdCQUFNLGNBQWMsSUFBSSw0QkFBSixDQUFrQixTQUFTLElBQVQsQ0FBYyxhQUFkLENBQTRCLFdBQTVCLENBQWxCLEVBQTRELGVBQTVELENBQXBCOztBQUVBLGdCQUFNLFlBQVksSUFBSSw0QkFBSixDQUFrQixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBbEIsRUFBa0QsT0FBbEQsRUFBMkQsS0FBM0QsRUFBa0UsQ0FBQyxZQUFELENBQWxFLENBQWxCO0FBQ0EsZ0JBQU0sWUFBWSxJQUFJLDRCQUFKLENBQWtCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUFsQixFQUFrRCxPQUFsRCxFQUEyRCxLQUEzRCxFQUFrRSxDQUFDLFlBQUQsQ0FBbEUsQ0FBbEI7O0FBRUE7QUFDQSxnQkFBSSxrQkFBSixDQUNJLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FESiwyUUFrQlIsS0FsQlEsRUFtQlIsQ0FBQyxXQUFELEVBQWMsU0FBZCxF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QTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsU0FEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixpQkFBSyxLQURPO0FBRVosb0JBQVEsT0FGSTtBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxNQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWSxFQVVaO0FBQ0MsaUJBQUssT0FETjtBQUVDLG9CQUFRLE1BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQVZZLEVBZVo7QUFDQyxpQkFBSyxPQUROO0FBRUMsb0JBQVEsT0FGVDtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBZlk7QUFISyxLQUF4QjtBQTBCSCxDOzs7QUM5RUw7O0FBRUE7O0FBR0E7O0FBS0EsQ0FBQyxrQkFBa0I7O0FBR2YsbUJBQWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBRUEsWUFBSSwrQkFBSjtBQUNBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxnQkFBSSxZQUFKO0FBQ0g7QUFFSjs7QUFJRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0FqQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q3NzXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcbmltcG9ydCB7IEhlbHBlckpzSW5Dc3N9IGZyb20gJy4vaGVscGVyL0hlbHBlckpTSW5DU1MuanMnXG5cbmV4cG9ydCBjbGFzcyBEZW1vcyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1JhbmRvbUNvbG9yKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vRGVwZW5kYW5jeSgpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb0FyZ3MoKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9QYWludEFwaUpzSW5Dc3MoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhcigpIHtcblxuICAgICAgICBjb25zdCBoZWxwZXJDb2xvciA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI3B1cmUtY3NzJyksIFwiLS1yYW5kb21Db2xvclwiKTtcblxuICAgICAgICBjb25zdCBoZWxwZXJCZzEgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmcxJyksICctLXVybCcsIGZhbHNlLCBbJy0taW1nVG9Vc2UnXSk7XG4gICAgICAgIGNvbnN0IGhlbHBlckJnMiA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZzInKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcblxuICAgICAgICAvKiogKi9cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzJyksXG4gICAgICAgICAgICBgOnJvb3R7XG4gICAgLS1jb2RlbWlyb3Itc2l6ZTogMzBweDtcbn1cbiNwdXJlLWNzc3tcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jb21wdXRlUmFuZG9tQ29sb3IpO1xufVxuI3B1cmUtY3NzIC5iZ3tcbiAgICBiYWNrZ3JvdW5kLWltYWdlOnZhcigtLWNvbXB1dGVVcmwpO1xufVxuI3B1cmUtY3NzICNiZzEge1xuICAgIC0taW1nVG9Vc2U6IHZhcigtLWltZzEpO1xufVxuI3B1cmUtY3NzICNiZzIge1xuICAgIC0taW1nVG9Vc2U6IHZhcigtLWltZzIpO1xufVxuYCxcbmZhbHNlLFxuW2hlbHBlckNvbG9yLCBoZWxwZXJCZzEsIGhlbHBlckJnMl1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfZGVtb1JhbmRvbUNvbG9yKCkge1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckNvbG9yID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcmFuZG9tLWNvbG9yLWNzcycpLCBcIi0tcmFuZG9tQ29sb3JcIik7XG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1yYW5kb20nKSxcbiAgICAgICAgICAgIGAjcmFuZG9tLWNvbG9yLWNzc3tcbiAgICAtLXJhbmRvbUNvbG9yOiAoKSA9PiB7XG4gICAgICAgIGxldCByZWQgPSBNYXRoLnJhbmRvbSgpKjI1NTtcbiAgICAgICAgbGV0IGdyZWVuID0gTWF0aC5yYW5kb20oKSoyNTU7XG4gICAgICAgIGxldCBibHVlID0gTWF0aC5yYW5kb20oKSoyNTU7XG4gICAgICAgIHJldHVybiBcXGByZ2IoXFwke3JlZH0sXFwke2dyZWVufSxcXCR7Ymx1ZX0pXFxgO1xuICAgIH07XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY29tcHV0ZVJhbmRvbUNvbG9yKTtcbn1cbmAsXG5mYWxzZSxcbltoZWxwZXJDb2xvcl1cbiAgICAgICAgKTtcbiAgICB9XG5cblxuICAgIF9kZW1vRGVwZW5kYW5jeSgpIHtcblxuICAgICAgICBjb25zdCBoZWxwZXJEZXBlbmRhbmN5ID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjZGVwZW5kYW5jeS1jc3MgaDEnKSwgXCItLWRlcGVuZGFuY3lcIiwgZmFsc2UpO1xuXG5cbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWRlcGVuZGFuY3knKSxcbiAgICAgICAgICAgIGAjZGVwZW5kYW5jeS1jc3MgaDEge1xuICAgIC0tY29sb3I6Ymx1ZTtcbiAgICAtLWRlcGVuZGFuY3kgOiAoKSA9PiBcXGB2YXIoLS1jb2xvcilcXGA7XG4gICAgY29sb3I6IHZhcigtLWNvbXB1dGVEZXBlbmRhbmN5KTtcbn1cbmAsXG5mYWxzZSxcbltoZWxwZXJEZXBlbmRhbmN5XVxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9kZW1vQXJncygpIHtcblxuICAgICAgICBcbiAgICAgICAgY29uc3QgaGVscGVyQmcxID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnMS1hcmdzJyksICctLXVybCcsIGZhbHNlLCBbJy0taW1nVG9Vc2UnXSk7XG4gICAgICAgIGNvbnN0IGhlbHBlckJnMiA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZzItYXJncycpLCAnLS11cmwnLCBmYWxzZSwgWyctLWltZ1RvVXNlJ10pO1xuXG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1hcmdzJyksXG4gICAgICAgICAgICBgOnJvb3R7XG4gICAgLS1wcmVmaXg6IGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvaW1hZ2VzLztcbiAgICAtLWltZzE6IGhhY2sxLmpwZztcbiAgICAtLWltZzI6IGhhY2syLmpwZztcbn1cbiNhcmdzLWNzcyAuYmd7XG4gICAgLS11cmw6IChpbWcpID0+IHtcbiAgICAgICAgbGV0IHByZWZpeCA9IFxcYHZhcigtLXByZWZpeClcXGA7XG4gICAgICAgIGxldCB1cmxDb25jYXQgPSBwcmVmaXgraW1nO1xuICAgICAgICByZXR1cm4gXCJ1cmwoXCIrdXJsQ29uY2F0LnNwbGl0KCcgJykuam9pbignJykrXCIpXCI7XG4gICAgfTtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOnZhcigtLWNvbXB1dGVVcmwpO1xufVxuI2FyZ3MtY3NzICNiZzEtYXJncyB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMSk7XG59XG4jYXJncy1jc3MgI2JnMi1hcmdzIHtcbiAgICAtLWltZ1RvVXNlOiB2YXIoLS1pbWcyKTtcbn1cbmAsXG5mYWxzZSxcbltoZWxwZXJCZzEsIGhlbHBlckJnMl1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfZGVtb1BhaW50QXBpSnNJbkNzcygpIHtcbiAgICAgICAgaWYgKCEncGFpbnRXb3JrbGV0JyBpbiBDU1Mpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NpcmNsZS1mcm9tLWNzcy13b3JrbGV0LmpzJyk7XG5cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpLWpzLWluLWNzcycpLFxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudC1wYWludC1hcGktanMtaW4tY3NzIHtcbiAgICAtLWNpcmNsZS1jb2xvcjogYmxhY2s7XG4gICAgLS13aWR0aC1jaXJjbGU6IDEwMHB4O1xuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZS1mcm9tLWNzcyk7XG4gICAgLS1jaXJjbGU6IChjdHgsIGdlb20pID0+IHtcbiAgICAgICAgY29uc3QgY29sb3IgPSBcXGB2YXIoLS1jaXJjbGUtY29sb3IpXFxgO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIGNvbnN0IHggPSBnZW9tLndpZHRoIC8gMjtcbiAgICAgICAgY29uc3QgeSA9IGdlb20uaGVpZ2h0IC8gMjtcbiAgICAgICAgbGV0IHJhZGl1cyA9IE1hdGgubWluKHgsIHkpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG59XG5gLFxudHJ1ZSk7XG4gICAgfVxuXG5cblxuXG59IiwiLyoqXG4gKiBDbGFzcyB0aGF0IGhlbHBzIHlvdSB0byBwbGF5IHdpdGggY3VzdG9tIHByb3BlcnRpZXMgXG4gKiBhbmQgdHVybiB0aGVtIGludG8gSlMgQ29kZSB0aGF0IHlvdSBleGVjdXRlXG4gKiBcbiAqIElmIHlvdXIgY3VzdG9tIHByb3BlcnR5IGlzIG5hbWVkIC0tbXlWYXIsIHRoaXMgd2lsbCBjcmVhdGUgYSAtLWNvbXB1dGVNeVZhclxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBIZWxwZXJKc0luQ3Nze1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IDogVGhlIGRvbSBlbGVtZW50IHdoZXJlIHdlIGZpbmQgdGhlIGN1c3RvbSBwcm9wZXJ0eSBhbmQgd2hlcmUgd2UgYXBwbHkgdGhlIGNvbXB1dGUgdmFsdWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY3VzdG9tUHJvcGVydHkgOiB0aGUgY29tcGxldGUgbmFtZSBvZiBjdXN0b20gcHJvcGVydHkgKHdpdGggJy0tJylcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGxvb3AgOiB0cnVlIGlmIHlvdSB3YW50IHRvIHdhdGNoIHRoZSBjdXN0b20gcHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBhcmdzIDogdGhlIGxpc3Qgb2YgYXJndW1lbnRzIHlvdSBjYW4gcGFzcyB0byB5b3VyIGZ1bmN0aW9uIChhcmd1bWVudHMgbXVzdCBiZSBjdXN0b20gcHJvZXJ0aWVzKVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGN1c3RvbVByb3BlcnR5LCBsb29wLCBhcmdzKXtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgICAgICB0aGlzLmN1c3RvbVByb3BlcnR5ID0gY3VzdG9tUHJvcGVydHlcbiAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgdGhpcy5sb29wID0gbG9vcFxuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzXG4gICAgICAgIGlmIChsb29wKXtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja0VsZW1lbnRzLmJpbmQodGhpcykpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jaGVja0VsZW1lbnRzKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHRoZSBjdXN0b20gcHJvcGVydHkgYW5kIGV2YWx1YXRlIHRoZSBzY3JpcHRcbiAgICAgKi9cbiAgICBjaGVja0VsZW1lbnRzKCl7XG5cblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLmN1c3RvbVByb3BlcnR5KVxuICAgICAgICBjb25zdCBjb21wdXRlQXJndW1lbnRzID0gW11cbiAgICAgICAgaWYgKHRoaXMuYXJncyAmJiB0aGlzLmFyZ3MubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICB0aGlzLmFyZ3MuZm9yRWFjaChhcmd1bWVudFByb3BlcnR5ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcmdWYWx1ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShhcmd1bWVudFByb3BlcnR5KVxuICAgICAgICAgICAgICAgIGNvbXB1dGVBcmd1bWVudHMucHVzaChhcmdWYWx1ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGNvbnN0IGV2YWx1YXRlVmFsdWUgPSBldmFsKHZhbHVlKSguLi5jb21wdXRlQXJndW1lbnRzKVxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFZhbHVlID09PSBldmFsdWF0ZVZhbHVlKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb29wKXtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IGV2YWx1YXRlVmFsdWVcbiAgICAgICAgICAgIGNvbnN0IGNvbXB1dGVOYW1lID0gYC0tY29tcHV0ZSR7dGhpcy5jdXN0b21Qcm9wZXJ0eVsyXS50b1VwcGVyQ2FzZSgpfSR7dGhpcy5jdXN0b21Qcm9wZXJ0eS5zdWJzdHJpbmcoMyl9YFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGNvbXB1dGVOYW1lLCBldmFsdWF0ZVZhbHVlKVxuICAgICAgICB9Y2F0Y2goZXJyKXt9XG5cbiAgICAgICAgaWYgKHRoaXMubG9vcCl7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tFbGVtZW50cy5iaW5kKHRoaXMpKVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiJ3VzZSBzdGljdCdcblxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBub1RyaW1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50LCBub1RyaW0gPSBmYWxzZSwganNJbkNzc0hlbHBlcnMpIHtcbiAgICAgICAgdGhpcy5jb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnaWRlYSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdGhpcy5zdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcbiAgICAgICAgdGhpcy5ub1RyaW0gPSBub1RyaW07XG5cbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xuXG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcbiAgICAgICAgdGhpcy5jb2RlTWlycm9yQ3NzLm9uKCdjaGFuZ2UnLCAoLi4ub2JqKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFwcGx5Q3NzKHRoaXMuY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgIGlmIChqc0luQ3NzSGVscGVycyAmJiBqc0luQ3NzSGVscGVycy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBqc0luQ3NzSGVscGVycy5mb3JFYWNoKGpzSW5Dc3NIZWxwZXIgPT4ganNJbkNzc0hlbHBlci5jaGVja0VsZW1lbnRzKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFwcGx5Q3NzKGluaXRpYWxDb250ZW50KTtcbiAgICB9XG5cbiAgICBhcHBseUNzcyh2YWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubmJFbHRzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIGlmICghdGhpcy5ub1RyaW0pe1xuICAgICAgICAgICAgdmFsdWUuc3BsaXQoJ31cXG4nKVxuICAgICAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxlY3RvckNzcyB8fCBzZWxlY3RvckNzcy5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcyArICd9Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTRlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5saW5lSGVpZ2h0ID0gTElORV9IRUlHSFQ7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxuICAgICAgICB9KTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG5cbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xuXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gIE15IHZhciBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdteXZhcicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzIwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzI3MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gIGxpbWl0IHVybCBjb25jYXRcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndXJsJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNDUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vICBsaW1pdCBIb3VkaW5pXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2hvdWRpbmknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcyODBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczMzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczODBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHtcbiAgICBEZW1vc1xufSBmcm9tICcuL2RlbW9zLmpzJztcblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpXG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyJdfQ==
