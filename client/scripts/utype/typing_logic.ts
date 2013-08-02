/// <reference path="../../../d.ts/typing.d.ts" />
/// <reference path="event.ts" />

module utype {

    /**
     * タイピングゲームのロジック
     * 成功タイプとミスタイプしたときイベントを発生させる
     */
    export class TypingLogic {

        /**
         * タイプに成功した時
         */
        public onSuccess = new Event<() => void>();

        /**
         * タイプに失敗した時
         */
        public onMiss = new Event<() => void>();

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
        public type(char: string): void {
            // TODO: 問題文が登録されていないときのエラー処理
            if (this._typing.answer(char)) {
                this.onSuccess.dispatch();
            }
            else {
                this.onMiss.dispatch();
            }
        }
    }
}
