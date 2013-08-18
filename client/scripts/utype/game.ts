/// <reference path="../../../d.ts/DefinitelyTyped/socket.io/socket.io.d.ts" />
/// <reference path="../../../d.ts/DefinitelyTyped/underscore/underscore.d.ts" />
/// <reference path="../../../d.ts/utype.d.ts" />
/// <reference path="lyric_switcher.ts" />
/// <reference path="typing_logic.ts" />
/// <reference path="event.ts" />
/// <reference path="progress_view.ts" />

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

		/**
		 * ゲームの状況が少しでも変化したらこのイベントが発生する
		 * 主にViewへ変更を通知するために使う
		 */
		public onChanged = new Event<() => void>();

		/**
		 * ゲームの状態
		 */
		private _gameStatus: GameStatus = GameStatus.WATCH;

		/**
		 * ゲームにエントリーしているクライアントの一覧
		 * 自分自身のクライアントも含む
		 */
		private _entryClients: Client[] = [];

        /**
         * 自分自身のクライアント
         */
        private _myClient: Client = null;


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

		private _totalProgressBar = new ProgressView('#total-bar');

		private _intervalProgressBar = new ProgressView('#interval-bar');

        /**
         * WPMを計測するタイマー
         */
        private _wpmTimer = new Timer();

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
		}

        /**
         * キーボード入力を送信する
         * @param keyCode キーコード
         */
		public typeKey(keyCode: number): void {
            if (this._gameStatus === GameStatus.ENTRY && keyCode === KeyCode.SPACE) {
                this.startGame();
            } else if (this._gameStatus === GameStatus.PLAY) {
                if (this._typing.isFinish()) {
                    return;
                }
                var typedChar = String.fromCharCode(keyCode);
                if (this._typing.type(typedChar)) {
	                this._onSuccessTyping();
                } else {
	                this._onMissTyping();
                }
	            this._socket.emit('type', this._myClient.score);
	            this.onChanged.dispatch();
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

        public getEntryClients(): Client[] {
            return this._entryClients;
        }

		public getClientScore(client: Client): ClientScore {
			if (this._myClient != null && client.info.id === this._myClient.info.id) {
				return this._myClient.score;
			} else if('score' in client) {
				return client.score;
            } else {
                return null;
            }
		}

        public getClientTotalScorePoint(client: Client): number {
            return this.getClientScore(client).totalScore.point;
        }

		public getClientSolvedKana(client: Client): string {
			if (this._myClient != null && client.info.id === this._myClient.info.id) {
				return this._typing.getSolvedKana();
			} else {
				return this.getCurrentLyric().kanaLyric.substr(0, client.score.intervalScore.kanaSolvedCount);
			}
		}

		public getClientUnsolvedKana(client: Client): string {
			if (this._myClient != null && client.info.id === this._myClient.info.id) {
				return this._typing.getUnsolvedKana();
			} else {
				return this.getCurrentLyric().kanaLyric.substr(client.score.intervalScore.kanaSolvedCount);
			}
		}

        public isWatchStatus(): boolean {
            return this._gameStatus === GameStatus.WATCH;
        }

		public isEntryStatus(): boolean {
			return this._gameStatus === GameStatus.ENTRY;
		}

		public isPlayStatus(): boolean {
			return this._gameStatus === GameStatus.PLAY;
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
            this.onChanged.dispatch();
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
                        missCount: 0,
                        wpm: 0
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

            // サーバからゲーム開始命令が来た時
            this._socket.on('start.response', () => {
                this._startGame();
            });

            // エントリーした人の一覧が更新されたとき
			this._socket.on('entry.update', (data: EntryUpdateData) => {
				this._entryClients = <Client[]> _.map(data.entryClientInfos, (info) => {
					return this._createNewClient(info);
				});
				this.onChanged.dispatch();
			});

	        this._socket.on('type', (data) => {
				this._getClient(data.clientId).score = data.clientScore;
		        this.onChanged.dispatch();
	        });
		}

        /**
         * ゲームを開始する
         * 自分以外がゲームを開始したときにはこれが直接呼ばれる
         * (public startGame()の方は自分がゲームを開始したときのみ)
         */
		private _startGame(): void {
            this._switchStatus(GameStatus.ENTRY, GameStatus.PLAY, 'ゲームを開始するにはENTRY状態である必要があります');
	        var videoElement = <HTMLMediaElement> document.getElementsByTagName('video')[0];
	        videoElement.play();
            /*
	        var audioElem = <HTMLAudioElement> document.getElementsByTagName('audio')[0];
	        audioElem.play();
	        */
	        this._lyricSwitcher.onSwitch.addListener((lyric: utype.Lyric) => {
		        this._setLyric(lyric);
	        });
	        this._lyricSwitcher.onFinish.addListener(() => {
		        // TODO: すべての歌詞が終了したとき
	        });
	        this._lyricSwitcher.start();
	        this._totalProgressBar.startAnimation(100, this._lyricSwitcher.getLyricSet().getTotalDuration());
		}

		/**
		 * 新たにスイッチされた歌詞を設定する
		 */
		private _setLyric(lyric: Lyric): void {
            if (lyric.kanaLyric == '') {
                if (this._wpmTimer.isRunning()) {
                    console.log('pause wpm!')
                    this._wpmTimer.pause();
                }
            }
            else {
                // WPM計測が一時停止されていた場合は再開する
                if (this._wpmTimer.isReady()) {
                    console.log('start wpm!');
                    this._startCalculateWpm();
                }
                else if (this._wpmTimer.isPausing()) {
                    console.log('resume wpm!')
                    this._wpmTimer.resume();
                }
            }
            this._typing.registerSubject(lyric.kanaLyric);
			this._intervalProgressBar.setPercentage(0);
			this._intervalProgressBar.startAnimation(100, lyric.duration);
            // TODO: 歌詞がセットされるたびに無理やりforでintervalScoreを初期化するのは汚い
			_.forEach(this._entryClients, (client: Client) => {
				client.score.intervalScore = {
					kanaSolvedCount: 0
				};
			});
			this.onChanged.dispatch();
		}

		private _onSuccessTyping(): void {
            // そのインターバルをすべて打ち終わったらWPM計測を止める
            if (this._typing.isFinish()) {
                this._wpmTimer.pause();
            }
			// TODO: スコア点数計算式
			this._myClient.score.totalScore.point += 100;
			this._myClient.score.intervalScore = {
				kanaSolvedCount: this._typing.getKanaSolvedCount()
			};
		}

		private _onMissTyping(): void {
			// TODO: ミス計算
			this._myClient.score.totalScore.missCount += 1;
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

		private _getClient(clientId: string): Client {
			return <Client> _.find(this._entryClients, (c) => c.info.id === clientId);
		}

        private _startCalculateWpm(): void {
            var calculatePollingMilliseconds = 100;
            var elapsedTypingMilliseconds = 0;
            this._wpmTimer.onElapsed.addListener(() => {
                var elapsedTypingMinutes = elapsedTypingMilliseconds / 1000 / 60;
                var wpm = this._typing.getTotalTypedCount() / elapsedTypingMinutes;
                if (wpm >= 0) {
                    this._myClient.score.totalScore.wpm = Math.round(wpm);
                    this.onChanged.dispatch();
                }
                elapsedTypingMilliseconds += calculatePollingMilliseconds;
                this._wpmTimer.start(calculatePollingMilliseconds);
            });
            this._wpmTimer.start(calculatePollingMilliseconds);
        }
	}
}