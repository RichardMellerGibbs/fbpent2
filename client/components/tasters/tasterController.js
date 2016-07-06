// TASTER CONTROLLER

//angular.module('sessionCtrl', ['sessionService', 'userService'])
//.controller('sessionController', ['$location', 'User', 'Auth', 'Session', function($location, User, Auth, Session) {
    
angular.module('tasterCtrl', ['tasterService', 'userService','authService'])
.controller('tasterController', ['User', 'Auth', 'Taster', function(User, Auth, Taster) {

    var vm = this;
    
    vm.errorType = 'Error!';
    
    //console.log('Inside the tasterController');
    

    // grab all the taster sessions at page load
    Taster.all()
    .success(function(data) {

        //console.log('tasterController - success from Taster.all');

        // bind the sessions that come back to vm.sessions
        vm.tasters = data;
    });    
}]);