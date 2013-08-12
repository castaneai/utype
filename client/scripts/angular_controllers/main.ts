/// <reference path="../../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../utype/tm_xml_parser.ts" />
/// <reference path="../utype/game.ts" />

var app = angular.module('utype', ['socket.io']);
app.controller('MainController', ['$scope', 'socket', function($scope, socket) {

    var game: utype.Game;
    $scope.game = null;

    /**
     * キーが押されたとき
     */
    $scope.onKeyPress = (keyEvent) => {
        game.typeKey(keyEvent.which);
    }

    utype.TmXmlParser.parse('xml/mondai_kaiketsu.xml', (lyrics: utype.Lyric[]) => {
        game = new utype.Game(lyrics, socket);
        $scope.game = game;
        $scope.game.onStatusChanged.addListener(() => {
            $scope.$apply();
        });
        $scope.$apply();
    });

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