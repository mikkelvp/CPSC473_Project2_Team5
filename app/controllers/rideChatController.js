rideshareControllers.controller('rideChatCtrl', ['$scope','$http', '$rootScope',
    function($scope, $http, $rootScope
) {
        var socket = io();
        var chatRoom = $scope.ride._id;
        var userName = $scope.user.givenName+$scope.user.familyName.charAt(0);
        var status;
        $scope.messages = [];
        $scope.users = [];

        $scope.userName = userName;
        $scope.chatRoom = chatRoom;


        if($rootScope.ride.owner === $rootScope.user._id){
            $scope.users.push("Me (Driver)");
            status = " (Driver)";
        } else {
            $scope.users.push("Me (Rider)");
            status = " (Rider)";
        }
        
        socket.emit("join chat", {user: userName, room: chatRoom, status: status});

        $scope.send = function(){
            socket.emit("chat message", {text: $scope.message, user: $scope.userName, room: chatRoom});
            $scope.messages.push("Me: " + $scope.message);
            $scope.message = "";
        };

        socket.on("chat message", function(msg){
            console.log("Message received");
            console.log(msg);
            $scope.messages.push(msg.user+": "+msg.text);
            $scope.$apply(); //required to make the list update
        });

        socket.on("join chat", function(chat){
            $scope.users.push(chat.user+chat.status);
            $scope.messages.push(chat.user+"has joined chat");
            $scope.$apply(); //required to make the list update
            socket.emit("I'm here", {user: userName, room: chatRoom, status: status});
        });

        socket.on("I'm here", function(here){
            $scope.users.push(here.user+here.status);
            $scope.$apply();
        });

        socket.on("leave chat", function(){
            //indicate that someone has left
            $scope.messages.push("A user has left");
            $scope.$apply();
            $scope.users = [];
            $scope.users.push("Me"+status);
            $scope.$apply();

            //Say that you are still here
            socket.emit("I'm here", {user: userName, room: chatRoom, status: status});
        });  
    }
]);