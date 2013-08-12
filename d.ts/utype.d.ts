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
     * ゲームに接続しているクライアント
     */
    export interface Client {
        info: ClientInfo;
        score: ClientScore;
    }

    export interface ClientInfoDict {
        [clientId: string]: ClientInfo;
    }

	/**
	 * クライアントの情報
	 */
	export interface ClientInfo {
        id: string;
		userName: string;
		iconId: number;
	}

	/**
	 * クライアントの成績情報
	 */
	export interface ClientScore {
		totalScore: TotalScore;
		intervalScore: IntervalScore;
	}

	/**
	 * 歌詞1インターバルごとの成績
	 */
	export interface IntervalScore {
		/**
		 * ひらがなの問題文をどこまで打ち終わったか
		 */
		kanaSolvedCount: number;
	}

	/**
	 * ゲーム全体の成績
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
     * サーバにエントリ申請するときのデータ
     */
    export interface EntryRequestData {
        iconId: number;

        userName: string;
    }

    export interface EntryUpdateData {
        /**
         * 現在エントリー中のクライアント一覧
         */
        entryClientInfos: ClientInfo[];
    }

    export interface TypingStatus {
        solvedKana: string;
        unsolvedKana: string;
        solvedRoma: string;
        unsolvedRoma: string;
    }
}