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
            var parser = document.createElement('a');
			parser.href = path;
			 
			parser.protocol; // => "http:"
			parser.hostname; // => "example.com"
			parser.port;     // => "3000"
			parser.pathname; // => "/pathname/"
			parser.search;   // => "?search=test"
			parser.hash;     // => "#hash"
			parser.host;     // => "example.com:3000"
            return parser.pathname.substring(0, parser.pathname.indexOf('js/sqli_theme_addons')); 
          }
        }
      return "";
    };


	function pageLoad(){		

		path = extractPath();

		// FavIcon
		manageFavIcon();


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

	function manageFavIcon(){
		var link = document.createElement('link');
	    link.type = 'image/x-icon';
	    link.rel = 'shortcut icon';
	    link.href = path+'/assets/images/logo_sstxt.png';
	    document.getElementsByTagName('head')[0].appendChild(link);
		
	}

	function hideFooter(event){
		document.querySelector('footer.sqli-footer').style.display = 'none';
		document.querySelector('header.sqli-header').style.display = 'none';

	}

	function showFooter(event){
		var currentSlide = document.querySelector('section:not(.stack).present');
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

		var map = {
			'first-slide' : 'fd-couv.jpg',
			'who-am-i' : 'bg-grey-fonce.jpg',
			'last-slide' : 'bg-grey-fonce.jpg',
			'transition-white' : 'bg-grey-clair_2.jpg',
			'transition-black' : 'bg-grey-fonce.jpg',
			'transition-carte-rouge' : 'fd-carte.jpg',
			'transition-carte-grise' : 'fd-carte_bis.jpg',
			'transition-carte-marron' : 'fd-carte_ter.jpg',
			'transition-ciel' : 'Fd-ciel.jpg',
			'transition-ciel-gris' : 'Fd-cielgris.jpg',
			'transition-graphic' : 'Fd-graphic.jpg',
			'transition-mains-rouge' : 'fd-mains.jpg',
			'transition-mains-bleu' : 'fd-profit.jpg',
			'transition-tete-bleu' : 'fd-tete-bleu.jpg',
			'transition-trame1' : 'bg-grey-clair.jpg',
			'transition-trame2' : 'bg-red.jpg'
		};

		for (var key in map){
			var queryElementList = document.querySelectorAll('.reveal .slides section.'+key);

			for (var i = 0; i < queryElementList.length; i++){
				var element = queryElementList[i];
				element.setAttribute('data-background',path+'assets/images/'+map[key]);		
				element.setAttribute('data-state','hidefooter');		
			}			
		}
		var dataLoadElementList = document.querySelectorAll('.reveal .slides section div[data-loaded]');
		for (var i = 0; i < dataLoadElementList.length; i++){
				var element = dataLoadElementList[i];
				element.removeAttribute('data-loaded');		
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