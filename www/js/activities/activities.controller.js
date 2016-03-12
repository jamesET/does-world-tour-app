(function(){
  'use strict';

  angular
      .module('app.activities')
      .controller('ActivitiesController', ActivitiesController );

  ActivitiesController.$inject = ['$scope','ActivityFeed'];
  function ActivitiesController ($scope,ActivitesFeed) {
    $scope.currPage = 0;
    $scope.hasNextPage = false;
    $scope.activities = [];
    $scope.loadFirstPage = loadFirstPage;
    $scope.loadNextPage = loadNextPage;

    activate();

    function activate() {
      $scope.currPage = 0;
      $scope.hasNextPage = false;
      loadFirstPage();
    }

    function loadFirstPage() {
      ActivitesFeed.getPage(1)
        .then(pageLoaded)
        .finally(function(){
              $scope.$broadcast('scroll.refreshComplete');
        });

      function pageLoaded(response) {
        $scope.currPage = response.pageNumber;
        $scope.hasNextPage = response.hasNextPage;
        $scope.activities = response.activities;
      }
    }

    function loadNextPage() {
      if (!$scope.hasNextPage) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }

      var nextPage = $scope.currPage + 1;

      ActivitesFeed.getPage(nextPage)
        .then(pageLoaded)
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });

      function pageLoaded(response) {
        var newActivities = response.activities;
        $scope.currPage = response.pageNumber;
        $scope.hasNextPage = response.hasNextPage;
        $scope.activities = $scope.activities.concat(newActivities);
      }
    }
  }

})();
