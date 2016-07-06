angular.module('userService', [])

.factory('User', function($http, AuthToken) {

    // create a new object
    var userFactory = {};

    // get a single user
    userFactory.get = function(id) {
        return $http.get('/api/users/' + id);
    };
    
    // get a single user by username or email
    userFactory.getName = function(username) {
        return $http.get('/api/users/checkname/' + username);
    };

    // get all users
    userFactory.all = function() {
        return $http.get('/api/users/');
    };

    // create a user
    userFactory.create = function(userData) {
        
        return $http.post('/api/users/', userData)
        
        .success(function(data) {
            //console.log('User factory - ' + data.message + ' and success = ' + data.success);
            
            if (data.success) {
                AuthToken.setToken(data.token);
            };
            
            return data;
        })
        .error(function() {
            //console.log('User factory - failed to create user. data ' + data.message);
        });
    };
    

    // update a user
    userFactory.update = function(id, userData) {
        return $http.put('/api/users/' + id, userData);
    };

    // delete a user
    userFactory.delete = function(id) {
        return $http.delete('/api/users/' + id);
    };

    // return our entire userFactory object
    return userFactory;

});