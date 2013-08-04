module utype {

    /**
     * イベントクラス
     * 非同期で何かが起こったときに予め登録しておいた関数を呼び出すというときに使う
     */
    export class Event<TCallback> {

        /**
         * 登録された関数（コールバック）のリスト
         * @type Array
         * @private
         */
        private _listeners: {source: Object; callback: TCallback}[] = [];

        /**
         * 新しい関数（コールバック）を登録する
         * @param callback
         */
        public addListener(callback: TCallback, source: Object = {}): void {
            this._listeners.push({
                source: source,
                callback: callback
            });
        }

        /**
         * 指定した関数が登録されているかどうか調べる
         * @param callback
         * @returns boolean
         */
        public hasListener(callback: TCallback): boolean {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i].callback === callback)
                    return true;
            }
            return false;
        }

        /**
         * イベントを発生させる
         * @param args コールバックに渡す引数
         */
        public dispatch(...args: any[]): void {
            for (var i = 0; i < this._listeners.length; i++) {
                (<any> this._listeners[i].callback).apply(this._listeners[i].source, args || []);
            }
        }
    }
}