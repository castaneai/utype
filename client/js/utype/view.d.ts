/// <reference path="../../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="progress_view.d.ts" />
declare module utype {
    class View {
        private _lyricProgress;
        private _totalProgress;
        constructor();
        public clearAllLyric(): void;
        public setOriginalLyric(val: string): void;
        public setKanaLyric(val: string): void;
        public setSolvedKanaLyric(solved: string, unsolved: string): void;
        public setRomaLyric(val: string): void;
        public setSolvedRomaLyric(solved: string, unsolved: string): void;
        public startLyricProgress(percentage: number, duration: number): void;
        public startTotalProgress(percentage: number, duration: number): void;
        public clearLyricProgress(): void;
        public pauseAllProgressBar(): void;
        public resumeAllProgressBar(): void;
        public setScore(val: number): void;
        public setMiss(val: number): void;
        public setRank(val: string): void;
    }
}
