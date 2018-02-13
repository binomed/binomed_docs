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

            new _applyJs.ApplyJS(document.getElementById('codemirror-css-in-js-js'), 'document.addEventListener(\'mousemove\', (event) =>{\n    const deltaX = this.width - event.clientX;\n    const median = this.width / 2;\n    const ghostParent = document.getElementById(\'demo-ghost-parent\');\n    const left = event.clientX > median ? (event.clientX - median) : -1 * (median - event.clientX);\n\n    ghostParent.style.setProperty(\'--left-pos\', `${left}px`);\n});\n            ');
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

var ApplyJS =

/**
 *
 * @param {HtmlElement} elt
 * @param {string} initialContent
 */
exports.ApplyJS = function ApplyJS(elt, initialContent) {
    _classCallCheck(this, ApplyJS);

    var codeMirrorJS = CodeMirror(elt, {
        value: initialContent,
        mode: 'javascript',
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
exports.XAdvanced = exports.XHost = exports.XRating = exports.XThumbs2 = exports.XWeirdInput = exports.XThumbs = exports.PartThemeElement = undefined;

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

var XWeirdInput = exports.XWeirdInput = function (_PartThemeElement2) {
  _inherits(XWeirdInput, _PartThemeElement2);

  function XWeirdInput() {
    _classCallCheck(this, XWeirdInput);

    return _possibleConstructorReturn(this, (XWeirdInput.__proto__ || Object.getPrototypeOf(XWeirdInput)).apply(this, arguments));
  }

  _createClass(XWeirdInput, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      var _this4 = this;

      var initializing = !this.shadowRoot;
      _get(XWeirdInput.prototype.__proto__ || Object.getPrototypeOf(XWeirdInput.prototype), 'connectedCallback', this).call(this);
      if (initializing) {
        var input = this.shadowRoot.querySelector('input');
        input.addEventListener('change', function () {
          input.setAttribute('part', input.value);
          _this4._applyPartTheme();
        });
      }
    }
  }], [{
    key: 'template',
    get: function get() {
      return '\n        <input part="input" placeholder="weird">\n      ';
    }
  }]);

  return XWeirdInput;
}(PartThemeElement);

customElements.define('x-weird-input', XWeirdInput);

var XThumbs2 = exports.XThumbs2 = function (_PartThemeElement3) {
  _inherits(XThumbs2, _PartThemeElement3);

  function XThumbs2() {
    _classCallCheck(this, XThumbs2);

    return _possibleConstructorReturn(this, (XThumbs2.__proto__ || Object.getPrototypeOf(XThumbs2)).apply(this, arguments));
  }

  _createClass(XThumbs2, null, [{
    key: 'template',
    get: function get() {
      return '\n        <x-thumbs part="thumb-up => thumb-up"></x-thumbs>\n      ';
    }
  }]);

  return XThumbs2;
}(PartThemeElement);

customElements.define('x-thumbs2', XThumbs2);

var XRating = exports.XRating = function (_PartThemeElement4) {
  _inherits(XRating, _PartThemeElement4);

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

var XHost = exports.XHost = function (_PartThemeElement5) {
  _inherits(XHost, _PartThemeElement5);

  function XHost() {
    _classCallCheck(this, XHost);

    return _possibleConstructorReturn(this, (XHost.__proto__ || Object.getPrototypeOf(XHost)).apply(this, arguments));
  }

  _createClass(XHost, null, [{
    key: 'template',
    get: function get() {
      return '\n        <style>\n          :host {\n            display: block;\n            border: 2px solid orange;\n          }\n          x-rating {\n            margin: 4px;\n          }\n          x-rating::part(subject) {\n            padding: 4px;\n            min-width: 20px;\n            display: inline-block;\n          }\n          x-rating {\n            --e1-part-subject-padding: 4px;\n          }\n          .uno:hover::part(subject) {\n            background: lightgreen;\n          }\n          .duo::part(subject) {\n            background: goldenrod;\n          }\n          .uno::part(rating-thumb-up) {\n            background: green;\n          }\n          .uno::part(rating-thumb-down) {\n            background: tomato;\n          }\n          .duo::part(rating-thumb-up) {\n            background: yellow;\n          }\n          .duo::part(rating-thumb-down) {\n            background: black;\n          }\n          x-rating::theme(thumb-up) {\n            border-radius: 8px;\n          }\n          x-rating::part(rating-input) {\n            background: #ccc;\n          }\n        </style>\n        <x-rating class="uno">\u2764\uFE0F</x-rating>\n        <br>\n        <x-rating class="duo">\uD83E\uDD37</x-rating>\n      ';
    }
  }]);

  return XHost;
}(PartThemeElement);

customElements.define('x-host', XHost);

var XAdvanced = exports.XAdvanced = function (_PartThemeElement6) {
  _inherits(XAdvanced, _PartThemeElement6);

  function XAdvanced() {
    _classCallCheck(this, XAdvanced);

    return _possibleConstructorReturn(this, (XAdvanced.__proto__ || Object.getPrototypeOf(XAdvanced)).apply(this, arguments));
  }

  _createClass(XAdvanced, null, [{
    key: 'template',
    get: function get() {
      return '\n        <style>\n          :host {\n            display: block;\n            border: 2px solid yellow;\n          }\n          ::theme(input)::placeholder {\n            color: orange;\n          }\n          ::theme(input-fancy) {\n            border: 20px dashed yellow;\n          }\n          ::theme(input-spazzy) {\n            margin: 100px;\n          }\n          x-thumbs2::part(thumb-up) {\n            border: 10px solid orange;\n          }\n          x-thumbs2::part(thumb-down) {\n            border: 10px solid orange;\n          }\n        </style>\n        <p>part + placeholder and dynamism<p>\n        <x-weird-input></x-weird-input>\n        <p>forwarding: only thumbs up should have a border<p>\n        <x-thumbs2></x-thumbs2>\n      ';
    }
  }]);

  return XAdvanced;
}(PartThemeElement);

customElements.define('x-advanced', XAdvanced);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxkZW1vcy5qcyIsInNjcmlwdHNcXGhlbHBlclxcYXBwbHlDc3MuanMiLCJzY3JpcHRzXFxoZWxwZXJcXGFwcGx5SnMuanMiLCJzY3JpcHRzXFxoZWxwZXJcXGhpZ2hsaWdodENvZGVIZWxwZXIuanMiLCJzY3JpcHRzXFxoaWdobGlnaHRFdmVudC5qcyIsInNjcmlwdHNcXHBhcnRUaGVtZVxcY29tcG9uZW50cy1zYW1wbGUuanMiLCJzY3JpcHRzXFxwYXJ0VGhlbWVcXGxpYnNcXHBhcnQtdGhlbWUuanMiLCJzY3JpcHRzXFxwcmV6LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7OztBQUNBOztBQUdBOzs7O0lBSWEsSyxXQUFBLEs7QUFFVCxxQkFBYztBQUFBOztBQUNWLFlBQUk7O0FBRUEsaUJBQUssV0FBTDs7QUFFQSxpQkFBSyxlQUFMO0FBRUgsU0FORCxDQU1FLE9BQU8sS0FBUCxFQUFjO0FBQ1osb0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFDSDtBQUVKOzs7O3NDQUVhO0FBQ1Y7QUFDQSxtQ0FDSSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBREo7QUFjSDs7OzBDQUVpQjs7QUFFZCxnQkFBSSxVQUFVLENBQUMsQ0FBZjtBQUNBLGdCQUFJLFlBQVksS0FBaEI7QUFDQSxnQkFBSSxhQUFhLFNBQWpCO0FBQ0EsZ0JBQU0sY0FBYyxTQUFTLGNBQVQsQ0FBd0IsbUJBQXhCLENBQXBCOztBQUVBLHFCQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkI7QUFDekIsb0JBQU0sU0FBVSxXQUFXLEtBQVgsR0FBbUIsV0FBVyxJQUEvQixHQUF1QyxNQUFNLE9BQTVEO0FBQ0Esb0JBQU0sU0FBUyxXQUFXLEtBQVgsR0FBbUIsQ0FBbEM7QUFDQSxvQkFBTSxPQUFPLFNBQVMsQ0FBVCxHQUFjLFNBQVMsTUFBdkIsR0FBa0MsU0FBVSxDQUFDLENBQUQsR0FB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Q0E7O0FBR0E7O0FBR0E7O0FBR0EsQ0FBQyxrQkFBa0I7O0FBR2YsbUJBQWUsUUFBZixHQUEwQjs7QUFFdEIsWUFBTSxXQUFXLE9BQU8sR0FBUCxJQUFjLE9BQU8sSUFBdEM7O0FBRUEsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYO0FBQ0E7QUFDSDtBQUVKOztBQU9ELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQXBCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCB7XHJcbiAgICBBcHBseUNzc1xyXG59IGZyb20gJy4vaGVscGVyL2FwcGx5Q3NzLmpzJztcclxuaW1wb3J0IHtcclxuICAgIEFwcGx5SlNcclxufSBmcm9tICcuL2hlbHBlci9hcHBseUpzLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZW1vcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RlbW9Dc3NWYXJJbkpTKCk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2RlbW9Dc3NWYXIoKSB7XHJcbiAgICAgICAgLyoqICovXHJcbiAgICAgICAgbmV3IEFwcGx5Q3NzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MnKSxcclxuICAgICAgICAgICAgYFxyXG4jcmVuZGVyLWVsZW1lbnR7XHJcbi0tYS1zdXBlci12YXI6ICNGRkY7XHJcbn1cclxuI3JlbmRlci1lbGVtZW50IC50ZXh0LTF7XHJcblxyXG59XHJcbiNyZW5kZXItZWxlbWVudCAudGV4dC0ye1xyXG5cclxufVxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVtb0Nzc1ZhckluSlMoKSB7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2VIID0gLTE7XHJcbiAgICAgICAgbGV0IHN1YnNjcmliZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBjbGllbnRSZWN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IGdob3N0UGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tZ2hvc3QtcGFyZW50Jyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NNb3VzZShldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWx0YVggPSAoY2xpZW50UmVjdC53aWR0aCArIGNsaWVudFJlY3QubGVmdCkgLSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgICAgICBjb25zdCBtZWRpYW4gPSBjbGllbnRSZWN0LndpZHRoIC8gMjtcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGRlbHRhWCA+IDAgPyAobWVkaWFuIC0gZGVsdGFYKSA6IChtZWRpYW4gKyAoLTEgKiBkZWx0YVgpKTtcclxuICAgICAgICAgICAgZ2hvc3RQYXJlbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wb3MnLCBgJHtsZWZ0fXB4YCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBkZWx0YVg6ICR7ZGVsdGFYfSAvIG1lZGlhbiA6ICR7bWVkaWFufSAvIHdpZHRoIDogJHt3aWR0aH0gLyBsZWZ0IDogJHtsZWZ0fWApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZ2hvc3Qtc3RhdGUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VIID0gUmV2ZWFsLmdldEluZGljZXMoKS5oO1xyXG4gICAgICAgICAgICAgICAgY2xpZW50UmVjdCA9IGdob3N0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgZ2hvc3RQYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcHJvY2Vzc01vdXNlKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlICYmIGluZGljZUggIT0gZXZlbnQuaW5kZXhoKSB7XHJcbiAgICAgICAgICAgICAgICBnaG9zdFBhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBwcm9jZXNzTW91c2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBuZXcgQXBwbHlDc3MoXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlbWlycm9yLWNzcy1pbi1qcy1jc3MnKSxcclxuICAgICAgICAgICAgYCNkZW1vLWdob3N0LXBhcmVudCB7XHJcbi0tbGVmdC1wb3M6MDtcclxufVxyXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tc2hhZG93LFxyXG4jZGVtby1naG9zdC1wYXJlbnQgLmRlbW8tZ2hvc3R7XHJcbmxlZnQ6IHZhcigtLWxlZnQtcG9zKTtcclxufWBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBuZXcgQXBwbHlKUyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZW1pcnJvci1jc3MtaW4tanMtanMnKSxcclxuICAgICAgICAgICAgYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT57XHJcbiAgICBjb25zdCBkZWx0YVggPSB0aGlzLndpZHRoIC0gZXZlbnQuY2xpZW50WDtcclxuICAgIGNvbnN0IG1lZGlhbiA9IHRoaXMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgZ2hvc3RQYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtby1naG9zdC1wYXJlbnQnKTtcclxuICAgIGNvbnN0IGxlZnQgPSBldmVudC5jbGllbnRYID4gbWVkaWFuID8gKGV2ZW50LmNsaWVudFggLSBtZWRpYW4pIDogLTEgKiAobWVkaWFuIC0gZXZlbnQuY2xpZW50WCk7XHJcblxyXG4gICAgZ2hvc3RQYXJlbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wb3MnLCBcXGBcXCR7bGVmdH1weFxcYCk7XHJcbn0pO1xyXG4gICAgICAgICAgICBgKTtcclxuXHJcbiAgICB9XHJcbn0iLCIndXNlIHN0aWN0J1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcGx5Q3NzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0h0bWxFbGVtZW50fSBlbHRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQ29udGVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIGluaXRpYWxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZWx0LCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcclxuICAgICAgICAgICAgbW9kZTogJ2NzcycsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6ICd0cnVlJyxcclxuICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93Q3Vyc29yV2hlblNlbGVjdGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxyXG4gICAgICAgICAgICB0aGVtZTogJ3NvbGFyaXplZCBkYXJrJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHRoaXMubmJFbHRzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBpZiAodGhpcy5zdHlsZS5zdHlsZVNoZWV0KXtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSAnJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XHJcbiAgICAgICAgY29kZU1pcnJvckNzcy5vbignY2hhbmdlJywgKC4uLm9iaikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5Q3NzKGNvZGVNaXJyb3JDc3MuZ2V0VmFsdWUoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hcHBseUNzcyhpbml0aWFsQ29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlDc3ModmFsdWUpe1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uYkVsdHM7IGkrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uYkVsdHMgPSAwO1xyXG4gICAgICAgIHZhbHVlLnNwbGl0KCd9JylcclxuICAgICAgICAgICAgLm1hcChzdHIgPT4gc3RyLnRyaW0oKSlcclxuICAgICAgICAgICAgLmZvckVhY2goc2VsZWN0b3JDc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvckNzcysnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmJFbHRzKys7XHJcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihlKTt9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RpY3QnXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwbHlKUyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIdG1sRWxlbWVudH0gZWx0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbENvbnRlbnRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBpbml0aWFsQ29udGVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvZGVNaXJyb3JKUyA9IENvZGVNaXJyb3IoZWx0LCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsQ29udGVudCxcclxuICAgICAgICAgICAgbW9kZTogJ2phdmFzY3JpcHQnLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiAndHJ1ZScsXHJcbiAgICAgICAgICAgIGZpeGVkR3V0dGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiAnbnVsbCcsXHJcbiAgICAgICAgICAgIHRoZW1lOiAnc29sYXJpemVkIGRhcmsnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvZGVNaXJyb3JKUy5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcclxuICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IE1JTl9UT1AgPSAnOTBweCc7XHJcbmNvbnN0IExJTkVfSEVJR0hUID0gJzEuMTVlbSc7XHJcbmNvbnN0IEFERElUSU9OTkFMX0hFSUdIVCA9ICcwLjRlbSc7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodENvZGVIZWxwZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIGtleUVsdCxcclxuICAgICAgICBwb3NpdGlvbkFycmF5XHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5lbHRIaWdsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBoaWdobGlnaHQtJHtrZXlFbHR9YCk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkFycmF5ID0gcG9zaXRpb25BcnJheTtcclxuICAgICAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKGBjb2RlLSR7a2V5RWx0fWAsIHRoaXMuX2xpc3RlbkZyYWdtZW50cy5iaW5kKHRoaXMpKTtcclxuICAgICAgICBSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcihgc3RvcC1jb2RlLSR7a2V5RWx0fWAsIHRoaXMuX3VucmVnaXN0ZXJGcmFnbWVudHMuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3Byb2dyZXNzRnJhZ21lbnQoZXZlbnQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IG51bGxcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdEluZGV4ICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gdGhpcy5wb3NpdGlvbkFycmF5W3RoaXMubGFzdEluZGV4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnZnJhZ21lbnRzaG93bicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB0aGlzLnBvc2l0aW9uQXJyYXlbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gK2V2ZW50LmZyYWdtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mcmFnbWVudC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIC8vIE9uIHJlc2V0IGxlcyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHRoaXMucG9zaXRpb25BcnJheVtpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBwcm9wZXJ0aWVzID8gT2JqZWN0LmtleXMocHJvcGVydGllcykgOiBbXTtcclxuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xpbmUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJMaW5lcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdjb2wnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnbmJDb2xzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ3RvcE1hcmdpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdsZWZ0TWFyZ2luJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXkgPT09ICdoZWlnaHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAnd2lkdGgnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5ID09PSAndG9wJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleSA9PT0gJ2xlZnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24udG9wTWFyZ2luID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcE1hcmdpbiA9IE1JTl9UT1A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLm5iTGluZXMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmhlaWdodCA9IExJTkVfSEVJR0hUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5saW5lID09PSB1bmRlZmluZWQgJiYgYXJlYS50b3AgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS50b3AgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5uYkNvbHMgPT09IHVuZGVmaW5lZCAmJiBhcmVhLndpZHRoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGFyZWEud2lkdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5jb2wgPT09IHVuZGVmaW5lZCAmJiBhcmVhLmxlZnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYS5sZWZ0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LmFyZWEgPSBhcmVhO1xyXG4gICAgICAgICAgICB0aGlzLmVsdEhpZ2xpZ2h0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2xpc3RlbkZyYWdtZW50cygpIHtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50KHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbml0XCIsXHJcbiAgICAgICAgICAgIGZyYWdtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuZnJhZ21lbnQudmlzaWJsZScpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VucmVnaXN0ZXJGcmFnbWVudHMoKSB7XHJcbiAgICAgICAgUmV2ZWFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCB0aGlzLl9wcm9ncmVzc0ZyYWdtZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFJldmVhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIHRoaXMuX3Byb2dyZXNzRnJhZ21lbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEhpZ2hsaWdodENvZGVIZWxwZXJcclxufSBmcm9tICcuL2hlbHBlci9oaWdobGlnaHRDb2RlSGVscGVyLmpzJztcclxuXHJcbmNvbnN0IExJTkVfSEVJR0hUID0gMS4xNTtcclxuY29uc3QgQURESVRJT05OQUxfSEVJR1QgPSAwLjQ7XHJcbmNvbnN0IENPTF9XSURUSCA9IDM1O1xyXG5cclxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodEV2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyAgQ3NzIFZhcmlhYmxlIERlY2xhcmF0aW9uXHJcbiAgICAgICAgbmV3IEhpZ2hsaWdodENvZGVIZWxwZXIoe1xyXG4gICAgICAgICAgICBrZXlFbHQ6ICdjc3MtdmFyaWFibGUnLFxyXG4gICAgICAgICAgICAvLyBXZSBzdGFydCB3aXRoIHRoZSBmaXJzdCBmcmFnbWVudCAodGhlIGluaXRpYWwgcG9zaXRpb24gaXMgZml4ZWQgYnkgY3NzKVxyXG4gICAgICAgICAgICBwb3NpdGlvbkFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgbGluZTogMSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogNSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGluZTogOSxcclxuICAgICAgICAgICAgICAgIG5iTGluZXM6IDQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwJSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIENzcyBWYXJpYWJsZSBEZWNsYXJhdGlvbiBpbiBKU1xyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAnY3NzLXZhcmlhYmxlLWluLWpzJyxcclxuICAgICAgICAgICAgLy8gV2Ugc3RhcnQgd2l0aCB0aGUgZmlyc3QgZnJhZ21lbnQgKHRoZSBpbml0aWFsIHBvc2l0aW9uIGlzIGZpeGVkIGJ5IGNzcylcclxuICAgICAgICAgICAgcG9zaXRpb25BcnJheTogW3tcclxuICAgICAgICAgICAgICAgIHRvcDogJzEwMHB4JyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJzI2MHB4JyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICczNTBweCcsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICczMDBweCcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzYwJSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIDo6UGFydFxyXG4gICAgICAgIG5ldyBIaWdobGlnaHRDb2RlSGVscGVyKHtcclxuICAgICAgICAgICAga2V5RWx0OiAncGFydCcsXHJcbiAgICAgICAgICAgIC8vIFdlIHN0YXJ0IHdpdGggdGhlIGZpcnN0IGZyYWdtZW50ICh0aGUgaW5pdGlhbCBwb3NpdGlvbiBpcyBmaXhlZCBieSBjc3MpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uQXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiAzLFxyXG4gICAgICAgICAgICAgICAgbmJMaW5lczogNCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAlJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7UGFydFRoZW1lTWl4aW59IGZyb20gJy4vbGlicy9wYXJ0LXRoZW1lLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0VGhlbWVFbGVtZW50IGV4dGVuZHMgUGFydFRoZW1lTWl4aW4oSFRNTEVsZW1lbnQpIHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgYDtcclxuICAgIH1cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICBpZiAoIXRoaXMuc2hhZG93Um9vdCkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5jb25zdHJ1Y3Rvci50ZW1wbGF0ZTtcclxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5jb25zdHJ1Y3Rvci5fdGVtcGxhdGVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcclxuICAgICAgICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LmltcG9ydE5vZGUoXHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX3RlbXBsYXRlRWxlbWVudC5jb250ZW50LCB0cnVlKTtcclxuICAgICAgICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChkb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBYVGh1bWJzIGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLXVwXCI+8J+RjTwvZGl2PlxyXG4gICAgICAgIDxkaXYgcGFydD1cInRodW1iLWRvd25cIj7wn5GOPC9kaXY+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ3gtdGh1bWJzJywgWFRodW1icyk7XHJcblxyXG5leHBvcnQgY2xhc3MgWFdlaXJkSW5wdXQgZXh0ZW5kcyBQYXJ0VGhlbWVFbGVtZW50IHtcclxuICAgIHN0YXRpYyBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGlucHV0IHBhcnQ9XCJpbnB1dFwiIHBsYWNlaG9sZGVyPVwid2VpcmRcIj5cclxuICAgICAgYDtcclxuICAgIH1cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICBjb25zdCBpbml0aWFsaXppbmcgPSAhdGhpcy5zaGFkb3dSb290O1xyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgICBpZiAoaW5pdGlhbGl6aW5nKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3BhcnQnLCBpbnB1dC52YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLl9hcHBseVBhcnRUaGVtZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC13ZWlyZC1pbnB1dCcsIFhXZWlyZElucHV0KTtcclxuXHJcbmV4cG9ydCBjbGFzcyBYVGh1bWJzMiBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8eC10aHVtYnMgcGFydD1cInRodW1iLXVwID0+IHRodW1iLXVwXCI+PC94LXRodW1icz5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXRodW1iczInLCBYVGh1bWJzMik7XHJcblxyXG5leHBvcnQgY2xhc3MgWFJhdGluZyBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgICA6aG9zdCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCBncmVlbjtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogYmx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtdGh1bWJzOjpwYXJ0KHRodW1iLWRvd24pIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIHJlZDtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4O1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgIH1cclxuICAgICAgICA8L3N0eWxlPlxyXG4gICAgICAgIDxkaXYgcGFydD1cInN1YmplY3RcIj48c2xvdD48L3Nsb3Q+PC9kaXY+XHJcbiAgICAgICAgPHgtdGh1bWJzIHBhcnQ9XCIqID0+IHJhdGluZy0qXCI+PC94LXRodW1icz5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LXJhdGluZycsIFhSYXRpbmcpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFhIb3N0IGV4dGVuZHMgUGFydFRoZW1lRWxlbWVudCB7XHJcbiAgICBzdGF0aWMgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxzdHlsZT5cclxuICAgICAgICAgIDpob3N0IHtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIG9yYW5nZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nIHtcclxuICAgICAgICAgICAgbWFyZ2luOiA0cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweDtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXJhdGluZyB7XHJcbiAgICAgICAgICAgIC0tZTEtcGFydC1zdWJqZWN0LXBhZGRpbmc6IDRweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86aG92ZXI6OnBhcnQoc3ViamVjdCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLmR1bzo6cGFydChzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdvbGRlbnJvZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC51bm86OnBhcnQocmF0aW5nLXRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdyZWVuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLnVubzo6cGFydChyYXRpbmctdGh1bWItZG93bikge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0b21hdG87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi11cCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB5ZWxsb3c7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAuZHVvOjpwYXJ0KHJhdGluZy10aHVtYi1kb3duKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeC1yYXRpbmc6OnRoZW1lKHRodW1iLXVwKSB7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtcmF0aW5nOjpwYXJ0KHJhdGluZy1pbnB1dCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjY2NjO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDwvc3R5bGU+XHJcbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwidW5vXCI+4p2k77iPPC94LXJhdGluZz5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPHgtcmF0aW5nIGNsYXNzPVwiZHVvXCI+8J+ktzwveC1yYXRpbmc+XHJcbiAgICAgIGA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgneC1ob3N0JywgWEhvc3QpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFhBZHZhbmNlZCBleHRlbmRzIFBhcnRUaGVtZUVsZW1lbnQge1xyXG4gICAgc3RhdGljIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgICA6aG9zdCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCB5ZWxsb3c7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICA6OnRoZW1lKGlucHV0KTo6cGxhY2Vob2xkZXIge1xyXG4gICAgICAgICAgICBjb2xvcjogb3JhbmdlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgOjp0aGVtZShpbnB1dC1mYW5jeSkge1xyXG4gICAgICAgICAgICBib3JkZXI6IDIwcHggZGFzaGVkIHllbGxvdztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIDo6dGhlbWUoaW5wdXQtc3Bhenp5KSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMTAwcHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4LXRodW1iczI6OnBhcnQodGh1bWItdXApIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxMHB4IHNvbGlkIG9yYW5nZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHgtdGh1bWJzMjo6cGFydCh0aHVtYi1kb3duKSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMTBweCBzb2xpZCBvcmFuZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICA8cD5wYXJ0ICsgcGxhY2Vob2xkZXIgYW5kIGR5bmFtaXNtPHA+XHJcbiAgICAgICAgPHgtd2VpcmQtaW5wdXQ+PC94LXdlaXJkLWlucHV0PlxyXG4gICAgICAgIDxwPmZvcndhcmRpbmc6IG9ubHkgdGh1bWJzIHVwIHNob3VsZCBoYXZlIGEgYm9yZGVyPHA+XHJcbiAgICAgICAgPHgtdGh1bWJzMj48L3gtdGh1bWJzMj5cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd4LWFkdmFuY2VkJywgWEFkdmFuY2VkKTsiLCIvKlxuQGxpY2Vuc2VcbkNvcHlyaWdodCAoYykgMjAxNyBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5UaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG5UaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG5Db2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiovXG5cbmNvbnN0IHBhcnREYXRhS2V5ID0gJ19fY3NzUGFydHMnO1xuY29uc3QgcGFydElkS2V5ID0gJ19fcGFydElkJztcblxuLyoqXG4gKiBDb252ZXJ0cyBhbnkgc3R5bGUgZWxlbWVudHMgaW4gdGhlIHNoYWRvd1Jvb3QgdG8gcmVwbGFjZSA6OnBhcnQvOjp0aGVtZVxuICogd2l0aCBjdXN0b20gcHJvcGVydGllcyB1c2VkIHRvIHRyYW5zbWl0IHRoaXMgZGF0YSBkb3duIHRoZSBkb20gdHJlZS4gQWxzb1xuICogY2FjaGVzIHBhcnQgbWV0YWRhdGEgZm9yIGxhdGVyIGxvb2t1cC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQYXJ0cyhlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudC5zaGFkb3dSb290KSB7XG4gICAgZWxlbWVudFtwYXJ0RGF0YUtleV0gPSBudWxsO1xuICAgIHJldHVybjtcbiAgfVxuICBBcnJheS5mcm9tKGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpKS5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICBjb25zdCBpbmZvID0gcGFydENzc1RvQ3VzdG9tUHJvcENzcyhlbGVtZW50LCBzdHlsZS50ZXh0Q29udGVudCk7XG4gICAgaWYgKGluZm8ucGFydHMpIHtcbiAgICAgIGVsZW1lbnRbcGFydERhdGFLZXldID0gZWxlbWVudFtwYXJ0RGF0YUtleV0gfHwgW107XG4gICAgICBlbGVtZW50W3BhcnREYXRhS2V5XS5wdXNoKC4uLmluZm8ucGFydHMpO1xuICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBpbmZvLmNzcztcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50Lmhhc093blByb3BlcnR5KCdfX2Nzc1BhcnRzJykpIHtcbiAgICBpbml0aWFsaXplUGFydHMoZWxlbWVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFydERhdGFGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgZW5zdXJlUGFydERhdGEoZWxlbWVudCk7XG4gIHJldHVybiBlbGVtZW50W3BhcnREYXRhS2V5XTtcbn1cblxuLy8gVE9ETyhzb3J2ZWxsKTogYnJpdHRsZSBkdWUgdG8gcmVnZXgtaW5nIGNzcy4gSW5zdGVhZCB1c2UgYSBjc3MgcGFyc2VyLlxuLyoqXG4gKiBUdXJucyBjc3MgdXNpbmcgYDo6cGFydGAgaW50byBjc3MgdXNpbmcgdmFyaWFibGVzIGZvciB0aG9zZSBwYXJ0cy5cbiAqIEFsc28gcmV0dXJucyBwYXJ0IG1ldGFkYXRhLlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge3N0cmluZ30gY3NzVGV4dFxuICogQHJldHVybnMge09iamVjdH0gY3NzOiBwYXJ0aWZpZWQgY3NzLCBwYXJ0czogYXJyYXkgb2YgcGFydHMgb2YgdGhlIGZvcm1cbiAqIHtuYW1lLCBzZWxlY3RvciwgcHJvcHN9XG4gKiBFeGFtcGxlIG9mIHBhcnQtaWZpZWQgY3NzLCBnaXZlbjpcbiAqIC5mb286OnBhcnQoYmFyKSB7IGNvbG9yOiByZWQgfVxuICogb3V0cHV0OlxuICogLmZvbyB7IC0tZTEtcGFydC1iYXItY29sb3I6IHJlZDsgfVxuICogd2hlcmUgYGUxYCBpcyBhIGd1aWQgZm9yIHRoaXMgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gcGFydENzc1RvQ3VzdG9tUHJvcENzcyhlbGVtZW50LCBjc3NUZXh0KSB7XG4gIGxldCBwYXJ0cztcbiAgbGV0IGNzcyA9IGNzc1RleHQucmVwbGFjZShjc3NSZSwgKG0sIHNlbGVjdG9yLCB0eXBlLCBuYW1lLCBlbmRTZWxlY3RvciwgcHJvcHNTdHIpID0+IHtcbiAgICBwYXJ0cyA9IHBhcnRzIHx8IFtdO1xuICAgIGxldCBwcm9wcyA9IHt9O1xuICAgIGNvbnN0IHByb3BzQXJyYXkgPSBwcm9wc1N0ci5zcGxpdCgvXFxzKjtcXHMqLyk7XG4gICAgcHJvcHNBcnJheS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgY29uc3QgcyA9IHByb3Auc3BsaXQoJzonKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBzLnNoaWZ0KCkudHJpbSgpO1xuICAgICAgY29uc3QgdmFsdWUgPSBzLmpvaW4oJzonKTtcbiAgICAgIHByb3BzW25hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgY29uc3QgaWQgPSBwYXJ0SWRGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIHBhcnRzLnB1c2goe3NlbGVjdG9yLCBlbmRTZWxlY3RvciwgbmFtZSwgcHJvcHMsIGlzVGhlbWU6IHR5cGUgPT0gdGhlbWV9KTtcbiAgICBsZXQgcGFydFByb3BzID0gJyc7XG4gICAgZm9yIChsZXQgcCBpbiBwcm9wcykge1xuICAgICAgcGFydFByb3BzID0gYCR7cGFydFByb3BzfVxcblxcdCR7dmFyRm9yUGFydChpZCwgbmFtZSwgcCwgZW5kU2VsZWN0b3IpfTogJHtwcm9wc1twXX07YDtcbiAgICB9XG4gICAgcmV0dXJuIGBcXG4ke3NlbGVjdG9yIHx8ICcqJ30ge1xcblxcdCR7cGFydFByb3BzLnRyaW0oKX1cXG59YDtcbiAgfSk7XG4gIHJldHVybiB7cGFydHMsIGNzc307XG59XG5cbi8vIGd1aWQgZm9yIGVsZW1lbnQgcGFydCBzY29wZXNcbmxldCBwYXJ0SWQgPSAwO1xuZnVuY3Rpb24gcGFydElkRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50W3BhcnRJZEtleV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgZWxlbWVudFtwYXJ0SWRLZXldID0gcGFydElkKys7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRbcGFydElkS2V5XTtcbn1cblxuY29uc3QgdGhlbWUgPSAnOjp0aGVtZSc7XG5jb25zdCBjc3NSZSA9IC9cXHMqKC4qKSg6Oig/OnBhcnR8dGhlbWUpKVxcKChbXildKylcXCkoW15cXHN7XSopXFxzKntcXHMqKFtefV0qKVxccyp9L2dcblxuLy8gY3JlYXRlcyBhIGN1c3RvbSBwcm9wZXJ0eSBuYW1lIGZvciBhIHBhcnQuXG5mdW5jdGlvbiB2YXJGb3JQYXJ0KGlkLCBuYW1lLCBwcm9wLCBlbmRTZWxlY3Rvcikge1xuICByZXR1cm4gYC0tZSR7aWR9LXBhcnQtJHtuYW1lfS0ke3Byb3B9JHtlbmRTZWxlY3RvciA/IGAtJHtlbmRTZWxlY3Rvci5yZXBsYWNlKC9cXDovZywgJycpfWAgOiAnJ31gO1xufVxuXG4vKipcbiAqIFByb2R1Y2VzIGEgc3R5bGUgdXNpbmcgY3NzIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIHN0eWxlIDo6cGFydC86OnRoZW1lXG4gKiBmb3IgYWxsIHRoZSBkb20gaW4gdGhlIGVsZW1lbnQncyBzaGFkb3dSb290LlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhcnRUaGVtZShlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICBjb25zdCBvbGRTdHlsZSA9IGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdzdHlsZVtwYXJ0c10nKTtcbiAgICBpZiAob2xkU3R5bGUpIHtcbiAgICAgIG9sZFN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkU3R5bGUpO1xuICAgIH1cbiAgfVxuICBjb25zdCBob3N0ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpLmhvc3Q7XG4gIGlmIChob3N0KSB7XG4gICAgLy8gbm90ZTogZW5zdXJlIGhvc3QgaGFzIHBhcnQgZGF0YSBzbyB0aGF0IGVsZW1lbnRzIHRoYXQgYm9vdCB1cFxuICAgIC8vIHdoaWxlIHRoZSBob3N0IGlzIGJlaW5nIGNvbm5lY3RlZCBjYW4gc3R5bGUgcGFydHMuXG4gICAgZW5zdXJlUGFydERhdGEoaG9zdCk7XG4gICAgY29uc3QgY3NzID0gY3NzRm9yRWxlbWVudERvbShlbGVtZW50KTtcbiAgICBpZiAoY3NzKSB7XG4gICAgICBjb25zdCBuZXdTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBuZXdTdHlsZS50ZXh0Q29udGVudCA9IGNzcztcbiAgICAgIGVsZW1lbnQuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChuZXdTdHlsZSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJvZHVjZXMgY3NzVGV4dCBhIHN0eWxlIGVsZW1lbnQgdG8gYXBwbHkgcGFydCBjc3MgdG8gYSBnaXZlbiBlbGVtZW50LlxuICogVGhlIGVsZW1lbnQncyBzaGFkb3dSb290IGRvbSBpcyBzY2FubmVkIGZvciBub2RlcyB3aXRoIGEgYHBhcnRgIGF0dHJpYnV0ZS5cbiAqIFRoZW4gc2VsZWN0b3JzIGFyZSBjcmVhdGVkIG1hdGNoaW5nIHRoZSBwYXJ0IGF0dHJpYnV0ZSBjb250YWluaW5nIHByb3BlcnRpZXNcbiAqIHdpdGggcGFydHMgZGVmaW5lZCBpbiB0aGUgZWxlbWVudCdzIGhvc3QuXG4gKiBUaGUgYW5jZXN0b3IgdHJlZSBpcyB0cmF2ZXJzZWQgZm9yIGZvcndhcmRlZCBwYXJ0cyBhbmQgdGhlbWUuXG4gKiBlLmcuXG4gKiBbcGFydD1cImJhclwiXSB7XG4gKiAgIGNvbG9yOiB2YXIoLS1lMS1wYXJ0LWJhci1jb2xvcik7XG4gKiB9XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCBmb3Igd2hpY2ggdG8gYXBwbHkgcGFydCBjc3NcbiAqL1xuZnVuY3Rpb24gY3NzRm9yRWxlbWVudERvbShlbGVtZW50KSB7XG4gIGVuc3VyZVBhcnREYXRhKGVsZW1lbnQpO1xuICBjb25zdCBpZCA9IHBhcnRJZEZvckVsZW1lbnQoZWxlbWVudCk7XG4gIGNvbnN0IHBhcnROb2RlcyA9IGVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdbcGFydF0nKTtcbiAgbGV0IGNzcyA9ICcnO1xuICBmb3IgKGxldCBpPTA7IGkgPCBwYXJ0Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBhdHRyID0gcGFydE5vZGVzW2ldLmdldEF0dHJpYnV0ZSgncGFydCcpO1xuICAgIGNvbnN0IHBhcnRJbmZvID0gcGFydEluZm9Gcm9tQXR0cihhdHRyKTtcbiAgICBjc3MgPSBgJHtjc3N9XFxuXFx0JHtydWxlRm9yUGFydEluZm8ocGFydEluZm8sIGF0dHIsIGVsZW1lbnQpfWBcbiAgfVxuICByZXR1cm4gY3NzO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBjc3MgcnVsZSB0aGF0IGFwcGxpZXMgYSBwYXJ0LlxuICogQHBhcmFtIHsqfSBwYXJ0SW5mbyBBcnJheSBvZiBwYXJ0IGluZm8gZnJvbSBwYXJ0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsqfSBhdHRyIFBhcnQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyp9IGVsZW1lbnQgRWxlbWVudCB3aXRoaW4gd2hpY2ggdGhlIHBhcnQgZXhpc3RzXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUZXh0IG9mIHRoZSBjc3MgcnVsZSBvZiB0aGUgZm9ybSBgc2VsZWN0b3IgeyBwcm9wZXJ0aWVzIH1gXG4gKi9cbmZ1bmN0aW9uIHJ1bGVGb3JQYXJ0SW5mbyhwYXJ0SW5mbywgYXR0ciwgZWxlbWVudCkge1xuICBsZXQgdGV4dCA9ICcnO1xuICBwYXJ0SW5mby5mb3JFYWNoKGluZm8gPT4ge1xuICAgIGlmICghaW5mby5mb3J3YXJkKSB7XG4gICAgICBjb25zdCBwcm9wcyA9IHByb3BzRm9yUGFydChpbmZvLm5hbWUsIGVsZW1lbnQpO1xuICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IGJ1Y2tldCBpbiBwcm9wcykge1xuICAgICAgICAgIGxldCBwcm9wc0J1Y2tldCA9IHByb3BzW2J1Y2tldF07XG4gICAgICAgICAgbGV0IHBhcnRQcm9wcyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IHAgaW4gcHJvcHNCdWNrZXQpIHtcbiAgICAgICAgICAgIHBhcnRQcm9wcy5wdXNoKGAke3B9OiAke3Byb3BzQnVja2V0W3BdfTtgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGV4dCA9IGAke3RleHR9XFxuW3BhcnQ9XCIke2F0dHJ9XCJdJHtidWNrZXR9IHtcXG5cXHQke3BhcnRQcm9wcy5qb2luKCdcXG5cXHQnKX1cXG59YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0ZXh0O1xufVxuXG4vKipcbiAqIFBhcnNlcyBhIHBhcnQgYXR0cmlidXRlIGludG8gYW4gYXJyYXkgb2YgcGFydCBpbmZvXG4gKiBAcGFyYW0geyp9IGF0dHIgUGFydCBhdHRyaWJ1dGUgdmFsdWVcbiAqIEByZXR1cm5zIHthcnJheX0gQXJyYXkgb2YgcGFydCBpbmZvIG9iamVjdHMgb2YgdGhlIGZvcm0ge25hbWUsIGZvd2FyZH1cbiAqL1xuZnVuY3Rpb24gcGFydEluZm9Gcm9tQXR0cihhdHRyKSB7XG4gIGNvbnN0IHBpZWNlcyA9IGF0dHIgPyBhdHRyLnNwbGl0KC9cXHMqLFxccyovKSA6IFtdO1xuICBsZXQgcGFydHMgPSBbXTtcbiAgcGllY2VzLmZvckVhY2gocCA9PiB7XG4gICAgY29uc3QgbSA9IHAgPyBwLm1hdGNoKC8oW149XFxzXSopKD86XFxzKj0+XFxzKiguKikpPy8pIDogW107XG4gICAgaWYgKG0pIHtcbiAgICAgIHBhcnRzLnB1c2goe25hbWU6IG1bMl0gfHwgbVsxXSwgZm9yd2FyZDogbVsyXSA/IG1bMV0gOiBudWxsfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vKipcbiAqIEZvciBhIGdpdmVuIHBhcnQgbmFtZSByZXR1cm5zIGEgcHJvcGVydGllcyBvYmplY3Qgd2hpY2ggc2V0cyBhbnkgYW5jZXN0b3JcbiAqIHByb3ZpZGVkIHBhcnQgcHJvcGVydGllcyB0byB0aGUgcHJvcGVyIGFuY2VzdG9yIHByb3ZpZGVkIGNzcyB2YXJpYWJsZSBuYW1lLlxuICogZS5nLlxuICogY29sb3I6IGB2YXIoLS1lMS1wYXJ0LWJhci1jb2xvcik7YFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwYXJ0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aXRoaW4gd2hpY2ggZG9tIHdpdGggcGFydCBleGlzdHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVxdWlyZVRoZW1lIFRydWUgaWYgb25seSA6OnRoZW1lIHNob3VsZCBiZSBjb2xsZWN0ZWQuXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYmplY3Qgb2YgcHJvcGVydGllcyBmb3IgdGhlIGdpdmVuIHBhcnQgc2V0IHRvIHBhcnQgdmFyaWFibGVzXG4gKiBwcm92aWRlZCBieSB0aGUgZWxlbWVudHMgYW5jZXN0b3JzLlxuICovXG5mdW5jdGlvbiBwcm9wc0ZvclBhcnQobmFtZSwgZWxlbWVudCwgcmVxdWlyZVRoZW1lKSB7XG4gIGNvbnN0IGhvc3QgPSBlbGVtZW50ICYmIGVsZW1lbnQuZ2V0Um9vdE5vZGUoKS5ob3N0O1xuICBpZiAoIWhvc3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gY29sbGVjdCBwcm9wcyBmcm9tIGhvc3QgZWxlbWVudC5cbiAgbGV0IHByb3BzID0gcHJvcHNGcm9tRWxlbWVudChuYW1lLCBob3N0LCByZXF1aXJlVGhlbWUpO1xuICAvLyBub3cgcmVjdXJzZSBhbmNlc3RvcnMgdG8gZmluZCBtYXRjaGluZyBgdGhlbWVgIHByb3BlcnRpZXNcbiAgY29uc3QgdGhlbWVQcm9wcyA9IHByb3BzRm9yUGFydChuYW1lLCBob3N0LCB0cnVlKTtcbiAgcHJvcHMgPSBtaXhQYXJ0UHJvcHMocHJvcHMsIHRoZW1lUHJvcHMpO1xuICAvLyBub3cgcmVjdXJzZSBhbmNlc3RvcnMgdG8gZmluZCAqZm9yd2FyZGVkKiBwYXJ0IHByb3BlcnRpZXNcbiAgaWYgKCFyZXF1aXJlVGhlbWUpIHtcbiAgICAvLyBmb3J3YXJkaW5nOiByZWN1cnNlcyB1cCBhbmNlc3RvciB0cmVlIVxuICAgIGNvbnN0IHBhcnRJbmZvID0gcGFydEluZm9Gcm9tQXR0cihlbGVtZW50LmdldEF0dHJpYnV0ZSgncGFydCcpKTtcbiAgICAvLyB7bmFtZSwgZm9yd2FyZH0gd2hlcmUgYCpgIGNhbiBiZSBpbmNsdWRlZFxuICAgIHBhcnRJbmZvLmZvckVhY2goaW5mbyA9PiB7XG4gICAgICBsZXQgY2F0Y2hBbGwgPSBpbmZvLmZvcndhcmQgJiYgKGluZm8uZm9yd2FyZC5pbmRleE9mKCcqJykgPj0gMCk7XG4gICAgICBpZiAobmFtZSA9PSBpbmZvLmZvcndhcmQgfHwgY2F0Y2hBbGwpIHtcbiAgICAgICAgY29uc3QgYW5jZXN0b3JOYW1lID0gY2F0Y2hBbGwgPyBpbmZvLm5hbWUucmVwbGFjZSgnKicsIG5hbWUpIDogaW5mby5uYW1lO1xuICAgICAgICBjb25zdCBmb3J3YXJkZWQgPSBwcm9wc0ZvclBhcnQoYW5jZXN0b3JOYW1lLCBob3N0KTtcbiAgICAgICAgcHJvcHMgPSBtaXhQYXJ0UHJvcHMocHJvcHMsIGZvcndhcmRlZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcHJvcHM7XG59XG5cbi8qKlxuICogQ29sbGVjdHMgY3NzIGZvciB0aGUgZ2l2ZW4gbmFtZSBmcm9tIHRoZSBwYXJ0IGRhdGEgZm9yIHRoZSBnaXZlblxuICogZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHBhcnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdpdGggcGFydCBjc3MvZGF0YS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVxdWlyZVRoZW1lIFRydWUgaWYgc2hvdWxkIG9ubHkgbWF0Y2ggOjp0aGVtZVxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHByb3BlcnRpZXMgZm9yIHRoZSBnaXZlbiBwYXJ0IHNldCB0byBwYXJ0IHZhcmlhYmxlc1xuICogcHJvdmlkZWQgYnkgdGhlIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHByb3BzRnJvbUVsZW1lbnQobmFtZSwgZWxlbWVudCwgcmVxdWlyZVRoZW1lKSB7XG4gIGxldCBwcm9wcztcbiAgY29uc3QgcGFydHMgPSBwYXJ0RGF0YUZvckVsZW1lbnQoZWxlbWVudCk7XG4gIGlmIChwYXJ0cykge1xuICAgIGNvbnN0IGlkID0gcGFydElkRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBpZiAocGFydHMpIHtcbiAgICAgIHBhcnRzLmZvckVhY2goKHBhcnQpID0+IHtcbiAgICAgICAgaWYgKHBhcnQubmFtZSA9PSBuYW1lICYmICghcmVxdWlyZVRoZW1lIHx8IHBhcnQuaXNUaGVtZSkpIHtcbiAgICAgICAgICBwcm9wcyA9IGFkZFBhcnRQcm9wcyhwcm9wcywgcGFydCwgaWQsIG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb3BzO1xufVxuXG4vKipcbiAqIEFkZCBwYXJ0IGNzcyB0byB0aGUgcHJvcHMgb2JqZWN0IGZvciB0aGUgZ2l2ZW4gcGFydC9uYW1lLlxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzIE9iamVjdCBjb250YWluaW5nIHBhcnQgY3NzXG4gKiBAcGFyYW0ge29iamVjdH0gcGFydCBQYXJ0IGRhdGFcbiAqIEBwYXJhbSB7bm1iZXJ9IGlkIGVsZW1lbnQgcGFydCBpZFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiBwYXJ0XG4gKi9cbmZ1bmN0aW9uIGFkZFBhcnRQcm9wcyhwcm9wcywgcGFydCwgaWQsIG5hbWUpIHtcbiAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgY29uc3QgYnVja2V0ID0gcGFydC5lbmRTZWxlY3RvciB8fCAnJztcbiAgY29uc3QgYiA9IHByb3BzW2J1Y2tldF0gPSBwcm9wc1tidWNrZXRdIHx8IHt9O1xuICBmb3IgKGxldCBwIGluIHBhcnQucHJvcHMpIHtcbiAgICBiW3BdID0gYHZhcigke3ZhckZvclBhcnQoaWQsIG5hbWUsIHAsIHBhcnQuZW5kU2VsZWN0b3IpfSlgO1xuICB9XG4gIHJldHVybiBwcm9wcztcbn1cblxuZnVuY3Rpb24gbWl4UGFydFByb3BzKGEsIGIpIHtcbiAgaWYgKGEgJiYgYikge1xuICAgIGZvciAobGV0IGkgaW4gYikge1xuICAgICAgLy8gZW5zdXJlIHN0b3JhZ2UgZXhpc3RzXG4gICAgICBpZiAoIWFbaV0pIHtcbiAgICAgICAgYVtpXSA9IHt9O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmFzc2lnbihhW2ldLCBiW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGEgfHwgYjtcbn1cblxuLyoqXG4gKiBDdXN0b21FbGVtZW50IG1peGluIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gcHJvdmlkZSA6OnBhcnQvOjp0aGVtZSBzdXBwb3J0LlxuICogQHBhcmFtIHsqfSBzdXBlckNsYXNzXG4gKi9cbmV4cG9ydCBsZXQgUGFydFRoZW1lTWl4aW4gPSBzdXBlckNsYXNzID0+IHtcblxuICByZXR1cm4gY2xhc3MgUGFydFRoZW1lQ2xhc3MgZXh0ZW5kcyBzdXBlckNsYXNzIHtcblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgaWYgKHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKSB7XG4gICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5fYXBwbHlQYXJ0VGhlbWUoKSk7XG4gICAgfVxuXG4gICAgX2FwcGx5UGFydFRoZW1lKCkge1xuICAgICAgYXBwbHlQYXJ0VGhlbWUodGhpcyk7XG4gICAgfVxuXG4gIH1cblxufTtcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgSGlnaGxpZ2h0RXZlbnRzXHJcbn0gZnJvbSAnLi9oaWdobGlnaHRFdmVudC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBEZW1vc1xyXG59IGZyb20gJy4vZGVtb3MuanMnO1xyXG5pbXBvcnQgeyBYQWR2YW5jZWQsIFhIb3N0LCBYUmF0aW5nLCBYVGh1bWJzMiwgWFdlaXJkSW5wdXQsIFhUaHVtYnMgfSBmcm9tICcuL3BhcnRUaGVtZS9jb21wb25lbnRzLXNhbXBsZS5qcyc7XHJcblxyXG5cclxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gcGFnZUxvYWQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluSWZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcclxuXHJcbiAgICAgICAgaWYgKCFpbklmcmFtZSkge1xyXG4gICAgICAgICAgICBuZXcgRGVtb3MoKTtcclxuICAgICAgICAgICAgbmV3IEhpZ2hsaWdodEV2ZW50cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcclxufSkoKTsiXX0=
