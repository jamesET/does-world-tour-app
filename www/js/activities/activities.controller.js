(function(){
  'use strict';

  angular
      .module('app.activities')
      .controller('ActivitiesController', ActivitiesController );

  ActivitiesController.$inject = ['$scope','$filter','ActivityFeed','session'];
  function ActivitiesController ($scope,$filter,ActivitesFeed,session) {
    $scope.currPage;
    $scope.hasNextPage;
    $scope.activities;
    $scope.filterUserId;
    $scope.filterNews;
    $scope.activeFilter;
    $scope.loadFirstPage = loadFirstPage;
    $scope.loadNextPage = loadNextPage;
    $scope.meFilter = meFilter;
    $scope.noFilter = noFilter;
    $scope.announceFilter = announceFilter;

    activate();

    function activate() {
      $scope.currPage = 0;
      $scope.hasNextPage = false;
      $scope.activities = [];
      $scope.filterUserId = 0;
      $scope.filterNews = false;
      $scope.activeFilter = 'none';
      refresh();
    }

    function refresh() {
      $scope.activities = [];
      $scope.currPage = 0;
      $scope.hasNextPage = false;
      loadFirstPage();
    }

    function loadFirstPage() {
      ActivitesFeed.getPage(1,$scope.filterUserId,$scope.filterNews)
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

      ActivitesFeed.getPage(nextPage,$scope.filterUserId,$scope.filterNews)
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

    function meFilter() {
      var user = session.getUserData();
      console.log('Go get the results for user id ' + user.id);
      $scope.activeFilter = 'me';
      $scope.filterUserId = user.id;
      $scope.filterNews = false;
      refresh();
    }

    function noFilter() {
      console.log('Refresh list with no filter');
      $scope.activeFilter = 'none';
      $scope.filterUserId = 0;
      $scope.filterNews = false;
      refresh();

    }

    function announceFilter() {
      console.log('Filter for announcements only');
      $scope.activeFilter = 'news';
      $scope.filterUserId = 0;
      $scope.filterNews = true;
      refresh();
    }


  }

})();
