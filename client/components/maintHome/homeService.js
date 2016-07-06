angular.module('homeService', [])

// ===================================================
// Factory to support home page information

// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Home', function($http, $q, AuthToken) {

    // create a new object
    var homeFactory = {};
    
    // get all the home data
    homeFactory.all = function() {
        return $http.get('/api/home/');
    };
    
    
    // get a single home item
    homeFactory.get = function(id) {
        return $http.get('/api/home/' + id);
    };
    
    
    // update home data
    homeFactory.update = function(id, homeData) {
        return $http.put('/api/home/' + id, homeData);
    };
    
    // return our entire homeFactory object
    return homeFactory;

});