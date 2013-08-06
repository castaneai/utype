/// <reference path="../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="utype/interface.d.ts" />
/// <reference path="utype/typing_logic.ts" />
/// <reference path="utype/timer.ts" />
/// <reference path="utype/lyric_set.ts" />
/// <reference path="utype/progress_view.ts" />

declare var io: any;

// テスト用歌詞データ用意
var testLyrics = [
    {duration: 1240, originalLyric: '～間奏～', kanaLyric: ''},
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
    WATCH
};

var app = angular.module('utype', []);
app.controller('MainController', ['$scope', function($scope) {

    var url = location.protocol + '//' + location.host;
    var socket = io.connect(url);

    socket.on('start', function(data) {
        console.log('other client started a game');
        _state = GameState.WATCH;
        _startGame();
    });

    socket.on('type', function(data) {
        console.log('other client typed succesfly.');
        _onTypeSuccess();
    });

    // Viewと連動する変数の初期値を設定
    $scope.title = 'UType!';
    $scope.score = {
        point: 0,
        missCount: 0
    };

    // Viewと連動する関数を設定
    /**
     * 歌詞を表示する
     */
    $scope.setLyric = (lyric: utype.Lyric) => {
        _intervalProgressBar.setPercentage(0);
        _intervalProgressBar.startAnimation(100, lyric.duration);
        $scope.lyric = {};
        $scope.lyric.originalLyric = lyric.originalLyric;
        $scope.updateLyricState();
    }

    /**
     * 打ち終わった部分とまだの部分の色分け表示を更新する
     * ↑のsetLyricは歌詞が始まったときのみ呼び出されるがこっちは
     * キー入力があるたびに呼び出される
     */
    $scope.updateLyricState = () => {
        $scope.lyric.kana = {
            solved: _typing.getSolvedKana(),
            unsolved: _typing.getUnsolvedKana()
        };
        $scope.lyric.roma = {
            solved: _typing.getSolvedRoma(),
            unsolved: _typing.getUnsolvedRoma()
        };
        $scope.$apply();
    }

    /**
     * キーが押されたとき
     */
    $scope.onKeyPress = function(event: JQueryKeyEventObject): void {
        if (_state === GameState.READY && event.which == 0x20) {
            _state = GameState.PLAY;
            socket.emit('start');
            _startGame();
        }
        else if(_state === GameState.PLAY) {
            _typeKey(event.which);
        }
    }

    /**
     * 現在のゲームの状態
     */
    var _state: GameState = GameState.READY;

    /**
     * タイピングのロジック
     */
    var _typing: utype.TypingLogic = new utype.TypingLogic();

    /**
     * 歌詞リスト
     */
    var _lyrics: utype.LyricSet = new utype.LyricSet(testLyrics);

    /**
     * 曲全体の進行度を表すプログレスバー
     */
    var _totalProgressBar = new utype.ProgressView(jQuery('#total-bar'));

    /**
     * 現在の歌詞インターバルの進行度を表すプログレスバー
     */
    var _intervalProgressBar = new utype.ProgressView(jQuery('#interval-bar'));

    /**
     * 歌詞の切り替えに使うタイマー
     */
    var _timer: utype.Timer = new utype.Timer();
    _timer.onElapsed.addListener(() => {
        if (_lyrics.hasNext()) {
            _lyrics.moveNext();
            _setLyric(_lyrics.getCurrentLyric());
        }
    });

    /**
     * ゲーム開始する
     */
    var _startGame = function(): void {
        _setLyric(_lyrics.getCurrentLyric());
        _totalProgressBar.startAnimation(100, _lyrics.getTotalDuration());
    }

    /**
     * キーをタイプする
     */
    var _typeKey = function(keyCode: number): void {
        var typedChar = String.fromCharCode(keyCode);
        if (_typing.type(typedChar)) {
            socket.emit('type', {keyCode: keyCode});
            _onTypeSuccess();
        }
        else {
            console.log('miss!');
            _onTypeMiss();
        }
    }

    var _onTypeSuccess = function(): void {
        $scope.score.point += 100;
        $scope.updateLyricState();
    }

    var _onTypeMiss = function(): void {
        $scope.score.missCount += 1;
        $scope.updateLyricState();
    }

    /**
     * 歌詞を更新する
     */
    var _setLyric = function(newLyric: utype.Lyric): void {
        // 問題文登録
        _typing.registerSubject(newLyric.kanaLyric);
        // タイマー開始
        _timer.start(newLyric.duration);
        // 表示を更新
        $scope.setLyric(newLyric);
    }
}]);

/**
 * keyPressイベントを受け取るためのディレクティブ
 */
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
