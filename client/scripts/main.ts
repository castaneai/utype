/// <reference path="../../d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="controllers/main.ts" />

angular.module('controllers', []).controller(controllers);
angular.module('utype', ['controllers']);
angular.module('controllers').directive('ngKeypress', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attr, ctrl) {
			elem.bind('keypress', function(e) {
				scope[attr['ngKeypress']](e);
			});
		}
	};
});