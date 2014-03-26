genesModule.directive('genesSelect', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: './views/genes-select-panel.html',
        link: function(scope, element, attrs) {
            $("#genesSelectAllChroms").click(function(){
                $('#genesChromMultiSelect').children().addClass("btn-primary");
            })
            $("#genesDeselectAllChroms").click(function(){
                $('#genesChromMultiSelect').children().removeClass("btn-primary");
            })
            $("#genesSelectAllBiotypes").click(function(){
                $('#BiotypesMultiSelect').children().addClass("btn-primary");
            })
            $("#genesDeselectAllBiotypes").click(function(){
                $('#BiotypesMultiSelect').children().removeClass("btn-primary");
            })
            $("#genesChromMultiSelect").click(function(event){
                var chrom = event.toElement.innerText;
                if ($('#genes' + chrom).hasClass("btn-primary")) {
                    $('#genes' + chrom).removeClass("btn-primary");
                }
                else {
                    $('#genes' + chrom).addClass("btn-primary");
                }
            })
            $("#BiotypesMultiSelect").click(function(event){
                var biotype = event.toElement.innerText;
                if ($('#' + biotype).hasClass("btn-primary")) {
                    $('#' + biotype).removeClass("btn-primary");
                }
                else {
                    $('#' + biotype).addClass("btn-primary");
                }
            })
        }
    };
});