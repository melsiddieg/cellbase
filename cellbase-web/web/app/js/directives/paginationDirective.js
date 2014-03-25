myApp.directive('pagination', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            data: '=info',
            id: '@ident'
        },
        templateUrl: './views/widgets/pagination.html',
        controller: function ($scope, $rootScope) {

            $scope.paginationData = [];

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

            //========================Pagination==================================
            $scope.goToFirstPage = function () {
                $scope.paginationNumbers[0] = 1;
                $scope.paginationNumbers[1] = 2;
                $scope.paginationNumbers[2] = 3;
                $scope.firstPages = false;
                $scope.previousPage = false;
                $scope.nextPage = true;
                $scope.lastPages = true;
                $rootScope.$broadcast($scope.id+':collapseTreeElements');

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
                $rootScope.$broadcast($scope.id+':collapseTreeElements');
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
                $rootScope.$broadcast($scope.id+':collapseTreeElements');
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
                $rootScope.$broadcast($scope.id+':collapseTreeElements');
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
                $rootScope.$broadcast($scope.id+':collapseTreeElements');
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
                    geneId = Object.keys($scope.data)[i];
                    if (Object.keys($scope.data)[i] != null) {
                        $scope.paginationData.push($scope.data[geneId]);
                    }
                }
                $rootScope.$broadcast($scope.id+':updatePaginationData', $scope.paginationData);
            };
            $scope.initPagination = function () {
                $scope.paginationData = [];
                $scope.maxNumberPagination = Math.ceil(Object.keys($scope.data).length / $scope.numDataPerPage);

                //  0 --> 10
                if (Object.keys($scope.data).length <= $scope.numDataPerPage) {
                    for (var i in $scope.data) {
                        $scope.paginationData.push($scope.data[i]);
                    }
                    $scope.showPagination = false;
                }
                // 11 --> 20
                else if (Object.keys($scope.data).length <= ($scope.numDataPerPage * 2)) {
                    $scope.simplePagination = true;
                    for (var i = 0; i < $scope.numDataPerPage; i++) {
                        geneId = Object.keys($scope.data)[i];
                        if (Object.keys($scope.data)[i] != null) {
                            $scope.paginationData.push($scope.data[geneId]);
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
                // 21 --> ...
                else {
                    $scope.simplePagination = false;
                    var geneId;

                    for (var i = 0; i < $scope.numDataPerPage; i++) {
                        geneId = Object.keys($scope.data)[i];
                        if (Object.keys($scope.data)[i] != null) {
                            $scope.paginationData.push($scope.data[geneId]);
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
                $rootScope.$broadcast($scope.id+':updatePaginationData', $scope.paginationData);
            };

            $scope.$on($scope.id+':initPagination', function (event, data) {
                $scope.data = data;
                $scope.initPagination();
            });
            $scope.initPagination();
        }
    }
});