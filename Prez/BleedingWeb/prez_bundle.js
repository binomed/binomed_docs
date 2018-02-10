(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
'use stict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplyCss =

/**
 *
 * @param {HtmlElement} elt
 * @param {string} initialContent
 */
exports.ApplyCss = function ApplyCss(elt, initialContent) {
    _classCallCheck(this, ApplyCss);

    var codeMirrorCss = CodeMirror(elt, {
        value: initialContent,
        mode: 'css',
        lineNumber: 'true',
        fixedGutter: false,
        showCursorWhenSelecting: true,
        lineWrapping: true,
        scrollbarStyle: 'null',
        theme: 'solarized dark'
    });
    codeMirrorCss.setSize('100%', '100%');
    codeMirrorCss.on('change', function () {
        codeMirrorCss.getValue().split('}').map(function (str) {
            return str.trim();
        }).forEach(function (selectorCss) {
            var _selectorCss$split$ma = selectorCss.split('{').map(function (str) {
                return str.trim();
            }),
                _selectorCss$split$ma2 = _slicedToArray(_selectorCss$split$ma, 2),
                selector = _selectorCss$split$ma2[0],
                properties = _selectorCss$split$ma2[1];

            if (selector && selector.length > 0 && document.querySelector(selector)) {
                properties.split(';').map(function (str) {
                    return str.trim();
                }).forEach(function (cssInstruction) {
                    try {
                        var _cssInstruction$split = cssInstruction.split(':').map(function (keyValue) {
                            return keyValue.trim();
                        }),
                            _cssInstruction$split2 = _slicedToArray(_cssInstruction$split, 2),
                            key = _cssInstruction$split2[0],
                            value = _cssInstruction$split2[1];

                        if (key.startsWith('--')) {
                            document.querySelector(selector).style.setProperty(key, value);
                        } else {
                            document.querySelector(selector).style[key] = value;
                        }
                    } catch (e) {}
                });
            }
        });
    });
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_TOP = '90px';
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

},{}],3:[function(require,module,exports){
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

    //  Polymer Declaration
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'css-variables',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            width: '40%'
        }, {
            line: 2,
            nbLines: 4,
            left: '100px',
            width: '40%'
        }, {
            line: 9,
            width: '60%'
        }]
    });
};

},{"./helper/highlightCodeHelper.js":2}],4:[function(require,module,exports){
'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';

var _applyCss = require('./applyCss.js');

var _highlightEvent = require('./highlightEvent.js');

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

        if (!inIframe) {
            _codeMirorsDetects();
            new _highlightEvent.HighlightEvents();
        }
    }

    function _codeMirorsDetects() {
        try {

            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), '\n                #render-element{\n                    --a-super-var: #FFF;\n                }\n                #render-element .text-1{\n\n                }\n                #render-element .text-2{\n\n                }\n                ');
        } catch (error) {
            console.error(error);
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./applyCss.js":1,"./highlightEvent.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7Ozs7Ozs7SUFFYSxROztBQUVUOzs7OztRQUZTLFEsR0FPVCxrQkFBWSxHQUFaLEVBQWlCLGNBQWpCLEVBQWlDO0FBQUE7O0FBQzdCLFFBQU0sZ0JBQWdCLFdBQVcsR0FBWCxFQUFnQjtBQUNsQyxlQUFPLGNBRDJCO0FBRWxDLGNBQU0sS0FGNEI7QUFHbEMsb0JBQVksTUFIc0I7QUFJbEMscUJBQWEsS0FKcUI7QUFLbEMsaUNBQXlCLElBTFM7QUFNbEMsc0JBQWMsSUFOb0I7QUFPbEMsd0JBQWdCLE1BUGtCO0FBUWxDLGVBQU87QUFSMkIsS0FBaEIsQ0FBdEI7QUFVQSxrQkFBYyxPQUFkLENBQXNCLE1BQXRCLEVBQThCLE1BQTlCO0FBQ0Esa0JBQWMsRUFBZCxDQUFpQixRQUFqQixFQUEyQixZQUFZO0FBQ25DLHNCQUFjLFFBQWQsR0FDSyxLQURMLENBQ1csR0FEWCxFQUVLLEdBRkwsQ0FFUztBQUFBLG1CQUFPLElBQUksSUFBSixFQUFQO0FBQUEsU0FGVCxFQUdLLE9BSEwsQ0FHYSx1QkFBZTtBQUFBLHdDQUNXLFlBQVksS0FBWixDQUFrQixHQUFsQixFQUF1QixHQUF2QixDQUEyQjtBQUFBLHVCQUFPLElBQUksSUFBSixFQUFQO0FBQUEsYUFBM0IsQ0FEWDtBQUFBO0FBQUEsZ0JBQ2IsUUFEYTtBQUFBLGdCQUNILFVBREc7O0FBRXBCLGdCQUFJLFlBQ0EsU0FBUyxNQUFULEdBQWtCLENBRGxCLElBRUEsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBRkosRUFFc0M7QUFDbEMsMkJBQVcsS0FBWCxDQUFpQixHQUFqQixFQUNLLEdB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Q0ksU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQURKO0FBZUgsU0FqQkQsQ0FpQkUsT0FBTyxLQUFQLEVBQWM7QUFDWixvQkFBUSxLQUFSLENBQWMsS0FBZDtBQUNIO0FBRUo7O0FBS0QsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBMUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RpY3QnXG5cbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6ICd0cnVlJyxcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnc29sYXJpemVkIGRhcmsnXG4gICAgICAgIH0pO1xuICAgICAgICBjb2RlTWlycm9yQ3NzLnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xuICAgICAgICBjb2RlTWlycm9yQ3NzLm9uKCdjaGFuZ2UnLCAoLi4ub2JqKSA9PiB7XG4gICAgICAgICAgICBjb2RlTWlycm9yQ3NzLmdldFZhbHVlKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoJ30nKVxuICAgICAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbc2VsZWN0b3IsIHByb3BlcnRpZXNdID0gc2VsZWN0b3JDc3Muc3BsaXQoJ3snKS5tYXAoc3RyID0+IHN0ci50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnNwbGl0KCc7JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKHN0ciA9PiBzdHIudHJpbSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGNzc0luc3RydWN0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IGNzc0luc3RydWN0aW9uLnNwbGl0KCc6JykubWFwKGtleVZhbHVlID0+IGtleVZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJy0tJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcikuc3R5bGVba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCIndXNlIHN0cmljdCdcblxuY29uc3QgTUlOX1RPUCA9ICc5MHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcbiAgICAgICAgICAgIHR5cGU6IFwiaW5pdFwiLFxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcbiAgICAgICAgfSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcblxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vICBQb2x5bWVyIERlY2xhcmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2Nzcy12YXJpYWJsZXMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cblxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xuaW1wb3J0IHtcbiAgICBBcHBseUNzc1xufSBmcm9tICcuL2FwcGx5Q3NzLmpzJztcbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XG4gICAgICAgICAgICBfY29kZU1pcm9yc0RldGVjdHMoKTtcbiAgICAgICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NvZGVNaXJvcnNEZXRlY3RzKCkge1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzJyksXG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgICNyZW5kZXItZWxlbWVudHtcbiAgICAgICAgICAgICAgICAgICAgLS1hLXN1cGVyLXZhcjogI0ZGRjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgI3JlbmRlci1lbGVtZW50IC50ZXh0LTJ7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiXX0=
