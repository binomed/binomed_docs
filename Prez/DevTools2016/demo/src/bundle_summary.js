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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHNjcmlwdHNcXGFwcF9zdW1tYXJ5LmpzIiwic3JjXFxzY3JpcHRzXFxmaXJlYmFzZVxcZmlyZWJhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQTs7QUFFQSxDQUFDLFlBQVk7O0FBSVQsYUFBUyxRQUFULEdBQW9COztBQUVoQixZQUFJLGVBQWUsZ0NBQXNCLEdBQXpDOztBQUVBLHFCQUFhLFFBQWIsR0FBd0IsR0FBeEIsQ0FBNEIsVUFBNUIsRUFBd0MsSUFBeEMsQ0FBNkMsT0FBN0MsRUFBc0QsVUFBVSxRQUFWLEVBQW9CO0FBQ3RFLGdCQUFJLFlBQVksU0FBUyxHQUFULEVBQWhCLEVBQWdDO0FBQUE7QUFDNUIsd0JBQUksYUFBYSxTQUFTLEdBQVQsRUFBakI7QUFDQSx3QkFBSSxPQUFPLE9BQU8sSUFBUCxDQUFZLFVBQVosQ0FBWDtBQUNBLHdCQUFJLFlBQVksU0FBUyxhQUFULENBQXVCLFNBQXZCLENBQWhCO0FBQ0EsOEJBQVUsU0FBVixDQUFvQixHQUFwQixDQUF3QixrQkFBeEI7QUFDQSx5QkFBSyxPQUFMLENBQWEsVUFBQyxHQUFEO0FBQUEsK0JBQVMsV0FBVyxXQUFXLEdBQVgsQ0FBWCxFQUE0QixTQUE1QixDQUFUO0FBQUEscUJBQWI7O0FBRUEsNkJBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxXQUFoQyxDQUE0QyxTQUE1QztBQVA0QjtBQVEvQjtBQUVKLFNBWEQ7QUFhSDs7QUFFRCxhQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsRUFBcUM7O0FBRWpDLFlBQUksWUFBWSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQSxZQUFJLE1BQU0sU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVY7QUFDQSxZQUFJLEdBQUosR0FBVSxLQUFLLE9BQWY7QUFDQSxZQUFJLFNBQUosQ0FBYyxHQUFkLENBQWtCLFNBQWxCO0FBQ0Esa0JBQVUsU0FBVixDQUFvQixHQUFwQixDQUF3QixnQkFBeEI7QUFDQSxrQkFBVSxZQUFWLENBQXVCLGFBQXZCLEVBQXNDLEtBQUssSUFBM0M7QUFDQSxrQkFBVSxXQUFWLENBQXNCLEdBQXRCO0FBQ0Esa0JBQVUsU0FBVixDQUFvQixHQUFwQixDQUF3QixLQUF4QjtBQUNBLGtCQUFVLFdBQVYsQ0FBc0IsU0FBdEI7QUFDSDs7QUFFRCxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDO0FBQ0gsQ0FyQ0Q7OztBQ0hBOztBQUVBOzs7Ozs7Ozs7O0lBR2EsZSxXQUFBLGUsR0FDVCwyQkFBYTtBQUFBOztBQUNUO0FBQ0EsU0FBSyxNQUFMLEdBQWM7QUFDVixnQkFBUSx5Q0FERTtBQUVWLG9CQUFZLDJCQUZGO0FBR1YscUJBQWEsa0NBSEg7QUFJVix1QkFBZTtBQUpMLEtBQWQ7O0FBT0EsU0FBSyxHQUFMLEdBQVcsU0FBUyxhQUFULENBQXVCLEtBQUssTUFBNUIsQ0FBWDtBQUNILEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXHJcbmltcG9ydCB7RmlyZUJhc2VMZWdvQXBwfSBmcm9tICcuL2ZpcmViYXNlL2ZpcmViYXNlLmpzJztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBwYWdlTG9hZCgpIHtcclxuXHJcbiAgICAgICAgbGV0IGZpcmVCYXNlTGVnbyA9IG5ldyBGaXJlQmFzZUxlZ29BcHAoKS5hcHA7XHJcblxyXG4gICAgICAgIGZpcmVCYXNlTGVnby5kYXRhYmFzZSgpLnJlZignZHJhd1Nob3cnKS5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xyXG4gICAgICAgICAgICBpZiAoc25hcHNob3QgJiYgc25hcHNob3QudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzbmFwc2hvdEZiID0gc25hcHNob3QudmFsKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHNuYXBzaG90RmIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvbVBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKTtcclxuICAgICAgICAgICAgICAgIGRvbVBhcmVudC5jbGFzc0xpc3QuYWRkKCdwYXJlbnQtc25hcHNob3RzJyk7XHJcbiAgICAgICAgICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gYWRkRWxlbWVudChzbmFwc2hvdEZiW2tleV0sIGRvbVBhcmVudCkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpLmFwcGVuZENoaWxkKGRvbVBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZEVsZW1lbnQoZHJhdywgZG9tUGFyZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBpbWdQYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgaW1nLnNyYyA9IGRyYXcuZGF0YVVybDtcclxuICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZCgnaW1nLW9yaScpO1xyXG4gICAgICAgIGltZ1BhcmVudC5jbGFzc0xpc3QuYWRkKCdpbWctb3JpLXBhcmVudCcpO1xyXG4gICAgICAgIGltZ1BhcmVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0aG9yJywgZHJhdy51c2VyKTtcclxuICAgICAgICBpbWdQYXJlbnQuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICBpbWdQYXJlbnQuY2xhc3NMaXN0LmFkZCgnYmlnJyk7XHJcbiAgICAgICAgZG9tUGFyZW50LmFwcGVuZENoaWxkKGltZ1BhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBwYWdlTG9hZCk7XHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG4vKipcclxuICogQmFzaWMgRmlyZWJhc2UgaGVscGVyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmlyZUJhc2VMZWdvQXBwe1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAvLyBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbiwgWW91IHNob3VsZCB1cGRhdGUgd2l0aCB5b3VyIEtleXMgIVxyXG4gICAgICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5RHI5Ujg1dE5qZktXZGRXMS1ON1hKcEFoR3FYTkdhSjVrXCIsXHJcbiAgICAgICAgICAgIGF1dGhEb21haW46IFwibGVnb25uYXJ5LmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgICAgICAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL2xlZ29ubmFyeS5maXJlYmFzZWlvLmNvbVwiLFxyXG4gICAgICAgICAgICBzdG9yYWdlQnVja2V0OiBcIlwiLFxyXG4gICAgICAgIH0gXHJcblxyXG4gICAgICAgIHRoaXMuYXBwID0gZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcCh0aGlzLmNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuIl19
