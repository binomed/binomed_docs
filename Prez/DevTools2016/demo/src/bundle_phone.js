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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfcGhvbmUuanMiLCJzcmMvc2NyaXB0cy9jYW52YXMvbGVnb0NhbnZhcy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9jb25zdC5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9sZWdvQ29sb3JzLmpzIiwic3JjL3NjcmlwdHMvY29tbW9uL3V0aWwuanMiLCJzcmMvc2NyaXB0cy9sZWdvX3NoYXBlL2NpcmNsZS5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvcGVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0EsQ0FBQyxZQUFZOztBQUVULFFBQUksV0FBVyxLQUFmO0FBQUEsUUFBcUI7QUFDakIsaUJBQWEsSUFEakI7QUFBQSxRQUN1QjtBQUNuQixXQUFPLElBRlg7QUFBQSxRQUVpQjtBQUNiLGlCQUFhLElBSGpCO0FBQUEsUUFHdUI7QUFDbkIsWUFBUSxDQUpaOztBQU9BLGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIscUJBQWEsK0JBQW1CLFlBQW5CLEVBQWlDLElBQWpDLENBQWI7O0FBRUEsVUFBRSxnQkFBRixFQUFvQixRQUFwQixDQUE2QjtBQUN6Qiw2QkFBaUIsSUFEUTtBQUV6Qix5QkFBYSxJQUZZO0FBR3pCLHlDQUh5QjtBQUl6Qiw0Q0FKeUI7QUFLekIsb0JBQVEsZ0JBQVUsS0FBVixFQUFpQjtBQUNyQiwyQkFBVyxXQUFYLENBQXVCLE1BQU0sV0FBTixFQUF2QjtBQUNIO0FBUHdCLFNBQTdCO0FBU0g7O0FBRUQsYUFBUyxRQUFULEdBQW9COztBQUdoQjs7O0FBR0EsWUFBTSxXQUFXLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUFqQjtBQUNBLFlBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBaEI7O0FBRUEsWUFBTSxjQUFjLEdBQUcsVUFBSCxDQUNmLFNBRGUsQ0FDTCxRQURLLEVBQ0ssT0FETCxFQUVmLEdBRmUsQ0FFWDtBQUFBLG1CQUFNLE9BQU47QUFBQSxTQUZXLENBQXBCOztBQUlBLFlBQU0sYUFBYSxHQUFHLFVBQUgsQ0FDZCxTQURjLENBQ0osT0FESSxFQUNLLE9BREwsRUFFZCxHQUZjLENBRVY7QUFBQSxtQkFBTSxNQUFOO0FBQUEsU0FGVSxDQUFuQjs7QUFJQSxvQkFBWSxLQUFaLENBQWtCLFVBQWxCLEVBQ0ssU0FETCxDQUNlLFVBQUMsS0FBRCxFQUFXO0FBQ2xCLGdCQUFJLFVBQVUsT0FBZCxFQUF1QjtBQUNuQix5QkFBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLFlBQXJDLENBQWtELFFBQWxELEVBQTRELEVBQTVEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxlQUFoQyxDQUFnRCxRQUFoRDtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsZUFBekMsQ0FBeUQsUUFBekQ7QUFDQSx5QkFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLGVBQWhDLENBQWdELFFBQWhEO0FBQ0Esb0JBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCw2QkFBUyxjQUFULENBQXdCLFNBQXhCLEVBQW1DLGVBQW5DLENBQW1ELFFBQW5EO0FBQ0E7QUFDQSwrQkFBVyxZQUFZO0FBQ2YsbUNBQVcsSUFBWDtBQUNBO0FBQ0osaUNBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQyxZQUFuQyxDQUFnRCxRQUFoRCxFQUEwRCxFQUExRDtBQUNILHFCQUpELEVBSUcsRUFKSDtBQUtIO0FBQ0osYUFkRCxNQWNPLElBQUksVUFBVSxNQUFkLEVBQXNCO0FBQ3pCLHlCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsZUFBckMsQ0FBcUQsUUFBckQ7QUFDQSx5QkFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLFlBQWhDLENBQTZDLFFBQTdDLEVBQXVELEVBQXZEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixlQUF4QixFQUF5QyxZQUF6QyxDQUFzRCxRQUF0RCxFQUFnRSxFQUFoRTtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBaEMsQ0FBNkMsUUFBN0MsRUFBdUQsRUFBdkQ7QUFDSDtBQUNKLFNBdEJMOztBQXlCQTs7OztBQUlBLGlCQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsZ0JBQXpDLENBQTBELE9BQTFELEVBQW1FLFlBQU07QUFDckUsZ0JBQU0sT0FBTztBQUNULHNCQUFPLFdBREU7QUFFVCxvQkFBSztBQUZJLGFBQWI7QUFJQSxnQkFBTSxZQUFZLFdBQVcsTUFBWCxDQUFrQixLQUFLLElBQXZCLEVBQTZCLEtBQUssRUFBbEMsQ0FBbEI7QUFDQSxzQkFBVSxPQUFWLEdBQW9CLFdBQVcsUUFBWCxFQUFwQjtBQUNBLG9CQUFRLElBQVIsQ0FBYSxjQUFiLEVBQTZCLFNBQTdCO0FBQ0EsZ0JBQU0sc0NBQW9DLEtBQUssRUFBL0M7QUFDQSxrQkFBTSxHQUFOLEVBQVc7QUFDSyx3QkFBUSxNQURiO0FBRUsseUJBQVMsSUFBSSxPQUFKLENBQVk7QUFDakIsb0NBQWdCO0FBREMsaUJBQVosQ0FGZDtBQUtLLHNCQUFNLEtBQUssU0FBTCxDQUFlLFNBQWY7QUFMWCxhQUFYLEVBT0MsSUFQRCxDQU9NLFVBQVMsUUFBVCxFQUFtQjtBQUNyQix3QkFBUSxJQUFSLENBQWEsUUFBYjtBQUNILGFBVEQ7QUFVQSx1QkFBVyxVQUFYO0FBQ0gsU0FwQkQ7O0FBc0JBOzs7O0FBSUEsWUFBTSxXQUFXLFNBQVMsY0FBVCxDQUF3QixXQUF4QixDQUFqQjtBQUNBLFlBQU0sZ0JBQWdCLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FBdEI7O0FBR0EsWUFBTSxhQUFhLEdBQUcsVUFBSCxDQUNkLFNBRGMsQ0FDSixRQURJLEVBQ00sT0FETixFQUVkLEdBRmMsQ0FFVjtBQUFBLG1CQUFNLE1BQU47QUFBQSxTQUZVLENBQW5COztBQUlBLFlBQU0sa0JBQWtCLEdBQUcsVUFBSCxDQUNuQixTQURtQixDQUNULGFBRFMsRUFDTSxPQUROLEVBRW5CLEdBRm1CLENBRWY7QUFBQSxtQkFBTSxXQUFOO0FBQUEsU0FGZSxDQUF4Qjs7QUFJQSxtQkFBVyxLQUFYLENBQWlCLGVBQWpCLEVBQ0ssU0FETCxDQUNlLFVBQUMsS0FBRCxFQUFXO0FBQ2xCLGdCQUFJLFVBQVUsTUFBZCxFQUFxQjtBQUNqQix5QkFBUyxhQUFULENBQXVCLGVBQXZCLEVBQXdDLGVBQXhDLENBQXdELFFBQXhEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxZQUFyQyxDQUFrRCxRQUFsRCxFQUE0RCxFQUE1RDtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsWUFBckMsQ0FBa0QsUUFBbEQsRUFBNEQsRUFBNUQ7QUFDQSx5QkFBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxlQUExQyxDQUEwRCxRQUExRDtBQUNBLHlCQUFTLGFBQVQsQ0FBdUIscUJBQXZCLEVBQThDLFNBQTlDLENBQXdELE1BQXhELENBQStELFlBQS9EO0FBQ0EseUJBQVMsYUFBVCxDQUF1Qix5QkFBdkIsRUFBa0QsU0FBbEQsQ0FBNEQsTUFBNUQsQ0FBbUUsWUFBbkU7QUFFSCxhQVJELE1BUU0sSUFBSSxVQUFVLFdBQWQsRUFBMEI7QUFDNUIseUJBQVMsYUFBVCxDQUF1QixlQUF2QixFQUF3QyxZQUF4QyxDQUFxRCxRQUFyRCxFQUErRCxFQUEvRDtBQUNBLHlCQUFTLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsZUFBckMsQ0FBcUQsUUFBckQ7QUFDQSx5QkFBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLGVBQXJDLENBQXFELFFBQXJEO0FBQ0EseUJBQVMsY0FBVCxDQUF3QixnQkFBeEIsRUFBMEMsWUFBMUMsQ0FBdUQsUUFBdkQsRUFBaUUsRUFBakU7QUFDQSx5QkFBUyxhQUFULENBQXVCLHFCQUF2QixFQUE4QyxTQUE5QyxDQUF3RCxNQUF4RCxDQUErRCxZQUEvRDtBQUNBLHlCQUFTLGFBQVQsQ0FBdUIseUJBQXZCLEVBQWtELFNBQWxELENBQTRELE1BQTVELENBQW1FLFlBQW5FOztBQUVBLG9CQUFNLE9BQU87QUFDVCwwQkFBTyxXQURFO0FBRVQsd0JBQUs7QUFGSSxpQkFBYjtBQUlBLG9CQUFNLFNBQVMsRUFBRSxRQUFRLEtBQVYsRUFBZjtBQUNBLG9CQUFNLHNDQUFvQyxLQUFLLEVBQS9DO0FBQ0Esc0JBQU0sR0FBTixFQUFXLE1BQVgsRUFDQyxJQURELENBQ00sVUFBUyxRQUFULEVBQW1CO0FBQ3JCLDJCQUFPLFNBQVMsSUFBVCxFQUFQO0FBQ0gsaUJBSEQsRUFJQyxJQUpELENBSU0sVUFBUyxRQUFULEVBQWtCO0FBQ3BCLHdCQUFJLFFBQUosRUFBYztBQUNWLGdDQUFRLEdBQVIsQ0FBWSxRQUFaO0FBQ0EscUNBQWEsUUFBYjtBQUNBLCtCQUFPLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBUDtBQUNBLGdDQUFRLENBQVI7QUFDQTtBQUNILHFCQU5ELE1BTU87QUFDSCxnQ0FBUSxHQUFSLENBQVksV0FBWjtBQUNIO0FBQ0osaUJBZEQ7QUFlSDtBQUNKLFNBeENMOztBQTJDQTs7OztBQUlBLFlBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBaEI7QUFDQSxZQUFNLFdBQVcsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQWpCOztBQUVBLFlBQU0sZ0JBQWdCLEdBQUcsVUFBSCxDQUNqQixTQURpQixDQUNQLE9BRE8sRUFDQyxPQURELEVBQ1M7QUFBQSxtQkFBSSxRQUFRLEtBQUssR0FBTCxDQUFTLFFBQVEsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBWjtBQUFBLFNBRFQsQ0FBdEI7QUFFQSxZQUFNLGlCQUFrQixHQUFHLFVBQUgsQ0FDbkIsU0FEbUIsQ0FDVCxRQURTLEVBQ0MsT0FERCxFQUNTO0FBQUEsbUJBQUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxRQUFRLENBQWpCLEVBQW9CLEtBQUssTUFBTCxHQUFjLENBQWxDLENBQVo7QUFBQSxTQURULENBQXhCOztBQUdELHNCQUFjLEtBQWQsQ0FBb0IsY0FBcEIsRUFBb0MsU0FBcEMsQ0FBOEMsSUFBOUM7QUFHRjs7QUFFRDs7O0FBR0EsYUFBUyxJQUFULEdBQWdCO0FBQ1osWUFBSSxPQUFPLFdBQVcsS0FBSyxLQUFMLENBQVgsQ0FBWDtBQUNBLFlBQUksZ0JBQWdCLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFwQjtBQUNBLHNCQUFjLEdBQWQsR0FBb0IsS0FBSyxPQUF6QjtBQUNBLFlBQUksS0FBSyxRQUFMLElBQWlCLENBQUMsY0FBYyxTQUFkLENBQXdCLFFBQXhCLENBQWlDLFVBQWpDLENBQXRCLEVBQW9FO0FBQ2hFLDBCQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsVUFBNUI7QUFDSCxTQUZELE1BRU87QUFDSCwwQkFBYyxTQUFkLENBQXdCLE1BQXhCLENBQStCLFVBQS9CO0FBQ0g7QUFFSjs7QUFHRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDOztBQUVBOzs7Ozs7O0FBUUgsQ0FsTUQ7OztBQ05BOzs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOzs7OztJQUthLGMsV0FBQSxjO0FBQ1QsNEJBQVksRUFBWixFQUFnQixPQUFoQixFQUF5QjtBQUFBOztBQUFBOztBQUNyQjtBQUNBLGFBQUssU0FBTCxHQUFpQixTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsQ0FBakI7QUFDQTtBQUNBLGFBQUssVUFBTCxHQUFrQixLQUFLLFNBQUwsQ0FBZSxxQkFBZixFQUFsQjtBQUNBO0FBQ0EsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssU0FBTCxDQUFlLEtBQWYsR0FBdUIsS0FBSyxVQUFMLENBQWdCLEtBQXZDO0FBQ0E7QUFDQSxhQUFLLFlBQUwsR0FBb0IsS0FBSyxPQUFMLDBCQUErQixDQUFuRDtBQUNBLGFBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsS0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBQXdCLEtBQUssWUFBckQ7QUFDQTtBQUNBLGFBQUssUUFBTCxHQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsa0JBQVgsQ0FBaEI7O0FBRUE7QUFDQSxhQUFLLE1BQUwsR0FBYyxJQUFJLE9BQU8sTUFBWCxDQUFrQixFQUFsQixFQUFzQixFQUFFLFdBQVcsS0FBYixFQUF0QixDQUFkO0FBQ0E7QUFDQSxhQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQTtBQUNBLGFBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLEtBRnRCO0FBR0EsYUFBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsYUFBSyxTQUFMOztBQUVBO0FBQ0EsYUFBSyxXQUFMOztBQUVBO0FBQ0EsWUFBSSxPQUFKLEVBQWE7O0FBRVQsaUJBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxpQkFBZixFQUFrQyxVQUFDLE9BQUQ7QUFBQSx1QkFBYSxNQUFLLFlBQUwsR0FBb0IsUUFBUSxNQUFSLENBQWUsU0FBZixHQUEyQixRQUFRLE1BQW5DLEdBQTRDLElBQTdFO0FBQUEsYUFBbEM7QUFDQSxpQkFBSyxNQUFMLENBQVksRUFBWixDQUFlLG1CQUFmLEVBQW9DLFVBQUMsT0FBRDtBQUFBLHVCQUFhLE1BQUssWUFBTCxHQUFvQixJQUFqQztBQUFBLGFBQXBDOztBQUVBLGlCQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsZUFBZixFQUFnQyxVQUFDLE9BQUQsRUFBYTtBQUN6QyxvQkFBSSxNQUFNLFFBQVEsTUFBUixDQUFlLFNBQXpCOztBQUdBLG9CQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsUUFBUSxNQUFSLENBQWUsSUFBZixHQUFzQixNQUFLLFFBQXRDLElBQWtELE1BQUssUUFBckU7QUFDQSxvQkFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLENBQUMsUUFBUSxNQUFSLENBQWUsR0FBZixHQUFxQixNQUFLLFlBQTNCLElBQTJDLE1BQUssUUFBM0QsSUFBdUUsTUFBSyxRQUE1RSxHQUF1RixNQUFLLFlBQXpHO0FBQ0E7QUFDQSxvQkFBSSxhQUFhLFVBQVUsSUFBSSxJQUFKLENBQVMsR0FBVCxLQUFpQixDQUFqQixJQUFzQixJQUFJLEtBQUosR0FBWSxDQUFsQyxHQUFzQyxNQUFLLFFBQUwsR0FBZ0IsQ0FBdEQsR0FBMEQsTUFBSyxRQUF6RSxDQUFqQjtBQUNBLG9CQUFJLGNBQWMsV0FBVyxJQUFJLElBQUosQ0FBUyxHQUFULEtBQWlCLENBQWpCLEdBQXFCLE1BQUssUUFBTCxHQUFnQixDQUFyQyxHQUF5QyxNQUFLLFFBQXpELENBQWxCO0FBQ0Esb0JBQUksSUFBSixDQUNJLE9BREosRUFDYTtBQUNULHNCQUZKLENBRVc7QUFGWDs7QUFLQTtBQUNBLG9CQUFJLGlDQUNHLFVBQVUsQ0FEYixJQUVHLGNBQWMsTUFBSyxTQUFMLENBQWUsTUFGaEMsSUFHRyxlQUFlLE1BQUssU0FBTCxDQUFlLEtBSHJDLEVBRzRDO0FBQ3hDLHdCQUFJLFFBQUosR0FBZSxJQUFmO0FBQ0gsaUJBTEQsTUFLTztBQUNIO0FBQ0Esd0JBQUksUUFBSixHQUFlLEtBQWY7QUFDQSx3QkFBSSxDQUFDLElBQUksT0FBVCxFQUFrQjtBQUNkLDRCQUFJLElBQUksSUFBSixDQUFTLEdBQVQsS0FBaUIsQ0FBckIsRUFBd0I7QUFDcEIsZ0NBQUksSUFBSSxJQUFKLENBQVMsR0FBVCxLQUFpQixDQUFyQixFQUF1QjtBQUNuQixzQ0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixNQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0IsU0FBdEM7QUFDSCw2QkFGRCxNQUVNLElBQUksSUFBSSxLQUFKLEtBQWMsQ0FBbEIsRUFBb0I7QUFDdEIsc0NBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsTUFBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLFNBQXBDO0FBQ0gsNkJBRkssTUFFRDtBQUNELHNDQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE1BQUssV0FBTCxDQUFpQixDQUFqQixFQUFtQixFQUFuQixFQUF1QixTQUF2QztBQUNIO0FBQ0oseUJBUkQsTUFRTztBQUNILGtDQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE1BQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixTQUF0QztBQUNIO0FBQ0QsNEJBQUksT0FBSixHQUFjLElBQWQ7QUFDSDtBQUNKO0FBRUosYUF2Q0Q7O0FBeUNBLGlCQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsVUFBZixFQUEyQixZQUFNO0FBQzdCLG9CQUFJLE1BQUssWUFBTCxJQUNHLE1BQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixRQUQvQixJQUVHLE1BQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixPQUZuQyxFQUU0QztBQUN4QywyQkFBTyxNQUFLLFVBQUwsQ0FBZ0IsTUFBSyxZQUFMLENBQWtCLFNBQWxCLENBQTRCLEVBQTVDLENBQVA7QUFDQSwwQkFBSyxNQUFMLENBQVksTUFBWixDQUFtQixNQUFLLFlBQXhCO0FBQ0EsMEJBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNIO0FBQ0osYUFSRDtBQVVIO0FBQ0o7O0FBRUQ7Ozs7Ozs7b0NBR1ksSyxFQUFPO0FBQ2YsaUJBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFdBQXRCLENBQWtDLEtBQWxDO0FBQ0EsaUJBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsV0FBekIsQ0FBcUMsS0FBckM7QUFDQSxpQkFBSyxTQUFMLENBQWUsSUFBZixDQUFvQixXQUFwQixDQUFnQyxLQUFoQztBQUNBLGlCQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLFdBQXhCLENBQW9DLEtBQXBDO0FBQ0EsaUJBQUssTUFBTCxDQUFZLFNBQVo7QUFDSDs7QUFFRDs7Ozs7O2dDQUdPLFEsRUFBVSxNLEVBQVE7QUFBQTs7QUFDckIsZ0JBQUksY0FBYyxFQUFsQjtBQUNBO0FBQ0EsZ0JBQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxLQUFLLFVBQWpCLEVBQ04sTUFETSxDQUNDLFVBQUMsR0FBRDtBQUFBLHVCQUFPLE9BQU8sT0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixFQUE3QixJQUNSLE9BQU8sT0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixFQUR4QixJQUVSLE9BQU8sT0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixFQUZuQixJQUdSLE9BQU8sT0FBSyxTQUFMLENBQWUsUUFBZixDQUF3QixFQUg5QjtBQUFBLGFBREQsQ0FBWDtBQUtBLGlCQUFLLE9BQUwsQ0FBYSxVQUFDLEdBQUQsRUFBUztBQUNsQixvQkFBSSxTQUFTLE9BQUssVUFBTCxDQUFnQixHQUFoQixDQUFiO0FBQ0EsNEJBQVksSUFBWixDQUFpQjtBQUNiLDBCQUFNLE9BQU8sSUFEQTtBQUViLDJCQUFPLE9BQU8sS0FGRDtBQUdiLDJCQUFPLE9BQU8sS0FIRDtBQUliLHlCQUFLLE9BQU8sR0FBUCxHQUFhLE9BQUssWUFKVjtBQUtiLDBCQUFNLE9BQU8sSUFMQTtBQU1iLDhCQUFXLE9BQUs7QUFOSCxpQkFBakI7QUFRSCxhQVZEO0FBV0EsbUJBQU87QUFDSCxzQkFBTSxRQURIO0FBRUgsd0JBQVMsTUFGTjtBQUdILDhCQUFjO0FBSFgsYUFBUDtBQUtIOztBQUVEOzs7Ozs7eUNBR2lCLGlCLEVBQWtCO0FBQUE7O0FBQy9CLGlCQUFLLFVBQUw7QUFDQSxpQkFBSyxNQUFMLENBQVksaUJBQVosR0FBZ0MsS0FBaEM7QUFDQSw4QkFBa0IsWUFBbEIsQ0FBK0IsT0FBL0IsQ0FBdUMsVUFBQyxXQUFELEVBQWU7QUFDbEQsdUJBQUssTUFBTCxDQUFZLEdBQVosQ0FDSSxPQUFLLFlBQUwsQ0FBa0IsRUFBRSxNQUFPLFlBQVksSUFBckI7QUFDZCwwQkFBUSxZQUFZLElBQVosR0FBbUIsWUFBWSxRQUFoQyxHQUE0QyxPQUFLLFFBRDFDO0FBRWQseUJBQU8sWUFBWSxHQUFaLEdBQWtCLFlBQVksUUFBL0IsR0FBMkMsT0FBSyxRQUZ4QztBQUdkLDJCQUFRLFlBQVksS0FITjtBQUlkLDJCQUFRLFlBQVk7QUFKTixpQkFBbEIsRUFLRyxTQU5QO0FBUUgsYUFURDs7QUFXQSxpQkFBSyxNQUFMLENBQVksU0FBWjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxpQkFBWixHQUFnQyxJQUFoQztBQUNIOztBQUVEOzs7Ozs7cUNBR1k7QUFDUixpQkFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsaUJBQUssTUFBTCxDQUFZLEtBQVo7QUFDQSxpQkFBSyxXQUFMO0FBQ0g7O0FBRUQ7Ozs7OzttQ0FHVTtBQUNOLG1CQUFPLEtBQUssTUFBTCxDQUFZLFNBQVosRUFBUDtBQUNIOztBQUVEOzs7Ozs7QUFPQTs7Ozs7O2tDQUdVLEksRUFBTTtBQUNaLGdCQUFJLEtBQUssT0FBVCxFQUFpQjtBQUNiLHFCQUFLLE1BQUwsQ0FBWSxHQUFaLENBQ0ksS0FBSyxhQUFMLENBQW1CLENBQW5CLEVBQXNCLFNBRDFCLEVBRU0sS0FBSyxhQUFMLENBQW1CLENBQW5CLEVBQXNCLFNBRjVCLEVBR00sS0FBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLFNBSDFCLEVBSU0sS0FBSyxXQUFMLENBQWlCLENBQWpCLEVBQW1CLEVBQW5CLEVBQXVCLFNBSjdCO0FBTUg7QUFDSjs7QUFFRDs7Ozs7O3NDQUdjLEksRUFBSztBQUNmO0FBQ0E7QUFDQSxnQkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLE9BQU8sS0FBSyxRQUF2QixDQUFWO0FBQ0EsZ0JBQUksVUFBVSxNQUFNLEtBQUssUUFBekI7QUFDQSxpQkFBSyxJQUFJLE1BQUssQ0FBZCxFQUFpQixNQUFNLEdBQXZCLEVBQTRCLEtBQTVCLEVBQWtDO0FBQzlCLHFCQUFLLElBQUksTUFBTSxDQUFmLEVBQWtCLE1BQU0sR0FBeEIsRUFBNkIsS0FBN0IsRUFBb0M7QUFDL0Isd0JBQUksWUFBWSxJQUFJLE9BQU8sSUFBWCxDQUFnQjtBQUM3QiwrQkFBTyxLQUFLLFFBRGlCO0FBRTdCLGdDQUFRLEtBQUssUUFGZ0I7QUFHN0IsMERBSDZCO0FBSTdCLGlDQUFTLFFBSm9CO0FBSzdCLGlDQUFTLFFBTG9CO0FBTTdCLDBDQUFrQixJQU5XO0FBTzdCLHFDQUFhO0FBUGdCLHFCQUFoQixDQUFoQjtBQVNELHdCQUFJLFNBQVMsbUJBQVcsS0FBSyxRQUFoQiwrQkFBYjtBQUNBLDJCQUFPLFNBQVAsQ0FBaUIsR0FBakIsQ0FBcUI7QUFDakIsc0NBQWUsSUFERTtBQUVqQixzQ0FBZSxJQUZFO0FBR2pCLHNDQUFlLElBSEU7QUFJakIsdUNBQWdCLElBSkM7QUFLakIsdUNBQWdCLElBTEM7QUFNakIscUNBQWMsS0FORztBQU9qQixvQ0FBYTtBQVBJLHFCQUFyQjtBQVNBLHdCQUFJLFdBQVcsSUFBSSxPQUFPLEtBQVgsQ0FBaUIsQ0FBQyxTQUFELEVBQVksT0FBTyxTQUFuQixDQUFqQixFQUFnRDtBQUMzRCw4QkFBTSxLQUFLLFFBQUwsR0FBZ0IsR0FEcUM7QUFFM0QsNkJBQUssS0FBSyxRQUFMLEdBQWdCLEdBQWhCLEdBQXNCLEtBQUssWUFGMkI7QUFHM0QsK0JBQU8sQ0FIb0Q7QUFJM0Qsc0NBQWUsSUFKNEM7QUFLM0Qsc0NBQWUsSUFMNEM7QUFNM0Qsc0NBQWUsSUFONEM7QUFPM0QsdUNBQWdCLElBUDJDO0FBUTNELHVDQUFnQixJQVIyQztBQVMzRCxxQ0FBYyxLQVQ2QztBQVUzRCxvQ0FBYTtBQVY4QyxxQkFBaEQsQ0FBZjtBQVlBLHlCQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFFBQWhCO0FBQ0g7QUFDSjtBQUNEOzs7Ozs7Ozs7OztBQVdIOztBQUVEOzs7Ozs7b0NBR1ksUSxFQUFVLEssRUFBTztBQUN6QixtQkFBTyxLQUFLLFlBQUwsQ0FBa0I7QUFDakIsc0JBQU8sRUFBQyxLQUFNLElBQUksUUFBWCxFQUFxQixLQUFLLElBQUksUUFBOUIsRUFEVTtBQUVqQixzQkFBTyxRQUFVLEtBQUssVUFBTCxDQUFnQixLQUFoQixHQUF3QixDQUF6QixHQUE4QixLQUFLLFFBQTVDLEdBQTBELEtBQUssVUFBTCxDQUFnQixLQUFoQixHQUF3QixDQUF4QixHQUE0QixDQUE3QixHQUFtQyxLQUFLLFFBQUwsR0FBZ0IsR0FGbEc7QUFHakIscUJBQU0sUUFBUSxDQUFSLEdBQVksQ0FIRDtBQUlqQix1QkFBUTtBQUpTLGFBQWxCLENBQVA7QUFNSDs7QUFFRDs7Ozs7O3NDQUdjLFUsRUFBWTtBQUN0QixtQkFBTyxLQUFLLFlBQUwsQ0FBa0I7QUFDakIsc0JBQU8sRUFBQyxLQUFNLElBQUksVUFBWCxFQUF1QixLQUFLLElBQUksVUFBaEMsRUFEVTtBQUVqQixzQkFBTSxlQUFlLENBQWYsR0FBcUIsS0FBSyxVQUFMLENBQWdCLEtBQWhCLEdBQXdCLENBQXpCLEdBQStCLElBQUksS0FBSyxRQUE1RCxHQUEwRSxLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsR0FBeUIsS0FBSyxRQUFMLEdBQWdCLEdBRnhHO0FBR2pCLHFCQUFNLGVBQWUsQ0FBZixHQUFtQixDQUFuQixHQUF1QjtBQUhaLGFBQWxCLENBQVA7QUFLSDs7QUFFRDs7Ozs7O3FDQUdhLE8sRUFBUztBQUNsQixvQkFBUSxRQUFSLEdBQW1CLEtBQUssUUFBeEI7QUFDQSxvQkFBUSxLQUFSLEdBQWdCLFFBQVEsS0FBUixJQUFpQixLQUFLLFNBQXRDO0FBQ0EsZ0JBQUksTUFBTSxhQUFRLE9BQVIsQ0FBVjtBQUNBLGlCQUFLLFVBQUwsQ0FBZ0IsSUFBSSxFQUFwQixJQUEwQixHQUExQjtBQUNBO0FBQ0EsZ0JBQUksUUFBUSxJQUFSLENBQWEsR0FBYixLQUFxQixDQUF6QixFQUE0QjtBQUN4QixxQkFBSyxTQUFMLENBQWUsU0FBZixHQUEyQixHQUEzQjtBQUNILGFBRkQsTUFFTyxJQUFJLFFBQVEsS0FBWixFQUFtQjtBQUN0QixxQkFBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQjtBQUNILGFBRk0sTUFFQSxJQUFJLFFBQVEsSUFBUixDQUFhLEdBQWIsS0FBcUIsQ0FBekIsRUFBNEI7QUFDL0IscUJBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsR0FBdEI7QUFDSCxhQUZNLE1BRUE7QUFDSCxxQkFBSyxTQUFMLENBQWUsTUFBZixHQUF3QixHQUF4QjtBQUNIO0FBQ0QsbUJBQU8sR0FBUDtBQUNIOztBQUdEOzs7Ozs7c0NBR2M7QUFDVixpQkFBSyxhQUFMLENBQW1CLEtBQUssVUFBTCxDQUFnQixLQUFuQztBQUNBLGlCQUFLLFNBQUwsQ0FBZSxLQUFLLFVBQUwsQ0FBZ0IsS0FBL0IsRUFBc0MsS0FBSyxLQUFMLENBQVcsS0FBSyxVQUFMLENBQWdCLEtBQWhCLGtCQUFYLENBQXRDO0FBQ0g7Ozs7Ozs7QUNuVEw7O0FBRUE7Ozs7O0FBQ08sSUFBTSw4QkFBVyxFQUFqQjs7QUFFUDtBQUNPLElBQU0sd0NBQWdCLE9BQU8sTUFBUCxDQUFjLEtBQWQsSUFBdUIsR0FBdkIsR0FBOEIsRUFBOUIsR0FBbUMsR0FBekQ7O0FBRVA7QUFDTyxJQUFNLDRDQUFrQixTQUF4Qjs7QUFFUDtBQUNBLElBQU0sWUFBWSxTQUFsQjs7QUFFQTtBQUNBLElBQU0sWUFBWSxTQUFsQjs7QUFFQTtBQUNPLElBQU0sd0RBQXdCLFNBQTlCOzs7QUNsQlA7O0FBRUE7Ozs7Ozs7Ozs7QUFNTyxJQUFNLG9DQUFjLENBQ3ZCLG1CQUR1QixFQUNGO0FBQ3JCLG9CQUZ1QixFQUVEO0FBQ3RCLG1CQUh1QixFQUdGO0FBQ3JCLG1CQUp1QixFQUlGO0FBQ3JCLGtCQUx1QixFQUtIO0FBQ3BCLGtCQU51QixFQU1IO0FBQ3BCLG1CQVB1QixFQU9GO0FBQ3JCLG9CQVJ1QixFQVFEO0FBQ3RCLG1CQVR1QixFQVNGO0FBQ3JCLGtCQVZ1QixFQVVIO0FBQ3BCLG1CQVh1QixFQVdGO0FBQ3JCLG9CQVp1QixFQVlEO0FBQ3RCLG9CQWJ1QixFQWFEO0FBQ3RCLGlCQWR1QixFQWNKO0FBQ25CLG9CQWZ1QixFQWVEO0FBQ3RCLGtCQWhCdUIsRUFnQkg7QUFDcEIsa0JBakJ1QixFQWlCSDtBQUNwQixvQkFsQnVCLEVBa0JEO0FBQ3RCLGlCQW5CdUIsRUFtQko7QUFDbkIsbUJBcEJ1QixFQW9CRjtBQUNyQixrQkFyQnVCLEVBcUJIO0FBQ3BCLG9CQXRCdUIsRUFzQkQ7QUFDdEIsb0JBdkJ1QixFQXVCRDtBQUN0QixtQkF4QnVCLEVBd0JGO0FBQ3JCLGdCQXpCdUIsRUF5Qkw7QUFDbEIsb0JBMUJ1QixFQTBCRDtBQUN0QixvQkEzQnVCLEVBMkJEO0FBQ3RCLGtCQTVCdUIsRUE0Qkg7QUFDcEIsb0JBN0J1QixFQTZCRDtBQUN0QixvQkE5QnVCLEVBOEJEO0FBQ3RCLG9CQS9CdUIsRUErQkQ7QUFDdEIsaUJBaEN1QixFQWdDSjtBQUNuQixpQkFqQ3VCLENBQXBCOzs7QUNSUDs7QUFFQTs7Ozs7Ozs7O1FBS2dCLGMsR0FBQSxjO0FBQVQsU0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLEdBQTdCLEVBQWtDOztBQUVqQztBQUNBLFVBQU0sT0FBTyxHQUFQLEVBQVksT0FBWixDQUFvQixhQUFwQixFQUFtQyxFQUFuQyxDQUFOO0FBQ0EsUUFBSSxJQUFJLE1BQUosR0FBYSxDQUFqQixFQUFvQjtBQUNoQixjQUFNLElBQUksQ0FBSixJQUFTLElBQUksQ0FBSixDQUFULEdBQWtCLElBQUksQ0FBSixDQUFsQixHQUEyQixJQUFJLENBQUosQ0FBM0IsR0FBb0MsSUFBSSxDQUFKLENBQXBDLEdBQTZDLElBQUksQ0FBSixDQUFuRDtBQUNIO0FBQ0QsVUFBTSxPQUFPLENBQWI7O0FBRUE7QUFDQSxRQUFJLE1BQU0sR0FBVjtBQUFBLFFBQWUsQ0FBZjtBQUFBLFFBQWtCLENBQWxCO0FBQ0EsU0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLENBQWhCLEVBQW1CLEdBQW5CLEVBQXdCO0FBQ3BCLFlBQUksU0FBUyxJQUFJLE1BQUosQ0FBVyxJQUFJLENBQWYsRUFBa0IsQ0FBbEIsQ0FBVCxFQUErQixFQUEvQixDQUFKO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSyxJQUFJLEdBQXJCLENBQVQsRUFBcUMsR0FBckMsQ0FBWCxFQUFzRCxRQUF0RCxDQUErRCxFQUEvRCxDQUFKO0FBQ0EsZUFBTyxDQUFDLE9BQU8sQ0FBUixFQUFXLE1BQVgsQ0FBa0IsRUFBRSxNQUFwQixDQUFQO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ1A7OztBQ3pCRDs7Ozs7Ozs7O0FBQ0E7Ozs7QUFFQTs7Ozs7SUFLYSxNLFdBQUEsTTtBQUNULG9CQUFZLFFBQVosRUFBc0IsS0FBdEIsRUFBNEI7QUFBQTs7QUFFeEIsYUFBSyxXQUFMLEdBQW1CLElBQUksT0FBTyxNQUFYLENBQWtCO0FBQ2pDLG9CQUFTLFdBQVcsQ0FBWixHQUFpQixDQURRO0FBRWpDLGtCQUFNLDBCQUFlLEtBQWYsRUFBc0IsQ0FBQyxHQUF2QixDQUYyQjtBQUdqQyxxQkFBUyxRQUh3QjtBQUlqQyxxQkFBUyxRQUp3QjtBQUtqQyxvQkFBUztBQUx3QixTQUFsQixDQUFuQjs7QUFRQSxhQUFLLGNBQUwsR0FBc0IsSUFBSSxPQUFPLE1BQVgsQ0FBa0I7QUFDcEMsb0JBQVMsV0FBVyxDQUFaLEdBQWlCLENBRFc7QUFFcEMsa0JBQU0sMEJBQWUsS0FBZixFQUFzQixHQUF0QixDQUY4QjtBQUdwQyxxQkFBUyxRQUgyQjtBQUlwQyxxQkFBUztBQUoyQixTQUFsQixDQUF0Qjs7QUFPQSxhQUFLLElBQUwsR0FBWSxJQUFJLE9BQU8sSUFBWCxDQUFnQixLQUFoQixFQUF1QjtBQUMvQixzQkFBVSxXQUFXLENBRFU7QUFFL0Isa0JBQU0sMEJBQWUsS0FBZixFQUFzQixDQUFDLElBQXZCLENBRnlCO0FBRy9CLHFCQUFTLFFBSHNCO0FBSS9CLHFCQUFTLFFBSnNCO0FBSy9CLG9CQUFRLDBCQUFlLEtBQWYsRUFBc0IsQ0FBQyxJQUF2QixDQUx1QjtBQU0vQix5QkFBYTtBQU5rQixTQUF2QixDQUFaOztBQVNBLGFBQUssS0FBTCxHQUFhLElBQUksT0FBTyxLQUFYLENBQWlCLENBQUMsS0FBSyxjQUFOLEVBQXNCLEtBQUssV0FBM0IsRUFBd0MsS0FBSyxJQUE3QyxDQUFqQixDQUFiO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQU9BOzs7b0NBR1ksSyxFQUFNO0FBQ2QsaUJBQUssV0FBTCxDQUFpQixHQUFqQixDQUFxQixNQUFyQixFQUE2QiwwQkFBZSxLQUFmLEVBQXNCLENBQUMsR0FBdkIsQ0FBN0I7QUFDQSxpQkFBSyxjQUFMLENBQW9CLEdBQXBCLENBQXdCLE1BQXhCLEVBQWdDLDBCQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBaEM7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjO0FBQ1Ysc0JBQU8sMEJBQWUsS0FBZixFQUFzQixDQUFDLElBQXZCLENBREc7QUFFVix3QkFBUywwQkFBZSxLQUFmLEVBQXNCLENBQUMsSUFBdkI7QUFGQyxhQUFkO0FBSUg7Ozs0QkFkYztBQUNYLG1CQUFPLEtBQUssS0FBWjtBQUNIOzs7Ozs7O0FDM0NMOzs7Ozs7Ozs7QUFDQTs7OztBQUVBOzs7O0lBSWEsRyxXQUFBLEc7QUFDVCx1QkFBb0c7QUFBQSw2QkFBdkYsSUFBdUY7QUFBQSxZQUF2RixJQUF1Riw2QkFBaEYsRUFBQyxLQUFNLENBQVAsRUFBVSxLQUFNLENBQWhCLEVBQWdGO0FBQUEsaUNBQTVELFFBQTREO0FBQUEsWUFBNUQsUUFBNEQsaUNBQWpELENBQWlEO0FBQUEsOEJBQTlDLEtBQThDO0FBQUEsWUFBOUMsS0FBOEMsOEJBQXRDLE1BQXNDO0FBQUEsNkJBQTlCLElBQThCO0FBQUEsWUFBOUIsSUFBOEIsNkJBQXZCLENBQXVCO0FBQUEsNEJBQXBCLEdBQW9CO0FBQUEsWUFBcEIsR0FBb0IsNEJBQWQsQ0FBYztBQUFBLDhCQUFYLEtBQVc7QUFBQSxZQUFYLEtBQVcsOEJBQUgsQ0FBRzs7QUFBQTs7QUFDaEcsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssRUFBTCxXQUFnQixJQUFoQixTQUF3QixLQUFLLEdBQUwsRUFBeEI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxhQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsYUFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLEtBQUwsR0FBYSxTQUFTLENBQXRCO0FBQ0EsYUFBSyxXQUFMLEdBQW1CLEVBQW5COztBQUdBLGFBQUssU0FBTCxHQUFpQixJQUFJLE9BQU8sSUFBWCxDQUFnQjtBQUM3QixtQkFBTyxXQUFXLEtBQUssR0FETTtBQUU3QixvQkFBUSxXQUFXLEtBQUssR0FGSztBQUc3QixrQkFBTSxLQUh1QjtBQUk3QixxQkFBUyxRQUpvQjtBQUs3QixxQkFBUyxRQUxvQjtBQU03Qiw4QkFBa0IsSUFOVztBQU83Qix5QkFBYSxLQVBnQjtBQVE3QixvQkFBUztBQVJvQixTQUFoQixDQUFqQjs7QUFZQSxZQUFJLFlBQVksQ0FBQyxLQUFLLFNBQU4sQ0FBaEI7QUFDQSxZQUFJLGNBQWMsbUJBQVcsUUFBWCxFQUFxQixLQUFyQixDQUFsQjtBQUNBLGFBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixXQUF0QjtBQUNBO0FBQ0EsWUFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmO0FBQ0E7QUFDQSx3QkFBWSxTQUFaLENBQXNCLEdBQXRCLENBQTBCO0FBQ3RCLHNCQUFNLENBQUMsUUFBRCxHQUFZO0FBREksYUFBMUI7QUFHQSxnQkFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIseUJBQU8sQ0FBQyxRQUFELEdBQVc7QUFESSxpQkFBMUI7QUFHSDtBQUNELDBCQUFjLG1CQUFXLFFBQVgsRUFBcUIsS0FBckIsQ0FBZDtBQUNBLHdCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIsc0JBQU07QUFEZ0IsYUFBMUI7O0FBSUE7QUFDQSxnQkFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIseUJBQU8sQ0FBQyxRQUFELEdBQVc7QUFESSxpQkFBMUI7QUFHSDtBQUNELGlCQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsV0FBdEI7O0FBRUE7QUFDQSxnQkFBSSxLQUFLLEdBQUwsS0FBYSxDQUFqQixFQUFtQjtBQUNmLDhCQUFjLG1CQUFXLFFBQVgsRUFBcUIsS0FBckIsQ0FBZDtBQUNBLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEI7QUFDdEIsMEJBQU0sQ0FBQyxRQUFELEdBQVksQ0FESTtBQUV0Qix5QkFBSztBQUZpQixpQkFBMUI7QUFJQSxxQkFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFdBQXRCO0FBQ0EsOEJBQWMsbUJBQVcsUUFBWCxFQUFxQixLQUFyQixDQUFkO0FBQ0EsNEJBQVksU0FBWixDQUFzQixHQUF0QixDQUEwQjtBQUN0QiwwQkFBTSxDQURnQjtBQUV0Qix5QkFBTTtBQUZnQixpQkFBMUI7QUFJQSxxQkFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFdBQXRCO0FBQ0g7QUFFSjs7QUFFRCxhQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxNQUFEO0FBQUEsbUJBQVUsVUFBVSxJQUFWLENBQWUsT0FBTyxTQUF0QixDQUFWO0FBQUEsU0FBekI7O0FBRUE7QUFDQSxhQUFLLEtBQUwsR0FBYSxJQUFJLE9BQU8sS0FBWCxDQUFpQixTQUFqQixFQUE0QjtBQUNyQyxrQkFBTSxLQUFLLElBRDBCO0FBRXJDLGlCQUFLLEtBQUssR0FGMkI7QUFHckMsbUJBQU8sS0FBSyxLQUh5QjtBQUlyQywwQkFBZSxJQUpzQjtBQUtyQywwQkFBZSxJQUxzQjtBQU1yQywwQkFBZSxJQU5zQjtBQU9yQyx5QkFBYztBQVB1QixTQUE1QixDQUFiOztBQVVBO0FBQ0EsYUFBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixJQUF2QjtBQUNIOztBQUVEOzs7Ozs7O0FBZUE7b0NBQ1ksSyxFQUFNO0FBQ2QsaUJBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxpQkFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixNQUFuQixFQUEyQixLQUEzQjtBQUNBLGlCQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxNQUFEO0FBQUEsdUJBQVcsT0FBTyxXQUFQLENBQW1CLEtBQW5CLENBQVg7QUFBQSxhQUF6QjtBQUNIOztBQUVEOzs7OzZCQUNLLEksRUFBTSxHLEVBQUk7QUFDWCxpQkFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGlCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZTtBQUNYLHFCQUFLLEdBRE07QUFFWCxzQkFBTztBQUZJLGFBQWY7QUFJSDs7QUFFRDs7OzsrQkFDTyxLLEVBQU07QUFDVCxpQkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWU7QUFDWCx1QkFBUTtBQURHLGFBQWY7QUFHSDs7OzRCQXJDYztBQUNYLG1CQUFPLEtBQUssS0FBWjtBQUNIOztBQUVEOzs7OzRCQUNhO0FBQ1QsbUJBQU8sS0FBSyxTQUFaO0FBQ0g7O0FBRUQ7OzBCQUNZLE8sRUFBUTtBQUNoQixpQkFBSyxTQUFMLEdBQWlCLE9BQWpCO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0xFR09fQ09MT1JTfSBmcm9tICcuL2NvbW1vbi9sZWdvQ29sb3JzLmpzJztcbmltcG9ydCB7QkFTRV9MRUdPX0NPTE9SfSBmcm9tICcuL2NvbW1vbi9jb25zdC5qcyc7XG5pbXBvcnQge0xlZ29HcmlkQ2FudmFzfSBmcm9tICcuL2NhbnZhcy9sZWdvQ2FudmFzLmpzJztcblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgbGV0IGdhbWVJbml0ID0gZmFsc2UsLy8gdHJ1ZSBpZiB3ZSBpbml0IHRoZSBsZWdvR3JpZFxuICAgICAgICBsZWdvQ2FudmFzID0gbnVsbCwgLy8gVGhlIGxlZ29HcmlkXG4gICAgICAgIGtleXMgPSBudWxsLCAvLyBUaGUga2V5cyBvZiBmaXJlbmFzZSBzdWJtaXQgZHJhdyBcbiAgICAgICAgc25hcHNob3RGYiA9IG51bGwsIC8vIFRoZSBzbmFwc2hvdCBvZiBzdWJtaXQgZHJhd1xuICAgICAgICBpbmRleCA9IDA7IFxuXG4gICAgXG4gICAgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG5cbiAgICAgICAgbGVnb0NhbnZhcyA9IG5ldyBMZWdvR3JpZENhbnZhcygnY2FudmFzRHJhdycsIHRydWUpO1xuXG4gICAgICAgICQoXCIjY29sb3ItcGlja2VyMlwiKS5zcGVjdHJ1bSh7XG4gICAgICAgICAgICBzaG93UGFsZXR0ZU9ubHk6IHRydWUsXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiBCQVNFX0xFR09fQ09MT1IsXG4gICAgICAgICAgICBwYWxldHRlOiBMRUdPX0NPTE9SUyxcbiAgICAgICAgICAgIGNoYW5nZTogZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgbGVnb0NhbnZhcy5jaGFuZ2VDb2xvcihjb2xvci50b0hleFN0cmluZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogTWFuYWdlbWVudCBvZiBDaW5lbWF0aWMgQnV0dG9uc1xuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRCdG4nKTtcbiAgICAgICAgY29uc3QgaGVscEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxwJylcblxuICAgICAgICBjb25zdCBzdHJlYW1TdGFydCA9IFJ4Lk9ic2VydmFibGVcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoc3RhcnRCdG4sICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdzdGFydCcpO1xuXG4gICAgICAgIGNvbnN0IHN0cmVhbUhlbHAgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGhlbHBCdG4sICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdoZWxwJyk7XG5cbiAgICAgICAgc3RyZWFtU3RhcnQubWVyZ2Uoc3RyZWFtSGVscClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxsby1tc2cnKS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLXBpY2tlcjInKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2FtZUluaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbWVvdXQgbmVlZGVkIHRvIHN0YXJ0IHRoZSByZW5kZXJpbmcgb2YgbG9hZGluZyBhbmltYXRpb24gKGVsc2Ugd2lsbCBub3QgYmUgc2hvdylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lSW5pdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRHYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmcnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2hlbHAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWxsby1tc2cnKS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLXBpY2tlcjInKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVscCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIHN1Ym1pc3Npb25cbiAgICAgICAgICovXG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0blN1Ym1pc3Npb24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgbmFtZSA6ICdVc2VyIE5hbWUnLFxuICAgICAgICAgICAgICAgIGlkIDogJ3VzZXJJZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBkcmF3RGF0YXMgPSBsZWdvQ2FudmFzLmV4cG9ydCh1c2VyLm5hbWUsIHVzZXIuaWQpO1xuICAgICAgICAgICAgZHJhd0RhdGFzLmRhdGFVcmwgPSBsZWdvQ2FudmFzLnNuYXBzaG90KCk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ3dpbGwgc2VuZCA6ICcsIGRyYXdEYXRhcyk7ICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBVUkwgPSBgaHR0cDovL2xvY2FsaG9zdDo5MDAwL2RyYXcvJHt1c2VyLmlkfWA7XG4gICAgICAgICAgICBmZXRjaChVUkwsIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZHJhd0RhdGFzKVxuICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8ocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbmFnZW1lbnQgb2YgbWVudSBpdGVtc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBtZW51R2FtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKTtcbiAgICAgICAgY29uc3QgbWVudUNyZWF0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpO1xuICAgICAgICBcblxuICAgICAgICBjb25zdCBzdHJlYW1HYW1lID0gUnguT2JzZXJ2YWJsZVxuICAgICAgICAgICAgLmZyb21FdmVudChtZW51R2FtZSwgJ2NsaWNrJylcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gJ2dhbWUnKTtcblxuICAgICAgICBjb25zdCBzdHJlYW1DcmVhdGlvbnMgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KG1lbnVDcmVhdGlvbnMsICdjbGljaycpXG4gICAgICAgICAgICAubWFwKCgpID0+ICdjcmVhdGlvbnMnKTtcblxuICAgICAgICBzdHJlYW1HYW1lLm1lcmdlKHN0cmVhbUNyZWF0aW9ucylcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnZ2FtZScpe1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jb250ZW50JykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdHRlZCcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1nYW1lJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNyZWF0aW9ucycpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19kcmF3ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZGwtbGF5b3V0X19vYmZ1c2NhdG9yJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHN0YXRlID09PSAnY3JlYXRpb25zJyl7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNvbnRlbnQnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdHRlZCcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWdhbWUnKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jcmVhdGlvbnMnKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX2RyYXdlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1kbC1sYXlvdXRfX29iZnVzY2F0b3InKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgOiAnVXNlciBOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkIDogJ3VzZXJJZCdcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbXlJbml0ID0geyBtZXRob2Q6ICdHRVQnfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgVVJMID0gYGh0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9kcmF3LyR7dXNlci5pZH1gO1xuICAgICAgICAgICAgICAgICAgICBmZXRjaChVUkwsIG15SW5pdClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdC5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHNuYXBzaG90KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNuYXBzaG90KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbmFwc2hvdEZiID0gc25hcHNob3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmF3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBkcmF3ICEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYW5hZ2VtZW50IG9mIEJ1dHRvbnMgZm9yIGNoYW5naW5nIG9mIGRyYXdcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3QgYnRuTGVmdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5MZWZ0Jyk7XG4gICAgICAgIGNvbnN0IGJ0blJpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0blJpZ2h0Jyk7XG5cbiAgICAgICAgY29uc3Qgc3RyZWFtQnRuTGVmdCA9IFJ4Lk9ic2VydmFibGVcbiAgICAgICAgICAgIC5mcm9tRXZlbnQoYnRuTGVmdCwnY2xpY2snLCgpPT5pbmRleCA9IE1hdGgubWF4KGluZGV4IC0gMSwgMCkpO1xuICAgICAgICBjb25zdCBzdHJlYW1CdG5SaWdodCA9ICBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgICAuZnJvbUV2ZW50KGJ0blJpZ2h0LCAnY2xpY2snLCgpPT5pbmRleCA9IE1hdGgubWluKGluZGV4ICsgMSwga2V5cy5sZW5ndGggLSAxKSk7XG5cbiAgICAgICBzdHJlYW1CdG5MZWZ0Lm1lcmdlKHN0cmVhbUJ0blJpZ2h0KS5zdWJzY3JpYmUoZHJhdyk7XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgYSBkcmF3IGFuZCBzaG93IGl0J3Mgc3RhdGUgOiBSZWplY3RlZCBvciBBY2NlcHRlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRyYXcoKSB7XG4gICAgICAgIGxldCBkcmF3ID0gc25hcHNob3RGYltrZXlzW2luZGV4XV07XG4gICAgICAgIGxldCBpbWdTdWJtaXNzaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ1N1Ym1pc3Npb24nKTtcbiAgICAgICAgaW1nU3VibWlzc2lvbi5zcmMgPSBkcmF3LmRhdGFVcmw7XG4gICAgICAgIGlmIChkcmF3LmFjY2VwdGVkICYmICFpbWdTdWJtaXNzaW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjZXB0ZWQnKSkge1xuICAgICAgICAgICAgaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QuYWRkKCdhY2NlcHRlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW1nU3VibWlzc2lvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY2NlcHRlZCcpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xuXG4gICAgLyogU0VSVklDRV9XT1JLRVJfUkVQTEFDRSBcbiAgICBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgeyAgICAgICAgXG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcuL3NlcnZpY2Utd29ya2VyLXBob25lLmpzJywge3Njb3BlIDogbG9jYXRpb24ucGF0aG5hbWV9KS50aGVuKGZ1bmN0aW9uKHJlZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2UgV29ya2VyIFJlZ2lzdGVyIGZvciBzY29wZSA6ICVzJyxyZWcuc2NvcGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgIFNFUlZJQ0VfV09SS0VSX1JFUExBQ0UgKi9cblxufSkoKTtcbiIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtQZWd9IGZyb20gJy4uL2xlZ29fc2hhcGUvcGVnLmpzJztcbmltcG9ydCB7Q2lyY2xlfSBmcm9tICcuLi9sZWdvX3NoYXBlL2NpcmNsZS5qcyc7XG5pbXBvcnQge05CX0NFTExTLCBIRUFERVJfSEVJR0hULCBCQVNFX0xFR09fQ09MT1IsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUn0gZnJvbSAnLi4vY29tbW9uL2NvbnN0LmpzJztcbmltcG9ydCB7bGVnb0Jhc2VDb2xvcn0gZnJvbSAnLi4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xuXG4vKipcbiAqIFxuICogQ2xhc3MgZm9yIENhbnZhcyBHcmlkXG4gKiBcbiAqL1xuZXhwb3J0IGNsYXNzIExlZ29HcmlkQ2FudmFzIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgc2hvd1Jvdykge1xuICAgICAgICAvLyBCYXNpYyBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXNFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIC8vIFNpemUgb2YgY2FudmFzXG4gICAgICAgIHRoaXMuY2FudmFzUmVjdCA9IHRoaXMuY2FudmFzRWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAvLyBJbmRpY2F0b3IgZm9yIHNob3dpbmcgdGhlIGZpcnN0IHJvdyB3aXRoIHBlZ3NcbiAgICAgICAgdGhpcy5zaG93Um93ID0gc2hvd1JvdztcbiAgICAgICAgdGhpcy5jYW52YXNFbHQud2lkdGggPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGg7XG4gICAgICAgIC8vIEFjY29yZGluZyB0byBzaG93Um93LCB3ZSB3aWxsIHNob3cgbW9kaWZ5IHRoZSBoZWFkZXIgSGVpZ2h0XG4gICAgICAgIHRoaXMuaGVhZGVySGVpZ2h0ID0gdGhpcy5zaG93Um93ID8gSEVBREVSX0hFSUdIVCA6IDA7XG4gICAgICAgIHRoaXMuY2FudmFzRWx0LmhlaWdodCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aCArIHRoaXMuaGVhZGVySGVpZ2h0O1xuICAgICAgICAvLyBXZSBjYWxjdWxhdGUgdGhlIGNlbGxzaXplIGFjY29yZGluZyB0byB0aGUgc3BhY2UgdGFrZW4gYnkgdGhlIGNhbnZhc1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gTWF0aC5yb3VuZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyBOQl9DRUxMUyk7XG5cbiAgICAgICAgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgRmFicmljIEpTIGxpYnJhcnkgd2l0aCBvdXIgY2FudmFzXG4gICAgICAgIHRoaXMuY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoaWQsIHsgc2VsZWN0aW9uOiBmYWxzZSB9KTtcbiAgICAgICAgLy8gT2JqZWN0IHRoYXQgcmVwcmVzZW50IHRoZSBwZWdzIG9uIHRoZSBmaXJzdCByb3dcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QgPSB7fTtcbiAgICAgICAgLy8gVGhlIGN1cnJlbnQgZHJhdyBtb2RlbCAoaW5zdHJ1Y3Rpb25zLCAuLi4pXG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9LFxuICAgICAgICAvLyBGbGFnIHRvIGRldGVybWluZSBpZiB3ZSBoYXZlIHRvIGNyZWF0ZSBhIG5ldyBicmlja1xuICAgICAgICB0aGlzLmNyZWF0ZU5ld0JyaWNrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudEJyaWNrID0gbnVsbDtcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBCQVNFX0xFR09fQ09MT1I7XG5cbiAgICAgICAgLy8gV2UgY3JlYXRlIHRoZSBjYW52YXNcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xuXG4gICAgICAgIC8vIElmIHdlIHNob3cgdGhlIHJvdywgd2UgaGF2ZSB0byBwbHVnIHRoZSBtb3ZlIG1hbmFnZW1lbnRcbiAgICAgICAgaWYgKHNob3dSb3cpIHtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ29iamVjdDpzZWxlY3RlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZyA/IG9wdGlvbnMudGFyZ2V0IDogbnVsbCk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignc2VsZWN0aW9uOmNsZWFyZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsKTtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ29iamVjdDptb3ZpbmcnLCAob3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwZWcgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWc7XG5cblxuICAgICAgICAgICAgICAgIGxldCBuZXdMZWZ0ID0gTWF0aC5yb3VuZChvcHRpb25zLnRhcmdldC5sZWZ0IC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplO1xuICAgICAgICAgICAgICAgIGxldCBuZXdUb3AgPSBNYXRoLnJvdW5kKChvcHRpb25zLnRhcmdldC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCkgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUgKyB0aGlzLmhlYWRlckhlaWdodDsgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGUgdG9wXG4gICAgICAgICAgICAgICAgbGV0IHRvcENvbXB1dGUgPSBuZXdUb3AgKyAocGVnLnNpemUucm93ID09PSAyIHx8IHBlZy5hbmdsZSA+IDAgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgICAgIGxldCBsZWZ0Q29tcHV0ZSA9IG5ld0xlZnQgKyAocGVnLnNpemUuY29sID09PSAyID8gdGhpcy5jZWxsU2l6ZSAqIDIgOiB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgICAgICBwZWcubW92ZShcbiAgICAgICAgICAgICAgICAgICAgbmV3TGVmdCwgLy9sZWZ0XG4gICAgICAgICAgICAgICAgICAgIG5ld1RvcCAvLyB0b3BcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gV2Ugc3BlY2lmeSB0aGF0IHdlIGNvdWxkIHJlbW92ZSBhIHBlZyBpZiBvbmUgb2YgaXQncyBlZGdlIHRvdWNoIHRoZSBvdXRzaWRlIG9mIHRoZSBjYW52YXNcbiAgICAgICAgICAgICAgICBpZiAobmV3VG9wIDwgSEVBREVSX0hFSUdIVFxuICAgICAgICAgICAgICAgICAgICB8fCBuZXdMZWZ0IDwgMFxuICAgICAgICAgICAgICAgICAgICB8fCB0b3BDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICB8fCBsZWZ0Q29tcHV0ZSA+PSB0aGlzLmNhbnZhc0VsdC53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVsc2Ugd2UgY2hlY2sgd2UgY3JlYXRlIGEgbmV3IHBlZyAod2hlbiBhIHBlZyBlbnRlciBpbiB0aGUgZHJhdyBhcmVhKVxuICAgICAgICAgICAgICAgICAgICBwZWcudG9SZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZWcucmVwbGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLmNvbCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKHBlZy5hbmdsZSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEsOTApLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlU3F1YXJlKDEpLmNhbnZhc0VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZWcucmVwbGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignbW91c2U6dXAnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEJyaWNrXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy50b1JlbW92ZVxuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcucmVwbGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5icmlja01vZGVsW3RoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5pZF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZSh0aGlzLmN1cnJlbnRCcmljayk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGZvciBjaGFuZ2luZyB0aGUgY29sb3Igb2YgdGhlIGZpcnN0IHJvdyBcbiAgICAgKi9cbiAgICBjaGFuZ2VDb2xvcihjb2xvcikge1xuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IGNvbG9yOyAgICAgICBcbiAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdC5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VyaWFsaXplIHRoZSBjYW52YXMgdG8gYSBtaW5pbWFsIG9iamVjdCB0aGF0IGNvdWxkIGJlIHRyZWF0IGFmdGVyXG4gICAgICovXG4gICAgZXhwb3J0KHVzZXJOYW1lLCB1c2VySWQpIHtcbiAgICAgICAgbGV0IHJlc3VsdEFycmF5ID0gW107XG4gICAgICAgIC8vIFdlIGZpbHRlciB0aGUgcm93IHBlZ3NcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmJyaWNrTW9kZWwpXG4gICAgICAgICAgICAuZmlsdGVyKChrZXkpPT5rZXkgIT0gdGhpcy5yb3dTZWxlY3Quc3F1YXJlLmlkXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5pZFxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC5yZWN0LmlkXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnZlcnRSZWN0LmlkKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGxldCBwZWdUbXAgPSB0aGlzLmJyaWNrTW9kZWxba2V5XTtcbiAgICAgICAgICAgIHJlc3VsdEFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHNpemU6IHBlZ1RtcC5zaXplLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBwZWdUbXAuY29sb3IsXG4gICAgICAgICAgICAgICAgYW5nbGU6IHBlZ1RtcC5hbmdsZSxcbiAgICAgICAgICAgICAgICB0b3A6IHBlZ1RtcC50b3AgLSB0aGlzLmhlYWRlckhlaWdodCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBwZWdUbXAubGVmdCxcbiAgICAgICAgICAgICAgICBjZWxsU2l6ZSA6IHRoaXMuY2VsbFNpemVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVzZXI6IHVzZXJOYW1lLFxuICAgICAgICAgICAgdXNlcklkIDogdXNlcklkLFxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zOiByZXN1bHRBcnJheVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgZnJvbSBpbnRydWN0aW9ucyBhIGRyYXdcbiAgICAgKi9cbiAgICBkcmF3SW5zdHJ1Y3Rpb25zKGluc3RydWN0aW9uT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZXNldEJvYXJkKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIGluc3RydWN0aW9uT2JqZWN0Lmluc3RydWN0aW9ucy5mb3JFYWNoKChpbnN0cnVjdGlvbik9PntcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVCcmljayh7IHNpemUgOiBpbnN0cnVjdGlvbi5zaXplLCBcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA6IChpbnN0cnVjdGlvbi5sZWZ0IC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKGluc3RydWN0aW9uLnRvcCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlIDogaW5zdHJ1Y3Rpb24uYW5nbGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yIDogaW5zdHJ1Y3Rpb24uY29sb3JcbiAgICAgICAgICAgICAgICB9KS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICApOyAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFuIHRoZSBib2FyZCBhbmQgdGhlIHN0YXRlIG9mIHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICByZXNldEJvYXJkKCl7XG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9O1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpO1xuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XG4gICAgfVxuXG4gICAgLyoqIFxuICAgICAqIEdlbmVyYXRlIGEgQmFzZTY0IGltYWdlIGZyb20gdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIHNuYXBzaG90KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBQcml2YXRlcyBNZXRob2RzXG4gICAgICogXG4gICAgICovXG5cblxuICAgIC8qKlxuICAgICAqIERyYXcgdGhlIGJhc2ljIGdyaWQgXG4gICAgKi9cbiAgICBfZHJhd0dyaWQoc2l6ZSkgeyAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuc2hvd1Jvdyl7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlU3F1YXJlKDEpLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlU3F1YXJlKDIpLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlUmVjdCgxKS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVJlY3QoMSw5MCkuY2FudmFzRWx0XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhbGwgdGhlIHdoaXRlIHBlZyBvZiB0aGUgZ3JpZFxuICAgICAqL1xuICAgIF9kcmF3V2hpdGVQZWcoc2l6ZSl7XG4gICAgICAgIC8vIFdlIHN0b3AgcmVuZGVyaW5nIG9uIGVhY2ggYWRkLCBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlc1xuICAgICAgICAvL3RoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLnJvdW5kKHNpemUgLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgbGV0IG1heFNpemUgPSBtYXggKiB0aGlzLmNlbGxTaXplO1xuICAgICAgICBmb3IgKHZhciByb3cgPTA7IHJvdyA8IG1heDsgcm93Kyspe1xuICAgICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbWF4OyBjb2wrKyApe1xuICAgICAgICAgICAgICAgICBsZXQgc3F1YXJlVG1wID0gbmV3IGZhYnJpYy5SZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogQkFDS0dST1VORF9MRUdPX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBjaXJjbGUgPSBuZXcgQ2lyY2xlKHRoaXMuY2VsbFNpemUsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUik7XG4gICAgICAgICAgICAgICAgY2lyY2xlLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBncm91cFRtcCA9IG5ldyBmYWJyaWMuR3JvdXAoW3NxdWFyZVRtcCwgY2lyY2xlLmNhbnZhc0VsdF0sIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5jZWxsU2l6ZSAqIGNvbCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLmNlbGxTaXplICogcm93ICsgdGhpcy5oZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChncm91cFRtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyp0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xuICAgICAgICAvLyBXZSB0cmFuc2Zvcm0gdGhlIGNhbnZhcyB0byBhIGJhc2U2NCBpbWFnZSBpbiBvcmRlciB0byBzYXZlIHBlcmZvcm1hbmNlcy5cbiAgICAgICAgbGV0IHVybCA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpOyAgICAgXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEJhY2tncm91bmRJbWFnZSh1cmwsdGhpcy5jYW52YXMucmVuZGVyQWxsLmJpbmQodGhpcy5jYW52YXMpLCB7XG4gICAgICAgICAgICBvcmlnaW5YOiAnbGVmdCcsXG4gICAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgfSk7ICAgKi9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBob3Jpem9udGFsIG9yIHZlcnRpY2FsIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIF9jcmVhdGVSZWN0KHNpemVSZWN0LCBhbmdsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xuICAgICAgICAgICAgICAgIHNpemUgOiB7Y29sIDogMiAqIHNpemVSZWN0LCByb3cgOjEgKiBzaXplUmVjdH0sIFxuICAgICAgICAgICAgICAgIGxlZnQgOiBhbmdsZSA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gNCkgLSB0aGlzLmNlbGxTaXplKSA6ICgodGhpcy5jYW52YXNSZWN0LndpZHRoICogMyAvIDQpIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcbiAgICAgICAgICAgICAgICB0b3AgOiBhbmdsZSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHNxdWFyZSAoMXgxKSBvciAoMngyKVxuICAgICAqL1xuICAgIF9jcmVhdGVTcXVhcmUoc2l6ZVNxdWFyZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQnJpY2soe1xuICAgICAgICAgICAgICAgIHNpemUgOiB7Y29sIDogMSAqIHNpemVTcXVhcmUsIHJvdyA6MSAqIHNpemVTcXVhcmV9LCBcbiAgICAgICAgICAgICAgICBsZWZ0OiBzaXplU3F1YXJlID09PSAyID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyAyKSAtICgyICogdGhpcy5jZWxsU2l6ZSkpIDogKHRoaXMuY2FudmFzUmVjdC53aWR0aCAtICh0aGlzLmNlbGxTaXplICogMS41KSksXG4gICAgICAgICAgICAgICAgdG9wIDogc2l6ZVNxdWFyZSA9PT0gMiA/IDEgOiAwLFxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJpYyBtZXRob2QgdGhhdCBjcmVhdGUgYSBwZWdcbiAgICAgKi9cbiAgICBfY3JlYXRlQnJpY2sob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLmNlbGxTaXplID0gdGhpcy5jZWxsU2l6ZTtcbiAgICAgICAgb3B0aW9ucy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgdGhpcy5sYXN0Q29sb3I7XG4gICAgICAgIGxldCBwZWcgPSBuZXcgUGVnKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmJyaWNrTW9kZWxbcGVnLmlkXSA9IHBlZztcbiAgICAgICAgLy8gV2UgaGF2ZSB0byB1cGRhdGUgdGhlIHJvd1NlbGVjdCBPYmplY3QgdG8gYmUgYWxzd2F5IHVwZGF0ZVxuICAgICAgICBpZiAob3B0aW9ucy5zaXplLnJvdyA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlID0gcGVnO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYW5nbGUpIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnZlcnRSZWN0ID0gcGVnO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuc2l6ZS5jb2wgPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QgPSBwZWc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUgPSBwZWc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBlZztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluaXQgdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIF9kcmF3Q2FudmFzKCkge1xuICAgICAgICB0aGlzLl9kcmF3V2hpdGVQZWcodGhpcy5jYW52YXNSZWN0LndpZHRoKTtcbiAgICAgICAgdGhpcy5fZHJhd0dyaWQodGhpcy5jYW52YXNSZWN0LndpZHRoLCBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKSk7XG4gICAgfVxuICAgIFxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbi8vIE51bWJlciBvZiBjZWxsIG9uIHRoZSBncmlkXG5leHBvcnQgY29uc3QgTkJfQ0VMTFMgPSAxNTtcblxuLy8gSGVpZ2h0IG9mIHRoZSBoZWFkZXJcbmV4cG9ydCBjb25zdCBIRUFERVJfSEVJR0hUID0gd2luZG93LnNjcmVlbi53aWR0aCA8PSA3NjggID8gNjAgOiAxMDA7XG5cbi8vIEZpcnN0IGNvbG9yIHRvIHVzZVxuZXhwb3J0IGNvbnN0IEJBU0VfTEVHT19DT0xPUiA9IFwiIzBkNjlmMlwiO1xuXG4vLyBNZWRpdW0gU3RvbmUgR3JleSBcbmNvbnN0IENPTE9SXzE5NCA9IFwiI2EzYTJhNFwiO1xuXG4vLyBMaWdodCBTdG9uZSBHcmV5XG5jb25zdCBDT0xPUl8yMDggPSBcIiNlNWU0ZGVcIjsgXG5cbi8vIEJhY2tncm91bmQgY29sb3IgdXNlZFxuZXhwb3J0IGNvbnN0IEJBQ0tHUk9VTkRfTEVHT19DT0xPUiA9IENPTE9SXzIwODsiLCIndXNlIHN0cmljdCdcblxuLypcbiogQ29sb3JzIGZyb20gXG4qIGh0dHA6Ly9sZWdvLndpa2lhLmNvbS93aWtpL0NvbG91cl9QYWxldHRlIFxuKiBBbmQgaHR0cDovL3d3dy5wZWVyb24uY29tL2NnaS1iaW4vaW52Y2dpcy9jb2xvcmd1aWRlLmNnaVxuKiBPbmx5IFNob3cgdGhlIGNvbG9yIHVzZSBzaW5jZSAyMDEwXG4qKi8gXG5leHBvcnQgY29uc3QgTEVHT19DT0xPUlMgPSBbXG4gICAgJ3JnYigyNDUsIDIwNSwgNDcpJywgLy8yNCwgQnJpZ2h0IFllbGxvdyAqXG4gICAgJ3JnYigyNTMsIDIzNCwgMTQwKScsIC8vMjI2LCBDb29sIFllbGxvdyAqXG4gICAgJ3JnYigyMTgsIDEzMywgNjQpJywgLy8xMDYsIEJyaWdodCBPcmFuZ2UgKlxuICAgICdyZ2IoMjMyLCAxNzEsIDQ1KScsIC8vMTkxLCBGbGFtZSBZZWxsb3dpc2ggT3JhbmdlICpcbiAgICAncmdiKDE5NiwgNDAsIDI3KScsIC8vMjEsIEJyaWdodCBSZWQgKlxuICAgICdyZ2IoMTIzLCA0NiwgNDcpJywgLy8xNTQsIERhcmsgUmVkICpcbiAgICAncmdiKDIwNSwgOTgsIDE1MiknLCAvLzIyMSwgQnJpZ2h0IFB1cnBsZSAqXG4gICAgJ3JnYigyMjgsIDE3MywgMjAwKScsIC8vMjIyLCBMaWdodCBQdXJwbGUgKlxuICAgICdyZ2IoMTQ2LCA1NywgMTIwKScsIC8vMTI0LCBCcmlnaHQgUmVkZGlzaCBWaW9sZXQgKlxuICAgICdyZ2IoNTIsIDQzLCAxMTcpJywgLy8yNjgsIE1lZGl1bSBMaWxhYyAqXG4gICAgJ3JnYigxMywgMTA1LCAyNDIpJywgLy8yMywgQnJpZ2h0IEJsdWUgKlxuICAgICdyZ2IoMTU5LCAxOTUsIDIzMyknLCAvLzIxMiwgTGlnaHQgUm95YWwgQmx1ZSAqXG4gICAgJ3JnYigxMTAsIDE1MywgMjAxKScsIC8vMTAyLCBNZWRpdW0gQmx1ZSAqXG4gICAgJ3JnYigzMiwgNTgsIDg2KScsIC8vMTQwLCBFYXJ0aCBCbHVlICpcbiAgICAncmdiKDExNiwgMTM0LCAxNTYpJywgLy8xMzUsIFNhbmQgQmx1ZSAqXG4gICAgJ3JnYig0MCwgMTI3LCA3MCknLCAvLzI4LCBEYXJrIEdyZWVuICpcbiAgICAncmdiKDc1LCAxNTEsIDc0KScsIC8vMzcsIEJpcmdodCBHcmVlbiAqXG4gICAgJ3JnYigxMjAsIDE0NCwgMTI5KScsIC8vMTUxLCBTYW5kIEdyZWVuICpcbiAgICAncmdiKDM5LCA3MCwgNDQpJywgLy8xNDEsIEVhcnRoIEdyZWVuICpcbiAgICAncmdiKDE2NCwgMTg5LCA3MCknLCAvLzExOSwgQnJpZ2h0IFllbGxvd2lzaC1HcmVlbiAqIFxuICAgICdyZ2IoMTA1LCA2NCwgMzkpJywgLy8xOTIsIFJlZGRpc2ggQnJvd24gKlxuICAgICdyZ2IoMjE1LCAxOTcsIDE1MyknLCAvLzUsIEJyaWNrIFllbGxvdyAqIFxuICAgICdyZ2IoMTQ5LCAxMzgsIDExNSknLCAvLzEzOCwgU2FuZCBZZWxsb3cgKlxuICAgICdyZ2IoMTcwLCAxMjUsIDg1KScsIC8vMzEyLCBNZWRpdW0gTm91Z2F0ICogICAgXG4gICAgJ3JnYig0OCwgMTUsIDYpJywgLy8zMDgsIERhcmsgQnJvd24gKlxuICAgICdyZ2IoMjA0LCAxNDIsIDEwNCknLCAvLzE4LCBOb3VnYXQgKlxuICAgICdyZ2IoMjQ1LCAxOTMsIDEzNyknLCAvLzI4MywgTGlnaHQgTm91Z2F0ICpcbiAgICAncmdiKDE2MCwgOTUsIDUyKScsIC8vMzgsIERhcmsgT3JhbmdlICpcbiAgICAncmdiKDI0MiwgMjQzLCAyNDIpJywgLy8xLCBXaGl0ZSAqXG4gICAgJ3JnYigyMjksIDIyOCwgMjIyKScsIC8vMjA4LCBMaWdodCBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDE2MywgMTYyLCAxNjQpJywgLy8xOTQsIE1lZGl1bSBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDk5LCA5NSwgOTcpJywgLy8xOTksIERhcmsgU3RvbmUgR3JleSAqXG4gICAgJ3JnYigyNywgNDIsIDUyKScsIC8vMjYsIEJsYWNrICogICAgICAgIFxuXTsiLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIGEgdmFyaWF0aW9uIG9mIGNvbG9yXG4gKiBcbiAqIEZyb20gOiBodHRwczovL3d3dy5zaXRlcG9pbnQuY29tL2phdmFzY3JpcHQtZ2VuZXJhdGUtbGlnaHRlci1kYXJrZXItY29sb3IvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDb2xvckx1bWluYW5jZShoZXgsIGx1bSkge1xuXG4gICAgICAgIC8vIHZhbGlkYXRlIGhleCBzdHJpbmdcbiAgICAgICAgaGV4ID0gU3RyaW5nKGhleCkucmVwbGFjZSgvW14wLTlhLWZdL2dpLCAnJyk7XG4gICAgICAgIGlmIChoZXgubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xuICAgICAgICB9XG4gICAgICAgIGx1bSA9IGx1bSB8fCAwO1xuXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcbiAgICAgICAgdmFyIHJnYiA9IFwiI1wiLCBjLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpICogMiwgMiksIDE2KTtcbiAgICAgICAgICAgIGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICByZ2IgKz0gKFwiMDBcIiArIGMpLnN1YnN0cihjLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmdiO1xufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDb2xvckx1bWluYW5jZX0gZnJvbSAnLi4vY29tbW9uL3V0aWwuanMnO1xuXG4vKipcbiAqIENpcmNsZSBMZWdvIGNsYXNzXG4gKiBUaGUgY2lyY2xlIGlzIGNvbXBvc2VkIG9mIDIgY2lyY2xlIChvbiB0aGUgc2hhZG93LCBhbmQgdGhlIG90aGVyIG9uZSBmb3IgdGhlIHRvcClcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgQ2lyY2xle1xuICAgIGNvbnN0cnVjdG9yKGNlbGxTaXplLCBjb2xvcil7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDUsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc2hhZG93IDogXCIwcHggMnB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eCA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA0LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBmYWJyaWMuVGV4dCgnR0RHJywge1xuICAgICAgICAgICAgZm9udFNpemU6IGNlbGxTaXplIC8gNSxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc3Ryb2tlOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoW3RoaXMuY2lyY2xlQmFzaWNFdHgsIHRoaXMuY2lyY2xlQmFzaWMsIHRoaXMudGV4dF0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgRmFicmljSlMgZWxlbWVudFxuICAgICAqL1xuICAgIGdldCBjYW52YXNFbHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7IFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIGNpcmNsZVxuICAgICAqL1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYy5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSkpO1xuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4LnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpKTtcbiAgICAgICAgdGhpcy50ZXh0LnNldCh7XG4gICAgICAgICAgICBmaWxsIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcbiAgICAgICAgICAgIHN0cm9rZSA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMClcbiAgICAgICAgfSk7XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4vY2lyY2xlLmpzJztcblxuLyoqXG4gKiBQZWcgTGVnbyBjbGFzc1xuICogVGhlIHBlZyBpcyBjb21wb3NlZCBvZiBuIGNpcmNsZSBmb3IgYSBkaW1lbnNpb24gdGhhdCBkZXBlbmQgb24gdGhlIHNpemUgcGFyYW1ldGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBQZWd7XG4gICAgY29uc3RydWN0b3Ioe3NpemUgPSB7Y29sIDogMSwgcm93IDogMX0sIGNlbGxTaXplID0gMCwgY29sb3IgPSAnI0ZGRicsIGxlZnQgPSAwLCB0b3AgPSAwLCBhbmdsZSA9IDB9KXtcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5pZCA9IGBQZWcke3NpemV9LSR7RGF0ZS5ub3coKX1gO1xuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZSB8fCAwO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5ID0gW107XG5cblxuICAgICAgICB0aGlzLnJlY3RCYXNpYyA9IG5ldyBmYWJyaWMuUmVjdCh7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUgKiBzaXplLmNvbCxcbiAgICAgICAgICAgIGhlaWdodDogY2VsbFNpemUgKiBzaXplLnJvdyxcbiAgICAgICAgICAgIGZpbGw6IGNvbG9yLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjVweCA1cHggMTBweCByZ2JhKDAsMCwwLDAuMilcIiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGxldCBhcnJheUVsdHMgPSBbdGhpcy5yZWN0QmFzaWNdO1xuICAgICAgICBsZXQgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7ICAgICAgIFxuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gdGhlIHNpemUsIHdlIGRvbid0IHBsYWNlIHRoZSBjaXJjbGVzIGF0IHRoZSBzYW1lIHBsYWNlXG4gICAgICAgIGlmIChzaXplLmNvbCA9PT0gMil7XG4gICAgICAgICAgICAvLyBGb3IgYSByZWN0YW5nbGUgb3IgYSBiaWcgU3F1YXJlXG4gICAgICAgICAgICAvLyBXZSB1cGRhdGUgdGhlIHJvdyBwb3NpdGlvbnNcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT5hcnJheUVsdHMucHVzaChjaXJjbGUuY2FudmFzRWx0KSk7XG5cbiAgICAgICAgLy8gVGhlIHBlZyBpcyBsb2NrZWQgaW4gYWxsIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKGFycmF5RWx0cywge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5sZWZ0LFxuICAgICAgICAgICAgdG9wOiB0aGlzLnRvcCxcbiAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxuICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2UgYWRkIHRvIEZhYnJpY0VsZW1lbnQgYSByZWZlcmVuY2UgdG8gdGhlIGN1cmVudCBwZWdcbiAgICAgICAgdGhpcy5ncm91cC5wYXJlbnRQZWcgPSB0aGlzOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gVGhlIEZhYnJpY0pTIGVsZW1lbnRcbiAgICBnZXQgY2FudmFzRWx0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwO1xuICAgIH1cblxuICAgIC8vIFRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIHJlcGxhY2VkXG4gICAgZ2V0IHJlcGxhY2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXBsYWNlXG4gICAgfVxuXG4gICAgLy8gU2V0dGVyIGZvciBpc1JlcGxhY2UgcGFyYW1cbiAgICBzZXQgcmVwbGFjZShyZXBsYWNlKXtcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSByZXBsYWNlO1xuICAgIH1cblxuICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHBlZ1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnJlY3RCYXNpYy5zZXQoJ2ZpbGwnLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+IGNpcmNsZS5jaGFuZ2VDb2xvcihjb2xvcikpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gTW92ZSB0aGUgcGVnIHRvIGRlc2lyZSBwb3NpdGlvblxuICAgIG1vdmUobGVmdCwgdG9wKXtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcbiAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgbGVmdCA6IGxlZnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUm90YXRlIHRoZSBwZWcgdG8gdGhlIGRlc2lyZSBhbmdsZVxuICAgIHJvdGF0ZShhbmdsZSl7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xuICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxuICAgICAgICB9KTtcbiAgICB9XG5cbn0iXX0=
