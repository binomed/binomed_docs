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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQWEsSyxXQUFBLEs7QUFDVCxxQkFBYTtBQUFBOztBQUNULGFBQUssTUFBTCxHQUFjLEtBQUssVUFBTCxFQUFkO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsYUFBSyxZQUFMO0FBQ0EsYUFBSyxRQUFMO0FBQ0EsYUFBSyxXQUFMO0FBQ0g7Ozs7cUNBRVc7QUFDUixnQkFBRztBQUNDLHVCQUFPLEdBQUcsdUJBQUgsQ0FBUDtBQUVILGFBSEQsQ0FHQyxPQUFNLENBQU4sRUFBUTtBQUNMLHdCQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDSjs7OzBDQUVnQjtBQUNiLGdCQUFHO0FBQUEsb0JBaUJnQixnQkFqQmhCLEdBaUJDLGVBQWUsZ0JBQWYsR0FBa0M7QUFDOUIsd0JBQU0sT0FBTztBQUNYLDhCQUFNLFVBREs7QUFFWCxpQ0FBUyxDQUFDO0FBQ1IseUNBQWEsV0FETDtBQUVSLHdDQUFZLENBQUMsSUFBRCxFQUFNLEtBQU4sQ0FGSjtBQUdSLHVDQUFXLENBQUMsWUFBRDtBQUhILHlCQUFEO0FBRkUscUJBQWI7QUFRQSwyQkFBTyxNQUFNLE9BQU8sdUJBQVAsQ0FBK0IsSUFBL0IsQ0FBYjtBQUNELGlCQTNCSjs7QUFBQSxvQkE2QmdCLFVBN0JoQixHQTZCQyxlQUFlLFVBQWYsQ0FBeUIsVUFBekIsRUFBcUMsUUFBckMsRUFBK0M7QUFDM0M7QUFDQSx3QkFBTSxTQUFTLE1BQU0sV0FBVyxZQUFYLEVBQXJCO0FBQ0E7QUFDQSwwQkFBTSxPQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLFFBQWhCLENBQU47QUFDQTtBQUNBLDBCQUFNLE9BQU8s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TztBQUpSLFNBVlksRUFlWjtBQUNDLGlCQUFLLEdBRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FmWTtBQUhLLEtBQXhCOztBQTJCQTtBQUNBLFFBQUksd0NBQUosQ0FBd0I7QUFDcEIsZ0JBQVEsUUFEWTtBQUVwQjtBQUNBLHVCQUFlLENBQUM7QUFDWixpQkFBSyxLQURPO0FBRVosb0JBQVEsT0FGSTtBQUdaLHdCQUFZLE1BSEE7QUFJWixtQkFBTztBQUpLLFNBQUQsRUFLWjtBQUNDLGlCQUFLLE9BRE47QUFFQyxvQkFBUSxPQUZUO0FBR0Msd0JBQVksTUFIYjtBQUlDLG1CQUFPO0FBSlIsU0FMWSxFQVVaO0FBQ0MsaUJBQUssT0FETjtBQUVDLG9CQUFRLE1BRlQ7QUFHQyx3QkFBWSxNQUhiO0FBSUMsbUJBQU87QUFKUixTQVZZLEVBZVo7QUFDQyxpQkFBSyxPQUROO0FBRUMsb0JBQVEsT0FGVDtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBZlksRUFvQlo7QUFDQyxpQkFBSyxHQUROO0FBRUMsb0JBQVEsT0FGVDtBQUdDLHdCQUFZLE1BSGI7QUFJQyxtQkFBTztBQUpSLFNBcEJZO0FBSEssS0FBeEI7QUFpQ0gsQzs7O0FDM05MOztBQUVBOztBQUdBOztBQUdBLENBQUMsa0JBQWtCOztBQUdmLG1CQUFlLFFBQWYsR0FBMEI7O0FBRXRCLFlBQU0sV0FBVyxPQUFPLEdBQVAsSUFBYyxPQUFPLElBQXRDOztBQUVBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxnQkFBSSwrQkFBSjtBQUNBLGdCQUFJLFlBQUo7QUFDSDtBQUVKOztBQUlELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQWpCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBjbGFzcyBEZW1vc3tcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IHRoaXMuc29ja2V0SW5pdCgpO1xuICAgICAgICB0aGlzLl9maWxlRGVtbygpO1xuICAgICAgICB0aGlzLl9jb250YWN0RGVtbygpO1xuICAgICAgICB0aGlzLl9uZmNEZW1vKCk7XG4gICAgICAgIHRoaXMuX2RlbW9TZXJpYWwoKTtcbiAgICB9XG5cbiAgICBzb2NrZXRJbml0KCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIHJldHVybiBpbygnaHR0cDovL2xvY2FsaG9zdDo5OTk5Jyk7XG4gICAgXG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF9maWxlRGVtbygpe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBsZXQgZmlsZUhhbmRsZTtcbiAgICAgICAgICAgIGNvbnN0IGJ1dE9wZW5GaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtY2hvb3NlcicpO1xuICAgICAgICAgICAgY29uc3QgZWRpdEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1maWxlJyk7XG4gICAgICAgICAgICBidXRPcGVuRmlsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZmlsZUhhbmRsZSA9IGF3YWl0IHdpbmRvdy5jaG9vc2VGaWxlU3lzdGVtRW50cmllcygpO1xuICAgICAgICAgICAgICAgIC8vZmlsZUhhbmRsZSA9IGF3YWl0IGdldE5ld0ZpbGVIYW5kbGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgZmlsZUhhbmRsZS5nZXRGaWxlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0QXJlYS52YWx1ZSA9IGNvbnRlbnRzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNhdmVGaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtc2F2ZScpO1xuICAgICAgICAgICAgc2F2ZUZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZShmaWxlSGFuZGxlLCBlZGl0QXJlYS52YWx1ZSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiBnZXROZXdGaWxlSGFuZGxlKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc2F2ZUZpbGUnLFxuICAgICAgICAgICAgICAgICAgYWNjZXB0czogW3tcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUZXh0IGZpbGUnLFxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zOiBbJ21kJywndHh0J10sXG4gICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlczogWyd0ZXh0L3BsYWluJ10sXG4gICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB3aW5kb3cuY2hvb3NlRmlsZVN5c3RlbUVudHJpZXMob3B0cyk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gd3JpdGVGaWxlKGZpbGVIYW5kbGUsIGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgd3JpdGVyIChyZXF1ZXN0IHBlcm1pc3Npb24gaWYgbmVjZXNzYXJ5KS5cbiAgICAgICAgICAgICAgICBjb25zdCB3cml0ZXIgPSBhd2FpdCBmaWxlSGFuZGxlLmNyZWF0ZVdyaXRlcigpO1xuICAgICAgICAgICAgICAgIC8vIFdyaXRlIHRoZSBmdWxsIGxlbmd0aCBvZiB0aGUgY29udGVudHNcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZXIud3JpdGUoMCwgY29udGVudHMpO1xuICAgICAgICAgICAgICAgIC8vIENsb3NlIHRoZSBmaWxlIGFuZCB3cml0ZSB0aGUgY29udGVudHMgdG8gZGlza1xuICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlci5jbG9zZSgpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX2NvbnRhY3REZW1vKCl7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtaWNvbicpO1xuICAgICAgICBjb25zdCBjb250YWN0TmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LW5hbWUnKTtcbiAgICAgICAgY29uc3QgY29udGFjdFRlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LXRlbCcpO1xuICAgICAgICBjb25zdCBjb250YWN0RW1haWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1lbWFpbCcpO1xuICAgICAgICBjb25zdCBjb250YWN0QWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LWFkZHJlc3MnKTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oJ2NvbnRhY3RzJywgKGNvbnRhY3QpPT57XG4gICAgICAgICAgICBpZiAoY29udGFjdC5pY29uKXtcbiAgICAgICAgICAgICAgICBjb250YWN0SWNvbi5zcmMgPSBjb250YWN0Lmljb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihjb250YWN0Lm5hbWUpe1xuICAgICAgICAgICAgICAgIGNvbnRhY3ROYW1lLmlubmVySFRNTCA9IGNvbnRhY3QubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNvbnRhY3QudGVsICYmIGNvbnRhY3QudGVsLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIGNvbnRhY3RUZWwuaW5uZXJIVE1MID0gY29udGFjdC50ZWxbMF0uc3Vic3RyKDAsMykrJyoqICoqICoqICoqJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250YWN0LmVtYWlsICYmIGNvbnRhY3QuZW1haWwubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgY29udGFjdEVtYWlsLmlubmVySFRNTCA9IGNvbnRhY3QuZW1haWxbMF0uc3Vic3RyKDAsIDQpKycqKioqQGdtYWlsLmNvbSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGFjdC5hZGRyZXNzICYmIGNvbnRhY3QuYWRkcmVzcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBjb250YWN0QWRkcmVzcy5pbm5lckhUTUwgPSBjb250YWN0LmFkZHJlc3NbMF0uY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbnRhY3RzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX25mY0RlbW8oKXtcbiAgICAgICAgY29uc3QgbmZjVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZmMtdHlwZScpO1xuICAgICAgICBjb25zdCBuZmNEYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25mYy1kYXRhJyk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKCduZmMnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgbWVzc2FnZS5yZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgbmZjVHlwZS5pbm5lckhUTUwgPSByZWNvcmQucmVjb3JkVHlwZTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlY29yZC5yZWNvcmRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgICAgICAgICAgbmZjRGF0YS5pbm5lckhUTUwgPSBgJHtyZWNvcmQuZGF0YX0gKCR7cmVjb3JkLmxhbmd9KWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ1cmxcIjpcbiAgICAgICAgICAgICAgICAgICAgbmZjRGF0YS5pbm5lckhUTUwgPSBgJHtyZWNvcmQuZGF0YX1gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBuZmNEYXRhLmlubmVySFRNTCA9ICdOb3QgaW1wbGVtZW50ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIF9kZW1vU2VyaWFsKCl7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAoJ2Nvbm5lY3QtYnV0dG9uJyk7XG4gICAgICAgIGxldCBwb3J0O1xuICAgICAgICBsZXQgbGluZUJ1ZmZlciA9ICcnO1xuICAgICAgICBsZXQgc3RvcFNlcmlhbCA9IHRydWU7XG4gICAgICAgIGxldCBsYXRlc3RWYWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKCdzZXJpYWwnIGluIG5hdmlnYXRvcikge1xuICAgICAgICAgICAgY29ubmVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RvcFNlcmlhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlbmRlckRlbW8oKVxuICAgICAgICAgICAgICAgIHBvcnQgPSBhd2FpdCBuYXZpZ2F0b3Iuc2VyaWFsLnJlcXVlc3RQb3J0KHt9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBwb3J0Lm9wZW4oeyBiYXVkcmF0ZTogOTYwMCB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgYXBwZW5kU3RyZWFtID0gbmV3IFdyaXRhYmxlU3RyZWFtKHtcbiAgICAgICAgICAgICAgICAgIHdyaXRlKGNodW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVCdWZmZXIgKz0gY2h1bms7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgbGluZXMgPSBsaW5lQnVmZmVyLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGluZUJ1ZmZlciA9IGxpbmVzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgIGxhdGVzdFZhbHVlID0gcGFyc2VJbnQobGluZXMucG9wKCkudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBwb3J0LnJlYWRhYmxlXG4gICAgICAgICAgICAgICAgICAucGlwZVRocm91Z2gobmV3IFRleHREZWNvZGVyU3RyZWFtKCkpXG4gICAgICAgICAgICAgICAgICAucGlwZVRvKGFwcGVuZFN0cmVhbSx7cHJldmVudENsb3NlOnRydWUsIHByZXZlbnRDYW5jZWw6dHJ1ZX0pO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gdW5zdWJzY3JpYmVTZXJpYWwoKXtcbiAgICAgICAgICAgICAgICAgICAgcG9ydC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBwb3J0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBzdG9wU2VyaWFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIHVuc3Vic2NyaWJlU2VyaWFsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgdW5zdWJzY3JpYmVTZXJpYWwpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29ubmVjdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyRGVtbygpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhYmJpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5kYScpO1xuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IE1hdGguZmxvb3IobGF0ZXN0VmFsdWUgLyAxMDIzICogMTAwKTtcbiAgICAgICAgICAgIC8vY29uc3QgcGVyY2VudGFnZVN0YXR1cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2ZpZ2NhcHRpb24gc3BhbicpO1xuICAgIFxuICAgICAgICAgICAgcmFiYml0LnN0eWxlLmxlZnQgPSAnY2FsYygnICsgcGVyY2VudGFnZSArICclIC0gMmVtKSc7XG4gICAgICAgICAgICAvL3BlcmNlbnRhZ2VTdGF0dXMuaW5uZXJUZXh0ID0gcGVyY2VudGFnZTtcbiAgICBcbiAgICAgICAgICAgIGlmICghc3RvcFNlcmlhbCl7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJEZW1vKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1JTl9UT1AgPSAnMTAwcHgnO1xuY29uc3QgTElORV9IRUlHSFQgPSAnMS4xNGVtJztcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAga2V5RWx0LFxuICAgICAgICBwb3NpdGlvbkFycmF5XG4gICAgfSkge1xuICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGhpZ2hsaWdodC0ke2tleUVsdH1gKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcbiAgICAgICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoYHN0b3AtY29kZS0ke2tleUVsdH1gLCB0aGlzLl91bnJlZ2lzdGVyRnJhZ21lbnRzLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9wcm9ncmVzc0ZyYWdtZW50KGV2ZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0SW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgLy8gT24gcmVzZXQgbGVzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gcHJvcGVydGllcyA/IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpIDogW107XG4gICAgICAgICAgICBjb25zdCBhcmVhID0ge307XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkxpbmVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ25iQ29scyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wTWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3dpZHRoJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi50b3BNYXJnaW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24ubmJMaW5lcyA9PT0gdW5kZWZpbmVkICYmIGFyZWEuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmxpbmUgPT09IHVuZGVmaW5lZCAmJiBhcmVhLnRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iQ29scyA9PT0gdW5kZWZpbmVkICYmIGFyZWEud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLmNvbCA9PT0gdW5kZWZpbmVkICYmIGFyZWEubGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWx0SGlnbGlnaHQuYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmxpbmVIZWlnaHQgPSBMSU5FX0hFSUdIVDtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImluaXRcIixcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXG4gICAgICAgIH0pO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyc7XG5cbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdUID0gMC40O1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRFdmVudHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyAgUmVhZCBGaWxlIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ3JlYWQtZmlsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjUwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzIwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIENyZWF0ZSBGaWxlIHNwYWNlIGV4cGxhbmF0aW9uXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcbiAgICAgICAgICAgIGtleUVsdDogJ2NyZWF0ZS1maWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzgwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzUwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuICAgICAgICAvLyAgV3JpdGUgRmlsZSBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd3cml0ZS1maWxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTkwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTgwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc1MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIENvbnRhY3QgUGlja2VyIEZpbGUgZXhwbGFuYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY29udGFjdCcsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzM1MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIE5GQyBSZWFkIFRhZ1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdyZWFkLXRhZycsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzIyMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIE5GQyBXcml0ZSBUYWdcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnd3JpdGUtdGFnJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE3MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMzMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIFNlcmlhbFxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdzZXJpYWwnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxODBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICcxNzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMjkwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMzQwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzQwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzAnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzcwMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgIFxuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRFdmVudHNcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XG5pbXBvcnQgeyBEZW1vcyB9IGZyb20gJy4vZGVtb3MuanMnO1xuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblxuICAgICAgICBpZiAoIWluSWZyYW1lKSB7XG4gICAgICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKClcbiAgICAgICAgICAgIG5ldyBEZW1vcygpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XG59KSgpOyJdfQ==
