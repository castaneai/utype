var utype = angular.module('utype', ['ngRoute', 'btford.socket-io']);

utype.factory('socket', function(socketFactory) {
    return socketFactory({
        ioSocket: io()
    });
});

utype.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        }).
        when('/play', { // TODO: set :musicId
            templateUrl: 'templates/play.html',
            controller: 'PlayController'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);