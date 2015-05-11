rideshareControllers.controller('rideDetailsCtrl', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {
        var socket = io();
        //var userName = $rootScope.user.givenName+$rootScope.user.familyName.charAt(0);

        if ($scope.isLoggedIn() === false) {
            $location.path('/');
        }

        $('li').removeClass('active');
        //$('li:nth-child(2)').addClass('active');

        $scope.joinChat = function(){            
            $location.path('chat');
        };
    }
]);
