/// <reference path="../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="utype/interface.d.ts" />
/// <reference path="utype/typing_logic.ts" />
/// <reference path="utype/timer.ts" />
/// <reference path="utype/lyric_set.ts" />
/// <reference path="utype/progress_view.ts" />

// テスト用歌詞データ用意
var testLyrics = [
    {duration: 12400, originalLyric: '～間奏～', kanaLyric: ''},
    {duration: 4855, originalLyric: '真っ直ぐな想いがみんなを結ぶ', kanaLyric: 'まっすぐなおもいがみんなをむすぶ'},
    {duration: 4873, originalLyric: '本気でも不器用ぶつかり合うこころ', kanaLyric: 'ほんきでもぶきようぶつかりあうこころ'},
    {duration: 4892, originalLyric: 'それでも見たいよ大きな夢は', kanaLyric: 'それでもみたいよおおきなゆめは'},
    {duration: 4467, originalLyric: 'ここにあるよ始まったばかり', kanaLyric: 'ここにあるよはじまったばかり'},
    {duration: 1108, originalLyric: '(わかってる)', kanaLyric: 'わかってる'},
    {duration: 3821, originalLyric: '楽しいだけじゃない試されるだろう', kanaLyric: 'たのしいだけじゃないためされるだろう'},
    {duration: 1108, originalLyric: '(わかってる)', kanaLyric: 'わかってる'},
    {duration: 3692, originalLyric: 'だってその苦しさもミライ', kanaLyric: 'だってそのくるしさもみらい'},
    {duration: 1163, originalLyric: '(行くんだよ)', kanaLyric: 'いくんだよ'},
    {duration: 3696, originalLyric: '集まったら強い自分になってくよ', kanaLyric: 'あつまったらつよいじぶんになってくよ'},
    {duration: 4633, originalLyric: '(きっとね)変わり続けて(We\'ll be star!)', kanaLyric: 'きっとねかわりつづけてWe\'ll be star'},
    {duration: 5169, originalLyric: 'それぞれが好きなことで頑張れるなら', kanaLyric: 'それぞれがすきなことでがんばれるなら'},
    {duration: 4652, originalLyric: '新しい(場所が)ゴールだね', kanaLyric: 'あたらしいばしょがごーるだね'},
    {duration: 5076, originalLyric: 'それぞれの好きなことを信じていれば', kanaLyric: 'それぞれのすきなことをしんじていれば'},
    {duration: 4929, originalLyric: 'ときめきを(抱いて)進めるだろう', kanaLyric: 'ときめきをだいてすすめるだろう'},
    {duration: 5575, originalLyric: '(恐がる癖は捨てちゃえ)とびきりの笑顔で', kanaLyric: 'こわがるくせはすてちゃえとびきりのえがおで'},
    {duration: 5519, originalLyric: '(跳んで跳んで高く)僕らは今のなかで', kanaLyric: 'とんでとんでたかくぼくらはいまのなかで'},
    {duration: 3443, originalLyric: '', kanaLyric: ''},
    {duration: 4292, originalLyric: '輝きを待ってた', kanaLyric: 'かがやきをまってた'}
];

enum GameState {
    READY,
    PLAY,
    PAUSE,
};

var app = angular.module('utype', []);
app.controller('MainController', ['$scope', function($scope) {

    $scope.title = 'UType!';
    $scope.score = 0;
    $scope.missCount = 0;
    $scope.rank = 'F';

    /**
     * 現在のゲームの状態
     */
    var _state: GameState = GameState.READY;

    /**
     * タイピングのロジック
     */
    var _typing: utype.TypingLogic = new utype.TypingLogic();
    _typing.onSuccess.addListener(function() {
        $scope.$apply(() => { $scope.score += 100; });
        _showLyric();
    });
    _typing.onMiss.addListener(function() {
        $scope.$apply(() => { $scope.missCount += 1});
    });

    /**
     * 歌詞リスト
     */
    var _lyrics: utype.LyricSet = new utype.LyricSet(testLyrics);

    /**
     *
     */
    var _totalProgressBar = new utype.ProgressView(jQuery('#total-bar'));

    var _intervalProgressBar = new utype.ProgressView(jQuery('#interval-bar'));

    /**
     * 歌詞の切り替えに使うタイマー
     */
    var _timer: utype.Timer = new utype.Timer();
    _timer.onElapsed.addListener(() => {
        if (_lyrics.hasNext()) {
            _lyrics.moveNext();
            _updateLyric(_lyrics.getCurrentLyric());
        }
    });


    /**
     * キーが押されたとき
     * @param event キーボードイベント
     */
    $scope.onKeyPress = function(event: JQueryKeyEventObject): void {
        if (_state === GameState.READY && event.which == 0x20) {
            _startGame();
            _state = GameState.PLAY;
        }
        else if(_state === GameState.PLAY) {
            // answer
            _typing.type(String.fromCharCode(event.which));
        }
    }

    /**
     * ゲーム開始する
     */
    var _startGame = function(): void {
        _updateLyric(_lyrics.getCurrentLyric());
        _totalProgressBar.startAnimation(100, _lyrics.getTotalDuration());
    }

    /**
     * 歌詞を更新する
     */
    var _updateLyric = function(newLyric: utype.Lyric): void {
        // 問題文登録
        _typing.registerSubject(newLyric.kanaLyric);
        // タイマー開始
        _timer.start(newLyric.duration);
        // プログレスバー開始
        _intervalProgressBar.setPercentage(0);
        _intervalProgressBar.startAnimation(100, newLyric.duration);
        // 歌詞表示更新
        _showLyric();
    }

    /**
     * 現在の歌詞（問題文）の状態を表示する
     */
    var _showLyric = function(): void {
        $scope.$apply(function() {
            $scope.lyric = {
                kana: {
                    solved: _typing.getSolvedKana(),
                    unsolved: _typing.getUnsolvedKana()
                },
                roma: {
                    solved: _typing.getSolvedRoma().toUpperCase(),
                    unsolved: _typing.getUnsolvedRoma().toUpperCase()
                },
                original: _lyrics.getCurrentLyric().originalLyric
            };
        });
    }
}]);
app.directive('ngKeypress', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.bind('keypress', function(e) {
                scope[attr['ngKeypress']](e);
            });
        }
    };
});
