/**
 * クライアントの情報
 */
interface ClientInfo {
	userName: string;
	iconId: number;
}

/**
 * クライアント情報を保持する辞書
 */
interface ClientInfoDict {
	[clientId: string]: ClientInfo;
}

/**
 * 歌詞1インターバルごとの成績
 */
interface IntervalScore {
	/**
	 * ひらがなの問題文をどこまで打ち終わったか
	 */
	kanaSolvedCount: number;

	/**
	 * 打ち終わったローマ字部分
	 */
	solvedRoma: string;

	/**
	 * まだ打ち終わってないローマ字部分
	 */
	unsolvedRoma: string;
}

/**
 * ゲーム全体ごとの成績
 */
interface TotalScore {
	/**
	 * 得点
	 */
	point: number;

	/**
	 * ミスタッチ数
	 */
	missCount: number;
}

/**
 * クライアントの成績情報
 */
interface ClientScore {
	totalScore: TotalScore;
	intervalScore: IntervalScore;
}