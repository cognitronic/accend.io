/**
 * Created by Danny Schreiber on 2/9/2015.
 */
(function(){ 'use strict';
    var MoviesController = function(MovieService, $state, CacheService, Constants, $interval){
		var mc = this;

	    mc.init = init;
		mc.getMovies = getMovies;
	    mc.movieDetails = movieDetails;
	    init();
	    $interval(function(){
		    mc.getMovies();
	    }, 60000);

	    function init(){
		    CacheService.removeItem(Constants.CACHE.SELECTED_MOVIE);
		    mc.getMovies();
	    }

	    function movieDetails(movie){
		    CacheService.setItem(Constants.CACHE.SELECTED_MOVIE, movie);
		    $state.go('movies.details', {title: movie.title, data: mc.movies[0]});
	    }

	    function getMovies(){
			var serviceConfig = {
				serviceCallParams:  [1, 50],
				showLoader: true
			};

		    MovieService.getMovies(serviceConfig).then(function(data){
			    mc.movies = data;
			    console.log(data);
		    });
	    }
    };
	angular.module('accend.io').controller('MoviesController', ['MovieService', '$state', 'CacheService', 'Constants', '$interval', MoviesController]);
})();