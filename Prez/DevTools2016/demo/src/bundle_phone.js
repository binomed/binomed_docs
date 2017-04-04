(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _legoColors = require('./common/legoColors.js');

var _const = require('./common/const.js');

var _legoCanvas = require('./canvas/legoCanvas.js');

(function () {

    var gameInit = false,
        // true if we init the legoGrid
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
            var user = {
                name: 'User Name',
                id: 'userId'
            };
            var drawDatas = legoCanvas.export(user.name, user.id);
            drawDatas.dataUrl = legoCanvas.snapshot();
            console.info('will send : ', drawDatas);
            var URL = 'http://localhost:9000/draw/' + user.id;
            fetch(URL, {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=utf-8'
                }),
                body: JSON.stringify(drawDatas)
            }).then(function (response) {
                console.info(response);
            });
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

                var user = {
                    name: 'User Name',
                    id: 'userId'
                };
                var myInit = {
                    method: 'GET'
                };
                var URL = 'http://localhost:9000/draw/' + user.id;
                fetch(URL, myInit).then(function (snapshot) {
                    return snapshot.json();
                }).then(function (snapshot) {
                    if (snapshot) {
                        console.log(snapshot);
                        snapshotFb = snapshot;
                        keys = Object.keys(snapshotFb);
                        index = 0;
                        draw();
                    } else {
                        console.log('no draw !');
                    }
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

},{"./canvas/legoCanvas.js":2,"./common/const.js":3,"./common/legoColors.js":4}],2:[function(require,module,exports){
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
        this.canvas = new fabric.Canvas(id, {
            selection: false
        });
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
                _this3.canvas.add(_this3._createBrick({
                    size: instruction.size,
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
                size: {
                    col: 2 * sizeRect,
                    row: 1 * sizeRect
                },
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
                size: {
                    col: 1 * sizeSquare,
                    row: 1 * sizeSquare
                },
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

},{"../common/const.js":3,"../common/legoColors.js":4,"../lego_shape/circle.js":6,"../lego_shape/peg.js":7}],3:[function(require,module,exports){
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

},{"../common/util.js":5}],7:[function(require,module,exports){
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
        var _ref$size = _ref.size,
            size = _ref$size === undefined ? { col: 1, row: 1 } : _ref$size,
            _ref$cellSize = _ref.cellSize,
            cellSize = _ref$cellSize === undefined ? 0 : _ref$cellSize,
            _ref$color = _ref.color,
            color = _ref$color === undefined ? '#FFF' : _ref$color,
            _ref$left = _ref.left,
            left = _ref$left === undefined ? 0 : _ref$left,
            _ref$top = _ref.top,
            top = _ref$top === undefined ? 0 : _ref$top,
            _ref$angle = _ref.angle,
            angle = _ref$angle === undefined ? 0 : _ref$angle;

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

},{"./circle.js":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfcGhvbmUuanMiLCJzcmMvc2NyaXB0cy9jYW52YXMvbGVnb0NhbnZhcy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9jb25zdC5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9sZWdvQ29sb3JzLmpzIiwic3JjL3NjcmlwdHMvY29tbW9uL3V0aWwuanMiLCJzcmMvc2NyaXB0cy9sZWdvX3NoYXBlL2NpcmNsZS5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvcGVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBS0EsQ0FBQyxZQUFZOztBQUVULFFBQUksV0FBVyxLQUFmO0FBQUEsUUFBc0I7QUFDbEIsaUJBQWEsSUFEakI7QUFBQSxRQUN1QjtBQUNuQixXQUFPLElBRlg7QUFBQSxRQUVpQjtBQUNiLGlCQUFhLElBSGpCO0FBQUEsUUFHdUI7QUFDbkIsWUFBUSxDQUpaOztBQU9BLGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIscUJBQWEsK0JBQW1CLFlBQW5CLEVBQWlDLElBQWpDLENBQWI7O0FBRUEsVUFBRSxnQkFBRixFQUFvQixRQUFwQixDQUE2QjtBQUN6Qiw2QkFBaUIsSUFEUTtBQUV6Qix5QkFBYSxJQUZZO0FBR3pCLHlDQUh5QjtBQUl6Qiw0Q0FKeUI7QUFLekIsb0JBQVEsZ0JBQVUsS0FBVixFQUFpQjtBQUNyQiwyQkFBVyxXQUFYLENBQXVCLE1BQU0sV0FBTixFQUF2QjtBQUNIO0FBUHdCLFNBQTdCO0FBU0g7O0FBRUQsYUFBUyxRQUFULEdBQW9COztBQUdoQjs7O0FBR0EsWUFBTSxXQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUFqQjtBQUNBLFlBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBaEI7O0FBRUEsWUFBTSxjQUFjLEdBQUcsVUFBSCxDQUNmLFNBRGUsQ0FDTCxRQURLLEVBQ0ssT0FETCxFQUVmLEdBRmUsQ0FFWDtBQUFBLG1CQUFNLE9BQU47QUFBQSxTQUZXLENBQXBCOztBQUlBLFlBQU0sYUFBYSxHQUFHLFVBQUgsQ0FDZCxTQURjLENBQ0osT0FESSxFQUNLLE9BREwsRUFFZCxHQUZjLENBRVY7QUFBQSxtQkFBTSxNQUFOO0FBQUEsU0FGVSxDQUFuQjs7QUFJQSxvQkFBWSxLQUFaLENBQWtCLFVBQWxCLEVBQ0ssU0FETCxDQUNlLFVBQUMsS0FBRCxFQUFXO0FBQ2xCLGdCQUFJLFVBQVUsT0FBZCxFQUF1QjtBQUNuQix5QkFBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLFlBQXJDLENBQWtELFFBQWxELEVBQTRELEVBQTVEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxlQUFoQyxDQUFnRCxRQUFoRDtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsZUFBekMsQ0FBeUQsUUFBekQ7QUFDQSx5QkFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLGVBQWhDLENBQWdELFFBQWhEO0FBQ0Esb0JBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCw2QkFBUyxjQUFULENBQXdCLFNBQXhCLEVBQW1DLGVBQW5DLENBQW1ELFFBQW5EO0FBQ0E7QUFDQSwrQkFBVyxZQUFZO0FBQ25CLG1DQUFXLElBQVg7QUFDQTtBQUNBLGlDQUFTLGNBQVQsQ0FBd0IsU0FBeEIsRUFBbUMsWUFBbkMsQ0FBZ0QsUUFBaEQsRUFBMEQsRUFBMUQ7QUFDSCxxQkFKRCxFQUlHLEVBSkg7QUFLSDtBQUNKLGFBZEQsTUFjTyxJQUFJLFVBQVUsTUFBZCxFQUFzQjtBQUN6Qix5QkFBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLGVBQXJDLENBQXFELFFBQXJEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxZQUFoQyxDQUE2QyxRQUE3QyxFQUF1RCxFQUF2RDtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsWUFBekMsQ0FBc0QsUUFBdEQsRUFBZ0UsRUFBaEU7QUFDQSx5QkFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLFlBQWhDLENBQTZDLFFBQTdDLEVBQXVELEVBQXZEO0FBQ0g7QUFDSixTQXRCTDs7QUF5QkE7Ozs7QUFJQSxpQkFBUyxjQUFULENBQXdCLGVBQXhCLEVBQXlDLGdCQUF6QyxDQUEwRCxPQUExRCxFQUFtRSxZQUFNO0FBQ3JFLGdCQUFNLE9BQU87QUFDVCxzQkFBTSxXQURHO0FBRVQsb0JBQUk7QUFGSyxhQUFiO0FBSUEsZ0JBQU0sWUFBWSxXQUFXLE1BQVgsQ0FBa0IsS0FBSyxJQUF2QixFQUE2QixLQUFLLEVBQWxDLENBQWxCO0FBQ0Esc0JBQVUsT0FBVixHQUFvQixXQUFXLFFBQVgsRUFBcEI7QUFDQSxvQkFBUSxJQUFSLENBQWEsY0FBYixFQUE2QixTQUE3QjtBQUNBLGdCQUFNLHNDQUFvQyxLQUFLLEVBQS9DO0FBQ0Esa0JBQU0sR0FBTixFQUFXO0FBQ0gsd0JBQVEsTUFETDtBQUVILHlCQUFTLElBQUksT0FBSixDQUFZO0FBQ2pCLG9DQUFnQjtBQURDLGlCQUFaLENBRk47QUFLSCxzQkFBTSxLQUFLLFNBQUwsQ0FBZSxTQUFmO0FBTEgsYUFBWCxFQU9LLElBUEwsQ0FPVSxVQUFVLFFBQVYsRUFBb0I7QUFDdEIsd0JBQVEsSUFBUixDQUFhLFFBQWI7QUFDSCxhQVRMO0FBVUEsdUJBQVcsVUFBWDtBQUNILFNBcEJEOztBQXNCQTs7OztBQUlBLFlBQU0sV0FBVyxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBakI7QUFDQSxZQUFNLGdCQUFnQixTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBQXRCOztBQUdBLFlBQU0sYUFBYSxHQUFHLFVBQUgsQ0FDZCxTQURjLENBQ0osUUFESSxFQUNNLE9BRE4sRUFFZCxHQUZjLENBRVY7QUFBQSxtQkFBTSxNQUFOO0FBQUEsU0FGVSxDQUFuQjs7QUFJQSxZQUFNLGtCQUFrQixHQUFHLFVBQUgsQ0FDbkIsU0FEbUIsQ0FDVCxhQURTLEVBQ00sT0FETixFQUVuQixHQUZtQixDQUVmO0FBQUEsbUJBQU0sV0FBTjtBQUFBLFNBRmUsQ0FBeEI7O0FBSUEsbUJBQVcsS0FBWCxDQUFpQixlQUFqQixFQUNLLFNBREwsQ0FDZSxVQUFDLEtBQUQsRUFBVztBQUNsQixnQkFBSSxVQUFVLE1BQWQsRUFBc0I7QUFDbEIseUJBQVMsYUFBVCxDQUF1QixlQUF2QixFQUF3QyxlQUF4QyxDQUF3RCxRQUF4RDtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsWUFBckMsQ0FBa0QsUUFBbEQsRUFBNEQsRUFBNUQ7QUFDQSx5QkFBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLFlBQXJDLENBQWtELFFBQWxELEVBQTRELEVBQTVEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsZUFBMUMsQ0FBMEQsUUFBMUQ7QUFDQSx5QkFBUyxhQUFULENBQXVCLHFCQUF2QixFQUE4QyxTQUE5QyxDQUF3RCxNQUF4RCxDQUErRCxZQUEvRDtBQUNBLHlCQUFTLGFBQVQsQ0FBdUIseUJBQXZCLEVBQWtELFNBQWxELENBQTRELE1BQTVELENBQW1FLFlBQW5FO0FBRUgsYUFSRCxNQVFPLElBQUksVUFBVSxXQUFkLEVBQTJCO0FBQzlCLHlCQUFTLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0MsWUFBeEMsQ0FBcUQsUUFBckQsRUFBK0QsRUFBL0Q7QUFDQSx5QkFBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLGVBQXJDLENBQXFELFFBQXJEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxlQUFyQyxDQUFxRCxRQUFyRDtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDLFlBQTFDLENBQXVELFFBQXZELEVBQWlFLEVBQWpFO0FBQ0EseUJBQVMsYUFBVCxDQUF1QixxQkFBdkIsRUFBOEMsU0FBOUMsQ0FBd0QsTUFBeEQsQ0FBK0QsWUFBL0Q7QUFDQSx5QkFBUyxhQUFULENBQXVCLHlCQUF2QixFQUFrRCxTQUFsRCxDQUE0RCxNQUE1RCxDQUFtRSxZQUFuRTs7QUFFQSxvQkFBTSxPQUFPO0FBQ1QsMEJBQU0sV0FERztBQUVULHdCQUFJO0FBRkssaUJBQWI7QUFJQSxvQkFBTSxTQUFTO0FBQ1gsNEJBQVE7QUFERyxpQkFBZjtBQUdBLG9CQUFNLHNDQUFvQyxLQUFLLEVBQS9DO0FBQ0Esc0JBQU0sR0FBTixFQUFXLE1BQVgsRUFDSyxJQURMLENBQ1UsVUFBVSxRQUFWLEVBQW9CO0FBQ3RCLDJCQUFPLFNBQVMsSUFBVCxFQUFQO0FBQ0gsaUJBSEwsRUFJSyxJQUpMLENBSVUsVUFBVSxRQUFWLEVBQW9CO0FBQ3RCLHdCQUFJLFFBQUosRUFBYztBQUNWLGdDQUFRLEdBQVIsQ0FBWSxRQUFaO0FBQ0EscUNBQWEsUUFBYjtBQUNBLCtCQUFPLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBUDtBQUNBLGdDQUFRLENBQVI7QUFDQTtBQUNILHFCQU5ELE1BTU87QUFDSCxnQ0FBUSxHQUFSLENBQVksV0FBWjtBQUNIO0FBQ0osaUJBZEw7QUFlSDtBQUNKLFNBMUNMOztBQTZDQTs7OztBQUlBLFlBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBaEI7QUFDQSxZQUFNLFdBQVcsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWpCOztBQUVBLFlBQU0sZ0JBQWdCLEdBQUcsVUFBSCxDQUNqQixTQURpQixDQUNQLE9BRE8sRUFDRSxPQURGLEVBQ1c7QUFBQSxtQkFBTSxRQUFRLEtBQUssR0FBTCxDQUFTLFFBQVEsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBZDtBQUFBLFNBRFgsQ0FBdEI7QUFFQSxZQUFNLGlCQUFpQixHQUFHLFVBQUgsQ0FDbEIsU0FEa0IsQ0FDUixRQURRLEVBQ0UsT0FERixFQUNXO0FBQUEsbUJBQU0sUUFBUSxLQUFLLEdBQUwsQ0FBUyxRQUFRLENBQWpCLEVBQW9CLEtBQUssTUFBTCxHQUFjLENBQWxDLENBQWQ7QUFBQSxTQURYLENBQXZCOztBQUdBLHNCQUFjLEtBQWQsQ0FBb0IsY0FBcEIsRUFBb0MsU0FBcEMsQ0FBOEMsSUFBOUM7QUFHSDs7QUFFRDs7O0FBR0EsYUFBUyxJQUFULEdBQWdCO0FBQ1osWUFBSSxPQUFPLFdBQVcsS0FBSyxLQUFMLENBQVgsQ0FBWDtBQUNBLFlBQUksZ0JBQWdCLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFwQjtBQUNBLHNCQUFjLEdBQWQsR0FBb0IsS0FBSyxPQUF6QjtBQUNBLFlBQUksS0FBSyxRQUFMLElBQWlCLENBQUMsY0FBYyxTQUFkLENBQXdCLFFBQXhCLENBQWlDLFVBQWpDLENBQXRCLEVBQW9FO0FBQ2hFLDBCQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsVUFBNUI7QUFDSCxTQUZELE1BRU87QUFDSCwwQkFBYyxTQUFkLENBQXdCLE1BQXhCLENBQStCLFVBQS9CO0FBQ0g7QUFFSjs7QUFHRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDOztBQUVBOzs7Ozs7O0FBUUgsQ0FwTUQ7OztBQ1pBOzs7Ozs7Ozs7QUFDQTs7QUFHQTs7QUFHQTs7QUFNQTs7OztBQUlBOzs7OztJQUthLGMsV0FBQSxjO0FBQ1QsNEJBQVksRUFBWixFQUFnQixPQUFoQixFQUF5QjtBQUFBOztBQUFBOztBQUNyQjtBQUNBLGFBQUssU0FBTCxHQUFpQixTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsQ0FBakI7QUFDQTtBQUNBLGFBQUssVUFBTCxHQUFrQixLQUFLLFNBQUwsQ0FBZSxxQkFBZixFQUFsQjtBQUNBO0FBQ0EsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssU0FBTCxDQUFlLEtBQWYsR0FBdUIsS0FBSyxVQUFMLENBQWdCLEtBQXZDO0FBQ0E7QUFDQSxhQUFLLFlBQUwsR0FBb0IsS0FBSyxPQUFMLDBCQUErQixDQUFuRDtBQUNBLGFBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsS0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBQXdCLEtBQUssWUFBckQ7QUFDQTtBQUNBLGFBQUssUUFBTCxHQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsa0JBQVgsQ0FBaEI7O0FBRUE7QUFDQSxhQUFLLE1BQUwsR0FBYyxJQUFJLE9BQU8sTUFBWCxDQUFrQixFQUFsQixFQUFzQjtBQUNoQyx1QkFBVztBQURxQixTQUF0QixDQUFkO0FBR0E7QUFDQSxhQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQTtBQUNBLGFBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNJO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLEtBRjFCO0FBR0EsYUFBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsYUFBSyxTQUFMOztBQUVBO0FBQ0EsYUFBSyxXQUFMOztBQUVBO0FBQ0EsWUFBSSxPQUFKLEVBQWE7O0FBRVQsaUJBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxpQkFBZixFQUFrQyxVQUFDLE9BQUQ7QUFBQSx1QkFBYSxNQUFLLFlBQUwsR0FBb0IsUUFBUSxNQUFSLENBQWUsU0FBZixHQUEyQixRQUFRLE1BQW5DLEdBQTRDLElBQTdFO0FBQUEsYUFBbEM7QUFDQSxpQkFBSyxNQUFMLENBQVksRUFBWixDQUFlLG1CQUFmLEVBQW9DLFVBQUMsT0FBRDtBQUFBLHVCQUFhLE1BQUssWUFBTCxHQUFvQixJQUFqQztBQUFBLGFBQXBDOztBQUVBLGlCQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsZUFBZixFQUFnQyxVQUFDLE9BQUQsRUFBYTtBQUN6QyxvQkFBSSxNQUFNLFFBQVEsTUFBUixDQUFlLFNBQXpCOztBQUdBLG9CQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsUUFBUSxNQUFSLENBQWUsSUFBZixHQUFzQixNQUFLLFFBQXRDLElBQWtELE1BQUssUUFBckU7QUFDQSxvQkFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLENBQUMsUUFBUSxNQUFSLENBQWUsR0FBZixHQUFxQixNQUFLLFlBQTNCLElBQTJDLE1BQUssUUFBM0QsSUFBdUUsTUFBSyxRQUE1RSxHQUF1RixNQUFLLFlBQXpHO0FBQ0E7QUFDQSxvQkFBSSxhQUFhLFVBQVUsSUFBSSxJQUFKLENBQVMsR0FBVCxLQUFpQixDQUFqQixJQUFzQixJQUFJLEtBQUosR0FBWSxDQUFsQyxHQUFzQyxNQUFLLFFBQUwsR0FBZ0IsQ0FBdEQsR0FBMEQsTUFBSyxRQUF6RSxDQUFqQjtBQUNBLG9CQUFJLGNBQWMsV0FBVyxJQUFJLElBQUosQ0FBUyxHQUFULEtBQWlCLENBQWpCLEdBQXFCLE1BQUssUUFBTCxHQUFnQixDQUFyQyxHQUF5QyxNQUFLLFFBQXpELENBQWxCO0FBQ0Esb0JBQUksSUFBSixDQUNJLE9BREosRUFDYTtBQUNULHNCQUZKLENBRVc7QUFGWDs7QUFLQTtBQUNBLG9CQUFJLGlDQUNBLFVBQVUsQ0FEVixJQUVBLGNBQWMsTUFBSyxTQUFMLENBQWUsTUFGN0IsSUFHQSxlQUFlLE1BQUssU0FBTCxDQUFlLEtBSGxDLEVBR3lDO0FBQ3JDLHdCQUFJLFFBQUosR0FBZSxJQUFmO0FBQ0gsaUJBTEQsTUFLTztBQUNIO0FBQ0Esd0JBQUksUUFBSixHQUFlLEtBQWY7QUFDQSx3QkFBSSxDQUFDLElBQUksT0FBVCxFQUFrQjtBQUNkLDRCQUFJLElBQUksSUFBSixDQUFTLEdBQVQsS0FBaUIsQ0FBckIsRUFBd0I7QUFDcEIsZ0NBQUksSUFBSSxJQUFKLENBQVMsR0FBVCxLQUFpQixDQUFyQixFQUF3QjtBQUNwQixzQ0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixNQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0IsU0FBdEM7QUFDSCw2QkFGRCxNQUVPLElBQUksSUFBSSxLQUFKLEtBQWMsQ0FBbEIsRUFBcUI7QUFDeEIsc0NBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsTUFBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLFNBQXBDO0FBQ0gsNkJBRk0sTUFFQTtBQUNILHNDQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE1BQUssV0FBTCxDQUFpQixDQUFqQixFQUFvQixFQUFwQixFQUF3QixTQUF4QztBQUNIO0FBQ0oseUJBUkQsTUFRTztBQUNILGtDQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE1BQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixTQUF0QztBQUNIO0FBQ0QsNEJBQUksT0FBSixHQUFjLElBQWQ7QUFDSDtBQUNKO0FBRUosYUF2Q0Q7O0FBeUNBLGlCQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsVUFBZixFQUEyQixZQUFNO0FBQzdCLG9CQUFJLE1BQUssWUFBTCxJQUNBLE1BQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixRQUQ1QixJQUVBLE1BQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixPQUZoQyxFQUV5QztBQUNyQywyQkFBTyxNQUFLLFVBQUwsQ0FBZ0IsTUFBSyxZQUFMLENBQWtCLFNBQWxCLENBQTRCLEVBQTVDLENBQVA7QUFDQSwwQkFBSyxNQUFMLENBQVksTUFBWixDQUFtQixNQUFLLFlBQXhCO0FBQ0EsMEJBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNIO0FBQ0osYUFSRDtBQVVIO0FBQ0o7O0FBRUQ7Ozs7Ozs7b0NBR1ksSyxFQUFPO0FBQ2YsaUJBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFdBQXRCLENBQWtDLEtBQWxDO0FBQ0EsaUJBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsV0FBekIsQ0FBcUMsS0FBckM7QUFDQSxpQkFBSyxTQUFMLENBQWUsSUFBZixDQUFvQixXQUFwQixDQUFnQyxLQUFoQztBQUNBLGlCQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLFdBQXhCLENBQW9DLEtBQXBDO0FBQ0EsaUJBQUssTUFBTCxDQUFZLFNBQVo7QUFDSDs7QUFFRDs7Ozs7O2dDQUdRLFEsRUFBVSxNLEVBQVE7QUFBQTs7QUFDdEIsZ0JBQUksY0FBYyxFQUFsQjtBQUNBO0FBQ0EsZ0JBQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxLQUFLLFVBQWpCLEVBQ04sTUFETSxDQUNDLFVBQUMsR0FBRDtBQUFBLHVCQUFTLE9BQU8sT0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixFQUE3QixJQUNiLE9BQU8sT0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixFQURuQixJQUViLE9BQU8sT0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixFQUZkLElBR2IsT0FBTyxPQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLEVBSDNCO0FBQUEsYUFERCxDQUFYO0FBS0EsaUJBQUssT0FBTCxDQUFhLFVBQUMsR0FBRCxFQUFTO0FBQ2xCLG9CQUFJLFNBQVMsT0FBSyxVQUFMLENBQWdCLEdBQWhCLENBQWI7QUFDQSw0QkFBWSxJQUFaLENBQWlCO0FBQ2IsMEJBQU0sT0FBTyxJQURBO0FBRWIsMkJBQU8sT0FBTyxLQUZEO0FBR2IsMkJBQU8sT0FBTyxLQUhEO0FBSWIseUJBQUssT0FBTyxHQUFQLEdBQWEsT0FBSyxZQUpWO0FBS2IsMEJBQU0sT0FBTyxJQUxBO0FBTWIsOEJBQVUsT0FBSztBQU5GLGlCQUFqQjtBQVFILGFBVkQ7QUFXQSxtQkFBTztBQUNILHNCQUFNLFFBREg7QUFFSCx3QkFBUSxNQUZMO0FBR0gsOEJBQWM7QUFIWCxhQUFQO0FBS0g7O0FBRUQ7Ozs7Ozt5Q0FHaUIsaUIsRUFBbUI7QUFBQTs7QUFDaEMsaUJBQUssVUFBTDtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxpQkFBWixHQUFnQyxLQUFoQztBQUNBLDhCQUFrQixZQUFsQixDQUErQixPQUEvQixDQUF1QyxVQUFDLFdBQUQsRUFBaUI7QUFDcEQsdUJBQUssTUFBTCxDQUFZLEdBQVosQ0FDSSxPQUFLLFlBQUwsQ0FBa0I7QUFDZCwwQkFBTSxZQUFZLElBREo7QUFFZCwwQkFBTyxZQUFZLElBQVosR0FBbUIsWUFBWSxRQUFoQyxHQUE0QyxPQUFLLFFBRnpDO0FBR2QseUJBQU0sWUFBWSxHQUFaLEdBQWtCLFlBQVksUUFBL0IsR0FBMkMsT0FBSyxRQUh2QztBQUlkLDJCQUFPLFlBQVksS0FKTDtBQUtkLDJCQUFPLFlBQVk7QUFMTCxpQkFBbEIsRUFNRyxTQVBQO0FBU0gsYUFWRDs7QUFZQSxpQkFBSyxNQUFMLENBQVksU0FBWjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxpQkFBWixHQUFnQyxJQUFoQztBQUNIOztBQUVEOzs7Ozs7cUNBR2E7QUFDVCxpQkFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsaUJBQUssTUFBTCxDQUFZLEtBQVo7QUFDQSxpQkFBSyxXQUFMO0FBQ0g7O0FBRUQ7Ozs7OzttQ0FHVztBQUNQLG1CQUFPLEtBQUssTUFBTCxDQUFZLFNBQVosRUFBUDtBQUNIOztBQUVEOzs7Ozs7QUFPQTs7Ozs7O2tDQUdVLEksRUFBTTtBQUNaLGdCQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNkLHFCQUFLLE1BQUwsQ0FBWSxHQUFaLENBQ0ksS0FBSyxhQUFMLENBQW1CLENBQW5CLEVBQXNCLFNBRDFCLEVBQ3FDLEtBQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixTQUQzRCxFQUNzRSxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IsU0FEMUYsRUFDcUcsS0FBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLEVBQXBCLEVBQXdCLFNBRDdIO0FBR0g7QUFDSjs7QUFFRDs7Ozs7O3NDQUdjLEksRUFBTTtBQUNoQjtBQUNBO0FBQ0EsZ0JBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxPQUFPLEtBQUssUUFBdkIsQ0FBVjtBQUNBLGdCQUFJLFVBQVUsTUFBTSxLQUFLLFFBQXpCO0FBQ0EsaUJBQUssSUFBSSxNQUFNLENBQWYsRUFBa0IsTUFBTSxHQUF4QixFQUE2QixLQUE3QixFQUFvQztBQUNoQyxxQkFBSyxJQUFJLE1BQU0sQ0FBZixFQUFrQixNQUFNLEdBQXhCLEVBQTZCLEtBQTdCLEVBQW9DO0FBQ2hDLHdCQUFJLFlBQVksSUFBSSxPQUFPLElBQVgsQ0FBZ0I7QUFDNUIsK0JBQU8sS0FBSyxRQURnQjtBQUU1QixnQ0FBUSxLQUFLLFFBRmU7QUFHNUIsMERBSDRCO0FBSTVCLGlDQUFTLFFBSm1CO0FBSzVCLGlDQUFTLFFBTG1CO0FBTTVCLDBDQUFrQixJQU5VO0FBTzVCLHFDQUFhO0FBUGUscUJBQWhCLENBQWhCO0FBU0Esd0JBQUksU0FBUyxtQkFBVyxLQUFLLFFBQWhCLCtCQUFiO0FBQ0EsMkJBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQjtBQUNqQixzQ0FBYyxJQURHO0FBRWpCLHNDQUFjLElBRkc7QUFHakIsc0NBQWMsSUFIRztBQUlqQix1Q0FBZSxJQUpFO0FBS2pCLHVDQUFlLElBTEU7QUFNakIscUNBQWEsS0FOSTtBQU9qQixvQ0FBWTtBQVBLLHFCQUFyQjtBQVNBLHdCQUFJLFdBQVcsSUFBSSxPQUFPLEtBQVgsQ0FBaUIsQ0FBQyxTQUFELEVBQVksT0FBTyxTQUFuQixDQUFqQixFQUFnRDtBQUMzRCw4QkFBTSxLQUFLLFFBQUwsR0FBZ0IsR0FEcUM7QUFFM0QsNkJBQUssS0FBSyxRQUFMLEdBQWdCLEdBQWhCLEdBQXNCLEtBQUssWUFGMkI7QUFHM0QsK0JBQU8sQ0FIb0Q7QUFJM0Qsc0NBQWMsSUFKNkM7QUFLM0Qsc0NBQWMsSUFMNkM7QUFNM0Qsc0NBQWMsSUFONkM7QUFPM0QsdUNBQWUsSUFQNEM7QUFRM0QsdUNBQWUsSUFSNEM7QUFTM0QscUNBQWEsS0FUOEM7QUFVM0Qsb0NBQVk7QUFWK0MscUJBQWhELENBQWY7QUFZQSx5QkFBSyxNQUFMLENBQVksR0FBWixDQUFnQixRQUFoQjtBQUNIO0FBQ0o7QUFDRDs7Ozs7Ozs7Ozs7QUFXSDs7QUFFRDs7Ozs7O29DQUdZLFEsRUFBVSxLLEVBQU87QUFDekIsbUJBQU8sS0FBSyxZQUFMLENBQWtCO0FBQ3JCLHNCQUFNO0FBQ0YseUJBQUssSUFBSSxRQURQO0FBRUYseUJBQUssSUFBSTtBQUZQLGlCQURlO0FBS3JCLHNCQUFNLFFBQVUsS0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBQXdCLENBQXpCLEdBQThCLEtBQUssUUFBNUMsR0FBMEQsS0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBQXdCLENBQXhCLEdBQTRCLENBQTdCLEdBQW1DLEtBQUssUUFBTCxHQUFnQixHQUw3RjtBQU1yQixxQkFBSyxRQUFRLENBQVIsR0FBWSxDQU5JO0FBT3JCLHVCQUFPO0FBUGMsYUFBbEIsQ0FBUDtBQVNIOztBQUVEOzs7Ozs7c0NBR2MsVSxFQUFZO0FBQ3RCLG1CQUFPLEtBQUssWUFBTCxDQUFrQjtBQUNyQixzQkFBTTtBQUNGLHlCQUFLLElBQUksVUFEUDtBQUVGLHlCQUFLLElBQUk7QUFGUCxpQkFEZTtBQUtyQixzQkFBTSxlQUFlLENBQWYsR0FBcUIsS0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBQXdCLENBQXpCLEdBQStCLElBQUksS0FBSyxRQUE1RCxHQUEwRSxLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsR0FBeUIsS0FBSyxRQUFMLEdBQWdCLEdBTHBHO0FBTXJCLHFCQUFLLGVBQWUsQ0FBZixHQUFtQixDQUFuQixHQUF1QjtBQU5QLGFBQWxCLENBQVA7QUFRSDs7QUFFRDs7Ozs7O3FDQUdhLE8sRUFBUztBQUNsQixvQkFBUSxRQUFSLEdBQW1CLEtBQUssUUFBeEI7QUFDQSxvQkFBUSxLQUFSLEdBQWdCLFFBQVEsS0FBUixJQUFpQixLQUFLLFNBQXRDO0FBQ0EsZ0JBQUksTUFBTSxhQUFRLE9BQVIsQ0FBVjtBQUNBLGlCQUFLLFVBQUwsQ0FBZ0IsSUFBSSxFQUFwQixJQUEwQixHQUExQjtBQUNBO0FBQ0EsZ0JBQUksUUFBUSxJQUFSLENBQWEsR0FBYixLQUFxQixDQUF6QixFQUE0QjtBQUN4QixxQkFBSyxTQUFMLENBQWUsU0FBZixHQUEyQixHQUEzQjtBQUNILGFBRkQsTUFFTyxJQUFJLFFBQVEsS0FBWixFQUFtQjtBQUN0QixxQkFBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQjtBQUNILGFBRk0sTUFFQSxJQUFJLFFBQVEsSUFBUixDQUFhLEdBQWIsS0FBcUIsQ0FBekIsRUFBNEI7QUFDL0IscUJBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsR0FBdEI7QUFDSCxhQUZNLE1BRUE7QUFDSCxxQkFBSyxTQUFMLENBQWUsTUFBZixHQUF3QixHQUF4QjtBQUNIO0FBQ0QsbUJBQU8sR0FBUDtBQUNIOztBQUdEOzs7Ozs7c0NBR2M7QUFDVixpQkFBSyxhQUFMLENBQW1CLEtBQUssVUFBTCxDQUFnQixLQUFuQztBQUNBLGlCQUFLLFNBQUwsQ0FBZSxLQUFLLFVBQUwsQ0FBZ0IsS0FBL0IsRUFBc0MsS0FBSyxLQUFMLENBQVcsS0FBSyxVQUFMLENBQWdCLEtBQWhCLGtCQUFYLENBQXRDO0FBQ0g7Ozs7Ozs7QUNwVUw7O0FBRUE7Ozs7O0FBQ08sSUFBTSw4QkFBVyxFQUFqQjs7QUFFUDtBQUNPLElBQU0sd0NBQWdCLE9BQU8sTUFBUCxDQUFjLEtBQWQsSUFBdUIsR0FBdkIsR0FBOEIsRUFBOUIsR0FBbUMsR0FBekQ7O0FBRVA7QUFDTyxJQUFNLDRDQUFrQixTQUF4Qjs7QUFFUDtBQUNBLElBQU0sWUFBWSxTQUFsQjs7QUFFQTtBQUNBLElBQU0sWUFBWSxTQUFsQjs7QUFFQTtBQUNPLElBQU0sd0RBQXdCLFNBQTlCOzs7QUNsQlA7O0FBRUE7Ozs7Ozs7Ozs7QUFNTyxJQUFNLG9DQUFjLENBQ3ZCLG1CQUR1QixFQUNGO0FBQ3JCLG9CQUZ1QixFQUVEO0FBQ3RCLG1CQUh1QixFQUdGO0FBQ3JCLG1CQUp1QixFQUlGO0FBQ3JCLGtCQUx1QixFQUtIO0FBQ3BCLGtCQU51QixFQU1IO0FBQ3BCLG1CQVB1QixFQU9GO0FBQ3JCLG9CQVJ1QixFQVFEO0FBQ3RCLG1CQVR1QixFQVNGO0FBQ3JCLGtCQVZ1QixFQVVIO0FBQ3BCLG1CQVh1QixFQVdGO0FBQ3JCLG9CQVp1QixFQVlEO0FBQ3RCLG9CQWJ1QixFQWFEO0FBQ3RCLGlCQWR1QixFQWNKO0FBQ25CLG9CQWZ1QixFQWVEO0FBQ3RCLGtCQWhCdUIsRUFnQkg7QUFDcEIsa0JBakJ1QixFQWlCSDtBQUNwQixvQkFsQnVCLEVBa0JEO0FBQ3RCLGlCQW5CdUIsRUFtQko7QUFDbkIsbUJBcEJ1QixFQW9CRjtBQUNyQixrQkFyQnVCLEVBcUJIO0FBQ3BCLG9CQXRCdUIsRUFzQkQ7QUFDdEIsb0JBdkJ1QixFQXVCRDtBQUN0QixtQkF4QnVCLEVBd0JGO0FBQ3JCLGdCQXpCdUIsRUF5Qkw7QUFDbEIsb0JBMUJ1QixFQTBCRDtBQUN0QixvQkEzQnVCLEVBMkJEO0FBQ3RCLGtCQTVCdUIsRUE0Qkg7QUFDcEIsb0JBN0J1QixFQTZCRDtBQUN0QixvQkE5QnVCLEVBOEJEO0FBQ3RCLG9CQS9CdUIsRUErQkQ7QUFDdEIsaUJBaEN1QixFQWdDSjtBQUNuQixpQkFqQ3VCLENBQXBCOzs7QUNSUDs7QUFFQTs7Ozs7Ozs7O1FBS2dCLGMsR0FBQSxjO0FBQVQsU0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLEdBQTdCLEVBQWtDOztBQUVqQztBQUNBLFVBQU0sT0FBTyxHQUFQLEVBQVksT0FBWixDQUFvQixhQUFwQixFQUFtQyxFQUFuQyxDQUFOO0FBQ0EsUUFBSSxJQUFJLE1BQUosR0FBYSxDQUFqQixFQUFvQjtBQUNoQixjQUFNLElBQUksQ0FBSixJQUFTLElBQUksQ0FBSixDQUFULEdBQWtCLElBQUksQ0FBSixDQUFsQixHQUEyQixJQUFJLENBQUosQ0FBM0IsR0FBb0MsSUFBSSxDQUFKLENBQXBDLEdBQTZDLElBQUksQ0FBSixDQUFuRDtBQUNIO0FBQ0QsVUFBTSxPQUFPLENBQWI7O0FBRUE7QUFDQSxRQUFJLE1BQU0sR0FBVjtBQUFBLFFBQWUsQ0FBZjtBQUFBLFFBQWtCLENBQWxCO0FBQ0EsU0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLENBQWhCLEVBQW1CLEdBQW5CLEVBQXdCO0FBQ3BCLFlBQUksU0FBUyxJQUFJLE1BQUosQ0FBVyxJQUFJLENBQWYsRUFBa0IsQ0FBbEIsQ0FBVCxFQUErQixFQUEvQixDQUFKO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSyxJQUFJLEdBQXJCLENBQVQsRUFBcUMsR0FBckMsQ0FBWCxFQUFzRCxRQUF0RCxDQUErRCxFQUEvRCxDQUFKO0FBQ0EsZUFBTyxDQUFDLE9BQU8sQ0FBUixFQUFXLE1BQVgsQ0FBa0IsRUFBRSxNQUFwQixDQUFQO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ1A7OztBQ3pCRDs7Ozs7Ozs7O0FBQ0E7Ozs7QUFFQTs7Ozs7SUFLYSxNLFdBQUEsTTtBQUNULG9CQUFZLFFBQVosRUFBc0IsS0FBdEIsRUFBNEI7QUFBQTs7QUFFeEIsYUFBSyxXQUFMLEdBQW1CLElBQUksT0FBTyxNQUFYLENBQWtCO0FBQ2pDLG9CQUFTLFdBQVcsQ0FBWixHQUFpQixDQURRO0FBRWpDLGtCQUFNLDBCQUFlLEtBQWYsRUFBc0IsQ0FBQyxHQUF2QixDQUYyQjtBQUdqQyxxQkFBUyxRQUh3QjtBQUlqQyxxQkFBUyxRQUp3QjtBQUtqQyxvQkFBUztBQUx3QixTQUFsQixDQUFuQjs7QUFRQSxhQUFLLGNBQUwsR0FBc0IsSUFBSSxPQUFPLE1BQVgsQ0FBa0I7QUFDcEMsb0JBQVMsV0FBVyxDQUFaLEdBQWlCLENBRFc7QUFFcEMsa0JBQU0sMEJBQWUsS0FBZixFQUFzQixHQUF0QixDQUY4QjtBQUdwQyxxQkFBUyxRQUgyQjtBQUlwQyxxQkFBUztBQUoyQixTQUFsQixDQUF0Qjs7QUFPQSxhQUFLLElBQUwsR0FBWSxJQUFJLE9BQU8sSUFBWCxDQUFnQixLQUFoQixFQUF1QjtBQUMvQixzQkFBVSxXQUFXLENBRFU7QUFFL0Isa0JBQU0sMEJBQWUsS0FBZixFQUFzQixDQUFDLElBQXZCLENBRnlCO0FBRy9CLHFCQUFTLFFBSHNCO0FBSS9CLHFCQUFTLFFBSnNCO0FBSy9CLG9CQUFRLDBCQUFlLEtBQWYsRUFBc0IsQ0FBQyxJQUF2QixDQUx1QjtBQU0vQix5QkFBYTtBQU5rQixTQUF2QixDQUFaOztBQVNBLGFBQUssS0FBTCxHQUFhLElBQUksT0FBTyxLQUFYLENBQWlCLENBQUMsS0FBSyxjQUFOLEVBQXNCLEtBQUssV0FBM0IsRUFBd0MsS0FBSyxJQUE3QyxDQUFqQixDQUFiO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQU9BOzs7b0NBR1ksSyxFQUFNO0FBQ2QsaUJBQUssV0FBTCxDQUFpQixHQUFqQixDQUFxQixNQUFyQixFQUE2QiwwQkFBZSxLQUFmLEVBQXNCLENBQUMsR0FBdkIsQ0FBN0I7QUFDQSxpQkFBSyxjQUFMLENBQW9CLEdBQXBCLENBQXdCLE1BQXhCLEVBQWdDLDBCQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBaEM7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjO0FBQ1Ysc0JBQU8sMEJBQWUsS0FBZixFQUFzQixDQUFDLElBQXZCLENBREc7QUFFVix3QkFBUywwQkFBZSxLQUFmLEVBQXNCLENBQUMsSUFBdkI7QUFGQyxhQUFkO0FBSUg7Ozs0QkFkYztBQUNYLG1CQUFPLEtBQUssS0FBWjtBQUNIOzs7Ozs7O0FDM0NMOzs7Ozs7Ozs7QUFDQTs7OztBQUVBOzs7O0lBSWEsRyxXQUFBLEc7QUFDVCx1QkFBb0c7QUFBQSw2QkFBdkYsSUFBdUY7QUFBQSxZQUF2RixJQUF1Riw2QkFBaEYsRUFBQyxLQUFNLENBQVAsRUFBVSxLQUFNLENBQWhCLEVBQWdGO0FBQUEsaUNBQTVELFFBQTREO0FBQUEsWUFBNUQsUUFBNEQsaUNBQWpELENBQWlEO0FBQUEsOEJBQTlDLEtBQThDO0FBQUEsWUFBOUMsS0FBOEMsOEJBQXRDLE1BQXNDO0FBQUEsNkJBQTlCLElBQThCO0FBQUEsWUFBOUIsSUFBOEIsNkJBQXZCLENBQXVCO0FBQUEsNEJBQXBCLEdBQW9CO0FBQUEsWUFBcEIsR0FBb0IsNEJBQWQsQ0FBYztBQUFBLDhCQUFYLEtBQVc7QUFBQSxZQUFYLEtBQVcsOEJBQUgsQ0FBRzs7QUFBQTs7QUFDaEcsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssRUFBTCxXQUFnQixJQUFoQixTQUF3QixLQUFLLEdBQUwsRUFBeEI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxhQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsYUFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLEtBQUwsR0FBYSxTQUFTLENBQXRCO0FBQ0EsYUFBSyxXQUFMLEdBQW1CLEVBQW5COztBQUdBLGFBQUssU0FBTCxHQUFpQixJQUFJLE9BQU8sSUFBWCxDQUFnQjtBQUM3QixtQkFBTyxXQUFXLEtBQUssR0FETTtBQUU3QixvQkFBUSxXQUFXLEtBQUssR0FGSztBQUc3QixrQkFBTSxLQUh1QjtBQUk3QixxQkFBUyxRQUpvQjtBQUs3QixxQkFBUyxRQUxvQjtBQU03Qiw4QkFBa0IsSUFOVztBQU83Qix5QkFBYSxLQVBnQjtBQVE3QixvQkFBUztBQVJvQixTQUFoQixDQUFqQjs7QUFZQSxZQUFJLFlBQVksQ0FBQyxLQUFLLFNBQU4sQ0FBaEI7QUFDQSxZQUFJLGNBQWMsbUJBQVcsUUFBWCxFQUFxQixLQUFyQixDQUFsQjtBQUNBLGFBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixXQUF0QjtBQUNBO0FBQ0EsWUFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmO0FBQ0E7QUFDQSx3QkFBWSxTQUFaLENBQXNCLEdBQXRCLENBQTBCO0FBQ3RCLHNCQUFNLENBQUMsUUFBRCxHQUFZO0FBREksYUFBMUI7QUFHQSxnQkFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIseUJBQU8sQ0FBQyxRQUFELEdBQVc7QUFESSxpQkFBMUI7QUFHSDtBQUNELDBCQUFjLG1CQUFXLFFBQVgsRUFBcUIsS0FBckIsQ0FBZDtBQUNBLHdCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIsc0JBQU07QUFEZ0IsYUFBMUI7O0FBSUE7QUFDQSxnQkFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIseUJBQU8sQ0FBQyxRQUFELEdBQVc7QUFESSxpQkFBMUI7QUFHSDtBQUNELGlCQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsV0FBdEI7O0FBRUE7QUFDQSxnQkFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmLDhCQUFjLG1CQUFXLFFBQVgsRUFBcUIsS0FBckIsQ0FBZDtBQUNBLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIsMEJBQU0sQ0FBQyxRQUFELEdBQVksQ0FESTtBQUV0Qix5QkFBSztBQUZpQixpQkFBMUI7QUFJQSxxQkFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFdBQXRCO0FBQ0EsOEJBQWMsbUJBQVcsUUFBWCxFQUFxQixLQUFyQixDQUFkO0FBQ0EsNEJBQVksU0FBWixDQUFzQixHQUF0QixDQUEwQjtBQUN0QiwwQkFBTSxDQURnQjtBQUV0Qix5QkFBTTtBQUZnQixpQkFBMUI7QUFJQSxxQkFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFdBQXRCO0FBQ0g7QUFFSjs7QUFFRCxhQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxNQUFEO0FBQUEsbUJBQVUsVUFBVSxJQUFWLENBQWUsT0FBTyxTQUF0QixDQUFWO0FBQUEsU0FBekI7O0FBRUE7QUFDQSxhQUFLLEtBQUwsR0FBYSxJQUFJLE9BQU8sS0FBWCxDQUFpQixTQUFqQixFQUE0QjtBQUNyQyxrQkFBTSxLQUFLLElBRDBCO0FBRXJDLGlCQUFLLEtBQUssR0FGMkI7QUFHckMsbUJBQU8sS0FBSyxLQUh5QjtBQUlyQywwQkFBZSxJQUpzQjtBQUtyQywwQkFBZSxJQUxzQjtBQU1yQywwQkFBZSxJQU5zQjtBQU9yQyx5QkFBYztBQVB1QixTQUE1QixDQUFiOztBQVVBO0FBQ0EsYUFBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixJQUF2QjtBQUNIOztBQUVEOzs7Ozs7O0FBZUE7b0NBQ1ksSyxFQUFNO0FBQ2QsaUJBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxpQkFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixNQUFuQixFQUEyQixLQUEzQjtBQUNBLGlCQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxNQUFEO0FBQUEsdUJBQVcsT0FBTyxXQUFQLENBQW1CLEtBQW5CLENBQVg7QUFBQSxhQUF6QjtBQUNIOztBQUVEOzs7OzZCQUNLLEksRUFBTSxHLEVBQUk7QUFDWCxpQkFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGlCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZTtBQUNYLHFCQUFLLEdBRE07QUFFWCxzQkFBTztBQUZJLGFBQWY7QUFJSDs7QUFFRDs7OzsrQkFDTyxLLEVBQU07QUFDVCxpQkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWU7QUFDWCx1QkFBUTtBQURHLGFBQWY7QUFHSDs7OzRCQXJDYztBQUNYLG1CQUFPLEtBQUssS0FBWjtBQUNIOztBQUVEOzs7OzRCQUNhO0FBQ1QsbUJBQU8sS0FBSyxTQUFaO0FBQ0g7O0FBRUQ7OzBCQUNZLE8sRUFBUTtBQUNoQixpQkFBSyxTQUFMLEdBQWlCLE9BQWpCO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1xuICAgIExFR09fQ09MT1JTXG59IGZyb20gJy4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xuaW1wb3J0IHtcbiAgICBCQVNFX0xFR09fQ09MT1Jcbn0gZnJvbSAnLi9jb21tb24vY29uc3QuanMnO1xuaW1wb3J0IHtcbiAgICBMZWdvR3JpZENhbnZhc1xufSBmcm9tICcuL2NhbnZhcy9sZWdvQ2FudmFzLmpzJztcblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgbGV0IGdhbWVJbml0ID0gZmFsc2UsIC8vIHRydWUgaWYgd2UgaW5pdCB0aGUgbGVnb0dyaWRcbiAgICAgICAgbGVnb0NhbnZhcyA9IG51bGwsIC8vIFRoZSBsZWdvR3JpZFxuICAgICAgICBrZXlzID0gbnVsbCwgLy8gVGhlIGtleXMgb2YgZmlyZW5hc2Ugc3VibWl0IGRyYXdcbiAgICAgICAgc25hcHNob3RGYiA9IG51bGwsIC8vIFRoZSBzbmFwc2hvdCBvZiBzdWJtaXQgZHJhd1xuICAgICAgICBpbmRleCA9IDA7XG5cblxuICAgIGZ1bmN0aW9uIGluaXRHYW1lKCkge1xuXG4gICAgICAgIGxlZ29DYW52YXMgPSBuZXcgTGVnb0dyaWRDYW52YXMoJ2NhbnZhc0RyYXcnLCB0cnVlKTtcblxuICAgICAgICAkKFwiI2NvbG9yLXBpY2tlcjJcIikuc3BlY3RydW0oe1xuICAgICAgICAgICAgc2hvd1BhbGV0dGVPbmx5OiB0cnVlLFxuICAgICAgICAgICAgc2hvd1BhbGV0dGU6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogQkFTRV9MRUdPX0NPTE9SLFxuICAgICAgICAgICAgcGFsZXR0ZTogTEVHT19DT0xPUlMsXG4gICAgICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICAgICAgICAgIGxlZ29DYW52YXMuY2hhbmdlQ29sb3IoY29sb3IudG9IZXhTdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgQ2luZW1hdGljIEJ1dHRvbnNcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0QnRuJyk7XG4gICAgICAgIGNvbnN0IGhlbHBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpXG5cbiAgICAgICAgY29uc3Qgc3RyZWFtU3RhcnQgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KHN0YXJ0QnRuLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnc3RhcnQnKTtcblxuICAgICAgICBjb25zdCBzdHJlYW1IZWxwID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChoZWxwQnRuLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnaGVscCcpO1xuXG4gICAgICAgIHN0cmVhbVN0YXJ0Lm1lcmdlKHN0cmVhbUhlbHApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWdhbWVJbml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaW1lb3V0IG5lZWRlZCB0byBzdGFydCB0aGUgcmVuZGVyaW5nIG9mIGxvYWRpbmcgYW5pbWF0aW9uIChlbHNlIHdpbGwgbm90IGJlIHNob3cpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lSW5pdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdEdhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAnaGVscCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbGxvLW1zZycpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3ItcGlja2VyMicpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxwJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2Ygc3VibWlzc2lvblxuICAgICAgICAgKi9cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuU3VibWlzc2lvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnVXNlciBOYW1lJyxcbiAgICAgICAgICAgICAgICBpZDogJ3VzZXJJZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBkcmF3RGF0YXMgPSBsZWdvQ2FudmFzLmV4cG9ydCh1c2VyLm5hbWUsIHVzZXIuaWQpO1xuICAgICAgICAgICAgZHJhd0RhdGFzLmRhdGFVcmwgPSBsZWdvQ2FudmFzLnNuYXBzaG90KCk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ3dpbGwgc2VuZCA6ICcsIGRyYXdEYXRhcyk7XG4gICAgICAgICAgICBjb25zdCBVUkwgPSBgaHR0cDovL2xvY2FsaG9zdDo5MDAwL2RyYXcvJHt1c2VyLmlkfWA7XG4gICAgICAgICAgICBmZXRjaChVUkwsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRyYXdEYXRhcylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGVnb0NhbnZhcy5yZXNldEJvYXJkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIG1lbnUgaXRlbXNcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3QgbWVudUdhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJyk7XG4gICAgICAgIGNvbnN0IG1lbnVDcmVhdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKTtcblxuXG4gICAgICAgIGNvbnN0IHN0cmVhbUdhbWUgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KG1lbnVHYW1lLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnZ2FtZScpO1xuXG4gICAgICAgIGNvbnN0IHN0cmVhbUNyZWF0aW9ucyA9IFJ4Lk9ic2VydmFibGVcbiAgICAgICAgICAgIC5mcm9tRXZlbnQobWVudUNyZWF0aW9ucywgJ2NsaWNrJylcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gJ2NyZWF0aW9ucycpO1xuXG4gICAgICAgIHN0cmVhbUdhbWUubWVyZ2Uoc3RyZWFtQ3JlYXRpb25zKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoc3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09ICdnYW1lJykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jb250ZW50JykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdHRlZCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19kcmF3ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19vYmZ1c2NhdG9yJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2NyZWF0aW9ucycpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY29udGVudCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0dGVkJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtZ2FtZScpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fZHJhd2VyJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fb2JmdXNjYXRvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1VzZXIgTmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJ3VzZXJJZCdcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbXlJbml0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBVUkwgPSBgaHR0cDovL2xvY2FsaG9zdDo5MDAwL2RyYXcvJHt1c2VyLmlkfWA7XG4gICAgICAgICAgICAgICAgICAgIGZldGNoKFVSTCwgbXlJbml0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHNuYXBzaG90KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNuYXBzaG90Lmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc25hcHNob3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbmFwc2hvdEZiID0gc25hcHNob3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhzbmFwc2hvdEZiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmF3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGRyYXcgIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgQnV0dG9ucyBmb3IgY2hhbmdpbmcgb2YgZHJhd1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBidG5MZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bkxlZnQnKTtcbiAgICAgICAgY29uc3QgYnRuUmlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuUmlnaHQnKTtcblxuICAgICAgICBjb25zdCBzdHJlYW1CdG5MZWZ0ID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChidG5MZWZ0LCAnY2xpY2snLCAoKSA9PiBpbmRleCA9IE1hdGgubWF4KGluZGV4IC0gMSwgMCkpO1xuICAgICAgICBjb25zdCBzdHJlYW1CdG5SaWdodCA9IFJ4Lk9ic2VydmFibGVcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoYnRuUmlnaHQsICdjbGljaycsICgpID0+IGluZGV4ID0gTWF0aC5taW4oaW5kZXggKyAxLCBrZXlzLmxlbmd0aCAtIDEpKTtcblxuICAgICAgICBzdHJlYW1CdG5MZWZ0Lm1lcmdlKHN0cmVhbUJ0blJpZ2h0KS5zdWJzY3JpYmUoZHJhdyk7XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgYSBkcmF3IGFuZCBzaG93IGl0J3Mgc3RhdGUgOiBSZWplY3RlZCBvciBBY2NlcHRlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRyYXcoKSB7XG4gICAgICAgIGxldCBkcmF3ID0gc25hcHNob3RGYltrZXlzW2luZGV4XV07XG4gICAgICAgIGxldCBpbWdTdWJtaXNzaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ1N1Ym1pc3Npb24nKTtcbiAgICAgICAgaW1nU3VibWlzc2lvbi5zcmMgPSBkcmF3LmRhdGFVcmw7XG4gICAgICAgIGlmIChkcmF3LmFjY2VwdGVkICYmICFpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjZXB0ZWQnKSkge1xuICAgICAgICAgICAgaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QuYWRkKCdhY2NlcHRlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY2NlcHRlZCcpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xuXG4gICAgLyogU0VSVklDRV9XT1JLRVJfUkVQTEFDRVxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcuL3NlcnZpY2Utd29ya2VyLXBob25lLmpzJywge3Njb3BlIDogbG9jYXRpb24ucGF0aG5hbWV9KS50aGVuKGZ1bmN0aW9uKHJlZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2UgV29ya2VyIFJlZ2lzdGVyIGZvciBzY29wZSA6ICVzJyxyZWcuc2NvcGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgIFNFUlZJQ0VfV09SS0VSX1JFUExBQ0UgKi9cblxufSkoKTsiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7XG4gICAgUGVnXG59IGZyb20gJy4uL2xlZ29fc2hhcGUvcGVnLmpzJztcbmltcG9ydCB7XG4gICAgQ2lyY2xlXG59IGZyb20gJy4uL2xlZ29fc2hhcGUvY2lyY2xlLmpzJztcbmltcG9ydCB7XG4gICAgTkJfQ0VMTFMsXG4gICAgSEVBREVSX0hFSUdIVCxcbiAgICBCQVNFX0xFR09fQ09MT1IsXG4gICAgQkFDS0dST1VORF9MRUdPX0NPTE9SXG59IGZyb20gJy4uL2NvbW1vbi9jb25zdC5qcyc7XG5pbXBvcnQge1xuICAgIGxlZ29CYXNlQ29sb3Jcbn0gZnJvbSAnLi4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xuXG4vKipcbiAqXG4gKiBDbGFzcyBmb3IgQ2FudmFzIEdyaWRcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBMZWdvR3JpZENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoaWQsIHNob3dSb3cpIHtcbiAgICAgICAgLy8gQmFzaWMgY2FudmFzXG4gICAgICAgIHRoaXMuY2FudmFzRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvLyBTaXplIG9mIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhc1JlY3QgPSB0aGlzLmNhbnZhc0VsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgLy8gSW5kaWNhdG9yIGZvciBzaG93aW5nIHRoZSBmaXJzdCByb3cgd2l0aCBwZWdzXG4gICAgICAgIHRoaXMuc2hvd1JvdyA9IHNob3dSb3c7XG4gICAgICAgIHRoaXMuY2FudmFzRWx0LndpZHRoID0gdGhpcy5jYW52YXNSZWN0LndpZHRoO1xuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gc2hvd1Jvdywgd2Ugd2lsbCBzaG93IG1vZGlmeSB0aGUgaGVhZGVyIEhlaWdodFxuICAgICAgICB0aGlzLmhlYWRlckhlaWdodCA9IHRoaXMuc2hvd1JvdyA/IEhFQURFUl9IRUlHSFQgOiAwO1xuICAgICAgICB0aGlzLmNhbnZhc0VsdC5oZWlnaHQgPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGggKyB0aGlzLmhlYWRlckhlaWdodDtcbiAgICAgICAgLy8gV2UgY2FsY3VsYXRlIHRoZSBjZWxsc2l6ZSBhY2NvcmRpbmcgdG8gdGhlIHNwYWNlIHRha2VuIGJ5IHRoZSBjYW52YXNcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpO1xuXG4gICAgICAgIC8vIFdlIGluaXRpYWxpemUgdGhlIEZhYnJpYyBKUyBsaWJyYXJ5IHdpdGggb3VyIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKGlkLCB7XG4gICAgICAgICAgICBzZWxlY3Rpb246IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBPYmplY3QgdGhhdCByZXByZXNlbnQgdGhlIHBlZ3Mgb24gdGhlIGZpcnN0IHJvd1xuICAgICAgICB0aGlzLnJvd1NlbGVjdCA9IHt9O1xuICAgICAgICAvLyBUaGUgY3VycmVudCBkcmF3IG1vZGVsIChpbnN0cnVjdGlvbnMsIC4uLilcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge30sXG4gICAgICAgICAgICAvLyBGbGFnIHRvIGRldGVybWluZSBpZiB3ZSBoYXZlIHRvIGNyZWF0ZSBhIG5ldyBicmlja1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdCcmljayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gQkFTRV9MRUdPX0NPTE9SO1xuXG4gICAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgY2FudmFzXG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcblxuICAgICAgICAvLyBJZiB3ZSBzaG93IHRoZSByb3csIHdlIGhhdmUgdG8gcGx1ZyB0aGUgbW92ZSBtYW5hZ2VtZW50XG4gICAgICAgIGlmIChzaG93Um93KSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6c2VsZWN0ZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWcgPyBvcHRpb25zLnRhcmdldCA6IG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ3NlbGVjdGlvbjpjbGVhcmVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gbnVsbCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6bW92aW5nJywgKG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGVnID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnO1xuXG5cbiAgICAgICAgICAgICAgICBsZXQgbmV3TGVmdCA9IE1hdGgucm91bmQob3B0aW9ucy50YXJnZXQubGVmdCAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3VG9wID0gTWF0aC5yb3VuZCgob3B0aW9ucy50YXJnZXQudG9wIC0gdGhpcy5oZWFkZXJIZWlnaHQpIC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplICsgdGhpcy5oZWFkZXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlIHRvcFxuICAgICAgICAgICAgICAgIGxldCB0b3BDb21wdXRlID0gbmV3VG9wICsgKHBlZy5zaXplLnJvdyA9PT0gMiB8fCBwZWcuYW5nbGUgPiAwID8gdGhpcy5jZWxsU2l6ZSAqIDIgOiB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgICAgICBsZXQgbGVmdENvbXB1dGUgPSBuZXdMZWZ0ICsgKHBlZy5zaXplLmNvbCA9PT0gMiA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgcGVnLm1vdmUoXG4gICAgICAgICAgICAgICAgICAgIG5ld0xlZnQsIC8vbGVmdFxuICAgICAgICAgICAgICAgICAgICBuZXdUb3AgLy8gdG9wXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIFdlIHNwZWNpZnkgdGhhdCB3ZSBjb3VsZCByZW1vdmUgYSBwZWcgaWYgb25lIG9mIGl0J3MgZWRnZSB0b3VjaCB0aGUgb3V0c2lkZSBvZiB0aGUgY2FudmFzXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA8IEhFQURFUl9IRUlHSFQgfHxcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdCA8IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgdG9wQ29tcHV0ZSA+PSB0aGlzLmNhbnZhc0VsdC5oZWlnaHQgfHxcbiAgICAgICAgICAgICAgICAgICAgbGVmdENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBFbHNlIHdlIGNoZWNrIHdlIGNyZWF0ZSBhIG5ldyBwZWcgKHdoZW4gYSBwZWcgZW50ZXIgaW4gdGhlIGRyYXcgYXJlYSlcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGVnLnJlcGxhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5jb2wgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUucm93ID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBlZy5hbmdsZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEsIDkwKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGVnLnJlcGxhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ21vdXNlOnVwJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCcmljayAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcudG9SZW1vdmUgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnJlcGxhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuYnJpY2tNb2RlbFt0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcuaWRdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmUodGhpcy5jdXJyZW50QnJpY2spO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBmb3IgY2hhbmdpbmcgdGhlIGNvbG9yIG9mIHRoZSBmaXJzdCByb3dcbiAgICAgKi9cbiAgICBjaGFuZ2VDb2xvcihjb2xvcikge1xuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXJpYWxpemUgdGhlIGNhbnZhcyB0byBhIG1pbmltYWwgb2JqZWN0IHRoYXQgY291bGQgYmUgdHJlYXQgYWZ0ZXJcbiAgICAgKi9cbiAgICBleHBvcnQgKHVzZXJOYW1lLCB1c2VySWQpIHtcbiAgICAgICAgbGV0IHJlc3VsdEFycmF5ID0gW107XG4gICAgICAgIC8vIFdlIGZpbHRlciB0aGUgcm93IHBlZ3NcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmJyaWNrTW9kZWwpXG4gICAgICAgICAgICAuZmlsdGVyKChrZXkpID0+IGtleSAhPSB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuaWQgJiZcbiAgICAgICAgICAgICAgICBrZXkgIT0gdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmlkICYmXG4gICAgICAgICAgICAgICAga2V5ICE9IHRoaXMucm93U2VsZWN0LnJlY3QuaWQgJiZcbiAgICAgICAgICAgICAgICBrZXkgIT0gdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuaWQpO1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBlZ1RtcCA9IHRoaXMuYnJpY2tNb2RlbFtrZXldO1xuICAgICAgICAgICAgcmVzdWx0QXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgc2l6ZTogcGVnVG1wLnNpemUsXG4gICAgICAgICAgICAgICAgY29sb3I6IHBlZ1RtcC5jb2xvcixcbiAgICAgICAgICAgICAgICBhbmdsZTogcGVnVG1wLmFuZ2xlLFxuICAgICAgICAgICAgICAgIHRvcDogcGVnVG1wLnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IHBlZ1RtcC5sZWZ0LFxuICAgICAgICAgICAgICAgIGNlbGxTaXplOiB0aGlzLmNlbGxTaXplXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1c2VyOiB1c2VyTmFtZSxcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zOiByZXN1bHRBcnJheVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgZnJvbSBpbnRydWN0aW9ucyBhIGRyYXdcbiAgICAgKi9cbiAgICBkcmF3SW5zdHJ1Y3Rpb25zKGluc3RydWN0aW9uT2JqZWN0KSB7XG4gICAgICAgIHRoaXMucmVzZXRCb2FyZCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xuICAgICAgICBpbnN0cnVjdGlvbk9iamVjdC5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdHJ1Y3Rpb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICAgICAgICAgIHNpemU6IGluc3RydWN0aW9uLnNpemUsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IChpbnN0cnVjdGlvbi5sZWZ0IC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAoaW5zdHJ1Y3Rpb24udG9wIC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGluc3RydWN0aW9uLmFuZ2xlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5zdHJ1Y3Rpb24uY29sb3JcbiAgICAgICAgICAgICAgICB9KS5jYW52YXNFbHRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gdGhlIGJvYXJkIGFuZCB0aGUgc3RhdGUgb2YgdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIHJlc2V0Qm9hcmQoKSB7XG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9O1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpO1xuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgYSBCYXNlNjQgaW1hZ2UgZnJvbSB0aGUgY2FudmFzXG4gICAgICovXG4gICAgc25hcHNob3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFByaXZhdGVzIE1ldGhvZHNcbiAgICAgKlxuICAgICAqL1xuXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHRoZSBiYXNpYyBncmlkXG4gICAgICovXG4gICAgX2RyYXdHcmlkKHNpemUpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1Jvdykge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHQsIHRoaXMuX2NyZWF0ZVNxdWFyZSgyKS5jYW52YXNFbHQsIHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0LCB0aGlzLl9jcmVhdGVSZWN0KDEsIDkwKS5jYW52YXNFbHRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFsbCB0aGUgd2hpdGUgcGVnIG9mIHRoZSBncmlkXG4gICAgICovXG4gICAgX2RyYXdXaGl0ZVBlZyhzaXplKSB7XG4gICAgICAgIC8vIFdlIHN0b3AgcmVuZGVyaW5nIG9uIGVhY2ggYWRkLCBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlc1xuICAgICAgICAvL3RoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLnJvdW5kKHNpemUgLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgbGV0IG1heFNpemUgPSBtYXggKiB0aGlzLmNlbGxTaXplO1xuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtYXg7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtYXg7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNxdWFyZVRtcCA9IG5ldyBmYWJyaWMuUmVjdCh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IEJBQ0tHUk9VTkRfTEVHT19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJlZFJvdGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlID0gbmV3IENpcmNsZSh0aGlzLmNlbGxTaXplLCBCQUNLR1JPVU5EX0xFR09fQ09MT1IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZS5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbG9ja1JvdGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1g6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoYXNCb3JkZXJzOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBncm91cFRtcCA9IG5ldyBmYWJyaWMuR3JvdXAoW3NxdWFyZVRtcCwgY2lyY2xlLmNhbnZhc0VsdF0sIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5jZWxsU2l6ZSAqIGNvbCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLmNlbGxTaXplICogcm93ICsgdGhpcy5oZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnM6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKGdyb3VwVG1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKnRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgICAgIC8vIFdlIHRyYW5zZm9ybSB0aGUgY2FudmFzIHRvIGEgYmFzZTY0IGltYWdlIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzLlxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnNldEJhY2tncm91bmRJbWFnZSh1cmwsdGhpcy5jYW52YXMucmVuZGVyQWxsLmJpbmQodGhpcy5jYW52YXMpLCB7XG4gICAgICAgICAgICBvcmlnaW5YOiAnbGVmdCcsXG4gICAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgfSk7ICAgKi9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBob3Jpem9udGFsIG9yIHZlcnRpY2FsIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIF9jcmVhdGVSZWN0KHNpemVSZWN0LCBhbmdsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xuICAgICAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgICAgIGNvbDogMiAqIHNpemVSZWN0LFxuICAgICAgICAgICAgICAgIHJvdzogMSAqIHNpemVSZWN0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVmdDogYW5nbGUgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDQpIC0gdGhpcy5jZWxsU2l6ZSkgOiAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAqIDMgLyA0KSAtICh0aGlzLmNlbGxTaXplICogMS41KSksXG4gICAgICAgICAgICB0b3A6IGFuZ2xlID8gMSA6IDAsXG4gICAgICAgICAgICBhbmdsZTogYW5nbGVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgc3F1YXJlICgxeDEpIG9yICgyeDIpXG4gICAgICovXG4gICAgX2NyZWF0ZVNxdWFyZShzaXplU3F1YXJlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICBzaXplOiB7XG4gICAgICAgICAgICAgICAgY29sOiAxICogc2l6ZVNxdWFyZSxcbiAgICAgICAgICAgICAgICByb3c6IDEgKiBzaXplU3F1YXJlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVmdDogc2l6ZVNxdWFyZSA9PT0gMiA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gMikgLSAoMiAqIHRoaXMuY2VsbFNpemUpKSA6ICh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxuICAgICAgICAgICAgdG9wOiBzaXplU3F1YXJlID09PSAyID8gMSA6IDAsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyaWMgbWV0aG9kIHRoYXQgY3JlYXRlIGEgcGVnXG4gICAgICovXG4gICAgX2NyZWF0ZUJyaWNrKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5jZWxsU2l6ZSA9IHRoaXMuY2VsbFNpemU7XG4gICAgICAgIG9wdGlvbnMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8IHRoaXMubGFzdENvbG9yO1xuICAgICAgICBsZXQgcGVnID0gbmV3IFBlZyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5icmlja01vZGVsW3BlZy5pZF0gPSBwZWc7XG4gICAgICAgIC8vIFdlIGhhdmUgdG8gdXBkYXRlIHRoZSByb3dTZWxlY3QgT2JqZWN0IHRvIGJlIGFsc3dheSB1cGRhdGVcbiAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZS5yb3cgPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZSA9IHBlZztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFuZ2xlKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdCA9IHBlZztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNpemUuY29sID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0ID0gcGVnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlID0gcGVnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwZWc7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbml0IHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICBfZHJhd0NhbnZhcygpIHtcbiAgICAgICAgdGhpcy5fZHJhd1doaXRlUGVnKHRoaXMuY2FudmFzUmVjdC53aWR0aCk7XG4gICAgICAgIHRoaXMuX2RyYXdHcmlkKHRoaXMuY2FudmFzUmVjdC53aWR0aCwgTWF0aC5yb3VuZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyBOQl9DRUxMUykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbi8vIE51bWJlciBvZiBjZWxsIG9uIHRoZSBncmlkXG5leHBvcnQgY29uc3QgTkJfQ0VMTFMgPSAxNTtcblxuLy8gSGVpZ2h0IG9mIHRoZSBoZWFkZXJcbmV4cG9ydCBjb25zdCBIRUFERVJfSEVJR0hUID0gd2luZG93LnNjcmVlbi53aWR0aCA8PSA3NjggID8gNjAgOiAxMDA7XG5cbi8vIEZpcnN0IGNvbG9yIHRvIHVzZVxuZXhwb3J0IGNvbnN0IEJBU0VfTEVHT19DT0xPUiA9IFwiIzBkNjlmMlwiO1xuXG4vLyBNZWRpdW0gU3RvbmUgR3JleSBcbmNvbnN0IENPTE9SXzE5NCA9IFwiI2EzYTJhNFwiO1xuXG4vLyBMaWdodCBTdG9uZSBHcmV5XG5jb25zdCBDT0xPUl8yMDggPSBcIiNlNWU0ZGVcIjsgXG5cbi8vIEJhY2tncm91bmQgY29sb3IgdXNlZFxuZXhwb3J0IGNvbnN0IEJBQ0tHUk9VTkRfTEVHT19DT0xPUiA9IENPTE9SXzIwODsiLCIndXNlIHN0cmljdCdcblxuLypcbiogQ29sb3JzIGZyb20gXG4qIGh0dHA6Ly9sZWdvLndpa2lhLmNvbS93aWtpL0NvbG91cl9QYWxldHRlIFxuKiBBbmQgaHR0cDovL3d3dy5wZWVyb24uY29tL2NnaS1iaW4vaW52Y2dpcy9jb2xvcmd1aWRlLmNnaVxuKiBPbmx5IFNob3cgdGhlIGNvbG9yIHVzZSBzaW5jZSAyMDEwXG4qKi8gXG5leHBvcnQgY29uc3QgTEVHT19DT0xPUlMgPSBbXG4gICAgJ3JnYigyNDUsIDIwNSwgNDcpJywgLy8yNCwgQnJpZ2h0IFllbGxvdyAqXG4gICAgJ3JnYigyNTMsIDIzNCwgMTQwKScsIC8vMjI2LCBDb29sIFllbGxvdyAqXG4gICAgJ3JnYigyMTgsIDEzMywgNjQpJywgLy8xMDYsIEJyaWdodCBPcmFuZ2UgKlxuICAgICdyZ2IoMjMyLCAxNzEsIDQ1KScsIC8vMTkxLCBGbGFtZSBZZWxsb3dpc2ggT3JhbmdlICpcbiAgICAncmdiKDE5NiwgNDAsIDI3KScsIC8vMjEsIEJyaWdodCBSZWQgKlxuICAgICdyZ2IoMTIzLCA0NiwgNDcpJywgLy8xNTQsIERhcmsgUmVkICpcbiAgICAncmdiKDIwNSwgOTgsIDE1MiknLCAvLzIyMSwgQnJpZ2h0IFB1cnBsZSAqXG4gICAgJ3JnYigyMjgsIDE3MywgMjAwKScsIC8vMjIyLCBMaWdodCBQdXJwbGUgKlxuICAgICdyZ2IoMTQ2LCA1NywgMTIwKScsIC8vMTI0LCBCcmlnaHQgUmVkZGlzaCBWaW9sZXQgKlxuICAgICdyZ2IoNTIsIDQzLCAxMTcpJywgLy8yNjgsIE1lZGl1bSBMaWxhYyAqXG4gICAgJ3JnYigxMywgMTA1LCAyNDIpJywgLy8yMywgQnJpZ2h0IEJsdWUgKlxuICAgICdyZ2IoMTU5LCAxOTUsIDIzMyknLCAvLzIxMiwgTGlnaHQgUm95YWwgQmx1ZSAqXG4gICAgJ3JnYigxMTAsIDE1MywgMjAxKScsIC8vMTAyLCBNZWRpdW0gQmx1ZSAqXG4gICAgJ3JnYigzMiwgNTgsIDg2KScsIC8vMTQwLCBFYXJ0aCBCbHVlICpcbiAgICAncmdiKDExNiwgMTM0LCAxNTYpJywgLy8xMzUsIFNhbmQgQmx1ZSAqXG4gICAgJ3JnYig0MCwgMTI3LCA3MCknLCAvLzI4LCBEYXJrIEdyZWVuICpcbiAgICAncmdiKDc1LCAxNTEsIDc0KScsIC8vMzcsIEJpcmdodCBHcmVlbiAqXG4gICAgJ3JnYigxMjAsIDE0NCwgMTI5KScsIC8vMTUxLCBTYW5kIEdyZWVuICpcbiAgICAncmdiKDM5LCA3MCwgNDQpJywgLy8xNDEsIEVhcnRoIEdyZWVuICpcbiAgICAncmdiKDE2NCwgMTg5LCA3MCknLCAvLzExOSwgQnJpZ2h0IFllbGxvd2lzaC1HcmVlbiAqIFxuICAgICdyZ2IoMTA1LCA2NCwgMzkpJywgLy8xOTIsIFJlZGRpc2ggQnJvd24gKlxuICAgICdyZ2IoMjE1LCAxOTcsIDE1MyknLCAvLzUsIEJyaWNrIFllbGxvdyAqIFxuICAgICdyZ2IoMTQ5LCAxMzgsIDExNSknLCAvLzEzOCwgU2FuZCBZZWxsb3cgKlxuICAgICdyZ2IoMTcwLCAxMjUsIDg1KScsIC8vMzEyLCBNZWRpdW0gTm91Z2F0ICogICAgXG4gICAgJ3JnYig0OCwgMTUsIDYpJywgLy8zMDgsIERhcmsgQnJvd24gKlxuICAgICdyZ2IoMjA0LCAxNDIsIDEwNCknLCAvLzE4LCBOb3VnYXQgKlxuICAgICdyZ2IoMjQ1LCAxOTMsIDEzNyknLCAvLzI4MywgTGlnaHQgTm91Z2F0ICpcbiAgICAncmdiKDE2MCwgOTUsIDUyKScsIC8vMzgsIERhcmsgT3JhbmdlICpcbiAgICAncmdiKDI0MiwgMjQzLCAyNDIpJywgLy8xLCBXaGl0ZSAqXG4gICAgJ3JnYigyMjksIDIyOCwgMjIyKScsIC8vMjA4LCBMaWdodCBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDE2MywgMTYyLCAxNjQpJywgLy8xOTQsIE1lZGl1bSBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDk5LCA5NSwgOTcpJywgLy8xOTksIERhcmsgU3RvbmUgR3JleSAqXG4gICAgJ3JnYigyNywgNDIsIDUyKScsIC8vMjYsIEJsYWNrICogICAgICAgIFxuXTsiLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIGEgdmFyaWF0aW9uIG9mIGNvbG9yXG4gKiBcbiAqIEZyb20gOiBodHRwczovL3d3dy5zaXRlcG9pbnQuY29tL2phdmFzY3JpcHQtZ2VuZXJhdGUtbGlnaHRlci1kYXJrZXItY29sb3IvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDb2xvckx1bWluYW5jZShoZXgsIGx1bSkge1xuXG4gICAgICAgIC8vIHZhbGlkYXRlIGhleCBzdHJpbmdcbiAgICAgICAgaGV4ID0gU3RyaW5nKGhleCkucmVwbGFjZSgvW14wLTlhLWZdL2dpLCAnJyk7XG4gICAgICAgIGlmIChoZXgubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xuICAgICAgICB9XG4gICAgICAgIGx1bSA9IGx1bSB8fCAwO1xuXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcbiAgICAgICAgdmFyIHJnYiA9IFwiI1wiLCBjLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpICogMiwgMiksIDE2KTtcbiAgICAgICAgICAgIGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICByZ2IgKz0gKFwiMDBcIiArIGMpLnN1YnN0cihjLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmdiO1xufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDb2xvckx1bWluYW5jZX0gZnJvbSAnLi4vY29tbW9uL3V0aWwuanMnO1xuXG4vKipcbiAqIENpcmNsZSBMZWdvIGNsYXNzXG4gKiBUaGUgY2lyY2xlIGlzIGNvbXBvc2VkIG9mIDIgY2lyY2xlIChvbiB0aGUgc2hhZG93LCBhbmQgdGhlIG90aGVyIG9uZSBmb3IgdGhlIHRvcClcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgQ2lyY2xle1xuICAgIGNvbnN0cnVjdG9yKGNlbGxTaXplLCBjb2xvcil7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDUsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc2hhZG93IDogXCIwcHggMnB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eCA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA0LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBmYWJyaWMuVGV4dCgnR0RHJywge1xuICAgICAgICAgICAgZm9udFNpemU6IGNlbGxTaXplIC8gNSxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc3Ryb2tlOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoW3RoaXMuY2lyY2xlQmFzaWNFdHgsIHRoaXMuY2lyY2xlQmFzaWMsIHRoaXMudGV4dF0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgRmFicmljSlMgZWxlbWVudFxuICAgICAqL1xuICAgIGdldCBjYW52YXNFbHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7IFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIGNpcmNsZVxuICAgICAqL1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYy5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSkpO1xuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4LnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpKTtcbiAgICAgICAgdGhpcy50ZXh0LnNldCh7XG4gICAgICAgICAgICBmaWxsIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcbiAgICAgICAgICAgIHN0cm9rZSA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMClcbiAgICAgICAgfSk7XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4vY2lyY2xlLmpzJztcblxuLyoqXG4gKiBQZWcgTGVnbyBjbGFzc1xuICogVGhlIHBlZyBpcyBjb21wb3NlZCBvZiBuIGNpcmNsZSBmb3IgYSBkaW1lbnNpb24gdGhhdCBkZXBlbmQgb24gdGhlIHNpemUgcGFyYW1ldGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBQZWd7XG4gICAgY29uc3RydWN0b3Ioe3NpemUgPSB7Y29sIDogMSwgcm93IDogMX0sIGNlbGxTaXplID0gMCwgY29sb3IgPSAnI0ZGRicsIGxlZnQgPSAwLCB0b3AgPSAwLCBhbmdsZSA9IDB9KXtcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5pZCA9IGBQZWcke3NpemV9LSR7RGF0ZS5ub3coKX1gO1xuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZSB8fCAwO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5ID0gW107XG5cblxuICAgICAgICB0aGlzLnJlY3RCYXNpYyA9IG5ldyBmYWJyaWMuUmVjdCh7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUgKiBzaXplLmNvbCxcbiAgICAgICAgICAgIGhlaWdodDogY2VsbFNpemUgKiBzaXplLnJvdyxcbiAgICAgICAgICAgIGZpbGw6IGNvbG9yLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjVweCA1cHggMTBweCByZ2JhKDAsMCwwLDAuMilcIiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGxldCBhcnJheUVsdHMgPSBbdGhpcy5yZWN0QmFzaWNdO1xuICAgICAgICBsZXQgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7ICAgICAgIFxuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gdGhlIHNpemUsIHdlIGRvbid0IHBsYWNlIHRoZSBjaXJjbGVzIGF0IHRoZSBzYW1lIHBsYWNlXG4gICAgICAgIGlmIChzaXplLmNvbCA9PT0gMil7XG4gICAgICAgICAgICAvLyBGb3IgYSByZWN0YW5nbGUgb3IgYSBiaWcgU3F1YXJlXG4gICAgICAgICAgICAvLyBXZSB1cGRhdGUgdGhlIHJvdyBwb3NpdGlvbnNcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT5hcnJheUVsdHMucHVzaChjaXJjbGUuY2FudmFzRWx0KSk7XG5cbiAgICAgICAgLy8gVGhlIHBlZyBpcyBsb2NrZWQgaW4gYWxsIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKGFycmF5RWx0cywge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5sZWZ0LFxuICAgICAgICAgICAgdG9wOiB0aGlzLnRvcCxcbiAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxuICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2UgYWRkIHRvIEZhYnJpY0VsZW1lbnQgYSByZWZlcmVuY2UgdG8gdGhlIGN1cmVudCBwZWdcbiAgICAgICAgdGhpcy5ncm91cC5wYXJlbnRQZWcgPSB0aGlzOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gVGhlIEZhYnJpY0pTIGVsZW1lbnRcbiAgICBnZXQgY2FudmFzRWx0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwO1xuICAgIH1cblxuICAgIC8vIFRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIHJlcGxhY2VkXG4gICAgZ2V0IHJlcGxhY2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXBsYWNlXG4gICAgfVxuXG4gICAgLy8gU2V0dGVyIGZvciBpc1JlcGxhY2UgcGFyYW1cbiAgICBzZXQgcmVwbGFjZShyZXBsYWNlKXtcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSByZXBsYWNlO1xuICAgIH1cblxuICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHBlZ1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnJlY3RCYXNpYy5zZXQoJ2ZpbGwnLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+IGNpcmNsZS5jaGFuZ2VDb2xvcihjb2xvcikpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gTW92ZSB0aGUgcGVnIHRvIGRlc2lyZSBwb3NpdGlvblxuICAgIG1vdmUobGVmdCwgdG9wKXtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcbiAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgbGVmdCA6IGxlZnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUm90YXRlIHRoZSBwZWcgdG8gdGhlIGRlc2lyZSBhbmdsZVxuICAgIHJvdGF0ZShhbmdsZSl7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xuICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxuICAgICAgICB9KTtcbiAgICB9XG5cbn0iXX0=
