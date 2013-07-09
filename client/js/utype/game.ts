/// <reference path="interface.d.ts" />
/// <reference path="lyric_set.ts" />
/// <reference path="timer.ts" />
/// <reference path="../../../d.ts/typing.d.ts" />

module utype {

    /**
     * ゲームの状態
     */
    export enum GameState {
        READY, // プレイ開始待ち
        PLAY, // プレイ中
        PAUSE // 一時停止中
    }

    /**
     * 決まった時間ごとに切り替わる歌詞をタイピングするゲーム
     * 歌詞を扱うが、曲の音声、映像には何も関与しないので注意
     */
    export class Game implements Pausable, Stateful {

        /**
         * ゲームを開始したときに呼び出される関数
         */
        public onStart: (info: TypingInfo) => void;

        /**
         * ゲームが終了したときに呼び出される関数
         */
        public onFinish: () => void;

        /**
         * 歌詞が切り替わったときに呼び出される関数
         */
        public onSwitchLyric: (lyric: Lyric, info: TypingInfo) => void;

        /**
         * ローマ字1文字タイプ成功したときに呼び出される関数
         */
        public onSuccessTyping: (info: TypingInfo) => void;

        /**
         * ローマ字1文字タイプミスしたときに呼び出される関数
         */
        public onMissTyping: (info: TypingInfo) => void;

        /**
         * ゲームが一時停止したときに呼び出される関数
         */
        public onPause: () => void;

        /**
         * ゲームが再開したときに呼び出される関数
         */
        public onResume: () => void;

        /**
         * ゲームの状態
         */
        private _state: GameState = GameState.READY;

        /**
         * 問題文が空のため待機している状態かどうか
         */
        private _isWaiting: boolean = false;

        /**
         * タイピングゲームのロジック
         */
        private _typing: Typing;

        /**
         * 歌詞リスト
         */
        private _lyrics: LyricSet;

        /**
         * 歌詞切り替えに使うタイマー
         */
        private _timer: Timer;

        /**
         * ゲームの成績などの情報
         */
        private _info: TypingInfo;

        /**
         * コンストラクタ
         */
        constructor(lyrics: LyricSet) {
            this._typing = new Typing();
            this._lyrics = lyrics;
            this._info = {
                solvedKana: '',
                unsolvedKana: '',
                solvedRoma: '',
                unsolvedRoma: '',
                score: 0,
                missCount: 0
            };
        }

        /**
         * ゲームの状態を返す
         */
        public getState(): GameState {
            return this._state;
        }

        /**
         * 歌詞リストを返す
         */
        public getLyricSet(): LyricSet {
            return this._lyrics;
        }

        /**
         * ゲームを開始する
         */
        public start(): void {
            if (this._state !== GameState.READY) {
                throw new Error('ゲーム開始できるのはゲーム状態がREADYのときのみです');
            }
            this._state = GameState.PLAY;
            // 最初の歌詞に切り替える
            this._switch();
            // 次の歌詞へ切り替えるためのタイマーを起動する
            this._startSwitchTimer();
            if (this.onStart != null) {
                this.onStart(this._getTypingInfo());
            }
        }

        /**
         * 現在の問題文に対してキーボード入力を送信して解答する
         * @param keyCode 入力キーコード
         */
        public answer(keyCode: number): void {
            if (this.getState() !== GameState.PLAY) {
                throw new Error('ゲームにタイピング入力を送信できるのは状態がPLAYのときのみです');
            }

            if (this._isWaiting) {
                return;
            }

            var keyChar = String.fromCharCode(keyCode);
            if (this._typing.answer(keyChar)) {
                // タイプ成功した場合
                // TODO: スコア計算式
                this._info.score += 100;
                if (this.onSuccessTyping != null) {
                    this.onSuccessTyping(this._getTypingInfo());
                }
                if (this._typing.isFinish()) {
                    // TODO: 問題文をすべて打ち終わったら何かボーナスがある？
                }
            }
            else {
                // ミスタイプした場合
                this._info.missCount += 1;
                if (this.onMissTyping != null) {
                    this.onMissTyping(this._getTypingInfo());
                }
            }
        }

        public pause(): void {
            if (this._state !== GameState.PLAY) {
                throw new Error('ゲームを一時停止できるのは状態がPLAYのときのみです');
            }
            this._state = GameState.PAUSE;
            // TODO: タイプ速度測定の停止など
            this._timer.pause();
            if (this.onPause != null) {
                this.onPause();
            }
        }

        public resume(): void {
            if (this._state !== GameState.PAUSE) {
                throw new Error('ゲームを再開できるのは状態がPAUSEのときのみです');
            }
            this._state = GameState.PLAY;
            // TODO: タイプ速度測定の再開など
            this._timer.resume();
            if (this.onResume != null) {
                this.onResume();
            }
        }

        public togglePause(): void {
            switch (this.getState()) {
                case GameState.PLAY:
                    this.pause();
                    break;

                case GameState.PAUSE:
                    this.resume();
                    break;
            }
        }

        /**
         * 現在のゲーム進行情報を取得する
         */
        private _getTypingInfo(): TypingInfo {
            var kana = this._typing.getOriginalQuestion();
            var solvedKanaCount = this._typing.getAbsoluteAnswered();
            this._info.solvedKana = kana.substr(0, solvedKanaCount);
            this._info.unsolvedKana = kana.substr(solvedKanaCount);
            this._info.solvedRoma = this._typing.getAnsweredString();
            this._info.unsolvedRoma = this._typing.getRemainedQuestion();
            return this._info;
        }

        /**
         * 次の歌詞へ切り替えるためのタイマーを起動する
         * @private
         */
        private _startSwitchTimer(): void {
            this._timer = new Timer();
            this._timer.onFinish = () => {
                this._switchNextLyric();
            }
            this._timer.start(this._lyrics.getCurrentLyric().duration);
        }

        /**
         *
         * @private
         */
        private _switchNextLyric(): void {
            // 次があるなら次の歌詞へ引き継ぐ
            if (this._lyrics.hasNext()) {
                this._lyrics.moveNext();
                this._switch();
                this._startSwitchTimer();
            }
            else {
                // TODO: すべての歌詞が終わったらRESULTに
                if (this.onFinish != null) {
                    this.onFinish();
                }
            }
        }

        /**
         *
         * @private
         */
        private _switch(): void {
            var subject = this._lyrics.getCurrentLyric().kanaLyric;
            if (subject === '') {
                // TODO: 問題文が空ならばタイプ速度測定などを停止して待機する
                this._isWaiting = true;
            }
            else {
                this._isWaiting = false;
                // 問題文を登録する
                this._typing.register(subject);
            }

            if (this.onSwitchLyric != null) {
                this.onSwitchLyric(this._lyrics.getCurrentLyric(), this._getTypingInfo());
            }
        }
    }
}
