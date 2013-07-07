/// <reference path="interface.d.ts" />

module utype {

    export enum TimerState {
        READY,
        RUN,
        PAUSE
    }

    export class Timer implements Pausable, Stateful {

        public onStart: (duration: number) => void;

        public onPause: (leftDuration: number) => void;

        public onResume: (leftDuration: number) => void;

        public onFinish: () => void;

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
        private _lastRunDate: Date;

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
            this._setTimer(duration);
            if (this.onStart != null) {
                this.onStart(duration);
            }
        }

        /**
         * 現在の状態を返す
         */
        public getState(): TimerState {
            return this._state;
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
            this._elapsedDuration += new Date().getTime() - this._lastRunDate.getTime();
            window.clearInterval(this._timerId);
            var leftDuration = this._duration - this._elapsedDuration;
            if (this.onPause != null) {
                this.onPause(leftDuration);
            }
        }

        public resume(): void {
            if (this._state !== TimerState.PAUSE) {
                throw new Error('タイマーを再開できるのは状態がPAUSEのときのみです');
            }
            this._state = TimerState.RUN;
            var leftDuration = this._duration - this._elapsedDuration;
            this._setTimer(leftDuration);
            if (this.onResume != null) {
                this.onResume(leftDuration);
            }
        }

        public togglePause(): void {
            if (this.getState() === TimerState.RUN) {
                this.pause();
            }
            else {
                this.resume();
            }
        }

        private _setTimer(duration: number): void {
            if (this._state !== TimerState.RUN) {
                throw new Error('タイマーを設置できるのは状態がRUNのときのみです');
            }

            this._timerId = window.setTimeout(() => {
                if (this.onFinish != null) {
                    this.onFinish();
                }
            }, duration);
            this._lastRunDate = new Date();
        }
    }
}
