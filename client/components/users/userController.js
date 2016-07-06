// start our angular module and inject userService
angular.module('userCtrl', ['userService','authService'])
.controller('userController', ['$location', 'User', 'Auth', function($location, User, Auth) {

    var vm = this;
    
    vm.searchName = '';     // set the default search/filter term
    
    //$rootScope.navdark = true;
    
    //console.log('Inside the userController. Path ' + $location.path());
    
    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();
    
    if (vm.loggedIn === false){
        $location.path('/login');  
    } else {
    
        // set a processing variable to show loading things
        vm.processing = true;

        if ($location.path() === '/allusers') {
            // grab all the users at page load
            User.all()
                .success(function(data) {

                //console.log('userController - success from User.all');
                // when all the users come back, remove the processing variable
                vm.processing = false;

                // bind the users that come back to vm.users
                vm.memberCount = data.length;
                vm.users = data;

                })
                .error(function() {
                    //console.log('userController - failure from User.all');
                });  

        }
        
    }
    
    vm.userDetail = function(member) {
        //console.log('Called userDetail ' + member.name);
        
        vm.member = member;
        
        $location.path('/maintUser/' + member._id);
    }
}]);