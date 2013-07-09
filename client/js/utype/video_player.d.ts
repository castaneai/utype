/// <reference path="../../../d.ts/DefinitelyTyped/youtube/Youtube.d.ts" />
declare module utype {
    class VideoPlayer {
        public onPlay: () => void;
        public onPause: () => void;
        private _player;
        constructor(playerElementId: string, videoId: string);
        public play(): void;
        public stop(): void;
        public pause(): void;
        private _onPlayerStateChanged(state);
    }
}
