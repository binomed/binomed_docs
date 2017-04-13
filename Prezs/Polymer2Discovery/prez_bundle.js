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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxoZWxwZXJzXFxoaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0c1xccHJlei5qcyIsInNjcmlwdHNcXHByZXpcXGhpZ2hsaWdodEV2ZW50cy5qcyIsInNjcmlwdHNcXHByZXpcXHJldmVhbEVuZ2luZUV2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7O0FBRUEsSUFBTSxjQUFjLElBQXBCO0FBQ0EsSUFBTSxxQkFBcUIsR0FBM0I7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRWEsbUIsV0FBQSxtQjtBQUNULHVDQUdHO0FBQUEsWUFGQyxNQUVELFFBRkMsTUFFRDtBQUFBLFlBREMsYUFDRCxRQURDLGFBQ0Q7O0FBQUE7O0FBQ0MsYUFBSyxXQUFMLEdBQW1CLFNBQVMsY0FBVCxnQkFBcUMsTUFBckMsQ0FBbkI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsYUFBckI7O0FBRUEsZUFBTyxnQkFBUCxXQUFnQyxNQUFoQyxFQUEwQyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQTFDO0FBQ0EsZUFBTyxnQkFBUCxnQkFBcUMsTUFBckMsRUFBK0MsS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixJQUEvQixDQUEvQztBQUNIOzs7OzBDQUVpQixLLEVBQU87QUFDckIsZ0JBQUk7QUFDQSxvQkFBSSxNQUFNLElBQU4sS0FBZSxlQUFuQixFQUFvQztBQUNoQyx3QkFBTSxRQUFRLENBQUMsTUFBTSxRQUFOLENBQWUsWUFBZixDQUE0QixxQkFBNUIsQ0FBZjtBQUNBLHdCQUFNLGFBQWEsS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQW5CO0FBQ0Esd0JBQU0sT0FBTyxPQUFPLElBQVAsQ0FBWSxVQUFaLENBQWI7QUFDQSx5QkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMs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QUM7QUFDWixpQkFBSyxDQURPO0FBRVosbUJBQU87QUFGSyxTQUFELEVBR1o7QUFDQyxpQkFBSyxDQUROO0FBRUMsbUJBQU87QUFGUixTQUhZO0FBSEssS0FBeEI7QUFZSCxDOzs7QUN6Qkw7Ozs7Ozs7OztBQUNBOzs7O0lBS2Esa0IsV0FBQSxrQjtBQUNULGtDQUFjO0FBQUE7O0FBRVYsWUFBSSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBcEM7O0FBRUE7QUFDQSxhQUFLLGtCQUFMO0FBRUg7Ozs7NkNBRW9COztBQUVqQjtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAwLjQ7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIGtleUVsdCxcclxuICAgICAgICBwb3NpdGlvbkFycmF5XHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdyb3cnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ3RvcCddID0gYGNhbGMoOTBweCArICgke3Byb3BlcnRpZXNba2V5XX0gKiAke0xJTkVfSEVJR0hUfWVtKSlgO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnY29sJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWydsZWZ0J10gPSBgY2FsYyg2MHB4ICsgKCR7cHJvcGVydGllc1trZXldfSAqICR7Q09MX1dJRFRIfXB4KSlgO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnY2FsY0hlaWdodCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVsnaGVpZ2h0J10gPSBgY2FsYygke3Byb3BlcnRpZXNba2V5XX1lbSArICR7QURESVRJT05OQUxfSEVJR0hUfWVtKWA7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcclxuICAgICAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdyb3cnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ3RvcCddID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdjYWxjSGVpZ2h0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWydoZWlnaHQnXSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnY29sJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlWydsZWZ0J10gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnN0eWxlW2tleV0gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3JvdycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ3RvcCddID0gYGNhbGMoOTBweCArICgke3Byb3BlcnRpZXNba2V5XX0gKiAke0xJTkVfSEVJR0hUfWVtKSlgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2NvbCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ2xlZnQnXSA9IGBjYWxjKDYwcHggKyAoJHtwcm9wZXJ0aWVzW2tleV19ICogJHtDT0xfV0lEVEh9cHgpKWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnY2FsY0hlaWdodCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuc3R5bGVbJ2hlaWdodCddID0gYGNhbGMoJHtwcm9wZXJ0aWVzW2tleV19ZW0gKyAke0FERElUSU9OTkFMX0hFSUdIVH1lbSlgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5zdHlsZVtrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge31cclxuICAgIH1cclxuXHJcbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtcclxuICAgIFJldmVhbEVuZ2luZUV2ZW50c1xyXG59IGZyb20gJy4vcHJlei9yZXZlYWxFbmdpbmVFdmVudHMuanMnO1xyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG4gICAgICAgIG5ldyBSZXZlYWxFbmdpbmVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgX21hbmFnZVRpbWVyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9tYW5hZ2VUaW1lcigpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0VGltZXIgPSBmYWxzZTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICAgICAgaWYoZXZlbnQuaW5kZXhoID4gMCAmJiAhc3RhcnRUaW1lcil7XHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2dkZy10aW1lcicpLnRvZ2dsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKGV2ZW50LmluZGV4aCA9PT0gMCAmJiBzdGFydFRpbWVyKXtcclxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcclxufSBmcm9tICcuLi9oZWxwZXJzL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICBCbHVldG9vdGg6IFNjYW4gKyBDb25uZWN0XHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb25uZWN0LWJsZScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICByb3c6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgcm93OiA2LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7XHJcbiAgICBIaWdobGlnaHRFdmVudHNcclxufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50cy5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFJldmVhbEVuZ2luZUV2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgbGV0IGluSUZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcclxuXHJcbiAgICAgICAgLy8gSW4gYWwgY2FzZSB3ZSBpbml0IHRoZSBoaWdobGlnaHQgb2YgY29kZS5cclxuICAgICAgICB0aGlzLl9pbml0SGlnaGxpZ2h0Q29kZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBfaW5pdEhpZ2hsaWdodENvZGUoKSB7XHJcblxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcclxuICAgIH1cclxufSJdfQ==
