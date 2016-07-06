// CONTACTMEMBERS CONTROLLER
angular.module('contactMembersCtrl', ['contactMembersService', 'userService','authService'])
.controller('contactMembersController', ['$location', 'User', 'Auth', 'ContactMembers', function($location, User, Auth, ContactMembers) {

    var vm = this;
    
    vm.errorType = 'Error!';
    vm.error = '';
    vm.feedback = '';
    vm.sendButton = true;
    vm.specificButton = true;
    vm.additionalMemebersSection = false;
    vm.additionalMember = [];
    
    //$rootScope.navdark = true;
    //console.log('Inside the contactMembersController');
    
    
    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();
    
    if (vm.loggedIn === false){
        $location.path('/login');        
    } else {
        
        
        //Get the logged in user
        Auth.getUser()
        .success(function(data) {

            // bind the data that come back to vm.user
            vm.me = data;
            //console.log('admin is ' + vm.me.admin);
        });
        
    }
    
    vm.addSpecific = function() {

        vm.specificButton = false;
        //console.log('inside add specific');
        
        User.all()
            .success(function(data) {

                //console.log('contactMemController - success from User.all');

                // bind the users that come back to vm.users
                vm.memberCount = data.length;
                vm.users = data;
            })
            .error(function() {
                //console.log('contactMemController - failure from User.all');
            }); 
    }
    
    
    vm.closeSpecific = function() {
        vm.specificButton = true;
    }
    
    vm.userDetail = function(member) {
        //console.log('Called userDetail ' + member.name);
        
        vm.additionalMemebersSection = true;
        
        vm.additionalMember.push(member);
    }
    
    
    
    vm.sendEmail = function() {
        
        var admin = false;
        var standard = false;
        vm.feedback = '';
        vm.error = '';
        
        console.log('contactMembers function called in contactMembers controller ');
        
        //VALIDATION
        if (!vm.subject) {
            vm.error = 'The email subject must be specified';
            return;        
        }
        
        if (!vm.message) {
            vm.error = 'The email message must be specified';
            return;        
        }
        
        if (vm.admin == true) {
            console.log('admin is true');
            admin = true;
        }
        
        if (vm.standard == true) {
            standard = true;
        }
        
        for (i=0; i<vm.additionalMember.length; i++) {
            //console.log('additional member i ' + i + ' is ' + vm.additionalMember[i].username);
        }
        
        var contactData = {
            subject: vm.subject,
            message: vm.message,
            admin: admin,
            standard: standard,
            //from: 'paulhooper@gmail.com',
            from: vm.me.username,
            additionalMember: vm.additionalMember 
        };
        
        //console.log('from ' + vm.me.username);
        
        ContactMembers.create(contactData)
        .success(function(data) {

            //console.log('contactMembersController success ' + data.success);
            //console.log('contactMembersController Result ' + data.message);
            
            if (data.success === true) {
                vm.error = '';
                vm.additionalMemebersSection = false;
                vm.additionalMember = [];
                vm.subject = '';
                vm.message = '';
                vm.admin = false;
                vm.standard = false;
                
                vm.feedback = 'Emails sent';
                //$location.path('/sessions');
            } else {
                vm.error = data.message;
            }
                    
        });
        
    }
}]);