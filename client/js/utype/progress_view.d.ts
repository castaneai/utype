/// <reference path="../../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="interface.d.ts" />
/// <reference path="timer.d.ts" />
declare module utype {
    class ProgressView implements utype.Pausable {
        private _barElement;
        private _percentage;
        private _timer;
        constructor(progressElement: JQuery);
        public start(percentage: number, duration: number): void;
        public pause(): void;
        public resume(): void;
        public togglePause(): void;
        private _animateBar(percentage, duration);
    }
}
