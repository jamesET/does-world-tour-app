(function(){
  'use strict';

  angular
      .module('app.beers')
      .controller('BeersController', BeersController );

  BeersController.$inject = ['$scope','$ionicModal','BeerService'];
  function BeersController ($scope,$ionicModal,BeerService) {

    $scope.allBeers = {};
    $scope.beer = {};

    $scope.closeModal = closeModal;
    $scope.openModal = openModal;
    $scope.refresh = refresh;
    $scope.save = save;

    activate();

    function activate() {

      $ionicModal.fromTemplateUrl('templates/beerForm.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      // initially load a copy of beers from file, we might be off the network
      BeerService.loadStaticBeersCache();

      refresh();
    }

    function refresh() {
        BeerService.getBeers()
          .then(getBeersComplete,getBeersFailed)
          .finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
          });

          function getBeersComplete(response) {
            if (response) {
              $scope.allBeers = response.beers;
            }
          }

          function getBeersFailed(reason) {
            conole.log("geetBeefsFailed " + reason);
          }
    }

    function openModal(targetBeer) {
      if (targetBeer) {
        $scope.beer = targetBeer;
      } else {
        $scope.beer = {};
      }
      $scope.modal.show();
    }

    function save() {
      if ($scope.beer.id) {
        // this is an update
        BeerService
          .update($scope.beer)
          .then(changeDone);
      } else {
          BeerService
            .add($scope.beer)
            .then(changeDone);
      }

      function changeDone() {
          $scope.modal.hide();
          $scope.refresh();
      }
    }

    function closeModal() {
        $scope.modal.hide();
    }

  }


})();
