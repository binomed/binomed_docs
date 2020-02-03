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

        this.socketInit();
        this._fileDemo();
    }

    _createClass(Demos, [{
        key: 'socketInit',
        value: function socketInit() {
            try {
                var socket = io('http://localhost:9999');

                socket.emit('chat message', { test: 'test' });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQWEsSyxXQUFBLEs7QUFDVCxxQkFBYTtBQUFBOztBQUNULGFBQUssVUFBTDtBQUNBLGFBQUssU0FBTDtBQUNIOzs7O3FDQUVXO0FBQ1IsZ0JBQUc7QUFDQyxvQkFBTSxTQUFTLEdBQUcsdUJBQUgsQ0FBZjs7QUFFQSx1QkFBTyxJQUFQLENBQVksY0FBWixFQUE0QixFQUFDLE1BQUssTUFBTixFQUE1QjtBQUNILGFBSkQsQ0FJQyxPQUFNLENBQU4sRUFBUTtBQUNMLHdCQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0g7QUFDSjs7OzBDQUVnQjtBQUNiLGdCQUFHO0FBQUEsb0JBaUJnQixnQkFqQmhCLEdBaUJDLGVBQWUsZ0JBQWYsR0FBa0M7QUFDOUIsd0JBQU0sT0FBTztBQUNYLDhCQUFNLFVBREs7QUFFWCxpQ0FBUyxDQUFDO0FBQ1IseUNBQWEsV0FETDtBQUVSLHdDQUFZLENBQUMsSUFBRCxFQUFNLEtBQU4sQ0FGSjtBQUdSLHVDQUFXLENBQUMsWUFBRDtBQUhILHlCQUFEO0FBRkUscUJBQWI7QUFRQSwyQkFBTyxNQUFNLE9BQU8sdUJBQVAsQ0FBK0IsSUFBL0IsQ0FBYjtBQUNELGlCQTNCSjs7QUFBQSxvQkE2QmdCLFVBN0JoQixHQTZCQyxlQUFlLFVBQWYsQ0FBeUIsVUFBekIsRUFBcUMsUUFBckMsRUFBK0M7QUFDM0M7QUFDQSx3QkFBTSxTQUFTLE1BQU0sV0FBVyxZQUFYLEVBQXJCO0FBQ0E7QUFDQSwwQkFBTSxPQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLFFBQWhCLENBQU47QUFDQTtBQUNBLDBCQUFNLE9BQU8sS0FBUCxF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QWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBRUEsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYLGdCQUFJLCtCQUFKO0FBQ0EsZ0JBQUksWUFBSjtBQUNIO0FBRUo7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBakJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNsYXNzIERlbW9ze1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc29ja2V0SW5pdCgpO1xuICAgICAgICB0aGlzLl9maWxlRGVtbygpO1xuICAgIH1cblxuICAgIHNvY2tldEluaXQoKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgY29uc3Qgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6OTk5OScpO1xuICAgIFxuICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2NoYXQgbWVzc2FnZScsIHt0ZXN0Oid0ZXN0J30pO1xuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfZmlsZURlbW8oKXtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgbGV0IGZpbGVIYW5kbGU7XG4gICAgICAgICAgICBjb25zdCBidXRPcGVuRmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlLWNob29zZXInKTtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtZmlsZScpO1xuICAgICAgICAgICAgYnV0T3BlbkZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGZpbGVIYW5kbGUgPSBhd2FpdCB3aW5kb3cuY2hvb3NlRmlsZVN5c3RlbUVudHJpZXMoKTtcbiAgICAgICAgICAgICAgICAvL2ZpbGVIYW5kbGUgPSBhd2FpdCBnZXROZXdGaWxlSGFuZGxlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IGZpbGVIYW5kbGUuZ2V0RmlsZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgZWRpdEFyZWEudmFsdWUgPSBjb250ZW50cztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzYXZlRmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlLXNhdmUnKTtcbiAgICAgICAgICAgIHNhdmVGaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZUZpbGUoZmlsZUhhbmRsZSwgZWRpdEFyZWEudmFsdWUpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0TmV3RmlsZUhhbmRsZSgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRzID0ge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ3NhdmVGaWxlJyxcbiAgICAgICAgICAgICAgICAgIGFjY2VwdHM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGV4dCBmaWxlJyxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uczogWydtZCcsJ3R4dCddLFxuICAgICAgICAgICAgICAgICAgICBtaW1lVHlwZXM6IFsndGV4dC9wbGFpbiddLFxuICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgd2luZG93LmNob29zZUZpbGVTeXN0ZW1FbnRyaWVzKG9wdHMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHdyaXRlRmlsZShmaWxlSGFuZGxlLCBjb250ZW50cykge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIHdyaXRlciAocmVxdWVzdCBwZXJtaXNzaW9uIGlmIG5lY2Vzc2FyeSkuXG4gICAgICAgICAgICAgICAgY29uc3Qgd3JpdGVyID0gYXdhaXQgZmlsZUhhbmRsZS5jcmVhdGVXcml0ZXIoKTtcbiAgICAgICAgICAgICAgICAvLyBXcml0ZSB0aGUgZnVsbCBsZW5ndGggb2YgdGhlIGNvbnRlbnRzXG4gICAgICAgICAgICAgICAgYXdhaXQgd3JpdGVyLndyaXRlKDAsIGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAvLyBDbG9zZSB0aGUgZmlsZSBhbmQgd3JpdGUgdGhlIGNvbnRlbnRzIHRvIGRpc2tcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZXIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBNSU5fVE9QID0gJzEwMHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTRlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5saW5lSGVpZ2h0ID0gTElORV9IRUlHSFQ7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5GcmFnbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXG4gICAgICAgICAgICBmcmFnbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmZyYWdtZW50LnZpc2libGUnKVxuICAgICAgICB9KTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF91bnJlZ2lzdGVyRnJhZ21lbnRzKCkge1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRzaG93bicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG5cbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtcbiAgICBIaWdobGlnaHRDb2RlSGVscGVyXG59IGZyb20gJy4vaGVscGVyL2hpZ2hsaWdodENvZGVIZWxwZXIuanMnO1xuXG5jb25zdCBMSU5FX0hFSUdIVCA9IDEuMTU7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHVCA9IDAuNDtcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0RXZlbnRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gIFJlYWQgRmlsZSBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdyZWFkLWZpbGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTEwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzI1MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzMyMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNDAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8vICBDcmVhdGUgRmlsZSBzcGFjZSBleHBsYW5hdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjcmVhdGUtZmlsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzExMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE3MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyOTBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICc1MDBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc3MDBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gIFdyaXRlIEZpbGUgc3BhY2UgZXhwbGFuYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnd3JpdGUtZmlsZScsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6ICcwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICBsZWZ0TWFyZ2luOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgbGVmdE1hcmdpbjogJzUwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczMDBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnNTAwcHgnLFxuICAgICAgICAgICAgICAgIGxlZnRNYXJnaW46ICc1MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgXG5cbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICAgIEhpZ2hsaWdodEV2ZW50c1xufSBmcm9tICcuL2hpZ2hsaWdodEV2ZW50LmpzJztcbmltcG9ydCB7IERlbW9zIH0gZnJvbSAnLi9kZW1vcy5qcyc7XG5cblxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcblxuXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XG5cbiAgICAgICAgY29uc3QgaW5JZnJhbWUgPSB3aW5kb3cudG9wICE9IHdpbmRvdy5zZWxmO1xuXG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcbiAgICAgICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKVxuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
