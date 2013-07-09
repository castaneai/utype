/// <reference path="../../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="interface.d.ts" />
/// <reference path="timer.ts" />

module utype {

    export class ProgressView implements Pausable {

        private _barElement: JQuery;

        /**
         * 目標％
         */
        private _percentage: number;

        /**
         * タイマー
         */
        private _timer: Timer;

        constructor(progressElement: JQuery) {
            this._barElement = progressElement.find('.bar');
        }

        public start(percentage: number, duration: number): void {
            this._percentage = percentage;
            this._timer = new Timer();
            this._timer.onStart = () => {
                this._animateBar(percentage, duration);
            }
            this._timer.onPause = (leftDuration) => {
                this._barElement.stop(true);
            }
            this._timer.onResume = (leftDuration) => {
                this._animateBar(this._percentage, leftDuration);
            }
            this._timer.start(duration);
        }

        public pause(): void {
            this._timer.pause();
        }

        public resume(): void {
            this._timer.resume();
        }

        public togglePause(): void {
            this._timer.togglePause();
        }

        private _animateBar(percentage: number, duration: number): void {
            var options = {
                duration: duration,
                easing: 'linear'
            }
            this._barElement.animate({width: percentage.toString() + '%'}, options);
        }
    }
}
