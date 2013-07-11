module utype {

    export class Event<TCallback> {

        private _listeners: TCallback[] = [];

        public addListener(callback: TCallback): void {
            this._listeners.push(callback);
        }

        public hasListener(callback: TCallback): boolean {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === callback)
                    return true;
            }
            return false;
        }

        public dispatch(...args: any[]): void {
            for (var i = 0; i < this._listeners.length; i++) {
                (<any> this._listeners[i]).apply({}, args || []);
            }
        }
    }
}