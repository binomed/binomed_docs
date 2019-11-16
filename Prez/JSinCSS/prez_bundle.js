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
            var helperDependancy = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#pure-css h1'), "--dependancy", false);

            var helperBg1 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg1'), '--url', false, ['--imgToUse']);
            var helperBg2 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg2'), '--url', false, ['--imgToUse']);

            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), ':root{\n    --codemiror-size: 30px;\n}\n#pure-css{\n    background: var(--computeRandomColor);\n}\n#pure-css h1 {\n    color: var(--computeDependancy);\n}\n#pure-css .bg{\n    background-image:var(--computeUrl);\n}\n#pure-css #bg1 {\n    --imgToUse: var(--img1);\n}\n#pure-css #bg2 {\n    --imgToUse: var(--img2);\n}', false, [helperColor, helperDependancy, helperBg1, helperBg2]);
        }
    }, {
        key: '_demoRandomColor',
        value: function _demoRandomColor() {

            var helperColor = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#random-color-css'), "--randomColor");
            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-random'), ':root{\n    --codemiror-size: 30px;\n}\n#random-color-css{\n    --randomColor: () => {\n        let red = Math.random()*255;\n        let green = Math.random()*255;\n        let blue = Math.random()*255;\n        return `rgb(${red},${green},${blue})`;\n    };\n    background: var(--computeRandomColor);\n}\n', false, [helperColor]);
        }
    }, {
        key: '_demoDependancy',
        value: function _demoDependancy() {

            var helperDependancy = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#dependancy-css h1'), "--dependancy", false);

            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-dependancy'), ':root{\n    --codemiror-size: 30px;\n}\n#dependancy-css h1 {\n    --color:blue;\n    --dependancy : () => `var(--color)`;\n    color: var(--computeDependancy);\n}\n', false, [helperDependancy]);
        }
    }, {
        key: '_demoArgs',
        value: function _demoArgs() {

            var helperBg1 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg1-args'), '--url', false, ['--imgToUse']);
            var helperBg2 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg2-args'), '--url', false, ['--imgToUse']);

            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-args'), ':root{\n    --prefix: http://localhost:3000/assets/images;\n    --img1: hack1.jpg;\n    --img2: hack2.jpg;\n}\n#args-css .bg{\n    --url: (img) => {\n        let prefix = `var(--prefix)`;\n        let urlConcat = prefix+\'/\'+img;\n        return "url("+urlConcat.split(\' \').join(\'\')+")";\n    };\n    background-image:var(--computeUrl);\n}\n#args-css #bg1-args {\n    --imgToUse: var(--img1);\n}\n#args-css #bg2-args {\n    --imgToUse: var(--img2);\n}', false, [helperBg1, helperBg2]);
        }
    }, {
        key: '_demoPaintApiJsInCss',
        value: function _demoPaintApiJsInCss() {
            if (!'paintWorklet' in CSS) {
                return;
            }

            (CSS.paintWorklet || paintWorklet).addModule('./scripts/houdini/circle-from-css-worklet.js');

            new _applyCss.ApplyCss(document.getElementById('codemirror-paint-api-js-in-css'), '#render-element-paint-api-js-in-css {\n    --circle-color: black;\n    --width-circle: 100px;\n    width: var(--width-circle);\n    background-image: paint(circle-from-css);\n    --circle: (ctx, geom) => {\n        const color = `var(--circle-color)`;\n        ctx.fillStyle = color;\n        const x = geom.width / 2;\n        const y = geom.height / 2;\n        let radius = Math.min(x, y);\n        ctx.beginPath();\n        ctx.fillStyle = color;\n        ctx.arc(x, y, radius, 0, 2 * Math.PI);\n        ctx.fill();\n    }\n}', true);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvSGVscGVySlNJbkNTUy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7O0FBR0E7Ozs7SUFFYSxLLFdBQUEsSztBQUVULHFCQUFjO0FBQUE7O0FBQ1YsWUFBSTs7QUFFQSxpQkFBSyxXQUFMO0FBQ0EsaUJBQUssZ0JBQUw7QUFDQSxpQkFBSyxlQUFMO0FBQ0EsaUJBQUssU0FBTDtBQUNBLGlCQUFLLG9CQUFMO0FBQ0gsU0FQRCxDQU9FLE9BQU8sS0FBUCxFQUFjO0FBQ1osb0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFDSDtBQUVKOzs7O3NDQUVhOztBQUVWLGdCQUFNLGNBQWMsSUFBSSw0QkFBSixDQUFrQixTQUFTLElBQVQsQ0FBYyxhQUFkLENBQTRCLFdBQTVCLENBQWxCLEVBQTRELGVBQTVELENBQXBCO0FBQ0EsZ0JBQU0sbUJBQW1CLElBQUksNEJBQUosQ0FBa0IsU0FBUyxJQUFULENBQWMsYUFBZCxDQUE0QixjQUE1QixDQUFsQixFQUErRCxjQUEvRCxFQUErRSxLQUEvRSxDQUF6Qjs7QUFFQSxnQkFBTSxZQUFZLElBQUksNEJBQUosQ0FBa0IsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBQWxCLEVBQWtELE9BQWxELEVBQTJELEtBQTNELEVBQWtFLENBQUMsWUFBRCxDQUFsRSxDQUFsQjtBQUNBLGdCQUFNLFlBQVksSUFBSSw0QkFBSixDQUFrQixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBbEIsRUFBa0QsT0FBbEQsRUFBMkQsS0FBM0QsRUFBa0UsQ0FBQyxZQUFELENBQWxF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QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQVZZO0FBSEssS0FBeEI7O0FBcUJBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxTQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGlCQUFLLEtBRE87QUFFWixvQkFBUSxPQUZJO0FBR1osd0JBQVksTUFIQTtBQUlaLG1CQUFPO0FBSkssU0FBRCxFQUtaO0FBQ0MsaUJBQUssT0FETjtBQUVDLG9CQUFRLE1BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQUxZLEVBVVo7QUFDQyxpQkFBSyxPQUROO0FBRUMsb0JBQVEsTUFGVDtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBVlksRUFlWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FmWTtBQUhLLEtBQXhCO0FBMEJILEM7OztBQzlFTDs7QUFFQTs7QUFHQTs7QUFLQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUV0QixZQUFNLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUF0Qzs7QUFFQSxZQUFJLCtCQUFKO0FBQ0EsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYLGdCQUFJLFlBQUo7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQWpCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCB7XG4gICAgQXBwbHlDc3Ncbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xuaW1wb3J0IHsgSGVscGVySnNJbkNzc30gZnJvbSAnLi9oZWxwZXIvSGVscGVySlNJbkNTUy5qcydcblxuZXhwb3J0IGNsYXNzIERlbW9zIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFyKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vUmFuZG9tQ29sb3IoKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9EZXBlbmRhbmN5KCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vQXJncygpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpSnNJbkNzcygpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFyKCkge1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckNvbG9yID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcHVyZS1jc3MnKSwgXCItLXJhbmRvbUNvbG9yXCIpO1xuICAgICAgICBjb25zdCBoZWxwZXJEZXBlbmRhbmN5ID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcHVyZS1jc3MgaDEnKSwgXCItLWRlcGVuZGFuY3lcIiwgZmFsc2UpO1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckJnMSA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZzEnKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcbiAgICAgICAgY29uc3QgaGVscGVyQmcyID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnMicpLCAnLS11cmwnLCBmYWxzZSwgWyctLWltZ1RvVXNlJ10pO1xuXG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcbiAgICAgICAgICAgIGA6cm9vdHtcbiAgICAtLWNvZGVtaXJvci1zaXplOiAzMHB4O1xufVxuI3B1cmUtY3Nze1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvbXB1dGVSYW5kb21Db2xvcik7XG59XG4jcHVyZS1jc3MgaDEge1xuICAgIGNvbG9yOiB2YXIoLS1jb21wdXRlRGVwZW5kYW5jeSk7XG59XG4jcHVyZS1jc3MgLmJne1xuICAgIGJhY2tncm91bmQtaW1hZ2U6dmFyKC0tY29tcHV0ZVVybCk7XG59XG4jcHVyZS1jc3MgI2JnMSB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMSk7XG59XG4jcHVyZS1jc3MgI2JnMiB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMik7XG59YCxcbmZhbHNlLFxuW2hlbHBlckNvbG9yLCBoZWxwZXJEZXBlbmRhbmN5LCBoZWxwZXJCZzEsIGhlbHBlckJnMl1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfZGVtb1JhbmRvbUNvbG9yKCkge1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckNvbG9yID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcmFuZG9tLWNvbG9yLWNzcycpLCBcIi0tcmFuZG9tQ29sb3JcIik7XG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1yYW5kb20nKSxcbiAgICAgICAgICAgIGA6cm9vdHtcbiAgICAtLWNvZGVtaXJvci1zaXplOiAzMHB4O1xufVxuI3JhbmRvbS1jb2xvci1jc3N7XG4gICAgLS1yYW5kb21Db2xvcjogKCkgPT4ge1xuICAgICAgICBsZXQgcmVkID0gTWF0aC5yYW5kb20oKSoyNTU7XG4gICAgICAgIGxldCBncmVlbiA9IE1hdGgucmFuZG9tKCkqMjU1O1xuICAgICAgICBsZXQgYmx1ZSA9IE1hdGgucmFuZG9tKCkqMjU1O1xuICAgICAgICByZXR1cm4gXFxgcmdiKFxcJHtyZWR9LFxcJHtncmVlbn0sXFwke2JsdWV9KVxcYDtcbiAgICB9O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvbXB1dGVSYW5kb21Db2xvcik7XG59XG5gLFxuZmFsc2UsXG5baGVscGVyQ29sb3JdXG4gICAgICAgICk7XG4gICAgfVxuXG5cbiAgICBfZGVtb0RlcGVuZGFuY3koKSB7XG5cbiAgICAgICAgY29uc3QgaGVscGVyRGVwZW5kYW5jeSA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI2RlcGVuZGFuY3ktY3NzIGgxJyksIFwiLS1kZXBlbmRhbmN5XCIsIGZhbHNlKTtcblxuXG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1kZXBlbmRhbmN5JyksXG4gICAgICAgICAgICBgOnJvb3R7XG4gICAgLS1jb2RlbWlyb3Itc2l6ZTogMzBweDtcbn1cbiNkZXBlbmRhbmN5LWNzcyBoMSB7XG4gICAgLS1jb2xvcjpibHVlO1xuICAgIC0tZGVwZW5kYW5jeSA6ICgpID0+IFxcYHZhcigtLWNvbG9yKVxcYDtcbiAgICBjb2xvcjogdmFyKC0tY29tcHV0ZURlcGVuZGFuY3kpO1xufVxuYCxcbmZhbHNlLFxuW2hlbHBlckRlcGVuZGFuY3ldXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX2RlbW9BcmdzKCkge1xuXG4gICAgICAgIFxuICAgICAgICBjb25zdCBoZWxwZXJCZzEgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmcxLWFyZ3MnKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcbiAgICAgICAgY29uc3QgaGVscGVyQmcyID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnMi1hcmdzJyksICctLXVybCcsIGZhbHNlLCBbJy0taW1nVG9Vc2UnXSk7XG5cbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWFyZ3MnKSxcbiAgICAgICAgICAgIGA6cm9vdHtcbiAgICAtLXByZWZpeDogaHR0cDovL2xvY2FsaG9zdDozMDAwL2Fzc2V0cy9pbWFnZXM7XG4gICAgLS1pbWcxOiBoYWNrMS5qcGc7XG4gICAgLS1pbWcyOiBoYWNrMi5qcGc7XG59XG4jYXJncy1jc3MgLmJne1xuICAgIC0tdXJsOiAoaW1nKSA9PiB7XG4gICAgICAgIGxldCBwcmVmaXggPSBcXGB2YXIoLS1wcmVmaXgpXFxgO1xuICAgICAgICBsZXQgdXJsQ29uY2F0ID0gcHJlZml4KycvJytpbWc7XG4gICAgICAgIHJldHVybiBcInVybChcIit1cmxDb25jYXQuc3BsaXQoJyAnKS5qb2luKCcnKStcIilcIjtcbiAgICB9O1xuICAgIGJhY2tncm91bmQtaW1hZ2U6dmFyKC0tY29tcHV0ZVVybCk7XG59XG4jYXJncy1jc3MgI2JnMS1hcmdzIHtcbiAgICAtLWltZ1RvVXNlOiB2YXIoLS1pbWcxKTtcbn1cbiNhcmdzLWNzcyAjYmcyLWFyZ3Mge1xuICAgIC0taW1nVG9Vc2U6IHZhcigtLWltZzIpO1xufWAsXG5mYWxzZSxcbltoZWxwZXJCZzEsIGhlbHBlckJnMl1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfZGVtb1BhaW50QXBpSnNJbkNzcygpIHtcbiAgICAgICAgaWYgKCEncGFpbnRXb3JrbGV0JyBpbiBDU1Mpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgKENTUy5wYWludFdvcmtsZXQgfHwgcGFpbnRXb3JrbGV0KS5hZGRNb2R1bGUoJy4vc2NyaXB0cy9ob3VkaW5pL2NpcmNsZS1mcm9tLWNzcy13b3JrbGV0LmpzJyk7XG5cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFpbnQtYXBpLWpzLWluLWNzcycpLFxuICAgICAgICAgICAgYCNyZW5kZXItZWxlbWVudC1wYWludC1hcGktanMtaW4tY3NzIHtcbiAgICAtLWNpcmNsZS1jb2xvcjogYmxhY2s7XG4gICAgLS13aWR0aC1jaXJjbGU6IDEwMHB4O1xuICAgIHdpZHRoOiB2YXIoLS13aWR0aC1jaXJjbGUpO1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHBhaW50KGNpcmNsZS1mcm9tLWNzcyk7XG4gICAgLS1jaXJjbGU6IChjdHgsIGdlb20pID0+IHtcbiAgICAgICAgY29uc3QgY29sb3IgPSBcXGB2YXIoLS1jaXJjbGUtY29sb3IpXFxgO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIGNvbnN0IHggPSBnZW9tLndpZHRoIC8gMjtcbiAgICAgICAgY29uc3QgeSA9IGdlb20uaGVpZ2h0IC8gMjtcbiAgICAgICAgbGV0IHJhZGl1cyA9IE1hdGgubWluKHgsIHkpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG59YCxcbnRydWUpO1xuICAgIH1cblxuXG5cblxufSIsIi8qKlxuICogQ2xhc3MgdGhhdCBoZWxwcyB5b3UgdG8gcGxheSB3aXRoIGN1c3RvbSBwcm9wZXJ0aWVzIFxuICogYW5kIHR1cm4gdGhlbSBpbnRvIEpTIENvZGUgdGhhdCB5b3UgZXhlY3V0ZVxuICogXG4gKiBJZiB5b3VyIGN1c3RvbSBwcm9wZXJ0eSBpcyBuYW1lZCAtLW15VmFyLCB0aGlzIHdpbGwgY3JlYXRlIGEgLS1jb21wdXRlTXlWYXJcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgSGVscGVySnNJbkNzc3tcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCA6IFRoZSBkb20gZWxlbWVudCB3aGVyZSB3ZSBmaW5kIHRoZSBjdXN0b20gcHJvcGVydHkgYW5kIHdoZXJlIHdlIGFwcGx5IHRoZSBjb21wdXRlIHZhbHVlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGN1c3RvbVByb3BlcnR5IDogdGhlIGNvbXBsZXRlIG5hbWUgb2YgY3VzdG9tIHByb3BlcnR5ICh3aXRoICctLScpXG4gICAgICogQHBhcmFtIHtib29sZWFufSBsb29wIDogdHJ1ZSBpZiB5b3Ugd2FudCB0byB3YXRjaCB0aGUgY3VzdG9tIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0gYXJncyA6IHRoZSBsaXN0IG9mIGFyZ3VtZW50cyB5b3UgY2FuIHBhc3MgdG8geW91ciBmdW5jdGlvbiAoYXJndW1lbnRzIG11c3QgYmUgY3VzdG9tIHByb2VydGllcylcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjdXN0b21Qcm9wZXJ0eSwgbG9vcCwgYXJncyl7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgICAgdGhpcy5jdXN0b21Qcm9wZXJ0eSA9IGN1c3RvbVByb3BlcnR5XG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIHRoaXMubG9vcCA9IGxvb3BcbiAgICAgICAgdGhpcy5hcmdzID0gYXJnc1xuICAgICAgICBpZiAobG9vcCl7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tFbGVtZW50cy5iaW5kKHRoaXMpKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tFbGVtZW50cygpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB0aGUgY3VzdG9tIHByb3BlcnR5IGFuZCBldmFsdWF0ZSB0aGUgc2NyaXB0XG4gICAgICovXG4gICAgY2hlY2tFbGVtZW50cygpe1xuXG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUodGhpcy5jdXN0b21Qcm9wZXJ0eSlcbiAgICAgICAgY29uc3QgY29tcHV0ZUFyZ3VtZW50cyA9IFtdXG4gICAgICAgIGlmICh0aGlzLmFyZ3MgJiYgdGhpcy5hcmdzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgdGhpcy5hcmdzLmZvckVhY2goYXJndW1lbnRQcm9wZXJ0eSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJnVmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoYXJndW1lbnRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICBjb21wdXRlQXJndW1lbnRzLnB1c2goYXJnVmFsdWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICB0cnl7XG4gICAgICAgICAgICBjb25zdCBldmFsdWF0ZVZhbHVlID0gZXZhbCh2YWx1ZSkoLi4uY29tcHV0ZUFyZ3VtZW50cylcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RWYWx1ZSA9PT0gZXZhbHVhdGVWYWx1ZSl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9vcCl7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja0VsZW1lbnRzLmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSBldmFsdWF0ZVZhbHVlXG4gICAgICAgICAgICBjb25zdCBjb21wdXRlTmFtZSA9IGAtLWNvbXB1dGUke3RoaXMuY3VzdG9tUHJvcGVydHlbMl0udG9VcHBlckNhc2UoKX0ke3RoaXMuY3VzdG9tUHJvcGVydHkuc3Vic3RyaW5nKDMpfWBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShjb21wdXRlTmFtZSwgZXZhbHVhdGVWYWx1ZSlcbiAgICAgICAgfWNhdGNoKGVycil7fVxuXG4gICAgICAgIGlmICh0aGlzLmxvb3Ape1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgfVxuICAgIH1cblxufSIsIid1c2Ugc3RpY3QnXG5cbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmltXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCwgbm9UcmltID0gZmFsc2UsIGpzSW5Dc3NIZWxwZXJzKSB7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ2lkZWEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIHRoaXMubm9UcmltID0gbm9UcmltO1xuXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcblxuICAgICAgICB0aGlzLmNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyh0aGlzLmNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICBpZiAoanNJbkNzc0hlbHBlcnMgJiYganNJbkNzc0hlbHBlcnMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAganNJbkNzc0hlbHBlcnMuZm9yRWFjaChqc0luQ3NzSGVscGVyID0+IGpzSW5Dc3NIZWxwZXIuY2hlY2tFbGVtZW50cygpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hcHBseUNzcyhpbml0aWFsQ29udGVudCk7XG4gICAgfVxuXG4gICAgYXBwbHlDc3ModmFsdWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0LmRlbGV0ZVJ1bGUoMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuICAgICAgICBpZiAoIXRoaXMubm9UcmltKXtcbiAgICAgICAgICAgIHZhbHVlLnNwbGl0KCd9XFxuJylcbiAgICAgICAgICAgICAgICAubWFwKHN0ciA9PiBzdHIudHJpbSgpKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHNlbGVjdG9yQ3NzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcyArICd9Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTRlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5saW5lSGVpZ2h0ID0gTElORV9IRUlHSFQ7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxuICAgICAgICB9KTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG5cbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xuXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gIE15IHZhciBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdteXZhcicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzIwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzI3MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gIGxpbWl0IHVybCBjb25jYXRcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndXJsJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNDUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vICBsaW1pdCBIb3VkaW5pXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2hvdWRpbmknLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcyODBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczMzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczODBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHtcbiAgICBEZW1vc1xufSBmcm9tICcuL2RlbW9zLmpzJztcblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpXG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyJdfQ==
