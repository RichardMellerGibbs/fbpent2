//HOME PAGE CONTROLLER
/*angular.module('app').controller('contactController', ['$scope', 'contactService', function($scope, contactService) {
/*angular.module('app').controller('homeController', ['$scope', 'ngScrollTo', function($scope, ngScrollTo) {*/
/*angular.module('app').controller('homeController', ['$scope', function($scope) {*/


//angular.module('eventCtrl', ['eventService', 'userService'])

//.controller('eventController', function($location, User, Auth, Event) {


//angular.module('app').controller('homeController', ['$scope', '$location', 'tasterService', 'Auth', 
//                function($scope, $location, tasterService, Auth) {
                    
angular.module('homeCtrl', ['tasterService', 'userService','authService','homeService'])
.controller('homeController', ['$location', 'User', 'Auth', 'Taster', 'Home', function($location, User, Auth, Taster, Home) {
  
    var vm = this;
    vm.errorType = 'Error!';
    
	//$scope.home = true;
    
    vm.mainnav = true;
	//console.log('called the home controller');
    
    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();
    
    //console.log('home controller logged in ' + vm.loggedIn);
    
    
    Home.all()
        .success(function(homeData) {

            //console.log('homeController - success from Home.all');

            // bind the sessions that come back to vm.sessions
            //vm.homeData = homeData;
        
            //console.log('homeData length ' + homeData.length);
        
            for (i=0; i<homeData.length; i++) {
            
                // THE FIVE DICIPLINES
                if (homeData[i].name === 'diciplineTitle') {
                    vm.diciplineTitle = homeData[i].description;         
                }
                
                
                if (homeData[i].name === 'dicipline1') {
                    vm.dicipline1Title = homeData[i].title;         
                    vm.dicipline1Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'dicipline2') {
                    vm.dicipline2Title = homeData[i].title;         
                    vm.dicipline2Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'dicipline3') {
                    vm.dicipline3Title = homeData[i].title;         
                    vm.dicipline3Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'dicipline4') {
                    vm.dicipline4Title = homeData[i].title;         
                    vm.dicipline4Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'dicipline5') {
                    vm.dicipline5Title = homeData[i].title;         
                    vm.dicipline5Description = homeData[i].description;         
                }
                
                // THE THREE WEEKLY TRAINING DICIPLINES
                if (homeData[i].name === 'weeklyTrainTitle') {
                    vm.weekTrainTitle = homeData[i].description;         
                }
                
                if (homeData[i].name === 'weeklyTrain1') {
                    vm.weekTrain1Title = homeData[i].title;         
                    vm.weekTrain1Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'weeklyTrain2') {
                    vm.weekTrain2Title = homeData[i].title;         
                    vm.weekTrain2Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'weeklyTrain3') {
                    vm.weekTrain3Title = homeData[i].title;         
                    vm.weekTrain3Description = homeData[i].description;         
                }
                
                // THE SIX COACHES
                if (homeData[i].name === 'runCoach1') {
                    vm.runCoach1Title = homeData[i].title;         
                    vm.runCoach1Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'runCoach2') {
                    vm.runCoach2Title = homeData[i].title;         
                    vm.runCoach2Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'shootCoach1') {
                    vm.shootCoach1Title = homeData[i].title;         
                    vm.shootCoach1Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'shootCoach2') {
                    vm.shootCoach2Title = homeData[i].title;         
                    vm.shootCoach2Description = homeData[i].description;         
                }

                if (homeData[i].name === 'shootCoach3') {
                    vm.shootCoach3Title = homeData[i].title;         
                    vm.shootCoach3Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'fenceCoach1') {
                    vm.fenceCoach1Title = homeData[i].title;         
                    vm.fenceCoach1Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'fenceCoach2') {
                    vm.fenceCoach2Title = homeData[i].title;         
                    vm.fenceCoach2Description = homeData[i].description;         
                }
                
                if (homeData[i].name === 'tasterTitle') {
                    vm.tasterTitle = homeData[i].description;         
                }
                
            }
        });
    
    /*$scope.saveTaster = function() {
		console.log('inside the saveTaster function. fn ' + $scope.firstname + ' ' + $scope.sessionDate);
        tasterService.saveTaster($scope.firstname, $scope.lastname, $scope.email, $scope.message, $scope.sessionDate)
    };*/
                    
    vm.saveTaster = function() {

        vm.feedback = '';
        vm.error = '';
        
        //console.log('homeController - about to save taster session');
        
        if (!vm.name) {        
            vm.error = 'Please enter your name';
            return;
        }
        
        if (!vm.sessionDate) {        
            vm.error = 'Please choose a session date';
            return;
        }
        
        var tasterData = new Object();
        
        tasterData.name = vm.name;
        
        //console.log('homeController - tasterData.firstname ' + tasterData.firstname);
        
        tasterData.childName = vm.childName;
        tasterData.email = vm.email;
        tasterData.medical = vm.medical;
        tasterData.sessionDate = vm.sessionDate;
        
        Taster.create(tasterData)
        .success(function(data) {

            if (data.success === true) {
                //console.log('homeController - success from tasterService.create');
                vm.feedback = 'Thank you';
                vm.name = '';
                vm.sessionDate = '';
                vm.medical = '';
                vm.childName = '';
                vm.email = '';

                //Makes feedback alert dissapear automatically after 4 seconds
                setTimeout(function () {
                    $('.alert').alert('close')
                }, 4000);

            } else {
                vm.error = data.message;
            }

        }); 
    }

    

    
}]);



