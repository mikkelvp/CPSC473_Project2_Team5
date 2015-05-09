var rideshareControllers = angular.module('rideshareControllers', [])
    .run(function($rootScope, $http) {
        $rootScope.createLocationFromAddress = function(address, saveToDb, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (saveToDb === true) {
                        $http.post('http://localhost:3000/api/location', {
                                loc: [results[0].geometry.location.A,
                                    results[0].geometry.location.F
                                ],
                                address: results[0].formatted_address
                            })
                            .success(function(data, status, headers, config) {
                                console.log(data);
                                callback(data);
                            })
                            .error(function(data, status, headers, config) {
                                console.log('err');
                                return 'err';
                            });
                    } else {
                        callback({
                            loc: [results[0].geometry.location.A,
                                results[0].geometry.location.F
                            ]
                        });
                    }
                }
            });
        };
    });
<<<<<<< HEAD
    
  }]);

rideshareControllers.controller('HomeCtrl', ['$scope', '$location',
  function ($scope, $location) {
    $scope.goHome = function() {
      $location.path("/home");
    };
    $scope.newRide = function() {
      $location.path("/newRide");
    };
    $scope.availableRides = function() {
      $location.path("/availableRides");
    }
  }]);

rideshareControllers.controller('NewRideCtrl', ['$scope',
  function ($scope) {
    $scope.btnShowMyLocation = "Current Address";
    $scope.btnSearch = "Add Ride";
    
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
                $('#showMyLocation').hide();
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
      $scope.btnSearch = "Adding ride...";
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();

      var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(33.882322, -117.886511)
      };
      var map = new google.maps.Map($('#map')[0], mapOptions);
      directionsDisplay.setMap(map);
      $('#directions-panel').empty();
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
          $scope.btnSearch = "Add Ride";
        });
      });
    };
    
    $scope.searching = function() {
      $scope.btnSearching = "Searching...";
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();

      var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(33.882322, -117.886511)
      };
      var map = new google.maps.Map($('#map')[0], mapOptions);
      directionsDisplay.setMap(map);
      $('#directions-panel').empty();
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
        $.post("api/getrides", function(response) {
          response.rides.forEach(function(ride) {
            if (ride.start == start && ride.end == end) {
              $('#availableRides').append($('<button>').text(ride.owner));
            }
          });
        });
        $scope.$apply(function() {
          $scope.btnSearch = "Search";
        });
      });
    };
  }]);
=======

rideshareControllers.controller('SplashScreenCtrl', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {
        $scope.processAuth = function(authResult) {
            // Do a check if authentication has been successful.
            if (authResult.access_token) {
                // Successful sign in.
                $location.path("/home");

                gapi.client.load('plus', 'v1').then(function() {
                    gapi.client.plus.people.get({
                        userId: 'me'
                    }).execute(function(user) {
                        $http.get('http://localhost:3000/api/person/googleid/' + user.id)
                            .success(function(data, status, headers, config) {
                                console.log(data);
                                $rootScope.user = data;
                                if (data.err) {
                                    $http.post('/api/person/', {
                                            googleId: user.id,
                                            givenName: user.name.givenName,
                                            familyName: user.name.familyName
                                        })
                                        .success(function(data, status, headers, config) {
                                            console.log(data);
                                            $rootScope.user = data;
                                        });
                                }
                            })
                            .error(function(data, status, headers, config) {
                                console.log(data);
                            });
                    });
                });
            } else if (authResult.error) {
                // Error while signing in.
                console.log("Could not log in successfully.");
            }
        };

        $scope.signInCallback = function(authResult) {
            $scope.$apply(function() {
                $scope.processAuth(authResult);
            });
        };

        $scope.renderGPlusLoginBtn = function() {
            gapi.signin.render('signInButton', {
                "callback": $scope.signInCallback, // Function handling the callback.
                "clientid": "683077495017-rcddi5bfi76bjdmd1bv154n9iip44o5i.apps.googleusercontent.com",
                "requestvisibleactions": "http://schema.org/AddAction",
                "cookiepolicy": "single_host_origin",
                "scope": "https://www.googleapis.com/auth/plus.login"
            });
        };

        $scope.$on("$viewContentLoaded", function() {
            $scope.renderGPlusLoginBtn();
        });

    }
]);

rideshareControllers.controller('HomeCtrl', ['$scope', '$http', '$rootScope', '$location',
    function($scope, $http, $rootScope, $location) {
        var socket = io();
        var map;

        $scope.rides = [];

        $http.get('http://localhost:3000/api/ride/').success(function(data, status, headers, config) {
            data.forEach(function(ride) {
                $scope.rides.push("Ride " + ($scope.rides.length + 1));
            });
        });

        $scope.$on("$viewContentLoaded", function() {
            var mapCanvas = document.getElementById('map-canvas');
            var mapOptions = {
                center: new google.maps.LatLng(33.882322, -117.886511),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(mapCanvas, mapOptions);
        });

        $scope.getCurrentDestination = function() {
            var geocoder = new google.maps.Geocoder();
            var latlng;
            navigator.geolocation.getCurrentPosition(function(position) {
                latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                geocoder.geocode({
                    latLng: latlng
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results) {
                            $scope.$apply(function() {
                                $scope.source = results[0].formatted_address;

                                map.setCenter(latlng);
                                var marker = new google.maps.Marker({
                                    position: latlng,
                                    map: map,
                                    animation: google.maps.Animation.DROP,
                                    title: 'You are here'
                                });
                                marker.setMap(map);
                                map.setZoom(12);

                            });
                        } else {
                            alert('No results found');
                        }
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            });
        };


        $scope.search = function() {
            var query = {};
            query.maxDistance = 2; // search radius in miles - $scope.maxDistance;
            $rootScope.createLocationFromAddress($scope.source, false, function(location) {
                query.source = location;
                $rootScope.createLocationFromAddress($scope.destination, false, function(location) {
                    query.destination = location;
                    console.log('src: ' + query.source.loc + ' dst: ' + query.destination.loc);
                    $http.post('/api/ride/find/', query)
                        .success(function(data, status, headers, config) {
                            console.log(data);
                            $rootScope.searchResults = data;
                            $location.path('/result');
                        });
                });
            });


        };

        socket.on("add ride", function() {
            // $scope.rides.push(ride);
            console.log("New ride added!");
        });
    }
]);


rideshareControllers.controller('NewRideCtrl', ['$scope', '$rootScope', '$http',
    function($scope, $rootScope, $http) {
        var socket = io();

        $scope.createRide = function() {
            var source, destination, googleid;
            $rootScope.createLocationFromAddress($scope.source, true, function(location) {
                source = location;
                $rootScope.createLocationFromAddress($scope.destination, true, function(location) {
                    destination = location;

                    $http.post('http://localhost:3000/api/ride/', {
                        source: source._id,
                        destination: destination._id,
                        dateTime: Date.now(),
                        availableSeats: $scope.availableSeats,

                        owner: $rootScope.user._id,
                    }).success(function(data, status, headers, config) {
                        console.log("NEW RIDE ADDED");
                        socket.emit("add ride");
                    });
                });
            });
        };

        $scope.getCurrentDestination = function getCurrentAddress() {
            var geocoder = new google.maps.Geocoder();
            var latlng;
            navigator.geolocation.getCurrentPosition(function(position) {
                latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                geocoder.geocode({

                    latLng: latlng
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results) {
                            $scope.$apply(function() {
                                $scope.source = results[0].formatted_address;
                            });
                        } else {
                            alert('No results found');
                        }
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            });
        };

        $scope.getDateTime = function() {
            $("#dateTimePicker").datetimepicker({
                defaultDate: "05/06/2015"
                    /*,
                                  disabledDates: [
                                      moment("12/25/2013"),
                                      new Date(2013, 11 - 1, 21),
                                      "11/22/2013 00:53"
                                  ]*/
            });
        };

        $scope.$on("$viewContentLoaded", $scope.getDateTime());
    }
]);


rideshareControllers.controller('searchResultsCtrl', ['$scope', '$http',
    function($scope, $http) {

    }
]);
>>>>>>> redo
