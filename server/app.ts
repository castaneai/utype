/// <reference path="../d.ts/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../d.ts/DefinitelyTyped/express/express.d.ts" />
/// <reference path="../d.ts/DefinitelyTyped/socket.io/socket.io.d.ts" />

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.configure(() => {
    app.use(express.static(__dirname + '/../client'));
});

server.listen(process.env.PORT || 3000);

io.sockets.on('connection', (socket) => {
    socket.emit('news', {hello: 'world'});
});
