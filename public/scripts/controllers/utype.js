var utype = angular.module('uType', []);
utype.controller('MainController', ['$scope', 'Karaoke', function($scope, Karaoke) {
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
        var typedChar = String.fromCharCode(e.which);
        if (typing.getRemainedQuestion().length > 0) {
            typing.answer(typedChar);
            $scope.applyWords();
        }
    };
    // ここからメインコード開始
    var typing = new Typing();
    Karaoke.on('switch', function(lyric) {
        typing.register(lyric.kana);
        $scope.lyric = lyric.original;
        $scope.applyWords();
    });

    // スタート！
    var lyrics = [
        {original: '試験abc-~+*', kana: 'しけんabc-~+*', duration: 3000},
        {original: '--休憩タイム--', kana: '', duration: 3000},
        {original: '＠「」％＆', kana: '＠「」％＆', duration: 3000}
    ];
    Karaoke.start(lyrics);
}]);