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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHNjcmlwdHNcXGFwcF9zY3JlZW4uanMiLCJzcmNcXHNjcmlwdHNcXGF1ZGlvXFxwbGF5ZXIuanMiLCJzcmNcXHNjcmlwdHNcXGF1ZGlvXFxwbGF5bGlzdC5qcyIsInNyY1xcc2NyaXB0c1xcY2FudmFzXFxsZWdvQ2FudmFzLmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGNvbnN0LmpzIiwic3JjXFxzY3JpcHRzXFxjb21tb25cXGxlZ29Db2xvcnMuanMiLCJzcmNcXHNjcmlwdHNcXGNvbW1vblxcdXRpbC5qcyIsInNyY1xcc2NyaXB0c1xcZmlyZWJhc2VcXGZpcmViYXNlLmpzIiwic3JjXFxzY3JpcHRzXFxmaXJlYmFzZVxcZmlyZWJhc2VBdXRoLmpzIiwic3JjXFxzY3JpcHRzXFxsZWdvX3NoYXBlXFxjaXJjbGUuanMiLCJzcmNcXHNjcmlwdHNcXGxlZ29fc2hhcGVcXHBlZy5qcyIsInNyY1xcc2NyaXB0c1xcdmlkZW9cXHBsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBLENBQUMsWUFBWTs7QUFFVCxRQUFJLFdBQVcsS0FBZjtBQUFBLFFBQXFCO0FBQ2pCLG1CQUFlLElBRG5CO0FBQUEsUUFDd0I7QUFDcEIsaUJBQWEsSUFGakI7QUFBQSxRQUV1QjtBQUNuQixpQkFBYSxJQUhqQjtBQUFBLFFBR3VCO0FBQ25CLGtCQUFjLElBSmxCO0FBQUEsUUFJdUI7QUFDbkIsaUJBQWEsSUFMakI7QUFBQSxRQUt1QjtBQUNuQixpQkFBYSxJQU5qQjtBQUFBLFFBTXVCO0FBQ25CLHlCQUFxQixJQVB6QjtBQUFBLFFBTytCO0FBQzNCLGVBQVcsS0FSZjtBQUFBLFFBUXNCO0FBQ2xCLGlCQUFhLE9BQU8sMEJBQVAsRUFBbUMsMEJBQW5DLENBVGpCO0FBQUEsUUFTaUY7QUFDN0Usc0JBQWtCLElB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bGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtGaXJlQmFzZUxlZ29BcHB9IGZyb20gJy4vZmlyZWJhc2UvZmlyZWJhc2UuanMnO1xyXG5pbXBvcnQge0ZpcmVCYXNlQXV0aH0gZnJvbSAnLi9maXJlYmFzZS9maXJlYmFzZUF1dGguanMnO1xyXG5pbXBvcnQge0xlZ29HcmlkQ2FudmFzfSBmcm9tICcuL2NhbnZhcy9sZWdvQ2FudmFzLmpzJztcclxuaW1wb3J0IHtBdWRpb1BsYXllcn0gZnJvbSAnLi9hdWRpby9wbGF5ZXIuanMnO1xyXG5pbXBvcnQge1ZpZGVvUGxheWVyfSBmcm9tICcuL3ZpZGVvL3BsYXllci5qcyc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGxldCBnYW1lSW5pdCA9IGZhbHNlLC8vIHRydWUgaWYgd2UgaW5pdCB0aGUgbGVnb0dyaWRcclxuICAgICAgICBmaXJlQmFzZUxlZ28gPSBudWxsLC8vIHRoZSByZWZlcmVuY2Ugb2YgdGhlIGZpcmVCYXNlQXBwXHJcbiAgICAgICAgbGVnb0NhbnZhcyA9IG51bGwsIC8vIFRoZSBsZWdvR3JpZFxyXG4gICAgICAgIGN1cnJlbnRLZXkgPSBudWxsLCAvLyBUaGUgY3VyZW50IGZpcmViYXNlIGRyYXcga2V5XHJcbiAgICAgICAgY3VycmVudERyYXcgPSBudWxsLC8vIFRoZSBjdXJlbnQgZmlyZWJhc2UgZHJhd1xyXG4gICAgICAgIG1pbnV0ZXNFbHQgPSBudWxsLCAvLyBIdG1sIGVsZW1lbnQgZm9yIG1pbnV0ZXNcclxuICAgICAgICBzZWNvbmRzRWx0ID0gbnVsbCwgLy8gSHRtbCBlbGVtZW50IGZvciBzZWNvbmRzXHJcbiAgICAgICAgY291bnREb3duUGFyZW50RWx0ID0gbnVsbCwgLy8gSHRtbCBlbGVtZW50IHBhcmVudCBvZiBtaW51dGVzIGFuZCBzZWNvbmRzXHJcbiAgICAgICAgbGFzdExlZnQgPSBmYWxzZSwgLy8gVHJ1ZSBpZiB0aGUgbGFzdCBwaG90byB3YXMgcGxhY2VkIGF0IHRoZSBsZWZ0IG9mIHRoZSBjb3VudERvd25cclxuICAgICAgICB0YXJnZXREYXRlID0gbW9tZW50KCcyMDE2LTExLTA5LCAwOTowMDowMDowMDAnLCBcIllZWVktTU0tREQsIEhIOm1tOnNzOlNTU1wiKSwgLy8gVGhlIHRpbWVvdXQgZGF0ZVxyXG4gICAgICAgIHJlYWR5Rm9yTmV3RHJhdyA9IHRydWUsXHJcbiAgICAgICAgYXVkaW9QbGF5ZXIgPSBudWxsLFxyXG4gICAgICAgIGVuZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0R2FtZSgpIHtcclxuXHJcbiAgICAgICAgbGVnb0NhbnZhcyA9IG5ldyBMZWdvR3JpZENhbnZhcygnY2FudmFzRHJhdycsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgZ2V0TmV4dERyYXcoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZSBhIHNuYXBzaG90IG9mIHRoZSBkcmF3IHdpdGggYSBmbGFzaCBlZmZlY3RcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTbmFwc2hvdCh1c2VyLCBkYXRhVXJsKSB7XHJcbiAgICAgICAgLy8gV2Ugc3RhcnQgb3VyIGZsYXNoIGVmZmVjdFxyXG4gICAgICAgIGxldCByZWN0Q2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhbnZhcy1jb250YWluZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBsZXQgZmxhc2hEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxhc2gtZWZmZWN0JylcclxuICAgICAgICBmbGFzaERpdi5zdHlsZS50b3AgPSAocmVjdENhbnZhcy50b3AgLSAyNTApICsgXCJweFwiO1xyXG4gICAgICAgIGZsYXNoRGl2LnN0eWxlLmxlZnQgPSAocmVjdENhbnZhcy5sZWZ0IC0gMjUwKSArIFwicHhcIjtcclxuICAgICAgICBmbGFzaERpdi5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xyXG4gICAgICAgIC8vV2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUgKDFzIG9mIG9wYWNpdHkgLjcgLT4gMCA9PiB+NTAwbXMgdG8gd2FpdClcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgLy8gV2UgY3JlYXRlIHRoZSBmaW5hbCBpbWFnZVxyXG4gICAgICAgICAgICAvLyBXZSBjcmVhdGUgYSBkaXYgdGhhdCB3ZSB3aWxsIGJlIGFuaW1hdGVcclxuICAgICAgICAgICAgZmxhc2hEaXYuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKTtcclxuICAgICAgICAgICAgbGV0IGltZ1BhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBkYXRhVXJsO1xyXG4gICAgICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZCgnaW1nLW9yaScpO1xyXG4gICAgICAgICAgICBpbWdQYXJlbnQuY2xhc3NMaXN0LmFkZCgnaW1nLW9yaS1wYXJlbnQnKTtcclxuICAgICAgICAgICAgaW1nUGFyZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRob3InLCB1c2VyKTtcclxuICAgICAgICAgICAgaW1nUGFyZW50LmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgIGltZ1BhcmVudC5jbGFzc0xpc3QuYWRkKCdiaWcnKTtcclxuICAgICAgICAgICAgLy8gSW5pdGlhbCBQb3NpdGlvblxyXG4gICAgICAgICAgICBpbWdQYXJlbnQuc3R5bGUudG9wID0gKHJlY3RDYW52YXMudG9wIC0gNDUpICsgXCJweFwiO1xyXG4gICAgICAgICAgICBpbWdQYXJlbnQuc3R5bGUubGVmdCA9IChyZWN0Q2FudmFzLmxlZnQgLSA0NSkgKyBcInB4XCI7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGltZ1BhcmVudCk7XHJcblxyXG4gICAgICAgICAgICAvLyB3ZSB3YWl0IGEgbGl0bGUgdG8gc2V0IG5ldyBwb3NpdGlvbiB0byB0aGUgbmV3IGRpdi4gVGhlIGNzcyBhbmltYXRpb24gd2lsbCBkbyB0aGUgcmVzdCBvZiB0aGUgam9iXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBob3Jpem9udGFsRGlzdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMwMCkgKyAxO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodFNjcmVlbiA9IGRvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgbGV0IHZlcnRpY2FsRGlzdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChoZWlnaHRTY3JlZW4gLSAxMDAgLSAzMDApKSArIDE7XHJcbiAgICAgICAgICAgICAgICBsZXQgYW5nbGVDaG9pY2UgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzKSArIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1nUGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2JpZycpO1xyXG4gICAgICAgICAgICAgICAgaW1nUGFyZW50LnN0eWxlLnRvcCA9IGBjYWxjKDEwMHB4ICsgJHt2ZXJ0aWNhbERpc3R9cHgpYDtcclxuICAgICAgICAgICAgICAgIGltZ1BhcmVudC5zdHlsZS5sZWZ0ID0gYCR7aG9yaXpvbnRhbERpc3R9cHhgO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsYXN0TGVmdCkgeyAvLyBUcnVlIGlmIHRoZSBsYXN0IHBob3RvIHdhcyBwbGFjZWQgYXQgdGhlIGxlZnQgb2YgdGhlIGNvdW50RG93blxyXG4gICAgICAgICAgICAgICAgICAgIGltZ1BhcmVudC5zdHlsZS5sZWZ0ID0gYGNhbGMoMTAwdncgLSAke2hvcml6b250YWxEaXN0fXB4IC0gMzAwcHgpYDsgICAgICAgICAgIC8vIFRoZSB0aW1lb3V0IGRhdGUgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0TGVmdCA9ICFsYXN0TGVmdDsgLy8gVHJ1ZSBpZiB0aGUgbGFzdCBwaG90byB3YXMgcGxhY2VkIGF0IHRoZSBsZWZ0IG9mIHRoZSBjb3VudERvd25cclxuICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IGFuZ2xlQ2hvaWNlID09PSAxID8gLTkgOiBhbmdsZUNob2ljZSA9PT0gMiA/IDE0IDogMDsgLy8gVGhlIHRpbWVvdXQgZGF0ZVxyXG4gICAgICAgICAgICAgICAgaW1nUGFyZW50LnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYDtcclxuICAgICAgICAgICAgICAgIGdldE5leHREcmF3KCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBXaGVuIHRoZSBlbGVtZW50IGlzIGNyZWF0ZSwgd2UgY2xlYW4gdGhlIGJvYXJkXHJcbiAgICAgICAgICAgIGxlZ29DYW52YXMucmVzZXRCb2FyZCgpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvcG9zaXRpb24tdGV4dCcpLmlubmVySFRNTCA9IFwiRW4gYXR0ZW50ZSBkZSBwcm9wb3NpdGlvblwiO1xyXG5cclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcclxuXHJcbiAgICAgICAgYXVkaW9QbGF5ZXIgPSBuZXcgQXVkaW9QbGF5ZXIoKTtcclxuXHJcbiAgICAgICAgZmlyZUJhc2VMZWdvID0gbmV3IEZpcmVCYXNlTGVnb0FwcCgpLmFwcDtcclxuICAgICAgICBsZXQgZmlyZUJhc2VBdXRoID0gbmV3IEZpcmVCYXNlQXV0aCh7XHJcbiAgICAgICAgICAgIGlkRGl2TG9naW46ICdsb2dpbi1tc2cnLFxyXG4gICAgICAgICAgICBpZE5leHREaXY6ICdnYW1lJyxcclxuICAgICAgICAgICAgaWRMb2dvdXQ6ICdzaWdub3V0J1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBPbmx5IGFuIGF1dGhlbnRpY2F0ZSB1c2VyIGNhbiBzZWUgdGhlIHZhbGlkYXRlZCBkcmF3ICFcclxuICAgICAgICBmaXJlQmFzZUF1dGgub25BdXRoU3RhdGVDaGFuZ2VkKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWdhbWVJbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRHYW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKCdkcmF3VmFsaWRhdGVkJykub24oJ2NoaWxkX2FkZGVkJywgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHJlYWR5Rm9yTmV3RHJhdykge1xyXG4gICAgICAgICAgICAgICAgZ2V0TmV4dERyYXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBtaW51dGVzRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pbnV0ZXMnKTtcclxuICAgICAgICBzZWNvbmRzRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlY29uZHMnKTtcclxuICAgICAgICBjb3VudERvd25QYXJlbnRFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY291bnQtZG93bi10ZXh0Jyk7XHJcblxyXG4gICAgICAgIC8vIFRvIHJlbW92ZSBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIHRhcmdldCBkYXRlIGRlZmluZSBhdCB0aGUgdG9wIG9mIHRoZSBjbGFzc1xyXG4gICAgICAgIHRhcmdldERhdGUgPSBtb21lbnQoKTtcclxuICAgICAgICB0YXJnZXREYXRlLmFkZCgzMCwgJ21pbnV0ZXMnKTtcclxuICAgICAgICAvL3RhcmdldERhdGUuYWRkKDUsICdzZWNvbmRzJyk7XHJcbiAgICAgICAgLy8gV2Ugc3RhcnQgb3VyIHRleHQgYW5pbWF0aW9uXHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjaGVja1RpbWUpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuaW1hdGUgdGhlIHRleHQgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHRpbWVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2hlY2tUaW1lKCkge1xyXG5cclxuICAgICAgICBpZiAobW9tZW50KCkuaXNBZnRlcih0YXJnZXREYXRlKSkge1xyXG4gICAgICAgICAgICBlbmRTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZW5kQ291bnREb3duKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGRpZmYgPSB0YXJnZXREYXRlLmRpZmYobW9tZW50KCkpO1xyXG4gICAgICAgICAgICBtaW51dGVzRWx0LmlubmVySFRNTCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChcImZyXCIsIHsgbWluaW11bUludGVnZXJEaWdpdHM6IDIsIHVzZUdyb3VwaW5nOiBmYWxzZSB9KVxyXG4gICAgICAgICAgICAgICAgLmZvcm1hdChNYXRoLmZsb29yKGRpZmYgLyAoNjAgKiAxMDAwKSkpO1xyXG4gICAgICAgICAgICBzZWNvbmRzRWx0LmlubmVySFRNTCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChcImZyXCIsIHsgbWluaW11bUludGVnZXJEaWdpdHM6IDIsIHVzZUdyb3VwaW5nOiBmYWxzZSB9KVxyXG4gICAgICAgICAgICAgICAgLmZvcm1hdChNYXRoLmZsb29yKGRpZmYgJSAoNjAgKiAxMDAwKSAvIDEwMDApKTtcclxuICAgICAgICAgICAgYXVkaW9QbGF5ZXIubWFuYWdlU291bmRWb2x1bWUoZGlmZik7XHJcbiAgICAgICAgICAgIGlmIChkaWZmIDwgNjAgKiAxMDAwKXtcclxuICAgICAgICAgICAgICAgIGNvdW50RG93blBhcmVudEVsdC5jbGFzc0xpc3QuYWRkKCdsYXN0LW1pbnV0ZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrVGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIG5leHQgZHJhd1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXROZXh0RHJhdygpIHtcclxuICAgICAgICBpZiAoZW5kU2hvdyl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVhZHlGb3JOZXdEcmF3ID0gZmFsc2U7XHJcbiAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKCdkcmF3VmFsaWRhdGVkJykub25jZSgndmFsdWUnLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcclxuICAgICAgICAgICAgaWYgKHNuYXBzaG90ICYmIHNuYXBzaG90LnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCB3ZSBnZXQgdGhlIGRyYXdcclxuICAgICAgICAgICAgICAgIGN1cnJlbnREcmF3ID0gc25hcHNob3Q7XHJcbiAgICAgICAgICAgICAgICBsZXQgc25hcHNob3RGYiA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhzbmFwc2hvdEZiKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzWzBdO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudERyYXcgPSBzbmFwc2hvdEZiW2tleXNbMF1dO1xyXG4gICAgICAgICAgICAgICAgbGVnb0NhbnZhcy5kcmF3SW5zdHJ1Y3Rpb25zKGN1cnJlbnREcmF3KTtcclxuXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvcG9zaXRpb24tdGV4dCcpLmlubmVySFRNTCA9IGBQcm9wb3NpdGlvbiBkZSAke2N1cnJlbnREcmF3LnVzZXJ9YDtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFmdGVyIHdlIHVwZGF0ZSB0aGUgZHJhd1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhVXJsID0gbGVnb0NhbnZhcy5zbmFwc2hvdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnREcmF3LmRhdGFVcmwgPSBkYXRhVXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnREcmF3LmFjY2VwdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBjbGVhbiB0aGUgZHJhdyBiZWZvcmUgdG8gc2F2ZSBpdFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjdXJyZW50RHJhdy5pbnN0cnVjdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKGAvZHJhd1NhdmVkLyR7Y3VycmVudERyYXcudXNlcklkfWApLnB1c2goY3VycmVudERyYXcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjdXJyZW50RHJhdy51c2VySWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZUJhc2VMZWdvLmRhdGFiYXNlKCkucmVmKGBkcmF3VmFsaWRhdGVkLyR7Y3VycmVudEtleX1gKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBmaXJlQmFzZUxlZ28uZGF0YWJhc2UoKS5yZWYoXCIvZHJhd1Nob3dcIikucHVzaChjdXJyZW50RHJhdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgZmluYWx5IGdlbmVyYXRlIHRoZSBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlU25hcHNob3QoY3VycmVudERyYXcudXNlciwgbGVnb0NhbnZhcy5zbmFwc2hvdCgpKVxyXG4gICAgICAgICAgICAgICAgfSwgMjAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWFkeUZvck5ld0RyYXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb3Bvc2l0aW9uLXRleHQnKS5pbm5lckhUTUwgPSBcIkVuIGF0dGVudGUgZGUgcHJvcG9zaXRpb25cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgLy8gZXJyb3IgY2FsbGJhY2sgdHJpZ2dlcmVkIHdpdGggUEVSTUlTU0lPTl9ERU5JRURcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gZW5kQ291bnREb3duKCl7XHJcbiAgICAgICAgY29uc3Qgb3BhY2l0eUVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcGFjaXR5Jyk7XHJcbiAgICAgICAgb3BhY2l0eUVsdC5jbGFzc0xpc3QuYWRkKCdibGFjaycpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9Pm5ldyBWaWRlb1BsYXllcihvcGFjaXR5RWx0LCAoKT0+Y29uc29sZS5sb2coJ2VuZCcpKS5wbGF5VmlkZW8oKSwgNDAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xyXG59KSgpOyIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge1BMQVlMSVNUfSBmcm9tICcuL3BsYXlsaXN0LmpzJztcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGxheWluZyBtdXNpY1xyXG4gKiBcclxuICogV2UgY3JlYXRlIGFuIGluc2libGUgYXVkaW8gZWxlbWVudCBhbmQgd2UgcGxheSBtdXNpYyBvbiBpdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEF1ZGlvUGxheWVye1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmluZGV4UGxheUxpc3QgPSAwO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xyXG4gICAgICAgIHRoaXMuYXVkaW9FbHQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYXVkaW9FbHQpO1xyXG4gICAgICAgIHRoaXMuX25leHRTb25nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQbGF5IGEgc29uZyBhY2NvcmRpbmcgdG8gdGhlIHVybCBvZiBzb25nXHJcbiAgICAgKi9cclxuICAgIF9wbGF5U291bmQodXJsKXtcclxuICAgICAgICB0aGlzLmF1ZGlvRWx0LnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsdC5zcmMgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsdC5wbGF5KCk7XHJcbiAgICAgICAgdGhpcy5hdWRpb0VsdC5vbmVuZGVkID0gdGhpcy5fbmV4dFNvbmcuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNraXAgdG8gdGhlIG5leHQgc29uZ1xyXG4gICAgICovXHJcbiAgICBfbmV4dFNvbmcoKXtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXlTb3VuZChgLi9hc3NldHMvYXVkaW8vJHtQTEFZTElTVFt0aGlzLmluZGV4UGxheUxpc3RdfWApO1xyXG4gICAgICAgICAgICB0aGlzLmluZGV4UGxheUxpc3QgPSAodGhpcy5pbmRleFBsYXlMaXN0ICsgMSkgJSBQTEFZTElTVC5sZW5ndGg7XHJcbiAgICAgICAgfWNhdGNoKGVycil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIHNvdW5kIHZvbHVtZSBvZiBhdWRpbyBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIG1hbmFnZVNvdW5kVm9sdW1lKGRlbHRhKXtcclxuICAgICAgICBpZiAoZGVsdGEgPCAxMCAqIDEwMDApe1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvRWx0LnZvbHVtZSA9IE1hdGgubWluKE1hdGgubWF4KDAsZGVsdGEgLyAoMTAgKiAxMDAwKSksMC41KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY29uc3QgUExBWUxJU1QgPSBbXHJcbiAgICAnJyAgICBcclxuXTsiLCIndXNlIHN0cmljdCdcclxuaW1wb3J0IHtQZWd9IGZyb20gJy4uL2xlZ29fc2hhcGUvcGVnLmpzJztcclxuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4uL2xlZ29fc2hhcGUvY2lyY2xlLmpzJztcclxuaW1wb3J0IHtOQl9DRUxMUywgSEVBREVSX0hFSUdIVCwgQkFTRV9MRUdPX0NPTE9SLCBCQUNLR1JPVU5EX0xFR09fQ09MT1J9IGZyb20gJy4uL2NvbW1vbi9jb25zdC5qcyc7XHJcbmltcG9ydCB7bGVnb0Jhc2VDb2xvcn0gZnJvbSAnLi4vY29tbW9uL2xlZ29Db2xvcnMuanMnO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBDbGFzcyBmb3IgQ2FudmFzIEdyaWRcclxuICogXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTGVnb0dyaWRDYW52YXMge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIHNob3dSb3cpIHtcclxuICAgICAgICAvLyBCYXNpYyBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhc0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAvLyBTaXplIG9mIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuY2FudmFzUmVjdCA9IHRoaXMuY2FudmFzRWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIC8vIEluZGljYXRvciBmb3Igc2hvd2luZyB0aGUgZmlyc3Qgcm93IHdpdGggcGVnc1xyXG4gICAgICAgIHRoaXMuc2hvd1JvdyA9IHNob3dSb3c7XHJcbiAgICAgICAgdGhpcy5jYW52YXNFbHQud2lkdGggPSB0aGlzLmNhbnZhc1JlY3Qud2lkdGg7XHJcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHNob3dSb3csIHdlIHdpbGwgc2hvdyBtb2RpZnkgdGhlIGhlYWRlciBIZWlnaHRcclxuICAgICAgICB0aGlzLmhlYWRlckhlaWdodCA9IHRoaXMuc2hvd1JvdyA/IEhFQURFUl9IRUlHSFQgOiAwO1xyXG4gICAgICAgIHRoaXMuY2FudmFzRWx0LmhlaWdodCA9IHRoaXMuY2FudmFzUmVjdC53aWR0aCArIHRoaXMuaGVhZGVySGVpZ2h0O1xyXG4gICAgICAgIC8vIFdlIGNhbGN1bGF0ZSB0aGUgY2VsbHNpemUgYWNjb3JkaW5nIHRvIHRoZSBzcGFjZSB0YWtlbiBieSB0aGUgY2FudmFzXHJcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IE1hdGgucm91bmQodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gTkJfQ0VMTFMpO1xyXG5cclxuICAgICAgICAvLyBXZSBpbml0aWFsaXplIHRoZSBGYWJyaWMgSlMgbGlicmFyeSB3aXRoIG91ciBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKGlkLCB7IHNlbGVjdGlvbjogZmFsc2UgfSk7XHJcbiAgICAgICAgLy8gT2JqZWN0IHRoYXQgcmVwcmVzZW50IHRoZSBwZWdzIG9uIHRoZSBmaXJzdCByb3dcclxuICAgICAgICB0aGlzLnJvd1NlbGVjdCA9IHt9O1xyXG4gICAgICAgIC8vIFRoZSBjdXJyZW50IGRyYXcgbW9kZWwgKGluc3RydWN0aW9ucywgLi4uKVxyXG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9LFxyXG4gICAgICAgIC8vIEZsYWcgdG8gZGV0ZXJtaW5lIGlmIHdlIGhhdmUgdG8gY3JlYXRlIGEgbmV3IGJyaWNrXHJcbiAgICAgICAgdGhpcy5jcmVhdGVOZXdCcmljayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJyaWNrID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxhc3RDb2xvciA9IEJBU0VfTEVHT19DT0xPUjtcclxuXHJcbiAgICAgICAgLy8gV2UgY3JlYXRlIHRoZSBjYW52YXNcclxuICAgICAgICB0aGlzLl9kcmF3Q2FudmFzKCk7XHJcblxyXG4gICAgICAgIC8vIElmIHdlIHNob3cgdGhlIHJvdywgd2UgaGF2ZSB0byBwbHVnIHRoZSBtb3ZlIG1hbmFnZW1lbnRcclxuICAgICAgICBpZiAoc2hvd1Jvdykge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ29iamVjdDpzZWxlY3RlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZyA/IG9wdGlvbnMudGFyZ2V0IDogbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLm9uKCdzZWxlY3Rpb246Y2xlYXJlZCcsIChvcHRpb25zKSA9PiB0aGlzLmN1cnJlbnRCcmljayA9IG51bGwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ29iamVjdDptb3ZpbmcnLCAob3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBlZyA9IG9wdGlvbnMudGFyZ2V0LnBhcmVudFBlZztcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0xlZnQgPSBNYXRoLnJvdW5kKG9wdGlvbnMudGFyZ2V0LmxlZnQgLyB0aGlzLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemU7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3VG9wID0gTWF0aC5yb3VuZCgob3B0aW9ucy50YXJnZXQudG9wIC0gdGhpcy5oZWFkZXJIZWlnaHQpIC8gdGhpcy5jZWxsU2l6ZSkgKiB0aGlzLmNlbGxTaXplICsgdGhpcy5oZWFkZXJIZWlnaHQ7ICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGUgdG9wXHJcbiAgICAgICAgICAgICAgICBsZXQgdG9wQ29tcHV0ZSA9IG5ld1RvcCArIChwZWcuc2l6ZS5yb3cgPT09IDIgfHwgcGVnLmFuZ2xlID4gMCA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGVmdENvbXB1dGUgPSBuZXdMZWZ0ICsgKHBlZy5zaXplLmNvbCA9PT0gMiA/IHRoaXMuY2VsbFNpemUgKiAyIDogdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBwZWcubW92ZShcclxuICAgICAgICAgICAgICAgICAgICBuZXdMZWZ0LCAvL2xlZnRcclxuICAgICAgICAgICAgICAgICAgICBuZXdUb3AgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdlIHNwZWNpZnkgdGhhdCB3ZSBjb3VsZCByZW1vdmUgYSBwZWcgaWYgb25lIG9mIGl0J3MgZWRnZSB0b3VjaCB0aGUgb3V0c2lkZSBvZiB0aGUgY2FudmFzXHJcbiAgICAgICAgICAgICAgICBpZiAobmV3VG9wIDwgSEVBREVSX0hFSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgIHx8IG5ld0xlZnQgPCAwXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgdG9wQ29tcHV0ZSA+PSB0aGlzLmNhbnZhc0VsdC5oZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICB8fCBsZWZ0Q29tcHV0ZSA+PSB0aGlzLmNhbnZhc0VsdC53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVsc2Ugd2UgY2hlY2sgd2UgY3JlYXRlIGEgbmV3IHBlZyAod2hlbiBhIHBlZyBlbnRlciBpbiB0aGUgZHJhdyBhcmVhKVxyXG4gICAgICAgICAgICAgICAgICAgIHBlZy50b1JlbW92ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGVnLnJlcGxhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLmNvbCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlZy5zaXplLnJvdyA9PT0gMil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVNxdWFyZSgyKS5jYW52YXNFbHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKHBlZy5hbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkKHRoaXMuX2NyZWF0ZVJlY3QoMSkuY2FudmFzRWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZCh0aGlzLl9jcmVhdGVSZWN0KDEsOTApLmNhbnZhc0VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5fY3JlYXRlU3F1YXJlKDEpLmNhbnZhc0VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVnLnJlcGxhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMub24oJ21vdXNlOnVwJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEJyaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnRvUmVtb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5jdXJyZW50QnJpY2sucGFyZW50UGVnLnJlcGxhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5icmlja01vZGVsW3RoaXMuY3VycmVudEJyaWNrLnBhcmVudFBlZy5pZF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlKHRoaXMuY3VycmVudEJyaWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCcmljayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNZXRob2QgZm9yIGNoYW5naW5nIHRoZSBjb2xvciBvZiB0aGUgZmlyc3Qgcm93IFxyXG4gICAgICovXHJcbiAgICBjaGFuZ2VDb2xvcihjb2xvcikge1xyXG4gICAgICAgIHRoaXMubGFzdENvbG9yID0gY29sb3I7ICAgICAgIFxyXG4gICAgICAgIHRoaXMucm93U2VsZWN0LnNxdWFyZS5jaGFuZ2VDb2xvcihjb2xvcik7XHJcbiAgICAgICAgdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlLmNoYW5nZUNvbG9yKGNvbG9yKTtcclxuICAgICAgICB0aGlzLnJvd1NlbGVjdC5yZWN0LmNoYW5nZUNvbG9yKGNvbG9yKTtcclxuICAgICAgICB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdC5jaGFuZ2VDb2xvcihjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXJpYWxpemUgdGhlIGNhbnZhcyB0byBhIG1pbmltYWwgb2JqZWN0IHRoYXQgY291bGQgYmUgdHJlYXQgYWZ0ZXJcclxuICAgICAqL1xyXG4gICAgZXhwb3J0KHVzZXJOYW1lLCB1c2VySWQpIHtcclxuICAgICAgICBsZXQgcmVzdWx0QXJyYXkgPSBbXTtcclxuICAgICAgICAvLyBXZSBmaWx0ZXIgdGhlIHJvdyBwZWdzXHJcbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmJyaWNrTW9kZWwpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGtleSk9PmtleSAhPSB0aGlzLnJvd1NlbGVjdC5zcXVhcmUuaWRcclxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC5iaWdTcXVhcmUuaWRcclxuICAgICAgICAgICAgICAgICYmIGtleSAhPSB0aGlzLnJvd1NlbGVjdC5yZWN0LmlkXHJcbiAgICAgICAgICAgICAgICAmJiBrZXkgIT0gdGhpcy5yb3dTZWxlY3QudmVydFJlY3QuaWQpO1xyXG4gICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwZWdUbXAgPSB0aGlzLmJyaWNrTW9kZWxba2V5XTtcclxuICAgICAgICAgICAgcmVzdWx0QXJyYXkucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBzaXplOiBwZWdUbXAuc2l6ZSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBwZWdUbXAuY29sb3IsXHJcbiAgICAgICAgICAgICAgICBhbmdsZTogcGVnVG1wLmFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgdG9wOiBwZWdUbXAudG9wIC0gdGhpcy5oZWFkZXJIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBwZWdUbXAubGVmdCxcclxuICAgICAgICAgICAgICAgIGNlbGxTaXplIDogdGhpcy5jZWxsU2l6ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB1c2VyOiB1c2VyTmFtZSxcclxuICAgICAgICAgICAgdXNlcklkIDogdXNlcklkLFxyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnM6IHJlc3VsdEFycmF5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERyYXcgZnJvbSBpbnRydWN0aW9ucyBhIGRyYXdcclxuICAgICAqL1xyXG4gICAgZHJhd0luc3RydWN0aW9ucyhpbnN0cnVjdGlvbk9iamVjdCl7XHJcbiAgICAgICAgdGhpcy5yZXNldEJvYXJkKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSBmYWxzZTtcclxuICAgICAgICBpbnN0cnVjdGlvbk9iamVjdC5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdHJ1Y3Rpb24pPT57XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZChcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUJyaWNrKHsgc2l6ZSA6IGluc3RydWN0aW9uLnNpemUsIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgOiAoaW5zdHJ1Y3Rpb24ubGVmdCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKGluc3RydWN0aW9uLnRvcCAvIGluc3RydWN0aW9uLmNlbGxTaXplKSAqIHRoaXMuY2VsbFNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGUgOiBpbnN0cnVjdGlvbi5hbmdsZSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA6IGluc3RydWN0aW9uLmNvbG9yXHJcbiAgICAgICAgICAgICAgICB9KS5jYW52YXNFbHRcclxuICAgICAgICAgICAgICAgICk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlckFsbCgpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbmRlck9uQWRkUmVtb3ZlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFuIHRoZSBib2FyZCBhbmQgdGhlIHN0YXRlIG9mIHRoZSBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcmVzZXRCb2FyZCgpe1xyXG4gICAgICAgIHRoaXMuYnJpY2tNb2RlbCA9IHt9O1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5fZHJhd0NhbnZhcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIEdlbmVyYXRlIGEgQmFzZTY0IGltYWdlIGZyb20gdGhlIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBzbmFwc2hvdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogUHJpdmF0ZXMgTWV0aG9kc1xyXG4gICAgICogXHJcbiAgICAgKi9cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEcmF3IHRoZSBiYXNpYyBncmlkIFxyXG4gICAgKi9cclxuICAgIF9kcmF3R3JpZChzaXplKSB7ICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLnNob3dSb3cpe1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVTcXVhcmUoMSkuY2FudmFzRWx0XHJcbiAgICAgICAgICAgICAgICAsIHRoaXMuX2NyZWF0ZVNxdWFyZSgyKS5jYW52YXNFbHRcclxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlUmVjdCgxKS5jYW52YXNFbHRcclxuICAgICAgICAgICAgICAgICwgdGhpcy5fY3JlYXRlUmVjdCgxLDkwKS5jYW52YXNFbHRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEcmF3IGFsbCB0aGUgd2hpdGUgcGVnIG9mIHRoZSBncmlkXHJcbiAgICAgKi9cclxuICAgIF9kcmF3V2hpdGVQZWcoc2l6ZSl7XHJcbiAgICAgICAgLy8gV2Ugc3RvcCByZW5kZXJpbmcgb24gZWFjaCBhZGQsIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzXHJcbiAgICAgICAgLy90aGlzLmNhbnZhcy5yZW5kZXJPbkFkZFJlbW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBtYXggPSBNYXRoLnJvdW5kKHNpemUgLyB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICBsZXQgbWF4U2l6ZSA9IG1heCAqIHRoaXMuY2VsbFNpemU7XHJcbiAgICAgICAgZm9yICh2YXIgcm93ID0wOyByb3cgPCBtYXg7IHJvdysrKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbWF4OyBjb2wrKyApe1xyXG4gICAgICAgICAgICAgICAgIGxldCBzcXVhcmVUbXAgPSBuZXcgZmFicmljLlJlY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBCQUNLR1JPVU5EX0xFR09fQ09MT1IsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyZWRSb3RhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNpcmNsZSA9IG5ldyBDaXJjbGUodGhpcy5jZWxsU2l6ZSwgQkFDS0dST1VORF9MRUdPX0NPTE9SKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZS5jYW52YXNFbHQuc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBUbXAgPSBuZXcgZmFicmljLkdyb3VwKFtzcXVhcmVUbXAsIGNpcmNsZS5jYW52YXNFbHRdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5jZWxsU2l6ZSAqIGNvbCxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuY2VsbFNpemUgKiByb3cgKyB0aGlzLmhlYWRlckhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogMCxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2tTY2FsaW5nWCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9ja1NjYWxpbmdZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRYIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NrTW92ZW1lbnRZIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhc0JvcmRlcnMgOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGQoZ3JvdXBUbXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVuZGVyT25BZGRSZW1vdmUgPSB0cnVlO1xyXG4gICAgICAgIC8vIFdlIHRyYW5zZm9ybSB0aGUgY2FudmFzIHRvIGEgYmFzZTY0IGltYWdlIGluIG9yZGVyIHRvIHNhdmUgcGVyZm9ybWFuY2VzLlxyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5jbGVhcigpOyAgICAgXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QmFja2dyb3VuZEltYWdlKHVybCx0aGlzLmNhbnZhcy5yZW5kZXJBbGwuYmluZCh0aGlzLmNhbnZhcyksIHtcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2xlZnQnLFxyXG4gICAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgfSk7ICAgKi9cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGhvcml6b250YWwgb3IgdmVydGljYWwgcmVjdGFuZ2xlXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVSZWN0KHNpemVSZWN0LCBhbmdsZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XHJcbiAgICAgICAgICAgICAgICBzaXplIDoge2NvbCA6IDIgKiBzaXplUmVjdCwgcm93IDoxICogc2l6ZVJlY3R9LCBcclxuICAgICAgICAgICAgICAgIGxlZnQgOiBhbmdsZSA/ICgodGhpcy5jYW52YXNSZWN0LndpZHRoIC8gNCkgLSB0aGlzLmNlbGxTaXplKSA6ICgodGhpcy5jYW52YXNSZWN0LndpZHRoICogMyAvIDQpIC0gKHRoaXMuY2VsbFNpemUgKiAxLjUpKSxcclxuICAgICAgICAgICAgICAgIHRvcCA6IGFuZ2xlID8gMSA6IDAsXHJcbiAgICAgICAgICAgICAgICBhbmdsZSA6IGFuZ2xlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgc3F1YXJlICgxeDEpIG9yICgyeDIpXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVTcXVhcmUoc2l6ZVNxdWFyZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVCcmljayh7XHJcbiAgICAgICAgICAgICAgICBzaXplIDoge2NvbCA6IDEgKiBzaXplU3F1YXJlLCByb3cgOjEgKiBzaXplU3F1YXJlfSwgXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBzaXplU3F1YXJlID09PSAyID8gKCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyAyKSAtICgyICogdGhpcy5jZWxsU2l6ZSkpIDogKHRoaXMuY2FudmFzUmVjdC53aWR0aCAtICh0aGlzLmNlbGxTaXplICogMS41KSksXHJcbiAgICAgICAgICAgICAgICB0b3AgOiBzaXplU3F1YXJlID09PSAyID8gMSA6IDAsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJpYyBtZXRob2QgdGhhdCBjcmVhdGUgYSBwZWdcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZUJyaWNrKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zLmNlbGxTaXplID0gdGhpcy5jZWxsU2l6ZTtcclxuICAgICAgICBvcHRpb25zLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCB0aGlzLmxhc3RDb2xvcjtcclxuICAgICAgICBsZXQgcGVnID0gbmV3IFBlZyhvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmJyaWNrTW9kZWxbcGVnLmlkXSA9IHBlZztcclxuICAgICAgICAvLyBXZSBoYXZlIHRvIHVwZGF0ZSB0aGUgcm93U2VsZWN0IE9iamVjdCB0byBiZSBhbHN3YXkgdXBkYXRlXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZS5yb3cgPT09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QuYmlnU3F1YXJlID0gcGVnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbmdsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC52ZXJ0UmVjdCA9IHBlZztcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuc2l6ZS5jb2wgPT09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3QucmVjdCA9IHBlZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1NlbGVjdC5zcXVhcmUgPSBwZWc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwZWc7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdCB0aGUgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIF9kcmF3Q2FudmFzKCkge1xyXG4gICAgICAgIHRoaXMuX2RyYXdXaGl0ZVBlZyh0aGlzLmNhbnZhc1JlY3Qud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuX2RyYXdHcmlkKHRoaXMuY2FudmFzUmVjdC53aWR0aCwgTWF0aC5yb3VuZCh0aGlzLmNhbnZhc1JlY3Qud2lkdGggLyBOQl9DRUxMUykpO1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG4vLyBOdW1iZXIgb2YgY2VsbCBvbiB0aGUgZ3JpZFxyXG5leHBvcnQgY29uc3QgTkJfQ0VMTFMgPSAxNTtcclxuXHJcbi8vIEhlaWdodCBvZiB0aGUgaGVhZGVyXHJcbmV4cG9ydCBjb25zdCBIRUFERVJfSEVJR0hUID0gd2luZG93LnNjcmVlbi53aWR0aCA8PSA3NjggID8gNjAgOiAxMDA7XHJcblxyXG4vLyBGaXJzdCBjb2xvciB0byB1c2VcclxuZXhwb3J0IGNvbnN0IEJBU0VfTEVHT19DT0xPUiA9IFwiIzBkNjlmMlwiO1xyXG5cclxuLy8gTWVkaXVtIFN0b25lIEdyZXkgXHJcbmNvbnN0IENPTE9SXzE5NCA9IFwiI2EzYTJhNFwiO1xyXG5cclxuLy8gTGlnaHQgU3RvbmUgR3JleVxyXG5jb25zdCBDT0xPUl8yMDggPSBcIiNlNWU0ZGVcIjsgXHJcblxyXG4vLyBCYWNrZ3JvdW5kIGNvbG9yIHVzZWRcclxuZXhwb3J0IGNvbnN0IEJBQ0tHUk9VTkRfTEVHT19DT0xPUiA9IENPTE9SXzIwODsiLCIndXNlIHN0cmljdCdcclxuXHJcbi8qXHJcbiogQ29sb3JzIGZyb20gXHJcbiogaHR0cDovL2xlZ28ud2lraWEuY29tL3dpa2kvQ29sb3VyX1BhbGV0dGUgXHJcbiogQW5kIGh0dHA6Ly93d3cucGVlcm9uLmNvbS9jZ2ktYmluL2ludmNnaXMvY29sb3JndWlkZS5jZ2lcclxuKiBPbmx5IFNob3cgdGhlIGNvbG9yIHVzZSBzaW5jZSAyMDEwXHJcbioqLyBcclxuZXhwb3J0IGNvbnN0IExFR09fQ09MT1JTID0gW1xyXG4gICAgJ3JnYigyNDUsIDIwNSwgNDcpJywgLy8yNCwgQnJpZ2h0IFllbGxvdyAqXHJcbiAgICAncmdiKDI1MywgMjM0LCAxNDApJywgLy8yMjYsIENvb2wgWWVsbG93ICpcclxuICAgICdyZ2IoMjE4LCAxMzMsIDY0KScsIC8vMTA2LCBCcmlnaHQgT3JhbmdlICpcclxuICAgICdyZ2IoMjMyLCAxNzEsIDQ1KScsIC8vMTkxLCBGbGFtZSBZZWxsb3dpc2ggT3JhbmdlICpcclxuICAgICdyZ2IoMTk2LCA0MCwgMjcpJywgLy8yMSwgQnJpZ2h0IFJlZCAqXHJcbiAgICAncmdiKDEyMywgNDYsIDQ3KScsIC8vMTU0LCBEYXJrIFJlZCAqXHJcbiAgICAncmdiKDIwNSwgOTgsIDE1MiknLCAvLzIyMSwgQnJpZ2h0IFB1cnBsZSAqXHJcbiAgICAncmdiKDIyOCwgMTczLCAyMDApJywgLy8yMjIsIExpZ2h0IFB1cnBsZSAqXHJcbiAgICAncmdiKDE0NiwgNTcsIDEyMCknLCAvLzEyNCwgQnJpZ2h0IFJlZGRpc2ggVmlvbGV0ICpcclxuICAgICdyZ2IoNTIsIDQzLCAxMTcpJywgLy8yNjgsIE1lZGl1bSBMaWxhYyAqXHJcbiAgICAncmdiKDEzLCAxMDUsIDI0MiknLCAvLzIzLCBCcmlnaHQgQmx1ZSAqXHJcbiAgICAncmdiKDE1OSwgMTk1LCAyMzMpJywgLy8yMTIsIExpZ2h0IFJveWFsIEJsdWUgKlxyXG4gICAgJ3JnYigxMTAsIDE1MywgMjAxKScsIC8vMTAyLCBNZWRpdW0gQmx1ZSAqXHJcbiAgICAncmdiKDMyLCA1OCwgODYpJywgLy8xNDAsIEVhcnRoIEJsdWUgKlxyXG4gICAgJ3JnYigxMTYsIDEzNCwgMTU2KScsIC8vMTM1LCBTYW5kIEJsdWUgKlxyXG4gICAgJ3JnYig0MCwgMTI3LCA3MCknLCAvLzI4LCBEYXJrIEdyZWVuICpcclxuICAgICdyZ2IoNzUsIDE1MSwgNzQpJywgLy8zNywgQmlyZ2h0IEdyZWVuICpcclxuICAgICdyZ2IoMTIwLCAxNDQsIDEyOSknLCAvLzE1MSwgU2FuZCBHcmVlbiAqXHJcbiAgICAncmdiKDM5LCA3MCwgNDQpJywgLy8xNDEsIEVhcnRoIEdyZWVuICpcclxuICAgICdyZ2IoMTY0LCAxODksIDcwKScsIC8vMTE5LCBCcmlnaHQgWWVsbG93aXNoLUdyZWVuICogXHJcbiAgICAncmdiKDEwNSwgNjQsIDM5KScsIC8vMTkyLCBSZWRkaXNoIEJyb3duICpcclxuICAgICdyZ2IoMjE1LCAxOTcsIDE1MyknLCAvLzUsIEJyaWNrIFllbGxvdyAqIFxyXG4gICAgJ3JnYigxNDksIDEzOCwgMTE1KScsIC8vMTM4LCBTYW5kIFllbGxvdyAqXHJcbiAgICAncmdiKDE3MCwgMTI1LCA4NSknLCAvLzMxMiwgTWVkaXVtIE5vdWdhdCAqICAgIFxyXG4gICAgJ3JnYig0OCwgMTUsIDYpJywgLy8zMDgsIERhcmsgQnJvd24gKlxyXG4gICAgJ3JnYigyMDQsIDE0MiwgMTA0KScsIC8vMTgsIE5vdWdhdCAqXHJcbiAgICAncmdiKDI0NSwgMTkzLCAxMzcpJywgLy8yODMsIExpZ2h0IE5vdWdhdCAqXHJcbiAgICAncmdiKDE2MCwgOTUsIDUyKScsIC8vMzgsIERhcmsgT3JhbmdlICpcclxuICAgICdyZ2IoMjQyLCAyNDMsIDI0MiknLCAvLzEsIFdoaXRlICpcclxuICAgICdyZ2IoMjI5LCAyMjgsIDIyMiknLCAvLzIwOCwgTGlnaHQgU3RvbmUgR3JleSAqXHJcbiAgICAncmdiKDE2MywgMTYyLCAxNjQpJywgLy8xOTQsIE1lZGl1bSBTdG9uZSBHcmV5ICpcclxuICAgICdyZ2IoOTksIDk1LCA5NyknLCAvLzE5OSwgRGFyayBTdG9uZSBHcmV5ICpcclxuICAgICdyZ2IoMjcsIDQyLCA1MiknLCAvLzI2LCBCbGFjayAqICAgICAgICBcclxuXTsiLCIndXNlIHN0cmljdCdcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIGEgdmFyaWF0aW9uIG9mIGNvbG9yXHJcbiAqIFxyXG4gKiBGcm9tIDogaHR0cHM6Ly93d3cuc2l0ZXBvaW50LmNvbS9qYXZhc2NyaXB0LWdlbmVyYXRlLWxpZ2h0ZXItZGFya2VyLWNvbG9yL1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIENvbG9yTHVtaW5hbmNlKGhleCwgbHVtKSB7XHJcblxyXG4gICAgICAgIC8vIHZhbGlkYXRlIGhleCBzdHJpbmdcclxuICAgICAgICBoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcclxuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcclxuICAgICAgICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsdW0gPSBsdW0gfHwgMDtcclxuXHJcbiAgICAgICAgLy8gY29udmVydCB0byBkZWNpbWFsIGFuZCBjaGFuZ2UgbHVtaW5vc2l0eVxyXG4gICAgICAgIHZhciByZ2IgPSBcIiNcIiwgYywgaTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGMgPSBwYXJzZUludChoZXguc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICBjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICByZ2IgKz0gKFwiMDBcIiArIGMpLnN1YnN0cihjLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmdiO1xyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG4vKipcclxuICogQmFzaWMgRmlyZWJhc2UgaGVscGVyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmlyZUJhc2VMZWdvQXBwe1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAvLyBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbiwgWW91IHNob3VsZCB1cGRhdGUgd2l0aCB5b3VyIEtleXMgIVxyXG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5RHI5Ujg1dE5qZktXZGRXMS1ON1hKcEFoR3FYTkdhSjVrXCIsXHJcbiAgICAgICAgICAgIGF1dGhEb21haW46IFwibGVnb25uYXJ5LmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgICAgICAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL2xlZ29ubmFyeS5maXJlYmFzZWlvLmNvbVwiLFxyXG4gICAgICAgICAgICBzdG9yYWdlQnVja2V0OiBcIlwiLFxyXG4gICAgICAgIH0gXHJcblxyXG4gICAgICAgIHRoaXMuYXBwID0gZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcCh0aGlzLmNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIGdlbmVyaWMgbWFuYWdlbWVudCBvZiBBdXRoZW50aWNhdGlvbiB3aXRoIGZpcmViYXNlLlxyXG4gKiBcclxuICogSXQgdGFrZXMgY2FyZSBvZiBodG1sIHRvIGhpZGUgb3Igc2hvd1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpcmVCYXNlQXV0aHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyl7XHJcbiAgICAgIFxyXG4gICAgICAgIGxldCB1aUNvbmZpZyA9IHtcclxuICAgICAgICAgICAgJ2NhbGxiYWNrcyc6IHtcclxuICAgICAgICAgICAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBzaWduZWQgaW4uXHJcbiAgICAgICAgICAgICAgICAnc2lnbkluU3VjY2Vzcyc6IGZ1bmN0aW9uKHVzZXIsIGNyZWRlbnRpYWwsIHJlZGlyZWN0VXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90IHJlZGlyZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gT3BlbnMgSURQIFByb3ZpZGVycyBzaWduLWluIGZsb3cgaW4gYSBwb3B1cC5cclxuICAgICAgICAgICAgJ3NpZ25JbkZsb3cnOiAncG9wdXAnLFxyXG4gICAgICAgICAgICAnc2lnbkluT3B0aW9ucyc6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcclxuICAgICAgICAgICAgICAgIHNjb3BlczogWydodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3BsdXMubG9naW4nXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguRmFjZWJvb2tBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLlR3aXR0ZXJBdXRoUHJvdmlkZXIuUFJPVklERVJfSUQsXHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hdXRoLkdpdGh1YkF1dGhQcm92aWRlci5QUk9WSURFUl9JRCxcclxuICAgICAgICAgICAgICAgIGZpcmViYXNlLmF1dGguRW1haWxBdXRoUHJvdmlkZXIuUFJPVklERVJfSURcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gVGVybXMgb2Ygc2VydmljZSB1cmwuXHJcbiAgICAgICAgICAgICd0b3NVcmwnOiAnaHR0cHM6Ly9nZGduYW50ZXMuY29tJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51aSA9IG5ldyBmaXJlYmFzZXVpLmF1dGguQXV0aFVJKGZpcmViYXNlLmF1dGgoKSk7XHJcbiAgICAgICAgdGhpcy51aS5zdGFydCgnI2ZpcmViYXNldWktYXV0aC1jb250YWluZXInLCB1aUNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlkRGl2TG9naW4gPSBjb25maWcuaWREaXZMb2dpbjtcclxuICAgICAgICB0aGlzLmlkTmV4dERpdiA9IGNvbmZpZy5pZE5leHREaXY7XHJcbiAgICAgICAgdGhpcy5pZExvZ291dCA9IGNvbmZpZy5pZExvZ291dDtcclxuXHJcbiAgICAgICAgLy8gT3B0aW9uYWxzXHJcbiAgICAgICAgdGhpcy5pZEltZyA9IGNvbmZpZy5pZEltZyA/IGNvbmZpZy5pZEltZyA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5pZERpc3BsYXlOYW1lID0gY29uZmlnLmlkRGlzcGxheU5hbWUgPyBjb25maWcuaWREaXNwbGF5TmFtZSA6IG51bGw7XHJcblxyXG5cclxuICAgICAgICBmaXJlYmFzZS5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKHRoaXMuX2NoZWNrQ2FsbEJhY2tDb250ZXh0LmJpbmQodGhpcyksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tDYWxsQmFja0Vycm9yQ29udGV4dC5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmNiQXV0aENoYW5nZWQgPSBudWxsO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTG9nb3V0KS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT4gIGZpcmViYXNlLmF1dGgoKS5zaWduT3V0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW4gY2FzZSBvZiBlcnJvclxyXG4gICAgICovXHJcbiAgICBfY2hlY2tDYWxsQmFja0Vycm9yQ29udGV4dChlcnJvcil7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsYmFjayBtZXRob2Qgd2l0aCB0aGUgc3RhdGUgb2YgY29ubmVjdGlvblxyXG4gICAgICogXHJcbiAgICAgKiBBY2NvcmRpbmcgdG8gJ3VzZXInLCBpdCB3aWxsIHNob3cgb3IgaGlkZSBzb21lIGh0bWwgYXJlYXNcclxuICAgICAqL1xyXG4gICAgX2NoZWNrQ2FsbEJhY2tDb250ZXh0KHVzZXIpe1xyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XHJcbiAgICAgICAgaWYgKHVzZXIpe1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGl2TG9naW4pLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTmV4dERpdikucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZExvZ291dCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5pZEltZyl7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zcmMgPSB1c2VyLnBob3RvVVJMO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZEltZykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWREaXNwbGF5TmFtZSl7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGlzcGxheU5hbWUpLmlubmVySFRNTCA9IHVzZXIuZGlzcGxheU5hbWU7OyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGl2TG9naW4pLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkTmV4dERpdikuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsXCJcIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRMb2dvdXQpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLFwiXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zcmMgPSBcIlwiO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkSW1nKS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIFwiXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkRGlzcGxheU5hbWUpLmlubmVySFRNTCA9IFwiTm9uIENvbm50ZWN0w6lcIjsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuY2JBdXRoQ2hhbmdlZCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2JBdXRoQ2hhbmdlZCh1c2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0cmF0aW9uIG9mIGNhbGxiYWNrIGZvciBmdXR1ciBpbnRlcmFjdGlvbi5cclxuICAgICAqIFRoZSBjYWxsYmFjayBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgd2l0aCB1c2VyIGFzIHBhcmFtZXRlclxyXG4gICAgICovXHJcbiAgICBvbkF1dGhTdGF0ZUNoYW5nZWQoY2Ipe1xyXG4gICAgICAgIHRoaXMuY2JBdXRoQ2hhbmdlZCA9IGNiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCBsb2dnZWQgdXNlclxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5TmFtZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXIgPyB0aGlzLnVzZXIuZGlzcGxheU5hbWUgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyB0aGUgaWQgb2YgdGhlIGN1cnJlbnQgbG9nZ2VkIHVzZXJcclxuICAgICAqL1xyXG4gICAgdXNlcklkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlciA/IHRoaXMudXNlci51aWQgOiBudWxsO1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7Q29sb3JMdW1pbmFuY2V9IGZyb20gJy4uL2NvbW1vbi91dGlsLmpzJztcclxuXHJcbi8qKlxyXG4gKiBDaXJjbGUgTGVnbyBjbGFzc1xyXG4gKiBUaGUgY2lyY2xlIGlzIGNvbXBvc2VkIG9mIDIgY2lyY2xlIChvbiB0aGUgc2hhZG93LCBhbmQgdGhlIG90aGVyIG9uZSBmb3IgdGhlIHRvcClcclxuICogXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2lyY2xle1xyXG4gICAgY29uc3RydWN0b3IoY2VsbFNpemUsIGNvbG9yKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljID0gbmV3IGZhYnJpYy5DaXJjbGUoe1xyXG4gICAgICAgICAgICByYWRpdXM6IChjZWxsU2l6ZSAvIDIpIC0gNSxcclxuICAgICAgICAgICAgZmlsbDogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpLFxyXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiMHB4IDJweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWNFdHggPSBuZXcgZmFicmljLkNpcmNsZSh7XHJcbiAgICAgICAgICAgIHJhZGl1czogKGNlbGxTaXplIC8gMikgLSA0LFxyXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgMC4xKSxcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dCA9IG5ldyBmYWJyaWMuVGV4dCgnR0RHJywge1xyXG4gICAgICAgICAgICBmb250U2l6ZTogY2VsbFNpemUgLyA1LFxyXG4gICAgICAgICAgICBmaWxsOiBDb2xvckx1bWluYW5jZShjb2xvciwgLTAuMTUpLFxyXG4gICAgICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIHN0cm9rZTogQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjIwKSxcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5ncm91cCA9IG5ldyBmYWJyaWMuR3JvdXAoW3RoaXMuY2lyY2xlQmFzaWNFdHgsIHRoaXMuY2lyY2xlQmFzaWMsIHRoaXMudGV4dF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBGYWJyaWNKUyBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIGdldCBjYW52YXNFbHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncm91cDsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBjaXJjbGVcclxuICAgICAqL1xyXG4gICAgY2hhbmdlQ29sb3IoY29sb3Ipe1xyXG4gICAgICAgIHRoaXMuY2lyY2xlQmFzaWMuc2V0KCdmaWxsJywgQ29sb3JMdW1pbmFuY2UoY29sb3IsIC0wLjEpKTtcclxuICAgICAgICB0aGlzLmNpcmNsZUJhc2ljRXR4LnNldCgnZmlsbCcsIENvbG9yTHVtaW5hbmNlKGNvbG9yLCAwLjEpKTtcclxuICAgICAgICB0aGlzLnRleHQuc2V0KHtcclxuICAgICAgICAgICAgZmlsbCA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4xNSksXHJcbiAgICAgICAgICAgIHN0cm9rZSA6IENvbG9yTHVtaW5hbmNlKGNvbG9yLCAtMC4yMClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi9jaXJjbGUuanMnO1xyXG5cclxuLyoqXHJcbiAqIFBlZyBMZWdvIGNsYXNzXHJcbiAqIFRoZSBwZWcgaXMgY29tcG9zZWQgb2YgbiBjaXJjbGUgZm9yIGEgZGltZW5zaW9uIHRoYXQgZGVwZW5kIG9uIHRoZSBzaXplIHBhcmFtZXRlclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBlZ3tcclxuICAgIGNvbnN0cnVjdG9yKHtzaXplID0ge2NvbCA6IDEsIHJvdyA6IDF9LCBjZWxsU2l6ZSA9IDAsIGNvbG9yID0gJyNGRkYnLCBsZWZ0ID0gMCwgdG9wID0gMCwgYW5nbGUgPSAwfSl7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLmlkID0gYFBlZyR7c2l6ZX0tJHtEYXRlLm5vdygpfWA7XHJcbiAgICAgICAgdGhpcy5pc1JlcGxhY2UgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRvUmVtb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlIHx8IDA7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheSA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZWN0QmFzaWMgPSBuZXcgZmFicmljLlJlY3Qoe1xyXG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUgKiBzaXplLmNvbCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZSAqIHNpemUucm93LFxyXG4gICAgICAgICAgICBmaWxsOiBjb2xvcixcclxuICAgICAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIG9yaWdpblk6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBjZW50ZXJlZFJvdGF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXHJcbiAgICAgICAgICAgIHNoYWRvdyA6IFwiNXB4IDVweCAxMHB4IHJnYmEoMCwwLDAsMC4yKVwiICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgYXJyYXlFbHRzID0gW3RoaXMucmVjdEJhc2ljXTtcclxuICAgICAgICBsZXQgY2lyY2xlR3JvdXAgPSBuZXcgQ2lyY2xlKGNlbGxTaXplLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5wdXNoKGNpcmNsZUdyb3VwKTsgICAgICAgXHJcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHRoZSBzaXplLCB3ZSBkb24ndCBwbGFjZSB0aGUgY2lyY2xlcyBhdCB0aGUgc2FtZSBwbGFjZVxyXG4gICAgICAgIGlmIChzaXplLmNvbCA9PT0gMil7XHJcbiAgICAgICAgICAgIC8vIEZvciBhIHJlY3RhbmdsZSBvciBhIGJpZyBTcXVhcmVcclxuICAgICAgICAgICAgLy8gV2UgdXBkYXRlIHRoZSByb3cgcG9zaXRpb25zXHJcbiAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgbGVmdDogLWNlbGxTaXplICsgNVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHNpemUucm93ID09PSAyKXtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcCA6ICgtY2VsbFNpemUgKzUpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcclxuICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gRm9yIGEgQmlnIFNxdWFyZVxyXG4gICAgICAgICAgICBpZiAoc2l6ZS5yb3cgPT09IDIpe1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlR3JvdXAuY2FudmFzRWx0LnNldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogKC1jZWxsU2l6ZSArNSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XHJcblxyXG4gICAgICAgICAgICAvLyBGb3IgYSBCaWcgU3F1YXJlXHJcbiAgICAgICAgICAgIGlmIChzaXplLnJvdyA9PT0gMil7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IC1jZWxsU2l6ZSArIDUsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlQXJyYXkucHVzaChjaXJjbGVHcm91cCk7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGVHcm91cCA9IG5ldyBDaXJjbGUoY2VsbFNpemUsIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZUdyb3VwLmNhbnZhc0VsdC5zZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZUFycmF5LnB1c2goY2lyY2xlR3JvdXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaXJjbGVBcnJheS5mb3JFYWNoKChjaXJjbGUpPT5hcnJheUVsdHMucHVzaChjaXJjbGUuY2FudmFzRWx0KSk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBwZWcgaXMgbG9ja2VkIGluIGFsbCBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBuZXcgZmFicmljLkdyb3VwKGFycmF5RWx0cywge1xyXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXHJcbiAgICAgICAgICAgIHRvcDogdGhpcy50b3AsXHJcbiAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxyXG4gICAgICAgICAgICBsb2NrUm90YXRpb24gOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1ggOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NrU2NhbGluZ1kgOiB0cnVlLFxyXG4gICAgICAgICAgICBoYXNDb250cm9scyA6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBXZSBhZGQgdG8gRmFicmljRWxlbWVudCBhIHJlZmVyZW5jZSB0byB0aGUgY3VyZW50IHBlZ1xyXG4gICAgICAgIHRoaXMuZ3JvdXAucGFyZW50UGVnID0gdGhpczsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoZSBGYWJyaWNKUyBlbGVtZW50XHJcbiAgICBnZXQgY2FudmFzRWx0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgcmVwbGFjZWRcclxuICAgIGdldCByZXBsYWNlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXBsYWNlXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0dGVyIGZvciBpc1JlcGxhY2UgcGFyYW1cclxuICAgIHNldCByZXBsYWNlKHJlcGxhY2Upe1xyXG4gICAgICAgIHRoaXMuaXNSZXBsYWNlID0gcmVwbGFjZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBwZWdcclxuICAgIGNoYW5nZUNvbG9yKGNvbG9yKXtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5yZWN0QmFzaWMuc2V0KCdmaWxsJywgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuY2lyY2xlQXJyYXkuZm9yRWFjaCgoY2lyY2xlKT0+IGNpcmNsZS5jaGFuZ2VDb2xvcihjb2xvcikpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW92ZSB0aGUgcGVnIHRvIGRlc2lyZSBwb3NpdGlvblxyXG4gICAgbW92ZShsZWZ0LCB0b3Ape1xyXG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXQoe1xyXG4gICAgICAgICAgICB0b3A6IHRvcCxcclxuICAgICAgICAgICAgbGVmdCA6IGxlZnRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSb3RhdGUgdGhlIHBlZyB0byB0aGUgZGVzaXJlIGFuZ2xlXHJcbiAgICByb3RhdGUoYW5nbGUpe1xyXG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldCh7XHJcbiAgICAgICAgICAgIGFuZ2xlIDogYW5nbGVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGxheWluZyB2aWRlbyBcclxuICogXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVmlkZW9QbGF5ZXJ7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnRFbHQsIGNhbGxCYWNrRW5kKXtcclxuICAgICAgICB0aGlzLnZpZGVvRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcclxuICAgICAgICBwYXJlbnRFbHQuYXBwZW5kQ2hpbGQodGhpcy52aWRlb0VsdCk7XHJcbiAgICAgICAgdGhpcy52aWRlb05hbWUgPSAnJzsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2FsbEJhY2tFbmQgPSBjYWxsQmFja0VuZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBsYXkgdGhlIHZpZGVvXHJcbiAgICAgKi9cclxuICAgIHBsYXlWaWRlbygpe1xyXG4gICAgICAgIHRoaXMudmlkZW9FbHQucGF1c2UoKTtcclxuICAgICAgICB0aGlzLnZpZGVvRWx0LnNyYyA9IGAuL2Fzc2V0cy92aWRlby8ke3RoaXMudmlkZW9OYW1lfWA7XHJcbiAgICAgICAgdGhpcy52aWRlb0VsdC5wbGF5KCk7XHJcbiAgICAgICAgdGhpcy52aWRlb0VsdC5vbmVuZGVkID0gdGhpcy5jYWxsQmFja0VuZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICBcclxufSJdfQ==
