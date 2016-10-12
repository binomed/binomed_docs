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
    /*SERVICE_WORKER_REPLACE */
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfcGhvbmUuanMiLCJzcmMvc2NyaXB0cy9jYW52YXMvbGVnb0NhbnZhcy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9jb25zdC5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9sZWdvQ29sb3JzLmpzIiwic3JjL3NjcmlwdHMvY29tbW9uL3V0aWwuanMiLCJzcmMvc2NyaXB0cy9sZWdvX3NoYXBlL2NpcmNsZS5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvcGVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0EsQ0FBQyxZQUFZOztBQUVULFFBQUksV0FBVyxLQUFmO0FBQUEsUUFBcUI7QUFDakIsaUJBQWEsSUFEakI7QUFBQSxRQUN1QjtBQUNuQixXQUFPLElBRlg7QUFBQSxRQUVpQjtBQUNiLGlCQUFhLElBSGpCO0FBQUEsUUFHdUI7QUFDbkIsWUFBUSxDQUpaOztBQU9BLGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIscUJBQWEsK0JBQW1CLFlBQW5CLEVBQWlDLElBQWpDLENBQWI7O0FBRUEsVUFBRSxnQkFBRixFQUFvQixRQUFwQixDQUE2QjtBQUN6Qiw2QkFBaUIsSUFEUTtBQUV6Qix5QkFBYSxJQUZZO0FBR3pCLHlDQUh5QjtBQUl6Qiw0Q0FKeUI7QUFLekIsb0JBQVEsZ0JBQVUsS0FBVixFQUFpQjtBQUNyQiwyQkFBVyxXQUFYLENBQXVCLE1BQU0sV0FBTixFQUF2QjtBQUNIO0FBUHdCLFNBQTdCO0FBU0g7O0FBRUQsYUFBUyxRQUFULEdBQW9COztBQUdoQjs7O0FBR0EsWUFBTSxXQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUFqQjtBQUNBLFlBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBaEI7O0FBRUEsWUFBTSxjQUFjLEdBQUcsVUFBSCxDQUNmLFNBRGUsQ0FDTCxRQURL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LEdBQVksSUFBWjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWU7QUFDWCxxQkFBSyxHQURNO0FBRVgsc0JBQU87QUFGSSxhQUFmO0FBSUg7O0FBRUQ7Ozs7K0JBQ08sSyxFQUFNO0FBQ1QsaUJBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxpQkFBSyxLQUFMLENBQVcsR0FBWCxDQUFlO0FBQ1gsdUJBQVE7QUFERyxhQUFmO0FBR0g7Ozs0QkFyQ2M7QUFDWCxtQkFBTyxLQUFLLEtBQVo7QUFDSDs7QUFFRDs7Ozs0QkFDYTtBQUNULG1CQUFPLEtBQUssU0FBWjtBQUNIOztBQUVEOzswQkFDWSxPLEVBQVE7QUFDaEIsaUJBQUssU0FBTCxHQUFpQixPQUFqQjtBQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtMRUdPX0NPTE9SU30gZnJvbSAnLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XG5pbXBvcnQge0JBU0VfTEVHT19DT0xPUn0gZnJvbSAnLi9jb21tb24vY29uc3QuanMnO1xuaW1wb3J0IHtMZWdvR3JpZENhbnZhc30gZnJvbSAnLi9jYW52YXMvbGVnb0NhbnZhcy5qcyc7XG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGxldCBnYW1lSW5pdCA9IGZhbHNlLC8vIHRydWUgaWYgd2UgaW5pdCB0aGUgbGVnb0dyaWRcbiAgICAgICAgbGVnb0NhbnZhcyA9IG51bGwsIC8vIFRoZSBsZWdvR3JpZFxuICAgICAgICBrZXlzID0gbnVsbCwgLy8gVGhlIGtleXMgb2YgZmlyZW5hc2Ugc3VibWl0IGRyYXcgXG4gICAgICAgIHNuYXBzaG90RmIgPSBudWxsLCAvLyBUaGUgc25hcHNob3Qgb2Ygc3VibWl0IGRyYXdcbiAgICAgICAgaW5kZXggPSAwOyBcblxuICAgIFxuICAgIGZ1bmN0aW9uIGluaXRHYW1lKCkge1xuXG4gICAgICAgIGxlZ29DYW52YXMgPSBuZXcgTGVnb0dyaWRDYW52YXMoJ2NhbnZhc0RyYXcnLCB0cnVlKTtcblxuICAgICAgICAkKFwiI2NvbG9yLXBpY2tlcjJcIikuc3BlY3RydW0oe1xuICAgICAgICAgICAgc2hvd1BhbGV0dGVPbmx5OiB0cnVlLFxuICAgICAgICAgICAgc2hvd1BhbGV0dGU6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogQkFTRV9MRUdPX0NPTE9SLFxuICAgICAgICAgICAgcGFsZXR0ZTogTEVHT19DT0xPUlMsXG4gICAgICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICAgICAgICAgIGxlZ29DYW52YXMuY2hhbmdlQ29sb3IoY29sb3IudG9IZXhTdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgQ2luZW1hdGljIEJ1dHRvbnNcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0QnRuJyk7XG4gICAgICAgIGNvbnN0IGhlbHBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpXG5cbiAgICAgICAgY29uc3Qgc3RyZWFtU3RhcnQgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KHN0YXJ0QnRuLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnc3RhcnQnKTtcblxuICAgICAgICBjb25zdCBzdHJlYW1IZWxwID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChoZWxwQnRuLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnaGVscCcpO1xuXG4gICAgICAgIHN0cmVhbVN0YXJ0Lm1lcmdlKHN0cmVhbUhlbHApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWdhbWVJbml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaW1lb3V0IG5lZWRlZCB0byBzdGFydCB0aGUgcmVuZGVyaW5nIG9mIGxvYWRpbmcgYW5pbWF0aW9uIChlbHNlIHdpbGwgbm90IGJlIHNob3cpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZUluaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0R2FtZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09ICdoZWxwJykge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1waWNrZXIyJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBzdWJtaXNzaW9uXG4gICAgICAgICAqL1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5TdWJtaXNzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0ge1xuICAgICAgICAgICAgICAgIG5hbWUgOiAnVXNlciBOYW1lJyxcbiAgICAgICAgICAgICAgICBpZCA6ICd1c2VySWQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgZHJhd0RhdGFzID0gbGVnb0NhbnZhcy5leHBvcnQodXNlci5uYW1lLCB1c2VyLmlkKTtcbiAgICAgICAgICAgIGRyYXdEYXRhcy5kYXRhVXJsID0gbGVnb0NhbnZhcy5zbmFwc2hvdCgpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCd3aWxsIHNlbmQgOiAnLCBkcmF3RGF0YXMpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgVVJMID0gYGh0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9kcmF3LyR7dXNlci5pZH1gO1xuICAgICAgICAgICAgZmV0Y2goVVJMLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRyYXdEYXRhcylcbiAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGVnb0NhbnZhcy5yZXNldEJvYXJkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIG1lbnUgaXRlbXNcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3QgbWVudUdhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJyk7XG4gICAgICAgIGNvbnN0IG1lbnVDcmVhdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKTtcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3Qgc3RyZWFtR2FtZSA9IFJ4Lk9ic2VydmFibGVcbiAgICAgICAgICAgIC5mcm9tRXZlbnQobWVudUdhbWUsICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdnYW1lJyk7XG5cbiAgICAgICAgY29uc3Qgc3RyZWFtQ3JlYXRpb25zID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChtZW51Q3JlYXRpb25zLCAnY2xpY2snKVxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnY3JlYXRpb25zJyk7XG5cbiAgICAgICAgc3RyZWFtR2FtZS5tZXJnZShzdHJlYW1DcmVhdGlvbnMpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ2dhbWUnKXtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY29udGVudCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXR0ZWQnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtZ2FtZScpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fZHJhd2VyJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fb2JmdXNjYXRvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChzdGF0ZSA9PT0gJ2NyZWF0aW9ucycpe1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jb250ZW50Jykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXR0ZWQnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtY3JlYXRpb25zJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19kcmF3ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19vYmZ1c2NhdG9yJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lIDogJ1VzZXIgTmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA6ICd1c2VySWQnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG15SW5pdCA9IHsgbWV0aG9kOiAnR0VUJ307XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFVSTCA9IGBodHRwOi8vbG9jYWxob3N0OjkwMDAvZHJhdy8ke3VzZXIuaWR9YDtcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goVVJMLCBteUluaXQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHNuYXBzaG90KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc25hcHNob3QuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzbmFwc2hvdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzbmFwc2hvdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc25hcHNob3RGYiA9IHNuYXBzaG90O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhzbmFwc2hvdEZiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJhdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gZHJhdyAhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBCdXR0b25zIGZvciBjaGFuZ2luZyBvZiBkcmF3XG4gICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0IGJ0bkxlZnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuTGVmdCcpO1xuICAgICAgICBjb25zdCBidG5SaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5SaWdodCcpO1xuXG4gICAgICAgIGNvbnN0IHN0cmVhbUJ0bkxlZnQgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGJ0bkxlZnQsJ2NsaWNrJywoKT0+aW5kZXggPSBNYXRoLm1heChpbmRleCAtIDEsIDApKTtcbiAgICAgICAgY29uc3Qgc3RyZWFtQnRuUmlnaHQgPSAgUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChidG5SaWdodCwgJ2NsaWNrJywoKT0+aW5kZXggPSBNYXRoLm1pbihpbmRleCArIDEsIGtleXMubGVuZ3RoIC0gMSkpO1xuXG4gICAgICAgc3RyZWFtQnRuTGVmdC5tZXJnZShzdHJlYW1CdG5SaWdodCkuc3Vic2NyaWJlKGRyYXcpO1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IGEgZHJhdyBhbmQgc2hvdyBpdCdzIHN0YXRlIDogUmVqZWN0ZWQgb3IgQWNjZXB0ZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkcmF3KCkge1xuICAgICAgICBsZXQgZHJhdyA9IHNuYXBzaG90RmJba2V5c1tpbmRleF1dO1xuICAgICAgICBsZXQgaW1nU3VibWlzc2lvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWdTdWJtaXNzaW9uJyk7XG4gICAgICAgIGltZ1N1Ym1pc3Npb24uc3JjID0gZHJhdy5kYXRhVXJsO1xuICAgICAgICBpZiAoZHJhdy5hY2NlcHRlZCAmJiAhaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY2VwdGVkJykpIHtcbiAgICAgICAgICAgIGltZ1N1Ym1pc3Npb24uY2xhc3NMaXN0LmFkZCgnYWNjZXB0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGltZ1N1Ym1pc3Npb24uY2xhc3NMaXN0LnJlbW92ZSgnYWNjZXB0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcblxuICAgIC8qIFNFUlZJQ0VfV09SS0VSX1JFUExBQ0UgKi9cbiAgICBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgeyAgICAgICAgXG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcuL3NlcnZpY2Utd29ya2VyLXBob25lLmpzJywge3Njb3BlIDogbG9jYXRpb24ucGF0aG5hbWV9KS50aGVuKGZ1bmN0aW9uKHJlZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2UgV29ya2VyIFJlZ2lzdGVyIGZvciBzY29wZSA6ICVzJyxyZWcuc2NvcGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgIC8qU0VSVklDRV9XT1JLRVJfUkVQTEFDRSAqL1xuXG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1BlZ30gZnJvbSAnLi4vbGVnb19zaGFwZS9wZWcuanMnO1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4uL2xlZ29fc2hhcGUvY2lyY2xlLmpzJztcbmltcG9ydCB7TkJfQ0VMTFMsIEhFQURFUl9IRUlHSFQsIEJBU0VfTEVHT19DT0xPUiwgQkFDS0dST1VORF9MRUdPX0NPTE9SfSBmcm9tICcuLi9jb21tb24vY29uc3QuanMnO1xuaW1wb3J0IHtsZWdvQmFzZUNvbG9yfSBmcm9tICcuLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XG5cbi8qKlxuICogXG4gKiBDbGFzcyBmb3IgQ2FudmFzIEdyaWRcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgTGVnb0dyaWRDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBzaG93Um93KSB7XG4gICAgICAgIC8vIEJhc2ljIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhc0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgLy8gU2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXNSZWN0ID0gdGhpcy5jYW52YXNFbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIC8vIEluZGljYXRvciBmb3Igc2hvd2luZyB0aGUgZmlyc3Qgcm93IHdpdGggcGVnc1xuICAgICAgICB0aGlzLnNob3dSb3cgPSBzaG93Um93O1xuICAgICAgICB0aGlzLmNhbnZhc0VsdC53aWR0aCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aDtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHNob3dSb3csIHdlIHdpbGwgc2hvdyBtb2RpZnkgdGhlIGhlYWRlciBIZWlnaHRcbiAgICAgICAgdGhpcy5oZWFkZXJIZWlnaHQgPSB0aGlzLnNob3dSb3cgPyBIRUFERVJfSEVJR0hUIDogMDtcbiAgICAgICAgdGhpcy5jYW52YXNFbHQuaGVpZ2h0ID0gdGhpcy5jYW52YXNSZWN0LndpZHRoICsgdGhpcy5oZWFkZXJIZWlnaHQ7XG4gICAgICAgIC8vIFdlIGNhbGN1bGF0ZSB0aGUgY2VsbHNpemUgYWNjb3JkaW5nIHRvIHRoZSBzcGFjZSB0YWtlbiBieSB0aGUgY2FudmFzXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKTtcblxuICAgICAgICAvLyBXZSBpbml0aWFsaXplIHRoZSBGYWJyaWMgSlMgbGlicmFyeSB3aXRoIG91ciBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgZmFicmljLkNhbnZhcyhpZCwgeyBzZWxlY3Rpb246IGZhbHNlIH0pO1xuICAgICAgICAvLyBPYmplY3QgdGhhdCByZXByZXNlbnQgdGhlIHBlZ3Mgb24gdGhlIGZpcnN0IHJvd1xuICAgICAgICB0aGlzLnJvd1NlbGVjdCA9IHt9O1xuICAgICAgICAvLyBUaGUgY3VycmVudCBkcmF3IG1vZGVsIChpbnN0cnVjdGlvbnMsIC4uLilcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge30sXG4gICAgICAgIC8vIEZsYWcgdG8gZGV0ZXJtaW5lIGlmIHdlIGhhdmUgdG8gY3JlYXRlIGEgbmV3IGJyaWNrXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3QnJpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IEJBU0VfTEVHT19DT0xPUjtcblxuICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIGNhbnZhc1xuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XG5cbiAgICAgICAgLy8gSWYgd2Ugc2hvdyB0aGUgcm93LCB3ZSBoYXZlIHRvIHBsdWcgdGhlIG1vdmUgbWFuYWdlbWVudFxuICAgICAgICBpZiAoc2hvd1Jvdykge1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0OnNlbGVjdGVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnID8gb3B0aW9ucy50YXJnZXQgOiBudWxsKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdzZWxlY3Rpb246Y2xlYXJlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG51bGwpO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0Om1vdmluZycsIChvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBlZyA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZztcblxuXG4gICAgICAgICAgICAgICAgbGV0IG5ld0xlZnQgPSBNYXRoLnJvdW5kKG9wdGlvbnMudGFyZ2V0LmxlZnQgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1RvcCA9IE1hdGgucm91bmQoKG9wdGlvbnMudGFyZ2V0LnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0KSAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSArIHRoaXMuaGVhZGVySGVpZ2h0OyAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gY2FsY3VsYXRlIHRoZSB0b3BcbiAgICAgICAgICAgICAgICBsZXQgdG9wQ29tcHV0ZSA9IG5ld1RvcCArIChwZWcuc2l6ZS5yb3cgPT09IDIgfHwgcGVnLmFuZ2xlID4gMCA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnRDb21wdXRlID0gbmV3TGVmdCArIChwZWcuc2l6ZS5jb2wgPT09IDIgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgICAgIHBlZy5tb3ZlKFxuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0LCAvL2xlZnRcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wIC8vIHRvcFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBzcGVjaWZ5IHRoYXQgd2UgY291bGQgcmVtb3ZlIGEgcGVnIGlmIG9uZSBvZiBpdCdzIGVkZ2UgdG91Y2ggdGhlIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xuICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPCBIRUFERVJfSEVJR0hUXG4gICAgICAgICAgICAgICAgICAgIHx8IG5ld0xlZnQgPCAwXG4gICAgICAgICAgICAgICAgICAgIHx8IHRvcENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQuaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIHx8IGxlZnRDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSB3ZSBjaGVjayB3ZSBjcmVhdGUgYSBuZXcgcGVnICh3aGVuIGEgcGVnIGVudGVyIGluIHRoZSBkcmF3IGFyZWEpXG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUuY29sID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAocGVnLmFuZ2xlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSw5MCkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZy5yZXBsYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdtb3VzZTp1cCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QnJpY2tcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnRvUmVtb3ZlXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmJyaWNrTW9kZWxbdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlKHRoaXMuY3VycmVudEJyaWNrKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgZm9yIGNoYW5naW5nIHRoZSBjb2xvciBvZiB0aGUgZmlyc3Qgcm93IFxuICAgICAqL1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKSB7XG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gY29sb3I7ICAgICAgIFxuICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXJpYWxpemUgdGhlIGNhbnZhcyB0byBhIG1pbmltYWwgb2JqZWN0IHRoYXQgY291bGQgYmUgdHJlYXQgYWZ0ZXJcbiAgICAgKi9cbiAgICBleHBvcnQodXNlck5hbWUsIHVzZXJJZCkge1xuICAgICAgICBsZXQgcmVzdWx0QXJyYXkgPSBbXTtcbiAgICAgICAgLy8gV2UgZmlsdGVyIHRoZSByb3cgcGVnc1xuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuYnJpY2tNb2RlbClcbiAgICAgICAgICAgIC5maWx0ZXIoKGtleSk9PmtleSAhPSB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmlkXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnJlY3QuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuaWQpO1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBlZ1RtcCA9IHRoaXMuYnJpY2tNb2RlbFtrZXldO1xuICAgICAgICAgICAgcmVzdWx0QXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgc2l6ZTogcGVnVG1wLnNpemUsXG4gICAgICAgICAgICAgICAgY29sb3I6IHBlZ1RtcC5jb2xvcixcbiAgICAgICAgICAgICAgICBhbmdsZTogcGVnVG1wLmFuZ2xlLFxuICAgICAgICAgICAgICAgIHRvcDogcGVnVG1wLnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IHBlZ1RtcC5sZWZ0LFxuICAgICAgICAgICAgICAgIGNlbGxTaXplIDogdGhpcy5jZWxsU2l6ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXNlcjogdXNlck5hbWUsXG4gICAgICAgICAgICB1c2VySWQgOiB1c2VySWQsXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnM6IHJlc3VsdEFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBmcm9tIGludHJ1Y3Rpb25zIGEgZHJhd1xuICAgICAqL1xuICAgIGRyYXdJbnN0cnVjdGlvbnMoaW5zdHJ1Y3Rpb25PYmplY3Qpe1xuICAgICAgICB0aGlzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgaW5zdHJ1Y3Rpb25PYmplY3QuaW5zdHJ1Y3Rpb25zLmZvckVhY2goKGluc3RydWN0aW9uKT0+e1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUJyaWNrKHsgc2l6ZSA6IGluc3RydWN0aW9uLnNpemUsIFxuICAgICAgICAgICAgICAgICAgICBsZWZ0IDogKGluc3RydWN0aW9uLmxlZnQgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoaW5zdHJ1Y3Rpb24udG9wIC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGUgOiBpbnN0cnVjdGlvbi5hbmdsZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgOiBpbnN0cnVjdGlvbi5jb2xvclxuICAgICAgICAgICAgICAgIH0pLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gdGhlIGJvYXJkIGFuZCB0aGUgc3RhdGUgb2YgdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIHJlc2V0Qm9hcmQoKXtcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge307XG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcbiAgICB9XG5cbiAgICAvKiogXG4gICAgICogR2VuZXJhdGUgYSBCYXNlNjQgaW1hZ2UgZnJvbSB0aGUgY2FudmFzXG4gICAgICovXG4gICAgc25hcHNob3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIFByaXZhdGVzIE1ldGhvZHNcbiAgICAgKiBcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogRHJhdyB0aGUgYmFzaWMgZ3JpZCBcbiAgICAqL1xuICAgIF9kcmF3R3JpZChzaXplKSB7ICAgICAgIFxuICAgICAgICBpZiAodGhpcy5zaG93Um93KXtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFsbCB0aGUgd2hpdGUgcGVnIG9mIHRoZSBncmlkXG4gICAgICovXG4gICAgX2RyYXdXaGl0ZVBlZyhzaXplKXtcbiAgICAgICAgLy8gV2Ugc3RvcCByZW5kZXJpbmcgb24gZWFjaCBhZGQsIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzXG4gICAgICAgIC8vdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1heCA9IE1hdGgucm91bmQoc2l6ZSAvIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICBsZXQgbWF4U2l6ZSA9IG1heCAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgIGZvciAodmFyIHJvdyA9MDsgcm93IDwgbWF4OyByb3crKyl7XG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtYXg7IGNvbCsrICl7XG4gICAgICAgICAgICAgICAgIGxldCBzcXVhcmVUbXAgPSBuZXcgZmFicmljLlJlY3Qoe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBCQUNLR1JPVU5EX0xFR09fQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHM6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGNpcmNsZSA9IG5ldyBDaXJjbGUodGhpcy5jZWxsU2l6ZSwgQkFDS0dST1VORF9MRUdPX0NPTE9SKTtcbiAgICAgICAgICAgICAgICBjaXJjbGUuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwVG1wID0gbmV3IGZhYnJpYy5Hcm91cChbc3F1YXJlVG1wLCBjaXJjbGUuY2FudmFzRWx0XSwge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLmNlbGxTaXplICogY29sLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuY2VsbFNpemUgKiByb3cgKyB0aGlzLmhlYWRlckhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKGdyb3VwVG1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKnRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgICAgIC8vIFdlIHRyYW5zZm9ybSB0aGUgY2FudmFzIHRvIGEgYmFzZTY0IGltYWdlIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzLlxuICAgICAgICBsZXQgdXJsID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7ICAgICBcbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QmFja2dyb3VuZEltYWdlKHVybCx0aGlzLmNhbnZhcy5yZW5kZXJBbGwuYmluZCh0aGlzLmNhbnZhcyksIHtcbiAgICAgICAgICAgIG9yaWdpblg6ICdsZWZ0JyxcbiAgICAgICAgICAgIG9yaWdpblk6ICd0b3AnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2FudmFzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5jYW52YXMuaGVpZ2h0LFxuICAgICAgICB9KTsgICAqL1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGhvcml6b250YWwgb3IgdmVydGljYWwgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgX2NyZWF0ZVJlY3Qoc2l6ZVJlY3QsIGFuZ2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAyICogc2l6ZVJlY3QsIHJvdyA6MSAqIHNpemVSZWN0fSwgXG4gICAgICAgICAgICAgICAgbGVmdCA6IGFuZ2xlID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyA0KSAtIHRoaXMuY2VsbFNpemUpIDogKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggKiAzIC8gNCkgLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxuICAgICAgICAgICAgICAgIHRvcCA6IGFuZ2xlID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgc3F1YXJlICgxeDEpIG9yICgyeDIpXG4gICAgICovXG4gICAgX2NyZWF0ZVNxdWFyZShzaXplU3F1YXJlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAxICogc2l6ZVNxdWFyZSwgcm93IDoxICogc2l6ZVNxdWFyZX0sIFxuICAgICAgICAgICAgICAgIGxlZnQ6IHNpemVTcXVhcmUgPT09IDIgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDIpIC0gKDIgKiB0aGlzLmNlbGxTaXplKSkgOiAodGhpcy5jYW52YXNSZWN0LndpZHRoIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcbiAgICAgICAgICAgICAgICB0b3AgOiBzaXplU3F1YXJlID09PSAyID8gMSA6IDAsXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmljIG1ldGhvZCB0aGF0IGNyZWF0ZSBhIHBlZ1xuICAgICAqL1xuICAgIF9jcmVhdGVCcmljayhvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMuY2VsbFNpemUgPSB0aGlzLmNlbGxTaXplO1xuICAgICAgICBvcHRpb25zLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCB0aGlzLmxhc3RDb2xvcjtcbiAgICAgICAgbGV0IHBlZyA9IG5ldyBQZWcob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbFtwZWcuaWRdID0gcGVnO1xuICAgICAgICAvLyBXZSBoYXZlIHRvIHVwZGF0ZSB0aGUgcm93U2VsZWN0IE9iamVjdCB0byBiZSBhbHN3YXkgdXBkYXRlXG4gICAgICAgIGlmIChvcHRpb25zLnNpemUucm93ID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbmdsZSkge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zaXplLmNvbCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdCA9IHBlZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZSA9IHBlZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGVnO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5pdCB0aGUgY2FudmFzXG4gICAgICovXG4gICAgX2RyYXdDYW52YXMoKSB7XG4gICAgICAgIHRoaXMuX2RyYXdXaGl0ZVBlZyh0aGlzLmNhbnZhc1JlY3Qud2lkdGgpO1xuICAgICAgICB0aGlzLl9kcmF3R3JpZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGgsIE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpKTtcbiAgICB9XG4gICAgXG5cbn0iLCIndXNlIHN0cmljdCdcblxuLy8gTnVtYmVyIG9mIGNlbGwgb24gdGhlIGdyaWRcbmV4cG9ydCBjb25zdCBOQl9DRUxMUyA9IDE1O1xuXG4vLyBIZWlnaHQgb2YgdGhlIGhlYWRlclxuZXhwb3J0IGNvbnN0IEhFQURFUl9IRUlHSFQgPSB3aW5kb3cuc2NyZWVuLndpZHRoIDw9IDc2OCAgPyA2MCA6IDEwMDtcblxuLy8gRmlyc3QgY29sb3IgdG8gdXNlXG5leHBvcnQgY29uc3QgQkFTRV9MRUdPX0NPTE9SID0gXCIjMGQ2OWYyXCI7XG5cbi8vIE1lZGl1bSBTdG9uZSBHcmV5IFxuY29uc3QgQ09MT1JfMTk0ID0gXCIjYTNhMmE0XCI7XG5cbi8vIExpZ2h0IFN0b25lIEdyZXlcbmNvbnN0IENPTE9SXzIwOCA9IFwiI2U1ZTRkZVwiOyBcblxuLy8gQmFja2dyb3VuZCBjb2xvciB1c2VkXG5leHBvcnQgY29uc3QgQkFDS0dST1VORF9MRUdPX0NPTE9SID0gQ09MT1JfMjA4OyIsIid1c2Ugc3RyaWN0J1xuXG4vKlxuKiBDb2xvcnMgZnJvbSBcbiogaHR0cDovL2xlZ28ud2lraWEuY29tL3dpa2kvQ29sb3VyX1BhbGV0dGUgXG4qIEFuZCBodHRwOi8vd3d3LnBlZXJvbi5jb20vY2dpLWJpbi9pbnZjZ2lzL2NvbG9yZ3VpZGUuY2dpXG4qIE9ubHkgU2hvdyB0aGUgY29sb3IgdXNlIHNpbmNlIDIwMTBcbioqLyBcbmV4cG9ydCBjb25zdCBMRUdPX0NPTE9SUyA9IFtcbiAgICAncmdiKDI0NSwgMjA1LCA0NyknLCAvLzI0LCBCcmlnaHQgWWVsbG93ICpcbiAgICAncmdiKDI1MywgMjM0LCAxNDApJywgLy8yMjYsIENvb2wgWWVsbG93ICpcbiAgICAncmdiKDIxOCwgMTMzLCA2NCknLCAvLzEwNiwgQnJpZ2h0IE9yYW5nZSAqXG4gICAgJ3JnYigyMzIsIDE3MSwgNDUpJywgLy8xOTEsIEZsYW1lIFllbGxvd2lzaCBPcmFuZ2UgKlxuICAgICdyZ2IoMTk2LCA0MCwgMjcpJywgLy8yMSwgQnJpZ2h0IFJlZCAqXG4gICAgJ3JnYigxMjMsIDQ2LCA0NyknLCAvLzE1NCwgRGFyayBSZWQgKlxuICAgICdyZ2IoMjA1LCA5OCwgMTUyKScsIC8vMjIxLCBCcmlnaHQgUHVycGxlICpcbiAgICAncmdiKDIyOCwgMTczLCAyMDApJywgLy8yMjIsIExpZ2h0IFB1cnBsZSAqXG4gICAgJ3JnYigxNDYsIDU3LCAxMjApJywgLy8xMjQsIEJyaWdodCBSZWRkaXNoIFZpb2xldCAqXG4gICAgJ3JnYig1MiwgNDMsIDExNyknLCAvLzI2OCwgTWVkaXVtIExpbGFjICpcbiAgICAncmdiKDEzLCAxMDUsIDI0MiknLCAvLzIzLCBCcmlnaHQgQmx1ZSAqXG4gICAgJ3JnYigxNTksIDE5NSwgMjMzKScsIC8vMjEyLCBMaWdodCBSb3lhbCBCbHVlICpcbiAgICAncmdiKDExMCwgMTUzLCAyMDEpJywgLy8xMDIsIE1lZGl1bSBCbHVlICpcbiAgICAncmdiKDMyLCA1OCwgODYpJywgLy8xNDAsIEVhcnRoIEJsdWUgKlxuICAgICdyZ2IoMTE2LCAxMzQsIDE1NiknLCAvLzEzNSwgU2FuZCBCbHVlICpcbiAgICAncmdiKDQwLCAxMjcsIDcwKScsIC8vMjgsIERhcmsgR3JlZW4gKlxuICAgICdyZ2IoNzUsIDE1MSwgNzQpJywgLy8zNywgQmlyZ2h0IEdyZWVuICpcbiAgICAncmdiKDEyMCwgMTQ0LCAxMjkpJywgLy8xNTEsIFNhbmQgR3JlZW4gKlxuICAgICdyZ2IoMzksIDcwLCA0NCknLCAvLzE0MSwgRWFydGggR3JlZW4gKlxuICAgICdyZ2IoMTY0LCAxODksIDcwKScsIC8vMTE5LCBCcmlnaHQgWWVsbG93aXNoLUdyZWVuICogXG4gICAgJ3JnYigxMDUsIDY0LCAzOSknLCAvLzE5MiwgUmVkZGlzaCBCcm93biAqXG4gICAgJ3JnYigyMTUsIDE5NywgMTUzKScsIC8vNSwgQnJpY2sgWWVsbG93ICogXG4gICAgJ3JnYigxNDksIDEzOCwgMTE1KScsIC8vMTM4LCBTYW5kIFllbGxvdyAqXG4gICAgJ3JnYigxNzAsIDEyNSwgODUpJywgLy8zMTIsIE1lZGl1bSBOb3VnYXQgKiAgICBcbiAgICAncmdiKDQ4LCAxNSwgNiknLCAvLzMwOCwgRGFyayBCcm93biAqXG4gICAgJ3JnYigyMDQsIDE0MiwgMTA0KScsIC8vMTgsIE5vdWdhdCAqXG4gICAgJ3JnYigyNDUsIDE5MywgMTM3KScsIC8vMjgzLCBMaWdodCBOb3VnYXQgKlxuICAgICdyZ2IoMTYwLCA5NSwgNTIpJywgLy8zOCwgRGFyayBPcmFuZ2UgKlxuICAgICdyZ2IoMjQyLCAyNDMsIDI0MiknLCAvLzEsIFdoaXRlICpcbiAgICAncmdiKDIyOSwgMjI4LCAyMjIpJywgLy8yMDgsIExpZ2h0IFN0b25lIEdyZXkgKlxuICAgICdyZ2IoMTYzLCAxNjIsIDE2NCknLCAvLzE5NCwgTWVkaXVtIFN0b25lIEdyZXkgKlxuICAgICdyZ2IoOTksIDk1LCA5NyknLCAvLzE5OSwgRGFyayBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDI3LCA0MiwgNTIpJywgLy8yNiwgQmxhY2sgKiAgICAgICAgXG5dOyIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgYSB2YXJpYXRpb24gb2YgY29sb3JcbiAqIFxuICogRnJvbSA6IGh0dHBzOi8vd3d3LnNpdGVwb2ludC5jb20vamF2YXNjcmlwdC1nZW5lcmF0ZS1saWdodGVyLWRhcmtlci1jb2xvci9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbG9yTHVtaW5hbmNlKGhleCwgbHVtKSB7XG5cbiAgICAgICAgLy8gdmFsaWRhdGUgaGV4IHN0cmluZ1xuICAgICAgICBoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XG4gICAgICAgIH1cbiAgICAgICAgbHVtID0gbHVtIHx8IDA7XG5cbiAgICAgICAgLy8gY29udmVydCB0byBkZWNpbWFsIGFuZCBjaGFuZ2UgbHVtaW5vc2l0eVxuICAgICAgICB2YXIgcmdiID0gXCIjXCIsIGMsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xuICAgICAgICAgICAgYyA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgYyArIChjICogbHVtKSksIDI1NSkpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgIHJnYiArPSAoXCIwMFwiICsgYykuc3Vic3RyKGMubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZ2I7XG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0NvbG9yTHVtaW5hbmNlfSBmcm9tICcuLi9jb21tb24vdXRpbC5qcyc7XG5cbi8qKlxuICogQ2lyY2xlIExlZ28gY2xhc3NcbiAqIFRoZSBjaXJjbGUgaXMgY29tcG9zZWQgb2YgMiBjaXJjbGUgKG9uIHRoZSBzaGFkb3csIGFuZCB0aGUgb3RoZXIgb25lIGZvciB0aGUgdG9wKVxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBDaXJjbGV7XG4gICAgY29uc3RydWN0b3IoY2VsbFNpemUsIGNvbG9yKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMgPSBuZXcgZmFicmljLkNpcmNsZSh7XG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNSxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjBweCAycHggMTBweCByZ2JhKDAsMCwwLDAuMilcIlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4ID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDQsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IGZhYnJpYy5UZXh0KCdHREcnLCB7XG4gICAgICAgICAgICBmb250U2l6ZTogY2VsbFNpemUgLyA1LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBzdHJva2U6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMCksXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdyb3VwID0gbmV3IGZhYnJpYy5Hcm91cChbdGhpcy5jaXJjbGVCYXNpY0V0eCwgdGhpcy5jaXJjbGVCYXNpYywgdGhpcy50ZXh0XSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBGYWJyaWNKUyBlbGVtZW50XG4gICAgICovXG4gICAgZ2V0IGNhbnZhc0VsdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDsgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgY2lyY2xlXG4gICAgICovXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljLnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSk7XG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHguc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSkpO1xuICAgICAgICB0aGlzLnRleHQuc2V0KHtcbiAgICAgICAgICAgIGZpbGwgOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxuICAgICAgICAgICAgc3Ryb2tlIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKVxuICAgICAgICB9KTtcbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi9jaXJjbGUuanMnO1xuXG4vKipcbiAqIFBlZyBMZWdvIGNsYXNzXG4gKiBUaGUgcGVnIGlzIGNvbXBvc2VkIG9mIG4gY2lyY2xlIGZvciBhIGRpbWVuc2lvbiB0aGF0IGRlcGVuZCBvbiB0aGUgc2l6ZSBwYXJhbWV0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFBlZ3tcbiAgICBjb25zdHJ1Y3Rvcih7c2l6ZSA9IHtjb2wgOiAxLCByb3cgOiAxfSwgY2VsbFNpemUgPSAwLCBjb2xvciA9ICcjRkZGJywgbGVmdCA9IDAsIHRvcCA9IDAsIGFuZ2xlID0gMH0pe1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmlkID0gYFBlZyR7c2l6ZX0tJHtEYXRlLm5vdygpfWA7XG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG9SZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlIHx8IDA7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkgPSBbXTtcblxuXG4gICAgICAgIHRoaXMucmVjdEJhc2ljID0gbmV3IGZhYnJpYy5SZWN0KHtcbiAgICAgICAgICAgIHdpZHRoOiBjZWxsU2l6ZSAqIHNpemUuY29sLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZSAqIHNpemUucm93LFxuICAgICAgICAgICAgZmlsbDogY29sb3IsXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiNXB4IDVweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgbGV0IGFycmF5RWx0cyA9IFt0aGlzLnJlY3RCYXNpY107XG4gICAgICAgIGxldCBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTsgICAgICAgXG4gICAgICAgIC8vIEFjY29yZGluZyB0byB0aGUgc2l6ZSwgd2UgZG9uJ3QgcGxhY2UgdGhlIGNpcmNsZXMgYXQgdGhlIHNhbWUgcGxhY2VcbiAgICAgICAgaWYgKHNpemUuY29sID09PSAyKXtcbiAgICAgICAgICAgIC8vIEZvciBhIHJlY3RhbmdsZSBvciBhIGJpZyBTcXVhcmVcbiAgICAgICAgICAgIC8vIFdlIHVwZGF0ZSB0aGUgcm93IHBvc2l0aW9uc1xuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoLWNlbGxTaXplICs1KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDUsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LmZvckVhY2goKGNpcmNsZSk9PmFycmF5RWx0cy5wdXNoKGNpcmNsZS5jYW52YXNFbHQpKTtcblxuICAgICAgICAvLyBUaGUgcGVnIGlzIGxvY2tlZCBpbiBhbGwgcG9zaXRpb25cbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoYXJyYXlFbHRzLCB7XG4gICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXG4gICAgICAgICAgICB0b3A6IHRoaXMudG9wLFxuICAgICAgICAgICAgYW5nbGU6IHRoaXMuYW5nbGUsXG4gICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXZSBhZGQgdG8gRmFicmljRWxlbWVudCBhIHJlZmVyZW5jZSB0byB0aGUgY3VyZW50IHBlZ1xuICAgICAgICB0aGlzLmdyb3VwLnBhcmVudFBlZyA9IHRoaXM7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBUaGUgRmFicmljSlMgZWxlbWVudFxuICAgIGdldCBjYW52YXNFbHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7XG4gICAgfVxuXG4gICAgLy8gVHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgcmVwbGFjZWRcbiAgICBnZXQgcmVwbGFjZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5pc1JlcGxhY2VcbiAgICB9XG5cbiAgICAvLyBTZXR0ZXIgZm9yIGlzUmVwbGFjZSBwYXJhbVxuICAgIHNldCByZXBsYWNlKHJlcGxhY2Upe1xuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IHJlcGxhY2U7XG4gICAgfVxuXG4gICAgLy8gQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgcGVnXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMucmVjdEJhc2ljLnNldCgnZmlsbCcsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT4gY2lyY2xlLmNoYW5nZUNvbG9yKGNvbG9yKSk7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBNb3ZlIHRoZSBwZWcgdG8gZGVzaXJlIHBvc2l0aW9uXG4gICAgbW92ZShsZWZ0LCB0b3Ape1xuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xuICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICBsZWZ0IDogbGVmdFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSb3RhdGUgdGhlIHBlZyB0byB0aGUgZGVzaXJlIGFuZ2xlXG4gICAgcm90YXRlKGFuZ2xlKXtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XG4gICAgICAgICAgICBhbmdsZSA6IGFuZ2xlXG4gICAgICAgIH0pO1xuICAgIH1cblxufSJdfQ==
