// EVENT CONTROLLER
angular.module('eventCtrl', ['eventService', 'userService','authService'])
.controller('eventController', ['$location', 'User', 'Auth', 'Event', function($location, User, Auth, Event) {


    var vm = this;
    
    vm.errorType = 'Error!';
    
    //$rootScope.navdark = true;
    //console.log('Inside the eventController');
    
    
    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();
    
    if (vm.loggedIn === false){
        $location.path('/login');        
    } else {
        
        
        //Get the logged in user
        Auth.getUser()
        .success(function(data) {

            // bind the data that come back to vm.user
            vm.me = data;
            //console.log('admin is ' + vm.me.admin);
        });
        
        
        // grab all the sessions at page load
        Event.all()
        .success(function(data) {

            //console.log('eventController - success from Event.all');

            // bind the sessions that come back to vm.sessions
            vm.events = data;
        });
    }
    
    
    //CALLS THE ADD EVENT VIEW
    vm.addEvent = function() {
        
        //console.log('addEvent function called in event controller ');
        
        $location.path('/maintEvent/x');
        
    }
    
    
    vm.eventDetail = function(event) {
        
        if (!vm.me.admin) {
            return;        
        }
        
        //console.log('Called eventDetail ' + event.title);
        
        vm.event = event;
        
        $location.path('/maintEvent/' + event._id);
    }
       
}]);