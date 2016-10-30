// start our angular module and inject userService
angular.module('joinCtrl', ['userService','logService'])
.controller('joinController', ['$scope', '$location', 'User', 'Log', function($scope, $location, User, Log) {

    var vm = this;

    var validMonths = [];
    vm.userData = {};
    
    validMonths.push({monthName: 'january', monthShortName: 'jan', monthNumber: '01'});
    validMonths.push({monthName: 'february', monthShortName: 'feb', monthNumber: '02'});
    validMonths.push({monthName: 'march', monthShortName: 'mar', monthNumber: '03'});
    validMonths.push({monthName: 'april', monthShortName: 'apr', monthNumber: '04'});
    validMonths.push({monthName: 'may', monthShortName: 'may', monthNumber: '05'});
    validMonths.push({monthName: 'june', monthShortName: 'jun', monthNumber: '06'});
    validMonths.push({monthName: 'july', monthShortName: 'jul', monthNumber: '07'});
    validMonths.push({monthName: 'august', monthShortName: 'aug', monthNumber: '08'});
    validMonths.push({monthName: 'september', monthShortName: 'sep', monthNumber: '09'});
    validMonths.push({monthName: 'october', monthShortName: 'oct', monthNumber: '10'});
    validMonths.push({monthName: 'november', monthShortName: 'nov', monthNumber: '11'});
    validMonths.push({monthName: 'december', monthShortName: 'dec', monthNumber: '12'});
    
    // function to handle join form
    vm.doJoin = function() {
                
        // clear the error
        vm.error = '';
        
        Log.logInfo('joinController - attempting signUp');

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
        } else {
            if (isNaN(vm.userData.phone)) {
                vm.error = 'The phone number must be a number';
                return;
            }
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

        Log.logInfo('About to validate date of birth');

        if (vm.dobDay || vm.dobMonth || vm.dobYear) {

            Log.logInfo('at least one of them has been populated');

            //Day validation
            if (isNaN(vm.dobDay)) {
                vm.error = 'The birth date day must be a number';
                return;    
            }

            if (vm.dobDay < 1 || vm.dobDay > 31) {
                vm.error = 'The birth date day must be a valid day of the month';
                return;
            }

            //Month validation
            if (!vm.dobMonth) {
                vm.error = 'The birth date month must be supplied';
                return;
            }

            //If the month entered is text then test against month names
            if (isNaN(vm.dobMonth)) {
                //Check to see if month names are being used
                var monthValid = false;
                var monthNumber = '';
                var monthValue = vm.dobMonth.toLowerCase();

                for (i=0; i< validMonths.length; i++) {
                    if (monthValue === validMonths[i].monthName || monthValue === validMonths[i].monthShortName) {
                        monthValid = true;
                        monthNumber = validMonths[i].monthNumber;    
        
                        Log.logInfo('Found a match on the month name input value ' + vm.dobMonth + ' tested value ' + validMonths[i].monthName + ' month number ' + validMonths[i].monthNumber);
                    }
                }

                if (monthValid === false) {
                    Log.logInfo('Month is a string but cannot be validated');
                    vm.error = 'A valid month must be supplied for the date of birth';
                    return; 
                }
            } else {
                //Otherwise the month must be a number so test between 1 and 12
                if (vm.dobMonth < 1 || vm.dobMonth > 12) {
                    vm.error = 'The birth date month must be between 1 and 12';
                    return;     
                } else {
                    monthNumber = vm.dobMonth;    
                }
            }

            //Year validation
            if (!vm.dobYear) {
                vm.error = 'A year must be supplied for the date of birth';
                return;
            }

            if (isNaN(vm.dobYear)) {
                vm.error = 'The year for the date of birth must be a number';
                return;    
            }

            vm.userData.childDOB = vm.dobYear + '-' + monthNumber + '-' + vm.dobDay;

            //Now test to see if the entered data is actually a date. 
            //Notice the true argument at the end of the moment call. This puts moment into strict mode menaning the date has to follow the format mask
            var d = moment(vm.userData.childDOB,'YYYY-MM-DD', true);

            if (!d.isValid()) {
                vm.error = 'The date of birth is not valid';
                return; 
            } 
        } else {
            //Ensure the dob is empty
            vm.userData.childDOB = undefined;
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
                    
                    Log.logInfo('Form is valid');

                    User.create(vm.userData)
                    .success(function(data) {

                        Log.logInfo('joinController Result ' + data.message + ' success ' + data.success);
                        
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