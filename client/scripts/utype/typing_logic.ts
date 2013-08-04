/// <reference path="../../../d.ts/typing.d.ts" />
/// <reference path="event.ts" />

module utype {

    /**
     * タイピングゲームのロジック
     * 成功タイプとミスタイプしたときイベントを発生させる
     */
    export class TypingLogic {
        /**
         * タイピングライブラリ本体
         */
        private _typing: Typing;

        /**
         * コンストラクタ
         */
        constructor() {
            this._typing = new Typing();
        }

        /**
         * ひらがなの問題文を登録する
         * @param kanaSubject ひらがなの問題文
         */
        public registerSubject(kanaSubject: string): void {
            this._typing.register(kanaSubject);
        }

        /**
         * 1文字タイプする
         * 成功したら成功イベントが、
         * 失敗したらミスタイプイベントが発生する
         * @param char タイプする文字
         */
        public type(char: string): boolean {
            // TODO: 問題文が登録されていないときのエラー処理
            return this._typing.answer(char);
        }

        /**
         * ひらがなの問題文の打ち終わった部分を返す
         */
        public getSolvedKana(): string {
            var kana = this._typing.getOriginalQuestion();
            var solvedCount = this._typing.getAbsoluteAnswered();
            return kana.substr(0, solvedCount);
        }

        /**
         * ひらがなの問題文のまだ打ち終わってない部分を返す
         */
        public getUnsolvedKana(): string {
            var kana = this._typing.getOriginalQuestion();
            var solvedCount = this._typing.getAbsoluteAnswered();
            return kana.substr(solvedCount);
        }

        /**
         * ローマ字の問題文の打ち終わった部分を返す
         */
        public getSolvedRoma(): string {
            return this._typing.getAnsweredString();
        }

        /**
         * ローマ字の問題文のまだ打ち終わってない部分を返す
         */
        public getUnsolvedRoma(): string {
            return this._typing.getRemainedQuestion();
        }
    }
}
