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
    $scope.btnShowMyLocation = "Current Address";
    $scope.btnSearch = "Search";
    
    $scope.map;
    $scope.$on("$viewContentLoaded", function() {
      $scope.map = new GMaps({
        el: '#map',
        lat: 33.882322,
        lng: -117.886511
      });
    });
    
    $scope.showMyLocation = function() {
      $scope.btnShowMyLocation = "Determining Address...";
      GMaps.geolocate({
        success: function(position){
          $scope.$apply(function() {
            $scope.btnShowMyLocation = "Current Address";
          });
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          var geocoder = new google.maps.Geocoder();
          var latLng = new google.maps.LatLng(latitude,longitude);

          $scope.map.setCenter(latitude, longitude);
          $scope.map.addMarker({
            lat: latitude,
            lng: longitude,
            icon:{ // custom marker for current location
              url: 'https://cdn2.iconfinder.com/data/icons/IconsLandVistaMapMarkersIconsDemo/48/MapMarker_Flag_Azure.png'
            },
            animation:google.maps.Animation.DROP,
            title: 'You are here'
          });
          // to show your current address
          geocoder.geocode({
            'latLng': latLng
          },
          function (results, status) {    
            for (var i = 0; i < results[0].address_components.length; i++) {
              var address = results[0].address_components[i];
              if (address.types[0] == "postal_code") {
                $('#zipcode').html(address.long_name);
                //$('#showMyLocation').hide(); // No need to hide the button after finding the current address
                $("#start").val(results[0].formatted_address);
              }
            }
          });
        },
        error: function(error){
          alert('Geolocation failed: '+error.message);
        },
        not_supported: function(){
          alert("Your browser does not support geolocation");
        },
      });
    }; // showMyLocation
    
    $scope.search = function() {
      $scope.btnSearch = "Searching...";
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();

      var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(33.882322, -117.886511)
      };
      var map = new google.maps.Map($('#map')[0], mapOptions);
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel($('#directions-panel')[0]);

      var start = $('#start').val();
      var end = $('#end').val();
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
        $scope.$apply(function() {
          $scope.btnSearch = "Search";
        });
      });
    };
  }]);

rideshareControllers.controller('NewRideCtrl', ['$scope',
  function ($scope) {
    
  }]);