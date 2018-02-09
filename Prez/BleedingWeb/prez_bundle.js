(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// import { MaskHighlighter } from '../node_modules/mask-highlighter/mask-highlighter.js';


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(async function () {

    async function pageLoad() {

        try {

            var codeMirrorCss = CodeMirror(document.getElementById('codemirror-css'), {
                value: '--a-super-var : #00000;',
                mode: 'css',
                lineNumber: 'true',
                fixedGutter: false,
                showCursorWhenSelecting: true,
                lineWrapping: true,
                scrollbarStyle: 'null',
                theme: 'solarized dark'
            });
            codeMirrorCss.setSize('100%', '100%');
            codeMirrorCss.on('change', function () {
                codeMirrorCss.getValue().split(';').map(function (instruction) {
                    return instruction.trim();
                }).forEach(function (cssInstruction) {
                    try {
                        var _cssInstruction$split = cssInstruction.split(':').map(function (keyValue) {
                            return keyValue.trim();
                        }),
                            _cssInstruction$split2 = _slicedToArray(_cssInstruction$split, 2),
                            key = _cssInstruction$split2[0],
                            value = _cssInstruction$split2[1];

                        if (key.startsWith('--')) {
                            document.getElementById('render-element').style.setProperty(key, value);
                        } else {
                            document.getElementById('render-element').style[key] = value;
                        }
                    } catch (e) {}
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    window.addEventListener('load', pageLoad);
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL3ByZXouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQTs7Ozs7QUFHQSxDQUFDLGtCQUFrQjs7QUFHZixtQkFBZSxRQUFmLEdBQTBCOztBQUd0QixZQUFJOztBQUVBLGdCQUFNLGdCQUFnQixXQUFXLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FBWCxFQUFzRDtBQUN4RSxnREFEd0U7QUFFeEUsc0JBQU0sS0FGa0U7QUFHeEUsNEJBQVksTUFINEQ7QUFJeEUsNkJBQWEsS0FKMkQ7QUFLeEUseUNBQXlCLElBTCtDO0FBTXhFLDhCQUFjLElBTjBEO0FBT3hFLGdDQUFnQixNQVB3RDtBQVF4RSx1QkFBTztBQVJpRSxhQUF0RCxDQUF0QjtBQVVBLDBCQUFjLE9BQWQsQ0FBc0IsTUFBdEIsRUFBOEIsTUFBOUI7QUFDQSwwQkFBYyxFQUFkLENBQWlCLFFBQWpCLEVBQTJCLFlBQVk7QUFDbkMsOEJBQWMsUUFBZCxHQUNLLEtBREwsQ0FDVyxHQURYLEVBRUssR0FGTCxDQUVTO0FBQUEsMkJBQWUsWUFBWSxJQUFaLEVBQWY7QUFBQSxpQkFGVCxFQUdLLE9BSEwsQ0FHYSwwQkFBa0I7QUFDdkIsd0JBQUk7QUFBQSxvREFDcUIsZUFBZSxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLEdBQTFCLENBQThCO0FBQUEsbUNBQVksU0FBUyxJQUFULEVBQVo7QUFBQSx5QkFBOUIsQ0FEckI7QUFBQTtBQUFBLDRCQUNPLEdBRFA7QUFBQSw0QkFDWSxLQURaOztBQUVBLDRCQUFJLElBQUksVUFBSixDQUFlLElBQWYsQ0FBSixFQUEwQjtBQUN0QixxQ0FBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxLQUExQyxDQUFnRCxXQUFoRCxDQUE0RCxHQUE1RCxFQUFpRSxLQUFqRTtBQUNILHlCQUZELE1BRU87QUFDSCxxQ0FBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxLQUExQyxDQUFnRCxHQUFoRCxJQUF1RCxLQUF2RDtBQUNIO0FBQ0oscUJBUEQsQ0FPRSxPQUFPLENBQVAsRUFBVSxDQUFFO0FBQ2pCLGlCQVpMO0FBYUgsYUFkRDtBQWVILFNBNUJELENBNEJFLE9BQU8sS0FBUCxFQUFjO0FBQ1osb0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFDSDtBQUdKOztBQUdELFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDSCxDQTNDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8vIGltcG9ydCB7IE1hc2tIaWdobGlnaHRlciB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9tYXNrLWhpZ2hsaWdodGVyL21hc2staGlnaGxpZ2h0ZXIuanMnO1xuXG5cbihhc3luYyBmdW5jdGlvbiAoKSB7XG5cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHBhZ2VMb2FkKCkge1xuXG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgY29uc3QgY29kZU1pcnJvckNzcyA9IENvZGVNaXJyb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVtaXJyb3ItY3NzJyksIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogYC0tYS1zdXBlci12YXIgOiAjMDAwMDA7YCxcbiAgICAgICAgICAgICAgICBtb2RlOiAnY3NzJyxcbiAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiAndHJ1ZScsXG4gICAgICAgICAgICAgICAgZml4ZWRHdXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dDdXJzb3JXaGVuU2VsZWN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxuICAgICAgICAgICAgICAgIHRoZW1lOiAnc29sYXJpemVkIGRhcmsnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvZGVNaXJyb3JDc3Muc2V0U2l6ZSgnMTAwJScsICcxMDAlJyk7XG4gICAgICAgICAgICBjb2RlTWlycm9yQ3NzLm9uKCdjaGFuZ2UnLCAoLi4ub2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgY29kZU1pcnJvckNzcy5nZXRWYWx1ZSgpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnOycpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoaW5zdHJ1Y3Rpb24gPT4gaW5zdHJ1Y3Rpb24udHJpbSgpKVxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChjc3NJbnN0cnVjdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IGNzc0luc3RydWN0aW9uLnNwbGl0KCc6JykubWFwKGtleVZhbHVlID0+IGtleVZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKCctLScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXItZWxlbWVudCcpLnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXItZWxlbWVudCcpLnN0eWxlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgfVxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHBhZ2VMb2FkKTtcbn0pKCk7Il19
