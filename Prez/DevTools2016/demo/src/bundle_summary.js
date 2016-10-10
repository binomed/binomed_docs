(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _firebase = require('./firebase/firebase.js');

(function () {

    function pageLoad() {

        var fireBaseLego = new _firebase.FireBaseLegoApp().app;

        fireBaseLego.database().ref('drawShow').once('value', function (snapshot) {
            if (snapshot && snapshot.val()) {
                (function () {
                    var snapshotFb = snapshot.val();
                    var keys = Object.keys(snapshotFb);
                    var domParent = document.createElement('section');
                    domParent.classList.add('parent-snapshots');
                    keys.forEach(function (key) {
                        return addElement(snapshotFb[key], domParent);
                    });

                    document.getElementById('game').appendChild(domParent);
                })();
            }
        });
    }

    function addElement(draw, domParent) {

        var imgParent = document.createElement('div');
        var img = document.createElement('img');
        img.src = draw.dataUrl;
        img.classList.add('img-ori');
        imgParent.classList.add('img-ori-parent');
        imgParent.setAttribute('data-author', draw.user);
        imgParent.appendChild(img);
        imgParent.classList.add('big');
        domParent.appendChild(imgParent);
    }

    window.addEventListener('load', pageLoad);
})();

},{"./firebase/firebase.js":2}],2:[function(require,module,exports){
'use strict';

/**
 * Basic Firebase helper
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FireBaseLegoApp = exports.FireBaseLegoApp = function FireBaseLegoApp() {
    _classCallCheck(this, FireBaseLegoApp);

    // Configuration of the application, You should update with your Keys !
    this.config = {
        apiKey: "AIzaSyDr9R85tNjfKWddW1-N7XJpAhGqXNGaJ5k",
        authDomain: "legonnary.firebaseapp.com",
        databaseURL: "https://legonnary.firebaseio.com",
        storageBucket: ""
    };

    this.app = firebase.initializeApp(this.config);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHBfc3VtbWFyeS5qcyIsInNyYy9zY3JpcHRzL2ZpcmViYXNlL2ZpcmViYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0E7O0FBRUEsQ0FBQyxZQUFZOztBQUlULGFBQVMsUUFBVCxHQUFvQjs7QUFFaEIsWUFBSSxlQUFlLGdDQUFzQixHQUF6Qzs7QUFFQSxxQkFBYSxRQUFiLEdBQXdCLEdBQXhCLENBQTRCLFVBQTVCLEVBQXdDLElBQXhDLENBQTZDLE9BQTdDLEVBQXNELFVBQVUsUUFBVixFQUFvQjtBQUN0RSxnQkFBSSxZQUFZLFNBQVMsR0FBVCxFQUFoQixFQUFnQztBQUFBO0FBQzVCLHdCQUFJLGFBQWEsU0FBUyxHQUFULEVBQWpCO0FBQ0Esd0JBQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxVQUFaLENBQVg7QUFDQSx3QkFBSSxZQUFZLFNBQVMsYUFBVCxDQUF1QixTQUF2QixDQUFoQjtBQUNBLDhCQUFVLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0Isa0JBQXhCO0FBQ0EseUJBQUssT0FBTCxDQUFhLFVBQUMsR0FBRDtBQUFBLCtCQUFTLFdBQVcsV0FBVyxHQUFYLENBQVgsRUFBNEIsU0FBNUIsQ0FBVDtBQUFBLHFCQUFiOztBQUVBLDZCQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsV0FBaEMsQ0FBNEMsU0FBNUM7QUFQNEI7QUFRL0I7QUFFSixTQVhEO0FBYUg7O0FBRUQsYUFBUyxVQUFULENBQW9CLElBQXBCLEVBQTBCLFNBQTFCLEVBQXFDOztBQUVqQyxZQUFJLFlBQVksU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWhCO0FBQ0EsWUFBSSxNQUFNLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0EsWUFBSSxHQUFKLEdBQVUsS0FBSyxPQUFmO0FBQ0EsWUFBSSxTQUFKLENBQWMsR0FBZCxDQUFrQixTQUFsQjtBQUNBLGtCQUFVLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsZ0JBQXhCO0FBQ0Esa0JBQVUsWUFBVixDQUF1QixhQUF2QixFQUFzQyxLQUFLLElBQTNDO0FBQ0Esa0JBQVUsV0FBVixDQUFzQixHQUF0QjtBQUNBLGtCQUFVLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEI7QUFDQSxrQkFBVSxXQUFWLENBQXNCLFNBQXRCO0FBQ0g7O0FBRUQsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNILENBckNEOzs7QUNIQTs7QUFFQTs7Ozs7Ozs7OztJQUdhLGUsV0FBQSxlLEdBQ1QsMkJBQWE7QUFBQTs7QUFDVDtBQUNBLFNBQUssTUFBTCxHQUFjO0FBQ1YsZ0JBQVEseUNBREU7QUFFVixvQkFBWSwyQkFGRjtBQUdWLHFCQUFhLGtDQUhIO0FBSVYsdUJBQWU7QUFKTCxLQUFkOztBQU9BLFNBQUssR0FBTCxHQUFXLFNBQVMsYUFBVCxDQUF1QixLQUFLLE1BQTVCLENBQVg7QUFDSCxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuaW1wb3J0IHtGaXJlQmFzZUxlZ29BcHB9IGZyb20gJy4vZmlyZWJhc2UvZmlyZWJhc2UuanMnO1xuXG4oZnVuY3Rpb24gKCkge1xuXG5cblxuICAgIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG4gICAgICAgIGxldCBmaXJlQmFzZUxlZ28gPSBuZXcgRmlyZUJhc2VMZWdvQXBwKCkuYXBwO1xuXG4gICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZignZHJhd1Nob3cnKS5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuICAgICAgICAgICAgaWYgKHNuYXBzaG90ICYmIHNuYXBzaG90LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNuYXBzaG90RmIgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xuICAgICAgICAgICAgICAgIGxldCBkb21QYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgZG9tUGFyZW50LmNsYXNzTGlzdC5hZGQoJ3BhcmVudC1zbmFwc2hvdHMnKTtcbiAgICAgICAgICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gYWRkRWxlbWVudChzbmFwc2hvdEZiW2tleV0sIGRvbVBhcmVudCkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykuYXBwZW5kQ2hpbGQoZG9tUGFyZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZEVsZW1lbnQoZHJhdywgZG9tUGFyZW50KSB7XG5cbiAgICAgICAgbGV0IGltZ1BhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZy5zcmMgPSBkcmF3LmRhdGFVcmw7XG4gICAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdpbWctb3JpJyk7XG4gICAgICAgIGltZ1BhcmVudC5jbGFzc0xpc3QuYWRkKCdpbWctb3JpLXBhcmVudCcpO1xuICAgICAgICBpbWdQYXJlbnQuc2V0QXR0cmlidXRlKCdkYXRhLWF1dGhvcicsIGRyYXcudXNlcik7XG4gICAgICAgIGltZ1BhcmVudC5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICBpbWdQYXJlbnQuY2xhc3NMaXN0LmFkZCgnYmlnJyk7XG4gICAgICAgIGRvbVBhcmVudC5hcHBlbmRDaGlsZChpbWdQYXJlbnQpO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcGFnZUxvYWQpO1xufSkoKTsiLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBCYXNpYyBGaXJlYmFzZSBoZWxwZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEZpcmVCYXNlTGVnb0FwcHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAvLyBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbiwgWW91IHNob3VsZCB1cGRhdGUgd2l0aCB5b3VyIEtleXMgIVxuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGFwaUtleTogXCJBSXphU3lEcjlSODV0TmpmS1dkZFcxLU43WEpwQWhHcVhOR2FKNWtcIixcbiAgICAgICAgICAgIGF1dGhEb21haW46IFwibGVnb25uYXJ5LmZpcmViYXNlYXBwLmNvbVwiLFxuICAgICAgICAgICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9sZWdvbm5hcnkuZmlyZWJhc2Vpby5jb21cIixcbiAgICAgICAgICAgIHN0b3JhZ2VCdWNrZXQ6IFwiXCIsXG4gICAgICAgIH0gXG5cbiAgICAgICAgdGhpcy5hcHAgPSBmaXJlYmFzZS5pbml0aWFsaXplQXBwKHRoaXMuY29uZmlnKTtcbiAgICB9XG5cblxufVxuXG4iXX0=
