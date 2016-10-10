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
            //this.canvas.renderOnAddRemove = false;
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
            /*this.canvas.renderAll();
            this.canvas.renderOnAddRemove = true;
            // We transform the canvas to a base64 image in order to save performances.
            let url = this.canvas.toDataURL();
            this.canvas.clear();     
            this.canvas.setBackgroundImage(url,this.canvas.renderAll.bind(this.canvas), {
                originX: 'left',
                originY: 'top',
                width: this.canvas.width,
              height: this.canvas.height,
            });   */
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfbW9kZXJhdG9yLmpzIiwic3JjL3NjcmlwdHMvY2FudmFzL2xlZ29DYW52YXMuanMiLCJzcmMvc2NyaXB0cy9jb21tb24vY29uc3QuanMiLCJzcmMvc2NyaXB0cy9jb21tb24vbGVnb0NvbG9ycy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi91dGlsLmpzIiwic3JjL3NjcmlwdHMvZmlyZWJhc2UvZmlyZWJhc2UuanMiLCJzcmMvc2NyaXB0cy9maXJlYmFzZS9maXJlYmFzZUF1dGguanMiLCJzcmMvc2NyaXB0cy9sZWdvX3NoYXBlL2NpcmNsZS5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvcGVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsQ0FBQyxZQUFZOztBQUVULFFBQUksV0FBVyxLQUFmO0FBQUEsUUFBc0I7QUFDckIsbUJBQWUsSUFEaEI7QUFBQSxRQUNzQjtBQUNyQixpQkFBYSxJQUZkO0FBQUEsUUFFcUI7QUFDcEIsaUJBQWEsSUFIZDtBQUFBLFFBR29CO0FBQ25CLGtCQUFjLElBSmY7QUFBQSxRQUlxQjtBQUNwQixzQkFBa0IsSUFMbkI7O0FBUUEsYUFBUyxRQUFULEdBQW1CO0FBQ2YscUJBQWEsK0JBQW1CLFlBQW5CLEVBQWlDLEtBQWpDLENBQWI7QUFDQTtBQUNIOztBQUdELGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIsdUJBQWUsZ0NBQXNCLEdBQXJDO0FBQ0E7QUFDQSxZQUFJLGVBQWUsK0JBQWlCO0FBQ2hDLHdCQUFZLFdBRG9CO0FBRWhDLHVCQUFZLE1BRm9CO0FBR2hDLHNCQUFXO0FBSHFCLFNBQWpCLENBQW5COztBQU1BO0FBQ0EscUJBQWEsa0JBQWIsQ0FBZ0MsVUFBQyxJQUFELEVBQVM7QUFDckMsZ0JBQUksSUFBSixFQUFTO0FBQ0wsb0JBQUksQ0FBQyxRQUFMLEVB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LENBQVcsR0FBWCxDQUFlO0FBQ1gscUJBQUssR0FETTtBQUVYLHNCQUFPO0FBRkksYUFBZjtBQUlIOztBQUVEOzs7OytCQUNPLEssRUFBTTtBQUNULGlCQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZTtBQUNYLHVCQUFRO0FBREcsYUFBZjtBQUdIOzs7NEJBckNjO0FBQ1gsbUJBQU8sS0FBSyxLQUFaO0FBQ0g7O0FBRUQ7Ozs7NEJBQ2E7QUFDVCxtQkFBTyxLQUFLLFNBQVo7QUFDSDs7QUFFRDs7MEJBQ1ksTyxFQUFRO0FBQ2hCLGlCQUFLLFNBQUwsR0FBaUIsT0FBakI7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7RmlyZUJhc2VMZWdvQXBwfSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7RmlyZUJhc2VBdXRofSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlQXV0aC5qcyc7XG5pbXBvcnQge0xlZ29HcmlkQ2FudmFzfSBmcm9tICcuL2NhbnZhcy9sZWdvQ2FudmFzLmpzJztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGxldCBnYW1lSW5pdCA9IGZhbHNlLCAvLyB0cnVlIGlmIHdlIGluaXQgdGhlIGxlZ29HcmlkXG4gICAgIGZpcmVCYXNlTGVnbyA9IG51bGwsIC8vIHRoZSByZWZlcmVuY2Ugb2YgdGhlIGZpcmVCYXNlQXBwXG4gICAgIGxlZ29DYW52YXMgPSBudWxsLCAgLy8gVGhlIGxlZ29HcmlkXG4gICAgIGN1cnJlbnRLZXkgPSBudWxsLCAvLyBUaGUgY3VyZW50IGZpcmViYXNlIGRyYXcga2V5XG4gICAgIGN1cnJlbnREcmF3ID0gbnVsbCwgLy8gVGhlIGN1cmVudCBmaXJlYmFzZSBkcmF3XG4gICAgIHJlYWR5Rm9yTmV3RHJhdyA9IHRydWU7IFxuXG5cbiAgICBmdW5jdGlvbiBpbml0R2FtZSgpe1xuICAgICAgICBsZWdvQ2FudmFzID0gbmV3IExlZ29HcmlkQ2FudmFzKCdjYW52YXNEcmF3JywgZmFsc2UpO1xuICAgICAgICBnZXROZXh0RHJhdygpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgICAgZmlyZUJhc2VMZWdvID0gbmV3IEZpcmVCYXNlTGVnb0FwcCgpLmFwcDtcbiAgICAgICAgLy8gV2UgaW5pdCB0aGUgYXV0aGVudGljYXRpb24gb2JqZWN0IFxuICAgICAgICBsZXQgZmlyZUJhc2VBdXRoID0gbmV3IEZpcmVCYXNlQXV0aCh7XG4gICAgICAgICAgICBpZERpdkxvZ2luOiAnbG9naW4tbXNnJywgXG4gICAgICAgICAgICBpZE5leHREaXYgOiAnZ2FtZScsIFxuICAgICAgICAgICAgaWRMb2dvdXQgOiAnc2lnbm91dCdcbiAgICAgICAgfSk7IFxuXG4gICAgICAgIC8vIFdlIHN0YXJ0IHRvIHBsYXkgb25seSB3aGVuIHdlIGFyZSBsb2dnZWRcbiAgICAgICAgZmlyZUJhc2VBdXRoLm9uQXV0aFN0YXRlQ2hhbmdlZCgodXNlcik9PiB7XG4gICAgICAgICAgICBpZiAodXNlcil7XG4gICAgICAgICAgICAgICAgaWYgKCFnYW1lSW5pdCl7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaW5pdEdhbWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdoZW4gYSBkcmF3IGlzIGFkZCBvbiB0aGUgZmlyZWJhc2Ugb2JqZWN0LCB3ZSBsb29rIGF0IGl0XG4gICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZignZHJhdycpLm9uKCdjaGlsZF9hZGRlZCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChyZWFkeUZvck5ld0RyYXcpe1xuICAgICAgICAgICAgICAgIGdldE5leHREcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdoZW4gYSBkcmF3IGlzIHJlbW92ZWQgKGlmIGFuIG90aGVyIG1vZGVyYXRvciB2YWxpZGF0ZSBmb3IgZXhhbXBsZSkgb24gdGhlIGZpcmViYXNlIG9iamVjdCwgd2UgbG9vayBhdCBpdFxuICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoJ2RyYXcnKS5vbignY2hpbGRfcmVtb3ZlZCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIFdlIGZvcmNlIGEgbmV3IGRyYXcgYmVjYXVzZSB3ZSBhbHdheXMgc2hvdyB0aGUgZmlyc3QgZHJhd1xuICAgICAgICAgICAgZ2V0TmV4dERyYXcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2UgcmVmdXNlZCB0aGUgY3VycmVudCBkcmF3XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5TdWJtaXNzaW9uUmVmdXNlZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgV2hlbiB3ZSByZWZ1c2UgYW4gb2JqZWN0LCB3ZSB0YWtlIGEgc25hcHNob3Qgb2YgaXQgdG8gYXZvaWQgdGhlIHJlY29uc3RydWN0aW9uIG9mIHRoZSBjYW52YXMuXG5cbiAgICAgICAgICAgICAgICBXZSB0aGVuIGFsbG93IHRoZSBhdXRob3IgdG8gc2VlIGl0cyBkcmF3LlxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICBsZXQgZGF0YVVybCA9IGxlZ29DYW52YXMuc25hcHNob3QoKTtcbiAgICAgICAgICAgICBjdXJyZW50RHJhdy5kYXRhVXJsID0gZGF0YVVybDtcbiAgICAgICAgICAgICBkZWxldGUgY3VycmVudERyYXcuaW5zdHJ1Y3Rpb25zO1xuICAgICAgICAgICAgIC8vIHdlIG1vdmUgdGhlIGRyYXcgdG8gdGhlIHJlamVjdCBzdGF0ZVxuICAgICAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZihgZHJhdy8ke2N1cnJlbnRLZXl9YCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKGAvZHJhd1NhdmVkLyR7Y3VycmVudERyYXcudXNlcklkfWApLnB1c2goY3VycmVudERyYXcpO1xuICAgICAgICAgICAgIGxlZ29DYW52YXMucmVzZXRCb2FyZCgpO1xuICAgICAgICAgICAgIGdldE5leHREcmF3KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5TdWJtaXNzaW9uQWNjZXB0ZWQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIFdoZW4gd2UgYWNjZXB0IGEgZHJhdyB3ZSBtb3ZlIGl0IHRvIGFuIG90aGVyIGJyYW5jaCBvZiB0aGUgZmlyZWJhc2UgdHJlZS5cblxuICAgICAgICAgICAgICAgIFRoZSBjb3VudCBkb3duIHBhZ2UgY291bGQgYmUgdHJpZ2dlcmVkIHRvIHRoaXMgY2hhbmdlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZihgZHJhdy8ke2N1cnJlbnRLZXl9YCkucmVtb3ZlKCk7XG4gICAgICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoXCIvZHJhd1ZhbGlkYXRlZFwiKS5wdXNoKGN1cnJlbnREcmF3KTtcbiAgICAgICAgICAgIGxlZ29DYW52YXMucmVzZXRCb2FyZCgpO1xuICAgICAgICAgICAgZ2V0TmV4dERyYXcoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSB0aGUgbmV4dCBkcmF3IHRvIHNob3dcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXROZXh0RHJhdygpe1xuICAgICAgICAvLyBFYWNoIHRpbWUsIHdlIHRha2UgYSBzbmFwc2hvdCBvZiBkcmF3IGNoaWxkcyBhbmQgc2hvdyBpdCB0byB0aGUgbW9kZXJhdG9yXG4gICAgICAgIHJlYWR5Rm9yTmV3RHJhdyA9IGZhbHNlO1xuICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKCdkcmF3Jykub25jZSgndmFsdWUnLCBmdW5jdGlvbihzbmFwc2hvdCl7XG4gICAgICAgICAgICBpZiAoc25hcHNob3QgJiYgc25hcHNob3QudmFsKCkpe1xuICAgICAgICAgICAgICAgIGN1cnJlbnREcmF3ID0gc25hcHNob3Q7XG4gICAgICAgICAgICAgICAgbGV0IHNuYXBzaG90RmIgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzWzBdO1xuICAgICAgICAgICAgICAgIGN1cnJlbnREcmF3ID0gc25hcHNob3RGYltrZXlzWzBdXTtcbiAgICAgICAgICAgICAgICBsZWdvQ2FudmFzLmRyYXdJbnN0cnVjdGlvbnMoc25hcHNob3RGYltrZXlzWzBdXSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb3Bvc2l0aW9uLXRleHQnKS5pbm5lckhUTUwgPSBgUHJvcG9zaXRpb24gZGUgJHtjdXJyZW50RHJhdy51c2VyfWA7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZWFkeUZvck5ld0RyYXcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wb3NpdGlvbi10ZXh0JykuaW5uZXJIVE1MID0gXCJFbiBhdHRlbnRlIGRlIHByb3Bvc2l0aW9uXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIC8vIGVycm9yIGNhbGxiYWNrIHRyaWdnZXJlZCB3aXRoIFBFUk1JU1NJT05fREVOSUVEXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG5cbiAgICAvKiBTRVJWSUNFX1dPUktFUl9SRVBMQUNFXG4gICAgaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHsgICAgICAgIFxuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignLi9zZXJ2aWNlLXdvcmtlci1tb2RlcmF0b3IuanMnLCB7c2NvcGUgOiBsb2NhdGlvbi5wYXRobmFtZX0pLnRoZW4oZnVuY3Rpb24ocmVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmljZSBXb3JrZXIgUmVnaXN0ZXIgZm9yIHNjb3BlIDogJXMnLHJlZy5zY29wZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBTRVJWSUNFX1dPUktFUl9SRVBMQUNFICovXG59KSgpOyIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtQZWd9IGZyb20gJy4uL2xlZ29fc2hhcGUvcGVnLmpzJztcbmltcG9ydCB7Q2lyY2xlfSBmcm9tICcuLi9sZWdvX3NoYXBlL2NpcmNsZS5qcyc7XG5pbXBvcnQge05CX0NFTExTLCBIRUFERVJfSEVJR0hULCBCQVNFX0xFR09fQ09MT1IsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUn0gZnJvbSAnLi4vY29tbW9uL2NvbnN0LmpzJztcbmltcG9ydCB7bGVnb0Jhc2VDb2xvcn0gZnJvbSAnLi4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xuXG4vKipcbiAqIFxuICogQ2xhc3MgZm9yIENhbnZhcyBHcmlkXG4gKiBcbiAqL1xuZXhwb3J0IGNsYXNzIExlZ29HcmlkQ2FudmFzIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgc2hvd1Jvdykge1xuICAgICAgICAvLyBCYXNpYyBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXNFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIC8vIFNpemUgb2YgY2FudmFzXG4gICAgICAgIHRoaXMuY2FudmFzUmVjdCA9IHRoaXMuY2FudmFzRWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAvLyBJbmRpY2F0b3IgZm9yIHNob3dpbmcgdGhlIGZpcnN0IHJvdyB3aXRoIHBlZ3NcbiAgICAgICAgdGhpcy5zaG93Um93ID0gc2hvd1JvdztcbiAgICAgICAgdGhpcy5jYW52YXNFbHQud2lkdGggPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGg7XG4gICAgICAgIC8vIEFjY29yZGluZyB0byBzaG93Um93LCB3ZSB3aWxsIHNob3cgbW9kaWZ5IHRoZSBoZWFkZXIgSGVpZ2h0XG4gICAgICAgIHRoaXMuaGVhZGVySGVpZ2h0ID0gdGhpcy5zaG93Um93ID8gSEVBREVSX0hFSUdIVCA6IDA7XG4gICAgICAgIHRoaXMuY2FudmFzRWx0LmhlaWdodCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aCArIHRoaXMuaGVhZGVySGVpZ2h0O1xuICAgICAgICAvLyBXZSBjYWxjdWxhdGUgdGhlIGNlbGxzaXplIGFjY29yZGluZyB0byB0aGUgc3BhY2UgdGFrZW4gYnkgdGhlIGNhbnZhc1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gTWF0aC5yb3VuZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyBOQl9DRUxMUyk7XG5cbiAgICAgICAgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgRmFicmljIEpTIGxpYnJhcnkgd2l0aCBvdXIgY2FudmFzXG4gICAgICAgIHRoaXMuY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoaWQsIHsgc2VsZWN0aW9uOiBmYWxzZSB9KTtcbiAgICAgICAgLy8gT2JqZWN0IHRoYXQgcmVwcmVzZW50IHRoZSBwZWdzIG9uIHRoZSBmaXJzdCByb3dcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QgPSB7fTtcbiAgICAgICAgLy8gVGhlIGN1cnJlbnQgZHJhdyBtb2RlbCAoaW5zdHJ1Y3Rpb25zLCAuLi4pXG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9LFxuICAgICAgICAvLyBGbGFnIHRvIGRldGVybWluZSBpZiB3ZSBoYXZlIHRvIGNyZWF0ZSBhIG5ldyBicmlja1xuICAgICAgICB0aGlzLmNyZWF0ZU5ld0JyaWNrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudEJyaWNrID0gbnVsbDtcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBCQVNFX0xFR09fQ09MT1I7XG5cbiAgICAgICAgLy8gV2UgY3JlYXRlIHRoZSBjYW52YXNcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xuXG4gICAgICAgIC8vIElmIHdlIHNob3cgdGhlIHJvdywgd2UgaGF2ZSB0byBwbHVnIHRoZSBtb3ZlIG1hbmFnZW1lbnRcbiAgICAgICAgaWYgKHNob3dSb3cpIHtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ29iamVjdDpzZWxlY3RlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZyA/IG9wdGlvbnMudGFyZ2V0IDogbnVsbCk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignc2VsZWN0aW9uOmNsZWFyZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsKTtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ29iamVjdDptb3ZpbmcnLCAob3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwZWcgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWc7XG5cblxuICAgICAgICAgICAgICAgIGxldCBuZXdMZWZ0ID0gTWF0aC5yb3VuZChvcHRpb25zLnRhcmdldC5sZWZ0IC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplO1xuICAgICAgICAgICAgICAgIGxldCBuZXdUb3AgPSBNYXRoLnJvdW5kKChvcHRpb25zLnRhcmdldC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCkgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUgKyB0aGlzLmhlYWRlckhlaWdodDsgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGUgdG9wXG4gICAgICAgICAgICAgICAgbGV0IHRvcENvbXB1dGUgPSBuZXdUb3AgKyAocGVnLnNpemUucm93ID09PSAyIHx8IHBlZy5hbmdsZSA+IDAgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgICAgIGxldCBsZWZ0Q29tcHV0ZSA9IG5ld0xlZnQgKyAocGVnLnNpemUuY29sID09PSAyID8gdGhpcy5jZWxsU2l6ZSAqIDIgOiB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgICAgICBwZWcubW92ZShcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdCwgLy9sZWZ0XG4gICAgICAgICAgICAgICAgICAgIG5ld1RvcCAvLyB0b3BcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gV2Ugc3BlY2lmeSB0aGF0IHdlIGNvdWxkIHJlbW92ZSBhIHBlZyBpZiBvbmUgb2YgaXQncyBlZGdlIHRvdWNoIHRoZSBvdXRzaWRlIG9mIHRoZSBjYW52YXNcbiAgICAgICAgICAgICAgICBpZiAobmV3VG9wIDwgSEVBREVSX0hFSUdIVFxuICAgICAgICAgICAgICAgICAgICB8fCBuZXdMZWZ0IDwgMFxuICAgICAgICAgICAgICAgICAgICB8fCB0b3BDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICB8fCBsZWZ0Q29tcHV0ZSA+PSB0aGlzLmNhbnZhc0VsdC53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVsc2Ugd2UgY2hlY2sgd2UgY3JlYXRlIGEgbmV3IHBlZyAod2hlbiBhIHBlZyBlbnRlciBpbiB0aGUgZHJhdyBhcmVhKVxuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZWcucmVwbGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLmNvbCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKHBlZy5hbmdsZSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEsOTApLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlU3F1YXJlKDEpLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZWcucmVwbGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignbW91c2U6dXAnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEJyaWNrXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy50b1JlbW92ZVxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcucmVwbGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5icmlja01vZGVsW3RoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5pZF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZSh0aGlzLmN1cnJlbnRCcmljayk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGZvciBjaGFuZ2luZyB0aGUgY29sb3Igb2YgdGhlIGZpcnN0IHJvdyBcbiAgICAgKi9cbiAgICBjaGFuZ2VDb2xvcihjb2xvcikge1xuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IGNvbG9yOyAgICAgICBcbiAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdC5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VyaWFsaXplIHRoZSBjYW52YXMgdG8gYSBtaW5pbWFsIG9iamVjdCB0aGF0IGNvdWxkIGJlIHRyZWF0IGFmdGVyXG4gICAgICovXG4gICAgZXhwb3J0KHVzZXJOYW1lLCB1c2VySWQpIHtcbiAgICAgICAgbGV0IHJlc3VsdEFycmF5ID0gW107XG4gICAgICAgIC8vIFdlIGZpbHRlciB0aGUgcm93IHBlZ3NcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmJyaWNrTW9kZWwpXG4gICAgICAgICAgICAuZmlsdGVyKChrZXkpPT5rZXkgIT0gdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmlkXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5pZFxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC5yZWN0LmlkXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmlkKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGxldCBwZWdUbXAgPSB0aGlzLmJyaWNrTW9kZWxba2V5XTtcbiAgICAgICAgICAgIHJlc3VsdEFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHNpemU6IHBlZ1RtcC5zaXplLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBwZWdUbXAuY29sb3IsXG4gICAgICAgICAgICAgICAgYW5nbGU6IHBlZ1RtcC5hbmdsZSxcbiAgICAgICAgICAgICAgICB0b3A6IHBlZ1RtcC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBwZWdUbXAubGVmdCxcbiAgICAgICAgICAgICAgICBjZWxsU2l6ZSA6IHRoaXMuY2VsbFNpemVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVzZXI6IHVzZXJOYW1lLFxuICAgICAgICAgICAgdXNlcklkIDogdXNlcklkLFxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zOiByZXN1bHRBcnJheVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgZnJvbSBpbnRydWN0aW9ucyBhIGRyYXdcbiAgICAgKi9cbiAgICBkcmF3SW5zdHJ1Y3Rpb25zKGluc3RydWN0aW9uT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZXNldEJvYXJkKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIGluc3RydWN0aW9uT2JqZWN0Lmluc3RydWN0aW9ucy5mb3JFYWNoKChpbnN0cnVjdGlvbik9PntcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVCcmljayh7IHNpemUgOiBpbnN0cnVjdGlvbi5zaXplLCBcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA6IChpbnN0cnVjdGlvbi5sZWZ0IC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKGluc3RydWN0aW9uLnRvcCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlIDogaW5zdHJ1Y3Rpb24uYW5nbGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yIDogaW5zdHJ1Y3Rpb24uY29sb3JcbiAgICAgICAgICAgICAgICB9KS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICApOyAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFuIHRoZSBib2FyZCBhbmQgdGhlIHN0YXRlIG9mIHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICByZXNldEJvYXJkKCl7XG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9O1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpO1xuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XG4gICAgfVxuXG4gICAgLyoqIFxuICAgICAqIEdlbmVyYXRlIGEgQmFzZTY0IGltYWdlIGZyb20gdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIHNuYXBzaG90KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBQcml2YXRlcyBNZXRob2RzXG4gICAgICogXG4gICAgICovXG5cblxuICAgIC8qKlxuICAgICAqIERyYXcgdGhlIGJhc2ljIGdyaWQgXG4gICAgKi9cbiAgICBfZHJhd0dyaWQoc2l6ZSkgeyAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuc2hvd1Jvdyl7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlU3F1YXJlKDEpLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlUmVjdCgxKS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVJlY3QoMSw5MCkuY2FudmFzRWx0XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhbGwgdGhlIHdoaXRlIHBlZyBvZiB0aGUgZ3JpZFxuICAgICAqL1xuICAgIF9kcmF3V2hpdGVQZWcoc2l6ZSl7XG4gICAgICAgIC8vIFdlIHN0b3AgcmVuZGVyaW5nIG9uIGVhY2ggYWRkLCBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlc1xuICAgICAgICAvL3RoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLnJvdW5kKHNpemUgLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgbGV0IG1heFNpemUgPSBtYXggKiB0aGlzLmNlbGxTaXplO1xuICAgICAgICBmb3IgKHZhciByb3cgPTA7IHJvdyA8IG1heDsgcm93Kyspe1xuICAgICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbWF4OyBjb2wrKyApe1xuICAgICAgICAgICAgICAgICBsZXQgc3F1YXJlVG1wID0gbmV3IGZhYnJpYy5SZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogQkFDS0dST1VORF9MRUdPX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBjaXJjbGUgPSBuZXcgQ2lyY2xlKHRoaXMuY2VsbFNpemUsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUik7XG4gICAgICAgICAgICAgICAgY2lyY2xlLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBncm91cFRtcCA9IG5ldyBmYWJyaWMuR3JvdXAoW3NxdWFyZVRtcCwgY2lyY2xlLmNhbnZhc0VsdF0sIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5jZWxsU2l6ZSAqIGNvbCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLmNlbGxTaXplICogcm93ICsgdGhpcy5oZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChncm91cFRtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyp0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xuICAgICAgICAvLyBXZSB0cmFuc2Zvcm0gdGhlIGNhbnZhcyB0byBhIGJhc2U2NCBpbWFnZSBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlcy5cbiAgICAgICAgbGV0IHVybCA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpOyAgICAgXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEJhY2tncm91bmRJbWFnZSh1cmwsdGhpcy5jYW52YXMucmVuZGVyQWxsLmJpbmQodGhpcy5jYW52YXMpLCB7XG4gICAgICAgICAgICBvcmlnaW5YOiAnbGVmdCcsXG4gICAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgfSk7ICAgKi9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBob3Jpem9udGFsIG9yIHZlcnRpY2FsIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIF9jcmVhdGVSZWN0KHNpemVSZWN0LCBhbmdsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xuICAgICAgICAgICAgICAgIHNpemUgOiB7Y29sIDogMiAqIHNpemVSZWN0LCByb3cgOjEgKiBzaXplUmVjdH0sIFxuICAgICAgICAgICAgICAgIGxlZnQgOiBhbmdsZSA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gNCkgLSB0aGlzLmNlbGxTaXplKSA6ICgodGhpcy5jYW52YXNSZWN0LndpZHRoICogMyAvIDQpIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcbiAgICAgICAgICAgICAgICB0b3AgOiBhbmdsZSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHNxdWFyZSAoMXgxKSBvciAoMngyKVxuICAgICAqL1xuICAgIF9jcmVhdGVTcXVhcmUoc2l6ZVNxdWFyZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xuICAgICAgICAgICAgICAgIHNpemUgOiB7Y29sIDogMSAqIHNpemVTcXVhcmUsIHJvdyA6MSAqIHNpemVTcXVhcmV9LCBcbiAgICAgICAgICAgICAgICBsZWZ0OiBzaXplU3F1YXJlID09PSAyID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyAyKSAtICgyICogdGhpcy5jZWxsU2l6ZSkpIDogKHRoaXMuY2FudmFzUmVjdC53aWR0aCAtICh0aGlzLmNlbGxTaXplICogMS41KSksXG4gICAgICAgICAgICAgICAgdG9wIDogc2l6ZVNxdWFyZSA9PT0gMiA/IDEgOiAwLFxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJpYyBtZXRob2QgdGhhdCBjcmVhdGUgYSBwZWdcbiAgICAgKi9cbiAgICBfY3JlYXRlQnJpY2sob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLmNlbGxTaXplID0gdGhpcy5jZWxsU2l6ZTtcbiAgICAgICAgb3B0aW9ucy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgdGhpcy5sYXN0Q29sb3I7XG4gICAgICAgIGxldCBwZWcgPSBuZXcgUGVnKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmJyaWNrTW9kZWxbcGVnLmlkXSA9IHBlZztcbiAgICAgICAgLy8gV2UgaGF2ZSB0byB1cGRhdGUgdGhlIHJvd1NlbGVjdCBPYmplY3QgdG8gYmUgYWxzd2F5IHVwZGF0ZVxuICAgICAgICBpZiAob3B0aW9ucy5zaXplLnJvdyA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlID0gcGVnO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYW5nbGUpIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0ID0gcGVnO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuc2l6ZS5jb2wgPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QgPSBwZWc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUgPSBwZWc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBlZztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluaXQgdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIF9kcmF3Q2FudmFzKCkge1xuICAgICAgICB0aGlzLl9kcmF3V2hpdGVQZWcodGhpcy5jYW52YXNSZWN0LndpZHRoKTtcbiAgICAgICAgdGhpcy5fZHJhd0dyaWQodGhpcy5jYW52YXNSZWN0LndpZHRoLCBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKSk7XG4gICAgfVxuICAgIFxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbi8vIE51bWJlciBvZiBjZWxsIG9uIHRoZSBncmlkXG5leHBvcnQgY29uc3QgTkJfQ0VMTFMgPSAxNTtcblxuLy8gSGVpZ2h0IG9mIHRoZSBoZWFkZXJcbmV4cG9ydCBjb25zdCBIRUFERVJfSEVJR0hUID0gd2luZG93LnNjcmVlbi53aWR0aCA8PSA3NjggID8gNjAgOiAxMDA7XG5cbi8vIEZpcnN0IGNvbG9yIHRvIHVzZVxuZXhwb3J0IGNvbnN0IEJBU0VfTEVHT19DT0xPUiA9IFwiIzBkNjlmMlwiO1xuXG4vLyBNZWRpdW0gU3RvbmUgR3JleSBcbmNvbnN0IENPTE9SXzE5NCA9IFwiI2EzYTJhNFwiO1xuXG4vLyBMaWdodCBTdG9uZSBHcmV5XG5jb25zdCBDT0xPUl8yMDggPSBcIiNlNWU0ZGVcIjsgXG5cbi8vIEJhY2tncm91bmQgY29sb3IgdXNlZFxuZXhwb3J0IGNvbnN0IEJBQ0tHUk9VTkRfTEVHT19DT0xPUiA9IENPTE9SXzIwODsiLCIndXNlIHN0cmljdCdcblxuLypcbiogQ29sb3JzIGZyb20gXG4qIGh0dHA6Ly9sZWdvLndpa2lhLmNvbS93aWtpL0NvbG91cl9QYWxldHRlIFxuKiBBbmQgaHR0cDovL3d3dy5wZWVyb24uY29tL2NnaS1iaW4vaW52Y2dpcy9jb2xvcmd1aWRlLmNnaVxuKiBPbmx5IFNob3cgdGhlIGNvbG9yIHVzZSBzaW5jZSAyMDEwXG4qKi8gXG5leHBvcnQgY29uc3QgTEVHT19DT0xPUlMgPSBbXG4gICAgJ3JnYigyNDUsIDIwNSwgNDcpJywgLy8yNCwgQnJpZ2h0IFllbGxvdyAqXG4gICAgJ3JnYigyNTMsIDIzNCwgMTQwKScsIC8vMjI2LCBDb29sIFllbGxvdyAqXG4gICAgJ3JnYigyMTgsIDEzMywgNjQpJywgLy8xMDYsIEJyaWdodCBPcmFuZ2UgKlxuICAgICdyZ2IoMjMyLCAxNzEsIDQ1KScsIC8vMTkxLCBGbGFtZSBZZWxsb3dpc2ggT3JhbmdlICpcbiAgICAncmdiKDE5NiwgNDAsIDI3KScsIC8vMjEsIEJyaWdodCBSZWQgKlxuICAgICdyZ2IoMTIzLCA0NiwgNDcpJywgLy8xNTQsIERhcmsgUmVkICpcbiAgICAncmdiKDIwNSwgOTgsIDE1MiknLCAvLzIyMSwgQnJpZ2h0IFB1cnBsZSAqXG4gICAgJ3JnYigyMjgsIDE3MywgMjAwKScsIC8vMjIyLCBMaWdodCBQdXJwbGUgKlxuICAgICdyZ2IoMTQ2LCA1NywgMTIwKScsIC8vMTI0LCBCcmlnaHQgUmVkZGlzaCBWaW9sZXQgKlxuICAgICdyZ2IoNTIsIDQzLCAxMTcpJywgLy8yNjgsIE1lZGl1bSBMaWxhYyAqXG4gICAgJ3JnYigxMywgMTA1LCAyNDIpJywgLy8yMywgQnJpZ2h0IEJsdWUgKlxuICAgICdyZ2IoMTU5LCAxOTUsIDIzMyknLCAvLzIxMiwgTGlnaHQgUm95YWwgQmx1ZSAqXG4gICAgJ3JnYigxMTAsIDE1MywgMjAxKScsIC8vMTAyLCBNZWRpdW0gQmx1ZSAqXG4gICAgJ3JnYigzMiwgNTgsIDg2KScsIC8vMTQwLCBFYXJ0aCBCbHVlICpcbiAgICAncmdiKDExNiwgMTM0LCAxNTYpJywgLy8xMzUsIFNhbmQgQmx1ZSAqXG4gICAgJ3JnYig0MCwgMTI3LCA3MCknLCAvLzI4LCBEYXJrIEdyZWVuICpcbiAgICAncmdiKDc1LCAxNTEsIDc0KScsIC8vMzcsIEJpcmdodCBHcmVlbiAqXG4gICAgJ3JnYigxMjAsIDE0NCwgMTI5KScsIC8vMTUxLCBTYW5kIEdyZWVuICpcbiAgICAncmdiKDM5LCA3MCwgNDQpJywgLy8xNDEsIEVhcnRoIEdyZWVuICpcbiAgICAncmdiKDE2NCwgMTg5LCA3MCknLCAvLzExOSwgQnJpZ2h0IFllbGxvd2lzaC1HcmVlbiAqIFxuICAgICdyZ2IoMTA1LCA2NCwgMzkpJywgLy8xOTIsIFJlZGRpc2ggQnJvd24gKlxuICAgICdyZ2IoMjE1LCAxOTcsIDE1MyknLCAvLzUsIEJyaWNrIFllbGxvdyAqIFxuICAgICdyZ2IoMTQ5LCAxMzgsIDExNSknLCAvLzEzOCwgU2FuZCBZZWxsb3cgKlxuICAgICdyZ2IoMTcwLCAxMjUsIDg1KScsIC8vMzEyLCBNZWRpdW0gTm91Z2F0ICogICAgXG4gICAgJ3JnYig0OCwgMTUsIDYpJywgLy8zMDgsIERhcmsgQnJvd24gKlxuICAgICdyZ2IoMjA0LCAxNDIsIDEwNCknLCAvLzE4LCBOb3VnYXQgKlxuICAgICdyZ2IoMjQ1LCAxOTMsIDEzNyknLCAvLzI4MywgTGlnaHQgTm91Z2F0ICpcbiAgICAncmdiKDE2MCwgOTUsIDUyKScsIC8vMzgsIERhcmsgT3JhbmdlICpcbiAgICAncmdiKDI0MiwgMjQzLCAyNDIpJywgLy8xLCBXaGl0ZSAqXG4gICAgJ3JnYigyMjksIDIyOCwgMjIyKScsIC8vMjA4LCBMaWdodCBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDE2MywgMTYyLCAxNjQpJywgLy8xOTQsIE1lZGl1bSBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDk5LCA5NSwgOTcpJywgLy8xOTksIERhcmsgU3RvbmUgR3JleSAqXG4gICAgJ3JnYigyNywgNDIsIDUyKScsIC8vMjYsIEJsYWNrICogICAgICAgIFxuXTsiLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIGEgdmFyaWF0aW9uIG9mIGNvbG9yXG4gKiBcbiAqIEZyb20gOiBodHRwczovL3d3dy5zaXRlcG9pbnQuY29tL2phdmFzY3JpcHQtZ2VuZXJhdGUtbGlnaHRlci1kYXJrZXItY29sb3IvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDb2xvckx1bWluYW5jZShoZXgsIGx1bSkge1xuXG4gICAgICAgIC8vIHZhbGlkYXRlIGhleCBzdHJpbmdcbiAgICAgICAgaGV4ID0gU3RyaW5nKGhleCkucmVwbGFjZSgvW14wLTlhLWZdL2dpLCAnJyk7XG4gICAgICAgIGlmIChoZXgubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xuICAgICAgICB9XG4gICAgICAgIGx1bSA9IGx1bSB8fCAwO1xuXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcbiAgICAgICAgdmFyIHJnYiA9IFwiI1wiLCBjLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpICogMiwgMiksIDE2KTtcbiAgICAgICAgICAgIGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICByZ2IgKz0gKFwiMDBcIiArIGMpLnN1YnN0cihjLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmdiO1xufSIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEJhc2ljIEZpcmViYXNlIGhlbHBlclxuICovXG5leHBvcnQgY2xhc3MgRmlyZUJhc2VMZWdvQXBwe1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIC8vIENvbmZpZ3VyYXRpb24gb2YgdGhlIGFwcGxpY2F0aW9uLCBZb3Ugc2hvdWxkIHVwZGF0ZSB3aXRoIHlvdXIgS2V5cyAhXG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICAgICAgYXBpS2V5OiBcIkFJemFTeURyOVI4NXROamZLV2RkVzEtTjdYSnBBaEdxWE5HYUo1a1wiLFxuICAgICAgICAgICAgYXV0aERvbWFpbjogXCJsZWdvbm5hcnkuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgICAgICAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL2xlZ29ubmFyeS5maXJlYmFzZWlvLmNvbVwiLFxuICAgICAgICAgICAgc3RvcmFnZUJ1Y2tldDogXCJcIixcbiAgICAgICAgfSBcblxuICAgICAgICB0aGlzLmFwcCA9IGZpcmViYXNlLmluaXRpYWxpemVBcHAodGhpcy5jb25maWcpO1xuICAgIH1cblxuXG59XG5cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIENsYXNzIGZvciBnZW5lcmljIG1hbmFnZW1lbnQgb2YgQXV0aGVudGljYXRpb24gd2l0aCBmaXJlYmFzZS5cbiAqIFxuICogSXQgdGFrZXMgY2FyZSBvZiBodG1sIHRvIGhpZGUgb3Igc2hvd1xuICovXG5leHBvcnQgY2xhc3MgRmlyZUJhc2VBdXRoe1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyl7XG4gICAgICBcbiAgICAgICAgbGV0IHVpQ29uZmlnID0ge1xuICAgICAgICAgICAgJ2NhbGxiYWNrcyc6IHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgc2lnbmVkIGluLlxuICAgICAgICAgICAgICAgICdzaWduSW5TdWNjZXNzJzogZnVuY3Rpb24odXNlciwgY3JlZGVudGlhbCwgcmVkaXJlY3RVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90IHJlZGlyZWN0LlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIE9wZW5zIElEUCBQcm92aWRlcnMgc2lnbi1pbiBmbG93IGluIGEgcG9wdXAuXG4gICAgICAgICAgICAnc2lnbkluRmxvdyc6ICdwb3B1cCcsXG4gICAgICAgICAgICAnc2lnbkluT3B0aW9ucyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHJvdmlkZXI6IGZpcmViYXNlLmF1dGguR29vZ2xlQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAgICAgICAgIHNjb3BlczogWydodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3BsdXMubG9naW4nXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UuYXV0aC5GYWNlYm9va0F1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLlR3aXR0ZXJBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UuYXV0aC5HaXRodWJBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UuYXV0aC5FbWFpbEF1dGhQcm92aWRlci5QUk9WSURFUl9JRFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIC8vIFRlcm1zIG9mIHNlcnZpY2UgdXJsLlxuICAgICAgICAgICAgJ3Rvc1VybCc6ICdodHRwczovL2dkZ25hbnRlcy5jb20nXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudWkgPSBuZXcgZmlyZWJhc2V1aS5hdXRoLkF1dGhVSShmaXJlYmFzZS5hdXRoKCkpO1xuICAgICAgICB0aGlzLnVpLnN0YXJ0KCcjZmlyZWJhc2V1aS1hdXRoLWNvbnRhaW5lcicsIHVpQ29uZmlnKTtcbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZERpdkxvZ2luID0gY29uZmlnLmlkRGl2TG9naW47XG4gICAgICAgIHRoaXMuaWROZXh0RGl2ID0gY29uZmlnLmlkTmV4dERpdjtcbiAgICAgICAgdGhpcy5pZExvZ291dCA9IGNvbmZpZy5pZExvZ291dDtcblxuICAgICAgICAvLyBPcHRpb25hbHNcbiAgICAgICAgdGhpcy5pZEltZyA9IGNvbmZpZy5pZEltZyA/IGNvbmZpZy5pZEltZyA6IG51bGw7XG4gICAgICAgIHRoaXMuaWREaXNwbGF5TmFtZSA9IGNvbmZpZy5pZERpc3BsYXlOYW1lID8gY29uZmlnLmlkRGlzcGxheU5hbWUgOiBudWxsO1xuXG5cbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZCh0aGlzLl9jaGVja0NhbGxCYWNrQ29udGV4dC5iaW5kKHRoaXMpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja0NhbGxCYWNrRXJyb3JDb250ZXh0LmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY2JBdXRoQ2hhbmdlZCA9IG51bGw7XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZExvZ291dCkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+ICBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbiBjYXNlIG9mIGVycm9yXG4gICAgICovXG4gICAgX2NoZWNrQ2FsbEJhY2tFcnJvckNvbnRleHQoZXJyb3Ipe1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBtZXRob2Qgd2l0aCB0aGUgc3RhdGUgb2YgY29ubmVjdGlvblxuICAgICAqIFxuICAgICAqIEFjY29yZGluZyB0byAndXNlcicsIGl0IHdpbGwgc2hvdyBvciBoaWRlIHNvbWUgaHRtbCBhcmVhc1xuICAgICAqL1xuICAgIF9jaGVja0NhbGxCYWNrQ29udGV4dCh1c2VyKXtcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgaWYgKHVzZXIpe1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpdkxvZ2luKS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWROZXh0RGl2KS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZExvZ291dCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuaWRJbWcpe1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnNyYyA9IHVzZXIucGhvdG9VUkw7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pZERpc3BsYXlOYW1lKXtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGlzcGxheU5hbWUpLmlubmVySFRNTCA9IHVzZXIuZGlzcGxheU5hbWU7OyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGl2TG9naW4pLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZE5leHREaXYpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZExvZ291dCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zcmMgPSBcIlwiO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWREaXNwbGF5TmFtZSkuaW5uZXJIVE1MID0gXCJOb24gQ29ubnRlY3TDqVwiOyAgICAgICAgICAgIFxuXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5jYkF1dGhDaGFuZ2VkKXtcbiAgICAgICAgICAgIHRoaXMuY2JBdXRoQ2hhbmdlZCh1c2VyKTtcbiAgICAgICAgfVxuICAgICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0cmF0aW9uIG9mIGNhbGxiYWNrIGZvciBmdXR1ciBpbnRlcmFjdGlvbi5cbiAgICAgKiBUaGUgY2FsbGJhY2sgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdpdGggdXNlciBhcyBwYXJhbWV0ZXJcbiAgICAgKi9cbiAgICBvbkF1dGhTdGF0ZUNoYW5nZWQoY2Ipe1xuICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQgPSBjYjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IGxvZ2dlZCB1c2VyXG4gICAgICovXG4gICAgZGlzcGxheU5hbWUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlciA/IHRoaXMudXNlci5kaXNwbGF5TmFtZSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgaWQgb2YgdGhlIGN1cnJlbnQgbG9nZ2VkIHVzZXJcbiAgICAgKi9cbiAgICB1c2VySWQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlciA/IHRoaXMudXNlci51aWQgOiBudWxsO1xuICAgIH1cbn0iLCIndXNlIHN0cmljdCdcbmltcG9ydCB7Q29sb3JMdW1pbmFuY2V9IGZyb20gJy4uL2NvbW1vbi91dGlsLmpzJztcblxuLyoqXG4gKiBDaXJjbGUgTGVnbyBjbGFzc1xuICogVGhlIGNpcmNsZSBpcyBjb21wb3NlZCBvZiAyIGNpcmNsZSAob24gdGhlIHNoYWRvdywgYW5kIHRoZSBvdGhlciBvbmUgZm9yIHRoZSB0b3ApXG4gKiBcbiAqL1xuZXhwb3J0IGNsYXNzIENpcmNsZXtcbiAgICBjb25zdHJ1Y3RvcihjZWxsU2l6ZSwgY29sb3Ipe1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYyA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA1LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiMHB4IDJweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHggPSBuZXcgZmFicmljLkNpcmNsZSh7XG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNCxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRleHQgPSBuZXcgZmFicmljLlRleHQoJ0dERycsIHtcbiAgICAgICAgICAgIGZvbnRTaXplOiBjZWxsU2l6ZSAvIDUsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHN0cm9rZTogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKSxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKFt0aGlzLmNpcmNsZUJhc2ljRXR4LCB0aGlzLmNpcmNsZUJhc2ljLCB0aGlzLnRleHRdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIEZhYnJpY0pTIGVsZW1lbnRcbiAgICAgKi9cbiAgICBnZXQgY2FudmFzRWx0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwOyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBjaXJjbGVcbiAgICAgKi9cbiAgICBjaGFuZ2VDb2xvcihjb2xvcil7XG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMuc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpKTtcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eC5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSk7XG4gICAgICAgIHRoaXMudGV4dC5zZXQoe1xuICAgICAgICAgICAgZmlsbCA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXG4gICAgICAgICAgICBzdHJva2UgOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApXG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCIndXNlIHN0cmljdCdcbmltcG9ydCB7Q2lyY2xlfSBmcm9tICcuL2NpcmNsZS5qcyc7XG5cbi8qKlxuICogUGVnIExlZ28gY2xhc3NcbiAqIFRoZSBwZWcgaXMgY29tcG9zZWQgb2YgbiBjaXJjbGUgZm9yIGEgZGltZW5zaW9uIHRoYXQgZGVwZW5kIG9uIHRoZSBzaXplIHBhcmFtZXRlclxuICovXG5leHBvcnQgY2xhc3MgUGVne1xuICAgIGNvbnN0cnVjdG9yKHtzaXplID0ge2NvbCA6IDEsIHJvdyA6IDF9LCBjZWxsU2l6ZSA9IDAsIGNvbG9yID0gJyNGRkYnLCBsZWZ0ID0gMCwgdG9wID0gMCwgYW5nbGUgPSAwfSl7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuaWQgPSBgUGVnJHtzaXplfS0ke0RhdGUubm93KCl9YDtcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50b1JlbW92ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLmFuZ2xlID0gYW5nbGUgfHwgMDtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheSA9IFtdO1xuXG5cbiAgICAgICAgdGhpcy5yZWN0QmFzaWMgPSBuZXcgZmFicmljLlJlY3Qoe1xuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplICogc2l6ZS5jb2wsXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplICogc2l6ZS5yb3csXG4gICAgICAgICAgICBmaWxsOiBjb2xvcixcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBjZW50ZXJlZFJvdGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgc2hhZG93IDogXCI1cHggNXB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCIgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBsZXQgYXJyYXlFbHRzID0gW3RoaXMucmVjdEJhc2ljXTtcbiAgICAgICAgbGV0IGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApOyAgICAgICBcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHRoZSBzaXplLCB3ZSBkb24ndCBwbGFjZSB0aGUgY2lyY2xlcyBhdCB0aGUgc2FtZSBwbGFjZVxuICAgICAgICBpZiAoc2l6ZS5jb2wgPT09IDIpe1xuICAgICAgICAgICAgLy8gRm9yIGEgcmVjdGFuZ2xlIG9yIGEgYmlnIFNxdWFyZVxuICAgICAgICAgICAgLy8gV2UgdXBkYXRlIHRoZSByb3cgcG9zaXRpb25zXG4gICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoLWNlbGxTaXplICs1KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcblxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNSxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+YXJyYXlFbHRzLnB1c2goY2lyY2xlLmNhbnZhc0VsdCkpO1xuXG4gICAgICAgIC8vIFRoZSBwZWcgaXMgbG9ja2VkIGluIGFsbCBwb3NpdGlvblxuICAgICAgICB0aGlzLmdyb3VwID0gbmV3IGZhYnJpYy5Hcm91cChhcnJheUVsdHMsIHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubGVmdCxcbiAgICAgICAgICAgIHRvcDogdGhpcy50b3AsXG4gICAgICAgICAgICBhbmdsZTogdGhpcy5hbmdsZSxcbiAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdlIGFkZCB0byBGYWJyaWNFbGVtZW50IGEgcmVmZXJlbmNlIHRvIHRoZSBjdXJlbnQgcGVnXG4gICAgICAgIHRoaXMuZ3JvdXAucGFyZW50UGVnID0gdGhpczsgICAgICAgIFxuICAgIH1cblxuICAgIC8vIFRoZSBGYWJyaWNKUyBlbGVtZW50XG4gICAgZ2V0IGNhbnZhc0VsdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDtcbiAgICB9XG5cbiAgICAvLyBUcnVlIGlmIHRoZSBlbGVtZW50IHdhcyByZXBsYWNlZFxuICAgIGdldCByZXBsYWNlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlzUmVwbGFjZVxuICAgIH1cblxuICAgIC8vIFNldHRlciBmb3IgaXNSZXBsYWNlIHBhcmFtXG4gICAgc2V0IHJlcGxhY2UocmVwbGFjZSl7XG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gcmVwbGFjZTtcbiAgICB9XG5cbiAgICAvLyBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBwZWdcbiAgICBjaGFuZ2VDb2xvcihjb2xvcil7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5yZWN0QmFzaWMuc2V0KCdmaWxsJywgY29sb3IpO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LmZvckVhY2goKGNpcmNsZSk9PiBjaXJjbGUuY2hhbmdlQ29sb3IoY29sb3IpKTsgICAgICAgIFxuICAgIH1cblxuICAgIC8vIE1vdmUgdGhlIHBlZyB0byBkZXNpcmUgcG9zaXRpb25cbiAgICBtb3ZlKGxlZnQsIHRvcCl7XG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XG4gICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgIGxlZnQgOiBsZWZ0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJvdGF0ZSB0aGUgcGVnIHRvIHRoZSBkZXNpcmUgYW5nbGVcbiAgICByb3RhdGUoYW5nbGUpe1xuICAgICAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcbiAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcbiAgICAgICAgfSk7XG4gICAgfVxuXG59Il19
