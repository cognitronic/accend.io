/**
 * Created by Danny Schreiber on 2/9/2015.
 */

(function(){ 'use strict';
	var BASE_API = 'http://www.myapifilms.com/';
	/*jslint smarttabs:true */
	angular.module('accend.io').constant('Constants', {
		ROUTES: {
			GET_TOP_50: BASE_API + 'imdb/top?format=JSON&start=1&end=50&data=F',
			GET_MOVIE_DETAILS: BASE_API + 'imdb?idIMDB={0}&format=JSON&lang={1}&actors={2}&trailer={3}'
		},
		CACHE: {
			SELECTED_MOVIE: 'selectedMovie'
		},
		TMD_KEY: '675f762710fb7e000524487344f12d0d',
		ROTTEN_TOMATOES: 'yxf9m7meanv7edhtkzgpk4ue'
	});
})();