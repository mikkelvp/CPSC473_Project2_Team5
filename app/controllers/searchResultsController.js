rideshareControllers.controller('searchResultsCtrl', ['$scope', '$http', '$rootScope', '$location',
    function($scope, $http, $rootScope, $location) {

        var socket = io();

        var query = JSON.parse(sessionStorage.query);
        $scope.searchResults = JSON.parse(sessionStorage.searchResults);

        $scope.joinRide = function(ride) {
            var id = ride._id;
            if(ride.availableSeats - ride.riders.length > 0){
                console.log('id: ' + id);
                $http.put('/api/ride/add', {
                    rideId: id,
                    personId: $scope.user._id
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    alert('Ride joined');
                    $rootScope.ride = data;
                    $location.path('/ride');
                });
            } else {
                alert("Ride is full");
            }            
        };


        socket.on("new ride", function(ride) {
            $http.post('/api/ride/find/', query)
                .success(function(data, status, headers, config) {
                    $scope.searchResults = data;
                    sessionStorage.searchResults = JSON.stringify(data);
                });
        });
    }
]);
