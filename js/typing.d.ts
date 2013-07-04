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
     * 打ち終わった位置を返す
     */
    getAbsoluteAnswered(): number;
}
