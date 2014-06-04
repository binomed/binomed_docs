var newPort = chrome.runtime.connect({name:'popup'});
var content = document.getElementById("content");

chrome.windows.getAll({populate:true}, function(windows){
	content.innerHTML = "<select id='source'></select>";	
	contentSelect = document.getElementById("source");
	contentSelect.addEventListener('change', function(e){		
		newPort.postMessage({type:'selectTab', tabId : e.target.value});
    window.close();
	});
		
      for (var i = 0; i < windows.length; i++){
        chrome.tabs.query({windowId : windows[i].id, windowType : "normal"}, function(tabs){
          for (var j = 0; j < tabs.length; j++){
          	contentSelect.innerHTML = contentSelect.innerHTML + "<option value='"+tabs[j].id+"'><img src='"+tabs[j].faviconUrl+"'>"+tabs[j].title+"</option>";            
            console.info(tabs[j].title);            
          }
        });
      }
    });