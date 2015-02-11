/**
 * Created by Danny Schreiber on 2/9/2015.
 */

angular.module('accend.io.ui', [
	//'accend.io.ui.tpls',
]);

angular.module('accend.io.services', [
	'accend.io.movie.service',
	'accend.io.rest.service',
	'accend.io.cache.service'
]);

//angular.module('accend.io.ui.tpls', [
//	'templates/accend/movies.html',
//	'templates/accend/movie-details.html'
//]);