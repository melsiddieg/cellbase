var variantsSelect = variantsModule.controller('variantsSelect', ['$scope', '$rootScope', 'mySharedService', 'CellbaseService', function ($scope, $rootScope, mySharedService, CellbaseService) {

    $scope.specie = mySharedService.variantsSpecie;
    $scope.chromSelected = [];
    $scope.regions = "20:32850000-32860000";
    $scope.listOfConseqTypes = [];
    $scope.snpIdFilter = "";
    $scope.conseqTypesFilter = [];

    $scope.typeOfData = "variants";

    $scope.chromNames = mySharedService.chromNames;

    $scope.init = function(){
        $scope.deselectAllChrom();
        $scope.deselectAllConseqTypeFilter();
        $scope.chromSelected = [];
        $scope.regions = "";
        $scope.listOfConseqTypes = [];
        $scope.snpIdFilter ="";
        $scope.conseqTypesFilter = [];
    };
    //comunicate that a is a new result
    $scope.setResult = function (fromGV) {
        mySharedService.broadcastVariantsNewResult($scope.chromSelected, $scope.regions, $scope.snpIdFilter, $scope.conseqTypesFilter, fromGV);
    };

    $scope.setSpecie = function(){
        $scope.specie = mySharedService.variantsSpecie;
        $scope.chromSelected = [];
        $scope.chromNames = mySharedService.chromNames;
    };
    $scope.addChrom = function (chrom) {
        var pos = $scope.chromSelected.indexOf(chrom);

        if (pos == -1) {
            $scope.chromSelected.push(chrom);
        }
        else {
            $scope.chromSelected.splice(pos, 1);
        }

        if($('#variants'+chrom).hasClass("btn-primary")){
            $('#variants'+chrom).removeClass("btn-primary");
        }
        else{
            $('#variants'+chrom).addClass("btn-primary");
        }
    };

    $scope.addConseqTypeFilter = function (conseqType) {
        var pos = $scope.conseqTypesFilter.indexOf(conseqType);

        if (pos == -1) {
            $scope.conseqTypesFilter.push(conseqType);
        }
        else {
            $scope.conseqTypesFilter.splice(pos, 1);
        }

        if($('#'+conseqType).hasClass("btn-primary")){
            $('#'+conseqType).removeClass("btn-primary");
        }
        else{
            $('#'+conseqType).addClass("btn-primary");
        }
    };

    $scope.selectAllChrom = function () {

        $('#variantsChromMultiSelect').children().addClass("btn-primary");

        for (var i in $scope.chromNames) {
            $scope.chromSelected.push($scope.chromNames[i]);
        }

//        $('#variantsChromMultiSelect').children().children().prop('checked', true);
//        for (var i in $scope.chromNames) {
//            $scope.chromSelected.push($scope.chromNames[i])
//        }
    };
    $scope.deselectAllChrom = function () {

        $('#variantsChromMultiSelect').children().removeClass("btn-primary");
        $scope.chromSelected = [];

//        $scope.chromSelected = [];
//        $('#variantsChromMultiSelect').children().children().prop('checked', false);
    };
    $scope.selectAllConseqTypeFilter = function () {

        $('#conseqTypeMultiSelect').children().addClass("btn-primary");
        for (var i in $scope.listOfConseqTypes) {
            $scope.conseqTypesFilter.push($scope.listOfConseqTypes[i]);
        }

//        $('#conseqTypeMultiSelect').children().children().prop('checked', true);
//        for (var i in $scope.listOfConseqTypes) {
//            $scope.conseqTypesFilter.push($scope.listOfConseqTypes[i]);
//        }
    };
    $scope.deselectAllConseqTypeFilter = function () {

        $('#conseqTypeMultiSelect').children().removeClass("btn-primary");
        $scope.conseqTypesFilter = [];

//        $scope.conseqTypesFilter = [];
//        $('#conseqTypeMultiSelect').children().children().prop('checked', false);
    };

    //-----------EVENTS---------------

    $scope.reload = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.regions = "20:32850000-32860000";
        $scope.setResult(false);
    };

    $scope.clear = function () {
        $scope.init();
        $scope.setSpecie();
        mySharedService.broadcastVariationsClear();
    };


    $scope.$on('newSpecie', function () {

        if(mySharedService.variantsSpecie.shortName == "hsapiens" || mySharedService.variantsSpecie.shortName == "dmelanogaster"){

            $scope.init();
            $scope.setSpecie();

            if($scope.specie.shortName == "hsapiens"){
                $scope.regions = "20:32850000-32860000";
            }
            if($scope.specie.shortName == "dmelanogaster"){
                $scope.regions = "2L:12850000-12855000";
            }
            if($scope.specie.shortName == "cfamiliaris"){
                $scope.regions = "5:11850000-32950000";
            }

            $scope.setResult(false);

            if(mySharedService.variantsSpecie.shortName == "dmelanogaster"){
                //disable variation tab
                if(!$('#variantsGV').hasClass("disabled")){
                    $('#variantsGV').addClass("disabled");
                }
            }
            else{
                //enable variation tab
                if($('#variantsGV').hasClass("disabled")){
                    $('#variantsGV').removeClass("disabled");
                }
            }

        }

    });

    $scope.$on('variantsNewSpecieGV', function () {
        $scope.init();
        $scope.specie = mySharedService.variantsSpecieGV;
        $scope.chromNames = mySharedService.variantsChromNames;

        if($scope.specie.shortName == "hsapiens"){
            $scope.regions = "13:32889575-32889647";
        }
        if($scope.specie.shortName == "mmusculus"){
            $scope.regions = "1:18421973-18422045";
        }

        $scope.setResult(true);



        $scope.$apply();
//        $scope.setSpecie();
    });
    $scope.$on('variantsConseqTypes', function () {
        $scope.listOfConseqTypes = mySharedService.conseqTypes;
    });

    $scope.$on('variationsGV:regionFromGV', function (ev, event) {

        if(event.sender.species.text == mySharedService.variantsSpecie.longName){
            $scope.specie.longName = event.sender.species.text;
            $scope.regions = event.region.chromosome + ":" + event.region.start + "-" + event.region.end;
            $scope.setResult(true);

            if(!$scope.$$phase) {
                //$digest or $apply
                $scope.$apply();
            }
        }
    });
//    $scope.$on('variantsRegionGV', function () {
//        $scope.specie = mySharedService.variantsSpecieGV;
//        $scope.regions = mySharedService.regionFromGV;
//        $scope.setResult();
//        $scope.$apply();
//    });

    //tabs
    $scope.goToTab = function () {
        $(function () {
            $('#variantsTabs a:first').tab('show')
        })
        $('#variantsTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })
    };

}]);

variantsSelect.$inject = ['$scope', 'mySharedService'];

