(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

        Reveal.addEventListener('code-' + keyElt, this._listenFragments.bind(this));
        Reveal.addEventListener('stop-code-' + keyElt, this._unregisterFragments.bind(this));
    }

    _createClass(HighlightCodeHelper, [{
        key: '_progressFragment',
        value: function _progressFragment(event) {
            try {
                var properties = null;
                if (event.type === 'fragmentshown') {
                    var index = +event.fragment.getAttribute('data-fragment-index');
                    properties = this.positionArray[index];
                } else {
                    var _index = +event.fragment.getAttribute('data-fragment-index');
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

},{}],2:[function(require,module,exports){
'use strict';

var _revealEngineEvents = require('./prez/revealEngineEvents.js');

(function () {

    function pageLoad() {
        new _revealEngineEvents.RevealEngineEvents();

        _manageTimer();
    }

    function _manageTimer() {

        var startTimer = false;
        Reveal.addEventListener('slidechanged', function (event) {
            console.log(event);
            if (event.indexh > 0 && !startTimer) {
                startTimer = true;
                document.querySelector('gdg-timer').toggle = true;
            } else if (event.indexh === 0 && startTimer) {
                startTimer = false;
            }
        });
    }

    window.addEventListener('load', pageLoad);
})();

},{"./prez/revealEngineEvents.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HighlightEvents = undefined;

var _highlightCodeHelper = require('../helpers/highlightCodeHelper.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LINE_HEIGHT = 1.15;
var ADDITIONNAL_HEIGT = 0.4;
var COL_WIDTH = 35;

var HighlightEvents = exports.HighlightEvents = function HighlightEvents() {
    _classCallCheck(this, HighlightEvents);

    //  Polymer Declaration
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer1-declaration',
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
        }, {
            line: 11,
            width: '60%'
        }]
    });

    //  Polymer Life Cycle
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer1-life-cycle',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 3,
            left: '100px',
            width: '80%'
        }, {
            line: 4,
            left: '100px',
            width: '80%'
        }, {
            line: 5,
            left: '100px',
            width: '80%'
        }, {
            line: 6,
            left: '100px',
            width: '80%'
        }, {
            line: 7,
            left: '100px',
            width: '80%'
        }]
    });

    //  Polymer Complete
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer1-complete',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            width: '80%'
        }, {
            line: 2,
            left: '100px',
            nbLines: 3,
            width: '80%'
        }, {
            line: 5,
            nbLines: 8,
            left: '100px',
            width: '80%'
        }]
    });

    //  Component Template
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-template',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            width: '80%'
        }, {
            line: 2,
            left: '100px',
            nbLines: 5,
            width: '80%'
        }, {
            line: 7,
            nbLines: 3,
            left: '100px',
            width: '80%'
        }]
    });

    //  Component Template Use
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-template-use',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            width: '90%'
        }, {
            line: 2,
            width: '90%'
        }, {
            line: 3,
            nbLines: 4,
            width: '90%'
        }]
    });

    //  Component HTML Element
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-html-element',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            width: '90%'
        }, {
            line: 3,
            left: '100px',
            width: '90%'
        }, {
            line: 4,
            left: '150px',
            width: '90%'
        }, {
            line: 6,
            nbLines: 2,
            left: '150px',
            width: '90%'
        }]
    });

    //  Component Life Cycle
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-life-cycle',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 3,
            left: '100px',
            nbLines: 5,
            width: '90%'
        }, {
            line: 9,
            nbLines: 3,
            left: '100px',
            width: '90%'
        }]
    });

    //  Component Attributes
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-attributes',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 4,
            left: '100px',
            width: '90%'
        }, {
            line: 7,
            nbLines: 4,
            left: '100px',
            width: '90%'
        }]
    });

    //  Component Binding
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-binding',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 2,
            nbLines: 4,
            left: '100px',
            width: '90%'
        }, {
            line: 6,
            nbLines: 6,
            left: '100px',
            width: '90%'
        }]
    });

    //  Component dispatch
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-dispatch',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 5,
            left: '150px',
            width: '90%'
        }, {
            line: 8,
            nbLines: 5,
            left: '100px',
            width: '90%'
        }]
    });

    //  Component Shadow
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'component-shadow',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 2,
            nbLines: 2,
            width: '90%'
        }, {
            line: 5,
            nbLines: 3,
            width: '90%'
        }]
    });

    //  Polymer2 Base
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer2-base',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 0,
            width: '90%'
        }, {
            line: 1,
            left: '100px',
            width: '90%'
        }, {
            line: 4,
            left: '100px',
            width: '90%'
        }, {
            line: 7,
            width: '90%'
        }]
    });

    //  Polymer2 Properties
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer2-properties',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 3,
            left: '100px',
            width: '90%'
        }, {
            line: 4,
            left: '100px',
            nbLines: 3,
            width: '90%'
        }]
    });

    //  Polymer2 Templating
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer2-templating',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            width: '90%'
        }, {
            line: 2,
            left: '100px',
            nbLines: 5,
            width: '90%'
        }]
    });

    //  Polymer2 Binding
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer2-binding',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 3,
            left: '150px',
            nbLines: 3,
            width: '90%'
        }]
    });

    //  Polymer2 Polyfill
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'polymer2-polyfill',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 2,
            width: '90%'
        }, {
            line: 4,
            width: '90%'
        }, {
            line: 7,
            width: '90%'
        }, {
            line: 9,
            width: '90%'
        }]
    });

    //  Migration Content Polymer 1
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'migration-content-polymer1',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 5,
            width: '90%'
        }, {
            line: 3,
            left: '150px',
            width: '40%'
        }]
    });

    //  Migration Content Polymer 2
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'migration-content-polymer2',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 5,
            width: '90%'
        }, {
            line: 3,
            left: '150px',
            width: '40%'
        }]
    });

    //  Bower
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'bower',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 4,
            left: '100px',
            width: '90%'
        }, {
            line: 5,
            left: '100px',
            width: '90%'
        }]
    });

    //  Timer Header
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'timer-header',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 6,
            width: '90%'
        }, {
            line: 7,
            nbLines: 7,
            width: '90%'
        }]
    });

    //  Timer Template
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'timer-template',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 2,
            width: '50%'
        }, {
            line: 6,
            left: '720px',
            width: '330px'
        }, {
            line: 8,
            left: '760px',
            width: '180px'
        }]
    });

    //  Timer Script
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'timer-script',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            width: '100%'
        }, {
            line: 1,
            left: '350px',
            width: '250px'
        }, {
            line: 1,
            left: '650px',
            width: '500px'
        }, {
            line: 2,
            nbLines: 4,
            width: '90%'
        }, {
            line: 8,
            left: '150px',
            width: '40%'
        }, {
            line: 12,
            width: '90%'
        }]
    });
};

},{"../helpers/highlightCodeHelper.js":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RevealEngineEvents = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _highlightEvents = require('./highlightEvents.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RevealEngineEvents = exports.RevealEngineEvents = function () {
    function RevealEngineEvents() {
        _classCallCheck(this, RevealEngineEvents);

        var inIFrame = window.top != window.self;

        // In al case we init the highlight of code.
        this._initHighlightCode();
    }

    _createClass(RevealEngineEvents, [{
        key: '_initHighlightCode',
        value: function _initHighlightCode() {

            new _highlightEvents.HighlightEvents();
        }
    }]);

    return RevealEngineEvents;
}();

},{"./highlightEvents.js":3}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxoZWxwZXJzXFxoaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0c1xccHJlei5qcyIsInNjcmlwdHNcXHByZXpcXGhpZ2hsaWdodEV2ZW50cy5qcyIsInNjcmlwdHNcXHByZXpcXHJldmVhbEVuZ2luZUV2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7O0FBRUEsSUFBTSxVQUFVLE1BQWhCO0FBQ0EsSUFBTSxjQUFjLFFBQXBCO0FBQ0EsSUFBTSxxQkFBcUIsT0FBM0I7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRWEsbUIsV0FBQSxtQjtBQUNULHVDQUdHO0FBQUEsWUFGQyxNQUVELFFBRkMsTUFFRDtBQUFBLFlBREMsYUFDRCxRQURDLGFBQ0Q7O0FBQUE7O0FBQ0MsYUFBSyxXQUFMLEdBQW1CLFNBQVMsY0FBVCxnQkFBcUMsTUFBckMsQ0FBbkI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsYUFBckI7O0FBRUEsZUFBTyxnQkFBUCxXQUFnQyxNQUFoQyxFQUEwQyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQTFDO0FBQ0EsZUFBTyxnQkFBUCxnQkFBcUMsTUFBckMsRUFBK0MsS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixJQUEvQixDQUEvQztBQUNIOzs7OzBDQUVpQixLLEVBQU87QUFDckIsZ0JBQUk7QUFDQSxvQkFBSSxhQUFhLElBQWpCO0FBQ0Esb0JBQUksTUFBTSxJQUFOLEtBQWUsZUFBbkIsRUFBb0M7QUFDaEMsd0JBQU0sUUFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSxpQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBYjtBQUVILGlCQUpELE1BSU87QUFDSCx3QkFBTSxTQUFRLENBQUMsTUFBTSxRQUFOLENBQWUsWUFBZixDQUE0Qixx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OztBQUVWLFlBQUksV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXBDOztBQUVBO0FBQ0EsYUFBSyxrQkFBTDtBQUVIOzs7OzZDQUVvQjs7QUFFakI7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnOTBweCc7XHJcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIGtleUVsdCxcclxuICAgICAgICBwb3NpdGlvbkFycmF5XHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtcclxuICAgIFJldmVhbEVuZ2luZUV2ZW50c1xyXG59IGZyb20gJy4vcHJlei9yZXZlYWxFbmdpbmVFdmVudHMuanMnO1xyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG4gICAgICAgIG5ldyBSZXZlYWxFbmdpbmVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgX21hbmFnZVRpbWVyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9tYW5hZ2VUaW1lcigpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0VGltZXIgPSBmYWxzZTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmluZGV4aCA+IDAgJiYgIXN0YXJ0VGltZXIpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZ2RnLXRpbWVyJykudG9nZ2xlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5pbmRleGggPT09IDAgJiYgc3RhcnRUaW1lcikge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxyXG59IGZyb20gJy4uL2hlbHBlcnMvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XHJcblxyXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xyXG5jb25zdCBDT0xfV0lEVEggPSAzNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLy8gIFBvbHltZXIgRGVjbGFyYXRpb25cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIxLWRlY2xhcmF0aW9uJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIgTGlmZSBDeWNsZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjEtbGlmZS1jeWNsZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgUG9seW1lciBDb21wbGV0ZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjEtY29tcGxldGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDgsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDb21wb25lbnQgVGVtcGxhdGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC10ZW1wbGF0ZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBUZW1wbGF0ZSBVc2VcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC10ZW1wbGF0ZS11c2UnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDb21wb25lbnQgSFRNTCBFbGVtZW50XHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtaHRtbC1lbGVtZW50JyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDb21wb25lbnQgTGlmZSBDeWNsZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LWxpZmUtY3ljbGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDksXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IEF0dHJpYnV0ZXNcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1hdHRyaWJ1dGVzJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IEJpbmRpbmdcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1iaW5kaW5nJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBkaXNwYXRjaFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LWRpc3BhdGNoJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDgsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IFNoYWRvd1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LXNoYWRvdycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgUG9seW1lcjIgQmFzZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjItYmFzZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIFByb3BlcnRpZXNcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLXByb3BlcnRpZXMnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgUG9seW1lcjIgVGVtcGxhdGluZ1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjItdGVtcGxhdGluZycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgUG9seW1lcjIgQmluZGluZ1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjItYmluZGluZycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIFBvbHlmaWxsXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMi1wb2x5ZmlsbCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBNaWdyYXRpb24gQ29udGVudCBQb2x5bWVyIDFcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ21pZ3JhdGlvbi1jb250ZW50LXBvbHltZXIxJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBNaWdyYXRpb24gQ29udGVudCBQb2x5bWVyIDJcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ21pZ3JhdGlvbi1jb250ZW50LXBvbHltZXIyJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBCb3dlclxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnYm93ZXInLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFRpbWVyIEhlYWRlclxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAndGltZXItaGVhZGVyJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA3LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBUaW1lciBUZW1wbGF0ZVxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAndGltZXItdGVtcGxhdGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzcyMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMzMwcHgnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDgsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNzYwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxODBweCdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFRpbWVyIFNjcmlwdFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAndGltZXItc2NyaXB0JyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMzUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcyNTBweCdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc2NTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzUwMHB4J1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0RXZlbnRzXHJcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudHMuanMnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBSZXZlYWxFbmdpbmVFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIGxldCBpbklGcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XHJcblxyXG4gICAgICAgIC8vIEluIGFsIGNhc2Ugd2UgaW5pdCB0aGUgaGlnaGxpZ2h0IG9mIGNvZGUuXHJcbiAgICAgICAgdGhpcy5faW5pdEhpZ2hsaWdodENvZGUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXRIaWdobGlnaHRDb2RlKCkge1xyXG5cclxuICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKCk7XHJcbiAgICB9XHJcbn0iXX0=
