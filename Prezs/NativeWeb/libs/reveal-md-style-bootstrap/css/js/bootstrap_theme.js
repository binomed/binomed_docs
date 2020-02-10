var BOOTSTRAP_THEME = BOOTSTRAP_THEME || function(){


	function pageLoad(){
		
		postProdCodeHilight();
	
		if (Reveal){
			Reveal.sync();
		}
	}

	function postProdCodeHilight(){
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
	}

	
	// API
    function init(){
            document.addEventListener('DOMContentLoaded', function(){
            	setTimeout(function() {
            		pageLoad();
            	}, 500);
            });
    }

	return{
		init : init
	}

}(); 

BOOTSTRAP_THEME.init();