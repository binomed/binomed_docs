(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
                if (event.type === 'fragmentshown') {
                    var index = +event.fragment.getAttribute('data-fragment-index');
                    var properties = this.positionArray[index];
                    var keys = Object.keys(properties);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (key === 'row') {
                            this.eltHiglight.style['top'] = 'calc(90px + (' + properties[key] + ' * ' + LINE_HEIGHT + 'em))';
                        } else if (key === 'col') {
                            this.eltHiglight.style['left'] = 'calc(60px + (' + properties[key] + ' * ' + COL_WIDTH + 'px))';
                        } else if (key === 'calcHeight') {
                            this.eltHiglight.style['height'] = 'calc(' + properties[key] + 'em + ' + ADDITIONNAL_HEIGHT + 'em)';
                        } else {
                            this.eltHiglight.style[key] = properties[key];
                        }
                    }
                } else {
                    var _index = +event.fragment.getAttribute('data-fragment-index');
                    // On reset les properties
                    var _properties = this.positionArray[_index];
                    var _keys = Object.keys(_properties);
                    for (var _i = 0; _i < _keys.length; _i++) {
                        var _key = _keys[_i];
                        if (_key === 'row') {
                            this.eltHiglight.style['top'] = '';
                        } else if (_key === 'calcHeight') {
                            this.eltHiglight.style['height'] = '';
                        } else if (_key === 'col') {
                            this.eltHiglight.style['left'] = '';
                        } else {
                            this.eltHiglight.style[_key] = '';
                        }
                    }
                    if (_index > 0) {
                        _properties = this.positionArray[_index - 1];
                        _keys = Object.keys(_properties);
                        for (var _i2 = 0; _i2 < _keys.length; _i2++) {
                            var _key2 = _keys[_i2];
                            if (_key2 === 'row') {
                                this.eltHiglight.style['top'] = 'calc(90px + (' + _properties[_key2] + ' * ' + LINE_HEIGHT + 'em))';
                            } else if (_key2 === 'col') {
                                this.eltHiglight.style['left'] = 'calc(60px + (' + _properties[_key2] + ' * ' + COL_WIDTH + 'px))';
                            } else if (_key2 === 'calcHeight') {
                                this.eltHiglight.style['height'] = 'calc(' + _properties[_key2] + 'em + ' + ADDITIONNAL_HEIGHT + 'em)';
                            } else {
                                this.eltHiglight.style[_key2] = _properties[_key2];
                            }
                        }
                    }
                }
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

    //  Bluetooth: Scan + Connect
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'connect-ble',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            row: 1,
            width: '90%'
        }, {
            row: 6,
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2hlbHBlcnMvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvcHJlei5qcyIsInNjcmlwdHMvcHJlei9oaWdobGlnaHRFdmVudHMuanMiLCJzY3JpcHRzL3ByZXovcmV2ZWFsRW5naW5lRXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGNBQWMsSUFBcEI7QUFDQSxJQUFNLHFCQUFxQixHQUEzQjtBQUNBLElBQU0sWUFBWSxFQUFsQjs7SUFFYSxtQixXQUFBLG1CO0FBQ1QsdUNBR0c7QUFBQSxZQUZDLE1BRUQsUUFGQyxNQUVEO0FBQUEsWUFEQyxhQUNELFFBREMsYUFDRDs7QUFBQTs7QUFDQyxhQUFLLFdBQUwsR0FBbUIsU0FBUyxjQUFULGdCQUFxQyxNQUFyQyxDQUFuQjtBQUNBLGFBQUssYUFBTCxHQUFxQixhQUFyQjs7QUFFQSxlQUFPLGdCQUFQLFdBQWdDLE1BQWhDLEVBQTBDLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBMUM7QUFDQSxlQUFPLGdCQUFQLGdCQUFxQyxNQUFyQyxFQUErQyxLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQStCLElBQS9CLENBQS9DO0FBQ0g7Ozs7MENBRWlCLEssRUFBTztBQUNyQixnQkFBSTtBQUNBLG9CQUFJLE1BQU0sSUFBTixLQUFlLGVBQW5CLEVBQW9DO0FBQ2hDLHdCQUFNLFFBQVEsQ0FBQyxNQUFNLFFBQU4sQ0FBZSxZQUFmLENBQTRCLHFCQUE1QixDQUFmO0FBQ0Esd0JBQU0sYUFBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBbkI7QUFDQSx3QkFBTSxPQUFPLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBYjtBQUNBLHlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQztB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Q0FBekM7QUFDQSxtQkFBTyxnQkFBUCxDQUF3QixnQkFBeEIsRUFBMEMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUExQztBQUNIOzs7K0NBRXNCO0FBQ25CLG1CQUFPLG1CQUFQLENBQTJCLGVBQTNCLEVBQTRDLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBNUM7QUFDQSxtQkFBTyxtQkFBUCxDQUEyQixnQkFBM0IsRUFBNkMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUE3QztBQUNIOzs7Ozs7O0FDakZMOztBQUNBOztBQUtBLENBQUMsWUFBWTs7QUFHVCxhQUFTLFFBQVQsR0FBb0I7QUFDaEI7QUFDSDs7QUFHRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0FURDs7O0FDTkE7Ozs7Ozs7QUFFQTs7OztBQUlBLElBQU0sY0FBYyxJQUFwQjtBQUNBLElBQU0sb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTSxZQUFZLEVBQWxCOztJQUVhLGUsV0FBQSxlLEdBQ1QsMkJBQWM7QUFBQTs7QUFDVjtBQUNBLGlEQUF3QjtBQUNwQixnQkFBUSxhQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGlCQUFLLENBRE87QUFFWixtQkFBTztBQUZLLFNBQUQsRUFHWjtBQUNDLGlCQUFLLENBRE47QUFFQyxtQkFBTztBQUZSLFNBSFk7QUFISyxLQUF4QjtBQVlILEM7OztBQ3pCTDs7Ozs7Ozs7O0FBQ0E7Ozs7SUFLYSxrQixXQUFBLGtCO0FBQ1Qsa0NBQWM7QUFBQTs7QUFFVixZQUFJLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUFwQzs7QUFFQTtBQUNBLGFBQUssa0JBQUw7QUFFSDs7Ozs2Q0FFb0I7O0FBRWpCO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBrZXlFbHQsXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcbiAgICB9KSB7XG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAncm93Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVsndG9wJ10gPSBgY2FsYyg5MHB4ICsgKCR7cHJvcGVydGllc1trZXldfSAqICR7TElORV9IRUlHSFR9ZW0pKWA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnY29sJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVsnbGVmdCddID0gYGNhbGMoNjBweCArICgke3Byb3BlcnRpZXNba2V5XX0gKiAke0NPTF9XSURUSH1weCkpYDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdjYWxjSGVpZ2h0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVsnaGVpZ2h0J10gPSBgY2FsYygke3Byb3BlcnRpZXNba2V5XX1lbSArICR7QURESVRJT05OQUxfSEVJR0hUfWVtKWA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdyb3cnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWyd0b3AnXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2NhbGNIZWlnaHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWydoZWlnaHQnXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2NvbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ2xlZnQnXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVtrZXldID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWyd0b3AnXSA9IGBjYWxjKDkwcHggKyAoJHtwcm9wZXJ0aWVzW2tleV19ICogJHtMSU5FX0hFSUdIVH1lbSkpYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnY29sJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ2xlZnQnXSA9IGBjYWxjKDYwcHggKyAoJHtwcm9wZXJ0aWVzW2tleV19ICogJHtDT0xfV0lEVEh9cHgpKWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2NhbGNIZWlnaHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVsnaGVpZ2h0J10gPSBgY2FsYygke3Byb3BlcnRpZXNba2V5XX1lbSArICR7QURESVRJT05OQUxfSEVJR0hUfWVtKWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtcbiAgICBSZXZlYWxFbmdpbmVFdmVudHNcbn0gZnJvbSAnLi9wcmV6L3JldmVhbEVuZ2luZUV2ZW50cy5qcyc7XG5cblxuKGZ1bmN0aW9uICgpIHtcblxuXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG4gICAgICAgIG5ldyBSZXZlYWxFbmdpbmVFdmVudHMoKTtcbiAgICB9XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgQmx1ZXRvb3RoOiBTY2FuICsgQ29ubmVjdFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjb25uZWN0LWJsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICByb3c6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgcm93OiA2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodEV2ZW50c1xufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50cy5qcyc7XG5cblxuZXhwb3J0IGNsYXNzIFJldmVhbEVuZ2luZUV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgbGV0IGluSUZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuICAgICAgICAvLyBJbiBhbCBjYXNlIHdlIGluaXQgdGhlIGhpZ2hsaWdodCBvZiBjb2RlLlxuICAgICAgICB0aGlzLl9pbml0SGlnaGxpZ2h0Q29kZSgpO1xuXG4gICAgfVxuXG4gICAgX2luaXRIaWdobGlnaHRDb2RlKCkge1xuXG4gICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcbiAgICB9XG59Il19
