rideshareControllers.controller('searchResultsCtrl', ['$scope','$http', '$location',
    function($scope, $http, $location) {
        var socket = io();

        var query = JSON.parse(sessionStorage.query);
        $scope.searchResults = JSON.parse(sessionStorage.searchResults);

        $scope.joinChat = function(){
            console.log("Joining chat");
            $location.path('/chat');
        };

        socket.on("new ride", function(ride){
            $http.post('/api/ride/find/', query)
                        .success(function(data, status, headers, config) {
                            $scope.searchResults = data;
                            sessionStorage.searchResults = JSON.stringify(data);
                        });
        });
    }
]);
