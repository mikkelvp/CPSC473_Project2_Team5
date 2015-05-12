rideshareControllers.controller('rideDetailsCtrl', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {
        var socket = io();
        var userid = $rootScope.user._id;
        var ride = $rootScope.ride;

        if ($scope.isLoggedIn() === false) {
            $location.path('/');
        }

        $('li').removeClass('active');
        //$('li:nth-child(2)').addClass('active');

        console.log("Ride");
        console.log(ride);

        $scope.joinChat = function(){            
            $location.path('chat');
        };

        $scope.leaveRide = function(){
            if(userid === ride.owner){
                alert("This ride will be deleted");
            } else {
                alert("You will be removed from this ride");
            }
            $location.path("myRides");
        }
    }
]);
