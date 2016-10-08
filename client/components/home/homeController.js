//HOME PAGE CONTROLLER
/*angular.module('app').controller('contactController', ['$scope', 'contactService', function($scope, contactService) {
/*angular.module('app').controller('homeController', ['$scope', 'ngScrollTo', function($scope, ngScrollTo) {*/
/*angular.module('app').controller('homeController', ['$scope', function($scope) {*/


//angular.module('eventCtrl', ['eventService', 'userService'])

//.controller('eventController', function($location, User, Auth, Event) {


//angular.module('app').controller('homeController', ['$scope', '$location', 'tasterService', 'Auth', 
//                function($scope, $location, tasterService, Auth) {
                    
angular.module('homeCtrl', ['tasterService', 'userService','authService','homeService','pickadate'])
.controller('homeController', ['$scope', '$location', 'User', 'Auth', 'Taster', 'Home', function($scope, $location, User, Auth, Taster, Home) {
  
    var vm = this;
    vm.errorType = 'Error!';
    
	vm.sessionDate = '';
    
    vm.mainnav = true;
	//console.log('called the home controller');
    
    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    //Turn off the calendar by defualt
    vm.calendar = false;
    
    //console.log('home controller logged in ' + vm.loggedIn);
    //vm.sessionDate = moment().day(5).format('DD MMM YYYY');

    //Watch for the model changing. The date being populated by the picker. Once detected make the picker dissapear
    $scope.$watch('home.sessionDate', function(newValue, oldValue) {
        if (vm.sessionDate.length > 0) {
            //Make the calendar dissapear
            if (vm.calendar === true) {
                vm.calendar = false;
            }
        }
    });


    //Disable any dates not required
    vm.disableDates = function() {

        //Disable any date prior to today for the last 8 weeks
        var today = moment();

        var dayToConsider = today;
        var dow = '';
        vm.disabledDates = [];

        //Go backwards for a while and add those dates to the disabled list
        for (i=-1; i>-60; i--) {
            dayToConsider = moment(today).add(i, 'days');
            vm.disabledDates.push(dayToConsider.format('YYYY-MM-DD'));
        }
        
        //Disable any future dates apart from Fridays - including today
        for (i=1; i<360; i++) {
            dayToConsider = moment(today).add(i, 'days');
            dow = dayToConsider.day();
            if (dow !== 5) {
                vm.disabledDates.push(dayToConsider.format('YYYY-MM-DD'));
            }
            //console.log('date to consider ' + dayToConsider.format('DD-MM-YYYY') + ' i = ' + i + ' dow = ' + dow);
        }
    }
    
    //Call the method to initialse disabling dates
    vm.disableDates();
    
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
    
                    
    vm.saveTaster = function() {

        vm.feedback = '';
        vm.error = '';
        
        //console.log('homeController - about to save taster session');
        //console.log('sessionDate ' + vm.sessionDate);
        
        if (!vm.name) {        
            vm.error = 'Please enter your name';
            return;
        }
        
        if (!vm.sessionDate) {        
            vm.error = 'Please choose a session date';
            return;
        } else {
            var validDate = moment(vm.sessionDate, 'YYYY-MM-DD', true).isValid();
            if (validDate === false) {
                vm.error = 'Please enter a valid date in the format YYYY-MM-DD';
                return;
            } 
        }

        //SessionDate must be a Friday
        var sessiondate = moment(vm.sessionDate);
        var dow = sessiondate.day();

        if (dow !== 5) {
            vm.error = 'Session date must be a Friday';
            return;    
        }

       
        var tasterData = new Object();
        
        tasterData.name = vm.name;
        
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

    //Hides or shows the calendar. So reverses it's current boolean value
    vm.showCalendar = function() {
        vm.error = '';
        vm.calendar = !vm.calendar;
    }

    //Shows the calendar if not currently shown. Used when date div gets the focus
    vm.showCalendarIfNotShown = function() {
        vm.error = '';
        if (vm.calendar === false) {
            vm.calendar = true;
        }
    }  
  
}]);



