/// <reference path="interface.d.ts" />

/**
 * 生成時に歌詞情報（長さ、歌詞、ひらがな歌詞）のリストを登録すると
 * 歌詞の長さごとに歌詞を切り替え関数で通知してくれるクラス
 */
class LyricSwitcher {

    /**
     * 1インターバルが開始するたびに呼ばれる関数
     */
    public onStartLyric: (interval: LyricInterval) => void;

    /**
     * すべての問題を打ち終わったら呼ばれる関数
     */
    public onFinish: () => void;

    /**
     * 歌詞と歌詞が出る時間間隔情報のリスト
     */
    private _intervals: LyricInterval[];

    /**
     * 現在のインターバル番号（0スタート）
     */
    private _intervalIndex: number = 0;

    /**
     * コンストラクタ
     * @param intervals 歌詞と歌詞が出る時間間隔情報のリスト
     */
    constructor(intervals: LyricInterval[]) {
        this._intervals = intervals;
    }

    /**
     * インターバル切り替えを開始する
     * 開始すると、1インターバル切り替わるごとに特定の関数が呼ばれるようになる
     */
    public start(): void {
        var subjectInterval = this._intervals[this._intervalIndex];
        // インターバル開始関数を呼び出す
        if (this.onStartLyric != null) {
            this.onStartLyric(subjectInterval);
        }

        window.setTimeout(() => {

            // 次があるなら次のインターバルへ引き継ぐ
            if (this._intervalIndex + 1 < this._intervals.length) {
                this._intervalIndex++;
                this.start();
            }
            else {
                // すべてのインターバルが終わったので終了関数を呼び出す
                if (this.onFinish != null) {
                    this.onFinish();
                }
            }
        }, subjectInterval.duration);
    }
}
