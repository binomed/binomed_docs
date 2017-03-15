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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHNjcmlwdHNcXGFwcF9waG9uZS5qcyIsInNyY1xcc2NyaXB0c1xcY2FudmFzXFxsZWdvQ2FudmFzLmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGNvbnN0LmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGxlZ29Db2xvcnMuanMiLCJzcmNcXHNjcmlwdHNcXGNvbW1vblxcdXRpbC5qcyIsInNyY1xcc2NyaXB0c1xcbGVnb19zaGFwZVxcY2lyY2xlLmpzIiwic3JjXFxzY3JpcHRzXFxsZWdvX3NoYXBlXFxwZWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQSxDQUFDLFlBQVk7O0FBRVQsUUFBSSxXQUFXLEtBQWY7QUFBQSxRQUFxQjtBQUNqQixpQkFBYSxJQURqQjtBQUFBLFFBQ3VCO0FBQ25CLFdBQU8sSUFGWDtBQUFBLFFBRWlCO0FBQ2IsaUJBQWEsSUFIakI7QUFBQSxRQUd1QjtBQUNuQixZQUFRLENBSlo7O0FBT0EsYUFBUyxRQUFULEdBQW9COztBQUVoQixxQkFBYSwrQkFBbUIsWUFBbkIsRUFBaUMsSUFBakMsQ0FBYjs7QUFFQSxVQUFFLGdCQUFGLEVBQW9CLFFBQXBCLENBQTZCO0FBQ3pCLDZCQUFpQixJQURRO0FBRXpCLHlCQUFhLElBRlk7QUFHekIseUNBSHlCO0FBSXpCLDRDQUp5QjtBQUt6QixvQkFBUSxnQkFBVSxLQUFWLEVBQWlCO0FBQ3JCLDJCQUFXLFdBQVgsQ0FBdUIsTUFBTSxXQUFOLEVBQXZCO0FBQ0g7QUFQd0IsU0FBN0I7QUFTSDs7QUFFRCxhQUFTLFFBQVQsR0FBb0I7O0FBR2hCOzs7QUFHQSxZQUFNLFdBQVcsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWpCO0FBQ0EsWUFBTSxVQUFVLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQUFoQjs7QUFFQSxZQUFNLGNBQWMsR0FBRyxVQUFI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UTtBQURHLGFBQWY7QUFHSDs7OzRCQXJDYztBQUNYLG1CQUFPLEtBQUssS0FBWjtBQUNIOztBQUVEOzs7OzRCQUNhO0FBQ1QsbUJBQU8sS0FBSyxTQUFaO0FBQ0g7O0FBRUQ7OzBCQUNZLE8sRUFBUTtBQUNoQixpQkFBSyxTQUFMLEdBQWlCLE9BQWpCO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7TEVHT19DT0xPUlN9IGZyb20gJy4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xyXG5pbXBvcnQge0JBU0VfTEVHT19DT0xPUn0gZnJvbSAnLi9jb21tb24vY29uc3QuanMnO1xyXG5pbXBvcnQge0xlZ29HcmlkQ2FudmFzfSBmcm9tICcuL2NhbnZhcy9sZWdvQ2FudmFzLmpzJztcclxuXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGxldCBnYW1lSW5pdCA9IGZhbHNlLC8vIHRydWUgaWYgd2UgaW5pdCB0aGUgbGVnb0dyaWRcclxuICAgICAgICBsZWdvQ2FudmFzID0gbnVsbCwgLy8gVGhlIGxlZ29HcmlkXHJcbiAgICAgICAga2V5cyA9IG51bGwsIC8vIFRoZSBrZXlzIG9mIGZpcmVuYXNlIHN1Ym1pdCBkcmF3XHJcbiAgICAgICAgc25hcHNob3RGYiA9IG51bGwsIC8vIFRoZSBzbmFwc2hvdCBvZiBzdWJtaXQgZHJhd1xyXG4gICAgICAgIGluZGV4ID0gMDtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XHJcblxyXG4gICAgICAgIGxlZ29DYW52YXMgPSBuZXcgTGVnb0dyaWRDYW52YXMoJ2NhbnZhc0RyYXcnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgJChcIiNjb2xvci1waWNrZXIyXCIpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgc2hvd1BhbGV0dGVPbmx5OiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3I6IEJBU0VfTEVHT19DT0xPUixcclxuICAgICAgICAgICAgcGFsZXR0ZTogTEVHT19DT0xPUlMsXHJcbiAgICAgICAgICAgIGNoYW5nZTogZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdvQ2FudmFzLmNoYW5nZUNvbG9yKGNvbG9yLnRvSGV4U3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIENpbmVtYXRpYyBCdXR0b25zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRCdG4nKTtcclxuICAgICAgICBjb25zdCBoZWxwQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKVxyXG5cclxuICAgICAgICBjb25zdCBzdHJlYW1TdGFydCA9IFJ4Lk9ic2VydmFibGVcclxuICAgICAgICAgICAgLmZyb21FdmVudChzdGFydEJ0biwgJ2NsaWNrJylcclxuICAgICAgICAgICAgLm1hcCgoKSA9PiAnc3RhcnQnKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RyZWFtSGVscCA9IFJ4Lk9ic2VydmFibGVcclxuICAgICAgICAgICAgLmZyb21FdmVudChoZWxwQnRuLCAnY2xpY2snKVxyXG4gICAgICAgICAgICAubWFwKCgpID0+ICdoZWxwJyk7XHJcblxyXG4gICAgICAgIHN0cmVhbVN0YXJ0Lm1lcmdlKHN0cmVhbUhlbHApXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09ICdzdGFydCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVsbG8tbXNnJykuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3ItcGlja2VyMicpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbHAnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2FtZUluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmcnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaW1lb3V0IG5lZWRlZCB0byBzdGFydCB0aGUgcmVuZGVyaW5nIG9mIGxvYWRpbmcgYW5pbWF0aW9uIChlbHNlIHdpbGwgbm90IGJlIHNob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVJbml0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0R2FtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmcnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2hlbHAnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlbGxvLW1zZycpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLXBpY2tlcjInKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxwJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2Ygc3VibWlzc2lvblxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuU3VibWlzc2lvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA6ICdVc2VyIE5hbWUnLFxyXG4gICAgICAgICAgICAgICAgaWQgOiAndXNlcklkJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBkcmF3RGF0YXMgPSBsZWdvQ2FudmFzLmV4cG9ydCh1c2VyLm5hbWUsIHVzZXIuaWQpO1xyXG4gICAgICAgICAgICBkcmF3RGF0YXMuZGF0YVVybCA9IGxlZ29DYW52YXMuc25hcHNob3QoKTtcclxuICAgICAgICAgICAgY29uc29sZS5pbmZvKCd3aWxsIHNlbmQgOiAnLCBkcmF3RGF0YXMpO1xyXG4gICAgICAgICAgICBjb25zdCBVUkwgPSBgaHR0cDovL2xvY2FsaG9zdDo5MDAwL2RyYXcvJHt1c2VyLmlkfWA7XHJcbiAgICAgICAgICAgIGZldGNoKFVSTCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkcmF3RGF0YXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBtZW51IGl0ZW1zXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGNvbnN0IG1lbnVHYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtZ2FtZScpO1xyXG4gICAgICAgIGNvbnN0IG1lbnVDcmVhdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKTtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHN0cmVhbUdhbWUgPSBSeC5PYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIC5mcm9tRXZlbnQobWVudUdhbWUsICdjbGljaycpXHJcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gJ2dhbWUnKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RyZWFtQ3JlYXRpb25zID0gUnguT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuZnJvbUV2ZW50KG1lbnVDcmVhdGlvbnMsICdjbGljaycpXHJcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gJ2NyZWF0aW9ucycpO1xyXG5cclxuICAgICAgICBzdHJlYW1HYW1lLm1lcmdlKHN0cmVhbUNyZWF0aW9ucylcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ2dhbWUnKXtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jb250ZW50JykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0dGVkJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtZ2FtZScpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX2RyYXdlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fb2JmdXNjYXRvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoc3RhdGUgPT09ICdjcmVhdGlvbnMnKXtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jb250ZW50Jykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdHRlZCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtZ2FtZScpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtY3JlYXRpb25zJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX2RyYXdlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWRsLWxheW91dF9fb2JmdXNjYXRvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA6ICdVc2VyIE5hbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA6ICd1c2VySWQnXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBteUluaXQgPSB7IG1ldGhvZDogJ0dFVCd9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFVSTCA9IGBodHRwOi8vbG9jYWxob3N0OjkwMDAvZHJhdy8ke3VzZXIuaWR9YDtcclxuICAgICAgICAgICAgICAgICAgICBmZXRjaChVUkwsIG15SW5pdClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzbmFwc2hvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc25hcHNob3QuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc25hcHNob3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc25hcHNob3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNuYXBzaG90KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNuYXBzaG90RmIgPSBzbmFwc2hvdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhzbmFwc2hvdEZiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBkcmF3ICEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgQnV0dG9ucyBmb3IgY2hhbmdpbmcgb2YgZHJhd1xyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCBidG5MZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bkxlZnQnKTtcclxuICAgICAgICBjb25zdCBidG5SaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5SaWdodCcpO1xyXG5cclxuICAgICAgICBjb25zdCBzdHJlYW1CdG5MZWZ0ID0gUnguT2JzZXJ2YWJsZVxyXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGJ0bkxlZnQsJ2NsaWNrJywoKT0+aW5kZXggPSBNYXRoLm1heChpbmRleCAtIDEsIDApKTtcclxuICAgICAgICBjb25zdCBzdHJlYW1CdG5SaWdodCA9ICBSeC5PYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoYnRuUmlnaHQsICdjbGljaycsKCk9PmluZGV4ID0gTWF0aC5taW4oaW5kZXggKyAxLCBrZXlzLmxlbmd0aCAtIDEpKTtcclxuXHJcbiAgICAgICBzdHJlYW1CdG5MZWZ0Lm1lcmdlKHN0cmVhbUJ0blJpZ2h0KS5zdWJzY3JpYmUoZHJhdyk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgYSBkcmF3IGFuZCBzaG93IGl0J3Mgc3RhdGUgOiBSZWplY3RlZCBvciBBY2NlcHRlZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkcmF3KCkge1xyXG4gICAgICAgIGxldCBkcmF3ID0gc25hcHNob3RGYltrZXlzW2luZGV4XV07XHJcbiAgICAgICAgbGV0IGltZ1N1Ym1pc3Npb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nU3VibWlzc2lvbicpO1xyXG4gICAgICAgIGltZ1N1Ym1pc3Npb24uc3JjID0gZHJhdy5kYXRhVXJsO1xyXG4gICAgICAgIGlmIChkcmF3LmFjY2VwdGVkICYmICFpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjZXB0ZWQnKSkge1xyXG4gICAgICAgICAgICBpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5hZGQoJ2FjY2VwdGVkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY2NlcHRlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG5cclxuICAgIC8qIFNFUlZJQ0VfV09SS0VSX1JFUExBQ0VcclxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XHJcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy4vc2VydmljZS13b3JrZXItcGhvbmUuanMnLCB7c2NvcGUgOiBsb2NhdGlvbi5wYXRobmFtZX0pLnRoZW4oZnVuY3Rpb24ocmVnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlIFdvcmtlciBSZWdpc3RlciBmb3Igc2NvcGUgOiAlcycscmVnLnNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICBTRVJWSUNFX1dPUktFUl9SRVBMQUNFICovXHJcblxyXG59KSgpO1xyXG4iLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtQZWd9IGZyb20gJy4uL2xlZ29fc2hhcGUvcGVnLmpzJztcclxuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4uL2xlZ29fc2hhcGUvY2lyY2xlLmpzJztcclxuaW1wb3J0IHtOQl9DRUxMUywgSEVBREVSX0hFSUdIVCwgQkFTRV9MRUdPX0NPTE9SLCBCQUNLR1JPVU5EX0xFR09fQ09MT1J9IGZyb20gJy4uL2NvbW1vbi9jb25zdC5qcyc7XHJcbmltcG9ydCB7bGVnb0Jhc2VDb2xvcn0gZnJvbSAnLi4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIENsYXNzIGZvciBDYW52YXMgR3JpZFxyXG4gKlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExlZ29HcmlkQ2FudmFzIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBzaG93Um93KSB7XHJcbiAgICAgICAgLy8gQmFzaWMgY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXNFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgLy8gU2l6ZSBvZiBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhc1JlY3QgPSB0aGlzLmNhbnZhc0VsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAvLyBJbmRpY2F0b3IgZm9yIHNob3dpbmcgdGhlIGZpcnN0IHJvdyB3aXRoIHBlZ3NcclxuICAgICAgICB0aGlzLnNob3dSb3cgPSBzaG93Um93O1xyXG4gICAgICAgIHRoaXMuY2FudmFzRWx0LndpZHRoID0gdGhpcy5jYW52YXNSZWN0LndpZHRoO1xyXG4gICAgICAgIC8vIEFjY29yZGluZyB0byBzaG93Um93LCB3ZSB3aWxsIHNob3cgbW9kaWZ5IHRoZSBoZWFkZXIgSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5oZWFkZXJIZWlnaHQgPSB0aGlzLnNob3dSb3cgPyBIRUFERVJfSEVJR0hUIDogMDtcclxuICAgICAgICB0aGlzLmNhbnZhc0VsdC5oZWlnaHQgPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGggKyB0aGlzLmhlYWRlckhlaWdodDtcclxuICAgICAgICAvLyBXZSBjYWxjdWxhdGUgdGhlIGNlbGxzaXplIGFjY29yZGluZyB0byB0aGUgc3BhY2UgdGFrZW4gYnkgdGhlIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKTtcclxuXHJcbiAgICAgICAgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgRmFicmljIEpTIGxpYnJhcnkgd2l0aCBvdXIgY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgZmFicmljLkNhbnZhcyhpZCwgeyBzZWxlY3Rpb246IGZhbHNlIH0pO1xyXG4gICAgICAgIC8vIE9iamVjdCB0aGF0IHJlcHJlc2VudCB0aGUgcGVncyBvbiB0aGUgZmlyc3Qgcm93XHJcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QgPSB7fTtcclxuICAgICAgICAvLyBUaGUgY3VycmVudCBkcmF3IG1vZGVsIChpbnN0cnVjdGlvbnMsIC4uLilcclxuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fSxcclxuICAgICAgICAvLyBGbGFnIHRvIGRldGVybWluZSBpZiB3ZSBoYXZlIHRvIGNyZWF0ZSBhIG5ldyBicmlja1xyXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3QnJpY2sgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBCQVNFX0xFR09fQ09MT1I7XHJcblxyXG4gICAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgY2FudmFzXHJcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xyXG5cclxuICAgICAgICAvLyBJZiB3ZSBzaG93IHRoZSByb3csIHdlIGhhdmUgdG8gcGx1ZyB0aGUgbW92ZSBtYW5hZ2VtZW50XHJcbiAgICAgICAgaWYgKHNob3dSb3cpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6c2VsZWN0ZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWcgPyBvcHRpb25zLnRhcmdldCA6IG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignc2VsZWN0aW9uOmNsZWFyZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6bW92aW5nJywgKG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwZWcgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWc7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBuZXdMZWZ0ID0gTWF0aC5yb3VuZChvcHRpb25zLnRhcmdldC5sZWZ0IC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1RvcCA9IE1hdGgucm91bmQoKG9wdGlvbnMudGFyZ2V0LnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0KSAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSArIHRoaXMuaGVhZGVySGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlIHRvcFxyXG4gICAgICAgICAgICAgICAgbGV0IHRvcENvbXB1dGUgPSBuZXdUb3AgKyAocGVnLnNpemUucm93ID09PSAyIHx8IHBlZy5hbmdsZSA+IDAgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxlZnRDb21wdXRlID0gbmV3TGVmdCArIChwZWcuc2l6ZS5jb2wgPT09IDIgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICAgICAgcGVnLm1vdmUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdCwgLy9sZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wIC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXZSBzcGVjaWZ5IHRoYXQgd2UgY291bGQgcmVtb3ZlIGEgcGVnIGlmIG9uZSBvZiBpdCdzIGVkZ2UgdG91Y2ggdGhlIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA8IEhFQURFUl9IRUlHSFRcclxuICAgICAgICAgICAgICAgICAgICB8fCBuZXdMZWZ0IDwgMFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IHRvcENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgfHwgbGVmdENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFbHNlIHdlIGNoZWNrIHdlIGNyZWF0ZSBhIG5ldyBwZWcgKHdoZW4gYSBwZWcgZW50ZXIgaW4gdGhlIGRyYXcgYXJlYSlcclxuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZy5yZXBsYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5jb2wgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5yb3cgPT09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmIChwZWcuYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZy5yZXBsYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdtb3VzZTp1cCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCcmlja1xyXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy50b1JlbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5yZXBsYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuYnJpY2tNb2RlbFt0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcuaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZSh0aGlzLmN1cnJlbnRCcmljayk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWV0aG9kIGZvciBjaGFuZ2luZyB0aGUgY29sb3Igb2YgdGhlIGZpcnN0IHJvd1xyXG4gICAgICovXHJcbiAgICBjaGFuZ2VDb2xvcihjb2xvcikge1xyXG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcclxuICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xyXG4gICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xyXG4gICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlcmlhbGl6ZSB0aGUgY2FudmFzIHRvIGEgbWluaW1hbCBvYmplY3QgdGhhdCBjb3VsZCBiZSB0cmVhdCBhZnRlclxyXG4gICAgICovXHJcbiAgICBleHBvcnQodXNlck5hbWUsIHVzZXJJZCkge1xyXG4gICAgICAgIGxldCByZXN1bHRBcnJheSA9IFtdO1xyXG4gICAgICAgIC8vIFdlIGZpbHRlciB0aGUgcm93IHBlZ3NcclxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuYnJpY2tNb2RlbClcclxuICAgICAgICAgICAgLmZpbHRlcigoa2V5KT0+a2V5ICE9IHRoaXMucm93U2VsZWN0LnNxdWFyZS5pZFxyXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5pZFxyXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnJlY3QuaWRcclxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdC5pZCk7XHJcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBlZ1RtcCA9IHRoaXMuYnJpY2tNb2RlbFtrZXldO1xyXG4gICAgICAgICAgICByZXN1bHRBcnJheS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHNpemU6IHBlZ1RtcC5zaXplLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IHBlZ1RtcC5jb2xvcixcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBwZWdUbXAuYW5nbGUsXHJcbiAgICAgICAgICAgICAgICB0b3A6IHBlZ1RtcC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHBlZ1RtcC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgY2VsbFNpemUgOiB0aGlzLmNlbGxTaXplXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHVzZXI6IHVzZXJOYW1lLFxyXG4gICAgICAgICAgICB1c2VySWQgOiB1c2VySWQsXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9uczogcmVzdWx0QXJyYXlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRHJhdyBmcm9tIGludHJ1Y3Rpb25zIGEgZHJhd1xyXG4gICAgICovXHJcbiAgICBkcmF3SW5zdHJ1Y3Rpb25zKGluc3RydWN0aW9uT2JqZWN0KXtcclxuICAgICAgICB0aGlzLnJlc2V0Qm9hcmQoKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIGluc3RydWN0aW9uT2JqZWN0Lmluc3RydWN0aW9ucy5mb3JFYWNoKChpbnN0cnVjdGlvbik9PntcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlQnJpY2soeyBzaXplIDogaW5zdHJ1Y3Rpb24uc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0IDogKGluc3RydWN0aW9uLmxlZnQgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IChpbnN0cnVjdGlvbi50b3AgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlIDogaW5zdHJ1Y3Rpb24uYW5nbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgOiBpbnN0cnVjdGlvbi5jb2xvclxyXG4gICAgICAgICAgICAgICAgfSkuY2FudmFzRWx0XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhbiB0aGUgYm9hcmQgYW5kIHRoZSBzdGF0ZSBvZiB0aGUgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHJlc2V0Qm9hcmQoKXtcclxuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlIGEgQmFzZTY0IGltYWdlIGZyb20gdGhlIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBzbmFwc2hvdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBQcml2YXRlcyBNZXRob2RzXHJcbiAgICAgKlxyXG4gICAgICovXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRHJhdyB0aGUgYmFzaWMgZ3JpZFxyXG4gICAgKi9cclxuICAgIF9kcmF3R3JpZChzaXplKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd1Jvdyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHRcclxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEsOTApLmNhbnZhc0VsdFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERyYXcgYWxsIHRoZSB3aGl0ZSBwZWcgb2YgdGhlIGdyaWRcclxuICAgICAqL1xyXG4gICAgX2RyYXdXaGl0ZVBlZyhzaXplKXtcclxuICAgICAgICAvLyBXZSBzdG9wIHJlbmRlcmluZyBvbiBlYWNoIGFkZCwgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXNcclxuICAgICAgICAvL3RoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IG1heCA9IE1hdGgucm91bmQoc2l6ZSAvIHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgIGxldCBtYXhTaXplID0gbWF4ICogdGhpcy5jZWxsU2l6ZTtcclxuICAgICAgICBmb3IgKHZhciByb3cgPTA7IHJvdyA8IG1heDsgcm93Kyspe1xyXG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtYXg7IGNvbCsrICl7XHJcbiAgICAgICAgICAgICAgICAgbGV0IHNxdWFyZVRtcCA9IG5ldyBmYWJyaWMuUmVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IEJBQ0tHUk9VTkRfTEVHT19DT0xPUixcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJlZFJvdGF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlID0gbmV3IENpcmNsZSh0aGlzLmNlbGxTaXplLCBCQUNLR1JPVU5EX0xFR09fQ09MT1IpO1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFkgOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGxldCBncm91cFRtcCA9IG5ldyBmYWJyaWMuR3JvdXAoW3NxdWFyZVRtcCwgY2lyY2xlLmNhbnZhc0VsdF0sIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLmNlbGxTaXplICogY29sLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5jZWxsU2l6ZSAqIHJvdyArIHRoaXMuaGVhZGVySGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tSb3RhdGlvbiA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFggOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFkgOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzQm9yZGVycyA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChncm91cFRtcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLyp0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XHJcbiAgICAgICAgLy8gV2UgdHJhbnNmb3JtIHRoZSBjYW52YXMgdG8gYSBiYXNlNjQgaW1hZ2UgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXMuXHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QmFja2dyb3VuZEltYWdlKHVybCx0aGlzLmNhbnZhcy5yZW5kZXJBbGwuYmluZCh0aGlzLmNhbnZhcyksIHtcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2xlZnQnLFxyXG4gICAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgfSk7ICAgKi9cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGhvcml6b250YWwgb3IgdmVydGljYWwgcmVjdGFuZ2xlXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVSZWN0KHNpemVSZWN0LCBhbmdsZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XHJcbiAgICAgICAgICAgICAgICBzaXplIDoge2NvbCA6IDIgKiBzaXplUmVjdCwgcm93IDoxICogc2l6ZVJlY3R9LFxyXG4gICAgICAgICAgICAgICAgbGVmdCA6IGFuZ2xlID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyA0KSAtIHRoaXMuY2VsbFNpemUpIDogKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggKiAzIC8gNCkgLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxyXG4gICAgICAgICAgICAgICAgdG9wIDogYW5nbGUgPyAxIDogMCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBzcXVhcmUgKDF4MSkgb3IgKDJ4MilcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZVNxdWFyZShzaXplU3F1YXJlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcclxuICAgICAgICAgICAgICAgIHNpemUgOiB7Y29sIDogMSAqIHNpemVTcXVhcmUsIHJvdyA6MSAqIHNpemVTcXVhcmV9LFxyXG4gICAgICAgICAgICAgICAgbGVmdDogc2l6ZVNxdWFyZSA9PT0gMiA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gMikgLSAoMiAqIHRoaXMuY2VsbFNpemUpKSA6ICh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxyXG4gICAgICAgICAgICAgICAgdG9wIDogc2l6ZVNxdWFyZSA9PT0gMiA/IDEgOiAwLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyaWMgbWV0aG9kIHRoYXQgY3JlYXRlIGEgcGVnXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVCcmljayhvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucy5jZWxsU2l6ZSA9IHRoaXMuY2VsbFNpemU7XHJcbiAgICAgICAgb3B0aW9ucy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgdGhpcy5sYXN0Q29sb3I7XHJcbiAgICAgICAgbGV0IHBlZyA9IG5ldyBQZWcob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5icmlja01vZGVsW3BlZy5pZF0gPSBwZWc7XHJcbiAgICAgICAgLy8gV2UgaGF2ZSB0byB1cGRhdGUgdGhlIHJvd1NlbGVjdCBPYmplY3QgdG8gYmUgYWxzd2F5IHVwZGF0ZVxyXG4gICAgICAgIGlmIChvcHRpb25zLnNpemUucm93ID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZSA9IHBlZztcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYW5nbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QgPSBwZWc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNpemUuY29sID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QgPSBwZWc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlID0gcGVnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGVnO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgdGhlIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBfZHJhd0NhbnZhcygpIHtcclxuICAgICAgICB0aGlzLl9kcmF3V2hpdGVQZWcodGhpcy5jYW52YXNSZWN0LndpZHRoKTtcclxuICAgICAgICB0aGlzLl9kcmF3R3JpZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGgsIE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpKTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG4vLyBOdW1iZXIgb2YgY2VsbCBvbiB0aGUgZ3JpZFxyXG5leHBvcnQgY29uc3QgTkJfQ0VMTFMgPSAxNTtcclxuXHJcbi8vIEhlaWdodCBvZiB0aGUgaGVhZGVyXHJcbmV4cG9ydCBjb25zdCBIRUFERVJfSEVJR0hUID0gd2luZG93LnNjcmVlbi53aWR0aCA8PSA3NjggID8gNjAgOiAxMDA7XHJcblxyXG4vLyBGaXJzdCBjb2xvciB0byB1c2VcclxuZXhwb3J0IGNvbnN0IEJBU0VfTEVHT19DT0xPUiA9IFwiIzBkNjlmMlwiO1xyXG5cclxuLy8gTWVkaXVtIFN0b25lIEdyZXkgXHJcbmNvbnN0IENPTE9SXzE5NCA9IFwiI2EzYTJhNFwiO1xyXG5cclxuLy8gTGlnaHQgU3RvbmUgR3JleVxyXG5jb25zdCBDT0xPUl8yMDggPSBcIiNlNWU0ZGVcIjsgXHJcblxyXG4vLyBCYWNrZ3JvdW5kIGNvbG9yIHVzZWRcclxuZXhwb3J0IGNvbnN0IEJBQ0tHUk9VTkRfTEVHT19DT0xPUiA9IENPTE9SXzIwODsiLCIndXNlIHN0cmljdCdcclxuXHJcbi8qXHJcbiogQ29sb3JzIGZyb20gXHJcbiogaHR0cDovL2xlZ28ud2lraWEuY29tL3dpa2kvQ29sb3VyX1BhbGV0dGUgXHJcbiogQW5kIGh0dHA6Ly93d3cucGVlcm9uLmNvbS9jZ2ktYmluL2ludmNnaXMvY29sb3JndWlkZS5jZ2lcclxuKiBPbmx5IFNob3cgdGhlIGNvbG9yIHVzZSBzaW5jZSAyMDEwXHJcbioqLyBcclxuZXhwb3J0IGNvbnN0IExFR09fQ09MT1JTID0gW1xyXG4gICAgJ3JnYigyNDUsIDIwNSwgNDcpJywgLy8yNCwgQnJpZ2h0IFllbGxvdyAqXHJcbiAgICAncmdiKDI1MywgMjM0LCAxNDApJywgLy8yMjYsIENvb2wgWWVsbG93ICpcclxuICAgICdyZ2IoMjE4LCAxMzMsIDY0KScsIC8vMTA2LCBCcmlnaHQgT3JhbmdlICpcclxuICAgICdyZ2IoMjMyLCAxNzEsIDQ1KScsIC8vMTkxLCBGbGFtZSBZZWxsb3dpc2ggT3JhbmdlICpcclxuICAgICdyZ2IoMTk2LCA0MCwgMjcpJywgLy8yMSwgQnJpZ2h0IFJlZCAqXHJcbiAgICAncmdiKDEyMywgNDYsIDQ3KScsIC8vMTU0LCBEYXJrIFJlZCAqXHJcbiAgICAncmdiKDIwNSwgOTgsIDE1MiknLCAvLzIyMSwgQnJpZ2h0IFB1cnBsZSAqXHJcbiAgICAncmdiKDIyOCwgMTczLCAyMDApJywgLy8yMjIsIExpZ2h0IFB1cnBsZSAqXHJcbiAgICAncmdiKDE0NiwgNTcsIDEyMCknLCAvLzEyNCwgQnJpZ2h0IFJlZGRpc2ggVmlvbGV0ICpcclxuICAgICdyZ2IoNTIsIDQzLCAxMTcpJywgLy8yNjgsIE1lZGl1bSBMaWxhYyAqXHJcbiAgICAncmdiKDEzLCAxMDUsIDI0MiknLCAvLzIzLCBCcmlnaHQgQmx1ZSAqXHJcbiAgICAncmdiKDE1OSwgMTk1LCAyMzMpJywgLy8yMTIsIExpZ2h0IFJveWFsIEJsdWUgKlxyXG4gICAgJ3JnYigxMTAsIDE1MywgMjAxKScsIC8vMTAyLCBNZWRpdW0gQmx1ZSAqXHJcbiAgICAncmdiKDMyLCA1OCwgODYpJywgLy8xNDAsIEVhcnRoIEJsdWUgKlxyXG4gICAgJ3JnYigxMTYsIDEzNCwgMTU2KScsIC8vMTM1LCBTYW5kIEJsdWUgKlxyXG4gICAgJ3JnYig0MCwgMTI3LCA3MCknLCAvLzI4LCBEYXJrIEdyZWVuICpcclxuICAgICdyZ2IoNzUsIDE1MSwgNzQpJywgLy8zNywgQmlyZ2h0IEdyZWVuICpcclxuICAgICdyZ2IoMTIwLCAxNDQsIDEyOSknLCAvLzE1MSwgU2FuZCBHcmVlbiAqXHJcbiAgICAncmdiKDM5LCA3MCwgNDQpJywgLy8xNDEsIEVhcnRoIEdyZWVuICpcclxuICAgICdyZ2IoMTY0LCAxODksIDcwKScsIC8vMTE5LCBCcmlnaHQgWWVsbG93aXNoLUdyZWVuICogXHJcbiAgICAncmdiKDEwNSwgNjQsIDM5KScsIC8vMTkyLCBSZWRkaXNoIEJyb3duICpcclxuICAgICdyZ2IoMjE1LCAxOTcsIDE1MyknLCAvLzUsIEJyaWNrIFllbGxvdyAqIFxyXG4gICAgJ3JnYigxNDksIDEzOCwgMTE1KScsIC8vMTM4LCBTYW5kIFllbGxvdyAqXHJcbiAgICAncmdiKDE3MCwgMTI1LCA4NSknLCAvLzMxMiwgTWVkaXVtIE5vdWdhdCAqICAgIFxyXG4gICAgJ3JnYig0OCwgMTUsIDYpJywgLy8zMDgsIERhcmsgQnJvd24gKlxyXG4gICAgJ3JnYigyMDQsIDE0MiwgMTA0KScsIC8vMTgsIE5vdWdhdCAqXHJcbiAgICAncmdiKDI0NSwgMTkzLCAxMzcpJywgLy8yODMsIExpZ2h0IE5vdWdhdCAqXHJcbiAgICAncmdiKDE2MCwgOTUsIDUyKScsIC8vMzgsIERhcmsgT3JhbmdlICpcclxuICAgICdyZ2IoMjQyLCAyNDMsIDI0MiknLCAvLzEsIFdoaXRlICpcclxuICAgICdyZ2IoMjI5LCAyMjgsIDIyMiknLCAvLzIwOCwgTGlnaHQgU3RvbmUgR3JleSAqXHJcbiAgICAncmdiKDE2MywgMTYyLCAxNjQpJywgLy8xOTQsIE1lZGl1bSBTdG9uZSBHcmV5ICpcclxuICAgICdyZ2IoOTksIDk1LCA5NyknLCAvLzE5OSwgRGFyayBTdG9uZSBHcmV5ICpcclxuICAgICdyZ2IoMjcsIDQyLCA1MiknLCAvLzI2LCBCbGFjayAqICAgICAgICBcclxuXTsiLCIndXNlIHN0cmljdCdcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIGEgdmFyaWF0aW9uIG9mIGNvbG9yXHJcbiAqIFxyXG4gKiBGcm9tIDogaHR0cHM6Ly93d3cuc2l0ZXBvaW50LmNvbS9qYXZhc2NyaXB0LWdlbmVyYXRlLWxpZ2h0ZXItZGFya2VyLWNvbG9yL1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIENvbG9yTHVtaW5hbmNlKGhleCwgbHVtKSB7XHJcblxyXG4gICAgICAgIC8vIHZhbGlkYXRlIGhleCBzdHJpbmdcclxuICAgICAgICBoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcclxuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcclxuICAgICAgICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsdW0gPSBsdW0gfHwgMDtcclxuXHJcbiAgICAgICAgLy8gY29udmVydCB0byBkZWNpbWFsIGFuZCBjaGFuZ2UgbHVtaW5vc2l0eVxyXG4gICAgICAgIHZhciByZ2IgPSBcIiNcIiwgYywgaTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICBjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICByZ2IgKz0gKFwiMDBcIiArIGMpLnN1YnN0cihjLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmdiO1xyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7Q29sb3JMdW1pbmFuY2V9IGZyb20gJy4uL2NvbW1vbi91dGlsLmpzJztcclxuXHJcbi8qKlxyXG4gKiBDaXJjbGUgTGVnbyBjbGFzc1xyXG4gKiBUaGUgY2lyY2xlIGlzIGNvbXBvc2VkIG9mIDIgY2lyY2xlIChvbiB0aGUgc2hhZG93LCBhbmQgdGhlIG90aGVyIG9uZSBmb3IgdGhlIHRvcClcclxuICogXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2lyY2xle1xyXG4gICAgY29uc3RydWN0b3IoY2VsbFNpemUsIGNvbG9yKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xyXG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNSxcclxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpLFxyXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiMHB4IDJweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHggPSBuZXcgZmFicmljLkNpcmNsZSh7XHJcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA0LFxyXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSxcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBmYWJyaWMuVGV4dCgnR0RHJywge1xyXG4gICAgICAgICAgICBmb250U2l6ZTogY2VsbFNpemUgLyA1LFxyXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxyXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIHN0cm9rZTogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKSxcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoW3RoaXMuY2lyY2xlQmFzaWNFdHgsIHRoaXMuY2lyY2xlQmFzaWMsIHRoaXMudGV4dF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBGYWJyaWNKUyBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIGdldCBjYW52YXNFbHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBjaXJjbGVcclxuICAgICAqL1xyXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xyXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMuc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpKTtcclxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4LnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpKTtcclxuICAgICAgICB0aGlzLnRleHQuc2V0KHtcclxuICAgICAgICAgICAgZmlsbCA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXHJcbiAgICAgICAgICAgIHN0cm9rZSA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi9jaXJjbGUuanMnO1xyXG5cclxuLyoqXHJcbiAqIFBlZyBMZWdvIGNsYXNzXHJcbiAqIFRoZSBwZWcgaXMgY29tcG9zZWQgb2YgbiBjaXJjbGUgZm9yIGEgZGltZW5zaW9uIHRoYXQgZGVwZW5kIG9uIHRoZSBzaXplIHBhcmFtZXRlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBlZ3tcclxuICAgIGNvbnN0cnVjdG9yKHtzaXplID0ge2NvbCA6IDEsIHJvdyA6IDF9LCBjZWxsU2l6ZSA9IDAsIGNvbG9yID0gJyNGRkYnLCBsZWZ0ID0gMCwgdG9wID0gMCwgYW5nbGUgPSAwfSl7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLmlkID0gYFBlZyR7c2l6ZX0tJHtEYXRlLm5vdygpfWA7XHJcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRvUmVtb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlIHx8IDA7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheSA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZWN0QmFzaWMgPSBuZXcgZmFicmljLlJlY3Qoe1xyXG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUgKiBzaXplLmNvbCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZSAqIHNpemUucm93LFxyXG4gICAgICAgICAgICBmaWxsOiBjb2xvcixcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBjZW50ZXJlZFJvdGF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXHJcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiNXB4IDVweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgYXJyYXlFbHRzID0gW3RoaXMucmVjdEJhc2ljXTtcclxuICAgICAgICBsZXQgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTsgICAgICAgXHJcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHRoZSBzaXplLCB3ZSBkb24ndCBwbGFjZSB0aGUgY2lyY2xlcyBhdCB0aGUgc2FtZSBwbGFjZVxyXG4gICAgICAgIGlmIChzaXplLmNvbCA9PT0gMil7XHJcbiAgICAgICAgICAgIC8vIEZvciBhIHJlY3RhbmdsZSBvciBhIGJpZyBTcXVhcmVcclxuICAgICAgICAgICAgLy8gV2UgdXBkYXRlIHRoZSByb3cgcG9zaXRpb25zXHJcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcclxuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxyXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XHJcblxyXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXHJcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDUsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT5hcnJheUVsdHMucHVzaChjaXJjbGUuY2FudmFzRWx0KSk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBwZWcgaXMgbG9ja2VkIGluIGFsbCBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKGFycmF5RWx0cywge1xyXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXHJcbiAgICAgICAgICAgIHRvcDogdGhpcy50b3AsXHJcbiAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxyXG4gICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxyXG4gICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBXZSBhZGQgdG8gRmFicmljRWxlbWVudCBhIHJlZmVyZW5jZSB0byB0aGUgY3VyZW50IHBlZ1xyXG4gICAgICAgIHRoaXMuZ3JvdXAucGFyZW50UGVnID0gdGhpczsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoZSBGYWJyaWNKUyBlbGVtZW50XHJcbiAgICBnZXQgY2FudmFzRWx0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgcmVwbGFjZWRcclxuICAgIGdldCByZXBsYWNlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXBsYWNlXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0dGVyIGZvciBpc1JlcGxhY2UgcGFyYW1cclxuICAgIHNldCByZXBsYWNlKHJlcGxhY2Upe1xyXG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gcmVwbGFjZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBwZWdcclxuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5yZWN0QmFzaWMuc2V0KCdmaWxsJywgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+IGNpcmNsZS5jaGFuZ2VDb2xvcihjb2xvcikpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW92ZSB0aGUgcGVnIHRvIGRlc2lyZSBwb3NpdGlvblxyXG4gICAgbW92ZShsZWZ0LCB0b3Ape1xyXG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xyXG4gICAgICAgICAgICB0b3A6IHRvcCxcclxuICAgICAgICAgICAgbGVmdCA6IGxlZnRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSb3RhdGUgdGhlIHBlZyB0byB0aGUgZGVzaXJlIGFuZ2xlXHJcbiAgICByb3RhdGUoYW5nbGUpe1xyXG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XHJcbiAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iXX0=
