utype.controller('LoginController', ['$scope', 'socket', function($scope, socket) {
    socket.on('hello', function() {
        $scope.message = 'hello succeed.';
    });
}]);