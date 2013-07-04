/// <reference path="interface.d.ts" />
/// <reference path="lyric_switcher.ts" />
/// <reference path="typing.d.ts" />

enum GameState {
    READY,
    PLAYING,
    PAUSING,
    RESULT,
}

class UType {

    /**
     * 新しい歌詞に切り替わったときに呼び出される関数
     */
    public onStartLyric: (lyric: LyricInterval) => void;

    /**
     * すべての歌詞が終了したときに呼び出される関数
     * 歌詞をタイピングし終えても歌詞の時間が終わるまでは呼び出されないので注意
     */
    public onFinish: () => void;

    /**
     * ローマ字1文字タイプ成功したときに呼び出される関数
     */
    public onSuccessTyping: (info: TypingInfo) => void;

    /**
     * ローマ字1文字タイプミスしたときに呼び出される関数
     */
    public onMissTyping: (info: TypingInfo) => void;

    /**
     * ゲームの状態
     */
    private _state: GameState = GameState.READY;

    /**
     * 歌詞を時間に合わせて切り替えてくれるモジュール
     */
    private _lyricSwitcher: LyricSwitcher;

    /**
     * タイピングゲームのロジック
     */
    private _typing: Typing;

    /**
     * コンストラクタ
     * @param lyrics 歌詞情報のリスト
     */
    constructor(lyrics: LyricInterval[]) {
        this._lyricSwitcher = new LyricSwitcher(lyrics);
        this._typing = new Typing();
    }

    /**
     * ゲームを開始する
     */
    public start(): void {
        if (this._state != GameState.READY) {
            throw new Error('ゲームスタートできるのはゲーム状態がスタート待ち(ready)のときだけです');
        }
        this._state = GameState.PLAYING;

        // 歌詞の切り替えを設定
        this._lyricSwitcher.onStartLyric = (lyric) => {
            this._typing.register(lyric.kanaLyric);
            if (this.onStartLyric != null) {
                this.onStartLyric(lyric);
            }
        };
        this._lyricSwitcher.onFinish = () => {
            if (this.onFinish != null) {
                this.onFinish();
            }
        }
        this._lyricSwitcher.start();
    }

    /**
     * キー入力を送信する
     * @param keyCode
     */
    public pressKey(keyCode: number): void {
        switch (this._state) {
            case GameState.READY:
                // 開始待ち状態のときはスペースキーでプレイ開始
                if (keyCode != 0x20) return;
                this.start();
                break;

            case GameState.PLAYING:
                // TODO: Shiftキーで一時停止機能
                this.answer(keyCode);
                break;

            case GameState.PAUSING:
                // TODO: 一時停止中の操作
                break;

            case GameState.RESULT:
                // TODO: 結果画面から曲選択に戻る
                break;

            default:
                throw new Error('キー入力を受け取りましたがゲーム状態が不明です。キーを押すことができるのはゲーム状態が(ready, playing, pausing, result)のうちどれかの時だけです.');
                break;
        }
    }

    /**
     * 現在の問題文に対してキーボード入力を送信して解答する
     * @param keyCode 入力キーコード
     */
    private answer(keyCode: number): void {
        var keyChar = String.fromCharCode(keyCode);
        if (this._typing.answer(keyChar)) {
            if (this.onSuccessTyping != null) {
                this.onSuccessTyping(this.getTypingInfo());
            }
            if (this._typing.isFinish()) {
                // TODO: 問題文をすべて打ち終わったら何かボーナスがある？
            }
        }
        else {
            if (this.onMissTyping != null) {
                this.onMissTyping(this.getTypingInfo());
            }
        }
    }

    /**
     * 現在のゲーム進行情報を取得する
     */
    private getTypingInfo(): TypingInfo {
        var kana = this._typing.getOriginalQuestion();
        var solvedCursor = this._typing.getAbsoluteAnswered();
        return {
            solvedKana: kana.substr(0, solvedCursor),
            unsolvedKana: kana.substr(solvedCursor),
            solvedRoma: "",
            unsolvedRoma: ""
        };
    }

}
