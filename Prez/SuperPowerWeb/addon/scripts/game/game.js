'use strict'


function pageLoad(){
	rivets.bind(document.querySelector('#content'), rvModel);
	
	require('./controler/controller').initController();
}

window.addEventListener('load', pageLoad);

