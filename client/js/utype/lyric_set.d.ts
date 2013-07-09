/// <reference path="interface.d.ts" />
declare module utype {
    class LyricSet {
        private _lyrics;
        private _index;
        constructor(lyrics: utype.Lyric[]);
        public getCurrentLyric(): utype.Lyric;
        public getTotalDuration(): number;
        public moveNext(): void;
        public hasNext(): boolean;
    }
}
