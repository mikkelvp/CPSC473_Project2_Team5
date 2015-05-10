rideshareControllers.controller('newRideCtrl', ['$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {
        if ($scope.isLoggedIn() === false) {
            $location.path('/');
        }

        var socket = io();

        $('li').removeClass('active');
        $('li:nth-child(3)').addClass('active');

        $scope.createRide = function() {
            var source, destination, googleid;
            $scope.createLocationFromAddress($scope.source, true, function(location) {
                source = location;
                $scope.createLocationFromAddress($scope.destination, true, function(location) {
                    destination = location;

                    $http.post('/api/ride/', {
                            source: source._id,
                            destination: destination._id,
                            dateTime: $scope.date,
                            availableSeats: $scope.availableSeats,
                            owner: $scope.user._id,
                        })
                        .success(function(data, status, headers, config) {
                            console.log("New ride: ");
                            console.log(data);
                            socket.emit("new ride", data);
                            $location.path('/myRides'); //make it redirect to details page of ride later
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
            $scope.date = new Date();
            $("#dateTimePicker").datetimepicker({
                defaultDate: $scope.date
            });
        };

        $scope.$on("$viewContentLoaded", $scope.getDateTime());
    }
]);
