window.addEventListener('load',function(){
	setTimeout(function() {
		var array = document.querySelectorAll('code.toHilight');
		for (var i =0; i <array.length; i++){
			var length = 0;
			var textCode = array[i].innerHTML;
			do{
				length = textCode.length;
				textCode = textCode.replace('&lt;mark&gt;', '<mark>');
				textCode = textCode.replace('&lt;/mark&gt;', '</mark>');
			}while(length != textCode.length);
			array[i].innerHTML = textCode;

		}

	}, 1000);
});