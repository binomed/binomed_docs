var SQLI_THEME = SQLI_THEME || function(){


	var path = "";


	function extractPath(){
      var scripts = document.getElementsByTagName("script");

        for(var idx = 0; idx < scripts.length; idx++)
        {
          var script = scripts.item(idx);

          if(script.src && script.src.match(/sqli_theme_addons\.js$/))
          { 
            var path = script.src;
            return path.substring(0, path.indexOf('js/sqli_theme_addons')); 
          }
        }
      return "";
    };


	function pageLoad(){		

		path = extractPath();

		// Add footer
		manageHeaderFooter();

		// Manage background for markdown uses
		manageBackgrounds();

		// No Footer
		manageNoFooter();

		// Manage Reveal Events (footer element visibility)
		Reveal.addEventListener( 'slidechanged', showFooter);
		Reveal.addEventListener( 'hidefooter', hideFooter);

		if (Reveal){
			Reveal.sync();
		}
	}

	function hideFooter(event){
		document.querySelector('footer.sqli-footer').style.display = 'none';
		document.querySelector('header.sqli-header').style.display = 'none';

	}

	function showFooter(event){
		var currentSlide = document.querySelector('section.present');
		if (currentSlide && currentSlide.getAttribute('data-state') != 'hidefooter'){
			document.querySelector('footer.sqli-footer').style.display = 'block';
			document.querySelector('header.sqli-header').style.display = 'block';
		}

	}

	function manageHeaderFooter(){
		var footer = document.createElement('footer');
		footer.classList.add('sqli-footer');
		footer.style.display = 'none';
		document.body.appendChild(footer); 

		var header = document.createElement('header');
		header.classList.add('sqli-header');
		header.style.display = 'none';
		document.body.appendChild(header);
	}


	function manageBackgrounds(){
		var queryElementList = document.querySelectorAll('.reveal .slides section.first-slide');

		for (var i = 0; i < queryElementList.length; i++){
			var element = queryElementList[i];
			element.setAttribute('data-background',path+'/assets/images/fd-couv.jpg');		
			element.setAttribute('data-state','hidefooter');		
		}

		queryElementList = document.querySelectorAll('.reveal .slides section.who-am-i');

		for (var i = 0; i < queryElementList.length; i++){
			var element = queryElementList[i];
			element.setAttribute('data-background',path+'/assets/images/Fd_fonce1.jpg');					
			element.setAttribute('data-state','hidefooter');		
		}

		queryElementList = document.querySelectorAll('.reveal .slides section.transition-white');

		for (var i = 0; i < queryElementList.length; i++){
			var element = queryElementList[i];
			element.setAttribute('data-background',path+'/assets/images/bg_72dpi_rvb.jpg');					
			element.setAttribute('data-state','hidefooter');		
		}

		queryElementList = document.querySelectorAll('.reveal .slides section.transition-black');

		for (var i = 0; i < queryElementList.length; i++){
			var element = queryElementList[i];
			element.setAttribute('data-background',path+'/assets/images/bg_72dpi_rvb_dark_fond_light.jpg');					
			element.setAttribute('data-state','hidefooter');		
		}

	}

	function manageNoFooter(){
		var noFooterList = document.querySelectorAll('.reveal .slides section .no-footer');

		for (var i = 0; i < noFooterList.length; i++){
			var element = noFooterList[i];
			if (element.parentElement.nodeName === 'SECTION'){
				var classElement = element.parentElement.getAttribute('class') ? element.parentElement.getAttribute('class') : '';
				element.parentElement.setAttribute('class', classElement+' no-footer');
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

SQLI_THEME.init();