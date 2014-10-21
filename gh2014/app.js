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

    app.controller('ItemsCtrl', ['$rootScope', '$scope', '$window', '$location', function ($rootScope, $scope, $window, $location) {
        $scope.$watch('movieData', function (nV) {
            if (!nV) {
                return;
            }
            $scope.items = nV.items;
            $scope.groups = createGroups($scope.items);

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

            retrieveAdded();
        });

        $scope.predicate = '';

        $scope.addMovie = function (item) {
            var added = false;
            angular.forEach($scope.chosen, function (v, k) {
                if (v == item) {
                    added = true;
                }
            });
            if (added) {
                alert('Already added this movie');
            } else {
                $scope.chosen.push(item);
                item.chosen = true;
                organizeChosen($scope.chosen);
            }
        };

        $scope.rmMovie = function (item) {
            if(confirm(item.CTITLE + ', remove this movie?')) {
                $scope.chosen.splice($scope.chosen.indexOf(item), 1);
                item.conflict = false;
                item.chosen = false;
                organizeChosen($scope.chosen);
            }
        };

        $scope.print = function () {
            $window.print();
        };

        $scope.chosen = [];

        $scope.link = function () {
            return $location.absUrl();
        };

        $scope.share = function () {
            $scope.showLink = !$scope.showLink;
        };

        function createGroups (items) {
            var groups = {};
            angular.forEach(items, function (item) {
                var key = item.CTITLE;
                if (!groups[key]) {
                    groups[key] = {
                        CTITLE: item.CTITLE,
                        ETITLE: item.ETITLE,
                        CATEGORY: item.CATEGORY,
                        items: []
                    };
                }
                groups[key].items.push(item);
            });

            // return array so ng-repeat is able to do sorting and filtering.
            return Object.keys(groups).map(function(k){return groups[k]});
        }

        function sortFunction(a, b) {
            var startA = (new Date(a.START_DATETIME)).getTime(),
                startB = (new Date(b.START_DATETIME)).getTime();
            return startA - startB;
        }

        function timeConflict(a, b) {
            if (!a || !b) {
                return;
            }
            var startA = (new Date(a.START_DATETIME)).getTime(),
                startB = (new Date(b.START_DATETIME)).getTime(),
                endA = (new Date(a.END_DATETIME)).getTime(),
                endB = (new Date(b.END_DATETIME)).getTime();
            return ((startA <= startB) && (startB <= endA))
                || ((startA <= endB) && (endB <= endA))
                || ((startB <= startA) && (startA <= endB))
                || ((startB <= endA) && (endA <= endB));
        }

        function retrieveAdded () {
            var list, param = $location.search();
            if (!param || !param.movs) {
                // no query string for movs, return
                return;
            }
            list = param.movs.split(',');
            try {
                angular.forEach(list, function (idx) {
                    $scope.items[idx].chosen = true;
                    $scope.chosen.push($scope.items[idx]);
                });
                organizeChosen($scope.chosen);
            } catch (e) {
                console.log('exception occurs when parsing query string');
            }
        }

        function organizeChosen(array) {
            var i, prev, next, idx;
            array.sort(sortFunction);
            for (i = 0; i < array.length; i = i + 1) {
                prev = array[i - 1];
                next = array[i + 1];
                array[i].conflict = timeConflict(array[i], prev) || timeConflict(array[i], next);
            }
            idx = []
            angular.forEach(array, function (item) {
                idx.push($scope.items.indexOf(item));
            });
            $location.search('movs', idx.join(','));
        }
    }]);
})(window, angular);
