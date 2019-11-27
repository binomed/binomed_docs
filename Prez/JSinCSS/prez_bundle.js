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
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), ':root{\n    --codemiror-size: 30px;\n}\n#pure-css{\n    background: var(--computeRandomColor);\n}\n#pure-css h1 {\n    color: var(--computeDependancy);\n}\n#pure-css .bg{\n    background-image:var(--computeUrl);\n}\n#pure-css #bg1 {\n    --imgToUse: var(--img1);\n}\n#pure-css #bg2 {\n    --imgToUse: var(--img2);\n}\n', false, [helperColor, helperDependancy, helperBg1, helperBg2]);
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
            new _applyCss.ApplyCss(document.getElementById('codemirror-args'), ':root{\n    --prefix: http://localhost:3000/assets/images;\n    --img1: hack1.jpg;\n    --img2: hack2.jpg;\n}\n#args-css .bg{\n    --url: (img) => {\n        let prefix = `var(--prefix)`;\n        let urlConcat = prefix+\'/\'+img;\n        return "url("+urlConcat.split(\' \').join(\'\')+")";\n    };\n    background-image:var(--computeUrl);\n}\n#args-css #bg1-args {\n    --imgToUse: var(--img1);\n}\n#args-css #bg2-args {\n    --imgToUse: var(--img2);\n}\n', false, [helperBg1, helperBg2]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvSGVscGVySlNJbkNTUy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7O0FBR0E7Ozs7SUFFYSxLLFdBQUEsSztBQUVULHFCQUFjO0FBQUE7O0FBQ1YsWUFBSTs7QUFFQSxpQkFBSyxXQUFMO0FBQ0EsaUJBQUssZ0JBQUw7QUFDQSxpQkFBSyxlQUFMO0FBQ0EsaUJBQUssU0FBTDtBQUNBLGlCQUFLLG9CQUFMO0FBQ0gsU0FQRCxDQU9FLE9BQU8sS0FBUCxFQUFjO0FBQ1osb0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFDSDtBQUVKOzs7O3NDQUVhOztBQUVWLGdCQUFNLGNBQWMsSUFBSSw0QkFBSixDQUFrQixTQUFTLElBQVQsQ0FBYyxhQUFkLENBQTRCLFdBQTVCLENBQWxCLEVBQTRELGVBQTVELENBQXBCO0FBQ0EsZ0JBQU0sbUJBQW1CLElBQUksNEJBQUosQ0FBa0IsU0FBUyxJQUFULENBQWMsYUFBZCxDQUE0QixjQUE1QixDQUFsQixFQUErRCxjQUEvRCxFQUErRSxLQUEvRSxDQUF6Qjs7QUFFQSxnQkFBTSxZQUFZLElBQUksNEJBQUosQ0FBa0IsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBQWxCLEVBQWtELE9BQWxELEVBQTJELEtBQTNELEVBQWtFLENBQUMsWUFBRCxDQUFsRSxDQUFsQjtBQUNBLGdCQUFNLFlBQVksSUFBSSw0QkFBSixDQUFrQixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBbEIsRUFBa0QsT0FBbEQsRUFBMkQsS0FBM0QsRUFBa0UsQ0FBQyxZQUFELENBQWxFLENBQWxCOztBQUVBO0FBQ0EsZ0JBQUksa0JBQUosQ0FDSSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBREosb1VBcUJSLEtBckJRLEVBc0JSLENBQUMsV0FBRCxFQUFjLGdCQUFkLEVBQWdDLFNBQWhDLEVBQTJDLFNBQTNDLENBdEJRO0FBd0JIOzs7MkNBRWtCOztBQUVmLGdCQUFNLGNBQWMsSUFBSSw0QkFBSixDQUFrQixTQUFTLElBQVQsQ0FBYyxhQUFkLENBQTRCLG1CQUE1QixDQUFsQixFQUFvRSxlQUFwRSxDQUFwQjtBQUNBO0FBQ0EsZ0JBQUksa0JBQUosQ0FDSSxTQUFTLGNBQVQsQ0FBd0IsbUJBQXhCLENBREosa1JBWVIsS0FaUSxFQWFSLENBQUMsV0FBRCxDQWJRO0FBZUg7OzswQ0FHaUI7O0FBRWQsZ0JBQU0sbUJBQW1CLElBQUksNEJBQUosQ0FBa0IsU0FBUyxJQUFULENBQWMsYUFBZCxDQUE0QixvQkFBNUIsQ0FBbEIsRUFBcUUsY0FBckUsRUFBcUYsS0FBckYsQ0FBekI7O0FBR0E7QUFDQSxnQkFBSSxrQkFBSixDQUNJLFNBQVMsY0FBVCxDQUF3Qix1QkFBeEIsQ0FESixrSUFRUixLQVJRLEVBU1IsQ0FBQyxnQkFBRCxDQVRRO0FBV0g7OztvQ0FFVzs7QUFHUixnQkFBTSxZQUFZLElBQUksNEJBQUosQ0FBa0IsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWxCLEVBQXVELE9BQXZELEVBQWdFLEtBQWhFLEVBQXVFLENBQUMsWUFBRCxDQUF2RSxDQUFsQjtBQUNBLGdCQUFNLFlBQVksSUFBSSw0QkFBSixDQUFrQixTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBbEIsRUFBdUQsT0FBdkQsRUFBZ0UsS0FBaEUsRUFBdUUsQ0FBQyxZQUFELENBQXZFLENBQWxCOztBQUVBO0FBQ0EsZ0JBQUksa0JBQUosQ0FDSSxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLENBREosZ2RBc0JSLEtBdEJRLEVBdUJSLENBQUMsU0FBRCxFQUFZLFNBQVosQ0F2QlE7QUF5Qkg7OzsrQ0FFc0I7QUFDbkIsZ0JBQUksQ0FBQyxjQUFELElBQW1CLEdBQXZCLEVBQTJCO0FBQ3ZCO0FBQ0g7O0FBRUQsYUFBQyxJQUFJLFlBQUosSUFBb0IsWUFBckIsRUFBbUMsU0FBbkMsQ0FBNkMsOENBQTdDOztBQUVBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLGdDQUF4QixDQURKLHloQkFvQlIsSUFwQlE7QUFxQkg7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEtMOzs7Ozs7O0lBT2EsYSxXQUFBLGE7O0FBRVQ7Ozs7Ozs7QUFPQSwyQkFBWSxPQUFaLEVBQXFCLGNBQXJCLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQWdEO0FBQUE7O0FBQzVDLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxhQUFLLGNBQUwsR0FBc0IsY0FBdEI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQSxhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFlBQUksSUFBSixFQUFTO0FBQ0wsbUJBQU8scUJBQVAsQ0FBNkIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQTdCO0FBQ0gsU0FGRCxNQUVLO0FBQ0QsaUJBQUssYUFBTDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7d0NBR2U7QUFBQTs7QUFHWCxnQkFBTSxRQUFRLE9BQU8sZ0JBQVAsQ0FBd0IsS0FBSyxPQUE3QixFQUFzQyxnQkFBdEMsQ0FBdUQsS0FBSyxjQUE1RCxDQUFkO0FBQ0EsZ0JBQU0sbUJBQW1CLEVBQXpCO0FBQ0EsZ0JBQUksS0FBSyxJQUFMLElBQWEsS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixDQUFwQyxFQUFzQztBQUNsQyxxQkFBSyxJQUFMLENBQVUsT0FBVixDQUFrQiw0QkFBb0I7QUFDbEMsd0JBQU0sV0FBVyxPQUFPLGdCQUFQLENBQXdCLE1BQUssT0FBN0IsRUFBc0MsZ0JBQXRDLENBQXVELGdCQUF2RCxDQUFqQjtBQUNBLHFDQUFpQixJQUFqQixDQUFzQixRQUF0QjtBQUNILGlCQUhEO0FBSUg7O0FBR0QsZ0JBQUc7QUFDQyxvQkFBTSxnQkFBZ0IsS0FBSyxLQUFMLG1CQUFlLGdCQUFmLENBQXRCO0FBQ0Esb0JBQUksS0FBSyxTQUFMLEtBQW1CLGFBQXZCLEVBQXFDO0FBQ2pDLHdCQUFJLEtBQUssSUFBVCxFQUFjO0FBQ1YsK0JBQU8scUJBQVAsQ0FBNkIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQTdCO0FBQ0g7QUFDRDtBQUNIOztBQUVELHFCQUFLLFNBQUwsR0FBaUIsYUFBakI7QUFDQSxvQkFBTSw0QkFBMEIsS0FBSyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLFdBQXZCLEVBQTFCLEdBQWlFLEtBQUssY0FBTCxDQUFvQixTQUFwQixDQUE4QixDQUE5QixDQUF2RTtBQUNBLHFCQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLFdBQW5CLENBQStCLFdBQS9CLEVBQTRDLGFBQTVDO0FBQ0gsYUFaRCxDQVlDLE9BQU0sR0FBTixFQUFVLENBQUU7O0FBRWIsZ0JBQUksS0FBSyxJQUFULEVBQWM7QUFDVix1QkFBTyxxQkFBUCxDQUE2QixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBN0I7QUFDSDtBQUNKOzs7Ozs7OztBQzlETDs7Ozs7Ozs7OztJQUVhLFEsV0FBQSxROztBQUVUOzs7Ozs7QUFNQSxzQkFBWSxHQUFaLEVBQWlCLGNBQWpCLEVBQWlFO0FBQUE7O0FBQUEsWUFBaEMsTUFBZ0MsdUVBQXZCLEtBQXVCO0FBQUEsWUFBaEIsY0FBZ0I7O0FBQUE7O0FBQzdELGFBQUssYUFBTCxHQUFxQixXQUFXLEdBQVgsRUFBZ0I7QUFDakMsbUJBQU8sY0FEMEI7QUFFakMsa0JBQU0sS0FGMkI7QUFHakMseUJBQWEsSUFIb0I7QUFJakMseUJBQWEsSUFKb0I7QUFLakMseUJBQWEsS0FMb0I7QUFNakMscUNBQXlCLElBTlE7QUFPakMsMEJBQWMsSUFQbUI7QUFRakMsNEJBQWdCLE1BUmlCO0FBU2pDLG1CQUFPO0FBVDBCLFNBQWhCLENBQXJCOztBQVlBLFlBQU0sT0FBTyxTQUFTLElBQVQsSUFBaUIsU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUE5QjtBQUNBLGFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGFBQUssTUFBTCxHQUFjLE1BQWQ7O0FBRUEsYUFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixVQUFsQjtBQUNBLFlBQUksS0FBSyxLQUFMLENBQVcsVUFBZixFQUEyQjtBQUN2QixpQkFBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixPQUF0QixHQUFnQyxFQUFoQztBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUF2QjtBQUNIO0FBQ0QsYUFBSyxXQUFMLENBQWlCLEtBQUssS0FBdEI7O0FBRUEsYUFBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLE1BQTNCLEVBQW1DLE1BQW5DO0FBQ0EsYUFBSyxhQUFMLENBQW1CLEVBQW5CLENBQXNCLFFBQXRCLEVBQWdDLFlBQVk7QUFDeEMsa0JBQUssUUFBTCxDQUFjLE1BQUssYUFBTCxDQUFtQixRQUFuQixFQUFkO0FBQ0EsZ0JBQUksa0JBQWtCLGVBQWUsTUFBZixHQUF3QixDQUE5QyxFQUFnRDtBQUM1QywrQkFBZSxPQUFmLENBQXVCO0FBQUEsMkJBQWlCLGNBQWMsYUFBZCxFQUFqQjtBQUFBLGlCQUF2QjtBQUNIO0FBQ0osU0FMRDtBQU1BLGFBQUssUUFBTCxDQUFjLGNBQWQ7QUFDSDs7OztpQ0FFUSxLLEVBQU87QUFBQTs7QUFDWixpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMscUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBakIsQ0FBNEIsQ0FBNUI7QUFDSDtBQUNELGlCQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLLE1BQVYsRUFBaUI7QUFDYixzQkFBTSxLQUFOLENBQVksS0FBWixFQUNLLEdBREwsQ0FDUztBQUFBLDJCQUFPLElBQUksSUFBSixFQUFQO0FBQUEsaUJBRFQsRUFFSyxPQUZMLENBRWEsdUJBQWU7QUFDcEIsd0JBQUk7QUFDQSw0QkFBSSxDQUFDLFdBQUQsSUFBZ0IsWUFBWSxNQUFaLEtBQXVCLENBQTNDLEVBQTZDO0FBQ3pDO0FBQ0g7QUFDRCwrQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixVQUFqQixDQUE0QixjQUFjLEdBQTFDO0FBQ0EsK0JBQUssTUFBTDtBQUNILHFCQU5ELENBTUUsT0FBTyxDQUFQLEVBQVU7QUFDUixnQ0FBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0osaUJBWkw7QUFhSCxhQWRELE1BY0s7QUFDRCxvQkFBSTtBQUNBLHlCQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLENBQTRCLEtBQTVCO0FBQ0EseUJBQUssTUFBTDtBQUNILGlCQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDUiw0QkFBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0o7QUFFSjs7Ozs7OztBQzFFTDs7Ozs7Ozs7OztBQUVBLElBQU0sVUFBVSxPQUFoQjtBQUNBLElBQU0sY0FBYyxRQUFwQjtBQUNBLElBQU0scUJBQXFCLE9BQTNCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLG1CLFdBQUEsbUI7QUFDVCx1Q0FHRztBQUFBLFlBRkMsTUFFRCxRQUZDLE1BRUQ7QUFBQSxZQURDLGFBQ0QsUUFEQyxhQUNEOztBQUFBOztBQUNDLGFBQUssV0FBTCxHQUFtQixTQUFTLGNBQVQsZ0JBQXFDLE1BQXJDLENBQW5CO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLGFBQXJCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLGVBQU8sZ0JBQVAsV0FBZ0MsTUFBaEMsRUFBMEMsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUExQztBQUNBLGVBQU8sZ0JBQVAsZ0JBQXFDLE1BQXJDLEVBQStDLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBL0M7QUFDSDs7OzswQ0FFaUIsSyxFQUFPO0FBQ3JCLGdCQUFJO0FBQ0Esb0JBQUksYUFBYSxJQUFqQjtBQUNBLG9CQUFJLE1BQU0sSUFBTixLQUFlLE1BQW5CLEVBQTJCO0FBQ3ZCLHdCQUFJLEtBQUssU0FBTCxJQUFrQixDQUF0QixFQUF5QjtBQUNyQixxQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxTQUF4QixDQUFiO0FBQ0g7QUFDSixpQkFKRCxNQUtBLElBQUksTUFBTSxJQUFOLEtBQWUsZUFBbkIsRUFBb0M7QUFDaEMsd0JBQU0sUUFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsaUNBQWEsS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQWI7QUFFSCxpQkFMRCxNQUtPO0FBQ0gsd0JBQU0sU0FBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLE1BQWpCO0FBQ0E7QUFDQSx3QkFBSSxTQUFRLENBQVosRUFBZTtBQUNYLHFDQUFhLEtBQUssYUFBTCxDQUFtQixTQUFRLENBQTNCLENBQWI7QUFDSDtBQUNKO0FBQ0Qsb0JBQU0sT0FBTyxhQUFhLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBYixHQUF1QyxFQUFwRDtBQUNBLG9CQUFNLE9BQU8sRUFBYjtBQUNBLG9CQUFNLFdBQVcsRUFBakI7QUFDQSxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsd0JBQU0sTUFBTSxLQUFLLENBQUwsQ0FBWjtBQUNBLDRCQUFRLElBQVI7QUFDSSw2QkFBSyxRQUFRLE1BQWI7QUFDQSw2QkFBSyxRQUFRLFNBQWI7QUFDQSw2QkFBSyxRQUFRLEtBQWI7QUFDQSw2QkFBSyxRQUFRLFFBQWI7QUFDQSw2QkFBSyxRQUFRLFdBQWI7QUFDQSw2QkFBSyxRQUFRLFlBQWI7QUFDSSxxQ0FBUyxHQUFULElBQWdCLFdBQVcsR0FBWCxDQUFoQjtBQUNBO0FBQ0osNkJBQUssUUFBUSxRQUFiO0FBQ0EsNkJBQUssUUFBUSxPQUFiO0FBQ0EsNkJBQUssUUFBUSxLQUFiO0FBQ0EsNkJBQUssUUFBUSxNQUFiO0FBQ0ksaUNBQUssR0FBTCxJQUFZLFdBQVcsR0FBWCxDQUFaO0FBQ0E7QUFDSjtBQWZKO0FBa0JIOztBQUVELG9CQUFJLFNBQVMsU0FBVCxLQUF1QixTQUEzQixFQUFzQztBQUNsQyw2QkFBUyxTQUFULEdBQXFCLE9BQXJCO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLE9BQVQsS0FBcUIsU0FBckIsSUFBa0MsS0FBSyxNQUFMLEtBQWdCLFNBQXRELEVBQWlFO0FBQzdELHlCQUFLLE1BQUwsR0FBYyxXQUFkO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLElBQVQsS0FBa0IsU0FBbEIsSUFBK0IsS0FBSyxHQUFMLEtBQWEsU0FBaEQsRUFBMkQ7QUFDdkQseUJBQUssR0FBTCxHQUFXLENBQVg7QUFDSDtBQUNELG9CQUFJLFNBQVMsTUFBVCxLQUFvQixTQUFwQixJQUFpQyxLQUFLLEtBQUwsS0FBZSxTQUFwRCxFQUErRDtBQUMzRCx5QkFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNIO0FBQ0Qsb0JBQUksU0FBUyxHQUFULEtBQWlCLFNBQWpCLElBQThCLEtBQUssSUFBTCxLQUFjLFNBQWhELEVBQTJEO0FBQ3ZELHlCQUFLLElBQUwsR0FBWSxDQUFaO0FBQ0g7QUFDRCxxQkFBSyxXQUFMLENBQWlCLElBQWpCLEdBQXdCLElBQXhCO0FBQ0EscUJBQUssV0FBTCxDQUFpQixRQUFqQixHQUE0QixRQUE1QjtBQUNBLHFCQUFLLFdBQUwsQ0FBaUIsVUFBakIsR0FBOEIsV0FBOUI7QUFFSCxhQWhFRCxDQWdFRSxPQUFPLENBQVAsRUFBVTtBQUNSLHdCQUFRLEtBQVIsQ0FBYyxDQUFkO0FBQ0g7QUFDSjs7OzJDQUVrQjtBQUNmLGlCQUFLLGlCQUFMLENBQXVCO0FBQ25CLHNCQUFNLE1BRGE7QUFFbkIsMEJBQVUsU0FBUyxhQUFULENBQXVCLHNCQUF2QjtBQUZTLGFBQXZCO0FBSUEsbUJBQU8sZ0JBQVAsQ0FBd0IsZUFBeEIsRUFBeUMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QztBQUNBLG1CQUFPLGdCQUFQLENBQXdCLGdCQUF4QixFQUEwQyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTFDO0FBQ0g7OzsrQ0FFc0I7QUFDbkIsbUJBQU8sbUJBQVAsQ0FBMkIsZUFBM0IsRUFBNEMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUE1QztBQUNBLG1CQUFPLG1CQUFQLENBQTJCLGdCQUEzQixFQUE2QyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTdDO0FBQ0g7Ozs7Ozs7QUN0R0w7Ozs7Ozs7QUFFQTs7OztBQUlBLElBQU0sY0FBYyxJQUFwQjtBQUNBLElBQU0sb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLGUsV0FBQSxlLEdBQ1QsMkJBQWM7QUFBQTs7QUFDVjtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsT0FEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVosb0JBQVEsT0FGSTtBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWTtBQUhLLEtBQXhCOztBQWdCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsS0FEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixpQkFBSyxLQURPO0FBRVosb0JBQVEsT0FGSTtBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGlCQUFLLEdBRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWSxFQVVaO0FBQ0MsaUJBQUssR0FETjtBQUVDLG9CQUFRLE9BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQVZZO0FBSEssS0FBeEI7O0FBcUJBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxTQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGlCQUFLLEtBRE87QUFFWixvQkFBUSxPQUZJO0FBR1osd0JBQVksTUFIQTtBQUlaLG1CQUFPO0FBSkssU0FBRCxFQUtaO0FBQ0MsaUJBQUssT0FETjtBQUVDLG9CQUFRLE1BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQUxZLEVBVVo7QUFDQyxpQkFBSyxPQUROO0FBRUMsb0JBQVEsTUFGVDtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBVlksRUFlWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FmWTtBQUhLLEtBQXhCO0FBMEJILEM7OztBQzlFTDs7QUFFQTs7QUFHQTs7QUFLQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUV0QixZQUFNLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUF0Qzs7QUFFQSxZQUFJLCtCQUFKO0FBQ0EsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYLGdCQUFJLFlBQUo7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQWpCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCB7XG4gICAgQXBwbHlDc3Ncbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xuaW1wb3J0IHsgSGVscGVySnNJbkNzc30gZnJvbSAnLi9oZWxwZXIvSGVscGVySlNJbkNTUy5qcydcblxuZXhwb3J0IGNsYXNzIERlbW9zIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFyKCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vUmFuZG9tQ29sb3IoKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9EZXBlbmRhbmN5KCk7XG4gICAgICAgICAgICB0aGlzLl9kZW1vQXJncygpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb1BhaW50QXBpSnNJbkNzcygpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFyKCkge1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckNvbG9yID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcHVyZS1jc3MnKSwgXCItLXJhbmRvbUNvbG9yXCIpO1xuICAgICAgICBjb25zdCBoZWxwZXJEZXBlbmRhbmN5ID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcHVyZS1jc3MgaDEnKSwgXCItLWRlcGVuZGFuY3lcIiwgZmFsc2UpO1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckJnMSA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZzEnKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcbiAgICAgICAgY29uc3QgaGVscGVyQmcyID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnMicpLCAnLS11cmwnLCBmYWxzZSwgWyctLWltZ1RvVXNlJ10pO1xuXG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcbiAgICAgICAgICAgIGA6cm9vdHtcbiAgICAtLWNvZGVtaXJvci1zaXplOiAzMHB4O1xufVxuI3B1cmUtY3Nze1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvbXB1dGVSYW5kb21Db2xvcik7XG59XG4jcHVyZS1jc3MgaDEge1xuICAgIGNvbG9yOiB2YXIoLS1jb21wdXRlRGVwZW5kYW5jeSk7XG59XG4jcHVyZS1jc3MgLmJne1xuICAgIGJhY2tncm91bmQtaW1hZ2U6dmFyKC0tY29tcHV0ZVVybCk7XG59XG4jcHVyZS1jc3MgI2JnMSB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMSk7XG59XG4jcHVyZS1jc3MgI2JnMiB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMik7XG59XG5gLFxuZmFsc2UsXG5baGVscGVyQ29sb3IsIGhlbHBlckRlcGVuZGFuY3ksIGhlbHBlckJnMSwgaGVscGVyQmcyXVxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9kZW1vUmFuZG9tQ29sb3IoKSB7XG5cbiAgICAgICAgY29uc3QgaGVscGVyQ29sb3IgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNyYW5kb20tY29sb3ItY3NzJyksIFwiLS1yYW5kb21Db2xvclwiKTtcbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXJhbmRvbScpLFxuICAgICAgICAgICAgYCNyYW5kb20tY29sb3ItY3Nze1xuICAgIC0tcmFuZG9tQ29sb3I6ICgpID0+IHtcbiAgICAgICAgbGV0IHJlZCA9IE1hdGgucmFuZG9tKCkqMjU1O1xuICAgICAgICBsZXQgZ3JlZW4gPSBNYXRoLnJhbmRvbSgpKjI1NTtcbiAgICAgICAgbGV0IGJsdWUgPSBNYXRoLnJhbmRvbSgpKjI1NTtcbiAgICAgICAgcmV0dXJuIFxcYHJnYihcXCR7cmVkfSxcXCR7Z3JlZW59LFxcJHtibHVlfSlcXGA7XG4gICAgfTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jb21wdXRlUmFuZG9tQ29sb3IpO1xufVxuYCxcbmZhbHNlLFxuW2hlbHBlckNvbG9yXVxuICAgICAgICApO1xuICAgIH1cblxuXG4gICAgX2RlbW9EZXBlbmRhbmN5KCkge1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckRlcGVuZGFuY3kgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNkZXBlbmRhbmN5LWNzcyBoMScpLCBcIi0tZGVwZW5kYW5jeVwiLCBmYWxzZSk7XG5cblxuICAgICAgICAvKiogKi9cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItZGVwZW5kYW5jeScpLFxuICAgICAgICAgICAgYCNkZXBlbmRhbmN5LWNzcyBoMSB7XG4gICAgLS1jb2xvcjpibHVlO1xuICAgIC0tZGVwZW5kYW5jeSA6ICgpID0+IFxcYHZhcigtLWNvbG9yKVxcYDtcbiAgICBjb2xvcjogdmFyKC0tY29tcHV0ZURlcGVuZGFuY3kpO1xufVxuYCxcbmZhbHNlLFxuW2hlbHBlckRlcGVuZGFuY3ldXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX2RlbW9BcmdzKCkge1xuXG4gICAgICAgIFxuICAgICAgICBjb25zdCBoZWxwZXJCZzEgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmcxLWFyZ3MnKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcbiAgICAgICAgY29uc3QgaGVscGVyQmcyID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnMi1hcmdzJyksICctLXVybCcsIGZhbHNlLCBbJy0taW1nVG9Vc2UnXSk7XG5cbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWFyZ3MnKSxcbiAgICAgICAgICAgIGA6cm9vdHtcbiAgICAtLXByZWZpeDogaHR0cDovL2xvY2FsaG9zdDozMDAwL2Fzc2V0cy9pbWFnZXM7XG4gICAgLS1pbWcxOiBoYWNrMS5qcGc7XG4gICAgLS1pbWcyOiBoYWNrMi5qcGc7XG59XG4jYXJncy1jc3MgLmJne1xuICAgIC0tdXJsOiAoaW1nKSA9PiB7XG4gICAgICAgIGxldCBwcmVmaXggPSBcXGB2YXIoLS1wcmVmaXgpXFxgO1xuICAgICAgICBsZXQgdXJsQ29uY2F0ID0gcHJlZml4KycvJytpbWc7XG4gICAgICAgIHJldHVybiBcInVybChcIit1cmxDb25jYXQuc3BsaXQoJyAnKS5qb2luKCcnKStcIilcIjtcbiAgICB9O1xuICAgIGJhY2tncm91bmQtaW1hZ2U6dmFyKC0tY29tcHV0ZVVybCk7XG59XG4jYXJncy1jc3MgI2JnMS1hcmdzIHtcbiAgICAtLWltZ1RvVXNlOiB2YXIoLS1pbWcxKTtcbn1cbiNhcmdzLWNzcyAjYmcyLWFyZ3Mge1xuICAgIC0taW1nVG9Vc2U6IHZhcigtLWltZzIpO1xufVxuYCxcbmZhbHNlLFxuW2hlbHBlckJnMSwgaGVscGVyQmcyXVxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9kZW1vUGFpbnRBcGlKc0luQ3NzKCkge1xuICAgICAgICBpZiAoISdwYWludFdvcmtsZXQnIGluIENTUyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAoQ1NTLnBhaW50V29ya2xldCB8fCBwYWludFdvcmtsZXQpLmFkZE1vZHVsZSgnLi9zY3JpcHRzL2hvdWRpbmkvY2lyY2xlLWZyb20tY3NzLXdvcmtsZXQuanMnKTtcblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYWludC1hcGktanMtaW4tY3NzJyksXG4gICAgICAgICAgICBgI3JlbmRlci1lbGVtZW50LXBhaW50LWFwaS1qcy1pbi1jc3Mge1xuICAgIC0tY2lyY2xlLWNvbG9yOiBibGFjaztcbiAgICAtLXdpZHRoLWNpcmNsZTogMTAwcHg7XG4gICAgd2lkdGg6IHZhcigtLXdpZHRoLWNpcmNsZSk7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogcGFpbnQoY2lyY2xlLWZyb20tY3NzKTtcbiAgICAtLWNpcmNsZTogKGN0eCwgZ2VvbSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xvciA9IFxcYHZhcigtLWNpcmNsZS1jb2xvcilcXGA7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY29uc3QgeCA9IGdlb20ud2lkdGggLyAyO1xuICAgICAgICBjb25zdCB5ID0gZ2VvbS5oZWlnaHQgLyAyO1xuICAgICAgICBsZXQgcmFkaXVzID0gTWF0aC5taW4oeCwgeSk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjdHguYXJjKHgsIHksIHJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgIH1cbn1cbmAsXG50cnVlKTtcbiAgICB9XG5cblxuXG5cbn0iLCIvKipcbiAqIENsYXNzIHRoYXQgaGVscHMgeW91IHRvIHBsYXkgd2l0aCBjdXN0b20gcHJvcGVydGllcyBcbiAqIGFuZCB0dXJuIHRoZW0gaW50byBKUyBDb2RlIHRoYXQgeW91IGV4ZWN1dGVcbiAqIFxuICogSWYgeW91ciBjdXN0b20gcHJvcGVydHkgaXMgbmFtZWQgLS1teVZhciwgdGhpcyB3aWxsIGNyZWF0ZSBhIC0tY29tcHV0ZU15VmFyXG4gKiBcbiAqL1xuZXhwb3J0IGNsYXNzIEhlbHBlckpzSW5Dc3N7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgOiBUaGUgZG9tIGVsZW1lbnQgd2hlcmUgd2UgZmluZCB0aGUgY3VzdG9tIHByb3BlcnR5IGFuZCB3aGVyZSB3ZSBhcHBseSB0aGUgY29tcHV0ZSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjdXN0b21Qcm9wZXJ0eSA6IHRoZSBjb21wbGV0ZSBuYW1lIG9mIGN1c3RvbSBwcm9wZXJ0eSAod2l0aCAnLS0nKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9vcCA6IHRydWUgaWYgeW91IHdhbnQgdG8gd2F0Y2ggdGhlIGN1c3RvbSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGFyZ3MgOiB0aGUgbGlzdCBvZiBhcmd1bWVudHMgeW91IGNhbiBwYXNzIHRvIHlvdXIgZnVuY3Rpb24gKGFyZ3VtZW50cyBtdXN0IGJlIGN1c3RvbSBwcm9lcnRpZXMpXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY3VzdG9tUHJvcGVydHksIGxvb3AsIGFyZ3Mpe1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgICAgIHRoaXMuY3VzdG9tUHJvcGVydHkgPSBjdXN0b21Qcm9wZXJ0eVxuICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICB0aGlzLmxvb3AgPSBsb29wXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3NcbiAgICAgICAgaWYgKGxvb3Ape1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNoZWNrRWxlbWVudHMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdGhlIGN1c3RvbSBwcm9wZXJ0eSBhbmQgZXZhbHVhdGUgdGhlIHNjcmlwdFxuICAgICAqL1xuICAgIGNoZWNrRWxlbWVudHMoKXtcblxuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMuY3VzdG9tUHJvcGVydHkpXG4gICAgICAgIGNvbnN0IGNvbXB1dGVBcmd1bWVudHMgPSBbXVxuICAgICAgICBpZiAodGhpcy5hcmdzICYmIHRoaXMuYXJncy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIHRoaXMuYXJncy5mb3JFYWNoKGFyZ3VtZW50UHJvcGVydHkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFyZ1ZhbHVlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKGFyZ3VtZW50UHJvcGVydHkpXG4gICAgICAgICAgICAgICAgY29tcHV0ZUFyZ3VtZW50cy5wdXNoKGFyZ1ZhbHVlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgY29uc3QgZXZhbHVhdGVWYWx1ZSA9IGV2YWwodmFsdWUpKC4uLmNvbXB1dGVBcmd1bWVudHMpXG4gICAgICAgICAgICBpZiAodGhpcy5sYXN0VmFsdWUgPT09IGV2YWx1YXRlVmFsdWUpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvb3Ape1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tFbGVtZW50cy5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGFzdFZhbHVlID0gZXZhbHVhdGVWYWx1ZVxuICAgICAgICAgICAgY29uc3QgY29tcHV0ZU5hbWUgPSBgLS1jb21wdXRlJHt0aGlzLmN1c3RvbVByb3BlcnR5WzJdLnRvVXBwZXJDYXNlKCl9JHt0aGlzLmN1c3RvbVByb3BlcnR5LnN1YnN0cmluZygzKX1gXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoY29tcHV0ZU5hbWUsIGV2YWx1YXRlVmFsdWUpXG4gICAgICAgIH1jYXRjaChlcnIpe31cblxuICAgICAgICBpZiAodGhpcy5sb29wKXtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja0VsZW1lbnRzLmJpbmQodGhpcykpXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vVHJpbVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQsIG5vVHJpbSA9IGZhbHNlLCBqc0luQ3NzSGVscGVycykge1xuICAgICAgICB0aGlzLmNvZGVNaXJyb3JDc3MgPSBDb2RlTWlycm9yKGVsdCwge1xuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxuICAgICAgICAgICAgbW9kZTogJ2NzcycsXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9SZWZyZXNoOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0N1cnNvcldoZW5TZWxlY3Rpbmc6IHRydWUsXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxuICAgICAgICAgICAgdGhlbWU6ICdpZGVhJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICB0aGlzLnN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuICAgICAgICB0aGlzLm5vVHJpbSA9IG5vVHJpbTtcblxuICAgICAgICB0aGlzLnN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xuICAgICAgICB9XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZSk7XG5cbiAgICAgICAgdGhpcy5jb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xuICAgICAgICB0aGlzLmNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3ModGhpcy5jb2RlTWlycm9yQ3NzLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgaWYgKGpzSW5Dc3NIZWxwZXJzICYmIGpzSW5Dc3NIZWxwZXJzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIGpzSW5Dc3NIZWxwZXJzLmZvckVhY2goanNJbkNzc0hlbHBlciA9PiBqc0luQ3NzSGVscGVyLmNoZWNrRWxlbWVudHMoKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xuICAgIH1cblxuICAgIGFwcGx5Q3NzKHZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5kZWxldGVSdWxlKDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcbiAgICAgICAgaWYgKCF0aGlzLm5vVHJpbSl7XG4gICAgICAgICAgICB2YWx1ZS5zcGxpdCgnfVxcbicpXG4gICAgICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChzZWxlY3RvckNzcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdG9yQ3NzIHx8IHNlbGVjdG9yQ3NzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yQ3NzICsgJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5uYkVsdHMrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNGVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmxpbmVIZWlnaHQgPSBMSU5FX0hFSUdIVDtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgTXkgdmFyIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ215dmFyJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyAgbGltaXQgdXJsIGNvbmNhdFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd1cmwnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0NTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gIGxpbWl0IEhvdWRpbmlcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnaG91ZGluaScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzI4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMzMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzM4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRFdmVudHNcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XG5pbXBvcnQge1xuICAgIERlbW9zXG59IGZyb20gJy4vZGVtb3MuanMnO1xuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKClcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
