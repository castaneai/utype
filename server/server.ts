/// <reference path="../d.ts/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../d.ts/DefinitelyTyped/socket.io/socket.io.d.ts" />
/// <reference path="../d.ts/utype.d.ts" />

var app = require('express')();
var server = require('http').createServer(app);
var io: SocketManager = require('socket.io').listen(server);

var entryClientInfosDict: utype.ClientInfoDict = {};

function getEntryClientInfos(): utype.ClientInfo[] {
	var result = [];
	for (var clientId in entryClientInfosDict) {
		result.push(entryClientInfosDict[clientId]);
	}
	return result;
}

io.sockets.on('connection', (socket: Socket) => {

	// 初めて接続してきたクライアントにはエントリー一覧を送る
	socket.emit('entry.update', {
		entryClientInfos: getEntryClientInfos()
	});

	/**
	 * クライアントが切断したとき
	 */
	socket.on('disconnect', () => {
		// エントリー済のクライアントが切断したらエントリー一覧から削除
		if (socket.id in entryClientInfosDict) {
			delete entryClientInfosDict[socket.id];
		}
		// エントリー一覧が変更されたことを前クライアントに通知する
		io.sockets.emit('entry.update', {
            entryClientInfos: getEntryClientInfos()
        });
	});

	/**
	 * クライアントがゲームにエントリーしたとき
	 */
	socket.on('entry.request', (data: utype.EntryRequestData) => {
		entryClientInfosDict[socket.id] = {
            id: socket.id,
			userName: data.userName,
			iconId: data.iconId
		};
		socket.emit('entry.response', entryClientInfosDict[socket.id]);
        io.sockets.emit('entry.update', {
            entryClientInfos: getEntryClientInfos()
        });
	});

	/**
	 * エントリー済のクライアントがゲームを開始した時
	 */
    socket.on('start.request', () => {
        io.sockets.emit('start.response');
    });

	/**
	 * ゲームプレイ中のクライアントがキーボードをタイプした時
	 */
    socket.on('type', (score: utype.ClientScore) => {
        socket.broadcast.emit('type', {
	        clientId: socket.id,
	        clientScore: score
        });
    });
});

exports = module.exports = server;
exports.use = function() {
    app.use.apply(app, arguments);
};
