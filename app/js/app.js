var rideshareApp = angular.module('rideshareApp', ['ngRoute', 'rideshareControllers']);

rideshareApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    })
    .when('/newRide', {
      templateUrl: 'partials/newRide.html',
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

$(function () {
    // click on current location likn 
    $("#showMyLocation").click(function (event) {
        event.preventDefault();
        $(this).html('Determining address...');

        // to show the red marker 
        markOutLocation = function (lat, long) {
             var latlng = new google.maps.LatLng(lat,long);    
              var options = {     
              zoom: 15,     
              center: latlng,     
              mapTypeId: google.maps.MapTypeId.ROADMAP    
              };    
              var map = new google.maps.Map(document.getElementById("map"), options);

              var marker = new google.maps.Marker({      
                position: latlng,       
                map: map,       
                title:"You are here!" // the message once hover over the marker
              });
            }
        // if you give a parmission to your privacy 
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var geocoder = new google.maps.Geocoder();
            var latLng   = new google.maps.LatLng(latitude,longitude);
            geocoder.geocode({
                'latLng': latLng
            }, function (results, status) {    
            // to show your current address
                for (var i = 0; i < results[0].address_components.length; i++) {
                    var address = results[0].address_components[i];
                    if (address.types[0] == "postal_code") {
                        $('#zipcode').html(address.long_name);
                        $('#location').html(results[0].formatted_address);
                        $('#showMyLocation').hide();
                    }
                }
            });
             // call the marker function
             markOutLocation(latitude, longitude);
        }, 
                // No geolocation  
                // the defult address will be CSUF addres
                function () {

                 var latlng = new google.maps.LatLng(33.882322,-117.886511);    
                  var options = {     
                  zoom: 12,     
                  center: latlng,     
                  mapTypeId: google.maps.MapTypeId.ROADMAP    
                  };    
                  var map = new google.maps.Map(document.getElementById("map"), options);

                  var marker = new google.maps.Marker({      
                    position: latlng,       
                    map: map,       
                    title:"Please accept geolocation for me to be able to find you. I've put you in CSUF for now.!"
                  });


                  }
            );
        return false;
    });
});
