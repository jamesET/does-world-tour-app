(function() {
    'use strict';

    angular
        .module('app.verifybeer')
        .controller('VerifyListController', VerifyListController);

    VerifyListController.$inject = ['$scope','$interval','BeerListService','logger'];

    /* @ngInject */
    function VerifyListController($scope,$interval,BeerListService,logger) {
        var vm = this;
        $scope.drinksToVerify = {};
        $scope.refresh = refresh;
        $scope.verifyBeer = verifyBeer;
        $scope.rejectBeer = rejectBeer;
        $scope.verifyAll = verifyAll;
        $scope.isListEmpty = true;

        $scope.refresh();

        $scope.$on('$ionicView.enter', function(e) {
            $scope.istListEmpty = true;
            $scope.refresh();
            vm.autoRefresh = $interval(refresh,10000);
        } );

        $scope.$on('$ionicView.leave', function(e) {
            $interval.cancel(vm.autoRefresh);
            vm.autoRefresh = null;
        });

        function refresh() {
            BeerListService.getDrinksToVerify()
              .then(function(response){
                $scope.drinksToVerify = response.data.beers;
                logger.log('getDrinksToVerify refreshed. ');
                if (countProperties($scope.drinksToVerify) > 0) {
                    $scope.isListEmpty = false;
                }
              });
        }

        function verifyBeer(listId,beerOnListId) {
          BeerListService.verifyBeer(listId,beerOnListId)
            .then(function() {
                $scope.refresh();
            });
        }

        function verifyAll() {
          BeerListService.verifyAll()
            .then(function() {
                $scope.refresh();
            });
        }

        function rejectBeer(listId,beerOnListId) {
          BeerListService.rejectBeer(listId,beerOnListId)
            .then(function() {
                $scope.refresh();
            });
        }

        function countProperties(obj) {
          return Object.keys(obj).length;
        }

    }
})();
