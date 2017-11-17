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

		if (Myo) {
			Myo.connect('jef.polymer.prez');

			Myo.on('status', function (data) {
				console.log('MyoStatus', data);
				Myo.setLockingPolicy("none");
			});

			//Whenever we get a pose event, we'll update the image sources with the active version of the image
			Myo.on('pose', function (pose) {
				console.log('Pose', pose);
				var timeoutFunction = function timeoutFunction() {
					_this.innerLock = true;
					console.log('lock');
					Myo.myos[0].lock();
					Myo.myos[0].vibrate();
				};
				switch (pose) {
					case 'double_tap':
						if (_this.innerLock) {
							_this.innerLock = false;
							console.log('unlock');
							Myo.myos[0].vibrate();
							Myo.myos[0].unlock();
							_this.timerLock = setTimeout(timeoutFunction, 5000);
						} else {
							_this._emulateKey('next');
							clearTimeout(_this.timerLock);
							_this.timerLock = setTimeout(timeoutFunction, 5000);
						}
						break;
					/*case 'wave_in':
     	if (!this.innerLock){
     		this._emulateKey('left');
     		clearTimeout(this.timerLock);
     		this.timerLock = setTimeout(timeoutFunction,5000);
     	}
     	break;
     case 'wave_out':
     	if (!this.innerLock){
     		this._emulateKey('right');
     		clearTimeout(this.timerLock);
     		this.timerLock = setTimeout(timeoutFunction,5000);
     	}
     	break;*/
					/*case 'fingers_spread':
     	if (!this.innerLock){
     		this._emulateKey('prev');
     		clearTimeout(this.timerLock);
     		this.timerLock = setTimeout(timeoutFunction,5000);
     	}
     	break;*/
					case 'fist':
						clearTimeout(_this.timerLock);
						_this.innerLock = true;
						console.log('lock');
						Myo.myos[0].lock();
						Myo.myos[0].vibrate();
				}
				//$('img.' + pose).attr('src', 'img/' + pose + '_active.png');
				//$('.mainPose img').attr('src', 'img/' + pose + '_active.png');
			});

			//Whenever a myo locks we'll switch the main image to a lock image
			Myo.on('locked', function () {
				console.log('locked');
				//$('.mainPose img').attr('src', 'img/locked.png');
			});

			//Whenever a myo unlocks we'll switch the main image to a unlock image
			Myo.on('unlocked', function () {
				console.log('unlocked');
				//$('.mainPose img').attr('src', 'img/unlocked.png');
			});
		}
	}

	_createClass(MyoHelper, [{
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxoZWxwZXJzXFxoaWdobGlnaHRDb2RlSGVscGVyLmpzIiwic2NyaXB0c1xcaGVscGVyc1xcbXlvSGVscGVyLmpzIiwic2NyaXB0c1xccHJlei5qcyIsInNjcmlwdHNcXHByZXpcXGhpZ2hsaWdodEV2ZW50cy5qcyIsInNjcmlwdHNcXHByZXpcXHJldmVhbEVuZ2luZUV2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7O0FBRUEsSUFBTSxVQUFVLE1BQWhCO0FBQ0EsSUFBTSxjQUFjLFFBQXBCO0FBQ0EsSUFBTSxxQkFBcUIsT0FBM0I7QUFDQSxJQUFNLFlBQVksRUFBbEI7O0lBRWEsbUIsV0FBQSxtQjtBQUNULHVDQUdHO0FBQUEsWUFGQyxNQUVELFFBRkMsTUFFRDtBQUFBLFlBREMsYUFDRCxRQURDLGFBQ0Q7O0FBQUE7O0FBQ0MsYUFBSyxXQUFMLEdBQW1CLFNBQVMsY0FBVCxnQkFBcUMsTUFBckMsQ0FBbkI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsYUFBckI7O0FBRUEsZUFBTyxnQkFBUCxXQUFnQyxNQUFoQyxFQUEwQyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQTFDO0FBQ0EsZUFBTyxnQkFBUCxnQkFBcUMsTUFBckMsRUFBK0MsS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixJQUEvQixDQUEvQztBQUNIOzs7OzBDQUVpQixLLEVBQU87QUFDckIsZ0JBQUk7QUFDQSxvQkFBSSxhQUFhLElBQWpCO0FBQ0Esb0JBQUksTUFBTSxJQUFOLEtBQWUsZUFBbkIsRUFBb0M7QUFDaEMsd0JBQU0sUUFBUSxDQUFDLE1BQU0sUUFBTixDQUFlLFlBQWYsQ0FBNEIscUJBQTVCLENBQWY7QUFDQSxpQ0FBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBYjtBQUVILGlCQUpELE1BSU87QUFDSCx3QkFBTSxTQUFR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QUNULGtDQUFjO0FBQUE7O0FBRVYsWUFBSSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBcEM7O0FBRUE7QUFDQSxhQUFLLGtCQUFMO0FBRUg7Ozs7NkNBRW9COztBQUVqQjtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuY29uc3QgTUlOX1RPUCA9ICc5MHB4JztcclxuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNWVtJztcclxuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7XHJcbiAgICAgICAga2V5RWx0LFxyXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcclxuICAgIH0pIHtcclxuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcclxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsImV4cG9ydCBjbGFzcyBNeW9IZWxwZXJ7XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHJcblx0XHR0aGlzLnRpbWVyTG9jayA9IG51bGw7XHJcblx0XHR0aGlzLmlubmVyTG9jayA9IHRydWU7XHJcblxyXG5cdFx0aWYoTXlvKXtcclxuXHRcdFx0TXlvLmNvbm5lY3QoJ2plZi5wb2x5bWVyLnByZXonKTtcclxuXHJcblxyXG5cdFx0XHRNeW8ub24oJ3N0YXR1cycsIChkYXRhKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ015b1N0YXR1cycsIGRhdGEpO1xyXG5cdFx0XHRcdE15by5zZXRMb2NraW5nUG9saWN5KFwibm9uZVwiKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvL1doZW5ldmVyIHdlIGdldCBhIHBvc2UgZXZlbnQsIHdlJ2xsIHVwZGF0ZSB0aGUgaW1hZ2Ugc291cmNlcyB3aXRoIHRoZSBhY3RpdmUgdmVyc2lvbiBvZiB0aGUgaW1hZ2VcclxuXHRcdFx0TXlvLm9uKCdwb3NlJywgKHBvc2UpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnUG9zZScsIHBvc2UpO1xyXG5cdFx0XHRcdGNvbnN0IHRpbWVvdXRGdW5jdGlvbiA9ICgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuaW5uZXJMb2NrID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdsb2NrJyk7XHJcblx0XHRcdFx0XHRNeW8ubXlvc1swXS5sb2NrKCk7XHJcblx0XHRcdFx0XHRNeW8ubXlvc1swXS52aWJyYXRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHN3aXRjaChwb3NlKXtcclxuXHRcdFx0XHRcdGNhc2UgJ2RvdWJsZV90YXAnOlxyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5pbm5lckxvY2spe1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaW5uZXJMb2NrID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3VubG9jaycpO1xyXG5cdFx0XHRcdFx0XHRcdE15by5teW9zWzBdLnZpYnJhdGUoKTtcclxuXHRcdFx0XHRcdFx0XHRNeW8ubXlvc1swXS51bmxvY2soKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbWVyTG9jayA9IHNldFRpbWVvdXQodGltZW91dEZ1bmN0aW9uLDUwMDApO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLl9lbXVsYXRlS2V5KCduZXh0Jyk7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJMb2NrKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbWVyTG9jayA9IHNldFRpbWVvdXQodGltZW91dEZ1bmN0aW9uLDUwMDApO1xyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdC8qY2FzZSAnd2F2ZV9pbic6XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pbm5lckxvY2spe1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2VtdWxhdGVLZXkoJ2xlZnQnKTtcclxuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy50aW1lckxvY2spO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudGltZXJMb2NrID0gc2V0VGltZW91dCh0aW1lb3V0RnVuY3Rpb24sNTAwMCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd3YXZlX291dCc6XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5pbm5lckxvY2spe1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2VtdWxhdGVLZXkoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMudGltZXJMb2NrKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRpbWVyTG9jayA9IHNldFRpbWVvdXQodGltZW91dEZ1bmN0aW9uLDUwMDApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrOyovXHJcblx0XHRcdFx0XHQvKmNhc2UgJ2ZpbmdlcnNfc3ByZWFkJzpcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlubmVyTG9jayl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5fZW11bGF0ZUtleSgncHJldicpO1xyXG5cdFx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVyTG9jayk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aW1lckxvY2sgPSBzZXRUaW1lb3V0KHRpbWVvdXRGdW5jdGlvbiw1MDAwKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhazsqL1xyXG5cdFx0XHRcdFx0Y2FzZSAnZmlzdCc6XHJcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aGlzLnRpbWVyTG9jayk7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW5uZXJMb2NrID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2xvY2snKTtcclxuXHRcdFx0XHRcdFx0TXlvLm15b3NbMF0ubG9jaygpO1xyXG5cdFx0XHRcdFx0XHRNeW8ubXlvc1swXS52aWJyYXRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vJCgnaW1nLicgKyBwb3NlKS5hdHRyKCdzcmMnLCAnaW1nLycgKyBwb3NlICsgJ19hY3RpdmUucG5nJyk7XHJcblx0XHRcdFx0Ly8kKCcubWFpblBvc2UgaW1nJykuYXR0cignc3JjJywgJ2ltZy8nICsgcG9zZSArICdfYWN0aXZlLnBuZycpO1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0Ly9XaGVuZXZlciBhIG15byBsb2NrcyB3ZSdsbCBzd2l0Y2ggdGhlIG1haW4gaW1hZ2UgdG8gYSBsb2NrIGltYWdlXHJcblx0XHRcdE15by5vbignbG9ja2VkJywgKCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdsb2NrZWQnKVxyXG5cdFx0XHRcdC8vJCgnLm1haW5Qb3NlIGltZycpLmF0dHIoJ3NyYycsICdpbWcvbG9ja2VkLnBuZycpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vV2hlbmV2ZXIgYSBteW8gdW5sb2NrcyB3ZSdsbCBzd2l0Y2ggdGhlIG1haW4gaW1hZ2UgdG8gYSB1bmxvY2sgaW1hZ2VcclxuXHRcdFx0TXlvLm9uKCd1bmxvY2tlZCcsICgpID0+e1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCd1bmxvY2tlZCcpO1xyXG5cdFx0XHRcdC8vJCgnLm1haW5Qb3NlIGltZycpLmF0dHIoJ3NyYycsICdpbWcvdW5sb2NrZWQucG5nJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X2VtdWxhdGVLZXkoa2V5KXtcclxuXHRcdGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdrZXlkb3duJywge2J1YmJsZXM6IHRydWUsXHJcblx0XHRcdGNhbmNlbGFibGU6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0c3dpdGNoKGtleSl7XHJcblx0XHRcdGNhc2UgJ3ByZXYnOlxyXG5cdFx0XHRcdGV2ZW50LmtleUNvZGUgPSAzMzsgLy9wYWdlIHVwXHJcblx0XHRcdFx0ZXZlbnQud2hpY2ggPSAzMztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbmV4dCc6XHJcblx0XHRcdFx0ZXZlbnQua2V5Q29kZSA9IDM0OyAvLyBwYWdlIGRvd25cclxuXHRcdFx0XHRldmVudC53aGljaCA9IDM0O1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0ZXZlbnQua2V5Q29kZSA9IDM5OyAvLyByaWdodFxyXG5cdFx0XHRcdGV2ZW50LndoaWNoID0gMzk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdGV2ZW50LmtleUNvZGUgPSAzNzsgLy9sZWZ0XHJcblx0XHRcdFx0ZXZlbnQud2hpY2ggPSAzNztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHJcblx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHR9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtcclxuICAgIFJldmVhbEVuZ2luZUV2ZW50c1xyXG59IGZyb20gJy4vcHJlei9yZXZlYWxFbmdpbmVFdmVudHMuanMnO1xyXG5cclxuaW1wb3J0IHtNeW9IZWxwZXJ9IGZyb20gJy4vaGVscGVycy9teW9IZWxwZXIuanMnO1xyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG4gICAgICAgIG5ldyBSZXZlYWxFbmdpbmVFdmVudHMoKTtcclxuICAgICAgICBuZXcgTXlvSGVscGVyKCk7XHJcblxyXG4gICAgICAgIF9tYW5hZ2VUaW1lcigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfbWFuYWdlVGltZXIoKSB7XHJcblxyXG4gICAgICAgIGxldCBzdGFydFRpbWVyID0gZmFsc2U7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5pbmRleGggPiAwICYmICFzdGFydFRpbWVyKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2dkZy10aW1lcicpLnRvZ2dsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaW5kZXhoID09PSAwICYmIHN0YXJ0VGltZXIpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcclxufSBmcm9tICcuLi9oZWxwZXJzL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xyXG5cclxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xyXG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcclxuY29uc3QgQ09MX1dJRFRIID0gMzU7XHJcblxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICBQb2x5bWVyIERlY2xhcmF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMS1kZWNsYXJhdGlvbicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDExLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBQb2x5bWVyIExpZmUgQ3ljbGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIxLWxpZmUtY3ljbGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIgQ29tcGxldGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIxLWNvbXBsZXRlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IFRlbXBsYXRlXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtdGVtcGxhdGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnODAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDb21wb25lbnQgVGVtcGxhdGUgVXNlXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtdGVtcGxhdGUtdXNlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IEhUTUwgRWxlbWVudFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY29tcG9uZW50LWh0bWwtZWxlbWVudCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDYsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAyLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQ29tcG9uZW50IExpZmUgQ3ljbGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1saWZlLWN5Y2xlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA5LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBBdHRyaWJ1dGVzXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtYXR0cmlidXRlcycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBCaW5kaW5nXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjb21wb25lbnQtYmluZGluZycsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDYsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBDb21wb25lbnQgZGlzcGF0Y2hcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1kaXNwYXRjaCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENvbXBvbmVudCBTaGFkb3dcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbXBvbmVudC1zaGFkb3cnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIEJhc2VcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLWJhc2UnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBQb2x5bWVyMiBQcm9wZXJ0aWVzXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdwb2x5bWVyMi1wcm9wZXJ0aWVzJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIFRlbXBsYXRpbmdcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLXRlbXBsYXRpbmcnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAyLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIFBvbHltZXIyIEJpbmRpbmdcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3BvbHltZXIyLWJpbmRpbmcnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXHJcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiAzLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBQb2x5bWVyMiBQb2x5ZmlsbFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncG9seW1lcjItcG9seWZpbGwnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgTWlncmF0aW9uIENvbnRlbnQgUG9seW1lciAxXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdtaWdyYXRpb24tY29udGVudC1wb2x5bWVyMScsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgTWlncmF0aW9uIENvbnRlbnQgUG9seW1lciAyXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdtaWdyYXRpb24tY29udGVudC1wb2x5bWVyMicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzE1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgQm93ZXJcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ2Jvd2VyJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDUsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTAwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc5MCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBUaW1lciBIZWFkZXJcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RpbWVyLWhlYWRlcicsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA3LFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnOTAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgVGltZXIgVGVtcGxhdGVcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RpbWVyLXRlbXBsYXRlJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIGxpbmU6IDIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzUwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc3MjBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzMzMHB4J1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiA4LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzc2MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTgwcHgnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICBUaW1lciBTY3JpcHRcclxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XHJcbiAgICAgICAgICAgIGtleUVsdDogJ3RpbWVyLXNjcmlwdCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzM1MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMjUwcHgnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnNjUwcHgnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc1MDBweCdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMixcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxNTBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogMTIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzkwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodEV2ZW50c1xyXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnRzLmpzJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUmV2ZWFsRW5naW5lRXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBsZXQgaW5JRnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xyXG5cclxuICAgICAgICAvLyBJbiBhbCBjYXNlIHdlIGluaXQgdGhlIGhpZ2hsaWdodCBvZiBjb2RlLlxyXG4gICAgICAgIHRoaXMuX2luaXRIaWdobGlnaHRDb2RlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0SGlnaGxpZ2h0Q29kZSgpIHtcclxuXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xyXG4gICAgfVxyXG59Il19
