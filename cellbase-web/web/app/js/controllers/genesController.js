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

    $scope.setLoading = function (loading) {
        $scope.isLoading = loading;
    }
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
    };
    $scope.addBiotypeFilter = function (biotype) {
        var pos = $scope.biotypesFilter.indexOf(biotype);
        if (pos == -1) {
            $scope.biotypesFilter.push(biotype);
        }
        else {
            $scope.biotypesFilter.splice(pos, 1);
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
    $scope.selectAllBiotypeFilter = function () {
        for (var i in $scope.listOfbiotypeFilters) {
            $scope.biotypesFilter.push($scope.listOfbiotypeFilters[i]);
        }
    };
    $scope.deselectAllBiotypeFilter = function () {
        $scope.biotypesFilter = [];
    };
    $scope.reload = function () {
        $scope.init();
        $scope.setSpecie();
        $scope.regions = "20:32850000-33500000,2:12850000-13120000";
        $scope.newResult();
    };
    $scope.clearAll = function () {
        $scope.showAll = false;
    };
    $scope.clear = function () {
        $scope.showGenePanel = false;
        $scope.showTranscriptPanel = false;
    };
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
    $scope.convertToTabulate = function (info) {
        return mySharedService.convertToTabulate(info);
    };
    //---------------Events-------------------
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
    $scope.setResult(false);
}]);

genesContr.$inject = ['$scope', 'mySharedService'];