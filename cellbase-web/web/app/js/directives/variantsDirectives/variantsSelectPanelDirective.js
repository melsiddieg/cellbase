variantsModule.directive('variantsSelect', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: './views/variants-select-panel.html',
        link: function(scope, element, attrs) {
            $("#variantsSelectAllChroms").click(function(){
                $('#variantsChromMultiSelect').children().addClass("btn-primary");
            })
            $("#variantsDeselectAllChroms").click(function(){
                $('#variantsChromMultiSelect').children().removeClass("btn-primary");
            })
            $("#variantsSelectAllconseqType").click(function(){
                $('#conseqTypeMultiSelect').children().addClass("btn-primary");
            })
            $("#variantsDeselectAllconseqType").click(function(){
                $('#conseqTypeMultiSelect').children().removeClass("btn-primary");
            })
            $("#variantsChromMultiSelect").click(function(event){
                var chrom = event.toElement.innerText;

                if($('#variants'+chrom).hasClass("btn-primary")){
                    $('#variants'+chrom).removeClass("btn-primary");
                }
                else{
                    $('#variants'+chrom).addClass("btn-primary");
                }
            })
            $("#conseqTypeMultiSelect").click(function(event){
                var conseqType = event.toElement.innerText;

                if($('#'+conseqType).hasClass("btn-primary")){
                    $('#'+conseqType).removeClass("btn-primary");
                }
                else{
                    $('#'+conseqType).addClass("btn-primary");
                }
            })
            scope.$watch("specie", function(){
                if($('#variantsGV').hasClass("disabled")){
                    $('#variantsGV').removeClass("disabled");
                }
            })
        }
    };
});