rideshareControllers.controller('rideChatCtrl', ['$scope','$http',
    function($scope, $http) {
        var socket = io();
        $scope.messages = [];
        $scope.users = [];

        $scope.send = function(){
            $scope.messages.push($scope.message);
            $scope.message = "";
        };
    }
]);