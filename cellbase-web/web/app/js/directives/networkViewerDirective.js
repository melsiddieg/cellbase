genesModule.directive('genesNetworkViewer', function () {
    return {
        restrict: 'E',
        replace: false,
        transclude: true,
        scope: {
            targetId: '@id'
        },
        controller: function ($scope, $rootScope) {

            $scope.$on($scope.targetId + ':geneProteins', function (event, geneProteinId, proteinsIdLinks) {

                $scope.networkViewer.clean();

                var graph = new Graph();

                var geneProteinV = new Vertex({
                    id: geneProteinId
                });
                graph.addVertex(geneProteinV);


                for (var i in proteinsIdLinks) {
                    var proteinV = new Vertex({
                        id: proteinsIdLinks[i]
                    });
                    graph.addVertex(proteinV);

                    /** create edge **/
                    var edgeId = geneProteinId + '_' + 'pp' + '_' + proteinsIdLinks[i];
                    var edge = new Edge({
                        id: edgeId,
                        relation: 'pp',
                        source: geneProteinV,
                        target: proteinV,
                        weight: 1,
                        directed: true
                    });
                    graph.addEdge(edge);
                }

                $scope.networkViewer.setGraph(graph);
                $scope.networkViewer.setLayout('Force directed');


            });

            $scope.networkViewer = new NetworkViewer({
                targetId: $scope.targetId,
                autoRender: true,
                sidePanel: false,
                overviewPanel: false
            });
            $scope.networkViewer.draw();
//            $scope.networkViewer.clean();

            //TEST resference
            nvtest = $scope.networkViewer;
//            $scope.networkViewer.networkSvgLayout.createVertex(200,300);
        }
    }
});