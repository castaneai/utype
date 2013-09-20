/// <reference path="../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../utype/tm_xml_parser.ts" />
/// <reference path="../utype/lyric_switcher.ts" />
/// <reference path="../utype/progress_view.ts" />
/// <reference path="../utype/typing_logic.ts" />

module controllers {

	export interface Music {
		id: string;
		title: string;
	}

	export interface MainScope extends ng.IScope {
		musics: Music[];
		selectedMusic: Music;
		lyric: utype.Lyric;

		onKeyPress: (event) => void;
	}

	enum GameStatus {
		ENTRY,
		PLAY
	}

	export class MainController {

		private _status: GameStatus = GameStatus.ENTRY;

		private _scope: MainScope;

		private _typing: utype.TypingLogic = new utype.TypingLogic();

        private _totalProgressBar;

        private _intervalProgressBar;

		constructor($scope: MainScope) {
			this._scope = $scope;
			$scope.musics = [
				{id:'wonderful_rush', title:'Wonderful Rush'}
			];
			$scope.selectedMusic = $scope.musics[0];

			$scope.onKeyPress = (event) => {
                this._onKeyPress(event.which);
			}
		}

        /**
         * キーが押されたとき
         * @param keyCode
         * @private
         */
        private _onKeyPress(keyCode: number): void {
            if (keyCode == 0x20 && this._status === GameStatus.ENTRY) {
                this._startGame(this._scope.selectedMusic);
            }
            else if (this._status === GameStatus.PLAY) {
                this._typeKey(keyCode);
            }
        }

        /**
         * キータイプをゲームに送信する
         * @param keyCode
         * @private
         */
        private _typeKey(keyCode: number): void {
            var typedChar = String.fromCharCode(keyCode);
            var typingResult = this._typing.type(typedChar);
            if (typingResult) {
                this._onSuccessType();
            }
            else {
                this._onMissType();
            }
        }

        /**
         * ゲームを開始する
         * @param music
         * @private
         */
		private _startGame(music: Music): void {
            this._totalProgressBar = new utype.ProgressView('#total-progress');
            this._intervalProgressBar = new utype.ProgressView('#interval-progress');
			var xmlPath = 'xml/' + music.id + '.xml';
			utype.TmXmlParser.parse(xmlPath, (lyric) => {
                this._onLyricsLoad(lyric)
            });
		}

        /**
         * トータルのプログレスバーを開始する
         * @param progressBarSelector
         * @param duration
         * @private
         */
        private _startTotalProgressBar(duration: number): void {
            this._totalProgressBar.progress(duration);
        }

        /**
         * 歌詞データの読み込みが完了したとき
         * @private
         */
        private _onLyricsLoad(lyrics: utype.Lyric[]): void {
            this._startSwitch(lyrics);
            this._playVideo('#video');
        }

        /**
         * 歌詞の切り替えを開始する
         * @param lyrics
         * @private
         */
        private _startSwitch(lyrics: utype.Lyric[]): void {
            var switcher = new utype.LyricSwitcher(lyrics);
            switcher.onSwitch.addListener((lyric) => {
                this._onSwitch(lyric)
            });
            switcher.start();
           this._startTotalProgressBar(switcher.getTotalDuration());
        }

        /**
         * 歌詞が切り替わる度に呼び出される
         * @param lyric
         * @private
         */
        private _onSwitch(lyric: utype.Lyric): void {
            this._intervalProgressBar.progress(lyric.duration);
            this._scope.lyric = lyric;
            this._scope.$apply();
        }

		private _onSuccessType(): void {
			if (this._typing.isFinish()) {
				// TODO: stop wpm calc
			}
            // TODO: score++
		}

		private _onMissType(): void {
            // TODO: missCount++
		}

		/**
		 * 動画を再生する
		 */
		private _playVideo(videoElementSelector: string): void {
			var elem = <HTMLVideoElement> document.querySelector(videoElementSelector);
			elem.play();
		}
	}
}