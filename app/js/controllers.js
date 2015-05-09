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
