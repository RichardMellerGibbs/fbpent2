// start our angular module and inject userService

angular.module('maintSessionCtrl', ['sessionService', 'userService','authService','pickadate'])
.controller('maintSessionController', ['$scope','$location', '$routeParams', 'User', 'Auth', 'Session'
,function($scope, $location, $routeParams, User, Auth, Session) {
    
    var vm = this;
    vm.updateButton = true;
    vm.showDeleteSection = false;
    vm.addButton = false;
    vm.deleteSessionButton = true;
    //Turn off the calendar by defualt
    vm.calendar = true;
    
    vm.sessionDate = {value: ''};
    
    //console.log('Inside the maintSessionController. session id ' + $routeParams.sessionId);

    //Watch for the model changing. The date being populated by the picker. Once detected make the picker dissapear
    $scope.$watch('maintSession.sessionDate.value', function(newValue, oldValue) {
        if (vm.sessionDate.value.length > 0) {
            //Make the calendar dissapear
            if (vm.calendar === true) {
                vm.calendar = false;
            }
        }
    });

    
    
    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct to login page if user no logged in
    if (vm.loggedIn === false) {
        $location.path('/login');  
    } else {
        
        //Get the session details if a session_id was passed in
        if ($routeParams.sessionId !== 'x') {
            // set a processing variable to show loading things
            vm.processing = true;
            //console.log('Called in modify mode');

            // grab all the sessions at page load
            Session.get($routeParams.sessionId)
            .success(function(data) {

                //console.log('maintSessionController - success from Session.get Sess Date ' + data.sessionDate);
                // when all the sessions come back, remove the processing variable
                vm.processing = false;

                // bind the session that came back to vm.session
                //yyyy-mm-dd
                
                //new Date(data.sessionDate.getFullYear(), data.sessionDate.getMonth(), data.sessionDate.getDate());
                
                //var modate = moment(new Date(data.sessionDate)).format("YYYY-MM-DD");
                //console.log('year = ' + modate);
                
                //The data picker is a directive and Angular does not see any model changes unless you use an object 
                //which is passed by reference rather than by value as in a simple field.
                
                //AngularJS pass string, numbers and booleans by value while it passes arrays and objects by reference. 
                //So you can create an empty object and make your date a property of that object. In that way angular will detect model changes.
                vm.sessionDate = {value: new Date(data.sessionDate)};
                vm.running = data.running ;
                vm.shooting = data.shooting ;
                vm.fencing = data.fencing ;
                vm.sessionID = data._id;
                
                //console.log('vm.running ' + vm.running);
                //console.log('vm.running ' + vm.shooting);
                //console.log('vm.running ' + vm.fencing);
            });
        }
        else {
            //console.log('Called in add mode');
            
            //TURN OFF UPDATE AND DELETE BUTTONS AND LEAVE ON ADD BUTTON
            vm.updateButton = false;
            vm.addButton = true;
            vm.deleteSessionButton = false;
            
        }
    }
    
    vm.addSession = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //console.log('adding the session data ');
        
        //VALIDATE FORM
        /*if (!vm.sessionDate.value) {
            vm.error = 'A session date must be supplied';
            return;        
        }*/
        
        //You cannot choose a Friday which has already been cancelled
        
        if ((!vm.running) && (!vm.shooting) && (!vm.fencing)) {
            vm.error = 'At least one of the sessions must be cancelled';
            return;        
        }


        if (!vm.sessionDate.value) {        
            vm.error = 'Please choose a session date';
            return;
        } else {
            var validDate = moment(vm.sessionDate.value, 'YYYY-MM-DD', true).isValid();
            if (validDate === false) {
                vm.error = 'Please enter a valid date in the format YYYY-MM-DD';
                return;
            } 
        }

        //SessionDate must be a Friday
        var sessiondate = moment(vm.sessionDate.value);
        var dow = sessiondate.day();

        if (dow !== 5) {
            vm.error = 'Session date must be a Friday';
            return;    
        }



        
        var sessionData = {
            sessionDate: vm.sessionDate.value,
            running: vm.running,
            shooting: vm.shooting,
            fencing: vm.fencing
        };
        
        Session.create(sessionData)
        .success(function(data) {

            //console.log('maintSessionController success ' + data.success);
            //console.log('maintSessionController Result ' + data.message);
            
            if (data.success === true) {
                vm.feedback = 'Session added';
                $location.path('/sessions');
            } else {
                vm.error = data.message;
            }
                    
        });
    }
    
    
    
    vm.updateSession = function() {
        
        vm.error = '';
        vm.feedback = '';
        var running;
        var shooting;
        var fencing;
        
        //console.log('updating the session data ');
        
        //console.log('sessionDate ' + vm.sessionDate.value);
        //console.log('running ' + vm.running);
        //console.log('shooting ' + vm.shooting);
        //console.log('fencing ' + vm.fencing);
        //console.log('session id ' + vm.sessionID);
        
        //VALIDATE FORM
        //SessionDate must have a value and be a Friday
        if (!vm.sessionDate.value) {
            vm.error = 'A session date must be supplied';
            return;        
        }
        
        if ((!vm.running) && (!vm.shooting) && (!vm.fencing)) {
            vm.error = 'At least one of the sessions must be cancelled';
            return;        
        }
        
        if (!vm.running) {
            running = false;
        } else {
            running = true;
        }
        
        if (!vm.shooting) {
            shooting = false;
        } else {
            shooting = true;
        }
        
        if (!vm.fencing) {
            fencing = false;
        } else {
            fencing = true;
        }
        
        var sessionData = {
            sessionDate: vm.sessionDate.value,
            running: running,
            shooting: vm.shooting,
            fencing: vm.fencing
        };    
        
        
        Session.update(vm.sessionID, sessionData)
        .success(function(data) {

            //console.log('maintSessionController success ' + data.success);
            //console.log('maintSessionController Result ' + data.message);
            
            if (data.success === true) {
                vm.feedback = 'Session updated';
                $location.path('/sessions');
            } else {
                vm.error = data.message;
            }
                    
        });
    }
    
    
    
    vm.confirmDelete = function() {
        //Turn off main buttons including the delete button just pressed
        vm.updateButton = false;
        vm.deleteSessionButton = false;
        vm.addButton = false;
        
        //Turn on the delete confirmation buttons
        vm.showDeleteSection = true;
        
        //Show delete warning
        vm.error = 'This will delete the session. Please confirm';
        vm.errorType = 'Warning!';
    }
    
    
    vm.closeDeleteSection = function() {
        //Turn on main buttons including the delete button just pressed
        vm.updateButton = true;
        vm.deleteSessionButton = true;
        vm.addButton = false;
        
        //Turn off the delete confirmation buttons
        vm.showDeleteSection = false; 
        
        //Close delete warning
        vm.error = '';
        vm.errorType = 'Error!';
    }
    
    
    vm.deleteSession = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        if (!vm.sessionID) {
            vm.error = 'No session specified';
            return;         
        }
        
        //console.log('attempting delete of session id ' + vm.sessionID);
        
        
        Session.delete(vm.sessionID)
        .success(function(data) {

            if (data.success === true) {
                vm.feedback = 'Session deleted';
            } else {
                vm.error = data.message;
            }
            
            //console.log('maintSessionController Result ' + data.message);
            $location.path('/sessions');
        });
    }

    //Hides or shows the calendar. So reverses it's current boolean value
    vm.showCalendar = function() {
        vm.error = '';
        vm.calendar = !vm.calendar;
    }

    //vm.disabledDates = ['2016-10-07', '2016-10-08'];
    vm.disabledDates = function(date) {
        //console.log('calling disabled dates ' + date);
        //return date.getDay() === 6; // Disable every Sunday
    }

    //Shows the calendar if not currently shown. Used when date div gets the focus
    vm.showCalendarIfNotShown = function() {

        vm.error = '';

        if (vm.calendar === false) {
            vm.calendar = true;
        }
        
    }
}]);