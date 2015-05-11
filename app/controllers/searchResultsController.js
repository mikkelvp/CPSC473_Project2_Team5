rideshareControllers.controller('searchResultsCtrl', ['$scope', '$http', '$rootScope', '$location',
    function($scope, $http, $rootScope, $location) {

        var socket = io();

        var query = JSON.parse(sessionStorage.query);
        $scope.searchResults = JSON.parse(sessionStorage.searchResults);

        $scope.joinRide = function(id) {
            console.log("Joining chat");
            $location.path('/chat');

            $http.put('/api/ride/add', {
                rideId: id,
                personId: $scope.user._id
            }).success(function(data, status, headers, config) {
                $rootScope.ride = data;
                $location.path('/ride');
            });
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
