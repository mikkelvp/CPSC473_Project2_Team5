var rideshareControllers = angular.module('rideshareControllers', []);

rideshareControllers.controller('SplashScreenCtrl', ['$scope', '$location',
  function ($scope, $location) {    
    $scope.processAuth = function (authResult) {
      // Do a check if authentication has been successful.
      if (authResult['access_token']) {
        // Successful sign in.
        $location.path("/home");
        //     ...
        // Do some work [1].
        //     ...
      } else if (authResult['error']) {
        // Error while signing in.
        // Report error.
        console.log("Could not log in successfully.");
      }
    };
    
    $scope.signInCallback = function(authResult) {
      $scope.$apply(function() {
        $scope.processAuth(authResult);
      });
    };
    
    $scope.renderGPlusLoginBtn = function () {
      gapi.signin.render('signInButton',
        {
          "callback": $scope.signInCallback, // Function handling the callback.
          "clientid": "683077495017-rcddi5bfi76bjdmd1bv154n9iip44o5i.apps.googleusercontent.com",
          "requestvisibleactions": "http://schema.org/AddAction",
          "cookiepolicy": "single_host_origin",
          "scope": "https://www.googleapis.com/auth/plus.login"
        }
      );
    };
    
    $scope.$on("$viewContentLoaded", function() {
      $scope.renderGPlusLoginBtn();
    });
    
  }]);

rideshareControllers.controller('HomeCtrl', ['$scope',
  function ($scope) {
    
  }]);

rideshareControllers.controller('LoginCtrl', ['$scope',
  function ($scope) {
    
  }]);

rideshareControllers.controller('NewRideCtrl', ['$scope',
  function ($scope) {
    
  }]);