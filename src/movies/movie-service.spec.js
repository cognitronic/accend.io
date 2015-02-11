/**
 * Created by Danny Schreiber on 2/10/2015.
 */

describe('MovieService', function() {


	// Initialization of the AngularJS application before each test case
	beforeEach(module('accend.io.movie.service'));
	beforeEach(registerProvide);
	beforeEach(inject(init));
	var MovieService, RestService;

	function registerProvide(){
		module(function($provide){
			$provide.value('RestService', {
				getData: function(){}
			});

			$provide.value('MovieService', {
				getMovies: function(){
					return [{"name":"Interstellar", "year":"2014"}, {"name":"Pulp Fiction", "year":"1998"}];
				}
			});

			$provide.value('Constants', {});
		});
	}

	function init(_MovieService_, _RestService_) {
		MovieService = _MovieService_;
		RestService = _RestService_;
	}

	it('should test something cool', function() {

		// create an object to test with
		var test = {
			name: 'Danny Schreiber'
		};

		var movies = MovieService.getMovies({showLoader: true});
		expect(movies.length).toBe(2);
		expect(movies[0].name).toBe('Interstellar');
		expect(test.name).toBe('Danny Schreiber');
	});

});