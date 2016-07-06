angular.module('eventService', [])

// ===================================================
// Factory to get event information

// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Event', function($http, $q, AuthToken) {

    // create a new object
    var eventFactory = {};
    
    // get all the events
    eventFactory.all = function() {
        return $http.get('/api/events/');
    };
    
    
    // get a single event
    eventFactory.get = function(id) {
        return $http.get('/api/events/' + id);
    };
    
    
    // add a cancelled session
    eventFactory.create = function(eventData) {
        
        //console.log('Calling api/events to create a new one ');
        //console.log('eventData.running ' + eventData.title);
        
        return $http.post('/api/events/', eventData)
        
        .success(function(data) {
            //console.log('Event factory - ' + data.message + ' and success = ' + data.success);
            
            return data;
        })
        .error(function() {
            //console.log('Event factory - failed to add event. data ' + data.message);
        });
    };
    
    
    // update a user
    eventFactory.update = function(id, eventData) {
        return $http.put('/api/events/' + id, eventData);
    };
    
    // Delete the cancelled session
    eventFactory.delete = function(id) {
        return $http.delete('/api/events/' + id);
    }
    
    // return our entire sessionFactory object
    return eventFactory;

});