angular.module('maintEventCtrl', ['eventService', 'userService','authService'])
.controller('maintEventController', ['$location', '$routeParams', 'User', 'Auth', 'Event', 'filepicker',
 function($location, $routeParams, User, Auth, Event, filepicker) {
    
    var vm = this;
    var eventId = '';
    
    vm.eventId = '';
    vm.updateButton = true;
    vm.showDeleteSection = false;
    vm.addButton = false;
    vm.deleteButton = true;
    
    vm.errorType = 'Error!';
    vm.error = '';
    vm.feedback = '';
    
    //console.log('Inside the maintEventController. event id ' + $routeParams.eventId);
    
    
    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct to login page if user no logged in
    if (vm.loggedIn === false) {
        $location.path('/login');  
    } else {
        
        //If a eventId is passed in the get the details of it
        
        if ($routeParams.eventId !== 'x') {
            vm.eventId = $routeParams.eventId;
                
            //Now get the event details for this event
            
            Event.get(vm.eventId)
            .success(function(data) {

                //console.log('maintEventController - success from Event.get ' + JSON.stringify(data));

                vm.event = data;
                
                vm.eventDate = {value: new Date(data.eventDate)};
                //console.log('event.picture = ' + vm.event.picture);
            })
            .error(function() {
                //console.log('maintEventController - failure from Event.get');
            });
        }
        else {
            //console.log('Called in add mode');
            
            //TURN OFF UPDATE AND DELETE BUTTONS AND LEAVE ON ADD BUTTON
            vm.updateButton = false;
            vm.addButton = true;
            vm.deleteButton = false;
        }
            
    }
    
    vm.addEvent = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //console.log('adding the event data ');
        
        //VALIDATE FORM
        if (!vm.event.title) {
            vm.error = 'A event title must be supplied';
            return;        
        }
        
        if (!vm.event.description) {
            vm.error = 'A event description must be supplied';
            return;        
        }

        if (!vm.event.eventUrl && vm.event.EventUrlDescription) {
            vm.error = 'A event URL must be supplied if a URL description is present';
            return;        
        }
        
        var eventData = {
            eventDate: vm.eventDate.value,
            title: vm.event.title,
            description: vm.event.description,
            eventUrl: vm.event.eventUrl,
            eventUrlDescription: vm.event.EventUrlDescription
        };
        
        if (vm.event.picture) {
            eventData.picture = vm.event.picture
        }
        
        Event.create(eventData)
        .success(function(data) {

            //console.log('maintEventController success ' + data.success);
            //console.log('maintEventController Result ' + data.message);
            
            if (data.success === true) {
                vm.feedback = 'Event added';
                $location.path('/events');
            } else {
                vm.error = data.message;
            }
                    
        });
    }
    
    //Add the tags to a URL to make it clickable
    /*vm.addLink = function() {
    
        var input = document.getElementsByTagName('textarea')[0];
        var selectedText = input.value.substring(input.selectionStart, input.selectionEnd);

        var urlDesc = 'Twitter';
        var urlLink = '<p_urlLink>' + selectedText + '</p_urlLink><p_urlDescription>' + urlDesc + '</p_urlDescription>'; 

        console.log('selectedText = ' + selectedText);
        console.log('urlLink ' + urlLink);

        //Put the new link text back into the textarea
        var userText = vm.event.description;
        var replacedUserText = userText.replace(selectedText, urlLink);
        console.log('userText ' + replacedUserText);

        vm.event.description = replacedUserText;
    }*/
    
    vm.updateEvent = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //console.log('updating the event data ');
        
        //console.log('eventDate ' + vm.eventDate.value);
        //console.log('title ' + vm.event.title);
        //console.log('description ' + vm.event.description);
        //console.log('eventUrlDescription ' + vm.event.eventUrlDescription);
        
        //VALIDATE FORM
        //eventDate must have a value
        if (!vm.eventDate.value) {
            vm.error = 'A event date must be supplied';
            return;        
        }
        
        if (!vm.event.title) {
            vm.error = 'A event title must be supplied';
            return;        
        }
        
        if (!vm.event.description) {
            vm.error = 'A event description must be supplied';
            return;        
        }

        if (!vm.event.eventUrl) { 
            if (vm.event.eventUrlDescription) {
                vm.error = 'A event URL must be supplied if a URL description is present';
                return;
            }        
        }
        
        var eventData = {
            eventDate: vm.eventDate.value,
            title: vm.event.title,
            description: vm.event.description,
            eventUrl: vm.event.eventUrl,
            eventUrlDescription: vm.event.eventUrlDescription
        };
        
        if (vm.event.picture) {
            eventData.picture = vm.event.picture;
        }
        
        //console.log('eventData.picture ' + eventData.picture);
        //console.log('eventData.picture url ' + eventData.picture.url);
        
        Event.update(vm.eventId, eventData)
        .success(function(data) {

            //console.log('maintEventController success ' + data.success);
            //console.log('maintEventController Result ' + data.message);
            
            if (data.success === true) {
                vm.feedback = 'Event updated';
                $location.path('/events');
            } else {
                vm.error = data.message;
            }
                    
        });
    }
    
    
    vm.confirmDelete = function() {
        //Turn off main buttons including the delete button just pressed
        vm.updateButton = false;
        vm.deleteButton = false;
        vm.addButton = false;
        
        //Turn on the delete confirmation buttons
        vm.showDeleteSection = true;
        
        //Show delete warning
        vm.error = 'This will delete the event. Please confirm';
        vm.errorType = 'Warning!';
    }
    
    
    vm.closeDeleteSection = function() {
        //Turn on main buttons including the delete button just pressed
        vm.updateButton = true;
        vm.deleteButton = true;
        vm.addButton = false;
        
        //Turn off the delete confirmation buttons
        vm.showDeleteSection = false; 
        
        //Close delete warning
        vm.error = '';
        vm.errorType = 'Error!';
    }
    
    
    vm.deleteEvent = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        if (!vm.eventId) {
            vm.error = 'No event specified';
            return;         
        }
        
        //console.log('attempting delete of event id ' + vm.eventId);
        
        
        Event.delete(vm.eventId)
        .success(function(data) {

            if (data.success === true) {
                vm.feedback = 'Event deleted';
            } else {
                vm.error = data.message;
            }
            
            //console.log('maintEventController Result ' + data.message);
            $location.path('/events');
        });
    }
    
    
    vm.imageUpload = function(){
        
       //console.log('Trying to pick an image');
            
        //filepicker.pick(picker_options, onSuccess(Blob){}, onError(FPError){}, onProgress(FPProgress){})
        filepicker.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH',
                imageMax: [800, 800]
            },
            function(Blob){
                //console.log(JSON.stringify(Blob));
                //console.log('success from pick');
                //console.log(JSON.stringify(Blob));
                vm.event.picture = Blob.url;
                //console.log('vm.event.picture ' + vm.event.picture);
                //vm.$apply();
            },
            function(error){
                //console.log('failure from pick');
                //console.log(error.toString()); 
            }
        );
        /*vm.picture = {"url":"https://cdn.filepicker.io/api/file/ITR11eYRUyFLiGNvVYIR","filename":"dave_hallam.JPG","mimetype":"image/jpeg","size":64552,"id":1,"client":"computer","isWriteable":true};*/
        
        
                    //{"url":"https://cdn.filepicker.io/api/file/ITR11eYRUyFLiGNvVYIR","filename":"dave_hallam.JPG","mimetype":"image/jpeg","size":64552,"id":1,"client":"computer","isWriteable":true}
    };
    
    
}]);    