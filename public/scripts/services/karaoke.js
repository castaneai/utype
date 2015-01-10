/**
 * 一定時間ごとに歌詞を切り替える
 * 歌詞が切り替わるとswitchイベントまたはendイベントが起こる
 * startに {original: string, kana: string, duration: number}の配列を渡す
 */
utype.service('Karaoke', ['$timeout', function($timeout) {
    var _lyrics = [];
    var _currentLyricIndex = 0;
    var _listeners = {};

    function _trigger(eventName, arg) {
        if (_listeners.hasOwnProperty(eventName)) {
            _listeners[eventName](arg);
        }
    }

    function _hasNext() {
        return _currentLyricIndex + 1 < _lyrics.length;
    }

    function _switch() {
        _trigger('switch', _lyrics[_currentLyricIndex]);
        _setTimer();
    }

    function _setTimer() {
        $timeout(function() {
            if (_hasNext()) {
                _currentLyricIndex++;
                _switch();
            } else {
                _trigger('end', {});
            }
        }, _lyrics[_currentLyricIndex].duration);
    }

    this.on = function(eventName, listener) {
        _listeners[eventName] = listener;
    };

    this.start = function(lyrics) {
        _lyrics = lyrics;
        _switch();
    };
}]);