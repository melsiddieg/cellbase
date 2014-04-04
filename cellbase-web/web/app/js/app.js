var genesModule = angular.module('cellbaseWeb.genes', []);
var variantsModule = angular.module('cellbaseWeb.variants', []);
var regulationsModule = angular.module('cellbaseWeb.regulations', []);

var myApp = angular.module('cellbaseWeb',
    [
        'cellbaseWeb.genes',
        'cellbaseWeb.variants',
        'cellbaseWeb.regulations'
    ]);

myApp.factory('mySharedService', function($rootScope, CellbaseService){
    var sharedService = {};
    sharedService.currentSpecie =  {longName: "Homo sapiens", shortName:"hsapiens", ensemblName: "Homo_sapiens"};

    sharedService.getChromNamesSpecie = function(specie){
        this.chromAllData = CellbaseService.getSpecieChromosomes(specie.shortName);

        var chromNames = [];
        for (var i in this.chromAllData) {
            chromNames.push(this.chromAllData[i].name);
        }
        chromNames = this.sortChromosomes(chromNames);
        //homo sapiens has two Y chromosomes, so delete the last one
        if (specie.shortName == "hsapiens") {
            chromNames.pop();
        }
        return chromNames;
    };
    //sort the chromosomes, to use the function sort, it has to put a zero in the left if the number have one digit
    sharedService.sortChromosomes = function (chromNames) {
        for (var i in chromNames) {
            if (!isNaN(chromNames[i])) {
                if (chromNames[i].length == 1) {
                    chromNames[i] = 0 + chromNames[i];
                }
            }
        }
        chromNames = chromNames.sort();

        for (var i in chromNames) {
            if (chromNames[i][0] == "0") {
                chromNames[i] = chromNames[i].replace("0", "");
            }
        }
        return chromNames;
    };
    //the initial chromosomes
    sharedService.chromNames = sharedService.getChromNamesSpecie(sharedService.currentSpecie);

    sharedService.getChromNames = function(){
        return this.chromNames;
    };
    sharedService.getChromAllData = function(){
        return this.chromAllData;
    };
    sharedService.getCurrentSpecie = function(){
        return this.currentSpecie;
    };
    //-----------------Events--------------------
    sharedService.broadcastSpecie = function(specie){
        this.currentSpecie = specie;
        this.chromNames = this.getChromNamesSpecie(specie);
        if(specie.data.search("variation") == -1){
            if(!$('#variationDiv').hasClass("disabled")){
                $('#variationDiv').addClass("disabled");
            }
        }
        else{
            if($('#variationDiv').hasClass("disabled")){
                $('#variationDiv').removeClass("disabled");
            }
        }
        if(specie.data.search("regulation") == -1){
            if(!$('#regulationDiv').hasClass("disabled")){
                $('#regulationDiv').addClass("disabled");
            }
        }
        else{
            if($('#regulationDiv').hasClass("disabled")){
                $('#regulationDiv').removeClass("disabled");
            }
        }
        if(this.currentSpecie.shortName != "hsapiens"){
            $('#myTab a:first').tab('show');
        }

        $rootScope.$broadcast('newSpecie');
    };
    //-------------- Cheks functions ------------------
    sharedService.removeSpaces = function (data) {
        var espacio = data.search(" ");

        while (espacio != -1) {
            data = data.slice(0, espacio) + data.slice(espacio + 1, data.length);
            espacio = data.search(" ");
        }
        return data;
    };
    sharedService.mergeChromosomesAndRegions = function (chromSelected, regions, chromAllData) {
        var completeChromosome = true;
        var totalChromosomes = [];
        var completeRegion;

        if (regions != "") {
            regions = this.checkCorrectRegions(regions,chromAllData);
        }
        if (chromSelected.length == 0) {
            completeRegion = regions;
        }
        else if (regions.length == 0) {
            completeRegion = chromSelected.join();
        }
        else {
            //the variable regions has to be a sting to show it in an input, but for more facilities create an array with this information
            var arrayOfRegions = regions.split(",");
            //obtain the chromosomes that don't appear in a region
            for (var i in chromSelected) {
                for (var j in arrayOfRegions) {
                    if (arrayOfRegions[j].substring(0, arrayOfRegions[j].search(":")) == chromSelected[i])
                        completeChromosome = false
                }
                if (completeChromosome) {
                    totalChromosomes.push(chromSelected[i]);
                }
                completeChromosome = true;
            }
            if (totalChromosomes.length == 0) {
                completeRegion = regions;
            }
            else {
                completeRegion = totalChromosomes.join() + "," + regions;
            }
        }
        return completeRegion;
    };
    sharedService.checkCorrectRegions = function (regions, chromAllData) {
        var regions = regions.split(",");
        var correctRegions = [];
        var incorrectRegions = [];
        var chrom, start, end;
        var posDoublePoints, posLine;
        var correct = true;
        var chromExist = false;
        var messageError = "";
        var outOfRange = false;

        for (var i in regions) {
            posDoublePoints = regions[i].search(":");
            posLine = regions[i].search("-");
            if (posDoublePoints == -1 || posLine == -1) {
                correct = false;
            }
            else {
                chrom = regions[i].slice(0, posDoublePoints);
                start = regions[i].slice(posDoublePoints + 1, posLine);
                end = regions[i].slice(posLine + 1, regions[i].length);
                //check if the chromosome exist
                for (var k in chromAllData) {
                    if (chromAllData[k].name == chrom) {
                        chromExist = true;
                    }
                }
                if (!chromExist) {
                    correct = false;
                }
                else {
                    chromExist = false;
                    //check if start and end are numbers
                    if (isNaN(start) || isNaN(end)) {
                        correct = false;
                    }
                    else if (parseInt(start) > parseInt(end)) {
                        correct = false;
                    }
                    else {
                        //check if the region is in the range
                        if (!this.checkRegionInRange(chrom, start, end, chromAllData)) {
                            correct = false;
                            outOfRange = true;
                            alert(regions[i] + " is out of range");
                        }
                    }
                }
            }
            if (correct) {
                correctRegions.push(regions[i]);
            }
            else {
                if(!outOfRange){
                    incorrectRegions.push(regions[i]);
                }
                else{
                    outOfRange = false;
                }
                correct = true;
            }
        }
        if (incorrectRegions.length != 0) {
            messageError = incorrectRegions[0];
            for (var i = 1; i < incorrectRegions.length; i++) {
                messageError = messageError + ", " + incorrectRegions[i];
            }
            messageError = messageError + " incorrect";
            alert(messageError);
        }
        return correctRegions.join();
    };
    sharedService.checkRegionInRange = function (chrom, start, end, chromAllData) {
        for (var i in chromAllData) {
            if (chromAllData[i].name == chrom) {
                if (start >= chromAllData[i].start && end <= chromAllData[i].end) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };
    sharedService.convertToTabulate = function (info) {
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
    return sharedService;
})