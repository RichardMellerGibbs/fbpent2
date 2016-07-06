// USER LANDING PAGE CONTROLLER 
angular.module('landCtrl', ['angularMoment', 'userService', 'sessionService','authService'])
.controller('landController', ['$location', 'Auth', 'User', 'Session', function($location, Auth, User, Session) {

    var vm = this;
    
    //$rootScope.navdark = true;
    //console.log('Inside the landController');
    
    var nextSession = new Date();
    //vm.running = true;
    //console.log('Running ' + vm.running);
    
    vm.loggedIn = Auth.isLoggedIn();
    
    if (vm.loggedIn === false){
        $location.path('/login');        
    }
    else {
    
        vm.sessionState = 'Session Booking for';
        vm.bookingBtn = 'Book';
        
        //Get the next session both actual if cancelled or not and the next available if different
        Session.getNext()
        .success(function(data) {
            
            //console.log('sessionData next avi ' + data.nextAvailableFriday);
            //console.log('sessionData next actual Friday ' + data.nextActualFriday);
            //console.log('sessionData next actual Friday cancelled ' + data.nextActualFridayCancelled);
            
            vm.nextSession = new Date(data.nextAvailableFriday);
            nextSession = new Date(data.nextAvailableFriday);
            
            //console.log('About to getUser');
        
            //Get me and specifically the userid
            Auth.getUser()
            .success(function(data) {

                //console.log('landController - success from Auth.getUser userid = ' + data.userid);

                // bind the data that come back to vm.user
                vm.userId = data.userid;
                vm.admin = data.admin;
                //console.log('vm.userId = ' + vm.userId);            
                //console.log('vm.admin = ' + vm.admin);


                //console.log('Looking for session date ' + nextSession.toISOString());
                //Now get the session
                //Passin id plus query string for session date
                //?sessionDate=dateinUTC '2016-02-25T00:00:00.000Z'
                //vm.nextSession = '2016-02-25T00:00:00.000Z';
                User.get(vm.userId + '?sessionDate=' + vm.nextSession)
                //User.get(vm.userId)
                .success(function(data) {

                    //console.log('landController - success from User.get data');

                    if (data.sessions) {
                        if (data.sessions.length > 0){
                            vm.sessionState = 'Session Booked';
                            vm.bookingBtn = 'Update';
                            vm.sessionID = data.sessions[0]._id;

                            vm.running = data.sessions[0].running;
                            vm.shooting = data.sessions[0].shooting;
                            vm.fencing = data.sessions[0].fencing;
                            //console.log('landController - vm.sessionID ' + vm.sessionID);
                        }
                        else {
                            //console.log('No sessions found');  
                        }
                    }

                    if (data.memberships) {
                        if (data.memberships.length > 0) {
                            vm.membershipDescription =  data.memberships[0].description;

                            vm.membershipExpires = data.memberships[0].toDate;
                            vm.membershipBalance = "£0.00"

                            //console.log('Mmembership desc ' + data.memberships[0].description);


                        }
                        else {
                            //console.log('No memberships found');  
                        }
                    }
                })
                .error(function() {
                    //console.log('landController - failure from User.get');
                });


            })
            .error(function() {
                //console.log('landController - failure from Auth.getUser');
            });
        })
        .error(function() {
            //console.log('Maincontroller error when calling getNext session date');
        });
    }
    
    
    
    
    
    
    
    
    
    vm.bookSession = function() {
        
        // clear the error
        vm.error = '';
        
        //var sessionData = new ;
        var sessionData = new Object();
        sessionData.sessionDate = new Date(nextSession.getFullYear(), nextSession.getMonth(), nextSession.getDate()).toISOString();
        
        
       // sessionData.sessionDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        
        
        sessionData.running = vm.running;
        sessionData.shooting = vm.shooting;
        sessionData.fencing = vm.fencing;
        sessionData.sessionID = vm.sessionID;
        
        if (sessionData.running == undefined){
            sessionData.running = false;
        }
        
        if (sessionData.shooting == undefined){
            sessionData.shooting = false;
        }
        
        if (sessionData.fencing == undefined){
            sessionData.fencing = false;
        }
        
        //console.log('sessionDate ' + sessionData.sessionDate);
        //console.log('Running ' + sessionData.running);
        //console.log('Shooting ' + sessionData.shooting);
        //console.log('Fencing ' + sessionData.fencing);
        //console.log('sessionID ' + sessionData.sessionID);
        
        // Update the session details
        //need to pass in user_id and session data
//need to setup userID
        User.update(vm.userId, sessionData)
        .success(function(data) {

            vm.sessionState = 'Session Booked';
            vm.bookingBtn = 'Update';
            //console.log('landController Result ' + data.message);
            //$location.path('/landusers');
        })
        .error(function() {
            //console.log('landController failure. Result ' + data.message);
        });          
    }   
}]);