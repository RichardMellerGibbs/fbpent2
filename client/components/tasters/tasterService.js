//PROVIDES SERVICES FOR RECORDING TASTER SESSIONS
/*angular.module('app').service('tasterService', ['$http', '$location', function($http, $location){

	var self = this;

	self.saveTaster = function(firstname, lastname, email, message, sessionDate) {

//console.log('Inside contactService firstname ' + firstname + ' lastname ' + lastname);
		$http.post('http://localhost:8082/api/taster', {

			firstname: firstname,
			lastname: lastname,
			email: email,
			message: message,
            sessionDate: sessionDate

		}).success(function(){

			$location.path("/homepage");

		}).error(function(err) {
			alert(err);
		})
	}

	return;
}]);
*/


angular.module('tasterService', [])

// ===================================================
// Taster Factory

// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Taster', function($http, $q, AuthToken) {

    // create a new object
    var tasterFactory = {};
    
    // get all the taster sessions
    tasterFactory.all = function() {
        return $http.get('/api/taster/');
    };
    
    
    // get a single taster session
    tasterFactory.get = function(id) {
        return $http.get('/api/taster/' + id);
    };
    
    
    // add a taster session
    tasterFactory.create = function(tasterData) {
        
        //console.log('Calling api/taster to create a new one ');
        //console.log('tasterData.name ' + tasterData.name);
        //console.log('tasterData.sessionDate ' + tasterData.sessionDate);
        
        return $http.post('/api/taster/', tasterData)
        
        .success(function(data) {
            //console.log('Taster factory - ' + data.message + ' and success = ' + data.success);
            
            return data;
        })
        .error(function() {
            //console.log('Taster factory - failed to add taster session. data ' + data.message);
        });
    };
    
    
    // update a taster session
    tasterFactory.update = function(id, tasterData) {
        return $http.put('/api/taster/' + id, tasterData);
    };
    
    // Delete the taster session
    tasterFactory.delete = function(id) {
        return $http.delete('/api/taster/' + id);
    }
    
    // return our entire sessionFactory object
    return tasterFactory;

});