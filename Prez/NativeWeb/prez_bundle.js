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
        this._fileDemo();
        this._contactDemo();
        this._nfcDemo();
        this._demoSerial();
        this._demoLight();
        this._demoMustache();
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
                    var writer = await fileHandle.createWriter();
                    // Write the full length of the contents
                    await writer.write(0, contents);
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
            top: '350px',
            height: '110px',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQWEsSyxXQUFBLEs7QUFDVCxxQkFBYTtBQUFBOztBQUNULGFBQUssTUFBTCxHQUFjLEtBQUssVUFBTCxFQUFkO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsYUFBSyxZQUFMO0FBQ0EsYUFBSyxRQUFMO0FBQ0EsYUFBSyxXQUFMO0FBQ0EsYUFBSyxVQUFMO0FBQ0EsYUFBSyxhQUFMO0FBQ0g7Ozs7cUNBRVc7QUFDUixnQkFBRztBQUNDLHVCQUFPLEdBQUcsdUJBQUgsQ0FBUDtBQUVILGFBSEQsQ0FHQyxPQUFNLENBQU4sRUFBUTtBQUNMLHdCQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDSjs7OzBDQUVnQjtBQUNiLGdCQUFHO0FBQUEsb0JBaUJnQixnQkFqQmhCLEdBaUJDLGVBQWUsZ0JBQWYsR0FBa0M7QUFDOUIsd0JBQU0sT0FBTztBQUNYLDhCQUFNLFVBREs7QUFFWCxpQ0FBUyxDQUFDO0FBQ1IseUNBQWEsV0FETDtBQUVSLHdDQUFZLENBQUMsSUFBRCxFQUFNLEtBQU4sQ0FGSjtBQUdSLHVDQUFXLENBQUMsWUFBRDtBQUhILHlCQUFEO0FBRkUscUJBQWI7QUFRQSwyQkFBTyxNQUFNLE9BQU8sdUJBQVAsQ0FBK0IsSUFBL0IsQ0FBYjtBQUNELGlCQTNCSjs7QUFBQSxvQkE2QmdCLFVBN0JoQixHQTZCQyxlQUFlLFVBQWYsQ0FBeUIsVUFBekIsRUFBcUMsUUFBckMsRUFBK0M7QUFDM0M7QUFDQSx3QkFBTSxTQUFTLE1BQU0sV0FBVyxZQUFYLEVBQXJCO0FBQ0E7QUFDQSwwQkFBTSxPQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLFFB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OztBQUdBOztBQUdBLENBQUMsa0JBQWtCOztBQUdmLG1CQUFlLFFBQWYsR0FBMEI7O0FBRXRCLFlBQU0sV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXRDOztBQUVBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxnQkFBSSwrQkFBSjtBQUNBLGdCQUFJLFlBQUo7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQWpCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBjbGFzcyBEZW1vc3tcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IHRoaXMuc29ja2V0SW5pdCgpO1xuICAgICAgICB0aGlzLl9maWxlRGVtbygpO1xuICAgICAgICB0aGlzLl9jb250YWN0RGVtbygpO1xuICAgICAgICB0aGlzLl9uZmNEZW1vKCk7XG4gICAgICAgIHRoaXMuX2RlbW9TZXJpYWwoKTtcbiAgICAgICAgdGhpcy5fZGVtb0xpZ2h0KCk7XG4gICAgICAgIHRoaXMuX2RlbW9NdXN0YWNoZSgpO1xuICAgIH1cblxuICAgIHNvY2tldEluaXQoKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgcmV0dXJuIGlvKCdodHRwOi8vbG9jYWxob3N0Ojk5OTknKTtcbiAgICBcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX2ZpbGVEZW1vKCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGxldCBmaWxlSGFuZGxlO1xuICAgICAgICAgICAgY29uc3QgYnV0T3BlbkZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1jaG9vc2VyJyk7XG4gICAgICAgICAgICBjb25zdCBlZGl0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWZpbGUnKTtcbiAgICAgICAgICAgIGJ1dE9wZW5GaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBmaWxlSGFuZGxlID0gYXdhaXQgd2luZG93LmNob29zZUZpbGVTeXN0ZW1FbnRyaWVzKCk7XG4gICAgICAgICAgICAgICAgLy9maWxlSGFuZGxlID0gYXdhaXQgZ2V0TmV3RmlsZUhhbmRsZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBmaWxlSGFuZGxlLmdldEZpbGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgICAgICAgICAgIGVkaXRBcmVhLnZhbHVlID0gY29udGVudHM7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc2F2ZUZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1zYXZlJyk7XG4gICAgICAgICAgICBzYXZlRmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGVGaWxlKGZpbGVIYW5kbGUsIGVkaXRBcmVhLnZhbHVlKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGdldE5ld0ZpbGVIYW5kbGUoKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzYXZlRmlsZScsXG4gICAgICAgICAgICAgICAgICBhY2NlcHRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RleHQgZmlsZScsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnM6IFsnbWQnLCd0eHQnXSxcbiAgICAgICAgICAgICAgICAgICAgbWltZVR5cGVzOiBbJ3RleHQvcGxhaW4nXSxcbiAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHdpbmRvdy5jaG9vc2VGaWxlU3lzdGVtRW50cmllcyhvcHRzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB3cml0ZUZpbGUoZmlsZUhhbmRsZSwgY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSB3cml0ZXIgKHJlcXVlc3QgcGVybWlzc2lvbiBpZiBuZWNlc3NhcnkpLlxuICAgICAgICAgICAgICAgIGNvbnN0IHdyaXRlciA9IGF3YWl0IGZpbGVIYW5kbGUuY3JlYXRlV3JpdGVyKCk7XG4gICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGZ1bGwgbGVuZ3RoIG9mIHRoZSBjb250ZW50c1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlci53cml0ZSgwLCBjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgLy8gQ2xvc2UgdGhlIGZpbGUgYW5kIHdyaXRlIHRoZSBjb250ZW50cyB0byBkaXNrXG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGVyLmNsb3NlKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfY29udGFjdERlbW8oKXtcbiAgICAgICAgY29uc3QgY29udGFjdEljb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1pY29uJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3ROYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtbmFtZScpO1xuICAgICAgICBjb25zdCBjb250YWN0VGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtdGVsJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RFbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LWVtYWlsJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RBZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtYWRkcmVzcycpO1xuICAgICAgICB0aGlzLnNvY2tldC5vbignY29udGFjdHMnLCAoY29udGFjdCk9PntcbiAgICAgICAgICAgIGlmIChjb250YWN0Lmljb24pe1xuICAgICAgICAgICAgICAgIGNvbnRhY3RJY29uLnNyYyA9IGNvbnRhY3QuaWNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNvbnRhY3QubmFtZSl7XG4gICAgICAgICAgICAgICAgY29udGFjdE5hbWUuaW5uZXJIVE1MID0gY29udGFjdC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoY29udGFjdC50ZWwgJiYgY29udGFjdC50ZWwubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgY29udGFjdFRlbC5pbm5lckhUTUwgPSBjb250YWN0LnRlbFswXS5zdWJzdHIoMCwzKSsnKiogKiogKiogKionO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRhY3QuZW1haWwgJiYgY29udGFjdC5lbWFpbC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBjb250YWN0RW1haWwuaW5uZXJIVE1MID0gY29udGFjdC5lbWFpbFswXS5zdWJzdHIoMCwgNCkrJyoqKipAZ21haWwuY29tJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250YWN0LmFkZHJlc3MgJiYgY29udGFjdC5hZGRyZXNzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIGNvbnRhY3RBZGRyZXNzLmlubmVySFRNTCA9IGNvbnRhY3QuYWRkcmVzc1swXS5jaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coY29udGFjdHMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBfbmZjRGVtbygpe1xuICAgICAgICBjb25zdCBuZmNUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25mYy10eXBlJyk7XG4gICAgICAgIGNvbnN0IG5mY0RhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmZjLWRhdGEnKTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oJ25mYycsIChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlY29yZCBvZiBtZXNzYWdlLnJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICBuZmNUeXBlLmlubmVySFRNTCA9IHJlY29yZC5yZWNvcmRUeXBlO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocmVjb3JkLnJlY29yZFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgICAgICAgICAgICBuZmNEYXRhLmlubmVySFRNTCA9IGAke3JlY29yZC5kYXRhfSAoJHtyZWNvcmQubGFuZ30pYDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInVybFwiOlxuICAgICAgICAgICAgICAgICAgICBuZmNEYXRhLmlubmVySFRNTCA9IGAke3JlY29yZC5kYXRhfWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIG5mY0RhdGEuaW5uZXJIVE1MID0gJ05vdCBpbXBsZW1lbnRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXN5bmMgX2RlbW9TZXJpYWwoKXtcbiAgICAgICAgY29uc3QgY29ubmVjdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICgnY29ubmVjdC1idXR0b24nKTtcbiAgICAgICAgbGV0IHBvcnQ7XG4gICAgICAgIGxldCBsaW5lQnVmZmVyID0gJyc7XG4gICAgICAgIGxldCBzdG9wU2VyaWFsID0gdHJ1ZTtcbiAgICAgICAgbGV0IGxhdGVzdFZhbHVlID0gMDtcblxuICAgICAgICBpZiAoJ3NlcmlhbCcgaW4gbmF2aWdhdG9yKSB7XG4gICAgICAgICAgICBjb25uZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBzdG9wU2VyaWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVuZGVyRGVtbygpXG4gICAgICAgICAgICAgICAgcG9ydCA9IGF3YWl0IG5hdmlnYXRvci5zZXJpYWwucmVxdWVzdFBvcnQoe30pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHBvcnQub3Blbih7IGJhdWRyYXRlOiA5NjAwIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBhcHBlbmRTdHJlYW0gPSBuZXcgV3JpdGFibGVTdHJlYW0oe1xuICAgICAgICAgICAgICAgICAgd3JpdGUoY2h1bmspIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZUJ1ZmZlciArPSBjaHVuaztcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5lcyA9IGxpbmVCdWZmZXIuc3BsaXQoJ1xcbicpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lQnVmZmVyID0gbGluZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgbGF0ZXN0VmFsdWUgPSBwYXJzZUludChsaW5lcy5wb3AoKS50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHBvcnQucmVhZGFibGVcbiAgICAgICAgICAgICAgICAgIC5waXBlVGhyb3VnaChuZXcgVGV4dERlY29kZXJTdHJlYW0oKSlcbiAgICAgICAgICAgICAgICAgIC5waXBlVG8oYXBwZW5kU3RyZWFtLHtwcmV2ZW50Q2xvc2U6dHJ1ZSwgcHJldmVudENhbmNlbDp0cnVlfSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1bnN1YnNjcmliZVNlcmlhbCgpe1xuICAgICAgICAgICAgICAgICAgICBwb3J0LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIHBvcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0b3BTZXJpYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdW5zdWJzY3JpYmVTZXJpYWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCB1bnN1YnNjcmliZVNlcmlhbClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25uZWN0QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXJEZW1vKCkge1xuICAgICAgICAgICAgY29uc3QgcmFiYml0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmRhJyk7XG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gTWF0aC5mbG9vcihsYXRlc3RWYWx1ZSAvIDEwMjMgKiAxMDApO1xuICAgICAgICAgICAgLy9jb25zdCBwZXJjZW50YWdlU3RhdHVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZmlnY2FwdGlvbiBzcGFuJyk7XG4gICAgXG4gICAgICAgICAgICByYWJiaXQuc3R5bGUubGVmdCA9ICdjYWxjKCcgKyBwZXJjZW50YWdlICsgJyUgLSAyZW0pJztcbiAgICAgICAgICAgIC8vcGVyY2VudGFnZVN0YXR1cy5pbm5lclRleHQgPSBwZXJjZW50YWdlO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFzdG9wU2VyaWFsKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlckRlbW8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhc3luYyBfZGVtb0xpZ2h0KCl7XG4gICAgICAgIGNvbnN0IGJvbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib28nKTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oJ2xpZ2h0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLmlsbHVtaW5hbmNlID09PSAwKXtcbiAgICAgICAgICAgICAgICBib28uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBib28uY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIF9kZW1vTXVzdGFjaGUoKXtcblxuICAgICAgICBpZiAoISgnRmFjZURldGVjdG9yJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgICAgICBGYWNlRGV0ZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Zha2UgRmFjZSBEZXRlY3RvciB1c2VkLi4uJyk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGV0ZWN0OiBhc3luYyBmdW5jdGlvbigpIHsgcmV0dXJuIFtdIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgY29uc3QgZmFjZURldGVjdG9yID0gbmV3IEZhY2VEZXRlY3Rvcih7IGZhc3RNb2RlOiB0cnVlLCBtYXhEZXRlY3RlZEZhY2VzOiAxIH0pOyAvLyBGYXN0IERldGVjdGlvblxuICAgICAgICBsZXQgZmFjZXMgPSBbXTsgLy8gRmlyc3QgaW5pdGlhbGlzYXRpb24gdG8gYmUgc3VyZSB0byBub3QgaGF2ZSBhIE5QRVxuXG4gICAgICAgIGxldCBpc0RldGVjdGluZ0ZhY2VzID0gZmFsc2U7XG5cbiAgICAgICAgLy8gdGhpcy5lYXN0ZXJFZ2cgPSBmYWxzZTsgTm90IHVzZVxuICAgICAgICBsZXQgY29udGV4dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHJhdGlvID0gMDtcbiAgICAgICAgbGV0IHN0b3BEcmF3ID0gZmFsc2U7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXJ0LW11c3RhY2hlJywgYXN5bmMgKCk9PntcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0VXNlck1lZGlhKCkge1xuICAgICAgICAgICAgICAgIC8vIEdyYWIgY2FtZXJhIHN0cmVhbS5cbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICAgICAgICAgICAgZmFjaW5nTW9kZTogJ3VzZXInLCAvLyBUbyBiZSBzdXJlIHRvIHVzZSB0aGUgZnJvbnQgY2FtZXJhIGZvciBzbWFydHBob25lcyAhXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lUmF0ZTogNjAsIC8vIFRvIGJlIHN1cmUgdG8gaGF2ZSBhIGhpZ2ggcmF0ZSBvZiBpbWFnZXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIHZpZGVvLnNyY09iamVjdCA9IGF3YWl0IG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKTtcbiAgICAgICAgICAgICAgICAvLyBXZSBzdGFydHMgdGhlIHZpZGVvXG4gICAgICAgICAgICAgICAgYXdhaXQgdmlkZW8ucGxheSgpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBUaGUgY2FudmFzIHRha2UgdGhlIHNpemUgb2YgdGhlIHNjcmVlblxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbW9EaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtby1tdXN0YWNoZScpO1xuICAgICAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBkZW1vRGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSBkZW1vRGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICAgICAgICAgIC8vIEhBQ0s6IEZhY2UgRGV0ZWN0b3IgZG9lc24ndCBhY2NlcHQgY2FudmFzIHdob3NlIHdpZHRoIGlzIG9kZC5cbiAgICAgICAgICAgICAgICBpZiAoY2FudmFzLndpZHRoICUgMiA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIC8vIFJhdGlvIHVzZSB0byBkZXRlcm1pbmUgdGhlIHJlbmRlcmluZyBvZiB2aWRlbyBpbiBjYW52YXNcbiAgICAgICAgICAgICAgICAvLyBXZSB0YWtlIHRoZSBtYXggcmF0aW8gYW5kIGFwcGx5IGl0IHRvIGNhbnZhcyBhZnRlclxuICAgICAgICAgICAgICAgIC8vIFdpZHRoIGNvdWxkIGJlIGRpZmVyZW50IGZyb20gY2FtZXJhIGFuZCBzY3JlZW4gIVxuICAgICAgICAgICAgICAgIHJhdGlvID0gTWF0aC5tYXgoY2FudmFzLndpZHRoIC8gdmlkZW8udmlkZW9XaWR0aCwgY2FudmFzLmhlaWdodCAvIHZpZGVvLnZpZGVvSGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JhdGlvIFdpZHRoJywgY2FudmFzLndpZHRoLCB2aWRlby52aWRlb1dpZHRoLCBjYW52YXMud2lkdGggLyB2aWRlby52aWRlb1dpZHRoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmF0aW8gSGVpZ2h0JywgY2FudmFzLmhlaWdodCwgdmlkZW8udmlkZW9IZWlnaHQsIGNhbnZhcy5oZWlnaHQgLyB2aWRlby52aWRlb0hlaWdodCk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYIERlc3QnLCBjYW52YXMud2lkdGggLSB2aWRlby52aWRlb1dpZHRoICogcmF0aW8pO1xuICAgICAgICAgICAgICAgIGRyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBkcmF3KCkge1xuICAgICAgICAgICAgICAgIGlmIChzdG9wRHJhdyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVG8gYmUgc3VyZSB0byBoYXZlIHRoZSBtaW5pbXVtIGRlbGF5IGJldHdlZW4gZnJhbWVzXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBEcmF3IHZpZGVvIGZyYW1lLlxuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHZpZGVvLCAvLyBTb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgKGNhbnZhcy53aWR0aCAtIHZpZGVvLnZpZGVvV2lkdGggKiByYXRpbykgLyAyLCAvLyB4IGRlc3QgaW4gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgIC8vID0+IHVzZSB0byBtYW5hZ2UgcG9ydHJhaXQgdnMgbGFuZHNjYXBlXG4gICAgICAgICAgICAgICAgICAgIDAsIC8vIHkgZGVzdCBpbiBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8udmlkZW9XaWR0aCAqIHJhdGlvLCAvLyB3aWR0aCB2aWRlbyBpbiBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8udmlkZW9IZWlnaHQgKiByYXRpbyk7IC8vIGhlaWdodCB2aWRlbyBpbiBjYW52YXNcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCFpc0RldGVjdGluZ0ZhY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERldGVjdCBmYWNlcy5cbiAgICAgICAgICAgICAgICAgICAgaXNEZXRlY3RpbmdGYWNlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGZhY2VEZXRlY3Rvci5kZXRlY3QoY2FudmFzKS50aGVuKChmYWNlc0FycmF5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2VzID0gZmFjZXNBcnJheTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGV0ZWN0aW5nRmFjZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBEcmF3IG11c3RhY2hlIGFuZCBoYXQgb24gcHJldmlvdXNseSBkZXRlY3RlZCBmYWNlLlxuICAgICAgICAgICAgICAgIGlmIChmYWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFjZSA9IGZhY2VzWzBdLmJvdW5kaW5nQm94O1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBnZXQgYSBjbGllbnRCb3VkaW5nUmVjdCBvZiBmYWNlIHBsYWNlZCBpbiB0aGUgaW1hZ2UgIVxuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IGFuZCB3aWR0aCBnaXZlIHRoZSBoZWlnaHQgYW5kIHdpZHRoIGluIHB4IG9mIHRoZSBmYWNlIChpbiB0aGUgaW1hZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0LCB0b3AsIGJvdHRvbSwgcmlnaHQgZ2l2ZSB0aGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGZhY2UgKGluIHRoZSBpbWFnZSlcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaGF0LCAvLyBTb3VyY2UgSGF0XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlLmxlZnQsIC8vIHggZGVzdCBIYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHN0YXJ0IGZyb20gdGhlIGxlZnQgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UuYm90dG9tIC0gZmFjZS5oZWlnaHQgKiAzIC8gNCAtIGhhdC5oZWlnaHQgKiBmYWNlLndpZHRoIC8gaGF0LndpZHRoLCAvLyBZIGRlc3QgSGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAzLzQgb2YgdGhlIGZhY2UgaGVpZ2h0IC0gaGVpZ2h0IG9mIGhhdCBhcHBseSB0byByYXRpbyBvZiB0aGUgZmFjZSB3aWR0aCAhXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlLndpZHRoLCAvLyB3aWR0aCBvZiBoYXQgaW4gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSB0YWtlIHRoZSBmYWNlIHdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXQuaGVpZ2h0ICogZmFjZS53aWR0aCAvIGhhdC53aWR0aCAvLyBoZWlnaHQgb2YgaGF0IGFwcGx5IHRvIHJhdGlvIG9mIHRoZSBmYWNlIHdpZHRoXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKG11c3RhY2hlLCAvLyBTb3VyY2UgTXVzdGFjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UubGVmdCArIGZhY2Uud2lkdGggLyA0LCAvLyBYIGRlc3QgbXVzdGFjaGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgLyA0XG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlLnRvcCArIGZhY2UuaGVpZ2h0ICogMyAvIDUsIC8vIFkgZGVzdCBtdXN0YWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMy80IG9mIHRoZSBmYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlLndpZHRoIC8gMiwgIC8vIHdpZHRoIG9mIG11c3RhY2hlIGluIGNhbnZhc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG11c3RhY2hlIHdpbGwgdGFrZSB0aGUgaGFsZiBvZiB0aGUgZmFjZSB3aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgbXVzdGFjaGUuaGVpZ2h0ICogZmFjZS53aWR0aCAvIDIgLyBtdXN0YWNoZS53aWR0aCAvLyBoZWlnaHQgb2YgbXVzdGFjaGUgaW4gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbXVzdGFjaGUgd2lsbCB0YWtlIHRoZSByYXRpbyBvZiBoYWxmIHRoZSB3aWRodCBvZiBmYWNlIGRpdmlkZSBieSBtdXN0YWNoZSB3aWR0aCB0byByZXNwZWN0IHByb3BvcnRpb25zXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1bnN1YnNjcmliZU11c3RhY2hlKCl7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyZWFtID0gdmlkZW8uc3JjT2JqZWN0O1xuICAgICAgICAgICAgICAgIGxldCB0cmFja3MgPSBzdHJlYW0uZ2V0VHJhY2tzKCk7XG4gICAgICAgICAgICAgICAgdHJhY2tzLmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcbiAgICAgICAgICAgICAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2aWRlby5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHN0b3BEcmF3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdW5zdWJzY3JpYmVNdXN0YWNoZSk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdW5zdWJzY3JpYmVNdXN0YWNoZSk7XG5cbiAgICAgICAgICAgICAvLyBHZXQgZWxlbWVudHMgZnJvbSBJZFxuICAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgICAgICAgICAgICBjb25zdCB2aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlbycpO1xuICAgICAgICAgICAgIGNvbnN0IG11c3RhY2hlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211c3RhY2hlJyk7XG4gICAgICAgICAgICAgY29uc3QgaGF0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hhdCcpO1xuIFxuICAgICAgICAgICAgIC8vQWZmZWN0IHVybCB0byBpbWFnZXNcbiAgICAgICAgICAgICBoYXQuc3JjID0gJy4vYXNzZXRzL2ltYWdlcy9oYXQucG5nJztcbiAgICAgICAgICAgICBtdXN0YWNoZS5zcmMgPSAnLi9hc3NldHMvaW1hZ2VzL211c3RhY2hlLnBuZyc7XG4gXG4gICAgICAgICAgICAgLy8gSW5uZXIgbWV0aG9kIFVzZXIgTWVkaWEgKGRpZmZlcmVudCBmcm9tIHJlYWwgdXNlciBtZWRpYSBtZXRob2QgISlcbiAgICAgICAgICAgICBhd2FpdCBnZXRVc2VyTWVkaWEoKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbn0iLCIndXNlIHN0cmljdCdcblxuY29uc3QgTUlOX1RPUCA9ICcxMDBweCc7XG5jb25zdCBMSU5FX0hFSUdIVCA9ICcxLjE0ZW0nO1xuY29uc3QgQURESVRJT05OQUxfSEVJR0hUID0gJzAuNGVtJztcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0Q29kZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBrZXlFbHQsXG4gICAgICAgIHBvc2l0aW9uQXJyYXlcbiAgICB9KSB7XG4gICAgICAgIHRoaXMuZWx0SGlnbGlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgaGlnaGxpZ2h0LSR7a2V5RWx0fWApO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQXJyYXkgPSBwb3NpdGlvbkFycmF5O1xuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XG5cbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYGNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fbGlzdGVuRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0gbnVsbFxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RJbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbdGhpcy5sYXN0SW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdmcmFnbWVudHNob3duJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAvLyBPbiByZXNldCBsZXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iTGluZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2NvbCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3BNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnRNYXJnaW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2hlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLnRvcE1hcmdpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24udG9wTWFyZ2luID0gTUlOX1RPUDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkxpbmVzID09PSB1bmRlZmluZWQgJiYgYXJlYS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEuaGVpZ2h0ID0gTElORV9IRUlHSFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubGluZSA9PT0gdW5kZWZpbmVkICYmIGFyZWEudG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLnRvcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJDb2xzID09PSB1bmRlZmluZWQgJiYgYXJlYS53aWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24uY29sID09PSB1bmRlZmluZWQgJiYgYXJlYS5sZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQubGluZUhlaWdodCA9IExJTkVfSEVJR0hUO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcbiAgICAgICAgICAgIHR5cGU6IFwiaW5pdFwiLFxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcbiAgICAgICAgfSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcblxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vICBSZWFkIEZpbGUgc3BhY2UgZXhwbGFuYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncmVhZC1maWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzExMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcyNTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczMjBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzQwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgQ3JlYXRlIEZpbGUgc3BhY2UgZXhwbGFuYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY3JlYXRlLWZpbGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxNzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjkwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnNTAwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNzAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBXcml0ZSBGaWxlIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3dyaXRlLWZpbGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxOTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxODBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzAwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzUwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgQ29udGFjdCBQaWNrZXIgRmlsZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjb250YWN0JyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTkwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzkwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzUwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzExMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzYwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgTkZDIFJlYWQgVGFnXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3JlYWQtdGFnJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTkwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzYwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjIwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzYwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgTkZDIFdyaXRlIFRhZ1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd3cml0ZS10YWcnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTcwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzMwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzYwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgU2VyaWFsXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3NlcmlhbCcsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE3MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcyOTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNzBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczNDBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNDAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNzAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBTZW5zb3JzIGludGVyZmFjZVxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdzZW5zb3JzLWludGVyZmFjZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzIzMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzIyMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczNDBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzAwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgU2Vuc29ycyBMaWdodFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdzZW5zb3JzLWxpZ2h0JyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTkwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRFdmVudHNcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XG5pbXBvcnQgeyBEZW1vcyB9IGZyb20gJy4vZGVtb3MuanMnO1xuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XG4gICAgICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKClcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyJdfQ==
