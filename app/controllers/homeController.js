rideshareControllers.controller('homeCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        if ($scope.isLoggedIn() === false) {
            $location.path('/');
        }

        var socket = io();
        var map;

        $('li').removeClass('active');
        $('li:first-child').addClass('active');

        $scope.rides = [];
        $scope.radius = 5;

        $http.get('/api/ride/').success(function(data, status, headers, config) {
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
            query.maxDistance = $scope.radius; // search radius in miles
            $scope.createLocationFromAddress($scope.source, false, function(location) {
                query.source = location;
                $scope.createLocationFromAddress($scope.destination, false, function(location) {
                    query.destination = location;
                    sessionStorage.query = JSON.stringify(query);
                    console.log('src: ' + query.source.loc + ' dst: ' + query.destination.loc);
                    $http.post('/api/ride/find/', query)
                        .success(function(data, status, headers, config) {
                            //console.log("data: "+data);
                            //rides.add(data);
                            sessionStorage.searchResults = JSON.stringify(data);
                            console.log(JSON.parse(sessionStorage.searchResults));
                            $location.path('/result');
                        });
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
