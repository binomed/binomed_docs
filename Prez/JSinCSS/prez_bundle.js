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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvSGVscGVySlNJbkNTUy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBQ0E7O0FBR0E7Ozs7SUFFYSxLLFdBQUEsSztBQUVULHFCQUFjO0FBQUE7O0FBQ1YsWUFBSTs7QUFFQSxpQkFBSyxXQUFMO0FBQ0gsU0FIRCxDQUdFLE9BQU8sS0FBUCxFQUFjO0FBQ1osb0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFDSDtBQUVKOzs7O3NDQUVhOztBQUVWLGdCQUFNLGNBQWMsSUFBSSw0QkFBSixDQUFrQixTQUFTLElBQVQsQ0FBYyxhQUFkLENBQTRCLFdBQTVCLENBQWxCLEVBQTRELGVBQTVELENBQXBCO0FBQ0EsZ0JBQU0sbUJBQW1CLElBQUksNEJBQUosQ0FBa0IsU0FBUyxJQUFULENBQWMsYUFBZCxDQUE0QixjQUE1QixDQUFsQixFQUErRCxjQUEvRCxFQUErRSxLQUEvRSxDQUF6Qjs7QUFFQSxnQkFBTSxZQUFZLElBQUksNEJBQUosQ0FBa0IsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBQWxCLEVBQWtELE9BQWxELEVBQTJELEtBQTNELEVBQWtFLENBQUMsWUFBRCxDQUFsRSxDQUFsQjtBQUNBLGdCQUFNLFlBQVksSUFBSSw0QkFBSixDQUFrQixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBbEIsRUFBa0QsT0FBbEQsRUFBMkQsS0FBM0QsRUFBa0UsQ0FBQyxZQUFELENBQWxFLENBQWxCOztBQUVBO0FBQ0EsZ0JBQUksa0JBQUosQ0FDSSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBREosa1VB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QUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBRUEsWUFBSSwrQkFBSjtBQUNBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxnQkFBSSxZQUFKO0FBQ0g7QUFFSjs7QUFJRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0FqQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q3NzXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcbmltcG9ydCB7IEhlbHBlckpzSW5Dc3N9IGZyb20gJy4vaGVscGVyL0hlbHBlckpTSW5DU1MuanMnXG5cbmV4cG9ydCBjbGFzcyBEZW1vcyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFyKCkge1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckNvbG9yID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcHVyZS1jc3MnKSwgXCItLXJhbmRvbUNvbG9yXCIpO1xuICAgICAgICBjb25zdCBoZWxwZXJEZXBlbmRhbmN5ID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjcHVyZS1jc3MgaDEnKSwgXCItLWRlcGVuZGFuY3lcIiwgZmFsc2UpO1xuXG4gICAgICAgIGNvbnN0IGhlbHBlckJnMSA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZzEnKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcbiAgICAgICAgY29uc3QgaGVscGVyQmcyID0gbmV3IEhlbHBlckpzSW5Dc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnMicpLCAnLS11cmwnLCBmYWxzZSwgWyctLWltZ1RvVXNlJ10pO1xuXG4gICAgICAgIC8qKiAqL1xuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcbiAgICAgICAgICAgIGA6cm9vdHtcbiAgICAtLWNvZGVtaXJvci1zaXplOiAzMHB4O1xufVxuI3B1cmUtY3Nze1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvbXB1dGVSYW5kb21Db2xvcik7XG59XG4jcHVyZS1jc3MgaDEge1xuICAgIGNvbG9yOiB2YXIoLS1jb21wdXRlRGVwZW5kYW5jeSk7XG59XG4jcHVyZS1jc3MgLmJne1xuICAgIGJhY2tncm91bmQtaW1hZ2U6dmFyKC0tY29tcHV0ZVVybCk7XG59XG4jcHVyZS1jc3MgI2JnMSB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMSk7XG59XG4jcHVyZS1jc3MgI2JnMiB7XG4gICAgLS1pbWdUb1VzZTogdmFyKC0taW1nMik7XG59YCxcbmZhbHNlLFxuW2hlbHBlckNvbG9yLCBoZWxwZXJEZXBlbmRhbmN5LCBoZWxwZXJCZzEsIGhlbHBlckJnMl1cbiAgICAgICAgKTtcbiAgICB9XG5cblxuXG59IiwiZXhwb3J0IGNsYXNzIEhlbHBlckpzSW5Dc3N7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjdXN0b21Qcm9wZXJ0eSwgbG9vcCwgYXJncyl7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgICAgdGhpcy5jdXN0b21Qcm9wZXJ0eSA9IGN1c3RvbVByb3BlcnR5XG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIHRoaXMubG9vcCA9IGxvb3BcbiAgICAgICAgdGhpcy5hcmdzID0gYXJnc1xuICAgICAgICBpZiAobG9vcCl7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tFbGVtZW50cy5iaW5kKHRoaXMpKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tFbGVtZW50cygpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0VsZW1lbnRzKCl7XG5cblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLmN1c3RvbVByb3BlcnR5KVxuICAgICAgICBjb25zdCBjb21wdXRlQXJndW1lbnRzID0gW11cbiAgICAgICAgaWYgKHRoaXMuYXJncyAmJiB0aGlzLmFyZ3MubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICB0aGlzLmFyZ3MuZm9yRWFjaChhcmd1bWVudFByb3BlcnR5ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcmdWYWx1ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShhcmd1bWVudFByb3BlcnR5KVxuICAgICAgICAgICAgICAgIGNvbXB1dGVBcmd1bWVudHMucHVzaChhcmdWYWx1ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGNvbnN0IGV2YWx1YXRlVmFsdWUgPSBldmFsKHZhbHVlKSguLi5jb21wdXRlQXJndW1lbnRzKVxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFZhbHVlID09PSBldmFsdWF0ZVZhbHVlKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb29wKXtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IGV2YWx1YXRlVmFsdWVcbiAgICAgICAgICAgIGNvbnN0IGNvbXB1dGVOYW1lID0gYC0tY29tcHV0ZSR7dGhpcy5jdXN0b21Qcm9wZXJ0eVsyXS50b1VwcGVyQ2FzZSgpfSR7dGhpcy5jdXN0b21Qcm9wZXJ0eS5zdWJzdHJpbmcoMyl9YFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGNvbXB1dGVOYW1lLCBldmFsdWF0ZVZhbHVlKVxuICAgICAgICB9Y2F0Y2goZXJyKXt9XG5cbiAgICAgICAgaWYgKHRoaXMubG9vcCl7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tFbGVtZW50cy5iaW5kKHRoaXMpKVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiJ3VzZSBzdGljdCdcblxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxDb250ZW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBub1RyaW1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50LCBub1RyaW0gPSBmYWxzZSwganNJbkNzc0hlbHBlcnMpIHtcbiAgICAgICAgdGhpcy5jb2RlTWlycm9yQ3NzID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICBhdXRvUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnaWRlYSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdGhpcy5zdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcbiAgICAgICAgdGhpcy5ub1RyaW0gPSBub1RyaW07XG5cbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xuXG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcbiAgICAgICAgdGhpcy5jb2RlTWlycm9yQ3NzLm9uKCdjaGFuZ2UnLCAoLi4ub2JqKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFwcGx5Q3NzKHRoaXMuY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgIGlmIChqc0luQ3NzSGVscGVycyAmJiBqc0luQ3NzSGVscGVycy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBqc0luQ3NzSGVscGVycy5mb3JFYWNoKGpzSW5Dc3NIZWxwZXIgPT4ganNJbkNzc0hlbHBlci5jaGVja0VsZW1lbnRzKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFwcGx5Q3NzKGluaXRpYWxDb250ZW50KTtcbiAgICB9XG5cbiAgICBhcHBseUNzcyh2YWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubmJFbHRzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIGlmICghdGhpcy5ub1RyaW0pe1xuICAgICAgICAgICAgdmFsdWUuc3BsaXQoJ31cXG4nKVxuICAgICAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yQ3NzICsgJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5uYkVsdHMrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNGVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmxpbmVIZWlnaHQgPSBMSU5FX0hFSUdIVDtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgTXkgdmFyIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ215dmFyJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyAgbGltaXQgdXJsIGNvbmNhdFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd1cmwnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRFdmVudHNcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XG5pbXBvcnQge1xuICAgIERlbW9zXG59IGZyb20gJy4vZGVtb3MuanMnO1xuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKClcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
