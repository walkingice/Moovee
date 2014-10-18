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
        });
    }]);
})(window, angular);
