var rideshareApp = angular.module('rideshareApp', ['ngRoute', 'rideshareControllers']);

rideshareApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/splashScreen.html',
            controller: 'SplashScreenCtrl'
        })
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/newRide', {
            templateUrl: 'partials/newRide.html',
            controller: 'NewRideCtrl'
        })
        .when('/availableRides', {
            templateUrl: 'partials/availableRides.html',
            controller: 'NewRideCtrl'
        })
        .when('/404', {
            templateUrl: 'partials/404.html',
            controller: ''
        })
        .otherwise({
            redirectTo: '/404'
        });
}]);
