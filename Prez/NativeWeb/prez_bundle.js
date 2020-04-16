(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
                    return await window.chooseFileSystemEntries(opts);
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
                    fileHandle = await window.chooseFileSystemEntries();
                    //fileHandle = await getNewFileHandle();
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
                    await port.open({ baudrate: 9600 });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQWEsSyxXQUFBLEs7QUFDVCxxQkFBYTtBQUFBOztBQUNULGFBQUssTUFBTCxHQUFjLEtBQUssVUFBTCxFQUFkO0FBQ0EsWUFBRztBQUNDLGlCQUFLLFNBQUw7QUFDSCxTQUZELENBRUMsT0FBTSxDQUFOLEVBQVE7QUFDTCxvQkFBUSxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0QsWUFBRztBQUNDLGlCQUFLLFlBQUw7QUFDSCxTQUZELENBRUMsT0FBTSxDQUFOLEVBQVE7QUFDTCxvQkFBUSxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0QsWUFBRztBQUNDLGlCQUFLLFFBQUw7QUFDSCxTQUZELENBRUMsT0FBTSxDQUFOLEVBQVE7QUFDTCxvQkFBUSxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0QsWUFBRztBQUNDLGlCQUFLLFdBQUw7QUFDSCxTQUZELENBRUMsT0FBTSxDQUFOLEVBQVE7QUFDTCxvQkFBUSxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0QsWUFBRztBQUNDLGlCQUFLLFVBQUw7QUFDSCxTQUZELENBRUMsT0FBTSxDQUFOLEVBQVE7QUFDTCxvQkFBUSxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0QsWUFBRztBQUNDLGlCQUFLLGFBQUw7QUFDSCxTQUZELENBRUMsT0FBTSxDQUFOLEVBQVE7QUFDTCxvQkFBUSxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0o7Ozs7cUNBRVc7QUFDUixnQkFBRztBQUNDLHVCQUFPLEdBQUcsdUJBQUgsQ0FBUDtBQUVILGFBSEQsQ0FHQyxPQUFNLENBQU4sRUFBUTtBQUNMLHdCQUFRLElBQVIsQ0FBYSxD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QyxtQkFBTztBQUpSLFNBZlk7QUFISyxLQUF4Qjs7QUEyQkE7QUFDQSxRQUFJLHdDQUFKLENBQXdCO0FBQ3BCLGdCQUFRLGVBRFk7QUFFcEI7QUFDQSx1QkFBZSxDQUFDO0FBQ1osaUJBQUssS0FETztBQUVaLG9CQUFRLE9BRkk7QUFHWix3QkFBWSxNQUhBO0FBSVosbUJBQU87QUFKSyxTQUFELEVBS1o7QUFDQyxpQkFBSyxPQUROO0FBRUMsb0JBQVEsTUFGVDtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBTFksRUFVWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FWWSxFQWVaO0FBQ0MsaUJBQUssR0FETjtBQUVDLG9CQUFRLE9BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQWZZO0FBSEssS0FBeEI7QUE0QkgsQzs7O0FDblJMOztBQUVBOztBQUdBOztBQUdBLENBQUMsa0JBQWtCOztBQUdmLG1CQUFlLFFBQWYsR0FBMEI7O0FBRXRCLFlBQU0sV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXRDOztBQUVBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxnQkFBSSwrQkFBSjtBQUNBLGdCQUFJLFlBQUo7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQWpCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBjbGFzcyBEZW1vc3tcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IHRoaXMuc29ja2V0SW5pdCgpO1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICB0aGlzLl9maWxlRGVtbygpO1xuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdGhpcy5fY29udGFjdERlbW8oKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMuX25mY0RlbW8oKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9TZXJpYWwoKTtcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHRoaXMuX2RlbW9MaWdodCgpO1xuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdGhpcy5fZGVtb011c3RhY2hlKCk7XG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvY2tldEluaXQoKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgcmV0dXJuIGlvKCdodHRwOi8vbG9jYWxob3N0Ojk5OTknKTtcbiAgICBcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX2ZpbGVEZW1vKCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGxldCBmaWxlSGFuZGxlO1xuICAgICAgICAgICAgY29uc3QgYnV0T3BlbkZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1jaG9vc2VyJyk7XG4gICAgICAgICAgICBjb25zdCBlZGl0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWZpbGUnKTtcbiAgICAgICAgICAgIGJ1dE9wZW5GaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBmaWxlSGFuZGxlID0gYXdhaXQgd2luZG93LmNob29zZUZpbGVTeXN0ZW1FbnRyaWVzKCk7XG4gICAgICAgICAgICAgICAgLy9maWxlSGFuZGxlID0gYXdhaXQgZ2V0TmV3RmlsZUhhbmRsZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBmaWxlSGFuZGxlLmdldEZpbGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgICAgICAgICAgIGVkaXRBcmVhLnZhbHVlID0gY29udGVudHM7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc2F2ZUZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1zYXZlJyk7XG4gICAgICAgICAgICBzYXZlRmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGVGaWxlKGZpbGVIYW5kbGUsIGVkaXRBcmVhLnZhbHVlKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGdldE5ld0ZpbGVIYW5kbGUoKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzYXZlRmlsZScsXG4gICAgICAgICAgICAgICAgICBhY2NlcHRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RleHQgZmlsZScsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnM6IFsnbWQnLCd0eHQnXSxcbiAgICAgICAgICAgICAgICAgICAgbWltZVR5cGVzOiBbJ3RleHQvcGxhaW4nXSxcbiAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHdpbmRvdy5jaG9vc2VGaWxlU3lzdGVtRW50cmllcyhvcHRzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB3cml0ZUZpbGUoZmlsZUhhbmRsZSwgY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSB3cml0ZXIgKHJlcXVlc3QgcGVybWlzc2lvbiBpZiBuZWNlc3NhcnkpLlxuICAgICAgICAgICAgICAgIGNvbnN0IHdyaXRlciA9IGF3YWl0IGZpbGVIYW5kbGUuY3JlYXRlV3JpdGFibGUoKTtcbiAgICAgICAgICAgICAgICAvLyBXcml0ZSB0aGUgZnVsbCBsZW5ndGggb2YgdGhlIGNvbnRlbnRzXG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGVyLndyaXRlKGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAvLyBDbG9zZSB0aGUgZmlsZSBhbmQgd3JpdGUgdGhlIGNvbnRlbnRzIHRvIGRpc2tcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF9jb250YWN0RGVtbygpe1xuICAgICAgICBjb25zdCBjb250YWN0SWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LWljb24nKTtcbiAgICAgICAgY29uc3QgY29udGFjdE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1uYW1lJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RUZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC10ZWwnKTtcbiAgICAgICAgY29uc3QgY29udGFjdEVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtZW1haWwnKTtcbiAgICAgICAgY29uc3QgY29udGFjdEFkZHJlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1hZGRyZXNzJyk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKCdjb250YWN0cycsIChjb250YWN0KT0+e1xuICAgICAgICAgICAgaWYgKGNvbnRhY3QuaWNvbil7XG4gICAgICAgICAgICAgICAgY29udGFjdEljb24uc3JjID0gY29udGFjdC5pY29uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoY29udGFjdC5uYW1lKXtcbiAgICAgICAgICAgICAgICBjb250YWN0TmFtZS5pbm5lckhUTUwgPSBjb250YWN0Lm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihjb250YWN0LnRlbCAmJiBjb250YWN0LnRlbC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBjb250YWN0VGVsLmlubmVySFRNTCA9IGNvbnRhY3QudGVsWzBdLnN1YnN0cigwLDMpKycqKiAqKiAqKiAqKic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGFjdC5lbWFpbCAmJiBjb250YWN0LmVtYWlsLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIGNvbnRhY3RFbWFpbC5pbm5lckhUTUwgPSBjb250YWN0LmVtYWlsWzBdLnN1YnN0cigwLCA0KSsnKioqKkBnbWFpbC5jb20nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRhY3QuYWRkcmVzcyAmJiBjb250YWN0LmFkZHJlc3MubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgY29udGFjdEFkZHJlc3MuaW5uZXJIVE1MID0gY29udGFjdC5hZGRyZXNzWzBdLmNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb250YWN0cyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIF9uZmNEZW1vKCl7XG4gICAgICAgIGNvbnN0IG5mY1R5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmZjLXR5cGUnKTtcbiAgICAgICAgY29uc3QgbmZjRGF0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZmMtZGF0YScpO1xuICAgICAgICB0aGlzLnNvY2tldC5vbignbmZjJywgKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVjb3JkIG9mIG1lc3NhZ2UucmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIG5mY1R5cGUuaW5uZXJIVE1MID0gcmVjb3JkLnJlY29yZFR5cGU7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChyZWNvcmQucmVjb3JkVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICAgICAgICAgIG5mY0RhdGEuaW5uZXJIVE1MID0gYCR7cmVjb3JkLmRhdGF9ICgke3JlY29yZC5sYW5nfSlgO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwidXJsXCI6XG4gICAgICAgICAgICAgICAgICAgIG5mY0RhdGEuaW5uZXJIVE1MID0gYCR7cmVjb3JkLmRhdGF9YDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgbmZjRGF0YS5pbm5lckhUTUwgPSAnTm90IGltcGxlbWVudGVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhc3luYyBfZGVtb1NlcmlhbCgpe1xuICAgICAgICBjb25zdCBjb25uZWN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgKCdjb25uZWN0LWJ1dHRvbicpO1xuICAgICAgICBsZXQgcG9ydDtcbiAgICAgICAgbGV0IGxpbmVCdWZmZXIgPSAnJztcbiAgICAgICAgbGV0IHN0b3BTZXJpYWwgPSB0cnVlO1xuICAgICAgICBsZXQgbGF0ZXN0VmFsdWUgPSAwO1xuXG4gICAgICAgIGlmICgnc2VyaWFsJyBpbiBuYXZpZ2F0b3IpIHtcbiAgICAgICAgICAgIGNvbm5lY3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0b3BTZXJpYWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZW5kZXJEZW1vKClcbiAgICAgICAgICAgICAgICBwb3J0ID0gYXdhaXQgbmF2aWdhdG9yLnNlcmlhbC5yZXF1ZXN0UG9ydCh7fSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgcG9ydC5vcGVuKHsgYmF1ZHJhdGU6IDk2MDAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGFwcGVuZFN0cmVhbSA9IG5ldyBXcml0YWJsZVN0cmVhbSh7XG4gICAgICAgICAgICAgICAgICB3cml0ZShjaHVuaykge1xuICAgICAgICAgICAgICAgICAgICBsaW5lQnVmZmVyICs9IGNodW5rO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmVzID0gbGluZUJ1ZmZlci5zcGxpdCgnXFxuJyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgIGxpbmVCdWZmZXIgPSBsaW5lcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICBsYXRlc3RWYWx1ZSA9IHBhcnNlSW50KGxpbmVzLnBvcCgpLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgcG9ydC5yZWFkYWJsZVxuICAgICAgICAgICAgICAgICAgLnBpcGVUaHJvdWdoKG5ldyBUZXh0RGVjb2RlclN0cmVhbSgpKVxuICAgICAgICAgICAgICAgICAgLnBpcGVUbyhhcHBlbmRTdHJlYW0se3ByZXZlbnRDbG9zZTp0cnVlLCBwcmV2ZW50Q2FuY2VsOnRydWV9KTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHVuc3Vic2NyaWJlU2VyaWFsKCl7XG4gICAgICAgICAgICAgICAgICAgIHBvcnQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcG9ydCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgc3RvcFNlcmlhbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCB1bnN1YnNjcmliZVNlcmlhbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHVuc3Vic2NyaWJlU2VyaWFsKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbm5lY3RCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbmRlckRlbW8oKSB7XG4gICAgICAgICAgICBjb25zdCByYWJiaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZGEnKTtcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBNYXRoLmZsb29yKGxhdGVzdFZhbHVlIC8gMTAyMyAqIDEwMCk7XG4gICAgICAgICAgICAvL2NvbnN0IHBlcmNlbnRhZ2VTdGF0dXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmaWdjYXB0aW9uIHNwYW4nKTtcbiAgICBcbiAgICAgICAgICAgIHJhYmJpdC5zdHlsZS5sZWZ0ID0gJ2NhbGMoJyArIHBlcmNlbnRhZ2UgKyAnJSAtIDJlbSknO1xuICAgICAgICAgICAgLy9wZXJjZW50YWdlU3RhdHVzLmlubmVyVGV4dCA9IHBlcmNlbnRhZ2U7XG4gICAgXG4gICAgICAgICAgICBpZiAoIXN0b3BTZXJpYWwpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyRGVtbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFzeW5jIF9kZW1vTGlnaHQoKXtcbiAgICAgICAgY29uc3QgYm9vID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbycpO1xuICAgICAgICB0aGlzLnNvY2tldC5vbignbGlnaHQnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UuaWxsdW1pbmFuY2UgPT09IDApe1xuICAgICAgICAgICAgICAgIGJvby5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGJvby5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2RlbW9NdXN0YWNoZSgpe1xuXG4gICAgICAgIGlmICghKCdGYWNlRGV0ZWN0b3InIGluIHdpbmRvdykpIHtcbiAgICAgICAgICAgIEZhY2VEZXRlY3RvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmFrZSBGYWNlIERldGVjdG9yIHVzZWQuLi4nKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkZXRlY3Q6IGFzeW5jIGZ1bmN0aW9uKCkgeyByZXR1cm4gW10gfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBjb25zdCBmYWNlRGV0ZWN0b3IgPSBuZXcgRmFjZURldGVjdG9yKHsgZmFzdE1vZGU6IHRydWUsIG1heERldGVjdGVkRmFjZXM6IDEgfSk7IC8vIEZhc3QgRGV0ZWN0aW9uXG4gICAgICAgIGxldCBmYWNlcyA9IFtdOyAvLyBGaXJzdCBpbml0aWFsaXNhdGlvbiB0byBiZSBzdXJlIHRvIG5vdCBoYXZlIGEgTlBFXG5cbiAgICAgICAgbGV0IGlzRGV0ZWN0aW5nRmFjZXMgPSBmYWxzZTtcblxuICAgICAgICAvLyB0aGlzLmVhc3RlckVnZyA9IGZhbHNlOyBOb3QgdXNlXG4gICAgICAgIGxldCBjb250ZXh0ID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcmF0aW8gPSAwO1xuICAgICAgICBsZXQgc3RvcERyYXcgPSBmYWxzZTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RhcnQtbXVzdGFjaGUnLCBhc3luYyAoKT0+e1xuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBnZXRVc2VyTWVkaWEoKSB7XG4gICAgICAgICAgICAgICAgLy8gR3JhYiBjYW1lcmEgc3RyZWFtLlxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0ge1xuICAgICAgICAgICAgICAgICAgICB2aWRlbzoge1xuICAgICAgICAgICAgICAgICAgICBmYWNpbmdNb2RlOiAndXNlcicsIC8vIFRvIGJlIHN1cmUgdG8gdXNlIHRoZSBmcm9udCBjYW1lcmEgZm9yIHNtYXJ0cGhvbmVzICFcbiAgICAgICAgICAgICAgICAgICAgZnJhbWVSYXRlOiA2MCwgLy8gVG8gYmUgc3VyZSB0byBoYXZlIGEgaGlnaCByYXRlIG9mIGltYWdlc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gYXdhaXQgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpO1xuICAgICAgICAgICAgICAgIC8vIFdlIHN0YXJ0cyB0aGUgdmlkZW9cbiAgICAgICAgICAgICAgICBhd2FpdCB2aWRlby5wbGF5KCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFRoZSBjYW52YXMgdGFrZSB0aGUgc2l6ZSBvZiB0aGUgc2NyZWVuXG4gICAgICAgICAgICAgICAgY29uc3QgZGVtb0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vLW11c3RhY2hlJyk7XG4gICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGRlbW9EaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGRlbW9EaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgICAgICAgICAgLy8gSEFDSzogRmFjZSBEZXRlY3RvciBkb2Vzbid0IGFjY2VwdCBjYW52YXMgd2hvc2Ugd2lkdGggaXMgb2RkLlxuICAgICAgICAgICAgICAgIGlmIChjYW52YXMud2lkdGggJSAyID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLndpZHRoICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgLy8gUmF0aW8gdXNlIHRvIGRldGVybWluZSB0aGUgcmVuZGVyaW5nIG9mIHZpZGVvIGluIGNhbnZhc1xuICAgICAgICAgICAgICAgIC8vIFdlIHRha2UgdGhlIG1heCByYXRpbyBhbmQgYXBwbHkgaXQgdG8gY2FudmFzIGFmdGVyXG4gICAgICAgICAgICAgICAgLy8gV2lkdGggY291bGQgYmUgZGlmZXJlbnQgZnJvbSBjYW1lcmEgYW5kIHNjcmVlbiAhXG4gICAgICAgICAgICAgICAgcmF0aW8gPSBNYXRoLm1heChjYW52YXMud2lkdGggLyB2aWRlby52aWRlb1dpZHRoLCBjYW52YXMuaGVpZ2h0IC8gdmlkZW8udmlkZW9IZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmF0aW8gV2lkdGgnLCBjYW52YXMud2lkdGgsIHZpZGVvLnZpZGVvV2lkdGgsIGNhbnZhcy53aWR0aCAvIHZpZGVvLnZpZGVvV2lkdGgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSYXRpbyBIZWlnaHQnLCBjYW52YXMuaGVpZ2h0LCB2aWRlby52aWRlb0hlaWdodCwgY2FudmFzLmhlaWdodCAvIHZpZGVvLnZpZGVvSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1ggRGVzdCcsIGNhbnZhcy53aWR0aCAtIHZpZGVvLnZpZGVvV2lkdGggKiByYXRpbyk7XG4gICAgICAgICAgICAgICAgZHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGRyYXcoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3BEcmF3KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBUbyBiZSBzdXJlIHRvIGhhdmUgdGhlIG1pbmltdW0gZGVsYXkgYmV0d2VlbiBmcmFtZXNcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIERyYXcgdmlkZW8gZnJhbWUuXG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodmlkZW8sIC8vIFNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAoY2FudmFzLndpZHRoIC0gdmlkZW8udmlkZW9XaWR0aCAqIHJhdGlvKSAvIDIsIC8vIHggZGVzdCBpbiBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgLy8gPT4gdXNlIHRvIG1hbmFnZSBwb3J0cmFpdCB2cyBsYW5kc2NhcGVcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8geSBkZXN0IGluIGNhbnZhc1xuICAgICAgICAgICAgICAgICAgICB2aWRlby52aWRlb1dpZHRoICogcmF0aW8sIC8vIHdpZHRoIHZpZGVvIGluIGNhbnZhc1xuICAgICAgICAgICAgICAgICAgICB2aWRlby52aWRlb0hlaWdodCAqIHJhdGlvKTsgLy8gaGVpZ2h0IHZpZGVvIGluIGNhbnZhc1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIWlzRGV0ZWN0aW5nRmFjZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGV0ZWN0IGZhY2VzLlxuICAgICAgICAgICAgICAgICAgICBpc0RldGVjdGluZ0ZhY2VzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZmFjZURldGVjdG9yLmRldGVjdChjYW52YXMpLnRoZW4oKGZhY2VzQXJyYXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZXMgPSBmYWNlc0FycmF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZXRlY3RpbmdGYWNlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIERyYXcgbXVzdGFjaGUgYW5kIGhhdCBvbiBwcmV2aW91c2x5IGRldGVjdGVkIGZhY2UuXG4gICAgICAgICAgICAgICAgaWYgKGZhY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWNlID0gZmFjZXNbMF0uYm91bmRpbmdCb3g7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGdldCBhIGNsaWVudEJvdWRpbmdSZWN0IG9mIGZhY2UgcGxhY2VkIGluIHRoZSBpbWFnZSAhXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgYW5kIHdpZHRoIGdpdmUgdGhlIGhlaWdodCBhbmQgd2lkdGggaW4gcHggb2YgdGhlIGZhY2UgKGluIHRoZSBpbWFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQsIHRvcCwgYm90dG9tLCByaWdodCBnaXZlIHRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvZiB0aGUgZmFjZSAoaW4gdGhlIGltYWdlKVxuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShoYXQsIC8vIFNvdXJjZSBIYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UubGVmdCwgLy8geCBkZXN0IEhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2Ugc3RhcnQgZnJvbSB0aGUgbGVmdCBwb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5ib3R0b20gLSBmYWNlLmhlaWdodCAqIDMgLyA0IC0gaGF0LmhlaWdodCAqIGZhY2Uud2lkdGggLyBoYXQud2lkdGgsIC8vIFkgZGVzdCBIYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMvNCBvZiB0aGUgZmFjZSBoZWlnaHQgLSBoZWlnaHQgb2YgaGF0IGFwcGx5IHRvIHJhdGlvIG9mIHRoZSBmYWNlIHdpZHRoICFcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2Uud2lkdGgsIC8vIHdpZHRoIG9mIGhhdCBpbiBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIHRha2UgdGhlIGZhY2Ugd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhdC5oZWlnaHQgKiBmYWNlLndpZHRoIC8gaGF0LndpZHRoIC8vIGhlaWdodCBvZiBoYXQgYXBwbHkgdG8gcmF0aW8gb2YgdGhlIGZhY2Ugd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UobXVzdGFjaGUsIC8vIFNvdXJjZSBNdXN0YWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZS5sZWZ0ICsgZmFjZS53aWR0aCAvIDQsIC8vIFggZGVzdCBtdXN0YWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSAvIDRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UudG9wICsgZmFjZS5oZWlnaHQgKiAzIC8gNSwgLy8gWSBkZXN0IG11c3RhY2hlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAzLzQgb2YgdGhlIGZhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2Uud2lkdGggLyAyLCAgLy8gd2lkdGggb2YgbXVzdGFjaGUgaW4gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbXVzdGFjaGUgd2lsbCB0YWtlIHRoZSBoYWxmIG9mIHRoZSBmYWNlIHdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICBtdXN0YWNoZS5oZWlnaHQgKiBmYWNlLndpZHRoIC8gMiAvIG11c3RhY2hlLndpZHRoIC8vIGhlaWdodCBvZiBtdXN0YWNoZSBpbiBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBtdXN0YWNoZSB3aWxsIHRha2UgdGhlIHJhdGlvIG9mIGhhbGYgdGhlIHdpZGh0IG9mIGZhY2UgZGl2aWRlIGJ5IG11c3RhY2hlIHdpZHRoIHRvIHJlc3BlY3QgcHJvcG9ydGlvbnNcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVuc3Vic2NyaWJlTXVzdGFjaGUoKXtcbiAgICAgICAgICAgICAgICBjb25zdCBzdHJlYW0gPSB2aWRlby5zcmNPYmplY3Q7XG4gICAgICAgICAgICAgICAgbGV0IHRyYWNrcyA9IHN0cmVhbS5nZXRUcmFja3MoKTtcbiAgICAgICAgICAgICAgICB0cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgICAgICAgICAgICAgdHJhY2suc3RvcCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgc3RvcERyYXcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCB1bnN1YnNjcmliZU11c3RhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCB1bnN1YnNjcmliZU11c3RhY2hlKTtcblxuICAgICAgICAgICAgIC8vIEdldCBlbGVtZW50cyBmcm9tIElkXG4gICAgICAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgIGNvbnN0IHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvJyk7XG4gICAgICAgICAgICAgY29uc3QgbXVzdGFjaGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVzdGFjaGUnKTtcbiAgICAgICAgICAgICBjb25zdCBoYXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGF0Jyk7XG4gXG4gICAgICAgICAgICAgLy9BZmZlY3QgdXJsIHRvIGltYWdlc1xuICAgICAgICAgICAgIGhhdC5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL2hhdC5wbmcnO1xuICAgICAgICAgICAgIG11c3RhY2hlLnNyYyA9ICcuL2Fzc2V0cy9pbWFnZXMvbXVzdGFjaGUucG5nJztcbiBcbiAgICAgICAgICAgICAvLyBJbm5lciBtZXRob2QgVXNlciBNZWRpYSAoZGlmZmVyZW50IGZyb20gcmVhbCB1c2VyIG1lZGlhIG1ldGhvZCAhKVxuICAgICAgICAgICAgIGF3YWl0IGdldFVzZXJNZWRpYSgpO1xuICAgICAgICB9KVxuICAgIH1cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTRlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5saW5lSGVpZ2h0ID0gTElORV9IRUlHSFQ7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxuICAgICAgICB9KTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG5cbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xuXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gIFJlYWQgRmlsZSBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdyZWFkLWZpbGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzI1MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMyMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNDAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBDcmVhdGUgRmlsZSBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjcmVhdGUtZmlsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzExMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE3MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyOTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICc1MDBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIFdyaXRlIEZpbGUgc3BhY2UgZXhwbGFuYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnd3JpdGUtZmlsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczMDBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNTAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBDb250YWN0IFBpY2tlciBGaWxlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2NvbnRhY3QnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxOTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxODBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnOTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczMjBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTQwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNjAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBORkMgUmVhZCBUYWdcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncmVhZC10YWcnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxOTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxODBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcyMjBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNjAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBORkMgV3JpdGUgVGFnXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3dyaXRlLXRhZycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzExMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzExMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNzBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczMzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNjAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBTZXJpYWxcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnc2VyaWFsJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzI5MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzM0MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIFNlbnNvcnMgaW50ZXJmYWNlXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3NlbnNvcnMtaW50ZXJmYWNlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjMwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjIwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzM0MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNzAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBTZW5zb3JzIExpZ2h0XG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3NlbnNvcnMtbGlnaHQnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNzBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxOTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNzAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG5cbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodEV2ZW50c1xufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50LmpzJztcbmltcG9ydCB7IERlbW9zIH0gZnJvbSAnLi9kZW1vcy5qcyc7XG5cblxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcblxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgICAgY29uc3QgaW5JZnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xuXG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcbiAgICAgICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKVxuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
