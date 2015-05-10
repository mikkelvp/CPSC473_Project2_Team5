rideshareControllers.controller('searchResultsCtrl', ['$scope','$http',
    function($scope, $http) {
        var socket = io();

        var query = JSON.parse(sessionStorage.query);
        $scope.searchResults = JSON.parse(sessionStorage.searchResults);

        socket.on("new ride", function(ride){
            $http.post('/api/ride/find/', query)
                        .success(function(data, status, headers, config) {
                            $scope.searchResults = data;
                            sessionStorage.searchResults = JSON.stringify(data);
                        });
        });
    }
]);
