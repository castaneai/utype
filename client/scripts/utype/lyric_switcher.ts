/// <reference path="../../../d.ts/utype.d.ts" />
/// <reference path="timer.ts" />
/// <reference path="event.ts" />

module utype {

	/**
	 * 歌詞のリスト
	 * 複数の歌詞の中で現在どの歌詞を表示しているかの情報を持つ
	 */
	class LyricSet {

		/**
		 * 内部に持つ歌詞の配列
		 */
		private _lyrics: Lyric[];

		/**
		 * 現在の歌詞のインデックス
		 */
		private _index: number = 0;

		/**
		 * 歌詞の配列を元に歌詞リストを作る
		 * @param lyrics
		 */
		constructor(lyrics: Lyric[]) {
			this._lyrics = lyrics;
		}

		/**
		 * 現在の歌詞を取得する
		 */
		public getCurrentLyric(): Lyric {
			return this._lyrics[this._index];
		}

		/**
		 * 歌詞全体の長さをミリ秒で取得する
		 */
		public getTotalDuration(): number {
			var result = 0;
			for (var i = 0; i < this._lyrics.length; i++) {
				result += this._lyrics[i].duration;
			}
			return result;
		}

		/**
		 * 次の歌詞に切り替える
		 */
		public moveNext(): void {
			this._index++;
		}

		/**
		 * 次の歌詞が存在するかどうかを返す
		 */
		public hasNext(): boolean {
			return this._index + 1 < this._lyrics.length;
		}
	}

	/**
	 * 歌詞の時間ごとに歌詞を切り替えてイベントで伝えるクラス
	 */
	export class LyricSwitcher {

		/**
		 * 歌詞が切り替わったときに発生するイベント
		 */
		public onSwitch = new Event<(lyric: Lyric) => void>();

		/**
		 * すべての歌詞の切り替えが終わったときに発生するイベント
		 */
		public onFinish = new Event<() => void>();

		/**
		 * 歌詞の切り替えに使うタイマー
		 */
		private _timer: Timer;

		/**
		 * 歌詞リスト
		 */
		private _lyrics: LyricSet;

		/**
		 * 歌詞の切り替えを開始した時間（ミリ秒）
		 */
		private _startedTime: number = 0;
		
		constructor(lyrics: Lyric[]) {
			this._lyrics = new LyricSet(lyrics);
			this._timer = new Timer();
		}

		/**
		 * 歌詞の切り替えを開始する
		 */
		public start(): void {
			this._timer.onElapsed.addListener(() => {
				if (this._lyrics.hasNext() === false) {
					this.onFinish.dispatch();
					return;
				}
				this._lyrics.moveNext();
				this._timer.start(this._lyrics.getCurrentLyric().duration);
				this.onSwitch.dispatch(this._lyrics.getCurrentLyric());
			});
			this._startedTime = new Date().getTime();
			this._timer.start(this._lyrics.getCurrentLyric().duration);
			this.onSwitch.dispatch(this._lyrics.getCurrentLyric());
		}

		/**
		 * すべての歌詞の合計の長さ（ミリ秒）を取得する
		 */
		public getTotalDuration(): number {
			return this._lyrics.getTotalDuration();
		}

		/**
		 * 歌詞の切り替えを開始してからの経過時間（ミリ秒）を取得する
		 */
		public getElapsedDuration(): number {
			return (new Date()).getTime() - this._startedTime;
		}
	}
}
