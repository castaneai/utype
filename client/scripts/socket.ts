/// <reference path="../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />

angular.module('socket.io', []).factory('socket', function() {
	var socket = io.connect(window.location.protocol + '//' + window.location.host);
	return socket;
});
