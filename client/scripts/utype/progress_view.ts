/// <reference path="../../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="interface.d.ts" />

module utype {

    /**
     * 進捗度を表すプログレスバーのビュー
     */
    export class ProgressView {

        /**
         * アニメーションするバーのjQueryオブジェクト
         */
        private _barElement: JQuery;

        /**
         * 目標％
         */
        private _percentage: number;

        constructor(progressElement: JQuery) {
            this._barElement = progressElement.find('.bar');
        }

        public startAnimation(percentage: number, duration: number): void {
            var options = {
                duration: duration,
                easing: 'linear'
            }
            this._barElement.animate({width: percentage.toString() + '%'}, options);
        }

        public stopAnimation(): void {
            this._barElement.stop();
        }
    }
}
