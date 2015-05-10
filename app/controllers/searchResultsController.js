rideshareControllers.controller('searchResultsCtrl', ['$scope','$http', // 'rides',
    function($scope, $http) {
        var socket = io();

        $scope.searchResults = JSON.parse(sessionStorage.searchResults);

        console.log($scope.searchResults[0]);

        socket.on("new ride", function(ride){
            console.log("Adding ride to rootScope");
            $scope.searchResults.push(ride);
        });

    }
]);
