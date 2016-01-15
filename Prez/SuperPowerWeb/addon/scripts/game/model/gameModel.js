'use strict'

var idUser = localStorage['userId'] ? localStorage['userId'] : 'user'+new Date().getTime();
localStorage['userId'] = idUser;

module.exports = {
	id : idUser,
	allowResp : true
}