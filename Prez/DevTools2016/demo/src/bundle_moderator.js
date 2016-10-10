(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _firebase = require('./firebase/firebase.js');

var _firebaseAuth = require('./firebase/firebaseAuth.js');

var _legoCanvas = require('./canvas/legoCanvas.js');

(function () {

    var gameInit = false,
        // true if we init the legoGrid
    fireBaseLego = null,
        // the reference of the fireBaseApp
    legoCanvas = null,
        // The legoGrid
    currentKey = null,
        // The curent firebase draw key
    currentDraw = null,
        // The curent firebase draw
    readyForNewDraw = true;

    function initGame() {
        legoCanvas = new _legoCanvas.LegoGridCanvas('canvasDraw', false);
        getNextDraw();
    }

    function pageLoad() {

        fireBaseLego = new _firebase.FireBaseLegoApp().app;
        // We init the authentication object 
        var fireBaseAuth = new _firebaseAuth.FireBaseAuth({
            idDivLogin: 'login-msg',
            idNextDiv: 'game',
            idLogout: 'signout'
        });

        // We start to play only when we are logged
        fireBaseAuth.onAuthStateChanged(function (user) {
            if (user) {
                if (!gameInit) {
                    gameInit = true;
                    initGame();
                }
            }
        });

        // When a draw is add on the firebase object, we look at it
        fireBaseLego.database().ref('draw').on('child_added', function (data) {
            if (readyForNewDraw) {
                getNextDraw();
            }
        });

        // When a draw is removed (if an other moderator validate for example) on the firebase object, we look at it
        fireBaseLego.database().ref('draw').on('child_removed', function (data) {
            // We force a new draw because we always show the first draw
            getNextDraw();
        });

        // We refused the current draw
        document.getElementById('btnSubmissionRefused').addEventListener('click', function () {
            /*
                When we refuse an object, we take a snapshot of it to avoid the reconstruction of the canvas.
                 We then allow the author to see its draw.
            */
            var dataUrl = legoCanvas.snapshot();
            currentDraw.dataUrl = dataUrl;
            delete currentDraw.instructions;
            // we move the draw to the reject state
            fireBaseLego.database().ref('draw/' + currentKey).remove();
            fireBaseLego.database().ref('/drawSaved/' + currentDraw.userId).push(currentDraw);
            legoCanvas.resetBoard();
            getNextDraw();
        });

        document.getElementById('btnSubmissionAccepted').addEventListener('click', function () {
            /*
                When we accept a draw we move it to an other branch of the firebase tree.
                 The count down page could be triggered to this change
             */
            fireBaseLego.database().ref('draw/' + currentKey).remove();
            fireBaseLego.database().ref("/drawValidated").push(currentDraw);
            legoCanvas.resetBoard();
            getNextDraw();
        });
    }

    /**
     * Calculate the next draw to show
     */
    function getNextDraw() {
        // Each time, we take a snapshot of draw childs and show it to the moderator
        readyForNewDraw = false;
        fireBaseLego.database().ref('draw').once('value', function (snapshot) {
            if (snapshot && snapshot.val()) {
                currentDraw = snapshot;
                var snapshotFb = snapshot.val();
                var keys = Object.keys(snapshotFb);
                currentKey = keys[0];
                currentDraw = snapshotFb[keys[0]];
                legoCanvas.drawInstructions(snapshotFb[keys[0]]);
                document.getElementById('proposition-text').innerHTML = 'Proposition de ' + currentDraw.user;
            } else {
                readyForNewDraw = true;
                document.getElementById('proposition-text').innerHTML = "En attente de proposition";
            }
        }, function (err) {
            console.error(err);
            // error callback triggered with PERMISSION_DENIED
        });
    }

    window.addEventListener('load', pageLoad);

    /* SERVICE_WORKER_REPLACE
    if ('serviceWorker' in navigator) {        
        navigator.serviceWorker.register('./service-worker-moderator.js', {scope : location.pathname}).then(function(reg) {
            console.log('Service Worker Register for scope : %s',reg.scope);
        });
    }
    SERVICE_WORKER_REPLACE */
})();

},{"./canvas/legoCanvas.js":2,"./firebase/firebase.js":6,"./firebase/firebaseAuth.js":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LegoGridCanvas = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _peg = require('../lego_shape/peg.js');

var _circle = require('../lego_shape/circle.js');

var _const = require('../common/const.js');

var _legoColors = require('../common/legoColors.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 
 * Class for Canvas Grid
 * 
 */
var LegoGridCanvas = exports.LegoGridCanvas = function () {
    function LegoGridCanvas(id, showRow) {
        var _this = this;

        _classCallCheck(this, LegoGridCanvas);

        // Basic canvas
        this.canvasElt = document.getElementById(id);
        // Size of canvas
        this.canvasRect = this.canvasElt.getBoundingClientRect();
        // Indicator for showing the first row with pegs
        this.showRow = showRow;
        this.canvasElt.width = this.canvasRect.width;
        // According to showRow, we will show modify the header Height
        this.headerHeight = this.showRow ? _const.HEADER_HEIGHT : 0;
        this.canvasElt.height = this.canvasRect.width + this.headerHeight;
        // We calculate the cellsize according to the space taken by the canvas
        this.cellSize = Math.round(this.canvasRect.width / _const.NB_CELLS);

        // We initialize the Fabric JS library with our canvas
        this.canvas = new fabric.Canvas(id, { selection: false });
        // Object that represent the pegs on the first row
        this.rowSelect = {};
        // The current draw model (instructions, ...)
        this.brickModel = {},
        // Flag to determine if we have to create a new brick
        this.createNewBrick = false;
        this.currentBrick = null;
        this.lastColor = _const.BASE_LEGO_COLOR;

        // We create the canvas
        this._drawCanvas();

        // If we show the row, we have to plug the move management
        if (showRow) {

            this.canvas.on('object:selected', function (options) {
                return _this.currentBrick = options.target.parentPeg ? options.target : null;
            });
            this.canvas.on('selection:cleared', function (options) {
                return _this.currentBrick = null;
            });

            this.canvas.on('object:moving', function (options) {
                var peg = options.target.parentPeg;

                var newLeft = Math.round(options.target.left / _this.cellSize) * _this.cellSize;
                var newTop = Math.round((options.target.top - _this.headerHeight) / _this.cellSize) * _this.cellSize + _this.headerHeight;
                // We have to calculate the top
                var topCompute = newTop + (peg.size.row === 2 || peg.angle > 0 ? _this.cellSize * 2 : _this.cellSize);
                var leftCompute = newLeft + (peg.size.col === 2 ? _this.cellSize * 2 : _this.cellSize);
                peg.move(newLeft, //left
                newTop // top
                );

                // We specify that we could remove a peg if one of it's edge touch the outside of the canvas
                if (newTop < _const.HEADER_HEIGHT || newLeft < 0 || topCompute >= _this.canvasElt.height || leftCompute >= _this.canvasElt.width) {
                    peg.toRemove = true;
                } else {
                    // Else we check we create a new peg (when a peg enter in the draw area)
                    peg.toRemove = false;
                    if (!peg.replace) {
                        if (peg.size.col === 2) {
                            if (peg.size.row === 2) {
                                _this.canvas.add(_this._createSquare(2).canvasElt);
                            } else if (peg.angle === 0) {
                                _this.canvas.add(_this._createRect(1).canvasElt);
                            } else {
                                _this.canvas.add(_this._createRect(1, 90).canvasElt);
                            }
                        } else {
                            _this.canvas.add(_this._createSquare(1).canvasElt);
                        }
                        peg.replace = true;
                    }
                }
            });

            this.canvas.on('mouse:up', function () {
                if (_this.currentBrick && _this.currentBrick.parentPeg.toRemove && _this.currentBrick.parentPeg.replace) {
                    delete _this.brickModel[_this.currentBrick.parentPeg.id];
                    _this.canvas.remove(_this.currentBrick);
                    _this.currentBrick = null;
                }
            });
        }
    }

    /**
     * Method for changing the color of the first row 
     */


    _createClass(LegoGridCanvas, [{
        key: 'changeColor',
        value: function changeColor(color) {
            this.lastColor = color;
            this.rowSelect.square.changeColor(color);
            this.rowSelect.bigSquare.changeColor(color);
            this.rowSelect.rect.changeColor(color);
            this.rowSelect.vertRect.changeColor(color);
            this.canvas.renderAll();
        }

        /**
         * Serialize the canvas to a minimal object that could be treat after
         */

    }, {
        key: 'export',
        value: function _export(userName, userId) {
            var _this2 = this;

            var resultArray = [];
            // We filter the row pegs
            var keys = Object.keys(this.brickModel).filter(function (key) {
                return key != _this2.rowSelect.square.id && key != _this2.rowSelect.bigSquare.id && key != _this2.rowSelect.rect.id && key != _this2.rowSelect.vertRect.id;
            });
            keys.forEach(function (key) {
                var pegTmp = _this2.brickModel[key];
                resultArray.push({
                    size: pegTmp.size,
                    color: pegTmp.color,
                    angle: pegTmp.angle,
                    top: pegTmp.top - _this2.headerHeight,
                    left: pegTmp.left,
                    cellSize: _this2.cellSize
                });
            });
            return {
                user: userName,
                userId: userId,
                instructions: resultArray
            };
        }

        /**
         * Draw from intructions a draw
         */

    }, {
        key: 'drawInstructions',
        value: function drawInstructions(instructionObject) {
            var _this3 = this;

            this.resetBoard();
            this.canvas.renderOnAddRemove = false;
            instructionObject.instructions.forEach(function (instruction) {
                _this3.canvas.add(_this3._createBrick({ size: instruction.size,
                    left: instruction.left / instruction.cellSize * _this3.cellSize,
                    top: instruction.top / instruction.cellSize * _this3.cellSize,
                    angle: instruction.angle,
                    color: instruction.color
                }).canvasElt);
            });

            this.canvas.renderAll();
            this.canvas.renderOnAddRemove = true;
        }

        /**
         * Clean the board and the state of the canvas
         */

    }, {
        key: 'resetBoard',
        value: function resetBoard() {
            this.brickModel = {};
            this.canvas.clear();
            this._drawCanvas();
        }

        /** 
         * Generate a Base64 image from the canvas
         */

    }, {
        key: 'snapshot',
        value: function snapshot() {
            return this.canvas.toDataURL();
        }

        /**
         * 
         * Privates Methods
         * 
         */

        /**
         * Draw the basic grid 
        */

    }, {
        key: '_drawGrid',
        value: function _drawGrid(size) {
            if (this.showRow) {
                this.canvas.add(this._createSquare(1).canvasElt, this._createSquare(2).canvasElt, this._createRect(1).canvasElt, this._createRect(1, 90).canvasElt);
            }
        }

        /**
         * Draw all the white peg of the grid
         */

    }, {
        key: '_drawWhitePeg',
        value: function _drawWhitePeg(size) {
            // We stop rendering on each add, in order to save performances
            this.canvas.renderOnAddRemove = false;
            var max = Math.round(size / this.cellSize);
            var maxSize = max * this.cellSize;
            for (var row = 0; row < max; row++) {
                for (var col = 0; col < max; col++) {
                    var squareTmp = new fabric.Rect({
                        width: this.cellSize,
                        height: this.cellSize,
                        fill: _const.BACKGROUND_LEGO_COLOR,
                        originX: 'center',
                        originY: 'center',
                        centeredRotation: true,
                        hasControls: false
                    });
                    var circle = new _circle.Circle(this.cellSize, _const.BACKGROUND_LEGO_COLOR);
                    circle.canvasElt.set({
                        lockRotation: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        hasControls: false,
                        hasBorders: false
                    });
                    var groupTmp = new fabric.Group([squareTmp, circle.canvasElt], {
                        left: this.cellSize * col,
                        top: this.cellSize * row + this.headerHeight,
                        angle: 0,
                        lockRotation: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        hasControls: false,
                        hasBorders: false
                    });
                    this.canvas.add(groupTmp);
                }
            }
            this.canvas.renderAll();
            this.canvas.renderOnAddRemove = true;
            // We transform the canvas to a base64 image in order to save performances.
            var url = this.canvas.toDataURL();
            this.canvas.clear();
            this.canvas.setBackgroundImage(url, this.canvas.renderAll.bind(this.canvas), {
                originX: 'left',
                originY: 'top',
                width: this.canvas.width,
                height: this.canvas.height
            });
        }

        /**
         * Create a horizontal or vertical rectangle
         */

    }, {
        key: '_createRect',
        value: function _createRect(sizeRect, angle) {
            return this._createBrick({
                size: { col: 2 * sizeRect, row: 1 * sizeRect },
                left: angle ? this.canvasRect.width / 4 - this.cellSize : this.canvasRect.width * 3 / 4 - this.cellSize * 1.5,
                top: angle ? 1 : 0,
                angle: angle
            });
        }

        /**
         * Create a square (1x1) or (2x2)
         */

    }, {
        key: '_createSquare',
        value: function _createSquare(sizeSquare) {
            return this._createBrick({
                size: { col: 1 * sizeSquare, row: 1 * sizeSquare },
                left: sizeSquare === 2 ? this.canvasRect.width / 2 - 2 * this.cellSize : this.canvasRect.width - this.cellSize * 1.5,
                top: sizeSquare === 2 ? 1 : 0
            });
        }

        /**
         * Generic method that create a peg
         */

    }, {
        key: '_createBrick',
        value: function _createBrick(options) {
            options.cellSize = this.cellSize;
            options.color = options.color || this.lastColor;
            var peg = new _peg.Peg(options);
            this.brickModel[peg.id] = peg;
            // We have to update the rowSelect Object to be alsway update
            if (options.size.row === 2) {
                this.rowSelect.bigSquare = peg;
            } else if (options.angle) {
                this.rowSelect.vertRect = peg;
            } else if (options.size.col === 2) {
                this.rowSelect.rect = peg;
            } else {
                this.rowSelect.square = peg;
            }
            return peg;
        }

        /**
         * Init the canvas
         */

    }, {
        key: '_drawCanvas',
        value: function _drawCanvas() {
            this._drawWhitePeg(this.canvasRect.width);
            this._drawGrid(this.canvasRect.width, Math.round(this.canvasRect.width / _const.NB_CELLS));
        }
    }]);

    return LegoGridCanvas;
}();

},{"../common/const.js":3,"../common/legoColors.js":4,"../lego_shape/circle.js":8,"../lego_shape/peg.js":9}],3:[function(require,module,exports){
'use strict';

// Number of cell on the grid

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NB_CELLS = exports.NB_CELLS = 15;

// Height of the header
var HEADER_HEIGHT = exports.HEADER_HEIGHT = window.screen.width <= 768 ? 60 : 100;

// First color to use
var BASE_LEGO_COLOR = exports.BASE_LEGO_COLOR = "#0d69f2";

// Medium Stone Grey 
var COLOR_194 = "#a3a2a4";

// Light Stone Grey
var COLOR_208 = "#e5e4de";

// Background color used
var BACKGROUND_LEGO_COLOR = exports.BACKGROUND_LEGO_COLOR = COLOR_208;

},{}],4:[function(require,module,exports){
'use strict';

/*
* Colors from 
* http://lego.wikia.com/wiki/Colour_Palette 
* And http://www.peeron.com/cgi-bin/invcgis/colorguide.cgi
* Only Show the color use since 2010
**/

Object.defineProperty(exports, "__esModule", {
    value: true
});
var LEGO_COLORS = exports.LEGO_COLORS = ['rgb(245, 205, 47)', //24, Bright Yellow *
'rgb(253, 234, 140)', //226, Cool Yellow *
'rgb(218, 133, 64)', //106, Bright Orange *
'rgb(232, 171, 45)', //191, Flame Yellowish Orange *
'rgb(196, 40, 27)', //21, Bright Red *
'rgb(123, 46, 47)', //154, Dark Red *
'rgb(205, 98, 152)', //221, Bright Purple *
'rgb(228, 173, 200)', //222, Light Purple *
'rgb(146, 57, 120)', //124, Bright Reddish Violet *
'rgb(52, 43, 117)', //268, Medium Lilac *
'rgb(13, 105, 242)', //23, Bright Blue *
'rgb(159, 195, 233)', //212, Light Royal Blue *
'rgb(110, 153, 201)', //102, Medium Blue *
'rgb(32, 58, 86)', //140, Earth Blue *
'rgb(116, 134, 156)', //135, Sand Blue *
'rgb(40, 127, 70)', //28, Dark Green *
'rgb(75, 151, 74)', //37, Birght Green *
'rgb(120, 144, 129)', //151, Sand Green *
'rgb(39, 70, 44)', //141, Earth Green *
'rgb(164, 189, 70)', //119, Bright Yellowish-Green * 
'rgb(105, 64, 39)', //192, Reddish Brown *
'rgb(215, 197, 153)', //5, Brick Yellow * 
'rgb(149, 138, 115)', //138, Sand Yellow *
'rgb(170, 125, 85)', //312, Medium Nougat *    
'rgb(48, 15, 6)', //308, Dark Brown *
'rgb(204, 142, 104)', //18, Nougat *
'rgb(245, 193, 137)', //283, Light Nougat *
'rgb(160, 95, 52)', //38, Dark Orange *
'rgb(242, 243, 242)', //1, White *
'rgb(229, 228, 222)', //208, Light Stone Grey *
'rgb(163, 162, 164)', //194, Medium Stone Grey *
'rgb(99, 95, 97)', //199, Dark Stone Grey *
'rgb(27, 42, 52)'];

},{}],5:[function(require,module,exports){
'use strict';

/**
 * Helper function to calculate a variation of color
 * 
 * From : https://www.sitepoint.com/javascript-generate-lighter-darker-color/
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ColorLuminance = ColorLuminance;
function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

},{}],6:[function(require,module,exports){
'use strict';

/**
 * Basic Firebase helper
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FireBaseLegoApp = exports.FireBaseLegoApp = function FireBaseLegoApp() {
    _classCallCheck(this, FireBaseLegoApp);

    // Configuration of the application, You should update with your Keys !
    this.config = {
        apiKey: "AIzaSyDr9R85tNjfKWddW1-N7XJpAhGqXNGaJ5k",
        authDomain: "legonnary.firebaseapp.com",
        databaseURL: "https://legonnary.firebaseio.com",
        storageBucket: ""
    };

    this.app = firebase.initializeApp(this.config);
};

},{}],7:[function(require,module,exports){
'use strict';

/**
 * Class for generic management of Authentication with firebase.
 * 
 * It takes care of html to hide or show
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FireBaseAuth = exports.FireBaseAuth = function () {
    function FireBaseAuth(config) {
        _classCallCheck(this, FireBaseAuth);

        var uiConfig = {
            'callbacks': {
                // Called when the user has been successfully signed in.
                'signInSuccess': function signInSuccess(user, credential, redirectUrl) {
                    // Do not redirect.
                    return false;
                }
            },
            // Opens IDP Providers sign-in flow in a popup.
            'signInFlow': 'popup',
            'signInOptions': [{
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: ['https://www.googleapis.com/auth/plus.login']
            }, firebase.auth.FacebookAuthProvider.PROVIDER_ID, firebase.auth.TwitterAuthProvider.PROVIDER_ID, firebase.auth.GithubAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID],
            // Terms of service url.
            'tosUrl': 'https://gdgnantes.com'
        };
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
        this.ui.start('#firebaseui-auth-container', uiConfig);
        this.user = null;
        this.idDivLogin = config.idDivLogin;
        this.idNextDiv = config.idNextDiv;
        this.idLogout = config.idLogout;

        // Optionals
        this.idImg = config.idImg ? config.idImg : null;
        this.idDisplayName = config.idDisplayName ? config.idDisplayName : null;

        firebase.auth().onAuthStateChanged(this._checkCallBackContext.bind(this), this._checkCallBackErrorContext.bind(this));

        this.cbAuthChanged = null;

        document.getElementById(this.idLogout).addEventListener('click', function () {
            return firebase.auth().signOut();
        });
    }

    /**
     * In case of error
     */


    _createClass(FireBaseAuth, [{
        key: '_checkCallBackErrorContext',
        value: function _checkCallBackErrorContext(error) {
            console.error(error);
        }

        /**
         * Callback method with the state of connection
         * 
         * According to 'user', it will show or hide some html areas
         */

    }, {
        key: '_checkCallBackContext',
        value: function _checkCallBackContext(user) {
            this.user = user;
            if (user) {
                document.getElementById(this.idDivLogin).setAttribute("hidden", "");
                document.getElementById(this.idNextDiv).removeAttribute('hidden');
                document.getElementById(this.idLogout).removeAttribute("hidden");
                if (this.idImg) {
                    document.getElementById(this.idImg).src = user.photoURL;
                    document.getElementById(this.idImg).removeAttribute('hidden');
                }
                if (this.idDisplayName) {
                    document.getElementById(this.idDisplayName).innerHTML = user.displayName;;
                }
            } else {
                document.getElementById(this.idDivLogin).removeAttribute("hidden", "");
                document.getElementById(this.idNextDiv).setAttribute("hidden", "");
                document.getElementById(this.idLogout).setAttribute("hidden", "");
                document.getElementById(this.idImg).src = "";
                document.getElementById(this.idImg).setAttribute('hidden', "");
                document.getElementById(this.idDisplayName).innerHTML = "Non Conntecté";
            }
            if (this.cbAuthChanged) {
                this.cbAuthChanged(user);
            }
        }

        /**
         * Registration of callback for futur interaction.
         * The callback method will be called with user as parameter
         */

    }, {
        key: 'onAuthStateChanged',
        value: function onAuthStateChanged(cb) {
            this.cbAuthChanged = cb;
        }

        /**
         * Show the name of the current logged user
         */

    }, {
        key: 'displayName',
        value: function displayName() {
            return this.user ? this.user.displayName : null;
        }

        /**
         * Show the id of the current logged user
         */

    }, {
        key: 'userId',
        value: function userId() {
            return this.user ? this.user.uid : null;
        }
    }]);

    return FireBaseAuth;
}();

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Circle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../common/util.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Circle Lego class
 * The circle is composed of 2 circle (on the shadow, and the other one for the top)
 * 
 */
var Circle = exports.Circle = function () {
    function Circle(cellSize, color) {
        _classCallCheck(this, Circle);

        this.circleBasic = new fabric.Circle({
            radius: cellSize / 2 - 5,
            fill: (0, _util.ColorLuminance)(color, -0.1),
            originX: 'center',
            originY: 'center',
            shadow: "0px 2px 10px rgba(0,0,0,0.2)"
        });

        this.circleBasicEtx = new fabric.Circle({
            radius: cellSize / 2 - 4,
            fill: (0, _util.ColorLuminance)(color, 0.1),
            originX: 'center',
            originY: 'center'
        });

        this.text = new fabric.Text('GDG', {
            fontSize: cellSize / 5,
            fill: (0, _util.ColorLuminance)(color, -0.15),
            originX: 'center',
            originY: 'center',
            stroke: (0, _util.ColorLuminance)(color, -0.20),
            strokeWidth: 1
        });

        this.group = new fabric.Group([this.circleBasicEtx, this.circleBasic, this.text]);
    }

    /**
     * Return the FabricJS element
     */


    _createClass(Circle, [{
        key: 'changeColor',


        /**
         * Change the color of the circle
         */
        value: function changeColor(color) {
            this.circleBasic.set('fill', (0, _util.ColorLuminance)(color, -0.1));
            this.circleBasicEtx.set('fill', (0, _util.ColorLuminance)(color, 0.1));
            this.text.set({
                fill: (0, _util.ColorLuminance)(color, -0.15),
                stroke: (0, _util.ColorLuminance)(color, -0.20)
            });
        }
    }, {
        key: 'canvasElt',
        get: function get() {
            return this.group;
        }
    }]);

    return Circle;
}();

},{"../common/util.js":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Peg = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _circle = require('./circle.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Peg Lego class
 * The peg is composed of n circle for a dimension that depend on the size parameter
 */
var Peg = exports.Peg = function () {
    function Peg(_ref) {
        var _ref$size = _ref.size;
        var size = _ref$size === undefined ? { col: 1, row: 1 } : _ref$size;
        var _ref$cellSize = _ref.cellSize;
        var cellSize = _ref$cellSize === undefined ? 0 : _ref$cellSize;
        var _ref$color = _ref.color;
        var color = _ref$color === undefined ? '#FFF' : _ref$color;
        var _ref$left = _ref.left;
        var left = _ref$left === undefined ? 0 : _ref$left;
        var _ref$top = _ref.top;
        var top = _ref$top === undefined ? 0 : _ref$top;
        var _ref$angle = _ref.angle;
        var angle = _ref$angle === undefined ? 0 : _ref$angle;

        _classCallCheck(this, Peg);

        this.size = size;
        this.id = 'Peg' + size + '-' + Date.now();
        this.isReplace = false;
        this.toRemove = false;
        this.color = color;
        this.top = top;
        this.left = left;
        this.angle = angle || 0;
        this.circleArray = [];

        this.rectBasic = new fabric.Rect({
            width: cellSize * size.col,
            height: cellSize * size.row,
            fill: color,
            originX: 'center',
            originY: 'center',
            centeredRotation: true,
            hasControls: false,
            shadow: "5px 5px 10px rgba(0,0,0,0.2)"
        });

        var arrayElts = [this.rectBasic];
        var circleGroup = new _circle.Circle(cellSize, color);
        this.circleArray.push(circleGroup);
        // According to the size, we don't place the circles at the same place
        if (size.col === 2) {
            // For a rectangle or a big Square
            // We update the row positions
            circleGroup.canvasElt.set({
                left: -cellSize + 5
            });
            if (size.row === 2) {
                circleGroup.canvasElt.set({
                    top: -cellSize + 5
                });
            }
            circleGroup = new _circle.Circle(cellSize, color);
            circleGroup.canvasElt.set({
                left: 0
            });

            // For a Big Square
            if (size.row === 2) {
                circleGroup.canvasElt.set({
                    top: -cellSize + 5
                });
            }
            this.circleArray.push(circleGroup);

            // For a Big Square
            if (size.row === 2) {
                circleGroup = new _circle.Circle(cellSize, color);
                circleGroup.canvasElt.set({
                    left: -cellSize + 5,
                    top: 0
                });
                this.circleArray.push(circleGroup);
                circleGroup = new _circle.Circle(cellSize, color);
                circleGroup.canvasElt.set({
                    left: 0,
                    top: 0
                });
                this.circleArray.push(circleGroup);
            }
        }

        this.circleArray.forEach(function (circle) {
            return arrayElts.push(circle.canvasElt);
        });

        // The peg is locked in all position
        this.group = new fabric.Group(arrayElts, {
            left: this.left,
            top: this.top,
            angle: this.angle,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            hasControls: false
        });

        // We add to FabricElement a reference to the curent peg
        this.group.parentPeg = this;
    }

    // The FabricJS element


    _createClass(Peg, [{
        key: 'changeColor',


        // Change the color of the peg
        value: function changeColor(color) {
            this.color = color;
            this.rectBasic.set('fill', color);
            this.circleArray.forEach(function (circle) {
                return circle.changeColor(color);
            });
        }

        // Move the peg to desire position

    }, {
        key: 'move',
        value: function move(left, top) {
            this.top = top;
            this.left = left;
            this.group.set({
                top: top,
                left: left
            });
        }

        // Rotate the peg to the desire angle

    }, {
        key: 'rotate',
        value: function rotate(angle) {
            this.angle = angle;
            this.group.set({
                angle: angle
            });
        }
    }, {
        key: 'canvasElt',
        get: function get() {
            return this.group;
        }

        // True if the element was replaced

    }, {
        key: 'replace',
        get: function get() {
            return this.isReplace;
        }

        // Setter for isReplace param
        ,
        set: function set(replace) {
            this.isReplace = replace;
        }
    }]);

    return Peg;
}();

},{"./circle.js":8}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfbW9kZXJhdG9yLmpzIiwic3JjL3NjcmlwdHMvY2FudmFzL2xlZ29DYW52YXMuanMiLCJzcmMvc2NyaXB0cy9jb21tb24vY29uc3QuanMiLCJzcmMvc2NyaXB0cy9jb21tb24vbGVnb0NvbG9ycy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi91dGlsLmpzIiwic3JjL3NjcmlwdHMvZmlyZWJhc2UvZmlyZWJhc2UuanMiLCJzcmMvc2NyaXB0cy9maXJlYmFzZS9maXJlYmFzZUF1dGguanMiLCJzcmMvc2NyaXB0cy9sZWdvX3NoYXBlL2NpcmNsZS5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvcGVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsQ0FBQyxZQUFZOztBQUVULFFBQUksV0FBVyxLQUFmO0FBQUEsUUFBc0I7QUFDckIsbUJBQWUsSUFEaEI7QUFBQSxRQUNzQjtBQUNyQixpQkFBYSxJQUZkO0FBQUEsUUFFcUI7QUFDcEIsaUJBQWEsSUFIZDtBQUFBLFFBR29CO0FBQ25CLGtCQUFjLElBSmY7QUFBQSxRQUlxQjtBQUNwQixzQkFBa0IsSUFMbkI7O0FBUUEsYUFBUyxRQUFULEdBQW1CO0FBQ2YscUJBQWEsK0JBQW1CLFlBQW5CLEVBQWlDLEtBQWpDLENBQWI7QUFDQTtBQUNIOztBQUdELGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIsdUJBQWUsZ0NBQXNCLEdBQXJDO0FBQ0E7QUFDQSxZQUFJLGVBQWUsK0JBQWlCO0FBQ2hDLHdCQUFZLFdBRG9CO0FBRWhDLHVCQUFZLE1BRm9CO0FBR2hDLHNCQUFXO0FBSHFCLFNBQWpCLENBQW5COztBQU1BO0FBQ0EscUJBQWEsa0JBQWIsQ0FBZ0MsVUFBQyxJQUFELEVBQVM7QUFDckMsZ0JBQUksSUFBSixFQUFTO0FBQ0wsb0JBQUksQ0FBQyxRQUFMLEVB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QkFBYztBQVB1QixTQUE1QixDQUFiOztBQVVBO0FBQ0EsYUFBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixJQUF2QjtBQUNIOztBQUVEOzs7Ozs7O0FBZUE7b0NBQ1ksSyxFQUFNO0FBQ2QsaUJBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxpQkFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixNQUFuQixFQUEyQixLQUEzQjtBQUNBLGlCQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxNQUFEO0FBQUEsdUJBQVcsT0FBTyxXQUFQLENBQW1CLEtBQW5CLENBQVg7QUFBQSxhQUF6QjtBQUNIOztBQUVEOzs7OzZCQUNLLEksRUFBTSxHLEVBQUk7QUFDWCxpQkFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGlCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZTtBQUNYLHFCQUFLLEdBRE07QUFFWCxzQkFBTztBQUZJLGFBQWY7QUFJSDs7QUFFRDs7OzsrQkFDTyxLLEVBQU07QUFDVCxpQkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWU7QUFDWCx1QkFBUTtBQURHLGFBQWY7QUFHSDs7OzRCQXJDYztBQUNYLG1CQUFPLEtBQUssS0FBWjtBQUNIOztBQUVEOzs7OzRCQUNhO0FBQ1QsbUJBQU8sS0FBSyxTQUFaO0FBQ0g7O0FBRUQ7OzBCQUNZLE8sRUFBUTtBQUNoQixpQkFBSyxTQUFMLEdBQWlCLE9BQWpCO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0ZpcmVCYXNlTGVnb0FwcH0gZnJvbSAnLi9maXJlYmFzZS9maXJlYmFzZS5qcyc7XG5pbXBvcnQge0ZpcmVCYXNlQXV0aH0gZnJvbSAnLi9maXJlYmFzZS9maXJlYmFzZUF1dGguanMnO1xuaW1wb3J0IHtMZWdvR3JpZENhbnZhc30gZnJvbSAnLi9jYW52YXMvbGVnb0NhbnZhcy5qcyc7XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXQgZ2FtZUluaXQgPSBmYWxzZSwgLy8gdHJ1ZSBpZiB3ZSBpbml0IHRoZSBsZWdvR3JpZFxuICAgICBmaXJlQmFzZUxlZ28gPSBudWxsLCAvLyB0aGUgcmVmZXJlbmNlIG9mIHRoZSBmaXJlQmFzZUFwcFxuICAgICBsZWdvQ2FudmFzID0gbnVsbCwgIC8vIFRoZSBsZWdvR3JpZFxuICAgICBjdXJyZW50S2V5ID0gbnVsbCwgLy8gVGhlIGN1cmVudCBmaXJlYmFzZSBkcmF3IGtleVxuICAgICBjdXJyZW50RHJhdyA9IG51bGwsIC8vIFRoZSBjdXJlbnQgZmlyZWJhc2UgZHJhd1xuICAgICByZWFkeUZvck5ld0RyYXcgPSB0cnVlOyBcblxuXG4gICAgZnVuY3Rpb24gaW5pdEdhbWUoKXtcbiAgICAgICAgbGVnb0NhbnZhcyA9IG5ldyBMZWdvR3JpZENhbnZhcygnY2FudmFzRHJhdycsIGZhbHNlKTtcbiAgICAgICAgZ2V0TmV4dERyYXcoKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGZpcmVCYXNlTGVnbyA9IG5ldyBGaXJlQmFzZUxlZ29BcHAoKS5hcHA7XG4gICAgICAgIC8vIFdlIGluaXQgdGhlIGF1dGhlbnRpY2F0aW9uIG9iamVjdCBcbiAgICAgICAgbGV0IGZpcmVCYXNlQXV0aCA9IG5ldyBGaXJlQmFzZUF1dGgoe1xuICAgICAgICAgICAgaWREaXZMb2dpbjogJ2xvZ2luLW1zZycsIFxuICAgICAgICAgICAgaWROZXh0RGl2IDogJ2dhbWUnLCBcbiAgICAgICAgICAgIGlkTG9nb3V0IDogJ3NpZ25vdXQnXG4gICAgICAgIH0pOyBcblxuICAgICAgICAvLyBXZSBzdGFydCB0byBwbGF5IG9ubHkgd2hlbiB3ZSBhcmUgbG9nZ2VkXG4gICAgICAgIGZpcmVCYXNlQXV0aC5vbkF1dGhTdGF0ZUNoYW5nZWQoKHVzZXIpPT4ge1xuICAgICAgICAgICAgaWYgKHVzZXIpe1xuICAgICAgICAgICAgICAgIGlmICghZ2FtZUluaXQpe1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5pdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGluaXRHYW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXaGVuIGEgZHJhdyBpcyBhZGQgb24gdGhlIGZpcmViYXNlIG9iamVjdCwgd2UgbG9vayBhdCBpdFxuICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoJ2RyYXcnKS5vbignY2hpbGRfYWRkZWQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBpZiAocmVhZHlGb3JOZXdEcmF3KXtcbiAgICAgICAgICAgICAgICBnZXROZXh0RHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXaGVuIGEgZHJhdyBpcyByZW1vdmVkIChpZiBhbiBvdGhlciBtb2RlcmF0b3IgdmFsaWRhdGUgZm9yIGV4YW1wbGUpIG9uIHRoZSBmaXJlYmFzZSBvYmplY3QsIHdlIGxvb2sgYXQgaXRcbiAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKCdkcmF3Jykub24oJ2NoaWxkX3JlbW92ZWQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvLyBXZSBmb3JjZSBhIG5ldyBkcmF3IGJlY2F1c2Ugd2UgYWx3YXlzIHNob3cgdGhlIGZpcnN0IGRyYXdcbiAgICAgICAgICAgIGdldE5leHREcmF3KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdlIHJlZnVzZWQgdGhlIGN1cnJlbnQgZHJhd1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuU3VibWlzc2lvblJlZnVzZWQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIFdoZW4gd2UgcmVmdXNlIGFuIG9iamVjdCwgd2UgdGFrZSBhIHNuYXBzaG90IG9mIGl0IHRvIGF2b2lkIHRoZSByZWNvbnN0cnVjdGlvbiBvZiB0aGUgY2FudmFzLlxuXG4gICAgICAgICAgICAgICAgV2UgdGhlbiBhbGxvdyB0aGUgYXV0aG9yIHRvIHNlZSBpdHMgZHJhdy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAgbGV0IGRhdGFVcmwgPSBsZWdvQ2FudmFzLnNuYXBzaG90KCk7XG4gICAgICAgICAgICAgY3VycmVudERyYXcuZGF0YVVybCA9IGRhdGFVcmw7XG4gICAgICAgICAgICAgZGVsZXRlIGN1cnJlbnREcmF3Lmluc3RydWN0aW9ucztcbiAgICAgICAgICAgICAvLyB3ZSBtb3ZlIHRoZSBkcmF3IHRvIHRoZSByZWplY3Qgc3RhdGVcbiAgICAgICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoYGRyYXcvJHtjdXJyZW50S2V5fWApLnJlbW92ZSgpO1xuICAgICAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZihgL2RyYXdTYXZlZC8ke2N1cnJlbnREcmF3LnVzZXJJZH1gKS5wdXNoKGN1cnJlbnREcmF3KTtcbiAgICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgICAgICBnZXROZXh0RHJhdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuU3VibWlzc2lvbkFjY2VwdGVkJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBXaGVuIHdlIGFjY2VwdCBhIGRyYXcgd2UgbW92ZSBpdCB0byBhbiBvdGhlciBicmFuY2ggb2YgdGhlIGZpcmViYXNlIHRyZWUuXG5cbiAgICAgICAgICAgICAgICBUaGUgY291bnQgZG93biBwYWdlIGNvdWxkIGJlIHRyaWdnZXJlZCB0byB0aGlzIGNoYW5nZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoYGRyYXcvJHtjdXJyZW50S2V5fWApLnJlbW92ZSgpO1xuICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKFwiL2RyYXdWYWxpZGF0ZWRcIikucHVzaChjdXJyZW50RHJhdyk7XG4gICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgICAgIGdldE5leHREcmF3KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGUgdGhlIG5leHQgZHJhdyB0byBzaG93XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TmV4dERyYXcoKXtcbiAgICAgICAgLy8gRWFjaCB0aW1lLCB3ZSB0YWtlIGEgc25hcHNob3Qgb2YgZHJhdyBjaGlsZHMgYW5kIHNob3cgaXQgdG8gdGhlIG1vZGVyYXRvclxuICAgICAgICByZWFkeUZvck5ld0RyYXcgPSBmYWxzZTtcbiAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZignZHJhdycpLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24oc25hcHNob3Qpe1xuICAgICAgICAgICAgaWYgKHNuYXBzaG90ICYmIHNuYXBzaG90LnZhbCgpKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50RHJhdyA9IHNuYXBzaG90O1xuICAgICAgICAgICAgICAgIGxldCBzbmFwc2hvdEZiID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhzbmFwc2hvdEZiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50S2V5ID0ga2V5c1swXTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RHJhdyA9IHNuYXBzaG90RmJba2V5c1swXV07XG4gICAgICAgICAgICAgICAgbGVnb0NhbnZhcy5kcmF3SW5zdHJ1Y3Rpb25zKHNuYXBzaG90RmJba2V5c1swXV0pO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wb3NpdGlvbi10ZXh0JykuaW5uZXJIVE1MID0gYFByb3Bvc2l0aW9uIGRlICR7Y3VycmVudERyYXcudXNlcn1gO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcmVhZHlGb3JOZXdEcmF3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvcG9zaXRpb24tdGV4dCcpLmlubmVySFRNTCA9IFwiRW4gYXR0ZW50ZSBkZSBwcm9wb3NpdGlvblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAvLyBlcnJvciBjYWxsYmFjayB0cmlnZ2VyZWQgd2l0aCBQRVJNSVNTSU9OX0RFTklFRFxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xuXG4gICAgLyogU0VSVklDRV9XT1JLRVJfUkVQTEFDRVxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7ICAgICAgICBcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy4vc2VydmljZS13b3JrZXItbW9kZXJhdG9yLmpzJywge3Njb3BlIDogbG9jYXRpb24ucGF0aG5hbWV9KS50aGVuKGZ1bmN0aW9uKHJlZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2UgV29ya2VyIFJlZ2lzdGVyIGZvciBzY29wZSA6ICVzJyxyZWcuc2NvcGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgU0VSVklDRV9XT1JLRVJfUkVQTEFDRSAqL1xufSkoKTsiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7UGVnfSBmcm9tICcuLi9sZWdvX3NoYXBlL3BlZy5qcyc7XG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi4vbGVnb19zaGFwZS9jaXJjbGUuanMnO1xuaW1wb3J0IHtOQl9DRUxMUywgSEVBREVSX0hFSUdIVCwgQkFTRV9MRUdPX0NPTE9SLCBCQUNLR1JPVU5EX0xFR09fQ09MT1J9IGZyb20gJy4uL2NvbW1vbi9jb25zdC5qcyc7XG5pbXBvcnQge2xlZ29CYXNlQ29sb3J9IGZyb20gJy4uL2NvbW1vbi9sZWdvQ29sb3JzLmpzJztcblxuLyoqXG4gKiBcbiAqIENsYXNzIGZvciBDYW52YXMgR3JpZFxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBMZWdvR3JpZENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoaWQsIHNob3dSb3cpIHtcbiAgICAgICAgLy8gQmFzaWMgY2FudmFzXG4gICAgICAgIHRoaXMuY2FudmFzRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvLyBTaXplIG9mIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhc1JlY3QgPSB0aGlzLmNhbnZhc0VsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgLy8gSW5kaWNhdG9yIGZvciBzaG93aW5nIHRoZSBmaXJzdCByb3cgd2l0aCBwZWdzXG4gICAgICAgIHRoaXMuc2hvd1JvdyA9IHNob3dSb3c7XG4gICAgICAgIHRoaXMuY2FudmFzRWx0LndpZHRoID0gdGhpcy5jYW52YXNSZWN0LndpZHRoO1xuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gc2hvd1Jvdywgd2Ugd2lsbCBzaG93IG1vZGlmeSB0aGUgaGVhZGVyIEhlaWdodFxuICAgICAgICB0aGlzLmhlYWRlckhlaWdodCA9IHRoaXMuc2hvd1JvdyA/IEhFQURFUl9IRUlHSFQgOiAwO1xuICAgICAgICB0aGlzLmNhbnZhc0VsdC5oZWlnaHQgPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGggKyB0aGlzLmhlYWRlckhlaWdodDtcbiAgICAgICAgLy8gV2UgY2FsY3VsYXRlIHRoZSBjZWxsc2l6ZSBhY2NvcmRpbmcgdG8gdGhlIHNwYWNlIHRha2VuIGJ5IHRoZSBjYW52YXNcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpO1xuXG4gICAgICAgIC8vIFdlIGluaXRpYWxpemUgdGhlIEZhYnJpYyBKUyBsaWJyYXJ5IHdpdGggb3VyIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKGlkLCB7IHNlbGVjdGlvbjogZmFsc2UgfSk7XG4gICAgICAgIC8vIE9iamVjdCB0aGF0IHJlcHJlc2VudCB0aGUgcGVncyBvbiB0aGUgZmlyc3Qgcm93XG4gICAgICAgIHRoaXMucm93U2VsZWN0ID0ge307XG4gICAgICAgIC8vIFRoZSBjdXJyZW50IGRyYXcgbW9kZWwgKGluc3RydWN0aW9ucywgLi4uKVxuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fSxcbiAgICAgICAgLy8gRmxhZyB0byBkZXRlcm1pbmUgaWYgd2UgaGF2ZSB0byBjcmVhdGUgYSBuZXcgYnJpY2tcbiAgICAgICAgdGhpcy5jcmVhdGVOZXdCcmljayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gQkFTRV9MRUdPX0NPTE9SO1xuXG4gICAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgY2FudmFzXG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcblxuICAgICAgICAvLyBJZiB3ZSBzaG93IHRoZSByb3csIHdlIGhhdmUgdG8gcGx1ZyB0aGUgbW92ZSBtYW5hZ2VtZW50XG4gICAgICAgIGlmIChzaG93Um93KSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6c2VsZWN0ZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWcgPyBvcHRpb25zLnRhcmdldCA6IG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ3NlbGVjdGlvbjpjbGVhcmVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gbnVsbCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6bW92aW5nJywgKG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGVnID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnO1xuXG5cbiAgICAgICAgICAgICAgICBsZXQgbmV3TGVmdCA9IE1hdGgucm91bmQob3B0aW9ucy50YXJnZXQubGVmdCAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3VG9wID0gTWF0aC5yb3VuZCgob3B0aW9ucy50YXJnZXQudG9wIC0gdGhpcy5oZWFkZXJIZWlnaHQpIC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplICsgdGhpcy5oZWFkZXJIZWlnaHQ7ICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlIHRvcFxuICAgICAgICAgICAgICAgIGxldCB0b3BDb21wdXRlID0gbmV3VG9wICsgKHBlZy5zaXplLnJvdyA9PT0gMiB8fCBwZWcuYW5nbGUgPiAwID8gdGhpcy5jZWxsU2l6ZSAqIDIgOiB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgICAgICBsZXQgbGVmdENvbXB1dGUgPSBuZXdMZWZ0ICsgKHBlZy5zaXplLmNvbCA9PT0gMiA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgcGVnLm1vdmUoXG4gICAgICAgICAgICAgICAgICAgIG5ld0xlZnQsIC8vbGVmdFxuICAgICAgICAgICAgICAgICAgICBuZXdUb3AgLy8gdG9wXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIFdlIHNwZWNpZnkgdGhhdCB3ZSBjb3VsZCByZW1vdmUgYSBwZWcgaWYgb25lIG9mIGl0J3MgZWRnZSB0b3VjaCB0aGUgb3V0c2lkZSBvZiB0aGUgY2FudmFzXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA8IEhFQURFUl9IRUlHSFRcbiAgICAgICAgICAgICAgICAgICAgfHwgbmV3TGVmdCA8IDBcbiAgICAgICAgICAgICAgICAgICAgfHwgdG9wQ29tcHV0ZSA+PSB0aGlzLmNhbnZhc0VsdC5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgfHwgbGVmdENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBFbHNlIHdlIGNoZWNrIHdlIGNyZWF0ZSBhIG5ldyBwZWcgKHdoZW4gYSBwZWcgZW50ZXIgaW4gdGhlIGRyYXcgYXJlYSlcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGVnLnJlcGxhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5jb2wgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgyKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmIChwZWcuYW5nbGUgPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGVnLnJlcGxhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ21vdXNlOnVwJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCcmlja1xuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcudG9SZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnJlcGxhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuYnJpY2tNb2RlbFt0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcuaWRdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmUodGhpcy5jdXJyZW50QnJpY2spO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBmb3IgY2hhbmdpbmcgdGhlIGNvbG9yIG9mIHRoZSBmaXJzdCByb3cgXG4gICAgICovXG4gICAgY2hhbmdlQ29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBjb2xvcjsgICAgICAgXG4gICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZS5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdC5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlcmlhbGl6ZSB0aGUgY2FudmFzIHRvIGEgbWluaW1hbCBvYmplY3QgdGhhdCBjb3VsZCBiZSB0cmVhdCBhZnRlclxuICAgICAqL1xuICAgIGV4cG9ydCh1c2VyTmFtZSwgdXNlcklkKSB7XG4gICAgICAgIGxldCByZXN1bHRBcnJheSA9IFtdO1xuICAgICAgICAvLyBXZSBmaWx0ZXIgdGhlIHJvdyBwZWdzXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5icmlja01vZGVsKVxuICAgICAgICAgICAgLmZpbHRlcigoa2V5KT0+a2V5ICE9IHRoaXMucm93U2VsZWN0LnNxdWFyZS5pZFxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QucmVjdC5pZFxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdC5pZCk7XG4gICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGVnVG1wID0gdGhpcy5icmlja01vZGVsW2tleV07XG4gICAgICAgICAgICByZXN1bHRBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICBzaXplOiBwZWdUbXAuc2l6ZSxcbiAgICAgICAgICAgICAgICBjb2xvcjogcGVnVG1wLmNvbG9yLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiBwZWdUbXAuYW5nbGUsXG4gICAgICAgICAgICAgICAgdG9wOiBwZWdUbXAudG9wIC0gdGhpcy5oZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdDogcGVnVG1wLmxlZnQsXG4gICAgICAgICAgICAgICAgY2VsbFNpemUgOiB0aGlzLmNlbGxTaXplXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1c2VyOiB1c2VyTmFtZSxcbiAgICAgICAgICAgIHVzZXJJZCA6IHVzZXJJZCxcbiAgICAgICAgICAgIGluc3RydWN0aW9uczogcmVzdWx0QXJyYXlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGZyb20gaW50cnVjdGlvbnMgYSBkcmF3XG4gICAgICovXG4gICAgZHJhd0luc3RydWN0aW9ucyhpbnN0cnVjdGlvbk9iamVjdCl7XG4gICAgICAgIHRoaXMucmVzZXRCb2FyZCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xuICAgICAgICBpbnN0cnVjdGlvbk9iamVjdC5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdHJ1Y3Rpb24pPT57XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlQnJpY2soeyBzaXplIDogaW5zdHJ1Y3Rpb24uc2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgOiAoaW5zdHJ1Y3Rpb24ubGVmdCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IChpbnN0cnVjdGlvbi50b3AgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZSA6IGluc3RydWN0aW9uLmFuZ2xlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvciA6IGluc3RydWN0aW9uLmNvbG9yXG4gICAgICAgICAgICAgICAgfSkuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgKTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbiB0aGUgYm9hcmQgYW5kIHRoZSBzdGF0ZSBvZiB0aGUgY2FudmFzXG4gICAgICovXG4gICAgcmVzZXRCb2FyZCgpe1xuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fTtcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xuICAgIH1cblxuICAgIC8qKiBcbiAgICAgKiBHZW5lcmF0ZSBhIEJhc2U2NCBpbWFnZSBmcm9tIHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICBzbmFwc2hvdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogUHJpdmF0ZXMgTWV0aG9kc1xuICAgICAqIFxuICAgICAqL1xuXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHRoZSBiYXNpYyBncmlkIFxuICAgICovXG4gICAgX2RyYXdHcmlkKHNpemUpIHsgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnNob3dSb3cpe1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVNxdWFyZSgyKS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEsOTApLmNhbnZhc0VsdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYWxsIHRoZSB3aGl0ZSBwZWcgb2YgdGhlIGdyaWRcbiAgICAgKi9cbiAgICBfZHJhd1doaXRlUGVnKHNpemUpe1xuICAgICAgICAvLyBXZSBzdG9wIHJlbmRlcmluZyBvbiBlYWNoIGFkZCwgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXNcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1heCA9IE1hdGgucm91bmQoc2l6ZSAvIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICBsZXQgbWF4U2l6ZSA9IG1heCAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgIGZvciAodmFyIHJvdyA9MDsgcm93IDwgbWF4OyByb3crKyl7XG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtYXg7IGNvbCsrICl7XG4gICAgICAgICAgICAgICAgIGxldCBzcXVhcmVUbXAgPSBuZXcgZmFicmljLlJlY3Qoe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBCQUNLR1JPVU5EX0xFR09fQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGNpcmNsZSA9IG5ldyBDaXJjbGUodGhpcy5jZWxsU2l6ZSwgQkFDS0dST1VORF9MRUdPX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBjaXJjbGUuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwVG1wID0gbmV3IGZhYnJpYy5Hcm91cChbc3F1YXJlVG1wLCBjaXJjbGUuY2FudmFzRWx0XSwge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLmNlbGxTaXplICogY29sLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuY2VsbFNpemUgKiByb3cgKyB0aGlzLmhlYWRlckhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKGdyb3VwVG1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xuICAgICAgICAvLyBXZSB0cmFuc2Zvcm0gdGhlIGNhbnZhcyB0byBhIGJhc2U2NCBpbWFnZSBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlcy5cbiAgICAgICAgbGV0IHVybCA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpOyAgICAgXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEJhY2tncm91bmRJbWFnZSh1cmwsdGhpcy5jYW52YXMucmVuZGVyQWxsLmJpbmQodGhpcy5jYW52YXMpLCB7XG4gICAgICAgICAgICBvcmlnaW5YOiAnbGVmdCcsXG4gICAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgfSk7ICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCByZWN0YW5nbGVcbiAgICAgKi9cbiAgICBfY3JlYXRlUmVjdChzaXplUmVjdCwgYW5nbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcbiAgICAgICAgICAgICAgICBzaXplIDoge2NvbCA6IDIgKiBzaXplUmVjdCwgcm93IDoxICogc2l6ZVJlY3R9LCBcbiAgICAgICAgICAgICAgICBsZWZ0IDogYW5nbGUgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDQpIC0gdGhpcy5jZWxsU2l6ZSkgOiAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAqIDMgLyA0KSAtICh0aGlzLmNlbGxTaXplICogMS41KSksXG4gICAgICAgICAgICAgICAgdG9wIDogYW5nbGUgPyAxIDogMCxcbiAgICAgICAgICAgICAgICBhbmdsZSA6IGFuZ2xlXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBzcXVhcmUgKDF4MSkgb3IgKDJ4MilcbiAgICAgKi9cbiAgICBfY3JlYXRlU3F1YXJlKHNpemVTcXVhcmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcbiAgICAgICAgICAgICAgICBzaXplIDoge2NvbCA6IDEgKiBzaXplU3F1YXJlLCByb3cgOjEgKiBzaXplU3F1YXJlfSwgXG4gICAgICAgICAgICAgICAgbGVmdDogc2l6ZVNxdWFyZSA9PT0gMiA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gMikgLSAoMiAqIHRoaXMuY2VsbFNpemUpKSA6ICh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxuICAgICAgICAgICAgICAgIHRvcCA6IHNpemVTcXVhcmUgPT09IDIgPyAxIDogMCxcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyaWMgbWV0aG9kIHRoYXQgY3JlYXRlIGEgcGVnXG4gICAgICovXG4gICAgX2NyZWF0ZUJyaWNrKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5jZWxsU2l6ZSA9IHRoaXMuY2VsbFNpemU7XG4gICAgICAgIG9wdGlvbnMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8IHRoaXMubGFzdENvbG9yO1xuICAgICAgICBsZXQgcGVnID0gbmV3IFBlZyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5icmlja01vZGVsW3BlZy5pZF0gPSBwZWc7XG4gICAgICAgIC8vIFdlIGhhdmUgdG8gdXBkYXRlIHRoZSByb3dTZWxlY3QgT2JqZWN0IHRvIGJlIGFsc3dheSB1cGRhdGVcbiAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZS5yb3cgPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZSA9IHBlZztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFuZ2xlKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdCA9IHBlZztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNpemUuY29sID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0ID0gcGVnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlID0gcGVnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwZWc7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbml0IHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICBfZHJhd0NhbnZhcygpIHtcbiAgICAgICAgdGhpcy5fZHJhd1doaXRlUGVnKHRoaXMuY2FudmFzUmVjdC53aWR0aCk7XG4gICAgICAgIHRoaXMuX2RyYXdHcmlkKHRoaXMuY2FudmFzUmVjdC53aWR0aCwgTWF0aC5yb3VuZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyBOQl9DRUxMUykpO1xuICAgIH1cbiAgICBcblxufSIsIid1c2Ugc3RyaWN0J1xuXG4vLyBOdW1iZXIgb2YgY2VsbCBvbiB0aGUgZ3JpZFxuZXhwb3J0IGNvbnN0IE5CX0NFTExTID0gMTU7XG5cbi8vIEhlaWdodCBvZiB0aGUgaGVhZGVyXG5leHBvcnQgY29uc3QgSEVBREVSX0hFSUdIVCA9IHdpbmRvdy5zY3JlZW4ud2lkdGggPD0gNzY4ICA/IDYwIDogMTAwO1xuXG4vLyBGaXJzdCBjb2xvciB0byB1c2VcbmV4cG9ydCBjb25zdCBCQVNFX0xFR09fQ09MT1IgPSBcIiMwZDY5ZjJcIjtcblxuLy8gTWVkaXVtIFN0b25lIEdyZXkgXG5jb25zdCBDT0xPUl8xOTQgPSBcIiNhM2EyYTRcIjtcblxuLy8gTGlnaHQgU3RvbmUgR3JleVxuY29uc3QgQ09MT1JfMjA4ID0gXCIjZTVlNGRlXCI7IFxuXG4vLyBCYWNrZ3JvdW5kIGNvbG9yIHVzZWRcbmV4cG9ydCBjb25zdCBCQUNLR1JPVU5EX0xFR09fQ09MT1IgPSBDT0xPUl8yMDg7IiwiJ3VzZSBzdHJpY3QnXG5cbi8qXG4qIENvbG9ycyBmcm9tIFxuKiBodHRwOi8vbGVnby53aWtpYS5jb20vd2lraS9Db2xvdXJfUGFsZXR0ZSBcbiogQW5kIGh0dHA6Ly93d3cucGVlcm9uLmNvbS9jZ2ktYmluL2ludmNnaXMvY29sb3JndWlkZS5jZ2lcbiogT25seSBTaG93IHRoZSBjb2xvciB1c2Ugc2luY2UgMjAxMFxuKiovIFxuZXhwb3J0IGNvbnN0IExFR09fQ09MT1JTID0gW1xuICAgICdyZ2IoMjQ1LCAyMDUsIDQ3KScsIC8vMjQsIEJyaWdodCBZZWxsb3cgKlxuICAgICdyZ2IoMjUzLCAyMzQsIDE0MCknLCAvLzIyNiwgQ29vbCBZZWxsb3cgKlxuICAgICdyZ2IoMjE4LCAxMzMsIDY0KScsIC8vMTA2LCBCcmlnaHQgT3JhbmdlICpcbiAgICAncmdiKDIzMiwgMTcxLCA0NSknLCAvLzE5MSwgRmxhbWUgWWVsbG93aXNoIE9yYW5nZSAqXG4gICAgJ3JnYigxOTYsIDQwLCAyNyknLCAvLzIxLCBCcmlnaHQgUmVkICpcbiAgICAncmdiKDEyMywgNDYsIDQ3KScsIC8vMTU0LCBEYXJrIFJlZCAqXG4gICAgJ3JnYigyMDUsIDk4LCAxNTIpJywgLy8yMjEsIEJyaWdodCBQdXJwbGUgKlxuICAgICdyZ2IoMjI4LCAxNzMsIDIwMCknLCAvLzIyMiwgTGlnaHQgUHVycGxlICpcbiAgICAncmdiKDE0NiwgNTcsIDEyMCknLCAvLzEyNCwgQnJpZ2h0IFJlZGRpc2ggVmlvbGV0ICpcbiAgICAncmdiKDUyLCA0MywgMTE3KScsIC8vMjY4LCBNZWRpdW0gTGlsYWMgKlxuICAgICdyZ2IoMTMsIDEwNSwgMjQyKScsIC8vMjMsIEJyaWdodCBCbHVlICpcbiAgICAncmdiKDE1OSwgMTk1LCAyMzMpJywgLy8yMTIsIExpZ2h0IFJveWFsIEJsdWUgKlxuICAgICdyZ2IoMTEwLCAxNTMsIDIwMSknLCAvLzEwMiwgTWVkaXVtIEJsdWUgKlxuICAgICdyZ2IoMzIsIDU4LCA4NiknLCAvLzE0MCwgRWFydGggQmx1ZSAqXG4gICAgJ3JnYigxMTYsIDEzNCwgMTU2KScsIC8vMTM1LCBTYW5kIEJsdWUgKlxuICAgICdyZ2IoNDAsIDEyNywgNzApJywgLy8yOCwgRGFyayBHcmVlbiAqXG4gICAgJ3JnYig3NSwgMTUxLCA3NCknLCAvLzM3LCBCaXJnaHQgR3JlZW4gKlxuICAgICdyZ2IoMTIwLCAxNDQsIDEyOSknLCAvLzE1MSwgU2FuZCBHcmVlbiAqXG4gICAgJ3JnYigzOSwgNzAsIDQ0KScsIC8vMTQxLCBFYXJ0aCBHcmVlbiAqXG4gICAgJ3JnYigxNjQsIDE4OSwgNzApJywgLy8xMTksIEJyaWdodCBZZWxsb3dpc2gtR3JlZW4gKiBcbiAgICAncmdiKDEwNSwgNjQsIDM5KScsIC8vMTkyLCBSZWRkaXNoIEJyb3duICpcbiAgICAncmdiKDIxNSwgMTk3LCAxNTMpJywgLy81LCBCcmljayBZZWxsb3cgKiBcbiAgICAncmdiKDE0OSwgMTM4LCAxMTUpJywgLy8xMzgsIFNhbmQgWWVsbG93ICpcbiAgICAncmdiKDE3MCwgMTI1LCA4NSknLCAvLzMxMiwgTWVkaXVtIE5vdWdhdCAqICAgIFxuICAgICdyZ2IoNDgsIDE1LCA2KScsIC8vMzA4LCBEYXJrIEJyb3duICpcbiAgICAncmdiKDIwNCwgMTQyLCAxMDQpJywgLy8xOCwgTm91Z2F0ICpcbiAgICAncmdiKDI0NSwgMTkzLCAxMzcpJywgLy8yODMsIExpZ2h0IE5vdWdhdCAqXG4gICAgJ3JnYigxNjAsIDk1LCA1MiknLCAvLzM4LCBEYXJrIE9yYW5nZSAqXG4gICAgJ3JnYigyNDIsIDI0MywgMjQyKScsIC8vMSwgV2hpdGUgKlxuICAgICdyZ2IoMjI5LCAyMjgsIDIyMiknLCAvLzIwOCwgTGlnaHQgU3RvbmUgR3JleSAqXG4gICAgJ3JnYigxNjMsIDE2MiwgMTY0KScsIC8vMTk0LCBNZWRpdW0gU3RvbmUgR3JleSAqXG4gICAgJ3JnYig5OSwgOTUsIDk3KScsIC8vMTk5LCBEYXJrIFN0b25lIEdyZXkgKlxuICAgICdyZ2IoMjcsIDQyLCA1MiknLCAvLzI2LCBCbGFjayAqICAgICAgICBcbl07IiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBhIHZhcmlhdGlvbiBvZiBjb2xvclxuICogXG4gKiBGcm9tIDogaHR0cHM6Ly93d3cuc2l0ZXBvaW50LmNvbS9qYXZhc2NyaXB0LWdlbmVyYXRlLWxpZ2h0ZXItZGFya2VyLWNvbG9yL1xuICovXG5leHBvcnQgZnVuY3Rpb24gQ29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuICAgICAgICAvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG4gICAgICAgIGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcbiAgICAgICAgfVxuICAgICAgICBsdW0gPSBsdW0gfHwgMDtcblxuICAgICAgICAvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG4gICAgICAgIHZhciByZ2IgPSBcIiNcIiwgYywgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgYyA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSAqIDIsIDIpLCAxNik7XG4gICAgICAgICAgICBjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgcmdiICs9IChcIjAwXCIgKyBjKS5zdWJzdHIoYy5sZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJnYjtcbn0iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBCYXNpYyBGaXJlYmFzZSBoZWxwZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEZpcmVCYXNlTGVnb0FwcHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAvLyBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbiwgWW91IHNob3VsZCB1cGRhdGUgd2l0aCB5b3VyIEtleXMgIVxuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGFwaUtleTogXCJBSXphU3lEcjlSODV0TmpmS1dkZFcxLU43WEpwQWhHcVhOR2FKNWtcIixcbiAgICAgICAgICAgIGF1dGhEb21haW46IFwibGVnb25uYXJ5LmZpcmViYXNlYXBwLmNvbVwiLFxuICAgICAgICAgICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9sZWdvbm5hcnkuZmlyZWJhc2Vpby5jb21cIixcbiAgICAgICAgICAgIHN0b3JhZ2VCdWNrZXQ6IFwiXCIsXG4gICAgICAgIH0gXG5cbiAgICAgICAgdGhpcy5hcHAgPSBmaXJlYmFzZS5pbml0aWFsaXplQXBwKHRoaXMuY29uZmlnKTtcbiAgICB9XG5cblxufVxuXG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBDbGFzcyBmb3IgZ2VuZXJpYyBtYW5hZ2VtZW50IG9mIEF1dGhlbnRpY2F0aW9uIHdpdGggZmlyZWJhc2UuXG4gKiBcbiAqIEl0IHRha2VzIGNhcmUgb2YgaHRtbCB0byBoaWRlIG9yIHNob3dcbiAqL1xuZXhwb3J0IGNsYXNzIEZpcmVCYXNlQXV0aHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpe1xuICAgICAgXG4gICAgICAgIGxldCB1aUNvbmZpZyA9IHtcbiAgICAgICAgICAgICdjYWxsYmFja3MnOiB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHNpZ25lZCBpbi5cbiAgICAgICAgICAgICAgICAnc2lnbkluU3VjY2Vzcyc6IGZ1bmN0aW9uKHVzZXIsIGNyZWRlbnRpYWwsIHJlZGlyZWN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCByZWRpcmVjdC5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBPcGVucyBJRFAgUHJvdmlkZXJzIHNpZ24taW4gZmxvdyBpbiBhIHBvcHVwLlxuICAgICAgICAgICAgJ3NpZ25JbkZsb3cnOiAncG9wdXAnLFxuICAgICAgICAgICAgJ3NpZ25Jbk9wdGlvbnMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICAgICAgICBzY29wZXM6IFsnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9wbHVzLmxvZ2luJ11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguRmFjZWJvb2tBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UuYXV0aC5Ud2l0dGVyQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguR2l0aHViQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguRW1haWxBdXRoUHJvdmlkZXIuUFJPVklERVJfSURcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAvLyBUZXJtcyBvZiBzZXJ2aWNlIHVybC5cbiAgICAgICAgICAgICd0b3NVcmwnOiAnaHR0cHM6Ly9nZGduYW50ZXMuY29tJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVpID0gbmV3IGZpcmViYXNldWkuYXV0aC5BdXRoVUkoZmlyZWJhc2UuYXV0aCgpKTtcbiAgICAgICAgdGhpcy51aS5zdGFydCgnI2ZpcmViYXNldWktYXV0aC1jb250YWluZXInLCB1aUNvbmZpZyk7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIHRoaXMuaWREaXZMb2dpbiA9IGNvbmZpZy5pZERpdkxvZ2luO1xuICAgICAgICB0aGlzLmlkTmV4dERpdiA9IGNvbmZpZy5pZE5leHREaXY7XG4gICAgICAgIHRoaXMuaWRMb2dvdXQgPSBjb25maWcuaWRMb2dvdXQ7XG5cbiAgICAgICAgLy8gT3B0aW9uYWxzXG4gICAgICAgIHRoaXMuaWRJbWcgPSBjb25maWcuaWRJbWcgPyBjb25maWcuaWRJbWcgOiBudWxsO1xuICAgICAgICB0aGlzLmlkRGlzcGxheU5hbWUgPSBjb25maWcuaWREaXNwbGF5TmFtZSA/IGNvbmZpZy5pZERpc3BsYXlOYW1lIDogbnVsbDtcblxuXG4gICAgICAgIGZpcmViYXNlLmF1dGgoKS5vbkF1dGhTdGF0ZUNoYW5nZWQodGhpcy5fY2hlY2tDYWxsQmFja0NvbnRleHQuYmluZCh0aGlzKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tDYWxsQmFja0Vycm9yQ29udGV4dC5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQgPSBudWxsO1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PiAgZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW4gY2FzZSBvZiBlcnJvclxuICAgICAqL1xuICAgIF9jaGVja0NhbGxCYWNrRXJyb3JDb250ZXh0KGVycm9yKXtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgbWV0aG9kIHdpdGggdGhlIHN0YXRlIG9mIGNvbm5lY3Rpb25cbiAgICAgKiBcbiAgICAgKiBBY2NvcmRpbmcgdG8gJ3VzZXInLCBpdCB3aWxsIHNob3cgb3IgaGlkZSBzb21lIGh0bWwgYXJlYXNcbiAgICAgKi9cbiAgICBfY2hlY2tDYWxsQmFja0NvbnRleHQodXNlcil7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIGlmICh1c2VyKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWREaXZMb2dpbikuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTmV4dERpdikucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmlkSW1nKXtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zcmMgPSB1c2VyLnBob3RvVVJMO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaWREaXNwbGF5TmFtZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpc3BsYXlOYW1lKS5pbm5lckhUTUwgPSB1c2VyLmRpc3BsYXlOYW1lOzsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpdkxvZ2luKS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWROZXh0RGl2KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc3JjID0gXCJcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGlzcGxheU5hbWUpLmlubmVySFRNTCA9IFwiTm9uIENvbm50ZWN0w6lcIjsgICAgICAgICAgICBcblxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuY2JBdXRoQ2hhbmdlZCl7XG4gICAgICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQodXNlcik7XG4gICAgICAgIH1cbiAgICAgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdHJhdGlvbiBvZiBjYWxsYmFjayBmb3IgZnV0dXIgaW50ZXJhY3Rpb24uXG4gICAgICogVGhlIGNhbGxiYWNrIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB3aXRoIHVzZXIgYXMgcGFyYW1ldGVyXG4gICAgICovXG4gICAgb25BdXRoU3RhdGVDaGFuZ2VkKGNiKXtcbiAgICAgICAgdGhpcy5jYkF1dGhDaGFuZ2VkID0gY2I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCBsb2dnZWQgdXNlclxuICAgICAqL1xuICAgIGRpc3BsYXlOYW1lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXIgPyB0aGlzLnVzZXIuZGlzcGxheU5hbWUgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGlkIG9mIHRoZSBjdXJyZW50IGxvZ2dlZCB1c2VyXG4gICAgICovXG4gICAgdXNlcklkKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXIgPyB0aGlzLnVzZXIudWlkIDogbnVsbDtcbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0NvbG9yTHVtaW5hbmNlfSBmcm9tICcuLi9jb21tb24vdXRpbC5qcyc7XG5cbi8qKlxuICogQ2lyY2xlIExlZ28gY2xhc3NcbiAqIFRoZSBjaXJjbGUgaXMgY29tcG9zZWQgb2YgMiBjaXJjbGUgKG9uIHRoZSBzaGFkb3csIGFuZCB0aGUgb3RoZXIgb25lIGZvciB0aGUgdG9wKVxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBDaXJjbGV7XG4gICAgY29uc3RydWN0b3IoY2VsbFNpemUsIGNvbG9yKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMgPSBuZXcgZmFicmljLkNpcmNsZSh7XG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNSxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjBweCAycHggMTBweCByZ2JhKDAsMCwwLDAuMilcIlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4ID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDQsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IGZhYnJpYy5UZXh0KCdHREcnLCB7XG4gICAgICAgICAgICBmb250U2l6ZTogY2VsbFNpemUgLyA1LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBzdHJva2U6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMCksXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdyb3VwID0gbmV3IGZhYnJpYy5Hcm91cChbdGhpcy5jaXJjbGVCYXNpY0V0eCwgdGhpcy5jaXJjbGVCYXNpYywgdGhpcy50ZXh0XSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBGYWJyaWNKUyBlbGVtZW50XG4gICAgICovXG4gICAgZ2V0IGNhbnZhc0VsdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDsgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgY2lyY2xlXG4gICAgICovXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljLnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSk7XG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHguc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSkpO1xuICAgICAgICB0aGlzLnRleHQuc2V0KHtcbiAgICAgICAgICAgIGZpbGwgOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxuICAgICAgICAgICAgc3Ryb2tlIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKVxuICAgICAgICB9KTtcbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi9jaXJjbGUuanMnO1xuXG4vKipcbiAqIFBlZyBMZWdvIGNsYXNzXG4gKiBUaGUgcGVnIGlzIGNvbXBvc2VkIG9mIG4gY2lyY2xlIGZvciBhIGRpbWVuc2lvbiB0aGF0IGRlcGVuZCBvbiB0aGUgc2l6ZSBwYXJhbWV0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFBlZ3tcbiAgICBjb25zdHJ1Y3Rvcih7c2l6ZSA9IHtjb2wgOiAxLCByb3cgOiAxfSwgY2VsbFNpemUgPSAwLCBjb2xvciA9ICcjRkZGJywgbGVmdCA9IDAsIHRvcCA9IDAsIGFuZ2xlID0gMH0pe1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmlkID0gYFBlZyR7c2l6ZX0tJHtEYXRlLm5vdygpfWA7XG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG9SZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlIHx8IDA7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkgPSBbXTtcblxuXG4gICAgICAgIHRoaXMucmVjdEJhc2ljID0gbmV3IGZhYnJpYy5SZWN0KHtcbiAgICAgICAgICAgIHdpZHRoOiBjZWxsU2l6ZSAqIHNpemUuY29sLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZSAqIHNpemUucm93LFxuICAgICAgICAgICAgZmlsbDogY29sb3IsXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiNXB4IDVweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgbGV0IGFycmF5RWx0cyA9IFt0aGlzLnJlY3RCYXNpY107XG4gICAgICAgIGxldCBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTsgICAgICAgXG4gICAgICAgIC8vIEFjY29yZGluZyB0byB0aGUgc2l6ZSwgd2UgZG9uJ3QgcGxhY2UgdGhlIGNpcmNsZXMgYXQgdGhlIHNhbWUgcGxhY2VcbiAgICAgICAgaWYgKHNpemUuY29sID09PSAyKXtcbiAgICAgICAgICAgIC8vIEZvciBhIHJlY3RhbmdsZSBvciBhIGJpZyBTcXVhcmVcbiAgICAgICAgICAgIC8vIFdlIHVwZGF0ZSB0aGUgcm93IHBvc2l0aW9uc1xuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoLWNlbGxTaXplICs1KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDUsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LmZvckVhY2goKGNpcmNsZSk9PmFycmF5RWx0cy5wdXNoKGNpcmNsZS5jYW52YXNFbHQpKTtcblxuICAgICAgICAvLyBUaGUgcGVnIGlzIGxvY2tlZCBpbiBhbGwgcG9zaXRpb25cbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoYXJyYXlFbHRzLCB7XG4gICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXG4gICAgICAgICAgICB0b3A6IHRoaXMudG9wLFxuICAgICAgICAgICAgYW5nbGU6IHRoaXMuYW5nbGUsXG4gICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXZSBhZGQgdG8gRmFicmljRWxlbWVudCBhIHJlZmVyZW5jZSB0byB0aGUgY3VyZW50IHBlZ1xuICAgICAgICB0aGlzLmdyb3VwLnBhcmVudFBlZyA9IHRoaXM7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBUaGUgRmFicmljSlMgZWxlbWVudFxuICAgIGdldCBjYW52YXNFbHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7XG4gICAgfVxuXG4gICAgLy8gVHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgcmVwbGFjZWRcbiAgICBnZXQgcmVwbGFjZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5pc1JlcGxhY2VcbiAgICB9XG5cbiAgICAvLyBTZXR0ZXIgZm9yIGlzUmVwbGFjZSBwYXJhbVxuICAgIHNldCByZXBsYWNlKHJlcGxhY2Upe1xuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IHJlcGxhY2U7XG4gICAgfVxuXG4gICAgLy8gQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgcGVnXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMucmVjdEJhc2ljLnNldCgnZmlsbCcsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT4gY2lyY2xlLmNoYW5nZUNvbG9yKGNvbG9yKSk7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBNb3ZlIHRoZSBwZWcgdG8gZGVzaXJlIHBvc2l0aW9uXG4gICAgbW92ZShsZWZ0LCB0b3Ape1xuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xuICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICBsZWZ0IDogbGVmdFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSb3RhdGUgdGhlIHBlZyB0byB0aGUgZGVzaXJlIGFuZ2xlXG4gICAgcm90YXRlKGFuZ2xlKXtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XG4gICAgICAgICAgICBhbmdsZSA6IGFuZ2xlXG4gICAgICAgIH0pO1xuICAgIH1cblxufSJdfQ==
