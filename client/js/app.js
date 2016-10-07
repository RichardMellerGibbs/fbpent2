//Angular application
"use strict";

(function () {

	angular.module('app', [
		'ngRoute',
        'ngAnimate',
        'mainCtrl',
        'homeCtrl',
        'userCtrl',
        'maintUserCtrl',
        'maintSessionCtrl',
        'joinCtrl',
        'landCtrl',
        'sessionCtrl',
        'eventCtrl',
        'maintEventCtrl',
        'tasterCtrl',
        'contactMembersCtrl',
        'angular-filepicker',
        'maintHomeCtrl',
		'resetCtrl'
		])
    
    // application configuration to integrate token into requests
    .config(function($httpProvider) {

        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    })
      
	.config(function($routeProvider, filepickerProvider) {
    //.config(function($routeProvider, filepickerProvider) {
	
		$routeProvider

		//route for the home page
        .when('/', {
            templateUrl: 'components/home/home.html',
            controller: 'homeController',
            controllerAs: 'home'
        })
        
        .when('/join', {
			templateUrl: 'components/join/join.html',
			controller: 'joinController',
            controllerAs: 'join'
		})

		.when('/login', {
			templateUrl: 'components/login/login.html',
			controller: 'mainController',
            controllerAs: 'login'
		})

		.when('/home', {
			templateUrl: 'components/home/home.html',
			controller: 'homeController',
            controllerAs: 'home'
		})

		.when('/about', {
			templateUrl: 'views/about.html',
			controller: 'aboutController'
		})

		.when('/contact', {
			templateUrl: 'views/contact.html',
			controller: 'contactController'
		})
        
        .when('/allusers', {
			templateUrl: 'components/users/user.html',
			controller: 'userController',
            controllerAs: 'user'
		})
        
        .when('/maintUser/:memberId', {
			templateUrl: 'components/maintUser/maintUser.html',
			controller: 'maintUserController',
            controllerAs: 'maintUser'
		})
        
        .when('/maintSession/:sessionId', {
			templateUrl: 'components/maintSession/maintSession.html',
			controller: 'maintSessionController',
            controllerAs: 'maintSession'
		})
            
        .when('/landusers', {
			templateUrl: 'components/land/land.html',
			controller: 'landController',
            controllerAs: 'land'
		})
        
        .when('/sessions', {
			templateUrl: 'components/sessions/session.html',
			controller: 'sessionController',
            controllerAs: 'session'
		})
        
        .when('/events', {
			templateUrl: 'components/events/event.html',
			controller: 'eventController',
            controllerAs: 'event'
		})
        
        .when('/maintEvent/:eventId', {
			templateUrl: 'components/maintEvent/maintEvent.html',
			controller: 'maintEventController',
            controllerAs: 'maintEvent'
		})
        
        .when('/tasters', {
			templateUrl: 'components/tasters/taster.html',
			controller: 'tasterController',
            controllerAs: 'taster'
		})
        
        .when('/contactMembers', {
			templateUrl: 'components/contactMembers/contactMembers.html',
			controller: 'contactMembersController',
            controllerAs: 'contactMembers'
		})
        
        .when('/maintHome', {
			templateUrl: 'components/maintHome/maintHome.html',
			controller: 'maintHomeController',
            controllerAs: 'maintHome'
		})

		.when('/reset/:token', {
			templateUrl: 'components/reset/reset.html',
			controller: 'resetController',
			controllerAs: 'reset'
		})
        
        
		.otherwise({redirectTo: '/home'});
        
        //Add the API key to use filestack service
        filepickerProvider.setKey('AefnYNwSgmAycoGb9yH7Az');
	})

})();	