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