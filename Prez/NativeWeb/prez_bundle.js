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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQWEsSyxXQUFBLEs7QUFDVCxxQkFBYTtBQUFBOztBQUNULGFBQUssTUFBTCxHQUFjLEtBQUssVUFBTCxFQUFkO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsYUFBSyxZQUFMO0FBQ0EsYUFBSyxRQUFMO0FBQ0g7Ozs7cUNBRVc7QUFDUixnQkFBRztBQUNDLHVCQUFPLEdBQUcsdUJBQUgsQ0FBUDtBQUVILGFBSEQsQ0FHQyxPQUFNLENBQU4sRUFBUTtBQUNMLHdCQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDSjs7OzBDQUVnQjtBQUNiLGdCQUFHO0FBQUEsb0JBaUJnQixnQkFqQmhCLEdBaUJDLGVBQWUsZ0JBQWYsR0FBa0M7QUFDOUIsd0JBQU0sT0FBTztBQUNYLDhCQUFNLFVBREs7QUFFWCxpQ0FBUyxDQUFDO0FBQ1IseUNBQWEsV0FETDtBQUVSLHdDQUFZLENBQUMsSUFBRCxFQUFNLEtBQU4sQ0FGSjtBQUdSLHVDQUFXLENBQUMsWUFBRDtBQUhILHlCQUFEO0FBRkUscUJBQWI7QUFRQSwyQkFBTyxNQUFNLE9BQU8sdUJBQVAsQ0FBK0IsSUFBL0IsQ0FBYjtBQUNELGlCQTNCSjs7QUFBQSxvQkE2QmdCLFVBN0JoQixHQTZCQyxlQUFlLFVBQWYsQ0FBeUIsVUFBekIsRUFBcUMsUUFBckMsRUFBK0M7QUFDM0M7QUFDQSx3QkFBTSxTQUFTLE1BQU0sV0FBVyxZQUFYLEVBQXJCO0FBQ0E7QUFDQSwwQkFBTSxPQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLFFBQWhCLENBQU47QUFDQTtBQUNBLDBCQUFNLE9BQU8sS0FBUCxFQUFOO0FBQ0Qs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QXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0FqQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgRGVtb3N7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSB0aGlzLnNvY2tldEluaXQoKTtcbiAgICAgICAgdGhpcy5fZmlsZURlbW8oKTtcbiAgICAgICAgdGhpcy5fY29udGFjdERlbW8oKTtcbiAgICAgICAgdGhpcy5fbmZjRGVtbygpO1xuICAgIH1cblxuICAgIHNvY2tldEluaXQoKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgcmV0dXJuIGlvKCdodHRwOi8vbG9jYWxob3N0Ojk5OTknKTtcbiAgICBcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX2ZpbGVEZW1vKCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGxldCBmaWxlSGFuZGxlO1xuICAgICAgICAgICAgY29uc3QgYnV0T3BlbkZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1jaG9vc2VyJyk7XG4gICAgICAgICAgICBjb25zdCBlZGl0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWZpbGUnKTtcbiAgICAgICAgICAgIGJ1dE9wZW5GaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBmaWxlSGFuZGxlID0gYXdhaXQgd2luZG93LmNob29zZUZpbGVTeXN0ZW1FbnRyaWVzKCk7XG4gICAgICAgICAgICAgICAgLy9maWxlSGFuZGxlID0gYXdhaXQgZ2V0TmV3RmlsZUhhbmRsZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBmaWxlSGFuZGxlLmdldEZpbGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgICAgICAgICAgIGVkaXRBcmVhLnZhbHVlID0gY29udGVudHM7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc2F2ZUZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1zYXZlJyk7XG4gICAgICAgICAgICBzYXZlRmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGVGaWxlKGZpbGVIYW5kbGUsIGVkaXRBcmVhLnZhbHVlKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIGdldE5ld0ZpbGVIYW5kbGUoKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzYXZlRmlsZScsXG4gICAgICAgICAgICAgICAgICBhY2NlcHRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RleHQgZmlsZScsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnM6IFsnbWQnLCd0eHQnXSxcbiAgICAgICAgICAgICAgICAgICAgbWltZVR5cGVzOiBbJ3RleHQvcGxhaW4nXSxcbiAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHdpbmRvdy5jaG9vc2VGaWxlU3lzdGVtRW50cmllcyhvcHRzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiB3cml0ZUZpbGUoZmlsZUhhbmRsZSwgY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSB3cml0ZXIgKHJlcXVlc3QgcGVybWlzc2lvbiBpZiBuZWNlc3NhcnkpLlxuICAgICAgICAgICAgICAgIGNvbnN0IHdyaXRlciA9IGF3YWl0IGZpbGVIYW5kbGUuY3JlYXRlV3JpdGVyKCk7XG4gICAgICAgICAgICAgICAgLy8gV3JpdGUgdGhlIGZ1bGwgbGVuZ3RoIG9mIHRoZSBjb250ZW50c1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlci53cml0ZSgwLCBjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgLy8gQ2xvc2UgdGhlIGZpbGUgYW5kIHdyaXRlIHRoZSBjb250ZW50cyB0byBkaXNrXG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGVyLmNsb3NlKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfY29udGFjdERlbW8oKXtcbiAgICAgICAgY29uc3QgY29udGFjdEljb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1pY29uJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3ROYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtbmFtZScpO1xuICAgICAgICBjb25zdCBjb250YWN0VGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtdGVsJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RFbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LWVtYWlsJyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RBZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtYWRkcmVzcycpO1xuICAgICAgICB0aGlzLnNvY2tldC5vbignY29udGFjdHMnLCAoY29udGFjdCk9PntcbiAgICAgICAgICAgIGlmIChjb250YWN0Lmljb24pe1xuICAgICAgICAgICAgICAgIGNvbnRhY3RJY29uLnNyYyA9IGNvbnRhY3QuaWNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNvbnRhY3QubmFtZSl7XG4gICAgICAgICAgICAgICAgY29udGFjdE5hbWUuaW5uZXJIVE1MID0gY29udGFjdC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoY29udGFjdC50ZWwgJiYgY29udGFjdC50ZWwubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgY29udGFjdFRlbC5pbm5lckhUTUwgPSBjb250YWN0LnRlbFswXS5zdWJzdHIoMCwzKSsnKiogKiogKiogKionO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRhY3QuZW1haWwgJiYgY29udGFjdC5lbWFpbC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBjb250YWN0RW1haWwuaW5uZXJIVE1MID0gY29udGFjdC5lbWFpbFswXS5zdWJzdHIoMCwgNCkrJyoqKipAZ21haWwuY29tJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250YWN0LmFkZHJlc3MgJiYgY29udGFjdC5hZGRyZXNzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIGNvbnRhY3RBZGRyZXNzLmlubmVySFRNTCA9IGNvbnRhY3QuYWRkcmVzc1swXS5jaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coY29udGFjdHMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBfbmZjRGVtbygpe1xuICAgICAgICBjb25zdCBuZmNUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25mYy10eXBlJyk7XG4gICAgICAgIGNvbnN0IG5mY0RhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmZjLWRhdGEnKTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oJ25mYycsIChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlY29yZCBvZiBtZXNzYWdlLnJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICBuZmNUeXBlLmlubmVySFRNTCA9IHJlY29yZC5yZWNvcmRUeXBlO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocmVjb3JkLnJlY29yZFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgICAgICAgICAgICBuZmNEYXRhLmlubmVySFRNTCA9IGAke3JlY29yZC5kYXRhfSAoJHtyZWNvcmQubGFuZ30pYDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInVybFwiOlxuICAgICAgICAgICAgICAgICAgICBuZmNEYXRhLmlubmVySFRNTCA9IGAke3JlY29yZC5kYXRhfWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIG5mY0RhdGEuaW5uZXJIVE1MID0gJ05vdCBpbXBsZW1lbnRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNGVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmxpbmVIZWlnaHQgPSBMSU5FX0hFSUdIVDtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgUmVhZCBGaWxlIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3JlYWQtZmlsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjUwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzIwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIENyZWF0ZSBGaWxlIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2NyZWF0ZS1maWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzUwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgV3JpdGUgRmlsZSBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd3cml0ZS1maWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTkwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc1MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIENvbnRhY3QgUGlja2VyIEZpbGUgZXhwbGFuYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29udGFjdCcsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzM1MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIE5GQyBSZWFkIFRhZ1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdyZWFkLXRhZycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzIyMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIE5GQyBXcml0ZSBUYWdcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnd3JpdGUtdGFnJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE3MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMzMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcblxuICAgIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHsgRGVtb3MgfSBmcm9tICcuL2RlbW9zLmpzJztcblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpXG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiXX0=
