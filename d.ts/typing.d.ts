declare class Typing {
    /**
     * 問題文を登録する
     * @param subject ひらがなの問題文
     */
    register(kanaSubject: string): void;

    /**
     * 1文字入力した結果を取得する
     * @param answerChar
     */
    answer(answerChar: string): boolean;

    /**
     * 問題文を打ち終わったかどうかを返す
     */
    isFinish(): boolean;

    /**
     * ひらがなの問題文を返す
     */
    getOriginalQuestion(): string;

    /**
     * ローマ字の問題文を返す
     */
    getQuestion(): string;

    /**
     * ひらがな文の打ち終わった位置を返す
     */
    getAbsoluteAnswered(): number;

    /**
     * 打ち終わったローマ字文を返す
     */
    getAnsweredString(): string;

    /**
     * 打ち終わってないローマ字文を返す
     */
    getRemainedQuestion(): string;

    /**
     * 打ち終わったローマ字の数を返す
     */
    getAnswered(): number;
}
