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
                var updatedRiders = ride.riders;
                for(var i = updatedRiders.length - 1; i >= 0; i--) {
                    if(updatedRiders[i] === userid) {
                       updatedRiders.splice(i, 1);
                    }
                }
                $http.put('/api/ride/'+ride._id, {
                    riders: updatedRiders
                }).success(function(data, status, headers, config) {
                    alert("You will be removed from this ride"); 
                });
                               
            }
            $location.path("myRides");
        };
    }
]);
