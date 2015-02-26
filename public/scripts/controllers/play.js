utype.controller('PlayController', ['$scope', 'Karaoke', 'socket', function($scope, Karaoke, socket) {
    // 状態
    // 'ready', 'playing', 'result' のどれか
    $scope.state = 'ready';

    // viewに表示する変数たち
    $scope.score = 0;
    $scope.wpm = 0;
    $scope.lyric = '';
    $scope.words = {roma: null, kana: null};
    $scope.players = [];
    $scope.applyWords = function() {
        $scope.words.kana = {
            solved: typing.getOriginalQuestion().substr(0, typing.getAbsoluteAnswered()),
            unsolved: typing.getOriginalQuestion().substr(typing.getAbsoluteAnswered())
        };
        $scope.words.roma = {
            solved: typing.getAnsweredString(),
            unsolved: typing.getRemainedQuestion()
        };
    };
    $scope.onKeyPress = function(e) {
        switch ($scope.state) {
            case 'ready':
                if (e.which == 0x20) {
                    socket.emit('start');
                }
                break;

            case 'playing':
                var typedChar = String.fromCharCode(e.which);
                if (typing.getRemainedQuestion().length > 0) {
                    typing.answer(typedChar);
                    $scope.applyWords();
                }
                break;
        }
    };

    // ここからメインコード開始
    var startProgress = function(duration) {
        var options = {
            duration: duration,
            easing: 'linear'
        };
        jQuery('.progress-bar')
            .css({width: 0})
            .clearQueue() // clearQueueをしないと少しずつタイミングがずれてくるので...
            .stop()
            .animate({width: '100%'}, options);
    };

    var typing = new Typing();
    Karaoke.on('switch', function(lyric) {
        startProgress(lyric.duration);
        typing.register(lyric.kana);
        $scope.lyric = lyric.original;
        $scope.applyWords();
    });

    // スタート！
    var lyrics = [
        {original: '', kana: '', duration: 200},
        {original: '試験abc-~+*', kana: 'しけんabc-~+*', duration: 3000},
        {original: '--休憩タイム--', kana: '', duration: 3000},
        {original: '＠「」％＆', kana: '＠「」％＆', duration: 3000}
    ];
    Karaoke.start(lyrics);
}]);