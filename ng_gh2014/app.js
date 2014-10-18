(function(window, angular) {
    var app = angular.module('mooveeApp', []);

    app.run(['$rootScope', '$http', function ($rs, $http) {
        var promise = $http.get('data/gh2014.json');
        $rs.loading = true;
        promise.success(function (data, status) {
            $rs.loading = false;
            $rs.movieData = data;
        });

        promise.error(function (data, status) {
            $rs.loading = false;
        });
    }]);

    app.controller('ItemsCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $scope.$watch('movieData', function (nV) {
            if (!nV) {
                return;
            }
            $scope.items = nV.items;

            $scope.filterOpts = [];

            /* we want to filter by category */
            var keys = {}
            angular.forEach($scope.items, function (v, k) {
                keys[v.CATEGORY] = true;
            });
            angular.forEach(keys, function (v, k) {
                $scope.filterOpts.push(k);
            });

             /* we want to filter by date */
            keys = {}
            angular.forEach($scope.items, function (v, k) {
                keys[v.DATE] = true;
            });
            angular.forEach(keys, function (v, k) {
                $scope.filterOpts.push(k);
            });

             /* we want to filter by location */
            var pattern = /(.+?)[\d\b]/;
            keys = {}
            angular.forEach($scope.items, function (v, k) {
                var match = v.PLACE.match(pattern);
                if (match.length > 1) {
                    keys[match[1]] = 'place';
                }
            });
            angular.forEach(keys, function (v, k) {
                $scope.filterOpts.push(k);
            });
        });

        $scope.predicate = '';
    }]);
})(window, angular);
