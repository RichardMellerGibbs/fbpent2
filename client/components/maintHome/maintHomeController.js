angular.module('maintHomeCtrl', ['userService','authService','homeService'])
.controller('maintHomeController', ['$location', '$routeParams', 'User', 'Auth', 'Home',
 function($location, $routeParams, User, Auth, Home) {
    
    var vm = this;
    var eventId = '';
    
    vm.eventId = '';
    vm.updateButton = true;
    
    vm.errorType = 'Error!';
    vm.error = '';
    vm.feedback = '';
    
    //console.log('Inside the maintHomeController.');
    
    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct to login page if user no logged in
    if (vm.loggedIn === false) {
        $location.path('/login');  
    } else {
        
        // grab all the home data at page load
        Home.all()
        .success(function(homeData) {

            //console.log('maintHomeController - success from Home.all');
            
            vm.homeData = homeData;
            vm.repeatSelect = '';
            vm.selectedItem = {};
            
            //console.log('vm.homeData.name 0 ' + vm.homeData[0].name);
            //console.log('vm.homeData._id 0 ' + vm.homeData[0]._id);
            //console.log('vm.homeData.name 1 ' + vm.homeData[1].name); 
        });
    }
    
    vm.loadItem = function() {
        //console.log('vm.repeatSelect ' + vm.repeatSelect);
        vm.feedback = '';
        //console.log('vm.homeData.length = ' + vm.homeData.length);
        for (i=0; i<vm.homeData.length; i++) {
            
            if (vm.homeData[i]._id === vm.repeatSelect) {
                
                //console.log('title = ' + vm.homeData[i].title);
                vm.selectedItem = {
                    id: vm.homeData[i]._id,
                    name: vm.homeData[i].name,
                    title: vm.homeData[i].title,
                    description: vm.homeData[i].description
                };
            }
            
        }
    }
    
    vm.updateHome = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //console.log('updating the home data ');
        //console.log('vm.selectedItem.title ' + vm.selectedItem.title);
        //console.log('vm.selectedItem.description ' + vm.selectedItem.description);
        //console.log('vm.selectedItem.id ' + vm.selectedItem.id);
        
        //VALIDATE FORM
        if (!vm.selectedItem.title) {
            vm.error = 'A title must be supplied';
            return;        
        }
        
        if (!vm.selectedItem.description) {
            vm.error = 'A description must be supplied';
            return;        
        }
        
        Home.update(vm.selectedItem.id, vm.selectedItem)
        .success(function(data) {

            //console.log('maintHomeController success ' + data.success);
            //console.log('maintHomeController Result ' + data.message);
            
            if (data.success === true) {
                vm.feedback = 'Home data updated';
                vm.selectedItem.title = '';
                vm.selectedItem.description = '';
                vm.repeatSelect = '';
                //$location.path('/home');
                // grab all the home data at page load
                Home.all()
                .success(function(homeData) {
                    vm.homeData = homeData;
                    vm.repeatSelect = '';
                    vm.selectedItem = {};
                });
            } else {
                vm.error = data.message;
            }
                    
        });
    }
}]);