rideshareControllers.controller('rideChatCtrl', ['$scope','$http', '$rootScope',
    function($scope, $http, $rootScope) {
        var socket = io();
        var chatRoom = $rootScope.ride._id;
        var userName = $rootScope.user.givenName+$rootScope.user.familyName.charAt(0);
        $scope.messages = [];
        $scope.users = [];

        $scope.userName = userName;
        $scope.chatRoom = chatRoom;

        socket.emit("join chat", {user: userName, room: chatRoom});

        $scope.send = function(){
            socket.emit("chat message", {text: $scope.message, user: $scope.userName, room: chatRoom});
            $scope.message = "";
        };

        socket.on("chat message", function(msg){
            console.log("Message received");
            console.log(msg);
            $scope.messages.push(msg.user+": "+msg.text);
        });

        socket.on("join chat", function(chat){
            $scope.users.push(chat.user);
            $scope.messages.push(chat.user+"has joined chat");
        });
    }
]);