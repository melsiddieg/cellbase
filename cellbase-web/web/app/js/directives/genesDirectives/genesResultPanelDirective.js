genesModule.directive('genesResult', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: './views/genes-result-panel.html',

        link: function(scope, element, attrs) {

            $("#geneTabFile").click(function(event){
                var info = scope.selectedGene;
                delete info.transcripts;
                scope.downloadTabFile(info, "gene-" + info.id);
            })
            $("#geneJSONFile").click(function(event){

                var info = scope.selectedGene;
                delete info.transcripts;
                scope.downloadJSONFile(info, "gene-" + info.id);
            })
            $("#transcriptTabFile").click(function(event){
                var info = scope.selectedTranscript;
                delete info.exons;
                delete info.xrefs;
                delete info.tfbs;
                scope.downloadTabFile(info, "gene-" + scope.selectedGene.id + "transc-" + info.id);
            })
            $("#transcriptJSONFile").click(function(event){
                var info = scope.selectedTranscript;
                delete info.exons;
                delete info.xrefs;
                delete info.tfbs;
                scope.downloadJSONFile(info, "gene-" + scope.selectedGene.id + "transc-" + info.id);
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