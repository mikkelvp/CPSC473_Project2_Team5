rideshareControllers.controller('myRidesCtrl', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {
        if ($scope.isLoggedIn() === false) {
            $location.path('/');
        }

        $scope.myRides = [];

        $('li').removeClass('active');
        $('li:nth-child(2)').addClass('active');

        $http.get('/api/ride/find/' + $scope.user._id)
            .success(function(data, status, headers, config) {
                $scope.myRides = data;
                console.log("My Rides:");
                console.log(data);
                if($scope.myRides.length === 0){
                    alert("You have not created any rides");
                    $location.path('/newRide');
                }
            });        

        $scope.rideDetails = function(ride) {
            $rootScope.ride = ride;
            $location.path('/ride');
        }

    }
]);
