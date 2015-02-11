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
/**
 * Created by Danny Schreiber on 2/9/2015.
 */

angular.module('accend.io', [
	'accend.io.ui',
	'accend.io.services',
	'ui.router',
	'ui.bootstrap',
	'ngAnimate',
	'toaster'
])
	.config(function($httpProvider, $stateProvider, $urlRouterProvider) {
		$httpProvider.defaults.transformRequest = function (data) {
			if (data === undefined) {
				return data;
			}
			return $.param(data);
		};

		//sets the content type header globally for $http calls
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		$httpProvider.defaults.headers['delete'] = {'Content-Type': 'application/json; charset=UTF-8'};
		$httpProvider.defaults.headers.get = { 'Content-Type' : 'text/plain; charset=UTF-8'};

		$urlRouterProvider.otherwise('/movies');
		$stateProvider
			.state('movies', {
				url: '/movies',
				views: {
					'header@': {
						templateUrl: '/src/common/layout/header.html',
						controller: 'HeaderController as hc'
					},
					'main-content@': {
						templateUrl: 'src/movies/movies.html',
						controller: 'MoviesController as mc'
					}
				}
			})
			.state('movies.details', {
				url: '/:title',
				views: {
					'header@': {
						templateUrl: '/src/common/layout/header.html',
						controller: 'HeaderController as hc'
					},
					'main-content@': {
						templateUrl: 'src/movie-details/movie-details.html',
						controller: 'MovieDetailsController as mdc'
					}
				}
			});
	});
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
/**
 * Created by Danny Schreiber on 2/9/2015.
 */
(function(){ 'use strict';
    var HeaderController = function(){
		var hc = this;
	  
	    hc.init = init;
	    
	    init();
	    
	    function init(){
		    
	    }
    };
	angular.module('accend.io').controller('HeaderController', [HeaderController]);
})();
/**
 * Created by Danny Schreiber on 2/9/2015.
 */
/**
 * @author Danny Schreiber on 8/12/2014.
 */



(function(){ 'use strict';
	/**
	 * @constructor CacheService
	 * @classdesc The cache service is a wrapper for the sessionStorage object and allows for client side state management.
	 *
	 * @returns {{setItem: _setItem, getItem: _getItem, removeItem: _removeItem, Items: {UserInfo: {orgId: string, selectedOrg: string, userOrgs: string, userData: string, userId: string, browserSupportChecked: string}, Referrals: {selectedReferral: string, selectedStatus: string}, Profile: {loadedProfile: string, allClnServices: string, allNclnServices: string}, Reports: {selectedReport: string}, Codelists: {locList: string, allLists: string, declineReasons: string}, Documents: {showAddNewReferral: string}}, clearCache: _clearCache}}
	 *
	 */
	var CacheService = function(){

		/**
		 * Inserts an item into session storage object
		 * @param {key} string name
		 * @param {val} object value that will be stringified and stored
		 * @function setItem
		 * @memberOf CacheService
		 */
		var _setItem = function(key, val) {
			sessionStorage.setItem(key, JSON.stringify(val));
		};

		/**
		 * Retrieves an item from the cache
		 * @param {item} string name of the key
		 * @function getItem
		 * @memberOf CacheService
		 */
		var _getItem = function(item) {
			if(angular.fromJson){
				return angular.fromJson(sessionStorage.getItem(item));
			}
		};

		/**
		 * Removes an item from the cache
		 *
		 * @param {item} string name of the key
		 * @function removeItem
		 * @memberOf CacheService
		 */
		var _removeItem = function(item) {
			sessionStorage.removeItem(item);
		};

		/**
		 *Clears all data from the local sessionStorage object
		 *
		 * @function clearCache
		 * @memberOf CacheService
		 */
		var _clearCache = function(){
			sessionStorage.clear();
		};



		return {
			setItem: _setItem,
			getItem: _getItem,
			removeItem: _removeItem,
			clearCache: _clearCache
		};
	};

	angular.module('accend.io.cache.service', []).factory('CacheService', [CacheService]);
})();
/**
 * Created by Danny Schreiber on 2/9/2015.
 */

(function(){
	'use strict';

	/**
	 * @classdesc Rest service is a collection of utility functions that wrap the Angular $http service and make REST calls easier to work with.
	 * @constructor RestService
	 */
	var RestService = function($http, $q, $rootScope){

		/**
		 * Utility function for constructing urls
		 * @param {string} url The url with parameter placeholders
		 * @param {array} argList List of url parameters
		 * @returns {*} string Url with parameters in place
		 * @memberOf RestService
		 * @function buildUrl
		 */
		var _buildUrl = function(url, argList) {

			var finalURL = url;
			if (argList || argList == []) {
				var replaceStr = "";
				for (var i = 0; i < argList.length; i++) {
					replaceStr = "{" + i + "}";
					finalURL = finalURL.replace(replaceStr, argList[i]);
				}
			}
			return finalURL;
		};

		/**
		 * Executes a http request with the given method, URL, and parameters. If successful, it will execute the successFunction. Otherwise it will display the errorMsg and execute the errorFunction (if defined)
		 *
		 * @param {string} method Service action type
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @private
		 */
		var _executeHttpRequest = function(method, url, urlReplaceList, params, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}
			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: method,
				url: url,
				params: params,
				cache: false
			})
				.success(function(data, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(data, status, headers, config);
					}
					else {
						successFunction(data, status, headers, config);
					}
				})
				.error(function (data, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(data, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		var _defaultSuccessFunction = function(data, status, headers, config) {
			console.log("Successfully received data, no functionality defined to proccess it. ", data);
		};

		var _processError = function(data, status, headers, config, errorMsg, errorFunction) {

			if (errorMsg) {
				AlertService.addErrorMessage(errorMsg, true);
			}

			// TODO: log error here?

			if (errorFunction)
				errorFunction(data,status,headers,config);
		};

		/**
		 *HTTP.GET
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function getData
		 */
		var _getData = function(url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config) {

			_executeHttpRequest('GET', url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config);
		};

		/**
		 *HTTP.PUT
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function putData
		 */
		var _putData = function(url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config) {

			_executeHttpRequest('PUT', url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config);
		};

		/**
		 *HTTP.DELETE
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function deleteData
		 */
		var _deleteData = function(url, urlReplaceList, params, successFunction,  errorMsg, errorFunction, config) {

			_executeHttpRequest('DELETE', url, urlReplaceList, params, successFunction,  errorMsg, errorFunction, config);
		};

		/**
		 *HTTP.PUT
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {object} data Data to be sent as the request message data
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function putPostData
		 */
		var _putPostData = function(url, urlReplaceList, params, data, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}

			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: 'PUT',
				url: url,
				params: params,
				data: data,
				cache: false
			})
				.success(function(postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(postData, status, headers, config);
					}
					else {
						successFunction(data, status, headers, config);
					}
				})
				.error(function (postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(postData, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		/**
		 *HTTP.POST
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {object} data Data to be sent as the request message data
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function postData
		 */
		var _postData = function(url, urlReplaceList, params, data, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}

			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: 'POST',
				url: url,
				params: params,
				data: data,
				cache: false
			})
				.success(function(postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(postData, status, headers, config);
					}
					else {
						successFunction(postData, status, headers, config);
					}
				})
				.error(function (postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(postData, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		/**
		 *HTTP.POST
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {object} data Data to be sent as the request message data
		 * @param {object} headers Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent
		 * @param {function} transformRequest The transform function takes the http request body and headers and returns its transformed (typically serialized) version
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function postData
		 */
		var _postDataWithHeaders = function(url, urlReplaceList, data, headers, transformRequest, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}

			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: 'POST',
				url: url,
				data: data,
				headers: headers,
				transformRequest: transformRequest
			})
				.success(function(data, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(data, status, headers, config);
					}
					else {
						successFunction(data, status, headers, config);
					}
				})
				.error(function (data, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(data, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		return {
			getData: _getData,
			postData: _postData,
			putData: _putData,
			deleteData: _deleteData,
			putPostData: _putPostData
		};
	};


	angular.module('accend.io.rest.service', []).factory('RestService', ['$http', '$q','$rootScope', RestService]);
})();
/**
 * Created by Danny Schreiber on 2/9/2015.
 */


(function(){ 'use strict';
    var MovieDetailsController = function(MovieService, CacheService, $q, Constants, $state){
		var mdc = this;
		mdc.movie = {};
	    mdc.init = init;
	    mdc.returnToList = returnToList;
	    mdc.getMovieByImdbId = getMovieByImdbId;

	    init();

	    function returnToList(){
		    $state.go('movies');
	    }

	    function init(){
			mdc.getMovieByImdbId('id');
	    }

	    function getMovieByImdbId(id){
		    var serviceConfig = {
		    serviceCallParams:  [1, 50],
		    showLoader: true
	    };
		    MovieService.getMovieByImdbId($state.params.title.split(' ').join('-'), serviceConfig).then(function(data){
			   mdc.movie = data;
		    });
	    }
    };
	angular.module('accend.io').controller('MovieDetailsController', ['MovieService', 'CacheService', '$q', 'Constants', '$state', MovieDetailsController]);
	angular.module('accend.io').filter('trusted', ['$sce', function ($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	}]);
})();
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
/**
 * Created by Danny Schreiber on 2/9/2015.
 */
