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