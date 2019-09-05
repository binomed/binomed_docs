(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Demos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _applyCss = require('./helper/applyCss.js');

var _HelperJSInCSS = require('./helper/HelperJSInCSS.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demos = exports.Demos = function () {
    function Demos() {
        _classCallCheck(this, Demos);

        try {

            this._demoCssVar();
        } catch (error) {
            console.error(error);
        }
    }

    _createClass(Demos, [{
        key: '_demoCssVar',
        value: function _demoCssVar() {

            var helperColor = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#pure-css'), "--randomColor");
            var helperDependancy = new _HelperJSInCSS.HelperJsInCss(document.body.querySelector('#pure-css h1'), "--dependancy", false);

            var helperBg1 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg1'), '--url', false, ['--imgToUse']);
            var helperBg2 = new _HelperJSInCSS.HelperJsInCss(document.getElementById('bg2'), '--url', false, ['--imgToUse']);

            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), ':root{\n    --codemiror-size: 30px;\n}\n#pure-css{\n    background: var(--computeRandomColor);\n}\n#pure-css h1 {\n    color: var(--computeDependancy);\n}\n#pure-css .bg{\n    background-image:var(--computeUrl);\n}\n#pure-css #bg1 {\n    --imgToUse: var(--img1);\n}\n#pure-css #bg2 {\n    --imgToUse: var(--img2);\n}', false, [helperColor, helperDependancy, helperBg1, helperBg2]);
        }
    }]);

    return Demos;
}();

},{"./helper/HelperJSInCSS.js":2,"./helper/applyCss.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HelperJsInCss = exports.HelperJsInCss = function () {
    function HelperJsInCss(element, customProperty, loop, args) {
        _classCallCheck(this, HelperJsInCss);

        this.element = element;
        this.customProperty = customProperty;
        this.lastValue = undefined;
        this.loop = loop;
        this.args = args;
        if (loop) {
            window.requestAnimationFrame(this.checkElements.bind(this));
        } else {
            this.checkElements();
        }
    }

    _createClass(HelperJsInCss, [{
        key: "checkElements",
        value: function checkElements() {
            var _this = this;

            var value = window.getComputedStyle(this.element).getPropertyValue(this.customProperty);
            var computeArguments = [];
            if (this.args && this.args.length > 0) {
                this.args.forEach(function (argumentProperty) {
                    var argValue = window.getComputedStyle(_this.element).getPropertyValue(argumentProperty);
                    computeArguments.push(argValue);
                });
            }

            try {
                var evaluateValue = eval(value).apply(undefined, computeArguments);
                if (this.lastValue === evaluateValue) {
                    if (this.loop) {
                        window.requestAnimationFrame(this.checkElements.bind(this));
                    }
                    return;
                }

                this.lastValue = evaluateValue;
                var computeName = "--compute" + this.customProperty[2].toUpperCase() + this.customProperty.substring(3);
                this.element.style.setProperty(computeName, evaluateValue);
            } catch (err) {}

            if (this.loop) {
                window.requestAnimationFrame(this.checkElements.bind(this));
            }
        }
    }]);

    return HelperJsInCss;
}();

},{}],3:[function(require,module,exports){
'use strict';
'use stict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplyCss = exports.ApplyCss = function () {

    /**
     *
     * @param {HtmlElement} elt
     * @param {string} initialContent
     * @param {boolean} noTrim
     */
    function ApplyCss(elt, initialContent) {
        var _this = this;

        var noTrim = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var jsInCssHelpers = arguments[3];

        _classCallCheck(this, ApplyCss);

        this.codeMirrorCss = CodeMirror(elt, {
            value: initialContent,
            mode: 'css',
            lineNumbers: true,
            autoRefresh: true,
            fixedGutter: false,
            showCursorWhenSelecting: true,
            lineWrapping: true,
            scrollbarStyle: 'null',
            theme: 'idea'
        });

        var head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        this.nbElts = 0;
        this.noTrim = noTrim;

        this.style.type = 'text/css';
        if (this.style.styleSheet) {
            this.style.styleSheet.cssText = '';
        } else {
            this.style.appendChild(document.createTextNode(''));
        }
        head.appendChild(this.style);

        this.codeMirrorCss.setSize('100%', '100%');
        this.codeMirrorCss.on('change', function () {
            _this.applyCss(_this.codeMirrorCss.getValue());
            if (jsInCssHelpers && jsInCssHelpers.length > 0) {
                jsInCssHelpers.forEach(function (jsInCssHelper) {
                    return jsInCssHelper.checkElements();
                });
            }
        });
        this.applyCss(initialContent);
    }

    _createClass(ApplyCss, [{
        key: 'applyCss',
        value: function applyCss(value) {
            var _this2 = this;

            for (var i = 0; i < this.nbElts; i++) {
                this.style.sheet.deleteRule(0);
            }
            this.nbElts = 0;
            if (!this.noTrim) {
                value.split('}\n').map(function (str) {
                    return str.trim();
                }).forEach(function (selectorCss) {
                    try {
                        _this2.style.sheet.insertRule(selectorCss + '}');
                        _this2.nbElts++;
                    } catch (e) {
                        console.error(e);
                    }
                });
            } else {
                try {
                    this.style.sheet.insertRule(value);
                    this.nbElts++;
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }]);

    return ApplyCss;
}();

},{}],4:[function(require,module,exports){
'use strict';

var _demos = require('./demos.js');

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

        if (!inIframe) {
            new _demos.Demos();
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./demos.js":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvSGVscGVySlNJbkNTUy5qcyIsInNjcmlwdHMvaGVscGVyL2FwcGx5Q3NzLmpzIiwic2NyaXB0cy9wcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7OztBQUNBOztBQUdBOzs7O0lBRWEsSyxXQUFBLEs7QUFFVCxxQkFBYztBQUFBOztBQUNWLFlBQUk7O0FBRUEsaUJBQUssV0FBTDtBQUNILFNBSEQsQ0FHRSxPQUFPLEtBQVAsRUFBYztBQUNaLG9CQUFRLEtBQVIsQ0FBYyxLQUFkO0FBQ0g7QUFFSjs7OztzQ0FFYTs7QUFFVixnQkFBTSxjQUFjLElBQUksNEJBQUosQ0FBa0IsU0FBUyxJQUFULENBQWMsYUFBZCxDQUE0QixXQUE1QixDQUFsQixFQUE0RCxlQUE1RCxDQUFwQjtBQUNBLGdCQUFNLG1CQUFtQixJQUFJLDRCQUFKLENBQWtCLFNBQVMsSUFBVCxDQUFjLGFBQWQsQ0FBNEIsY0FBNUIsQ0FBbEIsRUFBK0QsY0FBL0QsRUFBK0UsS0FBL0UsQ0FBekI7O0FBRUEsZ0JBQU0sWUFBWSxJQUFJLDRCQUFKLENBQWtCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUFsQixFQUFrRCxPQUFsRCxFQUEyRCxLQUEzRCxFQUFrRSxDQUFDLFlBQUQsQ0FBbEUsQ0FBbEI7QUFDQSxnQkFBTSxZQUFZLElBQUksNEJBQUosQ0FBa0IsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBQWxCLEVBQWtELE9BQWxELEVBQTJELEtBQTNELEVBQWtFLENBQUMsWUFBRCxDQUFsRSxDQUFsQjs7QUFFQTtBQUNBLGdCQUFJLGtCQUFKLENBQ0ksU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQURKLGtVQW9CUixLQXBCUSxFQXFCUixDQUFDLFdBQUQsRUFBYyxnQkFBZCxFQUFnQyxTQUFoQyxFQUEyQyxTQUEzQyxDQXJCUTtB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TyxDQUFQLEVBQVU7QUFDUixnQ0FBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0osaUJBVEw7QUFVSCxhQVhELE1BV0s7QUFDRCxvQkFBSTtBQUNBLHlCQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQWpCLENBQTRCLEtBQTVCO0FBQ0EseUJBQUssTUFBTDtBQUNILGlCQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDUiw0QkFBUSxLQUFSLENBQWMsQ0FBZDtBQUNIO0FBQ0o7QUFFSjs7Ozs7OztBQ3ZFTDs7QUFFQTs7QUFLQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUV0QixZQUFNLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUF0Qzs7QUFFQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1gsZ0JBQUksWUFBSjtBQUNIO0FBRUo7O0FBSUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHtcbiAgICBBcHBseUNzc1xufSBmcm9tICcuL2hlbHBlci9hcHBseUNzcy5qcyc7XG5pbXBvcnQgeyBIZWxwZXJKc0luQ3NzfSBmcm9tICcuL2hlbHBlci9IZWxwZXJKU0luQ1NTLmpzJ1xuXG5leHBvcnQgY2xhc3MgRGVtb3Mge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXIoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhcigpIHtcblxuICAgICAgICBjb25zdCBoZWxwZXJDb2xvciA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI3B1cmUtY3NzJyksIFwiLS1yYW5kb21Db2xvclwiKTtcbiAgICAgICAgY29uc3QgaGVscGVyRGVwZW5kYW5jeSA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI3B1cmUtY3NzIGgxJyksIFwiLS1kZXBlbmRhbmN5XCIsIGZhbHNlKTtcblxuICAgICAgICBjb25zdCBoZWxwZXJCZzEgPSBuZXcgSGVscGVySnNJbkNzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmcxJyksICctLXVybCcsIGZhbHNlLCBbJy0taW1nVG9Vc2UnXSk7XG4gICAgICAgIGNvbnN0IGhlbHBlckJnMiA9IG5ldyBIZWxwZXJKc0luQ3NzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZzInKSwgJy0tdXJsJywgZmFsc2UsIFsnLS1pbWdUb1VzZSddKTtcblxuICAgICAgICAvKiogKi9cbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzJyksXG4gICAgICAgICAgICBgOnJvb3R7XG4gICAgLS1jb2RlbWlyb3Itc2l6ZTogMzBweDtcbn1cbiNwdXJlLWNzc3tcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jb21wdXRlUmFuZG9tQ29sb3IpO1xufVxuI3B1cmUtY3NzIGgxIHtcbiAgICBjb2xvcjogdmFyKC0tY29tcHV0ZURlcGVuZGFuY3kpO1xufVxuI3B1cmUtY3NzIC5iZ3tcbiAgICBiYWNrZ3JvdW5kLWltYWdlOnZhcigtLWNvbXB1dGVVcmwpO1xufVxuI3B1cmUtY3NzICNiZzEge1xuICAgIC0taW1nVG9Vc2U6IHZhcigtLWltZzEpO1xufVxuI3B1cmUtY3NzICNiZzIge1xuICAgIC0taW1nVG9Vc2U6IHZhcigtLWltZzIpO1xufWAsXG5mYWxzZSxcbltoZWxwZXJDb2xvciwgaGVscGVyRGVwZW5kYW5jeSwgaGVscGVyQmcxLCBoZWxwZXJCZzJdXG4gICAgICAgICk7XG4gICAgfVxuXG5cblxufSIsImV4cG9ydCBjbGFzcyBIZWxwZXJKc0luQ3Nze1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY3VzdG9tUHJvcGVydHksIGxvb3AsIGFyZ3Mpe1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgICAgIHRoaXMuY3VzdG9tUHJvcGVydHkgPSBjdXN0b21Qcm9wZXJ0eVxuICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICB0aGlzLmxvb3AgPSBsb29wXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3NcbiAgICAgICAgaWYgKGxvb3Ape1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNoZWNrRWxlbWVudHMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tFbGVtZW50cygpe1xuXG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUodGhpcy5jdXN0b21Qcm9wZXJ0eSlcbiAgICAgICAgY29uc3QgY29tcHV0ZUFyZ3VtZW50cyA9IFtdXG4gICAgICAgIGlmICh0aGlzLmFyZ3MgJiYgdGhpcy5hcmdzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgdGhpcy5hcmdzLmZvckVhY2goYXJndW1lbnRQcm9wZXJ0eSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJnVmFsdWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoYXJndW1lbnRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICBjb21wdXRlQXJndW1lbnRzLnB1c2goYXJnVmFsdWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICB0cnl7XG4gICAgICAgICAgICBjb25zdCBldmFsdWF0ZVZhbHVlID0gZXZhbCh2YWx1ZSkoLi4uY29tcHV0ZUFyZ3VtZW50cylcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RWYWx1ZSA9PT0gZXZhbHVhdGVWYWx1ZSl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9vcCl7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja0VsZW1lbnRzLmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSBldmFsdWF0ZVZhbHVlXG4gICAgICAgICAgICBjb25zdCBjb21wdXRlTmFtZSA9IGAtLWNvbXB1dGUke3RoaXMuY3VzdG9tUHJvcGVydHlbMl0udG9VcHBlckNhc2UoKX0ke3RoaXMuY3VzdG9tUHJvcGVydHkuc3Vic3RyaW5nKDMpfWBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShjb21wdXRlTmFtZSwgZXZhbHVhdGVWYWx1ZSlcbiAgICAgICAgfWNhdGNoKGVycil7fVxuXG4gICAgICAgIGlmICh0aGlzLmxvb3Ape1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrRWxlbWVudHMuYmluZCh0aGlzKSlcbiAgICAgICAgfVxuICAgIH1cblxufSIsIid1c2Ugc3RpY3QnXG5cbmV4cG9ydCBjbGFzcyBBcHBseUNzcyB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9UcmltXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCwgbm9UcmltID0gZmFsc2UsIGpzSW5Dc3NIZWxwZXJzKSB7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XG4gICAgICAgICAgICB2YWx1ZTogaW5pdGlhbENvbnRlbnQsXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1JlZnJlc2g6IHRydWUsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ2lkZWEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIHRoaXMubm9UcmltID0gbm9UcmltO1xuXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcblxuICAgICAgICB0aGlzLmNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIHRoaXMuY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHBseUNzcyh0aGlzLmNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICBpZiAoanNJbkNzc0hlbHBlcnMgJiYganNJbkNzc0hlbHBlcnMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAganNJbkNzc0hlbHBlcnMuZm9yRWFjaChqc0luQ3NzSGVscGVyID0+IGpzSW5Dc3NIZWxwZXIuY2hlY2tFbGVtZW50cygpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hcHBseUNzcyhpbml0aWFsQ29udGVudCk7XG4gICAgfVxuXG4gICAgYXBwbHlDc3ModmFsdWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0LmRlbGV0ZVJ1bGUoMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuICAgICAgICBpZiAoIXRoaXMubm9UcmltKXtcbiAgICAgICAgICAgIHZhbHVlLnNwbGl0KCd9XFxuJylcbiAgICAgICAgICAgICAgICAubWFwKHN0ciA9PiBzdHIudHJpbSgpKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHNlbGVjdG9yQ3NzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcyArICd9Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5iRWx0cysrO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgICBEZW1vc1xufSBmcm9tICcuL2RlbW9zLmpzJztcblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
