/// <reference path="../../../d.ts/DefinitelyTyped/socket.io/socket.io.d.ts" />
/// <reference path="../../../d.ts/DefinitelyTyped/underscore/underscore.d.ts" />
/// <reference path="../../../d.ts/utype.d.ts" />
/// <reference path="lyric_switcher.ts" />
/// <reference path="typing_logic.ts" />
/// <reference path="event.ts" />

module utype {

	enum GameStatus {
		WATCH,
		ENTRY,
		PLAY
	}

    enum KeyCode {
        SPACE = 0x20
    }

	export class Game {

        public onStatusChanged = new Event<() => void>();

		/**
		 * ゲームの状態
		 */
		private _gameStatus: GameStatus = GameStatus.WATCH;

        /**
         * 自分自身のクライアント
         */
        private _myClient: Client = null;

		/**
		 * ゲームにエントリーしている自分以外のクライアントの一覧
		 */
		private _otherEntryClients: ClientInfo[] = [];

		/**
		 * ネットワーク連携に使用するソケット(socket.ioのSocketオブジェクト)
		 */
		private _socket: Socket = null;

        /**
         * 内部にタイマーを持ち指定時間ごとに歌詞を切り替えるモジュール
         */
        private _lyricSwitcher: LyricSwitcher = null;

        /**
         * タイピングゲームのロジック
         */
        private _typing: TypingLogic = null;

		/**
		 * 新しいutypeゲームを作成する
		 * @param lyrics 歌詞リスト
		 * @param socket socket.ioのソケット
		 */
		constructor(lyrics: Lyric[], socket: Socket) {
            this._socket = socket;
            this._setSocketEventListeners();
            this._lyricSwitcher = new LyricSwitcher(lyrics);
            this._typing = new TypingLogic();
		}

        /**
         * ゲームにエントリーする（参加申請する）
         * エントリーに成功したらサーバからIDが割り振られ、自身のクライアントが作成される
         */
        public entryGame(entryRequestData: EntryRequestData): void {
            this._socket.emit('entry.request', entryRequestData);
        }

        /**
         * サーバに自分がゲームを開始したことを通知した後に
         * ゲームを開始する
         */
		public startGame(): void {
			this._socket.emit('start.request');
            this._startGame();
		}

        /**
         * キーボード入力を送信する
         * @param keyCode キーコード
         */
		public typeKey(keyCode: number): void {
            if (this._gameStatus === GameStatus.ENTRY && keyCode === KeyCode.SPACE) {
                this.startGame();
            } else if (this._gameStatus === GameStatus.PLAY) {
                var typedChar = String.fromCharCode(keyCode);
                if (this._typing.type(typedChar)) {
                    // success type
                } else {
                    // miss type
                }
            }
		}

        public getTypingStatus(): TypingStatus {
            return {
                solvedKana: this._typing.getSolvedKana(),
                unsolvedKana: this._typing.getUnsolvedKana(),
                solvedRoma: this._typing.getSolvedRoma(),
                unsolvedRoma: this._typing.getUnsolvedRoma()
            };
        }

        public getCurrentLyric(): Lyric {
            return this._lyricSwitcher.getLyricSet().getCurrentLyric();
        }

        public getMyClient(): Client {
            return this._myClient;
        }

        public getOtherEntryClientInfos(): ClientInfo[] {
            return this._otherEntryClients;
        }

        public isWatchStatus(): boolean {
            return this._gameStatus === GameStatus.WATCH;
        }

        /**
         * ゲーム状態を切り替える
         * old -> newを明示することで不正な状態遷移でないかどうかチェックし
         * 不正であればエラーを投げて止まる
         * @param requireStatus 遷移前に必要な状態
         * @param newStatus 新しく遷移する状態
         * @param errorMessage 遷移前に必要な状態を満たしていなかった時のエラーメッセージ
         */
        private _switchStatus(requireStatus: GameStatus, newStatus: GameStatus, errorMessage: string): void {
            this._checkGameStatus(requireStatus, errorMessage);
            this._gameStatus = newStatus;
            this.onStatusChanged.dispatch();
        }

        /**
         * 与えられたクライアント情報から初期値のClientを作成する
         * @param clientInfo
         */
        private _createNewClient(clientInfo: ClientInfo): Client {
            return {
                info: clientInfo,
                score: {
                    intervalScore: {
                        kanaSolvedCount: 0
                    },
                    totalScore: {
                        point: 0,
                        missCount: 0
                    }
                }
            };
        }

        /**
         * ソケットに各種イベントリスナを登録する
         */
		private _setSocketEventListeners(): void {
            // 自分のエントリ申請が承諾されたとき
            this._socket.on('entry.response', (clientInfo: ClientInfo) => {
                this._myClient = this._createNewClient(clientInfo);
                this._switchStatus(GameStatus.WATCH, GameStatus.ENTRY, 'エントリ申請をするにはWATCH（観戦）状態である必要があります');
            });

            // 他のエントリーしたクライアントがゲームを開始させたとき
            this._socket.on('start.response', () => {
                this._startGame();
            });

            // エントリーした人の一覧が更新されたとき
			this._socket.on('entry.update', (data: EntryUpdateData) => {
                // 自分自身以外のクライアント情報を更新する
                this._otherEntryClients = _.filter(data.entryClientInfos, (info: ClientInfo) => info.id !== this._myClient.info.id);
			});
		}

        /**
         * ゲームを開始する
         * 自分以外がゲームを開始したときにはこれが直接呼ばれる
         * (public startGame()の方は自分がゲームを開始したときのみ)
         */
		private _startGame(): void {
            this._switchStatus(GameStatus.ENTRY, GameStatus.PLAY, 'ゲームを開始するにはENTRY状態である必要があります');
		}

        /**
         * ゲームの状態が必要な状態を満たしているかチェックして
         * 満たしていなければエラーを発生させる
         * @param requireStatus 必要な状態
         * @param errorMessage エラーメッセージ
         */
        private _checkGameStatus(requireStatus: GameStatus, errorMessage: string): void {
            if (this._gameStatus !== requireStatus) {
                throw new Error(errorMessage);
            }
        }
	}
}