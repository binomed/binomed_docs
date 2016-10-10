(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _legoColors = require('./common/legoColors.js');

var _const = require('./common/const.js');

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
    keys = null,
        // The keys of firenase submit draw 
    snapshotFb = null,
        // The snapshot of submit draw
    index = 0;

    function initGame() {

        legoCanvas = new _legoCanvas.LegoGridCanvas('canvasDraw', true);

        $("#color-picker2").spectrum({
            showPaletteOnly: true,
            showPalette: true,
            color: _const.BASE_LEGO_COLOR,
            palette: _legoColors.LEGO_COLORS,
            change: function change(color) {
                legoCanvas.changeColor(color.toHexString());
            }
        });
    }

    function pageLoad() {

        fireBaseLego = new _firebase.FireBaseLegoApp().app;
        // We init the authentication object 
        var fireBaseAuth = new _firebaseAuth.FireBaseAuth({
            idDivLogin: 'login-msg',
            idNextDiv: 'hello-msg',
            idLogout: 'signout',
            idImg: "img-user",
            idDisplayName: "name-user"
        });

        /**
         * Management of Cinematic Buttons
         */
        var startBtn = document.getElementById('startBtn');
        var helpBtn = document.getElementById('help');

        var streamStart = Rx.Observable.fromEvent(startBtn, 'click').map(function () {
            return 'start';
        });

        var streamHelp = Rx.Observable.fromEvent(helpBtn, 'click').map(function () {
            return 'help';
        });

        streamStart.merge(streamHelp).subscribe(function (state) {
            if (state === 'start') {
                document.getElementById('hello-msg').setAttribute("hidden", "");
                document.getElementById('game').removeAttribute('hidden');
                document.getElementById('color-picker2').removeAttribute('hidden');
                document.getElementById('help').removeAttribute('hidden');
                if (!gameInit) {
                    document.getElementById('loading').removeAttribute('hidden');
                    // Timeout needed to start the rendering of loading animation (else will not be show)
                    setTimeout(function () {
                        gameInit = true;
                        initGame();
                        document.getElementById('loading').setAttribute('hidden', '');
                    }, 50);
                }
            } else if (state === 'help') {
                document.getElementById('hello-msg').removeAttribute("hidden");
                document.getElementById('game').setAttribute('hidden', "");
                document.getElementById('color-picker2').setAttribute('hidden', "");
                document.getElementById('help').setAttribute('hidden', "");
            }
        });

        /**
         * Management of submission
         */

        document.getElementById('btnSubmission').addEventListener('click', function () {
            // When we submit a draw, we save it on firebase tree                        
            fireBaseLego.database().ref("/draw").push(legoCanvas.export(fireBaseAuth.displayName(), fireBaseAuth.userId()));
            legoCanvas.resetBoard();
        });

        /**
         * Management of menu items
         */

        var menuGame = document.getElementById('menu-game');
        var menuCreations = document.getElementById('menu-creations');

        var streamGame = Rx.Observable.fromEvent(menuGame, 'click').map(function () {
            return 'game';
        });

        var streamCreations = Rx.Observable.fromEvent(menuCreations, 'click').map(function () {
            return 'creations';
        });

        streamGame.merge(streamCreations).subscribe(function (state) {
            if (state === 'game') {
                document.querySelector('.page-content').removeAttribute('hidden');
                document.getElementById('submitted').setAttribute('hidden', '');
                document.getElementById('menu-game').setAttribute('hidden', '');
                document.getElementById('menu-creations').removeAttribute('hidden');
                document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
                document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
            } else if (state === 'creations') {
                document.querySelector('.page-content').setAttribute('hidden', '');
                document.getElementById('submitted').removeAttribute('hidden');
                document.getElementById('menu-game').removeAttribute('hidden');
                document.getElementById('menu-creations').setAttribute('hidden', '');
                document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
                document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');

                fireBaseLego.database().ref('drawSaved/' + fireBaseAuth.userId()).once('value', function (snapshot) {
                    if (snapshot && snapshot.val()) {
                        console.log(snapshot.val());
                        snapshotFb = snapshot.val();
                        keys = Object.keys(snapshotFb);
                        index = 0;
                        draw();
                    } else {
                        console.log('no draw !');
                    }
                }, function (err) {
                    console.error(err);
                    // error callback triggered with PERMISSION_DENIED
                });
            }
        });

        /**
         * Management of Buttons for changing of draw
         */

        var btnLeft = document.getElementById('btnLeft');
        var btnRight = document.getElementById('btnRight');

        var streamBtnLeft = Rx.Observable.fromEvent(btnLeft, 'click', function () {
            return index = Math.max(index - 1, 0);
        });
        var streamBtnRight = Rx.Observable.fromEvent(btnRight, 'click', function () {
            return index = Math.min(index + 1, keys.length - 1);
        });

        streamBtnLeft.merge(streamBtnRight).subscribe(draw);
    }

    /**
     * Show a draw and show it's state : Rejected or Accepted
     */
    function draw() {
        var draw = snapshotFb[keys[index]];
        var imgSubmission = document.getElementById('imgSubmission');
        imgSubmission.src = draw.dataUrl;
        if (draw.accepted && !imgSubmission.classList.contains('accepted')) {
            imgSubmission.classList.add('accepted');
        } else {
            imgSubmission.classList.remove('accepted');
        }
    }

    window.addEventListener('load', pageLoad);

    /* SERVICE_WORKER_REPLACE
    if ('serviceWorker' in navigator) {        
        navigator.serviceWorker.register('./service-worker-phone.js', {scope : location.pathname}).then(function(reg) {
            console.log('Service Worker Register for scope : %s',reg.scope);
        });
    }
    SERVICE_WORKER_REPLACE */
})();

},{"./canvas/legoCanvas.js":2,"./common/const.js":3,"./common/legoColors.js":4,"./firebase/firebase.js":6,"./firebase/firebaseAuth.js":7}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfcGhvbmUuanMiLCJzcmMvc2NyaXB0cy9jYW52YXMvbGVnb0NhbnZhcy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9jb25zdC5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9sZWdvQ29sb3JzLmpzIiwic3JjL3NjcmlwdHMvY29tbW9uL3V0aWwuanMiLCJzcmMvc2NyaXB0cy9maXJlYmFzZS9maXJlYmFzZS5qcyIsInNyYy9zY3JpcHRzL2ZpcmViYXNlL2ZpcmViYXNlQXV0aC5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvY2lyY2xlLmpzIiwic3JjL3NjcmlwdHMvbGVnb19zaGFwZS9wZWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQSxDQUFDLFlBQVk7O0FBRVQsUUFBSSxXQUFXLEtBQWY7QUFBQSxRQUFxQjtBQUNqQixtQkFBZSxJQURuQjtBQUFBLFFBQ3lCO0FBQ3JCLGlCQUFhLElBRmpCO0FBQUEsUUFFdUI7QUFDbkIsV0FBTyxJQUhYO0FBQUEsUUFHaUI7QUFDYixpQkFBYSxJQUpqQjtBQUFBLFFBSXVCO0FBQ25CLFlBQVEsQ0FMWjs7QUFRQSxhQUFTLFFBQVQsR0FBb0I7O0FBRWhCLHFCQUFhLCtCQUFtQixZQUFuQixFQUFpQyxJQUFqQyxDQUFiOztBQUVBLFVBQUUsZ0JBQUYsRUFBb0IsUUFBcEIsQ0FBNkI7QUFDekIsNkJBQWlCLElBRFE7QUFFekIseUJBQWEsSUFGWTtBQUd6Qix5Q0FIeUI7QUFJekIsNENBSnlCO0FBS3pCLG9CQUFRLGdCQUFVLEtBQVYsRUFBaUI7QUFDckIsMkJBQVcsV0FBWCxDQUF1QixNQUFNLFdBQU4sRUFBdkI7QUFDSDtBQVB3QixTQUE3QjtBQVNIOztBQUVELGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIsdUJBQWUsZ0NBQXNCLEdBQXJD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bnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7TEVHT19DT0xPUlN9IGZyb20gJy4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xuaW1wb3J0IHtCQVNFX0xFR09fQ09MT1J9IGZyb20gJy4vY29tbW9uL2NvbnN0LmpzJztcbmltcG9ydCB7RmlyZUJhc2VMZWdvQXBwfSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7RmlyZUJhc2VBdXRofSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlQXV0aC5qcyc7XG5pbXBvcnQge0xlZ29HcmlkQ2FudmFzfSBmcm9tICcuL2NhbnZhcy9sZWdvQ2FudmFzLmpzJztcblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgbGV0IGdhbWVJbml0ID0gZmFsc2UsLy8gdHJ1ZSBpZiB3ZSBpbml0IHRoZSBsZWdvR3JpZFxuICAgICAgICBmaXJlQmFzZUxlZ28gPSBudWxsLCAvLyB0aGUgcmVmZXJlbmNlIG9mIHRoZSBmaXJlQmFzZUFwcFxuICAgICAgICBsZWdvQ2FudmFzID0gbnVsbCwgLy8gVGhlIGxlZ29HcmlkXG4gICAgICAgIGtleXMgPSBudWxsLCAvLyBUaGUga2V5cyBvZiBmaXJlbmFzZSBzdWJtaXQgZHJhdyBcbiAgICAgICAgc25hcHNob3RGYiA9IG51bGwsIC8vIFRoZSBzbmFwc2hvdCBvZiBzdWJtaXQgZHJhd1xuICAgICAgICBpbmRleCA9IDA7IFxuXG4gICAgXG4gICAgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG5cbiAgICAgICAgbGVnb0NhbnZhcyA9IG5ldyBMZWdvR3JpZENhbnZhcygnY2FudmFzRHJhdycsIHRydWUpO1xuXG4gICAgICAgICQoXCIjY29sb3ItcGlja2VyMlwiKS5zcGVjdHJ1bSh7XG4gICAgICAgICAgICBzaG93UGFsZXR0ZU9ubHk6IHRydWUsXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiBCQVNFX0xFR09fQ09MT1IsXG4gICAgICAgICAgICBwYWxldHRlOiBMRUdPX0NPTE9SUyxcbiAgICAgICAgICAgIGNoYW5nZTogZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgbGVnb0NhbnZhcy5jaGFuZ2VDb2xvcihjb2xvci50b0hleFN0cmluZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgICAgZmlyZUJhc2VMZWdvID0gbmV3IEZpcmVCYXNlTGVnb0FwcCgpLmFwcDtcbiAgICAgICAgLy8gV2UgaW5pdCB0aGUgYXV0aGVudGljYXRpb24gb2JqZWN0IFxuICAgICAgICBsZXQgZmlyZUJhc2VBdXRoID0gbmV3IEZpcmVCYXNlQXV0aCh7XG4gICAgICAgICAgICBpZERpdkxvZ2luOiAnbG9naW4tbXNnJyxcbiAgICAgICAgICAgIGlkTmV4dERpdjogJ2hlbGxvLW1zZycsXG4gICAgICAgICAgICBpZExvZ291dDogJ3NpZ25vdXQnLFxuICAgICAgICAgICAgaWRJbWc6IFwiaW1nLXVzZXJcIixcbiAgICAgICAgICAgIGlkRGlzcGxheU5hbWU6IFwibmFtZS11c2VyXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgQ2luZW1hdGljIEJ1dHRvbnNcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0QnRuJyk7XG4gICAgICAgIGNvbnN0IGhlbHBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpXG5cbiAgICAgICAgY29uc3Qgc3RyZWFtU3RhcnQgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KHN0YXJ0QnRuLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnc3RhcnQnKTtcblxuICAgICAgICBjb25zdCBzdHJlYW1IZWxwID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChoZWxwQnRuLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnaGVscCcpO1xuXG4gICAgICAgIHN0cmVhbVN0YXJ0Lm1lcmdlKHN0cmVhbUhlbHApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWdhbWVJbml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaW1lb3V0IG5lZWRlZCB0byBzdGFydCB0aGUgcmVuZGVyaW5nIG9mIGxvYWRpbmcgYW5pbWF0aW9uIChlbHNlIHdpbGwgbm90IGJlIHNob3cpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZUluaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0R2FtZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09ICdoZWxwJykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBzdWJtaXNzaW9uXG4gICAgICAgICAqL1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5TdWJtaXNzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIHN1Ym1pdCBhIGRyYXcsIHdlIHNhdmUgaXQgb24gZmlyZWJhc2UgdHJlZSAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKFwiL2RyYXdcIikucHVzaChsZWdvQ2FudmFzLmV4cG9ydChmaXJlQmFzZUF1dGguZGlzcGxheU5hbWUoKSwgZmlyZUJhc2VBdXRoLnVzZXJJZCgpKSk7XG4gICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgbWVudSBpdGVtc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBtZW51R2FtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKTtcbiAgICAgICAgY29uc3QgbWVudUNyZWF0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpO1xuICAgICAgICBcblxuICAgICAgICBjb25zdCBzdHJlYW1HYW1lID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChtZW51R2FtZSwgJ2NsaWNrJylcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gJ2dhbWUnKTtcblxuICAgICAgICBjb25zdCBzdHJlYW1DcmVhdGlvbnMgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KG1lbnVDcmVhdGlvbnMsICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdjcmVhdGlvbnMnKTtcblxuICAgICAgICBzdHJlYW1HYW1lLm1lcmdlKHN0cmVhbUNyZWF0aW9ucylcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnZ2FtZScpe1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jb250ZW50JykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdHRlZCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19kcmF3ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19vYmZ1c2NhdG9yJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHN0YXRlID09PSAnY3JlYXRpb25zJyl7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNvbnRlbnQnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdHRlZCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX2RyYXdlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX29iZnVzY2F0b3InKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKGBkcmF3U2F2ZWQvJHtmaXJlQmFzZUF1dGgudXNlcklkKCl9YCkub25jZSgndmFsdWUnLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbmFwc2hvdCAmJiBzbmFwc2hvdC52YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNuYXBzaG90LnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbmFwc2hvdEZiID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmF3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBkcmF3ICEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFjayB0cmlnZ2VyZWQgd2l0aCBQRVJNSVNTSU9OX0RFTklFRFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBCdXR0b25zIGZvciBjaGFuZ2luZyBvZiBkcmF3XG4gICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0IGJ0bkxlZnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuTGVmdCcpO1xuICAgICAgICBjb25zdCBidG5SaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5SaWdodCcpO1xuXG4gICAgICAgIGNvbnN0IHN0cmVhbUJ0bkxlZnQgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGJ0bkxlZnQsJ2NsaWNrJywoKT0+aW5kZXggPSBNYXRoLm1heChpbmRleCAtIDEsIDApKTtcbiAgICAgICAgY29uc3Qgc3RyZWFtQnRuUmlnaHQgPSAgUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChidG5SaWdodCwgJ2NsaWNrJywoKT0+aW5kZXggPSBNYXRoLm1pbihpbmRleCArIDEsIGtleXMubGVuZ3RoIC0gMSkpO1xuXG4gICAgICAgc3RyZWFtQnRuTGVmdC5tZXJnZShzdHJlYW1CdG5SaWdodCkuc3Vic2NyaWJlKGRyYXcpO1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IGEgZHJhdyBhbmQgc2hvdyBpdCdzIHN0YXRlIDogUmVqZWN0ZWQgb3IgQWNjZXB0ZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkcmF3KCkge1xuICAgICAgICBsZXQgZHJhdyA9IHNuYXBzaG90RmJba2V5c1tpbmRleF1dO1xuICAgICAgICBsZXQgaW1nU3VibWlzc2lvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWdTdWJtaXNzaW9uJyk7XG4gICAgICAgIGltZ1N1Ym1pc3Npb24uc3JjID0gZHJhdy5kYXRhVXJsO1xuICAgICAgICBpZiAoZHJhdy5hY2NlcHRlZCAmJiAhaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY2VwdGVkJykpIHtcbiAgICAgICAgICAgIGltZ1N1Ym1pc3Npb24uY2xhc3NMaXN0LmFkZCgnYWNjZXB0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGltZ1N1Ym1pc3Npb24uY2xhc3NMaXN0LnJlbW92ZSgnYWNjZXB0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcblxuICAgIC8qIFNFUlZJQ0VfV09SS0VSX1JFUExBQ0VcbiAgICBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgeyAgICAgICAgXG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcuL3NlcnZpY2Utd29ya2VyLXBob25lLmpzJywge3Njb3BlIDogbG9jYXRpb24ucGF0aG5hbWV9KS50aGVuKGZ1bmN0aW9uKHJlZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2UgV29ya2VyIFJlZ2lzdGVyIGZvciBzY29wZSA6ICVzJyxyZWcuc2NvcGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgU0VSVklDRV9XT1JLRVJfUkVQTEFDRSAqL1xuXG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1BlZ30gZnJvbSAnLi4vbGVnb19zaGFwZS9wZWcuanMnO1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4uL2xlZ29fc2hhcGUvY2lyY2xlLmpzJztcbmltcG9ydCB7TkJfQ0VMTFMsIEhFQURFUl9IRUlHSFQsIEJBU0VfTEVHT19DT0xPUiwgQkFDS0dST1VORF9MRUdPX0NPTE9SfSBmcm9tICcuLi9jb21tb24vY29uc3QuanMnO1xuaW1wb3J0IHtsZWdvQmFzZUNvbG9yfSBmcm9tICcuLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XG5cbi8qKlxuICogXG4gKiBDbGFzcyBmb3IgQ2FudmFzIEdyaWRcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgTGVnb0dyaWRDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBzaG93Um93KSB7XG4gICAgICAgIC8vIEJhc2ljIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhc0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgLy8gU2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXNSZWN0ID0gdGhpcy5jYW52YXNFbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIC8vIEluZGljYXRvciBmb3Igc2hvd2luZyB0aGUgZmlyc3Qgcm93IHdpdGggcGVnc1xuICAgICAgICB0aGlzLnNob3dSb3cgPSBzaG93Um93O1xuICAgICAgICB0aGlzLmNhbnZhc0VsdC53aWR0aCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aDtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHNob3dSb3csIHdlIHdpbGwgc2hvdyBtb2RpZnkgdGhlIGhlYWRlciBIZWlnaHRcbiAgICAgICAgdGhpcy5oZWFkZXJIZWlnaHQgPSB0aGlzLnNob3dSb3cgPyBIRUFERVJfSEVJR0hUIDogMDtcbiAgICAgICAgdGhpcy5jYW52YXNFbHQuaGVpZ2h0ID0gdGhpcy5jYW52YXNSZWN0LndpZHRoICsgdGhpcy5oZWFkZXJIZWlnaHQ7XG4gICAgICAgIC8vIFdlIGNhbGN1bGF0ZSB0aGUgY2VsbHNpemUgYWNjb3JkaW5nIHRvIHRoZSBzcGFjZSB0YWtlbiBieSB0aGUgY2FudmFzXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKTtcblxuICAgICAgICAvLyBXZSBpbml0aWFsaXplIHRoZSBGYWJyaWMgSlMgbGlicmFyeSB3aXRoIG91ciBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgZmFicmljLkNhbnZhcyhpZCwgeyBzZWxlY3Rpb246IGZhbHNlIH0pO1xuICAgICAgICAvLyBPYmplY3QgdGhhdCByZXByZXNlbnQgdGhlIHBlZ3Mgb24gdGhlIGZpcnN0IHJvd1xuICAgICAgICB0aGlzLnJvd1NlbGVjdCA9IHt9O1xuICAgICAgICAvLyBUaGUgY3VycmVudCBkcmF3IG1vZGVsIChpbnN0cnVjdGlvbnMsIC4uLilcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge30sXG4gICAgICAgIC8vIEZsYWcgdG8gZGV0ZXJtaW5lIGlmIHdlIGhhdmUgdG8gY3JlYXRlIGEgbmV3IGJyaWNrXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3QnJpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IEJBU0VfTEVHT19DT0xPUjtcblxuICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIGNhbnZhc1xuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XG5cbiAgICAgICAgLy8gSWYgd2Ugc2hvdyB0aGUgcm93LCB3ZSBoYXZlIHRvIHBsdWcgdGhlIG1vdmUgbWFuYWdlbWVudFxuICAgICAgICBpZiAoc2hvd1Jvdykge1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0OnNlbGVjdGVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnID8gb3B0aW9ucy50YXJnZXQgOiBudWxsKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdzZWxlY3Rpb246Y2xlYXJlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG51bGwpO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0Om1vdmluZycsIChvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBlZyA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZztcblxuXG4gICAgICAgICAgICAgICAgbGV0IG5ld0xlZnQgPSBNYXRoLnJvdW5kKG9wdGlvbnMudGFyZ2V0LmxlZnQgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1RvcCA9IE1hdGgucm91bmQoKG9wdGlvbnMudGFyZ2V0LnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0KSAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSArIHRoaXMuaGVhZGVySGVpZ2h0OyAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gY2FsY3VsYXRlIHRoZSB0b3BcbiAgICAgICAgICAgICAgICBsZXQgdG9wQ29tcHV0ZSA9IG5ld1RvcCArIChwZWcuc2l6ZS5yb3cgPT09IDIgfHwgcGVnLmFuZ2xlID4gMCA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnRDb21wdXRlID0gbmV3TGVmdCArIChwZWcuc2l6ZS5jb2wgPT09IDIgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgICAgIHBlZy5tb3ZlKFxuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0LCAvL2xlZnRcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wIC8vIHRvcFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBzcGVjaWZ5IHRoYXQgd2UgY291bGQgcmVtb3ZlIGEgcGVnIGlmIG9uZSBvZiBpdCdzIGVkZ2UgdG91Y2ggdGhlIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xuICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPCBIRUFERVJfSEVJR0hUXG4gICAgICAgICAgICAgICAgICAgIHx8IG5ld0xlZnQgPCAwXG4gICAgICAgICAgICAgICAgICAgIHx8IHRvcENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQuaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIHx8IGxlZnRDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSB3ZSBjaGVjayB3ZSBjcmVhdGUgYSBuZXcgcGVnICh3aGVuIGEgcGVnIGVudGVyIGluIHRoZSBkcmF3IGFyZWEpXG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUuY29sID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAocGVnLmFuZ2xlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSw5MCkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZy5yZXBsYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdtb3VzZTp1cCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QnJpY2tcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnRvUmVtb3ZlXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmJyaWNrTW9kZWxbdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlKHRoaXMuY3VycmVudEJyaWNrKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgZm9yIGNoYW5naW5nIHRoZSBjb2xvciBvZiB0aGUgZmlyc3Qgcm93IFxuICAgICAqL1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKSB7XG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gY29sb3I7ICAgICAgIFxuICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXJpYWxpemUgdGhlIGNhbnZhcyB0byBhIG1pbmltYWwgb2JqZWN0IHRoYXQgY291bGQgYmUgdHJlYXQgYWZ0ZXJcbiAgICAgKi9cbiAgICBleHBvcnQodXNlck5hbWUsIHVzZXJJZCkge1xuICAgICAgICBsZXQgcmVzdWx0QXJyYXkgPSBbXTtcbiAgICAgICAgLy8gV2UgZmlsdGVyIHRoZSByb3cgcGVnc1xuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuYnJpY2tNb2RlbClcbiAgICAgICAgICAgIC5maWx0ZXIoKGtleSk9PmtleSAhPSB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmlkXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnJlY3QuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuaWQpO1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBlZ1RtcCA9IHRoaXMuYnJpY2tNb2RlbFtrZXldO1xuICAgICAgICAgICAgcmVzdWx0QXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgc2l6ZTogcGVnVG1wLnNpemUsXG4gICAgICAgICAgICAgICAgY29sb3I6IHBlZ1RtcC5jb2xvcixcbiAgICAgICAgICAgICAgICBhbmdsZTogcGVnVG1wLmFuZ2xlLFxuICAgICAgICAgICAgICAgIHRvcDogcGVnVG1wLnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IHBlZ1RtcC5sZWZ0LFxuICAgICAgICAgICAgICAgIGNlbGxTaXplIDogdGhpcy5jZWxsU2l6ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXNlcjogdXNlck5hbWUsXG4gICAgICAgICAgICB1c2VySWQgOiB1c2VySWQsXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnM6IHJlc3VsdEFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBmcm9tIGludHJ1Y3Rpb25zIGEgZHJhd1xuICAgICAqL1xuICAgIGRyYXdJbnN0cnVjdGlvbnMoaW5zdHJ1Y3Rpb25PYmplY3Qpe1xuICAgICAgICB0aGlzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgaW5zdHJ1Y3Rpb25PYmplY3QuaW5zdHJ1Y3Rpb25zLmZvckVhY2goKGluc3RydWN0aW9uKT0+e1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUJyaWNrKHsgc2l6ZSA6IGluc3RydWN0aW9uLnNpemUsIFxuICAgICAgICAgICAgICAgICAgICBsZWZ0IDogKGluc3RydWN0aW9uLmxlZnQgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoaW5zdHJ1Y3Rpb24udG9wIC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGUgOiBpbnN0cnVjdGlvbi5hbmdsZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgOiBpbnN0cnVjdGlvbi5jb2xvclxuICAgICAgICAgICAgICAgIH0pLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gdGhlIGJvYXJkIGFuZCB0aGUgc3RhdGUgb2YgdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIHJlc2V0Qm9hcmQoKXtcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge307XG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcbiAgICB9XG5cbiAgICAvKiogXG4gICAgICogR2VuZXJhdGUgYSBCYXNlNjQgaW1hZ2UgZnJvbSB0aGUgY2FudmFzXG4gICAgICovXG4gICAgc25hcHNob3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIFByaXZhdGVzIE1ldGhvZHNcbiAgICAgKiBcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogRHJhdyB0aGUgYmFzaWMgZ3JpZCBcbiAgICAqL1xuICAgIF9kcmF3R3JpZChzaXplKSB7ICAgICAgIFxuICAgICAgICBpZiAodGhpcy5zaG93Um93KXtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFsbCB0aGUgd2hpdGUgcGVnIG9mIHRoZSBncmlkXG4gICAgICovXG4gICAgX2RyYXdXaGl0ZVBlZyhzaXplKXtcbiAgICAgICAgLy8gV2Ugc3RvcCByZW5kZXJpbmcgb24gZWFjaCBhZGQsIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzXG4gICAgICAgIC8vdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1heCA9IE1hdGgucm91bmQoc2l6ZSAvIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICBsZXQgbWF4U2l6ZSA9IG1heCAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgIGZvciAodmFyIHJvdyA9MDsgcm93IDwgbWF4OyByb3crKyl7XG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtYXg7IGNvbCsrICl7XG4gICAgICAgICAgICAgICAgIGxldCBzcXVhcmVUbXAgPSBuZXcgZmFicmljLlJlY3Qoe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBCQUNLR1JPVU5EX0xFR09fQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGNpcmNsZSA9IG5ldyBDaXJjbGUodGhpcy5jZWxsU2l6ZSwgQkFDS0dST1VORF9MRUdPX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBjaXJjbGUuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwVG1wID0gbmV3IGZhYnJpYy5Hcm91cChbc3F1YXJlVG1wLCBjaXJjbGUuY2FudmFzRWx0XSwge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLmNlbGxTaXplICogY29sLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuY2VsbFNpemUgKiByb3cgKyB0aGlzLmhlYWRlckhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKGdyb3VwVG1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKnRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgICAgIC8vIFdlIHRyYW5zZm9ybSB0aGUgY2FudmFzIHRvIGEgYmFzZTY0IGltYWdlIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzLlxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7ICAgICBcbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QmFja2dyb3VuZEltYWdlKHVybCx0aGlzLmNhbnZhcy5yZW5kZXJBbGwuYmluZCh0aGlzLmNhbnZhcyksIHtcbiAgICAgICAgICAgIG9yaWdpblg6ICdsZWZ0JyxcbiAgICAgICAgICAgIG9yaWdpblk6ICd0b3AnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2FudmFzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5jYW52YXMuaGVpZ2h0LFxuICAgICAgICB9KTsgICAqL1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGhvcml6b250YWwgb3IgdmVydGljYWwgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgX2NyZWF0ZVJlY3Qoc2l6ZVJlY3QsIGFuZ2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAyICogc2l6ZVJlY3QsIHJvdyA6MSAqIHNpemVSZWN0fSwgXG4gICAgICAgICAgICAgICAgbGVmdCA6IGFuZ2xlID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyA0KSAtIHRoaXMuY2VsbFNpemUpIDogKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggKiAzIC8gNCkgLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxuICAgICAgICAgICAgICAgIHRvcCA6IGFuZ2xlID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgc3F1YXJlICgxeDEpIG9yICgyeDIpXG4gICAgICovXG4gICAgX2NyZWF0ZVNxdWFyZShzaXplU3F1YXJlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAxICogc2l6ZVNxdWFyZSwgcm93IDoxICogc2l6ZVNxdWFyZX0sIFxuICAgICAgICAgICAgICAgIGxlZnQ6IHNpemVTcXVhcmUgPT09IDIgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDIpIC0gKDIgKiB0aGlzLmNlbGxTaXplKSkgOiAodGhpcy5jYW52YXNSZWN0LndpZHRoIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcbiAgICAgICAgICAgICAgICB0b3AgOiBzaXplU3F1YXJlID09PSAyID8gMSA6IDAsXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmljIG1ldGhvZCB0aGF0IGNyZWF0ZSBhIHBlZ1xuICAgICAqL1xuICAgIF9jcmVhdGVCcmljayhvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMuY2VsbFNpemUgPSB0aGlzLmNlbGxTaXplO1xuICAgICAgICBvcHRpb25zLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCB0aGlzLmxhc3RDb2xvcjtcbiAgICAgICAgbGV0IHBlZyA9IG5ldyBQZWcob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbFtwZWcuaWRdID0gcGVnO1xuICAgICAgICAvLyBXZSBoYXZlIHRvIHVwZGF0ZSB0aGUgcm93U2VsZWN0IE9iamVjdCB0byBiZSBhbHN3YXkgdXBkYXRlXG4gICAgICAgIGlmIChvcHRpb25zLnNpemUucm93ID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbmdsZSkge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zaXplLmNvbCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdCA9IHBlZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZSA9IHBlZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGVnO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5pdCB0aGUgY2FudmFzXG4gICAgICovXG4gICAgX2RyYXdDYW52YXMoKSB7XG4gICAgICAgIHRoaXMuX2RyYXdXaGl0ZVBlZyh0aGlzLmNhbnZhc1JlY3Qud2lkdGgpO1xuICAgICAgICB0aGlzLl9kcmF3R3JpZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGgsIE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpKTtcbiAgICB9XG4gICAgXG5cbn0iLCIndXNlIHN0cmljdCdcblxuLy8gTnVtYmVyIG9mIGNlbGwgb24gdGhlIGdyaWRcbmV4cG9ydCBjb25zdCBOQl9DRUxMUyA9IDE1O1xuXG4vLyBIZWlnaHQgb2YgdGhlIGhlYWRlclxuZXhwb3J0IGNvbnN0IEhFQURFUl9IRUlHSFQgPSB3aW5kb3cuc2NyZWVuLndpZHRoIDw9IDc2OCAgPyA2MCA6IDEwMDtcblxuLy8gRmlyc3QgY29sb3IgdG8gdXNlXG5leHBvcnQgY29uc3QgQkFTRV9MRUdPX0NPTE9SID0gXCIjMGQ2OWYyXCI7XG5cbi8vIE1lZGl1bSBTdG9uZSBHcmV5IFxuY29uc3QgQ09MT1JfMTk0ID0gXCIjYTNhMmE0XCI7XG5cbi8vIExpZ2h0IFN0b25lIEdyZXlcbmNvbnN0IENPTE9SXzIwOCA9IFwiI2U1ZTRkZVwiOyBcblxuLy8gQmFja2dyb3VuZCBjb2xvciB1c2VkXG5leHBvcnQgY29uc3QgQkFDS0dST1VORF9MRUdPX0NPTE9SID0gQ09MT1JfMjA4OyIsIid1c2Ugc3RyaWN0J1xuXG4vKlxuKiBDb2xvcnMgZnJvbSBcbiogaHR0cDovL2xlZ28ud2lraWEuY29tL3dpa2kvQ29sb3VyX1BhbGV0dGUgXG4qIEFuZCBodHRwOi8vd3d3LnBlZXJvbi5jb20vY2dpLWJpbi9pbnZjZ2lzL2NvbG9yZ3VpZGUuY2dpXG4qIE9ubHkgU2hvdyB0aGUgY29sb3IgdXNlIHNpbmNlIDIwMTBcbioqLyBcbmV4cG9ydCBjb25zdCBMRUdPX0NPTE9SUyA9IFtcbiAgICAncmdiKDI0NSwgMjA1LCA0NyknLCAvLzI0LCBCcmlnaHQgWWVsbG93ICpcbiAgICAncmdiKDI1MywgMjM0LCAxNDApJywgLy8yMjYsIENvb2wgWWVsbG93ICpcbiAgICAncmdiKDIxOCwgMTMzLCA2NCknLCAvLzEwNiwgQnJpZ2h0IE9yYW5nZSAqXG4gICAgJ3JnYigyMzIsIDE3MSwgNDUpJywgLy8xOTEsIEZsYW1lIFllbGxvd2lzaCBPcmFuZ2UgKlxuICAgICdyZ2IoMTk2LCA0MCwgMjcpJywgLy8yMSwgQnJpZ2h0IFJlZCAqXG4gICAgJ3JnYigxMjMsIDQ2LCA0NyknLCAvLzE1NCwgRGFyayBSZWQgKlxuICAgICdyZ2IoMjA1LCA5OCwgMTUyKScsIC8vMjIxLCBCcmlnaHQgUHVycGxlICpcbiAgICAncmdiKDIyOCwgMTczLCAyMDApJywgLy8yMjIsIExpZ2h0IFB1cnBsZSAqXG4gICAgJ3JnYigxNDYsIDU3LCAxMjApJywgLy8xMjQsIEJyaWdodCBSZWRkaXNoIFZpb2xldCAqXG4gICAgJ3JnYig1MiwgNDMsIDExNyknLCAvLzI2OCwgTWVkaXVtIExpbGFjICpcbiAgICAncmdiKDEzLCAxMDUsIDI0MiknLCAvLzIzLCBCcmlnaHQgQmx1ZSAqXG4gICAgJ3JnYigxNTksIDE5NSwgMjMzKScsIC8vMjEyLCBMaWdodCBSb3lhbCBCbHVlICpcbiAgICAncmdiKDExMCwgMTUzLCAyMDEpJywgLy8xMDIsIE1lZGl1bSBCbHVlICpcbiAgICAncmdiKDMyLCA1OCwgODYpJywgLy8xNDAsIEVhcnRoIEJsdWUgKlxuICAgICdyZ2IoMTE2LCAxMzQsIDE1NiknLCAvLzEzNSwgU2FuZCBCbHVlICpcbiAgICAncmdiKDQwLCAxMjcsIDcwKScsIC8vMjgsIERhcmsgR3JlZW4gKlxuICAgICdyZ2IoNzUsIDE1MSwgNzQpJywgLy8zNywgQmlyZ2h0IEdyZWVuICpcbiAgICAncmdiKDEyMCwgMTQ0LCAxMjkpJywgLy8xNTEsIFNhbmQgR3JlZW4gKlxuICAgICdyZ2IoMzksIDcwLCA0NCknLCAvLzE0MSwgRWFydGggR3JlZW4gKlxuICAgICdyZ2IoMTY0LCAxODksIDcwKScsIC8vMTE5LCBCcmlnaHQgWWVsbG93aXNoLUdyZWVuICogXG4gICAgJ3JnYigxMDUsIDY0LCAzOSknLCAvLzE5MiwgUmVkZGlzaCBCcm93biAqXG4gICAgJ3JnYigyMTUsIDE5NywgMTUzKScsIC8vNSwgQnJpY2sgWWVsbG93ICogXG4gICAgJ3JnYigxNDksIDEzOCwgMTE1KScsIC8vMTM4LCBTYW5kIFllbGxvdyAqXG4gICAgJ3JnYigxNzAsIDEyNSwgODUpJywgLy8zMTIsIE1lZGl1bSBOb3VnYXQgKiAgICBcbiAgICAncmdiKDQ4LCAxNSwgNiknLCAvLzMwOCwgRGFyayBCcm93biAqXG4gICAgJ3JnYigyMDQsIDE0MiwgMTA0KScsIC8vMTgsIE5vdWdhdCAqXG4gICAgJ3JnYigyNDUsIDE5MywgMTM3KScsIC8vMjgzLCBMaWdodCBOb3VnYXQgKlxuICAgICdyZ2IoMTYwLCA5NSwgNTIpJywgLy8zOCwgRGFyayBPcmFuZ2UgKlxuICAgICdyZ2IoMjQyLCAyNDMsIDI0MiknLCAvLzEsIFdoaXRlICpcbiAgICAncmdiKDIyOSwgMjI4LCAyMjIpJywgLy8yMDgsIExpZ2h0IFN0b25lIEdyZXkgKlxuICAgICdyZ2IoMTYzLCAxNjIsIDE2NCknLCAvLzE5NCwgTWVkaXVtIFN0b25lIEdyZXkgKlxuICAgICdyZ2IoOTksIDk1LCA5NyknLCAvLzE5OSwgRGFyayBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDI3LCA0MiwgNTIpJywgLy8yNiwgQmxhY2sgKiAgICAgICAgXG5dOyIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgYSB2YXJpYXRpb24gb2YgY29sb3JcbiAqIFxuICogRnJvbSA6IGh0dHBzOi8vd3d3LnNpdGVwb2ludC5jb20vamF2YXNjcmlwdC1nZW5lcmF0ZS1saWdodGVyLWRhcmtlci1jb2xvci9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbG9yTHVtaW5hbmNlKGhleCwgbHVtKSB7XG5cbiAgICAgICAgLy8gdmFsaWRhdGUgaGV4IHN0cmluZ1xuICAgICAgICBoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XG4gICAgICAgIH1cbiAgICAgICAgbHVtID0gbHVtIHx8IDA7XG5cbiAgICAgICAgLy8gY29udmVydCB0byBkZWNpbWFsIGFuZCBjaGFuZ2UgbHVtaW5vc2l0eVxuICAgICAgICB2YXIgcmdiID0gXCIjXCIsIGMsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xuICAgICAgICAgICAgYyA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgYyArIChjICogbHVtKSksIDI1NSkpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgIHJnYiArPSAoXCIwMFwiICsgYykuc3Vic3RyKGMubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZ2I7XG59IiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQmFzaWMgRmlyZWJhc2UgaGVscGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXJlQmFzZUxlZ29BcHB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgLy8gQ29uZmlndXJhdGlvbiBvZiB0aGUgYXBwbGljYXRpb24sIFlvdSBzaG91bGQgdXBkYXRlIHdpdGggeW91ciBLZXlzICFcbiAgICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5RHI5Ujg1dE5qZktXZGRXMS1ON1hKcEFoR3FYTkdhSjVrXCIsXG4gICAgICAgICAgICBhdXRoRG9tYWluOiBcImxlZ29ubmFyeS5maXJlYmFzZWFwcC5jb21cIixcbiAgICAgICAgICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vbGVnb25uYXJ5LmZpcmViYXNlaW8uY29tXCIsXG4gICAgICAgICAgICBzdG9yYWdlQnVja2V0OiBcIlwiLFxuICAgICAgICB9IFxuXG4gICAgICAgIHRoaXMuYXBwID0gZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcCh0aGlzLmNvbmZpZyk7XG4gICAgfVxuXG5cbn1cblxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQ2xhc3MgZm9yIGdlbmVyaWMgbWFuYWdlbWVudCBvZiBBdXRoZW50aWNhdGlvbiB3aXRoIGZpcmViYXNlLlxuICogXG4gKiBJdCB0YWtlcyBjYXJlIG9mIGh0bWwgdG8gaGlkZSBvciBzaG93XG4gKi9cbmV4cG9ydCBjbGFzcyBGaXJlQmFzZUF1dGh7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKXtcbiAgICAgIFxuICAgICAgICBsZXQgdWlDb25maWcgPSB7XG4gICAgICAgICAgICAnY2FsbGJhY2tzJzoge1xuICAgICAgICAgICAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4uXG4gICAgICAgICAgICAgICAgJ3NpZ25JblN1Y2Nlc3MnOiBmdW5jdGlvbih1c2VyLCBjcmVkZW50aWFsLCByZWRpcmVjdFVybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEbyBub3QgcmVkaXJlY3QuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gT3BlbnMgSURQIFByb3ZpZGVycyBzaWduLWluIGZsb3cgaW4gYSBwb3B1cC5cbiAgICAgICAgICAgICdzaWduSW5GbG93JzogJ3BvcHVwJyxcbiAgICAgICAgICAgICdzaWduSW5PcHRpb25zJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcm92aWRlcjogZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgICAgICAgc2NvcGVzOiBbJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcGx1cy5sb2dpbiddXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkZhY2Vib29rQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguVHdpdHRlckF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkdpdGh1YkF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkVtYWlsQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lEXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgLy8gVGVybXMgb2Ygc2VydmljZSB1cmwuXG4gICAgICAgICAgICAndG9zVXJsJzogJ2h0dHBzOi8vZ2RnbmFudGVzLmNvbSdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51aSA9IG5ldyBmaXJlYmFzZXVpLmF1dGguQXV0aFVJKGZpcmViYXNlLmF1dGgoKSk7XG4gICAgICAgIHRoaXMudWkuc3RhcnQoJyNmaXJlYmFzZXVpLWF1dGgtY29udGFpbmVyJywgdWlDb25maWcpO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmlkRGl2TG9naW4gPSBjb25maWcuaWREaXZMb2dpbjtcbiAgICAgICAgdGhpcy5pZE5leHREaXYgPSBjb25maWcuaWROZXh0RGl2O1xuICAgICAgICB0aGlzLmlkTG9nb3V0ID0gY29uZmlnLmlkTG9nb3V0O1xuXG4gICAgICAgIC8vIE9wdGlvbmFsc1xuICAgICAgICB0aGlzLmlkSW1nID0gY29uZmlnLmlkSW1nID8gY29uZmlnLmlkSW1nIDogbnVsbDtcbiAgICAgICAgdGhpcy5pZERpc3BsYXlOYW1lID0gY29uZmlnLmlkRGlzcGxheU5hbWUgPyBjb25maWcuaWREaXNwbGF5TmFtZSA6IG51bGw7XG5cblxuICAgICAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKHRoaXMuX2NoZWNrQ2FsbEJhY2tDb250ZXh0LmJpbmQodGhpcyksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrQ2FsbEJhY2tFcnJvckNvbnRleHQuYmluZCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jYkF1dGhDaGFuZ2VkID0gbnVsbDtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT4gIGZpcmViYXNlLmF1dGgoKS5zaWduT3V0KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluIGNhc2Ugb2YgZXJyb3JcbiAgICAgKi9cbiAgICBfY2hlY2tDYWxsQmFja0Vycm9yQ29udGV4dChlcnJvcil7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIG1ldGhvZCB3aXRoIHRoZSBzdGF0ZSBvZiBjb25uZWN0aW9uXG4gICAgICogXG4gICAgICogQWNjb3JkaW5nIHRvICd1c2VyJywgaXQgd2lsbCBzaG93IG9yIGhpZGUgc29tZSBodG1sIGFyZWFzXG4gICAgICovXG4gICAgX2NoZWNrQ2FsbEJhY2tDb250ZXh0KHVzZXIpe1xuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICBpZiAodXNlcil7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGl2TG9naW4pLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZE5leHREaXYpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7ICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5pZEltZyl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc3JjID0gdXNlci5waG90b1VSTDtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlkRGlzcGxheU5hbWUpe1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWREaXNwbGF5TmFtZSkuaW5uZXJIVE1MID0gdXNlci5kaXNwbGF5TmFtZTs7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWREaXZMb2dpbikucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTmV4dERpdikuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnNyYyA9IFwiXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpc3BsYXlOYW1lKS5pbm5lckhUTUwgPSBcIk5vbiBDb25udGVjdMOpXCI7ICAgICAgICAgICAgXG5cbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmNiQXV0aENoYW5nZWQpe1xuICAgICAgICAgICAgdGhpcy5jYkF1dGhDaGFuZ2VkKHVzZXIpO1xuICAgICAgICB9XG4gICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RyYXRpb24gb2YgY2FsbGJhY2sgZm9yIGZ1dHVyIGludGVyYWN0aW9uLlxuICAgICAqIFRoZSBjYWxsYmFjayBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgd2l0aCB1c2VyIGFzIHBhcmFtZXRlclxuICAgICAqL1xuICAgIG9uQXV0aFN0YXRlQ2hhbmdlZChjYil7XG4gICAgICAgIHRoaXMuY2JBdXRoQ2hhbmdlZCA9IGNiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgbG9nZ2VkIHVzZXJcbiAgICAgKi9cbiAgICBkaXNwbGF5TmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyID8gdGhpcy51c2VyLmRpc3BsYXlOYW1lIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBpZCBvZiB0aGUgY3VycmVudCBsb2dnZWQgdXNlclxuICAgICAqL1xuICAgIHVzZXJJZCgpe1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyID8gdGhpcy51c2VyLnVpZCA6IG51bGw7XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDb2xvckx1bWluYW5jZX0gZnJvbSAnLi4vY29tbW9uL3V0aWwuanMnO1xuXG4vKipcbiAqIENpcmNsZSBMZWdvIGNsYXNzXG4gKiBUaGUgY2lyY2xlIGlzIGNvbXBvc2VkIG9mIDIgY2lyY2xlIChvbiB0aGUgc2hhZG93LCBhbmQgdGhlIG90aGVyIG9uZSBmb3IgdGhlIHRvcClcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgQ2lyY2xle1xuICAgIGNvbnN0cnVjdG9yKGNlbGxTaXplLCBjb2xvcil7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDUsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc2hhZG93IDogXCIwcHggMnB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eCA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA0LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBmYWJyaWMuVGV4dCgnR0RHJywge1xuICAgICAgICAgICAgZm9udFNpemU6IGNlbGxTaXplIC8gNSxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc3Ryb2tlOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoW3RoaXMuY2lyY2xlQmFzaWNFdHgsIHRoaXMuY2lyY2xlQmFzaWMsIHRoaXMudGV4dF0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgRmFicmljSlMgZWxlbWVudFxuICAgICAqL1xuICAgIGdldCBjYW52YXNFbHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7IFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIGNpcmNsZVxuICAgICAqL1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYy5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSkpO1xuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4LnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpKTtcbiAgICAgICAgdGhpcy50ZXh0LnNldCh7XG4gICAgICAgICAgICBmaWxsIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcbiAgICAgICAgICAgIHN0cm9rZSA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMClcbiAgICAgICAgfSk7XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4vY2lyY2xlLmpzJztcblxuLyoqXG4gKiBQZWcgTGVnbyBjbGFzc1xuICogVGhlIHBlZyBpcyBjb21wb3NlZCBvZiBuIGNpcmNsZSBmb3IgYSBkaW1lbnNpb24gdGhhdCBkZXBlbmQgb24gdGhlIHNpemUgcGFyYW1ldGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBQZWd7XG4gICAgY29uc3RydWN0b3Ioe3NpemUgPSB7Y29sIDogMSwgcm93IDogMX0sIGNlbGxTaXplID0gMCwgY29sb3IgPSAnI0ZGRicsIGxlZnQgPSAwLCB0b3AgPSAwLCBhbmdsZSA9IDB9KXtcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5pZCA9IGBQZWcke3NpemV9LSR7RGF0ZS5ub3coKX1gO1xuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZSB8fCAwO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5ID0gW107XG5cblxuICAgICAgICB0aGlzLnJlY3RCYXNpYyA9IG5ldyBmYWJyaWMuUmVjdCh7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUgKiBzaXplLmNvbCxcbiAgICAgICAgICAgIGhlaWdodDogY2VsbFNpemUgKiBzaXplLnJvdyxcbiAgICAgICAgICAgIGZpbGw6IGNvbG9yLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjVweCA1cHggMTBweCByZ2JhKDAsMCwwLDAuMilcIiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGxldCBhcnJheUVsdHMgPSBbdGhpcy5yZWN0QmFzaWNdO1xuICAgICAgICBsZXQgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7ICAgICAgIFxuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gdGhlIHNpemUsIHdlIGRvbid0IHBsYWNlIHRoZSBjaXJjbGVzIGF0IHRoZSBzYW1lIHBsYWNlXG4gICAgICAgIGlmIChzaXplLmNvbCA9PT0gMil7XG4gICAgICAgICAgICAvLyBGb3IgYSByZWN0YW5nbGUgb3IgYSBiaWcgU3F1YXJlXG4gICAgICAgICAgICAvLyBXZSB1cGRhdGUgdGhlIHJvdyBwb3NpdGlvbnNcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT5hcnJheUVsdHMucHVzaChjaXJjbGUuY2FudmFzRWx0KSk7XG5cbiAgICAgICAgLy8gVGhlIHBlZyBpcyBsb2NrZWQgaW4gYWxsIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKGFycmF5RWx0cywge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5sZWZ0LFxuICAgICAgICAgICAgdG9wOiB0aGlzLnRvcCxcbiAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxuICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2UgYWRkIHRvIEZhYnJpY0VsZW1lbnQgYSByZWZlcmVuY2UgdG8gdGhlIGN1cmVudCBwZWdcbiAgICAgICAgdGhpcy5ncm91cC5wYXJlbnRQZWcgPSB0aGlzOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gVGhlIEZhYnJpY0pTIGVsZW1lbnRcbiAgICBnZXQgY2FudmFzRWx0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwO1xuICAgIH1cblxuICAgIC8vIFRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIHJlcGxhY2VkXG4gICAgZ2V0IHJlcGxhY2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXBsYWNlXG4gICAgfVxuXG4gICAgLy8gU2V0dGVyIGZvciBpc1JlcGxhY2UgcGFyYW1cbiAgICBzZXQgcmVwbGFjZShyZXBsYWNlKXtcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSByZXBsYWNlO1xuICAgIH1cblxuICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHBlZ1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnJlY3RCYXNpYy5zZXQoJ2ZpbGwnLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+IGNpcmNsZS5jaGFuZ2VDb2xvcihjb2xvcikpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gTW92ZSB0aGUgcGVnIHRvIGRlc2lyZSBwb3NpdGlvblxuICAgIG1vdmUobGVmdCwgdG9wKXtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcbiAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgbGVmdCA6IGxlZnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUm90YXRlIHRoZSBwZWcgdG8gdGhlIGRlc2lyZSBhbmdsZVxuICAgIHJvdGF0ZShhbmdsZSl7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xuICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxuICAgICAgICB9KTtcbiAgICB9XG5cbn0iXX0=
