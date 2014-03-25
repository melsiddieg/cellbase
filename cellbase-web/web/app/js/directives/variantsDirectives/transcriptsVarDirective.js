variantsModule.directive('transcriptsVar', function () {
    return {
        restrict: 'E',
            replace: true,
        transclude: true,
        scope: {
            data: '=info',
            specieName: '=specie'
        },
        templateUrl: './views/widgets/transcriptsVar.html'
    };
});