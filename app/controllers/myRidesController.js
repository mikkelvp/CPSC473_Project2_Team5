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
            });
    }
]);