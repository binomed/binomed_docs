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

    // Template Instantiation
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'template-instantiation',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 3,
            width: '100%'
        }, {
            line: 5,
            nbLines: 6,
            width: '100%'
        }, {
            top: 0,
            height: '100%',
            width: '100%'
        }]
    });

    // HTML Module
    new _highlightCodeHelper.HighlightCodeHelper({
        keyElt: 'html-module',
        // We start with the first fragment (the initial position is fixed by css)
        positionArray: [{
            line: 1,
            nbLines: 8,
            width: '100%'
        }, {
            line: 10,
            nbLines: 4,
            width: '100%'
        }, {
            top: 0,
            height: '100%',
            width: '100%'
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2RlbW9zLmpzIiwic2NyaXB0cy9oZWxwZXIvYXBwbHlDc3MuanMiLCJzY3JpcHRzL2hlbHBlci9hcHBseUpzLmpzIiwic2NyaXB0cy9oZWxwZXIvaGlnaGxpZ2h0Q29kZUhlbHBlci5qcyIsInNjcmlwdHMvaGlnaGxpZ2h0RXZlbnQuanMiLCJzY3JpcHRzL3BhcnRUaGVtZS9jb21wb25lbnRzLXNhbXBsZS5qcyIsInNjcmlwdHMvcGFydFRoZW1lL2xpYnMvcGFydC10aGVtZS5qcyIsInNjcmlwdHMvcHJlei5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7QUFDQTs7QUFHQTs7OztJQUlhLEssV0FBQSxLO0FBRVQscUJBQWM7QUFBQTs7QUFDVixZQUFJOztBQUVBLGlCQUFLLFdBQUw7O0FBRUEsaUJBQUssZUFBTDs7QUFFQSxpQkFBSyxjQUFMO0FBRUgsU0FSRCxDQVFFLE9BQU8sS0FBUCxFQUFjO0FBQ1osb0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFDSDtBQUVKOzs7O3NDQUVhO0FBQ1Y7QUFDQSxtQ0FDSSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBREo7QUFjSDs7OzBDQUVpQjs7QUFFZCxnQkFBSSxVQUFVLENBQUMsQ0FBZjtBQUNBLGdCQUFJLFlBQVksS0FBaEI7QUFDQSxnQkFBSSxhQUFhLFNBQWpCO0FBQ0EsZ0JBQU0sY0FBYyxTQUFTLGNBQVQsQ0FBd0IsbUJBQXhCLENBQXBCOztBQUVBLHFCQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkI7QUFDekIsb0JBQU0sU0FBVSxXQUFXLEtBQVgsR0FBbUIsV0FBVyxJQUEvQixHQUF1QyxNQUFNLE9BQTVEO0FBQ0Esb0JBQU0sU0FBUyxXQUFXLEtBQVgsR0FBbUIsQ0FBbEM7QUFDQSxvQkFBTSxPQUFPLFNBQVMsQ0FBVCxHQUFjLFNBQVMsTUFBdkIsR0FBa0MsU0FBVSxDQUFDLENBQUQs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Q0FTb0I7QUFDaEIsdUJBQWUsSUFBZjtBQUNEO0FBWEg7O0FBQUE7QUFBQSxJQUFvQyxVQUFwQztBQWVELENBakJNOzs7QUN0U1A7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBR0E7O0FBR0EsQ0FBQyxrQkFBa0I7O0FBR2YsbUJBQWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBRUEsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYO0FBQ0E7QUFDSDtBQUVKOztBQU9ELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQXBCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQge1xuICAgIEFwcGx5Q3NzXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcbmltcG9ydCB7XG4gICAgQXBwbHlDb2RlTWlyb3Jcbn0gZnJvbSAnLi9oZWxwZXIvYXBwbHlKcy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEZW1vcyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5fZGVtb0Nzc1ZhcigpO1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vQ3NzVmFySW5KUygpO1xuXG4gICAgICAgICAgICB0aGlzLl9kZW1vUGFydFRoZW1lKCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZGVtb0Nzc1ZhcigpIHtcbiAgICAgICAgLyoqICovXG4gICAgICAgIG5ldyBBcHBseUNzcyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcycpLFxuICAgICAgICAgICAgYFxuI3JlbmRlci1lbGVtZW50e1xuLS1hLXN1cGVyLXZhcjogI0ZGRjtcbn1cbiNyZW5kZXItZWxlbWVudCAudGV4dC0xe1xuXG59XG4jcmVuZGVyLWVsZW1lbnQgLnRleHQtMntcblxufVxuICAgICAgICAgICAgYFxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9kZW1vQ3NzVmFySW5KUygpIHtcblxuICAgICAgICBsZXQgaW5kaWNlSCA9IC0xO1xuICAgICAgICBsZXQgc3Vic2NyaWJlID0gZmFsc2U7XG4gICAgICAgIGxldCBjbGllbnRSZWN0ID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBnaG9zdFBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vLWdob3N0LXBhcmVudCcpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NNb3VzZShldmVudCkge1xuICAgICAgICAgICAgY29uc3QgZGVsdGFYID0gKGNsaWVudFJlY3Qud2lkdGggKyBjbGllbnRSZWN0LmxlZnQpIC0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICAgIGNvbnN0IG1lZGlhbiA9IGNsaWVudFJlY3Qud2lkdGggLyAyO1xuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGRlbHRhWCA+IDAgPyAobWVkaWFuIC0gZGVsdGFYKSA6IChtZWRpYW4gKyAoLTEgKiBkZWx0YVgpKTtcbiAgICAgICAgICAgIGdob3N0UGFyZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcG9zJywgYCR7bGVmdH1weGApO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYGRlbHRhWDogJHtkZWx0YVh9IC8gbWVkaWFuIDogJHttZWRpYW59IC8gd2lkdGggOiAke3dpZHRofSAvIGxlZnQgOiAke2xlZnR9YClcbiAgICAgICAgfVxuXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdnaG9zdC1zdGF0ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGluZGljZUggPSBSZXZlYWwuZ2V0SW5kaWNlcygpLmg7XG4gICAgICAgICAgICAgICAgY2xpZW50UmVjdCA9IGdob3N0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGdob3N0UGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHByb2Nlc3NNb3VzZSk7XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlICYmIGluZGljZUggIT0gZXZlbnQuaW5kZXhoKSB7XG4gICAgICAgICAgICAgICAgZ2hvc3RQYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcHJvY2Vzc01vdXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICBuZXcgQXBwbHlDc3MoXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MtaW4tanMtY3NzJyksXG4gICAgICAgICAgICBgI2RlbW8tZ2hvc3QtcGFyZW50IHtcbi0tbGVmdC1wb3M6MDtcbn1cbiNkZW1vLWdob3N0LXBhcmVudCAuZGVtby1zaGFkb3csXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tZ2hvc3R7XG5sZWZ0OiB2YXIoLS1sZWZ0LXBvcyk7XG59YFxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBBcHBseUNvZGVNaXJvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MtaW4tanMtanMnKSxcbiAgICAgICAgICAgICdqYXZhc2NyaXB0JyxcbiAgICAgICAgICAgIGBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpID0+e1xuICAgIGNvbnN0IGRlbHRhWCA9IHRoaXMud2lkdGggLSBldmVudC5jbGllbnRYO1xuICAgIGNvbnN0IG1lZGlhbiA9IHRoaXMud2lkdGggLyAyO1xuICAgIGNvbnN0IGdob3N0UGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tZ2hvc3QtcGFyZW50Jyk7XG4gICAgY29uc3QgbGVmdCA9IGV2ZW50LmNsaWVudFggPiBtZWRpYW4gPyAoZXZlbnQuY2xpZW50WCAtIG1lZGlhbikgOiAtMSAqIChtZWRpYW4gLSBldmVudC5jbGllbnRYKTtcblxuICAgIGdob3N0UGFyZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcG9zJywgXFxgXFwke2xlZnR9cHhcXGApO1xufSk7XG4gICAgICAgICAgICBgKTtcbiAgICB9XG5cbiAgICBfZGVtb1BhcnRUaGVtZSgpe1xuICAgICAgICBuZXcgQXBwbHlDb2RlTWlyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItcGFydC1jc3MnKSxcbiAgICAgICAgICAgICdjc3MnLFxuICAgICAgICAgICAgYHgtcmF0aW5nOjpwYXJ0KHN1YmplY3QpIHtcbiAgICBwYWRkaW5nOiA0cHg7XG4gICAgbWluLXdpZHRoOiAyMHB4O1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cbi51bm86aG92ZXI6OnBhcnQoc3ViamVjdCkge1xuICAgIGJhY2tncm91bmQ6IGxpZ2h0Z3JlZW47XG59XG4uZHVvOjpwYXJ0KHN1YmplY3QpIHtcbiAgICBiYWNrZ3JvdW5kOiBnb2xkZW5yb2Q7XG59XG4udW5vOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xuICAgIGJhY2tncm91bmQ6IGdyZWVuO1xufVxuLnVubzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xuICAgIGJhY2tncm91bmQ6IHRvbWF0bztcbn1cbi5kdW86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XG4gICAgYmFja2dyb3VuZDogeWVsbG93O1xufVxuLmR1bzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xuICAgIGJhY2tncm91bmQ6IGJsYWNrO1xufVxueC1yYXRpbmc6OnRoZW1lKHRodW1iLXVwKSB7XG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xufVxuYCk7XG5cbiAgICAgICAgbmV3IEFwcGx5Q29kZU1pcm9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLXBhcnQtaHRtbCcpLFxuICAgICAgICAgICAgJ3RleHQvaHRtbCcsXG4gICAgICAgICAgICBgPHgtdGh1bWJzPlxuICAgICNzaGFkb3ctcm9vdFxuICAgIDxkaXYgcGFydD1cInRodW1iLXVwXCI+8J+RjTwvZGl2PlxuICAgIDxkaXYgcGFydD1cInRodW1iLWRvd25cIj7wn5GOPC9kaXY+XG48L3gtdGh1bWJzPlxuPHgtcmF0aW5nPlxuICAgICNzaGFkb3ctcm9vdFxuICAgIDxkaXYgcGFydD1cInN1YmplY3RcIj48c2xvdD48L3Nsb3Q+PC9kaXY+XG4gICAgPHgtdGh1bWJzIHBhcnQ9XCIqID0+IHJhdGluZy0qXCI+PC94LXRodW1icz5cbjwveC1yYXRpbmc+XG5cbjx4LXJhdGluZyBjbGFzcz1cInVub1wiPuKdpO+4jzwveC1yYXRpbmc+XG48eC1yYXRpbmcgY2xhc3M9XCJkdW9cIj7wn6S3PC94LXJhdGluZz5cbmApO1xuICAgIH1cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDc3Mge1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvZGVNaXJyb3JDc3MgPSBDb2RlTWlycm9yKGVsdCwge1xuICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxDb250ZW50LFxuICAgICAgICAgICAgbW9kZTogJ2NzcycsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiAndHJ1ZScsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXG4gICAgICAgICAgICB0aGVtZTogJ3NvbGFyaXplZCBkYXJrJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICB0aGlzLnN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xuXG4gICAgICAgIHRoaXMuc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlLnN0eWxlU2hlZXQpe1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHRoaXMuc3R5bGUpO1xuXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgIGNvZGVNaXJyb3JDc3Mub24oJ2NoYW5nZScsICguLi5vYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlDc3MoY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXBwbHlDc3MoaW5pdGlhbENvbnRlbnQpO1xuICAgIH1cblxuICAgIGFwcGx5Q3NzKHZhbHVlKXtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5iRWx0czsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5iRWx0cyA9IDA7XG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcbiAgICAgICAgICAgIC5tYXAoc3RyID0+IHN0ci50cmltKCkpXG4gICAgICAgICAgICAuZm9yRWFjaChzZWxlY3RvckNzcyA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3JDc3MrJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYkVsdHMrKztcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihlKTt9XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cbn0iLCIndXNlIHN0aWN0J1xuXG5leHBvcnQgY2xhc3MgQXBwbHlDb2RlTWlyb3Ige1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsdCwgbW9kZSwgaW5pdGlhbENvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckpTID0gQ29kZU1pcnJvcihlbHQsIHtcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcbiAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiAndHJ1ZScsXG4gICAgICAgICAgICBmaXhlZEd1dHRlcjogZmFsc2UsXG4gICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnc29sYXJpemVkIGRhcmsnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcbiAgICB9XG5cbn0iLCIndXNlIHN0cmljdCdcblxuY29uc3QgTUlOX1RPUCA9ICc5MHB4JztcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XG5jb25zdCBBRERJVElPTk5BTF9IRUlHSFQgPSAnMC40ZW0nO1xuY29uc3QgQ09MX1dJRFRIID0gMzU7XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRDb2RlSGVscGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7XG4gICAgICAgIGtleUVsdCxcbiAgICAgICAgcG9zaXRpb25BcnJheVxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25BcnJheSA9IHBvc2l0aW9uQXJyYXk7XG4gICAgICAgIHRoaXMubGFzdEluZGV4ID0gMDtcblxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgY29kZS0ke2tleUVsdH1gLCB0aGlzLl9saXN0ZW5GcmFnbWVudHMuYmluZCh0aGlzKSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBzdG9wLWNvZGUtJHtrZXlFbHR9YCwgdGhpcy5fdW5yZWdpc3RlckZyYWdtZW50cy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfcHJvZ3Jlc3NGcmFnbWVudChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBudWxsXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2luaXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVt0aGlzLmxhc3RJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2ZyYWdtZW50c2hvd24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSArZXZlbnQuZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYWdtZW50LWluZGV4Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICtldmVudC5mcmFnbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJhZ21lbnQtaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IHByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnY29sJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICduYkNvbHMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbGVmdE1hcmdpbic6XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbltrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnaGVpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICd3aWR0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3BNYXJnaW4gPSBNSU5fVE9QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJlYS5oZWlnaHQgPSBMSU5FX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEudG9wID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcmVhLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFyZWEubGVmdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpcy5lbHRIaWdsaWdodC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbGlzdGVuRnJhZ21lbnRzKCkge1xuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcbiAgICAgICAgICAgIHR5cGU6IFwiaW5pdFwiLFxuICAgICAgICAgICAgZnJhZ21lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5mcmFnbWVudC52aXNpYmxlJylcbiAgICAgICAgfSk7XG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50aGlkZGVuJywgdGhpcy5fcHJvZ3Jlc3NGcmFnbWVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfdW5yZWdpc3RlckZyYWdtZW50cygpIHtcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgICAgICBSZXZlYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuXG59IiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0Q29kZUhlbHBlclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcblxuY29uc3QgTElORV9IRUlHSFQgPSAxLjE1O1xuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XG5jb25zdCBDT0xfV0lEVEggPSAzNTtcblxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vICBDc3MgVmFyaWFibGUgRGVjbGFyYXRpb25cbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiA1LFxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc0MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogOSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvbiBpbiBKU1xuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUtaW4tanMnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgdG9wOiAnMTAwcHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI2MHB4JyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6ICczNTBweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzAwcHgnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyA6OlBhcnRcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAncGFydCcsXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc2MCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogMyxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGVtcGxhdGUgSW5zdGFudGlhdGlvblxuICAgICAgICBuZXcgSGlnaGxpZ2h0Q29kZUhlbHBlcih7XG4gICAgICAgICAgICBrZXlFbHQ6ICd0ZW1wbGF0ZS1pbnN0YW50aWF0aW9uJyxcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgbmJMaW5lczogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGluZTogNSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSFRNTCBNb2R1bGVcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xuICAgICAgICAgICAga2V5RWx0OiAnaHRtbC1tb2R1bGUnLFxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA4LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxMCxcbiAgICAgICAgICAgICAgICBuYkxpbmVzOiA0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICB9XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1BhcnRUaGVtZU1peGlufSBmcm9tICcuL2xpYnMvcGFydC10aGVtZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBQYXJ0VGhlbWVFbGVtZW50IGV4dGVuZHMgUGFydFRoZW1lTWl4aW4oSFRNTEVsZW1lbnQpIHtcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgcmV0dXJuIGBgO1xuICAgIH1cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmICghdGhpcy5zaGFkb3dSb290KSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5jb25zdHJ1Y3Rvci50ZW1wbGF0ZTtcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl90ZW1wbGF0ZUVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcbiAgICAgICAgICBjb25zdCBkb20gPSBkb2N1bWVudC5pbXBvcnROb2RlKFxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50LmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChkb20pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG5leHBvcnQgY2xhc3MgWFRodW1icyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IHBhcnQ9XCJ0aHVtYi11cFwiPvCfkY08L2Rpdj5cbiAgICAgICAgPGRpdiBwYXJ0PVwidGh1bWItZG93blwiPvCfkY48L2Rpdj5cbiAgICAgIGA7XG4gICAgfVxuICB9XG5cbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXRodW1icycsIFhUaHVtYnMpO1xuXG5leHBvcnQgY2xhc3MgWFJhdGluZyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXRodW1iczo6cGFydCh0aHVtYi11cCkge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIGdyZWVuO1xuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogYmx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgeC10aHVtYnM6OnBhcnQodGh1bWItZG93bikge1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIHJlZDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjBweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICB9XG4gICAgICAgIDwvc3R5bGU+XG4gICAgICAgIDxkaXYgcGFydD1cInN1YmplY3RcIj48c2xvdD48L3Nsb3Q+PC9kaXY+XG4gICAgICAgIDx4LXRodW1icyBwYXJ0PVwiKiA9PiByYXRpbmctKlwiPjwveC10aHVtYnM+XG4gICAgICBgO1xuICAgIH1cbiAgfVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtcmF0aW5nJywgWFJhdGluZyk7XG5cbmV4cG9ydCBjbGFzcyBYSG9zdCBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCBvcmFuZ2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtcmF0aW5nIHtcbiAgICAgICAgICAgIG1hcmdpbjogNHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XG4gICAgICAgICAgICBwYWRkaW5nOiA0cHg7XG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgfVxuICAgICAgICAgIHgtcmF0aW5nIHtcbiAgICAgICAgICAgIC0tZTEtcGFydC1zdWJqZWN0LXBhZGRpbmc6IDRweDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLnVubzpob3Zlcjo6cGFydChzdWJqZWN0KSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAuZHVvOjpwYXJ0KHN1YmplY3QpIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdvbGRlbnJvZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLnVubzo6cGFydChyYXRpbmctdGh1bWItdXApIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdyZWVuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAudW5vOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0b21hdG87XG4gICAgICAgICAgfVxuICAgICAgICAgIC5kdW86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB5ZWxsb3c7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5kdW86OnBhcnQocmF0aW5nLXRodW1iLWRvd24pIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsYWNrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB4LXJhdGluZzo6dGhlbWUodGh1bWItdXApIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwidW5vXCI+4p2k77iPPC94LXJhdGluZz5cbiAgICAgICAgPGJyPlxuICAgICAgICA8eC1yYXRpbmcgY2xhc3M9XCJkdW9cIj7wn6S3PC94LXJhdGluZz5cbiAgICAgIGA7XG4gICAgfVxuICB9XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1ob3N0JywgWEhvc3QpOyIsIi8qXG5AbGljZW5zZVxuQ29weXJpZ2h0IChjKSAyMDE3IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcblRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG5UaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbkNvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG5zdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuKi9cblxuY29uc3QgcGFydERhdGFLZXkgPSAnX19jc3NQYXJ0cyc7XG5jb25zdCBwYXJ0SWRLZXkgPSAnX19wYXJ0SWQnO1xuXG4vKipcbiAqIENvbnZlcnRzIGFueSBzdHlsZSBlbGVtZW50cyBpbiB0aGUgc2hhZG93Um9vdCB0byByZXBsYWNlIDo6cGFydC86OnRoZW1lXG4gKiB3aXRoIGN1c3RvbSBwcm9wZXJ0aWVzIHVzZWQgdG8gdHJhbnNtaXQgdGhpcyBkYXRhIGRvd24gdGhlIGRvbSB0cmVlLiBBbHNvXG4gKiBjYWNoZXMgcGFydCBtZXRhZGF0YSBmb3IgbGF0ZXIgbG9va3VwLlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVBhcnRzKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICBlbGVtZW50W3BhcnREYXRhS2V5XSA9IG51bGw7XG4gICAgcmV0dXJuO1xuICB9XG4gIEFycmF5LmZyb20oZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJykpLmZvckVhY2goc3R5bGUgPT4ge1xuICAgIGNvbnN0IGluZm8gPSBwYXJ0Q3NzVG9DdXN0b21Qcm9wQ3NzKGVsZW1lbnQsIHN0eWxlLnRleHRDb250ZW50KTtcbiAgICBpZiAoaW5mby5wYXJ0cykge1xuICAgICAgZWxlbWVudFtwYXJ0RGF0YUtleV0gPSBlbGVtZW50W3BhcnREYXRhS2V5XSB8fCBbXTtcbiAgICAgIGVsZW1lbnRbcGFydERhdGFLZXldLnB1c2goLi4uaW5mby5wYXJ0cyk7XG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9IGluZm8uY3NzO1xuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gZW5zdXJlUGFydERhdGEoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ19fY3NzUGFydHMnKSkge1xuICAgIGluaXRpYWxpemVQYXJ0cyhlbGVtZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJ0RGF0YUZvckVsZW1lbnQoZWxlbWVudCkge1xuICBlbnN1cmVQYXJ0RGF0YShlbGVtZW50KTtcbiAgcmV0dXJuIGVsZW1lbnRbcGFydERhdGFLZXldO1xufVxuXG4vLyBUT0RPKHNvcnZlbGwpOiBicml0dGxlIGR1ZSB0byByZWdleC1pbmcgY3NzLiBJbnN0ZWFkIHVzZSBhIGNzcyBwYXJzZXIuXG4vKipcbiAqIFR1cm5zIGNzcyB1c2luZyBgOjpwYXJ0YCBpbnRvIGNzcyB1c2luZyB2YXJpYWJsZXMgZm9yIHRob3NlIHBhcnRzLlxuICogQWxzbyByZXR1cm5zIHBhcnQgbWV0YWRhdGEuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBjc3NUZXh0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjc3M6IHBhcnRpZmllZCBjc3MsIHBhcnRzOiBhcnJheSBvZiBwYXJ0cyBvZiB0aGUgZm9ybVxuICoge25hbWUsIHNlbGVjdG9yLCBwcm9wc31cbiAqIEV4YW1wbGUgb2YgcGFydC1pZmllZCBjc3MsIGdpdmVuOlxuICogLmZvbzo6cGFydChiYXIpIHsgY29sb3I6IHJlZCB9XG4gKiBvdXRwdXQ6XG4gKiAuZm9vIHsgLS1lMS1wYXJ0LWJhci1jb2xvcjogcmVkOyB9XG4gKiB3aGVyZSBgZTFgIGlzIGEgZ3VpZCBmb3IgdGhpcyBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBwYXJ0Q3NzVG9DdXN0b21Qcm9wQ3NzKGVsZW1lbnQsIGNzc1RleHQpIHtcbiAgbGV0IHBhcnRzO1xuICBsZXQgY3NzID0gY3NzVGV4dC5yZXBsYWNlKGNzc1JlLCAobSwgc2VsZWN0b3IsIHR5cGUsIG5hbWUsIGVuZFNlbGVjdG9yLCBwcm9wc1N0cikgPT4ge1xuICAgIHBhcnRzID0gcGFydHMgfHwgW107XG4gICAgbGV0IHByb3BzID0ge307XG4gICAgY29uc3QgcHJvcHNBcnJheSA9IHByb3BzU3RyLnNwbGl0KC9cXHMqO1xccyovKTtcbiAgICBwcm9wc0FycmF5LmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBjb25zdCBzID0gcHJvcC5zcGxpdCgnOicpO1xuICAgICAgY29uc3QgbmFtZSA9IHMuc2hpZnQoKS50cmltKCk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHMuam9pbignOicpO1xuICAgICAgcHJvcHNbbmFtZV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XG4gICAgcGFydHMucHVzaCh7c2VsZWN0b3IsIGVuZFNlbGVjdG9yLCBuYW1lLCBwcm9wcywgaXNUaGVtZTogdHlwZSA9PSB0aGVtZX0pO1xuICAgIGxldCBwYXJ0UHJvcHMgPSAnJztcbiAgICBmb3IgKGxldCBwIGluIHByb3BzKSB7XG4gICAgICBwYXJ0UHJvcHMgPSBgJHtwYXJ0UHJvcHN9XFxuXFx0JHt2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwLCBlbmRTZWxlY3Rvcil9OiAke3Byb3BzW3BdfTtgO1xuICAgIH1cbiAgICByZXR1cm4gYFxcbiR7c2VsZWN0b3IgfHwgJyonfSB7XFxuXFx0JHtwYXJ0UHJvcHMudHJpbSgpfVxcbn1gO1xuICB9KTtcbiAgcmV0dXJuIHtwYXJ0cywgY3NzfTtcbn1cblxuLy8gZ3VpZCBmb3IgZWxlbWVudCBwYXJ0IHNjb3Blc1xubGV0IHBhcnRJZCA9IDA7XG5mdW5jdGlvbiBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnRbcGFydElkS2V5XSA9PSB1bmRlZmluZWQpIHtcbiAgICBlbGVtZW50W3BhcnRJZEtleV0gPSBwYXJ0SWQrKztcbiAgfVxuICByZXR1cm4gZWxlbWVudFtwYXJ0SWRLZXldO1xufVxuXG5jb25zdCB0aGVtZSA9ICc6OnRoZW1lJztcbmNvbnN0IGNzc1JlID0gL1xccyooLiopKDo6KD86cGFydHx0aGVtZSkpXFwoKFteKV0rKVxcKShbXlxcc3tdKilcXHMqe1xccyooW159XSopXFxzKn0vZ1xuXG4vLyBjcmVhdGVzIGEgY3VzdG9tIHByb3BlcnR5IG5hbWUgZm9yIGEgcGFydC5cbmZ1bmN0aW9uIHZhckZvclBhcnQoaWQsIG5hbWUsIHByb3AsIGVuZFNlbGVjdG9yKSB7XG4gIHJldHVybiBgLS1lJHtpZH0tcGFydC0ke25hbWV9LSR7cHJvcH0ke2VuZFNlbGVjdG9yID8gYC0ke2VuZFNlbGVjdG9yLnJlcGxhY2UoL1xcOi9nLCAnJyl9YCA6ICcnfWA7XG59XG5cbi8qKlxuICogUHJvZHVjZXMgYSBzdHlsZSB1c2luZyBjc3MgY3VzdG9tIHByb3BlcnRpZXMgdG8gc3R5bGUgOjpwYXJ0Lzo6dGhlbWVcbiAqIGZvciBhbGwgdGhlIGRvbSBpbiB0aGUgZWxlbWVudCdzIHNoYWRvd1Jvb3QuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGFydFRoZW1lKGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQuc2hhZG93Um9vdCkge1xuICAgIGNvbnN0IG9sZFN0eWxlID0gZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlW3BhcnRzXScpO1xuICAgIGlmIChvbGRTdHlsZSkge1xuICAgICAgb2xkU3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGRTdHlsZSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGhvc3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCkuaG9zdDtcbiAgaWYgKGhvc3QpIHtcbiAgICAvLyBub3RlOiBlbnN1cmUgaG9zdCBoYXMgcGFydCBkYXRhIHNvIHRoYXQgZWxlbWVudHMgdGhhdCBib290IHVwXG4gICAgLy8gd2hpbGUgdGhlIGhvc3QgaXMgYmVpbmcgY29ubmVjdGVkIGNhbiBzdHlsZSBwYXJ0cy5cbiAgICBlbnN1cmVQYXJ0RGF0YShob3N0KTtcbiAgICBjb25zdCBjc3MgPSBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpO1xuICAgIGlmIChjc3MpIHtcbiAgICAgIGNvbnN0IG5ld1N0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIG5ld1N0eWxlLnRleHRDb250ZW50ID0gY3NzO1xuICAgICAgZWxlbWVudC5zaGFkb3dSb290LmFwcGVuZENoaWxkKG5ld1N0eWxlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBjc3NUZXh0IGEgc3R5bGUgZWxlbWVudCB0byBhcHBseSBwYXJ0IGNzcyB0byBhIGdpdmVuIGVsZW1lbnQuXG4gKiBUaGUgZWxlbWVudCdzIHNoYWRvd1Jvb3QgZG9tIGlzIHNjYW5uZWQgZm9yIG5vZGVzIHdpdGggYSBgcGFydGAgYXR0cmlidXRlLlxuICogVGhlbiBzZWxlY3RvcnMgYXJlIGNyZWF0ZWQgbWF0Y2hpbmcgdGhlIHBhcnQgYXR0cmlidXRlIGNvbnRhaW5pbmcgcHJvcGVydGllc1xuICogd2l0aCBwYXJ0cyBkZWZpbmVkIGluIHRoZSBlbGVtZW50J3MgaG9zdC5cbiAqIFRoZSBhbmNlc3RvciB0cmVlIGlzIHRyYXZlcnNlZCBmb3IgZm9yd2FyZGVkIHBhcnRzIGFuZCB0aGVtZS5cbiAqIGUuZy5cbiAqIFtwYXJ0PVwiYmFyXCJdIHtcbiAqICAgY29sb3I6IHZhcigtLWUxLXBhcnQtYmFyLWNvbG9yKTtcbiAqIH1cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IGZvciB3aGljaCB0byBhcHBseSBwYXJ0IGNzc1xuICovXG5mdW5jdGlvbiBjc3NGb3JFbGVtZW50RG9tKGVsZW1lbnQpIHtcbiAgZW5zdXJlUGFydERhdGEoZWxlbWVudCk7XG4gIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcbiAgY29uc3QgcGFydE5vZGVzID0gZWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1twYXJ0XScpO1xuICBsZXQgY3NzID0gJyc7XG4gIGZvciAobGV0IGk9MDsgaSA8IHBhcnROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGF0dHIgPSBwYXJ0Tm9kZXNbaV0uZ2V0QXR0cmlidXRlKCdwYXJ0Jyk7XG4gICAgY29uc3QgcGFydEluZm8gPSBwYXJ0SW5mb0Zyb21BdHRyKGF0dHIpO1xuICAgIGNzcyA9IGAke2Nzc31cXG5cXHQke3J1bGVGb3JQYXJ0SW5mbyhwYXJ0SW5mbywgYXR0ciwgZWxlbWVudCl9YFxuICB9XG4gIHJldHVybiBjc3M7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNzcyBydWxlIHRoYXQgYXBwbGllcyBhIHBhcnQuXG4gKiBAcGFyYW0geyp9IHBhcnRJbmZvIEFycmF5IG9mIHBhcnQgaW5mbyBmcm9tIHBhcnQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyp9IGF0dHIgUGFydCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Kn0gZWxlbWVudCBFbGVtZW50IHdpdGhpbiB3aGljaCB0aGUgcGFydCBleGlzdHNcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRleHQgb2YgdGhlIGNzcyBydWxlIG9mIHRoZSBmb3JtIGBzZWxlY3RvciB7IHByb3BlcnRpZXMgfWBcbiAqL1xuZnVuY3Rpb24gcnVsZUZvclBhcnRJbmZvKHBhcnRJbmZvLCBhdHRyLCBlbGVtZW50KSB7XG4gIGxldCB0ZXh0ID0gJyc7XG4gIHBhcnRJbmZvLmZvckVhY2goaW5mbyA9PiB7XG4gICAgaWYgKCFpbmZvLmZvcndhcmQpIHtcbiAgICAgIGNvbnN0IHByb3BzID0gcHJvcHNGb3JQYXJ0KGluZm8ubmFtZSwgZWxlbWVudCk7XG4gICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgZm9yIChsZXQgYnVja2V0IGluIHByb3BzKSB7XG4gICAgICAgICAgbGV0IHByb3BzQnVja2V0ID0gcHJvcHNbYnVja2V0XTtcbiAgICAgICAgICBsZXQgcGFydFByb3BzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgcCBpbiBwcm9wc0J1Y2tldCkge1xuICAgICAgICAgICAgcGFydFByb3BzLnB1c2goYCR7cH06ICR7cHJvcHNCdWNrZXRbcF19O2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0ZXh0ID0gYCR7dGV4dH1cXG5bcGFydD1cIiR7YXR0cn1cIl0ke2J1Y2tldH0ge1xcblxcdCR7cGFydFByb3BzLmpvaW4oJ1xcblxcdCcpfVxcbn1gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRleHQ7XG59XG5cbi8qKlxuICogUGFyc2VzIGEgcGFydCBhdHRyaWJ1dGUgaW50byBhbiBhcnJheSBvZiBwYXJ0IGluZm9cbiAqIEBwYXJhbSB7Kn0gYXR0ciBQYXJ0IGF0dHJpYnV0ZSB2YWx1ZVxuICogQHJldHVybnMge2FycmF5fSBBcnJheSBvZiBwYXJ0IGluZm8gb2JqZWN0cyBvZiB0aGUgZm9ybSB7bmFtZSwgZm93YXJkfVxuICovXG5mdW5jdGlvbiBwYXJ0SW5mb0Zyb21BdHRyKGF0dHIpIHtcbiAgY29uc3QgcGllY2VzID0gYXR0ciA/IGF0dHIuc3BsaXQoL1xccyosXFxzKi8pIDogW107XG4gIGxldCBwYXJ0cyA9IFtdO1xuICBwaWVjZXMuZm9yRWFjaChwID0+IHtcbiAgICBjb25zdCBtID0gcCA/IHAubWF0Y2goLyhbXj1cXHNdKikoPzpcXHMqPT5cXHMqKC4qKSk/LykgOiBbXTtcbiAgICBpZiAobSkge1xuICAgICAgcGFydHMucHVzaCh7bmFtZTogbVsyXSB8fCBtWzFdLCBmb3J3YXJkOiBtWzJdID8gbVsxXSA6IG51bGx9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcGFydHM7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gcGFydCBuYW1lIHJldHVybnMgYSBwcm9wZXJ0aWVzIG9iamVjdCB3aGljaCBzZXRzIGFueSBhbmNlc3RvclxuICogcHJvdmlkZWQgcGFydCBwcm9wZXJ0aWVzIHRvIHRoZSBwcm9wZXIgYW5jZXN0b3IgcHJvdmlkZWQgY3NzIHZhcmlhYmxlIG5hbWUuXG4gKiBlLmcuXG4gKiBjb2xvcjogYHZhcigtLWUxLXBhcnQtYmFyLWNvbG9yKTtgXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHBhcnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGhpbiB3aGljaCBkb20gd2l0aCBwYXJ0IGV4aXN0c1xuICogQHBhcmFtIHtib29sZWFufSByZXF1aXJlVGhlbWUgVHJ1ZSBpZiBvbmx5IDo6dGhlbWUgc2hvdWxkIGJlIGNvbGxlY3RlZC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiBwcm9wZXJ0aWVzIGZvciB0aGUgZ2l2ZW4gcGFydCBzZXQgdG8gcGFydCB2YXJpYWJsZXNcbiAqIHByb3ZpZGVkIGJ5IHRoZSBlbGVtZW50cyBhbmNlc3RvcnMuXG4gKi9cbmZ1bmN0aW9uIHByb3BzRm9yUGFydChuYW1lLCBlbGVtZW50LCByZXF1aXJlVGhlbWUpIHtcbiAgY29uc3QgaG9zdCA9IGVsZW1lbnQgJiYgZWxlbWVudC5nZXRSb290Tm9kZSgpLmhvc3Q7XG4gIGlmICghaG9zdCkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBjb2xsZWN0IHByb3BzIGZyb20gaG9zdCBlbGVtZW50LlxuICBsZXQgcHJvcHMgPSBwcm9wc0Zyb21FbGVtZW50KG5hbWUsIGhvc3QsIHJlcXVpcmVUaGVtZSk7XG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kIG1hdGNoaW5nIGB0aGVtZWAgcHJvcGVydGllc1xuICBjb25zdCB0aGVtZVByb3BzID0gcHJvcHNGb3JQYXJ0KG5hbWUsIGhvc3QsIHRydWUpO1xuICBwcm9wcyA9IG1peFBhcnRQcm9wcyhwcm9wcywgdGhlbWVQcm9wcyk7XG4gIC8vIG5vdyByZWN1cnNlIGFuY2VzdG9ycyB0byBmaW5kICpmb3J3YXJkZWQqIHBhcnQgcHJvcGVydGllc1xuICBpZiAoIXJlcXVpcmVUaGVtZSkge1xuICAgIC8vIGZvcndhcmRpbmc6IHJlY3Vyc2VzIHVwIGFuY2VzdG9yIHRyZWUhXG4gICAgY29uc3QgcGFydEluZm8gPSBwYXJ0SW5mb0Zyb21BdHRyKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdwYXJ0JykpO1xuICAgIC8vIHtuYW1lLCBmb3J3YXJkfSB3aGVyZSBgKmAgY2FuIGJlIGluY2x1ZGVkXG4gICAgcGFydEluZm8uZm9yRWFjaChpbmZvID0+IHtcbiAgICAgIGxldCBjYXRjaEFsbCA9IGluZm8uZm9yd2FyZCAmJiAoaW5mby5mb3J3YXJkLmluZGV4T2YoJyonKSA+PSAwKTtcbiAgICAgIGlmIChuYW1lID09IGluZm8uZm9yd2FyZCB8fCBjYXRjaEFsbCkge1xuICAgICAgICBjb25zdCBhbmNlc3Rvck5hbWUgPSBjYXRjaEFsbCA/IGluZm8ubmFtZS5yZXBsYWNlKCcqJywgbmFtZSkgOiBpbmZvLm5hbWU7XG4gICAgICAgIGNvbnN0IGZvcndhcmRlZCA9IHByb3BzRm9yUGFydChhbmNlc3Rvck5hbWUsIGhvc3QpO1xuICAgICAgICBwcm9wcyA9IG1peFBhcnRQcm9wcyhwcm9wcywgZm9yd2FyZGVkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBwcm9wcztcbn1cblxuLyoqXG4gKiBDb2xsZWN0cyBjc3MgZm9yIHRoZSBnaXZlbiBuYW1lIGZyb20gdGhlIHBhcnQgZGF0YSBmb3IgdGhlIGdpdmVuXG4gKiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcGFydFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2l0aCBwYXJ0IGNzcy9kYXRhLlxuICogQHBhcmFtIHtCb29sZWFufSByZXF1aXJlVGhlbWUgVHJ1ZSBpZiBzaG91bGQgb25seSBtYXRjaCA6OnRoZW1lXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgb2YgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHBhcnQgc2V0IHRvIHBhcnQgdmFyaWFibGVzXG4gKiBwcm92aWRlZCBieSB0aGUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gcHJvcHNGcm9tRWxlbWVudChuYW1lLCBlbGVtZW50LCByZXF1aXJlVGhlbWUpIHtcbiAgbGV0IHByb3BzO1xuICBjb25zdCBwYXJ0cyA9IHBhcnREYXRhRm9yRWxlbWVudChlbGVtZW50KTtcbiAgaWYgKHBhcnRzKSB7XG4gICAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIGlmIChwYXJ0cykge1xuICAgICAgcGFydHMuZm9yRWFjaCgocGFydCkgPT4ge1xuICAgICAgICBpZiAocGFydC5uYW1lID09IG5hbWUgJiYgKCFyZXF1aXJlVGhlbWUgfHwgcGFydC5pc1RoZW1lKSkge1xuICAgICAgICAgIHByb3BzID0gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvcHM7XG59XG5cbi8qKlxuICogQWRkIHBhcnQgY3NzIHRvIHRoZSBwcm9wcyBvYmplY3QgZm9yIHRoZSBnaXZlbiBwYXJ0L25hbWUuXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgT2JqZWN0IGNvbnRhaW5pbmcgcGFydCBjc3NcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0IFBhcnQgZGF0YVxuICogQHBhcmFtIHtubWJlcn0gaWQgZWxlbWVudCBwYXJ0IGlkXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lIG9mIHBhcnRcbiAqL1xuZnVuY3Rpb24gYWRkUGFydFByb3BzKHByb3BzLCBwYXJ0LCBpZCwgbmFtZSkge1xuICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICBjb25zdCBidWNrZXQgPSBwYXJ0LmVuZFNlbGVjdG9yIHx8ICcnO1xuICBjb25zdCBiID0gcHJvcHNbYnVja2V0XSA9IHByb3BzW2J1Y2tldF0gfHwge307XG4gIGZvciAobGV0IHAgaW4gcGFydC5wcm9wcykge1xuICAgIGJbcF0gPSBgdmFyKCR7dmFyRm9yUGFydChpZCwgbmFtZSwgcCwgcGFydC5lbmRTZWxlY3Rvcil9KWA7XG4gIH1cbiAgcmV0dXJuIHByb3BzO1xufVxuXG5mdW5jdGlvbiBtaXhQYXJ0UHJvcHMoYSwgYikge1xuICBpZiAoYSAmJiBiKSB7XG4gICAgZm9yIChsZXQgaSBpbiBiKSB7XG4gICAgICAvLyBlbnN1cmUgc3RvcmFnZSBleGlzdHNcbiAgICAgIGlmICghYVtpXSkge1xuICAgICAgICBhW2ldID0ge307XG4gICAgICB9XG4gICAgICBPYmplY3QuYXNzaWduKGFbaV0sIGJbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYSB8fCBiO1xufVxuXG4vKipcbiAqIEN1c3RvbUVsZW1lbnQgbWl4aW4gdGhhdCBjYW4gYmUgYXBwbGllZCB0byBwcm92aWRlIDo6cGFydC86OnRoZW1lIHN1cHBvcnQuXG4gKiBAcGFyYW0geyp9IHN1cGVyQ2xhc3NcbiAqL1xuZXhwb3J0IGxldCBQYXJ0VGhlbWVNaXhpbiA9IHN1cGVyQ2xhc3MgPT4ge1xuXG4gIHJldHVybiBjbGFzcyBQYXJ0VGhlbWVDbGFzcyBleHRlbmRzIHN1cGVyQ2xhc3Mge1xuXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICBpZiAoc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLl9hcHBseVBhcnRUaGVtZSgpKTtcbiAgICB9XG5cbiAgICBfYXBwbHlQYXJ0VGhlbWUoKSB7XG4gICAgICBhcHBseVBhcnRUaGVtZSh0aGlzKTtcbiAgICB9XG5cbiAgfVxuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBpbXBvcnQgeyBNYXNrSGlnaGxpZ2h0ZXIgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbWFzay1oaWdobGlnaHRlci9tYXNrLWhpZ2hsaWdodGVyLmpzJztcbmltcG9ydCB7XG4gICAgSGlnaGxpZ2h0RXZlbnRzXG59IGZyb20gJy4vaGlnaGxpZ2h0RXZlbnQuanMnO1xuaW1wb3J0IHtcbiAgICBEZW1vc1xufSBmcm9tICcuL2RlbW9zLmpzJztcbmltcG9ydCB7IFhIb3N0LCBYUmF0aW5nICwgWFRodW1icyB9IGZyb20gJy4vcGFydFRoZW1lL2NvbXBvbmVudHMtc2FtcGxlLmpzJztcblxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG5cbiAgICBhc3luYyBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcblxuICAgICAgICBjb25zdCBpbklmcmFtZSA9IHdpbmRvdy50b3AgIT0gd2luZG93LnNlbGY7XG5cbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xuICAgICAgICAgICAgbmV3IERlbW9zKCk7XG4gICAgICAgICAgICBuZXcgSGlnaGxpZ2h0RXZlbnRzKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cblxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
