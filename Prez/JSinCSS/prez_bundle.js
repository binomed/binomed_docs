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
            new _applyCss.ApplyCss(document.getElementById('codemirror-args'), ':root{\n    --scheme: http;\n    --hostname: localhost;\n    --port: 3000;\n    --path: assets/images;\n    --img1: hack1.jpg;\n    --img2: hack2.jpg;\n}\n#args-css .bg{\n    --url: (img) => {\n        let scheme = `var(--scheme)`;\n        let host = `var(--hostname)`;\n        let port = var(--port);\n        let path = `var(--path)`;\n        let urlConcat = scheme+\'://\'+host+\':\'+port+\'/\'+path+\'/\'+img;\n        return "url("+urlConcat.split(\' \').join(\'\')+")";\n    };\n    background-image:var(--computeUrl);\n}\n#args-css #bg1-args {\n    --imgToUse: var(--img1);\n}\n#args-css #bg2-args {\n    --imgToUse: var(--img2);\n}', false, [helperBg1, helperBg2]);
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

var HelperJsInCss = exports.HelperJsInCss = function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvSGVscGVySlNJbkNTUy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7O0FBR0E7Ozs7SUFFYSxLLFdBQUEsSztBQUVULHFCQUFjO0FBQUE7O0FBQ1YsWUFBSTs7QUFFQSxpQkFBSyxXQUFMO0FBQ0EsaUJBQUssZ0JBQUw7QUFDQSxpQkFBSyxlQUFMO0FBQ0EsaUJBQUssU0FBTDtBQUNILFNBTkQsQ0FNRSxPQUFPLEtBQVAsRUFBYztBQUNaLG9CQUFRLEtBQVIsQ0FBYyxLQUFkO0FBQ0g7QUFFSjs7OztzQ0FFYTs7QUFFVixnQkFBTSxjQUFjLElBQUksNEJBQUosQ0FBa0IsU0FBUyxJQUFULENBQWMsYUFBZCxDQUE0QixXQUE1QixDQUFsQixFQUE0RCxlQUE1RCxDQUFwQjtBQUNBLGdCQUFNLG1CQUFtQixJQUFJLDRCQUFKLENBQWtCLFNBQVMsSUFBVCxDQUFjLGFBQWQsQ0FBNEIsY0FBNUIsQ0FBbEIsRUFBK0QsY0FBL0QsRUFBK0UsS0FBL0UsQ0FBekI7O0FBRUEsZ0JBQU0sWUFBWSxJQUFJLDRCQUFKLENBQWtCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUFsQixFQUFrRCxPQUFsRCxFQUEyRCxLQUEzRCxFQUFrRSxDQUFDLFlBQUQsQ0FBbEUsQ0FBbEI7QUFDQSxnQkFBTSxZQUFZLElBQUksNEJBQUosQ0FBa0IsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBQWxCLEVBQWtELE9BQWxELEVBQTJELEtBQTNELEVBQWtFLENBQUMsWUFBRCxDQUFsRSxDQUFsQjs7QUFFQTtBQUNBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQURKLGtVQW9CUixLQXBCUSxFQXFCUixDQUFDLFdBQUQsRUFBYyxnQkFBZCxFQUFnQyxTQUFoQyxFQUEyQyxTQUEzQyxDQXJCUTtBQXVCSDs7OzJDQUVrQjs7QUFFZixnQkFBTSxjQUFjLElBQUksNEJBQUosQ0FBa0IsU0FBUyxJQUFULENBQWMsYUFBZCxDQUE0QixtQkFBNUIsQ0FBbEIsRUFBb0UsZUFBcEUsQ0FBcEI7QUFDQTtBQUNBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLG1CQUF4QixDQURKLDBUQWVSLEtBZlEsRUFnQlIsQ0FBQyxXQUFELENBaEJRO0FBa0JIOzs7MENBR2lCOztBQUVkLGdCQUFNLG1CQUFtQixJQUFJLDRCQUFKLENBQWtCLFNBQVMsSUFBVCxDQUFjLGFBQWQsQ0FBNEIsb0JBQTVCLENBQWxCLEVBQXFFLGNBQXJFLEVBQXFGLEtBQXJGLENBQXpCOztBQUdBO0FBQ0EsZ0JBQUksa0JBQUosQ0FDSSxTQUFTLGNBQVQsQ0FBd0IsdUJBQXhCLENBREosMEtBV1IsS0FYUSxFQVlSLENBQUMsZ0JBQUQsQ0FaUTtBQWNIOzs7b0NBRVc7O0FBR1IsZ0JBQU0sWUFBWSxJQUFJLDRCQUFKLENBQWtCLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUFsQixFQUF1RCxPQUF2RCxFQUFnRSxLQUFoRSxFQUF1RSxDQUFDLFlBQUQsQ0FBdkUsQ0FBbEI7QUFDQSxnQkFBTSxZQUFZLElBQUksNEJBQUosQ0FBa0IsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWxCLEVBQXVELE9BQXZELEVBQWdFLEtBQWhFLEVBQXVFLENBQUMsWUFBRCxDQUF2RSxDQUFsQjs7QUFFQTtBQUNBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLGlCQUF4QixDQURKLHdvQkEyQlIsS0EzQlEsRUE0QlIsQ0FBQyxTQUFELEVBQVksU0FBWixDQTVCUTtBQThCSDs7Ozs7Ozs7Ozs7Ozs7Ozs7SUMzSVEsYSxXQUFBLGE7QUFFVCwyQkFBWSxPQUFaLEVBQXFCLGNBQXJCLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQWdEO0FBQUE7O0FBQzVDLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxhQUFLLGNBQUwsR0FBc0IsY0FBdEI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQSxhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFlBQUksSUFBSixFQUFTO0FBQ0wsbUJBQU8scUJBQVAsQ0FBNkIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQTdCO0FBQ0gsU0FGRCxNQUVLO0FBQ0QsaUJBQUssYUFBTDtBQUNIO0FBQ0o7Ozs7d0NBRWM7QUFBQTs7QUFHWCxnQkFBTSxRQUFRLE9BQU8sZ0JBQVAsQ0FBd0IsS0FBSyxPQUE3QixFQUFzQyxnQkFBdEMsQ0FBdUQsS0FBSyxjQUE1RCxDQUFkO0FBQ0EsZ0JBQU0sbUJBQW1CLEVBQXpCO0FBQ0EsZ0JBQUksS0FBSyxJQUFMLElBQWEsS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixDQUFwQyxFQUFzQztBQUNsQyxxQkFBSyxJQUFMLENBQVUsT0FBVixDQUFrQiw0QkFBb0I7QUFDbEMsd0JBQU0sV0FBVyxPQUFPLGdCQUFQLENBQXdCLE1BQUssT0FBN0IsRUFBc0MsZ0JBQXRDLENBQXVELGdCQUF2RCxDQUFqQjtBQUNBLHFDQUFpQixJQUFqQixDQUFzQixRQUF0QjtBQUNILGlCQUhEO0FBSUg7O0FBR0QsZ0JBQUc7QUFDQyxvQkFBTSxnQkFBZ0IsS0FBSyxLQUFMLG1CQUFlLGdCQUFmLENBQXRCO0FBQ0Esb0JBQUksS0FBSyxTQUFMLEtBQW1CLGFBQXZCLEVBQXFDO0FBQ2pDLHdCQUFJLEtBQUssSUFBVCxFQUFjO0FBQ1YsK0JBQU8scUJBQVAsQ0FBNkIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQTdCO0FBQ0g7QUFDRDtBQUNIOztBQUVELHFCQUFLLFNBQUwsR0FBaUIsYUFBakI7QUFDQSxvQkFBTSw0QkFBMEIsS0FBSyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLFdBQXZCLEVBQTFCLEdBQWlFLEtBQUssY0FBTCxDQUFvQixTQUFwQixDQUE4QixDQUE5QixDQUF2RTtBQUNBLHFCQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLFdBQW5CLENBQStCLFdBQS9CLEVBQTRDLGFBQTVDO0FBQ0gsYUFaRCxDQVlDLE9BQU0sR0FBTixFQUFVLENBQUU7O0FBRWIsZ0JBQUksS0FBSyxJQUFULEVBQWM7QUFDVix1QkFBTyxxQkFBUCxDQUE2QixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBN0I7QUFDSDtBQUNKOzs7Ozs7OztBQzdDTDs7Ozs7Ozs7OztJQUVhLFEsV0FBQSxROztBQUVUOzs7Ozs7QUFNQSxzQkFBWSxHQUFaLEVBQWlCLGNBQWpCLEVBQWlFO0FBQUE7O0FBQUEsWUFBaEMsTUFBZ0MsdUVBQXZCLEtBQXVCO0FBQUEsWUFBaEIsY0FBZ0I7O0FBQUE7O0FBQzdELGFBQUssYUFBTCxHQUFxQixXQUFXLEdBQVgsRUFBZ0I7QUFDakMsbUJBQU8sY0FEMEI7QUFFakMsa0JBQU0sS0FGMkI7QUFHakMseUJBQWEsSUFIb0I7QUFJakMseUJBQWEsSUFKb0I7QUFLakMseUJBQWEsS0FMb0I7QUFNakMscUNBQXlCLElBTlE7QUFPakMsMEJBQWMsSUFQbUI7QUFRakMsNEJBQWdCLE1BUmlCO0FBU2pDLG1CQUFPO0FBVDBCLFNBQWhCLENBQXJCOztBQVlBLFlBQU0sT0FBTyxTQUFTLElBQVQsSUFBaUIsU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUE5QjtBQUNBLGFBQUssS0FBTCxHQUFhLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGFBQUssTUFBTCxHQUFjLE1BQWQ7O0FBRUEsYUFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixVQUFsQjtBQUNBLFlBQUksS0FBSyxLQUFMLENBQVcsVUFBZixFQUEyQjtBQUN2QixpQkFBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixPQUF0QixHQUFnQyxFQUFoQztBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUF2QjtBQUNIO0FBQ0QsYUFBSyxXQUFMLENBQWlCLEtBQUssS0FBdEI7O0FBRUEsYUFBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLE1BQTNCLEVBQW1DLE1BQW5DO0FBQ0EsYUFBSyxhQUFMLENBQW1CLEVBQW5CLENBQXNCLFFBQXRCLEVBQWdDLFlBQVk7QUFDeEMsa0JBQUssUUFBTCxDQUFjLE1BQUssYUFBTCxDQUFtQixRQUFuQixFQUFkO0FBQ0EsZ0JBQUksa0JBQWtCLGVBQWUsTUFBZixHQUF3QixDQUE5QyxFQUFnRDtBQUM1QywrQkFBZSxPQUFmLENBQXVCO0FBQUEsMkJBQWlCLGNBQWMsYUFBZCxFQUFqQjtBQUFBLGlCQUF2QjtBQUNIO0FBQ0osU0FMRDtBQU1BLGFBQUssUUFBTCxDQUFjLGNBQWQ7QUFDSDs7OztpQ0FFUSxLLEVBQU87QUFBQTs7QUFDWixpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMscUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsVUFBakIsQ0FBNEIsQ0FBNUI7QUFDSDtBQUNELGlCQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLLE1BQVYsRUFBaUI7QUFDYixzQkFBTSxLQUFOLENBQVksS0FBWixFQUNLLEdBREwsQ0FDUztBQUFBLDJCQUFPLElBQUksSUFBSixFQUFQO0FBQUEsaUJBRFQsRUFFSyxPQUZMLENBRWEsdUJBQWU7QUFDcEIsd0JBQUk7QUFDQSwrQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixVQUFqQixDQUE0QixjQUFjLEdBQTFDO0FBQ0EsK0JBQUssTUFBTDtBQUNILHFCQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDUixnQ0FBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0osaUJBVEw7QUFVSCxhQVhELE1BV0s7QUFDRCxvQkFBSTtBQUNBLHlCQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLENBQTRCLEtBQTVCO0FBQ0EseUJBQUssTUFBTDtBQUNILGlCQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDUiw0QkFBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0o7QUFFSjs7Ozs7OztBQ3ZFTDs7Ozs7Ozs7OztBQUVBLElBQU0sVUFBVSxPQUFoQjtBQUNBLElBQU0sY0FBYyxRQUFwQjtBQUNBLElBQU0scUJBQXFCLE9BQTNCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLG1CLFdBQUEsbUI7QUFDVCx1Q0FHRztBQUFBLFlBRkMsTUFFRCxRQUZDLE1BRUQ7QUFBQSxZQURDLGFBQ0QsUUFEQyxhQUNEOztBQUFBOztBQUNDLGFBQUssV0FBTCxHQUFtQixTQUFTLGNBQVQsZ0JBQXFDLE1BQXJDLENBQW5CO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLGFBQXJCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLGVBQU8sZ0JBQVAsV0FBZ0MsTUFBaEMsRUFBMEMsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUExQztBQUNBLGVBQU8sZ0JBQVAsZ0JBQXFDLE1BQXJDLEVBQStDLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBL0M7QUFDSDs7OzswQ0FFaUIsSyxFQUFPO0FBQ3JCLGdCQUFJO0FBQ0Esb0JBQUksYUFBYSxJQUFqQjtBQUNBLG9CQUFJLE1BQU0sSUFBTixLQUFlLE1BQW5CLEVBQTJCO0FBQ3ZCLHdCQUFJLEtBQUssU0FBTCxJQUFrQixDQUF0QixFQUF5QjtBQUNyQixxQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxTQUF4QixDQUFiO0FBQ0g7QUFDSixpQkFKRCxNQUtBLElBQUksTUFBTSxJQUFOLEtBQWUsZUFBbkIsRUFBb0M7QUFDaEMsd0JBQU0sUUFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsaUNBQWEsS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQWI7QUFFSCxpQkFMRCxNQUtPO0FBQ0gsd0JBQU0sU0FBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSx5QkFBSyxTQUFMLEdBQWlCLE1BQWpCO0FBQ0E7QUFDQSx3QkFBSSxTQUFRLENBQVosRUFBZTtBQUNYLHFDQUFhLEtBQUssYUFBTCxDQUFtQixTQUFRLENBQTNCLENBQWI7QUFDSDtBQUNKO0FBQ0Qsb0JBQU0sT0FBTyxhQUFhLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBYixHQUF1QyxFQUFwRDtBQUNBLG9CQUFNLE9BQU8sRUFBYjtBQUNBLG9CQUFNLFdBQVcsRUFBakI7QUFDQSxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsd0JBQU0sTUFBTSxLQUFLLENBQUwsQ0FBWjtBQUNBLDRCQUFRLElBQVI7QUFDSSw2QkFBSyxRQUFRLE1BQWI7QUFDQSw2QkFBSyxRQUFRLFNBQWI7QUFDQSw2QkFBSyxRQUFRLEtBQWI7QUFDQSw2QkFBSyxRQUFRLFFBQWI7QUFDQSw2QkFBSyxRQUFRLFdBQWI7QUFDQSw2QkFBSyxRQUFRLFlBQWI7QUFDSSxxQ0FBUyxHQUFULElBQWdCLFdBQVcsR0FBWCxDQUFoQjtBQUNBO0FBQ0osNkJBQUssUUFBUSxRQUFiO0FBQ0EsNkJBQUssUUFBUSxPQUFiO0FBQ0EsNkJBQUssUUFBUSxLQUFiO0FBQ0EsNkJBQUssUUFBUSxNQUFiO0FBQ0ksaUNBQUssR0FBTCxJQUFZLFdBQVcsR0FBWCxDQUFaO0FBQ0E7QUFDSjtBQWZKO0FBa0JIOztBQUVELG9CQUFJLFNBQVMsU0FBVCxLQUF1QixTQUEzQixFQUFzQztBQUNsQyw2QkFBUyxTQUFULEdBQXFCLE9BQXJCO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLE9BQVQsS0FBcUIsU0FBckIsSUFBa0MsS0FBSyxNQUFMLEtBQWdCLFNBQXRELEVBQWlFO0FBQzdELHlCQUFLLE1BQUwsR0FBYyxXQUFkO0FBQ0g7QUFDRCxvQkFBSSxTQUFTLElBQVQsS0FBa0IsU0FBbEIsSUFBK0IsS0FBSyxHQUFMLEtBQWEsU0FBaEQsRUFBMkQ7QUFDdkQseUJBQUssR0FBTCxHQUFXLENBQVg7QUFDSDtBQUNELG9CQUFJLFNBQVMsTUFBVCxLQUFvQixTQUFwQixJQUFpQyxLQUFLLEtBQUwsS0FBZSxTQUFwRCxFQUErRDtBQUMzRCx5QkFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNIO0FBQ0Qsb0JBQUksU0FBUyxHQUFULEtBQWlCLFNBQWpCLElBQThCLEtBQUssSUFBTCxLQUFjLFNBQWhELEVBQTJEO0FBQ3ZELHlCQUFLLElBQUwsR0FBWSxDQUFaO0FBQ0g7QUFDRCxxQkFBSyxXQUFMLENBQWlCLElBQWpCLEdBQXdCLElBQXhCO0FBQ0EscUJBQUssV0FBTCxDQUFpQixRQUFqQixHQUE0QixRQUE1QjtBQUNBLHFCQUFLLFdBQUwsQ0FBaUIsVUFBakIsR0FBOEIsV0FBOUI7QUFFSCxhQWhFRCxDQWdFRSxPQUFPLENBQVAsRUFBVTtBQUNSLHdCQUFRLEtBQVIsQ0FBYyxDQUFkO0FBQ0g7QUFDSjs7OzJDQUVrQjtBQUNmLGlCQUFLLGlCQUFMLENBQXVCO0FBQ25CLHNCQUFNLE1BRGE7QUFFbkIsMEJBQVUsU0FBUyxhQUFULENBQXVCLHNCQUF2QjtBQUZTLGFBQXZCO0FBSUEsbUJBQU8sZ0JBQVAsQ0FBd0IsZUFBeEIsRUFBeUMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QztBQUNBLG1CQUFPLGdCQUFQLENBQXdCLGdCQUF4QixFQUEwQyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTFDO0FBQ0g7OzsrQ0FFc0I7QUFDbkIsbUJBQU8sbUJBQVAsQ0FBMkIsZUFBM0IsRUFBNEMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUE1QztBQUNBLG1CQUFPLG1CQUFQLENBQTJCLGdCQUEzQixFQUE2QyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQTdDO0FBQ0g7Ozs7Ozs7QUN0R0w7Ozs7Ozs7QUFFQTs7OztBQUlBLElBQU0sY0FBYyxJQUFwQjtBQUNBLElBQU0sb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLGUsV0FBQSxlLEdBQ1QsMkJBQWM7QUFBQTs7QUFDVjtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsT0FEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixrQkFBTSxDQURNO0FBRVosb0JBQVEsT0FGSTtBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWTtBQUhLLEtBQXhCOztBQWdCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsS0FEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixpQkFBSyxLQURPO0FBRVosb0JBQVEsT0FGSTtBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGlCQUFLLEdBRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWSxFQVVaO0FBQ0MsaUJBQUssR0FETjtBQUVDLG9CQUFRLE9BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQVZZO0FBSEssS0FBeEI7QUFxQkgsQzs7O0FDbkRMOztBQUVBOztBQUdBOztBQUtBLENBQUMsa0JBQWtCOztBQUdmLG1CQUFlLFFBQWYsR0FBMEI7O0FBRXRCLFlBQU0sV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXRDOztBQUVBLFlBQUksK0JBQUo7QUFDQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1gsZ0JBQUksWUFBSjtBQUNIO0FBRUo7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBakJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHtcbiAgICBBcHBseUNzc1xufSBmcm9tICcuL2hlbHBlci9hcHBseUNzcy5qcyc7XG5pbXBvcnQgeyBIZWxwZXJKc0luQ3NzfSBmcm9tICcuL2hlbHBlci9IZWxwZXJKU0luQ1NTLmpzJ1xuXG5leHBvcnQgY2xhc3MgRGVtb3Mge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9SYW5kb21Db2xvcigpO1xuICAgICAgICAgICAgdGhpcy5fZGVtb0RlcGVuZGFuY3koKTtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9BcmdzKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2RlbW9Dc3NWYXIoKSB7XG5cbiAgICAgICAgY29uc3QgaGVscGVyQ29sb3IgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNwdXJlLWNzcycpLCBcIi0tcmFuZG9tQ29sb3JcIik7XG4gICAgICAgIGNvbnN0IGhlbHBlckRlcGVuZGFuY3kgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNwdXJlLWNzcyBoMScpLCBcIi0tZGVwZW5kYW5jeVwiLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3QgaGVscGVyQmcxID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnMScpLCAnLS11cmwnLCBmYWxzZSwgWyctLWltZ1RvVXNlJ10pO1xuICAgICAgICBjb25zdCBoZWxwZXJCZzIgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmcyJyksICctLXVybCcsIGZhbHNlLCBbJy0taW1nVG9Vc2UnXSk7XG5cbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcycpLFxuICAgICAgICAgICAgYDpyb290e1xuICAgIC0tY29kZW1pcm9yLXNpemU6IDMwcHg7XG59XG4jcHVyZS1jc3N7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY29tcHV0ZVJhbmRvbUNvbG9yKTtcbn1cbiNwdXJlLWNzcyBoMSB7XG4gICAgY29sb3I6IHZhcigtLWNvbXB1dGVEZXBlbmRhbmN5KTtcbn1cbiNwdXJlLWNzcyAuYmd7XG4gICAgYmFja2dyb3VuZC1pbWFnZTp2YXIoLS1jb21wdXRlVXJsKTtcbn1cbiNwdXJlLWNzcyAjYmcxIHtcbiAgICAtLWltZ1RvVXNlOiB2YXIoLS1pbWcxKTtcbn1cbiNwdXJlLWNzcyAjYmcyIHtcbiAgICAtLWltZ1RvVXNlOiB2YXIoLS1pbWcyKTtcbn1gLFxuZmFsc2UsXG5baGVscGVyQ29sb3IsIGhlbHBlckRlcGVuZGFuY3ksIGhlbHBlckJnMSwgaGVscGVyQmcyXVxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9kZW1vUmFuZG9tQ29sb3IoKSB7XG5cbiAgICAgICAgY29uc3QgaGVscGVyQ29sb3IgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNyYW5kb20tY29sb3ItY3NzJyksIFwiLS1yYW5kb21Db2xvclwiKTtcbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXJhbmRvbScpLFxuICAgICAgICAgICAgYDpyb290e1xuICAgIC0tY29kZW1pcm9yLXNpemU6IDMwcHg7XG59XG4jcmFuZG9tLWNvbG9yLWNzc3tcbiAgICAtLXJhbmRvbUNvbG9yOiAoKSA9PiB7XG4gICAgICAgIGxldCByZWQgPSBNYXRoLnJhbmRvbSgpKjI1NTtcbiAgICAgICAgbGV0IGdyZWVuID0gTWF0aC5yYW5kb20oKSoyNTU7XG4gICAgICAgIGxldCBibHVlID0gTWF0aC5yYW5kb20oKSoyNTU7XG4gICAgICAgIHJldHVybiBcXGByZ2IoXFwke3JlZH0sXFwke2dyZWVufSxcXCR7Ymx1ZX0pXFxgO1xuICAgIH07XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY29tcHV0ZVJhbmRvbUNvbG9yKTtcbn1cbmAsXG5mYWxzZSxcbltoZWxwZXJDb2xvcl1cbiAgICAgICAgKTtcbiAgICB9XG5cblxuICAgIF9kZW1vRGVwZW5kYW5jeSgpIHtcblxuICAgICAgICBjb25zdCBoZWxwZXJEZXBlbmRhbmN5ID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjZGVwZW5kYW5jeS1jc3MgaDEnKSwgXCItLWRlcGVuZGFuY3lcIiwgZmFsc2UpO1xuXG5cbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWRlcGVuZGFuY3knKSxcbiAgICAgICAgICAgIGA6cm9vdHtcbiAgICAtLWNvZGVtaXJvci1zaXplOiAzMHB4O1xufVxuI2RlcGVuZGFuY3ktY3NzIGgxIHtcbiAgICAtLWNvbG9yOmJsdWU7XG4gICAgLS1kZXBlbmRhbmN5IDogKCkgPT4gXFxgdmFyKC0tY29sb3IpXFxgO1xuICAgIGNvbG9yOiB2YXIoLS1jb21wdXRlRGVwZW5kYW5jeSk7XG59XG5gLFxuZmFsc2UsXG5baGVscGVyRGVwZW5kYW5jeV1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfZGVtb0FyZ3MoKSB7XG5cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGhlbHBlckJnMSA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZzEtYXJncycpLCAnLS11cmwnLCBmYWxzZSwgWyctLWltZ1RvVXNlJ10pO1xuICAgICAgICBjb25zdCBoZWxwZXJCZzIgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmcyLWFyZ3MnKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcblxuICAgICAgICAvKiogKi9cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItYXJncycpLFxuICAgICAgICAgICAgYDpyb290e1xuICAgIC0tc2NoZW1lOiBodHRwO1xuICAgIC0taG9zdG5hbWU6IGxvY2FsaG9zdDtcbiAgICAtLXBvcnQ6IDMwMDA7XG4gICAgLS1wYXRoOiBhc3NldHMvaW1hZ2VzO1xuICAgIC0taW1nMTogaGFjazEuanBnO1xuICAgIC0taW1nMjogaGFjazIuanBnO1xufVxuI2FyZ3MtY3NzIC5iZ3tcbiAgICAtLXVybDogKGltZykgPT4ge1xuICAgICAgICBsZXQgc2NoZW1lID0gXFxgdmFyKC0tc2NoZW1lKVxcYDtcbiAgICAgICAgbGV0IGhvc3QgPSBcXGB2YXIoLS1ob3N0bmFtZSlcXGA7XG4gICAgICAgIGxldCBwb3J0ID0gdmFyKC0tcG9ydCk7XG4gICAgICAgIGxldCBwYXRoID0gXFxgdmFyKC0tcGF0aClcXGA7XG4gICAgICAgIGxldCB1cmxDb25jYXQgPSBzY2hlbWUrJzovLycraG9zdCsnOicrcG9ydCsnLycrcGF0aCsnLycraW1nO1xuICAgICAgICByZXR1cm4gXCJ1cmwoXCIrdXJsQ29uY2F0LnNwbGl0KCcgJykuam9pbignJykrXCIpXCI7XG4gICAgfTtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOnZhcigtLWNvbXB1dGVVcmwpO1xufVxuI2FyZ3MtY3NzICNiZzEtYXJncyB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMSk7XG59XG4jYXJncy1jc3MgI2JnMi1hcmdzIHtcbiAgICAtLWltZ1RvVXNlOiB2YXIoLS1pbWcyKTtcbn1gLFxuZmFsc2UsXG5baGVscGVyQmcxLCBoZWxwZXJCZzJdXG4gICAgICAgICk7XG4gICAgfVxuXG5cblxufSIsImV4cG9ydCBjbGFzcyBIZWxwZXJKc0luQ3Nze1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY3VzdG9tUHJvcGVydHksIGxvb3AsIGFyZ3Mpe1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgICAgIHRoaXMuY3VzdG9tUHJvcGVydHkgPSBjdXN0b21Qcm9wZXJ0eVxuICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICB0aGlzLmxvb3AgPSBsb29wXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3NcbiAgICAgICAgaWYgKGxvb3Ape1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNoZWNrRWxlbWVudHMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tFbGVtZW50cygpe1xuXG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUodGhpcy5jdXN0b21Qcm9wZXJ0eSlcbiAgICAgICAgY29uc3QgY29tcHV0ZUFyZ3VtZW50cyA9IFtdXG4gICAgICAgIGlmICh0aGlzLmFyZ3MgJiYgdGhpcy5hcmdzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgdGhpcy5hcmdzLmZvckVhY2goYXJndW1lbnRQcm9wZXJ0eSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJnVmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoYXJndW1lbnRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICBjb21wdXRlQXJndW1lbnRzLnB1c2goYXJnVmFsdWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICB0cnl7XG4gICAgICAgICAgICBjb25zdCBldmFsdWF0ZVZhbHVlID0gZXZhbCh2YWx1ZSkoLi4uY29tcHV0ZUFyZ3VtZW50cylcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RWYWx1ZSA9PT0gZXZhbHVhdGVWYWx1ZSl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9vcCl7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja0VsZW1lbnRzLmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSBldmFsdWF0ZVZhbHVlXG4gICAgICAgICAgICBjb25zdCBjb21wdXRlTmFtZSA9IGAtLWNvbXB1dGUke3RoaXMuY3VzdG9tUHJvcGVydHlbMl0udG9VcHBlckNhc2UoKX0ke3RoaXMuY3VzdG9tUHJvcGVydHkuc3Vic3RyaW5nKDMpfWBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShjb21wdXRlTmFtZSwgZXZhbHVhdGVWYWx1ZSlcbiAgICAgICAgfWNhdGNoKGVycil7fVxuXG4gICAgICAgIGlmICh0aGlzLmxvb3Ape1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgfVxuICAgIH1cblxufSIsIid1c2Ugc3RpY3QnXG5cbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmltXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCwgbm9UcmltID0gZmFsc2UsIGpzSW5Dc3NIZWxwZXJzKSB7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ2lkZWEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIHRoaXMubm9UcmltID0gbm9UcmltO1xuXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcblxuICAgICAgICB0aGlzLmNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyh0aGlzLmNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICBpZiAoanNJbkNzc0hlbHBlcnMgJiYganNJbkNzc0hlbHBlcnMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAganNJbkNzc0hlbHBlcnMuZm9yRWFjaChqc0luQ3NzSGVscGVyID0+IGpzSW5Dc3NIZWxwZXIuY2hlY2tFbGVtZW50cygpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hcHBseUNzcyhpbml0aWFsQ29udGVudCk7XG4gICAgfVxuXG4gICAgYXBwbHlDc3ModmFsdWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0LmRlbGV0ZVJ1bGUoMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuICAgICAgICBpZiAoIXRoaXMubm9UcmltKXtcbiAgICAgICAgICAgIHZhbHVlLnNwbGl0KCd9XFxuJylcbiAgICAgICAgICAgICAgICAubWFwKHN0ciA9PiBzdHIudHJpbSgpKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHNlbGVjdG9yQ3NzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcyArICd9Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTRlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5saW5lSGVpZ2h0ID0gTElORV9IRUlHSFQ7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxuICAgICAgICB9KTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG5cbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xuXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gIE15IHZhciBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdteXZhcicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzIwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzI3MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gIGxpbWl0IHVybCBjb25jYXRcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndXJsJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNDUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHtcbiAgICBEZW1vc1xufSBmcm9tICcuL2RlbW9zLmpzJztcblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpXG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyJdfQ==
