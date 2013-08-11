/// <reference path="../../../d.ts/DefinitelyTyped/socket.io/socket.io.d.ts" />
/// <reference path="../../../d.ts/utype.d.ts" />

module utype {

	enum GameStatus {
		LOADING,
		WATCH,
		ENTRY,
		PLAY
	}

	export class Game {

		/**
		 * ゲームの状態
		 */
		private _gameStatus: GameStatus = GameStatus.LOADING;

		/**
		 * ゲームにエントリーしているクライアントの一覧
		 */
		private _entryClients: ClientInfoDict = {};

		/**
		 * ネットワーク連携に使用するソケット(socket.ioのSocketオブジェクト)
		 */
		private _socket: Socket = null;


		/**
		 * 新しいutypeゲームを作成する
		 * @param lyrics 歌詞リスト
		 * @param socket socket.ioのソケット
		 */
		constructor(lyrics: Lyric[], socket: Socket) {
		}

		public startGame(): void {
			socket.emit('start');
		}

		public typeKey(keyCode: number): void {

		}

		private _setSocketEventListeners(): void {
			this._socket.on('entry.update', (data) => {

			});
		}

		private _startGame(): void {

		}
	}
}