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

        $scope.$on("$viewContentLoaded", function() {
            var mapCanvas = document.getElementById('map-canvas');
            var mapOptions = {
                center: new google.maps.LatLng(33.882322, -117.886511),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(mapCanvas, mapOptions);
        });

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

        $scope.showDirection = function() {
        if ($scope.destination == null){
             alert('Please, enter the distnation');
        } else if ($scope.source == null){
             alert('Please, enter the source');
        } else {
          var directionsDisplay = new google.maps.DirectionsRenderer();
          var directionsService = new google.maps.DirectionsService();

          var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(33.882322, -117.886511)
          };
          var map = new google.maps.Map($('#map-canvas')[0], mapOptions);
          directionsDisplay.setMap(map);

          var start = $scope.source ;
          var end = $scope.destination ;
          var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                 }
            });
        }
          
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
