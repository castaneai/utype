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
     * ゲームの成績
     */
    export interface Score {
        /**
         * 点数
         */
        point: number;

        /**
         * ミス回数
         */
        missCount: number;
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
