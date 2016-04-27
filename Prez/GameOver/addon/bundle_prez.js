(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function postProdCodeHilight(){
	var array = document.querySelectorAll('code.toHilight');
	for (var i =0; i <array.length; i++){
		var length = 0;
		var textCode = array[i].innerHTML;
		do{
			length = textCode.length;
			textCode = textCode.replace('&lt;mark&gt;', '<mark>');
			textCode = textCode.replace('&lt;mark class="dilluate"&gt;', '<mark class="dilluate">');
			textCode = textCode.replace('&lt;/mark&gt;', '</mark>');
		}while(length != textCode.length);
		array[i].innerHTML = textCode;

	}
}

Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
	console.log('RevealJS Ready');
    
	setTimeout(function() {
    	postProdCodeHilight();

	}, 500);
	
	let inIFrame = window.top != window.self;
	
    
	if (!inIFrame && io){
        console.log("Go to condition !");		
        setTimeout(function(){
        	let iframeDemo = document.querySelector("iframe#game-demo");
        	iframeDemo.onload=function(){
        		setTimeout(function(){
        			iframeDemo.style.height = "940px";
        			console.log(iframeDemo.height);
        		},1000)
		        //this.style.display='block';
		        console.log('laod the iframe')
		    };
        },500);
	}	
 
	
} );

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZGRvbi9wcmV6X3N1cGVyX3Bvd2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBwb3N0UHJvZENvZGVIaWxpZ2h0KCl7XG5cdHZhciBhcnJheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvZGUudG9IaWxpZ2h0Jyk7XG5cdGZvciAodmFyIGkgPTA7IGkgPGFycmF5Lmxlbmd0aDsgaSsrKXtcblx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHR2YXIgdGV4dENvZGUgPSBhcnJheVtpXS5pbm5lckhUTUw7XG5cdFx0ZG97XG5cdFx0XHRsZW5ndGggPSB0ZXh0Q29kZS5sZW5ndGg7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDttYXJrJmd0OycsICc8bWFyaz4nKTtcblx0XHRcdHRleHRDb2RlID0gdGV4dENvZGUucmVwbGFjZSgnJmx0O21hcmsgY2xhc3M9XCJkaWxsdWF0ZVwiJmd0OycsICc8bWFyayBjbGFzcz1cImRpbGx1YXRlXCI+Jyk7XG5cdFx0XHR0ZXh0Q29kZSA9IHRleHRDb2RlLnJlcGxhY2UoJyZsdDsvbWFyayZndDsnLCAnPC9tYXJrPicpO1xuXHRcdH13aGlsZShsZW5ndGggIT0gdGV4dENvZGUubGVuZ3RoKTtcblx0XHRhcnJheVtpXS5pbm5lckhUTUwgPSB0ZXh0Q29kZTtcblxuXHR9XG59XG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVhZHknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgLy8gZXZlbnQuY3VycmVudFNsaWRlLCBldmVudC5pbmRleGgsIGV2ZW50LmluZGV4dlxuXHRjb25zb2xlLmxvZygnUmV2ZWFsSlMgUmVhZHknKTtcbiAgICBcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBcdHBvc3RQcm9kQ29kZUhpbGlnaHQoKTtcblxuXHR9LCA1MDApO1xuXHRcblx0bGV0IGluSUZyYW1lID0gd2luZG93LnRvcCAhPSB3aW5kb3cuc2VsZjtcblx0XG4gICAgXG5cdGlmICghaW5JRnJhbWUgJiYgaW8pe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvIHRvIGNvbmRpdGlvbiAhXCIpO1x0XHRcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBcdGxldCBpZnJhbWVEZW1vID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlmcmFtZSNnYW1lLWRlbW9cIik7XG4gICAgICAgIFx0aWZyYW1lRGVtby5vbmxvYWQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgXHRcdFx0aWZyYW1lRGVtby5zdHlsZS5oZWlnaHQgPSBcIjk0MHB4XCI7XG4gICAgICAgIFx0XHRcdGNvbnNvbGUubG9nKGlmcmFtZURlbW8uaGVpZ2h0KTtcbiAgICAgICAgXHRcdH0sMTAwMClcblx0XHQgICAgICAgIC8vdGhpcy5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG5cdFx0ICAgICAgICBjb25zb2xlLmxvZygnbGFvZCB0aGUgaWZyYW1lJylcblx0XHQgICAgfTtcbiAgICAgICAgfSw1MDApO1xuXHR9XHRcbiBcblx0XG59ICk7XG4iXX0=
