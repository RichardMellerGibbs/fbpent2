angular.module('sessionService', [])

// ===================================================
// Factory to get training session information

// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Session', function($http, $q, AuthToken) {

    // create a new object
    var sessionFactory = {};
    
    var sessionMessage = {
        nextSessionMessage: '',
        nextSessionDate: ''
    };
    
    
    sessionFactory.getMessage = function() {
        return sessionMessage;
    }
    
    
    sessionFactory.setMessage = function(newMessage) {
        sessionMessage = newMessage;
        return;
    }

    // get the next training session data
    sessionFactory.getNext = function() {
        return $http.get('/api/sessions/next');
    };
    
    
    // get all the cancelled sessions
    sessionFactory.all = function() {
        return $http.get('/api/sessions/');
    };
    
    
    // get a single session
    sessionFactory.get = function(id) {
        return $http.get('/api/sessions/' + id);
    };
    
    
    // add a cancelled session
    sessionFactory.create = function(sessionData) {
        
        //console.log('Calling api/sessipns to create a new one ');
        //console.log('sessionData.running ' + sessionData.running);
        
        return $http.post('/api/sessions/', sessionData)
        
        .success(function(data) {
            //console.log('Session factory - ' + data.message + ' and success = ' + data.success);
            
            return data;
        })
        .error(function() {
            //console.log('Session factory - failed to add session. data ' + data.message);
        });
    };
    
    
    // update the session
    sessionFactory.update = function(id, sessionData) {
        return $http.put('/api/sessions/' + id, sessionData);
    };
    
    // Delete the cancelled session
    sessionFactory.delete = function(id) {
        return $http.delete('/api/sessions/' + id);
    }
    
    // return our entire sessionFactory object
    return sessionFactory;

});