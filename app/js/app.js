var rideshareApp = angular.module('rideshareApp', ['ngRoute', 'rideshareControllers']);

rideshareApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        })
        .when('/result', {
            templateUrl: 'views/searchResults.html',
            controller: 'searchResultsCtrl'
        })
        .when('/newRide', {
            templateUrl: 'views/newRide.html',
            controller: 'newRideCtrl'
        })
        .when('/myRides', {
            templateUrl: 'views/myRides.html',
            controller: 'myRidesCtrl'
        })
        .when('/404', {
            templateUrl: 'views/404.html',
            controller: ''
        })
        .otherwise({
            redirectTo: '/404'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}]);
