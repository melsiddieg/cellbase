var variantsContr = variantsModule.controller('variantsController', ['$scope', '$rootScope', 'mySharedService', 'CellbaseService','$timeout', function ($scope, $rootScope, mySharedService, CellbaseService,$timeout) {
    $scope.specie = {longName: "Homo sapiens", shortName:"hsapiens", ensemblName: "Homo_sapiens"};
    $scope.chromSelected = [];
    $scope.regions = "20:32850000-32860000";
    $scope.completeRegions = "20:32850000-32860000";
    $scope.snpIdFilter = "";
    $scope.conseqTypesFilter = [];
    $scope.listOfConseqTypes = [];
    $scope.typeOfData = "variants";
    $scope.chromNames = mySharedService.getChromNames();
    $scope.chromAllData = mySharedService.getChromAllData();
    $scope.toggleTree = [];
    $scope.snpData = {};
    $scope.paginationData = [];
    $scope.firstVariantId = "";
    $scope.showAll = false;
    $scope.showVariantPanel = false;
    $scope.showTranscriptVarPanel = false;

    $scope.showPagination = false;
    $scope.firstPages = false;
    $scope.previousPage = false;
    $scope.nextPage = true;
    $scope.lastPages = true;
    $scope.paginationNumbers = [1, 2, 3];
    $scope.maxNumberPagination;
    $scope.numDataPerPage = 10;
    $scope.showPagination = false;
    $scope.lastPage = 1;
    $scope.disableFirstNumber = true;
    $scope.disableSecondNumber = false;
    $scope.disableThirdNumber = false;
    $scope.showList = true;

    $scope.setLoading = function (loading) {
        $scope.isLoading = loading;
    }
    $scope.init = function(){
        $scope.deselectAllChrom();
        $scope.deselectAllConseqTypeFilter();
        $scope.chromSelected = [];
        $scope.regions = "";
        $scope.snpIdFilter ="";
        $scope.conseqTypesFilter = [];
    };
    $scope.clearAll = function(){
        $scope.showAll = false;
    };
    $scope.clear = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.clearAll();
    };
    $scope.setSpecie = function(){
        $scope.specie = mySharedService.getCurrentSpecie();
        $scope.chromSelected = [];
        $scope.chromNames = mySharedService.getChromNames();
        $scope.chromAllData = mySharedService.getChromAllData();
    };
    $scope.reload = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.regions = "20:32850000-32860000";
        $scope.checkAndSetResult();
        $scope.regions = "20:32850000-32860000";
    };
    $scope.checkAndSetResult = function (fromGV) {
        if($scope.snpIdFilter != ""){
            $scope.snpIdFilter = mySharedService.removeSpaces($scope.snpIdFilter);
        }
        else if($scope.regions!= ""){
            $scope.regions =  mySharedService.removeSpaces($scope.regions);
        }
        if ($scope.snpIdFilter == "" && $scope.conseqTypesFilter.length == 0 && $scope.chromSelected.length == 0 && $scope.regions == "") {
            alert("No data selected");
        }
        else {
            $scope.completeRegions = mySharedService.mergeChromosomesAndRegions($scope.chromSelected, $scope.regions, $scope.chromAllData);
            $scope.setResult(false);
        }
    };
    $scope.setResult = function(fromGV){
        $scope.setLoading(true);
        $timeout(function () {
            $scope.showList = true;
            $scope.paginationData = [];
            $scope.snpDataCache = {};

            if ($scope.snpIdFilter.length != 0) {
                $scope.paginationData = CellbaseService.getVariantsDataById($scope.specie.shortName, $scope.snpIdFilter);  //obtener los datos
                $scope.checkSNPFilter($scope.snpIdFilter);
            }
            else{
                $scope.paginationData = CellbaseService.getAllSNPDataPaginated($scope.specie.shortName, $scope.completeRegions, $scope.conseqTypesFilter,1);
                $scope.snpDataCache[1] = $scope.paginationData;
            }
            if($scope.paginationData.length != 0){
                $scope.initPagination();
                $scope.toggleTree = [];


                for(var i=0;i< 10; i++){
                    $scope.toggleTree.push(false);
                }

                $scope.showAll = true;
                $scope.firstVariantId = $scope.paginationData[0].id;
                $scope.lastDataShow = $scope.firstVariantId;
                $scope.selectedVariant = CellbaseService.getVariantsDataById($scope.specie.shortName, $scope.lastDataShow)[0];
                $scope.showVariant($scope.paginationData[0].id, 0, fromGV);
            }
            else{
                $scope.paginationData = [];
                $scope.showList = false;
                $scope.snpDataSize=0;
            }
            $scope.setLoading(false);

        }, 300);
    };
    $scope.addChrom = function (chrom) {
        var pos = $scope.chromSelected.indexOf(chrom);

        if (pos == -1) {
            $scope.chromSelected.push(chrom);
        }
        else {
            $scope.chromSelected.splice(pos, 1);
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
    };
    $scope.selectAllChrom = function () {
        for (var i in $scope.chromNames) {
            $scope.chromSelected.push($scope.chromNames[i]);
        }
    };
    $scope.deselectAllChrom = function () {
        $scope.chromSelected = [];
    };
    $scope.selectAllConseqTypeFilter = function () {
        for (var i in $scope.listOfConseqTypes) {
            $scope.conseqTypesFilter.push($scope.listOfConseqTypes[i]);
        }
    };
    $scope.deselectAllConseqTypeFilter = function () {
        $scope.conseqTypesFilter = [];
    };
    //========================Pagination==================================
    $scope.obtainPaginationData = function (page){
        $scope.lastPage = page;
        $scope.paginationData = [];
        if(typeof $scope.snpDataCache[page] == "undefined"){
            $scope.paginationData = CellbaseService.getAllSNPDataPaginated($scope.specie.shortName, $scope.completeRegions,$scope.conseqTypesFilter,page);
            $scope.snpDataCache[page] = $scope.paginationData;
        }
        else{
            $scope.paginationData = $scope.snpDataCache[page];
        }
    };
    $scope.goToFirstPage = function () {
        $scope.paginationNumbers[0] = 1;
        $scope.paginationNumbers[1] = 2;
        $scope.paginationNumbers[2] = 3;
        $scope.firstPages = false;
        $scope.previousPage = false;
        $scope.nextPage = true;
        $scope.lastPages = true;
        $scope.collapseAllVariantsTree();
        $scope.disableAndEnablePaginationButtons(1);
        $scope.obtainPaginationData(1);
    };
    $scope.goToLastPage = function () {
        $scope.paginationNumbers[0] = $scope.maxNumberPagination - 2;
        $scope.paginationNumbers[1] = $scope.maxNumberPagination - 1;
        $scope.paginationNumbers[2] = $scope.maxNumberPagination;
        $scope.firstPages = true;
        $scope.previousPage = true;
        $scope.nextPage = false;
        $scope.lastPages = false;
        $scope.collapseAllVariantsTree();
        $scope.disableAndEnablePaginationButtons($scope.maxNumberPagination);
        $scope.obtainPaginationData($scope.maxNumberPagination);
    };
    $scope.goPreviousPage = function () {
        var page = $scope.lastPage - 1;
        $scope.firstPages = true;
        $scope.previousPage = true;
        $scope.nextPage = true;
        $scope.lastPages = true;

        if (page == 1) {
            $scope.firstPages = false;
            $scope.previousPage = false;
            $scope.paginationNumbers[0] = 1;
            $scope.paginationNumbers[1] = 2;
            $scope.paginationNumbers[2] = 3;
        }
        else if ($scope.paginationNumbers[0] != page && $scope.paginationNumbers[1] != page && $scope.paginationNumbers[2] != page) {
            $scope.paginationNumbers[0] = page - 2;
            $scope.paginationNumbers[1] = page - 1;
            $scope.paginationNumbers[2] = page;
        }
        $scope.collapseAllVariantsTree();
        $scope.disableAndEnablePaginationButtons(page);
        $scope.obtainPaginationData(page);
    };
    $scope.goNextPage = function () {
        var page = $scope.lastPage + 1;
        $scope.firstPages = true;
        $scope.previousPage = true;
        $scope.nextPage = true;
        $scope.lastPages = true;
        if (page == $scope.maxNumberPagination) {
            $scope.nextPage = false;
            $scope.lastPages = false;
            $scope.paginationNumbers[0] = page - 2;
            $scope.paginationNumbers[1] = page - 1;
            $scope.paginationNumbers[2] = page;
        }
        else if ($scope.paginationNumbers[0] != page && $scope.paginationNumbers[1] != page && $scope.paginationNumbers[2] != page) {
            $scope.paginationNumbers[0] = page;
            $scope.paginationNumbers[1] = page + 1;
            $scope.paginationNumbers[2] = page + 2;
        }
        $scope.collapseAllVariantsTree();
        $scope.disableAndEnablePaginationButtons(page);
        $scope.obtainPaginationData(page);
    };
    $scope.goToNumberPage = function (selectedPage) {
        if (!$scope.simplePagination) {
            if (selectedPage == $scope.maxNumberPagination) {
                $scope.nextPage = false;
                $scope.lastPages = false;
                $scope.firstPages = true;
                $scope.previousPage = true;
            }
            else if (selectedPage == 1) {
                $scope.firstPages = false;
                $scope.previousPage = false;
                $scope.nextPage = true;
                $scope.lastPages = true;
            }
            else {
                $scope.firstPages = true;
                $scope.previousPage = true;
                $scope.nextPage = true;
                $scope.lastPages = true;
            }
        }
        $scope.collapseAllVariantsTree();
        $scope.disableAndEnablePaginationButtons(selectedPage);
        $scope.obtainPaginationData(selectedPage);
    };
    $scope.disableAndEnablePaginationButtons = function (page) {
        if ($scope.paginationNumbers[0] == page) {
            $scope.disableFirstNumber = true;
            $scope.disableSecondNumber = false;
            $scope.disableThirdNumber = false;
        }
        else if ($scope.paginationNumbers[1] == page) {
            $scope.disableSecondNumber = true;
            $scope.disableFirstNumber = false;
            $scope.disableThirdNumber = false;
        }
        else {
            $scope.disableThirdNumber = true;
            $scope.disableSecondNumber = false;
            $scope.disableFirstNumber = false;
        }
    };
    $scope.obtainPaginationLimits = function (page) {
        $scope.lastPage = page;
        var ini = (page - 1) * $scope.numDataPerPage;
        $scope.paginationData = [];
        var variantId;

        for (var i = ini; i < ini + $scope.numDataPerPage; i++) {
            variantId = Object.keys($scope.snpData)[i];
            if (Object.keys($scope.snpData)[i] != null) {
                $scope.paginationData.push($scope.snpData[variantId]);
            }
        }
    };
    $scope.initPagination = function () {
        $scope.snpDataSize = CellbaseService.getCountSNPData($scope.specie.shortName, $scope.completeRegions, $scope.conseqTypesFilter, $scope.snpIdFilter);
        $scope.maxNumberPagination = Math.ceil( $scope.snpDataSize / $scope.numDataPerPage);
        //  0 --> 10
        if ( $scope.snpDataSize <= $scope.numDataPerPage) {

            $scope.showPagination = false;
        }
        // 11 --> 20
        else if ( $scope.snpDataSize  <= ($scope.numDataPerPage * 2)) {
            $scope.simplePagination = true;

            $scope.showPagination = true;
            $scope.lastPage = 1;
            $scope.disableFirstNumber = true;
            $scope.disableSecondNumber = false;
            $scope.disableThirdNumber = false;
            $scope.firstPages = false;
            $scope.previousPage = false;
            $scope.nextPage = false;
            $scope.lastPages = false;
            $scope.thirdNumber = false;
            $scope.paginationNumbers = [1, 2];
        }
        // 21 --> ...
        else {
            $scope.simplePagination = false;
            var variantId;

            $scope.firstPages = false;
            $scope.previousPage = false;
            $scope.nextPage = true;
            $scope.lastPages = true;
            $scope.thirdNumber = true;
            $scope.paginationNumbers = [1, 2, 3];
            $scope.showPagination = true;
            $scope.lastPage = 1;
            $scope.disableFirstNumber = true;
            $scope.disableSecondNumber = false;
            $scope.disableThirdNumber = false;
        }
    };
    //save thee correct results and alert the incorrect
    $scope.checkSNPFilter = function(snpFilter){
        var snpIdError = [];
        var snpFilters =  $scope.snpIdFilter.split(",");
        var error = false;

        for(var i in snpFilter){
            if(snpFilter[i] == undefined){
                snpIdError.push(snpFilters[i]);
                error = true
            }
            else{
                $scope.snpData[snpFilter[i].id] = (snpFilter[i]);
            }
        }
        if(error){
            var messageError = "";
            if(snpIdError.length != 0){
                messageError = snpIdError[0];
                for(var i=1;i<snpIdError.length;i++){
                    messageError = messageError + ", " + snpIdError[i];
                }
            }
            messageError = messageError + " incorrect";
            alert(messageError);
        }
    };
    //===================== Tree events ========================
    $scope.showVariant = function (variantId, index, fromGV){
        if($scope.toggleTree[index]){
            $scope.toggleTree[index] = false;
        }
        else{
            $scope.toggleTree[index] = true;
        }
        $scope.showSelectedVariant(variantId,fromGV);

        if($scope.selectedVariant.transcriptVariations.length != 0){
            $scope.showSelectedTranscriptVar(variantId,$scope.selectedVariant.transcriptVariations[0].transcriptId, fromGV);
        }
    };
    $scope.showTranscriptVar = function (variantId, transcriptId) {
        $scope.showSelectedVariant(variantId, false);
        $scope.showSelectedTranscriptVar(variantId, transcriptId);
    };
    $scope.showSelectedVariant = function (variantId, fromGV) {
        if ($scope.lastDataShow != variantId) {
            $scope.lastDataShow = variantId;
            $scope.showVariantPanel = true;

            $scope.selectedVariant = CellbaseService.getVariantsDataById($scope.specie.shortName, variantId)[0];
            $scope.showTranscriptVarPanel = false;
        }
        else {
            if (!$scope.showVariantPanel) {
                $scope.showVariantPanel = true;
            }
        }
        $scope.selectedTranscriptVar = $scope.selectedVariant.transcriptVariations;
        if($('#variants_GV').hasClass("active")&& !fromGV){
            $rootScope.$broadcast("variationsGV:regionToGV", $scope.selectedVariant.chromosome + ":" + $scope.selectedVariant.start + "-" + $scope.selectedVariant.end,$scope.specie.shortName);
        }
    };
    $scope.showSelectedTranscriptVar = function (variantId, transcriptId, fromGV) {
        var transcripts;
        if ($scope.lastDataShow != variantId) {
            $scope.lastDataShow = variantId;
            $scope.showVariantPanel = false;
            $scope.selectedVariant = CellbaseService.getVariantsDataById($scope.specie.shortName, variantId)[0];
        }
        $scope.showTranscriptVarPanel = true;
        for (var i in  $scope.selectedVariant.transcriptVariations) {
            if ($scope.selectedVariant.transcriptVariations[i].transcriptId == transcriptId) {
                $scope.selectedTranscriptVar = $scope.selectedVariant.transcriptVariations[i];
            }
        }
        if($('#variants_GV').hasClass("active")&& !fromGV) {
            $rootScope.$broadcast("variationsGV:regionToGV", $scope.selectedVariant.chromosome + ":" + $scope.selectedVariant.start + "-" + $scope.selectedVariant.end, $scope.specie.shortName);
        }
    };
    //show transcripts panel from transcripts table
    $scope.showTanscriptVarFromTable = function (transcriptVarId) {
        for (var i in $scope.selectedVariant.transcriptVariations) {
            if ($scope.selectedVariant.transcriptVariations[i].transcriptId == transcriptVarId) {
                $scope.selectedTranscriptVar = $scope.selectedVariant.transcriptVariations[i];
            }
        }
        $scope.transcriptVarInfo = false;
        $scope.showTranscriptVarPanel = true;
    };
    $scope.expandAllVariantsTree = function () {
        for(var i in $scope.toggleTree){
            $scope.toggleTree[i] = true;
        }
    };
    $scope.collapseAllVariantsTree = function () {
        for(var i in $scope.toggleTree){
            $scope.toggleTree[i] = false;
        }
    };
    $scope.obtainConsequenceTypes = function () {
        $scope.listOfConseqTypes = CellbaseService.getConsequenceTypes($scope.specie.shortName);
    };
    //  --------------download functions-------------------
    $scope.convertToTabulate=function(info){
        return mySharedService.convertToTabulate(info);
    };
    //-----------EVENTS---------------
    $scope.$on('newSpecie', function () {
        if(mySharedService.getCurrentSpecie().shortName == "hsapiens" || mySharedService.getCurrentSpecie().shortName == "dmelanogaster"){
            $scope.init();
            $scope.setSpecie();

            if($scope.specie.shortName == "hsapiens"){
                $scope.completeRegions = "20:32850000-32860000";
            }
            if($scope.specie.shortName == "dmelanogaster"){
                $scope.completeRegions = "2L:12850000-12855000";
            }
            $scope.setResult(false);
        }
    });
    $scope.$on('variationsGV:regionFromGV', function (ev, event) {
        if(typeof event.sender.species != "undefined" && event.sender.species.text == $scope.specie.longName){
            $scope.specie.longName = event.sender.species.text;
            $scope.completeRegions = event.region.chromosome + ":" + event.region.start + "-" + event.region.end;
            $scope.regions = $scope.completeRegions;
            $scope.setResult(true);

            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }
    });
    $scope.setResult(false);
    $scope.obtainConsequenceTypes();
}]);

variantsContr.$inject = ['$scope', 'mySharedService'];