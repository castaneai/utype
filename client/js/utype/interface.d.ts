declare module utype {
    /**
     * 歌詞情報
     */
    export interface Lyric {
        /**
         * 歌詞の表示時間（ミリ秒）
         */
        duration: number;

        /**
         * 歌詞
         */
        originalLyric: string;

        /**
         * 歌詞のひらがな文
         */
        kanaLyric: string;
    }

    /**
     * タイピングゲームでプレイ中に更新される情報
     */
    export interface TypingInfo {
        /**
         * 打ち終わったひらがな文
         */
        solvedKana: string;

        /**
         * 打ち終わってないひらがな文
         */
        unsolvedKana: string;

        /**
         * 打ち終わったローマ字文
         */
        solvedRoma: string;

        /**
         * 打ち終わってないローマ字文
         */
        unsolvedRoma: string;

        /**
         * ミスタイプ数
         */
        missCount: number;

        /**
         * スコア
         */
        score: number;
    }

    /**
     * 内部状態を持つ実装を示す
     */
    export interface Stateful {
        getState(): number;
    }

    /**
     * 一時停止・再開機能の実装を示す
     */
    export interface Pausable {
        pause(): void;
        resume(): void;
        togglePause(): void;
    }
}
