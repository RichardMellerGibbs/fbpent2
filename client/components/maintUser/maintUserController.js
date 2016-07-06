// start our angular module and inject userService
//angular.module('sessionCtrl', ['sessionService', 'userService'])
//.controller('sessionController', ['$location', 'User', 'Auth', 'Session', function($location, User, Auth, Session) {

angular.module('maintUserCtrl', ['userService','authService'])
.controller('maintUserController', ['$location', '$routeParams', 'User', 'Auth', function($location, $routeParams, User, Auth) {

    var vm = this;
    
    //console.log('Inside the maintUserController. Path ' + $location.path());
    
    //The member ID is passed as a parameter to the page. The page can be called for the user logged in
    //or by an administrator maintaining another member on their behalf.
    
    //console.log('member id ' + $routeParams.memberId);
    
    var memberId = '';
    vm.member = '';
    vm.showAdmin = false;
    vm.showChildInput = false;
    vm.oneChild = false;
    vm.showDeleteSection = false;
    vm.updateButton = true;
    vm.addChildButton = true;
    vm.deleteMemberButton = false;
    vm.errorType = 'Error!';
    
    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct to login page if user no logged in
    if (vm.loggedIn === false) {
        $location.path('/login');  
    } else {
    
        //console.log('starting maintUserController');
    
        //Get the logged in user
        Auth.getUser()
        .success(function(data) {

            //console.log('maintUserController - success from Auth.getUser userid = ' + data.userid + ' name ' + data.name + ' admin ' + data.admin);

            // bind the data that come back to vm.user
            vm.me = data;
            //console.log('logged in user is ' + vm.me.name);
        })
        .error(function() {
            //console.log('maintUserController - failure from Auth.getUser');
        });
        
    
        if ($routeParams.memberId) {
            memberId = $routeParams.memberId;
        }
        
        //Now get the member details for this member
        User.get(memberId)
        .success(function(data) {

            //console.log('maintUserController - success from User.get data');

            if (data.sessions) {
                
                vm.member = data;
                
                if (vm.me.admin === true) {
                    vm.showAdmin = true;
                    vm.deleteMemberButton = true;
                } else {
                    vm.showAdmin = false;
                }
                
                //console.log('member name = ' + data.name)
                //console.log('Count of children ' + data.children.length);
                //console.log('Child 1 name ' + data.children[0].name);
                
                vm.manyChild = false;
                
                if (data.children.length > 2) {
                    vm.manyChild = true;
                }
                
                //console.log('manyChild ' + vm.manyChild);
                
            }
        })
        .error(function() {
            //console.log('maintUserController - failure from User.get');
        });
    }
        
        
    // function to handle user update
    vm.updateUser = function() {
                
        // clear the error
        vm.error = '';
        vm.feedback = '';
        
        //console.log('maintUserController - attempting validation');
        
        if (!vm.member.name) {        
            vm.error = 'Please enter your name';
            return;
        }
        
        if (!vm.member.username) {        
            vm.error = 'Please enter your email';
            //console.log('vm.error ' + vm.error);
            return;
        }
        
        if (!vm.member.phone) {        
            vm.error = 'Please enter your phone';
            return;
        }
        
        //console.log('Form is valid userId ' + vm.member._id);
        
        User.update(vm.member._id, vm.member)
        .success(function(data) {

            //console.log('maintUserController success ' + data.success);
            //console.log('maintUserController Result ' + data.message);
            
            if (data.success === true) {
                vm.feedback = 'Member updated';
            } else {
                vm.error = data.message;
            }
                        
            
            //$location.path('/landusers');
        })
        .error(function() {
            //console.log('maintUserController failure. Result ' + data.message);
        });
    }
    
    
    vm.confirmDelete = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //Turn off main buttons including the delete button just pressed
        vm.updateButton = false;
        vm.addChildButton = false;
        vm.deleteMemberButton = false;
        
        //Turn on the delete confirmation buttons
        vm.showDeleteSection = true;
        
        //Show delete warning
        vm.error = 'This will delete the member. Please confirm';
        vm.errorType = 'Warning!';
    }
    
    
    vm.closeDeleteSection = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //Turn on main buttons including the delete button just pressed
        vm.updateButton = true;
        vm.addChildButton = true;
        if (vm.me.admin === true) {
            vm.deleteMemberButton = true;
        }
        
        //Turn off the delete confirmation buttons
        vm.showDeleteSection = false; 
        
        //Close delete warning
        vm.error = '';
        vm.errorType = 'Error!';
    }
    
    // function to delete user
    vm.deleteUser = function(memberID) {
                
        // clear the error
        vm.error = '';
        vm.feedback = '';
        
        //console.log('maintUserController - attempting delete of user ' + memberID);
        
        User.delete(memberID)
        .success(function(data) {

            if (data.success === true) {
                vm.feedback = 'Member deleted';
            } else {
                vm.error = data.message;
            }
            
            //console.log('maintUserController Result ' + data.message);
            //console.log(vm.me.username + ' ' + vm.member.username);
            
            if (vm.me.username === vm.member.username) {
                //log me out as ive just deleted myself and take me to the home page
                Auth.logout();
                $location.path('/home');
            } else {
                //im deleting someone else.
                //if im admin take me to all members otherwise back to home
                if (vm.me.admin === true) {
                    $location.path('/allusers');        
                } else {
                    $location.path('/home');        
                }
            }
            
        })
        .error(function() {
            //console.log('maintUserController failure. Result ' + data.message);
        });
    }
    
    vm.addChildSecction = function() {

        vm.error = '';
        vm.feedback = '';
        
        vm.showChildInput = true;
            
        //Turn off main buttons
        vm.updateButton = false;
        vm.addChildButton = false;
        vm.deleteMemberButton = false;
        
    }
    
    vm.closeChildSecction = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        vm.showChildInput = false;
        
        //Turn on main buttons
        vm.updateButton = true;
        vm.addChildButton = true;
        
        if (vm.me.admin === true) {
            vm.deleteMemberButton = true;
        }
    }
    
    vm.addChild = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        var childRow = 0;
        
        //console.log('maintUserController - attempting validation childName ' + vm.childName);
        
        if (!vm.childName) {        
            vm.error = 'Please enter the childs name';
            return;
        }
        
        //console.log('Form is valid userId ' + vm.member._id);
        
        vm.member.childName = vm.childName;
        
        if (vm.childDOB) {
            vm.member.childDOB = vm.childDOB;        
        } else {
            vm.member.childDOB = '';
        }
        
        if (vm.medicalCond) {
            vm.member.childMedicalCondition = vm.medicalCond;        
        } else {
            vm.member.childMedicalCondition = '';
        }
                
        
        User.update(vm.member._id, vm.member)
        .success(function(data) {

            //console.log('maintUserController success ' + data.success);
            //console.log('maintUserController Result ' + data.message);
            
            if (data.success === true) {
                vm.feedback = 'Member updated';
                vm.showChildInput = false;
                
                //Turn on main buttons
                vm.updateButton = true;
                vm.addChildButton = true;
                if (vm.me.admin === true) {
                    vm.deleteMemberButton = true;
                }
                
                //Re-selecting the member to ensure the new child is displayed
                User.get(memberId)
                .success(function(data) {

                    if (data.success === true) {
                        vm.feedback = 'Member updated';
                    } else {
                        vm.error = data.message;
                    }
                    
                    //console.log('maintUserController - success from User.get data');

                    if (data.sessions) {

                        vm.member = data;

                        if (vm.me.admin === true) {
                            vm.showAdmin = true;
                        } else {
                            vm.showAdmin = false;
                        }

                        //console.log('member name = ' + data.name)
                    }
                });
                
            } else {
                vm.error = data.message;
            }
        });
    }
}]);