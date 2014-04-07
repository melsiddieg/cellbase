genesModule.directive('genesNetworkViewer', function () {
    return {
        restrict: 'E',
        replace: false,
        transclude: true,
        scope: {
            targetId: '@id'
        },
        link: function(scope, element, attrs) {
//            $(window).resize(function() {
//                scope.networkViewer.networkSvgLayout.setSize($("#genesResultContent")[0].offsetWidth-10, $("#genesResultContent")[0].offsetHeight-10);
//            })
//            scope.networkViewer.networkSvgLayout.setSize($("#genesResultContent")[0].offsetWidth-4, 475);
            $(window).resize(function() {
                scope.networkViewer.resize();
            })
            scope.networkViewer.resize();
        },

        controller: function ($scope, $rootScope) {
            $scope.$on($scope.targetId + ':createStarGraph', function (event, centerVertex, verticesLinked) {
                $scope.networkViewer.clean();
                var graph = new Graph();
                var center = new Vertex({
                    id: centerVertex
                });
                graph.addVertex(center);
                for (var i in verticesLinked) {
                    var other = new Vertex({
                        id: verticesLinked[i]
                    });
                    graph.addVertex(other);
                    /** create edge **/
                    var edgeId = centerVertex + '_' + 'pp' + '_' + verticesLinked[i];
                    var edge = new Edge({
                        id: edgeId,
                        relation: 'pp',
                        source: center,
                        target: other,
                        weight: 1,
                        directed: true
                    });
                    graph.addEdge(edge);
                }
                $scope.networkViewer.setGraph(graph);
                $scope.networkViewer.setLayout('Force directed');
            });
            $scope.$on($scope.targetId + ':clear', function () {
                $scope.networkViewer.clean();
            });
                $scope.networkViewer = new NetworkViewer({
                targetId: $scope.targetId,
                autoRender: true,
                sidePanel: false,
                overviewPanel: false
            });
            $scope.networkViewer.draw();
            $scope.networkViewer.clean();
        }
    }
});