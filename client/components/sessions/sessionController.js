// SESSION CONTROLLER

//angular.module('sessionCtrl', ['sessionService', 'userService'])

//.controller('sessionController', function($location, User, Auth, Session) {

angular.module('sessionCtrl', ['sessionService', 'userService','authService'])
.controller('sessionController', ['$location', 'User', 'Auth', 'Session', function($location, User, Auth, Session) {

    var vm = this;
    
    vm.errorType = 'Error!';
    
    //$rootScope.navdark = true;
    //console.log('Inside the sessionController');
    
    
    //console.log('Setting the sessionPrivate message');
    
    //Session.setMessage('This is the new message');
    
    
    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();
    
    if (vm.loggedIn === false){
        $location.path('/login');        
    } else {
        
        
        //Get the logged in user
        Auth.getUser()
        .success(function(data) {

            //console.log('sessionController - success from Auth.getUser userid = ' + data.userid + ' name ' + data.name + ' admin ' + data.admin);

            // bind the data that come back to vm.user
            vm.me = data;
            //console.log('admin is ' + vm.me.admin);
        });
        
    
        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the sessions at page load
        Session.all()
        .success(function(data) {

            //console.log('sessionController - success from Session.get');
            // when all the sessions come back, remove the processing variable
            vm.processing = false;
            
            //console.log('sessionDate ' + data[0].sessionDate);
            //console.log('_id ' + data[0]._id);

            // bind the sessions that come back to vm.sessions
            vm.sessions = data;
        })
        .error(function() {
            //console.log('sessionController - failure from Session.get');
        });    
    }
    
    // CREATE A NEW CANCELLED SESSION
    vm.addSession = function() {
        
        // clear the error
        vm.error = '';
        
        //console.log('addSession function called in sesseion controller');
        
        if (!vm.newSessionDate) {
            vm.error = 'Please enter a session date';
            return;
        }
        
        var today = new Date();
        var todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        var chosenDate = new Date(vm.newSessionDate);
        
        if (chosenDate < todayNoTime) {
            vm.error = 'Session date must be in the future';
            return;        
        }
        
        var sessionData = new Object();
        sessionData.sessionDate = new Date(vm.newSessionDate.getFullYear(), vm.newSessionDate.getMonth(), vm.newSessionDate.getDate()).toISOString();
        sessionData.sessionCancelled = true;
        
        Session.create(sessionData)
        .success(function(data) {

            //console.log('sessionController - success from Session.create');
            
            Session.get()
            .success(function(data) {

                //console.log('sessionController - success from Session.get');
                
                vm.sessions = data;
            })
            .error(function() {
                //console.log('sessionController - failure from Session.get');
            }); 
            
        })
        .error(function() {
            //console.log('sessionController - failure from Session.create');
        });
        
        vm.showInput = false;
        
    }
    
    // DELETE A SESSION
    vm.deleteSession = function(sessionId) {
        
        // clear the error
        vm.error = '';
        
        //console.log('deleteSession function called in sesseion controller ' + sessionId );
        
        Session.delete(sessionId)
        .success(function() {

            //console.log('sessionController - success from Session.delete');
            
            Session.get()
            .success(function(data) {

                //console.log('sessionController - success from Session.get');
                
                vm.sessions = data;
            })
            .error(function() {
                //console.log('sessionController - failure from Session.get');
            }); 
            
        })
        .error(function() {
            //console.log('sessionController - failure from Session.delete');
        });
        
        vm.showInput = false;
        
    }
    
    //TURNS ON THE ADDING A SESSION PANEL
    vm.addInput = function() {
        
        //console.log('addInput function called in sesseion controller ');
        
        //vm.showInput = true;
        $location.path('/maintSession/x');
        
    }
    
    
    vm.sessionDetail = function(session) {
        
        if (!vm.me.admin) {
            return;        
        }
        
        //console.log('Called sessionDetail id = ' + session._id);
        
        //vm.member = member;
        
        $location.path('/maintSession/' + session._id);
    }
    
}]);