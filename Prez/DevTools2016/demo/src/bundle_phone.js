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

    /* SERVICE_WORKER_REPLACE */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker-phone.js', { scope: location.pathname }).then(function (reg) {
            console.log('Service Worker Register for scope : %s', reg.scope);
        });
    }
    /* SERVICE_WORKER_REPLACE */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfcGhvbmUuanMiLCJzcmMvc2NyaXB0cy9jYW52YXMvbGVnb0NhbnZhcy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9jb25zdC5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9sZWdvQ29sb3JzLmpzIiwic3JjL3NjcmlwdHMvY29tbW9uL3V0aWwuanMiLCJzcmMvc2NyaXB0cy9sZWdvX3NoYXBlL2NpcmNsZS5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvcGVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBS0EsQ0FBQyxZQUFZOztBQUVULFFBQUksV0FBVyxLQUFmO0FBQUEsUUFBc0I7QUFDbEIsaUJBQWEsSUFEakI7QUFBQSxRQUN1QjtBQUNuQixXQUFPLElBRlg7QUFBQSxRQUVpQjtBQUNiLGlCQUFhLElBSGpCO0FBQUEsUUFHdUI7QUFDbkIsWUFBUSxDQUpaOztBQU9BLGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIscUJBQWEsK0JBQW1CLFlBQW5CLEVBQWlDLElBQWpDLENBQWI7O0FBRUEsVUFBRSxnQkFBRixFQUFvQixRQUFwQixDQUE2QjtBQUN6Qiw2QkFBaUIsSUFEUTtBQUV6Qix5QkFBYSxJQUZZO0FBR3pCLHlDQUh5QjtBQUl6Qiw0Q0FKeUI7QUFLekIsb0JBQVEsZ0JBQVUsS0FBVixFQUFpQjtBQUNyQiwyQkFBVyxXQUFYLENBQXVCLE1BQU0sV0FBTixFQUF2QjtBQUNIO0FBUHdCLFNBQTdCO0FBU0g7O0FBRUQsYUFBUyxRQUFULEdBQW9COztBQUdoQjs7O0FBR0EsWUFBTSxXQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUFqQjtBQUNBLFlBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBaEI7O0FBRUEsWUFBTSxjQUFjLEdBQUcsVUFBSCxDQUNmLFNBRGUsQ0FDTCxRQURL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LElBTHNCO0FBTXJDLDBCQUFlLElBTnNCO0FBT3JDLHlCQUFjO0FBUHVCLFNBQTVCLENBQWI7O0FBVUE7QUFDQSxhQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLElBQXZCO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFlQTtvQ0FDWSxLLEVBQU07QUFDZCxpQkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLE1BQW5CLEVBQTJCLEtBQTNCO0FBQ0EsaUJBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixVQUFDLE1BQUQ7QUFBQSx1QkFBVyxPQUFPLFdBQVAsQ0FBbUIsS0FBbkIsQ0FBWDtBQUFBLGFBQXpCO0FBQ0g7O0FBRUQ7Ozs7NkJBQ0ssSSxFQUFNLEcsRUFBSTtBQUNYLGlCQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsaUJBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxpQkFBSyxLQUFMLENBQVcsR0FBWCxDQUFlO0FBQ1gscUJBQUssR0FETTtBQUVYLHNCQUFPO0FBRkksYUFBZjtBQUlIOztBQUVEOzs7OytCQUNPLEssRUFBTTtBQUNULGlCQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZTtBQUNYLHVCQUFRO0FBREcsYUFBZjtBQUdIOzs7NEJBckNjO0FBQ1gsbUJBQU8sS0FBSyxLQUFaO0FBQ0g7O0FBRUQ7Ozs7NEJBQ2E7QUFDVCxtQkFBTyxLQUFLLFNBQVo7QUFDSDs7QUFFRDs7MEJBQ1ksTyxFQUFRO0FBQ2hCLGlCQUFLLFNBQUwsR0FBaUIsT0FBakI7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7XG4gICAgTEVHT19DT0xPUlNcbn0gZnJvbSAnLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XG5pbXBvcnQge1xuICAgIEJBU0VfTEVHT19DT0xPUlxufSBmcm9tICcuL2NvbW1vbi9jb25zdC5qcyc7XG5pbXBvcnQge1xuICAgIExlZ29HcmlkQ2FudmFzXG59IGZyb20gJy4vY2FudmFzL2xlZ29DYW52YXMuanMnO1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXQgZ2FtZUluaXQgPSBmYWxzZSwgLy8gdHJ1ZSBpZiB3ZSBpbml0IHRoZSBsZWdvR3JpZFxuICAgICAgICBsZWdvQ2FudmFzID0gbnVsbCwgLy8gVGhlIGxlZ29HcmlkXG4gICAgICAgIGtleXMgPSBudWxsLCAvLyBUaGUga2V5cyBvZiBmaXJlbmFzZSBzdWJtaXQgZHJhd1xuICAgICAgICBzbmFwc2hvdEZiID0gbnVsbCwgLy8gVGhlIHNuYXBzaG90IG9mIHN1Ym1pdCBkcmF3XG4gICAgICAgIGluZGV4ID0gMDtcblxuXG4gICAgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG5cbiAgICAgICAgbGVnb0NhbnZhcyA9IG5ldyBMZWdvR3JpZENhbnZhcygnY2FudmFzRHJhdycsIHRydWUpO1xuXG4gICAgICAgICQoXCIjY29sb3ItcGlja2VyMlwiKS5zcGVjdHJ1bSh7XG4gICAgICAgICAgICBzaG93UGFsZXR0ZU9ubHk6IHRydWUsXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiBCQVNFX0xFR09fQ09MT1IsXG4gICAgICAgICAgICBwYWxldHRlOiBMRUdPX0NPTE9SUyxcbiAgICAgICAgICAgIGNoYW5nZTogZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgbGVnb0NhbnZhcy5jaGFuZ2VDb2xvcihjb2xvci50b0hleFN0cmluZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBDaW5lbWF0aWMgQnV0dG9uc1xuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRCdG4nKTtcbiAgICAgICAgY29uc3QgaGVscEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxwJylcblxuICAgICAgICBjb25zdCBzdHJlYW1TdGFydCA9IFJ4Lk9ic2VydmFibGVcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoc3RhcnRCdG4sICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdzdGFydCcpO1xuXG4gICAgICAgIGNvbnN0IHN0cmVhbUhlbHAgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGhlbHBCdG4sICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdoZWxwJyk7XG5cbiAgICAgICAgc3RyZWFtU3RhcnQubWVyZ2Uoc3RyZWFtSGVscClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxsby1tc2cnKS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLXBpY2tlcjInKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2FtZUluaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbWVvdXQgbmVlZGVkIHRvIHN0YXJ0IHRoZSByZW5kZXJpbmcgb2YgbG9hZGluZyBhbmltYXRpb24gKGVsc2Ugd2lsbCBub3QgYmUgc2hvdylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0R2FtZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09ICdoZWxwJykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBzdWJtaXNzaW9uXG4gICAgICAgICAqL1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5TdWJtaXNzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdVc2VyIE5hbWUnLFxuICAgICAgICAgICAgICAgIGlkOiAndXNlcklkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGRyYXdEYXRhcyA9IGxlZ29DYW52YXMuZXhwb3J0KHVzZXIubmFtZSwgdXNlci5pZCk7XG4gICAgICAgICAgICBkcmF3RGF0YXMuZGF0YVVybCA9IGxlZ29DYW52YXMuc25hcHNob3QoKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnd2lsbCBzZW5kIDogJywgZHJhd0RhdGFzKTtcbiAgICAgICAgICAgIGNvbnN0IFVSTCA9IGBodHRwOi8vbG9jYWxob3N0OjkwMDAvZHJhdy8ke3VzZXIuaWR9YDtcbiAgICAgICAgICAgIGZldGNoKFVSTCwge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZHJhd0RhdGFzKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgbWVudSBpdGVtc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBtZW51R2FtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKTtcbiAgICAgICAgY29uc3QgbWVudUNyZWF0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpO1xuXG5cbiAgICAgICAgY29uc3Qgc3RyZWFtR2FtZSA9IFJ4Lk9ic2VydmFibGVcbiAgICAgICAgICAgIC5mcm9tRXZlbnQobWVudUdhbWUsICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdnYW1lJyk7XG5cbiAgICAgICAgY29uc3Qgc3RyZWFtQ3JlYXRpb25zID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChtZW51Q3JlYXRpb25zLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnY3JlYXRpb25zJyk7XG5cbiAgICAgICAgc3RyZWFtR2FtZS5tZXJnZShzdHJlYW1DcmVhdGlvbnMpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ2dhbWUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNvbnRlbnQnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0dGVkJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtY3JlYXRpb25zJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX2RyYXdlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX29iZnVzY2F0b3InKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAnY3JlYXRpb25zJykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jb250ZW50Jykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXR0ZWQnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtY3JlYXRpb25zJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19kcmF3ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19vYmZ1c2NhdG9yJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVXNlciBOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAndXNlcklkJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBteUluaXQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFVSTCA9IGBodHRwOi8vbG9jYWxob3N0OjkwMDAvZHJhdy8ke3VzZXIuaWR9YDtcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goVVJMLCBteUluaXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc25hcHNob3QuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzbmFwc2hvdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNuYXBzaG90RmIgPSBzbmFwc2hvdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gZHJhdyAhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBCdXR0b25zIGZvciBjaGFuZ2luZyBvZiBkcmF3XG4gICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0IGJ0bkxlZnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuTGVmdCcpO1xuICAgICAgICBjb25zdCBidG5SaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5SaWdodCcpO1xuXG4gICAgICAgIGNvbnN0IHN0cmVhbUJ0bkxlZnQgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGJ0bkxlZnQsICdjbGljaycsICgpID0+IGluZGV4ID0gTWF0aC5tYXgoaW5kZXggLSAxLCAwKSk7XG4gICAgICAgIGNvbnN0IHN0cmVhbUJ0blJpZ2h0ID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChidG5SaWdodCwgJ2NsaWNrJywgKCkgPT4gaW5kZXggPSBNYXRoLm1pbihpbmRleCArIDEsIGtleXMubGVuZ3RoIC0gMSkpO1xuXG4gICAgICAgIHN0cmVhbUJ0bkxlZnQubWVyZ2Uoc3RyZWFtQnRuUmlnaHQpLnN1YnNjcmliZShkcmF3KTtcblxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyBhIGRyYXcgYW5kIHNob3cgaXQncyBzdGF0ZSA6IFJlamVjdGVkIG9yIEFjY2VwdGVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gZHJhdygpIHtcbiAgICAgICAgbGV0IGRyYXcgPSBzbmFwc2hvdEZiW2tleXNbaW5kZXhdXTtcbiAgICAgICAgbGV0IGltZ1N1Ym1pc3Npb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nU3VibWlzc2lvbicpO1xuICAgICAgICBpbWdTdWJtaXNzaW9uLnNyYyA9IGRyYXcuZGF0YVVybDtcbiAgICAgICAgaWYgKGRyYXcuYWNjZXB0ZWQgJiYgIWltZ1N1Ym1pc3Npb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NlcHRlZCcpKSB7XG4gICAgICAgICAgICBpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5hZGQoJ2FjY2VwdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjY2VwdGVkJyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG5cbiAgICAvKiBTRVJWSUNFX1dPUktFUl9SRVBMQUNFICovXG4gICAgaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy4vc2VydmljZS13b3JrZXItcGhvbmUuanMnLCB7c2NvcGUgOiBsb2NhdGlvbi5wYXRobmFtZX0pLnRoZW4oZnVuY3Rpb24ocmVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmljZSBXb3JrZXIgUmVnaXN0ZXIgZm9yIHNjb3BlIDogJXMnLHJlZy5zY29wZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKiBTRVJWSUNFX1dPUktFUl9SRVBMQUNFICovXG5cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1xuICAgIFBlZ1xufSBmcm9tICcuLi9sZWdvX3NoYXBlL3BlZy5qcyc7XG5pbXBvcnQge1xuICAgIENpcmNsZVxufSBmcm9tICcuLi9sZWdvX3NoYXBlL2NpcmNsZS5qcyc7XG5pbXBvcnQge1xuICAgIE5CX0NFTExTLFxuICAgIEhFQURFUl9IRUlHSFQsXG4gICAgQkFTRV9MRUdPX0NPTE9SLFxuICAgIEJBQ0tHUk9VTkRfTEVHT19DT0xPUlxufSBmcm9tICcuLi9jb21tb24vY29uc3QuanMnO1xuaW1wb3J0IHtcbiAgICBsZWdvQmFzZUNvbG9yXG59IGZyb20gJy4uL2NvbW1vbi9sZWdvQ29sb3JzLmpzJztcblxuLyoqXG4gKlxuICogQ2xhc3MgZm9yIENhbnZhcyBHcmlkXG4gKlxuICovXG5leHBvcnQgY2xhc3MgTGVnb0dyaWRDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBzaG93Um93KSB7XG4gICAgICAgIC8vIEJhc2ljIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhc0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgLy8gU2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXNSZWN0ID0gdGhpcy5jYW52YXNFbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIC8vIEluZGljYXRvciBmb3Igc2hvd2luZyB0aGUgZmlyc3Qgcm93IHdpdGggcGVnc1xuICAgICAgICB0aGlzLnNob3dSb3cgPSBzaG93Um93O1xuICAgICAgICB0aGlzLmNhbnZhc0VsdC53aWR0aCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aDtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHNob3dSb3csIHdlIHdpbGwgc2hvdyBtb2RpZnkgdGhlIGhlYWRlciBIZWlnaHRcbiAgICAgICAgdGhpcy5oZWFkZXJIZWlnaHQgPSB0aGlzLnNob3dSb3cgPyBIRUFERVJfSEVJR0hUIDogMDtcbiAgICAgICAgdGhpcy5jYW52YXNFbHQuaGVpZ2h0ID0gdGhpcy5jYW52YXNSZWN0LndpZHRoICsgdGhpcy5oZWFkZXJIZWlnaHQ7XG4gICAgICAgIC8vIFdlIGNhbGN1bGF0ZSB0aGUgY2VsbHNpemUgYWNjb3JkaW5nIHRvIHRoZSBzcGFjZSB0YWtlbiBieSB0aGUgY2FudmFzXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKTtcblxuICAgICAgICAvLyBXZSBpbml0aWFsaXplIHRoZSBGYWJyaWMgSlMgbGlicmFyeSB3aXRoIG91ciBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgZmFicmljLkNhbnZhcyhpZCwge1xuICAgICAgICAgICAgc2VsZWN0aW9uOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gT2JqZWN0IHRoYXQgcmVwcmVzZW50IHRoZSBwZWdzIG9uIHRoZSBmaXJzdCByb3dcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QgPSB7fTtcbiAgICAgICAgLy8gVGhlIGN1cnJlbnQgZHJhdyBtb2RlbCAoaW5zdHJ1Y3Rpb25zLCAuLi4pXG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9LFxuICAgICAgICAgICAgLy8gRmxhZyB0byBkZXRlcm1pbmUgaWYgd2UgaGF2ZSB0byBjcmVhdGUgYSBuZXcgYnJpY2tcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3QnJpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IEJBU0VfTEVHT19DT0xPUjtcblxuICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIGNhbnZhc1xuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XG5cbiAgICAgICAgLy8gSWYgd2Ugc2hvdyB0aGUgcm93LCB3ZSBoYXZlIHRvIHBsdWcgdGhlIG1vdmUgbWFuYWdlbWVudFxuICAgICAgICBpZiAoc2hvd1Jvdykge1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0OnNlbGVjdGVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnID8gb3B0aW9ucy50YXJnZXQgOiBudWxsKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdzZWxlY3Rpb246Y2xlYXJlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG51bGwpO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0Om1vdmluZycsIChvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBlZyA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZztcblxuXG4gICAgICAgICAgICAgICAgbGV0IG5ld0xlZnQgPSBNYXRoLnJvdW5kKG9wdGlvbnMudGFyZ2V0LmxlZnQgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1RvcCA9IE1hdGgucm91bmQoKG9wdGlvbnMudGFyZ2V0LnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0KSAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSArIHRoaXMuaGVhZGVySGVpZ2h0O1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gY2FsY3VsYXRlIHRoZSB0b3BcbiAgICAgICAgICAgICAgICBsZXQgdG9wQ29tcHV0ZSA9IG5ld1RvcCArIChwZWcuc2l6ZS5yb3cgPT09IDIgfHwgcGVnLmFuZ2xlID4gMCA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnRDb21wdXRlID0gbmV3TGVmdCArIChwZWcuc2l6ZS5jb2wgPT09IDIgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgICAgIHBlZy5tb3ZlKFxuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0LCAvL2xlZnRcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wIC8vIHRvcFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBzcGVjaWZ5IHRoYXQgd2UgY291bGQgcmVtb3ZlIGEgcGVnIGlmIG9uZSBvZiBpdCdzIGVkZ2UgdG91Y2ggdGhlIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xuICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPCBIRUFERVJfSEVJR0hUIHx8XG4gICAgICAgICAgICAgICAgICAgIG5ld0xlZnQgPCAwIHx8XG4gICAgICAgICAgICAgICAgICAgIHRvcENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQuaGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSB3ZSBjaGVjayB3ZSBjcmVhdGUgYSBuZXcgcGVnICh3aGVuIGEgcGVnIGVudGVyIGluIHRoZSBkcmF3IGFyZWEpXG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUuY29sID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLnJvdyA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwZWcuYW5nbGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxLCA5MCkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZy5yZXBsYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdtb3VzZTp1cCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QnJpY2sgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnRvUmVtb3ZlICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmJyaWNrTW9kZWxbdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlKHRoaXMuY3VycmVudEJyaWNrKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgZm9yIGNoYW5naW5nIHRoZSBjb2xvciBvZiB0aGUgZmlyc3Qgcm93XG4gICAgICovXG4gICAgY2hhbmdlQ29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdC5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VyaWFsaXplIHRoZSBjYW52YXMgdG8gYSBtaW5pbWFsIG9iamVjdCB0aGF0IGNvdWxkIGJlIHRyZWF0IGFmdGVyXG4gICAgICovXG4gICAgZXhwb3J0ICh1c2VyTmFtZSwgdXNlcklkKSB7XG4gICAgICAgIGxldCByZXN1bHRBcnJheSA9IFtdO1xuICAgICAgICAvLyBXZSBmaWx0ZXIgdGhlIHJvdyBwZWdzXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5icmlja01vZGVsKVxuICAgICAgICAgICAgLmZpbHRlcigoa2V5KSA9PiBrZXkgIT0gdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmlkICYmXG4gICAgICAgICAgICAgICAga2V5ICE9IHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5pZCAmJlxuICAgICAgICAgICAgICAgIGtleSAhPSB0aGlzLnJvd1NlbGVjdC5yZWN0LmlkICYmXG4gICAgICAgICAgICAgICAga2V5ICE9IHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmlkKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGxldCBwZWdUbXAgPSB0aGlzLmJyaWNrTW9kZWxba2V5XTtcbiAgICAgICAgICAgIHJlc3VsdEFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHNpemU6IHBlZ1RtcC5zaXplLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBwZWdUbXAuY29sb3IsXG4gICAgICAgICAgICAgICAgYW5nbGU6IHBlZ1RtcC5hbmdsZSxcbiAgICAgICAgICAgICAgICB0b3A6IHBlZ1RtcC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBwZWdUbXAubGVmdCxcbiAgICAgICAgICAgICAgICBjZWxsU2l6ZTogdGhpcy5jZWxsU2l6ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXNlcjogdXNlck5hbWUsXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIGluc3RydWN0aW9uczogcmVzdWx0QXJyYXlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGZyb20gaW50cnVjdGlvbnMgYSBkcmF3XG4gICAgICovXG4gICAgZHJhd0luc3RydWN0aW9ucyhpbnN0cnVjdGlvbk9iamVjdCkge1xuICAgICAgICB0aGlzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgaW5zdHJ1Y3Rpb25PYmplY3QuaW5zdHJ1Y3Rpb25zLmZvckVhY2goKGluc3RydWN0aW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlQnJpY2soe1xuICAgICAgICAgICAgICAgICAgICBzaXplOiBpbnN0cnVjdGlvbi5zaXplLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoaW5zdHJ1Y3Rpb24ubGVmdCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogKGluc3RydWN0aW9uLnRvcCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBpbnN0cnVjdGlvbi5hbmdsZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluc3RydWN0aW9uLmNvbG9yXG4gICAgICAgICAgICAgICAgfSkuY2FudmFzRWx0XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFuIHRoZSBib2FyZCBhbmQgdGhlIHN0YXRlIG9mIHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICByZXNldEJvYXJkKCkge1xuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fTtcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIGEgQmFzZTY0IGltYWdlIGZyb20gdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIHNuYXBzaG90KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBQcml2YXRlcyBNZXRob2RzXG4gICAgICpcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogRHJhdyB0aGUgYmFzaWMgZ3JpZFxuICAgICAqL1xuICAgIF9kcmF3R3JpZChzaXplKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3dSb3cpIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0LCB0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0LCB0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdCwgdGhpcy5fY3JlYXRlUmVjdCgxLCA5MCkuY2FudmFzRWx0XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhbGwgdGhlIHdoaXRlIHBlZyBvZiB0aGUgZ3JpZFxuICAgICAqL1xuICAgIF9kcmF3V2hpdGVQZWcoc2l6ZSkge1xuICAgICAgICAvLyBXZSBzdG9wIHJlbmRlcmluZyBvbiBlYWNoIGFkZCwgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXNcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1heCA9IE1hdGgucm91bmQoc2l6ZSAvIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICBsZXQgbWF4U2l6ZSA9IG1heCAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IG1heDsgcm93KyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1heDsgY29sKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3F1YXJlVG1wID0gbmV3IGZhYnJpYy5SZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogQkFDS0dST1VORF9MRUdPX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBjaXJjbGUgPSBuZXcgQ2lyY2xlKHRoaXMuY2VsbFNpemUsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUik7XG4gICAgICAgICAgICAgICAgY2lyY2xlLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnM6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwVG1wID0gbmV3IGZhYnJpYy5Hcm91cChbc3F1YXJlVG1wLCBjaXJjbGUuY2FudmFzRWx0XSwge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLmNlbGxTaXplICogY29sLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuY2VsbFNpemUgKiByb3cgKyB0aGlzLmhlYWRlckhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdYOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1k6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFg6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVyczogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoZ3JvdXBUbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgICAgIC8vIFdlIHRyYW5zZm9ybSB0aGUgY2FudmFzIHRvIGEgYmFzZTY0IGltYWdlIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzLlxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnNldEJhY2tncm91bmRJbWFnZSh1cmwsdGhpcy5jYW52YXMucmVuZGVyQWxsLmJpbmQodGhpcy5jYW52YXMpLCB7XG4gICAgICAgICAgICBvcmlnaW5YOiAnbGVmdCcsXG4gICAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgfSk7ICAgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCByZWN0YW5nbGVcbiAgICAgKi9cbiAgICBfY3JlYXRlUmVjdChzaXplUmVjdCwgYW5nbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcbiAgICAgICAgICAgIHNpemU6IHtcbiAgICAgICAgICAgICAgICBjb2w6IDIgKiBzaXplUmVjdCxcbiAgICAgICAgICAgICAgICByb3c6IDEgKiBzaXplUmVjdFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlZnQ6IGFuZ2xlID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyA0KSAtIHRoaXMuY2VsbFNpemUpIDogKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggKiAzIC8gNCkgLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxuICAgICAgICAgICAgdG9wOiBhbmdsZSA/IDEgOiAwLFxuICAgICAgICAgICAgYW5nbGU6IGFuZ2xlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHNxdWFyZSAoMXgxKSBvciAoMngyKVxuICAgICAqL1xuICAgIF9jcmVhdGVTcXVhcmUoc2l6ZVNxdWFyZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xuICAgICAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgICAgIGNvbDogMSAqIHNpemVTcXVhcmUsXG4gICAgICAgICAgICAgICAgcm93OiAxICogc2l6ZVNxdWFyZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlZnQ6IHNpemVTcXVhcmUgPT09IDIgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDIpIC0gKDIgKiB0aGlzLmNlbGxTaXplKSkgOiAodGhpcy5jYW52YXNSZWN0LndpZHRoIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcbiAgICAgICAgICAgIHRvcDogc2l6ZVNxdWFyZSA9PT0gMiA/IDEgOiAwLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmljIG1ldGhvZCB0aGF0IGNyZWF0ZSBhIHBlZ1xuICAgICAqL1xuICAgIF9jcmVhdGVCcmljayhvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMuY2VsbFNpemUgPSB0aGlzLmNlbGxTaXplO1xuICAgICAgICBvcHRpb25zLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCB0aGlzLmxhc3RDb2xvcjtcbiAgICAgICAgbGV0IHBlZyA9IG5ldyBQZWcob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbFtwZWcuaWRdID0gcGVnO1xuICAgICAgICAvLyBXZSBoYXZlIHRvIHVwZGF0ZSB0aGUgcm93U2VsZWN0IE9iamVjdCB0byBiZSBhbHN3YXkgdXBkYXRlXG4gICAgICAgIGlmIChvcHRpb25zLnNpemUucm93ID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbmdsZSkge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zaXplLmNvbCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdCA9IHBlZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZSA9IHBlZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGVnO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5pdCB0aGUgY2FudmFzXG4gICAgICovXG4gICAgX2RyYXdDYW52YXMoKSB7XG4gICAgICAgIHRoaXMuX2RyYXdXaGl0ZVBlZyh0aGlzLmNhbnZhc1JlY3Qud2lkdGgpO1xuICAgICAgICB0aGlzLl9kcmF3R3JpZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGgsIE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG4vLyBOdW1iZXIgb2YgY2VsbCBvbiB0aGUgZ3JpZFxuZXhwb3J0IGNvbnN0IE5CX0NFTExTID0gMTU7XG5cbi8vIEhlaWdodCBvZiB0aGUgaGVhZGVyXG5leHBvcnQgY29uc3QgSEVBREVSX0hFSUdIVCA9IHdpbmRvdy5zY3JlZW4ud2lkdGggPD0gNzY4ICA/IDYwIDogMTAwO1xuXG4vLyBGaXJzdCBjb2xvciB0byB1c2VcbmV4cG9ydCBjb25zdCBCQVNFX0xFR09fQ09MT1IgPSBcIiMwZDY5ZjJcIjtcblxuLy8gTWVkaXVtIFN0b25lIEdyZXkgXG5jb25zdCBDT0xPUl8xOTQgPSBcIiNhM2EyYTRcIjtcblxuLy8gTGlnaHQgU3RvbmUgR3JleVxuY29uc3QgQ09MT1JfMjA4ID0gXCIjZTVlNGRlXCI7IFxuXG4vLyBCYWNrZ3JvdW5kIGNvbG9yIHVzZWRcbmV4cG9ydCBjb25zdCBCQUNLR1JPVU5EX0xFR09fQ09MT1IgPSBDT0xPUl8yMDg7IiwiJ3VzZSBzdHJpY3QnXG5cbi8qXG4qIENvbG9ycyBmcm9tIFxuKiBodHRwOi8vbGVnby53aWtpYS5jb20vd2lraS9Db2xvdXJfUGFsZXR0ZSBcbiogQW5kIGh0dHA6Ly93d3cucGVlcm9uLmNvbS9jZ2ktYmluL2ludmNnaXMvY29sb3JndWlkZS5jZ2lcbiogT25seSBTaG93IHRoZSBjb2xvciB1c2Ugc2luY2UgMjAxMFxuKiovIFxuZXhwb3J0IGNvbnN0IExFR09fQ09MT1JTID0gW1xuICAgICdyZ2IoMjQ1LCAyMDUsIDQ3KScsIC8vMjQsIEJyaWdodCBZZWxsb3cgKlxuICAgICdyZ2IoMjUzLCAyMzQsIDE0MCknLCAvLzIyNiwgQ29vbCBZZWxsb3cgKlxuICAgICdyZ2IoMjE4LCAxMzMsIDY0KScsIC8vMTA2LCBCcmlnaHQgT3JhbmdlICpcbiAgICAncmdiKDIzMiwgMTcxLCA0NSknLCAvLzE5MSwgRmxhbWUgWWVsbG93aXNoIE9yYW5nZSAqXG4gICAgJ3JnYigxOTYsIDQwLCAyNyknLCAvLzIxLCBCcmlnaHQgUmVkICpcbiAgICAncmdiKDEyMywgNDYsIDQ3KScsIC8vMTU0LCBEYXJrIFJlZCAqXG4gICAgJ3JnYigyMDUsIDk4LCAxNTIpJywgLy8yMjEsIEJyaWdodCBQdXJwbGUgKlxuICAgICdyZ2IoMjI4LCAxNzMsIDIwMCknLCAvLzIyMiwgTGlnaHQgUHVycGxlICpcbiAgICAncmdiKDE0NiwgNTcsIDEyMCknLCAvLzEyNCwgQnJpZ2h0IFJlZGRpc2ggVmlvbGV0ICpcbiAgICAncmdiKDUyLCA0MywgMTE3KScsIC8vMjY4LCBNZWRpdW0gTGlsYWMgKlxuICAgICdyZ2IoMTMsIDEwNSwgMjQyKScsIC8vMjMsIEJyaWdodCBCbHVlICpcbiAgICAncmdiKDE1OSwgMTk1LCAyMzMpJywgLy8yMTIsIExpZ2h0IFJveWFsIEJsdWUgKlxuICAgICdyZ2IoMTEwLCAxNTMsIDIwMSknLCAvLzEwMiwgTWVkaXVtIEJsdWUgKlxuICAgICdyZ2IoMzIsIDU4LCA4NiknLCAvLzE0MCwgRWFydGggQmx1ZSAqXG4gICAgJ3JnYigxMTYsIDEzNCwgMTU2KScsIC8vMTM1LCBTYW5kIEJsdWUgKlxuICAgICdyZ2IoNDAsIDEyNywgNzApJywgLy8yOCwgRGFyayBHcmVlbiAqXG4gICAgJ3JnYig3NSwgMTUxLCA3NCknLCAvLzM3LCBCaXJnaHQgR3JlZW4gKlxuICAgICdyZ2IoMTIwLCAxNDQsIDEyOSknLCAvLzE1MSwgU2FuZCBHcmVlbiAqXG4gICAgJ3JnYigzOSwgNzAsIDQ0KScsIC8vMTQxLCBFYXJ0aCBHcmVlbiAqXG4gICAgJ3JnYigxNjQsIDE4OSwgNzApJywgLy8xMTksIEJyaWdodCBZZWxsb3dpc2gtR3JlZW4gKiBcbiAgICAncmdiKDEwNSwgNjQsIDM5KScsIC8vMTkyLCBSZWRkaXNoIEJyb3duICpcbiAgICAncmdiKDIxNSwgMTk3LCAxNTMpJywgLy81LCBCcmljayBZZWxsb3cgKiBcbiAgICAncmdiKDE0OSwgMTM4LCAxMTUpJywgLy8xMzgsIFNhbmQgWWVsbG93ICpcbiAgICAncmdiKDE3MCwgMTI1LCA4NSknLCAvLzMxMiwgTWVkaXVtIE5vdWdhdCAqICAgIFxuICAgICdyZ2IoNDgsIDE1LCA2KScsIC8vMzA4LCBEYXJrIEJyb3duICpcbiAgICAncmdiKDIwNCwgMTQyLCAxMDQpJywgLy8xOCwgTm91Z2F0ICpcbiAgICAncmdiKDI0NSwgMTkzLCAxMzcpJywgLy8yODMsIExpZ2h0IE5vdWdhdCAqXG4gICAgJ3JnYigxNjAsIDk1LCA1MiknLCAvLzM4LCBEYXJrIE9yYW5nZSAqXG4gICAgJ3JnYigyNDIsIDI0MywgMjQyKScsIC8vMSwgV2hpdGUgKlxuICAgICdyZ2IoMjI5LCAyMjgsIDIyMiknLCAvLzIwOCwgTGlnaHQgU3RvbmUgR3JleSAqXG4gICAgJ3JnYigxNjMsIDE2MiwgMTY0KScsIC8vMTk0LCBNZWRpdW0gU3RvbmUgR3JleSAqXG4gICAgJ3JnYig5OSwgOTUsIDk3KScsIC8vMTk5LCBEYXJrIFN0b25lIEdyZXkgKlxuICAgICdyZ2IoMjcsIDQyLCA1MiknLCAvLzI2LCBCbGFjayAqICAgICAgICBcbl07IiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBhIHZhcmlhdGlvbiBvZiBjb2xvclxuICogXG4gKiBGcm9tIDogaHR0cHM6Ly93d3cuc2l0ZXBvaW50LmNvbS9qYXZhc2NyaXB0LWdlbmVyYXRlLWxpZ2h0ZXItZGFya2VyLWNvbG9yL1xuICovXG5leHBvcnQgZnVuY3Rpb24gQ29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuICAgICAgICAvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG4gICAgICAgIGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcbiAgICAgICAgfVxuICAgICAgICBsdW0gPSBsdW0gfHwgMDtcblxuICAgICAgICAvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG4gICAgICAgIHZhciByZ2IgPSBcIiNcIiwgYywgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgYyA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSAqIDIsIDIpLCAxNik7XG4gICAgICAgICAgICBjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgcmdiICs9IChcIjAwXCIgKyBjKS5zdWJzdHIoYy5sZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJnYjtcbn0iLCIndXNlIHN0cmljdCdcbmltcG9ydCB7Q29sb3JMdW1pbmFuY2V9IGZyb20gJy4uL2NvbW1vbi91dGlsLmpzJztcblxuLyoqXG4gKiBDaXJjbGUgTGVnbyBjbGFzc1xuICogVGhlIGNpcmNsZSBpcyBjb21wb3NlZCBvZiAyIGNpcmNsZSAob24gdGhlIHNoYWRvdywgYW5kIHRoZSBvdGhlciBvbmUgZm9yIHRoZSB0b3ApXG4gKiBcbiAqL1xuZXhwb3J0IGNsYXNzIENpcmNsZXtcbiAgICBjb25zdHJ1Y3RvcihjZWxsU2l6ZSwgY29sb3Ipe1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYyA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA1LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiMHB4IDJweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHggPSBuZXcgZmFicmljLkNpcmNsZSh7XG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNCxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRleHQgPSBuZXcgZmFicmljLlRleHQoJ0dERycsIHtcbiAgICAgICAgICAgIGZvbnRTaXplOiBjZWxsU2l6ZSAvIDUsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHN0cm9rZTogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKSxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKFt0aGlzLmNpcmNsZUJhc2ljRXR4LCB0aGlzLmNpcmNsZUJhc2ljLCB0aGlzLnRleHRdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIEZhYnJpY0pTIGVsZW1lbnRcbiAgICAgKi9cbiAgICBnZXQgY2FudmFzRWx0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwOyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBjaXJjbGVcbiAgICAgKi9cbiAgICBjaGFuZ2VDb2xvcihjb2xvcil7XG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMuc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpKTtcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eC5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSk7XG4gICAgICAgIHRoaXMudGV4dC5zZXQoe1xuICAgICAgICAgICAgZmlsbCA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXG4gICAgICAgICAgICBzdHJva2UgOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApXG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCIndXNlIHN0cmljdCdcbmltcG9ydCB7Q2lyY2xlfSBmcm9tICcuL2NpcmNsZS5qcyc7XG5cbi8qKlxuICogUGVnIExlZ28gY2xhc3NcbiAqIFRoZSBwZWcgaXMgY29tcG9zZWQgb2YgbiBjaXJjbGUgZm9yIGEgZGltZW5zaW9uIHRoYXQgZGVwZW5kIG9uIHRoZSBzaXplIHBhcmFtZXRlclxuICovXG5leHBvcnQgY2xhc3MgUGVne1xuICAgIGNvbnN0cnVjdG9yKHtzaXplID0ge2NvbCA6IDEsIHJvdyA6IDF9LCBjZWxsU2l6ZSA9IDAsIGNvbG9yID0gJyNGRkYnLCBsZWZ0ID0gMCwgdG9wID0gMCwgYW5nbGUgPSAwfSl7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuaWQgPSBgUGVnJHtzaXplfS0ke0RhdGUubm93KCl9YDtcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50b1JlbW92ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLmFuZ2xlID0gYW5nbGUgfHwgMDtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheSA9IFtdO1xuXG5cbiAgICAgICAgdGhpcy5yZWN0QmFzaWMgPSBuZXcgZmFicmljLlJlY3Qoe1xuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplICogc2l6ZS5jb2wsXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplICogc2l6ZS5yb3csXG4gICAgICAgICAgICBmaWxsOiBjb2xvcixcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBjZW50ZXJlZFJvdGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxuICAgICAgICAgICAgc2hhZG93IDogXCI1cHggNXB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCIgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBsZXQgYXJyYXlFbHRzID0gW3RoaXMucmVjdEJhc2ljXTtcbiAgICAgICAgbGV0IGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApOyAgICAgICBcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHRoZSBzaXplLCB3ZSBkb24ndCBwbGFjZSB0aGUgY2lyY2xlcyBhdCB0aGUgc2FtZSBwbGFjZVxuICAgICAgICBpZiAoc2l6ZS5jb2wgPT09IDIpe1xuICAgICAgICAgICAgLy8gRm9yIGEgcmVjdGFuZ2xlIG9yIGEgYmlnIFNxdWFyZVxuICAgICAgICAgICAgLy8gV2UgdXBkYXRlIHRoZSByb3cgcG9zaXRpb25zXG4gICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoLWNlbGxTaXplICs1KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcblxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNSxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+YXJyYXlFbHRzLnB1c2goY2lyY2xlLmNhbnZhc0VsdCkpO1xuXG4gICAgICAgIC8vIFRoZSBwZWcgaXMgbG9ja2VkIGluIGFsbCBwb3NpdGlvblxuICAgICAgICB0aGlzLmdyb3VwID0gbmV3IGZhYnJpYy5Hcm91cChhcnJheUVsdHMsIHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubGVmdCxcbiAgICAgICAgICAgIHRvcDogdGhpcy50b3AsXG4gICAgICAgICAgICBhbmdsZTogdGhpcy5hbmdsZSxcbiAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdlIGFkZCB0byBGYWJyaWNFbGVtZW50IGEgcmVmZXJlbmNlIHRvIHRoZSBjdXJlbnQgcGVnXG4gICAgICAgIHRoaXMuZ3JvdXAucGFyZW50UGVnID0gdGhpczsgICAgICAgIFxuICAgIH1cblxuICAgIC8vIFRoZSBGYWJyaWNKUyBlbGVtZW50XG4gICAgZ2V0IGNhbnZhc0VsdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDtcbiAgICB9XG5cbiAgICAvLyBUcnVlIGlmIHRoZSBlbGVtZW50IHdhcyByZXBsYWNlZFxuICAgIGdldCByZXBsYWNlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmlzUmVwbGFjZVxuICAgIH1cblxuICAgIC8vIFNldHRlciBmb3IgaXNSZXBsYWNlIHBhcmFtXG4gICAgc2V0IHJlcGxhY2UocmVwbGFjZSl7XG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gcmVwbGFjZTtcbiAgICB9XG5cbiAgICAvLyBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBwZWdcbiAgICBjaGFuZ2VDb2xvcihjb2xvcil7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5yZWN0QmFzaWMuc2V0KCdmaWxsJywgY29sb3IpO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LmZvckVhY2goKGNpcmNsZSk9PiBjaXJjbGUuY2hhbmdlQ29sb3IoY29sb3IpKTsgICAgICAgIFxuICAgIH1cblxuICAgIC8vIE1vdmUgdGhlIHBlZyB0byBkZXNpcmUgcG9zaXRpb25cbiAgICBtb3ZlKGxlZnQsIHRvcCl7XG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XG4gICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgIGxlZnQgOiBsZWZ0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJvdGF0ZSB0aGUgcGVnIHRvIHRoZSBkZXNpcmUgYW5nbGVcbiAgICByb3RhdGUoYW5nbGUpe1xuICAgICAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcbiAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcbiAgICAgICAgfSk7XG4gICAgfVxuXG59Il19
