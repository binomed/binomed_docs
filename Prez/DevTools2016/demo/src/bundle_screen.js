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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfc2NyZWVuLmpzIiwic3JjL3NjcmlwdHMvYXVkaW8vcGxheWVyLmpzIiwic3JjL3NjcmlwdHMvYXVkaW8vcGxheWxpc3QuanMiLCJzcmMvc2NyaXB0cy9jYW52YXMvbGVnb0NhbnZhcy5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9jb25zdC5qcyIsInNyYy9zY3JpcHRzL2NvbW1vbi9sZWdvQ29sb3JzLmpzIiwic3JjL3NjcmlwdHMvY29tbW9uL3V0aWwuanMiLCJzcmMvc2NyaXB0cy9maXJlYmFzZS9maXJlYmFzZS5qcyIsInNyYy9zY3JpcHRzL2ZpcmViYXNlL2ZpcmViYXNlQXV0aC5qcyIsInNyYy9zY3JpcHRzL2xlZ29fc2hhcGUvY2lyY2xlLmpzIiwic3JjL3NjcmlwdHMvbGVnb19zaGFwZS9wZWcuanMiLCJzcmMvc2NyaXB0cy92aWRlby9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxDQUFDLFlBQVk7O0FBRVQsUUFBSSxXQUFXLEtBQWY7QUFBQSxRQUFxQjtBQUNqQixtQkFBZSxJQURuQjtBQUFBLFFBQ3dCO0FBQ3BCLGlCQUFhLElBRmpCO0FBQUEsUUFFdUI7QUFDbkIsaUJBQWEsSUFIakI7QUFBQSxRQUd1QjtBQUNuQixrQkFBYyxJQUpsQjtBQUFBLFFBSXVCO0FBQ25CLGlCQUFhLElBTGpCO0FBQUEsUUFLdUI7QUFDbkIsaUJBQWEsSUFOakI7QUFBQSxRQU11QjtBQUNuQix5QkFBcUIsSUFQekI7QUFBQSxRQU8rQjtBQUMzQixlQUFXLEtBUmY7QUFBQSxRQVFzQjtBQUNsQixpQkFBYSxPQUFPLDBCQUFQLEVBQW1DLDBCQUFuQyxDQVRqQjtBQUFBLFFBU2lGO0FBQzdFLHNCQUFrQixJQVZ0QjtBQUFBLFFBV0ksY0FBYyxJQVhsQjtBQUFBLFFBWUks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cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7RmlyZUJhc2VMZWdvQXBwfSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7RmlyZUJhc2VBdXRofSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlQXV0aC5qcyc7XG5pbXBvcnQge0xlZ29HcmlkQ2FudmFzfSBmcm9tICcuL2NhbnZhcy9sZWdvQ2FudmFzLmpzJztcbmltcG9ydCB7QXVkaW9QbGF5ZXJ9IGZyb20gJy4vYXVkaW8vcGxheWVyLmpzJztcbmltcG9ydCB7VmlkZW9QbGF5ZXJ9IGZyb20gJy4vdmlkZW8vcGxheWVyLmpzJztcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGxldCBnYW1lSW5pdCA9IGZhbHNlLC8vIHRydWUgaWYgd2UgaW5pdCB0aGUgbGVnb0dyaWRcbiAgICAgICAgZmlyZUJhc2VMZWdvID0gbnVsbCwvLyB0aGUgcmVmZXJlbmNlIG9mIHRoZSBmaXJlQmFzZUFwcFxuICAgICAgICBsZWdvQ2FudmFzID0gbnVsbCwgLy8gVGhlIGxlZ29HcmlkXG4gICAgICAgIGN1cnJlbnRLZXkgPSBudWxsLCAvLyBUaGUgY3VyZW50IGZpcmViYXNlIGRyYXcga2V5XG4gICAgICAgIGN1cnJlbnREcmF3ID0gbnVsbCwvLyBUaGUgY3VyZW50IGZpcmViYXNlIGRyYXdcbiAgICAgICAgbWludXRlc0VsdCA9IG51bGwsIC8vIEh0bWwgZWxlbWVudCBmb3IgbWludXRlc1xuICAgICAgICBzZWNvbmRzRWx0ID0gbnVsbCwgLy8gSHRtbCBlbGVtZW50IGZvciBzZWNvbmRzXG4gICAgICAgIGNvdW50RG93blBhcmVudEVsdCA9IG51bGwsIC8vIEh0bWwgZWxlbWVudCBwYXJlbnQgb2YgbWludXRlcyBhbmQgc2Vjb25kc1xuICAgICAgICBsYXN0TGVmdCA9IGZhbHNlLCAvLyBUcnVlIGlmIHRoZSBsYXN0IHBob3RvIHdhcyBwbGFjZWQgYXQgdGhlIGxlZnQgb2YgdGhlIGNvdW50RG93blxuICAgICAgICB0YXJnZXREYXRlID0gbW9tZW50KCcyMDE2LTExLTA5LCAwOTowMDowMDowMDAnLCBcIllZWVktTU0tREQsIEhIOm1tOnNzOlNTU1wiKSwgLy8gVGhlIHRpbWVvdXQgZGF0ZVxuICAgICAgICByZWFkeUZvck5ld0RyYXcgPSB0cnVlLFxuICAgICAgICBhdWRpb1BsYXllciA9IG51bGwsXG4gICAgICAgIGVuZFNob3cgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGluaXRHYW1lKCkge1xuXG4gICAgICAgIGxlZ29DYW52YXMgPSBuZXcgTGVnb0dyaWRDYW52YXMoJ2NhbnZhc0RyYXcnLCBmYWxzZSk7XG5cbiAgICAgICAgZ2V0TmV4dERyYXcoKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIGEgc25hcHNob3Qgb2YgdGhlIGRyYXcgd2l0aCBhIGZsYXNoIGVmZmVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU25hcHNob3QodXNlciwgZGF0YVVybCkge1xuICAgICAgICAvLyBXZSBzdGFydCBvdXIgZmxhc2ggZWZmZWN0XG4gICAgICAgIGxldCByZWN0Q2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhbnZhcy1jb250YWluZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IGZsYXNoRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZsYXNoLWVmZmVjdCcpXG4gICAgICAgIGZsYXNoRGl2LnN0eWxlLnRvcCA9IChyZWN0Q2FudmFzLnRvcCAtIDI1MCkgKyBcInB4XCI7XG4gICAgICAgIGZsYXNoRGl2LnN0eWxlLmxlZnQgPSAocmVjdENhbnZhcy5sZWZ0IC0gMjUwKSArIFwicHhcIjtcbiAgICAgICAgZmxhc2hEaXYuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcbiAgICAgICAgLy9XaGVuIHRoZSBhbmltYXRpb24gaXMgZG9uZSAoMXMgb2Ygb3BhY2l0eSAuNyAtPiAwID0+IH41MDBtcyB0byB3YWl0KVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgZmluYWwgaW1hZ2VcbiAgICAgICAgICAgIC8vIFdlIGNyZWF0ZSBhIGRpdiB0aGF0IHdlIHdpbGwgYmUgYW5pbWF0ZVxuICAgICAgICAgICAgZmxhc2hEaXYuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKTtcbiAgICAgICAgICAgIGxldCBpbWdQYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICAgIGltZy5zcmMgPSBkYXRhVXJsO1xuICAgICAgICAgICAgaW1nLmNsYXNzTGlzdC5hZGQoJ2ltZy1vcmknKTtcbiAgICAgICAgICAgIGltZ1BhcmVudC5jbGFzc0xpc3QuYWRkKCdpbWctb3JpLXBhcmVudCcpO1xuICAgICAgICAgICAgaW1nUGFyZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRob3InLCB1c2VyKTtcbiAgICAgICAgICAgIGltZ1BhcmVudC5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICAgICAgaW1nUGFyZW50LmNsYXNzTGlzdC5hZGQoJ2JpZycpO1xuICAgICAgICAgICAgLy8gSW5pdGlhbCBQb3NpdGlvblxuICAgICAgICAgICAgaW1nUGFyZW50LnN0eWxlLnRvcCA9IChyZWN0Q2FudmFzLnRvcCAtIDQ1KSArIFwicHhcIjtcbiAgICAgICAgICAgIGltZ1BhcmVudC5zdHlsZS5sZWZ0ID0gKHJlY3RDYW52YXMubGVmdCAtIDQ1KSArIFwicHhcIjtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWdQYXJlbnQpO1xuXG4gICAgICAgICAgICAvLyB3ZSB3YWl0IGEgbGl0bGUgdG8gc2V0IG5ldyBwb3NpdGlvbiB0byB0aGUgbmV3IGRpdi4gVGhlIGNzcyBhbmltYXRpb24gd2lsbCBkbyB0aGUgcmVzdCBvZiB0aGUgam9iXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGxldCBob3Jpem9udGFsRGlzdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMwMCkgKyAxO1xuICAgICAgICAgICAgICAgIGxldCBoZWlnaHRTY3JlZW4gPSBkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgdmVydGljYWxEaXN0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGhlaWdodFNjcmVlbiAtIDEwMCAtIDMwMCkpICsgMTtcbiAgICAgICAgICAgICAgICBsZXQgYW5nbGVDaG9pY2UgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzKSArIDE7XG5cbiAgICAgICAgICAgICAgICBpbWdQYXJlbnQuY2xhc3NMaXN0LnJlbW92ZSgnYmlnJyk7XG4gICAgICAgICAgICAgICAgaW1nUGFyZW50LnN0eWxlLnRvcCA9IGBjYWxjKDEwMHB4ICsgJHt2ZXJ0aWNhbERpc3R9cHgpYDtcbiAgICAgICAgICAgICAgICBpbWdQYXJlbnQuc3R5bGUubGVmdCA9IGAke2hvcml6b250YWxEaXN0fXB4YDtcbiAgICAgICAgICAgICAgICBpZiAoIWxhc3RMZWZ0KSB7IC8vIFRydWUgaWYgdGhlIGxhc3QgcGhvdG8gd2FzIHBsYWNlZCBhdCB0aGUgbGVmdCBvZiB0aGUgY291bnREb3duXG4gICAgICAgICAgICAgICAgICAgIGltZ1BhcmVudC5zdHlsZS5sZWZ0ID0gYGNhbGMoMTAwdncgLSAke2hvcml6b250YWxEaXN0fXB4IC0gMzAwcHgpYDsgICAgICAgICAgIC8vIFRoZSB0aW1lb3V0IGRhdGUgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RMZWZ0ID0gIWxhc3RMZWZ0OyAvLyBUcnVlIGlmIHRoZSBsYXN0IHBob3RvIHdhcyBwbGFjZWQgYXQgdGhlIGxlZnQgb2YgdGhlIGNvdW50RG93blxuICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IGFuZ2xlQ2hvaWNlID09PSAxID8gLTkgOiBhbmdsZUNob2ljZSA9PT0gMiA/IDE0IDogMDsgLy8gVGhlIHRpbWVvdXQgZGF0ZVxuICAgICAgICAgICAgICAgIGltZ1BhcmVudC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9ZGVnKWA7XG4gICAgICAgICAgICAgICAgZ2V0TmV4dERyYXcoKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG5cbiAgICAgICAgICAgIC8vIFdoZW4gdGhlIGVsZW1lbnQgaXMgY3JlYXRlLCB3ZSBjbGVhbiB0aGUgYm9hcmRcbiAgICAgICAgICAgIGxlZ29DYW52YXMucmVzZXRCb2FyZCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb3Bvc2l0aW9uLXRleHQnKS5pbm5lckhUTUwgPSBcIkVuIGF0dGVudGUgZGUgcHJvcG9zaXRpb25cIjtcblxuICAgICAgICB9LCA1MDApO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgICAgYXVkaW9QbGF5ZXIgPSBuZXcgQXVkaW9QbGF5ZXIoKTtcblxuICAgICAgICBmaXJlQmFzZUxlZ28gPSBuZXcgRmlyZUJhc2VMZWdvQXBwKCkuYXBwO1xuICAgICAgICBsZXQgZmlyZUJhc2VBdXRoID0gbmV3IEZpcmVCYXNlQXV0aCh7XG4gICAgICAgICAgICBpZERpdkxvZ2luOiAnbG9naW4tbXNnJyxcbiAgICAgICAgICAgIGlkTmV4dERpdjogJ2dhbWUnLFxuICAgICAgICAgICAgaWRMb2dvdXQ6ICdzaWdub3V0J1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBPbmx5IGFuIGF1dGhlbnRpY2F0ZSB1c2VyIGNhbiBzZWUgdGhlIHZhbGlkYXRlZCBkcmF3ICFcbiAgICAgICAgZmlyZUJhc2VBdXRoLm9uQXV0aFN0YXRlQ2hhbmdlZCgodXNlcikgPT4ge1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWdhbWVJbml0KSB7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaW5pdEdhbWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZignZHJhd1ZhbGlkYXRlZCcpLm9uKCdjaGlsZF9hZGRlZCcsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAocmVhZHlGb3JOZXdEcmF3KSB7XG4gICAgICAgICAgICAgICAgZ2V0TmV4dERyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWludXRlc0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaW51dGVzJyk7XG4gICAgICAgIHNlY29uZHNFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Vjb25kcycpO1xuICAgICAgICBjb3VudERvd25QYXJlbnRFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY291bnQtZG93bi10ZXh0Jyk7XG5cbiAgICAgICAgLy8gVG8gcmVtb3ZlIGlmIHlvdSB3YW50IHRvIHVzZSB0aGUgdGFyZ2V0IGRhdGUgZGVmaW5lIGF0IHRoZSB0b3Agb2YgdGhlIGNsYXNzXG4gICAgICAgIHRhcmdldERhdGUgPSBtb21lbnQoKTtcbiAgICAgICAgdGFyZ2V0RGF0ZS5hZGQoMzAsICdtaW51dGVzJyk7XG4gICAgICAgIC8vdGFyZ2V0RGF0ZS5hZGQoNSwgJ3NlY29uZHMnKTtcbiAgICAgICAgLy8gV2Ugc3RhcnQgb3VyIHRleHQgYW5pbWF0aW9uXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hlY2tUaW1lKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuaW1hdGUgdGhlIHRleHQgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHRpbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGVja1RpbWUoKSB7XG5cbiAgICAgICAgaWYgKG1vbWVudCgpLmlzQWZ0ZXIodGFyZ2V0RGF0ZSkpIHtcbiAgICAgICAgICAgIGVuZFNob3cgPSB0cnVlO1xuICAgICAgICAgICAgZW5kQ291bnREb3duKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZGlmZiA9IHRhcmdldERhdGUuZGlmZihtb21lbnQoKSk7XG4gICAgICAgICAgICBtaW51dGVzRWx0LmlubmVySFRNTCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChcImZyXCIsIHsgbWluaW11bUludGVnZXJEaWdpdHM6IDIsIHVzZUdyb3VwaW5nOiBmYWxzZSB9KVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoTWF0aC5mbG9vcihkaWZmIC8gKDYwICogMTAwMCkpKTtcbiAgICAgICAgICAgIHNlY29uZHNFbHQuaW5uZXJIVE1MID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KFwiZnJcIiwgeyBtaW5pbXVtSW50ZWdlckRpZ2l0czogMiwgdXNlR3JvdXBpbmc6IGZhbHNlIH0pXG4gICAgICAgICAgICAgICAgLmZvcm1hdChNYXRoLmZsb29yKGRpZmYgJSAoNjAgKiAxMDAwKSAvIDEwMDApKTtcbiAgICAgICAgICAgIGF1ZGlvUGxheWVyLm1hbmFnZVNvdW5kVm9sdW1lKGRpZmYpO1xuICAgICAgICAgICAgaWYgKGRpZmYgPCA2MCAqIDEwMDApe1xuICAgICAgICAgICAgICAgIGNvdW50RG93blBhcmVudEVsdC5jbGFzc0xpc3QuYWRkKCdsYXN0LW1pbnV0ZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrVGltZSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIG5leHQgZHJhd1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE5leHREcmF3KCkge1xuICAgICAgICBpZiAoZW5kU2hvdyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVhZHlGb3JOZXdEcmF3ID0gZmFsc2U7XG4gICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZignZHJhd1ZhbGlkYXRlZCcpLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24gKHNuYXBzaG90KSB7XG4gICAgICAgICAgICBpZiAoc25hcHNob3QgJiYgc25hcHNob3QudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCB3ZSBnZXQgdGhlIGRyYXdcbiAgICAgICAgICAgICAgICBjdXJyZW50RHJhdyA9IHNuYXBzaG90O1xuICAgICAgICAgICAgICAgIGxldCBzbmFwc2hvdEZiID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhzbmFwc2hvdEZiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50S2V5ID0ga2V5c1swXTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RHJhdyA9IHNuYXBzaG90RmJba2V5c1swXV07XG4gICAgICAgICAgICAgICAgbGVnb0NhbnZhcy5kcmF3SW5zdHJ1Y3Rpb25zKGN1cnJlbnREcmF3KTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wb3NpdGlvbi10ZXh0JykuaW5uZXJIVE1MID0gYFByb3Bvc2l0aW9uIGRlICR7Y3VycmVudERyYXcudXNlcn1gO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZnRlciB3ZSB1cGRhdGUgdGhlIGRyYXdcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFVcmwgPSBsZWdvQ2FudmFzLnNuYXBzaG90KCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnREcmF3LmRhdGFVcmwgPSBkYXRhVXJsO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RHJhdy5hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGNsZWFuIHRoZSBkcmF3IGJlZm9yZSB0byBzYXZlIGl0XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjdXJyZW50RHJhdy5pbnN0cnVjdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZihgL2RyYXdTYXZlZC8ke2N1cnJlbnREcmF3LnVzZXJJZH1gKS5wdXNoKGN1cnJlbnREcmF3KTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGN1cnJlbnREcmF3LnVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKGBkcmF3VmFsaWRhdGVkLyR7Y3VycmVudEtleX1gKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKFwiL2RyYXdTaG93XCIpLnB1c2goY3VycmVudERyYXcpO1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBmaW5hbHkgZ2VuZXJhdGUgdGhlIGltYWdlXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlU25hcHNob3QoY3VycmVudERyYXcudXNlciwgbGVnb0NhbnZhcy5zbmFwc2hvdCgpKVxuICAgICAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWFkeUZvck5ld0RyYXcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wb3NpdGlvbi10ZXh0JykuaW5uZXJIVE1MID0gXCJFbiBhdHRlbnRlIGRlIHByb3Bvc2l0aW9uXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgLy8gZXJyb3IgY2FsbGJhY2sgdHJpZ2dlcmVkIHdpdGggUEVSTUlTU0lPTl9ERU5JRURcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBlbmRDb3VudERvd24oKXtcbiAgICAgICAgY29uc3Qgb3BhY2l0eUVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcGFjaXR5Jyk7XG4gICAgICAgIG9wYWNpdHlFbHQuY2xhc3NMaXN0LmFkZCgnYmxhY2snKTtcbiAgICAgICAgc2V0VGltZW91dCgoKT0+bmV3IFZpZGVvUGxheWVyKG9wYWNpdHlFbHQsICgpPT5jb25zb2xlLmxvZygnZW5kJykpLnBsYXlWaWRlbygpLCA0MDAwKTtcbiAgICB9XG5cbiAgICBcblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtQTEFZTElTVH0gZnJvbSAnLi9wbGF5bGlzdC5qcyc7XG5cbi8qKlxuICogQ2xhc3MgZm9yIHBsYXlpbmcgbXVzaWNcbiAqIFxuICogV2UgY3JlYXRlIGFuIGluc2libGUgYXVkaW8gZWxlbWVudCBhbmQgd2UgcGxheSBtdXNpYyBvbiBpdFxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9QbGF5ZXJ7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5pbmRleFBsYXlMaXN0ID0gMDtcbiAgICAgICAgdGhpcy5hdWRpb0VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgICAgIHRoaXMuYXVkaW9FbHQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmF1ZGlvRWx0KTtcbiAgICAgICAgdGhpcy5fbmV4dFNvbmcoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGF5IGEgc29uZyBhY2NvcmRpbmcgdG8gdGhlIHVybCBvZiBzb25nXG4gICAgICovXG4gICAgX3BsYXlTb3VuZCh1cmwpe1xuICAgICAgICB0aGlzLmF1ZGlvRWx0LnBhdXNlKCk7XG4gICAgICAgIHRoaXMuYXVkaW9FbHQuc3JjID0gdXJsO1xuICAgICAgICB0aGlzLmF1ZGlvRWx0LnBsYXkoKTtcbiAgICAgICAgdGhpcy5hdWRpb0VsdC5vbmVuZGVkID0gdGhpcy5fbmV4dFNvbmcuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTa2lwIHRvIHRoZSBuZXh0IHNvbmdcbiAgICAgKi9cbiAgICBfbmV4dFNvbmcoKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdGhpcy5fcGxheVNvdW5kKGAuL2Fzc2V0cy9hdWRpby8ke1BMQVlMSVNUW3RoaXMuaW5kZXhQbGF5TGlzdF19YCk7XG4gICAgICAgICAgICB0aGlzLmluZGV4UGxheUxpc3QgPSAodGhpcy5pbmRleFBsYXlMaXN0ICsgMSkgJSBQTEFZTElTVC5sZW5ndGg7XG4gICAgICAgIH1jYXRjaChlcnIpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBzb3VuZCB2b2x1bWUgb2YgYXVkaW8gZWxlbWVudFxuICAgICAqL1xuICAgIG1hbmFnZVNvdW5kVm9sdW1lKGRlbHRhKXtcbiAgICAgICAgaWYgKGRlbHRhIDwgMTAgKiAxMDAwKXtcbiAgICAgICAgICAgIHRoaXMuYXVkaW9FbHQudm9sdW1lID0gTWF0aC5taW4oTWF0aC5tYXgoMCxkZWx0YSAvICgxMCAqIDEwMDApKSwwLjUpO1xuICAgICAgICB9XG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNvbnN0IFBMQVlMSVNUID0gW1xuICAgICcnICAgIFxuXTsiLCIndXNlIHN0cmljdCdcbmltcG9ydCB7UGVnfSBmcm9tICcuLi9sZWdvX3NoYXBlL3BlZy5qcyc7XG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi4vbGVnb19zaGFwZS9jaXJjbGUuanMnO1xuaW1wb3J0IHtOQl9DRUxMUywgSEVBREVSX0hFSUdIVCwgQkFTRV9MRUdPX0NPTE9SLCBCQUNLR1JPVU5EX0xFR09fQ09MT1J9IGZyb20gJy4uL2NvbW1vbi9jb25zdC5qcyc7XG5pbXBvcnQge2xlZ29CYXNlQ29sb3J9IGZyb20gJy4uL2NvbW1vbi9sZWdvQ29sb3JzLmpzJztcblxuLyoqXG4gKiBcbiAqIENsYXNzIGZvciBDYW52YXMgR3JpZFxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBMZWdvR3JpZENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoaWQsIHNob3dSb3cpIHtcbiAgICAgICAgLy8gQmFzaWMgY2FudmFzXG4gICAgICAgIHRoaXMuY2FudmFzRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvLyBTaXplIG9mIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhc1JlY3QgPSB0aGlzLmNhbnZhc0VsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgLy8gSW5kaWNhdG9yIGZvciBzaG93aW5nIHRoZSBmaXJzdCByb3cgd2l0aCBwZWdzXG4gICAgICAgIHRoaXMuc2hvd1JvdyA9IHNob3dSb3c7XG4gICAgICAgIHRoaXMuY2FudmFzRWx0LndpZHRoID0gdGhpcy5jYW52YXNSZWN0LndpZHRoO1xuICAgICAgICAvLyBBY2NvcmRpbmcgdG8gc2hvd1Jvdywgd2Ugd2lsbCBzaG93IG1vZGlmeSB0aGUgaGVhZGVyIEhlaWdodFxuICAgICAgICB0aGlzLmhlYWRlckhlaWdodCA9IHRoaXMuc2hvd1JvdyA/IEhFQURFUl9IRUlHSFQgOiAwO1xuICAgICAgICB0aGlzLmNhbnZhc0VsdC5oZWlnaHQgPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGggKyB0aGlzLmhlYWRlckhlaWdodDtcbiAgICAgICAgLy8gV2UgY2FsY3VsYXRlIHRoZSBjZWxsc2l6ZSBhY2NvcmRpbmcgdG8gdGhlIHNwYWNlIHRha2VuIGJ5IHRoZSBjYW52YXNcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpO1xuXG4gICAgICAgIC8vIFdlIGluaXRpYWxpemUgdGhlIEZhYnJpYyBKUyBsaWJyYXJ5IHdpdGggb3VyIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKGlkLCB7IHNlbGVjdGlvbjogZmFsc2UgfSk7XG4gICAgICAgIC8vIE9iamVjdCB0aGF0IHJlcHJlc2VudCB0aGUgcGVncyBvbiB0aGUgZmlyc3Qgcm93XG4gICAgICAgIHRoaXMucm93U2VsZWN0ID0ge307XG4gICAgICAgIC8vIFRoZSBjdXJyZW50IGRyYXcgbW9kZWwgKGluc3RydWN0aW9ucywgLi4uKVxuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fSxcbiAgICAgICAgLy8gRmxhZyB0byBkZXRlcm1pbmUgaWYgd2UgaGF2ZSB0byBjcmVhdGUgYSBuZXcgYnJpY2tcbiAgICAgICAgdGhpcy5jcmVhdGVOZXdCcmljayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gQkFTRV9MRUdPX0NPTE9SO1xuXG4gICAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgY2FudmFzXG4gICAgICAgIHRoaXMuX2RyYXdDYW52YXMoKTtcblxuICAgICAgICAvLyBJZiB3ZSBzaG93IHRoZSByb3csIHdlIGhhdmUgdG8gcGx1ZyB0aGUgbW92ZSBtYW5hZ2VtZW50XG4gICAgICAgIGlmIChzaG93Um93KSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6c2VsZWN0ZWQnLCAob3B0aW9ucykgPT4gdGhpcy5jdXJyZW50QnJpY2sgPSBvcHRpb25zLnRhcmdldC5wYXJlbnRQZWcgPyBvcHRpb25zLnRhcmdldCA6IG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ3NlbGVjdGlvbjpjbGVhcmVkJywgKG9wdGlvbnMpID0+IHRoaXMuY3VycmVudEJyaWNrID0gbnVsbCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdvYmplY3Q6bW92aW5nJywgKG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGVnID0gb3B0aW9ucy50YXJnZXQucGFyZW50UGVnO1xuXG5cbiAgICAgICAgICAgICAgICBsZXQgbmV3TGVmdCA9IE1hdGgucm91bmQob3B0aW9ucy50YXJnZXQubGVmdCAvIHRoaXMuY2VsbFNpemUpICogdGhpcy5jZWxsU2l6ZTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3VG9wID0gTWF0aC5yb3VuZCgob3B0aW9ucy50YXJnZXQudG9wIC0gdGhpcy5oZWFkZXJIZWlnaHQpIC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplICsgdGhpcy5oZWFkZXJIZWlnaHQ7ICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlIHRvcFxuICAgICAgICAgICAgICAgIGxldCB0b3BDb21wdXRlID0gbmV3VG9wICsgKHBlZy5zaXplLnJvdyA9PT0gMiB8fCBwZWcuYW5nbGUgPiAwID8gdGhpcy5jZWxsU2l6ZSAqIDIgOiB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgICAgICBsZXQgbGVmdENvbXB1dGUgPSBuZXdMZWZ0ICsgKHBlZy5zaXplLmNvbCA9PT0gMiA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgcGVnLm1vdmUoXG4gICAgICAgICAgICAgICAgICAgIG5ld0xlZnQsIC8vbGVmdFxuICAgICAgICAgICAgICAgICAgICBuZXdUb3AgLy8gdG9wXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIFdlIHNwZWNpZnkgdGhhdCB3ZSBjb3VsZCByZW1vdmUgYSBwZWcgaWYgb25lIG9mIGl0J3MgZWRnZSB0b3VjaCB0aGUgb3V0c2lkZSBvZiB0aGUgY2FudmFzXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA8IEhFQURFUl9IRUlHSFRcbiAgICAgICAgICAgICAgICAgICAgfHwgbmV3TGVmdCA8IDBcbiAgICAgICAgICAgICAgICAgICAgfHwgdG9wQ29tcHV0ZSA+PSB0aGlzLmNhbnZhc0VsdC5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgfHwgbGVmdENvbXB1dGUgPj0gdGhpcy5jYW52YXNFbHQud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBFbHNlIHdlIGNoZWNrIHdlIGNyZWF0ZSBhIG5ldyBwZWcgKHdoZW4gYSBwZWcgZW50ZXIgaW4gdGhlIGRyYXcgYXJlYSlcbiAgICAgICAgICAgICAgICAgICAgcGVnLnRvUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGVnLnJlcGxhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWcuc2l6ZS5jb2wgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVnLnNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgyKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmIChwZWcuYW5nbGUgPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGVnLnJlcGxhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ21vdXNlOnVwJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCcmlja1xuICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcudG9SZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnJlcGxhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuYnJpY2tNb2RlbFt0aGlzLmN1cnJlbnRCcmljay5wYXJlbnRQZWcuaWRdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmUodGhpcy5jdXJyZW50QnJpY2spO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBmb3IgY2hhbmdpbmcgdGhlIGNvbG9yIG9mIHRoZSBmaXJzdCByb3cgXG4gICAgICovXG4gICAgY2hhbmdlQ29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29sb3IgPSBjb2xvcjsgICAgICAgXG4gICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZS5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZS5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMucm93U2VsZWN0LnJlY3QuY2hhbmdlQ29sb3IoY29sb3IpO1xuICAgICAgICB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdC5jaGFuZ2VDb2xvcihjb2xvcik7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlcmlhbGl6ZSB0aGUgY2FudmFzIHRvIGEgbWluaW1hbCBvYmplY3QgdGhhdCBjb3VsZCBiZSB0cmVhdCBhZnRlclxuICAgICAqL1xuICAgIGV4cG9ydCh1c2VyTmFtZSwgdXNlcklkKSB7XG4gICAgICAgIGxldCByZXN1bHRBcnJheSA9IFtdO1xuICAgICAgICAvLyBXZSBmaWx0ZXIgdGhlIHJvdyBwZWdzXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5icmlja01vZGVsKVxuICAgICAgICAgICAgLmZpbHRlcigoa2V5KT0+a2V5ICE9IHRoaXMucm93U2VsZWN0LnNxdWFyZS5pZFxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuaWRcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QucmVjdC5pZFxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdC5pZCk7XG4gICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGVnVG1wID0gdGhpcy5icmlja01vZGVsW2tleV07XG4gICAgICAgICAgICByZXN1bHRBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICBzaXplOiBwZWdUbXAuc2l6ZSxcbiAgICAgICAgICAgICAgICBjb2xvcjogcGVnVG1wLmNvbG9yLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiBwZWdUbXAuYW5nbGUsXG4gICAgICAgICAgICAgICAgdG9wOiBwZWdUbXAudG9wIC0gdGhpcy5oZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdDogcGVnVG1wLmxlZnQsXG4gICAgICAgICAgICAgICAgY2VsbFNpemUgOiB0aGlzLmNlbGxTaXplXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1c2VyOiB1c2VyTmFtZSxcbiAgICAgICAgICAgIHVzZXJJZCA6IHVzZXJJZCxcbiAgICAgICAgICAgIGluc3RydWN0aW9uczogcmVzdWx0QXJyYXlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGZyb20gaW50cnVjdGlvbnMgYSBkcmF3XG4gICAgICovXG4gICAgZHJhd0luc3RydWN0aW9ucyhpbnN0cnVjdGlvbk9iamVjdCl7XG4gICAgICAgIHRoaXMucmVzZXRCb2FyZCgpO1xuICAgICAgICB0aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xuICAgICAgICBpbnN0cnVjdGlvbk9iamVjdC5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdHJ1Y3Rpb24pPT57XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlQnJpY2soeyBzaXplIDogaW5zdHJ1Y3Rpb24uc2l6ZSwgXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgOiAoaW5zdHJ1Y3Rpb24ubGVmdCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IChpbnN0cnVjdGlvbi50b3AgLyBpbnN0cnVjdGlvbi5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZSA6IGluc3RydWN0aW9uLmFuZ2xlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvciA6IGluc3RydWN0aW9uLmNvbG9yXG4gICAgICAgICAgICAgICAgfSkuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgKTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbiB0aGUgYm9hcmQgYW5kIHRoZSBzdGF0ZSBvZiB0aGUgY2FudmFzXG4gICAgICovXG4gICAgcmVzZXRCb2FyZCgpe1xuICAgICAgICB0aGlzLmJyaWNrTW9kZWwgPSB7fTtcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xuICAgIH1cblxuICAgIC8qKiBcbiAgICAgKiBHZW5lcmF0ZSBhIEJhc2U2NCBpbWFnZSBmcm9tIHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICBzbmFwc2hvdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogUHJpdmF0ZXMgTWV0aG9kc1xuICAgICAqIFxuICAgICAqL1xuXG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHRoZSBiYXNpYyBncmlkIFxuICAgICovXG4gICAgX2RyYXdHcmlkKHNpemUpIHsgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnNob3dSb3cpe1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVNxdWFyZSgxKS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVNxdWFyZSgyKS5jYW52YXNFbHRcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0XG4gICAgICAgICAgICAgICAgLCB0aGlzLl9jcmVhdGVSZWN0KDEsOTApLmNhbnZhc0VsdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYWxsIHRoZSB3aGl0ZSBwZWcgb2YgdGhlIGdyaWRcbiAgICAgKi9cbiAgICBfZHJhd1doaXRlUGVnKHNpemUpe1xuICAgICAgICAvLyBXZSBzdG9wIHJlbmRlcmluZyBvbiBlYWNoIGFkZCwgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXNcbiAgICAgICAgLy90aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbWF4ID0gTWF0aC5yb3VuZChzaXplIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIGxldCBtYXhTaXplID0gbWF4ICogdGhpcy5jZWxsU2l6ZTtcbiAgICAgICAgZm9yICh2YXIgcm93ID0wOyByb3cgPCBtYXg7IHJvdysrKXtcbiAgICAgICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1heDsgY29sKysgKXtcbiAgICAgICAgICAgICAgICAgbGV0IHNxdWFyZVRtcCA9IG5ldyBmYWJyaWMuUmVjdCh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IEJBQ0tHUk9VTkRfTEVHT19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJlZFJvdGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlID0gbmV3IENpcmNsZSh0aGlzLmNlbGxTaXplLCBCQUNLR1JPVU5EX0xFR09fQ09MT1IpO1xuICAgICAgICAgICAgICAgIGNpcmNsZS5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFkgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoYXNCb3JkZXJzIDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBUbXAgPSBuZXcgZmFicmljLkdyb3VwKFtzcXVhcmVUbXAsIGNpcmNsZS5jYW52YXNFbHRdLCB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuY2VsbFNpemUgKiBjb2wsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5jZWxsU2l6ZSAqIHJvdyArIHRoaXMuaGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1JvdGF0aW9uIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbG9ja01vdmVtZW50WCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tNb3ZlbWVudFkgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoYXNCb3JkZXJzIDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoZ3JvdXBUbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgLy8gV2UgdHJhbnNmb3JtIHRoZSBjYW52YXMgdG8gYSBiYXNlNjQgaW1hZ2UgaW4gb3JkZXIgdG8gc2F2ZSBwZXJmb3JtYW5jZXMuXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTsgICAgIFxuICAgICAgICB0aGlzLmNhbnZhcy5zZXRCYWNrZ3JvdW5kSW1hZ2UodXJsLHRoaXMuY2FudmFzLnJlbmRlckFsbC5iaW5kKHRoaXMuY2FudmFzKSwge1xuICAgICAgICAgICAgb3JpZ2luWDogJ2xlZnQnLFxuICAgICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5jYW52YXMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmNhbnZhcy5oZWlnaHQsXG4gICAgICAgIH0pOyAgICovXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCByZWN0YW5nbGVcbiAgICAgKi9cbiAgICBfY3JlYXRlUmVjdChzaXplUmVjdCwgYW5nbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcbiAgICAgICAgICAgICAgICBzaXplIDoge2NvbCA6IDIgKiBzaXplUmVjdCwgcm93IDoxICogc2l6ZVJlY3R9LCBcbiAgICAgICAgICAgICAgICBsZWZ0IDogYW5nbGUgPyAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAvIDQpIC0gdGhpcy5jZWxsU2l6ZSkgOiAoKHRoaXMuY2FudmFzUmVjdC53aWR0aCAqIDMgLyA0KSAtICh0aGlzLmNlbGxTaXplICogMS41KSksXG4gICAgICAgICAgICAgICAgdG9wIDogYW5nbGUgPyAxIDogMCxcbiAgICAgICAgICAgICAgICBhbmdsZSA6IGFuZ2xlXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBzcXVhcmUgKDF4MSkgb3IgKDJ4MilcbiAgICAgKi9cbiAgICBfY3JlYXRlU3F1YXJlKHNpemVTcXVhcmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUJyaWNrKHtcbiAgICAgICAgICAgICAgICBzaXplIDoge2NvbCA6IDEgKiBzaXplU3F1YXJlLCByb3cgOjEgKiBzaXplU3F1YXJlfSwgXG4gICAgICAgICAgICAgICAgbGVmdDogc2l6ZVNxdWFyZSA9PT0gMiA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gMikgLSAoMiAqIHRoaXMuY2VsbFNpemUpKSA6ICh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLSAodGhpcy5jZWxsU2l6ZSAqIDEuNSkpLFxuICAgICAgICAgICAgICAgIHRvcCA6IHNpemVTcXVhcmUgPT09IDIgPyAxIDogMCxcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyaWMgbWV0aG9kIHRoYXQgY3JlYXRlIGEgcGVnXG4gICAgICovXG4gICAgX2NyZWF0ZUJyaWNrKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5jZWxsU2l6ZSA9IHRoaXMuY2VsbFNpemU7XG4gICAgICAgIG9wdGlvbnMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8IHRoaXMubGFzdENvbG9yO1xuICAgICAgICBsZXQgcGVnID0gbmV3IFBlZyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5icmlja01vZGVsW3BlZy5pZF0gPSBwZWc7XG4gICAgICAgIC8vIFdlIGhhdmUgdG8gdXBkYXRlIHRoZSByb3dTZWxlY3QgT2JqZWN0IHRvIGJlIGFsc3dheSB1cGRhdGVcbiAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZS5yb3cgPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMucm93U2VsZWN0LmJpZ1NxdWFyZSA9IHBlZztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFuZ2xlKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdCA9IHBlZztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNpemUuY29sID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0ID0gcGVnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3Quc3F1YXJlID0gcGVnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwZWc7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbml0IHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICBfZHJhd0NhbnZhcygpIHtcbiAgICAgICAgdGhpcy5fZHJhd1doaXRlUGVnKHRoaXMuY2FudmFzUmVjdC53aWR0aCk7XG4gICAgICAgIHRoaXMuX2RyYXdHcmlkKHRoaXMuY2FudmFzUmVjdC53aWR0aCwgTWF0aC5yb3VuZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyBOQl9DRUxMUykpO1xuICAgIH1cbiAgICBcblxufSIsIid1c2Ugc3RyaWN0J1xuXG4vLyBOdW1iZXIgb2YgY2VsbCBvbiB0aGUgZ3JpZFxuZXhwb3J0IGNvbnN0IE5CX0NFTExTID0gMTU7XG5cbi8vIEhlaWdodCBvZiB0aGUgaGVhZGVyXG5leHBvcnQgY29uc3QgSEVBREVSX0hFSUdIVCA9IHdpbmRvdy5zY3JlZW4ud2lkdGggPD0gNzY4ICA/IDYwIDogMTAwO1xuXG4vLyBGaXJzdCBjb2xvciB0byB1c2VcbmV4cG9ydCBjb25zdCBCQVNFX0xFR09fQ09MT1IgPSBcIiMwZDY5ZjJcIjtcblxuLy8gTWVkaXVtIFN0b25lIEdyZXkgXG5jb25zdCBDT0xPUl8xOTQgPSBcIiNhM2EyYTRcIjtcblxuLy8gTGlnaHQgU3RvbmUgR3JleVxuY29uc3QgQ09MT1JfMjA4ID0gXCIjZTVlNGRlXCI7IFxuXG4vLyBCYWNrZ3JvdW5kIGNvbG9yIHVzZWRcbmV4cG9ydCBjb25zdCBCQUNLR1JPVU5EX0xFR09fQ09MT1IgPSBDT0xPUl8yMDg7IiwiJ3VzZSBzdHJpY3QnXG5cbi8qXG4qIENvbG9ycyBmcm9tIFxuKiBodHRwOi8vbGVnby53aWtpYS5jb20vd2lraS9Db2xvdXJfUGFsZXR0ZSBcbiogQW5kIGh0dHA6Ly93d3cucGVlcm9uLmNvbS9jZ2ktYmluL2ludmNnaXMvY29sb3JndWlkZS5jZ2lcbiogT25seSBTaG93IHRoZSBjb2xvciB1c2Ugc2luY2UgMjAxMFxuKiovIFxuZXhwb3J0IGNvbnN0IExFR09fQ09MT1JTID0gW1xuICAgICdyZ2IoMjQ1LCAyMDUsIDQ3KScsIC8vMjQsIEJyaWdodCBZZWxsb3cgKlxuICAgICdyZ2IoMjUzLCAyMzQsIDE0MCknLCAvLzIyNiwgQ29vbCBZZWxsb3cgKlxuICAgICdyZ2IoMjE4LCAxMzMsIDY0KScsIC8vMTA2LCBCcmlnaHQgT3JhbmdlICpcbiAgICAncmdiKDIzMiwgMTcxLCA0NSknLCAvLzE5MSwgRmxhbWUgWWVsbG93aXNoIE9yYW5nZSAqXG4gICAgJ3JnYigxOTYsIDQwLCAyNyknLCAvLzIxLCBCcmlnaHQgUmVkICpcbiAgICAncmdiKDEyMywgNDYsIDQ3KScsIC8vMTU0LCBEYXJrIFJlZCAqXG4gICAgJ3JnYigyMDUsIDk4LCAxNTIpJywgLy8yMjEsIEJyaWdodCBQdXJwbGUgKlxuICAgICdyZ2IoMjI4LCAxNzMsIDIwMCknLCAvLzIyMiwgTGlnaHQgUHVycGxlICpcbiAgICAncmdiKDE0NiwgNTcsIDEyMCknLCAvLzEyNCwgQnJpZ2h0IFJlZGRpc2ggVmlvbGV0ICpcbiAgICAncmdiKDUyLCA0MywgMTE3KScsIC8vMjY4LCBNZWRpdW0gTGlsYWMgKlxuICAgICdyZ2IoMTMsIDEwNSwgMjQyKScsIC8vMjMsIEJyaWdodCBCbHVlICpcbiAgICAncmdiKDE1OSwgMTk1LCAyMzMpJywgLy8yMTIsIExpZ2h0IFJveWFsIEJsdWUgKlxuICAgICdyZ2IoMTEwLCAxNTMsIDIwMSknLCAvLzEwMiwgTWVkaXVtIEJsdWUgKlxuICAgICdyZ2IoMzIsIDU4LCA4NiknLCAvLzE0MCwgRWFydGggQmx1ZSAqXG4gICAgJ3JnYigxMTYsIDEzNCwgMTU2KScsIC8vMTM1LCBTYW5kIEJsdWUgKlxuICAgICdyZ2IoNDAsIDEyNywgNzApJywgLy8yOCwgRGFyayBHcmVlbiAqXG4gICAgJ3JnYig3NSwgMTUxLCA3NCknLCAvLzM3LCBCaXJnaHQgR3JlZW4gKlxuICAgICdyZ2IoMTIwLCAxNDQsIDEyOSknLCAvLzE1MSwgU2FuZCBHcmVlbiAqXG4gICAgJ3JnYigzOSwgNzAsIDQ0KScsIC8vMTQxLCBFYXJ0aCBHcmVlbiAqXG4gICAgJ3JnYigxNjQsIDE4OSwgNzApJywgLy8xMTksIEJyaWdodCBZZWxsb3dpc2gtR3JlZW4gKiBcbiAgICAncmdiKDEwNSwgNjQsIDM5KScsIC8vMTkyLCBSZWRkaXNoIEJyb3duICpcbiAgICAncmdiKDIxNSwgMTk3LCAxNTMpJywgLy81LCBCcmljayBZZWxsb3cgKiBcbiAgICAncmdiKDE0OSwgMTM4LCAxMTUpJywgLy8xMzgsIFNhbmQgWWVsbG93ICpcbiAgICAncmdiKDE3MCwgMTI1LCA4NSknLCAvLzMxMiwgTWVkaXVtIE5vdWdhdCAqICAgIFxuICAgICdyZ2IoNDgsIDE1LCA2KScsIC8vMzA4LCBEYXJrIEJyb3duICpcbiAgICAncmdiKDIwNCwgMTQyLCAxMDQpJywgLy8xOCwgTm91Z2F0ICpcbiAgICAncmdiKDI0NSwgMTkzLCAxMzcpJywgLy8yODMsIExpZ2h0IE5vdWdhdCAqXG4gICAgJ3JnYigxNjAsIDk1LCA1MiknLCAvLzM4LCBEYXJrIE9yYW5nZSAqXG4gICAgJ3JnYigyNDIsIDI0MywgMjQyKScsIC8vMSwgV2hpdGUgKlxuICAgICdyZ2IoMjI5LCAyMjgsIDIyMiknLCAvLzIwOCwgTGlnaHQgU3RvbmUgR3JleSAqXG4gICAgJ3JnYigxNjMsIDE2MiwgMTY0KScsIC8vMTk0LCBNZWRpdW0gU3RvbmUgR3JleSAqXG4gICAgJ3JnYig5OSwgOTUsIDk3KScsIC8vMTk5LCBEYXJrIFN0b25lIEdyZXkgKlxuICAgICdyZ2IoMjcsIDQyLCA1MiknLCAvLzI2LCBCbGFjayAqICAgICAgICBcbl07IiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBhIHZhcmlhdGlvbiBvZiBjb2xvclxuICogXG4gKiBGcm9tIDogaHR0cHM6Ly93d3cuc2l0ZXBvaW50LmNvbS9qYXZhc2NyaXB0LWdlbmVyYXRlLWxpZ2h0ZXItZGFya2VyLWNvbG9yL1xuICovXG5leHBvcnQgZnVuY3Rpb24gQ29sb3JMdW1pbmFuY2UoaGV4LCBsdW0pIHtcblxuICAgICAgICAvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG4gICAgICAgIGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcbiAgICAgICAgfVxuICAgICAgICBsdW0gPSBsdW0gfHwgMDtcblxuICAgICAgICAvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG4gICAgICAgIHZhciByZ2IgPSBcIiNcIiwgYywgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgYyA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSAqIDIsIDIpLCAxNik7XG4gICAgICAgICAgICBjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgcmdiICs9IChcIjAwXCIgKyBjKS5zdWJzdHIoYy5sZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJnYjtcbn0iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBCYXNpYyBGaXJlYmFzZSBoZWxwZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEZpcmVCYXNlTGVnb0FwcHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAvLyBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbiwgWW91IHNob3VsZCB1cGRhdGUgd2l0aCB5b3VyIEtleXMgIVxuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGFwaUtleTogXCJBSXphU3lEcjlSODV0TmpmS1dkZFcxLU43WEpwQWhHcVhOR2FKNWtcIixcbiAgICAgICAgICAgIGF1dGhEb21haW46IFwibGVnb25uYXJ5LmZpcmViYXNlYXBwLmNvbVwiLFxuICAgICAgICAgICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9sZWdvbm5hcnkuZmlyZWJhc2Vpby5jb21cIixcbiAgICAgICAgICAgIHN0b3JhZ2VCdWNrZXQ6IFwiXCIsXG4gICAgICAgIH0gXG5cbiAgICAgICAgdGhpcy5hcHAgPSBmaXJlYmFzZS5pbml0aWFsaXplQXBwKHRoaXMuY29uZmlnKTtcbiAgICB9XG5cblxufVxuXG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBDbGFzcyBmb3IgZ2VuZXJpYyBtYW5hZ2VtZW50IG9mIEF1dGhlbnRpY2F0aW9uIHdpdGggZmlyZWJhc2UuXG4gKiBcbiAqIEl0IHRha2VzIGNhcmUgb2YgaHRtbCB0byBoaWRlIG9yIHNob3dcbiAqL1xuZXhwb3J0IGNsYXNzIEZpcmVCYXNlQXV0aHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpe1xuICAgICAgXG4gICAgICAgIGxldCB1aUNvbmZpZyA9IHtcbiAgICAgICAgICAgICdjYWxsYmFja3MnOiB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHNpZ25lZCBpbi5cbiAgICAgICAgICAgICAgICAnc2lnbkluU3VjY2Vzcyc6IGZ1bmN0aW9uKHVzZXIsIGNyZWRlbnRpYWwsIHJlZGlyZWN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCByZWRpcmVjdC5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBPcGVucyBJRFAgUHJvdmlkZXJzIHNpZ24taW4gZmxvdyBpbiBhIHBvcHVwLlxuICAgICAgICAgICAgJ3NpZ25JbkZsb3cnOiAncG9wdXAnLFxuICAgICAgICAgICAgJ3NpZ25Jbk9wdGlvbnMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICAgICAgICBzY29wZXM6IFsnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9wbHVzLmxvZ2luJ11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguRmFjZWJvb2tBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgICAgICAgZmlyZWJhc2UuYXV0aC5Ud2l0dGVyQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguR2l0aHViQXV0aFByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguRW1haWxBdXRoUHJvdmlkZXIuUFJPVklERVJfSURcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAvLyBUZXJtcyBvZiBzZXJ2aWNlIHVybC5cbiAgICAgICAgICAgICd0b3NVcmwnOiAnaHR0cHM6Ly9nZGduYW50ZXMuY29tJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVpID0gbmV3IGZpcmViYXNldWkuYXV0aC5BdXRoVUkoZmlyZWJhc2UuYXV0aCgpKTtcbiAgICAgICAgdGhpcy51aS5zdGFydCgnI2ZpcmViYXNldWktYXV0aC1jb250YWluZXInLCB1aUNvbmZpZyk7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIHRoaXMuaWREaXZMb2dpbiA9IGNvbmZpZy5pZERpdkxvZ2luO1xuICAgICAgICB0aGlzLmlkTmV4dERpdiA9IGNvbmZpZy5pZE5leHREaXY7XG4gICAgICAgIHRoaXMuaWRMb2dvdXQgPSBjb25maWcuaWRMb2dvdXQ7XG5cbiAgICAgICAgLy8gT3B0aW9uYWxzXG4gICAgICAgIHRoaXMuaWRJbWcgPSBjb25maWcuaWRJbWcgPyBjb25maWcuaWRJbWcgOiBudWxsO1xuICAgICAgICB0aGlzLmlkRGlzcGxheU5hbWUgPSBjb25maWcuaWREaXNwbGF5TmFtZSA/IGNvbmZpZy5pZERpc3BsYXlOYW1lIDogbnVsbDtcblxuXG4gICAgICAgIGZpcmViYXNlLmF1dGgoKS5vbkF1dGhTdGF0ZUNoYW5nZWQodGhpcy5fY2hlY2tDYWxsQmFja0NvbnRleHQuYmluZCh0aGlzKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tDYWxsQmFja0Vycm9yQ29udGV4dC5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQgPSBudWxsO1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PiAgZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW4gY2FzZSBvZiBlcnJvclxuICAgICAqL1xuICAgIF9jaGVja0NhbGxCYWNrRXJyb3JDb250ZXh0KGVycm9yKXtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgbWV0aG9kIHdpdGggdGhlIHN0YXRlIG9mIGNvbm5lY3Rpb25cbiAgICAgKiBcbiAgICAgKiBBY2NvcmRpbmcgdG8gJ3VzZXInLCBpdCB3aWxsIHNob3cgb3IgaGlkZSBzb21lIGh0bWwgYXJlYXNcbiAgICAgKi9cbiAgICBfY2hlY2tDYWxsQmFja0NvbnRleHQodXNlcil7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIGlmICh1c2VyKXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWREaXZMb2dpbikuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTmV4dERpdikucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmlkSW1nKXtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zcmMgPSB1c2VyLnBob3RvVVJMO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaWREaXNwbGF5TmFtZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpc3BsYXlOYW1lKS5pbm5lckhUTUwgPSB1c2VyLmRpc3BsYXlOYW1lOzsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZERpdkxvZ2luKS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWROZXh0RGl2KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykuc3JjID0gXCJcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRJbWcpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgXCJcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGlzcGxheU5hbWUpLmlubmVySFRNTCA9IFwiTm9uIENvbm50ZWN0w6lcIjsgICAgICAgICAgICBcblxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuY2JBdXRoQ2hhbmdlZCl7XG4gICAgICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQodXNlcik7XG4gICAgICAgIH1cbiAgICAgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdHJhdGlvbiBvZiBjYWxsYmFjayBmb3IgZnV0dXIgaW50ZXJhY3Rpb24uXG4gICAgICogVGhlIGNhbGxiYWNrIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB3aXRoIHVzZXIgYXMgcGFyYW1ldGVyXG4gICAgICovXG4gICAgb25BdXRoU3RhdGVDaGFuZ2VkKGNiKXtcbiAgICAgICAgdGhpcy5jYkF1dGhDaGFuZ2VkID0gY2I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCBsb2dnZWQgdXNlclxuICAgICAqL1xuICAgIGRpc3BsYXlOYW1lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXIgPyB0aGlzLnVzZXIuZGlzcGxheU5hbWUgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGlkIG9mIHRoZSBjdXJyZW50IGxvZ2dlZCB1c2VyXG4gICAgICovXG4gICAgdXNlcklkKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXIgPyB0aGlzLnVzZXIudWlkIDogbnVsbDtcbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0NvbG9yTHVtaW5hbmNlfSBmcm9tICcuLi9jb21tb24vdXRpbC5qcyc7XG5cbi8qKlxuICogQ2lyY2xlIExlZ28gY2xhc3NcbiAqIFRoZSBjaXJjbGUgaXMgY29tcG9zZWQgb2YgMiBjaXJjbGUgKG9uIHRoZSBzaGFkb3csIGFuZCB0aGUgb3RoZXIgb25lIGZvciB0aGUgdG9wKVxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBDaXJjbGV7XG4gICAgY29uc3RydWN0b3IoY2VsbFNpemUsIGNvbG9yKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMgPSBuZXcgZmFicmljLkNpcmNsZSh7XG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNSxcbiAgICAgICAgICAgIGZpbGw6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBzaGFkb3cgOiBcIjBweCAycHggMTBweCByZ2JhKDAsMCwwLDAuMilcIlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4ID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xuICAgICAgICAgICAgcmFkaXVzOiAoY2VsbFNpemUgLyAyKSAtIDQsXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gbmV3IGZhYnJpYy5UZXh0KCdHREcnLCB7XG4gICAgICAgICAgICBmb250U2l6ZTogY2VsbFNpemUgLyA1LFxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjE1KSxcbiAgICAgICAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXG4gICAgICAgICAgICBzdHJva2U6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMCksXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdyb3VwID0gbmV3IGZhYnJpYy5Hcm91cChbdGhpcy5jaXJjbGVCYXNpY0V0eCwgdGhpcy5jaXJjbGVCYXNpYywgdGhpcy50ZXh0XSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBGYWJyaWNKUyBlbGVtZW50XG4gICAgICovXG4gICAgZ2V0IGNhbnZhc0VsdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDsgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgY2lyY2xlXG4gICAgICovXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljLnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xKSk7XG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHguc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIDAuMSkpO1xuICAgICAgICB0aGlzLnRleHQuc2V0KHtcbiAgICAgICAgICAgIGZpbGwgOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxuICAgICAgICAgICAgc3Ryb2tlIDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKVxuICAgICAgICB9KTtcbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnXG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi9jaXJjbGUuanMnO1xuXG4vKipcbiAqIFBlZyBMZWdvIGNsYXNzXG4gKiBUaGUgcGVnIGlzIGNvbXBvc2VkIG9mIG4gY2lyY2xlIGZvciBhIGRpbWVuc2lvbiB0aGF0IGRlcGVuZCBvbiB0aGUgc2l6ZSBwYXJhbWV0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFBlZ3tcbiAgICBjb25zdHJ1Y3Rvcih7c2l6ZSA9IHtjb2wgOiAxLCByb3cgOiAxfSwgY2VsbFNpemUgPSAwLCBjb2xvciA9ICcjRkZGJywgbGVmdCA9IDAsIHRvcCA9IDAsIGFuZ2xlID0gMH0pe1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmlkID0gYFBlZyR7c2l6ZX0tJHtEYXRlLm5vdygpfWA7XG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG9SZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlIHx8IDA7XG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkgPSBbXTtcblxuXG4gICAgICAgIHRoaXMucmVjdEJhc2ljID0gbmV3IGZhYnJpYy5SZWN0KHtcbiAgICAgICAgICAgIHdpZHRoOiBjZWxsU2l6ZSAqIHNpemUuY29sLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZSAqIHNpemUucm93LFxuICAgICAgICAgICAgZmlsbDogY29sb3IsXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxuICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiNXB4IDVweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgbGV0IGFycmF5RWx0cyA9IFt0aGlzLnJlY3RCYXNpY107XG4gICAgICAgIGxldCBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTsgICAgICAgXG4gICAgICAgIC8vIEFjY29yZGluZyB0byB0aGUgc2l6ZSwgd2UgZG9uJ3QgcGxhY2UgdGhlIGNpcmNsZXMgYXQgdGhlIHNhbWUgcGxhY2VcbiAgICAgICAgaWYgKHNpemUuY29sID09PSAyKXtcbiAgICAgICAgICAgIC8vIEZvciBhIHJlY3RhbmdsZSBvciBhIGJpZyBTcXVhcmVcbiAgICAgICAgICAgIC8vIFdlIHVwZGF0ZSB0aGUgcm93IHBvc2l0aW9uc1xuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xuICAgICAgICAgICAgICAgICAgICB0b3AgOiAoLWNlbGxTaXplICs1KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cC5jYW52YXNFbHQuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhIEJpZyBTcXVhcmVcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDUsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNpcmNsZUFycmF5LmZvckVhY2goKGNpcmNsZSk9PmFycmF5RWx0cy5wdXNoKGNpcmNsZS5jYW52YXNFbHQpKTtcblxuICAgICAgICAvLyBUaGUgcGVnIGlzIGxvY2tlZCBpbiBhbGwgcG9zaXRpb25cbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoYXJyYXlFbHRzLCB7XG4gICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXG4gICAgICAgICAgICB0b3A6IHRoaXMudG9wLFxuICAgICAgICAgICAgYW5nbGU6IHRoaXMuYW5nbGUsXG4gICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxuICAgICAgICAgICAgbG9ja1NjYWxpbmdYIDogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2tTY2FsaW5nWSA6IHRydWUsXG4gICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXZSBhZGQgdG8gRmFicmljRWxlbWVudCBhIHJlZmVyZW5jZSB0byB0aGUgY3VyZW50IHBlZ1xuICAgICAgICB0aGlzLmdyb3VwLnBhcmVudFBlZyA9IHRoaXM7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBUaGUgRmFicmljSlMgZWxlbWVudFxuICAgIGdldCBjYW52YXNFbHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7XG4gICAgfVxuXG4gICAgLy8gVHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgcmVwbGFjZWRcbiAgICBnZXQgcmVwbGFjZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5pc1JlcGxhY2VcbiAgICB9XG5cbiAgICAvLyBTZXR0ZXIgZm9yIGlzUmVwbGFjZSBwYXJhbVxuICAgIHNldCByZXBsYWNlKHJlcGxhY2Upe1xuICAgICAgICB0aGlzLmlzUmVwbGFjZSA9IHJlcGxhY2U7XG4gICAgfVxuXG4gICAgLy8gQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgcGVnXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMucmVjdEJhc2ljLnNldCgnZmlsbCcsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT4gY2lyY2xlLmNoYW5nZUNvbG9yKGNvbG9yKSk7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBNb3ZlIHRoZSBwZWcgdG8gZGVzaXJlIHBvc2l0aW9uXG4gICAgbW92ZShsZWZ0LCB0b3Ape1xuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xuICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICBsZWZ0IDogbGVmdFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSb3RhdGUgdGhlIHBlZyB0byB0aGUgZGVzaXJlIGFuZ2xlXG4gICAgcm90YXRlKGFuZ2xlKXtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XG4gICAgICAgICAgICBhbmdsZSA6IGFuZ2xlXG4gICAgICAgIH0pO1xuICAgIH1cblxufSIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIENsYXNzIGZvciBwbGF5aW5nIHZpZGVvIFxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1BsYXllcntcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnRFbHQsIGNhbGxCYWNrRW5kKXtcbiAgICAgICAgdGhpcy52aWRlb0VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICAgIHBhcmVudEVsdC5hcHBlbmRDaGlsZCh0aGlzLnZpZGVvRWx0KTtcbiAgICAgICAgdGhpcy52aWRlb05hbWUgPSAnJzsgICAgICAgIFxuICAgICAgICB0aGlzLmNhbGxCYWNrRW5kID0gY2FsbEJhY2tFbmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxheSB0aGUgdmlkZW9cbiAgICAgKi9cbiAgICBwbGF5VmlkZW8oKXtcbiAgICAgICAgdGhpcy52aWRlb0VsdC5wYXVzZSgpO1xuICAgICAgICB0aGlzLnZpZGVvRWx0LnNyYyA9IGAuL2Fzc2V0cy92aWRlby8ke3RoaXMudmlkZW9OYW1lfWA7XG4gICAgICAgIHRoaXMudmlkZW9FbHQucGxheSgpO1xuICAgICAgICB0aGlzLnZpZGVvRWx0Lm9uZW5kZWQgPSB0aGlzLmNhbGxCYWNrRW5kLmJpbmQodGhpcyk7XG4gICAgfVxuICAgXG59Il19
