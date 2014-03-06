/**
 * Created by jag on 06/03/2014.
 */
var proteinCtrl = myApp.controller('proteinCtrl', ['$scope', '$rootScope', 'mySharedService', 'CellbaseService', function ($scope, $rootScope, mySharedService, CellbaseService) {
    $scope.specie = mySharedService.genesSpecie;

}]);

proteinCtrl.$inject = ['$scope', 'mySharedService'];
