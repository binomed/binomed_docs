(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _firebase = require('./firebase/firebase.js');

var _firebaseAuth = require('./firebase/firebaseAuth.js');

var _legoCanvas = require('./canvas/legoCanvas.js');

var _player = require('./audio/player.js');

var _player2 = require('./video/player.js');

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
    minutesElt = null,
        // Html element for minutes
    secondsElt = null,
        // Html element for seconds
    countDownParentElt = null,
        // Html element parent of minutes and seconds
    lastLeft = false,
        // True if the last photo was placed at the left of the countDown
    targetDate = moment('2016-11-09, 09:00:00:000', "YYYY-MM-DD, HH:mm:ss:SSS"),
        // The timeout date
    readyForNewDraw = true,
        audioPlayer = null,
        endShow = false;

    function initGame() {

        legoCanvas = new _legoCanvas.LegoGridCanvas('canvasDraw', false);

        getNextDraw();
    }

    /**
     * Generate a snapshot of the draw with a flash effect
     */
    function generateSnapshot(user, dataUrl) {
        // We start our flash effect
        var rectCanvas = document.querySelector('.canvas-container').getBoundingClientRect();
        var flashDiv = document.getElementById('flash-effect');
        flashDiv.style.top = rectCanvas.top - 250 + "px";
        flashDiv.style.left = rectCanvas.left - 250 + "px";
        flashDiv.classList.add('flash');
        //When the animation is done (1s of opacity .7 -> 0 => ~500ms to wait)
        setTimeout(function () {
            // We create the final image
            // We create a div that we will be animate
            flashDiv.classList.remove('flash');
            var imgParent = document.createElement('div');
            var img = document.createElement('img');
            img.src = dataUrl;
            img.classList.add('img-ori');
            imgParent.classList.add('img-ori-parent');
            imgParent.setAttribute('data-author', user);
            imgParent.appendChild(img);
            imgParent.classList.add('big');
            // Initial Position
            imgParent.style.top = rectCanvas.top - 45 + "px";
            imgParent.style.left = rectCanvas.left - 45 + "px";

            document.body.appendChild(imgParent);

            // we wait a litle to set new position to the new div. The css animation will do the rest of the job
            setTimeout(function () {

                var horizontalDist = Math.floor(Math.random() * 300) + 1;
                var heightScreen = document.body.getBoundingClientRect().height;
                var verticalDist = Math.floor(Math.random() * (heightScreen - 100 - 300)) + 1;
                var angleChoice = Math.floor(Math.random() * 3) + 1;

                imgParent.classList.remove('big');
                imgParent.style.top = 'calc(100px + ' + verticalDist + 'px)';
                imgParent.style.left = horizontalDist + 'px';
                if (!lastLeft) {
                    // True if the last photo was placed at the left of the countDown
                    imgParent.style.left = 'calc(100vw - ' + horizontalDist + 'px - 300px)'; // The timeout date          
                }
                lastLeft = !lastLeft; // True if the last photo was placed at the left of the countDown
                var angle = angleChoice === 1 ? -9 : angleChoice === 2 ? 14 : 0; // The timeout date
                imgParent.style.transform = 'rotate(' + angle + 'deg)';
                getNextDraw();
            }, 100);

            // When the element is create, we clean the board
            legoCanvas.resetBoard();
            document.getElementById('proposition-text').innerHTML = "En attente de proposition";
        }, 500);
    }

    function pageLoad() {

        audioPlayer = new _player.AudioPlayer();

        fireBaseLego = new _firebase.FireBaseLegoApp().app;
        var fireBaseAuth = new _firebaseAuth.FireBaseAuth({
            idDivLogin: 'login-msg',
            idNextDiv: 'game',
            idLogout: 'signout'
        });

        // Only an authenticate user can see the validated draw !
        fireBaseAuth.onAuthStateChanged(function (user) {
            if (user) {
                if (!gameInit) {
                    gameInit = true;
                    initGame();
                }
            }
        });

        fireBaseLego.database().ref('drawValidated').on('child_added', function (data) {
            if (readyForNewDraw) {
                getNextDraw();
            }
        });

        minutesElt = document.getElementById('minutes');
        secondsElt = document.getElementById('seconds');
        countDownParentElt = document.getElementById('count-down-text');

        // To remove if you want to use the target date define at the top of the class
        targetDate = moment();
        targetDate.add(30, 'minutes');
        //targetDate.add(5, 'seconds');
        // We start our text animation
        window.requestAnimationFrame(checkTime);
    }

    /**
     * Animate the text according to the current time
     */
    function checkTime() {

        if (moment().isAfter(targetDate)) {
            endShow = true;
            endCountDown();
        } else {
            var diff = targetDate.diff(moment());
            minutesElt.innerHTML = new Intl.NumberFormat("fr", { minimumIntegerDigits: 2, useGrouping: false }).format(Math.floor(diff / (60 * 1000)));
            secondsElt.innerHTML = new Intl.NumberFormat("fr", { minimumIntegerDigits: 2, useGrouping: false }).format(Math.floor(diff % (60 * 1000) / 1000));
            audioPlayer.manageSoundVolume(diff);
            if (diff < 60 * 1000) {
                countDownParentElt.classList.add('last-minute');
            }

            window.requestAnimationFrame(checkTime);
        }
    }

    /**
     * Show the next draw
     */
    function getNextDraw() {
        if (endShow) {
            return;
        }
        readyForNewDraw = false;
        fireBaseLego.database().ref('drawValidated').once('value', function (snapshot) {
            if (snapshot && snapshot.val()) {
                // First we get the draw
                currentDraw = snapshot;
                var snapshotFb = snapshot.val();
                var keys = Object.keys(snapshotFb);
                currentKey = keys[0];
                currentDraw = snapshotFb[keys[0]];
                legoCanvas.drawInstructions(currentDraw);

                document.getElementById('proposition-text').innerHTML = 'Proposition de ' + currentDraw.user;
                setTimeout(function () {
                    // After we update the draw
                    var dataUrl = legoCanvas.snapshot();
                    currentDraw.dataUrl = dataUrl;
                    currentDraw.accepted = true;
                    // We clean the draw before to save it
                    delete currentDraw.instructions;
                    fireBaseLego.database().ref('/drawSaved/' + currentDraw.userId).push(currentDraw);
                    delete currentDraw.userId;
                    fireBaseLego.database().ref('drawValidated/' + currentKey).remove();
                    fireBaseLego.database().ref("/drawShow").push(currentDraw);
                    // We finaly generate the image
                    generateSnapshot(currentDraw.user, legoCanvas.snapshot());
                }, 2000);
            } else {
                readyForNewDraw = true;
                document.getElementById('proposition-text').innerHTML = "En attente de proposition";
            }
        }, function (err) {
            console.error(err);
            // error callback triggered with PERMISSION_DENIED
        });
    }

    function endCountDown() {
        var opacityElt = document.getElementById('opacity');
        opacityElt.classList.add('black');
        setTimeout(function () {
            return new _player2.VideoPlayer(opacityElt, function () {
                return console.log('end');
            }).playVideo();
        }, 4000);
    }

    window.addEventListener('load', pageLoad);
})();

},{"./audio/player.js":2,"./canvas/legoCanvas.js":4,"./firebase/firebase.js":8,"./firebase/firebaseAuth.js":9,"./video/player.js":12}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioPlayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _playlist = require('./playlist.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for playing music
 * 
 * We create an insible audio element and we play music on it
 */
var AudioPlayer = exports.AudioPlayer = function () {
    function AudioPlayer() {
        _classCallCheck(this, AudioPlayer);

        this.indexPlayList = 0;
        this.audioElt = document.createElement('audio');
        this.audioElt.style.display = 'none';
        document.body.appendChild(this.audioElt);
        this._nextSong();
    }

    /**
     * Play a song according to the url of song
     */


    _createClass(AudioPlayer, [{
        key: '_playSound',
        value: function _playSound(url) {
            this.audioElt.pause();
            this.audioElt.src = url;
            this.audioElt.play();
            this.audioElt.onended = this._nextSong.bind(this);
        }

        /**
         * Skip to the next song
         */

    }, {
        key: '_nextSong',
        value: function _nextSong() {
            try {
                this._playSound('./assets/audio/' + _playlist.PLAYLIST[this.indexPlayList]);
                this.indexPlayList = (this.indexPlayList + 1) % _playlist.PLAYLIST.length;
            } catch (err) {
                console.error(err);
            }
        }

        /**
         * Update the sound volume of audio element
         */

    }, {
        key: 'manageSoundVolume',
        value: function manageSoundVolume(delta) {
            if (delta < 10 * 1000) {
                this.audioElt.volume = Math.min(Math.max(0, delta / (10 * 1000)), 0.5);
            }
        }
    }]);

    return AudioPlayer;
}();

},{"./playlist.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var PLAYLIST = exports.PLAYLIST = [''];

},{}],4:[function(require,module,exports){
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

},{"../common/const.js":5,"../common/legoColors.js":6,"../lego_shape/circle.js":10,"../lego_shape/peg.js":11}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"../common/util.js":7}],11:[function(require,module,exports){
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

},{"./circle.js":10}],12:[function(require,module,exports){
'use strict';

/**
 * Class for playing video 
 * 
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoPlayer = exports.VideoPlayer = function () {
    function VideoPlayer(parentElt, callBackEnd) {
        _classCallCheck(this, VideoPlayer);

        this.videoElt = document.createElement('video');
        parentElt.appendChild(this.videoElt);
        this.videoName = '';
        this.callBackEnd = callBackEnd;
    }

    /**
     * Play the video
     */


    _createClass(VideoPlayer, [{
        key: 'playVideo',
        value: function playVideo() {
            this.videoElt.pause();
            this.videoElt.src = './assets/video/' + this.videoName;
            this.videoElt.play();
            this.videoElt.onended = this.callBackEnd.bind(this);
        }
    }]);

    return VideoPlayer;
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfc2NyZWVuLmpzIiwic3JjL3NjcmlwdHMvYXVkaW8vcGxheWVyLmpzIiwic3JjL3NjcmlwdHMvYXVkaW8vcGxheWxpc3QuanMiLCJzcmMvc2NyaXB0cy9jYW52YXMvbGVnb0NhbnZhcy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9jb25zdC5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9sZWdvQ29sb3JzLmpzIiwic3JjL3NjcmlwdHMvY29tbW9uL3V0aWwuanMiLCJzcmMvc2NyaXB0cy9maXJlYmFzZS9maXJlYmFzZS5qcyIsInNyYy9zY3JpcHRzL2ZpcmViYXNlL2ZpcmViYXNlQXV0aC5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvY2lyY2xlLmpzIiwic3JjL3NjcmlwdHMvbGVnb19zaGFwZS9wZWcuanMiLCJzcmMvc2NyaXB0cy92aWRlby9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxDQUFDLFlBQVk7O0FBRVQsUUFBSSxXQUFXLEtBQWY7QUFBQSxRQUFxQjtBQUNqQixtQkFBZSxJQURuQjtBQUFBLFFBQ3dCO0FBQ3BCLGlCQUFhLElBRmpCO0FBQUEsUUFFdUI7QUFDbkIsaUJBQWEsSUFIakI7QUFBQSxRQUd1QjtBQUNuQixrQkFBYyxJQUpsQjtBQUFBLFFBSXVCO0FBQ25CLGlCQUFhLElBTGpCO0FBQUEsUUFLdUI7QUFDbkIsaUJBQWEsSUFOakI7QUFBQSxRQU11QjtBQUNuQix5QkFBcUIsSUFQekI7QUFBQSxRQU8rQjtBQUMzQixlQUFXLEtBUmY7QUFBQSxRQVFzQjtBQUNsQixpQkFBYSxPQUFPLDBCQUFQLEVBQW1DLDBCQUFuQyxDQVRqQjtBQUFBLFFBU2lGO0FBQzdFLHNCQUFrQixJQVZ0QjtBQUFBLFFBV0ksY0FBYyxJQVhsQjtBQUFBLFFBWUks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YUFBSyxRQUFMLEdBQWdCLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFoQjtBQUNBLGtCQUFVLFdBQVYsQ0FBc0IsS0FBSyxRQUEzQjtBQUNBLGFBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLGFBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNIOztBQUVEOzs7Ozs7O29DQUdXO0FBQ1AsaUJBQUssUUFBTCxDQUFjLEtBQWQ7QUFDQSxpQkFBSyxRQUFMLENBQWMsR0FBZCx1QkFBc0MsS0FBSyxTQUEzQztBQUNBLGlCQUFLLFFBQUwsQ0FBYyxJQUFkO0FBQ0EsaUJBQUssUUFBTCxDQUFjLE9BQWQsR0FBd0IsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQXhCO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0ZpcmVCYXNlTGVnb0FwcH0gZnJvbSAnLi9maXJlYmFzZS9maXJlYmFzZS5qcyc7XG5pbXBvcnQge0ZpcmVCYXNlQXV0aH0gZnJvbSAnLi9maXJlYmFzZS9maXJlYmFzZUF1dGguanMnO1xuaW1wb3J0IHtMZWdvR3JpZENhbnZhc30gZnJvbSAnLi9jYW52YXMvbGVnb0NhbnZhcy5qcyc7XG5pbXBvcnQge0F1ZGlvUGxheWVyfSBmcm9tICcuL2F1ZGlvL3BsYXllci5qcyc7XG5pbXBvcnQge1ZpZGVvUGxheWVyfSBmcm9tICcuL3ZpZGVvL3BsYXllci5qcyc7XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXQgZ2FtZUluaXQgPSBmYWxzZSwvLyB0cnVlIGlmIHdlIGluaXQgdGhlIGxlZ29HcmlkXG4gICAgICAgIGZpcmVCYXNlTGVnbyA9IG51bGwsLy8gdGhlIHJlZmVyZW5jZSBvZiB0aGUgZmlyZUJhc2VBcHBcbiAgICAgICAgbGVnb0NhbnZhcyA9IG51bGwsIC8vIFRoZSBsZWdvR3JpZFxuICAgICAgICBjdXJyZW50S2V5ID0gbnVsbCwgLy8gVGhlIGN1cmVudCBmaXJlYmFzZSBkcmF3IGtleVxuICAgICAgICBjdXJyZW50RHJhdyA9IG51bGwsLy8gVGhlIGN1cmVudCBmaXJlYmFzZSBkcmF3XG4gICAgICAgIG1pbnV0ZXNFbHQgPSBudWxsLCAvLyBIdG1sIGVsZW1lbnQgZm9yIG1pbnV0ZXNcbiAgICAgICAgc2Vjb25kc0VsdCA9IG51bGwsIC8vIEh0bWwgZWxlbWVudCBmb3Igc2Vjb25kc1xuICAgICAgICBjb3VudERvd25QYXJlbnRFbHQgPSBudWxsLCAvLyBIdG1sIGVsZW1lbnQgcGFyZW50IG9mIG1pbnV0ZXMgYW5kIHNlY29uZHNcbiAgICAgICAgbGFzdExlZnQgPSBmYWxzZSwgLy8gVHJ1ZSBpZiB0aGUgbGFzdCBwaG90byB3YXMgcGxhY2VkIGF0IHRoZSBsZWZ0IG9mIHRoZSBjb3VudERvd25cbiAgICAgICAgdGFyZ2V0RGF0ZSA9IG1vbWVudCgnMjAxNi0xMS0wOSwgMDk6MDA6MDA6MDAwJywgXCJZWVlZLU1NLURELCBISDptbTpzczpTU1NcIiksIC8vIFRoZSB0aW1lb3V0IGRhdGVcbiAgICAgICAgcmVhZHlGb3JOZXdEcmF3ID0gdHJ1ZSxcbiAgICAgICAgYXVkaW9QbGF5ZXIgPSBudWxsLFxuICAgICAgICBlbmRTaG93ID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBpbml0R2FtZSgpIHtcblxuICAgICAgICBsZWdvQ2FudmFzID0gbmV3IExlZ29HcmlkQ2FudmFzKCdjYW52YXNEcmF3JywgZmFsc2UpO1xuXG4gICAgICAgIGdldE5leHREcmF3KCk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhIHNuYXBzaG90IG9mIHRoZSBkcmF3IHdpdGggYSBmbGFzaCBlZmZlY3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNuYXBzaG90KHVzZXIsIGRhdGFVcmwpIHtcbiAgICAgICAgLy8gV2Ugc3RhcnQgb3VyIGZsYXNoIGVmZmVjdFxuICAgICAgICBsZXQgcmVjdENhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYW52YXMtY29udGFpbmVyJykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGxldCBmbGFzaERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbGFzaC1lZmZlY3QnKVxuICAgICAgICBmbGFzaERpdi5zdHlsZS50b3AgPSAocmVjdENhbnZhcy50b3AgLSAyNTApICsgXCJweFwiO1xuICAgICAgICBmbGFzaERpdi5zdHlsZS5sZWZ0ID0gKHJlY3RDYW52YXMubGVmdCAtIDI1MCkgKyBcInB4XCI7XG4gICAgICAgIGZsYXNoRGl2LmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XG4gICAgICAgIC8vV2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUgKDFzIG9mIG9wYWNpdHkgLjcgLT4gMCA9PiB+NTAwbXMgdG8gd2FpdClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIGZpbmFsIGltYWdlXG4gICAgICAgICAgICAvLyBXZSBjcmVhdGUgYSBkaXYgdGhhdCB3ZSB3aWxsIGJlIGFuaW1hdGVcbiAgICAgICAgICAgIGZsYXNoRGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoJyk7XG4gICAgICAgICAgICBsZXQgaW1nUGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBpbWcuc3JjID0gZGF0YVVybDtcbiAgICAgICAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdpbWctb3JpJyk7XG4gICAgICAgICAgICBpbWdQYXJlbnQuY2xhc3NMaXN0LmFkZCgnaW1nLW9yaS1wYXJlbnQnKTtcbiAgICAgICAgICAgIGltZ1BhcmVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0aG9yJywgdXNlcik7XG4gICAgICAgICAgICBpbWdQYXJlbnQuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgIGltZ1BhcmVudC5jbGFzc0xpc3QuYWRkKCdiaWcnKTtcbiAgICAgICAgICAgIC8vIEluaXRpYWwgUG9zaXRpb25cbiAgICAgICAgICAgIGltZ1BhcmVudC5zdHlsZS50b3AgPSAocmVjdENhbnZhcy50b3AgLSA0NSkgKyBcInB4XCI7XG4gICAgICAgICAgICBpbWdQYXJlbnQuc3R5bGUubGVmdCA9IChyZWN0Q2FudmFzLmxlZnQgLSA0NSkgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nUGFyZW50KTtcblxuICAgICAgICAgICAgLy8gd2Ugd2FpdCBhIGxpdGxlIHRvIHNldCBuZXcgcG9zaXRpb24gdG8gdGhlIG5ldyBkaXYuIFRoZSBjc3MgYW5pbWF0aW9uIHdpbGwgZG8gdGhlIHJlc3Qgb2YgdGhlIGpvYlxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaG9yaXpvbnRhbERpc3QgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzMDApICsgMTtcbiAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0U2NyZWVuID0gZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGV0IHZlcnRpY2FsRGlzdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChoZWlnaHRTY3JlZW4gLSAxMDAgLSAzMDApKSArIDE7XG4gICAgICAgICAgICAgICAgbGV0IGFuZ2xlQ2hvaWNlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMykgKyAxO1xuXG4gICAgICAgICAgICAgICAgaW1nUGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2JpZycpO1xuICAgICAgICAgICAgICAgIGltZ1BhcmVudC5zdHlsZS50b3AgPSBgY2FsYygxMDBweCArICR7dmVydGljYWxEaXN0fXB4KWA7XG4gICAgICAgICAgICAgICAgaW1nUGFyZW50LnN0eWxlLmxlZnQgPSBgJHtob3Jpem9udGFsRGlzdH1weGA7XG4gICAgICAgICAgICAgICAgaWYgKCFsYXN0TGVmdCkgeyAvLyBUcnVlIGlmIHRoZSBsYXN0IHBob3RvIHdhcyBwbGFjZWQgYXQgdGhlIGxlZnQgb2YgdGhlIGNvdW50RG93blxuICAgICAgICAgICAgICAgICAgICBpbWdQYXJlbnQuc3R5bGUubGVmdCA9IGBjYWxjKDEwMHZ3IC0gJHtob3Jpem9udGFsRGlzdH1weCAtIDMwMHB4KWA7ICAgICAgICAgICAvLyBUaGUgdGltZW91dCBkYXRlICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0TGVmdCA9ICFsYXN0TGVmdDsgLy8gVHJ1ZSBpZiB0aGUgbGFzdCBwaG90byB3YXMgcGxhY2VkIGF0IHRoZSBsZWZ0IG9mIHRoZSBjb3VudERvd25cbiAgICAgICAgICAgICAgICBsZXQgYW5nbGUgPSBhbmdsZUNob2ljZSA9PT0gMSA/IC05IDogYW5nbGVDaG9pY2UgPT09IDIgPyAxNCA6IDA7IC8vIFRoZSB0aW1lb3V0IGRhdGVcbiAgICAgICAgICAgICAgICBpbWdQYXJlbnQuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xuICAgICAgICAgICAgICAgIGdldE5leHREcmF3KCk7XG4gICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICAvLyBXaGVuIHRoZSBlbGVtZW50IGlzIGNyZWF0ZSwgd2UgY2xlYW4gdGhlIGJvYXJkXG4gICAgICAgICAgICBsZWdvQ2FudmFzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wb3NpdGlvbi10ZXh0JykuaW5uZXJIVE1MID0gXCJFbiBhdHRlbnRlIGRlIHByb3Bvc2l0aW9uXCI7XG5cbiAgICAgICAgfSwgNTAwKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGF1ZGlvUGxheWVyID0gbmV3IEF1ZGlvUGxheWVyKCk7XG5cbiAgICAgICAgZmlyZUJhc2VMZWdvID0gbmV3IEZpcmVCYXNlTGVnb0FwcCgpLmFwcDtcbiAgICAgICAgbGV0IGZpcmVCYXNlQXV0aCA9IG5ldyBGaXJlQmFzZUF1dGgoe1xuICAgICAgICAgICAgaWREaXZMb2dpbjogJ2xvZ2luLW1zZycsXG4gICAgICAgICAgICBpZE5leHREaXY6ICdnYW1lJyxcbiAgICAgICAgICAgIGlkTG9nb3V0OiAnc2lnbm91dCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gT25seSBhbiBhdXRoZW50aWNhdGUgdXNlciBjYW4gc2VlIHRoZSB2YWxpZGF0ZWQgZHJhdyAhXG4gICAgICAgIGZpcmVCYXNlQXV0aC5vbkF1dGhTdGF0ZUNoYW5nZWQoKHVzZXIpID0+IHtcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFnYW1lSW5pdCkge1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5pdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGluaXRHYW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoJ2RyYXdWYWxpZGF0ZWQnKS5vbignY2hpbGRfYWRkZWQnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKHJlYWR5Rm9yTmV3RHJhdykge1xuICAgICAgICAgICAgICAgIGdldE5leHREcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1pbnV0ZXNFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWludXRlcycpO1xuICAgICAgICBzZWNvbmRzRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY29uZHMnKTtcbiAgICAgICAgY291bnREb3duUGFyZW50RWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvdW50LWRvd24tdGV4dCcpO1xuXG4gICAgICAgIC8vIFRvIHJlbW92ZSBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIHRhcmdldCBkYXRlIGRlZmluZSBhdCB0aGUgdG9wIG9mIHRoZSBjbGFzc1xuICAgICAgICB0YXJnZXREYXRlID0gbW9tZW50KCk7XG4gICAgICAgIHRhcmdldERhdGUuYWRkKDMwLCAnbWludXRlcycpO1xuICAgICAgICAvL3RhcmdldERhdGUuYWRkKDUsICdzZWNvbmRzJyk7XG4gICAgICAgIC8vIFdlIHN0YXJ0IG91ciB0ZXh0IGFuaW1hdGlvblxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrVGltZSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmltYXRlIHRoZSB0ZXh0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCB0aW1lXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hlY2tUaW1lKCkge1xuXG4gICAgICAgIGlmIChtb21lbnQoKS5pc0FmdGVyKHRhcmdldERhdGUpKSB7XG4gICAgICAgICAgICBlbmRTaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIGVuZENvdW50RG93bigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGRpZmYgPSB0YXJnZXREYXRlLmRpZmYobW9tZW50KCkpO1xuICAgICAgICAgICAgbWludXRlc0VsdC5pbm5lckhUTUwgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoXCJmclwiLCB7IG1pbmltdW1JbnRlZ2VyRGlnaXRzOiAyLCB1c2VHcm91cGluZzogZmFsc2UgfSlcbiAgICAgICAgICAgICAgICAuZm9ybWF0KE1hdGguZmxvb3IoZGlmZiAvICg2MCAqIDEwMDApKSk7XG4gICAgICAgICAgICBzZWNvbmRzRWx0LmlubmVySFRNTCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChcImZyXCIsIHsgbWluaW11bUludGVnZXJEaWdpdHM6IDIsIHVzZUdyb3VwaW5nOiBmYWxzZSB9KVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoTWF0aC5mbG9vcihkaWZmICUgKDYwICogMTAwMCkgLyAxMDAwKSk7XG4gICAgICAgICAgICBhdWRpb1BsYXllci5tYW5hZ2VTb3VuZFZvbHVtZShkaWZmKTtcbiAgICAgICAgICAgIGlmIChkaWZmIDwgNjAgKiAxMDAwKXtcbiAgICAgICAgICAgICAgICBjb3VudERvd25QYXJlbnRFbHQuY2xhc3NMaXN0LmFkZCgnbGFzdC1taW51dGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjaGVja1RpbWUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBuZXh0IGRyYXdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXROZXh0RHJhdygpIHtcbiAgICAgICAgaWYgKGVuZFNob3cpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlYWR5Rm9yTmV3RHJhdyA9IGZhbHNlO1xuICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoJ2RyYXdWYWxpZGF0ZWQnKS5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuICAgICAgICAgICAgaWYgKHNuYXBzaG90ICYmIHNuYXBzaG90LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgLy8gRmlyc3Qgd2UgZ2V0IHRoZSBkcmF3XG4gICAgICAgICAgICAgICAgY3VycmVudERyYXcgPSBzbmFwc2hvdDtcbiAgICAgICAgICAgICAgICBsZXQgc25hcHNob3RGYiA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoc25hcHNob3RGYik7XG4gICAgICAgICAgICAgICAgY3VycmVudEtleSA9IGtleXNbMF07XG4gICAgICAgICAgICAgICAgY3VycmVudERyYXcgPSBzbmFwc2hvdEZiW2tleXNbMF1dO1xuICAgICAgICAgICAgICAgIGxlZ29DYW52YXMuZHJhd0luc3RydWN0aW9ucyhjdXJyZW50RHJhdyk7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvcG9zaXRpb24tdGV4dCcpLmlubmVySFRNTCA9IGBQcm9wb3NpdGlvbiBkZSAke2N1cnJlbnREcmF3LnVzZXJ9YDtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWZ0ZXIgd2UgdXBkYXRlIHRoZSBkcmF3XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhVXJsID0gbGVnb0NhbnZhcy5zbmFwc2hvdCgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RHJhdy5kYXRhVXJsID0gZGF0YVVybDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERyYXcuYWNjZXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBjbGVhbiB0aGUgZHJhdyBiZWZvcmUgdG8gc2F2ZSBpdFxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY3VycmVudERyYXcuaW5zdHJ1Y3Rpb25zO1xuICAgICAgICAgICAgICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoYC9kcmF3U2F2ZWQvJHtjdXJyZW50RHJhdy51c2VySWR9YCkucHVzaChjdXJyZW50RHJhdyk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjdXJyZW50RHJhdy51c2VySWQ7XG4gICAgICAgICAgICAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZihgZHJhd1ZhbGlkYXRlZC8ke2N1cnJlbnRLZXl9YCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZihcIi9kcmF3U2hvd1wiKS5wdXNoKGN1cnJlbnREcmF3KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgZmluYWx5IGdlbmVyYXRlIHRoZSBpbWFnZVxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVNuYXBzaG90KGN1cnJlbnREcmF3LnVzZXIsIGxlZ29DYW52YXMuc25hcHNob3QoKSlcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVhZHlGb3JOZXdEcmF3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvcG9zaXRpb24tdGV4dCcpLmlubmVySFRNTCA9IFwiRW4gYXR0ZW50ZSBkZSBwcm9wb3NpdGlvblwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrIHRyaWdnZXJlZCB3aXRoIFBFUk1JU1NJT05fREVOSUVEXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gZW5kQ291bnREb3duKCl7XG4gICAgICAgIGNvbnN0IG9wYWNpdHlFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3BhY2l0eScpO1xuICAgICAgICBvcGFjaXR5RWx0LmNsYXNzTGlzdC5hZGQoJ2JsYWNrJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCk9Pm5ldyBWaWRlb1BsYXllcihvcGFjaXR5RWx0LCAoKT0+Y29uc29sZS5sb2coJ2VuZCcpKS5wbGF5VmlkZW8oKSwgNDAwMCk7XG4gICAgfVxuXG4gICAgXG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7UExBWUxJU1R9IGZyb20gJy4vcGxheWxpc3QuanMnO1xuXG4vKipcbiAqIENsYXNzIGZvciBwbGF5aW5nIG11c2ljXG4gKiBcbiAqIFdlIGNyZWF0ZSBhbiBpbnNpYmxlIGF1ZGlvIGVsZW1lbnQgYW5kIHdlIHBsYXkgbXVzaWMgb24gaXRcbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvUGxheWVye1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuaW5kZXhQbGF5TGlzdCA9IDA7XG4gICAgICAgIHRoaXMuYXVkaW9FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICB0aGlzLmF1ZGlvRWx0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5hdWRpb0VsdCk7XG4gICAgICAgIHRoaXMuX25leHRTb25nKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxheSBhIHNvbmcgYWNjb3JkaW5nIHRvIHRoZSB1cmwgb2Ygc29uZ1xuICAgICAqL1xuICAgIF9wbGF5U291bmQodXJsKXtcbiAgICAgICAgdGhpcy5hdWRpb0VsdC5wYXVzZSgpO1xuICAgICAgICB0aGlzLmF1ZGlvRWx0LnNyYyA9IHVybDtcbiAgICAgICAgdGhpcy5hdWRpb0VsdC5wbGF5KCk7XG4gICAgICAgIHRoaXMuYXVkaW9FbHQub25lbmRlZCA9IHRoaXMuX25leHRTb25nLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2tpcCB0byB0aGUgbmV4dCBzb25nXG4gICAgICovXG4gICAgX25leHRTb25nKCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMuX3BsYXlTb3VuZChgLi9hc3NldHMvYXVkaW8vJHtQTEFZTElTVFt0aGlzLmluZGV4UGxheUxpc3RdfWApO1xuICAgICAgICAgICAgdGhpcy5pbmRleFBsYXlMaXN0ID0gKHRoaXMuaW5kZXhQbGF5TGlzdCArIDEpICUgUExBWUxJU1QubGVuZ3RoO1xuICAgICAgICB9Y2F0Y2goZXJyKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgc291bmQgdm9sdW1lIG9mIGF1ZGlvIGVsZW1lbnRcbiAgICAgKi9cbiAgICBtYW5hZ2VTb3VuZFZvbHVtZShkZWx0YSl7XG4gICAgICAgIGlmIChkZWx0YSA8IDEwICogMTAwMCl7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvRWx0LnZvbHVtZSA9IE1hdGgubWluKE1hdGgubWF4KDAsZGVsdGEgLyAoMTAgKiAxMDAwKSksMC41KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjb25zdCBQTEFZTElTVCA9IFtcbiAgICAnJyAgICBcbl07IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge1BlZ30gZnJvbSAnLi4vbGVnb19zaGFwZS9wZWcuanMnO1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4uL2xlZ29fc2hhcGUvY2lyY2xlLmpzJztcbmltcG9ydCB7TkJfQ0VMTFMsIEhFQURFUl9IRUlHSFQsIEJBU0VfTEVHT19DT0xPUiwgQkFDS0dST1VORF9MRUdPX0NPTE9SfSBmcm9tICcuLi9jb21tb24vY29uc3QuanMnO1xuaW1wb3J0IHtsZWdvQmFzZUNvbG9yfSBmcm9tICcuLi9jb21tb24vbGVnb0NvbG9ycy5qcyc7XG5cbi8qKlxuICogXG4gKiBDbGFzcyBmb3IgQ2FudmFzIEdyaWRcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgTGVnb0dyaWRDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBzaG93Um93KSB7XG4gICAgICAgIC8vIEJhc2ljIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhc0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgLy8gU2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXNSZWN0ID0gdGhpcy5jYW52YXNFbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIC8vIEluZGljYXRvciBmb3Igc2hvd2luZyB0aGUgZmlyc3Qgcm93IHdpdGggcGVnc1xuICAgICAgICB0aGlzLnNob3dSb3cgPSBzaG93Um93O1xuICAgICAgICB0aGlzLmNhbnZhc0VsdC53aWR0aCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aDtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHNob3dSb3csIHdlIHdpbGwgc2hvdyBtb2RpZnkgdGhlIGhlYWRlciBIZWlnaHRcbiAgICAgICAgdGhpcy5oZWFkZXJIZWlnaHQgPSB0aGlzLnNob3dSb3cgPyBIRUFERVJfSEVJR0hUIDogMDtcbiAgICAgICAgdGhpcy5jYW52YXNFbHQuaGVpZ2h0ID0gdGhpcy5jYW52YXNSZWN0LndpZHRoICsgdGhpcy5oZWFkZXJIZWlnaHQ7XG4gICAgICAgIC8vIFdlIGNhbGN1bGF0ZSB0aGUgY2VsbHNpemUgYWNjb3JkaW5nIHRvIHRoZSBzcGFjZSB0YWtlbiBieSB0aGUgY2FudmFzXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBNYXRoLnJvdW5kKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIE5CX0NFTExTKTtcblxuICAgICAgICAvLyBXZSBpbml0aWFsaXplIHRoZSBGYWJyaWMgSlMgbGlicmFyeSB3aXRoIG91ciBjYW52YXNcbiAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgZmFicmljLkNhbnZhcyhpZCwgeyBzZWxlY3Rpb246IGZhbHNlIH0pO1xuICAgICAgICAvLyBPYmplY3QgdGhhdCByZXByZXNlbnQgdGhlIHBlZ3Mgb24gdGhlIGZpcnN0IHJvd1xuICAgICAgICB0aGlzLnJvd1NlbGVjdCA9IHt9O1xuICAgICAgICAvLyBUaGUgY3VycmVudCBkcmF3IG1vZGVsIChpbnN0cnVjdGlvbnMsIC4uLilcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge30sXG4gICAgICAgIC8vIEZsYWcgdG8gZGV0ZXJtaW5lIGlmIHdlIGhhdmUgdG8gY3JlYXRlIGEgbmV3IGJyaWNrXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3QnJpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IEJBU0VfTEVHT19DT0xPUjtcblxuICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIGNhbnZhc1xuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XG5cbiAgICAgICAgLy8gSWYgd2Ugc2hvdyB0aGUgcm93LCB3ZSBoYXZlIHRvIHBsdWcgdGhlIG1vdmUgbWFuYWdlbWVudFxuICAgICAgICBpZiAoc2hvd1Jvdykge1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0OnNlbGVjdGVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnID8gb3B0aW9ucy50YXJnZXQgOiBudWxsKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdzZWxlY3Rpb246Y2xlYXJlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG51bGwpO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5vbignb2JqZWN0Om1vdmluZycsIChvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBlZyA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZztcblxuXG4gICAgICAgICAgICAgICAgbGV0IG5ld0xlZnQgPSBNYXRoLnJvdW5kKG9wdGlvbnMudGFyZ2V0LmxlZnQgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemU7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1RvcCA9IE1hdGgucm91bmQoKG9wdGlvbnMudGFyZ2V0LnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0KSAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSArIHRoaXMuaGVhZGVySGVpZ2h0OyAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gY2FsY3VsYXRlIHRoZSB0b3BcbiAgICAgICAgICAgICAgICBsZXQgdG9wQ29tcHV0ZSA9IG5ld1RvcCArIChwZWcuc2l6ZS5yb3cgPT09IDIgfHwgcGVnLmFuZ2xlID4gMCA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnRDb21wdXRlID0gbmV3TGVmdCArIChwZWcuc2l6ZS5jb2wgPT09IDIgPyB0aGlzLmNlbGxTaXplICogMiA6IHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgICAgIHBlZy5tb3ZlKFxuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0LCAvL2xlZnRcbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wIC8vIHRvcFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBzcGVjaWZ5IHRoYXQgd2UgY291bGQgcmVtb3ZlIGEgcGVnIGlmIG9uZSBvZiBpdCdzIGVkZ2UgdG91Y2ggdGhlIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xuICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPCBIRUFERVJfSEVJR0hUXG4gICAgICAgICAgICAgICAgICAgIHx8IG5ld0xlZnQgPCAwXG4gICAgICAgICAgICAgICAgICAgIHx8IHRvcENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQuaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIHx8IGxlZnRDb21wdXRlID49IHRoaXMuY2FudmFzRWx0LndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSB3ZSBjaGVjayB3ZSBjcmVhdGUgYSBuZXcgcGVnICh3aGVuIGEgcGVnIGVudGVyIGluIHRoZSBkcmF3IGFyZWEpXG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUuY29sID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAocGVnLmFuZ2xlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSw5MCkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZy5yZXBsYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdtb3VzZTp1cCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QnJpY2tcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnRvUmVtb3ZlXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmJyaWNrTW9kZWxbdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlKHRoaXMuY3VycmVudEJyaWNrKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgZm9yIGNoYW5naW5nIHRoZSBjb2xvciBvZiB0aGUgZmlyc3Qgcm93IFxuICAgICAqL1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKSB7XG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gY29sb3I7ICAgICAgIFxuICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXJpYWxpemUgdGhlIGNhbnZhcyB0byBhIG1pbmltYWwgb2JqZWN0IHRoYXQgY291bGQgYmUgdHJlYXQgYWZ0ZXJcbiAgICAgKi9cbiAgICBleHBvcnQodXNlck5hbWUsIHVzZXJJZCkge1xuICAgICAgICBsZXQgcmVzdWx0QXJyYXkgPSBbXTtcbiAgICAgICAgLy8gV2UgZmlsdGVyIHRoZSByb3cgcGVnc1xuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuYnJpY2tNb2RlbClcbiAgICAgICAgICAgIC5maWx0ZXIoKGtleSk9PmtleSAhPSB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmlkXG4gICAgICAgICAgICAgICAgJiYga2V5ICE9IHRoaXMucm93U2VsZWN0LnJlY3QuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuaWQpO1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHBlZ1RtcCA9IHRoaXMuYnJpY2tNb2RlbFtrZXldO1xuICAgICAgICAgICAgcmVzdWx0QXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgc2l6ZTogcGVnVG1wLnNpemUsXG4gICAgICAgICAgICAgICAgY29sb3I6IHBlZ1RtcC5jb2xvcixcbiAgICAgICAgICAgICAgICBhbmdsZTogcGVnVG1wLmFuZ2xlLFxuICAgICAgICAgICAgICAgIHRvcDogcGVnVG1wLnRvcCAtIHRoaXMuaGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IHBlZ1RtcC5sZWZ0LFxuICAgICAgICAgICAgICAgIGNlbGxTaXplIDogdGhpcy5jZWxsU2l6ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXNlcjogdXNlck5hbWUsXG4gICAgICAgICAgICB1c2VySWQgOiB1c2VySWQsXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnM6IHJlc3VsdEFycmF5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBmcm9tIGludHJ1Y3Rpb25zIGEgZHJhd1xuICAgICAqL1xuICAgIGRyYXdJbnN0cnVjdGlvbnMoaW5zdHJ1Y3Rpb25PYmplY3Qpe1xuICAgICAgICB0aGlzLnJlc2V0Qm9hcmQoKTtcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgaW5zdHJ1Y3Rpb25PYmplY3QuaW5zdHJ1Y3Rpb25zLmZvckVhY2goKGluc3RydWN0aW9uKT0+e1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUJyaWNrKHsgc2l6ZSA6IGluc3RydWN0aW9uLnNpemUsIFxuICAgICAgICAgICAgICAgICAgICBsZWZ0IDogKGluc3RydWN0aW9uLmxlZnQgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoaW5zdHJ1Y3Rpb24udG9wIC8gaW5zdHJ1Y3Rpb24uY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGUgOiBpbnN0cnVjdGlvbi5hbmdsZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgOiBpbnN0cnVjdGlvbi5jb2xvclxuICAgICAgICAgICAgICAgIH0pLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gdGhlIGJvYXJkIGFuZCB0aGUgc3RhdGUgb2YgdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIHJlc2V0Qm9hcmQoKXtcbiAgICAgICAgdGhpcy5icmlja01vZGVsID0ge307XG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcbiAgICB9XG5cbiAgICAvKiogXG4gICAgICogR2VuZXJhdGUgYSBCYXNlNjQgaW1hZ2UgZnJvbSB0aGUgY2FudmFzXG4gICAgICovXG4gICAgc25hcHNob3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIFByaXZhdGVzIE1ldGhvZHNcbiAgICAgKiBcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogRHJhdyB0aGUgYmFzaWMgZ3JpZCBcbiAgICAqL1xuICAgIF9kcmF3R3JpZChzaXplKSB7ICAgICAgIFxuICAgICAgICBpZiAodGhpcy5zaG93Um93KXtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVTcXVhcmUoMikuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEpLmNhbnZhc0VsdFxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGFsbCB0aGUgd2hpdGUgcGVnIG9mIHRoZSBncmlkXG4gICAgICovXG4gICAgX2RyYXdXaGl0ZVBlZyhzaXplKXtcbiAgICAgICAgLy8gV2Ugc3RvcCByZW5kZXJpbmcgb24gZWFjaCBhZGQsIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLnJvdW5kKHNpemUgLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgbGV0IG1heFNpemUgPSBtYXggKiB0aGlzLmNlbGxTaXplO1xuICAgICAgICBmb3IgKHZhciByb3cgPTA7IHJvdyA8IG1heDsgcm93Kyspe1xuICAgICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbWF4OyBjb2wrKyApe1xuICAgICAgICAgICAgICAgICBsZXQgc3F1YXJlVG1wID0gbmV3IGZhYnJpYy5SZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogQkFDS0dST1VORF9MRUdPX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBjaXJjbGUgPSBuZXcgQ2lyY2xlKHRoaXMuY2VsbFNpemUsIEJBQ0tHUk9VTkRfTEVHT19DT0xPUik7XG4gICAgICAgICAgICAgICAgY2lyY2xlLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBncm91cFRtcCA9IG5ldyBmYWJyaWMuR3JvdXAoW3NxdWFyZVRtcCwgY2lyY2xlLmNhbnZhc0VsdF0sIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5jZWxsU2l6ZSAqIGNvbCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLmNlbGxTaXplICogcm93ICsgdGhpcy5oZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRyb2xzIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChncm91cFRtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgLy8gV2UgdHJhbnNmb3JtIHRoZSBjYW52YXMgdG8gYSBiYXNlNjQgaW1hZ2UgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXMuXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTsgICAgIFxuICAgICAgICB0aGlzLmNhbnZhcy5zZXRCYWNrZ3JvdW5kSW1hZ2UodXJsLHRoaXMuY2FudmFzLnJlbmRlckFsbC5iaW5kKHRoaXMuY2FudmFzKSwge1xuICAgICAgICAgICAgb3JpZ2luWDogJ2xlZnQnLFxuICAgICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5jYW52YXMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmNhbnZhcy5oZWlnaHQsXG4gICAgICAgIH0pOyAgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGhvcml6b250YWwgb3IgdmVydGljYWwgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgX2NyZWF0ZVJlY3Qoc2l6ZVJlY3QsIGFuZ2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAyICogc2l6ZVJlY3QsIHJvdyA6MSAqIHNpemVSZWN0fSwgXG4gICAgICAgICAgICAgICAgbGVmdCA6IGFuZ2xlID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyA0KSAtIHRoaXMuY2VsbFNpemUpIDogKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggKiAzIC8gNCkgLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxuICAgICAgICAgICAgICAgIHRvcCA6IGFuZ2xlID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgc3F1YXJlICgxeDEpIG9yICgyeDIpXG4gICAgICovXG4gICAgX2NyZWF0ZVNxdWFyZShzaXplU3F1YXJlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XG4gICAgICAgICAgICAgICAgc2l6ZSA6IHtjb2wgOiAxICogc2l6ZVNxdWFyZSwgcm93IDoxICogc2l6ZVNxdWFyZX0sIFxuICAgICAgICAgICAgICAgIGxlZnQ6IHNpemVTcXVhcmUgPT09IDIgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDIpIC0gKDIgKiB0aGlzLmNlbGxTaXplKSkgOiAodGhpcy5jYW52YXNSZWN0LndpZHRoIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcbiAgICAgICAgICAgICAgICB0b3AgOiBzaXplU3F1YXJlID09PSAyID8gMSA6IDAsXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmljIG1ldGhvZCB0aGF0IGNyZWF0ZSBhIHBlZ1xuICAgICAqL1xuICAgIF9jcmVhdGVCcmljayhvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMuY2VsbFNpemUgPSB0aGlzLmNlbGxTaXplO1xuICAgICAgICBvcHRpb25zLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCB0aGlzLmxhc3RDb2xvcjtcbiAgICAgICAgbGV0IHBlZyA9IG5ldyBQZWcob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbFtwZWcuaWRdID0gcGVnO1xuICAgICAgICAvLyBXZSBoYXZlIHRvIHVwZGF0ZSB0aGUgcm93U2VsZWN0IE9iamVjdCB0byBiZSBhbHN3YXkgdXBkYXRlXG4gICAgICAgIGlmIChvcHRpb25zLnNpemUucm93ID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbmdsZSkge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QudmVydFJlY3QgPSBwZWc7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zaXplLmNvbCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdCA9IHBlZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZSA9IHBlZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGVnO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5pdCB0aGUgY2FudmFzXG4gICAgICovXG4gICAgX2RyYXdDYW52YXMoKSB7XG4gICAgICAgIHRoaXMuX2RyYXdXaGl0ZVBlZyh0aGlzLmNhbnZhc1JlY3Qud2lkdGgpO1xuICAgICAgICB0aGlzLl9kcmF3R3JpZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGgsIE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpKTtcbiAgICB9XG4gICAgXG5cbn0iLCIndXNlIHN0cmljdCdcblxuLy8gTnVtYmVyIG9mIGNlbGwgb24gdGhlIGdyaWRcbmV4cG9ydCBjb25zdCBOQl9DRUxMUyA9IDE1O1xuXG4vLyBIZWlnaHQgb2YgdGhlIGhlYWRlclxuZXhwb3J0IGNvbnN0IEhFQURFUl9IRUlHSFQgPSB3aW5kb3cuc2NyZWVuLndpZHRoIDw9IDc2OCAgPyA2MCA6IDEwMDtcblxuLy8gRmlyc3QgY29sb3IgdG8gdXNlXG5leHBvcnQgY29uc3QgQkFTRV9MRUdPX0NPTE9SID0gXCIjMGQ2OWYyXCI7XG5cbi8vIE1lZGl1bSBTdG9uZSBHcmV5IFxuY29uc3QgQ09MT1JfMTk0ID0gXCIjYTNhMmE0XCI7XG5cbi8vIExpZ2h0IFN0b25lIEdyZXlcbmNvbnN0IENPTE9SXzIwOCA9IFwiI2U1ZTRkZVwiOyBcblxuLy8gQmFja2dyb3VuZCBjb2xvciB1c2VkXG5leHBvcnQgY29uc3QgQkFDS0dST1VORF9MRUdPX0NPTE9SID0gQ09MT1JfMjA4OyIsIid1c2Ugc3RyaWN0J1xuXG4vKlxuKiBDb2xvcnMgZnJvbSBcbiogaHR0cDovL2xlZ28ud2lraWEuY29tL3dpa2kvQ29sb3VyX1BhbGV0dGUgXG4qIEFuZCBodHRwOi8vd3d3LnBlZXJvbi5jb20vY2dpLWJpbi9pbnZjZ2lzL2NvbG9yZ3VpZGUuY2dpXG4qIE9ubHkgU2hvdyB0aGUgY29sb3IgdXNlIHNpbmNlIDIwMTBcbioqLyBcbmV4cG9ydCBjb25zdCBMRUdPX0NPTE9SUyA9IFtcbiAgICAncmdiKDI0NSwgMjA1LCA0NyknLCAvLzI0LCBCcmlnaHQgWWVsbG93ICpcbiAgICAncmdiKDI1MywgMjM0LCAxNDApJywgLy8yMjYsIENvb2wgWWVsbG93ICpcbiAgICAncmdiKDIxOCwgMTMzLCA2NCknLCAvLzEwNiwgQnJpZ2h0IE9yYW5nZSAqXG4gICAgJ3JnYigyMzIsIDE3MSwgNDUpJywgLy8xOTEsIEZsYW1lIFllbGxvd2lzaCBPcmFuZ2UgKlxuICAgICdyZ2IoMTk2LCA0MCwgMjcpJywgLy8yMSwgQnJpZ2h0IFJlZCAqXG4gICAgJ3JnYigxMjMsIDQ2LCA0NyknLCAvLzE1NCwgRGFyayBSZWQgKlxuICAgICdyZ2IoMjA1LCA5OCwgMTUyKScsIC8vMjIxLCBCcmlnaHQgUHVycGxlICpcbiAgICAncmdiKDIyOCwgMTczLCAyMDApJywgLy8yMjIsIExpZ2h0IFB1cnBsZSAqXG4gICAgJ3JnYigxNDYsIDU3LCAxMjApJywgLy8xMjQsIEJyaWdodCBSZWRkaXNoIFZpb2xldCAqXG4gICAgJ3JnYig1MiwgNDMsIDExNyknLCAvLzI2OCwgTWVkaXVtIExpbGFjICpcbiAgICAncmdiKDEzLCAxMDUsIDI0MiknLCAvLzIzLCBCcmlnaHQgQmx1ZSAqXG4gICAgJ3JnYigxNTksIDE5NSwgMjMzKScsIC8vMjEyLCBMaWdodCBSb3lhbCBCbHVlICpcbiAgICAncmdiKDExMCwgMTUzLCAyMDEpJywgLy8xMDIsIE1lZGl1bSBCbHVlICpcbiAgICAncmdiKDMyLCA1OCwgODYpJywgLy8xNDAsIEVhcnRoIEJsdWUgKlxuICAgICdyZ2IoMTE2LCAxMzQsIDE1NiknLCAvLzEzNSwgU2FuZCBCbHVlICpcbiAgICAncmdiKDQwLCAxMjcsIDcwKScsIC8vMjgsIERhcmsgR3JlZW4gKlxuICAgICdyZ2IoNzUsIDE1MSwgNzQpJywgLy8zNywgQmlyZ2h0IEdyZWVuICpcbiAgICAncmdiKDEyMCwgMTQ0LCAxMjkpJywgLy8xNTEsIFNhbmQgR3JlZW4gKlxuICAgICdyZ2IoMzksIDcwLCA0NCknLCAvLzE0MSwgRWFydGggR3JlZW4gKlxuICAgICdyZ2IoMTY0LCAxODksIDcwKScsIC8vMTE5LCBCcmlnaHQgWWVsbG93aXNoLUdyZWVuICogXG4gICAgJ3JnYigxMDUsIDY0LCAzOSknLCAvLzE5MiwgUmVkZGlzaCBCcm93biAqXG4gICAgJ3JnYigyMTUsIDE5NywgMTUzKScsIC8vNSwgQnJpY2sgWWVsbG93ICogXG4gICAgJ3JnYigxNDksIDEzOCwgMTE1KScsIC8vMTM4LCBTYW5kIFllbGxvdyAqXG4gICAgJ3JnYigxNzAsIDEyNSwgODUpJywgLy8zMTIsIE1lZGl1bSBOb3VnYXQgKiAgICBcbiAgICAncmdiKDQ4LCAxNSwgNiknLCAvLzMwOCwgRGFyayBCcm93biAqXG4gICAgJ3JnYigyMDQsIDE0MiwgMTA0KScsIC8vMTgsIE5vdWdhdCAqXG4gICAgJ3JnYigyNDUsIDE5MywgMTM3KScsIC8vMjgzLCBMaWdodCBOb3VnYXQgKlxuICAgICdyZ2IoMTYwLCA5NSwgNTIpJywgLy8zOCwgRGFyayBPcmFuZ2UgKlxuICAgICdyZ2IoMjQyLCAyNDMsIDI0MiknLCAvLzEsIFdoaXRlICpcbiAgICAncmdiKDIyOSwgMjI4LCAyMjIpJywgLy8yMDgsIExpZ2h0IFN0b25lIEdyZXkgKlxuICAgICdyZ2IoMTYzLCAxNjIsIDE2NCknLCAvLzE5NCwgTWVkaXVtIFN0b25lIEdyZXkgKlxuICAgICdyZ2IoOTksIDk1LCA5NyknLCAvLzE5OSwgRGFyayBTdG9uZSBHcmV5ICpcbiAgICAncmdiKDI3LCA0MiwgNTIpJywgLy8yNiwgQmxhY2sgKiAgICAgICAgXG5dOyIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgYSB2YXJpYXRpb24gb2YgY29sb3JcbiAqIFxuICogRnJvbSA6IGh0dHBzOi8vd3d3LnNpdGVwb2ludC5jb20vamF2YXNjcmlwdC1nZW5lcmF0ZS1saWdodGVyLWRhcmtlci1jb2xvci9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbG9yTHVtaW5hbmNlKGhleCwgbHVtKSB7XG5cbiAgICAgICAgLy8gdmFsaWRhdGUgaGV4IHN0cmluZ1xuICAgICAgICBoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XG4gICAgICAgIH1cbiAgICAgICAgbHVtID0gbHVtIHx8IDA7XG5cbiAgICAgICAgLy8gY29udmVydCB0byBkZWNpbWFsIGFuZCBjaGFuZ2UgbHVtaW5vc2l0eVxuICAgICAgICB2YXIgcmdiID0gXCIjXCIsIGMsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xuICAgICAgICAgICAgYyA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgYyArIChjICogbHVtKSksIDI1NSkpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgIHJnYiArPSAoXCIwMFwiICsgYykuc3Vic3RyKGMubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZ2I7XG59IiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQmFzaWMgRmlyZWJhc2UgaGVscGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXJlQmFzZUxlZ29BcHB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgLy8gQ29uZmlndXJhdGlvbiBvZiB0aGUgYXBwbGljYXRpb24sIFlvdSBzaG91bGQgdXBkYXRlIHdpdGggeW91ciBLZXlzICFcbiAgICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5RHI5Ujg1dE5qZktXZGRXMS1ON1hKcEFoR3FYTkdhSjVrXCIsXG4gICAgICAgICAgICBhdXRoRG9tYWluOiBcImxlZ29ubmFyeS5maXJlYmFzZWFwcC5jb21cIixcbiAgICAgICAgICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vbGVnb25uYXJ5LmZpcmViYXNlaW8uY29tXCIsXG4gICAgICAgICAgICBzdG9yYWdlQnVja2V0OiBcIlwiLFxuICAgICAgICB9IFxuXG4gICAgICAgIHRoaXMuYXBwID0gZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcCh0aGlzLmNvbmZpZyk7XG4gICAgfVxuXG5cbn1cblxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogQ2xhc3MgZm9yIGdlbmVyaWMgbWFuYWdlbWVudCBvZiBBdXRoZW50aWNhdGlvbiB3aXRoIGZpcmViYXNlLlxuICogXG4gKiBJdCB0YWtlcyBjYXJlIG9mIGh0bWwgdG8gaGlkZSBvciBzaG93XG4gKi9cbmV4cG9ydCBjbGFzcyBGaXJlQmFzZUF1dGh7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKXtcbiAgICAgIFxuICAgICAgICBsZXQgdWlDb25maWcgPSB7XG4gICAgICAgICAgICAnY2FsbGJhY2tzJzoge1xuICAgICAgICAgICAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4uXG4gICAgICAgICAgICAgICAgJ3NpZ25JblN1Y2Nlc3MnOiBmdW5jdGlvbih1c2VyLCBjcmVkZW50aWFsLCByZWRpcmVjdFVybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEbyBub3QgcmVkaXJlY3QuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gT3BlbnMgSURQIFByb3ZpZGVycyBzaWduLWluIGZsb3cgaW4gYSBwb3B1cC5cbiAgICAgICAgICAgICdzaWduSW5GbG93JzogJ3BvcHVwJyxcbiAgICAgICAgICAgICdzaWduSW5PcHRpb25zJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcm92aWRlcjogZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgICAgICAgc2NvcGVzOiBbJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcGx1cy5sb2dpbiddXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkZhY2Vib29rQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguVHdpdHRlckF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkdpdGh1YkF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkVtYWlsQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lEXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgLy8gVGVybXMgb2Ygc2VydmljZSB1cmwuXG4gICAgICAgICAgICAndG9zVXJsJzogJ2h0dHBzOi8vZ2RnbmFudGVzLmNvbSdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51aSA9IG5ldyBmaXJlYmFzZXVpLmF1dGguQXV0aFVJKGZpcmViYXNlLmF1dGgoKSk7XG4gICAgICAgIHRoaXMudWkuc3RhcnQoJyNmaXJlYmFzZXVpLWF1dGgtY29udGFpbmVyJywgdWlDb25maWcpO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmlkRGl2TG9naW4gPSBjb25maWcuaWREaXZMb2dpbjtcbiAgICAgICAgdGhpcy5pZE5leHREaXYgPSBjb25maWcuaWROZXh0RGl2O1xuICAgICAgICB0aGlzLmlkTG9nb3V0ID0gY29uZmlnLmlkTG9nb3V0O1xuXG4gICAgICAgIC8vIE9wdGlvbmFsc1xuICAgICAgICB0aGlzLmlkSW1nID0gY29uZmlnLmlkSW1nID8gY29uZmlnLmlkSW1nIDogbnVsbDtcbiAgICAgICAgdGhpcy5pZERpc3BsYXlOYW1lID0gY29uZmlnLmlkRGlzcGxheU5hbWUgPyBjb25maWcuaWREaXNwbGF5TmFtZSA6IG51bGw7XG5cblxuICAgICAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKHRoaXMuX2NoZWNrQ2FsbEJhY2tDb250ZXh0LmJpbmQodGhpcyksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrQ2FsbEJhY2tFcnJvckNvbnRleHQuYmluZCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jYkF1dGhDaGFuZ2VkID0gbnVsbDtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT4gIGZpcmViYXNlLmF1dGgoKS5zaWduT3V0KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluIGNhc2Ugb2YgZXJyb3JcbiAgICAgKi9cbiAgICBfY2hlY2tDYWxsQmFja0Vycm9yQ29udGV4dChlcnJvcil7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIG1ldGhvZCB3aXRoIHRoZSBzdGF0ZSBvZiBjb25uZWN0aW9uXG4gICAgICogXG4gICAgICogQWNjb3JkaW5nIHRvICd1c2VyJywgaXQgd2lsbCBzaG93IG9yIGhpZGUgc29tZSBodG1sIGFyZWFzXG4gICAgICovXG4gICAgX2NoZWNrQ2FsbEJhY2tDb250ZXh0KHVzZXIpe1xuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICBpZiAodXNlcil7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGl2TG9naW4pLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZE5leHREaXYpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7ICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5pZEltZyl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc3JjID0gdXNlci5waG90b1VSTDtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlkRGlzcGxheU5hbWUpe1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWREaXNwbGF5TmFtZSkuaW5uZXJIVE1MID0gdXNlci5kaXNwbGF5TmFtZTs7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWREaXZMb2dpbikucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTmV4dERpdikuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnNyYyA9IFwiXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpc3BsYXlOYW1lKS5pbm5lckhUTUwgPSBcIk5vbiBDb25udGVjdMOpXCI7ICAgICAgICAgICAgXG5cbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmNiQXV0aENoYW5nZWQpe1xuICAgICAgICAgICAgdGhpcy5jYkF1dGhDaGFuZ2VkKHVzZXIpO1xuICAgICAgICB9XG4gICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RyYXRpb24gb2YgY2FsbGJhY2sgZm9yIGZ1dHVyIGludGVyYWN0aW9uLlxuICAgICAqIFRoZSBjYWxsYmFjayBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgd2l0aCB1c2VyIGFzIHBhcmFtZXRlclxuICAgICAqL1xuICAgIG9uQXV0aFN0YXRlQ2hhbmdlZChjYil7XG4gICAgICAgIHRoaXMuY2JBdXRoQ2hhbmdlZCA9IGNiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgbG9nZ2VkIHVzZXJcbiAgICAgKi9cbiAgICBkaXNwbGF5TmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyID8gdGhpcy51c2VyLmRpc3BsYXlOYW1lIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBpZCBvZiB0aGUgY3VycmVudCBsb2dnZWQgdXNlclxuICAgICAqL1xuICAgIHVzZXJJZCgpe1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyID8gdGhpcy51c2VyLnVpZCA6IG51bGw7XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDb2xvckx1bWluYW5jZX0gZnJvbSAnLi4vY29tbW9uL3V0aWwuanMnO1xuXG4vKipcbiAqIENpcmNsZSBMZWdvIGNsYXNzXG4gKiBUaGUgY2lyY2xlIGlzIGNvbXBvc2VkIG9mIDIgY2lyY2xlIChvbiB0aGUgc2hhZG93LCBhbmQgdGhlIG90aGVyIG9uZSBmb3IgdGhlIHRvcClcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgQ2lyY2xle1xuICAgIGNvbnN0cnVjdG9yKGNlbGxTaXplLCBjb2xvcil7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDUsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc2hhZG93IDogXCIwcHggMnB4IDEwcHggcmdiYSgwLDAsMCwwLjIpXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpY0V0eCA9IG5ldyBmYWJyaWMuQ2lyY2xlKHtcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA0LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBmYWJyaWMuVGV4dCgnR0RHJywge1xuICAgICAgICAgICAgZm9udFNpemU6IGNlbGxTaXplIC8gNSxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgc3Ryb2tlOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMjApLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoW3RoaXMuY2lyY2xlQmFzaWNFdHgsIHRoaXMuY2lyY2xlQmFzaWMsIHRoaXMudGV4dF0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgRmFicmljSlMgZWxlbWVudFxuICAgICAqL1xuICAgIGdldCBjYW52YXNFbHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7IFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIGNpcmNsZVxuICAgICAqL1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jaXJjbGVCYXNpYy5zZXQoJ2ZpbGwnLCBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMSkpO1xuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4LnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpKTtcbiAgICAgICAgdGhpcy50ZXh0LnNldCh7XG4gICAgICAgICAgICBmaWxsIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcbiAgICAgICAgICAgIHN0cm9rZSA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMClcbiAgICAgICAgfSk7XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4vY2lyY2xlLmpzJztcblxuLyoqXG4gKiBQZWcgTGVnbyBjbGFzc1xuICogVGhlIHBlZyBpcyBjb21wb3NlZCBvZiBuIGNpcmNsZSBmb3IgYSBkaW1lbnNpb24gdGhhdCBkZXBlbmQgb24gdGhlIHNpemUgcGFyYW1ldGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBQZWd7XG4gICAgY29uc3RydWN0b3Ioe3NpemUgPSB7Y29sIDogMSwgcm93IDogMX0sIGNlbGxTaXplID0gMCwgY29sb3IgPSAnI0ZGRicsIGxlZnQgPSAwLCB0b3AgPSAwLCBhbmdsZSA9IDB9KXtcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5pZCA9IGBQZWcke3NpemV9LSR7RGF0ZS5ub3coKX1gO1xuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZSB8fCAwO1xuICAgICAgICB0aGlzLmNpcmNsZUFycmF5ID0gW107XG5cblxuICAgICAgICB0aGlzLnJlY3RCYXNpYyA9IG5ldyBmYWJyaWMuUmVjdCh7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUgKiBzaXplLmNvbCxcbiAgICAgICAgICAgIGhlaWdodDogY2VsbFNpemUgKiBzaXplLnJvdyxcbiAgICAgICAgICAgIGZpbGw6IGNvbG9yLFxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGNlbnRlcmVkUm90YXRpb246IHRydWUsXG4gICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjVweCA1cHggMTBweCByZ2JhKDAsMCwwLDAuMilcIiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGxldCBhcnJheUVsdHMgPSBbdGhpcy5yZWN0QmFzaWNdO1xuICAgICAgICBsZXQgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7ICAgICAgIFxuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gdGhlIHNpemUsIHdlIGRvbid0IHBsYWNlIHRoZSBjaXJjbGVzIGF0IHRoZSBzYW1lIHBsYWNlXG4gICAgICAgIGlmIChzaXplLmNvbCA9PT0gMil7XG4gICAgICAgICAgICAvLyBGb3IgYSByZWN0YW5nbGUgb3IgYSBiaWcgU3F1YXJlXG4gICAgICAgICAgICAvLyBXZSB1cGRhdGUgdGhlIHJvdyBwb3NpdGlvbnNcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtY2VsbFNpemUgKyA1LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwID0gbmV3IENpcmNsZShjZWxsU2l6ZSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3AgOiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT5hcnJheUVsdHMucHVzaChjaXJjbGUuY2FudmFzRWx0KSk7XG5cbiAgICAgICAgLy8gVGhlIHBlZyBpcyBsb2NrZWQgaW4gYWxsIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKGFycmF5RWx0cywge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5sZWZ0LFxuICAgICAgICAgICAgdG9wOiB0aGlzLnRvcCxcbiAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxuICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxuICAgICAgICAgICAgaGFzQ29udHJvbHMgOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2UgYWRkIHRvIEZhYnJpY0VsZW1lbnQgYSByZWZlcmVuY2UgdG8gdGhlIGN1cmVudCBwZWdcbiAgICAgICAgdGhpcy5ncm91cC5wYXJlbnRQZWcgPSB0aGlzOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gVGhlIEZhYnJpY0pTIGVsZW1lbnRcbiAgICBnZXQgY2FudmFzRWx0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwO1xuICAgIH1cblxuICAgIC8vIFRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIHJlcGxhY2VkXG4gICAgZ2V0IHJlcGxhY2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXBsYWNlXG4gICAgfVxuXG4gICAgLy8gU2V0dGVyIGZvciBpc1JlcGxhY2UgcGFyYW1cbiAgICBzZXQgcmVwbGFjZShyZXBsYWNlKXtcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSByZXBsYWNlO1xuICAgIH1cblxuICAgIC8vIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHBlZ1xuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnJlY3RCYXNpYy5zZXQoJ2ZpbGwnLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+IGNpcmNsZS5jaGFuZ2VDb2xvcihjb2xvcikpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gTW92ZSB0aGUgcGVnIHRvIGRlc2lyZSBwb3NpdGlvblxuICAgIG1vdmUobGVmdCwgdG9wKXtcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0KHtcbiAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgbGVmdCA6IGxlZnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUm90YXRlIHRoZSBwZWcgdG8gdGhlIGRlc2lyZSBhbmdsZVxuICAgIHJvdGF0ZShhbmdsZSl7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xuICAgICAgICAgICAgYW5nbGUgOiBhbmdsZVxuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBDbGFzcyBmb3IgcGxheWluZyB2aWRlbyBcbiAqIFxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJ7XG4gICAgY29uc3RydWN0b3IocGFyZW50RWx0LCBjYWxsQmFja0VuZCl7XG4gICAgICAgIHRoaXMudmlkZW9FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgICAgICBwYXJlbnRFbHQuYXBwZW5kQ2hpbGQodGhpcy52aWRlb0VsdCk7XG4gICAgICAgIHRoaXMudmlkZW9OYW1lID0gJyc7ICAgICAgICBcbiAgICAgICAgdGhpcy5jYWxsQmFja0VuZCA9IGNhbGxCYWNrRW5kO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYXkgdGhlIHZpZGVvXG4gICAgICovXG4gICAgcGxheVZpZGVvKCl7XG4gICAgICAgIHRoaXMudmlkZW9FbHQucGF1c2UoKTtcbiAgICAgICAgdGhpcy52aWRlb0VsdC5zcmMgPSBgLi9hc3NldHMvdmlkZW8vJHt0aGlzLnZpZGVvTmFtZX1gO1xuICAgICAgICB0aGlzLnZpZGVvRWx0LnBsYXkoKTtcbiAgICAgICAgdGhpcy52aWRlb0VsdC5vbmVuZGVkID0gdGhpcy5jYWxsQmFja0VuZC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgIFxufSJdfQ==
