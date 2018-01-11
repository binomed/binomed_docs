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
            this._progressFragment({ type: "init", fragment: document.querySelector('div.fragment.visible') });
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

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MyoHelper = exports.MyoHelper = function () {
	function MyoHelper() {
		var _this = this;

		_classCallCheck(this, MyoHelper);

		this.timerLock = null;
		this.innerLock = true;
		this.timeFist = 0;
		this.intervalWaveIn = null;
		this.lockingPolicyApply = false;

		if (Myo) {
			Myo.connect('jef.polymer.prez');

			Myo.on('status', function (data) {
				console.log('MyoStatus', data);
				if (data.type === 'connected' && !_this.lockingPolicyApply) {
					_this.lockingPolicyApply = true;
					Myo.setLockingPolicy("none");
				}
			});

			//Whenever we get a pose event, we'll update the image sources with the active version of the image
			Myo.on('pose', function (pose) {
				console.log('Pose', pose);
				switch (pose) {
					case 'double_tap':
						if (!_this.innerLock) {
							_this._emulateKey('next');
							clearTimeout(_this.timerLock);
							_this.timerLock = setTimeout(_this._timeoutFunction.bind(_this), 5000);
						}
						break;
					case 'wave_in':
						if (!_this.innerLock) {
							_this.intervalWaveIn = setInterval(_this._intervalBackWard.bind(_this, 1000));
						}
						break;
					case 'fist':
						_this.timeFist = Date.now();
				}
			});

			Myo.on('pose_off', function (pose) {
				console.log('pose_off', pose);
				console.log('timeFist', _this.timeFist, Date.now() - _this.timeFist);
				console.log(_this.innerLock);
				if (pose === 'fist' && Date.now() - _this.timeFist > 1000 && _this.innerLock) {
					_this.innerLock = false;
					console.log('unlock');
					Myo.myos[0].vibrate();
					Myo.myos[0].unlock();
					_this.timerLock = setTimeout(_this._timeoutFunction.bind(_this), 5000);
				} else if (pose === 'wave_in') {
					clearInterval(_this.intervalWaveIn);
				}
			});

			//Whenever a myo locks we'll switch the main image to a lock image
			Myo.on('locked', function () {
				console.log('locked');
			});

			//Whenever a myo unlocks we'll switch the main image to a unlock image
			Myo.on('unlocked', function () {
				console.log('unlocked');
			});
		}
	}

	_createClass(MyoHelper, [{
		key: '_timeoutFunction',
		value: function _timeoutFunction() {
			this.innerLock = true;
			console.log('lock');
			Myo.myos[0].lock();
			Myo.myos[0].vibrate();
		}
	}, {
		key: '_intervalBackWard',
		value: function _intervalBackWard() {
			this._emulateKey('left');
			clearTimeout(this.timerLock);
			this.timerLock = setTimeout(this._timeoutFunction.bind(this), 5000);
		}
	}, {
		key: '_emulateKey',
		value: function _emulateKey(key) {
			var event = new Event('keydown', { bubbles: true,
				cancelable: false
			});
			switch (key) {
				case 'prev':
					event.keyCode = 33; //page up
					event.which = 33;
					break;
				case 'next':
					event.keyCode = 34; // page down
					event.which = 34;
					break;
				case 'right':
					event.keyCode = 39; // right
					event.which = 39;
					break;
				case 'left':
					event.keyCode = 37; //left
					event.which = 37;
					break;
			}

			document.dispatchEvent(event);
		}
	}]);

	return MyoHelper;
}();

},{}],3:[function(require,module,exports){
'use strict';

var _revealEngineEvents = require('./prez/revealEngineEvents.js');

var _myoHelper = require('./helpers/myoHelper.js');

(function () {

    function pageLoad() {
        new _revealEngineEvents.RevealEngineEvents();
        new _myoHelper.MyoHelper();

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

},{"./helpers/myoHelper.js":2,"./prez/revealEngineEvents.js":5}],4:[function(require,module,exports){
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

},{"../helpers/highlightCodeHelper.js":1}],5:[function(require,module,exports){
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

},{"./highlightEvents.js":4}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxoZWxwZXJzXFxoaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0c1xcaGVscGVyc1xcbXlvSGVscGVyLmpzIiwic2NyaXB0c1xccHJlei5qcyIsInNjcmlwdHNcXHByZXpcXGhpZ2hsaWdodEV2ZW50cy5qcyIsInNjcmlwdHNcXHByZXpcXHJldmVhbEVuZ2luZUV2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7O0FBRUEsSUFBTSxVQUFVLE1BQWhCO0FBQ0EsSUFBTSxjQUFjLFFBQXBCO0FBQ0EsSUFBTSxxQkFBcUIsT0FBM0I7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRWEsbUIsV0FBQSxtQjtBQUNULHVDQUdHO0FBQUEsWUFGQyxNQUVELFFBRkMsTUFFRDtBQUFBLFlBREMsYUFDRCxRQURDLGFBQ0Q7O0FBQUE7O0FBQ0MsYUFBSyxXQUFMLEdBQW1CLFNBQVMsY0FBVCxnQkFBcUMsTUFBckMsQ0FBbkI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsYUFBckI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsQ0FBakI7O0FBRUEsZUFBTyxnQkFBUCxXQUFnQyxNQUFoQyxFQUEwQyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQTFDO0FBQ0EsZUFBTyxnQkFBUCxnQkFBcUMsTUFBckMsRUFBK0MsS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixJQUEvQixDQUEvQztBQUNIOzs7OzBDQUVpQixLLEVBQU87QUFDckIsZ0JBQUk7QUFDQSxvQkFBSSxhQUFhLElBQWpCO0FBQ0Esb0JBQUksTUFBTSxJQUFOLEtBQWUsTUFBbkIsRUFBMkI7QUFDdkIsd0JBQUksS0FBSyxTQUFMLElBQWtCLENBQXRCLEVBQXdCO0FBQ3BCLHFDQUFhLEtBQUssYUFBTCxDQUFtQixLQUFLLFNBQXhCLENBQWI7QUFDSDtBQUNKLGlCQUpELE1B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S0FBeEI7QUE0QkgsQzs7O0FDNVpMOzs7Ozs7Ozs7QUFDQTs7OztJQUthLGtCLFdBQUEsa0I7QUFDVCxrQ0FBYztBQUFBOztBQUVWLFlBQUksV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXBDOztBQUVBO0FBQ0EsYUFBSyxrQkFBTDtBQUVIOzs7OzZDQUVvQjs7QUFFakI7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnOTBweCc7XHJcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIGtleUVsdCxcclxuICAgICAgICBwb3NpdGlvbkFycmF5XHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcclxuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7dHlwZTpcImluaXRcIiwgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJyl9KTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcclxuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiZXhwb3J0IGNsYXNzIE15b0hlbHBlcntcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cclxuXHRcdHRoaXMudGltZXJMb2NrID0gbnVsbDtcclxuXHRcdHRoaXMuaW5uZXJMb2NrID0gdHJ1ZTtcclxuXHRcdHRoaXMudGltZUZpc3QgPSAwO1xyXG5cdFx0dGhpcy5pbnRlcnZhbFdhdmVJbiA9IG51bGw7XHJcblx0XHR0aGlzLmxvY2tpbmdQb2xpY3lBcHBseSA9IGZhbHNlO1xyXG5cclxuXHRcdGlmKE15byl7XHJcblx0XHRcdE15by5jb25uZWN0KCdqZWYucG9seW1lci5wcmV6Jyk7XHJcblxyXG5cclxuXHRcdFx0TXlvLm9uKCdzdGF0dXMnLCAoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdNeW9TdGF0dXMnLCBkYXRhKTtcclxuXHRcdFx0XHRpZiAoZGF0YS50eXBlID09PSAnY29ubmVjdGVkJyAmJiAhdGhpcy5sb2NraW5nUG9saWN5QXBwbHkpe1xyXG5cdFx0XHRcdFx0dGhpcy5sb2NraW5nUG9saWN5QXBwbHkgPSB0cnVlO1xyXG5cdFx0XHRcdFx0TXlvLnNldExvY2tpbmdQb2xpY3koXCJub25lXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvL1doZW5ldmVyIHdlIGdldCBhIHBvc2UgZXZlbnQsIHdlJ2xsIHVwZGF0ZSB0aGUgaW1hZ2Ugc291cmNlcyB3aXRoIHRoZSBhY3RpdmUgdmVyc2lvbiBvZiB0aGUgaW1hZ2VcclxuXHRcdFx0TXlvLm9uKCdwb3NlJywgKHBvc2UpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnUG9zZScsIHBvc2UpO1xyXG5cdFx0XHRcdHN3aXRjaChwb3NlKXtcclxuXHRcdFx0XHRcdGNhc2UgJ2RvdWJsZV90YXAnOlxyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuaW5uZXJMb2NrKXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLl9lbXVsYXRlS2V5KCduZXh0Jyk7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJMb2NrKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbWVyTG9jayA9IHNldFRpbWVvdXQodGhpcy5fdGltZW91dEZ1bmN0aW9uLmJpbmQodGhpcyksNTAwMCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd3YXZlX2luJzpcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlubmVyTG9jayl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pbnRlcnZhbFdhdmVJbiA9IHNldEludGVydmFsKHRoaXMuX2ludGVydmFsQmFja1dhcmQuYmluZCh0aGlzLCAxMDAwKSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdmaXN0JzpcclxuXHRcdFx0XHRcdFx0dGhpcy50aW1lRmlzdCA9IERhdGUubm93KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdE15by5vbigncG9zZV9vZmYnLCAocG9zZSkgPT57XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ3Bvc2Vfb2ZmJywgcG9zZSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ3RpbWVGaXN0JywgdGhpcy50aW1lRmlzdCwgRGF0ZS5ub3coKSAtIHRoaXMudGltZUZpc3QpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuaW5uZXJMb2NrKTtcclxuXHRcdFx0XHRpZiAocG9zZSA9PT0gJ2Zpc3QnXHJcblx0XHRcdFx0XHQmJiBEYXRlLm5vdygpIC0gdGhpcy50aW1lRmlzdCA+IDEwMDBcclxuXHRcdFx0XHRcdCYmIHRoaXMuaW5uZXJMb2NrKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5pbm5lckxvY2sgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3VubG9jaycpO1xyXG5cdFx0XHRcdFx0XHRNeW8ubXlvc1swXS52aWJyYXRlKCk7XHJcblx0XHRcdFx0XHRcdE15by5teW9zWzBdLnVubG9jaygpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnRpbWVyTG9jayA9IHNldFRpbWVvdXQodGhpcy5fdGltZW91dEZ1bmN0aW9uLmJpbmQodGhpcyksNTAwMCk7XHJcblx0XHRcdFx0fWVsc2UgaWYgKHBvc2UgPT09ICd3YXZlX2luJyl7XHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxXYXZlSW4pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHQvL1doZW5ldmVyIGEgbXlvIGxvY2tzIHdlJ2xsIHN3aXRjaCB0aGUgbWFpbiBpbWFnZSB0byBhIGxvY2sgaW1hZ2VcclxuXHRcdFx0TXlvLm9uKCdsb2NrZWQnLCAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2xvY2tlZCcpXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly9XaGVuZXZlciBhIG15byB1bmxvY2tzIHdlJ2xsIHN3aXRjaCB0aGUgbWFpbiBpbWFnZSB0byBhIHVubG9jayBpbWFnZVxyXG5cdFx0XHRNeW8ub24oJ3VubG9ja2VkJywgKCkgPT57XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ3VubG9ja2VkJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3RpbWVvdXRGdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5pbm5lckxvY2sgPSB0cnVlO1xyXG5cdFx0Y29uc29sZS5sb2coJ2xvY2snKTtcclxuXHRcdE15by5teW9zWzBdLmxvY2soKTtcclxuXHRcdE15by5teW9zWzBdLnZpYnJhdGUoKTtcclxuXHR9XHJcblxyXG5cdF9pbnRlcnZhbEJhY2tXYXJkKCl7XHJcblx0XHR0aGlzLl9lbXVsYXRlS2V5KCdsZWZ0Jyk7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lckxvY2spO1xyXG5cdFx0dGhpcy50aW1lckxvY2sgPSBzZXRUaW1lb3V0KHRoaXMuX3RpbWVvdXRGdW5jdGlvbi5iaW5kKHRoaXMpLDUwMDApO1xyXG5cdH1cclxuXHJcblx0X2VtdWxhdGVLZXkoa2V5KXtcclxuXHRcdGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdrZXlkb3duJywge2J1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0c3dpdGNoKGtleSl7XHJcblx0XHRcdGNhc2UgJ3ByZXYnOlxyXG5cdFx0XHRcdGV2ZW50LmtleUNvZGUgPSAzMzsgLy9wYWdlIHVwXHJcblx0XHRcdFx0ZXZlbnQud2hpY2ggPSAzMztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbmV4dCc6XHJcblx0XHRcdFx0ZXZlbnQua2V5Q29kZSA9IDM0OyAvLyBwYWdlIGRvd25cclxuXHRcdFx0XHRldmVudC53aGljaCA9IDM0O1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0ZXZlbnQua2V5Q29kZSA9IDM5OyAvLyByaWdodFxyXG5cdFx0XHRcdGV2ZW50LndoaWNoID0gMzk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdGV2ZW50LmtleUNvZGUgPSAzNzsgLy9sZWZ0XHJcblx0XHRcdFx0ZXZlbnQud2hpY2ggPSAzNztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHJcblx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHR9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtcclxuICAgIFJldmVhbEVuZ2luZUV2ZW50c1xyXG59IGZyb20gJy4vcHJlei9yZXZlYWxFbmdpbmVFdmVudHMuanMnO1xyXG5cclxuaW1wb3J0IHtNeW9IZWxwZXJ9IGZyb20gJy4vaGVscGVycy9teW9IZWxwZXIuanMnO1xyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG4gICAgICAgIG5ldyBSZXZlYWxFbmdpbmVFdmVudHMoKTtcclxuICAgICAgICBuZXcgTXlvSGVscGVyKCk7XHJcblxyXG4gICAgICAgIF9tYW5hZ2VUaW1lcigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfbWFuYWdlVGltZXIoKSB7XHJcblxyXG4gICAgICAgIGxldCBzdGFydFRpbWVyID0gZmFsc2U7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5pbmRleGggPiAwICYmICFzdGFydFRpbWVyKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2dkZy10aW1lcicpLnRvZ2dsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaW5kZXhoID09PSAwICYmIHN0YXJ0VGltZXIpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcclxufSBmcm9tICcuLi9oZWxwZXJzL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICBQb2x5bWVyIERlY2xhcmF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMS1kZWNsYXJhdGlvbicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBQb2x5bWVyIExpZmUgQ3ljbGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIxLWxpZmUtY3ljbGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIgQ29tcGxldGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIxLWNvbXBsZXRlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IFRlbXBsYXRlXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtdGVtcGxhdGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDb21wb25lbnQgVGVtcGxhdGUgVXNlXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtdGVtcGxhdGUtdXNlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IEhUTUwgRWxlbWVudFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LWh0bWwtZWxlbWVudCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDYsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IExpZmUgQ3ljbGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1saWZlLWN5Y2xlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBBdHRyaWJ1dGVzXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtYXR0cmlidXRlcycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBCaW5kaW5nXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtYmluZGluZycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDb21wb25lbnQgZGlzcGF0Y2hcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1kaXNwYXRjaCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBTaGFkb3dcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1zaGFkb3cnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIEJhc2VcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLWJhc2UnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBQb2x5bWVyMiBQcm9wZXJ0aWVzXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMi1wcm9wZXJ0aWVzJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIFRlbXBsYXRpbmdcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLXRlbXBsYXRpbmcnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIEJpbmRpbmdcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLWJpbmRpbmcnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBQb2x5bWVyMiBQb2x5ZmlsbFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjItcG9seWZpbGwnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgTWlncmF0aW9uIENvbnRlbnQgUG9seW1lciAxXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdtaWdyYXRpb24tY29udGVudC1wb2x5bWVyMScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgTWlncmF0aW9uIENvbnRlbnQgUG9seW1lciAyXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdtaWdyYXRpb24tY29udGVudC1wb2x5bWVyMicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQm93ZXJcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2Jvd2VyJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBUaW1lciBIZWFkZXJcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RpbWVyLWhlYWRlcicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgVGltZXIgVGVtcGxhdGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RpbWVyLXRlbXBsYXRlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzUwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc3MjBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzMzMHB4J1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzc2MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTgwcHgnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBUaW1lciBTY3JpcHRcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RpbWVyLXNjcmlwdCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzM1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMjUwcHgnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNjUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc1MDBweCdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodEV2ZW50c1xyXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnRzLmpzJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUmV2ZWFsRW5naW5lRXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBsZXQgaW5JRnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xyXG5cclxuICAgICAgICAvLyBJbiBhbCBjYXNlIHdlIGluaXQgdGhlIGhpZ2hsaWdodCBvZiBjb2RlLlxyXG4gICAgICAgIHRoaXMuX2luaXRIaWdobGlnaHRDb2RlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0SGlnaGxpZ2h0Q29kZSgpIHtcclxuXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xyXG4gICAgfVxyXG59Il19
