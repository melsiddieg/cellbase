var genesSelect = genesModule.controller('genesSelect', ['$scope', '$rootScope', 'mySharedService', 'CellbaseService', function ($scope, $rootScope, mySharedService, CellbaseService) {

    $scope.specie = mySharedService.genesSpecie;
    $scope.chromSelected = [];
    $scope.regions = "20:32850000-33500000, 2:12850000-13120000";
    $scope.listOfbiotypeFilters =  CellbaseService.getBiotypes(mySharedService.genesSpecie.shortName);
    $scope.genesIdFilter = "";
    $scope.biotypesFilter = [];
    $scope.chromNames = mySharedService.chromNames;
    $scope.typeOfData = "genes";

    $scope.init = function(){
        $scope.deselectAllChrom();
        $scope.deselectAllBiotypeFilter();
        $scope.chromSelected = [];
        $scope.regions = "";
        $scope.listOfbiotypeFilters = [];
        $scope.genesIdFilter ="";
        $scope.biotypeFilters = [];
    };
    //comunicate that a is a new result
    $scope.setResult = function (fromGV) {
        mySharedService.broadcastGenesNewResult( $scope.chromSelected, $scope.regions, $scope.genesIdFilter, $scope.biotypesFilter, fromGV);
    };
    $scope.setSpecie = function(){
        $scope.specie = mySharedService.genesSpecie;
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
        if($('#genes'+chrom).hasClass("btn-primary")){
            $('#genes'+chrom).removeClass("btn-primary");
        }
        else{
            $('#genes'+chrom).addClass("btn-primary");
        }
    };

    $scope.addBiotypeFilter = function (biotype) {
        var pos = $scope.biotypesFilter.indexOf(biotype);

        if (pos == -1) {
            $scope.biotypesFilter.push(biotype);
        }
        else {
            $scope.biotypesFilter.splice(pos, 1);
        }

        if($('#'+biotype).hasClass("btn-primary")){
            $('#'+biotype).removeClass("btn-primary");
        }
        else{
            $('#'+biotype).addClass("btn-primary");
        }
    };

    $scope.selectAllChrom = function () {
        $('#genesChromMultiSelect').children().addClass("btn-primary");
        for (var i in $scope.chromNames) {
            $scope.chromSelected.push($scope.chromNames[i]);
        }
    };
    $scope.deselectAllChrom = function () {
        $('#genesChromMultiSelect').children().removeClass("btn-primary");
        $scope.chromSelected = [];
    };
    $scope.selectAllBiotypeFilter = function () {
        $('#BiotypesMultiSelect').children().addClass("btn-primary");
        for (var i in $scope.listOfbiotypeFilters) {
            $scope.biotypesFilter.push($scope.listOfbiotypeFilters[i]);
        }
    };
    $scope.deselectAllBiotypeFilter = function () {
        $('#BiotypesMultiSelect').children().removeClass("btn-primary");
        $scope.biotypesFilter = [];
    };

    //-----------EVENTS---------------
    $scope.reload = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.regions = "20:32850000-33500000,2:12850000-13120000";
//        $scope.chromSelected = ["2","20"];

        var chromDiv = $('#genesChromMultiSelect').children().children();
        $scope.setResult(false);
    };

    $scope.clear = function () {
        $scope.init();
        $scope.setSpecie();
        mySharedService.broadcastGenesClear();
    };

    $scope.$on('newSpecie', function () {
        $scope.init();
        $scope.setSpecie();

        if($scope.specie.shortName == "hsapiens"){
            $scope.regions = "20:32850000-33500000";
        }
        if($scope.specie.shortName == "mmusculus"){
            $scope.regions = "2:32850000-33500000";
        }
        if($scope.specie.shortName == "rnorvegicus"){
            $scope.regions = "6:32850000-33500000";
        }
        if($scope.specie.shortName == "drerio"){
            $scope.regions = "1:32850000-33500000";
        }
        if($scope.specie.shortName == "dmelanogaster"){
            $scope.regions = "2L:12850000-13500000";
        }
        if($scope.specie.shortName == "celegans"){
            $scope.regions = "V:12850000-13500000";
        }
        if($scope.specie.shortName == "scerevisiae"){
            $scope.regions = "III:286620-316620";
        }
        if($scope.specie.shortName == "cfamiliaris"){
            $scope.regions = "5:32850000-33500000";
        }
        if($scope.specie.shortName == "sscrofa"){
            $scope.regions = "3:32850000-33500000";
        }
        if($scope.specie.shortName == "agambiae"){
            $scope.regions = "2L:32850000-33500000";
        }
        if($scope.specie.shortName == "pfalciparum"){
            $scope.regions = "11:1938337-2038337";
        }
        $scope.setResult(false);
    });

    $scope.$on('genesNewSpecieGV', function () {
        $scope.init();
        $scope.specie = mySharedService.genesSpecieGV;
        $scope.chromNames = mySharedService.genesChromNames;

        if($scope.specie.shortName == "hsapiens"){
            $scope.regions = "13:32889575-32889647";
        }
        if($scope.specie.shortName == "mmusculus"){
            $scope.regions = "1:18421973-18422045";
        }
        $scope.setResult(true);
        if(!$scope.$$phase) {
            //$digest or $apply
            $scope.$apply();
        }
    });

    $scope.$on('genesGV:regionFromGV', function (ev, event) {
        if(event.sender.species.text == mySharedService.genesSpecie.longName){
            $scope.specie.longName = event.sender.species.text;
            $scope.regions = event.region.chromosome + ":" + event.region.start + "-" + event.region.end;
            $scope.setResult(true);

            if(!$scope.$$phase) {
                //$digest or $apply
                $scope.$apply();
            }
        }
    });
    //tabs
    $scope.goToTab = function () {
        $(function () {
            $('#genesTabs a:first').tab('show')
        })
        $('#genesTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })
    };
}]);

genesSelect.$inject = ['$scope', 'mySharedService'];

