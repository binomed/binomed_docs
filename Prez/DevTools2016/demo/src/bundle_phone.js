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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHNjcmlwdHNcXGFwcF9waG9uZS5qcyIsInNyY1xcc2NyaXB0c1xcY2FudmFzXFxsZWdvQ2FudmFzLmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGNvbnN0LmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGxlZ29Db2xvcnMuanMiLCJzcmNcXHNjcmlwdHNcXGNvbW1vblxcdXRpbC5qcyIsInNyY1xcc2NyaXB0c1xcZmlyZWJhc2VcXGZpcmViYXNlLmpzIiwic3JjXFxzY3JpcHRzXFxmaXJlYmFzZVxcZmlyZWJhc2VBdXRoLmpzIiwic3JjXFxzY3JpcHRzXFxsZWdvX3NoYXBlXFxjaXJjbGUuanMiLCJzcmNcXHNjcmlwdHNcXGxlZ29fc2hhcGVcXHBlZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBLENBQUMsWUFBWTs7QUFFVCxRQUFJLFdBQVcsS0FBZjtBQUFBLFFBQXFCO0FBQ2pCLG1CQUFlLElBRG5CO0FBQUEsUUFDeUI7QUFDckIsaUJBQWEsSUFGakI7QUFBQSxRQUV1QjtBQUNuQixXQUFPLElBSFg7QUFBQSxRQUdpQjtBQUNiLGlCQUFhLElBSmpCO0FBQUEsUUFJdUI7QUFDbkIsWUFBUSxDQUxaOztBQVFBLGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIscUJBQWEsK0JBQW1CLFlBQW5CLEVBQWlDLElBQWpDLENBQWI7O0FBRUEsVUFBRSxnQkFBRixFQUFvQixRQUFwQixDQUE2QjtBQUN6Qiw2QkFBaUIsSUFEUTtBQUV6Qix5QkFBYSxJQUZZO0FBR3pCLHlDQUh5QjtBQUl6Qiw0Q0FKeUI7QUFLekIsb0JBQVEsZ0JBQVUsS0FBVixFQUFpQjtBQUNyQiwyQkFBVyxXQUFYLENBQXVCLE1BQU0sV0FBTixFQUF2QjtBQUNIO0FBUHdCLFNBQTdCO0FBU0g7O0FBRUQsYUFBUyxRQUFULEdBQW9C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LCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtMRUdPX0NPTE9SU30gZnJvbSAnLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XHJcbmltcG9ydCB7QkFTRV9MRUdPX0NPTE9SfSBmcm9tICcuL2NvbW1vbi9jb25zdC5qcyc7XHJcbmltcG9ydCB7RmlyZUJhc2VMZWdvQXBwfSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlLmpzJztcclxuaW1wb3J0IHtGaXJlQmFzZUF1dGh9IGZyb20gJy4vZmlyZWJhc2UvZmlyZWJhc2VBdXRoLmpzJztcclxuaW1wb3J0IHtMZWdvR3JpZENhbnZhc30gZnJvbSAnLi9jYW52YXMvbGVnb0NhbnZhcy5qcyc7XHJcblxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBsZXQgZ2FtZUluaXQgPSBmYWxzZSwvLyB0cnVlIGlmIHdlIGluaXQgdGhlIGxlZ29HcmlkXHJcbiAgICAgICAgZmlyZUJhc2VMZWdvID0gbnVsbCwgLy8gdGhlIHJlZmVyZW5jZSBvZiB0aGUgZmlyZUJhc2VBcHBcclxuICAgICAgICBsZWdvQ2FudmFzID0gbnVsbCwgLy8gVGhlIGxlZ29HcmlkXHJcbiAgICAgICAga2V5cyA9IG51bGwsIC8vIFRoZSBrZXlzIG9mIGZpcmVuYXNlIHN1Ym1pdCBkcmF3IFxyXG4gICAgICAgIHNuYXBzaG90RmIgPSBudWxsLCAvLyBUaGUgc25hcHNob3Qgb2Ygc3VibWl0IGRyYXdcclxuICAgICAgICBpbmRleCA9IDA7IFxyXG5cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XHJcblxyXG4gICAgICAgIGxlZ29DYW52YXMgPSBuZXcgTGVnb0dyaWRDYW52YXMoJ2NhbnZhc0RyYXcnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgJChcIiNjb2xvci1waWNrZXIyXCIpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgc2hvd1BhbGV0dGVPbmx5OiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3I6IEJBU0VfTEVHT19DT0xPUixcclxuICAgICAgICAgICAgcGFsZXR0ZTogTEVHT19DT0xPUlMsXHJcbiAgICAgICAgICAgIGNoYW5nZTogZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdvQ2FudmFzLmNoYW5nZUNvbG9yKGNvbG9yLnRvSGV4U3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XHJcblxyXG4gICAgICAgIGZpcmVCYXNlTGVnbyA9IG5ldyBGaXJlQmFzZUxlZ29BcHAoKS5hcHA7XHJcbiAgICAgICAgLy8gV2UgaW5pdCB0aGUgYXV0aGVudGljYXRpb24gb2JqZWN0IFxyXG4gICAgICAgIGxldCBmaXJlQmFzZUF1dGggPSBuZXcgRmlyZUJhc2VBdXRoKHtcclxuICAgICAgICAgICAgaWREaXZMb2dpbjogJ2xvZ2luLW1zZycsXHJcbiAgICAgICAgICAgIGlkTmV4dERpdjogJ2hlbGxvLW1zZycsXHJcbiAgICAgICAgICAgIGlkTG9nb3V0OiAnc2lnbm91dCcsXHJcbiAgICAgICAgICAgIGlkSW1nOiBcImltZy11c2VyXCIsXHJcbiAgICAgICAgICAgIGlkRGlzcGxheU5hbWU6IFwibmFtZS11c2VyXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBDaW5lbWF0aWMgQnV0dG9uc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0QnRuJyk7XHJcbiAgICAgICAgY29uc3QgaGVscEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxwJylcclxuXHJcbiAgICAgICAgY29uc3Qgc3RyZWFtU3RhcnQgPSBSeC5PYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoc3RhcnRCdG4sICdjbGljaycpXHJcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gJ3N0YXJ0Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0cmVhbUhlbHAgPSBSeC5PYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoaGVscEJ0biwgJ2NsaWNrJylcclxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnaGVscCcpO1xyXG5cclxuICAgICAgICBzdHJlYW1TdGFydC5tZXJnZShzdHJlYW1IZWxwKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnc3RhcnQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbGxvLW1zZycpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLXBpY2tlcjInKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxwJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWdhbWVJbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGltZW91dCBuZWVkZWQgdG8gc3RhcnQgdGhlIHJlbmRlcmluZyBvZiBsb2FkaW5nIGFuaW1hdGlvbiAoZWxzZSB3aWxsIG5vdCBiZSBzaG93KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lSW5pdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdEdhbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09ICdoZWxwJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxsby1tc2cnKS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIHN1Ym1pc3Npb25cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0blN1Ym1pc3Npb24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgLy8gV2hlbiB3ZSBzdWJtaXQgYSBkcmF3LCB3ZSBzYXZlIGl0IG9uIGZpcmViYXNlIHRyZWUgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKFwiL2RyYXdcIikucHVzaChsZWdvQ2FudmFzLmV4cG9ydChmaXJlQmFzZUF1dGguZGlzcGxheU5hbWUoKSwgZmlyZUJhc2VBdXRoLnVzZXJJZCgpKSk7XHJcbiAgICAgICAgICAgIGxlZ29DYW52YXMucmVzZXRCb2FyZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIG1lbnUgaXRlbXNcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgbWVudUdhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJyk7XHJcbiAgICAgICAgY29uc3QgbWVudUNyZWF0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBjb25zdCBzdHJlYW1HYW1lID0gUnguT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuZnJvbUV2ZW50KG1lbnVHYW1lLCAnY2xpY2snKVxyXG4gICAgICAgICAgICAubWFwKCgpID0+ICdnYW1lJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0cmVhbUNyZWF0aW9ucyA9IFJ4Lk9ic2VydmFibGVcclxuICAgICAgICAgICAgLmZyb21FdmVudChtZW51Q3JlYXRpb25zLCAnY2xpY2snKVxyXG4gICAgICAgICAgICAubWFwKCgpID0+ICdjcmVhdGlvbnMnKTtcclxuXHJcbiAgICAgICAgc3RyZWFtR2FtZS5tZXJnZShzdHJlYW1DcmVhdGlvbnMpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09ICdnYW1lJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY29udGVudCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdHRlZCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19kcmF3ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX29iZnVzY2F0b3InKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHN0YXRlID09PSAnY3JlYXRpb25zJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY29udGVudCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXR0ZWQnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19kcmF3ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX29iZnVzY2F0b3InKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZihgZHJhd1NhdmVkLyR7ZmlyZUJhc2VBdXRoLnVzZXJJZCgpfWApLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24gKHNuYXBzaG90KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbmFwc2hvdCAmJiBzbmFwc2hvdC52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc25hcHNob3QudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc25hcHNob3RGYiA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJhdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGRyYXcgIScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFjayB0cmlnZ2VyZWQgd2l0aCBQRVJNSVNTSU9OX0RFTklFRFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgQnV0dG9ucyBmb3IgY2hhbmdpbmcgb2YgZHJhd1xyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCBidG5MZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bkxlZnQnKTtcclxuICAgICAgICBjb25zdCBidG5SaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5SaWdodCcpO1xyXG5cclxuICAgICAgICBjb25zdCBzdHJlYW1CdG5MZWZ0ID0gUnguT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGJ0bkxlZnQsJ2NsaWNrJywoKT0+aW5kZXggPSBNYXRoLm1heChpbmRleCAtIDEsIDApKTtcclxuICAgICAgICBjb25zdCBzdHJlYW1CdG5SaWdodCA9ICBSeC5PYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoYnRuUmlnaHQsICdjbGljaycsKCk9PmluZGV4ID0gTWF0aC5taW4oaW5kZXggKyAxLCBrZXlzLmxlbmd0aCAtIDEpKTtcclxuXHJcbiAgICAgICBzdHJlYW1CdG5MZWZ0Lm1lcmdlKHN0cmVhbUJ0blJpZ2h0KS5zdWJzY3JpYmUoZHJhdyk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgYSBkcmF3IGFuZCBzaG93IGl0J3Mgc3RhdGUgOiBSZWplY3RlZCBvciBBY2NlcHRlZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkcmF3KCkge1xyXG4gICAgICAgIGxldCBkcmF3ID0gc25hcHNob3RGYltrZXlzW2luZGV4XV07XHJcbiAgICAgICAgbGV0IGltZ1N1Ym1pc3Npb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nU3VibWlzc2lvbicpO1xyXG4gICAgICAgIGltZ1N1Ym1pc3Npb24uc3JjID0gZHJhdy5kYXRhVXJsO1xyXG4gICAgICAgIGlmIChkcmF3LmFjY2VwdGVkICYmICFpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjZXB0ZWQnKSkge1xyXG4gICAgICAgICAgICBpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5hZGQoJ2FjY2VwdGVkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY2NlcHRlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG5cclxuICAgIC8qIFNFUlZJQ0VfV09SS0VSX1JFUExBQ0VcclxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7ICAgICAgICBcclxuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignLi9zZXJ2aWNlLXdvcmtlci1waG9uZS5qcycsIHtzY29wZSA6IGxvY2F0aW9uLnBhdGhuYW1lfSkudGhlbihmdW5jdGlvbihyZWcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2UgV29ya2VyIFJlZ2lzdGVyIGZvciBzY29wZSA6ICVzJyxyZWcuc2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgU0VSVklDRV9XT1JLRVJfUkVQTEFDRSAqL1xyXG5cclxufSkoKTtcclxuIiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7UGVnfSBmcm9tICcuLi9sZWdvX3NoYXBlL3BlZy5qcyc7XHJcbmltcG9ydCB7Q2lyY2xlfSBmcm9tICcuLi9sZWdvX3NoYXBlL2NpcmNsZS5qcyc7XHJcbmltcG9ydCB7TkJfQ0VMTFMsIEhFQURFUl9IRUlHSFQsIEJBU0VfTEVHT19DT0xPUiwgQkFDS0dST1VORF9MRUdPX0NPTE9SfSBmcm9tICcuLi9jb21tb24vY29uc3QuanMnO1xyXG5pbXBvcnQge2xlZ29CYXNlQ29sb3J9IGZyb20gJy4uL2NvbW1vbi9sZWdvQ29sb3JzLmpzJztcclxuXHJcbi8qKlxyXG4gKiBcclxuICogQ2xhc3MgZm9yIENhbnZhcyBHcmlkXHJcbiAqIFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExlZ29HcmlkQ2FudmFzIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBzaG93Um93KSB7XHJcbiAgICAgICAgLy8gQmFzaWMgY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXNFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgLy8gU2l6ZSBvZiBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhc1JlY3QgPSB0aGlzLmNhbnZhc0VsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAvLyBJbmRpY2F0b3IgZm9yIHNob3dpbmcgdGhlIGZpcnN0IHJvdyB3aXRoIHBlZ3NcclxuICAgICAgICB0aGlzLnNob3dSb3cgPSBzaG93Um93O1xyXG4gICAgICAgIHRoaXMuY2FudmFzRWx0LndpZHRoID0gdGhpcy5jYW52YXNSZWN0LndpZHRoO1xyXG4gICAgICAgIC8vIEFjY29yZGluZyB0byBzaG93Um93LCB3ZSB3aWxsIHNob3cgbW9kaWZ5IHRoZSBoZWFkZXIgSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5oZWFkZXJIZWlnaHQgPSB0aGlzLnNob3dSb3cgPyBIRUFERVJfSEVJR0hUIDogMDtcclxuICAgICAgICB0aGlzLmNhbnZhc0VsdC5oZWlnaHQgPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGggKyB0aGlzLmhlYWRlckhlaWdodDtcclxuICAgICAgICAvLyBXZSBjYWxjdWxhdGUgdGhlIGNlbGxzaXplIGFjY29yZGluZyB0byB0aGUgc3BhY2UgdGFrZW4gYnkgdGhlIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKTtcclxuXHJcbiAgICAgICAgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgRmFicmljIEpTIGxpYnJhcnkgd2l0aCBvdXIgY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgZmFicmljLkNhbnZhcyhpZCwgeyBzZWxlY3Rpb246IGZhbHNlIH0pO1xyXG4gICAgICAgIC8vIE9iamVjdCB0aGF0IHJlcHJlc2VudCB0aGUgcGVncyBvbiB0aGUgZmlyc3Qgcm93XHJcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QgPSB7fTtcclxuICAgICAgICAvLyBUaGUgY3VycmVudCBkcmF3IG1vZGVsIChpbnN0cnVjdGlvbnMsIC4uLilcclxuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fSxcclxuICAgICAgICAvLyBGbGFnIHRvIGRldGVybWluZSBpZiB3ZSBoYXZlIHRvIGNyZWF0ZSBhIG5ldyBicmlja1xyXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3QnJpY2sgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBCQVNFX0xFR09fQ09MT1I7XHJcblxyXG4gICAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgY2FudmFzXHJcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xyXG5cclxuICAgICAgICAvLyBJZiB3ZSBzaG93IHRoZSByb3csIHdlIGhhdmUgdG8gcGx1ZyB0aGUgbW92ZSBtYW5hZ2VtZW50XHJcbiAgICAgICAgaWYgKHNob3dSb3cpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6c2VsZWN0ZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWcgPyBvcHRpb25zLnRhcmdldCA6IG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignc2VsZWN0aW9uOmNsZWFyZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6bW92aW5nJywgKG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwZWcgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWc7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBuZXdMZWZ0ID0gTWF0aC5yb3VuZChvcHRpb25zLnRhcmdldC5sZWZ0IC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1RvcCA9IE1hdGgucm91bmQoKG9wdGlvbnMudGFyZ2V0LnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0KSAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSArIHRoaXMuaGVhZGVySGVpZ2h0OyAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlIHRvcFxyXG4gICAgICAgICAgICAgICAgbGV0IHRvcENvbXB1dGUgPSBuZXdUb3AgKyAocGVnLnNpemUucm93ID09PSAyIHx8IHBlZy5hbmdsZSA+IDAgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxlZnRDb21wdXRlID0gbmV3TGVmdCArIChwZWcuc2l6ZS5jb2wgPT09IDIgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICAgICAgcGVnLm1vdmUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdCwgLy9sZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wIC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXZSBzcGVjaWZ5IHRoYXQgd2UgY291bGQgcmVtb3ZlIGEgcGVnIGlmIG9uZSBvZiBpdCdzIGVkZ2UgdG91Y2ggdGhlIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA8IEhFQURFUl9IRUlHSFRcclxuICAgICAgICAgICAgICAgICAgICB8fCBuZXdMZWZ0IDwgMFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IHRvcENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgfHwgbGVmdENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFbHNlIHdlIGNoZWNrIHdlIGNyZWF0ZSBhIG5ldyBwZWcgKHdoZW4gYSBwZWcgZW50ZXIgaW4gdGhlIGRyYXcgYXJlYSlcclxuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZy5yZXBsYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5jb2wgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5yb3cgPT09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmIChwZWcuYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZy5yZXBsYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdtb3VzZTp1cCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCcmlja1xyXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy50b1JlbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5yZXBsYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuYnJpY2tNb2RlbFt0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcuaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZSh0aGlzLmN1cnJlbnRCcmljayk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWV0aG9kIGZvciBjaGFuZ2luZyB0aGUgY29sb3Igb2YgdGhlIGZpcnN0IHJvdyBcclxuICAgICAqL1xyXG4gICAgY2hhbmdlQ29sb3IoY29sb3IpIHtcclxuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IGNvbG9yOyAgICAgICBcclxuICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xyXG4gICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5jaGFuZ2VDb2xvcihjb2xvcik7XHJcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdC5jaGFuZ2VDb2xvcihjb2xvcik7XHJcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VyaWFsaXplIHRoZSBjYW52YXMgdG8gYSBtaW5pbWFsIG9iamVjdCB0aGF0IGNvdWxkIGJlIHRyZWF0IGFmdGVyXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCh1c2VyTmFtZSwgdXNlcklkKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdEFycmF5ID0gW107XHJcbiAgICAgICAgLy8gV2UgZmlsdGVyIHRoZSByb3cgcGVnc1xyXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5icmlja01vZGVsKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChrZXkpPT5rZXkgIT0gdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmlkXHJcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmlkXHJcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QucmVjdC5pZFxyXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmlkKTtcclxuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGVnVG1wID0gdGhpcy5icmlja01vZGVsW2tleV07XHJcbiAgICAgICAgICAgIHJlc3VsdEFycmF5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgc2l6ZTogcGVnVG1wLnNpemUsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogcGVnVG1wLmNvbG9yLFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6IHBlZ1RtcC5hbmdsZSxcclxuICAgICAgICAgICAgICAgIHRvcDogcGVnVG1wLnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogcGVnVG1wLmxlZnQsXHJcbiAgICAgICAgICAgICAgICBjZWxsU2l6ZSA6IHRoaXMuY2VsbFNpemVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXNlcjogdXNlck5hbWUsXHJcbiAgICAgICAgICAgIHVzZXJJZCA6IHVzZXJJZCxcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zOiByZXN1bHRBcnJheVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEcmF3IGZyb20gaW50cnVjdGlvbnMgYSBkcmF3XHJcbiAgICAgKi9cclxuICAgIGRyYXdJbnN0cnVjdGlvbnMoaW5zdHJ1Y3Rpb25PYmplY3Qpe1xyXG4gICAgICAgIHRoaXMucmVzZXRCb2FyZCgpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgaW5zdHJ1Y3Rpb25PYmplY3QuaW5zdHJ1Y3Rpb25zLmZvckVhY2goKGluc3RydWN0aW9uKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVCcmljayh7IHNpemUgOiBpbnN0cnVjdGlvbi5zaXplLCBcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0IDogKGluc3RydWN0aW9uLmxlZnQgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IChpbnN0cnVjdGlvbi50b3AgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlIDogaW5zdHJ1Y3Rpb24uYW5nbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgOiBpbnN0cnVjdGlvbi5jb2xvclxyXG4gICAgICAgICAgICAgICAgfSkuY2FudmFzRWx0XHJcbiAgICAgICAgICAgICAgICApOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhbiB0aGUgYm9hcmQgYW5kIHRoZSBzdGF0ZSBvZiB0aGUgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHJlc2V0Qm9hcmQoKXtcclxuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBHZW5lcmF0ZSBhIEJhc2U2NCBpbWFnZSBmcm9tIHRoZSBjYW52YXNcclxuICAgICAqL1xyXG4gICAgc25hcHNob3QoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIFByaXZhdGVzIE1ldGhvZHNcclxuICAgICAqIFxyXG4gICAgICovXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRHJhdyB0aGUgYmFzaWMgZ3JpZCBcclxuICAgICovXHJcbiAgICBfZHJhd0dyaWQoc2l6ZSkgeyAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5zaG93Um93KXtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlU3F1YXJlKDEpLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0XHJcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0XHJcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVJlY3QoMSw5MCkuY2FudmFzRWx0XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRHJhdyBhbGwgdGhlIHdoaXRlIHBlZyBvZiB0aGUgZ3JpZFxyXG4gICAgICovXHJcbiAgICBfZHJhd1doaXRlUGVnKHNpemUpe1xyXG4gICAgICAgIC8vIFdlIHN0b3AgcmVuZGVyaW5nIG9uIGVhY2ggYWRkLCBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlc1xyXG4gICAgICAgIC8vdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgbWF4ID0gTWF0aC5yb3VuZChzaXplIC8gdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgbGV0IG1heFNpemUgPSBtYXggKiB0aGlzLmNlbGxTaXplO1xyXG4gICAgICAgIGZvciAodmFyIHJvdyA9MDsgcm93IDwgbWF4OyByb3crKyl7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1heDsgY29sKysgKXtcclxuICAgICAgICAgICAgICAgICBsZXQgc3F1YXJlVG1wID0gbmV3IGZhYnJpYy5SZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbFNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogQkFDS0dST1VORF9MRUdPX0NPTE9SLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjaXJjbGUgPSBuZXcgQ2lyY2xlKHRoaXMuY2VsbFNpemUsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUik7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGUuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNCb3JkZXJzIDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwVG1wID0gbmV3IGZhYnJpYy5Hcm91cChbc3F1YXJlVG1wLCBjaXJjbGUuY2FudmFzRWx0XSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuY2VsbFNpemUgKiBjb2wsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLmNlbGxTaXplICogcm93ICsgdGhpcy5oZWFkZXJIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNCb3JkZXJzIDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKGdyb3VwVG1wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvKnRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gdHJ1ZTtcclxuICAgICAgICAvLyBXZSB0cmFuc2Zvcm0gdGhlIGNhbnZhcyB0byBhIGJhc2U2NCBpbWFnZSBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlcy5cclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTsgICAgIFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEJhY2tncm91bmRJbWFnZSh1cmwsdGhpcy5jYW52YXMucmVuZGVyQWxsLmJpbmQodGhpcy5jYW52YXMpLCB7XHJcbiAgICAgICAgICAgIG9yaWdpblg6ICdsZWZ0JyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogdGhpcy5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgIH0pOyAgICovXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBob3Jpem9udGFsIG9yIHZlcnRpY2FsIHJlY3RhbmdsZVxyXG4gICAgICovXHJcbiAgICBfY3JlYXRlUmVjdChzaXplUmVjdCwgYW5nbGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xyXG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAyICogc2l6ZVJlY3QsIHJvdyA6MSAqIHNpemVSZWN0fSwgXHJcbiAgICAgICAgICAgICAgICBsZWZ0IDogYW5nbGUgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDQpIC0gdGhpcy5jZWxsU2l6ZSkgOiAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAqIDMgLyA0KSAtICh0aGlzLmNlbGxTaXplICogMS41KSksXHJcbiAgICAgICAgICAgICAgICB0b3AgOiBhbmdsZSA/IDEgOiAwLFxyXG4gICAgICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIHNxdWFyZSAoMXgxKSBvciAoMngyKVxyXG4gICAgICovXHJcbiAgICBfY3JlYXRlU3F1YXJlKHNpemVTcXVhcmUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xyXG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAxICogc2l6ZVNxdWFyZSwgcm93IDoxICogc2l6ZVNxdWFyZX0sIFxyXG4gICAgICAgICAgICAgICAgbGVmdDogc2l6ZVNxdWFyZSA9PT0gMiA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gMikgLSAoMiAqIHRoaXMuY2VsbFNpemUpKSA6ICh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxyXG4gICAgICAgICAgICAgICAgdG9wIDogc2l6ZVNxdWFyZSA9PT0gMiA/IDEgOiAwLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyaWMgbWV0aG9kIHRoYXQgY3JlYXRlIGEgcGVnXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVCcmljayhvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucy5jZWxsU2l6ZSA9IHRoaXMuY2VsbFNpemU7XHJcbiAgICAgICAgb3B0aW9ucy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgdGhpcy5sYXN0Q29sb3I7XHJcbiAgICAgICAgbGV0IHBlZyA9IG5ldyBQZWcob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5icmlja01vZGVsW3BlZy5pZF0gPSBwZWc7XHJcbiAgICAgICAgLy8gV2UgaGF2ZSB0byB1cGRhdGUgdGhlIHJvd1NlbGVjdCBPYmplY3QgdG8gYmUgYWxzd2F5IHVwZGF0ZVxyXG4gICAgICAgIGlmIChvcHRpb25zLnNpemUucm93ID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZSA9IHBlZztcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYW5nbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QgPSBwZWc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNpemUuY29sID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QgPSBwZWc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlID0gcGVnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGVnO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgdGhlIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBfZHJhd0NhbnZhcygpIHtcclxuICAgICAgICB0aGlzLl9kcmF3V2hpdGVQZWcodGhpcy5jYW52YXNSZWN0LndpZHRoKTtcclxuICAgICAgICB0aGlzLl9kcmF3R3JpZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGgsIE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpKTtcclxuICAgIH1cclxuICAgIFxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuLy8gTnVtYmVyIG9mIGNlbGwgb24gdGhlIGdyaWRcclxuZXhwb3J0IGNvbnN0IE5CX0NFTExTID0gMTU7XHJcblxyXG4vLyBIZWlnaHQgb2YgdGhlIGhlYWRlclxyXG5leHBvcnQgY29uc3QgSEVBREVSX0hFSUdIVCA9IHdpbmRvdy5zY3JlZW4ud2lkdGggPD0gNzY4ICA/IDYwIDogMTAwO1xyXG5cclxuLy8gRmlyc3QgY29sb3IgdG8gdXNlXHJcbmV4cG9ydCBjb25zdCBCQVNFX0xFR09fQ09MT1IgPSBcIiMwZDY5ZjJcIjtcclxuXHJcbi8vIE1lZGl1bSBTdG9uZSBHcmV5IFxyXG5jb25zdCBDT0xPUl8xOTQgPSBcIiNhM2EyYTRcIjtcclxuXHJcbi8vIExpZ2h0IFN0b25lIEdyZXlcclxuY29uc3QgQ09MT1JfMjA4ID0gXCIjZTVlNGRlXCI7IFxyXG5cclxuLy8gQmFja2dyb3VuZCBjb2xvciB1c2VkXHJcbmV4cG9ydCBjb25zdCBCQUNLR1JPVU5EX0xFR09fQ09MT1IgPSBDT0xPUl8yMDg7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG4vKlxyXG4qIENvbG9ycyBmcm9tIFxyXG4qIGh0dHA6Ly9sZWdvLndpa2lhLmNvbS93aWtpL0NvbG91cl9QYWxldHRlIFxyXG4qIEFuZCBodHRwOi8vd3d3LnBlZXJvbi5jb20vY2dpLWJpbi9pbnZjZ2lzL2NvbG9yZ3VpZGUuY2dpXHJcbiogT25seSBTaG93IHRoZSBjb2xvciB1c2Ugc2luY2UgMjAxMFxyXG4qKi8gXHJcbmV4cG9ydCBjb25zdCBMRUdPX0NPTE9SUyA9IFtcclxuICAgICdyZ2IoMjQ1LCAyMDUsIDQ3KScsIC8vMjQsIEJyaWdodCBZZWxsb3cgKlxyXG4gICAgJ3JnYigyNTMsIDIzNCwgMTQwKScsIC8vMjI2LCBDb29sIFllbGxvdyAqXHJcbiAgICAncmdiKDIxOCwgMTMzLCA2NCknLCAvLzEwNiwgQnJpZ2h0IE9yYW5nZSAqXHJcbiAgICAncmdiKDIzMiwgMTcxLCA0NSknLCAvLzE5MSwgRmxhbWUgWWVsbG93aXNoIE9yYW5nZSAqXHJcbiAgICAncmdiKDE5NiwgNDAsIDI3KScsIC8vMjEsIEJyaWdodCBSZWQgKlxyXG4gICAgJ3JnYigxMjMsIDQ2LCA0NyknLCAvLzE1NCwgRGFyayBSZWQgKlxyXG4gICAgJ3JnYigyMDUsIDk4LCAxNTIpJywgLy8yMjEsIEJyaWdodCBQdXJwbGUgKlxyXG4gICAgJ3JnYigyMjgsIDE3MywgMjAwKScsIC8vMjIyLCBMaWdodCBQdXJwbGUgKlxyXG4gICAgJ3JnYigxNDYsIDU3LCAxMjApJywgLy8xMjQsIEJyaWdodCBSZWRkaXNoIFZpb2xldCAqXHJcbiAgICAncmdiKDUyLCA0MywgMTE3KScsIC8vMjY4LCBNZWRpdW0gTGlsYWMgKlxyXG4gICAgJ3JnYigxMywgMTA1LCAyNDIpJywgLy8yMywgQnJpZ2h0IEJsdWUgKlxyXG4gICAgJ3JnYigxNTksIDE5NSwgMjMzKScsIC8vMjEyLCBMaWdodCBSb3lhbCBCbHVlICpcclxuICAgICdyZ2IoMTEwLCAxNTMsIDIwMSknLCAvLzEwMiwgTWVkaXVtIEJsdWUgKlxyXG4gICAgJ3JnYigzMiwgNTgsIDg2KScsIC8vMTQwLCBFYXJ0aCBCbHVlICpcclxuICAgICdyZ2IoMTE2LCAxMzQsIDE1NiknLCAvLzEzNSwgU2FuZCBCbHVlICpcclxuICAgICdyZ2IoNDAsIDEyNywgNzApJywgLy8yOCwgRGFyayBHcmVlbiAqXHJcbiAgICAncmdiKDc1LCAxNTEsIDc0KScsIC8vMzcsIEJpcmdodCBHcmVlbiAqXHJcbiAgICAncmdiKDEyMCwgMTQ0LCAxMjkpJywgLy8xNTEsIFNhbmQgR3JlZW4gKlxyXG4gICAgJ3JnYigzOSwgNzAsIDQ0KScsIC8vMTQxLCBFYXJ0aCBHcmVlbiAqXHJcbiAgICAncmdiKDE2NCwgMTg5LCA3MCknLCAvLzExOSwgQnJpZ2h0IFllbGxvd2lzaC1HcmVlbiAqIFxyXG4gICAgJ3JnYigxMDUsIDY0LCAzOSknLCAvLzE5MiwgUmVkZGlzaCBCcm93biAqXHJcbiAgICAncmdiKDIxNSwgMTk3LCAxNTMpJywgLy81LCBCcmljayBZZWxsb3cgKiBcclxuICAgICdyZ2IoMTQ5LCAxMzgsIDExNSknLCAvLzEzOCwgU2FuZCBZZWxsb3cgKlxyXG4gICAgJ3JnYigxNzAsIDEyNSwgODUpJywgLy8zMTIsIE1lZGl1bSBOb3VnYXQgKiAgICBcclxuICAgICdyZ2IoNDgsIDE1LCA2KScsIC8vMzA4LCBEYXJrIEJyb3duICpcclxuICAgICdyZ2IoMjA0LCAxNDIsIDEwNCknLCAvLzE4LCBOb3VnYXQgKlxyXG4gICAgJ3JnYigyNDUsIDE5MywgMTM3KScsIC8vMjgzLCBMaWdodCBOb3VnYXQgKlxyXG4gICAgJ3JnYigxNjAsIDk1LCA1MiknLCAvLzM4LCBEYXJrIE9yYW5nZSAqXHJcbiAgICAncmdiKDI0MiwgMjQzLCAyNDIpJywgLy8xLCBXaGl0ZSAqXHJcbiAgICAncmdiKDIyOSwgMjI4LCAyMjIpJywgLy8yMDgsIExpZ2h0IFN0b25lIEdyZXkgKlxyXG4gICAgJ3JnYigxNjMsIDE2MiwgMTY0KScsIC8vMTk0LCBNZWRpdW0gU3RvbmUgR3JleSAqXHJcbiAgICAncmdiKDk5LCA5NSwgOTcpJywgLy8xOTksIERhcmsgU3RvbmUgR3JleSAqXHJcbiAgICAncmdiKDI3LCA0MiwgNTIpJywgLy8yNiwgQmxhY2sgKiAgICAgICAgXHJcbl07IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBhIHZhcmlhdGlvbiBvZiBjb2xvclxyXG4gKiBcclxuICogRnJvbSA6IGh0dHBzOi8vd3d3LnNpdGVwb2ludC5jb20vamF2YXNjcmlwdC1nZW5lcmF0ZS1saWdodGVyLWRhcmtlci1jb2xvci9cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBDb2xvckx1bWluYW5jZShoZXgsIGx1bSkge1xyXG5cclxuICAgICAgICAvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXHJcbiAgICAgICAgaGV4ID0gU3RyaW5nKGhleCkucmVwbGFjZSgvW14wLTlhLWZdL2dpLCAnJyk7XHJcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPCA2KSB7XHJcbiAgICAgICAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbHVtID0gbHVtIHx8IDA7XHJcblxyXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcclxuICAgICAgICB2YXIgcmdiID0gXCIjXCIsIGMsIGk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICBjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpICogMiwgMiksIDE2KTtcclxuICAgICAgICAgICAgYyA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgYyArIChjICogbHVtKSksIDI1NSkpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgcmdiICs9IChcIjAwXCIgKyBjKS5zdWJzdHIoYy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJnYjtcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuLyoqXHJcbiAqIEJhc2ljIEZpcmViYXNlIGhlbHBlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpcmVCYXNlTGVnb0FwcHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLy8gQ29uZmlndXJhdGlvbiBvZiB0aGUgYXBwbGljYXRpb24sIFlvdSBzaG91bGQgdXBkYXRlIHdpdGggeW91ciBLZXlzICFcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgICAgICAgYXBpS2V5OiBcIkFJemFTeURyOVI4NXROamZLV2RkVzEtTjdYSnBBaEdxWE5HYUo1a1wiLFxyXG4gICAgICAgICAgICBhdXRoRG9tYWluOiBcImxlZ29ubmFyeS5maXJlYmFzZWFwcC5jb21cIixcclxuICAgICAgICAgICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9sZWdvbm5hcnkuZmlyZWJhc2Vpby5jb21cIixcclxuICAgICAgICAgICAgc3RvcmFnZUJ1Y2tldDogXCJcIixcclxuICAgICAgICB9IFxyXG5cclxuICAgICAgICB0aGlzLmFwcCA9IGZpcmViYXNlLmluaXRpYWxpemVBcHAodGhpcy5jb25maWcpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBnZW5lcmljIG1hbmFnZW1lbnQgb2YgQXV0aGVudGljYXRpb24gd2l0aCBmaXJlYmFzZS5cclxuICogXHJcbiAqIEl0IHRha2VzIGNhcmUgb2YgaHRtbCB0byBoaWRlIG9yIHNob3dcclxuICovXHJcbmV4cG9ydCBjbGFzcyBGaXJlQmFzZUF1dGh7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpe1xyXG4gICAgICBcclxuICAgICAgICBsZXQgdWlDb25maWcgPSB7XHJcbiAgICAgICAgICAgICdjYWxsYmFja3MnOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgc2lnbmVkIGluLlxyXG4gICAgICAgICAgICAgICAgJ3NpZ25JblN1Y2Nlc3MnOiBmdW5jdGlvbih1c2VyLCBjcmVkZW50aWFsLCByZWRpcmVjdFVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCByZWRpcmVjdC5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIE9wZW5zIElEUCBQcm92aWRlcnMgc2lnbi1pbiBmbG93IGluIGEgcG9wdXAuXHJcbiAgICAgICAgICAgICdzaWduSW5GbG93JzogJ3BvcHVwJyxcclxuICAgICAgICAgICAgJ3NpZ25Jbk9wdGlvbnMnOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlcjogZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXHJcbiAgICAgICAgICAgICAgICBzY29wZXM6IFsnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9wbHVzLmxvZ2luJ11cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkZhY2Vib29rQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxyXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UuYXV0aC5Ud2l0dGVyQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxyXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UuYXV0aC5HaXRodWJBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkVtYWlsQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lEXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIFRlcm1zIG9mIHNlcnZpY2UgdXJsLlxyXG4gICAgICAgICAgICAndG9zVXJsJzogJ2h0dHBzOi8vZ2RnbmFudGVzLmNvbSdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgZmlyZWJhc2V1aS5hdXRoLkF1dGhVSShmaXJlYmFzZS5hdXRoKCkpO1xyXG4gICAgICAgIHRoaXMudWkuc3RhcnQoJyNmaXJlYmFzZXVpLWF1dGgtY29udGFpbmVyJywgdWlDb25maWcpO1xyXG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pZERpdkxvZ2luID0gY29uZmlnLmlkRGl2TG9naW47XHJcbiAgICAgICAgdGhpcy5pZE5leHREaXYgPSBjb25maWcuaWROZXh0RGl2O1xyXG4gICAgICAgIHRoaXMuaWRMb2dvdXQgPSBjb25maWcuaWRMb2dvdXQ7XHJcblxyXG4gICAgICAgIC8vIE9wdGlvbmFsc1xyXG4gICAgICAgIHRoaXMuaWRJbWcgPSBjb25maWcuaWRJbWcgPyBjb25maWcuaWRJbWcgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuaWREaXNwbGF5TmFtZSA9IGNvbmZpZy5pZERpc3BsYXlOYW1lID8gY29uZmlnLmlkRGlzcGxheU5hbWUgOiBudWxsO1xyXG5cclxuXHJcbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZCh0aGlzLl9jaGVja0NhbGxCYWNrQ29udGV4dC5iaW5kKHRoaXMpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrQ2FsbEJhY2tFcnJvckNvbnRleHQuYmluZCh0aGlzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYkF1dGhDaGFuZ2VkID0gbnVsbDtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZExvZ291dCkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+ICBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluIGNhc2Ugb2YgZXJyb3JcclxuICAgICAqL1xyXG4gICAgX2NoZWNrQ2FsbEJhY2tFcnJvckNvbnRleHQoZXJyb3Ipe1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGJhY2sgbWV0aG9kIHdpdGggdGhlIHN0YXRlIG9mIGNvbm5lY3Rpb25cclxuICAgICAqIFxyXG4gICAgICogQWNjb3JkaW5nIHRvICd1c2VyJywgaXQgd2lsbCBzaG93IG9yIGhpZGUgc29tZSBodG1sIGFyZWFzXHJcbiAgICAgKi9cclxuICAgIF9jaGVja0NhbGxCYWNrQ29udGV4dCh1c2VyKXtcclxuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgIGlmICh1c2VyKXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpdkxvZ2luKS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZE5leHREaXYpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRJbWcpe1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc3JjID0gdXNlci5waG90b1VSTDtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkRGlzcGxheU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpc3BsYXlOYW1lKS5pbm5lckhUTUwgPSB1c2VyLmRpc3BsYXlOYW1lOzsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpdkxvZ2luKS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZE5leHREaXYpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc3JjID0gXCJcIjtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpc3BsYXlOYW1lKS5pbm5lckhUTUwgPSBcIk5vbiBDb25udGVjdMOpXCI7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmNiQXV0aENoYW5nZWQpe1xyXG4gICAgICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQodXNlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdHJhdGlvbiBvZiBjYWxsYmFjayBmb3IgZnV0dXIgaW50ZXJhY3Rpb24uXHJcbiAgICAgKiBUaGUgY2FsbGJhY2sgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdpdGggdXNlciBhcyBwYXJhbWV0ZXJcclxuICAgICAqL1xyXG4gICAgb25BdXRoU3RhdGVDaGFuZ2VkKGNiKXtcclxuICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQgPSBjYjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgbG9nZ2VkIHVzZXJcclxuICAgICAqL1xyXG4gICAgZGlzcGxheU5hbWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy51c2VyID8gdGhpcy51c2VyLmRpc3BsYXlOYW1lIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIGlkIG9mIHRoZSBjdXJyZW50IGxvZ2dlZCB1c2VyXHJcbiAgICAgKi9cclxuICAgIHVzZXJJZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXIgPyB0aGlzLnVzZXIudWlkIDogbnVsbDtcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge0NvbG9yTHVtaW5hbmNlfSBmcm9tICcuLi9jb21tb24vdXRpbC5qcyc7XHJcblxyXG4vKipcclxuICogQ2lyY2xlIExlZ28gY2xhc3NcclxuICogVGhlIGNpcmNsZSBpcyBjb21wb3NlZCBvZiAyIGNpcmNsZSAob24gdGhlIHNoYWRvdywgYW5kIHRoZSBvdGhlciBvbmUgZm9yIHRoZSB0b3ApXHJcbiAqIFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENpcmNsZXtcclxuICAgIGNvbnN0cnVjdG9yKGNlbGxTaXplLCBjb2xvcil7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYyA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcclxuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDUsXHJcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSxcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjBweCAycHggMTBweCByZ2JhKDAsMCwwLDAuMilcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4ID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xyXG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNCxcclxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSksXHJcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRleHQgPSBuZXcgZmFicmljLlRleHQoJ0dERycsIHtcclxuICAgICAgICAgICAgZm9udFNpemU6IGNlbGxTaXplIC8gNSxcclxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBzdHJva2U6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMCksXHJcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKFt0aGlzLmNpcmNsZUJhc2ljRXR4LCB0aGlzLmNpcmNsZUJhc2ljLCB0aGlzLnRleHRdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgRmFicmljSlMgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBnZXQgY2FudmFzRWx0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7IFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKi9cclxuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcclxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljLnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSk7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eC5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSk7XHJcbiAgICAgICAgdGhpcy50ZXh0LnNldCh7XHJcbiAgICAgICAgICAgIGZpbGwgOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxyXG4gICAgICAgICAgICBzdHJva2UgOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4vY2lyY2xlLmpzJztcclxuXHJcbi8qKlxyXG4gKiBQZWcgTGVnbyBjbGFzc1xyXG4gKiBUaGUgcGVnIGlzIGNvbXBvc2VkIG9mIG4gY2lyY2xlIGZvciBhIGRpbWVuc2lvbiB0aGF0IGRlcGVuZCBvbiB0aGUgc2l6ZSBwYXJhbWV0ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQZWd7XHJcbiAgICBjb25zdHJ1Y3Rvcih7c2l6ZSA9IHtjb2wgOiAxLCByb3cgOiAxfSwgY2VsbFNpemUgPSAwLCBjb2xvciA9ICcjRkZGJywgbGVmdCA9IDAsIHRvcCA9IDAsIGFuZ2xlID0gMH0pe1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5pZCA9IGBQZWcke3NpemV9LSR7RGF0ZS5ub3coKX1gO1xyXG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b1JlbW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcclxuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xyXG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZSB8fCAwO1xyXG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkgPSBbXTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVjdEJhc2ljID0gbmV3IGZhYnJpYy5SZWN0KHtcclxuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplICogc2l6ZS5jb2wsXHJcbiAgICAgICAgICAgIGhlaWdodDogY2VsbFNpemUgKiBzaXplLnJvdyxcclxuICAgICAgICAgICAgZmlsbDogY29sb3IsXHJcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjVweCA1cHggMTBweCByZ2JhKDAsMCwwLDAuMilcIiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IGFycmF5RWx0cyA9IFt0aGlzLnJlY3RCYXNpY107XHJcbiAgICAgICAgbGV0IGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7ICAgICAgIFxyXG4gICAgICAgIC8vIEFjY29yZGluZyB0byB0aGUgc2l6ZSwgd2UgZG9uJ3QgcGxhY2UgdGhlIGNpcmNsZXMgYXQgdGhlIHNhbWUgcGxhY2VcclxuICAgICAgICBpZiAoc2l6ZS5jb2wgPT09IDIpe1xyXG4gICAgICAgICAgICAvLyBGb3IgYSByZWN0YW5nbGUgb3IgYSBiaWcgU3F1YXJlXHJcbiAgICAgICAgICAgIC8vIFdlIHVwZGF0ZSB0aGUgcm93IHBvc2l0aW9uc1xyXG4gICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoLWNlbGxTaXplICs1KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XHJcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgbGVmdDogMFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcclxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xyXG5cclxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxyXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+YXJyYXlFbHRzLnB1c2goY2lyY2xlLmNhbnZhc0VsdCkpO1xyXG5cclxuICAgICAgICAvLyBUaGUgcGVnIGlzIGxvY2tlZCBpbiBhbGwgcG9zaXRpb25cclxuICAgICAgICB0aGlzLmdyb3VwID0gbmV3IGZhYnJpYy5Hcm91cChhcnJheUVsdHMsIHtcclxuICAgICAgICAgICAgbGVmdDogdGhpcy5sZWZ0LFxyXG4gICAgICAgICAgICB0b3A6IHRoaXMudG9wLFxyXG4gICAgICAgICAgICBhbmdsZTogdGhpcy5hbmdsZSxcclxuICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcclxuICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcclxuICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcclxuICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gV2UgYWRkIHRvIEZhYnJpY0VsZW1lbnQgYSByZWZlcmVuY2UgdG8gdGhlIGN1cmVudCBwZWdcclxuICAgICAgICB0aGlzLmdyb3VwLnBhcmVudFBlZyA9IHRoaXM7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGUgRmFicmljSlMgZWxlbWVudFxyXG4gICAgZ2V0IGNhbnZhc0VsdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIHJlcGxhY2VkXHJcbiAgICBnZXQgcmVwbGFjZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzUmVwbGFjZVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldHRlciBmb3IgaXNSZXBsYWNlIHBhcmFtXHJcbiAgICBzZXQgcmVwbGFjZShyZXBsYWNlKXtcclxuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IHJlcGxhY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgcGVnXHJcbiAgICBjaGFuZ2VDb2xvcihjb2xvcil7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMucmVjdEJhc2ljLnNldCgnZmlsbCcsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LmZvckVhY2goKGNpcmNsZSk9PiBjaXJjbGUuY2hhbmdlQ29sb3IoY29sb3IpKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vdmUgdGhlIHBlZyB0byBkZXNpcmUgcG9zaXRpb25cclxuICAgIG1vdmUobGVmdCwgdG9wKXtcclxuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcclxuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcclxuICAgICAgICAgICAgdG9wOiB0b3AsXHJcbiAgICAgICAgICAgIGxlZnQgOiBsZWZ0XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUm90YXRlIHRoZSBwZWcgdG8gdGhlIGRlc2lyZSBhbmdsZVxyXG4gICAgcm90YXRlKGFuZ2xlKXtcclxuICAgICAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xyXG4gICAgICAgICAgICBhbmdsZSA6IGFuZ2xlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59Il19
