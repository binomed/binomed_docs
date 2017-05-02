(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_TOP = 90;
var LINE_HEIGHT = 1.15;
var ADDITIONNAL_HEIGHT = 0.4;
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
                var index = 0;
                var properties = null;
                if (event.type === 'fragmentshown') {
                    index = +event.fragment.getAttribute('data-fragment-index');
                    properties = this.positionArray[index];
                } else {
                    index = +event.fragment.getAttribute('data-fragment-index');
                    // On reset les properties
                    if (index > 0) {
                        properties = this.positionArray[index - 1];
                    }
                }
                var keys = Object.keys(properties);
                var area = {};
                var position = {};
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    switch (true) {
                        case key === 'line':
                        case key === 'nbLine':
                        case key === 'col':
                        case key === 'nbCol':
                            position[key] = properties[key];
                            break;
                        case key === 'height':
                        case key === 'width':
                        case key === 'top':
                        case key === 'left':
                            area[key] = properties[key];
                            break;
                    }
                    /*if (key === 'row') {
                        position.line = properties[key];
                        //this.eltHiglight.style['top'] = `calc(90px + (${properties[key]} * ${LINE_HEIGHT}em))`;
                    } else if (key === 'col') {
                        position.col = properties[key];
                        //this.eltHiglight.style['left'] = `calc(60px + (${properties[key]} * ${COL_WIDTH}px))`;
                    } else if (key === 'calcHeight') {
                        area.height = properties[key];
                        //this.eltHiglight.style['height'] = `calc(${properties[key]}em + ${ADDITIONNAL_HEIGHT}em)`;
                    } else {
                        //this.eltHiglight.style[key] = properties[key];
                    }*/
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
            } catch (e) {}
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

    //  Test
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'test',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            row: 1,
            width: '90%'
        }, {
            row: 2,
            width: '90%'
        }, {
            row: 3,
            width: '50%'
        }, {
            row: 6,
            width: '60%'
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2hlbHBlcnMvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvcHJlei5qcyIsInNjcmlwdHMvcHJlei9oaWdobGlnaHRFdmVudHMuanMiLCJzY3JpcHRzL3ByZXovcmV2ZWFsRW5naW5lRXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFVBQVUsRUFBaEI7QUFDQSxJQUFNLGNBQWMsSUFBcEI7QUFDQSxJQUFNLHFCQUFxQixHQUEzQjtBQUNBLElBQU0sWUFBWSxFQUFsQjs7SUFFYSxtQixXQUFBLG1CO0FBQ1QsdUNBR0c7QUFBQSxZQUZDLE1BRUQsUUFGQyxNQUVEO0FBQUEsWUFEQyxhQUNELFFBREMsYUFDRDs7QUFBQTs7QUFDQyxhQUFLLFdBQUwsR0FBbUIsU0FBUyxjQUFULGdCQUFxQyxNQUFyQyxDQUFuQjtBQUNBLGFBQUssYUFBTCxHQUFxQixhQUFyQjs7QUFFQSxlQUFPLGdCQUFQLFdBQWdDLE1BQWhDLEVBQTBDLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBMUM7QUFDQSxlQUFPLGdCQUFQLGdCQUFxQyxNQUFyQyxFQUErQyxLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQStCLElBQS9CLENBQS9DO0FBQ0g7Ozs7MENBRWlCLEssRUFBTztBQUNyQixnQkFBSTtBQUNBLG9CQUFJLFFBQVEsQ0FBWjtBQUNBLG9CQUFJLGFBQWEsSUFBakI7QUFDQSxvQkFBSSxNQUFNLElBQU4sS0FBZSxlQUFuQixFQUFvQztBQUNoQyw0QkFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQVQ7QUFDQSxpQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBYjtBQUVILGlCQUpELE1BSU87QUFDSCw0QkFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FB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c0M7QUFDekMsNkJBQWEsS0FBYjtBQUNIO0FBSUosU0FYRDtBQVlIOztBQUVELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQTVCRDs7O0FDTkE7Ozs7Ozs7QUFFQTs7OztBQUlBLElBQU0sY0FBYyxJQUFwQjtBQUNBLElBQU0sb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLGUsV0FBQSxlLEdBQ1QsMkJBQWM7QUFBQTs7QUFDVjtBQUNBLGlEQUF3QjtBQUNwQixnQkFBUSxNQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGlCQUFLLENBRE87QUFFWixtQkFBTztBQUZLLFNBQUQsRUFHWjtBQUNDLGlCQUFLLENBRE47QUFFQyxtQkFBTztBQUZSLFNBSFksRUFNWjtBQUNDLGlCQUFLLENBRE47QUFFQyxtQkFBTztBQUZSLFNBTlksRUFTWjtBQUNDLGlCQUFLLENBRE47QUFFQyxtQkFBTztBQUZSLFNBVFk7QUFISyxLQUF4QjtBQWtCSCxDOzs7QUMvQkw7Ozs7Ozs7OztBQUNBOzs7O0lBS2Esa0IsV0FBQSxrQjtBQUNULGtDQUFjO0FBQUE7O0FBRVYsWUFBSSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBcEM7O0FBRUE7QUFDQSxhQUFLLGtCQUFMO0FBRUg7Ozs7NkNBRW9COztBQUVqQjtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gOTA7XG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAwLjQ7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29sJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qaWYgKGtleSA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ubGluZSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWyd0b3AnXSA9IGBjYWxjKDkwcHggKyAoJHtwcm9wZXJ0aWVzW2tleV19ICogJHtMSU5FX0hFSUdIVH1lbSkpYDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2NvbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29sID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ2xlZnQnXSA9IGBjYWxjKDYwcHggKyAoJHtwcm9wZXJ0aWVzW2tleV19ICogJHtDT0xfV0lEVEh9cHgpKWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdjYWxjSGVpZ2h0Jykge1xuICAgICAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWydoZWlnaHQnXSA9IGBjYWxjKCR7cHJvcGVydGllc1trZXldfWVtICsgJHtBRERJVElPTk5BTF9IRUlHSFR9ZW0pYDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZWx0SGlnbGlnaHQuc3R5bGVba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1xuICAgIFJldmVhbEVuZ2luZUV2ZW50c1xufSBmcm9tICcuL3ByZXovcmV2ZWFsRW5naW5lRXZlbnRzLmpzJztcblxuXG4oZnVuY3Rpb24gKCkge1xuXG5cbiAgICBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcbiAgICAgICAgbmV3IFJldmVhbEVuZ2luZUV2ZW50cygpO1xuXG4gICAgICAgIF9tYW5hZ2VUaW1lcigpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX21hbmFnZVRpbWVyKCkge1xuXG4gICAgICAgIGxldCBzdGFydFRpbWVyID0gZmFsc2U7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICAgICAgICAgIGlmIChldmVudC5pbmRleGggPiAwICYmICFzdGFydFRpbWVyKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZ2RnLXRpbWVyJykudG9nZ2xlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaW5kZXhoID09PSAwICYmIHN0YXJ0VGltZXIpIHtcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgVGVzdFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0ZXN0JyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHJvdzogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICByb3c6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgcm93OiAzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNTAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHJvdzogNixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRFdmVudHNcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudHMuanMnO1xuXG5cbmV4cG9ydCBjbGFzcyBSZXZlYWxFbmdpbmVFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGxldCBpbklGcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgLy8gSW4gYWwgY2FzZSB3ZSBpbml0IHRoZSBoaWdobGlnaHQgb2YgY29kZS5cbiAgICAgICAgdGhpcy5faW5pdEhpZ2hsaWdodENvZGUoKTtcblxuICAgIH1cblxuICAgIF9pbml0SGlnaGxpZ2h0Q29kZSgpIHtcblxuICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKCk7XG4gICAgfVxufSJdfQ==
