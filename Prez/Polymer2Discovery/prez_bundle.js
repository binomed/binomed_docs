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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2hlbHBlcnMvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvcHJlei5qcyIsInNjcmlwdHMvcHJlei9oaWdobGlnaHRFdmVudHMuanMiLCJzY3JpcHRzL3ByZXovcmV2ZWFsRW5naW5lRXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFVBQVUsTUFBaEI7QUFDQSxJQUFNLGNBQWMsUUFBcEI7QUFDQSxJQUFNLHFCQUFxQixPQUEzQjtBQUNBLElBQU0sWUFBWSxFQUFsQjs7SUFFYSxtQixXQUFBLG1CO0FBQ1QsdUNBR0c7QUFBQSxZQUZDLE1BRUQsUUFGQyxNQUVEO0FBQUEsWUFEQyxhQUNELFFBREMsYUFDRDs7QUFBQTs7QUFDQyxhQUFLLFdBQUwsR0FBbUIsU0FBUyxjQUFULGdCQUFxQyxNQUFyQyxDQUFuQjtBQUNBLGFBQUssYUFBTCxHQUFxQixhQUFyQjs7QUFFQSxlQUFPLGdCQUFQLFdBQWdDLE1BQWhDLEVBQTBDLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBMUM7QUFDQSxlQUFPLGdCQUFQLGdCQUFxQyxNQUFyQyxFQUErQyxLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQStCLElBQS9CLENBQS9DO0FBQ0g7Ozs7MENBRWlCLEssRUFBTztBQUNyQixnQkFBSTtBQUNBLG9CQUFJLGFBQWEsSUFBakI7QUFDQSxvQkFBSSxNQUFNLElBQU4sS0FBZSxlQUFuQixFQUFvQztBQUNoQyx3QkFBTSxRQUFRLENBQUMsTUFBTSxRQUFOLENBQWUsWUFBZixDQUE0QixxQkFBNUIsQ0FBZjtBQUNBLGlDQUFhLEtBQUssYUFBTCxDQUFtQixLQUFuQixDQUFiO0FBRUgsaUJBSkQsTUFJTztBQUNILHdCQUFNLFNBQVEsQ0FBQyxNQUFNLFFBQU4sQ0FBZSxZQUFmLENBQTRCLHFCQUE1QixD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WUFBSSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBcEM7O0FBRUE7QUFDQSxhQUFLLGtCQUFMO0FBRUg7Ozs7NkNBRW9COztBQUVqQjtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzkwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNWVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1xuICAgIFJldmVhbEVuZ2luZUV2ZW50c1xufSBmcm9tICcuL3ByZXovcmV2ZWFsRW5naW5lRXZlbnRzLmpzJztcblxuXG4oZnVuY3Rpb24gKCkge1xuXG5cbiAgICBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcbiAgICAgICAgbmV3IFJldmVhbEVuZ2luZUV2ZW50cygpO1xuXG4gICAgICAgIF9tYW5hZ2VUaW1lcigpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX21hbmFnZVRpbWVyKCkge1xuXG4gICAgICAgIGxldCBzdGFydFRpbWVyID0gZmFsc2U7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICAgICAgICAgIGlmIChldmVudC5pbmRleGggPiAwICYmICFzdGFydFRpbWVyKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZ2RnLXRpbWVyJykudG9nZ2xlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaW5kZXhoID09PSAwICYmIHN0YXJ0VGltZXIpIHtcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgUG9seW1lciBEZWNsYXJhdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMS1kZWNsYXJhdGlvbicsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDksXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgUG9seW1lciBMaWZlIEN5Y2xlXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIxLWxpZmUtY3ljbGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNixcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDcsXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBQb2x5bWVyIENvbXBsZXRlXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIxLWNvbXBsZXRlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgQ29tcG9uZW50IFRlbXBsYXRlXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC10ZW1wbGF0ZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDcsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIENvbXBvbmVudCBUZW1wbGF0ZSBVc2VcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LXRlbXBsYXRlLXVzZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIENvbXBvbmVudCBIVE1MIEVsZW1lbnRcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LWh0bWwtZWxlbWVudCcsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNixcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgQ29tcG9uZW50IExpZmUgQ3ljbGVcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LWxpZmUtY3ljbGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgQ29tcG9uZW50IEF0dHJpYnV0ZXNcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LWF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDcsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIENvbXBvbmVudCBCaW5kaW5nXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1iaW5kaW5nJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDYsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIENvbXBvbmVudCBkaXNwYXRjaFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtZGlzcGF0Y2gnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDgsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIENvbXBvbmVudCBTaGFkb3dcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LXNoYWRvdycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIFBvbHltZXIyIEJhc2VcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjItYmFzZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBQb2x5bWVyMiBQcm9wZXJ0aWVzXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLXByb3BlcnRpZXMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgUG9seW1lcjIgVGVtcGxhdGluZ1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMi10ZW1wbGF0aW5nJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgUG9seW1lcjIgQmluZGluZ1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMi1iaW5kaW5nJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDMsXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIFBvbHltZXIyIFBvbHlmaWxsXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLXBvbHlmaWxsJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDksXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgTWlncmF0aW9uIENvbnRlbnQgUG9seW1lciAxXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ21pZ3JhdGlvbi1jb250ZW50LXBvbHltZXIxJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgTWlncmF0aW9uIENvbnRlbnQgUG9seW1lciAyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ21pZ3JhdGlvbi1jb250ZW50LXBvbHltZXIyJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgQm93ZXJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnYm93ZXInLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBUaW1lciBIZWFkZXJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndGltZXItaGVhZGVyJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgVGltZXIgVGVtcGxhdGVcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndGltZXItdGVtcGxhdGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzUwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA2LFxuICAgICAgICAgICAgICAgIGxlZnQ6ICc3MjBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICczMzBweCdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIGxlZnQ6ICc3NjBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxODBweCdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBUaW1lciBTY3JpcHRcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAndGltZXItc2NyaXB0JyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbGVmdDogJzM1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzI1MHB4J1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbGVmdDogJzY1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzUwMHB4J1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxpbmU6IDIsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMTIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0cmljdCdcbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnRzLmpzJztcblxuXG5leHBvcnQgY2xhc3MgUmV2ZWFsRW5naW5lRXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBsZXQgaW5JRnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xuXG4gICAgICAgIC8vIEluIGFsIGNhc2Ugd2UgaW5pdCB0aGUgaGlnaGxpZ2h0IG9mIGNvZGUuXG4gICAgICAgIHRoaXMuX2luaXRIaWdobGlnaHRDb2RlKCk7XG5cbiAgICB9XG5cbiAgICBfaW5pdEhpZ2hsaWdodENvZGUoKSB7XG5cbiAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xuICAgIH1cbn0iXX0=
