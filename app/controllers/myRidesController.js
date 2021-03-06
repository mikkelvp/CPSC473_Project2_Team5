rideshareControllers.controller('myRidesCtrl', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {
        if ($scope.isLoggedIn() === false) {
            $location.path('/');
        }

        $('li').removeClass('active');
        $('li:nth-child(2)').addClass('active');

        $http.get('/api/ride/find/' + $scope.user._id)
            .success(function(data, status, headers, config) {
                $scope.myRides = data;
                console.log("My Rides:");
                console.log(data);
            });        

        $http.get('/api/ride/rider/' + $scope.user._id)
            .success(function(data, status, headers, config) {
                $scope.joinedRides = data;
            });

        $scope.rideDetails = function(ride) {
            $rootScope.ride = ride;
            $location.path('/ride');
        }

    }
]);
