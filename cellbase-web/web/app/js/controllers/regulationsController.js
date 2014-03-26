var regulationsContr = regulationsModule.controller('regulationsController', ['$scope', '$rootScope', 'mySharedService', 'CellbaseService','$timeout', function ($scope, $rootScope, mySharedService, CellbaseService,$timeout) {
    $scope.specie = {longName: "Homo sapiens", shortName:"hsapiens", ensemblName: "Homo_sapiens"};
    $scope.chromSelected = [];
    $scope.regions = "3:555-622666";
    $scope.completeRegions = "3:555-622666";
    $scope.featureClassFilter = [];

    $scope.listOfFeatureTypeFilters = [];
    $scope.chromNames = mySharedService.getChromNames();
    $scope.typeOfData = "regulation";
    $scope.featureClassTypes = ["Histone", "Open Chromatin",  "Transcription Factor", "Polymerase", "microRNA" ];

    $scope.toggleTree = []; //array of booleans that will show of hide the elements of the tree
    $scope.regulationsData = []; //$scope.regulationsData = {};

    $scope.showPagination = false;
    $scope.firstPages = false;
    $scope.previousPage = false;
    $scope.nextPage = true;
    $scope.lastPages = true;
    $scope.paginationNumbers = [1, 2, 3];
    $scope.maxNumberPagination;
    $scope.numDataPerPage = 9; //10;
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
        $scope.deselectAllFeatureClassFilter();
        $scope.chromSelected = [];
        $scope.regions = "";
        $scope.listOfFeatureTypeFilters = [];
        $scope.featureClassFilter = [];
    };
    $scope.newResult = function () {
        if($scope.regions!= ""){
            $scope.regions =  mySharedService.removeSpaces($scope.regions);
        }
        if ($scope.featureClassFilter == "" && $scope.chromSelected.length == 0 && $scope.regions == "") {
            alert("No data selected");
        }
        else {
            $scope.completeRegions = $scope.regions;  //por ahora
            $scope.setResult();
        }
    };
    $scope.setSpecie = function(){
        $scope.specie = mySharedService.getCurrentSpecie();
        $scope.chromSelected = [];
        $scope.chromNames = mySharedService.getChromNames();
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
    $scope.addFeatureClassFilter = function (featureClass) {
        var pos = $scope.featureClassFilter.indexOf(featureClass);
        if (pos == -1) {
            $scope.featureClassFilter.push(featureClass);
        }
        else {
            $scope.featureClassFilter.splice(pos, 1);
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
    $scope.selectAllFeatureClassFilter = function () {
        for (var i in $scope.listOfFeatureTypeFilters) {
            $scope.featureClassFilter.push($scope.listOfFeatureTypeFilters[i]);
        }
    };
    $scope.deselectAllFeatureClassFilter = function () {
        $scope.featureClassFilter = [];
    };
    $scope.reload = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.regions = "3:555-622666";
        $scope.chromSelected = [];
        $scope.newResult();
    };
    $scope.clear = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.clearAll();
    };
    $scope.$on('newSpecie', function () {
        if(mySharedService.getCurrentSpecie().shortName == "hsapiens"){
            $scope.init();
            $scope.setSpecie();
            if($scope.specie.shortName == "hsapiens"){
                $scope.regions = "3:555-622666";
            }
            $scope.setResult();
        }
    });
    //========================Pagination==================================
    $scope.goToFirstPage = function () {
        $scope.paginationNumbers[0] = 1;
        $scope.paginationNumbers[1] = 2;
        $scope.paginationNumbers[2] = 3;

        $scope.firstPages = false;
        $scope.previousPage = false;
        $scope.nextPage = true;
        $scope.lastPages = true;

        $scope.disableAndEnablePaginationButtons(1);
        $scope.obtainPaginationLimits(1);
    };
    $scope.goToLastPage = function () {
        $scope.paginationNumbers[0] = $scope.maxNumberPagination - 2;
        $scope.paginationNumbers[1] = $scope.maxNumberPagination - 1;
        $scope.paginationNumbers[2] = $scope.maxNumberPagination;

        $scope.firstPages = true;
        $scope.previousPage = true;
        $scope.nextPage = false;
        $scope.lastPages = false;

        $scope.disableAndEnablePaginationButtons($scope.maxNumberPagination);
        $scope.obtainPaginationLimits($scope.maxNumberPagination);
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
        $scope.disableAndEnablePaginationButtons(page);
        $scope.obtainPaginationLimits(page);
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
        $scope.disableAndEnablePaginationButtons(page);
        $scope.obtainPaginationLimits(page);
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
        $scope.disableAndEnablePaginationButtons(selectedPage);
        $scope.obtainPaginationLimits(selectedPage);
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
        var geneId;

        for (var i = ini; i < ini + $scope.numDataPerPage; i++) {
            if ($scope.regulationsData[i] != null) {
                $scope.paginationData.push($scope.regulationsData[i]);
            }
        }
    };
    $scope.initPagination = function () {
        $scope.paginationData = [];
        $scope.maxNumberPagination = Math.ceil($scope.regulationsData.length / $scope.numDataPerPage);
//        $scope.maxNumberPagination = Math.ceil(Object.keys($scope.regulationsData).length / $scope.numDataPerPage);

        //  0 --> 9
//        if (Object.keys($scope.regulationsData).length <= $scope.numDataPerPage) {
        if ($scope.regulationsData.length <= $scope.numDataPerPage) {
            for (var i in $scope.regulationsData) {
                $scope.paginationData.push($scope.regulationsData[i]);
            }
            $scope.showPagination = false;
        }
        // 10 --> 18
//        else if (Object.keys($scope.regulationsData).length <= ($scope.numDataPerPage * 2)) {
        else if ($scope.regulationsData.length <= ($scope.numDataPerPage * 2)) {
            $scope.simplePagination = true;

            for (var i = 0; i < $scope.numDataPerPage; i++) {
                geneId = Object.keys($scope.regulationsData)[i];
                if (Object.keys($scope.regulationsData)[i] != null) {
                    $scope.paginationData.push($scope.regulationsData[geneId]);
                }
            }
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
        // 19 --> ...
        else {
            $scope.simplePagination = false;

            for (var i = 0; i < $scope.numDataPerPage; i++) {
                if ($scope.regulationsData[i] != null) {
                    $scope.paginationData.push($scope.regulationsData[i]);
                }
            }
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
    $scope.clearAll = function(){
        $scope.showAll = false;
    };
    $scope.setResult = function(){

        $scope.setLoading(true);
        $timeout(function () {

        $scope.showList = true;
        $scope.regulationsData = [];
        var featureClassFilter = [];
        var arrayOfRegulations = [];

        if ($scope.featureClassFilter.length == 0) {
            $scope.regulationsData= CellbaseService.getAllRegulationsData($scope.specie.shortName, $scope.completeRegions, []);
            $scope.separateFeatureClassTypes();
        }
        //not implemented yet in CellBase
//        else{
//            $scope.regulationsData= CellbaseService.getAllRegulationsData($scope.specie.shortName, $scope.completeRegions, $scope.featureClassFilter);
//        }
        $scope.numResults = $scope.regulationsData.length; //$scope.numResults = arrayOfRegulations.length;
        $scope.initPagination();

        if($scope.numResults != 0){
            $scope.toggleTree = [];
            $scope.toggleTree.push(true);

            for(var i=1;i< 5; i++){
                $scope.toggleTree.push(false);
            }
            $scope.showAll = true;
        }
        else{
//            alert("No results with this data");
            $scope.showList = false;
        }

        $scope.setLoading(false);
    }, 300);

    };
    $scope.separateFeatureClassTypes = function () {
        $scope.histone = [];
        $scope.openChromatin = [];
        $scope.transcriptionFactor = [];
        $scope.polymerase = [];
        $scope.microRNA = [];
        $scope.dataNames={};

        $scope.dataNames.histone=[];
        $scope.dataNames.openChromatin=[];
        $scope.dataNames.transcriptionFactor=[];
        $scope.dataNames.polymerase=[];
        $scope.dataNames.microRNA=[];

        $scope.showHistoneNames = true;
        var pos;
        for(var i in $scope.regulationsData){
            if($scope.regulationsData[i].featureClass == "Histone"){
                $scope.histone.push($scope.regulationsData[i]);
                pos = $scope.dataNames.histone.indexOf($scope.regulationsData[i].name);
                if (pos == -1) {
                    $scope.dataNames.histone.push($scope.regulationsData[i].name);
                }
            }
            if($scope.regulationsData[i].featureClass == "Open Chromatin"){
                $scope.openChromatin.push($scope.regulationsData[i]);
                pos = $scope.dataNames.openChromatin.indexOf($scope.regulationsData[i].name);
                if (pos == -1) {
                    $scope.dataNames.openChromatin.push($scope.regulationsData[i].name);
                }
            }
            if($scope.regulationsData[i].featureClass == "Transcription Factor"){
                $scope.transcriptionFactor.push($scope.regulationsData[i]);
                pos = $scope.dataNames.transcriptionFactor.indexOf($scope.regulationsData[i].name);
                if (pos == -1) {
                    $scope.dataNames.transcriptionFactor.push($scope.regulationsData[i].name);
                }
            }
            if($scope.regulationsData[i].featureClass == "Polymerase"){
                $scope.polymerase.push($scope.regulationsData[i]);
                pos = $scope.dataNames.polymerase.indexOf($scope.regulationsData[i].name);
                if (pos == -1) {
                    $scope.dataNames.polymerase.push($scope.regulationsData[i].name);
                }
            }
            if($scope.regulationsData[i].featureClass == "microRNA"){
                $scope.microRNA.push($scope.regulationsData[i]);
                pos = $scope.dataNames.microRNA.indexOf($scope.regulationsData[i].name);
                if (pos == -1) {
                    $scope.dataNames.microRNA.push($scope.regulationsData[i].name);
                }
            }
        }
    };
    //===================== tree events ========================
    //-------------Show Type Info-----------------
    $scope.showHistoneInfo = function () {
        $scope.showTypeData(0,$scope.histone);
    };
    $scope.showOpenChromatinInfo = function () {
        $scope.showTypeData(1,$scope.openChromatin);
    };
    $scope.showTranscriptionFactorInfo = function () {
        $scope.showTypeData(2,$scope.transcriptionFactor);
    };
    $scope.showPolymeraseInfo = function () {
        $scope.showTypeData(3,$scope.polymerase);
    };
    $scope.showMicroRNAInfo = function () {
        $scope.showTypeData(4,$scope.microRNA);
    };
    $scope.showTypeData = function (index, data) {
        if($scope.toggleTree[index]){
            $scope.toggleTree[index] = false;
        }
        else{
            $scope.toggleTree[index] = true;
        }
        $scope.regulationsData = data;
        $scope.initPagination();
    };
    //--------------Show Name Info--------------
    $scope.showHistoneNameInfo = function (name) {
        $scope.showTypeNameData($scope.histone, name);
    };
    $scope.showOpenChromatinNamesInfo = function (name) {
        $scope.showTypeNameData($scope.openChromatin, name);
    };
    $scope.showTranscriptionFactorNamesInfo = function (name) {
        $scope.showTypeNameData($scope.transcriptionFactor, name);
    };
    $scope.showPolymeraseNamesInfo = function (name) {
        $scope.showTypeNameData($scope.polymerase, name);
    };
    $scope.showMicroRNANamesInfo = function (name) {
        $scope.showTypeNameData($scope.microRNA, name);
    };
    $scope.showTypeNameData = function (data, name) {
        $scope.regulationsData = [];
        for (var i in data){
            if(data[i].name == name){
                $scope.regulationsData.push(data[i]);
            }
        }
        $scope.initPagination();
    };
    $scope.expandAllRegulationsTree = function () {
        for (var i in $scope.toggleTree) {
            $scope.toggleTree[i] = true;
        }

    };
    $scope.collapseAllRegulationsTree = function () {
        for (var i in $scope.toggleTree) {
            $scope.toggleTree[i] = false;
        }
    };
    //--------the initial result----------
    $scope.setResult();

    //--------------EVENTS-------------------
    $scope.$on('regulationsClear', function () {
        $scope.clearAll();
    });
}]);

regulationsContr.$inject = ['$scope', 'mySharedService'];
