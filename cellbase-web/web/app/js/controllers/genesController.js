var genesContr = genesModule.controller('genesController', ['$scope', '$rootScope', 'mySharedService', 'CellbaseService', '$timeout', function ($scope, $rootScope, mySharedService, CellbaseService, $timeout) {

    $scope.specie = {longName: "Homo sapiens", shortName: "hsapiens", ensemblName: "Homo_sapiens"};
    $scope.chromSelected = [];
    $scope.regions = "20:32850000-33500000, 2:12850000-13120000";
    $scope.completeRegions = "20:32850000-33500000,2:12850000-13120000";
    $scope.genesIdFilter = "";
    $scope.biotypesFilter = [];

    $scope.chromNames = mySharedService.getChromNames();
    $scope.listOfbiotypeFilters = CellbaseService.getBiotypes($scope.specie.shortName);
    $scope.typeOfData = "genes";

    $scope.toggleTree = [];
    $scope.genesAndTranscriptsData = {};
    $scope.paginationData = [];

    $scope.firstGeneId = "";
    $scope.showAll = true;
    $scope.showGenePanel = false;
    $scope.showTranscriptPanel = false;

    $scope.showList = true;


//    ------------------------------------------
    $scope.setLoading = function (loading) {
        $scope.isLoading = loading;
    }
//    $scope.loadFeed = function() {
//        $scope.setLoading(true);
//    }
//
//    $scope.loadFeed();
//    $scope.setLoading(true);
//    ------------------------------------------


//    $scope.showPagination = false;
//    $scope.firstPages = false;
//    $scope.previousPage = false;
//    $scope.nextPage = true;
//    $scope.lastPages = true;
//    $scope.paginationNumbers = [1, 2, 3];
//    $scope.maxNumberPagination;
//    $scope.numDataPerPage = 10;
//    $scope.showPagination = false;
//    $scope.lastPage = 1;
//    $scope.disableFirstNumber = true;
//    $scope.disableSecondNumber = false;
//    $scope.disableThirdNumber = false;

    $scope.init = function () {
        $scope.deselectAllChrom();
        $scope.deselectAllBiotypeFilter();
        $scope.chromSelected = [];
        $scope.regions = "";
        $scope.genesIdFilter = "";
        $scope.biotypesFilter = [];
    };

    $scope.clearResults = function () {
        $scope.init();
        $scope.clearAll();
    };

    $scope.setSpecie = function () {
        $scope.specie = mySharedService.getCurrentSpecie();
        $scope.chromSelected = [];
        $scope.regions = "";
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
        if ($('#genes' + chrom).hasClass("btn-primary")) {
            $('#genes' + chrom).removeClass("btn-primary");
        }
        else {
            $('#genes' + chrom).addClass("btn-primary");
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
        if ($('#' + biotype).hasClass("btn-primary")) {
            $('#' + biotype).removeClass("btn-primary");
        }
        else {
            $('#' + biotype).addClass("btn-primary");
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
    $scope.reload = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.regions = "20:32850000-33500000,2:12850000-13120000";
        $scope.newResult();
    };
    //---------------events-------------------
    $scope.$on('newSpecie', function () {
        $scope.init();
        $scope.setSpecie();
        $scope.listOfbiotypeFilters = CellbaseService.getBiotypes($scope.specie.shortName);
        if ($scope.specie.shortName == "hsapiens") {
            $scope.regions = "20:32850000-33500000";
        }
        if ($scope.specie.shortName == "mmusculus") {
            $scope.regions = "2:32850000-33500000";
        }
        if ($scope.specie.shortName == "rnorvegicus") {
            $scope.regions = "6:32850000-33500000";
        }
        if ($scope.specie.shortName == "drerio") {
            $scope.regions = "1:32850000-33500000";
        }
        if ($scope.specie.shortName == "dmelanogaster") {
            $scope.regions = "2L:12850000-13500000";
        }
        if ($scope.specie.shortName == "celegans") {
            $scope.regions = "V:12850000-13500000";
        }
        if ($scope.specie.shortName == "scerevisiae") {
            $scope.regions = "III:286620-316620";
        }
        if ($scope.specie.shortName == "cfamiliaris") {
            $scope.regions = "5:32850000-33500000";
        }
        if ($scope.specie.shortName == "sscrofa") {
            $scope.regions = "3:32850000-33500000";
        }
        if ($scope.specie.shortName == "agambiae") {
            $scope.regions = "2L:32850000-33500000";
        }
        if ($scope.specie.shortName == "pfalciparum") {
            $scope.regions = "11:1938337-2038337";
        }
        $scope.setResult(false);
    });
    $scope.$on('genesGV:regionFromGV', function (ev, event) {
        if (event.sender.species.text == $scope.specie.longName) {
            $scope.specie.longName = event.sender.species.text;
            $scope.completeRegions = event.region.chromosome + ":" + event.region.start + "-" + event.region.end;
            $scope.setResult(true);
            if (!$scope.$$phase) {
                //$digest or $apply
                $scope.$apply();
            }
        }
    });
    $scope.$on('genesPagination:updatePaginationData', function (ev, data) {
        $scope.paginationData = data;
    });
    $scope.$on('genesPagination:collapseTreeElements', function (ev, data) {
        $scope.collapseAllGenesTree();
    });
    //========================Pagination==================================
//    $scope.goToFirstPage = function () {
//        $scope.paginationNumbers[0] = 1;
//        $scope.paginationNumbers[1] = 2;
//        $scope.paginationNumbers[2] = 3;
//        $scope.firstPages = false;
//        $scope.previousPage = false;
//        $scope.nextPage = true;
//        $scope.lastPages = true;
//        $scope.collapseAllGenesTree();
//        $scope.disableAndEnablePaginationButtons(1);
//        $scope.obtainPaginationLimits(1);
//    };
//    $scope.goToLastPage = function () {
//        $scope.paginationNumbers[0] = $scope.maxNumberPagination - 2;
//        $scope.paginationNumbers[1] = $scope.maxNumberPagination - 1;
//        $scope.paginationNumbers[2] = $scope.maxNumberPagination;
//        $scope.firstPages = true;
//        $scope.previousPage = true;
//        $scope.nextPage = false;
//        $scope.lastPages = false;
//        $scope.collapseAllGenesTree();
//        $scope.disableAndEnablePaginationButtons($scope.maxNumberPagination);
//        $scope.obtainPaginationLimits($scope.maxNumberPagination);
//    };
//    $scope.goPreviousPage = function () {
//        var page = $scope.lastPage - 1;
//        $scope.firstPages = true;
//        $scope.previousPage = true;
//        $scope.nextPage = true;
//        $scope.lastPages = true;
//
//        if (page == 1) {
//            $scope.firstPages = false;
//            $scope.previousPage = false;
//            $scope.paginationNumbers[0] = 1;
//            $scope.paginationNumbers[1] = 2;
//            $scope.paginationNumbers[2] = 3;
//        }
//        else if ($scope.paginationNumbers[0] != page && $scope.paginationNumbers[1] != page && $scope.paginationNumbers[2] != page) {
//            $scope.paginationNumbers[0] = page - 2;
//            $scope.paginationNumbers[1] = page - 1;
//            $scope.paginationNumbers[2] = page;
//        }
//        $scope.collapseAllGenesTree();
//        $scope.disableAndEnablePaginationButtons(page);
//        $scope.obtainPaginationLimits(page);
//    };
//    $scope.goNextPage = function () {
//        var page = $scope.lastPage + 1;
//        $scope.firstPages = true;
//        $scope.previousPage = true;
//        $scope.nextPage = true;
//        $scope.lastPages = true;
//
//        if (page == $scope.maxNumberPagination) {
//            $scope.nextPage = false;
//            $scope.lastPages = false;
//            $scope.paginationNumbers[0] = page - 2;
//            $scope.paginationNumbers[1] = page - 1;
//            $scope.paginationNumbers[2] = page;
//        }
//        else if ($scope.paginationNumbers[0] != page && $scope.paginationNumbers[1] != page && $scope.paginationNumbers[2] != page) {
//            $scope.paginationNumbers[0] = page;
//            $scope.paginationNumbers[1] = page + 1;
//            $scope.paginationNumbers[2] = page + 2;
//        }
//        $scope.collapseAllGenesTree();
//        $scope.disableAndEnablePaginationButtons(page);
//        $scope.obtainPaginationLimits(page);
//    };
//    $scope.goToNumberPage = function (selectedPage) {
//        if (!$scope.simplePagination) {
//            if (selectedPage == $scope.maxNumberPagination) {
//                $scope.nextPage = false;
//                $scope.lastPages = false;
//                $scope.firstPages = true;
//                $scope.previousPage = true;
//            }
//            else if (selectedPage == 1) {
//                $scope.firstPages = false;
//                $scope.previousPage = false;
//                $scope.nextPage = true;
//                $scope.lastPages = true;
//            }
//            else {
//                $scope.firstPages = true;
//                $scope.previousPage = true;
//                $scope.nextPage = true;
//                $scope.lastPages = true;
//            }
//        }
//        $scope.collapseAllGenesTree();
//        $scope.disableAndEnablePaginationButtons(selectedPage);
//        $scope.obtainPaginationLimits(selectedPage);
//    };
//    $scope.disableAndEnablePaginationButtons = function (page) {
//        if ($scope.paginationNumbers[0] == page) {
//            $scope.disableFirstNumber = true;
//            $scope.disableSecondNumber = false;
//            $scope.disableThirdNumber = false;
//        }
//        else if ($scope.paginationNumbers[1] == page) {
//            $scope.disableSecondNumber = true;
//            $scope.disableFirstNumber = false;
//            $scope.disableThirdNumber = false;
//        }
//        else {
//            $scope.disableThirdNumber = true;
//            $scope.disableSecondNumber = false;
//            $scope.disableFirstNumber = false;
//        }
//    };
//    $scope.obtainPaginationLimits = function (page) {
//        $scope.lastPage = page;
//        var ini = (page - 1) * $scope.numDataPerPage;
//        $scope.paginationData = [];
//        var geneId;
//        for (var i = ini; i < ini + $scope.numDataPerPage; i++) {
//            geneId = Object.keys($scope.genesAndTranscriptsData)[i];
//            if (Object.keys($scope.genesAndTranscriptsData)[i] != null) {
//                $scope.paginationData.push($scope.genesAndTranscriptsData[geneId]);
//            }
//        }
//    };
//    $scope.initPagination = function () {
//        $scope.paginationData = [];
//        $scope.maxNumberPagination = Math.ceil(Object.keys($scope.genesAndTranscriptsData).length / $scope.numDataPerPage);
//
//        //  0 --> 10
//        if (Object.keys($scope.genesAndTranscriptsData).length <= $scope.numDataPerPage) {
//            for (var i in $scope.genesAndTranscriptsData) {
//                $scope.paginationData.push($scope.genesAndTranscriptsData[i]);
//            }
//            $scope.showPagination = false;
//        }
//        // 11 --> 20
//        else if (Object.keys($scope.genesAndTranscriptsData).length <= ($scope.numDataPerPage * 2)) {
//            $scope.simplePagination = true;
//            for (var i = 0; i < $scope.numDataPerPage; i++) {
//                geneId = Object.keys($scope.genesAndTranscriptsData)[i];
//                if (Object.keys($scope.genesAndTranscriptsData)[i] != null) {
//                    $scope.paginationData.push($scope.genesAndTranscriptsData[geneId]);
//                }
//            }
//            $scope.showPagination = true;
//            $scope.lastPage = 1;
//
//            $scope.disableFirstNumber = true;
//            $scope.disableSecondNumber = false;
//            $scope.disableThirdNumber = false;
//
//            $scope.firstPages = false;
//            $scope.previousPage = false;
//            $scope.nextPage = false;
//            $scope.lastPages = false;
//
//            $scope.thirdNumber = false;
//            $scope.paginationNumbers = [1, 2];
//        }
//        // 21 --> ...
//        else {
//            $scope.simplePagination = false;
//            var geneId;
//
//            for (var i = 0; i < $scope.numDataPerPage; i++) {
//                geneId = Object.keys($scope.genesAndTranscriptsData)[i];
//                if (Object.keys($scope.genesAndTranscriptsData)[i] != null) {
//                    $scope.paginationData.push($scope.genesAndTranscriptsData[geneId]);
//                }
//            }
//            $scope.firstPages = false;
//            $scope.previousPage = false;
//            $scope.nextPage = true;
//            $scope.lastPages = true;
//
//            $scope.thirdNumber = true;
//            $scope.paginationNumbers = [1, 2, 3];
//            $scope.showPagination = true;
//            $scope.lastPage = 1;
//
//            $scope.disableFirstNumber = true;
//            $scope.disableSecondNumber = false;
//            $scope.disableThirdNumber = false;
//        }
//    };
    $scope.clearAll = function () {
        $scope.showAll = false;
    };
    $scope.clear = function () {
        $scope.showGenePanel = false;
        $scope.showTranscriptPanel = false;
    };
    $scope.loader = false;


    $scope.newResult = function () {

        if ($scope.genesIdFilter != "") {
            $scope.genesIdFilter = mySharedService.removeSpaces($scope.genesIdFilter);
        }
        else if ($scope.regions != "") {
            $scope.regions = mySharedService.removeSpaces($scope.regions);
        }
        if ($scope.genesIdFilter == "" && $scope.biotypesFilter.length == 0 && $scope.chromSelected.length == 0 && $scope.regions == "") {
            alert("No data selected");
        }
        else {
            $scope.completeRegions = mySharedService.mergeChromosomesAndRegions($scope.chromSelected, $scope.regions, mySharedService.getChromAllData());
            $scope.setResult(false);
        }
    };
    $scope.setResult = function (fromGV) {
        $scope.setLoading(true);
        $timeout(function () {
            $scope.showList = true;
            $scope.genesAndTranscriptsData = {};
            var genesIdFilter = [];
            var arrayOfGenes = [];
            //check if there are filters
            if ($scope.biotypesFilter.length != 0) {
                arrayOfGenes = CellbaseService.getGenesAndTranscripts($scope.specie.shortName, $scope.completeRegions, $scope.biotypesFilter);
                for (var i in arrayOfGenes) {
                    $scope.genesAndTranscriptsData[arrayOfGenes[i].id] = arrayOfGenes[i];
                }
            }
            if ($scope.genesIdFilter.length != 0) {
                genesIdFilter = CellbaseService.getGenesAndTranscriptsByIdOrName($scope.specie.shortName, $scope.genesIdFilter);  //obtener los datos
                $scope.checkGeneFilter(genesIdFilter);
            }
            //if there aren't any filters, show all genes data
            if ($scope.biotypesFilter.length == 0 && $scope.genesIdFilter.length == 0) {
                arrayOfGenes = CellbaseService.getGenesAndTranscripts($scope.specie.shortName, $scope.completeRegions, []);
                //save the data in a hash table
                for (var i in arrayOfGenes) {
                    $scope.genesAndTranscriptsData[arrayOfGenes[i].id] = arrayOfGenes[i];
                }
            }
            $scope.numResults = Object.keys($scope.genesAndTranscriptsData).length;
            $rootScope.$broadcast('genesPagination:initPagination', $scope.genesAndTranscriptsData);
//         $scope.initPagination();
            $scope.clear();
            if ($scope.numResults != 0) {
                $scope.toggleTree = [];
                for (var i = 0; i < 10; i++) {
                    $scope.toggleTree.push(false);
                }
                $scope.showAll = true;
                $scope.firstGeneId = arrayOfGenes;
                $scope.lastDataShow = Object.keys($scope.genesAndTranscriptsData)[0];
                $scope.selectedGene = CellbaseService.getGenesAllDataById($scope.specie.shortName, $scope.lastDataShow);
                //show the informtion of the first gen
                $scope.showGene(Object.keys($scope.genesAndTranscriptsData)[0], 0, fromGV);
                if ($scope.selectedGene.transcripts.length != 0) {
                    $scope.showTranscriptPanel = true;
                    $scope.selectedTranscript = $scope.selectedGene.transcripts[0];
                }
            }
            else {
                $rootScope.$broadcast("genesPagination:initData");
                $scope.showList = false;
//             $scope.paginationData = [];


            }

            $scope.setLoading(false);
        }, 300);

    };
    //save the correct results and alert the incorrect
    $scope.checkGeneFilter = function (genesIdFilter) {
        var genesIdError = [];
        var genesFilters = $scope.genesIdFilter.split(",");
        var error = false;
        for (var i in genesFilters) {
            if (genesIdFilter[i] == undefined) {
                genesIdError.push(genesFilters[i]);
                error = true
            }
            else {
                $scope.genesAndTranscriptsData[genesIdFilter[i].id] = genesIdFilter[i];
            }
        }
        if (error) {
            var messageError = "";
            if (genesIdError.length != 0) {
                messageError = genesIdError[0];
                for (var i = 1; i < genesIdError.length; i++) {
                    messageError = messageError + ", " + genesIdError[i];
                }
            }
            messageError = messageError + " incorrect";
            alert(messageError);
        }
    };
    //===================== Tree events ========================
    $scope.showGene = function (geneId, index, fromGV) {
        if ($scope.toggleTree[index]) {
            $scope.toggleTree[index] = false;
        }
        else {
            $scope.toggleTree[index] = true;
        }
        $scope.showSelectedGene(geneId, fromGV);
        if ($scope.selectedGene.transcripts.length != 0) {
            $scope.showSelectedTranscript(geneId, $scope.selectedGene.transcripts[0].name, fromGV);
        }
    };
    $scope.showTranscript = function (geneId, transcriptName) {
        $scope.showSelectedTranscript(geneId, transcriptName, false);
        $scope.showSelectedGene(geneId, false);
    };
    $scope.showSelectedGene = function (geneId, fromGV) {
        if ($scope.lastDataShow != geneId) {
            $scope.lastDataShow = geneId;
            $scope.showGenePanel = true;
            $scope.selectedGene = CellbaseService.getGenesAllDataById($scope.specie.shortName, geneId);
            $scope.showTranscriptPanel = false;
        }
        else {
            if (!$scope.showGenePanel) {
                $scope.showGenePanel = true;
            }
        }
        $scope.selectedTranscripts = $scope.selectedGene.transcripts;
        if ($('#genes_GV').hasClass("active") && !fromGV) {
            $rootScope.$broadcast("genesGV:regionToGV", $scope.selectedGene.chromosome + ":" + $scope.selectedGene.start + "-" + $scope.selectedGene.end, $scope.specie.shortName);
        }
        if ($('#genesNVtab').hasClass("active")) {

            $scope.setLoading(true);
            $timeout(function () {
                $scope.proteinsAllData = CellbaseService.getProteinsLinks($scope.specie.shortName, $scope.selectedGene.name);
                $scope.geneProteinId = "";
                $scope.proteinsIdLinks = [];
                if ($scope.proteinsAllData.length != 0) {
                    if ($scope.proteinsAllData[0].interactorA.id == $scope.proteinsAllData[1].interactorA.id || $scope.proteinsAllData[0].interactorA.id == $scope.proteinsAllData[1].interactorB.id) {
                        $scope.geneProteinId = $scope.proteinsAllData[0].interactorA.id;
                    }
                    else {
                        $scope.geneProteinId = $scope.proteinsAllData[0].interactorB.id;
                    }
                    for (var i in $scope.proteinsAllData) {
                        if ($scope.proteinsAllData[i].interactorA.id != $scope.geneProteinId) {
                            $scope.proteinsIdLinks.push($scope.proteinsAllData[i].interactorA.id);
                        }
                        else {
                            $scope.proteinsIdLinks.push($scope.proteinsAllData[i].interactorB.id);
                        }
                    }
                    $rootScope.$broadcast("genesNV:createStarGraph", $scope.geneProteinId, $scope.proteinsIdLinks);
                }
                else {
                    $rootScope.$broadcast("genesNV:clear");
                }

                $scope.setLoading(false);
            }, 900);


        }
    };
    //show transcripts panel
    $scope.showSelectedTranscript = function (geneId, transcriptName, fromGV) {
        var transcripts;
        if ($scope.lastDataShow != geneId) {
            $scope.lastDataShow = geneId;
            $scope.showGenePanel = false;
            $scope.selectedGene = CellbaseService.getGenesAllDataById($scope.specie.shortName, geneId);
        }
        $scope.showTranscriptPanel = true;
        transcripts = $scope.selectedGene.transcripts;
        for (var i in transcripts) {
            if (transcripts[i].name == transcriptName) {
                $scope.selectedTranscript = transcripts[i];
            }
        }
        if ($('#genes_GV').hasClass("active") && !fromGV) {
            $rootScope.$broadcast("genesGV:regionToGV", $scope.selectedTranscript.chromosome + ":" + $scope.selectedTranscript.start + "-" + $scope.selectedTranscript.end, $scope.specie.shortName);
        }
    };
    //show transcripts panel from transcripts table
    $scope.showTanscriptFromTable = function (transcriptName) {
        var transcripts = $scope.selectedGene.transcripts;
        for (var i in transcripts) {
            if (transcripts[i].name == transcriptName) {
                $scope.selectedTranscript = transcripts[i];
            }
        }
        $scope.transcriptInfo = false;
        $scope.showTranscriptPanel = true;
    };
    $scope.expandAllGenesTree = function () {
        for (var i in $scope.toggleTree) {
            $scope.toggleTree[i] = true;
        }
    };
    $scope.collapseAllGenesTree = function () {
        for (var i in $scope.toggleTree) {
            $scope.toggleTree[i] = false;
        }
    };
    //--------------Download functions-------------------
    $scope.downloadGeneAsJSON = function () {
        var info = $scope.selectedGene;
        delete info.transcripts;
        $scope.downloadAsJSON(info, "gene-" + info.id);
    };
    $scope.downloadTranscriptAsJSON = function () {
        var info = $scope.selectedTranscript;
        delete info.exons;
        delete info.xrefs;
        delete info.tfbs;
        $scope.downloadAsJSON(info, "gene-" + $scope.selectedGene.id + "transc-" + info.id);
    };
    $scope.downloadAsJSON = function (info, title) {
        var str = JSON.stringify(info);
        var a = $('<a></a>')[0];
        $(a).attr('href', 'data:application/json,' + encodeURIComponent(str));
        $(a).attr('download', title + 'json');
        a.click();
    };
    $scope.downloadGeneTabulated = function () {
        var info = $scope.selectedGene;
        delete info.transcripts;
        $scope.downloadTabulated(info, "gene-" + info.id);
    };
    $scope.downloadTranscriptTabulated = function () {
        var info = $scope.selectedTranscript;
        delete info.exons;
        delete info.xrefs;
        delete info.tfbs;
        $scope.downloadTabulated(info, "gene-" + $scope.selectedGene.id + "transc-" + info.id);
    };
    $scope.convertToTabulate = function (info) {
        var max_sep = 0;
        var j = 0;
        var max = Object.keys(info).length;
        var attrValueLength = 0;
        var str = "";

        for (var attr in info) {
            if (j != Object.keys(info).length - 1) {
                str = str + attr + "   ";
                if (isNaN(info[attr])) {
                    attrValueLength = info[attr].length;
                }
                else {
                    attrValueLength = info[attr].toString().length;
                }
                if (attrValueLength > attr.length) {
                    max_sep = attrValueLength - attr.length;
                    for (var i = 0; i < max_sep; i++) {
                        str = str + " ";
                    }
                }
            } else {
                str = str + attr;
            }
            j++;
        }
        str = str + "\n";
        for (var attr in info) {
            str = str + info[attr] + "   ";
            if (isNaN(info[attr])) {
                attrValueLength = info[attr].length;
            }
            else {
                attrValueLength = info[attr].toString().length;
            }
            if (attr.length > attrValueLength) {
                max_sep = attr.length - attrValueLength;
                for (var i = 0; i < max_sep; i++) {
                    str = str + " ";
                }
            }
        }
        return str
    };
    $scope.downloadTabulated = function (info, title) {
        var str = "";
        var a = $('<a></a>')[0];
        str = $scope.convertToTabulate(info);

        $(a).attr('href', 'data:text/plain,' + encodeURIComponent(str));
        $(a).attr('download', title + 'json');
        a.click();
    };
    //--------the initial result----------
//    $scope.setResult(false);
    $scope.newResult();


//    $('#genesGV').attr('width','860px'); //no existe aun
//    $('#ocb-gv-w').css('width', '=870px');

}]);

genesContr.$inject = ['$scope', 'mySharedService'];
