/// <reference path="interface.d.ts" />
/// <reference path="lyric_set.d.ts" />
/// <reference path="timer.d.ts" />
/// <reference path="../../../d.ts/typing.d.ts" />
declare module utype {
    enum GameState {
        READY,
        PLAY,
        PAUSE,
    }
    class Game implements utype.Pausable, utype.Stateful {
        public onStart: (info: utype.TypingInfo) => void;
        public onFinish: () => void;
        public onSwitchLyric: (lyric: utype.Lyric, info: utype.TypingInfo) => void;
        public onSuccessTyping: (info: utype.TypingInfo) => void;
        public onMissTyping: (info: utype.TypingInfo) => void;
        public onPause: () => void;
        public onResume: () => void;
        private _state;
        private _isWaiting;
        private _typing;
        private _lyrics;
        private _timer;
        private _info;
        constructor(lyrics: utype.LyricSet);
        public getState(): GameState;
        public getLyricSet(): utype.LyricSet;
        public start(): void;
        public answer(keyCode: number): void;
        public pause(): void;
        public resume(): void;
        public togglePause(): void;
        private _getTypingInfo();
        private _startSwitchTimer();
        private _switchNextLyric();
        private _switch();
    }
}
