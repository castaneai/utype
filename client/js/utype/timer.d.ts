/// <reference path="interface.d.ts" />
declare module utype {
    enum TimerState {
        READY,
        RUN,
        PAUSE,
    }
    class Timer implements utype.Pausable, utype.Stateful {
        public onStart: (duration: number) => void;
        public onPause: (leftDuration: number) => void;
        public onResume: (leftDuration: number) => void;
        public onFinish: () => void;
        private _state;
        private _timerId;
        private _duration;
        private _elapsedDuration;
        private _lastRunDate;
        public start(duration: number): void;
        public getState(): TimerState;
        public pause(): void;
        public resume(): void;
        public togglePause(): void;
        private _setTimer(duration);
    }
}
