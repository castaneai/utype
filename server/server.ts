/// <reference path="../d.ts/DefinitelyTyped/node/node.d.ts" />

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    socket.emit('news', {hello: 'world!'});
});

exports = module.exports = server;
exports.use = function() {
    app.use.apply(app, arguments);
};