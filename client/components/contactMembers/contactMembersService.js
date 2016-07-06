angular.module('contactMembersService', [])

// ===================================================
// Factory to email members

// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('ContactMembers', function($http, $q, AuthToken) {

    // create a new object
    var contactMembersFactory = {};
        
    // add a cancelled session
    contactMembersFactory.create = function(contactData) {
        
        //console.log('Calling api/contactUsers to email members');
        //console.log('contactData.subject ' + contactData.subject);
        
        return $http.post('/api/contactUsers/', contactData)
        
        .success(function(data) {
            //console.log('ContactMembers factory - ' + data.message + ' and success = ' + data.success);
            
            return data;
        })
        .error(function() {
            //console.log('ContactMembers factory - failed to send email. data ' + data.message);
        });
    };
    
    // return our entire factory object
    return contactMembersFactory;

});