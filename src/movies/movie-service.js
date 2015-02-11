/**
 * Created by Danny Schreiber on 2/9/2015.
 */
(function(){ 'use strict';
    var MovieService = function(RestService, $q, Constants, $http){

	    var _getMovies = function(config){
			var deferred = $q.defer();
		    var _success = function(data){deferred.resolve(data);};
		    var _error = function(data){deferred.resolve(data);};

		    //The start and end params of the service call
		    RestService.getData('src/common/data/movie-data.json', null, null,_success, '', _error, config.showLoader);
		    //RestService.getData('http://www.omdbapi.com/?t=back+to+the+future&y=&plot=short&r=json', null, null,_success, '', _error, config.showLoader);
		    //RestService.getData(Constants.ROUTES.GET_TOP_50, config.serviceCallParams, null,_success, '', _error, config.showLoader);
		    //var conf = {
			 //   headers:{
				//    'Accept': 'text/plain;charset=UTF-8'
			 //   }
		    //};
		    //var test = $http.jsonp("http://www.myapifilms.com/imdb/top?callback=JSON_CALLBACK&format=JSONP&start=1&end=50&data=F").
			 //   then(function(data){
				//   console.log(data);
			 //   });
		    //console.log('test', test);
		    return deferred.promise;

	    };

	    var _getMovieByImdbId = function(id, config){
		    var deferred = $q.defer();
		    var _success = function(data){deferred.resolve(data);};
		    var _error = function(data){deferred.resolve(data);};

		    //The start and end params of the service call
		    //This service returns a header of 'Access-Control-Allow-Origin'
		    //RestService.getData('https://api.themoviedb.org/3/movie/550?api_key=' + Constants.TMD_KEY + '&append_to_response=releases,trailers', null, null,_success, '', _error, config.showLoader);

		    //So does this one but myapifilms.com does not
			//RestService.getData('http://www.omdbapi.com/?i=tt0071562&plot=short&r=json', null, null,_success, '', _error, config.showLoader);


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