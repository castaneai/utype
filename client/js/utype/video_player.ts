/// <reference path="../../../d.ts/DefinitelyTyped/youtube/Youtube.d.ts" />

module utype {

    /**
     * 動画再生プレイヤークラス
     */
    export class VideoPlayer {

        /**
         * 動画が再生されたときに呼び出される関数
         * 一時停止状態を解除したときも含む
         */
        public onPlay: () => void;

        /**
         * 動画が一時停止されたときに呼び出される関数
         */
        public onPause: () => void;

        /**
         * YouTube APIのPlayer
         */
        private _player: YT.Player;

        /**
         * 新しい動画プレイヤーを作る
         * @param playerElementId 動画を埋め込む要素のID
         * @param videoId 動画ID
         */
        constructor(playerElementId: string, videoId: string) {
            this._player = new YT.Player(playerElementId, {
                videoId: videoId,
                playerVars: {
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3
                },
                events: {
                    // TODO: YouTube APIのイベントを処理
                    onStateChange: (e) => {
                        console.log('onstatechange: %d', e.data);
                        this._onPlayerStateChanged(e.data);
                    }
                }
            });
        }

        /**
         * 動画を再生する
         */
        public play(): void {
            this._player.playVideo();
        }

        /**
         * 動画を停止する
         */
        public stop(): void {
            this._player.stopVideo();
        }

        /**
         * 動画を一時停止する
         */
        public pause(): void {
            this._player.pauseVideo();
        }

        /**
         * プレイヤーの状態が変更されたときに呼び出される関数
         * @param state
         * @private
         */
        private _onPlayerStateChanged(state: YT.PlayerState): void {
            switch (state) {
                case YT.PlayerState.PLAYING:
                    if (this.onPlay != null) {
                        this.onPlay();
                    }
                    break;

                case YT.PlayerState.PAUSED:
                    if (this.onPause != null) {
                        this.onPause();
                    }
                    break;
            }
        }
    }
}
