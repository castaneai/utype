/**
 * 歌詞情報
 */
interface LyricInterval {
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
interface TypingInfo {
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
}
