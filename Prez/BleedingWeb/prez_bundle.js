(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Demos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _applyCss = require('./helper/applyCss.js');

var _applyJs = require('./helper/applyJs.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demos = exports.Demos = function () {
    function Demos() {
        _classCallCheck(this, Demos);

        try {

            this._demoCssVar();

            this._demoCssVarInJS();

            this._demoPartTheme();
        } catch (error) {
            console.error(error);
        }
    }

    _createClass(Demos, [{
        key: '_demoCssVar',
        value: function _demoCssVar() {
            /** */
            new _applyCss.ApplyCss(document.getElementById('codemirror-css'), '\n#render-element{\n--a-super-var: #FFF;\n}\n#render-element .text-1{\n\n}\n#render-element .text-2{\n\n}\n            ');
        }
    }, {
        key: '_demoCssVarInJS',
        value: function _demoCssVarInJS() {

            var indiceH = -1;
            var subscribe = false;
            var clientRect = undefined;
            var ghostParent = document.getElementById('demo-ghost-parent');

            function processMouse(event) {
                var deltaX = clientRect.width + clientRect.left - event.clientX;
                var median = clientRect.width / 2;
                var left = deltaX > 0 ? median - deltaX : median + -1 * deltaX;
                ghostParent.style.setProperty('--left-pos', left + 'px');
                // console.log(`deltaX: ${deltaX} / median : ${median} / width : ${width} / left : ${left}`)
            }

            Reveal.addEventListener('ghost-state', function (event) {
                subscribe = true;
                setTimeout(function () {
                    indiceH = Reveal.getIndices().h;
                    clientRect = ghostParent.getBoundingClientRect();
                    ghostParent.addEventListener('mousemove', processMouse);
                }, 500);
            });

            Reveal.addEventListener('slidechanged', function (event) {
                if (subscribe && indiceH != event.indexh) {
                    ghostParent.removeEventListener('mousemove', processMouse);
                }
            });

            new _applyCss.ApplyCss(document.getElementById('codemirror-css-in-js-css'), '#demo-ghost-parent {\n--left-pos:0;\n}\n#demo-ghost-parent .demo-shadow,\n#demo-ghost-parent .demo-ghost{\nleft: var(--left-pos);\n}');

            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-css-in-js-js'), 'javascript', 'document.addEventListener(\'mousemove\', (event) =>{\n    const deltaX = this.width - event.clientX;\n    const median = this.width / 2;\n    const ghostParent = document.getElementById(\'demo-ghost-parent\');\n    const left = event.clientX > median ? (event.clientX - median) : -1 * (median - event.clientX);\n\n    ghostParent.style.setProperty(\'--left-pos\', `${left}px`);\n});\n            ');
        }
    }, {
        key: '_demoPartTheme',
        value: function _demoPartTheme() {
            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-part-css'), 'css', 'x-rating::part(subject) {\n    padding: 4px;\n    min-width: 20px;\n    display: inline-block;\n}\n.uno:hover::part(subject) {\n    background: lightgreen;\n}\n.duo::part(subject) {\n    background: goldenrod;\n}\n.uno::part(rating-thumb-up) {\n    background: green;\n}\n.uno::part(rating-thumb-down) {\n    background: tomato;\n}\n.duo::part(rating-thumb-up) {\n    background: yellow;\n}\n.duo::part(rating-thumb-down) {\n    background: black;\n}\nx-rating::theme(thumb-up) {\n    border-radius: 8px;\n}\n');

            new _applyJs.ApplyCodeMiror(document.getElementById('codemirror-part-html'), 'text/html', '<x-thumbs>\n    #shadow-root\n    <div part="thumb-up">\uD83D\uDC4D</div>\n    <div part="thumb-down">\uD83D\uDC4E</div>\n</x-thumbs>\n<x-rating>\n    #shadow-root\n    <div part="subject"><slot></slot></div>\n    <x-thumbs part="* => rating-*"></x-thumbs>\n</x-rating>\n\n<x-rating class="uno">\u2764\uFE0F</x-rating>\n<x-rating class="duo">\uD83E\uDD37</x-rating>\n');
        }
    }]);

    return Demos;
}();

},{"./helper/applyCss.js":2,"./helper/applyJs.js":3}],2:[function(require,module,exports){
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
     */
    function ApplyCss(elt, initialContent) {
        var _this = this;

        _classCallCheck(this, ApplyCss);

        var codeMirrorCss = CodeMirror(elt, {
            value: initialContent,
            mode: 'css',
            lineNumber: 'true',
            fixedGutter: false,
            showCursorWhenSelecting: true,
            lineWrapping: true,
            scrollbarStyle: 'null',
            theme: 'solarized dark'
        });

        var head = document.head || document.getElementsByTagName('head')[0];
        this.style = document.createElement('style');
        this.nbElts = 0;

        this.style.type = 'text/css';
        if (this.style.styleSheet) {
            this.style.styleSheet.cssText = '';
        } else {
            this.style.appendChild(document.createTextNode(''));
        }
        head.appendChild(this.style);

        codeMirrorCss.setSize('100%', '100%');
        codeMirrorCss.on('change', function () {
            _this.applyCss(codeMirrorCss.getValue());
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
            value.split('}').map(function (str) {
                return str.trim();
            }).forEach(function (selectorCss) {
                try {
                    _this2.style.sheet.insertRule(selectorCss + '}');
                    _this2.nbElts++;
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }]);

    return ApplyCss;
}();

},{}],3:[function(require,module,exports){
'use strict';
'use stict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplyCodeMiror =

/**
 *
 * @param {HtmlElement} elt
 * @param {string} mode
 * @param {string} initialContent
 */
exports.ApplyCodeMiror = function ApplyCodeMiror(elt, mode, initialContent) {
    _classCallCheck(this, ApplyCodeMiror);

    var codeMirrorJS = CodeMirror(elt, {
        value: initialContent,
        mode: mode,
        lineNumber: 'true',
        fixedGutter: false,
        readOnly: true,
        showCursorWhenSelecting: true,
        lineWrapping: true,
        scrollbarStyle: 'null',
        theme: 'solarized dark'
    });

    codeMirrorJS.setSize('100%', '100%');
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_TOP = '90px';
var LINE_HEIGHT = '1.15em';
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

},{}],5:[function(require,module,exports){
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

    //  Css Variable Declaration
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'css-variable',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 4,
            width: '40%'
        }, {
            line: 5,
            nbLines: 4,
            width: '40%'
        }, {
            line: 9,
            nbLines: 4,
            width: '40%'
        }]
    });

    //  Css Variable Declaration in JS
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'css-variable-in-js',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: '100px',
            height: '260px',
            width: '60%'
        }, {
            top: '350px',
            height: '300px',
            width: '60%'
        }, {
            top: 0,
            height: '100%',
            width: '100%'
        }]
    });

    // ::Part
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'part',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            top: 0,
            height: '100%',
            width: '60%'
        }, {
            line: 3,
            nbLines: 4,
            width: '60%'
        }]
    });
};

},{"./helper/highlightCodeHelper.js":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XHost = exports.XRating = exports.XThumbs = exports.PartThemeElement = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _partTheme = require('./libs/part-theme.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartThemeElement = exports.PartThemeElement = function (_PartThemeMixin) {
  _inherits(PartThemeElement, _PartThemeMixin);

  function PartThemeElement() {
    _classCallCheck(this, PartThemeElement);

    return _possibleConstructorReturn(this, (PartThemeElement.__proto__ || Object.getPrototypeOf(PartThemeElement)).apply(this, arguments));
  }

  _createClass(PartThemeElement, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      if (!this.shadowRoot) {
        var template = this.constructor.template;
        if (template) {
          if (!this.constructor._templateElement) {
            this.constructor._templateElement = document.createElement('template');
            this.constructor._templateElement.innerHTML = template;
          }
          this.attachShadow({ mode: 'open' });
          var dom = document.importNode(this.constructor._templateElement.content, true);
          this.shadowRoot.appendChild(dom);
        }
      }
      _get(PartThemeElement.prototype.__proto__ || Object.getPrototypeOf(PartThemeElement.prototype), 'connectedCallback', this).call(this);
    }
  }], [{
    key: 'template',
    get: function get() {
      return '';
    }
  }]);

  return PartThemeElement;
}((0, _partTheme.PartThemeMixin)(HTMLElement));

var XThumbs = exports.XThumbs = function (_PartThemeElement) {
  _inherits(XThumbs, _PartThemeElement);

  function XThumbs() {
    _classCallCheck(this, XThumbs);

    return _possibleConstructorReturn(this, (XThumbs.__proto__ || Object.getPrototypeOf(XThumbs)).apply(this, arguments));
  }

  _createClass(XThumbs, null, [{
    key: 'template',
    get: function get() {
      return '\n        <div part="thumb-up">\uD83D\uDC4D</div>\n        <div part="thumb-down">\uD83D\uDC4E</div>\n      ';
    }
  }]);

  return XThumbs;
}(PartThemeElement);

customElements.define('x-thumbs', XThumbs);

var XRating = exports.XRating = function (_PartThemeElement2) {
  _inherits(XRating, _PartThemeElement2);

  function XRating() {
    _classCallCheck(this, XRating);

    return _possibleConstructorReturn(this, (XRating.__proto__ || Object.getPrototypeOf(XRating)).apply(this, arguments));
  }

  _createClass(XRating, null, [{
    key: 'template',
    get: function get() {
      return '\n        <style>\n          :host {\n            display: inline-block;\n          }\n          x-thumbs::part(thumb-up) {\n            border: 1px dotted green;\n            padding: 4px;\n            min-width: 20px;\n            display: inline-block;\n            background: blue;\n          }\n          x-thumbs::part(thumb-down) {\n            border: 1px dotted red;\n            padding: 4px;\n            min-width: 20px;\n            display: inline-block;\n          }\n        </style>\n        <div part="subject"><slot></slot></div>\n        <x-thumbs part="* => rating-*"></x-thumbs>\n      ';
    }
  }]);

  return XRating;
}(PartThemeElement);

customElements.define('x-rating', XRating);

var XHost = exports.XHost = function (_PartThemeElement3) {
  _inherits(XHost, _PartThemeElement3);

  function XHost() {
    _classCallCheck(this, XHost);

    return _possibleConstructorReturn(this, (XHost.__proto__ || Object.getPrototypeOf(XHost)).apply(this, arguments));
  }

  _createClass(XHost, null, [{
    key: 'template',
    get: function get() {
      return '\n        <style>\n          :host {\n            display: block;\n            border: 2px solid orange;\n          }\n          x-rating {\n            margin: 4px;\n          }\n          x-rating::part(subject) {\n            padding: 4px;\n            min-width: 20px;\n            display: inline-block;\n          }\n          x-rating {\n            --e1-part-subject-padding: 4px;\n          }\n          .uno:hover::part(subject) {\n            background: lightgreen;\n          }\n          .duo::part(subject) {\n            background: goldenrod;\n          }\n          .uno::part(rating-thumb-up) {\n            background: green;\n          }\n          .uno::part(rating-thumb-down) {\n            background: tomato;\n          }\n          .duo::part(rating-thumb-up) {\n            background: yellow;\n          }\n          .duo::part(rating-thumb-down) {\n            background: black;\n          }\n          x-rating::theme(thumb-up) {\n            border-radius: 8px;\n          }\n\n        </style>\n        <x-rating class="uno">\u2764\uFE0F</x-rating>\n        <br>\n        <x-rating class="duo">\uD83E\uDD37</x-rating>\n      ';
    }
  }]);

  return XHost;
}(PartThemeElement);

customElements.define('x-host', XHost);

},{"./libs/part-theme.js":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.applyPartTheme = applyPartTheme;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

var partDataKey = '__cssParts';
var partIdKey = '__partId';

/**
 * Converts any style elements in the shadowRoot to replace ::part/::theme
 * with custom properties used to transmit this data down the dom tree. Also
 * caches part metadata for later lookup.
 * @param {Element} element
 */

function initializeParts(element) {
  if (!element.shadowRoot) {
    element[partDataKey] = null;
    return;
  }
  Array.from(element.shadowRoot.querySelectorAll('style')).forEach(function (style) {
    var info = partCssToCustomPropCss(element, style.textContent);
    if (info.parts) {
      var _element$partDataKey;

      element[partDataKey] = element[partDataKey] || [];
      (_element$partDataKey = element[partDataKey]).push.apply(_element$partDataKey, _toConsumableArray(info.parts));
      style.textContent = info.css;
    }
  });
}

function ensurePartData(element) {
  if (!element.hasOwnProperty('__cssParts')) {
    initializeParts(element);
  }
}

function partDataForElement(element) {
  ensurePartData(element);
  return element[partDataKey];
}

// TODO(sorvell): brittle due to regex-ing css. Instead use a css parser.
/**
 * Turns css using `::part` into css using variables for those parts.
 * Also returns part metadata.
 * @param {Element} element
 * @param {string} cssText
 * @returns {Object} css: partified css, parts: array of parts of the form
 * {name, selector, props}
 * Example of part-ified css, given:
 * .foo::part(bar) { color: red }
 * output:
 * .foo { --e1-part-bar-color: red; }
 * where `e1` is a guid for this element.
 */
function partCssToCustomPropCss(element, cssText) {
  var parts = void 0;
  var css = cssText.replace(cssRe, function (m, selector, type, name, endSelector, propsStr) {
    parts = parts || [];
    var props = {};
    var propsArray = propsStr.split(/\s*;\s*/);
    propsArray.forEach(function (prop) {
      var s = prop.split(':');
      var name = s.shift().trim();
      var value = s.join(':');
      props[name] = value;
    });
    var id = partIdForElement(element);
    parts.push({ selector: selector, endSelector: endSelector, name: name, props: props, isTheme: type == theme });
    var partProps = '';
    for (var p in props) {
      partProps = partProps + '\n\t' + varForPart(id, name, p, endSelector) + ': ' + props[p] + ';';
    }
    return '\n' + (selector || '*') + ' {\n\t' + partProps.trim() + '\n}';
  });
  return { parts: parts, css: css };
}

// guid for element part scopes
var partId = 0;
function partIdForElement(element) {
  if (element[partIdKey] == undefined) {
    element[partIdKey] = partId++;
  }
  return element[partIdKey];
}

var theme = '::theme';
var cssRe = /\s*(.*)(::(?:part|theme))\(([^)]+)\)([^\s{]*)\s*{\s*([^}]*)\s*}/g;

// creates a custom property name for a part.
function varForPart(id, name, prop, endSelector) {
  return '--e' + id + '-part-' + name + '-' + prop + (endSelector ? '-' + endSelector.replace(/\:/g, '') : '');
}

/**
 * Produces a style using css custom properties to style ::part/::theme
 * for all the dom in the element's shadowRoot.
 * @param {Element} element
 */
function applyPartTheme(element) {
  if (element.shadowRoot) {
    var oldStyle = element.shadowRoot.querySelector('style[parts]');
    if (oldStyle) {
      oldStyle.parentNode.removeChild(oldStyle);
    }
  }
  var host = element.getRootNode().host;
  if (host) {
    // note: ensure host has part data so that elements that boot up
    // while the host is being connected can style parts.
    ensurePartData(host);
    var css = cssForElementDom(element);
    if (css) {
      var newStyle = document.createElement('style');
      newStyle.textContent = css;
      element.shadowRoot.appendChild(newStyle);
    }
  }
}

/**
 * Produces cssText a style element to apply part css to a given element.
 * The element's shadowRoot dom is scanned for nodes with a `part` attribute.
 * Then selectors are created matching the part attribute containing properties
 * with parts defined in the element's host.
 * The ancestor tree is traversed for forwarded parts and theme.
 * e.g.
 * [part="bar"] {
 *   color: var(--e1-part-bar-color);
 * }
 * @param {Element} element Element for which to apply part css
 */
function cssForElementDom(element) {
  ensurePartData(element);
  var id = partIdForElement(element);
  var partNodes = element.shadowRoot.querySelectorAll('[part]');
  var css = '';
  for (var i = 0; i < partNodes.length; i++) {
    var attr = partNodes[i].getAttribute('part');
    var partInfo = partInfoFromAttr(attr);
    css = css + '\n\t' + ruleForPartInfo(partInfo, attr, element);
  }
  return css;
}

/**
 * Creates a css rule that applies a part.
 * @param {*} partInfo Array of part info from part attribute
 * @param {*} attr Part attribute
 * @param {*} element Element within which the part exists
 * @returns {string} Text of the css rule of the form `selector { properties }`
 */
function ruleForPartInfo(partInfo, attr, element) {
  var text = '';
  partInfo.forEach(function (info) {
    if (!info.forward) {
      var props = propsForPart(info.name, element);
      if (props) {
        for (var bucket in props) {
          var propsBucket = props[bucket];
          var partProps = [];
          for (var p in propsBucket) {
            partProps.push(p + ': ' + propsBucket[p] + ';');
          }
          text = text + '\n[part="' + attr + '"]' + bucket + ' {\n\t' + partProps.join('\n\t') + '\n}';
        }
      }
    }
  });
  return text;
}

/**
 * Parses a part attribute into an array of part info
 * @param {*} attr Part attribute value
 * @returns {array} Array of part info objects of the form {name, foward}
 */
function partInfoFromAttr(attr) {
  var pieces = attr ? attr.split(/\s*,\s*/) : [];
  var parts = [];
  pieces.forEach(function (p) {
    var m = p ? p.match(/([^=\s]*)(?:\s*=>\s*(.*))?/) : [];
    if (m) {
      parts.push({ name: m[2] || m[1], forward: m[2] ? m[1] : null });
    }
  });
  return parts;
}

/**
 * For a given part name returns a properties object which sets any ancestor
 * provided part properties to the proper ancestor provided css variable name.
 * e.g.
 * color: `var(--e1-part-bar-color);`
 * @param {string} name Name of part
 * @param {Element} element Element within which dom with part exists
 * @param {boolean} requireTheme True if only ::theme should be collected.
 * @returns {object} Object of properties for the given part set to part variables
 * provided by the elements ancestors.
 */
function propsForPart(name, element, requireTheme) {
  var host = element && element.getRootNode().host;
  if (!host) {
    return;
  }
  // collect props from host element.
  var props = propsFromElement(name, host, requireTheme);
  // now recurse ancestors to find matching `theme` properties
  var themeProps = propsForPart(name, host, true);
  props = mixPartProps(props, themeProps);
  // now recurse ancestors to find *forwarded* part properties
  if (!requireTheme) {
    // forwarding: recurses up ancestor tree!
    var partInfo = partInfoFromAttr(element.getAttribute('part'));
    // {name, forward} where `*` can be included
    partInfo.forEach(function (info) {
      var catchAll = info.forward && info.forward.indexOf('*') >= 0;
      if (name == info.forward || catchAll) {
        var ancestorName = catchAll ? info.name.replace('*', name) : info.name;
        var forwarded = propsForPart(ancestorName, host);
        props = mixPartProps(props, forwarded);
      }
    });
  }

  return props;
}

/**
 * Collects css for the given name from the part data for the given
 * element.
 *
 * @param {string} name Name of part
 * @param {Element} element Element with part css/data.
 * @param {Boolean} requireTheme True if should only match ::theme
 * @returns {object} Object of properties for the given part set to part variables
 * provided by the element.
 */
function propsFromElement(name, element, requireTheme) {
  var props = void 0;
  var parts = partDataForElement(element);
  if (parts) {
    var id = partIdForElement(element);
    if (parts) {
      parts.forEach(function (part) {
        if (part.name == name && (!requireTheme || part.isTheme)) {
          props = addPartProps(props, part, id, name);
        }
      });
    }
  }
  return props;
}

/**
 * Add part css to the props object for the given part/name.
 * @param {object} props Object containing part css
 * @param {object} part Part data
 * @param {nmber} id element part id
 * @param {string} name name of part
 */
function addPartProps(props, part, id, name) {
  props = props || {};
  var bucket = part.endSelector || '';
  var b = props[bucket] = props[bucket] || {};
  for (var p in part.props) {
    b[p] = 'var(' + varForPart(id, name, p, part.endSelector) + ')';
  }
  return props;
}

function mixPartProps(a, b) {
  if (a && b) {
    for (var i in b) {
      // ensure storage exists
      if (!a[i]) {
        a[i] = {};
      }
      Object.assign(a[i], b[i]);
    }
  }
  return a || b;
}

/**
 * CustomElement mixin that can be applied to provide ::part/::theme support.
 * @param {*} superClass
 */
var PartThemeMixin = exports.PartThemeMixin = function PartThemeMixin(superClass) {

  return function (_superClass) {
    _inherits(PartThemeClass, _superClass);

    function PartThemeClass() {
      _classCallCheck(this, PartThemeClass);

      return _possibleConstructorReturn(this, (PartThemeClass.__proto__ || Object.getPrototypeOf(PartThemeClass)).apply(this, arguments));
    }

    _createClass(PartThemeClass, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var _this2 = this;

        if (_get(PartThemeClass.prototype.__proto__ || Object.getPrototypeOf(PartThemeClass.prototype), 'connectedCallback', this)) {
          _get(PartThemeClass.prototype.__proto__ || Object.getPrototypeOf(PartThemeClass.prototype), 'connectedCallback', this).call(this);
        }
        requestAnimationFrame(function () {
          return _this2._applyPartTheme();
        });
      }
    }, {
      key: '_applyPartTheme',
      value: function _applyPartTheme() {
        applyPartTheme(this);
      }
    }]);

    return PartThemeClass;
  }(superClass);
};

},{}],8:[function(require,module,exports){
'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';

var _highlightEvent = require('./highlightEvent.js');

var _demos = require('./demos.js');

var _componentsSample = require('./partTheme/components-sample.js');

(async function () {

    async function pageLoad() {

        var inIframe = window.top != window.self;

        if (!inIframe) {
            new _demos.Demos();
            new _highlightEvent.HighlightEvents();
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{"./demos.js":1,"./highlightEvent.js":5,"./partTheme/components-sample.js":6}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxkZW1vcy5qcyIsInNjcmlwdHNcXGhlbHBlclxcYXBwbHlDc3MuanMiLCJzY3JpcHRzXFxoZWxwZXJcXGFwcGx5SnMuanMiLCJzY3JpcHRzXFxoZWxwZXJcXGhpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzXFxoaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHNcXHBhcnRUaGVtZVxcY29tcG9uZW50cy1zYW1wbGUuanMiLCJzY3JpcHRzXFxwYXJ0VGhlbWVcXGxpYnNcXHBhcnQtdGhlbWUuanMiLCJzY3JpcHRzXFxwcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7OztBQUNBOztBQUdBOzs7O0lBSWEsSyxXQUFBLEs7QUFFVCxxQkFBYztBQUFBOztBQUNWLFlBQUk7O0FBRUEsaUJBQUssV0FBTDs7QUFFQSxpQkFBSyxlQUFMOztBQUVBLGlCQUFLLGNBQUw7QUFFSCxTQVJELENBUUUsT0FBTyxLQUFQLEVBQWM7QUFDWixvQkFBUSxLQUFSLENBQWMsS0FBZDtBQUNIO0FBRUo7Ozs7c0NBRWE7QUFDVjtBQUNBLG1DQUNJLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FESjtBQWNIOzs7MENBRWlCOztBQUVkLGdCQUFJLFVBQVUsQ0FBQyxDQUFmO0FBQ0EsZ0JBQUksWUFBWSxLQUFoQjtBQUNBLGdCQUFJLGFBQWEsU0FBakI7QUFDQSxnQkFBTSxjQUFjLFNBQVMsY0FBVCxDQUF3QixtQkFBeEIsQ0FBcEI7O0FBRUEscUJBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QjtBQUN6QixvQkFBTSxTQUFVLFdBQVcsS0FBWCxHQUFtQixXQUFXLElBQS9CLEdBQXVDLE1BQU0sT0FBNUQ7QUFDQSxvQkFBTSxTQUFTLFdBQVcsS0FBWCxHQUFtQixDQUFsQztBQUNBLG9CQUFNLE9BQU8sU0FBUyxDQUFULEdBQWMsU0FBUyxNQUF2QixHQUFrQyxT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LENBQXpCLEVBQTRCO0FBQzFCLE1BQUksS0FBSyxDQUFULEVBQVk7QUFDVixTQUFLLElBQUksQ0FBVCxJQUFjLENBQWQsRUFBaUI7QUFDZjtBQUNBLFVBQUksQ0FBQyxFQUFFLENBQUYsQ0FBTCxFQUFXO0FBQ1QsVUFBRSxDQUFGLElBQU8sRUFBUDtBQUNEO0FBQ0QsYUFBTyxNQUFQLENBQWMsRUFBRSxDQUFGLENBQWQsRUFBb0IsRUFBRSxDQUFGLENBQXBCO0FBQ0Q7QUFDRjtBQUNELFNBQU8sS0FBSyxDQUFaO0FBQ0Q7O0FBRUQ7Ozs7QUFJTyxJQUFJLDBDQUFpQixTQUFqQixjQUFpQixhQUFjOztBQUV4QztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMENBRXNCO0FBQUE7O0FBQ2xCLG9JQUE2QjtBQUMzQjtBQUNEO0FBQ0QsOEJBQXNCO0FBQUEsaUJBQU0sT0FBSyxlQUFMLEVBQU47QUFBQSxTQUF0QjtBQUNEO0FBUEg7QUFBQTtBQUFBLHdDQVNvQjtBQUNoQix1QkFBZSxJQUFmO0FBQ0Q7QUFYSDs7QUFBQTtBQUFBLElBQW9DLFVBQXBDO0FBZUQsQ0FqQk07OztBQ3RTUDs7QUFFQTs7QUFDQTs7QUFHQTs7QUFHQTs7QUFHQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUV0QixZQUFNLFdBQVcsT0FBTyxHQUFQLElBQWMsT0FBTyxJQUF0Qzs7QUFFQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1g7QUFDQTtBQUNIO0FBRUo7O0FBT0QsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBcEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHtcclxuICAgIEFwcGx5Q3NzXHJcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlDc3MuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgQXBwbHlDb2RlTWlyb3JcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUpzLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZW1vcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXJJbkpTKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFydFRoZW1lKCk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9Dc3NWYXIoKSB7XHJcbiAgICAgICAgLyoqICovXHJcbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcclxuICAgICAgICAgICAgYFxyXG4jcmVuZGVyLWVsZW1lbnR7XHJcbi0tYS1zdXBlci12YXI6ICNGRkY7XHJcbn1cclxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XHJcblxyXG59XHJcbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xyXG5cclxufVxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb0Nzc1ZhckluSlMoKSB7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2VIID0gLTE7XHJcbiAgICAgICAgbGV0IHN1YnNjcmliZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBjbGllbnRSZWN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IGdob3N0UGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tZ2hvc3QtcGFyZW50Jyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NNb3VzZShldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWx0YVggPSAoY2xpZW50UmVjdC53aWR0aCArIGNsaWVudFJlY3QubGVmdCkgLSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgICAgICBjb25zdCBtZWRpYW4gPSBjbGllbnRSZWN0LndpZHRoIC8gMjtcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGRlbHRhWCA+IDAgPyAobWVkaWFuIC0gZGVsdGFYKSA6IChtZWRpYW4gKyAoLTEgKiBkZWx0YVgpKTtcclxuICAgICAgICAgICAgZ2hvc3RQYXJlbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wb3MnLCBgJHtsZWZ0fXB4YCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBkZWx0YVg6ICR7ZGVsdGFYfSAvIG1lZGlhbiA6ICR7bWVkaWFufSAvIHdpZHRoIDogJHt3aWR0aH0gLyBsZWZ0IDogJHtsZWZ0fWApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZ2hvc3Qtc3RhdGUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VIID0gUmV2ZWFsLmdldEluZGljZXMoKS5oO1xyXG4gICAgICAgICAgICAgICAgY2xpZW50UmVjdCA9IGdob3N0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgZ2hvc3RQYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcHJvY2Vzc01vdXNlKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlICYmIGluZGljZUggIT0gZXZlbnQuaW5kZXhoKSB7XHJcbiAgICAgICAgICAgICAgICBnaG9zdFBhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBwcm9jZXNzTW91c2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBuZXcgQXBwbHlDc3MoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcy1pbi1qcy1jc3MnKSxcclxuICAgICAgICAgICAgYCNkZW1vLWdob3N0LXBhcmVudCB7XHJcbi0tbGVmdC1wb3M6MDtcclxufVxyXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tc2hhZG93LFxyXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tZ2hvc3R7XHJcbmxlZnQ6IHZhcigtLWxlZnQtcG9zKTtcclxufWBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzLWluLWpzLWpzJyksXHJcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcclxuICAgICAgICAgICAgYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT57XHJcbiAgICBjb25zdCBkZWx0YVggPSB0aGlzLndpZHRoIC0gZXZlbnQuY2xpZW50WDtcclxuICAgIGNvbnN0IG1lZGlhbiA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgZ2hvc3RQYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtby1naG9zdC1wYXJlbnQnKTtcclxuICAgIGNvbnN0IGxlZnQgPSBldmVudC5jbGllbnRYID4gbWVkaWFuID8gKGV2ZW50LmNsaWVudFggLSBtZWRpYW4pIDogLTEgKiAobWVkaWFuIC0gZXZlbnQuY2xpZW50WCk7XHJcblxyXG4gICAgZ2hvc3RQYXJlbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wb3MnLCBcXGBcXCR7bGVmdH1weFxcYCk7XHJcbn0pO1xyXG4gICAgICAgICAgICBgKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb1BhcnRUaGVtZSgpe1xyXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1wYXJ0LWNzcycpLFxyXG4gICAgICAgICAgICAnY3NzJyxcclxuICAgICAgICAgICAgYHgtcmF0aW5nOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgIHBhZGRpbmc6IDRweDtcclxuICAgIG1pbi13aWR0aDogMjBweDtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufVxyXG4udW5vOmhvdmVyOjpwYXJ0KHN1YmplY3QpIHtcclxuICAgIGJhY2tncm91bmQ6IGxpZ2h0Z3JlZW47XHJcbn1cclxuLmR1bzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICBiYWNrZ3JvdW5kOiBnb2xkZW5yb2Q7XHJcbn1cclxuLnVubzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcclxuICAgIGJhY2tncm91bmQ6IGdyZWVuO1xyXG59XHJcbi51bm86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcclxuICAgIGJhY2tncm91bmQ6IHRvbWF0bztcclxufVxyXG4uZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xyXG4gICAgYmFja2dyb3VuZDogeWVsbG93O1xyXG59XHJcbi5kdW86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcclxuICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG59XHJcbngtcmF0aW5nOjp0aGVtZSh0aHVtYi11cCkge1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG59XHJcbmApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFydC1odG1sJyksXHJcbiAgICAgICAgICAgICd0ZXh0L2h0bWwnLFxyXG4gICAgICAgICAgICBgPHgtdGh1bWJzPlxyXG4gICAgI3NoYWRvdy1yb290XHJcbiAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cclxuICAgIDxkaXYgcGFydD1cInRodW1iLWRvd25cIj7wn5GOPC9kaXY+XHJcbjwveC10aHVtYnM+XHJcbjx4LXJhdGluZz5cclxuICAgICNzaGFkb3ctcm9vdFxyXG4gICAgPGRpdiBwYXJ0PVwic3ViamVjdFwiPjxzbG90Pjwvc2xvdD48L2Rpdj5cclxuICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XHJcbjwveC1yYXRpbmc+XHJcblxyXG48eC1yYXRpbmcgY2xhc3M9XCJ1bm9cIj7inaTvuI88L3gtcmF0aW5nPlxyXG48eC1yYXRpbmcgY2xhc3M9XCJkdW9cIj7wn6S3PC94LXJhdGluZz5cclxuYCk7XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0aWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcclxuICAgICAgICAgICAgbW9kZTogJ2NzcycsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6ICd0cnVlJyxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxyXG4gICAgICAgICAgICB0aGVtZTogJ3NvbGFyaXplZCBkYXJrJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KXtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XHJcbiAgICAgICAgY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5Q3NzKGNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hcHBseUNzcyhpbml0aWFsQ29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlDc3ModmFsdWUpe1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcysnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihlKTt9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGVsdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG1vZGUsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxyXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiAndHJ1ZScsXHJcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAnc29sYXJpemVkIGRhcmsnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnOTBweCc7XHJcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIGtleUVsdCxcclxuICAgICAgICBwb3NpdGlvbkFycmF5XHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcclxuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcclxuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcclxuXHJcbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcclxuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvbiBpbiBKU1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlLWluLWpzJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIHRvcDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI2MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICczNTBweCcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIDo6UGFydFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncGFydCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7UGFydFRoZW1lTWl4aW59IGZyb20gJy4vbGlicy9wYXJ0LXRoZW1lLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0VGhlbWVFbGVtZW50IGV4dGVuZHMgUGFydFRoZW1lTWl4aW4oSFRNTEVsZW1lbnQpIHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgYDtcclxuICAgIH1cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICBpZiAoIXRoaXMuc2hhZG93Um9vdCkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5jb25zdHJ1Y3Rvci50ZW1wbGF0ZTtcclxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcclxuICAgICAgICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LmltcG9ydE5vZGUoXHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5jb250ZW50LCB0cnVlKTtcclxuICAgICAgICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChkb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBYVGh1bWJzIGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLXVwXCI+8J+RjTwvZGl2PlxyXG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLWRvd25cIj7wn5GOPC9kaXY+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtdGh1bWJzJywgWFRodW1icyk7XHJcblxyXG5leHBvcnQgY2xhc3MgWFJhdGluZyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgICA6aG9zdCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCBncmVlbjtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogYmx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLWRvd24pIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIHJlZDtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgIH1cclxuICAgICAgICA8L3N0eWxlPlxyXG4gICAgICAgIDxkaXYgcGFydD1cInN1YmplY3RcIj48c2xvdD48L3Nsb3Q+PC9kaXY+XHJcbiAgICAgICAgPHgtdGh1bWJzIHBhcnQ9XCIqID0+IHJhdGluZy0qXCI+PC94LXRodW1icz5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXJhdGluZycsIFhSYXRpbmcpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFhIb3N0IGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxzdHlsZT5cclxuICAgICAgICAgIDpob3N0IHtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIG9yYW5nZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nIHtcclxuICAgICAgICAgICAgbWFyZ2luOiA0cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZyB7XHJcbiAgICAgICAgICAgIC0tZTEtcGFydC1zdWJqZWN0LXBhZGRpbmc6IDRweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86aG92ZXI6OnBhcnQoc3ViamVjdCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLmR1bzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdvbGRlbnJvZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdyZWVuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLnVubzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0b21hdG87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB5ZWxsb3c7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmc6OnRoZW1lKHRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICA8eC1yYXRpbmcgY2xhc3M9XCJ1bm9cIj7inaTvuI88L3gtcmF0aW5nPlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8eC1yYXRpbmcgY2xhc3M9XCJkdW9cIj7wn6S3PC94LXJhdGluZz5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LWhvc3QnLCBYSG9zdCk7IiwiLypcbkBsaWNlbnNlXG5Db3B5cmlnaHQgKGMpIDIwMTcgVGhlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuVGhpcyBjb2RlIG1heSBvbmx5IGJlIHVzZWQgdW5kZXIgdGhlIEJTRCBzdHlsZSBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQVVUSE9SUy50eHRcblRoZSBjb21wbGV0ZSBzZXQgb2YgY29udHJpYnV0b3JzIG1heSBiZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vQ09OVFJJQlVUT1JTLnR4dFxuQ29kZSBkaXN0cmlidXRlZCBieSBHb29nbGUgYXMgcGFydCBvZiB0aGUgcG9seW1lciBwcm9qZWN0IGlzIGFsc29cbnN1YmplY3QgdG8gYW4gYWRkaXRpb25hbCBJUCByaWdodHMgZ3JhbnQgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4qL1xuXG5jb25zdCBwYXJ0RGF0YUtleSA9ICdfX2Nzc1BhcnRzJztcbmNvbnN0IHBhcnRJZEtleSA9ICdfX3BhcnRJZCc7XG5cbi8qKlxuICogQ29udmVydHMgYW55IHN0eWxlIGVsZW1lbnRzIGluIHRoZSBzaGFkb3dSb290IHRvIHJlcGxhY2UgOjpwYXJ0Lzo6dGhlbWVcbiAqIHdpdGggY3VzdG9tIHByb3BlcnRpZXMgdXNlZCB0byB0cmFuc21pdCB0aGlzIGRhdGEgZG93biB0aGUgZG9tIHRyZWUuIEFsc29cbiAqIGNhY2hlcyBwYXJ0IG1ldGFkYXRhIGZvciBsYXRlciBsb29rdXAuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBpbml0aWFsaXplUGFydHMoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQuc2hhZG93Um9vdCkge1xuICAgIGVsZW1lbnRbcGFydERhdGFLZXldID0gbnVsbDtcbiAgICByZXR1cm47XG4gIH1cbiAgQXJyYXkuZnJvbShlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKSkuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgY29uc3QgaW5mbyA9IHBhcnRDc3NUb0N1c3RvbVByb3BDc3MoZWxlbWVudCwgc3R5bGUudGV4dENvbnRlbnQpO1xuICAgIGlmIChpbmZvLnBhcnRzKSB7XG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IGVsZW1lbnRbcGFydERhdGFLZXldIHx8IFtdO1xuICAgICAgZWxlbWVudFtwYXJ0RGF0YUtleV0ucHVzaCguLi5pbmZvLnBhcnRzKTtcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gaW5mby5jc3M7XG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnX19jc3NQYXJ0cycpKSB7XG4gICAgaW5pdGlhbGl6ZVBhcnRzKGVsZW1lbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpO1xuICByZXR1cm4gZWxlbWVudFtwYXJ0RGF0YUtleV07XG59XG5cbi8vIFRPRE8oc29ydmVsbCk6IGJyaXR0bGUgZHVlIHRvIHJlZ2V4LWluZyBjc3MuIEluc3RlYWQgdXNlIGEgY3NzIHBhcnNlci5cbi8qKlxuICogVHVybnMgY3NzIHVzaW5nIGA6OnBhcnRgIGludG8gY3NzIHVzaW5nIHZhcmlhYmxlcyBmb3IgdGhvc2UgcGFydHMuXG4gKiBBbHNvIHJldHVybnMgcGFydCBtZXRhZGF0YS5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IGNzc1RleHRcbiAqIEByZXR1cm5zIHtPYmplY3R9IGNzczogcGFydGlmaWVkIGNzcywgcGFydHM6IGFycmF5IG9mIHBhcnRzIG9mIHRoZSBmb3JtXG4gKiB7bmFtZSwgc2VsZWN0b3IsIHByb3BzfVxuICogRXhhbXBsZSBvZiBwYXJ0LWlmaWVkIGNzcywgZ2l2ZW46XG4gKiAuZm9vOjpwYXJ0KGJhcikgeyBjb2xvcjogcmVkIH1cbiAqIG91dHB1dDpcbiAqIC5mb28geyAtLWUxLXBhcnQtYmFyLWNvbG9yOiByZWQ7IH1cbiAqIHdoZXJlIGBlMWAgaXMgYSBndWlkIGZvciB0aGlzIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHBhcnRDc3NUb0N1c3RvbVByb3BDc3MoZWxlbWVudCwgY3NzVGV4dCkge1xuICBsZXQgcGFydHM7XG4gIGxldCBjc3MgPSBjc3NUZXh0LnJlcGxhY2UoY3NzUmUsIChtLCBzZWxlY3RvciwgdHlwZSwgbmFtZSwgZW5kU2VsZWN0b3IsIHByb3BzU3RyKSA9PiB7XG4gICAgcGFydHMgPSBwYXJ0cyB8fCBbXTtcbiAgICBsZXQgcHJvcHMgPSB7fTtcbiAgICBjb25zdCBwcm9wc0FycmF5ID0gcHJvcHNTdHIuc3BsaXQoL1xccyo7XFxzKi8pO1xuICAgIHByb3BzQXJyYXkuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGNvbnN0IHMgPSBwcm9wLnNwbGl0KCc6Jyk7XG4gICAgICBjb25zdCBuYW1lID0gcy5zaGlmdCgpLnRyaW0oKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcy5qb2luKCc6Jyk7XG4gICAgICBwcm9wc1tuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBwYXJ0cy5wdXNoKHtzZWxlY3RvciwgZW5kU2VsZWN0b3IsIG5hbWUsIHByb3BzLCBpc1RoZW1lOiB0eXBlID09IHRoZW1lfSk7XG4gICAgbGV0IHBhcnRQcm9wcyA9ICcnO1xuICAgIGZvciAobGV0IHAgaW4gcHJvcHMpIHtcbiAgICAgIHBhcnRQcm9wcyA9IGAke3BhcnRQcm9wc31cXG5cXHQke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIGVuZFNlbGVjdG9yKX06ICR7cHJvcHNbcF19O2A7XG4gICAgfVxuICAgIHJldHVybiBgXFxuJHtzZWxlY3RvciB8fCAnKid9IHtcXG5cXHQke3BhcnRQcm9wcy50cmltKCl9XFxufWA7XG4gIH0pO1xuICByZXR1cm4ge3BhcnRzLCBjc3N9O1xufVxuXG4vLyBndWlkIGZvciBlbGVtZW50IHBhcnQgc2NvcGVzXG5sZXQgcGFydElkID0gMDtcbmZ1bmN0aW9uIHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudFtwYXJ0SWRLZXldID09IHVuZGVmaW5lZCkge1xuICAgIGVsZW1lbnRbcGFydElkS2V5XSA9IHBhcnRJZCsrO1xuICB9XG4gIHJldHVybiBlbGVtZW50W3BhcnRJZEtleV07XG59XG5cbmNvbnN0IHRoZW1lID0gJzo6dGhlbWUnO1xuY29uc3QgY3NzUmUgPSAvXFxzKiguKikoOjooPzpwYXJ0fHRoZW1lKSlcXCgoW14pXSspXFwpKFteXFxze10qKVxccyp7XFxzKihbXn1dKilcXHMqfS9nXG5cbi8vIGNyZWF0ZXMgYSBjdXN0b20gcHJvcGVydHkgbmFtZSBmb3IgYSBwYXJ0LlxuZnVuY3Rpb24gdmFyRm9yUGFydChpZCwgbmFtZSwgcHJvcCwgZW5kU2VsZWN0b3IpIHtcbiAgcmV0dXJuIGAtLWUke2lkfS1wYXJ0LSR7bmFtZX0tJHtwcm9wfSR7ZW5kU2VsZWN0b3IgPyBgLSR7ZW5kU2VsZWN0b3IucmVwbGFjZSgvXFw6L2csICcnKX1gIDogJyd9YDtcbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBhIHN0eWxlIHVzaW5nIGNzcyBjdXN0b20gcHJvcGVydGllcyB0byBzdHlsZSA6OnBhcnQvOjp0aGVtZVxuICogZm9yIGFsbCB0aGUgZG9tIGluIHRoZSBlbGVtZW50J3Mgc2hhZG93Um9vdC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQYXJ0VGhlbWUoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC5zaGFkb3dSb290KSB7XG4gICAgY29uc3Qgb2xkU3R5bGUgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3Rvcignc3R5bGVbcGFydHNdJyk7XG4gICAgaWYgKG9sZFN0eWxlKSB7XG4gICAgICBvbGRTdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZFN0eWxlKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xuICBpZiAoaG9zdCkge1xuICAgIC8vIG5vdGU6IGVuc3VyZSBob3N0IGhhcyBwYXJ0IGRhdGEgc28gdGhhdCBlbGVtZW50cyB0aGF0IGJvb3QgdXBcbiAgICAvLyB3aGlsZSB0aGUgaG9zdCBpcyBiZWluZyBjb25uZWN0ZWQgY2FuIHN0eWxlIHBhcnRzLlxuICAgIGVuc3VyZVBhcnREYXRhKGhvc3QpO1xuICAgIGNvbnN0IGNzcyA9IGNzc0ZvckVsZW1lbnREb20oZWxlbWVudCk7XG4gICAgaWYgKGNzcykge1xuICAgICAgY29uc3QgbmV3U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgbmV3U3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XG4gICAgICBlbGVtZW50LnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQobmV3U3R5bGUpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByb2R1Y2VzIGNzc1RleHQgYSBzdHlsZSBlbGVtZW50IHRvIGFwcGx5IHBhcnQgY3NzIHRvIGEgZ2l2ZW4gZWxlbWVudC5cbiAqIFRoZSBlbGVtZW50J3Mgc2hhZG93Um9vdCBkb20gaXMgc2Nhbm5lZCBmb3Igbm9kZXMgd2l0aCBhIGBwYXJ0YCBhdHRyaWJ1dGUuXG4gKiBUaGVuIHNlbGVjdG9ycyBhcmUgY3JlYXRlZCBtYXRjaGluZyB0aGUgcGFydCBhdHRyaWJ1dGUgY29udGFpbmluZyBwcm9wZXJ0aWVzXG4gKiB3aXRoIHBhcnRzIGRlZmluZWQgaW4gdGhlIGVsZW1lbnQncyBob3N0LlxuICogVGhlIGFuY2VzdG9yIHRyZWUgaXMgdHJhdmVyc2VkIGZvciBmb3J3YXJkZWQgcGFydHMgYW5kIHRoZW1lLlxuICogZS5nLlxuICogW3BhcnQ9XCJiYXJcIl0ge1xuICogICBjb2xvcjogdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO1xuICogfVxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgZm9yIHdoaWNoIHRvIGFwcGx5IHBhcnQgY3NzXG4gKi9cbmZ1bmN0aW9uIGNzc0ZvckVsZW1lbnREb20oZWxlbWVudCkge1xuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcbiAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xuICBjb25zdCBwYXJ0Tm9kZXMgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnW3BhcnRdJyk7XG4gIGxldCBjc3MgPSAnJztcbiAgZm9yIChsZXQgaT0wOyBpIDwgcGFydE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYXR0ciA9IHBhcnROb2Rlc1tpXS5nZXRBdHRyaWJ1dGUoJ3BhcnQnKTtcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoYXR0cik7XG4gICAgY3NzID0gYCR7Y3NzfVxcblxcdCR7cnVsZUZvclBhcnRJbmZvKHBhcnRJbmZvLCBhdHRyLCBlbGVtZW50KX1gXG4gIH1cbiAgcmV0dXJuIGNzcztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY3NzIHJ1bGUgdGhhdCBhcHBsaWVzIGEgcGFydC5cbiAqIEBwYXJhbSB7Kn0gcGFydEluZm8gQXJyYXkgb2YgcGFydCBpbmZvIGZyb20gcGFydCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsqfSBlbGVtZW50IEVsZW1lbnQgd2l0aGluIHdoaWNoIHRoZSBwYXJ0IGV4aXN0c1xuICogQHJldHVybnMge3N0cmluZ30gVGV4dCBvZiB0aGUgY3NzIHJ1bGUgb2YgdGhlIGZvcm0gYHNlbGVjdG9yIHsgcHJvcGVydGllcyB9YFxuICovXG5mdW5jdGlvbiBydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpIHtcbiAgbGV0IHRleHQgPSAnJztcbiAgcGFydEluZm8uZm9yRWFjaChpbmZvID0+IHtcbiAgICBpZiAoIWluZm8uZm9yd2FyZCkge1xuICAgICAgY29uc3QgcHJvcHMgPSBwcm9wc0ZvclBhcnQoaW5mby5uYW1lLCBlbGVtZW50KTtcbiAgICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBidWNrZXQgaW4gcHJvcHMpIHtcbiAgICAgICAgICBsZXQgcHJvcHNCdWNrZXQgPSBwcm9wc1tidWNrZXRdO1xuICAgICAgICAgIGxldCBwYXJ0UHJvcHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGxldCBwIGluIHByb3BzQnVja2V0KSB7XG4gICAgICAgICAgICBwYXJ0UHJvcHMucHVzaChgJHtwfTogJHtwcm9wc0J1Y2tldFtwXX07YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRleHQgPSBgJHt0ZXh0fVxcbltwYXJ0PVwiJHthdHRyfVwiXSR7YnVja2V0fSB7XFxuXFx0JHtwYXJ0UHJvcHMuam9pbignXFxuXFx0Jyl9XFxufWA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGV4dDtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBwYXJ0IGF0dHJpYnV0ZSBpbnRvIGFuIGFycmF5IG9mIHBhcnQgaW5mb1xuICogQHBhcmFtIHsqfSBhdHRyIFBhcnQgYXR0cmlidXRlIHZhbHVlXG4gKiBAcmV0dXJucyB7YXJyYXl9IEFycmF5IG9mIHBhcnQgaW5mbyBvYmplY3RzIG9mIHRoZSBmb3JtIHtuYW1lLCBmb3dhcmR9XG4gKi9cbmZ1bmN0aW9uIHBhcnRJbmZvRnJvbUF0dHIoYXR0cikge1xuICBjb25zdCBwaWVjZXMgPSBhdHRyID8gYXR0ci5zcGxpdCgvXFxzKixcXHMqLykgOiBbXTtcbiAgbGV0IHBhcnRzID0gW107XG4gIHBpZWNlcy5mb3JFYWNoKHAgPT4ge1xuICAgIGNvbnN0IG0gPSBwID8gcC5tYXRjaCgvKFtePVxcc10qKSg/Olxccyo9PlxccyooLiopKT8vKSA6IFtdO1xuICAgIGlmIChtKSB7XG4gICAgICBwYXJ0cy5wdXNoKHtuYW1lOiBtWzJdIHx8IG1bMV0sIGZvcndhcmQ6IG1bMl0gPyBtWzFdIDogbnVsbH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwYXJ0cztcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiBwYXJ0IG5hbWUgcmV0dXJucyBhIHByb3BlcnRpZXMgb2JqZWN0IHdoaWNoIHNldHMgYW55IGFuY2VzdG9yXG4gKiBwcm92aWRlZCBwYXJ0IHByb3BlcnRpZXMgdG8gdGhlIHByb3BlciBhbmNlc3RvciBwcm92aWRlZCBjc3MgdmFyaWFibGUgbmFtZS5cbiAqIGUuZy5cbiAqIGNvbG9yOiBgdmFyKC0tZTEtcGFydC1iYXItY29sb3IpO2BcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcGFydFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2l0aGluIHdoaWNoIGRvbSB3aXRoIHBhcnQgZXhpc3RzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIG9ubHkgOjp0aGVtZSBzaG91bGQgYmUgY29sbGVjdGVkLlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHByb3BlcnRpZXMgZm9yIHRoZSBnaXZlbiBwYXJ0IHNldCB0byBwYXJ0IHZhcmlhYmxlc1xuICogcHJvdmlkZWQgYnkgdGhlIGVsZW1lbnRzIGFuY2VzdG9ycy5cbiAqL1xuZnVuY3Rpb24gcHJvcHNGb3JQYXJ0KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xuICBjb25zdCBob3N0ID0gZWxlbWVudCAmJiBlbGVtZW50LmdldFJvb3ROb2RlKCkuaG9zdDtcbiAgaWYgKCFob3N0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGNvbGxlY3QgcHJvcHMgZnJvbSBob3N0IGVsZW1lbnQuXG4gIGxldCBwcm9wcyA9IHByb3BzRnJvbUVsZW1lbnQobmFtZSwgaG9zdCwgcmVxdWlyZVRoZW1lKTtcbiAgLy8gbm93IHJlY3Vyc2UgYW5jZXN0b3JzIHRvIGZpbmQgbWF0Y2hpbmcgYHRoZW1lYCBwcm9wZXJ0aWVzXG4gIGNvbnN0IHRoZW1lUHJvcHMgPSBwcm9wc0ZvclBhcnQobmFtZSwgaG9zdCwgdHJ1ZSk7XG4gIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCB0aGVtZVByb3BzKTtcbiAgLy8gbm93IHJlY3Vyc2UgYW5jZXN0b3JzIHRvIGZpbmQgKmZvcndhcmRlZCogcGFydCBwcm9wZXJ0aWVzXG4gIGlmICghcmVxdWlyZVRoZW1lKSB7XG4gICAgLy8gZm9yd2FyZGluZzogcmVjdXJzZXMgdXAgYW5jZXN0b3IgdHJlZSFcbiAgICBjb25zdCBwYXJ0SW5mbyA9IHBhcnRJbmZvRnJvbUF0dHIoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3BhcnQnKSk7XG4gICAgLy8ge25hbWUsIGZvcndhcmR9IHdoZXJlIGAqYCBjYW4gYmUgaW5jbHVkZWRcbiAgICBwYXJ0SW5mby5mb3JFYWNoKGluZm8gPT4ge1xuICAgICAgbGV0IGNhdGNoQWxsID0gaW5mby5mb3J3YXJkICYmIChpbmZvLmZvcndhcmQuaW5kZXhPZignKicpID49IDApO1xuICAgICAgaWYgKG5hbWUgPT0gaW5mby5mb3J3YXJkIHx8IGNhdGNoQWxsKSB7XG4gICAgICAgIGNvbnN0IGFuY2VzdG9yTmFtZSA9IGNhdGNoQWxsID8gaW5mby5uYW1lLnJlcGxhY2UoJyonLCBuYW1lKSA6IGluZm8ubmFtZTtcbiAgICAgICAgY29uc3QgZm9yd2FyZGVkID0gcHJvcHNGb3JQYXJ0KGFuY2VzdG9yTmFtZSwgaG9zdCk7XG4gICAgICAgIHByb3BzID0gbWl4UGFydFByb3BzKHByb3BzLCBmb3J3YXJkZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHByb3BzO1xufVxuXG4vKipcbiAqIENvbGxlY3RzIGNzcyBmb3IgdGhlIGdpdmVuIG5hbWUgZnJvbSB0aGUgcGFydCBkYXRhIGZvciB0aGUgZ2l2ZW5cbiAqIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aXRoIHBhcnQgY3NzL2RhdGEuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJlcXVpcmVUaGVtZSBUcnVlIGlmIHNob3VsZCBvbmx5IG1hdGNoIDo6dGhlbWVcbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiBwcm9wZXJ0aWVzIGZvciB0aGUgZ2l2ZW4gcGFydCBzZXQgdG8gcGFydCB2YXJpYWJsZXNcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBwcm9wc0Zyb21FbGVtZW50KG5hbWUsIGVsZW1lbnQsIHJlcXVpcmVUaGVtZSkge1xuICBsZXQgcHJvcHM7XG4gIGNvbnN0IHBhcnRzID0gcGFydERhdGFGb3JFbGVtZW50KGVsZW1lbnQpO1xuICBpZiAocGFydHMpIHtcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XG4gICAgaWYgKHBhcnRzKSB7XG4gICAgICBwYXJ0cy5mb3JFYWNoKChwYXJ0KSA9PiB7XG4gICAgICAgIGlmIChwYXJ0Lm5hbWUgPT0gbmFtZSAmJiAoIXJlcXVpcmVUaGVtZSB8fCBwYXJ0LmlzVGhlbWUpKSB7XG4gICAgICAgICAgcHJvcHMgPSBhZGRQYXJ0UHJvcHMocHJvcHMsIHBhcnQsIGlkLCBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9wcztcbn1cblxuLyoqXG4gKiBBZGQgcGFydCBjc3MgdG8gdGhlIHByb3BzIG9iamVjdCBmb3IgdGhlIGdpdmVuIHBhcnQvbmFtZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBPYmplY3QgY29udGFpbmluZyBwYXJ0IGNzc1xuICogQHBhcmFtIHtvYmplY3R9IHBhcnQgUGFydCBkYXRhXG4gKiBAcGFyYW0ge25tYmVyfSBpZCBlbGVtZW50IHBhcnQgaWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgcGFydFxuICovXG5mdW5jdGlvbiBhZGRQYXJ0UHJvcHMocHJvcHMsIHBhcnQsIGlkLCBuYW1lKSB7XG4gIHByb3BzID0gcHJvcHMgfHwge307XG4gIGNvbnN0IGJ1Y2tldCA9IHBhcnQuZW5kU2VsZWN0b3IgfHwgJyc7XG4gIGNvbnN0IGIgPSBwcm9wc1tidWNrZXRdID0gcHJvcHNbYnVja2V0XSB8fCB7fTtcbiAgZm9yIChsZXQgcCBpbiBwYXJ0LnByb3BzKSB7XG4gICAgYltwXSA9IGB2YXIoJHt2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwLCBwYXJ0LmVuZFNlbGVjdG9yKX0pYDtcbiAgfVxuICByZXR1cm4gcHJvcHM7XG59XG5cbmZ1bmN0aW9uIG1peFBhcnRQcm9wcyhhLCBiKSB7XG4gIGlmIChhICYmIGIpIHtcbiAgICBmb3IgKGxldCBpIGluIGIpIHtcbiAgICAgIC8vIGVuc3VyZSBzdG9yYWdlIGV4aXN0c1xuICAgICAgaWYgKCFhW2ldKSB7XG4gICAgICAgIGFbaV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5hc3NpZ24oYVtpXSwgYltpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhIHx8IGI7XG59XG5cbi8qKlxuICogQ3VzdG9tRWxlbWVudCBtaXhpbiB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIHByb3ZpZGUgOjpwYXJ0Lzo6dGhlbWUgc3VwcG9ydC5cbiAqIEBwYXJhbSB7Kn0gc3VwZXJDbGFzc1xuICovXG5leHBvcnQgbGV0IFBhcnRUaGVtZU1peGluID0gc3VwZXJDbGFzcyA9PiB7XG5cbiAgcmV0dXJuIGNsYXNzIFBhcnRUaGVtZUNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmIChzdXBlci5jb25uZWN0ZWRDYWxsYmFjaykge1xuICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgfVxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX2FwcGx5UGFydFRoZW1lKCkpO1xuICAgIH1cblxuICAgIF9hcHBseVBhcnRUaGVtZSgpIHtcbiAgICAgIGFwcGx5UGFydFRoZW1lKHRoaXMpO1xuICAgIH1cblxuICB9XG5cbn07XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBpbXBvcnQgeyBNYXNrSGlnaGxpZ2h0ZXIgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbWFzay1oaWdobGlnaHRlci9tYXNrLWhpZ2hsaWdodGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodEV2ZW50c1xyXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgRGVtb3NcclxufSBmcm9tICcuL2RlbW9zLmpzJztcclxuaW1wb3J0IHsgWEhvc3QsIFhSYXRpbmcgLCBYVGh1bWJzIH0gZnJvbSAnLi9wYXJ0VGhlbWUvY29tcG9uZW50cy1zYW1wbGUuanMnO1xyXG5cclxuXHJcbihhc3luYyBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xyXG5cclxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XHJcblxyXG4gICAgICAgIGlmICghaW5JZnJhbWUpIHtcclxuICAgICAgICAgICAgbmV3IERlbW9zKCk7XHJcbiAgICAgICAgICAgIG5ldyBIaWdobGlnaHRFdmVudHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XHJcbn0pKCk7Il19
