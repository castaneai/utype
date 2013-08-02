/// <reference path="../../d.ts/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="utype/lyric_set.ts" />
/// <reference path="utype/video_player.ts" />
/// <reference path="utype/view.ts" />

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

// YouTube APIとjQueryの両方が準備完了するまで待機して
// 完了したらメイン関数を呼ぶようにする
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var youTubeReady = jQuery.Deferred();
function onYouTubeIframeAPIReady() {
    youTubeReady.resolve();
}

var documentReady = jQuery.Deferred();
$(document).ready(() => {
    documentReady.resolve();
});

var gameReady = jQuery.when(youTubeReady, documentReady);
gameReady.done(() => {
    /*
    // ゲーム全体の準備が完了したらここからプログラムが始まる
    var videoPlayer = new utype.VideoPlayer('video-player', 'jZG4SYdvbNE');
    var game = new utype.Game(new utype.LyricSet(testLyrics));
    var view = new utype.View();

    videoPlayer.onPlay = () => {
        if (game.getState() === utype.GameState.READY) {
            view.focusDocument();
            game.start();
        }
        else if (game.getState() === utype.GameState.PAUSE) {
            view.focusDocument();
            game.resume();
        }
    };

    videoPlayer.onPause = () => {
        if (game.getState() === utype.GameState.PLAY) {
            view.focusDocument();
            game.pause();
        }
    };

    game.onStart = () => {
        videoPlayer.play();
        var lyricSet = game.getLyricSet();
        view.startTotalProgress(100, lyricSet.getTotalDuration());
    };

    game.onFinish = () => {
        view.clearAllLyric();
        videoPlayer.stop();
    };

    game.onSwitchLyric = (lyric, info) => {
        console.log('switched: %s', lyric.originalLyric);
        // 歌詞を表示
        view.clearAllLyric();
        view.setOriginalLyric(lyric.originalLyric);
        view.setKanaLyric(lyric.kanaLyric);
        view.setRomaLyric(info.unsolvedRoma);
        // 1歌詞分のプログレスバーを0%から開始
        view.clearLyricProgress();
        view.startLyricProgress(100, lyric.duration);
    };

    game.onPause = () => {
        view.pauseAllProgressBar();
        videoPlayer.pause();
    };

    game.onResume = () => {
        view.resumeAllProgressBar();
        videoPlayer.play();
    };

    game.onSuccessTyping = (info) => {
        view.setSolvedKanaLyric(info.solvedKana, info.unsolvedKana);
        view.setSolvedRomaLyric('', info.unsolvedRoma);
        view.setScore(info.score);
    };

    game.onMissTyping = (info) => {
        view.setMiss(info.missCount);
    };

    $(document).on('keypress', (e) => {
        if (game.getState() === utype.GameState.READY &&
            e.which == 0x20) {
            videoPlayer.play();
        }
        else if (game.getState() === utype.GameState.PLAY) {
            game.answer(e.which);
        }
    });

    $(document).on('keydown', (e) => {
        if (e.ctrlKey === false) {
            return;
        }
        game.togglePause();
    });
    */
});
