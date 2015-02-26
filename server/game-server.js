module.exports = function(io) {
    io.on('connection', function(socket) {

        socket.on('entry', function(params) {
            if (!params || !params.username || params.username == '') {
                console.error('空のユーザー名は許可されていない');
                return;
            }
            socket.emit('welcome');
        });

        socket.on('start', function(params) {
            io.sockets.emit('start');
        });

    });
};