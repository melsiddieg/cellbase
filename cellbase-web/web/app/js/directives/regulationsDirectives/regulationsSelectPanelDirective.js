regulationsModule.directive('regulationsSelect', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: './views/regulations-select-panel.html',
        link: function(scope, element, attrs) {
            $("#regulationsSelectAllChroms").click(function(){
                $('#regulationsChromMultiSelect').children().addClass("btn-primary");
            })
            $("#regulationsDeselectAllChroms").click(function(){
                $('#regulationsChromMultiSelect').children().removeClass("btn-primary");
            })
            $("#regulationsSelectAllfeatureClass").click(function(){
                $('#featureClassMultiSelect').children().addClass("btn-primary");
            })
            $("#regulationsDeselectAllfeatureClass").click(function(){
                $('#featureClassMultiSelect').children().removeClass("btn-primary");
            })
            $("#regulationsChromMultiSelect").click(function(event){
                var chrom = event.toElement.innerText;
                if($('#regulation'+chrom).hasClass("btn-primary")){
                    $('#regulation'+chrom).removeClass("btn-primary");
                }
                else{
                    $('#regulation'+chrom).addClass("btn-primary");
                }
            })
            $("#featureClassMultiSelect").click(function(event){
                var featureClass = event.toElement.innerText;
                if($("[id='"+featureClass+"']").hasClass("btn-primary")){
                    $("[id='"+featureClass+"']").removeClass("btn-primary");
                }
                else{
                    $("[id='"+featureClass+"']").addClass("btn-primary");
                }
            })
        }
    };
});