rideshareControllers.controller('searchResultsCtrl', ['$scope', '$http', '$rootScope', '$location',
    function($scope, $http, $rootScope, $location) {

        var socket = io();

        var query = JSON.parse(sessionStorage.query);
        $scope.searchResults = JSON.parse(sessionStorage.searchResults);

        $scope.joinRide = function(id) {
            console.log("Joining chat");
            $location.path('/chat');
            console.log('id: ' + id);
            $http.put('/api/ride/add', {
                rideId: id,
                userId: $scope.user._id
            }).success(function(data, status, headers, config) {
                console.log(data);
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
