
angular.module('mainCtrl', ['sessionService','authService'])
.controller('mainController', ['$rootScope', '$location', '$window', 'Auth', 'Session',  function($rootScope, $location, $window, Auth, Session) {

    var vm = this;
    var sessionMessage = {};
    vm.showHideTraining = true;
    
    //Turn off the panel
    vm.showTrainingSection = false;

    //console.log('Starting mainController'); 
    
    /*
    if (sessionMessage == '') {
    
        console.log('Calling Session.getNext');

        Session.getNext()
        .success(function(data) {
            
            console.log('sessionData next avi ' + data.nextAvailableFriday);
            console.log('sessionData next actual Friday ' + data.nextActualFriday);
            console.log('sessionData next actual Friday cancelled ' + data.nextActualFridayCancelled);
            
            
            var nextActualFriday = new Date(data.nextActualFriday).toISOString();
            var nextAvailableFriday = new Date(data.nextAvailableFriday).toISOString();
            
            
            if (data.nextActualFridayCancelled === true) {
                
                vm.nextSessionMessage = 'Training is cancelled for ';
                sessionMessage = vm.nextSessionMessage;
                vm.nextSessionDate = nextActualFriday;        
                //+ nextActualFriday.getDate() + 'th ' + nextActualFriday.getMonth();
                   // + '. Next training night is ' + data.nextAvailableFriday;
            } else {
                vm.nextSessionMessage = 'Training is on for '; // + data.nextAvailableFriday;
                sessionMessage = vm.nextSessionMessage;
                vm.nextSessionDate = nextAvailableFriday;
            }
            
        })
        .error(function() {
            console.log('Maincontroller error when calling getNext');
        });
    }*/
    
    //console.log('vm.nextSessionStatus ' + vm.nextSessionStatus);
    
    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();
    
    //console.log('Logged in ' + vm.loggedIn);

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
        
        vm.loggedIn = Auth.isLoggedIn();
        
//console.log('Route changed. location = |' + $location.path() + '|');
        
        // The path is used to control the css class to make the menu text white in color.
        // So if it's /home or / then set it to true. The ngclass in index.html uses this true/false
        // to add a class or not. If true then it adds the class. The class navbarlight sets the text to white
        vm.path = $location.path();
//console.log('vm.path = ' + vm.path);        
        if (vm.path === '') {
            return;
        }
        
        getNextSessionMessage();
        
        //console.log('vm.showTrainingSection ' + vm.showTrainingSection );
        
        //console.log('Real path entered');
        //console.log('Getting the sessionPrivate message ' + Session.getMessage());
        
        if (vm.path == '/home' || vm.path == '/') {
            vm.navlight = true;
            //vm.nextSessionMessage = sessionMessage.nextSessionMessage;
        }
        else {
            vm.navlight = false;
            //vm.nextSessionMessage = '';
        }
        
        
        
    
        //console.log('vm.path ' + vm.path + ' logged in ' + vm.loggedIn + ' vm.navlight ' + vm.navlight);
        
        //if ((vm.loggedIn) && (vm.path != '/home') && (vm.path != '/')) {
        if (vm.loggedIn) {
        
            Auth.getUser()
            .success(function(data) {

                //console.log('mainController - success from Auth.getUser userid = ' + data.userid + ' name ' + data.name + ' admin ' + data.admin);

                // bind the data that come back to vm.user
                vm.me = data;
            })
            .error(function() {
                //console.log('mainController - failure from Auth.getUser');
            });
        }
    });
    
    
    getNextSessionMessage = function() {
        
        //Turn off the panel
        vm.showTrainingSection = false;
        
        //sessionMessage = Session.getMessage();
        //console.log('SessionMessage.nextSessionMessage empty ' + sessionMessage.nextSessionMessage);
        //console.log('Calling Session.getNext');

        Session.getNext()
        .success(function(data) {

            //console.log('sessionData next avi ' + data.nextAvailableFriday);
            //console.log('sessionData next actual Friday ' + data.nextActualFriday);
            //console.log('sessionData next actual Friday cancelled ' + data.nextActualFridayCancelled);

            //Use an object to ensure the data (pass by ref) model changes are seen by ng-if
            vm.nextFridayRunning = {value: false};
            vm.nextFridayShooting = {value: false};
            vm.nextFridayFencing = {value: false};

            if (data.running === true) {
                vm.nextFridayRunning = {value: data.running};   
            } 

            if (data.shooting === true) {
                vm.nextFridayShooting = {value: data.shooting};
            } 

            if (data.fencing === true) {
                vm.nextFridayFencing = {value: data.fencing};
            } 

//console.log('nextAvailableFriday ' + data.nextAvailableFriday);
            var nextActualFriday = new Date(data.nextActualFriday).toISOString();
            var nextAvailableFriday = new Date(data.nextAvailableFriday).toISOString();

            vm.nextActualFriday = nextActualFriday; 

            vm.nextActualFridayCancelled = data.nextActualFridayCancelled;

            if (data.nextActualFridayCancelled === true) {

                vm.nextAvailableSession = 'Next Training Session';
                vm.nextAvailableDate = nextAvailableFriday;
            } else {
                vm.nextAvailableSession = '';
                vm.nextAvailableDate = '';
            }

            /*console.log('The next session is ' + data.nextActualFriday);
            console.log('Running is ' + vm.nextFridayRunning.value);
            console.log('Shooting is ' + vm.nextFridayShooting.value);
            console.log('Fencing is ' + vm.nextFridayFencing.value);
            console.log('If canned. ' + vm.nextAvailableSession);
            console.log(data.nextAvailableFriday);
            */
        });
    }
    
    
    // function to display training session panel
    vm.displayTrainingSection = function() {
        //console.log('drop panel down');
        vm.showTrainingSection = true;
        //console.log('vm.showTrainingSection ' + vm.showTrainingSection);
    }
    
    // function to close training session panel
    vm.closeTrainingSection = function() {
        //console.log('hide panel');
        vm.showTrainingSection = false;
        //console.log('vm.showTrainingSection ' + vm.showTrainingSection);
    }
    
    vm.toggleTraining = function() {
        
        if (vm.showHideTraining === false) {
            vm.showHideTraining = true;
        } else {
            vm.showHideTraining = false;
            //Hide panel too
            vm.showTrainingSection = false;
        }
    }
    
    // function to handle login form
    vm.doLogin = function() {

        //console.log('Maincontroller - attempting login');
        vm.processing = true;
        // clear the error
        vm.error = '';

        // call the Auth.login() function
        Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data) {

            vm.processing = false;

            if (data.success) {
                // if a user successfully logs in, redirect to users page
                //console.log('Maincontroller - successfully logged in');
                $location.path('/events');
            }
            else {
                //console.log('Maincontroller - failed to log in data ' + data.message);
                vm.error = data.message;
            }
        })
        .error(function() {
            //console.log('Maincontroller error ' + data.message);
            vm.error = data.message;
        });
    };
    
    //Get the currently logged in user details
    /*
    vm.getMe= function() {
        console.log('Maincontroller - getting logged in user details');
        Auth.getUser()
        .success(function(data) {

            console.log('mainController - success from User.all');
            
            // bind the data that come back to vm.user
            vm.user = data;
        })
        .error(function() {
            console.log('mainController - failure from Auth.getUser');
        });
    };
    */
    
    // function to handle logging out
    vm.doLogout = function() {

        //console.log('Maincontroller - attempting logout');
        Auth.logout();
        // reset all user info
        vm.user = {};
        $location.path('/home');
        $window.location.href = '/';
    };


    // function to handle forgot password
    vm.forgotPassword = function() {

        vm.error = '';
        vm.feedback = '';

        //console.log('Maincontroller - forgot password');

        if (vm.loginData.username == undefined) {
            vm.error = 'Username must be supplied';
            return;    
        }

        //console.log('vm.loginData.username ' + vm.loginData.username);

        // call the Auth.login() function
        Auth.forgotPassword(vm.loginData.username)
        .success(function(data) {

            vm.processing = false;

            if (data.success) {
                //console.log('Maincontroller - successfully requested forgot');
                vm.feedback = 'An email has been sent to your mailbox containing further instructions';
            }
            else {
                //console.log('Maincontroller - failed to request forgot ' + data.message);
                vm.error = data.message;
            }
        })
        .error(function() {
            //console.log('Maincontroller error ' + data.message);
            vm.error = data.message;
        });
        
    };


    
    
    vm.imageUpload = function(){
        
        //console.log('Trying to pick an image');
        
        filepicker.setKey("AefnYNwSgmAycoGb9yH7Az");
        
        //filepicker.pick(picker_options, onSuccess(Blob){}, onError(FPError){}, onProgress(FPProgress){})
        filepicker.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                //console.log(JSON.stringify(Blob));
                //console.log('success from pick');
                //console.log(replaceHtmlChars(JSON.stringify(Blob)));
                //vm.superhero.picture = Blob;
                //vm.$apply();
            },
            function(error){
                //console.log('failure from pick');
                //console.log(error.toString()); 
            }
        );
    };

}]);