genesModule.directive('transcripts', function () {
    return {
        restrict: 'E',
            replace: true,
        transclude: true,
        scope: {
            data: '=transcript',
            specieName: '=specie',
            changeTab: '=tabFunction'
        },
        templateUrl: './views/widgets/transcripts.html'
    };
});