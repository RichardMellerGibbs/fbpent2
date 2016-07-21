// EVENT CONTROLLER
angular.module('eventCtrl', ['eventService', 'userService','authService'])
.controller('eventController', ['$location', '$sce', 'User', 'Auth', 'Event', function($location, $sce, User, Auth, Event) {


    var vm = this;
    
    vm.errorType = 'Error!';
    
    //$rootScope.navdark = true;
    //console.log('Inside the eventController');
    
    
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
        
        
        // grab all the sessions at page load
        Event.all()
        .success(function(data) {

            //console.log('eventController - success from Event.all');
            //console.log('data length ' + data.length);

            //Loop through the event descriptions
            for (var i = 0; i < data.length; i++) {
                
                
                    
                    /*console.log('event iteration ' + i + ' text ' + data[i].description); 

                    var startPos = data[i].description.indexOf("<p_urlLink>");
                    var initialText = data[i].description.substring(0, startPos);

                    var endPos = data[i].description.indexOf("</p_urlDescription>"); 
                    endPos+=19;
                    var finalText = data[i].description.substring(endPos);

                    //Cut out link section
                    var linkText = data[i].description.substring(startPos, endPos);

                    console.log('initialText = *' + initialText + '*');
                    console.log('finalText = *' + finalText + '*');
                    console.log('linkText = *' + linkText + '*');
                    

                    var replacedUserText1 = linkText.replace('<p_urlLink>', "<a href='");
                    var replacedUserText2 = replacedUserText1.replace('</p_urlLink>', "'>");
                    var replacedUserText3 = replacedUserText2.replace('<p_urlDescription>', '');
                    var replacedUserText4 = replacedUserText3.replace('</p_urlDescription>', '</a>');

                    console.log('new ' + replacedUserText4);
                    data[i].description = $sce.trustAsHtml("<span ng-bind-html = " + replacedUserText4 + "></span>");
                    //<span ng-bind-html = <a href='www.bbc.co.uk'>Twitter</a>></span>
                    //<span ng-bind-html = "event.mylink"></span>
                    //vm.mylink = $sce.trustAsHtml(replacedUserText4);
                    */

                    //Make sure the URL starts with http://
                    var urLlText = data[i].eventUrl;
                    //console.log('urLlText ' + urLlText);
                    var urlStart = '';

                    if (urLlText != undefined) {
                        urlStart = urLlText.substring(0, 3);    
                        //console.log('urlStart ' + urlStart);
                    }

                    var urlValue = '';

                    if (urlStart == 'www') {
                        urlValue = 'http://' + data[i].eventUrl;
                    } else {
                        urlValue = data[i].eventUrl;
                    }

                    //Prepare the url string
                    var linkText = "<a href=" + urlValue + ">" + data[i].eventUrlDescription + "</a>";
                    //console.log('linkText ' + linkText);

                    //Mark the string as guaranteed html for angular
                    data[i].urlLink = $sce.trustAsHtml(linkText);
                    //vm.urlLink = $sce.trustAsHtml(linkText);
            }

            // bind the sessions that come back to vm.sessions
            vm.events = data;
            //vm.mylink = $sce.trustAsHtml("<a href='http://twitter.com'>Twitter</a>");
        });
    }
    
    
    //CALLS THE ADD EVENT VIEW
    vm.addEvent = function() {
        
        //console.log('addEvent function called in event controller ');
        
        $location.path('/maintEvent/x');
        
    }
    
    
    vm.eventDetail = function(event) {
        
        if (!vm.me.admin) {
            return;        
        }
        
        //console.log('Called eventDetail ' + event.title);
        
        vm.event = event;
        
        $location.path('/maintEvent/' + event._id);
    }
       
}]);