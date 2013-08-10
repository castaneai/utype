/// <reference path="../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="utype/interface.d.ts" />
/// <reference path="utype/typing_logic.ts" />
/// <reference path="utype/progress_view.ts" />
/// <reference path="utype/lyric_switcher.ts" />

declare var io: any;
declare var testLyrics: utype.Lyric[];

enum GameStatus {
    READY,
    PLAY,
    PAUSE,
    WATCH
};

var app = angular.module('utype', ['socket.io']);
app.controller('MainController', ['$scope', 'socket', function($scope, socket) {

	// --- $scope ---
	$scope.lyric = null;
	$scope.players = [new utype.Player(), new utype.Player()];
	$scope.myPlayerIndex = -1;
	$scope.gameStatus = GameStatus.WATCH;

	$scope.getMyPlayer = (): utype.Player => {
		return $scope.players[$scope.myPlayerIndex];
	}

	$scope.changeStatus = (newStatus: GameStatus) => {
		$scope.gameStatus = newStatus;
	}

	/**
	 * ゲームに参加する
	 */
	$scope.joinGame = (playerIndex: number) => {
		socket.emit('join', {playerIndex: playerIndex});
		$scope.changeStatus(GameStatus.READY);
		$scope.myPlayerIndex = playerIndex;
	}

	$scope.startGame = () => {
		socket.emit('start');
		_startGame();
	}

    /**
     * 歌詞を表示する
     */
    $scope.setLyric = (lyric: utype.Lyric) => {
		_typing.registerSubject(lyric.kanaLyric);
        _intervalProgressBar.setPercentage(0);
        _intervalProgressBar.startAnimation(100, lyric.duration);
		$scope.players.forEach((player) => {
			player.intervalScore.kanaSolvedCount = 0;
		});
        $scope.lyric = lyric;
		$scope.$apply();
    }

    /**
     * キーが押されたとき
     */
	$scope.onKeyPress = (keyEvent) => {
        if ($scope.gameStatus === GameStatus.READY && keyEvent.which == 0x20) {
			$scope.startGame();
        }
        else if($scope.gameStatus === GameStatus.PLAY) {
            _typeKey(keyEvent.which);
			socket.emit('type', {
				playerIndex: $scope.myPlayerIndex,
				// TODO: playerという名前は不適？ playerStatus or playerScoreにするべきか
				player: $scope.getMyPlayer()
			});
        }
    }

	$scope.getPlayerSolvedKana = (playerIndex: number): string => {
		var player = $scope.players[playerIndex];
		return _typing.getKanaSubject().substr(0, player.intervalScore.kanaSolvedCount); 
	}

	$scope.getPlayerUnsolvedKana = (playerIndex: number): string => {
		var player = $scope.players[playerIndex];
		return _typing.getKanaSubject().substr(player.intervalScore.kanaSolvedCount);
	}

	$scope.getSolvedRoma = (): string => {
		return _typing.getSolvedRoma();
	}

	$scope.getUnsolvedRoma = (): string => {
		return _typing.getUnsolvedRoma();
	}

	// --- socket ---
	socket.on('start', (data) => {
		console.log('other client started game.');
		_startGame();
	});

	socket.on('type', (data) => {
		$scope.players[data.playerIndex] = data.player;
		$scope.$apply();
	});

	// --- private ---
	var _typing = new utype.TypingLogic();

	var _lyricSwitcher = new utype.LyricSwitcher(testLyrics);

	var _startGame = () => {
		$scope.changeStatus(GameStatus.PLAY);
		_lyricSwitcher.onSwitch.addListener((lyric: utype.Lyric) => {
			$scope.setLyric(lyric);
		});
		_lyricSwitcher.onFinish.addListener(() => {
			// TODO: すべての歌詞が終了したとき
		});
		_lyricSwitcher.start();
		_totalProgressBar.startAnimation(100, _lyricSwitcher.getTotalDuration());
	}

    /**
     * 曲全体の進行度を表すプログレスバー
     */
    var _totalProgressBar = new utype.ProgressView('#total-bar');

    /**
     * 現在の歌詞インターバルの進行度を表すプログレスバー
     */
    var _intervalProgressBar = new utype.ProgressView('#interval-bar');

    /**
     * キーをタイプする
     */
    var _typeKey = function(keyCode: number): void {
        var typedChar = String.fromCharCode(keyCode);
        if (_typing.type(typedChar)) {
            _onTypeSuccess();
        }
        else {
            _onTypeMiss();
        }
    }

    var _onTypeSuccess = function(): void {
		// TODO: スコア点数計算式
        $scope.getMyPlayer().score.point += 100;
		$scope.getMyPlayer().intervalScore = {
			kanaSolvedCount: _typing.getKanaSolvedCount()
		};
		$scope.$apply();
    }

    var _onTypeMiss = function(): void {
		// TODO: ミス計算
        $scope.getMyPlayer().score.missCount += 1;
		$scope.$apply();
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
