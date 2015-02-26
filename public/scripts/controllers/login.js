utype.controller('LoginController', ['$scope', '$location', 'socket',
    function($scope, $location, socket) {

    $scope.username = '';

    $scope.entry = function() {
        socket.emit('entry', {username: $scope.username});
    };

    socket.on('welcome', function() {
        // TODO: set :musicId
        $location.url('/play');
    });
}]);