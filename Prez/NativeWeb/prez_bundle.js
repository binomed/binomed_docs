(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demos = exports.Demos = function () {
    function Demos() {
        _classCallCheck(this, Demos);

        this.socket = this.socketInit();
        try {
            this._fileDemo();
        } catch (e) {
            console.warn(e);
        }
        try {
            this._contactDemo();
        } catch (e) {
            console.warn(e);
        }
        try {
            this._nfcDemo();
        } catch (e) {
            console.warn(e);
        }
        try {
            this._demoSerial();
        } catch (e) {
            console.warn(e);
        }
        try {
            this._demoLight();
        } catch (e) {
            console.warn(e);
        }
        try {
            this._demoMustache();
        } catch (e) {
            console.warn(e);
        }
    }

    _createClass(Demos, [{
        key: 'socketInit',
        value: function socketInit() {
            try {
                return io('http://localhost:9999');
            } catch (e) {
                console.warn(e);
            }
        }
    }, {
        key: '_fileDemo',
        value: async function _fileDemo() {
            try {
                var getNewFileHandle = async function getNewFileHandle() {
                    var opts = {
                        type: 'saveFile',
                        accepts: [{
                            description: 'Text file',
                            extensions: ['md', 'txt'],
                            mimeTypes: ['text/plain']
                        }]
                    };
                    return await window.showOpenFilePicker(opts);
                };

                var _writeFile = async function _writeFile(fileHandle, contents) {
                    // Create a writer (request permission if necessary).
                    var writer = await fileHandle.createWritable();
                    // Write the full length of the contents
                    await writer.write(contents);
                    // Close the file and write the contents to disk
                    await writer.close();
                };

                var fileHandle = void 0;
                var butOpenFile = document.getElementById('file-chooser');
                var editArea = document.getElementById('edit-file');
                butOpenFile.addEventListener('click', async function (e) {
                    //fileHandle = await getNewFileHandle();
                    var _ref = await window.showOpenFilePicker();

                    var _ref2 = _slicedToArray(_ref, 1);

                    fileHandle = _ref2[0];
                    var file = await fileHandle.getFile();
                    var contents = await file.text();
                    editArea.value = contents;
                });

                var saveFile = document.getElementById('file-save');
                saveFile.addEventListener('click', async function (e) {
                    await _writeFile(fileHandle, editArea.value);
                });
            } catch (e) {
                console.warn(e);
            }
        }
    }, {
        key: '_contactDemo',
        value: async function _contactDemo() {
            var contactIcon = document.getElementById('contact-icon');
            var contactName = document.getElementById('contact-name');
            var contactTel = document.getElementById('contact-tel');
            var contactEmail = document.getElementById('contact-email');
            var contactAddress = document.getElementById('contact-address');
            this.socket.on('contacts', function (contact) {
                if (contact.icon) {
                    contactIcon.src = contact.icon;
                }
                if (contact.name) {
                    contactName.innerHTML = contact.name;
                }
                if (contact.tel && contact.tel.length > 0) {
                    contactTel.innerHTML = contact.tel[0].substr(0, 3) + '** ** ** **';
                }
                if (contact.email && contact.email.length > 0) {
                    contactEmail.innerHTML = contact.email[0].substr(0, 4) + '****@gmail.com';
                }
                if (contact.address && contact.address.length > 0) {
                    contactAddress.innerHTML = contact.address[0].city;
                }
                console.log(contacts);
            });
        }
    }, {
        key: '_nfcDemo',
        value: async function _nfcDemo() {
            var nfcType = document.getElementById('nfc-type');
            var nfcData = document.getElementById('nfc-data');
            this.socket.on('nfc', function (message) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = message.records[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var record = _step.value;

                        nfcType.innerHTML = record.recordType;
                        switch (record.recordType) {
                            case "text":
                                nfcData.innerHTML = record.data + ' (' + record.lang + ')';
                                break;
                            case "url":
                                nfcData.innerHTML = '' + record.data;
                                break;
                            default:
                                nfcData.innerHTML = 'Not implemented';
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });
        }
    }, {
        key: '_demoSerial',
        value: async function _demoSerial() {
            var connectButton = document.getElementById('connect-button');
            var port = void 0;
            var lineBuffer = '';
            var stopSerial = true;
            var latestValue = 0;

            if ('serial' in navigator) {
                connectButton.addEventListener('click', async function () {
                    stopSerial = false;
                    renderDemo();
                    port = await navigator.serial.requestPort({});
                    await port.open({ baudRate: 9600 });

                    var appendStream = new WritableStream({
                        write: function write(chunk) {
                            lineBuffer += chunk;

                            var lines = lineBuffer.split('\n');

                            if (lines.length > 1) {
                                lineBuffer = lines.pop();
                                latestValue = parseInt(lines.pop().trim());
                            }
                        }
                    });

                    port.readable.pipeThrough(new TextDecoderStream()).pipeTo(appendStream, { preventClose: true, preventCancel: true });

                    function unsubscribeSerial() {
                        port.close();
                        port = undefined;
                        stopSerial = true;
                        Reveal.removeEventListener('slidechanged', unsubscribeSerial);
                    }

                    Reveal.addEventListener('slidechanged', unsubscribeSerial);
                });

                connectButton.disabled = false;
            }

            function renderDemo() {
                var rabbit = document.querySelector('.panda');
                var percentage = Math.floor(latestValue / 1023 * 100);
                //const percentageStatus = document.querySelector('figcaption span');

                rabbit.style.left = 'calc(' + percentage + '% - 2em)';
                //percentageStatus.innerText = percentage;

                if (!stopSerial) {
                    window.requestAnimationFrame(renderDemo);
                }
            }
        }
    }, {
        key: '_demoLight',
        value: async function _demoLight() {
            var boo = document.getElementById('boo');
            this.socket.on('light', function (message) {
                if (message.illuminance === 0) {
                    boo.classList.remove('hide');
                } else {
                    boo.classList.add('hide');
                }
            });
        }
    }, {
        key: '_demoMustache',
        value: async function _demoMustache() {

            if (!('FaceDetector' in window)) {
                FaceDetector = function FaceDetector() {
                    console.log('Fake Face Detector used...');
                    return {
                        detect: async function detect() {
                            return [];
                        }
                    };
                };
            }
            var faceDetector = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 }); // Fast Detection
            var faces = []; // First initialisation to be sure to not have a NPE

            var isDetectingFaces = false;

            // this.easterEgg = false; Not use
            var context = undefined;
            var ratio = 0;
            var stopDraw = false;

            Reveal.addEventListener('start-mustache', async function () {

                async function getUserMedia() {
                    // Grab camera stream.
                    var constraints = {
                        video: {
                            facingMode: 'user', // To be sure to use the front camera for smartphones !
                            frameRate: 60 // To be sure to have a high rate of images
                        }
                    };

                    video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
                    // We starts the video
                    await video.play();

                    // The canvas take the size of the screen
                    var demoDiv = document.getElementById('demo-mustache');
                    canvas.height = demoDiv.getBoundingClientRect().height;
                    canvas.width = demoDiv.getBoundingClientRect().width;
                    // HACK: Face Detector doesn't accept canvas whose width is odd.
                    if (canvas.width % 2 == 1) {
                        canvas.width += 1;
                    }

                    context = canvas.getContext('2d');
                    // Ratio use to determine the rendering of video in canvas
                    // We take the max ratio and apply it to canvas after
                    // Width could be diferent from camera and screen !
                    ratio = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);

                    console.log('Ratio Width', canvas.width, video.videoWidth, canvas.width / video.videoWidth);
                    console.log('Ratio Height', canvas.height, video.videoHeight, canvas.height / video.videoHeight);

                    console.log('X Dest', canvas.width - video.videoWidth * ratio);
                    draw();
                }

                async function draw() {
                    if (stopDraw) {
                        return;
                    }
                    // To be sure to have the minimum delay between frames
                    requestAnimationFrame(draw);

                    // Draw video frame.
                    context.drawImage(video, // Source
                    (canvas.width - video.videoWidth * ratio) / 2, // x dest in canvas
                    // => use to manage portrait vs landscape
                    0, // y dest in canvas
                    video.videoWidth * ratio, // width video in canvas
                    video.videoHeight * ratio); // height video in canvas

                    if (!isDetectingFaces) {
                        // Detect faces.
                        isDetectingFaces = true;
                        faceDetector.detect(canvas).then(function (facesArray) {
                            faces = facesArray;
                            isDetectingFaces = false;
                        });
                    }
                    // Draw mustache and hat on previously detected face.
                    if (faces.length) {
                        var face = faces[0].boundingBox;
                        // we get a clientBoudingRect of face placed in the image !
                        /*
                            height and width give the height and width in px of the face (in the image)
                            left, top, bottom, right give the absolute position of the face (in the image)
                        */
                        context.drawImage(hat, // Source Hat
                        face.left, // x dest Hat
                        // we start from the left position
                        face.bottom - face.height * 3 / 4 - hat.height * face.width / hat.width, // Y dest Hat
                        // 3/4 of the face height - height of hat apply to ratio of the face width !
                        face.width, // width of hat in canvas
                        // We take the face width
                        hat.height * face.width / hat.width // height of hat apply to ratio of the face width
                        );
                        context.drawImage(mustache, // Source Mustache
                        face.left + face.width / 4, // X dest mustache
                        // 1 / 4
                        face.top + face.height * 3 / 5, // Y dest mustache
                        // 3/4 of the face
                        face.width / 2, // width of mustache in canvas
                        // The mustache will take the half of the face width
                        mustache.height * face.width / 2 / mustache.width // height of mustache in canvas
                        // The mustache will take the ratio of half the widht of face divide by mustache width to respect proportions
                        );
                    }
                }

                function unsubscribeMustache() {
                    var stream = video.srcObject;
                    var tracks = stream.getTracks();
                    tracks.forEach(function (track) {
                        track.stop();
                    });
                    video.pause();
                    stopDraw = true;
                    Reveal.removeEventListener('slidechanged', unsubscribeMustache);
                }

                Reveal.addEventListener('slidechanged', unsubscribeMustache);

                // Get elements from Id
                var canvas = document.getElementById('canvas');
                var video = document.getElementById('video');
                var mustache = document.getElementById('mustache');
                var hat = document.getElementById('hat');

                //Affect url to images
                hat.src = './assets/images/hat.png';
                mustache.src = './assets/images/mustache.png';

                // Inner method User Media (different from real user media method !)
                await getUserMedia();
            });
        }
    }]);

    return Demos;
}();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_TOP = '100px';
var LINE_HEIGHT = '1.14em';
var ADDITIONNAL_HEIGHT = '0.4em';
var COL_WIDTH = 35;

var HighlightCodeHelper = exports.HighlightCodeHelper = function () {
    function HighlightCodeHelper(_ref) {
        var keyElt = _ref.keyElt,
            positionArray = _ref.positionArray;

        _classCallCheck(this, HighlightCodeHelper);

        this.eltHiglight = document.getElementById('highlight-' + keyElt);
        this.positionArray = positionArray;
        this.lastIndex = 0;

        Reveal.addEventListener('code-' + keyElt, this._listenFragments.bind(this));
        Reveal.addEventListener('stop-code-' + keyElt, this._unregisterFragments.bind(this));
    }

    _createClass(HighlightCodeHelper, [{
        key: '_progressFragment',
        value: function _progressFragment(event) {
            try {
                var properties = null;
                if (event.type === 'init') {
                    if (this.lastIndex != 0) {
                        properties = this.positionArray[this.lastIndex];
                    }
                } else if (event.type === 'fragmentshown') {
                    var index = +event.fragment.getAttribute('data-fragment-index');
                    this.lastIndex = index;
                    properties = this.positionArray[index];
                } else {
                    var _index = +event.fragment.getAttribute('data-fragment-index');
                    this.lastIndex = _index;
                    // On reset les properties
                    if (_index > 0) {
                        properties = this.positionArray[_index - 1];
                    }
                }
                var keys = properties ? Object.keys(properties) : [];
                var area = {};
                var position = {};
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    switch (true) {
                        case key === 'line':
                        case key === 'nbLines':
                        case key === 'col':
                        case key === 'nbCols':
                        case key === 'topMargin':
                        case key === 'leftMargin':
                            position[key] = properties[key];
                            break;
                        case key === 'height':
                        case key === 'width':
                        case key === 'top':
                        case key === 'left':
                            area[key] = properties[key];
                            break;
                        default:
                    }
                }

                if (position.topMargin === undefined) {
                    position.topMargin = MIN_TOP;
                }
                if (position.nbLines === undefined && area.height === undefined) {
                    area.height = LINE_HEIGHT;
                }
                if (position.line === undefined && area.top === undefined) {
                    area.top = 0;
                }
                if (position.nbCols === undefined && area.width === undefined) {
                    area.width = 0;
                }
                if (position.col === undefined && area.left === undefined) {
                    area.left = 0;
                }
                this.eltHiglight.area = area;
                this.eltHiglight.position = position;
                this.eltHiglight.lineHeight = LINE_HEIGHT;
            } catch (e) {
                console.error(e);
            }
        }
    }, {
        key: '_listenFragments',
        value: function _listenFragments() {
            this._progressFragment({
                type: "init",
                fragment: document.querySelector('div.fragment.visible')
            });
            Reveal.addEventListener('fragmentshown', this._progressFragment.bind(this));
            Reveal.addEventListener('fragmenthidden', this._progressFragment.bind(this));
        }
    }, {
        key: '_unregisterFragments',
        value: function _unregisterFragments() {
            Reveal.removeEventListener('fragmentshown', this._progressFragment.bind(this));
            Reveal.removeEventListener('fragmenthidden', this._progressFragment.bind(this));
        }
    }]);

    return HighlightCodeHelper;
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HighlightEvents = undefined;

var _highlightCodeHelper = require('./helper/highlightCodeHelper.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LINE_HEIGHT = 1.15;
var ADDITIONNAL_HEIGT = 0.4;
var COL_WIDTH = 35;

var HighlightEvents = exports.HighlightEvents = function HighlightEvents() {
    _classCallCheck(this, HighlightEvents);

    //  Read File space explanation
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'read-file',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '110px',
            height: '150px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '250px',
            height: '80px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '320px',
            height: '80px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0px',
            height: '400px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  Create File space explanation
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'create-file',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '120px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '110px',
            height: '80px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '170px',
            height: '290px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '500px',
            height: '150px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0px',
            height: '700px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  Write File space explanation
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'write-file',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '190px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '180px',
            height: '120px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '300px',
            height: '120px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '500px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  Contact Picker File explanation
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'contact',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '190px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '180px',
            height: '90px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '320px',
            height: '140px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '600px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  NFC Read Tag
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'read-tag',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '190px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '180px',
            height: '60px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '220px',
            height: '150px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '600px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  NFC Write Tag
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'write-tag',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '110px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '110px',
            height: '170px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '330px',
            height: '150px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '600px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  Serial
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'serial',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '180px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '170px',
            height: '120px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '290px',
            height: '70px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '340px',
            height: '400px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '700px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  Sensors interface
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'sensors-interface',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '230px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '220px',
            height: '120px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '340px',
            height: '3000px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '700px',
            leftMargin: '50px',
            width: '100%'
        }]
    });

    //  Sensors Light
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'sensors-light',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '0px',
            height: '120px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '110px',
            height: '70px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '190px',
            height: '150px',
            leftMargin: '50px',
            width: '100%'
        }, {
            top: '0',
            height: '700px',
            leftMargin: '50px',
            width: '100%'
        }]
    });
};

},{"./helper/highlightCodeHelper.js":2}],4:[function(require,module,exports){
'use strict';

var _highlightEvent = require('./highlightEvent.js');

var _demos = require('./demos.js');

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

        if (!inIframe) {
            new _highlightEvent.HighlightEvents();
            new _demos.Demos();
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./demos.js":1,"./highlightEvent.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7SUNBYSxLLFdBQUEsSztBQUNULHFCQUFhO0FBQUE7O0FBQ1QsYUFBSyxNQUFMLEdBQWMsS0FBSyxVQUFMLEVBQWQ7QUFDQSxZQUFHO0FBQ0MsaUJBQUssU0FBTDtBQUNILFNBRkQsQ0FFQyxPQUFNLENBQU4sRUFBUTtBQUNMLG9CQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDRCxZQUFHO0FBQ0MsaUJBQUssWUFBTDtBQUNILFNBRkQsQ0FFQyxPQUFNLENBQU4sRUFBUTtBQUNMLG9CQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDRCxZQUFHO0FBQ0MsaUJBQUssUUFBTDtBQUNILFNBRkQsQ0FFQyxPQUFNLENBQU4sRUFBUTtBQUNMLG9CQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDRCxZQUFHO0FBQ0MsaUJBQUssV0FBTDtBQUNILFNBRkQsQ0FFQyxPQUFNLENBQU4sRUFBUTtBQUNMLG9CQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDRCxZQUFHO0FBQ0MsaUJBQUssVUFBTDtBQUNILFNBRkQsQ0FFQyxPQUFNLENBQU4sRUFBUTtBQUNMLG9CQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDRCxZQUFHO0FBQ0MsaUJBQUssYUFBTDtBQUNILFNBRkQsQ0FFQyxPQUFNLENBQU4sRUFBUTtBQUNMLG9CQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDSjs7OztxQ0FFVztBQUNSLGdCQUFHO0FBQ0MsdUJBQU8sR0FBRyx1QkFBSCxDQUFQO0FBRUgsYUFIRCxDQUdDLE9BQU0sQ0FBTixFQUFRO0FBQ0wsd0JBQVEsSUFBUixDQUFh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LE9BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQWZZO0FBSEssS0FBeEI7O0FBMkJBO0FBQ0EsUUFBSSx3Q0FBSixDQUF3QjtBQUNwQixnQkFBUSxlQURZO0FBRXBCO0FBQ0EsdUJBQWUsQ0FBQztBQUNaLGlCQUFLLEtBRE87QUFFWixvQkFBUSxPQUZJO0FBR1osd0JBQVksTUFIQTtBQUlaLG1CQUFPO0FBSkssU0FBRCxFQUtaO0FBQ0MsaUJBQUssT0FETjtBQUVDLG9CQUFRLE1BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQUxZLEVBVVo7QUFDQyxpQkFBSyxPQUROO0FBRUMsb0JBQVEsT0FGVDtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBVlksRUFlWjtBQUNDLGlCQUFLLEdBRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FmWTtBQUhLLEtBQXhCO0FBNEJILEM7OztBQ25STDs7QUFFQTs7QUFHQTs7QUFHQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUV0QixZQUFNLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUF0Qzs7QUFFQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1gsZ0JBQUksK0JBQUo7QUFDQSxnQkFBSSxZQUFKO0FBQ0g7QUFFSjs7QUFJRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0FqQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgRGVtb3N7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSB0aGlzLnNvY2tldEluaXQoKTtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdGhpcy5fZmlsZURlbW8oKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhY3REZW1vKCk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgICAgICB0cnl7XG4gICAgICAgICAgICB0aGlzLl9uZmNEZW1vKCk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgICAgICB0cnl7XG4gICAgICAgICAgICB0aGlzLl9kZW1vU2VyaWFsKCk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgICAgICB0cnl7XG4gICAgICAgICAgICB0aGlzLl9kZW1vTGlnaHQoKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9NdXN0YWNoZSgpO1xuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb2NrZXRJbml0KCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHJldHVybiBpbygnaHR0cDovL2xvY2FsaG9zdDo5OTk5Jyk7XG4gICAgXG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF9maWxlRGVtbygpe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBsZXQgZmlsZUhhbmRsZTtcbiAgICAgICAgICAgIGNvbnN0IGJ1dE9wZW5GaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtY2hvb3NlcicpO1xuICAgICAgICAgICAgY29uc3QgZWRpdEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1maWxlJyk7XG4gICAgICAgICAgICBidXRPcGVuRmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgW2ZpbGVIYW5kbGVdID0gYXdhaXQgd2luZG93LnNob3dPcGVuRmlsZVBpY2tlcigpO1xuICAgICAgICAgICAgICAgIC8vZmlsZUhhbmRsZSA9IGF3YWl0IGdldE5ld0ZpbGVIYW5kbGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgZmlsZUhhbmRsZS5nZXRGaWxlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0QXJlYS52YWx1ZSA9IGNvbnRlbnRzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNhdmVGaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtc2F2ZScpO1xuICAgICAgICAgICAgc2F2ZUZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZShmaWxlSGFuZGxlLCBlZGl0QXJlYS52YWx1ZSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBnZXROZXdGaWxlSGFuZGxlKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc2F2ZUZpbGUnLFxuICAgICAgICAgICAgICAgICAgYWNjZXB0czogW3tcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUZXh0IGZpbGUnLFxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zOiBbJ21kJywndHh0J10sXG4gICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlczogWyd0ZXh0L3BsYWluJ10sXG4gICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB3aW5kb3cuc2hvd09wZW5GaWxlUGlja2VyKG9wdHMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHdyaXRlRmlsZShmaWxlSGFuZGxlLCBjb250ZW50cykge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIHdyaXRlciAocmVxdWVzdCBwZXJtaXNzaW9uIGlmIG5lY2Vzc2FyeSkuXG4gICAgICAgICAgICAgICAgY29uc3Qgd3JpdGVyID0gYXdhaXQgZmlsZUhhbmRsZS5jcmVhdGVXcml0YWJsZSgpO1xuICAgICAgICAgICAgICAgIC8vIFdyaXRlIHRoZSBmdWxsIGxlbmd0aCBvZiB0aGUgY29udGVudHNcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZXIud3JpdGUoY29udGVudHMpO1xuICAgICAgICAgICAgICAgIC8vIENsb3NlIHRoZSBmaWxlIGFuZCB3cml0ZSB0aGUgY29udGVudHMgdG8gZGlza1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlci5jbG9zZSgpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX2NvbnRhY3REZW1vKCl7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtaWNvbicpO1xuICAgICAgICBjb25zdCBjb250YWN0TmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LW5hbWUnKTtcbiAgICAgICAgY29uc3QgY29udGFjdFRlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LXRlbCcpO1xuICAgICAgICBjb25zdCBjb250YWN0RW1haWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1lbWFpbCcpO1xuICAgICAgICBjb25zdCBjb250YWN0QWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LWFkZHJlc3MnKTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oJ2NvbnRhY3RzJywgKGNvbnRhY3QpPT57XG4gICAgICAgICAgICBpZiAoY29udGFjdC5pY29uKXtcbiAgICAgICAgICAgICAgICBjb250YWN0SWNvbi5zcmMgPSBjb250YWN0Lmljb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihjb250YWN0Lm5hbWUpe1xuICAgICAgICAgICAgICAgIGNvbnRhY3ROYW1lLmlubmVySFRNTCA9IGNvbnRhY3QubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNvbnRhY3QudGVsICYmIGNvbnRhY3QudGVsLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIGNvbnRhY3RUZWwuaW5uZXJIVE1MID0gY29udGFjdC50ZWxbMF0uc3Vic3RyKDAsMykrJyoqICoqICoqICoqJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250YWN0LmVtYWlsICYmIGNvbnRhY3QuZW1haWwubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgY29udGFjdEVtYWlsLmlubmVySFRNTCA9IGNvbnRhY3QuZW1haWxbMF0uc3Vic3RyKDAsIDQpKycqKioqQGdtYWlsLmNvbSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGFjdC5hZGRyZXNzICYmIGNvbnRhY3QuYWRkcmVzcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBjb250YWN0QWRkcmVzcy5pbm5lckhUTUwgPSBjb250YWN0LmFkZHJlc3NbMF0uY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbnRhY3RzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX25mY0RlbW8oKXtcbiAgICAgICAgY29uc3QgbmZjVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZmMtdHlwZScpO1xuICAgICAgICBjb25zdCBuZmNEYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25mYy1kYXRhJyk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKCduZmMnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgbWVzc2FnZS5yZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgbmZjVHlwZS5pbm5lckhUTUwgPSByZWNvcmQucmVjb3JkVHlwZTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlY29yZC5yZWNvcmRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgICAgICAgICAgbmZjRGF0YS5pbm5lckhUTUwgPSBgJHtyZWNvcmQuZGF0YX0gKCR7cmVjb3JkLmxhbmd9KWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ1cmxcIjpcbiAgICAgICAgICAgICAgICAgICAgbmZjRGF0YS5pbm5lckhUTUwgPSBgJHtyZWNvcmQuZGF0YX1gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBuZmNEYXRhLmlubmVySFRNTCA9ICdOb3QgaW1wbGVtZW50ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIF9kZW1vU2VyaWFsKCl7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAoJ2Nvbm5lY3QtYnV0dG9uJyk7XG4gICAgICAgIGxldCBwb3J0O1xuICAgICAgICBsZXQgbGluZUJ1ZmZlciA9ICcnO1xuICAgICAgICBsZXQgc3RvcFNlcmlhbCA9IHRydWU7XG4gICAgICAgIGxldCBsYXRlc3RWYWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKCdzZXJpYWwnIGluIG5hdmlnYXRvcikge1xuICAgICAgICAgICAgY29ubmVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RvcFNlcmlhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlbmRlckRlbW8oKVxuICAgICAgICAgICAgICAgIHBvcnQgPSBhd2FpdCBuYXZpZ2F0b3Iuc2VyaWFsLnJlcXVlc3RQb3J0KHt9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBwb3J0Lm9wZW4oeyBiYXVkUmF0ZTogOTYwMCB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgYXBwZW5kU3RyZWFtID0gbmV3IFdyaXRhYmxlU3RyZWFtKHtcbiAgICAgICAgICAgICAgICAgIHdyaXRlKGNodW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVCdWZmZXIgKz0gY2h1bms7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgbGluZXMgPSBsaW5lQnVmZmVyLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGluZUJ1ZmZlciA9IGxpbmVzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgIGxhdGVzdFZhbHVlID0gcGFyc2VJbnQobGluZXMucG9wKCkudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBwb3J0LnJlYWRhYmxlXG4gICAgICAgICAgICAgICAgICAucGlwZVRocm91Z2gobmV3IFRleHREZWNvZGVyU3RyZWFtKCkpXG4gICAgICAgICAgICAgICAgICAucGlwZVRvKGFwcGVuZFN0cmVhbSx7cHJldmVudENsb3NlOnRydWUsIHByZXZlbnRDYW5jZWw6dHJ1ZX0pO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gdW5zdWJzY3JpYmVTZXJpYWwoKXtcbiAgICAgICAgICAgICAgICAgICAgcG9ydC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBwb3J0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdG9wU2VyaWFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHVuc3Vic2NyaWJlU2VyaWFsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdW5zdWJzY3JpYmVTZXJpYWwpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29ubmVjdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyRGVtbygpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhYmJpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5kYScpO1xuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IE1hdGguZmxvb3IobGF0ZXN0VmFsdWUgLyAxMDIzICogMTAwKTtcbiAgICAgICAgICAgIC8vY29uc3QgcGVyY2VudGFnZVN0YXR1cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2ZpZ2NhcHRpb24gc3BhbicpO1xuICAgIFxuICAgICAgICAgICAgcmFiYml0LnN0eWxlLmxlZnQgPSAnY2FsYygnICsgcGVyY2VudGFnZSArICclIC0gMmVtKSc7XG4gICAgICAgICAgICAvL3BlcmNlbnRhZ2VTdGF0dXMuaW5uZXJUZXh0ID0gcGVyY2VudGFnZTtcbiAgICBcbiAgICAgICAgICAgIGlmICghc3RvcFNlcmlhbCl7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJEZW1vKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYXN5bmMgX2RlbW9MaWdodCgpe1xuICAgICAgICBjb25zdCBib28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9vJyk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKCdsaWdodCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS5pbGx1bWluYW5jZSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgYm9vLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgYm9vLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBfZGVtb011c3RhY2hlKCl7XG5cbiAgICAgICAgaWYgKCEoJ0ZhY2VEZXRlY3RvcicgaW4gd2luZG93KSkge1xuICAgICAgICAgICAgRmFjZURldGVjdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWtlIEZhY2UgRGV0ZWN0b3IgdXNlZC4uLicpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRldGVjdDogYXN5bmMgZnVuY3Rpb24oKSB7IHJldHVybiBbXSB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZhY2VEZXRlY3RvciA9IG5ldyBGYWNlRGV0ZWN0b3IoeyBmYXN0TW9kZTogdHJ1ZSwgbWF4RGV0ZWN0ZWRGYWNlczogMSB9KTsgLy8gRmFzdCBEZXRlY3Rpb25cbiAgICAgICAgbGV0IGZhY2VzID0gW107IC8vIEZpcnN0IGluaXRpYWxpc2F0aW9uIHRvIGJlIHN1cmUgdG8gbm90IGhhdmUgYSBOUEVcblxuICAgICAgICBsZXQgaXNEZXRlY3RpbmdGYWNlcyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHRoaXMuZWFzdGVyRWdnID0gZmFsc2U7IE5vdCB1c2VcbiAgICAgICAgbGV0IGNvbnRleHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCByYXRpbyA9IDA7XG4gICAgICAgIGxldCBzdG9wRHJhdyA9IGZhbHNlO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzdGFydC1tdXN0YWNoZScsIGFzeW5jICgpPT57XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGdldFVzZXJNZWRpYSgpIHtcbiAgICAgICAgICAgICAgICAvLyBHcmFiIGNhbWVyYSBzdHJlYW0uXG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgICAgICAgICAgIGZhY2luZ01vZGU6ICd1c2VyJywgLy8gVG8gYmUgc3VyZSB0byB1c2UgdGhlIGZyb250IGNhbWVyYSBmb3Igc21hcnRwaG9uZXMgIVxuICAgICAgICAgICAgICAgICAgICBmcmFtZVJhdGU6IDYwLCAvLyBUbyBiZSBzdXJlIHRvIGhhdmUgYSBoaWdoIHJhdGUgb2YgaW1hZ2VzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgICAgICAgICB2aWRlby5zcmNPYmplY3QgPSBhd2FpdCBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cyk7XG4gICAgICAgICAgICAgICAgLy8gV2Ugc3RhcnRzIHRoZSB2aWRlb1xuICAgICAgICAgICAgICAgIGF3YWl0IHZpZGVvLnBsYXkoKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gVGhlIGNhbnZhcyB0YWtlIHRoZSBzaXplIG9mIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAgICBjb25zdCBkZW1vRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tbXVzdGFjaGUnKTtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gZGVtb0Rpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gZGVtb0Rpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgICAgICAgICAvLyBIQUNLOiBGYWNlIERldGVjdG9yIGRvZXNuJ3QgYWNjZXB0IGNhbnZhcyB3aG9zZSB3aWR0aCBpcyBvZGQuXG4gICAgICAgICAgICAgICAgaWYgKGNhbnZhcy53aWR0aCAlIDIgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgICAgICAvLyBSYXRpbyB1c2UgdG8gZGV0ZXJtaW5lIHRoZSByZW5kZXJpbmcgb2YgdmlkZW8gaW4gY2FudmFzXG4gICAgICAgICAgICAgICAgLy8gV2UgdGFrZSB0aGUgbWF4IHJhdGlvIGFuZCBhcHBseSBpdCB0byBjYW52YXMgYWZ0ZXJcbiAgICAgICAgICAgICAgICAvLyBXaWR0aCBjb3VsZCBiZSBkaWZlcmVudCBmcm9tIGNhbWVyYSBhbmQgc2NyZWVuICFcbiAgICAgICAgICAgICAgICByYXRpbyA9IE1hdGgubWF4KGNhbnZhcy53aWR0aCAvIHZpZGVvLnZpZGVvV2lkdGgsIGNhbnZhcy5oZWlnaHQgLyB2aWRlby52aWRlb0hlaWdodCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSYXRpbyBXaWR0aCcsIGNhbnZhcy53aWR0aCwgdmlkZW8udmlkZW9XaWR0aCwgY2FudmFzLndpZHRoIC8gdmlkZW8udmlkZW9XaWR0aCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JhdGlvIEhlaWdodCcsIGNhbnZhcy5oZWlnaHQsIHZpZGVvLnZpZGVvSGVpZ2h0LCBjYW52YXMuaGVpZ2h0IC8gdmlkZW8udmlkZW9IZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWCBEZXN0JywgY2FudmFzLndpZHRoIC0gdmlkZW8udmlkZW9XaWR0aCAqIHJhdGlvKTtcbiAgICAgICAgICAgICAgICBkcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZHJhdygpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcERyYXcpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFRvIGJlIHN1cmUgdG8gaGF2ZSB0aGUgbWluaW11bSBkZWxheSBiZXR3ZWVuIGZyYW1lc1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gRHJhdyB2aWRlbyBmcmFtZS5cbiAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlbywgLy8gU291cmNlXG4gICAgICAgICAgICAgICAgICAgIChjYW52YXMud2lkdGggLSB2aWRlby52aWRlb1dpZHRoICogcmF0aW8pIC8gMiwgLy8geCBkZXN0IGluIGNhbnZhc1xuICAgICAgICAgICAgICAgICAgICAvLyA9PiB1c2UgdG8gbWFuYWdlIHBvcnRyYWl0IHZzIGxhbmRzY2FwZVxuICAgICAgICAgICAgICAgICAgICAwLCAvLyB5IGRlc3QgaW4gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnZpZGVvV2lkdGggKiByYXRpbywgLy8gd2lkdGggdmlkZW8gaW4gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnZpZGVvSGVpZ2h0ICogcmF0aW8pOyAvLyBoZWlnaHQgdmlkZW8gaW4gY2FudmFzXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghaXNEZXRlY3RpbmdGYWNlcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZXRlY3QgZmFjZXMuXG4gICAgICAgICAgICAgICAgICAgIGlzRGV0ZWN0aW5nRmFjZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmYWNlRGV0ZWN0b3IuZGV0ZWN0KGNhbnZhcykudGhlbigoZmFjZXNBcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlcyA9IGZhY2VzQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RldGVjdGluZ0ZhY2VzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRHJhdyBtdXN0YWNoZSBhbmQgaGF0IG9uIHByZXZpb3VzbHkgZGV0ZWN0ZWQgZmFjZS5cbiAgICAgICAgICAgICAgICBpZiAoZmFjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY2UgPSBmYWNlc1swXS5ib3VuZGluZ0JveDtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgZ2V0IGEgY2xpZW50Qm91ZGluZ1JlY3Qgb2YgZmFjZSBwbGFjZWQgaW4gdGhlIGltYWdlICFcbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCBhbmQgd2lkdGggZ2l2ZSB0aGUgaGVpZ2h0IGFuZCB3aWR0aCBpbiBweCBvZiB0aGUgZmFjZSAoaW4gdGhlIGltYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCwgdG9wLCBib3R0b20sIHJpZ2h0IGdpdmUgdGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBmYWNlIChpbiB0aGUgaW1hZ2UpXG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGhhdCwgLy8gU291cmNlIEhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5sZWZ0LCAvLyB4IGRlc3QgSGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBzdGFydCBmcm9tIHRoZSBsZWZ0IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlLmJvdHRvbSAtIGZhY2UuaGVpZ2h0ICogMyAvIDQgLSBoYXQuaGVpZ2h0ICogZmFjZS53aWR0aCAvIGhhdC53aWR0aCwgLy8gWSBkZXN0IEhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMy80IG9mIHRoZSBmYWNlIGhlaWdodCAtIGhlaWdodCBvZiBoYXQgYXBwbHkgdG8gcmF0aW8gb2YgdGhlIGZhY2Ugd2lkdGggIVxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS53aWR0aCwgLy8gd2lkdGggb2YgaGF0IGluIGNhbnZhc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgdGFrZSB0aGUgZmFjZSB3aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgaGF0LmhlaWdodCAqIGZhY2Uud2lkdGggLyBoYXQud2lkdGggLy8gaGVpZ2h0IG9mIGhhdCBhcHBseSB0byByYXRpbyBvZiB0aGUgZmFjZSB3aWR0aFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShtdXN0YWNoZSwgLy8gU291cmNlIE11c3RhY2hlXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlLmxlZnQgKyBmYWNlLndpZHRoIC8gNCwgLy8gWCBkZXN0IG11c3RhY2hlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxIC8gNFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS50b3AgKyBmYWNlLmhlaWdodCAqIDMgLyA1LCAvLyBZIGRlc3QgbXVzdGFjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMvNCBvZiB0aGUgZmFjZVxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS53aWR0aCAvIDIsICAvLyB3aWR0aCBvZiBtdXN0YWNoZSBpbiBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBtdXN0YWNoZSB3aWxsIHRha2UgdGhlIGhhbGYgb2YgdGhlIGZhY2Ugd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIG11c3RhY2hlLmhlaWdodCAqIGZhY2Uud2lkdGggLyAyIC8gbXVzdGFjaGUud2lkdGggLy8gaGVpZ2h0IG9mIG11c3RhY2hlIGluIGNhbnZhc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG11c3RhY2hlIHdpbGwgdGFrZSB0aGUgcmF0aW8gb2YgaGFsZiB0aGUgd2lkaHQgb2YgZmFjZSBkaXZpZGUgYnkgbXVzdGFjaGUgd2lkdGggdG8gcmVzcGVjdCBwcm9wb3J0aW9uc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdW5zdWJzY3JpYmVNdXN0YWNoZSgpe1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmVhbSA9IHZpZGVvLnNyY09iamVjdDtcbiAgICAgICAgICAgICAgICBsZXQgdHJhY2tzID0gc3RyZWFtLmdldFRyYWNrcygpO1xuICAgICAgICAgICAgICAgIHRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICAgICAgICAgICAgICB0cmFjay5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmlkZW8ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICBzdG9wRHJhdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHVuc3Vic2NyaWJlTXVzdGFjaGUpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHVuc3Vic2NyaWJlTXVzdGFjaGUpO1xuXG4gICAgICAgICAgICAgLy8gR2V0IGVsZW1lbnRzIGZyb20gSWRcbiAgICAgICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gICAgICAgICAgICAgY29uc3QgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8nKTtcbiAgICAgICAgICAgICBjb25zdCBtdXN0YWNoZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtdXN0YWNoZScpO1xuICAgICAgICAgICAgIGNvbnN0IGhhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoYXQnKTtcbiBcbiAgICAgICAgICAgICAvL0FmZmVjdCB1cmwgdG8gaW1hZ2VzXG4gICAgICAgICAgICAgaGF0LnNyYyA9ICcuL2Fzc2V0cy9pbWFnZXMvaGF0LnBuZyc7XG4gICAgICAgICAgICAgbXVzdGFjaGUuc3JjID0gJy4vYXNzZXRzL2ltYWdlcy9tdXN0YWNoZS5wbmcnO1xuIFxuICAgICAgICAgICAgIC8vIElubmVyIG1ldGhvZCBVc2VyIE1lZGlhIChkaWZmZXJlbnQgZnJvbSByZWFsIHVzZXIgbWVkaWEgbWV0aG9kICEpXG4gICAgICAgICAgICAgYXdhaXQgZ2V0VXNlck1lZGlhKCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNGVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmxpbmVIZWlnaHQgPSBMSU5FX0hFSUdIVDtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgUmVhZCBGaWxlIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3JlYWQtZmlsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjUwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzIwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIENyZWF0ZSBGaWxlIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2NyZWF0ZS1maWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzUwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgV3JpdGUgRmlsZSBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd3cml0ZS1maWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTkwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc1MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIENvbnRhY3QgUGlja2VyIEZpbGUgZXhwbGFuYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29udGFjdCcsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMyMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIE5GQyBSZWFkIFRhZ1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdyZWFkLXRhZycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzIyMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIE5GQyBXcml0ZSBUYWdcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnd3JpdGUtdGFnJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE3MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMzMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIFNlcmlhbFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdzZXJpYWwnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxNzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjkwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzQwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzQwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgU2Vuc29ycyBpbnRlcmZhY2VcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnc2Vuc29ycy1pbnRlcmZhY2UnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyMzBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcyMjBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzQwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzMwMDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIFNlbnNvcnMgTGlnaHRcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnc2Vuc29ycy1saWdodCcsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzExMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcblxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHsgRGVtb3MgfSBmcm9tICcuL2RlbW9zLmpzJztcblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpXG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiXX0=
