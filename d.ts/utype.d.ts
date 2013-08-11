module utype {
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
	 * クライアントの情報
	 */
	export interface ClientInfo {
		userName: string;
		iconId: number;
	}

	/**
	 * クライアント情報を保持する辞書
	 */
	export interface ClientInfoDict {
		[clientId: string]: ClientInfo;
	}

	/**
	 * 歌詞1インターバルごとの成績
	 */
	export interface IntervalScore {
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
	export interface TotalScore {
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
	export interface ClientScore {
		totalScore: TotalScore;
		intervalScore: IntervalScore;
	}
}