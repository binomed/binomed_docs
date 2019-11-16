var BINOMED_THEME = BINOMED_THEME || function(){


	var path = "";


	function extractPath(){
      var scripts = document.getElementsByTagName("script");

        for(var idx = 0; idx < scripts.length; idx++)
        {
          var script = scripts.item(idx);

          if(script.src && script.src.match(/binomed_theme_addons\.js$/))
          { 
            var path = script.src;
            return path.substring(0, path.indexOf('js/binomed_theme_addons')); 
          }
        }
      return "";
    };


	function pageLoad(){		

		path = extractPath();

		// FavIcon
		manageFavIcon();

		// ManageBackground
		manageBackgrounds();

		if (Reveal){
			Reveal.sync();
		}
	}

	function manageFavIcon(){
		var link = document.createElement('link'); 
	    link.type = 'image/x-icon';
	    link.rel = 'shortcut icon';
	    link.href = path+'/assets/images/binomed_alizarin.png';
	    document.getElementsByTagName('head')[0].appendChild(link);
		
	}

	function manageBackgrounds(){

		var map = {
			'transition-white' : '#ddd',
			'transition-black' : '#3d4349'			
		};

		for (var key in map){
			var queryElementList = document.querySelectorAll('.reveal .slides section.'+key);

			for (var i = 0; i < queryElementList.length; i++){
				var element = queryElementList[i];
				element.setAttribute('data-background',map[key]);		
			}			
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

BINOMED_THEME.init();