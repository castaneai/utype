/// <reference path="../../../d.ts/utype.d.ts" />
/// <reference path="event.ts" />

module utype {

    enum TimerState {
        READY,
        RUN,
        PAUSE
    }

    /**
     * 指定時間経過後、イベントを発生させるクラス
     * 一時停止・再開が可能
     *
     * 一度経過が終わったあとでも、もう一回startメソッドを呼び出すことで
     * 同じオブジェクトで何回でも経過イベントを取れる
     */
    export class Timer {

        /**
         * 一時停止したとき
         */
        public onPause = new Event<(leftDuration: number) => void>();

        /**
         * 再開したとき
         */
        public onResume = new Event<(leftDuration: number) => void>();

        /**
         * 指定時間が経過したとき
         */
        public onElapsed = new Event<() => void>();

        /**
         * タイマーの状態
         */
        private _state: TimerState = TimerState.READY;

        /**
         * Javascriptが内部で扱うタイマーID
         */
        private _timerId: number = -1;

        /**
         * タイマーの長さ（ミリ秒）
         */
        private _duration: number;

        /**
         * タイマーの経過時間（ミリ秒）
         * 一時停止を処理するのに使う
         */
        private _elapsedDuration: number = 0;

        /**
         * タイマーを開始・再開した時刻
         */
        private _lastStartedDate: Date;

        /**
         * タイマーを開始する
         * @param duration タイマーの長さ
         */
        public start(duration: number): void {
            if (this._state !== TimerState.READY) {
                throw new Error('タイマーを開始できるのは状態がREADYのときのみです');
            }
            this._state = TimerState.RUN;
            this._duration = duration;
            this._startTimer(duration);
        }

        /**
         * タイマーを一時停止する
         */
        public pause(): void {
            if (this._state !== TimerState.RUN) {
                throw new Error('タイマーを一時停止できるのは状態がRUNのときのみです');
            }
            this._state = TimerState.PAUSE;
            // 開始/再開時から今までの経過時間分を足す
            this._elapsedDuration += new Date().getTime() - this._lastStartedDate.getTime();
            // 内部タイマーを停止する
            window.clearInterval(this._timerId);

            this.onPause.dispatch();
        }

        /**
         * 一時停止したタイマーを再開する
         */
        public resume(): void {
            if (this._state !== TimerState.PAUSE) {
                throw new Error('タイマーを再開できるのは状態がPAUSEのときのみです');
            }
            this._state = TimerState.RUN;
            // 残った時間分のタイマーを作って開始する
            var leftDuration = this._duration - this._elapsedDuration;
            this._startTimer(leftDuration);

            this.onResume.dispatch();
        }

        /**
         * 一時停止・再開を切り替える
         */
        public togglePause(): void {
            (this._state === TimerState.RUN) ? this.pause() : this.resume();
        }

        /**
         * Javascript内部のタイマーを開始する
         * @param duration タイマーの設定時間（ミリ秒）
         * @private
         */
        private _startTimer(duration: number): void {
            this._timerId = window.setTimeout(() => {
                this._state = TimerState.READY;
                this.onElapsed.dispatch();
            }, duration);
            this._lastStartedDate = new Date();
        }

        public isReady(): boolean {
            return this._state === TimerState.READY;
        }

        public isPausing(): boolean {
            return this._state === TimerState.PAUSE;
        }

        public isRunning(): boolean {
            return this._state === TimerState.RUN;
        }
    }
}
