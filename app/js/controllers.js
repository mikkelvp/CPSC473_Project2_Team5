var rideshareControllers = angular.module('rideshareControllers', []);

rideshareControllers.controller('SplashScreenCtrl', ['$scope', '$location', '$http',
    function($scope, $location, $http) {
        $scope.processAuth = function(authResult) {
            // Do a check if authentication has been successful.
            if (authResult.access_token) {
                // Successful sign in.
                $location.path("/home");

                gapi.client.load('plus', 'v1').then(function() {
                    gapi.client.plus.people.get({
                        userId: 'me'
                    }).execute(function(user) {
                        console.log(user);
                        $http.get('http://localhost:3000/api/person/googleid/' + user.id)
                            .success(function(data, status, headers, config) {
                                console.log(data);
                                if (data.err) {
                                    $http.post('/api/person/', {
                                            googleId: user.id,
                                            givenName: user.name.givenName,
                                            familyName: user.name.familyName
                                        })
                                        .success(function(data, status, headers, config) {
                                            console.log(data);
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

rideshareControllers.controller('HomeCtrl', ['$scope', '$http',
    function($scope, $http) {
        var socket = io();
        var map;

        $scope.rides = [];

        $http.get('http://localhost:3000/api/ride/').success(function(data, status, headers, config){
            data.forEach(function(ride){
                $scope.rides.push("Ride "+($scope.rides.length+1));
            });
        })

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
        }; // showMyLocation

        $scope.search = function() {
            alert('Search pressed!');
        };

        socket.on("add ride", function(){
            // $scope.rides.push(ride);
            console.log("New ride added!");
        });
    }
]);

rideshareControllers.controller('NewRideCtrl', ['$scope', '$http',
    function($scope, $http) {
        var socket = io();

        $scope.createRide = function() {
            var source, destination;
            createLocationFromAddress($scope.source, function(location) {
                source = location;
                createLocationFromAddress($scope.destination, function(location) {
                    destination = location;
                    $http.post('http://localhost:3000/api/ride/', {
                        source: source._id,
                        destination: destination._id,
                        dateTime: Date.now(),
                        availableSeats: $scope.availableSeats,
                        owner: '553eae6b9f85555405000001' //$scope.person
                    }).success(function(data, status, headers, config){
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

        function createLocationFromAddress(address, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $http.post('http://localhost:3000/api/location', {
                            latitude: results[0].geometry.location.A,
                            longitude: results[0].geometry.location.F,
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
                }
            });
        }
    }
]);
