// start our angular module and inject userService
angular.module('joinCtrl', ['userService'])
.controller('joinController', ['$location', 'User', function($location, User) {

    var vm = this;
    
    //$rootScope.navdark = true;
    //console.log('Inside the joinController');
    
    // function to handle join form
    vm.doJoin = function() {
                
        // clear the error
        vm.error = '';
        
        //console.log('joinController - attempting signUp');
        
        if (!vm.userData.name) {        
            vm.error = 'Please enter your name';
            return;
        }
        
        if (!vm.userData.username) {
            vm.error = 'Please enter your email address';
            return;
        }
        
        if (!vm.userData.phone) {
            vm.error = 'Please enter your phone number';
            return;
        }
        
        if (!vm.userData.password) {
            vm.error = 'Please enter a password';
            return;
        }
        
        if (!vm.userData.passwordAgain) {
            vm.error = 'Please confirm your password';
            return;
        }
        
        if (vm.userData.password !== vm.userData.passwordAgain) {
            vm.error = 'The passwords do not match';
            return;
        }
        
        
        //Does the email address already exist
        User.getName(vm.userData.username)
        .success(function(data) {

            if (data.success === true) {
                //console.log('Success from User.getName');        
                
                if (data.message === 'EXISTS') {
                    vm.error = 'A member with that email address already exists';
                    return;        
                } else {
                    
                    //console.log('Form is valid');

                    User.create(vm.userData)
                    .success(function(data) {

                        //console.log('joinController Result ' + data.message + ' success ' + data.success);
                        
                        //Thow the user back to the home page if any errors occur. 
                        //In time change this to be a internal server error page or some other UX
                        if (data.success === false) {
                            $location.path('/home');        
                        } else {
                            $location.path('/events');
                        }
                    })
                    .error(function() {
                        //console.log('joinController failure. Result ' + data.message);
                    });
                }
                
            } else {
                //console.log('Error from User.getName');        
            }
        });
        
        
        
                
    };
}]);