/// <reference path="../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../utype/tm_xml_parser.ts" />
/// <reference path="../utype/lyric_switcher.ts" />
/// <reference path="../utype/progress_view.ts" />


module controllers {

	export interface Music {
		id: string;
		title: string;
	}

	export interface PlayerScore {
		point: number;
		missCount: number;
		wpm: number;
	}

	export interface Player {
		icon: string;
		name: string;
		score: PlayerScore;
	}

	export interface MainScope extends ng.IScope {
		musics: Music[];
		selectedMusic: Music;
		lyric: utype.Lyric;
		entry: () => void;
		players: Player[];
	}

	export class MainController {

		constructor($scope: MainScope) {
			var defaultScore = {
				point: 0,
				missCount: 0,
				wpm: 0
			};
			$scope.musics = [
				{id:'wonderful_rush', title:'Wonderful Rush'}
			];
			$scope.selectedMusic = $scope.musics[0];

			$scope.players = [
				{icon: '4.jpg', name:'アリス', score: defaultScore},
				{icon: '5.jpg', name:'あやや', score: defaultScore}
			];

			$scope.entry = () => {
				var xmlPath = 'xml/' + $scope.selectedMusic.id + '.xml';
				utype.TmXmlParser.parse(xmlPath, (lyrics: utype.Lyric[]) => {
					var switcher = new utype.LyricSwitcher(lyrics);
					var totalProgress = new utype.ProgressView('#total-progress')
					var intervalProgress = new utype.ProgressView('#interval-progress');
					this._playVideo('#video');
					totalProgress.setPercentage(0);
					totalProgress.startAnimation(100, switcher.getTotalDuration());
					switcher.onSwitch.addListener((lyric: utype.Lyric) => {
						intervalProgress.setPercentage(0);
						intervalProgress.startAnimation(100, lyric.duration);
						$scope.lyric = lyric;
						$scope.$apply();
					});
					switcher.start();
				});
			}
		}

		private _playVideo(videoElementSelector: string): void {
			var elem = <HTMLVideoElement> document.querySelector(videoElementSelector);
			elem.play();
		}
	}
}