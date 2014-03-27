variantsModule.directive('variantsResult', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: './views/variants-result-panel.html',
        link: function(scope, element, attrs) {
            $("#variantTabFile").click(function(event){
                var info = scope.selectedVariant;
                delete info.transcriptVariations;
                scope.downloadTabFile(info, "SNP-"+info.id);
            })
            $("#variantJSONFile").click(function(event){
                var info = scope.selectedVariant;
                delete info.transcriptVariations;
                scope.downloadJSONFile(info, "SNP-"+info.id);
            })
            $("#transcriptVarTabFile").click(function(event){

                var info = scope.selectedTranscriptVar;
                delete info.consequenceTypes;
                scope.downloadTabFile(info, "SNP-"+scope.selectedVariant.id+"transc-"+info.transcriptId);

            })
            $("#transcriptVarJSONFile").click(function(event){
                var info = scope.selectedTranscriptVar;
                delete info.consequenceTypes;
                scope.downloadJSONFile(info, "SNP-"+scope.selectedVariant.id+"transc-"+info.transcriptId);
            })
            scope.downloadTabFile = function(info, title){
                var str = "";
                var a = $('<a></a>')[0];
                str = scope.convertToTabulate(info);

                $(a).attr('href', 'data:text/plain,' + encodeURIComponent(str));
                $(a).attr('download', title + 'json');
                a.click();
            }
            scope.downloadJSONFile = function(info, title){
                var str = JSON.stringify(info);
                var a = $('<a></a>')[0];
                $(a).attr('href', 'data:application/json,' + encodeURIComponent(str));
                $(a).attr('download', title + 'json');
                a.click();
            }
        }
    };
});