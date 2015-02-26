utype.directive('typingGame', function() {
    function link(scope, element, attr) {
        jQuery(document).on('keypress', function(e) {
            scope.$apply(scope.onKeyPress(e));
        });

        element.on('$destroy', function() {
            jQuery(document).off('keypress');
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'templates/typing-game.html',
        link: link
    };
});