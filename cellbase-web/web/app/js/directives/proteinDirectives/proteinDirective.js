/**
 * Created by jag on 06/03/2014.
 */
myApp.directive('protein', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: './views/protein-view.html',
        controller: function($scope) {

        }
    };
});