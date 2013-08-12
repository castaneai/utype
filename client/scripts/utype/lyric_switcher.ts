/// <reference path="../../../d.ts/utype.d.ts" />
/// <reference path="timer.ts" />
/// <reference path="lyric_set.ts" />
/// <reference path="event.ts" />

module utype {
	export class LyricSwitcher {

		public onSwitch = new Event<(lyric: Lyric) => void>();

		public onFinish = new Event<() => void>();

		private _timer: Timer;

		private _lyrics: LyricSet;
		
		constructor(lyrics: Lyric[]) {
			this._lyrics = new LyricSet(lyrics);
			this._timer = new Timer();
		}

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
			this._timer.start(this._lyrics.getCurrentLyric().duration);
			this.onSwitch.dispatch(this._lyrics.getCurrentLyric());
		}

        public getLyricSet(): LyricSet {
            return this._lyrics;
        }
	}
}
