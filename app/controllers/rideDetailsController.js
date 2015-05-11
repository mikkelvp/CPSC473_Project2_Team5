rideshareControllers.controller('rideDetailsCtrl', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {
        if ($scope.isLoggedIn() === false) {
            $location.path('/');
        }

        $('li').removeClass('active');
        //$('li:nth-child(2)').addClass('active');


    }
]);
