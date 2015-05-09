var rideshareApp = angular.module('rideshareApp', ['ngRoute', 'rideshareControllers']);

rideshareApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/splashScreen.html',
            controller: 'SplashScreenCtrl'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/result', {
            templateUrl: 'views/searchResults.html',
            controller: 'searchResultsCtrl'
        })
        .when('/newRide', {
            templateUrl: 'views/newRide.html',
            controller: 'NewRideCtrl'
        })
        .when('/404', {
            templateUrl: 'views/404.html',
            controller: ''
        })
        .otherwise({
            redirectTo: '/404'
        });
}]);
