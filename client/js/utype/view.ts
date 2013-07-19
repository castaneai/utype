/// <reference path="../../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="progress_view.ts" />

module utype {

    /**
     * HTMLの要素を直接変更するビュークラス
     */
    export class View {

        /**
         * ドキュメントにフォーカスを合わせる
         * Flashにフォーカスを取られてしまうのを回避するために使う
         */
        public focusDocument(): void {
            document.body.tabIndex = 0;
            document.body.focus();
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