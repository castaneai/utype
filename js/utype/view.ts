/// <reference path="../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../../d.ts/jquery.pause.d.ts" />
/// <reference path="progress_view.ts" />

module utype {

    /**
     * HTMLの要素を直接変更するビュークラス
     */
    export class View {

        private _lyricProgress: ProgressView;

        private _totalProgress: ProgressView;

        constructor() {
            this._lyricProgress = new ProgressView($('#interval-bar'));
            this._totalProgress = new ProgressView($('#total-bar'));
        }

        /**
         * すべての歌詞を消去する
         */
        public clearAllLyric(): void {
            $('.lyric span').text('');
        }

        /**
         * 元の歌詞を表示する
         * @param val
         */
        public setOriginalLyric(val: string): void {
            $('#lyric-original span').text(val);
        }

        /**
         * ひらがな歌詞を表示する
         * @param val
         */
        public setKanaLyric(val: string): void {
            this.setSolvedKanaLyric('', val);
        }

        /**
         * ひらがな歌詞を打ち終わった部分と打ち終わってない部分に分けて表示する
         * @param solved
         * @param unsolved
         */
        public setSolvedKanaLyric(solved: string, unsolved: string): void {
            $('#lyric-kana .solved').text(solved);
            $('#lyric-kana .unsolved').text(unsolved);
        }

        /**
         * ローマ字歌詞を表示する
         * @param val
         */
        public setRomaLyric(val: string): void {
            this.setSolvedRomaLyric('', val);
        }

        /**
         * ローマ字歌詞を打ち終わった部分と打ち終わってない部分に分けて表示する
         * @param solved
         * @param unsolved
         */
        public setSolvedRomaLyric(solved: string, unsolved: string): void {
            $('#lyric-roma .solved').text(solved.toUpperCase());
            $('#lyric-roma .unsolved').text(unsolved.toUpperCase());
        }

        /**
         * 1つの歌詞インターバルの進行状況を表示するプログレスバーを動かす
         * @param percentage プログレスバーの幅％(1～100)
         * @param duration バーの移動にかける時間（ミリ秒）
         */
        public startLyricProgress(percentage: number, duration: number): void {
            this._lyricProgress.start(percentage, duration);
        }

        /**
         * ゲーム全体の進行状況を表示するプログレスバーを動かす
         * @param percentage プログレスバーの幅％(1～100)
         * @param duration バーの移動にかける時間（ミリ秒）
         */
        public startTotalProgress(percentage: number, duration: number): void {
            this._totalProgress.start(percentage, duration);
        }

        /**
         * 1つの歌詞インターバルの進行状況を表すプログレスバーを瞬時に0％にする
         */
        public clearLyricProgress(): void {
            this._lyricProgress.start(0, 0);
        }

        /**
         * すべてのプログレスバーを止める
         */
        public pauseAllProgressBar(): void {
            this._lyricProgress.pause();
            this._totalProgress.pause();
        }

        /**
         * すべてのプログレスバーを再開する
         */
        public resumeAllProgressBar(): void {
            this._lyricProgress.resume();
            this._totalProgress.resume();
        }

        public setScore(val: number): void {
            $('#score').text(val);
        }

        public setMiss(val: number): void {
            $('#miss').text(val);
        }

        public setRank(val: string): void {
            $('#rank').text(val);
        }
    }
}