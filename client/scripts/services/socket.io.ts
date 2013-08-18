/// <reference path="../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />

declare var io: {connect: (url) => void};

angular.module('socket.io', []).factory('socket', function() {
	var socket = io.connect(location.protocol + '//' + location.host);
	return socket;
});
