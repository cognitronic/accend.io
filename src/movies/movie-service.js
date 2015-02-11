/**
 * Created by Danny Schreiber on 2/9/2015.
 */
(function(){ 'use strict';
	/**
	 * @constructor MovieService
	 * @classdesc The movie service is wraps all REST calls to movie APIs and provides convenient functions for accessing movie data
	 * @param RestService
	 * @param $q
	 * @param Constants
	 * @param $http
	 * @returns {{getMovies: Function, getMovieByImdbId: Function}}
	 */
    var MovieService = function(RestService, $q, Constants, $http){

	    /**
	     * Gets movies from service call and returns a promise.
	     *
	     * @param {config} object The config object will allow you to configure parameters for different movie service calls
	     * @function setItem
	     * @memberOf MovieService
	     */
	    var _getMovies = function(config){
			var deferred = $q.defer();
		    var _success = function(data){deferred.resolve(data);};
		    var _error = function(data){deferred.resolve(data);};

		    //This is mock data downloaded using Postman.
		    RestService.getData('src/common/data/movie-data.json', null, null,_success, '', _error, config.showLoader);

		    // This call is to show that the RestService actually works!  www.omdapi.com returns an Access-Control-Allow-Origin header, so
		    // there are no CORS issues
		    RestService.getData('http://www.omdbapi.com/?t=back+to+the+future&y=&plot=short&r=json', null, null,_success, '', _error, config.showLoader);


		    // The call below is to the api in the instructions, and it is not returning an Access-Control-Allow-Origin header and so is
		    // causing problems.  I noticed looking through mymovieapi.com's examples that they seem to be using JSONP, and even when trying to
		    // use JSONP, the header being set is text/plain....which Angular does not like!

		    //RestService.getData(Constants.ROUTES.GET_TOP_50, config.serviceCallParams, null,_success, '', _error, config.showLoader);

		    return deferred.promise;
	    };

		/**
		 * Gets a movie by IMDB Id
		 * @param {id} string IMDB Id
		 * @param {config} object The config object will allow you to configure parameters for different movie service calls
		 * @function getMovieByImdbId
		 * @memberOf MovieService
		 */
	    var _getMovieByImdbId = function(id, config){
		    var deferred = $q.defer();
		    var _success = function(data){deferred.resolve(data);};
		    var _error = function(data){deferred.resolve(data);};

		    // Same issue as above
		    // This service returns a header of 'Access-Control-Allow-Origin'
		    RestService.getData('https://api.themoviedb.org/3/movie/550?api_key=' + Constants.TMD_KEY + '&append_to_response=releases,trailers', null, null,_success, '', _error, config.showLoader);

		    // So does this one but myapifilms.com does not
			RestService.getData('http://www.omdbapi.com/?i=tt0071562&plot=short&r=json', null, null,_success, '', _error, config.showLoader);

			// This is just to change up the result a bit.  If you click on anything other than Interstellar, you'll get Pulp Fiction
			// Both good movies by the way! :)
		    if(id === 'Interstellar'){
			    RestService.getData('src/common/data/intersteller.json', null, null,_success, '', _error, config.showLoader);
		    } else {
			    RestService.getData('src/common/data/pulp-fiction.json', null, null,_success, '', _error, config.showLoader);
		    }

		    return deferred.promise;

	    };

	    return {
		  getMovies: _getMovies,
		  getMovieByImdbId: _getMovieByImdbId
	    };
    };

	angular.module('accend.io.movie.service', []).factory('MovieService', ['RestService', '$q', 'Constants', '$http', MovieService]);
})();