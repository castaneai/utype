/// <reference path="../../../d.ts/typing.d.ts" />

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
         * 打ち終わった文字数
         */
        private _totalTypedCount: number = 0;

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
         * 成功したらtrue
         * 失敗したらfalseを返す
         * @param char タイプする文字
         */
        public type(char: string): boolean {
            // TODO: 問題文が登録されていないときのエラー処理
            var oldAnswered = this._typing.getAnswered();
            var result = this._typing.answer(char);
            var newAnswered = this._typing.getAnswered();
            if (newAnswered - oldAnswered > 0) {
                this._totalTypedCount += newAnswered - oldAnswered;
            }
            return result;
        }

		/**
		 * ひらがなの問題文のうち既に打ち終わった数を返す
		 */
		public getKanaSolvedCount(): number {
			return this._typing.getAbsoluteAnswered();
		}

        /**
         * ひらがなの問題文の打ち終わった部分を返す
         */
        public getSolvedKana(): string {
            var kana = this._typing.getOriginalQuestion();
            return kana.substr(0, this.getKanaSolvedCount());
        }

        /**
         * ひらがなの問題文のまだ打ち終わってない部分を返す
         */
        public getUnsolvedKana(): string {
            var kana = this._typing.getOriginalQuestion();
            return kana.substr(this.getKanaSolvedCount());
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

        /**
         * 現在の問題を完全に打ち終わったかどうかを返す
         */
        public isFinish(): boolean {
            return this._typing.isFinish();
        }

        /**
         * 打ち終わった文字数を返す
         */
        public getTotalTypedCount(): number {
            return this._totalTypedCount;
        }
    }
}
