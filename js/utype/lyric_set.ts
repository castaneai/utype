/// <reference path="interface.d.ts" />

module utype {

    export class LyricSet {

        private _lyrics: Lyric[];

        private _index: number = 0;

        constructor(lyrics: Lyric[]) {
            this._lyrics = lyrics;
        }

        public getCurrentLyric(): Lyric {
            return this._lyrics[this._index];
        }

        public getTotalDuration(): number {
            var result = 0;
            for (var i = 0; i < this._lyrics.length; i++) {
                result += this._lyrics[i].duration;
            }
            return result;
        }

        public moveNext(): void {
            this._index++;
        }

        public hasNext(): boolean {
            return this._index + 1 < this._lyrics.length;
        }
    }
}
