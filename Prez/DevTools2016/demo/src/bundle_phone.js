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
                var myInit = { method: 'GET' };
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

},{"./circle.js":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHNjcmlwdHNcXGFwcF9waG9uZS5qcyIsInNyY1xcc2NyaXB0c1xcY2FudmFzXFxsZWdvQ2FudmFzLmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGNvbnN0LmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGxlZ29Db2xvcnMuanMiLCJzcmNcXHNjcmlwdHNcXGNvbW1vblxcdXRpbC5qcyIsInNyY1xcc2NyaXB0c1xcbGVnb19zaGFwZVxcY2lyY2xlLmpzIiwic3JjXFxzY3JpcHRzXFxsZWdvX3NoYXBlXFxwZWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQSxDQUFDLFlBQVk7O0FBRVQsUUFBSSxXQUFXLEtBQWY7QUFBQSxRQUFxQjtBQUNqQixpQkFBYSxJQURqQjtBQUFBLFFBQ3VCO0FBQ25CLFdBQU8sSUFGWDtBQUFBLFFBRWlCO0FBQ2IsaUJBQWEsSUFIakI7QUFBQSxRQUd1QjtBQUNuQixZQUFRLENBSlo7O0FBT0EsYUFBUyxRQUFULEdBQW9COztBQUVoQixxQkFBYSwrQkFBbUIsWUFBbkIsRUFBaUMsSUFBakMsQ0FBYjs7QUFFQSxVQUFFLGdCQUFGLEVBQW9CLFFBQXBCLENBQTZCO0FBQ3pCLDZCQUFpQixJQURRO0FBRXpCLHlCQUFhLElBRlk7QUFHekIseUNBSHlCO0FBSXpCLDRDQUp5QjtBQUt6QixvQkFBUSxnQkFBVSxLQUFWLEVBQWlCO0FBQ3JCLDJCQUFXLFdBQVgsQ0FBdUIsTUFBTSxXQUFOLEVBQXZCO0FBQ0g7QUFQd0IsU0FBN0I7QUFTSDs7QUFFRCxhQUFTLFFBQVQsR0FBb0I7O0FBR2hCOzs7QUFHQSxZQUFNLFdBQVcsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWpCO0FBQ0EsWUFBTSxVQUFVLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQUFoQjs7QUFFQSxZQUFNLGNBQWMsR0FBRyxVQUFI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LElBSnNCO0FBS3JDLDBCQUFlLElBTHNCO0FBTXJDLDBCQUFlLElBTnNCO0FBT3JDLHlCQUFjO0FBUHVCLFNBQTVCLENBQWI7O0FBVUE7QUFDQSxhQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLElBQXZCO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFlQTtvQ0FDWSxLLEVBQU07QUFDZCxpQkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLE1BQW5CLEVBQTJCLEtBQTNCO0FBQ0EsaUJBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixVQUFDLE1BQUQ7QUFBQSx1QkFBVyxPQUFPLFdBQVAsQ0FBbUIsS0FBbkIsQ0FBWDtBQUFBLGFBQXpCO0FBQ0g7O0FBRUQ7Ozs7NkJBQ0ssSSxFQUFNLEcsRUFBSTtBQUNYLGlCQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsaUJBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxpQkFBSyxLQUFMLENBQVcsR0FBWCxDQUFlO0FBQ1gscUJBQUssR0FETTtBQUVYLHNCQUFPO0FBRkksYUFBZjtBQUlIOztBQUVEOzs7OytCQUNPLEssRUFBTTtBQUNULGlCQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZTtBQUNYLHVCQUFRO0FBREcsYUFBZjtBQUdIOzs7NEJBckNjO0FBQ1gsbUJBQU8sS0FBSyxLQUFaO0FBQ0g7O0FBRUQ7Ozs7NEJBQ2E7QUFDVCxtQkFBTyxLQUFLLFNBQVo7QUFDSDs7QUFFRDs7MEJBQ1ksTyxFQUFRO0FBQ2hCLGlCQUFLLFNBQUwsR0FBaUIsT0FBakI7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtMRUdPX0NPTE9SU30gZnJvbSAnLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XHJcbmltcG9ydCB7QkFTRV9MRUdPX0NPTE9SfSBmcm9tICcuL2NvbW1vbi9jb25zdC5qcyc7XHJcbmltcG9ydCB7TGVnb0dyaWRDYW52YXN9IGZyb20gJy4vY2FudmFzL2xlZ29DYW52YXMuanMnO1xyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgbGV0IGdhbWVJbml0ID0gZmFsc2UsLy8gdHJ1ZSBpZiB3ZSBpbml0IHRoZSBsZWdvR3JpZFxyXG4gICAgICAgIGxlZ29DYW52YXMgPSBudWxsLCAvLyBUaGUgbGVnb0dyaWRcclxuICAgICAgICBrZXlzID0gbnVsbCwgLy8gVGhlIGtleXMgb2YgZmlyZW5hc2Ugc3VibWl0IGRyYXcgXHJcbiAgICAgICAgc25hcHNob3RGYiA9IG51bGwsIC8vIFRoZSBzbmFwc2hvdCBvZiBzdWJtaXQgZHJhd1xyXG4gICAgICAgIGluZGV4ID0gMDsgXHJcblxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBpbml0R2FtZSgpIHtcclxuXHJcbiAgICAgICAgbGVnb0NhbnZhcyA9IG5ldyBMZWdvR3JpZENhbnZhcygnY2FudmFzRHJhdycsIHRydWUpO1xyXG5cclxuICAgICAgICAkKFwiI2NvbG9yLXBpY2tlcjJcIikuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZU9ubHk6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb2xvcjogQkFTRV9MRUdPX0NPTE9SLFxyXG4gICAgICAgICAgICBwYWxldHRlOiBMRUdPX0NPTE9SUyxcclxuICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGxlZ29DYW52YXMuY2hhbmdlQ29sb3IoY29sb3IudG9IZXhTdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcclxuXHJcbiAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgQ2luZW1hdGljIEJ1dHRvbnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydEJ0bicpO1xyXG4gICAgICAgIGNvbnN0IGhlbHBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpXHJcblxyXG4gICAgICAgIGNvbnN0IHN0cmVhbVN0YXJ0ID0gUnguT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuZnJvbUV2ZW50KHN0YXJ0QnRuLCAnY2xpY2snKVxyXG4gICAgICAgICAgICAubWFwKCgpID0+ICdzdGFydCcpO1xyXG5cclxuICAgICAgICBjb25zdCBzdHJlYW1IZWxwID0gUnguT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGhlbHBCdG4sICdjbGljaycpXHJcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gJ2hlbHAnKTtcclxuXHJcbiAgICAgICAgc3RyZWFtU3RhcnQubWVyZ2Uoc3RyZWFtSGVscClcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxsby1tc2cnKS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFnYW1lSW5pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbWVvdXQgbmVlZGVkIHRvIHN0YXJ0IHRoZSByZW5kZXJpbmcgb2YgbG9hZGluZyBhbmltYXRpb24gKGVsc2Ugd2lsbCBub3QgYmUgc2hvdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZUluaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRHYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAnaGVscCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3ItcGlja2VyMicpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBzdWJtaXNzaW9uXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5TdWJtaXNzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lIDogJ1VzZXIgTmFtZScsXHJcbiAgICAgICAgICAgICAgICBpZCA6ICd1c2VySWQnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGRyYXdEYXRhcyA9IGxlZ29DYW52YXMuZXhwb3J0KHVzZXIubmFtZSwgdXNlci5pZCk7XHJcbiAgICAgICAgICAgIGRyYXdEYXRhcy5kYXRhVXJsID0gbGVnb0NhbnZhcy5zbmFwc2hvdCgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ3dpbGwgc2VuZCA6ICcsIGRyYXdEYXRhcyk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IFVSTCA9IGBodHRwOi8vbG9jYWxob3N0OjkwMDAvZHJhdy8ke3VzZXIuaWR9YDtcclxuICAgICAgICAgICAgZmV0Y2goVVJMLCB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkcmF3RGF0YXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBtZW51IGl0ZW1zXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGNvbnN0IG1lbnVHYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtZ2FtZScpO1xyXG4gICAgICAgIGNvbnN0IG1lbnVDcmVhdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgY29uc3Qgc3RyZWFtR2FtZSA9IFJ4Lk9ic2VydmFibGVcclxuICAgICAgICAgICAgLmZyb21FdmVudChtZW51R2FtZSwgJ2NsaWNrJylcclxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnZ2FtZScpO1xyXG5cclxuICAgICAgICBjb25zdCBzdHJlYW1DcmVhdGlvbnMgPSBSeC5PYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIC5mcm9tRXZlbnQobWVudUNyZWF0aW9ucywgJ2NsaWNrJylcclxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnY3JlYXRpb25zJyk7XHJcblxyXG4gICAgICAgIHN0cmVhbUdhbWUubWVyZ2Uoc3RyZWFtQ3JlYXRpb25zKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnZ2FtZScpe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNvbnRlbnQnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXR0ZWQnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtY3JlYXRpb25zJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fZHJhd2VyJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19vYmZ1c2NhdG9yJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChzdGF0ZSA9PT0gJ2NyZWF0aW9ucycpe1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNvbnRlbnQnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0dGVkJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fZHJhd2VyJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19vYmZ1c2NhdG9yJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lIDogJ1VzZXIgTmFtZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkIDogJ3VzZXJJZCdcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJ307XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgVVJMID0gYGh0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9kcmF3LyR7dXNlci5pZH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoKFVSTCwgbXlJbml0KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHNuYXBzaG90KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdC5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzbmFwc2hvdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbmFwc2hvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc25hcHNob3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc25hcHNob3RGYiA9IHNuYXBzaG90O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJhdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGRyYXcgIScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIEJ1dHRvbnMgZm9yIGNoYW5naW5nIG9mIGRyYXdcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgYnRuTGVmdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5MZWZ0Jyk7XHJcbiAgICAgICAgY29uc3QgYnRuUmlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuUmlnaHQnKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RyZWFtQnRuTGVmdCA9IFJ4Lk9ic2VydmFibGVcclxuICAgICAgICAgICAgLmZyb21FdmVudChidG5MZWZ0LCdjbGljaycsKCk9PmluZGV4ID0gTWF0aC5tYXgoaW5kZXggLSAxLCAwKSk7XHJcbiAgICAgICAgY29uc3Qgc3RyZWFtQnRuUmlnaHQgPSAgUnguT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGJ0blJpZ2h0LCAnY2xpY2snLCgpPT5pbmRleCA9IE1hdGgubWluKGluZGV4ICsgMSwga2V5cy5sZW5ndGggLSAxKSk7XHJcblxyXG4gICAgICAgc3RyZWFtQnRuTGVmdC5tZXJnZShzdHJlYW1CdG5SaWdodCkuc3Vic2NyaWJlKGRyYXcpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93IGEgZHJhdyBhbmQgc2hvdyBpdCdzIHN0YXRlIDogUmVqZWN0ZWQgb3IgQWNjZXB0ZWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZHJhdygpIHtcclxuICAgICAgICBsZXQgZHJhdyA9IHNuYXBzaG90RmJba2V5c1tpbmRleF1dO1xyXG4gICAgICAgIGxldCBpbWdTdWJtaXNzaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ1N1Ym1pc3Npb24nKTtcclxuICAgICAgICBpbWdTdWJtaXNzaW9uLnNyYyA9IGRyYXcuZGF0YVVybDtcclxuICAgICAgICBpZiAoZHJhdy5hY2NlcHRlZCAmJiAhaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY2VwdGVkJykpIHtcclxuICAgICAgICAgICAgaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QuYWRkKCdhY2NlcHRlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGltZ1N1Ym1pc3Npb24uY2xhc3NMaXN0LnJlbW92ZSgnYWNjZXB0ZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcclxuXHJcbiAgICAvKiBTRVJWSUNFX1dPUktFUl9SRVBMQUNFICovXHJcbiAgICBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgeyAgICAgICAgXHJcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy4vc2VydmljZS13b3JrZXItcGhvbmUuanMnLCB7c2NvcGUgOiBsb2NhdGlvbi5wYXRobmFtZX0pLnRoZW4oZnVuY3Rpb24ocmVnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlIFdvcmtlciBSZWdpc3RlciBmb3Igc2NvcGUgOiAlcycscmVnLnNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qIFNFUlZJQ0VfV09SS0VSX1JFUExBQ0UgKi9cclxuXHJcbn0pKCk7XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge1BlZ30gZnJvbSAnLi4vbGVnb19zaGFwZS9wZWcuanMnO1xyXG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi4vbGVnb19zaGFwZS9jaXJjbGUuanMnO1xyXG5pbXBvcnQge05CX0NFTExTLCBIRUFERVJfSEVJR0hULCBCQVNFX0xFR09fQ09MT1IsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUn0gZnJvbSAnLi4vY29tbW9uL2NvbnN0LmpzJztcclxuaW1wb3J0IHtsZWdvQmFzZUNvbG9yfSBmcm9tICcuLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XHJcblxyXG4vKipcclxuICogXHJcbiAqIENsYXNzIGZvciBDYW52YXMgR3JpZFxyXG4gKiBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBMZWdvR3JpZENhbnZhcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgc2hvd1Jvdykge1xyXG4gICAgICAgIC8vIEJhc2ljIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2FudmFzRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIC8vIFNpemUgb2YgY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXNSZWN0ID0gdGhpcy5jYW52YXNFbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgLy8gSW5kaWNhdG9yIGZvciBzaG93aW5nIHRoZSBmaXJzdCByb3cgd2l0aCBwZWdzXHJcbiAgICAgICAgdGhpcy5zaG93Um93ID0gc2hvd1JvdztcclxuICAgICAgICB0aGlzLmNhbnZhc0VsdC53aWR0aCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aDtcclxuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gc2hvd1Jvdywgd2Ugd2lsbCBzaG93IG1vZGlmeSB0aGUgaGVhZGVyIEhlaWdodFxyXG4gICAgICAgIHRoaXMuaGVhZGVySGVpZ2h0ID0gdGhpcy5zaG93Um93ID8gSEVBREVSX0hFSUdIVCA6IDA7XHJcbiAgICAgICAgdGhpcy5jYW52YXNFbHQuaGVpZ2h0ID0gdGhpcy5jYW52YXNSZWN0LndpZHRoICsgdGhpcy5oZWFkZXJIZWlnaHQ7XHJcbiAgICAgICAgLy8gV2UgY2FsY3VsYXRlIHRoZSBjZWxsc2l6ZSBhY2NvcmRpbmcgdG8gdGhlIHNwYWNlIHRha2VuIGJ5IHRoZSBjYW52YXNcclxuICAgICAgICB0aGlzLmNlbGxTaXplID0gTWF0aC5yb3VuZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyBOQl9DRUxMUyk7XHJcblxyXG4gICAgICAgIC8vIFdlIGluaXRpYWxpemUgdGhlIEZhYnJpYyBKUyBsaWJyYXJ5IHdpdGggb3VyIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoaWQsIHsgc2VsZWN0aW9uOiBmYWxzZSB9KTtcclxuICAgICAgICAvLyBPYmplY3QgdGhhdCByZXByZXNlbnQgdGhlIHBlZ3Mgb24gdGhlIGZpcnN0IHJvd1xyXG4gICAgICAgIHRoaXMucm93U2VsZWN0ID0ge307XHJcbiAgICAgICAgLy8gVGhlIGN1cnJlbnQgZHJhdyBtb2RlbCAoaW5zdHJ1Y3Rpb25zLCAuLi4pXHJcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge30sXHJcbiAgICAgICAgLy8gRmxhZyB0byBkZXRlcm1pbmUgaWYgd2UgaGF2ZSB0byBjcmVhdGUgYSBuZXcgYnJpY2tcclxuICAgICAgICB0aGlzLmNyZWF0ZU5ld0JyaWNrID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gQkFTRV9MRUdPX0NPTE9SO1xyXG5cclxuICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcclxuXHJcbiAgICAgICAgLy8gSWYgd2Ugc2hvdyB0aGUgcm93LCB3ZSBoYXZlIHRvIHBsdWcgdGhlIG1vdmUgbWFuYWdlbWVudFxyXG4gICAgICAgIGlmIChzaG93Um93KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0OnNlbGVjdGVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnID8gb3B0aW9ucy50YXJnZXQgOiBudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ3NlbGVjdGlvbjpjbGVhcmVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gbnVsbCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0Om1vdmluZycsIChvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGVnID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3TGVmdCA9IE1hdGgucm91bmQob3B0aW9ucy50YXJnZXQubGVmdCAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZTtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdUb3AgPSBNYXRoLnJvdW5kKChvcHRpb25zLnRhcmdldC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCkgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUgKyB0aGlzLmhlYWRlckhlaWdodDsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gY2FsY3VsYXRlIHRoZSB0b3BcclxuICAgICAgICAgICAgICAgIGxldCB0b3BDb21wdXRlID0gbmV3VG9wICsgKHBlZy5zaXplLnJvdyA9PT0gMiB8fCBwZWcuYW5nbGUgPiAwID8gdGhpcy5jZWxsU2l6ZSAqIDIgOiB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICAgICAgICAgIGxldCBsZWZ0Q29tcHV0ZSA9IG5ld0xlZnQgKyAocGVnLnNpemUuY29sID09PSAyID8gdGhpcy5jZWxsU2l6ZSAqIDIgOiB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICAgICAgICAgIHBlZy5tb3ZlKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0xlZnQsIC8vbGVmdFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1RvcCAvLyB0b3BcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gV2Ugc3BlY2lmeSB0aGF0IHdlIGNvdWxkIHJlbW92ZSBhIHBlZyBpZiBvbmUgb2YgaXQncyBlZGdlIHRvdWNoIHRoZSBvdXRzaWRlIG9mIHRoZSBjYW52YXNcclxuICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPCBIRUFERVJfSEVJR0hUXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgbmV3TGVmdCA8IDBcclxuICAgICAgICAgICAgICAgICAgICB8fCB0b3BDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LmhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IGxlZnRDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSB3ZSBjaGVjayB3ZSBjcmVhdGUgYSBuZXcgcGVnICh3aGVuIGEgcGVnIGVudGVyIGluIHRoZSBkcmF3IGFyZWEpXHJcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZWcucmVwbGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUuY29sID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUucm93ID09PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAocGVnLmFuZ2xlID09PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxKS5jYW52YXNFbHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSw5MCkuY2FudmFzRWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZWcucmVwbGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignbW91c2U6dXAnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QnJpY2tcclxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcudG9SZW1vdmVcclxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcucmVwbGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmJyaWNrTW9kZWxbdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLmlkXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmUodGhpcy5jdXJyZW50QnJpY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJyaWNrID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1ldGhvZCBmb3IgY2hhbmdpbmcgdGhlIGNvbG9yIG9mIHRoZSBmaXJzdCByb3cgXHJcbiAgICAgKi9cclxuICAgIGNoYW5nZUNvbG9yKGNvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBjb2xvcjsgICAgICAgXHJcbiAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcclxuICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xyXG4gICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xyXG4gICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlcmlhbGl6ZSB0aGUgY2FudmFzIHRvIGEgbWluaW1hbCBvYmplY3QgdGhhdCBjb3VsZCBiZSB0cmVhdCBhZnRlclxyXG4gICAgICovXHJcbiAgICBleHBvcnQodXNlck5hbWUsIHVzZXJJZCkge1xyXG4gICAgICAgIGxldCByZXN1bHRBcnJheSA9IFtdO1xyXG4gICAgICAgIC8vIFdlIGZpbHRlciB0aGUgcm93IHBlZ3NcclxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuYnJpY2tNb2RlbClcclxuICAgICAgICAgICAgLmZpbHRlcigoa2V5KT0+a2V5ICE9IHRoaXMucm93U2VsZWN0LnNxdWFyZS5pZFxyXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5pZFxyXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnJlY3QuaWRcclxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdC5pZCk7XHJcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBlZ1RtcCA9IHRoaXMuYnJpY2tNb2RlbFtrZXldO1xyXG4gICAgICAgICAgICByZXN1bHRBcnJheS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHNpemU6IHBlZ1RtcC5zaXplLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHBlZ1RtcC5jb2xvcixcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBwZWdUbXAuYW5nbGUsXHJcbiAgICAgICAgICAgICAgICB0b3A6IHBlZ1RtcC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHBlZ1RtcC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgY2VsbFNpemUgOiB0aGlzLmNlbGxTaXplXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHVzZXI6IHVzZXJOYW1lLFxyXG4gICAgICAgICAgICB1c2VySWQgOiB1c2VySWQsXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9uczogcmVzdWx0QXJyYXlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRHJhdyBmcm9tIGludHJ1Y3Rpb25zIGEgZHJhd1xyXG4gICAgICovXHJcbiAgICBkcmF3SW5zdHJ1Y3Rpb25zKGluc3RydWN0aW9uT2JqZWN0KXtcclxuICAgICAgICB0aGlzLnJlc2V0Qm9hcmQoKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIGluc3RydWN0aW9uT2JqZWN0Lmluc3RydWN0aW9ucy5mb3JFYWNoKChpbnN0cnVjdGlvbik9PntcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlQnJpY2soeyBzaXplIDogaW5zdHJ1Y3Rpb24uc2l6ZSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA6IChpbnN0cnVjdGlvbi5sZWZ0IC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoaW5zdHJ1Y3Rpb24udG9wIC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZSA6IGluc3RydWN0aW9uLmFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yIDogaW5zdHJ1Y3Rpb24uY29sb3JcclxuICAgICAgICAgICAgICAgIH0pLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICAgICAgKTsgICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYW4gdGhlIGJvYXJkIGFuZCB0aGUgc3RhdGUgb2YgdGhlIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICByZXNldEJvYXJkKCl7XHJcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge307XHJcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogR2VuZXJhdGUgYSBCYXNlNjQgaW1hZ2UgZnJvbSB0aGUgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHNuYXBzaG90KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBQcml2YXRlcyBNZXRob2RzXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIERyYXcgdGhlIGJhc2ljIGdyaWQgXHJcbiAgICAqL1xyXG4gICAgX2RyYXdHcmlkKHNpemUpIHsgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd1Jvdyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHRcclxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEsOTApLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERyYXcgYWxsIHRoZSB3aGl0ZSBwZWcgb2YgdGhlIGdyaWRcclxuICAgICAqL1xyXG4gICAgX2RyYXdXaGl0ZVBlZyhzaXplKXtcclxuICAgICAgICAvLyBXZSBzdG9wIHJlbmRlcmluZyBvbiBlYWNoIGFkZCwgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXNcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBtYXggPSBNYXRoLnJvdW5kKHNpemUgLyB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICBsZXQgbWF4U2l6ZSA9IG1heCAqIHRoaXMuY2VsbFNpemU7XHJcbiAgICAgICAgZm9yICh2YXIgcm93ID0wOyByb3cgPCBtYXg7IHJvdysrKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbWF4OyBjb2wrKyApe1xyXG4gICAgICAgICAgICAgICAgIGxldCBzcXVhcmVUbXAgPSBuZXcgZmFicmljLlJlY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBCQUNLR1JPVU5EX0xFR09fQ09MT1IsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNpcmNsZSA9IG5ldyBDaXJjbGUodGhpcy5jZWxsU2l6ZSwgQkFDS0dST1VORF9MRUdPX0NPTE9SKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZS5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBUbXAgPSBuZXcgZmFicmljLkdyb3VwKFtzcXVhcmVUbXAsIGNpcmNsZS5jYW52YXNFbHRdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5jZWxsU2l6ZSAqIGNvbCxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuY2VsbFNpemUgKiByb3cgKyB0aGlzLmhlYWRlckhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogMCxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoZ3JvdXBUbXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gdHJ1ZTtcclxuICAgICAgICAvLyBXZSB0cmFuc2Zvcm0gdGhlIGNhbnZhcyB0byBhIGJhc2U2NCBpbWFnZSBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlcy5cclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTsgICAgIFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEJhY2tncm91bmRJbWFnZSh1cmwsdGhpcy5jYW52YXMucmVuZGVyQWxsLmJpbmQodGhpcy5jYW52YXMpLCB7XHJcbiAgICAgICAgICAgIG9yaWdpblg6ICdsZWZ0JyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogdGhpcy5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgIH0pOyAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCByZWN0YW5nbGVcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZVJlY3Qoc2l6ZVJlY3QsIGFuZ2xlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcclxuICAgICAgICAgICAgICAgIHNpemUgOiB7Y29sIDogMiAqIHNpemVSZWN0LCByb3cgOjEgKiBzaXplUmVjdH0sIFxyXG4gICAgICAgICAgICAgICAgbGVmdCA6IGFuZ2xlID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyA0KSAtIHRoaXMuY2VsbFNpemUpIDogKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggKiAzIC8gNCkgLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxyXG4gICAgICAgICAgICAgICAgdG9wIDogYW5nbGUgPyAxIDogMCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBzcXVhcmUgKDF4MSkgb3IgKDJ4MilcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZVNxdWFyZShzaXplU3F1YXJlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcclxuICAgICAgICAgICAgICAgIHNpemUgOiB7Y29sIDogMSAqIHNpemVTcXVhcmUsIHJvdyA6MSAqIHNpemVTcXVhcmV9LCBcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHNpemVTcXVhcmUgPT09IDIgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDIpIC0gKDIgKiB0aGlzLmNlbGxTaXplKSkgOiAodGhpcy5jYW52YXNSZWN0LndpZHRoIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcclxuICAgICAgICAgICAgICAgIHRvcCA6IHNpemVTcXVhcmUgPT09IDIgPyAxIDogMCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmljIG1ldGhvZCB0aGF0IGNyZWF0ZSBhIHBlZ1xyXG4gICAgICovXHJcbiAgICBfY3JlYXRlQnJpY2sob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMuY2VsbFNpemUgPSB0aGlzLmNlbGxTaXplO1xyXG4gICAgICAgIG9wdGlvbnMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8IHRoaXMubGFzdENvbG9yO1xyXG4gICAgICAgIGxldCBwZWcgPSBuZXcgUGVnKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbFtwZWcuaWRdID0gcGVnO1xyXG4gICAgICAgIC8vIFdlIGhhdmUgdG8gdXBkYXRlIHRoZSByb3dTZWxlY3QgT2JqZWN0IHRvIGJlIGFsc3dheSB1cGRhdGVcclxuICAgICAgICBpZiAob3B0aW9ucy5zaXplLnJvdyA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUgPSBwZWc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFuZ2xlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0ID0gcGVnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zaXplLmNvbCA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0ID0gcGVnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZSA9IHBlZztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBlZztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0IHRoZSBjYW52YXNcclxuICAgICAqL1xyXG4gICAgX2RyYXdDYW52YXMoKSB7XHJcbiAgICAgICAgdGhpcy5fZHJhd1doaXRlUGVnKHRoaXMuY2FudmFzUmVjdC53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5fZHJhd0dyaWQodGhpcy5jYW52YXNSZWN0LndpZHRoLCBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKSk7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbi8vIE51bWJlciBvZiBjZWxsIG9uIHRoZSBncmlkXHJcbmV4cG9ydCBjb25zdCBOQl9DRUxMUyA9IDE1O1xyXG5cclxuLy8gSGVpZ2h0IG9mIHRoZSBoZWFkZXJcclxuZXhwb3J0IGNvbnN0IEhFQURFUl9IRUlHSFQgPSB3aW5kb3cuc2NyZWVuLndpZHRoIDw9IDc2OCAgPyA2MCA6IDEwMDtcclxuXHJcbi8vIEZpcnN0IGNvbG9yIHRvIHVzZVxyXG5leHBvcnQgY29uc3QgQkFTRV9MRUdPX0NPTE9SID0gXCIjMGQ2OWYyXCI7XHJcblxyXG4vLyBNZWRpdW0gU3RvbmUgR3JleSBcclxuY29uc3QgQ09MT1JfMTk0ID0gXCIjYTNhMmE0XCI7XHJcblxyXG4vLyBMaWdodCBTdG9uZSBHcmV5XHJcbmNvbnN0IENPTE9SXzIwOCA9IFwiI2U1ZTRkZVwiOyBcclxuXHJcbi8vIEJhY2tncm91bmQgY29sb3IgdXNlZFxyXG5leHBvcnQgY29uc3QgQkFDS0dST1VORF9MRUdPX0NPTE9SID0gQ09MT1JfMjA4OyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuLypcclxuKiBDb2xvcnMgZnJvbSBcclxuKiBodHRwOi8vbGVnby53aWtpYS5jb20vd2lraS9Db2xvdXJfUGFsZXR0ZSBcclxuKiBBbmQgaHR0cDovL3d3dy5wZWVyb24uY29tL2NnaS1iaW4vaW52Y2dpcy9jb2xvcmd1aWRlLmNnaVxyXG4qIE9ubHkgU2hvdyB0aGUgY29sb3IgdXNlIHNpbmNlIDIwMTBcclxuKiovIFxyXG5leHBvcnQgY29uc3QgTEVHT19DT0xPUlMgPSBbXHJcbiAgICAncmdiKDI0NSwgMjA1LCA0NyknLCAvLzI0LCBCcmlnaHQgWWVsbG93ICpcclxuICAgICdyZ2IoMjUzLCAyMzQsIDE0MCknLCAvLzIyNiwgQ29vbCBZZWxsb3cgKlxyXG4gICAgJ3JnYigyMTgsIDEzMywgNjQpJywgLy8xMDYsIEJyaWdodCBPcmFuZ2UgKlxyXG4gICAgJ3JnYigyMzIsIDE3MSwgNDUpJywgLy8xOTEsIEZsYW1lIFllbGxvd2lzaCBPcmFuZ2UgKlxyXG4gICAgJ3JnYigxOTYsIDQwLCAyNyknLCAvLzIxLCBCcmlnaHQgUmVkICpcclxuICAgICdyZ2IoMTIzLCA0NiwgNDcpJywgLy8xNTQsIERhcmsgUmVkICpcclxuICAgICdyZ2IoMjA1LCA5OCwgMTUyKScsIC8vMjIxLCBCcmlnaHQgUHVycGxlICpcclxuICAgICdyZ2IoMjI4LCAxNzMsIDIwMCknLCAvLzIyMiwgTGlnaHQgUHVycGxlICpcclxuICAgICdyZ2IoMTQ2LCA1NywgMTIwKScsIC8vMTI0LCBCcmlnaHQgUmVkZGlzaCBWaW9sZXQgKlxyXG4gICAgJ3JnYig1MiwgNDMsIDExNyknLCAvLzI2OCwgTWVkaXVtIExpbGFjICpcclxuICAgICdyZ2IoMTMsIDEwNSwgMjQyKScsIC8vMjMsIEJyaWdodCBCbHVlICpcclxuICAgICdyZ2IoMTU5LCAxOTUsIDIzMyknLCAvLzIxMiwgTGlnaHQgUm95YWwgQmx1ZSAqXHJcbiAgICAncmdiKDExMCwgMTUzLCAyMDEpJywgLy8xMDIsIE1lZGl1bSBCbHVlICpcclxuICAgICdyZ2IoMzIsIDU4LCA4NiknLCAvLzE0MCwgRWFydGggQmx1ZSAqXHJcbiAgICAncmdiKDExNiwgMTM0LCAxNTYpJywgLy8xMzUsIFNhbmQgQmx1ZSAqXHJcbiAgICAncmdiKDQwLCAxMjcsIDcwKScsIC8vMjgsIERhcmsgR3JlZW4gKlxyXG4gICAgJ3JnYig3NSwgMTUxLCA3NCknLCAvLzM3LCBCaXJnaHQgR3JlZW4gKlxyXG4gICAgJ3JnYigxMjAsIDE0NCwgMTI5KScsIC8vMTUxLCBTYW5kIEdyZWVuICpcclxuICAgICdyZ2IoMzksIDcwLCA0NCknLCAvLzE0MSwgRWFydGggR3JlZW4gKlxyXG4gICAgJ3JnYigxNjQsIDE4OSwgNzApJywgLy8xMTksIEJyaWdodCBZZWxsb3dpc2gtR3JlZW4gKiBcclxuICAgICdyZ2IoMTA1LCA2NCwgMzkpJywgLy8xOTIsIFJlZGRpc2ggQnJvd24gKlxyXG4gICAgJ3JnYigyMTUsIDE5NywgMTUzKScsIC8vNSwgQnJpY2sgWWVsbG93ICogXHJcbiAgICAncmdiKDE0OSwgMTM4LCAxMTUpJywgLy8xMzgsIFNhbmQgWWVsbG93ICpcclxuICAgICdyZ2IoMTcwLCAxMjUsIDg1KScsIC8vMzEyLCBNZWRpdW0gTm91Z2F0ICogICAgXHJcbiAgICAncmdiKDQ4LCAxNSwgNiknLCAvLzMwOCwgRGFyayBCcm93biAqXHJcbiAgICAncmdiKDIwNCwgMTQyLCAxMDQpJywgLy8xOCwgTm91Z2F0ICpcclxuICAgICdyZ2IoMjQ1LCAxOTMsIDEzNyknLCAvLzI4MywgTGlnaHQgTm91Z2F0ICpcclxuICAgICdyZ2IoMTYwLCA5NSwgNTIpJywgLy8zOCwgRGFyayBPcmFuZ2UgKlxyXG4gICAgJ3JnYigyNDIsIDI0MywgMjQyKScsIC8vMSwgV2hpdGUgKlxyXG4gICAgJ3JnYigyMjksIDIyOCwgMjIyKScsIC8vMjA4LCBMaWdodCBTdG9uZSBHcmV5ICpcclxuICAgICdyZ2IoMTYzLCAxNjIsIDE2NCknLCAvLzE5NCwgTWVkaXVtIFN0b25lIEdyZXkgKlxyXG4gICAgJ3JnYig5OSwgOTUsIDk3KScsIC8vMTk5LCBEYXJrIFN0b25lIEdyZXkgKlxyXG4gICAgJ3JnYigyNywgNDIsIDUyKScsIC8vMjYsIEJsYWNrICogICAgICAgIFxyXG5dOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuLyoqXHJcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgYSB2YXJpYXRpb24gb2YgY29sb3JcclxuICogXHJcbiAqIEZyb20gOiBodHRwczovL3d3dy5zaXRlcG9pbnQuY29tL2phdmFzY3JpcHQtZ2VuZXJhdGUtbGlnaHRlci1kYXJrZXItY29sb3IvXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gQ29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcclxuXHJcbiAgICAgICAgLy8gdmFsaWRhdGUgaGV4IHN0cmluZ1xyXG4gICAgICAgIGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xyXG4gICAgICAgIGlmIChoZXgubGVuZ3RoIDwgNikge1xyXG4gICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGx1bSA9IGx1bSB8fCAwO1xyXG5cclxuICAgICAgICAvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XHJcbiAgICAgICAgdmFyIHJnYiA9IFwiI1wiLCBjLCBpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgYyA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSAqIDIsIDIpLCAxNik7XHJcbiAgICAgICAgICAgIGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIHJnYiArPSAoXCIwMFwiICsgYykuc3Vic3RyKGMubGVuZ3RoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZ2I7XHJcbn0iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtDb2xvckx1bWluYW5jZX0gZnJvbSAnLi4vY29tbW9uL3V0aWwuanMnO1xyXG5cclxuLyoqXHJcbiAqIENpcmNsZSBMZWdvIGNsYXNzXHJcbiAqIFRoZSBjaXJjbGUgaXMgY29tcG9zZWQgb2YgMiBjaXJjbGUgKG9uIHRoZSBzaGFkb3csIGFuZCB0aGUgb3RoZXIgb25lIGZvciB0aGUgdG9wKVxyXG4gKiBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDaXJjbGV7XHJcbiAgICBjb25zdHJ1Y3RvcihjZWxsU2l6ZSwgY29sb3Ipe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMgPSBuZXcgZmFicmljLkNpcmNsZSh7XHJcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA1LFxyXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSksXHJcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgc2hhZG93IDogXCIwcHggMnB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eCA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcclxuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDQsXHJcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpLFxyXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IGZhYnJpYy5UZXh0KCdHREcnLCB7XHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBjZWxsU2l6ZSAvIDUsXHJcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXHJcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgc3Ryb2tlOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApLFxyXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdyb3VwID0gbmV3IGZhYnJpYy5Hcm91cChbdGhpcy5jaXJjbGVCYXNpY0V0eCwgdGhpcy5jaXJjbGVCYXNpYywgdGhpcy50ZXh0XSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIEZhYnJpY0pTIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgZ2V0IGNhbnZhc0VsdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwOyBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIGNpcmNsZVxyXG4gICAgICovXHJcbiAgICBjaGFuZ2VDb2xvcihjb2xvcil7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYy5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSkpO1xyXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHguc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSkpO1xyXG4gICAgICAgIHRoaXMudGV4dC5zZXQoe1xyXG4gICAgICAgICAgICBmaWxsIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcclxuICAgICAgICAgICAgc3Ryb2tlIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7Q2lyY2xlfSBmcm9tICcuL2NpcmNsZS5qcyc7XHJcblxyXG4vKipcclxuICogUGVnIExlZ28gY2xhc3NcclxuICogVGhlIHBlZyBpcyBjb21wb3NlZCBvZiBuIGNpcmNsZSBmb3IgYSBkaW1lbnNpb24gdGhhdCBkZXBlbmQgb24gdGhlIHNpemUgcGFyYW1ldGVyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGVne1xyXG4gICAgY29uc3RydWN0b3Ioe3NpemUgPSB7Y29sIDogMSwgcm93IDogMX0sIGNlbGxTaXplID0gMCwgY29sb3IgPSAnI0ZGRicsIGxlZnQgPSAwLCB0b3AgPSAwLCBhbmdsZSA9IDB9KXtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuaWQgPSBgUGVnJHtzaXplfS0ke0RhdGUubm93KCl9YDtcclxuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9SZW1vdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcclxuICAgICAgICB0aGlzLmFuZ2xlID0gYW5nbGUgfHwgMDtcclxuICAgICAgICB0aGlzLmNpcmNsZUFycmF5ID0gW107XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJlY3RCYXNpYyA9IG5ldyBmYWJyaWMuUmVjdCh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBjZWxsU2l6ZSAqIHNpemUuY29sLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplICogc2l6ZS5yb3csXHJcbiAgICAgICAgICAgIGZpbGw6IGNvbG9yLFxyXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hhZG93IDogXCI1cHggNXB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCIgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGxldCBhcnJheUVsdHMgPSBbdGhpcy5yZWN0QmFzaWNdO1xyXG4gICAgICAgIGxldCBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApOyAgICAgICBcclxuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gdGhlIHNpemUsIHdlIGRvbid0IHBsYWNlIHRoZSBjaXJjbGVzIGF0IHRoZSBzYW1lIHBsYWNlXHJcbiAgICAgICAgaWYgKHNpemUuY29sID09PSAyKXtcclxuICAgICAgICAgICAgLy8gRm9yIGEgcmVjdGFuZ2xlIG9yIGEgYmlnIFNxdWFyZVxyXG4gICAgICAgICAgICAvLyBXZSB1cGRhdGUgdGhlIHJvdyBwb3NpdGlvbnNcclxuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xyXG4gICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IDBcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXHJcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoLWNlbGxTaXplICs1KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcclxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNSxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcclxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LmZvckVhY2goKGNpcmNsZSk9PmFycmF5RWx0cy5wdXNoKGNpcmNsZS5jYW52YXNFbHQpKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIHBlZyBpcyBsb2NrZWQgaW4gYWxsIHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoYXJyYXlFbHRzLCB7XHJcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubGVmdCxcclxuICAgICAgICAgICAgdG9wOiB0aGlzLnRvcCxcclxuICAgICAgICAgICAgYW5nbGU6IHRoaXMuYW5nbGUsXHJcbiAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXHJcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXHJcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXHJcbiAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFdlIGFkZCB0byBGYWJyaWNFbGVtZW50IGEgcmVmZXJlbmNlIHRvIHRoZSBjdXJlbnQgcGVnXHJcbiAgICAgICAgdGhpcy5ncm91cC5wYXJlbnRQZWcgPSB0aGlzOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhlIEZhYnJpY0pTIGVsZW1lbnRcclxuICAgIGdldCBjYW52YXNFbHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcnVlIGlmIHRoZSBlbGVtZW50IHdhcyByZXBsYWNlZFxyXG4gICAgZ2V0IHJlcGxhY2UoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc1JlcGxhY2VcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXR0ZXIgZm9yIGlzUmVwbGFjZSBwYXJhbVxyXG4gICAgc2V0IHJlcGxhY2UocmVwbGFjZSl7XHJcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSByZXBsYWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHBlZ1xyXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnJlY3RCYXNpYy5zZXQoJ2ZpbGwnLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT4gY2lyY2xlLmNoYW5nZUNvbG9yKGNvbG9yKSk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyBNb3ZlIHRoZSBwZWcgdG8gZGVzaXJlIHBvc2l0aW9uXHJcbiAgICBtb3ZlKGxlZnQsIHRvcCl7XHJcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XHJcbiAgICAgICAgICAgIHRvcDogdG9wLFxyXG4gICAgICAgICAgICBsZWZ0IDogbGVmdFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJvdGF0ZSB0aGUgcGVnIHRvIHRoZSBkZXNpcmUgYW5nbGVcclxuICAgIHJvdGF0ZShhbmdsZSl7XHJcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcclxuICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSJdfQ==
