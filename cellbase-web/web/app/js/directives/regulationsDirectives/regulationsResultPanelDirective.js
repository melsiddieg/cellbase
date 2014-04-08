regulationsModule.directive('regulationsResult', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: './views/regulations-result-panel.html',
        link: function(scope, element, attrs) {
            $("#regultionsListDiv").click(function(event){
                for(var i in scope.listOfFeatureClassToSelect){
                    $("#regultionsList-"+scope.listOfFeatureClassToSelect[i]).removeClass("ocb-list-bg-click");
                }
                $("#regultionsList-"+scope.featureClassSelected).addClass("ocb-list-bg-click");
            })
        }
    };
});